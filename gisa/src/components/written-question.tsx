"use client";

import { Check, X } from "lucide-react";
import { SubjectBadge } from "@/components/ui";
import type { WrittenQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * 필기 한 문항.
 *
 * 고르기 전에는 아무 표시도 하지 않고, 고른 뒤에는 정답과 내가 고른 것을
 * 동시에 보여 준다. 틀린 선지에는 "왜 이것이 아닌가" 를 붙인다 — 정답만
 * 알려 주면 다음에 같은 함정에 또 걸린다.
 */
export function WrittenQuestionCard({
  q,
  index,
  total,
  picked,
  onPick,
  revealed,
  showSubject = true,
}: {
  q: WrittenQuestion;
  index?: number;
  total?: number;
  picked: number | null;
  onPick: (i: number) => void;
  revealed: boolean;
  showSubject?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {typeof index === "number" && (
          <span className="text-[12px] font-bold tabular-nums text-zinc-500">
            {index + 1}
            {typeof total === "number" && ` / ${total}`}
          </span>
        )}
        {showSubject && <SubjectBadge subject={q.subject} />}
      </div>

      <h2 className="mt-3 text-[16px] font-bold leading-relaxed">{q.question}</h2>

      {q.passage && (
        <pre className="sql-block sql-surface mt-3 overflow-x-auto rounded-xl border border-white/10 px-3.5 py-3 text-[12.5px] leading-[1.75] text-zinc-200">
          {q.passage}
        </pre>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answerIndex;
          const isMine = picked === i;
          const note = q.optionNotes?.[i];
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => onPick(i)}
              className={cn(
                "w-full rounded-2xl border px-3.5 py-3 text-left transition-all",
                !revealed &&
                  (isMine
                    ? "border-indigo-400/50 bg-indigo-500/15"
                    : "border-white/10 bg-white/5 active:scale-[0.99]"),
                revealed &&
                  isAnswer &&
                  "border-emerald-400/50 bg-emerald-500/15",
                revealed &&
                  isMine &&
                  !isAnswer &&
                  "border-rose-400/50 bg-rose-500/15",
                revealed && !isAnswer && !isMine && "border-white/10 bg-white/[0.03]",
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    revealed && isAnswer
                      ? "bg-emerald-400/25 text-emerald-200"
                      : revealed && isMine
                        ? "bg-rose-400/25 text-rose-200"
                        : "bg-white/10 text-zinc-400",
                  )}
                >
                  {revealed && isAnswer ? (
                    <Check size={12} />
                  ) : revealed && isMine ? (
                    <X size={12} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[14px] leading-relaxed",
                    revealed && !isAnswer && !isMine ? "text-zinc-500" : "text-zinc-200",
                  )}
                >
                  {opt}
                </span>
              </div>
              {revealed && note && !isAnswer && (
                <p className="mt-2 pl-[30px] text-[12px] leading-relaxed text-zinc-500">
                  {note}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <p className="text-[12px] font-bold text-indigo-200">해설</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
