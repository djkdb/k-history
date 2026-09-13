"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock, PenLine, Play } from "lucide-react";
import { Button, Card, SectionTitle } from "@/components/ui";
import { PRACTICAL } from "@/data/exam";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { useApp } from "@/lib/store";
import { readPractical } from "@/lib/mock-progress";
import { formatClock } from "@/lib/utils";

export default function Page() {
  const attempts = useApp((s) => s.mockAttempts).filter((a) => a.track === "practical");
  const [resume, setResume] = useState<ReturnType<typeof readPractical>>(null);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    setResume(readPractical());
    setSeed(Math.floor(Math.random() * 1_000_000) + 1);
  }, []);

  return (
    <main className="py-6">
      <h1 className="text-xl font-bold tracking-tight">실기 모의고사</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        필답형 {PRACTICAL.minutes}분, 100점 만점에 {PRACTICAL.passScore}점 이상이면
        합격입니다. 과락은 없습니다.
      </p>

      {resume && (
        <Card className="mt-4 border-indigo-400/30 bg-indigo-500/10">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-indigo-300" />
            <span className="text-[13px] font-bold text-indigo-100">보던 시험이 있습니다</span>
          </div>
          <p className="mt-1.5 text-[12px] text-zinc-300">
            {Object.values(resume.inputs).filter((v) => v.trim()).length}문항까지 적었고, 남은
            시간 {formatClock(Math.max(0, resume.endsAt - Date.now()))} 입니다.
          </p>
          <Link href={`/practical/mock/session?seed=${resume.seed}`}>
            <Button className="mt-3 w-full">
              <Play size={15} />
              이어서 보기
            </Button>
          </Link>
        </Card>
      )}

      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <PenLine size={16} className="text-indigo-300" />
          <span className="text-[15px] font-bold">한 회 보기</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
          배점이 다른 문항을 골라 딱 100점을 채웁니다. 용어·빈칸·코드 출력·SQL 이
          섞여 나옵니다.
        </p>
        <Link href={`/practical/mock/session?seed=${seed}`}>
          <Button size="lg" className="mt-4 w-full">
            시작하기
            <ArrowRight size={16} />
          </Button>
        </Link>
      </Card>

      <Card className="mt-3 border-amber-400/25 bg-amber-500/[0.07]">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <p className="text-[12px] font-bold text-amber-200">채점에 대해</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-300">
              이 앱은 적어 둔 답과 견주어 자동으로 채점합니다. 한글·영문 표기,
              괄호 병기, 공백 정도는 받아 주지만 실제 시험처럼 사람이 뜻을 읽어
              주지는 못합니다. 부분점수도 주지 않습니다. 실제보다 박하게 나올 수
              있으니 틀렸다고 표시된 답은 모범 답안과 직접 견주어 보세요.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-400">
              지금 가진 실기 문항은 {PRACTICAL_QUESTIONS.length}개입니다. 두 회를
              연달아 보면 넷에 하나 남짓은 같은 문항이 다시 나옵니다(200번 재어 본
              중앙값 42%). 점수보다 어떤 유형에서 손이 멎는지를 보세요.
            </p>
          </div>
        </div>
      </Card>

      {attempts.length > 0 && (
        <>
          <SectionTitle>지난 응시</SectionTitle>
          <div className="flex flex-col gap-2">
            {[...attempts]
              .reverse()
              .slice(0, 10)
              .map((a) => (
                <Card key={a.startedAt}>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        a.passed
                          ? "text-[14px] font-bold text-emerald-300"
                          : "text-[14px] font-bold text-rose-300"
                      }
                    >
                      {a.earned ?? a.score}점
                    </span>
                    <span className="text-[12px] text-zinc-500">
                      / {a.max ?? 100}점 · {a.passed ? "합격선 위" : "합격선 아래"}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] text-zinc-600">
                      {new Date(a.finishedAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </Card>
              ))}
          </div>
        </>
      )}
    </main>
  );
}
