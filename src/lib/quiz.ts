import type { HistoryEvent, QuizQuestion, QuizType } from "./types";
import { shuffle } from "./utils";

// ─── 데이터 기반 퀴즈 자동 생성기 ───────────────────────────────────
// 모든 문제는 HistoryEvent 필드만으로 만들어진다.

const ALL_TYPES: QuizType[] = [
  "ox",
  "multiple",
  "order",
  "blank",
  "king",
  "year",
  "event",
];

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
  const options = shuffle([answer, ...picked], seed === undefined ? undefined : seed + 1);
  return { options, answerIndex: options.indexOf(answer) };
}

function sameEra(event: HistoryEvent, all: HistoryEvent[]): HistoryEvent[] {
  return all.filter((e) => e.era === event.era && e.id !== event.id);
}

function othersFirst(event: HistoryEvent, all: HistoryEvent[]): HistoryEvent[] {
  const near = sameEra(event, all);
  const far = all.filter((e) => e.era !== event.era);
  return [...near, ...far];
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
  // 거짓 명제: 다른 이벤트의 왕 또는 연도를 섞는다
  const pool = othersFirst(event, all);
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
      explanation: `${event.title}은(는) ${event.king} 때(${event.yearDisplay})의 일입니다. ${wrongKing}과 혼동하지 마세요.`,
      importance: event.importance,
    };
  }
  const wrongYear = pool.find((e) => e.yearDisplay !== event.yearDisplay)?.yearDisplay;
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
  const built = buildOptions(
    event.title,
    othersFirst(event, all).map((e) => e.title),
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
  const kings = othersFirst(event, all)
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
  // 주변(같은 시대 우선) 이벤트들의 연도를 오답으로
  const built = buildOptions(
    event.yearDisplay,
    othersFirst(event, all).map((e) => e.yearDisplay),
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
  const wrongPool = othersFirst(event, all)
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

function makeOrder(
  event: HistoryEvent,
  all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  const pool = [event, ...sameEra(event, all)];
  if (pool.length < 3) return null;
  const chosen = shuffle(pool, seed).slice(0, Math.min(4, pool.length));
  // 연도 중복 제거 (동률이면 순서 판정 불가)
  const unique = chosen.filter(
    (e, i) => chosen.findIndex((x) => x.year === e.year) === i,
  );
  if (unique.length < 3) return null;
  const displayed = shuffle(unique, seed === undefined ? undefined : seed + 2);
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

function makeEvent(
  event: HistoryEvent,
  _all: HistoryEvent[],
  seed?: number,
): QuizQuestion | null {
  if (event.traps.length < 1) return null;
  const correct = event.summary10s;
  const wrongs = event.traps
    .slice(0, 3)
    .map(
      (t) => `${event.title}은(는) '${t.concept}'에 해당하는 사실과 같은 사건이다.`,
    );
  while (wrongs.length < 3) {
    wrongs.push(`${event.title}은(는) ${event.yearDisplay}보다 한 시대 뒤의 일이다.`);
  }
  const options = shuffle([correct, ...wrongs.slice(0, 3)], seed);
  return {
    id: qid(event.id, "event"),
    type: "event",
    eventId: event.id,
    era: event.era,
    question: `다음 중 "${event.title}"에 대한 설명으로 옳은 것은?`,
    options,
    answerIndex: options.indexOf(correct),
    explanation:
      `정답: ${correct}\n함정 주의 — ` +
      event.traps.map((t) => `${t.concept}: ${t.difference}`).join(" / "),
    importance: event.importance,
  };
}

const GENERATORS: Record<
  QuizType,
  (e: HistoryEvent, all: HistoryEvent[], seed?: number) => QuizQuestion | null
> = {
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
}): QuizQuestion[] {
  const { events, count, seed } = opts;
  const types = opts.types?.length ? opts.types : ALL_TYPES;
  if (events.length === 0) return [];

  // 중요도 가중 샘플링: importance 높은 이벤트가 앞에 오도록
  const weighted = shuffle(events, seed).sort(
    (a, b) => b.importance - a.importance + (Math.abs(a.year % 3) - Math.abs(b.year % 3)) * 0.1,
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
    const type = types[typeCursor % types.length];
    typeCursor += 1;

    const used = usedPerEvent.get(event.id) ?? new Set<QuizType>();
    if (used.has(type)) continue;

    const q = GENERATORS[type](
      event,
      events,
      seed === undefined ? undefined : seed + guard,
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
  seed?: number,
): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (const type of ALL_TYPES) {
    const q = GENERATORS[type](event, all, seed);
    if (q) out.push(q);
    if (out.length >= 4) break;
  }
  return out;
}
