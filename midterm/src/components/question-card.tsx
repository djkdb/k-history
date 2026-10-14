"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, Dices, Eye, FileText, Star, X } from "lucide-react";
import type { Conf, Question } from "@/lib/types";
import { answerText, isCorrect, SELF_NO, SELF_OK, type Response } from "@/lib/grade";
import { CONCEPT_MAP } from "@/lib/course";
import { cn } from "@/lib/utils";
import { seededShuffle } from "@/lib/quiz";
import { useApp } from "@/lib/store";
import { Button, RichText, SqlBlock } from "./ui";

/**
 * 문제 한 장.
 *
 *   mode="practice" — 고르면 바로 채점하고 해설을 보인다 (퀴즈·복습)
 *   mode="exam"     — 고른 것만 표시한다. 채점은 끝에 한꺼번에 (모의고사)
 *
 * 적기 문제는 제출 단추를 따로 둔다. 한 글자 칠 때마다 채점하면 쓰다 만
 * 답이 "틀렸습니다" 로 찍힌다.
 *
 * askConf 를 켜면 답을 고른 뒤 채점 전에 "얼마나 자신 있나" 를 묻는다.
 * 확신했는데 틀린 답은 해설을 보면 오히려 잘 고쳐지지만(과잉교정 효과)
 * 며칠 뒤 옛 답이 되살아나기 쉽다 — 그래서 따로 모아 다시 묻는다.
 * 찍어서 맞힌 것도 아는 것으로 치지 않는다.
 *
 * 글쇠: 1~5 보기 · O/X · (자신감) 1 확신 2 반반 3 찍음
 */

const CONFS: { id: Conf; label: string; cls: string }[] = [
  { id: "sure", label: "확신해요", cls: "border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/10" },
  { id: "half", label: "반반", cls: "border-amber-400/40 text-amber-100 hover:bg-amber-500/10" },
  { id: "guess", label: "찍었어요", cls: "border-white/15 text-zinc-300 hover:bg-white/[0.06]" },
];
export function QuestionCard({
  q,
  mode,
  response,
  onRespond,
  index,
  total,
  seed = 0,
  askConf = false,
}: {
  q: Question;
  mode: "practice" | "exam";
  /** 이미 낸 답 (모의고사에서 앞 문제로 돌아왔을 때) */
  response?: Response;
  onRespond: (r: Response, correct: boolean, conf?: Conf) => void;
  index?: number;
  total?: number;
  /**
   * 보기를 섞는 씨앗. 같은 판(퀴즈 한 번, 모의고사 한 회) 안에서는 같아야
   * 앞 문제로 돌아와도 보기 순서가 그대로다.
   */
  seed?: number;
  /** (연습) 채점 전에 자신감을 묻는다 */
  askConf?: boolean;
}) {
  const [picked, setPicked] = useState<Response | undefined>(response);
  /** 골랐지만 아직 자신감을 고르지 않은 답 */
  const [pending, setPending] = useState<Response | undefined>(undefined);
  const [conf, setConf] = useState<Conf | undefined>(undefined);
  /** 서술 문항 — 모범 답안을 펼쳤는가 */
  const [revealed, setRevealed] = useState(false);
  const [text, setText] = useState(typeof response === "string" ? response : "");
  const shown = mode === "practice" && picked !== undefined;
  const right = shown && isCorrect(q, picked);
  const inputRef = useRef<HTMLInputElement>(null);
  const starred = useApp((s) => s.starred.includes(q.concept));
  const toggleStar = useApp((s) => s.toggleStar);

  useEffect(() => {
    setPicked(response);
    setText(typeof response === "string" ? response : "");
  }, [q.id, response]);
  // 자신감은 문제가 바뀔 때만 지운다 — 채점하면 response 가 바뀌어 위 효과가 다시 돈다
  useEffect(() => {
    setPending(undefined);
    setConf(undefined);
    setRevealed(false);
  }, [q.id]);

  const commit = (r: Response, c?: Conf) => {
    setPicked(r);
    setPending(undefined);
    setConf(c);
    onRespond(r, isCorrect(q, r), c);
  };

  const respond = (r: Response) => {
    if (mode === "exam") {
      setPicked(r);
      onRespond(r, isCorrect(q, r));
      return;
    }
    if (picked !== undefined) return;
    // 모르겠다고 한 것에는 자신감을 묻지 않는다
    if (askConf && r !== "") {
      setPending(r);
      inputRef.current?.blur();
      return;
    }
    commit(r);
  };

  const concept = CONCEPT_MAP[q.concept];
  /** 눈에 보이는 선택 — 채점된 답, 아니면 자신감을 기다리는 답 */
  const chosen = picked ?? pending;

  /*
   * 보기 순서를 섞는다.
   * 자료를 쓰다 보면 정답이 한 자리(예: 2번)에 몰린다. 그대로 내면 내용이
   * 아니라 자리를 외우게 된다. 고른 답은 원래 번호로 기록한다.
   */
  const order = useMemo(() => {
    if (q.kind !== "mc") return [];
    // 강의 PDF 퀴즈는 원문 보기 순서 그대로 — 해설과 주의 글이 ①②③④ 번호로 가리킨다
    if (q.src === "pdf") return q.options.map((_, i) => i);
    let h = seed >>> 0;
    for (const ch of q.id) h = (Math.imul(h ^ ch.charCodeAt(0), 2654435761) >>> 0);
    return seededShuffle(q.options.map((_, i) => i), h || 1);
  }, [q, seed]);

  // 글쇠로 고르기 — 적는 칸에 있을 때는 건드리지 않는다
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (mode === "practice" && picked !== undefined) return;
      const k = e.key.toLowerCase();
      if (mode === "practice" && pending !== undefined) {
        const c = ({ "1": "sure", "2": "half", "3": "guess" } as Record<string, Conf>)[k];
        if (c) {
          e.preventDefault();
          commit(pending, c);
          return;
        }
      }
      if (q.kind === "open" && mode === "practice") {
        if (!revealed && (k === "enter" || k === " ")) {
          e.preventDefault();
          setRevealed(true);
        } else if (revealed && (k === "1" || k === "2")) {
          e.preventDefault();
          commit(k === "1" ? SELF_OK : SELF_NO);
        }
        return;
      }
      if (q.kind === "mc") {
        const n = Number(k);
        if (n >= 1 && n <= order.length) {
          e.preventDefault();
          respond(order[n - 1]);
        }
      } else if (q.kind === "ox") {
        if (k === "o" || (k === "1" && pending === undefined)) respond(true);
        else if (k === "x" || (k === "2" && pending === undefined)) respond(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div>
      {index !== undefined && total !== undefined && (
        <p className="truncate text-[12px] font-semibold text-zinc-500">
          {index + 1} / {total}
          {/* 모의고사에서는 어느 개념인지 감춘다 — 그 자체가 힌트다 */}
          {concept && mode === "practice" && <span className="ml-2">· {concept.en ?? concept.title}</span>}
        </p>
      )}
      {q.src === "pdf" && (
        <p className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-1.5 py-0.5 text-[11px] font-bold text-sky-200">
          <FileText size={11} /> 강의 퀴즈{q.page ? ` p.${q.page}` : ""} · 원문 그대로
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
            const isPick = chosen === i;
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
            const isPick = chosen === v;
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
              // 고친 답은 다시 제출해야 자신감을 묻는다
              if (pending !== undefined) setPending(undefined);
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
          {mode === "practice" && !shown && pending === undefined && (
            <Button type="submit" className="mt-2 w-full" disabled={!text.trim()}>
              {askConf ? "이 답으로" : "채점하기"}
            </Button>
          )}
        </form>
      )}

      {q.kind === "open" && (
        <div className="mt-4">
          {!revealed && !shown ? (
            <>
              <p className="text-[12.5px] leading-relaxed text-zinc-400">
                서술·계산 문제예요. 종이에 먼저 풀어 본 뒤 모범 답안과 비교해 스스로 채점하세요.
              </p>
              <Button className="mt-3 w-full" onClick={() => setRevealed(true)}>
                <Eye size={16} /> 모범 답안 보기
              </Button>
            </>
          ) : (
            <div className="rounded-2xl border border-sky-400/25 bg-sky-500/[0.06] p-4">
              <p className="text-[12px] font-bold text-sky-200">모범 답안</p>
              <p className="mt-1.5 whitespace-pre-line text-[14px] font-semibold leading-relaxed text-zinc-100">
                <RichText>{q.answer}</RichText>
              </p>
            </div>
          )}
          {revealed && !shown && mode === "practice" && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => commit(SELF_NO)}>
                <X size={16} /> 틀렸어요
                <span className="ml-1 hidden text-[10.5px] opacity-50 [@media(pointer:fine)]:inline">2</span>
              </Button>
              <Button onClick={() => commit(SELF_OK)}>
                <Check size={16} /> 맞혔어요
                <span className="ml-1 hidden text-[10.5px] opacity-50 [@media(pointer:fine)]:inline">1</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {mode === "practice" && !shown && pending !== undefined && (
        <div className="mt-4 rounded-2xl border border-indigo-400/30 bg-indigo-500/[0.06] p-3.5">
          <p className="text-[13px] font-semibold text-zinc-200">채점 전에 — 얼마나 자신 있어요?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CONFS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => commit(pending, c.id)}
                className={cn("rounded-xl border py-2.5 text-[13.5px] font-bold transition-colors", c.cls)}
              >
                {c.label}
                <span className="ml-1 hidden text-[10.5px] font-semibold opacity-50 [@media(pointer:fine)]:inline">{i + 1}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] text-zinc-500">
            {q.kind === "short" ? "답을 고치려면 위 칸을 다시 쓰세요" : "답을 바꾸려면 다른 보기를 누르세요"}
          </p>
        </div>
      )}

      {mode === "practice" && !shown && q.kind !== "open" && (
        <button
          type="button"
          onClick={() => commit("")}
          className="mt-2 w-full py-2 text-[12.5px] font-semibold text-zinc-500"
        >
          모르겠어요 — 답 보기
        </button>
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
            <button
              type="button"
              onClick={() => toggleStar(q.concept)}
              aria-pressed={starred}
              className={cn(
                "ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-semibold",
                starred ? "bg-amber-400/15 text-amber-200" : "bg-white/5 text-zinc-400",
              )}
            >
              <Star size={12} className={starred ? "fill-current" : ""} /> {starred ? "별표함" : "개념 별표"}
            </button>
          </p>
          {!right && conf === "sure" && (
            <p className="mt-2 flex gap-2 rounded-xl bg-rose-500/10 px-3 py-2 text-[12.5px] leading-relaxed text-rose-100">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-300" />
              <span>
                <b>확신했는데 틀렸어요.</b> 오답 노트에 넣었습니다 — 서로 다른 날 두 번 맞혀야 빠집니다. 내 답이 왜
                그럴듯해 보였는지 한 번 짚고 넘어가세요.
              </span>
            </p>
          )}
          {right && conf === "guess" && (
            <p className="mt-2 flex gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-[12.5px] leading-relaxed text-amber-100">
              <Dices size={14} className="mt-0.5 shrink-0 text-amber-300" />
              <span>
                <b>찍어서 맞혔어요.</b> 아는 것으로 치지 않고 다시 냅니다. 해설을 읽고 이유를 붙여 두세요.
              </span>
            </p>
          )}
          {!right && q.kind !== "open" && (
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
          {q.issue && (
            <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-[12.5px] leading-relaxed text-amber-100">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-300" />
              <span>
                <b>원문 문항 주의</b> — {q.issue}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
