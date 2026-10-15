import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { withEasy } from "@/lib/easy";
import { CHAPTERS } from "./chapters";
import { FIGURES } from "./figures";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { EASY } from "./easy";
import { NOTES_1 } from "./notes-1";
import { NOTES_2 } from "./notes-2";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";
import { QUESTIONS_4 } from "./questions-4";

/**
 * 데이터베이스시스템 (5118026-02) — Yoon Suk Kang 교수님
 *
 * 받은 자료: Lecture 1 Course Overview, Lecture 2 Intro & ER, Practice 1 ER(+풀이),
 * Lecture 3 RDB, Practice 2 RDB Mapping, Lecture 4 SQL, Lecture 5 View,
 * Lecture 6 Relational Algebra.
 *
 * 중간고사 범위(Weeks 1~7) 가운데 6주차 Functional Dependencies and
 * Normalization 자료는 받지 못했다 — 지어내지 않고 화면에 알린다.
 */
const course: Course = {
  id: "db",
  name: "데이터베이스시스템",
  short: "DB",
  code: "5118026-02",
  professor: "Yoon Suk Kang 교수님",
  examDate: "2026-10-23",
  examNote:
    "Lecture 1 Course Overview: Mid-term 10/23(금) 9:00 am, Room 106 & 104 (휴일에 따라 바뀔 수 있음). 시험지는 영어, 답은 한국어로 써도 됩니다.",
  missing: ["6주차 Functional Dependencies and Normalization — 강의 자료를 받지 못해 넣지 않았습니다"],
  englishExam: true,
  color: "#0ea5e9",
  symbol: "🗄️",
  chapters: CHAPTERS,
  concepts: withSources(withFigures(withEasy([...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3], EASY), FIGURES), SOURCES),
  pdfs: PDFS,
  notesPdf: {
    "Lecture 2. Introduction to DB Systems & ER Model": "notes-L2.pdf",
    "Practice 1. ER Model (해답)": "notes-P1.pdf",
    "Lecture 3. Relational Data Model": "notes-L3.pdf",
    "Practice 2. RDB Mapping (해답)": "notes-P2.pdf",
    "Lecture 4. Basic and Advanced SQL": "notes-L4.pdf",
    "Lecture 5. Advanced SQL: View": "notes-L5.pdf",
    "Lecture 6. Relational Algebra": "notes-L6.pdf",
  },
  questions: [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_4],
  notes: { ...NOTES_1, ...NOTES_2 },
};

export default course;
