"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, ClipboardList, Headphones, Home, ListChecks, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/learn", label: "개념", icon: BookOpen },
  { href: "/memo", label: "암기", icon: Brain },
  { href: "/listen", label: "듣기", icon: Headphones },
  { href: "/quiz", label: "퀴즈", icon: ListChecks },
  { href: "/review", label: "복습", icon: RotateCw },
  { href: "/mock", label: "모의고사", icon: ClipboardList },
];

/**
 * 길잡이를 감출 곳.
 *   첫 안내 — 누르면 안내를 건너뛰고 들어갔다가 다시 끌려오는 고리에 갇힌다
 *   시험 중 — 한 번 잘못 누르면 시험지가 사라진다. 나가는 길은 시험 화면 안에 둔다
 */
const HIDE_ON = ["/onboarding", "/mock/session"];

export function BottomNav() {
  const path = usePathname();
  if (HIDE_ON.some((h) => path.startsWith(h))) return null;
  return (
    <nav className="nav-shell app-zoom fixed inset-x-0 bottom-0 z-50 pb-safe lg:hidden">
      {/* 태블릿에서는 떠 있는 막대 — 화면 끝까지 늘어난 탭은 손가락 사이가 너무 멀다 */}
      <div className="tab-bar mx-auto flex w-full max-w-2xl items-stretch md:mb-3 md:max-w-md md:rounded-2xl">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold transition-colors",
                on ? "text-indigo-300" : "text-zinc-500",
              )}
            >
              <Icon size={19} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
