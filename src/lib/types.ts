// ─── KHLM 핵심 도메인 타입 ───────────────────────────────────────────
// 모든 데이터/엔진/화면이 이 계약을 공유한다. 변경 시 전체 영향 검토 필수.

export type EraId =
  | "prehistoric" // 선사
  | "gojoseon" // 고조선
  | "proto-three" // 여러 나라의 성장
  | "three-kingdoms" // 삼국
  | "gaya" // 가야
  | "north-south" // 남북국
  | "goryeo" // 고려
  | "joseon" // 조선
  | "open-port" // 개항기
  | "daehan-empire" // 대한제국
  | "colonial" // 일제강점기
  | "modern"; // 현대

export interface Era {
  id: EraId;
  name: string;
  period: string; // 표시용 기간 예) "약 70만 년 전 ~ 기원전 2333년"
  color: string; // 시대 전용 대표색 (hex)
  symbol: string; // 시대 전용 이모지 아이콘
  mood: string; // 시대 분위기 한 줄
  description: string; // 시대 소개 2~3문장
  order: number; // 연대순 정렬 인덱스
}

/** 출제 중요도 1~5 (5 = 반드시 암기) */
export type Importance = 1 | 2 | 3 | 4 | 5;

export interface MemoryAids {
  story: string; // 스토리텔링: 인물을 캐릭터처럼, 드라마처럼
  analogy: string; // 현대 비유: 예) 훈민정음 = 스마트폰 출시급 혁신
  mnemonic: string; // 두문자/연상 암기법 (시험용)
  wordplay?: string; // 말장난 암기 (웃긴 것 환영)
  emotion?: string; // 감정 연결: 왜 중요한지, 어떤 심정이었는지
  visual?: string; // 이미지 암기: 상징·색·장면 묘사 (이모지 활용)
}

export interface ComparisonTrap {
  concept: string; // 헷갈리는 상대 개념
  difference: string; // 구분 포인트 한 줄
}

// ─── 인포그래픽 (시각 학습) ─────────────────────────────────────────
// 글만 읽는 암기를 막기 위해, 구조를 가진 정보는 그림으로 보여준다.
// 각 spec은 전용 애니메이션 컴포넌트로 렌더링된다.

/** 연표: 사건이 시간축 위에 순서대로 놓인다 */
export interface TimelineSpec {
  kind: "timeline";
  title: string;
  items: {
    year: string;
    label: string;
    note?: string;
    highlight?: boolean; // 현재 보고 있는 사건
  }[];
}

/** 피라미드: 신분 구조처럼 위계가 있는 계층 */
export interface PyramidSpec {
  kind: "pyramid";
  title: string;
  /** 위(소수·상층)에서 아래(다수·하층) 순서 */
  levels: { label: string; desc?: string }[];
}

/** 조직도: 중앙 정치 기구, 행정 조직 */
export interface OrgChartSpec {
  kind: "orgchart";
  title: string;
  root: string;
  branches: { label: string; children?: string[] }[];
}

/** 비교표: 헷갈리는 두 개념을 나란히 */
export interface CompareSpec {
  kind: "compare";
  title: string;
  left: { title: string; items: string[] };
  right: { title: string; items: string[] };
}

/** 흐름도: 인과관계·전개 과정 */
export interface FlowSpec {
  kind: "flow";
  title: string;
  steps: { label: string; note?: string }[];
}

/** 수치: 카운트업으로 규모를 체감 */
export interface StatSpec {
  kind: "stat";
  title: string;
  items: { label: string; value: number; suffix?: string; note?: string }[];
}

export type Infographic =
  | TimelineSpec
  | PyramidSpec
  | OrgChartSpec
  | CompareSpec
  | FlowSpec
  | StatSpec;

export interface HistoryEvent {
  id: string; // slug 예) "hunminjeongeum"
  era: EraId;
  king?: string; // 왕/집권자 (없으면 생략)
  year: number; // 정렬용 연도, 기원전은 음수
  yearDisplay: string; // 표시용 예) "기원전 108년", "1443년"
  title: string; // 사건/개념명
  summary10s: string; // 10초 요약: 시험장에서 떠올릴 한 문장
  summary30s: string; // 30초 요약: 핵심 맥락 2~3문장
  summary1m: string; // 1분 요약: 배경→전개→결과→의미
  examPoint: string; // 시험 출제 포인트 (무엇이 어떻게 나오는가)
  significance: string; // 역사적 의미
  importance: Importance;
  examFrequency: number; // 누적 출제 횟수 (한능검 기준 근사치)
  mustMemorize: boolean; // 반드시 암기 여부
  keywords: string[]; // 핵심 키워드 3~6개
  memory: MemoryAids;
  traps: ComparisonTrap[]; // 오답 유발 비교 개념들
  /** 전용 인포그래픽. 없으면 데이터에서 자동 생성된 것만 표시된다. */
  infographics?: Infographic[];
  relatedFigures: string[]; // 관련 인물
  relatedHeritage: string[]; // 관련 문화재/유물
  prevEventId?: string; // 흐름 모드: 이전 사건
  nextEventId?: string; // 흐름 모드: 다음 사건
}

// ─── 퀴즈 ───────────────────────────────────────────────────────────

export type QuizType =
  | "ox" // OX
  | "multiple" // 객관식
  | "order" // 순서 배열
  | "blank" // 빈칸
  | "king" // 왕 맞추기
  | "year" // 연도 맞추기 — 더 이상 출제하지 않는다(기록 호환용으로만 남김)
  | "between" // 연표의 (가) 시기에 있었던 일 고르기
  | "event" // 설명 보고 사건 맞추기
  | "negative" // 옳지 않은 것 고르기 (부정형)
  | "source"; // 사료 제시형

/**
 * 난이도.
 *  basic  — 기초 다지기: 익숙한 개념, 오답이 다른 시대라 소거가 쉽다
 *  real   — 실전: 같은 시대에서 오답을 뽑는다. 실제 시험 체감 난이도
 *  hard   — 고난도: 인접 연도 오답, 부정형·사료형, 생소한 개념까지
 */
export type Difficulty = "basic" | "real" | "hard";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  eventId: string; // 출처 이벤트
  era: EraId;
  question: string;
  /** multiple/king/year/event: 보기 배열. ox: ["O","X"]. order: 배열할 항목들 */
  options: string[];
  /** options 기준 정답 인덱스. order 유형은 정답 순서의 인덱스 배열 */
  answerIndex: number | number[];
  explanation: string; // 해설 (오답 이유 포함)
  importance: Importance;
  difficulty: Difficulty;
  /** 사료·발문 등 문제 위에 따로 제시되는 지문 */
  passage?: string;
  /** 이 개념이 실제로 출제된 기출 (있을 때만 표시) */
  pastExams?: PastExamRef[];
}

// ─── 기출 출처 ──────────────────────────────────────────────────────

/** 실제 출제 이력. 회차·문항 번호를 확인할 수 있는 경우에만 채운다. */
export interface PastExamRef {
  round: number; // 회차 (예: 68)
  level: "advanced" | "basic"; // 심화 / 기본
  number: number; // 문항 번호
  date?: string; // 시행일 yyyy-mm-dd
}

/** 출제 빈도 수치의 근거 */
export type FrequencySource =
  | "measured" // 기출 데이터를 집계한 실측값
  | "estimated"; // 출제 경향에 근거한 추정값

// ─── 기출 모의고사 ──────────────────────────────────────────────────
// 실제 시험지를 그대로 푸는 모드. 문항은 이미지(캡처) 또는 텍스트로 담는다.

export interface MockExamQuestion {
  number: number; // 문항 번호 (1~50)
  points: number; // 배점
  /** 문항 캡처 이미지 경로 (public 기준, 예: /exams/68-advanced/q01.png) */
  image?: string;
  /** 이미지가 없을 때 쓰는 텍스트 문항 */
  text?: string;
  options?: string[];
  /**
   * 정답 번호 (1~5).
   * 0은 "정답 없음 — 응시자 전원 정답 처리"를 뜻한다. 실제로 있는 일이다.
   * (63회 42번: 문항이의심사에서 오류로 판정되어 전원 정답 처리)
   * 이 경우 무엇을 골라도, 고르지 않아도 배점을 준다.
   */
  answer: number;
  /** 이 문항이 다루는 개념 id — 오답 시 해당 개념이 복습 큐에 들어간다 */
  eventIds?: string[];
  explanation?: string;
  /**
   * 쪽 이미지형에서 이 문항이 실린 시험지 쪽 번호(1부터).
   * 지금 보고 있는 쪽의 문항만 답안지에 띄우는 데 쓴다.
   */
  page?: number;
}

export interface MockExam {
  id: string; // "68-advanced"
  round: number; // 회차
  level: ExamTrack; // 심화 / 기본
  date?: string; // 시행일 yyyy-mm-dd
  timeLimitMin: number; // 제한 시간 (심화 80분, 기본 70분)
  /** 문항 이미지의 출처 표기 (필수 — 공공저작물 이용 시 출처 명시) */
  attribution: string;
  questions: MockExamQuestion[];
  /**
   * 쪽 단위 시험지 이미지.
   * 문항별로 자를 수 없는 스캔 PDF는 시험지를 넘겨 보며 OMR에 답하는 방식으로 제공한다.
   * 이 값이 있으면 문항 이미지 대신 쪽 뷰어가 뜬다.
   */
  pageImages?: string[];
}

/** 모의고사 응시 기록 */
export interface MockExamAttempt {
  examId: string;
  startedAt: number;
  finishedAt: number;
  /** 문항 번호 → 선택한 번호(1~5), 미응답은 없음 */
  answers: Record<number, number>;
  score: number; // 획득 점수
  total: number; // 만점
}

export interface QuizResult {
  questionId: string;
  eventId: string;
  era: EraId;
  type: QuizType;
  correct: boolean;
  answeredAt: number; // epoch ms
}

// ─── 복습 (에빙하우스 망각곡선) ─────────────────────────────────────

export interface ReviewCard {
  eventId: string;
  addedAt: number; // epoch ms
  lastReviewedAt: number | null;
  stage: number; // REVIEW_INTERVALS 인덱스
  nextDueAt: number; // epoch ms
  lapses: number; // 틀린 횟수
}

// ─── 사용자/시험 설정 ───────────────────────────────────────────────

export type ExamType =
  | "korean-history-test" // 한국사능력검정시험
  | "school" // 학교 시험
  | "civil-service" // 공무원
  | "suneung" // 수능
  | "custom"; // 직접 입력

/** 한능검 응시 유형: 심화(1~3급) / 기본(4~6급) */
export type ExamTrack = "advanced" | "basic";

export interface ExamSettings {
  examType: ExamType;
  examLabel: string; // 표시용 이름
  examDate: string; // ISO yyyy-mm-dd
  track?: ExamTrack; // 한능검 전용: 심화/기본
  /** 응시 회차 (일정표에서 고른 경우). 날짜를 직접 넣었으면 없음 */
  round?: number;
}

export interface StudyStats {
  streak: number; // 연속 학습 일수
  lastStudyDate: string | null; // yyyy-mm-dd
  xp: number;
  totalStudyMinutes: number;
  badges: string[]; // 획득 배지 id
}
