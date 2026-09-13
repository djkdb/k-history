// 정보처리기사 — 서비스 워커가 정말 설치되고, 정말 오프라인에서 뜨는가.
// 미리 담을 것 하나를 일부러 404 로 만들어도 설치가 죽지 않아야 한다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
const BREAK = process.argv[3] === "break";
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  if (BREAK) await ctx.route("**/fonts/pretendard-600.woff2", (r) => r.fulfill({ status: 404, body: "" }));
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const ready = await p.evaluate(() =>
    navigator.serviceWorker.ready.then((r) => !!r.active).catch(() => false));
  ready ? ok("서비스 워커가 자리 잡았다") : no("서비스 워커가 자리 잡지 못했다");

  // 오프라인에 대비해 쓸 화면을 한 번씩 돌아 캐시에 담는다 (network-first 라 방문분이 담긴다)
  const ROUTES = ["/learn", "/quiz", "/practical", "/review", "/mock", "/settings"];
  for (const r of ROUTES) await p.goto(BASE + r, { waitUntil: "networkidle" });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);

  const n = await p.evaluate(async () => {
    const c = await caches.open("gisa-v1");
    return (await c.keys()).length;
  });
  n >= 20 ? ok(`캐시에 ${n}개가 담겼다`) : no(`캐시에 ${n}개뿐이다`);

  await ctx.setOffline(true);
  for (const r of ["/", ...ROUTES]) {
    await p.goto(BASE + r, { waitUntil: "domcontentloaded" }).catch(() => {});
    const txt = (await p.locator("body").innerText().catch(() => "")).slice(0, 60).replace(/\n/g, " ");
    const dead = /could not be found|ERR_|오프라인/i.test(txt) || !txt.trim();
    dead ? no(`오프라인 ${r}: ${txt}`) : ok(`오프라인에서 ${r} 가 뜬다`);
  }
  await ctx.setOffline(false);

  errs.length ? errs.slice(0, 3).forEach((e) => no("예외: " + e)) : ok("예외 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 이상 없음");
  process.exit(bad ? 1 : 0);
})();
