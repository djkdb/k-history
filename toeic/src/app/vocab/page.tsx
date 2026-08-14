"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Volume2,
} from "lucide-react";
import { Badge, Button, Card, Chip, EmptyState, ProgressBar } from "@/components/ui";
import { TOPIC_LABEL, vocabFor } from "@/data/vocab";
import { BAND_LABEL } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import type { Vocab, VocabTopic } from "@/lib/types";
import { assignVoices, loadVoices, speak, stop, supported } from "@/lib/tts";
import { cn } from "@/lib/utils";

type Filter = "all" | "todo" | "known" | VocabTopic;

export default function VocabPage() {
  return (
    <Suspense fallback={<main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>}>
      <VocabScreen />
    </Suspense>
  );
}

function VocabScreen() {
  const params = useSearchParams();
  const band = useBand();
  const known = useApp((s) => s.knownVocabIds);
  const markKnown = useApp((s) => s.markVocabKnown);
  const unmark = useApp((s) => s.unmarkVocabKnown);

  const all = useMemo(() => vocabFor(band), [band]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [at, setAt] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const list = useMemo(() => {
    let out = all;
    if (filter === "todo") out = out.filter((v) => !known.includes(v.id));
    else if (filter === "known") out = out.filter((v) => known.includes(v.id));
    else if (filter !== "all") out = out.filter((v) => v.topic === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (v) =>
          v.word.toLowerCase().includes(q) ||
          v.meaning.includes(q) ||
          v.example.toLowerCase().includes(q),
      );
    }
    return out;
  }, [all, filter, known, query]);

  // 복습에서 특정 단어로 건너뛰어 올 수 있다
  const wanted = params.get("word");
  useEffect(() => {
    if (!wanted) return;
    const i = list.findIndex((v) => v.id === wanted);
    if (i >= 0) setAt(i);
  }, [wanted, list]);

  useEffect(() => {
    setAt(0);
    setFlipped(false);
  }, [filter, query]);

  const current = list[Math.min(at, Math.max(0, list.length - 1))];
  const knownCount = all.filter((v) => known.includes(v.id)).length;

  const go = (d: number) => {
    stop();
    setFlipped(false);
    setAt((i) => Math.min(list.length - 1, Math.max(0, i + d)));
  };

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">어휘</h1>
        <p className="mt-1 text-[13px] text-zinc-400">
          {BAND_LABEL[band]} 기준 {all.length}개 · 외운 것 {knownCount}개
        </p>
        <ProgressBar value={knownCount} max={all.length} color="#6366f1" className="mt-3" />
      </header>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        <Search size={16} className="shrink-0 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="단어·뜻·예문 검색"
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-zinc-600"
        />
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          전체 {all.length}
        </Chip>
        <Chip active={filter === "todo"} onClick={() => setFilter("todo")}>
          안 외운 것 {all.length - knownCount}
        </Chip>
        <Chip active={filter === "known"} onClick={() => setFilter("known")}>
          외운 것 {knownCount}
        </Chip>
        {(Object.keys(TOPIC_LABEL) as VocabTopic[])
          .filter((t) => all.some((v) => v.topic === t))
          .map((t) => (
            <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>
              {TOPIC_LABEL[t]}
            </Chip>
          ))}
      </div>

      {list.length === 0 || !current ? (
        <EmptyState
          title="해당하는 단어가 없습니다"
          desc="검색어나 갈래를 바꿔 보세요."
        />
      ) : (
        <>
          <div className="mt-5 flex items-center justify-between text-[12px] text-zinc-500">
            <span>
              {at + 1} / {list.length}
            </span>
            <span>{TOPIC_LABEL[current.topic]}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              className="mt-2"
            >
              <VocabCard
                vocab={current}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                known={known.includes(current.id)}
                onToggleKnown={() =>
                  known.includes(current.id)
                    ? unmark(current.id)
                    : markKnown(current.id)
                }
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => go(-1)}
              disabled={at === 0}
            >
              <ChevronLeft size={16} />
              이전
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => go(1)}
              disabled={at >= list.length - 1}
            >
              다음
              <ChevronRight size={16} />
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

function VocabCard({
  vocab,
  flipped,
  onFlip,
  known,
  onToggleKnown,
}: {
  vocab: Vocab;
  flipped: boolean;
  onFlip: () => void;
  known: boolean;
  onToggleKnown: () => void;
}) {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [canSpeak, setCanSpeak] = useState(false);

  useEffect(() => {
    if (!supported()) return;
    let alive = true;
    loadVoices().then((v) => {
      if (!alive) return;
      voiceRef.current = assignVoices(v).narrator;
      setCanSpeak(v.length > 0);
    });
    return () => {
      alive = false;
      stop();
    };
  }, []);

  const say = (text: string) => {
    stop();
    speak(text, { voice: voiceRef.current, rate: 0.95 });
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold">{vocab.word}</h2>
            <span className="text-[13px] font-medium text-zinc-500">{vocab.pos}</span>
            {canSpeak && (
              <button
                onClick={() => say(vocab.word)}
                aria-label="발음 듣기"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-zinc-300 hover:bg-white/10"
              >
                <Volume2 size={15} />
              </button>
            )}
          </div>
        </div>
        <Badge>{vocab.band}</Badge>
      </div>

      {!flipped ? (
        <button
          onClick={onFlip}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-6 text-[13px] text-zinc-500 hover:bg-white/[0.03]"
        >
          <ArrowLeftRight size={15} />
          눌러서 뜻 보기
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <p className="text-[17px] font-bold text-indigo-200">{vocab.meaning}</p>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] leading-relaxed text-zinc-200">
                {vocab.example}
              </p>
              {canSpeak && (
                <button
                  onClick={() => say(vocab.example)}
                  aria-label="예문 듣기"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 text-zinc-400 hover:bg-white/10"
                >
                  <Volume2 size={13} />
                </button>
              )}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
              {vocab.exampleKo}
            </p>
          </div>

          {vocab.collocations && vocab.collocations.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-bold text-zinc-500">같이 붙어 다니는 말</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {vocab.collocations.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-zinc-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vocab.confusable && (
            <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/[0.07] p-3.5">
              <p className="text-[11px] font-bold text-rose-200">헷갈리는 짝</p>
              <p className="mt-1.5 text-[14px] font-bold text-zinc-100">
                {vocab.confusable.word}
                <span className="ml-2 text-[12px] font-medium text-zinc-400">
                  {vocab.confusable.meaning}
                </span>
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
                {vocab.confusable.difference}
              </p>
            </div>
          )}

          <Button
            variant={known ? "outline" : "primary"}
            className="mt-4 w-full"
            onClick={onToggleKnown}
          >
            <Check size={16} />
            {known ? "외운 것으로 표시됨 — 취소" : "외웠습니다 — 복습에 넣기"}
          </Button>
          <p className="mt-2 text-center text-[11px] text-zinc-600">
            넣어 두면 오늘 · 1일 · 3일 · 7일 · 14일 · 30일 간격으로 다시 물어봅니다
          </p>
        </motion.div>
      )}
    </Card>
  );
}
