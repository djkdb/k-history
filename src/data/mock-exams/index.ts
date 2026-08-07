import type { MockExam, MockExamQuestion } from "@/lib/types";
import { ROUND_60_ADVANCED } from "./round-60-advanced";
import { ROUND_62_ADVANCED } from "./round-62-advanced";
import { ROUND_63_ADVANCED } from "./round-63-advanced";
import { ROUND_65_ADVANCED } from "./round-65-advanced";
import { ROUND_69_ADVANCED } from "./round-69-advanced";
import { ROUND_70_ADVANCED } from "./round-70-advanced";
import { ROUND_71_ADVANCED } from "./round-71-advanced";
import { ROUND_72_ADVANCED } from "./round-72-advanced";
import { ROUND_73_ADVANCED } from "./round-73-advanced";
import { ROUND_74_ADVANCED } from "./round-74-advanced";
import { ROUND_75_ADVANCED } from "./round-75-advanced";
import { ROUND_76_ADVANCED } from "./round-76-advanced";
import { ROUND_77_ADVANCED } from "./round-77-advanced";
import { ROUND_78_ADVANCED } from "./round-78-advanced";

/**
 * 기출 모의고사 등록소.
 *
 * 문항과 정답은 국사편찬위원회가 공개한 기출 자료에서 가져왔습니다.
 * scripts/import-exam.py 가 문제지 PDF에서 문항 이미지를,
 * 정답표 PDF에서 정답과 배점을 추출해 만든 파일들입니다.
 * 각 회차 화면에 출처가 표시됩니다.
 *
 * 제공 방식이 두 가지입니다.
 *  · 문항 분할형 — 문제지에 텍스트 레이어가 있어 문항별로 잘라낸 회차
 *  · 쪽 이미지형 — 스캔 PDF라 자동 분할이 불가해, 시험지를 넘겨 보며
 *    OMR에 답을 체크하는 방식 (pageImages가 있으면 쪽 뷰어로 렌더링)
 *
 * 회차를 추가하려면:
 *   python3 scripts/import-exam.py <문제지.pdf> <회차> advanced --answer-pdf <정답표.pdf>
 * 실행 후 생성된 파일을 아래 배열에 넣으세요.
 */
export const MOCK_EXAMS: MockExam[] = [
  ROUND_78_ADVANCED,
  ROUND_77_ADVANCED,
  ROUND_76_ADVANCED,
  ROUND_75_ADVANCED,
  ROUND_74_ADVANCED,
  ROUND_73_ADVANCED,
  ROUND_72_ADVANCED,
  ROUND_71_ADVANCED,
  ROUND_70_ADVANCED,
  ROUND_69_ADVANCED,
  ROUND_65_ADVANCED,
  ROUND_63_ADVANCED,
  ROUND_62_ADVANCED,
  ROUND_60_ADVANCED,
];

export function getMockExam(id: string): MockExam | undefined {
  return MOCK_EXAMS.find((e) => e.id === id);
}

/** 만점 (배점 합계) */
export function totalPoints(exam: MockExam): number {
  return exam.questions.reduce((s, q) => s + q.points, 0);
}

/**
 * 이 문항을 맞힌 것으로 볼 것인가.
 *
 * 정답 번호가 0이면 "정답 없음 — 응시자 전원 정답 처리"다.
 * 문항이의심사에서 오류로 판정된 문항이 실제로 있다(63회 42번).
 * 그런 문항은 무엇을 골라도, 아예 고르지 않아도 맞은 것으로 친다.
 * 채점·오답 목록·결과 격자가 제각각 판단하면 점수와 표시가 어긋나므로
 * 판단은 여기 한 곳에서만 한다.
 */
export function isCorrect(q: MockExamQuestion, picked: number | undefined): boolean {
  if (q.answer === 0) return true;
  return picked === q.answer;
}

/** 시험지를 넘겨 보며 푸는 방식인가 */
export function isPageMode(exam: MockExam): boolean {
  return !!exam.pageImages?.length;
}

/** 해설이 달린 문항 수 — 목록에서 미리 알려 주기 위해 쓴다 */
export function explainedCount(exam: MockExam): number {
  return exam.questions.filter((q) => q.explanation).length;
}
