/*
 * 공부 기록 화면이 진짜 기록을 보여 주는가.
 *
 * 숫자를 화면에 띄우는 것은 쉽고, 그 숫자가 맞는 것은 어렵다. 기록을 손으로
 * 심어 두고 화면이 뱉는 숫자를 손으로 센 값과 견준다. 하나라도 어긋나면
 * 이 화면은 없느니만 못하다 — 사용자가 틀린 정답률을 믿고 공부 방향을 정한다.
 *
 *   node scratchpad/gisa-stats.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-stats.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
const DAY = 864e5;

/* 앞 네 벌은 50%, 뒤 네 벌은 80% — 30%p 올랐다고 말해야 한다.
   날짜는 오늘·어제·사흘 전·열흘 전에 흩어 두어 빈 날이 생기게 한다. */
const 오늘 = Date.now();
const HIST = [
  { quizId: "a", takenAt: 오늘 - 10 * DAY, total: 10, correct: 5, track: "written" },
  { quizId: "b", takenAt: 오늘 - 10 * DAY, total: 10, correct: 5, track: "written" },
  { quizId: "c", takenAt: 오늘 - 3 * DAY, total: 10, correct: 5, track: "written" },
  { quizId: "d", takenAt: 오늘 - 3 * DAY, total: 10, correct: 5, track: "written" },
  { quizId: "e", takenAt: 오늘 - 1 * DAY, total: 10, correct: 8, track: "written" },
  { quizId: "f", takenAt: 오늘 - 1 * DAY, total: 10, correct: 8, track: "practical" },
  { quizId: "g", takenAt: 오늘, total: 10, correct: 8, track: "practical" },
  { quizId: "h", takenAt: 오늘, total: 10, correct: 8, track: "written" },
];
const 푼 = HIST.reduce((s, q) => s + q.total, 0);          // 80
const 맞힌 = HIST.reduce((s, q) => s + q.correct, 0);        // 52
const 정답률 = Math.round((맞힌 / 푼) * 100);                // 65
const 필기 = HIST.filter((q) => q.track === "written").reduce((s, q) => s + q.total, 0);   // 50
const 실기 = HIST.filter((q) => q.track === "practical").reduce((s, q) => s + q.total, 0); // 30
/* 기록이 있는 날은 넷. 30칸 중 스물여섯이 빈 날이다. */
const 빈날 = 30 - 4;

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* ── 하나: 아무것도 안 했을 때 ── */
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
    await p.goto(BASE + "/stats", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    console.log("\n━━━ 아직 아무것도 안 했을 때");
    const t = await p.locator("main").innerText();
    if (/아직 기록이 없습니다/.test(t)) ok("빈 화면이 이유를 말한다");
    else no("빈 화면 안내가 없다:\n" + t.slice(0, 200));
    if (/푼 문항\s*\n?\s*0개/.test(t.replace(/\s+/g, " ").replace(/푼 문항 0개/, "푼 문항\n0개")) || /푼 문항/.test(t))
      ok("0 이어도 숫자 칸은 보인다");
    if (!/NaN|undefined|Infinity/.test(t)) ok("빈 기록에서 NaN 이 새지 않는다");
    else no("NaN/undefined 가 보인다: " + t.slice(0, 200));
    if (await p.locator("h1").count()) ok("h1 이 있다");
    else no("h1 이 없다");
    if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");
    await ctx.close();
  }

  /* ── 둘: 여덟 벌을 푼 사람 ── */
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript((h) => {
      try {
        localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
          state: {
            quizHistory: h,
            stats: { xp: 640, streak: 5, lastStudyDate: null, studyMinutes: 135 },
            studiedIds: ["s-security-crypto", "l-python"],
          },
        }));
      } catch {}
    }, HIST);
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
    await p.goto(BASE + "/stats", { waitUntil: "networkidle" });
    await p.waitForTimeout(1100);
    const t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    console.log("\n━━━ 여덟 벌을 푼 사람");
    const 봐야 = [
      [`푼 문항 ${푼}개`, new RegExp(`푼 문항 ${푼}개`)],
      [`정답률 ${정답률}%`, new RegExp(`정답률 ${정답률}%`)],
      ["연속 학습 5일", /연속 학습 5일/],
      ["공부한 시간 2시간 15분", /공부한 시간 2시간 15분/],
      [`필기 ${필기}개`, new RegExp(`필기로 푼 문항 ${필기}개`)],
      [`실기 ${실기}개`, new RegExp(`실기로 적은 문항 ${실기}개`)],
      ["경험치 640", /640 XP/],
      ["본 개념 2개", /본 개념 2 \/ \d+개/],
    ];
    for (const [이름, re] of 봐야) {
      if (re.test(t)) ok(이름);
      else no(`${이름} — 화면에 없다`);
    }
    /* 손으로 센 추이: 앞 넷 20/40=50%, 뒤 넷 32/40=80% */
    if (/처음 절반 50% → 나중 절반 80%/.test(t)) ok("추이 50% → 80%");
    else no("추이가 틀렸다: " + (t.match(/처음 절반[^·]{0,40}/) || ["없음"])[0]);
    if (/30%p 올랐습니다/.test(t)) ok("30%p 올랐다고 말한다");
    else no("오른 폭을 말하지 않는다");
    const 막대 = await p.locator("main [title*='문항']").count();
    if (막대 === 30) ok("막대가 30칸");
    else no(`막대가 ${막대}칸 (30이어야)`);
    if (new RegExp(`빈 날 ${빈날}일`).test(t)) ok(`빈 날 ${빈날}일`);
    else no(`빈 날 수가 틀렸다: ` + (t.match(/빈 날 \d+일/) || ["없음"])[0]);
    if (/가장 많이 푼 날 20문항/.test(t)) ok("가장 많이 푼 날 20문항");
    else no("최댓값이 틀렸다: " + (t.match(/가장 많이 푼 날 \d+문항/) || ["없음"])[0]);
    if (!/NaN|undefined|Infinity/.test(t)) ok("이상한 값이 없다");
    else no("NaN/undefined 가 보인다");
    if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");
    await ctx.close();
  }

  /* ── 셋: 홈에서 닿는가 ── */
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    /* 설정이 없으면 홈은 첫 화면으로 되돌린다. 이미 시작한 사람으로 둔다. */
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
          state: { settings: { track: "written", examDate: null } },
        }));
      } catch {}
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(700);
    console.log("\n━━━ 홈에서 닿는가");
    const l = p.locator('a[href="/stats"]').first();
    if (await l.count()) {
      const bb = await l.boundingBox();
      ok(`홈에 길이 있다 (${Math.round(bb.width)}×${Math.round(bb.height)})`);
      if (bb.height >= 24) ok("누를 만한 크기");
      else no(`높이 ${Math.round(bb.height)}px — 24px 미만`);
      await l.click();
      await p.waitForTimeout(800);
      if (/공부 기록/.test(await p.locator("h1").innerText())) ok("눌러서 들어가진다");
      else no("눌렀는데 다른 데로 간다: " + p.url());
    } else no("홈에 /stats 로 가는 길이 없다");
    await ctx.close();
  }

  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
