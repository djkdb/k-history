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

/**
 * 저장해 둔 답이 어느 판의 것인가.
 *
 * 답은 "몇 번째 문항에 몇 번을 골랐나"로 적힌다. 시험지를 뽑는 방식이
 * 바뀌면 같은 seed 라도 다른 문항이 그 자리에 오고, 이어 풀 때 엉뚱한
 * 문제에 내 답이 붙어 채점까지 어긋난다. 그래서 판이 바뀌면 풀던 것을
 * 잇지 않는다.
 * (학습 기록과는 다른 저장소다 — 어휘·복습 카드는 그대로 남는다)
 */
export const MOCK_FORMAT = 2;

export interface MockProgress {
  /** 이 답들이 어느 판에서 매겨졌는가 */
  fmt?: number;
  examId: ExamId;
  band: number;
  seed: number;
  answers: Record<number, number>;
  at: number;
  /** 언제 끝나는지 — 남은 시간이 아니라 끝나는 시각을 저장한다.
   *  남은 시간을 저장하면 앱을 닫아 둔 동안 시간이 멈춘다. */
  endsAt: number;
  startedAt: number;
  /**
   * "한 번만 재생"에서 이미 나간 지문들.
   *
   * 화면 안에만 두면 새로고침 한 번에 풀린다. 실제 시험은 음성이 한 번
   * 나가면 되돌릴 수 없고, iOS 는 잠깐 다른 앱을 봐도 화면을 버리므로
   * 뜻하지 않게 다시 듣게 된다. 그래서 답과 같이 적어 둔다.
   * (예전 기록에는 없으므로 없으면 빈 것으로 본다)
   */
  played?: string[];
}

export function readProgress(): MockProgress | null {
  try {
    const raw = localStorage.getItem(MOCK_PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as MockProgress;
    // 시험지를 뽑는 방식이 달라진 판의 답은 이어 쓸 수 없다
    if (p?.fmt !== MOCK_FORMAT) {
      localStorage.removeItem(MOCK_PROGRESS_KEY);
      return null;
    }
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
    localStorage.setItem(
      MOCK_PROGRESS_KEY,
      JSON.stringify({ ...p, fmt: MOCK_FORMAT }),
    );
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
