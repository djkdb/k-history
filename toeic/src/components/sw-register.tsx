"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

/**
 * 서비스 워커를 등록하고, 새 판이 올라오면 알려 준다.
 *
 * 웹 앱은 새 판을 올려도 화면을 껐다 켜기 전까지 예전 것이 돈다. 사용자는
 * 그것을 알 길이 없어 고쳐 놓은 것이 안 고쳐진 줄 안다. 그래서 새 판이
 * 준비되면 아래에 띄우고, 누르면 그때 갈아 끼운다.
 *
 * 스스로 갈아 끼우지 않는 이유 — 모의고사를 보던 중에 화면이 갈리면
 * 곤란하다. 언제 바꿀지는 사용자가 정한다.
 */
export function SWRegister() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let alive = true;
    const watch = (reg: ServiceWorkerRegistration) => {
      // 이미 기다리고 있는 새 판이 있는가 (다른 창에서 받아 둔 경우)
      if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const next = reg.installing;
        if (!next) return;
        next.addEventListener("statechange", () => {
          // controller 가 없으면 첫 설치다 — 알릴 것이 없다
          if (next.state === "installed" && navigator.serviceWorker.controller && alive) {
            setWaiting(next);
            setHidden(false);
          }
        });
      });
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        if (!alive) return;
        watch(reg);
        // 앱을 다시 열 때마다 한 번 확인한다
        reg.update().catch(() => {});
      })
      .catch(() => {
        // 오프라인 지원 실패는 치명적이지 않다
      });

    return () => {
      alive = false;
    };
  }, []);

  const apply = useCallback(() => {
    if (!waiting) return;
    // 새 판이 자리를 넘겨받으면 그때 다시 그린다
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => window.location.reload(),
      { once: true },
    );
    waiting.postMessage({ type: "SKIP_WAITING" });
  }, [waiting]);

  if (!waiting || hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[55] px-4">
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-indigo-400/40 bg-indigo-950/90 px-3.5 py-3 shadow-lg backdrop-blur">
        <RefreshCw size={16} className="shrink-0 text-indigo-300" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-indigo-100">새 판이 준비됐습니다</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-indigo-200/70">
            눌러서 켜면 바뀐 것이 바로 보입니다. 학습 기록은 그대로입니다.
          </p>
        </div>
        <button
          type="button"
          onClick={apply}
          className="shrink-0 rounded-xl bg-indigo-500 px-3 py-2 text-[13px] font-bold text-white active:scale-95"
        >
          지금 켜기
        </button>
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="나중에"
          className="-m-2 shrink-0 p-2 text-indigo-300/70 hover:text-indigo-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
