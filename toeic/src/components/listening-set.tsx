"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Eye,
  Gauge,
  ImageOff,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react";
import { Badge, Button, Card, Chip } from "@/components/ui";
import { SKILL_LABEL } from "@/data/reading";
import { PART1_ART } from "@/components/part1-art";
import { useApp } from "@/lib/store";
import { useSetAudio } from "@/lib/use-set-audio";
import type { ListeningSet, Speaker } from "@/lib/types";
import {
  assignVoices,
  letterOf,
  loadVoices,
  speakSequence,
  stop,
  supported,
} from "@/lib/tts";
import {
  NOISE_KINDS,
  NOISE_LABEL,
  NOISE_NOTE,
  noiseRunning,
  setNoiseLevel,
  startNoise,
  stopNoise,
  type NoiseKind,
} from "@/lib/noise";
import { cn } from "@/lib/utils";

export const SPEAKER_LABEL: Record<Speaker, string> = {
  man: "남자",
  woman: "여자",
  man2: "남자 2",
  woman2: "여자 2",
  narrator: "안내",
};

/**
 * 읽는 속도 조절.
 *
 * 듣기 화면이 여러 개(전체·파트별)로 갈라졌으므로 한 군데에 모아 둔다.
 * 값은 설정에 저장되니 어느 화면에서 올려 두든 그대로 따라온다.
 */
export function SpeechRateCard() {
  const rate = useApp((s) => s.settings?.speechRate ?? 1);
  const setSpeechRate = useApp((s) => s.setSpeechRate);

  return (
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
          className="h-8 w-full accent-indigo-500"
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
  );
}

/**
 * 소음 훈련 조절판.
 *
 * 실제 시험장은 조용하지 않다. 집에서 이어폰으로 또렷하게만 듣던 사람은
 * 그날 처음으로 "안 들리는 상태"를 겪는다. 미리 겪어 두게 한다.
 *
 * 소리는 브라우저에서 만들어 낸다 — 받아 오는 파일이 없다.
 */
export function NoiseCard() {
  const kind = useApp((s) => s.settings?.noise ?? "none");
  const level = useApp((s) => s.settings?.noiseLevel ?? 0.5);
  const setNoise = useApp((s) => s.setNoise);

  // 화면을 떠나면 소리를 끈다
  useEffect(() => () => stopNoise(), []);

  return (
    <Card className="mt-3">
      <div className="flex items-center gap-2">
        <Volume2 size={16} className="shrink-0 text-zinc-400" />
        <span className="text-[13px] font-bold">소음 속에서 듣기</span>
      </div>
      <div className="-mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NOISE_KINDS.map((k) => (
          <Chip
            key={k}
            active={kind === k}
            onClick={() => {
              setNoise(k, level);
              // 누른 그 순간에 켜야 한다 — 브라우저가 그 밖에서는 소리를 막는다
              if (k === "none") stopNoise();
              else startNoise(k as NoiseKind, level);
            }}
          >
            {NOISE_LABEL[k]}
          </Chip>
        ))}
      </div>
      {kind !== "none" && (
        <div className="mt-3 flex items-center gap-3">
          <span className="shrink-0 text-[12px] text-zinc-500">크기</span>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={level}
            onChange={(e) => {
              const v = Number(e.target.value);
              setNoise(kind, v);
              setNoiseLevel(v);
            }}
            className="h-8 w-full accent-indigo-500"
            aria-label="소음 크기"
          />
          <span className="w-9 shrink-0 text-right text-[12px] font-bold text-zinc-300">
            {Math.round(level * 100)}
          </span>
        </div>
      )}
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        {NOISE_NOTE[kind]}
      </p>
    </Card>
  );
}

/**
 * Part 1 의 그림.
 *
 * 그림이 있으면 한국어 장면 설명은 감춘다. 둘을 같이 주면 그림을 볼
 * 이유가 없어지고 — 설명이 답을 거의 다 알려 준다 — 실제 시험과 다른
 * 일을 하게 된다. 설명은 눈으로 보기 어려운 사람을 위해 접어 두고,
 * 화면 낭독기에는 alt 로 그대로 읽힌다.
 */
function SceneView({ set }: { set: ListeningSet }) {
  const art = PART1_ART[set.id];
  const [showText, setShowText] = useState(false);

  if (!art) {
    return (
      <Card className="border-sky-500/25 bg-sky-500/[0.07]">
        <div className="flex items-start gap-2.5">
          <ImageOff size={16} className="mt-0.5 shrink-0 text-sky-300" />
          <div>
            <p className="text-[12px] font-bold text-sky-200">사진 대신 장면 설명입니다</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-200">{set.scene}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <figure
        className="overflow-hidden rounded-2xl border border-white/10"
        aria-label={set.scene}
        role="img"
      >
        {art}
      </figure>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11px] text-zinc-500">사진 대신 그린 그림입니다</p>
        <button
          type="button"
          onClick={() => setShowText((v) => !v)}
          className="-my-1.5 shrink-0 py-1.5 text-[11px] text-zinc-500 underline decoration-dotted hover:text-zinc-300"
        >
          {showText ? "설명 접기" : "글로 된 설명"}
        </button>
      </div>
      {showText && (
        <p className="mt-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] leading-relaxed text-zinc-300">
          {set.scene}
        </p>
      )}
    </div>
  );
}

export function ListeningSetView({ set, rate }: { set: ListeningSet; rate: number }) {
  const record = useApp((s) => s.recordAnswer);
  const noiseKind = useApp((s) => s.settings?.noise ?? "none");
  const noiseLevel = useApp((s) => s.settings?.noiseLevel ?? 0.5);
  const showScriptDefault = useApp((s) => s.settings?.showScript ?? false);

  // 읽어 주는 일은 선구독 훈련과 똑같아서 한 곳(useSetAudio)에 모아 두었다
  const { noVoice, playing, line, played, play, halt, ready } = useSetAudio(set, rate);
  const [showScript, setShowScript] = useState(showScriptDefault);
  const [picked, setPicked] = useState<Record<string, number>>({});

  // 지문이 바뀌면 처음 상태로 (하던 재생을 끊는 것은 훅이 한다)
  useEffect(() => {
    setShowScript(showScriptDefault);
    setPicked({});
  }, [set.id, showScriptDefault]);

  const choose = (qid: string, i: number, answer: number) => {
    if (picked[qid] !== undefined) return;
    setPicked((p) => ({ ...p, [qid]: i }));
    record(qid, i === answer);
  };

  const audioOnly = set.questions.some((q) => q.audioOnlyChoices);
  const allAnswered = set.questions.every((q) => picked[q.id] !== undefined);

  return (
    <div className="mt-2">
      {set.scene && <SceneView set={set} />}

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
                <Button className="flex-1" onClick={play} disabled={!ready}>
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
            {!ready && !noVoice && (
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
