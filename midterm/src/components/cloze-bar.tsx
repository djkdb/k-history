"use client";

import { EyeOff, Eye, RotateCcw } from "lucide-react";

/** 읽기 ↔ 가리고 떠올리기 전환 막대 */
export function ClozeBar({
  on,
  count,
  onToggle,
  onRehide,
}: {
  on: boolean;
  count: number;
  onToggle: () => void;
  onRehide: () => void;
}) {
  if (count === 0) return null;
  return (
    <div className="no-print mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold ${
          on ? "bg-indigo-500/20 text-indigo-100" : "text-zinc-300"
        }`}
      >
        {on ? <EyeOff size={15} /> : <Eye size={15} />}
        {on ? `가리고 떠올리기 중 · 핵심어 ${count}개` : `가리고 떠올리기 (핵심어 ${count}개)`}
      </button>
      {on && (
        <button
          type="button"
          onClick={onRehide}
          aria-label="모두 다시 가리기"
          className="grid h-9 w-9 place-items-center rounded-xl text-zinc-300"
        >
          <RotateCcw size={15} />
        </button>
      )}
    </div>
  );
}
