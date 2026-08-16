import { SCHEMA_SQL } from "@/data/schema";

/**
 * 브라우저 안의 진짜 SQLite.
 *
 * 쿼리를 눈으로 읽어 결과를 그리는 것과, 쳐 보고 틀리는 것은 다른 공부다.
 * SQL 시험이므로 실제로 돌려 보게 한다. sql.js(SQLite 를 WebAssembly 로
 * 옮긴 것)를 쓰며, 파일은 앱과 함께 담겨 있어 인터넷 없이도 된다.
 *
 * ⚠️ 700KB 쯤 되므로 첫 화면부터 받지 않는다. 실습 화면에 들어갈 때
 *    비로소 불러온다.
 */

interface SqlJsStatic {
  Database: new (data?: ArrayLike<number> | null) => SqlJsDatabase;
}
interface SqlJsDatabase {
  exec: (sql: string) => { columns: string[]; values: unknown[][] }[];
  close: () => void;
}

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (f: string) => string }) => Promise<SqlJsStatic>;
  }
}

let loading: Promise<SqlJsStatic> | null = null;

/**
 * wasm 파일이 있는 자리.
 *
 * sql.js 의 빌드에 따라 찾는 이름이 다르다(sql-wasm.wasm / sql-wasm-browser.wasm).
 * 요청한 이름을 그대로 붙이면 없는 파일을 받아 오게 되고, 정적 호스팅은
 * 404 대신 index.html 을 돌려주기도 해서 "magic word 가 다르다"는 알 수 없는
 * 오류로 끝난다. 우리가 담아 둔 파일은 하나뿐이므로 그 하나를 가리킨다.
 */
const WASM_URL = "/sql/sql-wasm.wasm";

/** sql.js 를 한 번만 불러온다 */
function loadSqlJs(): Promise<SqlJsStatic> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("브라우저에서만 됩니다"));
      return;
    }
    if (window.initSqlJs) {
      window
        .initSqlJs({ locateFile: () => WASM_URL })
        .then(resolve)
        .catch(reject);
      return;
    }
    const s = document.createElement("script");
    s.src = "/sql/sql-wasm.js";
    s.async = true;
    s.onload = () => {
      if (!window.initSqlJs) {
        reject(new Error("SQL 엔진을 불러오지 못했습니다"));
        return;
      }
      window
        .initSqlJs({ locateFile: () => WASM_URL })
        .then(resolve)
        .catch(reject);
    };
    s.onerror = () => reject(new Error("SQL 엔진 파일을 받지 못했습니다"));
    document.head.appendChild(s);
  });
  return loading;
}

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
  /**
   * 결과가 비었을 때 왜 비었는가.
   *
   * SQLite 는 "0행짜리 SELECT" 와 "값을 안 돌려주는 UPDATE" 를 똑같이
   * 빈 결과로 돌려준다. 둘을 뭉뚱그리면 NULL 함정(bonus = NULL)을 밟은
   * 사람에게 "INSERT·UPDATE 입니다" 라는 엉뚱한 말을 하게 된다.
   *   "no-rows"   — SELECT 는 돌았는데 걸린 행이 없다
   *   "no-result" — 애초에 값을 돌려주는 문장이 아니다
   */
  empty?: "no-rows" | "no-result";
}

export interface RunOutcome {
  ok: boolean;
  result?: QueryResult;
  /** 사람이 읽을 수 있게 다듬은 오류 */
  error?: string;
}

let dbPromise: Promise<SqlJsDatabase> | null = null;

/**
 * 실습용 데이터베이스.
 *
 * 매번 새로 만들면 느리므로 하나를 두고 쓴다. 대신 사용자가 UPDATE·DELETE 를
 * 연습할 수 있어야 하므로, reset() 으로 언제든 처음 상태로 되돌린다.
 */
async function getDb(): Promise<SqlJsDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = loadSqlJs().then((SQL) => {
    const db = new SQL.Database();
    db.exec(SCHEMA_SQL);
    return db;
  });
  return dbPromise;
}

/** 표를 처음 상태로 되돌린다 */
export async function reset(): Promise<void> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database();
  db.exec(SCHEMA_SQL);
  dbPromise = Promise.resolve(db);
}

/** 미리 받아 둔다 — 실습 화면에 들어올 때 부른다 */
export async function warmUp(): Promise<void> {
  await getDb();
}

/** 마지막 문장이 값을 돌려주는 문장인가 */
function isQuery(sql: string): boolean {
  const stmts = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  const last = stmts[stmts.length - 1] ?? "";
  return /^(select|with|values|pragma|explain)\b/i.test(last);
}

/** 오라클 문법으로 쓴 것을 SQLite 가 알아듣게 살짝 바꿔 준다 */
function bridge(sql: string): string {
  let out = sql;
  // NVL(a,b) → IFNULL(a,b)  · SQLite 에는 NVL 이 없다
  out = out.replace(/\bNVL\s*\(/gi, "IFNULL(");
  // SYSDATE → 오늘 날짜
  out = out.replace(/\bSYSDATE\b/gi, "DATE('now')");
  // 문자열 이어 붙이기는 둘 다 || 라 그대로 둔다
  return out;
}

/**
 * 쿼리를 돌린다.
 *
 * 여러 문장을 한 번에 보내도 되지만, 결과는 마지막으로 값을 돌려준 것을
 * 보여 준다. INSERT 처럼 돌려줄 것이 없는 문장은 빈 결과가 된다.
 */
export async function run(sql: string): Promise<RunOutcome> {
  const text = sql.trim();
  if (!text) return { ok: false, error: "쿼리를 입력해 주세요." };
  try {
    const db = await getDb();
    const res = db.exec(bridge(text));
    if (!res.length) {
      return {
        ok: true,
        result: {
          columns: [],
          rows: [],
          empty: isQuery(text) ? "no-rows" : "no-result",
        },
      };
    }
    const last = res[res.length - 1];
    return { ok: true, result: { columns: last.columns, rows: last.values } };
  } catch (e) {
    return { ok: false, error: friendly(String((e as Error).message ?? e)) };
  }
}

/**
 * SQLite 오류를 한국어로 바꾼다.
 *
 * "no such column: enmae" 만 보여 주면 무엇을 고쳐야 할지 알기 어렵다.
 * 오타인지, 없는 표인지, 문법이 틀렸는지를 갈라 준다.
 */
function friendly(msg: string): string {
  const m = msg.replace(/^Error:\s*/, "");
  let hit: string | null = null;

  const noColumn = /no such column:\s*(\S+)/i.exec(m);
  if (noColumn) hit = `'${noColumn[1]}' 이라는 열이 없습니다. 이름을 다시 보세요.`;

  const noTable = /no such table:\s*(\S+)/i.exec(m);
  if (noTable) hit = `'${noTable[1]}' 이라는 표가 없습니다. emp 와 dept 만 있습니다.`;

  const noFunc = /no such function:\s*(\S+)/i.exec(m);
  if (noFunc)
    hit = `'${noFunc[1]}' 함수를 여기서는 쓸 수 없습니다. 이 연습판은 SQLite 라 오라클 전용 함수가 없습니다.`;

  if (/syntax error/i.test(m)) {
    hit = "문법이 맞지 않습니다. 쉼표·괄호·따옴표가 짝을 이루는지 보세요.";
  }
  if (/ambiguous column name:\s*(\S+)/i.test(m)) {
    const a = /ambiguous column name:\s*(\S+)/i.exec(m)!;
    hit = `'${a[1]}' 이 두 표에 모두 있어 어느 쪽인지 알 수 없습니다. e.${a[1]} 처럼 표를 밝혀 주세요.`;
  }
  if (/misuse of aggregate/i.test(m)) {
    hit =
      "집계 함수를 쓸 수 없는 자리입니다. 집계 결과로 거르려면 WHERE 가 아니라 HAVING 에 써야 합니다.";
  }
  return hit ? `${hit}\n(원문: ${m})` : m;
}

/* ─────────────────────── 채점 ─────────────────────── */

export interface Grade {
  correct: boolean;
  /** 왜 틀렸는지 */
  hint?: string;
  mine?: QueryResult;
  expected?: QueryResult;
}

function cell(v: unknown): string {
  if (v === null || v === undefined) return "\u0000NULL";
  if (typeof v === "number") {
    // 1 과 1.0 을 같게 본다 — 나눗셈 결과가 소수로 나오는 경우가 있다
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e6) / 1e6);
  }
  return String(v).trim();
}

function rowKey(row: unknown[]): string {
  return row.map(cell).join("\u0001");
}

/**
 * 내 결과와 모범 답안의 결과를 견준다.
 *
 * 답이 하나가 아니어도 된다. 열 이름이 달라도, 조인 방식이 달라도
 * **나온 값이 같으면 맞는 것**으로 본다. 실제로 그것이 SQL 이다.
 * 다만 ORDER BY 를 요구한 문제는 행 순서까지 본다.
 */
export function compare(
  mine: QueryResult,
  expected: QueryResult,
  ordered = false,
): Grade {
  // 아무것도 안 나온 경우를 "열 개수가 0개" 로 말하면 무엇을 고칠지 알 수 없다
  if (!mine.columns.length && expected.columns.length) {
    return {
      correct: false,
      hint:
        mine.empty === "no-result"
          ? "값을 돌려주는 문장이 아닙니다. SELECT 로 결과를 내놓아야 채점할 수 있습니다."
          : `조건에 맞는 행이 하나도 없습니다 (0행). 정답은 ${expected.rows.length}행입니다 — ` +
            "조건이 지나치게 좁거나, NULL 을 = 로 비교하지 않았는지 보세요.",
      mine,
      expected,
    };
  }
  if (mine.columns.length !== expected.columns.length) {
    return {
      correct: false,
      hint: `열 개수가 다릅니다 — 정답은 ${expected.columns.length}개인데 ${mine.columns.length}개가 나왔습니다.`,
      mine,
      expected,
    };
  }
  if (mine.rows.length !== expected.rows.length) {
    return {
      correct: false,
      hint: `행 수가 다릅니다 — 정답은 ${expected.rows.length}행인데 ${mine.rows.length}행이 나왔습니다.${
        mine.rows.length > expected.rows.length
          ? " 조인 조건이 빠졌거나 중복이 생기지 않았는지 보세요."
          : " 조건이 지나치게 좁거나 NULL 이 걸러지지 않았는지 보세요."
      }`,
      mine,
      expected,
    };
  }

  if (ordered) {
    for (let i = 0; i < expected.rows.length; i++) {
      if (rowKey(mine.rows[i]) !== rowKey(expected.rows[i])) {
        return {
          correct: false,
          hint: `${i + 1}번째 행이 다릅니다. 이 문제는 순서까지 봅니다 — ORDER BY 를 확인하세요.`,
          mine,
          expected,
        };
      }
    }
    return { correct: true, mine, expected };
  }

  // 순서를 안 따지면 줄 단위로 세어서 견준다
  const count = new Map<string, number>();
  for (const r of expected.rows) {
    const k = rowKey(r);
    count.set(k, (count.get(k) ?? 0) + 1);
  }
  for (const r of mine.rows) {
    const k = rowKey(r);
    const n = count.get(k);
    if (!n) {
      const shown = r.map((v) => (v === null ? "NULL" : String(v))).join(", ");
      return {
        correct: false,
        hint: `정답에 없는 행이 있습니다 — (${shown})`,
        mine,
        expected,
      };
    }
    count.set(k, n - 1);
  }
  return { correct: true, mine, expected };
}

/** 모범 답안을 돌려 정답 결과를 얻는다 */
export async function expectedOf(answer: string): Promise<QueryResult | null> {
  const r = await run(answer);
  return r.ok && r.result ? r.result : null;
}
