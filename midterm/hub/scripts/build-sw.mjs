/*
 * 서비스 워커에 "미리 받아 둘 것" 목록을 박아 넣는다.
 *
 * ⚠️ 여태 미리 받아 두는 것은 홈 문서와 아이콘뿐이었다. CSS 와 자바스크립트는
 *    한 줄도 없었다. 첫 방문 때 그 파일들은 서비스 워커가 아직 화면을 쥐기
 *    전에 받아 오므로 워커를 거치지 않고, 따라서 캐시에 남지 않는다.
 *
 *    그래서 앱을 깔고 바로 망을 끊으면 화면이 뼈대만 남았다 — 한국사 홈이
 *    "홈학습퀴즈기출복습검색" 열한 글자였다. 아래 길잡이 막대의 글자들만
 *    HTML 에 있었던 것이다. 지하철에서 처음 열어 보는 사람이 겪을 일이다.
 *
 * 그래서 빌드가 끝난 뒤 out/ 을 훑어 실제로 나간 파일 목록을 만들어 sw.js 에
 * 박는다. 손으로 적으면 파일 이름에 붙는 해시가 바뀔 때마다 어긋난다.
 *
 * 담는 것   : 화면 문서(html), 화면 이동용 조각(txt), _next/static 전부,
 *             아이콘·글꼴·manifest, sql-wasm 같은 실행에 필요한 것
 * 빼는 것   : 사진(webp·jpg·png 중 아이콘이 아닌 것)·소리. 한국사의 기출
 *             시험지 그림만 81MB 다. 그것까지 미리 받으면 앱을 까는 데
 *             데이터를 다 쓴다. 한 번 열어 본 것은 그때 캐시에 남는다.
 *
 *   node scripts/build-sw.mjs        (앱 폴더에서 실행 — out/ 을 본다)
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createHash } from "node:crypto";

const OUT = join(process.cwd(), "out");
if (!existsSync(OUT)) {
  console.error("out/ 이 없다. next build 를 먼저 돌려야 한다.");
  process.exit(1);
}

/** 미리 받아 둘 확장자 */
const 담을확장자 = new Set(["html", "txt", "js", "css", "json", "woff2", "woff", "wasm", "svg"]);
/** 아이콘만은 그림이어도 담는다 — 홈 화면 아이콘이 없으면 앱처럼 보이지 않는다 */
const 아이콘 = /^\/(icon|apple-touch-icon|favicon)[^/]*\.(png|ico)$/;

const 목록 = [];
let 바이트 = 0;
(function 훑기(dir) {
  for (const 이름 of readdirSync(dir)) {
    const 자리 = join(dir, 이름);
    const st = statSync(자리);
    if (st.isDirectory()) { 훑기(자리); continue; }
    const 길 = "/" + relative(OUT, 자리).split(sep).join("/");
    const 확장 = (이름.split(".").pop() || "").toLowerCase();
    if (!담을확장자.has(확장) && !아이콘.test(길)) continue;
    목록.push(길);
    바이트 += st.size;
  }
})(OUT);

/*
 * 화면 문서는 주소로도 닿을 수 있어야 한다.
 * /learn.html 을 담아 두어도 사용자가 가는 곳은 /learn 이다. 둘 다 담는다.
 */
/*
 * 화면 문서는 사용자가 실제로 가는 주소(/learn)로만 담는다.
 *
 * ⚠️ 처음에는 /learn 과 /learn.html 을 둘 다 담았다. 그런데 Cloudflare 는
 *    /learn.html 을 /learn 으로 돌려보낸다(308). 그래서 화면마다 요청이 한 번씩
 *    헛돌았고, 돌려보내진 응답이 캐시에 남았다 — 크롬은 돌려보내진 응답을
 *    화면 이동에 내주면 거부한다. 미리 받는 양도 거의 두 배였다.
 */
const 주소 = new Set();
for (const 길 of 목록) {
  if (!길.endsWith(".html")) { 주소.add(길); continue; }
  if (길 === "/404.html" || 길.endsWith("/_not-found.html")) continue;
  주소.add(길 === "/index.html" ? "/" : 길.replace(/\/index\.html$/, "/").replace(/\.html$/, ""));
}
/*
 * 하위 경로 아래로 빌드했다면(BASE_PATH=/gisa) 실제로 요청되는 주소도
 * 그 아래다. out/ 안의 경로에 앞머리를 붙인다.
 */
const BASE = process.env.BASE_PATH ?? "";
const 최종 = [...주소]
  .map((u) => (BASE ? (u === "/" ? BASE + "/" : BASE + u) : u))
  .sort();
/* 맨 위 현관이 남의 앱 길까지 덮지 않게 — "/gisa/,/sqld/" 꼴로 받는다 */
const 남의길 = (process.env.SW_SKIP ?? "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

/* 판이 바뀌면 캐시 이름도 바뀌어야 옛 조각이 남지 않는다 */
const 판 = createHash("sha1").update(최종.join("|")).digest("hex").slice(0, 8);

const SW = join(OUT, "sw.js");
if (!existsSync(SW)) {
  console.error("out/sw.js 가 없다. public/sw.js 가 빌드에 실려야 한다.");
  process.exit(1);
}
let s = readFileSync(SW, "utf8");
/*
 * ⚠️ 자리 표시는 따옴표까지 붙여서 찾는다.
 *    처음에는 "__BUILD__" 글자만 찾아 처음 나온 한 곳을 바꿨는데, 파일 맨 위
 *    주석에 같은 글자가 먼저 나와서 정작 캐시 이름은 한 번도 안 바뀌었다
 *    (빌드 결과가 늘 "gisa-__BUILD__" 였다). 바꾼 뒤 남은 것이 없는지도 본다.
 */
const 자리_목록 = "/* __PRECACHE__ */";
const 자리_판 = '"__BUILD__"';
if (!s.includes(자리_목록) || !s.includes(자리_판)) {
  console.error("sw.js 에 자리 표시(/* __PRECACHE__ */ · \"__BUILD__\")가 없다.");
  process.exit(1);
}
s = s.replace(자리_목록, 최종.map((u) => JSON.stringify(u)).join(",\n  "));
s = s.split(자리_판).join(JSON.stringify(판));
s = s.split('"__BASE__"').join(JSON.stringify(BASE));
s = s.split('["__SKIP__"]').join(JSON.stringify(남의길));
if (
  s.includes(자리_목록) ||
  s.includes(자리_판) ||
  s.includes('"__BASE__"') ||
  s.includes('["__SKIP__"]')
) {
  console.error("sw.js 에 채우지 못한 자리 표시가 남았다.");
  process.exit(1);
}
writeFileSync(SW, s);

console.log(
  `${BASE || "/"} · 미리 받아 둘 것 ${최종.length}개 · ${(바이트 / 1048576).toFixed(1)}MB · 판 ${판}`,
);
