// 토익을 600점 목표 사용자로 걸어 다닌다. 화면이 실제로 무엇을 말하는지 본다.
const { chromium } = require("playwright");
const BASE = process.argv[2];
const BAND = Number(process.argv[3] || 600);
const KEY = "toeic:mirror:toeic-state";

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(([k, band]) => {
    try {
      if (localStorage.getItem("__w__")) return;
      localStorage.setItem("__w__", "1");
      localStorage.setItem(k, JSON.stringify({
        state: {
          settings: { band, examDate: null, speechRate: 1, showScript: false },
          stats: { xp: 0, streak: 0, lastStudyAt: 0 },
          knownVocabIds: [], studiedGrammarIds: [], clearedQuestionIds: [],
          reviewCards: [], wrongIds: [], mockAttempts: [],
        },
        version: 0,
      }));
    } catch {}
  }, [KEY, BAND]);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));

  const routes = ["/", "/vocab", "/grammar", "/listen", "/part/1", "/part/3", "/part/5", "/part/7", "/mock", "/cram", "/review"];
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    const t = (await p.evaluate(() => document.body.innerText))
      .replace(/\n+/g, " / ").replace(/\s+/g, " ").trim();
    console.log(`\n【${r}】`);
    console.log("  " + t.slice(0, 340));
  }
  if (errs.length) console.log("\n예외: " + [...new Set(errs)].join(" / "));
  await b.close();
})();
