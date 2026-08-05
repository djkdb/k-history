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
  | "year" // 연도 맞추기
  | "event"; // 설명 보고 사건 맞추기

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
}

export interface StudyStats {
  streak: number; // 연속 학습 일수
  lastStudyDate: string | null; // yyyy-mm-dd
  xp: number;
  totalStudyMinutes: number;
  badges: string[]; // 획득 배지 id
}
