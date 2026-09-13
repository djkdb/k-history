"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Home,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  ProgressBar,
  RichText,
  SectionTitle,
  SubjectBadge,
} from "@/components/ui";
import { PRACTICAL, judgePractical } from "@/data/exam";
import { makePracticalMock } from "@/lib/quiz";
import { gradeByKind } from "@/lib/grade";
import { useApp } from "@/lib/store";
import {
  clearPractical,
  readPractical,
  writePractical,
} from "@/lib/mock-progress";
import { cn, formatExamClock } from "@/lib/utils";

const KIND_LABEL = {
  term: "용어 쓰기",
  code: "출력 쓰기",
  sql: "SQL 쓰기",
  blank: "빈칸 채우기",
} as const;

export function PracticalSession() {
  const params = useSearchParams();
  const seed = Number(params.get("seed")) || 1;
  const questions = useMemo(() => makePracticalMock(seed), [seed]);
  const recordMockAttempt = useApp((s) => s.recordMockAttempt);

  // ⚠️ 저장본은 첫 렌더에 한 번만 — effect 로 읽으면 저장 effect 가 먼저 돌아
  //    빈 답안으로 덮어쓴다.
  const [saved] = useState(() => {
    const p = readPractical();
    return p && p.seed === seed ? p : null;
  });
  const [startedAt] = useState(() => saved?.startedAt ?? Date.now());
  const [endsAt] = useState(
    () => saved?.endsAt ?? Date.now() + PRACTICAL.minutes * 60_000,
  );
  const [at, setAt] = useState(() =>
    saved ? Math.min(saved.at, questions.length - 1) : 0,
  );
  const [inputs, setInputs] = useState<Record<number, string>>(
    () => saved?.inputs ?? {},
  );

  const [left, setLeft] = useState(() => Math.max(0, endsAt - Date.now()));
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sheet, setSheet] = useState(false);

  const submit = useCallback(() => {
    setSubmitted(true);
    setConfirming(false);
    setSheet(false);
    clearPractical();
  }, []);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      const ms = Math.max(0, endsAt - Date.now());
      setLeft(ms);
      if (ms === 0) submit();
    }, 1000);
    return () => clearInterval(t);
  }, [endsAt, submit, submitted]);

  useEffect(() => {
    if (submitted) return;
    writePractical({ seed, startedAt, endsAt, at, inputs });
  }, [at, endsAt, inputs, seed, startedAt, submitted]);

  const results = useMemo(
    () =>
      questions.map((q, i) => gradeByKind(q.kind, inputs[i] ?? "", q.answers)),
    [questions, inputs],
  );
  const max = useMemo(
    () => questions.reduce((n, q) => n + q.points, 0),
    [questions],
  );
  const earned = useMemo(
    () =>
      questions.reduce(
        (n, q, i) => n + (results[i].judgement === "correct" ? q.points : 0),
        0,
      ),
    [questions, results],
  );
  const verdict = useMemo(() => judgePractical(earned, max), [earned, max]);

  const recorded = useRef(false);
  useEffect(() => {
    if (!submitted || recorded.current) return;
    recorded.current = true;
    const wrong = questions
      .filter((q, i) => results[i].judgement !== "correct")
      .map((q) => q.sourceId);
    recordMockAttempt(
      {
        track: "practical",
        startedAt,
        finishedAt: Date.now(),
        score: verdict.score,
        passed: verdict.passed,
        bySubject: [],
        earned,
        max,
      },
      [...new Set(wrong)],
    );
  }, [
    earned,
    max,
    questions,
    recordMockAttempt,
    results,
    startedAt,
    submitted,
    verdict,
  ]);

  const writtenCount = Object.values(inputs).filter((v) => v.trim()).length;
  /** 답을 적어 둔 문항의 배점 합계 — 맞았는지는 제출 전에는 알려 주지 않는다 */
  const attempted = useMemo(
    () =>
      questions.reduce(
        (n, q, i) => n + ((inputs[i] ?? "").trim() ? q.points : 0),
        0,
      ),
    [questions, inputs],
  );

  if (submitted) {
    return (
      <main className="py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/practical/mock"
            className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft size={15} />
            모의고사
          </Link>
          <Link
            href="/"
            className="-my-2 ml-auto inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
          >
            <Home size={15} />홈
          </Link>
        </div>

        <Card
          className={cn(
            "mt-4",
            verdict.passed
              ? "border-emerald-400/30 bg-emerald-500/10"
              : "border-rose-400/30 bg-rose-500/10",
          )}
        >
          <p className="text-[12px] text-zinc-400">얻은 점수</p>
          <p className="mt-1 text-4xl font-bold tabular-nums">
            {earned}
            <span className="text-lg font-semibold text-zinc-500">
              {" "}
              / {max}점
            </span>
          </p>
          <p
            className={cn(
              "mt-1.5 text-[13px] font-bold",
              verdict.passed ? "text-emerald-200" : "text-rose-200",
            )}
          >
            {verdict.reason}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
            자동 채점입니다. 부분점수를 주지 않으므로 실제보다 박할 수 있습니다.
            틀린 것으로 나온 답은 모범 답안과 직접 견주어 보세요.
          </p>
        </Card>

        <SectionTitle>문항별</SectionTitle>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const ok = results[i].judgement === "correct";
            const mine = (inputs[i] ?? "").trim();
            return (
              <Card
                key={q.id}
                className={ok ? "border-emerald-400/25" : "border-rose-400/25"}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-bold tabular-nums text-zinc-500">
                    {i + 1}
                  </span>
                  <SubjectBadge subject={q.subject} />
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                    {KIND_LABEL[q.kind]}
                  </span>
                  <span
                    className={cn(
                      "ml-auto text-[12px] font-bold tabular-nums",
                      ok ? "text-emerald-300" : "text-rose-300",
                    )}
                  >
                    {ok ? q.points : 0} / {q.points}점
                  </span>
                </div>

                <p className="mt-2.5 text-[14px] font-semibold leading-relaxed">
                  {q.question}
                </p>

                <div className="mt-2.5">
                  <p className="text-[11px] font-bold text-zinc-500">
                    내가 적은 답
                  </p>
                  <p
                    className={cn(
                      "mt-1 whitespace-pre-wrap text-[13px] leading-relaxed",
                      mine ? "text-zinc-200" : "text-zinc-600",
                    )}
                  >
                    {mine || "(비워 둠)"}
                  </p>
                </div>

                {!ok && (
                  <div className="mt-2.5">
                    <p className="text-[11px] font-bold text-emerald-300">
                      모범 답안
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-100">
                      {q.answers[0]}
                    </p>
                    {q.answers.length > 1 && (
                      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                        이렇게 적어도 맞습니다 —{" "}
                        {q.answers.slice(1).join(" / ")}
                      </p>
                    )}
                    {results[i].note && (
                      <p className="mt-1.5 text-[12px] text-amber-200">
                        {results[i].note}
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-2.5 text-[12px] leading-relaxed text-zinc-400">
                  <RichText>{q.explanation}</RichText>
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/practical/mock">
            <Button size="lg" className="w-full">
              실기 모의고사로 돌아가기
            </Button>
          </Link>
          <Link href="/review">
            <Button size="lg" variant="outline" className="w-full">
              틀린 개념 복습하기
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const q = questions[at];
  const multiline = q.kind === "code" || q.kind === "sql";
  const urgent = left < 10 * 60_000;

  return (
    <main className="py-4">
      <div className="sticky top-0 z-20 -mx-4 bg-[var(--bg)]/90 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex items-center gap-1 text-[13px] font-bold tabular-nums",
              urgent ? "text-rose-300" : "text-zinc-200",
            )}
          >
            <Clock size={14} />
            {formatExamClock(left)}
          </span>
          {/* 실기는 문항 수가 아니라 점수가 목표다. 60점을 넘겨야 하는데
              "0 / 19" 만 보이면 지금 몇 점어치를 적었는지 알 수 없다. */}
          <span className="text-[12px] tabular-nums text-zinc-500">
            {writtenCount}/{questions.length}문항 · {attempted}점어치
          </span>
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="ml-auto rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-zinc-200"
          >
            답안지
          </button>
          <Link
            href="/practical/mock"
            aria-label="시험에서 나가기"
            className="-m-2 shrink-0 p-2 text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </Link>
        </div>
        <ProgressBar
          className="mt-2"
          value={attempted}
          max={max}
          color="#6366f1"
        />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-bold tabular-nums text-zinc-500">
            {at + 1} / {questions.length}
          </span>
          <SubjectBadge subject={q.subject} />
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
            {KIND_LABEL[q.kind]}
          </span>
          <span className="ml-auto text-[12px] font-bold tabular-nums text-indigo-200">
            {q.points}점
          </span>
        </div>

        <h2 className="mt-3 text-[15px] font-bold leading-relaxed">
          {q.question}
        </h2>

        {q.passage && (
          <pre className="sql-block sql-surface mt-3 overflow-x-auto rounded-xl border border-white/10 px-3.5 py-3 text-[12.5px] leading-[1.75] text-zinc-200">
            {q.passage}
          </pre>
        )}

        <textarea
          value={inputs[at] ?? ""}
          onChange={(e) => setInputs((m) => ({ ...m, [at]: e.target.value }))}
          rows={multiline ? 5 : 2}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="여기에 적으세요"
          className={cn(
            "mt-4 w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-[14px] leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-indigo-400/60",
            multiline && "font-mono text-[13px]",
          )}
        />
        <p className="mt-1.5 text-[11px] text-zinc-500">
          채점은 제출한 뒤에 한꺼번에 합니다. 시험 중에는 맞았는지 알려 주지
          않습니다 — 실제 시험과 같게 두었습니다. 적은 것은 그때그때 저장되므로
          나갔다 와도 이어서 볼 수 있습니다.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={at === 0}
          onClick={() => setAt((a) => Math.max(0, a - 1))}
        >
          <ArrowLeft size={16} />
          이전
        </Button>
        {at + 1 < questions.length ? (
          <Button className="flex-1" onClick={() => setAt((a) => a + 1)}>
            다음
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setConfirming(true)}>
            <Check size={16} />
            제출
          </Button>
        )}
      </div>

      {sheet && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/60"
          onClick={() => setSheet(false)}
        >
          <div
            className="max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[var(--bg)] p-4 pb-28"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <h2 className="text-[15px] font-bold">답안지</h2>
              <button
                type="button"
                onClick={() => setSheet(false)}
                className="-m-2 ml-auto p-2 text-zinc-500"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {questions.map((qq, i) => (
                <button
                  key={qq.id}
                  type="button"
                  onClick={() => {
                    setAt(i);
                    setSheet(false);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left"
                >
                  <span className="w-5 shrink-0 text-[11px] font-bold tabular-nums text-zinc-500">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-zinc-300">
                    {qq.question}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-[11px] font-bold",
                      (inputs[i] ?? "").trim()
                        ? "text-indigo-300"
                        : "text-zinc-600",
                    )}
                  >
                    {(inputs[i] ?? "").trim() ? "적음" : "빈칸"}
                  </span>
                </button>
              ))}
            </div>
            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={() => setConfirming(true)}
            >
              <Check size={16} />
              제출하기
            </Button>
          </div>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--bg)] p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-300" />
              <h2 className="text-[15px] font-bold">제출할까요?</h2>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
              {questions.length - writtenCount > 0
                ? `아직 ${questions.length - writtenCount}문항이 비어 있습니다. 빈 문항은 0점입니다.`
                : "모든 문항에 답을 적었습니다."}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirming(false)}
              >
                더 볼게요
              </Button>
              <Button className="flex-1" onClick={submit}>
                제출
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
