/**
 * 과목 하나를 이루는 자료의 모양.
 *
 * 다섯 과목이 모두 이 모양을 따른다. 엔진은 과목을 모른다 — 장(章)과 개념과
 * 문제만 안다. 그래서 과목을 하나 더 넣어도 화면 코드는 그대로다.
 *
 * ⚠️ id 는 저장된 기록(공부한 개념·복습 카드·틀린 문제)이 붙드는 열쇠다.
 *    한 번 내보낸 뒤에는 바꾸지 말 것. 글은 고쳐도 된다.
 */

/** 중요도 — 강의에서 얼마나 힘주어 다뤘는가 */
export type Importance = "must" | "high" | "normal";

export interface Chapter {
  id: string;
  /** 화면에 쓰는 이름 */
  title: string;
  /** 영어 원제 (영어로 시험을 보는 과목에서 용어를 맞추기 위해) */
  en?: string;
  /** 어느 강의 자료에서 왔는가 — "Lecture 3. RDB" 등 */
  source: string;
  /** 한 줄 소개 */
  blurb: string;
}

export interface Concept {
  id: string;
  chapter: string;
  title: string;
  /** 영어 용어 — 시험지가 영어일 때 이 말로 나온다 */
  en?: string;
  importance: Importance;
  /** 두세 문장 요약. `코드` 와 **강조** 를 쓸 수 있다 */
  summary: string;
  /** 외울 것 — 한 줄씩 */
  points: string[];
  /** 예시 (선택) */
  example?: string;
  /** 비교 표 (선택) */
  table?: { title: string; headers: string[]; rows: string[][] };
  /** 시험에서 자주 헷갈리는 곳 (선택) */
  trap?: string;
  /** 코드·SQL 블록 (선택) */
  code?: string;
}

/** 객관식 — 보기 중 하나 */
export interface McQuestion {
  kind: "mc";
  id: string;
  concept: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
  /** 문제에 딸린 코드·표 (선택) */
  code?: string;
}

/** 맞다/틀리다 */
export interface OxQuestion {
  kind: "ox";
  id: string;
  concept: string;
  q: string;
  answer: boolean;
  explain: string;
  code?: string;
}

/** 짧게 적기 — 받아 줄 답을 여럿 둔다 (대소문자·띄어쓰기는 보지 않는다) */
export interface ShortQuestion {
  kind: "short";
  id: string;
  concept: string;
  q: string;
  answers: string[];
  explain: string;
  code?: string;
  /** 적는 칸 안내 (예: "숫자만") */
  hint?: string;
}

export type Question = McQuestion | OxQuestion | ShortQuestion;

export interface Course {
  id: string;
  /** "데이터베이스시스템" */
  name: string;
  /** 짧은 이름 — 탭·아이콘 아래 */
  short: string;
  /** 학수번호 "5118026-02" */
  code: string;
  professor?: string;
  /** 강의 자료에 적힌 중간고사 날짜. 없으면 사용자가 정한다 (지어내지 않는다) */
  examDate?: string;
  /** 시험 날짜를 어디서 알았는가 — 화면에 그대로 밝힌다 */
  examNote?: string;
  /** 시험 범위 안인데 받은 자료가 없는 부분 — 화면에 알린다 */
  missing?: string[];
  /** 영어 시험이면 영어 용어를 앞에 둔다 */
  englishExam?: boolean;
  color: string;
  symbol: string;
  chapters: Chapter[];
  concepts: Concept[];
  questions: Question[];
}

/* ── 기록 ─────────────────────────────────────────────── */

export interface ReviewCard {
  /** 개념 id */
  sourceId: string;
  addedAt: number;
  lastReviewedAt: number | null;
  stage: number;
  nextDueAt: number;
  lapses: number;
}

/** 문제마다 맞히고 틀린 횟수 */
export interface QuestionLog {
  right: number;
  wrong: number;
  last: number;
  /** 마지막에 맞혔는가 */
  lastRight: boolean;
}

export interface MockAttempt {
  startedAt: number;
  finishedAt: number;
  qids: string[];
  /** 문제 id → 맞혔는가 */
  results: Record<string, boolean>;
  correct: number;
  total: number;
}

export interface Settings {
  examDate: string | null;
}

export interface Stats {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  studyMinutes: number;
}
