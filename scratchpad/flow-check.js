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
const SEED = process.argv[6]; // 이미 쓰던 사람의 저장본 (json)

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
  // 이미 쓰고 있던 사람으로 들어간다. 빈 브라우저로 열면 복습할 카드가
  // 없어 검사가 "건너뜀"으로 조용히 통과해 버린다 — 아무것도 확인하지
  // 못한 통과가 제일 나쁘다.
  if (SEED) {
    const saved = JSON.parse(fs.readFileSync(SEED, "utf8"));
    const now = Date.now();
    const cards = saved.state.reviewCards ?? [];
    saved.state.reviewCards = cards.map((c, i) => ({
      ...c,
      // 절반만 지금 복습할 때가 되게 한다 — 전부 몰아 주면 "남은 것 0장"
      // 검사가 무조건 통과해서 뜻이 없다
      nextDueAt: i < Math.ceil(cards.length / 2) ? now - 60000 : now + 3 * 86400000,
    }));
    await ctx.addInitScript(([k, v]) => {
      try {
        if (localStorage.getItem("__seeded__")) return;
        localStorage.setItem("__seeded__", "1");
        localStorage.setItem(k, v);
      } catch {}
    }, [STATE_KEY, JSON.stringify(saved)]);
  }

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
  await page.goto(BASE + "/review", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const before = await state();
  const dueSaid = await page.evaluate(() => {
    const t = document.body.innerText;
    // 앱마다 문구가 다르다 — "복습 시작 (5장)" / "5장 복습 시작"
    const m = t.match(/복습 시작\s*\((\d+)\s*장\)/) || t.match(/(\d+)\s*장\s*복습 시작/);
    return m ? Number(m[1]) : null;
  });
  if (dueSaid === null) {
    if (SEED) no("복습할 카드를 심었는데 복습 화면이 장수를 말하지 않는다");
    else ok("지금 복습할 카드가 없다 — 건너뜀");
  } else {
    ok(`복습 시작 화면이 "${dueSaid}장"이라고 말한다`);
    // 실제 클릭은 애니메이션 때문에 대기에 걸리는 일이 있어, 글로 찾아
    // 그 자리에 클릭을 흘려 넣는다 (사람이 누르는 것과 같은 경로다)
    const hit = (re) => page.evaluate((src) => {
      const rx = new RegExp(src);
      const b = [...document.querySelectorAll("button")]
        .find((x) => rx.test((x.innerText || "").replace(/\s+/g, " ").trim()));
      if (!b) return false;
      b.click();
      return true;
    }, re);

    if (!(await hit("복습 시작"))) { no("복습 시작 단추를 못 찾았다"); }
    await page.waitForTimeout(600);

    let seen = 0;
    for (let i = 0; i < dueSaid + 15; i++) {
      const done = await page.evaluate(() =>
        /복습 완료|오늘 복습.*완료|다 봤|수고하셨/.test(document.body.innerText));
      if (done) break;
      await hit("답 보기|탭해서 확인");          // 뒤집기 (없는 앱도 있다)
      await page.waitForTimeout(160);
      const graded = await hit("알았어요|기억났어요|외웠어요|맞혔어요");
      if (!graded) break;
      seen++;
      await page.waitForTimeout(220);
    }
    if (seen === dueSaid) ok(`실제로 ${seen}장을 넘겼다 — 말한 수와 같다`);
    else no(`"${dueSaid}장"이라 했는데 실제로는 ${seen}장만 나왔다`);

    const after = await state();
    const stillDue = (after?.reviewCards ?? []).filter((c) => c.nextDueAt <= Date.now()).length;
    if (stillDue === 0) ok("복습할 때가 된 카드가 하나도 안 남았다");
    else no(`복습을 끝냈는데 아직 ${stillDue}장이 남아 있다 — 건너뛴 것이 있다`);
    const total = (after?.reviewCards ?? []).length;
    const beforeTotal = (before?.reviewCards ?? []).length;
    if (total === beforeTotal) ok(`복습 카드가 사라지지 않았다 (${total}장)`);
    else no(`복습 카드 수가 ${beforeTotal} → ${total} 로 바뀌었다`);
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
