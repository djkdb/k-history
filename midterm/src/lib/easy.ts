import type { Concept } from "./types";

/** 개념에 덧붙이는 '쉽게 보기' 자료 — 쉽게 말하면 · 흐름 · 시험엔 이렇게 · 예시 */
export type EasyExtra = Pick<Concept, "easy" | "flow" | "exam" | "example" | "code">;

/**
 * 개념 목록에 쉽게 보기 자료를 붙인다.
 * 없는 개념 id 를 적으면 빌드가 멈춘다 — 오타로 조용히 빠지는 일이 없게.
 * example · code 는 개념에 이미 있으면 그 뒤에 이어 붙인다.
 */
export function withEasy(concepts: Concept[], extra: Record<string, EasyExtra>): Concept[] {
  const ids = new Set(concepts.map((c) => c.id));
  for (const k of Object.keys(extra)) if (!ids.has(k)) throw new Error(`쉽게 보기: 없는 개념 id "${k}"`);
  return concepts.map((c) => {
    const x = extra[c.id];
    if (!x) return c;
    const example = c.example && x.example ? `${c.example}\n\n${x.example}` : (x.example ?? c.example);
    const code = c.code && x.code ? `${c.code}\n\n${x.code}` : (x.code ?? c.code);
    return { ...c, ...x, example, code };
  });
}
