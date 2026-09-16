/*
 * 약술형 화면들의 글씨 대비.
 *
 * 스스로 매기는 칸은 적고 나서 단추를 눌러야 열린다. 주소만 여는 검사기는
 * 여기까지 오지 못한다. 세 화면 — 적기 전, 기준을 편 뒤, 매긴 뒤 — 을
 * 직접 걸어 가며 두 테마에서 잰다.
 *
 *   node scratchpad/gisa-essay-ink.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const { 재기 } = require("/home/user/k-history/scratchpad/ink-lib.js");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-essay-ink.js <주소>"); process.exit(1); }

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let 잰곳 = 0, 미달 = 0;
  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("gisa:theme", t);
        localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
          state: { settings: { track: "practical", examDate: null } },
        }));
      } catch {}
    }, theme);
    const p = await ctx.newPage();
    await p.goto(BASE + "/practical", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await p.locator("button", { hasText: /^설명$/ }).first().click();
    await p.waitForTimeout(250);
    await p.locator("button", { hasText: /시작/ }).first().click();
    await p.waitForTimeout(800);

    let [a, b1] = await 재기(p, "적기 전", theme); 잰곳 += a; 미달 += b1;

    await p.locator("textarea").first().fill("IDS 는 알리고 IPS 는 막는다.");
    await p.waitForTimeout(250);
    await p.locator("button", { hasText: /채점 기준 펴기/ }).first().click();
    await p.waitForTimeout(400);
    for (const y of [0, 400]) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(200);
      const [c, d] = await 재기(p, `기준을 편 뒤(${y})`, theme); 잰곳 += c; 미달 += d;
    }

    /* 세 갈래를 다 재야 한다 — 색이 저마다 다르다 */
    for (const 갈래 of ["반쯤", "다 담았다", "못 담았다"]) {
      await p.goto(BASE + "/practical", { waitUntil: "networkidle" });
      await p.waitForTimeout(600);
      await p.locator("button", { hasText: /^설명$/ }).first().click();
      await p.waitForTimeout(200);
      await p.locator("button", { hasText: /시작/ }).first().click();
      await p.waitForTimeout(700);
      await p.locator("textarea").first().fill("설명을 이렇게 적었다.");
      await p.waitForTimeout(200);
      await p.locator("button", { hasText: /채점 기준 펴기/ }).first().click();
      await p.waitForTimeout(350);
      await p.locator("button", { hasText: new RegExp("^" + 갈래 + "$") }).first().click();
      await p.waitForTimeout(600);
      for (const y of [0, 400]) {
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await p.waitForTimeout(200);
        const [c, d] = await 재기(p, `매긴 뒤 · ${갈래}(${y})`, theme); 잰곳 += c; 미달 += d;
      }
    }
    await ctx.close();
  }
  await b.close();
  console.log(`약술형 화면 글씨 ${잰곳}곳`);
  console.log(미달 ? `대비 미달 ${미달}건` : "✓ 대비 이상 없음");
  process.exit(미달 ? 1 : 0);
})();
