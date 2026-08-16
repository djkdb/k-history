"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Eye, RotateCcw, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { CONCEPT_MAP } from "@/data/concepts";
import { SQL_TASKS } from "@/data/sql-tasks";
import { dueCards, nextDueLabel, retentionRate } from "@/lib/srs";
import {
  Button,
  Card,
  EmptyState,
  ProgressBar,
  SectionTitle,
  SqlBlock,
  StatCard,
} from "@/components/ui";

const TASK_MAP = Object.fromEntries(SQL_TASKS.map((t) => [t.id, t]));

/** 복습 카드 하나가 가리키는 것 — 개념일 수도, SQL 실습일 수도 있다 */
type Item = {
  id: string;
  kind: "concept" | "task";
  front: string;
  back: string;
  extra?: string;
  href: string;
};

function resolve(sourceId: string): Item | null {
  const c = CONCEPT_MAP[sourceId];
  if (c) {
    return {
      id: c.id,
      kind: "concept",
      front: c.title,
      back: c.summary,
      extra: c.traps[0]?.difference,
      href: `/concept/${c.id}`,
    };
  }
  const t = TASK_MAP[sourceId];
  if (t) {
    return {
      id: t.id,
      kind: "task",
      front: t.prompt,
      back: t.answer,
      extra: t.explanation,
      href: `/practice/${t.id}`,
    };
  }
  return null;
}

const KIND_LABEL = { concept: "개념", task: "SQL 실습" } as const;

export default function ReviewPage() {
  const hydrated = useApp((s) => s.hydrated);
  const reviewCards = useApp((s) => s.reviewCards);
  const reviewItem = useApp((s) => s.reviewItem);

  const [now, setNow] = useState(0);
  const [queue, setQueue] = useState<string[] | null>(null);
  const [at, setAt] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ know: 0, forgot: 0 });

  useEffect(() => setNow(Date.now()), []);

  const due = useMemo(() => (now ? dueCards(reviewCards, now) : []), [reviewCards, now]);
  const retention = now ? Math.round(retentionRate(reviewCards, now) * 100) : 0;

  const start = () => {
    // 시작 시점의 목록으로 고정한다 — 도중에 틀린 카드가 다시 끼어들면
    // 끝이 보이지 않아 그만두게 된다
    setQueue(due.map((c) => c.sourceId));
    setAt(0);
    setFlipped(false);
    setScore({ know: 0, forgot: 0 });
  };

  const grade = (correct: boolean) => {
    if (!queue) return;
    reviewItem(queue[at], correct);
    setScore((s) => ({
      know: s.know + (correct ? 1 : 0),
      forgot: s.forgot + (correct ? 0 : 1),
    }));
    setAt(at + 1);
    setFlipped(false);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        불러오는 중…
      </div>
    );
  }

  // ── 세션 중 ──────────────────────────────────────────────────
  if (queue && at < queue.length) {
    const item = resolve(queue[at]);
    if (!item) {
      // 데이터가 바뀌어 사라진 항목 — 조용히 건너뛴다
      return (
        <div className="pt-6">
          <Button onClick={() => setAt(at + 1)}>다음</Button>
        </div>
      );
    }
    return (
      <div className="pt-6">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {at + 1} / {queue.length}
          </span>
          <button
            type="button"
            onClick={() => setQueue(null)}
            className="hover:text-zinc-200"
          >
            그만두기
          </button>
        </div>
        <ProgressBar value={at} max={queue.length} color="#10b981" className="mt-2" />

        <div className="mt-5">
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
            {KIND_LABEL[item.kind]}
          </span>
        </div>

        <Card className="mt-3 min-h-44">
          <p className="text-[17px] font-bold leading-[1.65]">{item.front}</p>
          {flipped ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 border-t border-white/10 pt-4"
            >
              {item.kind === "task" ? (
                <SqlBlock>{item.back}</SqlBlock>
              ) : (
                <p className="text-[15px] leading-[1.9] text-zinc-200">{item.back}</p>
              )}
              {item.extra && (
                <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
                  {item.extra}
                </p>
              )}
              <Link
                href={item.href}
                className="mt-3 inline-block text-[12px] text-indigo-300 hover:text-indigo-200"
              >
                자세히 보기 →
              </Link>
            </motion.div>
          ) : (
            <p className="mt-4 text-[13px] text-zinc-600">
              떠올려 본 다음에 답을 여세요
            </p>
          )}
        </Card>

        {flipped ? (
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => grade(false)}>
              <X size={15} />
              몰랐어요
            </Button>
            <Button onClick={() => grade(true)}>
              <Check size={15} />
              알았어요
            </Button>
          </div>
        ) : (
          <Button size="lg" className="mt-5 w-full" onClick={() => setFlipped(true)}>
            <Eye size={16} />답 보기
          </Button>
        )}
      </div>
    );
  }

  // ── 세션 종료 ────────────────────────────────────────────────
  if (queue && at >= queue.length) {
    return (
      <div className="pt-8 text-center">
        <p className="text-sm text-zinc-400">복습 완료</p>
        <p className="mt-2 text-5xl font-bold tracking-tight">{queue.length}장</p>
        <p className="mt-1 text-sm text-zinc-400">
          알았어요 {score.know} · 몰랐어요 {score.forgot}
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-zinc-500">
          몰랐던 것은 곧바로 다시 대기열에 올라갑니다. 알았던 것은 한 단계 뒤로
          미뤄져 잊을 때쯤 다시 나타납니다.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setQueue(null)}>
            <RotateCcw size={15} />
            복습 홈
          </Button>
          <Link href="/quiz" className="contents">
            <Button className="w-full">
              퀴즈로 확인
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── 복습 홈 ──────────────────────────────────────────────────
  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold tracking-tight">복습</h1>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        오늘 · 1일 · 3일 · 7일 · 14일 · 30일 간격으로 다시 물어봅니다. 잊기 직전에
        보는 것이 가장 오래 남습니다.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <StatCard label="지금 볼 것" value={`${due.length}장`} />
        <StatCard label="기억 보존율" value={`${retention}%`} />
      </div>

      {due.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="지금 복습할 것이 없습니다"
          desc={
            reviewCards.length === 0
              ? "개념을 학습하거나 퀴즈·SQL 실습을 풀면 복습 카드가 쌓입니다."
              : "다음 복습 시각이 될 때까지 기다리면 됩니다."
          }
          action={
            <Link href="/learn">
              <Button size="sm">개념 학습하러 가기</Button>
            </Link>
          }
        />
      ) : (
        <Button size="lg" className="mt-5 w-full" onClick={start}>
          {due.length}장 복습 시작
          <ArrowRight size={17} />
        </Button>
      )}

      {reviewCards.length > 0 && (
        <>
          <SectionTitle>대기 중인 카드</SectionTitle>
          <div className="flex flex-col gap-2">
            {[...reviewCards]
              .sort((a, b) => a.nextDueAt - b.nextDueAt)
              .slice(0, 20)
              .map((c) => {
                const item = resolve(c.sourceId);
                if (!item) return null;
                return (
                  <div
                    key={c.sourceId}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold">{item.front}</p>
                      <p className="text-[11px] text-zinc-600">
                        {KIND_LABEL[item.kind]} · {c.stage}단계
                        {c.lapses > 0 && ` · ${c.lapses}번 틀림`}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-500">
                      {now ? nextDueLabel(c, now) : "—"}
                    </span>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
