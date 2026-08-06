"use client";

import { useEffect, useState } from "react";
import {
  Share,
  MoreVertical,
  MoreHorizontal,
  Plus,
  Download,
  Copy,
  Check,
  Compass,
} from "lucide-react";

type Platform = "ios" | "android" | "desktop";

/** 인스타·카톡처럼 앱 안에 박혀 있는 브라우저 */
type InApp = {
  /** 사용자에게 보여 줄 앱 이름 */
  name: string;
  /** 메뉴 버튼이 어디 있는지 */
  where: string;
  /** 메뉴 버튼 모양 — 가로 점(⋯)인지 세로 점(⋮)인지 */
  dots: "⋯" | "⋮";
};

/**
 * 홈 화면에 앱 추가 안내.
 *
 * 이 앱은 PWA라 홈 화면에 추가하면 주소창 없이 전체 화면으로 뜨고
 * 오프라인에서도 열린다. 다만 iOS는 설치 프롬프트 API가 없어
 * 사용자가 직접 공유 메뉴를 거쳐야 하므로 플랫폼별 안내가 필요하다.
 *
 * 더 큰 걸림돌은 링크를 타고 들어오는 경로다. 인스타그램 DM이나 카카오톡으로
 * 링크를 받아 누르면 그 앱 안에 박힌 브라우저가 열리는데, 여기에는 '홈 화면에
 * 추가' 메뉴 자체가 없다. 사파리·크롬으로 먼저 빠져나가야 한다.
 * 그래서 앱 내 브라우저를 감지해 '외부 브라우저로 나가기'를 앞 단계로 붙인다.
 *
 * 이미 설치해서 standalone으로 실행 중이면 아무것도 보여 주지 않는다.
 */
export function InstallGuide() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [inApp, setInApp] = useState<InApp | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 이미 홈 화면에서 실행 중이면 안내가 필요 없다
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari는 표준 API 대신 navigator.standalone을 쓴다
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    if (standalone) return;

    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) setPlatform("ios");
    else if (/Android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    // 앱 내 브라우저 판별 — 각 앱이 UA에 자기 이름을 남긴다
    setInApp(detectInApp(ua));
  }, []);

  if (!platform) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드를 막아 둔 앱도 있다. 그럴 땐 주소를 직접 옮겨 적어야 한다.
    }
  };

  const browser = platform === "ios" ? "Safari" : "Chrome";

  const homeSteps: Step[] =
    platform === "ios"
      ? [
          { icon: <Share size={13} />, text: "화면 아래 공유 버튼을 누르고" },
          { icon: <Plus size={13} />, text: "‘홈 화면에 추가’를 선택하세요" },
        ]
      : platform === "android"
        ? [
            {
              icon: <MoreVertical size={13} />,
              text: "오른쪽 위 ⋮ 메뉴를 누르고",
            },
            {
              icon: <Download size={13} />,
              text: "‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택하세요",
            },
          ]
        : [
            {
              icon: <Download size={13} />,
              text: "주소창 오른쪽 설치 아이콘을 누르세요",
            },
          ];

  // 앱 내 브라우저에서는 밖으로 나가는 단계가 먼저다
  const escapeSteps: Step[] = inApp
    ? [
        {
          icon:
            inApp.dots === "⋯" ? (
              <MoreHorizontal size={13} />
            ) : (
              <MoreVertical size={13} />
            ),
          text: `${inApp.where} ${inApp.dots} 버튼을 누르고`,
        },
        {
          icon: <Compass size={13} />,
          text: `‘${browser}로 열기’ 또는 ‘외부 브라우저에서 열기’를 선택하세요`,
        },
      ]
    : [];

  return (
    <div className="glass rounded-2xl p-3.5">
      <p className="text-xs font-semibold text-zinc-200">
        📱 홈 화면에 추가하면 앱처럼 쓸 수 있어요
      </p>

      {inApp && (
        <>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-300/90">
            지금은 {inApp.name} 안의 브라우저예요. 여기에는 홈 화면 추가 메뉴가
            없으니 {browser}로 먼저 나가야 합니다.
          </p>
          <StepList steps={escapeSteps} start={1} />
          <button
            type="button"
            onClick={copyLink}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/8 py-2 text-[11px] font-semibold text-zinc-300 transition-colors active:bg-white/12"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "주소를 복사했어요" : "메뉴를 못 찾겠다면 주소 복사하기"}
          </button>
          <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-600">
            복사한 주소를 {browser} 주소창에 붙여넣어도 똑같이 열립니다.
          </p>
          <div className="my-3 border-t border-white/8" />
          <p className="text-[11px] font-semibold text-zinc-300">
            {browser}로 열린 뒤에는
          </p>
        </>
      )}

      <StepList steps={homeSteps} start={escapeSteps.length + 1} />

      <p className="mt-2.5 text-[10px] leading-relaxed text-zinc-600">
        설치하면 주소창 없이 전체 화면으로 열리고, 인터넷이 없어도 학습·복습이
        그대로 됩니다.
      </p>
    </div>
  );
}

type Step = { icon: React.ReactNode; text: string };

/** 앱 내 브라우저 판별. 앱마다 메뉴 버튼의 위치와 모양이 달라 함께 돌려준다. */
function detectInApp(ua: string): InApp | null {
  if (/Instagram/i.test(ua))
    return { name: "인스타그램", where: "오른쪽 위", dots: "⋯" };
  if (/KAKAOTALK/i.test(ua))
    return { name: "카카오톡", where: "오른쪽 아래", dots: "⋮" };
  if (/FBAN|FBAV|FB_IAB/i.test(ua))
    return { name: "페이스북", where: "오른쪽 위", dots: "⋯" };
  if (/NAVER\(inapp/i.test(ua))
    return { name: "네이버 앱", where: "오른쪽 아래", dots: "⋮" };
  if (/\bLine\//i.test(ua))
    return { name: "라인", where: "오른쪽 위", dots: "⋯" };
  if (/DaumApps|\bBAND\b|everytimeApp|Snapchat|TikTok|Twitter/i.test(ua))
    return { name: "이 앱", where: "화면 구석의", dots: "⋮" };
  return null;
}

/** 번호가 이어지는 단계 목록 — 외부 브라우저 단계와 홈 화면 단계가 하나로 이어진다 */
function StepList({ steps, start }: { steps: Step[]; start: number }) {
  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {steps.map((s, i) => (
        <li
          key={i}
          className="flex items-center gap-2 text-[11px] text-zinc-400"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-[10px] font-bold text-indigo-300">
            {start + i}
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/8 text-zinc-300">
            {s.icon}
          </span>
          <span className="flex-1">{s.text}</span>
        </li>
      ))}
    </ul>
  );
}
