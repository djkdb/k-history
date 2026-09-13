/**
 * 정보처리기사 시험 구성.
 *
 * 필기 — 다섯 과목, 과목마다 20문항, 모두 100문항 150분.
 *        과목마다 40점 이상이어야 하고, 다섯 과목 평균이 60점 이상이어야
 *        합격이다. 한 과목이라도 40점에 못 미치면 평균이 아무리 높아도
 *        떨어진다(과락).
 * 실기 — 필답형. 고르는 것이 아니라 답을 적는다. 150분 100점 만점에
 *        60점 이상이면 합격이다. 과락은 없다.
 *
 * ⚠️ 이 앱의 문항은 공개된 출제 범위에 맞춰 새로 쓴 것이다. 한국산업인력
 *    공단은 정보처리기사 기출문제를 공개하지 않는다. 시중 복원본을 옮기는
 *    것은 저작권 문제가 있어 쓰지 않았다.
 *
 * 2026년 기준. 2026년 개편으로 5과목 100문항이 된 것은 정보처리"산업기사"
 * 이고, 정보처리기사는 이 구성이 그대로다. 출제기준은 적용기간이 있으므로
 * 시험 전에 큐넷에서 지금 적용되는 것을 한 번 확인하는 편이 안전하다 —
 * 화면에도 그렇게 적어 두었다.
 */

export type Track = "written" | "practical";

export type SubjectId =
  | "design"
  | "develop"
  | "database"
  | "language"
  | "system";

export interface Subject {
  id: SubjectId;
  /** 시험지에 적히는 이름 */
  name: string;
  /** 좁은 화면에서 쓰는 짧은 이름 */
  short: string;
  symbol: string;
  /** 과목 색 — 배지·막대에 쓴다 */
  color: string;
  /** 필기 한 회에 나오는 문항 수 */
  count: number;
  /** 이 과목이 무엇을 묻는가 */
  blurb: string;
}

export const SUBJECTS: Subject[] = [
  {
    id: "design",
    name: "소프트웨어 설계",
    short: "설계",
    symbol: "📐",
    color: "#818cf8",
    count: 20,
    blurb:
      "요구사항을 어떻게 모으고 그림으로 옮기는가. UML·객체지향·디자인 패턴이 여기서 나온다.",
  },
  {
    id: "develop",
    name: "소프트웨어 개발",
    short: "개발",
    symbol: "🔧",
    color: "#34d399",
    count: 20,
    blurb:
      "만든 것을 어떻게 다루는가. 자료구조·정렬·테스트·형상관리처럼 손에 닿는 것들이다.",
  },
  {
    id: "database",
    name: "데이터베이스 구축",
    short: "DB",
    symbol: "🗄️",
    color: "#fbbf24",
    count: 20,
    blurb: "정규화·SQL·트랜잭션. 실기에서도 그대로 나오므로 두 번 쓰인다.",
  },
  {
    id: "language",
    name: "프로그래밍 언어 활용",
    short: "언어",
    symbol: "💻",
    color: "#60a5fa",
    count: 20,
    blurb:
      "C·Java·Python 코드를 읽고 결과를 맞힌다. 운영체제와 네트워크도 이 과목이다.",
  },
  {
    id: "system",
    name: "정보시스템 구축 관리",
    short: "구축관리",
    symbol: "🛡️",
    color: "#f472b6",
    count: 20,
    blurb:
      "개발 방법론·보안·신기술 용어. 회차마다 난이도가 제일 많이 출렁이는 과목이다.",
  },
];

export const SUBJECT_MAP: Record<SubjectId, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<SubjectId, Subject>;

/** 필기 — 과목마다 40점 미만이면 과락 */
export const WRITTEN = {
  totalQuestions: 100,
  minutes: 150,
  /** 합격에 필요한 평균 점수 */
  passScore: 60,
  /** 과목마다 이 비율에 못 미치면 과락 */
  cutRatio: 0.4,
} as const;

/** 실기 — 필답형, 과락 없음 */
export const PRACTICAL = {
  minutes: 150,
  passScore: 60,
} as const;

/** 그 과목에서 몇 문항을 맞혀야 과락을 면하는가 */
export function cutoff(subject: SubjectId): number {
  return Math.ceil(SUBJECT_MAP[subject].count * WRITTEN.cutRatio);
}

export interface Verdict {
  score: number;
  passed: boolean;
  failedSubjects: SubjectId[];
  reason: string;
}

/**
 * 필기 합격 여부를 가린다.
 *
 * 평균이 60점을 넘어도 한 과목이 40점에 못 미치면 불합격이다.
 * 결과 화면에서 "몇 점인데 왜 떨어졌지"가 남지 않도록 이유까지 만들어 준다.
 */
export function judgeWritten(
  bySubject: { subject: SubjectId; correct: number; total: number }[],
): Verdict {
  const correct = bySubject.reduce((a, b) => a + b.correct, 0);
  const total = bySubject.reduce((a, b) => a + b.total, 0);
  // 과목마다 20문항 100점 만점이라 전체 정답률이 곧 평균 점수다
  const score = total ? Math.round((correct / total) * 100) : 0;

  const failed = bySubject
    .filter((b) => b.total > 0 && b.correct / b.total < WRITTEN.cutRatio)
    .map((b) => b.subject);

  if (failed.length) {
    const names = failed.map((f) => SUBJECT_MAP[f].short).join("·");
    return {
      score,
      passed: false,
      failedSubjects: failed,
      reason: `과락 — ${names}이(가) 40점에 못 미칩니다`,
    };
  }
  if (score < WRITTEN.passScore) {
    return {
      score,
      passed: false,
      failedSubjects: [],
      reason: `평균 ${WRITTEN.passScore}점에 ${WRITTEN.passScore - score}점 모자랍니다`,
    };
  }
  return { score, passed: true, failedSubjects: [], reason: "합격입니다" };
}

/** 실기 합격 여부 — 얻은 점수와 만점으로 가린다 */
export function judgePractical(earned: number, max: number): Verdict {
  const score = max ? Math.round((earned / max) * 100) : 0;
  return {
    score,
    passed: score >= PRACTICAL.passScore,
    failedSubjects: [],
    reason:
      score >= PRACTICAL.passScore
        ? "합격입니다"
        : `${PRACTICAL.passScore}점에 ${PRACTICAL.passScore - score}점 모자랍니다`,
  };
}

/**
 * 과목 색을 글자에 쓸 때는 CSS 변수로 한 겹 돌린다.
 *
 * 인라인 style 로 넣은 색은 테마 규칙이 닿지 못한다(클래스가 없다).
 * 그래서 밝은 화면에서도 읽히도록 변수를 거쳐 준다.
 */
export function subjectInk(id: SubjectId | string): string {
  return `var(--sub-${id}, currentColor)`;
}
