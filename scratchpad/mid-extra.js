// 추가 문제 표시 확인 — node scratchpad/mid-extra.js  (SHOT_DIR)
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const OUT = process.env.SHOT_DIR || "/tmp";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
async function onboard(p, c) { await p.goto(`http://127.0.0.1:7507/${c}/onboarding`); await p.waitForTimeout(500); const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); } }
async function run(p, c, setLabel) {
  await p.goto(`http://127.0.0.1:7507/${c}/quiz`); await p.waitForTimeout(700);
  if (setLabel) await p.locator("button", { hasText: setLabel }).first().click();
  await p.locator("button", { hasText: /^시작/ }).click(); await p.waitForTimeout(500);
  let n = 0, extra = 0, pdf = 0;
  for (let i = 0; i < 10; i++) {
    n++;
    if (await p.getByText("추가 문제 · 강의 내용으로 만든 문제").count()) extra++;
    if (await p.getByText(/강의 퀴즈.*원문 그대로/).count()) pdf++;
    if (i === 0 && setLabel === "추가 문제") await p.screenshot({ path: `${OUT}/extra-badge.png` });
    if (await p.getByRole("button", { name: /모범 답안 보기/ }).count()) { await p.getByRole("button", { name: /모범 답안 보기/ }).click(); await p.getByRole("button", { name: /맞혔어요/ }).click(); }
    else if (await p.locator("main input:not([type=checkbox])").count()) { await p.locator("main input").fill("x"); await p.locator("button", { hasText: /채점하기|이 답으로/ }).click(); }
    else await p.keyboard.press("1");
    await p.waitForTimeout(150);
    if (await p.getByText("얼마나 자신 있어요").count()) { await p.keyboard.press("2"); await p.waitForTimeout(150); }
    await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  }
  return { c, set: setLabel || "-", n, extra, pdf };
}
(async () => {
  await new Promise((r) => srv.listen(7507, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"], hasTouch: false });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  await onboard(p, "ml"); await onboard(p, "cs");
  console.log(await run(p, "ml", "추가 문제"));
  console.log(await run(p, "ml", "강의 PDF 퀴즈"));
  console.log(await run(p, "ml", "전부"));
  console.log(await run(p, "cs", null));
  console.log("errors:", errs.length ? errs : "none");
  await b.close(); srv.close();
})();
