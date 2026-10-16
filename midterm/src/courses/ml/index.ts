import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { CHAPTERS } from "./chapters";
import { FIGURES } from "./figures";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";
import { QUESTIONS_4 } from "./questions-4";
import { QUESTIONS_PDF } from "./questions-pdf";
import { EASY } from "./easy";
import { withEasy, withExplain } from "@/lib/easy";
import { EXPLAIN } from "./explain";
import { INTRO } from "./notes/intro";
import { CLS } from "./notes/cls";
import { UNSUP } from "./notes/unsup";
import { REGREC } from "./notes/regrec";
import { CLSM } from "./notes/clsm";
import { ENS } from "./notes/ens";
import { REGT } from "./notes/regt";
import { NN1 } from "./notes/nn1";
import { NN2 } from "./notes/nn2";
import { DL } from "./notes/dl";
import { CNN } from "./notes/cnn";
import { CNNM } from "./notes/cnnm";
import { CONCEPTS_4 } from "./concepts-4";
import { QUESTIONS_5 } from "./questions-5";

/**
 * 머신러닝 (5119015-01) — 이건명 교수님
 *
 * 받은 자료: ML-1 개요, ML-2 분류·평가, ML-3 비지도 학습, ML-04 회귀·추천,
 * ML-05 분류 방법, ML-6 앙상블, ML-7 회귀 기법, ML-8 신경망 I·II,
 * ML-9 딥러닝 I, ML-9 CNN, ML-9 CNN 모델.
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
  concepts: withSources(withFigures(withExplain(withEasy([...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3, ...CONCEPTS_4], EASY), EXPLAIN), FIGURES), SOURCES),
  pdfs: PDFS,
  // 강의 PDF 퀴즈(원문)를 먼저, 강의 내용으로 만든 추가 문제를 뒤에
  questions: [...QUESTIONS_PDF, ...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_4, ...QUESTIONS_5],
  notes: {
    intro: INTRO,
    cls: CLS,
    unsup: UNSUP,
    regrec: REGREC,
    clsm: CLSM,
    ens: ENS,
    regt: REGT,
    nn1: NN1,
    nn2: NN2,
    dl: DL,
    cnn: CNN,
    cnnm: CNNM,
  },
};

export default course;
