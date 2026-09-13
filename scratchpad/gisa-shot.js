const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4515";
const SHOTS = [
  ["home", "/"], ["learn", "/learn"], ["concept", "/concept/l-c-pointer"],
  ["mock", "/mock"], ["mocksession","/mock/session?seed=99"],["practsession","/practical/mock/session?seed=7"],
  ["practical", "/practical"], ["review", "/review"], ["settings", "/settings"],
];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript((t) => { try {
      localStorage.setItem("gisa:theme", t);
      if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
        settings:{track:"written",examDate:"2026-10-17"}, stats:{xp:420,streak:5,lastStudyDate:null,studyMinutes:200},
        studiedIds:["d-sdlc","d-agile","l-c-pointer"],clearedQuestionIds:["qd-sdlc-spiral"],clearedPracticalIds:[],
        reviewCards:[{sourceId:"d-sdlc",addedAt:1,lastReviewedAt:null,stage:0,nextDueAt:1,lapses:0}],
        quizHistory:[],wrongIds:["d-sdlc"],mockAttempts:[]}})); } catch {} }, theme);
    const p = await ctx.newPage();
    for (const [name, url] of SHOTS) {
      await p.goto(BASE + url, { waitUntil: "networkidle" });
      await p.waitForTimeout(700);
      await p.screenshot({ path: `/tmp/gisa-${name}-${theme}.png` });
    }
    await ctx.close();
  }
  await b.close();
  console.log("찍었다");
})();
