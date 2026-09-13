// 다섯 앱 모두 — 저장이 막힌 브라우저에서 터지지 않는가.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"); const fs = require("fs"); const path = require("path");
const APPS = [
  ["한국사", "out", 4541, ["/", "/learn", "/quiz", "/review", "/mock", "/settings"]],
  ["컴활", "comhwal/out", 4542, ["/", "/learn", "/quiz", "/review", "/mock", "/settings"]],
  ["SQLD", "sqld/out", 4543, ["/", "/learn", "/quiz", "/review", "/mock", "/settings"]],
  ["토익", "toeic/out", 4544, ["/", "/learn", "/quiz", "/review", "/mock", "/settings"]],
  ["정보처리기사", "gisa/out", 4545, ["/", "/learn", "/quiz", "/review", "/mock", "/settings"]],
];
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".wasm":"application/wasm",
  ".webp":"image/webp",".ico":"image/x-icon",".mp3":"audio/mpeg",".txt":"text/plain" };
function serve(root, port) {
  root = path.resolve(root);
  const s = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    for (const f of [root+url+".html", root+url, root+path.join(url,"index.html"), root+"/404.html"]) {
      try { if (fs.statSync(f).isFile()) {
        res.writeHead(f.endsWith("404.html")?404:200, {"content-type": MIME[path.extname(f)]||"application/octet-stream"});
        return res.end(fs.readFileSync(f)); } } catch {}
    }
    res.writeHead(404); res.end("nope");
  });
  return new Promise((r) => s.listen(port, () => r(s)));
}
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let bad = 0;
  for (const [name, root, port, pages] of APPS) {
    if (!fs.existsSync(root)) { console.log(`${name}: out 없음 — 건너뜀`); continue; }
    const srv = await serve(root, port);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => {
      const boom = () => { throw new DOMException("denied", "SecurityError"); };
      try { Object.defineProperty(window, "indexedDB", { get: boom }); } catch {}
      try { Object.defineProperty(window, "localStorage", { get: boom });
            Object.defineProperty(window, "sessionStorage", { get: boom }); } catch {}
    });
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 80)));
    let blank = 0;
    for (const u of pages) {
      await p.goto(`http://127.0.0.1:${port}${u}`, { waitUntil: "networkidle" }).catch(() => {});
      await p.waitForTimeout(450);
      const t = (await p.locator("body").innerText().catch(() => "")).trim();
      if (t.length < 40) blank++;
    }
    const uniq = [...new Set(errs)];
    if (uniq.length || blank) { bad++;
      console.log(`  ✗ ${name}: 빈 화면 ${blank}개 · 예외 ${uniq.length}종 ${uniq.slice(0,2).join(" | ")}`); }
    else console.log(`  ✓ ${name}: ${pages.length}개 화면 모두 뜨고 예외 없음`);
    await ctx.close(); srv.close();
  }
  await b.close();
  console.log(bad ? `\n문제 ${bad}개 앱` : "\n✓ 다섯 앱 모두 저장이 막혀도 쓸 수 있다");
  process.exit(bad ? 1 : 0);
})();
