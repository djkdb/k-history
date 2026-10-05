"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/base";

export function SWRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register(withBase("/sw.js"), { scope: withBase("/") }).catch(() => {
        // 오프라인 지원 실패는 치명적이지 않음
      });
    }
  }, []);
  return null;
}
