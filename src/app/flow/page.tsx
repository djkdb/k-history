"use client";

import { Suspense, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { Brain } from "lucide-react";
import type { EraId, HistoryEvent } from "@/lib/types";
import { ERAS, ERA_MAP } from "@/data/eras";
import { ALL_EVENTS, eventsByEra } from "@/data/events";
import { Badge, Button, Chip, ImportanceBadge } from "@/components/ui";

function EraHeader({ eraId }: { eraId: EraId }) {
  const era = ERA_MAP[eraId];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      className="relative my-8 overflow-hidden rounded-3xl p-6 text-center"
      style={{
        background: `linear-gradient(160deg, ${era.color}2e, transparent 75%)`,
        border: `1px solid ${era.color}45`,
      }}
    >
      <div className="text-4xl">{era.symbol}</div>
      <h2 className="mt-2 text-xl font-black tracking-tight">{era.name}</h2>
      <p className="text-xs era-ink" style={{ color: era.color }}>
        {era.period}
      </p>
      <p className="mt-1 text-xs text-zinc-400">{era.mood}</p>
    </motion.div>
  );
}

function FlowCard({ event, index }: { event: HistoryEvent; index: number }) {
  const era = ERA_MAP[event.era];
  return (
    <div className="relative pl-8">
      {/* 타임라인 노드 */}
      <span
        className="absolute left-[7px] top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-[#09090b]"
        style={{ background: era.color }}
      />
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? 32 : -32, y: 12 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mb-4"
      >
        <Link href={`/event/${event.id}`}>
          <div className="glass rounded-2xl p-4 transition-transform active:scale-[0.99]">
            <p className="text-lg font-black era-ink" style={{ color: era.color }}>
              {event.yearDisplay}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <h3 className="font-bold">{event.title}</h3>
              <ImportanceBadge importance={event.importance} />
            </div>
            {event.king && <Badge className="mt-1.5">👑 {event.king}</Badge>}
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {event.summary10s}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

function FlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eraParam = searchParams.get("era") as EraId | null;
  const selectedEra = eraParam && ERA_MAP[eraParam] ? eraParam : null;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  const events = useMemo(
    () => (selectedEra ? eventsByEra(selectedEra) : ALL_EVENTS),
    [selectedEra],
  );

  return (
    <div className="pt-4" ref={containerRef}>
      {/* 스크롤 진행 바 */}
      <motion.div
        className="fixed right-1.5 top-1/2 z-40 h-40 w-1 origin-top -translate-y-1/2 rounded-full bg-indigo-400/70"
        style={{ scaleY: progress }}
      />
      <div className="fixed right-1.5 top-1/2 z-30 h-40 w-1 -translate-y-1/2 rounded-full bg-white/10" />

      <h1 className="text-2xl font-bold tracking-tight">시대 흐름 모드</h1>
      <p className="mt-1 text-sm text-zinc-500">
        스크롤을 내리면 시간이 흐릅니다
      </p>

      {/* 시대 선택 */}
      <div className="no-scrollbar sticky top-0 z-30 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-[#09090b]/85 px-4 py-3 backdrop-blur-lg">
        <Chip
          active={!selectedEra}
          onClick={() => router.replace("/flow")}
        >
          전체
        </Chip>
        {ERAS.map((era) => (
          <Chip
            key={era.id}
            active={selectedEra === era.id}
            onClick={() => router.replace(`/flow?era=${era.id}`)}
          >
            {era.symbol} {era.name}
          </Chip>
        ))}
      </div>

      {/* 타임라인 */}
      <div className="relative mt-6">
        <span className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
        {events.map((event, i) => {
          const prevEvent = events[i - 1];
          const eraChanged = !prevEvent || prevEvent.era !== event.era;
          return (
            <div key={event.id}>
              {!selectedEra && eraChanged && <EraHeader eraId={event.era} />}
              <FlowCard event={event} index={i} />
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="pb-6 pt-4">
        <Link href={selectedEra ? `/quiz?era=${selectedEra}` : "/quiz"}>
          <Button size="lg" className="w-full">
            <Brain size={18} /> 끝까지 봤다면, 퀴즈로 확인
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function FlowPage() {
  return (
    <Suspense>
      <FlowContent />
    </Suspense>
  );
}
