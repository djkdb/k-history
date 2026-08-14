"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronRight, Quote } from "lucide-react";
import { Badge, Button, Card, Chip, EmptyState } from "@/components/ui";
import { DOC_LABEL, SKILL_LABEL, readingFor } from "@/data/reading";
import { PART_MAP, READING_PARTS } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import type { Passage, ReadingSet } from "@/lib/types";
import { letterOf } from "@/lib/tts";
import { cn } from "@/lib/utils";

export function PartPractice({ part }: { part: 5 | 6 | 7 }) {
  return (
    <Suspense fallback={<main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>}>
      <Screen part={part} />
    </Suspense>
  );
}

function Screen({ part }: { part: 5 | 6 | 7 }) {
  const params = useSearchParams();
  const band = useBand();
  const sets = useMemo(() => readingFor(band, part), [band, part]);
  const [at, setAt] = useState(0);

  const wanted = params.get("set");
  useEffect(() => {
    if (!wanted) return;
    const i = sets.findIndex((s) => s.id === wanted);
    if (i >= 0) setAt(i);
  }, [wanted, sets]);

  useEffect(() => setAt(0), [part, band]);

  const info = PART_MAP[part];
  const current = sets[Math.min(at, Math.max(0, sets.length - 1))];

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">읽기 훈련</h1>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {READING_PARTS.map((p) => (
            <Link key={p.id} href={`/part/${p.id}`}>
              <Chip active={p.id === part}>
                Part {p.id} · {p.name}
              </Chip>
            </Link>
          ))}
        </div>
      </header>

      <Card className="mt-4">
        <p className="text-[14px] leading-relaxed text-zinc-200">{info.summary}</p>
        <div className="mt-3 flex items-start gap-2.5 border-t border-white/[0.07] pt-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
          <p className="text-[12px] leading-relaxed text-zinc-400">{info.trap}</p>
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          실제 시험에서는 {info.count}문항이 나옵니다.
        </p>
      </Card>

      {!current ? (
        <EmptyState
          title="이 파트의 문항이 아직 없습니다"
          desc="목표 점수대를 올리면 더 나올 수 있습니다."
        />
      ) : (
        <>
          <div className="mt-5 flex items-center justify-between text-[12px] text-zinc-500">
            <span>
              {at + 1} / {sets.length}
            </span>
            {current.docType && <span>{DOC_LABEL[current.docType] ?? current.docType}</span>}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <ReadingSetView set={current} />
            </motion.div>
          </AnimatePresence>

          {at < sets.length - 1 && (
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={() => {
                setAt((i) => i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              다음
              <ChevronRight size={17} />
            </Button>
          )}
        </>
      )}
    </main>
  );
}

function ReadingSetView({ set }: { set: ReadingSet }) {
  const record = useApp((s) => s.recordAnswer);
  const [picked, setPicked] = useState<Record<string, number>>({});

  useEffect(() => setPicked({}), [set.id]);

  const choose = (qid: string, i: number, answer: number) => {
    if (picked[qid] !== undefined) return;
    setPicked((p) => ({ ...p, [qid]: i }));
    record(qid, i === answer);
  };

  return (
    <div className="mt-2">
      {set.passage?.map((p, i) => (
        <PassageView key={i} passage={p} answered={picked} set={set} />
      ))}

      <div className={cn("flex flex-col gap-3", set.passage && "mt-4")}>
        {set.questions.map((q) => {
          const chosen = picked[q.id];
          const show = chosen !== undefined;
          return (
            <Card key={q.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] leading-relaxed text-zinc-100">
                  {q.blank !== undefined && (
                    <span className="mr-1.5 rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[12px] font-bold text-indigo-200">
                      빈칸 {q.blank}
                    </span>
                  )}
                  {q.prompt ??
                    (q.skill === "sentence"
                      ? "이 자리에 들어갈 문장으로 가장 알맞은 것은?"
                      : "빈칸에 들어갈 말로 가장 알맞은 것은?")}
                </p>
                <Badge>{SKILL_LABEL[q.skill] ?? q.skill}</Badge>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {q.choices.map((c, i) => {
                  const isAnswer = i === q.answer;
                  const isChosen = chosen === i;
                  return (
                    <button
                      key={i}
                      onClick={() => choose(q.id, i, q.answer)}
                      disabled={show}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition-all",
                        !show && "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                        show && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                        show && isChosen && !isAnswer && "border-rose-500/40 bg-rose-500/10",
                        show && !isAnswer && !isChosen && "border-white/[0.07] opacity-50",
                      )}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
                        {letterOf(i)}
                      </span>
                      <span className="min-w-0 flex-1">{c.text}</span>
                    </button>
                  );
                })}
              </div>

              {show && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 border-t border-white/[0.07] pt-3"
                >
                  <p
                    className={cn(
                      "text-[13px] font-bold",
                      chosen === q.answer ? "text-emerald-300" : "text-rose-300",
                    )}
                  >
                    {chosen === q.answer ? "정답입니다" : "다시 봅시다"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                    <span className="font-bold text-zinc-200">{letterOf(chosen)}</span>{" "}
                    {q.choices[chosen].why}
                  </p>
                  {chosen !== q.answer && (
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                      <span className="font-bold text-emerald-300">
                        {letterOf(q.answer)}
                      </span>{" "}
                      {q.choices[q.answer].why}
                    </p>
                  )}
                  {q.evidence && (
                    <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <Quote size={13} className="mt-0.5 shrink-0 text-zinc-500" />
                      <p className="text-[12px] leading-relaxed text-zinc-400">
                        {q.evidence}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 지문.
 *
 * Part 6 은 본문에 [[1]] 처럼 빈칸이 박혀 있다. 아직 안 푼 빈칸은 밑줄로,
 * 푼 빈칸은 고른 답을 그 자리에 넣어 보여 준다 — 넣고 다시 읽어야 맞는지
 * 감이 온다.
 */
function PassageView({
  passage,
  answered,
  set,
}: {
  passage: Passage;
  answered: Record<string, number>;
  set: ReadingSet;
}) {
  const filled = (n: number) => {
    const q = set.questions.find((x) => x.blank === n);
    if (!q) return null;
    const picked = answered[q.id];
    if (picked === undefined) return null;
    return q.choices[picked]?.text ?? null;
  };

  return (
    <Card className="mt-3">
      {passage.header && passage.header.length > 0 && (
        <div className="mb-3 flex flex-col gap-1 border-b border-white/[0.07] pb-3">
          {passage.header.map((h, i) => (
            <div key={i} className="flex gap-2 text-[12px]">
              {h.label && (
                <span className="w-16 shrink-0 font-bold text-zinc-500">{h.label}</span>
              )}
              <span className="text-zinc-300">{h.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3 whitespace-pre-wrap text-[14.5px] leading-[1.9] text-zinc-200">
        {passage.body.split(/\n{2,}/).map((para, i) => (
          <p key={i}>
            {para.split(/(\[\[\d+\]\])/).map((chunk, j) => {
              const m = /^\[\[(\d+)\]\]$/.exec(chunk);
              if (!m) return <span key={j}>{chunk}</span>;
              const n = Number(m[1]);
              const text = filled(n);
              return (
                <span
                  key={j}
                  className={cn(
                    "mx-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[13px] font-bold",
                    text
                      ? "bg-indigo-500/20 text-indigo-100"
                      : "bg-white/10 text-zinc-400",
                  )}
                >
                  {text ?? `___ ${n}`}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </Card>
  );
}
