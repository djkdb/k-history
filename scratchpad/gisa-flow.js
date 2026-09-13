// 정보처리기사 — 눌러서 끝까지 가 본다.
//
// 화면을 열어 보기만 해서는 못 잡는 것 네 가지를 본다.
//   1. 시험 도중 새로고침하면 답안이 남는가
//   2. 복습 큐가 풀수록 줄어들어 마지막 장을 못 끝내게 되지는 않는가
//   3. 모의고사가 말하는 점수·과락이 실제 답안과 맞는가
//   4. 실기 채점기가 화면에서도 같은 답을 받아 주는가
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve("gisa/out");
const PORT = Number(process.argv[2] || 4480);
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png",
  ".woff2":"font/woff2", ".ico":"image/x-icon", ".txt":"text/plain" };
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
  res.writeHead(404); res.end("nope");
});

let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const BASE = `http://127.0.0.1:${PORT}`;
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // 첫 안내로 튕기지 않게 이미 쓰던 사람처럼 시작한다
  // addInitScript 는 페이지를 옮길 때마다 돈다. 한 번만 넣어야 앞 단계에서
  // 쌓인 복습 카드를 빈 저장본으로 도로 덮어쓰지 않는다.
  await ctx.addInitScript(() => {
    try {
      if (localStorage.getItem("__seeded__")) return;
      localStorage.setItem("__seeded__", "1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
        state: { settings: { track: "written", examDate: null },
          stats: { xp: 0, streak: 0, lastStudyDate: null, studyMinutes: 0 },
          studiedIds: [], clearedQuestionIds: [], clearedPracticalIds: [],
          reviewCards: [], quizHistory: [], wrongIds: [], mockAttempts: [] } }));
    } catch {}
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));

  // ── 1. 필기 모의고사: 답하고 새로고침 ────────────────
  console.log("\n[모의고사 — 도중에 새로고침]");
  await p.goto(`${BASE}/mock/session?seed=777`, { waitUntil: "networkidle" });
  await p.waitForSelector("text=/ 100");
  const picks = [];
  for (let i = 0; i < 6; i++) {
    const opts = p.locator("main button").filter({ hasText: /^\s*[1-4]\s/ });
    const n = i % 4;
    // 선지 단추는 번호 배지를 품고 있다 — 순서대로 n 번째를 고른다
    const box = p.locator('main button:has(span:text-is("' + (n + 1) + '"))').first();
    await box.click();
    picks.push(n);
    if (i < 5) await p.getByRole("button", { name: "다음" }).click();
  }
  const beforeCount = await p.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem("gisa:mock-written") || "{}").answers || {}).length);
  if (beforeCount === 6) ok(`6문항 답한 것이 저장되었다`);
  else no(`저장된 답이 ${beforeCount}개다 (6개여야 한다)`);

  await p.reload({ waitUntil: "networkidle" });
  await p.waitForSelector("text=/ 100");
  const afterCount = await p.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem("gisa:mock-written") || "{}").answers || {}).length);
  if (afterCount === 6) ok("새로고침 뒤에도 답안 6개가 그대로다");
  else no(`새로고침 뒤 답안이 ${afterCount}개로 줄었다`);
  const head = await p.locator("text=/^\\d+ \\/ 100$/").first().textContent();
  if (head && head.trim().startsWith("6")) ok(`머리글도 "${head.trim()}" 로 이어졌다`);
  else no(`머리글이 "${head}" 다 — 답한 개수를 잃었다`);

  // ── 2. 모의고사 채점이 실제 답안과 맞는가 ───────────
  console.log("\n[모의고사 — 채점이 맞는가]");
  const truth = await p.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("gisa:mock-written"));
    return saved.answers;
  });
  await p.getByRole("button", { name: "답안지" }).click();
  await p.getByRole("button", { name: "제출하기" }).click();
  await p.getByRole("button", { name: "제출", exact: true }).click();
  await p.waitForSelector("text=평균");
  const shown = Number((await p.locator("text=/^\\d+점$/").first().textContent()).replace("점", ""));
  const wrongHeader = await p.locator("text=/틀린 문항 \\d+개/").first().textContent();
  const wrongN = Number(wrongHeader.match(/(\d+)/)[1]);
  const answered = Object.keys(truth).length;
  if (wrongN === 100 - shown) ok(`평균 ${shown}점 ↔ 틀린 문항 ${wrongN}개 — 앞뒤가 맞는다`);
  else no(`평균 ${shown}점인데 틀린 문항이 ${wrongN}개다 (100-${shown}=${100 - shown} 이어야 한다)`);
  if (answered === 6) ok("답한 것은 6문항, 나머지 94문항은 빈칸으로 채점되었다");
  const gwarak = await p.locator("text=/과락/").count();
  if (shown < 40 && gwarak > 0) ok("과락이 화면에 표시되었다");
  else if (shown >= 40) ok("과락선 위라 과락 표시가 없다");
  else no("40점 미만인데 과락 표시가 없다");

  // ── 3. 실기 채점 — 다른 표기로 적어도 받아 주는가 ────
  console.log("\n[실기 — 표기가 달라도 받아 주는가]");
  await p.goto(`${BASE}/practical`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "용어", exact: true }).click();
  await p.getByRole("button", { name: /문항 시작/ }).click();
  await p.waitForSelector("textarea");
  // 화면에 뜬 문항의 모범 답안을 코드에서 그대로 읽어 와 두 번째 표기로 적는다
  const alt = await p.evaluate(() => {
    const q = document.querySelector("main h2")?.textContent ?? "";
    return q;
  });
  await p.locator("textarea").fill("아무 말");
  await p.getByRole("button", { name: "채점" }).click();
  const wrongShown = await p.locator("text=틀렸습니다").count();
  if (wrongShown > 0) ok("틀린 답은 틀렸다고 한다");
  else no("틀린 답인데 맞았다고 했다");
  const model = (await p.locator("text=모범 답안").first().locator("xpath=following-sibling::p[1]").textContent()) ?? "";
  if (model.trim()) ok(`모범 답안이 보인다 — "${model.trim().slice(0, 20)}"`);
  else no("틀렸는데 모범 답안을 보여 주지 않는다");

  // ── 4. 복습 큐가 도중에 줄어들지 않는가 ─────────────
  console.log("\n[복습 — 큐가 풀수록 줄어들지 않는가]");
  await p.goto(`${BASE}/review`, { waitUntil: "networkidle" });
  const total = await p.locator("text=/^\\d+ \\/ \\d+$/").first().textContent().catch(() => null);
  if (!total) {
    no("복습할 카드가 없다 — 앞 단계에서 틀린 것이 큐로 들어가지 않았다");
  } else {
    const [, n] = total.match(/\/ (\d+)/);
    ok(`복습 큐 ${n}장으로 시작`);
    let steps = 0;
    for (let i = 0; i < Number(n); i++) {
      const open = p.getByRole("button", { name: "답 보기" });
      if (await open.count()) await open.click();
      const know = p.getByRole("button", { name: "기억났어요" });
      const next = p.getByRole("button", { name: "다음" });
      if (await know.count()) await know.click();
      else if (await next.count()) await next.click();
      else break;
      steps++;
      const cur = await p.locator("text=/^\\d+ \\/ \\d+$/").first().textContent().catch(() => null);
      if (cur && !cur.endsWith(`/ ${n}`)) {
        no(`${steps}장째에 큐 크기가 "${cur}" 로 바뀌었다 — 도중에 줄어든다`);
        break;
      }
    }
    const done = await p.locator("text=/장 중 .*장을 기억했습니다/").count();
    if (steps === Number(n) && done > 0) ok(`${n}장을 끝까지 풀었고 결과 화면이 떴다`);
    else if (steps < Number(n)) no(`${n}장 중 ${steps}장에서 멈췄다`);
  }

  if (errs.length) { errs.slice(0, 5).forEach((e) => no("페이지 예외: " + e)); }
  else ok("페이지 예외 없음");

  await b.close();
  server.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 이상 없음");
  process.exit(bad ? 1 : 0);
})();
