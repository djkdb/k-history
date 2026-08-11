import type { Concept, Grade, SubjectId } from "@/lib/types";
import { COMPUTER_CONCEPTS } from "./concepts-computer";
import { SPREADSHEET_CONCEPTS } from "./concepts-spreadsheet";
import { DATABASE_CONCEPTS } from "./concepts-database";
import { inGrade } from "./subjects";

/**
 * 필기 개념 전체.
 *
 * 순서는 과목 순서를 따른다 — 컴퓨터 일반 → 스프레드시트 일반 →
 * 데이터베이스 일반. 급수 구분은 각 개념의 minGrade가 들고 있으므로
 * 데이터는 한 벌만 둔다.
 */
export const CONCEPTS: Concept[] = [
  ...COMPUTER_CONCEPTS,
  ...SPREADSHEET_CONCEPTS,
  ...DATABASE_CONCEPTS,
];

export const CONCEPT_MAP: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c]),
);

/** 급수에 드는 개념만 (2급이면 데이터베이스와 1급 전용 항목이 빠진다) */
export function conceptsFor(grade: Grade, subject?: SubjectId): Concept[] {
  return CONCEPTS.filter(
    (c) => inGrade(grade, c.minGrade) && (!subject || c.subject === subject),
  );
}

/** 과목 안의 갈래(topic) 목록 — 데이터에 나온 순서를 지킨다 */
export function topicsOf(grade: Grade, subject: SubjectId): string[] {
  const seen: string[] = [];
  for (const c of conceptsFor(grade, subject)) {
    if (!seen.includes(c.topic)) seen.push(c.topic);
  }
  return seen;
}

/** 급수별 개념 수 — 홈 화면의 진도 표시에 쓴다 */
export function conceptCount(grade: Grade): number {
  return conceptsFor(grade).length;
}
