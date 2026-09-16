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
  // 필기
  ["qd-coupling-low", "qd-coupling-rank"],            // 결합도가 가장 낮은 것
  ["qd-cohesion-high", "qd-cohesion-rank"],           // 응집도가 가장 높은 것
  ["qb-sql-outer", "qb-join-outer"],                  // LEFT OUTER JOIN
  ["qb-anomaly", "qb-anomaly-kind"],                  // 삭제 이상
  ["qb-bcnf", "qb-norm-bcnf"],                        // BCNF 조건
  ["qb-schema-conceptual", "qb-schema-three"],        // 개념 스키마
  ["qb-trigger", "qg-proc-trigger"],                  // 트리거
  ["qv-integration-stub", "qv-test-integration"],     // 하향식 = 스텁
  ["qv-refactoring", "qv-clean-refactor"],            // 리팩터링의 정의
  ["qv-test-alpha", "qv2-test-alpha-beta"],           // 알파 = 통제된 환경
  ["qv-drm", "qv-package-drm"],                       // DRM 구성 요소
  ["ql-net-layer", "ql-osi-layer"],                   // 라우터 = 네트워크 계층
  ["ql-os-fit", "ql-os-alloc"],                       // 최적 적합
  ["ql-lang-paradigm", "qg-lang-paradigm"],           // 논리형 = PROLOG
  ["ql-java-override", "ql-java-dynamic"],            // 같은 코드·같은 답
  ["qs-sdn", "qs-new-sdn"],                           // SDN
  ["qs-cocomo", "qs-cocomo-mode"],                    // COCOMO 조직형
  ["qs-fp", "qs-fp-estimate"],                        // 기능 점수
  ["qs-raid5", "qs-raid-level"],                      // RAID 5 / RAID 1
  ["qs-secure-coding", "qs-secure-coding-input"],     // 입력 데이터 검증 및 표현
  ["qb-cap", "qb-nosql-cap"],                         // CAP 세 가지
  ["qs-esb", "qs-method-cbd"],                        // CBD
  // 실기
  ["pq-blank-cocomo", "pq-cocomo-organic"],           // COCOMO 조직형
  ["pq-stub", "pq-driver"].slice(0, 0),               // (서로 다른 것을 묻는다 — 묶지 않는다)
].filter((g) => g.length > 1);

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
