// 카드가 적은 문항 수·제한 시간이 실제 시험지와 같은가
const { chromium } = require("playwright");
const BASE = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  let bad = 0;
  for (let round = 1; round <= 3; round++) {
    await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    const cards = await p.evaluate(() =>
      // "이어서 풀기" 카드는 시험 카드가 아니다 — 문항 수 대신 "N문항까지
      // 풀었습니다"를 적는다. 세면 거짓 실패가 난다.
      [...document.querySelectorAll("a[href*='/mock/session']")]
        .filter((a) => !a.getAttribute("href").includes("resume=1"))
        .map((a) => {
        let el = a;
        for (let i = 0; i < 5 && el.parentElement; i++) {
          el = el.parentElement;
          if (/모의고사/.test(el.innerText)) break;
        }
        const t = (el.innerText || "").replace(/\s+/g, " ");
        const n = t.match(/(\d+)\s*문항/), m = t.match(/(\d+)\s*분/);
        return { href: a.getAttribute("href"), n: n && +n[1], m: m && +m[1],
                 name: (t.match(/(듣기|읽기|전체) 모의고사/) || [])[0] };
      }));
    for (const c of cards) {
      await p.goto(BASE + c.href, { waitUntil: "networkidle" });
      await p.waitForTimeout(1100);
      const real = await p.evaluate(() => {
        const t = document.body.innerText.replace(/\s+/g, " ");
        const tot = t.match(/\d+\s*\/\s*(\d+)\s*답함/);
        const time = t.match(/(\d+):(\d\d)/);
        return { total: tot && +tot[1], mmss: time && time[0] };
      });
      // 시계는 이미 몇 초 흘렀으므로 올림한다 (21:58 → 22분)
      const mins = real.mmss ? Math.ceil(Number(real.mmss.split(":")[0]) + Number(real.mmss.split(":")[1]) / 60) : null;
      const okN = real.total === c.n;
      const okM = mins !== null && Math.abs(mins - c.m) <= 1;
      if (!okN || !okM) bad++;
      console.log(`  ${round}회차 ${String(c.name).padEnd(9)} 카드 ${c.n}문항 ${c.m}분 → 실제 ${real.total}문항 ${real.mmss}  ${okN && okM ? "✓" : "✗ 어긋남"}`);
    }
  }
  console.log(bad ? `\n어긋남 ${bad}건` : "\n카드가 말한 것과 실제 시험지가 모두 같다");
  await b.close();
})();
