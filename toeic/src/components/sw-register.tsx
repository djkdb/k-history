"use client";

import { useEffect } from "react";

export function SWRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 오프라인 지원 실패는 치명적이지 않다
      });
    }
  }, []);
  return null;
}
