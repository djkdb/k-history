const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4517";
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE + "/mock/session?seed=555", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  for (let i = 0; i < 3; i++) {
    await p.locator('main button:has(span:text-is("1"))').first().click();
    await p.waitForTimeout(120);
    await p.getByRole("button", { name: "다음" }).click();
    await p.waitForTimeout(150);
  }
  await p.getByRole("button", { name: "답안지" }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: "/tmp/gisa-sheet.png" });
  await p.getByRole("button", { name: "제출하기" }).click();
  await p.waitForTimeout(300);
  await p.getByRole("button", { name: "제출", exact: true }).click();
  await p.waitForTimeout(900);
  await p.screenshot({ path: "/tmp/gisa-result.png" });
  console.log("찍었다");
  await b.close();
})();
