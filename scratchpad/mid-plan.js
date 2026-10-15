// 통합 캘린더 — 과목 기록을 심어 두고 /plan 과 현관을 찍는다.  SHOT_DIR, W, THEME
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const OUT = process.env.SHOT_DIR || "/tmp";
const W = +(process.env.W || 1440), H = +(process.env.H || 1000), THEME = process.env.THEME || "dark";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png" };
function find(u) { const p = path.join(ROOT, u); for (const f of u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
const scope = JSON.parse(fs.readFileSync(path.join(__dirname, "../midterm/hub/src/data/scope.generated.json"), "utf8"));
(async () => {
  await new Promise((r) => srv.listen(7507, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  await p.goto("http://127.0.0.1:7507/");
  const now = Date.now(), day = 86400000;
  const seed = { db: [null, 12, 2], ml: ["2026-10-21", 20, 0], se: ["2026-10-22", 5, 0], cs: ["2026-10-27", 0, 0] }; // ir: 기록 없음
  await p.evaluate(([seed, scope, now, day, THEME]) => {
    localStorage.setItem("midhub:theme", THEME);
    for (const [id, [exam, nOld, nToday]] of Object.entries(seed)) {
      const cs = scope.find((s) => s.id === id).concepts;
      const studied = {}, log = {};
      cs.slice(0, nOld).forEach((c) => { studied[c.id] = now - 3 * day; c.qs.slice(0, 2).forEach((q) => (log[q] = { right: 1, wrong: 0, last: now - 3 * day, lastRight: true })); });
      cs.slice(nOld, nOld + nToday).forEach((c) => { studied[c.id] = now - 1000; c.qs.forEach((q) => (log[q] = { right: 1, wrong: 0, last: now - 1000, lastRight: true })); });
      const cards = Object.keys(studied).map((k, i) => ({ sourceId: k, addedAt: now, lastReviewedAt: null, stage: 0, nextDueAt: now + (i % 4) * day, lapses: 0 }));
      localStorage.setItem(`mid-${id}:mirror:mid-${id}-state`, JSON.stringify({ state: { settings: { examDate: exam ?? "2026-10-23" }, studied, log, cards, wrongIds: ["x", "y"] }, version: 0 }));
    }
  }, [seed, scope, now, day, THEME]);
  await p.goto("http://127.0.0.1:7507/"); await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/plan-home-${W}.png` });
  await p.goto("http://127.0.0.1:7507/plan"); await p.waitForTimeout(800);
  // 정보검색 시험일을 현관에서 정해 본다
  // 정보검색: 시험일 10/27(과목 자료) · 시작 10/23(기본값)이 잡혔는지
  console.log("IR 줄:", (await p.locator("section[aria-label='과목별 시험일'] > div").filter({ hasText: "정보검색" }).innerText()).replace(/\n/g, " | "));
  const sw = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await p.screenshot({ path: `${OUT}/plan-${W}-${THEME}.png`, fullPage: true });
  // 다른 날 눌러 보기
  await p.locator('button[aria-label^="10/23"]').first().click(); await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/plan-sel-${W}.png` });
  console.log("가로 넘침:", sw, "errors:", errs.length ? errs : "none");
  await b.close(); srv.close();
})();
