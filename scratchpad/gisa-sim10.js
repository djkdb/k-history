// 한 달 만에 돌아온 사람. 그리고 기록을 지우는 사람.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4517";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
const DAY = 86400000;
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript((day) => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    const long = Date.now() - 35 * day;
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:"2020-05-09"},
      stats:{xp:3200,streak:12,lastStudyDate:"2026-08-09",studyMinutes:900},
      studiedIds:["d-oop","d-solid","b-normalization","v-sort","l-python","s-methodology"],
      clearedQuestionIds:["qd-sdlc-spiral"],clearedPracticalIds:["pq-encapsulation"],
      reviewCards:["d-oop","d-solid","b-normalization","v-sort"].map(id=>({sourceId:id,addedAt:long,lastReviewedAt:long,stage:4,nextDueAt:long+14*day,lapses:2})),
      quizHistory:[],wrongIds:["d-oop"],
      mockAttempts:[{track:"written",startedAt:long,finishedAt:long+5e6,score:58,passed:false,
        bySubject:[{subject:"design",correct:14,total:20},{subject:"develop",correct:12,total:20},
                   {subject:"database",correct:11,total:20},{subject:"language",correct:7,total:20},
                   {subject:"system",correct:14,total:20}]}]}})); } catch {} }, DAY);
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,140)));

  console.log("### 35일 만에 돌아온 사람의 홈 (시험일은 이미 지났다)");
  await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
  console.log(dump(await p.locator("main").innerText()).split("\n").slice(0, 14).join("\n"));

  console.log("\n### 지난 응시 기록");
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
  const t = dump(await p.locator("main").innerText());
  console.log(t.slice(t.indexOf("지난 응시"), t.indexOf("지난 응시") + 240));

  console.log("\n### 기록을 지우면");
  await p.goto(BASE + "/settings", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  await p.getByRole("button", { name: "모든 기록 지우기" }).click(); await p.waitForTimeout(300);
  console.log(dump(await p.locator("main").innerText()).slice(-260));
  await p.getByRole("button", { name: "지웁니다" }).click(); await p.waitForTimeout(800);
  console.log("\n지운 뒤 설정 화면 내 기록:");
  const after = dump(await p.locator("main").innerText());
  console.log(after.slice(after.indexOf("내 기록"), after.indexOf("내 기록") + 130));
  console.log("\n지운 뒤 홈으로 가면 주소:", (await p.goto(BASE + "/", { waitUntil: "networkidle" }), await p.waitForTimeout(900), p.url().replace(BASE, "")));

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
