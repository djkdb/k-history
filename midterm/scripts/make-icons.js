/**
 * 과목마다 앱 아이콘을 만든다 — assets/<과목>/ 에 SVG 와 PNG.
 *
 * 홈 화면에 다섯 과목을 따로 얹을 수 있으므로 아이콘이 서로 달라야 한다.
 * 그림 대신 과목 약자(DB·ML…)와 과목 색을 쓴다 — 작게 줄어도 읽힌다.
 *
 *   node scripts/make-icons.js
 *
 * iOS 는 manifest 아이콘을 보지 않아 apple-touch-icon 이 따로 필요하고,
 * 안드로이드 크롬은 192·512 PNG 가 있어야 설치를 제안한다.
 */
const { chromium } = require("../../node_modules/playwright");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const COURSES = require(path.join(ROOT, "courses.json"));
const FONT = fs.readFileSync(path.join(ROOT, "public/fonts/pretendard-700.woff2")).toString("base64");

function svg(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#09090b"/>
  <rect x="40" y="40" width="432" height="432" rx="88" fill="${c.color}" fill-opacity="0.22" stroke="${c.color}" stroke-width="10"/>
  <text x="256" y="300" text-anchor="middle" font-family="Pretendard, Arial, sans-serif" font-weight="700" font-size="${c.mark.length > 2 ? 150 : c.mark.length === 1 ? 240 : 190}" fill="#fafafa" letter-spacing="-6">${c.mark}</text>
  <text x="256" y="392" text-anchor="middle" font-family="Pretendard, Arial, sans-serif" font-weight="700" font-size="58" fill="${c.color}">${c.id === "hub" ? "과목" : "중간고사"}</text>
</svg>`;
}

function page(c, size, inset, bg) {
  const pad = Math.round(size * inset);
  return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Pretendard;src:url(data:font/woff2;base64,${FONT});font-weight:700}
html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden;background:${bg}}
body{display:grid;place-items:center} svg{width:${size - pad * 2}px;height:${size - pad * 2}px;display:block}
</style>${svg(c)}`;
}

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  // 첫 화면(현관)도 아이콘이 따로 있어야 과목 아이콘과 헷갈리지 않는다
  const 현관 = { id: "hub", mark: "5", color: "#6366f1" };
  for (const c of [...COURSES, 현관]) {
    const dir = c.id === "hub" ? path.join(ROOT, "hub", "public") : path.join(ROOT, "assets", c.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "icon.svg"), svg(c));
    for (const t of [
      { file: "icon-192.png", size: 192, inset: 0, bg: "transparent" },
      { file: "icon-512.png", size: 512, inset: 0, bg: "transparent" },
      { file: "icon-maskable-512.png", size: 512, inset: 0.1, bg: "#09090b" },
      { file: "apple-touch-icon.png", size: 180, inset: 0, bg: "#09090b" },
    ]) {
      const p = await browser.newPage({ viewport: { width: t.size, height: t.size } });
      await p.setContent(page(c, t.size, t.inset, t.bg));
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: path.join(dir, t.file), omitBackground: t.bg === "transparent" });
      await p.close();
    }
    console.log("아이콘", c.id);
  }
  await browser.close();
})();
