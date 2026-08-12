"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import type { QuizQuestion, SubjectId } from "@/lib/types";
import { SUBJECTS, subjectsFor } from "@/data/subjects";
import { CONCEPT_MAP } from "@/data/concepts";
import { makeQuiz, questionBank, QUIZ_TYPE_LABELS } from "@/lib/quiz";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
  SectionTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const COUNTS = [5, 10, 20, 30];

export function QuizScreen() {
  const search = useSearchParams();
  const grade = useGrade();
  const record = useApp((s) => s.recordQuizResult);
  const wrongIds = useApp((s) => s.wrongIds);

  const initialSubject = (search.get("subject") as SubjectId | null) ?? null;
  const onlyWrong = search.get("mode") === "wrong";

  const [subject, setSubject] = useState<SubjectId | null>(initialSubject);
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const mine = subjectsFor(grade);

  // 잘못된 급수·과목 조합으로 들어왔을 때 (2급인데 데이터베이스)
  useEffect(() => {
    if (subject && !mine.some((s) => s.id === subject)) setSubject(null);
  }, [subject, mine]);

  const available = useMemo(
    () => questionBank(grade, subject ?? undefined).length,
    [grade, subject],
  );

  const start = () => {
    const qs = makeQuiz({
      grade,
      subject: subject ?? undefined,
      count,
      onlySourceIds: onlyWrong ? wrongIds : undefined,
    });
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setAt(0);
    setPicked(null);
  };

  // ── 설정 화면 ────────────────────────────────────────────────
  if (!questions) {
    return (
      <div className="pt-6">
        <h1 className="text-xl font-bold tracking-tight">필기 퀴즈</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {onlyWrong
            ? `틀렸던 개념 ${wrongIds.length}개에서만 출제합니다`
            : `${grade}급 범위에서 ${available}문항까지 만들 수 있습니다`}
        </p>

        {!onlyWrong && wrongIds.length > 0 && (
          <Link href="/quiz?mode=wrong" className="mt-4 block">
            <div className="flex items-center justify-between rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3.5 transition-transform active:scale-[0.99]">
              <span className="text-[13px] font-bold text-rose-200">
                틀렸던 {wrongIds.length}개만 골라 풀기
              </span>
              <ArrowRight size={15} className="text-rose-300" />
            </div>
          </Link>
        )}

        {!onlyWrong && (
          <>
            <SectionTitle>과목</SectionTitle>
            <ScrollRow>
              <Chip active={subject === null} onClick={() => setSubject(null)}>
                전체
              </Chip>
              {SUBJECTS.filter((s) => mine.some((m) => m.id === s.id)).map((s) => (
                <Chip
                  key={s.id}
                  active={subject === s.id}
                  onClick={() => setSubject(s.id)}
                >
                  {s.symbol} {s.name}
                </Chip>
              ))}
            </ScrollRow>
          </>
        )}

        <SectionTitle>문항 수</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCount(c)}
              className={cn(
                "rounded-xl py-3 text-sm font-bold transition-all active:scale-95",
                count === c
                  ? "pill-on shadow-lg"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <Card className="mt-6">
          <p className="text-[13px] font-bold">이 퀴즈가 내는 네 가지</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-relaxed text-zinc-400">
            <li>· 설명을 보고 개념 고르기</li>
            <li>· 옳지 않은 설명 하나 찾기</li>
            <li>· 빈칸에 들어갈 용어 고르기</li>
            <li>· 헷갈리는 두 개념의 차이 고르기</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
            문제는 개념 데이터에서 그때그때 만들어집니다. 같은 개념이라도 매번
            다른 형태로 나오므로 답을 외워서 맞힐 수 없습니다.
          </p>
        </Card>

        {onlyWrong && wrongIds.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="틀린 것이 없습니다"
            desc="퀴즈에서 틀린 개념이 생기면 여기 모입니다."
            action={
              <Link href="/quiz">
                <Button size="sm">전체 퀴즈 풀기</Button>
              </Link>
            }
          />
        ) : (
          <Button size="lg" className="mt-6 w-full" onClick={start}>
            시작하기
            <ArrowRight size={17} />
          </Button>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="pt-6">
        <EmptyState
          icon="📭"
          title="낼 수 있는 문제가 없습니다"
          desc="개념을 조금 더 본 뒤에 다시 시도해 주세요."
          action={
            <Button size="sm" onClick={() => setQuestions(null)}>
              돌아가기
            </Button>
          }
        />
      </div>
    );
  }

  // ── 결과 화면 ────────────────────────────────────────────────
  if (at >= questions.length) {
    const correct = answers.filter((a, i) => a === questions[i].answerIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-sm text-zinc-400">채점 결과</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">{pct}점</p>
          <p className="mt-1 text-sm text-zinc-400">
            {questions.length}문항 중 {correct}문항 정답
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-2">
          {questions.map((q, i) => {
            const ok = answers[i] === q.answerIndex;
            const concept = CONCEPT_MAP[q.sourceId];
            return (
              <Card key={q.id}>
                <div className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      ok
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300",
                    )}
                  >
                    {ok ? <Check size={12} /> : <X size={12} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-relaxed">
                      {q.question}
                    </p>
                    {!ok && (
                      <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
                        <span className="text-zinc-500">정답 </span>
                        {q.options[q.answerIndex]}
                      </p>
                    )}
                    {concept && (
                      <Link
                        href={`/concept/${concept.id}`}
                        className="mt-1.5 inline-block text-[11px] text-indigo-300 hover:text-indigo-200"
                      >
                        {concept.title} 다시 보기 →
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setQuestions(null);
              setAnswers([]);
            }}
          >
            <RotateCcw size={15} />
            다시 설정
          </Button>
          <Button onClick={start}>
            한 번 더
            <ArrowRight size={15} />
          </Button>
        </div>
        <p className="mt-3 text-center text-[11px] text-zinc-600">
          틀린 개념은 복습 큐에 자동으로 들어갔습니다
        </p>
      </div>
    );
  }

  // ── 풀이 화면 ────────────────────────────────────────────────
  const q = questions[at];
  const answered = picked !== null;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const next = [...answers];
    next[at] = i;
    setAnswers(next);
    record({
      questionId: q.id,
      sourceId: q.sourceId,
      subject: q.subject,
      type: q.type,
      correct: i === q.answerIndex,
      answeredAt: Date.now(),
    });
  };

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          {at + 1} / {questions.length}
        </span>
        <button
          type="button"
          onClick={() => setQuestions(null)}
          className="hover:text-zinc-200"
        >
          그만두기
        </button>
      </div>
      <ProgressBar value={at} max={questions.length} className="mt-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mt-6 flex items-center gap-1.5">
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
              {QUIZ_TYPE_LABELS[q.type]}
            </span>
            <ImportanceBadge importance={q.importance} compact />
          </div>

          <h2 className="mt-3 text-lg font-bold leading-snug">{q.question}</h2>

          {q.passage && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[14px] leading-[1.9] text-zinc-200">{q.passage}</p>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answerIndex;
              const isPicked = picked === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.99]",
                    !answered && "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                    answered && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                    answered &&
                      isPicked &&
                      !isAnswer &&
                      "border-red-500/40 bg-red-500/10",
                    answered && !isAnswer && !isPicked && "border-white/5 opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      answered && isAnswer
                        ? "bg-emerald-500/25 text-emerald-300"
                        : answered && isPicked
                          ? "bg-red-500/25 text-red-300"
                          : "bg-white/10 text-zinc-400",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-[1.7]">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Card
                className={cn(
                  picked === q.answerIndex
                    ? "border-emerald-500/25 bg-emerald-500/[0.07]"
                    : "border-red-500/25 bg-red-500/[0.07]",
                )}
              >
                <p className="text-[13px] font-bold">
                  {picked === q.answerIndex ? "정답입니다" : "다시 볼 개념입니다"}
                </p>
                <p className="mt-1.5 text-[14px] leading-[1.85] text-zinc-300">
                  {q.explanation}
                </p>
                <Link
                  href={`/concept/${q.sourceId}`}
                  className="mt-2 inline-block text-[12px] text-indigo-300 hover:text-indigo-200"
                >
                  개념 전체 보기 →
                </Link>
              </Card>

              <Button
                size="lg"
                className="mt-4 w-full"
                onClick={() => {
                  setAt(at + 1);
                  setPicked(null);
                }}
              >
                {at + 1 >= questions.length ? "결과 보기" : "다음 문제"}
                <ArrowRight size={17} />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
