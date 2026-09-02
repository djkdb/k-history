"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListeningSet, Speaker } from "@/lib/types";
import { assignVoices, loadVoices, speakSequence, stop, supported } from "@/lib/tts";
import { noiseRunning, startNoise } from "@/lib/noise";
import { useApp } from "@/lib/store";

const LETTERS = ["A", "B", "C", "D"] as const;
const letterOf = (i: number) => LETTERS[i] ?? String(i + 1);

/**
 * 지문 하나를 읽어 주는 장치.
 *
 * 듣기 훈련 화면과 선구독 훈련이 같은 것을 쓴다. 목소리 고르기·소음 깔기·
 * 중간에 끊기는 브라우저마다 버릇이 달라 손이 많이 가는 자리다. 두 벌로
 * 두면 다음에 고칠 때 한 쪽만 고치게 된다.
 */
export function useSetAudio(set: ListeningSet, rate: number) {
  const noiseKind = useApp((s) => s.settings?.noise ?? "none");
  const noiseLevel = useApp((s) => s.settings?.noiseLevel ?? 0.5);

  const [rawVoices, setRawVoices] = useState<SpeechSynthesisVoice[] | null>(null);
  const [noVoice, setNoVoice] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const [played, setPlayed] = useState(false);
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

  /*
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
    for (const l of set.script ?? []) {
      out.push({ text: l.text, voice: voices[l.speaker as Speaker] });
    }
    if (set.questions.some((q) => q.audioOnlyChoices)) {
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

  const play = useCallback(async () => {
    if (!voices) return;
    // 소음을 골라 두었으면 듣기 시작과 함께 깔아 준다
    if (noiseKind !== "none" && noiseRunning() === "none") startNoise(noiseKind, noiseLevel);
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
  }, [buildLines, noiseKind, noiseLevel, rate, voices]);

  const halt = useCallback(() => {
    abortRef.current?.abort();
    stop();
    setPlaying(false);
    setLine(-1);
  }, []);

  // 지문이 바뀌면 앞의 말을 반드시 끊는다
  useEffect(() => {
    setPlayed(false);
    setLine(-1);
    return () => {
      abortRef.current?.abort();
      stop();
    };
  }, [set.id]);

  return { noVoice, playing, line, played, play, halt, ready: !!voices };
}
