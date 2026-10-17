"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Headphones,
  Pause,
  Play,
  Redo2,
  SkipBack,
  SkipForward,
  Undo2,
} from "lucide-react";
import { next, prev, playerState, restoreBar, seek, setQueue, skip, toggle, usePlayer, wasListening } from "@/lib/listen-player";

function clock(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function queueEmpty() {
  return playerState().queue.length === 0;
}

/** 듣기를 켜 둔 채 다른 화면으로 가도 아래에 작게 남는 재생 막대 */
export function MiniPlayer() {
  const path = usePathname();
  const st = usePlayer();
  const cur = st.queue[st.idx];
  const hasQueue = st.queue.length > 0;

  /*
   * 듣는 중에 화면이 새로고침되면(새 판 적용, 폰이 뒤에서 탭을 비움 등) 재생기가 비어
   * 막대가 사라졌다. 이 탭에서 듣고 있었으면 목록을 다시 불러 그 자리에 막대를 띄운다.
   * 브라우저는 누르기 전엔 소리를 못 내게 하므로 멈춘 채로 — 재생을 누르면 이어진다.
   */
  useEffect(() => {
    if (hasQueue || path.startsWith("/listen") || !wasListening()) return;
    let alive = true;
    import("@/lib/listen-queue").then((m) => {
      if (!alive || !queueEmpty()) return;
      setQueue(m.buildQueue(m.listFor(m.savedMode())));
      restoreBar();
    });
    return () => {
      alive = false;
    };
  }, [hasQueue, path]);

  /*
   * 스페이스바 = 재생/일시정지 (넓은 화면에서 듣는 사람용).
   * 문제를 푸는 화면은 스페이스를 "다음 문제·정답 보기"에 이미 쓰므로 비켜 간다.
   * 입력칸에서는 글자를 쳐야 하니 건드리지 않는다.
   * 버튼에 초점이 있으면 스페이스가 그 버튼을 눌러 버리므로(재생 버튼이면 두 번 토글)
   * 기본 동작을 막고 여기서 한 번만 토글한다.
   */
  useEffect(() => {
    if (!hasQueue) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key !== " " ||
        e.repeat ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey
      )
        return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) ||
          t.isContentEditable)
      )
        return;
      const onListen = path.startsWith("/listen");
      if (!onListen && /^\/(quiz|mock|review|wrongs|memo)/.test(path)) return;
      if (!onListen && !st.started) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasQueue, path, st.started]);

  if (
    !cur ||
    path.startsWith("/listen") ||
    path.startsWith("/onboarding") ||
    path.startsWith("/mock/session")
  )
    return null;
  if (!st.started) return null;
  return (
    <div className="app-zoom fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-40 px-3 lg:bottom-4 lg:pl-64">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-zinc-900/95 pb-2 pl-3 pr-2 pt-1.5 shadow-xl backdrop-blur md:max-w-[46rem]">
        {/* 길이 바 — 끌어서 옮긴다 */}
        <div className="flex items-center gap-2 pr-1">
          <input
            type="range"
            min={0}
            max={Math.max(1, st.len)}
            step={st.mode === "audio" ? 0.1 : 1}
            value={Math.min(st.pos, Math.max(1, st.len))}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="재생 위치"
            className="h-1 min-w-0 flex-1 cursor-pointer accent-indigo-400"
          />
          <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-zinc-500">
            {st.mode === "audio"
              ? `${clock(st.pos)} / ${clock(st.len)}`
              : `${Math.round(st.pos) + 1} / ${Math.max(1, st.len)}`}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <Link
            href="/listen"
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            <Headphones size={17} className="shrink-0 text-indigo-300" />
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-semibold">
                {cur.title}
              </span>
              <span className="block truncate text-[11.5px] text-zinc-500">
                {cur.pdfTitle}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={prev}
            aria-label="이전"
            className="grid size-10 place-items-center rounded-full text-zinc-300"
          >
            <SkipBack size={18} />
          </button>
          <button
            type="button"
            onClick={() => skip(-3)}
            aria-label="3초 뒤로"
            className="relative grid size-10 place-items-center rounded-full text-zinc-300"
          >
            <Undo2 size={18} />
            <span className="absolute bottom-0.5 text-[9px] font-bold text-zinc-400">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={st.playing ? "일시정지" : "재생"}
            className="grid size-10 place-items-center rounded-full bg-indigo-500 text-white"
          >
            {st.playing ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => skip(3)}
            aria-label="3초 앞으로"
            className="relative grid size-10 place-items-center rounded-full text-zinc-300"
          >
            <Redo2 size={18} />
            <span className="absolute bottom-0.5 text-[9px] font-bold text-zinc-400">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음"
            className="grid size-10 place-items-center rounded-full text-zinc-300"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
