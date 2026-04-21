import { j as jsxRuntimeExports, S as Skeleton, N as Navigate } from "./index-CwS_SVxk.js";
import { u as useAuth } from "./useAuth-C_DTOY2T.js";
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 w-64", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" })
    ] }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  ProtectedRoute as P
};
