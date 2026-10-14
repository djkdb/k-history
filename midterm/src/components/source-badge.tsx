import { FileText, PencilLine } from "lucide-react";
import { HAS_PDF } from "@/lib/qset";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * 문제 출처 표시 — 강의 PDF 퀴즈 원문인지, 강의 내용으로 따로 만든 추가 문제인지.
 * PDF 퀴즈가 있는 과목에서만 보인다 (다른 과목은 모두 추가 문제라 굳이 붙이지 않는다).
 */
export function SourceBadge({ q, className }: { q: Question; className?: string }) {
  if (!HAS_PDF) return null;
  const pdf = q.src === "pdf";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold",
        pdf ? "bg-sky-500/10 text-sky-200" : "bg-violet-500/15 text-violet-200",
        className,
      )}
    >
      {pdf ? <FileText size={11} /> : <PencilLine size={11} />}
      {pdf ? `강의 퀴즈${q.page ? ` p.${q.page}` : ""} · 원문 그대로` : "추가 문제 · 강의 내용으로 만든 문제 (PDF 퀴즈 아님)"}
    </span>
  );
}
