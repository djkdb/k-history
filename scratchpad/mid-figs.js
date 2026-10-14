// 그림만 찍기 — node scratchpad/mid-figs.js <course> <conceptId...>  (SHOT_DIR, THEMES=dark,light)
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const [C, ...IDS] = process.argv.slice(2);
const OUT = process.env.SHOT_DIR || "/tmp";
const THEMES = (process.env.THEMES || "dark").split(",");
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7502, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const theme of THEMES) {
    const ctx = await b.newContext({ ...devices["iPhone 13"] });
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto(`http://127.0.0.1:7502/${C}/`);
    await p.evaluate(([k, t]) => { localStorage.setItem(`mid-${k}:theme`, t); }, [C, theme]);
    await p.goto(`http://127.0.0.1:7502/${C}/onboarding`); await p.waitForTimeout(500);
    const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); }
    for (const id of IDS) {
      await p.goto(`http://127.0.0.1:7502/${C}/concept/${id}`); await p.waitForTimeout(700); await p.addStyleTag({ content: "nav{display:none!important}" });
      const figs = p.locator("figure.fig");
      const n = await figs.count();
      for (let i = 0; i < n; i++) await figs.nth(i).screenshot({ path: `${OUT}/fig-${C}-${id}-${i}-${theme}.png` });
      if (!n) console.log("그림 없음:", id);
    }
    console.log(theme, "errors:", errs.length ? errs.slice(0, 5) : "none");
    await ctx.close();
  }
  await b.close(); srv.close();
})();
