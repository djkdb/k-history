import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { CHAPTERS } from "./chapters";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { FIGURES } from "./figures";
import { NOTES_1 } from "./notes-1";
import { NOTES_2 } from "./notes-2";
import { NOTES_3 } from "./notes-3";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";
import { QUESTIONS_4 } from "./questions-4";

/**
 * 정보검색 (5119006-01)
 *
 * 받은 자료: Introduction to Information Retrieval(IIR) 1~7장 강의 슬라이드
 * (Schütze) — 01intro, 02voc, 03dict, 04const, 05comp, 06score, 07system.
 * 슬라이드가 영어라 용어를 영어와 함께 보인다. 시험 날짜·교수명은 자료에 없어 비워 둔다.
 */
const course: Course = {
  id: "ir",
  name: "정보검색",
  short: "정보검색",
  code: "5119006-01",
  examDate: "2026-10-27",
  examNote: "중간고사 10/27(화) — 강의 자료에는 날짜가 없어 직접 알려 준 날짜로 넣었습니다.",
  englishExam: true,
  color: "#f43f5e",
  symbol: "🔎",
  chapters: CHAPTERS,
  concepts: withSources(withFigures([...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3], FIGURES), SOURCES),
  pdfs: PDFS,
  notesPdf: {
    "IIR 1. Boolean Retrieval (01intro)": "notes-1.pdf",
    "IIR 2. The term vocabulary and postings lists (02voc)": "notes-2.pdf",
  },
  questions: [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_4],
  notes: { ...NOTES_1, ...NOTES_2, ...NOTES_3 },
};

export default course;
