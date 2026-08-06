"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 스크롤로 화면에 들어왔을 때 한 번 애니메이션을 재생하고,
 * "다시 보기"로 재생을 반복할 수 있게 해 주는 훅.
 *
 * anime.js는 DOM을 직접 조작하므로 React 렌더와 분리해서 다뤄야 한다.
 * play 카운터가 바뀔 때마다 effect가 재실행되도록 키로 쓴다.
 *
 * ⚠️ 애니메이션은 장식이지만 여기서는 정보를 켜는 스위치이기도 하다.
 *    (요소들이 opacity 0으로 그려진 뒤 애니메이션으로 나타난다)
 *    그래서 관찰자가 발화하지 않으면 내용이 영영 보이지 않는다.
 *    실제로 그런 일이 있었다 — 그래서 두 겹으로 막는다.
 *      · threshold를 아주 낮춰 조금만 보여도 발화시킨다
 *        (요소가 화면보다 크면 35% 같은 값은 영원히 채워지지 않는다)
 *      · 그래도 발화하지 않으면 잠시 뒤 스스로 재생한다
 */
export function useInViewAnime<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [play, setPlay] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const fire = () => {
      setSeen(true);
      setPlay((p) => p + 1);
    };

    let io: IntersectionObserver | null = null;
    try {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            fire();
            io?.disconnect();
          }
        },
        { threshold: 0.01, rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
    } catch {
      fire(); // 관찰자를 못 쓰는 환경이면 그냥 보여 준다
    }

    // 안전망: 관찰자가 끝내 발화하지 않아도 내용은 나와야 한다
    const t = setTimeout(fire, 2500);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, [seen]);

  return { ref, play, replay: () => setPlay((p) => p + 1) };
}
