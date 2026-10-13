// 중간고사 앱 화면 몇 장 — 개념(쉽게 말하면·흐름·시험엔 이렇게)과 강의 노트 탭
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const C = process.argv[2] || "se", CONCEPT = process.argv[3] || "waterfall", CH = process.argv[4] || "proc";
const OUT = process.env.SHOT_DIR || "/tmp";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function 찾기(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = 찾기(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7501, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ ...devices["iPhone 13"] });
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(`http://127.0.0.1:7501/${C}/`);
    await p.evaluate(([k, t]) => { localStorage.setItem(`mid-${k}:theme`, t); }, [C, theme]);
    await p.goto(`http://127.0.0.1:7501/${C}/onboarding`); await p.waitForTimeout(600);
    const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(800); }
    await p.goto(`http://127.0.0.1:7501/${C}/concept/${CONCEPT}`); await p.waitForTimeout(1000);
    await p.screenshot({ path: `${OUT}/shot-${C}-concept-${theme}.png`, fullPage: true });
    await p.goto(`http://127.0.0.1:7501/${C}/learn/${CH}#notes`); await p.waitForTimeout(1000);
    await p.screenshot({ path: `${OUT}/shot-${C}-notes-${theme}.png` });
    console.log(theme, "errors:", errs.length ? errs : "none");
    await ctx.close();
  }
  await b.close(); srv.close();
})();
