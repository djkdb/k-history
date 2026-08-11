import type { FormulaTask } from "./types";

/**
 * 수식 채점.
 *
 * 사람이 손으로 친 수식은 정답과 모양이 조금씩 다르다. 공백, 대소문자,
 * 앞의 등호, 스마트 따옴표는 엑셀에서도 같은 결과를 내므로 채점에서
 * 걸러 낸다. 반면 $와 인수 순서는 결과를 바꾸므로 그대로 본다.
 *
 * 틀렸을 때 "틀렸습니다"만 돌려주면 배우는 게 없어서, 무엇이 어긋났는지
 * 한 줄로 짚어 주는 것까지 채점의 일로 삼는다.
 */

export interface FormulaGrade {
  correct: boolean;
  /** 정답으로 인정된 표현 (correct일 때) */
  matched?: string;
  /** 틀렸을 때 무엇이 어긋났는지 한 줄 */
  hint?: string;
  /** 정규화한 내 수식 — 화면에 나란히 보여 준다 */
  normalized: string;
}

const SMART: [RegExp, string][] = [
  [/[“”]/g, '"'],
  [/[‘’]/g, "'"],
  [/（/g, "("],
  [/）/g, ")"],
  [/，/g, ","],
  [/＄/g, "$"],
  [/：/g, ":"],
  [/＝/g, "="],
  [/　/g, " "],
];

/**
 * 비교용으로 다듬는다.
 *  - 앞뒤 공백과 수식 안의 공백을 없앤다 (문자열 안의 공백은 남긴다)
 *  - 문자열 밖은 모두 대문자로 (sum → SUM, a2 → A2)
 *  - 등호가 없으면 붙인다
 */
export function normalizeFormula(raw: string): string {
  let s = raw.trim();
  for (const [re, to] of SMART) s = s.replace(re, to);
  if (!s.startsWith("=")) s = "=" + s;

  let out = "";
  let inStr = false;
  for (const ch of s) {
    if (ch === '"') {
      inStr = !inStr;
      out += ch;
      continue;
    }
    if (inStr) {
      out += ch;
      continue;
    }
    if (/\s/.test(ch)) continue;
    out += ch.toUpperCase();
  }
  return out;
}

/** 문자열 밖의 $를 걷어 낸다 — 참조 고정만 틀렸는지 보려고 */
function stripDollar(normalized: string): string {
  let out = "";
  let inStr = false;
  for (const ch of normalized) {
    if (ch === '"') inStr = !inStr;
    if (!inStr && ch === "$") continue;
    out += ch;
  }
  return out;
}

/** 쓰인 함수 이름들 — 여는 괄호 바로 앞의 낱말 */
export function functionNames(normalized: string): string[] {
  const names: string[] = [];
  const re = /([A-Z][A-Z0-9._]*)\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized))) names.push(m[1]);
  return names;
}

function countOutsideStrings(normalized: string, ch: string): number {
  let n = 0;
  let inStr = false;
  for (const c of normalized) {
    if (c === '"') inStr = !inStr;
    else if (!inStr && c === ch) n++;
  }
  return n;
}

/** 문자열 밖 쉼표 개수 — 인수를 몇 개 넘겼는지 어림잡는다 */
function argCount(normalized: string): number {
  return countOutsideStrings(normalized, ",");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const prev = new Array<number>(b.length + 1);
  const cur = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/** 정답 후보 중 내 답과 가장 가까운 것 — 힌트는 이 기준으로 만든다 */
function closest(mine: string, candidates: string[]): string {
  let best = candidates[0];
  let bestD = Infinity;
  for (const c of candidates) {
    const d = levenshtein(mine, c);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

function hintFor(mine: string, target: string): string {
  const opens = countOutsideStrings(mine, "(");
  const closes = countOutsideStrings(mine, ")");
  if (opens !== closes) {
    return `괄호 짝이 맞지 않습니다. 여는 괄호 ${opens}개, 닫는 괄호 ${closes}개입니다.`;
  }

  const quotes = (mine.match(/"/g) || []).length;
  if (quotes % 2 === 1) {
    return "큰따옴표가 홀수 개입니다. 문자 조건은 앞뒤로 감싸야 합니다.";
  }

  if (stripDollar(mine) === stripDollar(target)) {
    return "함수와 범위는 맞습니다. 참조 고정($)의 위치만 다릅니다. 채우기를 해도 움직이면 안 되는 범위를 다시 보세요.";
  }

  const mineFns = functionNames(mine);
  const targetFns = functionNames(target);
  const missing = targetFns.filter((f) => !mineFns.includes(f));
  const extra = mineFns.filter((f) => !targetFns.includes(f));
  if (missing.length && extra.length) {
    return `${extra.join("·")} 대신 ${missing.join("·")} 함수를 써야 합니다.`;
  }
  if (missing.length) {
    return `${missing.join("·")} 함수가 빠졌습니다.`;
  }
  if (extra.length) {
    return `${extra.join("·")} 함수는 필요하지 않습니다.`;
  }

  const mineArgs = argCount(mine);
  const targetArgs = argCount(target);
  if (mineArgs !== targetArgs) {
    return `함수는 맞습니다. 인수 개수가 다릅니다 (내 답 ${mineArgs + 1}개, 정답 ${targetArgs + 1}개).`;
  }

  let i = 0;
  while (i < mine.length && i < target.length && mine[i] === target[i]) i++;
  const around = mine.slice(Math.max(0, i - 6), i + 6);
  return `함수는 맞습니다. 인수 순서나 범위를 다시 보세요. (${i + 1}번째 글자 부근: …${around}…)`;
}

export function gradeFormula(input: string, task: FormulaTask): FormulaGrade {
  const mine = normalizeFormula(input);
  if (mine === "=" || !input.trim()) {
    return { correct: false, normalized: mine, hint: "수식을 입력해 주세요." };
  }

  const candidates = [task.answer, ...(task.alternatives || [])].map(
    normalizeFormula,
  );
  const hit = candidates.indexOf(mine);
  if (hit >= 0) {
    const raw = [task.answer, ...(task.alternatives || [])][hit];
    return { correct: true, normalized: mine, matched: raw };
  }

  return {
    correct: false,
    normalized: mine,
    hint: hintFor(mine, closest(mine, candidates)),
  };
}
