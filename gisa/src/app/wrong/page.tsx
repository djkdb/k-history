"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, PenLine, RotateCw } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  SectionTitle,
  SubjectBadge,
} from "@/components/ui";
import { CONCEPT_MAP } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * 자주 틀리는 곳.
 *
 * 틀린 개념은 복습 큐로 들어가지만, 복습은 "오늘 볼 차례가 된 것" 만 꺼내
 * 준다. 그래서 몇 번을 되풀이해 틀렸는지는 어디에도 드러나지 않았다.
 *
 * 남은 시간이 얼마 없을 때 필요한 것은 "오늘 볼 것" 이 아니라 "내가 계속
 * 틀리는 것" 이다. 되틀린 횟수(lapses)로 줄을 세워 위에서부터 보여 준다.
 * 한 번 틀린 것과 네 번 틀린 것을 같은 줄에 두면 고를 수가 없다.
 */
export default function WrongPage() {
  const hydrated = useApp((s) => s.hydrated);
  const cards = useApp((s) => s.reviewCards);
  const wrongIds = useApp((s) => s.wrongIds);

  const rows = useMemo(() => {
    const byId = new Map(cards.map((c) => [c.sourceId, c]));
    const ids = new Set([...wrongIds, ...cards.filter((c) => c.lapses > 0).map((c) => c.sourceId)]);
    return [...ids]
      .map((id) => {
        const c = byId.get(id);
        return {
          id,
          concept: CONCEPT_MAP[id],
          lapses: c?.lapses ?? 0,
          /** 지금도 틀린 채로 남아 있는가 (맞히면 빠진다) */
          open: wrongIds.includes(id),
          written: QUESTIONS.filter((q) => q.sourceId === id).length,
          practical: PRACTICAL_QUESTIONS.filter((q) => q.sourceId === id).length,
        };
      })
      .filter((r) => r.concept)
      .sort((a, b) => b.lapses - a.lapses || Number(b.open) - Number(a.open));
  }, [cards, wrongIds]);

  if (!hydrated) return <main className="py-20" />;

  return (
    <main className="py-6">
      <Link
        href="/"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        홈으로
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight">자주 틀리는 곳</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
        되풀이해 틀린 순서로 줄을 세웠습니다. 남은 시간이 얼마 없다면 위에서부터
        붙드세요.
      </p>

      {rows.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="아직 틀린 곳이 없습니다"
          heading
          desc="문제를 풀면 틀린 개념이 여기에 쌓입니다."
          action={
            <Link href="/quiz">
              <Button size="sm">문제 풀러 가기</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="mt-4 flex gap-2">
            <Link href="/quiz?wrong=1" className="flex-1">
              <Button size="sm" className="w-full">
                <Brain size={14} />
                틀린 것만 풀기
              </Button>
            </Link>
            <Link href="/practical" className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <PenLine size={14} />
                실기로 적어 보기
              </Button>
            </Link>
          </div>

          <SectionTitle>개념 {rows.length}개</SectionTitle>
          <div className="flex flex-col gap-2">
            {rows.map((r) => (
              <Link key={r.id} href={`/concept/${r.id}`}>
                <Card
                  className={cn(
                    r.lapses >= 3 && "border-rose-500/30 bg-rose-500/[0.06]",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <SubjectBadge subject={r.concept!.subject} />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold">
                      {r.concept!.title}
                    </span>
                    {r.lapses > 0 && (
                      <span
                        className={cn(
                          "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                          r.lapses >= 3
                            ? "bg-rose-500/20 text-rose-200"
                            : "bg-white/10 text-zinc-300",
                        )}
                      >
                        <RotateCw size={11} />
                        {r.lapses}번
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-400">
                    {r.concept!.summary}
                  </p>
                  <p className="mt-1.5 text-[11px] text-zinc-500">
                    {r.open ? "아직 못 맞혔습니다 · " : ""}
                    이 개념의 문항 — 필기 {r.written}개
                    {r.practical > 0 ? ` · 실기 ${r.practical}개` : ""}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
