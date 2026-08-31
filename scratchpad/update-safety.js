// 이미 쓰고 있던 사람이 새 판을 받았을 때 무엇이 남고 무엇이 사라지는가.
//
// 예전 판에서 만든 저장본을 그대로 넣고 새 판을 띄운다.
//   학습 기록(진도·복습·오답·XP)  → 반드시 남아야 한다
//   풀던 시험(고른 보기 번호)      → 선지 순서가 바뀌었으니 정리되어야 한다
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.env.BASE, P = process.env.PREFIX, STATE_KEY = process.env.STATE_KEY;
const STATE = process.env.STATE;
const bad = [];
const ok = (s) => console.log("  ✓ " + s);
const fail = (w) => { bad.push(w); console.log("  ✗ " + w); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  // 예전 판이 남겼을 법한 저장본 — 풀던 퀴즈·시험에는 fmt 표시가 없다
  // addInitScript 는 페이지를 옮길 때마다 돈다. 한 번만 넣어야
  // "새 판에서 시작한 것" 까지 예전 저장본으로 덮어써 버리지 않는다.
  await ctx.addInitScript(([sk, st, p]) => {
    try {
      if (localStorage.getItem("__seeded__")) return;
      localStorage.setItem("__seeded__", "1");
      localStorage.setItem(sk, st);
      localStorage.setItem(`${p}:quiz-progress`, JSON.stringify({
        grade: 2, subject: null, count: 10, seed: 12345, onlySourceIds: null,
        answers: [3, 3, null, null, null, null, null, null, null, null],
        at: 2, savedAt: Date.now(),
      }));
      localStorage.setItem(`${p}:mock-progress`, JSON.stringify({
        grade: 2, seed: 999, startedAt: Date.now() - 600000,
        endsAt: Date.now() + 2400000, answers: { 0: 3, 1: 3, 2: 3 }, at: 3,
      }));
    } catch {}
  }, [STATE_KEY, STATE, P]);

  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  // ① 학습 기록이 남았는가
  //    화면의 글을 긁어 읽으면 앱마다 문구가 달라 헛걸린다. 앱이 실제로
  //    다시 저장한 값을 그대로 읽는다 — 확인하려는 것도 그것이다.
  await page.goto(BASE + "/settings", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const saved = await page.evaluate(
    ([k]) => {
      try {
        return JSON.parse(localStorage.getItem(k)).state;
      } catch {
        return null;
      }
    },
    [STATE_KEY],
  );
  const want = JSON.parse(STATE).state;
  if (!saved) fail("저장본을 다시 읽지 못했습니다");
  else {
    if (saved.stats?.xp !== want.stats.xp)
      fail(`XP 가 ${want.stats.xp} 여야 하는데 ${saved.stats?.xp} 입니다`);
    else ok(`누적 XP 그대로 (${saved.stats.xp})`);
    const n = saved.reviewCards?.length ?? 0;
    if (n !== want.reviewCards.length)
      fail(`복습 카드가 ${want.reviewCards.length}장이어야 하는데 ${n}장입니다`);
    else ok(`복습 카드 그대로 (${n}장)`);
  }

  // ② IndexedDB 로 옮겨 담겼는가 (저장소 이름이 그대로여야 한다)
  const idb = await page.evaluate(async () => {
    const dbs = (await indexedDB.databases?.()) ?? [];
    return dbs.map((d) => d.name);
  });
  if (!idb.includes(P)) fail(`IndexedDB 이름이 ${idb.join(",")} 입니다`);
  else ok(`IndexedDB(${P}) 그대로`);

  // ③ 풀던 시험은 정리되었는가
  //    퀴즈 화면은 앱마다 있기도 없기도 하다 (토익은 파트 훈련으로 나뉘어 있다).
  //    없는 화면을 찾다 멈추지 않도록 먼저 있는지 본다.
  await page.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const q = await page.evaluate(() => document.body.innerText);
  const hasQuiz = !/찾을 수 없|not found|404/i.test(q) && /시작하기|이어서|퀴즈/.test(q);
  // 퀴즈 "이어하기"는 컴활·SQLD 에만 있다. 없는 기능을 찾아 실패로
  // 내면 진짜 문제가 묻힌다. 그 앱이 그 기능을 가졌는지 먼저 본다.
  const hasQuizResume = await page.evaluate(
    ([p]) => Object.keys(localStorage).some((k) => k === `${p}:quiz-progress`),
    [P],
  );
  if (!hasQuiz) {
    ok("이 앱에는 퀴즈 화면이 없다 — 건너뜀");
  } else if (/풀던 퀴즈가 남아 있습니다/.test(q)) {
    fail("예전 판의 풀던 퀴즈를 그대로 이어 하자고 합니다 — 답이 어긋납니다");
  } else ok("예전 판의 풀던 퀴즈는 조용히 정리됨");

  await page.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => document.body.innerText);
  if (/풀던 시험이 남아 있습니다/.test(m)) {
    fail("예전 판의 풀던 시험을 그대로 이어 하자고 합니다 — 채점이 어긋납니다");
  } else ok("예전 판의 풀던 시험은 조용히 정리됨");

  // ④ 새로 시작한 것은 정상적으로 이어지는가
  if (!hasQuiz) {
    // 퀴즈가 없는 앱은 모의고사로 같은 것을 확인한다
    await page.goto(BASE + "/mock", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const start = page.getByRole("button", { name: /응시하기/ }).first();
    if (await start.count()) {
      await start.click();
      await page.waitForTimeout(1200);
      const opt = page.locator("main button").filter({ hasText: /^[A-D1-4]/ }).first();
      if (await opt.count()) await opt.click();
      await page.waitForTimeout(300);
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await page.goto(BASE + "/mock", { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const back = await page.evaluate(() => document.body.innerText);
      if (!/보던 시험이 남아 있습니다/.test(back)) {
        fail("새 판에서 시작한 시험도 이어지지 않습니다");
      } else ok("새 판에서 시작한 것은 정상적으로 이어짐");
    } else {
      fail("모의고사에서 응시 단추를 찾지 못했습니다");
    }
  } else if (!hasQuizResume) {
    ok("이 앱에는 퀴즈 이어하기가 없다 — 건너뜀");
  } else {
  await page.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  // 시작 단추 문구가 앱마다 다르다 ("시작하기" / "퀴즈 시작 — …")
  const clickText = (src) =>
    page.evaluate((re) => {
      const rx = new RegExp(re);
      const b = [...document.querySelectorAll("button")].find(
        (x) => !x.disabled && rx.test((x.innerText || "").replace(/\s+/g, " ")),
      );
      if (!b) return false;
      b.click();
      return true;
    }, src);
  if (!(await clickText("시작하기|퀴즈 시작"))) fail("퀴즈 시작 단추를 못 찾았습니다");
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const i = [...document.querySelectorAll("button")].findIndex((x) => {
      const n = x.querySelector("span");
      return n && /^[1-4]$/.test(n.textContent.trim());
    });
    if (i >= 0) document.querySelectorAll("button")[i].click();
  });
  await page.waitForTimeout(250);
  await clickText("다음 문제|다음");
  await page.waitForTimeout(300);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const again = await page.evaluate(() => document.body.innerText);
  if (!/풀던 퀴즈가 남아 있습니다/.test(again)) {
    fail("새 판에서 시작한 퀴즈도 이어지지 않습니다");
  } else ok("새 판에서 시작한 것은 정상적으로 이어짐");
  }

  if (errs.filter((e) => !/favicon/i.test(e)).length) fail("콘솔 오류: " + errs[0].slice(0, 100));
  else ok("콘솔 오류 없음");

  await b.close();
  console.log("");
  if (bad.length) { console.log(`✗ ${bad.length}건`); process.exit(1); }
  console.log("✓ 기록은 남고, 풀던 시험만 정리됨");
})();
