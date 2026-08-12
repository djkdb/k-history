"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Flag,
  Keyboard,
  Sigma,
  X,
} from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import type { FormulaTask, MockAttempt, Shortcut } from "@/lib/types";
import { formulasFor } from "@/data/formulas";
import { shortcutsFor } from "@/data/shortcuts";
import { gradeFormula } from "@/lib/grade-formula";
import { shortcutChoices } from "@/lib/shortcut";
import { Button, Card, KeyCaps, ProgressBar } from "@/components/ui";
import { cn, formatClock, shuffleSeeded } from "@/lib/utils";

const FORMULA_COUNT = 20;
const SHORTCUT_COUNT = 10;
const MIN_MS = 60_000;

/** 한 문항 — 수식은 직접 치고, 단축키는 보기에서 고른다 */
type Item =
  | { kind: "formula"; task: FormulaTask }
  | { kind: "shortcut"; sc: Shortcut; choices: string[] };

/**
 * 실기 모의고사.
 *
 * 실기는 엑셀 파일을 직접 다루는 시험이라 앱이 그대로 재현할 수 없다.
 * 대신 실기에서 시간을 잡아먹는 두 가지 — 수식을 떠올려 치는 것과
 * 단축키를 아는 것 — 만 골라 시간을 재고 몰아서 푼다.
 *
 * 단축키는 보기에서 고르게 한다. 자판이 없는 기기에서도 끝까지 풀 수
 * 있어야 하고, 시간을 재는 중에 브라우저가 키를 가로채면 그대로 손해이기
 * 때문이다. (직접 눌러 보는 연습은 단축키 훈련에서 한다)
 */
export default function PracticalMockPage() {
  const grade = useGrade();
  const recordMockAttempt = useApp((s) => s.recordMockAttempt);
  const attempts = useApp((s) => s.mockAttempts);

  const limitMin = grade === 1 ? 45 : 30;

  const [items, setItems] = useState<Item[] | null>(null);
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState<Record<number, string>>({});
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [remain, setRemain] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const endsAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const past = attempts.filter((a) => a.examId.endsWith("-practical"));

  const build = useCallback(() => {
    const seed = Date.now() % 1_000_000;
    const fs = shuffleSeeded(formulasFor(grade), seed).slice(0, FORMULA_COUNT);
    const pool = shortcutsFor(grade);
    const scs = shuffleSeeded(pool, seed + 7).slice(0, SHORTCUT_COUNT);
    const list: Item[] = [
      ...fs.map((task) => ({ kind: "formula" as const, task })),
      ...scs.map((sc, i) => ({
        kind: "shortcut" as const,
        sc,
        choices: shortcutChoices(sc, pool, seed + i + 1),
      })),
    ];
    const now = Date.now();
    endsAt.current = now + limitMin * MIN_MS;
    setItems(list);
    setAt(0);
    setTyped({});
    setPicked({});
    setStartedAt(now);
    setRemain(limitMin * MIN_MS);
    setSubmitted(false);
  }, [grade, limitMin]);

  /** 채점 — 수식은 채점기에, 단축키는 표기 비교에 맡긴다 */
  const grade0 = useCallback(
    (list: Item[]) =>
      list.map((it, i) =>
        it.kind === "formula"
          ? gradeFormula(typed[i] ?? "", it.task).correct
          : picked[i] === it.sc.display,
      ),
    [typed, picked],
  );

  const submit = useCallback(() => {
    if (submitted || !items) return;
    setSubmitted(true);
    setConfirming(false);

    const ok = grade0(items);
    const fCount = items.filter((it) => it.kind === "formula").length;
    const fCorrect = ok.filter((v, i) => v && items[i].kind === "formula").length;
    const sCorrect = ok.filter((v, i) => v && items[i].kind === "shortcut").length;

    const attempt: MockAttempt = {
      examId: `${grade}-practical`,
      startedAt,
      finishedAt: Date.now(),
      answers: {},
      bySubject: [
        { subject: "formula", correct: fCorrect, total: fCount },
        { subject: "shortcut", correct: sCorrect, total: items.length - fCount },
      ],
      score: fCorrect + sCorrect,
      total: items.length,
    };
    const wrongIds = items
      .filter((_, i) => !ok[i])
      .map((it) => (it.kind === "formula" ? it.task.id : it.sc.id));
    recordMockAttempt(attempt, wrongIds);
  }, [submitted, items, grade0, grade, startedAt, recordMockAttempt]);

  // 시계 — 마감 시각을 들고 있어야 앱이 잠깐 멈춰도 되감기지 않는다
  useEffect(() => {
    if (!items || submitted) return;
    const tick = () => {
      const left = Math.max(0, endsAt.current - Date.now());
      setRemain(left);
      if (left <= 0) submit();
    };
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [items, submitted, submit]);

  // ── 시작 화면 ────────────────────────────────────────────────
  if (!items) {
    return (
      <div className="pt-6">
        <Link
          href="/practical"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft size={15} />
          실기 훈련
        </Link>

        <h1 className="mt-3 text-xl font-bold tracking-tight">실기 모의고사</h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
          수식 {FORMULA_COUNT}문항과 단축키 {SHORTCUT_COUNT}개를 {limitMin}분 안에
          풉니다. 중간에 정답을 볼 수 없고, 제출해야 채점됩니다.
        </p>

        <Card className="mt-4">
          <div className="flex flex-col gap-2 text-[13px]">
            <Row icon={<Sigma size={14} />} label="함수 수식" value={`${FORMULA_COUNT}문항 · 직접 입력`} />
            <Row icon={<Keyboard size={14} />} label="단축키" value={`${SHORTCUT_COUNT}개 · 보기에서 고르기`} />
            <Row icon={<Clock size={14} />} label="제한 시간" value={`${limitMin}분`} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
            단축키를 보기에서 고르게 한 이유는 두 가지입니다. 자판이 없는
            기기에서도 끝까지 풀 수 있어야 하고, 시간을 재는 중에 브라우저가
            키를 가로채면 그대로 손해이기 때문입니다. 직접 눌러 보는 연습은
            단축키 훈련에서 하세요.
          </p>
        </Card>

        <Card className="mt-3 border-amber-500/25 bg-amber-500/[0.07]">
          <p className="text-[13px] leading-relaxed text-zinc-300">
            실기 합격선은 <b>70점</b>입니다. 필기와 달리 과락은 없고 총점만
            봅니다.
          </p>
        </Card>

        <Button size="lg" className="mt-6 w-full" onClick={build}>
          응시하기
          <ArrowRight size={17} />
        </Button>

        {past.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-base font-bold tracking-tight">
              지난 응시
            </h2>
            <div className="flex flex-col gap-2">
              {[...past].reverse().map((a) => {
                const pct = Math.round((a.score / a.total) * 100);
                return (
                  <Card key={a.startedAt}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">
                          {a.examId.startsWith("1") ? "1급" : "2급"} 실기 ·{" "}
                          {new Date(a.startedAt).toLocaleDateString("ko-KR")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {a.bySubject
                            .map(
                              (b) =>
                                `${b.subject === "formula" ? "수식" : "단축키"} ${b.correct}/${b.total}`,
                            )
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{pct}점</p>
                        <p
                          className={cn(
                            "text-[11px] font-bold",
                            pct >= 70 ? "text-emerald-400" : "text-red-400",
                          )}
                        >
                          {pct >= 70 ? "합격선" : "불합격선"}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  const ok = grade0(items);
  const answered = items.filter((it, i) =>
    it.kind === "formula" ? (typed[i] ?? "").trim() !== "" : picked[i] !== undefined,
  ).length;

  // ── 결과 화면 ────────────────────────────────────────────────
  if (submitted) {
    const score = ok.filter(Boolean).length;
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-sm text-zinc-400">{grade}급 실기 모의고사</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">{pct}점</p>
          <p
            className={cn(
              "mt-2 text-sm font-bold",
              pct >= 70 ? "text-emerald-400" : "text-red-400",
            )}
          >
            {pct >= 70 ? "합격선입니다 (70점 이상)" : "70점에 미치지 못했습니다"}
          </p>
        </motion.div>

        <div className="mt-6 flex flex-col gap-2">
          {(["formula", "shortcut"] as const).map((kind) => {
            const idx = items
              .map((it, i) => ({ it, i }))
              .filter(({ it }) => it.kind === kind);
            const c = idx.filter(({ i }) => ok[i]).length;
            return (
              <Card key={kind}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-bold">
                    {kind === "formula" ? <Sigma size={14} /> : <Keyboard size={14} />}
                    {kind === "formula" ? "함수 수식" : "단축키"}
                  </span>
                  <span className="text-sm font-bold">
                    {c} / {idx.length}
                  </span>
                </div>
                <ProgressBar
                  value={c}
                  max={idx.length}
                  color={kind === "formula" ? "#10b981" : "#f59e0b"}
                  className="mt-2.5"
                />
              </Card>
            );
          })}
        </div>

        <h2 className="mb-3 mt-8 text-base font-bold tracking-tight">문항별 결과</h2>
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <Card key={i}>
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    ok[i]
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300",
                  )}
                >
                  {ok[i] ? <Check size={12} /> : <X size={12} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-relaxed">
                    {it.kind === "formula" ? it.task.prompt : it.sc.action}
                  </p>
                  {!ok[i] && (
                    <div className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
                      <span className="text-zinc-500">내 답 </span>
                      {it.kind === "formula"
                        ? (typed[i] ?? "").trim() || "(빈칸)"
                        : picked[i] || "(무응답)"}
                      <br />
                      <span className="text-zinc-500">정답 </span>
                      <span className={it.kind === "formula" ? "mono" : ""}>
                        {it.kind === "formula" ? it.task.answer : it.sc.display}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setItems(null)}>
            모의고사 홈
          </Button>
          <Button onClick={build}>
            다시 응시
            <ArrowRight size={15} />
          </Button>
        </div>
        <p className="mt-3 text-center text-[11px] text-zinc-600">
          틀린 수식과 단축키는 복습 큐에 자동으로 들어갔습니다
        </p>
      </div>
    );
  }

  // ── 응시 화면 ────────────────────────────────────────────────
  const item = items[at];

  return (
    <div className="pt-4">
      <div className="exam-bar sticky-top-safe sticky z-40 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm font-bold tabular-nums",
              remain < 5 * MIN_MS && "text-red-400",
            )}
          >
            <Clock size={15} />
            {formatClock(remain)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">
              {answered} / {items.length}
            </span>
            <Button size="sm" onClick={() => setConfirming(true)}>
              <Flag size={13} />
              제출
            </Button>
          </div>
        </div>
        <ProgressBar
          value={limitMin * MIN_MS - remain}
          max={limitMin * MIN_MS}
          color={remain < 5 * MIN_MS ? "#ef4444" : "#f59e0b"}
          className="mt-2.5"
        />
        <ProgressBar value={answered} max={items.length} className="mt-1.5" />
      </div>

      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {items.map((it, i) => {
          const done =
            it.kind === "formula"
              ? (typed[i] ?? "").trim() !== ""
              : picked[i] !== undefined;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setAt(i)}
              className={cn(
                "h-7 w-7 shrink-0 rounded-lg text-[11px] font-bold transition-colors",
                i === at
                  ? "pill-on"
                  : done
                    ? "bg-white/15 text-zinc-200"
                    : "bg-white/5 text-zinc-500",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
          {item.kind === "formula" ? "수식" : "단축키"}
        </span>
        <span className="text-[11px] text-zinc-500">{at + 1}번</span>
      </div>

      {item.kind === "formula" ? (
        <>
          <p className="mt-2.5 text-[16px] font-bold leading-[1.7]">
            {item.task.prompt}
          </p>
          {item.task.sample && (
            <div className="no-scrollbar mt-3 overflow-x-auto">
              <table className="cmp-table">
                <thead>
                  <tr>
                    {item.task.sample.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.task.sample.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j} className="mono">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-3.5">
            <div className="flex items-center gap-2">
              <span className="mono shrink-0 text-zinc-500">fx</span>
              <input
                ref={inputRef}
                value={typed[at] ?? ""}
                onChange={(e) => setTyped({ ...typed, [at]: e.target.value })}
                placeholder="=SUM(A1:A10)"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="mono w-full bg-transparent text-[15px] outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-zinc-600">
            채점은 제출할 때 한꺼번에 합니다
          </p>
        </>
      ) : (
        <>
          <p className="mt-2.5 text-[17px] font-bold leading-[1.6]">
            {item.sc.action}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {item.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPicked({ ...picked, [at]: c })}
                className={cn(
                  "rounded-2xl border p-3.5 text-left transition-all active:scale-[0.99]",
                  picked[at] === c
                    ? "border-indigo-400/60 bg-indigo-500/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <KeyCaps combo={c} />
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-5 flex gap-2">
        <Button
          variant="ghost"
          className="flex-1"
          disabled={at === 0}
          onClick={() => setAt(at - 1)}
        >
          <ArrowLeft size={15} />
          이전
        </Button>
        <Button
          className="flex-1"
          disabled={at >= items.length - 1}
          onClick={() => setAt(at + 1)}
        >
          다음
          <ArrowRight size={15} />
        </Button>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong w-full max-w-sm rounded-3xl p-5"
          >
            <p className="text-base font-bold">지금 제출할까요?</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
              {items.length}문항 중 {answered}문항에 답했습니다.
              {answered < items.length &&
                ` 답하지 않은 ${items.length - answered}문항은 오답 처리됩니다.`}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                <X size={15} />더 풀기
              </Button>
              <Button onClick={submit}>
                <Check size={15} />
                제출하기
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-zinc-400">
        {icon}
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
