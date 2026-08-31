// 시험 도중 새로고침하면 어떻게 되는가 (iOS 는 백그라운드 웹뷰를 잘 버린다)
const { chromium } = require("playwright");
const BASE = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const txt = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  const state = () => p.evaluate(() => {
    const t = document.body.innerText.replace(/\s+/g, " ");
    const a = t.match(/(\d+)\s*\/\s*(\d+)\s*답함/);
    const c = t.match(/(\d+):(\d\d)/);
    return { answered: a && +a[1], total: a && +a[2], clock: c && c[0] };
  });

  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const href = await p.evaluate(() => [...document.querySelectorAll("a[href*='exam=lc']")]
    .map(a => a.getAttribute("href")).find(h => !h.includes("resume")));
  await p.goto(BASE + href, { waitUntil: "networkidle" });
  await p.waitForTimeout(1100);

  // 5문항 푼다
  for (let i = 1; i <= 5; i++) {
    await p.evaluate((n) => {
      const b = [...document.querySelectorAll("button[aria-label]")].find((x) => (x.getAttribute("aria-label")||"").startsWith(`${n}번`));
      if (b) b.click();
    }, i);
    await p.waitForTimeout(200);
    await p.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => [...x.querySelectorAll("span")].some((s) => s.textContent.trim() === "A"));
      if (b) b.click();
    });
    await p.waitForTimeout(200);
  }
  console.log("  5문항 푼 직후:", JSON.stringify(await state()));

  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(1400);
  console.log("  새로고침 직후:", JSON.stringify(await state()));
  const t = await txt();
  console.log("  화면이 뭐라고 하나:", t.slice(0, 130));

  // /mock 에 이어하기가 뜨는가
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const m = await txt();
  const resumeLink = await p.evaluate(() => {
    const a = [...document.querySelectorAll("a[href*='resume=1']")][0];
    return a && a.getAttribute("href");
  });
  console.log("  /mock 이어하기 카드:", /이어서|남아 있|풀었습니다/.test(m) ? "뜸 ✓" : "안 뜸 ✗", resumeLink ? "· 링크 있음" : "· 링크 없음");
  if (resumeLink) {
    await p.goto(BASE + resumeLink, { waitUntil: "networkidle" });
    await p.waitForTimeout(1400);
    console.log("  이어하기로 들어가면:", JSON.stringify(await state()));
  }
  await b.close();
})();
