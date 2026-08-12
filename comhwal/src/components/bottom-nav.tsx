"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, Keyboard, RotateCcw, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/learn", label: "학습", icon: BookOpen },
  { href: "/quiz", label: "퀴즈", icon: Brain },
  { href: "/practical", label: "실기", icon: Keyboard },
  { href: "/mock", label: "모의", icon: FileText },
  { href: "/review", label: "복습", icon: RotateCcw },
];

export function BottomNav() {
  const pathname = usePathname();
  // 집중이 필요한 화면에서는 탭바를 숨긴다 — 실수로 눌러 이탈하면
  // 풀던 것이 날아간다. (각 화면에는 나가는 버튼이 따로 있다)
  if (
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/mock/session") ||
    pathname.startsWith("/cram")
  ) {
    return null;
  }

  return (
    <nav className="nav-shell fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-2xl px-4 pb-safe">
        <div className="nav-bar mb-2 flex items-center justify-around rounded-2xl px-2 py-2">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1 transition-colors",
                  active ? "text-fg" : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {active && (
                  <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-indigo-400" />
                )}
                <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
