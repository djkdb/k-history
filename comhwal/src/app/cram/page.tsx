"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Keyboard, Sigma, TriangleAlert } from "lucide-react";
import { useGrade, usePractical } from "@/lib/store";
import { conceptsFor } from "@/data/concepts";
import { formulasFor } from "@/data/formulas";
import { shortcutsFor } from "@/data/shortcuts";
import { SUBJECT_MAP } from "@/data/subjects";
import { Card, CompareTable, KeyCaps } from "@/components/ui";

/**
 * 시험 직전 모드.
 *
 * 남은 시간을 30분 / 1시간 / 3시간으로 나누되, 고르게 하지 않고 전부
 * 펼쳐 둔다. 시험 직전에 "무엇을 고를지"를 또 고민하게 만들면 그 자체가
 * 시간을 잡아먹는다. 위에서부터 읽어 내려가다 시간이 되면 덮으면 된다.
 *
 * 순서는 값이 큰 것부터다.
 *   30분 — 뒤바꿔 나오는 함정 한 줄들 (가장 자주 틀리는 자리)
 *   1시간 — 표로 외우는 것들 (오류값·서식 코드·정규화 단계)
 *   3시간 — 최빈출 개념의 한 줄 정의 전체
 */
export default function CramPage() {
  const grade = useGrade();
  const practical = usePractical();

  const concepts = useMemo(() => conceptsFor(grade), [grade]);

  // 30분: 중요도가 높은 개념의 함정만
  const traps = useMemo(
    () =>
      concepts
        .filter((c) => c.importance >= 4 && c.traps.length > 0)
        .sort((a, b) => b.importance - a.importance)
        .flatMap((c) => c.traps.map((t) => ({ ...t, concept: t.concept, from: c }))),
    [concepts],
  );

  // 1시간: 표가 붙어 있는 개념
  const tables = useMemo(
    () => concepts.filter((c) => c.table).sort((a, b) => b.importance - a.importance),
    [concepts],
  );

  // 3시간: 최빈출 개념 정의
  const cores = useMemo(
    () => concepts.filter((c) => c.importance >= 5),
    [concepts],
  );

  const keyFormulas = useMemo(
    () => formulasFor(grade).filter((f) => f.importance >= 5),
    [grade],
  );
  const keyShortcuts = useMemo(
    () => shortcutsFor(grade).filter((s) => s.importance >= 5),
    [grade],
  );

  return (
    <div className="pt-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        홈으로
      </Link>

      <h1 className="mt-3 text-2xl font-bold tracking-tight">시험 직전 모드</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
        값이 큰 것부터 위에 두었습니다. 아래로 내려갈수록 시간이 더
        필요하니, 남은 시간만큼만 읽고 덮으세요.
      </p>

      {/*
        순서는 준비 중인 시험이 정한다.
        실기를 보는 사람에게 개념 함정부터 내밀면, 정작 손이 기억해야
        할 수식과 단축키는 스크롤 한참 아래에 있다. 시험 직전에 그건
        없는 것과 같다. 내용은 그대로 두고 순서만 뒤집는다.
      */}
      {practical ? (
        <>
        {/* 실기 */}
        <Section
          minutes={practical ? "실기 — 여기부터" : "실기라면 이것부터"}
          title="손이 먼저 기억해야 하는 것"
          desc="시험장에서 메뉴를 뒤지면 시간이 모자랍니다."
          icon={<Keyboard size={15} className="text-emerald-300" />}
        />
        <Card>
          <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold">
            <Keyboard size={14} />
            반드시 아는 단축키
          </p>
          <div className="flex flex-col gap-2.5">
            {keyShortcuts.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 text-[13px] leading-snug text-zinc-300">
                  {s.action}
                </span>
                <span className="shrink-0">
                  <KeyCaps combo={s.display} />
                </span>
              </div>
            ))}
          </div>
        </Card>
  
        <Card className="mt-3">
          <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold">
            <Sigma size={14} />
            반드시 아는 수식 꼴
          </p>
          <div className="flex flex-col gap-3">
            {keyFormulas.map((f) => (
              <div key={f.id}>
                <p className="text-[12.5px] leading-snug text-zinc-400">{f.prompt}</p>
                <p className="mono mt-1 text-[13.5px] font-bold text-emerald-300">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </Card>
  
        {/* 30분 */}
        <Section
          minutes="30분이면 여기까지"
          title="뒤바꿔 나오는 것들"
          desc="컴활에서 점수를 가장 많이 잃는 자리입니다. 선지가 이 둘을 서로 바꿔 놓습니다."
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
  
        </>
      ) : (
        <>
        {/* 30분 */}
        <Section
          minutes="30분이면 여기까지"
          title="뒤바꿔 나오는 것들"
          desc="컴활에서 점수를 가장 많이 잃는 자리입니다. 선지가 이 둘을 서로 바꿔 놓습니다."
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
  
        {/* 실기 */}
        <Section
          minutes={practical ? "실기 — 여기부터" : "실기라면 이것부터"}
          title="손이 먼저 기억해야 하는 것"
          desc="시험장에서 메뉴를 뒤지면 시간이 모자랍니다."
          icon={<Keyboard size={15} className="text-emerald-300" />}
        />
        <Card>
          <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold">
            <Keyboard size={14} />
            반드시 아는 단축키
          </p>
          <div className="flex flex-col gap-2.5">
            {keyShortcuts.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 text-[13px] leading-snug text-zinc-300">
                  {s.action}
                </span>
                <span className="shrink-0">
                  <KeyCaps combo={s.display} />
                </span>
              </div>
            ))}
          </div>
        </Card>
  
        <Card className="mt-3">
          <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold">
            <Sigma size={14} />
            반드시 아는 수식 꼴
          </p>
          <div className="flex flex-col gap-3">
            {keyFormulas.map((f) => (
              <div key={f.id}>
                <p className="text-[12.5px] leading-snug text-zinc-400">{f.prompt}</p>
                <p className="mono mt-1 text-[13.5px] font-bold text-emerald-300">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </Card>
  
        </>
      )}

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
