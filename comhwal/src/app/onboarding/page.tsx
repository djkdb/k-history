"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Info,
  Keyboard,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import { useApp } from "@/lib/store";
import type { ExamKind, Grade } from "@/lib/types";
import { SUBJECTS, subjectsFor } from "@/data/subjects";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * 첫 화면 안내.
 *
 * 기능을 늘어놓는 대신 "무엇을 하면 점수가 오르는가"의 순서로 적는다.
 * 이 앱의 뼈대가 읽기 → 그 자리에서 확인 → 잊을 때쯤 다시이기 때문이다.
 */
const GUIDE: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: <BookOpen size={16} />,
    title: "개념을 읽고, 그 자리에서 확인합니다",
    desc: "개념마다 아래에 확인 문제가 붙어 있습니다. '가리고 풀어 보기'를 누르면 설명이 화면에서 사라지므로, 눈으로 베끼지 않고 기억에서 꺼내게 됩니다.",
  },
  {
    icon: <RotateCcw size={16} />,
    title: "틀린 것은 잊을 때쯤 다시 물어봅니다",
    desc: "맞힌 것은 오늘 · 1일 · 3일 · 7일 · 14일 · 30일로 간격이 벌어지고, 틀린 것은 바로 다시 나옵니다. 복습 탭에 쌓입니다.",
  },
  {
    icon: <Brain size={16} />,
    title: "헷갈리는 짝을 갈라 둡니다",
    desc: "컴활에서 점수를 가장 많이 잃는 자리는 모르는 것이 아니라 뒤바뀐 것입니다. DRAM과 SRAM, SUMIF와 SUMIFS처럼 짝으로 묶어 방향을 따지게 합니다.",
  },
  {
    icon: <Keyboard size={16} />,
    title: "실기는 손으로 익힙니다",
    desc: "조건을 읽고 수식을 직접 치면 채점해 주고, 틀리면 어디가 어긋났는지 짚어 줍니다. 단축키는 실제로 눌러서 맞힙니다.",
  },
];

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

      {/* 안내 — 첫 화면에서 한 번은 읽고 넘어가게 한다 */}
      <section className="mt-7">
        <h2 className="mb-3 text-sm font-bold">이 앱을 쓰는 방법</h2>
        <div className="flex flex-col gap-2">
          {GUIDE.map((g) => (
            <div
              key={g.title}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5"
            >
              <span className="mt-0.5 shrink-0 text-indigo-300">{g.icon}</span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold">{g.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*
        문제의 출처.
        한국사와 달리 컴활은 기출문제가 공개되지 않는다. 그 사실을 처음에
        분명히 해 두지 않으면 "기출인 줄 알았다"는 오해가 남는다.
      */}
      <section className="mt-5">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
          <div className="flex items-start gap-2">
            <Info size={15} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <p className="text-[13px] font-bold text-amber-200">
                문제는 어디서 왔나요
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-300">
                대한상공회의소는 컴퓨터활용능력 기출문제를 공개하지 않습니다.
                그래서 이 앱의 문제는 공개된 출제기준과 함수·기능 명세를
                근거로 새로 만든 것입니다. 실제 시험지를 옮겨 온 것이 아니라서
                회차나 문항 번호를 적지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-start gap-2">
            <Smartphone size={15} className="mt-0.5 shrink-0 text-zinc-400" />
            <div>
              <p className="text-[13px] font-bold">기록은 이 기기에만 남습니다</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-400">
                로그인이 없고 서버로 아무것도 보내지 않습니다. 그만큼 안전하지만,
                브라우저에서 사이트 데이터를 지우면 진도도 함께 사라집니다.
                기기를 바꾸면 처음부터 시작합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Button size="lg" className="mt-6 w-full" onClick={start}>
        시작하기
        <ArrowRight size={18} />
      </Button>
      <p className="mt-2 text-center text-[11px] text-zinc-600">
        고른 것은 모두 나중에 설정에서 바꿀 수 있습니다
      </p>
    </div>
  );
}
