"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Brain,
  FileText,
  RotateCcw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/learn", label: "학습", icon: BookOpen },
  { href: "/quiz", label: "퀴즈", icon: Brain },
  { href: "/mock", label: "기출", icon: FileText },
  { href: "/review", label: "복습", icon: RotateCcw },
  { href: "/search", label: "검색", icon: Search },
];

export function BottomNav() {
  const pathname = usePathname();
  // 온보딩·모의고사 응시·시험 직전 모드에서는 탭바를 숨긴다.
  // 집중이 필요한 화면에서 실수로 다른 탭을 눌러 이탈하는 것을 막기 위해서다.
  // (각 화면에는 나가는 버튼이 따로 있다)
  if (
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/mock/session") ||
    pathname.startsWith("/cram")
  ) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-2xl px-4 pb-safe">
        {/* 늘 떠 있는 막대라 뒤를 비추면 안 된다 — nav-bar 는 불투명하다 */}
        <div className="nav-bar mb-2 flex items-center justify-around rounded-2xl px-2 py-2">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                /*
                 * 지금 어느 칸에 있는지를 색으로만 알렸다.
                 * 화면을 읽어 주는 기기는 색을 읽지 못해, 여섯 칸이 똑같은
                 * 링크로만 들린다. aria-current 로 "지금 이 쪽" 이라고 말한다.
                 */
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1 transition-colors",
                  active ? "text-fg" : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {active && (
                  <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-indigo-400" />
                )}
                <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[11px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
