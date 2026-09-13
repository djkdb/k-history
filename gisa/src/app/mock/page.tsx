"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock, FileText, Play } from "lucide-react";
import { Button, Card, SectionTitle } from "@/components/ui";
import { SUBJECTS, SUBJECT_MAP, WRITTEN, cutoff, subjectInk } from "@/data/exam";
import { QUESTIONS } from "@/data/questions";
import { useApp } from "@/lib/store";
import { readWritten } from "@/lib/mock-progress";
import { formatClock } from "@/lib/utils";

export default function Page() {
  const attempts = useApp((s) => s.mockAttempts).filter((a) => a.track === "written");
  const [resume, setResume] = useState<ReturnType<typeof readWritten>>(null);
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    setResume(readWritten());
    setSeed(Math.floor(Math.random() * 1_000_000) + 1);
  }, []);

  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0);

  return (
    <main className="py-6">
      <h1 className="text-xl font-bold tracking-tight">필기 모의고사</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        실제 필기와 같은 구성입니다 — 다섯 과목 각 20문항, 모두{" "}
        {WRITTEN.totalQuestions}문항 {WRITTEN.minutes}분.
      </p>

      {resume && (
        <Card className="mt-4 border-indigo-400/30 bg-indigo-500/10">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-indigo-300" />
            <span className="text-[13px] font-bold text-indigo-100">보던 시험이 있습니다</span>
          </div>
          <p className="mt-1.5 text-[12px] text-zinc-300">
            {Object.keys(resume.answers).length}문항까지 답했고, 남은 시간{" "}
            {formatClock(Math.max(0, resume.endsAt - Date.now()))} 입니다.
          </p>
          <Link href={`/mock/session?seed=${resume.seed}`}>
            <Button className="mt-3 w-full">
              <Play size={15} />
              이어서 보기
            </Button>
          </Link>
        </Card>
      )}

      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-indigo-300" />
          <span className="text-[15px] font-bold">한 회 보기</span>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {SUBJECTS.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-[12px]">
              <span className="w-[74px] shrink-0 font-semibold" style={{ color: subjectInk(s.id) }}>
                {s.symbol} {s.short}
              </span>
              <span className="min-w-0 flex-1 text-zinc-500">
                {s.count}문항 · {cutoff(s.id)}문항 미만이면 과락
              </span>
            </div>
          ))}
        </div>
        <Link href={`/mock/session?seed=${seed}`}>
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
            <p className="text-[12px] font-bold text-amber-200">먼저 알아 두세요</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-300">
              이 앱이 가진 문항은 {QUESTIONS.length}개입니다. 100문항을 뽑으므로 두 회를
              연달아 보면 열에 아홉은 같은 문항이 다시 나옵니다. 점수를 실력으로
              읽지 마시고, 과목별로 어디가 무너지는지를 보는 용도로 쓰세요.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-400">
              문항은 공개된 출제 범위에 맞춰 새로 쓴 것입니다. 한국산업인력공단은
              정보처리기사 기출문제를 공개하지 않습니다. 시험 전에 큐넷에서 지금
              적용되는 출제기준을 한 번 확인하세요.
            </p>
          </div>
        </div>
      </Card>

      {attempts.length > 0 && (
        <>
          <SectionTitle>지난 응시</SectionTitle>
          <p className="-mt-1 mb-3 text-[12px] text-zinc-500">
            가장 높은 점수 {best}점 · {attempts.length}회 응시
          </p>
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
                      {a.score}점
                    </span>
                    <span className="text-[12px] text-zinc-500">
                      {a.passed ? "합격선 위" : "합격선 아래"}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] text-zinc-600">
                      {new Date(a.finishedAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.bySubject.map((b) => {
                      const under = b.correct < cutoff(b.subject);
                      return (
                        <span
                          key={b.subject}
                          className={
                            under
                              ? "rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-200"
                              : "rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                          }
                        >
                          {SUBJECT_MAP[b.subject].short} {b.correct * 5}점
                        </span>
                      );
                    })}
                  </div>
                </Card>
              ))}
          </div>
        </>
      )}
    </main>
  );
}
