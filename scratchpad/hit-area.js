// 보이는 크기는 그대로 두고 넓힌 "누를 수 있는 범위"가 정말 먹는지 본다.
// getBoundingClientRect 로는 before 로 넓힌 범위가 보이지 않으므로,
// 버튼 밖 8px 지점에서 무엇이 눌리는지를 직접 물어본다.
const { chromium } = require("playwright");
const BASE = process.argv[2], ROUTE = process.argv[3] || "/";
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(BASE + ROUTE, { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const btn = document.querySelector('[aria-label="오른쪽으로 넘기기"]');
    if (!btn) return { found: false };
    const b = btn.getBoundingClientRect();
    const probe = (dx, dy) => {
      const el = document.elementFromPoint(b.left + b.width / 2 + dx, b.top + b.height / 2 + dy);
      return el === btn || btn.contains(el) ? "버튼" : (el?.tagName ?? "없음");
    };
    return {
      found: true,
      size: `${Math.round(b.width)}×${Math.round(b.height)}`,
      한가운데: probe(0, 0),
      위로6px: probe(0, -(b.height / 2 + 6)),
      아래로6px: probe(0, b.height / 2 + 6),
      왼쪽6px: probe(-(b.width / 2 + 6), 0),
      // 넓힌 범위 밖 — 여기는 안 눌려야 정상이다
      위로14px: probe(0, -(b.height / 2 + 14)),
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
