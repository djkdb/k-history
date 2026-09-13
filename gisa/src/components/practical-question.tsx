"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Eye, X } from "lucide-react";
import { Button, RichText, SubjectBadge } from "@/components/ui";
import { CONCEPT_MAP } from "@/data/concepts";
import { gradeByKind, type GradeResult } from "@/lib/grade";
import type { PracticalQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<PracticalQuestion["kind"], string> = {
  term: "용어 쓰기",
  code: "출력 쓰기",
  sql: "SQL 쓰기",
  blank: "빈칸 채우기",
};

const KIND_HINT: Record<PracticalQuestion["kind"], string> = {
  term: "한글·영문 어느 쪽으로 적어도 됩니다.",
  code: "줄바꿈과 대소문자까지 그대로 봅니다.",
  sql: "대소문자·줄바꿈·끝의 세미콜론은 보지 않습니다.",
  blank: "빈칸에 들어갈 말만 적으세요.",
};

/**
 * 실기 한 문항.
 *
 * 필기와 달리 고를 것이 없다. 직접 적고, 채점기가 표기 흔들림을 흡수해
 * 맞았는지 본다. 틀렸을 때는 모범 답안과 함께 "왜" 를 붙인다.
 */
export function PracticalQuestionCard({
  q,
  index,
  total,
  value,
  onChange,
  result,
  onGrade,
  showSubject = true,
  showPoints = true,
  linkConcept = true,
}: {
  q: PracticalQuestion;
  index?: number;
  total?: number;
  value: string;
  onChange: (v: string) => void;
  result: GradeResult | null;
  onGrade: (r: GradeResult) => void;
  showSubject?: boolean;
  /** 배점을 보여 줄 것인가 — 복습에는 점수가 없으므로 끈다 */
  showPoints?: boolean;
  /** 채점 뒤 이 문항이 나온 개념으로 가는 길을 둘 것인가 */
  linkConcept?: boolean;
}) {
  const [peeked, setPeeked] = useState(false);
  const concept = CONCEPT_MAP[q.sourceId];
  const ref = useRef<HTMLTextAreaElement>(null);
  const multiline = q.kind === "code" || q.kind === "sql";

  // 문항이 바뀌면 엿본 표시도 같이 지운다. 남겨 두면 다음 문항이
  // 답부터 펼쳐진 채로 뜬다.
  useEffect(() => setPeeked(false), [q.id]);

  const graded = result !== null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {typeof index === "number" && (
          <span className="text-[12px] font-bold tabular-nums text-zinc-500">
            {index + 1}
            {typeof total === "number" && ` / ${total}`}
          </span>
        )}
        {showSubject && <SubjectBadge subject={q.subject} />}
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
          {KIND_LABEL[q.kind]}
        </span>
        {showPoints && (
          <span className="ml-auto text-[12px] font-bold tabular-nums text-indigo-200">
            {q.points}점
          </span>
        )}
      </div>

      <h2 className="mt-3 text-[15px] font-bold leading-relaxed">
        {q.question}
      </h2>

      {q.passage && (
        <pre className="sql-block sql-surface mt-3 overflow-x-auto rounded-xl border border-white/10 px-3.5 py-3 text-[12.5px] leading-[1.75] text-zinc-200">
          {q.passage}
        </pre>
      )}

      <div className="mt-4">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={graded}
          rows={multiline ? 5 : 2}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={multiline ? "여기에 적으세요" : "답"}
          className={cn(
            "w-full resize-y rounded-2xl border bg-white/5 px-3.5 py-3 text-[14px] leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600",
            multiline && "font-mono text-[13px]",
            graded && result?.judgement === "correct"
              ? "border-emerald-400/50 bg-emerald-500/10"
              : graded
                ? "border-rose-400/50 bg-rose-500/10"
                : "border-white/10 focus:border-indigo-400/60",
          )}
        />
        <p className="mt-1.5 text-[11px] text-zinc-500">{KIND_HINT[q.kind]}</p>
      </div>

      {!graded && (
        <div className="mt-3 flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onGrade(gradeByKind(q.kind, value, q.answers))}
          >
            <Check size={16} />
            채점
          </Button>
          <Button variant="outline" onClick={() => setPeeked(true)}>
            <Eye size={16} />
            모르겠어요
          </Button>
        </div>
      )}

      {peeked && !graded && (
        <div className="mt-3 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-3.5">
          <p className="text-[12px] font-bold text-amber-200">모범 답안</p>
          <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-200">
            {q.answers[0]}
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            보고 나서 적어도 됩니다. 다만 이 문항은 틀린 것으로 칩니다 — 손이
            기억하는지를 보는 것이 실기입니다.
          </p>
        </div>
      )}

      {graded && (
        <div
          className={cn(
            "mt-4 rounded-2xl border p-3.5",
            result.judgement === "correct"
              ? "border-emerald-400/30 bg-emerald-500/10"
              : "border-rose-400/30 bg-rose-500/10",
          )}
        >
          <div className="flex items-center gap-1.5">
            {result.judgement === "correct" ? (
              <Check size={14} className="text-emerald-300" />
            ) : (
              <X size={14} className="text-rose-300" />
            )}
            <span
              className={cn(
                "text-[12px] font-bold",
                result.judgement === "correct"
                  ? "text-emerald-200"
                  : "text-rose-200",
              )}
            >
              {result.judgement === "correct"
                ? showPoints
                  ? `맞았습니다 · ${q.points}점`
                  : "맞았습니다"
                : result.judgement === "empty"
                  ? showPoints
                    ? "빈칸입니다 · 0점"
                    : "빈칸입니다"
                  : showPoints
                    ? "틀렸습니다 · 0점"
                    : "틀렸습니다"}
            </span>
          </div>

          {result.note && (
            <p className="mt-2 text-[12px] leading-relaxed text-amber-200">
              {result.note}
            </p>
          )}

          {result.judgement !== "correct" && (
            <div className="mt-2.5">
              <p className="text-[11px] font-bold text-zinc-400">모범 답안</p>
              <p className="mt-1 whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-zinc-100">
                {q.answers[0]}
              </p>
              {q.answers.length > 1 && (
                <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
                  이렇게 적어도 맞습니다 — {q.answers.slice(1).join(" / ")}
                </p>
              )}
            </div>
          )}

          <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-300">
            <RichText>{q.explanation}</RichText>
          </p>

          {/* 틀렸으면 어디로 가서 봐야 하는지까지 이어 준다 */}
          {linkConcept && concept && (
            <Link
              href={`/concept/${concept.id}`}
              className="-mx-1 mt-3 flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-[12px] font-semibold text-indigo-300 hover:text-indigo-200"
            >
              <BookOpen size={13} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">{concept.title}</span>
              <ArrowRight size={13} className="shrink-0" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
