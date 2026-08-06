import type { MockExam } from "@/lib/types";

/**
 * 기출 모의고사 등록소.
 *
 * ⚠️ 현재 비어 있습니다. 기출 문항은 국사편찬위원회가 제작·공개한 자료이므로
 * 원본 배포처에서 직접 내려받아 넣습니다. 제3자 사이트의 사본을 긁어오지 않습니다.
 *
 * ─── 추가하는 방법 ─────────────────────────────────────────────────
 * 1. 공식 자료실에서 회차별 문제지 PDF와 정답표를 받습니다.
 *    https://www.historyexam.go.kr → 자료실 → 기출문제 (무료·로그인 불필요)
 *
 * 2. 임포터를 돌립니다. 문항이 자동으로 잘려 이미지로 저장되고
 *    데이터 파일 뼈대가 만들어집니다.
 *
 *    python3 scripts/import-exam.py ~/Downloads/68회_심화.pdf 68 advanced \
 *      --answers 3,1,4,2,5,...
 *
 * 3. 생성된 파일을 여기에 등록합니다.
 *
 *    import { ROUND_68_ADVANCED } from "./round-68-advanced";
 *    export const MOCK_EXAMS: MockExam[] = [ROUND_68_ADVANCED];
 *
 * 4. 각 문항의 eventIds에 관련 개념 id를 넣으면, 틀렸을 때 그 개념이
 *    오답노트와 망각곡선 복습 큐에 자동으로 들어갑니다.
 */
export const MOCK_EXAMS: MockExam[] = [];

export function getMockExam(id: string): MockExam | undefined {
  return MOCK_EXAMS.find((e) => e.id === id);
}

/** 만점 (배점 합계) */
export function totalPoints(exam: MockExam): number {
  return exam.questions.reduce((s, q) => s + q.points, 0);
}
