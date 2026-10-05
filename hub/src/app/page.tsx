"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { APPS, COMBINED, hrefOf, type AppEntry } from "@/data/apps";
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
        기록이 어디에 남는지 밝혀 둔다.
        계정도 서버도 없는 앱이라, 이것을 말하지 않으면 폰을 바꾸거나 다른
        주소로 들어왔을 때 기록이 왜 없는지 알 길이 없다.
      */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        {COMBINED ? (
          <>
            <h2 className="text-[13.5px] font-bold">기록은 어디에 남나요</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
              공부 기록은 서버가 아니라 <b className="text-zinc-200">여러분 기기 안</b>
              에만 남습니다. 계정도, 로그인도 없습니다. 자격증마다 기록을 따로
              보관하므로 한국사를 풀어도 정처기 기록은 그대로입니다.
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
              예전에 자격증별 주소에서 공부하셨다면, 그 기록은 그 주소에 그대로
              남아 있습니다. 이 화면을 홈 화면에 더해 두면 앱처럼 열리고, 한 번
              열어 둔 자격증은 <b className="text-zinc-200">망이 없어도</b> 공부할 수
              있습니다.
            </p>
          </>
        ) : (
          <>
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
          </>
        )}
      </section>

      {/*
        틀린 곳을 알려 줄 길을 둔다. 문항이 수천 개라 혼자서는 다 못 찾는다.
      */}
      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-[13.5px] font-bold">틀린 곳을 찾으셨나요</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
          개념이나 문제, 해설이 틀렸거나 화면이 이상하면 인스타그램 DM 으로
          알려 주세요. 어느 자격증의 어느 화면인지 함께 적어 주시면 빨리 고칠
          수 있습니다.
        </p>
        <a
          href="https://www.instagram.com/zun_it_/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white/[0.07] px-3 py-2 text-[12.5px] font-bold text-zinc-200"
        >
          @zun_it_ 에 제보하기
          <ExternalLink size={12} className="shrink-0 text-zinc-400" />
        </a>
      </section>

      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-zinc-500">
        개인이 만든 무료 공부 앱으로, 각 시험의 시행 기관과는 관계가 없습니다.
        <br />
        한국사 모의고사는 국사편찬위원회가 공개한 기출을 출처와 함께 실었고,
        <br />
        나머지 문항은 각 시험의 공개된 출제 범위에서 직접 지어 쓴 것입니다.
        <br />
        시행 기관이 공개하지 않는 기출 문제는 싣지 않았습니다.
      </p>
    </main>
  );
}

function AppCard({ app, 마지막 }: { app: AppEntry; 마지막: boolean }) {
  return (
    <a
      href={hrefOf(app)}
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
        {/* 다른 주소로 나간다는 것을 미리 알린다 — 한 웹에 묶였으면 나가지 않는다 */}
        {!COMBINED && (
          <ExternalLink size={12} className="ml-auto shrink-0 text-zinc-500" />
        )}
      </div>
    </a>
  );
}
