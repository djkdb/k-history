"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, Pause, Play, SkipForward } from "lucide-react";
import { next, toggle, usePlayer } from "@/lib/listen-player";

/** 듣기를 켜 둔 채 다른 화면으로 가도 아래에 작게 남는 재생 막대 */
export function MiniPlayer() {
  const path = usePathname();
  const st = usePlayer();
  const cur = st.queue[st.idx];
  if (!cur || path.startsWith("/listen") || path.startsWith("/onboarding") || path.startsWith("/mock/session")) return null;
  if (!st.started) return null;
  return (
    <div className="app-zoom fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-40 px-3 lg:bottom-4 lg:pl-64">
      <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/95 py-2 pl-3 pr-2 shadow-xl backdrop-blur md:max-w-[46rem]">
        <Link href="/listen" className="flex min-w-0 flex-1 items-center gap-2.5">
          <Headphones size={17} className="shrink-0 text-indigo-300" />
          <span className="min-w-0">
            <span className="block truncate text-[13.5px] font-semibold">{cur.title}</span>
            <span className="block truncate text-[11.5px] text-zinc-500">{cur.pdfTitle}</span>
          </span>
        </Link>
        <button type="button" onClick={toggle} aria-label={st.playing ? "일시정지" : "재생"} className="grid size-10 place-items-center rounded-full bg-indigo-500 text-white">
          {st.playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button type="button" onClick={next} aria-label="다음" className="grid size-10 place-items-center rounded-full text-zinc-300">
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
