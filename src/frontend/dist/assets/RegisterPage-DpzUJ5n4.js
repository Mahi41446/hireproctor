import { u as useActor, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, c as createActor } from "./index-CwS_SVxk.js";
import { c as createLucideIcon, S as Shield, B as Button } from "./shield-dCwcTvrC.js";
import { I as Input } from "./input-BieyMbL5.js";
import { L as Label } from "./label-DA6y1put.js";
import { u as ue } from "./index-Cy-WUQLx.js";
import { b as apiRegister } from "./backend-CRXSMnqx.js";
import { C as CircleCheckBig } from "./circle-check-big-DCFAoYz9.js";
import { E as EyeOff, a as Eye } from "./eye-BH-K26bF.js";
import { C as Copy } from "./copy-dyDOVQES.js";
import "./index-cKvzuIse.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function RegisterPage() {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor;
  const navigate = useNavigate();
  const [fullname, setFullname] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [credentials, setCredentials] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actor || isFetching) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await apiRegister(
        actor,
        fullname.trim(),
        email.trim().toLowerCase()
      );
      if (result.__kind__ === "ok") {
        setCredentials({
          email: email.trim().toLowerCase(),
          password: result.ok.generatedPassword
        });
        ue.success("Account created successfully!");
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
    const text = `Email: ${credentials.email}
Password: ${credentials.password}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    ue.success("Credentials copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };
  if (credentials) {
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
          "data-ocid": "register.success_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4 flex flex-col items-center text-center border-b border-border bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground", children: "Account Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Your account is ready. Save these credentials — they won't be shown again." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 bg-accent/10 border border-accent/30 rounded-lg px-3.5 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-4 h-4 text-accent-foreground mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent-foreground leading-relaxed", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Important:" }),
                  " Store these credentials securely. The password cannot be recovered after leaving this page."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Email Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center bg-muted/40 border border-border rounded-md px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-mono text-foreground flex-1 select-all break-all",
                    "data-ocid": "register.credentials_email",
                    children: credentials.email
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Generated Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-muted/40 border border-border rounded-md px-3 py-2.5 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-sm font-mono text-foreground flex-1 select-all tracking-widest",
                      "data-ocid": "register.credentials_password",
                      children: showPassword ? credentials.password : "•".repeat(credentials.password.length)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword((v) => !v),
                      className: "text-muted-foreground hover:text-foreground transition-colors p-0.5",
                      "aria-label": showPassword ? "Hide password" : "Show password",
                      "data-ocid": "register.toggle_password",
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "w-full gap-2",
                  onClick: copyCredentials,
                  "data-ocid": "register.copy_button",
                  children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary" }),
                    " Copied!"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                    " Copy Credentials"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full",
                  onClick: () => navigate({ to: "/login" }),
                  "data-ocid": "register.continue_button",
                  children: "Continue to Login"
                }
              )
            ] })
          ]
        }
      )
    ] }) });
  }
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
        "data-ocid": "register.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground", children: "Create Your Account" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 ml-11", children: "Professional proctored hiring exams." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fullname", className: "text-sm font-medium", children: "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "fullname",
                  type: "text",
                  placeholder: "Jane Doe",
                  value: fullname,
                  onChange: (e) => setFullname(e.target.value),
                  required: true,
                  autoComplete: "name",
                  autoFocus: true,
                  className: "h-10",
                  "data-ocid": "register.fullname_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-sm font-medium", children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  placeholder: "jane@company.com",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  autoComplete: "email",
                  className: "h-10",
                  "data-ocid": "register.email_input"
                }
              )
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-md bg-destructive/10 border border-destructive/30 px-3.5 py-2.5",
                "data-ocid": "register.error_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2.5 border border-border", children: "A secure password will be generated for you. Save it immediately after account creation." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full h-10",
                disabled: isSubmitting || isFetching || !actor,
                "data-ocid": "register.submit_button",
                children: isSubmitting ? "Creating account…" : "Create Account"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
              "Already have an account?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/login",
                  className: "font-medium text-primary hover:underline",
                  "data-ocid": "register.login_link",
                  children: "Sign in"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
export {
  RegisterPage as default
};
