// Cross-cutting types shared across all domains
module {
  public type UserId = Nat;
  public type ExamId = Nat;
  public type QuestionId = Nat;
  public type SessionId = Nat;
  public type AnswerId = Nat;
  public type EventId = Nat;
  public type Timestamp = Int; // nanoseconds from Time.now()
};
