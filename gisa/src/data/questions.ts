import type { WrittenQuestion } from "@/lib/types";
import type { SubjectId } from "@/data/exam";
import { DESIGN_QUESTIONS } from "@/data/questions-design";
import { DEVELOP_QUESTIONS } from "@/data/questions-develop";
import { DATABASE_QUESTIONS } from "@/data/questions-database";
import { LANGUAGE_QUESTIONS } from "@/data/questions-language";
import { SYSTEM_QUESTIONS } from "@/data/questions-system";
import { MORE_QUESTIONS } from "@/data/questions-more";
import { EXTRA_A_QUESTIONS } from "@/data/questions-extra-a";
import { EXTRA_B_QUESTIONS } from "@/data/questions-extra-b";
import { EXTRA_C_QUESTIONS } from "@/data/questions-extra-c";
import { DESIGN2_QUESTIONS } from "@/data/questions-design2";
import { DEVELOP2_QUESTIONS } from "@/data/questions-develop2";
import { DATABASE2_QUESTIONS } from "@/data/questions-database2";
import { LANGUAGE2_QUESTIONS } from "@/data/questions-language2";
import { SYSTEM2_QUESTIONS } from "@/data/questions-system2";
import { GAP_QUESTIONS } from "@/data/questions-gap";

export const QUESTIONS: WrittenQuestion[] = [
  ...DESIGN_QUESTIONS,
  ...DEVELOP_QUESTIONS,
  ...DATABASE_QUESTIONS,
  ...LANGUAGE_QUESTIONS,
  ...SYSTEM_QUESTIONS,
  ...MORE_QUESTIONS,
  ...EXTRA_A_QUESTIONS,
  ...EXTRA_B_QUESTIONS,
  ...EXTRA_C_QUESTIONS,
  ...DESIGN2_QUESTIONS,
  ...DEVELOP2_QUESTIONS,
  ...DATABASE2_QUESTIONS,
  ...LANGUAGE2_QUESTIONS,
  ...SYSTEM2_QUESTIONS,
  ...GAP_QUESTIONS,
];

export const QUESTION_MAP: Record<string, WrittenQuestion> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

export function questionsOf(subject?: SubjectId): WrittenQuestion[] {
  return subject ? QUESTIONS.filter((q) => q.subject === subject) : QUESTIONS;
}
