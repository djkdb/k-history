import type { ExamTrack } from "@/lib/types";

/**
 * 한국사능력검정시험 회차별 시행 일정.
 *
 * 공고된 일정만 담습니다. 추정 날짜는 넣지 않습니다 —
 * 틀린 날짜는 D-Day와 학습 계획을 통째로 어긋나게 만들기 때문입니다.
 *
 * 새 회차 일정이 공개되면 EXAM_SCHEDULE에 한 줄 추가하세요.
 * 공식 공지: https://www.historyexam.go.kr
 *
 * confirmed는 앞으로 미확정 일정을 다루게 될 경우를 위해 남겨 둔 필드입니다.
 * false면 화면에 '예상'으로 표시됩니다.
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

const session = (round: number, date: string): ExamSession => ({
  round,
  date,
  confirmed: true,
  tracks: ["advanced", "basic"],
});

/**
 * 공고된 시행 일정.
 * 이후 회차는 일정이 공개되면 아래에 추가하세요 — 추정 날짜는 넣지 않습니다.
 */
export const EXAM_SCHEDULE: ExamSession[] = [
  session(79, "2026-08-09"),
  session(80, "2026-10-17"),
  session(81, "2026-11-28"),
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
