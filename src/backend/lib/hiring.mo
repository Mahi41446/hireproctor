// Domain logic for the hiring tool: password helpers, exam result computation
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";
import Array "mo:core/Array";
import Types "../types/hiring";
import Common "../types/common";

module {
  // ── Constants ─────────────────────────────────────────────────────────────

  let SALT : Text = "hrtool_s4lt_";
  let MOD : Nat = 4294967296; // 2^32
  let LOCK_DURATION_NS : Int = 300_000_000_000; // 5 minutes in nanoseconds
  let MAX_ATTEMPTS : Nat = 3;

  // Unambiguous charset (no I, O, 0, 1, i, l)
  let charset : [Char] = [
    'A','B','C','D','E','F','G','H','J','K','L','M',
    'N','P','Q','R','S','T','U','V','W','X','Y','Z',
    'a','b','c','d','e','f','g','h','j','k','m','n',
    'p','q','r','s','t','u','v','w','x','y','z',
    '2','3','4','5','6','7','8','9',
  ];

  // ── Private helpers ────────────────────────────────────────────────────────

  func charToNat(c : Char) : Nat {
    c.toNat32().toNat();
  };

  let HEX_CHARS : [Char] = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

  func natToHex8(n : Nat) : Text {
    let n0 = n % MOD;
    Text.fromChar(HEX_CHARS[(n0 / 268435456) % 16])
    # Text.fromChar(HEX_CHARS[(n0 / 16777216) % 16])
    # Text.fromChar(HEX_CHARS[(n0 / 1048576) % 16])
    # Text.fromChar(HEX_CHARS[(n0 / 65536) % 16])
    # Text.fromChar(HEX_CHARS[(n0 / 4096) % 16])
    # Text.fromChar(HEX_CHARS[(n0 / 256) % 16])
    # Text.fromChar(HEX_CHARS[(n0 / 16) % 16])
    # Text.fromChar(HEX_CHARS[n0 % 16]);
  };

  func djb2(text : Text) : Nat {
    var h : Nat = 5381;
    for (c in text.chars()) {
      h := ((h * 33) + charToNat(c)) % MOD;
    };
    h;
  };

  func djb2v2(text : Text) : Nat {
    var h : Nat = 52711;
    for (c in text.chars()) {
      h := ((h * 31) + charToNat(c)) % MOD;
    };
    h;
  };

  // ── Password helpers ───────────────────────────────────────────────────────

  /// Hash a plain-text password. Returns a 64-char hex string using djb2 variants.
  public func hashPassword(plain : Text) : Text {
    let salted = SALT # plain;
    natToHex8(djb2(salted))
    # natToHex8(djb2v2(salted))
    # natToHex8(djb2(plain # SALT))
    # natToHex8(djb2v2(plain # SALT));
  };

  /// Verify a plain-text password against a stored hash.
  public func verifyPassword(plain : Text, hashed : Text) : Bool {
    hashPassword(plain) == hashed;
  };

  /// Generate a pseudo-random alphanumeric password of given length.
  /// `entropy` adds extra uniqueness (pass user count or other value).
  public func generatePassword(length : Nat, entropy : Nat) : Text {
    let seed = Int.abs(Time.now()) + entropy * 1_000_000;
    var h : Nat = seed % MOD;
    var result = "";
    var i = 0;
    while (i < length) {
      h := (h * 1664525 + 1013904223) % MOD;
      result := result # Text.fromChar(charset[h % charset.size()]);
      i += 1;
    };
    result;
  };

  // ── Lockout helpers ────────────────────────────────────────────────────────

  /// Check whether a user account is currently locked.
  public func isLocked(user : Types.User, nowNs : Common.Timestamp) : Bool {
    switch (user.lockedUntil) {
      case (?until) { nowNs < until };
      case null     { false };
    };
  };

  /// Record a failed login attempt; lock for 5 min if threshold reached.
  public func recordFailedAttempt(user : Types.User, nowNs : Common.Timestamp) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
      user.lockedUntil := ?(nowNs + LOCK_DURATION_NS);
    };
  };

  /// Reset failed login counter after a successful login.
  public func resetFailedAttempts(user : Types.User) {
    user.failedLoginAttempts := 0;
    user.lockedUntil := null;
  };

  // ── Exam result computation ─────────────────────────────────────────────────

  /// Compute the ExamResult from session data, questions, answers, and events.
  public func computeExamResult(
    session   : Types.ExamSession,
    questions : [Types.Question],
    answers   : [Types.Answer],
    events    : [Types.ProctoringEvent],
    threshold : Nat,
  ) : Types.ExamResult {
    let totalQuestions = questions.size();
    var totalCorrect = 0;
    var easyCorrect = 0;
    var mediumCorrect = 0;
    var hardCorrect = 0;
    var expertCorrect = 0;

    for (ans in answers.vals()) {
      if (ans.isCorrect) {
        totalCorrect += 1;
        switch (questions.find(func(q : Types.Question) : Bool { q.id == ans.questionId })) {
          case (?q) {
            switch (q.difficulty) {
              case (#easy)   { easyCorrect   += 1 };
              case (#medium) { mediumCorrect += 1 };
              case (#hard)   { hardCorrect   += 1 };
              case (#expert) { expertCorrect += 1 };
            };
          };
          case null {};
        };
      };
    };

    let timeTakenSecs : Nat = switch (session.endTime) {
      case (?endNs) {
        let diffNs = endNs - session.startTime;
        if (diffNs > 0) { Int.abs(diffNs) / 1_000_000_000 } else { 0 };
      };
      case null { 0 };
    };

    var tabSwitches = 0;
    var noiseEvents = 0;
    var framesCaptured = 0;
    for (ev in events.vals()) {
      switch (ev.eventType) {
        case (#tabSwitch)   { tabSwitches    += 1 };
        case (#noiseBreach) { noiseEvents    += 1 };
        case (#cameraFrame) { framesCaptured += 1 };
        case (#autoSubmit)  {};
      };
    };

    let passed = totalQuestions > 0
      and (totalCorrect * 100) / totalQuestions >= threshold;

    {
      totalCorrect;
      totalQuestions;
      perDifficultyBreakdown = {
        easy   = easyCorrect;
        medium = mediumCorrect;
        hard   = hardCorrect;
        expert = expertCorrect;
      };
      timeTakenSecs;
      proctoringEventCounts = { tabSwitches; noiseEvents; framesCaptured };
      passed;
    };
  };
};
