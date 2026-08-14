"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  Gauge,
  ImageOff,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { Badge, Button, Card, Chip, EmptyState } from "@/components/ui";
import { listeningFor } from "@/data/listening";
import { SKILL_LABEL } from "@/data/reading";
import { PART_MAP } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import type { ListeningSet, Speaker } from "@/lib/types";
import {
  assignVoices,
  letterOf,
  loadVoices,
  speakSequence,
  stop,
  supported,
} from "@/lib/tts";
import { cn } from "@/lib/utils";

const SPEAKER_LABEL: Record<Speaker, string> = {
  man: "남자",
  woman: "여자",
  man2: "남자 2",
  woman2: "여자 2",
  narrator: "안내",
};

export default function ListenPage() {
  return (
    <Suspense fallback={<main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>}>
      <ListenScreen />
    </Suspense>
  );
}

function ListenScreen() {
  const params = useSearchParams();
  const band = useBand();
  const settings = useApp((s) => s.settings);
  const setSpeechRate = useApp((s) => s.setSpeechRate);

  const [part, setPart] = useState<1 | 2 | 3 | 4 | "all">("all");
  const sets = useMemo(
    () => (part === "all" ? listeningFor(band) : listeningFor(band, part)),
    [band, part],
  );
  const [at, setAt] = useState(0);

  // 복습에서 특정 지문으로 건너뛰어 올 수 있다
  const wanted = params.get("set");
  useEffect(() => {
    if (!wanted) return;
    const i = sets.findIndex((s) => s.id === wanted);
    if (i >= 0) setAt(i);
  }, [wanted, sets]);

  useEffect(() => setAt(0), [part]);
  useEffect(() => () => stop(), []);

  const current = sets[Math.min(at, Math.max(0, sets.length - 1))];
  const rate = settings?.speechRate ?? 1;

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">듣기 훈련</h1>
        <p className="mt-1 text-[13px] text-zinc-400">
          기기의 음성으로 들려줍니다. 실제 시험처럼 <b className="text-zinc-300">먼저 듣고</b> 고른 뒤에
          스크립트를 확인하세요.
        </p>
      </header>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={part === "all"} onClick={() => setPart("all")}>
          전체 {listeningFor(band).length}
        </Chip>
        {([1, 2, 3, 4] as const).map((p) => {
          const n = listeningFor(band, p).length;
          if (!n) return null;
          return (
            <Chip key={p} active={part === p} onClick={() => setPart(p)}>
              Part {p} · {PART_MAP[p].name} {n}
            </Chip>
          );
        })}
      </div>

      <Card className="mt-4">
        <div className="flex items-center gap-3">
          <Gauge size={16} className="shrink-0 text-zinc-400" />
          <span className="shrink-0 text-[13px] font-bold">읽는 속도</span>
          <input
            type="range"
            min={0.7}
            max={1.3}
            step={0.05}
            value={rate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className="h-1.5 w-full accent-indigo-500"
            aria-label="읽는 속도"
          />
          <span className="w-10 shrink-0 text-right text-[13px] font-bold text-zinc-300">
            {rate.toFixed(2)}×
          </span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">
          실제 시험은 1.00× 언저리입니다. 익숙해지면 1.1× 이상으로 올려 두고 듣는 것이
          시험장에서 여유를 만듭니다.
        </p>
      </Card>

      {!current ? (
        <EmptyState title="문항이 없습니다" desc="다른 파트를 골라 보세요." />
      ) : (
        <>
          <div className="mt-5 flex items-center justify-between text-[12px] text-zinc-500">
            <span>
              {at + 1} / {sets.length}
            </span>
            <span>
              Part {current.part} · {PART_MAP[current.part].name}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <ListeningSetView set={current} rate={rate} />
            </motion.div>
          </AnimatePresence>

          {at < sets.length - 1 && (
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={() => {
                stop();
                setAt((i) => i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              다음 지문
              <ChevronRight size={17} />
            </Button>
          )}
        </>
      )}
    </main>
  );
}

function ListeningSetView({ set, rate }: { set: ListeningSet; rate: number }) {
  const record = useApp((s) => s.recordAnswer);
  const showScriptDefault = useApp((s) => s.settings?.showScript ?? false);

  const [voices, setVoices] = useState<Record<Speaker, SpeechSynthesisVoice | null> | null>(
    null,
  );
  const [noVoice, setNoVoice] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const [played, setPlayed] = useState(false);
  const [showScript, setShowScript] = useState(showScriptDefault);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const abortRef = useRef<AbortController | null>(null);

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

  // 지문이 바뀌면 하던 재생을 끊고 처음 상태로 되돌린다
  useEffect(() => {
    abortRef.current?.abort();
    stop();
    setPlaying(false);
    setLine(-1);
    setPlayed(false);
    setShowScript(showScriptDefault);
    setPicked({});
    return () => {
      abortRef.current?.abort();
      stop();
    };
  }, [set.id, showScriptDefault]);

  /**
   * 무엇을 읽어 줄지 만든다.
   *
   * Part 1·2 는 선택지도 귀로만 듣는 것이 실제 시험이다. 그래서 지문 뒤에
   * (A)(B)(C)(D) 를 이어 읽는다. Part 3·4 는 선택지가 시험지에 있으므로
   * 대화·담화만 읽는다.
   */
  const buildLines = useCallback(() => {
    if (!voices) return [];
    const out: { text: string; voice: SpeechSynthesisVoice | null }[] = [];
    if (set.scene) {
      // 사진 대신 장면을 글로 주므로, 음성은 선택지부터 읽는다
    }
    for (const l of set.script ?? []) {
      out.push({ text: l.text, voice: voices[l.speaker] });
    }
    const audioOnly = set.questions.some((q) => q.audioOnlyChoices);
    if (audioOnly) {
      for (const q of set.questions) {
        q.choices.forEach((c, i) => {
          out.push({
            text: `${letterOf(i)}. ${c.text}`,
            voice: voices[set.part === 1 ? "narrator" : i % 2 === 0 ? "man" : "woman"],
          });
        });
      }
    }
    return out;
  }, [set, voices]);

  const play = async () => {
    if (!voices) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPlaying(true);
    setPlayed(true);
    await speakSequence(buildLines(), {
      rate,
      gapMs: 400,
      signal: ctrl.signal,
      onLine: setLine,
    });
    if (!ctrl.signal.aborted) {
      setPlaying(false);
      setLine(-1);
    }
  };

  const halt = () => {
    abortRef.current?.abort();
    stop();
    setPlaying(false);
    setLine(-1);
  };

  const choose = (qid: string, i: number, answer: number) => {
    if (picked[qid] !== undefined) return;
    setPicked((p) => ({ ...p, [qid]: i }));
    record(qid, i === answer);
  };

  const audioOnly = set.questions.some((q) => q.audioOnlyChoices);
  const allAnswered = set.questions.every((q) => picked[q.id] !== undefined);

  return (
    <div className="mt-2">
      {set.scene && (
        <Card className="border-sky-500/25 bg-sky-500/[0.07]">
          <div className="flex items-start gap-2.5">
            <ImageOff size={16} className="mt-0.5 shrink-0 text-sky-300" />
            <div>
              <p className="text-[12px] font-bold text-sky-200">
                사진 대신 장면 설명입니다
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-200">
                {set.scene}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                실제 시험은 사진을 봅니다. 이 앱은 사진을 실을 수 없어 글로 대신합니다.
                이 파트의 훈련 목표 — 들리는 명사에 낚이지 말고 동사와 태를 듣는 것 —
                는 그대로입니다.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-3">
        {noVoice ? (
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <p className="text-[13px] font-bold text-amber-200">
                이 기기에는 영어 음성이 없습니다
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                스크립트를 읽으며 풀 수 있습니다. 아래에서 펼쳐 보세요.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              {!playing ? (
                <Button className="flex-1" onClick={play} disabled={!voices}>
                  <Play size={16} />
                  {played ? "다시 듣기" : "듣기"}
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={halt}>
                  <Square size={15} />
                  멈추기
                </Button>
              )}
              {played && !playing && (
                <Button variant="ghost" onClick={play} aria-label="처음부터 다시">
                  <RotateCcw size={15} />
                </Button>
              )}
            </div>
            {!voices && !noVoice && (
              <p className="mt-2 text-center text-[11px] text-zinc-500">음성을 준비하는 중…</p>
            )}
            {audioOnly && (
              <p className="mt-2.5 text-[11px] leading-relaxed text-zinc-500">
                실제 시험에서 이 파트는 <b className="text-zinc-400">선택지도 시험지에 없습니다</b>.
                그래서 여기서도 (A)(B)(C){set.part === 1 ? "(D)" : ""} 를 소리로만 들려줍니다.
              </p>
            )}
          </>
        )}
      </Card>

      {playing && line >= 0 && (
        <p className="mt-2 text-center text-[11px] text-zinc-500">
          재생 중… {line + 1}번째 문장
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {set.questions.map((q, qi) => {
          const chosen = picked[q.id];
          const show = chosen !== undefined;
          const hideChoices = q.audioOnlyChoices && !played;
          return (
            <Card key={q.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] leading-relaxed text-zinc-100">
                  {q.prompt ?? `${qi + 1}번 — 들은 내용에 가장 알맞은 것을 고르세요`}
                </p>
                <Badge>{SKILL_LABEL[q.skill] ?? q.skill}</Badge>
              </div>

              {hideChoices ? (
                <p className="mt-3 rounded-xl border border-dashed border-white/15 py-5 text-center text-[13px] text-zinc-500">
                  먼저 들어 보세요
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {q.choices.map((c, i) => {
                    const isAnswer = i === q.answer;
                    const isChosen = chosen === i;
                    return (
                      <button
                        key={i}
                        onClick={() => choose(q.id, i, q.answer)}
                        disabled={show}
                        className={cn(
                          "flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition-all",
                          !show && "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                          show && isAnswer && "border-emerald-500/40 bg-emerald-500/10",
                          show && isChosen && !isAnswer && "border-rose-500/40 bg-rose-500/10",
                          show && !isAnswer && !isChosen && "border-white/[0.07] opacity-50",
                        )}
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
                          {letterOf(i)}
                        </span>
                        <span className="min-w-0 flex-1">
                          {/* 선택지를 귀로만 듣는 파트는 답을 고르기 전까지 글자를 감춘다 */}
                          {q.audioOnlyChoices && !show ? (
                            <span className="text-zinc-500">들은 것 중 {letterOf(i)}</span>
                          ) : (
                            c.text
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {show && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 border-t border-white/[0.07] pt-3"
                >
                  <p
                    className={cn(
                      "text-[13px] font-bold",
                      chosen === q.answer ? "text-emerald-300" : "text-rose-300",
                    )}
                  >
                    {chosen === q.answer ? "정답입니다" : "다시 들어 봅시다"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                    <span className="font-bold text-zinc-200">{letterOf(chosen)}</span>{" "}
                    {q.choices[chosen].why}
                  </p>
                  {chosen !== q.answer && (
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                      <span className="font-bold text-emerald-300">
                        {letterOf(q.answer)}
                      </span>{" "}
                      {q.choices[q.answer].why}
                    </p>
                  )}
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>

      {(set.script?.length ?? 0) > 0 && (
        <div className="mt-4">
          {!showScript ? (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowScript(true)}
              disabled={!allAnswered && !noVoice}
            >
              <Eye size={16} />
              {allAnswered || noVoice
                ? "스크립트 보기"
                : "다 풀고 나면 스크립트를 볼 수 있습니다"}
            </Button>
          ) : (
            <Card>
              <p className="text-[12px] font-bold text-zinc-400">스크립트</p>
              <div className="mt-2.5 flex flex-col gap-2.5">
                {set.script!.map((l, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="w-12 shrink-0 pt-0.5 text-[11px] font-bold text-zinc-500">
                      {SPEAKER_LABEL[l.speaker]}
                    </span>
                    <p
                      className={cn(
                        "flex-1 text-[14px] leading-relaxed",
                        playing && line === i ? "text-indigo-200" : "text-zinc-200",
                      )}
                    >
                      {l.text}
                    </p>
                  </div>
                ))}
              </div>
              {set.situation && (
                <p className="mt-3 border-t border-white/[0.07] pt-3 text-[12px] leading-relaxed text-zinc-500">
                  {set.situation}
                </p>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

