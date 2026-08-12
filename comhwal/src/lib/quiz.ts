import type { Concept, Grade, QuizQuestion, QuizType, SubjectId } from "./types";
import { CONCEPTS, conceptsFor } from "@/data/concepts";
import { shuffleSeeded, splitSentences } from "./utils";

/**
 * 필기 문제 생성기.
 *
 * 문제를 손으로 다 써 두면 몇백 개에서 멈추고, 같은 문제를 다시 만나
 * 답을 외워 버린다. 그래서 개념 데이터에서 문제를 만들어 낸다.
 *
 * 자동 생성이 실패하는 방식은 둘뿐이다.
 *   1) 지문이 답을 흘린다 — 읽지 않고도 맞힌다
 *   2) 오답이 딴 소리다 — 읽지 않고도 맞힌다
 * 아래 생성기들은 둘 다 막는다. 1번은 가리거나 만들지 않는 것으로,
 * 2번은 개념마다 적어 둔 "뒤바꾼 틀린 설명(trap.wrong)"을 오답으로
 * 써서 막는다. 실제 시험의 오답 선지가 딱 그 모양이다.
 */

const MASK = "◯◯◯";

/** 문자열을 숫자로 — 같은 문제는 늘 같은 보기 순서를 갖게 한다 */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * 보기로 쓸 짧은 이름.
 *
 * 제목을 그대로 보기에 넣으면 "CPU의 구성 — 제어장치·연산장치·레지스터"
 * 처럼 대시 뒤에 답이 다 적혀 있어, 지문을 가려 봐야 소용이 없다.
 * 대시 앞의 이름만 쓴다.
 */
export function shortTitle(title: string): string {
  const cut = title.split(" — ")[0].trim();
  return cut.length >= 2 ? cut : title;
}

/** 제목에서 뜻이 있는 낱말만 (조사·기호는 버린다) */
function titleTokens(title: string): string[] {
  return title
    .split(/[\s·,()—\-–~/]+/)
    .map((t) => t.replace(/(의|과|와|은|는|이|가)$/, "").trim())
    .filter((t) => t.length >= 2);
}

/**
 * 지문에서 답이 될 낱말을 가린다.
 * 너무 많이 가리면 문제가 아니라 수수께끼가 되므로, 가린 자리가 셋을
 * 넘거나 원문이 절반 넘게 사라지면 실패로 본다.
 */
function maskName(passage: string, name: string): string | null {
  let out = passage;
  let masked = 0;
  for (const tok of titleTokens(name)) {
    if (!out.includes(tok)) continue;
    const before = out;
    out = out.split(tok).join(MASK);
    masked += before.split(tok).length - 1;
  }
  if (masked === 0) return passage; // 애초에 새지 않았다
  if (masked > 3) return null;
  const kept = out.split(MASK).join("").length;
  if (kept < passage.length * 0.5) return null;
  return out;
}

/** 지문에 답 낱말이 그대로 남아 있는가 */
function leaks(passage: string, answer: string): boolean {
  return titleTokens(answer).some((t) => passage.includes(t));
}

/**
 * 앞 문장 없이도 혼자 말이 되는 문장인가.
 *
 * 본문에서 문장을 하나 떼어 선지로 쓰면, "여기에 최소성까지 갖추면
 * 후보키가 된다" 처럼 앞을 가리키는 문장이 뜬금없이 튀어나온다.
 * 지시어로 시작하는 문장은 쓰지 않는다.
 */
function standalone(s: string): boolean {
  return !/^(여기|이때|이를|이는|이것|이 |그 |그러면|그래서|그리고|그러나|반면|다만|또한|또 |대신|즉|반대로|예를 들어|따라서)/.test(
    s,
  );
}

/** 같은 과목의 다른 개념 — 같은 갈래를 먼저 (더 헷갈리는 오답) */
function neighbors(c: Concept, all: Concept[]): Concept[] {
  const others = all.filter((o) => o.id !== c.id);
  return [
    ...others.filter((o) => o.topic === c.topic),
    ...others.filter((o) => o.topic !== c.topic),
  ];
}

function build(
  id: string,
  type: QuizType,
  c: Concept,
  grade: Grade,
  question: string,
  passage: string | undefined,
  correct: string,
  wrong: string[],
  explanation: string,
): QuizQuestion | null {
  const distinct = wrong.filter((w) => w !== correct);
  if (distinct.length < 3) return null;
  const options = shuffleSeeded([correct, ...distinct.slice(0, 3)], hash(id));
  return {
    id,
    type,
    sourceId: c.id,
    subject: c.subject,
    grade,
    question,
    passage,
    options,
    answerIndex: options.indexOf(correct),
    explanation,
    importance: c.importance,
  };
}

// ── 유형 1. 설명을 보고 개념 고르기 ────────────────────────────────
function makeMultiple(c: Concept, all: Concept[], grade: Grade): QuizQuestion | null {
  const name = shortTitle(c.title);
  const passage = maskName(c.summary, name);
  if (!passage) return null;
  const wrong = neighbors(c, all)
    .map((o) => shortTitle(o.title))
    .filter((t) => !leaks(passage, t));
  return build(
    `q-mul-${c.id}`,
    "multiple",
    c,
    grade,
    "다음 설명에 해당하는 것은?",
    passage,
    name,
    wrong,
    `${c.summary} (${c.title})`,
  );
}

// ── 유형 2. 옳지 않은 것 고르기 ────────────────────────────────────
/**
 * 같은 개념의 참인 설명 셋과, 그 개념을 뒤바꾼 틀린 설명 하나를 섞는다.
 *
 * 참 보기는 요약과 본문 문장에서만 가져온다. 시험 포인트("…선지가
 * 반복 출제된다")는 공부 요령이지 시험 선지가 아니라서 뺀다.
 */
function makeNegative(c: Concept, grade: Grade): QuizQuestion | null {
  const trap = c.traps.find((t) => t.wrong && t.wrong.length > 10);
  if (!trap) return null;

  const trues = [
    c.summary,
    ...splitSentences(c.detail).filter(
      (s) => s.length >= 20 && s.length <= 120 && standalone(s),
    ),
    ...c.traps.map((t) => t.difference),
  ]
    // 틀린 보기와 겹치는 말이 참 보기에 그대로 있으면 비교가 되지 않는다
    .filter((s) => s !== trap.difference)
    .slice(0, 3);
  if (trues.length < 3) return null;

  const id = `q-neg-${c.id}`;
  const options = shuffleSeeded([trap.wrong, ...trues], hash(id));
  return {
    id,
    type: "negative",
    sourceId: c.id,
    subject: c.subject,
    grade,
    question: `${shortTitle(c.title)}에 대한 설명으로 옳지 않은 것은?`,
    options,
    answerIndex: options.indexOf(trap.wrong),
    explanation: `바르게 고치면 — ${trap.difference}`,
    importance: c.importance,
  };
}

// ── 유형 3. 빈칸 채우기 ────────────────────────────────────────────
/**
 * 답이 들어 있는 문장 하나만 지문으로 쓴다.
 * 본문을 통째로 붙이면 빈칸 하나 채우려고 다섯 줄을 읽어야 한다.
 *
 * 낱말 앞이 한글·영문이면 그 자리는 쓰지 않는다. '비휘발성'의
 * '휘발성'을 가리면 "비____"가 되어 문제가 되지 않기 때문이다.
 */
function pickBlank(
  c: Concept,
): { keyword: string; sentence: string } | null {
  const sentences = [
    ...splitSentences(c.detail),
    ...splitSentences(c.examPoint),
  ].filter((s) => s.length >= 20 && s.length <= 140 && standalone(s));

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

function makeBlank(c: Concept, all: Concept[], grade: Grade): QuizQuestion | null {
  const picked = pickBlank(c);
  if (!picked) return null;
  const { keyword, sentence } = picked;

  // 같은 문장에 여러 번 나오면 전부 가린다 — 한 번만 가리면 옆에서 보인다
  const passage = sentence.split(keyword).join("____");

  const wrong = neighbors(c, all)
    .flatMap((o) => o.keywords)
    .filter(
      (k) =>
        k !== keyword &&
        !k.includes(keyword) &&
        !keyword.includes(k) &&
        !passage.includes(k),
    );

  return build(
    `q-blank-${c.id}`,
    "blank",
    c,
    grade,
    "빈칸에 들어갈 말로 알맞은 것은?",
    passage,
    keyword,
    [...new Set(wrong)],
    `${sentence} (${c.title})`,
  );
}

// ── 유형 4. 헷갈리는 둘 구분하기 ───────────────────────────────────
/**
 * 오답 하나는 반드시 같은 짝을 뒤바꾼 설명이다.
 * 그래야 소재만 보고 고르지 못하고 실제로 방향을 따져야 한다.
 */
function makeTrap(
  c: Concept,
  all: Concept[],
  grade: Grade,
  index: number,
): QuizQuestion | null {
  const trap = c.traps[index];
  if (!trap) return null;

  const others = neighbors(c, all)
    .flatMap((o) => o.traps.map((t) => t.difference))
    .filter((d) => d !== trap.difference);

  return build(
    `q-trap-${c.id}-${index}`,
    "trap",
    c,
    grade,
    `'${trap.concept}'의 차이를 바르게 설명한 것은?`,
    undefined,
    trap.difference,
    // 뒤바꾼 설명을 맨 앞에 둬야 반드시 보기에 들어간다
    [trap.wrong, ...new Set(others)],
    `${trap.difference} (${c.title})`,
  );
}

/** 한 개념에서 만들 수 있는 문제 전부 */
export function questionsFor(
  c: Concept,
  grade: Grade,
  all: Concept[] = CONCEPTS,
): QuizQuestion[] {
  const same = all.filter((o) => o.subject === c.subject);
  const out: (QuizQuestion | null)[] = [
    makeMultiple(c, same, grade),
    makeNegative(c, grade),
    makeBlank(c, same, grade),
    ...c.traps.map((_, i) => makeTrap(c, same, grade, i)),
  ];
  return out.filter((q): q is QuizQuestion => q !== null);
}

/** 급수·과목에 맞는 문제 은행 전체 */
export function questionBank(grade: Grade, subject?: SubjectId): QuizQuestion[] {
  const targets = subject ? conceptsFor(grade, subject) : conceptsFor(grade);
  return targets.flatMap((c) => questionsFor(c, grade, CONCEPTS));
}

export interface QuizOptions {
  grade: Grade;
  subject?: SubjectId;
  count?: number;
  /** 이 개념들만 (오답노트·복습에서 쓴다) */
  onlySourceIds?: string[];
  seed?: number;
}

/**
 * 출제.
 *
 * 중요도가 높은 개념이 더 자주 나오되, 낮은 개념도 반드시 섞인다.
 * 한 개념에서 두 문제가 연달아 나오면 앞 문제의 보기가 뒤 문제의 답이
 * 되므로, 같은 개념은 한 번씩만 담는다.
 */
export function makeQuiz(opts: QuizOptions): QuizQuestion[] {
  const { grade, subject, count = 10, onlySourceIds, seed = Date.now() } = opts;
  let bank = questionBank(grade, subject);
  if (onlySourceIds?.length) {
    bank = bank.filter((q) => onlySourceIds.includes(q.sourceId));
  }
  if (bank.length === 0) return [];

  const shuffled = shuffleSeeded(bank, seed);
  shuffled.sort((a, b) => b.importance - a.importance);

  const picked: QuizQuestion[] = [];
  const used = new Set<string>();
  for (const q of shuffled) {
    if (used.has(q.sourceId)) continue;
    used.add(q.sourceId);
    picked.push(q);
    if (picked.length >= count) break;
  }

  // 개념 수보다 많이 달라고 하면 남은 문제로 채운다.
  //
  // 이때 조합에 따라 앞 문제가 뒤 문제의 답이 되어 버린다. 특히
  // '옳지 않은 것'은 그 개념의 요약과 본문 문장을 참인 보기로 늘어놓고
  // '헷갈리는 둘'은 그 개념의 함정 설명을 답으로 내므로, 같은 개념에서
  // 둘을 함께 내면 안 된다.
  if (picked.length < count) {
    const byConcept = new Map<string, QuizQuestion[]>();
    for (const q of picked) {
      byConcept.set(q.sourceId, [...(byConcept.get(q.sourceId) ?? []), q]);
    }
    for (const q of shuffled) {
      if (picked.includes(q)) continue;
      const mates = byConcept.get(q.sourceId) ?? [];
      if (mates.length >= 2) continue;
      if (q.type === "negative" || mates.some((m) => m.type === "negative")) {
        continue;
      }
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
 * 실제 필기는 과목당 20문항이고 한 과목이라도 40점(20문항 중 8문항) 미만이면
 * 평균과 무관하게 불합격이다. 그래서 과목을 섞지 않고 과목별로 20문항씩
 * 순서대로 담는다 — 결과 화면에서 과목별 점수를 그대로 보여 주기 위해서다.
 */
export function makeMock(grade: Grade, seed = Date.now()): QuizQuestion[] {
  const subjects: SubjectId[] =
    grade === 1 ? ["computer", "spreadsheet", "database"] : ["computer", "spreadsheet"];
  return subjects.flatMap((s, i) =>
    makeQuiz({ grade, subject: s, count: 20, seed: seed + i * 1000 }),
  );
}

export const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  multiple: "개념 찾기",
  negative: "옳지 않은 것",
  blank: "빈칸",
  trap: "헷갈리는 둘",
  formula: "수식",
  shortcut: "단축키",
};
