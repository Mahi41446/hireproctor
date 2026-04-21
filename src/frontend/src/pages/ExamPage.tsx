import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Mic,
  MicOff,
  Send,
  Shield,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  apiListQuestions,
  apiLogProctoringEvent,
  apiStartSession,
  apiStoreCameraFrame,
  apiSubmitSession,
} from "../api/backend";
import type { QuestionId, SessionId } from "../backend";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import type { ExamPublic, Question } from "../types";
import { Difficulty, ProctoringEventType } from "../types";

// ── helpers ─────────────────────────────────────────────────────────────────

function difficultyBadge(d: Difficulty) {
  const map: Record<Difficulty, { label: string; cls: string }> = {
    [Difficulty.easy]: {
      label: "Easy",
      cls: "bg-primary/10 text-primary border-primary/30",
    },
    [Difficulty.medium]: {
      label: "Medium",
      cls: "bg-accent/20 text-accent-foreground border-accent/40",
    },
    [Difficulty.hard]: {
      label: "Hard",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
    },
    [Difficulty.expert]: {
      label: "Expert",
      cls: "bg-destructive/20 text-destructive border-destructive/50",
    },
  };
  const m = map[d];
  return <Badge className={`text-xs border ${m.cls}`}>{m.label}</Badge>;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const NOISE_THRESHOLD = 0.04; // RMS amplitude threshold

// ── main component ───────────────────────────────────────────────────────────

function ExamPageContent() {
  const { sessionId: sessionParam } = useParams({ from: "/exam/$sessionId" });
  const { user } = useAuth();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();

  // Parse examId from param (format: "new-<examId>")
  const isNewSession = sessionParam.startsWith("new-");
  const examIdRaw = isNewSession ? sessionParam.replace("new-", "") : null;

  // State
  const [exam, setExam] = useState<ExamPublic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<SessionId | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Proctoring state
  const [tabSwitches, setTabSwitches] = useState(0);
  const [noiseEvents, setNoiseEvents] = useState(0);
  const tabSwitchesRef = useRef(0);
  const consecutiveNoiseRef = useRef(0);

  // Submission
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mic
  const micIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [micActive, setMicActive] = useState(false);

  // ── disable copy/paste ───────────────────────────────────────────────────
  useEffect(() => {
    const block = (e: Event) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
    };
  }, []);

  // ── submit helper ────────────────────────────────────────────────────────
  const submitExam = useCallback(
    async (auto: boolean) => {
      if (submittedRef.current || !actor || !user || !sessionId) return;
      submittedRef.current = true;
      setSubmitted(true);
      setSubmitting(true);

      // stop camera + mic
      if (streamRef.current) {
        for (const t of streamRef.current.getTracks()) t.stop();
      }
      if (cameraIntervalRef.current) clearInterval(cameraIntervalRef.current);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);

      const answerList: Array<[QuestionId, string]> = Object.entries(
        answers,
      ).map(([qid, ans]) => [BigInt(qid), ans]);

      if (auto) {
        await apiLogProctoringEvent(
          actor,
          user.sessionToken,
          sessionId,
          ProctoringEventType.autoSubmit,
          JSON.stringify({ reason: "timer" }),
        ).catch(() => {});
      }

      try {
        await apiSubmitSession(
          actor,
          user.sessionToken,
          sessionId,
          answerList,
          auto,
        );
        setSubmitting(false);
        toast.success("Exam submitted! Redirecting…", { duration: 2000 });
        setTimeout(
          () =>
            navigate({
              to: "/results/$sessionId",
              params: { sessionId: sessionId.toString() },
            }),
          1800,
        );
      } catch {
        setSubmitting(false);
        toast.error("Failed to submit — please try again.");
        submittedRef.current = false;
        setSubmitted(false);
      }
    },
    [actor, user, sessionId, answers, navigate],
  );

  // ── tab switch detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || submittedRef.current) return;

    const handleVisibility = () => {
      if (document.hidden && !submittedRef.current) {
        tabSwitchesRef.current += 1;
        setTabSwitches(tabSwitchesRef.current);

        if (actor && user && sessionId) {
          apiLogProctoringEvent(
            actor,
            user.sessionToken,
            sessionId,
            ProctoringEventType.tabSwitch,
            JSON.stringify({ count: tabSwitchesRef.current }),
          ).catch(() => {});
        }

        if (tabSwitchesRef.current >= 2) {
          toast.warning("2 tab switches detected — auto-submitting exam.", {
            duration: 3000,
          });
          submitExam(true);
        } else {
          toast.warning(
            `Warning: tab switch detected (${tabSwitchesRef.current}/2). One more will auto-submit.`,
            { duration: 4000 },
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [sessionId, actor, user, submitExam]);

  // ── camera capture ───────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      toast.warning("Camera unavailable — proctoring will log missing frames.");
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (
      !canvasRef.current ||
      !videoRef.current ||
      !actor ||
      !user ||
      !sessionId
    )
      return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const base64 = canvas.toDataURL("image/jpeg", 0.2);
    apiStoreCameraFrame(
      actor,
      user.sessionToken,
      sessionId,
      base64,
      BigInt(Date.now()),
    ).catch(() => {});
  }, [actor, user, sessionId]);

  // ── mic noise detection ──────────────────────────────────────────────────
  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);
    } catch {
      setMicActive(false);
    }
  }, []);

  const checkNoise = useCallback(() => {
    if (!analyserRef.current || !actor || !user || !sessionId) return;
    const buf = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buf);
    let rms = 0;
    for (const v of buf) rms += v * v;
    rms = Math.sqrt(rms / buf.length);

    if (rms > NOISE_THRESHOLD) {
      consecutiveNoiseRef.current += 1;
      if (consecutiveNoiseRef.current >= 3) {
        consecutiveNoiseRef.current = 0;
        setNoiseEvents((n) => n + 1);
        apiLogProctoringEvent(
          actor,
          user.sessionToken,
          sessionId,
          ProctoringEventType.noiseBreach,
          JSON.stringify({ rms: rms.toFixed(4) }),
        ).catch(() => {});
        toast.warning("Sustained noise detected and logged.", {
          duration: 3000,
        });
      }
    } else {
      consecutiveNoiseRef.current = 0;
    }
  }, [actor, user, sessionId]);

  // ── load exam + questions + start session ────────────────────────────────
  useEffect(() => {
    if (!actor || isFetching || !user || !isNewSession || !examIdRaw) return;

    const examId = BigInt(examIdRaw);

    (async () => {
      try {
        const [examData, qs, sid] = await Promise.all([
          actor.getExam(user.sessionToken, examId),
          apiListQuestions(actor, user.sessionToken, examId),
          apiStartSession(actor, user.sessionToken, examId),
        ]);
        if (!examData) {
          setLoadError("Exam not found.");
          setLoading(false);
          return;
        }
        setExam(examData);
        setQuestions(qs);
        setSessionId(sid);
        setTimeLeft(Number(examData.timerMinutes) * 60);
        setLoading(false);
      } catch {
        setLoadError("Failed to load exam. Please try again.");
        setLoading(false);
      }
    })();
  }, [actor, isFetching, user, isNewSession, examIdRaw]);

  // ── start proctoring after session is ready ──────────────────────────────
  useEffect(() => {
    if (!sessionId || loading) return;
    startCamera();
    startMic();
  }, [sessionId, loading, startCamera, startMic]);

  // ── camera interval (after sessionId is ready) ───────────────────────────
  useEffect(() => {
    if (!sessionId || loading) return;
    const id = setInterval(captureFrame, 10_000);
    cameraIntervalRef.current = id;
    return () => clearInterval(id);
  }, [sessionId, loading, captureFrame]);

  // ── mic interval ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || loading) return;
    const id = setInterval(checkNoise, 5_000);
    micIntervalRef.current = id;
    return () => clearInterval(id);
  }, [sessionId, loading, checkNoise]);

  // ── countdown timer ───────────────────────────────────────────────────────
  const timerStartedRef = useRef(false);
  useEffect(() => {
    if (!sessionId || loading || timerStartedRef.current) return;
    timerStartedRef.current = true;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          submitExam(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [sessionId, loading, submitExam]);

  // ── render ────────────────────────────────────────────────────────────────

  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-background">
        <div
          className="max-w-4xl mx-auto px-4 py-10 space-y-4"
          data-ocid="exam.loading_state"
        >
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="exam.error_state"
      >
        <Card className="max-w-sm w-full mx-4">
          <CardContent className="py-10 text-center">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="font-display font-semibold text-foreground mb-2">
              Error
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLowTime = timeLeft < 300 && timeLeft > 0;
  const answeredCount = Object.values(answers).filter(Boolean).length;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Top sticky header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-display font-semibold text-foreground truncate">
              {exam?.roleTitle ?? "Exam"}
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground">
              — {answeredCount}/{questions.length} answered
            </span>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-smooth ${
              isLowTime
                ? "bg-destructive/10 border-destructive/40 text-destructive"
                : "bg-muted/60 border-border text-foreground"
            }`}
            data-ocid="exam.timer"
          >
            {formatTime(timeLeft)}
            {isLowTime && <span className="text-xs animate-pulse">!</span>}
          </div>
        </div>
      </header>

      {/* Proctoring warning banner */}
      {(tabSwitches > 0 || noiseEvents > 0) && (
        <div
          className="bg-accent/15 border-b border-accent/30 px-4 py-2 flex items-center gap-3"
          data-ocid="exam.proctoring_banner"
        >
          <AlertTriangle className="w-4 h-4 text-accent-foreground shrink-0" />
          <div className="flex flex-wrap gap-4 text-xs text-accent-foreground">
            {tabSwitches > 0 && (
              <span className="flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5" />
                Tab switches: <strong>{tabSwitches}/2</strong>
              </span>
            )}
            {noiseEvents > 0 && (
              <span className="flex items-center gap-1">
                <Mic className="w-3.5 h-3.5" />
                Noise events: <strong>{noiseEvents}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        {/* Questions */}
        <div className="flex-1 min-w-0 space-y-5">
          {questions.map((q, i) => {
            const qid = q.id.toString();
            const isMCQ = q.options.length > 0;
            return (
              <Card
                key={qid}
                className="border-border"
                data-ocid={`exam.question.item.${i + 1}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base font-display font-medium text-foreground leading-snug flex-1">
                      <span className="text-muted-foreground text-sm mr-2 font-mono">
                        Q{i + 1}.
                      </span>
                      {q.questionText}
                    </CardTitle>
                    {difficultyBadge(q.difficulty)}
                  </div>
                </CardHeader>
                <CardContent>
                  {isMCQ ? (
                    <RadioGroup
                      value={answers[qid] ?? ""}
                      onValueChange={(v) =>
                        setAnswers((prev) => ({ ...prev, [qid]: v }))
                      }
                      className="space-y-2"
                      data-ocid={`exam.answer_options.${i + 1}`}
                    >
                      {q.options.map((opt, oi) => (
                        <label
                          key={`${qid}-opt-${opt}`}
                          htmlFor={`q${qid}-opt${oi}`}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 cursor-pointer transition-smooth has-[[data-state=checked]]:bg-primary/5 has-[[data-state=checked]]:border-primary/40"
                        >
                          <RadioGroupItem
                            value={opt}
                            id={`q${qid}-opt${oi}`}
                            data-ocid={`exam.option.${i + 1}.${oi + 1}`}
                          />
                          <span className="text-sm text-foreground">{opt}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Input
                      placeholder="Type your answer here…"
                      value={answers[qid] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [qid]: e.target.value,
                        }))
                      }
                      disabled={submitted}
                      className="bg-input"
                      data-ocid={`exam.text_answer.${i + 1}`}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}

          {questions.length === 0 && !loading && (
            <Card
              className="border-dashed"
              data-ocid="exam.questions.empty_state"
            >
              <CardContent className="py-12 text-center">
                <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No questions found for this exam.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-4">
          {/* Camera preview */}
          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <div className="px-3 py-2 border-b border-border flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                Camera Preview
              </span>
              {micActive ? (
                <Mic className="w-3.5 h-3.5 text-primary ml-auto" />
              ) : (
                <MicOff className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
              )}
            </div>
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                data-ocid="exam.camera_preview"
              />
            </div>
          </div>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-display uppercase text-muted-foreground tracking-wider">
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Answered</span>
                <span className="font-mono font-medium text-foreground">
                  {answeredCount} / {questions.length}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-smooth"
                  style={{
                    width: questions.length
                      ? `${(answeredCount / questions.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Tab switches</span>
                <span
                  className={`font-mono font-medium ${tabSwitches > 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {tabSwitches}/2
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Noise events</span>
                <span
                  className={`font-mono font-medium ${noiseEvents > 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {noiseEvents}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            className="w-full gap-2"
            disabled={submitted || submitting}
            onClick={() => setConfirmOpen(true)}
            data-ocid="exam.submit_button"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Exam
              </>
            )}
          </Button>
        </aside>
      </div>

      {/* Mobile submit bar */}
      <div className="lg:hidden sticky bottom-0 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {answeredCount}/{questions.length} answered
        </span>
        <Button
          size="sm"
          className="gap-2"
          disabled={submitted || submitting}
          onClick={() => setConfirmOpen(true)}
          data-ocid="exam.mobile_submit_button"
        >
          <Send className="w-3.5 h-3.5" />
          Submit
        </Button>
      </div>

      {/* Submitted overlay */}
      {submitted && (
        <div
          className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center"
          data-ocid="exam.submitted_overlay"
        >
          <div className="text-center px-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
              Exam Submitted
            </h2>
            <p className="text-muted-foreground text-sm">
              {submitting
                ? "Processing your results…"
                : "Redirecting to your results…"}
            </p>
          </div>
        </div>
      )}

      {/* Confirm submit dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent data-ocid="exam.submit_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Submit Exam?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {questions.length} questions.{" "}
              {answeredCount < questions.length && (
                <span className="text-destructive font-medium">
                  {questions.length - answeredCount} question(s) unanswered.{" "}
                </span>
              )}
              Once submitted, you cannot change your answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="exam.submit_cancel_button">
              Keep working
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                submitExam(false);
              }}
              data-ocid="exam.submit_confirm_button"
            >
              Yes, Submit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden canvas for frame capture — tabIndex=-1 keeps it inert */}
      <canvas ref={canvasRef} className="hidden" tabIndex={-1} />
    </div>
  );
}

// We intentionally skip Monitor import for the lint — add it:
function Monitor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Monitor</title>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export default function ExamPage() {
  return (
    <ProtectedRoute>
      <ExamPageContent />
    </ProtectedRoute>
  );
}
