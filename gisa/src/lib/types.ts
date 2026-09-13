import type { SubjectId, Track } from "@/data/exam";

export type { SubjectId, Track };

export type Importance = "must" | "high" | "normal";

/** 개념 하나 — 필기와 실기가 같은 개념을 나눠 쓴다 */
export interface Concept {
  /** ⚠️ 배포 뒤에는 바꾸지 않는다. 복습 기록이 이 id 를 가리킨다 */
  id: string;
  subject: SubjectId;
  title: string;
  /** 한 줄로 줄이면 무엇인가 */
  summary: string;
  /** 본문 — 문단 단위 */
  body: string[];
  /** 시험에 어떻게 나오는가 */
  examPoint: string;
  importance: Importance;
  /** 헷갈리는 짝 — 시험은 늘 이 둘을 바꿔 낸다 */
  traps?: { a: string; b: string; how: string }[];
  /** 외울 거리 (약어 풀이·순서 등) */
  keys?: { term: string; mean: string }[];
  /** 실기에서도 나오는 개념인가 — 실기 학습에서 걸러 쓴다 */
  tracks: Track[];
}

/** 필기 문항 — 네 개 중 하나 고르기 */
export interface WrittenQuestion {
  id: string;
  subject: SubjectId;
  /** 어느 개념에서 나왔는가 — 틀리면 그 개념이 복습 큐로 간다 */
  sourceId: string;
  question: string;
  /** 코드·표처럼 그대로 보여 줘야 하는 것 */
  passage?: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  /** 선지마다 "왜 이것이 아닌가". options 와 같은 순서, 정답 자리는 null */
  optionNotes?: (string | null)[];
  importance: Importance;
}

export type PracticalKind =
  /** 용어를 적는다 */
  | "term"
  /** 코드를 읽고 출력을 적는다 */
  | "code"
  /** SQL 을 적는다 */
  | "sql"
  /** 빈칸을 채운다 */
  | "blank";

/** 실기 문항 — 고르는 것이 아니라 적는다 */
export interface PracticalQuestion {
  id: string;
  subject: SubjectId;
  sourceId: string;
  kind: PracticalKind;
  question: string;
  /** 코드·스키마·표 */
  passage?: string;
  /** 언어 — 코드 문항의 표시에 쓴다 */
  lang?: "c" | "java" | "python" | "sql";
  /**
   * 맞는 답들. 첫 번째를 모범 답안으로 보여 준다.
   *
   * 필답형은 표기가 흔들린다. "캡슐화"와 "Encapsulation"과 "캡슐화(Encapsulation)"
   * 가 모두 맞는 답이다. 그래서 하나가 아니라 여러 개를 둔다.
   */
  answers: string[];
  /** 이 문항의 배점 */
  points: number;
  explanation: string;
  importance: Importance;
}

/** 복습 카드 — 네 앱과 같은 에빙하우스 간격을 쓴다 */
export interface ReviewCard {
  sourceId: string;
  addedAt: number;
  lastReviewedAt: number | null;
  stage: number;
  nextDueAt: number;
  lapses: number;
}

export interface Settings {
  /** 지금 준비하는 것이 필기인가 실기인가 */
  track: Track;
  examDate: string | null;
}

export interface Stats {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  studyMinutes: number;
}

export interface QuizResult {
  quizId: string;
  takenAt: number;
  total: number;
  correct: number;
  track: Track;
}

export interface MockAttempt {
  track: Track;
  startedAt: number;
  finishedAt: number;
  score: number;
  passed: boolean;
  bySubject: { subject: SubjectId; correct: number; total: number }[];
  /** 실기는 점수로만 남긴다 */
  earned?: number;
  max?: number;
  fmt?: number;
}
