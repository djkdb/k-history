/**
 * 듣기 목록 만들기 — 듣기 화면과, 새로고침 뒤 작은 재생 막대를 되살릴 때 함께 쓴다.
 * 대본 글이 커서 다른 화면에서는 필요할 때만 불러온다(import()).
 */
import { LISTEN } from "@listen";
import { LISTEN_FULL } from "@listen-full";
import AUDIO from "@listen-audio";
import { COURSE } from "@/lib/course";
import { COURSE_ID, KEY } from "@/lib/course-id";
import { fnv } from "@/lib/fnv";
import type { Track } from "@/lib/listen-player";
import type { ListenScript } from "@/lib/types";

export type ListenMode = "full" | "short";
export const MODE_KEY = `${KEY}:listen-mode`;
export const HAS_FULL = LISTEN_FULL.length > 0;

/** 과목 PDF 목록에 있는 강의만 — 시험 범위에서 뺀 PDF(컴시개 04-4 등)의 대본은 듣기에서도 뺀다 */
const SKIP = new Set(COURSE.skipListen ?? []);
const inScope = (list: ListenScript[]) =>
  (COURSE.pdfs?.length ? list.filter((s) => COURSE.pdfs!.includes(s.pdf)) : list).map((s) =>
    SKIP.size ? { ...s, parts: s.parts.filter((p) => !SKIP.has(p.t)) } : s,
  );
const SHORT = inScope(LISTEN);
const FULL = inScope(LISTEN_FULL);

export function listFor(mode: ListenMode): ListenScript[] {
  return mode === "full" && HAS_FULL ? FULL : SHORT;
}

/** 이 기기에 남긴 판(완전판·요약판) — 없으면 완전판 */
export function savedMode(): ListenMode {
  try {
    const m = localStorage.getItem(MODE_KEY);
    if ((m === "full" && HAS_FULL) || m === "short") return m;
  } catch {
    /* 저장이 막힌 창 */
  }
  return HAS_FULL ? "full" : "short";
}

export function buildQueue(list: ListenScript[]): Track[] {
  const order = COURSE.pdfs ?? [];
  const scripts = [...list].sort((a, b) => order.indexOf(a.pdf) - order.indexOf(b.pdf));
  const q: Track[] = [];
  scripts.forEach((s, pdfIdx) =>
    s.parts.forEach((p, partIdx) => {
      const h = fnv(p.say);
      const dur = (AUDIO as Record<string, number>)[h];
      q.push({ pdfIdx, partIdx, pdfTitle: s.title, title: p.t, text: p.say, src: dur ? `/api/audio/${COURSE_ID}/${h}.mp3` : null, dur: dur ?? null });
    }),
  );
  return q;
}
