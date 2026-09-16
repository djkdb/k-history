"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Eye, Minus, X } from "lucide-react";
import { Button, MissBadge, RichText, SubjectBadge } from "@/components/ui";
import { CONCEPT_MAP } from "@/data/concepts";
import { gradeByKind, type GradeResult } from "@/lib/grade";
import type { PracticalQuestion } from "@/lib/types";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<PracticalQuestion["kind"], string> = {
  term: "용어 쓰기",
  code: "출력 쓰기",
  sql: "SQL 쓰기",
  blank: "빈칸 채우기",
  essay: "설명 쓰기",
};

const KIND_HINT: Record<PracticalQuestion["kind"], string> = {
  term: "한글·영문 어느 쪽으로 적어도 됩니다.",
  code: "줄바꿈과 대소문자까지 그대로 봅니다.",
  sql: "대소문자·줄바꿈·끝의 세미콜론은 보지 않습니다.",
  blank: "빈칸에 들어갈 말만 적으세요.",
  essay: "한두 문장으로 설명하세요. 채점은 스스로 합니다.",
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
  /** 채점 결과와 함께, 답을 미리 보고 적었는지를 알려 준다 */
  onGrade: (r: GradeResult, peeked: boolean) => void;
  showSubject?: boolean;
  /** 배점을 보여 줄 것인가 — 복습에는 점수가 없으므로 끈다 */
  showPoints?: boolean;
  /** 채점 뒤 이 문항이 나온 개념으로 가는 길을 둘 것인가 */
  linkConcept?: boolean;
}) {
  const [peeked, setPeeked] = useState(false);
  const concept = CONCEPT_MAP[q.sourceId];
  const misses = useApp((s) => s.questionMisses[q.id] ?? 0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const multiline = q.kind === "code" || q.kind === "sql" || q.kind === "essay";
  /** 약술형은 기계가 매기지 않는다 — 기준을 펴 보이고 본인이 매긴다 */
  const self = q.kind === "essay";

  // 문항이 바뀌면 엿본 표시도 같이 지운다. 남겨 두면 다음 문항이
  // 답부터 펼쳐진 채로 뜬다.
  useEffect(() => setPeeked(false), [q.id]);
  const [rubricOpen, setRubricOpen] = useState(false);
  useEffect(() => setRubricOpen(false), [q.id]);

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
        <MissBadge misses={misses} />
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
          aria-label="답안"
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

      {!graded && !self && (
        <div className="mt-3 flex gap-2">
          <Button
            className="flex-1"
            onClick={() =>
              onGrade(gradeByKind(q.kind, value, q.answers), peeked)
            }
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

      {/*
        약술형 — 스스로 매기기.

        글자를 맞춰 보는 채점기로는 "IDS 는 탐지해 알리고 IPS 는 그 자리에서
        차단한다" 와 "막는 쪽이 IPS, 알리는 쪽이 IDS" 를 가를 수 없다. 둘 다
        맞는 답인데 한쪽을 틀렸다고 하면 배우는 사람이 제 답을 의심하게 된다.

        그래서 먼저 적게 하고, 적은 뒤에야 기준을 편다. 기준을 먼저 보여
        주면 보고 베낀 것을 제 실력으로 착각한다.
      */}
      {!graded && self && !rubricOpen && (
        <Button
          className="mt-3 w-full"
          onClick={() => setRubricOpen(true)}
          disabled={value.trim().length === 0}
        >
          <Eye size={16} />
          {value.trim().length === 0 ? "적고 나서 기준을 폅니다" : "채점 기준 펴기"}
        </Button>
      )}

      {!graded && self && rubricOpen && (
        <div className="mt-3 rounded-2xl border border-indigo-400/25 bg-indigo-500/[0.08] p-3.5">
          <p className="text-[12px] font-bold text-indigo-200">모범 답안</p>
          <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-100">
            {q.answers[0]}
          </p>

          {q.rubric && q.rubric.length > 0 && (
            <>
              <p className="mt-3 text-[12px] font-bold text-indigo-200">
                이 가운데 몇 가지를 담았습니까
              </p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {q.rubric.map((r) => (
                  <li
                    key={r}
                    className="flex gap-2 text-[12.5px] leading-relaxed text-zinc-200"
                  >
                    <span aria-hidden className="text-indigo-300">
                      ·
                    </span>
                    <span className="min-w-0 flex-1">{r}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-400">
            문장이 같을 필요는 없습니다. 담아야 할 것을 담았는지만 보세요.
          </p>

          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onGrade({ judgement: "correct" }, false)}
            >
              다 담았다
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onGrade({ judgement: "half" }, false)}
            >
              반쯤
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onGrade({ judgement: "wrong" }, false)}
            >
              못 담았다
            </Button>
          </div>
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
            result.judgement === "correct" && !peeked
              ? "border-emerald-400/30 bg-emerald-500/10"
              : result.judgement === "half"
                ? "border-amber-400/30 bg-amber-500/10"
                : "border-rose-400/30 bg-rose-500/10",
          )}
        >
          {/*
            답을 보고 적었으면 맞은 것으로 세지 않는다.
            화면이 "모르겠어요" 아래에 그렇게 적어 두고서 점수를 주고 있었다 —
            앱이 한 말과 한 일이 달랐다. 손이 기억하는지를 보는 것이 실기다.
          */}
          <div className="flex items-center gap-1.5">
            {result.judgement === "correct" && !peeked ? (
              <Check size={14} className="text-emerald-300" />
            ) : result.judgement === "half" ? (
              <Minus size={14} className="text-amber-300" />
            ) : (
              <X size={14} className="text-rose-300" />
            )}
            <span
              className={cn(
                "text-[12px] font-bold",
                result.judgement === "correct" && !peeked
                  ? "text-emerald-200"
                  : result.judgement === "half"
                    ? "text-amber-200"
                    : "text-rose-200",
              )}
            >
              {result.judgement === "half"
                ? showPoints
                  ? "반쯤 담았습니다 · 0점"
                  : "반쯤 담았습니다"
                : result.judgement === "correct"
                ? peeked
                  ? showPoints
                    ? "답을 보고 적었습니다 · 0점"
                    : "답을 보고 적었습니다"
                  : showPoints
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
          {result.judgement === "correct" && peeked && (
            <p className="mt-2 text-[12px] leading-relaxed text-amber-200">
              글자는 맞습니다. 다만 보고 적은 것이므로 점수로 세지 않고, 이
              문항은 복습 목록에 남겨 둡니다.
            </p>
          )}

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
