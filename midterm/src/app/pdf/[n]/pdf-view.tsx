"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { ClozeBar } from "@/components/cloze-bar";
import { EasyText } from "@/components/easy-text";
import { Figures } from "@/components/figure";
import { Gate } from "@/components/gate";
import { ClozeCtx, CompareTable, ImportanceBadge, RichText, Sentences, SqlBlock } from "@/components/ui";
import { countKeys, useCloze } from "@/lib/cloze";
import { COURSE, CHAPTER_MAP } from "@/lib/course";
import { usePrintLight } from "@/lib/print";
import { pageLabel, pagesOf, pdfConcepts } from "@/lib/sources";
import { useApp } from "@/lib/store";
import type { Concept, PdfRef } from "@/lib/types";

/**
 * PDF 한 개의 요약본 — 개념 카드를 그 PDF의 쪽 순서로 이어 붙여 한 문서로 읽는다.
 * 섹션마다: 요약 → 그림 → 외울 것 → 표 → 흐름 → 예시 → 핵심(쪽 칩) → 쉬운 설명.
 * 글은 개념 카드의 글을 그대로 쓴다 — 여기서 새로 지어내지 않는다.
 */
export function PdfView({ n }: { n: number }) {
  return (
    <Gate>
      <Inner n={n} />
    </Gate>
  );
}

function Inner({ n }: { n: number }) {
  const pdfs = COURSE.pdfs ?? [];
  const file = pdfs[n - 1];
  const cloze = useCloze();
  usePrintLight();
  if (!file) return <p className="py-10 text-center text-zinc-400">없는 PDF입니다.</p>;
  const list = pdfConcepts(COURSE.concepts, file);
  const chapters = [...new Set(list.map(({ c }) => c.chapter))].map((id) => CHAPTER_MAP[id]).filter(Boolean);

  return (
    <main className="pdf-doc py-6 lg:max-w-3xl">
      <Link href="/pdf" className="no-print inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-400">
        <ArrowLeft size={15} /> PDF별 요약
      </Link>
      <p className="mt-3 text-[12px] font-bold text-sky-300">📄 PDF {n} / {pdfs.length}</p>
      <h1 className="mt-1 text-[23px] font-bold leading-tight tracking-tight lg:text-[26px]">{file}</h1>

      <div className="mt-3 flex items-start gap-2">
        <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-zinc-400">
          개념 {list.length}개를 슬라이드 순서대로 모았어요. 회색 쪽 번호는 원본 PDF의 쪽입니다.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print flex shrink-0 items-center gap-1 rounded-xl border border-white/10 px-2.5 py-1.5 text-[12px] font-semibold text-zinc-300"
        >
          <Printer size={14} /> 인쇄
        </button>
      </div>

      <h2 className="mt-7 text-[20px] font-bold tracking-tight">요약</h2>
      <ul className="mt-2 flex flex-col gap-1.5 text-[14.5px] leading-[1.8] text-zinc-200 lg:text-[15.5px]">
        {chapters.map((ch) => (
          <li key={ch.id}>
            <b className="text-zinc-100">{ch.title}</b>
            {ch.en && <span className="text-zinc-400"> ({ch.en})</span>} — {ch.blurb}
          </li>
        ))}
      </ul>

      <nav className="no-print mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4" aria-label="차례">
        <p className="text-[12px] font-bold text-zinc-400">차례</p>
        <ol className="mt-2 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
          {list.map(({ c, ref }, i) => (
            <li key={c.id} className="flex min-w-0 gap-2">
              <span className="w-5 shrink-0 text-right tabular-nums text-zinc-500">{i + 1}.</span>
              <a href={`#${c.id}`} className="min-w-0 flex-1 truncate text-zinc-200 hover:text-indigo-200">
                {c.title}
              </a>
              <span className="shrink-0 tabular-nums text-zinc-500">{pageLabel(ref)}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="no-print mt-5">
        <ClozeBar on={cloze.on} count={countKeys(list.map(({ c }) => c.summary))} onToggle={cloze.toggle} onRehide={cloze.rehide} />
      </div>
      <ClozeCtx.Provider value={{ on: cloze.on, gen: cloze.gen }}>
        {list.map(({ c, ref }, i) => (
          <Section key={c.id} c={c} ref_={ref} i={i + 1} />
        ))}
      </ClozeCtx.Provider>

      <div className="no-print mt-10 grid grid-cols-2 gap-2">
        {n > 1 ? (
          <Link href={`/pdf/${n - 1}`} className="flex items-center gap-1 rounded-2xl border border-white/10 p-3 text-[12.5px] text-zinc-300">
            <ChevronLeft size={16} className="shrink-0" /> <span className="min-w-0 truncate">{pdfs[n - 2]}</span>
          </Link>
        ) : (
          <span />
        )}
        {n < pdfs.length && (
          <Link
            href={`/pdf/${n + 1}`}
            className="flex items-center justify-end gap-1 rounded-2xl border border-white/10 p-3 text-right text-[12.5px] text-zinc-300"
          >
            <span className="min-w-0 truncate">{pdfs[n]}</span> <ChevronRight size={16} className="shrink-0" />
          </Link>
        )}
      </div>
    </main>
  );
}

function Section({ c, ref_, i }: { c: Concept; ref_: PdfRef; i: number }) {
  const studied = useApp((s) => !!s.studied[c.id]);
  const key = c.exam ?? c.points[0] ?? c.summary;
  return (
    <section id={c.id} className="pdf-sec mt-10 scroll-mt-20">
      <div className="flex items-start gap-2">
        <h2 className="min-w-0 flex-1 text-[20px] font-bold leading-snug tracking-tight lg:text-[22px]">
          {i}. {c.title}
          {studied && <span className="ml-1.5 align-middle text-[13px] text-emerald-300" title="공부함">✓</span>}
        </h2>
        <ImportanceBadge level={c.importance} />
      </div>
      {c.en && <p className="mt-0.5 text-[13px] font-semibold text-indigo-200">{c.en}</p>}

      <p className="mt-3 text-[15px] leading-[1.85] text-zinc-200 lg:text-[16px]">
        <Sentences>{c.summary}</Sentences>
      </p>

      <Figures list={c.figures} />

      {c.points.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5">
          {c.points.map((p, k) => (
            <li key={k} className="flex gap-2.5 text-[14.5px] leading-relaxed text-zinc-200 lg:text-[15.5px]">
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
          {c.flow.map((s, k) => (
            <li key={k} className="flex gap-2.5 text-[14.5px] leading-relaxed text-zinc-200">
              <span className="w-5 shrink-0 text-right font-bold tabular-nums text-indigo-300">{k + 1}.</span>
              <span className="min-w-0">
                <RichText>{s}</RichText>
              </span>
            </li>
          ))}
        </ol>
      )}

      {c.code && <SqlBlock className="mt-4">{c.code}</SqlBlock>}

      {c.example && (
        <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-zinc-300">
          <span className="font-bold text-sky-200">예: </span>
          <Sentences>{c.example}</Sentences>
        </p>
      )}

      <div className="mt-5 border-l-[3px] border-zinc-400/60 bg-white/[0.035] py-3 pl-4 pr-3">
        <p className="text-[14.5px] leading-[1.75] text-zinc-100">
          <b>🎯 핵심: </b>
          <RichText>{key}</RichText>
        </p>
        {c.trap && (
          <p className="mt-2 text-[14px] leading-[1.75] text-zinc-200">
            <b>⚠️ 함정: </b>
            <RichText>{c.trap}</RichText>
          </p>
        )}
        <p className="mt-2 flex flex-wrap gap-1">
          {pagesOf(ref_).map((p) => (
            <span key={p} className="rounded-full bg-white/[0.08] px-2 py-[1px] text-[11px] tabular-nums text-zinc-400">
              p.{p}
            </span>
          ))}
        </p>
      </div>

      {c.easy && (
        <>
          <p className="mt-5 text-[13px] font-bold text-emerald-200">💬 쉬운 설명</p>
          <div className="mt-2 border-l-[3px] border-emerald-400/30 pl-4">
            <EasyText>{c.easy}</EasyText>
          </div>
        </>
      )}

      <Link href={`/concept/${c.id}`} className="no-print mt-4 inline-block text-[12.5px] font-semibold text-indigo-300">
        개념 카드로 →
      </Link>
    </section>
  );
}
