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

export type QuizMode = "all" | "new" | "wrong";

/**
 * 퀴즈에 낼 문제를 고른다.
 *
 *   all   — 섞어서. 다만 아직 안 푼 것과 틀린 것을 앞에 둔다
 *   new   — 한 번도 안 푼 것만
 *   wrong — 지금 틀린 채로 남은 것만
 *
 * 같은 개념의 문제가 연달아 나오지 않게 한 번 더 흩는다 — 바로 앞 문제가
 * 답을 알려 주는 꼴이 된다.
 */
export function pickQuiz(
  pool: Question[],
  log: Record<string, QuestionLog>,
  wrongIds: string[],
  mode: QuizMode,
  count: number,
  seed: number,
): Question[] {
  const wrong = new Set(wrongIds);
  let cand = pool;
  if (mode === "new") cand = pool.filter((q) => !log[q.id]);
  if (mode === "wrong") cand = pool.filter((q) => wrong.has(q.id));
  const shuffled = seededShuffle(cand, seed);
  const rank = (q: Question) => (wrong.has(q.id) ? 0 : !log[q.id] ? 1 : 2);
  const ordered = mode === "all" ? [...shuffled].sort((a, b) => rank(a) - rank(b)) : shuffled;
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
