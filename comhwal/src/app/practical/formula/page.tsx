"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Lightbulb,
  RotateCcw,
  X,
} from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import type { FormulaTask } from "@/lib/types";
import { formulasFor, formulaTopics } from "@/data/formulas";
import { gradeFormula, type FormulaGrade } from "@/lib/grade-formula";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
} from "@/components/ui";
import { cn, shuffleSeeded } from "@/lib/utils";

export default function FormulaTrainerPage() {
  const grade = useGrade();
  const clearedIds = useApp((s) => s.clearedFormulaIds);
  const recordPractice = useApp((s) => s.recordPractice);

  const [topic, setTopic] = useState<string | null>(null);
  const [tasks, setTasks] = useState<FormulaTask[] | null>(null);
  const [at, setAt] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<FormulaGrade | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ tried: 0, correct: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const pool = useMemo(
    () => formulasFor(grade, topic ?? undefined),
    [grade, topic],
  );
  const topics = formulaTopics(grade);

  const start = () => {
    setTasks(shuffleSeeded(pool, Date.now() % 100000));
    setAt(0);
    setInput("");
    setResult(null);
    setRevealed(false);
    setScore({ tried: 0, correct: 0 });
  };

  // ── 설정 화면 ────────────────────────────────────────────────
  if (!tasks) {
    const done = pool.filter((f) => clearedIds.includes(f.id)).length;
    return (
      <div className="pt-6">
        <Link
          href="/practical"
          className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft size={15} />
          실기 훈련
        </Link>

        <h1 className="mt-3 text-xl font-bold tracking-tight">함수 수식 채점</h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
          조건을 읽고 수식을 직접 칩니다. 틀리면 어디가 어긋났는지 짚어 드립니다.
        </p>

        <ScrollRow className="mt-5">
          <Chip active={topic === null} onClick={() => setTopic(null)}>
            전체 {formulasFor(grade).length}
          </Chip>
          {topics.map((t) => (
            <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
              {t}
            </Chip>
          ))}
        </ScrollRow>

        <Card className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">이 갈래에서 맞힌 문제</span>
            <span className="font-bold text-emerald-400">
              {done} / {pool.length}
            </span>
          </div>
          <ProgressBar
            value={done}
            max={pool.length}
            color="#10b981"
            className="mt-3"
          />
        </Card>

        <Card className="mt-3">
          <p className="text-[13px] font-bold">채점 기준</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-relaxed text-zinc-400">
            <li>· 공백, 대소문자, 맨 앞의 등호는 있으나 없으나 같게 봅니다</li>
            <li>· $의 위치와 인수 순서는 결과를 바꾸므로 그대로 채점합니다</li>
            <li>· 같은 뜻의 다른 함수(SUMPRODUCT 등)도 정답으로 인정합니다</li>
          </ul>
        </Card>

        {pool.length === 0 ? (
          <EmptyState icon="📭" title="이 갈래에 문제가 없습니다" />
        ) : (
          <Button size="lg" className="mt-6 w-full" onClick={start}>
            시작하기
            <ArrowRight size={17} />
          </Button>
        )}
      </div>
    );
  }

  // ── 결과 화면 ────────────────────────────────────────────────
  if (at >= tasks.length) {
    return (
      <div className="pt-8 text-center">
        <p className="text-sm text-zinc-400">훈련 완료</p>
        <p className="mt-2 text-5xl font-bold tracking-tight">
          {score.tried ? Math.round((score.correct / score.tried) * 100) : 0}%
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          {score.tried}문항 중 {score.correct}문항 정답
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setTasks(null)}>
            <RotateCcw size={15} />
            갈래 바꾸기
          </Button>
          <Button onClick={start}>
            한 번 더
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    );
  }

  // ── 풀이 화면 ────────────────────────────────────────────────
  const task = tasks[at];

  const submit = () => {
    if (result?.correct) return;
    const g = gradeFormula(input, task);
    setResult(g);
    // 정답을 본 뒤 맞힌 것은 기록에 넣지 않는다 — 손이 기억한 것이 아니다
    if (!revealed) {
      recordPractice("formula", task.id, g.correct);
      setScore((s) => ({
        tried: s.tried + 1,
        correct: s.correct + (g.correct ? 1 : 0),
      }));
    }
  };

  const next = () => {
    setAt(at + 1);
    setInput("");
    setResult(null);
    setRevealed(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          {at + 1} / {tasks.length}
        </span>
        <button
          type="button"
          onClick={() => setTasks(null)}
          className="hover:text-zinc-200"
        >
          그만두기
        </button>
      </div>
      <ProgressBar value={at} max={tasks.length} color="#10b981" className="mt-2" />

      <div className="mt-5 flex items-center gap-1.5">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
          {task.topic}
        </span>
        <ImportanceBadge importance={task.importance} compact />
      </div>

      <p className="mt-3 text-[16px] font-bold leading-[1.7]">{task.prompt}</p>

      {task.sample && (
        <div className="no-scrollbar mt-4 overflow-x-auto">
          <table className="cmp-table">
            <thead>
              <tr>
                {task.sample.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {task.sample.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className="mono">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 입력 */}
      <div
        className={cn(
          "mt-5 rounded-2xl border p-3.5 transition-colors",
          result?.correct
            ? "border-emerald-500/40 bg-emerald-500/[0.07]"
            : result
              ? "border-red-500/40 bg-red-500/[0.07]"
              : "border-white/12 bg-white/[0.03]",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="mono shrink-0 text-zinc-500">fx</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                result ? next() : submit();
              }
            }}
            readOnly={result?.correct}
            placeholder="=SUM(A1:A10)"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="mono w-full bg-transparent text-[15px] outline-none placeholder:text-zinc-600"
          />
          {result &&
            (result.correct ? (
              <Check size={17} className="shrink-0 text-emerald-400" />
            ) : (
              <X size={17} className="shrink-0 text-red-400" />
            ))}
        </div>
      </div>

      {/* 채점 결과 */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {result.correct ? (
            <Card className="mt-3 border-emerald-500/25 bg-emerald-500/[0.07]">
              <p className="text-[13px] font-bold text-emerald-200">정답입니다</p>
              <p className="mt-1.5 text-[14px] leading-[1.85] text-zinc-300">
                {task.explanation}
              </p>
              {task.trap && (
                <p className="mt-2.5 flex items-start gap-1.5 text-[13px] leading-relaxed text-amber-300">
                  <Lightbulb size={14} className="mt-0.5 shrink-0" />
                  {task.trap}
                </p>
              )}
            </Card>
          ) : (
            <Card className="mt-3 border-red-500/25 bg-red-500/[0.07]">
              <p className="text-[13px] font-bold text-red-200">{result.hint}</p>
              <p className="mono mt-2 text-[13px] text-zinc-400">
                내 수식 {result.normalized}
              </p>
            </Card>
          )}
        </motion.div>
      )}

      {/* 정답 보기 */}
      {revealed && !result?.correct && (
        <Card className="mt-3">
          <p className="text-[11px] text-zinc-500">모범 수식</p>
          <p className="mono mt-1 text-[15px] font-bold">{task.answer}</p>
          {task.alternatives?.length ? (
            <p className="mono mt-2 text-[12px] text-zinc-500">
              이것도 정답 {task.alternatives.join("  ·  ")}
            </p>
          ) : null}
          <p className="mt-2.5 text-[14px] leading-[1.85] text-zinc-300">
            {task.explanation}
          </p>
        </Card>
      )}

      <div className="mt-5 flex gap-2">
        {!result?.correct && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setRevealed(true)}
            disabled={revealed}
          >
            <Eye size={15} />
            정답 보기
          </Button>
        )}
        {result || revealed ? (
          <Button className="flex-1" onClick={next}>
            {at + 1 >= tasks.length ? "결과 보기" : "다음"}
            <ArrowRight size={15} />
          </Button>
        ) : (
          <Button className="flex-1" onClick={submit} disabled={!input.trim()}>
            채점하기
          </Button>
        )}
      </div>

      {!result && !revealed && (
        <p className="mt-3 text-center text-[11px] text-zinc-600">
          Enter로도 채점됩니다
        </p>
      )}
    </div>
  );
}
