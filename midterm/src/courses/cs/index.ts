import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { CHAPTERS } from "./chapters";
import { FIGURES } from "./figures";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { NOTES_1 } from "./notes-1";
import { NOTES_2 } from "./notes-2";
import { NOTES_3 } from "./notes-3";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";

/** 컴퓨터시스템개론 (5118003-02) — 최경주 교수님. 받은 자료: CS 01 ~ 04-4. 시험 날짜는 자료에 없어 비워 둔다. */
const course: Course = {
  id: "cs",
  name: "컴퓨터시스템개론",
  short: "컴시개",
  code: "5118003-02",
  professor: "최경주 교수님",
  englishExam: false,
  color: "#f59e0b",
  symbol: "🖥️",
  chapters: CHAPTERS,
  concepts: withSources(withFigures([...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3], FIGURES), SOURCES),
  pdfs: PDFS,
  questions: [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3],
  notes: { ...NOTES_1, ...NOTES_2, ...NOTES_3 },
};

export default course;
