"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, FileText, PenLine } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { PRACTICAL, SUBJECTS, WRITTEN, cutoff } from "@/data/exam";
import { useApp } from "@/lib/store";
import type { Track } from "@/lib/types";
import { daysUntil } from "@/lib/utils";

export default function Page() {
  const router = useRouter();
  const setSettings = useApp((s) => s.setSettings);
  const [step, setStep] = useState(0);
  const [track, setTrack] = useState<Track>("written");
  const [date, setDate] = useState("");

  function finish() {
    setSettings({ track, examDate: date || null });
    router.push("/");
  }

  return (
    <main className="flex min-h-[80dvh] flex-col py-8">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={
              i <= step
                ? "h-1 flex-1 rounded-full bg-indigo-400"
                : "h-1 flex-1 rounded-full bg-white/10"
            }
          />
        ))}
      </div>

      {step === 0 && (
        <div className="mt-8">
          <h1 className="text-2xl font-bold leading-snug tracking-tight">
            정보처리기사는
            <br />
            두 번 봅니다
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
            필기를 붙어야 실기를 볼 수 있고, 두 시험은 공부하는 방법이 전혀
            다릅니다. 필기는 고르고 실기는 적습니다.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Card>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-300" />
                <span className="text-[14px] font-bold">필기</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                다섯 과목 각 20문항, 모두 {WRITTEN.totalQuestions}문항{" "}
                {WRITTEN.minutes}분. 평균 {WRITTEN.passScore}점을 넘어도 한 과목이
                40점에 못 미치면 떨어집니다.
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <PenLine size={16} className="text-emerald-300" />
                <span className="text-[14px] font-bold">실기</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                필답형 {PRACTICAL.minutes}분. 100점 만점에 {PRACTICAL.passScore}점
                이상이면 합격이고 과락은 없습니다. 눈으로 아는 것과 손으로 적는
                것은 다릅니다.
              </p>
            </Card>
          </div>

          <Button size="lg" className="mt-8 w-full" onClick={() => setStep(1)}>
            다음
            <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8">
          <h1 className="text-2xl font-bold leading-snug tracking-tight">
            지금은 어느 쪽을
            <br />
            준비하나요?
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
            나중에 설정에서 바꿀 수 있습니다. 학습과 복습에서 무엇을 먼저 낼지만
            달라집니다.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setTrack("written")}
              className={
                track === "written"
                  ? "glass rounded-2xl border-indigo-400/40 bg-indigo-500/15 p-4 text-left"
                  : "glass rounded-2xl p-4 text-left"
              }
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-300" />
                <span className="text-[15px] font-bold">필기부터</span>
                {track === "written" && (
                  <Check size={15} className="ml-auto text-indigo-300" />
                )}
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">
                다섯 과목을 과락 없이 넘기는 것이 목표입니다.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setTrack("practical")}
              className={
                track === "practical"
                  ? "glass rounded-2xl border-indigo-400/40 bg-indigo-500/15 p-4 text-left"
                  : "glass rounded-2xl p-4 text-left"
              }
            >
              <div className="flex items-center gap-2">
                <PenLine size={16} className="text-emerald-300" />
                <span className="text-[15px] font-bold">실기 준비 중</span>
                {track === "practical" && (
                  <Check size={15} className="ml-auto text-indigo-300" />
                )}
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">
                필기는 붙었고, 이제 손으로 적는 연습을 합니다.
              </p>
            </button>
          </div>

          <Button size="lg" className="mt-8 w-full" onClick={() => setStep(2)}>
            다음
            <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <h1 className="text-2xl font-bold leading-snug tracking-tight">
            시험일을 알려 주세요
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
            남은 날에 맞춰 하루치를 나눠 보여 줍니다. 아직 정하지 않았다면 건너뛰어도
            됩니다.
          </p>

          <Card className="mt-6">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-indigo-300" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[14px] text-zinc-100 outline-none focus:border-indigo-400/60"
              />
            </div>
            {date && (
              <p className="mt-2 text-[12px] text-zinc-400">
                {daysUntil(date) >= 0
                  ? `${daysUntil(date)}일 남았습니다.`
                  : "지난 날짜입니다."}
              </p>
            )}
          </Card>

          <Card className="mt-3">
            <p className="text-[12px] font-bold text-zinc-300">필기 과목별 과락선</p>
            <div className="mt-2 flex flex-col gap-1">
              {SUBJECTS.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-[12px]">
                  <span className="min-w-0 flex-1 truncate text-zinc-400">
                    {s.symbol} {s.name}
                  </span>
                  <span className="shrink-0 font-bold tabular-nums text-zinc-300">
                    {cutoff(s.id)}문항
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              각 과목 20문항 중 이만큼은 맞혀야 과락을 면합니다.
            </p>
          </Card>

          <Button size="lg" className="mt-8 w-full" onClick={finish}>
            시작하기
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </main>
  );
}
