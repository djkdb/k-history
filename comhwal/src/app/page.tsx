"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  Flame,
  Keyboard,
  RotateCcw,
  Settings as SettingsIcon,
  Sigma,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SUBJECTS, SUBJECT_MAP, subjectsFor, subjectInk } from "@/data/subjects";
import { conceptsFor } from "@/data/concepts";
import { formulasFor } from "@/data/formulas";
import { shortcutsFor } from "@/data/shortcuts";
import { dueCards, retentionRate } from "@/lib/srs";
import { ThemeToggle } from "@/components/theme";
import {
  Button,
  Card,
  ProgressBar,
  SectionTitle,
  ImportanceBadge,
  StatCard,
} from "@/components/ui";
import { cn, daysUntil, formatMinutes } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const hydrated = useApp((s) => s.hydrated);
  const settings = useApp((s) => s.settings);
  const stats = useApp((s) => s.stats);
  const studiedIds = useApp((s) => s.studiedIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const clearedFormulaIds = useApp((s) => s.clearedFormulaIds);
  const clearedShortcutIds = useApp((s) => s.clearedShortcutIds);
  const quizHistory = useApp((s) => s.quizHistory);
  const wrongIds = useApp((s) => s.wrongIds);

  // 서버에서 그린 화면과 첫 렌더가 달라지면 깜빡이므로, 시간에 기대는 값은
  // 화면이 뜬 뒤에 계산한다
  const [now, setNow] = useState(0);
  useEffect(() => setNow(Date.now()), []);

  useEffect(() => {
    if (hydrated && !settings) router.replace("/onboarding");
  }, [hydrated, settings, router]);

  const grade = settings?.grade ?? 2;

  const totals = useMemo(() => {
    const concepts = conceptsFor(grade);
    const formulas = formulasFor(grade);
    const shortcuts = shortcutsFor(grade);
    const studied = concepts.filter((c) => studiedIds.includes(c.id)).length;
    return {
      concepts: concepts.length,
      studied,
      formulas: formulas.length,
      formulasDone: formulas.filter((f) => clearedFormulaIds.includes(f.id)).length,
      shortcuts: shortcuts.length,
      shortcutsDone: shortcuts.filter((s) => clearedShortcutIds.includes(s.id))
        .length,
    };
  }, [grade, studiedIds, clearedFormulaIds, clearedShortcutIds]);

  // 아직 안 본 것 중 가장 자주 나오는 것 하나
  const nextUp = useMemo(() => {
    const rest = conceptsFor(grade).filter((c) => !studiedIds.includes(c.id));
    if (rest.length === 0) return null;
    return [...rest].sort((a, b) => b.importance - a.importance)[0];
  }, [grade, studiedIds]);

  const due = now ? dueCards(reviewCards, now).length : 0;
  const retention = now ? Math.round(retentionRate(reviewCards, now) * 100) : 0;
  const dday = settings?.examDate ? daysUntil(settings.examDate) : null;

  const recent = quizHistory.slice(-30);
  const accuracy = recent.length
    ? Math.round((recent.filter((r) => r.correct).length / recent.length) * 100)
    : null;

  if (!hydrated || !settings) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="pt-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-indigo-300">
            컴퓨터활용능력 {grade}급 · {settings.kind === "written" ? "필기" : "실기"}
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight">
            {dday === null
              ? "오늘도 한 걸음"
              : dday > 0
                ? `시험까지 ${dday}일`
                : dday === 0
                  ? "오늘이 시험일입니다"
                  : "시험일이 지났습니다"}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/settings"
            aria-label="설정"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200"
          >
            <SettingsIcon size={16} />
          </Link>
        </div>
      </header>

      {/* 시험이 코앞이면 직전 모드를 가장 크게 */}
      {dday !== null && dday >= 0 && dday <= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Link href="/cram">
            <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/15 to-orange-500/10 p-4 transition-transform active:scale-[0.99]">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-rose-300" />
                <span className="text-sm font-bold text-rose-200">
                  시험 직전 모드
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
                {dday === 0
                  ? "지금 이 순간 가장 값이 큰 것만 모았습니다."
                  : `${dday}일 남았습니다. 남은 시간에 맞춰 핵심만 훑어보세요.`}
              </p>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <StatCard
          label="연속 학습"
          value={`${stats.streak}일`}
          sub={stats.lastStudyDate ? `마지막 ${stats.lastStudyDate}` : "오늘 시작"}
          icon={<Flame size={16} />}
          accent="#f97316"
        />
        <StatCard
          label="기억 보존율"
          value={`${retention}%`}
          sub={`복습 카드 ${reviewCards.length}장`}
          icon={<Brain size={16} />}
        />
      </div>

      {due > 0 && (
        <Link href="/review" className="mt-2.5 block">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 transition-transform active:scale-[0.99]">
            <div>
              <p className="text-sm font-bold text-emerald-200">
                오늘 복습할 것 {due}개
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                지금 보면 오래 남습니다
              </p>
            </div>
            <ArrowRight size={18} className="text-emerald-300" />
          </div>
        </Link>
      )}

      {/* 틀린 것만 다시 — 점수가 가장 빨리 오르는 자리라 눈에 띄게 둔다 */}
      {wrongIds.length > 0 && (
        <Link href="/quiz?mode=wrong" className="mt-2.5 block">
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 transition-transform active:scale-[0.99]">
            <div>
              <p className="text-sm font-bold text-rose-200">
                틀렸던 것 {wrongIds.length}개
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                맞히면 목록에서 빠집니다
              </p>
            </div>
            <ArrowRight size={18} className="text-rose-300" />
          </div>
        </Link>
      )}

      {/*
        이어서 볼 개념.
        앱을 열 때마다 "그래서 뭘 보지"를 다시 고르게 하면 그 사이에 그만두게
        된다. 아직 안 본 것 중 가장 자주 나오는 것 하나를 골라 눌러만 두면
        되게 한다.
      */}
      {nextUp && (
        <Link href={`/concept/${nextUp.id}`} className="mt-2.5 block">
          <div className="glass rounded-2xl p-4 transition-transform active:scale-[0.99]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-300">
                이어서 볼 개념
              </span>
              <ImportanceBadge importance={nextUp.importance} compact />
            </div>
            <p className="mt-1.5 text-[15px] font-bold leading-snug">
              {nextUp.title}
            </p>
            <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-400">
              {nextUp.summary}
            </p>
            <p className="mt-2 text-[11px] text-zinc-600">
              {SUBJECT_MAP[nextUp.subject]?.name} · {nextUp.topic}
            </p>
          </div>
        </Link>
      )}

      <SectionTitle>바로 시작</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5">
        <QuickCard
          href="/learn"
          icon={<BookOpen size={18} />}
          title="개념 학습"
          desc={`${totals.studied} / ${totals.concepts}개`}
          value={totals.studied}
          max={totals.concepts}
          color="#6366f1"
        />
        <QuickCard
          href="/quiz"
          icon={<Brain size={18} />}
          title="필기 퀴즈"
          desc={accuracy === null ? "아직 기록 없음" : `최근 정답률 ${accuracy}%`}
          value={accuracy ?? 0}
          max={100}
          color="#8b5cf6"
        />
        <QuickCard
          href="/practical/formula"
          icon={<Sigma size={18} />}
          title="함수 수식"
          desc={`${totals.formulasDone} / ${totals.formulas}개`}
          value={totals.formulasDone}
          max={totals.formulas}
          color="#10b981"
        />
        <QuickCard
          href="/practical/shortcut"
          icon={<Keyboard size={18} />}
          title="단축키"
          desc={`${totals.shortcutsDone} / ${totals.shortcuts}개`}
          value={totals.shortcutsDone}
          max={totals.shortcuts}
          color="#f59e0b"
        />
      </div>

      <SectionTitle
        action={
          // 손가락으로 누르는 자리다 — 글자 높이만큼만 두면 너무 얇다
          <Link
            href="/learn"
            className="-mr-2 inline-flex items-center px-2 py-2 text-xs text-zinc-400 hover:text-zinc-200"
          >
            전체 보기
          </Link>
        }
      >
        과목별 진도
      </SectionTitle>
      <div className="flex flex-col gap-2.5">
        {SUBJECTS.map((s) => {
          const included = subjectsFor(grade).some((x) => x.id === s.id);
          const list = conceptsFor(grade, s.id);
          const done = list.filter((c) => studiedIds.includes(c.id)).length;
          return (
            <Link
              key={s.id}
              href={included ? `/learn/${s.id}` : "/learn"}
              className={cn(!included && "pointer-events-none")}
            >
              <Card className={cn(!included && "opacity-40")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{s.symbol}</span>
                    <div>
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {included
                          ? `${done} / ${list.length}개 학습`
                          : "1급에만 있는 과목입니다"}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: subjectInk(s.id) }}
                  >
                    {included && list.length
                      ? `${Math.round((done / list.length) * 100)}%`
                      : "—"}
                  </span>
                </div>
                {included && (
                  <ProgressBar
                    value={done}
                    max={list.length}
                    color={s.color}
                    className="mt-3"
                  />
                )}
              </Card>
            </Link>
          );
        })}
      </div>

      <SectionTitle>시험처럼 풀어 보기</SectionTitle>
      <Card>
        <div className="flex items-start gap-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-indigo-300" />
          <div className="min-w-0">
            <p className="text-sm font-bold">필기 모의고사</p>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
              {grade}급 기준 {subjectsFor(grade).length}과목 ×
              20문항, 제한 시간 {subjectsFor(grade).length * 20}분.
              한 과목이라도 40점 미만이면 과락이므로 과목별 점수까지 함께
              보여 드립니다.
            </p>
            <Link href="/mock">
              <Button size="sm" className="mt-3">
                응시하기
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <RotateCcw size={14} />
          누적 학습 {formatMinutes(stats.studyMinutes)} · XP {stats.xp}
        </div>
      </div>
    </div>
  );
}

function QuickCard({
  href,
  icon,
  title,
  desc,
  value,
  max,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="glass h-full rounded-2xl p-4 transition-transform active:scale-[0.98]">
        <span style={{ color }}>{icon}</span>
        <p className="mt-2 text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-[11px] text-zinc-500">{desc}</p>
        <ProgressBar value={value} max={max} color={color} className="mt-3" />
      </div>
    </Link>
  );
}
