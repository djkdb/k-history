/**
 * 받아쓰기 채점.
 *
 * ── 왜 Part 1·2 에만 두는가 ────────────────────────────────────
 * 이 두 파트에서 틀리는 이유는 거의 언제나 "안 들려서"다. 선택지가
 * 시험지에 없으니 눈으로 만회할 수가 없고, 문장이 한 줄이라 어디서
 * 놓쳤는지도 스스로는 모른다. 받아 적어 보면 놓친 자리가 정확히
 * 드러난다 — 대개 전치사, 관사, 그리고 약하게 발음되는 조동사다.
 * Part 3·4 는 문장이 길어 받아쓰기가 훈련이 아니라 노동이 된다.
 *
 * ── 채점 기준 ─────────────────────────────────────────────────
 * 대소문자와 문장부호는 보지 않는다. 소리로 구별되지 않는 것을 틀렸다고
 * 하면 정작 들린 것과 안 들린 것을 못 가린다. 낱말 단위로 맞춰 보고
 * 어긋난 자리를 세 가지로 나눈다.
 *
 *   ok    — 그대로 받아 적었다
 *   wrong — 다른 낱말로 적었다 (work 를 walk 로 들은 자리)
 *   miss  — 아예 빠뜨렸다 (약하게 발음되는 for·a·have 가 여기 걸린다)
 *
 * 낱말을 맞춰 보는 것은 편집 거리(Levenshtein)의 되짚기다. 앞이 하나
 * 밀렸다고 뒤가 전부 어긋나 보이면 어디를 놓쳤는지 알 수 없기 때문이다.
 */

export type DictationState = "ok" | "wrong" | "miss";

export interface DictationToken {
  /** 정답 문장의 낱말 */
  word: string;
  state: DictationState;
  /** state 가 wrong 일 때, 그 자리에 적은 낱말 */
  typed?: string;
}

export interface DictationResult {
  tokens: DictationToken[];
  /** 정답에 없는데 더 적은 낱말 */
  extra: string[];
  correct: number;
  total: number;
  perfect: boolean;
  /** 0~100 */
  score: number;
}

/** 소리로 구별되지 않는 것은 지운다 — 대소문자, 문장부호, 아포스트로피 */
export function normalizeWord(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9']/g, "")
    .replace(/'/g, "");
}

/**
 * 줄여 쓴 말을 풀어 적어도 맞는 것으로 봐 준다.
 *
 * Part 1 은 "She's -ing" 이 끝없이 나온다. 소리로는 She's 와 She is 가
 * 갈리지 않는 자리가 많아, 풀어 적었다고 틀렸다고 하면 정작 안 들린
 * 자리를 못 찾는다. 반대로 소리가 실제로 갈리는 짝(we're/were,
 * I'll/ill, we'll/well)은 일부러 넣지 않았다 — 그건 진짜 듣기 문제다.
 */
const EXPANDS: Record<string, [string, string]> = {
  shes: ["she", "is"],
  hes: ["he", "is"],
  its: ["it", "is"],
  theyre: ["they", "are"],
  youre: ["you", "are"],
  im: ["i", "am"],
  theres: ["there", "is"],
  thats: ["that", "is"],
  whats: ["what", "is"],
  whos: ["who", "is"],
  dont: ["do", "not"],
  doesnt: ["does", "not"],
  didnt: ["did", "not"],
  isnt: ["is", "not"],
  arent: ["are", "not"],
  wasnt: ["was", "not"],
  werent: ["were", "not"],
  wont: ["will", "not"],
  cant: ["can", "not"],
  cannot: ["can", "not"],
  couldnt: ["could", "not"],
  wouldnt: ["would", "not"],
  shouldnt: ["should", "not"],
  havent: ["have", "not"],
  hasnt: ["has", "not"],
  hadnt: ["had", "not"],
  lets: ["let", "us"],
  ive: ["i", "have"],
  youve: ["you", "have"],
  weve: ["we", "have"],
  theyve: ["they", "have"],
  youll: ["you", "will"],
  theyll: ["they", "will"],
};

/** 줄임말 하나가 낱말 둘로 풀려 적혔는가 (또는 그 반대) */
function expandsTo(one: string, a: string, b: string): boolean {
  const e = EXPANDS[one];
  return !!e && e[0] === a && e[1] === b;
}

/**
 * 낱말 둘이 얼마나 닮았는지 (글자 단위 편집 거리).
 *
 * 채점 자체에는 안 쓰이고, 어긋난 자리를 맞춰 볼 때만 쓴다. paper 를
 * papers 로 적고 뒤에 낱말을 하나 더 붙였다면, paper 를 엉뚱한 낱말과
 * 짝지어 놓고 papers 를 "더 적은 낱말"로 미는 것보다 paper↔papers 로
 * 짝짓는 편이 사람이 보기에 맞다. 어긋난 값이 같을 때 닮은 쪽을 고른다.
 */
function charDistance(a: string, b: string): number {
  const n = a.length;
  const m = b.length;
  if (!n) return m;
  if (!m) return n;
  let prev = Array.from({ length: m + 1 }, (_, j) => j);
  for (let i = 1; i <= n; i++) {
    const cur = [i];
    for (let j = 1; j <= m; j++) {
      cur[j] = Math.min(
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        prev[j] + 1,
        cur[j - 1] + 1,
      );
    }
    prev = cur;
  }
  return prev[m];
}

/** 낱말을 바꿔 적은 값. 같으면 0, 다르면 0.75~1 — 닮을수록 싸다. */
function subCost(a: string, b: string): number {
  if (a === b) return 0;
  const far = charDistance(a, b) / Math.max(a.length, b.length, 1);
  return 0.75 + 0.25 * Math.min(1, far);
}

export function tokenize(s: string): string[] {
  return s
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

/** 소수점 값을 비교하므로 되짚을 때는 어림으로 맞춘다 */
function near(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-9;
}

export function gradeDictation(target: string, typed: string): DictationResult {
  const tWords = tokenize(target);
  const uWords = tokenize(typed);
  const t = tWords.map(normalizeWord);
  const u = uWords.map(normalizeWord);

  const n = t.length;
  const m = u.length;

  // d[i][j] = t 의 앞 i 낱말을 u 의 앞 j 낱말로 만드는 데 드는 최소 손질 수
  const d: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let best = Math.min(
        d[i - 1][j - 1] + subCost(t[i - 1], u[j - 1]),
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
      );
      // 줄임말 하나 ↔ 풀어 쓴 낱말 둘
      if (j >= 2 && expandsTo(t[i - 1], u[j - 2], u[j - 1])) {
        best = Math.min(best, d[i - 1][j - 2]);
      }
      if (i >= 2 && expandsTo(u[j - 1], t[i - 2], t[i - 1])) {
        best = Math.min(best, d[i - 2][j - 1]);
      }
      d[i][j] = best;
    }
  }

  const tokens: DictationToken[] = [];
  const extra: string[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 1 && expandsTo(t[i - 1], u[j - 2], u[j - 1]) && near(d[i][j], d[i - 1][j - 2])) {
      tokens.push({ word: tWords[i - 1], state: "ok" });
      i--;
      j -= 2;
      continue;
    }
    if (i > 1 && j > 0 && expandsTo(u[j - 1], t[i - 2], t[i - 1]) && near(d[i][j], d[i - 2][j - 1])) {
      tokens.push({ word: tWords[i - 1], state: "ok" });
      tokens.push({ word: tWords[i - 2], state: "ok" });
      i -= 2;
      j--;
      continue;
    }
    if (i > 0 && j > 0) {
      const same = t[i - 1] === u[j - 1];
      if (near(d[i][j], d[i - 1][j - 1] + subCost(t[i - 1], u[j - 1]))) {
        tokens.push(
          same
            ? { word: tWords[i - 1], state: "ok" }
            : { word: tWords[i - 1], state: "wrong", typed: uWords[j - 1] },
        );
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && near(d[i][j], d[i - 1][j] + 1)) {
      tokens.push({ word: tWords[i - 1], state: "miss" });
      i--;
      continue;
    }
    // 정답에 없는 낱말을 더 적었다
    extra.push(uWords[j - 1]);
    j--;
  }
  tokens.reverse();
  extra.reverse();

  const correct = tokens.filter((x) => x.state === "ok").length;
  const total = tokens.length;
  return {
    tokens,
    extra,
    correct,
    total,
    perfect: total > 0 && correct === total && extra.length === 0,
    score: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}
