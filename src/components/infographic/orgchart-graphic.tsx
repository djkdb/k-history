"use client";

import { useEffect } from "react";
import { animate, stagger, svg } from "animejs";
import type { OrgChartSpec } from "@/lib/types";
import { InfographicFrame } from "./frame";
import { useInViewAnime } from "./use-in-view-anime";

/**
 * 조직도 — 연결선이 먼저 그려지고(anime.js svg.createDrawable),
 * 그 뒤 기구 노드가 튀어나온다. "위에서 아래로 명령이 내려간다"는 구조를 눈으로 본다.
 */
export function OrgChartGraphic({
  spec,
  color,
}: {
  spec: OrgChartSpec;
  color: string;
}) {
  const { ref, play, replay } = useInViewAnime<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el || play === 0) return;

    animate(el.querySelectorAll("[data-root]"), {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 460,
      ease: "outBack",
    });

    const paths = el.querySelectorAll<SVGPathElement>("[data-link]");
    if (paths.length) {
      animate(svg.createDrawable(paths), {
        draw: ["0 0", "0 1"],
        duration: 560,
        delay: stagger(70, { start: 320 }),
        ease: "outQuart",
      });
    }

    animate(el.querySelectorAll("[data-branch]"), {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 460,
      delay: stagger(90, { start: 640 }),
      ease: "outBack",
    });

    animate(el.querySelectorAll("[data-child]"), {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 340,
      delay: stagger(45, { start: 900 }),
      ease: "outQuad",
    });
  }, [play, ref]);

  const cols = spec.branches.length;

  return (
    <InfographicFrame title={spec.title} color={color} onReplay={replay}>
      <div ref={ref}>
        {/* 최상위 */}
        <div className="flex justify-center">
          <div
            data-root
            style={{
              opacity: 0,
              background: `color-mix(in srgb, ${color} 26%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 60%, transparent)`,
            }}
            className="rounded-xl border px-4 py-2 text-sm font-bold text-white"
          >
            {spec.root}
          </div>
        </div>

        {/* 연결선 */}
        <svg
          viewBox={`0 0 ${cols * 100} 40`}
          className="h-8 w-full"
          preserveAspectRatio="none"
        >
          {spec.branches.map((_, i) => {
            const x = i * 100 + 50;
            const mid = (cols * 100) / 2;
            return (
              <path
                key={i}
                data-link
                d={`M ${mid} 0 L ${mid} 16 L ${x} 16 L ${x} 40`}
                fill="none"
                stroke={color}
                strokeOpacity="0.5"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* 하위 기구 */}
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {spec.branches.map((b) => (
            <div key={b.label} data-branch style={{ opacity: 0 }}>
              <div
                className="rounded-lg border px-1.5 py-1.5 text-center"
                style={{
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  borderColor: `color-mix(in srgb, ${color} 34%, transparent)`,
                }}
              >
                <p className="text-[11px] font-bold leading-tight text-zinc-100">
                  {b.label}
                </p>
              </div>
              {b.children && b.children.length > 0 && (
                <ul className="mt-1 flex flex-col gap-0.5">
                  {b.children.map((c) => (
                    <li
                      key={c}
                      data-child
                      style={{ opacity: 0 }}
                      className="rounded-md bg-white/5 px-1 py-0.5 text-center text-[9px] leading-tight text-zinc-400"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </InfographicFrame>
  );
}
