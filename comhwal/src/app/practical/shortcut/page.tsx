"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Info,
  ListChecks,
  RotateCcw,
  X,
} from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import type { Shortcut } from "@/lib/types";
import { shortcutsFor } from "@/data/shortcuts";
import {
  capturableKeys,
  gradeShortcut,
  isCapturable,
  isModifierOnly,
  keyString,
  prettyKey,
  shortcutChoices,
} from "@/lib/shortcut";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  KeyCaps,
  ProgressBar,
  ScrollRow,
} from "@/components/ui";
import { cn, shuffleSeeded } from "@/lib/utils";

type AppFilter = "all" | Shortcut["app"];

const APP_LABELS: { key: AppFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "excel", label: "엑셀" },
  { key: "access", label: "액세스" },
  { key: "common", label: "Windows" },
];

export default function ShortcutTrainerPage() {
  const grade = useGrade();
  const clearedIds = useApp((s) => s.clearedShortcutIds);
  const recordPractice = useApp((s) => s.recordPractice);

  const [filter, setFilter] = useState<AppFilter>("all");
  const [list, setList] = useState<Shortcut[] | null>(null);
  const [at, setAt] = useState(0);
  const [pressed, setPressed] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  /** 키보드가 없는 기기에서 보기로 풀기 */
  const [choiceMode, setChoiceMode] = useState(false);
  const [score, setScore] = useState({ tried: 0, correct: 0 });

  const pool = useMemo(
    () => shortcutsFor(grade, filter === "all" ? undefined : filter),
    [grade, filter],
  );

  const current = list && at < list.length ? list[at] : null;
  // 브라우저가 가로채는 조합은 눌러서 맞힐 방법이 없다 → 보기에서 고른다
  const mustChoose = current ? !isCapturable(current) : false;
  const asChoice = mustChoose || choiceMode;

  const answer = useCallback(
    (correct: boolean, key: string | null) => {
      if (!current || verdict !== null) return;
      setPressed(key);
      setVerdict(correct);
      if (!revealed) {
        recordPractice("shortcut", current.id, correct);
        setScore((s) => ({
          tried: s.tried + 1,
          correct: s.correct + (correct ? 1 : 0),
        }));
      }
    },
    [current, verdict, revealed, recordPractice],
  );

  // 실제 키 입력 받기
  useEffect(() => {
    if (!current || asChoice || verdict !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (isModifierOnly(e)) return;
      // 브라우저 기본 동작(저장·찾기·새로고침)이 먼저 일어나면 연습이 안 된다
      e.preventDefault();
      const combo = keyString(e);
      answer(gradeShortcut(combo, current), combo);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, asChoice, verdict, answer]);

  const start = () => {
    setList(shuffleSeeded(pool, Date.now() % 100000));
    setAt(0);
    setPressed(null);
    setVerdict(null);
    setRevealed(false);
    setScore({ tried: 0, correct: 0 });
  };

  const next = () => {
    setAt(at + 1);
    setPressed(null);
    setVerdict(null);
    setRevealed(false);
  };

  // ── 설정 화면 ────────────────────────────────────────────────
  if (!list) {
    const done = pool.filter((s) => clearedIds.includes(s.id)).length;
    return (
      <div className="pt-6">
        <Link
          href="/practical"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft size={15} />
          실기 훈련
        </Link>

        <h1 className="mt-3 text-xl font-bold tracking-tight">단축키 훈련</h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
          설명을 보고 실제로 키를 누릅니다. 눈으로 외우는 것과 손이 기억하는
          것은 다릅니다.
        </p>

        <ScrollRow className="mt-5">
          {APP_LABELS.filter((a) => !(a.key === "access" && grade !== 1)).map((a) => (
            <Chip
              key={a.key}
              active={filter === a.key}
              onClick={() => setFilter(a.key)}
            >
              {a.label}
            </Chip>
          ))}
        </ScrollRow>

        <Card className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">눌러서 맞힌 단축키</span>
            <span className="font-bold text-amber-400">
              {done} / {pool.length}
            </span>
          </div>
          <ProgressBar
            value={done}
            max={pool.length}
            color="#f59e0b"
            className="mt-3"
          />
        </Card>

        <Card className="mt-3">
          <div className="flex items-start gap-2">
            <Info size={15} className="mt-0.5 shrink-0 text-zinc-500" />
            <p className="text-[13px] leading-relaxed text-zinc-400">
              Win 키나 Ctrl+1처럼 브라우저·운영체제가 먼저 가져가는 조합은
              눌러도 이 화면에 오지 않습니다. 그런 단축키는 보기에서 고르도록
              자동으로 바뀝니다.
            </p>
          </div>
        </Card>

        <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3.5">
          <span className="flex items-center gap-2 text-[13px] text-zinc-300">
            <ListChecks size={15} />
            전부 보기에서 고르기 (키보드 없는 기기)
          </span>
          <input
            type="checkbox"
            checked={choiceMode}
            onChange={(e) => setChoiceMode(e.target.checked)}
            className="h-4 w-4 accent-indigo-500"
          />
        </label>

        {pool.length === 0 ? (
          <EmptyState icon="📭" title="이 갈래에 단축키가 없습니다" />
        ) : (
          <Button size="lg" className="mt-6 w-full" onClick={start}>
            시작하기
            <ArrowRight size={17} />
          </Button>
        )}
      </div>
    );
  }

  // ── 결과 화면 ────────────────────────────────────────────────
  if (!current) {
    return (
      <div className="pt-8 text-center">
        <p className="text-sm text-zinc-400">훈련 완료</p>
        <p className="mt-2 text-5xl font-bold tracking-tight">
          {score.tried ? Math.round((score.correct / score.tried) * 100) : 0}%
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          {score.tried}개 중 {score.correct}개 정답
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setList(null)}>
            <RotateCcw size={15} />
            범위 바꾸기
          </Button>
          <Button onClick={start}>
            한 번 더
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    );
  }

  const choices = asChoice ? shortcutChoices(current, pool, at + 1) : [];

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          {at + 1} / {list.length}
        </span>
        <button
          type="button"
          onClick={() => setList(null)}
          className="hover:text-zinc-200"
        >
          그만두기
        </button>
      </div>
      <ProgressBar value={at} max={list.length} color="#f59e0b" className="mt-2" />

      <div className="mt-5 flex items-center gap-1.5">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
          {current.app === "excel"
            ? "엑셀"
            : current.app === "access"
              ? "액세스"
              : "Windows"}
        </span>
        <ImportanceBadge importance={current.importance} compact />
      </div>

      <p className="mt-3 text-[18px] font-bold leading-[1.6]">{current.action}</p>

      {/* 입력 자리 */}
      {asChoice ? (
        <div className="mt-6 flex flex-col gap-2">
          {mustChoose && (
            <p className="mb-1 text-[12px] text-zinc-500">
              브라우저가 가로채는 조합이라 보기에서 고릅니다
            </p>
          )}
          {choices.map((c) => {
            const isAnswer = c === current.display;
            const isPicked = pressed === c;
            return (
              <button
                key={c}
                type="button"
                disabled={verdict !== null}
                onClick={() => answer(isAnswer, c)}
                className={cn(
                  "rounded-2xl border p-3.5 text-left transition-all active:scale-[0.99]",
                  verdict === null &&
                    "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  verdict !== null && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                  verdict !== null &&
                    isPicked &&
                    !isAnswer &&
                    "border-red-500/40 bg-red-500/10",
                  verdict !== null && !isAnswer && !isPicked && "border-white/5 opacity-50",
                )}
              >
                <KeyCaps combo={c} />
              </button>
            );
          })}
        </div>
      ) : (
        <div
          className={cn(
            "mt-6 flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors",
            verdict === true
              ? "border-emerald-500/50 bg-emerald-500/[0.07]"
              : verdict === false
                ? "border-red-500/50 bg-red-500/[0.07]"
                : "border-white/15 bg-white/[0.02]",
          )}
        >
          {pressed ? (
            <>
              <KeyCaps combo={pressed} size="lg" down />
              <p
                className={cn(
                  "mt-3 text-[13px] font-bold",
                  verdict ? "text-emerald-300" : "text-red-300",
                )}
              >
                {verdict ? "정답입니다" : "다시 보세요"}
              </p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-semibold text-zinc-300">
                지금 키를 눌러 보세요
              </p>
              <p className="mt-1.5 text-[12px] text-zinc-500">
                수식어(Ctrl·Alt·Shift)는 함께 누른 채로 마지막 키까지
              </p>
            </>
          )}
        </div>
      )}

      {/* 정답 공개 */}
      {(verdict !== null || revealed) && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mt-4">
            <div className="flex items-center gap-2">
              {verdict === true ? (
                <Check size={15} className="text-emerald-400" />
              ) : (
                <X size={15} className="text-red-400" />
              )}
              <span className="text-[12px] text-zinc-500">정답</span>
            </div>
            <div className="mt-2.5">
              <KeyCaps combo={current.display} size="lg" />
            </div>
            {capturableKeys(current).length > 1 && (
              <p className="mt-2.5 text-[12px] text-zinc-500">
                이렇게 눌러도 됩니다 —{" "}
                {capturableKeys(current)
                  .slice(1)
                  .map((k) => prettyKey(k))
                  .join(" · ")}
              </p>
            )}
            {current.note && (
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
                {current.note}
              </p>
            )}
          </Card>
        </motion.div>
      )}

      <div className="mt-5 flex gap-2">
        {verdict === null && !revealed && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setRevealed(true)}
          >
            <Eye size={15} />
            모르겠어요
          </Button>
        )}
        {(verdict !== null || revealed) && (
          <Button className="flex-1" onClick={next}>
            {at + 1 >= list.length ? "결과 보기" : "다음"}
            <ArrowRight size={15} />
          </Button>
        )}
      </div>
    </div>
  );
}
