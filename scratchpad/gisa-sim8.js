// 시험 도중에 나갔다가 돌아오기, 그리고 시간이 다 되었을 때.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4513";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:null}, stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,140)));

  console.log("### 시험을 시작하고 세 문항 답한 뒤 아예 앱을 나갔다가");
  await p.goto(BASE + "/mock/session?seed=4242", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  for (let i = 0; i < 3; i++) {
    await p.locator('main button:has(span:text-is("2"))').first().click();
    await p.waitForTimeout(150);
    if (i < 2) { await p.getByRole("button", { name: "다음" }).click(); await p.waitForTimeout(200); }
  }
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  console.log("### 다시 모의고사 화면에 오면");
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  console.log(dump(await p.locator("main").innerText()).slice(0, 420));

  console.log("\n### '이어서 보기' 를 누르면");
  await p.getByRole("button", { name: "이어서 보기" }).click();
  await p.waitForTimeout(800);
  const hdr = await p.locator("text=/^\\d+ \\/ 100$/").first().textContent();
  console.log("답한 개수 표시:", hdr.trim(), "· 주소:", p.url().replace(BASE, ""));

  console.log("\n### 시간이 3초 남은 채로 들어가면 (자동 제출되는가)");
  await p.evaluate(() => {
    const r = JSON.parse(localStorage.getItem("gisa:mock-written"));
    r.endsAt = Date.now() + 3000;
    localStorage.setItem("gisa:mock-written", JSON.stringify(r));
  });
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(5000);
  const body = dump(await p.locator("main").innerText());
  console.log(body.split("\n").slice(0, 8).join("\n"));
  const left = await p.evaluate(() => localStorage.getItem("gisa:mock-written"));
  console.log("\n시험 진행 기록이 정리되었는가:", left === null ? "예 (지워졌다)" : "아니오 — 남아 있다");

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
