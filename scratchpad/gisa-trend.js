/*
 * 점수 추이 그래프가 제구실을 하는가.
 *
 * 선이 그려지는 것만으로는 모자란다. 오르면 오른다고, 과락이면 과락이라고
 * 말해야 쓸모가 있다. 응시 기록을 심어 두고 그 말이 맞는지 본다.
 *
 *   node scratchpad/gisa-trend.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-trend.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

const SUBJ = ["design", "develop", "database", "language", "system"];
/** 회차마다 평균이 오르되, 데이터베이스만 제자리에 두어 과락이 남게 한다 */
function runs(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const base = 30 + i * 6;
    const bySubject = SUBJ.map((s) => {
      const pct = s === "database" ? 30 : Math.min(95, base + 10);
      return { subject: s, correct: Math.round((pct / 100) * 20), total: 20 };
    });
    const score = Math.round(
      bySubject.reduce((a, b) => a + (b.correct / b.total) * 100, 0) / SUBJ.length,
    );
    out.push({
      track: "written", startedAt: 1000 + i, finishedAt: 2000 + i,
      score, passed: false, bySubject,
    });
  }
  return out;
}

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const [이름, n, 있어야] of [["한 회만 봤을 때", 1, false], ["여섯 회 봤을 때", 6, true]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript((att) => {
      try {
        localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
          state: { settings: { track: "written", examDate: null }, mockAttempts: att },
        }));
      } catch {}
    }, runs(n));
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
    await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
    await p.waitForTimeout(1200);

    console.log(`\n━━━ ${이름}`);
    const has = await p.locator("svg[role=img]").count();
    if (있어야 && has) ok("그래프가 그려진다");
    else if (!있어야 && !has) ok("회차가 하나뿐이면 그리지 않는다 (견줄 것이 없다)");
    else if (있어야) { no("그래프가 없다"); await ctx.close(); continue; }
    else { no("한 회뿐인데 그래프를 그렸다"); await ctx.close(); continue; }

    if (!있어야) { await ctx.close(); continue; }

    const t = await p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
    if (/▲\s*\d+점/.test(t)) ok(`오르고 있다고 말한다 — ${(t.match(/▲\s*\d+점/) || [])[0]}`);
    else no("오르고 있는데 그 말이 없다");

    if (/DB.*40점에 못 미|40점에 못 미쳤습니다/.test(t)) ok("과락 과목을 짚어 준다");
    else no("데이터베이스가 30점인데 과락 경고가 없다");

    const lines = await p.evaluate(() => document.querySelectorAll("svg path").length);
    if (lines >= 6) ok(`선 ${lines}개 — 평균과 과목 다섯이 함께 그려진다`);
    else no(`선이 ${lines}개뿐이다`);

    const label = await p.evaluate(() => {
      const s = document.querySelector("svg[role=img]");
      return s ? s.getAttribute("aria-label") : null;
    });
    if (label && /추이/.test(label)) ok(`소리로도 읽힌다 — "${label.slice(0, 44)}…"`);
    else no("그림에 이름이 없어 읽어 줄 수 없다");

    if (errs.length) no(`예외: ${errs[0]}`);
    await ctx.close();
  }
  console.log(bad ? `\n걸린 것 ${bad}건` : "\n✓ 점수 추이가 제구실을 한다");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
