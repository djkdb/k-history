"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Plus, Share, Smartphone, X } from "lucide-react";

/**
 * 홈 화면에 추가 안내.
 *
 * 이 앱은 주소창이 있는 웹으로 봐도 되지만, 홈 화면에 얹어 두면
 * 앱처럼 전체 화면으로 뜨고 지하철에서도 그대로 열린다. 그런데 그 방법을
 * 아는 사람이 많지 않아, 한 번만 알려 준다.
 *
 * 기기마다 방법이 다르다.
 *   안드로이드·PC 크롬 — 브라우저가 설치를 제안한다(beforeinstallprompt).
 *                        단추 하나로 끝나므로 그대로 눌러 주면 된다.
 *   아이폰 사파리     — 그런 제안이 없다. 공유 → 홈 화면에 추가를
 *                        직접 눌러야 해서 그림으로 설명한다.
 *   아이폰 다른 브라우저 — 애초에 안 된다. 사파리로 열라고 알린다.
 * 어느 쪽인지 모르면 아무 말도 하지 않는다. 잘못된 안내가 없느니만 못하다.
 *
 * ⚠️ 닫음 표시는 학습 기록과 따로 둔다. 취향에 가까운 값이고,
 *    잃어버려도 안내가 한 번 더 뜰 뿐이다.
 */
const KEY = "comhwal:install-hint";

type How = "prompt" | "ios-safari" | "ios-other" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function standalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS 사파리는 표준 방식 대신 이것만 알려 준다
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function InstallHint() {
  const [how, setHow] = useState<How>(null);
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState(false);

  useEffect(() => {
    // 이미 홈 화면에서 열었으면 할 말이 없다
    if (standalone()) return;
    try {
      if (localStorage.getItem(KEY) === "닫음") return;
    } catch {
      /* 저장소를 못 쓰는 브라우저에서도 안내는 뜨게 둔다 */
    }

    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      // 아이패드는 요즘 자신을 맥이라고 말한다 — 손가락이 닿는지로 가른다
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // 아이폰에서 홈 화면에 추가가 되는 것은 사파리뿐이다
      const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
      setHow(safari ? "ios-safari" : "ios-other");
      setOpen(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault(); // 브라우저 제 안내 대신 우리 카드로 보여 준다
      setEvent(e as BeforeInstallPromptEvent);
      setHow("prompt");
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // 설치를 마치면 안내를 접는다
    const onInstalled = () => {
      close("설치함");
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = (why: "닫음" | "설치함" = "닫음") => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, why);
    } catch {
      /* 못 적어도 이번 화면에서는 사라진다 */
    }
  };

  const install = async () => {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    // 여기서 거절했다면 다시 묻지 않는다 — 두 번 묻는 것이 더 성가시다
    close(outcome === "accepted" ? "설치함" : "닫음");
  };

  if (!how) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, height: 0, marginTop: 0 }}
          transition={{ duration: 0.22 }}
          className="mt-3 overflow-hidden"
        >
          <div className="relative rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.08] p-4">
            <button
              type="button"
              onClick={() => close()}
              aria-label="안내 닫기"
              className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-2.5 pr-9">
              <Smartphone size={17} className="mt-0.5 shrink-0 text-indigo-300" />
              <div className="min-w-0">
                {/* indigo-200 을 쓴다 — 밝은 화면 대응 규칙이 있는 색이다 */}
                <p className="text-[14px] font-bold text-indigo-200">
                  앱처럼 쓸 수 있습니다
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                  홈 화면에 얹어 두면 주소창 없이 전체 화면으로 열리고, 지하철처럼
                  연결이 끊기는 곳에서도 그대로 공부할 수 있습니다.
                </p>
              </div>
            </div>

            {how === "prompt" && (
              <button
                type="button"
                onClick={install}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
              >
                <Download size={15} />
                홈 화면에 추가
              </button>
            )}

            {how === "ios-safari" && (
              <>
                {!steps ? (
                  <button
                    type="button"
                    onClick={() => setSteps(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-[13px] font-medium text-zinc-200 transition-colors hover:bg-white/5"
                  >
                    추가하는 법 보기
                  </button>
                ) : (
                  <ol className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                    <Step n={1}>
                      화면 아래 <Share size={13} className="mx-0.5 inline align-[-2px] text-sky-300" />
                      <b className="text-zinc-200">공유</b> 를 누릅니다
                    </Step>
                    <Step n={2}>
                      목록을 내려 <Plus size={13} className="mx-0.5 inline align-[-2px] text-sky-300" />
                      <b className="text-zinc-200">홈 화면에 추가</b> 를 누릅니다
                    </Step>
                    <Step n={3}>
                      오른쪽 위 <b className="text-zinc-200">추가</b> 를 누르면 끝입니다
                    </Step>
                  </ol>
                )}
              </>
            )}

            {how === "ios-other" && (
              <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-amber-200">
                아이폰에서는 <b>사파리</b>로 열어야 홈 화면에 추가할 수 있습니다.
                주소를 복사해 사파리에서 열어 보세요.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-zinc-400">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-zinc-300">
        {n}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}
