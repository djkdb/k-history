// 화면이 가로로 흔들릴 때, 무엇이 삐져나가는지 짚어 준다.
//
// 두 가지가 섞여 있어서 한 가지 방법으로는 못 찾는다.
//   ① 요소 상자가 화면 밖에 있다 (애니메이션 초기값, min-width:auto 인 flex 자식)
//   ② 상자는 안에 있는데 내용이 넘친다 (줄바꿈이 안 되는 긴 낱말)
//
//   node overflow-who.js <주소> <경로>
const { chromium } = require("playwright");
const BASE = process.argv[2], ROUTE = process.argv[3] || "/";
const WIDTH = Number(process.argv[4] || 390);

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await (await b.newContext({ viewport: { width: WIDTH, height: 844 } })).newPage();
  await p.goto(BASE + ROUTE, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  const r = await p.evaluate(() => {
    const de = document.scrollingElement, W = de.clientWidth;
    const clippedBy = (el) => {
      for (let q = el.parentElement; q; q = q.parentElement) {
        const o = getComputedStyle(q).overflowX;
        if (o === "hidden" || o === "auto" || o === "scroll" || o === "clip") return true;
      }
      return false;
    };
    const boxes = [], texts = [];
    for (const el of document.querySelectorAll("*")) {
      const bb = el.getBoundingClientRect();
      // ① 상자가 화면 밖
      if (bb.width > 0 && bb.right > W + 0.5 && !clippedBy(el)) {
        const st = getComputedStyle(el);
        boxes.push(`<${el.tagName.toLowerCase()} class="${(el.className||"").toString().slice(0,44)}"> 끝=${Math.round(bb.right)} 폭=${Math.round(bb.width)} min-width=${st.minWidth}`);
      }
      // ② 내용이 넘침 — 제일 안쪽 것만 뜻이 있다
      if (el.scrollWidth > el.clientWidth + 1 &&
          !["auto","scroll","hidden","clip"].includes(getComputedStyle(el).overflowX) &&
          ![...el.children].some((c) => c.scrollWidth > c.clientWidth + 1)) {
        texts.push(`<${el.tagName.toLowerCase()}> 칸 ${el.clientWidth} < 내용 ${el.scrollWidth} — "${(el.textContent||"").trim().slice(0,70)}"`);
      }
    }
    return { over: de.scrollWidth - W, W, boxes: [...new Set(boxes)].slice(0,6), texts: [...new Set(texts)].slice(0,6) };
  });

  console.log(`${ROUTE} — 넘침 ${r.over}px (화면 ${r.W}px)`);
  if (r.boxes.length) { console.log("  상자가 화면 밖:"); r.boxes.forEach((s) => console.log("    " + s)); }
  if (r.texts.length) { console.log("  내용이 칸을 넘침:"); r.texts.forEach((s) => console.log("    " + s)); }
  if (!r.boxes.length && !r.texts.length) console.log("  삐져나간 것 없음");
  await b.close();
})();
