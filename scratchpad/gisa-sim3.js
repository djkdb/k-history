// 안내를 마친 사람으로 시작해 학습 → 개념 → 문제 를 실제로 풀어 본다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4511";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    try {
      if (localStorage.getItem("__s__")) return;
      localStorage.setItem("__s__", "1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
        settings: { track: "written", examDate: "2026-10-17" },
        stats: { xp: 0, streak: 0, lastStudyDate: null, studyMinutes: 0 },
        studiedIds: [], clearedQuestionIds: [], clearedPracticalIds: [],
        reviewCards: [], quizHistory: [], wrongIds: [], mockAttempts: [] } }));
    } catch {}
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));

  console.log("### 학습 화면");
  await p.goto(BASE + "/learn", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  console.log(dump(await p.locator("main").innerText()).slice(0, 700));

  console.log("\n### 검색창에 'UML' 을 넣으면");
  const search = p.locator('input[type="search"], input[type="text"]').first();
  if (await search.count()) { await search.fill("UML"); await p.waitForTimeout(400);
    console.log(dump(await p.locator("main").innerText()).slice(0, 400)); }
  else console.log("검색창이 없다");

  console.log("\n### 개념 하나를 연다");
  await p.goto(BASE + "/learn", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  await p.locator("main a").first().click();
  await p.waitForTimeout(700);
  console.log("주소:", p.url().replace(BASE, ""));
  console.log(dump(await p.locator("main").innerText()).slice(0, 1200));

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
