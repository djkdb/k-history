import type { Vocab } from "./types";
import { shuffleSeeded } from "./utils";

/**
 * 어휘 시험.
 *
 * ── 왜 카드만으로는 모자란가 ──────────────────────────────────
 * 카드를 뒤집으면 늘 "아, 알아" 하고 넘어간다. 뜻을 보고 아는 것과
 * 뜻만 주어졌을 때 그 낱말이 떠오르는 것은 완전히 다른 일이고, 시험장에서
 * 필요한 것은 뒤쪽이다. 그래서 세 가지로 나눠 묻는다.
 *
 *   word    단어 → 뜻     (읽다가 만났을 때 알아보는가)
 *   meaning 뜻 → 단어     (뜻만 주면 떠오르는가)
 *   blank   문장 빈칸     (그 자리에 쓸 줄 아는가 — Part 5 와 같은 모양)
 *
 * ── 오답을 어떻게 고르는가 ────────────────────────────────────
 * 아무 낱말이나 붙이면 품사만 보고 답이 나온다. 그래서 오답은 언제나
 * **같은 품사**에서 고른다. 빈칸 문제는 여기에 하나를 더 건다 — 오답은
 * 답과 **다른 갈래(topic)**에서 가져온다. 같은 갈래에서 뽑으면 둘 다
 * 말이 되는 문장이 만들어져 답이 둘이 되어 버리기 때문이다.
 *
 * 자료에 헷갈리는 짝(confusable)이 달려 있으면 그것을 반드시 오답에
 * 넣는다. 시험이 실제로 나란히 놓고 고르게 하는 짝이다.
 */
export type VocabQuizKind = "word" | "meaning" | "blank";

export interface VocabQuizQuestion {
  /** 어휘 id — 복습 기록이 이 id 를 가리킨다 */
  id: string;
  kind: VocabQuizKind;
  prompt: string;
  /** 빈칸 문제의 한국어 뜻풀이처럼, 문제 아래 붙는 도움말 */
  sub?: string;
  choices: string[];
  answer: number;
}

export const KIND_LABEL: Record<VocabQuizKind, string> = {
  word: "뜻 고르기",
  meaning: "단어 고르기",
  blank: "빈칸 채우기",
};

export const BLANK = "______";

/**
 * 예문에서 그 낱말이 있는 자리를 빈칸으로 바꾼다.
 *
 * 예문은 시험지에 나오는 그대로 쓰므로 낱말이 변형돼 있다
 * (meet → meets, meeting / apply → applied). 원형만 찾으면 절반은
 * 못 찾으니 흔한 어미까지 같이 본다. 그래도 못 찾으면 빈칸 문제를
 * 만들지 않는다 — 억지로 만든 문제는 틀린 문제다.
 */
export function blankExample(v: Vocab): string | null {
  const base = v.word.trim();
  if (!base || /\s/.test(base)) return null;
  const stem = base.replace(/(e|y)$/i, "");
  const pattern = new RegExp(
    `\\b(${escape(base)}|${escape(stem)})(s|es|ed|d|ing|ies|ied|ly|ment|tion|sion|ance|ence|al)?\\b`,
    "i",
  );
  if (!pattern.test(v.example)) return null;
  return v.example.replace(pattern, BLANK);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 뜻풀이가 세 글자 넘게 겹치면 사실상 같은 말이다 */
function overlaps(a: string, b: string): boolean {
  const clean = (s: string) => s.replace(/[^가-힣a-zA-Z]/g, "");
  const x = clean(a);
  const y = clean(b);
  if (!x || !y) return false;
  for (let i = 0; i + 3 <= x.length; i++) {
    if (y.includes(x.slice(i, i + 3))) return true;
  }
  return false;
}

function pick<T>(pool: T[], n: number, seed: number): T[] {
  return shuffleSeeded(pool, seed).slice(0, n);
}

function buildOne(
  v: Vocab,
  all: Vocab[],
  kind: VocabQuizKind,
  seed: number,
): VocabQuizQuestion | null {
  const samePos = all.filter((x) => x.id !== v.id && x.pos === v.pos);

  if (kind === "blank") {
    const stem = blankExample(v);
    if (!stem) return null;
    // 같은 품사 + 다른 갈래 — 둘 다 말이 되는 문장을 막는다
    const pool = samePos.filter((x) => x.topic !== v.topic);
    if (pool.length < 3) return null;
    const wrong = pick(pool, 3, seed).map((x) => x.word);
    return finish(v.id, kind, stem, v.exampleKo, v.word, wrong, seed);
  }

  if (kind === "meaning") {
    // 뜻이 겹치는 낱말을 오답에 넣으면 그것도 답이 된다
    const usable = (x: Vocab) => x.id !== v.id && !overlaps(x.meaning, v.meaning);
    const near = samePos.filter(usable);
    const pool = near.length >= 3 ? near : all.filter(usable);
    if (pool.length < 3) return null;
    const wrong = pick(pool, 3, seed).map((x) => x.word);
    if (v.confusable) wrong[0] = v.confusable.word;
    return finish(v.id, kind, v.meaning, `${v.pos} 자리에 들어갈 낱말`, v.word, wrong, seed);
  }

  /*
   * 뜻을 고르는 문제에서는 헷갈리는 짝의 뜻을 오답으로 쓰지 않는다.
   * eligible 의 짝인 qualified 를 넣으면 "자격이 있는" 과 "자격을 갖춘"
   * 이 나란히 놓여 답이 둘이 된다. 짝은 낱말을 고르는 문제에서만 쓴다 —
   * 거기서는 한국어 뜻이 하나로 못 박혀 있어 헷갈릴 여지가 없다.
   */
  const pool = all.filter(
    (x) => x.id !== v.id && x.meaning !== v.meaning && !overlaps(x.meaning, v.meaning),
  );
  if (pool.length < 3) return null;
  const wrong = pick(pool, 3, seed).map((x) => x.meaning);
  return finish(v.id, kind, v.word, v.pos, v.meaning, wrong, seed);
}

function finish(
  id: string,
  kind: VocabQuizKind,
  prompt: string,
  sub: string,
  right: string,
  wrong: string[],
  seed: number,
): VocabQuizQuestion | null {
  // 같은 글이 두 번 들어가면 답이 둘이 된다
  const uniq = Array.from(new Set(wrong.filter((w) => w && w !== right)));
  if (uniq.length < 3) return null;
  const choices = shuffleSeeded([right, ...uniq.slice(0, 3)], seed + 7);
  const answer = choices.indexOf(right);
  if (answer < 0) return null;
  return { id, kind, prompt, sub, choices, answer };
}

/**
 * 시험지 한 벌.
 *
 * 세 갈래를 돌려 가며 낸다. 한 낱말이 두 번 나오지 않게 하고, 만들 수
 * 없는 갈래(빈칸을 못 뚫는 낱말 등)는 다른 갈래로 대신한다.
 */
export function buildVocabQuiz(
  pool: Vocab[],
  count: number,
  seed: number,
): VocabQuizQuestion[] {
  const order = shuffleSeeded(pool, seed);
  const kinds: VocabQuizKind[] = ["word", "meaning", "blank"];
  const out: VocabQuizQuestion[] = [];

  for (let i = 0; i < order.length && out.length < count; i++) {
    const v = order[i];
    const first = kinds[i % kinds.length];
    const tries: VocabQuizKind[] = [first, ...kinds.filter((k) => k !== first)];
    for (const k of tries) {
      const q = buildOne(v, pool, k, seed + i * 31);
      if (q) {
        out.push(q);
        break;
      }
    }
  }
  return out;
}
