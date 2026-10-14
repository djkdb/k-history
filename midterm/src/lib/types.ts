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


/** 그림의 색 — 화면 테마(밝게·어둡게)에 맞춰 globals.css 의 --t-* 로 칠한다 */
export type Tone = "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet" | "zinc";

/** 다이어그램의 상자 하나. x, y 는 상자의 가운데 (그림 좌표, px 단위) */
export interface FigNode {
  id: string;
  /** 이름. 줄바꿈은 \n */
  label: string;
  /** 이름 아래 작고 옅게 붙는 풀이 (줄바꿈은 \n) */
  sub?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone?: Tone;
  shape?: "box" | "pill" | "circle" | "diamond" | "db" | "text" | "dashed";
}

export interface FigEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** 양쪽 화살표 */
  both?: boolean;
  /** 화살표 없이 선만 */
  plain?: boolean;
  /** 휘는 정도 (px, 부호로 방향) */
  bend?: number;
  /** 꺾은 선 — hv: 가로로 나가 세로로 들어감, vh: 세로로 나가 가로로 들어감, vhv: 나무 모양(아래-가로-아래) */
  route?: "hv" | "vh" | "vhv";
  /** 반듯한 선을 나란히 밀기 (px) — 세로선은 오른쪽(+), 가로선은 아래(+)로 */
  offset?: number;
  tone?: Tone;
}

/**
 * 그림 — 글로 읽던 것을 눈으로 보게 한다 (Mayer: 말과 그림을 가까이, 핵심을 신호로).
 * 개념 요약 바로 아래에 붙는다.
 */
export type Figure =
  | { kind: "graph"; title: string; caption?: string; w: number; h: number; nodes: FigNode[]; edges?: FigEdge[] }
  | {
      kind: "grid";
      title: string;
      caption?: string;
      cols?: string[];
      rows?: string[];
      cells: string[][];
      /** 칠할 칸 (r, c 는 cells 기준 0부터) */
      marks?: { r: number; c: number; tone?: Tone }[];
      mono?: boolean;
    }
  | { kind: "bars"; title: string; caption?: string; unit?: string; items: { label: string; value: number; tone?: Tone; text?: string }[] }
  | {
      kind: "gantt";
      title: string;
      caption?: string;
      end: number;
      ticks?: number[];
      rows: { label: string; segs: { from: number; to: number; label?: string; tone?: Tone }[] }[];
    }
  | {
      kind: "fields";
      title: string;
      caption?: string;
      rows: { label?: string; fields: { text: string; sub?: string; span: number; tone?: Tone }[] }[];
    }
  | {
      kind: "plot";
      title: string;
      caption?: string;
      /** 축 이름 */
      x?: string;
      y?: string;
      xr: [number, number];
      yr: [number, number];
      h?: number;
      xticks?: number[];
      yticks?: number[];
      series: {
        label?: string;
        tone?: Tone;
        pts: [number, number][];
        dashed?: boolean;
        /** 점으로 찍기 (산점도) */
        dots?: boolean;
        /** 점과 선을 함께 */
        line?: boolean;
      }[];
      notes?: { x: number; y: number; text: string; tone?: Tone; anchor?: "start" | "middle" | "end" }[];
      vlines?: { x: number; label?: string; tone?: Tone }[];
    }
  | {
      kind: "stack";
      title: string;
      caption?: string;
      layers: { label: string; note?: string; tone?: Tone }[];
      shape?: "pyramid" | "box";
      /** 위·아래 끝에 붙는 설명 (예: 빠름 · 비쌈 / 느림 · 쌈) */
      top?: string;
      bottom?: string;
    };

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
  /** 쉽게 말하면 — 일상의 비유로 먼저 감을 잡게 (선택) */
  easy?: string;
  /** 흐름·순서 — 단계마다 한 줄, 화살표로 이어 그린다 (선택) */
  flow?: string[];
  /** 시험엔 이렇게 — 이 개념이 문제로 나오는 모양 (선택) */
  exam?: string;
  /** 그림 — 요약 바로 아래에 그린다 (선택) */
  figures?: Figure[];
  /** 이 개념이 나온 강의 PDF와 쪽 범위 */
  sources?: PdfRef[];
}

/** 강의 PDF의 쪽 범위 — PDF 뷰어의 쪽 번호 그대로 (표지 = 1쪽) */
export interface PdfRef {
  file: string;
  from: number;
  to: number;
}

/**
 * 강의 노트 — 교안을 슬라이드 순서대로 빠짐없이 옮긴 것.
 * 개념 카드가 '골라 외울 것'이라면 이쪽은 '교안 전체'다.
 * lines 의 각 줄은 RichText. "· " 로 시작하면 한 단계 들여 쓴다.
 */
export interface NoteSection {
  title: string;
  en?: string;
  lines: string[];
  table?: { title: string; headers: string[]; rows: string[][] };
  code?: string;
  figures?: Figure[];
}

/**
 * 문제 출처 — 강의 자료의 Quiz 슬라이드를 원문 그대로 옮긴 문항에만 붙는다.
 * 없으면 강의 내용으로 만든 문제(추가 문제)다.
 */
export interface QSource {
  src?: "pdf";
  /** 원문 쪽 번호 */
  page?: number;
  /** 원문 문항 자체가 애매한 점 — 풀고 나면 보인다 */
  issue?: string;
}

/** 객관식 — 보기 중 하나 */
export interface McQuestion extends QSource {
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
export interface OxQuestion extends QSource {
  kind: "ox";
  id: string;
  concept: string;
  q: string;
  answer: boolean;
  explain: string;
  code?: string;
}

/** 짧게 적기 — 받아 줄 답을 여럿 둔다 (대소문자·띄어쓰기는 보지 않는다) */
export interface ShortQuestion extends QSource {
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

/**
 * 서술·계산 — 정답을 보고 스스로 채점한다 (풀이 과정이 답이라 글자 비교로 채점할 수 없다).
 * 모의고사에는 넣지 않는다.
 */
export interface OpenQuestion extends QSource {
  kind: "open";
  id: string;
  concept: string;
  q: string;
  /** 모범 답안 */
  answer: string;
  explain: string;
  code?: string;
}

export type Question = McQuestion | OxQuestion | ShortQuestion | OpenQuestion;

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
  /** 장 id → 강의 노트 (교안 전체) */
  notes?: Record<string, NoteSection[]>;
  /** 받은 강의 PDF 이름 — 강의 순서대로 (PDF별 요약에 쓴다) */
  pdfs?: string[];
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
  /** 마지막에 답할 때 얼마나 자신 있었나 (모의고사·예전 기록에는 없다) */
  conf?: Conf;
  /** 마지막으로 틀렸을 때 고른 답 — 오답 노트에 "내가 쓴 답" 으로 보인다 */
  said?: string;
}

/** 답하기 전 자신감 — 확신 / 반반 / 찍음 */
export type Conf = "sure" | "half" | "guess";

/**
 * 확신했는데 틀린 문제.
 * 확신 오답은 해설을 보면 잘 고쳐지지만(과잉교정 효과) 며칠 지나면 옛 답이
 * 되살아나기 쉽다. 그래서 한 번 맞혔다고 빼지 않고, 서로 다른 날 두 번
 * 맞혀야 뺀다.
 */
export interface SureMiss {
  /** 확신하고 틀린 때 */
  at: number;
  /** 그 뒤로 맞힌 날 (YYYY-MM-DD) — 서로 다른 날 두 번이면 졸업 */
  okDays: string[];
}

/** 자신감별 정답 기록 — 내 확신이 얼마나 믿을 만한지 */
export type Calib = Record<Conf, { n: number; right: number }>;

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
