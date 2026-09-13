/**
 * 실기 필답형 채점.
 *
 * 실기는 고르는 것이 아니라 적는다. 그래서 같은 답이라도 사람마다 다르게
 * 쓴다. 채점이 너무 빡빡하면 맞게 알고도 틀렸다고 나오고, 너무 헐거우면
 * 몰라도 맞았다고 나온다. 둘 다 연습에 해롭다.
 *
 * 여기서 받아 주는 것과 받아 주지 않는 것을 분명히 해 둔다.
 *
 *   받아 준다
 *     · 앞뒤 공백, 사이 공백이 여러 개인 것
 *     · 한국어 띄어쓰기 ("역할기반 접근통제" 와 "역할 기반 접근 통제")
 *     · 대소문자 ("RAID" 와 "raid")
 *     · 괄호로 덧붙인 원문 ("캡슐화(Encapsulation)")
 *     · 가운뎃점·쉼표·슬래시로 나열한 것의 순서
 *     · 나열을 공백으로만 가른 것 ("원자성 일관성 고립성 지속성")
 *     · 답 목록에 적어 둔 다른 표기 (동의어·영문·약어)
 *
 *   받아 주지 않는다
 *     · 글자가 다른 것. "은닉"과 "은익"은 다른 답이다
 *     · 일부만 쓴 것. "접근 통제"에 "접근"만 쓰면 틀렸다
 *
 * 마지막 항목이 중요하다. 부분 점수를 주면 실제 시험보다 후해져서,
 * 이 앱에서 60점이 나오는데 시험장에서 떨어지는 일이 생긴다.
 */

/** 채점하기 전에 표기를 고른다 */
export function normalize(raw: string): string {
  return (
    raw
      .trim()
      .toLowerCase()
      // 괄호 안은 덧붙인 설명으로 본다 — "캡슐화(Encapsulation)" → "캡슐화"
      .replace(/[（(][^)）]*[)）]/g, "")
      // 사이 공백을 하나로
      .replace(/\s+/g, " ")
      // 문장 끝의 마침표는 무시한다
      .replace(/[.。]\s*$/, "")
      .trim()
  );
}

/**
 * 띄어쓰기를 지운 꼴.
 *
 * 한국어 전문 용어의 띄어쓰기는 사람마다 다르다. "역할 기반 접근 통제"와
 * "역할기반 접근통제"와 "역할기반접근통제"는 같은 답이다. 시험장에서도
 * 띄어쓰기로 점수를 깎지 않는다. 다만 영문은 단어 사이 공백이 뜻을 가르므로
 * (예: "hold and wait") 라틴 문자 사이의 공백 하나는 남긴다.
 */
function tight(s: string): string {
  return s.replace(/(?<![a-z0-9])\s+|\s+(?![a-z0-9])/g, "");
}

/** 나열형 답을 조각으로 가른다 */
function parts(raw: string): string[] {
  return normalize(raw)
    .split(/[·,،、/|]+|\s+및\s+|\s+and\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * 나열을 공백으로만 가른 경우까지 본다.
 *
 * 모범 답안이 "원자성·일관성·고립성·지속성" 이어도 사람은 대개
 * "원자성 일관성 고립성 지속성" 이라고 적는다. 그렇다고 공백을 늘 구분자로
 * 보면 "상호 배제" 가 두 조각으로 쪼개진다. 그래서 조각 수가 모범 답안과
 * 같을 때만 공백을 구분자로 인정한다.
 */
function partsLike(raw: string, want: number): string[] {
  const byMark = parts(raw);
  if (byMark.length === want) return byMark;
  const bySpace = normalize(raw).split(/\s+/).filter(Boolean);
  return bySpace.length === want ? bySpace : byMark;
}

export type Judgement = "correct" | "wrong" | "empty";

export interface GradeResult {
  judgement: Judgement;
  /** 어느 답과 맞았는가 (맞았을 때만) */
  matched?: string;
  /** 왜 틀렸는지 짚어 줄 말 */
  note?: string;
}

/**
 * 답 하나를 채점한다.
 *
 * answers 의 첫 번째가 모범 답안이고, 나머지는 같은 뜻으로 받아 줄 표기다.
 */
export function grade(input: string, answers: string[]): GradeResult {
  const mine = normalize(input);
  if (!mine) return { judgement: "empty" };

  for (const a of answers) {
    const want = normalize(a);
    if (!want) continue;
    if (mine === want) return { judgement: "correct", matched: a };
    // 띄어쓰기만 다른 것은 같은 답이다
    if (tight(mine) === tight(want))
      return { judgement: "correct", matched: a };

    // 나열형 — 순서가 달라도 같은 것을 다 썼으면 맞다
    const wantParts = parts(a);
    if (wantParts.length > 1) {
      const mineParts = partsLike(input, wantParts.length);
      const wantTight = wantParts.map(tight);
      if (
        mineParts.length === wantParts.length &&
        wantTight.every((w) => mineParts.some((m) => tight(m) === w))
      ) {
        return { judgement: "correct", matched: a };
      }
    }
  }

  // 왜 틀렸는지 한마디 — 아까운 경우를 짚어 준다
  const best = answers[0] ? tight(normalize(answers[0])) : "";
  const mineT = tight(mine);
  if (best && mineT && (best.includes(mineT) || mineT.includes(best))) {
    return {
      judgement: "wrong",
      note: "일부만 적었습니다. 실제 시험도 빠진 말이 있으면 점수를 주지 않습니다.",
    };
  }
  return { judgement: "wrong" };
}

/**
 * 코드 출력 채점.
 *
 * 출력은 줄바꿈과 공백이 뜻을 갖는다. 그래서 용어 채점보다 빡빡하게 본다 —
 * 줄 끝 공백과 마지막 빈 줄만 봐 준다.
 */
export function gradeOutput(input: string, answers: string[]): GradeResult {
  const tidy = (s: string) =>
    s
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.replace(/\s+$/, ""))
      .join("\n")
      .replace(/\n+$/, "");
  const mine = tidy(input);
  if (!mine.trim()) return { judgement: "empty" };
  for (const a of answers) {
    if (mine === tidy(a)) return { judgement: "correct", matched: a };
    // 대소문자만 다른 경우는 짚어 준다
    if (mine.toLowerCase() === tidy(a).toLowerCase()) {
      return {
        judgement: "wrong",
        note: "대소문자가 다릅니다. 출력은 글자 그대로 봅니다.",
      };
    }
  }
  return { judgement: "wrong" };
}

/**
 * SQL 채점.
 *
 * SQL 은 같은 뜻을 여러 꼴로 쓴다. 키워드 대소문자, 줄바꿈, 끝의 세미콜론,
 * 따옴표 종류를 고르고 나서 견준다. 다만 순서를 바꾸면 다른 질의이므로
 * 단어 순서는 그대로 본다.
 */
export function gradeSql(input: string, answers: string[]): GradeResult {
  const tidy = (s: string) =>
    s
      .toLowerCase()
      .replace(/["'`]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/\s*([(),;])\s*/g, "$1")
      // 비교 연산자 앞뒤 공백도 고른다 — "dept='AI'" 와 "dept = 'AI'" 는 같다.
      // 두 글자짜리(<=, >=, <>, !=)를 먼저 봐야 쪼개지지 않는다
      .replace(/\s*(<=|>=|<>|!=|=|<|>)\s*/g, "$1")
      .replace(/;+$/, "")
      .trim();
  const mine = tidy(input);
  if (!mine) return { judgement: "empty" };
  for (const a of answers) {
    if (mine === tidy(a)) return { judgement: "correct", matched: a };
  }
  return { judgement: "wrong" };
}

/** 문항 유형에 맞는 채점기를 고른다 */
export function gradeByKind(
  kind: "term" | "code" | "sql" | "blank",
  input: string,
  answers: string[],
): GradeResult {
  if (kind === "code") return gradeOutput(input, answers);
  if (kind === "sql") return gradeSql(input, answers);
  return grade(input, answers);
}
