/*
 * 한 웹으로 묶은 것이 정말 도는가.
 *
 * 하위 경로(/gisa 등) 아래로 옮기면 Next 의 <Link> 는 알아서 따라오지만,
 * 그 바깥 — 그림·글꼴·manifest·fetch·서비스 워커·맨 <a> — 은 맨 위 경로를
 * 찾아가 깨진다. 눈으로 고를 수 없으니 모든 화면을 열어 실제 요청을 잡는다.
 *
 *   ① 404 가 난 같은 주소 요청
 *   ② 자기 하위 경로 밖으로 샌 요청 (/gisa 화면이 /fonts/... 를 찾는 것)
 *   ③ 자기 하위 경로 밖을 가리키는 링크 (현관으로 가는 "/" 는 따로 센다)
 *   ④ 자바스크립트 오류
 *
 *   node scratchpad/combined-crawl.js [앱 경로만]   예) /gisa
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.resolve("/home/user/k-history/out-all");
const MIME = { ".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",
  ".webp":"image/webp",".wasm":"application/wasm",".jpg":"image/jpeg",".mp3":"audio/mpeg" };

/* Cloudflare Pages 처럼 — /a → a.html, /a/ → a/index.html, 없으면 가장 가까운 404.html */
function 찾기(u) {
  const p = path.join(ROOT, u);
  const 후보 = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")];
  for (const f of 후보) { try { if (fs.statSync(f).isFile()) return [200, f]; } catch {} }
  let d = path.dirname(p);
  while (d.startsWith(ROOT)) {
    const f = path.join(d, "404.html");
    if (fs.existsSync(f)) return [404, f];
    if (d === ROOT) break;
    d = path.dirname(d);
  }
  return [404, null];
}
function serve(port) {
  const s = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    const [code, f] = 찾기(u);
    if (!f) { r.writeHead(404); return r.end("x"); }
    r.writeHead(code, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
    r.end(fs.readFileSync(f));
  });
  return new Promise((res) => s.listen(port, () => res(s)));
}

const APPS = ["/history", "/comhwal", "/sqld", "/toeic", "/gisa"];
const ONLY = process.argv[2] || "";
const SEED = {
  "/history": ["khlm", null],
  "/comhwal": ["comhwal", { settings: { grade: 1, kind: "written", examDate: null } }],
  "/sqld": ["sqld", { settings: { examDate: null } }],
  "/toeic": ["toeic", null],
  "/gisa": ["gisa", { settings: { track: "written", examDate: null } }],
};

function 화면목록(base) {
  const dir = path.join(ROOT, base.slice(1));
  const out = [];
  (function w(d) {
    for (const n of fs.readdirSync(d)) {
      const f = path.join(d, n);
      if (fs.statSync(f).isDirectory()) { if (n !== "_next") w(f); continue; }
      if (!n.endsWith(".html") || n === "404.html" || n === "_not-found.html") continue;
      let r = "/" + path.relative(ROOT, f).replace(/\\/g, "/").replace(/\.html$/, "");
      r = r.replace(/\/index$/, "/");
      out.push(r);
    }
  })(dir);
  return out.sort();
}

(async () => {
  const srv = process.env.LIVE ? { close() {} } : await serve(7000);
  /* LIVE=https://... 를 주면 배포된 사이트를 잰다 */
const BASE = process.env.LIVE || "http://127.0.0.1:7000";
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
    /* 배포된 사이트를 잴 때 — 브라우저는 HTTPS_PROXY 를 저절로 따르지 않는다 */
    ...(process.env.LIVE && process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
  });
  let 문제 = 0;
  const 모음 = { 404: new Map(), 샘: new Map(), 링크: new Map(), 오류: new Map() };
  const 적기 = (m, k, where) => { if (!m.has(k)) m.set(k, where); };

  /* ── 현관 ── */
  if (!ONLY || ONLY === "/") {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    p.on("response", (r) => { const u = new URL(r.url()); if (u.origin === BASE && r.status() >= 400) 적기(모음[404], u.pathname, "/"); });
    p.on("pageerror", (e) => 적기(모음.오류, String(e).slice(0, 90), "/"));
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    const 링크 = await p.evaluate(() => [...document.querySelectorAll("main a")].map((a) => a.getAttribute("href")));
    console.log("현관 카드 →", 링크.join(" "));
    for (const app of APPS) if (!링크.includes(app + "/")) { 문제++; console.log("  ✗ 현관에 " + app + "/ 로 가는 카드가 없다"); }
    /* 카드가 실제로 그 앱을 여는가 */
    for (const app of APPS) {
      await p.goto(BASE + "/", { waitUntil: "networkidle" });
      await p.locator(`main a[href="${app}/"]`).first().click();
      await p.waitForLoadState("networkidle");
      await p.waitForTimeout(500);
      const 어디 = new URL(p.url()).pathname;
      const 글 = (await p.evaluate(() => document.body.innerText.trim().length));
      if (어디.startsWith(app) && 글 > 50) console.log(`  ✓ 현관 → ${app} 열림 (${어디}, ${글}자)`);
      else { 문제++; console.log(`  ✗ 현관 → ${app} 가 안 열린다 (${어디}, ${글}자)`); }
    }
    await ctx.close();
  }

  /* ── 다섯 앱의 모든 화면 ── */
  for (const app of APPS) {
    if (ONLY && ONLY !== app) continue;
    const 목록 = 화면목록(app);
    const [pre, st] = SEED[app];
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    if (st) await ctx.addInitScript(([pre, st]) => {
      try { localStorage.setItem(pre + ":mirror:" + pre + "-state", JSON.stringify({ state: st })); } catch {}
    }, [pre, st]);
    const p = await ctx.newPage();
    let 지금 = "";
    p.on("request", (q) => {
      const u = new URL(q.url());
      if (u.origin !== BASE) return;
      /*
       * /gisa.txt 는 Next 가 /gisa 의 첫 화면 조각을 찾는 정해진 이름이다.
       * 묶을 때 그 이름으로 파일을 놓았으므로 샌 것이 아니다 — 404 가 나는지는
       * 아래 404 목록이 따로 본다.
       */
      if (u.pathname === app + ".txt") return;
      if (!u.pathname.startsWith(app + "/") && u.pathname !== app) 적기(모음.샘, `${app} → ${u.pathname}`, 지금);
    });
    p.on("response", (r) => {
      const u = new URL(r.url());
      if (u.origin === BASE && r.status() >= 400) 적기(모음[404], u.pathname, 지금);
    });
    p.on("pageerror", (e) => 적기(모음.오류, `${app}: ${String(e).slice(0, 90)}`, 지금));
    for (const r of 목록) {
      지금 = r;
      await p.goto(BASE + r, { waitUntil: "networkidle" }).catch(() => {});
      await p.waitForTimeout(250);
      const 바깥 = await p.evaluate((app) =>
        [...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href"))
          .filter((h) => h.startsWith("/") && !h.startsWith("//") && !h.startsWith(app + "/") && h !== app),
        app).catch(() => []);
      for (const h of 바깥) 적기(모음.링크, `${app} → ${h}`, r);
    }
    console.log(`${app}: 화면 ${목록.length}개 열어 봄`);
    await ctx.close();
  }

  for (const [이름, m] of Object.entries(모음)) {
    if (!m.size) { console.log(`\n✓ ${이름} 없음`); continue; }
    문제 += m.size;
    console.log(`\n✗ ${이름} ${m.size}건`);
    for (const [k, where] of [...m].slice(0, 40)) console.log(`   ${k}   ← ${where}`);
  }
  await b.close(); srv.close();
  console.log(문제 ? `\n문제 ${문제}건` : "\n문제 0건");
  process.exit(문제 ? 1 : 0);
})();
