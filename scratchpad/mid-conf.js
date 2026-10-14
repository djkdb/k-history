// 자신감 묻기·확신 오답·오답 노트 확인 — node scratchpad/mid-conf.js <course>  (SHOT_DIR)
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium, devices } = require("playwright");
const ROOT = path.join(__dirname, "../midterm/out-all");
const [C] = process.argv.slice(2);
const OUT = process.env.SHOT_DIR || "/tmp";
const M = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function find(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const srv = http.createServer((q, r) => { const f = find(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
(async () => {
  await new Promise((r) => srv.listen(7504, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"], hasTouch: false });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  const U = (s) => `http://127.0.0.1:7504/${C}${s}`;
  await p.goto(U("/onboarding")); await p.waitForTimeout(500);
  const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(600); }
  await p.goto(U("/quiz")); await p.waitForTimeout(700);
  console.log("모드 칩:", await p.locator("main button").allInnerTexts().then((t) => t.filter((x) => /섞어서|안 푼|틀린|확신|불안|별표/.test(x)).join(" | ")));
  console.log("자신감 묻기 체크:", await p.locator('input[type=checkbox]').isChecked());
  await p.locator("button", { hasText: "10문제" }).first().click();
  await p.locator("button", { hasText: /^시작/ }).click(); await p.waitForTimeout(500);
  let sureBanner = 0, guessBanner = 0, confPrompt = 0, n = 0;
  for (let i = 0; i < 10; i++) {
    const short = await p.locator("main input:not([type=checkbox])").count();
    if (short) { await p.locator("main input").fill("모름답"); await p.locator("button", { hasText: "이 답으로" }).click(); }
    else await p.keyboard.press("1");
    await p.waitForTimeout(150);
    if (await p.getByText("얼마나 자신 있어요").count()) confPrompt++;
    await p.keyboard.press(i % 3 === 2 ? "3" : "1");
    await p.waitForTimeout(200);
    if (await p.getByText("확신했는데 틀렸어요").count()) { sureBanner++; if (sureBanner === 1) await p.screenshot({ path: `${OUT}/conf-sure.png` }); }
    if (await p.getByText("찍어서 맞혔어요").count()) guessBanner++;
    if (i === 0) await p.screenshot({ path: `${OUT}/conf-after.png` });
    await p.keyboard.press("Enter"); await p.waitForTimeout(200); n++;
  }
  console.log({ confPrompt, sureBanner, guessBanner, n });
  await p.screenshot({ path: `${OUT}/conf-end.png`, fullPage: true });
  console.log("결과 화면:", (await p.locator("main").innerText()).slice(0, 160).replace(/\n/g, " / "));
  await p.goto(U("/wrongs")); await p.waitForTimeout(700);
  console.log("오답 노트 탭:", (await p.locator("[role=tab]").allInnerTexts()).join(" | "));
  console.log("항목:", await p.locator("section.print-sheet").count());
  await p.locator("button", { hasText: "답 보기" }).first().click().catch(() => {});
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${OUT}/conf-notes.png`, fullPage: true });
  await p.goto(U("/")); await p.waitForTimeout(700);
  console.log("홈:", (await p.locator("main").innerText()).match(/확신했는데 틀린 문제 \d+개|오답 노트|확신 오답 \d+ · 틀린 것 \d+ · 찍어서 맞힘 \d+/g));
  // 새로고침 뒤에도 남는가
  await p.reload(); await p.waitForTimeout(900);
  console.log("새로고침 뒤 홈:", (await p.locator("main").innerText()).match(/확신했는데 틀린 문제 \d+개/g));
  await p.goto(U("/quiz")); await p.waitForTimeout(600);
  await p.locator("button", { hasText: "확신 오답" }).first().click();
  console.log("확신 오답 모드 시작 단추:", await p.locator("button", { hasText: /^시작|확신 오답이 없어요/ }).innerText());
  console.log("errors:", errs.length ? errs.slice(0, 5) : "none");
  await b.close(); srv.close();
})();
