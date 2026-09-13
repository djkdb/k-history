"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Check, RotateCcw, X } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  ProgressBar,
  RichText,
  SectionTitle,
  SubjectBadge,
} from "@/components/ui";
import { PracticalQuestionCard } from "@/components/practical-question";
import { CONCEPT_MAP } from "@/data/concepts";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import type { GradeResult } from "@/lib/grade";
import { dueCards, nextDueLabel, retentionRate } from "@/lib/srs";
import { useApp, useTrack } from "@/lib/store";

/**
 * 복습.
 *
 * ⚠️ 큐는 한 번만 고정한다. 매 렌더마다 다시 계산하면 한 장을 풀자마자
 *    그 카드가 목록에서 빠지면서 남은 장 수가 튀고, 마지막 한 장이 화면에서
 *    사라져 끝낼 수 없게 된다.
 *
 * ⚠️ 다만 "첫 렌더" 에 고정하면 안 된다. 저장된 기록은 IndexedDB 에서 비동기로
 *    올라오므로 첫 렌더 시점의 reviewCards 는 늘 빈 배열이다. 그대로 고정하면
 *    쌓아 둔 복습 카드가 몇 장이든 화면은 언제나 "복습할 것이 없습니다" 가 된다.
 *    기록을 다 불러온 뒤에 한 번 고정한다.
 */
export default function Page() {
  const hydrated = useApp((s) => s.hydrated);
  const cards = useApp((s) => s.reviewCards);
  const reviewItem = useApp((s) => s.reviewItem);
  const track = useTrack();

  const [queue, setQueue] = useState<string[] | null>(null);
  useEffect(() => {
    if (!hydrated || queue !== null) return;
    setQueue(dueCards(cards).map((c) => c.sourceId));
  }, [cards, hydrated, queue]);
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [marks, setMarks] = useState<boolean[]>([]);

  const retention = useMemo(() => retentionRate(cards), [cards]);
  const upcoming = useMemo(
    () =>
      [...cards]
        .filter((c) => c.nextDueAt > Date.now())
        .sort((a, b) => a.nextDueAt - b.nextDueAt)
        .slice(0, 5),
    [cards],
  );

  const sourceId = queue ? queue[at] : undefined;
  const concept = sourceId ? CONCEPT_MAP[sourceId] : undefined;
  // 실기를 준비하는 사람에게는 같은 개념을 "적어 보는" 쪽으로 낸다
  const practical = useMemo(() => {
    if (track !== "practical" || !sourceId) return undefined;
    return PRACTICAL_QUESTIONS.find((q) => q.sourceId === sourceId);
  }, [track, sourceId]);

  function answer(correct: boolean) {
    if (!sourceId) return;
    reviewItem(sourceId, correct);
    setMarks((m) => [...m, correct]);
    setAt((a) => a + 1);
    setOpen(false);
    setValue("");
    setResult(null);
  }

  if (queue === null) {
    return (
      <main className="py-20 text-center text-sm text-zinc-500">
        불러오는 중…
      </main>
    );
  }

  if (queue.length === 0) {
    return (
      <main className="py-6">
        <h1 className="text-xl font-bold tracking-tight">복습</h1>
        <EmptyState
          icon="🌱"
          title={
            cards.length === 0
              ? "아직 복습할 것이 없습니다"
              : "오늘 몫은 끝났습니다"
          }
          desc={
            cards.length === 0
              ? "개념을 보거나 문제를 풀면 이곳에 쌓입니다."
              : "틀린 것과 방금 본 것은 정해진 간격으로 다시 올라옵니다."
          }
          action={
            <Link href={cards.length === 0 ? "/learn" : "/quiz"}>
              <Button>
                {cards.length === 0 ? "학습하러 가기" : "문제 더 풀기"}
              </Button>
            </Link>
          }
        />
        {upcoming.length > 0 && (
          <>
            <SectionTitle>다음 차례</SectionTitle>
            <div className="flex flex-col gap-2">
              {upcoming.map((c) => {
                const k = CONCEPT_MAP[c.sourceId];
                return (
                  <Card key={c.sourceId}>
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                        {k?.title ?? c.sourceId}
                      </span>
                      <span className="shrink-0 text-[12px] text-zinc-500">
                        {nextDueLabel(c)}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    );
  }

  if (at >= queue.length) {
    const correct = marks.filter(Boolean).length;
    return (
      <main className="py-6">
        <EmptyState
          icon="🧠"
          title={`${queue.length}장 중 ${correct}장을 기억했습니다`}
          desc="기억한 것은 간격을 늘려 다시 올라오고, 흐린 것은 오늘 안에 다시 나옵니다."
        />
        <div className="flex flex-col gap-2">
          <Link href="/quiz">
            <Button size="lg" className="w-full">
              문제 풀러 가기
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              홈으로
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!concept && !practical) {
    // 개념이 지워졌거나 못 찾는 id — 넘어가되 큐를 멈추지 않는다
    return (
      <main className="py-6">
        <Card>
          <p className="text-[13px] text-zinc-400">
            이 카드가 가리키는 개념을 찾지 못했습니다.
          </p>
          <Button className="mt-3 w-full" onClick={() => answer(true)}>
            건너뛰기
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="py-6">
      <div className="flex items-center gap-3">
        <ProgressBar
          className="flex-1"
          value={at}
          max={queue.length}
          color="#6366f1"
        />
        <span className="shrink-0 text-[12px] font-bold tabular-nums text-zinc-500">
          {at + 1} / {queue.length}
        </span>
      </div>
      {cards.length > 0 && (
        <p className="mt-2 text-[11px] text-zinc-500">
          지금 기억 보존율 {Math.round(retention * 100)}%
        </p>
      )}

      {practical ? (
        <>
          <div className="mt-5">
            <PracticalQuestionCard
              q={practical}
              value={value}
              onChange={setValue}
              result={result}
              onGrade={setResult}
              showPoints={false}
            />
          </div>
          {result && (
            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={() => answer(result.judgement === "correct")}
            >
              다음
              <ArrowRight size={16} />
            </Button>
          )}
        </>
      ) : (
        <>
          <Card className="mt-5">
            <div className="flex items-center gap-2">
              <SubjectBadge subject={concept!.subject} />
              <Brain size={14} className="text-indigo-300" />
            </div>
            <h2 className="mt-3 text-lg font-bold leading-snug">
              {concept!.title}
            </h2>
            {!open ? (
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
                이 개념을 설명할 수 있나요? 머릿속으로 말해 본 다음 펼치세요.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                <p className="text-[14px] leading-relaxed text-zinc-200">
                  <RichText>{concept!.summary}</RichText>
                </p>
                {concept!.keys?.slice(0, 3).map((k) => (
                  <div key={k.term} className="flex items-baseline gap-2">
                    <span className="shrink-0 text-[12px] font-bold text-indigo-200">
                      {k.term}
                    </span>
                    <span className="min-w-0 flex-1 text-[12px] leading-relaxed text-zinc-400">
                      <RichText>{k.mean}</RichText>
                    </span>
                  </div>
                ))}
                <p className="text-[12px] leading-relaxed text-zinc-400">
                  <RichText>{concept!.examPoint}</RichText>
                </p>
                <Link
                  href={`/concept/${concept!.id}`}
                  className="text-[12px] font-semibold text-indigo-300"
                >
                  개념 전체 보기 →
                </Link>
              </div>
            )}
          </Card>

          {!open ? (
            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={() => setOpen(true)}
            >
              답 보기
            </Button>
          ) : (
            <div className="mt-5 flex gap-2">
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => answer(false)}
              >
                <RotateCcw size={16} />
                다시
              </Button>
              <Button size="lg" className="flex-1" onClick={() => answer(true)}>
                <Check size={16} />
                기억났어요
              </Button>
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => answer(false)}
        className="mx-auto mt-6 flex items-center gap-1.5 p-2 text-[12px] text-zinc-600 hover:text-zinc-400"
      >
        <X size={13} />이 장은 건너뛰기
      </button>
    </main>
  );
}
