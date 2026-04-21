import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  Home,
  MonitorX,
  Printer,
  User,
  Volume2,
  XCircle,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  apiGetExam,
  apiGetExamResult,
  apiListQuestions,
  apiListSessions,
} from "../api/backend";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthContext } from "../context/AuthContext";
import { useBackend } from "../hooks/useBackend";
import type {
  ExamPublic,
  ExamResult,
  ExamSessionPublic,
  Question,
} from "../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(secs: bigint): string {
  const s = Number(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function formatDate(ts: bigint): string {
  // ts is nanoseconds (ICP Motoko); convert to ms
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pct(correct: bigint, total: bigint): string {
  if (total === 0n) return "—";
  return `${Math.round((Number(correct) / Number(total)) * 100)}%`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface ScoreHeroProps {
  result: ExamResult;
}

function ScoreHero({ result }: ScoreHeroProps) {
  const total = Number(result.totalQuestions);
  const correct = Number(result.totalCorrect);
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = result.passed;

  return (
    <Card
      className="border-2"
      style={{
        borderColor: passed ? "oklch(0.72 0.18 142)" : "oklch(0.55 0.2 30)",
      }}
      data-ocid="results.score_card"
    >
      <CardContent className="pt-8 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Score block */}
          <div className="text-center md:text-left">
            <p className="text-sm font-body text-muted-foreground uppercase tracking-widest mb-2">
              Total Score
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-display font-bold text-foreground leading-none">
                {correct}
              </span>
              <span className="text-3xl font-display text-muted-foreground">
                / {total}
              </span>
            </div>
            <p className="text-2xl font-display font-semibold text-muted-foreground mt-1">
              {percentage}%
            </p>
          </div>

          {/* Status badge */}
          <div className="flex flex-col items-center md:items-end gap-3">
            {passed ? (
              <div
                className="flex items-center gap-2 px-6 py-3 rounded-lg"
                style={{ background: "oklch(0.95 0.06 142)" }}
                data-ocid="results.pass_badge"
              >
                <CheckCircle2
                  className="w-6 h-6"
                  style={{ color: "oklch(0.5 0.18 142)" }}
                />
                <span
                  className="text-xl font-display font-bold tracking-wide"
                  style={{ color: "oklch(0.38 0.14 142)" }}
                >
                  PASS
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-6 py-3 rounded-lg"
                style={{ background: "oklch(0.96 0.05 30)" }}
                data-ocid="results.fail_badge"
              >
                <XCircle
                  className="w-6 h-6"
                  style={{ color: "oklch(0.55 0.2 30)" }}
                />
                <span
                  className="text-xl font-display font-bold tracking-wide"
                  style={{ color: "oklch(0.42 0.18 30)" }}
                >
                  FAIL
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Time taken:{" "}
              <span className="font-semibold text-foreground">
                {formatDuration(result.timeTakenSecs)}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DifficultyTableProps {
  breakdown: ExamResult["perDifficultyBreakdown"];
  questions: Question[];
}

type DiffRow = {
  label: string;
  key: "easy" | "medium" | "hard" | "expert";
  color: string;
};

const DIFF_ROWS: DiffRow[] = [
  { label: "Easy", key: "easy", color: "oklch(0.72 0.18 142)" },
  { label: "Medium", key: "medium", color: "oklch(0.72 0.18 75)" },
  { label: "Hard", key: "hard", color: "oklch(0.72 0.18 30)" },
  { label: "Expert", key: "expert", color: "oklch(0.52 0.2 295)" },
];

function DifficultyTable({ breakdown, questions }: DifficultyTableProps) {
  const countByDiff = (key: DiffRow["key"]) =>
    questions.filter((q) => q.difficulty === key).length;

  return (
    <Card data-ocid="results.difficulty_table">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg">
          Score Breakdown by Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-semibold">Level</TableHead>
              <TableHead className="text-right font-semibold">
                Correct
              </TableHead>
              <TableHead className="text-right font-semibold">
                Questions
              </TableHead>
              <TableHead className="text-right font-semibold">Score</TableHead>
              <TableHead className="font-semibold pl-6">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DIFF_ROWS.map(({ label, key, color }) => {
              const correct = breakdown[key];
              const total = BigInt(countByDiff(key));
              const pctVal =
                total > 0n
                  ? Math.round((Number(correct) / Number(total)) * 100)
                  : 0;
              return (
                <TableRow key={key}>
                  <TableCell>
                    <span className="font-medium text-foreground">{label}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {Number(correct)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {Number(total)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {pct(correct, total)}
                  </TableCell>
                  <TableCell className="pl-6 w-40">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pctVal}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface ProctoringFlagsProps {
  counts: ExamResult["proctoringEventCounts"];
}

function ProctoringFlags({ counts }: ProctoringFlagsProps) {
  const tabSwitches = Number(counts.tabSwitches);
  const noiseEvents = Number(counts.noiseEvents);
  const frames = Number(counts.framesCaptured);
  const hasViolations = tabSwitches > 0 || noiseEvents > 0;

  return (
    <Card
      className={hasViolations ? "border-amber-300" : "border-border"}
      data-ocid="results.proctoring_flags"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {hasViolations ? (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          )}
          <CardTitle className="font-display text-lg">
            Proctoring Summary
          </CardTitle>
          {hasViolations && (
            <Badge
              className="ml-auto text-amber-800 border-amber-300"
              style={{ background: "oklch(0.97 0.06 80)" }}
            >
              Violations Detected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tab Switches */}
          <div
            className={`rounded-lg p-4 flex items-center gap-3 ${
              tabSwitches > 0
                ? "bg-amber-50 border border-amber-200"
                : "bg-muted/40"
            }`}
            data-ocid="results.tab_switches"
          >
            <MonitorX
              className={`w-8 h-8 shrink-0 ${
                tabSwitches > 0 ? "text-amber-500" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {tabSwitches}
              </p>
              <p className="text-xs text-muted-foreground">Tab Switches</p>
              {tabSwitches > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  ⚠ Policy violation
                </p>
              )}
            </div>
          </div>

          {/* Noise Events */}
          <div
            className={`rounded-lg p-4 flex items-center gap-3 ${
              noiseEvents > 0
                ? "bg-amber-50 border border-amber-200"
                : "bg-muted/40"
            }`}
            data-ocid="results.noise_events"
          >
            <Volume2
              className={`w-8 h-8 shrink-0 ${
                noiseEvents > 0 ? "text-amber-500" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {noiseEvents}
              </p>
              <p className="text-xs text-muted-foreground">Noise Events</p>
              {noiseEvents > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  ⚠ Sustained noise detected
                </p>
              )}
            </div>
          </div>

          {/* Camera Frames */}
          <div
            className="rounded-lg p-4 flex items-center gap-3 bg-muted/40"
            data-ocid="results.camera_frames"
          >
            <Camera className="w-8 h-8 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {frames}
              </p>
              <p className="text-xs text-muted-foreground">Camera Frames</p>
              <p className="text-xs text-muted-foreground mt-0.5">Captured</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuestionDetailTableProps {
  questions: Question[];
  answers: Record<string, string>;
}

function QuestionDetailTable({ questions, answers }: QuestionDetailTableProps) {
  if (questions.length === 0) return null;

  return (
    <Card data-ocid="results.question_table">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg">
          Question-by-Question Review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-10 font-semibold">#</TableHead>
                <TableHead className="font-semibold">Question</TableHead>
                <TableHead className="font-semibold w-24">Level</TableHead>
                <TableHead className="font-semibold">Your Answer</TableHead>
                <TableHead className="font-semibold">Correct Answer</TableHead>
                <TableHead className="w-16 text-center font-semibold">
                  Result
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, idx) => {
                const qKey = String(q.id);
                const userAnswer = answers[qKey] ?? "—";
                const isCorrect =
                  answers[qKey] !== undefined &&
                  answers[qKey].trim().toLowerCase() ===
                    q.correctAnswer.trim().toLowerCase();
                const diffLabels: Record<string, string> = {
                  easy: "Easy",
                  medium: "Medium",
                  hard: "Hard",
                  expert: "Expert",
                };
                const diffColors: Record<string, string> = {
                  easy: "bg-green-100 text-green-800",
                  medium: "bg-yellow-100 text-yellow-800",
                  hard: "bg-orange-100 text-orange-800",
                  expert: "bg-purple-100 text-purple-800",
                };
                return (
                  <TableRow
                    key={String(q.id)}
                    className={isCorrect ? "bg-green-50/40" : "bg-red-50/20"}
                    data-ocid={`results.question_row.${idx + 1}`}
                  >
                    <TableCell className="font-mono text-muted-foreground text-sm">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-foreground line-clamp-2">
                        {q.questionText}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          diffColors[q.difficulty] ?? "bg-muted text-foreground"
                        }`}
                      >
                        {diffLabels[q.difficulty] ?? q.difficulty}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={
                          userAnswer === "—"
                            ? "text-muted-foreground italic"
                            : "text-foreground"
                        }
                      >
                        {userAnswer}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {q.correctAnswer}
                    </TableCell>
                    <TableCell className="text-center">
                      {userAnswer === "—" ? (
                        <span className="text-muted-foreground text-xs">—</span>
                      ) : isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function ResultsPageContent() {
  const { sessionId } = useParams({ strict: false }) as { sessionId: string };
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { actor, isFetching } = useBackend();

  const [result, setResult] = useState<ExamResult | null>(null);
  const [session, setSession] = useState<ExamSessionPublic | null>(null);
  const [exam, setExam] = useState<ExamPublic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // answers: stored in sessionStorage by ExamPage under key `exam_answers_${sessionId}`
  const storedAnswersRaw =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`exam_answers_${sessionId}`)
      : null;
  const storedAnswers: Record<string, string> = storedAnswersRaw
    ? (JSON.parse(storedAnswersRaw) as Record<string, string>)
    : {};

  const load = useCallback(async () => {
    if (!actor || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      const sessionIdBig = BigInt(sessionId);
      const res = await apiGetExamResult(
        actor,
        user.sessionToken,
        sessionIdBig,
      );
      if (!res) {
        setError("Result not found. The exam may not have been submitted yet.");
        return;
      }
      setResult(res);

      // Load session list to get the exam ID
      const sessions = await apiListSessions(actor, user.sessionToken, null);
      const foundSession = sessions.find((s) => s.id === sessionIdBig);
      if (foundSession) {
        setSession(foundSession);
        const examData = await apiGetExam(
          actor,
          user.sessionToken,
          foundSession.examId,
        );
        setExam(examData);
        if (examData) {
          const qs = await apiListQuestions(
            actor,
            user.sessionToken,
            examData.id,
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

  useEffect(() => {
    if (!isFetching && actor) {
      load();
    }
  }, [load, isFetching, actor]);

  const handlePrint = () => {
    window.print();
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Layout>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6"
          data-ocid="results.loading_state"
        >
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error || !result) {
    return (
      <Layout>
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center"
          data-ocid="results.error_state"
        >
          <XCircle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
            Results Not Available
          </h2>
          <p className="text-muted-foreground max-w-md mb-8">
            {error ?? "No result data was found for this session."}
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            data-ocid="results.return_home_button"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }

  // ── Full report ────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 print:py-6 print:space-y-4">
        {/* Report Header */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2"
          data-ocid="results.page"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Exam Results Report
            </h1>
            <p className="text-muted-foreground mt-1">
              Candidate Assessment Summary
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button
              variant="outline"
              onClick={handlePrint}
              data-ocid="results.print_button"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/" })}
              data-ocid="results.return_home_button"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        <Separator />

        {/* Candidate Info Card */}
        <Card className="bg-muted/30" data-ocid="results.candidate_card">
          <CardContent className="pt-5 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Candidate
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.role === "candidate"
                      ? "You"
                      : `ID #${String(session?.candidateId ?? "—")}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Role
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {exam?.roleTitle ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {session?.startTime ? formatDate(session.startTime) : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Time Taken
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {formatDuration(result.timeTakenSecs)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Hero */}
        <ScoreHero result={result} />

        {/* Per-difficulty breakdown */}
        <DifficultyTable
          breakdown={result.perDifficultyBreakdown}
          questions={questions}
        />

        {/* Proctoring flags */}
        <ProctoringFlags counts={result.proctoringEventCounts} />

        {/* Question detail */}
        <QuestionDetailTable questions={questions} answers={storedAnswers} />

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 print:hidden">
          <p className="text-sm text-muted-foreground">
            Session ID:{" "}
            <span className="font-mono text-foreground">{sessionId}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              data-ocid="results.print_button_bottom"
            >
              <Printer className="w-4 h-4 mr-2" />
              Save PDF
            </Button>
            <Button
              onClick={() => navigate({ to: "/" })}
              data-ocid="results.home_button_bottom"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsPageContent />
    </ProtectedRoute>
  );
}
