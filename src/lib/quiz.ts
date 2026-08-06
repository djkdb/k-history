import type { HistoryEvent, QuizQuestion, QuizType } from "./types";
import { shuffle } from "./utils";

// ─── 데이터 기반 퀴즈 자동 생성기 ───────────────────────────────────
// 모든 문제는 HistoryEvent 필드만으로 만들어진다.
//
// 설계 원칙 — "아직 배우지 않은 내용을 알아야 풀리는 문제"는 절대 만들지 않는다.
//  · 단일 개념 유형(ox·multiple·blank·king·year·event)은 정답 개념 하나만 알면 풀린다.
//    오답 보기는 몰라도 되므로 범위 밖 이벤트를 써도 안전하다.
//  · 교차 지식 유형(order)은 보기 전부를 알아야 풀린다.
//    따라서 knownEventIds(학습 완료 범위) 안에서만 출제하고, 출처 개념을 반드시 포함한다.

const ALL_TYPES: QuizType[] = [
  "ox",
  "multiple",
  "order",
  "blank",
  "king",
  "year",
  "event",
];

/** 보기 전부를 알아야 풀 수 있는 유형 — 학습 범위 제한이 필요하다 */
const CROSS_KNOWLEDGE_TYPES: QuizType[] = ["order"];

export interface QuizScope {
  /**
   * 이미 학습한 개념 id 집합. 지정하면 교차 지식 유형(순서 배열)을
   * 이 범위 안에서만 출제한다. 생략하면 제한 없음(시험 직전 모드 등).
   */
  knownEventIds?: string[];
  seed?: number;
}

let uid = 0;
function qid(eventId: string, type: QuizType): string {
  uid += 1;
  return `${eventId}-${type}-${uid}`;
}

/** 정답 1개 + 오답 후보에서 3개 → 셔플된 options와 answerIndex 반환 */
function buildOptions(
  answer: string,
  wrongPool: string[],
  seed?: number,
): { options: string[]; answerIndex: number } | null {
  const wrongs = [...new Set(wrongPool.filter((w) => w && w !== answer))];
  if (wrongs.length < 3) return null;
  const picked = shuffle(wrongs, seed).slice(0, 3);
  const options = shuffle(
    [answer, ...picked],
    seed === undefined ? undefined : seed + 1,
  );
  return { options, answerIndex: options.indexOf(answer) };
}

function sameEra(event: HistoryEvent, all: HistoryEvent[]): HistoryEvent[] {
  return all.filter((e) => e.era === event.era && e.id !== event.id);
}

/** 같은 시대 우선, 부족하면 전체로 보충 */
function othersFirst(event: HistoryEvent, all: HistoryEvent[]): HistoryEvent[] {
  const near = sameEra(event, all);
  const far = all.filter((e) => e.era !== event.era && e.id !== event.id);
  return [...near, ...far];
}

/**
 * 변별력 있는 오답 후보 — 같은 시대·연도가 가까운 순으로 좁힌다.
 * 전부 다른 시대에서 뽑히면 "시대만 알면 찍히는" 문제가 되므로
 * 근접 후보 limit개로 풀을 제한한 뒤 그 안에서 셔플한다.
 */
function nearestOthers(
  event: HistoryEvent,
  all: HistoryEvent[],
  limit = 6,
): HistoryEvent[] {
  const near = sameEra(event, all);
  const base = near.length >= 3 ? near : othersFirst(event, all);
  return [...base]
    .sort(
      (a, b) =>
        Math.abs(a.year - event.year) - Math.abs(b.year - event.year),
    )
    .slice(0, limit);
}

// ─── 유형별 생성기 (생성 불가 시 null) ──────────────────────────────

function makeOX(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  const rand = seed !== undefined ? seed % 2 === 0 : Math.random() < 0.5;
  if (rand) {
    return {
      id: qid(event.id, "ox"),
      type: "ox",
      eventId: event.id,
      era: event.era,
      question: `[O/X] ${event.summary10s}`,
      options: ["O", "X"],
      answerIndex: 0,
      explanation: `옳은 설명입니다. ${event.examPoint}`,
      importance: event.importance,
    };
  }
  // 거짓 명제: 다른 이벤트의 왕 또는 연도를 섞는다 (오답 요소는 몰라도 풀린다)
  const pool = nearestOthers(event, all, 8);
  const wrongKing = pool.find((e) => e.king && e.king !== event.king)?.king;
  if (event.king && wrongKing) {
    return {
      id: qid(event.id, "ox"),
      type: "ox",
      eventId: event.id,
      era: event.era,
      question: `[O/X] ${event.title}은(는) ${wrongKing} 때의 일이다.`,
      options: ["O", "X"],
      answerIndex: 1,
      explanation: `${event.title}은(는) ${event.king} 때(${event.yearDisplay})의 일입니다.`,
      importance: event.importance,
    };
  }
  const wrongYear = pool.find(
    (e) => e.yearDisplay !== event.yearDisplay,
  )?.yearDisplay;
  if (!wrongYear) return null;
  return {
    id: qid(event.id, "ox"),
    type: "ox",
    eventId: event.id,
    era: event.era,
    question: `[O/X] ${event.title}은(는) ${wrongYear}의 일이다.`,
    options: ["O", "X"],
    answerIndex: 1,
    explanation: `${event.title}의 시기는 ${event.yearDisplay}입니다.`,
    importance: event.importance,
  };
}

function makeMultiple(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  // 같은 시대·인접 시기에서 오답을 뽑아야 변별력이 생긴다
  const built = buildOptions(
    event.title,
    nearestOthers(event, all, 7).map((e) => e.title),
    seed,
  );
  if (!built) return null;
  return {
    id: qid(event.id, "multiple"),
    type: "multiple",
    eventId: event.id,
    era: event.era,
    question: `다음 설명에 해당하는 사건(개념)은?\n\n"${event.summary30s}"`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${event.title} (${event.yearDisplay}). ${event.examPoint}`,
    importance: event.importance,
  };
}

function makeKing(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  if (!event.king) return null;
  const kings = nearestOthers(event, all, 10)
    .map((e) => e.king)
    .filter((k): k is string => !!k);
  const built = buildOptions(event.king, kings, seed);
  if (!built) return null;
  return {
    id: qid(event.id, "king"),
    type: "king",
    eventId: event.id,
    era: event.era,
    question: `"${event.title}" (${event.yearDisplay}) — 이 사건 당시의 왕(집권자)은?`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `${event.title}은(는) ${event.king} 때의 일입니다. ${event.summary10s}`,
    importance: event.importance,
  };
}

function makeYear(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  // 연도가 가까운 사건들의 연도를 오답으로 — 시대가 다르면 너무 쉬워진다
  const built = buildOptions(
    event.yearDisplay,
    nearestOthers(event, all, 7).map((e) => e.yearDisplay),
    seed,
  );
  if (!built) return null;
  return {
    id: qid(event.id, "year"),
    type: "year",
    eventId: event.id,
    era: event.era,
    question: `"${event.title}"이(가) 일어난 시기는?`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `${event.title}: ${event.yearDisplay}. ${event.memory.mnemonic}`,
    importance: event.importance,
  };
}

function makeBlank(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  const keyword = event.keywords.find((k) => event.summary10s.includes(k));
  if (!keyword) return null;
  const sentence = event.summary10s.replace(keyword, "____");
  const wrongPool = nearestOthers(event, all, 10)
    .flatMap((e) => e.keywords)
    .filter((k) => !event.summary10s.includes(k));
  const built = buildOptions(keyword, wrongPool, seed);
  if (!built) return null;
  return {
    id: qid(event.id, "blank"),
    type: "blank",
    eventId: event.id,
    era: event.era,
    question: `빈칸에 들어갈 말은?\n\n"${sentence}"`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${keyword}. ${event.examPoint}`,
    importance: event.importance,
  };
}

/**
 * 순서 배열 — 보기 전부를 알아야 풀리는 유일한 유형.
 *  · 출처 개념을 반드시 보기에 포함한다 (오답이 엉뚱한 개념에 기록되는 것 방지)
 *  · known이 주어지면 학습 완료한 개념으로만 구성한다 (스포일러 차단)
 *  · 연대가 가까운 사건끼리 묶어야 변별력이 생긴다
 */
function makeOrder(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
  known?: Set<string>,
): QuizQuestion | null {
  // 출처 개념은 항상 보기에 들어가므로, 그것부터 학습 범위 안이어야 한다
  if (known && !known.has(event.id)) return null;

  let pool = sameEra(event, all).filter((e) => e.year !== event.year);
  if (known) pool = pool.filter((e) => known.has(e.id));
  if (pool.length < 2) return null; // 출처 + 최소 2개 = 3개 보기

  // 연대 인접 후보로 좁힌 뒤 그 안에서 선택
  const candidates = [...pool]
    .sort(
      (a, b) => Math.abs(a.year - event.year) - Math.abs(b.year - event.year),
    )
    .slice(0, 5);
  const picked = shuffle(candidates, seed).slice(0, 3);

  // 출처 개념은 항상 포함 + 연도 중복 제거(동률이면 순서 판정 불가)
  const chosen = [event, ...picked].filter(
    (e, i, arr) => arr.findIndex((x) => x.year === e.year) === i,
  );
  if (chosen.length < 3) return null;

  const displayed = shuffle(
    chosen,
    seed === undefined ? undefined : seed + 2,
  );
  const correctOrder = [...displayed]
    .sort((a, b) => a.year - b.year)
    .map((e) => displayed.indexOf(e));

  return {
    id: qid(event.id, "order"),
    type: "order",
    eventId: event.id,
    era: event.era,
    question: "다음 사건들을 일어난 순서대로 배열하시오.",
    options: displayed.map((e) => e.title),
    answerIndex: correctOrder,
    explanation:
      "올바른 순서: " +
      [...displayed]
        .sort((a, b) => a.year - b.year)
        .map((e) => `${e.title}(${e.yearDisplay})`)
        .join(" → "),
    importance: event.importance,
  };
}

/**
 * 사건 판별 — "옳은 설명 고르기".
 * 오답은 같은 시대 다른 사건의 요약문을 쓴다. 정답 개념만 알면 풀리고,
 * 해설에서 함정(traps)까지 짚어 준다.
 */
function makeEvent(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  const built = buildOptions(
    event.summary10s,
    nearestOthers(event, all, 8).map((e) => e.summary10s),
    seed,
  );
  if (!built) return null;
  const trapNote = event.traps.length
    ? "\n함정 주의 — " +
      event.traps.map((t) => `${t.concept}: ${t.difference}`).join(" / ")
    : "";
  return {
    id: qid(event.id, "event"),
    type: "event",
    eventId: event.id,
    era: event.era,
    question: `다음 중 "${event.title}"에 대한 설명으로 옳은 것은?`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${event.summary10s}${trapNote}`,
    importance: event.importance,
  };
}

type Generator = (
  e: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
  known?: Set<string>,
) => QuizQuestion | null;

const GENERATORS: Record<QuizType, Generator> = {
  ox: makeOX,
  multiple: makeMultiple,
  order: makeOrder,
  blank: makeBlank,
  king: makeKing,
  year: makeYear,
  event: makeEvent,
};

// ─── 공개 API ───────────────────────────────────────────────────────

export function generateQuiz(opts: {
  events: HistoryEvent[];
  count: number;
  types?: QuizType[];
  seed?: number;
  knownEventIds?: string[];
}): QuizQuestion[] {
  const { events, count, seed, knownEventIds } = opts;
  const types = opts.types?.length ? opts.types : ALL_TYPES;
  if (events.length === 0) return [];

  const known = knownEventIds ? new Set(knownEventIds) : undefined;

  // 학습한 개념이 3개 미만이면 순서 배열은 아예 만들 수 없다
  const usableTypes =
    known && known.size < 3
      ? types.filter((t) => !CROSS_KNOWLEDGE_TYPES.includes(t))
      : types;
  if (usableTypes.length === 0) return [];

  // 중요도 높은 개념 우선 샘플링
  const weighted = shuffle(events, seed).sort(
    (a, b) => b.importance - a.importance,
  );

  const questions: QuizQuestion[] = [];
  const usedPerEvent = new Map<string, Set<QuizType>>();
  let cursor = 0;
  let typeCursor = seed ?? 0;
  let guard = 0;

  while (questions.length < count && guard < count * 30) {
    guard += 1;
    const event = weighted[cursor % weighted.length];
    cursor += 1;
    const type = usableTypes[typeCursor % usableTypes.length];
    typeCursor += 1;

    const used = usedPerEvent.get(event.id) ?? new Set<QuizType>();
    if (used.has(type)) continue;

    const q = GENERATORS[type](
      event,
      events,
      seed === undefined ? undefined : seed + guard,
      known,
    );
    if (!q) continue;
    used.add(type);
    usedPerEvent.set(event.id, used);
    questions.push(q);
  }
  return questions;
}

export function generateQuizForEvent(
  event: HistoryEvent,
  all: HistoryEvent[],
  scope: QuizScope = {},
): QuizQuestion[] {
  const { seed } = scope;
  // 방금 학습한 개념 자체는 항상 아는 것으로 취급
  const known = scope.knownEventIds
    ? new Set([...scope.knownEventIds, event.id])
    : undefined;

  const out: QuizQuestion[] = [];
  for (const type of ALL_TYPES) {
    if (
      CROSS_KNOWLEDGE_TYPES.includes(type) &&
      known &&
      known.size < 3
    ) {
      continue;
    }
    const q = GENERATORS[type](event, all, seed, known);
    if (q) out.push(q);
    if (out.length >= 4) break;
  }
  return out;
}
