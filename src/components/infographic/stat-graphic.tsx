"use client";

import { useEffect } from "react";
import { animate, stagger, utils } from "animejs";
import type { StatSpec } from "@/lib/types";
import { InfographicFrame } from "./frame";
import { useInViewAnime } from "./use-in-view-anime";

/**
 * 수치 — 숫자가 0에서 올라가며 규모를 체감시킨다.
 * "113만 대군", "45일 농성" 같은 수치는 글로 읽으면 스쳐가지만
 * 카운트업으로 보면 크기가 감각으로 남는다.
 */
export function StatGraphic({
  spec,
  color,
}: {
  spec: StatSpec;
  color: string;
}) {
  const { ref, play, replay } = useInViewAnime<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el || play === 0) return;

    animate(el.querySelectorAll("[data-stat]"), {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 460,
      delay: stagger(120),
      ease: "outQuart",
    });

    el.querySelectorAll<HTMLElement>("[data-count]").forEach((node, i) => {
      const target = Number(node.dataset.count ?? 0);
      const obj = { v: 0 };
      animate(obj, {
        v: target,
        duration: 1400,
        delay: 200 + i * 120,
        ease: "outQuart",
        onUpdate: () => {
          node.textContent = utils.round(obj.v, 0).toLocaleString("ko-KR");
        },
      });
    });
  }, [play, ref]);

  return (
    <InfographicFrame title={spec.title} color={color} onReplay={replay}>
      <div
        ref={ref}
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${Math.min(spec.items.length, 3)}, minmax(0, 1fr))`,
        }}
      >
        {spec.items.map((item) => (
          <div
            key={item.label}
            data-stat
            style={{
              opacity: 0,
              background: `color-mix(in srgb, ${color} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
            }}
            className="rounded-xl border px-2 py-2.5 text-center"
          >
            <p className="text-[10px] text-zinc-400">{item.label}</p>
            <p className="mt-0.5 text-xl font-black tabular-nums" style={{ color }}>
              <span data-count={item.value}>0</span>
              {item.suffix && (
                <span className="text-xs font-bold"> {item.suffix}</span>
              )}
            </p>
            {item.note && (
              <p className="mt-0.5 text-[9px] leading-tight text-zinc-500">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </InfographicFrame>
  );
}
