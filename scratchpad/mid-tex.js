// 수식 해설 화면 — node scratchpad/mid-tex.js  (SHOT_DIR, THEME)
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const OUT = process.env.SHOT_DIR || "/tmp"; const THEME = process.env.THEME || "dark";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".txt": "text/plain" };
const missing = new Set();
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = find(u); if (!f) { missing.add(u); r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7508, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"], hasTouch: false });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  const U = (s) => `http://127.0.0.1:7508/ml${s}`;
  await p.goto(U("/")); await p.evaluate((t) => localStorage.setItem("mid-ml:theme", t), THEME);
  await p.goto(U("/onboarding")); await p.waitForTimeout(500);
  const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); }
  await p.goto(U("/quiz")); await p.waitForTimeout(700);
  await p.locator("button", { hasText: "강의 PDF 퀴즈" }).first().click();
  await p.locator("button", { hasText: /^전부$/ }).last().click();
  await p.locator("button", { hasText: /^시작/ }).click(); await p.waitForTimeout(500);
  let shots = 0, withTex = 0, raw = 0, n = 0;
  for (let i = 0; i < 60 && shots < 3; i++) {
    n++;
    const open = await p.getByRole("button", { name: /모범 답안 보기/ }).count();
    if (open) { await p.getByRole("button", { name: /모범 답안 보기/ }).click(); await p.getByRole("button", { name: /맞혔어요/ }).click(); }
    else { await p.keyboard.press("2"); await p.waitForTimeout(100); if (await p.getByText("얼마나 자신 있어요").count()) await p.keyboard.press("1"); }
    await p.waitForTimeout(500);
    const k = await p.locator(".katex").count();
    if (k) withTex++;
    // 렌더 안 된 $ 가 남았나
    const txt = await p.locator("main").innerText(); if (/\$[^$]+\$/.test(txt)) raw++;
    if (k && (shots === 0 ? open : true)) { await p.screenshot({ path: `${OUT}/tex-${THEME}-${shots}.png`, fullPage: true }); shots++; }
    await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  }
  console.log({ THEME, n, withTex, rawDollarLeft: raw, missing: [...missing].filter((m) => !m.includes("favicon")).slice(0, 5), errs: errs.slice(0, 3) });
  await b.close(); srv.close();
})();
