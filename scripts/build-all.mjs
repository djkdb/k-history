/*
 * 다섯 자격증을 한 웹으로 묶는다.
 *
 *   /           현관 — 다섯으로 들어가는 곳
 *   /history    한국사
 *   /comhwal    컴활
 *   /sqld       SQLD
 *   /toeic      토익
 *   /gisa       정보처리기사
 *
 * 앱의 코드를 섞지 않는다. 앱마다 하위 경로(BASE_PATH) 아래로 따로 빌드해
 * 그 결과물을 한 폴더(out-all/)에 모은다. 그래서 각 앱을 단독으로 배포하던
 * 방식은 그대로 살아 있고, 이 스크립트를 쓰지 않으면 아무것도 바뀌지 않는다.
 *
 * 한 주소 안에 다섯이 함께 살아도 서로 섞이지 않는 까닭:
 *   - 기록 저장소 이름이 앱마다 다르다 (khlm · comhwal · sqld · toeic · gisa)
 *   - 서비스 워커는 앱마다 자기 하위 경로만 맡고, 자기 이름표가 붙은 캐시만 지운다
 *   - 현관 워커는 다섯 앱의 길을 건드리지 않는다
 *
 *   node scripts/build-all.mjs
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "out-all");

const APPS = [
  { dir: ".", base: "/history", name: "한국사" },
  { dir: "comhwal", base: "/comhwal", name: "컴활" },
  { dir: "sqld", base: "/sqld", name: "SQLD" },
  { dir: "toeic", base: "/toeic", name: "토익" },
  { dir: "gisa", base: "/gisa", name: "정보처리기사" },
];

function run(cmd, cwd, env) {
  execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
}

/*
 * manifest 를 하위 경로에 맞춘다.
 * start_url 이 "/" 로 남아 있으면 홈 화면에서 정처기를 눌러도 현관이 뜬다.
 */
function fixManifest(file, base) {
  if (!existsSync(file)) return;
  const m = JSON.parse(readFileSync(file, "utf8"));
  const pre = (u) => (typeof u === "string" && u.startsWith("/") ? base + (u === "/" ? "/" : u) : u);
  m.start_url = pre(m.start_url ?? "/");
  m.scope = base + "/";
  m.id = base + "/";
  if (Array.isArray(m.icons)) m.icons = m.icons.map((i) => ({ ...i, src: pre(i.src) }));
  writeFileSync(file, JSON.stringify(m, null, 2) + "\n");
}

/*
 * 글꼴 주소를 하위 경로로 옮긴다.
 *
 * globals.css 의 url(/fonts/...) 는 Next 가 basePath 를 붙여 주지 않는다.
 * 그대로 두면 /gisa 의 화면이 맨 위의 /fonts 를 찾는다. 마침 현관에도 같은
 * 이름의 글꼴이 있어 깨져 보이지는 않지만, 글꼴은 앱마다 그 앱에 쓰인 글자만
 * 남겨 줄인 것이라 남의 것을 쓰면 글자가 빠진다.
 */
function fixCss(dir, base) {
  const cssDir = join(dir, "_next", "static", "css");
  if (!existsSync(cssDir)) return 0;
  let n = 0;
  for (const f of readdirSync(cssDir)) {
    if (!f.endsWith(".css")) continue;
    const p = join(cssDir, f);
    const before = readFileSync(p, "utf8");
    const after = before.replace(/url\((["']?)\/fonts\//g, (_, q) => `url(${q}${base}/fonts/`);
    if (after !== before) {
      writeFileSync(p, after);
      n++;
    }
  }
  return n;
}

/*
 * 하위 경로의 첫 화면 조각.
 *
 * Next 는 /gisa 의 화면 조각을 /gisa.txt 로 찾는데, 내보낸 파일은
 * /gisa/index.txt 다. 없으면 화면을 옮겨 다닐 때마다 404 를 맞고 통째로
 * 다시 그린다. 같은 것을 그 이름으로도 놓아 둔다.
 */
function fixIndexPayload(dest, base) {
  const src = join(dest, "index.txt");
  if (existsSync(src)) cpSync(src, join(OUT, base.slice(1) + ".txt"));
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const app of APPS) {
  const cwd = join(ROOT, app.dir);
  console.log(`\n━━━ ${app.name} → ${app.base}`);
  rmSync(join(cwd, "out"), { recursive: true, force: true });
  run("npm run build", cwd, { BASE_PATH: app.base });
  const dest = join(OUT, app.base.slice(1));
  cpSync(join(cwd, "out"), dest, { recursive: true });
  fixManifest(join(dest, "manifest.json"), app.base);
  console.log(`  글꼴 주소 고친 CSS ${fixCss(dest, app.base)}개`);
  fixIndexPayload(dest, app.base);
  /* 단독 배포용 out/ 을 하위 경로 판으로 남겨 두지 않는다 */
  rmSync(join(cwd, "out"), { recursive: true, force: true });
}

console.log("\n━━━ 현관 → /");
const hub = join(ROOT, "hub");
rmSync(join(hub, "out"), { recursive: true, force: true });
run("npm run build", hub, {
  NEXT_PUBLIC_COMBINED: "1",
  /* 카톡·인스타 미리 보기 그림은 절대 주소여야 한다. 주소를 옮기면 SITE_URL 로 넘긴다 */
  SITE_URL: process.env.SITE_URL || "https://zunte.pages.dev",
  SW_SKIP: APPS.map((a) => a.base + "/").join(","),
});
cpSync(join(hub, "out"), OUT, { recursive: true });
rmSync(join(hub, "out"), { recursive: true, force: true });

console.log(`\n한 웹으로 묶었다 → out-all/  (${APPS.length}개 자격증 + 현관)`);
