import { j as jsxRuntimeExports, r as reactExports, E as ExamStatus, L as Link, S as Skeleton } from "./index-CwS_SVxk.js";
import { u as useBackend, B as Badge } from "./useBackend-Dw81yuSP.js";
import { c as createLucideIcon, S as Shield, B as Button } from "./shield-dCwcTvrC.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-Rvghi0cc.js";
import { L as Layout, a as LayoutDashboard } from "./Layout-DkK-V-fI.js";
import { P as ProtectedRoute } from "./ProtectedRoute-RaFsVsFM.js";
import { u as useAuth } from "./useAuth-C_DTOY2T.js";
import { C as CircleCheckBig } from "./circle-check-big-DCFAoYz9.js";
import { C as CircleAlert } from "./circle-alert-BCiVeYWr.js";
import { C as Clock } from "./clock-D0QEfep7.js";
import { C as ChevronRight } from "./chevron-right-gWPWLypA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
function HomePageContent() {
  const { user, isAdmin, profile } = useAuth();
  const { actor, isFetching } = useBackend();
  const [exams, setExams] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!actor || isFetching || !user) return;
    actor.listExams(user.sessionToken).then((list) => setExams(list)).catch(() => setExams([])).finally(() => setLoading(false));
  }, [actor, isFetching, user]);
  const activeExams = exams.filter((e) => e.status === ExamStatus.active);
  const draftExams = exams.filter((e) => e.status === ExamStatus.draft);
  const statusBadge = (status) => {
    switch (status) {
      case ExamStatus.active:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/30", children: "Active" });
      case ExamStatus.draft:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-muted-foreground", children: "Draft" });
      case ExamStatus.closed:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Closed" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-display font-semibold text-foreground leading-tight", children: [
          "Welcome back",
          (profile == null ? void 0 : profile.fullname) ? `, ${profile.fullname}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground text-sm", children: isAdmin ? "You have admin access. Manage exams, review candidates and configure assessments." : "Your proctored assessment portal. Start your exam when you're ready." })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          className: "ml-auto shrink-0",
          "data-ocid": "home.admin_panel_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4 mr-2" }),
            "Admin Panel"
          ] })
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "home.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] }) : isAdmin ? (
      /* Admin view */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-primary" }),
            "Active Exams",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground ml-1", children: [
              "(",
              activeExams.length,
              ")"
            ] })
          ] }),
          activeExams.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-dashed",
              "data-ocid": "home.active_exams.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-10 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 text-muted-foreground mx-auto mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No active exams. Go to Admin to create and activate one." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: "Go to Admin Panel" }) })
              ] })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: activeExams.map((exam, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "hover:border-primary/40 transition-smooth",
              "data-ocid": `home.active_exam.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: exam.roleTitle }),
                    statusBadge(exam.status)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "flex items-center gap-3 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                      exam.timerMinutes.toString(),
                      " min"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Pass: ",
                      exam.passThresholdPercent.toString(),
                      "%"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    asChild: true,
                    className: "w-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", children: [
                      "View Details",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 ml-1" })
                    ] })
                  }
                ) })
              ]
            },
            exam.id.toString()
          )) })
        ] }),
        draftExams.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            "Draft Exams",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground ml-1", children: [
              "(",
              draftExams.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: draftExams.map((exam, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "opacity-80",
              "data-ocid": `home.draft_exam.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: exam.roleTitle }),
                    statusBadge(exam.status)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                    exam.timerMinutes.toString(),
                    " min"
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    asChild: true,
                    className: "w-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: "Manage in Admin" })
                  }
                ) })
              ]
            },
            exam.id.toString()
          )) })
        ] })
      ] })
    ) : (
      /* Candidate view */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 text-primary" }),
          "Available Exams"
        ] }),
        activeExams.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border-dashed",
            "data-ocid": "home.candidate_exams.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-16 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-medium text-foreground mb-2", children: "No exams available" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm mx-auto", children: "There are no active exams at this time. Please check back later or contact your hiring manager." })
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: activeExams.map((exam, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "hover:border-primary/40 hover:shadow-md transition-smooth",
            "data-ocid": `home.exam.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-display", children: exam.roleTitle }),
                  statusBadge(exam.status)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "flex flex-wrap items-center gap-3 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                    exam.timerMinutes.toString(),
                    " minutes"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
                    "Pass: ",
                    exam.passThresholdPercent.toString(),
                    "%"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Camera and microphone monitoring will be active. Make sure you are in a quiet, well-lit environment." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    className: "w-full gap-2",
                    "data-ocid": `home.start_exam_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/consent",
                        search: { examId: exam.id.toString() },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
                          "Start Exam"
                        ]
                      }
                    )
                  }
                )
              ] })
            ]
          },
          exam.id.toString()
        )) })
      ] })
    )
  ] }) });
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HomePageContent, {}) });
}
export {
  HomePage as default
};
