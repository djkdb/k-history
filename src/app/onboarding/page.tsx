"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenCheck,
  Brain,
  CalendarDays,
  ChevronLeft,
  Flame,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import type { ExamTrack } from "@/lib/types";
import { useApp } from "@/lib/store";
import { ALL_EVENTS } from "@/data/events";
import { cn, daysUntil, todayISO } from "@/lib/utils";
import { Button, Card, ProgressBar } from "@/components/ui";

const PRESETS = [3, 7, 14, 30, 60];

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const exam = useApp((s) => s.exam);
  const setExam = useApp((s) => s.setExam);

  const [step, setStep] = useState(0);
  const [track, setTrack] = useState<ExamTrack>(exam?.track ?? "advanced");
  const [date, setDate] = useState<string>(exam?.examDate ?? "");

  const dday = date ? daysUntil(date) : null;

  const plan = useMemo(() => {
    if (dday === null || dday <= 0) return null;
    const perDay = Math.min(15, Math.max(3, Math.ceil(ALL_EVENTS.length / dday)));
    return { perDay, days: dday };
  }, [dday]);

  const finish = () => {
    setExam({
      examType: "korean-history-test",
      examLabel: `한국사능력검정시험 ${track === "advanced" ? "심화" : "기본"}`,
      examDate: date,
      track,
    });
    router.replace("/");
  };

  return (
    <div className="flex min-h-dvh flex-col pt-10">
      {/* 히어로 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 text-4xl">🏛️</div>
        <h1 className="text-2xl font-bold tracking-tight">
          한국사 레전드 마스터
        </h1>
        <p className="mt-1 text-sm text-zinc-400">외우지 말고, 기억하세요</p>
      </motion.div>

      <ProgressBar value={step + 1} max={3} className="mb-8" />

      <AnimatePresence mode="wait">
        {/* 1단계: 응시 유형 */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="mb-1 text-lg font-bold">
              어떤 시험을 준비하시나요?
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              한국사능력검정시험 응시 유형을 선택하세요
            </p>
            <div className="flex flex-col gap-3">
              {(
                [
                  {
                    value: "advanced" as const,
                    title: "심화 (1·2·3급)",
                    desc: "대학·공기업·공무원 가산점 등 대부분의 용도. 50문항 / 80분",
                    icon: <GraduationCap size={22} />,
                  },
                  {
                    value: "basic" as const,
                    title: "기본 (4·5·6급)",
                    desc: "입문·청소년 응시. 50문항 / 70분",
                    icon: <BookOpenCheck size={22} />,
                  },
                ]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTrack(opt.value)}
                  className={cn(
                    "glass flex items-start gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.99]",
                    track === opt.value &&
                      "border-indigo-400/60 bg-indigo-500/10 ring-1 ring-indigo-400/40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5",
                      track === opt.value ? "text-indigo-300" : "text-zinc-500",
                    )}
                  >
                    {opt.icon}
                  </span>
                  <span>
                    <span className="block font-semibold">{opt.title}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {opt.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <Button size="lg" className="mt-8 w-full" onClick={() => setStep(1)}>
              다음
            </Button>
          </motion.div>
        )}

        {/* 2단계: 시험 날짜 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="mb-1 text-lg font-bold">시험이 언제인가요?</h2>
            <p className="mb-5 text-sm text-zinc-500">
              남은 날짜에 맞춰 학습 계획을 설계합니다
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDate(addDays(n))}
                  className={cn(
                    "glass rounded-xl py-3 text-center text-sm font-semibold transition-all active:scale-95",
                    date === addDays(n) &&
                      "border-indigo-400/60 bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-400/40",
                  )}
                >
                  D-{n}
                </button>
              ))}
              <label
                className={cn(
                  "glass flex cursor-pointer items-center justify-center gap-1 rounded-xl py-3 text-sm font-semibold",
                  date && !PRESETS.some((n) => addDays(n) === date) &&
                    "border-indigo-400/60 bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-400/40",
                )}
              >
                <CalendarDays size={15} />
                직접
                <input
                  type="date"
                  min={addDays(1)}
                  className="absolute h-0 w-0 opacity-0"
                  onChange={(e) => e.target.value && setDate(e.target.value)}
                />
              </label>
            </div>

            {dday !== null && dday > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <span className="text-3xl font-bold text-indigo-300">
                  D-{dday}
                </span>
                <p className="mt-1 text-xs text-zinc-500">
                  {date} · 시험까지 {dday}일
                </p>
              </motion.div>
            )}

            <div className="mt-8 flex gap-2">
              <Button variant="ghost" size="lg" onClick={() => setStep(0)}>
                <ChevronLeft size={18} />
              </Button>
              <Button
                size="lg"
                className="flex-1"
                disabled={!date || (dday !== null && dday <= 0)}
                onClick={() => setStep(2)}
              >
                다음
              </Button>
            </div>
          </motion.div>
        )}

        {/* 3단계: AI 학습 계획 */}
        {step === 2 && plan && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-300" />
              <h2 className="text-lg font-bold">맞춤 학습 계획</h2>
            </div>

            <Card className="mb-3 border-indigo-400/30 bg-indigo-500/10">
              <p className="text-sm leading-relaxed text-zinc-200">
                시험까지 <b className="text-indigo-300">{plan.days}일</b> —
                전체 <b>{ALL_EVENTS.length}개</b> 핵심 개념을 하루{" "}
                <b className="text-indigo-300">{plan.perDay}개</b>씩 정복하면
                망각곡선 복습까지 끝낼 수 있어요.
              </p>
            </Card>

            <div className="flex flex-col gap-2">
              {[
                {
                  icon: <BookOpenCheck size={18} />,
                  title: `새 개념 학습 · 하루 ${plan.perDay}개`,
                  desc: "출제 중요도 높은 개념부터 스토리로 각인",
                },
                {
                  icon: <RotateCcw size={18} />,
                  title: "망각곡선 복습",
                  desc: "당일→1일→3일→7일→14일→30일 자동 스케줄",
                },
                {
                  icon: <Brain size={18} />,
                  title: "데일리 퀴즈",
                  desc: "OX·객관식·순서 배열로 인출 연습",
                },
                {
                  icon: <Target size={18} />,
                  title: "취약 파트 보강",
                  desc: "오답 분석으로 약한 시대·유형 집중 공략",
                },
                ...(plan.days <= 7
                  ? [
                      {
                        icon: <Flame size={18} />,
                        title: "시험 직전 모드 집중",
                        desc: "D-7 이내 — 반드시 암기 개념 위주 최종 정리",
                      },
                    ]
                  : []),
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Card className="flex items-center gap-3">
                    <span className="text-indigo-300">{item.icon}</span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {item.title}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {item.desc}
                      </span>
                    </span>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex gap-2">
              <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
                <ChevronLeft size={18} />
              </Button>
              <Button size="lg" className="flex-1" onClick={finish}>
                {exam ? "설정 변경 완료" : "학습 시작하기"} 🚀
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
