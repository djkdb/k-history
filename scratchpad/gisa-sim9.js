// 설정에서 필기 → 실기로 바꾼 사람. 앱이 정말 달라지는가.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4517";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:null}, stats:{xp:80,streak:3,lastStudyDate:null,studyMinutes:60},
      studiedIds:["d-oop","b-normalization"],clearedQuestionIds:[],clearedPracticalIds:[],
      reviewCards:[{sourceId:"d-oop",addedAt:Date.now()-3e8,lastReviewedAt:null,stage:0,nextDueAt:Date.now()-1e3,lapses:0},
                   {sourceId:"b-normalization",addedAt:Date.now()-3e8,lastReviewedAt:null,stage:0,nextDueAt:Date.now()-1e3,lapses:0}],
      quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,140)));

  console.log("### 필기일 때 학습 화면 머리말 + 개념 수");
  await p.goto(BASE + "/learn", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  console.log(dump(await p.locator("main").innerText()).split("\n").slice(0,9).join("\n"));

  console.log("\n### 필기일 때 복습 한 장");
  await p.goto(BASE + "/review", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  console.log(dump(await p.locator("main").innerText()).slice(0, 260));

  console.log("\n### 설정에서 실기로 바꾼다");
  await p.goto(BASE + "/settings", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  await p.locator('button:has-text("실기")').first().click();
  await p.waitForTimeout(500);
  console.log(dump(await p.locator("main").innerText()).slice(0, 300));

  console.log("\n### 실기로 바꾼 뒤 학습 화면");
  await p.goto(BASE + "/learn", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  console.log(dump(await p.locator("main").innerText()).split("\n").slice(0,9).join("\n"));

  console.log("\n### 실기로 바꾼 뒤 복습 한 장 (적는 쪽으로 나오는가)");
  await p.goto(BASE + "/review", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
  console.log(dump(await p.locator("main").innerText()).slice(0, 320));
  console.log("입력칸 있는가:", (await p.locator("textarea").count()) ? "있다" : "없다");

  console.log("\n### 홈도 실기로 바뀌었는가");
  await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  console.log(dump(await p.locator("main").innerText()).split("\n").slice(0,4).join("\n"));

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
