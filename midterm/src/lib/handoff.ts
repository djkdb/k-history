import { KEY } from "./course-id";
import type { QuizPreset } from "@/components/gate";

const K = `${KEY}:quiz-preset`;

export function setQuizPreset(p: QuizPreset) {
  try {
    sessionStorage.setItem(K, JSON.stringify(p));
  } catch {
    /* 못 맡기면 기본 조건으로 연다 */
  }
}

export function takeQuizPreset(): QuizPreset | null {
  try {
    const raw = sessionStorage.getItem(K);
    if (!raw) return null;
    sessionStorage.removeItem(K);
    return JSON.parse(raw) as QuizPreset;
  } catch {
    return null;
  }
}
