"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Flag, X } from "lucide-react";
import { useApp } from "@/lib/store";
import type { MockAttempt, QuizQuestion, SubjectId } from "@/lib/types";
import { EXAM, SUBJECTS, SUBJECT_MAP, cutoff, judge, subjectInk } from "@/data/exam";
import { CONCEPT_MAP } from "@/data/concepts";
import { makeMock } from "@/lib/quiz";
import { Button, Card, ProgressBar } from "@/components/ui";
import { cn, formatClock } from "@/lib/utils";
import { clearProgress, readProgress, writeProgress, type MockProgress } from "../progress";

const MIN_MS = 60_000;
const LIMIT_MS = EXAM.minutes * MIN_MS;

/** 과목별 정답 수 — 채점과 결과 화면이 같은 값을 봐야 한다 */
function tally(questions: QuizQuestion[], answers: Record<number, number>) {
  return SUBJECTS.map((s) => {
    const mine = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.subject === s.id);
    return {
      subject: s.id as SubjectId,
      correct: mine.filter(({ q, i }) => answers[i] === q.answerIndex).length,
      total: mine.length,
    };
  });
}

export function MockSession() {
  const search = useSearchParams();
  const recordMockAttempt = useApp((s) => s.recordMockAttempt);

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [at, setAt] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [remain, setRemain] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  /** 채점 뒤 시험지를 다시 넘겨 볼 때 — 이때는 시간이 흐르지 않는다 */
  const [paperReview, setPaperReview] = useState(false);

  // 남은 시간은 "몇 초 남았나"가 아니라 "언제 끝나나"로 들고 있는다.
  // 그래야 앱이 잠깐 멈췄다 돌아와도 시간이 되감기지 않는다.
  const endsAt = useRef(0);
  const seed = useRef(0);

  // ── 시험지 준비 ──────────────────────────────────────────────
  useEffect(() => {
    const resuming = search.get("resume") === "1";
    const saved = resuming ? readProgress() : null;

    if (saved) {
      seed.current = saved.seed;
      endsAt.current = saved.endsAt;
      setQuestions(makeMock(saved.seed));
      setAnswers(saved.answers ?? {});
      setAt(saved.at ?? 0);
      setStartedAt(saved.startedAt);
      setRemain(Math.max(0, saved.endsAt - Date.now()));
      return;
    }

    const now = Date.now();
    const s = now % 1_000_000;
    seed.current = s;
    endsAt.current = now + LIMIT_MS;
    setQuestions(makeMock(s));
    setAnswers({});
    setAt(0);
    setStartedAt(now);
    setRemain(LIMIT_MS);
    clearProgress();
  }, [search]);

  const submit = useCallback(() => {
    if (submitted || !questions) return;
    setSubmitted(true);
    setConfirming(false);
    clearProgress();

    const bySubject = tally(questions, answers);
    const correct = bySubject.reduce((a, b) => a + b.correct, 0);

    const attempt: MockAttempt = {
      startedAt,
      finishedAt: Date.now(),
      answers,
      bySubject,
      correct,
      total: questions.length,
      score: judge(bySubject).score,
    };
    const wrongSourceIds = questions
      .filter((q, i) => answers[i] !== q.answerIndex)
      .map((q) => q.sourceId);
    recordMockAttempt(attempt, wrongSourceIds);
  }, [submitted, questions, answers, startedAt, recordMockAttempt]);

  // ── 시계 ────────────────────────────────────────────────────
  useEffect(() => {
    if (!questions || submitted || paperReview) return;
    const tick = () => {
      const left = Math.max(0, endsAt.current - Date.now());
      setRemain(left);
      if (left <= 0) submit(); // 시간이 다 되면 지금까지 고른 답 그대로 제출
    };
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [questions, submitted, paperReview, submit]);

  // ── 진행 상황 저장 ───────────────────────────────────────────
  useEffect(() => {
    if (!questions || submitted || !startedAt) return;
    const p: MockProgress = {
      seed: seed.current,
      startedAt,
      endsAt: endsAt.current,
      answers,
      at,
    };
    writeProgress(p);
  }, [questions, submitted, answers, at, startedAt]);

  if (!questions) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        시험지를 준비하는 중…
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  // ── 결과 화면 ────────────────────────────────────────────────
  if (submitted && !paperReview) {
    const bySubject = tally(questions, answers);
    const verdict = judge(bySubject);

    return (
      <div className="pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-sm text-zinc-400">SQLD 모의고사</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">{verdict.score}점</p>
          <p
            className={cn(
              "mt-2 text-sm font-bold",
              verdict.passed ? "text-emerald-400" : "text-red-400",
            )}
          >
            {verdict.reason}
          </p>
        </motion.div>

        <div className="mt-6 flex flex-col gap-2">
          {bySubject.map((b) => {
            const s = SUBJECT_MAP[b.subject];
            const line = cutoff(b.subject);
            const bad = b.correct < line;
            return (
              <Card key={b.subject} className={cn(bad && "border-red-500/30")}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{s?.name}</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      bad ? "text-red-400" : "text-zinc-200",
                    )}
                  >
                    {b.correct} / {b.total}문항
                  </span>
                </div>
                <ProgressBar
                  value={b.correct}
                  max={b.total}
                  color={bad ? "#ef4444" : s?.color}
                  className="mt-2.5"
                />
                <p
                  className={cn(
                    "mt-2 text-[11px] leading-relaxed",
                    bad ? "text-red-300" : "text-zinc-500",
                  )}
                >
                  {bad
                    ? `과락선은 ${line}문항입니다. 이 과목만으로 불합격이며, 다른 과목이 아무리 높아도 구제되지 않습니다.`
                    : `과락선 ${line}문항을 넘겼습니다.`}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setPaperReview(true)}>
            시험지 다시 보기
          </Button>
          <Link href="/mock" className="contents">
            <Button className="w-full">
              모의고사 홈
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-center text-[11px] text-zinc-600">
          틀린 문항의 개념은 복습 큐에 자동으로 들어갔습니다
        </p>
      </div>
    );
  }

  // ── 응시 · 다시 보기 화면 ────────────────────────────────────
  const q = questions[at];
  const mine = answers[at];
  const subject = SUBJECT_MAP[q.subject as SubjectId];

  return (
    <div className="pt-4">
      {/* 위쪽 고정 막대 */}
      <div className="exam-bar sticky-top-safe sticky z-40 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          {paperReview ? (
            <span className="text-sm font-bold">시험지 다시 보기</span>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm font-bold tabular-nums",
                remain < 5 * MIN_MS && "text-red-400",
              )}
            >
              <Clock size={15} />
              {formatClock(remain)}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">
              {answeredCount} / {questions.length}
            </span>
            {paperReview ? (
              <Button size="sm" variant="ghost" onClick={() => setPaperReview(false)}>
                결과로
              </Button>
            ) : (
              <Button size="sm" onClick={() => setConfirming(true)}>
                <Flag size={13} />
                제출
              </Button>
            )}
          </div>
        </div>
        {/* 시간과 진행을 겹쳐 둔다 — 시험 중에 가장 자주 보는 두 숫자다 */}
        {!paperReview && (
          <ProgressBar
            value={LIMIT_MS - remain}
            max={LIMIT_MS}
            color={remain < 5 * MIN_MS ? "#ef4444" : "#f59e0b"}
            className="mt-2.5"
          />
        )}
        <ProgressBar value={answeredCount} max={questions.length} className="mt-1.5" />
      </div>

      {/* 문항 번호 격자 — 50문항이라 두 줄로 접어 한눈에 보이게 한다 */}
      <div className="mt-3 grid grid-cols-10 gap-1.5">
        {questions.map((qq, i) => {
          const done = answers[i] !== undefined;
          const ok = paperReview && answers[i] === qq.answerIndex;
          const bad = paperReview && done && answers[i] !== qq.answerIndex;
          return (
            <button
              key={qq.id}
              type="button"
              onClick={() => setAt(i)}
              className={cn(
                "h-7 rounded-lg text-[11px] font-bold transition-colors",
                i === at
                  ? "pill-on"
                  : ok
                    ? "bg-emerald-500/20 text-emerald-300"
                    : bad
                      ? "bg-red-500/20 text-red-300"
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
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{
            background: `${subject?.color}22`,
            color: subject ? subjectInk(subject.id) : undefined,
          }}
        >
          {subject?.name}
        </span>
        <span className="text-[11px] text-zinc-500">{at + 1}번</span>
      </div>

      <h2 className="mt-2.5 text-[17px] font-bold leading-snug">{q.question}</h2>

      {q.passage && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p
            className={cn(
              "text-[14px] leading-[1.9] text-zinc-200",
              q.passageIsSql && "mono",
            )}
          >
            {q.passage}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const picked = mine === i;
          const isAnswer = i === q.answerIndex;
          return (
            <button
              key={i}
              type="button"
              disabled={paperReview}
              onClick={() => setAnswers({ ...answers, [at]: i })}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.99]",
                !paperReview && picked
                  ? "border-indigo-400/60 bg-indigo-500/10"
                  : !paperReview
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    : isAnswer
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : picked
                        ? "border-red-500/40 bg-red-500/10"
                        : "border-white/5 opacity-50",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  paperReview && isAnswer
                    ? "bg-emerald-500/25 text-emerald-300"
                    : paperReview && picked
                      ? "bg-red-500/25 text-red-300"
                      : picked
                        ? "bg-indigo-500/30 text-indigo-200"
                        : "bg-white/10 text-zinc-400",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] leading-[1.7]">{opt}</span>
                {/* 다시 보기에서만 — 내가 고른 오답이 왜 아닌지 그 자리에 붙인다 */}
                {paperReview && picked && !isAnswer && q.optionNotes?.[i] && (
                  <span className="mt-1.5 block text-[12px] leading-[1.75] text-red-200">
                    {q.optionNotes[i]}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 다시 보기에서만 정답·해설 */}
      {paperReview && (
        <Card className="mt-4">
          <p className="text-[12px] text-zinc-500">
            내 답{" "}
            <b className="text-zinc-200">
              {mine === undefined ? "무응답" : `${mine + 1}번`}
            </b>{" "}
            · 정답 <b className="text-emerald-300">{q.answerIndex + 1}번</b>
          </p>
          <p className="mt-2 text-[14px] leading-[1.85] text-zinc-300">
            {q.explanation}
          </p>
          {CONCEPT_MAP[q.sourceId] && (
            <Link
              href={`/concept/${q.sourceId}`}
              className="mt-2 inline-block text-[12px] text-indigo-300 hover:text-indigo-200"
            >
              개념 전체 보기 →
            </Link>
          )}
        </Card>
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
          disabled={at >= questions.length - 1}
          onClick={() => setAt(at + 1)}
        >
          다음
          <ArrowRight size={15} />
        </Button>
      </div>

      {/* 제출 확인 */}
      {confirming && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong w-full max-w-sm rounded-3xl p-5"
          >
            <p className="text-base font-bold">지금 제출할까요?</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
              {questions.length}문항 중 {answeredCount}문항에 답했습니다.
              {answeredCount < questions.length &&
                ` 답하지 않은 ${questions.length - answeredCount}문항은 오답 처리됩니다.`}
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
