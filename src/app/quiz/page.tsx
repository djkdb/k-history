"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";
import type { Difficulty, EraId, QuizQuestion, QuizType } from "@/lib/types";
import { useApp } from "@/lib/store";
import { ALL_EVENTS, eventsByEra, getEvent } from "@/data/events";
import { ERAS, ERA_MAP } from "@/data/eras";
import {
  DIFFICULTY_ORDER,
  DIFFICULTY_PROFILES,
  generateQuiz,
  generateQuizForEvent,
} from "@/lib/quiz";
import { cn, QUIZ_TYPE_LABELS } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  EraBadge,
  ProgressBar,
  ScrollRow,
  SectionTitle,
} from "@/components/ui";

const ALL_TYPES = Object.keys(QUIZ_TYPE_LABELS) as QuizType[];

type Answered = { question: QuizQuestion; correct: boolean };

/**
 * 해설.
 *
 * 예전에는 "정답: 환구단. (출제 경향 한 줄)"이 전부라, 틀린 사람은
 * 정답 이름만 확인하고 왜 틀렸는지는 모른 채 넘어갔다.
 * 지금은 생성기가 "헤더\n본문" 덩어리를 빈 줄로 이어 붙여 넘겨 준다.
 * 여기서는 그 덩어리를 층으로 세워, 눈이 필요한 곳부터 짚게 한다.
 */
const EXPLAIN_STYLE: Record<string, { color: string; strong?: boolean }> = {
  정답: { color: "text-emerald-300", strong: true },
  "왜 이 답인가": { color: "text-zinc-100" },
  "나머지 보기": { color: "text-zinc-400" },
  "헷갈리는 것": { color: "text-orange-300" },
  "기억 고리": { color: "text-emerald-200" },
  시험에서는: { color: "text-zinc-400" },
};

function Explanation({ text }: { text: string }) {
  const blocks = text
    .split("\n\n")
    .map((b) => {
      const nl = b.indexOf("\n");
      // 옛 형식("정답: …")으로 저장된 해설도 그대로 읽히게 둔다
      if (nl < 0) return { head: null, body: b.trim() };
      return { head: b.slice(0, nl).trim(), body: b.slice(nl + 1).trim() };
    })
    .filter((b) => b.body.length > 0);

  return (
    <div className="mt-3 flex flex-col gap-3">
      {blocks.map((b, i) => {
        const style = b.head ? EXPLAIN_STYLE[b.head] : undefined;
        return (
          <div key={i}>
            {b.head && (
              <p className="mb-1 text-[10px] font-bold tracking-wide text-zinc-500">
                {b.head}
              </p>
            )}
            <p
              className={cn(
                "whitespace-pre-line text-[13px] leading-[1.75]",
                style?.color ?? "text-zinc-300",
                style?.strong && "text-[15px] font-bold",
              )}
            >
              {b.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function QuizSession({
  questions,
  onExit,
  onRestart,
}: {
  questions: QuizQuestion[];
  onExit: () => void;
  onRestart: (wrongOnly: boolean) => void;
}) {
  const recordQuizResult = useApp((s) => s.recordQuizResult);
  const addStudyMinutes = useApp((s) => s.addStudyMinutes);

  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [orderPicks, setOrderPicks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  const grade = (correct: boolean) => {
    recordQuizResult({
      questionId: q.id,
      eventId: q.eventId,
      era: q.era,
      type: q.type,
      correct,
      answeredAt: Date.now(),
    });
    setAnswered((a) => [...a, { question: q, correct }]);
    setRevealed(true);
  };

  const pick = (i: number) => {
    if (revealed) return;
    if (q.type === "order") {
      setOrderPicks((p) =>
        p.includes(i) ? p.filter((x) => x !== i) : [...p, i],
      );
      return;
    }
    setPicked(i);
    grade(i === q.answerIndex);
  };

  const submitOrder = () => {
    if (revealed) return;
    const correct =
      JSON.stringify(orderPicks) === JSON.stringify(q.answerIndex);
    setPicked(-1);
    grade(correct);
  };

  const nextQuestion = () => {
    if (index + 1 >= questions.length) {
      addStudyMinutes(Math.round(questions.length * 0.5));
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setOrderPicks([]);
    setRevealed(false);
  };

  // ─── 결과 화면 ───
  if (finished) {
    const correctCount = answered.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / answered.length) * 100);
    const wrongs = answered.filter((a) => !a.correct);

    const weakEra = (() => {
      const m = new Map<EraId, number>();
      wrongs.forEach((w) => m.set(w.question.era, (m.get(w.question.era) ?? 0) + 1));
      const top = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
      return top ? ERA_MAP[top[0]].name : null;
    })();
    const weakType = (() => {
      const m = new Map<QuizType, number>();
      wrongs.forEach((w) =>
        m.set(w.question.type, (m.get(w.question.type) ?? 0) + 1),
      );
      const top = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
      return top && top[1] >= 2 ? QUIZ_TYPE_LABELS[top[0]] : null;
    })();

    return (
      <div className="pt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-sm text-zinc-500">퀴즈 완료</p>
          <p className="mt-2 text-6xl font-black tracking-tight">
            {pct}
            <span className="text-2xl text-zinc-500">점</span>
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {answered.length}문제 중 {correctCount}개 정답
          </p>
          <ProgressBar
            value={pct}
            max={100}
            className="mx-auto mt-4 max-w-52"
            color={pct >= 60 ? "#10b981" : "#ef4444"}
          />
        </motion.div>

        <SectionTitle>AI 오답 분석</SectionTitle>
        <Card className="border-indigo-400/30 bg-indigo-500/10">
          {wrongs.length === 0 ? (
            <p className="text-sm leading-relaxed text-zinc-200">
              완벽합니다. 이 범위는 장기기억으로 넘어가는 중이에요. 망각곡선
              복습만 놓치지 마세요. 🎯
            </p>
          ) : (
            <ul className="flex list-inside flex-col gap-1.5 text-sm leading-relaxed text-zinc-200">
              {weakEra && (
                <li>
                  • <b>{weakEra}</b> 파트가 약합니다. 해당 시대를 흐름 모드로
                  다시 훑어보세요.
                </li>
              )}
              {weakType && (
                <li>
                  • <b>{weakType}</b> 유형을 반복해서 틀리고 있어요. 같은
                  유형만 골라 다시 풀어보세요.
                </li>
              )}
              <li>
                • 틀린 {wrongs.length}개 개념은 <b>오답노트와 복습 큐</b>에
                자동 반영했습니다.
              </li>
            </ul>
          )}
        </Card>

        {wrongs.length > 0 && (
          <>
            <SectionTitle>틀린 개념 바로가기</SectionTitle>
            <div className="flex flex-col gap-2">
              {[...new Map(wrongs.map((w) => [w.question.eventId, w])).values()].map(
                (w) => {
                  const ev = getEvent(w.question.eventId);
                  if (!ev) return null;
                  return (
                    <Link key={ev.id} href={`/event/${ev.id}`}>
                      <Card className="flex items-center gap-2">
                        <EraBadge eraId={ev.era} />
                        <span className="flex-1 truncate text-sm font-semibold">
                          {ev.title}
                        </span>
                        <ChevronRight size={15} className="text-zinc-600" />
                      </Card>
                    </Link>
                  );
                },
              )}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-2 pb-4">
          <Button size="lg" onClick={() => onRestart(false)}>
            <RotateCcw size={16} /> 다시 풀기
          </Button>
          {wrongs.length > 0 && (
            <Button variant="outline" size="lg" onClick={() => onRestart(true)}>
              오답만 다시 풀기
            </Button>
          )}
          <Button variant="ghost" size="lg" onClick={onExit}>
            설정으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // ─── 문제 화면 ───
  return (
    <div className="pt-6">
      <div className="mb-4 flex items-center gap-3">
        <ProgressBar value={index + (revealed ? 1 : 0)} max={questions.length} className="flex-1" />
        <span className="text-xs font-semibold text-zinc-400">
          {index + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.22 }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
                {QUIZ_TYPE_LABELS[q.type]}
              </Badge>
              <EraBadge eraId={q.era} />
              <Badge
                className={cn(
                  q.difficulty === "hard" &&
                    "border-red-400/30 bg-red-500/10 text-red-300",
                  q.difficulty === "basic" &&
                    "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
                )}
              >
                {DIFFICULTY_PROFILES[q.difficulty].label}
              </Badge>
              {q.pastExams?.length ? (
                <Badge className="border-amber-400/30 bg-amber-500/10 text-amber-300">
                  기출 {q.pastExams[0].round}회{" "}
                  {q.pastExams[0].level === "advanced" ? "심화" : "기본"}{" "}
                  {q.pastExams[0].number}번
                </Badge>
              ) : null}
            </div>
            {/* 사료·지문은 문제와 분리해 보여 준다 */}
            {q.passage && (
              <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-zinc-300">
                  {q.passage}
                </p>
              </div>
            )}
            <p className="whitespace-pre-line text-[15px] font-semibold leading-relaxed">
              {q.question}
            </p>
          </Card>

          {/* 보기 — O/X는 글자가 한 자뿐이라 세로 목록이면 화면이 텅 빈다 */}
          <div
            className={cn(
              "mt-3 gap-2",
              q.type === "ox" ? "grid grid-cols-2" : "flex flex-col",
            )}
          >
            {q.options.map((opt, i) => {
              const isAnswer = Array.isArray(q.answerIndex)
                ? false
                : i === q.answerIndex;
              const isPicked = q.type === "order" ? orderPicks.includes(i) : picked === i;
              const orderNo = orderPicks.indexOf(i);
              const showState = revealed && q.type !== "order";
              return (
                <motion.button
                  key={`${q.id}-${i}`}
                  type="button"
                  onClick={() => pick(i)}
                  animate={
                    showState && isPicked && !isAnswer
                      ? { x: [0, -7, 7, -4, 4, 0] }
                      : {}
                  }
                  transition={{ duration: 0.35 }}
                  className={cn(
                    "glass flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.99]",
                    q.type === "ox" &&
                      "flex-col justify-center gap-1.5 py-7 text-3xl font-black",
                    !revealed && "hover:bg-white/10",
                    showState && isAnswer &&
                      "border-emerald-400/60 bg-emerald-500/15 text-emerald-200",
                    showState && isPicked && !isAnswer &&
                      "border-red-400/60 bg-red-500/15 text-red-200",
                    q.type === "order" && isPicked &&
                      "border-indigo-400/60 bg-indigo-500/15",
                  )}
                >
                  {q.type === "order" && (
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        isPicked
                          ? "bg-indigo-400 text-zinc-950"
                          : "bg-white/10 text-zinc-500",
                      )}
                    >
                      {isPicked ? orderNo + 1 : "·"}
                    </span>
                  )}
                  <span className={q.type === "ox" ? "" : "flex-1"}>{opt}</span>
                  {showState && isAnswer && <Check size={q.type === "ox" ? 20 : 16} />}
                  {showState && isPicked && !isAnswer && (
                    <X size={q.type === "ox" ? 20 : 16} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {q.type === "order" && !revealed && (
            <Button
              size="lg"
              className="mt-3 w-full"
              disabled={orderPicks.length !== q.options.length}
              onClick={submitOrder}
            >
              제출
            </Button>
          )}

          {/* 해설 */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className={cn(
                    "mt-3",
                    answered[answered.length - 1]?.correct
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-red-400/30 bg-red-500/10",
                  )}
                >
                  <p className="text-[13px] font-bold">
                    {answered[answered.length - 1]?.correct
                      ? "✅ 정답!"
                      : "❌ 오답 — 복습 큐에 등록했어요"}
                  </p>
                  <Explanation text={q.explanation} />
                  <Link href={`/event/${q.eventId}`}>
                    <Button variant="outline" size="sm" className="mt-3.5">
                      <BookOpen size={14} /> 개념 전체 보기
                    </Button>
                  </Link>
                </Card>
                <Button size="lg" className="mt-3 w-full" onClick={nextQuestion}>
                  {index + 1 >= questions.length ? "결과 보기" : "다음 문제"}
                  <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const eraParam = searchParams.get("era") as EraId | null;
  const eventParam = searchParams.get("event");
  const modeParam = searchParams.get("mode");

  const hydrated = useApp((s) => s.hydrated);
  const wrongEventIds = useApp((s) => s.wrongEventIds);
  const quizHistory = useApp((s) => s.quizHistory);

  // 범위는 두 갈래다.
  //  · 특별 범위(전체·오답노트·약한 시대)는 서로 배타적이다
  //  · 시대는 여러 개를 함께 고를 수 있다 — "고려+조선만" 같은 요구가 흔하다
  // 시대를 하나라도 고르면 특별 범위는 자동으로 풀린다.
  const [special, setSpecial] = useState<"all" | "wrong" | "weak">(
    modeParam === "wrong" ? "wrong" : "all",
  );
  const [eraSel, setEraSel] = useState<EraId[]>(
    eraParam && ERA_MAP[eraParam] ? [eraParam] : [],
  );
  const toggleEra = (id: EraId) =>
    setEraSel((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("real");
  const [types, setTypes] = useState<QuizType[]>(ALL_TYPES);

  // 난이도를 바꾸면 그 난이도에서 낼 수 있는 유형만 남긴다
  const availableTypes = DIFFICULTY_PROFILES[difficulty].types;
  const studiedEventIds = useApp((s) => s.studiedEventIds);
  const [session, setSession] = useState<QuizQuestion[] | null>(null);

  // 학습 직후 "이 개념 퀴즈 풀기"로 진입한 경우 — 학습 범위를 넘겨
  // 아직 배우지 않은 내용을 알아야 풀리는 문제가 나오지 않게 한다.
  const eventSessionStarted = useRef(false);
  useEffect(() => {
    if (!eventParam || !hydrated || eventSessionStarted.current) return;
    const ev = getEvent(eventParam);
    if (!ev) return;
    eventSessionStarted.current = true;
    setSession(
      generateQuizForEvent(ev, ALL_EVENTS, {
        knownEventIds: studiedEventIds,
      }),
    );
  }, [eventParam, hydrated, studiedEventIds]);
  const [sessionKey, setSessionKey] = useState(0);
  const [lastWrongIds, setLastWrongIds] = useState<string[]>([]);

  const weakEra = useMemo(() => {
    const byEra = new Map<EraId, { total: number; correct: number }>();
    for (const r of quizHistory) {
      const cur = byEra.get(r.era) ?? { total: 0, correct: 0 };
      cur.total += 1;
      if (r.correct) cur.correct += 1;
      byEra.set(r.era, cur);
    }
    const rows = [...byEra.entries()]
      .filter(([, v]) => v.total >= 5)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total);
    return rows[0]?.[0] ?? null;
  }, [quizHistory]);

  const scopeEvents = useMemo(() => {
    // 시대를 골랐으면 그 시대들의 합집합이 곧 범위다
    if (eraSel.length > 0)
      return ALL_EVENTS.filter((e) => eraSel.includes(e.era));
    if (special === "wrong")
      return wrongEventIds
        .map((id) => getEvent(id))
        .filter((e): e is NonNullable<typeof e> => !!e);
    if (special === "weak") return weakEra ? eventsByEra(weakEra) : ALL_EVENTS;
    return ALL_EVENTS;
  }, [special, eraSel, wrongEventIds, weakEra]);

  const scopeLabel =
    eraSel.length > 0
      ? eraSel.map((id) => ERA_MAP[id].name).join(" · ")
      : special === "wrong"
        ? "오답노트"
        : special === "weak"
          ? "약한 시대"
          : "전체";

  const start = (events = scopeEvents) => {
    const qs = generateQuiz({
      events,
      count,
      types: types.filter((t) => availableTypes.includes(t)),
      knownEventIds: studiedEventIds,
      difficulty,
    });
    setSession(qs);
    setSessionKey((k) => k + 1);
    setLastWrongIds([]);
  };

  const restart = (wrongOnly: boolean) => {
    if (wrongOnly && lastWrongIds.length > 0) {
      const events = lastWrongIds
        .map((id) => getEvent(id))
        .filter((e): e is NonNullable<typeof e> => !!e);
      const qs = generateQuiz({
        events,
        count: Math.min(count, events.length * 3),
        types: types.filter((t) => availableTypes.includes(t)),
        knownEventIds: studiedEventIds,
        difficulty,
      });
      setSession(qs);
    } else {
      start();
    }
    setSessionKey((k) => k + 1);
  };

  if (session && session.length > 0) {
    return (
      <SessionWithWrongTracking
        key={sessionKey}
        questions={session}
        onExit={() => setSession(null)}
        onRestart={restart}
        onWrong={setLastWrongIds}
      />
    );
  }

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold tracking-tight">퀴즈</h1>
      <p className="mt-1 text-sm text-zinc-500">
        인출 연습이 곧 장기기억 — 출제위원이 데이터에서 직접 문제를 만듭니다
      </p>

      <SectionTitle>범위</SectionTitle>
      <ScrollRow>
        <Chip
          active={eraSel.length === 0 && special === "all"}
          onClick={() => {
            setSpecial("all");
            setEraSel([]);
          }}
        >
          전체
        </Chip>
        <Chip
          active={eraSel.length === 0 && special === "wrong"}
          onClick={() => {
            setSpecial("wrong");
            setEraSel([]);
          }}
        >
          오답노트 {hydrated ? `(${wrongEventIds.length})` : ""}
        </Chip>
        {weakEra && (
          <Chip
            active={eraSel.length === 0 && special === "weak"}
            onClick={() => {
              setSpecial("weak");
              setEraSel([]);
            }}
          >
            약한 시대 자동
          </Chip>
        )}
      </ScrollRow>

      {/* 시대는 중복 선택 — 골라 놓은 것이 몇 개인지 바로 보이게 한다 */}
      <div className="mt-3 mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-500">
          시대별 (여러 개 선택 가능)
        </span>
        {eraSel.length > 0 && (
          <button
            type="button"
            onClick={() => setEraSel([])}
            className="text-[11px] font-medium text-indigo-300 underline-offset-2 hover:underline"
          >
            {eraSel.length}개 선택됨 · 해제
          </button>
        )}
      </div>
      <ScrollRow>
        {ERAS.map((era) => {
          const on = eraSel.includes(era.id);
          return (
            <Chip key={era.id} active={on} onClick={() => toggleEra(era.id)}>
              <span className="flex items-center gap-1.5">
                {on && <Check size={13} strokeWidth={3} />}
                {era.symbol} {era.name}
              </span>
            </Chip>
          );
        })}
      </ScrollRow>

      <SectionTitle>난이도</SectionTitle>
      <div className="flex flex-col gap-2">
        {DIFFICULTY_ORDER.map((d) => {
          const p = DIFFICULTY_PROFILES[d];
          const active = difficulty === d;
          const accent =
            d === "hard" ? "#ef4444" : d === "real" ? "#6366f1" : "#10b981";
          return (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDifficulty(d);
                setTypes(DIFFICULTY_PROFILES[d].types);
              }}
              className={cn(
                "glass rounded-2xl p-3 text-left transition-all active:scale-[0.99]",
                active && "ring-1",
              )}
              style={
                active
                  ? {
                      background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                      borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
                      // @ts-expect-error CSS 변수로 ring 색 지정
                      "--tw-ring-color": `color-mix(in srgb, ${accent} 45%, transparent)`,
                    }
                  : undefined
              }
            >
              <span className="flex items-center gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: active ? accent : undefined }}
                >
                  {p.label}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {"●".repeat(DIFFICULTY_ORDER.indexOf(d) + 1)}
                  {"○".repeat(2 - DIFFICULTY_ORDER.indexOf(d))}
                </span>
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-zinc-500">
                {p.description}
              </span>
            </button>
          );
        })}
      </div>

      <SectionTitle>문항 수</SectionTitle>
      <div className="flex gap-2">
        {[5, 10, 20].map((n) => (
          <Chip key={n} active={count === n} onClick={() => setCount(n)}>
            {n}문제
          </Chip>
        ))}
      </div>

      <SectionTitle>유형</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {availableTypes.map((t) => (
          <Chip
            key={t}
            active={types.includes(t)}
            onClick={() =>
              setTypes((prev) =>
                prev.includes(t)
                  ? prev.length > 1
                    ? prev.filter((x) => x !== t)
                    : prev
                  : [...prev, t],
              )
            }
          >
            {QUIZ_TYPE_LABELS[t]}
          </Chip>
        ))}
      </div>

      {eraSel.length === 0 && special === "wrong" && scopeEvents.length === 0 ? (
        <Card className="mt-8">
          <EmptyState
            icon={<Brain size={28} />}
            title="오답이 없어요"
            desc="퀴즈를 풀면 틀린 개념이 자동으로 모입니다"
          />
        </Card>
      ) : (
        /*
          시작 버튼은 아래 탭바에 가려지기 쉬운 자리에 있다. 설정을 만지는
          동안에도 늘 손에 닿도록 탭바 바로 위에 붙여 둔다.
        */
        <div className="sticky bottom-[92px] z-40 mt-8 pb-2">
          <Button
            size="lg"
            className="w-full shadow-2xl shadow-indigo-950/60"
            disabled={scopeEvents.length === 0}
            onClick={() => start()}
          >
            <Brain size={18} /> 퀴즈 시작 — {scopeLabel} ({scopeEvents.length}개
            개념)
          </Button>
        </div>
      )}
    </div>
  );
}

/** 세션 래퍼: 오답 이벤트 id를 상위로 전달해 '오답만 다시'에 사용 */
function SessionWithWrongTracking({
  questions,
  onExit,
  onRestart,
  onWrong,
}: {
  questions: QuizQuestion[];
  onExit: () => void;
  onRestart: (wrongOnly: boolean) => void;
  onWrong: (ids: string[]) => void;
}) {
  const quizHistory = useApp((s) => s.quizHistory);
  const startLen = useMemo(() => quizHistory.length, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QuizSession
      questions={questions}
      onExit={onExit}
      onRestart={(wrongOnly) => {
        const sessionResults = useApp.getState().quizHistory.slice(startLen);
        onWrong([
          ...new Set(
            sessionResults.filter((r) => !r.correct).map((r) => r.eventId),
          ),
        ]);
        onRestart(wrongOnly);
      }}
    />
  );
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizContent />
    </Suspense>
  );
}
