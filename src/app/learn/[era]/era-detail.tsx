"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, GitBranch } from "lucide-react";
import type { EraId } from "@/lib/types";
import { useApp } from "@/lib/store";
import { ERA_MAP } from "@/data/eras";
import { eventsByEra } from "@/data/events";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
} from "@/components/ui";

type Filter = "all" | "todo" | "must" | "high" | "done";

export function EraDetail() {
  const params = useParams<{ era: string }>();
  const router = useRouter();
  const eraId = params.era as EraId;
  const era = ERA_MAP[eraId];

  const hydrated = useApp((s) => s.hydrated);
  const studiedEventIds = useApp((s) => s.studiedEventIds);
  const studied = useMemo(() => new Set(studiedEventIds), [studiedEventIds]);

  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!era) router.replace("/learn");
  }, [era, router]);

  if (!era) return null;

  const events = eventsByEra(eraId);
  const done = events.filter((e) => studied.has(e.id)).length;

  const filtered = events.filter((e) => {
    if (filter === "todo") return !studied.has(e.id);
    if (filter === "must") return e.importance === 5;
    if (filter === "high") return e.importance >= 4;
    if (filter === "done") return studied.has(e.id);
    return true;
  });

  return (
    <div className="pt-6">
      {/* 히어로 */}
      <div
        className="relative overflow-hidden rounded-3xl p-6"
        style={{
          background: `linear-gradient(135deg, ${era.color}26, transparent 70%)`,
          border: `1px solid ${era.color}40`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full opacity-20 blur-3xl"
          style={{ background: era.color }}
        />
        <div className="text-4xl">{era.symbol}</div>
        <h1 className="mt-2 text-2xl font-black tracking-tight">{era.name}</h1>
        <p className="text-xs era-ink" style={{ color: era.color }}>
          {era.period}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          {era.description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <ProgressBar
            value={hydrated ? done : 0}
            max={events.length}
            color={era.color}
            className="flex-1"
          />
          <span className="text-xs text-zinc-400">
            {hydrated ? done : 0}/{events.length}
          </span>
        </div>
      </div>

      {/* 필터 */}
      <ScrollRow className="mt-4">
        {(
          [
            ["all", "전체"],
            ["todo", "미학습"],
            ["must", "★5 반드시 암기"],
            ["high", "★4 이상"],
            ["done", "완료"],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <Chip key={key} active={filter === key} onClick={() => setFilter(key)}>
            {label}
          </Chip>
        ))}
      </ScrollRow>

      {/* 이벤트 리스트 */}
      <div className="mt-4 flex flex-col gap-2">
        {filtered.length === 0 && (
          <EmptyState title="해당하는 개념이 없어요" />
        )}
        {filtered.map((e, i) => {
          const isDone = hydrated && studied.has(e.id);
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
            >
              <Link href={`/event/${e.id}`}>
                <Card className={cn(isDone && "opacity-60")}>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold era-ink"
                      style={{ color: era.color }}
                    >
                      {e.yearDisplay}
                    </span>
                    {e.king && <Badge>{e.king}</Badge>}
                    <span className="flex-1" />
                    {isDone && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <h3 className="font-bold">{e.title}</h3>
                    <ImportanceBadge importance={e.importance} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                    {e.summary10s}
                  </p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* 하단 CTA */}
      <div className="mt-6 flex gap-2">
        <Link href={`/flow?era=${eraId}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <GitBranch size={16} /> 흐름 모드로 보기
          </Button>
        </Link>
        <Link href={`/quiz?era=${eraId}`} className="flex-1">
          <Button className="w-full">
            <Brain size={16} /> 이 시대 퀴즈
          </Button>
        </Link>
      </div>
    </div>
  );
}
