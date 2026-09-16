"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Brain, Clock, ListChecks } from "lucide-react";
import { Card, RichText, SectionTitle, SubjectBadge } from "@/components/ui";
import { CONCEPTS } from "@/data/concepts";
import { SUBJECT_MAP } from "@/data/exam";
import { useTrack } from "@/lib/store";

/**
 * 시험 직전 모드.
 *
 * 남은 시간을 30분 / 1시간 / 3시간으로 나누되, 고르게 하지 않고 전부 펼쳐
 * 둔다. 시험 직전에 "무엇을 고를지" 를 또 고민하게 만들면 그 자체가 시간을
 * 잡아먹는다. 위에서부터 읽어 내려가다 시간이 되면 덮으면 된다.
 *
 * 순서는 값이 큰 것부터다.
 *   30분  — 뒤바꿔 나오는 헷갈리는 짝 (가장 자주 틀리는 자리)
 *   1시간 — 약어와 순서처럼 통째로 외워야 하는 것
 *   3시간 — 꼭 봐야 할 개념의 한 줄 정의와 출제 포인트
 */
export default function CramPage() {
  const track = useTrack();

  const mine = useMemo(
    () => CONCEPTS.filter((c) => c.tracks.includes(track)),
    [track],
  );

  // 30분 — 헷갈리는 짝. 시험은 늘 이 둘을 바꿔 낸다.
  const traps = useMemo(
    () =>
      mine
        .filter((c) => c.traps?.length)
        .flatMap((c) => (c.traps ?? []).map((t) => ({ ...t, from: c }))),
    [mine],
  );

  // 1시간 — 약어 풀이와 순서
  const keys = useMemo(
    () =>
      mine
        .filter((c) => c.keys?.length)
        .map((c) => ({ from: c, keys: c.keys ?? [] })),
    [mine],
  );

  // 3시간 — 반드시 봐야 하는 개념
  const cores = useMemo(
    () => mine.filter((c) => c.importance === "must"),
    [mine],
  );

  return (
    <main className="py-5">
      <Link
        href="/"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        홈으로
      </Link>

      <h1 className="mt-3 text-2xl font-bold tracking-tight">시험 직전 모드</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
        값이 큰 것부터 위에 두었습니다. 아래로 내려갈수록 시간이 더 필요하니,
        남은 시간만큼만 읽고 덮으세요. {track === "written" ? "필기" : "실기"}에
        나오는 것만 골라 두었습니다.
      </p>

      {/* ── 30분 ───────────────────────────────── */}
      <Stripe
        icon={<AlertTriangle size={15} className="text-rose-300" />}
        time="30분"
        title="바꿔 내는 짝"
        desc={`${traps.length}개 — 시험이 가장 좋아하는 자리입니다. 둘을 나란히 두고 어느 쪽인지만 가려내세요.`}
        tone="rose"
      />
      <div className="mt-2.5 flex flex-col gap-2">
        {traps.map((t, i) => (
          <Card key={`${t.from.id}-${i}`} className="border-rose-500/20 bg-rose-500/[0.05]">
            <div className="flex items-center gap-2 text-[13px] font-bold">
              <span className="text-amber-200">{t.a}</span>
              <span className="text-zinc-600">↔</span>
              <span className="text-sky-200">{t.b}</span>
              <span className="ml-auto shrink-0">
                <SubjectBadge subject={t.from.subject} />
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-[1.8] text-zinc-300">
              <RichText>{t.how}</RichText>
            </p>
          </Card>
        ))}
      </div>

      {/* ── 1시간 ──────────────────────────────── */}
      <div className="mt-8">
        <Stripe
          icon={<ListChecks size={15} className="text-amber-300" />}
          time="1시간"
          title="통째로 외울 것"
          desc="약어 풀이와 순서입니다. 뜻을 아는 것으로는 부족하고 글자 그대로 나와야 합니다."
          tone="amber"
        />
      </div>
      <div className="mt-2.5 flex flex-col gap-2">
        {keys.map(({ from, keys: ks }) => (
          <Card key={from.id}>
            <div className="flex items-center gap-2">
              <SubjectBadge subject={from.subject} />
              <Link
                href={`/concept/${from.id}`}
                className="min-w-0 flex-1 truncate text-[13px] font-bold hover:text-indigo-300"
              >
                {from.title}
              </Link>
            </div>
            <dl className="mt-2 flex flex-col gap-1.5">
              {ks.map((k, i) => (
                <div key={i} className="flex items-start gap-2">
                  <dt className="w-[86px] shrink-0 text-[12.5px] font-bold text-amber-200">
                    {k.term}
                  </dt>
                  <dd className="min-w-0 flex-1 text-[12.5px] leading-[1.75] text-zinc-300">
                    <RichText>{k.mean}</RichText>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>

      {/* ── 3시간 ──────────────────────────────── */}
      <div className="mt-8">
        <Stripe
          icon={<Brain size={15} className="text-indigo-300" />}
          time="3시간"
          title="꼭 봐야 할 개념"
          desc={`${cores.length}개 — 한 줄 정의와 '시험에 어떻게 나오는가'만 모았습니다. 더 보고 싶으면 제목을 누르세요.`}
          tone="indigo"
        />
      </div>
      <div className="mt-2.5 flex flex-col gap-2">
        {cores.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center gap-2">
              <SubjectBadge subject={c.subject} />
              <Link
                href={`/concept/${c.id}`}
                className="min-w-0 flex-1 truncate text-[13px] font-bold hover:text-indigo-300"
              >
                {c.title}
              </Link>
            </div>
            <p className="mt-1.5 text-[13px] leading-[1.8] text-zinc-300">
              <RichText>{c.summary}</RichText>
            </p>
            <p className="mt-1.5 border-t border-white/5 pt-1.5 text-[12px] leading-[1.75] text-zinc-500">
              <RichText>{c.examPoint}</RichText>
            </p>
          </Card>
        ))}
      </div>

      <SectionTitle>마지막으로</SectionTitle>
      <Card>
        <p className="text-[13px] leading-[1.8] text-zinc-300">
          {track === "written"
            ? `필기는 과목마다 ${SUBJECT_MAP.design.count}문항이고, 한 과목이라도 40점에 못 미치면 평균이 아무리 높아도 떨어집니다. 남은 시간이 얼마 없다면 가장 약한 과목 하나만 붙드세요.`
            : "실기는 고르는 것이 아니라 적는 것입니다. 눈으로 아는 것과 손으로 적는 것은 다르니, 남은 시간에는 용어를 소리 내어 적어 보세요."}
        </p>
      </Card>
    </main>
  );
}

/** 시간 띠 — 이 아래부터 무엇이 나오는지 한 줄로 알린다 */
function Stripe({
  icon,
  time,
  title,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  time: string;
  title: string;
  desc: string;
  tone: "rose" | "amber" | "indigo";
}) {
  const ring = {
    rose: "border-rose-500/25 bg-rose-500/[0.07]",
    amber: "border-amber-500/25 bg-amber-500/[0.07]",
    indigo: "border-indigo-500/25 bg-indigo-500/[0.07]",
  }[tone];
  return (
    <div className={`mt-6 rounded-2xl border ${ring} px-4 py-3`}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-[15px] font-bold">{title}</h2>
        <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] font-bold text-zinc-400">
          <Clock size={12} />
          {time}
        </span>
      </div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-400">{desc}</p>
    </div>
  );
}
