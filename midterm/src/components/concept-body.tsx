"use client";

import type { Concept } from "@/lib/types";
import { EasyText } from "./easy-text";
import { Figures } from "./figure";
import { ClozeCtx, CompareTable, RichText, Sentences, SqlBlock } from "./ui";

/**
 * 개념 본문 — PDF별 요약과 같은 결의 "한 편의 글"로 읽힌다.
 *
 *   한 줄 요약(리드) → 풀어서 읽는 본문 → 그림 → 정리(외울 것 · 표 · 흐름 · 코드 · 예) → 시험 포인트 상자
 *
 * 예전에는 쉽게 말하면 · 요약 · 자세히 풀어보기 · 외울 것 · 시험엔 이렇게가 각자 색 상자로 떠서
 * 같은 말을 다섯 번 하는 느낌이었다. 지금은 역할을 하나씩만 맡긴다:
 *   - 요약 = 첫 문장(무엇인가), 본문 = 왜·어떻게(자세히 풀어보기, 없으면 쉬운 설명),
 *     정리 = 외울 목록, 상자 = 시험에서 묻는 모양과 함정
 * compact(복습 화면): 본문은 짧은 쉬운 설명으로 대신한다.
 */
export function ConceptBody({ c, compact = false }: { c: Concept; compact?: boolean }) {
  const body = !compact && c.explain ? c.explain : null;
  const hasSummary = (c.points.length > 0 || c.table || (c.flow && c.flow.length > 0) || c.code || c.example) as boolean;
  const pages = (c.sources ?? []).flatMap((r) => (r.from === r.to ? [`p.${r.from}`] : [`p.${r.from}–${r.to}`]));

  return (
    <div>
      {/* 리드 — 이 개념이 무엇인지 한 번에 */}
      <p className="text-[16px] font-medium leading-[1.85] text-zinc-100 lg:text-[17px]">
        <Sentences>{c.summary}</Sentences>
      </p>

      {/* 본문 — 선생님이 옆에서 풀어 주듯. 읽는 글이라 가리고 떠올리기에서 뺀다 */}
      {body ? (
        <ClozeCtx.Provider value={{ on: false, gen: 0 }}>
          <div className="mt-5 flex flex-col gap-4">
            {body
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.9] text-zinc-200 lg:text-[16px]">
                  <RichText>{p}</RichText>
                </p>
              ))}
          </div>
        </ClozeCtx.Provider>
      ) : (
        c.easy && (
          <div className="mt-4 border-l-[3px] border-emerald-400/30 pl-4">
            <EasyText>{c.easy}</EasyText>
          </div>
        )
      )}

      <Figures list={c.figures} />

      {hasSummary && (
        <>
          <h2 className="mt-9 text-[17px] font-bold tracking-tight text-zinc-100">정리</h2>

          {c.points.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {c.points.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-zinc-200 lg:text-[15.5px]">
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span className="min-w-0">
                    <RichText>{p}</RichText>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {c.table && <CompareTable title={c.table.title} headers={c.table.headers} rows={c.table.rows} />}

          {c.flow && c.flow.length > 0 && (
            <ol className="mt-4 flex flex-col gap-1.5">
              {c.flow.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-zinc-200 lg:text-[15.5px]">
                  <span className="w-5 shrink-0 text-right font-bold tabular-nums text-indigo-300">{i + 1}.</span>
                  <span className="min-w-0">
                    <RichText>{s}</RichText>
                  </span>
                </li>
              ))}
            </ol>
          )}

          {c.code && <SqlBlock className="mt-4">{c.code}</SqlBlock>}

          {c.example && (
            <p className="mt-4 whitespace-pre-line text-[14.5px] leading-relaxed text-zinc-300">
              <span className="font-bold text-sky-200">예: </span>
              <Sentences>{c.example}</Sentences>
            </p>
          )}
        </>
      )}

      {/* 시험 포인트 — PDF 요약의 '핵심' 상자와 같은 모양 */}
      {(c.exam || c.trap) && (
        <div className="mt-7 border-l-[3px] border-zinc-400/60 bg-white/[0.035] py-3 pl-4 pr-3">
          {c.exam && (
            <p className="whitespace-pre-line text-[14.5px] leading-[1.75] text-zinc-100">
              <b>🎯 시험엔: </b>
              <Sentences>{c.exam}</Sentences>
            </p>
          )}
          {c.trap && (
            <p className={c.exam ? "mt-2 text-[14px] leading-[1.75] text-zinc-200" : "text-[14px] leading-[1.75] text-zinc-200"}>
              <b>⚠️ 함정: </b>
              <Sentences>{c.trap}</Sentences>
            </p>
          )}
          {pages.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-1">
              {pages.map((p) => (
                <span key={p} className="rounded-full bg-white/[0.08] px-2 py-[1px] text-[11px] tabular-nums text-zinc-400">
                  {p}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
