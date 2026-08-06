"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 스크롤로 화면에 들어왔을 때 한 번 애니메이션을 재생하고,
 * "다시 보기"로 재생을 반복할 수 있게 해 주는 훅.
 *
 * anime.js는 DOM을 직접 조작하므로 React 렌더와 분리해서 다뤄야 한다.
 * play 카운터가 바뀔 때마다 effect가 재실행되도록 키로 쓴다.
 */
export function useInViewAnime<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [play, setPlay] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          setPlay((p) => p + 1);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return { ref, play, replay: () => setPlay((p) => p + 1) };
}
