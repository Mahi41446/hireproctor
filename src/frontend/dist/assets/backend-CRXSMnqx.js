import "./index-CwS_SVxk.js";
async function apiRegister(actor, fullname, email) {
  return actor.register(fullname, email);
}
async function apiLogin(actor, email, password) {
  return actor.login(email, password);
}
async function apiCreateExam(actor, sessionToken, roleTitle, timerMinutes, passThresholdPercent) {
  return actor.createExam(sessionToken, roleTitle, timerMinutes, passThresholdPercent);
}
async function apiSetExamStatus(actor, sessionToken, examId, status) {
  return actor.setExamStatus(sessionToken, examId, status);
}
async function apiListExams(actor, sessionToken) {
  return actor.listExams(sessionToken);
}
async function apiGetExam(actor, sessionToken, examId) {
  return actor.getExam(sessionToken, examId);
}
async function apiImportQuestions(actor, sessionToken, examId, qs) {
  return actor.importQuestions(sessionToken, examId, qs);
}
async function apiListQuestions(actor, sessionToken, examId) {
  return actor.listQuestions(sessionToken, examId);
}
async function apiGenerateQuestionsViaOllama(actor, sessionToken, examId, role) {
  return actor.generateQuestionsViaOllama(sessionToken, examId, role);
}
async function apiStartSession(actor, sessionToken, examId) {
  return actor.startSession(sessionToken, examId);
}
async function apiSubmitSession(actor, sessionToken, sessionId, answerList, autoSubmit) {
  return actor.submitSession(sessionToken, sessionId, answerList, autoSubmit);
}
async function apiListSessions(actor, sessionToken, examId) {
  return actor.listSessions(sessionToken, examId);
}
async function apiLogProctoringEvent(actor, sessionToken, sessionId, eventType, metadata) {
  return actor.logProctoringEvent(sessionToken, sessionId, eventType, metadata);
}
async function apiStoreCameraFrame(actor, sessionToken, sessionId, storageId, timestamp) {
  return actor.storeCameraFrame(sessionToken, sessionId, storageId, timestamp);
}
async function apiGetExamResult(actor, sessionToken, sessionId) {
  return actor.getExamResult(sessionToken, sessionId);
}
export {
  apiLogin as a,
  apiRegister as b,
  apiListExams as c,
  apiListQuestions as d,
  apiCreateExam as e,
  apiSetExamStatus as f,
  apiImportQuestions as g,
  apiGenerateQuestionsViaOllama as h,
  apiLogProctoringEvent as i,
  apiSubmitSession as j,
  apiStoreCameraFrame as k,
  apiStartSession as l,
  apiGetExamResult as m,
  apiListSessions as n,
  apiGetExam as o
};
