// 처음 온 사람이 되어 본다. 눌러 보고, 화면에 뭐가 적혀 있는지 그대로 읽어 온다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4510";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  console.log("### 처음 열었을 때 주소:", p.url().replace(BASE, "") || "/");
  console.log(dump(await p.locator("body").innerText()));

  console.log("\n### 안내 1 → 2");
  await p.getByRole("button", { name: "다음" }).click();
  await p.waitForTimeout(200);
  console.log(dump(await p.locator("body").innerText()));

  console.log("\n### 안내 2 → 3");
  await p.getByRole("button", { name: "다음" }).click();
  await p.waitForTimeout(200);
  console.log(dump(await p.locator("body").innerText()));

  console.log("\n### 시험일을 넣어 본다");
  await p.locator('input[type="date"]').fill("2026-10-17");
  await p.waitForTimeout(200);
  console.log(dump(await p.locator("main").innerText()).slice(0, 400));

  await p.getByRole("button", { name: "시작하기" }).click();
  await p.waitForTimeout(800);
  console.log("\n### 홈 (주소: " + p.url().replace(BASE, "") + ")");
  console.log(dump(await p.locator("body").innerText()));

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
