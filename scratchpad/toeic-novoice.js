// 영어 음성이 없는 기기를 흉내 낸다 (한국어 TTS 만 깔린 안드로이드폰).
const { chromium } = require("playwright");
const BASE = process.argv[2];
const MODE = process.argv[3] || "empty"; // empty=목소리 0개, korean=한국어만, none=API 자체 없음
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript((mode) => {
    if (mode === "none") { try { delete window.speechSynthesis; } catch {} return; }
    const list = mode === "korean"
      ? [{ name: "Google 한국의", lang: "ko-KR", default: true, localService: true, voiceURI: "ko" }]
      : [];
    try {
      Object.defineProperty(window.speechSynthesis, "getVoices", { value: () => list, configurable: true });
    } catch {}
  }, MODE);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  for (const r of ["/listen", "/part/1"]) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(3200); // loadVoices 는 최대 2초 기다린다
    const t = (await p.evaluate(() => document.body.innerText)).replace(/\n+/g, " / ").replace(/\s+/g, " ");
    const warned = /영어 음성이 없습니다/.test(t);
    console.log(`  ${r.padEnd(9)} 안내 ${warned ? "뜸 ✓" : "안 뜸 ✗"}  · 스크립트 ${/스크립트/.test(t) ? "있음" : "없음"}`);
    if (!warned) console.log("      " + t.slice(0, 200));
  }
  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  await b.close();
})();
