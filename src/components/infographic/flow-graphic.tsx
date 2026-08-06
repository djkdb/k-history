"use client";

import { useEffect } from "react";
import { animate, stagger, svg } from "animejs";
import type { FlowSpec } from "@/lib/types";
import { InfographicFrame } from "./frame";
import { useInViewAnime } from "./use-in-view-anime";

/**
 * 흐름도 — 원인이 결과를 낳는 과정을 화살표가 그려지며 이어 준다.
 * "왜 그 일이 일어났는가"를 순서로 붙잡게 만든다.
 */
export function FlowGraphic({
  spec,
  color,
}: {
  spec: FlowSpec;
  color: string;
}) {
  const { ref, play, replay } = useInViewAnime<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el || play === 0) return;

    animate(el.querySelectorAll("[data-step]"), {
      opacity: [0, 1],
      translateY: [14, 0],
      scale: [0.94, 1],
      duration: 480,
      delay: stagger(320),
      ease: "outBack",
    });

    const arrows = el.querySelectorAll<SVGPathElement>("[data-arrow]");
    if (arrows.length) {
      animate(svg.createDrawable(arrows), {
        draw: ["0 0", "0 1"],
        duration: 300,
        delay: stagger(320, { start: 300 }),
        ease: "outQuad",
      });
    }
  }, [play, ref]);

  return (
    <InfographicFrame title={spec.title} color={color} onReplay={replay}>
      <div ref={ref} className="flex flex-col">
        {spec.steps.map((step, i) => (
          <div key={`${step.label}-${i}`}>
            <div
              data-step
              style={{
                opacity: 0,
                background: `color-mix(in srgb, ${color} ${i === spec.steps.length - 1 ? 22 : 10}%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} ${i === spec.steps.length - 1 ? 55 : 28}%, transparent)`,
              }}
              className="rounded-xl border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black"
                  style={{ background: color, color: "#0b0b0d" }}
                >
                  {i + 1}
                </span>
                <p className="text-xs font-bold leading-snug text-zinc-100">
                  {step.label}
                </p>
              </div>
              {step.note && (
                <p className="ml-6 mt-0.5 text-[10px] leading-relaxed text-zinc-400">
                  {step.note}
                </p>
              )}
            </div>

            {i < spec.steps.length - 1 && (
              <svg className="ml-4 h-5 w-4" viewBox="0 0 16 20">
                <path
                  data-arrow
                  d="M8 1 L8 14 M4 10 L8 15 L12 10"
                  fill="none"
                  stroke={color}
                  strokeOpacity="0.6"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </InfographicFrame>
  );
}
