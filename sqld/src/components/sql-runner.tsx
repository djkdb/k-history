"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Play, RotateCcw, Table2, WrapText } from "lucide-react";
import { Button } from "@/components/ui";
import { TABLES } from "@/data/schema";
import { formatSqlScript } from "@/lib/sql-format";
import { compare, expectedOf, reset, run, warmUp, type QueryResult } from "@/lib/sqlite";
import { cn } from "@/lib/utils";

/**
 * 쿼리를 쳐서 돌려 보는 자리.
 *
 * 채점이 붙은 실습(answer 가 있을 때)과, 그냥 돌려 보는 자리(개념 화면의
 * 곁들임 쿼리)를 같은 부품으로 다룬다.
 */
export function SqlRunner({
  initial = "",
  answer,
  ordered = false,
  onGraded,
  compact = false,
}: {
  initial?: string;
  /** 있으면 채점한다 */
  answer?: string;
  ordered?: boolean;
  onGraded?: (correct: boolean) => void;
  /** 개념 화면에 곁들일 때는 좁게 */
  compact?: boolean;
}) {
  const [sql, setSql] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [verdict, setVerdict] = useState<{ correct: boolean; hint?: string } | null>(null);
  const [expected, setExpected] = useState<QueryResult | null>(null);
  const [showSchema, setShowSchema] = useState(false);

  useEffect(() => {
    let alive = true;
    warmUp()
      .then(() => alive && setReady(true))
      .catch(() => alive && setError("SQL 엔진을 불러오지 못했습니다."));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setSql(initial);
    setResult(null);
    setVerdict(null);
    setExpected(null);
    setError(null);
  }, [initial]);

  const execute = useCallback(async () => {
    setBusy(true);
    setError(null);
    setVerdict(null);
    // 앞 문제에서 UPDATE 를 돌렸을 수 있으니 표를 처음 상태로 되돌린다
    await reset();
    const out = await run(sql);
    if (!out.ok || !out.result) {
      setError(out.error ?? "알 수 없는 오류");
      setResult(null);
      setBusy(false);
      return;
    }
    setResult(out.result);

    if (answer) {
      // 모범 답안도 같은 조건에서 돌려야 공정하다
      await reset();
      const exp = await expectedOf(answer);
      await reset();
      const again = await run(sql);
      if (exp && again.ok && again.result) {
        const g = compare(again.result, exp, ordered);
        setVerdict({ correct: g.correct, hint: g.hint });
        setExpected(exp);
        // 돌릴 때마다 알린다. 몇 번째 시도를 기록에 넣을지는 화면이 정한다
        // (여기서 한 번만 알리면, 틀린 뒤 고쳐 맞혀도 영영 반영되지 않는다).
        onGraded?.(g.correct);
      }
    }
    setBusy(false);
  }, [sql, answer, ordered, onGraded]);

  return (
    <div className={cn("flex flex-col", compact ? "gap-2" : "gap-3")}>
      <div className="sql-surface overflow-hidden rounded-xl border border-white/12">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          rows={compact ? 4 : 6}
          placeholder="SELECT * FROM emp;"
          className="mono w-full resize-y bg-transparent px-3.5 py-3 text-[13.5px] leading-[1.7] text-zinc-100 outline-none placeholder:text-zinc-600"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={execute} disabled={!ready || busy} className="flex-1">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
          {ready ? "실행하기" : "SQL 엔진 준비 중…"}
        </Button>
        {/*
          한 줄로 길게 친 쿼리를 시험지 모양으로 벌려 준다.
          좁은 화면에서 한 줄짜리는 아무 데서나 접혀 어디가 절의 시작인지
          알아볼 수가 없다. 시험지는 절마다 줄을 바꿔 싣는다.
        */}
        <Button
          variant="ghost"
          onClick={() => setSql((v) => formatSqlScript(v))}
          disabled={!sql.trim() || sql.includes("\n")}
          aria-label="절마다 줄 바꿔 정리하기"
        >
          <WrapText size={15} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowSchema((v) => !v)}
          aria-label="표 구조 보기"
        >
          <Table2 size={15} />
        </Button>
        {initial && (
          <Button variant="ghost" onClick={() => setSql(initial)} aria-label="처음으로">
            <RotateCcw size={15} />
          </Button>
        )}
      </div>

      {showSchema && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
          {TABLES.map((t) => (
            <div key={t.name} className="mb-3 last:mb-0">
              <p className="mono text-[13px] font-bold text-indigo-200">{t.name}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{t.note}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {t.columns.map((c) => (
                  <span
                    key={c.name}
                    title={c.note}
                    className="mono rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-300"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-300" />
            <p className="mono whitespace-pre-wrap text-[12.5px] leading-relaxed text-red-200">
              {error}
            </p>
          </div>
        </motion.div>
      )}

      {result && !error && <ResultTable result={result} />}

      {verdict && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          // 채점 결과를 글자가 아니라 표시로도 남긴다 — 화면 어딘가에
          // "정답입니다" 라는 설명 문장이 있어도 헷갈리지 않는다
          data-verdict={verdict.correct ? "correct" : "wrong"}
          className={cn(
            "rounded-xl border p-3.5",
            verdict.correct
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-red-500/30 bg-red-500/10",
          )}
        >
          <p
            className={cn(
              "text-[13px] font-bold",
              verdict.correct ? "text-emerald-300" : "text-red-300",
            )}
          >
            {verdict.correct ? "정답입니다" : "결과가 다릅니다"}
          </p>
          {verdict.hint && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">{verdict.hint}</p>
          )}
          {!verdict.correct && expected && (
            <details className="mt-2.5">
              <summary className="cursor-pointer text-[12px] text-zinc-400 hover:text-zinc-200">
                정답이 내놓는 결과 보기
              </summary>
              <div className="mt-2">
                <ResultTable result={expected} />
              </div>
            </details>
          )}
        </motion.div>
      )}
    </div>
  );
}

/** 결과 표 — 가로로 길면 그 안에서만 넘긴다 (화면 전체가 밀리지 않게) */
export function ResultTable({ result }: { result: QueryResult }) {
  if (!result.columns.length) {
    // 0행짜리 SELECT 를 "INSERT·UPDATE 입니다" 로 말하면, 조건을 고쳐야 할
    // 사람이 문장 종류를 의심하게 된다. NULL 함정에서 늘 여기로 온다.
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-[12.5px] leading-relaxed text-zinc-400">
        {result.empty === "no-result"
          ? "돌려줄 결과가 없는 문장입니다 (INSERT·UPDATE 등). SELECT 로 확인해 보세요."
          : "조건에 맞는 행이 하나도 없습니다 (0행). 문장은 제대로 돌았으니 조건을 다시 보세요 — NULL 은 = 로 비교할 수 없습니다."}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
      <table className="mono w-full min-w-max text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/10">
            {result.columns.map((c, i) => (
              <th key={i} className="whitespace-nowrap px-3 py-2 font-bold text-indigo-200">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.05] last:border-0">
              {row.map((v, j) => (
                <td
                  key={j}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5",
                    v === null ? "text-zinc-600 italic" : "text-zinc-200",
                  )}
                >
                  {v === null ? "NULL" : String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-white/[0.07] px-3 py-1.5 text-[11px] text-zinc-500">
        {result.rows.length}행
      </p>
    </div>
  );
}
