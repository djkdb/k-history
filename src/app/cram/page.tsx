"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Flame,
  X,
} from "lucide-react";
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

/**
 * 줄글을 문장 단위로 끊는다.
 * 시험 직전에는 긴 문단을 읽을 여유가 없다. 한 줄에 한 사실만 보여야 눈에 든다.
 */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|(?<=다)\.\s*/)
    .map((t) => t.trim().replace(/^[·\-\s]+/, ""))
    .filter((t) => t.length > 1)
    .map((t) => (/[.!?]$/.test(t) ? t : t + "."));
}

const MODES = [
  { label: "30분", desc: "★5 반드시 암기 — 거의 매회 출제되는 것만", minImportance: 5 },
  { label: "1시간", desc: "★4 이상 — 2회 중 1회꼴로 나오는 것까지", minImportance: 4 },
  { label: "3시간", desc: "★3 이상 — 자주 출제되는 것까지", minImportance: 3 },
];

export default function CramPage() {
  const exam = useApp((s) => s.exam);
  const wrongEventIds = useApp((s) => s.wrongEventIds);
  const addStudyMinutes = useApp((s) => s.addStudyMinutes);

  const [wrongFirst, setWrongFirst] = useState(false);
  const [deck, setDeck] = useState<HistoryEvent[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [detail, setDetail] = useState(false);

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
      <div className="flex flex-col pt-4">
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
            className="glass cursor-grab rounded-3xl px-5 py-6 active:cursor-grabbing"
            style={{ borderTop: `2px solid ${era.color}` }}
          >
            <div className="flex items-center gap-2">
              <EraBadge eraId={event.era} />
              <span
                className="text-xs font-bold tabular-nums era-ink"
                style={{ color: era.color }}
              >
                {event.yearDisplay}
              </span>
              {event.king && (
                <span className="truncate text-xs text-zinc-500">
                  {event.king}
                </span>
              )}
            </div>

            <h2 className="mt-2.5 text-[26px] font-black leading-tight tracking-tight">
              {event.title}
            </h2>

            {/* 직전에 가장 잘 먹히는 건 두문자다. 가장 크게, 가장 먼저. */}
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3.5">
              <p className="text-[15px] font-bold leading-relaxed text-emerald-100">
                {event.memory.mnemonic}
              </p>
            </div>

            <p className="mt-4 text-[15px] leading-[1.75] text-zinc-200">
              {event.summary10s}
            </p>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {event.keywords.slice(0, 6).map((k) => (
                <Badge key={k}>{k}</Badge>
              ))}
            </div>

            {/* 나머지는 접어 둔다 — 76장을 넘겨야 하는 화면에 줄글을 다 펼치면 읽히지 않는다 */}
            {detail && (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/8 pt-4">
                <section>
                  <h3 className="mb-1.5 text-[11px] font-bold tracking-wide text-red-300">
                    출제 포인트
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {sentences(event.examPoint).map((line, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[13px] leading-[1.7] text-zinc-300"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-red-400/70" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {event.traps.length > 0 && (
                  <section>
                    <h3 className="mb-1.5 text-[11px] font-bold tracking-wide text-orange-300">
                      헷갈리는 것
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {event.traps.slice(0, 3).map((t) => (
                        <li key={t.concept} className="text-[13px] leading-[1.7]">
                          <span className="flex items-center gap-1.5 font-bold text-orange-200">
                            <AlertTriangle size={12} className="shrink-0" />
                            {t.concept}
                          </span>
                          <span className="mt-0.5 block pl-[18px] text-zinc-400">
                            {t.difference}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 자세히 보기는 한 번 켜면 계속 켜져 있다 — 카드마다 다시 누르게 하지 않는다 */}
        <button
          type="button"
          onClick={() => setDetail((d) => !d)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/6 py-2.5 text-xs font-semibold text-zinc-400 transition-colors active:bg-white/10"
        >
          {detail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {detail ? "핵심만 보기" : "출제 포인트·함정 보기"}
        </button>

        <div className="mt-3 flex gap-2">
          <Button variant="ghost" size="lg" onClick={prevCard} disabled={idx === 0}>
            <ChevronLeft size={18} />
          </Button>
          <Button size="lg" className="flex-1" onClick={next}>
            {idx + 1 >= deck.length ? "정리 끝!" : "다음"}
            <ChevronRight size={18} />
          </Button>
        </div>
        <p className="pb-6 pt-2 text-center text-[11px] text-zinc-600">
          카드를 좌우로 밀어도 넘길 수 있어요
        </p>
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
