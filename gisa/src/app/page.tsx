"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Flame,
  RotateCw,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Card,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import { PRACTICAL, SUBJECTS, WRITTEN, subjectInk } from "@/data/exam";
import { CONCEPTS, conceptsFor } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { dueCards, retentionRate } from "@/lib/srs";
import { useApp, useTrack } from "@/lib/store";
import { daysUntil } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const hydrated = useApp((s) => s.hydrated);
  const settings = useApp((s) => s.settings);
  const stats = useApp((s) => s.stats);
  const studiedIds = useApp((s) => s.studiedIds);
  const clearedQ = useApp((s) => s.clearedQuestionIds);
  const clearedP = useApp((s) => s.clearedPracticalIds);
  const cards = useApp((s) => s.reviewCards);
  const track = useTrack();

  // 처음 온 사람은 안내부터 — 기록을 불러온 뒤에 판단해야 한다.
  // 불러오기 전에 보내면 이미 쓰던 사람도 매번 안내를 다시 본다.
  useEffect(() => {
    if (hydrated && !settings) router.replace("/onboarding");
  }, [hydrated, router, settings]);

  const due = useMemo(() => dueCards(cards).length, [cards]);
  const retention = useMemo(() => retentionRate(cards), [cards]);
  const trackConcepts = useMemo(() => conceptsFor(track), [track]);
  const studiedHere = trackConcepts.filter((c) =>
    studiedIds.includes(c.id),
  ).length;
  const nextConcept = trackConcepts.find((c) => !studiedIds.includes(c.id));

  const left = settings?.examDate ? daysUntil(settings.examDate) : null;
  const isWritten = track === "written";

  return (
    <main className="py-6">
      <header className="flex items-start">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">정보처리기사</h1>
          <p className="mt-1 text-[13px] text-zinc-400">
            {isWritten
              ? `필기 · 5과목 ${WRITTEN.totalQuestions}문항 ${WRITTEN.minutes}분`
              : `실기 · 필답형 ${PRACTICAL.minutes}분 ${PRACTICAL.passScore}점`}
          </p>
        </div>
        <Link
          href="/settings"
          aria-label="설정"
          className="-m-2 shrink-0 p-2 text-zinc-500 hover:text-zinc-300"
        >
          <Settings size={19} />
        </Link>
      </header>

      {left !== null && (
        <Card className="mt-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-indigo-300" />
            <span className="text-[13px] text-zinc-300">
              {left > 0 ? (
                <>
                  시험까지{" "}
                  <b className="tabular-nums text-indigo-200">{left}일</b>
                </>
              ) : left === 0 ? (
                "오늘이 시험입니다"
              ) : (
                "시험일이 지났습니다"
              )}
            </span>
            {left > 0 && trackConcepts.length > studiedHere && (
              <span className="ml-auto shrink-0 text-[11px] text-zinc-500">
                하루 개념{" "}
                {Math.ceil((trackConcepts.length - studiedHere) / left)}개씩
              </span>
            )}
          </div>
        </Card>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <StatCard
          label="연속 학습"
          value={`${stats.streak}일`}
          icon={<Flame size={15} />}
          accent="#fb923c"
        />
        <StatCard
          label="기억 보존율"
          /* 카드가 한 장도 없을 때의 0% 는 뜻이 없다. 아직 잰 것이 없다는 뜻인데
             화면에는 "다 잊었다" 로 읽힌다. 그럴 때는 재지 않았다고 적는다. */
          value={cards.length === 0 ? "—" : `${Math.round(retention * 100)}%`}
          sub={
            cards.length === 0
              ? "아직 잰 것이 없습니다"
              : `복습 카드 ${cards.length}장`
          }
          icon={<Sparkles size={15} />}
        />
      </div>

      {due > 0 && (
        <Link href="/review">
          <Card className="mt-3 border-indigo-400/30 bg-indigo-500/10">
            <div className="flex items-center gap-2.5">
              <RotateCw size={17} className="shrink-0 text-indigo-300" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-indigo-100">
                  복습할 것이 {due}장 있습니다
                </p>
                <p className="mt-0.5 text-[12px] text-zinc-400">
                  오늘 안에 보면 기억이 가장 오래갑니다.
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-indigo-300" />
            </div>
          </Card>
        </Link>
      )}

      {nextConcept && (
        <Link href={`/concept/${nextConcept.id}`}>
          <Card className="mt-3">
            <div className="flex items-center gap-2.5">
              <BookOpen size={17} className="shrink-0 text-zinc-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-zinc-500">이어서 볼 개념</p>
                <p className="mt-0.5 truncate text-[14px] font-bold">
                  {nextConcept.title}
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-zinc-500" />
            </div>
          </Card>
        </Link>
      )}

      <SectionTitle
        action={
          <Link
            href="/learn"
            className="text-[12px] font-semibold text-indigo-300"
          >
            전체 보기
          </Link>
        }
      >
        과목별 진도
      </SectionTitle>
      <div className="flex flex-col gap-2">
        {SUBJECTS.map((s) => {
          const mine = trackConcepts.filter((c) => c.subject === s.id);
          const done = mine.filter((c) => studiedIds.includes(c.id)).length;
          return (
            <Card key={s.id}>
              <div className="flex items-center gap-2">
                <span
                  className="min-w-0 flex-1 truncate text-[13px] font-bold"
                  style={{ color: subjectInk(s.id) }}
                >
                  {s.symbol} {s.name}
                </span>
                <span className="shrink-0 text-[12px] tabular-nums text-zinc-500">
                  {done} / {mine.length}
                </span>
              </div>
              <ProgressBar
                className="mt-2"
                value={done}
                max={Math.max(1, mine.length)}
                color={s.color}
              />
              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
                {s.blurb}
              </p>
            </Card>
          );
        })}
      </div>

      <SectionTitle>실전처럼</SectionTitle>
      <div className="flex flex-col gap-2">
        <Link href="/mock">
          <Card>
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📝</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">필기 모의고사</p>
                <p className="mt-0.5 text-[12px] text-zinc-500">
                  {WRITTEN.totalQuestions}문항 {WRITTEN.minutes}분 · 과목별
                  과락까지 가립니다
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-zinc-500" />
            </div>
          </Card>
        </Link>
        <Link href="/practical/mock">
          <Card>
            <div className="flex items-center gap-2.5">
              <span className="text-lg">✍️</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">실기 모의고사</p>
                <p className="mt-0.5 text-[12px] text-zinc-500">
                  100점 만점 {PRACTICAL.minutes}분 · 적은 답을 채점합니다
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-zinc-500" />
            </div>
          </Card>
        </Link>
      </div>

      <SectionTitle>지금까지</SectionTitle>
      <Card>
        <div className="flex flex-col gap-1.5 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">본 개념</span>
            <span className="font-bold tabular-nums">
              {studiedIds.length} / {CONCEPTS.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">맞힌 필기 문항</span>
            <span className="font-bold tabular-nums">
              {clearedQ.length} / {QUESTIONS.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">맞힌 실기 문항</span>
            <span className="font-bold tabular-nums">
              {clearedP.length} / {PRACTICAL_QUESTIONS.length}
            </span>
          </div>
        </div>
        <Link href={isWritten ? "/quiz" : "/practical"}>
          <Button className="mt-3 w-full">
            {isWritten ? "필기 문제 풀기" : "실기 적어 보기"}
            <ArrowRight size={15} />
          </Button>
        </Link>
      </Card>
    </main>
  );
}
