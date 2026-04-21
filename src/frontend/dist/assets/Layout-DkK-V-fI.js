import { a as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-CwS_SVxk.js";
import { c as createLucideIcon, S as Shield, B as Button } from "./shield-dCwcTvrC.js";
import { u as useAuth } from "./useAuth-C_DTOY2T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
function Layout({ children }) {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 bg-card border-b border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center gap-2 group",
          "data-ocid": "nav.home_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-md bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-display font-semibold text-foreground tracking-tight", children: [
              "Hire",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Proctor" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: user && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            asChild: true,
            "data-ocid": "nav.admin_link",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4 mr-1.5" }),
              "Admin"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            asChild: true,
            "data-ocid": "nav.home_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4 mr-1.5" }),
              "Home"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground hidden sm:block truncate max-w-[180px]", children: (profile == null ? void 0 : profile.fullname) ?? (profile == null ? void 0 : profile.email) ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleLogout,
            className: "gap-1.5",
            "data-ocid": "nav.logout_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
            ]
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 bg-background", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " HireProctor. Professional proctored assessments."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Built with love using",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "underline hover:text-foreground transition-colors",
            children: "caffeine.ai"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  House as H,
  Layout as L,
  LayoutDashboard as a
};
