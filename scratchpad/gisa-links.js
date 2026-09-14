// 화면 안의 모든 내부 링크가 실제로 존재하는 경로를 가리키는가.
//
// 링크 하나가 죽어 있어도 화면은 멀쩡해 보인다. 누르는 순간에야 404 가 뜬다.
// 전수조사는 화면을 "열어" 보지만 링크를 "따라가" 보지는 않았다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.resolve("gisa/out");
const BASE = process.argv[2] || "http://127.0.0.1:4960";

const exists = (route) => {
  const u = route.split("?")[0].split("#")[0];
  for (const f of [OUT + u + ".html", OUT + u, OUT + path.join(u, "index.html")]) {
    try { if (fs.statSync(f).isFile()) return true; } catch {}
  }
  return false;
};

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // 기록이 있는 사람이라야 조건부로 나오는 링크(급한 곳·이어하기)까지 본다
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    const n = Date.now();
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:"2026-10-14"},
      stats:{xp:500,streak:3,lastStudyDate:null,studyMinutes:100},
      studiedIds:["d-sdlc"],clearedQuestionIds:[],clearedPracticalIds:[],
      reviewCards:[{sourceId:"d-sdlc",addedAt:n,lastReviewedAt:null,stage:0,nextDueAt:n-1000,lapses:0}],
      quizHistory:[],wrongIds:["d-sdlc","l-os-memory"],
      mockAttempts:[{track:"written",startedAt:n,finishedAt:n,score:40,passed:false,bySubject:[
        {subject:"design",correct:12,total:20},{subject:"develop",correct:10,total:20},
        {subject:"database",correct:9,total:20},{subject:"language",correct:5,total:20},
        {subject:"system",correct:10,total:20}]}]}})); } catch {} });
  const p = await ctx.newPage();

  // out/ 의 모든 화면을 돈다
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const routes = walk(OUT).filter((f) => f.endsWith(".html") && !f.includes("/_next/"))
    .map((f) => "/" + path.relative(OUT, f).replace(/\.html$/, "").replace(/\/?index$/, ""))
    .map((r) => (r === "" ? "/" : r));

  const seen = new Map();   // 링크 → 어느 화면에서 나왔나
  let bad = 0;
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: "networkidle" }).catch(() => {});
    await p.waitForTimeout(220);
    const hrefs = await p.locator("a[href]").evaluateAll((as) =>
      as.map((a) => a.getAttribute("href")).filter(Boolean));
    for (const h of hrefs) {
      if (!h.startsWith("/")) continue;      // 바깥 주소는 여기서 보지 않는다
      if (!seen.has(h)) seen.set(h, r);
    }
  }
  console.log(`화면 ${routes.length}개에서 서로 다른 내부 링크 ${seen.size}개를 모았다\n`);
  for (const [h, from] of seen) {
    if (!exists(h)) { bad++; console.log(`  ✗ 죽은 링크 ${h}  (${from} 에서)`); }
  }
  // 화면 중 아무 데서도 링크되지 않은 곳은 없는가 (닿을 수 없는 화면)
  const linked = new Set([...seen.keys()].map((h) => h.split("?")[0]));
  const orphan = routes.filter((r) => r !== "/" && !linked.has(r) && !r.startsWith("/concept/"));
  if (orphan.length) console.log(`\n  ⚠️  어디서도 링크되지 않는 화면: ${orphan.join(", ")}`);

  await b.close();
  console.log(bad ? `\n죽은 링크 ${bad}개` : "\n✓ 죽은 링크 없음");
  process.exit(bad ? 1 : 0);
})();
