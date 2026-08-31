// 새로고침은 이어 풀고, 새로 시작하면 깨끗해야 한다.
const { chromium } = require("playwright");
const BASE = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    const mk = (n, l) => ({ name: n, lang: l, default: false, localService: true, voiceURI: n });
    const list = [mk("Samantha", "en-US"), mk("Daniel", "en-GB")];
    const ss = window.speechSynthesis;
    Object.defineProperty(ss, "getVoices", { value: () => list, configurable: true });
    Object.defineProperty(ss, "speak", { value: (u) => setTimeout(() => u.onend && u.onend(new Event("end")), 20), configurable: true });
    Object.defineProperty(ss, "cancel", { value: () => {}, configurable: true });
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));
  const st = () => p.evaluate(() => {
    const t = document.body.innerText.replace(/\s+/g, " ");
    const a = t.match(/(\d+)\s*\/\s*(\d+)\s*답함/);
    return { answered: a && +a[1], total: a && +a[2], spent: /이미 나갔습니다/.test(t) };
  });
  const hit = (re) => p.evaluate((s) => {
    const rx = new RegExp(s);
    const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && rx.test((x.innerText||"").trim()));
    if (!b) return false; b.click(); return true;
  }, re);
  const startLink = async () => {
    await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    return p.evaluate(() => [...document.querySelectorAll("a[href*='exam=lc']")]
      .map(a => a.getAttribute("href")).find(h => !h.includes("resume")));
  };

  // 한 번만 재생 켜기
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.evaluate(() => {
    const el = [...document.querySelectorAll("button,[role='switch'],input[type=checkbox]")]
      .find((x) => /한 번만 재생/.test((x.closest("div")?.innerText || x.innerText || "")));
    if (el) el.click();
  });
  await p.waitForTimeout(300);

  const h1 = await startLink();
  await p.goto(BASE + h1, { waitUntil: "networkidle" });
  await p.waitForTimeout(1100);
  await hit("^듣기$");            // 1번 지문 재생
  await p.waitForTimeout(1800);
  await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => [...x.querySelectorAll("span")].some((s) => s.textContent.trim() === "A"));
    if (b) b.click();
  });
  await p.waitForTimeout(400);
  console.log("  ① 한 지문 듣고 한 문항 풂:", JSON.stringify(await st()));

  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  console.log("  ② 새로고침 뒤:", JSON.stringify(await st()), "← 답과 '이미 나감'이 남아야 한다");

  const h2 = await startLink();
  console.log("  ③ 새 시험 링크가 다른 씨앗인가:", h1 === h2 ? "같음 ✗" : "다름 ✓");
  await p.goto(BASE + h2, { waitUntil: "networkidle" });
  await p.waitForTimeout(1400);
  console.log("  ④ 새로 시작한 시험:", JSON.stringify(await st()), "← 0문항·안 나감이어야 한다");
  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  await b.close();
})();
