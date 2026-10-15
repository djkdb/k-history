// 필기 PDF 만들기 — node make.mjs <notes.mjs> <이미지 폴더> <출력.pdf> <과목 표시>
// 필요한 것: 같은 폴더에 x1/ (npm pack @fontsource/nanum-pen-script@5.1.0 을 푼 것), 원본 PDF를 pdftoppm -r 96 -jpeg 로 뽑은 그림 폴더.
// 쪽마다: 왼쪽 위 원본 슬라이드, 그 아래 한글 번역, 오른쪽 여백에 손글씨 필기.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire("/home/user/k-history/midterm/package.json");
const { chromium } = require("playwright");

const [notesPath, imgDir, outPdf, course] = process.argv.slice(2);
const { TITLE, PAGES } = await import(pathToFileURL(resolve(notesPath)).href);
const HERE = dirname(new URL(import.meta.url).pathname);
const work = join(HERE, "build");
mkdirSync(work, { recursive: true });

const imgs = readdirSync(imgDir).filter((f) => f.endsWith(".jpg")).sort();
if (imgs.length !== PAGES.length) throw new Error(`쪽 수가 다르다: 그림 ${imgs.length} · 필기 ${PAGES.length}`);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rich = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, "<mark>$1</mark>");
const ICON = { star: "★", warn: "⚠", tip: "💡", ex: "✏" };
const LABEL = { star: "시험", warn: "주의", tip: "이해", ex: "예·풀이" };

const pages = PAGES.map((pg, i) => {
  const ko = pg.ko
    .map((l) => {
      const depth = (l.match(/^ */)[0].length / 2) | 0;
      // "$ " 로 시작하면 SQL·식 한 줄 — 고정폭 글씨로
      if (l.trim().startsWith("$ ")) return `<li class="code d${Math.min(depth, 3)}">${esc(l.trim().slice(2))}</li>`;
      return `<li class="d${Math.min(depth, 3)}">${rich(l.trim())}</li>`;
    })
    .join("");
  const notes = pg.notes
    .map((n, j) => `<li class="n ${n.k}" style="--r:${((i * 7 + j * 5) % 5) - 2}"><span class="ic">${ICON[n.k]}</span><span class="lb">${LABEL[n.k]}</span> ${rich(n.t)}</li>`)
    .join("");
  return `<section class="page">
  <header><span class="crs">${esc(course)}</span><span class="ttl">${esc(TITLE)}</span><span class="pno">p.${pg.p} / ${PAGES.length}</span></header>
  <div class="body">
    <div class="left">
      <img class="slide" src="${pathToFileURL(join(resolve(imgDir), imgs[i])).href}" />
      <div class="ko"><h2>${rich(pg.t)}</h2><ul>${ko}</ul></div>
    </div>
    <aside class="margin">
      <p class="mh">필기 ✍</p>
      <ul>${notes || '<li class="n none">— 넘어가도 되는 쪽</li>'}</ul>
    </aside>
  </div>
</section>`;
});

const fontCss = readFileSync(join(HERE, "x1/package/400.css"), "utf8").replace(/url\(\.\/files\//g, `url(${pathToFileURL(join(HERE, "x1/package/files")).href}/`);
const pre = (w) => pathToFileURL(`/home/user/k-history/midterm/public/fonts/pretendard-${w}.woff2`).href;

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
${fontCss}
@font-face{font-family:Pre;font-weight:400;src:url(${pre(400)})}
@font-face{font-family:Pre;font-weight:600;src:url(${pre(600)})}
@font-face{font-family:Pre;font-weight:700;src:url(${pre(700)})}
@page{size:A4 landscape;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Pre,sans-serif;color:#1f2330;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:297mm;height:210mm;padding:7mm 8mm 6mm;display:flex;flex-direction:column;page-break-after:always;overflow:hidden;background:#fffdf7}
header{display:flex;align-items:center;gap:3mm;font-size:8.5pt;color:#7a7f8c;border-bottom:.3mm solid #e6e1d3;padding-bottom:1.6mm;margin-bottom:3mm}
header .crs{font-weight:700;color:#0e7aa6}
header .ttl{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
header .pno{font-weight:700;color:#1f2330}
.body{flex:1;display:flex;gap:5mm;min-height:0}
.left{width:172mm;display:flex;flex-direction:column;min-height:0}
.slide{width:172mm;height:96.75mm;object-fit:contain;border:.3mm solid #d9d4c5;border-radius:1.5mm;background:#fff;box-shadow:0 .6mm 1.8mm rgba(0,0,0,.08)}
.ko{flex:1;min-height:0;margin-top:3mm;overflow:hidden}
.ko h2{font-size:12.5pt;font-weight:700;color:#14213d;margin-bottom:1.6mm}
.ko ul{list-style:none;font-size:var(--ks,10pt);line-height:1.5}
.ko li{position:relative;padding-left:3.6mm}
.ko li::before{content:"";position:absolute;left:.6mm;top:.62em;width:1.3mm;height:1.3mm;border-radius:50%;background:#9aa3b5}
.ko li.d1{margin-left:4.5mm}.ko li.d2{margin-left:9mm}.ko li.d3{margin-left:13.5mm}
.ko li.d1::before,.ko li.d2::before,.ko li.d3::before{background:none;border:.25mm solid #9aa3b5}
li.code{font-family:Menlo,Consolas,monospace;font-size:.86em;background:#f1efe6;border-radius:1mm;padding:.2mm 1.5mm .2mm 3.6mm;margin:.4mm 0;white-space:pre-wrap;color:#253055}
li.code::before{display:none}
mark{background:linear-gradient(transparent 42%,rgba(255,222,70,.7) 42%);color:inherit;padding:0 .4mm;font-weight:600;border-radius:.6mm}
.margin{flex:1;min-width:0;border-left:.5mm dashed #e3b9b9;padding-left:4mm;font-family:'Nanum Pen Script',cursive;
  background:repeating-linear-gradient(transparent 0 7.6mm,#e9eef7 7.6mm 7.9mm);overflow:hidden}
.mh{font-size:19pt;color:#b04a4a;line-height:1;margin:1mm 0 2.5mm}
.margin ul{list-style:none;font-size:var(--ns,19pt);line-height:1.12}
.n{margin-bottom:3mm;transform:rotate(calc(var(--r) * .25deg));transform-origin:left}
.n .ic{font-family:Pre,sans-serif;font-size:.62em;margin-right:.6mm}
.n .lb{font-size:.8em;padding:0 1.2mm;border-radius:1mm;margin-right:.6mm}
.n mark{font-weight:400;background:linear-gradient(transparent 50%,rgba(255,232,110,.75) 50%)}
.star{color:#c0262d}.star .lb{background:#fde2e2}
.warn{color:#c25c00}.warn .lb{background:#ffe9cc}
.tip{color:#1d56b8}.tip .lb{background:#dde8ff}
.ex{color:#14814b}.ex .lb{background:#d8f3e3}
.none{color:#9aa0ab}
</style></head><body>${pages.join("\n")}
<script>
// 넘치면 글씨를 줄인다 (번역·필기 각각)
for (const pg of document.querySelectorAll('.page')) {
  const ko = pg.querySelector('.ko'), mg = pg.querySelector('.margin');
  for (let s = 10; s > 6.5 && ko.scrollHeight > ko.clientHeight + 1; s -= 0.25) ko.style.setProperty('--ks', s + 'pt');
  for (let s = 19; s > 11 && mg.scrollHeight > mg.clientHeight + 1; s -= 0.5) mg.style.setProperty('--ns', s + 'pt');
}
document.body.dataset.done = '1';
</script></body></html>`;

const htmlPath = join(work, "anno.html");
writeFileSync(htmlPath, html);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage();
await p.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
// 넘침 다시 맞추기 (글꼴이 늦게 붙었을 수 있다)
const over = await p.evaluate(() => {
  const out = [];
  for (const [i, pg] of [...document.querySelectorAll('.page')].entries()) {
    const ko = pg.querySelector('.ko'), mg = pg.querySelector('.margin');
    for (let s = 10; s > 6.5 && ko.scrollHeight > ko.clientHeight + 1; s -= 0.25) ko.style.setProperty('--ks', s + 'pt');
    for (let s = 19; s > 11 && mg.scrollHeight > mg.clientHeight + 1; s -= 0.5) mg.style.setProperty('--ns', s + 'pt');
    if (ko.scrollHeight > ko.clientHeight + 1 || mg.scrollHeight > mg.clientHeight + 1) out.push(i + 1);
  }
  return out;
});
console.log("넘침 남은 쪽:", over.length ? over : "없음");
await p.pdf({ path: outPdf, landscape: true, format: "A4", printBackground: true, preferCSSPageSize: true });
await p.setViewportSize({ width: 1123, height: 794 });
for (const n of (process.env.SHOTS || "").split(",").filter(Boolean)) {
  await p.evaluate((n) => document.querySelectorAll('.page')[n - 1].scrollIntoView(), +n);
  await p.screenshot({ path: join(work, `shot-${n}.png`) });
}
await b.close();
console.log("만듦:", outPdf);
