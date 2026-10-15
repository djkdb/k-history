"use client";

import { Minus, Plus } from "lucide-react";
import { FONT_STEPS, useFontScale } from "@/lib/font-scale";
import { cn } from "@/lib/utils";

/** 가− 100% 가+ — 본문 글씨 크기 */
export function FontSizeControl({ className }: { className?: string }) {
  const [v, set] = useFontScale();
  const i = FONT_STEPS.indexOf(v);
  const btn =
    "grid h-8 w-8 place-items-center rounded-lg text-zinc-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div
      className={cn("inline-flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] p-0.5", className)}
      role="group"
      aria-label="글씨 크기"
    >
      <button type="button" className={btn} disabled={i <= 0} onClick={() => set(FONT_STEPS[i - 1])} aria-label="글씨 작게">
        <span className="flex items-center text-[12px] font-bold">
          가<Minus size={10} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => set(1)}
        className="min-w-[3rem] text-center text-[11.5px] font-semibold tabular-nums text-zinc-400"
        title="기본 크기로"
      >
        {Math.round(v * 100)}%
      </button>
      <button
        type="button"
        className={btn}
        disabled={i >= FONT_STEPS.length - 1}
        onClick={() => set(FONT_STEPS[i + 1])}
        aria-label="글씨 크게"
      >
        <span className="flex items-center text-[14px] font-bold">
          가<Plus size={11} />
        </span>
      </button>
    </div>
  );
}
