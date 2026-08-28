"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Info,
  RotateCcw,
  Smartphone,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { EXAM, SUBJECTS, cutoff } from "@/data/exam";
import { CONCEPTS } from "@/data/concepts";
import { SQL_TASKS } from "@/data/sql-tasks";
import { Button, Card } from "@/components/ui";

/**
 * 첫 화면 안내.
 *
 * 기능을 늘어놓는 대신 "무엇을 하면 점수가 오르는가"의 순서로 적는다.
 * SQLD 는 읽어서 아는 것과 쳐서 맞히는 것의 거리가 유난히 먼 시험이라,
 * 그 차이를 메우는 것이 이 앱의 뼈대다.
 */
const GUIDE: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: <BookOpen size={16} />,
    title: "개념을 읽고, 그 자리에서 확인합니다",
    desc: "개념마다 아래에 확인 문제가 붙어 있습니다. '가리고 풀어 보기'를 누르면 설명이 화면에서 사라지므로, 눈으로 베끼지 않고 기억에서 꺼내게 됩니다.",
  },
  {
    icon: <Terminal size={16} />,
    title: "쿼리는 직접 쳐서 돌려 봅니다",
    desc: `브라우저 안에서 진짜 SQLite 가 돕니다. ${SQL_TASKS.length}개 실습 문제는 결과를 견주어 채점하므로, 모범 답안과 문장이 달라도 나온 값이 같으면 맞는 것으로 봅니다.`,
  },
  {
    icon: <TriangleAlert size={16} />,
    title: "헷갈리는 짝을 갈라 둡니다",
    desc: "SQLD 에서 점수를 잃는 자리는 모르는 것이 아니라 뒤바뀐 것입니다. 식별자와 비식별자, HAVING 과 WHERE, DELETE 와 TRUNCATE 처럼 짝으로 묶어 방향을 따지게 합니다.",
  },
  {
    icon: <RotateCcw size={16} />,
    title: "틀린 것은 잊을 때쯤 다시 물어봅니다",
    desc: "맞힌 것은 오늘 · 1일 · 3일 · 7일 · 14일 · 30일로 간격이 벌어지고, 틀린 것은 바로 다시 나옵니다. 복습 탭에 쌓입니다.",
  },
];

/**
 * 첫 화면.
 *
 * 물어보는 것은 하나뿐이다 — 시험일이 언제인지. 그것도 비워 둘 수 있다.
 * SQLD 는 급수도 과목 선택도 없어서 범위를 물을 이유가 없다.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const setSettings = useApp((s) => s.setSettings);
  const [examDate, setExamDate] = useState("");

  const start = () => {
    setSettings({ examDate: examDate || null, showSchema: true });
    router.replace("/");
  };

  return (
    <div className="pt-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-medium text-indigo-300">SQLD 마스터</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          모델링은 그림으로, SQL은 손으로
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          쿼리는 눈으로 읽으면 다 아는 것 같다가 시험지에서 막힙니다. 이 앱은
          브라우저 안에서 진짜 SQL을 돌려, 결과를 직접 보면서 익히게 합니다.
        </p>
      </motion.div>

      {/* 시험 구성 */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold">시험은 이렇게 생겼습니다</h2>
        <div className="flex flex-col gap-2">
          {SUBJECTS.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5"
            >
              <span className="text-lg">{s.symbol}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold">
                  {s.name}
                  <span className="ml-2 text-[11px] font-normal text-zinc-500">
                    {s.count}문항 · {s.points}점
                  </span>
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-2xl border border-rose-500/25 bg-rose-500/[0.07] p-4">
          <p className="text-[13px] font-bold text-rose-200">과락이 있습니다</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-300">
            총 {EXAM.questions}문항을 {EXAM.minutes}분에 풀고, 문항당{" "}
            {EXAM.perQuestion}점으로 {EXAM.passScore}점 이상이면 합격입니다. 다만
            과목별로 40%에 못 미치면 총점과 무관하게 불합격입니다 — 1과목{" "}
            {cutoff("modeling")}문항, 2과목 {cutoff("sql")}문항이 그 선입니다.
          </p>
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

      {/* 안내 */}
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
        SQLD 기출문제는 공개되지 않는다. 그 사실을 처음에 분명히 해 두지
        않으면 "기출인 줄 알았다"는 오해가 남는다.
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
                한국데이터산업진흥원은 SQLD 기출문제를 공개하지 않고, 시중 교재의
                문제를 옮겨 오는 것은 저작권 침해입니다. 그래서 이 앱의 문제는 공개된
                출제 범위와 표준 SQL 명세만을 근거로 AI 가 새로 쓴 것입니다
                ({CONCEPTS.length}개 개념에서 만들어집니다). 실제 시험지를 옮겨 온
                것이 아니라서 회차나 문항 번호를 적지 않습니다.
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

      {/*
        시작 단추를 화면 아래에 붙여 둔다.

        이 화면은 1700px 이 넘어서, 글 끝에만 두면 첫 화면에서 두 번을
        더 내려야 시작할 수 있었다. 처음 들어온 사람이 가장 먼저 하고
        싶은 일이 그것인데 말이다. 설명은 그대로 두고 단추만 따라다니게
        한다. 아래 차림표는 이 화면에서 숨겨져 있어 겹칠 것이 없다.
      */}
      <div className="h-24" aria-hidden />
      <div className="onboard-cta fixed inset-x-0 bottom-0 z-40 px-4 pb-safe">
        <div className="mx-auto max-w-2xl pb-3 pt-3">
          <Button size="lg" className="w-full" onClick={start}>
            시작하기
            <ArrowRight size={18} />
          </Button>
          <p className="mt-2 text-center text-[11px] text-zinc-600">
            시험일은 나중에 설정에서 바꿀 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
