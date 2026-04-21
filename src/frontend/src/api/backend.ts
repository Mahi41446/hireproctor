import type { backendInterface } from "../backend";
import type {
  RegistrationResult,
  LoginResult,
  UserPublic,
  ExamPublic,
  ExamId,
  Question,
  QuestionId,
  SessionId,
  ExamSessionPublic,
  ExamResult,
  OllamaGenerationResult,
  EventId,
} from "../backend";
import { Difficulty, ExamStatus, ProctoringEventType } from "../backend";

export type Actor = backendInterface;
export type { RegistrationResult, LoginResult };
export { Difficulty, ExamStatus, ProctoringEventType };

// --- Auth ---
export async function apiRegister(
  actor: Actor,
  fullname: string,
  email: string
): Promise<RegistrationResult> {
  return actor.register(fullname, email);
}

export async function apiLogin(
  actor: Actor,
  email: string,
  password: string
): Promise<LoginResult> {
  return actor.login(email, password);
}

export async function apiLogout(actor: Actor, sessionToken: string): Promise<void> {
  return actor.logout(sessionToken);
}

export async function apiGetCurrentUser(
  actor: Actor,
  sessionToken: string
): Promise<UserPublic | null> {
  return actor.getCurrentUser(sessionToken);
}

// --- Exams ---
export async function apiCreateExam(
  actor: Actor,
  sessionToken: string,
  roleTitle: string,
  timerMinutes: bigint,
  passThresholdPercent: bigint
): Promise<ExamId> {
  return actor.createExam(sessionToken, roleTitle, timerMinutes, passThresholdPercent);
}

export async function apiSetExamStatus(
  actor: Actor,
  sessionToken: string,
  examId: ExamId,
  status: ExamStatus
): Promise<boolean> {
  return actor.setExamStatus(sessionToken, examId, status);
}

export async function apiListExams(
  actor: Actor,
  sessionToken: string
): Promise<ExamPublic[]> {
  return actor.listExams(sessionToken);
}

export async function apiGetExam(
  actor: Actor,
  sessionToken: string,
  examId: ExamId
): Promise<ExamPublic | null> {
  return actor.getExam(sessionToken, examId);
}

// --- Questions ---
export async function apiAddQuestion(
  actor: Actor,
  sessionToken: string,
  examId: ExamId,
  questionText: string,
  difficulty: Difficulty,
  options: string[],
  correctAnswer: string,
  aiGenerated: boolean
): Promise<QuestionId> {
  return actor.addQuestion(sessionToken, examId, questionText, difficulty, options, correctAnswer, aiGenerated);
}

export async function apiImportQuestions(
  actor: Actor,
  sessionToken: string,
  examId: ExamId,
  qs: Array<[string, Difficulty, string[], string]>
): Promise<bigint> {
  return actor.importQuestions(sessionToken, examId, qs);
}

export async function apiListQuestions(
  actor: Actor,
  sessionToken: string,
  examId: ExamId
): Promise<Question[]> {
  return actor.listQuestions(sessionToken, examId);
}

export async function apiGenerateQuestionsViaOllama(
  actor: Actor,
  sessionToken: string,
  examId: ExamId,
  role: string
): Promise<OllamaGenerationResult> {
  return actor.generateQuestionsViaOllama(sessionToken, examId, role);
}

// --- Sessions ---
export async function apiStartSession(
  actor: Actor,
  sessionToken: string,
  examId: ExamId
): Promise<SessionId> {
  return actor.startSession(sessionToken, examId);
}

export async function apiSubmitSession(
  actor: Actor,
  sessionToken: string,
  sessionId: SessionId,
  answerList: Array<[QuestionId, string]>,
  autoSubmit: boolean
): Promise<ExamResult> {
  return actor.submitSession(sessionToken, sessionId, answerList, autoSubmit);
}

export async function apiListSessions(
  actor: Actor,
  sessionToken: string,
  examId: ExamId | null
): Promise<ExamSessionPublic[]> {
  return actor.listSessions(sessionToken, examId);
}

// --- Proctoring ---
export async function apiLogProctoringEvent(
  actor: Actor,
  sessionToken: string,
  sessionId: SessionId,
  eventType: ProctoringEventType,
  metadata: string
): Promise<EventId> {
  return actor.logProctoringEvent(sessionToken, sessionId, eventType, metadata);
}

export async function apiStoreCameraFrame(
  actor: Actor,
  sessionToken: string,
  sessionId: SessionId,
  storageId: string,
  timestamp: bigint
): Promise<EventId> {
  return actor.storeCameraFrame(sessionToken, sessionId, storageId, timestamp);
}

export async function apiGetExamResult(
  actor: Actor,
  sessionToken: string,
  sessionId: SessionId
): Promise<ExamResult | null> {
  return actor.getExamResult(sessionToken, sessionId);
}
