/*
 * 한 웹에 묶었을 때만 생기는 일들 — 눌러야 보이는 것까지.
 *
 *   ① SQLD 의 SQL 엔진이 /sqld 아래에서 실제로 받아지는가
 *   ② 한국사 모의고사의 시험지 그림이 /history 아래에서 뜨는가
 *   ③ 다섯 앱 + 현관의 서비스 워커가 각자 자기 길만 맡는가
 *   ④ 한 앱의 워커가 켜져도 남의 캐시가 지워지지 않는가
 *   ⑤ 망을 끊어도 각 앱과 현관이 열리는가
 *   ⑥ 글꼴이 남의 앱 것이 아니라 제 것으로 받아지는가
 *
 *   node scratchpad/combined-check.js
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.resolve("/home/user/k-history/out-all");
const MIME = { ".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",
  ".webp":"image/webp",".wasm":"application/wasm" };
function 찾기(u) {
  const p = path.join(ROOT, u);
  const 후보 = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")];
  for (const f of 후보) { try { if (fs.statSync(f).isFile()) return [200, f]; } catch {} }
  let d = path.dirname(p);
  while (d.startsWith(ROOT)) { const f = path.join(d, "404.html"); if (fs.existsSync(f)) return [404, f]; if (d === ROOT) break; d = path.dirname(d); }
  return [404, null];
}
const srv = http.createServer((q, r) => {
  const [code, f] = 찾기(decodeURIComponent(q.url.split("?")[0]));
  if (!f) { r.writeHead(404); return r.end("x"); }
  r.writeHead(code, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
  r.end(fs.readFileSync(f));
});
const BASE = "http://127.0.0.1:7100";
let 탈 = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { 탈++; console.log("  ✗ " + s); };
const APPS = ["/history", "/comhwal", "/sqld", "/toeic", "/gisa"];

(async () => {
  await new Promise((r) => srv.listen(7100, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* ── ① SQL 엔진 ── */
  {
    console.log("\n━━━ ① SQLD 의 SQL 엔진");
    const ctx = await b.newContext({ serviceWorkers: "block" });
    await ctx.addInitScript(() => { try { localStorage.setItem("sqld:mirror:sqld-state", JSON.stringify({ state: { settings: { examDate: null } } })); } catch {} });
    const p = await ctx.newPage();
    const 받은 = [];
    p.on("response", (r) => { const u = new URL(r.url()); if (/sql-wasm/.test(u.pathname)) 받은.push(`${u.pathname} ${r.status()}`); });
    await p.goto(BASE + "/sqld/concept/m-null-property", { waitUntil: "networkidle" });
    await p.waitForTimeout(2500);
    console.log("    받은 것: " + (받은.join(" · ") || "없음"));
    if (받은.length && 받은.every((x) => x.startsWith("/sqld/") && x.endsWith(" 200"))) ok("엔진을 /sqld 아래에서 받았다");
    else no("엔진을 제자리에서 못 받았다");
    /*
     * 실제로 돌려 본다.
     * ⚠️ 처음에는 결과 표가 그냥 떠 있을 줄 알았다. SQL 은 "실행하기" 를
     *    눌러야 돈다 — 누르지 않고 표를 찾으니 엔진이 멀쩡한데도 실패로 셌다.
     */
    const 실행 = p.locator("button", { hasText: /^실행하기$/ }).first();
    if (!(await 실행.count())) { no("실행하기 단추가 없다"); }
    else {
      await p.waitForFunction(() => [...document.querySelectorAll("button")].some((b) => b.textContent.trim() === "실행하기" && !b.disabled), null, { timeout: 15000 }).catch(() => {});
      const 전표 = await p.locator("table").count();
      await 실행.click();
      await p.waitForTimeout(1500);
      const 후표 = await p.locator("table").count();
      const 글 = (await p.locator("body").innerText()).replace(/\s+/g, " ");
      const 오류 = /오류|error|Error/.test(글.slice(-400));
      if (후표 > 전표 && !오류) ok(`실행하기를 누르니 결과 표가 그려졌다 (${전표} → ${후표})`);
      else no(`실행해도 결과가 없다 (표 ${전표} → ${후표}${오류 ? " · 오류 문구" : ""})`);
    }
    await ctx.close();
  }

  /* ── ② 한국사 시험지 그림 ── */
  {
    console.log("\n━━━ ② 한국사 모의고사 시험지");
    const ctx = await b.newContext({ serviceWorkers: "block", viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    const 그림 = [];
    p.on("response", (r) => { const u = new URL(r.url()); if (u.pathname.endsWith(".webp")) 그림.push(`${u.pathname} ${r.status()}`); });
    await p.goto(BASE + "/history/mock/session?id=74-advanced", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    const 시작 = p.locator("button", { hasText: /시작/ }).first();
    if (await 시작.count()) { await 시작.click(); await p.waitForTimeout(1500); }
    console.log("    받은 그림: " + (그림.slice(0, 3).join(" · ") || "없음"));
    if (그림.length && 그림.every((x) => x.startsWith("/history/exams/") && x.endsWith(" 200"))) ok(`시험지 ${그림.length}장을 /history 아래에서 받았다`);
    else no("시험지 그림을 못 받았다");
    const 보임 = await p.evaluate(() => [...document.images].filter((i) => i.src.endsWith(".webp") && i.naturalWidth > 0).length);
    if (보임 > 0) ok(`화면에 실제로 그려진 시험지 ${보임}장`);
    else no("화면에 그려진 시험지가 없다");
    await ctx.close();
  }

  /* ── ③④⑤⑥ 서비스 워커 ── */
  {
    console.log("\n━━━ ③ 서비스 워커가 각자 자기 길만 맡는가");
    const ctx = await b.newContext({ serviceWorkers: "allow", viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("comhwal:mirror:comhwal-state", JSON.stringify({ state: { settings: { grade: 1, kind: "written", examDate: null } } }));
        localStorage.setItem("sqld:mirror:sqld-state", JSON.stringify({ state: { settings: { examDate: null } } }));
        localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: { settings: { track: "written", examDate: null } } }));
        localStorage.setItem("toeic:mirror:toeic-state", JSON.stringify({ state: { settings: { band: 700, examDate: null, speechRate: 1, showScript: false } } }));
      } catch {}
    });
    const p = await ctx.newPage();
    const 글꼴 = [];
    p.on("request", (q) => { const u = new URL(q.url()); if (u.pathname.endsWith(".woff2")) 글꼴.push([new URL(p.url()).pathname, u.pathname]); });
    for (const u of ["/", ...APPS.map((a) => a + "/")]) {
      await p.goto(BASE + u, { waitUntil: "networkidle" });
      await p.waitForTimeout(2500);
    }
    const 등록 = await p.evaluate(async () =>
      (await navigator.serviceWorker.getRegistrations()).map((r) => new URL(r.scope).pathname).sort());
    console.log("    맡은 길: " + 등록.join(" "));
    for (const s of ["/", ...APPS.map((a) => a + "/")])
      if (등록.includes(s)) ok(`${s} 를 맡은 워커가 있다`); else no(`${s} 를 맡은 워커가 없다`);

    console.log("\n━━━ ④ 남의 캐시를 지우지 않는가");
    const 캐시 = await p.evaluate(async () => {
      const out = {};
      for (const k of await caches.keys()) out[k] = (await (await caches.open(k)).keys()).length;
      return out;
    });
    console.log("    " + Object.entries(캐시).map(([k, n]) => `${k}:${n}`).join("  "));
    for (const pre of ["hub-", "khlm-", "comhwal-", "sqld-", "toeic-", "gisa-"]) {
      const 있는 = Object.entries(캐시).filter(([k]) => k.startsWith(pre));
      if (있는.length === 1 && 있는[0][1] > 20) ok(`${pre.slice(0, -1)} 캐시가 살아 있다 (${있는[0][1]}개)`);
      else no(`${pre.slice(0, -1)} 캐시가 이상하다: ${JSON.stringify(있는)}`);
    }
    /* 판 번호가 정말 들어갔는가 */
    if (Object.keys(캐시).some((k) => k.includes("__BUILD__"))) no("캐시 이름에 판 번호 대신 자리 표시가 남았다");
    else ok("캐시 이름마다 판 번호가 들어갔다");
    /* 현관 캐시에 남의 화면이 섞였는가 */
    const 섞임 = await p.evaluate(async (apps) => {
      const k = (await caches.keys()).find((x) => x.startsWith("hub-"));
      if (!k) return -1;
      const ks = await (await caches.open(k)).keys();
      return ks.filter((r) => apps.some((a) => new URL(r.url).pathname.startsWith(a + "/"))).length;
    }, APPS);
    if (섞임 === 0) ok("현관 캐시에 다섯 앱의 화면이 섞이지 않았다");
    else no(`현관 캐시에 남의 화면 ${섞임}개가 섞였다`);

    console.log("\n━━━ ⑥ 글꼴은 제 것을 받는가");
    const 남의글꼴 = 글꼴.filter(([page, f]) => {
      const 앱 = APPS.find((a) => page.startsWith(a + "/"));
      return 앱 ? !f.startsWith(앱 + "/") : f.split("/").length > 3;
    });
    if (글꼴.length && 남의글꼴.length === 0) ok(`글꼴 ${글꼴.length}번 모두 제 앱 것을 받았다`);
    else if (!글꼴.length) console.log("    · 글꼴 요청이 없었다 (캐시에서 나왔을 수 있다)");
    else no(`남의 글꼴을 받은 곳: ${남의글꼴.slice(0, 3).map((x) => x.join("→")).join(" | ")}`);

    console.log("\n━━━ ⑤ 망을 끊어도 열리는가");
    await ctx.setOffline(true);
    for (const u of ["/", "/gisa/learn", "/comhwal/game", "/sqld/", "/toeic/", "/history/learn"]) {
      await p.goto(BASE + u, { waitUntil: "domcontentloaded" }).catch(() => {});
      await p.waitForTimeout(1200);
      const r = await p.evaluate(() => ({
        길: location.pathname, 글: (document.body.innerText || "").trim().length,
        규칙: [...document.styleSheets].reduce((n, s) => { try { return n + s.cssRules.length; } catch { return n; } }, 0),
      })).catch(() => ({ 길: "?", 글: 0, 규칙: 0 }));
      const 기대 = u.replace(/\/$/, "") || "/";
      const 같은곳 = r.길.replace(/\/$/, "") === 기대.replace(/\/$/, "") || (기대 === "/" && r.길 === "/");
      if (같은곳 && r.글 > 50 && r.규칙 > 100) ok(`${u} — ${r.글}자 · 꾸밈 규칙 ${r.규칙}개`);
      else no(`${u} → ${r.길} (${r.글}자 · 규칙 ${r.규칙}개)`);
    }

    /* ④ 를 한 번 더 — 망을 끊고 다니는 동안에도 남의 캐시가 그대로인가 */
    const 뒤 = await p.evaluate(async () => (await caches.keys()).length).catch(() => 0);
    if (뒤 === Object.keys(캐시).length) ok(`돌아다닌 뒤에도 캐시 ${뒤}개 그대로`);
    else no(`캐시 수가 ${Object.keys(캐시).length} → ${뒤} 로 바뀌었다`);
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(탈 ? `\n문제 ${탈}건` : "\n문제 0건");
  process.exit(탈 ? 1 : 0);
})();
