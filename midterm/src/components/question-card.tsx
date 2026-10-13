"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { Question } from "@/lib/types";
import { answerText, isCorrect, type Response } from "@/lib/grade";
import { CONCEPT_MAP } from "@/lib/course";
import { cn } from "@/lib/utils";
import { seededShuffle } from "@/lib/quiz";
import { Button, RichText, SqlBlock } from "./ui";

/**
 * 문제 한 장.
 *
 *   mode="practice" — 고르면 바로 채점하고 해설을 보인다 (퀴즈·복습)
 *   mode="exam"     — 고른 것만 표시한다. 채점은 끝에 한꺼번에 (모의고사)
 *
 * 적기 문제는 제출 단추를 따로 둔다. 한 글자 칠 때마다 채점하면 쓰다 만
 * 답이 "틀렸습니다" 로 찍힌다.
 */
export function QuestionCard({
  q,
  mode,
  response,
  onRespond,
  index,
  total,
  seed = 0,
}: {
  q: Question;
  mode: "practice" | "exam";
  /** 이미 낸 답 (모의고사에서 앞 문제로 돌아왔을 때) */
  response?: Response;
  onRespond: (r: Response, correct: boolean) => void;
  index?: number;
  total?: number;
  /**
   * 보기를 섞는 씨앗. 같은 판(퀴즈 한 번, 모의고사 한 회) 안에서는 같아야
   * 앞 문제로 돌아와도 보기 순서가 그대로다.
   */
  seed?: number;
}) {
  const [picked, setPicked] = useState<Response | undefined>(response);
  const [text, setText] = useState(typeof response === "string" ? response : "");
  const shown = mode === "practice" && picked !== undefined;
  const right = shown && isCorrect(q, picked);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPicked(response);
    setText(typeof response === "string" ? response : "");
  }, [q.id, response]);

  const respond = (r: Response) => {
    if (mode === "practice" && picked !== undefined) return;
    setPicked(r);
    onRespond(r, isCorrect(q, r));
  };

  const concept = CONCEPT_MAP[q.concept];

  /*
   * 보기 순서를 섞는다.
   * 자료를 쓰다 보면 정답이 한 자리(예: 2번)에 몰린다. 그대로 내면 내용이
   * 아니라 자리를 외우게 된다. 고른 답은 원래 번호로 기록한다.
   */
  const order = useMemo(() => {
    if (q.kind !== "mc") return [];
    let h = seed >>> 0;
    for (const ch of q.id) h = (Math.imul(h ^ ch.charCodeAt(0), 2654435761) >>> 0);
    return seededShuffle(q.options.map((_, i) => i), h || 1);
  }, [q, seed]);

  return (
    <div>
      {index !== undefined && total !== undefined && (
        <p className="truncate text-[12px] font-semibold text-zinc-500">
          {index + 1} / {total}
          {/* 모의고사에서는 어느 개념인지 감춘다 — 그 자체가 힌트다 */}
          {concept && mode === "practice" && <span className="ml-2">· {concept.en ?? concept.title}</span>}
        </p>
      )}
      <p className="mt-2 whitespace-pre-line text-[16px] font-bold leading-relaxed text-zinc-100">
        <RichText>{q.q}</RichText>
      </p>
      {q.code && <SqlBlock className="mt-3">{q.code}</SqlBlock>}

      {q.kind === "mc" && (
        <div className="mt-4 flex flex-col gap-2">
          {order.map((i, pos) => {
            const o = q.options[i];
            const isPick = picked === i;
            const isAns = shown && i === q.answer;
            const isBad = shown && isPick && i !== q.answer;
            return (
              <button
                key={i}
                type="button"
                disabled={mode === "practice" && shown}
                onClick={() => respond(i)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-[14px] leading-relaxed transition-colors",
                  isAns
                    ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-50"
                    : isBad
                      ? "border-rose-400/50 bg-rose-500/10 text-rose-50"
                      : isPick
                        ? "border-indigo-400/60 bg-indigo-500/15 text-zinc-100"
                        : "border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06]",
                )}
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
                  {pos + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <RichText>{o}</RichText>
                </span>
                {isAns && <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" />}
                {isBad && <X size={16} className="mt-0.5 shrink-0 text-rose-300" />}
              </button>
            );
          })}
        </div>
      )}

      {q.kind === "ox" && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {([true, false] as const).map((v) => {
            const isPick = picked === v;
            const isAns = shown && v === q.answer;
            const isBad = shown && isPick && v !== q.answer;
            return (
              <button
                key={String(v)}
                type="button"
                disabled={mode === "practice" && shown}
                onClick={() => respond(v)}
                className={cn(
                  "rounded-xl border py-4 text-[22px] font-black transition-colors",
                  isAns
                    ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
                    : isBad
                      ? "border-rose-400/50 bg-rose-500/10 text-rose-200"
                      : isPick
                        ? "border-indigo-400/60 bg-indigo-500/15 text-indigo-100"
                        : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]",
                )}
                aria-label={v ? "맞다" : "틀리다"}
              >
                {v ? "O" : "X"}
              </button>
            );
          })}
        </div>
      )}

      {q.kind === "short" && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) respond(text.trim());
          }}
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // 모의고사에서는 적는 대로 답안지에 옮겨 둔다 (제출을 잊어도 남게)
              if (mode === "exam") {
                setPicked(e.target.value);
                onRespond(e.target.value, isCorrect(q, e.target.value));
              }
            }}
            disabled={mode === "practice" && shown}
            placeholder={q.hint ?? "답을 적으세요"}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[15px] text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-indigo-400/60"
          />
          {mode === "practice" && !shown && (
            <Button type="submit" className="mt-2 w-full" disabled={!text.trim()}>
              채점하기
            </Button>
          )}
          {mode === "practice" && !shown && (
            <button
              type="button"
              onClick={() => respond("")}
              className="mt-2 w-full py-2 text-[12.5px] font-semibold text-zinc-500"
            >
              모르겠어요 — 답 보기
            </button>
          )}
        </form>
      )}

      {shown && (
        <div
          className={cn(
            "mt-4 rounded-2xl border p-4",
            right ? "border-emerald-400/30 bg-emerald-500/[0.07]" : "border-rose-400/30 bg-rose-500/[0.07]",
          )}
        >
          <p className={cn("flex items-center gap-1.5 text-[14px] font-bold", right ? "text-emerald-200" : "text-rose-200")}>
            {right ? <Check size={16} /> : <X size={16} />}
            {right ? "맞았습니다" : "틀렸습니다"}
          </p>
          {!right && (
            <p className="mt-2 text-[13.5px] text-zinc-200">
              정답 <b className="text-zinc-50">{answerText(q)}</b>
              {q.kind === "short" && q.answers.length > 1 && (
                <span className="block text-[12px] text-zinc-400">
                  이렇게 적어도 맞습니다: {q.answers.slice(1).join(" · ")}
                </span>
              )}
            </p>
          )}
          <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-300">
            <RichText>{q.explain}</RichText>
          </p>
        </div>
      )}
    </div>
  );
}
