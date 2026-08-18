"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, Keyboard, RotateCcw, FileText } from "lucide-react";
import { useApp, usePractical } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * 탭 자리는 고정이다 — 손이 위치를 외우므로 순서를 바꾸지 않는다.
 * 다만 '모의' 가 어디로 가는지는 준비 중인 시험을 따른다. 실기를 고른
 * 사람이 모의를 눌렀는데 필기 시험지가 나오면, 고른 것이 아무 소용이
 * 없다는 뜻이 된다. (반대쪽 시험지로 가는 길은 각 화면에 열어 두었다)
 */
const tabsFor = (practical: boolean) => [
  { href: "/", label: "홈", icon: Home },
  { href: "/learn", label: "학습", icon: BookOpen },
  { href: "/quiz", label: "퀴즈", icon: Brain },
  { href: "/practical", label: "실기", icon: Keyboard },
  { href: practical ? "/practical/mock" : "/mock", label: "모의", icon: FileText },
  { href: "/review", label: "복습", icon: RotateCcw },
];

export function BottomNav() {
  const pathname = usePathname();
  const practical = usePractical();
  const examRunning = useApp((st) => st.examRunning);
  const TABS = tabsFor(practical);
  // 집중이 필요한 화면에서는 탭바를 숨긴다 — 실수로 눌러 이탈하면
  // 풀던 것이 날아간다. (각 화면에는 나가는 버튼이 따로 있다)
  /*
    시험을 보는 중에는 숨긴다.
    실기 모의고사는 시작 화면·응시·결과가 한 주소라, 주소만 보고 숨기면
    아직 시작도 안 한 사람이 탭바를 잃는다 — 모의 탭으로 막 들어온
    사람에게는 나갈 길이 없어진다. 그래서 '보는 중'을 따로 받는다.
  */
  if (
    examRunning ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/mock/session") ||
    pathname.startsWith("/cram")
  ) {
    return null;
  }

  return (
    <nav className="nav-shell fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-2xl px-4 pb-safe">
        <div className="nav-bar mb-2 flex items-center justify-around rounded-2xl px-2 py-2">
          {TABS.map(({ href, label, icon: Icon }) => {
            /*
              실기 탭은 /practical 로 시작하는 모든 화면에서 켜진다.
              그런데 실기 모드에서는 모의 탭도 /practical/mock 이라,
              그냥 두면 탭 두 개에 함께 불이 들어온다. 더 긴 주소가
              이기게 해서 하나만 켜지도록 한다.
            */
            const best = TABS.map((t) => t.href)
              .filter((h) => h !== "/" && pathname.startsWith(h))
              .sort((a, b) => b.length - a.length)[0];
            const active = href === "/" ? pathname === "/" : href === best;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1 transition-colors",
                  active ? "text-fg" : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {active && (
                  <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-indigo-400" />
                )}
                <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
