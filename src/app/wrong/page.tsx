"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Brain, ChevronDown, NotebookPen } from "lucide-react";
import type { EraId, QuizType } from "@/lib/types";
import { useApp } from "@/lib/store";
import { getEvent } from "@/data/events";
import { ERAS, ERA_MAP } from "@/data/eras";
import { cn, QUIZ_TYPE_LABELS } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  EraBadge,
  ImportanceBadge,
  ScrollRow,
  SectionTitle,
} from "@/components/ui";


export default function WrongNotePage() {
  const hydrated = useApp((s) => s.hydrated);
  const wrongEventIds = useApp((s) => s.wrongEventIds);
  const quizHistory = useApp((s) => s.quizHistory);

  const [eraFilter, setEraFilter] = useState<EraId | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const entries = useMemo(
    () =>
      wrongEventIds
        .map((id) => {
          const event = getEvent(id);
          if (!event) return null;
          const wrongs = quizHistory.filter(
            (r) => r.eventId === id && !r.correct,
          );
          const last = wrongs[wrongs.length - 1];
          return {
            event,
            wrongCount: wrongs.length,
            lastType: last ? QUIZ_TYPE_LABELS[last.type] : null,
          };
        })
        .filter((e): e is NonNullable<typeof e> => !!e),
    [wrongEventIds, quizHistory],
  );

  const erasWithWrong = useMemo(
    () => ERAS.filter((era) => entries.some((e) => e.event.era === era.id)),
    [entries],
  );

  const filtered = eraFilter
    ? entries.filter((e) => e.event.era === eraFilter)
    : entries;

  const stats = useMemo(() => {
    const wrongs = quizHistory.filter((r) => !r.correct);
    if (wrongs.length === 0) return null;
    const eraCount = new Map<EraId, number>();
    const typeCount = new Map<QuizType, number>();
    for (const w of wrongs) {
      eraCount.set(w.era, (eraCount.get(w.era) ?? 0) + 1);
      typeCount.set(w.type, (typeCount.get(w.type) ?? 0) + 1);
    }
    const topEra = [...eraCount.entries()].sort((a, b) => b[1] - a[1])[0];
    const topType = [...typeCount.entries()].sort((a, b) => b[1] - a[1])[0];
    return { topEra, topType };
  }, [quizHistory]);

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-3 pt-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass h-20 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">오답 노트</h1>
          <p className="mt-1 text-sm text-zinc-500">
            틀린 개념 {entries.length}건 — 여기가 점수가 오르는 곳
          </p>
        </div>
      </div>

      {/*
        비활성 버튼을 Link로 감싸면 pointer-events-none이 버튼에만 걸려
        클릭이 링크로 새어 나간다. 풀 것이 없으면 아예 내보내지 않는다.
      */}
      {entries.length > 0 && (
        <Link href="/quiz?mode=wrong" className="mt-4 block">
          <Button size="lg" className="w-full">
            <Brain size={18} /> 틀린 것만 다시 풀기
          </Button>
        </Link>
      )}

      {entries.length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={<NotebookPen size={28} />}
            title="아직 오답이 없어요"
            desc="퀴즈를 풀면 틀린 개념이 자동으로 모입니다"
            action={
              <Link href="/quiz">
                <Button variant="outline">퀴즈 풀러 가기</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          {erasWithWrong.length > 1 && (
            <ScrollRow className="mt-4">
              <Chip active={!eraFilter} onClick={() => setEraFilter(null)}>
                전체
              </Chip>
              {erasWithWrong.map((era) => (
                <Chip
                  key={era.id}
                  active={eraFilter === era.id}
                  onClick={() => setEraFilter(era.id)}
                >
                  {era.symbol} {era.name}
                </Chip>
              ))}
            </ScrollRow>
          )}

          <div className="mt-4 flex flex-col gap-2">
            {filtered.map(({ event, wrongCount, lastType }) => {
              const open = expanded === event.id;
              return (
                <Card key={event.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 text-left"
                    onClick={() => setExpanded(open ? null : event.id)}
                  >
                    <span className="min-w-0 flex-1">
                      {/* 제목이 배지들에 밀려 줄이 깨지지 않도록 층을 나눈다 */}
                      <span className="block truncate text-sm font-bold">
                        {event.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
                        <EraBadge eraId={event.era} />
                        <ImportanceBadge importance={event.importance} compact />
                        <span className="truncate">
                          {event.yearDisplay}
                          {wrongCount > 0 && ` · ${wrongCount}회 틀림`}
                          {lastType && ` · 최근 ${lastType}`}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        "shrink-0 text-zinc-600 transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 border-t border-white/5 pt-3">
                          <p className="text-xs leading-relaxed text-zinc-300">
                            🎯 {event.examPoint}
                          </p>
                          {event.traps.slice(0, 2).map((t) => (
                            <p
                              key={t.concept}
                              className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-orange-300/90"
                            >
                              <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                              <span>
                                <b>{t.concept}</b> — {t.difference}
                              </span>
                            </p>
                          ))}
                          <Link href={`/event/${event.id}`}>
                            <Button variant="outline" size="sm" className="mt-3">
                              개념 다시 보기
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>

          {stats && (
            <>
              <SectionTitle>오답 통계</SectionTitle>
              <div className="grid grid-cols-2 gap-2.5 pb-4">
                <Card>
                  <p className="text-xs text-zinc-500">가장 많이 틀린 시대</p>
                  <p className="mt-1 text-sm font-bold">
                    {ERA_MAP[stats.topEra[0]].symbol}{" "}
                    {ERA_MAP[stats.topEra[0]].name}
                  </p>
                  <Badge className="mt-1">{stats.topEra[1]}회</Badge>
                </Card>
                <Card>
                  <p className="text-xs text-zinc-500">가장 많이 틀린 유형</p>
                  <p className="mt-1 text-sm font-bold">
                    {QUIZ_TYPE_LABELS[stats.topType[0]]}
                  </p>
                  <Badge className="mt-1">{stats.topType[1]}회</Badge>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
