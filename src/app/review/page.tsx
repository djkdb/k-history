"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  Check,
  NotebookPen,
  RotateCcw,
  X,
} from "lucide-react";
import type { ReviewCard as ReviewCardType } from "@/lib/types";
import { useApp } from "@/lib/store";
import { getEvent } from "@/data/events";
import { ERA_MAP } from "@/data/eras";
import {
  REVIEW_INTERVALS_DAYS,
  dueCards,
  nextDueLabel,
  retentionRate,
} from "@/lib/srs";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  EraBadge,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui";

function Flashcard({
  card,
  onGrade,
}: {
  card: ReviewCardType;
  onGrade: (correct: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const event = getEvent(card.eventId);
  if (!event) return null;
  const era = ERA_MAP[event.era];

  // 뒷면 내용은 개념마다 길이가 달라, 카드 높이를 고정하면 암기법이 잘린다.
  // 보이지 않는 사본을 깔아 두 면 중 큰 쪽에 높이를 맞춘다.
  const back = (
    <>
      <p className="text-[15px] font-bold leading-[1.7]">{event.summary10s}</p>
      <p className="mt-3 text-[13px] leading-[1.75] text-zinc-400">
        {event.examPoint}
      </p>
      <div className="mt-3.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3.5">
        <p className="text-[13px] font-semibold leading-[1.7] text-emerald-200">
          🧠 {event.memory.mnemonic}
        </p>
      </div>
    </>
  );

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative min-h-[360px]"
        onClick={() => !flipped && setFlipped(true)}
      >
        {/* 높이 결정용 사본 — 화면에는 보이지 않는다 */}
        <div aria-hidden className="invisible px-5 py-5">
          {back}
          <div className="mt-3 h-4" />
          <div className="mt-3 h-11" />
        </div>
        {/* 앞면 */}
        <div
          className="glass absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <EraBadge eraId={event.era} />
          <p className="text-sm font-bold era-ink" style={{ color: era.color }}>
            {event.yearDisplay}
          </p>
          <h2 className="text-2xl font-black tracking-tight">{event.title}</h2>
          <p className="text-sm text-zinc-500">
            이 사건, 설명할 수 있나요?
          </p>
          <Badge className="mt-4">탭해서 확인</Badge>
        </div>

        {/* 뒷면 */}
        <div
          className="glass absolute inset-0 flex flex-col rounded-3xl px-5 py-5"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex-1">{back}</div>

          {/* 스테이지 표시 */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {REVIEW_INTERVALS_DAYS.map((d, i) => (
              <span
                key={d}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i <= card.stage ? "" : "bg-white/15",
                )}
                style={i <= card.stage ? { background: era.color } : undefined}
                title={`${d}일`}
              />
            ))}
            <span className="ml-1 text-[10px] text-zinc-500">
              {REVIEW_INTERVALS_DAYS[card.stage]}일 단계
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="danger" onClick={() => onGrade(false)}>
              <X size={16} /> 가물가물해요
            </Button>
            <Button
              className="!bg-gradient-to-br !from-emerald-500 !to-emerald-600 !shadow-emerald-500/25"
              onClick={() => onGrade(true)}
            >
              <Check size={16} /> 기억났어요
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ReviewPage() {
  const hydrated = useApp((s) => s.hydrated);
  const reviewCards = useApp((s) => s.reviewCards);
  const reviewEvent = useApp((s) => s.reviewEvent);
  const addStudyMinutes = useApp((s) => s.addStudyMinutes);

  const [queue, setQueue] = useState<ReviewCardType[] | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  const due = useMemo(() => dueCards(reviewCards), [reviewCards]);
  const retention = Math.round(retentionRate(reviewCards) * 100);

  const upcoming = useMemo(
    () =>
      [...reviewCards]
        .filter((c) => c.nextDueAt > Date.now())
        .sort((a, b) => a.nextDueAt - b.nextDueAt)
        .slice(0, 5),
    [reviewCards],
  );

  // 세션 진행 중
  if (queue) {
    if (idx >= queue.length) {
      // 완료 화면
      return (
        <div className="pt-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-5xl">🎉</div>
            <h1 className="mt-3 text-2xl font-bold">
              오늘 복습 {queue.length}장 완료
            </h1>
            <p className="mt-1 text-sm text-indigo-300">
              +{queue.length * 5} XP
            </p>
          </motion.div>

          <SectionTitle>다음 복습 일정</SectionTitle>
          <div className="flex flex-col gap-2">
            {doneIds.map((id) => {
              const event = getEvent(id);
              const card = useApp
                .getState()
                .reviewCards.find((c) => c.eventId === id);
              if (!event || !card) return null;
              return (
                <Card key={id} className="flex items-center gap-2">
                  <EraBadge eraId={event.era} />
                  <span className="flex-1 truncate text-sm font-medium">
                    {event.title}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {nextDueLabel(card)}
                  </span>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <Link href="/">
              <Button size="lg" className="w-full">
                홈으로
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" size="lg" className="w-full">
                <BookOpen size={16} /> 새 개념 학습하기
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    const card = queue[idx];
    return (
      <div className="pt-6">
        <div className="mb-5 flex items-center gap-3">
          <ProgressBar value={idx} max={queue.length} className="flex-1" />
          <span className="text-xs font-semibold text-zinc-400">
            {idx + 1}/{queue.length}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={card.eventId}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
          >
            <Flashcard
              card={card}
              onGrade={(correct) => {
                reviewEvent(card.eventId, correct);
                setDoneIds((d) => [...d, card.eventId]);
                if (idx + 1 >= queue.length) {
                  addStudyMinutes(Math.round(queue.length * 0.5));
                }
                setIdx((i) => i + 1);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // 대기 화면
  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold tracking-tight">오늘의 복습</h1>
      <p className="mt-1 text-sm text-zinc-500">
        에빙하우스 간격: 당일 → 1일 → 3일 → 7일 → 14일 → 30일
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <StatCard
          label="암기율"
          value={hydrated ? `${retention}%` : "—"}
          sub="망각곡선 기반 추정"
          icon={<Brain size={16} />}
          accent="#10b981"
        />
        <StatCard
          label="복습 대기"
          value={hydrated ? `${due.length}장` : "—"}
          sub={`전체 카드 ${reviewCards.length}장`}
          icon={<RotateCcw size={16} />}
          accent="#6366f1"
        />
      </div>

      {!hydrated ? (
        <div className="glass mt-4 h-40 animate-pulse rounded-2xl" />
      ) : due.length === 0 ? (
        <>
          <Card className="mt-4">
            {/*
              카드가 있는데 아직 때가 아닌 경우와, 카드 자체가 없는 경우를
              구분해서 말해 준다. 퀴즈 결과 화면이 "복습 큐에 반영했습니다"라고
              해 놓고 여기서 "카드가 없어요"라고 하면 반영이 안 된 줄 안다.
            */}
            <EmptyState
              icon="🌙"
              title={
                reviewCards.length > 0
                  ? "지금 복습할 카드는 없어요"
                  : "아직 복습할 카드가 없어요"
              }
              desc={
                reviewCards.length > 0
                  ? `${reviewCards.length}장이 대기 중이에요. 가장 이른 카드는 ${
                      upcoming[0] ? nextDueLabel(upcoming[0]) : "곧"
                    } 올라옵니다. 틀린 개념은 오답 노트에서 바로 다시 풀 수 있어요.`
                  : "개념을 학습하거나 퀴즈에서 틀리면 복습 일정이 자동으로 잡힙니다"
              }
              action={
                reviewCards.length > 0 ? (
                  <Link href="/wrong">
                    <Button>
                      <NotebookPen size={16} /> 오답 노트에서 다시 풀기
                    </Button>
                  </Link>
                ) : (
                  <Link href="/learn">
                    <Button>
                      <BookOpen size={16} /> 학습하러 가기
                    </Button>
                  </Link>
                )
              }
            />
          </Card>
          {upcoming.length > 0 && (
            <>
              <SectionTitle>다가오는 복습</SectionTitle>
              <div className="flex flex-col gap-2">
                {upcoming.map((c) => {
                  const event = getEvent(c.eventId);
                  if (!event) return null;
                  return (
                    <Card key={c.eventId} className="flex items-center gap-2">
                      <EraBadge eraId={event.era} />
                      <span className="flex-1 truncate text-sm font-medium">
                        {event.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {nextDueLabel(c)}
                      </span>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => {
            setQueue(due);
            setDoneIds([]);
            setIdx(0);
          }}
        >
          <RotateCcw size={18} /> 복습 시작 ({due.length}장)
        </Button>
      )}
    </div>
  );
}
