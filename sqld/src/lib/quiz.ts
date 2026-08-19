import type { Concept, QuizQuestion, QuizType, SubjectId } from "./types";
import { CONCEPTS } from "@/data/concepts";
import { SQL_QUIZ } from "@/data/sql-quiz";
import { shuffleSeeded, splitSentences } from "./utils";

/**
 * 문제 생성기.
 *
 * 문제를 손으로 다 써 두면 몇백 개에서 멈추고, 같은 문제를 다시 만나
 * 답을 외워 버린다. 그래서 개념 데이터에서 만들어 낸다.
 *
 * 자동 생성이 실패하는 방식은 둘뿐이다.
 *   1) 지문이 답을 흘린다 — 읽지 않고도 맞힌다
 *   2) 오답이 딴 소리다 — 읽지 않고도 맞힌다
 * 1번은 가리거나 만들지 않는 것으로, 2번은 개념마다 적어 둔
 * "뒤바꾼 틀린 설명(trap.wrong)"을 오답으로 써서 막는다.
 */

const MASK = "◯◯◯";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * 보기·발문에 쓰는 이름.
 *
 * 개념의 title 은 목차 제목이라 "데이터 모델링을 하는 이유와 세 가지 유의점"
 * 처럼 길고, 그대로 선지가 되면 시험지가 아니라 차례처럼 보인다.
 * 그래서 개념마다 적어 둔 짧은 용어(term)를 쓴다.
 */
export function termOf(c: Concept): string {
  return c.term;
}

/** 제목에서 대시 뒤를 떼어 낸 것 — 지문에서 답이 새는지 볼 때만 쓴다 */
export function shortTitle(title: string): string {
  const cut = title.split(" — ")[0].trim();
  return cut.length >= 2 ? cut : title;
}

/**
 * 제목에서 뜻이 있는 낱말만.
 * 조사를 떼되, 떼고 나서 한 글자만 남으면 원래 낱말을 그대로 둔다.
 */
function titleTokens(title: string): string[] {
  return title
    .split(/[\s·,()—\-–~/]+/)
    .map((raw) => {
      const t = raw.trim();
      const stem = t.replace(/(의|과|와|은|는|이|가)$/, "");
      return stem.length >= 2 ? stem : t;
    })
    .filter((t) => t.length >= 2);
}

function maskName(passage: string, name: string): string | null {
  let out = passage;
  let masked = 0;
  for (const tok of titleTokens(name)) {
    if (!out.includes(tok)) continue;
    const before = out;
    out = out.split(tok).join(MASK);
    masked += before.split(tok).length - 1;
  }
  if (masked === 0) return passage;
  if (masked > 3) return null;
  if (out.split(MASK).join("").length < passage.length * 0.5) return null;
  return out;
}

function leaks(passage: string, answer: string): boolean {
  return titleTokens(answer).some((t) => passage.includes(t));
}

/** 앞 문장 없이도 혼자 말이 되는 문장인가 */
function standalone(s: string): boolean {
  return !/^(여기|이때|이를|이는|이것|이 |그 |그러면|그래서|그리고|그러나|반면|다만|또한|또 |대신|즉|반대로|예를 들어|따라서|주의|특히)/.test(
    s,
  );
}

/** 같은 과목의 다른 개념 — 같은 장을 먼저 (더 헷갈리는 오답) */
function neighbors(c: Concept, all: Concept[]): Concept[] {
  const others = all.filter((o) => o.id !== c.id && o.subject === c.subject);
  return [
    ...others.filter((o) => o.chapter === c.chapter),
    ...others.filter((o) => o.chapter !== c.chapter),
  ];
}

interface Distractor {
  text: string;
  note: string;
}

function build(
  id: string,
  type: QuizType,
  c: Concept,
  question: string,
  passage: string | undefined,
  correct: string,
  wrong: Distractor[],
  explanation: string,
  passageIsSql = false,
): QuizQuestion | null {
  const seen = new Set([correct]);
  const distinct = wrong.filter((w) => {
    if (seen.has(w.text)) return false;
    seen.add(w.text);
    return true;
  });
  if (distinct.length < 3) return null;

  // 글과 풀이를 함께 섞는다 — 따로 섞으면 짝이 어긋난다
  const pairs = shuffleSeeded(
    [{ text: correct, note: null as string | null }, ...distinct.slice(0, 3)],
    hash(id),
  );
  return {
    id,
    type,
    sourceId: c.id,
    subject: c.subject,
    question,
    passage,
    passageIsSql,
    options: pairs.map((p) => p.text),
    answerIndex: pairs.findIndex((p) => p.text === correct),
    explanation,
    optionNotes: pairs.map((p) => p.note),
    importance: c.importance,
  };
}

// ── 유형 1. 설명을 보고 무엇인지 고르기 ───────────────────────────
function makeMultiple(c: Concept, all: Concept[]): QuizQuestion | null {
  const name = termOf(c);
  // 제목과 용어 양쪽으로 가린다 — 어느 쪽이 지문에 남아도 답이 새어 나간다
  const masked = maskName(c.summary, name);
  const passage = masked === null ? null : maskName(masked, shortTitle(c.title));
  if (!passage) return null;
  const wrong = neighbors(c, all)
    .filter((o) => !leaks(passage, termOf(o)))
    .map((o) => ({
      text: termOf(o),
      note: `'${termOf(o)}' — ${o.summary}`,
    }));
  return build(
    `q-mul-${c.id}`,
    "multiple",
    c,
    "다음 중 아래 설명에 해당하는 것으로 가장 적절한 것은?",
    passage,
    name,
    wrong,
    `${c.summary} (${c.title})`,
  );
}

// ── 유형 2. 옳지 않은 것 고르기 ────────────────────────────────────
function makeNegative(c: Concept): QuizQuestion | null {
  const trap = c.traps.find((t) => t.wrong && t.wrong.length > 10);
  if (!trap) return null;

  const trues: Distractor[] = [
    { text: c.summary, note: "개념의 정의 그대로다. 맞는 설명이다." },
    ...splitSentences(c.detail)
      .filter((s) => s.length >= 20 && s.length <= 130 && standalone(s))
      .map((s) => ({ text: s, note: "본문에 나오는 설명이다. 맞는 설명이다." })),
    ...c.traps.map((t) => ({
      text: t.difference,
      note: `'${t.concept}'을 바르게 설명한 문장이다. 맞는 설명이다.`,
    })),
  ]
    .filter((s) => s.text !== trap.difference)
    .slice(0, 3);
  if (trues.length < 3) return null;

  const id = `q-neg-${c.id}`;
  const pairs = shuffleSeeded(
    [{ text: trap.wrong, note: null as string | null }, ...trues],
    hash(id),
  );
  return {
    id,
    type: "negative",
    sourceId: c.id,
    subject: c.subject,
    question: `다음 중 ${termOf(c)}에 대한 설명으로 가장 적절하지 않은 것은?`,
    options: pairs.map((p) => p.text),
    answerIndex: pairs.findIndex((p) => p.text === trap.wrong),
    explanation:
      `'${trap.concept}'의 설명을 서로 맞바꿔 놓은 선지다. ` +
      `바르게 고치면 — ${trap.difference}`,
    optionNotes: pairs.map((p) => p.note),
    importance: c.importance,
  };
}

// ── 유형 3. 빈칸 채우기 ────────────────────────────────────────────
function pickBlank(c: Concept): { keyword: string; sentence: string } | null {
  const sentences = [...splitSentences(c.detail), ...splitSentences(c.examPoint)].filter(
    (s) => s.length >= 20 && s.length <= 150 && standalone(s),
  );
  for (const keyword of c.keywords) {
    if (keyword.length < 2) continue;
    const glued = new RegExp(
      `[가-힣A-Za-z0-9]${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    );
    for (const s of sentences) {
      if (!s.includes(keyword)) continue;
      if (glued.test(s)) continue; // 낱말 가운데가 잘린다
      return { keyword, sentence: s };
    }
  }
  return null;
}

function makeBlank(c: Concept, all: Concept[]): QuizQuestion | null {
  const picked = pickBlank(c);
  if (!picked) return null;
  const { keyword, sentence } = picked;
  const passage = sentence.split(keyword).join("____");

  const wrong: Distractor[] = neighbors(c, all)
    .flatMap((o) => o.keywords.map((k) => ({ k, o })))
    .filter(
      ({ k }) =>
        k !== keyword &&
        !k.includes(keyword) &&
        !keyword.includes(k) &&
        !passage.includes(k),
    )
    .map(({ k, o }) => ({
      text: k,
      note: `'${k}' — '${shortTitle(o.title)}'에 나오는 말이다.`,
    }));

  return build(
    `q-blank-${c.id}`,
    "blank",
    c,
    "다음 ( ) 안에 들어갈 말로 가장 적절한 것은?",
    passage,
    keyword,
    wrong,
    `${sentence} (${c.title})`,
  );
}

// ── 유형 4. 헷갈리는 둘 구분하기 ───────────────────────────────────

/** 두 문장이 같은 것을 이야기하는가 — 겹치는 낱말 수로 본다 */
function related(a: string, b: string): number {
  const words = (t: string) =>
    new Set(
      t
        .split(/[\s·,.()'"”“·—\-–~/]+/)
        .map((w) => w.replace(/(은|는|이|가|을|를|의|에|와|과|로|으로|도)$/, ""))
        .filter((w) => w.length >= 2),
    );
  const A = words(a);
  let hit = 0;
  for (const w of words(b)) if (A.has(w)) hit++;
  return hit;
}

/**
 * '헷갈리는 둘' 문제.
 *
 * 오답을 아무 개념에서나 끌어오면 문제가 되지 않는다. NOT IN 을 묻는데
 * 보기에 COUNT 이야기가 섞여 있으면, 읽지 않고도 남은 하나가 답이다.
 * 그래서 오답은
 *   1) 같은 개념의 다른 함정  (가장 헷갈린다)
 *   2) 묻는 문장과 낱말이 겹치는 남의 함정
 * 순으로만 고르고, 겹치는 낱말이 없는 것은 아예 쓰지 않는다.
 */
function makeTrap(c: Concept, all: Concept[], index: number): QuizQuestion | null {
  const trap = c.traps[index];
  if (!trap) return null;
  const topic = `${trap.concept} ${trap.difference}`;

  const mine: Distractor[] = c.traps
    .filter((t) => t.difference !== trap.difference)
    .map((t) => ({
      text: t.difference,
      note: `같은 갈래의 다른 짝('${t.concept}')을 설명한 문장이다. 지금 묻는 것은 '${trap.concept}'이다.`,
    }));

  const borrowed: Distractor[] = neighbors(c, all)
    .flatMap((o) => o.traps)
    .filter((t) => t.difference !== trap.difference)
    // 소재가 아예 다른 문장은 오답 구실을 못 한다 — 읽지 않고도 걸러진다
    .filter((t) => related(topic, `${t.concept} ${t.difference}`) >= 2)
    .sort(
      (x, y) =>
        related(topic, `${y.concept} ${y.difference}`) -
        related(topic, `${x.concept} ${x.difference}`),
    )
    .map((t) => ({
      text: t.difference,
      note: `'${t.concept}'을 설명한 문장이다. 지금 묻는 것은 '${trap.concept}'이다.`,
    }));

  return build(
    `q-trap-${c.id}-${index}`,
    "trap",
    c,
    // "A vs B" 는 메모의 표기다. 시험지에는 그렇게 적히지 않는다.
    `다음 중 ${trap.concept.replace(/\s*vs\s*/g, " 와 ")}에 대한 설명으로 가장 적절한 것은?`,
    undefined,
    trap.difference,
    [
      {
        text: trap.wrong,
        note: "둘의 설명을 서로 맞바꿔 놓은 것이다. 소재가 같아 그럴듯해 보이지만 방향이 반대다.",
      },
      ...mine,
      ...borrowed,
    ],
    `보기에는 둘을 맞바꿔 놓은 설명이 함께 들어 있다. 소재가 아니라 방향을 본다. (${c.title})`,
  );
}

/**
 * 쿼리를 주고 결과를 묻는 문제.
 *
 * 실제 시험지의 2과목은 이런 문제가 큰 몫을 차지한다. 손으로 적어 둔
 * 것이라 개념에서 만들어 내지 않고 그대로 쓴다.
 */
function sqlResultQuestions(subject?: SubjectId): QuizQuestion[] {
  if (subject && subject !== "sql") return [];
  return SQL_QUIZ.map((it) => {
    const pairs = shuffleSeeded(
      [
        { text: it.answer, note: null as string | null },
        ...it.wrong.map((w) => ({ text: w, note: "결과를 잘못 셈한 것이다." })),
      ],
      hash(it.id),
    );
    return {
      id: it.id,
      type: "sql-result" as QuizType,
      sourceId: it.links[0] ?? it.id,
      subject: it.subject,
      question: it.question,
      passage: it.sql,
      passageIsSql: true,
      options: pairs.map((p) => p.text),
      answerIndex: pairs.findIndex((p) => p.text === it.answer),
      explanation: it.explanation,
      optionNotes: pairs.map((p) => p.note),
      importance: it.importance,
    };
  });
}

/** 한 개념에서 만들 수 있는 문제 전부 */
export function questionsFor(c: Concept, all: Concept[] = CONCEPTS): QuizQuestion[] {
  const out: (QuizQuestion | null)[] = [
    makeMultiple(c, all),
    makeNegative(c),
    makeBlank(c, all),
    ...c.traps.map((_, i) => makeTrap(c, all, i)),
  ];
  return out.filter((q): q is QuizQuestion => q !== null);
}

/** 과목에 맞는 문제 은행 전체 */
/**
 * 한 회차에 나올 수 있는 문항 수의 웃돌이.
 *
 * 문제 은행의 크기(questionBank().length)와는 다르다. 한 개념에서
 * 여러 유형을 만들 수 있지만 makeQuiz 는 한 회차에 같은 개념을 거듭
 * 내지 않는다 — 앞 문제의 보기가 뒤 문제의 답이 되기 때문이다.
 * 그래서 실제로 뽑히는 수는 **문제를 낼 수 있는 개념의 수**에 가깝다.
 *
 * 화면에 은행 크기를 적어 두었더니 실제의 두 배 넘는 숫자가 나왔다
 * (261 이라고 적혀 있었지만 실제로는 107). 고를 수 있는 최대가 30
 * 이라 기능이 깨지지는 않았지만, 적힌 숫자가 사실이 아니었다.
 */
export function quizConceptCount(subject?: SubjectId): number {
  return CONCEPTS.filter(
    (c) => (!subject || c.subject === subject) && questionsFor(c).length > 0,
  ).length;
}

export function questionBank(subject?: SubjectId): QuizQuestion[] {
  const targets = subject ? CONCEPTS.filter((c) => c.subject === subject) : CONCEPTS;
  return [
    ...targets.flatMap((c) => questionsFor(c, CONCEPTS)),
    ...sqlResultQuestions(subject),
  ];
}

export interface QuizOptions {
  subject?: SubjectId;
  count?: number;
  /** 이 개념들만 (오답노트·복습에서 쓴다) */
  onlySourceIds?: string[];
  seed?: number;
}

/**
 * 유형을 얼마나 자주 낼 것인가 (서로 견주는 값).
 *
 * '헷갈리는 둘'은 개념마다 두세 개씩 만들어져 그냥 두면 시험지의 절반을
 * 차지한다. 실제 시험지는 옳고 그름을 가리는 문제가 가장 많고, 정의를
 * 묻는 문제와 용어를 채우는 문제가 뒤를 잇는다. 그 비율에 맞춘다.
 */
const TYPE_WEIGHT: Partial<Record<QuizType, number>> = {
  negative: 3,
  multiple: 3,
  trap: 2,
  blank: 2,
  // 쿼리를 주고 결과를 묻는 문제는 손으로 적어 둔 만큼만 있다.
  // 있는 대로 다 나오도록 가중치를 높게 준다 — 시험지에서 가장 시험지답다.
  "sql-result": 6,
};

/**
 * 출제.
 *
 * 중요도가 높은 개념이 더 자주 나오되, 낮은 개념도 반드시 섞인다.
 * 한 개념에서 두 문제가 연달아 나오면 앞 문제의 보기가 뒤 문제의 답이
 * 되므로, 같은 개념은 한 번씩만 담는다.
 */
export function makeQuiz(opts: QuizOptions): QuizQuestion[] {
  const { subject, count = 10, onlySourceIds, seed = Date.now() } = opts;
  let bank = questionBank(subject);
  if (onlySourceIds?.length) {
    bank = bank.filter((q) => onlySourceIds.includes(q.sourceId));
  }
  if (bank.length === 0) return [];

  const shuffled = shuffleSeeded(bank, seed);
  shuffled.sort((a, b) => b.importance - a.importance);

  const picked: QuizQuestion[] = [];
  const used = new Set<string>();
  const typeCount: Partial<Record<QuizType, number>> = {};
  for (const q of shuffled) {
    if (used.has(q.sourceId)) continue;
    used.add(q.sourceId);
    // 그 개념에서 만들 수 있는 문제들 중 아직 적게 나온 유형을 고른다.
    // 그러지 않으면 '헷갈리는 둘'이 개념마다 여러 개씩 있어 시험지의
    // 절반을 차지한다 — 실제 시험지는 그렇게 생기지 않았다.
    const mates = shuffled.filter((x) => x.sourceId === q.sourceId);
    const best = mates.reduce((a, b) =>
      (typeCount[a.type] ?? 0) / (TYPE_WEIGHT[a.type] ?? 1) <=
      (typeCount[b.type] ?? 0) / (TYPE_WEIGHT[b.type] ?? 1)
        ? a
        : b,
    );
    typeCount[best.type] = (typeCount[best.type] ?? 0) + 1;
    picked.push(best);
    if (picked.length >= count) break;
  }

  // 개념 수보다 많이 달라고 하면 남은 문제로 채운다.
  // 이때 '옳지 않은 것'과 '헷갈리는 둘'을 같은 개념에서 함께 내면
  // 앞 문제의 보기가 뒤 문제의 답이 되어 버린다.
  if (picked.length < count) {
    const byConcept = new Map<string, QuizQuestion[]>();
    for (const q of picked) {
      byConcept.set(q.sourceId, [...(byConcept.get(q.sourceId) ?? []), q]);
    }
    for (const q of shuffled) {
      if (picked.includes(q)) continue;
      const mates = byConcept.get(q.sourceId) ?? [];
      if (mates.length >= 2) continue;
      if (q.type === "negative" || mates.some((m) => m.type === "negative")) continue;
      picked.push(q);
      byConcept.set(q.sourceId, [...mates, q]);
      if (picked.length >= count) break;
    }
  }
  return shuffleSeeded(picked, seed + 1);
}

/**
 * 모의고사 한 벌.
 *
 * 실제 시험은 1과목 10문항 + 2과목 40문항이다. 과목별 과락이 있으므로
 * 과목을 섞지 않고 순서대로 담아, 결과 화면에서 과목별 점수를 그대로
 * 보여 줄 수 있게 한다.
 */
export function makeMock(seed = Date.now()): QuizQuestion[] {
  return [
    ...makeQuiz({ subject: "modeling", count: 10, seed }),
    ...makeQuiz({ subject: "sql", count: 40, seed: seed + 1000 }),
  ];
}

export const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  multiple: "개념 찾기",
  negative: "옳지 않은 것",
  blank: "빈칸",
  trap: "헷갈리는 둘",
  "sql-result": "결과 맞히기",
  "sql-write": "직접 쓰기",
};
