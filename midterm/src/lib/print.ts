"use client";

import { useEffect, useRef } from "react";

/**
 * 인쇄는 흰 종이 — 어두운 테마의 밝은 글씨가 흐려지지 않게 인쇄하는 동안만
 * 밝은 테마로 바꾼다. onBefore 는 인쇄 직전에 부른다 (예: 접어 둔 답 펼치기).
 */
export function usePrintLight(onBefore?: () => void) {
  const cb = useRef(onBefore);
  cb.current = onBefore;
  useEffect(() => {
    const root = document.documentElement;
    let prev: string | null = null;
    const before = () => {
      cb.current?.();
      prev = root.getAttribute("data-theme");
      root.setAttribute("data-theme", "light");
    };
    const after = () => {
      if (prev) root.setAttribute("data-theme", prev);
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
}
