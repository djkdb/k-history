/**
 * 풀던 시험 이어 하기.
 *
 * 시험 도중에 전화가 오거나 앱이 내려가면 한 시간 동안 푼 것이 통째로
 * 날아간다. 그것만은 막아야 해서, 답을 고를 때마다 여기에 적어 둔다.
 *
 * 학습 기록(sqld-state)과 따로 두는 이유는 성격이 달라서다. 이건 "지금
 * 풀고 있는 중"이라는 임시 상태이고, 제출하면 사라진다. 학습 기록에
 * 섞으면 매 문항마다 본 저장소를 건드리게 된다.
 */
export const PROGRESS_KEY = "sqld:mock-progress";

export interface MockProgress {
  /** 문제 은행을 다시 만들 때 쓰는 값 — 같은 seed면 같은 문제가 나온다 */
  seed: number;
  startedAt: number;
  /** 제한 시간이 끝나는 시각 (남은 시간이 아니라 마감 시각을 적는다) */
  endsAt: number;
  /** 문항 번호 → 고른 보기 번호 */
  answers: Record<number, number>;
  at: number;
}

export function readProgress(): MockProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as MockProgress;
    // 시간이 이미 지난 것은 이어 할 수 없다
    if (!p || typeof p.endsAt !== "number" || p.endsAt <= Date.now()) {
      localStorage.removeItem(PROGRESS_KEY);
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function writeProgress(p: MockProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    // 저장에 실패해도 시험은 계속 볼 수 있어야 한다
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* 무시 */
  }
}
