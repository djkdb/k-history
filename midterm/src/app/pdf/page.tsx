"use client";

import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { Gate } from "@/components/gate";
import { Card, ProgressBar } from "@/components/ui";
import { COURSE } from "@/lib/course";
import { pdfConcepts } from "@/lib/sources";
import { useApp } from "@/lib/store";

/** PDF별 요약 — 강의 자료 한 개를 처음부터 끝까지 읽기 좋게 */
export default function PdfList() {
  return (
    <Gate>
      <Inner />
    </Gate>
  );
}

function Inner() {
  const studied = useApp((s) => s.studied);
  const pdfs = COURSE.pdfs ?? [];
  return (
    <main className="py-6 lg:max-w-3xl">
      <h1 className="text-[22px] font-bold tracking-tight">PDF별 요약</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        강의 PDF 하나를 슬라이드 순서대로 — 요약 · 표 · 핵심(쪽 번호) · 쉬운 설명을 한 문서로 읽어요.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {pdfs.map((f, i) => {
          const cs = pdfConcepts(COURSE.concepts, f);
          const done = cs.filter(({ c }) => studied[c.id]).length;
          const from = Math.min(...cs.map((x) => x.ref.from));
          const to = Math.max(...cs.map((x) => x.ref.to));
          return (
            <Link key={f} href={`/pdf/${i + 1}`} className="flex">
              <Card className="flex-1 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-500/10 text-sky-200">
                    <FileText size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-bold leading-snug">{f}</p>
                    <p className="mt-0.5 text-[12px] text-zinc-400">
                      개념 {cs.length}개 · p.{from}–{to}
                    </p>
                    <ProgressBar value={done} max={Math.max(1, cs.length)} className="mt-2" />
                  </div>
                  <ChevronRight size={17} className="shrink-0 text-zinc-500" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
