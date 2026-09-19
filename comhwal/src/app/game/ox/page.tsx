"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Flame, RotateCcw, X } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { makeOxRound, type OxItem } from "@/lib/game";
import { useApp, useGrade } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * O/X 번개.
 *
 * 시험의 "옳지 않은 것을 고르시오" 는 결국 한 문장이 참인지 거짓인지를
 * 가리는 일이다. 그 판단만 떼어 내 빠르게 되풀이한다.
 *
 * 10초를 두는 까닭 — 시간이 없으면 외운 문장을 떠올리는 대신 뜻을 붙들게
 * 된다. 다만 시간이 다 되어 넘어간 것은 "틀렸다" 로 센다. 시험장에서도
 * 못 고른 것은 틀린 것이다.
 */
const 한판 = 20;
const 제한 = 10_000;

type Phase = "play" | "done";

export default function OxGame() {
  const grade = useGrade();
  const recordQuizResult = useApp((s) => s.recordQuizResult);
  const recordGameBest = useApp((s) => s.recordGameBest);
  const hydrated = useApp((s) => s.hydrated);

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6) + 1);
  const items = useMemo(() => makeOxRound(grade, seed, 한판), [grade, seed]);
  const [at, setAt] = useState(0);
  const [phase, setPhase] = useState<Phase>("play");
  const [picked, setPicked] = useState<boolean | null>(null);
  const [marks, setMarks] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [left, setLeft] = useState(제한);

  const q: OxItem | undefined = items[at];
  const 답함 = picked !== null;

  const answer = useCallback(
    (say: boolean | null) => {
      if (picked !== null || !q) return;
      const correct = say !== null && say === q.isTrue;
      setPicked(say ?? !q.isTrue); // 시간이 다 되면 틀린 쪽을 고른 것으로 둔다
      setMarks((m) => [...m, correct]);
      setStreak((s) => {
        const n = correct ? s + 1 : 0;
        setBest((b) => Math.max(b, n));
        return n;
      });
      recordQuizResult({
        questionId: `g-ox-${q.conceptId}-${Date.now()}`,
        sourceId: q.conceptId,
        subject: "practical",
        type: "trap",
        correct,
        answeredAt: Date.now(),
      });
    },
    [picked, q, recordQuizResult],
  );

  /* 남은 시간 */
  const 끝난시각 = useRef(0);
  useEffect(() => {
    if (phase !== "play" || 답함 || !q) return;
    끝난시각.current = Date.now() + 제한;
    setLeft(제한);
    const t = setInterval(() => {
      const 남음 = Math.max(0, 끝난시각.current - Date.now());
      setLeft(남음);
      if (남음 === 0) answer(null);
    }, 100);
    return () => clearInterval(t);
  }, [phase, 답함, q, answer, at]);

  function next() {
    if (at + 1 >= items.length) {
      recordGameBest("ox", Math.max(best, streak));
      setPhase("done");
      return;
    }
    setAt((i) => i + 1);
    setPicked(null);
  }

  function 다시() {
    setSeed(Math.floor(Math.random() * 1e6) + 1);
    setAt(0);
    setPicked(null);
    setMarks([]);
    setStreak(0);
    setBest(0);
    setPhase("play");
  }

  if (!hydrated) return <main className="py-20" />;

  if (phase === "done") {
    const 맞힘 = marks.filter(Boolean).length;
    return (
      <main className="py-6">
        <h1 className="text-xl font-bold tracking-tight">한 판 끝</h1>
        <Card className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums">{맞힘}</span>
            <span className="text-[15px] text-zinc-400">/ {items.length}</span>
            <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold text-amber-300">
              <Flame size={14} />
              최고 {best}연속
            </span>
          </div>
          <ProgressBar
            className="mt-3"
            value={맞힘}
            max={items.length}
            color="#f59e0b"
          />
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">
            {맞힘 === items.length
              ? "다 맞혔습니다. 이 짝들은 이제 시험장에서도 갈릴 겁니다."
              : `틀린 ${items.length - 맞힘}개는 복습 목록에 넣어 두었습니다. 복습 탭에서 다시 만납니다.`}
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
      </main>
    );
  }

  if (!q) return <main className="py-20" />;

  const 정답 = 답함 && picked === q.isTrue;

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
          value={at + (답함 ? 1 : 0)}
          max={items.length}
          color="#f59e0b"
        />
        <span className="shrink-0 text-[12px] font-bold tabular-nums text-zinc-400">
          {at + 1}/{items.length}
        </span>
      </div>

      {/* 남은 시간 — 색이 아니라 길이로 알린다. 색만으로 알리면 못 보는 사람이 있다 */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{
            width: `${(left / 제한) * 100}%`,
            background: left < 3000 ? "#fb7185" : "#f59e0b",
          }}
        />
      </div>
      <p className="mt-1 text-right text-[11px] font-semibold tabular-nums text-zinc-500">
        {답함 ? "시간 멈춤" : `${Math.ceil(left / 1000)}초`}
      </p>

      <h1 className="sr-only">O/X 번개</h1>

      <Card className="mt-3">
        <p className="text-[11.5px] font-semibold text-zinc-500">{q.pair}</p>
        <p className="mt-2 text-[15px] font-bold leading-relaxed">
          {q.statement}
        </p>
      </Card>

      {!답함 ? (
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Button size="lg" className="h-20 text-lg" onClick={() => answer(true)}>
            맞다
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-20 text-lg"
            onClick={() => answer(false)}
          >
            틀리다
          </Button>
        </div>
      ) : (
        <>
          <Card
            className={cn(
              "mt-4",
              정답
                ? "border-emerald-400/30 bg-emerald-500/10"
                : "border-rose-400/30 bg-rose-500/10",
            )}
          >
            <div className="flex items-center gap-1.5">
              {정답 ? (
                <Check size={15} className="text-emerald-300" />
              ) : (
                <X size={15} className="text-rose-300" />
              )}
              <span
                className={cn(
                  "text-[13px] font-bold",
                  정답 ? "text-emerald-200" : "text-rose-200",
                )}
              >
                {정답
                  ? q.isTrue
                    ? "맞습니다 — 바른 설명입니다"
                    : "맞습니다 — 뒤바꿔 놓은 설명이었습니다"
                  : left === 0
                    ? "시간이 다 됐습니다"
                    : q.isTrue
                      ? "바른 설명이었습니다"
                      : "뒤바꿔 놓은 설명이었습니다"}
              </span>
            </div>
            {!q.isTrue && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-200">
                바르게는 — {q.truth}
              </p>
            )}
            <Link
              href={`/concept/${q.conceptId}`}
              className="-my-1 mt-2 inline-flex items-center gap-1 py-1 text-[11.5px] font-semibold text-zinc-400 hover:text-zinc-200"
            >
              {q.conceptTitle} 보기 →
            </Link>
          </Card>

          <Button size="lg" className="mt-4 w-full" onClick={next}>
            {at + 1 >= items.length ? "결과 보기" : "다음"}
          </Button>
        </>
      )}

      {streak >= 3 && !답함 && (
        <p className="mt-3 text-center text-[12px] font-bold text-amber-300">
          <Flame size={12} className="inline" /> {streak}연속
        </p>
      )}
    </main>
  );
}
