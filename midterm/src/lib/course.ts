/**
 * 지금 과목의 자료와 찾아보기 표.
 *
 * "@course" 는 빌드할 때 next.config 가 src/courses/<과목>/ 으로 잇는다.
 * 그래서 한 과목을 빌드하면 그 과목의 자료만 실린다.
 */
import course from "@course";
import type { Chapter, Concept, Question } from "./types";

export const COURSE = course;

export const CHAPTER_MAP: Record<string, Chapter> = Object.fromEntries(
  course.chapters.map((c) => [c.id, c]),
);
export const CONCEPT_MAP: Record<string, Concept> = Object.fromEntries(
  course.concepts.map((c) => [c.id, c]),
);
export const Q_MAP: Record<string, Question> = Object.fromEntries(
  course.questions.map((q) => [q.id, q]),
);

export function conceptsOf(chapterId: string): Concept[] {
  return course.concepts.filter((c) => c.chapter === chapterId);
}
export function questionsOf(conceptId: string): Question[] {
  return course.questions.filter((q) => q.concept === conceptId);
}
export function questionsOfChapter(chapterId: string): Question[] {
  const ids = new Set(conceptsOf(chapterId).map((c) => c.id));
  return course.questions.filter((q) => ids.has(q.concept));
}
export function chapterOfQuestion(q: Question): Chapter | undefined {
  const c = CONCEPT_MAP[q.concept];
  return c ? CHAPTER_MAP[c.chapter] : undefined;
}

/** 용어 이름 — 영어 시험이면 영어를 앞에 둔다 */
export function termLabel(c: { title: string; en?: string }): string {
  if (!c.en) return c.title;
  return course.englishExam ? `${c.en} · ${c.title}` : c.title;
}
