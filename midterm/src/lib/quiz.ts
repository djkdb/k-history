import type { Question, QuestionLog } from "./types";

/** 씨앗이 같으면 늘 같은 순서 — 모의고사를 새로고침해도 문제가 바뀌지 않게 */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed >>> 0 || 1;
  const rnd = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizMode = "all" | "new" | "wrong" | "sure" | "shaky" | "starred";

/** 문제를 고를 때 보는 내 기록 */
export interface QuizMarks {
  log: Record<string, QuestionLog>;
  /** 지금 틀린 채로 남은 것 */
  wrongIds: string[];
  /** 확신했는데 틀린 것 */
  sure: string[];
  /** 찍어서 맞힌 것 */
  lucky: string[];
  /** 별표한 개념 */
  starred: string[];
}

/** 이 조건에 드는 문제 */
export function filterQuiz(pool: Question[], m: QuizMarks, mode: QuizMode): Question[] {
  switch (mode) {
    case "new":
      return pool.filter((q) => !m.log[q.id]);
    case "wrong": {
      const w = new Set(m.wrongIds);
      return pool.filter((q) => w.has(q.id));
    }
    case "sure": {
      const w = new Set(m.sure);
      return pool.filter((q) => w.has(q.id));
    }
    case "shaky": {
      // 확신 오답 + 틀린 것 + 찍어 맞힌 것 — 아직 안다고 할 수 없는 것 전부
      const w = new Set([...m.sure, ...m.wrongIds, ...m.lucky]);
      return pool.filter((q) => w.has(q.id));
    }
    case "starred": {
      const st = new Set(m.starred);
      return pool.filter((q) => st.has(q.concept));
    }
    default:
      return pool;
  }
}

/**
 * 퀴즈에 낼 문제를 고른다.
 *
 *   all     — 섞어서. 다만 확신 오답 → 틀린 것·찍어 맞힌 것 → 안 푼 것 순으로 앞에 둔다
 *   new     — 한 번도 안 푼 것만
 *   wrong   — 지금 틀린 채로 남은 것만
 *   sure    — 확신했는데 틀린 것만
 *   shaky   — 아직 안다고 할 수 없는 것 전부
 *   starred — 별표한 개념의 문제
 *
 * 같은 개념의 문제가 연달아 나오지 않게 한 번 더 흩는다 — 바로 앞 문제가
 * 답을 알려 주는 꼴이 된다.
 */
export function pickQuiz(pool: Question[], m: QuizMarks, mode: QuizMode, count: number, seed: number): Question[] {
  const sure = new Set(m.sure);
  const weak = new Set([...m.wrongIds, ...m.lucky]);
  const shuffled = seededShuffle(filterQuiz(pool, m, mode), seed);
  const rank = (q: Question) => (sure.has(q.id) ? 0 : weak.has(q.id) ? 1 : !m.log[q.id] ? 2 : 3);
  const ordered = mode === "new" ? shuffled : [...shuffled].sort((a, b) => rank(a) - rank(b));
  return spread(ordered.slice(0, count));
}

/** 같은 개념이 이웃하지 않게 */
export function spread(qs: Question[]): Question[] {
  const out: Question[] = [];
  const rest = [...qs];
  while (rest.length) {
    const prev = out[out.length - 1]?.concept;
    const i = rest.findIndex((q) => q.concept !== prev);
    out.push(rest.splice(i < 0 ? 0 : i, 1)[0]);
  }
  return out;
}

/**
 * 모의고사 — 장마다 문제 수에 비례해 고르게 뽑는다.
 * 한 장에 몰리면 시험 범위를 고루 본 것이 아니다.
 */
export function pickMock(
  byChapter: Question[][],
  total: number,
  seed: number,
): Question[] {
  const all = byChapter.reduce((n, qs) => n + qs.length, 0);
  if (all === 0) return [];
  const want = Math.min(total, all);
  const quota = byChapter.map((qs) => Math.floor((qs.length / all) * want));
  let left = want - quota.reduce((a, b) => a + b, 0);
  // 남은 몫은 문제가 많은 장부터 하나씩
  const order = byChapter.map((qs, i) => i).sort((a, b) => byChapter[b].length - byChapter[a].length);
  for (let k = 0; left > 0; k = (k + 1) % order.length) {
    const i = order[k];
    if (quota[i] < byChapter[i].length) {
      quota[i]++;
      left--;
    }
  }
  const picked = byChapter.flatMap((qs, i) => seededShuffle(qs, seed + i * 7919).slice(0, quota[i]));
  return spread(seededShuffle(picked, seed + 1));
}
