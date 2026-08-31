"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Eye,
  Lightbulb,
  Target,
  X,
} from "lucide-react";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { CATEGORY_LABEL, GRAMMAR_MAP } from "@/data/grammar";
import { setsLinkedTo } from "@/data/reading";
import { useApp } from "@/lib/store";
import type { ReadingQuestion, ReadingSet } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GrammarDetail({ id }: { id: string }) {
  const point = GRAMMAR_MAP[id];
  const studied = useApp((s) => s.studiedGrammarIds);
  const markStudied = useApp((s) => s.markGrammarStudied);
  const [checkOpen, setCheckOpen] = useState(false);

  // 이 문법을 겨냥한 문항을 그대로 붙여 준다 — 배운 자리에서 바로 확인한다
  const checks = useMemo(() => {
    if (!point) return [];
    const out: { set: ReadingSet; q: ReadingQuestion }[] = [];
    for (const set of setsLinkedTo(point.id)) {
      for (const q of set.questions) out.push({ set, q });
    }
    return out;
  }, [point]);

  if (!point) {
    return (
      <main className="py-6">
        <EmptyState title="없는 항목입니다" desc="문법 목록에서 다시 골라 주세요." />
        <Link href="/grammar">
          <Button variant="ghost" className="mt-4 w-full">
            문법 목록으로
          </Button>
        </Link>
      </main>
    );
  }

  const done = studied.includes(point.id);

  return (
    <main className="py-6">
      <Link
        href="/grammar"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-[13px] text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        문법
      </Link>

      <header className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-emerald-300">
            {CATEGORY_LABEL[point.category]}
          </span>
          <Badge>{point.band}</Badge>
        </div>
        <h1 className="mt-1.5 text-2xl font-bold leading-snug">{point.title}</h1>
        <p className="mt-3 text-[15px] font-bold leading-relaxed text-indigo-200">
          {point.summary}
        </p>
      </header>

      <Card className="mt-5">
        <p className="text-[15px] leading-[1.9] text-zinc-200">{point.detail}</p>
      </Card>

      <Card className="mt-3">
        <div className="flex items-start gap-2.5">
          <Target size={16} className="mt-0.5 shrink-0 text-sky-300" />
          <div>
            <p className="text-[12px] font-bold text-sky-200">시험지에서는 이렇게 나온다</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-300">
              {point.examShape}
            </p>
          </div>
        </div>
      </Card>

      {point.shortcut && (
        <Card className="mt-3 border-amber-500/25 bg-amber-500/[0.07]">
          <div className="flex items-start gap-2.5">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <p className="text-[12px] font-bold text-amber-200">빠르게 푸는 법</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-200">
                {point.shortcut}
              </p>
            </div>
          </div>
        </Card>
      )}

      {point.trap && (
        <Card className="mt-3 border-rose-500/25 bg-rose-500/[0.07]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-300" />
            <div>
              <p className="text-[12px] font-bold text-rose-200">이렇게 틀린다</p>
              <p className="mt-1.5 text-[14px] font-bold leading-relaxed text-zinc-100">
                {point.trap.wrong}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                {point.trap.why}
              </p>
            </div>
          </div>
        </Card>
      )}

      <h2 className="mb-3 mt-8 text-base font-bold">예문</h2>
      <div className="flex flex-col gap-2.5">
        {point.examples.map((ex, i) => (
          <Card key={i}>
            <div className="flex items-start gap-2">
              <Check size={15} className="mt-1 shrink-0 text-emerald-400" />
              <p className="text-[14px] leading-relaxed text-zinc-100">{ex.correct}</p>
            </div>
            {ex.incorrect && (
              <div className="mt-2 flex items-start gap-2">
                <X size={15} className="mt-1 shrink-0 text-rose-400" />
                <p className="text-[14px] leading-relaxed text-zinc-500 line-through decoration-rose-500/40">
                  {ex.incorrect}
                </p>
              </div>
            )}
            <p className="mt-2.5 border-t border-white/[0.07] pt-2.5 text-[12px] leading-relaxed text-zinc-400">
              {ex.ko}
            </p>
          </Card>
        ))}
      </div>

      {checks.length > 0 && (
        <section id="check" className="mt-8">
          <h2 className="mb-3 text-base font-bold">확인 문제</h2>
          {!checkOpen ? (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setCheckOpen(true);
                setTimeout(
                  () =>
                    document
                      .getElementById("check")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                  60,
                );
              }}
            >
              <Eye size={16} />
              가리고 풀어 보기 ({checks.length}문항)
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              {checks.map(({ q }) => (
                <CheckQuestion key={q.id} q={q} onCorrect={() => markStudied(point.id)} />
              ))}
            </div>
          )}
        </section>
      )}

      <Button
        variant={done ? "outline" : "primary"}
        size="lg"
        className="mt-8 w-full"
        onClick={() => markStudied(point.id)}
        disabled={done}
      >
        <Check size={17} />
        {done ? "복습에 들어가 있습니다" : "이해했습니다 — 복습에 넣기"}
      </Button>
      <p className="mt-2 text-center text-[11px] text-zinc-600">
        넣어 두면 오늘 · 1일 · 3일 · 7일 · 14일 · 30일 간격으로 다시 물어봅니다
      </p>
    </main>
  );
}

function CheckQuestion({ q, onCorrect }: { q: ReadingQuestion; onCorrect: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const record = useApp((s) => s.recordAnswer);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    record(q.id, i === q.answer);
    if (i === q.answer) onCorrect();
  };

  return (
    <Card>
      <p className="text-[15px] leading-relaxed text-zinc-100">{q.prompt}</p>
      <div className="mt-3 flex flex-col gap-2">
        {q.choices.map((c, i) => {
          const isAnswer = i === q.answer;
          const chosen = picked === i;
          const show = picked !== null;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={show}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition-all",
                !show && "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                show && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                show && chosen && !isAnswer && "border-rose-500/40 bg-rose-500/10",
                show && !isAnswer && !chosen && "border-white/[0.07] opacity-50",
              )}
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="min-w-0 flex-1">{c.text}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          <p
            className={cn(
              "text-[13px] font-bold",
              picked === q.answer ? "text-emerald-300" : "text-rose-300",
            )}
          >
            {picked === q.answer ? "정답입니다" : "다시 봅시다"}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
            {q.choices[picked].why}
          </p>
          {picked !== q.answer && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
              <span className="font-bold text-zinc-200">
                {String.fromCharCode(65 + q.answer)}
              </span>{" "}
              {q.choices[q.answer].why}
            </p>
          )}
        </motion.div>
      )}
    </Card>
  );
}
