"use client";

import Link from "next/link";
import { ArrowLeft, Check, Lightbulb, Target } from "lucide-react";
import {
  Button,
  Card,
  ImportanceBadge,
  RichText,
  SectionTitle,
} from "@/components/ui";
import { CONCEPTS, CONCEPT_MAP } from "@/data/concepts";
import { SUBJECT_MAP } from "@/data/exam";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ConceptDetail({ id }: { id: string }) {
  const concept = CONCEPT_MAP[id];
  const studied = useApp((s) => s.studiedIds);
  const markStudied = useApp((s) => s.markStudied);

  if (!concept) {
    return (
      <main className="py-20 text-center text-sm text-zinc-500">
        그 개념을 찾지 못했습니다.
      </main>
    );
  }
  const subject = SUBJECT_MAP[concept.subject];
  const on = studied.includes(concept.id);
  const idx = CONCEPTS.findIndex((c) => c.id === concept.id);
  const prev = CONCEPTS[idx - 1];
  const next = CONCEPTS[idx + 1];

  return (
    <main className="py-6">
      <Link
        href="/learn"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        학습
      </Link>

      <header className="mt-4">
        <div className="flex items-center gap-2">
          <span>{subject.symbol}</span>
          <span
            className="text-[12px] font-bold"
            style={{ color: subject.color }}
          >
            {subject.name}
          </span>
          <ImportanceBadge level={concept.importance} />
        </div>
        <h1 className="mt-2 text-xl font-bold leading-snug">{concept.title}</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-300">
          <RichText>{concept.summary}</RichText>
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-3">
        {concept.body.map((p, i) => (
          <p key={i} className="text-[14px] leading-relaxed text-zinc-300">
            <RichText>{p}</RichText>
          </p>
        ))}
      </div>

      {concept.keys && concept.keys.length > 0 && (
        <>
          <SectionTitle>외울 것</SectionTitle>
          <Card>
            <div className="flex flex-col gap-2">
              {concept.keys.map((k) => (
                <div key={k.term} className="flex items-baseline gap-2">
                  <span className="shrink-0 text-[13px] font-bold text-indigo-200">
                    {k.term}
                  </span>
                  <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-zinc-300">
                    <RichText>{k.mean}</RichText>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {concept.traps && concept.traps.length > 0 && (
        <>
          <SectionTitle>바꿔 내는 짝</SectionTitle>
          <div className="flex flex-col gap-2">
            {concept.traps.map((t, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 text-[13px] font-bold">
                  <span className="text-amber-200">{t.a}</span>
                  <span className="text-zinc-600">↔</span>
                  <span className="text-sky-200">{t.b}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                  <RichText>{t.how}</RichText>
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      <SectionTitle>시험에는 이렇게</SectionTitle>
      <Card>
        <div className="flex items-start gap-2.5">
          <Target size={16} className="mt-0.5 shrink-0 text-indigo-300" />
          <p className="text-[13px] leading-relaxed text-zinc-300">
            <RichText>{concept.examPoint}</RichText>
          </p>
        </div>
      </Card>

      {concept.tracks.includes("practical") && (
        <Card className="mt-3">
          <div className="flex items-start gap-2.5">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-emerald-300" />
            <p className="text-[12px] leading-relaxed text-zinc-400">
              실기에도 나오는 개념입니다. 실기는 고르는 것이 아니라 적으므로
              용어를 글자 그대로 외워 두세요.
            </p>
          </div>
        </Card>
      )}

      <Button
        size="lg"
        variant={on ? "outline" : "primary"}
        className="mt-5 w-full"
        onClick={() => markStudied(concept.id)}
        disabled={on}
      >
        <Check size={16} />
        {on ? "본 개념입니다" : "봤습니다 — 복습 목록에 넣기"}
      </Button>

      <div className="mt-6 flex items-stretch gap-2">
        {prev ? (
          <Link href={`/concept/${prev.id}`} className="min-w-0 flex-1">
            <div className="glass h-full rounded-2xl p-3 transition-transform active:scale-[0.98]">
              <span className="text-[11px] text-zinc-500">이전</span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link href={`/concept/${next.id}`} className="min-w-0 flex-1">
            <div className="glass h-full rounded-2xl p-3 text-right transition-transform active:scale-[0.98]">
              <span className="text-[11px] text-zinc-500">다음</span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {next.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </main>
  );
}
