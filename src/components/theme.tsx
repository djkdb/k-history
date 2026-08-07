"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 화면 밝기 테마.
 *
 * 기본은 어두운 화면이다. 앱이 그 톤으로 자랐고, 밤에 누워서 보는
 * 사람이 많다. 밝은 화면은 낮에 밖에서 보거나 눈이 부신 사람을 위한 것이다.
 *
 * 저장은 학습 기록과 따로 둔다. 학습 기록(khlm-state)에 끼워 넣으면
 * 취향 하나 바꾸는 일이 진도·복습 카드와 같은 저장소를 건드리게 되고,
 * 그만큼 잘못될 여지가 생긴다. 테마는 잃어버려도 그만인 값이다.
 */
export type Theme = "dark" | "light" | "system";

export const THEME_KEY = "khlm:theme";

/** 저장된 취향 → 실제로 칠할 색 */
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
  // 주소 표시줄·상태 표시줄 색까지 맞춰야 앱처럼 보인다
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", actual === "light" ? "#f4f4f5" : "#09090b");
}

export function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(THEME_KEY);
  return v === "light" || v === "system" ? v : "dark";
}

/**
 * 테마 고르기.
 *
 * "기기 설정 따르기"를 넣어 두면 시스템이 밤에 어두워질 때 같이 어두워진다.
 * 기본값은 어두움이라, 아무것도 고르지 않은 사람은 지금까지와 똑같이 보인다.
 */
export function ThemePicker() {
  const [pref, setPref] = useState<Theme>("dark");

  useEffect(() => {
    setPref(readTheme());
  }, []);

  // "기기 설정 따르기"인 동안에는 시스템이 바뀔 때 같이 따라간다
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

/**
 * 화면 어디서나 누를 수 있는 밝기 단추 (어둡게 ↔ 밝게).
 * 세 갈래 고르기는 설정에 두고, 여기서는 한 번에 뒤집는다.
 */
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
