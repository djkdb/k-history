// 마지막으로, 앱이 아니라 사람 눈으로 잡히는 것들.
// 화면마다 "지금 뭘 해야 하는지" 가 분명한가, 막다른 골목은 없는가.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4517";
const PAGES = ["/", "/learn", "/quiz", "/practical", "/practical/mock", "/review", "/mock", "/settings"];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // 아무것도 안 한 사람 — 빈 화면이 어떻게 보이는가
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:null}, stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  console.log("### 아무것도 안 한 사람이 각 화면에서 무엇을 할 수 있는가\n");
  for (const url of PAGES) {
    await p.goto(BASE + url, { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    const btns = await p.locator("main button:not([disabled]), main a").allInnerTexts();
    const acts = [...new Set(btns.map((t) => t.replace(/\s+/g, " ").trim()).filter(Boolean))];
    const h1 = await p.locator("main h1").first().innerText().catch(() => "(제목 없음)");
    console.log(`${url}  — "${h1.replace(/\n/g, " ")}"`);
    console.log(`   할 수 있는 것 ${acts.length}가지: ${acts.slice(0, 9).join(" / ")}${acts.length > 9 ? " …" : ""}`);
    if (acts.length === 0) console.log("   ⚠ 막다른 골목 — 누를 것이 없다");
  }
  await b.close();
})();
