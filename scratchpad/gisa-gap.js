// 문항이 늘어난 뒤, 앱이 그 늘어난 것을 제대로 쓰고 있는가.
// 사용자가 "지금 뭘 해야 하지" 를 물었을 때 답이 나오는가.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4830";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // 한 달쯤 쓴 사람 — 여기저기 기록이 쌓였다
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    const now = Date.now(), D = 86400000;
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:"2026-10-17"},
      stats:{xp:860,streak:6,lastStudyDate:null,studyMinutes:320},
      studiedIds:["d-sdlc","d-agile","d-oop","d-solid","b-normalization","b-key","v-sort","l-python"],
      clearedQuestionIds:["qd-sdlc-spiral","qd-xp-values","qb2-norm-1nf"],
      clearedPracticalIds:["pq-encapsulation"],
      reviewCards:["d-oop","b-normalization","v-sort"].map(id=>({sourceId:id,addedAt:now-10*D,lastReviewedAt:now-2*D,stage:2,nextDueAt:now-D,lapses:1})),
      quizHistory:[{quizId:"q-1",takenAt:now-3*D,total:10,correct:6,track:"written"},
                   {quizId:"q-2",takenAt:now-D,total:10,correct:8,track:"written"}],
      wrongIds:["d-oop","b-normalization","v-sort","l-os-memory","s-estimation"],
      mockAttempts:[{track:"written",startedAt:now-5*D,finishedAt:now-5*D+9e6,score:52,passed:false,
        bySubject:[{subject:"design",correct:13,total:20},{subject:"develop",correct:12,total:20},
                   {subject:"database",correct:11,total:20},{subject:"language",correct:5,total:20},
                   {subject:"system",correct:11,total:20}]}]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,120)));

  for (const [label, url] of [["홈","/"],["학습","/learn"],["문제","/quiz"],["실기","/practical"],["복습","/review"],["필기 모의","/mock"]]) {
    await p.goto(BASE + url, { waitUntil: "networkidle" });
    await p.waitForTimeout(700);
    console.log(`\n━━━ ${label} ━━━`);
    console.log(dump(await p.locator("main").innerText()).split("\n").slice(0, 22).join("\n"));
  }
  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
