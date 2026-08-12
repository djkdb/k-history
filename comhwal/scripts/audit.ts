/**
 * 배포 전 점검.
 *
 * 이 앱은 학습 기록을 사용자 기기에만 둔다. 서버에 사본이 없으므로
 * 저장소 이름을 한 글자라도 바꾸면 이미 쓰고 있는 사람의 기록을 영영
 * 찾지 못한다. 그 사고를 코드 리뷰에 맡기지 않고 여기서 막는다.
 *
 * 함께 문제 은행도 훑는다. 문제를 데이터에서 만들어 내는 구조라
 * 개념을 하나 고치면 엉뚱한 곳에서 답이 새거나 보기가 겹칠 수 있다.
 *
 *   node -e "require('jiti')(process.cwd())('./scripts/audit.ts')"
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CONCEPTS } from "../src/data/concepts";
import { FORMULA_TASKS } from "../src/data/formulas";
import { SHORTCUTS } from "../src/data/shortcuts";
import { SUBJECTS } from "../src/data/subjects";
import { questionBank } from "../src/lib/quiz";
import { gradeFormula, normalizeFormula } from "../src/lib/grade-formula";
import { prettyKey } from "../src/lib/shortcut";
import type { Grade } from "../src/lib/types";

const root = process.cwd();
const problems: string[] = [];
const notes: string[] = [];

function fail(msg: string) {
  problems.push(msg);
}

/** 사람이 대충 친 모양 — 문자열 밖만 소문자로 바꾸고 쉼표 뒤에 공백을 넣는다 */
function sloppyForm(formula: string): string {
  let out = "";
  let inStr = false;
  for (const ch of formula) {
    if (ch === '"') {
      inStr = !inStr;
      out += ch;
      continue;
    }
    if (inStr) {
      out += ch;
      continue;
    }
    out += ch === "," ? ", " : ch.toLowerCase();
  }
  return out.replace(/^=/, "");
}

// ── 1. 저장소 이름 잠금 ────────────────────────────────────────────
// 바꾸는 순간 기존 사용자의 기록을 잃는다. 값 자체를 여기에 박아 둔다.
const LOCKED = [
  { file: "src/lib/idb-storage.ts", needle: 'const DB_NAME = "comhwal"' },
  { file: "src/lib/idb-storage.ts", needle: 'const STORE_NAME = "state"' },
  {
    file: "src/lib/idb-storage.ts",
    needle: 'const MIRROR_PREFIX = "comhwal:mirror:"',
  },
  { file: "src/lib/store.ts", needle: 'name: "comhwal-state"' },
  { file: "src/app/mock/progress.ts", needle: 'PROGRESS_KEY = "comhwal:mock-progress"' },
  {
    file: "src/app/quiz/progress.ts",
    needle: 'QUIZ_PROGRESS_KEY = "comhwal:quiz-progress"',
  },
  { file: "src/components/theme.tsx", needle: 'THEME_KEY = "comhwal:theme"' },
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

// ── 2. 데이터 무결성 ───────────────────────────────────────────────
const ids = new Set<string>();
for (const c of CONCEPTS) {
  if (ids.has(c.id)) fail(`개념 id 중복: ${c.id}`);
  ids.add(c.id);
  if (!SUBJECTS.some((s) => s.id === c.subject)) {
    fail(`${c.id}: 없는 과목 ${c.subject}`);
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
  // 과목별 최소 급수와 개념의 최소 급수가 어긋나면 화면에서 사라진다
  const subject = SUBJECTS.find((s) => s.id === c.subject)!;
  if (c.minGrade > subject.minGrade) {
    fail(`${c.id}: 과목(${subject.minGrade}급)보다 낮은 급수(${c.minGrade})입니다`);
  }
}

const fIds = new Set<string>();
for (const f of FORMULA_TASKS) {
  if (fIds.has(f.id)) fail(`수식 문제 id 중복: ${f.id}`);
  fIds.add(f.id);
  if (!f.answer.startsWith("=")) fail(`${f.id}: 모범 수식이 = 로 시작하지 않습니다`);
  const opens = (f.answer.match(/\(/g) || []).length;
  const closes = (f.answer.match(/\)/g) || []).length;
  if (opens !== closes) fail(`${f.id}: 모범 수식의 괄호 짝이 맞지 않습니다`);
  if ((f.answer.match(/"/g) || []).length % 2 === 1) {
    fail(`${f.id}: 모범 수식의 큰따옴표가 홀수 개입니다`);
  }
  // 채점기가 자기 정답을 맞다고 하는지 — 정규화 규칙이 어긋나면 여기서 걸린다
  if (!gradeFormula(f.answer, f).correct) {
    fail(`${f.id}: 채점기가 모범 수식을 오답으로 봅니다`);
  }
  for (const alt of f.alternatives ?? []) {
    if (!gradeFormula(alt, f).correct) {
      fail(`${f.id}: 채점기가 대체 정답 "${alt}" 을 오답으로 봅니다`);
    }
    if (normalizeFormula(alt) === normalizeFormula(f.answer)) {
      notes.push(`${f.id}: 대체 정답 "${alt}" 은 모범 수식과 같아 없어도 됩니다`);
    }
  }
  // 공백·소문자로 쳐도 통해야 한다.
  // 다만 따옴표 안은 건드리지 않는다 — IF(...,"A") 와 IF(...,"a") 는
  // 엑셀에서도 다른 값을 내놓으므로 채점기가 구분하는 것이 맞다.
  const sloppy = sloppyForm(f.answer);
  if (!gradeFormula(sloppy, f).correct) {
    fail(`${f.id}: 소문자·공백을 넣은 같은 수식을 오답으로 봅니다 — ${sloppy}`);
  }
}

const sIds = new Set<string>();
for (const s of SHORTCUTS) {
  if (sIds.has(s.id)) fail(`단축키 id 중복: ${s.id}`);
  sIds.add(s.id);
  if (s.keys.length === 0) fail(`${s.id}: 판정용 keys 가 비어 있습니다`);
  for (const k of s.keys) {
    if (k !== k.toLowerCase()) fail(`${s.id}: keys 는 소문자여야 합니다 — ${k}`);
    if (/\s/.test(k)) fail(`${s.id}: keys 에 공백이 있습니다 — ${k}`);
    const parts = k.split("+");
    const mods = parts.slice(0, -1);
    const order = ["ctrl", "alt", "shift", "win"];
    const sorted = [...mods].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    if (mods.join("+") !== sorted.join("+")) {
      fail(`${s.id}: 수식어 순서는 ctrl→alt→shift→win 이어야 합니다 — ${k}`);
    }
    for (const m of mods) {
      if (!order.includes(m)) fail(`${s.id}: 알 수 없는 수식어 ${m} — ${k}`);
    }
  }
  // 표기와 판정이 어긋나면 "정답인데 오답" 이 된다
  const shown = s.display.toLowerCase().replace(/\s/g, "");
  const known = s.keys.map((k) => prettyKey(k).toLowerCase().replace(/\s/g, ""));
  if (!known.includes(shown)) {
    notes.push(
      `${s.id}: 표기(${s.display})와 판정(${s.keys.join(", ")})이 글자로는 다릅니다`,
    );
  }
}

// ── 3. 문제 은행 ───────────────────────────────────────────────────
let bankTotal = 0;
for (const grade of [1, 2] as Grade[]) {
  const bank = questionBank(grade);
  bankTotal += bank.length;
  const seen = new Set<string>();
  for (const q of bank) {
    if (seen.has(q.id)) fail(`${grade}급 문제 id 중복: ${q.id}`);
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
    if (!q.explanation || q.explanation.length < 5) {
      fail(`${q.id}: 해설이 없습니다`);
    }
    if (!CONCEPTS.some((c) => c.id === q.sourceId)) {
      fail(`${q.id}: 출처 개념 ${q.sourceId} 을 찾을 수 없습니다`);
    }

    // 지문이 답을 그대로 흘리면 문제가 되지 않는다
    const answer = q.options[q.answerIndex];
    if (q.passage && q.type !== "negative") {
      const tokens = answer
        .split(/[\s·,()—\-–~/]+/)
        .filter((t) => t.length >= 2);
      const leaked = tokens.filter((t) => q.passage!.includes(t));
      if (leaked.length && q.type === "multiple") {
        fail(`${q.id}: 지문에 답이 그대로 있습니다 — ${leaked.join(", ")}`);
      }
      if (q.type === "blank" && q.passage.includes(answer)) {
        fail(`${q.id}: 빈칸으로 가려야 할 말이 지문에 남아 있습니다 — ${answer}`);
      }
    }
    // 오답 보기가 정답과 같은 말이면 답이 둘이 된다
    for (const [i, o] of q.options.entries()) {
      if (i !== q.answerIndex && o.trim() === answer.trim()) {
        fail(`${q.id}: 오답 보기가 정답과 같습니다`);
      }
    }

    // 보기에 공부 요령("…선지가 단골이다")이 섞이면 시험 문제가 아니라
    // 학습 노트가 된다. 실제 시험 선지는 사실 서술문이다.
    // ('나온다' 는 "값이 그대로 나온다" 처럼 사실 서술에도 쓰이므로
    //  출제·암기를 말하는 표현만 잡는다)
    if (q.type === "negative" || q.type === "trap") {
      const tip = q.options.find((o) =>
        /(출제된다|출제되는|문제가 나온다|선지|단골|함정으로|외운다|외워|묶어 둔다|굳혀|헷갈리지 않는다)/.test(
          o,
        ),
      );
      if (tip) fail(`${q.id}: 보기에 공부 요령이 들어 있습니다 — "${tip.slice(0, 30)}…"`);

      // 앞 문장을 가리키는 선지는 혼자 읽으면 뜻이 통하지 않는다
      const dangling = q.options.find((o) =>
        /^(여기|이때|이를|이는|이것|그러면|그래서|반면|다만|또한|대신|즉|반대로|예를 들어|따라서)/.test(
          o,
        ),
      );
      if (dangling) {
        fail(`${q.id}: 앞 문장을 가리키는 선지가 있습니다 — "${dangling.slice(0, 30)}…"`);
      }
    }

    // '헷갈리는 둘'은 뒤바꾼 설명이 오답에 반드시 들어가야 한다.
    // 없으면 소재만 보고 고를 수 있어 문제가 되지 않는다.
    if (q.type === "trap") {
      const c = CONCEPTS.find((x) => x.id === q.sourceId);
      const swapped = c?.traps.find((t) => t.difference === answer)?.wrong;
      if (swapped && !q.options.includes(swapped)) {
        fail(`${q.id}: 뒤바꾼 설명이 오답 보기에 없습니다`);
      }
    }
  }
}

// ── 결과 ───────────────────────────────────────────────────────────
console.log(`개념 ${CONCEPTS.length}개 · 수식 ${FORMULA_TASKS.length}문항 · 단축키 ${SHORTCUTS.length}개`);
console.log(`문제 은행 ${bankTotal}문항 (1급·2급 합산)`);

if (notes.length) {
  console.log("\n참고");
  for (const n of notes) console.log(`  · ${n}`);
}

// 같은 문제가 1급·2급 은행에 함께 들어 있어 두 번 걸린다 — 한 번만 알린다
const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`\n✗ ${unique.length}건`);
  for (const p of unique) console.error(`  · ${p}`);
  process.exit(1);
}
console.log("\n✓ 이상 없음");
