"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button, Chip, EmptyState } from "@/components/ui";
import { ListeningSetView, SpeechRateCard } from "@/components/listening-set";
import { listeningFor } from "@/data/listening";
import { LISTENING_PARTS, PART_MAP } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import { stop } from "@/lib/tts";

/**
 * 듣기 훈련 — 전체.
 *
 * 파트를 가리지 않고 섞어 듣는 화면이다. 한 파트만 파고들 때는
 * /part/1~4 로 간다 (거기에는 Part 1·2 받아쓰기가 붙어 있다).
 * 실제 시험은 파트가 예고 없이 넘어가므로, 섞어 듣는 연습도 따로 필요하다.
 */
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
  const rate = useApp((s) => s.settings?.speechRate ?? 1);

  const sets = useMemo(() => listeningFor(band), [band]);
  const [at, setAt] = useState(0);

  // 복습에서 특정 지문으로 건너뛰어 올 수 있다
  const wanted = params.get("set");
  useEffect(() => {
    if (!wanted) return;
    const i = sets.findIndex((s) => s.id === wanted);
    if (i >= 0) setAt(i);
  }, [wanted, sets]);

  useEffect(() => () => stop(), []);

  const current = sets[Math.min(at, Math.max(0, sets.length - 1))];

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
        <Chip active>전체 {sets.length}</Chip>
        {LISTENING_PARTS.map((p) => {
          const n = listeningFor(band, p.id as 1 | 2 | 3 | 4).length;
          if (!n) return null;
          return (
            <Link key={p.id} href={`/part/${p.id}`}>
              <Chip>
                Part {p.id} · {PART_MAP[p.id].name} {n}
              </Chip>
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        파트를 고르면 그 파트만 이어서 훈련합니다. Part 1·2 에는 받아쓰기가 붙어 있습니다.
      </p>

      <SpeechRateCard />

      {!current ? (
        <EmptyState title="문항이 없습니다" desc="목표 점수대를 올리면 더 나올 수 있습니다." />
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
