/*
 * 백업이 정말로 기록을 지키는가.
 *
 * "파일로 저장된다" 는 말만으로는 모자란다. 실제로 내려받아, 기록을 통째로
 * 지우고, 그 파일로 되살아나는지까지 봐야 한다. 그 한 바퀴가 돌지 않으면
 * 사용자는 백업을 받아 두고도 폰을 바꿀 때 잃는다.
 *
 *   node scratchpad/gisa-backup.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const fs = require("fs"), path = require("path"), os = require("os");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-backup.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

const SAVED = {
  state: {
    settings: { track: "written", examDate: "2026-11-13" },
    stats: { xp: 777, streak: 5, lastStudyDate: "2026-09-16", studyMinutes: 320 },
    studiedIds: ["d-sdlc", "d-oop", "b-normalization"],
    /* 문항별로 틀린 횟수 — 새로 생긴 칸이다. 백업에 안 담기면 폰을 바꿀 때
       "나에게 어려운 문항" 이 통째로 사라진다. */
    questionMisses: { "qd-sdlc-spiral": 3, "qd-xp-values": 2 },
    clearedQuestionIds: ["qd-sdlc-spiral", "qd-xp-values"],
    clearedPracticalIds: ["pq-encapsulation"],
    reviewCards: [
      { sourceId: "d-oop", addedAt: 1, lastReviewedAt: 2, stage: 3, nextDueAt: 9e14, lapses: 1 },
    ],
    quizHistory: [{ quizId: "q-1", takenAt: 1, total: 10, correct: 7, track: "written" }],
    wrongIds: ["b-normalization"],
    mockAttempts: [{ track: "written", startedAt: 111, finishedAt: 222, score: 55, passed: false, bySubject: [] }],
  },
};

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gisa-backup-"));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
  await ctx.addInitScript((saved) => {
    try { localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify(saved)); } catch {}
  }, SAVED);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const body = () => p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));

  await p.goto(BASE + "/backup", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);

  const shown = await body();
  if (/본 개념 3개/.test(shown)) ok("지금 기록을 제대로 세어 보여 준다 (개념 3개)");
  else no("지금 기록이 화면과 맞지 않다: " + shown.slice(0, 120));

  // ① 내려받기
  const [dl] = await Promise.all([
    p.waitForEvent("download", { timeout: 15000 }).catch(() => null),
    p.getByRole("button", { name: /파일로 저장하기/ }).first().click(),
  ]);
  if (!dl) return no("파일이 내려받아지지 않았다"), await b.close();
  const file = path.join(dir, dl.suggestedFilename());
  await dl.saveAs(file);
  const name = dl.suggestedFilename();
  /*
   * ⚠️ 이름이 "download" 로 오면 크로미움이 한글 이름을 버린 것이다.
   *    확장자까지 사라져 나중에 그 파일이 무엇인지 알 수 없다. 이름도 검사한다.
   */
  if (/^gisa-backup-\d{4}-\d{2}-\d{2}\.json$/.test(name)) ok(`내려받았다 — ${name}`);
  else no(`파일 이름이 이상하다 — "${name}" (gisa-backup-날짜.json 이어야 한다)`);

  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (raw.format === "gisa-backup") ok("이 앱의 백업 형식이 맞다");
  else no("형식 표시가 이상하다: " + raw.format);
  if (raw.data?.studiedIds?.length === 3 && raw.data?.stats?.xp === 777)
    ok("파일 안에 기록이 온전히 들어 있다");
  else no("파일 안의 기록이 모자란다");
  if (raw.data?.questionMisses?.["qd-sdlc-spiral"] === 3)
    ok("문항별로 틀린 횟수도 담겼다");
  else no("틀린 횟수가 백업에서 빠졌다: " + JSON.stringify(raw.data?.questionMisses));

  // ② 기록을 통째로 지운다 — 새 브라우저로 연다
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const q = await ctx2.newPage();
  q.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  await q.goto(BASE + "/backup", { waitUntil: "networkidle" });
  await q.waitForTimeout(1000);
  const empty = await q.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
  if (/본 개념 0개/.test(empty)) ok("새 기기에서는 비어 있다 (개념 0개)");
  else no("새 기기인데 기록이 남아 있다: " + empty.slice(0, 100));

  // ③ 그 파일로 되살린다
  await q.setInputFiles('input[type="file"]', file);
  await q.waitForTimeout(900);
  const picked = await q.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
  if (/에 저장된 백업/.test(picked)) ok("고른 파일의 내용을 미리 보여 준다");
  else no("파일을 골랐는데 미리 보기가 없다");

  await q.getByRole("button", { name: /합치기/ }).first().click();
  await q.waitForTimeout(1000);
  const after = await q.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
  if (/합쳤습니다/.test(after)) ok("합치기가 끝났다고 알려 준다");
  else no("합친 뒤 아무 말이 없다");
  if (/본 개념 3개/.test(after)) ok("기록이 되살아났다 (개념 3개)");
  else no("되살아나지 않았다: " + after.slice(0, 140));
  /* 화면에 안 드러나는 칸은 저장소를 직접 들여다봐야 한다 */
  const 되산 = await q.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem("gisa:mirror:gisa-state") || "{}")
        ?.state?.questionMisses ?? null;
    } catch { return null; }
  });
  if (되산 && 되산["qd-sdlc-spiral"] === 3) ok("문항별 틀린 횟수도 되살아났다");
  else no("틀린 횟수가 되살아나지 않았다: " + JSON.stringify(되산));

  // ④ 다른 화면에서도 진짜로 살아 있는가
  await q.goto(BASE + "/", { waitUntil: "networkidle" });
  await q.waitForTimeout(900);
  const home = await q.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
  if (/연속 학습 5일|5일/.test(home)) ok("홈에도 이어진 기록이 보인다");
  else no("홈에는 되살아난 기록이 보이지 않는다");

  // ⑤ 남의 파일을 내밀면 거절하는가
  const junk = path.join(dir, "junk.json");
  fs.writeFileSync(junk, JSON.stringify({ format: "khlm-backup", version: 1, data: {} }));
  await q.goto(BASE + "/backup", { waitUntil: "networkidle" });
  await q.waitForTimeout(800);
  await q.setInputFiles('input[type="file"]', junk);
  await q.waitForTimeout(700);
  const rej = await q.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
  if (/이 앱의 백업 파일이 아닙니다/.test(rej)) ok("다른 앱의 백업은 거절한다");
  else no("남의 백업 파일을 그대로 받아들인다");

  fs.rmSync(dir, { recursive: true, force: true });
  if (errs.length) no(`예외 ${errs.length}건: ${errs[0]}`);
  console.log(bad ? `\n걸린 것 ${bad}건` : "\n✓ 내려받고 · 지우고 · 되살리는 한 바퀴가 돈다");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
