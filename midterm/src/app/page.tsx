"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BookOpen, ChevronRight, ListChecks, RotateCw, Settings, Star } from "lucide-react";
import { Gate } from "@/components/gate";
import { HubLink } from "@/components/hub-link";
import { InstallHint } from "@/components/install-hint";
import { ThemeToggle } from "@/components/theme";
import { Card, ProgressBar, SectionTitle } from "@/components/ui";
import { COURSE, conceptsOf, questionsOfChapter, termLabel } from "@/lib/course";
import { setQuizPreset } from "@/lib/handoff";
import { dueCards } from "@/lib/srs";
import { useApp } from "@/lib/store";
import { daysUntil } from "@/lib/utils";

export default function Home() {
  return (
    <Gate>
      <HomeView />
    </Gate>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}(${"일월화수목금토"[d.getDay()]})`;
}

function HomeView() {
  const router = useRouter();
  const settings = useApp((s) => s.settings);
  const studied = useApp((s) => s.studied);
  const cards = useApp((s) => s.cards);
  const log = useApp((s) => s.log);
  const wrongIds = useApp((s) => s.wrongIds);
  const starred = useApp((s) => s.starred);
  const mocks = useApp((s) => s.mocks);

  const exam = settings?.examDate ?? null;
  const dday = exam ? daysUntil(exam) : null;
  const due = useMemo(() => dueCards(cards), [cards]);
  const nextConcept = COURSE.concepts.find((c) => !studied[c.id]);
  const nStudied = COURSE.concepts.filter((c) => studied[c.id]).length;
  const solved = COURSE.questions.filter((q) => log[q.id]).length;
  const rightNow = COURSE.questions.filter((q) => log[q.id]?.lastRight).length;
  const leftConcepts = COURSE.concepts.length - nStudied;
  // 남은 날에 맞춘 하루치 — 시험 전날까지 다 보도록
  const perDay = dday && dday > 1 ? Math.ceil(leftConcepts / (dday - 1)) : leftConcepts;

  const go = (preset: Parameters<typeof setQuizPreset>[0]) => {
    setQuizPreset(preset);
    router.push("/quiz");
  };

  return (
    <main className="py-6">
      <HubLink className="mb-4" />
      <header className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-indigo-300">
            {COURSE.symbol} {COURSE.code}
          </p>
          <h1 className="mt-0.5 text-[22px] font-bold leading-tight tracking-tight">{COURSE.name}</h1>
        </div>
        <ThemeToggle />
        <Link
          href="/settings"
          aria-label="설정"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10"
        >
          <Settings size={18} />
        </Link>
      </header>

      <InstallHint slot="top" />

      <Card className="mt-4">
        {exam && dday !== null ? (
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[12.5px] text-zinc-400">중간고사 {fmtDate(exam)}</p>
              <p className={`mt-0.5 text-[34px] font-black leading-none tracking-tight ${dday <= 3 ? "text-rose-300" : ""}`}>
                {dday > 0 ? `D-${dday}` : dday === 0 ? "D-DAY" : "지났어요"}
              </p>
            </div>
            {dday > 0 && leftConcepts > 0 && (
              <p className="text-right text-[12.5px] leading-relaxed text-zinc-400">
                남은 개념 {leftConcepts}개
                <br />
                하루 <b className="text-zinc-100">{perDay}개</b>씩이면 끝
              </p>
            )}
          </div>
        ) : (
          <Link href="/settings" className="flex items-center justify-between text-[14px] font-semibold">
            시험 날짜를 정해 두면 하루치를 나눠 드려요
            <ChevronRight size={16} className="text-zinc-500" />
          </Link>
        )}
      </Card>

      {COURSE.missing && COURSE.missing.length > 0 && (
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/[0.07] px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-100">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-300" />
          <span>시험 범위인데 자료가 없어 빠진 곳: {COURSE.missing.join(", ")}</span>
        </p>
      )}

      <SectionTitle>오늘 할 일</SectionTitle>
      <div className="flex flex-col gap-2">
        {due.length > 0 && (
          <Link href="/review">
            <Card className="flex items-center gap-3">
              <RotateCw size={18} className="shrink-0 text-emerald-300" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">복습 {due.length}개</p>
                <p className="text-[12.5px] text-zinc-400">잊을 때쯤 다시 묻는 개념</p>
              </div>
              <ChevronRight size={16} className="text-zinc-500" />
            </Card>
          </Link>
        )}
        {nextConcept && (
          <Link href={`/concept/${nextConcept.id}`}>
            <Card className="flex items-center gap-3">
              <BookOpen size={18} className="shrink-0 text-indigo-300" />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] text-zinc-400">이어서 볼 개념</p>
                <p className="truncate text-[14px] font-bold">{termLabel(nextConcept)}</p>
              </div>
              <ChevronRight size={16} className="text-zinc-500" />
            </Card>
          </Link>
        )}
        {wrongIds.length > 0 && (
          <button type="button" onClick={() => go({ mode: "wrong" })} className="text-left">
            <Card className="flex items-center gap-3">
              <ListChecks size={18} className="shrink-0 text-rose-300" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">틀린 문제 {wrongIds.length}개 다시</p>
                <p className="text-[12.5px] text-zinc-400">맞히면 목록에서 빠집니다</p>
              </div>
              <ChevronRight size={16} className="text-zinc-500" />
            </Card>
          </button>
        )}
        <button type="button" onClick={() => go({ mode: "all" })} className="text-left">
          <Card className="flex items-center gap-3">
            <ListChecks size={18} className="shrink-0 text-sky-300" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold">퀴즈 10문제</p>
              <p className="text-[12.5px] text-zinc-400">안 푼 것과 틀린 것부터</p>
            </div>
            <ChevronRight size={16} className="text-zinc-500" />
          </Card>
        </button>
        {starred.length > 0 && (
          <Link href="/learn?starred=1">
            <Card className="flex items-center gap-3">
              <Star size={18} className="shrink-0 text-amber-300" />
              <p className="min-w-0 flex-1 text-[14px] font-bold">별표한 개념 {starred.length}개</p>
              <ChevronRight size={16} className="text-zinc-500" />
            </Card>
          </Link>
        )}
      </div>

      <SectionTitle>진도</SectionTitle>
      <Card>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[20px] font-black">
              {nStudied}
              <span className="text-[13px] font-semibold text-zinc-500">/{COURSE.concepts.length}</span>
            </p>
            <p className="text-[11.5px] text-zinc-400">본 개념</p>
          </div>
          <div>
            <p className="text-[20px] font-black">
              {solved}
              <span className="text-[13px] font-semibold text-zinc-500">/{COURSE.questions.length}</span>
            </p>
            <p className="text-[11.5px] text-zinc-400">푼 문제</p>
          </div>
          <div>
            <p className="text-[20px] font-black">{solved ? Math.round((rightNow / solved) * 100) : 0}%</p>
            <p className="text-[11.5px] text-zinc-400">지금 맞히는 비율</p>
          </div>
        </div>
      </Card>

      <div className="mt-3 flex flex-col gap-2">
        {COURSE.chapters.map((ch) => {
          const cs = conceptsOf(ch.id);
          const qs = questionsOfChapter(ch.id);
          const done = cs.filter((c) => studied[c.id]).length;
          const ok = qs.filter((q) => log[q.id]?.lastRight).length;
          return (
            <Link key={ch.id} href={`/learn/${ch.id}`}>
              <Card className="py-3.5">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-[14px] font-bold">{ch.title}</p>
                  <span className="shrink-0 text-[12px] text-zinc-400">
                    개념 {done}/{cs.length} · 문제 {ok}/{qs.length}
                  </span>
                </div>
                <ProgressBar value={done + ok} max={cs.length + qs.length} className="mt-2" />
              </Card>
            </Link>
          );
        })}
      </div>

      {mocks.length > 0 && (
        <>
          <SectionTitle>모의고사</SectionTitle>
          <Card>
            <div className="flex items-end gap-1.5">
              {mocks.slice(-10).map((m) => {
                const pct = Math.round((m.correct / Math.max(1, m.total)) * 100);
                return (
                  <div key={m.startedAt} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10.5px] font-bold text-zinc-300">{pct}</span>
                    <div className="w-full rounded-t bg-indigo-400/70" style={{ height: `${Math.max(4, pct * 0.6)}px` }} />
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[12px] text-zinc-400">최근 {Math.min(10, mocks.length)}번 점수 (100점 만점)</p>
          </Card>
        </>
      )}

      <p className="mt-8 text-center text-[11.5px] leading-relaxed text-zinc-500">
        강의 자료를 바탕으로 만든 개인 공부용 앱입니다.
        <br />
        기록은 이 기기 안에만 남습니다.
      </p>
    </main>
  );
}
