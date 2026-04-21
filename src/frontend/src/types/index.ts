import type {
  DifficultyBreakdown,
  ExamPublic,
  ExamResult,
  ExamSessionPublic,
  ProctoringEventCounts,
  Question,
  UserPublic,
} from "../backend";

export type {
  UserPublic,
  ExamPublic,
  Question,
  ExamSessionPublic,
  ExamResult,
  ProctoringEventCounts,
  DifficultyBreakdown,
};

export {
  Difficulty,
  ExamStatus,
  ProctoringEventType,
  SessionStatus,
  UserRole,
} from "../backend";

export interface AuthUser {
  userId: bigint;
  role: "admin" | "candidate";
  sessionToken: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserPublic | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, userId: bigint, role: "admin" | "candidate") => void;
  logout: () => Promise<void>;
}
