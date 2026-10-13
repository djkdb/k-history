"use client";

import { AlertTriangle, ArrowDown, GraduationCap, Lightbulb, Sparkles } from "lucide-react";
import type { Concept } from "@/lib/types";
import { CompareTable, RichText, SqlBlock } from "./ui";

/** 개념 본문 — 쉽게 말하면 · 요약 · 흐름 · 외울 것 · 표 · 예시 · 코드 · 시험엔 이렇게 · 함정 */
export function ConceptBody({ c }: { c: Concept }) {
  return (
    <div>
      {c.easy && (
        <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-200">
            <Sparkles size={14} /> 쉽게 말하면
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[14px] leading-[1.8] text-zinc-200">
            <RichText>{c.easy}</RichText>
          </p>
        </div>
      )}

      <p className="text-[15px] leading-[1.85] text-zinc-200">
        <RichText>{c.summary}</RichText>
      </p>

      {c.flow && c.flow.length > 0 && <Flow steps={c.flow} />}

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

      {c.exam && (
        <div className="mt-4 rounded-2xl border border-indigo-400/25 bg-indigo-500/[0.07] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-200">
            <GraduationCap size={14} /> 시험엔 이렇게
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-zinc-200">
            <RichText>{c.exam}</RichText>
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

/** 흐름 — 단계를 위에서 아래로, 사이에 화살표 */
function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[12px] font-bold text-zinc-400">흐름</p>
      <ol className="flex flex-col items-stretch">
        {steps.map((st, i) => (
          <li key={i} className="flex flex-col items-center">
            <div className="flex w-full items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
              <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-bold text-indigo-200">
                {i + 1}
              </span>
              <span className="min-w-0 text-[13.5px] leading-relaxed text-zinc-200">
                <RichText>{st}</RichText>
              </span>
            </div>
            {i < steps.length - 1 && <ArrowDown size={14} className="my-1 text-zinc-500" aria-hidden />}
          </li>
        ))}
      </ol>
    </div>
  );
}
