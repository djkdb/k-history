"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { COURSE } from "@/lib/course";
import { BASE } from "@/lib/base";
import { notesPdfUrl, pageLabel } from "@/lib/sources";
import type { PdfRef } from "@/lib/types";
import { cn } from "@/lib/utils";

/** 📄 Lecture 2 · p.60–62 — 누르면 그 PDF의 요약본으로 */
export function PdfSource({ refs, className }: { refs?: PdfRef[]; className?: string }) {
  if (!refs?.length) return null;
  return (
    <p className={cn("flex flex-wrap items-center gap-1.5 text-[12px]", className)}>
      {refs.map((r, i) => {
        const n = COURSE.pdfs?.indexOf(r.file) ?? -1;
        const body = (
          <>
            <FileText size={12.5} className="shrink-0 opacity-70" />
            <span className="min-w-0 truncate">{r.file}</span>
            <span className="shrink-0 font-bold tabular-nums text-sky-100">{pageLabel(r)}</span>
          </>
        );
        const cls =
          "inline-flex max-w-full items-center gap-1.5 rounded-lg border border-sky-400/20 bg-sky-500/[0.08] px-2 py-1 text-sky-200";
        const notes = notesPdfUrl(COURSE.notesPdf, r.file, BASE);
        const link = n >= 0 ? (
          <Link key={`l${i}`} href={`/pdf/${n + 1}`} className={cn(cls, "hover:bg-sky-500/15")} title="이 PDF 요약본 보기">
            {body}
          </Link>
        ) : (
          <span key={`s${i}`} className={cls}>
            {body}
          </span>
        );
        if (!notes) return link;
        return (
          <span key={i} className="inline-flex max-w-full flex-wrap items-center gap-1.5">
            {link}
            <a
              href={`${notes}#page=${r.from}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-400/25 bg-amber-500/[0.08] px-2 py-1 font-semibold text-amber-200 hover:bg-amber-500/15"
              title="원본 슬라이드 + 한글 번역 + 필기 PDF, 이 쪽으로 열기"
            >
              ✍ 한글 필기 p.{r.from}
            </a>
          </span>
        );
      })}
    </p>
  );
}
