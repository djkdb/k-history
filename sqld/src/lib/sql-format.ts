/**
 * SQL 을 시험지에 실리는 모양으로 벌린다.
 *
 * ── 왜 필요한가 ───────────────────────────────────────────────
 * 시험지의 SQL 은 절마다 줄을 바꿔 적는다. 그래야 SELECT 가 무엇을
 * 고르고 WHERE 가 무엇을 거르는지가 한눈에 층으로 보이기 때문이다.
 *
 *     SELECT ename, sal
 *     FROM emp
 *     WHERE sal >= 400
 *     ORDER BY sal DESC;
 *
 * 그런데 자료에는 이것이 한 줄로 붙어 있었다. 화면에서는 pre 로 감싸
 * 줄바꿈을 지키고 있었으므로, 붙어 있던 것은 화면이 아니라 자료 쪽이다.
 * 한 줄짜리는 실제 시험지와 다르게 보일 뿐 아니라, 좁은 휴대폰 화면에서
 * 제멋대로 접혀 어디가 절의 시작인지 알 수 없게 된다.
 *
 * ── 어디서 끊는가 ─────────────────────────────────────────────
 * 괄호 밖(깊이 0)에서만 끊는다. COUNT(*), IN (…), CASE … END,
 * 인라인 뷰 안쪽은 건드리지 않는다. 안쪽까지 벌리려 들면 짧은 것까지
 * 층층이 갈라져 오히려 읽기 어려워지고, 무엇보다 잘못 끊을 위험이 있다.
 * 따옴표 안도 마찬가지로 손대지 않는다 — '부장' 같은 값이 잘리면 문장이
 * 아예 깨진다.
 *
 * AND·OR 는 절 안에서 한 칸 들여쓴다. 조건이 둘 이상이면 그 자리가
 * 곧 문제의 함정인 경우가 많아, 따로 떼어 두는 편이 눈에 잘 들어온다.
 */

/** 줄 맨 앞으로 나가는 절 — 긴 것부터 봐야 GROUP 이 GROUP BY 를 가로채지 않는다 */
const CLAUSES = [
  "INSERT INTO",
  "DELETE FROM",
  "GROUP BY",
  "ORDER BY",
  "PARTITION BY",
  "UNION ALL",
  "CROSS JOIN",
  "NATURAL JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "SELECT",
  "FROM",
  "WHERE",
  "HAVING",
  "VALUES",
  "UPDATE",
  "SET",
  "UNION",
  "INTERSECT",
  "MINUS",
  "EXCEPT",
  "JOIN",
  "CONNECT BY",
  "START WITH",
  "LIMIT",
  "OFFSET",
  "FETCH FIRST",
  "RETURNING",
];

/** 절 안에서 한 칸 들여쓰는 말 */
const INDENTED = ["AND", "OR"];

interface Token {
  /** 그대로 옮겨 적을 글자 */
  text: string;
  /** 괄호 깊이 — 0 일 때만 줄을 바꾼다 */
  depth: number;
  /** 따옴표 안이면 손대지 않는다 */
  quoted: boolean;
}

/**
 * 낱말로 쪼갠다.
 *
 * 따옴표와 괄호만 본다. 그 밖의 것은 공백으로 나눈 덩어리 그대로 둔다 —
 * 연산자나 쉼표를 굳이 떼어 낼 이유가 없고, 떼면 다시 붙일 때 원래
 * 띄어쓰기를 잃는다.
 */
function tokenize(sql: string): Token[] {
  const out: Token[] = [];
  let buf = "";
  let depth = 0;
  let quote: string | null = null;
  let quotedRun = false;

  const flush = () => {
    if (buf) out.push({ text: buf, depth, quoted: quotedRun });
    buf = "";
    quotedRun = false;
  };

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];

    if (quote) {
      buf += ch;
      // '' 는 따옴표 안의 따옴표다 (SQL 의 이스케이프)
      if (ch === quote && sql[i + 1] === quote) {
        buf += sql[++i];
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      quote = ch;
      quotedRun = true;
      buf += ch;
      continue;
    }

    if (ch === "(") {
      buf += ch;
      depth++;
      continue;
    }
    if (ch === ")") {
      depth = Math.max(0, depth - 1);
      buf += ch;
      continue;
    }

    if (/\s/.test(ch)) {
      flush();
      continue;
    }

    buf += ch;
  }
  flush();
  return out;
}

/** 이 자리에서 시작하는 절이 있는가 — 있으면 그 절을 이루는 낱말 수를 돌려준다 */
function clauseAt(tokens: Token[], i: number): { name: string; span: number } | null {
  if (tokens[i].depth > 0 || tokens[i].quoted) return null;
  for (const clause of CLAUSES) {
    const words = clause.split(" ");
    let ok = true;
    for (let k = 0; k < words.length; k++) {
      const t = tokens[i + k];
      // 절 이름은 낱말 하나로 딱 떨어져야 한다. count(*) 안의 select 같은
      // 것은 depth 로 이미 걸러졌고, 여기서는 ename, 처럼 뒤에 쉼표가
      // 붙은 것을 막는다.
      if (!t || t.quoted || t.depth > 0 || t.text.toUpperCase() !== words[k]) {
        ok = false;
        break;
      }
    }
    if (ok) return { name: clause, span: words.length };
  }
  return null;
}

/**
 * 한 줄짜리 SQL 을 절마다 줄을 바꿔 돌려준다.
 *
 * 이미 줄이 나뉘어 있으면 그대로 둔다 — 손으로 다듬어 둔 모양을
 * 기계가 다시 흐트러뜨리면 안 된다.
 */
export function formatSql(sql: string): string {
  const src = sql.trim();
  if (!src) return src;
  if (src.includes("\n")) return src;

  const tokens = tokenize(src);
  if (!tokens.length) return src;

  const lines: string[] = [];
  let line = "";
  const push = () => {
    if (line.trim()) lines.push(line.trimEnd());
    line = "";
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const clause = clauseAt(tokens, i);

    if (clause) {
      push();
      line = clause.name;
      i += clause.span - 1;
      continue;
    }

    if (
      t.depth === 0 &&
      !t.quoted &&
      INDENTED.includes(t.text.toUpperCase()) &&
      lines.length > 0
    ) {
      push();
      line = `  ${t.text.toUpperCase()}`;
      continue;
    }

    line += line ? ` ${t.text}` : t.text;
  }
  push();

  return lines.join("\n");
}

/** 여러 문장이 세미콜론으로 이어져 있으면 문장마다 따로 벌린다 */
export function formatSqlScript(sql: string): string {
  const src = sql.trim();
  if (src.includes("\n")) return src;
  const parts = src.split(/;\s*/).filter(Boolean);
  if (parts.length <= 1) return formatSql(src);
  const ended = /;\s*$/.test(src);
  return parts
    .map((p, i) => formatSql(p) + (i < parts.length - 1 || ended ? ";" : ""))
    .join("\n\n");
}

/**
 * 이미 여러 줄인 SQL 에서, 한 줄에 몰려 있는 절만 떼어 낸다.
 *
 * formatSql 은 한 줄짜리를 처음부터 다시 짜지만, 손으로 반쯤 벌려 둔
 * 것에는 손을 대지 않는다. 그런데 그 반쯤 벌린 것이 오히려 눈에 걸린다 —
 * 어떤 줄은 절 하나, 어떤 줄은 절 셋이면 층이 보이지 않는다.
 *
 * 그래서 이 함수는 **줄을 붙이지는 않고 나누기만** 한다. 괄호 안(인라인
 * 뷰·서브쿼리·CASE)은 건드리지 않으므로, 손으로 맞춰 둔 CASE 의 줄맞춤은
 * 그대로 남는다.
 */
export function reflowSql(sql: string): string {
  const src = sql.trim();
  if (!src) return src;

  let out = "";
  let depth = 0;
  let quote: string | null = null;

  /** 지금 줄에 이미 무언가 적혀 있는가 */
  const lineHasContent = () => {
    const nl = out.lastIndexOf("\n");
    return out.slice(nl + 1).trim().length > 0;
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (quote) {
      out += ch;
      if (ch === quote && src[i + 1] === quote) out += src[++i];
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === "(") {
      depth++;
      out += ch;
      continue;
    }
    if (ch === ")") {
      depth = Math.max(0, depth - 1);
      out += ch;
      continue;
    }

    // 낱말이 시작하는 자리인가
    const prev = i === 0 ? "" : src[i - 1];
    const atWordStart = i === 0 || /[\s(,]/.test(prev);
    if (depth === 0 && atWordStart && /[A-Za-z]/.test(ch)) {
      const rest = src.slice(i);
      const hit = CLAUSES.find((c) => {
        const re = new RegExp(`^${c.replace(/ /g, "\\s+")}\\b`, "i");
        return re.test(rest);
      });
      if (hit && lineHasContent()) {
        out = out.replace(/[ \t]+$/, "") + "\n";
      }
    }

    out += ch;
  }

  return out
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");
}
