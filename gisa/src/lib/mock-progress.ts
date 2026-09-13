/**
 * 모의고사 진행 기록.
 *
 * 150분짜리 시험을 보는 동안 화면을 잠그거나 다른 앱을 켰다가 돌아오면
 * 브라우저가 탭을 통째로 버리는 일이 흔하다. 그때 답안이 사라지면
 * 두 시간이 날아간다. 그래서 답을 적을 때마다 남겨 둔다.
 *
 * ⚠️ 키는 바꾸지 않는다. 바꾸는 순간 시험 도중이던 사람의 답안을 못 찾는다.
 */
const WRITTEN_KEY = "gisa:mock-written";
const PRACTICAL_KEY = "gisa:mock-practical";

export interface WrittenProgress {
  seed: number;
  startedAt: number;
  endsAt: number;
  at: number;
  answers: Record<number, number>;
  flagged: number[];
}

export interface PracticalProgress {
  seed: number;
  startedAt: number;
  endsAt: number;
  at: number;
  inputs: Record<number, string>;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간이 막혀도 시험은 계속 볼 수 있어야 한다
  }
}

function clear(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 지우지 못해도 다음 시작에서 씨앗이 달라 무시된다
  }
}

export const readWritten = () => read<WrittenProgress>(WRITTEN_KEY);
export const writeWritten = (p: WrittenProgress) => write(WRITTEN_KEY, p);
export const clearWritten = () => clear(WRITTEN_KEY);

export const readPractical = () => read<PracticalProgress>(PRACTICAL_KEY);
export const writePractical = (p: PracticalProgress) => write(PRACTICAL_KEY, p);
export const clearPractical = () => clear(PRACTICAL_KEY);
