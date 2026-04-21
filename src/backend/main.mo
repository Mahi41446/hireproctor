import Map "mo:core/Map";
import Types "types/hiring";
import HiringApi "mixins/hiring-api";

actor {
  // ── Auth state ──────────────────────────────────────────────────────────────
  let users      = Map.empty<Text, Types.User>();      // email → User
  let usersByNat = Map.empty<Nat, Types.User>();       // userId → User
  let sessions   = Map.empty<Text, Nat>();              // sessionToken → userId
  let nextUserId = { var value : Nat = 0 };

  // ── Exam state ──────────────────────────────────────────────────────────────
  let examMap      = Map.empty<Nat, Types.Exam>();
  let questionsMap = Map.empty<Nat, Types.Question>();
  let examSessions = Map.empty<Nat, Types.ExamSession>();
  let answersMap   = Map.empty<Nat, Types.Answer>();
  let procEvents   = Map.empty<Nat, Types.ProctoringEvent>();
  let examResults  = Map.empty<Nat, Types.ExamResult>();   // sessionId → stored result

  let nextExamId     = { var value : Nat = 0 };
  let nextQuestionId = { var value : Nat = 0 };
  let nextSessionId  = { var value : Nat = 0 };
  let nextAnswerId   = { var value : Nat = 0 };
  let nextEventId    = { var value : Nat = 0 };

  include HiringApi(
    users,
    usersByNat,
    sessions,
    nextUserId,
    examMap,
    questionsMap,
    examSessions,
    answersMap,
    procEvents,
    examResults,
    nextExamId,
    nextQuestionId,
    nextSessionId,
    nextAnswerId,
    nextEventId,
  );
};
