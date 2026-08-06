import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** yyyy-mm-dd (로컬 기준) */
export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 시험까지 남은 일수. 오늘이 시험일이면 0, 지났으면 음수 */
export function daysUntil(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** D-Day 표시 문자열 */
export function dDayLabel(dateISO: string): string {
  const n = daysUntil(dateISO);
  if (n === 0) return "D-Day";
  if (n > 0) return `D-${n}`;
  return `D+${-n}`;
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

/** 중요도 → 별 문자열 */
export function importanceStars(n: number): string {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// ─── 출제 중요도 5단계 ──────────────────────────────────────────────
// 한국사능력검정시험 심화 출제 경향 기준.
// examFrequency는 "최근 20회 중 출제된 횟수"를 뜻하고, 등급은 여기서 파생된다.

/** 출제 빈도 → 중요도 등급. 데이터의 importance는 이 규칙으로 산출된 값이다. */
export function gradeFromFrequency(freq: number): 1 | 2 | 3 | 4 | 5 {
  if (freq >= 14) return 5; // 거의 매회
  if (freq >= 10) return 4; // 2회 중 1회꼴
  if (freq >= 7) return 3; // 3회 중 1회꼴
  if (freq >= 3) return 2; // 가끔
  return 1; // 드물게
}

/** 중요도 → 색상 클래스 (빨강=반드시, 주황=매우, 노랑=자주, 초록=알아두기, 회색=참고) */
export function importanceColor(n: number): string {
  if (n >= 5) return "text-red-400";
  if (n === 4) return "text-orange-400";
  if (n === 3) return "text-yellow-400";
  if (n === 2) return "text-emerald-400";
  return "text-zinc-400";
}

export function importanceBg(n: number): string {
  if (n >= 5) return "bg-red-500/15 text-red-300 border-red-500/30";
  if (n === 4) return "bg-orange-500/15 text-orange-300 border-orange-500/30";
  if (n === 3) return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
  if (n === 2) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  return "bg-white/5 text-zinc-400 border-white/10";
}

export function importanceLabel(n: number): string {
  if (n >= 5) return "반드시 암기";
  if (n === 4) return "매우 중요";
  if (n === 3) return "자주 출제";
  if (n === 2) return "알아두기";
  return "참고";
}

/** 퀴즈 유형 한글 라벨 (화면 전체에서 공유) */
export const QUIZ_TYPE_LABELS: Record<import("./types").QuizType, string> = {
  ox: "OX",
  multiple: "객관식",
  order: "순서 배열",
  blank: "빈칸",
  king: "왕 맞추기",
  year: "연도 맞추기",
  event: "사건 판별",
  negative: "옳지 않은 것",
  source: "사료 제시형",
};

/** 출제 빈도(최근 20회 중 N회) → 사람이 읽는 문구 */
export function frequencyLabel(freq: number): string {
  if (freq >= 14) return "거의 매회 출제";
  if (freq >= 10) return "2회 중 1회꼴 출제";
  if (freq >= 7) return "3회 중 1회꼴 출제";
  if (freq >= 3) return "가끔 출제";
  return "드물게 출제";
}

/** 배열 셔플 (불변) */
export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr];
  let random = seed !== undefined ? mulberry32(seed) : Math.random;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** XP → 레벨 (레벨당 100xp씩 증가 요구량) */
export function levelFromXp(xp: number): { level: number; current: number; needed: number } {
  let level = 1;
  let remaining = xp;
  let needed = 100;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = 100 + (level - 1) * 50;
  }
  return { level, current: remaining, needed };
}

export const LEVEL_TITLES = [
  "역사 입문자", // 1
  "사관 견습생", // 2
  "젊은 선비", // 3
  "성균관 유생", // 4
  "암행어사", // 5
  "홍문관 학사", // 6
  "집현전 학자", // 7
  "판서", // 8
  "영의정", // 9
  "역사 레전드", // 10+
];

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

// ─── 한국사능력검정시험 등급 산정 ──────────────────────────────────
// 심화: 1급 80점↑ · 2급 70~79 · 3급 60~69 / 기본: 4급 80점↑ · 5급 70~79 · 6급 60~69

/** 예상 점수(0~100) → 한능검 예상 등급. 60점 미만은 불합격(null) */
export function hnkGrade(
  score: number,
  track: "advanced" | "basic" = "advanced",
): { grade: number; label: string } | null {
  const base = track === "advanced" ? 0 : 3;
  if (score >= 80) return { grade: base + 1, label: `${base + 1}급` };
  if (score >= 70) return { grade: base + 2, label: `${base + 2}급` };
  if (score >= 60) return { grade: base + 3, label: `${base + 3}급` };
  return null;
}
