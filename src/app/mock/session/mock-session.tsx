"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Timer,
  X,
} from "lucide-react";
import type { MockExamQuestion } from "@/lib/types";
import { useApp } from "@/lib/store";
import { getMockExam, isPageMode, totalPoints } from "@/data/mock-exams";
import { getEvent } from "@/data/events";
import { cn, hnkGrade } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  EraBadge,
  ProgressBar,
  SectionTitle,
} from "@/components/ui";

const CHOICES = [1, 2, 3, 4, 5];

function fmtClock(sec: number): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * 쪽 뷰어 — 시험지를 넘겨 보며 푸는 방식.
 * 스캔 PDF라 문항별로 자를 수 없는 회차에서 쓴다.
 */
function PageViewer({
  pages,
  page,
  onPage,
}: {
  pages: string[];
  page: number;
  onPage: (p: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft size={15} />
        </Button>
        <div className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onPage(i)}
              className={cn(
                "h-7 w-7 shrink-0 rounded-md text-[11px] font-bold transition-colors",
                i === page
                  ? "bg-white text-zinc-900"
                  : "bg-white/5 text-zinc-500",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= pages.length - 1}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight size={15} />
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pages[page]}
          alt={`시험지 ${page + 1}쪽`}
          className="w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/** 문항 본문 — 기출 시험지 캡처 이미지 또는 텍스트 */
function QuestionBody({ q }: { q: MockExamQuestion }) {
  if (q.image) {
    return (
      // 시험지 캡처는 흰 배경이므로 밝은 판 위에 그대로 올린다
      <div className="overflow-hidden rounded-xl bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={q.image}
          alt={`${q.number}번 문항`}
          className="w-full"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div>
      <p className="whitespace-pre-line text-[15px] font-semibold leading-relaxed">
        {q.text}
      </p>
      {q.options && (
        <ol className="mt-3 flex flex-col gap-1.5">
          {q.options.map((o, i) => (
            <li key={i} className="text-sm text-zinc-300">
              <span className="mr-1.5 text-zinc-500">({i + 1})</span>
              {o}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function MockSession() {
  const searchParams = useSearchParams();
  const exam = getMockExam(searchParams.get("id") ?? "");

  const recordMockAttempt = useApp((s) => s.recordMockAttempt);

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [remain, setRemain] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [page, setPage] = useState(0); // 쪽 모드에서 보고 있는 시험지 쪽
  const startedAt = useRef(0);
  const saved = useRef(false);

  const total = exam ? totalPoints(exam) : 0;

  const score = useMemo(() => {
    if (!exam) return 0;
    return exam.questions.reduce(
      (s, q) => (answers[q.number] === q.answer ? s + q.points : s),
      0,
    );
  }, [exam, answers]);

  const submit = useCallback(() => {
    if (!exam || saved.current) return;
    saved.current = true;
    const wrongEventIds = [
      ...new Set(
        exam.questions
          .filter((q) => answers[q.number] !== q.answer)
          .flatMap((q) => q.eventIds ?? []),
      ),
    ];
    recordMockAttempt(
      {
        examId: exam.id,
        startedAt: startedAt.current,
        finishedAt: Date.now(),
        answers,
        score,
        total,
      },
      wrongEventIds,
    );
    setConfirming(false);
    setSubmitted(true);
  }, [exam, answers, score, total, recordMockAttempt]);

  // 제한 시간 카운트다운 — 0이 되면 자동 제출
  useEffect(() => {
    if (!started || submitted) return;
    const t = setInterval(() => {
      setRemain((r) => {
        if (r <= 1) {
          clearInterval(t);
          submit();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, submitted, submit]);

  if (!exam) {
    return (
      <EmptyState
        icon="📄"
        title="모의고사를 찾을 수 없어요"
        desc="아직 등록되지 않은 회차입니다"
        action={
          <Link href="/mock">
            <Button variant="outline">목록으로</Button>
          </Link>
        }
      />
    );
  }

  const q = exam.questions[idx];
  const answeredCount = Object.keys(answers).length;
  const pageMode = isPageMode(exam);
  // 쪽 모드: 지금 보고 있는 쪽에 실린 문항들
  const pageQuestions = pageMode
    ? exam.questions.filter((x) => (x.page ?? 1) === page + 1)
    : [];

  const pick = (num: number, c: number) =>
    setAnswers((a) => {
      if (a[num] === c) {
        const { [num]: _drop, ...rest } = a;
        return rest;
      }
      return { ...a, [num]: c };
    });

  // ─── 시작 전 ───
  if (!started) {
    return (
      <div className="pt-8">
        <Card className="border-indigo-400/30 bg-indigo-500/10 text-center">
          <p className="text-xs text-indigo-300">
            제{exam.round}회 · {exam.level === "advanced" ? "심화" : "기본"}
          </p>
          <h1 className="mt-1 text-3xl font-black">기출 모의고사</h1>
          <p className="mt-3 text-sm text-zinc-300">
            {exam.questions.length}문항 · {total}점 만점 · {exam.timeLimitMin}분
          </p>
        </Card>

        <SectionTitle>응시 안내</SectionTitle>
        <Card>
          <ul className="flex flex-col gap-1.5 text-xs leading-relaxed text-zinc-400">
            <li>· 시작하면 제한 시간이 흐르고, 0이 되면 자동 제출됩니다.</li>
            <li>· 헷갈리는 문항은 깃발로 표시해 두고 나중에 돌아올 수 있어요.</li>
            <li>· 채점 후 틀린 문항의 개념이 오답노트와 복습 큐에 들어갑니다.</li>
          </ul>
        </Card>

        <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
          출처: {exam.attribution}
        </p>

        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => {
            startedAt.current = Date.now();
            setRemain(exam.timeLimitMin * 60);
            setStarted(true);
          }}
        >
          <Timer size={18} /> 시험 시작
        </Button>
        <Link href="/mock">
          <Button variant="ghost" size="lg" className="mt-2 w-full">
            목록으로
          </Button>
        </Link>
      </div>
    );
  }

  // ─── 채점 결과 ───
  if (submitted) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    const grade = hnkGrade(pct, exam.level);
    const wrong = exam.questions.filter((x) => answers[x.number] !== x.answer);
    const mins = Math.round((Date.now() - startedAt.current) / 60000);
    const wrongEvents = [...new Set(wrong.flatMap((x) => x.eventIds ?? []))];

    return (
      <div className="pt-8">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-sm text-zinc-500">
            제{exam.round}회 {exam.level === "advanced" ? "심화" : "기본"} ·{" "}
            {mins}분 소요
          </p>
          <p className="mt-2 text-6xl font-black tracking-tight">
            {score}
            <span className="text-2xl text-zinc-500">/{total}</span>
          </p>
          <p className="mt-2 text-lg font-bold">
            {grade ? (
              <span className="text-indigo-300">{grade.label} 합격권</span>
            ) : (
              <span className="text-red-400">불합격 (합격선 60점)</span>
            )}
          </p>
          <ProgressBar
            value={pct}
            max={100}
            className="mx-auto mt-4 max-w-52"
            color={pct >= 60 ? "#10b981" : "#ef4444"}
          />
          <p className="mt-2 text-xs text-zinc-500">
            {exam.questions.length}문항 중 {exam.questions.length - wrong.length}
            개 정답
          </p>
        </motion.div>

        <SectionTitle>문항별 결과</SectionTitle>
        <div className="grid grid-cols-8 gap-1.5">
          {exam.questions.map((x, i) => {
            const ok = answers[x.number] === x.answer;
            const blank = answers[x.number] === undefined;
            return (
              <button
                key={x.number}
                type="button"
                title={`${x.number}번 — 정답 ${x.answer}`}
                onClick={() => {
                  setSubmitted(false);
                  setIdx(i);
                }}
                className={cn(
                  "aspect-square rounded-md text-[10px] font-bold transition-colors",
                  ok
                    ? "bg-emerald-500/25 text-emerald-300"
                    : blank
                      ? "bg-white/5 text-zinc-600"
                      : "bg-red-500/25 text-red-300",
                )}
              >
                {x.number}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">
          문항을 누르면 시험지를 다시 볼 수 있어요
        </p>

        {wrong.length > 0 && (
          <>
            <SectionTitle>틀린 문항의 개념</SectionTitle>
            <div className="flex flex-col gap-2">
              {wrongEvents.map((id) => {
                const ev = getEvent(id);
                if (!ev) return null;
                return (
                  <Link key={id} href={`/event/${id}`}>
                    <Card className="flex items-center gap-2">
                      <EraBadge eraId={ev.era} />
                      <span className="flex-1 truncate text-sm font-semibold">
                        {ev.title}
                      </span>
                      <ChevronRight size={15} className="text-zinc-600" />
                    </Card>
                  </Link>
                );
              })}
              {wrongEvents.length === 0 && (
                <Card>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    이 회차는 문항별 개념 연결(eventIds)이 아직 등록되지
                    않았습니다. 데이터 파일에 개념 id를 넣으면 틀린 문항이
                    복습 큐로 연결됩니다.
                  </p>
                </Card>
              )}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-2 pb-4">
          <Link href="/mock">
            <Button size="lg" className="w-full">
              모의고사 목록
            </Button>
          </Link>
          <Link href="/wrong">
            <Button variant="outline" size="lg" className="w-full">
              오답 노트 보기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── 응시 중 ───
  const low = remain <= 600; // 10분 이하

  return (
    <div className="pt-4">
      {/* 상단 고정: 타이머 + 진행 + 제출 */}
      <div className="glass-strong sticky top-2 z-30 mb-3 rounded-2xl px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 text-sm font-black tabular-nums",
              low ? "text-red-400" : "text-zinc-200",
            )}
          >
            <Timer size={14} /> {fmtClock(remain)}
          </span>
          <ProgressBar
            value={answeredCount}
            max={exam.questions.length}
            className="flex-1"
            color={low ? "#ef4444" : "#6366f1"}
          />
          <span className="text-[11px] text-zinc-400">
            {answeredCount}/{exam.questions.length}
          </span>
          <Button size="sm" onClick={() => setConfirming(true)}>
            제출
          </Button>
        </div>
      </div>

      {/* 쪽 모드: 시험지를 넘겨 보며 OMR에 답한다 */}
      {pageMode ? (
        <>
          <PageViewer
            pages={exam.pageImages!}
            page={page}
            onPage={setPage}
          />
          {/* 지금 보고 있는 쪽의 문항만 띄운다 — 50개를 한꺼번에 두면 찾기 어렵다 */}
          <div className="mb-2 mt-5 flex items-baseline justify-between">
            <h2 className="text-base font-bold tracking-tight">
              {page + 1}쪽 답안
            </h2>
            <span className="text-[11px] text-zinc-500">
              {pageQuestions.filter((x) => answers[x.number]).length}/
              {pageQuestions.length} 응답
            </span>
          </div>
          <div className="flex flex-col gap-1.5 pb-4">
            {pageQuestions.map((x) => (
              <div key={x.number} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-8 shrink-0 text-right text-sm font-bold tabular-nums",
                    answers[x.number] ? "text-indigo-300" : "text-zinc-500",
                  )}
                >
                  {x.number}
                </span>
                {CHOICES.map((c) => {
                  const on = answers[x.number] === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => pick(x.number, c)}
                      className={cn(
                        "h-10 flex-1 rounded-lg border text-sm font-bold transition-all active:scale-95",
                        on
                          ? "border-indigo-400 bg-indigo-500 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-500",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 쪽 이동 */}
          <div className="flex gap-2 pb-4">
            <Button
              variant="ghost"
              size="lg"
              disabled={page === 0}
              onClick={() => {
                setPage(page - 1);
                window.scrollTo({ top: 0 });
              }}
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={page >= exam.pageImages!.length - 1}
              onClick={() => {
                setPage(page + 1);
                window.scrollTo({ top: 0 });
              }}
            >
              다음 쪽 <ChevronRight size={18} />
            </Button>
          </div>
        </>
      ) : (
        <>
      {/* 문항 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.number}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.18 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <Badge className="border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
              {q.number}번
            </Badge>
            <Badge>{q.points}점</Badge>
            <span className="flex-1" />
            <button
              type="button"
              aria-label="나중에 다시 볼 문항으로 표시"
              onClick={() =>
                setFlagged((f) => {
                  const n = new Set(f);
                  if (n.has(q.number)) n.delete(q.number);
                  else n.add(q.number);
                  return n;
                })
              }
              className={cn(
                "rounded-lg px-2 py-1 transition-colors",
                flagged.has(q.number)
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-zinc-600 hover:text-zinc-300",
              )}
            >
              <Flag size={14} />
            </button>
          </div>

          <QuestionBody q={q} />

          {/* OMR 답안 */}
          <div className="mt-4 flex gap-2">
            {CHOICES.map((c) => {
              const picked = answers[q.number] === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => pick(q.number, c)}
                  className={cn(
                    "flex h-12 flex-1 items-center justify-center rounded-xl border text-base font-bold transition-all active:scale-95",
                    picked
                      ? "border-indigo-400 bg-indigo-500 text-white"
                      : "border-white/12 bg-white/5 text-zinc-400",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 이동 */}
      <div className="mt-4 flex gap-2">
        <Button
          variant="ghost"
          size="lg"
          disabled={idx === 0}
          onClick={() => setIdx((i) => i - 1)}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          size="lg"
          className="flex-1"
          disabled={idx >= exam.questions.length - 1}
          onClick={() => setIdx((i) => i + 1)}
        >
          다음 <ChevronRight size={18} />
        </Button>
      </div>

      {/* 문항 이동 그리드 */}
      <SectionTitle>문항 이동</SectionTitle>
      <div className="grid grid-cols-8 gap-1.5 pb-4">
        {exam.questions.map((x, i) => {
          const done = answers[x.number] !== undefined;
          return (
            <button
              key={x.number}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "relative aspect-square rounded-md text-[10px] font-bold transition-colors",
                i === idx && "ring-1 ring-white",
                done
                  ? "bg-indigo-500/30 text-indigo-200"
                  : "bg-white/5 text-zinc-600",
              )}
            >
              {x.number}
              {flagged.has(x.number) && (
                <span className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
        </>
      )}

      {/* 제출 확인 */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // 하단 탭바(z-50)보다 위에 떠야 버튼이 눌린다
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 pb-safe"
            onClick={() => setConfirming(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-md rounded-3xl p-5"
            >
              <p className="text-base font-bold">제출할까요?</p>
              <div className="mt-1 text-sm text-zinc-400">
                {exam.questions.length}문항 중 {answeredCount}개 응답했습니다.
                {answeredCount < exam.questions.length && (
                  <span className="mt-1 flex items-center gap-1 text-amber-300">
                    <AlertTriangle size={13} />
                    {exam.questions.length - answeredCount}문항이 비어 있어요
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => setConfirming(false)}
                >
                  <X size={16} /> 더 풀기
                </Button>
                <Button size="lg" className="flex-1" onClick={submit}>
                  <Check size={16} /> 제출
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
