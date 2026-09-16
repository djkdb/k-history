"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, ListChecks } from "lucide-react";
import { Card } from "@/components/ui";
import { useApp } from "@/lib/store";
import { allDone, buildToday } from "@/lib/today";
import { cn } from "@/lib/utils";

/**
 * 오늘 할 일.
 *
 * 앱을 열면 갈 곳이 열 군데쯤 된다. 무엇부터 할지 정하는 데 드는 힘이
 * 실제 공부보다 클 때가 있다 — 특히 지쳐 있을 때. 서너 줄로 먼저 정해
 * 준다. 다 하면 다 했다고 말해 준다. 그것이 다음 날 다시 여는 이유가 된다.
 */
export function TodayPlan() {
  const settings = useApp((s) => s.settings);
  const studiedIds = useApp((s) => s.studiedIds);
  const studiedAt = useApp((s) => s.studiedAt);
  const reviewCards = useApp((s) => s.reviewCards);
  const quizHistory = useApp((s) => s.quizHistory);
  const questionMisses = useApp((s) => s.questionMisses);

  const todos = useMemo(
    () =>
      buildToday({
        settings,
        studiedIds,
        studiedAt,
        reviewCards,
        quizHistory,
        questionMisses,
      }),
    [settings, studiedIds, studiedAt, reviewCards, quizHistory, questionMisses],
  );
  const 끝 = allDone(todos);

  if (todos.length === 0) return null;

  return (
    <Card className={cn("mt-3", 끝 && "border-emerald-400/30 bg-emerald-500/[0.07]")}>
      <div className="flex items-center gap-2">
        {끝 ? (
          <Check size={15} className="shrink-0 text-emerald-300" />
        ) : (
          <ListChecks size={15} className="shrink-0 text-indigo-300" />
        )}
        <h2 className="text-[13.5px] font-bold">
          {끝 ? "오늘 할 일을 다 했습니다" : "오늘 할 일"}
        </h2>
      </div>

      {끝 && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-emerald-200">
          더 해도 좋지만, 여기서 멈춰도 오늘 몫은 채웠습니다.
        </p>
      )}

      <ul className="mt-2.5 flex flex-col gap-1">
        {todos.map((t) => {
          const 잼 = typeof t.goal === "number";
          const 됨 = 잼 && (t.now ?? 0) >= t.goal!;
          return (
            <li key={t.id}>
              <Link
                href={t.href}
                className="-mx-1.5 flex items-center gap-2.5 rounded-xl px-1.5 py-2 hover:bg-white/5"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
                    됨
                      ? "border-emerald-400/60 bg-emerald-500/25 text-emerald-200"
                      : "border-white/20",
                  )}
                >
                  {됨 && <Check size={11} />}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[13px]",
                    됨 ? "text-zinc-500 line-through" : "font-semibold",
                  )}
                >
                  {t.label}
                </span>
                {잼 && (
                  <span className="shrink-0 text-[11.5px] font-semibold tabular-nums text-zinc-400">
                    {t.now ?? 0}/{t.goal}
                  </span>
                )}
                <ArrowRight size={13} className="shrink-0 text-zinc-500" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 숫자의 근거 — 어디서 나온 몫인지 밝히지 않으면 지키지 않는다 */}
      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
        {todos.find((t) => t.id === "learn")?.why ??
          todos[0]?.why ??
          ""}
      </p>
    </Card>
  );
}
