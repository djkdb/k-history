// 새 판이 올라왔을 때 사용자가 알 수 있는가.
//
// 웹은 서비스 워커가 자리를 지키고 있어 화면을 껐다 켜야 새 판이 뜬다.
// 토익에는 알림 막대를 만들어 두고 확인했지만, 정보처리기사는 같은 파일을
// 복사해 놓기만 하고 실제로 뜨는지 본 적이 없다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2] || "http://127.0.0.1:4970";
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const ready = await p.evaluate(() =>
    navigator.serviceWorker.ready.then((r) => !!r.active).catch(() => false));
  ready ? ok("서비스 워커가 자리 잡았다") : no("서비스 워커가 자리 잡지 못했다");

  // 아직 새 판이 없으니 막대가 보이면 안 된다
  await p.waitForTimeout(900);
  const before = await p.locator("text=/새 판|업데이트|지금 켜기/").count();
  before === 0 ? ok("새 판이 없을 때는 막대가 뜨지 않는다") : no(`새 판이 없는데 막대가 ${before}개 떴다`);

  /*
   * 새 판이 올라온 것처럼 만든다.
   *
   * ⚠️ 처음에는 page.route 로 sw.js 응답을 가로채려 했는데 한 번도 걸리지
   *    않았다. 서비스 워커를 받아 오는 요청은 페이지가 아니라 브라우저가
   *    직접 하므로 페이지 단위 가로채기를 타지 않는다. 파일을 실제로 바꾼다.
   */
  const fs = require("node:fs");
  const SW = "/home/user/k-history/gisa/out/sw.js";
  const original = fs.readFileSync(SW, "utf8");
  fs.writeFileSync(SW, original.replace('"gisa-v1"', '"gisa-v2"') + `\n// 새 판 ${Date.now()}\n`);
  const served = 1;

  await p.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    if (r) await r.update();
  });
  await p.waitForTimeout(2500);

  const bar = await p.locator("text=/새 판|업데이트|지금 켜기/").count();
  if (bar > 0) {
    ok("새 판이 준비되자 알림이 떴다");
    const txt = (await p.locator("text=/새 판|업데이트|지금 켜기/").first().innerText()).replace(/\n/g, " ");
    console.log("      화면에 뜬 말: " + txt.slice(0, 60));
    // 눌러 보면 새로고침되는가
    const btn = p.locator("button", { hasText: /지금 켜기|새로고침|다시 열기/ });
    if (await btn.count()) {
      ok("'지금 켜기' 단추가 있다");
    } else no("알림은 떴는데 켜는 단추가 없다");
  } else {
    no(`새 판을 올렸는데 알림이 뜨지 않았다 (sw.js 를 ${served}번 내보냈다)`);
  }

  fs.writeFileSync(SW, original);   // 건드린 것은 되돌린다
  errs.length ? errs.slice(0, 3).forEach((e) => no("예외: " + e)) : ok("예외 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 새 판 알림이 뜬다");
  process.exit(bad ? 1 : 0);
})();
