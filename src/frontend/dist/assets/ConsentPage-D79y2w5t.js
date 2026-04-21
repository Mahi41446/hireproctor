import { r as reactExports, j as jsxRuntimeExports, b as cn, a as useNavigate, g as useSearch } from "./index-CwS_SVxk.js";
import { c as createLucideIcon, u as useComposedRefs, S as Shield, B as Button } from "./shield-dCwcTvrC.js";
import { C as Card, a as CardContent } from "./card-Rvghi0cc.js";
import { a as Presence, P as Primitive, u as useControllableState, c as composeEventHandlers, b as createContextScope } from "./index-DX-_QWgz.js";
import { u as usePrevious, a as useSize, M as Mic } from "./index-6Gatbk8M.js";
import { L as Layout } from "./Layout-DkK-V-fI.js";
import { P as ProtectedRoute } from "./ProtectedRoute-RaFsVsFM.js";
import { C as Camera, T as TriangleAlert } from "./triangle-alert-B8-PBqEF.js";
import { C as CircleCheckBig } from "./circle-check-big-DCFAoYz9.js";
import "./useAuth-C_DTOY2T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("monitor", __iconNode);
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
const DATA_ITEMS = [
  {
    icon: Camera,
    title: "Camera Snapshots",
    desc: "A still image is captured every 10 seconds to verify your identity and presence throughout the exam."
  },
  {
    icon: Mic,
    title: "Microphone Audio Levels",
    desc: "Background noise is analyzed every 5 seconds. Audio content is never recorded — only volume levels are checked."
  },
  {
    icon: Monitor,
    title: "Tab & Window Activity",
    desc: "The browser tab focus state is monitored. Switching away from the exam window twice will automatically submit your exam."
  }
];
function ConsentPageContent() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [cameraGranted, setCameraGranted] = reactExports.useState(false);
  const [micGranted, setMicGranted] = reactExports.useState(false);
  const [agreed, setAgreed] = reactExports.useState(false);
  const [cameraError, setCameraError] = reactExports.useState("");
  const [micError, setMicError] = reactExports.useState("");
  const examId = (search == null ? void 0 : search.examId) ?? "";
  const handleGrantCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      for (const t of stream.getTracks()) t.stop();
      setCameraGranted(true);
    } catch {
      setCameraError(
        "Camera access denied. Please allow camera in browser settings."
      );
    }
  };
  const handleGrantMic = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      for (const t of stream.getTracks()) t.stop();
      setMicGranted(true);
    } catch {
      setMicError(
        "Microphone access denied. Please allow microphone in browser settings."
      );
    }
  };
  const canProceed = cameraGranted && micGranted && agreed;
  const handleStart = () => {
    if (!canProceed || !examId) return;
    navigate({
      to: "/exam/$sessionId",
      params: { sessionId: `new-${examId}` }
    });
  };
  const handleDecline = () => {
    navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-7 h-7 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-semibold text-foreground mb-2", children: "Enable Proctoring to Continue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-md mx-auto leading-relaxed", children: "To maintain exam integrity, this session requires camera and microphone access. Please review what is collected and grant the required permissions below." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "mb-6 border-border",
        "data-ocid": "consent.data_notice_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 pb-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-3", children: "What data is collected" }),
          DATA_ITEMS.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed mt-0.5", children: desc })
            ] })
          ] }, title)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-start p-3 rounded-lg bg-accent/10 border border-accent/30 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-accent-foreground shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent-foreground leading-relaxed", children: "Camera snapshots and proctoring logs are retained for up to 7 days and then automatically deleted. They are only accessible to authorized hiring administrators." })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between p-4 rounded-xl border border-border bg-card",
          "data-ocid": "consent.camera_permission_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5 text-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Camera Access" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Required for identity verification" }),
                cameraError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: cameraError })
              ] })
            ] }),
            cameraGranted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
              "Granted"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "border-accent/60 text-accent-foreground hover:bg-accent/10 text-xs gap-1.5",
                onClick: handleGrantCamera,
                "data-ocid": "consent.grant_camera_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
                  "Grant Access"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between p-4 rounded-xl border border-border bg-card",
          "data-ocid": "consent.mic_permission_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-5 h-5 text-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Microphone Access" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Required for noise level monitoring" }),
                micError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: micError })
              ] })
            ] }),
            micGranted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
              "Granted"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "border-accent/60 text-accent-foreground hover:bg-accent/10 text-xs gap-1.5",
                onClick: handleGrantMic,
                "data-ocid": "consent.grant_mic_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
                  "Grant Access"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-8 p-4 rounded-xl bg-muted/40 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Checkbox,
        {
          id: "consent-agree",
          checked: agreed,
          onCheckedChange: (v) => setAgreed(v === true),
          className: "mt-0.5",
          "data-ocid": "consent.agree_checkbox"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "consent-agree",
          className: "text-sm text-foreground leading-relaxed cursor-pointer select-none",
          children: "I understand and consent to my camera, microphone activity, and tab-switch behaviour being monitored and logged during this exam for the purpose of academic integrity."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "flex-1 gap-2",
          onClick: handleDecline,
          "data-ocid": "consent.decline_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
            "Decline & Go Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "flex-1 gap-2",
          disabled: !canProceed,
          onClick: handleStart,
          "data-ocid": "consent.start_exam_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
            "I Agree, Start Exam"
          ]
        }
      )
    ] }),
    !canProceed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-3", children: !cameraGranted || !micGranted ? "Grant both camera and microphone access to continue." : "Please check the consent box to continue." })
  ] }) });
}
function ConsentPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConsentPageContent, {}) });
}
export {
  ConsentPage as default
};
