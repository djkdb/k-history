// 홈 화면에 얹어 앱처럼 쓸 수 있는가 — manifest 와 아이콘을 실제로 확인한다.
const fs = require("fs");
const path = require("path");
const OUT = path.resolve("gisa/out");
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

const m = JSON.parse(fs.readFileSync(path.join(OUT, "manifest.json"), "utf8"));
for (const k of ["name", "short_name", "start_url", "display", "icons"]) {
  m[k] ? ok(`manifest.${k} = ${Array.isArray(m[k]) ? m[k].length + "개" : m[k]}`) : no(`manifest 에 ${k} 가 없다`);
}
if (m.display !== "standalone") no(`display 가 "${m.display}" 다 — standalone 이라야 앱처럼 뜬다`);

// 아이콘 파일이 실제로 있고 크기가 맞는가
const PNG = (f) => {
  const b = fs.readFileSync(f);
  if (b.slice(1, 4).toString() !== "PNG") return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length };
};
for (const i of m.icons) {
  const f = path.join(OUT, i.src.replace(/^\//, ""));
  if (!fs.existsSync(f)) { no(`아이콘 파일이 없다: ${i.src}`); continue; }
  if (i.src.endsWith(".svg")) { ok(`${i.src} (SVG, ${fs.statSync(f).size}바이트)`); continue; }
  const d = PNG(f);
  if (!d) { no(`${i.src} 가 PNG 가 아니다`); continue; }
  const want = (i.sizes || "").split("x").map(Number);
  if (want.length === 2 && (d.w !== want[0] || d.h !== want[1]))
    no(`${i.src} 는 ${d.w}x${d.h} 인데 manifest 는 ${i.sizes} 라고 한다`);
  else ok(`${i.src} ${d.w}x${d.h} (${Math.round(d.bytes / 1024)}KB)`);
}
const maskable = m.icons.some((i) => (i.purpose || "").includes("maskable"));
maskable ? ok("maskable 아이콘이 있다 (안드로이드에서 잘려 보이지 않는다)") : no("maskable 아이콘이 없다");

// iOS 는 manifest 아이콘을 보지 않는다 — apple-touch-icon 이 따로 있어야 한다
const apple = path.join(OUT, "apple-touch-icon.png");
if (fs.existsSync(apple)) {
  const d = PNG(apple);
  d && d.w >= 180 ? ok(`apple-touch-icon ${d.w}x${d.h}`) : no(`apple-touch-icon 이 ${d ? d.w + "px" : "PNG 가 아니다"} — 180px 이상이 좋다`);
} else no("apple-touch-icon.png 이 없다 — iOS 홈 화면에 화면 축소본이 박힌다");

// 첫 화면 HTML 이 그것들을 실제로 가리키는가
const html = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
/rel="manifest"/.test(html) ? ok("HTML 이 manifest 를 가리킨다") : no("HTML 에 manifest 링크가 없다");
/apple-touch-icon/.test(html) ? ok("HTML 이 apple-touch-icon 을 가리킨다") : no("HTML 에 apple-touch-icon 링크가 없다");
/name="theme-color"|themeColor/.test(html) ? ok("theme-color 가 있다") : no("theme-color 가 없다");

// 글꼴이 실제로 담겨 있는가 (오프라인에서 글씨가 깨지지 않게)
const fonts = fs.readdirSync(path.join(OUT, "fonts")).filter((f) => f.endsWith(".woff2"));
fonts.length >= 4 ? ok(`글꼴 ${fonts.length}개가 함께 나간다`) : no(`글꼴이 ${fonts.length}개뿐이다`);

console.log(bad ? `\n문제 ${bad}건` : "\n✓ 앱처럼 설치할 준비가 되어 있다");
process.exit(bad ? 1 : 0);
