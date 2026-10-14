// PDF별 요약 — 모든 과목의 모든 PDF 쪽을 폰 폭에서 열어 오류·가로 넘침·빈 섹션 확인
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".woff2": "font/woff2" };
function find(u) { const p = path.join(ROOT, u); for (const f of u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7506, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let bad = 0;
  for (const C of ["db", "ml", "se", "cs", "ir"]) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    const U = (s) => `http://127.0.0.1:7506/${C}${s}`;
    await p.goto(U("/onboarding")); await p.waitForTimeout(400);
    const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(500); }
    await p.goto(U("/pdf")); await p.waitForTimeout(500);
    const n = await p.locator('a[href*="/pdf/"]').count();
    let secs = 0;
    for (let i = 1; i <= n; i++) {
      await p.goto(U(`/pdf/${i}`)); await p.waitForTimeout(500);
      const s = await p.locator("section.pdf-sec").count(); secs += s;
      const sw = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (!s || sw) { bad++; console.log("  ✗", C, i, s ? "가로 넘침" : "섹션 없음"); }
    }
    console.log(`${C}: PDF ${n}개 · 섹션 ${secs} · 오류 ${errs.length ? errs.slice(0, 2) : 0}`);
    if (errs.length) bad++;
  }
  console.log(bad ? `문제 ${bad}건` : "문제 0건");
  await b.close(); srv.close();
})();
