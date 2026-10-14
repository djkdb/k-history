"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** 왼쪽 길잡이를 감추는 화면 — side-nav.tsx 의 HIDE_ON 과 같다 */
const FULL = ["/onboarding", "/mock/session"];

/**
 * 본문 틀.
 *   폰    — 가운데 좁은 기둥, 아래 탭 자리만큼 띄운다
 *   넓은 화면 — 왼쪽 길잡이 옆으로 비켜서 넓게 쓴다
 */
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const full = FULL.some((h) => path.startsWith(h));
  return (
    <div className={cn("app-zoom", !full && "lg:pl-64")}>
      <div className="mx-auto w-full max-w-2xl px-4 pt-safe pb-28 md:max-w-[46rem] md:px-6 md:pb-32 lg:max-w-[1120px] lg:px-10 lg:pb-16 lg:pt-4">
        {children}
      </div>
    </div>
  );
}
