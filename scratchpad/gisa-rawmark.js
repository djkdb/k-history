// 화면 글 어디에도 날것 마크다운이 남지 않았는가.
// 코드 조각(<code>) 안의 별표는 C 문법이므로 세지 않는다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { CONCEPTS } = jiti("/home/user/k-history/gisa/src/data/concepts.ts");
const BASE = "http://127.0.0.1:4511";
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  let bad = 0;
  for (const c of CONCEPTS) {
    await p.goto(`${BASE}/concept/${c.id}`, { waitUntil: "domcontentloaded" });
    const left = await p.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return "";
      const clone = main.cloneNode(true);
      clone.querySelectorAll("code, pre").forEach((n) => n.remove());
      return clone.textContent || "";
    });
    const hits = left.match(/\*\*|`/g);
    if (hits) { bad++; console.log(`  ✗ ${c.id} 에 날것 기호 ${hits.join("")} 가 남았다`); }
  }
  console.log(bad ? `\n남은 화면 ${bad}개` : `\n✓ 개념 ${CONCEPTS.length}개 전부 깨끗하다`);
  await b.close();
  process.exit(bad ? 1 : 0);
})();
