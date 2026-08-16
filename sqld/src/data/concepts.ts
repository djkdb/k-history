import type { Concept, SubjectId } from "@/lib/types";
import { CONCEPTS_MODELING } from "./concepts-modeling";
import { CONCEPTS_MODELING_MORE } from "./concepts-modeling-more";
import { CONCEPTS_SQL_BASIC } from "./concepts-sql-basic";
import { CONCEPTS_SQL_ADVANCED } from "./concepts-sql-advanced";
import { CONCEPTS_SQL_MORE } from "./concepts-sql-more";
import { CONCEPTS_SQL_MORE2 } from "./concepts-sql-more2";

export const CONCEPTS: Concept[] = [
  ...CONCEPTS_MODELING,
  ...CONCEPTS_MODELING_MORE,
  ...CONCEPTS_SQL_BASIC,
  ...CONCEPTS_SQL_ADVANCED,
  ...CONCEPTS_SQL_MORE,
  ...CONCEPTS_SQL_MORE2,
];

export const CONCEPT_MAP: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c]),
);

export function conceptsOf(subject: SubjectId): Concept[] {
  return CONCEPTS.filter((c) => c.subject === subject);
}

export function conceptsOfChapter(chapter: string): Concept[] {
  return CONCEPTS.filter((c) => c.chapter === chapter);
}
