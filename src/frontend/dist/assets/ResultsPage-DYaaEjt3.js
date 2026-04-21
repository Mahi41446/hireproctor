import { r as reactExports, j as jsxRuntimeExports, b as cn, d as useParams, a as useNavigate, A as AuthContext, S as Skeleton } from "./index-CwS_SVxk.js";
import { u as useBackend, B as Badge } from "./useBackend-Dw81yuSP.js";
import { c as createLucideIcon, B as Button } from "./shield-dCwcTvrC.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-Rvghi0cc.js";
import { P as Primitive } from "./index-cKvzuIse.js";
import { m as apiGetExamResult, n as apiListSessions, o as apiGetExam, d as apiListQuestions } from "./backend-CRXSMnqx.js";
import { L as Layout, H as House } from "./Layout-DkK-V-fI.js";
import { P as ProtectedRoute } from "./ProtectedRoute-RaFsVsFM.js";
import { C as Clock } from "./clock-D0QEfep7.js";
import { C as CircleCheck } from "./circle-check-Dh9IQsXB.js";
import { T as TriangleAlert, C as Camera } from "./triangle-alert-B8-PBqEF.js";
import "./useAuth-C_DTOY2T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m14.5 12.5-5-5", key: "1jahn5" }],
  ["path", { d: "m9.5 12.5 5-5", key: "1k2t7b" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["path", { d: "M12 17v4", key: "1riwvh" }],
  ["path", { d: "M8 21h8", key: "1ev6f3" }]
];
const MonitorX = createLucideIcon("monitor-x", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function formatDuration(secs) {
  const s = Number(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
function formatDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function pct(correct, total) {
  if (total === 0n) return "—";
  return `${Math.round(Number(correct) / Number(total) * 100)}%`;
}
function ScoreHero({ result }) {
  const total = Number(result.totalQuestions);
  const correct = Number(result.totalCorrect);
  const percentage = total > 0 ? Math.round(correct / total * 100) : 0;
  const passed = result.passed;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-2",
      style: {
        borderColor: passed ? "oklch(0.72 0.18 142)" : "oklch(0.55 0.2 30)"
      },
      "data-ocid": "results.score_card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-8 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center md:items-start justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground uppercase tracking-widest mb-2", children: "Total Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-7xl font-display font-bold text-foreground leading-none", children: correct }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-display text-muted-foreground", children: [
              "/ ",
              total
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-display font-semibold text-muted-foreground mt-1", children: [
            percentage,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center md:items-end gap-3", children: [
          passed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-6 py-3 rounded-lg",
              style: { background: "oklch(0.95 0.06 142)" },
              "data-ocid": "results.pass_badge",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheck,
                  {
                    className: "w-6 h-6",
                    style: { color: "oklch(0.5 0.18 142)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xl font-display font-bold tracking-wide",
                    style: { color: "oklch(0.38 0.14 142)" },
                    children: "PASS"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-6 py-3 rounded-lg",
              style: { background: "oklch(0.96 0.05 30)" },
              "data-ocid": "results.fail_badge",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleX,
                  {
                    className: "w-6 h-6",
                    style: { color: "oklch(0.55 0.2 30)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xl font-display font-bold tracking-wide",
                    style: { color: "oklch(0.42 0.18 30)" },
                    children: "FAIL"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Time taken:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatDuration(result.timeTakenSecs) })
          ] })
        ] })
      ] }) })
    }
  );
}
const DIFF_ROWS = [
  { label: "Easy", key: "easy", color: "oklch(0.72 0.18 142)" },
  { label: "Medium", key: "medium", color: "oklch(0.72 0.18 75)" },
  { label: "Hard", key: "hard", color: "oklch(0.72 0.18 30)" },
  { label: "Expert", key: "expert", color: "oklch(0.52 0.2 295)" }
];
function DifficultyTable({ breakdown, questions }) {
  const countByDiff = (key) => questions.filter((q) => q.difficulty === key).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "results.difficulty_table", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Score Breakdown by Difficulty" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Correct" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right font-semibold", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold pl-6", children: "Progress" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: DIFF_ROWS.map(({ label, key, color }) => {
        const correct = breakdown[key];
        const total = BigInt(countByDiff(key));
        const pctVal = total > 0n ? Math.round(Number(correct) / Number(total) * 100) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: label }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-foreground", children: Number(correct) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-muted-foreground", children: Number(total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-semibold", children: pct(correct, total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-6 w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full transition-all duration-700",
              style: {
                width: `${pctVal}%`,
                background: color
              }
            }
          ) }) })
        ] }, key);
      }) })
    ] }) })
  ] });
}
function ProctoringFlags({ counts }) {
  const tabSwitches = Number(counts.tabSwitches);
  const noiseEvents = Number(counts.noiseEvents);
  const frames = Number(counts.framesCaptured);
  const hasViolations = tabSwitches > 0 || noiseEvents > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: hasViolations ? "border-amber-300" : "border-border",
      "data-ocid": "results.proctoring_flags",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          hasViolations ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-amber-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Proctoring Summary" }),
          hasViolations && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "ml-auto text-amber-800 border-amber-300",
              style: { background: "oklch(0.97 0.06 80)" },
              children: "Violations Detected"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg p-4 flex items-center gap-3 ${tabSwitches > 0 ? "bg-amber-50 border border-amber-200" : "bg-muted/40"}`,
              "data-ocid": "results.tab_switches",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MonitorX,
                  {
                    className: `w-8 h-8 shrink-0 ${tabSwitches > 0 ? "text-amber-500" : "text-muted-foreground"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: tabSwitches }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tab Switches" }),
                  tabSwitches > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600 font-medium mt-0.5", children: "⚠ Policy violation" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg p-4 flex items-center gap-3 ${noiseEvents > 0 ? "bg-amber-50 border border-amber-200" : "bg-muted/40"}`,
              "data-ocid": "results.noise_events",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Volume2,
                  {
                    className: `w-8 h-8 shrink-0 ${noiseEvents > 0 ? "text-amber-500" : "text-muted-foreground"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: noiseEvents }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Noise Events" }),
                  noiseEvents > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600 font-medium mt-0.5", children: "⚠ Sustained noise detected" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-4 flex items-center gap-3 bg-muted/40",
              "data-ocid": "results.camera_frames",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-8 h-8 shrink-0 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: frames }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Camera Frames" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Captured" })
                ] })
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
function QuestionDetailTable({ questions, answers }) {
  if (questions.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "results.question_table", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Question-by-Question Review" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10 font-semibold", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Question" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold w-24", children: "Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Your Answer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Correct Answer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-16 text-center font-semibold", children: "Result" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: questions.map((q, idx) => {
        const qKey = String(q.id);
        const userAnswer = answers[qKey] ?? "—";
        const isCorrect = answers[qKey] !== void 0 && answers[qKey].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        const diffLabels = {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          expert: "Expert"
        };
        const diffColors = {
          easy: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800",
          hard: "bg-orange-100 text-orange-800",
          expert: "bg-purple-100 text-purple-800"
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: isCorrect ? "bg-green-50/40" : "bg-red-50/20",
            "data-ocid": `results.question_row.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-muted-foreground text-sm", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground line-clamp-2", children: q.questionText }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-medium px-2 py-0.5 rounded-full ${diffColors[q.difficulty] ?? "bg-muted text-foreground"}`,
                  children: diffLabels[q.difficulty] ?? q.difficulty
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: userAnswer === "—" ? "text-muted-foreground italic" : "text-foreground",
                  children: userAnswer
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium text-foreground", children: q.correctAnswer }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: userAnswer === "—" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) : isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-600 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 text-destructive mx-auto" }) })
            ]
          },
          String(q.id)
        );
      }) })
    ] }) }) })
  ] });
}
function ResultsPageContent() {
  const { sessionId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { user } = reactExports.useContext(AuthContext);
  const { actor, isFetching } = useBackend();
  const [result, setResult] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [exam, setExam] = reactExports.useState(null);
  const [questions, setQuestions] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const storedAnswersRaw = typeof window !== "undefined" ? sessionStorage.getItem(`exam_answers_${sessionId}`) : null;
  const storedAnswers = storedAnswersRaw ? JSON.parse(storedAnswersRaw) : {};
  const load = reactExports.useCallback(async () => {
    if (!actor || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      const sessionIdBig = BigInt(sessionId);
      const res = await apiGetExamResult(
        actor,
        user.sessionToken,
        sessionIdBig
      );
      if (!res) {
        setError("Result not found. The exam may not have been submitted yet.");
        return;
      }
      setResult(res);
      const sessions = await apiListSessions(actor, user.sessionToken, null);
      const foundSession = sessions.find((s) => s.id === sessionIdBig);
      if (foundSession) {
        setSession(foundSession);
        const examData = await apiGetExam(
          actor,
          user.sessionToken,
          foundSession.examId
        );
        setExam(examData);
        if (examData) {
          const qs = await apiListQuestions(
            actor,
            user.sessionToken,
            examData.id
          );
          setQuestions(qs);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results.");
    } finally {
      setIsLoading(false);
    }
  }, [actor, user, sessionId]);
  reactExports.useEffect(() => {
    if (!isFetching && actor) {
      load();
    }
  }, [load, isFetching, actor]);
  const handlePrint = () => {
    window.print();
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6",
        "data-ocid": "results.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-64" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-56 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-xl" })
        ]
      }
    ) });
  }
  if (error || !result) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center",
        "data-ocid": "results.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-16 h-16 text-destructive mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-semibold text-foreground mb-2", children: "Results Not Available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mb-8", children: error ?? "No result data was found for this session." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => navigate({ to: "/" }),
              "data-ocid": "results.return_home_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4 mr-2" }),
                "Return to Home"
              ]
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 print:py-6 print:space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2",
        "data-ocid": "results.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Exam Results Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Candidate Assessment Summary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: handlePrint,
                "data-ocid": "results.print_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4 mr-2" }),
                  "Print / Save PDF"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                onClick: () => navigate({ to: "/" }),
                "data-ocid": "results.return_home_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4 mr-2" }),
                  "Home"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-muted/30", "data-ocid": "results.candidate_card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Candidate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: (user == null ? void 0 : user.role) === "candidate" ? "You" : `ID #${String((session == null ? void 0 : session.candidateId) ?? "—")}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: (exam == null ? void 0 : exam.roleTitle) ?? "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: (session == null ? void 0 : session.startTime) ? formatDate(session.startTime) : "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Time Taken" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: formatDuration(result.timeTakenSecs) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreHero, { result }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DifficultyTable,
      {
        breakdown: result.perDifficultyBreakdown,
        questions
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProctoringFlags, { counts: result.proctoringEventCounts }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionDetailTable, { questions, answers: storedAnswers }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Session ID:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: sessionId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handlePrint,
            "data-ocid": "results.print_button_bottom",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4 mr-2" }),
              "Save PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate({ to: "/" }),
            "data-ocid": "results.home_button_bottom",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4 mr-2" }),
              "Return to Home"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function ResultsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResultsPageContent, {}) });
}
export {
  ResultsPage as default
};
