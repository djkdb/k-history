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

/** 길잡이를 감출 곳 — 첫 안내는 끝까지 따라오게 해야 한다 */
const HIDE_ON = ["/onboarding"];

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
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
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
