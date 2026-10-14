"use client";

import { CIRCLED, easyIcon } from "@/lib/easy-icon";
import { splitSentences } from "@/lib/sentences";
import { RichText } from "./ui";

/** 쉽게 말하면 — 문장마다 한 줄, 앞에 그 문장이 하는 일을 알리는 그림 글자 (lib/easy-icon) */
export function EasyText({ children, size = "text-[14px] lg:text-[15px]" }: { children: string; size?: string }) {
  const parts = splitSentences(children)
    .flatMap((p) => p.split("\n"))
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <ul className={`flex flex-col gap-2 leading-[1.75] text-zinc-200 ${size}`}>
      {parts.map((p, i) => {
        const m = p.match(CIRCLED);
        const icon = m ? m[1] : easyIcon(p);
        const body = m ? p.slice(m[0].length) : p;
        return (
          <li key={i} className="flex gap-2.5">
            <span
              aria-hidden
              className={m ? "mt-[1px] w-6 shrink-0 text-center font-bold text-emerald-300" : "w-6 shrink-0 text-center"}
            >
              {icon}
            </span>
            <span className="min-w-0">
              <RichText>{body}</RichText>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
