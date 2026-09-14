/*
 * 시험 도중에 나갔다가 돌아온다.
 *
 * 150분짜리 시험을 폰으로 본다. 전화가 오고, 알림을 누르고, 브라우저가
 * 메모리를 회수하기도 한다. 돌아왔을 때 고른 답과 자리와 남은 시간이 그대로
 * 여야 한다 — 여기서 날아가면 그 사람은 다시 오지 않는다.
 *
 * ⚠️ 처음에는 화면의 "N / 100" 을 정규식으로 주워 문항 자리로 썼다. 그런데
 *    위쪽 막대에도 "2 / 100"(지금까지 답한 개수)이 같은 모양으로 있어서,
 *    자리가 멀쩡한데도 "1번으로 되돌아갔다" 고 적었다. 시험 자리는 문제 바로
 *    위의 것이다 — 마지막 것을 본다. 답이 남았는지도 글자 비교가 아니라
 *    "골라진 표시가 붙어 있는가" 로 본다.
 *
 *   node scratchpad/gisa-resume.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-resume.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
const secs = (t) => { const a = t.split(":").map(Number); return a[0]*3600 + a[1]*60 + a[2]; };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));

  /** 화면에서 읽어야 할 것들 */
  const look = () => p.evaluate(() => {
    const t = (document.body.innerText || "").replace(/\s+/g, " ");
    const all = [...t.matchAll(/(\d+)\s*\/\s*(\d+)/g)].map((m) => m[1]);
    return {
      자리: all.length ? all[all.length - 1] : null,   // 문제 바로 위의 것
      시계: (t.match(/\d+:\d\d:\d\d/) || [])[0] ?? null,
      // 고른 보기에는 테두리·바탕이 따로 붙는다
      골라짐: [...document.querySelectorAll("button")]
        .filter((e) => /indigo|ring-/.test(e.className) && /^[1-4]/.test((e.innerText||"").trim()))
        .map((e) => (e.innerText || "").replace(/\s+/g, " ").trim().slice(0, 28)),
      적은것: [...document.querySelectorAll("textarea")].map((e) => e.value).filter(Boolean),
    };
  });

  for (const [이름, 홈, 답하기] of [
    ["필기 모의고사", "/mock", async () => {
      const o = p.getByRole("button").filter({ hasText: /^[1-4]/ }).nth(1);
      if (!(await o.count())) return null;
      await o.click(); await p.waitForTimeout(450);
      return (await o.innerText()).replace(/\s+/g, " ").trim().slice(0, 28);
    }],
    ["실기 모의고사", "/practical/mock", async () => {
      const t = p.locator("textarea").first();
      if (!(await t.count())) return null;
      await t.fill("정규화"); await p.waitForTimeout(450);
      return "정규화";
    }],
  ]) {
    console.log(`\n━━━ ${이름}`);
    await p.goto(BASE + 홈, { waitUntil: "networkidle" }); await p.waitForTimeout(700);
    await p.getByRole("button", { name: /시작하기/ }).first().click().catch(() => {});
    await p.waitForTimeout(1500);

    const 답 = await 답하기();
    if (!답) { no("문항에 답할 방법을 찾지 못했다"); continue; }
    await p.getByRole("button", { name: /^다음$/ }).first().click().catch(() => {});
    await p.waitForTimeout(700);
    const 나가기전 = await look();
    ok(`1번에 답하고 ${나가기전.자리}번까지 왔다 · 시계 ${나가기전.시계}`);

    // 나갔다 온다 — 홈에 들렀다가 완전히 새로 연다
    await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
    await p.goto(BASE + 홈, { waitUntil: "networkidle" }); await p.waitForTimeout(1000);
    const 안내 = await p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
    if (/보던 시험이 있습니다/.test(안내)) {
      const m = 안내.match(/(\d+)문항까지 답했고, 남은 시간 ([\d:]+)/);
      ok(m ? `돌아오니 "${m[1]}문항까지 답했고, 남은 시간 ${m[2]}" 라고 알려 준다` : "보던 시험이 있다고 알려 준다");
    } else no("보던 시험이 있는데 알려 주지 않는다");

    const 이어 = p.getByRole("button", { name: /이어서 보기/ }).first();
    if (!(await 이어.count())) { no("«이어서 보기» 가 없다"); continue; }
    await 이어.click(); await p.waitForTimeout(1500);

    const 돌아온뒤 = await look();
    if (돌아온뒤.자리 === 나가기전.자리) ok(`${돌아온뒤.자리}번 자리로 그대로 돌아왔다`);
    else no(`자리가 ${나가기전.자리}번 → ${돌아온뒤.자리}번으로 바뀌었다`);

    /*
     * ⚠️ 답이 남았는지를 "지금 화면에 골라진 것이 있는가" 로 봤더니, 2번
     *    문항에서 1번의 답을 찾고 있었다 — 당연히 없다. 답한 것은 1번이므로
     *    답안지로 1번에 돌아가서 봐야 한다.
     */
    const 시트열기 = p.getByRole("button", { name: /답안지/ }).first();
    if (!(await 시트열기.count())) no("답안지를 열 수 없다");
    else {
      await 시트열기.click(); await p.waitForTimeout(800);
      /*
       * 답안지 한 줄의 생김새가 두 시험에서 다르다. 필기는 번호만("1"),
       * 실기는 "1 질문… 적음/빈칸" 이다. 번호로만 찾으면 실기에서 못 찾는다.
       */
      const 시트 = p.locator('[class*="fixed"][class*="inset-0"]').last();
      let 일번 = 시트.getByRole("button", { name: /^1$/ }).first();
      // hasText 는 눈에 보이는 글이 아니라 textContent 로 맞춘다. 번호와 질문이
      // 다른 칸에 들어 있어 사이에 공백이 없다 — "1 한 객체…" 가 아니라 "1한 객체…" 다.
      if (!(await 일번.count())) 일번 = 시트.getByRole("button").filter({ hasText: /^1[^0-9]/ }).first();
      if (!(await 일번.count())) no("답안지에 1번 칸이 없다");
      else {
        await 일번.click(); await p.waitForTimeout(900);
        const 일번화면 = await look();
        if (이름.startsWith("실기")) {
          if (일번화면.적은것.some((v) => v.includes("정규화"))) ok('1번에 적어 둔 "정규화" 가 그대로 있다');
          else no("돌아왔더니 1번에 적어 둔 것이 사라졌다");
        } else {
          if (일번화면.골라짐.length) ok(`1번에 고른 보기가 그대로 있다 ("${일번화면.골라짐[0]}")`);
          else no("돌아왔더니 1번에 고른 보기가 풀려 있다");
        }
      }
    }

    const 전 = secs(나가기전.시계), 후 = secs(돌아온뒤.시계);
    if (후 < 전 && 전 - 후 < 60) ok(`시계가 이어진다 (${나가기전.시계} → ${돌아온뒤.시계})`);
    else no(`시계가 어긋난다 (${나가기전.시계} → ${돌아온뒤.시계})`);
  }

  if (errs.length) no(`예외 ${errs.length}건: ${errs[0]}`);
  console.log(bad ? `\n걸린 것 ${bad}건` : "\n✓ 나갔다 돌아와도 시험이 이어진다");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
