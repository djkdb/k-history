"use client";

import { useEffect } from "react";
import { animate, stagger } from "animejs";
import type { PyramidSpec } from "@/lib/types";
import { InfographicFrame } from "./frame";
import { useInViewAnime } from "./use-in-view-anime";

/**
 * 신분 구조 피라미드 — 아래(다수)에서 위(소수)로 쌓여 올라간다.
 * 폭이 위로 갈수록 좁아지는 것 자체가 "소수가 지배한다"는 정보다.
 */
export function PyramidGraphic({
  spec,
  color,
}: {
  spec: PyramidSpec;
  color: string;
}) {
  const { ref, play, replay } = useInViewAnime<HTMLDivElement>();
  const n = spec.levels.length;

  useEffect(() => {
    const el = ref.current;
    if (!el || play === 0) return;
    // 아래에서 위로 쌓이는 순서 (DOM은 위→아래이므로 reverse)
    animate(el.querySelectorAll("[data-level]"), {
      opacity: [0, 1],
      translateY: [18, 0],
      scaleX: [0.72, 1],
      duration: 520,
      delay: stagger(120, { from: "last" }),
      ease: "outBack",
    });
  }, [play, ref]);

  return (
    <InfographicFrame title={spec.title} color={color} onReplay={replay}>
      <div ref={ref} className="flex flex-col items-center gap-1.5">
        {spec.levels.map((level, i) => {
          // 위로 갈수록 좁게 (최상위 46% → 최하위 100%)
          const width = 46 + (54 * i) / Math.max(1, n - 1);
          const opacity = 0.9 - i * (0.45 / Math.max(1, n - 1));
          return (
            <div
              key={level.label}
              data-level
              style={{ width: `${width}%`, opacity: 1 }}
              className="rounded-lg px-3 py-2 text-center"
            >
              <div
                className="rounded-lg px-2 py-2"
                style={{
                  background: `color-mix(in srgb, ${color} ${Math.round(opacity * 30)}%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} ${Math.round(opacity * 55)}%, transparent)`,
                }}
              >
                <p className="text-xs font-bold text-white">{level.label}</p>
                {level.desc && (
                  <p className="mt-0.5 text-[10px] leading-tight text-zinc-400">
                    {level.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </InfographicFrame>
  );
}
