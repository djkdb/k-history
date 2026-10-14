// 강의 PDF 퀴즈 흐름 확인 — node scratchpad/mid-pdfq.js <data.json>  (SHOT_DIR)
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const DATA = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const byQ = new Map(); for (const ch of DATA.chapters) for (const q of ch.questions) if (q.src === "퀴즈") byQ.set(q.q.replace(/\s+/g, " ").trim(), q);
const OUT = process.env.SHOT_DIR || "/tmp";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7506, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"], hasTouch: false });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  const U = (s) => `http://127.0.0.1:7506/ml${s}`;
  await p.goto(U("/onboarding")); await p.waitForTimeout(500);
  const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); }
  await p.goto(U("/quiz")); await p.waitForTimeout(700);
  console.log("모음 칩:", (await p.locator("main button").allInnerTexts()).filter((t) => /PDF|추가 문제|^전부/.test(t)).join(" | "));
  await p.locator("button", { hasText: /^전부$/ }).last().click().catch(() => {});
  await p.locator("button", { hasText: /^시작/ }).click(); await p.waitForTimeout(500);
  let n = 0, badge = 0, orderOk = 0, orderBad = 0, open = 0, openOk = 0, issue = 0, notFound = 0;
  for (let i = 0; i < 120; i++) {
    const t = await p.locator("main").innerText(); if (t.includes("퀴즈 끝")) break;
    n++;
    if (await p.getByText(/강의 퀴즈 p\.\d+/).count()) badge++;
    const qtext = (await p.locator("main p.whitespace-pre-line").first().innerText()).replace(/\s+/g, " ").trim();
    const src = byQ.get(qtext);
    if (!src) notFound++;
    if (await p.getByRole("button", { name: /모범 답안 보기/ }).count()) {
      open++;
      await p.getByRole("button", { name: /모범 답안 보기/ }).click(); await p.waitForTimeout(150);
      const ans = await p.locator("text=모범 답안").locator("xpath=..").innerText();
      if (src && ans.replace(/\s+/g, "").includes(src.answer_text.replace(/\s+/g, "").slice(0, 20))) openOk++;
      if (open === 1) await p.screenshot({ path: `${OUT}/pdf-open.png` });
      await p.getByRole("button", { name: /맞혔어요/ }).click(); await p.waitForTimeout(200);
    } else {
      const opts = await p.locator("main button.flex.items-start span.min-w-0").allInnerTexts();
      if (src && src.choices) { const same = src.choices.every((c, k) => (opts[k] || "").replace(/\s+/g, "") === c.replace(/\s+/g, "")); same ? orderOk++ : (orderBad++, console.log("BAD", qtext.slice(0,50), JSON.stringify(opts), JSON.stringify(src.choices))); }
      await p.keyboard.press("1"); await p.waitForTimeout(120); await p.keyboard.press("2"); await p.waitForTimeout(200);
    }
    if (await p.getByText("원문 문항 주의").count()) { issue++; if (issue === 1) await p.screenshot({ path: `${OUT}/pdf-issue.png`, fullPage: true }); }
    await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  }
  console.log({ n, badge, notFound, orderOk, orderBad, open, openOk, issue });
  // 모의고사 — PDF 모음, 서술 문항 없어야
  await p.goto(U("/mock")); await p.waitForTimeout(600);
  console.log("모의고사 모음:", (await p.locator("main button").allInnerTexts()).filter((t) => /PDF|추가 문제|^전부/.test(t)).join(" | "));
  console.log("errors:", errs.length ? errs.slice(0, 5) : "none");
  await b.close(); srv.close();
})();
