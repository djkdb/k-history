"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { HubLink } from "@/components/hub-link";
import { Button, Card } from "@/components/ui";
import { COURSE } from "@/lib/course";
import { useApp } from "@/lib/store";
import { todayISO } from "@/lib/utils";

/**
 * 처음 한 번 — 시험일만 묻는다.
 *
 * 강의 자료에 날짜가 적혀 있으면 그것을 미리 채우고 어디에 적혀 있었는지
 * 밝힌다. 적혀 있지 않으면 비워 둔다 — 날짜를 지어내면 그 날에 맞춰
 * 공부 계획을 세우게 된다.
 */
export default function Onboarding() {
  const router = useRouter();
  const setExamDate = useApp((s) => s.setExamDate);
  const [date, setDate] = useState(COURSE.examDate ?? "");
  const totalQ = COURSE.questions.length;

  const start = (d: string | null) => {
    setExamDate(d);
    router.replace("/");
  };

  return (
    <main className="page-read flex min-h-[80dvh] flex-col py-8">
      <HubLink className="mb-4" />
      <p className="text-[13px] font-semibold text-indigo-300">
        {COURSE.symbol} {COURSE.code}
        {COURSE.professor ? ` · ${COURSE.professor}` : ""}
      </p>
      <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-tight">
        {COURSE.name}
        <br />
        중간고사
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
        강의 자료 {COURSE.chapters.length}개에서 개념 {COURSE.concepts.length}개를 뽑고, 문제{" "}
        {totalQ}개를 만들었습니다. 개념을 읽고 → 퀴즈로 확인하고 → 잊을 때쯤 복습하고 → 모의고사로
        마무리합니다.
      </p>

      <Card className="mt-6">
        <label className="flex items-center gap-2 text-[14px] font-bold" htmlFor="exam-date">
          <CalendarDays size={16} className="text-indigo-300" /> 중간고사 날짜
        </label>
        <input
          id="exam-date"
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[15px] text-zinc-100 outline-none focus:border-indigo-400/60"
        />
        <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
          {COURSE.examNote ??
            "받은 강의 자료에는 시험 날짜가 없습니다. 공지된 날짜를 넣어 주세요. 나중에 설정에서 바꿀 수 있습니다."}
        </p>
      </Card>

      {COURSE.missing && COURSE.missing.length > 0 && (
        <Card className="mt-3 border-amber-400/25">
          <p className="text-[13px] font-bold text-amber-200">시험 범위인데 자료가 없는 부분</p>
          <ul className="mt-1.5 list-disc pl-5 text-[12.5px] leading-relaxed text-zinc-300">
            {COURSE.missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-8">
        <Button size="lg" className="w-full" disabled={!date} onClick={() => start(date)}>
          시작하기
        </Button>
        <button
          type="button"
          onClick={() => start(null)}
          className="py-2 text-[13px] font-semibold text-zinc-500"
        >
          날짜는 나중에 정하기
        </button>
      </div>
    </main>
  );
}
