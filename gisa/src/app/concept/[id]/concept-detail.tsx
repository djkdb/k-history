"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Check, Lightbulb, RotateCw, Target } from "lucide-react";
import {
  Button,
  Card,
  ImportanceBadge,
  RichText,
  SectionTitle,
} from "@/components/ui";
import { CONCEPTS, CONCEPT_MAP } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { SUBJECT_MAP, subjectInk } from "@/data/exam";
import { WrittenQuestionCard } from "@/components/written-question";
import { shuffleOptions } from "@/lib/quiz";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ConceptDetail({ id }: { id: string }) {
  const concept = CONCEPT_MAP[id];
  const studied = useApp((s) => s.studiedIds);
  const markStudied = useApp((s) => s.markStudied);
  const recordAnswer = useApp((s) => s.recordAnswer);

  /*
   * 이 개념에 딸린 문항.
   *
   * 읽은 것과 답할 수 있는 것은 다르다. 개념을 덮고 문제 탭까지 가야
   * 확인이 되면 대부분 그냥 넘어가므로, 읽은 자리에서 바로 물어본다.
   * 씨앗을 개념 id 로 삼아 같은 개념에서는 늘 같은 차례로 나오게 했다 —
   * 새로 고칠 때마다 순서가 달라지면 "아까 그 문제" 를 찾을 수 없다.
   */
  const checks = useMemo(() => {
    const seed = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    return QUESTIONS.filter((q) => q.sourceId === id).map((q) =>
      shuffleOptions(q, seed),
    );
  }, [id]);
  const written = useMemo(
    () => PRACTICAL_QUESTIONS.filter((q) => q.sourceId === id),
    [id],
  );
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

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
            /* 과목의 원래 색은 막대·점을 칠하는 값이다. 글자에 그대로 쓰면
               밝은 화면에서 옅은 노랑이 흰 바탕에 얹혀 1.46:1 이 된다.
               글자에는 테마마다 따로 둔 subjectInk 를 쓴다. */
            style={{ color: subjectInk(subject.id) }}
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

      {/*
        확인 문제.

        펼치기 전에는 문제를 보여 주지 않는다. 바로 위에 설명이 그대로 적혀
        있어서 문제가 함께 보이면 기억에서 꺼내는 것이 아니라 눈으로 베끼게
        된다. 누르면 그 자리로 옮겨 주어 설명이 화면 밖으로 밀려나게 한다.
      */}
      {checks.length > 0 && (
        <section id="check" className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={15} className="text-indigo-300" />
              <h2 className="text-sm font-bold">확인 문제</h2>
            </div>
            {open && (
              <span className="text-[11px] tabular-nums text-zinc-500">
                {at + 1} / {checks.length}
              </span>
            )}
          </div>

          {!open ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setOpen(true);
                requestAnimationFrame(() =>
                  document
                    .getElementById("check")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                );
              }}
            >
              <Brain size={15} />
              가리고 풀어 보기 · {checks.length}문항
            </Button>
          ) : (
            <Card>
              <WrittenQuestionCard
                key={checks[at].id}
                q={checks[at]}
                picked={picked}
                revealed={picked !== null}
                showSubject={false}
                linkConcept={false}
                onPick={(i) => {
                  if (picked !== null) return;
                  setPicked(i);
                  const correct = i === checks[at].answerIndex;
                  recordAnswer(checks[at].id, concept.id, correct);
                  // 맞혔으면 아래 단추를 또 누르게 하지 않는다
                  if (correct && !on) markStudied(concept.id);
                }}
              />
              {picked !== null && at + 1 < checks.length && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    setAt(at + 1);
                    setPicked(null);
                  }}
                >
                  다음 문항
                </Button>
              )}
              {picked !== null && at + 1 >= checks.length && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => {
                    setAt(0);
                    setPicked(null);
                  }}
                >
                  <RotateCw size={15} />
                  처음부터 다시
                </Button>
              )}
            </Card>
          )}

          {written.length > 0 && (
            <p className="mt-2.5 text-[12px] leading-relaxed text-zinc-500">
              이 개념은 실기에도 {written.length}문항 나옵니다. 고르는 것과 적는
              것은 다르니 실기 탭에서 손으로도 한 번 적어 보세요.
            </p>
          )}
        </section>
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
