"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  Target,
  Terminal,
  X,
} from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { useApp } from "@/lib/store";
import { CONCEPT_MAP, conceptsOf } from "@/data/concepts";
import { CHAPTER_MAP, SUBJECT_MAP } from "@/data/exam";
import { questionsFor, QUIZ_TYPE_LABELS } from "@/lib/quiz";
import { nextDueLabel } from "@/lib/srs";
import { SqlRunner } from "@/components/sql-runner";
import {
  Badge,
  Button,
  Card,
  Chip,
  CompareTable,
  EmptyState,
  ImportanceBadge,
  Prose,
  ScrollRow,
  SubjectBadge,
  SqlBlock,
} from "@/components/ui";
import { cn } from "@/lib/utils";

type Tab = "detail" | "exam";

const TABS: { key: Tab; label: string; hint: string }[] = [
  { key: "detail", label: "설명", hint: "왜 그런지까지" },
  { key: "exam", label: "시험 포인트", hint: "어떻게 나오는가" },
];

export function ConceptDetail() {
  const params = useParams<{ id: string }>();
  const concept = CONCEPT_MAP[params.id];

  const studiedIds = useApp((s) => s.studiedIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const markStudied = useApp((s) => s.markStudied);
  const recordQuizResult = useApp((s) => s.recordQuizResult);

  /**
   * 처음 열면 '설명'을 보여 준다.
   *
   * 한 줄 정의는 이미 아는 것을 시험장에서 되짚을 때 쓰는 문장이다.
   * 개념을 펼쳐 보는 사람은 대개 아직 모르는 상태라, 한 줄만 띄우면
   * "그래서 왜?"가 남는다.
   */
  const [tab, setTab] = useState<Tab>("detail");

  /**
   * 확인 문제.
   *
   * '설명 보고 개념 고르기'는 빼 둔다 — 지금 그 개념 화면에 있으니
   * 읽지 않아도 답이 보인다.
   */
  const checks = useMemo(
    () => (concept ? questionsFor(concept).filter((q) => q.type !== "multiple") : []),
    [concept],
  );
  const [checkAt, setCheckAt] = useState(0);
  const [checkPick, setCheckPick] = useState<number | null>(null);
  const [checkOpen, setCheckOpen] = useState(false);

  // 다른 개념으로 넘어가면 문제도 처음부터
  useEffect(() => {
    setCheckAt(0);
    setCheckPick(null);
    setCheckOpen(false);
    setTab("detail");
  }, [concept?.id]);

  const siblings = useMemo(
    () => (concept ? conceptsOf(concept.subject) : []),
    [concept],
  );
  const index = siblings.findIndex((c) => c.id === concept?.id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  if (!concept) {
    return (
      <div className="pt-6">
        <EmptyState
          icon="❓"
          title="없는 개념입니다"
          action={
            <Link href="/learn">
              <Button size="sm">학습으로</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const studied = studiedIds.includes(concept.id);
  const card = reviewCards.find((c) => c.sourceId === concept.id);
  const subject = SUBJECT_MAP[concept.subject];
  const chapter = CHAPTER_MAP[concept.chapter];

  return (
    <div className="pt-6">
      <Link
        href={`/learn/${concept.subject}`}
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        {subject.name}
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <SubjectBadge subject={concept.subject} />
        {chapter && <Badge>{chapter.name}</Badge>}
        <ImportanceBadge importance={concept.importance} />
      </div>

      <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight">
        {concept.title}
      </h1>

      {/*
        한 줄 정의는 갈래 뒤에 숨기지 않는다.
        설명 중에는 이 정의를 읽었다고 치고 곧장 하위 분류로 들어가는 것이
        있어서, 정의가 없으면 설명이 허공에 뜬다.
      */}
      <Card className="mt-4 border-indigo-500/20 bg-indigo-500/[0.06]">
        <Prose size="lg">{concept.summary}</Prose>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {concept.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-zinc-300"
            >
              {k}
            </span>
          ))}
        </div>
      </Card>

      <ScrollRow className="mt-5">
        {TABS.map((t) => (
          <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </ScrollRow>
      <p className="mt-2 text-[11px] text-zinc-600">
        {TABS.find((t) => t.key === tab)?.hint}
      </p>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mt-3"
      >
        {tab === "detail" && (
          <Card>
            <Prose>{concept.detail}</Prose>
            {concept.table && (
              <CompareTable
                title={concept.table.title}
                headers={concept.table.headers}
                rows={concept.table.rows}
              />
            )}
          </Card>
        )}

        {tab === "exam" && (
          <Card className="border-amber-500/20 bg-amber-500/[0.06]">
            <div className="flex items-center gap-2 text-amber-300">
              <Target size={15} />
              <span className="text-[13px] font-bold">시험에서는 이렇게</span>
            </div>
            <Prose className="mt-2.5">{concept.examPoint}</Prose>
          </Card>
        )}
      </motion.div>

      {/*
        곁들인 쿼리.
        글로 읽은 규칙(NULL 은 = 로 비교할 수 없다 …)은 한 번 돌려 보면
        그 자리에서 끝난다. 고쳐 쳐 볼 수도 있게 편집 가능한 채로 둔다.
      */}
      {concept.sql && (
        <section className="mt-6">
          <div className="mb-2.5 flex items-center gap-2">
            <Terminal size={15} className="text-emerald-300" />
            <h2 className="text-sm font-bold">돌려 보기</h2>
          </div>
          <p className="mb-2.5 text-[12.5px] leading-relaxed text-zinc-400">
            {concept.sql.caption}
          </p>
          <SqlRunner initial={concept.sql.query} compact />
        </section>
      )}

      {/* 헷갈리는 짝 — 점수를 가장 많이 잃는 자리라 항상 펼쳐 둔다 */}
      {concept.traps.length > 0 && (
        <section className="mt-6">
          <div className="mb-2.5 flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-300" />
            <h2 className="text-sm font-bold">헷갈리는 것</h2>
          </div>
          <div className="flex flex-col gap-2">
            {concept.traps.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4"
              >
                <p className="text-[13px] font-bold text-rose-200">{t.concept}</p>
                <p className="mt-1.5 text-[14px] leading-[1.85] text-zinc-300">
                  {t.difference}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 확인 문제 — 읽은 것과 답할 수 있는 것은 다르다 */}
      {checks.length > 0 && (
        <section id="check" className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={15} className="text-indigo-300" />
              <h2 className="text-sm font-bold">확인 문제</h2>
            </div>
            {checkOpen && (
              <span className="text-[11px] text-zinc-500">
                {checkAt + 1} / {checks.length}
              </span>
            )}
          </div>

          {/*
            펼치기 전에는 문제를 보여 주지 않는다.
            바로 위에 설명과 헷갈리는 짝이 그대로 적혀 있어서, 문제가 함께
            보이면 기억에서 꺼내는 것이 아니라 눈으로 베끼게 된다.
          */}
          {!checkOpen ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setCheckOpen(true);
                requestAnimationFrame(() =>
                  document
                    .getElementById("check")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                );
              }}
            >
              <Brain size={15} />
              가리고 풀어 보기
            </Button>
          ) : (
            <CheckQuestion
              key={checks[checkAt % checks.length].id}
              question={checks[checkAt % checks.length]}
              picked={checkPick}
              onPick={(i) => {
                if (checkPick !== null) return;
                const q = checks[checkAt % checks.length];
                const correct = i === q.answerIndex;
                setCheckPick(i);
                recordQuizResult({
                  questionId: q.id,
                  sourceId: q.sourceId,
                  subject: q.subject,
                  type: q.type,
                  correct,
                  answeredAt: Date.now(),
                });
                // 맞혔으면 굳이 아래 단추를 또 누르게 하지 않는다
                if (correct && !studiedIds.includes(concept.id)) {
                  markStudied(concept.id);
                }
              }}
              onNext={
                checks.length > 1
                  ? () => {
                      setCheckAt(checkAt + 1);
                      setCheckPick(null);
                    }
                  : undefined
              }
            />
          )}
        </section>
      )}

      {/* 학습 완료 */}
      <div className="mt-7">
        {studied ? (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-200">학습 완료</span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {card ? `다음 복습 ${nextDueLabel(card)}` : "복습 대기"}
            </span>
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={() => markStudied(concept.id)}>
            <CheckCircle2 size={17} />
            이해했습니다 — 복습에 넣기
          </Button>
        )}
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          넣어 두면 오늘 · 1일 · 3일 · 7일 · 14일 · 30일 간격으로 다시 물어봅니다
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link href="/quiz" className="contents">
          <Button variant="ghost" className="w-full">
            <Brain size={15} />
            퀴즈로 확인
          </Button>
        </Link>
        <Link href={`/learn/${concept.subject}`} className="contents">
          <Button variant="outline" className="w-full">
            <Lightbulb size={15} />
            목록으로
          </Button>
        </Link>
      </div>

      {/* 앞뒤 개념 */}
      <div className="mt-6 flex items-stretch gap-2">
        {prev ? (
          <Link href={`/concept/${prev.id}`} className="min-w-0 flex-1">
            <div className="glass h-full rounded-2xl p-3 transition-transform active:scale-[0.98]">
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <ArrowLeft size={12} />
                이전
              </span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link href={`/concept/${next.id}`} className="min-w-0 flex-1">
            <div className="glass h-full rounded-2xl p-3 text-right transition-transform active:scale-[0.98]">
              <span className="flex items-center justify-end gap-1 text-[11px] text-zinc-500">
                다음
                <ArrowRight size={12} />
              </span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {next.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}

/**
 * 개념 아래에 붙는 한 문제.
 * 고르는 순간 채점되고, 틀리면 복습 큐로 넘어간다.
 */
function CheckQuestion({
  question,
  picked,
  onPick,
  onNext,
}: {
  question: QuizQuestion;
  picked: number | null;
  onPick: (i: number) => void;
  onNext?: () => void;
}) {
  const answered = picked !== null;
  const correct = picked === question.answerIndex;

  return (
    <Card>
      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
        {QUIZ_TYPE_LABELS[question.type]}
      </span>
      <p className="mt-2.5 text-[15px] font-bold leading-snug">{question.question}</p>

      {question.passage && (
        <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          {question.passageIsSql ? (
            <SqlBlock>{question.passage}</SqlBlock>
          ) : (
            <p className="text-[13.5px] leading-[1.85] text-zinc-200">
              {question.passage}
            </p>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-col gap-1.5">
        {question.options.map((opt, i) => {
          const isAnswer = i === question.answerIndex;
          const isPicked = picked === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(i)}
              disabled={answered}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all active:scale-[0.99]",
                !answered && "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                answered && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                answered && isPicked && !isAnswer && "border-red-500/40 bg-red-500/10",
                answered && !isAnswer && !isPicked && "border-white/5 opacity-50",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  answered && isAnswer
                    ? "bg-emerald-500/25 text-emerald-300"
                    : answered && isPicked
                      ? "bg-red-500/25 text-red-300"
                      : "bg-white/10 text-zinc-400",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] leading-[1.7]">{opt}</span>
                {answered && isPicked && !isAnswer && question.optionNotes?.[i] && (
                  <span className="mt-1.5 block text-[12px] leading-[1.75] text-red-200">
                    {question.optionNotes[i]}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 border-t border-white/10 pt-3"
        >
          <p
            className={cn(
              "flex items-center gap-1.5 text-[13px] font-bold",
              correct ? "text-emerald-300" : "text-red-300",
            )}
          >
            {correct ? <CheckCircle2 size={14} /> : <X size={14} />}
            {correct ? "맞혔습니다" : "복습에 넣었습니다"}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-[1.85] text-zinc-300">
            {question.explanation}
          </p>
          {onNext && (
            <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={onNext}>
              <RefreshCw size={13} />
              다른 문제로
            </Button>
          )}
        </motion.div>
      )}
    </Card>
  );
}
