// 서비스 워커가 정말 설치되고, 정말 오프라인에서 뜨는가.
//
// 미리 담기가 하나라도 실패하면 예전 코드는 설치 자체가 안 됐다.
// 일부러 하나를 404 로 만들어 놓고도 설치·오프라인이 되는지 본다.
const { chromium } = require("playwright");
const BASE = process.argv[2];
const BREAK = process.argv[3] === "break"; // 미리 담을 것 하나를 일부러 막는다
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  if (BREAK) {
    // 글꼴 하나를 없는 것처럼 만든다 (서버 설정이 바뀌어 하나가 빠진 상황)
    await ctx.route("**/fonts/pretendard-600.woff2", (r) => r.fulfill({ status: 404, body: "" }));
  }
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  // 서비스 워커가 자리 잡을 때까지
  const active = await p.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return "지원 안 함";
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    return reg ? (reg.active ? "active" : "설치만 됨") : "등록 실패";
  });
  active === "active" ? ok("서비스 워커가 자리 잡았다") : no("서비스 워커 상태: " + active);

  // 미리 담긴 것이 얼마나 되는가
  const cached = await p.evaluate(async () => {
    const names = await caches.keys();
    let n = 0;
    for (const k of names) n += (await (await caches.open(k)).keys()).length;
    return { names, n };
  });
  cached.n > 50 ? ok(`캐시에 ${cached.n}개 담겼다 (${cached.names.join(",")})`)
                : no(`캐시에 ${cached.n}개뿐 (${cached.names.join(",")})`);

  // ── 오프라인으로 ──
  await ctx.setOffline(true);
  await p.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
  await p.waitForTimeout(1200);
  const home = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  /어휘|모의고사|목표/.test(home) ? ok("오프라인에서 홈이 뜬다") : no("오프라인 홈: " + home.slice(0, 90));

  // 다른 화면으로 이동
  for (const r of ["/vocab", "/mock", "/listen"]) {
    await p.goto(BASE + r, { waitUntil: "domcontentloaded" }).catch(() => {});
    await p.waitForTimeout(900);
    const t = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
    const looksReal = t.length > 60 && !/ERR_|연결할 수 없|No internet/i.test(t);
    looksReal ? ok(`오프라인에서 ${r} 이 뜬다`) : no(`오프라인 ${r}: ${t.slice(0, 80)}`);
  }
  await ctx.setOffline(false);
  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  console.log(bad ? `\n문제 ${bad}건` : "\n이상 없음");
  await b.close();
})();
