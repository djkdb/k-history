/*
 * 찾은 결과 화면의 글씨 대비.
 *
 * 이 화면은 localStorage 로는 못 만든다 — 무언가를 쳐야만 나온다. 훑는
 * 검사기(all-contrast.js)는 주소만 열어 보므로 이 화면을 통째로 지나친다.
 * 그래서 직접 치고 재는 검사를 따로 둔다.
 *
 *   node scratchpad/gisa-search-ink.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const { 재기 } = require("/home/user/k-history/scratchpad/ink-lib.js");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-search-ink.js <주소>"); process.exit(1); }

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let bad = 0, total = 0;
  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("gisa:theme", t);
        localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
          state: { settings: { track: "written", examDate: null }, studiedIds: ["l-os-memory"] },
        }));
      } catch {}
    }, theme);
    const p = await ctx.newPage();
    /* 친 말마다 화면이 다르다 — 결과가 있을 때, 문항이 붙을 때, 하나도 없을 때 */
    for (const 말 of ["벨레이디", "페이지 부재", "존재하지않는말zzz"]) {
      await p.goto(BASE + "/learn", { waitUntil: "networkidle" });
      await p.waitForTimeout(700);
      await p.locator("input[type=search]").first().fill(말);
      await p.waitForTimeout(550);
      /* 결과가 길면 아래쪽은 화면 밖이다 — 두 번 나눠 잰다 */
      for (const scroll of [0, 700]) {
        await p.evaluate((y) => window.scrollTo(0, y), scroll);
        await p.waitForTimeout(250);
        const [잰, 나쁜] = await 재기(p, `"${말}" (${scroll})`, theme);
        total += 잰; bad += 나쁜;
      }
    }
    await ctx.close();
  }
  await b.close();
  console.log(`찾은 결과 화면 글씨 ${total}곳`);
  console.log(bad ? `대비 미달 ${bad}건` : "✓ 대비 이상 없음");
  process.exit(bad ? 1 : 0);
})();
