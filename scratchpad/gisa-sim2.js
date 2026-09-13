const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = "http://127.0.0.1:4511";
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));

  // 첫 안내 도중에 아래 길잡이를 눌러 본다 — 실제로 누를 수 있으니 눌러 볼 것이다
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  console.log("### 안내 화면에서 아래 '문제' 를 눌러 보면");
  await p.locator("nav a", { hasText: "문제" }).click();
  await p.waitForTimeout(600);
  console.log("주소:", p.url().replace(BASE, ""));
  console.log(dump(await p.locator("main").innerText()).slice(0, 300));
  console.log("\n### 거기서 '홈' 을 누르면");
  await p.locator("nav a", { hasText: "홈" }).click();
  await p.waitForTimeout(900);
  console.log("주소:", p.url().replace(BASE, ""), "← 안내로 도로 끌려간다면 갇힌 느낌이 난다");

  console.log("\n예외:", errs.length ? errs : "없음");
  await b.close();
})();
