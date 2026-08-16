import type { SubjectId } from "@/lib/types";

/**
 * 풀던 퀴즈 이어 하기.
 *
 * 30문항을 반쯤 풀다가 전화가 오거나 다른 탭을 잘못 누르면 그때까지 푼
 * 것이 통째로 날아갔다. 모의고사는 이어 풀 수 있는데 퀴즈만 못 할 이유가
 * 없다.
 *
 * 문제 자체를 저장하지 않고 만들어 낸 값(seed)만 적어 둔다. 같은 seed로
 * 다시 만들면 같은 문제가 같은 순서로 나오기 때문이다. 저장 용량이 훨씬
 * 작고, 무엇보다 학습 기록(sqld-state)을 건드리지 않는다.
 *
 * 채점은 답을 고르는 순간 이미 끝나 기록에 반영된다. 그래서 여기 남는
 * 것은 "어디까지 왔나"일 뿐이고, 이어 하지 않고 버려도 점수는 잃지 않는다.
 */
export const QUIZ_PROGRESS_KEY = "sqld:quiz-progress";

/** 사흘이 지난 것은 이어 하자고 권하지 않는다 — 무엇을 풀던 중이었는지 잊는다 */
const STALE_MS = 3 * 86_400_000;

export interface QuizProgress {
  subject: SubjectId | null;
  count: number;
  /** 같은 seed면 같은 문제가 같은 순서로 만들어진다 */
  seed: number;
  /**
   * 오답 모드로 시작했다면 그때의 개념 목록.
   * 그 사이에 다른 문제를 맞혀 오답 목록이 줄었어도 풀던 시험지는
   * 그대로여야 하므로, 지금 목록을 다시 읽지 않고 이것을 쓴다.
   */
  onlySourceIds: string[] | null;
  /** 문항 번호 → 고른 보기 번호 (아직 안 푼 곳은 null) */
  answers: (number | null)[];
  at: number;
  savedAt: number;
}

export function readQuizProgress(): QuizProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as QuizProgress;
    if (!p || !Array.isArray(p.answers) || typeof p.seed !== "number") {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
      return null;
    }
    if (Date.now() - (p.savedAt ?? 0) > STALE_MS) {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
      return null;
    }
    // 다 푼 것은 이어 할 것이 없다
    if (p.at >= p.answers.length) {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function writeQuizProgress(p: QuizProgress): void {
  try {
    localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(p));
  } catch {
    // 저장에 실패해도 풀이는 계속돼야 한다
  }
}

export function clearQuizProgress(): void {
  try {
    localStorage.removeItem(QUIZ_PROGRESS_KEY);
  } catch {
    /* 무시 */
  }
}
