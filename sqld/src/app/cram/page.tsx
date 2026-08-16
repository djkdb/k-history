"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Terminal, TriangleAlert } from "lucide-react";
import { CONCEPTS } from "@/data/concepts";
import { SQL_TASKS, TOPIC_LABEL } from "@/data/sql-tasks";
import { SUBJECT_MAP, cutoff } from "@/data/exam";
import { Card, CompareTable, SqlBlock } from "@/components/ui";

/**
 * 시험 직전 모드.
 *
 * 남은 시간을 30분 / 1시간 / 3시간으로 나누되, 고르게 하지 않고 전부
 * 펼쳐 둔다. 시험 직전에 "무엇을 고를지"를 또 고민하게 만들면 그 자체가
 * 시간을 잡아먹는다. 위에서부터 읽어 내려가다 시간이 되면 덮으면 된다.
 *
 * 순서는 값이 큰 것부터다.
 *   30분  — 뒤바꿔 나오는 함정 한 줄들 (가장 자주 틀리는 자리)
 *   1시간 — 표로 외우는 것들, 그리고 반드시 쓸 줄 알아야 하는 쿼리 꼴
 *   3시간 — 최빈출 개념의 한 줄 정의 전체
 */
export default function CramPage() {
  // 30분: 중요도가 높은 개념의 함정만
  const traps = useMemo(
    () =>
      CONCEPTS.filter((c) => c.importance >= 4 && c.traps.length > 0)
        .sort((a, b) => b.importance - a.importance)
        .flatMap((c) => c.traps.map((t) => ({ ...t, from: c }))),
    [],
  );

  // 1시간: 표가 붙어 있는 개념
  const tables = useMemo(
    () => CONCEPTS.filter((c) => c.table).sort((a, b) => b.importance - a.importance),
    [],
  );

  // 1시간: 손이 기억해야 하는 쿼리 꼴
  const keyQueries = useMemo(
    () => SQL_TASKS.filter((t) => t.importance >= 5),
    [],
  );

  // 3시간: 최빈출 개념 정의
  const cores = useMemo(() => CONCEPTS.filter((c) => c.importance >= 5), []);

  return (
    <div className="pt-5">
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
        남은 시간만큼만 읽고 덮으세요.
      </p>

      {/* 과락선 — 시험장에 들어가기 전 마지막으로 확인할 숫자 */}
      <Card className="mt-4 border-amber-500/25 bg-amber-500/[0.07]">
        <p className="text-[13px] font-bold text-amber-200">숫자부터 확인</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
          50문항 90분, 총점 60점 이상. 여기에 더해 1과목은 {cutoff("modeling")}문항,
          2과목은 {cutoff("sql")}문항 아래로 내려가면 과락입니다. 2과목이 40문항이니
          시간 배분도 여기에 맞추세요.
        </p>
      </Card>

      {/* 30분 */}
      <Section
        minutes="30분이면 여기까지"
        title="뒤바꿔 나오는 것들"
        desc="SQLD 에서 점수를 가장 많이 잃는 자리입니다. 선지가 이 둘을 서로 바꿔 놓습니다."
        icon={<TriangleAlert size={15} className="text-rose-300" />}
      />
      <div className="flex flex-col gap-2">
        {traps.map((t, i) => (
          <div
            key={`${t.from.id}-${i}`}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-bold text-rose-200">{t.concept}</p>
              <span className="shrink-0 text-[10px] text-zinc-500">
                {SUBJECT_MAP[t.from.subject]?.short}
              </span>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-[1.8] text-zinc-300">
              {t.difference}
            </p>
          </div>
        ))}
      </div>

      {/* 1시간 */}
      <Section
        minutes="1시간이면 여기까지"
        title="표로 외우는 것들"
        desc="줄글로 외워지지 않는 것들입니다. 표의 모양 자체를 눈에 담으세요."
        icon={<Clock3 size={15} className="text-amber-300" />}
      />
      <div className="flex flex-col gap-3">
        {tables.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-bold">{c.title}</p>
              <span className="shrink-0 text-[10px] text-zinc-500">
                {SUBJECT_MAP[c.subject]?.short}
              </span>
            </div>
            {c.table && (
              <CompareTable
                title={c.table.title}
                headers={c.table.headers}
                rows={c.table.rows}
              />
            )}
          </Card>
        ))}
      </div>

      {/* 쿼리 꼴 */}
      <Section
        minutes="2과목이 불안하다면"
        title="반드시 쓸 줄 알아야 하는 꼴"
        desc="문장을 통째로 외우는 것이 아니라, 어느 자리에 무엇이 오는지를 봅니다."
        icon={<Terminal size={15} className="text-emerald-300" />}
      />
      <div className="flex flex-col gap-3">
        {keyQueries.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12.5px] leading-snug text-zinc-400">{t.prompt}</p>
              <span className="shrink-0 text-[10px] text-zinc-500">
                {TOPIC_LABEL[t.topic]}
              </span>
            </div>
            <SqlBlock className="mt-2">{t.answer}</SqlBlock>
            {t.trap && (
              <p className="mt-2 text-[12px] leading-relaxed text-rose-300">
                {t.trap}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* 3시간 */}
      <Section
        minutes="3시간이면 여기까지"
        title="최빈출 개념 한 줄 정의"
        desc="거의 매회 나오는 것들입니다. 한 줄씩만 확인하고 넘어가세요."
        icon={<Clock3 size={15} className="text-indigo-300" />}
      />
      <div className="flex flex-col gap-2">
        {cores.map((c) => (
          <Link key={c.id} href={`/concept/${c.id}`}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-transform active:scale-[0.99]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-bold">{c.title}</p>
                <span className="shrink-0 text-[10px] text-zinc-500">
                  {SUBJECT_MAP[c.subject]?.short}
                </span>
              </div>
              <p className="mt-1.5 text-[13.5px] leading-[1.8] text-zinc-300">
                {c.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-[12px] leading-relaxed text-zinc-500">
        여기까지 봤다면 충분합니다.
        <br />
        새로운 것을 더 넣기보다, 아는 것을 헷갈리지 않게 하는 편이 낫습니다.
      </p>
    </div>
  );
}

function Section({
  minutes,
  title,
  desc,
  icon,
}: {
  minutes: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-3 mt-9">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
          {minutes}
        </span>
      </div>
      <h2 className="mt-1.5 text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">{desc}</p>
    </div>
  );
}
