/*
 * "새 판이 준비됐습니다" 는 진짜 새 판일 때만 떠야 한다.
 *   ① 처음 온 사람 — 현관을 거쳐 들어와도 뜨지 않아야 한다
 *   ② 이미 쓰던 사람 — sw.js 가 바뀌면 떠야 한다
 *   node scratchpad/update-toast-check.js
 */
const { chromium, devices } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = "/home/user/k-history/out-all";
const MIME = { ".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".txt":"text/plain",".webp":"image/webp",".wasm":"application/wasm" };
const 덧 = {}; // 바꿔 끼운 sw.js
function 찾기(u) {
  const p = path.join(ROOT, u);
  const 후보 = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")];
  for (const f of 후보) { try { if (fs.statSync(f).isFile()) return f; } catch {} }
  return null;
}
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split("?")[0]);
  if (덧[u]) { r.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-cache" }); return r.end(덧[u]); }
  const f = 찾기(u);
  if (!f) { r.writeHead(404); return r.end("x"); }
  r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
  r.end(fs.readFileSync(f));
});
const B = "http://127.0.0.1:7300";
let 문제 = 0; const ok = (m) => console.log("  ✓ " + m), no = (m) => { 문제++; console.log("  ✗ " + m); };
const 토스트 = (p) => p.locator("text=새 판이 준비됐습니다").isVisible().catch(() => false);
async function 켜질때까지(p, scope) {
  for (let i = 0; i < 240; i++) {
    if (await p.evaluate(async (s) => { const r = await navigator.serviceWorker.getRegistration(s); return !!(r && r.scope === new URL(s, location.href).href && r.active && r.active.state === "activated" && !r.installing); }, scope)) return true;
    await p.waitForTimeout(250);
  }
  return false;
}
(async () => {
  await new Promise((r) => srv.listen(7300, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const 앱 of ["/gisa/", "/toeic/"]) {
    console.log(`\n━━━ ${앱}`);
    const ctx = await b.newContext({ ...devices["iPhone 13"] });
    const p = await ctx.newPage();
    // 현관부터 — 현관 워커가 "/" 를 먼저 맡는다
    await p.goto(B + "/"); await 켜질때까지(p, "/");
    await p.goto(B + 앱); await p.waitForLoadState("load");
    if (!(await 켜질때까지(p, 앱))) no("워커가 켜지지 않았다");
    await p.waitForTimeout(1500);
    if (await 토스트(p)) no("처음 온 사람에게 새 판 알림이 떴다"); else ok("처음 온 사람에게는 새 판 알림이 뜨지 않는다");
    await p.reload(); await p.waitForTimeout(2500);
    if (await 토스트(p)) no("다시 열어도 새 판 알림이 떴다"); else ok("다시 열어도 뜨지 않는다");
    // 새 판을 올린다
    덧[앱 + "sw.js"] = fs.readFileSync(path.join(ROOT, 앱, "sw.js"), "utf8").replace(/const CACHE_NAME = CACHE_PREFIX \+ "([^"]+)"/, 'const CACHE_NAME = CACHE_PREFIX + "$1-새판"');
    if (!덧[앱 + "sw.js"].includes("-새판")) no("sw.js 를 바꾸지 못했다");
    await p.reload(); 
    let 떴다 = false;
    for (let i = 0; i < 60 && !떴다; i++) { await p.waitForTimeout(250); 떴다 = await 토스트(p); }
    if (떴다) ok("sw.js 가 바뀌면 새 판 알림이 뜬다"); else no("새 판인데 알림이 뜨지 않았다");
    if (떴다) {
      await p.locator("button", { hasText: "지금 켜기" }).click();
      await p.waitForLoadState("load"); await p.waitForTimeout(1500);
      const 이름 = await p.evaluate(async () => (await caches.keys()).filter((k) => k.includes("새판")));
      if (이름.length) ok("지금 켜기를 누르니 새 판으로 갈아 끼웠다 (" + 이름[0] + ")"); else no("지금 켜기가 아무 일도 하지 않았다");
      if (await 토스트(p)) no("갈아 끼운 뒤에도 알림이 남았다"); else ok("갈아 끼운 뒤 알림이 사라졌다");
    }
    delete 덧[앱 + "sw.js"];
    await ctx.close();
  }
  await b.close(); srv.close();
  console.log(`\n문제 ${문제}건`);
})();
