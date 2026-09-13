"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Search } from "lucide-react";
import { Card, Chip, ImportanceBadge, ProgressBar, SectionTitle } from "@/components/ui";
import { CONCEPTS } from "@/data/concepts";
import { SUBJECTS, type SubjectId } from "@/data/exam";
import { useApp, useTrack } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const track = useTrack();
  const studied = useApp((s) => s.studiedIds);
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let out = CONCEPTS.filter((c) => c.tracks.includes(track));
    if (subject) out = out.filter((c) => c.subject === subject);
    const needle = q.trim().toLowerCase();
    if (needle)
      out = out.filter(
        (c) =>
          c.title.toLowerCase().includes(needle) ||
          c.summary.toLowerCase().includes(needle),
      );
    return out;
  }, [track, subject, q]);

  const done = list.filter((c) => studied.includes(c.id)).length;

  return (
    <main className="py-6">
      <h1 className="text-2xl font-bold tracking-tight">학습</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        {track === "written"
          ? "필기 다섯 과목의 개념입니다. 과목을 골라 훑고, 헷갈리는 짝은 표로 견줘 보세요."
          : "실기에 나오는 개념만 걸러 두었습니다. 실기는 고르는 것이 아니라 적으므로 용어를 그대로 외워야 합니다."}
      </p>

      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <Search size={16} className="shrink-0 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="개념 이름이나 내용으로 찾기"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-zinc-600"
          />
        </div>
      </Card>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip active={subject === null} onClick={() => setSubject(null)}>
          전체 {CONCEPTS.filter((c) => c.tracks.includes(track)).length}
        </Chip>
        {SUBJECTS.map((s) => {
          const n = CONCEPTS.filter(
            (c) => c.subject === s.id && c.tracks.includes(track),
          ).length;
          if (!n) return null;
          return (
            <Chip key={s.id} active={subject === s.id} onClick={() => setSubject(s.id)}>
              {s.symbol} {s.short} {n}
            </Chip>
          );
        })}
      </div>

      <div className="mt-4">
        <ProgressBar value={done} max={Math.max(1, list.length)} />
        <p className="mt-1.5 text-[12px] text-zinc-500">
          {`${list.length}개 가운데 ${done}개를 봤습니다`}
        </p>
      </div>

      <SectionTitle>개념</SectionTitle>
      <div className="flex flex-col gap-2">
        {list.map((c) => {
          const on = studied.includes(c.id);
          return (
            <Link key={c.id} href={`/concept/${c.id}`}>
              <Card className="transition-transform active:scale-[0.99]">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 text-[15px]">
                    {SUBJECTS.find((s) => s.id === c.subject)?.symbol}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className={cn("text-[14px] font-bold", on && "text-zinc-400")}>
                        {c.title}
                      </p>
                      {on && <Check size={13} className="shrink-0 text-emerald-400" />}
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                      {c.summary}
                    </p>
                  </div>
                  <ImportanceBadge level={c.importance} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
