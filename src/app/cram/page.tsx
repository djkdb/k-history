"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { AlertTriangle, ChevronLeft, ChevronRight, Flame, X } from "lucide-react";
import type { HistoryEvent } from "@/lib/types";
import { useApp } from "@/lib/store";
import { ALL_EVENTS } from "@/data/events";
import { ERA_MAP } from "@/data/eras";
import { cn, dDayLabel } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  EraBadge,
  ProgressBar,
} from "@/components/ui";

const MODES = [
  { label: "30분", desc: "반드시 암기만", minImportance: 5 },
  { label: "1시간", desc: "매우 중요까지", minImportance: 4 },
  { label: "3시간", desc: "자주 출제까지", minImportance: 3 },
];

export default function CramPage() {
  const exam = useApp((s) => s.exam);
  const wrongEventIds = useApp((s) => s.wrongEventIds);
  const addStudyMinutes = useApp((s) => s.addStudyMinutes);

  const [wrongFirst, setWrongFirst] = useState(false);
  const [deck, setDeck] = useState<HistoryEvent[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  const counts = useMemo(
    () =>
      MODES.map(
        (m) => ALL_EVENTS.filter((e) => e.importance >= m.minImportance).length,
      ),
    [],
  );

  const begin = (minImportance: number) => {
    let events = ALL_EVENTS.filter((e) => e.importance >= minImportance);
    if (wrongFirst) {
      const wrong = new Set(wrongEventIds);
      events = [
        ...events.filter((e) => wrong.has(e.id)),
        ...events.filter((e) => !wrong.has(e.id)),
      ];
    }
    setDeck(events);
    setIdx(0);
    setFinished(false);
  };

  const next = () => {
    if (!deck) return;
    if (idx + 1 >= deck.length) {
      addStudyMinutes(Math.round(deck.length * 0.4));
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
    }
  };
  const prevCard = () => setIdx((i) => Math.max(0, i - 1));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70) next();
    else if (info.offset.x > 70) prevCard();
  };

  // 완료
  if (finished && deck) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-5xl">🍀</div>
          <h1 className="mt-4 text-2xl font-black">
            최종 정리 완료.
            <br />
            시험장에서 만나요
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            핵심 개념 {deck.length}개를 훑었습니다
          </p>
          <Link href="/">
            <Button size="lg" className="mt-8">
              홈으로
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // 세션
  if (deck) {
    const event = deck[idx];
    const era = ERA_MAP[event.era];
    return (
      <div className="flex min-h-[85dvh] flex-col pt-4">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDeck(null)}
            className="text-zinc-600 transition-colors hover:text-zinc-300"
          >
            <X size={18} />
          </button>
          <ProgressBar value={idx + 1} max={deck.length} className="flex-1" />
          <span className="text-xs font-semibold text-zinc-400">
            {idx + 1}/{deck.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={event.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.2 }}
            className="glass flex-1 cursor-grab rounded-3xl p-5 active:cursor-grabbing"
            style={{ borderTop: `2px solid ${era.color}` }}
          >
            <EraBadge eraId={event.era} />
            <p
              className="mt-3 text-sm font-bold"
              style={{ color: era.color }}
            >
              {event.yearDisplay}
              {event.king ? ` · ${event.king}` : ""}
            </p>
            <h2 className="mt-1 text-2xl font-black leading-tight tracking-tight">
              {event.title}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed">
              {event.summary10s}
            </p>
            <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3">
              <p className="text-xs font-medium leading-relaxed text-red-100">
                🎯 {event.examPoint}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.keywords.map((k) => (
                <Badge key={k}>{k}</Badge>
              ))}
            </div>
            {event.traps.length > 0 && (
              <div className="mt-3 flex flex-col gap-1">
                {event.traps.slice(0, 2).map((t) => (
                  <p
                    key={t.concept}
                    className="flex items-start gap-1.5 text-[11px] leading-relaxed text-orange-300/90"
                  >
                    <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                    <span>
                      <b>{t.concept}</b> — {t.difference}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex gap-2 pb-2">
          <Button variant="ghost" size="lg" onClick={prevCard} disabled={idx === 0}>
            <ChevronLeft size={18} />
          </Button>
          <Button size="lg" className="flex-1" onClick={next}>
            {idx + 1 >= deck.length ? "정리 끝!" : "다음"}
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  // 진입
  return (
    <div className="pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-transparent p-6"
      >
        <Flame className="absolute -right-3 -top-3 h-24 w-24 text-red-500/15" />
        <p className="text-xs font-semibold text-red-300">
          {exam ? `${exam.examLabel} · ${dDayLabel(exam.examDate)}` : "원클릭 최종 정리"}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">
          시험 직전 최종 정리
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          가장 중요한 것만, 출제 포인트와 함정까지. 남은 시간에 맞는 모드를
          고르세요.
        </p>
      </motion.div>

      <div className="mt-4 flex flex-col gap-2.5">
        {MODES.map((m, i) => (
          <button key={m.label} type="button" onClick={() => begin(m.minImportance)}>
            <Card className="flex items-center gap-4 text-left">
              <span className="text-xl font-black text-red-300">{m.label}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{m.desc}</span>
                <span className="block text-xs text-zinc-500">
                  핵심 개념 {counts[i]}개
                </span>
              </span>
              <ChevronRight size={16} className="text-zinc-600" />
            </Card>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setWrongFirst((w) => !w)}
        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
      >
        <span className="text-sm font-medium text-zinc-300">
          오답 먼저 보기
          <span className="ml-2 text-xs text-zinc-500">
            틀렸던 개념을 앞으로
          </span>
        </span>
        <span
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            wrongFirst ? "bg-red-500" : "bg-white/10",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
              wrongFirst ? "left-[22px]" : "left-0.5",
            )}
          />
        </span>
      </button>
    </div>
  );
}
