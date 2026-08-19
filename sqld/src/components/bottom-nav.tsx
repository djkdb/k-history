"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, Home, RotateCcw, Terminal, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/learn", label: "학습", icon: BookOpen },
  { href: "/quiz", label: "퀴즈", icon: Brain },
  { href: "/practice", label: "SQL", icon: Terminal },
  { href: "/mock", label: "모의", icon: Timer },
  { href: "/review", label: "복습", icon: RotateCcw },
];

/**
 * 아래 차림표.
 *
 * 시험 화면에서는 숨긴다. 제출 확인 창이 화면 아래에 뜨는데 이 막대가
 * 그 위를 덮기 때문이다(둘 다 화면 아래에 붙는다).
 */
export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/mock/session") || pathname === "/onboarding") return null;

  return (
    <nav className="nav-shell fixed inset-x-0 bottom-0 z-50 pb-safe">
      <div className="nav-bar mx-auto flex max-w-2xl items-stretch justify-around px-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] transition-colors",
                // 밝은 테마에서는 zinc-50 이 흰 막대 위의 흰 글자가 된다.
                // 지금 있는 화면의 이름만 사라져, 어디에 있는지 알 수 없게 된다.
                // text-fg 는 테마를 따라간다.
                active ? "text-fg" : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
