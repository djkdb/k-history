"use client";

import { useEffect } from "react";
import { animate, stagger } from "animejs";
import type { CompareSpec } from "@/lib/types";
import { InfographicFrame } from "./frame";
import { useInViewAnime } from "./use-in-view-anime";

/**
 * 비교표 — 헷갈리는 두 개념이 좌우에서 마주 보며 들어온다.
 * 시험에서 틀리는 지점은 대부분 "둘 중 어느 쪽이었나"이므로,
 * 공간적으로 좌/우를 갈라 놓으면 기억에 위치 단서가 생긴다.
 */
export function CompareGraphic({
  spec,
  color,
}: {
  spec: CompareSpec;
  color: string;
}) {
  const { ref, play, replay } = useInViewAnime<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el || play === 0) return;
    animate(el.querySelectorAll("[data-left]"), {
      opacity: [0, 1],
      translateX: [-22, 0],
      duration: 480,
      delay: stagger(80),
      ease: "outQuart",
    });
    animate(el.querySelectorAll("[data-right]"), {
      opacity: [0, 1],
      translateX: [22, 0],
      duration: 480,
      delay: stagger(80),
      ease: "outQuart",
    });
    animate(el.querySelectorAll("[data-vs]"), {
      opacity: [0, 1],
      scale: [0.4, 1],
      rotate: [-25, 0],
      duration: 560,
      delay: 320,
      ease: "outBack",
    });
  }, [play, ref]);

  const columns: {
    side: "left" | "right";
    data: CompareSpec["left"];
    accent: string;
  }[] = [
    { side: "left", data: spec.left, accent: color },
    { side: "right", data: spec.right, accent: "#f97316" },
  ];

  return (
    <InfographicFrame title={spec.title} color={color} onReplay={replay}>
      <div ref={ref} className="relative grid grid-cols-2 gap-2">
        {columns.map(({ side, data, accent }) => (
          <div
            key={side}
            className="rounded-xl border p-2.5"
            style={{
              background: `color-mix(in srgb, ${accent} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${accent} 32%, transparent)`,
            }}
          >
            <p
              {...{ [`data-${side}`]: true }}
              style={{ opacity: 1, color: accent }}
              className="mb-1.5 text-xs font-black leading-tight"
            >
              {data.title}
            </p>
            <ul className="flex flex-col gap-1">
              {data.items.map((item) => (
                <li
                  key={item}
                  {...{ [`data-${side}`]: true }}
                  style={{ opacity: 1 }}
                  className="flex gap-1 text-[11px] leading-snug text-zinc-300"
                >
                  <span style={{ color: accent }}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 가운데 VS 배지 */}
        <span
          data-vs
          style={{ opacity: 1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-zinc-900 px-2 py-0.5 text-[10px] font-black text-zinc-400"
        >
          VS
        </span>
      </div>
    </InfographicFrame>
  );
}
