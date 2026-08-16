import type { Chapter, Subject, SubjectId } from "@/lib/types";

/**
 * 시험 구성.
 *
 * 한국데이터산업진흥원이 시행하는 SQL 개발자(SQLD) 자격 시험이다.
 * 객관식 50문항을 90분에 풀고, 문항당 2점으로 100점 만점이다.
 *
 *   합격  — 총점 60점 이상
 *   과락  — 과목별 40% 미만이면 총점과 무관하게 불합격
 *           1과목 10문항 중 4문항 미만(=3문항 이하)
 *           2과목 40문항 중 16문항 미만(=15문항 이하)
 *
 * 2과목이 40문항으로 배점의 80%를 차지한다. 1과목을 아무리 잘 봐도
 * 2과목에서 무너지면 그대로 끝이라, 공부 시간을 여기에 맞춰 나눠야 한다.
 */
export const SUBJECTS: Subject[] = [
  {
    id: "modeling",
    name: "데이터 모델링의 이해",
    short: "모델링",
    count: 10,
    points: 20,
    color: "#6366f1",
    symbol: "🧩",
    description:
      "표를 어떻게 나누고 이을 것인가. 엔터티·속성·관계·식별자에서 시작해 정규화와 성능까지 이어진다.",
    trap:
      "용어를 말로만 외우면 다 맞는 말처럼 들린다. 식별자·비식별자, 정규화 단계처럼 '무엇이 어떻게 다른가'로 묶어 두어야 선지에서 갈린다.",
  },
  {
    id: "sql",
    name: "SQL 기본 및 활용",
    short: "SQL",
    count: 40,
    points: 80,
    color: "#10b981",
    symbol: "🗄️",
    description:
      "SELECT 부터 조인·서브쿼리·윈도우 함수·계층형 질의, 그리고 DML·TCL·DDL·DCL 까지.",
    trap:
      "결과를 머릿속으로만 그리면 NULL 과 빈 문자열, 조인으로 늘어나는 행 수에서 어긋난다. 헷갈리면 직접 돌려 보는 편이 빠르다.",
  },
];

export const SUBJECT_MAP: Record<SubjectId, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<SubjectId, Subject>;

/** 출제 범위의 '장' */
export const CHAPTERS: Chapter[] = [
  {
    id: "m-basic",
    subject: "modeling",
    name: "데이터 모델링의 이해",
    summary:
      "무엇을 하나의 덩어리로 볼 것인가(엔터티), 그 덩어리가 무엇을 갖는가(속성), 덩어리끼리 어떻게 이어지는가(관계), 무엇으로 한 줄을 가려낼 것인가(식별자).",
  },
  {
    id: "m-sql",
    subject: "modeling",
    name: "데이터 모델과 SQL",
    summary:
      "정규화로 중복을 걷어내고, 조인으로 다시 잇는다. 그 과정에서 생기는 성능 문제와, 일부러 되돌리는 반정규화까지.",
  },
  {
    id: "s-basic",
    subject: "sql",
    name: "SQL 기본",
    summary:
      "SELECT·WHERE·함수·GROUP BY·ORDER BY, 그리고 조인. 여기서 흔들리면 뒤가 전부 흔들린다.",
  },
  {
    id: "s-advanced",
    subject: "sql",
    name: "SQL 활용",
    summary:
      "서브쿼리·집합 연산자·그룹 함수·윈도우 함수·Top N·계층형 질의·PIVOT. 2과목 점수를 가르는 자리다.",
  },
  {
    id: "s-manage",
    subject: "sql",
    name: "관리 구문",
    summary:
      "INSERT·UPDATE·DELETE·MERGE(DML), COMMIT·ROLLBACK·SAVEPOINT(TCL), CREATE·ALTER·DROP·TRUNCATE(DDL), GRANT·REVOKE(DCL).",
  },
];

export const CHAPTER_MAP: Record<string, Chapter> = Object.fromEntries(
  CHAPTERS.map((c) => [c.id, c]),
);

export function chaptersOf(subject: SubjectId): Chapter[] {
  return CHAPTERS.filter((c) => c.subject === subject);
}

/* ─────────────────────── 시험 규칙 ─────────────────────── */

export const EXAM = {
  /** 총 문항 수 */
  questions: 50,
  /** 제한 시간(분) */
  minutes: 90,
  /** 문항당 점수 */
  perQuestion: 2,
  /** 합격 점수 */
  passScore: 60,
  /** 과목별 과락선 (비율) */
  cutRatio: 0.4,
} as const;

/** 그 과목의 과락선 문항 수 — 이 수보다 적게 맞히면 과락이다 */
export function cutoff(subject: SubjectId): number {
  return Math.ceil(SUBJECT_MAP[subject].count * EXAM.cutRatio);
}

export interface Verdict {
  score: number;
  passed: boolean;
  /** 과락이 난 과목들 */
  failedSubjects: SubjectId[];
  reason: string;
}

/**
 * 합격 여부를 가린다.
 *
 * 총점이 60점을 넘어도 한 과목이 40% 미만이면 불합격이다.
 * 결과 화면에서 "몇 점인데 왜 떨어졌지"가 남지 않도록 이유까지 만들어 준다.
 */
export function judge(
  bySubject: { subject: SubjectId; correct: number; total: number }[],
): Verdict {
  const correct = bySubject.reduce((a, b) => a + b.correct, 0);
  const total = bySubject.reduce((a, b) => a + b.total, 0);
  // 실제 시험은 50문항 100점이다. 문항 수가 다르면 100점 만점으로 환산한다.
  const score = total ? Math.round((correct / total) * 100) : 0;

  const failed = bySubject
    .filter((b) => b.total > 0 && b.correct / b.total < EXAM.cutRatio)
    .map((b) => b.subject);

  if (failed.length) {
    const names = failed.map((f) => SUBJECT_MAP[f].short).join("·");
    return {
      score,
      passed: false,
      failedSubjects: failed,
      reason: `과락 — ${names} 과목이 40%에 못 미칩니다. 총점과 상관없이 불합격입니다.`,
    };
  }
  if (score >= EXAM.passScore) {
    return { score, passed: true, failedSubjects: [], reason: "합격선입니다." };
  }
  return {
    score,
    passed: false,
    failedSubjects: [],
    reason: `총점 ${EXAM.passScore}점에 미치지 못했습니다.`,
  };
}

/**
 * 과목 색을 글자로 쓸 때.
 *
 * 인라인 style 로 넣은 색은 테마 규칙이 닿지 못한다(클래스가 없다).
 * 그래서 밝은 화면에서도 읽히도록 CSS 변수로 한 겹 돌려 준다.
 */
export function subjectInk(id: SubjectId | string): string {
  return `var(--sub-${id}, currentColor)`;
}
