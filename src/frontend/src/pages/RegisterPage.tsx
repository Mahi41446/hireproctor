import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { apiRegister } from "../api/backend";
import { type backendInterface, createActor } from "../backend";

interface Credentials {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor as backendInterface | null;
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || isFetching) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await apiRegister(
        actor,
        fullname.trim(),
        email.trim().toLowerCase(),
      );
      if (result.__kind__ === "ok") {
        setCredentials({
          email: email.trim().toLowerCase(),
          password: result.ok.generatedPassword,
        });
        toast.success("Account created successfully!");
      } else {
        setError(result.err.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = async () => {
    if (!credentials) return;
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credentials copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  if (credentials) {
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

          {/* Success card */}
          <div
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            data-ocid="register.success_state"
          >
            {/* Success header */}
            <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center border-b border-border bg-muted/30">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display font-semibold text-foreground">
                Account Created
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is ready. Save these credentials — they won't be
                shown again.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Warning notice */}
              <div className="flex items-start gap-2.5 bg-accent/10 border border-accent/30 rounded-lg px-3.5 py-3">
                <KeyRound className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-accent-foreground leading-relaxed">
                  <strong>Important:</strong> Store these credentials securely.
                  The password cannot be recovered after leaving this page.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Email Address
                </Label>
                <div className="flex items-center bg-muted/40 border border-border rounded-md px-3 py-2.5">
                  <span
                    className="text-sm font-mono text-foreground flex-1 select-all break-all"
                    data-ocid="register.credentials_email"
                  >
                    {credentials.email}
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Generated Password
                </Label>
                <div className="flex items-center bg-muted/40 border border-border rounded-md px-3 py-2.5 gap-2">
                  <span
                    className="text-sm font-mono text-foreground flex-1 select-all tracking-widest"
                    data-ocid="register.credentials_password"
                  >
                    {showPassword
                      ? credentials.password
                      : "•".repeat(credentials.password.length)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    data-ocid="register.toggle_password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Copy button */}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={copyCredentials}
                data-ocid="register.copy_button"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-primary" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Credentials
                  </>
                )}
              </Button>

              {/* Continue to login */}
              <Button
                className="w-full"
                onClick={() => navigate({ to: "/login" })}
                data-ocid="register.continue_button"
              >
                Continue to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Registration card */}
        <div
          className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          data-ocid="register.card"
        >
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-xl font-display font-semibold text-foreground">
                Create Your Account
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-11">
              Professional proctored hiring exams.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullname" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Jane Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                autoComplete="name"
                autoFocus
                className="h-10"
                data-ocid="register.fullname_input"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10"
                data-ocid="register.email_input"
              />
            </div>

            {/* Error state */}
            {error && (
              <div
                className="rounded-md bg-destructive/10 border border-destructive/30 px-3.5 py-2.5"
                data-ocid="register.error_state"
              >
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Info about password generation */}
            <p className="text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2.5 border border-border">
              A secure password will be generated for you. Save it immediately
              after account creation.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10"
              disabled={isSubmitting || isFetching || !actor}
              data-ocid="register.submit_button"
            >
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
                data-ocid="register.login_link"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
