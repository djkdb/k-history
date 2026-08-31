// 실제로 눌러서 끝까지 가 보고, 화면이 말한 숫자와 실제 숫자를 맞춰 본다.
//
// 화면을 열어 보기만 해서는 못 잡는 것들이 있다. 토익 복습에서 큐가
// 채점 도중 줄어들어 절반이 건너뛰어졌는데, 화면은 "복습 완료"라고
// 했고 오류도 없었다. 세어 봐야 나온다.
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const APP = process.argv[2];
const ROOT = path.resolve(process.argv[3]);
const PORT = Number(process.argv[4]);
const STATE_KEY = process.argv[5]; // 예) khlm-state

const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png",
  ".woff2":"font/woff2", ".wasm":"application/wasm", ".webp":"image/webp",
  ".ico":"image/x-icon", ".txt":"text/plain" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  for (const f of [ROOT + url + ".html", ROOT + url,
                   ROOT + path.join(url, "index.html"), ROOT + "/404.html"]) {
    try {
      if (fs.statSync(f).isFile()) {
        res.writeHead(f.endsWith("404.html") ? 404 : 200,
          { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
        return res.end(fs.readFileSync(f));
      }
    } catch {}
  }
  res.writeHead(404); res.end("");
});

const bad = [];
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad.push(s); console.log("  ✗ " + s); };

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 },
    isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  const BASE = `http://127.0.0.1:${PORT}`;
  const state = async () => page.evaluate(
    ([k]) => { try { return JSON.parse(localStorage.getItem(k)).state; } catch { return null; } },
    [STATE_KEY]);

  console.log(`════ ${APP}`);

  // ── 처음 들어온 사람 ────────────────────────────────────────
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const first = await page.evaluate(() => document.body.innerText.slice(0, 200));
  if (!first.trim()) no("첫 화면이 비어 있다");
  else ok("첫 화면이 뜬다");

  // ── 복습: 시작할 때 말한 장수와 실제로 넘긴 장수가 같은가 ──
  //    (토익에서 절반이 건너뛰어졌던 그 자리)
  await page.evaluate(([k]) => {
    // 복습할 카드를 넉넉히 심는다 — 앱마다 카드 모양이 조금씩 다르므로
    // 이미 있는 저장본의 모양을 그대로 따른다.
    const raw = localStorage.getItem(k);
    if (!raw) return;
    const o = JSON.parse(raw);
    const cards = o.state.reviewCards ?? [];
    if (!cards.length) return;
    const now = Date.now();
    o.state.reviewCards = cards.map((c) => ({ ...c, nextDueAt: now - 60000 }));
    localStorage.setItem(k, JSON.stringify(o));
  }, [STATE_KEY]);

  await page.goto(BASE + "/review", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const before = await state();
  const dueSaid = await page.evaluate(() => {
    const m = document.body.innerText.match(/(\d+)\s*장\s*복습/);
    return m ? Number(m[1]) : null;
  });
  if (dueSaid === null) {
    ok("지금 복습할 카드가 없다 — 건너뜀");
  } else {
    ok(`복습 시작 화면이 "${dueSaid}장"이라고 말한다`);
    const start = page.getByRole("button", { name: /복습 시작/ }).first();
    await start.click();
    await page.waitForTimeout(500);
    let seen = 0;
    for (let i = 0; i < dueSaid + 12; i++) {
      const done = await page.evaluate(() => /복습 완료|오늘 복습.*완료|다 봤습니다/.test(document.body.innerText));
      if (done) break;
      // 뒤집기 → 안다/모른다
      const flip = page.locator("main button, button").filter({ hasText: /뜻 보기|정답 보기|뒤집기|답 확인/ }).first();
      if (await flip.count()) { await flip.click(); await page.waitForTimeout(180); }
      const know = page.getByRole("button", { name: /^(알아요|외웠어요|맞혔어요|기억남|안다)/ }).first();
      const any = (await know.count()) ? know
        : page.locator("button").filter({ hasText: /알아요|외웠|맞혔|기억/ }).first();
      if (!(await any.count())) break;
      await any.click();
      seen++;
      await page.waitForTimeout(180);
    }
    if (seen === dueSaid) ok(`실제로 ${seen}장을 넘겼다 — 말한 수와 같다`);
    else no(`"${dueSaid}장"이라 했는데 실제로는 ${seen}장만 나왔다`);
    const after = await state();
    const stillDue = (after?.reviewCards ?? []).filter((c) => c.nextDueAt <= Date.now()).length;
    if (stillDue === 0) ok("남은 복습 카드 0장");
    else no(`복습을 끝냈는데 아직 ${stillDue}장이 남아 있다`);
    if ((after?.stats?.xp ?? 0) < (before?.stats?.xp ?? 0))
      no(`XP 가 줄었다 (${before?.stats?.xp} → ${after?.stats?.xp})`);
    else ok(`XP 가 줄지 않았다 (${before?.stats?.xp} → ${after?.stats?.xp})`);
  }

  if (errs.length) no("페이지 예외: " + [...new Set(errs)].slice(0, 3).join(" / "));
  else ok("도는 동안 예외 없음");

  await b.close();
  server.close();
  console.log(bad.length ? `\n${APP} — 문제 ${bad.length}건` : `\n${APP} — 이상 없음`);
  process.exitCode = bad.length ? 1 : 0;
})();
