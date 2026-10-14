"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { buildPlan, readHubExam, readSnap, sumDay, type Plan } from "@/lib/plan";
import { COURSES, type CourseCard } from "@/data/courses";
import { ThemeToggle } from "@/components/theme";
import { InstallHint } from "@/components/install-hint";

/**
 * 중간고사 다섯 과목의 첫 화면.
 *
 * 다섯 과목이 한 주소에 살아서, 각 과목이 이 기기에 남긴 기록(거울 사본,
 * localStorage)을 여기서 읽을 수 있다. 읽기만 한다 — 고치면 과목 앱이
 * 들고 있는 기록과 어긋난다.
 */
interface Progress {
  examDate: string | null;
  studied: number;
  solved: number;
}

function readProgress(id: string): Progress | null {
  try {
    const raw = localStorage.getItem(`mid-${id}:mirror:mid-${id}-state`);
    if (!raw) return null;
    const s = (JSON.parse(raw) as { state?: Record<string, unknown> }).state ?? {};
    const settings = s.settings as { examDate?: string | null } | null | undefined;
    return {
      examDate: settings?.examDate ?? null,
      studied: Object.keys((s.studied as object) ?? {}).length,
      solved: Object.keys((s.log as object) ?? {}).length,
    };
  } catch {
    return null;
  }
}

function dday(iso: string): number {
  const t = new Date(iso + "T00:00:00");
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  return Math.round((t.getTime() - n.getTime()) / 86_400_000);
}

function fmt(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}(${"일월화수목금토"[d.getDay()]})`;
}

export default function Home() {
  const [progress, setProgress] = useState<Record<string, Progress | null>>({});
  const [last, setLast] = useState<string | null>(null);
  // 캘린더에서 정한 시험일 (과목 앱에 날짜가 없을 때만 쓴다)
  const [hubExam, setHubExam] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setProgress(Object.fromEntries(COURSES.map((c) => [c.id, readProgress(c.id)])));
    setHubExam(Object.fromEntries(COURSES.map((c) => [c.id, readHubExam(c.id)])));
    try {
      setLast(localStorage.getItem("midhub:last"));
    } catch {
      /* 막아 둔 브라우저 */
    }
  }, []);

  // 시험이 가까운 과목부터 — 날짜를 모르면 뒤로
  const dateOf = (c: CourseCard) => progress[c.id]?.examDate ?? c.examDate ?? hubExam[c.id] ?? null;
  const ordered = [...COURSES].sort((a, b) => {
    if (a.ready !== b.ready) return a.ready ? -1 : 1;
    const da = dateOf(a), db = dateOf(b);
    if (da && db) return da.localeCompare(db);
    if (da) return -1;
    if (db) return 1;
    return 0;
  });

  return (
    <main className="mx-auto max-w-2xl py-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-indigo-300">2026년 2학기</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight">중간고사 다섯 과목</h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
            강의 자료로 만든 개념 정리 · 퀴즈 · 복습 · 모의고사. 시험이 가까운 과목부터 놓았습니다.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <InstallHint slot="top" />

      <TodayCard />

      <div className="mt-5 flex flex-col gap-3">
        {ordered.map((c) => (
          <Card key={c.id} c={c} p={progress[c.id] ?? null} exam={dateOf(c)} last={c.id === last} />
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-[13.5px] font-bold">기록은 어디에 남나요</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
          공부 기록은 서버가 아니라 <b className="text-zinc-200">이 기기 안</b>에만 남습니다. 과목마다 따로
          보관하므로 한 과목을 지워도 다른 과목은 그대로입니다. 이 화면을 홈 화면에 더해 두면 앱처럼 열리고,
          한 번 열어 둔 과목은 <b className="text-zinc-200">인터넷이 없어도</b> 공부할 수 있습니다.
        </p>
      </section>

      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-zinc-500">
        강의 자료를 바탕으로 만든 개인 공부용 앱입니다.
        <br />
        내용에 틀린 곳이 있으면 강의 자료가 우선입니다.
      </p>
    </main>
  );
}

function Card({ c, p, exam, last }: { c: CourseCard; p: Progress | null; exam: string | null; last: boolean }) {
  const d = exam ? dday(exam) : null;
  const body = (
    <div
      className="block rounded-2xl border p-4 transition-transform active:scale-[0.99]"
      style={{
        background: `color-mix(in srgb, ${c.color} 9%, transparent)`,
        borderColor: `color-mix(in srgb, ${c.color} 32%, transparent)`,
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[15px] font-black"
          style={{ background: `color-mix(in srgb, ${c.color} 25%, transparent)` }}
          aria-hidden
        >
          {c.mark}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-bold">{c.name}</h2>
          <p className="text-[12px] text-zinc-400">{c.code}</p>
        </div>
        {c.ready && d !== null && (
          <span className={`shrink-0 text-right text-[20px] font-black ${d <= 3 && d >= 0 ? "text-rose-300" : ""}`}>
            {d > 0 ? `D-${d}` : d === 0 ? "D-DAY" : "끝"}
            <span className="block text-[11px] font-semibold text-zinc-400">{fmt(exam!)}</span>
          </span>
        )}
      </div>
      {c.ready ? (
        <div className="mt-3 flex items-center gap-1.5 text-[12.5px]">
          <span className="text-zinc-300">
            {p ? `개념 ${p.studied}/${c.concepts} · 푼 문제 ${p.solved}/${c.questions}` : `개념 ${c.concepts}개 · 문제 ${c.questions}개`}
          </span>
          {last && <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold text-zinc-300">지난번</span>}
          <ArrowRight size={15} className="ml-auto shrink-0" />
        </div>
      ) : (
        <p className="mt-3 text-[12.5px] font-semibold text-zinc-400">준비 중</p>
      )}
    </div>
  );
  if (!c.ready) return <div aria-disabled="true">{body}</div>;
  return (
    <a
      href={`/${c.id}/`}
      onClick={() => {
        try {
          localStorage.setItem("midhub:last", c.id);
        } catch {
          /* 기억은 덤이다 */
        }
      }}
    >
      {body}
    </a>
  );
}

/** 오늘 할 일 한 줄 — 누르면 통합 캘린더 */
function TodayCard() {
  const [plan, setPlan] = useState<Plan | null>(null);
  useEffect(() => {
    const ready = COURSES.filter((c) => c.ready);
    setPlan(buildPlan(ready.map((c) => ({ id: c.id, snap: readSnap(c.id), defaultExam: c.examDate, hubExam: readHubExam(c.id) }))));
  }, []);
  const tasks = plan?.days[plan.today] ?? [];
  const s = sumDay(tasks);
  const exams = tasks.filter((t) => t.kind === "exam").length;
  const finals = tasks.filter((t) => t.kind === "final").length;
  return (
    <Link
      href="/plan"
      className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 transition-transform active:scale-[0.99]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200">
        <CalendarDays size={21} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold">시험 캘린더 · 오늘 할 일</span>
        <span className="mt-0.5 block text-[12.5px] text-zinc-300">
          {!plan
            ? "다섯 과목 시험일과 하루 할당량"
            : tasks.length === 0
              ? "시험일을 정하면 하루 할당량이 나와요"
              : [
                  exams ? `시험 ${exams}과목` : "",
                  s.concepts ? `새 개념 ${s.concepts}` : "",
                  s.questions ? `문제 ${s.questions}` : "",
                  s.reviews ? `복습 ${s.reviews}` : "",
                  finals ? `총정리 ${finals}과목` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
        </span>
      </span>
      <ArrowRight size={16} className="shrink-0" />
    </Link>
  );
}
