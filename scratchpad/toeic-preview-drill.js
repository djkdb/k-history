// 선구독 훈련 — 켜고 끌 수 있는가, 순서대로 도는가, 시간을 재는가
const { chromium } = require("playwright");
const BASE = process.argv[2];
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    const mk = (n, l) => ({ name: n, lang: l, default: false, localService: true, voiceURI: n });
    const list = [mk("Samantha", "en-US"), mk("Daniel", "en-GB")];
    const ss = window.speechSynthesis;
    Object.defineProperty(ss, "getVoices", { value: () => list, configurable: true });
    Object.defineProperty(ss, "speak", { value: (u) => setTimeout(() => u.onend && u.onend(new Event("end")), 15), configurable: true });
    Object.defineProperty(ss, "cancel", { value: () => {}, configurable: true });
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const txt = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  // 바닥 내비게이션에도 "듣기"가 있다 — 본문 안에서만 찾는다
  const hit = (re) => p.evaluate((s) => {
    const rx = new RegExp(s);
    const root = document.querySelector("main") ?? document.body;
    const b = [...root.querySelectorAll("button")].find((x) => !x.disabled && rx.test((x.innerText || "").trim()));
    if (!b) return false; b.click(); return true;
  }, re);

  // Part 1·2 에는 선구독이 없어야 한다
  await p.goto(BASE + "/part/2", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const t2 = await txt();
  /선구독/.test(t2) ? no("Part 2 에 선구독이 떠 있다 (선택지를 귀로만 듣는 파트다)") : ok("Part 2 에는 선구독이 없다");
  /받아쓰기/.test(t2) ? ok("Part 2 에는 받아쓰기가 있다") : no("Part 2 에 받아쓰기가 없다");

  // Part 3 — 기본이 문제 풀기여야 한다
  await p.goto(BASE + "/part/3", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const t3 = await txt();
  /선구독 훈련/.test(t3) ? ok("Part 3 에 선구독 훈련 단추가 있다") : no("Part 3 에 선구독 훈련이 없다");
  const defaultIsQuiz = await p.evaluate(() =>
    !/미리 읽기|문제를 먼저 읽습니다/.test(document.body.innerText));
  defaultIsQuiz ? ok("기본은 문제 풀기다 (훈련이 켜져 있지 않다)") : no("기본이 훈련으로 켜져 있다");

  // 켠다
  if (!(await hit("선구독 훈련"))) { no("선구독 훈련을 켤 수 없다"); }
  else {
    await p.waitForTimeout(700);
    const a = await txt();
    /문제를 먼저 읽습니다/.test(a) ? ok("켜면 안내가 뜬다") : no("켰는데 안내가 없다: " + a.slice(0, 90));

    await hit("시작하기");
    await p.waitForTimeout(1200);
    const rd = await txt();
    /미리 읽기/.test(rd) && /다 읽었어요/.test(rd) ? ok("① 미리 읽기 — 시계와 '다 읽었어요'가 있다") : no("미리 읽기 화면이 이상하다: " + rd.slice(0, 110));
    const countChoices = () => p.evaluate(() => {
      const root = document.querySelector("main") ?? document.body;
      return [...root.querySelectorAll("button")]
        .filter((x) => /^[ABCD]\b/.test((x.innerText || "").trim())).length;
    });
    const nRead = await countChoices();
    nRead >= 12 ? ok(`미리 읽기에서 문항이 보인다 (선택지 ${nRead}개 = 3문항 × 4)`)
                : no(`미리 읽기인데 선택지가 ${nRead}개뿐`);

    await hit("다 읽었어요");
    await p.waitForTimeout(700);
    const ls = await txt();
    /지금은 문제가 보이지 않습니다/.test(ls) ? ok("② 듣기 — 문제를 가린다") : no("듣기 단계가 이상하다: " + ls.slice(0, 110));
    /미리 읽는 데 [\d.]+초 걸렸습니다/.test(ls) ? ok("걸린 시간을 잰다: " + (ls.match(/미리 읽는 데 [\d.]+초 걸렸습니다/) || [])[0]) : no("걸린 시간이 안 나온다");
    const nHide = await countChoices();
    nHide === 0 ? ok("듣는 동안 문항이 가려진다 (선택지 0개)") : no(`듣는 동안에도 선택지가 ${nHide}개 보인다`);

    await hit("^듣기$");
    // 지문은 줄마다 0.4초를 띄우므로 몇 초 걸린다. 끝날 때까지 기다린다.
    let waited = 0;
    while (waited < 20000) {
      const n = await countChoices();
      if (n >= 12) break;
      await p.waitForTimeout(400);
      waited += 400;
    }
    console.log(`  · 음성이 끝나기까지 ${(waited / 1000).toFixed(1)}초 기다림`);
    const nBack = await countChoices();
    nBack >= 12 ? ok(`③ 풀이 — 문항이 다시 보인다 (선택지 ${nBack}개)`)
                : no(`풀이인데 선택지가 ${nBack}개뿐`);
    const an = await txt();
    /미리 읽기/.test(an) && /[\d.]+초/.test(an) ? ok("걸린 시간이 결과에 남는다") : no("걸린 시간이 결과에 없다");

    // 답 세 개 고르기
    for (let i = 0; i < 3; i++) {
      // 한 번 고르면 그 문항은 잠긴다 — 아직 안 잠긴 A 를 고른다
      await p.evaluate(() => {
        const root = document.querySelector("main") ?? document.body;
        const b = [...root.querySelectorAll("button")]
          .find((x) => !x.disabled && /^A\b/.test((x.innerText || "").trim()));
        if (b) b.click();
      });
      await p.waitForTimeout(250);
    }
    const fin = await txt();
    /문항 중 \d+문항 맞혔습니다/.test(fin) ? ok("채점이 나온다: " + (fin.match(/\d+문항 중 \d+문항 맞혔습니다/)||[])[0]) : no("채점이 안 나온다");
  }

  // 끌 수 있는가
  await hit("문제 풀기");
  await p.waitForTimeout(600);
  const off = await p.evaluate(() => !/미리 읽기|문제를 먼저 읽습니다/.test(document.body.innerText));
  off ? ok("다시 끌 수 있다") : no("껐는데 훈련이 남아 있다");

  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  console.log(bad ? `\n문제 ${bad}건` : "\n이상 없음");
  await b.close();
})();
