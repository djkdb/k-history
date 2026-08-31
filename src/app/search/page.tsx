"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import type { EraId, HistoryEvent } from "@/lib/types";
import { useApp } from "@/lib/store";
import { getEvent, searchEvents } from "@/data/events";
import { ERAS, ERA_MAP } from "@/data/eras";
import {
  Badge,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  SectionTitle,
} from "@/components/ui";

const SUGGESTIONS = [
  "세종",
  "임진왜란",
  "3·1 운동",
  "광개토대왕",
  "동학",
  "갑신정변",
];

export default function SearchPage() {
  const studiedEventIds = useApp((s) => s.studiedEventIds);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => searchEvents(debounced), [debounced]);

  const grouped = useMemo(() => {
    const map = new Map<EraId, HistoryEvent[]>();
    for (const e of results) {
      map.set(e.era, [...(map.get(e.era) ?? []), e]);
    }
    return ERAS.filter((era) => map.has(era.id)).map((era) => ({
      era,
      events: map.get(era.id)!,
    }));
  }, [results]);

  const recent = useMemo(
    () =>
      studiedEventIds
        .slice(-3)
        .reverse()
        .map((id) => getEvent(id))
        .filter((e): e is HistoryEvent => !!e),
    [studiedEventIds],
  );

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold tracking-tight">검색</h1>

      {/* 검색 인풋 */}
      <div className="glass sticky top-2 z-30 mt-4 flex items-center gap-2 rounded-2xl px-4 py-3">
        <SearchIcon size={18} className="shrink-0 text-zinc-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="왕·사건·연도·인물·문화재 검색"
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-zinc-600"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 빈 쿼리 */}
      {!debounced.trim() && (
        <>
          <SectionTitle>추천 검색</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Chip key={s} onClick={() => setQuery(s)}>
                {s}
              </Chip>
            ))}
          </div>
          {recent.length > 0 && (
            <>
              <SectionTitle>최근 학습</SectionTitle>
              <div className="flex flex-col gap-2">
                {recent.map((e) => (
                  <Link key={e.id} href={`/event/${e.id}`}>
                    <Card className="flex items-center gap-2.5">
                      <span>{ERA_MAP[e.era].symbol}</span>
                      <span className="flex-1 truncate text-sm font-semibold">
                        {e.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {e.yearDisplay}
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* 결과 */}
      {debounced.trim() && (
        <>
          <p className="mt-4 text-xs text-zinc-500">
            {results.length}개의 기록을 찾았어요
          </p>
          {results.length === 0 ? (
            <EmptyState
              icon="🏺"
              title="검색 결과가 없어요"
              desc="'세종', '동학', '1876' 같은 키워드로 시도해보세요"
            />
          ) : (
            grouped.map(({ era, events }) => (
              <div key={era.id} className="mt-5">
                <div className="mb-2 flex items-center gap-2">
                  <span>{era.symbol}</span>
                  <h2
                    className="text-sm font-bold era-ink"
                    style={{ color: era.color }}
                  >
                    {era.name}
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  {events.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <Link href={`/event/${e.id}`}>
                        <Card>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold era-ink" style={{ color: era.color }}>
                              {e.yearDisplay}
                            </span>
                            <ImportanceBadge importance={e.importance} />
                          </div>
                          <h3 className="mt-1 font-bold">{e.title}</h3>
                          {e.king && <Badge className="mt-1.5">👑 {e.king}</Badge>}
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
