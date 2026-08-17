import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayISO(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 시험일까지 남은 날 — 지났으면 음수 */
export function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/**
 * 줄글을 문장 단위로 자른다.
 * 마침표 뒤에 공백이 오는 자리를 경계로 본다 — 한국어 설명문에서는
 * 이 규칙만으로 충분하고, 소수점(0.5)이나 버전(v1.2)은 뒤에 공백이 없어
 * 잘리지 않는다.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((t) => t.trim().replace(/^[·\-\s]+/, ""))
    .filter((t) => t.length > 1);
}

/** 문장을 per개씩 묶어 문단으로 — 마지막에 한 문장만 남으면 앞 문단에 붙인다 */
export function paragraphs(text: string, per = 2): string[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [text];
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    out.push(sentences.slice(i, i + per).join(" "));
  }
  if (out.length > 1 && splitSentences(out[out.length - 1]).length === 1 && per > 1) {
    const tail = out.pop()!;
    out[out.length - 1] += " " + tail;
  }
  return out;
}

/** 배열을 seed 기반으로 섞는다 — 같은 seed면 늘 같은 순서 */
export function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 32비트 안에서만 도는 난수.
 *
 * 예전에는 `s = (s * 1103515245 + 12345) % 2147483648` 를 썼는데, 이
 * 곱셈이 자바스크립트가 정확히 다룰 수 있는 정수 한계(2^53)를 훌쩍 넘는다.
 * 하위 비트가 통째로 날아가 난수가 아니게 되고, 그 결과 **네 선지 중
 * 정답이 거의 늘 4번 자리로 갔다**. 시험을 한 번만 봐도 알아채는 편향이다.
 *
 * Math.imul 은 32비트 곱셈을 정확히 해 주므로 그 함정이 없다.
 */
function mulberry32(seed: number) {
  let t = seed | 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}시간 ${m}분` : `${h}시간`;
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}
