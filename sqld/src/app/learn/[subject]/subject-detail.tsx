"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Terminal, TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/store";
import type { SubjectId } from "@/lib/types";
import { SUBJECT_MAP, chaptersOf, cutoff, subjectInk } from "@/data/exam";
import { conceptsOf, conceptsOfChapter } from "@/data/concepts";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export function SubjectDetail() {
  const params = useParams<{ subject: string }>();
  const studiedIds = useApp((s) => s.studiedIds);
  const [chapter, setChapter] = useState<string | null>(null);

  const subject = SUBJECT_MAP[params.subject as SubjectId];
  const chapters = useMemo(
    () => (subject ? chaptersOf(subject.id) : []),
    [subject],
  );
  const list = useMemo(
    () =>
      subject
        ? chapter
          ? conceptsOfChapter(chapter)
          : conceptsOf(subject.id)
        : [],
    [subject, chapter],
  );

  if (!subject) {
    return (
      <div className="pt-6">
        <EmptyState
          icon="❓"
          title="없는 과목입니다"
          action={
            <Link href="/learn">
              <Button size="sm">학습으로</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const all = conceptsOf(subject.id);
  const done = all.filter((c) => studiedIds.includes(c.id)).length;
  const activeChapter = chapters.find((c) => c.id === chapter);

  return (
    <div className="pt-6">
      <Link
        href="/learn"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        개념 학습
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">
            {subject.symbol} {subject.name}
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
            {subject.description}
          </p>
        </div>
        <span
          className="shrink-0 text-lg font-bold"
          style={{ color: subjectInk(subject.id) }}
        >
          {all.length ? Math.round((done / all.length) * 100) : 0}%
        </span>
      </div>

      <ProgressBar
        value={done}
        max={all.length}
        color={subject.color}
        className="mt-3"
      />
      <p className="mt-2 text-[11px] text-zinc-500">
        {done} / {all.length}개 학습 · 실제 시험 {subject.count}문항{" "}
        {subject.points}점 · {cutoff(subject.id)}문항 미만이면 과락
      </p>

      {/* 이 과목에서 점수를 잃는 이유 — 목록보다 먼저 읽혀야 한다 */}
      <Card className="mt-4 border-rose-500/20 bg-rose-500/[0.06]">
        <div className="flex items-start gap-2">
          <TriangleAlert size={15} className="mt-0.5 shrink-0 text-rose-300" />
          <p className="text-[13px] leading-relaxed text-zinc-300">
            {subject.trap}
          </p>
        </div>
      </Card>

      <ScrollRow className="mt-5">
        <Chip active={chapter === null} onClick={() => setChapter(null)}>
          전체 {all.length}
        </Chip>
        {chapters.map((ch) => (
          <Chip
            key={ch.id}
            active={chapter === ch.id}
            onClick={() => setChapter(ch.id)}
          >
            {ch.name} {conceptsOfChapter(ch.id).length}
          </Chip>
        ))}
      </ScrollRow>

      {activeChapter && (
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-500">
          {activeChapter.summary}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {list.map((c) => {
          const studied = studiedIds.includes(c.id);
          return (
            <Link key={c.id} href={`/concept/${c.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold">
                      {studied && (
                        <Check size={14} className="shrink-0 text-emerald-400" />
                      )}
                      <span className={cn("min-w-0", studied && "text-zinc-400")}>
                        {c.title}
                      </span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
                      {c.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {c.sql && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                          <Terminal size={11} />
                          돌려 볼 쿼리
                        </span>
                      )}
                      {c.traps.length > 0 && (
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                          헷갈리는 짝 {c.traps.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <ImportanceBadge importance={c.importance} compact />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
