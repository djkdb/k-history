import type { Concept, Grade, QuizQuestion, QuizType, SubjectId } from "./types";
import { CONCEPTS, conceptsFor } from "@/data/concepts";
import { shuffleSeeded } from "./utils";

/**
 * 필기 문제 생성기.
 *
 * 문제를 손으로 다 써 두면 몇백 개에서 멈추고, 같은 문제를 다시 만나
 * 답을 외워 버린다. 그래서 개념 데이터에서 문제를 만들어 낸다.
 *
 * 다만 자동 생성의 위험은 하나뿐이다 — 지문이 답을 흘리는 것.
 * (예: "RAM은 휘발성이다"라고 써 놓고 답을 RAM으로 고르게 하는 문제)
 * 아래 생성기들은 답이 새는 문제를 만들면 아예 만들지 않고 건너뛴다.
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

/** 제목에서 뜻이 있는 낱말만 뽑는다 (조사·기호는 버린다) */
function titleTokens(title: string): string[] {
  return title
    .split(/[\s·,()—\-–~/]+/)
    .map((t) => t.replace(/^(의|과|와|은|는|이|가)$/, "").trim())
    .filter((t) => t.length >= 2);
}

/**
 * 지문에서 답이 될 낱말을 가린다.
 * 너무 많이 가리면 문제가 아니라 수수께끼가 되므로, 가린 자리가 셋을
 * 넘거나 원문이 절반 넘게 사라지면 실패로 본다.
 */
function maskTitle(passage: string, title: string): string | null {
  let out = passage;
  let masked = 0;
  for (const tok of titleTokens(title)) {
    if (!out.includes(tok)) continue;
    const before = out;
    out = out.split(tok).join(MASK);
    if (out !== before) masked += before.split(tok).length - 1;
  }
  if (masked === 0) return passage; // 애초에 새지 않았다
  if (masked > 3) return null;
  const kept = out.replace(new RegExp(MASK, "g"), "").length;
  if (kept < passage.length * 0.5) return null;
  return out;
}

/** 보기 사이에 답이 새는지 — 답 낱말이 지문에 그대로 남아 있으면 실패 */
function leaks(passage: string, answer: string): boolean {
  return titleTokens(answer).some((t) => passage.includes(t));
}

function pool(grade: Grade, subject: SubjectId): Concept[] {
  return conceptsFor(grade, subject);
}

/** 같은 과목의 다른 개념들 — 같은 갈래를 먼저 준다(더 헷갈리는 오답) */
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
  if (wrong.length < 3) return null;
  const options = shuffleSeeded([correct, ...wrong.slice(0, 3)], hash(id));
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
  const passage = maskTitle(c.summary, c.title);
  if (!passage) return null;
  const wrong = neighbors(c, all)
    .map((o) => o.title)
    .filter((t) => !leaks(passage, t));
  return build(
    `q-mul-${c.id}`,
    "multiple",
    c,
    grade,
    "다음 설명에 해당하는 것은?",
    passage,
    c.title,
    wrong,
    `${c.title} — ${c.summary}`,
  );
}

// ── 유형 2. 옳지 않은 것 고르기 ────────────────────────────────────
/**
 * 참인 설명 셋과 "이 개념의 설명이 아닌 것" 하나를 섞는다.
 * 오답은 다른 갈래에서 가져온다 — 같은 갈래에서 가져오면 그 설명도
 * 우연히 참일 수 있어서 답이 둘이 된다.
 */
function makeNegative(c: Concept, all: Concept[], grade: Grade): QuizQuestion | null {
  const trues = [c.summary, c.examPoint, ...c.traps.map((t) => t.difference)]
    .filter((s) => s && s.length > 10)
    .slice(0, 3);
  if (trues.length < 3) return null;

  const foreign = all.find(
    (o) => o.id !== c.id && o.topic !== c.topic && !leaks(o.summary, c.title),
  );
  if (!foreign) return null;

  const id = `q-neg-${c.id}`;
  const options = shuffleSeeded([foreign.summary, ...trues], hash(id));
  return {
    id,
    type: "negative",
    sourceId: c.id,
    subject: c.subject,
    grade,
    question: `${c.title}에 대한 설명으로 옳지 않은 것은?`,
    options,
    answerIndex: options.indexOf(foreign.summary),
    explanation: `그 설명은 ${c.title}이 아니라 '${foreign.title}'에 대한 것입니다. 나머지 셋은 모두 ${c.title}의 설명입니다.`,
    importance: c.importance,
  };
}

// ── 유형 3. 빈칸 채우기 ────────────────────────────────────────────
function makeBlank(c: Concept, all: Concept[], grade: Grade): QuizQuestion | null {
  const source = [c.detail, c.examPoint].find((t) =>
    c.keywords.some((k) => t.includes(k)),
  );
  if (!source) return null;
  const answer = c.keywords.find((k) => source.includes(k));
  if (!answer || answer.length < 2) return null;

  // 답이 여러 번 나오면 전부 가린다 — 한 번만 가리면 옆에서 그대로 보인다
  const passage = source.split(answer).join("____");

  const wrong = all
    .filter((o) => o.id !== c.id)
    .flatMap((o) => o.keywords)
    .filter(
      (k) =>
        k !== answer &&
        !k.includes(answer) &&
        !answer.includes(k) &&
        !passage.includes(k),
    );
  const unique = [...new Set(wrong)];

  return build(
    `q-blank-${c.id}`,
    "blank",
    c,
    grade,
    "빈칸에 들어갈 말로 알맞은 것은?",
    passage,
    answer,
    unique,
    `${c.title} — ${c.summary}`,
  );
}

// ── 유형 4. 헷갈리는 둘 구분하기 ───────────────────────────────────
function makeTrap(
  c: Concept,
  all: Concept[],
  grade: Grade,
  index: number,
): QuizQuestion | null {
  const trap = c.traps[index];
  if (!trap) return null;

  const wrong = all
    .filter((o) => o.id !== c.id)
    .flatMap((o) => o.traps.map((t) => t.difference))
    .filter((d) => d !== trap.difference);
  const unique = [...new Set(wrong)];

  return build(
    `q-trap-${c.id}-${index}`,
    "trap",
    c,
    grade,
    `'${trap.concept}'의 차이를 바르게 설명한 것은?`,
    undefined,
    trap.difference,
    unique,
    `${c.title} — ${trap.difference}`,
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
    makeNegative(c, same, grade),
    makeBlank(c, same, grade),
    ...c.traps.map((_, i) => makeTrap(c, same, grade, i)),
  ];
  return out.filter((q): q is QuizQuestion => q !== null);
}

/** 급수·과목에 맞는 문제 은행 전체 */
export function questionBank(grade: Grade, subject?: SubjectId): QuizQuestion[] {
  const targets = subject
    ? pool(grade, subject)
    : conceptsFor(grade);
  const all = CONCEPTS;
  return targets.flatMap((c) => questionsFor(c, grade, all));
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
 * 한 개념에서 두 문제가 연달아 나오면 앞 문제의 해설이 뒤 문제의 답이
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
  // 중요도 5는 앞쪽에, 낮은 것은 뒤쪽에 — 다만 완전히 정렬하지는 않는다
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
  // 이때 같은 개념이 두 번 나오는데, 조합에 따라 앞 문제가 뒤 문제의 답이
  // 되어 버린다. 특히 '옳지 않은 것'은 그 개념의 요약·시험 포인트·함정
  // 설명을 참인 보기로 그대로 늘어놓기 때문에, 같은 개념의 다른 문제와
  // 절대 붙여 놓으면 안 된다.
  if (picked.length < count) {
    const byConcept = new Map<string, QuizQuestion[]>();
    for (const q of picked) {
      byConcept.set(q.sourceId, [...(byConcept.get(q.sourceId) ?? []), q]);
    }
    for (const q of shuffled) {
      if (picked.includes(q)) continue;
      const mates = byConcept.get(q.sourceId) ?? [];
      if (mates.length >= 2) continue; // 한 개념에서 최대 두 문제까지
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
