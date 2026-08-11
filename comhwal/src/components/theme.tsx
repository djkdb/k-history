"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 화면 밝기 테마.
 *
 * 저장은 학습 기록과 따로 둔다. 취향 하나 바꾸는 일이 진도·복습 카드와
 * 같은 저장소를 건드리면 그만큼 잘못될 여지가 생긴다. 테마는 잃어버려도
 * 그만인 값이다.
 */
export type Theme = "dark" | "light" | "system";

export const THEME_KEY = "comhwal:theme";

export function resolveTheme(pref: Theme): "dark" | "light" {
  if (pref !== "system") return pref;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function applyTheme(pref: Theme) {
  const actual = resolveTheme(pref);
  document.documentElement.setAttribute("data-theme", actual);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", actual === "light" ? "#f4f4f5" : "#09090b");
}

export function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(THEME_KEY);
  return v === "light" || v === "system" ? v : "dark";
}

export function ThemePicker() {
  const [pref, setPref] = useState<Theme>("dark");

  useEffect(() => {
    setPref(readTheme());
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const choose = (t: Theme) => {
    setPref(t);
    localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
  };

  const items: { key: Theme; label: string; icon: React.ReactNode }[] = [
    { key: "dark", label: "어둡게", icon: <Moon size={15} /> },
    { key: "light", label: "밝게", icon: <Sun size={15} /> },
    { key: "system", label: "기기 설정", icon: <Monitor size={15} /> },
  ];

  return (
    <div className="flex gap-1.5">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => choose(it.key)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition-all active:scale-[0.98]",
            pref === it.key
              ? "pill-on shadow-lg"
              : "bg-white/5 text-zinc-400 hover:bg-white/10",
          )}
        >
          {it.icon}
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const [actual, setActual] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setActual(resolveTheme(readTheme()));
  }, []);

  const flip = () => {
    const next = actual === "dark" ? "light" : "dark";
    setActual(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={actual === "dark" ? "밝게 보기" : "어둡게 보기"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200",
        className,
      )}
    >
      {actual === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
