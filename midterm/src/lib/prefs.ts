"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 이 기기에서만 기억하는 켜고 끄는 편의 설정 (예: 퀴즈에서 자신감 묻기).
 * 공부 기록(스토어)과 따로 브라우저 저장소에 둔다. 저장소를 못 쓰면 기본값으로.
 */
export function usePref(key: string, fallback: boolean) {
  const [on, setOn] = useState(fallback);
  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      if (v === "1" || v === "0") setOn(v === "1");
    } catch {
      /* 저장소를 못 쓰는 창 — 기본값으로 */
    }
  }, [key]);
  const set = useCallback(
    (nv: boolean) => {
      setOn(nv);
      try {
        localStorage.setItem(key, nv ? "1" : "0");
      } catch {
        /* 무시 */
      }
    },
    [key],
  );
  return [on, set] as const;
}
