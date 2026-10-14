"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BookOpen, ClipboardList, Home, LayoutGrid, ListChecks, NotebookPen, RotateCw, Settings } from "lucide-react";
import { BASE } from "@/lib/base";
import { COURSE, conceptsOf } from "@/lib/course";
import { dueCards } from "@/lib/srs";
import { useApp } from "@/lib/store";
import { cn, daysUntil } from "@/lib/utils";
import { ThemeToggle } from "./theme";

/**
 * 넓은 화면(노트북·데스크톱)의 왼쪽 길잡이.
 *
 * 폰에서는 아래 탭이 엄지에 닿지만, 넓은 화면에서는 화면 맨 아래까지 눈과
 * 마우스가 오가야 한다. 왼쪽에 세워 두고 장 목록까지 함께 보여 준다 —
 * 어느 장이든 한 번에 간다.
 */
const HIDE_ON = ["/onboarding", "/mock/session"];

export function SideNav() {
  const path = usePathname();
  const hydrated = useApp((s) => s.hydrated);
  const cards = useApp((s) => s.cards);
  const sureWrong = useApp((s) => s.sureWrong);
  const studied = useApp((s) => s.studied);
  const exam = useApp((s) => s.settings?.examDate ?? null);
  const due = useMemo(() => dueCards(cards).length, [cards]);
  const nSure = Object.keys(sureWrong).length;
  if (HIDE_ON.some((h) => path.startsWith(h))) return null;

  const dday = exam ? daysUntil(exam) : null;
  const items = [
    { href: "/", label: "홈", icon: Home },
    { href: "/learn", label: "개념", icon: BookOpen },
    { href: "/quiz", label: "퀴즈", icon: ListChecks },
    { href: "/review", label: "복습", icon: RotateCw, badge: due },
    { href: "/mock", label: "모의고사", icon: ClipboardList },
    { href: "/wrongs", label: "오답 노트", icon: NotebookPen, badge: nSure, hot: true },
  ];
  const on = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <aside className="side-nav fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex">
      <div className="px-5 pb-3 pt-6">
        <Link href="/" className="block">
          <p className="text-[12px] font-semibold text-indigo-300">
            {COURSE.symbol} {COURSE.code}
          </p>
          <p className="mt-0.5 text-[17px] font-bold leading-tight tracking-tight">{COURSE.name}</p>
        </Link>
        {hydrated && dday !== null && (
          <p className={cn("mt-1.5 text-[12.5px] font-bold", dday <= 3 ? "text-rose-300" : "text-zinc-400")}>
            {dday > 0 ? `중간고사 D-${dday}` : dday === 0 ? "오늘 시험" : "시험 끝"}
          </p>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 px-3" aria-label="주 메뉴">
        {items.map((t) => {
          const Icon = t.icon;
          const active = on(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
                active ? "bg-indigo-500/15 text-indigo-100" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{t.label}</span>
              {hydrated && !!t.badge && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                    t.hot ? "bg-rose-500/20 text-rose-200" : "bg-emerald-500/15 text-emerald-200",
                  )}
                  title={t.hot ? "확신했는데 틀린 문제" : "지금 복습할 개념"}
                >
                  {t.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <p className="mt-5 px-6 text-[11px] font-bold tracking-wide text-zinc-500">장</p>
      <div className="side-scroll mt-1.5 min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {COURSE.chapters.map((ch, i) => {
          const cs = conceptsOf(ch.id);
          const done = cs.filter((c) => studied[c.id]).length;
          const active = path.startsWith(`/learn/${ch.id}`);
          return (
            <Link
              key={ch.id}
              href={`/learn/${ch.id}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] transition-colors",
                active ? "bg-white/[0.07] text-zinc-100" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
              )}
            >
              <span className="w-4 shrink-0 text-right text-[11px] font-bold tabular-nums text-zinc-500">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate">{ch.title}</span>
              {hydrated && cs.length > 0 && (
                <span
                  className={cn(
                    "shrink-0 text-[10.5px] tabular-nums",
                    done === cs.length ? "text-emerald-300" : "text-zinc-500",
                  )}
                >
                  {done}/{cs.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-white/5 px-4 py-3">
        {BASE && (
          <a
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-[12.5px] font-semibold text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          >
            <LayoutGrid size={15} /> 5과목 홈
          </a>
        )}
        {!BASE && <span className="flex-1" />}
        <ThemeToggle />
        <Link
          href="/settings"
          aria-label="설정"
          className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
        >
          <Settings size={16} />
        </Link>
      </div>
    </aside>
  );
}
