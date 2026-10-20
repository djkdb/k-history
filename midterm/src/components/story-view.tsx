"use client";

import { ArrowDown, MessageCircle } from "lucide-react";
import { parseStory, type StoryStep } from "@/lib/story";
import { ClozeCtx, RichText } from "./ui";

/**
 * 쉬운 설명 칸 — 예시 상황 하나를 위에서 아래로 따라간다.
 * 상황(그림 + 글) → 데이터 목록 → 강조 상자 → 결과 → 마무리 한 줄.
 */
export function StoryView({ src, className }: { src: string; className?: string }) {
  const s = parseStory(src);
  return (
    <section className={className} aria-label="쉬운 설명">
      <p className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-300">
        <MessageCircle size={14} /> 쉬운 설명
      </p>
      {/* 읽는 이야기라 가리고 떠올리기에서 뺀다 */}
      <ClozeCtx.Provider value={{ on: false, gen: 0 }}>
        <h3 className="mt-1.5 text-[17px] font-bold leading-snug tracking-tight text-zinc-100 lg:text-[18px]">
          <RichText>{s.title}</RichText>
        </h3>

        {(s.icon || s.scene.length > 0) && (
          <div className="mt-3 flex items-center gap-4">
            {s.icon && (
              <span
                className="grid h-[84px] w-[84px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-white/[0.09] to-white/[0.02] text-[46px] leading-none ring-1 ring-white/10"
                aria-hidden
              >
                {s.icon}
              </span>
            )}
            {s.scene.length > 0 && (
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-zinc-300">상황</p>
                {s.scene.map((l, i) => (
                  <p key={i} className="mt-0.5 text-[14.5px] leading-[1.7] text-zinc-200 lg:text-[15.5px]">
                    <RichText>{l}</RichText>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col items-stretch">
          {s.steps.map((st, i) => (
            <div key={i} className="flex flex-col items-stretch">
              {i > 0 && <ArrowDown size={15} className="mx-auto my-1.5 text-zinc-500" aria-hidden />}
              <Step st={st} />
            </div>
          ))}
        </div>

        {s.wrap.map((l, i) => (
          <p key={i} className="mt-4 text-[14.5px] leading-[1.75] text-zinc-200 lg:text-[15.5px]">
            <RichText>{l}</RichText>
          </p>
        ))}
      </ClozeCtx.Provider>
    </section>
  );
}

function Step({ st }: { st: StoryStep }) {
  if (st.kind === "list")
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        {st.label && <p className="text-[12.5px] text-zinc-400">{st.label}</p>}
        <ul className="mt-1 divide-y divide-white/[0.07]">
          {st.rows.map(([a, b], i) => (
            <li key={i} className="flex items-baseline justify-between gap-3 py-2.5 text-[14.5px] lg:text-[15px]">
              <span className={b ? "min-w-0 text-zinc-200" : "min-w-0 text-zinc-100"}>
                <RichText>{a}</RichText>
              </span>
              {b && (
                <span className="shrink-0 text-right font-bold text-zinc-100">
                  <RichText>{b}</RichText>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  if (st.kind === "box")
    return (
      <div className="rounded-2xl bg-sky-500/[0.13] px-4 py-3.5 text-center ring-1 ring-sky-400/20">
        <p className="text-[16px] font-bold text-sky-200">
          <RichText>{st.title}</RichText>
        </p>
        {st.sub && (
          <p className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-sky-100/80">
            <RichText>{st.sub}</RichText>
          </p>
        )}
      </div>
    );
  if (st.kind === "result")
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-center">
        {st.label && (
          <p className="text-[14px] font-bold text-zinc-200">
            <RichText>{st.label}</RichText>
          </p>
        )}
        <p className="mt-0.5 text-[19px] font-black text-emerald-300 lg:text-[20px]">
          <RichText>{st.value}</RichText>
        </p>
      </div>
    );
  return (
    <p className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-center text-[14px] leading-relaxed text-zinc-200">
      <RichText>{st.text}</RichText>
    </p>
  );
}
