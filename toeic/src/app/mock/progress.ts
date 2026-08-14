import type { ExamId } from "@/lib/exam";

/**
 * 시험 중 진행 상황.
 *
 * 학습 기록과 저장소를 따로 둔다 — 시험 도중 상태는 "잃어도 되는 값"이고,
 * 본 저장소에 섞이면 그만큼 잘못될 여지가 생긴다.
 *
 * ⚠️ 이 이름을 바꾸면 시험 보다 앱을 닫은 사람의 진행이 사라진다.
 */
export const MOCK_PROGRESS_KEY = "toeic:mock-progress";

export interface MockProgress {
  examId: ExamId;
  band: number;
  seed: number;
  answers: Record<number, number>;
  at: number;
  /** 언제 끝나는지 — 남은 시간이 아니라 끝나는 시각을 저장한다.
   *  남은 시간을 저장하면 앱을 닫아 둔 동안 시간이 멈춘다. */
  endsAt: number;
  startedAt: number;
}

export function readProgress(): MockProgress | null {
  try {
    const raw = localStorage.getItem(MOCK_PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as MockProgress;
    if (!p || typeof p.seed !== "number" || !p.examId) return null;
    // 이미 시간이 다 된 것은 이어서 볼 수 없다
    if (p.endsAt <= Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

export function writeProgress(p: MockProgress): void {
  try {
    localStorage.setItem(MOCK_PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* 용량 초과는 무시한다 — 시험은 계속 볼 수 있어야 한다 */
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(MOCK_PROGRESS_KEY);
  } catch {
    /* 무시 */
  }
}
