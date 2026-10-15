"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CalendarDays, ChevronRight } from "lucide-react";
import { COURSES, type CourseCard } from "@/data/courses";
import { ThemeToggle } from "@/components/theme";
import {
  SCOPES,
  addDays,
  buildPlan,
  diffDays,
  fromIso,
  iso,
  readHubExam,
  readHubStart,
  readSnap,
  sumDay,
  writeHubExam,
  writeHubStart,
  type CourseState,
  type DayTask,
  type Plan,
} from "@/lib/plan";
import { cn } from "@/lib/utils";

/**
 * 통합 시험 캘린더 — 다섯 과목의 시험일 · 범위 · 하루 할당량을 한 화면에.
 * 계산은 lib/plan.ts. 여기서는 그리기만 한다.
 */
const META = Object.fromEntries(COURSES.map((c) => [c.id, c])) as Record<string, CourseCard>;
const WD = "일월화수목금토";

function md(s: string) {
  const d = fromIso(s);
  return `${d.getMonth() + 1}/${d.getDate()}(${WD[d.getDay()]})`;
}

function usePlan() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const load = useCallback(() => {
    const ready = COURSES.filter((c) => c.ready);
    const snaps = Object.fromEntries(ready.map((c) => [c.id, readSnap(c.id)]));
    setOpened(Object.fromEntries(ready.map((c) => [c.id, !!snaps[c.id]])));
    setPlan(
      buildPlan(
        ready.map((c) => ({ id: c.id, snap: snaps[c.id], defaultExam: c.examDate, hubExam: readHubExam(c.id), start: readHubStart(c.id) })),
      ),
    );
  }, []);
  useEffect(() => {
    load();
    // 과목 앱에서 공부하고 돌아오면 다시 센다
    const onVis = () => document.visibilityState === "visible" && load();
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [load]);
  return { plan, opened, reload: load };
}

export default function PlanPage() {
  const { plan, opened, reload } = usePlan();
  const [sel, setSel] = useState<string | null>(null);
  if (!plan) return <main className="py-6" />;
  const day = sel ?? plan.today;

  return (
    <main className="py-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-400">
            <ArrowLeft size={15} /> 다섯 과목
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <CalendarDays size={22} className="text-indigo-300" /> 시험 캘린더
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
            시험일까지 남은 개념·문제를 날마다 고르게 나눴어요. 시험 전날은 총정리로 비워 둡니다.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <ExamStrip plan={plan} opened={opened} onChange={reload} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="min-w-0">
          <Calendar
            plan={plan}
            sel={day}
            onSel={(d) => {
              setSel(d);
              // 폰에서는 상세가 달력 아래 — 눌렀으면 보이게 내려 준다
              if (window.innerWidth < 1024) requestAnimationFrame(() => document.getElementById("day-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }));
            }}
          />
          <Legend />
        </div>
        <div className="lg:sticky lg:top-4">
          <DayDetail plan={plan} date={day} />
        </div>
      </div>

      <ScopeSection plan={plan} />

      <p className="mt-8 text-center text-[11.5px] leading-relaxed text-zinc-500">
        이 기기에 남은 기록으로 셉니다. 다른 기기에서 공부했다면 그 과목을 한 번 열어 기록을 맞춘 뒤 돌아오세요.
      </p>
    </main>
  );
}

/* ── 시험일 띠 ─────────────────────────────────────── */

function ExamStrip({ plan, opened, onChange }: { plan: Plan; opened: Record<string, boolean>; onChange: () => void }) {
  const list = [...plan.courses].sort((a, b) => (a.exam ?? "9999").localeCompare(b.exam ?? "9999"));
  return (
    <section className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="과목별 시험일">
      {list.map((c) => {
        const m = META[c.id];
        const d = c.exam ? diffDays(plan.today, c.exam) : null;
        const pct = c.total ? Math.round((c.studied / c.total) * 100) : 0;
        return (
          <div
            key={c.id}
            className="rounded-2xl border p-3"
            style={{
              background: `color-mix(in srgb, ${m.color} 8%, transparent)`,
              borderColor: `color-mix(in srgb, ${m.color} 30%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2">
              <Mark id={c.id} />
              <a href={`/${c.id}/`} className="min-w-0 flex-1 truncate text-[13.5px] font-bold hover:underline">
                {m.name}
              </a>
              {d !== null && (
                <span className={cn("shrink-0 text-[15px] font-black", d >= 0 && d <= 3 && "text-rose-300")}>
                  {d > 0 ? `D-${d}` : d === 0 ? "D-DAY" : "끝"}
                </span>
              )}
            </div>
            {c.exam ? (
              <p className="mt-1.5 text-[12px] text-zinc-400">
                {md(c.exam)}
                {c.examFrom === "material" && " · 확정"}
                {c.examFrom === "hub" && (
                  <button
                    type="button"
                    className="ml-1 underline"
                    onClick={() => {
                      writeHubExam(c.id, null);
                      onChange();
                    }}
                  >
                    지우기
                  </button>
                )}
              </p>
            ) : (
              <label className="mt-1.5 flex items-center gap-1.5 text-[12px] text-amber-200">
                날짜 미정
                <input
                  type="date"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-transparent px-1.5 py-0.5 text-[12px] text-zinc-200"
                  onChange={(e) => {
                    if (!e.target.value) return;
                    writeHubExam(c.id, e.target.value);
                    onChange();
                  }}
                  aria-label={`${m.name} 시험일`}
                />
              </label>
            )}
            {c.exam && c.exam > plan.today && <StartPicker c={c} today={plan.today} onChange={onChange} />}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m.color }} />
            </div>
            <p className="mt-1 text-[11.5px] text-zinc-400">
              개념 {c.studied}/{c.total} · 문제 {c.solved}/{c.questions}
              {!opened[c.id] && " · 아직 안 열어 봄"}
            </p>
          </div>
        );
      })}
    </section>
  );
}

/** 이날부터 시작 — 정하지 않았으면 "지금부터"만 보이고, 누르면 날짜 칸이 열린다 */
function StartPicker({ c, today, onChange }: { c: CourseState; today: string; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  if (!c.start && !open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-1 text-[12px] text-zinc-400 underline-offset-2 hover:underline">
        시작: 지금부터 · 바꾸기
      </button>
    );
  return (
    <label className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-400">
      <span className="shrink-0">시작</span>
      <input
        type="date"
        value={c.start ?? ""}
        min={today}
        max={addDays(c.exam!, -1)}
        className="min-w-0 flex-1 rounded-lg border border-white/15 bg-transparent px-1.5 py-0.5 text-[12px] text-zinc-200"
        onChange={(e) => {
          writeHubStart(c.id, e.target.value || null);
          onChange();
        }}
        aria-label={`${META[c.id].name} 시작일 — 이 날 전에는 할당량을 잡지 않아요`}
      />
      {c.start && (
        <button
          type="button"
          className="shrink-0 underline"
          onClick={() => {
            writeHubStart(c.id, null);
            setOpen(false);
            onChange();
          }}
        >
          지금부터
        </button>
      )}
    </label>
  );
}

function Mark({ id, small }: { id: string; small?: boolean }) {
  const m = META[id];
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-lg font-black",
        small ? "h-5 min-w-5 px-1 text-[9.5px]" : "h-7 min-w-7 px-1 text-[11px]",
      )}
      style={{ background: `color-mix(in srgb, ${m.color} 28%, transparent)` }}
      aria-hidden
    >
      {m.mark}
    </span>
  );
}

/* ── 달력 ─────────────────────────────────────────── */

function Calendar({ plan, sel, onSel }: { plan: Plan; sel: string; onSel: (d: string) => void }) {
  const months = useMemo(() => {
    const exams = plan.courses.map((c) => c.exam).filter((e): e is string => !!e && e >= plan.today);
    const last = exams.length ? exams.sort().at(-1)! : addDays(plan.today, 14);
    const out: { y: number; m: number }[] = [];
    const a = fromIso(plan.today);
    const b = fromIso(last);
    for (let y = a.getFullYear(), m = a.getMonth(); y < b.getFullYear() || (y === b.getFullYear() && m <= b.getMonth()); m++) {
      if (m === 12) {
        m = 0;
        y++;
      }
      out.push({ y, m });
    }
    return out;
  }, [plan]);
  const max = Math.max(1, ...Object.values(plan.days).map((t) => sumDay(t).concepts));

  return (
    <div className="flex flex-col gap-5">
      {months.map(({ y, m }) => {
        const first = new Date(y, m, 1);
        const n = new Date(y, m + 1, 0).getDate();
        const cells: (string | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length: n }, (_, i) => iso(new Date(y, m, i + 1)))];
        while (cells.length % 7) cells.push(null);
        return (
          <section key={`${y}-${m}`} aria-label={`${y}년 ${m + 1}월`}>
            <h2 className="mb-2 text-[15px] font-bold">
              {y}년 {m + 1}월
            </h2>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-zinc-500">
              {[...WD].map((w, i) => (
                <span key={w} className={cn(i === 0 && "text-rose-300/80", i === 6 && "text-sky-300/80")}>
                  {w}
                </span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1">
              {cells.map((d, i) =>
                d ? <Cell key={d} d={d} plan={plan} max={max} on={d === sel} onSel={onSel} /> : <span key={`x${i}`} />,
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Cell({ d, plan, max, on, onSel }: { d: string; plan: Plan; max: number; on: boolean; onSel: (d: string) => void }) {
  const tasks = plan.days[d] ?? [];
  const past = d < plan.today;
  const isToday = d === plan.today;
  const exams = tasks.filter((t) => t.kind === "exam");
  const work = tasks.filter((t) => t.kind !== "exam");
  const s = sumDay(work);
  // 그날 개념이 많을수록 진하게 — 어느 날이 무거운지 한눈에
  const heat = s.concepts / max;
  return (
    <button
      type="button"
      onClick={() => onSel(d)}
      aria-pressed={on}
      aria-label={`${md(d)}${exams.length ? " 시험" : ""}${s.concepts ? ` 개념 ${s.concepts}` : ""}`}
      className={cn(
        "relative flex min-h-[64px] min-w-0 flex-col items-stretch overflow-hidden rounded-xl border p-1 text-left transition-colors sm:min-h-[84px] sm:p-1.5",
        on ? "border-indigo-400 ring-1 ring-indigo-400" : "border-white/10",
        past && "opacity-40",
      )}
      style={{ background: heat > 0 && !past ? `rgba(99,102,241,${0.05 + heat * 0.2})` : undefined }}
    >
      <span
        className={cn(
          "self-start rounded-md px-1 text-[11.5px] font-bold tabular-nums",
          isToday && "bg-indigo-500 text-white",
          fromIso(d).getDay() === 0 && !isToday && "text-rose-300/90",
        )}
      >
        {fromIso(d).getDate()}
      </span>
      {exams.length > 0 && (
        <span className="mt-0.5 flex flex-wrap gap-0.5">
          {exams.map((t) => (
            <span
              key={t.course}
              className="rounded px-1 text-[9.5px] font-black text-white"
              style={{ background: META[t.course].color }}
            >
              {META[t.course].mark}
            </span>
          ))}
          <span className="hidden text-[9.5px] font-bold text-rose-300 sm:inline">시험</span>
        </span>
      )}
      {/* 폰: 과목 점 + 개념 합계 / 넓은 화면: 과목마다 한 줄 */}
      {work.length > 0 && (
        <>
          <span className="mt-auto flex flex-wrap items-center gap-0.5 sm:hidden">
            {work.map((t) => (
              <span key={t.course} className="h-1.5 w-1.5 rounded-full" style={{ background: META[t.course].color }} />
            ))}
            {s.concepts > 0 && <span className="ml-0.5 text-[10px] font-bold tabular-nums text-zinc-300">{s.concepts}</span>}
          </span>
          <span className="mt-0.5 hidden flex-col gap-px sm:flex">
            {work.map((t) => (
              <span key={t.course} className="flex items-center gap-1 text-[10.5px] leading-tight text-zinc-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: META[t.course].color }} />
                <span className="truncate">
                  {META[t.course].mark}{" "}
                  {t.kind === "final" ? "총정리" : t.concepts.length ? `${t.concepts.length}개` : `문제 ${t.questions}`}
                </span>
              </span>
            ))}
          </span>
        </>
      )}
    </button>
  );
}

function Legend() {
  return (
    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-zinc-500">
      {COURSES.filter((c) => c.ready).map((c) => (
        <span key={c.id} className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: c.color }} /> {c.mark} {c.name}
        </span>
      ))}
      <span>· 칸이 진할수록 그날 새 개념이 많아요 · 숫자 = 그날 새로 볼 개념 수</span>
    </p>
  );
}

/* ── 하루 상세 ─────────────────────────────────────── */

function DayDetail({ plan, date }: { plan: Plan; date: string }) {
  const tasks = plan.days[date] ?? [];
  const isToday = date === plan.today;
  const s = sumDay(tasks);
  const order: Record<string, number> = { exam: 0, final: 1, learn: 2, practice: 3 };
  const sorted = [...tasks].sort((a, b) => order[a.kind] - order[b.kind]);
  return (
    <section id="day-detail" className="scroll-mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4" aria-live="polite">
      <p className="text-[12px] font-bold text-indigo-300">{isToday ? "오늘 할 일" : date < plan.today ? "지난 날" : "이날 할 일"}</p>
      <h2 className="mt-0.5 text-[18px] font-bold">{md(date)}</h2>
      {plan.courses
        .filter((c) => c.start && date < c.start)
        .map((c) => (
          <p key={c.id} className="mt-1.5 text-[12px] text-zinc-400">
            ⏳ {META[c.id].name}은 {md(c.start!)}부터 시작해요
          </p>
        ))}
      {tasks.length === 0 ? (
        <p className="mt-3 text-[13px] text-zinc-400">
          {date < plan.today ? "지난 날이에요." : "잡힌 할 일이 없어요. 시험일을 정하면 여기에 채워집니다."}
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ["새 개념", s.concepts],
              ["문제", s.questions],
              ["복습 카드", s.reviews],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-white/5 py-2">
                <p className="text-[20px] font-black tabular-nums">{v}</p>
                <p className="text-[11px] text-zinc-400">{k}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {sorted.map((t) => (
              <TaskRow key={t.course + t.kind} t={t} st={plan.courses.find((c) => c.id === t.course)!} isToday={isToday} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function TaskRow({ t, st, isToday }: { t: DayTask; st: CourseState; isToday: boolean }) {
  const m = META[t.course];
  const scope = SCOPES.find((s) => s.id === t.course)!;
  const chTitles = [...new Set(t.concepts.map((c) => c.ch))].map((id) => scope.chapters.find((c) => c.id === id)?.title ?? id);
  const btn = "rounded-lg border border-white/10 px-2.5 py-1 text-[12px] font-semibold text-zinc-200 hover:bg-white/5";
  return (
    <li className="rounded-xl border p-3" style={{ borderColor: `color-mix(in srgb, ${m.color} 30%, transparent)` }}>
      <div className="flex items-center gap-2">
        <Mark id={t.course} small />
        <p className="min-w-0 flex-1 truncate text-[13.5px] font-bold">{m.name}</p>
        {t.kind === "exam" && <span className="text-[12px] font-black text-rose-300">🎯 시험</span>}
        {t.kind === "final" && <span className="text-[12px] font-bold text-amber-200">총정리</span>}
      </div>

      {t.kind === "learn" && (
        <>
          <p className="mt-1.5 text-[13px] text-zinc-200">
            새 개념 <b>{t.concepts.length}</b>개 · 문제 <b>{t.questions}</b>
            {t.reviews > 0 && <> · 복습 <b>{t.reviews}</b></>}
          </p>
          <p className="mt-0.5 text-[12px] text-zinc-400">{chTitles.join(" · ")}</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-500">
            {t.concepts.slice(0, 4).map((c) => c.t).join(", ")}
            {t.concepts.length > 4 && ` 외 ${t.concepts.length - 4}개`}
          </p>
        </>
      )}
      {t.kind === "practice" && (
        <p className="mt-1.5 text-[13px] text-zinc-200">
          개념은 다 봤어요 — 문제 <b>{t.questions}</b>
          {t.reviews > 0 && <> · 복습 <b>{t.reviews}</b></>}
        </p>
      )}
      {t.kind === "final" && (
        <p className="mt-1.5 text-[13px] text-zinc-200">
          모의고사 1회 · 틀린 문제 <b>{t.wrong ?? 0}</b>개 다시 · 확신 오답 점검
          {t.reviews > 0 && <> · 복습 {t.reviews}</>}
        </p>
      )}
      {t.kind === "exam" && <p className="mt-1.5 text-[12.5px] text-zinc-400">컨디션 관리! 아침엔 오답 노트만 훑기.</p>}

      {isToday && (t.kind === "learn" || t.kind === "practice") && (
        <div className="mt-2 flex flex-col gap-1">
          {t.concepts.length > 0 && <Bar label="개념" done={st.todayConcepts} goal={t.concepts.length} color={m.color} />}
          {t.questions > 0 && <Bar label="문제" done={st.todayQuestions} goal={t.questions} color={m.color} />}
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {t.kind === "learn" && (
          <a className={btn} href={`/${t.course}/concept/${t.concepts[0].id}`}>
            개념 시작
          </a>
        )}
        {(t.kind === "learn" || t.kind === "practice") && (
          <a className={btn} href={`/${t.course}/quiz`}>
            퀴즈
          </a>
        )}
        {t.reviews > 0 && (
          <a className={btn} href={`/${t.course}/review`}>
            복습
          </a>
        )}
        {t.kind === "final" && (
          <>
            <a className={btn} href={`/${t.course}/mock`}>
              모의고사
            </a>
            <a className={btn} href={`/${t.course}/wrongs`}>
              오답 노트
            </a>
          </>
        )}
        {t.kind === "exam" && (
          <a className={btn} href={`/${t.course}/wrongs`}>
            오답 노트
          </a>
        )}
      </div>
    </li>
  );
}

function Bar({ label, done, goal, color }: { label: string; done: number; goal: number; color: string }) {
  const p = Math.min(1, done / goal);
  return (
    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
      <span className="w-6 shrink-0">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full" style={{ width: `${p * 100}%`, background: color }} />
      </span>
      <span className={cn("w-12 shrink-0 text-right tabular-nums", p >= 1 && "font-bold text-emerald-300")}>
        {Math.min(done, goal)}/{goal}
        {p >= 1 && " ✓"}
      </span>
    </div>
  );
}

/* ── 시험 범위 ─────────────────────────────────────── */

function ScopeSection({ plan }: { plan: Plan }) {
  return (
    <section className="mt-10">
      <h2 className="text-[17px] font-bold">시험 범위</h2>
      <p className="mt-1 text-[12.5px] text-zinc-400">받은 강의 자료 = 범위. 장마다 공부한 개념 수예요. 장을 누르면 그 장으로 가요.</p>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {plan.courses.map((c) => {
          const m = META[c.id];
          const scope = SCOPES.find((s) => s.id === c.id)!;
          return (
            <div key={c.id} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Mark id={c.id} />
                <p className="min-w-0 flex-1 truncate text-[14px] font-bold">{m.name}</p>
                <span className="text-[12px] tabular-nums text-zinc-400">
                  {c.studied}/{c.total}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1">
                {c.chapters.map((ch, i) => (
                  <li key={ch.id}>
                    <a href={`/${c.id}/learn/${ch.id}`} className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-[12.5px] hover:bg-white/5">
                      <span className="w-4 shrink-0 text-right text-[11px] tabular-nums text-zinc-500">{i + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-zinc-200">{ch.title}</span>
                      <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full rounded-full" style={{ width: `${ch.total ? (ch.done / ch.total) * 100 : 0}%`, background: m.color }} />
                      </span>
                      <span className={cn("w-9 shrink-0 text-right text-[11px] tabular-nums", ch.done === ch.total ? "text-emerald-300" : "text-zinc-500")}>
                        {ch.done}/{ch.total}
                      </span>
                      <ChevronRight size={13} className="shrink-0 text-zinc-600" />
                    </a>
                  </li>
                ))}
              </ul>
              {scope.missing.length > 0 && (
                <p className="mt-3 flex gap-1.5 rounded-lg bg-amber-500/10 p-2 text-[11.5px] leading-relaxed text-amber-200">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  <span>범위인데 자료 없음: {scope.missing.join(" · ")}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
