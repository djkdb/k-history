// 눈으로 보기 어려운 것들 — 화면 낭독기와 키보드로 쓰는 사람에게 어떻게 보이는가.
//
// 전수조사는 넘침과 탭 타깃 크기를 보지만, 제목 단계·이름 없는 단추·
// 글씨 대비·포커스 표시는 보지 않았다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.resolve("gisa/out");
const BASE = process.argv[2] || "http://127.0.0.1:4960";
let bad = 0, warn = 0;
const no = (s) => { bad++; console.log("  ✗ " + s); };
const wa = (s) => { warn++; console.log("  ⚠️  " + s); };

// 상대 휘도 → 대비비 (WCAG)
function lum(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const parse = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const routes = walk(OUT).filter((f) => f.endsWith(".html") && !f.includes("/_next/"))
    .map((f) => "/" + path.relative(OUT, f).replace(/\.html$/, "").replace(/\/?index$/, ""))
    .map((r) => (r === "" ? "/" : r));

  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript((t) => { try { localStorage.setItem("gisa:theme", t);
      if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
        settings:{track:"written",examDate:null},stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
        studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],
        wrongIds:[],mockAttempts:[]}})); } catch {} }, theme);
    const p = await ctx.newPage();
    console.log(`\n[${theme === "dark" ? "어두운" : "밝은"} 화면]`);
    const seenIssue = new Set();
    const gradientUnsure = [];

    for (const r of routes) {
      await p.goto(BASE + r, { waitUntil: "networkidle" }).catch(() => {});
      await p.waitForTimeout(200);

      const out = await p.evaluate(() => {
        const res = { noName: [], headings: [], lowContrast: [], noLang: false, title: document.title };
        res.noLang = document.documentElement.lang !== "ko";
        // 이름 없는 조작 요소
        for (const el of document.querySelectorAll("button, a[href], input, textarea, select")) {
          const txt = (el.innerText || "").trim();
          const aria = el.getAttribute("aria-label") || el.getAttribute("title") || "";
          const ph = el.getAttribute("placeholder") || "";
          if (!txt && !aria && !ph) {
            const r2 = el.getBoundingClientRect();
            if (r2.width > 0 && r2.height > 0)
              res.noName.push(el.tagName.toLowerCase() + "." + (el.className || "").toString().slice(0, 30));
          }
        }
        // 제목 단계
        res.headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
        /*
         * 글씨 대비.
         *
         * ⚠️ 처음 쓴 판은 두 가지를 틀렸다.
         *   ① 알파를 버렸다. bg-white/5 인 rgba(255,255,255,0.05) 를 순백으로
         *      읽어, 어두운 바탕 위의 회색 글씨를 "흰 바탕 위 회색" 으로 쟀다.
         *   ② 그라디언트를 못 봤다. backgroundColor 가 투명이라 위로 올라가
         *      페이지 바탕을 잡았고, 인디고 단추 위의 흰 글씨를 1.00:1 로 쟀다.
         * 그래서 멀쩡한 곳 530군데를 문제라고 적었다. 알파를 제대로 겹쳐 쌓고,
         * 그라디언트가 끼면 "잴 수 없다" 고 따로 적는다.
         */
        const num = (c) => (c.match(/[\d.]+/g) || []).map(Number);
        const over = (top, bottom) => {
          // top 을 bottom 위에 겹친다 (알파 합성)
          const a = top[3] === undefined ? 1 : top[3];
          return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a));
        };
        const bgOf = (el) => {
          const layers = [];
          let n = el;
          let gradient = false;
          while (n && n !== document.documentElement) {
            const cs = getComputedStyle(n);
            if (cs.backgroundImage && cs.backgroundImage !== "none") gradient = true;
            const c = num(cs.backgroundColor);
            if (c.length >= 3) {
              const a = c[3] === undefined ? 1 : c[3];
              if (a > 0) {
                layers.push(c);
                if (a >= 0.999) break;   // 불투명한 층을 만나면 그 아래는 안 보인다
              }
            }
            n = n.parentElement;
          }
          const root = num(getComputedStyle(document.documentElement).backgroundColor);
          let base = root.length >= 3 && (root[3] === undefined || root[3] > 0.999)
            ? root.slice(0, 3) : [255, 255, 255];
          for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
          return { bg: base, gradient };
        };
        for (const el of document.querySelectorAll("p, span, li, h1, h2, h3, button, a")) {
          const t = (el.innerText || "").trim();
          if (!t || t.length < 2) continue;
          if (el.querySelector("p, span, div")) continue;   // 안쪽에 글이 또 있으면 건너뛴다
          const cs = getComputedStyle(el);
          const size = parseFloat(cs.fontSize);
          const weight = parseInt(cs.fontWeight) || 400;
          const { bg, gradient } = bgOf(el);
          const fgRaw = num(cs.color);
          const fg = over(fgRaw, bg);   // 글씨에도 알파가 있을 수 있다
          res.lowContrast.push({ t: t.slice(0, 28), fg, bg, size, weight, gradient });
        }
        return res;
      });

      if (out.noLang && !seenIssue.has("lang")) { seenIssue.add("lang"); no(`문서 언어가 ko 가 아니다 (${r})`); }
      if (!out.title && !seenIssue.has("title")) { seenIssue.add("title"); no(`문서 제목이 비었다 (${r})`); }
      for (const n of new Set(out.noName)) {
        const key = "name:" + n;
        if (!seenIssue.has(key)) { seenIssue.add(key); no(`이름 없는 조작 요소 ${n} (${r})`); }
      }
      // 제목이 h1 로 시작하고 단계를 건너뛰지 않는가
      if (out.headings.length) {
        if (out.headings[0] !== 1 && !seenIssue.has("h1:" + r)) { seenIssue.add("h1:" + r); wa(`${r} 의 첫 제목이 h${out.headings[0]} 다`); }
        for (let i = 1; i < out.headings.length; i++) {
          if (out.headings[i] - out.headings[i - 1] > 1) {
            const k = "skip:" + r;
            if (!seenIssue.has(k)) { seenIssue.add(k); wa(`${r} 에서 제목 단계가 h${out.headings[i-1]} → h${out.headings[i]} 로 건너뛴다`); }
          }
        }
      }
      for (const c of out.lowContrast) {
        if (c.fg.length < 3 || c.bg.length < 3) continue;
        const rr = ratio(c.fg, c.bg);
        const big = c.size >= 24 || (c.size >= 18.66 && c.weight >= 700);
        const need = big ? 3 : 4.5;
        if (rr >= need) continue;
        const key = c.t + c.fg.join();
        if (seenIssue.has(key)) continue;
        seenIssue.add(key);
        // 그라디언트가 끼면 계산한 바탕색이 실제와 다를 수 있다 — 단정하지 않는다
        if (c.gradient) gradientUnsure.push(`"${c.t}" (${r})`);
        else no(`대비 ${rr.toFixed(2)}:1 (${need} 필요) — "${c.t}" ${Math.round(c.size)}px (${r})`);
      }
    }
    if (gradientUnsure.length)
      console.log(`  · 그라디언트 위라 계산으로는 잴 수 없는 글씨 ${gradientUnsure.length}곳 — 그림으로 따로 본다`);
    await ctx.close();
  }
  await b.close();
  console.log(bad ? `\n문제 ${bad}건 · 확인 필요 ${warn}건` : `\n✓ 이름·언어·대비 이상 없음 (확인 필요 ${warn}건)`);
  process.exit(bad ? 1 : 0);
})();
