"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { Badge, Card, Chip, ProgressBar } from "@/components/ui";
import { CATEGORY_LABEL, grammarByCategory, grammarFor } from "@/data/grammar";
import { BAND_LABEL } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import type { GrammarCategory } from "@/lib/types";

export default function GrammarList() {
  const band = useBand();
  const studied = useApp((s) => s.studiedGrammarIds);
  const all = useMemo(() => grammarFor(band), [band]);
  const groups = useMemo(() => grammarByCategory(band), [band]);
  const [filter, setFilter] = useState<GrammarCategory | "all">("all");

  const doneCount = all.filter((g) => studied.includes(g.id)).length;
  const shown = filter === "all" ? groups : groups.filter((g) => g.category === filter);

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">문법</h1>
        <p className="mt-1 text-[13px] text-zinc-400">
          Part 5·6 에서 자리로 푸는 문제들 · {BAND_LABEL[band]} 기준 {all.length}개
        </p>
        <ProgressBar value={doneCount} max={all.length} color="#10b981" className="mt-3" />
        <p className="mt-2 text-[12px] text-zinc-500">
          {doneCount} / {all.length}개 학습
        </p>
      </header>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          전체 {all.length}
        </Chip>
        {groups.map((g) => (
          <Chip
            key={g.category}
            active={filter === g.category}
            onClick={() => setFilter(g.category)}
          >
            {CATEGORY_LABEL[g.category]} {g.items.length}
          </Chip>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {shown.map((group) => (
          <section key={group.category}>
            <h2 className="mb-2 text-[13px] font-bold text-zinc-400">
              {CATEGORY_LABEL[group.category]}
            </h2>
            <div className="flex flex-col gap-2">
              {group.items.map((g) => {
                const done = studied.includes(g.id);
                return (
                  <Link key={g.id} href={`/grammar/${g.id}`}>
                    <Card className="transition-colors hover:bg-white/[0.05]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {done && (
                              <Check size={14} className="shrink-0 text-emerald-400" />
                            )}
                            <p className="text-[15px] font-bold">{g.title}</p>
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                            {g.summary}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge>{g.band}</Badge>
                          <ChevronRight size={16} className="text-zinc-600" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
