import { u as useActor, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, c as createActor } from "./index-CwS_SVxk.js";
import { c as createLucideIcon, S as Shield, B as Button } from "./shield-dCwcTvrC.js";
import { I as Input } from "./input-BieyMbL5.js";
import { L as Label } from "./label-DA6y1put.js";
import { a as apiLogin } from "./backend-CRXSMnqx.js";
import { u as useAuth } from "./useAuth-C_DTOY2T.js";
import { C as CircleAlert } from "./circle-alert-BCiVeYWr.js";
import { E as EyeOff, a as Eye } from "./eye-BH-K26bF.js";
import "./index-cKvzuIse.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
function LoginPage() {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [failedAttempts, setFailedAttempts] = reactExports.useState(0);
  const [lockoutUntil, setLockoutUntil] = reactExports.useState(null);
  const [countdown, setCountdown] = reactExports.useState(0);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (lockoutUntil === null) return;
    const tick = () => {
      const secsLeft = Math.max(
        0,
        Math.ceil((lockoutUntil - Date.now()) / 1e3)
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
    intervalRef.current = setInterval(tick, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lockoutUntil]);
  const isLocked = lockoutUntil !== null && countdown > 0;
  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
    return `${s}s`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actor || isFetching || isLocked) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await apiLogin(
        actor,
        email.trim().toLowerCase(),
        password
      );
      if (result.__kind__ === "ok") {
        const { sessionToken, userId, role } = result.ok;
        const userRole = role === "admin" ? "admin" : "candidate";
        login(sessionToken, userId, userRole);
        navigate({ to: "/" });
      } else {
        const lockedUntilSecs = result.err.lockedUntilSecs;
        if (lockedUntilSecs !== void 0 && lockedUntilSecs > BigInt(0)) {
          const lockMs = Number(lockedUntilSecs) * 1e3;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-display font-semibold text-foreground tracking-tight", children: [
        "Hire",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Proctor" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden",
        "data-ocid": "login.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground", children: "Welcome Back" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 ml-11", children: "Sign in to your HireProctor account." })
          ] }),
          isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mx-6 mt-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3.5 flex items-start gap-3",
              "data-ocid": "login.lockout_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-destructive shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Account Temporarily Locked" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Too many failed attempts. Try again in",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono font-semibold text-destructive tabular-nums",
                        "data-ocid": "login.countdown",
                        children: formatCountdown(countdown)
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          !isLocked && failedAttempts === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mx-6 mt-5 rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 flex items-start gap-2.5",
              "data-ocid": "login.attempt_warning",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-accent-foreground shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent-foreground leading-relaxed", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Warning:" }),
                  " 1 attempt remaining before your account is locked for 5 minutes."
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-email", className: "text-sm font-medium", children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "login-email",
                  type: "email",
                  placeholder: "jane@company.com",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  autoComplete: "email",
                  autoFocus: true,
                  disabled: isLocked,
                  className: "h-10",
                  "data-ocid": "login.email_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-password", className: "text-sm font-medium", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "login-password",
                    type: showPassword ? "text" : "password",
                    placeholder: "Enter your password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    required: true,
                    autoComplete: "current-password",
                    disabled: isLocked,
                    className: "h-10 pr-10",
                    "data-ocid": "login.password_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword((v) => !v),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                    "aria-label": showPassword ? "Hide password" : "Show password",
                    "data-ocid": "login.toggle_password",
                    children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            !isLocked && error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-md bg-destructive/10 border border-destructive/30 px-3.5 py-2.5",
                "data-ocid": "login.error_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full h-10",
                disabled: isSubmitting || isFetching || !actor || isLocked,
                "data-ocid": "login.submit_button",
                children: isSubmitting ? "Signing in…" : "Log In"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
              "Don't have an account?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/register",
                  className: "font-medium text-primary hover:underline",
                  "data-ocid": "login.register_link",
                  children: "Create one"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "Your password was provided during registration." })
  ] }) });
}
export {
  LoginPage as default
};
