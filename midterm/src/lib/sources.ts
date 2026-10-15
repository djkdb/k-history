import type { Concept, PdfRef } from "./types";

/**
 * 개념에 강의 PDF 쪽 범위를 붙인다.
 * 없는 개념 id 를 적으면 빌드가 멈춘다 — 오타로 조용히 빠지는 일이 없게.
 */
export function withSources(concepts: Concept[], src: Record<string, PdfRef[]>): Concept[] {
  const ids = new Set(concepts.map((c) => c.id));
  for (const k of Object.keys(src)) if (!ids.has(k)) throw new Error(`PDF 출처: 없는 개념 id "${k}"`);
  return concepts.map((c) => (src[c.id]?.length ? { ...c, sources: src[c.id] } : c));
}

/** "p.12–15" */
export function pageLabel(r: PdfRef): string {
  return r.from === r.to ? `p.${r.from}` : `p.${r.from}–${r.to}`;
}

/** 쪽 범위의 각 쪽 번호 (요약본의 쪽 칩) */
export function pagesOf(r: PdfRef): number[] {
  return Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from + i);
}

/** 한 PDF에 나오는 개념들 — 그 PDF의 쪽 순서대로 */
export function pdfConcepts(concepts: Concept[], file: string): { c: Concept; ref: PdfRef }[] {
  const out: { c: Concept; ref: PdfRef }[] = [];
  for (const c of concepts) {
    const ref = c.sources?.find((r) => r.file === file);
    if (ref) out.push({ c, ref });
  }
  return out.sort((a, b) => a.ref.from - b.ref.from || a.ref.to - b.ref.to);
}

/** 한글 필기 PDF 주소 — 없으면 null */
export function notesPdfUrl(notes: Record<string, string> | undefined, file: string, base: string): string | null {
  const f = notes?.[file];
  return f ? `${base}/${f}` : null;
}
