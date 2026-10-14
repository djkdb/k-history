// 개발 서버에서 그림만 찍기 — node scratchpad/mid-figdev.js <port> <listfile> [theme]  (SHOT_DIR)
// listfile: 줄마다 "개념id:종류,..."  → fig-<id>-<i>.png
const fs = require("fs");
const { chromium, devices } = require("playwright");
const [PORT, LIST, THEME = "dark"] = process.argv.slice(2);
const OUT = process.env.SHOT_DIR || "/tmp";
const ONLY = process.env.KIND; // 이 종류만
const ids = fs.readFileSync(LIST, "utf8").trim().split("\n").filter((l) => !ONLY || l.split(":")[1].split(",").includes(ONLY)).map((l) => l.split(":")[0]);
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 1500)));
  const U = (s) => `http://127.0.0.1:${PORT}${s}`;
  await p.goto(U("/"), { timeout: 120000 });
  const key = await p.evaluate(() => Object.keys(localStorage).find((k) => k.endsWith(":theme")) || null);
  await p.evaluate((t) => { for (const c of ["cs", "ir", "ml", "db", "se"]) localStorage.setItem(`mid-${c}:theme`, t); }, THEME);
  await p.goto(U("/onboarding"), { timeout: 120000 }); await p.waitForTimeout(800);
  const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(800); }
  for (const id of ids) {
    await p.goto(U(`/concept/${id}`), { timeout: 120000 }); await p.waitForSelector("figure.fig", { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(300);
    await p.addStyleTag({ content: "nav,nextjs-portal{display:none!important}" });
    const figs = p.locator("figure.fig");
    const n = await figs.count();
    for (let i = 0; i < n; i++) await figs.nth(i).screenshot({ path: `${OUT}/fig-${id}-${i}.png` });
  }
  console.log("done", ids.length, "errors:", errs.length ? errs.slice(0, 5) : "none");
  await b.close();
})();
