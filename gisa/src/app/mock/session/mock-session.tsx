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
  Flag,
  Home,
  NotebookPen,
  X,
} from "lucide-react";
import { Button, Card, ProgressBar, SectionTitle } from "@/components/ui";
import { WrittenQuestionCard } from "@/components/written-question";
import {
  SUBJECTS,
  SUBJECT_MAP,
  WRITTEN,
  cutoff,
  judgeWritten,
  subjectInk,
} from "@/data/exam";
import { makeWrittenMock, tallyBySubject } from "@/lib/quiz";
import { useApp } from "@/lib/store";
import { clearWritten, readWritten, writeWritten } from "@/lib/mock-progress";
import { cn, formatExamClock } from "@/lib/utils";

export function MockSession() {
  const params = useSearchParams();
  const seed = Number(params.get("seed")) || 1;
  const questions = useMemo(() => makeWrittenMock(seed), [seed]);
  const recordMockAttempt = useApp((s) => s.recordMockAttempt);

  /**
   * ⚠️ 저장본은 처음 한 번만 읽는다.
   *
   * 예전 앱에서 이것을 effect 로 읽었다가, 답안을 저장하는 effect 가 먼저
   * 돌면서 빈 답안으로 덮어써 시험 도중 새로고침하면 전부 날아갔다.
   * 초기값으로 읽으면 첫 렌더부터 답안이 들어 있어 그 틈이 없다.
   */
  const [saved] = useState(() => {
    const p = readWritten();
    return p && p.seed === seed ? p : null;
  });
  const [startedAt] = useState(() => saved?.startedAt ?? Date.now());
  const [endsAt] = useState(
    () => saved?.endsAt ?? Date.now() + WRITTEN.minutes * 60_000,
  );
  const [at, setAt] = useState(() =>
    saved ? Math.min(saved.at, questions.length - 1) : 0,
  );
  const [answers, setAnswers] = useState<Record<number, number>>(
    () => saved?.answers ?? {},
  );
  const [flagged, setFlagged] = useState<number[]>(() => saved?.flagged ?? []);

  const [left, setLeft] = useState(() => Math.max(0, endsAt - Date.now()));
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sheet, setSheet] = useState(false);
  /** 채점 화면에서 한 번에 펼쳐 보여 줄 오답 수 */
  const [shown, setShown] = useState(20);
  const topRef = useRef<HTMLDivElement>(null);

  const submit = useCallback(() => {
    setSubmitted(true);
    setConfirming(false);
    setSheet(false);
    clearWritten();
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
    writeWritten({ seed, startedAt, endsAt, at, answers, flagged });
  }, [answers, at, endsAt, flagged, seed, startedAt, submitted]);

  const bySubject = useMemo(
    () => tallyBySubject(questions, answers),
    [questions, answers],
  );
  const verdict = useMemo(() => judgeWritten(bySubject), [bySubject]);

  // 채점하면 틀린 문항의 개념을 복습으로 넘긴다
  const recorded = useRef(false);
  useEffect(() => {
    if (!submitted || recorded.current) return;
    recorded.current = true;
    const wrong = questions
      .filter((q, i) => answers[i] !== q.answerIndex)
      .map((q) => q.sourceId);
    recordMockAttempt(
      {
        track: "written",
        startedAt,
        finishedAt: Date.now(),
        score: verdict.score,
        passed: verdict.passed,
        bySubject,
        // 나중에 오답 노트에서 이 시험지를 그대로 다시 펴기 위한 것들
        seed,
        qids: questions.map((q) => q.id),
        picks: answers,
        wrongSourceIds: [...new Set(wrong)],
      },
      [...new Set(wrong)],
    );
  }, [
    answers,
    bySubject,
    questions,
    recordMockAttempt,
    seed,
    startedAt,
    submitted,
    verdict,
  ]);

  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    /*
     * 틀린 문항을 두 무리로 가른다.
     *
     * 답을 골랐는데 틀린 것과, 시간이 모자라 비워 둔 것은 전혀 다른 일이다.
     * 앞엣것은 잘못 알고 있는 것이고 뒤엣것은 속도 문제다. 한 줄로 99개를
     * 쏟아 놓으면 그 차이가 묻히고, 정작 봐야 할 것을 찾지 못한다.
     */
    const missed = questions
      .map((q, i) => ({ q, i }))
      .filter(
        ({ q, i }) => answers[i] !== undefined && answers[i] !== q.answerIndex,
      );
    const blank = questions
      .map((q, i) => ({ q, i }))
      .filter(({ i }) => answers[i] === undefined);

    return (
      <main className="py-6">
        {/* 시험 중에는 아래 길잡이를 감춰 두었다. 채점 화면에서 틀린 문항
            100개를 다 내려가야 나갈 수 있으면 갇힌 느낌이 나므로 위에도
            나가는 길을 둔다. */}
        <div className="flex items-center gap-3">
          <Link
            href="/mock"
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

        {/*
          결과 화면에는 큰 제목 대신 점수가 맨 위에 온다 — 시험을 막 끝낸
          사람이 가장 먼저 보고 싶은 것이 그것이다. 소리로 듣는 사람에게만
          여기가 어디인지 알린다.
        */}
        <h1 className="sr-only">필기 모의고사 결과</h1>

        <Card
          className={cn(
            "mt-4",
            verdict.passed
              ? "border-emerald-400/30 bg-emerald-500/10"
              : "border-rose-400/30 bg-rose-500/10",
          )}
        >
          <p className="text-[12px] text-zinc-400">평균</p>
          <p className="mt-1 text-4xl font-bold tabular-nums">
            {verdict.score}점
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
            필기는 과목마다 40점 이상이면서 평균 60점 이상이어야 합격입니다.
          </p>
        </Card>

        <SectionTitle>과목별</SectionTitle>
        <div className="flex flex-col gap-2">
          {bySubject.map((b) => {
            const s = SUBJECT_MAP[b.subject];
            const score = Math.round((b.correct / b.total) * 100);
            const under = b.correct < cutoff(b.subject);
            return (
              <Card key={b.subject}>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: subjectInk(s.id) }}
                  >
                    {s.symbol} {s.name}
                  </span>
                  <span
                    className={cn(
                      "ml-auto shrink-0 text-[14px] font-bold tabular-nums",
                      under ? "text-rose-300" : "text-zinc-200",
                    )}
                  >
                    {score}점
                  </span>
                </div>
                <ProgressBar
                  className="mt-2"
                  value={b.correct}
                  max={b.total}
                  color={under ? "#fb7185" : s.color}
                />
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  {b.total}문항 중 {b.correct}개 정답
                  {under && ` · 과락 (${cutoff(b.subject)}개는 맞혀야 합니다)`}
                </p>
                {/*
                  점수만 보여 주고 끝내면 "그래서 뭘 하지" 가 남는다.
                  무너진 과목에서 곧바로 공부로 이어 준다.
                */}
                {under && (
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/quiz?subject=${b.subject}`}
                      className="min-w-0 flex-1"
                    >
                      <Button size="sm" className="w-full">
                        이 과목 문제 풀기
                      </Button>
                    </Link>
                    <Link
                      href={`/learn?subject=${b.subject}`}
                      className="min-w-0 flex-1"
                    >
                      <Button size="sm" variant="outline" className="w-full">
                        개념 보기
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {missed.length > 0 && (
          <>
            <SectionTitle>골랐는데 틀린 문항 {missed.length}개</SectionTitle>
            <p className="-mt-1 mb-3 text-[12px] leading-relaxed text-zinc-500">
              잘못 알고 있던 것들입니다. 해설 아래의 개념으로 가서 한 번 더
              보세요.
            </p>
            <div className="flex flex-col gap-3">
              {missed.slice(0, shown).map(({ q, i }) => (
                <Card key={q.id}>
                  <WrittenQuestionCard
                    q={q}
                    index={i}
                    total={questions.length}
                    picked={answers[i] ?? null}
                    onPick={() => {}}
                    revealed
                  />
                </Card>
              ))}
            </div>
            {missed.length > shown && (
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => setShown((n) => n + 20)}
              >
                {missed.length - shown}개 더 보기
              </Button>
            )}
          </>
        )}

        {blank.length > 0 && (
          <>
            <SectionTitle>비워 둔 문항 {blank.length}개</SectionTitle>
            <Card>
              <p className="text-[13px] leading-relaxed text-zinc-300">
                손대지 못한 문항입니다. 몰라서가 아니라 시간이 모자랐다면 풀이
                속도를 재 보는 편이 낫습니다 — 실제 시험은 100문항을 150분에
                풉니다(한 문항 90초).
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {blank.slice(0, 40).map(({ q, i }) => (
                  <span
                    key={q.id}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] tabular-nums text-zinc-500"
                  >
                    {i + 1}
                  </span>
                ))}
                {blank.length > 40 && (
                  <span className="px-1 text-[11px] text-zinc-600">
                    … 그리고 {blank.length - 40}개 더
                  </span>
                )}
              </div>
            </Card>
          </>
        )}

        {missed.length === 0 && blank.length === 0 && (
          <>
            <SectionTitle>틀린 문항</SectionTitle>
            <Card>
              <p className="text-[13px] text-zinc-300">
                하나도 틀리지 않았습니다.
              </p>
            </Card>
          </>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {/*
            점수만 보고 나오면 다음에 같은 문제를 또 틀린다. 결과 화면을
            떠나기 전에 "무엇을, 왜" 로 갈 수 있는 길을 맨 위에 둔다.
          */}
          <Link href={`/mock/note?at=${startedAt}`}>
            <Button size="lg" className="w-full">
              <NotebookPen size={16} />
              오답 노트 보기
            </Button>
          </Link>
          <Link href="/review">
            <Button size="lg" variant="outline" className="w-full">
              틀린 개념 복습하기
            </Button>
          </Link>
          <Link href="/mock">
            <Button size="lg" variant="ghost" className="w-full">
              모의고사 목록으로
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const q = questions[at];
  const urgent = left < 10 * 60_000;

  return (
    <main className="py-4" ref={topRef}>
      {/*
        시험 중에는 화면 이름을 눈에 보이게 두지 않는다 — 좁은 화면에서는
        시계와 문항이 먼저다. 그런데 그러면 화면을 읽어 주는 기기에 이곳이
        어디인지 말해 줄 것이 하나도 남지 않는다. 눈에는 안 보이되 소리로는
        들리는 제목을 둔다.
      */}
      <h1 className="sr-only">정보처리기사 필기 모의고사</h1>
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
          <span className="text-[12px] tabular-nums text-zinc-500">
            {answeredCount} / {questions.length}
          </span>
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="ml-auto rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-zinc-200"
          >
            답안지
          </button>
          <Link
            href="/mock"
            aria-label="시험에서 나가기"
            className="-m-2 shrink-0 p-2 text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </Link>
        </div>
        <ProgressBar
          className="mt-2"
          value={answeredCount}
          max={questions.length}
          color={subjectInk(q.subject)}
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span
            className="text-[12px] font-semibold"
            style={{ color: subjectInk(q.subject) }}
          >
            {SUBJECT_MAP[q.subject].name}
          </span>
          <button
            type="button"
            onClick={() =>
              setFlagged((f) =>
                f.includes(at) ? f.filter((x) => x !== at) : [...f, at],
              )
            }
            className={cn(
              "-m-2 flex items-center gap-1 p-2 text-[12px]",
              flagged.includes(at) ? "text-amber-300" : "text-zinc-500",
            )}
          >
            <Flag size={13} />
            {flagged.includes(at) ? "표시함" : "나중에"}
          </button>
        </div>

        <WrittenQuestionCard
          q={q}
          index={at}
          total={questions.length}
          picked={answers[at] ?? null}
          onPick={(i) => setAnswers((a) => ({ ...a, [at]: i }))}
          revealed={false}
          showSubject={false}
        />
      </div>

      <p className="mt-6 text-center text-[11px] text-zinc-600">
        답은 고를 때마다 저장됩니다. 나갔다 와도 이어서 볼 수 있습니다.
      </p>

      <div className="mt-3 flex items-center gap-2">
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
            <p className="mt-1 text-[11px] text-zinc-500">
              칠한 것은 답한 문항, 테두리는 나중에 표시한 문항입니다.
            </p>

            {SUBJECTS.map((s) => {
              const idxs = questions
                .map((qq, i) => ({ qq, i }))
                .filter(({ qq }) => qq.subject === s.id)
                .map(({ i }) => i);
              if (idxs.length === 0) return null;
              return (
                <div key={s.id} className="mt-4">
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: subjectInk(s.id) }}
                  >
                    {s.symbol} {s.short}{" "}
                    <span className="text-zinc-500">
                      {idxs.filter((i) => answers[i] !== undefined).length}/
                      {idxs.length}
                    </span>
                  </p>
                  <div className="mt-2 grid grid-cols-10 gap-1">
                    {idxs.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAt(i);
                          setSheet(false);
                        }}
                        className={cn(
                          "flex h-7 items-center justify-center rounded-lg border text-[11px] font-bold tabular-nums",
                          answers[i] !== undefined
                            ? "border-transparent bg-indigo-500/30 text-indigo-100"
                            : "border-white/10 bg-white/5 text-zinc-500",
                          flagged.includes(i) && "border-amber-400/60",
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

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
              {questions.length - answeredCount > 0
                ? `아직 ${questions.length - answeredCount}문항이 비어 있습니다. 빈 문항은 틀린 것으로 칩니다.`
                : "모든 문항에 답했습니다."}
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
