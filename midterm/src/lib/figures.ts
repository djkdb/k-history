import type { Concept, Figure } from "./types";

/**
 * 개념에 그림을 붙인다. 그림은 과목마다 figures.ts 한 파일에 모아 둔다.
 * 없는 개념 id 를 적으면 빌드가 멈춘다 — 오타로 그림이 조용히 사라지지 않게.
 */
export function withFigures(concepts: Concept[], figs: Record<string, Figure[]>): Concept[] {
  const ids = new Set(concepts.map((c) => c.id));
  for (const k of Object.keys(figs)) if (!ids.has(k)) throw new Error(`그림: 없는 개념 id "${k}"`);
  return concepts.map((c) => (figs[c.id] ? { ...c, figures: [...(c.figures ?? []), ...figs[c.id]] } : c));
}
