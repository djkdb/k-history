"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { ERAS } from "@/data/eras";
import { ALL_EVENTS } from "@/data/events";
import { Card, ProgressBar } from "@/components/ui";

export default function LearnPage() {
  const hydrated = useApp((s) => s.hydrated);
  const studiedEventIds = useApp((s) => s.studiedEventIds);
  const studied = useMemo(() => new Set(studiedEventIds), [studiedEventIds]);

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold tracking-tight">시대별 학습</h1>
      <p className="mt-1 text-sm text-zinc-500">
        선사부터 현대까지, 흐름으로 기억하는 한국사
      </p>

      <Card className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-zinc-400">전체 진도</span>
          <span className="font-semibold text-zinc-300">
            {hydrated ? studiedEventIds.length : 0} / {ALL_EVENTS.length}
          </span>
        </div>
        <ProgressBar
          value={hydrated ? studiedEventIds.length : 0}
          max={ALL_EVENTS.length}
        />
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {ERAS.map((era, i) => {
          const events = ALL_EVENTS.filter((e) => e.era === era.id);
          const done = hydrated
            ? events.filter((e) => studied.has(e.id)).length
            : 0;
          return (
            <motion.div
              key={era.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/learn/${era.id}`}>
                <div
                  className="glass relative overflow-hidden rounded-2xl p-4 transition-transform active:scale-[0.98]"
                  style={{ borderTop: `2px solid ${era.color}` }}
                >
                  <div
                    className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-15 blur-2xl"
                    style={{ background: era.color }}
                  />
                  <div className="text-2xl">{era.symbol}</div>
                  <h2 className="mt-2 font-bold">{era.name}</h2>
                  <p className="text-[10px] text-zinc-500">{era.period}</p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-zinc-400">
                    {era.mood}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <ProgressBar
                      value={done}
                      max={events.length}
                      color={era.color}
                      className="flex-1"
                    />
                    <span className="text-[10px] text-zinc-500">
                      {done}/{events.length}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
