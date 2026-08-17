/**
 * 배포 전 점검.
 *
 * 이 앱은 학습 기록을 사용자 기기에만 둔다. 서버에 사본이 없으므로
 * 저장소 이름을 한 글자라도 바꾸면 이미 쓰고 있는 사람의 기록을 영영
 * 찾지 못한다. 그 사고를 코드 리뷰에 맡기지 않고 여기서 막는다.
 *
 * 함께 문제 은행과 SQL 실습을 훑는다. 문제를 데이터에서 만들어 내는
 * 구조라 개념을 하나 고치면 엉뚱한 곳에서 답이 새거나 보기가 겹칠 수
 * 있고, 실습은 모범 답안이 실제로 돌아가지 않으면 채점 자체가 무너진다.
 * 그래서 모범 답안을 진짜 SQLite 에 넣어 돌려 본다.
 *
 *   node -e "require('jiti')(process.cwd(),{alias:{'@':process.cwd()+'/src'}})('./scripts/audit.ts')"
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CONCEPTS } from "../src/data/concepts";
import { SQL_TASKS } from "../src/data/sql-tasks";
import { CHAPTERS, EXAM, SUBJECTS, cutoff, judge } from "../src/data/exam";
import { SCHEMA_SQL, TABLES } from "../src/data/schema";
import { LOCKED_CONCEPT_IDS, LOCKED_TASK_IDS } from "../src/data/locked-ids";
import { SQL_QUIZ } from "../src/data/sql-quiz";
import { makeMock, questionBank } from "../src/lib/quiz";
import { bridge } from "../src/lib/sqlite";
import type { SubjectId } from "../src/lib/types";

const root = process.cwd();
const problems: string[] = [];
const notes: string[] = [];

function fail(msg: string) {
  problems.push(msg);
}

// ── 1. 저장소 이름 잠금 ────────────────────────────────────────────
// 바꾸는 순간 기존 사용자의 기록을 잃는다. 값 자체를 여기에 박아 둔다.
const LOCKED = [
  { file: "src/lib/idb-storage.ts", needle: 'const DB_NAME = "sqld"' },
  { file: "src/lib/idb-storage.ts", needle: 'const STORE_NAME = "state"' },
  { file: "src/lib/idb-storage.ts", needle: 'const MIRROR_PREFIX = "sqld:mirror:"' },
  { file: "src/lib/store.ts", needle: 'name: "sqld-state"' },
  { file: "src/app/mock/progress.ts", needle: 'PROGRESS_KEY = "sqld:mock-progress"' },
  { file: "src/app/quiz/progress.ts", needle: 'QUIZ_PROGRESS_KEY = "sqld:quiz-progress"' },
  { file: "src/components/theme.tsx", needle: 'THEME_KEY = "sqld:theme"' },
  { file: "src/components/install-hint.tsx", needle: 'KEY_INAPP = "sqld:inapp-hint"' },
  { file: "src/components/install-hint.tsx", needle: 'KEY_INSTALL = "sqld:install-hint"' },
];

for (const { file, needle } of LOCKED) {
  const text = readFileSync(join(root, file), "utf8");
  if (!text.includes(needle)) {
    fail(`저장소 이름이 바뀌었습니다 — ${file} 에 \`${needle}\` 가 없습니다`);
  }
}

// zustand persist 에 version 을 두면 저장본을 버릴 수 있다
const storeSrc = readFileSync(join(root, "src/lib/store.ts"), "utf8");
if (/\bversion:\s*\d/.test(storeSrc)) {
  fail("store.ts 에 persist version 이 생겼습니다 — 저장본이 버려질 수 있습니다");
}

// 다른 앱과 저장소가 겹치면 서로의 기록을 덮어쓴다 (같은 도메인에 올릴 수 있다)
for (const other of ["comhwal", "toeic", "korea-history", "khistory"]) {
  for (const { file } of LOCKED) {
    const text = readFileSync(join(root, file), "utf8");
    if (new RegExp(`["'\`]${other}[-:]`).test(text)) {
      fail(`${file} 에 다른 앱의 저장소 이름(${other})이 섞였습니다`);
    }
  }
}

// ── 1-2. SQL 엔진 파일 ────────────────────────────────────────────
// sql.js 빌드마다 찾는 wasm 이름이 다르다. 요청한 이름을 그대로 붙이면
// 없는 파일을 받아 오고, 정적 호스팅이 404 대신 index.html 을 돌려주면
// "magic word 가 다르다"는 알 수 없는 오류로 끝난다.
{
  const engine = readFileSync(join(root, "src/lib/sqlite.ts"), "utf8");
  if (/locateFile:\s*\(f\)\s*=>/.test(engine)) {
    fail(
      "sqlite.ts: locateFile 이 요청한 파일 이름을 그대로 씁니다 — 담아 둔 wasm 하나를 가리켜야 합니다",
    );
  }
  for (const f of ["public/sql/sql-wasm.js", "public/sql/sql-wasm.wasm"]) {
    try {
      const buf = readFileSync(join(root, f));
      // wasm 은 앞 네 바이트가 00 61 73 6d 이어야 한다
      if (
        f.endsWith(".wasm") &&
        !(buf[0] === 0 && buf[1] === 0x61 && buf[2] === 0x73 && buf[3] === 0x6d)
      ) {
        fail(`${f} 가 wasm 파일이 아닙니다`);
      }
    } catch {
      fail(`SQL 엔진 파일이 없습니다 — ${f}`);
    }
  }
  // 서비스 워커가 두 파일을 모두 미리 받아 두어야 오프라인에서도 돈다
  const sw = readFileSync(join(root, "public/sw.js"), "utf8");
  for (const f of ["/sql/sql-wasm.js", "/sql/sql-wasm.wasm"]) {
    if (!sw.includes(f)) fail(`sw.js 가 ${f} 를 미리 받아 두지 않습니다`);
  }
}

// ── 2. id 잠금 ─────────────────────────────────────────────────────
// 사용자의 진도·복습 카드·오답 노트가 전부 이 id로 저장돼 있다.
function checkLock(kind: string, locked: readonly string[], now: string[]) {
  const have = new Set(now);
  const gone = locked.filter((id) => !have.has(id));
  if (gone.length) {
    fail(
      `${kind} id가 사라졌습니다 (${gone.length}개): ${gone.slice(0, 8).join(", ")}` +
        (gone.length > 8 ? " …" : "") +
        " — 이 id로 저장된 사용자 기록이 갈 곳을 잃습니다",
    );
  }
  const added = now.filter((id) => !locked.includes(id));
  if (added.length) {
    notes.push(
      `${kind} ${added.length}개가 새로 늘었습니다 — 배포 후 locked-ids.ts 에 추가할 것 (${added
        .slice(0, 5)
        .join(", ")}${added.length > 5 ? " …" : ""})`,
    );
  }
}

checkLock("개념", LOCKED_CONCEPT_IDS, CONCEPTS.map((c) => c.id));
checkLock("SQL 실습", LOCKED_TASK_IDS, SQL_TASKS.map((t) => t.id));

// 개념 id 와 실습 id 는 같은 복습 큐에 섞인다 — 겹치면 서로를 가린다
{
  const both = new Set(CONCEPTS.map((c) => c.id));
  for (const t of SQL_TASKS) {
    if (both.has(t.id)) fail(`개념과 실습의 id 가 겹칩니다: ${t.id}`);
  }
}

// ── 3. 시험 규칙 ───────────────────────────────────────────────────
{
  const total = SUBJECTS.reduce((a, s) => a + s.count, 0);
  if (total !== EXAM.questions) {
    fail(`과목 문항 합(${total})이 시험 문항 수(${EXAM.questions})와 다릅니다`);
  }
  const points = SUBJECTS.reduce((a, s) => a + s.points, 0);
  if (points !== 100) fail(`배점 합이 ${points}점입니다 (100점이어야 합니다)`);
  for (const s of SUBJECTS) {
    if (s.points !== s.count * EXAM.perQuestion) {
      fail(`${s.id}: 배점(${s.points})이 문항 수 × ${EXAM.perQuestion} 과 다릅니다`);
    }
  }
  // 과락 판정이 실제로 과락을 잡는가 — 규칙을 고칠 때 여기서 걸린다
  const cutModeling = cutoff("modeling");
  const barely = judge([
    { subject: "modeling", correct: cutModeling - 1, total: 10 },
    { subject: "sql", correct: 40, total: 40 },
  ]);
  if (barely.passed || !barely.failedSubjects.includes("modeling")) {
    fail("과락 판정이 동작하지 않습니다 — 1과목이 과락선 아래인데 합격으로 봅니다");
  }
  const onLine = judge([
    { subject: "modeling", correct: cutModeling, total: 10 },
    { subject: "sql", correct: 40, total: 40 },
  ]);
  if (onLine.failedSubjects.length) {
    fail(`과락선(${cutModeling}문항)에 정확히 걸친 경우를 과락으로 봅니다`);
  }
  // 60점 미만은 과락이 없어도 불합격
  const low = judge([
    { subject: "modeling", correct: 5, total: 10 },
    { subject: "sql", correct: 20, total: 40 },
  ]);
  if (low.passed) fail("50점인데 합격으로 봅니다");
}

// ── 4. 데이터 무결성 ───────────────────────────────────────────────
const ids = new Set<string>();
for (const c of CONCEPTS) {
  if (ids.has(c.id)) fail(`개념 id 중복: ${c.id}`);
  ids.add(c.id);
  if (!SUBJECTS.some((s) => s.id === c.subject)) fail(`${c.id}: 없는 과목 ${c.subject}`);
  const ch = CHAPTERS.find((x) => x.id === c.chapter);
  if (!ch) fail(`${c.id}: 없는 장 ${c.chapter}`);
  else if (ch.subject !== c.subject) {
    fail(`${c.id}: 장(${ch.id})의 과목과 개념의 과목이 다릅니다`);
  }
  if (c.summary.length < 10) fail(`${c.id}: summary 가 너무 짧습니다`);
  if (c.detail.length < 30) fail(`${c.id}: detail 이 너무 짧습니다`);
  if (c.examPoint.length < 20) fail(`${c.id}: examPoint 가 너무 짧습니다`);
  if (c.keywords.length < 3) fail(`${c.id}: 키워드가 3개 미만입니다`);
  if (c.traps.length === 0) fail(`${c.id}: 헷갈리는 짝(traps)이 없습니다`);
  for (const t of c.traps) {
    // wrong 이 없으면 '옳지 않은 것' 문제의 오답이 딴 주제가 되어
    // 읽지 않고도 답이 보인다
    if (!t.wrong || t.wrong.length < 10) {
      fail(`${c.id}: 함정 '${t.concept}' 에 뒤바꾼 틀린 설명(wrong)이 없습니다`);
    }
    if (t.wrong === t.difference) {
      fail(`${c.id}: 함정 '${t.concept}' 의 wrong 이 difference 와 같습니다`);
    }
  }
  if (c.table) {
    const w = c.table.headers.length;
    for (const [i, r] of c.table.rows.entries()) {
      if (r.length !== w) fail(`${c.id}: 표 ${i + 1}번째 줄의 칸 수가 머리글과 다릅니다`);
    }
  }
}

const tIds = new Set<string>();
for (const t of SQL_TASKS) {
  if (tIds.has(t.id)) fail(`실습 id 중복: ${t.id}`);
  tIds.add(t.id);
  if (t.prompt.length < 10) fail(`${t.id}: 문제 설명이 너무 짧습니다`);
  if (t.explanation.length < 10) fail(`${t.id}: 해설이 없습니다`);
  // schema 는 "emp" 처럼 하나일 수도, "emp,dept" 처럼 여럿일 수도 있다
  for (const name of t.schema.split(",").map((x) => x.trim())) {
    if (!TABLES.some((x) => x.name === name)) {
      fail(`${t.id}: 없는 표를 가리킵니다 — ${name}`);
    }
  }
  // ORDER BY 를 요구하는 문제인데 순서를 안 보면 아무 순서나 통과한다
  const wantsOrder = /순으로|정렬|차례로|위에서부터/.test(t.prompt);
  if (wantsOrder && !t.ordered) {
    notes.push(`${t.id}: 문제가 순서를 요구하는데 ordered 가 아닙니다`);
  }
  if (t.ordered && !/order\s+by/i.test(t.answer)) {
    fail(`${t.id}: ordered 인데 모범 답안에 ORDER BY 가 없습니다`);
  }
  for (const link of t.links ?? []) {
    if (!CONCEPTS.some((c) => c.id === link)) {
      fail(`${t.id}: 이어지는 개념 ${link} 을 찾을 수 없습니다`);
    }
  }
}

// ── 5. 문제 은행 ───────────────────────────────────────────────────
const bank = questionBank();
{
  const seen = new Set<string>();
  for (const q of bank) {
    if (seen.has(q.id)) fail(`문제 id 중복: ${q.id}`);
    seen.add(q.id);

    if (q.options.length !== 4) {
      fail(`${q.id}: 보기가 ${q.options.length}개입니다 (4개여야 합니다)`);
    }
    if (new Set(q.options).size !== q.options.length) {
      fail(`${q.id}: 같은 보기가 두 번 들어 있습니다`);
    }
    if (q.answerIndex < 0 || q.answerIndex >= q.options.length) {
      fail(`${q.id}: 정답 번호가 보기 범위를 벗어났습니다`);
    }
    if (!q.explanation || q.explanation.length < 5) fail(`${q.id}: 해설이 없습니다`);

    // 해설이 정답 선지를 그대로 되풀이하면 읽을 것이 없다
    {
      const bare = q.explanation.replace(/\s*\([^)]*\)\s*$/, "").trim();
      if (bare === q.options[q.answerIndex].trim()) {
        fail(`${q.id}: 해설이 정답 선지와 같은 문장입니다 — 읽을 것이 없습니다`);
      }
    }

    // 선지별 풀이 — 틀렸을 때 "내가 고른 것이 왜 아닌지"를 주는 자리다
    if (!q.optionNotes) {
      fail(`${q.id}: 선지별 풀이가 없습니다`);
    } else {
      if (q.optionNotes.length !== q.options.length) {
        fail(
          `${q.id}: 선지 ${q.options.length}개인데 풀이가 ${q.optionNotes.length}개입니다 — 짝이 어긋납니다`,
        );
      }
      if (q.optionNotes[q.answerIndex] !== null) {
        fail(`${q.id}: 정답 자리에 오답 풀이가 붙어 있습니다`);
      }
      q.optionNotes.forEach((n, i) => {
        if (i !== q.answerIndex && (!n || n.trim().length < 5)) {
          fail(`${q.id}: ${i + 1}번 오답에 풀이가 없습니다`);
        }
      });
    }
    if (!CONCEPTS.some((c) => c.id === q.sourceId)) {
      fail(`${q.id}: 출처 개념 ${q.sourceId} 을 찾을 수 없습니다`);
    }

    // 지문이 답을 그대로 흘리면 문제가 되지 않는다
    const answer = q.options[q.answerIndex];
    if (q.passage && q.type !== "negative") {
      const tokens = answer.split(/[\s·,()—\-–~/]+/).filter((t) => t.length >= 2);
      const leaked = tokens.filter((t) => q.passage!.includes(t));
      if (leaked.length && q.type === "multiple") {
        fail(`${q.id}: 지문에 답이 그대로 있습니다 — ${leaked.join(", ")}`);
      }
      if (q.type === "blank" && q.passage.includes(answer)) {
        fail(`${q.id}: 빈칸으로 가려야 할 말이 지문에 남아 있습니다 — ${answer}`);
      }
    }
    for (const [i, o] of q.options.entries()) {
      if (i !== q.answerIndex && o.trim() === answer.trim()) {
        fail(`${q.id}: 오답 보기가 정답과 같습니다`);
      }
    }

    // 보기에 공부 요령이 섞이면 시험 문제가 아니라 학습 노트가 된다
    if (q.type === "negative" || q.type === "trap") {
      const tip = q.options.find((o) =>
        /(출제된다|출제되는|문제가 나온다|선지|단골|함정으로|외운다|외워|묶어 둔다|굳혀|헷갈리지 않는다)/.test(
          o,
        ),
      );
      if (tip) fail(`${q.id}: 보기에 공부 요령이 들어 있습니다 — "${tip.slice(0, 30)}…"`);

      const dangling = q.options.find((o) =>
        /^(여기|이때|이를|이는|이것|그러면|그래서|반면|다만|또한|대신|즉|반대로|예를 들어|따라서)/.test(
          o,
        ),
      );
      if (dangling) {
        fail(`${q.id}: 앞 문장을 가리키는 선지가 있습니다 — "${dangling.slice(0, 30)}…"`);
      }
    }

    // '헷갈리는 둘'은 뒤바꾼 설명이 오답에 반드시 들어가야 한다
    if (q.type === "trap") {
      const c = CONCEPTS.find((x) => x.id === q.sourceId);
      const swapped = c?.traps.find((t) => t.difference === answer)?.wrong;
      if (swapped && !q.options.includes(swapped)) {
        fail(`${q.id}: 뒤바꾼 설명이 오답 보기에 없습니다`);
      }
    }
  }
}

/*
  정답이 특정 자리에 몰려 있지 않은가.

  섞기 함수가 조용히 망가지면 여기서만 드러난다. 실제로 32비트를 넘는
  곱셈 때문에 난수가 난수가 아니게 되어 **정답이 99% 4번 자리**에 몰린
  적이 있다. 화면도 빌드도 멀쩡해 보이므로 숫자로 잡는 수밖에 없다.
*/
{
  const pos = [0, 0, 0, 0];
  for (const q of bank) pos[q.answerIndex]++;
  for (const [i, c] of pos.entries()) {
    const pct = Math.round((c / bank.length) * 100);
    if (pct < 15 || pct > 35) {
      fail(
        `정답이 ${i + 1}번 자리에 ${pct}% 몰려 있습니다 (고르면 25%) — 섞기가 망가졌을 수 있습니다`,
      );
    }
  }
}

// ── 6. 모의고사 한 벌이 실제 시험 구성과 같은가 ──────────────────
for (const seed of [1, 7, 42, 99, 12345, 20260816]) {
  const mock = makeMock(seed);
  if (mock.length !== EXAM.questions) {
    fail(`seed ${seed}: 모의고사가 ${mock.length}문항입니다 (${EXAM.questions}문항이어야 합니다)`);
  }
  for (const s of SUBJECTS) {
    const n = mock.filter((q) => q.subject === (s.id as SubjectId)).length;
    if (n !== s.count) {
      fail(`seed ${seed}: ${s.short} 이 ${n}문항입니다 (${s.count}문항이어야 합니다)`);
    }
  }
  const dupIds = mock.length - new Set(mock.map((q) => q.id)).size;
  if (dupIds) fail(`seed ${seed}: 같은 문항이 ${dupIds}개 겹칩니다`);
  // 같은 개념이 세 번 이상 나오면 앞 문제의 보기가 뒤 문제의 답이 된다
  const bySource = new Map<string, number>();
  for (const q of mock) bySource.set(q.sourceId, (bySource.get(q.sourceId) ?? 0) + 1);
  for (const [src, n] of bySource) {
    if (n > 2) fail(`seed ${seed}: 개념 ${src} 에서 ${n}문항이 나왔습니다`);
  }
}

// ── 7. 모범 답안을 진짜 SQLite 에 넣어 돌린다 ─────────────────────
// 화면과 같은 sql.js 를 쓴다. 여기서 돌아가지 않는 답안은 사용자에게도
// 돌아가지 않고, 채점 기준이 없으니 그 문제는 아예 풀 수 없다.
interface SqlJsDb {
  exec: (sql: string) => { columns: string[]; values: unknown[][] }[];
  close: () => void;
}

async function runSqlChecks() {
  const wasmBinary = readFileSync(join(root, "public/sql/sql-wasm.wasm"));
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const initSqlJs = require(join(root, "public/sql/sql-wasm.js"));
  const SQL = await initSqlJs({ wasmBinary });

  /** 표를 처음 상태로 되돌린 새 판 */
  const fresh = (): SqlJsDb => {
    const db = new SQL.Database() as SqlJsDb;
    db.exec(SCHEMA_SQL);
    return db;
  };

  // 스키마 자체가 서는지
  {
    const db = fresh();
    for (const t of TABLES) {
      const r = db.exec(`SELECT * FROM ${t.name} LIMIT 1`);
      const cols = r[0]?.columns ?? [];
      for (const c of t.columns) {
        if (!cols.includes(c.name)) {
          fail(`화면에 적힌 열 ${t.name}.${c.name} 이 실제 표에 없습니다`);
        }
      }
      for (const c of cols) {
        if (!t.columns.some((x) => x.name === c)) {
          notes.push(`표 ${t.name} 의 열 ${c} 이 화면 설명에 빠져 있습니다`);
        }
      }
    }
    db.close();
  }

  let ran = 0;
  for (const t of SQL_TASKS) {
    const db = fresh();
    try {
      // 화면과 같은 변환을 거쳐 돌린다 (NVL → IFNULL 등)
      const out = db.exec(bridge(t.answer));
      const rows = out[0]?.values ?? [];
      if (!out.length) {
        fail(`${t.id}: 모범 답안이 아무 결과도 내놓지 않습니다 — 채점 기준이 없습니다`);
      } else if (rows.length === 0) {
        fail(`${t.id}: 모범 답안의 결과가 0행입니다 — 무엇을 쳐도 맞기 쉽습니다`);
      }
      ran++;
    } catch (e) {
      fail(`${t.id}: 모범 답안이 돌아가지 않습니다 — ${(e as Error).message}`);
    }
    db.close();
  }

  /*
    쿼리를 주고 결과를 묻는 문제 — 적어 둔 정답이 진짜 그 결과인가.

    문제집에서 가장 나쁜 것이 오답이다. 사람이 머리로 센 값을 그대로
    믿지 않고, 같은 판에 쿼리를 넣어 돌린 결과와 글자 그대로 견준다.
  */
  let sqlQuiz = 0;
  for (const it of SQL_QUIZ) {
    const db = fresh();
    try {
      // [보기] 는 읽히기 위한 것, 확인은 verify 로 (없으면 [보기] 그대로)
      const out = db.exec(bridge(it.verify ?? it.sql));
      const cols = out[0]?.columns ?? [];
      const rows = out[0]?.values ?? [];
      // 정답 글에서 숫자·값만 떼어 낸다 ("2행" → "2", "10, 6" → ["10","6"])
      const said = it.answer.split("—")[0].trim();
      let real = "";
      if (it.check === "rows") real = `${rows.length}행`;
      else if (it.check === "cell") real = String(rows[0]?.[0] ?? "NULL");
      else real = (rows[0] ?? []).map((v) => (v === null ? "NULL" : String(v))).join(", ");

      const num = (t: string) => t.replace(/[^0-9.,]/g, "").replace(/,\s*/g, ",");
      if (it.check === "rows" && `${rows.length}행` !== said && `${rows.length}개` !== said) {
        fail(`${it.id}: 정답은 "${said}" 인데 실제로 돌리면 ${rows.length}행입니다`);
      } else if (it.check === "cell" && num(real) !== num(said)) {
        fail(`${it.id}: 정답은 "${said}" 인데 실제 값은 ${real} 입니다`);
      } else if (it.check === "list" && num(real) !== num(said)) {
        // 소수는 반올림해 적으므로 앞 두 자리까지만 견준다
        const round = (t: string) =>
          t.split(",").map((x) => (x.includes(".") ? (+x).toFixed(1) : x.trim())).join(",");
        if (round(num(real)) !== round(num(said))) {
          fail(`${it.id}: 정답은 "${said}" 인데 실제 결과는 "${real}" 입니다`);
        }
      }
      if (!cols.length && it.check !== "rows") {
        fail(`${it.id}: 쿼리가 값을 돌려주지 않습니다`);
      }
      for (const link of it.links) {
        if (!CONCEPTS.some((c) => c.id === link)) {
          fail(`${it.id}: 이어지는 개념 ${link} 을 찾을 수 없습니다`);
        }
      }
      if (new Set([it.answer, ...it.wrong]).size !== 4) {
        fail(`${it.id}: 선지 넷이 서로 달라야 합니다`);
      }
      sqlQuiz++;
    } catch (e) {
      fail(`${it.id}: 보기의 쿼리가 돌아가지 않습니다 — ${(e as Error).message}`);
    }
    db.close();
  }

  // 개념에 곁들인 쿼리도 같은 잣대로
  let conceptQueries = 0;
  for (const c of CONCEPTS) {
    if (!c.sql) continue;
    const db = fresh();
    try {
      db.exec(bridge(c.sql.query));
      conceptQueries++;
    } catch (e) {
      fail(`${c.id}: 곁들인 쿼리가 돌아가지 않습니다 — ${(e as Error).message}`);
    }
    db.close();
  }

  return { ran, conceptQueries, sqlQuiz };
}

runSqlChecks().then(({ ran, conceptQueries, sqlQuiz }) => {
  console.log(
    `개념 ${CONCEPTS.length}개 · SQL 실습 ${SQL_TASKS.length}문항 · 문제 은행 ${bank.length}문항`,
  );
  console.log(
    `SQLite 실행 확인 — 모범 답안 ${ran}개 · 개념 쿼리 ${conceptQueries}개 · 결과 맞히기 정답 대조 ${sqlQuiz}개`,
  );

  if (notes.length) {
    console.log("\n참고");
    for (const n of notes) console.log(`  · ${n}`);
  }

  const unique = [...new Set(problems)];
  if (unique.length) {
    console.error(`\n✗ ${unique.length}건`);
    for (const p of unique) console.error(`  · ${p}`);
    process.exit(1);
  }
  console.log("\n✓ 이상 없음");
});
