// 실기를 화면에서 직접 적어 본다. 맞게 적었을 때·아깝게 틀렸을 때·모를 때.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { PRACTICAL_QUESTIONS: Q } = jiti("/home/user/k-history/gisa/src/data/practical.ts");
const BASE = process.argv[2] || "http://127.0.0.1:4915";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
// 문제문 + 지문으로 찾아야 같은 문제문의 다른 문항을 집지 않는다
const find = (q, passage) =>
  Q.find((x) => x.question.trim() === q.trim() && (x.passage ?? "").trim() === (passage ?? "").trim());

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"practical",examDate:null},stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,120)));

  await p.goto(BASE + "/practical", { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  await p.getByRole("button", { name: "용어", exact: true }).click();
  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForTimeout(500);

  const MODE = ["모범 답안 그대로", "띄어쓰기를 흘려서", "아예 모를 때"];
  for (let i = 0; i < 3; i++) {
    const qText = (await p.locator("main h2").first().innerText()).trim();
    const pre = await p.locator("main pre").first().innerText().catch(() => "");
    const q = find(qText, pre);
    console.log(`\n━━━ ${i + 1}번 · ${MODE[i]} ━━━`);
    console.log("  문항: " + qText.slice(0, 56) + "…");
    if (!q) { console.log("  (코드에서 못 찾음)"); break; }

    if (i === 2) {
      await p.getByRole("button", { name: "모르겠어요" }).click();
      await p.waitForTimeout(350);
      const t = dump(await p.locator("main").innerText());
      const idx = t.indexOf("모범 답안");
      console.log("  " + t.slice(idx, idx + 150).replace(/\n/g, "\n  "));
      // 보고 나서 적으면 어떻게 되는가
      await p.locator("textarea").fill(q.answers[0]);
      await p.getByRole("button", { name: "채점" }).click();
      await p.waitForTimeout(350);
      const v = dump(await p.locator("main").innerText());
      const line = v.split("\n").find((l) => /맞았습니다|틀렸습니다|빈칸|답을 보고 적었습니다/.test(l));
      console.log("  보고 나서 적으니 → " + line);
    } else {
      const ans = i === 0 ? q.answers[0] : q.answers[0].replace(/\s+/g, "");
      await p.locator("textarea").fill(ans);
      await p.getByRole("button", { name: "채점" }).click();
      await p.waitForTimeout(350);
      const v = dump(await p.locator("main").innerText());
      const line = v.split("\n").find((l) => /맞았습니다|틀렸습니다|빈칸|답을 보고 적었습니다/.test(l));
      console.log(`  "${ans.slice(0, 30)}" → ${line}`);
    }
    const nx = p.getByRole("button", { name: /다음|결과 보기/ });
    if (await nx.count()) { await nx.click(); await p.waitForTimeout(350); }
  }
  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
