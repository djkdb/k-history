import type {
  Difficulty,
  HistoryEvent,
  QuizQuestion,
  QuizType,
} from "./types";
import { shuffle } from "./utils";
import { ALL_EVENTS, pastExamsOf } from "@/data/events";

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
  "negative",
  "source",
];

/** 보기 전부를 알아야 풀 수 있는 유형 — 학습 범위 제한이 필요하다 */
const CROSS_KNOWLEDGE_TYPES: QuizType[] = ["order"];

// ─── 난이도 설계 ────────────────────────────────────────────────────
// 난이도는 네 축으로 조절한다.
//   ① 어떤 유형을 내는가        ② 오답을 얼마나 가까운 곳에서 뽑는가
//   ③ 어느 중요도까지 다루는가   ④ 지문이 얼마나 직접적인가
//
// 실제 한국사능력검정시험이 어려운 이유는 답이 어려워서가 아니라
// 선택지가 서로 비슷해서다. 그래서 ②가 체감 난이도를 가장 크게 좌우한다.

interface DifficultyProfile {
  types: QuizType[];
  /** 오답 후보 풀 크기 — 작을수록 정답과 비슷한 것만 남아 어려워진다 */
  distractorPool: number;
  /** 다룰 개념의 최소 중요도 — 낮출수록 생소한 개념까지 나온다 */
  minImportance: number;
  /** 오답을 시대 밖에서도 뽑을지. true면 소거가 쉬워진다 */
  spreadDistractors: boolean;
  label: string;
  description: string;
}

export const DIFFICULTY_PROFILES: Record<Difficulty, DifficultyProfile> = {
  basic: {
    types: ["ox", "multiple", "king"],
    distractorPool: 12,
    minImportance: 3,
    spreadDistractors: true, // 다른 시대 오답이 섞여 소거가 쉽다
    label: "기초",
    description: "익숙한 개념 위주 · 보기가 뚜렷하게 구분됩니다",
  },
  real: {
    types: ["ox", "multiple", "king", "year", "blank", "event", "order"],
    distractorPool: 7,
    minImportance: 2,
    spreadDistractors: false, // 같은 시대에서만 뽑는다
    label: "실전",
    description: "실제 시험 체감 난이도 · 같은 시대에서 오답이 나옵니다",
  },
  hard: {
    types: [
      "multiple",
      "year",
      "blank",
      "event",
      "order",
      "negative",
      "source",
    ],
    distractorPool: 4, // 연도까지 인접한 것만 — 헷갈린다
    minImportance: 1,
    spreadDistractors: false,
    label: "고난도",
    description: "부정형·사료형 포함 · 인접 시기 오답으로 함정을 만듭니다",
  },
};

export const DIFFICULTY_ORDER: Difficulty[] = ["basic", "real", "hard"];

export interface QuizScope {
  /**
   * 이미 학습한 개념 id 집합. 지정하면 교차 지식 유형(순서 배열)을
   * 이 범위 안에서만 출제한다. 생략하면 제한 없음(시험 직전 모드 등).
   */
  knownEventIds?: string[];
  seed?: number;
  difficulty?: Difficulty;
}

let uid = 0;
function qid(eventId: string, type: QuizType): string {
  uid += 1;
  return `${eventId}-${type}-${uid}`;
}

// ─── 연도 표기 → 실제 기간 ──────────────────────────────────────────
// "1920년대"는 1920~1929년을 뜻하므로 1920년의 사건에도 참이다.
// 거짓 명제를 만들 때 이런 포함 관계를 놓치면 정답이 뒤집힌다.
// 파싱할 수 없는 표기는 null을 돌려 오답 보기에서 제외한다.
function yearSpan(display: string): [number, number] | null {
  const d = display.trim();
  const bc = d.startsWith("기원전");
  const nums = [...d.matchAll(/\d+/g)].map((m) => Number(m[0]));
  const sign = bc ? -1 : 1;

  // 약 70만 년 전 — 구석기
  if (/약\s*\d+만\s*년\s*전/.test(d)) {
    const man = nums[0] ?? 70;
    return [-man * 10000, -Math.round((man * 10000) / 2)];
  }
  if (/기원\s*전후/.test(d)) return [-50, 50];

  // N~M세기 / N세기 (후반·말·경·초 포함)
  if (/세기/.test(d)) {
    const centuryRange = (c: number): [number, number] =>
      bc ? [-c * 100, -((c - 1) * 100 + 1)] : [(c - 1) * 100 + 1, c * 100];
    if (nums.length >= 2 && /\d+\s*~\s*\d+\s*세기/.test(d)) {
      const [a] = centuryRange(nums[0]);
      const [, b] = centuryRange(nums[1]);
      return bc ? [a, b] : [a, b];
    }
    const c = nums[0];
    if (!c) return null;
    const [lo, hi] = centuryRange(c);
    if (/후반|말/.test(d)) return bc ? [lo, Math.round((lo + hi) / 2)] : [Math.round((lo + hi) / 2), hi];
    if (/전반|초/.test(d)) return bc ? [Math.round((lo + hi) / 2), hi] : [lo, Math.round((lo + hi) / 2)];
    return [lo, hi];
  }

  // N년대 (이후)
  if (/년대/.test(d)) {
    const y = nums[0];
    if (y === undefined) return null;
    return /이후/.test(d) ? [y, y + 19] : [y, y + 9];
  }

  // N~M년 / N년~M년 / N년·M년
  if (nums.length >= 2) {
    const a = sign * nums[0];
    const b = sign * nums[1];
    return [Math.min(a, b), Math.max(a, b)];
  }

  // N년 (경)
  if (nums.length === 1) {
    const y = sign * nums[0];
    // "기원전 8000년경"처럼 대략적인 표기는 여유를 준다
    const slack = /경/.test(d) ? Math.max(50, Math.abs(y) * 0.02) : 0;
    return [y - slack, y + slack];
  }
  return null;
}

function spansOverlap(a: [number, number], b: [number, number]): boolean {
  return a[0] <= b[1] && b[0] <= a[1];
}

/**
 * "이 사건은 {other}의 일이다"를 확실한 거짓으로 쓸 수 있는가.
 * 두 기간이 조금이라도 겹치면 참일 수 있으므로 쓰지 않는다.
 */
function isSafeWrongYear(event: HistoryEvent, otherDisplay: string): boolean {
  if (otherDisplay === event.yearDisplay) return false;
  const mine = yearSpan(event.yearDisplay);
  const theirs = yearSpan(otherDisplay);
  if (!mine || !theirs) return false;
  return !spansOverlap(mine, theirs);
}

/** 왕 표기가 서로를 포함하면(예: "문왕" ⊂ "무왕·문왕") 거짓이 아닐 수 있다 */
function isSafeWrongKing(myKing: string, otherKing: string): boolean {
  if (myKing === otherKing) return false;
  return !myKing.includes(otherKing) && !otherKing.includes(myKing);
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
  /** true면 시대를 가리지 않고 넓게 뽑는다 — 오답이 뚜렷해져 쉬워진다 */
  spread = false,
): HistoryEvent[] {
  if (spread) {
    // 시대가 다른 것을 우선 섞어 "시대만 알면 소거되는" 쉬운 문제를 만든다
    const far = all.filter((e) => e.era !== event.era && e.id !== event.id);
    const near = sameEra(event, all);
    return [...shuffle(far).slice(0, limit), ...near].slice(0, limit + 2);
  }
  const near = sameEra(event, all);
  const base = near.length >= 3 ? near : othersFirst(event, all);
  return [...base]
    .sort(
      (a, b) =>
        Math.abs(a.year - event.year) - Math.abs(b.year - event.year),
    )
    .slice(0, limit);
}


// ─── 유형별 생성기 ──────────────────────────────────────────────────
// 모든 생성기는 공통 컨텍스트를 받고, 만들 수 없으면 null을 돌려준다.

interface Ctx {
  event: HistoryEvent;
  all: HistoryEvent[];
  seed?: number;
  known?: Set<string>;
  difficulty: Difficulty;
  /** 오답 후보 풀 크기 — 난이도 프로필에서 온다 */
  pool: number;
  /** 오답을 시대 밖에서도 뽑을지 */
  spread: boolean;
}

/**
 * 발문이나 지문이 정답을 그대로 말하고 있는가.
 *
 * 개념 제목에 왕 이름이 들어 있는 경우가 많아("근초고왕, 백제의 4세기 전성기")
 * 제목을 그대로 인용하면 왕을 묻는 문제의 답이 발문에 노출된다.
 * 유형마다 따로 막지 않고 마지막 관문에서 한 번에 걸러 낸다.
 */
function leaksAnswer(
  question: string,
  passage: string | undefined,
  options: string[],
  answerIndex: number | number[],
): boolean {
  const strip = (t: string) => t.replace(/[\s.·,'"“”‘’()]/g, "");
  const hay = strip(`${question} ${passage ?? ""}`);
  const idx = Array.isArray(answerIndex) ? answerIndex : [answerIndex];
  for (const i of idx) {
    const opt = options[i];
    if (!opt) continue;
    const needle = strip(opt);
    if (needle.length >= 2 && hay.includes(needle)) return true;
  }
  return false;
}

/**
 * 보기의 갈래.
 *
 * "금관가야는 누구에게 멸망했나?"의 정답이 인물인데 보기에 '덩이쇠'(유물),
 * '김해'(지명)가 섞이면 문제가 성립하지 않는다. 정답과 같은 갈래끼리만
 * 보기를 만들기 위해 낱말을 거칠게 나눈다.
 */
type WordKind = "year" | "person" | "place" | "thing";

const PERSON_TAIL = /(왕|제|공|군|후|비|대사|국사|선사|스님|장군|대군|대왕)$/;
/** 시험에 자주 나오는 지명 — 낱말만 봐서는 사물과 구분되지 않아 따로 적어 둔다 */
const PLACES = new Set([
  "김해", "고령", "경주", "평양", "개경", "개성", "한양", "한성", "웅진", "사비",
  "국내성", "왕검성", "강화도", "진도", "제주", "부산", "원산", "인천", "대구",
  "광주", "전주", "청주", "충주", "상경", "동경", "서경", "남경", "요동", "만주",
  "간도", "연해주", "상하이", "충칭", "하와이", "울산", "나주", "진주", "안동",
]);

function wordKind(word: string, all: HistoryEvent[]): WordKind {
  if (/\d/.test(word) && /(년|세기|년대)/.test(word)) return "year";
  if (PLACES.has(word)) return "place";
  for (const e of all) {
    if (e.relatedFigures.includes(word)) return "person";
    if (e.king && e.king.split(/[·,()\s]+/).includes(word)) return "person";
    // 문화재가 먼저다 — '지산동 고분군'의 끝 글자에 속아 인물로 보면 안 된다
    if (e.relatedHeritage.includes(word)) return "thing";
  }
  if (PERSON_TAIL.test(word) && !word.includes(" ")) return "person";
  return "thing";
}

/** 받침이 있는가 — 조사가 붙는 모양을 정한다 */
function hasFinalConsonant(word: string): boolean {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return false; // 한글이 아니면 판단 보류
  return code % 28 !== 0;
}

/**
 * 빈칸 뒤 조사와 어울리는 낱말만 남긴다.
 * "____이 금관가야를 세웠다"의 빈칸에 '대가야'가 들어가면 "대가야이"가 되어
 * 읽는 순간 답이 아님을 알게 된다. 이런 보기는 문제를 무의미하게 만든다.
 */
function fitsParticle(word: string, after: string): boolean {
  const m = after.match(/^\s*(이|가|은|는|을|를|과|와|으로|로)(?![가-힣])/);
  if (!m) return true;
  const need = hasFinalConsonant(word);
  switch (m[1]) {
    case "이": case "은": case "을": case "과": case "으로":
      return need;
    case "가": case "는": case "를": case "와": case "로":
      return !need;
    default:
      return true;
  }
}

/** 정답인 이름을 발문에서 (가)로 가린다 — 실제 시험도 이렇게 낸다 */
function maskName(text: string, name: string): string {
  let out = text;
  for (const token of name.split(/[·,()\s]+/).filter((t) => t.length >= 2)) {
    out = out.split(token).join("(가)");
  }
  return out;
}

/** 가린 뒤에도 무엇을 묻는지 알 수 있을 만큼 남았는가 */
function hasSubstance(masked: string): boolean {
  return masked.replace(/\(가\)/g, "").replace(/[\s,·—:()]/g, "").length >= 3;
}

/** 연도를 묻는 문제에서 발문에 섞인 연도를 가린다 */
function maskYears(text: string): string {
  return text.replace(/\d{1,4}\s*년/g, "○○○년");
}

/**
 * 보기용 짧은 제목.
 * "신석기 혁명: 농경과 정착의 시작"처럼 부제가 붙으면 보기 길이가 들쭉날쭉해져
 * 유독 짧거나 긴 것이 정답처럼 보인다. 앞머리만 쓴다.
 */
function shortTitle(title: string): string {
  return SHORT_TITLE.get(title) ?? title;
}

/**
 * 부제를 떼어 낸 짧은 제목 표. 앱이 뜰 때 한 번만 만든다.
 * 떼어 낸 결과가 둘 이상 겹치면 구분이 안 되므로 그때는 원제목을 쓴다.
 * ('·'는 "봉오동·청산리 대첩"처럼 제목 안에서 쓰이므로 구분자로 보지 않는다)
 */
const SHORT_TITLE: Map<string, string> = (() => {
  const head = (t: string) => {
    const h = t.split(/\s*[—:]\s*/)[0].trim();
    return h.length >= 2 ? h : t;
  };
  const count = new Map<string, number>();
  for (const e of ALL_EVENTS) {
    const h = head(e.title);
    count.set(h, (count.get(h) ?? 0) + 1);
  }
  const map = new Map<string, string>();
  for (const e of ALL_EVENTS) {
    const h = head(e.title);
    map.set(e.title, (count.get(h) ?? 0) === 1 ? h : e.title);
  }
  return map;
})();

/** 공통 필드를 붙여 완성된 문제로 만든다 */
function finish(
  ctx: Ctx,
  type: QuizType,
  q: Omit<QuizQuestion, "id" | "eventId" | "era" | "importance" | "difficulty" | "type" | "pastExams">,
): QuizQuestion | null {
  // 순서 배열은 정답이 '순서'라 보기 글자가 발문에 있어도 누출이 아니다
  if (type !== "order" && leaksAnswer(q.question, q.passage, q.options, q.answerIndex))
    return null;
  const refs = pastExamsOf(ctx.event.id);
  return {
    id: qid(ctx.event.id, type),
    type,
    eventId: ctx.event.id,
    era: ctx.event.era,
    importance: ctx.event.importance,
    difficulty: ctx.difficulty,
    ...(refs.length ? { pastExams: refs } : {}),
    ...q,
  };
}

function makeOX(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed } = ctx;
  const trueStatement = () =>
    finish(ctx, "ox", {
      question: `[O/X] ${event.summary10s}`,
      options: ["O", "X"],
      answerIndex: 0,
      explanation: `옳은 설명입니다. ${event.examPoint}`,
    });

  const useTrue = seed !== undefined ? seed % 2 === 0 : Math.random() < 0.5;
  if (useTrue) return trueStatement();

  // 거짓 명제: 다른 사건의 왕/연도를 섞되, 실제로도 참이 되면 안 된다
  const others = nearestOthers(event, all, Math.max(ctx.pool, 8), ctx.spread);
  const wrongKing = event.king
    ? others.find((e) => e.king && isSafeWrongKing(event.king!, e.king))?.king
    : undefined;
  if (event.king && wrongKing) {
    return finish(ctx, "ox", {
      question: `[O/X] ${maskName(event.title, event.king)}은(는) ${wrongKing} 때의 일이다.`,
      options: ["O", "X"],
      answerIndex: 1,
      explanation: `${event.title}은(는) ${event.king} 때(${event.yearDisplay})의 일입니다.`,
    });
  }
  const wrongYear = others.find((e) =>
    isSafeWrongYear(event, e.yearDisplay),
  )?.yearDisplay;
  if (!wrongYear) return trueStatement(); // 틀린 정답을 내느니 참 명제로
  return finish(ctx, "ox", {
    question: `[O/X] ${maskYears(event.title)}은(는) ${wrongYear}의 일이다.`,
    options: ["O", "X"],
    answerIndex: 1,
    explanation: `${event.title}의 시기는 ${event.yearDisplay}입니다.`,
  });
}

function makeMultiple(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;
  const built = buildOptions(
    shortTitle(event.title),
    nearestOthers(event, all, pool, ctx.spread).map((e) => shortTitle(e.title)),
    seed,
  );
  if (!built) return null;
  // 고난도에서는 힌트가 적은 짧은 지문을 준다
  const passage = ctx.difficulty === "hard" ? event.examPoint : event.summary30s;
  return finish(ctx, "multiple", {
    question: "다음 설명에 해당하는 사건(개념)은?",
    passage,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${event.title} (${event.yearDisplay}). ${event.examPoint}`,
  });
}

function makeKing(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;
  if (!event.king) return null;
  // 괄호 설명을 떼어 보기 길이를 고르게 한다 ("동명성왕(주몽)" → "동명성왕")
  const plain = (k: string) => {
    const head = k.split("(")[0].trim();
    return head.length >= 2 ? head : k;
  };
  const answer = plain(event.king);
  const kings = nearestOthers(event, all, pool + 4, ctx.spread)
    .map((e) => e.king)
    .filter((k): k is string => !!k)
    .map(plain)
    .filter((k) => k !== answer);
  const built = buildOptions(answer, kings, seed);
  if (!built) return null;
  // 제목에 왕 이름이 들어 있으면 (가)로 가린다. 가리고 나서도 무엇을
  // 묻는지 알 수 있어야 하고, 그렇지 못하면 요약문으로 대신한다.
  const maskedTitle = maskName(event.title, event.king);
  const cue = hasSubstance(maskedTitle)
    ? `"${maskedTitle}"`
    : hasSubstance(maskName(event.summary10s, event.king))
      ? maskName(event.summary10s, event.king)
      : null;
  if (!cue) return null;
  return finish(ctx, "king", {
    question: `${cue} (${event.yearDisplay}) — (가)에 들어갈 왕(집권자)은?`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `${event.title}은(는) ${event.king} 때의 일입니다. ${event.summary10s}`,
  });
}

function makeYear(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;
  const built = buildOptions(
    event.yearDisplay,
    nearestOthers(event, all, pool, ctx.spread).map((e) => e.yearDisplay),
    seed,
  );
  if (!built) return null;
  return finish(ctx, "year", {
    question: `"${maskYears(event.title)}"이(가) 일어난 시기는?`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `${event.title}: ${event.yearDisplay}. ${event.memory.mnemonic}`,
  });
}

function makeBlank(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;
  const keyword = event.keywords.find((k) => event.summary10s.includes(k));
  if (!keyword) return null;

  // 정답과 같은 갈래(인물·연도·지명·사물)에서만 오답을 뽑는다.
  // 갈래가 섞이면 정답이 혼자 튀어 문제가 되지 않는다.
  const kind = wordKind(keyword, all);
  // 빈칸 바로 뒤에 붙는 조사 — 보기가 이 조사와 어울려야 한다
  const after = event.summary10s.slice(
    event.summary10s.indexOf(keyword) + keyword.length,
  );
  let wrongPool = nearestOthers(event, all, pool + 6, ctx.spread)
    .flatMap((e) => e.keywords)
    .filter(
      (k) =>
        !event.summary10s.includes(k) &&
        wordKind(k, all) === kind &&
        fitsParticle(k, after),
    );

  // 길이도 비슷하게 — 유독 짧거나 긴 보기는 그 자체로 단서가 된다.
  // 가까운 순으로 줄 세워 buildOptions가 앞쪽에서 고르게 한다.
  wrongPool = [...new Set(wrongPool)].sort(
    (a, b) =>
      Math.abs(a.length - keyword.length) - Math.abs(b.length - keyword.length),
  );
  const close = wrongPool.filter(
    (k) => Math.abs(k.length - keyword.length) <= Math.max(2, keyword.length / 2),
  );
  if (close.length >= 3) wrongPool = close;
  else wrongPool = wrongPool.slice(0, 6);
  if (wrongPool.length < 3) return null;

  const built = buildOptions(keyword, wrongPool, seed);
  if (!built) return null;
  return finish(ctx, "blank", {
    question: "빈칸에 들어갈 말은?",
    passage: event.summary10s.replace(keyword, "  ____  "),
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${keyword}. ${event.examPoint}`,
  });
}

/**
 * 순서 배열 — 보기 전부를 알아야 풀리는 유일한 유형.
 * 출처 개념을 반드시 포함하고, known이 있으면 학습 완료 범위로 제한한다.
 */
function makeOrder(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, known } = ctx;
  if (known && !known.has(event.id)) return null;

  let candidates = sameEra(event, all).filter((e) => e.year !== event.year);
  if (known) candidates = candidates.filter((e) => known.has(e.id));
  if (candidates.length < 2) return null;

  // 고난도일수록 연대가 촘촘한 것끼리 묶어 순서를 헷갈리게 한다
  const width = ctx.difficulty === "hard" ? 3 : 5;
  const near = [...candidates]
    .sort((a, b) => Math.abs(a.year - event.year) - Math.abs(b.year - event.year))
    .slice(0, Math.max(width, 3));
  const picked = shuffle(near, seed).slice(0, ctx.difficulty === "hard" ? 3 : 3);

  const chosen = [event, ...picked].filter(
    (e, i, arr) => arr.findIndex((x) => x.year === e.year) === i,
  );
  if (chosen.length < 3) return null;

  const displayed = shuffle(chosen, seed === undefined ? undefined : seed + 2);
  const correctOrder = [...displayed]
    .sort((a, b) => a.year - b.year)
    .map((e) => displayed.indexOf(e));

  return finish(ctx, "order", {
    question: "다음 사건들을 일어난 순서대로 배열하시오.",
    options: displayed.map((e) => shortTitle(e.title)),
    answerIndex: correctOrder,
    explanation:
      "올바른 순서: " +
      [...displayed]
        .sort((a, b) => a.year - b.year)
        .map((e) => `${e.title}(${e.yearDisplay})`)
        .join(" → "),
  });
}

/** 옳은 설명 고르기 — 오답은 같은 시대 다른 사건의 요약문 */
function makeEvent(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;
  const built = buildOptions(
    event.summary10s,
    nearestOthers(event, all, pool + 2, ctx.spread).map((e) => e.summary10s),
    seed,
  );
  if (!built) return null;
  const trapNote = event.traps.length
    ? "\n함정 주의 — " +
      event.traps.map((t) => `${t.concept}: ${t.difference}`).join(" / ")
    : "";
  return finish(ctx, "event", {
    question: `다음 중 "${event.title}"에 대한 설명으로 옳은 것은?`,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${event.summary10s}${trapNote}`,
  });
}

/**
 * 부정형 — "옳지 않은 것은?" 실제 시험의 단골 발문.
 * 참 3개는 이 사건의 사실에서, 거짓 1개는 다른 사건의 사실에서 만든다.
 * 세 개가 모두 참임을 확인해야 하므로 부분 지식으로는 풀기 어렵다.
 */
function makeNegative(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;

  const truths: string[] = [event.summary10s];
  if (event.king) truths.push(`${event.king} 때의 일이다.`);
  truths.push(`${event.yearDisplay}에 있었던 일이다.`);
  if (event.significance) truths.push(event.significance);
  if (event.keywords.length)
    truths.push(`${event.keywords.slice(0, 3).join("·")} 등이 핵심 키워드다.`);

  const picked = shuffle(truths, seed).slice(0, 3);
  if (picked.length < 3) return null;

  // 거짓 보기: 다른 사건의 요약문 (이 사건에 대한 설명으로는 틀리다)
  const wrong = nearestOthers(event, all, pool + 2, ctx.spread).find(
    (e) => !picked.includes(e.summary10s) && e.summary10s !== event.summary10s,
  );
  if (!wrong) return null;

  const options = shuffle(
    [...picked, wrong.summary10s],
    seed === undefined ? undefined : seed + 3,
  );
  return finish(ctx, "negative", {
    question: `다음 중 "${event.title}"에 대한 설명으로 옳지 않은 것은?`,
    options,
    answerIndex: options.indexOf(wrong.summary10s),
    explanation: `정답(옳지 않은 것): 이 설명은 "${wrong.title}"(${wrong.yearDisplay})에 해당합니다. 나머지는 ${event.title}의 사실입니다.`,
  });
}

/**
 * 사료 제시형 — 지문에서 사건명과 왕 이름을 가려 놓고 정체를 묻는다.
 * 실제 시험은 사료를 주고 "밑줄 친 이 사건"을 묻는 형태가 많다.
 */
function makeSource(ctx: Ctx): QuizQuestion | null {
  const { event, all, seed, pool } = ctx;

  // 지문에서 정답이 드러나는 고유명사를 모두 가린다.
  // 제목이 "발해 무왕과 문왕"이면 지문의 "발해 2대 무왕"도 답을 노출하므로
  // 제목을 토큰 단위로 쪼개 각각 가려야 한다.
  let passage = event.summary1m || event.summary30s;
  if (!passage) return null;

  const secrets = new Set<string>();
  // 조사가 붙은 채로 토큰이 잘리면("고인돌과") 어간이 지문에 그대로 남는다
  const addWithStem = (word: string) => {
    if (word.length < 2) return;
    secrets.add(word);
    const stem = word.replace(/(과|와|의|은|는|이|가|을|를|에서|에|로|으로)$/, "");
    if (stem.length >= 2) secrets.add(stem);
  };

  secrets.add(event.title);
  event.title.split(/[\s·—,()]+/).forEach(addWithStem);
  if (event.king) {
    secrets.add(event.king);
    event.king.split(/[·,\s]+/).forEach(addWithStem);
  }
  // 긴 것부터 지워야 부분 치환으로 조각이 남지 않는다
  for (const s of [...secrets].sort((a, b) => b.length - a.length)) {
    passage = passage.split(s).join("(가)");
  }

  // 가린 자리가 너무 많으면 지문이 읽히지 않는다 — 그런 개념은 사료형을 만들지 않는다
  const masked = (passage.match(/\(가\)/g) ?? []).length;
  if (masked === 0 || masked > 4) return null;

  const sentences = passage.split(/(?<=\.)\s+/).slice(0, 3).join(" ");
  if (sentences.length < 40) return null;

  const built = buildOptions(
    shortTitle(event.title),
    nearestOthers(event, all, pool, ctx.spread).map((e) => shortTitle(e.title)),
    seed,
  );
  if (!built) return null;

  return finish(ctx, "source", {
    question: "다음 자료에서 설명하는 (가)에 해당하는 것은?",
    passage: sentences,
    options: built.options,
    answerIndex: built.answerIndex,
    explanation: `정답: ${event.title} (${event.yearDisplay}). ${event.examPoint}`,
  });
}

type Generator = (ctx: Ctx) => QuizQuestion | null;

const GENERATORS: Record<QuizType, Generator> = {
  ox: makeOX,
  multiple: makeMultiple,
  order: makeOrder,
  blank: makeBlank,
  king: makeKing,
  year: makeYear,
  event: makeEvent,
  negative: makeNegative,
  source: makeSource,
};

// ─── 공개 API ───────────────────────────────────────────────────────

export function generateQuiz(opts: {
  events: HistoryEvent[];
  count: number;
  types?: QuizType[];
  seed?: number;
  knownEventIds?: string[];
  difficulty?: Difficulty;
}): QuizQuestion[] {
  const { events, count, seed, knownEventIds } = opts;
  const difficulty = opts.difficulty ?? "real";
  const profile = DIFFICULTY_PROFILES[difficulty];
  if (events.length === 0) return [];

  const known = knownEventIds ? new Set(knownEventIds) : undefined;

  // 요청 유형이 있으면 난이도 프로필과 교집합을 쓴다
  let types = opts.types?.length
    ? opts.types.filter((t) => profile.types.includes(t))
    : profile.types;
  if (types.length === 0) types = profile.types;

  // 학습한 개념이 3개 미만이면 순서 배열은 만들 수 없다
  if (known && known.size < 3) {
    types = types.filter((t) => !CROSS_KNOWLEDGE_TYPES.includes(t));
  }
  if (types.length === 0) return [];

  // 난이도에 맞는 중요도 범위로 좁히되, 남는 게 없으면 전체를 쓴다
  const scoped = events.filter((e) => e.importance >= profile.minImportance);
  const target = scoped.length >= 4 ? scoped : events;

  // 기초는 중요한 개념부터, 고난도는 생소한 개념도 고르게 섞는다
  const weighted =
    difficulty === "hard"
      ? shuffle(target, seed)
      : shuffle(target, seed).sort((a, b) => b.importance - a.importance);

  const questions: QuizQuestion[] = [];
  const usedPerEvent = new Map<string, Set<QuizType>>();
  let cursor = 0;
  let typeCursor = seed ?? 0;
  let guard = 0;

  while (questions.length < count && guard < count * 40) {
    guard += 1;
    const event = weighted[cursor % weighted.length];
    cursor += 1;
    const type = types[typeCursor % types.length];
    typeCursor += 1;

    const used = usedPerEvent.get(event.id) ?? new Set<QuizType>();
    if (used.has(type)) continue;

    const q = GENERATORS[type]({
      event,
      all: events,
      seed: seed === undefined ? undefined : seed + guard,
      known,
      difficulty,
      pool: profile.distractorPool,
      spread: profile.spreadDistractors,
    });
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
  const difficulty = scope.difficulty ?? "real";
  const profile = DIFFICULTY_PROFILES[difficulty];
  // 방금 학습한 개념 자체는 항상 아는 것으로 취급
  const known = scope.knownEventIds
    ? new Set([...scope.knownEventIds, event.id])
    : undefined;

  const out: QuizQuestion[] = [];
  for (const type of profile.types) {
    if (CROSS_KNOWLEDGE_TYPES.includes(type) && known && known.size < 3) {
      continue;
    }
    const q = GENERATORS[type]({
      event,
      all,
      seed,
      known,
      difficulty,
      pool: profile.distractorPool,
      spread: profile.spreadDistractors,
    });
    if (q) out.push(q);
    if (out.length >= 4) break;
  }
  return out;
}
