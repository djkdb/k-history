import type { Subject } from "@/lib/types";

/**
 * 필기 과목.
 *
 * 2급은 컴퓨터 일반 + 스프레드시트 일반 두 과목,
 * 1급은 거기에 데이터베이스 일반이 붙어 세 과목이다.
 * 과목당 20문항이고, 한 과목이라도 40점 미만이면 평균과 무관하게 과락이다.
 */
export const SUBJECTS: Subject[] = [
  {
    id: "computer",
    name: "컴퓨터 일반",
    short: "컴일",
    minGrade: 2,
    color: "#6366f1",
    symbol: "🖥️",
    description:
      "하드웨어·소프트웨어·운영체제·네트워크·정보보안. 범위가 가장 넓고 생소한 용어가 많아 체감 난도가 높다.",
  },
  {
    id: "spreadsheet",
    name: "스프레드시트 일반",
    short: "스프",
    minGrade: 2,
    color: "#10b981",
    symbol: "📊",
    description:
      "엑셀의 기능과 함수. 실기와 그대로 이어지므로 여기서 다진 것이 실기 시간을 줄인다.",
  },
  {
    id: "database",
    name: "데이터베이스 일반",
    short: "디비",
    minGrade: 1,
    color: "#f59e0b",
    symbol: "🗄️",
    description:
      "1급에만 있는 과목. 정규화·키·질의 등 개념 자체가 낯설어 1급의 문턱으로 불린다.",
  },
];

export const SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
);

/**
 * 과목 색을 **글자**로 쓸 때의 값.
 *
 * `color` 는 막대·점처럼 넓게 칠하는 자리에 맞춘 색이라, 그대로 글자에 쓰면
 * 밝은 화면에서 배경과 붙어 안 읽힌다(주황은 흰 바탕에서 2:1 남짓). 화면 밝기에
 * 따라 갈리는 값이라 CSS 변수로 두고 globals.css 가 테마별로 채운다.
 */
export function subjectInk(id: string): string {
  return `var(--sub-${id}, currentColor)`;
}

/**
 * 해당 급수에서 보는 과목만.
 *
 * 급수는 숫자가 작을수록 상위다(1급 > 2급). 1급은 2급 범위를 포함하므로
 * "이 항목이 나오는 가장 쉬운 급수(minGrade)"보다 같거나 상위인 급수에서
 * 모두 보인다 → grade <= minGrade.
 *   컴퓨터 일반(minGrade 2): 2급 ✓(2<=2)  1급 ✓(1<=2)
 *   데이터베이스(minGrade 1): 2급 ✗(2<=1)  1급 ✓(1<=1)
 */
export function subjectsFor(grade: 1 | 2): Subject[] {
  return SUBJECTS.filter((s) => grade <= s.minGrade);
}

/** 급수 범위에 드는가 — 개념·함수·단축키에 두루 쓴다 */
export function inGrade(grade: 1 | 2, minGrade: 1 | 2): boolean {
  return grade <= minGrade;
}
