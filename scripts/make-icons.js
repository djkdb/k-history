/**
 * 앱 아이콘 만들기 — SVG 하나에서 필요한 PNG 를 뽑는다.
 *
 * 왜 PNG 도 필요한가.
 *   - 안드로이드 크롬은 192·512 크기의 아이콘이 있어야 "앱으로 설치"를
 *     제안한다. SVG 만 두면 설치 안내가 아예 안 뜨는 기기가 있다.
 *   - iOS 는 manifest 의 아이콘을 아예 보지 않는다. apple-touch-icon 이
 *     없으면 홈 화면에 앱 아이콘 대신 화면을 축소한 그림이 박힌다.
 *   - maskable 은 기기가 아이콘을 동그라미·사각형으로 잘라내는 것에
 *     대비한 것이다. 가장자리가 잘려도 되도록 여백을 넉넉히 준다.
 *
 *   node scripts/make-icons.js
 */
const { chromium } = require(require("node:path").join(__dirname, "..", "node_modules", "playwright"));
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const PUB = path.join(ROOT, "public");
const svg = fs.readFileSync(path.join(PUB, "icon.svg"), "utf8");

/** @param {number} size @param {number} inset 0~0.5, 가장자리를 비우는 비율 */
function page(size, inset, bg) {
  const pad = Math.round(size * inset);
  return `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;width:${size}px;height:${size}px;overflow:hidden}
  body{background:${bg};display:grid;place-items:center}
  svg{width:${size - pad * 2}px;height:${size - pad * 2}px;display:block}
</style>${svg}`;
}

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const targets = [
    // 안드로이드 설치 조건 — 이 둘이 있어야 크롬이 설치를 제안한다
    { file: "icon-192.png", size: 192, inset: 0, bg: "transparent" },
    { file: "icon-512.png", size: 512, inset: 0, bg: "transparent" },
    // 잘려도 되는 판 — 가장자리 10% 를 비운다
    { file: "icon-maskable-512.png", size: 512, inset: 0.1, bg: "#09090b" },
    // iOS 홈 화면 — 투명을 검게 칠하므로 배경을 직접 준다
    { file: "apple-touch-icon.png", size: 180, inset: 0, bg: "#09090b" },
  ];

  for (const t of targets) {
    const ctx = await browser.newContext({
      viewport: { width: t.size, height: t.size },
      deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    await p.setContent(page(t.size, t.inset, t.bg), { waitUntil: "load" });
    await p.waitForTimeout(120);
    const buf = await p.screenshot({
      omitBackground: t.bg === "transparent",
      type: "png",
    });
    fs.writeFileSync(path.join(PUB, t.file), buf);
    console.log(`  ${t.file}  ${t.size}px  ${(buf.length / 1024).toFixed(1)}KB`);
    await ctx.close();
  }
  await browser.close();
})();
