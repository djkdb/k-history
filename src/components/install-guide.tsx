"use client";

import { useEffect, useState } from "react";
import { Share, MoreVertical, Plus, Download } from "lucide-react";

type Platform = "ios" | "android" | "desktop";

/**
 * 홈 화면에 앱 추가 안내.
 *
 * 이 앱은 PWA라 홈 화면에 추가하면 주소창 없이 전체 화면으로 뜨고
 * 오프라인에서도 열린다. 다만 iOS는 설치 프롬프트 API가 없어
 * 사용자가 직접 공유 메뉴를 거쳐야 하므로, 플랫폼별로 다른 안내가 필요하다.
 *
 * 이미 설치해서 standalone으로 실행 중이면 아무것도 보여주지 않는다.
 */
export function InstallGuide() {
  const [platform, setPlatform] = useState<Platform | null>(null);

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
  }, []);

  if (!platform) return null;

  const guides: Record<
    Platform,
    { title: string; steps: { icon: React.ReactNode; text: string }[] }
  > = {
    ios: {
      title: "Safari에서 홈 화면에 추가하면 앱처럼 쓸 수 있어요",
      steps: [
        { icon: <Share size={13} />, text: "하단 공유 버튼을 누르고" },
        { icon: <Plus size={13} />, text: "'홈 화면에 추가'를 선택하세요" },
      ],
    },
    android: {
      title: "홈 화면에 추가하면 앱처럼 쓸 수 있어요",
      steps: [
        { icon: <MoreVertical size={13} />, text: "우측 상단 메뉴를 누르고" },
        { icon: <Download size={13} />, text: "'앱 설치'를 선택하세요" },
      ],
    },
    desktop: {
      title: "브라우저에 설치하면 창 하나로 쓸 수 있어요",
      steps: [
        { icon: <Download size={13} />, text: "주소창 오른쪽 설치 아이콘을 누르세요" },
      ],
    },
  };

  const g = guides[platform];

  return (
    <div className="glass rounded-2xl p-3.5">
      <p className="text-xs font-semibold text-zinc-200">📱 {g.title}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {g.steps.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-[11px] text-zinc-400"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/8 text-zinc-300">
              {s.icon}
            </span>
            {s.text}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
        설치하면 주소창 없이 전체 화면으로 열리고, 인터넷이 없어도 학습·복습이
        그대로 됩니다.
      </p>
    </div>
  );
}
