// 실제로 문제를 풀어 본다 — 정답을 알고 푸는 사람처럼.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4511";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__", "1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
        settings: { track: "written", examDate: "2026-10-17" },
        stats: { xp: 0, streak: 0, lastStudyDate: null, studyMinutes: 0 },
        studiedIds: [], clearedQuestionIds: [], clearedPracticalIds: [],
        reviewCards: [], quizHistory: [], wrongIds: [], mockAttempts: [] } })); } catch {}
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));

  console.log("### 문제 5개 풀기 — 한 문항 화면 그대로");
  await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.getByRole("button", { name: "5문항" }).click();
  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForTimeout(500);
  console.log(dump(await p.locator("main").innerText()));

  console.log("\n### 하나 고른 뒤");
  await p.locator('main button:has(span:text-is("2"))').first().click();
  await p.waitForTimeout(400);
  console.log(dump(await p.locator("main").innerText()));

  console.log("\n### 도중에 나가려고 X 를 누르면");
  await p.getByRole("button", { name: "그만두기" }).click();
  await p.waitForTimeout(400);
  console.log(dump(await p.locator("main").innerText()).slice(0, 220));

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
