"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, RotateCcw, Timer, X } from "lucide-react";
import { Button, Card, KeyCaps, ProgressBar } from "@/components/ui";
import { keyChips, shortcutPool } from "@/lib/game";
import {
  capturableKeys,
  gradeShortcut,
  isModifierOnly,
  keyString,
  prettyKey,
} from "@/lib/shortcut";
import { useApp, useGrade } from "@/lib/store";
import { cn, shuffleSeeded } from "@/lib/utils";

/**
 * 단축키 치기.
 *
 * 실기는 제한 시간이 짧아 아는 기능도 메뉴를 뒤지면 늦는다. 손이 먼저
 * 기억해야 한다. 그래서 자판이 있으면 **진짜로 눌러서** 맞힌다.
 *
 * 폰에는 Ctrl 이 없다. 그렇다고 폰 쓰는 사람에게 이 게임을 막으면, 정작
 * 지하철에서 짬을 내는 사람이 못 하게 된다. 폰에서는 조각을 눌러 조합을
 * 맞춘다 — 손가락 기억은 아니지만 "무엇을 누르는가" 는 남는다.
 */
const 한판 = 12;
const 제한 = 90_000;

type Phase = "ready" | "play" | "done";

export default function KeyGame() {
  const grade = useGrade();
  const recordPractice = useApp((s) => s.recordPractice);
  const recordGameBest = useApp((s) => s.recordGameBest);
  const hydrated = useApp((s) => s.hydrated);

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6) + 1);
  const pool = useMemo(
    () => shuffleSeeded(shortcutPool(grade), seed).slice(0, 한판),
    [grade, seed],
  );
  const [phase, setPhase] = useState<Phase>("ready");
  const [at, setAt] = useState(0);
  const [marks, setMarks] = useState<boolean[]>([]);
  const [tapped, setTapped] = useState<string[]>([]);
  const [judged, setJudged] = useState<boolean | null>(null);
  const [left, setLeft] = useState(제한);

  const sc = pool[at];
  const chips = useMemo(() => (sc ? keyChips(sc, seed + at) : []), [sc, seed, at]);

  const 채점 = useCallback(
    (pressed: string) => {
      if (!sc || judged !== null) return;
      const ok = gradeShortcut(pressed, sc);
      setJudged(ok);
      setMarks((m) => [...m, ok]);
      recordPractice("shortcut", sc.id, ok);
    },
    [sc, judged, recordPractice],
  );

  /* 자판이 있는 기기 — 진짜로 눌러서 맞힌다 */
  useEffect(() => {
    if (phase !== "play" || judged !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (isModifierOnly(e)) return;
      e.preventDefault();
      채점(keyString(e));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, judged, 채점]);

  /* 한 판 시간 */
  const 끝 = useRef(0);
  useEffect(() => {
    if (phase !== "play") return;
    끝.current = Date.now() + 제한;
    const t = setInterval(() => {
      const 남음 = Math.max(0, 끝.current - Date.now());
      setLeft(남음);
      if (남음 === 0) {
        clearInterval(t);
        setPhase("done");
      }
    }, 200);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") recordGameBest("keys", marks.filter(Boolean).length);
  }, [phase, marks, recordGameBest]);

  function next() {
    setTapped([]);
    setJudged(null);
    if (at + 1 >= pool.length) setPhase("done");
    else setAt((i) => i + 1);
  }

  function 다시() {
    setSeed(Math.floor(Math.random() * 1e6) + 1);
    setAt(0);
    setMarks([]);
    setTapped([]);
    setJudged(null);
    setLeft(제한);
    setPhase("play");
  }

  if (!hydrated) return <main className="py-20" />;

  if (phase === "ready") {
    return (
      <main className="py-6">
        <Link
          href="/game"
          className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft size={15} />
          게임으로
        </Link>
        <h1 className="mt-3 text-xl font-bold tracking-tight">단축키 치기</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
          90초 안에 {한판}개를 맞힙니다. 자판이 있으면 그대로 누르세요 —
          조합을 누르면 바로 채점됩니다. 폰에서는 아래 조각을 눌러 맞추면
          됩니다.
        </p>
        <Card className="mt-4">
          <p className="text-[12.5px] leading-relaxed text-zinc-400">
            브라우저가 가로채는 조합(Ctrl+N, F11 같은 것)은 눌러서 맞힐 방법이
            없어 이 게임에 내지 않습니다. 그런 것은 학습 화면에서 보세요.
          </p>
        </Card>
        <Button size="lg" className="mt-4 w-full" onClick={다시}>
          시작
        </Button>
      </main>
    );
  }

  if (phase === "done") {
    const 맞힘 = marks.filter(Boolean).length;
    return (
      <main className="py-6">
        <h1 className="text-xl font-bold tracking-tight">한 판 끝</h1>
        <Card className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums">{맞힘}</span>
            <span className="text-[15px] text-zinc-400">
              / {marks.length}개 맞힘
            </span>
          </div>
          <ProgressBar
            className="mt-3"
            value={맞힘}
            max={Math.max(1, marks.length)}
            color="#10b981"
          />
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">
            {marks.length < pool.length
              ? "시간이 다 됐습니다. 남은 것은 다음 판에 다시 나옵니다."
              : "끝까지 다 쳤습니다."}
            {맞힘 < marks.length &&
              " 틀린 것은 복습 목록에 넣어 두었습니다."}
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

  if (!sc) return <main className="py-20" />;

  const 만든것 = tapped.join("+");
  const 정답표기 = prettyKey(capturableKeys(sc)[0] ?? sc.keys[0]);

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
          value={at + (judged !== null ? 1 : 0)}
          max={pool.length}
          color="#10b981"
        />
        <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold tabular-nums text-zinc-400">
          <Timer size={12} />
          {Math.ceil(left / 1000)}초
        </span>
      </div>

      <h1 className="sr-only">단축키 치기</h1>

      <Card className="mt-3">
        <p className="text-[11.5px] font-semibold text-zinc-500">
          {sc.app === "excel" ? "엑셀" : sc.app === "access" ? "액세스" : "공통"}{" "}
          · {sc.topic}
        </p>
        <p className="mt-2 text-[16px] font-bold leading-relaxed">{sc.action}</p>
      </Card>

      {judged === null ? (
        <>
          {/* 지금까지 누른 조각 */}
          <div className="mt-4 flex min-h-[48px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            {tapped.length === 0 ? (
              <span className="text-[12.5px] text-zinc-500">
                키를 누르거나, 아래에서 골라 맞추세요
              </span>
            ) : (
              <KeyCaps combo={만든것} size="lg" />
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() =>
                  setTapped((t) => (t.includes(k) ? t : [...t, k]))
                }
                disabled={tapped.includes(k)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-[13px] font-bold transition-colors",
                  tapped.includes(k)
                    ? "border-white/5 bg-white/[0.02] text-zinc-600"
                    : "border-white/15 bg-white/[0.05] text-zinc-100 hover:bg-white/10",
                )}
              >
                {prettyKey(k)}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setTapped([])}
              disabled={tapped.length === 0}
            >
              지우기
            </Button>
            <Button
              className="flex-1"
              onClick={() => 채점(만든것)}
              disabled={tapped.length === 0}
            >
              이거다
            </Button>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={() => 채점("")}
          >
            모르겠어요
          </Button>
        </>
      ) : (
        <>
          <Card
            className={cn(
              "mt-4",
              judged
                ? "border-emerald-400/30 bg-emerald-500/10"
                : "border-rose-400/30 bg-rose-500/10",
            )}
          >
            <div className="flex items-center gap-1.5">
              {judged ? (
                <Check size={15} className="text-emerald-300" />
              ) : (
                <X size={15} className="text-rose-300" />
              )}
              <span
                className={cn(
                  "text-[13px] font-bold",
                  judged ? "text-emerald-200" : "text-rose-200",
                )}
              >
                {judged ? "맞습니다" : `정답은 ${정답표기}`}
              </span>
            </div>
            {sc.note && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-300">
                {sc.note}
              </p>
            )}
          </Card>
          <Button size="lg" className="mt-4 w-full" onClick={next}>
            {at + 1 >= pool.length ? "결과 보기" : "다음"}
          </Button>
        </>
      )}
    </main>
  );
}
