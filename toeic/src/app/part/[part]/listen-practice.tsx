"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronRight, Layers, PenLine } from "lucide-react";
import { Button, Card, Chip, EmptyState } from "@/components/ui";
import { DictationDrill } from "@/components/dictation";
import { ListeningSetView, NoiseCard, SpeechRateCard } from "@/components/listening-set";
import { listeningFor } from "@/data/listening";
import { LISTENING_PARTS, PART_MAP } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import { stop } from "@/lib/tts";
import { cn } from "@/lib/utils";

type ListenPartId = 1 | 2 | 3 | 4;
type Mode = "quiz" | "dictation";

/** 받아쓰기는 문장이 한 줄로 끝나는 파트에서만 훈련이 된다 */
const DICTATION_PARTS: ListenPartId[] = [1, 2];

export function ListenPractice({ part }: { part: ListenPartId }) {
  return (
    <Suspense
      fallback={<main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>}
    >
      <Screen part={part} />
    </Suspense>
  );
}

function Screen({ part }: { part: ListenPartId }) {
  const params = useSearchParams();
  const band = useBand();
  const rate = useApp((s) => s.settings?.speechRate ?? 1);
  const sets = useMemo(() => listeningFor(band, part), [band, part]);
  const [at, setAt] = useState(0);
  const [mode, setMode] = useState<Mode>("quiz");

  // 복습·검색에서 특정 지문으로 건너뛰어 올 수 있다
  const wanted = params.get("set");
  useEffect(() => {
    if (!wanted) return;
    const i = sets.findIndex((s) => s.id === wanted);
    if (i >= 0) setAt(i);
  }, [wanted, sets]);

  useEffect(() => setAt(0), [part, band]);
  useEffect(() => () => stop(), []);

  const info = PART_MAP[part];
  const current = sets[Math.min(at, Math.max(0, sets.length - 1))];
  const canDictate = DICTATION_PARTS.includes(part);

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">듣기 훈련</h1>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href="/listen">
            <Chip>
              <Layers size={13} className="mr-1 inline align-[-2px]" />
              전체
            </Chip>
          </Link>
          {LISTENING_PARTS.map((p) => (
            <Link key={p.id} href={`/part/${p.id}`}>
              <Chip active={p.id === part}>
                Part {p.id} · {p.name}
              </Chip>
            </Link>
          ))}
        </div>
      </header>

      <Card className="mt-4">
        <p className="text-[14px] leading-relaxed text-zinc-200">{info.summary}</p>
        <div className="mt-3 flex items-start gap-2.5 border-t border-white/[0.07] pt-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
          <p className="text-[12px] leading-relaxed text-zinc-400">{info.trap}</p>
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          실제 시험에서는 {info.count}문항이 나옵니다 · 여기에 {sets.length}지문
        </p>
      </Card>

      {canDictate && (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant={mode === "quiz" ? "primary" : "outline"}
            className="flex-1"
            onClick={() => {
              stop();
              setMode("quiz");
            }}
          >
            문제 풀기
          </Button>
          <Button
            size="sm"
            variant={mode === "dictation" ? "primary" : "outline"}
            className="flex-1"
            onClick={() => {
              stop();
              setMode("dictation");
            }}
          >
            <PenLine size={15} />
            받아쓰기
          </Button>
        </div>
      )}

      <SpeechRateCard />
      <NoiseCard />

      {!current ? (
        <EmptyState
          title="이 파트의 문항이 아직 없습니다"
          desc="목표 점수대를 올리면 더 나올 수 있습니다."
        />
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
              key={`${current.id}-${mode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {mode === "dictation" && canDictate ? (
                <DictationDrill set={current} rate={rate} />
              ) : (
                <ListeningSetView set={current} rate={rate} />
              )}
            </motion.div>
          </AnimatePresence>

          {at < sets.length - 1 && (
            <Button
              size="lg"
              className={cn("mt-4 w-full")}
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
