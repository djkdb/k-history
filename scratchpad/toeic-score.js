// 모의고사를 끝까지 풀고, 화면이 매긴 점수가 실제와 맞는지 센다.
//
// 모든 문항에 A(첫 번째)를 고른 뒤, 같은 씨앗으로 Node 에서 시험지를 다시
// 만들어 "정답이 A 인 문항 수"를 세어 비교한다.
const { chromium } = require("playwright");
const path = require("path");
const BASE = process.argv[2], EXAM = process.argv[3] || "lc";
const jiti = require("jiti")("/home/user/k-history/toeic", {
  alias: { "@": "/home/user/k-history/toeic/src" },
});
const { buildExam, answerOf } = jiti("@/lib/exam");

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const href = await p.evaluate((id) => {
    const a = [...document.querySelectorAll("a[href*='/mock/session']")]
      .find((x) => x.getAttribute("href").includes(`exam=${id}`) && !x.getAttribute("href").includes("resume"));
    return a && a.getAttribute("href");
  }, EXAM);
  if (!href) { console.log("응시 링크를 못 찾음"); await b.close(); return; }
  const seed = Number(new URL(href, BASE).searchParams.get("seed"));

  await p.goto(BASE + href, { waitUntil: "networkidle" });
  await p.waitForTimeout(1100);

  const total = await p.evaluate(() => {
    const m = document.body.innerText.replace(/\s+/g, " ").match(/\d+\s*\/\s*(\d+)\s*답함/);
    return m && +m[1];
  });

  // 모든 문항에 A 를 고른다.
  // 답안지 번호판으로 옮겨 다닌다 — "다음"에 기대면 마지막에서 멈춘다.
  let answered = 0;
  for (let i = 0; i < total; i++) {
    const jumped = await p.evaluate((n) => {
      const b = [...document.querySelectorAll("button[aria-label]")]
        .find((x) => (x.getAttribute("aria-label") || "").startsWith(`${n}번`));
      if (!b) return false;
      b.click();
      return true;
    }, i + 1);
    if (!jumped) break;
    await p.waitForTimeout(200);
    const ok = await p.evaluate(() => {
      // 보기 단추 안에는 A·B·C·D 가 든 동그라미 span 이 있다
      const b = [...document.querySelectorAll("button")].find((x) =>
        [...x.querySelectorAll("span")].some((s) => s.textContent.trim() === "A"));
      if (!b) return false;
      b.click();
      return true;
    });
    if (ok) answered++;
    await p.waitForTimeout(200);
  }

  const said = await p.evaluate(() => {
    const m = document.body.innerText.replace(/\s+/g, " ").match(/(\d+)\s*\/\s*(\d+)\s*답함/);
    return m && { done: +m[1], total: +m[2] };
  });

  // 제출 — 위쪽 "제출"을 누르면 확인 창이 뜨고 거기서 "제출하기"를 누른다
  const clickText = (re) => p.evaluate((src) => {
    const rx = new RegExp(src);
    const b = [...document.querySelectorAll("button")]
      .find((x) => !x.disabled && rx.test((x.innerText || "").replace(/\s+/g, " ").trim()));
    if (!b) return false;
    b.click();
    return true;
  }, re);
  const opened = await clickText("^제출$");
  await p.waitForTimeout(600);
  // "제출하기"는 아래쪽 단추에도 있다. 확인 창 안의 것을 눌러야 한다.
  const confirmed = await p.evaluate(() => {
    const overlay = [...document.querySelectorAll("div")]
      .find((d) => /제출할까요/.test(d.innerText || "") && getComputedStyle(d).position === "fixed");
    if (!overlay) return false;
    const b = [...overlay.querySelectorAll("button")]
      .find((x) => /^제출하기$/.test((x.innerText || "").trim()));
    if (!b) return false;
    b.click();
    return true;
  });
  await p.waitForTimeout(1800);
  if (!opened || !confirmed) console.log(`  (제출 ${opened ? "열림" : "안 열림"} · 확인 ${confirmed ? "눌림" : "안 눌림"})`);

  const result = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  const gotCorrect = (result.match(/(\d+)\s*\/\s*(\d+)\s*문항/) || [])[1];
  const gotScore = (result.match(/환산 점수\s*(\d+)/) || [])[1];

  // 진짜 정답 수
  const ex = buildExam(EXAM, 900, seed);
  const trueCorrect = ex.items.filter((it) => answerOf(it) === 0).length;

  console.log(`[${EXAM}] 씨앗 ${seed} · ${total}문항`);
  console.log(`  화면이 센 답함: ${said?.done}/${said?.total} (실제로 누른 것 ${answered})`);
  console.log(`  모두 A 로 골랐을 때 진짜 맞는 문항: ${trueCorrect}`);
  console.log(`  결과 화면: 맞힌 문항 ${gotCorrect ?? "?"} · 점수 ${gotScore ?? "?"}`);
  const ok = String(gotCorrect) === String(trueCorrect);
  console.log(`  ${ok ? "✓ 채점이 맞다" : "✗ 채점이 어긋난다"}`);
  console.log("  " + (result.slice(0, 220)));
  if (errs.length) console.log("  예외: " + [...new Set(errs)].join(" / "));
  await b.close();
})();
