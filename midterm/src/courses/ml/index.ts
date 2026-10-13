import type { Course } from "@/lib/types";
import { CHAPTERS } from "./chapters";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";

/**
 * 머신러닝 (5119015-01) — 이건명 교수님
 *
 * 받은 자료: ML-1 개요, ML-2 분류·평가, ML-3 비지도 학습, ML-04 회귀·추천,
 * ML-05 분류 방법, ML-6 앙상블, ML-7 회귀 기법, ML-8 신경망 I·II,
 * ML-9 딥러닝 I, ML-9 CNN.
 *
 * 시험 날짜는 자료에 없어서 비워 둔다 — 처음 열 때 직접 입력.
 */
const course: Course = {
  id: "ml",
  name: "머신러닝",
  short: "머신러닝",
  code: "5119015-01",
  professor: "이건명 교수님",
  englishExam: false,
  color: "#a855f7",
  symbol: "🤖",
  chapters: CHAPTERS,
  concepts: [...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3],
  questions: [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3],
};

export default course;
