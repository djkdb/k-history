import type { Concept } from "@/lib/types";
import type { SubjectId, Track } from "@/data/exam";
import { DESIGN_CONCEPTS } from "@/data/concepts-design";
import { DEVELOP_CONCEPTS } from "@/data/concepts-develop";
import { DATABASE_CONCEPTS } from "@/data/concepts-database";
import { LANGUAGE_CONCEPTS } from "@/data/concepts-language";
import { SYSTEM_CONCEPTS } from "@/data/concepts-system";
import { GAP_CONCEPTS } from "@/data/concepts-gap";

/**
 * 개념 전체.
 *
 * ⚠️ 과목 순으로 정렬해 내보낸다.
 *
 * 나중에 GAP_CONCEPTS(출제기준의 빈 범위를 메운 개념들)를 배열 끝에 덧붙였더니
 * 학습 목록이 설계→개발→DB→언어→구축관리→설계(다시)→개발(다시) 로 흘렀다.
 * 목록을 훑는 사람에게는 과목이 두 번 도는 것처럼 보이고, 홈의 "이어서 볼
 * 개념" 도 이 순서를 따르므로 새로 넣은 개념은 앞의 55개를 다 봐야 나온다.
 *
 * 어느 파일에 적었느냐가 아니라 어느 과목이냐로 줄을 세운다. 같은 과목 안에서는
 * 적어 둔 순서(쉬운 것 → 어려운 것)를 그대로 지킨다.
 */
const ORDER: Record<SubjectId, number> = {
  design: 0,
  develop: 1,
  database: 2,
  language: 3,
  system: 4,
};

export const CONCEPTS: Concept[] = [
  ...DESIGN_CONCEPTS,
  ...DEVELOP_CONCEPTS,
  ...DATABASE_CONCEPTS,
  ...LANGUAGE_CONCEPTS,
  ...SYSTEM_CONCEPTS,
  ...GAP_CONCEPTS,
].sort((a, b) => ORDER[a.subject] - ORDER[b.subject]);

export const CONCEPT_MAP: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c]),
);

/** 그 과목의 개념 */
export function conceptsOf(subject?: SubjectId): Concept[] {
  return subject ? CONCEPTS.filter((c) => c.subject === subject) : CONCEPTS;
}

/** 필기용인가 실기용인가로 거른다 */
export function conceptsFor(track: Track, subject?: SubjectId): Concept[] {
  return conceptsOf(subject).filter((c) => c.tracks.includes(track));
}
