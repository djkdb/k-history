// 시크릿 창처럼 저장이 막힌 곳에서도 앱이 살아 있는가.
// IndexedDB 와 localStorage 를 둘 다 막고 열어 본다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
// ⚠️ 포트를 박아 두면 그 포트에 아무도 없을 때 "확인 못 함" 이 아니라
//    그냥 터진다. 받아서 쓴다.
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-private.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    // 저장을 건드리면 무조건 터지게 만든다 (사파리 사생활 보호 모드가 이렇게 군다)
    const boom = () => { throw new DOMException("denied", "SecurityError"); };
    try { Object.defineProperty(window, "indexedDB", { get: boom }); } catch {}
    try {
      Object.defineProperty(window, "localStorage", { get: boom });
      Object.defineProperty(window, "sessionStorage", { get: boom });
    } catch {}
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 130)));

  for (const url of ["/", "/learn", "/quiz", "/concept/d-oop", "/mock", "/practical", "/review", "/settings"]) {
    await p.goto(BASE + url, { waitUntil: "networkidle" }).catch(() => {});
    await p.waitForTimeout(500);
    const txt = (await p.locator("body").innerText().catch(() => "")).trim();
    if (txt.length > 40) ok(`${url} 가 뜬다`);
    else no(`${url} 가 비었다 (${txt.length}자)`);
  }

  console.log("\n  저장이 막힌 채로 문제를 풀어 본다");
  await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const start = p.getByRole("button", { name: /문항 시작/ });
  if (await start.count()) {
    await start.click(); await p.waitForTimeout(400);
    await p.locator('main button:has(span:text-is("1"))').first().click();
    await p.waitForTimeout(400);
    const t = await p.locator("main").innerText();
    /해설/.test(t) ? ok("고르고 해설까지 나온다") : no("골라도 해설이 안 나온다");
  } else no("문제를 시작할 수 없다");

  errs.length ? errs.slice(0, 4).forEach((e) => no("예외: " + e)) : ok("예외 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 저장이 막혀도 쓸 수 있다");
  process.exit(bad ? 1 : 0);
})();
