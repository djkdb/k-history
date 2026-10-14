"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Search, Star } from "lucide-react";
import { Gate } from "@/components/gate";
import { Card, Chip, ImportanceBadge, ProgressBar } from "@/components/ui";
import { COURSE, CHAPTER_MAP, conceptsOf, termLabel } from "@/lib/course";
import { normalize } from "@/lib/grade";
import { useApp } from "@/lib/store";

export default function Learn() {
  return (
    <Gate>
      <LearnView />
    </Gate>
  );
}

function LearnView() {
  const studied = useApp((s) => s.studied);
  const starred = useApp((s) => s.starred);
  const [query, setQuery] = useState("");
  const [onlyStar, setOnlyStar] = useState(false);

  // 홈의 "별표한 개념" 에서 왔으면 별표만 보인다
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("starred") === "1") setOnlyStar(true);
  }, []);

  const hits = useMemo(() => {
    const k = normalize(query);
    if (!k && !onlyStar) return null;
    return COURSE.concepts.filter((c) => {
      if (onlyStar && !starred.includes(c.id)) return false;
      if (!k) return true;
      const hay = normalize([c.title, c.en ?? "", c.summary, ...c.points].join(" "));
      return hay.includes(k);
    });
  }, [query, onlyStar, starred]);

  return (
    <main className="py-6">
      <h1 className="text-[22px] font-bold tracking-tight">개념</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        강의 자료 {COURSE.chapters.length}개 · 개념 {COURSE.concepts.length}개
      </p>

      <label className="mt-4 flex items-center lg:max-w-xl gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
        <Search size={16} className="shrink-0 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={COURSE.englishExam ? "용어 찾기 (영어·한국어)" : "용어 찾기"}
          className="min-w-0 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-zinc-500"
          aria-label="개념 찾기"
        />
      </label>
      <div className="mt-2 flex gap-2">
        <Chip active={onlyStar} onClick={() => setOnlyStar((v) => !v)}>
          <Star size={13} className="mr-1 inline" /> 별표만 ({starred.length})
        </Chip>
      </div>

      {hits ? (
        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {hits.length === 0 && <p className="py-6 text-center text-[13.5px] text-zinc-400">찾는 개념이 없습니다.</p>}
          {hits.map((c) => (
            <Link key={c.id} href={`/concept/${c.id}`}>
              <Card className="py-3">
                <div className="flex items-center gap-2">
                  {studied[c.id] && <CheckCircle2 size={15} className="shrink-0 text-emerald-300" />}
                  <p className="min-w-0 flex-1 truncate text-[14px] font-bold">{termLabel(c)}</p>
                  <ImportanceBadge level={c.importance} compact />
                </div>
                <p className="mt-1 truncate text-[12px] text-zinc-400">{CHAPTER_MAP[c.chapter]?.title}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-2 lg:grid-cols-2 lg:gap-3">
          {COURSE.chapters.map((ch, i) => {
            const cs = conceptsOf(ch.id);
            const done = cs.filter((c) => studied[c.id]).length;
            return (
              <Link key={ch.id} href={`/learn/${ch.id}`} className="flex">
                <Card className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-500/15 text-[12px] font-bold text-indigo-200">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-bold">{ch.title}</p>
                      {ch.en && <p className="text-[12px] text-zinc-400">{ch.en}</p>}
                      <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">{ch.blurb}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar value={done} max={cs.length} className="flex-1" />
                        <span className="text-[11.5px] text-zinc-400">
                          {done}/{cs.length}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-zinc-500" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
