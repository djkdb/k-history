"use client";

import { AlertTriangle, ArrowDown, BookOpen, GraduationCap, Lightbulb, Sparkles } from "lucide-react";
import type { Concept } from "@/lib/types";
import { EasyText } from "./easy-text";
import { Figures } from "./figure";
import { ClozeCtx, CompareTable, RichText, Sentences, SqlBlock } from "./ui";

/** 개념 본문 — 자세히 풀어보기 · 쉽게 말하면 · 요약 · 그림 · 흐름 · 외울 것 · 표 · 예시 · 코드 · 시험엔 이렇게 · 함정 */
export function ConceptBody({ c }: { c: Concept }) {
  return (
    <div>
      {c.explain && <Explain text={c.explain} />}

      {c.explain && (
        <p className="mb-3 mt-7 flex items-center gap-2 text-[12px] font-bold text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          한눈에 정리
          <span className="h-px flex-1 bg-white/10" />
        </p>
      )}

      {c.easy && (
        <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-200">
            <Sparkles size={14} /> 쉽게 말하면
          </p>
          <div className="mt-2">
            <EasyText>{c.easy}</EasyText>
          </div>
        </div>
      )}

      <p className="text-[15px] leading-[1.85] text-zinc-200 lg:text-[16px]">
        <Sentences>{c.summary}</Sentences>
      </p>

      {/* 그림은 설명 바로 아래 — 말과 그림을 가까이 둔다 */}
      <Figures list={c.figures} />

      {c.flow && c.flow.length > 0 && <Flow steps={c.flow} />}

      {c.points.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[12px] font-bold text-zinc-400">외울 것</p>
          <ul className="flex flex-col gap-2">
            {c.points.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-zinc-200 lg:text-[15px]">
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
          <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-zinc-200 lg:text-[14.5px]">
            <Sentences>{c.example}</Sentences>
          </p>
        </div>
      )}

      {c.exam && (
        <div className="mt-4 rounded-2xl border border-indigo-400/25 bg-indigo-500/[0.07] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-200">
            <GraduationCap size={14} /> 시험엔 이렇게
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-zinc-200 lg:text-[14.5px]">
            <Sentences>{c.exam}</Sentences>
          </p>
        </div>
      )}

      {c.trap && (
        <div className="mt-4 rounded-2xl border border-amber-400/25 bg-amber-500/[0.07] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-amber-200">
            <AlertTriangle size={14} /> 헷갈리는 곳
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-200 lg:text-[14.5px]">
            <Sentences>{c.trap}</Sentences>
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
              <span className="min-w-0 text-[13.5px] leading-relaxed text-zinc-200 lg:text-[14.5px]">
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

/** 자세히 풀어보기 — 선생님이 옆에서 말로 풀어 주듯, 문단 단위로 넉넉하게 */
function Explain({ text }: { text: string }) {
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className="mb-2 rounded-2xl border border-violet-400/25 bg-violet-500/[0.06] p-4 lg:p-5">
      <p className="flex items-center gap-1.5 text-[12px] font-bold text-violet-200">
        <BookOpen size={14} /> 자세히 풀어보기
      </p>
      {/* 설명 문단은 읽는 글이라 가리고 떠올리기에서 뺀다 */}
      <ClozeCtx.Provider value={{ on: false, gen: 0 }}>
        <div className="mt-2.5 flex flex-col gap-3.5">
          {paras.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.9] text-zinc-100 lg:text-[16px]">
              <RichText>{p}</RichText>
            </p>
          ))}
        </div>
      </ClozeCtx.Provider>
    </section>
  );
}
