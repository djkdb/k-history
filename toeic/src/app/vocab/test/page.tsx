"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ListChecks,
  RotateCcw,
  Target,
} from "lucide-react";
import { Badge, Button, Card, Chip, EmptyState, ProgressBar } from "@/components/ui";
import { TOPIC_LABEL, VOCAB_MAP, vocabFor } from "@/data/vocab";
import { BAND_LABEL } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import {
  BLANK,
  KIND_LABEL,
  buildVocabQuiz,
  type VocabQuizQuestion,
} from "@/lib/vocab-quiz";
import { letterOf } from "@/lib/tts";
import { cn } from "@/lib/utils";

type Scope = "all" | "todo" | "known" | "wrong";
type Phase = "setup" | "running" | "done";

const SCOPE_LABEL: Record<Scope, string> = {
  all: "전체",
  todo: "안 외운 것",
  known: "외운 것",
  wrong: "틀린 것",
};

const COUNTS = [10, 20, 30] as const;

/**
 * 어휘 시험.
 *
 * 카드를 넘기는 것과 시험을 보는 것은 다른 공부다. 카드는 뜻을 보고
 * "알아" 하고 넘어가게 되지만, 시험은 떠오르지 않으면 그 자리에서 막힌다.
 * 막히는 자리를 만들려고 있는 화면이다.
 *
 * 결과는 복습 카드(reviewItem)로 넘긴다 — 틀린 낱말은 오늘 · 1일 · 3일
 * 간격으로 다시 올라온다.
 */
export default function VocabTestPage() {
  const band = useBand();
  const known = useApp((s) => s.knownVocabIds);
  const wrongIds = useApp((s) => s.wrongIds);
  const reviewItem = useApp((s) => s.reviewItem);

  const all = useMemo(() => vocabFor(band), [band]);
  const [scope, setScope] = useState<Scope>("all");
  const [count, setCount] = useState<(typeof COUNTS)[number]>(10);
  const [phase, setPhase] = useState<Phase>("setup");
  const [paper, setPaper] = useState<VocabQuizQuestion[]>([]);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const pool = useMemo(() => {
    if (scope === "todo") return all.filter((v) => !known.includes(v.id));
    if (scope === "known") return all.filter((v) => known.includes(v.id));
    if (scope === "wrong") return all.filter((v) => wrongIds.includes(v.id));
    return all;
  }, [all, known, scope, wrongIds]);

  const start = () => {
    // 시험지는 볼 때마다 달라야 한다 — 같은 시험지를 두 번 받으면 답을 외운다
    const made = buildVocabQuiz(pool, count, Math.floor(Date.now() / 1000));
    if (!made.length) return;
    setPaper(made);
    setAt(0);
    setPicked(null);
    setWrong([]);
    setScore(0);
    setPhase("running");
  };

  const current = paper[at];

  const choose = (i: number) => {
    if (picked !== null || !current) return;
    setPicked(i);
    const ok = i === current.answer;
    if (ok) setScore((s) => s + 1);
    else setWrong((w) => [...w, current.id]);
    reviewItem(current.id, ok);
  };

  const next = () => {
    if (at >= paper.length - 1) {
      setPhase("done");
      return;
    }
    setAt((i) => i + 1);
    setPicked(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (phase === "setup") setPaper([]);
  }, [phase]);

  if (phase === "running" && current) {
    return (
      <main className="py-6">
        <div className="flex items-center justify-between text-[12px] text-zinc-500">
          <span>
            {at + 1} / {paper.length}
          </span>
          <span>맞힌 것 {score}</span>
        </div>
        <ProgressBar value={at} max={paper.length} color="#6366f1" className="mt-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${current.kind}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <Card className="mt-4">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "leading-relaxed text-zinc-100",
                    current.kind === "blank" ? "text-[16px]" : "text-[22px] font-bold",
                  )}
                >
                  {current.kind === "blank"
                    ? current.prompt.split(BLANK).map((chunk, i, arr) => (
                        <span key={i}>
                          {chunk}
                          {i < arr.length - 1 && (
                            <span className="mx-1 rounded-md bg-indigo-500/20 px-2 py-0.5 font-bold text-indigo-200">
                              {BLANK}
                            </span>
                          )}
                        </span>
                      ))
                    : current.prompt}
                </p>
                <Badge>{KIND_LABEL[current.kind]}</Badge>
              </div>
              {current.sub && (
                <p className="mt-2 text-[12px] text-zinc-500">{current.sub}</p>
              )}

              <div className="mt-4 flex flex-col gap-2">
                {current.choices.map((c, i) => {
                  const isAnswer = i === current.answer;
                  const isChosen = picked === i;
                  const show = picked !== null;
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={show}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[15px] transition-all",
                        !show && "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                        show && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                        show && isChosen && !isAnswer && "border-rose-500/40 bg-rose-500/10",
                        show && !isAnswer && !isChosen && "border-white/[0.07] opacity-50",
                      )}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
                        {letterOf(i)}
                      </span>
                      <span className="min-w-0 flex-1">{c}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {picked !== null && <Explain id={current.id} correct={picked === current.answer} />}

        {picked !== null && (
          <Button size="lg" className="mt-3 w-full" onClick={next}>
            {at >= paper.length - 1 ? "채점 결과 보기" : "다음"}
            <ChevronRight size={17} />
          </Button>
        )}
      </main>
    );
  }

  if (phase === "done") {
    const pct = paper.length ? Math.round((score / paper.length) * 100) : 0;
    return (
      <main className="py-6">
        <h1 className="text-2xl font-bold">채점 결과</h1>
        <Card className="mt-4 text-center">
          <p className="text-[13px] text-zinc-400">
            {paper.length}문항 중 {score}문항
          </p>
          <p
            className={cn(
              "mt-1 text-4xl font-bold",
              pct >= 80 ? "text-emerald-300" : pct >= 60 ? "text-amber-300" : "text-rose-300",
            )}
          >
            {pct}점
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">
            틀린 낱말은 복습에 넣어 두었습니다. 오늘 · 1일 · 3일 · 7일 간격으로 다시
            물어봅니다.
          </p>
        </Card>

        {wrong.length > 0 && (
          <>
            <p className="mt-5 text-[13px] font-bold text-zinc-300">
              틀린 낱말 {wrong.length}개
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {wrong.map((id) => {
                const v = VOCAB_MAP[id];
                if (!v) return null;
                return (
                  <Link key={id} href={`/vocab?word=${id}`}>
                    <Card>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[15px] font-bold">{v.word}</p>
                          <p className="mt-0.5 text-[13px] text-zinc-400">{v.meaning}</p>
                        </div>
                        <ArrowRight size={16} className="shrink-0 text-zinc-500" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-5 flex gap-2">
          <Button className="flex-1" onClick={start}>
            <RotateCcw size={16} />
            한 벌 더
          </Button>
          <Button variant="ghost" className="flex-1" onClick={() => setPhase("setup")}>
            범위 바꾸기
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">어휘 시험</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
          카드를 넘길 때는 다 아는 것 같습니다. 뜻만 주고 낱말을 떠올려 보면 그때
          갈립니다. {BAND_LABEL[band]} 기준으로 냅니다.
        </p>
      </header>

      <Card className="mt-4">
        <p className="flex items-center gap-2 text-[13px] font-bold">
          <Target size={15} className="text-indigo-300" />
          어디서 낼까요
        </p>
        <div className="-mx-1 mt-3 flex flex-wrap gap-2 px-1">
          {(Object.keys(SCOPE_LABEL) as Scope[]).map((s) => {
            const n =
              s === "todo"
                ? all.filter((v) => !known.includes(v.id)).length
                : s === "known"
                  ? all.filter((v) => known.includes(v.id)).length
                  : s === "wrong"
                    ? all.filter((v) => wrongIds.includes(v.id)).length
                    : all.length;
            return (
              <Chip key={s} active={scope === s} onClick={() => setScope(s)}>
                {SCOPE_LABEL[s]} {n}
              </Chip>
            );
          })}
        </div>

        <p className="mt-4 flex items-center gap-2 text-[13px] font-bold">
          <ListChecks size={15} className="text-indigo-300" />몇 문항
        </p>
        <div className="mt-3 flex gap-2">
          {COUNTS.map((c) => (
            <Chip key={c} active={count === c} onClick={() => setCount(c)}>
              {c}문항
            </Chip>
          ))}
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-zinc-500">
          뜻 고르기 · 단어 고르기 · 빈칸 채우기를 섞어 냅니다. 빈칸 문제는 Part 5 와
          같은 모양입니다.
        </p>

        {pool.length < 4 ? (
          <EmptyState
            title="낼 수 있는 낱말이 모자랍니다"
            desc="범위를 넓히거나 어휘를 좀 더 본 뒤에 오세요."
          />
        ) : (
          <Button size="lg" className="mt-4 w-full" onClick={start}>
            <Check size={17} />
            {Math.min(count, pool.length)}문항 시작
          </Button>
        )}
      </Card>

      <Link href="/vocab">
        <Button variant="ghost" className="mt-3 w-full">
          어휘 카드로 돌아가기
        </Button>
      </Link>
    </main>
  );
}

/** 채점 뒤에 붙는 풀이 — 그 낱말의 뜻·예문·헷갈리는 짝을 그 자리에서 보여 준다 */
function Explain({ id, correct }: { id: string; correct: boolean }) {
  const v = VOCAB_MAP[id];
  if (!v) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mt-3">
        <p
          className={cn(
            "text-[13px] font-bold",
            correct ? "text-emerald-300" : "text-rose-300",
          )}
        >
          {correct ? "정답입니다" : "이 낱말은 다시 봅시다"}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-[19px] font-bold">{v.word}</span>
          <span className="text-[12px] text-zinc-500">{v.pos}</span>
          <span className="text-[15px] font-bold text-indigo-200">{v.meaning}</span>
          <span className="text-[11px] text-zinc-600">{TOPIC_LABEL[v.topic]}</span>
        </div>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
          <p className="text-[14px] leading-relaxed text-zinc-200">{v.example}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">{v.exampleKo}</p>
        </div>
        {v.confusable && (
          <p className="mt-2.5 text-[12px] leading-relaxed text-zinc-400">
            <b className="text-rose-200">{v.confusable.word}</b> ({v.confusable.meaning}) —{" "}
            {v.confusable.difference}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
