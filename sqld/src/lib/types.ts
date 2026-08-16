/**
 * SQLD 앱의 자료 모양.
 *
 * ⚠️ id 는 사용자의 학습 기록이 가리키는 열쇠다. 한 번 내보낸 id 를 바꾸면
 *    그 사람이 공부한 개념·풀어 둔 문항 기록이 허공을 가리킨다.
 *    scripts/audit.ts 가 src/data/locked-ids.ts 와 대조해 감시한다.
 */

/**
 * 과목.
 *   modeling — 1과목 데이터 모델링의 이해 (10문항 · 20점)
 *   sql      — 2과목 SQL 기본 및 활용   (40문항 · 80점)
 */
export type SubjectId = "modeling" | "sql";

export interface Subject {
  id: SubjectId;
  /** 시험지에 적히는 이름 */
  name: string;
  short: string;
  /** 실제 시험의 문항 수 */
  count: number;
  /** 문항당 2점이므로 배점은 문항 수 × 2 */
  points: number;
  color: string;
  symbol: string;
  description: string;
  /** 이 과목에서 점수를 잃는 전형적인 이유 */
  trap: string;
}

/** 과목 안의 갈래 — 출제 범위의 '장'에 해당한다 */
export interface Chapter {
  id: string;
  subject: SubjectId;
  name: string;
  /** 이 장에서 무엇을 묻는가 */
  summary: string;
}

/** 중요도 1~5 (5 = 거의 매회 출제) */
export type Importance = 1 | 2 | 3 | 4 | 5;

export interface Trap {
  /** 헷갈리는 상대 */
  concept: string;
  /** 무엇이 다른가 — 한 줄로 */
  difference: string;
  /**
   * 둘을 뒤바꾼 "틀린 설명".
   * 실제 시험의 오답 선지는 엉뚱한 소리가 아니라 이렇게 생겼다.
   */
  wrong: string;
}

/**
 * 개념 한 덩어리.
 *
 * SQLD 는 "외울 사실"보다 "구분해야 할 것"이 많다.
 * (식별자와 비식별자, INNER 와 OUTER, HAVING 과 WHERE, DELETE 와 TRUNCATE)
 * 그래서 traps 를 선택 항목이 아니라 뼈대로 둔다.
 */
export interface Concept {
  id: string;
  subject: SubjectId;
  /** 어느 장에 속하는가 (Chapter.id) */
  chapter: string;
  title: string;
  /** 한 줄 정의 — 시험장에서 떠올릴 문장 */
  summary: string;
  /** 자세한 설명 2~5문장 */
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
  /**
   * 곁들일 SQL — 개념을 눈으로 보는 것보다 돌려 보는 편이 빠르다.
   * 화면에서 그대로 실행해 결과를 볼 수 있다.
   */
  sql?: {
    /** 무엇을 보여 주는 코드인가 */
    caption: string;
    query: string;
  };
}

/* ─────────────────────── 문항 ─────────────────────── */

export type QuizType =
  /** 설명을 보고 무엇인지 고르기 */
  | "multiple"
  /** 옳지 않은 것 하나 고르기 */
  | "negative"
  /** 빈칸에 들어갈 말 고르기 */
  | "blank"
  /** 헷갈리는 둘의 차이 고르기 */
  | "trap"
  /** SQL 결과 맞히기 */
  | "sql-result"
  /** SQL 직접 쓰기 */
  | "sql-write";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  /** 출처 (개념 id 또는 실습 id) */
  sourceId: string;
  subject: SubjectId;
  question: string;
  /** 문제에 딸린 지문·코드 */
  passage?: string;
  /** 지문이 SQL 이면 고정폭으로 보여 준다 */
  passageIsSql?: boolean;
  options: string[];
  answerIndex: number;
  explanation: string;
  /**
   * 선지마다 "왜 이것이 아닌가". options 와 같은 순서이며 정답 자리는 null.
   * 틀렸을 때 정작 알고 싶은 것은 내가 고른 것이 왜 아닌지다.
   */
  optionNotes?: (string | null)[];
  importance: Importance;
}

/* ─────────────────────── SQL 실습 ─────────────────────── */

/**
 * 직접 쿼리를 써서 푸는 문제.
 *
 * 눈으로 읽어 아는 것과 손으로 쳐서 맞히는 것은 다르다. 브라우저 안에서
 * 진짜 SQLite 를 돌려 결과를 견주므로, 답이 하나가 아니어도 결과만 같으면
 * 맞는 것으로 본다.
 */
export interface SqlTask {
  id: string;
  /** 어느 갈래인가 (조인·서브쿼리·집계·윈도우 함수 …) */
  topic: SqlTopic;
  /** 무엇을 구하는가 */
  prompt: string;
  /** 쓸 수 있는 표 (스키마 id) */
  schema: string;
  /** 채점 기준이 되는 모범 답안 */
  answer: string;
  /** 왜 이 쿼리인가 */
  explanation: string;
  /** 자주 틀리는 지점 */
  trap?: string;
  importance: Importance;
  /**
   * 순서를 따지는가.
   * ORDER BY 를 요구한 문제만 참이다. 아니면 행 순서가 달라도 맞는 것으로 본다.
   */
  ordered?: boolean;
  /** 이 문제와 이어지는 개념 id */
  links?: string[];
}

export type SqlTopic =
  | "select"      // SELECT · WHERE · 함수
  | "group"       // GROUP BY · HAVING · 집계
  | "join"        // 조인
  | "subquery"    // 서브쿼리
  | "setop"       // 집합 연산자
  | "window"      // 윈도우 함수
  | "hierarchy"   // 계층형 질의
  | "dml";        // DML · DDL · TCL

/* ─────────────────────── 학습 기록 ─────────────────────── */

export interface Settings {
  examDate: string | null;
  /** SQL 실습에서 결과 표를 처음부터 보여 줄지 */
  showSchema: boolean;
}

export interface Stats {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  studyMinutes: number;
}

export interface ReviewCard {
  sourceId: string;
  addedAt: number;
  lastReviewedAt: number | null;
  stage: number;
  nextDueAt: number;
  lapses: number;
}

export interface QuizResult {
  questionId: string;
  sourceId: string;
  subject: SubjectId | "sql-practice";
  type: QuizType;
  correct: boolean;
  answeredAt: number;
}

/** 모의고사 한 번의 결과 */
export interface MockAttempt {
  startedAt: number;
  finishedAt: number;
  answers: Record<number, number>;
  bySubject: { subject: SubjectId; correct: number; total: number }[];
  /** 맞힌 문항 수 */
  correct: number;
  total: number;
  /** 100점 만점 환산 (문항당 2점) */
  score: number;
}
