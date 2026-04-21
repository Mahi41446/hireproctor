import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiLogin } from "../api/backend";
import { type backendInterface, createActor } from "../backend";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor as backendInterface | null;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutUntil === null) return;

    const tick = () => {
      const secsLeft = Math.max(
        0,
        Math.ceil((lockoutUntil - Date.now()) / 1000),
      );
      setCountdown(secsLeft);
      if (secsLeft <= 0) {
        setLockoutUntil(null);
        setError(null);
        setFailedAttempts(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lockoutUntil]);

  const isLocked = lockoutUntil !== null && countdown > 0;

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
    return `${s}s`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || isFetching || isLocked) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await apiLogin(
        actor,
        email.trim().toLowerCase(),
        password,
      );

      if (result.__kind__ === "ok") {
        const { sessionToken, userId, role } = result.ok;
        const userRole = role === "admin" ? "admin" : "candidate";
        login(sessionToken, userId, userRole);
        navigate({ to: "/" });
      } else {
        const lockedUntilSecs = result.err.lockedUntilSecs;

        if (lockedUntilSecs !== undefined && lockedUntilSecs > BigInt(0)) {
          const lockMs = Number(lockedUntilSecs) * 1000;
          setLockoutUntil(lockMs);
        } else {
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          setError(result.err.message);
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-semibold text-foreground tracking-tight">
              Hire<span className="text-primary">Proctor</span>
            </span>
          </div>
        </div>

        {/* Login card */}
        <div
          className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          data-ocid="login.card"
        >
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <LogIn className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-xl font-display font-semibold text-foreground">
                Welcome Back
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-11">
              Sign in to your HireProctor account.
            </p>
          </div>

          {/* Lockout banner */}
          {isLocked && (
            <div
              className="mx-6 mt-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3.5 flex items-start gap-3"
              data-ocid="login.lockout_state"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Account Temporarily Locked
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Too many failed attempts. Try again in{" "}
                  <span
                    className="font-mono font-semibold text-destructive tabular-nums"
                    data-ocid="login.countdown"
                  >
                    {formatCountdown(countdown)}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Attempt warning (at 2 failures, 1 remaining) */}
          {!isLocked && failedAttempts === 2 && (
            <div
              className="mx-6 mt-5 rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 flex items-start gap-2.5"
              data-ocid="login.attempt_warning"
            >
              <AlertCircle className="w-4 h-4 text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">
                <strong>Warning:</strong> 1 attempt remaining before your
                account is locked for 5 minutes.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                disabled={isLocked}
                className="h-10"
                data-ocid="login.email_input"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLocked}
                  className="h-10 pr-10"
                  data-ocid="login.password_input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-ocid="login.toggle_password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error state */}
            {!isLocked && error && (
              <div
                className="rounded-md bg-destructive/10 border border-destructive/30 px-3.5 py-2.5"
                data-ocid="login.error_state"
              >
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10"
              disabled={isSubmitting || isFetching || !actor || isLocked}
              data-ocid="login.submit_button"
            >
              {isSubmitting ? "Signing in…" : "Log In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
                data-ocid="login.register_link"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your password was provided during registration.
        </p>
      </div>
    </div>
  );
}
