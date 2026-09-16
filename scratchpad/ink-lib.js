/*
 * 눌러야만 나오는 화면의 글씨 대비를 재는 연장.
 *
 * 훑는 검사기(all-contrast.js)는 주소만 열어 본다. 무언가를 치거나 눌러야
 * 나오는 화면 — 찾은 결과, 채점한 뒤, 스스로 매기는 칸 — 은 통째로
 * 지나친다. 그런 화면은 이 연장으로 직접 걸어 가며 잰다.
 *
 *   const { 재기 } = require("./ink-lib");
 *   await 재기(page, "이름");   // 지금 화면을 잰다
 */
const { PNG } = require("/home/user/k-history/node_modules/pngjs");

function lum([r, g, b]) { const f = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
const ratio = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const COLLECT = () => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const c2 = cv.getContext("2d", { willReadFrequently: true });
  const toRGB = (c) => { c2.clearRect(0, 0, 1, 1); c2.fillStyle = "#000"; c2.fillStyle = c; c2.fillRect(0, 0, 1, 1);
    const d = c2.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lineBoxes = (el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const rs = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.textContent.trim()) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) {
        if (r.width < 1 || r.height < 1) continue;
        rs.push({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
      }
    }
    return rs;
  };
  const out = []; let emoji = 0;
  for (const el of document.querySelectorAll("p, span, li, h1, h2, h3, button, a, td, th, b")) {
    const t = (el.innerText || "").trim();
    if (!t || t.length < 2) continue;
    if (el.querySelector("p, span, div, button, a")) continue;
    const r2 = el.getBoundingClientRect();
    if (r2.width < 4 || r2.height < 4) continue;
    if (r2.bottom < 0 || r2.top > innerHeight) continue;
    if (el.closest("[disabled],[aria-disabled='true']")) continue;
    if (/\p{Extended_Pictographic}/u.test(t)) { emoji++; continue; }
    const px = Math.round(r2.left + Math.min(r2.width / 2, 40));
    const py = Math.round(r2.top + r2.height / 2);
    const hit = document.elementFromPoint(px, py);
    if (!hit || (hit !== el && !el.contains(hit) && !hit.contains(el))) continue;
    const cs = getComputedStyle(el);
    const rects = lineBoxes(el);
    if (!rects.length) continue;
    out.push({ t: t.slice(0, 26), x: px, y: py, rects, rgb: toRGB(cs.color),
      size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight) || 400 });
  }
  return { out, emoji };
};


/**
 * 지금 페이지에 보이는 글씨를 모두 재고, 미달한 것을 찍는다.
 * 돌려주는 값은 [잰 곳 수, 미달 수].
 */
async function 재기(p, 이름, theme) {
  /* 색 전환이 살아 있으면 되돌아오는 도중을 찍는다 — 꺼 두고 잰다 */
  await p.addStyleTag({
    content: "html{scroll-behavior:auto !important}*,*::before,*::after{transition:none !important;animation:none !important}",
  });
  await p.waitForTimeout(80);
  const got = await p.evaluate(COLLECT);
  if (!got.out.length) return [0, 0];
  const on = PNG.sync.read(await p.screenshot());
  await p.addStyleTag({ content: "*{color:transparent !important;text-decoration-color:transparent !important;text-shadow:none !important}" });
  await p.waitForTimeout(120);
  const off = PNG.sync.read(await p.screenshot());
  /* 넣은 style 만 걷어낸다 — 새로고침하면 눌러서 만든 화면이 사라진다 */
  await p.evaluate(() => {
    for (const st of document.querySelectorAll("style"))
      if ((st.textContent || "").includes("color:transparent")) st.remove();
  });
  await p.waitForTimeout(120);
  const pick = (im, x, y) => { x = Math.max(0, Math.min(im.width - 1, x)); y = Math.max(0, Math.min(im.height - 1, y));
    const i = (im.width * y + x) << 2; return [im.data[i], im.data[i + 1], im.data[i + 2]]; };
  let 잼 = 0, 미달 = 0;
  for (const it of got.out) {
    const bg = pick(off, it.x, it.y);
    let best = null, far = -1;
    for (const box of it.rects)
      for (let y = Math.max(0, box.y); y <= Math.min(on.height - 1, box.y + box.h); y++)
        for (let x = Math.max(0, box.x); x <= Math.min(on.width - 1, box.x + box.w); x++) {
          const i = (on.width * y + x) << 2, j = (off.width * y + x) << 2;
          const moved = Math.abs(on.data[i] - off.data[j]) + Math.abs(on.data[i + 1] - off.data[j + 1]) + Math.abs(on.data[i + 2] - off.data[j + 2]);
          if (moved < 12) continue;
          const px = [on.data[i], on.data[i + 1], on.data[i + 2]];
          const d = Math.abs(px[0] - bg[0]) + Math.abs(px[1] - bg[1]) + Math.abs(px[2] - bg[2]);
          if (d > far) { far = d; best = px; }
        }
    const a = it.rgb[3] === undefined ? 1 : it.rgb[3];
    const fg = best ?? [0, 1, 2].map((i) => it.rgb[i] * a + bg[i] * (1 - a));
    const rr = ratio(fg, bg); 잼++;
    const big = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
    const need = big ? 3 : 4.5;
    if (rr >= need) continue;
    미달++;
    console.log(`  ✗ [${theme === "dark" ? "어둡" : "밝음"}] ${rr.toFixed(2)}:1 (${need}) — "${it.t}" ${it.size}px ${it.weight} · ${이름}`);
  }
  return [잼, 미달];
}

module.exports = { 재기, COLLECT, ratio };
