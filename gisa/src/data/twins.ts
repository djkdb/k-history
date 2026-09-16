import { QUESTIONS } from "./questions";
import { PRACTICAL_QUESTIONS } from "./practical";

/**
 * 같은 사실을 묻는 문항 묶음.
 *
 * 문항을 다섯 과목에 걸쳐 늘려 오는 동안, 같은 것을 조금 다르게 적은 문항이
 * 쌓였다. 감사는 "문제문이 똑같은가" 만 보므로 그런 것들을 그대로 통과시켰다.
 * 실제로 재어 보니 한 회 시험지의 75%에 같은 것을 두 번 묻는 짝이 들어 있었다.
 *
 * 문항을 지우면 이미 푼 사람의 기록(맞힌 문항·오답 노트)이 가리킬 곳을 잃는다.
 * 그래서 지우지 않고, 한 벌을 만들 때 한 묶음에서 하나만 뽑는다.
 *
 * 묶음에 넣는 기준은 "정답이 같고 묻는 바가 같은가" 다. 계산 문항처럼 답이
 * 우연히 같을 뿐인 것(LRU 5회 ↔ FIFO 5회)은 서로 다른 문항이므로 넣지 않는다.
 */
export const TWIN_GROUPS: string[][] = [
  /*
   * 지금은 비어 있다.
   *
   * 처음 이 표를 만들었을 때는 스물세 묶음이 들어 있었다 — 같은 사실을 조금
   * 다르게 적은 문항들이다. 한 벌에 하나만 내는 것으로 덮어 두었다가,
   * 짝의 한쪽을 다른 사실을 묻도록 다시 썼다. 결합도는 "가장 낮은 것" 과
   * "전역 변수를 함께 쓰면?" 으로, COCOMO 는 "조직형" 과 "Putnam 모형" 으로
   * 갈라졌다. 덮는 대신 채운 셈이라 문제 은행이 스물셋만큼 넓어졌다.
   *
   * 표를 지우지 않고 비워 두는 이유는, 나중에 문항을 더하다 같은 것을 두 번
   * 묻게 될 때가 오기 때문이다. 감사가 그것을 잡아 여기에 적으라고 말한다.
   * 다시 쓸 수 있으면 다시 쓰고, 그러기 어려우면 여기에 묶어 둔다.
   */
];

/** 문항 id → 그 문항이 속한 묶음 번호 */
export const TWIN_OF: Record<string, number> = {};
TWIN_GROUPS.forEach((g, i) => g.forEach((id) => (TWIN_OF[id] = i)));

/**
 * 한 묶음에서 하나만 남긴다. 앞에서부터 훑으므로,
 * 이미 섞은 목록을 넘기면 어느 쪽이 남을지도 씨앗을 따른다.
 */
export function dropTwins<T extends { id: string }>(list: T[]): T[] {
  const seen = new Set<number>();
  return list.filter((q) => {
    const g = TWIN_OF[q.id];
    if (g === undefined) return true;
    if (seen.has(g)) return false;
    seen.add(g);
    return true;
  });
}

/** 적어 둔 id 가 실제로 있는지 — 오타로 조용히 새는 것을 막는다 */
export function unknownTwinIds(): string[] {
  const have = new Set<string>([
    ...QUESTIONS.map((q) => q.id),
    ...PRACTICAL_QUESTIONS.map((q) => q.id),
  ]);
  return TWIN_GROUPS.flat().filter((id) => !have.has(id));
}
