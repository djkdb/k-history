import type { ExamTrack } from "@/lib/types";

/**
 * 한국사능력검정시험 회차별 시행 일정.
 *
 * ⚠️ 확인된 것과 예상을 구분합니다.
 *  · confirmed: true  — 시행일이 확인된 회차
 *  · confirmed: false — 회차·시기만 알고 정확한 날짜는 미확인. 그 달 마지막
 *    토요일을 잠정 날짜로 두고 화면에 '예상'으로 표시합니다.
 *
 * 회차와 시행 연도는 기출 문제지에 인쇄된 정보로 확인했습니다
 * (69~72회 2024년도 · 73~76회 2025년도 · 77~78회 2026년도).
 * 최근에는 연 4회(2·5·8·10월경) 시행되고 있습니다.
 *
 * 공식 일정은 국사편찬위원회 공지에서 확인하세요.
 *   https://www.historyexam.go.kr
 *
 * 날짜를 확인하면 date를 고치고 confirmed를 true로 바꾸면 됩니다.
 */
export interface ExamSession {
  round: number;
  /** 시행일 ISO (yyyy-mm-dd) */
  date: string;
  /** 시행일이 확인되었는가 */
  confirmed: boolean;
  /** 이 회차에 시행되는 등급 */
  tracks: ExamTrack[];
}

/** 그 달의 마지막 토요일 (한능검은 통상 토요일 시행) */
function lastSaturday(year: number, month: number): string {
  const d = new Date(year, month, 0); // 그 달 마지막 날
  d.setDate(d.getDate() - ((d.getDay() + 1) % 7));
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 예상 회차 (연 4회 · 2·5·8·10월 시행 패턴) */
function estimated(round: number, year: number, month: number): ExamSession {
  return {
    round,
    date: lastSaturday(year, month),
    confirmed: false,
    tracks: ["advanced", "basic"],
  };
}

export const EXAM_SCHEDULE: ExamSession[] = [
  estimated(79, 2026, 8),
  estimated(80, 2026, 10),
  estimated(81, 2027, 2),
  estimated(82, 2027, 5),
  estimated(83, 2027, 8),
  estimated(84, 2027, 10),
];

/** 오늘 이후에 시행되는 회차만, 가까운 순으로 */
export function upcomingSessions(today = new Date()): ExamSession[] {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return EXAM_SCHEDULE.filter((s) => {
    const [y, m, d] = s.date.split("-").map(Number);
    return new Date(y, m - 1, d).getTime() >= t.getTime();
  }).sort((a, b) => a.date.localeCompare(b.date));
}

/** "2026년 10월 31일 (토)" */
export function formatExamDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(y, m - 1, d).getDay()
  ];
  return `${y}년 ${m}월 ${d}일 (${dow})`;
}

/** "10월 31일" — 목록에서 짧게 */
export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
}
