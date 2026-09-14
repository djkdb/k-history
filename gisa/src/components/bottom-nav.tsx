"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Home, PenLine, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/learn", label: "학습", icon: BookOpen },
  { href: "/quiz", label: "문제", icon: FileText },
  { href: "/practical", label: "실기", icon: PenLine },
  { href: "/review", label: "복습", icon: RotateCw },
];

/**
 * 길잡이를 감출 곳.
 *
 *   첫 안내  — 끝까지 따라오게 해야 한다
 *   시험 중  — 150분짜리 시험 아래에 한 번 누르면 나가지는 단추를 두지
 *              않는다. 답안은 저장되지만, 나가려고 누른 것이 아닌데
 *              시험지가 사라지는 경험은 그 자체로 나쁘다. 나가는 길은
 *              시험 화면 안에 따로 둔다.
 */
const HIDE_ON = ["/onboarding", "/mock/session", "/practical/mock/session"];

export function BottomNav() {
  const path = usePathname();
  /*
   * 첫 안내에서는 길잡이를 감춘다.
   *
   * 보이면 눌러 보게 되는데, 누르면 안내를 건너뛴 채 앱으로 들어가고
   * 거기서 홈을 누르면 다시 안내로 끌려온다. 나가지도 끝내지도 못하는
   * 고리에 갇힌 것처럼 느껴진다.
   */
  if (HIDE_ON.some((h) => path.startsWith(h))) return null;

  return (
    <nav className="nav-shell fixed inset-x-0 bottom-0 z-50 pb-safe">
      <div className="mx-auto flex w-full max-w-2xl items-stretch">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
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
