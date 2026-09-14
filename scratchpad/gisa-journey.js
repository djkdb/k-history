// 시험이 한 달 남은 사람의 하루. 홈에서 시작해 끝까지 따라간다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2] || "http://127.0.0.1:4911";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
const head = (t, n=14) => dump(t).split("\n").slice(0, n).join("\n");
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    const n = Date.now(), D = 86400000;
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:"2026-10-14"},
      stats:{xp:520,streak:4,lastStudyDate:null,studyMinutes:180},
      studiedIds:["d-sdlc","d-agile","d-requirement","b-normalization","v-sort"],
      clearedQuestionIds:["qd-sdlc-spiral"],clearedPracticalIds:[],
      reviewCards:[{sourceId:"d-sdlc",addedAt:n-5*D,lastReviewedAt:n-2*D,stage:2,nextDueAt:n-D,lapses:1},
                   {sourceId:"b-normalization",addedAt:n-5*D,lastReviewedAt:n-2*D,stage:1,nextDueAt:n-D,lapses:2}],
      quizHistory:[],wrongIds:["b-normalization","l-os-memory","s-estimation"],
      mockAttempts:[{track:"written",startedAt:n-3*D,finishedAt:n-3*D+9e6,score:54,passed:false,bySubject:[
        {subject:"design",correct:14,total:20},{subject:"develop",correct:12,total:20},
        {subject:"database",correct:11,total:20},{subject:"language",correct:6,total:20},
        {subject:"system",correct:11,total:20}]}]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,120)));

  console.log("━━━ ① 홈을 연다 ━━━");
  await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
  console.log(head(await p.locator("main").innerText(), 16));

  console.log("\n━━━ ② 급한 곳을 눌러 본다 ━━━");
  await p.getByRole("link", { name: /이 과목 문제 풀기/ }).click();
  await p.waitForTimeout(900);
  console.log("주소:", p.url().replace(BASE, ""));
  console.log(head(await p.locator("main").innerText(), 8));

  console.log("\n━━━ ③ 5문항 풀어 본다 ━━━");
  await p.getByRole("button", { name: "5문항", exact: true }).click();
  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForTimeout(500);
  for (let i = 0; i < 5; i++) {
    const btn = p.locator('main button:has(span:text-is("1"))').first();
    await btn.click(); await p.waitForTimeout(250);
    if (i === 0) {
      const t = dump(await p.locator("main").innerText());
      console.log("  [첫 문항 고른 뒤 보이는 것]");
      console.log("  " + t.split("\n").slice(-6).join("\n  "));
    }
    const nx = p.getByRole("button", { name: /다음|채점 보기/ });
    if (await nx.count()) { await nx.click(); await p.waitForTimeout(250); }
  }
  console.log("  [결과]");
  console.log("  " + head(await p.locator("main").innerText(), 5).replace(/\n/g, "\n  "));

  console.log("\n━━━ ④ 복습하러 간다 ━━━");
  await p.goto(BASE + "/review", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
  console.log(head(await p.locator("main").innerText(), 8));

  console.log("\n━━━ ⑤ 실기도 한 번 ━━━");
  await p.goto(BASE + "/practical", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  await p.getByRole("button", { name: "3문항" }).click();
  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForTimeout(500);
  console.log(head(await p.locator("main").innerText(), 8));

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
