/*
 * 게임의 "눌러야만 나오는 화면" 글씨 대비.
 *
 * 주소만 여는 검사기는 게임의 첫 화면까지만 본다. 정작 색이 많이 쓰이는
 * 곳은 그 뒤다 — 맞았을 때의 초록 판, 틀렸을 때의 붉은 판, 뒤집힌 카드,
 * 결과 화면. 직접 눌러 가며 두 테마에서 잰다.
 *
 *   node scratchpad/comhwal-game-ink.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const { 재기 } = require("/home/user/k-history/scratchpad/ink-lib.js");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/comhwal-game-ink.js <주소>"); process.exit(1); }

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let 잰곳 = 0, 미달 = 0;
  const 재자 = async (p, 이름, theme) => {
    for (const y of [0, 500]) {
      await p.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
      await p.waitForTimeout(200);
      const [a, c] = await 재기(p, `${이름}(${y})`, theme);
      잰곳 += a; 미달 += c;
    }
  };

  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
      deviceScaleFactor: 1, reducedMotion: "reduce",
    });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("comhwal:theme", t);
        localStorage.setItem("comhwal:mirror:comhwal-state", JSON.stringify({
          state: { settings: { grade: 1, kind: "written", examDate: null } },
        }));
      } catch {}
    }, theme);
    const p = await ctx.newPage();

    /* ── O/X — 맞은 판과 틀린 판을 둘 다 본다 ── */
    for (const 고를것 of ["맞다", "틀리다"]) {
      await p.goto(BASE + "/game/ox", { waitUntil: "networkidle" });
      await p.waitForTimeout(900);
      await p.locator("button", { hasText: new RegExp("^" + 고를것 + "$") }).first().click();
      await p.waitForTimeout(600);
      await 재자(p, `O/X 채점 뒤 · ${고를것}`, theme);
    }
    /* 결과 화면까지 */
    await p.goto(BASE + "/game/ox", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    for (let i = 0; i < 25; i++) {
      const 맞다 = p.locator("button", { hasText: /^맞다$/ }).first();
      if (await 맞다.count()) { await 맞다.click(); await p.waitForTimeout(180); }
      const n = p.locator("button", { hasText: /^(다음|결과 보기)$/ }).first();
      if (!(await n.count())) break;
      const 끝 = /결과 보기/.test(await n.innerText());
      await n.click(); await p.waitForTimeout(200);
      if (끝) break;
    }
    await p.waitForTimeout(400);
    await 재자(p, "O/X 결과", theme);

    /* ── 단축키 — 시작 · 채점 뒤 · 결과 ── */
    await p.goto(BASE + "/game/keys", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await 재자(p, "단축키 시작 전", theme);
    await p.locator("button", { hasText: /^시작$/ }).first().click();
    await p.waitForTimeout(600);
    await 재자(p, "단축키 푸는 중", theme);
    await p.keyboard.press("F9");
    await p.waitForTimeout(500);
    await 재자(p, "단축키 채점 뒤", theme);
    for (let i = 0; i < 40; i++) {
      const n = p.locator("button", { hasText: /^(다음|결과 보기)$/ }).first();
      if (await n.count()) { await n.click(); await p.waitForTimeout(180); continue; }
      const m = p.locator("button", { hasText: /^모르겠어요$/ }).first();
      if (await m.count()) { await m.click(); await p.waitForTimeout(180); continue; }
      break;
    }
    await p.waitForTimeout(400);
    await 재자(p, "단축키 결과", theme);

    /* ── 짝 맞추기 — 뒤집힌 상태 ── */
    await p.goto(BASE + "/game/match", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await 재자(p, "짝 맞추기 처음", theme);
    await p.locator("main button[aria-label]").nth(0).click();
    await p.waitForTimeout(250);
    await p.locator("main button[aria-label]").nth(1).click();
    await p.waitForTimeout(250);
    await 재자(p, "짝 맞추기 두 장 열림", theme);

    await ctx.close();
  }
  await b.close();
  console.log(`게임 화면 글씨 ${잰곳}곳`);
  console.log(미달 ? `대비 미달 ${미달}건` : "✓ 대비 이상 없음");
  process.exit(미달 ? 1 : 0);
})();
