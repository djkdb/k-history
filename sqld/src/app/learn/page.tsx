"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useApp } from "@/lib/store";
import { CHAPTERS, SUBJECTS, chaptersOf, subjectInk } from "@/data/exam";
import { CONCEPTS, conceptsOf, conceptsOfChapter } from "@/data/concepts";
import {
  Card,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  SectionTitle,
} from "@/components/ui";

export default function LearnPage() {
  const studiedIds = useApp((s) => s.studiedIds);
  const [q, setQ] = useState("");

  const found = useMemo(() => {
    const term = q.trim();
    if (term.length < 1) return [];
    const lower = term.toLowerCase();
    return CONCEPTS.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.summary.toLowerCase().includes(lower) ||
        c.keywords.some((k) => k.toLowerCase().includes(lower)),
    ).slice(0, 30);
  }, [q]);

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold tracking-tight">개념 학습</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {SUBJECTS.length}과목 {CHAPTERS.length}개 장 · 개념 {CONCEPTS.length}개
      </p>

      <div className="glass mt-4 flex items-center gap-2 rounded-2xl px-3.5 py-3">
        <Search size={16} className="shrink-0 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="개념·용어·키워드 검색 (JOIN, 정규화, NULL …)"
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
        />
      </div>

      {q.trim() ? (
        found.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="찾는 개념이 없습니다"
            desc="용어의 일부만 넣어도 찾습니다. 영문 함수 이름도 됩니다."
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
            const list = conceptsOf(s.id);
            const done = list.filter((c) => studiedIds.includes(c.id)).length;
            return (
              <div key={s.id}>
                <SectionTitle>
                  <span className="flex items-center gap-2">
                    <span>{s.symbol}</span>
                    {s.name}
                    <span className="text-[11px] font-normal text-zinc-500">
                      {s.count}문항
                    </span>
                  </span>
                </SectionTitle>
                <Link href={`/learn/${s.id}`}>
                  <Card>
                    <p className="text-[13px] leading-relaxed text-zinc-400">
                      {s.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        {chaptersOf(s.id).length}개 장 · {list.length}개 개념
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: subjectInk(s.id) }}
                      >
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
                      {chaptersOf(s.id).map((ch) => (
                        <span
                          key={ch.id}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                        >
                          {ch.name} {conceptsOfChapter(ch.id).length}
                        </span>
                      ))}
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}

          {/*
            어디에 시간을 쓸지의 근거.
            2과목이 배점의 80%다. 이 말을 목록 아래에 한 번 적어 두면
            "골고루 보자"는 잘못된 계획을 미리 막는다.
          */}
          <Card className="mt-6 border-emerald-500/20 bg-emerald-500/[0.06]">
            <p className="text-[13px] font-bold text-emerald-200">
              시간을 어디에 쓸까
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
              2과목이 {SUBJECTS[1].count}문항 {SUBJECTS[1].points}점으로 배점의
              80%를 차지합니다. 1과목을 만점 받아도 2과목이 무너지면 그대로
              끝이므로, 공부 시간도 그 비율에 맞추는 편이 안전합니다.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
