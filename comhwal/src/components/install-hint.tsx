"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Plus,
  Share,
  Smartphone,
  TriangleAlert,
  X,
} from "lucide-react";
import { escapeHint, readEnv, type Env } from "@/lib/browser";

/**
 * 앱처럼 쓰게 하는 안내.
 *
 * 두 가지를 말한다. 어느 쪽인지는 어디서 열었느냐로 갈린다.
 *
 *   인스타·카카오톡 등에서 들어온 경우 → 먼저 밖으로 나가라고 한다.
 *     여기서는 홈 화면 추가가 아예 안 되고, 무엇보다 여기서 쌓은 학습
 *     기록이 나중에 사파리로 열면 없다. 링크를 타고 들어오는 사람이
 *     많을수록 이 말을 먼저 해야 한다.
 *
 *   보통 브라우저인 경우 → 홈 화면에 얹는 법을 알려 준다.
 *
 * 둘 다 닫으면 다시 뜨지 않는다. 표시는 따로 둔다 — 하나를 닫았다고
 * 다른 하나까지 사라지면 정작 필요한 말을 못 듣는다.
 */
const KEY_INAPP = "comhwal:inapp-hint";
const KEY_INSTALL = "comhwal:install-hint";

type How = "inapp" | "prompt" | "ios-safari" | "ios-other" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* 못 적어도 이번 화면에서는 사라진다 */
  }
}

/**
 * @param slot 어디에 놓인 자리인가.
 *   "top"  — 머리글 바로 아래. 앱 안의 브라우저 경고만 여기서 뜬다.
 *            공부를 시작하기 전에 봐야 하는 말이라 맨 위여야 한다.
 *   "body" — 오늘 할 일 아래. 홈 화면 추가 안내는 급하지 않으므로
 *            첫 화면을 밀어내지 않는 자리에 둔다.
 */
export function InstallHint({ slot = "body" }: { slot?: "top" | "body" }) {
  const [env, setEnv] = useState<Env | null>(null);
  const [how, setHow] = useState<How>(null);
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const e = readEnv();
    setEnv(e);

    // 이미 홈 화면에서 열었으면 할 말이 없다
    if (e.standalone) return;

    // 앱 안의 브라우저 — 이것이 가장 급하다
    if (e.inApp) {
      if (read(KEY_INAPP) === "닫음") return;
      setHow("inapp");
      setOpen(true);
      return;
    }

    if (read(KEY_INSTALL) === "닫음") return;

    if (e.ios) {
      setHow(e.iosSafari ? "ios-safari" : "ios-other");
      setOpen(true);
      return;
    }

    const onPrompt = (ev: Event) => {
      ev.preventDefault(); // 브라우저 제 안내 대신 우리 카드로 보여 준다
      setEvent(ev as BeforeInstallPromptEvent);
      setHow("prompt");
      setOpen(true);
    };
    const onInstalled = () => {
      setOpen(false);
      write(KEY_INSTALL, "닫음");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = () => {
    setOpen(false);
    write(how === "inapp" ? KEY_INAPP : KEY_INSTALL, "닫음");
  };

  const install = async () => {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    // 받아들였든 물렸든 다시 묻지 않는다 — 두 번 묻는 것이 더 성가시다
    setOpen(false);
    write(KEY_INSTALL, "닫음");
  };

  /** 주소를 복사해 둔다 — 밖에서 붙여 넣으면 그만이다 */
  const copyLink = async () => {
    const url = window.location.origin + "/";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // 인앱 브라우저는 클립보드를 막아 두기도 한다. 옛 방법으로 한 번 더.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* 여기까지 막혔으면 주소창을 길게 눌러 복사하는 수밖에 없다 */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!how || !env) return null;
  // 자기 자리가 아니면 그리지 않는다 (같은 부품을 위아래 두 곳에 둔다)
  if (slot === "top" && how !== "inapp") return null;
  if (slot === "body" && how === "inapp") return null;

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
          {how === "inapp" ? (
            <InApp env={env} onClose={close} onCopy={copyLink} copied={copied} />
          ) : (
            <div className="relative rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.08] p-4">
              <CloseButton onClick={close} />
              <div className="flex items-start gap-2.5 pr-9">
                <Smartphone size={17} className="mt-0.5 shrink-0 text-indigo-300" />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-indigo-200">
                    앱처럼 쓸 수 있습니다
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                    홈 화면에 얹어 두면 주소창 없이 전체 화면으로 열리고,
                    지하철처럼 연결이 끊기는 곳에서도 그대로 공부할 수 있습니다.
                  </p>
                </div>
              </div>

              {how === "prompt" && (
                <button
                  type="button"
                  onClick={install}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
                >
                  <Download size={15} />홈 화면에 추가
                </button>
              )}

              {how === "ios-safari" &&
                (!steps ? (
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
                      화면 아래
                      <Share size={13} className="mx-0.5 inline align-[-2px] text-sky-300" />
                      <b className="text-zinc-200">공유</b> 를 누릅니다
                    </Step>
                    <Step n={2}>
                      목록을 내려
                      <Plus size={13} className="mx-0.5 inline align-[-2px] text-sky-300" />
                      <b className="text-zinc-200">홈 화면에 추가</b> 를 누릅니다
                    </Step>
                    <Step n={3}>
                      오른쪽 위 <b className="text-zinc-200">추가</b> 를 누르면 끝입니다
                    </Step>
                  </ol>
                ))}

              {how === "ios-other" && (
                <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-amber-200">
                  아이폰에서는 <b>사파리</b>로 열어야 홈 화면에 추가할 수 있습니다.
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 앱 안의 브라우저에서 열렸을 때.
 *
 * 홈 화면 추가가 안 된다는 것보다, 여기서 쌓은 기록이 밖으로 넘어가지
 * 않는다는 것이 훨씬 큰 문제다. 그것을 먼저 말한다.
 */
function InApp({
  env,
  onClose,
  onCopy,
  copied,
}: {
  env: Env;
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="relative rounded-2xl border border-amber-500/35 bg-amber-500/[0.09] p-4">
      <CloseButton onClick={onClose} />
      <div className="flex items-start gap-2.5 pr-9">
        <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-300" />
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-amber-200">
            {env.inApp} 안에서 보고 있습니다
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-300">
            여기서 공부한 기록은 <b className="text-amber-100">이 화면 안에만</b> 남습니다.
            나중에 {env.ios ? "사파리" : "크롬"}으로 열면 외운 것도, 복습 카드도
            보이지 않습니다. 서버에 사본을 두지 않아 되찾을 수도 없습니다.
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
            시작하기 전에 밖에서 여세요. {escapeHint(env)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCopy}
        // 주황 위의 흰 글자는 2.3:1 밖에 안 된다 — 주황은 밝은 색이라
        // 어두운 글자를 얹어야 읽힌다 (7.9:1)
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 py-2.5 text-[14px] font-bold text-zinc-900 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "복사했습니다 — 붙여 넣어 여세요" : "주소 복사하기"}
      </button>
      <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-zinc-500">
        <ExternalLink size={11} />
        메뉴가 안 보이면 주소를 복사해 브라우저에 붙여 넣으세요
      </p>
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="안내 닫기"
      className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200"
    >
      <X size={16} />
    </button>
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
