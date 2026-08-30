"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { Badge, Card, Chip, ProgressBar } from "@/components/ui";
import {
  CATEGORY_LABEL,
  grammarBeyond,
  grammarByCategory,
  grammarFor,
} from "@/data/grammar";
import { BandLadder } from "@/components/band-ladder";
import { BAND_LABEL } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import type { GrammarCategory, GrammarPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function GrammarList() {
  const band = useBand();
  const studied = useApp((s) => s.studiedGrammarIds);
  const all = useMemo(() => grammarFor(band), [band]);
  /*
    목표 점수대를 넘어서는 것들.
    문법은 잘라 내지 않는다 — 600을 노린다고 관계대명사 문항을 안 만나는
    것이 아니다. 다만 먼저 볼 것과 나중에 볼 것은 갈라 준다.
  */
  const beyond = useMemo(() => grammarBeyond(band), [band]);
  const groups = useMemo(() => grammarByCategory(band), [band]);
  const beyondGroups = useMemo(() => grammarByCategory(band, "beyond"), [band]);
  const [filter, setFilter] = useState<GrammarCategory | "all">("all");
  const [showBeyond, setShowBeyond] = useState(false);

  const doneCount = all.filter((g) => studied.includes(g.id)).length;
  const pick = (gs: typeof groups) =>
    filter === "all" ? gs : gs.filter((g) => g.category === filter);
  const shown = pick(groups);
  const shownBeyond = pick(beyondGroups);

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">문법</h1>
        <p className="mt-1 text-[13px] text-zinc-400">
          Part 5·6 에서 자리로 푸는 문제들 · {BAND_LABEL[band]} 기준 {all.length}개
        </p>
        <BandLadder countOf={(b) => grammarFor(b).length} />
        <ProgressBar value={doneCount} max={all.length} color="#10b981" className="mt-3" />
        <p className="mt-2 text-[12px] text-zinc-500">
          {doneCount} / {all.length}개 학습
        </p>
      </header>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          전체 {all.length}
        </Chip>
        {groups.map((g) => {
          const extra =
            beyondGroups.find((b) => b.category === g.category)?.items.length ?? 0;
          return (
            <Chip
              key={g.category}
              active={filter === g.category}
              onClick={() => setFilter(g.category)}
            >
              {CATEGORY_LABEL[g.category]} {g.items.length + extra}
            </Chip>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {shown.map((group) => (
          <Group key={group.category} group={group} studied={studied} />
        ))}
      </div>

      {/*
        목표 점수대를 넘어서는 것들.
        접어 두되 없애지는 않는다 — 600을 노려도 시험지에서는 만나기
        때문이다. 다만 먼저 볼 것을 다 본 뒤에 여는 편이 낫다.
      */}
      {beyond.length > 0 && shownBeyond.length > 0 && (
        <section className="mt-8">
          <button
            onClick={() => setShowBeyond((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-colors hover:bg-white/[0.06]"
          >
            <span className="min-w-0">
              <span className="block text-[14px] font-bold">
                {BAND_LABEL[band]}보다 위에 나오는 것 {beyond.length}개
              </span>
              <span className="mt-0.5 block text-[12px] leading-relaxed text-zinc-500">
                지금 목표에 꼭 필요하지는 않지만, 시험지에서는 만납니다.
              </span>
            </span>
            <ChevronRight
              size={18}
              className={cn(
                "shrink-0 text-zinc-500 transition-transform",
                showBeyond && "rotate-90",
              )}
            />
          </button>
          {showBeyond && (
            <div className="mt-4 flex flex-col gap-5">
              {shownBeyond.map((group) => (
                <Group key={group.category} group={group} studied={studied} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function Group({
  group,
  studied,
}: {
  group: { category: GrammarCategory; items: GrammarPoint[] };
  studied: string[];
}) {
  return (
    <section>
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
  );
}
