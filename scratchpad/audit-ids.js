/* 저장 전수조사에 넣을 실제 id 들 — 각 앱의 자료를 직접 읽는다 */
const J = (app) => require("/home/user/k-history/node_modules/jiti")(`/home/user/k-history/${app}`, { alias: { "@": `/home/user/k-history/${app}/src` } });
const R = (app, f) => J(app)(`/home/user/k-history/${app}/src/${f}`);
module.exports = function ids() {
  const kh = R(".", "data/events/index.ts").ALL_EVENTS;
  const khExam = R(".", "data/locked-ids.ts").LOCKED_EXAM_IDS;
  const ch = R("comhwal", "data/concepts.ts").CONCEPTS;
  const chL = R("comhwal", "data/locked-ids.ts");
  const sq = R("sqld", "data/concepts.ts").CONCEPTS;
  const sqL = R("sqld", "data/locked-ids.ts");
  const toL = R("toeic", "data/locked-ids.ts");
  const gc = R("gisa", "data/concepts.ts").CONCEPTS;
  const gq = R("gisa", "data/questions.ts").QUESTIONS;
  const gp = R("gisa", "data/practical.ts").PRACTICAL_QUESTIONS;
  return {
    khlm: { events: kh.slice(0, 12).map((e) => ({ id: e.id, era: e.era })), exams: khExam.slice(0, 2) },
    comhwal: { concepts: ch.slice(0, 8).map((c) => ({ id: c.id, subject: c.subject })), formulas: chL.LOCKED_FORMULA_IDS.slice(0, 3), shortcuts: chL.LOCKED_SHORTCUT_IDS.slice(0, 3) },
    sqld: { concepts: sq.slice(0, 8).map((c) => ({ id: c.id, subject: c.subject })), tasks: sqL.LOCKED_TASK_IDS.slice(0, 3) },
    toeic: { vocab: toL.LOCKED_VOCAB_IDS.slice(0, 6), grammar: toL.LOCKED_GRAMMAR_IDS.slice(0, 4), questions: toL.LOCKED_QUESTION_IDS.slice(0, 6) },
    gisa: { concepts: gc.slice(0, 8).map((c) => ({ id: c.id, subject: c.subject })), questions: gq.slice(0, 6).map((q) => ({ id: q.id, keys: Object.keys(q).join(",") , src: q.conceptId ?? q.sourceId })), practical: gp.slice(0, 4).map((q) => ({ id: q.id, src: q.conceptId ?? q.sourceId, keys: Object.keys(q).join(",") })) },
  };
};
if (require.main === module) console.log(JSON.stringify(module.exports(), null, 1).slice(0, 3000));
