// ─── 컴퓨터활용능력 핵심 도메인 타입 ─────────────────────────────────
// 이 앱은 한 시험을 네 갈래로 나눠 다룬다.
//   급수(1급·2급) × 시험(필기·실기)
// 급수는 범위의 차이지 다른 시험이 아니다. 2급 범위는 1급에 그대로
// 들어 있어서, 개념마다 "몇 급부터 나오는가"만 적어 두면 두 급수를
// 한 벌의 데이터로 다룰 수 있다.

/**
 * 급수. 숫자가 작을수록 상위다(1급 > 2급).
 * 1급은 2급 범위를 그대로 포함하므로, 각 항목에는 "이것이 나오는 가장
 * 쉬운 급수(minGrade)"만 적어 두면 된다. 판정은 grade <= minGrade.
 */
export type Grade = 1 | 2;

export type ExamKind = "written" | "practical"; // 필기 / 실기

/**
 * 필기 과목.
 *  computer     — 컴퓨터 일반 (1·2급 공통)
 *  spreadsheet  — 스프레드시트 일반 (1·2급 공통, 1급이 더 깊다)
 *  database     — 데이터베이스 일반 (1급만)
 */
export type SubjectId = "computer" | "spreadsheet" | "database";

export interface Subject {
  id: SubjectId;
  name: string;
  short: string;
  /** 이 과목이 나오는 최소 급수 (2 = 2급부터, 1 = 1급에만) */
  minGrade: Grade;
  color: string;
  symbol: string;
  description: string;
}

/** 출제 중요도 1~5 (5 = 거의 매회 출제) */
export type Importance = 1 | 2 | 3 | 4 | 5;

export interface Trap {
  /** 헷갈리는 상대 */
  concept: string;
  /** 무엇이 다른가 — 한 줄로 */
  difference: string;
  /**
   * 둘을 뒤바꾼 "틀린 설명".
   *
   * 실제 시험의 오답 선지는 엉뚱한 소리가 아니라 이렇게 생겼다.
   * 이것이 있어야 '옳지 않은 것 고르기'가 진짜 시험처럼 만들어진다.
   * (없으면 오답이 딴 주제라 읽지 않고도 답이 보인다)
   */
  wrong: string;
}

/**
 * 필기 개념 한 덩어리.
 *
 * 한국사와 달리 컴활은 "외울 사실"보다 "구분해야 할 개념"이 많다.
 * (예: RAM과 ROM, 절대참조와 상대참조, 기본키와 외래키)
 * 그래서 traps를 선택 항목이 아니라 뼈대로 둔다.
 */
export interface Concept {
  id: string;
  subject: SubjectId;
  /** 이 개념이 나오는 최소 급수 */
  minGrade: Grade;
  /** 과목 안의 갈래 (예: "운영체제", "함수", "정규화") */
  topic: string;
  title: string;
  /** 한 줄 정의 — 시험장에서 떠올릴 문장 */
  summary: string;
  /** 자세한 설명 2~4문장 */
  detail: string;
  /** 시험에 어떻게 나오는가 */
  examPoint: string;
  importance: Importance;
  keywords: string[];
  traps: Trap[];
  /** 표로 보여 줄 비교 (있으면 화면에 표가 뜬다) */
  table?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
}

// ─── 실기 ───────────────────────────────────────────────────────────

/**
 * 실기 함수 문제.
 *
 * 실기는 엑셀을 직접 다루는 시험이라 앱에서 그대로 재현할 수 없다.
 * 대신 실기에서 실제로 손이 멈추는 지점 — "이 조건이면 어떤 수식을
 * 써야 하는가" — 만 떼어 내 채점한다.
 */
export interface FormulaTask {
  id: string;
  /** 이 문제가 나오는 최소 급수 */
  minGrade: Grade;
  /** 함수 갈래 (예: "찾기/참조", "통계", "배열수식") */
  topic: string;
  /** 무엇을 구하는가 */
  prompt: string;
  /** 표 형태의 자료 (없을 수 있다) */
  sample?: {
    headers: string[];
    rows: string[][];
  };
  /** 채점 기준이 되는 모범 수식 */
  answer: string;
  /** 같은 뜻으로 인정할 다른 수식들 */
  alternatives?: string[];
  /** 왜 이 수식인가 */
  explanation: string;
  /** 자주 틀리는 지점 */
  trap?: string;
  importance: Importance;
}

/** 단축키 하나 */
export interface Shortcut {
  id: string;
  minGrade: Grade;
  /** 어느 프로그램 (엑셀 / 액세스 / 공통) */
  app: "excel" | "access" | "common";
  topic: string;
  /** 무엇을 하는 키인가 */
  action: string;
  /**
   * 키 조합. 배열은 "이 중 아무거나 맞으면 정답".
   * 표기는 사람이 읽는 형태로 두고, 판정은 keys 필드로 한다.
   */
  display: string;
  /**
   * 실제 판정용. 각 항목은 {ctrl,shift,alt,key} 를 문자열로 적은 것.
   * 예: "ctrl+shift+l", "f2", "ctrl+;"
   */
  keys: string[];
  note?: string;
  importance: Importance;
}

// ─── 퀴즈 ───────────────────────────────────────────────────────────

export type QuizType =
  | "multiple" // 설명 보고 개념 고르기
  | "negative" // 옳지 않은 것
  | "blank" // 빈칸
  | "trap" // 헷갈리는 둘 중 고르기
  | "formula" // 수식 입력
  | "shortcut"; // 단축키 입력

export interface QuizQuestion {
  id: string;
  type: QuizType;
  /** 출처 (개념 id 또는 함수·단축키 id) */
  sourceId: string;
  subject: SubjectId | "practical";
  grade: Grade;
  question: string;
  passage?: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  importance: Importance;
}

/** 풀이 결과 한 건 */
export interface QuizResult {
  questionId: string;
  sourceId: string;
  subject: SubjectId | "practical";
  type: QuizType;
  correct: boolean;
  answeredAt: number;
}

// ─── 복습 (에빙하우스) ──────────────────────────────────────────────

export interface ReviewCard {
  sourceId: string;
  addedAt: number;
  lastReviewedAt: number | null;
  stage: number;
  nextDueAt: number;
  lapses: number;
}

// ─── 사용자 설정·기록 ───────────────────────────────────────────────

export interface Settings {
  /** 지금 준비 중인 급수 */
  grade: Grade;
  /** 지금 준비 중인 시험 */
  kind: ExamKind;
  /** 시험일 (yyyy-mm-dd), 없으면 미정 */
  examDate: string | null;
}

export interface Stats {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  studyMinutes: number;
}

/** 모의고사 응시 기록 */
export interface MockAttempt {
  /** 급수-시험 (예: "2-written", "1-practical") */
  examId: string;
  startedAt: number;
  finishedAt: number;
  /**
   * 문항 번호 → 고른 보기 번호.
   * 실기 모의고사의 수식 문항은 답이 글이라 여기에 담기지 않는다
   * (채점은 제출 시점에 끝나고 점수만 남는다).
   */
  answers: Record<number, number>;
  /**
   * 갈래별 점수.
   * 필기는 과목별로 나뉘고 — 컴활은 한 과목이라도 40점 미만이면 과락이다 —
   * 실기는 수식·단축키로 나뉜다.
   */
  bySubject: {
    subject: SubjectId | "formula" | "shortcut";
    correct: number;
    total: number;
  }[];
  score: number;
  total: number;
}
