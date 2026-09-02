"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Eye, EyeOff, Headphones, Timer, X } from "lucide-react";
import type { ListeningSet } from "@/lib/types";
import { Button, Card } from "@/components/ui";
import { useApp } from "@/lib/store";
import { useSetAudio } from "@/lib/use-set-audio";
import { cn } from "@/lib/utils";

/**
 * 선구독 훈련 — 문제를 먼저 읽고, 가린 채로 듣는다.
 *
 * Part 3·4 는 대화가 흘러가는 순서대로 답이 나온다. 그래서 들으면서 문제를
 * 읽으면 이미 늦는다. 시험장에서는 문항을 읽어 주는 사이의 짧은 짬에 다음
 * 지문의 문항을 미리 읽어 둔다 — 이것을 선구독이라 부른다.
 *
 * 문제가 늘 보이는 연습으로는 이 감각이 생기지 않는다. 여기서는 실제와
 * 같은 순서로 돌린다.
 *
 *   ① 미리 읽기  문항만 잠깐 보여 준다 (다 읽으면 누른다)
 *   ② 듣기       문항을 가리고 한 번만 들려준다
 *   ③ 풀이       다시 보여 주고 답을 고른다
 *
 * 목표 시간 8초는 이 앱이 정한 훈련 기준이다. 시험장에서 확보되는 짬은
 * 지문 길이와 읽어 주는 속도에 따라 달라진다.
 */
const TARGET_MS = 8000;

type Phase = "ready" | "reading" | "listening" | "answering" | "done";

const LETTERS = ["A", "B", "C", "D"] as const;

export function PreviewDrill({ set, rate }: { set: ListeningSet; rate: number }) {
  const record = useApp((s) => s.recordAnswer);
  const recordPreview = useApp((s) => s.recordPreview);
  const runs = useApp((s) => s.previewRuns);

  const { noVoice, playing, play, halt, ready } = useSetAudio(set, rate);
  const [phase, setPhase] = useState<Phase>("ready");
  const [left, setLeft] = useState(TARGET_MS);
  const [took, setTook] = useState<number | null>(null);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const startedRef = useRef(0);

  // 지문이 바뀌면 처음부터
  useEffect(() => {
    setPhase("ready");
    setLeft(TARGET_MS);
    setTook(null);
    setPicked({});
  }, [set.id]);

  // 미리 읽기 시계
  useEffect(() => {
    if (phase !== "reading") return;
    const t = setInterval(() => {
      const rest = TARGET_MS - (Date.now() - startedRef.current);
      setLeft(Math.max(0, rest));
    }, 100);
    return () => clearInterval(t);
  }, [phase]);

  const toListening = useCallback(
    (ms: number) => {
      setTook(ms);
      recordPreview(ms);
      setPhase("listening");
    },
    [recordPreview],
  );

  // 시간이 다 되면 그대로 넘어간다 — 시험장에서는 기다려 주지 않는다
  useEffect(() => {
    if (phase === "reading" && left <= 0) toListening(TARGET_MS);
  }, [left, phase, toListening]);

  // 듣기가 끝나면 풀이로
  const wasPlaying = useRef(false);
  useEffect(() => {
    if (playing) wasPlaying.current = true;
    else if (wasPlaying.current && phase === "listening") {
      wasPlaying.current = false;
      setPhase("answering");
    }
  }, [playing, phase]);

  const startReading = () => {
    startedRef.current = Date.now();
    setLeft(TARGET_MS);
    setPhase("reading");
  };

  const choose = (qid: string, i: number, answer: number) => {
    if (picked[qid] !== undefined) return;
    setPicked((p) => ({ ...p, [qid]: i }));
    record(qid, i === answer);
  };

  const allAnswered = set.questions.every((q) => picked[q.id] !== undefined);
  const correct = set.questions.filter((q) => picked[q.id] === q.answer).length;
  const avg = runs.length ? runs.reduce((a, b) => a + b, 0) / runs.length : null;

  if (noVoice) {
    return (
      <Card className="mt-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <p className="text-[13px] font-bold text-amber-200">
              이 기기에는 영어 음성이 없습니다
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
              선구독 훈련은 듣기가 있어야 뜻이 있습니다. 문제 풀기로 바꾸면 스크립트를
              읽으며 풀 수 있습니다.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="mt-3">
      {/* ── 어느 단계인지 ── */}
      <div className="flex items-center gap-1.5">
        {(["reading", "listening", "answering"] as const).map((p, i) => {
          const order: Phase[] = ["ready", "reading", "listening", "answering", "done"];
          const now = order.indexOf(phase);
          const mine = order.indexOf(p);
          return (
            <div key={p} className="flex flex-1 items-center gap-1.5">
              <div
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  now > mine ? "bg-indigo-400" : now === mine ? "bg-indigo-500" : "bg-white/10",
                )}
              />
              <span
                className={cn(
                  "shrink-0 text-[10px] font-bold",
                  now === mine ? "text-indigo-200" : "text-zinc-600",
                )}
              >
                {["미리 읽기", "듣기", "풀이"][i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 시작 ── */}
      {phase === "ready" && (
        <Card className="mt-3">
          <p className="text-[13px] font-bold">문제를 먼저 읽습니다</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
            {set.questions.length}개 문항을 {TARGET_MS / 1000}초 안에 훑고, 그다음 문제를 가린
            채로 한 번 듣습니다. 다 읽었으면 기다리지 말고 누르세요 — 걸린 시간을 재
            둡니다.
          </p>
          {avg !== null && (
            <p className="mt-2 text-[12px] text-zinc-500">
              {`지금까지 ${runs.length}번 · 평균 ${(avg / 1000).toFixed(1)}초`}
            </p>
          )}
          <Button size="lg" className="mt-4 w-full" onClick={startReading} disabled={!ready}>
            <Eye size={16} />
            시작하기
          </Button>
          {!ready && (
            <p className="mt-2 text-center text-[11px] text-zinc-500">음성을 준비하는 중…</p>
          )}
        </Card>
      )}

      {/* ── 미리 읽기 ── */}
      {phase === "reading" && (
        <>
          <Card className="mt-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-200">
                <Timer size={13} />
                미리 읽기
              </span>
              <span
                className={cn(
                  "text-[20px] font-black tabular-nums",
                  left < 2500 ? "text-rose-300" : "text-indigo-200",
                )}
              >
                {(left / 1000).toFixed(1)}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-500 transition-[width] duration-100"
                style={{ width: `${(left / TARGET_MS) * 100}%` }}
              />
            </div>
          </Card>
          <QuestionList set={set} dim />
          <Button
            size="lg"
            className="mt-3 w-full"
            onClick={() => toListening(Date.now() - startedRef.current)}
          >
            <Check size={16} />
            다 읽었어요
          </Button>
        </>
      )}

      {/* ── 듣기 ── */}
      {phase === "listening" && (
        <Card className="mt-3">
          <div className="flex items-center gap-2.5">
            <EyeOff size={16} className="shrink-0 text-zinc-400" />
            <p className="flex-1 text-[12px] leading-relaxed text-zinc-400">
              지금은 문제가 보이지 않습니다. 시험장에서 음성이 나갈 때와 같습니다.
            </p>
          </div>
          {took !== null && (
            <p className="mt-2 text-[12px] text-zinc-500">
              {took >= TARGET_MS
                ? `미리 읽기 ${(TARGET_MS / 1000).toFixed(0)}초를 다 썼습니다`
                : `미리 읽는 데 ${(took / 1000).toFixed(1)}초 걸렸습니다`}
            </p>
          )}
          {!playing ? (
            <Button size="lg" className="mt-4 w-full" onClick={play}>
              <Headphones size={16} />
              듣기
            </Button>
          ) : (
            <Button variant="outline" size="lg" className="mt-4 w-full" onClick={halt}>
              멈추기
            </Button>
          )}
        </Card>
      )}

      {/* ── 풀이 ── */}
      {(phase === "answering" || phase === "done") && (
        <>
          {took !== null && (
            <Card className="mt-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-bold text-zinc-300">미리 읽기</span>
                <span
                  className={cn(
                    "text-[13px] font-bold tabular-nums",
                    took <= TARGET_MS ? "text-emerald-300" : "text-amber-300",
                  )}
                >
                  {took >= TARGET_MS
                    ? `${(TARGET_MS / 1000).toFixed(0)}초를 다 씀`
                    : `${(took / 1000).toFixed(1)}초`}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
                {took >= TARGET_MS
                  ? "다 읽지 못한 채로 넘어갔습니다. 문항의 앞 서너 낱말만 봐도 무엇을 묻는지는 잡힙니다."
                  : `목표 ${TARGET_MS / 1000}초 안에 읽었습니다.`}
                {avg !== null && ` 평균 ${(avg / 1000).toFixed(1)}초 (${runs.length}번).`}
              </p>
            </Card>
          )}
          <QuestionList
            set={set}
            picked={picked}
            onPick={choose}
            showResult={allAnswered}
          />
          {allAnswered && (
            <Card className="mt-3">
              <p className="text-[13px] font-bold">
                {`${set.questions.length}문항 중 ${correct}문항 맞혔습니다`}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
                다음 지문에서도 같은 순서로 해 보세요. 미리 읽는 시간이 줄어드는 것이
                Part 3·4 점수로 그대로 옵니다.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function QuestionList({
  set,
  dim,
  picked,
  onPick,
  showResult,
}: {
  set: ListeningSet;
  /** 미리 읽기 단계 — 선택지는 흐리게 두어 문항에 눈이 가게 한다 */
  dim?: boolean;
  picked?: Record<string, number>;
  onPick?: (qid: string, i: number, answer: number) => void;
  showResult?: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2.5">
      {set.questions.map((q, qi) => (
        <Card key={q.id}>
          <p className="text-[14px] font-bold leading-relaxed">
            {qi + 1}. {q.prompt}
          </p>
          <div className={cn("mt-2 flex flex-col gap-1.5", dim && "opacity-55")}>
            {q.choices.map((c, i) => {
              const mine = picked?.[q.id];
              const isAnswer = i === q.answer;
              const chosen = mine === i;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!onPick || mine !== undefined}
                  onClick={() => onPick?.(q.id, i, q.answer)}
                  className={cn(
                    "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] transition-colors",
                    mine === undefined
                      ? "border-white/10 bg-white/[0.03]"
                      : isAnswer
                        ? "border-emerald-400/50 bg-emerald-500/10"
                        : chosen
                          ? "border-rose-400/50 bg-rose-500/10"
                          : "border-white/10 bg-white/[0.03] opacity-60",
                  )}
                >
                  <span className="shrink-0 font-bold text-zinc-400">{LETTERS[i]}</span>
                  <span className="min-w-0 flex-1">{c.text}</span>
                  {mine !== undefined && isAnswer && (
                    <Check size={14} className="mt-0.5 shrink-0 text-emerald-300" />
                  )}
                  {mine !== undefined && chosen && !isAnswer && (
                    <X size={14} className="mt-0.5 shrink-0 text-rose-300" />
                  )}
                </button>
              );
            })}
          </div>
          {showResult && picked?.[q.id] !== undefined && (
            <AnimatePresence>
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-[12px] leading-relaxed text-zinc-400"
              >
                {q.choices[picked[q.id]]?.why ?? q.choices[q.answer]?.why}
              </motion.p>
            </AnimatePresence>
          )}
        </Card>
      ))}
    </div>
  );
}
