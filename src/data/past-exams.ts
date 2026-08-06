import type { PastExamRef } from "@/lib/types";

/**
 * 실제 기출 출제 이력.
 *
 * ⚠️ 현재 비어 있습니다. 이 프로젝트는 회차·문항 번호를 **확인 없이 채우지 않습니다.**
 * 잘못된 출처는 없는 것보다 나쁘기 때문입니다.
 *
 * ─── 채우는 방법 ───────────────────────────────────────────────────
 * 1. 국사편찬위원회 한국사능력검정시험 자료실에서 회차별 문제지·정답표를 내려받습니다.
 *    https://www.historyexam.go.kr → 자료실 → 기출문제 (로그인 불필요, 무료)
 *    공공데이터포털에도 문답지 데이터셋이 공개되어 있습니다.
 *    https://www.data.go.kr/data/15119618/fileData.do
 *
 * 2. 각 문항이 다루는 개념을 이 파일의 이벤트 id에 대응시켜 아래 형식으로 추가합니다.
 *
 *    "sejong": [
 *      { round: 68, level: "advanced", number: 18 },
 *      { round: 70, level: "advanced", number: 21 },
 *    ],
 *
 * 3. 항목을 넣으면 그 개념의 출제 빈도는 자동으로 **실측값**으로 바뀌고
 *    (`frequencyOf()` 참고) 개념 상세에 "68회 심화 18번" 배지가 표시됩니다.
 *    비어 있는 개념은 기존 추정값을 쓰며 UI에 '추정'으로 표시됩니다.
 *
 * 이벤트 id 목록은 src/data/events/*.ts 에서 확인할 수 있습니다.
 */
export const PAST_EXAMS: Record<string, PastExamRef[]> = {};

/** 실측 집계에 사용한 회차 수. 기출을 채울 때 함께 갱신하세요. */
export const MEASURED_ROUNDS = 0;

/** 추정값의 기준 회차 수 (examFrequency가 "최근 N회 중 몇 회"인지) */
export const ESTIMATE_BASE_ROUNDS = 20;
