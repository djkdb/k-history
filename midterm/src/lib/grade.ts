import type { Question } from "./types";

/**
 * 짧게 적은 답을 받아 줄지 정한다.
 *
 * 대소문자·띄어쓰기·문장부호는 보지 않는다. 시험지에서 "Primary Key" 와
 * "primary key" 를 다르게 채점하지는 않는다. 숫자는 값으로 맞춘다
 * ("0.50" 과 ".5" 는 같다).
 */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s.,'"`·•()[\]{}:;!?~\-_/\\]+/g, "")
    .trim();
}

function asNumber(s: string): number | null {
  const t = s.replace(/[\s,]/g, "");
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?%?$/i.test(t)) return null;
  const n = Number(t.replace(/%$/, ""));
  return Number.isFinite(n) ? n : null;
}

export function shortMatches(input: string, accepted: string[]): boolean {
  const a = normalize(input);
  if (!a) return false;
  const n = asNumber(input);
  return accepted.some((x) => {
    if (n !== null) {
      const m = asNumber(x);
      if (m !== null) return Math.abs(m - n) < 1e-9 * Math.max(1, Math.abs(m));
    }
    return normalize(x) === a;
  });
}

/** 사용자의 응답 — 객관식은 보기 번호, OX 는 참/거짓, 적기는 글 */
export type Response = number | boolean | string;

/** 서술 문항 스스로 채점 결과 (Response 로 기록한다) */
export const SELF_OK = "__self_ok";
export const SELF_NO = "__self_no";

export function isCorrect(q: Question, r: Response | undefined): boolean {
  if (r === undefined) return false;
  switch (q.kind) {
    case "open":
      return r === SELF_OK;
    case "mc":
      return r === q.answer;
    case "ox":
      return r === q.answer;
    case "short":
      return typeof r === "string" && shortMatches(r, q.answers);
  }
}

/** 낸 답을 사람이 읽는 글로 (오답 노트의 "내가 쓴 답") */
export function responseText(q: Question, r: Response): string {
  if (r === "" || r === undefined) return "모르겠음";
  if (q.kind === "open") return r === SELF_OK ? "스스로 채점: 맞음" : "스스로 채점: 틀림";
  if (q.kind === "mc" && typeof r === "number") return q.options[r] ?? "";
  if (q.kind === "ox" && typeof r === "boolean") return r ? "O (맞다)" : "X (틀리다)";
  return String(r);
}

/** 정답을 사람이 읽을 글로 */
export function answerText(q: Question): string {
  switch (q.kind) {
    case "mc":
      // 보기 순서를 섞어 내므로 번호는 붙이지 않는다
      return q.options[q.answer];
    case "ox":
      return q.answer ? "O (맞다)" : "X (틀리다)";
    case "short":
      return q.answers[0];
    case "open":
      return q.answer;
  }
}
