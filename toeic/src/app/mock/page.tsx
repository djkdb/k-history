"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Headphones,
  Info,
  NotebookPen,
  Play,
  ScrollText,
  X,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, SectionTitle } from "@/components/ui";
import { EXAMS, buildExam, type ExamId } from "@/lib/exam";
import { SECTION_MINUTES } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import { clearProgress, readProgress, type MockProgress } from "./progress";
import { cn } from "@/lib/utils";

export default function MockHome() {
  const band = useBand();
  const attempts = useApp((s) => s.mockAttempts);
  const onePlay = useApp((s) => s.settings?.onePlay ?? false);
  const setOnePlay = useApp((s) => s.setOnePlay);
  const [resume, setResume] = useState<MockProgress | null>(null);

  useEffect(() => setResume(readProgress()), []);

  const built = useMemo(
    () => Object.fromEntries(EXAMS.map((e) => [e.id, buildExam(e.id, band, 1)])),
    [band],
  );

  const past = [...attempts].reverse();

  return (
    <main className="py-6">
      <header>
        <h1 className="text-2xl font-bold">모의고사</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
          제한 시간이 지나면 자동으로 제출됩니다. 중간에 정답을 볼 수 없고, 제출해야
          채점됩니다.
        </p>
      </header>

      {resume && (
        <Card className="mt-4 border-indigo-400/40 bg-indigo-500/[0.08]">
          <p className="text-[15px] font-bold text-indigo-100">보던 시험이 남아 있습니다</p>
          <p className="mt-1 text-[12px] text-zinc-400">
            {Object.keys(resume.answers).length}문항까지 풀었습니다 · 남은 시간{" "}
            {Math.max(0, Math.round((resume.endsAt - Date.now()) / 60000))}분
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                clearProgress();
                setResume(null);
              }}
            >
              <X size={15} />
              버리기
            </Button>
            <Link href={`/mock/session?exam=${resume.examId}&resume=1`} className="flex-1">
              <Button className="w-full">
                이어서 보기
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="mt-0.5 shrink-0 text-zinc-400" />
          <p className="text-[12px] leading-relaxed text-zinc-400">
            실제 시험은 듣기 {SECTION_MINUTES.listening}분 100문항, 읽기{" "}
            {SECTION_MINUTES.reading}분 100문항입니다. 여기는{" "}
            <b className="text-zinc-300">파트별 비율은 그대로 두고 분량만 절반</b>으로
            줄였고, <b className="text-zinc-300">문항당 시간은 실제와 같게</b> 맞췄습니다.
            쫓기는 감각은 같습니다.
            <br />
            <span className="mt-1 block">
              모의고사만은 목표 점수대로 걸러 내지 않습니다. 실제 시험은 목표에 따라
              쉬워지지 않고, 어려운 문항을 몇 개 버리고 갈지 정하는 것까지가 실력이기
              때문입니다. 응시할 때마다 문항이 새로 뽑힙니다.
            </span>
          </p>
        </div>
      </Card>

      {/*
        실전처럼 — 한 번만 재생.

        실제 시험은 음성이 한 번 나가면 끝이다. 되돌릴 수 없다는 것이
        듣기를 어렵게 만드는 큰 부분인데, 그동안은 몇 번이고 다시 들을 수
        있어서 실제보다 쉬웠다. 끄고 켜게 두는 이유는, 처음 연습할 때는
        여러 번 듣는 편이 낫기 때문이다.
      */}
      <Card className="mt-4">
        <button
          type="button"
          onClick={() => setOnePlay(!onePlay)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="min-w-0">
            <span className="block text-[14px] font-bold">실전처럼 — 한 번만 재생</span>
            <span className="mt-0.5 block text-[12px] leading-relaxed text-zinc-500">
              실제 시험은 음성이 한 번 나가면 되돌릴 수 없습니다. 켜면 지문마다
              한 번씩만 들려줍니다.
            </span>
          </span>
          <span
            role="switch"
            aria-checked={onePlay}
            aria-label="한 번만 재생"
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              onePlay ? "bg-indigo-500" : "bg-white/15",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                onePlay ? "left-[22px]" : "left-0.5",
              )}
            />
          </span>
        </button>
      </Card>

      <SectionTitle>고르기</SectionTitle>
      <div className="flex flex-col gap-3">
        {EXAMS.map((e) => {
          const exam = built[e.id as ExamId];
          const empty = exam.items.length === 0;
          return (
            <Card key={e.id} className={cn(empty && "opacity-50")}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                  {e.id === "lc" ? (
                    <Headphones size={19} className="text-sky-300" />
                  ) : e.id === "rc" ? (
                    <ScrollText size={19} className="text-amber-300" />
                  ) : (
                    <Clock size={19} className="text-indigo-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-bold">{e.name}</p>
                    <Badge>{exam.items.length}문항</Badge>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                    {e.description}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <Clock size={11} />
                    {exam.minutes}분 · 시간이 다 되면 자동으로 제출됩니다
                  </p>
                </div>
              </div>
              {!empty && (
                <Link href={`/mock/session?exam=${e.id}`}>
                  <Button size="lg" className="mt-4 w-full">
                    <Play size={16} />
                    응시하기
                  </Button>
                </Link>
              )}
            </Card>
          );
        })}
      </div>

      <SectionTitle>지난 성적</SectionTitle>
      {past.length === 0 ? (
        <EmptyState
          title="아직 응시 기록이 없습니다"
          desc="한 번 보고 나면 여기에 점수와 파트별 정답률이 쌓입니다."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {past.map((a) => (
            <Card key={`${a.examId}-${a.startedAt}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-bold">
                    {EXAMS.find((e) => e.id === a.examId)?.name ?? a.examId}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {new Date(a.finishedAt).toLocaleDateString("ko-KR")} ·{" "}
                    {a.correct} / {a.total}문항
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-200">
                    {a.scaled.total}
                    <span className="ml-0.5 text-[12px] font-medium text-zinc-500">점</span>
                  </p>
                  {/*
                    듣기만·읽기만 본 회차에 "LC 0 · RC 250" 이라고 적으면
                    듣기를 0점 맞은 것처럼 읽힌다. 안 본 쪽은 적지 않는다.
                  */}
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {a.examId === "lc"
                      ? "듣기 495점 만점"
                      : a.examId === "rc"
                        ? "읽기 495점 만점"
                        : `LC ${a.scaled.listening} · RC ${a.scaled.reading}`}
                  </p>
                </div>
              </div>
              {/*
                파트별 정답률만 보여 주고 끝내면 "그래서 뭘 해야 하지" 가
                남는다. 눌러서 그 파트 훈련으로 바로 넘어가게 하고, 가장
                낮은 파트는 표시해 둔다 — 시험이 끝난 직후가 그 파트를
                다시 볼 마음이 가장 큰 때다.
              */}
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/[0.07] pt-3">
                {a.byPart.map((p) => {
                  const rate = p.total ? p.correct / p.total : 1;
                  const weakest =
                    a.byPart.length > 1 &&
                    p.total > 0 &&
                    rate ===
                      Math.min(
                        ...a.byPart.filter((x) => x.total > 0).map((x) => x.correct / x.total),
                      );
                  return (
                    <Link key={p.part} href={`/part/${p.part}`}>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] transition-colors",
                          weakest
                            ? "border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15"
                            : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10",
                        )}
                      >
                        Part {p.part} {p.correct}/{p.total}
                        {weakest && <span className="font-bold">· 여기부터</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <Link href={`/mock/note?at=${a.startedAt}`}>
                <Button size="sm" variant="ghost" className="mt-3 w-full">
                  <NotebookPen size={14} />
                  오답 노트 ({a.total - a.correct}문항)
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-600">
        환산 점수는 공개된 점수 범위(각 5~495점)에 맞춘 어림값입니다. 실제 시험은
        회차마다 환산표가 달라 성적과 다를 수 있습니다.
      </p>
    </main>
  );
}
