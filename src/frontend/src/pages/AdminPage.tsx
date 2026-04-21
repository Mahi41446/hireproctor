import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Copy,
  FileSpreadsheet,
  Layers,
  Link2,
  Loader2,
  PlayCircle,
  PlusCircle,
  Sparkles,
  StopCircle,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Difficulty,
  ExamStatus,
  apiCreateExam,
  apiGenerateQuestionsViaOllama,
  apiImportQuestions,
  apiListExams,
  apiListQuestions,
  apiSetExamStatus,
} from "../api/backend";
import { AdminRoute } from "../components/AdminRoute";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import type { ExamPublic, Question } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedQuestion {
  question_text: string;
  difficulty: Difficulty;
  options: string[];
  correct_answer: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.easy]: "Easy",
  [Difficulty.medium]: "Medium",
  [Difficulty.hard]: "Hard",
  [Difficulty.expert]: "Expert",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  [Difficulty.easy]: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  [Difficulty.medium]: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  [Difficulty.hard]: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  [Difficulty.expert]:
    "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_CONFIG: Record<ExamStatus, { label: string; color: string }> = {
  [ExamStatus.draft]: {
    label: "Draft",
    color: "bg-muted text-muted-foreground border-border",
  },
  [ExamStatus.active]: {
    label: "Active",
    color: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  },
  [ExamStatus.closed]: {
    label: "Closed",
    color: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

function parseDifficulty(raw: string): Difficulty {
  const map: Record<string, Difficulty> = {
    easy: Difficulty.easy,
    medium: Difficulty.medium,
    hard: Difficulty.hard,
    expert: Difficulty.expert,
  };
  return map[raw?.toLowerCase?.().trim()] ?? Difficulty.medium;
}

function parseExcelFile(file: File): Promise<ParsedQuestion[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
        const parsed: ParsedQuestion[] = rows.map((row) => ({
          question_text: String(row.question_text ?? row.Question ?? "").trim(),
          difficulty: parseDifficulty(
            String(row.difficulty ?? row.Difficulty ?? "medium"),
          ),
          options: String(row.options ?? row.Options ?? "")
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean),
          correct_answer: String(
            row.correct_answer ?? row.CorrectAnswer ?? "",
          ).trim(),
        }));
        resolve(parsed.filter((q) => q.question_text.length > 0));
      } catch {
        reject(
          new Error("Failed to parse Excel file. Please check the format."),
        );
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsBinaryString(file);
  });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${DIFFICULTY_COLORS[difficulty]}`}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

function QuestionPreviewTable({
  questions,
  onRemove,
}: {
  questions: ParsedQuestion[];
  onRemove?: (index: number) => void;
}) {
  if (questions.length === 0) return null;
  return (
    <div
      className="rounded-md border border-border overflow-hidden"
      data-ocid="questions.preview_table"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium w-8">
                #
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">
                Question
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium w-24">
                Difficulty
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">
                Options
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">
                Answer
              </th>
              {onRemove && (
                <th className="w-10 px-4 py-2.5 text-muted-foreground font-medium" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {questions.map((q, i) => (
              <tr
                key={q.question_text}
                className="hover:bg-muted/30 transition-colors"
                data-ocid={`questions.preview_row.${i + 1}`}
              >
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {i + 1}
                </td>
                <td className="px-4 py-3 text-foreground max-w-xs">
                  <p className="line-clamp-2">{q.question_text}</p>
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={q.difficulty} />
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-[180px]">
                  <p className="truncate">
                    {q.options.length > 0 ? q.options.join(", ") : "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-foreground font-medium max-w-[120px]">
                  <p className="truncate">{q.correct_answer || "—"}</p>
                </td>
                {onRemove && (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove question"
                      data-ocid={`questions.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoadedQuestionsTable({ questions }: { questions: Question[] }) {
  if (questions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center"
        data-ocid="questions.empty_state"
      >
        <Layers className="w-10 h-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground font-medium">
          No questions loaded yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Upload an Excel file or generate questions with AI above
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium w-8">
                #
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">
                Question
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium w-24">
                Difficulty
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">
                Answer
              </th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium w-16">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {questions.map((q, i) => (
              <tr
                key={String(q.id)}
                className="hover:bg-muted/30 transition-colors"
                data-ocid={`loaded_questions.item.${i + 1}`}
              >
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {i + 1}
                </td>
                <td className="px-4 py-3 text-foreground max-w-sm">
                  <p className="line-clamp-2">{q.questionText}</p>
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={q.difficulty} />
                </td>
                <td className="px-4 py-3 font-medium text-foreground max-w-[160px]">
                  <p className="truncate">{q.correctAnswer}</p>
                </td>
                <td className="px-4 py-3">
                  {q.aiGenerated ? (
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <Sparkles className="w-3 h-3" /> AI
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Excel</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main page content ────────────────────────────────────────────────────────

function AdminPageContent() {
  const { user } = useAuth();
  const { actor, isFetching } = useBackend();
  const sessionToken = user?.sessionToken ?? "";

  // Exams list state
  const [exams, setExams] = useState<ExamPublic[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);

  // Selected exam
  const [selectedExamId, setSelectedExamId] = useState<bigint | null>(null);
  const selectedExam = exams.find((e) => e.id === selectedExamId) ?? null;

  // Questions for selected exam
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Create exam form
  const [roleTitle, setRoleTitle] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [passThreshold, setPassThreshold] = useState(60);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Excel upload state
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [parseError, setParseError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("upload");

  // AI Generate state
  const [aiRole, setAiRole] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState<ParsedQuestion[]>([]);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState(false);

  // Status change
  const [statusLoading, setStatusLoading] = useState(false);

  // Copied URL
  const [urlCopied, setUrlCopied] = useState(false);

  // Load exams on mount
  const loadExams = useCallback(async () => {
    if (!actor || !sessionToken) return;
    setExamsLoading(true);
    try {
      const list = await apiListExams(actor, sessionToken);
      setExams(list);
      setSelectedExamId((prev) => {
        if (!prev && list.length > 0) return list[0].id;
        return prev;
      });
    } catch {
      // ignore
    } finally {
      setExamsLoading(false);
    }
  }, [actor, sessionToken]);

  useEffect(() => {
    if (!isFetching && actor) {
      void loadExams();
    }
  }, [actor, isFetching, loadExams]);

  // Load questions when exam selection changes
  useEffect(() => {
    if (!actor || !sessionToken || !selectedExamId) {
      setQuestions([]);
      return;
    }
    setQuestionsLoading(true);
    apiListQuestions(actor, sessionToken, selectedExamId)
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setQuestionsLoading(false));
  }, [actor, sessionToken, selectedExamId]);

  // ─── Create Exam ────────────────────────────────────────────────────────

  const handleCreateExam = async () => {
    if (!actor || !sessionToken || !roleTitle.trim()) return;
    setCreateLoading(true);
    setCreateError("");
    try {
      const id = await apiCreateExam(
        actor,
        sessionToken,
        roleTitle.trim(),
        BigInt(timerMinutes),
        BigInt(passThreshold),
      );
      await loadExams();
      setSelectedExamId(id);
      setRoleTitle("");
      setTimerMinutes(30);
      setPassThreshold(60);
    } catch {
      setCreateError("Failed to create exam. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  // ─── Excel Upload ───────────────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");
    setParsedQuestions([]);
    setUploadSuccess(false);
    if (!file.name.endsWith(".xlsx")) {
      setParseError("Only .xlsx files are supported.");
      return;
    }
    try {
      const parsed = await parseExcelFile(file);
      if (parsed.length === 0) {
        setParseError(
          "No valid questions found. Check column headers: question_text, difficulty, options, correct_answer",
        );
        return;
      }
      setParsedQuestions(parsed);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Parse error.");
    }
  };

  const handleRemoveParsed = (index: number) => {
    setParsedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = async () => {
    if (
      !actor ||
      !sessionToken ||
      !selectedExamId ||
      parsedQuestions.length === 0
    )
      return;
    setUploadLoading(true);
    setUploadSuccess(false);
    try {
      const batch: [string, Difficulty, string[], string][] =
        parsedQuestions.map((q) => [
          q.question_text,
          q.difficulty,
          q.options,
          q.correct_answer,
        ]);
      await apiImportQuestions(actor, sessionToken, selectedExamId, batch);
      const updated = await apiListQuestions(
        actor,
        sessionToken,
        selectedExamId,
      );
      setQuestions(updated);
      setParsedQuestions([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadSuccess(true);
    } catch {
      setParseError("Failed to save questions. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  // ─── AI Generate ────────────────────────────────────────────────────────

  const handleAiGenerate = async () => {
    if (!actor || !sessionToken || !selectedExamId || !aiRole.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiPreview([]);
    setAiSuccess(false);
    try {
      const result = await apiGenerateQuestionsViaOllama(
        actor,
        sessionToken,
        selectedExamId,
        aiRole.trim(),
      );
      if (result.__kind__ === "ok") {
        const preview: ParsedQuestion[] = result.ok.map((q) => ({
          question_text: q.questionText,
          difficulty: q.difficulty,
          options: q.options,
          correct_answer: q.correctAnswer,
        }));
        setAiPreview(preview);
        // Refresh questions list (AI already saved them)
        const updated = await apiListQuestions(
          actor,
          sessionToken,
          selectedExamId,
        );
        setQuestions(updated);
        setAiSuccess(true);
      } else {
        setAiError(
          "AI question generation unavailable. Please upload questions manually.",
        );
      }
    } catch {
      setAiError(
        "AI question generation unavailable. Please upload questions manually.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  // ─── Status Change ──────────────────────────────────────────────────────

  const handleSetStatus = async (status: ExamStatus) => {
    if (!actor || !sessionToken || !selectedExamId) return;
    setStatusLoading(true);
    try {
      await apiSetExamStatus(actor, sessionToken, selectedExamId, status);
      await loadExams();
    } catch {
      // ignore
    } finally {
      setStatusLoading(false);
    }
  };

  const examUrl = selectedExam
    ? `${window.location.origin}/exam-entry?examId=${String(selectedExam.id)}`
    : "";

  const handleCopyUrl = () => {
    copyToClipboard(examUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  if (isFetching || examsLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage exams, questions, and candidate assessments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: exam list + create ── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Create exam form */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-primary" />
                  Create New Exam
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="role-title">Job Role</Label>
                  <Input
                    id="role-title"
                    placeholder="e.g. Backend Python Developer"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    data-ocid="create_exam.role_input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="timer">Timer (min)</Label>
                    <Input
                      id="timer"
                      type="number"
                      min={5}
                      max={180}
                      value={timerMinutes}
                      onChange={(e) =>
                        setTimerMinutes(Number.parseInt(e.target.value) || 30)
                      }
                      data-ocid="create_exam.timer_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="threshold">Pass % </Label>
                    <Input
                      id="threshold"
                      type="number"
                      min={0}
                      max={100}
                      value={passThreshold}
                      onChange={(e) =>
                        setPassThreshold(Number.parseInt(e.target.value) || 60)
                      }
                      data-ocid="create_exam.threshold_input"
                    />
                  </div>
                </div>
                {createError && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="create_exam.error_state"
                  >
                    {createError}
                  </p>
                )}
                <Button
                  className="w-full"
                  onClick={handleCreateExam}
                  disabled={createLoading || !roleTitle.trim()}
                  data-ocid="create_exam.submit_button"
                >
                  {createLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <PlusCircle className="w-4 h-4 mr-2" />
                  )}
                  Create Exam
                </Button>
              </CardContent>
            </Card>

            {/* Exam list */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base">
                  All Exams
                </CardTitle>
                <CardDescription className="text-xs">
                  {exams.length} exam{exams.length !== 1 ? "s" : ""} total
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {exams.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-10 text-center px-4"
                    data-ocid="exams.empty_state"
                  >
                    <FileSpreadsheet className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No exams yet. Create one above.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border" data-ocid="exams.list">
                    {exams.map((exam, i) => {
                      const statusCfg = STATUS_CONFIG[exam.status];
                      const isSelected = exam.id === selectedExamId;
                      return (
                        <li
                          key={String(exam.id)}
                          data-ocid={`exams.item.${i + 1}`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedExamId(exam.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex items-center justify-between gap-2 ${
                              isSelected
                                ? "bg-primary/5 border-l-2 border-primary"
                                : ""
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {exam.roleTitle}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {String(exam.timerMinutes)} min ·{" "}
                                {String(exam.passThresholdPercent)}% pass
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusCfg.color}`}
                              >
                                {statusCfg.label}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Right column: selected exam management ── */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedExam ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Select or create an exam to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* ── Exam status header ── */}
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-display font-semibold text-foreground">
                            {selectedExam.roleTitle}
                          </h2>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              STATUS_CONFIG[selectedExam.status].color
                            }`}
                            data-ocid="exam.status_badge"
                          >
                            {STATUS_CONFIG[selectedExam.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Timer: {String(selectedExam.timerMinutes)} min · Pass
                          threshold: {String(selectedExam.passThresholdPercent)}
                          % · {questions.length} question
                          {questions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedExam.status === ExamStatus.draft && (
                          <Button
                            size="sm"
                            onClick={() => handleSetStatus(ExamStatus.active)}
                            disabled={statusLoading}
                            className="gap-1.5"
                            data-ocid="exam.activate_button"
                          >
                            {statusLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                            Activate Exam
                          </Button>
                        )}
                        {selectedExam.status === ExamStatus.active && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleSetStatus(ExamStatus.closed)}
                            disabled={statusLoading}
                            className="gap-1.5"
                            data-ocid="exam.close_button"
                          >
                            {statusLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <StopCircle className="w-4 h-4" />
                            )}
                            Close Exam
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Exam URL (shown when active) */}
                    {selectedExam.status === ExamStatus.active && (
                      <div
                        className="mt-4 flex items-center gap-2 p-3 rounded-md bg-primary/5 border border-primary/20"
                        data-ocid="exam.url_panel"
                      >
                        <Link2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground font-mono flex-1 truncate">
                          {examUrl}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyUrl}
                          className="gap-1.5 shrink-0"
                          data-ocid="exam.copy_url_button"
                        >
                          {urlCopied ? (
                            <CheckCircle2 className="w-4 h-4 text-chart-3" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {urlCopied ? "Copied!" : "Copy Link"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Question loading tabs ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">
                      Load Questions
                    </CardTitle>
                    <CardDescription>
                      Upload from Excel or generate with AI for this exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      data-ocid="questions.tabs"
                    >
                      <TabsList className="mb-5">
                        <TabsTrigger
                          value="upload"
                          className="gap-1.5"
                          data-ocid="questions.upload_tab"
                        >
                          <UploadCloud className="w-4 h-4" />
                          Upload Excel
                        </TabsTrigger>
                        <TabsTrigger
                          value="ai"
                          className="gap-1.5"
                          data-ocid="questions.ai_tab"
                        >
                          <Sparkles className="w-4 h-4" />
                          AI Generate
                        </TabsTrigger>
                      </TabsList>

                      {/* ── Upload Tab ── */}
                      <TabsContent value="upload" className="space-y-4">
                        <label
                          htmlFor="excel-upload"
                          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                          data-ocid="questions.upload_dropzone"
                        >
                          <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground">
                            Drop your .xlsx file here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Columns: question_text, difficulty, options
                            (comma-separated), correct_answer
                          </p>
                          <input
                            ref={fileInputRef}
                            id="excel-upload"
                            type="file"
                            accept=".xlsx"
                            className="hidden"
                            onChange={handleFileChange}
                            data-ocid="questions.file_input"
                          />
                        </label>

                        {parseError && (
                          <div
                            className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                            data-ocid="questions.parse_error_state"
                          >
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            {parseError}
                          </div>
                        )}

                        {uploadSuccess && parsedQuestions.length === 0 && (
                          <div
                            className="flex items-center gap-2 p-3 rounded-md bg-chart-3/10 border border-chart-3/20 text-sm text-chart-3"
                            data-ocid="questions.upload_success_state"
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            Questions saved successfully!
                          </div>
                        )}

                        {parsedQuestions.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-foreground">
                                Preview — {parsedQuestions.length} question
                                {parsedQuestions.length !== 1 ? "s" : ""} parsed
                              </p>
                              <Button
                                size="sm"
                                onClick={handleConfirmUpload}
                                disabled={uploadLoading}
                                className="gap-1.5"
                                data-ocid="questions.confirm_upload_button"
                              >
                                {uploadLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                                Save Questions
                              </Button>
                            </div>
                            <QuestionPreviewTable
                              questions={parsedQuestions}
                              onRemove={handleRemoveParsed}
                            />
                          </div>
                        )}
                      </TabsContent>

                      {/* ── AI Tab ── */}
                      <TabsContent value="ai" className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label htmlFor="ai-role" className="sr-only">
                              Job role for AI generation
                            </Label>
                            <Input
                              id="ai-role"
                              placeholder="Job role, e.g. Backend Python Developer"
                              value={aiRole}
                              onChange={(e) => setAiRole(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAiGenerate();
                              }}
                              data-ocid="questions.ai_role_input"
                            />
                          </div>
                          <Button
                            onClick={handleAiGenerate}
                            disabled={aiLoading || !aiRole.trim()}
                            className="gap-1.5 shrink-0"
                            data-ocid="questions.ai_generate_button"
                          >
                            {aiLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating…
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Generates 4 questions (1 easy, 1 medium, 1 hard, 1
                          expert) using Ollama AI and saves them to the exam
                          automatically.
                        </p>

                        {aiLoading && (
                          <div
                            className="flex items-center gap-3 p-4 rounded-md bg-muted/40 border border-border"
                            data-ocid="questions.ai_loading_state"
                          >
                            <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Generating questions…
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Calling Ollama AI — this may take a few seconds
                              </p>
                            </div>
                          </div>
                        )}

                        {aiError && (
                          <div
                            className="flex items-start gap-3 p-4 rounded-md bg-destructive/10 border border-destructive/20"
                            data-ocid="questions.ai_error_state"
                          >
                            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-destructive">
                                {aiError}
                              </p>
                              <button
                                type="button"
                                className="text-xs text-primary underline mt-1 hover:no-underline"
                                onClick={() => setActiveTab("upload")}
                                data-ocid="questions.switch_to_upload_link"
                              >
                                Switch to Upload Excel tab
                              </button>
                            </div>
                          </div>
                        )}

                        {aiSuccess && aiPreview.length > 0 && (
                          <div className="space-y-3">
                            <div
                              className="flex items-center gap-2 p-3 rounded-md bg-chart-3/10 border border-chart-3/20 text-sm text-chart-3"
                              data-ocid="questions.ai_success_state"
                            >
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              {aiPreview.length} questions generated and saved!
                            </div>
                            <QuestionPreviewTable questions={aiPreview} />
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* ── Loaded questions list ── */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-display text-base">
                          Loaded Questions
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          All questions for this exam
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-mono tabular-nums"
                      >
                        {questions.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {questionsLoading ? (
                      <div
                        className="space-y-2"
                        data-ocid="questions.loading_state"
                      >
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : (
                      <LoadedQuestionsTable questions={questions} />
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}
