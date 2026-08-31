"use client";

import type { ReactNode } from "react";
import { RotateCw } from "lucide-react";

/** 모든 인포그래픽의 공통 껍데기 — 제목 + 다시보기 버튼 */
export function InfographicFrame({
  title,
  color,
  onReplay,
  children,
}: {
  title: string;
  color: string;
  onReplay: () => void;
  children: ReactNode;
}) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: color }}
          />
          <h4 className="text-xs font-bold text-zinc-300">{title}</h4>
        </div>
        <button
          type="button"
          onClick={onReplay}
          aria-label="애니메이션 다시 보기"
          className="-m-2.5 p-2.5 text-zinc-600 transition-colors hover:text-zinc-300"
        >
          <RotateCw size={13} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
