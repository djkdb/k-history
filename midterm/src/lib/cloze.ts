"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * '가리고 떠올리기'를 켜 두었는지 — 이 기기에서만 기억하는 편의 설정이라
 * 공부 기록(스토어)과 따로 브라우저 저장소에 둔다. 저장소를 못 쓰면 그냥 꺼진 채로.
 */
const KEY = "mid-cloze";

export function useCloze() {
  const [on, setOn] = useState(false);
  const [gen, setGen] = useState(0);
  useEffect(() => {
    try {
      setOn(localStorage.getItem(KEY) === "1");
    } catch {
      /* 저장소를 못 쓰는 창 — 꺼진 채로 */
    }
  }, []);
  const toggle = useCallback(() => {
    setOn((v) => {
      const nv = !v;
      try {
        localStorage.setItem(KEY, nv ? "1" : "0");
      } catch {
        /* 무시 */
      }
      return nv;
    });
    setGen((g) => g + 1);
  }, []);
  const rehide = useCallback(() => setGen((g) => g + 1), []);
  return { on, gen, toggle, rehide };
}

/** 글 안의 **굵은 핵심어** 개수 */
export function countKeys(texts: (string | undefined)[]) {
  let n = 0;
  for (const t of texts) if (t) n += (t.match(/\*\*[^*]+\*\*/g) ?? []).length;
  return n;
}
