/*
 * "틀린 것만" 이 실제로 걸러지는가.
 *
 * 화면에 칩이 보이는 것과, 그 칩을 눌렀을 때 정말 그 문항만 나오는 것은
 * 다르다. 틀린 개념을 심어 두고 두 화면(실기·자주 틀리는 곳)을 걸어 본다.
 *
 *   node scratchpad/gisa-wrong.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("/home/user/k-history/node_modules/jiti")("/home/user/k-history/gisa", {
  alias: { "@": "/home/user/k-history/gisa/src" },
});
const { QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/questions.ts");
const { PRACTICAL_QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/practical.ts");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-wrong.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

// 실기 문항이 딸린 개념들을 골라 틀린 것으로 심는다
const WRONG = ["d-oop", "b-normalization", "l-c-pointer"];
const SAVED = {
  state: {
    settings: { track: "practical", examDate: null },
    stats: { xp: 100, streak: 2, lastStudyDate: "2026-09-16", studyMinutes: 60 },
    wrongIds: WRONG,
    reviewCards: [
      { sourceId: "d-oop", addedAt: 1, lastReviewedAt: 2, stage: 1, nextDueAt: 9e14, lapses: 4 },
      { sourceId: "b-normalization", addedAt: 1, lastReviewedAt: 2, stage: 1, nextDueAt: 9e14, lapses: 2 },
      { sourceId: "l-c-pointer", addedAt: 1, lastReviewedAt: 2, stage: 1, nextDueAt: 9e14, lapses: 1 },
      { sourceId: "s-methodology", addedAt: 1, lastReviewedAt: 2, stage: 3, nextDueAt: 9e14, lapses: 0 },
    ],
  },
};

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript((saved) => {
    try { localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify(saved)); } catch {}
  }, SAVED);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const txt = () => p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));

  // ── 홈에서 길이 보이는가
  console.log("\n━━━ 홈");
  await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(1100);
  const h = await txt();
  if (/자주 틀리는 곳 3개/.test(h)) ok("홈이 «자주 틀리는 곳 3개» 를 알려 준다");
  else no("홈에 자주 틀리는 곳으로 가는 길이 없다: " + h.slice(0, 120));

  // ── 자주 틀리는 곳
  console.log("\n━━━ 자주 틀리는 곳");
  await p.goto(BASE + "/wrong", { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
  const w = await txt();
  if (/개념 3개/.test(w)) ok("되틀린 개념 셋을 모았다 (lapses 0 인 것은 뺐다)");
  else no("모은 개수가 맞지 않는다: " + w.slice(0, 140));
  const order = await p.evaluate(() =>
    [...document.querySelectorAll('a[href^="/concept/"]')].map((a) => a.getAttribute("href")));
  if (order[0] === "/concept/d-oop") ok("가장 자주 틀린 것(4번)이 맨 위에 있다");
  else no("줄 세우기가 틀렸다: " + order.slice(0, 3).join(", "));
  if (/4번/.test(w) && /2번/.test(w)) ok("몇 번 틀렸는지 적어 준다");
  else no("되틀린 횟수가 보이지 않는다");

  // ── 거기서 «틀린 것만 풀기»
  console.log("\n━━━ 틀린 것만 풀기");
  await p.getByRole("link", { name: /틀린 것만 풀기/ }).first().click();
  await p.waitForTimeout(1200);
  const q = await txt();
  if (/틀린 것만/.test(q)) ok("문제 화면이 «틀린 것만» 으로 켜진 채 열린다");
  else no("«틀린 것만» 이 꺼진 채로 열렸다");
  const start = p.getByRole("button", { name: /문항 시작/ }).first();
  if (await start.count()) {
    await start.click(); await p.waitForTimeout(900);
    /*
     * ⚠️ 처음에는 화면 글에 "정규화·포인터" 같은 낱말이 있는지로 봤다.
     *    그런데 포인터 문항은 물음이 "다음 C 프로그램의 출력 결과는?" 이라
     *    낱말이 하나도 안 나온다 — 멀쩡한 것을 엉뚱하다고 적었다.
     *    데이터에서 기대 집합을 뽑아 대조한다.
     */
    const want = new Set(
      QUESTIONS.filter((q) => WRONG.includes(q.sourceId)).map((q) => q.question),
    );
    const asked = await p.evaluate(() => {
      const h = document.querySelector("main h2");
      return h ? h.innerText.replace(/\s+/g, " ").trim() : null;
    });
    if (asked && want.has(asked)) ok(`나온 문항이 심어 둔 개념에서 왔다 — "${asked.slice(0, 30)}…"`);
    else no(`엉뚱한 문항이 나왔다: "${(asked ?? "").slice(0, 50)}"`);
  } else no("시작할 수 없다");

  // ── 실기 «틀린 것만»
  console.log("\n━━━ 실기 — 틀린 것만 다시 적기");
  await p.goto(BASE + "/practical", { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
  const pr = await txt();
  if (/어디서 고를까/.test(pr) && /틀린 것만/.test(pr)) ok("실기에도 «틀린 것만» 이 생겼다");
  else return no("실기에 «틀린 것만» 이 없다: " + pr.slice(0, 160)), await b.close();
  const m = pr.match(/틀린 것만 (\d+)/);
  if (m && Number(m[1]) > 0) ok(`틀린 개념에 딸린 실기 ${m[1]}문항을 셌다`);
  else no("틀린 것만의 개수가 0이다");
  await p.getByRole("button", { name: /^틀린 것만/ }).first().click();
  await p.waitForTimeout(400);
  await p.getByRole("button", { name: /문항 시작|시작하기/ }).first().click().catch(()=>{});
  await p.waitForTimeout(1000);
  /*
   * ⚠️ 적는 칸의 안내말("여기에 적으세요")은 placeholder 라 innerText 에
   *    잡히지 않는다. 그것으로 시작 여부를 보았다가 멀쩡한 화면을 실패로 적었다.
   *    적는 칸이 있는지와, 나온 문항이 기대 집합에 드는지로 본다.
   */
  const wantP = new Set(
    PRACTICAL_QUESTIONS.filter((q) => WRONG.includes(q.sourceId)).map((q) => q.question),
  );
  const askedP = await p.evaluate(() => {
    const h = document.querySelector("main h2");
    return h ? h.innerText.replace(/\s+/g, " ").trim() : null;
  });
  const hasBox = (await p.locator("textarea").count()) > 0;
  if (hasBox && askedP && wantP.has(askedP))
    ok(`그 문항들로 적기가 시작된다 — "${askedP.slice(0, 30)}…"`);
  else if (!hasBox) no("적는 칸이 없다");
  else no(`엉뚱한 실기 문항이 나왔다: "${(askedP ?? "").slice(0, 50)}"`);

  if (errs.length) no(`예외: ${errs[0]}`);
  console.log(bad ? `\n걸린 것 ${bad}건` : "\n✓ 틀린 곳만 골라 다시 풀 수 있다");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
