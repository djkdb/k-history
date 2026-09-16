/*
 * 오늘 할 일이 근거 있는 숫자를 내놓는가.
 *
 * 목록을 띄우는 것은 쉽다. 어려운 것은 그 숫자가 맞는 것이다. 남은 개념을
 * 남은 날로 나눈 몫, 오늘 볼 차례가 된 카드, 오늘 이미 푼 문항 — 손으로
 * 센 값과 화면이 같은 말을 하는지 본다. 하나라도 어긋나면 이 목록은 사람을
 * 엉뚱한 데로 보낸다.
 *
 *   node scratchpad/gisa-today.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-today.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
const DAY = 864e5;
const 오늘 = Date.now();
const 날짜 = (t) => new Date(t).toISOString().slice(0, 10);

async function 열기(b, state) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript((st) => {
    try { localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: st })); } catch {}
  }, state);
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  return { ctx, p, errs, t: (await p.locator("main").innerText()).replace(/\s+/g, " ") };
}

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* ── 하나: 시험일을 정한 사람. 남은 개념 / 남은 날 ── */
  {
    /* 필기 개념은 63개. 열 개를 봤다 치면 53개가 남고, 시험이 10일 뒤면 하루 6개다. */
    const 시험 = 날짜(오늘 + 10 * DAY);
    const st = {
      settings: { track: "written", examDate: 시험 },
      studiedIds: ["d-sdlc", "d-oop", "d-uml-basic", "v-search", "b-key", "b-anomaly",
                   "s-methodology", "s-estimation", "l-python", "l-c-pointer"],
      studiedAt: {},
      reviewCards: [],
      quizHistory: [],
      questionMisses: {},
    };
    const { ctx, p, errs, t } = await 열기(b, st);
    console.log("\n━━━ 시험이 열흘 뒤인 사람");
    if (/오늘 할 일/.test(t)) ok("목록이 뜬다");
    else no("목록이 없다: " + t.slice(0, 200));
    const m = t.match(/새 개념 (\d+)개/);
    /* 화면이 말하는 "안 본 개념" 과 "남은 날" 로 몫을 직접 계산해 견준다 */
    const why = t.match(/아직 안 본 개념 (\d+)개를 남은 (\d+)일로 나눈 몫/);
    if (!why) { no("몫의 근거를 밝히지 않는다"); }
    else {
      const 몫 = Math.ceil(Number(why[1]) / Number(why[2]));
      if (m && Number(m[1]) === Math.min(몫, 12)) ok(`새 개념 ${m[1]}개 = ⌈${why[1]}/${why[2]}⌉`);
      else no(`몫이 안 맞는다 — 화면 ${m && m[1]}, 셈 ${몫}`);
      if (Number(why[1]) === 63 - 10) ok("안 본 개념 수가 맞다 (63 − 10)");
      else no(`안 본 개념이 ${why[1]} (53 이어야)`);
      if (Number(why[2]) === 10) ok("남은 날이 10일");
      else no(`남은 날이 ${why[2]}`);
    }
    if (/문제 20문항/.test(t)) ok("필기는 하루 20문항");
    else no("문항 몫이 없다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  /* ── 둘: 오늘 이미 한 만큼이 세어지는가 ── */
  {
    const 시험 = 날짜(오늘 + 10 * DAY);
    const st = {
      settings: { track: "written", examDate: 시험 },
      studiedIds: ["d-sdlc", "d-oop", "d-uml-basic"],
      /* 둘은 오늘, 하나는 닷새 전에 봤다 → 오늘 본 것은 2개여야 한다 */
      studiedAt: { "d-sdlc": 오늘 - 5 * DAY, "d-oop": 오늘, "d-uml-basic": 오늘 },
      reviewCards: [
        { sourceId: "d-oop", addedAt: 1, lastReviewedAt: 오늘, stage: 2, nextDueAt: 오늘 + 3 * DAY, lapses: 0 },
        { sourceId: "d-uml-basic", addedAt: 1, lastReviewedAt: 오늘 - 4 * DAY, stage: 1, nextDueAt: 오늘 - DAY, lapses: 0 },
      ],
      quizHistory: [
        { quizId: "a", takenAt: 오늘, total: 7, correct: 5, track: "written" },
        { quizId: "b", takenAt: 오늘 - 2 * DAY, total: 30, correct: 20, track: "written" },
      ],
      questionMisses: { "qd-sdlc-spiral": 3, "qd-sdlc-proto": 2 },
    };
    const { ctx, errs, t } = await 열기(b, st);
    console.log("\n━━━ 오늘 얼마쯤 한 사람");
    /* 복습: 밀린 1장 + 오늘 본 1장 = 1/2 */
    if (/복습 2장 1\/2/.test(t)) ok("복습 1/2 — 오늘 본 것과 밀린 것을 함께 센다");
    else no("복습 진행이 틀렸다: " + (t.match(/복습 \d+장 \d+\/\d+/) || ["없음"])[0]);
    /* 개념: 오늘 본 것 2개 */
    const c = t.match(/새 개념 (\d+)개 (\d+)\/(\d+)/);
    if (c && Number(c[2]) === 2) ok(`새 개념 ${c[2]}/${c[3]} — 닷새 전에 본 것은 안 센다`);
    else no("오늘 본 개념 수가 틀렸다: " + (c ? c[0] : "없음"));
    /* 문항: 오늘 7문항 (이틀 전 30문항은 빼고) */
    if (/문제 20문항 7\/20/.test(t)) ok("문제 7/20 — 이틀 전 30문항은 오늘로 세지 않는다");
    else no("오늘 푼 문항이 틀렸다: " + (t.match(/문제 20문항 \d+\/\d+/) || ["없음"])[0]);
    if (/두 번 이상 틀린 문항 2개/.test(t)) ok("여러 번 틀린 문항도 줄에 오른다");
    else no("여러 번 틀린 문항 줄이 없다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  /* ── 셋: 다 했을 때 ── */
  {
    const st = {
      settings: { track: "written", examDate: null },
      studiedIds: [],
      studiedAt: {},
      reviewCards: [],
      quizHistory: [{ quizId: "a", takenAt: 오늘, total: 40, correct: 30, track: "written" }],
      questionMisses: {},
    };
    /* 개념을 하나도 안 봤으니 진도 줄이 남는다 — 그것까지 채우려면 오늘 본 것이 있어야 한다 */
    st.studiedIds = ["d-sdlc", "d-oop", "d-uml-basic"];
    st.studiedAt = { "d-sdlc": 오늘, "d-oop": 오늘, "d-uml-basic": 오늘 };
    const { ctx, errs, t } = await 열기(b, st);
    console.log("\n━━━ 오늘 몫을 채운 사람 (시험일 없음 → 하루 3개)");
    if (/오늘 할 일을 다 했습니다/.test(t)) ok("다 했다고 말해 준다");
    else no("다 했는데 아무 말이 없다: " + t.slice(0, 220));
    if (/여기서 멈춰도/.test(t)) ok("멈춰도 된다고 말해 준다");
    else no("멈춰도 된다는 말이 없다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  /* ── 넷: 눌러서 그리로 가는가 ── */
  {
    const st = {
      settings: { track: "practical", examDate: null },
      studiedIds: [], studiedAt: {}, reviewCards: [], quizHistory: [], questionMisses: {},
    };
    const { ctx, p, errs, t } = await 열기(b, st);
    console.log("\n━━━ 실기로 보는 사람");
    if (/실기 10문항 적기/.test(t)) ok("실기는 적는 일로 바뀐다");
    else no("실기 줄이 없다: " + t.slice(0, 200));
    const link = p.locator('a[href="/practical"]').first();
    if (await link.count()) {
      const bb = await link.boundingBox();
      if (bb.height >= 24) ok(`누를 만한 크기 (${Math.round(bb.width)}×${Math.round(bb.height)})`);
      else no(`높이 ${Math.round(bb.height)}px`);
      await link.click();
      await p.waitForTimeout(800);
      if (/\/practical/.test(p.url())) ok("눌러서 실기로 간다");
      else no("엉뚱한 데로 간다: " + p.url());
    } else no("실기로 가는 길이 없다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
