import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface UserPublic {
    id: UserId;
    role: UserRole;
    email: string;
    fullname: string;
}
export type EventId = bigint;
export type QuestionId = bigint;
export type SessionId = bigint;
export type RegistrationResult = {
    __kind__: "ok";
    ok: {
        generatedPassword: string;
    };
} | {
    __kind__: "err";
    err: {
        message: string;
    };
};
export interface ProctoringEventCounts {
    noiseEvents: bigint;
    framesCaptured: bigint;
    tabSwitches: bigint;
}
export type OllamaGenerationResult = {
    __kind__: "ok";
    ok: Array<Question>;
} | {
    __kind__: "err";
    err: string;
};
export interface ExamPublic {
    id: ExamId;
    status: ExamStatus;
    createdAt: Timestamp;
    roleTitle: string;
    timerMinutes: bigint;
    passThresholdPercent: bigint;
}
export type ExamId = bigint;
export type UserId = bigint;
export interface DifficultyBreakdown {
    easy: bigint;
    hard: bigint;
    expert: bigint;
    medium: bigint;
}
export interface ExamSessionPublic {
    id: SessionId;
    startTime: Timestamp;
    status: SessionStatus;
    endTime?: Timestamp;
    examId: ExamId;
    candidateId: UserId;
}
export type LoginResult = {
    __kind__: "ok";
    ok: {
        userId: UserId;
        role: UserRole;
        sessionToken: string;
    };
} | {
    __kind__: "err";
    err: {
        lockedUntilSecs?: bigint;
        message: string;
    };
};
export interface Question {
    id: QuestionId;
    difficulty: Difficulty;
    correctAnswer: string;
    questionText: string;
    examId: ExamId;
    options: Array<string>;
    aiGenerated: boolean;
}
export interface ExamResult {
    totalCorrect: bigint;
    timeTakenSecs: bigint;
    totalQuestions: bigint;
    perDifficultyBreakdown: DifficultyBreakdown;
    passed: boolean;
    proctoringEventCounts: ProctoringEventCounts;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    expert = "expert",
    medium = "medium"
}
export enum ExamStatus {
    closed = "closed",
    active = "active",
    draft = "draft"
}
export enum ProctoringEventType {
    autoSubmit = "autoSubmit",
    tabSwitch = "tabSwitch",
    noiseBreach = "noiseBreach",
    cameraFrame = "cameraFrame"
}
export enum SessionStatus {
    autoSubmitted = "autoSubmitted",
    submitted = "submitted",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    candidate = "candidate"
}
export interface backendInterface {
    addQuestion(sessionToken: string, examId: ExamId, questionText: string, difficulty: Difficulty, options: Array<string>, correctAnswer: string, aiGenerated: boolean): Promise<QuestionId>;
    cleanupOldCameraFrames(sessionToken: string): Promise<bigint>;
    createExam(sessionToken: string, roleTitle: string, timerMinutes: bigint, passThresholdPercent: bigint): Promise<ExamId>;
    generateQuestionsViaOllama(sessionToken: string, examId: ExamId, role: string): Promise<OllamaGenerationResult>;
    getCurrentUser(sessionToken: string): Promise<UserPublic | null>;
    getExam(sessionToken: string, examId: ExamId): Promise<ExamPublic | null>;
    getExamResult(sessionToken: string, sessionId: SessionId): Promise<ExamResult | null>;
    getUserCount(): Promise<bigint>;
    importQuestions(sessionToken: string, examId: ExamId, qs: Array<[string, Difficulty, Array<string>, string]>): Promise<bigint>;
    listExams(sessionToken: string): Promise<Array<ExamPublic>>;
    listQuestions(sessionToken: string, examId: ExamId): Promise<Array<Question>>;
    listSessions(sessionToken: string, examId: ExamId | null): Promise<Array<ExamSessionPublic>>;
    logProctoringEvent(sessionToken: string, sessionId: SessionId, eventType: ProctoringEventType, metadata: string): Promise<EventId>;
    login(email: string, password: string): Promise<LoginResult>;
    logout(sessionToken: string): Promise<void>;
    register(fullname: string, email: string): Promise<RegistrationResult>;
    setExamStatus(sessionToken: string, examId: ExamId, status: ExamStatus): Promise<boolean>;
    startSession(sessionToken: string, examId: ExamId): Promise<SessionId>;
    storeCameraFrame(sessionToken: string, sessionId: SessionId, storageId: string, timestamp: bigint): Promise<EventId>;
    submitSession(sessionToken: string, sessionId: SessionId, answerList: Array<[QuestionId, string]>, autoSubmit: boolean): Promise<ExamResult>;
}
