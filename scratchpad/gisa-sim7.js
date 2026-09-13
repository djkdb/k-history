// 실기를 화면에서 직접 적어 본다 — 실제 모범 답안과 흔한 오타로.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { PRACTICAL_QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/practical.ts");
const M = Object.fromEntries(PRACTICAL_QUESTIONS.map((q) => [q.id, q]));
const BASE = "http://127.0.0.1:4513";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"practical",examDate:"2026-10-17"}, stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,140)));

  await p.goto(BASE + "/practical", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  console.log("### 실기 첫 화면");
  console.log(dump(await p.locator("main").innerText()).slice(0, 460));

  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForTimeout(500);

  for (let i = 0; i < 3; i++) {
    const qText = (await p.locator("main h2").first().innerText()).trim();
    const q = PRACTICAL_QUESTIONS.find((x) => x.question.trim() === qText);
    console.log(`\n### ${i + 1}번 — ${qText.slice(0, 46)}…`);
    if (!q) { console.log("  (코드에서 못 찾음)"); break; }
    // 모범 답안을 그대로 적어 본다
    await p.locator("textarea").fill(q.answers[0]);
    await p.getByRole("button", { name: "채점" }).click();
    await p.waitForTimeout(400);
    const verdict = dump(await p.locator("main").innerText());
    const line = verdict.split("\n").find((l) => /맞았습니다|틀렸습니다|빈칸/.test(l));
    console.log(`  모범 답안 "${q.answers[0].slice(0,30)}" → ${line}`);
    const nextBtn = p.getByRole("button", { name: /다음|결과 보기/ });
    if (await nextBtn.count()) { await nextBtn.click(); await p.waitForTimeout(400); }
  }

  console.log("\n### 마지막 화면");
  console.log(dump(await p.locator("main").innerText()).slice(0, 400));
  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
