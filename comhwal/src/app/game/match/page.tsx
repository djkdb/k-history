"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { makeMatchRound, type PairCard } from "@/lib/game";
import { useApp, useGrade } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * 짝 맞추기 — 용어와 뜻.
 *
 * 카드 열두 장을 뒤집어 용어와 그 뜻을 짝지어 나간다. 읽고 넘기는 것과 달리
 * "이 용어가 무슨 뜻이었지" 를 스스로 떠올려야 하므로 기억에 남는다.
 *
 * 채점을 어떻게 할 것인가가 까다로웠다. 뒤집어서 맞힌 것을 모두 "안다" 로
 * 세면, 열두 장을 다 뒤집어 본 뒤에는 누구나 다 맞힌다 — 그건 기억력이지
 * 지식이 아니다. 그래서 **한 번도 틀린 적 없는 짝만** 아는 것으로 센다.
 * 한 번이라도 잘못 짚었던 짝은 복습 목록으로 보낸다.
 */
const 짝수 = 6;

export default function MatchGame() {
  const grade = useGrade();
  const reviewItem = useApp((s) => s.reviewItem);
  const recordGameBest = useApp((s) => s.recordGameBest);
  const hydrated = useApp((s) => s.hydrated);

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6) + 1);
  const { cards } = useMemo(
    () => makeMatchRound(grade, seed, 짝수),
    [grade, seed],
  );

  const [열린, set열린] = useState<string[]>([]);
  const [맞춘, set맞춘] = useState<string[]>([]);
  const [틀린적, set틀린적] = useState<string[]>([]);
  const [뒤집기, set뒤집기] = useState(0);
  const [잠금, set잠금] = useState(false);
  const 끝났나 = 맞춘.length === 짝수;

  const 뒤집다 = useCallback(
    (card: PairCard) => {
      if (잠금 || 끝났나) return;
      if (맞춘.includes(card.conceptId)) return;
      if (열린.includes(card.key)) return;
      if (열린.length >= 2) return;

      const 다음 = [...열린, card.key];
      set열린(다음);
      set뒤집기((n) => n + 1);
      if (다음.length < 2) return;

      const [a, b] = 다음.map((k) => cards.find((c) => c.key === k)!);
      if (a.conceptId === b.conceptId) {
        set맞춘((m) => [...m, a.conceptId]);
        set열린([]);
        return;
      }
      /* 틀렸다 — 두 장 모두 "틀린 적 있는 짝" 으로 적어 둔다 */
      set틀린적((w) => [...new Set([...w, a.conceptId, b.conceptId])]);
      set잠금(true);
      setTimeout(() => {
        set열린([]);
        set잠금(false);
      }, 700);
    },
    [열린, 맞춘, 잠금, 끝났나, cards],
  );

  /* 한 판이 끝나면 한 번만 기록한다 */
  const [적었나, set적었나] = useState(false);
  useEffect(() => {
    if (!끝났나 || 적었나) return;
    set적었나(true);
    for (const id of 맞춘) reviewItem(id, !틀린적.includes(id));
    recordGameBest("match", 뒤집기);
  }, [끝났나, 적었나, 맞춘, 틀린적, 뒤집기, reviewItem, recordGameBest]);

  function 다시() {
    set열린([]);
    set맞춘([]);
    set틀린적([]);
    set뒤집기(0);
    set잠금(false);
    set적었나(false);
    setSeed(Math.floor(Math.random() * 1e6) + 1);
  }

  if (!hydrated) return <main className="py-20" />;

  return (
    <main className="py-6">
      <div className="flex items-center gap-3">
        <Link
          href="/game"
          aria-label="그만두기"
          className="-m-2 p-2 text-zinc-500 hover:text-zinc-300"
        >
          <ArrowLeft size={17} />
        </Link>
        <ProgressBar
          className="flex-1"
          value={맞춘.length}
          max={짝수}
          color="#6366f1"
        />
        <span className="shrink-0 text-[12px] font-bold tabular-nums text-zinc-400">
          {뒤집기}번 뒤집음
        </span>
      </div>

      <h1 className="sr-only">짝 맞추기</h1>

      {끝났나 ? (
        <>
          <Card className="mt-4 border-indigo-400/30 bg-indigo-500/10">
            <p className="text-[15px] font-bold text-indigo-100">
              {짝수}짝을 {뒤집기}번 만에 맞췄습니다
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-300">
              {틀린적.length === 0
                ? "한 번도 잘못 짚지 않았습니다. 여섯 개념 모두 아는 것으로 셉니다."
                : `한 번이라도 잘못 짚었던 ${틀린적.length}개는 복습 목록으로 보냈습니다. 나머지 ${짝수 - 틀린적.length}개는 아는 것으로 셉니다.`}
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-zinc-500">
              가장 적게 뒤집을 수 있는 횟수는 {짝수 * 2}번입니다.
            </p>
          </Card>
          <div className="mt-4 flex gap-2">
            <Button size="lg" className="flex-1" onClick={다시}>
              <RotateCcw size={16} />한 판 더
            </Button>
            <Link href="/game" className="flex-1">
              <Button size="lg" variant="outline" className="w-full">
                게임으로
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-400">
            용어와 뜻을 짝지으세요. 잘못 짚은 짝은 복습 목록으로 갑니다.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {cards.map((c) => {
              const 맞춤 = 맞춘.includes(c.conceptId);
              const 열림 = 맞춤 || 열린.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => 뒤집다(c)}
                  aria-label={열림 ? c.face : "뒤집힌 카드"}
                  className={cn(
                    "flex min-h-[92px] items-center justify-center rounded-2xl border p-2.5 text-center transition-colors",
                    맞춤
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : 열림
                        ? "border-indigo-400/40 bg-indigo-500/10"
                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                  )}
                >
                  {열림 ? (
                    <span
                      className={cn(
                        "leading-snug",
                        c.kind === "term"
                          ? "text-[13px] font-bold"
                          : "text-[11.5px] text-zinc-200",
                      )}
                    >
                      {c.face}
                    </span>
                  ) : (
                    <span aria-hidden className="text-[20px] text-zinc-600">
                      ?
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
