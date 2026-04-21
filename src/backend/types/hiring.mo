// Domain-specific types for the hiring tool: auth, exams, questions, sessions, answers, proctoring
import Common "common";

module {
  // ── Auth ────────────────────────────────────────────────────────────────────

  public type UserRole = { #admin; #candidate };

  public type User = {
    id          : Common.UserId;
    fullname    : Text;
    email       : Text;
    hashedPassword : Text;
    role        : UserRole;
    createdAt   : Common.Timestamp;
    var failedLoginAttempts : Nat;
    var lockedUntil         : ?Common.Timestamp;
  };

  public type RegistrationResult = {
    #ok  : { generatedPassword : Text };
    #err : { message : Text };
  };

  public type LoginResult = {
    #ok  : { userId : Common.UserId; role : UserRole; sessionToken : Text };
    #err : { message : Text; lockedUntilSecs : ?Int };
  };

  // ── Exam ─────────────────────────────────────────────────────────────────────

  public type ExamStatus = { #draft; #active; #closed };

  public type Exam = {
    id                   : Common.ExamId;
    roleTitle            : Text;
    timerMinutes         : Nat;
    passThresholdPercent : Nat;
    var status           : ExamStatus;
    createdAt            : Common.Timestamp;
  };

  // ── Question ─────────────────────────────────────────────────────────────────

  public type Difficulty = { #easy; #medium; #hard; #expert };

  public type Question = {
    id           : Common.QuestionId;
    examId       : Common.ExamId;
    questionText : Text;
    difficulty   : Difficulty;
    options      : [Text];
    correctAnswer : Text;
    aiGenerated  : Bool;
  };

  // ── ExamSession ──────────────────────────────────────────────────────────────

  public type SessionStatus = { #inProgress; #submitted; #autoSubmitted };

  public type ExamSession = {
    id          : Common.SessionId;
    examId      : Common.ExamId;
    candidateId : Common.UserId;
    startTime   : Common.Timestamp;
    var endTime : ?Common.Timestamp;
    var status  : SessionStatus;
  };

  // ── Answer ───────────────────────────────────────────────────────────────────

  public type Answer = {
    id         : Common.AnswerId;
    sessionId  : Common.SessionId;
    questionId : Common.QuestionId;
    userAnswer : Text;
    isCorrect  : Bool;
  };

  // ── Proctoring ───────────────────────────────────────────────────────────────

  public type ProctoringEventType = {
    #tabSwitch;
    #noiseBreach;
    #cameraFrame;
    #autoSubmit;
  };

  public type ProctoringEvent = {
    id        : Common.EventId;
    sessionId : Common.SessionId;
    eventType : ProctoringEventType;
    timestamp : Common.Timestamp;
    metadata  : Text;
  };

  // ── Result types ─────────────────────────────────────────────────────────────

  public type DifficultyBreakdown = {
    easy   : Nat;
    medium : Nat;
    hard   : Nat;
    expert : Nat;
  };

  public type ProctoringEventCounts = {
    tabSwitches     : Nat;
    noiseEvents     : Nat;
    framesCaptured  : Nat;
  };

  public type ExamResult = {
    totalCorrect           : Nat;
    totalQuestions         : Nat;
    perDifficultyBreakdown : DifficultyBreakdown;
    timeTakenSecs          : Nat;
    proctoringEventCounts  : ProctoringEventCounts;
    passed                 : Bool;
  };

  public type OllamaGenerationResult = {
    #ok  : [Question];
    #err : Text;
  };

  // ── Shared (non-mutable) public views ────────────────────────────────────────

  public type UserPublic = {
    id       : Common.UserId;
    fullname : Text;
    email    : Text;
    role     : UserRole;
  };

  public type ExamPublic = {
    id                   : Common.ExamId;
    roleTitle            : Text;
    timerMinutes         : Nat;
    passThresholdPercent : Nat;
    status               : ExamStatus;
    createdAt            : Common.Timestamp;
  };

  public type ExamSessionPublic = {
    id          : Common.SessionId;
    examId      : Common.ExamId;
    candidateId : Common.UserId;
    startTime   : Common.Timestamp;
    endTime     : ?Common.Timestamp;
    status      : SessionStatus;
  };
};
