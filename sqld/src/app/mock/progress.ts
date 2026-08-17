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

/**
 * 저장해 둔 답이 어느 판의 것인가.
 *
 * 답은 "몇 번 보기를 골랐나"로 적힌다. 선지를 섞는 방식이 바뀌면 같은
 * 문제라도 보기 순서가 달라져, 이어 풀 때 엉뚱한 보기가 내 답으로
 * 표시되고 채점까지 어긋난다. 그래서 판이 바뀌면 풀던 것을 잇지 않는다.
 * (학습 기록과는 다른 저장소다 — 진도·복습 카드는 그대로 남는다)
 */
const FORMAT = 2;

export interface MockProgress {
  /** 이 답들이 어느 판에서 매겨졌는가 */
  fmt?: number;
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
    // 보기 순서가 달라진 판의 답은 이어 쓸 수 없다
    if (p?.fmt !== FORMAT) {
      localStorage.removeItem(PROGRESS_KEY);
      return null;
    }
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
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...p, fmt: FORMAT }));
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
