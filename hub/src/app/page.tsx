"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { APPS, type AppEntry } from "@/data/apps";
import { ThemeToggle } from "@/components/theme";
import { InstallHint } from "@/components/install-hint";

/**
 * 현관.
 *
 * 다섯 앱은 각각 다른 주소에 산다. 공부 기록은 서버가 아니라 그 주소의
 * 브라우저 저장소에 남으므로, 하나로 합치면 지금까지 공부해 온 사람들의
 * 기록이 통째로 사라진다. 그래서 합치지 않고 문만 한자리에 모은다.
 *
 * 카드에는 "무엇이 들어 있는가" 를 숫자로 적는다. 다섯 개를 늘어놓고 고르라고
 * 하면서 이름만 보여 주면, 열어 보기 전에는 고를 수가 없다.
 */
export default function Home() {
  /** 마지막으로 연 곳 — 다섯 중 하나만 쓰는 사람이 대부분이다 */
  const [last, setLast] = useState<string | null>(null);
  useEffect(() => {
    try {
      setLast(localStorage.getItem("hub:last"));
    } catch {
      /* 저장소를 막아 둔 브라우저 — 없으면 없는 대로 둔다 */
    }
  }, []);

  const 고른순서 = last
    ? [
        ...APPS.filter((a) => a.id === last),
        ...APPS.filter((a) => a.id !== last),
      ]
    : APPS;

  return (
    <main className="py-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            무엇을 준비하세요?
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
            다섯 가지 시험을 각각 따로 준비합니다. 고르면 그 앱으로 넘어갑니다.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <InstallHint slot="top" />

      <div className="mt-5 flex flex-col gap-3">
        {고른순서.map((app) => (
          <AppCard key={app.id} app={app} 마지막={app.id === last} />
        ))}
      </div>

      {/*
        왜 한 앱이 아닌지 밝혀 둔다.
        다섯 개를 따로 깔라고 하면서 이유를 말하지 않으면 불친절해 보인다.
      */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-[13.5px] font-bold">왜 앱이 다섯 개인가요</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
          공부 기록은 서버가 아니라 <b className="text-zinc-200">여러분 기기 안</b>
          에만 남습니다. 계정도, 로그인도 없습니다. 그런데 브라우저는 기록을
          주소마다 따로 보관하므로, 다섯을 한 앱으로 합치면 지금까지 각 앱에서
          쌓아 온 기록이 사라집니다. 그래서 합치지 않고 들어가는 문만 여기에
          모았습니다.
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
          앱마다 따로 홈 화면에 더해 두면 각각 앱처럼 열립니다. 한 번 열어 둔
          뒤에는 <b className="text-zinc-200">망이 없어도</b> 공부할 수 있습니다.
        </p>
      </section>

      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-zinc-500">
        모든 문항은 각 시험의 공개된 출제 범위에서 직접 지어 쓴 것입니다.
        <br />
        시행 기관이 공개하지 않는 기출 문제는 싣지 않았습니다.
      </p>
    </main>
  );
}

function AppCard({ app, 마지막 }: { app: AppEntry; 마지막: boolean }) {
  return (
    <a
      href={app.url}
      onClick={() => {
        try {
          localStorage.setItem("hub:last", app.id);
        } catch {
          /* 막아 뒀으면 그냥 넘어간다 — 기억은 덤이다 */
        }
      }}
      className="block rounded-2xl border p-4 transition-transform active:scale-[0.99]"
      style={{
        background: `color-mix(in srgb, ${app.color} 9%, transparent)`,
        borderColor: `color-mix(in srgb, ${app.color} 30%, transparent)`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[18px]" aria-hidden>
          {app.symbol}
        </span>
        <h2 className="min-w-0 flex-1 truncate text-[15px] font-bold">
          {app.name}
        </h2>
        {마지막 && (
          <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
            지난번에 본 곳
          </span>
        )}
      </div>

      <p className="mt-1 text-[12px] font-semibold text-zinc-300">{app.exam}</p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-400">
        {app.tagline}
      </p>

      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {app.what.map((w) => (
          <li
            key={w}
            className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] font-semibold text-zinc-300"
          >
            {w}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-1.5 text-[12.5px] font-bold">
        <span>열기</span>
        <ArrowRight size={14} />
        {/* 다른 주소로 나간다는 것을 미리 알린다 */}
        <ExternalLink size={12} className="ml-auto shrink-0 text-zinc-500" />
      </div>
    </a>
  );
}
