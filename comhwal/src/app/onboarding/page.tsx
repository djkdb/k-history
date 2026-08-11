"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useApp } from "@/lib/store";
import type { ExamKind, Grade } from "@/lib/types";
import { SUBJECTS, subjectsFor } from "@/data/subjects";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * 첫 화면.
 *
 * 물어보는 것은 셋뿐이다 — 몇 급, 필기인지 실기인지, 시험일이 언제인지.
 * 급수는 범위를, 시험 종류는 첫 화면에서 무엇을 먼저 보여 줄지를,
 * 시험일은 남은 날에 맞춰 무엇을 서두를지를 정한다.
 * 셋 다 나중에 설정에서 바꿀 수 있으므로 여기서 고민할 필요는 없다.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const setSettings = useApp((s) => s.setSettings);

  const [grade, setGrade] = useState<Grade>(2);
  const [kind, setKind] = useState<ExamKind>("written");
  const [examDate, setExamDate] = useState("");

  const start = () => {
    setSettings({ grade, kind, examDate: examDate || null });
    router.replace("/");
  };

  return (
    <div className="pt-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-medium text-indigo-300">컴활 마스터</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          필기는 이해로, 실기는 손으로
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          외워서 버티는 대신 헷갈리는 짝을 갈라 두고, 실기는 실제로 손을 움직여
          익힙니다. 시작하기 전에 세 가지만 알려 주세요.
        </p>
      </motion.div>

      {/* 급수 */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold">어느 급수를 준비하세요?</h2>
        <div className="grid grid-cols-2 gap-2">
          {([2, 1] as Grade[]).map((g) => {
            const active = grade === g;
            const subjects = subjectsFor(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
                  active
                    ? "border-indigo-400/60 bg-indigo-500/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/5",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{g}급</span>
                  {active && <Check size={16} className="text-indigo-300" />}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                  {subjects.length}과목 · {subjects.map((s) => s.short).join(" / ")}
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
          1급은 2급 범위를 그대로 포함합니다. 2급으로 시작했다가 1급으로 바꿔도
          지금까지 공부한 기록은 그대로 이어집니다.
        </p>
      </section>

      {/* 시험 종류 */}
      <section className="mt-7">
        <h2 className="mb-3 text-sm font-bold">지금은 무엇을 준비하세요?</h2>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              {
                key: "written" as ExamKind,
                title: "필기",
                desc: "객관식 60분 · 과목당 20문항",
              },
              {
                key: "practical" as ExamKind,
                title: "실기",
                desc: "엑셀·액세스 실습 · 함수와 단축키",
              },
            ]
          ).map((it) => {
            const active = kind === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => setKind(it.key)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
                  active
                    ? "border-indigo-400/60 bg-indigo-500/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/5",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{it.title}</span>
                  {active && <Check size={16} className="text-indigo-300" />}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                  {it.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 시험일 */}
      <section className="mt-7">
        <h2 className="mb-3 text-sm font-bold">시험일이 정해져 있나요?</h2>
        <Card>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full bg-transparent text-base outline-none"
          />
          <p className="mt-2 text-[11px] text-zinc-500">
            비워 두어도 됩니다. 넣어 두면 남은 날에 맞춰 무엇을 먼저 볼지
            알려 드립니다.
          </p>
        </Card>
      </section>

      {/* 범위 미리보기 */}
      <section className="mt-7">
        <h2 className="mb-3 text-sm font-bold">{grade}급 시험 범위</h2>
        <div className="flex flex-col gap-2">
          {SUBJECTS.map((s) => {
            const included = subjectsFor(grade).some((x) => x.id === s.id);
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3",
                  included
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-white/5 bg-transparent opacity-40",
                )}
              >
                <span className="text-lg">{s.symbol}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {s.name}
                    {!included && (
                      <span className="ml-2 text-[11px] font-normal text-zinc-500">
                        1급에만 있음
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Button size="lg" className="mt-8 w-full" onClick={start}>
        시작하기
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}
