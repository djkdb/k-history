/*
 * 중간고사 다섯 과목을 한 웹으로 묶는다.
 *
 *   /      현관 — 다섯 과목으로 들어가는 곳 (hub/)
 *   /db    데이터베이스시스템
 *   /ml    머신러닝
 *   /se    소프트웨어공학
 *   /cs    컴퓨터시스템개론
 *   /ir    정보검색
 *
 * 과목 앱은 엔진 하나다. 과목마다 NEXT_PUBLIC_COURSE 와 BASE_PATH 를 바꿔
 * 따로 빌드하고 out-all/<과목>/ 에 모은다. 자료(src/courses/<과목>/)가 아직
 * 없는 과목은 건너뛰고, 현관에는 "준비 중" 으로 나온다.
 *
 * 한 주소에 다섯이 살아도 섞이지 않는 까닭:
 *   - 기록 저장소 이름이 과목마다 다르다 (mid-db · mid-ml …)
 *   - 서비스 워커는 과목마다 자기 하위 경로만 맡고, 자기 이름표가 붙은 캐시만 지운다
 *   - 현관 워커는 과목의 길을 건드리지 않는다
 *
 *   node scripts/build-all.mjs        (midterm/ 에서)
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createJiti } from "jiti";

const ROOT = process.cwd();
const OUT = join(ROOT, "out-all");
const COURSES = JSON.parse(readFileSync(join(ROOT, "courses.json"), "utf8"));
const jiti = createJiti(import.meta.url, { alias: { "@": join(ROOT, "src") } });

function run(cmd, cwd, env) {
  execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
}

/* 글꼴 주소 — CSS 의 url(/fonts/…) 에는 Next 가 하위 경로를 붙여 주지 않는다 */
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

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const 카드 = [];
// 통합 캘린더(현관 /plan)가 쓰는 범위 — 장 순서 · 개념 · 개념별 문제 id
const 범위 = [];
for (const c of COURSES) {
  const dataFile = join(ROOT, "src", "courses", c.id, "index.ts");
  if (!existsSync(dataFile)) {
    console.log(`\n━━━ ${c.name} — 자료가 아직 없어 건너뜀`);
    카드.push({ ...c, ready: false, chapters: 0, concepts: 0, questions: 0, examDate: null });
    continue;
  }
  const data = (await jiti.import(dataFile)).default;
  const base = `/${c.id}`;
  console.log(`\n━━━ ${c.name} → ${base}  (개념 ${data.concepts.length} · 문제 ${data.questions.length})`);
  rmSync(join(ROOT, "out"), { recursive: true, force: true });
  run("npx next build", ROOT, { NEXT_PUBLIC_COURSE: c.id, BASE_PATH: base });

  // 과목 아이콘과 manifest — 홈 화면에 과목마다 따로 얹을 수 있게
  const out = join(ROOT, "out");
  for (const f of readdirSync(join(ROOT, "assets", c.id))) cpSync(join(ROOT, "assets", c.id, f), join(out, f), { recursive: true });
  writeFileSync(
    join(out, "manifest.json"),
    JSON.stringify(
      {
        name: `${c.name} 중간고사`,
        short_name: c.short,
        start_url: base + "/",
        scope: base + "/",
        id: base + "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#09090b",
        icons: [
          { src: `${base}/icon-192.png`, sizes: "192x192", type: "image/png" },
          { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png" },
          { src: `${base}/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`  글꼴 주소 고친 CSS ${fixCss(out, base)}개`);
  // 서비스 워커의 미리 받을 목록은 아이콘까지 다 놓은 뒤에 만든다
  run("node scripts/build-sw.mjs", ROOT, { BASE_PATH: base, CACHE_PREFIX: `mid-${c.id}-` });

  const dest = join(OUT, c.id);
  cpSync(out, dest, { recursive: true });
  // Next 는 /db 의 첫 화면 조각을 /db.txt 로 찾는다 — 같은 것을 그 이름으로도
  if (existsSync(join(dest, "index.txt"))) cpSync(join(dest, "index.txt"), join(OUT, c.id + ".txt"));
  rmSync(out, { recursive: true, force: true });

  카드.push({
    id: c.id,
    name: c.name,
    code: c.code,
    color: c.color,
    mark: c.mark,
    ready: true,
    chapters: data.chapters.length,
    concepts: data.concepts.length,
    questions: data.questions.length,
    examDate: data.examDate ?? null,
  });
  범위.push({
    id: c.id,
    missing: data.missing ?? [],
    examNote: data.examNote ?? null,
    chapters: data.chapters.map((ch) => ({ id: ch.id, title: ch.title })),
    concepts: data.concepts.map((k) => ({
      id: k.id,
      ch: k.chapter,
      imp: k.importance,
      t: k.title,
      qs: data.questions.filter((q) => q.concept === k.id).map((q) => q.id),
    })),
  });
}

console.log("\n━━━ 현관 → /");
writeFileSync(join(ROOT, "hub", "src", "data", "courses.generated.json"), JSON.stringify(카드, null, 2) + "\n");
writeFileSync(join(ROOT, "hub", "src", "data", "scope.generated.json"), JSON.stringify(범위) + "\n");
const hub = join(ROOT, "hub");
// 배포 빌드(Cloudflare)에서는 현관의 의존성이 아직 없다
if (!existsSync(join(hub, "node_modules"))) run("npm install --no-audit --no-fund", hub);
rmSync(join(hub, "out"), { recursive: true, force: true });
run("npm run build", hub, {
  SW_SKIP: COURSES.map((c) => `/${c.id}/`).join(","),
});
cpSync(join(hub, "out"), OUT, { recursive: true });
rmSync(join(hub, "out"), { recursive: true, force: true });

console.log(`\n한 웹으로 묶었다 → out-all/  (과목 ${카드.filter((c) => c.ready).length}개 + 현관)`);
