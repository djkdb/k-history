/**
 * TOEIC 앱의 자료 모양.
 *
 * ⚠️ id 는 사용자의 학습 기록이 가리키는 열쇠다. 한 번 내보낸 id 를 바꾸면
 *    그 사람이 외운 단어·풀어 둔 문항 기록이 허공을 가리킨다.
 *    scripts/audit.ts 가 src/data/locked-ids.ts 와 대조해 감시한다.
 */

/** 시험은 듣기 100문항 + 읽기 100문항, 각 495점 만점이다 */
export type Section = "listening" | "reading";

/** Part 1~7. 번호가 곧 시험지의 파트 번호다. */
export type PartId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * 목표 점수대.
 *
 * 문항과 어휘마다 "이 점수대부터 필요한 것"을 달아 둔다. 600을 목표로 하는
 * 사람에게 900점대 어휘를 섞어 내면 시간만 버린다.
 */
export type Band = 600 | 700 | 800 | 900;

export const BANDS: Band[] = [600, 700, 800, 900];

export interface Part {
  id: PartId;
  section: Section;
  name: string;
  /** 실제 시험의 문항 수 */
  count: number;
  /** 선택지 개수 — Part 2 만 3지선다다 */
  choices: 3 | 4;
  summary: string;
  /** 이 파트에서 점수를 잃는 전형적인 이유 */
  trap: string;
}

/* ─────────────────────────── 어휘 ─────────────────────────── */

export interface Vocab {
  id: string;
  word: string;
  /** 품사 — 파트 5 는 품사 자리를 묻는 문제가 가장 많다 */
  pos: "n." | "v." | "adj." | "adv." | "prep." | "conj.";
  meaning: string;
  band: Band;
  /** 이 단어가 주로 나오는 자리 */
  topic: VocabTopic;
  /** 시험에 나오는 그대로의 문장 — 단어만 외우면 자리에서 못 알아본다 */
  example: string;
  exampleKo: string;
  /**
   * 같이 붙어 다니는 말. TOEIC 은 연어(collocation)를 그대로 묻는 일이 잦다.
   * 예: "meet" 은 "meet a deadline" 으로 나온다.
   */
  collocations?: string[];
  /** 헷갈리는 짝 — 시험은 바로 이 짝을 나란히 놓고 고르게 한다 */
  confusable?: {
    word: string;
    meaning: string;
    /** 어떻게 갈리는지 */
    difference: string;
  };
}

export type VocabTopic =
  | "office"       // 사내 업무·일정
  | "hr"           // 인사·채용
  | "finance"      // 회계·비용
  | "marketing"    // 홍보·판매
  | "contract"     // 계약·법무
  | "logistics"    // 주문·배송·재고
  | "facility"     // 시설·공사·유지보수
  | "travel"       // 출장·교통·숙박
  | "manufacturing"// 생산·품질
  | "general";     // 어디에나

/* ─────────────────────── 문법 (Part 5·6) ─────────────────────── */

export interface GrammarPoint {
  id: string;
  title: string;
  band: Band;
  category: GrammarCategory;
  /** 한 줄로 줄인 핵심 */
  summary: string;
  /** 왜 그런지 — 규칙만 외우면 변형된 문제에서 무너진다 */
  detail: string;
  /** 시험지에서 이 문법이 어떤 모습으로 나오는지 */
  examShape: string;
  /** 빈칸 앞뒤만 보고 답을 고르는 요령 */
  shortcut?: string;
  /** 출제자가 파 놓는 함정 */
  trap?: {
    wrong: string;
    why: string;
  };
  examples: {
    correct: string;
    incorrect?: string;
    ko: string;
  }[];
}

export type GrammarCategory =
  | "pos"        // 품사 자리
  | "verb"       // 동사 (시제·수일치·태)
  | "pronoun"    // 대명사
  | "prep"       // 전치사
  | "conj"       // 접속사·접속부사
  | "relative"   // 관계사
  | "toinf"      // 부정사·동명사·분사
  | "comparison" // 비교
  | "subjunctive"// 가정법
  | "structure"; // 문장 구조

/* ─────────────────────── 문항 ─────────────────────── */

/** 하나의 선택지 */
export interface Choice {
  /** (A)(B)(C)(D) 자리에 들어갈 글 */
  text: string;
  /** 왜 이것이 답인지 / 왜 아닌지 */
  why: string;
}

/**
 * 읽기 문항 (Part 5·6·7).
 *
 * Part 6·7 은 지문 하나에 문항이 여러 개 붙는다. 그래서 문항이 아니라
 * "지문 묶음"이 자료의 단위다.
 */
export interface ReadingSet {
  id: string;
  part: 5 | 6 | 7;
  band: Band;
  /** Part 7 의 지문 종류 — 시험지에 그대로 적혀 나온다 */
  docType?: DocType;
  /** Part 5 는 지문이 없다 */
  passage?: Passage[];
  questions: ReadingQuestion[];
  /** 이 묶음이 겨냥하는 문법 포인트·어휘 id (복습이 여기로 이어진다) */
  links?: string[];
}

export type DocType =
  | "email"
  | "letter"
  | "memo"
  | "notice"
  | "article"
  | "advertisement"
  | "form"
  | "schedule"
  | "chat"          // 문자 메시지·온라인 채팅 (의도 파악 문제가 붙는다)
  | "review";

export interface Passage {
  docType: DocType;
  /** 시험지에 붙는 머리글 (보낸 사람·제목·날짜 등) */
  header?: { label: string; value: string }[];
  /** 본문. Part 6 는 빈칸을 [[1]] 처럼 표시한다. */
  body: string;
}

export interface ReadingQuestion {
  id: string;
  /** Part 6 의 빈칸 번호 — 본문의 [[n]] 과 맞춘다 */
  blank?: number;
  /** Part 5·6 은 빈칸만 있고 질문 문장이 없다 */
  prompt?: string;
  choices: Choice[];
  answer: number;
  /** 무엇을 묻는 문제인지 — 유형을 알면 푸는 순서가 정해진다 */
  skill: ReadingSkill;
  band: Band;
  /** Part 7 근거 문장 — "본문 어디에 있었는지"를 보여 준다 */
  evidence?: string;
}

export type ReadingSkill =
  | "grammar"      // 문법 자리
  | "vocab"        // 어휘 고르기
  | "sentence"     // 문장 넣기 (Part 6)
  | "gist"         // 주제·목적
  | "detail"       // 세부 사항
  | "inference"    // 추론
  | "intent"       // 화자 의도 (채팅 지문)
  | "vocab-incontext" // 문맥상 의미
  | "crossref";    // 이중·삼중 지문 연계

/* ─────────────────────── 듣기 ─────────────────────── */

/**
 * 듣기 문항.
 *
 * 음성 파일을 싣지 않고 기기의 음성 합성으로 읽힌다. 그래서 자료에는
 * "무엇을 어떤 목소리로 읽을지"가 들어간다.
 */
export interface ListeningSet {
  id: string;
  part: 1 | 2 | 3 | 4;
  band: Band;
  /**
   * Part 1 은 사진을 보고 푸는 문제다. 사진을 실을 수 없어 장면을 글로 준다.
   * 실제 시험과 다른 점이라 화면에도 그대로 밝힌다.
   */
  scene?: string;
  /** Part 3·4 의 대화·담화 */
  script?: Line[];
  /** Part 3·4 지문의 상황 (화면에는 안 보이고 해설에만 쓴다) */
  situation?: string;
  questions: ListeningQuestion[];
  links?: string[];
}

export interface Line {
  /** 화자 — 목소리를 갈라 주는 데 쓴다 */
  speaker: Speaker;
  text: string;
}

/**
 * 실제 시험은 미국·영국·캐나다·호주 네 발음이 섞여 나온다.
 * 기기에 그 목소리가 다 있지는 않아, 있는 것 중 가장 가까운 것을 고른다.
 */
export type Speaker = "man" | "woman" | "man2" | "woman2" | "narrator";

export interface ListeningQuestion {
  id: string;
  /** Part 1·2 는 문제 문장이 없다 (들려주는 것이 전부) */
  prompt?: string;
  /** 들려줄 선택지 — Part 1·2 는 선택지도 귀로만 듣는다 */
  choices: Choice[];
  answer: number;
  /** Part 1·2 는 선택지를 눈으로 보지 않는 것이 실제 시험이다 */
  audioOnlyChoices?: boolean;
  skill: ListeningSkill;
  band: Band;
}

export type ListeningSkill =
  | "photo"        // 사진 묘사
  | "response"     // 질의응답
  | "gist"         // 주제·목적·장소
  | "detail"       // 세부 사항
  | "inference"    // 추론
  | "intent"       // 의도 파악
  | "next"         // 다음에 할 일
  | "graphic";     // 시각 정보 연계

/* ─────────────────────── 학습 기록 ─────────────────────── */

export interface Settings {
  /** 목표 점수대 — 무엇을 낼지 정한다 */
  band: Band;
  examDate: string | null;
  /** 듣기 읽는 속도 (1.0 = 보통). 실제 시험은 1.0 언저리다. */
  speechRate: number;
  /** 듣기에서 스크립트를 처음부터 보여 줄지 */
  showScript: boolean;
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
  sourceId: string;
  correct: boolean;
  at: number;
}

/** 모의고사 한 번의 결과 */
export interface MockAttempt {
  /** "full" | "lc" | "rc" | "part5" … */
  examId: string;
  startedAt: number;
  finishedAt: number;
  answers: Record<number, number>;
  byPart: { part: PartId; correct: number; total: number }[];
  correct: number;
  total: number;
  /** 환산 점수 (LC·RC 각 495, 합 990) */
  scaled: { listening: number; reading: number; total: number };
}
