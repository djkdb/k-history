// 시험을 실제로 보고 오답 노트가 맞는지 센다.
const { chromium } = require("playwright");
const BASE = process.argv[2];
const jiti = require("jiti")("/home/user/k-history/toeic", { alias: { "@": "/home/user/k-history/toeic/src" } });
const { buildExam, answerOf } = jiti("@/lib/exam");
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const txt = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));

  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const href = await p.evaluate(() => [...document.querySelectorAll("a[href*='exam=lc']")]
    .map(a => a.getAttribute("href")).find(h => !h.includes("resume")));
  const seed = Number(new URL(href, BASE).searchParams.get("seed"));
  await p.goto(BASE + href, { waitUntil: "networkidle" });
  await p.waitForTimeout(1100);
  const total = await p.evaluate(() => { const m = document.body.innerText.replace(/\s+/g," ").match(/\d+\s*\/\s*(\d+)\s*답함/); return m && +m[1]; });

  for (let i = 0; i < total; i++) {
    await p.evaluate((n) => {
      const b = [...document.querySelectorAll("button[aria-label]")].find((x) => (x.getAttribute("aria-label")||"").startsWith(`${n}번`));
      if (b) b.click();
    }, i + 1);
    await p.waitForTimeout(180);
    await p.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => [...x.querySelectorAll("span")].some((s) => s.textContent.trim() === "A"));
      if (b) b.click();
    });
    await p.waitForTimeout(180);
  }
  await p.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => /^제출$/.test((x.innerText||"").trim())); b?.click(); });
  await p.waitForTimeout(600);
  await p.evaluate(() => {
    const ov = [...document.querySelectorAll("div")].find((d) => /제출할까요/.test(d.innerText||"") && getComputedStyle(d).position === "fixed");
    const b = ov && [...ov.querySelectorAll("button")].find((x) => /^제출하기$/.test((x.innerText||"").trim()));
    b?.click();
  });
  await p.waitForTimeout(1800);

  const ex = buildExam("lc", 900, seed);
  const trueWrong = ex.items.filter((it) => answerOf(it) !== 0).length;
  const res = await txt();
  const saidWrong = (res.match(/틀린 문항\s*(\d+)/) || [])[1];
  if (String(saidWrong) === String(trueWrong)) ok(`결과 화면의 틀린 문항 ${saidWrong}개 = 실제 ${trueWrong}개`);
  else no(`결과는 ${saidWrong}개라는데 실제로는 ${trueWrong}개`);

  // 오답 노트로 간다
  const noteLink = await p.evaluate(() => {
    const a = [...document.querySelectorAll("a[href*='/mock/note']")][0];
    return a && a.getAttribute("href");
  });
  if (!noteLink) { no("결과 화면에 오답 노트 링크가 없다"); }
  else {
    await p.goto(BASE + noteLink, { waitUntil: "networkidle" });
    await p.waitForTimeout(1200);
    const n = await txt();
    if (/찾지 못했|404/.test(n)) no("오답 노트가 기록을 못 찾는다: " + n.slice(0, 90));
    else {
      // 노트에 실린 문항 수
      // 형식은 "1번" 다음 줄에 "Part 1" 이다 (가운뎃점이 아니다)
      const listed = await p.evaluate(() => (document.body.innerText.match(/^\d+번$/gm) || []).length);
      if (listed === trueWrong) ok(`오답 노트에 ${listed}문항 — 실제 틀린 수와 같다`);
      else no(`오답 노트에 ${listed}문항인데 실제로는 ${trueWrong}개`);
      // 약한 유형의 합이 시험 전체와 맞는가
      const kinds = await p.evaluate(() =>
        [...document.body.innerText.matchAll(/(\d+)개 중 (\d+)개 틀림/g)]
          .map((m) => [Number(m[1]), Number(m[2])]));
      const sumT = kinds.reduce((a, [t]) => a + t, 0);
      const sumW = kinds.reduce((a, [, w]) => a + w, 0);
      const sumC = sumT - sumW;
      // "약한 유형"은 하나라도 틀린 유형만 싣는다 (다 맞힌 유형은 뺀다).
      // 그러니 합이 시험 전체보다 적은 것이 정상이다.
      if (sumT <= ex.items.length) ok(`약한 유형에 실린 문항 ${sumT} (다 맞힌 유형 제외 · 전체 ${ex.items.length})`);
      else no(`약한 유형 합 ${sumT} 이 시험 ${ex.items.length}문항보다 많다`);
      if (sumT - sumC === trueWrong) ok(`유형별 틀린 수 합 ${sumT - sumC} = 실제 ${trueWrong}`);
      else no(`유형별 틀린 수 합 ${sumT - sumC} 인데 실제는 ${trueWrong}`);

      const hasWhy = /정답/.test(n) && /내 답/.test(n);
      hasWhy ? ok("각 문항에 내 답과 정답이 함께 있다") : no("내 답·정답 표시가 없다");
    }
  }
  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  console.log(bad ? `\n문제 ${bad}건` : "\n이상 없음");
  await b.close();
})();
