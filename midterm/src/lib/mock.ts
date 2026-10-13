import { KEY } from "./course-id";
import { COURSE, questionsOfChapter } from "./course";
import type { Response } from "./grade";
import { pickMock } from "./quiz";

/**
 * 풀고 있는 모의고사 한 판.
 *
 * 화면을 새로고침하거나 잠깐 다른 앱에 다녀와도 답안이 사라지지 않게
 * 이 기기에 적어 둔다. 제출하면 기록(store)으로 옮기고 지운다.
 */
export interface MockRun {
  startedAt: number;
  qids: string[];
  responses: Record<string, Response>;
  finished?: boolean;
}

const K = `${KEY}:mock-run`;

export function readMock(): MockRun | null {
  try {
    const raw = localStorage.getItem(K);
    return raw ? (JSON.parse(raw) as MockRun) : null;
  } catch {
    return null;
  }
}

export function writeMock(run: MockRun) {
  try {
    localStorage.setItem(K, JSON.stringify(run));
  } catch {
    /* 못 적어도 이번 화면에서는 이어진다 */
  }
}

export function clearMock() {
  try {
    localStorage.removeItem(K);
  } catch {
    /* 무시 */
  }
}

export function newMock(size: number): MockRun {
  const startedAt = Date.now();
  const qs = pickMock(COURSE.chapters.map((c) => questionsOfChapter(c.id)), size, startedAt % 2147483647);
  const run = { startedAt, qids: qs.map((q) => q.id), responses: {} };
  writeMock(run);
  return run;
}
