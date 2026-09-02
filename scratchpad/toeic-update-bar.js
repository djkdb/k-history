// 새 판이 올라왔을 때 알림이 뜨는가.
// 서비스 워커가 자리 잡은 뒤 sw.js 를 바꿔 놓고 update() 를 부른다.
const { chromium } = require("playwright");
const fs = require("fs");
const BASE = process.argv[2], SW = process.argv[3];
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const original = fs.readFileSync(SW, "utf8");
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  try {
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    const st = await p.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      return reg && reg.active ? "active" : "없음";
    });
    st === "active" ? ok("서비스 워커가 자리 잡았다") : no("서비스 워커 상태: " + st);

    const before = await p.evaluate(() => /새 판이 준비됐습니다/.test(document.body.innerText));
    before ? no("아직 새 판이 없는데 알림이 떠 있다") : ok("새 판이 없을 때는 알림이 없다");

    // 새 판을 올린 것처럼 sw.js 를 바꾼다
    fs.writeFileSync(SW, original + `\n// 새 판 ${Date.now()}\n`);
    await p.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      await reg?.update();
    });
    // 설치되고 알림이 뜰 때까지
    let waited = 0, shown = false;
    while (waited < 12000) {
      shown = await p.evaluate(() => /새 판이 준비됐습니다/.test(document.body.innerText));
      if (shown) break;
      await p.waitForTimeout(400);
      waited += 400;
    }
    shown ? ok(`새 판이 올라오자 알림이 떴다 (${(waited/1000).toFixed(1)}초)`) : no("새 판을 올렸는데 알림이 안 뜬다");

    if (shown) {
      const hasBtn = await p.evaluate(() =>
        [...document.querySelectorAll("button")].some((x) => /지금 켜기/.test(x.innerText || "")));
      hasBtn ? ok("'지금 켜기' 단추가 있다") : no("'지금 켜기' 단추가 없다");

      // 눌러서 새로 그려지는가
      await p.evaluate(() => {
        const x = [...document.querySelectorAll("button")].find((y) => /지금 켜기/.test(y.innerText || ""));
        x?.click();
      });
      await p.waitForTimeout(3000);
      const gone = await p.evaluate(() => !/새 판이 준비됐습니다/.test(document.body.innerText));
      const alive = await p.evaluate(() => /어휘|모의고사/.test(document.body.innerText));
      gone && alive ? ok("누르면 새로 뜨고 알림이 사라진다") : no(`누른 뒤 상태 — 알림 ${gone ? "사라짐" : "남음"} · 화면 ${alive ? "정상" : "깨짐"}`);
    }
    console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  } finally {
    fs.writeFileSync(SW, original);
    await b.close();
  }
  console.log(bad ? `\n문제 ${bad}건` : "\n이상 없음");
})();
