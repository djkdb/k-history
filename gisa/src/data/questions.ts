import type { WrittenQuestion } from "@/lib/types";
import type { SubjectId } from "@/data/exam";
import { DESIGN_QUESTIONS } from "@/data/questions-design";
import { DEVELOP_QUESTIONS } from "@/data/questions-develop";
import { DATABASE_QUESTIONS } from "@/data/questions-database";
import { LANGUAGE_QUESTIONS } from "@/data/questions-language";
import { SYSTEM_QUESTIONS } from "@/data/questions-system";
import { MORE_QUESTIONS } from "@/data/questions-more";

export const QUESTIONS: WrittenQuestion[] = [
  ...DESIGN_QUESTIONS,
  ...DEVELOP_QUESTIONS,
  ...DATABASE_QUESTIONS,
  ...LANGUAGE_QUESTIONS,
  ...SYSTEM_QUESTIONS,
  ...MORE_QUESTIONS,
];

export const QUESTION_MAP: Record<string, WrittenQuestion> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

export function questionsOf(subject?: SubjectId): WrittenQuestion[] {
  return subject ? QUESTIONS.filter((q) => q.subject === subject) : QUESTIONS;
}
