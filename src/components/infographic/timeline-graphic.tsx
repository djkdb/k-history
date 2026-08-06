"use client";

import { useEffect } from "react";
import { animate, stagger } from "animejs";
import type { TimelineSpec } from "@/lib/types";
import { InfographicFrame } from "./frame";
import { useInViewAnime } from "./use-in-view-anime";

/**
 * 연표 — 시간축을 따라 선이 그려지고 노드가 순차적으로 팝업된다.
 * anime.js의 stagger로 "시간이 흐르는" 감각을 만든다.
 */
export function TimelineGraphic({
  spec,
  color,
}: {
  spec: TimelineSpec;
  color: string;
}) {
  const { ref, play, replay } = useInViewAnime<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el || play === 0) return;

    const line = el.querySelector<SVGLineElement>("[data-axis]");
    if (line) {
      animate(line, {
        scaleY: [0, 1],
        duration: 700,
        ease: "outQuart",
      });
    }
    animate(el.querySelectorAll("[data-node]"), {
      opacity: [0, 1],
      translateX: [-14, 0],
      scale: [0.85, 1],
      duration: 520,
      delay: stagger(110, { start: 260 }),
      ease: "outBack",
    });
    animate(el.querySelectorAll("[data-dot]"), {
      scale: [0, 1],
      duration: 380,
      delay: stagger(110, { start: 260 }),
      ease: "outBack",
    });
  }, [play, ref]);

  return (
    <InfographicFrame title={spec.title} color={color} onReplay={replay}>
      <div ref={ref} className="relative pl-6">
        {/* 시간축 */}
        <svg
          className="absolute left-[5px] top-1 h-[calc(100%-0.5rem)] w-px overflow-visible"
          preserveAspectRatio="none"
        >
          <line
            data-axis
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="100%"
            stroke={color}
            strokeOpacity="0.35"
            strokeWidth="1.5"
            style={{ transformOrigin: "top" }}
          />
        </svg>

        <ol className="flex flex-col gap-3">
          {spec.items.map((item, i) => (
            <li key={`${item.year}-${i}`} className="relative">
              <span
                data-dot
                className="absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#0e0e11]"
                style={{
                  background: item.highlight ? color : "#3f3f46",
                  boxShadow: item.highlight ? `0 0 10px ${color}` : undefined,
                }}
              />
              <div data-node style={{ opacity: 1 }}>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{ color: item.highlight ? color : "#a1a1aa" }}
                  >
                    {item.year}
                  </span>
                  <span
                    className={
                      item.highlight
                        ? "text-sm font-bold text-white"
                        : "text-sm font-medium text-zinc-400"
                    }
                  >
                    {item.label}
                  </span>
                </div>
                {item.note && (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                    {item.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </InfographicFrame>
  );
}
