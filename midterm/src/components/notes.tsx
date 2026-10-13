"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NoteSection } from "@/lib/types";
import { CompareTable, RichText, SqlBlock } from "./ui";

/**
 * 강의 노트 — 교안을 슬라이드 순서대로 옮긴 것.
 * 절마다 접었다 펼 수 있고, 처음엔 모두 펼쳐 둔다 (읽어 내려가는 용도).
 */
export function NotesView({ sections }: { sections: NoteSection[] }) {
  const [closed, setClosed] = useState<Record<number, boolean>>({});
  return (
    <div className="flex flex-col gap-2.5">
      {sections.map((s, i) => {
        const open = !closed[i];
        return (
          <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setClosed((c) => ({ ...c, [i]: open }))}
              className="flex w-full items-start gap-2 px-4 py-3.5 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-bold leading-snug">
                  {/* 교안의 절 번호("1. 분류")를 제목에 그대로 두므로 따로 번호를 붙이지 않는다 */}
                  {s.title}
                </span>
                {s.en && <span className="mt-0.5 block text-[12px] text-zinc-400">{s.en}</span>}
              </span>
              <ChevronDown
                size={17}
                className={`mt-0.5 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <ul className="flex flex-col gap-1.5">
                  {s.lines.map((ln, j) => {
                    const sub = ln.startsWith("· ");
                    const text = sub ? ln.slice(2) : ln;
                    return (
                      <li
                        key={j}
                        className={`flex gap-2 text-[13.5px] leading-relaxed ${sub ? "pl-4 text-zinc-300" : "text-zinc-200"}`}
                      >
                        <span
                          className={`mt-[8px] shrink-0 rounded-full ${sub ? "h-1 w-1 bg-zinc-500" : "h-1.5 w-1.5 bg-indigo-400"}`}
                        />
                        <span className="min-w-0">
                          <RichText>{text}</RichText>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {s.table && <CompareTable title={s.table.title} headers={s.table.headers} rows={s.table.rows} />}
                {s.code && <SqlBlock className="mt-3">{s.code}</SqlBlock>}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
