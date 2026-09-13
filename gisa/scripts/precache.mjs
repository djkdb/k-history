/**
 * 빌드 결과를 서비스 워커의 미리 담을 목록에 박아 넣는다.
 *
 * 왜 필요한가 — 서비스 워커는 페이지가 다 뜬 뒤에야 그 페이지를 넘겨받는다.
 * 그래서 처음 들어온 사람은 화면을 이루는 자바스크립트가 캐시에 담기지 않고,
 * 곧바로 지하철에 들어가면 앱이 열리지 않는다. 두 번째 방문부터만 되는 셈이다.
 *
 * 조각 파일 이름에는 빌드마다 바뀌는 해시가 붙어 sw.js 에 손으로 적을 수 없다.
 * 그래서 빌드가 끝난 뒤 여기서 실제 파일 목록을 읽어 out/sw.js 를 고쳐 쓴다.
 * (원본 public/sw.js 는 건드리지 않는다)
 *
 *   node scripts/precache.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "out");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// 화면을 그리는 데 꼭 필요한 것 — 자바스크립트·스타일시트·글꼴
const assets = walk(join(OUT, "_next", "static"))
  .filter((p) => /\.(js|css)$/.test(p))
  .map((p) => "/" + relative(OUT, p).split("\\").join("/"));

// 각 화면의 HTML — 주소를 직접 열어도 오프라인에서 뜨도록
const pages = walk(OUT)
  .filter((p) => p.endsWith(".html"))
  .map((p) => {
    const rel = "/" + relative(OUT, p).split("\\").join("/");
    return rel === "/index.html" ? "/" : rel.replace(/\.html$/, "");
  });

// Next 가 화면끼리 옮겨 다닐 때 쓰는 짝 파일(.txt).
// 이것이 없으면 오프라인에서 링크를 누를 때마다 통째로 새로 그린다.
const rsc = walk(OUT)
  .filter((p) => p.endsWith(".txt"))
  .map((p) => "/" + relative(OUT, p).split("\\").join("/"));

const base = ["/", "/manifest.json", "/icon.svg"];
const fonts = [400, 500, 600, 700].map((w) => `/fonts/pretendard-${w}.woff2`);

const list = [...new Set([...base, ...fonts, ...pages, ...rsc, ...assets])];

const swPath = join(OUT, "sw.js");
let sw = readFileSync(swPath, "utf8");

const replaced = sw.replace(
  /const PRECACHE = \[[\s\S]*?\];/,
  `const PRECACHE = ${JSON.stringify(list, null, 2)};`,
);
if (replaced === sw) {
  console.error("sw.js 에서 PRECACHE 목록을 찾지 못했습니다");
  process.exit(1);
}
writeFileSync(swPath, replaced);

const bytes = assets.reduce((n, a) => n + statSync(join(OUT, a)).size, 0);
console.log(
  `미리 담을 것 ${list.length}개 (화면 ${pages.length} · 이동용 ${rsc.length} · 자원 ${assets.length} · ${(bytes / 1024 / 1024).toFixed(1)}MB)`,
);
