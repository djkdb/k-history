"use client";

import Link from "next/link";
import { ArrowRight, Keyboard, Grid3x3, Zap } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { CONCEPTS } from "@/data/concepts";
import { inGrade } from "@/data/subjects";
import { shortcutPool } from "@/lib/game";
import { useApp, useGrade } from "@/lib/store";

/**
 * 게임.
 *
 * 문제를 따로 지어 넣지 않았다. 이 앱에는 이미 개념마다 "헷갈리는 짝" 이
 * 있고, 그 안에 시험처럼 생긴 **일부러 뒤바꾼 틀린 설명**이 함께 적혀 있다.
 * 단축키도 눌러서 맞히는 자료가 그대로 있다. 게임은 그것을 다른 방식으로
 * 묻는 것뿐이다 — 게임에서 맞힌 것이 곧 시험에서 맞히는 것이 되어야
 * 게임을 한 시간이 공부한 시간이 된다.
 *
 * 그래서 여기서 틀린 것도 복습 큐로 들어간다. 놀고 끝나는 화면이 아니다.
 */
export default function GamePage() {
  const grade = useGrade();
  const hydrated = useApp((s) => s.hydrated);
  const best = useApp((s) => s.gameBest);

  const 함정수 = CONCEPTS.filter((c) => inGrade(grade, c.minGrade)).reduce(
    (n, c) => n + (c.traps ?? []).length,
    0,
  );
  const 단축키수 = shortcutPool(grade).length;
  const 개념수 = CONCEPTS.filter((c) => inGrade(grade, c.minGrade)).length;

  if (!hydrated) return <main className="py-20" />;

  return (
    <main className="py-6">
      <h1 className="text-2xl font-bold tracking-tight">게임</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
        짧게 끊어 가며 익히는 세 가지입니다. 여기서 틀린 것도{" "}
        <b className="text-zinc-200">복습 목록으로 들어갑니다</b> — 놀고 끝나지
        않습니다.
      </p>

      <SectionTitle>오늘 뭘 해볼까요</SectionTitle>
      <div className="flex flex-col gap-3">
        <GameCard
          href="/game/ox"
          icon={<Zap size={17} />}
          color="#f59e0b"
          title="O/X 번개"
          desc="맞는 설명인지 아닌지 10초 안에 고릅니다. 시험의 '옳지 않은 것' 이 이 모양입니다."
          stock={`헷갈리는 짝 ${함정수}개`}
          best={best.ox ? `최고 ${best.ox}연속` : null}
        />
        <GameCard
          href="/game/keys"
          icon={<Keyboard size={17} />}
          color="#10b981"
          title="단축키 치기"
          desc="동작을 보고 키를 맞힙니다. 자판이 있으면 그대로 누르고, 폰에서는 조각을 눌러 맞춥니다."
          stock={`단축키 ${단축키수}개`}
          best={best.keys ? `최고 ${best.keys}개` : null}
        />
        <GameCard
          href="/game/match"
          icon={<Grid3x3 size={17} />}
          color="#6366f1"
          title="짝 맞추기"
          desc="용어와 뜻을 뒤집어 맞춥니다. 처음 뒤집어 바로 맞히면 아는 것으로 셉니다."
          stock={`개념 ${개념수}개`}
          best={best.match ? `최소 ${best.match}번 만에` : null}
        />
      </div>

      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-zinc-500">
        지금은 {grade}급 기준입니다. 설정에서 급수를 바꾸면 나오는 것도 바뀝니다.
      </p>
    </main>
  );
}

function GameCard({
  href,
  icon,
  color,
  title,
  desc,
  stock,
  best,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  stock: string;
  best: string | null;
}) {
  return (
    <Link href={href}>
      <Card className="transition-transform active:scale-[0.99]">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <h2 className="min-w-0 flex-1 text-[15px] font-bold">{title}</h2>
          {best && (
            <span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
              {best}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-400">
          {desc}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold">
          <span className="text-zinc-500">{stock}</span>
          <span className="ml-auto inline-flex items-center gap-1">
            시작
            <ArrowRight size={13} />
          </span>
        </div>
      </Card>
    </Link>
  );
}
