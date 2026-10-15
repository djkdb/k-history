// 데스크톱 화면 찍기 — node scratchpad/mid-desk.js <course> <path...>  (SHOT_DIR, W=1440, H=900, THEME=dark, FULL=1)
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const [C, ...PATHS] = process.argv.slice(2);
const OUT = process.env.SHOT_DIR || "/tmp";
const W = +(process.env.W || 1440), H = +(process.env.H || 900);
const THEME = process.env.THEME || "dark";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7505, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, ...(process.env.TOUCH ? { hasTouch: true, isMobile: true } : {}) });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(p.url() + " " + e.message.slice(0, 60)));
  const U = (s) => `http://127.0.0.1:7505/${C}${s}`;
  await p.goto(U("/")); await p.evaluate(([k, t, fz]) => { localStorage.setItem(`mid-${k}:theme`, t); if (fz) localStorage.setItem("mid-font-scale", fz); }, [C, THEME, process.env.FZ]);
  await p.goto(U("/onboarding")); await p.waitForTimeout(500);
  const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); }
  for (const pt of PATHS) try {
    if (pt.startsWith("quiz-run")) { await p.goto(U("/quiz")); await p.waitForTimeout(600); await p.locator("button", { hasText: /^시작/ }).click(); await p.waitForTimeout(500); if (pt === "quiz-run-ans") { await p.keyboard.press("1"); await p.waitForTimeout(200); await p.keyboard.press("1"); await p.waitForTimeout(300);} }
    else { await p.goto(U(pt)); await p.waitForTimeout(900); }
    const sw = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const name = pt.replace(/[^a-z0-9-]+/gi, "_") || "home";
    await p.screenshot({ path: `${OUT}/desk-${C}-${name}-${W}.png`, fullPage: !!process.env.FULL });
    if (sw) console.log("가로 넘침:", pt);
  } catch (e) { console.log("실패:", pt, e.message.split("\n")[0]); }
  console.log("errors:", errs.length ? errs.slice(0, 5) : "none");
  await b.close(); srv.close();
})();
