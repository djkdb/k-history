"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Badge, Button, Card, SectionTitle } from "@/components/ui";
import { PARTS } from "@/data/parts";
import { grammarFor } from "@/data/grammar";
import { vocabFor } from "@/data/vocab";
import { useApp, useBand } from "@/lib/store";
import { itemOf } from "@/lib/items";
import { daysUntil } from "@/lib/utils";

/**
 * 시험 직전.
 *
 * 이 화면의 목적은 새것을 넣는 것이 아니라 **흔들리는 것을 붙잡는 것**이다.
 * 그래서 아직 안 본 것이 아니라 틀렸던 것부터 보여 준다.
 */
export default function CramPage() {
  const band = useBand();
  const examDate = useApp((s) => s.settings?.examDate ?? null);
  const wrongIds = useApp((s) => s.wrongIds);
  const known = useApp((s) => s.knownVocabIds);

  const left = examDate ? daysUntil(examDate) : null;

  const wrongItems = useMemo(
    () => wrongIds.map((id) => itemOf(id)).filter(Boolean).slice(0, 12),
    [wrongIds],
  );

  // 아직 안 외운 것 중 낮은 점수대부터 — 급할수록 기본이 점수가 된다
  const urgentVocab = useMemo(
    () =>
      vocabFor(band)
        .filter((v) => !known.includes(v.id))
        .sort((a, b) => a.band - b.band)
        .slice(0, 10),
    [band, known],
  );

  const traps = useMemo(
    () => grammarFor(band).filter((g) => g.trap).slice(0, 8),
    [band],
  );

  return (
    <main className="py-6">
      <header>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-amber-300" />
          <span className="text-[13px] font-bold text-amber-300">시험 직전 모드</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold">
          {left === null
            ? "마지막 점검"
            : left > 0
              ? `${left}일 남았습니다`
              : "오늘이 시험일입니다"}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
          지금은 새로운 것을 넣을 때가 아닙니다. 흔들리는 것을 붙잡고, 파트별로
          어디서 시간을 잃는지만 다시 확인하세요.
        </p>
      </header>

      {wrongItems.length > 0 && (
        <>
          <SectionTitle
            action={
              <Link href="/review?only=wrong" className="text-xs text-zinc-400">
                전부 풀기
              </Link>
            }
          >
            틀렸던 것부터
          </SectionTitle>
          <div className="flex flex-col gap-2">
            {wrongItems.map((item) => (
              <Link key={item!.id} href={item!.href}>
                <Card className="transition-colors hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold">{item!.front}</p>
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                        {item!.back}
                      </p>
                    </div>
                    <ArrowRight size={15} className="shrink-0 text-zinc-600" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      <SectionTitle>파트별로 시간을 잃는 자리</SectionTitle>
      <div className="flex flex-col gap-2">
        {PARTS.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] font-bold">
                Part {p.id} · {p.name}
              </p>
              <Badge>{p.count}문항</Badge>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-300" />
              <p className="text-[12px] leading-relaxed text-zinc-400">{p.trap}</p>
            </div>
          </Card>
        ))}
      </div>

      {traps.length > 0 && (
        <>
          <SectionTitle>이렇게 틀린다 — 문법</SectionTitle>
          <div className="flex flex-col gap-2">
            {traps.map((g) => (
              <Link key={g.id} href={`/grammar/${g.id}`}>
                <Card className="transition-colors hover:bg-white/[0.05]">
                  <p className="text-[13px] font-bold">{g.title}</p>
                  <p className="mt-1.5 text-[13px] font-bold leading-relaxed text-rose-200">
                    {g.trap!.wrong}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                    {g.trap!.why}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {urgentVocab.length > 0 && (
        <>
          <SectionTitle
            action={
              <Link href="/vocab?filter=todo" className="-my-2 inline-block py-2 text-xs text-zinc-400">
                더 보기
              </Link>
            }
          >
            아직 안 외운 어휘
          </SectionTitle>
          <Card>
            <div className="flex flex-col gap-2.5">
              {urgentVocab.map((v) => (
                <div key={v.id} className="flex items-baseline justify-between gap-3">
                  <span className="shrink-0 text-[14px] font-bold">{v.word}</span>
                  <span className="min-w-0 flex-1 truncate text-right text-[12px] text-zinc-400">
                    {v.meaning}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <Card className="mt-6">
        <p className="text-[13px] font-bold">시험장에서</p>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-[12px] leading-relaxed text-zinc-400">
          <li>
            Part 3·4 는 <b className="text-zinc-300">듣기 전에 문제를 먼저 읽습니다</b>.
            안내 방송이 나오는 동안이 그 시간입니다.
          </li>
          <li>
            Part 5 는 한 문항에 20초를 넘기지 않습니다. 모르면 표시하고 넘어가야 Part 7
            을 끝까지 봅니다.
          </li>
          <li>
            Part 7 은 지문보다 <b className="text-zinc-300">질문을 먼저</b> 읽습니다.
            무엇을 찾을지 알고 읽는 것과 아닌 것의 차이가 큽니다.
          </li>
          <li>답안지에 옮겨 적을 시간을 5분 남겨 둡니다. 듣기는 옮길 틈이 없습니다.</li>
        </ul>
      </Card>

      <Link href="/review">
        <Button size="lg" className="mt-6 w-full">
          복습으로
          <ArrowRight size={17} />
        </Button>
      </Link>
    </main>
  );
}
