/**
 * 배포 전 점검.
 *
 * 이 앱은 학습 기록을 사용자 기기에만 둔다. 서버에 사본이 없으므로
 * 저장소 이름을 한 글자라도 바꾸면 이미 쓰고 있는 사람의 기록을 영영
 * 찾지 못한다. 그 사고를 코드 리뷰에 맡기지 않고 여기서 막는다.
 *
 * 함께 문항도 훑는다. 선택지가 겹치거나, 정답 번호가 범위를 벗어나거나,
 * 해설이 비어 있으면 화면에서야 드러난다 — 그전에 잡는다.
 *
 *   node -e "require('jiti')(process.cwd(),{alias:{'@':process.cwd()+'/src'}})('./scripts/audit.ts')"
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { VOCAB } from "../src/data/vocab";
import { GRAMMAR } from "../src/data/grammar";
import { READING } from "../src/data/reading";
import { LISTENING } from "../src/data/listening";
import { PARTS, scaledScore } from "../src/data/parts";
import {
  LOCKED_VOCAB_IDS,
  LOCKED_GRAMMAR_IDS,
  LOCKED_QUESTION_IDS,
} from "../src/data/locked-ids";
import { BLUEPRINT, answerOf, buildExam, EXAMS } from "../src/lib/exam";
import type { Band } from "../src/lib/types";

const root = process.cwd();
const problems: string[] = [];
const notes: string[] = [];

function fail(msg: string) {
  problems.push(msg);
}

/** 막지는 않되 눈에는 띄게 — 사람이 보고 판단할 것 */
function warn(msg: string) {
  notes.push(msg);
}

// ── 1. 저장소 이름 잠금 ────────────────────────────────────────────
// 바꾸는 순간 기존 사용자의 기록을 잃는다. 값 자체를 여기에 박아 둔다.
const LOCKED_NAMES = [
  { file: "src/lib/idb-storage.ts", needle: 'const DB_NAME = "toeic"' },
  { file: "src/lib/idb-storage.ts", needle: 'const STORE_NAME = "state"' },
  { file: "src/lib/idb-storage.ts", needle: 'const MIRROR_PREFIX = "toeic:mirror:"' },
  { file: "src/lib/store.ts", needle: 'name: "toeic-state"' },
  { file: "src/components/theme.tsx", needle: 'THEME_KEY = "toeic:theme"' },
  { file: "src/components/install-hint.tsx", needle: 'KEY_INAPP = "toeic:inapp-hint"' },
  { file: "src/components/install-hint.tsx", needle: 'KEY_INSTALL = "toeic:install-hint"' },
  { file: "src/app/mock/progress.ts", needle: 'MOCK_PROGRESS_KEY = "toeic:mock-progress"' },
];

for (const { file, needle } of LOCKED_NAMES) {
  let text = "";
  try {
    text = readFileSync(join(root, file), "utf8");
  } catch {
    fail(`${file} 을 읽지 못했습니다`);
    continue;
  }
  if (!text.includes(needle)) {
    fail(
      `저장소 이름이 바뀌었습니다 — ${file} 에 \`${needle}\` 이 없습니다.\n` +
        `    이 이름을 바꾸면 이미 쓰고 있는 사람의 학습 기록을 찾지 못합니다.`,
    );
  }
}

// zustand persist 의 version 은 두면 안 된다 — 올리는 순간 저장본이 버려질 수 있다
{
  const storeText = readFileSync(join(root, "src/lib/store.ts"), "utf8");
  if (/^\s*version:/m.test(storeText)) {
    fail(
      "store.ts 에 version 이 생겼습니다. persist 의 version 을 올리면 " +
        "migrate 가 없을 때 저장본이 통째로 버려집니다. mergeSaved 로 흡수하세요.",
    );
  }
}

// ── 2. id 잠금 ────────────────────────────────────────────────────
// 사용자의 복습 카드가 id 를 가리킨다. 이름을 바꾸면 그 기록이 허공을 가리킨다.
function checkLock(kind: string, current: string[], locked: string[]) {
  const now = new Set(current);
  const gone = locked.filter((id) => !now.has(id));
  if (gone.length) {
    fail(
      `${kind} id 가 사라졌습니다: ${gone.join(", ")}\n` +
        `    이미 배포된 id 입니다. 이름을 바꿨다면 되돌리고, 정말 없앨 것이라면\n` +
        `    src/data/locked-ids.ts 에서도 함께 지우세요(기존 사용자 기록은 버려집니다).`,
    );
  }
  const added = current.filter((id) => !locked.includes(id));
  if (added.length) notes.push(`${kind} 새 id ${added.length}개`);
}

const questionIds: string[] = [
  ...READING.flatMap((s) => s.questions.map((q) => q.id)),
  ...LISTENING.flatMap((s) => s.questions.map((q) => q.id)),
];

checkLock("어휘", VOCAB.map((v) => v.id), LOCKED_VOCAB_IDS);
checkLock("문법", GRAMMAR.map((g) => g.id), LOCKED_GRAMMAR_IDS);
checkLock("문항", questionIds, LOCKED_QUESTION_IDS);

// ── 3. id 중복 ────────────────────────────────────────────────────
function dupes(list: string[]): string[] {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const x of list) {
    if (seen.has(x)) out.add(x);
    seen.add(x);
  }
  return [...out];
}

const allIds = [
  ...VOCAB.map((v) => v.id),
  ...GRAMMAR.map((g) => g.id),
  ...questionIds,
];
const dup = dupes(allIds);
if (dup.length) {
  fail(
    `id 가 겹칩니다: ${dup.join(", ")}\n` +
      `    복습 카드는 id 하나로 항목을 찾습니다. 겹치면 엉뚱한 것이 나옵니다.`,
  );
}

// ── 4. 어휘 ───────────────────────────────────────────────────────
for (const v of VOCAB) {
  if (!v.word.trim()) fail(`어휘 ${v.id}: 단어가 비었습니다`);
  if (!v.meaning.trim()) fail(`어휘 ${v.id}: 뜻이 비었습니다`);
  if (!v.example.trim()) fail(`어휘 ${v.id}: 예문이 없습니다`);
  if (!v.exampleKo.trim()) fail(`어휘 ${v.id}: 예문 해석이 없습니다`);

  // 예문에 그 단어가 없으면 예문 구실을 못 한다 (활용형까지 감안해 앞 4글자로 본다)
  // résumé 처럼 강세 부호가 붙은 말은 부호를 떼고 견준다
  const plain = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // 단어에서 떼어 낸 글자는 예문에서도 똑같이 떼고 견준다.
  // 안 그러면 on-site 처럼 붙임표가 든 말이 "예문에 없다"고 잘못 걸린다.
  const letters = (s: string) => plain(s).replace(/[^a-z ]/g, "");
  // apply → applied 처럼 y 가 i 로 바뀌는 활용도 같은 말로 본다
  const stem = letters(v.word).slice(0, 4);
  const stemI = stem.replace(/y$/, "i");
  const hay = letters(v.example);
  if (stem.length >= 4 && !hay.includes(stem) && !hay.includes(stemI)) {
    fail(`어휘 ${v.id}: 예문에 "${v.word}" 가 보이지 않습니다 — ${v.example}`);
  }
  if (v.confusable) {
    if (!v.confusable.difference.trim())
      fail(`어휘 ${v.id}: 헷갈리는 짝에 무엇이 다른지가 없습니다`);
    if (v.confusable.word.trim() === v.word.trim())
      fail(`어휘 ${v.id}: 헷갈리는 짝이 자기 자신입니다`);
  }
}

/*
 * 같은 낱말·같은 뜻이 두 번 들어 있으면 안 된다.
 *
 * 목록에 같은 낱말이 두 번 나오는 것만으로도 흉하지만, 진짜 문제는 어휘
 * 시험이다. 뜻을 주고 낱말을 고르게 하는데 같은 뜻을 가진 낱말이 선택지에
 * 나란히 서면 답이 둘이 된다. 실제로 v-forego(=v-forgo), v-in-lieu
 * (=v-in-lieu-of), v-thorough-adv(=v-promptly) 가 그렇게 들어가 있었다.
 */
const byWord = new Map<string, string[]>();
const byMeaning = new Map<string, string[]>();
for (const v of VOCAB) {
  const w = v.word.trim().toLowerCase();
  const m = v.meaning.trim();
  byWord.set(w, [...(byWord.get(w) ?? []), v.id]);
  byMeaning.set(m, [...(byMeaning.get(m) ?? []), v.id]);
}
for (const [w, ids] of byWord) {
  if (ids.length > 1) fail(`어휘: "${w}" 가 ${ids.length}번 들어 있습니다 — ${ids.join(", ")}`);
}
/*
 * 한쪽이 다른 쪽으로 시작하는 짝도 사실상 같은 항목이다.
 *
 * abide / abide by, contingent / contingent on, provisional /
 * provisional approval 처럼 뒤에 말을 하나 붙인 것을 따로 실으면
 * 목록에 같은 것이 두 번 나온다. abide 는 예문까지 "abide by" 였다.
 * 낱말이 글자로 같지 않아 위의 검사에는 안 걸린다.
 */
const words = VOCAB.map((v) => ({ id: v.id, w: v.word.trim().toLowerCase() }));
for (const a of words) {
  for (const b of words) {
    if (a.id >= b.id) continue;
    if (b.w.startsWith(`${a.w} `) || a.w.startsWith(`${b.w} `)) {
      fail(
        `어휘: "${a.w}" 와 "${b.w}" 는 사실상 같은 항목입니다 — ${a.id}, ${b.id}`,
      );
    }
  }
}

for (const [m, ids] of byMeaning) {
  if (ids.length > 1)
    fail(
      `어휘: 뜻 "${m}" 이 ${ids.length}번 들어 있습니다 — ${ids.join(", ")}\n` +
        `    뜻을 주고 낱말을 고르는 문제에서 답이 둘이 됩니다.`,
    );
}

/*
 * id 와 낱말이 어긋난 것도 짚어 준다.
 *
 * 막지는 않는다 — 한 번 내보낸 id 는 바꿀 수 없어서, 낱말만 갈아 끼운
 * 자리가 실제로 있다(그런 자리에는 왜 그런지 주석을 달아 두었다).
 * 다만 새로 쓰다가 실수로 어긋난 것과 구별이 안 되므로 눈에는 띄게 한다.
 */
const mismatched = VOCAB.filter((v) => {
  // -alt · -n · -v · -700 처럼 일부러 붙인 꼬리표는 어긋난 것이 아니다
  if (/-(alt|n|v|adv|600|700|800|900)$/.test(v.id)) return false;
  const idPart = v.id.replace(/^v-/, "").replace(/-/g, "");
  const word = v.word.toLowerCase().replace(/[^a-z]/g, "");
  return !word.startsWith(idPart.slice(0, 4)) && !idPart.startsWith(word.slice(0, 4));
});
if (mismatched.length) {
  warn(
    `id 와 낱말이 어긋난 어휘 ${mismatched.length}개 — ` +
      mismatched
        .slice(0, 8)
        .map((v) => `${v.id}(${v.word})`)
        .join(", ") +
      (mismatched.length > 8 ? " …" : ""),
  );
}

// ── 5. 문법 ───────────────────────────────────────────────────────
for (const g of GRAMMAR) {
  if (!g.summary.trim()) fail(`문법 ${g.id}: 한 줄 요약이 없습니다`);
  if (!g.detail.trim()) fail(`문법 ${g.id}: 설명이 없습니다`);
  if (!g.examShape.trim()) fail(`문법 ${g.id}: 시험지에서의 모습이 없습니다`);
  if (!g.examples.length) fail(`문법 ${g.id}: 예문이 하나도 없습니다`);
  for (const ex of g.examples) {
    if (!ex.correct.trim()) fail(`문법 ${g.id}: 맞는 예문이 비었습니다`);
    if (!ex.ko.trim()) fail(`문법 ${g.id}: 예문 설명이 없습니다`);
    if (ex.incorrect && ex.incorrect.trim() === ex.correct.trim())
      fail(`문법 ${g.id}: 맞는 예문과 틀린 예문이 같습니다`);
  }
  if (g.trap && !g.trap.why.trim())
    fail(`문법 ${g.id}: 함정에 왜 틀리는지가 없습니다`);
}

// ── 6. 문항 ───────────────────────────────────────────────────────
type AnyQuestion = {
  id: string;
  choices: { text: string; why: string }[];
  answer: number;
  prompt?: string;
};

function checkQuestion(where: string, q: AnyQuestion, wantChoices: number) {
  if (q.choices.length !== wantChoices) {
    fail(`${where} ${q.id}: 선택지가 ${q.choices.length}개입니다 (${wantChoices}개여야 합니다)`);
  }
  if (q.answer < 0 || q.answer >= q.choices.length) {
    fail(`${where} ${q.id}: 정답 번호 ${q.answer} 가 선택지 범위를 벗어납니다`);
  }
  const texts = q.choices.map((c) => c.text.trim());
  const dupChoice = dupes(texts);
  if (dupChoice.length) {
    fail(`${where} ${q.id}: 선택지가 겹칩니다 — ${dupChoice.join(" / ")}`);
  }
  q.choices.forEach((c, i) => {
    if (!c.text.trim()) fail(`${where} ${q.id}: ${i + 1}번 선택지가 비었습니다`);
    if (!c.why.trim())
      fail(`${where} ${q.id}: ${i + 1}번 선택지에 해설이 없습니다`);
  });
  // 정답 해설에 "정답" 이라는 표시가 있어야 화면에서 헷갈리지 않는다
  const answerWhy = q.choices[q.answer]?.why ?? "";
  if (answerWhy && !answerWhy.includes("정답")) {
    fail(
      `${where} ${q.id}: 정답(${q.answer + 1}번) 해설이 "정답"으로 시작하지 않습니다 — ` +
        `오답 해설과 구분되지 않습니다`,
    );
  }
  // 오답 해설이 "정답"으로 시작하면 정답 번호를 잘못 매긴 것이다
  q.choices.forEach((c, i) => {
    if (i !== q.answer && c.why.trim().startsWith("정답")) {
      fail(`${where} ${q.id}: ${i + 1}번(오답) 해설이 "정답"으로 시작합니다 — 정답 번호를 확인하세요`);
    }
  });
}

for (const set of READING) {
  if (set.part === 6 && !set.passage?.length)
    fail(`읽기 ${set.id}: Part 6 인데 지문이 없습니다`);
  if (set.part === 7 && !set.passage?.length)
    fail(`읽기 ${set.id}: Part 7 인데 지문이 없습니다`);
  if (set.part === 5 && set.passage?.length)
    fail(`읽기 ${set.id}: Part 5 는 지문 없이 한 문장만 나옵니다`);

  for (const q of set.questions) {
    checkQuestion(`읽기 Part ${set.part}`, q, 4);
    if (set.part !== 5 && !q.prompt && q.blank === undefined) {
      fail(`읽기 ${set.id}/${q.id}: 질문도 빈칸 번호도 없습니다`);
    }
  }

  // Part 6 의 빈칸 번호가 본문의 [[n]] 과 맞는지
  if (set.part === 6) {
    const body = (set.passage ?? []).map((p) => p.body).join("\n");
    const inBody = new Set(
      [...body.matchAll(/\[\[(\d+)\]\]/g)].map((m) => Number(m[1])),
    );
    const inQuestions = new Set(
      set.questions.map((q) => q.blank).filter((b): b is number => b !== undefined),
    );
    for (const n of inBody)
      if (!inQuestions.has(n))
        fail(`읽기 ${set.id}: 본문에 빈칸 [[${n}]] 이 있는데 문항이 없습니다`);
    for (const n of inQuestions)
      if (!inBody.has(n))
        fail(`읽기 ${set.id}: 문항이 빈칸 ${n} 을 가리키는데 본문에 [[${n}]] 이 없습니다`);
  }

  // links 가 가리키는 어휘·문법이 실제로 있는지
  for (const link of set.links ?? []) {
    const exists =
      VOCAB.some((v) => v.id === link) || GRAMMAR.some((g) => g.id === link);
    if (!exists) fail(`읽기 ${set.id}: links 의 "${link}" 를 찾을 수 없습니다`);
  }
}

for (const set of LISTENING) {
  // Part 2 만 3지선다다
  const want = set.part === 2 ? 3 : 4;
  for (const q of set.questions) {
    checkQuestion(`듣기 Part ${set.part}`, q, want);
  }
  if (set.part === 1 && !set.scene)
    fail(`듣기 ${set.id}: Part 1 인데 장면 설명이 없습니다`);
  if ((set.part === 3 || set.part === 4) && !set.script?.length)
    fail(`듣기 ${set.id}: Part ${set.part} 인데 스크립트가 없습니다`);
  if (set.part === 3 && (set.script?.length ?? 0) < 2)
    fail(`듣기 ${set.id}: Part 3 은 두 사람 이상의 대화여야 합니다`);
  if (set.part === 4 && new Set(set.script?.map((l) => l.speaker)).size > 1)
    fail(`듣기 ${set.id}: Part 4 는 한 사람이 말하는 담화입니다`);
  // 들려줄 것이 하나도 없으면 문항이 성립하지 않는다
  const hasAudio =
    (set.script?.length ?? 0) > 0 ||
    set.questions.some((q) => q.audioOnlyChoices);
  if (!hasAudio) fail(`듣기 ${set.id}: 들려줄 내용이 없습니다`);

  for (const link of set.links ?? []) {
    const exists =
      VOCAB.some((v) => v.id === link) || GRAMMAR.some((g) => g.id === link);
    if (!exists) fail(`듣기 ${set.id}: links 의 "${link}" 를 찾을 수 없습니다`);
  }
}

// ── 7. 시험 구성 ──────────────────────────────────────────────────
// 파트별 문항 수 합이 실제 시험과 맞는지 (자료가 아니라 '시험 정보'가 맞는지 본다)
{
  const lc = PARTS.filter((p) => p.section === "listening").reduce((n, p) => n + p.count, 0);
  const rc = PARTS.filter((p) => p.section === "reading").reduce((n, p) => n + p.count, 0);
  if (lc !== 100) fail(`시험 구성: 듣기 문항 합이 ${lc} 입니다 (100이어야 합니다)`);
  if (rc !== 100) fail(`시험 구성: 읽기 문항 합이 ${rc} 입니다 (100이어야 합니다)`);
}

// 환산 점수는 5~495 를 벗어나면 안 된다
for (const [c, t] of [
  [0, 10],
  [5, 10],
  [10, 10],
  [1, 3],
] as const) {
  const s = scaledScore(c, t);
  if (s < 5 || s > 495) fail(`환산 점수: ${c}/${t} → ${s} (5~495 밖입니다)`);
  if (s % 5 !== 0) fail(`환산 점수: ${c}/${t} → ${s} (5점 단위가 아닙니다)`);
}

// 모의고사가 실제로 만들어지는지 — 목표 점수대마다
for (const band of [600, 700, 800, 900] as Band[]) {
  for (const e of EXAMS) {
    const exam = buildExam(e.id, band, 7);
    if (exam.items.length === 0) {
      fail(`모의고사: ${band}점 목표의 "${e.name}" 에 낼 문항이 없습니다`);
      continue;
    }
    if (exam.minutes <= 0) fail(`모의고사: ${e.name} 의 제한 시간이 0분입니다`);
    const ids = exam.items.map((i) => i.questionId);
    const d = dupes(ids);
    if (d.length) fail(`모의고사: ${e.name} 에 같은 문항이 두 번 나옵니다 — ${d.join(", ")}`);
  }
}

// ── 8. 모의고사가 실제 시험을 닮았는가 ────────────────────────────
// 여기까지는 "자료가 성한가"를 봤다. 아래는 "시험지가 시험 같은가"를 본다.
// 이것이 어긋나면 앱이 멀쩡히 돌아가면서도 연습이 헛것이 된다.
{
  const REAL: Record<number, number> = { 1: 6, 2: 25, 3: 39, 4: 30, 5: 30, 6: 16, 7: 54 };

  // (1) 설계표가 실제 시험의 비율을 따르는가 — 파트마다 ±25% 안
  for (const [p, want] of Object.entries(BLUEPRINT)) {
    const share = want / Object.values(BLUEPRINT).reduce((a, b) => a + b, 0);
    const realShare = REAL[+p] / 200;
    const off = Math.abs(share - realShare) / realShare;
    if (off > 0.25) {
      fail(
        `모의고사 구성: Part ${p} 가 한 벌의 ${(share * 100).toFixed(1)}% 입니다 ` +
          `(실제 시험은 ${(realShare * 100).toFixed(1)}%). 비율이 어긋나면 연습이 실전과 달라집니다.`,
      );
    }
  }

  // (2) 문제 은행이 한 벌을 채우고도 남는가 — 남지 않으면 매번 같은 시험지가 된다
  for (const [p, want] of Object.entries(BLUEPRINT)) {
    const pool = [...LISTENING, ...READING]
      .filter((s) => s.part === +p)
      .reduce((n, s) => n + s.questions.length, 0);
    if (pool < want) {
      fail(`문제 은행: Part ${p} 은 ${pool}문항뿐인데 한 벌에 ${want}문항이 필요합니다`);
    } else if (pool < want * 1.5) {
      notes.push(
        `Part ${p} 은 ${pool}문항으로 한 벌(${want})의 ${(pool / want).toFixed(1)}배뿐입니다 — ` +
          `다시 응시하면 겹치는 문항이 많아집니다`,
      );
    }
  }

  // (3) 응시할 때마다 시험지가 달라지는가
  {
    const a = buildExam("full", 900 as Band, 1).items.map((i) => i.questionId);
    const b = buildExam("full", 900 as Band, 987_654).items.map((i) => i.questionId);
    const setB = new Set(b);
    const overlap = a.filter((id) => setB.has(id)).length / a.length;
    if (overlap > 0.7) {
      fail(
        `모의고사: 다른 seed 인데 문항이 ${(overlap * 100).toFixed(0)}% 겹칩니다. ` +
          `두 번째 응시가 답을 외운 시험지가 됩니다.`,
      );
    }
    // 같은 seed 는 반드시 같은 시험지여야 한다 (이어 풀기·오답 노트가 여기에 기댄다)
    const again = buildExam("full", 900 as Band, 1).items.map((i) => i.questionId);
    if (again.join() !== a.join()) {
      fail("모의고사: 같은 seed 인데 시험지가 달라집니다 — 이어 풀기와 오답 노트가 어긋납니다");
    }
  }

  // (4) 정답이 한 자리에 몰려 있지 않은가
  //     사람이 손으로 쓰면 정답이 (B)(C) 로 몰리기 쉽다. 몰리면 지문을 읽지
  //     않고도 찍어서 맞는다.
  {
    const four: number[] = [];
    const three: number[] = [];
    for (const s of [...LISTENING, ...READING]) {
      for (const q of s.questions) {
        (q.choices.length === 3 ? three : four).push(q.answer);
      }
    }
    const check = (list: number[], n: number, label: string) => {
      if (list.length < 30) return;
      for (let i = 0; i < n; i++) {
        const share = list.filter((v) => v === i).length / list.length;
        const even = 1 / n;
        if (share < even * 0.6 || share > even * 1.6) {
          fail(
            `${label}: 정답이 ${"ABCD"[i]} 인 문항이 ${(share * 100).toFixed(0)}% 입니다 ` +
              `(고르면 ${(even * 100).toFixed(0)}%). 한쪽으로 몰리면 찍어서 맞습니다.`,
          );
        }
      }
    };
    check(four, 4, "4지선다");
    check(three, 3, "3지선다 (Part 2)");
  }

  // (5) 한 벌이 실제 시험의 파트 순서대로 나오는가
  {
    const parts = buildExam("full", 900 as Band, 42).items.map((i) => i.part);
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] < parts[i - 1]) {
        fail("모의고사: 파트 순서가 뒤섞였습니다 — 실제 시험은 Part 1 부터 7 까지 차례로 나옵니다");
        break;
      }
    }
  }

  // (6) 오답 노트가 시험지를 되살릴 수 있는가
  //     저장하는 것은 seed 와 문항 id 뿐이다. 그것으로 같은 시험지가 나오지
  //     않으면 노트가 엉뚱한 문제를 "당신이 틀린 문제"라고 내밀게 된다.
  {
    const made = buildExam("rc", 900 as Band, 24_601);
    const qids = made.items.map((i) => i.questionId);
    const again = buildExam("rc", 900 as Band, 24_601);
    if (again.items.some((it, i) => it.questionId !== qids[i])) {
      fail("오답 노트: 같은 seed 로 시험지를 되살리지 못합니다");
    }
    if (again.items.some((it, i) => answerOf(it) !== answerOf(made.items[i]))) {
      fail("오답 노트: 되살린 시험지의 정답 번호가 달라집니다");
    }
  }
}

// ── 마무리 ────────────────────────────────────────────────────────
const lcQ = LISTENING.reduce((n, s) => n + s.questions.length, 0);
const rcQ = READING.reduce((n, s) => n + s.questions.length, 0);
console.log(
  `어휘 ${VOCAB.length}개 · 문법 ${GRAMMAR.length}개 · ` +
    `듣기 ${LISTENING.length}지문 ${lcQ}문항 · 읽기 ${READING.length}세트 ${rcQ}문항`,
);
for (const n of notes) console.log(`  ${n}`);

const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`\n문제 ${unique.length}건`);
  for (const p of unique) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log("\n✓ 이상 없음");
