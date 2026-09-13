const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4511";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:"2026-10-17"}, stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,140)));

  console.log("### C 포인터 개념 — 코드가 코드로 보이는가");
  await p.goto(BASE + "/concept/l-c-pointer", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const codes = await p.locator("main code").allInnerTexts();
  console.log("코드 조각으로 살아난 것:", codes.length ? codes.join(" | ") : "없음");
  const raw = (await p.locator("main").innerText()).match(/[`*]{1,2}/g);
  console.log("화면에 남은 날것 기호:", raw ? raw.join("") : "없음");

  console.log("\n### 문제를 틀렸을 때 개념으로 가는 길이 있는가");
  await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForTimeout(400);
  await p.locator('main button:has(span:text-is("1"))').first().click();
  await p.waitForTimeout(400);
  const link = p.locator('main a[href^="/concept/"]');
  if (await link.count()) {
    console.log("있다 →", (await link.first().innerText()).trim(), "·", await link.first().getAttribute("href"));
    await link.first().click(); await p.waitForTimeout(700);
    console.log("눌러 보니 주소:", p.url().replace(BASE, ""));
    console.log("제목:", (await p.locator("main h1").first().innerText()).trim());
  } else console.log("없다");

  console.log("\n### 홈 — 처음 온 사람의 기억 보존율");
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  console.log(dump(await p.locator("main").innerText()).split("\n").slice(0,12).join("\n"));
  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
