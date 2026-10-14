import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { withEasy } from "@/lib/easy";
import { CHAPTERS } from "./chapters";
import { FIGURES } from "./figures";
import { CONCEPTS } from "./concepts";
import { EASY } from "./easy";
import { NOTES } from "./notes";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";

/**
 * 소프트웨어공학 (5120004-01) — 이의종 교수님 (Prof. Euijong Lee)
 *
 * 받은 자료: OT, #1 Ch1 Software Quality and Principles, #2 Ch2-1 SW Processes,
 * Ch2-2 Agile Software Development, Ch2-3 DevOps, #3-1 Project Management.
 *
 * OT 의 주차표상 중간고사 범위는 1~7주인데, 6주차 Project planning 과
 * 7주차 Requirements analysis 교안은 받지 못했다 — 지어내지 않고 화면에 알린다.
 * 시험은 8주차라고만 되어 있어 날짜는 비워 둔다.
 */
const course: Course = {
  id: "se",
  name: "소프트웨어공학",
  short: "SW공학",
  code: "5120004-01",
  professor: "이의종 교수님",
  examNote: "OT 주차표: 8주차 Mid-term exam (날짜는 교안에 없음). 평가: 출석 10% · 중간 25% · 기말 25% · 프로젝트 40%.",
  missing: [
    "6주차 Project planning (가격 책정, 애자일·계획 기반 계획, COCOMO) — 교안을 받지 못해 넣지 않았습니다",
    "7주차 Requirements analysis (요구공학 정의와 세부) — 교안을 받지 못해 넣지 않았습니다",
  ],
  englishExam: false,
  color: "#10b981",
  symbol: "🛠️",
  chapters: CHAPTERS,
  concepts: withSources(withFigures(withEasy(CONCEPTS, EASY), FIGURES), SOURCES),
  pdfs: PDFS,
  questions: [...QUESTIONS_1, ...QUESTIONS_2],
  notes: NOTES,
};

export default course;
