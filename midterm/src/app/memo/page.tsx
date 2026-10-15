"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Printer } from "lucide-react";
import { ClozeBar } from "@/components/cloze-bar";
import { FontSizeControl } from "@/components/font-size";
import { Gate } from "@/components/gate";
import { Chip, ClozeCtx, CompareTable, ImportanceBadge, RichText } from "@/components/ui";
import { countKeys, useCloze } from "@/lib/cloze";
import { COURSE, termLabel } from "@/lib/course";
import { KEY } from "@/lib/course-id";
import { usePrintLight } from "@/lib/print";
import { useApp } from "@/lib/store";
import { pageLabel, pdfConcepts } from "@/lib/sources";
import type { Concept, PdfRef } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * 암기 — PDF 하나씩, 외울 것만.
 * 설명·비유는 빼고 외울 것 · 표 · 순서 · 시험 포인트 · 함정만 남겨 빽빽하지 않게 늘어놓는다.
 * 가리고 떠올리기를 켜면 굵은 핵심어가 가려진다. "외웠어요" 표시는 공부 기록(memo)에 남아 기록 코드로 맞춰진다.
 */
const PDF_KEY = `${KEY}:memo-pdf`;
const DONE_KEY = `${KEY}:memo-done`;

/** 예전 판은 외움 표시를 이 기기에만 두었다 — 한 번 읽어 기록으로 옮기고 지운다 */
function takeOldDone(): string[] {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return [];
    localStorage.removeItem(DONE_KEY);
    return Object.keys(JSON.parse(raw) as Record<string, 1>);
  } catch {
    return [];
  }
}

export default function Memo() {
  return (
    <Gate>
      <Inner />
    </Gate>
  );
}

type Filter = "all" | "key" | "left";

function Inner() {
  const pdfs = COURSE.pdfs ?? [];
  const [n, setN] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const memo = useApp((s) => s.memo);
  const toggleMemo = useApp((s) => s.toggleMemo);
  const importMemo = useApp((s) => s.importMemo);
  const done = (id: string) => (memo[id] ?? 0) > 0;
  const cloze = useCloze();
  usePrintLight();

  useEffect(() => {
    const old = takeOldDone();
    if (old.length) importMemo(old);
    try {
      const v = Number(localStorage.getItem(PDF_KEY));
      if (v >= 0 && v < pdfs.length) setN(v);
    } catch {
      /* 처음 PDF 로 */
    }
  }, [pdfs.length, importMemo]);

  const pick = (i: number) => {
    setN(i);
    try {
      localStorage.setItem(PDF_KEY, String(i));
    } catch {
      /* 무시 */
    }
    window.scrollTo({ top: 0 });
  };
  const all = useMemo(() => (pdfs[n] ? pdfConcepts(COURSE.concepts, pdfs[n]) : []), [n, pdfs]);
  const list = all.filter(({ c }) => (filter === "key" ? c.importance !== "normal" : filter === "left" ? !done(c.id) : true));
  const nDone = all.filter(({ c }) => done(c.id)).length;

  return (
    <main className="py-6 lg:max-w-3xl">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold tracking-tight">암기</h1>
          <p className="mt-1 text-[13px] text-zinc-400">PDF별로 외울 것만 — 설명은 빼고 핵심어·표·순서·함정</p>
        </div>
        <FontSizeControl className="no-print shrink-0" />
      </div>

      {/* PDF 고르기 */}
      <div className="no-print -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {pdfs.map((f, i) => (
          <button
            key={f}
            type="button"
            onClick={() => pick(i)}
            aria-pressed={i === n}
            className={cn(
              "shrink-0 rounded-xl border px-3 py-2 text-left text-[12.5px] font-semibold md:shrink",
              i === n ? "border-indigo-400/60 bg-indigo-500/15 text-indigo-100" : "border-white/10 text-zinc-400 hover:bg-white/5",
            )}
          >
            <span className="mr-1 tabular-nums text-zinc-500">{i + 1}</span>
            {shortName(f)}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <h2 className="min-w-0 flex-1 text-[17px] font-bold leading-snug">📄 {pdfs[n]}</h2>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print flex shrink-0 items-center gap-1 rounded-xl border border-white/10 px-2.5 py-1.5 text-[12px] font-semibold text-zinc-300"
        >
          <Printer size={14} /> 인쇄
        </button>
      </div>
      <div className="no-print mt-2 flex flex-wrap items-center gap-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>
          전체 {all.length}
        </Chip>
        <Chip active={filter === "key"} onClick={() => setFilter("key")}>
          ★ 중요만
        </Chip>
        <Chip active={filter === "left"} onClick={() => setFilter("left")}>
          안 외운 것 {all.length - nDone}
        </Chip>
        <span className="ml-auto text-[12px] tabular-nums text-zinc-400">
          외움 {nDone}/{all.length}
        </span>
      </div>
      <div className="no-print mt-3">
        <ClozeBar on={cloze.on} count={countKeys(list.flatMap(({ c }) => c.points))} onToggle={cloze.toggle} onRehide={cloze.rehide} />
      </div>

      <ClozeCtx.Provider value={{ on: cloze.on, gen: cloze.gen }}>
        <ol className="mt-4 flex flex-col gap-3">
          {list.map(({ c, ref }) => (
            <MemoCard key={c.id} c={c} r={ref} no={all.findIndex((x) => x.c.id === c.id) + 1} done={done(c.id)} onDone={() => toggleMemo(c.id)} />
          ))}
        </ol>
      </ClozeCtx.Provider>
      {list.length === 0 && (
        <p className="py-10 text-center text-[13px] text-zinc-400">{filter === "left" ? "이 PDF는 다 외웠어요 🎉" : "보일 개념이 없어요."}</p>
      )}

      {n < pdfs.length - 1 && (
        <button
          type="button"
          onClick={() => pick(n + 1)}
          className="no-print mt-6 w-full rounded-2xl border border-white/10 p-3 text-[13px] font-semibold text-zinc-300 hover:bg-white/5"
        >
          다음 PDF: {pdfs[n + 1]} →
        </button>
      )}
    </main>
  );
}

/** "Lecture 2. Introduction to …" → "Lecture 2" 처럼 칩에 맞게 */
function shortName(f: string) {
  const m = f.match(/^(Lecture \d+|Practice \d+|ML-0?\d+[^ ]*(?: [^ ]+)?|CS \d+(?:-\d)?\.?|IIR \d+\.?|#[\d-]+ (?:Ch[\d-]+)?)/);
  const head = m ? m[1].replace(/\.$/, "") : f;
  const rest = f.slice(m ? m[0].length : f.length).replace(/^[.\s]+/, "");
  const tail = rest.split(/[(·,]/)[0].trim();
  return tail && tail.length <= 16 ? `${head} ${tail}` : head;
}

function MemoCard({ c, r, no, done, onDone }: { c: Concept; r: PdfRef; no: number; done: boolean; onDone: () => void }) {
  return (
    <li
      className={cn(
        "print-sheet rounded-2xl border p-4 transition-opacity",
        c.importance === "must" ? "border-rose-400/25 bg-rose-500/[0.04]" : "border-white/10 bg-white/[0.03]",
        done && "opacity-60",
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-[2px] grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-indigo-500/20 px-1 text-[11.5px] font-bold tabular-nums text-indigo-200">
          {no}
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/concept/${c.id}`} className="text-[16px] font-bold leading-snug hover:text-indigo-200">
            {termLabel(c)}
          </Link>
          <p className="mt-0.5 text-[11.5px] text-zinc-500">
            {pageLabel(r)}
            {!COURSE.englishExam && c.en ? ` · ${c.en}` : ""}
          </p>
        </div>
        <ImportanceBadge level={c.importance} compact />
        <button
          type="button"
          onClick={onDone}
          aria-pressed={done}
          title={done ? "외웠어요 (누르면 취소)" : "외웠으면 눌러 두세요"}
          className={cn(
            "no-print grid h-7 w-7 shrink-0 place-items-center rounded-lg border",
            done ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200" : "border-white/15 text-zinc-500 hover:text-zinc-300",
          )}
        >
          <Check size={15} />
        </button>
      </div>

      {c.points.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {c.points.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-[14.5px] leading-[1.7] text-zinc-100 lg:text-[15.5px]">
              <span className="mt-[0.68em] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <span className="min-w-0">
                <RichText>{p}</RichText>
              </span>
            </li>
          ))}
        </ul>
      )}

      {c.flow && c.flow.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {c.flow.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-zinc-500">→</span>}
              <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-[13px] leading-snug text-zinc-200">
                <span className="mr-1 font-bold text-indigo-300">{i + 1}</span>
                <RichText>{s}</RichText>
              </span>
            </span>
          ))}
        </div>
      )}

      {c.table && <CompareTable title={c.table.title} headers={c.table.headers} rows={c.table.rows} />}

      {c.exam && (
        <p className="mt-3 rounded-xl bg-indigo-500/[0.08] px-3 py-2 text-[13.5px] leading-[1.7] text-zinc-200">
          <b className="text-indigo-200">🎯 시험엔 </b>
          <RichText>{c.exam}</RichText>
        </p>
      )}
      {c.trap && (
        <p className="mt-2 rounded-xl bg-amber-500/[0.08] px-3 py-2 text-[13.5px] leading-[1.7] text-zinc-200">
          <b className="text-amber-200">⚠️ 함정 </b>
          <RichText>{c.trap}</RichText>
        </p>
      )}
    </li>
  );
}
