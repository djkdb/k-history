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
const { PNG } = require("/home/user/k-history/node_modules/pngjs");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-search-ink.js <주소>"); process.exit(1); }
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
        const got = await p.evaluate(COLLECT);
        if (!got.out.length) continue;
        const on = PNG.sync.read(await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 844 } }));
        await p.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important}" });
        await p.waitForTimeout(120);
        const off = PNG.sync.read(await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 844 } }));
        await p.evaluate(() => { const s = [...document.querySelectorAll("style")].pop(); if (s) s.remove(); });
        const pick = (im, x, y) => { x = Math.max(0, Math.min(im.width - 1, x)); y = Math.max(0, Math.min(im.height - 1, y));
          const i = (im.width * y + x) << 2; return [im.data[i], im.data[i + 1], im.data[i + 2]]; };
        for (const it of got.out) {
          const bg = pick(off, it.x, it.y);
          let best = null, far = -1;
          for (const box of it.rects) {
            for (let y = Math.max(0, box.y); y <= Math.min(843, box.y + box.h); y++)
              for (let x = Math.max(0, box.x); x <= Math.min(389, box.x + box.w); x++) {
                const i = (on.width * y + x) << 2, j = (off.width * y + x) << 2;
                const moved = Math.abs(on.data[i] - off.data[j]) + Math.abs(on.data[i + 1] - off.data[j + 1]) + Math.abs(on.data[i + 2] - off.data[j + 2]);
                if (moved < 12) continue;
                const px = [on.data[i], on.data[i + 1], on.data[i + 2]];
                const d = Math.abs(px[0] - bg[0]) + Math.abs(px[1] - bg[1]) + Math.abs(px[2] - bg[2]);
                if (d > far) { far = d; best = px; }
              }
          }
          const a = it.rgb[3] === undefined ? 1 : it.rgb[3];
          const fg = best ?? [0, 1, 2].map((i) => it.rgb[i] * a + bg[i] * (1 - a));
          const rr = ratio(fg, bg); total++;
          const big = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
          const need = big ? 3 : 4.5;
          if (rr >= need) continue;
          bad++;
          console.log(`  ✗ [${theme === "dark" ? "어둡" : "밝음"}] ${rr.toFixed(2)}:1 (${need}) — "${it.t}" ${it.size}px ${it.weight} · "${말}"`);
        }
      }
    }
    await ctx.close();
  }
  await b.close();
  console.log(`찾은 결과 화면 글씨 ${total}곳`);
  console.log(bad ? `대비 미달 ${bad}건` : "✓ 대비 이상 없음");
  process.exit(bad ? 1 : 0);
})();
