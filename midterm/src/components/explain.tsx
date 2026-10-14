"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { RichText } from "./ui";

/*
 * 수식 — $…$ 는 글 사이, $$…$$ 는 따로 한 줄.
 * KaTeX 는 수식이 처음 보일 때 불러온다. 그 전에는 원래 글자를 잠깐 보여 준다.
 */
let loader: Promise<typeof import("@/lib/tex")> | null = null;
const cache = new Map<string, string>();

function Tex({ tex, display }: { tex: string; display?: boolean }) {
  const key = `${display ? "D" : "I"}${tex}`;
  const [html, setHtml] = useState<string | null>(() => cache.get(key) ?? null);
  useEffect(() => {
    if (html !== null) return;
    let alive = true;
    (loader ??= import("@/lib/tex"))
      .then((m) => {
        const h = m.renderTex(tex, !!display);
        cache.set(key, h);
        if (alive) setHtml(h);
      })
      .catch(() => {
        // 못 불러오면(망이 끊긴 첫 방문 등) 원래 글자를 그대로 두고, 다음에 다시 시도한다
        loader = null;
      });
    return () => {
      alive = false;
    };
  }, [html, key, tex, display]);
  if (html === null) return <code className="font-mono text-[0.92em] opacity-80">{tex}</code>;
  return display ? (
    <span className="tex-block" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className="tex-inline" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

const MATH = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;

/** 글 + 수식 + **굵게** + `코드`. math 가 꺼져 있으면 $ 를 그냥 글자로 둔다 (다른 과목 글에 $ 가 있을 수 있다) */
export function MathText({ children, math = true }: { children: string; math?: boolean }) {
  if (!math || !children.includes("$")) return <RichText>{children}</RichText>;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MATH.lastIndex = 0;
  while ((m = MATH.exec(children))) {
    if (m.index > last) out.push(<RichText key={`t${last}`}>{children.slice(last, m.index)}</RichText>);
    out.push(<Tex key={`m${m.index}`} tex={(m[1] ?? m[2]).trim()} display={m[1] !== undefined} />);
    last = m.index + m[0].length;
  }
  if (last < children.length) out.push(<RichText key={`t${last}`}>{children.slice(last)}</RichText>);
  return <>{out}</>;
}

/**
 * 해설.
 *   rich 가 아니면 예전처럼 한 문단.
 *   rich 이면 줄머리 표시를 읽는다:
 *     ### 소제목   == 정답 줄   !! 기억할 점   - 목록   $$수식$$ (한 줄 전체)
 */
export function Explain({ text, rich, className }: { text: string; rich?: boolean; className?: string }) {
  if (!rich) {
    return (
      <p className={className ?? "text-[13.5px] leading-relaxed text-zinc-300"}>
        <RichText>{text}</RichText>
      </p>
    );
  }
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: number) => {
    if (!list.length) return;
    const items = list;
    list = [];
    blocks.push(
      <ul key={`l${k}`} className="mt-1.5 flex flex-col gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
            <span className="min-w-0">
              <MathText>{it}</MathText>
            </span>
          </li>
        ))}
      </ul>,
    );
  };
  text.split("\n").forEach((raw, k) => {
    const line = raw.trimEnd();
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flush(k);
    if (!line.trim()) return;
    if (line.startsWith("### ")) {
      blocks.push(
        <p key={k} className="mt-3 text-[12px] font-bold tracking-tight text-indigo-200 first:mt-0">
          {line.slice(4)}
        </p>,
      );
    } else if (line.startsWith("== ")) {
      blocks.push(
        <p key={k} className="mt-2 flex gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-50">
          <CheckCircle2 size={15} className="mt-[3px] shrink-0 text-emerald-300" />
          <span className="min-w-0">
            <MathText>{line.slice(3)}</MathText>
          </span>
        </p>,
      );
    } else if (line.startsWith("!! ")) {
      blocks.push(
        <p key={k} className="mt-2.5 flex gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-amber-50">
          <Lightbulb size={15} className="mt-[3px] shrink-0 text-amber-300" />
          <span className="min-w-0">
            <MathText>{line.slice(3)}</MathText>
          </span>
        </p>,
      );
    } else if (/^\$\$[\s\S]+\$\$$/.test(line.trim())) {
      blocks.push(
        <div key={k} className="my-1.5 overflow-x-auto">
          <Tex tex={line.trim().slice(2, -2).trim()} display />
        </div>,
      );
    } else {
      blocks.push(
        <p key={k} className="mt-1">
          <MathText>{line}</MathText>
        </p>,
      );
    }
  });
  flush(-1);
  return (
    <div className={className ?? "text-[13.5px] leading-relaxed text-zinc-300"}>
      {blocks.map((b, i) => (
        <Fragment key={i}>{b}</Fragment>
      ))}
    </div>
  );
}
