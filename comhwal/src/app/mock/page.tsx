"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileText,
  NotebookPen,
  TriangleAlert,
} from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import { SUBJECT_MAP, subjectsFor } from "@/data/subjects";
import { Button, Card, EmptyState, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { PROGRESS_KEY, readProgress, type MockProgress } from "./progress";

export default function MockPage() {
  const grade = useGrade();
  // 실기 응시는 실기 화면에서 따로 보여 준다
  const attempts = useApp((s) => s.mockAttempts).filter((a) =>
    a.examId.endsWith("-written"),
  );
  const [resume, setResume] = useState<MockProgress | null>(null);

  useEffect(() => {
    setResume(readProgress());
  }, []);

  const subjects = subjectsFor(grade);
  const total = subjects.length * 20;

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold tracking-tight">필기 모의고사</h1>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        {grade}급 기준 {subjects.length}과목 × 20문항, 제한 시간 {total}분.
        실제 시험과 같은 구성입니다.
      </p>

      {resume && resume.grade === grade && (
        <Card className="mt-4 border-amber-500/30 bg-amber-500/[0.08]">
          <p className="text-[13px] font-bold text-amber-200">
            풀던 시험이 남아 있습니다
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-300">
            {Object.keys(resume.answers).length}문항까지 답했고, 남은 시간은
            약 {Math.max(0, Math.round((resume.endsAt - Date.now()) / 60000))}분입니다.
          </p>
          <div className="mt-3 flex gap-2">
            <Link href="/mock/session?resume=1" className="flex-1">
              <Button className="w-full" size="sm">
                이어서 풀기
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                try {
                  localStorage.removeItem(PROGRESS_KEY);
                } catch {
                  /* 무시 */
                }
                setResume(null);
              }}
            >
              버리기
            </Button>
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <div className="flex items-start gap-3">
          <FileText size={18} className="mt-0.5 shrink-0 text-indigo-300" />
          <div className="min-w-0">
            <p className="text-sm font-bold">{grade}급 필기 모의고사</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {subjects.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                >
                  {s.name} 20문항
                </span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-zinc-500">
              <Clock size={13} />
              {total}분 · 시간이 다 되면 자동으로 제출됩니다
            </p>
          </div>
        </div>
        <Link href="/mock/session">
          <Button size="lg" className="mt-4 w-full">
            응시하기
            <ArrowRight size={17} />
          </Button>
        </Link>
      </Card>

      <Card className="mt-3 border-rose-500/25 bg-rose-500/[0.06]">
        <div className="flex items-start gap-2">
          <TriangleAlert size={15} className="mt-0.5 shrink-0 text-rose-300" />
          <p className="text-[13px] leading-relaxed text-zinc-300">
            컴활 필기는 <b>평균 60점 이상</b>이어야 하고, 여기에 더해
            <b> 한 과목이라도 40점 미만이면 과락</b>입니다. 그래서 결과 화면에
            과목별 점수를 따로 보여 드립니다.
          </p>
        </div>
      </Card>

      <SectionTitle>지난 응시</SectionTitle>
      {attempts.length === 0 ? (
        <EmptyState icon="📄" title="아직 응시 기록이 없습니다" />
      ) : (
        <div className="flex flex-col gap-2">
          {[...attempts].reverse().map((a) => {
            const pct = Math.round((a.score / a.total) * 100);
            const failed = a.bySubject.filter(
              (b) => b.correct / b.total < 0.4,
            );
            const passed = pct >= 60 && failed.length === 0;
            return (
              <Card key={a.startedAt}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">
                      {a.examId.startsWith("1") ? "1급" : "2급"} 필기 ·{" "}
                      {new Date(a.startedAt).toLocaleDateString("ko-KR")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {a.score} / {a.total}문항 · {Math.round(
                        (a.finishedAt - a.startedAt) / 60000,
                      )}
                      분 소요
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{pct}점</p>
                    <p
                      className={cn(
                        "text-[11px] font-bold",
                        passed ? "text-emerald-400" : "text-red-400",
                      )}
                    >
                      {passed ? "합격선" : failed.length ? "과락" : "불합격선"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.bySubject.map((b) => {
                    const sp = Math.round((b.correct / b.total) * 100);
                    const bad = sp < 40;
                    return (
                      <span
                        key={b.subject}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px]",
                          bad
                            ? "bg-red-500/15 text-red-300"
                            : "bg-white/5 text-zinc-400",
                        )}
                      >
                        {SUBJECT_MAP[b.subject]?.short ?? b.subject} {sp}점
                      </span>
                    );
                  })}
                </div>
                <Link href={`/mock/note?at=${a.startedAt}`}>
                  <Button size="sm" variant="ghost" className="mt-3 w-full">
                    <NotebookPen size={14} />
                    오답 노트 ({a.total - a.score}문항)
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
