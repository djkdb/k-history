import type { PracticalQuestion, WrittenQuestion } from "@/lib/types";
import type { SubjectId } from "@/data/exam";
import { SUBJECTS } from "@/data/exam";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { dropTwins } from "@/data/twins";

/** 씨앗으로 도는 난수 — 같은 씨앗이면 늘 같은 시험지가 나온다 */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const r = rng(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 선지 자리를 섞는다.
 *
 * 문항을 손으로 쓰다 보면 정답을 무심코 비슷한 자리에 놓게 된다. 실제로
 * 재 보니 2번이 42%, 4번이 10% 였다 — 아무것도 모르고 2번만 찍어도 42점이
 * 나온다는 뜻이다. 시험을 재는 도구로서 이건 고장이다.
 *
 * 자료를 손보는 대신 낼 때 섞는다. 같은 씨앗이면 같은 순서가 나오므로
 * 시험 도중 새로고침해도 고른 자리가 어긋나지 않는다 — 이것이 중요하다.
 * 저장된 답안은 "몇 번을 골랐다" 이지 "무엇을 골랐다" 가 아니기 때문이다.
 */
export function shuffleOptions(
  q: WrittenQuestion,
  seed: number,
): WrittenQuestion {
  // 문항마다 다른 씨앗을 준다. 그러지 않으면 한 시험지 안의 모든 문항이
  // 같은 순열로 섞여 자리 쏠림이 그대로 옮겨 간다.
  let h = seed >>> 0;
  for (let i = 0; i < q.id.length; i++)
    h = (Math.imul(h, 31) + q.id.charCodeAt(i)) >>> 0;

  const order = shuffle(
    q.options.map((_, i) => i),
    h || 1,
  );
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    answerIndex: order.indexOf(q.answerIndex),
    optionNotes: q.optionNotes
      ? order.map((i) => q.optionNotes![i])
      : undefined,
  };
}

export interface QuizOptions {
  subject?: SubjectId;
  count: number;
  seed: number;
  /** 이 개념들만 — 오답 노트에서 쓴다 */
  onlySourceIds?: string[];
  /** 이 문항들만 — 여러 번 틀린 문항을 다시 풀 때 */
  onlyIds?: string[];
}

/** 연습용 필기 문제 뽑기 */
export function makeQuiz(opts: QuizOptions): WrittenQuestion[] {
  let pool = QUESTIONS;
  if (opts.subject) pool = pool.filter((q) => q.subject === opts.subject);
  if (opts.onlySourceIds?.length) {
    const set = new Set(opts.onlySourceIds);
    pool = pool.filter((q) => set.has(q.sourceId));
  }
  /*
   * 문항 자체를 찍어서 고를 때 쓴다. 개념 단위(onlySourceIds)로는 "이 개념에서
   * 한 번 틀렸다" 까지만 좁혀지는데, 여러 번 틀린 그 문항만 다시 보고 싶을
   * 때가 있다.
   */
  if (opts.onlyIds?.length) {
    const set = new Set(opts.onlyIds);
    pool = pool.filter((q) => set.has(q.id));
  }
  /*
   * 같은 것을 묻는 짝은 한 벌에 하나만 낸다.
   * 섞은 뒤에 걸러야 어느 쪽이 남을지도 씨앗을 따른다.
   */
  return dropTwins(shuffle(pool, opts.seed))
    .slice(0, opts.count)
    .map((q) => shuffleOptions(q, opts.seed));
}

/**
 * 필기 모의고사 한 벌.
 *
 * 실제 시험은 과목마다 20문항이고 한 과목이라도 40점에 못 미치면 과락이다.
 * 그래서 과목을 섞지 않고 과목별로 20문항씩 순서대로 담는다 — 결과 화면에서
 * 과목별 점수를 그대로 보여 주기 위해서다.
 */
export function makeWrittenMock(seed = Date.now()): WrittenQuestion[] {
  return SUBJECTS.flatMap((s, i) =>
    /*
     * 같은 것을 묻는 짝은 한 벌에 하나만 낸다.
     *
     * ⚠️ 이것을 빠뜨렸을 때 500 회를 만들어 세어 보니, 시험지 넷 중 셋(75%)에
     *    같은 것을 두 번 묻는 짝이 들어 있었다. 100 문항 중 두 문항이 같은
     *    말을 하면, 푸는 사람은 모르는 것을 하나 덜 만나는 셈이다.
     */
    dropTwins(
      shuffle(
        QUESTIONS.filter((q) => q.subject === s.id),
        seed + i * 1000,
      ),
    )
      .slice(0, s.count)
      .map((q) => shuffleOptions(q, seed)),
  );
}

/**
 * 실기 모의고사 한 벌.
 *
 * 실기는 100점 만점이다. 문항마다 배점이 달라 딱 100점을 맞추기 어려우므로,
 * 100점을 넘기지 않는 선에서 최대한 채운다. 모자란 점수는 결과 화면에
 * 그대로 밝힌다 — 만점이 몇 점인지 숨기면 점수를 읽을 수 없다.
 */
export function makePracticalMock(
  seed = Date.now(),
  target = 100,
): PracticalQuestion[] {
  /*
   * 과목을 고르게 채운다.
   *
   * 그냥 전체에서 섞어 뽑으면 문항이 많은 과목이 그만큼 더 뽑힌다. 실제로
   * 언어 문항을 늘렸더니 한 벌의 36%가 언어가 되었다 — 나머지 네 과목을
   * 합친 것과 맞먹는다. 실기는 다섯 과목에서 고루 나오므로 그렇게 두면
   * 연습이 실제와 달라진다.
   *
   * 과목마다 target/5 만큼을 먼저 채우고, 딱 떨어지지 않아 남은 몫만
   * 전체에서 메운다.
   */
  const per = Math.floor(target / SUBJECTS.length);
  const picked: PracticalQuestion[] = [];
  const taken = new Set<string>();
  let sum = 0;

  for (const [i, s] of SUBJECTS.entries()) {
    // 실기에도 같은 것을 묻는 짝이 있다 — 한 벌에 하나만 낸다
    const pool = dropTwins(
      shuffle(
        PRACTICAL_QUESTIONS.filter((q) => q.subject === s.id),
        seed + i * 977,
      ),
    );
    let mine = 0;
    for (const q of pool) {
      if (mine + q.points > per) continue;
      if (sum + q.points > target) continue;
      picked.push(q);
      taken.add(q.id);
      mine += q.points;
      sum += q.points;
      if (mine === per) break;
    }
  }

  if (sum < target) {
    for (const q of shuffle(PRACTICAL_QUESTIONS, seed + 13)) {
      if (taken.has(q.id)) continue;
      if (sum + q.points > target) continue;
      picked.push(q);
      taken.add(q.id);
      sum += q.points;
      if (sum === target) break;
    }
  }

  // 과목 순으로 내보낸다 — 결과 화면에서 과목별로 읽기 위해서다
  const order = new Map(SUBJECTS.map((s, i) => [s.id, i]));
  return picked.sort(
    (a, b) => (order.get(a.subject) ?? 9) - (order.get(b.subject) ?? 9),
  );
}

/** 과목별로 몇 개를 맞혔는가 */
export function tallyBySubject(
  questions: WrittenQuestion[],
  answers: Record<number, number>,
): { subject: SubjectId; correct: number; total: number }[] {
  return SUBJECTS.map((s) => {
    const mine = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.subject === s.id);
    return {
      subject: s.id,
      correct: mine.filter(({ q, i }) => answers[i] === q.answerIndex).length,
      total: mine.length,
    };
  }).filter((r) => r.total > 0);
}
