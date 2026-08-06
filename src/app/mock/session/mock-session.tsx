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
/** 해설에서 정답 번호를 시험지와 같은 모양으로 보여 준다 */
const CIRCLED = ["①", "②", "③", "④", "⑤"];

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

/** 시험지와 답안의 너비를 기억해 둔다 — 사람마다 편한 비율이 다르다 */
const SPLIT_KEY = "khlm:exam-split";
const MIN_RIGHT = 200; // 선택지 글이 읽히는 최소 폭
const MIN_LEFT = 340; // 시험지가 알아볼 만한 최소 폭

/**
 * 두 단 사이의 드래그 손잡이.
 *
 * 시험지를 크게 보고 싶은 사람과 선택지를 편히 읽고 싶은 사람이 다르다.
 * 좁은 화면에서는 애초에 한 단이라 손잡이도 숨긴다.
 */
function SplitHandle({
  containerRef,
  onWidth,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onWidth: (w: number | null) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const move = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!dragging || !el) return;
    const r = el.getBoundingClientRect();
    const max = Math.max(MIN_RIGHT, r.width - MIN_LEFT);
    onWidth(Math.min(Math.max(Math.round(r.right - e.clientX), MIN_RIGHT), max));
  };

  const end = () => {
    if (!dragging) return;
    setDragging(false);
    document.body.style.userSelect = "";
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="시험지와 답안의 너비 조절"
      title="드래그해서 너비 조절 · 두 번 누르면 원래대로"
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        // 끄는 동안 시험지 글이 파랗게 잡히는 걸 막는다
        document.body.style.userSelect = "none";
        setDragging(true);
      }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onDoubleClick={() => onWidth(null)}
      className="hidden cursor-col-resize touch-none select-none self-stretch min-[740px]:flex min-[740px]:items-center min-[740px]:justify-center"
    >
      <span
        className={cn(
          "h-full w-[3px] rounded-full transition-colors",
          dragging ? "bg-indigo-400" : "bg-white/10 hover:bg-white/30",
        )}
      />
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
  const [showAllExp, setShowAllExp] = useState(false);
  const [splitW, setSplitW] = useState<number | null>(null); // 오른쪽 열 폭(px)
  const splitRef = useRef<HTMLDivElement>(null);
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

  // 지난번에 맞춰 둔 너비를 되살린다
  useEffect(() => {
    const v = Number(localStorage.getItem(SPLIT_KEY));
    if (v >= MIN_RIGHT) setSplitW(v);
  }, []);

  const changeWidth = useCallback((w: number | null) => {
    setSplitW(w);
    if (w === null) localStorage.removeItem(SPLIT_KEY);
    else localStorage.setItem(SPLIT_KEY, String(w));
  }, []);

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

    // 해설은 틀린 문항부터 보여 준다. 맞힌 문항은 눌러서 펼친다.
    const withExp = exam.questions.filter((x) => x.explanation);
    const hasAllExplanations = withExp.length === exam.questions.length;
    const explained = showAllExp
      ? withExp
      : withExp.filter((x) => answers[x.number] !== x.answer);

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
                  // 다시 풀고 제출할 수 있어야 한다.
                  // 중복 저장을 막는 빗장을 여기서 풀지 않으면 제출이 먹지 않는다.
                  saved.current = false;
                  setSubmitted(false);
                  setShowAllExp(false);
                  setIdx(i);
                  if (pageMode) setPage((exam.questions[i].page ?? 1) - 1);
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

        {explained.length > 0 && (
          <>
            <SectionTitle>해설</SectionTitle>
            <p className="mb-2 -mt-1 text-[11px] leading-relaxed text-zinc-600">
              공식 정답표를 기준으로 자료의 단서와 정답 근거만 짧게 정리했습니다.
            </p>
            <div className="flex flex-col gap-2">
              {explained.map((q) => {
                const mine = answers[q.number];
                const ok = mine === q.answer;
                return (
                  <Card key={q.number} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold",
                          ok
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-red-500/20 text-red-300",
                        )}
                      >
                        {q.number}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        정답 {CIRCLED[q.answer - 1]}
                        {!ok && (
                          <>
                            {" · "}
                            <span className="text-red-400">
                              내 답{" "}
                              {mine === undefined ? "미표기" : CIRCLED[mine - 1]}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {q.explanation}
                    </p>
                  </Card>
                );
              })}
            </div>
            {hasAllExplanations && (
              <button
                type="button"
                onClick={() => setShowAllExp((v) => !v)}
                className="mt-2 w-full rounded-lg bg-white/6 py-2 text-[11px] font-semibold text-zinc-400 transition-colors active:bg-white/10"
              >
                {showAllExp ? "틀린 문항만 보기" : "맞힌 문항 해설도 보기"}
              </button>
            )}
          </>
        )}

        {wrong.length > 0 && (
          <>
            <SectionTitle>복습할 개념</SectionTitle>
            {wrongEvents.length > 0 && (
              <p className="mb-2 -mt-1 text-[11px] leading-relaxed text-zinc-600">
                틀린 문항의 자료·발문에서 자동으로 찾아낸 개념입니다. 모든 문항이
                연결되지는 않으며, 드물게 어긋날 수 있습니다.
              </p>
            )}
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
                    이 회차는 스캔 시험지라 문항 텍스트를 읽을 수 없어 개념
                    연결이 없습니다. 오답노트에서 시대별로 복습해 보세요.
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
    // 데스크톱에서는 컨테이너 폭을 넘어 넓게 쓴다 — 시험지와 답안을 나란히 놓기 위해
    <div className="wide-page pt-4">
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
        <div ref={splitRef}
          style={
            splitW
              ? { gridTemplateColumns: `minmax(0,1fr) 20px ${splitW}px` }
              : undefined
          }
          className="min-[740px]:grid min-[740px]:grid-cols-[minmax(0,1fr)_20px_220px] min-[900px]:grid-cols-[minmax(0,1fr)_20px_260px] min-[1024px]:grid-cols-[minmax(0,1fr)_20px_300px] xl:grid-cols-[minmax(0,1fr)_20px_360px] min-[740px]:items-start">
          <PageViewer
            pages={exam.pageImages!}
            page={page}
            onPage={setPage}
          />
          <SplitHandle containerRef={splitRef} onWidth={changeWidth} />
          <div className="min-[740px]:sticky min-[740px]:top-20">
          {/* 지금 보고 있는 쪽의 문항만 띄운다 — 50개를 한꺼번에 두면 찾기 어렵다 */}
          <div className="mb-2 mt-5 flex items-baseline justify-between min-[740px]:mt-0">
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
          </div>
        </div>
      ) : (
        <div ref={splitRef}
          style={
            splitW
              ? { gridTemplateColumns: `minmax(0,1fr) 20px ${splitW}px` }
              : undefined
          }
          className="min-[740px]:grid min-[740px]:grid-cols-[minmax(0,1fr)_20px_220px] min-[900px]:grid-cols-[minmax(0,1fr)_20px_260px] min-[1024px]:grid-cols-[minmax(0,1fr)_20px_300px] xl:grid-cols-[minmax(0,1fr)_20px_360px] min-[740px]:items-start">
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
        </motion.div>
      </AnimatePresence>

      <SplitHandle containerRef={splitRef} onWidth={changeWidth} />

      {/* 오른쪽 열: 답안 · 이동 — 데스크톱에서는 스크롤을 따라온다 */}
      <div className="min-[740px]:sticky min-[740px]:top-20">
      {/*
        OMR 답안.
        좁은 화면에서는 번호만 한 줄로 놓는다 — 선택지 글은 시험지 이미지에 이미 있고,
        화면을 차지하면 정작 문제가 밀린다.
        넓은 화면에서는 오른쪽 열에 선택지 글까지 펼쳐 눌러서 고르게 한다.
      */}
      <div className="mt-4 flex gap-2 min-[740px]:mt-0 min-[740px]:flex-col min-[740px]:gap-1.5">
        {CHOICES.map((c) => {
          const picked = answers[q.number] === c;
          const label = q.options?.[c - 1];
          return (
            <button
              key={c}
              type="button"
              onClick={() => pick(q.number, c)}
              className={cn(
                "flex h-12 flex-1 items-center justify-center rounded-xl border text-base font-bold transition-all active:scale-95",
                "min-[740px]:h-auto min-[740px]:flex-none min-[740px]:justify-start min-[740px]:gap-2.5 min-[740px]:px-3 min-[740px]:py-2.5 min-[740px]:text-left",
                picked
                  ? "border-indigo-400 bg-indigo-500 text-white"
                  : "border-white/12 bg-white/5 text-zinc-400 min-[740px]:hover:border-white/25 min-[740px]:hover:bg-white/8",
              )}
            >
              <span
                className={cn(
                  "shrink-0 min-[740px]:flex min-[740px]:h-6 min-[740px]:w-6 min-[740px]:items-center min-[740px]:justify-center min-[740px]:rounded-md min-[740px]:text-[11px]",
                  picked ? "min-[740px]:bg-white/20" : "min-[740px]:bg-white/8",
                )}
              >
                {c}
              </span>
              {label && (
                <span
                  className={cn(
                    "hidden flex-1 text-[13px] font-medium leading-snug min-[740px]:block",
                    picked ? "text-white" : "text-zinc-300",
                  )}
                >
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>

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
      </div>
        </div>
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
