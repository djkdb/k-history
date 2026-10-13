"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

/**
 * 기록을 다 불러온 뒤에 화면을 그린다.
 *
 * 불러오기 전에 그리면 "공부한 개념 0개" 가 잠깐 보였다가 바뀐다. 그 사이에
 * 누르면 빈 기록을 기준으로 움직인다. 처음 온 사람은 시험일부터 정하게 한다.
 */
export function Gate({ children, allowNew = false }: { children: ReactNode; allowNew?: boolean }) {
  const hydrated = useApp((s) => s.hydrated);
  const settings = useApp((s) => s.settings);
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !settings && !allowNew) router.replace("/onboarding");
  }, [hydrated, settings, allowNew, router]);
  if (!hydrated || (!settings && !allowNew)) {
    return (
      <div className="flex flex-col gap-3 pt-8" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass h-24 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }
  return <>{children}</>;
}

/** 퀴즈로 넘길 조건 — 주소에 싣지 않고 잠깐 맡겨 둔다 (정적 빌드라 주소 인자를 읽으려면 번거롭다) */
export interface QuizPreset {
  chapter?: string;
  concept?: string;
  mode?: "all" | "new" | "wrong";
}
