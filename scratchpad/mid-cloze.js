// 가리고 떠올리기·한눈에 탭 확인 — node scratchpad/mid-cloze.js <course> <conceptId> <chapterId>
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const [C, ID, CH] = process.argv.slice(2);
const OUT = process.env.SHOT_DIR || "/tmp";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7503, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(`http://127.0.0.1:7503/${C}/onboarding`); await p.waitForTimeout(500);
  const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); }
  await p.goto(`http://127.0.0.1:7503/${C}/concept/${ID}`); await p.waitForTimeout(800);
  const bar = p.locator("button[aria-pressed]", { hasText: "가리고 떠올리기" });
  console.log("toggle 있음:", await bar.count());
  await bar.click(); await p.waitForTimeout(300);
  const hidden = await p.locator(".cloze:not(.open)").count();
  console.log("가린 핵심어:", hidden);
  await p.locator(".cloze:not(.open)").first().click(); await p.waitForTimeout(200);
  console.log("한 개 연 뒤:", await p.locator(".cloze:not(.open)").count(), "열린 것:", await p.locator(".cloze.open").count());
  await p.addStyleTag({ content: "nav{display:none!important}" });
  await p.screenshot({ path: `${OUT}/cloze-concept.png`, fullPage: false });
  // 새로고침 뒤에도 켜져 있나
  await p.reload(); await p.waitForTimeout(800);
  console.log("새로고침 뒤 가림 유지:", await p.locator(".cloze").count() > 0);
  await bar.click(); await p.waitForTimeout(200);
  console.log("끈 뒤 가림:", await p.locator(".cloze").count());
  await p.goto(`http://127.0.0.1:7503/${C}/learn/${CH}#sheet`); await p.waitForTimeout(900);
  console.log("한눈에 탭 선택됨:", await p.locator('[role=tab][aria-selected=true]', { hasText: "한눈에" }).count(), "절:", await p.locator("section.print-sheet").count(), "그림:", await p.locator("section.print-sheet figure").count());
  await p.addStyleTag({ content: "nav{display:none!important}" });
  await p.screenshot({ path: `${OUT}/sheet.png`, fullPage: false });
  await p.emulateMedia({ media: "print" });
  await p.screenshot({ path: `${OUT}/sheet-print.png`, fullPage: false });
  console.log("errors:", errs.length ? errs : "none");
  await b.close(); srv.close();
})();
