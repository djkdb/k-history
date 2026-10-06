/*
 * 저장 전수조사 — 다섯 앱의 모든 기록이 제대로 남는가.
 *
 * 감사용 판(NEXT_PUBLIC_STORAGE_AUDIT=1, out-audit/)을 한 주소에 띄우고,
 * 실제 크롬 프로필(껐다 켜면 남는 것)로 다음을 본다.
 *
 *   ① 빠진 칸      — 스토어의 모든 칸이 저장 목록(partialize)에 있는가
 *   ② 모든 동작    — 저장 동작 하나하나를 실제로 불러, 바뀐 것이 IndexedDB 와
 *                    거울(localStorage) 둘 다에 그대로 적히는가
 *   ③ 새로고침     — 다시 열면 똑같이 돌아오는가
 *   ④ 껐다 켜기    — 브라우저를 완전히 껐다 켜도 남는가
 *   ⑤ 여는 동안    — 불러오기가 끝나기 전에 빈 값으로 덮어쓰지 않는가
 *   ⑥ 한쪽이 지워져도 — IndexedDB 만 / 거울만 남아도 되살아나는가
 *   ⑦ 옛 저장본    — 칸 하나가 없는 예전 기록을 불러도 나머지는 그대로이고
 *                    없는 칸은 기본값으로 채워지는가 (모든 칸마다)
 *   ⑧ 백업        — 파일로 저장 → 초기화 → 되돌리기 하면 그대로인가
 *   ⑨ 망 없이     — 비행기 모드에서 푼 것도 남는가
 *   ⑩ 두 창       — 같은 앱을 두 창에 띄우고 번갈아 풀면 둘 다 남는가
 *   ⑪ 서로 안 섞임 — 한 앱을 초기화해도 다른 앱 기록은 그대로인가
 *   ⑫ 화면        — 다시 연 화면에 오류·NaN·undefined 가 없는가
 *
 *   node scratchpad/storage-audit.js
 */
const { chromium, devices } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = "/home/user/k-history/out-audit";
const PROFILE = "/tmp/claude-0/-home-user-k-history/722826a7-4a03-5af7-906f-5a177ee33ccd/scratchpad/audit-profile";
const PORT = 7400, SITE = `http://127.0.0.1:${PORT}`;
const MIME = { ".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".txt":"text/plain",".webp":"image/webp",".wasm":"application/wasm" };
function 찾기(u) {
  const p = path.join(ROOT, u);
  const 후보 = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")];
  for (const f of 후보) { try { if (fs.statSync(f).isFile()) return [200, f]; } catch {} }
  let d = path.dirname(p);
  while (d.startsWith(ROOT)) { const f = path.join(d, "404.html"); if (fs.existsSync(f)) return [404, f]; if (d === ROOT) break; d = path.dirname(d); }
  return [404, null];
}
const srv = http.createServer((q, r) => {
  const [code, f] = 찾기(decodeURIComponent(q.url.split("?")[0]));
  if (!f) { r.writeHead(404); return r.end("x"); }
  r.writeHead(code, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
  r.end(fs.readFileSync(f));
});

const ID = require("./audit-ids.js")();
const now = Date.UTC(2026, 9, 6, 3, 0, 0);
const 시 = (분) => now + 분 * 60000;

/* 앱마다: 저장 이름 · 저장소 이름 · 저장하지 않기로 한 칸 · 모든 동작 */
const APPS = [
  {
    key: "khlm", base: "/history", store: "khlm-state", db: "khlm", mirror: "khlm:mirror:khlm-state", 임시: ["hydrated"],
    동작: (() => { const e = ID.khlm.events, x = ID.khlm.exams; return [
      ["setExam", [{ examType: "korean-history-test", examLabel: "제80회 한국사능력검정시험", examDate: "2026-10-17", track: "advanced", round: 80 }], ["exam"]],
      ["markStudied", [e[0].id], ["studiedEventIds", "reviewCards", "stats"]],
      ["markStudied", [e[0].id], []],
      ["recordQuizResult", [{ questionId: "q-감사-1", eventId: e[1].id, era: e[1].era, type: "multiple", correct: false, answeredAt: 시(1) }], ["quizHistory", "wrongEventIds", "reviewCards"]],
      ["recordQuizResult", [{ questionId: "q-감사-2", eventId: e[1].id, era: e[1].era, type: "ox", correct: true, answeredAt: 시(2) }], ["quizHistory", "wrongEventIds", "reviewCards"]],
      ["reviewEvent", [e[0].id, true], ["reviewCards"]],
      ["reviewEvent", [e[2].id, false], ["reviewCards"]],
      ["recordMockAttempt", [{ examId: x[0], startedAt: 시(10), finishedAt: 시(80), answers: { 1: 2, 2: 4, 3: 1 }, score: 72, total: 100 }, [e[3].id, e[4].id]], ["mockAttempts", "wrongEventIds", "reviewCards", "stats"]],
      ["recordMockAttempt", [{ examId: x[0], startedAt: 시(10), finishedAt: 시(81), answers: { 1: 2, 2: 4, 3: 3 }, score: 74, total: 100 }, [e[3].id]], ["mockAttempts"]],
      ["addStudyMinutes", [15], ["stats"]],
    ]; })(),
  },
  {
    key: "comhwal", base: "/comhwal", store: "comhwal-state", db: "comhwal", mirror: "comhwal:mirror:comhwal-state", 임시: ["hydrated", "examRunning"],
    동작: (() => { const c = ID.comhwal.concepts, f = ID.comhwal.formulas, k = ID.comhwal.shortcuts; return [
      ["setSettings", [{ grade: 1, kind: "written", examDate: "2026-11-20" }], ["settings"]],
      ["setGrade", [2], ["settings"]],
      ["markStudied", [c[0].id], ["studiedIds"]],
      ["recordQuizResult", [{ questionId: "q-감사-1", sourceId: c[1].id, subject: c[1].subject, type: "multiple", correct: false, answeredAt: 시(1) }], ["quizHistory", "wrongIds"]],
      ["recordQuizResult", [{ questionId: "q-감사-2", sourceId: c[1].id, subject: c[1].subject, type: "trap", correct: true, answeredAt: 시(2) }], ["quizHistory"]],
      ["recordPractice", ["formula", f[0], true], ["clearedFormulaIds"]],
      ["recordPractice", ["shortcut", k[0], true], ["clearedShortcutIds"]],
      ["recordPractice", ["formula", f[1], false], null],
      ["reviewItem", [c[0].id, true], ["reviewCards"]],
      ["recordMockAttempt", [{ examId: "mock-감사", startedAt: 시(10), finishedAt: 시(70), answers: { 1: 1 }, bySubject: [{ subject: "computer", correct: 15, total: 20 }], score: 75, total: 100, seed: 7, qids: ["q1", "q2"], fmt: 2, wrongSourceIds: [c[2].id] }, [c[2].id]], ["mockAttempts"]],
      ["addStudyMinutes", [10], ["stats"]],
      ["recordGameBest", ["ox", 7], ["gameBest"]],
      ["recordGameBest", ["keys", 5], ["gameBest"]],
      ["recordGameBest", ["match", 40], ["gameBest"]],
      ["recordGameBest", ["match", 55], []],
      ["setExamRunning", [true], [], "examRunning"],
      ["setExamRunning", [false], [], "examRunning"],
    ]; })(),
  },
  {
    key: "sqld", base: "/sqld", store: "sqld-state", db: "sqld", mirror: "sqld:mirror:sqld-state", 임시: ["hydrated"],
    동작: (() => { const c = ID.sqld.concepts, t = ID.sqld.tasks; return [
      ["setSettings", [{ examDate: "2026-11-15", showSchema: true }], ["settings"]],
      ["setExamDate", ["2026-12-01"], ["settings"]],
      ["setShowSchema", [false], ["settings"]],
      ["markStudied", [c[0].id], ["studiedIds"]],
      ["recordQuizResult", [{ questionId: "q-감사-1", sourceId: c[1].id, subject: c[1].subject, type: "multiple", correct: false, answeredAt: 시(1) }], ["quizHistory", "wrongIds"]],
      ["recordSqlResult", [t[0], true], ["clearedSqlIds"]],
      ["recordSqlResult", [t[1], false], null],
      ["reviewItem", [c[0].id, true], ["reviewCards"]],
      ["recordMockAttempt", [{ startedAt: 시(10), finishedAt: 시(100), answers: { 1: 2 }, bySubject: [{ subject: "sql", correct: 25, total: 40 }], correct: 33, total: 50, score: 66 }, [c[2].id]], ["mockAttempts"]],
    ]; })(),
  },
  {
    key: "toeic", base: "/toeic", store: "toeic-state", db: "toeic", mirror: "toeic:mirror:toeic-state", 임시: ["hydrated"],
    동작: (() => { const v = ID.toeic.vocab, g = ID.toeic.grammar, q = ID.toeic.questions; return [
      ["setSettings", [{ band: 800, examDate: "2026-11-29", speechRate: 1, showScript: false }], ["settings"]],
      ["setBand", [700], ["settings"]],
      ["setSpeechRate", [1.1], ["settings"]],
      ["setShowScript", [true], ["settings"]],
      ["setNoise", ["cafe", 0.4], ["settings"]],
      ["setOnePlay", [true], ["settings"]],
      ["markVocabKnown", [v[0]], ["knownVocabIds"]],
      ["markVocabKnown", [v[1]], ["knownVocabIds"]],
      ["unmarkVocabKnown", [v[1]], ["knownVocabIds"]],
      ["markGrammarStudied", [g[0]], ["studiedGrammarIds"]],
      ["recordAnswer", [q[0], true], ["clearedQuestionIds"]],
      ["recordAnswer", [q[1], false], ["wrongIds"]],
      ["reviewItem", [v[0], false], ["reviewCards"]],
      ["recordMockAttempt", [{ examId: "mock-감사", startedAt: 시(10), finishedAt: 시(130), answers: { 1: 0 }, byPart: [{ part: 5, correct: 20, total: 30 }], correct: 150, total: 200, scaled: { listening: 400, reading: 380, total: 780 }, seed: 3, qids: ["a"], fmt: 2, wrongIds: [q[2]] }, [q[2]]], ["mockAttempts"]],
      ["addStudyMinutes", [12], ["stats"]],
      ["recordPreview", [3000], ["previewRuns"]],
    ]; })(),
  },
  {
    key: "gisa", base: "/gisa", store: "gisa-state", db: "gisa", mirror: "gisa:mirror:gisa-state", 임시: ["hydrated"],
    동작: (() => { const c = ID.gisa.concepts, q = ID.gisa.questions, p = ID.gisa.practical; return [
      ["setSettings", [{ track: "written", examDate: "2027-03-01" }], ["settings"]],
      ["setTrack", ["practical"], ["settings"]],
      ["setExamDate", ["2027-04-19"], ["settings"]],
      ["markStudied", [c[0].id], ["studiedIds", "studiedAt"]],
      ["recordAnswer", [q[0].id, q[0].src, false], ["questionMisses", "wrongIds"]],
      ["recordAnswer", [q[1].id, q[1].src, true], ["clearedQuestionIds"]],
      ["recordPractical", [p[0].id, p[0].src, true], ["clearedPracticalIds"]],
      ["recordPractical", [p[1].id, p[1].src, false], null],
      // 공부하지 않은 개념을 맞혔다고 복습 카드를 만들지는 않는다 (의도) — 틀리면 생긴다
      ["reviewItem", [c[1].id, true], ["stats"]],
      ["reviewItem", [c[1].id, false], ["reviewCards", "wrongIds"]],
      ["reviewItem", [c[1].id, true], ["reviewCards", "wrongIds"]],
      ["recordQuiz", [{ quizId: "quiz-감사", takenAt: 시(5), total: 10, correct: 7, track: "written" }], ["quizHistory"]],
      ["recordMockAttempt", [{ track: "written", startedAt: 시(10), finishedAt: 시(160), score: 65, passed: true, bySubject: [{ subject: "design", correct: 14, total: 20 }], earned: 65, max: 100, fmt: 2, seed: 3, qids: [q[2].id], picks: { 0: 1 }, wrongSourceIds: [c[2].id] }, [c[2].id], [q[2].id]], ["mockAttempts"]],
      ["addStudyMinutes", [20], ["stats"]],
    ]; })(),
  },
];

let 문제 = 0, 통과 = 0;
const ok = (m) => { 통과++; if (process.env.VERBOSE) console.log("  ✓ " + m); };
const no = (m) => { 문제++; console.log("  ✗ " + m); };
const 바름 = (x) => x === undefined ? "undefined" : JSON.stringify(x, (k, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v);
const 같다 = (a, b) => 바름(a) === 바름(b);
const 다른칸 = (a, b) => [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])].filter((k) => !같다(a?.[k], b?.[k]));

/* 페이지 안에서 쓰는 것들 */
const 기다림 = (p) => p.waitForFunction(() => window.__appStore?.getState().hydrated === true, null, { timeout: 30000 });
const 저장할것 = (p) => p.evaluate(() => { const s = window.__appStore; return JSON.parse(JSON.stringify(s.persist.getOptions().partialize(s.getState()))); });
const 처음값 = (p) => p.evaluate(() => { const s = window.__appStore; return JSON.parse(JSON.stringify(s.persist.getOptions().partialize(s.getInitialState()))); });
const 날것 = (p, app) => p.evaluate(async ({ db, store, mirror }) => {
  let m = null; try { m = localStorage.getItem(mirror); } catch {}
  const 있나 = (await indexedDB.databases()).some((d) => d.name === db);
  let i = null;
  if (있나) {
    i = await new Promise((res) => {
      const rq = indexedDB.open(db);
      rq.onsuccess = () => { const d = rq.result; if (!d.objectStoreNames.contains("state")) { d.close(); return res("(저장 칸 없음)"); }
        const g = d.transaction("state").objectStore("state").get(store); g.onsuccess = () => { d.close(); res(g.result ?? null); }; g.onerror = () => { d.close(); res(null); }; };
      rq.onerror = () => res(null);
    });
  }
  const 풀기 = (x) => { try { return x == null ? null : JSON.parse(x).state; } catch { return "(깨짐)"; } };
  return { idb: 풀기(i), mirror: 풀기(m), 있나 };
}, app);
const 심기 = (p, app, state) => p.evaluate(async ({ db, store, mirror, state }) => {
  const v = JSON.stringify({ state, version: 0 });
  localStorage.setItem(mirror, v);
  await new Promise((res, rej) => {
    const rq = indexedDB.open(db, 1);
    rq.onupgradeneeded = () => { if (!rq.result.objectStoreNames.contains("state")) rq.result.createObjectStore("state"); };
    rq.onsuccess = () => { const d = rq.result; const t = d.transaction("state", "readwrite"); t.objectStore("state").put(v, store); t.oncomplete = () => { d.close(); res(); }; t.onerror = () => rej(t.error); };
    rq.onerror = () => rej(rq.error);
  });
}, { ...app, state });
const 지우기DB = (p, db) => p.evaluate((db) => new Promise((res) => { const r = indexedDB.deleteDatabase(db); r.onsuccess = () => res("지움"); r.onerror = () => res("실패"); r.onblocked = () => res("막힘"); }), db);
const 쉼 = (ms) => new Promise((r) => setTimeout(r, ms));

/* 화면이 멀쩡한가 */
async function 화면(p, app, 때) {
  const 글 = await p.evaluate(() => document.body.innerText);
  const 나쁜 = ["NaN", "undefined", "[object Object]", "Invalid Date"].filter((x) => 글.includes(x));
  if (나쁜.length) no(`${app.key} ${때}: 화면에 ${나쁜.join(", ")} 이(가) 보인다`); else ok(`${app.key} ${때}: 화면 멀쩡`);
}

async function 열기(ctx, u) {
  const p = ctx.pages()[0] || (await ctx.newPage());
  return p;
}

(async () => {
  await new Promise((r) => srv.listen(PORT, r));
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const 켜기 = () => chromium.launchPersistentContext(PROFILE, { executablePath: "/opt/pw-browsers/chromium", ...devices["Pixel 7"], acceptDownloads: true });
  let ctx = await 켜기();
  let p = await 열기(ctx);
  const 오류 = []; const 붙임 = (pg) => pg.on("pageerror", (e) => 오류.push(new URL(pg.url()).pathname + " " + String(e).slice(0, 120)));
  붙임(p);
  const S = {}, 처음 = {};

  for (const app of APPS) {
    console.log(`\n━━━ ${app.key} (${app.base}) — ①② 모든 칸·모든 동작`);
    await p.goto(SITE + app.base + "/"); await 기다림(p);
    const 정보 = await p.evaluate(() => { const s = window.__appStore; const st = s.getState(); const o = s.persist.getOptions();
      return { 칸: Object.keys(st).filter((k) => typeof st[k] !== "function"), 동작: Object.keys(st).filter((k) => typeof st[k] === "function"), 저장칸: Object.keys(o.partialize(st)), 이름: o.name }; });
    if (정보.이름 === app.store) ok("저장 이름 그대로"); else no(`${app.key}: 저장 이름이 ${정보.이름} 으로 바뀌었다 (기존 기록을 못 찾는다)`);
    const 빠진 = 정보.칸.filter((k) => !정보.저장칸.includes(k) && !app.임시.includes(k));
    if (빠진.length) no(`${app.key}: 저장 목록에 없는 칸 ${빠진.join(", ")} — 다시 열면 사라진다`); else ok(`칸 ${정보.칸.length}개 중 저장 ${정보.저장칸.length}개, 빠진 것 없음`);
    const 임시인데저장 = app.임시.filter((k) => 정보.저장칸.includes(k));
    if (임시인데저장.length) no(`${app.key}: 저장하면 안 되는 칸을 저장한다 ${임시인데저장}`);
    const 안부른 = 정보.동작.filter((f) => f !== "resetAll" && !app.동작.some(([n]) => n === f));
    if (안부른.length) no(`${app.key}: 전수조사표에 없는 동작 ${안부른.join(", ")}`); else ok(`동작 ${정보.동작.length}개 모두 조사표에 있다`);
    처음[app.key] = await 처음값(p);
    console.log(`    칸 ${정보.칸.length} · 저장 칸 ${정보.저장칸.length} · 동작 ${정보.동작.length} · 조사할 부름 ${app.동작.length}`);

    for (const [이름, 인자, 바뀔것, 임시칸] of app.동작) {
      const 전 = await 저장할것(p);
      const 전임시 = 임시칸 ? await p.evaluate((k) => window.__appStore.getState()[k], 임시칸) : null;
      const 잘못 = await p.evaluate(([n, a]) => { try { window.__appStore.getState()[n](...a); return null; } catch (e) { return String(e); } }, [이름, 인자]);
      if (잘못) { no(`${app.key}.${이름}: 부르다 오류 ${잘못}`); continue; }
      await 쉼(250);
      const 후 = await 저장할것(p);
      const 날 = await 날것(p, app);
      const 바뀐 = 다른칸(전, 후);
      const 표 = `${app.key}.${이름}(${JSON.stringify(인자).slice(1, 50)})`;
      if (!같다(날.idb, 후)) no(`${표}: IndexedDB 에 적힌 것이 지금 기록과 다르다 (${다른칸(날.idb, 후).join(",")})`); else ok(`${표}: IndexedDB 일치`);
      if (!같다(날.mirror, 후)) no(`${표}: 거울에 적힌 것이 지금 기록과 다르다 (${다른칸(날.mirror, 후).join(",")})`); else ok(`${표}: 거울 일치`);
      if (임시칸) {
        const 후임시 = await p.evaluate((k) => window.__appStore.getState()[k], 임시칸);
        if (같다(전임시, 후임시)) no(`${표}: ${임시칸} 이 바뀌지 않았다`);
        if (바뀐.length) no(`${표}: 저장하지 않을 값인데 저장본이 바뀌었다 (${바뀐})`); else ok(`${표}: 저장본 그대로 (임시 값)`);
      } else if (Array.isArray(바뀔것) && 바뀔것.length === 0) {
        if (바뀐.length) no(`${표}: 바뀌면 안 되는데 ${바뀐.join(",")} 이 바뀌었다`); else ok(`${표}: 그대로 (되풀이·더 나쁜 기록)`);
      } else if (Array.isArray(바뀔것)) {
        const 안바뀐 = 바뀔것.filter((k) => !바뀐.includes(k));
        if (안바뀐.length) no(`${표}: ${안바뀐.join(",")} 이 바뀌어야 하는데 그대로다 (바뀐 것: ${바뀐.join(",") || "없음"})`); else ok(`${표}: ${바뀔것.join(",")} 반영`);
      }
    }
    S[app.key] = await 저장할것(p);

    console.log(`━━━ ${app.key} — ③ 새로고침`);
    await p.reload(); await 기다림(p); await 쉼(400);
    const 다시 = await 저장할것(p);
    if (같다(다시, S[app.key])) ok("새로고침 뒤 그대로"); else no(`${app.key}: 새로고침 뒤 달라진 칸 ${다른칸(다시, S[app.key])}`);
    // 서비스 워커가 다 받아 둘 때까지 (⑨ 에서 망을 끊는다)
    for (let i = 0; i < 240; i++) { if (await p.evaluate(async (s) => { const r = await navigator.serviceWorker.getRegistration(s); return !!(r && r.scope === new URL(s, location.href).href && r.active?.state === "activated"); }, app.base + "/")) break; await 쉼(250); }
  }

  console.log("\n━━━ ④⑤ 브라우저를 완전히 껐다 켠다");
  await ctx.close();
  ctx = await 켜기();
  await ctx.addInitScript(() => {
    // 불러오기 중에 무엇을 적는지 모두 적어 둔다
    window.__적은것 = [];
    const 원래 = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (v, k) { try { window.__적은것.push({ db: this.transaction.db.name, k, v: typeof v === "string" ? v : null, 불러옴: !!window.__appStore?.getState().hydrated }); } catch {} return 원래.apply(this, arguments); };
    const 원래2 = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { try { if (String(k).includes(":mirror:")) window.__적은것.push({ db: "거울", k, v, 불러옴: !!window.__appStore?.getState().hydrated }); } catch {} return 원래2.apply(this, arguments); };
  });
  p = await 열기(ctx); 붙임(p);
  for (const app of APPS) {
    await p.goto(SITE + app.base + "/"); await 기다림(p); await 쉼(1500);
    const 다시 = await 저장할것(p);
    if (같다(다시, S[app.key])) ok(`${app.key}: 껐다 켜도 그대로`); else no(`${app.key}: 껐다 켠 뒤 달라진 칸 ${다른칸(다시, S[app.key])}`);
    const 날 = await 날것(p, app);
    if (!같다(날.idb, S[app.key]) || !같다(날.mirror, S[app.key])) no(`${app.key}: 껐다 켠 뒤 저장소가 다르다 idb:${다른칸(날.idb, S[app.key])} 거울:${다른칸(날.mirror, S[app.key])}`);
    const 적은 = await p.evaluate(() => window.__적은것);
    const 덮음 = 적은.filter((w) => w.v && w.k && String(w.k).includes(app.store)).filter((w) => { try { return !같다(JSON.parse(w.v).state, S[app.key]); } catch { return true; } });
    if (덮음.length) no(`${app.key}: 여는 동안 다른 값을 ${덮음.length}번 적었다 — 예: ${다른칸(JSON.parse(덮음[0].v).state, S[app.key])} (불러오기 ${덮음[0].불러옴 ? "뒤" : "전"})`);
    else ok(`${app.key}: 여는 동안 기록을 덮어쓰지 않았다 (적은 것 ${적은.length}번, 모두 같은 값)`);
    await 화면(p, app, "껐다 켠 뒤 첫 화면");
  }

  console.log("\n━━━ ⑥ 한쪽 저장소가 사라져도 되살아나는가");
  for (const app of APPS) {
    await p.goto(SITE + "/"); await 쉼(300);
    const 결과 = await 지우기DB(p, app.db);
    if (결과 !== "지움") { no(`${app.key}: IndexedDB 를 지우지 못했다 (${결과}) — 검사 불가`); continue; }
    await p.goto(SITE + app.base + "/"); await 기다림(p); await 쉼(500);
    let 다시 = await 저장할것(p);
    if (같다(다시, S[app.key])) ok(`${app.key}: IndexedDB 가 지워져도 거울에서 되살렸다`); else no(`${app.key}: IndexedDB 가 지워지자 기록이 달라졌다 ${다른칸(다시, S[app.key])}`);
    let 날 = await 날것(p, app);
    if (같다(날.idb, S[app.key])) ok(`${app.key}: IndexedDB 에 다시 심었다`); else no(`${app.key}: 거울에서 되살린 뒤 IndexedDB 에 다시 심지 않았다`);
    await p.goto(SITE + "/"); await p.evaluate((k) => localStorage.removeItem(k), app.mirror);
    await p.goto(SITE + app.base + "/"); await 기다림(p); await 쉼(500);
    다시 = await 저장할것(p); 날 = await 날것(p, app);
    if (같다(다시, S[app.key])) ok(`${app.key}: 거울이 지워져도 IndexedDB 로 그대로`); else no(`${app.key}: 거울이 지워지자 기록이 달라졌다 ${다른칸(다시, S[app.key])}`);
    if (같다(날.mirror, S[app.key])) ok(`${app.key}: 거울을 다시 만들었다`); else no(`${app.key}: 거울을 다시 만들지 않았다`);
  }

  console.log("\n━━━ ⑦ 칸 하나가 없는 예전 저장본 (모든 칸마다)");
  for (const app of APPS) {
    let 칸수 = 0;
    for (const 칸 of Object.keys(S[app.key])) {
      const 옛 = { ...S[app.key] }; delete 옛[칸];
      await p.goto(SITE + "/"); await 심기(p, app, 옛);
      await p.goto(SITE + app.base + "/"); await 기다림(p); await 쉼(700);
      const 다시 = await 저장할것(p);
      const 기대 = { ...S[app.key], [칸]: 처음[app.key][칸] };
      const 틀린 = 다른칸(다시, 기대);
      if (틀린.length) no(`${app.key}: "${칸}" 없는 옛 기록을 열자 ${틀린.join(",")} 이 기대와 다르다`); else ok(`${app.key}: "${칸}" 없는 옛 기록 — 나머지 그대로, 빈 칸은 기본값`);
      await 화면(p, app, `"${칸}" 없는 옛 기록`);
      칸수++;
    }
    await p.goto(SITE + "/"); await 심기(p, app, S[app.key]);
    console.log(`    ${app.key}: 칸 ${칸수}개 하나씩 빼 보았다`);
  }

  console.log("\n━━━ ⑧ 백업 파일 (한국사·정처기)");
  for (const app of APPS.filter((a) => ["khlm", "gisa"].includes(a.key))) {
    await p.goto(SITE + app.base + "/backup"); await 기다림(p); await 쉼(500);
    const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: /파일로 저장하기/ }).click()]);
    const 파일 = await dl.path();
    const 내용 = JSON.parse(fs.readFileSync(파일, "utf8"));
    const 빠진 = Object.keys(S[app.key]).filter((k) => !(k in 내용.data));
    if (빠진.length) no(`${app.key}: 백업 파일에 빠진 칸 ${빠진}`); else ok(`${app.key}: 백업 파일에 모든 칸이 있다`);
    await p.evaluate(() => window.__appStore.getState().resetAll()); await 쉼(300);
    await p.locator("input[type=file]").setInputFiles(파일); await 쉼(500);
    await p.getByRole("button", { name: /백업으로 되돌리기/ }).click(); await 쉼(500);
    let 다시 = await 저장할것(p);
    if (같다(다시, S[app.key])) ok(`${app.key}: 초기화 뒤 백업으로 되돌리니 그대로`); else no(`${app.key}: 백업으로 되돌린 뒤 달라진 칸 ${다른칸(다시, S[app.key])}`);
    await p.reload(); await 기다림(p); await 쉼(400);
    다시 = await 저장할것(p);
    if (같다(다시, S[app.key])) ok(`${app.key}: 되돌린 것이 저장까지 됐다`); else no(`${app.key}: 되돌린 뒤 새로고침하니 달라졌다 ${다른칸(다시, S[app.key])}`);
    await p.locator("input[type=file]").setInputFiles(파일); await 쉼(500);
    await p.getByRole("button", { name: /지금 기록과 합치기/ }).click(); await 쉼(500);
    다시 = await 저장할것(p);
    const 줄어든 = Object.keys(S[app.key]).filter((k) => Array.isArray(S[app.key][k]) && (다시[k]?.length ?? 0) < S[app.key][k].length);
    if (줄어든.length) no(`${app.key}: 같은 백업을 합치니 ${줄어든} 이 줄었다`); else ok(`${app.key}: 같은 백업을 합쳐도 잃는 것 없음`);
    const 늘어난 = Object.keys(S[app.key]).filter((k) => Array.isArray(S[app.key][k]) && (다시[k]?.length ?? 0) > S[app.key][k].length);
    if (늘어난.length) no(`${app.key}: 같은 백업을 합치니 ${늘어난} 이 겹쳐 늘었다`); else ok(`${app.key}: 같은 백업을 합쳐도 겹치지 않음`);
    S[app.key] = await 저장할것(p);
  }

  console.log("\n━━━ ⑨ 망 없이 푼 것도 남는가");
  for (const app of APPS) {
    await ctx.setOffline(true);
    try {
      await p.goto(SITE + app.base + "/"); await 기다림(p);
      const [이름, 인자] = app.동작.find(([n]) => /^(markStudied|markVocabKnown)$/.test(n));
      const 새id = { khlm: ID.khlm.events[8].id, comhwal: ID.comhwal.concepts[5].id, sqld: ID.sqld.concepts[5].id, toeic: ID.toeic.vocab[4], gisa: ID.gisa.concepts[5].id }[app.key];
      await p.evaluate(([n, id]) => window.__appStore.getState()[n](id), [이름, 새id]); await 쉼(300);
      const 후 = await 저장할것(p);
      await p.reload(); await 기다림(p); await 쉼(400);
      const 다시 = await 저장할것(p);
      if (같다(다시, 후) && JSON.stringify(다시).includes(새id)) ok(`${app.key}: 망 없이 공부한 것이 남았다`); else no(`${app.key}: 망 없이 공부한 것이 다시 여니 없다`);
      S[app.key] = 다시;
    } catch (e) { no(`${app.key}: 망 없이 열리지 않았다 ${String(e).slice(0, 80)}`); }
    await ctx.setOffline(false);
  }

  console.log("\n━━━ ⑩ 같은 앱을 두 창에 띄우고 번갈아 풀면");
  for (const app of APPS) {
    const a = p, b = await ctx.newPage(); 붙임(b);
    await a.goto(SITE + app.base + "/"); await 기다림(a);
    await b.goto(SITE + app.base + "/"); await 기다림(b);
    const 이름 = app.동작.find(([n]) => /^(markStudied|markVocabKnown)$/.test(n))[0];
    const [x, y] = { khlm: [ID.khlm.events[9].id, ID.khlm.events[10].id], comhwal: [ID.comhwal.concepts[6].id, ID.comhwal.concepts[7].id], sqld: [ID.sqld.concepts[6].id, ID.sqld.concepts[7].id], toeic: [ID.toeic.vocab[2], ID.toeic.vocab[3]], gisa: [ID.gisa.concepts[6].id, ID.gisa.concepts[7].id] }[app.key];
    await a.evaluate(([n, id]) => window.__appStore.getState()[n](id), [이름, x]); await 쉼(400);
    await b.evaluate(([n, id]) => window.__appStore.getState()[n](id), [이름, y]); await 쉼(400);
    // 받은 기록을 되받아 적으며 두 창이 끝없이 주고받지 않는가
    const 셈 = async () => (await a.evaluate(() => window.__적은것.length)) + (await b.evaluate(() => window.__적은것.length));
    const 처음셈 = await 셈(); await 쉼(2500); const 나중셈 = await 셈();
    if (나중셈 !== 처음셈) no(`${app.key}: 두 창이 기록을 계속 주고받는다 (2.5초 동안 ${나중셈 - 처음셈}번 더 적음)`); else ok(`${app.key}: 맞춘 뒤 조용하다`);
    // 다른 창도 화면을 다시 그리지 않고 바로 알고 있는가
    const 아는가 = await a.evaluate((id) => JSON.stringify(window.__appStore.getState()).includes(`"${id}"`), y);
    if (아는가) ok(`${app.key}: 다른 창에서 푼 것을 이 창도 바로 안다`); else no(`${app.key}: 다른 창에서 푼 것을 이 창은 모른다`);
    await b.close();
    await a.reload(); await 기다림(a); await 쉼(400);
    const 다시 = JSON.stringify(await 저장할것(a));
    const 남은 = [x, y].filter((id) => 다시.includes(`"${id}"`));
    if (남은.length === 2) ok(`${app.key}: 두 창에서 푼 것이 둘 다 남았다`);
    else no(`${app.key}: 두 창을 띄우고 번갈아 풀면 먼저 푼 것(${[x, y].filter((id) => !남은.includes(id))})이 사라진다`);
    S[app.key] = await 저장할것(a);
  }

  console.log("\n━━━ ⑪ 서로 안 섞이는가 — 한국사를 초기화한다");
  await p.goto(SITE + "/history/"); await 기다림(p);
  await p.evaluate(() => window.__appStore.getState().resetAll()); await 쉼(400);
  const 지운뒤 = await 저장할것(p);
  if (같다(지운뒤, 처음.khlm)) ok("한국사는 처음 상태가 됐다"); else no(`한국사 초기화 뒤 남은 칸 ${다른칸(지운뒤, 처음.khlm)}`);
  for (const app of APPS.filter((a) => a.key !== "khlm")) {
    await p.goto(SITE + app.base + "/"); await 기다림(p); await 쉼(300);
    const 다시 = await 저장할것(p);
    if (같다(다시, S[app.key])) ok(`${app.key}: 한국사를 지워도 그대로`); else no(`${app.key}: 한국사를 지우자 달라졌다 ${다른칸(다시, S[app.key])}`);
  }

  if (오류.length) { console.log("\n━━━ ⑫ 페이지 오류"); [...new Set(오류)].slice(0, 10).forEach((e) => no("페이지 오류: " + e)); }
  await ctx.close(); srv.close();
  console.log(`\n확인 ${통과}건 통과 · 문제 ${문제}건`);
})().catch((e) => { console.error(e); process.exit(1); });
