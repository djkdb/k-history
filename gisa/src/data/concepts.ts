import type { Concept } from "@/lib/types";
import type { SubjectId, Track } from "@/data/exam";
import { DESIGN_CONCEPTS } from "@/data/concepts-design";
import { DEVELOP_CONCEPTS } from "@/data/concepts-develop";
import { DATABASE_CONCEPTS } from "@/data/concepts-database";
import { LANGUAGE_CONCEPTS } from "@/data/concepts-language";
import { SYSTEM_CONCEPTS } from "@/data/concepts-system";
import { GAP_CONCEPTS } from "@/data/concepts-gap";

export const CONCEPTS: Concept[] = [
  ...DESIGN_CONCEPTS,
  ...DEVELOP_CONCEPTS,
  ...DATABASE_CONCEPTS,
  ...LANGUAGE_CONCEPTS,
  ...SYSTEM_CONCEPTS,
  ...GAP_CONCEPTS,
];

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
