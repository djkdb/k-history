"use client";

import { useEffect, useState } from "react";

/**
 * 글씨 크기 — 본문 전체를 배율로 키우고 줄인다.
 * 화면 곳곳의 글씨가 px 로 정해져 있어 rem 이 아니라 CSS zoom(--fz)으로 맞춘다.
 * 다섯 과목이 한 주소라 한 번 정하면 다 같이 따른다 (mid-sync-code 처럼 과목 이름을 붙이지 않는다).
 * 칠하기 전에 layout.tsx 의 짧은 스크립트가 먼저 --fz 를 놓는다.
 */
import { FONT_KEY, FONT_STEPS } from "./font-boot";

export { FONT_KEY, FONT_STEPS };

function read(): number {
  try {
    const v = Number(localStorage.getItem(FONT_KEY));
    return FONT_STEPS.includes(v) ? v : 1;
  } catch {
    return 1;
  }
}

function apply(v: number) {
  document.documentElement.style.setProperty("--fz", String(v));
}

export function useFontScale(): [number, (v: number) => void] {
  const [v, setV] = useState(1);
  useEffect(() => {
    setV(read());
    const on = (e: StorageEvent) => {
      if (e.key === FONT_KEY) {
        const n = read();
        setV(n);
        apply(n);
      }
    };
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);
  const set = (n: number) => {
    setV(n);
    apply(n);
    try {
      localStorage.setItem(FONT_KEY, String(n));
    } catch {
      /* 막아 둔 브라우저 — 이번 창에서만 */
    }
    // 같은 창의 다른 조절기도 맞춘다
    window.dispatchEvent(new StorageEvent("storage", { key: FONT_KEY }));
  };
  return [v, set];
}
