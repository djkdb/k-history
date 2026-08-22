"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ImageOff,
  NotebookPen,
  Play,
  Square,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import {
  answerOf,
  buildExam,
  choicesOf,
  EXAM_MAP,
  promptOf,
  type Exam,
  type ExamId,
  type ExamItem,
} from "@/lib/exam";
import { scaledScore } from "@/data/parts";
import { SKILL_LABEL } from "@/data/reading";
import { PART1_ART } from "@/components/part1-art";
import { useApp, useBand } from "@/lib/store";
import type { MockAttempt, PartId, Speaker } from "@/lib/types";
import {
  assignVoices,
  letterOf,
  loadVoices,
  speakSequence,
  stop,
  supported,
} from "@/lib/tts";
import { cn, formatClock } from "@/lib/utils";
import {
  MOCK_FORMAT,
  clearProgress,
  readProgress,
  writeProgress,
} from "../progress";

export function MockSession() {
  /*
   * 이미 틀어 준 듣기 지문.
   *
   * 한 번만 재생 설정을 켜면 지문마다 한 번씩만 나간다. 문항을 앞뒤로
   * 오가도 유지되어야 뜻이 있으므로, 문항 화면이 아니라 시험 전체가
   * 들고 있는다.
   */
  const played = useRef<Set<string>>(new Set());
  const router = useRouter();
  const params = useSearchParams();
  const band = useBand();
  const record = useApp((s) => s.recordMockAttempt);

  const examId = (params.get("exam") ?? "rc") as ExamId;
  const resuming = params.get("resume") === "1";

  const [seed] = useState(() => {
    if (resuming) {
      const p = readProgress();
      if (p && p.examId === examId) return p.seed;
    }
    return Math.floor(Math.random() * 1_000_000) + 1;
  });

  const exam: Exam = useMemo(
    () => buildExam(examId, band, seed),
    [examId, band, seed],
  );

  const [startedAt] = useState(() => {
    if (resuming) {
      const p = readProgress();
      if (p && p.examId === examId) return p.startedAt;
    }
    return Date.now();
  });
  const [endsAt] = useState(() => {
    if (resuming) {
      const p = readProgress();
      if (p && p.examId === examId) return p.endsAt;
    }
    return Date.now() + exam.minutes * 60_000;
  });

  const [at, setAt] = useState(() => {
    if (resuming) {
      const p = readProgress();
      if (p && p.examId === examId) return Math.min(p.at, exam.items.length - 1);
    }
    return 0;
  });
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    if (resuming) {
      const p = readProgress();
      if (p && p.examId === examId) return p.answers;
    }
    return {};
  });

  const [left, setLeft] = useState(() => Math.max(0, endsAt - Date.now()));
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const submittedRef = useRef(false);

  const item = exam.items[at];

  const submit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    stop();

    const byPartMap = new Map<PartId, { correct: number; total: number }>();
    let correct = 0;
    const wrongIds: string[] = [];
    const lc = { correct: 0, total: 0 };
    const rc = { correct: 0, total: 0 };

    exam.items.forEach((it, i) => {
      const ok = answers[i] === answerOf(it);
      if (ok) correct++;
      else wrongIds.push(it.questionId);
      const acc = byPartMap.get(it.part) ?? { correct: 0, total: 0 };
      acc.total++;
      if (ok) acc.correct++;
      byPartMap.set(it.part, acc);
      const bucket = it.section === "listening" ? lc : rc;
      bucket.total++;
      if (ok) bucket.correct++;
    });

    const scaledLC = lc.total ? scaledScore(lc.correct, lc.total) : 0;
    const scaledRC = rc.total ? scaledScore(rc.correct, rc.total) : 0;

    const attempt: MockAttempt = {
      examId,
      startedAt,
      finishedAt: Date.now(),
      answers,
      byPart: [...byPartMap.entries()]
        .map(([part, v]) => ({ part, ...v }))
        .sort((a, b) => a.part - b.part),
      correct,
      total: exam.items.length,
      scaled: { listening: scaledLC, reading: scaledRC, total: scaledLC + scaledRC },
      // 오답 노트가 나중에 이 시험지를 그대로 다시 펴 볼 수 있도록
      seed,
      qids: exam.items.map((it) => it.questionId),
      fmt: MOCK_FORMAT,
      wrongIds,
    };

    record(attempt, wrongIds);
    clearProgress();
    setSubmitted(true);
    window.scrollTo({ top: 0 });
  }, [answers, exam, examId, record, seed, startedAt]);

  // 남은 시간 — 끝나는 시각을 기준으로 세므로 앱을 닫아 두어도 흐른다
  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      const ms = Math.max(0, endsAt - Date.now());
      setLeft(ms);
      if (ms <= 0) submit();
    }, 500);
    return () => clearInterval(t);
  }, [endsAt, submit, submitted]);

  // 풀던 자리를 남긴다 — 앱을 닫았다 켜도 이어서 볼 수 있게
  useEffect(() => {
    if (submitted) return;
    writeProgress({ examId, band, seed, answers, at, endsAt, startedAt });
  }, [answers, at, band, endsAt, examId, seed, startedAt, submitted]);

  useEffect(() => () => stop(), []);

  if (exam.items.length === 0) {
    return (
      <main className="py-20 text-center">
        <p className="text-sm text-zinc-400">이 시험에 낼 문항이 없습니다.</p>
        <Link href="/mock">
          <Button variant="ghost" className="mt-4">
            돌아가기
          </Button>
        </Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <Result
        exam={exam}
        answers={answers}
        startedAt={startedAt}
        onLeave={() => router.replace("/mock")}
      />
    );
  }

  const answered = Object.keys(answers).length;
  const choices = choicesOf(item);
  const picked = answers[at];
  const urgent = left < 60_000;

  return (
    <main className="py-4">
      <div className="exam-bar sticky top-0 z-40 -mx-4 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock size={15} className={urgent ? "text-rose-400" : "text-zinc-400"} />
          <span
            className={cn(
              "text-[15px] font-bold tabular-nums",
              urgent ? "text-rose-300" : "text-zinc-200",
            )}
          >
            {formatClock(left)}
          </span>
        </div>
        <span className="text-[12px] text-zinc-400">
          {answered} / {exam.items.length} 답함
        </span>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
          제출
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[12px] text-zinc-500">
        <span className="font-bold text-zinc-300">
          {at + 1}번 · Part {item.part}
        </span>
        <span>{EXAM_MAP[examId].name}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={at}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.15 }}
        >
          {item.section === "listening" ? (
            <ListeningItem item={item} playedRef={played} />
          ) : (
            <ReadingItem item={item} answers={answers} exam={exam} />
          )}

          <div className="mt-3 flex flex-col gap-2">
            {choices.map((c, i) => (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [at]: i }))}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left text-[14px] transition-all",
                  picked === i
                    ? "border-indigo-400/60 bg-indigo-500/15"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                    picked === i ? "bg-indigo-500 text-white" : "bg-white/10",
                  )}
                >
                  {letterOf(i)}
                </span>
                <span className="min-w-0 flex-1">
                  {/* 실제 시험에서 Part 1·2 는 선택지가 시험지에 없다 */}
                  {isAudioOnly(item) ? (
                    <span className="text-zinc-400">들은 것 중 {letterOf(i)}</span>
                  ) : (
                    c.text
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => setAt((i) => Math.max(0, i - 1))}
          disabled={at === 0}
        >
          <ChevronLeft size={16} />
          이전
        </Button>
        {at < exam.items.length - 1 ? (
          <Button className="flex-1" onClick={() => setAt((i) => i + 1)}>
            다음
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setConfirming(true)}>
            제출하기
          </Button>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-[12px] text-zinc-500">문항 이동</p>
        <div className="grid grid-cols-8 gap-1.5">
          {exam.items.map((_, i) => (
            <button
              key={i}
              onClick={() => setAt(i)}
              className={cn(
                "aspect-square rounded-lg text-[11px] font-bold transition-colors",
                i === at
                  ? "bg-indigo-500 text-white"
                  : answers[i] !== undefined
                    ? "bg-white/15 text-zinc-200"
                    : "bg-white/5 text-zinc-600",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-6">
          <Card className="w-full max-w-sm">
            <p className="text-[16px] font-bold">제출할까요?</p>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
              {exam.items.length}문항 중 {answered}문항에 답했습니다.
              {answered < exam.items.length &&
                ` 답하지 않은 ${exam.items.length - answered}문항은 오답으로 처리됩니다.`}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setConfirming(false)}
              >
                더 풀기
              </Button>
              <Button className="flex-1" onClick={submit}>
                제출하기
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

function isAudioOnly(item: ExamItem): boolean {
  return Boolean(item.listening?.questions[item.indexInSet].audioOnlyChoices);
}

/**
 * 듣기 문항.
 *
 * 한 지문에 문항이 여럿 붙으므로, 지문이 같으면 다시 재생하지 않는다.
 * 실제 시험은 한 번만 들려주지만 여기서는 다시 들을 수 있게 둔다 — 훈련이
 * 목적이고, 못 들었을 때 아무것도 못 하는 것이 학습에 도움이 되지 않는다.
 */
function ListeningItem({
  item,
  playedRef,
}: {
  item: ExamItem;
  playedRef: React.MutableRefObject<Set<string>>;
}) {
  const rate = useApp((s) => s.settings?.speechRate ?? 1);
  const set = item.listening!;
  const [voices, setVoices] = useState<Record<Speaker, SpeechSynthesisVoice | null> | null>(
    null,
  );
  const [noVoice, setNoVoice] = useState(false);
  const [playing, setPlaying] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /*
   * 실전처럼 — 한 번만 재생.
   *
   * 실제 시험은 음성이 한 번 나가면 끝이다. 되돌릴 수 없다는 것이
   * 듣기를 어렵게 만드는 큰 부분인데, 여기서는 몇 번이고 다시 들을 수
   * 있어서 실제보다 쉬웠다. 켜 두면 지문마다 한 번만 틀어 준다.
   *
   * 이미 들은 지문은 화면을 오갔다 와도 다시 못 듣게 해야 뜻이 있다.
   * 그래서 componentned 상태가 아니라 시험 단위로 들고 다닌다.
   */
  const onePlay = useApp((st) => st.settings?.onePlay ?? false);
  const spent = playedRef.current.has(set.id);

  useEffect(() => {
    if (!supported()) {
      setNoVoice(true);
      return;
    }
    let alive = true;
    loadVoices().then((v) => {
      if (!alive) return;
      if (!v.length) setNoVoice(true);
      else setVoices(assignVoices(v));
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stop();
    };
  }, [set.id]);

  const play = async () => {
    if (!voices) return;
    if (onePlay && playedRef.current.has(set.id)) return;
    playedRef.current.add(set.id);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPlaying(true);
    const lines: { text: string; voice: SpeechSynthesisVoice | null }[] = [];
    for (const l of set.script ?? []) lines.push({ text: l.text, voice: voices[l.speaker] });
    if (set.questions.some((q) => q.audioOnlyChoices)) {
      for (const q of set.questions) {
        q.choices.forEach((c, i) =>
          lines.push({
            text: `${letterOf(i)}. ${c.text}`,
            voice: voices[set.part === 1 ? "narrator" : i % 2 === 0 ? "man" : "woman"],
          }),
        );
      }
    }
    await speakSequence(lines, { rate, gapMs: 400, signal: ctrl.signal });
    if (!ctrl.signal.aborted) setPlaying(false);
  };

  const halt = () => {
    abortRef.current?.abort();
    stop();
    setPlaying(false);
  };

  const q = set.questions[item.indexInSet];

  return (
    <div className="mt-2">
      {/* 시험 중에는 글 설명을 주지 않는다 — 실제 시험도 사진만 준다 */}
      {set.scene &&
        (PART1_ART[set.id] ? (
          <figure
            className="overflow-hidden rounded-2xl border border-white/10"
            aria-label={set.scene}
            role="img"
          >
            {PART1_ART[set.id]}
          </figure>
        ) : (
          <Card className="border-sky-500/25 bg-sky-500/[0.07]">
            <div className="flex items-start gap-2.5">
              <ImageOff size={15} className="mt-0.5 shrink-0 text-sky-300" />
              <p className="text-[14px] leading-relaxed text-zinc-200">{set.scene}</p>
            </div>
          </Card>
        ))}

      <Card className="mt-3">
        {noVoice ? (
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-[12px] leading-relaxed text-zinc-400">
              이 기기에는 영어 음성이 없습니다. 아래 스크립트를 읽고 푸세요.
            </p>
          </div>
        ) : onePlay && spent && !playing ? (
          <div className="flex items-center justify-center gap-2 py-2.5 text-[13px] text-zinc-500">
            <Square size={14} />
            이 지문은 이미 나갔습니다
          </div>
        ) : !playing ? (
          <Button className="w-full" onClick={play} disabled={!voices}>
            <Play size={16} />
            듣기
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={halt}>
            <Square size={15} />
            멈추기
          </Button>
        )}
      </Card>

      {noVoice && set.script && (
        <Card className="mt-3">
          <div className="flex flex-col gap-2 text-[14px] leading-relaxed text-zinc-200">
            {set.script.map((l, i) => (
              <p key={i}>{l.text}</p>
            ))}
          </div>
        </Card>
      )}

      {q.prompt && (
        <div className="mt-3 flex items-start justify-between gap-2">
          <p className="text-[15px] leading-relaxed text-zinc-100">{q.prompt}</p>
          <Badge>{SKILL_LABEL[q.skill] ?? q.skill}</Badge>
        </div>
      )}
      {!q.prompt && (
        <p className="mt-3 text-[15px] leading-relaxed text-zinc-100">
          들은 내용에 가장 알맞은 것을 고르세요
        </p>
      )}
    </div>
  );
}

function ReadingItem({
  item,
  answers,
  exam,
}: {
  item: ExamItem;
  answers: Record<number, number>;
  exam: Exam;
}) {
  const set = item.reading!;
  const q = set.questions[item.indexInSet];

  // Part 6 지문의 빈칸 — 이미 고른 것은 넣어서 보여 준다
  const filled = (n: number) => {
    const idx = exam.items.findIndex(
      (it) => it.setId === set.id && set.questions[it.indexInSet]?.blank === n,
    );
    if (idx < 0) return null;
    const picked = answers[idx];
    if (picked === undefined) return null;
    const target = set.questions[exam.items[idx].indexInSet];
    return target?.choices[picked]?.text ?? null;
  };

  return (
    <div className="mt-2">
      {set.passage?.map((p, i) => (
        <Card key={i} className="mt-3">
          {p.header && p.header.length > 0 && (
            <div className="mb-3 flex flex-col gap-1 border-b border-white/[0.07] pb-3">
              {p.header.map((h, j) => (
                <div key={j} className="flex gap-2 text-[12px]">
                  {h.label && (
                    <span className="w-16 shrink-0 font-bold text-zinc-500">{h.label}</span>
                  )}
                  <span className="text-zinc-300">{h.value}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-3 whitespace-pre-wrap text-[14.5px] leading-[1.9] text-zinc-200">
            {p.body.split(/\n{2,}/).map((para, j) => (
              <p key={j}>
                {para.split(/(\[\[\d+\]\])/).map((chunk, k) => {
                  const m = /^\[\[(\d+)\]\]$/.exec(chunk);
                  if (!m) return <span key={k}>{chunk}</span>;
                  const n = Number(m[1]);
                  const text = filled(n);
                  const isHere = q.blank === n;
                  return (
                    <span
                      key={k}
                      className={cn(
                        "mx-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[13px] font-bold",
                        isHere
                          ? "bg-indigo-500/30 text-indigo-50 ring-1 ring-indigo-400/60"
                          : text
                            ? "bg-indigo-500/15 text-indigo-100"
                            : "bg-white/10 text-zinc-400",
                      )}
                    >
                      {text ?? `___ ${n}`}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </Card>
      ))}

      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="text-[15px] leading-relaxed text-zinc-100">
          {q.blank !== undefined && (
            <span className="mr-1.5 rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[12px] font-bold text-indigo-200">
              빈칸 {q.blank}
            </span>
          )}
          {promptOf(item) ??
            (q.skill === "sentence"
              ? "이 자리에 들어갈 문장으로 가장 알맞은 것은?"
              : "빈칸에 들어갈 말로 가장 알맞은 것은?")}
        </p>
        <Badge>{SKILL_LABEL[q.skill] ?? q.skill}</Badge>
      </div>
    </div>
  );
}

function Result({
  exam,
  answers,
  startedAt,
  onLeave,
}: {
  exam: Exam;
  answers: Record<number, number>;
  startedAt: number;
  onLeave: () => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const stats = useMemo(() => {
    const byPart = new Map<PartId, { correct: number; total: number }>();
    const lc = { correct: 0, total: 0 };
    const rc = { correct: 0, total: 0 };
    let correct = 0;
    exam.items.forEach((it, i) => {
      const ok = answers[i] === answerOf(it);
      if (ok) correct++;
      const acc = byPart.get(it.part) ?? { correct: 0, total: 0 };
      acc.total++;
      if (ok) acc.correct++;
      byPart.set(it.part, acc);
      const bucket = it.section === "listening" ? lc : rc;
      bucket.total++;
      if (ok) bucket.correct++;
    });
    const sLC = lc.total ? scaledScore(lc.correct, lc.total) : 0;
    const sRC = rc.total ? scaledScore(rc.correct, rc.total) : 0;
    return {
      correct,
      byPart: [...byPart.entries()].sort((a, b) => a[0] - b[0]),
      lc,
      rc,
      sLC,
      sRC,
      total: sLC + sRC,
    };
  }, [exam, answers]);

  const wrong = exam.items
    .map((it, i) => ({ it, i }))
    .filter(({ it, i }) => answers[i] !== answerOf(it));

  const shown = showAll ? exam.items.map((it, i) => ({ it, i })) : wrong;

  return (
    <main className="py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <p className="text-[13px] font-bold text-zinc-400">환산 점수</p>
        <h1 className="mt-1 text-5xl font-bold text-indigo-200">{stats.total}</h1>
        <p className="mt-2 text-[13px] text-zinc-400">
          {stats.correct} / {exam.items.length}문항
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.lc.total > 0 && (
          <Card>
            <p className="text-[12px] text-zinc-500">듣기</p>
            <p className="mt-1 text-2xl font-bold">{stats.sLC}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {stats.lc.correct} / {stats.lc.total}
            </p>
          </Card>
        )}
        {stats.rc.total > 0 && (
          <Card>
            <p className="text-[12px] text-zinc-500">읽기</p>
            <p className="mt-1 text-2xl font-bold">{stats.sRC}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {stats.rc.correct} / {stats.rc.total}
            </p>
          </Card>
        )}
      </div>

      <h2 className="mb-3 mt-8 text-base font-bold">파트별</h2>
      <div className="flex flex-col gap-2">
        {stats.byPart.map(([part, v]) => {
          const pct = Math.round((v.correct / v.total) * 100);
          return (
            <Card key={part}>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold">Part {part}</span>
                <span
                  className={cn(
                    "text-[14px] font-bold",
                    pct >= 80
                      ? "text-emerald-300"
                      : pct >= 50
                        ? "text-amber-300"
                        : "text-rose-300",
                  )}
                >
                  {v.correct} / {v.total}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mb-3 mt-8 flex items-center justify-between">
        <h2 className="text-base font-bold">
          {showAll ? "전체 문항" : `틀린 문항 ${wrong.length}개`}
        </h2>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-xs text-zinc-400 hover:text-zinc-200"
        >
          {showAll ? "틀린 것만" : "전체 보기"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {shown.map(({ it, i }) => {
          const cs = choicesOf(it);
          const ans = answerOf(it);
          const mine = answers[i];
          return (
            <Card key={i}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-bold text-zinc-300">
                  {i + 1}번 · Part {it.part}
                </p>
                <Badge>{mine === ans ? "정답" : mine === undefined ? "무응답" : "오답"}</Badge>
              </div>
              {promptOf(it) && (
                <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-200">
                  {promptOf(it)}
                </p>
              )}
              {mine !== undefined && mine !== ans && (
                <p className="mt-2 text-[13px] leading-relaxed text-rose-200">
                  <span className="font-bold">내 답 {letterOf(mine)}</span> {cs[mine]?.text}
                  <span className="mt-0.5 block text-[12px] text-zinc-400">
                    {cs[mine]?.why}
                  </span>
                </p>
              )}
              <p className="mt-2 text-[13px] leading-relaxed text-emerald-200">
                <span className="font-bold">정답 {letterOf(ans)}</span> {cs[ans]?.text}
                <span className="mt-0.5 block text-[12px] text-zinc-400">{cs[ans]?.why}</span>
              </p>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-600">
        환산 점수는 공개된 점수 범위(각 5~495점)에 맞춘 어림값입니다. 실제 시험은
        회차마다 환산표가 달라 성적과 다를 수 있습니다.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {/* 오답 노트는 며칠 뒤에 더 필요하다 — 여기서 나가도 남아 있다 */}
        <Link href={`/mock/note?at=${startedAt}`}>
          <Button size="lg" className="w-full">
            <NotebookPen size={16} />
            오답 노트 ({exam.items.length - stats.correct}문항)
          </Button>
        </Link>
        <Link href="/review?only=wrong">
          <Button variant="ghost" className="w-full">
            틀린 것 복습하기
          </Button>
        </Link>
        <Button variant="ghost" className="w-full" onClick={onLeave}>
          모의고사 목록으로
        </Button>
      </div>
    </main>
  );
}
