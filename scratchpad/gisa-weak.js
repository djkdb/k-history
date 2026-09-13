// 홈이 짚어 준 과목으로 실제로 이어지는가, 그리고 짚은 것이 맞는가.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { analyze } = jiti("/home/user/k-history/gisa/src/lib/weakness.ts");
const { cutoff, SUBJECT_MAP } = jiti("/home/user/k-history/gisa/src/data/exam.ts");
// 포트를 박아 두면 서버가 바뀔 때마다 검사가 통째로 죽는다
const BASE = process.argv[2] || "http://127.0.0.1:4830";
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

// 1) 계산이 맞는가 — 과락 난 과목이 늘 맨 앞에 오는가
console.log("[짚는 규칙]");
const now = Date.now();
const mk = (scores) => [{ track: "written", startedAt: now, finishedAt: now, score: 0, passed: false,
  bySubject: Object.entries(scores).map(([subject, correct]) => ({ subject, correct, total: 20 })) }];
const cases = [
  ["언어만 과락", { design: 15, develop: 15, database: 15, language: 5, system: 15 }, "language"],
  ["DB 가 가장 낮음(과락 없음)", { design: 15, develop: 14, database: 9, language: 13, system: 15 }, "database"],
  ["둘 과락 — 더 낮은 쪽", { design: 3, develop: 15, database: 15, language: 7, system: 15 }, "design"],
];
for (const [why, scores, want] of cases) {
  const w = analyze(mk(scores), [], []);
  const got = w[0].subject;
  // 과락이 둘이면 어느 쪽이 앞이든 과락 과목이어야 한다
  const failedOnes = w.filter((x) => x.failed).map((x) => x.subject);
  const fine = failedOnes.length > 1 ? failedOnes.includes(got) : got === want;
  fine ? ok(`${why} → ${SUBJECT_MAP[got].short} 를 짚는다`)
       : no(`${why} → ${SUBJECT_MAP[got].short} 를 짚었다 (${SUBJECT_MAP[want].short} 여야 한다)`);
}
// 과락은 언제나 비과락보다 앞
{
  const w = analyze(mk({ design: 7, develop: 8, database: 8, language: 8, system: 8 }), [], []);
  w[0].failed ? ok("과락 과목이 언제나 맨 앞에 온다") : no("과락 과목이 맨 앞이 아니다");
}
// 기록이 없으면 조용해야 한다
{
  const w = analyze([], [], []);
  w.every((x) => !x.grounded) ? ok("기록이 없으면 급한 곳을 만들어 내지 않는다")
                              : no("기록이 없는데 급하다고 한다");
  // 틀린 것이 하나라도 있으면 그때부터는 짚어야 한다
  const w2 = analyze([], ["b-normalization"], []);
  w2.find((x) => x.subject === "database")?.grounded
    ? ok("틀린 개념이 생기면 그때부터 짚는다")
    : no("틀린 개념이 있는데도 짚지 않는다");
}

// 2) 화면에서 눌렀을 때 정말 그 과목으로 가는가
(async () => {
  console.log("\n[눌러 보기]");
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript((n) => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:null}, stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],
      mockAttempts:[{track:"written",startedAt:n,finishedAt:n,score:52,passed:false,bySubject:[
        {subject:"design",correct:15,total:20},{subject:"develop",correct:15,total:20},
        {subject:"database",correct:15,total:20},{subject:"language",correct:5,total:20},
        {subject:"system",correct:15,total:20}]}]}})); } catch {} }, now);
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,110)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const card = await p.locator("text=지금 가장 급한 곳").count();
  card ? ok("홈에 '지금 가장 급한 곳' 이 떴다") : no("급한 곳 카드가 없다");

  await p.getByRole("link", { name: /이 과목 문제 풀기/ }).click();
  await p.waitForTimeout(900);
  const url = p.url().replace(BASE, "");
  const chipOn = await p.locator('button:has-text("언어")').first().getAttribute("class");
  url.includes("subject=language") ? ok(`문제 화면으로 갔다 — ${url}`) : no(`주소가 ${url} 다`);
  chipOn && chipOn.includes("pill-on") ? ok("언어 과목이 미리 골라져 있다")
    : no("과목이 골라져 있지 않다 — 주소만 바뀌고 화면은 전체다");
  const pool = await p.locator("text=/고를 수 있는 문항/").locator("xpath=following-sibling::*[1]").textContent().catch(()=>null);
  console.log("    고를 수 있는 문항:", pool ?? "(못 읽음)");

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  await p.getByRole("link", { name: "개념 보기" }).click();
  await p.waitForTimeout(900);
  const learnChip = await p.locator('button:has-text("언어")').first().getAttribute("class");
  learnChip && learnChip.includes("pill-on") ? ok("학습 화면도 언어로 걸러져 있다") : no("학습 화면이 걸러지지 않았다");

  errs.length ? errs.slice(0,3).forEach(e=>no("예외: "+e)) : ok("예외 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 이상 없음");
  process.exit(bad ? 1 : 0);
})();
