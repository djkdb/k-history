"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  ChevronRight,
  Clock3,
  Flame,
  NotebookPen,
  RotateCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import type { EraId, QuizType } from "@/lib/types";
import { useApp } from "@/lib/store";
import { ALL_EVENTS } from "@/data/events";
import { ERAS, ERA_MAP } from "@/data/eras";
import { dueCards, retentionRate } from "@/lib/srs";
import {
  cn,
  dDayLabel,
  daysUntil,
  formatMinutes,
  hnkGrade,
  levelFromXp,
  levelTitle,
} from "@/lib/utils";
import {
  Badge,
  Card,
  EmptyState,
  EraBadge,
  ImportanceBadge,
  ProgressBar,
  SectionTitle,
  StatCard,
} from "@/components/ui";

const TYPE_LABELS: Record<QuizType, string> = {
  ox: "OX",
  multiple: "객관식",
  order: "순서 배열",
  blank: "빈칸",
  king: "왕 맞추기",
  year: "연도 맞추기",
  event: "사건 판별",
};

function Skeleton() {
  return (
    <div className="flex flex-col gap-3 pt-8">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="glass h-24 animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const hydrated = useApp((s) => s.hydrated);
  const exam = useApp((s) => s.exam);
  const stats = useApp((s) => s.stats);
  const studiedEventIds = useApp((s) => s.studiedEventIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const quizHistory = useApp((s) => s.quizHistory);
  const wrongEventIds = useApp((s) => s.wrongEventIds);

  useEffect(() => {
    if (hydrated && !exam) router.replace("/onboarding");
  }, [hydrated, exam, router]);

  const studied = useMemo(() => new Set(studiedEventIds), [studiedEventIds]);

  const dueCount = useMemo(() => dueCards(reviewCards).length, [reviewCards]);
  const retention = useMemo(
    () => Math.round(retentionRate(reviewCards) * 100),
    [reviewCards],
  );

  const recent = useMemo(() => quizHistory.slice(-50), [quizHistory]);
  const score = recent.length
    ? Math.round((recent.filter((q) => q.correct).length / recent.length) * 100)
    : null;
  const grade = score !== null ? hnkGrade(score, exam?.track ?? "advanced") : null;

  const weakEras = useMemo(() => {
    const byEra = new Map<EraId, { total: number; correct: number }>();
    for (const q of quizHistory) {
      const cur = byEra.get(q.era) ?? { total: 0, correct: 0 };
      cur.total += 1;
      if (q.correct) cur.correct += 1;
      byEra.set(q.era, cur);
    }
    return [...byEra.entries()]
      .filter(([, v]) => v.total >= 5)
      .map(([era, v]) => ({ era, rate: v.correct / v.total, total: v.total }))
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3);
  }, [quizHistory]);

  const weakType = useMemo(() => {
    const byType = new Map<QuizType, { total: number; correct: number }>();
    for (const q of quizHistory) {
      const cur = byType.get(q.type) ?? { total: 0, correct: 0 };
      cur.total += 1;
      if (q.correct) cur.correct += 1;
      byType.set(q.type, cur);
    }
    const rows = [...byType.entries()]
      .filter(([, v]) => v.total >= 5)
      .map(([t, v]) => ({ t, rate: v.correct / v.total }))
      .sort((a, b) => a.rate - b.rate);
    return rows[0] ?? null;
  }, [quizHistory]);

  const hotEvents = useMemo(
    () =>
      ALL_EVENTS.filter((e) => e.importance === 5 && !studied.has(e.id)).slice(
        0,
        5,
      ),
    [studied],
  );

  const todayRecommend = useMemo(
    () =>
      [...ALL_EVENTS]
        .filter((e) => !studied.has(e.id))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3),
    [studied],
  );

  if (!hydrated || !exam) return <Skeleton />;

  const dday = daysUntil(exam.examDate);
  const level = levelFromXp(stats.xp);

  return (
    <div className="pt-6">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-zinc-500">{exam.examLabel}</p>
            <h1
              className={cn(
                "mt-0.5 text-4xl font-black tracking-tight",
                dday <= 7 ? "text-red-400" : "text-white",
              )}
            >
              {dDayLabel(exam.examDate)}
            </h1>
          </div>
          <Link href="/onboarding" className="text-right">
            <p className="text-xs font-semibold text-indigo-300">
              Lv.{level.level} {levelTitle(level.level)}
            </p>
            <ProgressBar
              value={level.current}
              max={level.needed}
              className="mt-1 w-24"
            />
          </Link>
        </div>
        {dday <= 7 && dday >= 0 && (
          <Link href="/cram">
            <Card className="mt-4 flex items-center justify-between border-red-500/30 bg-red-500/10">
              <span className="flex items-center gap-2 text-sm font-semibold text-red-300">
                <Flame size={16} /> 시험 직전 모드로 최종 정리하세요
              </span>
              <ChevronRight size={16} className="text-red-300" />
            </Card>
          </Link>
        )}
      </motion.header>

      {/* 오늘의 할 일 */}
      <div className="flex flex-col gap-2.5">
        {[
          {
            href: "/learn",
            icon: <BookOpen size={20} />,
            color: "#6366f1",
            title: "오늘 학습",
            desc: todayRecommend.length
              ? `추천: ${todayRecommend.map((e) => e.title).join(" · ")}`
              : "모든 개념 학습 완료!",
            count: `${studiedEventIds.length}/${ALL_EVENTS.length}`,
          },
          {
            href: "/review",
            icon: <RotateCcw size={20} />,
            color: "#10b981",
            title: "오늘 복습",
            desc:
              dueCount > 0
                ? "망각곡선이 잊기 직전이라고 알려왔어요"
                : "지금은 복습할 카드가 없어요",
            count: `${dueCount}건`,
          },
          {
            href: "/quiz",
            icon: <Brain size={20} />,
            color: "#f59e0b",
            title: "데일리 퀴즈",
            desc: "인출 연습이 곧 장기기억입니다",
            count: score !== null ? `최근 정답률 ${score}%` : "시작하기",
          },
        ].map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.07 }}
          >
            <Link href={item.href}>
              <Card className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}22`, color: item.color }}
                >
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="block truncate text-xs text-zinc-500">
                    {item.desc}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-zinc-300">
                  {item.count}
                </span>
                <ChevronRight size={16} className="shrink-0 text-zinc-600" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 통계 */}
      <SectionTitle>나의 현재 실력</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          label="예상 점수"
          value={
            score !== null ? (
              <span>
                {score}
                <span className="text-sm font-medium text-zinc-500">점</span>
                {grade ? (
                  <span className="ml-2 text-base font-bold text-indigo-300">
                    {grade.label}
                  </span>
                ) : (
                  <span className="ml-2 text-xs font-medium text-red-400">
                    합격선 미달
                  </span>
                )}
              </span>
            ) : (
              "—"
            )
          }
          sub={score !== null ? "최근 50문항 기준 · 합격선 60점" : "퀴즈를 풀면 예측을 시작해요"}
          icon={<TrendingUp size={16} />}
          accent="#6366f1"
        />
        <StatCard
          label="암기율"
          value={`${retention}%`}
          sub="망각곡선 기반 추정"
          icon={<Brain size={16} />}
          accent="#10b981"
        />
        <StatCard
          label="연속 학습"
          value={`${stats.streak}일`}
          sub={stats.streak >= 3 ? "🔥 불붙었어요" : "매일 조금씩"}
          icon={<Flame size={16} />}
          accent="#f59e0b"
        />
        <StatCard
          label="진도율"
          value={`${Math.round((studiedEventIds.length / ALL_EVENTS.length) * 100)}%`}
          sub={`${studiedEventIds.length} / ${ALL_EVENTS.length} 개념`}
          icon={<Target size={16} />}
          accent="#06b6d4"
        />
        <StatCard
          label="공부 시간"
          value={formatMinutes(Math.round(stats.totalStudyMinutes))}
          icon={<Clock3 size={16} />}
          accent="#8b5cf6"
        />
        <Link href="/wrong">
          <StatCard
            label="오답 노트"
            value={`${wrongEventIds.length}건`}
            sub="탭해서 복구하기"
            icon={<NotebookPen size={16} />}
            accent="#ef4444"
          />
        </Link>
      </div>

      {/* 약점 분석 */}
      <SectionTitle>약점 분석</SectionTitle>
      {weakEras.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Brain size={28} />}
            title="퀴즈를 풀면 분석이 시작됩니다"
            desc="시대별·유형별 정답률로 약한 부분을 짚어드려요"
          />
        </Card>
      ) : (
        <Card className="flex flex-col gap-3">
          {weakEras.map(({ era, rate }) => (
            <div key={era}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{ERA_MAP[era].symbol}</span> {ERA_MAP[era].name}
                </span>
                <span className="text-xs text-zinc-500">
                  정답률 {Math.round(rate * 100)}%
                </span>
              </div>
              <ProgressBar
                value={rate * 100}
                max={100}
                color={ERA_MAP[era].color}
              />
            </div>
          ))}
          {weakType && (
            <div className="mt-1 flex items-center gap-2 border-t border-white/5 pt-3">
              <AlertTriangle size={14} className="text-orange-400" />
              <span className="text-xs text-zinc-400">
                취약 유형:{" "}
                <Badge className="border-orange-500/30 bg-orange-500/10 text-orange-300">
                  {TYPE_LABELS[weakType.t]} {Math.round(weakType.rate * 100)}%
                </Badge>
              </span>
            </div>
          )}
        </Card>
      )}

      {/* 출제 가능성 높은 파트 */}
      {hotEvents.length > 0 && (
        <>
          <SectionTitle>시험 출제 가능성 높은 파트</SectionTitle>
          <div className="flex flex-col gap-2">
            {hotEvents.map((e) => (
              <Link key={e.id} href={`/event/${e.id}`}>
                <Card className="flex items-center gap-3">
                  <EraBadge eraId={e.era} />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {e.title}
                  </span>
                  <ImportanceBadge importance={e.importance} />
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 시대 진도 */}
      <SectionTitle
        action={
          <Link href="/learn" className="text-xs text-indigo-300">
            전체 보기
          </Link>
        }
      >
        시대별 진도
      </SectionTitle>
      <Card className="flex flex-col gap-2.5">
        {ERAS.map((era) => {
          const events = ALL_EVENTS.filter((e) => e.era === era.id);
          const done = events.filter((e) => studied.has(e.id)).length;
          return (
            <Link
              key={era.id}
              href={`/learn/${era.id}`}
              className="flex items-center gap-2.5"
            >
              <span className="w-6 text-center text-sm">{era.symbol}</span>
              <span className="w-24 shrink-0 truncate text-xs font-medium text-zinc-300">
                {era.name}
              </span>
              <ProgressBar
                value={done}
                max={events.length}
                color={era.color}
                className="flex-1"
              />
              <span className="w-10 text-right text-[10px] text-zinc-500">
                {done}/{events.length}
              </span>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
