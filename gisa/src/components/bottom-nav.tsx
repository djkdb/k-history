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

export function BottomNav() {
  const path = usePathname();
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
