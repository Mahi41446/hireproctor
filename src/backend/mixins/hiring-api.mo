// Auth + exam API mixin for the hiring tool
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import Types "../types/hiring";
import Common "../types/common";
import HiringLib "../lib/hiring";

mixin (
  users          : Map.Map<Text, Types.User>,                  // email → User
  usersByNat     : Map.Map<Nat, Types.User>,                   // userId → User
  sessions       : Map.Map<Text, Nat>,                          // sessionToken → userId
  nextUserId     : { var value : Nat },
  examMap        : Map.Map<Nat, Types.Exam>,
  questions      : Map.Map<Nat, Types.Question>,
  examSessions   : Map.Map<Nat, Types.ExamSession>,
  answers        : Map.Map<Nat, Types.Answer>,
  procEvents     : Map.Map<Nat, Types.ProctoringEvent>,
  examResults    : Map.Map<Nat, Types.ExamResult>,             // sessionId → stored result
  nextExamId     : { var value : Nat },
  nextQuestionId : { var value : Nat },
  nextSessionId  : { var value : Nat },
  nextAnswerId   : { var value : Nat },
  nextEventId    : { var value : Nat },
) {

  // ── Internal helpers ───────────────────────────────────────────────────────

  func makeToken(userId : Nat, nowNs : Int) : Text {
    HiringLib.hashPassword(userId.toText() # "_" # nowNs.toText());
  };

  func nowNs() : Int { Time.now() };

  func requireSession(token : Text) : Types.User {
    let uid = switch (sessions.get(token)) {
      case (?id) { id };
      case null  { Runtime.trap("Unauthorized: invalid session") };
    };
    switch (usersByNat.get(uid)) {
      case (?u) { u };
      case null { Runtime.trap("Unauthorized: user not found") };
    };
  };

  func requireAdmin(token : Text) : Types.User {
    let user = requireSession(token);
    switch (user.role) {
      case (#admin) { user };
      case (_)      { Runtime.trap("Unauthorized: admin only") };
    };
  };

  func getQuestionsForExam(eid : Nat) : [Types.Question] {
    questions.values().toArray().filter(func(q : Types.Question) : Bool { q.examId == eid });
  };

  // ── IC management actor for HTTP outcalls ─────────────────────────────────

  type HttpHeader = { name : Text; value : Text };
  type HttpResponse = {
    status  : Nat;
    headers : [HttpHeader];
    body    : Blob;
  };
  type TransformArgs = { context : Blob; response : HttpResponse };
  type HttpRequest = {
    url                : Text;
    max_response_bytes : ?Nat64;
    headers            : [HttpHeader];
    body               : ?Blob;
    method             : { #get; #post; #head };
    transform          : ?{ function : shared query TransformArgs -> async HttpResponse; context : Blob };
  };

  let IC = actor "aaaaa-aa" : actor {
    http_request : HttpRequest -> async HttpResponse;
  };

  // ── Registration / Login ───────────────────────────────────────────────────

  /// Register a new user. First user automatically becomes admin.
  public shared func register(fullname : Text, email : Text) : async Types.RegistrationResult {
    if (users.containsKey(email)) {
      return #err { message = "Email already registered" };
    };
    let role : Types.UserRole = if (users.isEmpty()) { #admin } else { #candidate };
    let uid = nextUserId.value;
    nextUserId.value += 1;
    let pwd    = HiringLib.generatePassword(10, uid);
    let hashed = HiringLib.hashPassword(pwd);
    let user : Types.User = {
      id             = uid;
      fullname;
      email;
      hashedPassword = hashed;
      role;
      createdAt      = nowNs();
      var failedLoginAttempts = 0;
      var lockedUntil         = null;
    };
    users.add(email, user);
    usersByNat.add(uid, user);
    #ok { generatedPassword = pwd };
  };

  /// Log in with email + password. Returns session token on success.
  public shared func login(email : Text, password : Text) : async Types.LoginResult {
    let now = nowNs();
    let user = switch (users.get(email)) {
      case (?u) { u };
      case null { return #err { message = "Invalid email or password"; lockedUntilSecs = null } };
    };
    if (HiringLib.isLocked(user, now)) {
      let remainSecs : ?Int = switch (user.lockedUntil) {
        case (?t) { ?((t - now) / 1_000_000_000) };
        case null { null };
      };
      return #err { message = "Account locked. Try again later."; lockedUntilSecs = remainSecs };
    };
    if (not HiringLib.verifyPassword(password, user.hashedPassword)) {
      HiringLib.recordFailedAttempt(user, now);
      return #err { message = "Invalid email or password"; lockedUntilSecs = null };
    };
    HiringLib.resetFailedAttempts(user);
    let token = makeToken(user.id, now);
    sessions.add(token, user.id);
    #ok { userId = user.id; role = user.role; sessionToken = token };
  };

  /// Get the profile of the currently logged-in user.
  public query func getCurrentUser(sessionToken : Text) : async ?Types.UserPublic {
    switch (sessions.get(sessionToken)) {
      case (?uid) {
        switch (usersByNat.get(uid)) {
          case (?u) { ?{ id = u.id; fullname = u.fullname; email = u.email; role = u.role } };
          case null { null };
        };
      };
      case null { null };
    };
  };

  /// Invalidate a session token.
  public shared func logout(sessionToken : Text) : async () {
    sessions.remove(sessionToken);
  };

  /// Return total registered user count.
  public query func getUserCount() : async Nat { users.size() };

  // ── Exam CRUD ──────────────────────────────────────────────────────────────

  /// Create a new exam (admin only).
  public shared func createExam(
    sessionToken         : Text,
    roleTitle            : Text,
    timerMinutes         : Nat,
    passThresholdPercent : Nat,
  ) : async Common.ExamId {
    let _ = requireAdmin(sessionToken);
    let eid = nextExamId.value;
    nextExamId.value += 1;
    examMap.add(eid, {
      id                   = eid;
      roleTitle;
      timerMinutes;
      passThresholdPercent;
      var status           : Types.ExamStatus = #draft;
      createdAt            = nowNs();
    });
    eid;
  };

  /// Update exam status (admin only).
  public shared func setExamStatus(
    sessionToken : Text,
    examId       : Common.ExamId,
    status       : Types.ExamStatus,
  ) : async Bool {
    let _ = requireAdmin(sessionToken);
    switch (examMap.get(examId)) {
      case (?exam) { exam.status := status; true };
      case null    { false };
    };
  };

  /// List exams. Admins see all; candidates see only active.
  public query func listExams(sessionToken : Text) : async [Types.ExamPublic] {
    let user = requireSession(sessionToken);
    let all = examMap.values().toArray();
    let visible = switch (user.role) {
      case (#admin)     { all };
      case (#candidate) { all.filter(func(e : Types.Exam) : Bool { e.status == #active }) };
    };
    visible.map(func(e : Types.Exam) : Types.ExamPublic {
      { id = e.id; roleTitle = e.roleTitle; timerMinutes = e.timerMinutes;
        passThresholdPercent = e.passThresholdPercent; status = e.status; createdAt = e.createdAt }
    });
  };

  /// Get a single exam by id.
  public query func getExam(sessionToken : Text, examId : Common.ExamId) : async ?Types.ExamPublic {
    let _ = requireSession(sessionToken);
    switch (examMap.get(examId)) {
      case null { null };
      case (?e) {
        ?{ id = e.id; roleTitle = e.roleTitle; timerMinutes = e.timerMinutes;
           passThresholdPercent = e.passThresholdPercent; status = e.status; createdAt = e.createdAt }
      };
    };
  };

  // ── Question management ────────────────────────────────────────────────────

  /// Add a single question to an exam (admin only).
  public shared func addQuestion(
    sessionToken  : Text,
    examId        : Common.ExamId,
    questionText  : Text,
    difficulty    : Types.Difficulty,
    options       : [Text],
    correctAnswer : Text,
    aiGenerated   : Bool,
  ) : async Common.QuestionId {
    let _ = requireAdmin(sessionToken);
    let qid = nextQuestionId.value;
    nextQuestionId.value += 1;
    questions.add(qid, { id = qid; examId; questionText; difficulty; options; correctAnswer; aiGenerated });
    qid;
  };

  /// Bulk-import questions from Excel parse result (admin only).
  /// Each tuple: (questionText, difficulty, options, correctAnswer)
  public shared func importQuestions(
    sessionToken : Text,
    examId       : Common.ExamId,
    qs           : [(Text, Types.Difficulty, [Text], Text)],
  ) : async Nat {
    let _ = requireAdmin(sessionToken);
    var count = 0;
    for ((qtext, diff, opts, ans) in qs.vals()) {
      let qid = nextQuestionId.value;
      nextQuestionId.value += 1;
      questions.add(qid, {
        id = qid; examId; questionText = qtext; difficulty = diff;
        options = opts; correctAnswer = ans; aiGenerated = false;
      });
      count += 1;
    };
    count;
  };

  /// List questions for an exam (any authenticated user).
  public query func listQuestions(sessionToken : Text, examId : Common.ExamId) : async [Types.Question] {
    let _ = requireSession(sessionToken);
    getQuestionsForExam(examId);
  };

  // ── AI question generation via Ollama ──────────────────────────────────────

  /// Generate 4 questions (easy/medium/hard/expert) for a role via Ollama.
  /// Stores generated questions and returns them. Returns #err if Ollama is unreachable.
  public shared func generateQuestionsViaOllama(
    sessionToken : Text,
    examId       : Common.ExamId,
    role         : Text,
  ) : async Types.OllamaGenerationResult {
    let _ = requireAdmin(sessionToken);
    let prompt = "Generate exactly 4 technical interview questions for a " # role
      # ". Return ONLY a JSON array with this exact format and nothing else: "
      # "[{\"difficulty\":\"easy\",\"question\":\"...\"},"
      # "{\"difficulty\":\"medium\",\"question\":\"...\"},"
      # "{\"difficulty\":\"hard\",\"question\":\"...\"},"
      # "{\"difficulty\":\"expert\",\"question\":\"...\"}]";
    let body = "{\"model\":\"llama3\",\"prompt\":\"" # escapeJson(prompt) # "\",\"stream\":false}";
    let req : HttpRequest = {
      url                = "http://localhost:11434/api/generate";
      max_response_bytes = ?(32768 : Nat64);
      headers            = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Accept";       value = "application/json" },
      ];
      body               = ?body.encodeUtf8();
      method             = #post;
      transform          = null;
    };
    try {
      let resp = await IC.http_request(req);
      let bodyText = switch (resp.body.decodeUtf8()) {
        case (?t) { t };
        case null { return #err "Ollama returned non-UTF-8 response" };
      };
      // Ollama wraps model output in a "response" JSON string field
      let modelOutput = extractJsonStringField(bodyText, "response");
      let source = if (modelOutput.size() > 0) { modelOutput } else { bodyText };
      let parsed = parseOllamaQuestions(source, examId);
      switch (parsed) {
        case (#ok qs) {
          for (q in qs.vals()) { questions.add(q.id, q) };
          #ok qs
        };
        case (#err msg) { #err msg };
      };
    } catch (e) {
      #err ("Ollama unavailable: " # e.message());
    };
  };

  // ── Session lifecycle ──────────────────────────────────────────────────────

  /// Start an exam session for the calling candidate.
  public shared func startSession(sessionToken : Text, examId : Common.ExamId) : async Common.SessionId {
    let user = requireSession(sessionToken);
    let sid = nextSessionId.value;
    nextSessionId.value += 1;
    examSessions.add(sid, {
      id          = sid;
      examId;
      candidateId = user.id;
      startTime   = nowNs();
      var endTime : ?Common.Timestamp = null;
      var status  : Types.SessionStatus = #inProgress;
    });
    sid;
  };

  /// Submit answers and close a session. Computes and stores the ExamResult.
  public shared func submitSession(
    sessionToken : Text,
    sessionId    : Common.SessionId,
    answerList   : [(Common.QuestionId, Text)],
    autoSubmit   : Bool,
  ) : async Types.ExamResult {
    let user = requireSession(sessionToken);
    let now  = nowNs();
    let sess = switch (examSessions.get(sessionId)) {
      case (?s) { s };
      case null { Runtime.trap("Session not found") };
    };
    if (sess.candidateId != user.id) { Runtime.trap("Unauthorized: not your session") };
    if (sess.status != #inProgress)  { Runtime.trap("Session already submitted") };
    sess.endTime := ?now;
    sess.status  := if (autoSubmit) { #autoSubmitted } else { #submitted };

    // Log auto-submit event if applicable
    if (autoSubmit) {
      let eid = nextEventId.value;
      nextEventId.value += 1;
      procEvents.add(eid, { id = eid; sessionId; eventType = #autoSubmit; timestamp = now; metadata = "" });
    };

    let examQs = getQuestionsForExam(sess.examId);

    // Record answers and compute correctness
    let storedAnswers : [Types.Answer] = answerList.map(
      func((qid, ans) : (Common.QuestionId, Text)) : Types.Answer {
        let aid = nextAnswerId.value;
        nextAnswerId.value += 1;
        let correct = switch (examQs.find(func(q : Types.Question) : Bool { q.id == qid })) {
          case (?q) { q.correctAnswer == ans };
          case null { false };
        };
        let a : Types.Answer = { id = aid; sessionId; questionId = qid; userAnswer = ans; isCorrect = correct };
        answers.add(aid, a);
        a;
      }
    );

    let evArr = procEvents.values().toArray().filter(func(ev : Types.ProctoringEvent) : Bool { ev.sessionId == sessionId });

    let threshold = switch (examMap.get(sess.examId)) {
      case (?ex) { ex.passThresholdPercent };
      case null  { 0 };
    };

    let result = HiringLib.computeExamResult(sess, examQs, storedAnswers, evArr, threshold);
    examResults.add(sessionId, result);
    result;
  };

  // ── Proctoring ─────────────────────────────────────────────────────────────

  /// Log a proctoring event during an active session.
  public shared func logProctoringEvent(
    sessionToken : Text,
    sessionId    : Common.SessionId,
    eventType    : Types.ProctoringEventType,
    metadata     : Text,
  ) : async Common.EventId {
    let _ = requireSession(sessionToken);
    let eid = nextEventId.value;
    nextEventId.value += 1;
    procEvents.add(eid, { id = eid; sessionId; eventType; timestamp = nowNs(); metadata });
    eid;
  };

  /// Store a camera frame reference (storageId from object-storage) as a #cameraFrame proctoring event.
  public shared func storeCameraFrame(
    sessionToken : Text,
    sessionId    : Common.SessionId,
    storageId    : Text,
    timestamp    : Int,
  ) : async Common.EventId {
    let _ = requireSession(sessionToken);
    let eid = nextEventId.value;
    nextEventId.value += 1;
    procEvents.add(eid, { id = eid; sessionId; eventType = #cameraFrame; timestamp; metadata = storageId });
    eid;
  };

  /// Remove camera frame event records older than 7 days (admin only).
  /// Returns the number of events removed.
  public shared func cleanupOldCameraFrames(sessionToken : Text) : async Nat {
    let _ = requireAdmin(sessionToken);
    let sevenDaysNs : Int = 7 * 24 * 60 * 60 * 1_000_000_000;
    let cutoff = nowNs() - sevenDaysNs;
    let toRemove = procEvents.entries().toArray().filter(
      func((_, ev) : (Nat, Types.ProctoringEvent)) : Bool {
        ev.eventType == #cameraFrame and ev.timestamp < cutoff
      });
    for ((eid, _) in toRemove.vals()) {
      procEvents.remove(eid);
    };
    toRemove.size();
  };

  // ── Result retrieval ───────────────────────────────────────────────────────

  /// Retrieve the stored result for a completed session.
  public query func getExamResult(sessionToken : Text, sessionId : Common.SessionId) : async ?Types.ExamResult {
    let user = requireSession(sessionToken);
    switch (examSessions.get(sessionId)) {
      case null { return null };
      case (?sess) {
        if (sess.candidateId != user.id) {
          switch (user.role) {
            case (#admin) {};
            case (_)      { Runtime.trap("Unauthorized") };
          };
        };
        if (sess.status == #inProgress) { return null };
      };
    };
    examResults.get(sessionId);
  };

  /// Admin: list all sessions, optionally filtered by exam.
  public query func listSessions(sessionToken : Text, examId : ?Common.ExamId) : async [Types.ExamSessionPublic] {
    let _ = requireAdmin(sessionToken);
    let all = examSessions.values().toArray();
    let filtered = switch (examId) {
      case null   { all };
      case (?eid) { all.filter(func(s : Types.ExamSession) : Bool { s.examId == eid }) };
    };
    filtered.map(func(s : Types.ExamSession) : Types.ExamSessionPublic {
      { id = s.id; examId = s.examId; candidateId = s.candidateId;
        startTime = s.startTime; endTime = s.endTime; status = s.status }
    });
  };

  // ── Private: JSON helpers ──────────────────────────────────────────────────

  func escapeJson(s : Text) : Text {
    var r = "";
    for (c in s.chars()) {
      r #= switch c {
        case '\"' { "\\\"" };
        case '\\' { "\\\\" };
        case '\n' { "\\n"  };
        case '\r' { "\\r"  };
        case '\t' { "\\t"  };
        case _    { Text.fromChar(c) };
      };
    };
    r;
  };

  /// Naively extract a JSON string value for a field name.
  func extractJsonStringField(json : Text, field : Text) : Text {
    let key    = "\"" # field # "\":\"";
    let kchars = key.toArray();
    let chars  = json.toArray();
    let hlen   = chars.size();
    let klen   = kchars.size();
    var start  = hlen; // sentinel = not found
    var i = 0;
    while (i + klen <= hlen) {
      var match = true;
      var j = 0;
      while (j < klen) {
        if (chars[i + j] != kchars[j]) { match := false };
        j += 1;
      };
      if (match) { start := i + klen; i := hlen }; // found — stop
      i += 1;
    };
    if (start == hlen) { return "" };
    // Read until unescaped closing quote
    var result = "";
    var pos = start;
    var escaped = false;
    while (pos < hlen) {
      let c = chars[pos];
      if (escaped) {
        result #= Text.fromChar(c);
        escaped := false;
      } else if (c == '\\') {
        escaped := true;
      } else if (c == '\"') {
        return result;
      } else {
        result #= Text.fromChar(c);
      };
      pos += 1;
    };
    result;
  };

  func findNextChar(chars : [Char], needle : Char, fromIdx : Nat) : ?Nat {
    var i = fromIdx;
    while (i < chars.size()) {
      if (chars[i] == needle) { return ?i };
      i += 1;
    };
    null;
  };

  /// Parse a JSON array of {difficulty, question} objects from Ollama output.
  func parseOllamaQuestions(text : Text, examId : Common.ExamId) : Types.OllamaGenerationResult {
    let chars  = text.toArray();
    let len    = chars.size();
    // Find '[' 
    let arrayStart = switch (findNextChar(chars, '[', 0)) {
      case null { return #err "No JSON array found in Ollama response" };
      case (?i) { i };
    };
    var result : [Types.Question] = [];
    var pos = arrayStart + 1;
    while (pos < len and result.size() < 10) {
      switch (findNextChar(chars, '{', pos)) {
        case null { pos := len };
        case (?objStart) {
          switch (findNextChar(chars, '}', objStart + 1)) {
            case null { pos := len };
            case (?objEnd) {
              // Build the object substring
              var objText = "";
              var k = objStart;
              while (k <= objEnd) { objText #= Text.fromChar(chars[k]); k += 1 };
              let diffStr = extractJsonStringField(objText, "difficulty");
              let qText   = extractJsonStringField(objText, "question");
              if (qText.size() > 0) {
                let difficulty : Types.Difficulty = switch (diffStr) {
                  case "easy"   { #easy   };
                  case "medium" { #medium };
                  case "hard"   { #hard   };
                  case "expert" { #expert };
                  case _        { #medium };
                };
                let qid = nextQuestionId.value;
                nextQuestionId.value += 1;
                result := result.concat([{
                  id = qid; examId; questionText = qText; difficulty;
                  options = []; correctAnswer = ""; aiGenerated = true;
                }]);
              };
              pos := objEnd + 1;
            };
          };
        };
      };
    };
    if (result.size() == 0) {
      #err "No questions could be parsed from Ollama response"
    } else {
      #ok result
    };
  };
};
