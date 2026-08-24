"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ArrowLeftRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eye,
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

  /*
   * 낱말을 넘기는 것은 이 앱에서 가장 많이 하는 동작이다. 401개를 한 장씩
   * 보려면 단추를 400번 눌러야 한다. 손가락으로 밀어서도 넘어가게 둔다 —
   * 종이 단어장을 넘기듯이. (단추는 그대로 남겨 둔다. 미는 동작을 모르는
   * 사람도 있고, 마우스로 쓰는 사람도 있다.)
   */
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70) go(1);
    else if (info.offset.x > 70) go(-1);
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

      {/*
        카드만 넘기면 "다 아는 것 같은" 착각에 빠진다. 시험으로 건너가는
        길을 목록 맨 위에 둔다 — 찾아 들어가야 하는 기능은 안 쓰인다.
      */}
      <Link href="/vocab/test" className="mt-4 block">
        <Card className="border-indigo-500/30 bg-indigo-500/[0.08]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-200">
                <ClipboardCheck size={15} />
                어휘 시험 보기
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-400">
                뜻 고르기 · 단어 고르기 · 빈칸 채우기 — 떠오르는지 확인합니다.
              </p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-indigo-300" />
          </div>
        </Card>
      </Link>

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
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              className="mt-2 cursor-grab active:cursor-grabbing"
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

          <p className="mt-2 text-center text-[11px] text-zinc-600">
            좌우로 밀어서 넘길 수 있습니다
          </p>

          <div className="mt-2 flex items-center gap-2">
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
  const [peek, setPeek] = useState(false);

  // 낱말이 바뀌면 눌러 두었던 것이 남아 다음 낱말의 뜻을 보여 주면 안 된다
  useEffect(() => setPeek(false), [vocab.id]);

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
        <div className="mt-5">
          {/*
            꾹 눌러 보기.

            뜻을 아예 펼쳐 버리면 그 낱말은 그 회차에서 끝난다. 그런데
            대개 필요한 것은 "맞나 한 번만" 확인하는 것이다. 손을 대고
            있는 동안만 보여 주고 떼면 다시 가린다 — 종이 단어장을
            손가락으로 덮었다 살짝 들춰 보는 것과 같다.

            떼는 경우가 여럿이라 다 잡아야 한다. 손을 떼거나(up), 누른 채
            칸 밖으로 밀거나(leave), 전화가 와서 눌림이 취소되거나(cancel),
            창을 벗어나거나(blur). 하나라도 놓치면 뜻이 펼쳐진 채로 남는다.
          */}
          <button
            type="button"
            /*
              이 단추에서 시작한 누름은 카드로 넘기지 않는다.
              카드는 좌우로 밀어 넘길 수 있게 해 두었는데, 꾹 누른 채
              손가락이 조금만 떨려도 밀기로 잡혀 다음 낱말로 넘어가
              버린다. 여기서 끊어 준다.
            */
            onPointerDown={(e) => {
              e.stopPropagation();
              setPeek(true);
            }}
            onPointerUp={() => setPeek(false)}
            onPointerLeave={() => setPeek(false)}
            onPointerCancel={() => setPeek(false)}
            onBlur={() => setPeek(false)}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="꾹 눌러 뜻 보기"
            className={cn(
              "flex w-full select-none items-center justify-center gap-2 rounded-xl border py-6 text-[13px] transition-colors [-webkit-touch-callout:none] [touch-action:manipulation]",
              peek
                ? "border-indigo-400/50 bg-indigo-500/10"
                : "border-dashed border-white/15 text-zinc-500 hover:bg-white/[0.03]",
            )}
          >
            {peek ? (
              <span className="text-[17px] font-bold text-indigo-200">
                {vocab.meaning}
              </span>
            ) : (
              <>
                <Eye size={15} />
                꾹 누르면 잠깐 보입니다
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onFlip}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] text-zinc-500 hover:bg-white/[0.03]"
          >
            <ArrowLeftRight size={15} />
            펼쳐서 자세히 보기
          </button>
        </div>
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
