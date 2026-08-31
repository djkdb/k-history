const { chromium } = require("playwright");
const BASE = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const href = await p.evaluate(() => [...document.querySelectorAll("a[href*='exam=lc']")].map(a=>a.getAttribute("href")).find(h=>!h.includes("resume")));
  await p.goto(BASE + href, { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  for (const n of [1, 2, 4, 5, 17, 18, 20]) {
    await p.evaluate((k) => {
      const b = [...document.querySelectorAll("button[aria-label]")].find((x) => (x.getAttribute("aria-label")||"").startsWith(`${k}번`));
      if (b) b.click();
    }, n);
    await p.waitForTimeout(250);
    const info = await p.evaluate(() => {
      const head = (document.querySelector("main")?.innerText || "").split("\n").slice(0, 3).join(" | ");
      const cands = [...document.querySelectorAll("button")]
        .filter((x) => [...x.querySelectorAll("span")].some((s) => s.textContent.trim() === "A"))
        .map((x) => (x.innerText || "").replace(/\s+/g, " ").slice(0, 40));
      return { head, cands, count: cands.length };
    });
    console.log(`${n}번 → 후보 ${info.count}개  ${JSON.stringify(info.cands)}`);
    await p.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => [...x.querySelectorAll("span")].some((s) => s.textContent.trim() === "A"));
      if (b) b.click();
    });
    await p.waitForTimeout(250);
    const after = await p.evaluate(() => (document.body.innerText.match(/(\d+)\s*\/\s*\d+\s*답함/)||[])[1]);
    console.log(`      누른 뒤 답함 ${after}`);
  }
  await b.close();
})();
