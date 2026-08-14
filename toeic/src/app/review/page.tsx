"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Eye, RotateCcw, X } from "lucide-react";
import { Badge, Button, Card, EmptyState, ProgressBar } from "@/components/ui";
import { useApp } from "@/lib/store";
import { dueCards, nextDueLabel } from "@/lib/srs";
import { KIND_LABEL, itemOf } from "@/lib/items";
import { cn } from "@/lib/utils";

export default function ReviewPage() {
  return (
    <Suspense fallback={<main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>}>
      <ReviewScreen />
    </Suspense>
  );
}

function ReviewScreen() {
  const params = useSearchParams();
  const onlyWrong = params.get("only") === "wrong";

  const cards = useApp((s) => s.reviewCards);
  const wrongIds = useApp((s) => s.wrongIds);
  const reviewItem = useApp((s) => s.reviewItem);

  const queue = useMemo(() => {
    const due = dueCards(cards);
    const base = onlyWrong ? due.filter((c) => wrongIds.includes(c.sourceId)) : due;
    // 자료에서 사라진 id 는 건너뛴다 (예전에 풀었지만 지금 목표에는 없는 것)
    return base.filter((c) => itemOf(c.sourceId));
  }, [cards, wrongIds, onlyWrong]);

  const [started, setStarted] = useState(false);
  const [at, setAt] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState({ correct: 0, wrong: 0 });

  const card = queue[at];
  const item = card ? itemOf(card.sourceId) : undefined;

  const grade = (correct: boolean) => {
    if (!card) return;
    reviewItem(card.sourceId, correct);
    setDone((d) => ({
      correct: d.correct + (correct ? 1 : 0),
      wrong: d.wrong + (correct ? 0 : 1),
    }));
    setRevealed(false);
    setAt((i) => i + 1);
  };

  if (queue.length === 0) {
    return (
      <main className="py-6">
        <h1 className="text-2xl font-bold">복습</h1>
        <EmptyState
          title={onlyWrong ? "틀렸던 것이 없습니다" : "지금 복습할 것이 없습니다"}
          desc={
            onlyWrong
              ? "문제를 풀다 틀리면 여기에 모입니다."
              : "어휘를 외우거나 문법을 학습하면 복습 카드가 쌓입니다. 이미 본 것은 정해진 간격이 되면 다시 나타납니다."
          }
        />
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/vocab">
            <Button variant="ghost" className="w-full">
              어휘 보러 가기
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/grammar">
            <Button variant="ghost" className="w-full">
              문법 보러 가기
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        <UpcomingList />
      </main>
    );
  }

  if (!started) {
    return (
      <main className="py-6">
        <h1 className="text-2xl font-bold">복습</h1>
        <p className="mt-1 text-[13px] text-zinc-400">
          {onlyWrong
            ? "틀렸던 것만 다시 봅니다. 맞히면 목록에서 빠집니다."
            : "에빙하우스 간격으로 다시 꺼내 봅니다. 떠올리려 애쓰는 그 순간에 기억이 굳습니다."}
        </p>
        <Card className="mt-5">
          <p className="text-[15px] font-bold">{queue.length}장이 기다리고 있습니다</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(["vocab", "grammar", "question"] as const).map((k) => {
              const n = queue.filter((c) => itemOf(c.sourceId)?.kind === k).length;
              if (!n) return null;
              return (
                <Badge key={k}>
                  {KIND_LABEL[k]} {n}
                </Badge>
              );
            })}
          </div>
          <Button size="lg" className="mt-4 w-full" onClick={() => setStarted(true)}>
            {queue.length}장 복습 시작
            <ArrowRight size={17} />
          </Button>
        </Card>
        <UpcomingList />
      </main>
    );
  }

  if (!card || !item) {
    const total = done.correct + done.wrong;
    return (
      <main className="py-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <p className="text-[13px] font-bold text-emerald-300">복습 완료</p>
          <h1 className="mt-2 text-3xl font-bold">
            {done.correct} / {total}
          </h1>
          <p className="mt-2 text-[13px] text-zinc-400">
            {done.wrong > 0
              ? `틀린 ${done.wrong}장은 곧 다시 나타납니다`
              : "전부 맞혔습니다. 다음 간격에 다시 만나요."}
          </p>
        </motion.div>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStarted(false);
              setAt(0);
              setDone({ correct: 0, wrong: 0 });
            }}
          >
            <RotateCcw size={16} />
            남은 것 더 보기
          </Button>
          <Link href="/">
            <Button className="w-full">홈으로</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-6">
      <div className="flex items-center justify-between text-[12px] text-zinc-500">
        <span>
          {at + 1} / {queue.length}
        </span>
        <span>
          {KIND_LABEL[item.kind]} · {item.where}
        </span>
      </div>
      <ProgressBar value={at} max={queue.length} color="#10b981" className="mt-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={card.sourceId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
        >
          <Card className="mt-4 min-h-[220px]">
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  "leading-relaxed text-zinc-100",
                  item.kind === "vocab" ? "text-2xl font-bold" : "text-[16px] font-bold",
                )}
              >
                {item.front}
              </p>
              <Badge>{item.band}</Badge>
            </div>

            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-7 text-[13px] text-zinc-500 hover:bg-white/[0.03]"
              >
                <Eye size={15} />
                답 보기
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-[15px] leading-relaxed text-zinc-200">{item.back}</p>
                <Link
                  href={item.href}
                  className="mt-3 inline-flex items-center gap-1 text-[12px] text-indigo-300 hover:text-indigo-200"
                >
                  자세히 보기
                  <ArrowRight size={13} />
                </Link>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => grade(false)}>
            <X size={16} />
            아직입니다
          </Button>
          <Button className="flex-1" onClick={() => grade(true)}>
            <Check size={16} />
            알았어요
          </Button>
        </div>
      )}

      <p className="mt-4 text-center text-[11px] text-zinc-600">
        {card.lapses > 0 && `${card.lapses}번 틀림 · `}
        {card.stage}단계 · 다음 복습 {nextDueLabel(card)}
      </p>
    </main>
  );
}

/** 지금은 안 나오지만 곧 나올 것들 — 큐가 비었을 때 허전하지 않도록 */
function UpcomingList() {
  const cards = useApp((s) => s.reviewCards);
  const upcoming = useMemo(
    () =>
      [...cards]
        .filter((c) => c.nextDueAt > Date.now() && itemOf(c.sourceId))
        .sort((a, b) => a.nextDueAt - b.nextDueAt)
        .slice(0, 8),
    [cards],
  );
  if (upcoming.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-base font-bold">곧 다시 나올 것</h2>
      <div className="flex flex-col gap-2">
        {upcoming.map((c) => {
          const item = itemOf(c.sourceId)!;
          return (
            <Card key={c.sourceId}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold">{item.front}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {KIND_LABEL[item.kind]} · {c.stage}단계
                    {c.lapses > 0 && ` · ${c.lapses}번 틀림`}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-zinc-400">
                  {nextDueLabel(c)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
