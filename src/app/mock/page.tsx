"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Timer, Trophy } from "lucide-react";
import { useApp } from "@/lib/store";
import { MOCK_EXAMS, totalPoints } from "@/data/mock-exams";
import { hnkGrade } from "@/lib/utils";
import { Badge, Button, Card, EmptyState, SectionTitle } from "@/components/ui";

export default function MockExamListPage() {
  const hydrated = useApp((s) => s.hydrated);
  const attempts = useApp((s) => s.mockAttempts);

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold tracking-tight">기출 모의고사</h1>
      <p className="mt-1 text-sm text-zinc-500">
        실제 시험지를 그대로, 실제 제한 시간 안에
      </p>

      {MOCK_EXAMS.length === 0 ? (
        <>
          <Card className="mt-6">
            <EmptyState
              icon={<FileText size={28} />}
              title="등록된 기출이 없습니다"
              desc="기출 문항은 국사편찬위원회가 공개한 자료입니다. 아래 절차로 직접 등록하면 바로 풀 수 있어요."
            />
          </Card>

          <SectionTitle>등록하는 방법</SectionTitle>
          <div className="flex flex-col gap-2">
            {[
              {
                step: "1",
                title: "공식 자료실에서 내려받기",
                desc: "historyexam.go.kr → 자료실 → 기출문제. 로그인 없이 무료입니다. 문제지와 정답표를 함께 받으세요.",
              },
              {
                step: "2",
                title: "임포터 실행",
                desc: "python3 scripts/import-exam.py <PDF> 68 advanced --answers 3,1,4,...",
                mono: true,
              },
              {
                step: "3",
                title: "등록",
                desc: "생성된 파일을 src/data/mock-exams/index.ts 의 MOCK_EXAMS 배열에 추가하면 여기 나타납니다.",
              },
            ].map((s) => (
              <Card key={s.step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  {s.step}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{s.title}</span>
                  <span
                    className={
                      s.mono
                        ? "mt-1 block break-all rounded-lg bg-black/40 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-emerald-300"
                        : "mt-0.5 block text-xs leading-relaxed text-zinc-500"
                    }
                  >
                    {s.desc}
                  </span>
                </span>
              </Card>
            ))}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
            이 앱은 제3자 사이트의 기출 사본을 가져오지 않습니다. 출제 기관이
            직접 배포하는 원본만 사용하며, 등록 시 출처가 함께 표시됩니다.
          </p>
        </>
      ) : (
        <div className="mt-5 flex flex-col gap-2.5">
          {MOCK_EXAMS.map((exam, i) => {
            const mine = hydrated
              ? attempts.filter((a) => a.examId === exam.id)
              : [];
            const best = mine.length
              ? Math.max(...mine.map((a) => a.score))
              : null;
            const grade =
              best !== null ? hnkGrade(best, exam.level) : null;
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/mock/session?id=${exam.id}`}>
                  <Card className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                      <span className="text-sm font-black leading-none">
                        {exam.round}
                      </span>
                      <span className="text-[9px] leading-none">회</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        {exam.level === "advanced" ? "심화" : "기본"} ·{" "}
                        {exam.questions.length}문항
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
                        <Timer size={11} /> {exam.timeLimitMin}분
                        <span>· {totalPoints(exam)}점 만점</span>
                      </span>
                    </span>
                    {best !== null && (
                      <Badge className="border-amber-400/30 bg-amber-500/10 text-amber-300">
                        <Trophy size={10} /> {best}점
                        {grade ? ` ${grade.label}` : ""}
                      </Badge>
                    )}
                    <ChevronRight size={16} className="shrink-0 text-zinc-600" />
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {hydrated && attempts.length > 0 && (
        <>
          <SectionTitle>응시 기록</SectionTitle>
          <div className="flex flex-col gap-2 pb-4">
            {[...attempts]
              .reverse()
              .slice(0, 8)
              .map((a) => {
                const exam = MOCK_EXAMS.find((e) => e.id === a.examId);
                const g = hnkGrade(a.score, exam?.level ?? "advanced");
                const mins = Math.round((a.finishedAt - a.startedAt) / 60000);
                return (
                  <Card
                    key={`${a.examId}-${a.finishedAt}`}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1 text-sm font-medium">
                      {exam ? `${exam.round}회` : a.examId}
                    </span>
                    <span className="text-xs text-zinc-500">{mins}분</span>
                    <span className="text-sm font-bold">
                      {a.score}/{a.total}
                    </span>
                    {g && (
                      <Badge className="border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
                        {g.label}
                      </Badge>
                    )}
                  </Card>
                );
              })}
          </div>
        </>
      )}

      <div className="pb-4">
        <Link href="/quiz">
          <Button variant="outline" className="w-full">
            대신 개념 퀴즈 풀기
          </Button>
        </Link>
      </div>
    </div>
  );
}
