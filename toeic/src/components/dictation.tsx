"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Eye,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import type { ListeningSet, Speaker } from "@/lib/types";
import {
  assignVoices,
  letterOf,
  loadVoices,
  speak,
  stop,
  supported,
} from "@/lib/tts";
import { gradeDictation, type DictationResult } from "@/lib/dictation";
import { cn } from "@/lib/utils";

interface Sentence {
  key: string;
  /** 화면에 붙는 이름 — "문제", "(A)" 처럼 */
  label: string;
  text: string;
  speaker: Speaker;
}

/**
 * 한 지문에서 받아 적을 문장을 뽑는다.
 *
 * Part 2 는 질문 한 줄과 응답 셋이 전부고, Part 1 은 묘사 넷이 전부다.
 * 어느 쪽이든 한 문장이 짧아 통째로 받아 적을 수 있다 — 그래서 이 두
 * 파트에만 둔다.
 */
export function sentencesOf(set: ListeningSet): Sentence[] {
  const out: Sentence[] = [];
  (set.script ?? []).forEach((l, i) => {
    out.push({
      key: `${set.id}-s${i}`,
      label: set.script!.length > 1 ? `${i + 1}번째 문장` : "문제",
      text: l.text,
      speaker: l.speaker,
    });
  });
  set.questions.forEach((q) => {
    q.choices.forEach((c, i) => {
      out.push({
        key: `${q.id}-c${i}`,
        label: `(${letterOf(i)})`,
        text: c.text,
        speaker: set.part === 1 ? "narrator" : i % 2 === 0 ? "man" : "woman",
      });
    });
  });
  return out;
}

export function DictationDrill({ set, rate }: { set: ListeningSet; rate: number }) {
  const sentences = useMemo(() => sentencesOf(set), [set]);
  const [rawVoices, setRawVoices] = useState<SpeechSynthesisVoice[] | null>(null);
  const [noVoice, setNoVoice] = useState(false);
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<DictationResult | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
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
      else setRawVoices(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  // 지문이 바뀌면 처음부터
  useEffect(() => {
    abortRef.current?.abort();
    stop();
    setAt(0);
    setTyped("");
    setResult(null);
    setRevealed(false);
    setPlaying(false);
    setPlayed(false);
    setScores({});
    return () => {
      abortRef.current?.abort();
      stop();
    };
  }, [set.id]);

  /*
   * 지문마다 다른 발음 조합으로 들려준다.
   *
   * 목소리를 한 번 정해 두고 계속 쓰면 앱 전체가 같은 발음으로만 들린다.
   * 실제 시험은 문항마다 국적이 바뀐다. 지문 id 에서 뽑은 값으로 돌려 주면
   * 같은 지문은 늘 같게, 다른 지문은 다르게 들린다.
   */
  const rotate = useMemo(
    () => [...set.id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 97, 7),
    [set.id],
  );
  const voices = useMemo(
    () => (rawVoices ? assignVoices(rawVoices, rotate) : null),
    [rawVoices, rotate],
  );

  const current = sentences[Math.min(at, Math.max(0, sentences.length - 1))];

  const play = async () => {
    if (!voices || !current) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPlaying(true);
    setPlayed(true);
    stop();
    // 일부 기기는 cancel 직후의 speak 을 삼킨다
    await new Promise((r) => setTimeout(r, 60));
    await speak(current.text, {
      voice: voices[current.speaker],
      rate,
      signal: ctrl.signal,
    });
    if (!ctrl.signal.aborted) setPlaying(false);
  };

  const halt = () => {
    abortRef.current?.abort();
    stop();
    setPlaying(false);
  };

  const grade = () => {
    if (!current) return;
    const r = gradeDictation(current.text, typed);
    setResult(r);
    setScores((s) => ({ ...s, [current.key]: r.score }));
  };

  const next = () => {
    halt();
    setAt((i) => i + 1);
    setTyped("");
    setResult(null);
    setRevealed(false);
    setPlayed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!current) return null;

  const done = Object.keys(scores).length;
  const avg = done
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / done)
    : 0;

  return (
    <div className="mt-2">
      <Card className="border-violet-500/25 bg-violet-500/[0.07]">
        <p className="text-[12px] font-bold text-violet-200">받아쓰기</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
          들리는 문장을 그대로 받아 적습니다. 대소문자와 문장부호는 채점하지 않고,
          줄임말은 풀어 적어도(She&apos;s → She is) 맞는 것으로 봅니다.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
          선택지 문장을 그대로 적게 되므로, 먼저 문제로 풀어 본 뒤에 오시는 것이
          좋습니다.
        </p>
      </Card>

      <div className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sentences.map((s, i) => {
          const sc = scores[s.key];
          return (
            <span
              key={s.key}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                i === at
                  ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                  : sc === undefined
                    ? "border-white/10 bg-white/[0.03] text-zinc-500"
                    : sc === 100
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-300",
              )}
            >
              {s.label}
              {sc !== undefined && ` ${sc}`}
            </span>
          );
        })}
      </div>

      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-zinc-200">
            {current.label} · {at + 1} / {sentences.length}
          </p>
          {done > 0 && (
            <p className="text-[11px] text-zinc-500">평균 {avg}점</p>
          )}
        </div>

        {noVoice ? (
          <div className="mt-3 flex items-start gap-2.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-[12px] leading-relaxed text-zinc-400">
              이 기기에는 영어 음성이 없어 들려드릴 수 없습니다. 받아쓰기는 음성이 있는
              기기에서 해 주세요.
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
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
        )}

        <textarea
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          rows={3}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="들은 문장을 그대로 적어 보세요"
          aria-label="받아쓴 문장"
          className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-[15px] leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
        />

        <div className="mt-2 flex gap-2">
          <Button className="flex-1" onClick={grade} disabled={!typed.trim()}>
            <Check size={16} />
            채점하기
          </Button>
          {!result && (
            <Button
              variant="ghost"
              onClick={() => {
                setRevealed(true);
                setScores((s) => ({ ...s, [current.key]: 0 }));
              }}
            >
              <Eye size={15} />
              모르겠어요
            </Button>
          )}
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {(result || revealed) && (
          <motion.div
            key={result ? "graded" : "revealed"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="mt-3">
              {result ? (
                <>
                  <p
                    className={cn(
                      "text-[13px] font-bold",
                      result.perfect ? "text-emerald-300" : "text-amber-300",
                    )}
                  >
                    {result.perfect
                      ? "그대로 받아 적었습니다"
                      : `${result.total}낱말 중 ${result.correct}낱말`}
                  </p>
                  <p className="mt-2.5 flex flex-wrap gap-x-1.5 gap-y-1.5 text-[15px] leading-relaxed">
                    {result.tokens.map((tk, i) => (
                      <span
                        key={i}
                        className={cn(
                          "rounded-md px-1",
                          tk.state === "ok" && "text-zinc-200",
                          tk.state === "wrong" && "bg-rose-500/15 text-rose-200",
                          tk.state === "miss" &&
                            "bg-amber-500/15 text-amber-200 underline decoration-dotted",
                        )}
                      >
                        {tk.word}
                      </span>
                    ))}
                  </p>
                  {(result.tokens.some((tk) => tk.state !== "ok") ||
                    result.extra.length > 0) && (
                    <div className="mt-3 border-t border-white/[0.07] pt-3">
                      {result.tokens
                        .filter((tk) => tk.state === "wrong")
                        .map((tk, i) => (
                          <p key={`w${i}`} className="text-[12px] text-zinc-400">
                            <span className="text-rose-300">{tk.typed}</span> 로 적은 자리는{" "}
                            <span className="font-bold text-zinc-200">{tk.word}</span> 입니다.
                          </p>
                        ))}
                      {result.tokens.some((tk) => tk.state === "miss") && (
                        <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                          <span className="text-amber-300">
                            {result.tokens
                              .filter((tk) => tk.state === "miss")
                              .map((tk) => tk.word)
                              .join(", ")}
                          </span>{" "}
                          은 빠뜨렸습니다. 약하게 발음되는 전치사·관사·조동사가 여기
                          걸립니다.
                        </p>
                      )}
                      {result.extra.length > 0 && (
                        <p className="mt-1 text-[12px] text-zinc-400">
                          없는 낱말을 더 적었습니다 — {result.extra.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[13px] font-bold text-zinc-400">문장은 이렇습니다</p>
              )}
              <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-[15px] leading-relaxed text-zinc-100">
                {current.text}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {at < sentences.length - 1 && (result || revealed) && (
        <Button size="lg" className="mt-3 w-full" onClick={next}>
          다음 문장
          <ChevronRight size={17} />
        </Button>
      )}
    </div>
  );
}
