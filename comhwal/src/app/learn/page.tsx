"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import { SUBJECTS, subjectsFor } from "@/data/subjects";
import { CONCEPTS, conceptsFor, topicsOf } from "@/data/concepts";
import {
  Card,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  SectionTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const grade = useGrade();
  const studiedIds = useApp((s) => s.studiedIds);
  const [q, setQ] = useState("");

  const mine = subjectsFor(grade);

  const found = useMemo(() => {
    const term = q.trim();
    if (term.length < 1) return [];
    const lower = term.toLowerCase();
    return conceptsFor(grade)
      .filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.summary.toLowerCase().includes(lower) ||
          c.topic.includes(term) ||
          c.keywords.some((k) => k.toLowerCase().includes(lower)),
      )
      .slice(0, 30);
  }, [q, grade]);

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold tracking-tight">개념 학습</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {grade}급 범위 {conceptsFor(grade).length}개 개념
      </p>

      <div className="glass mt-4 flex items-center gap-2 rounded-2xl px-3.5 py-3">
        <Search size={16} className="shrink-0 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="개념·용어·키워드 검색"
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
        />
      </div>

      {q.trim() ? (
        found.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="찾는 개념이 없습니다"
            desc={`${grade}급 범위 안에서만 찾습니다. 급수를 바꾸면 범위가 넓어집니다.`}
          />
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {found.map((c) => (
              <Link key={c.id} href={`/concept/${c.id}`}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{c.title}</p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
                        {c.summary}
                      </p>
                    </div>
                    <ImportanceBadge importance={c.importance} compact />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <>
          {SUBJECTS.map((s) => {
            const included = mine.some((x) => x.id === s.id);
            const list = conceptsFor(grade, s.id);
            const done = list.filter((c) => studiedIds.includes(c.id)).length;
            const topics = included ? topicsOf(grade, s.id) : [];
            return (
              <div key={s.id}>
                <SectionTitle>
                  <span className="flex items-center gap-2">
                    <span>{s.symbol}</span>
                    {s.name}
                    {!included && (
                      <span className="text-[11px] font-normal text-zinc-500">
                        1급 전용
                      </span>
                    )}
                  </span>
                </SectionTitle>
                <Link
                  href={included ? `/learn/${s.id}` : "/learn"}
                  className={cn(!included && "pointer-events-none")}
                >
                  <Card className={cn(!included && "opacity-40")}>
                    <p className="text-[13px] leading-relaxed text-zinc-400">
                      {s.description}
                    </p>
                    {included && (
                      <>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            {topics.length}개 갈래 · {list.length}개 개념
                          </span>
                          <span className="font-bold" style={{ color: s.color }}>
                            {done} / {list.length}
                          </span>
                        </div>
                        <ProgressBar
                          value={done}
                          max={list.length}
                          color={s.color}
                          className="mt-2"
                        />
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {topics.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </Card>
                </Link>
              </div>
            );
          })}

          <p className="mt-8 text-[11px] leading-relaxed text-zinc-600">
            전체 데이터에는 {CONCEPTS.length}개 개념이 들어 있습니다. 지금은 {grade}급
            범위만 보이며, 설정에서 급수를 바꾸면 나머지도 함께 열립니다.
          </p>
        </>
      )}
    </div>
  );
}
