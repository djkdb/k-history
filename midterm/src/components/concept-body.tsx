"use client";

import { AlertTriangle, Lightbulb } from "lucide-react";
import type { Concept } from "@/lib/types";
import { CompareTable, RichText, SqlBlock } from "./ui";

/** 개념 본문 — 요약 · 외울 것 · 표 · 예시 · 코드 · 함정 */
export function ConceptBody({ c }: { c: Concept }) {
  return (
    <div>
      <p className="text-[15px] leading-[1.85] text-zinc-200">
        <RichText>{c.summary}</RichText>
      </p>

      {c.points.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[12px] font-bold text-zinc-400">외울 것</p>
          <ul className="flex flex-col gap-2">
            {c.points.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-zinc-200">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span className="min-w-0">
                  <RichText>{p}</RichText>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.table && <CompareTable title={c.table.title} headers={c.table.headers} rows={c.table.rows} />}

      {c.code && <SqlBlock className="mt-4">{c.code}</SqlBlock>}

      {c.example && (
        <div className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-500/[0.06] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-sky-200">
            <Lightbulb size={14} /> 예시
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-zinc-200">
            <RichText>{c.example}</RichText>
          </p>
        </div>
      )}

      {c.trap && (
        <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/[0.07] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-amber-200">
            <AlertTriangle size={14} /> 헷갈리는 곳
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-200">
            <RichText>{c.trap}</RichText>
          </p>
        </div>
      )}
    </div>
  );
}
