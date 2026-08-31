const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(process.argv[2] + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const cards = await p.evaluate(() =>
    [...document.querySelectorAll("a[href*='/mock/session']")].map((a) => {
      let el = a; for (let i = 0; i < 5 && el.parentElement; i++) { el = el.parentElement; if (/모의고사/.test(el.innerText)) break; }
      return { href: a.getAttribute("href"), text: el.innerText.replace(/\s+/g, " ").slice(0, 110) };
    }));
  cards.forEach(c => console.log("CARD", c.href, "|", c.text));
  await p.goto(process.argv[2] + cards[0].href, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  console.log("\n── 세션 화면 ──\n" + (await p.evaluate(() => document.body.innerText)).slice(0, 500));
  await b.close();
})();
