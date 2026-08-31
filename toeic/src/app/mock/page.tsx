"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TriangleAlert,
  Clock,
  Headphones,
  NotebookPen,
  Play,
  ScrollText,
  X,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, SectionTitle } from "@/components/ui";
import { EXAMS, buildExam, type ExamId } from "@/lib/exam";
import { useApp, useBand } from "@/lib/store";
import { clearProgress, readProgress, type MockProgress } from "./progress";
import { cn } from "@/lib/utils";

export default function MockHome() {
  const band = useBand();
  const attempts = useApp((s) => s.mockAttempts);
  const onePlay = useApp((s) => s.settings?.onePlay ?? false);
  const setOnePlay = useApp((s) => s.setOnePlay);
  const [resume, setResume] = useState<MockProgress | null>(null);
  const [more, setMore] = useState(false);

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

      {/*
        시작하기 전에 부족한 점을 먼저 말한다.

        모의고사는 "지금 몇 점쯤인가" 를 재려고 보는 것이다. 그런데 이
        시험지는 실제와 다른 데가 있고, 그것을 모르고 점수만 받아 가면
        엉뚱한 판단을 하게 된다 — 여기서 800이 나왔다고 시험장에서
        800이 나오지 않는다.
        감추는 편이 좋아 보일 수 있지만, 어차피 두 번째 응시에서 본
        문항이 섞여 나오는 순간 사용자가 먼저 안다. 그때 알게 되는 것보다
        먼저 말해 두는 편이 낫다. 숫자는 실제로 센 값을 적는다.
      */}
      <Card className="mt-4 border-amber-500/25 bg-amber-500/[0.06]">
        <div className="flex items-start gap-2.5">
          <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-300" />
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-amber-200">
              보시기 전에 — 이 시험지가 부족한 점
            </p>

            <p className="mt-2 text-[12px] font-bold text-zinc-300">문항이 넉넉하지 않습니다</p>
            <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
              가진 문항은 듣기 143 · 읽기 173, 모두 316개입니다. 실제 시험 한 회가
              200문항이니 넉넉히 잡아도 한 벌 반입니다. 특히{" "}
              <b className="text-zinc-300">Part 3 과 Part 7 은 실제 시험 한 회 분량뿐</b>
              입니다. 그래서 두 번째 응시부터는 본 문항이 섞여 나옵니다 — 연달아 두 벌을
              보면 평균 38%가 겹치고, 열다섯 벌쯤이면 가진 문항을 거의 다 만납니다.
              답을 외운 문항은 점수를 부풀립니다.
            </p>

            <p className="mt-3 text-[12px] font-bold text-zinc-300">듣기는 실제와 많이 다릅니다</p>
            <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
              사람이 녹음한 음원이 아니라 기기의 음성으로 읽어 줍니다. 실제 시험의
              미국·영국·캐나다·호주 발음과는 결이 다르고, 기기에 영어 음성이 없으면
              스크립트를 읽는 방식으로 넘어갑니다. Part 1 은 사진이 아니라 그린 그림이고,
              Part 3·4 지문은 평균 82단어로 실제(100~130단어)보다 짧습니다.{" "}
              <b className="text-zinc-300">듣기 점수는 실제보다 높게 나오기 쉽습니다.</b>
            </p>

            {/*
              부족한 점 둘은 늘 펼쳐 둔다 — 그것이 이 카드의 목적이다.
              나머지(쓸모 있는 점·출처)는 한 번 읽으면 되는 것이라 접는다.
              다 펼쳐 두었더니 응시하기 단추가 한 화면 아래로 밀렸다.
            */}
            {!more ? (
              <button
                type="button"
                onClick={() => setMore(true)}
                className="-mb-1.5 mt-1.5 py-1.5 text-[12px] font-bold text-amber-200 underline decoration-dotted"
              >
                그래도 쓸모가 있는 것 · 문항 출처
              </button>
            ) : (
              <>
                <p className="mt-3 text-[12px] font-bold text-zinc-300">그래도 쓸모가 있는 것</p>
                <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                  파트별 비율은 실제와 같고, 문항당 시간도 36초로 똑같이 맞췄습니다. 분량만
                  절반으로 줄였습니다. 그래서{" "}
                  <b className="text-zinc-300">시간에 쫓기는 감각과 어느 파트에서 무너지는지</b>
                  는 그대로 드러납니다. 점수 자체보다 파트별 정답률을 보세요.
                </p>
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
                  ETS 는 기출문제를 공개하지 않고, 시중 교재의 문제를 가져다 쓰는 것은
                  저작권 침해입니다. 그래서 이 시험지의 문항은 공개된 출제 범위만을
                  근거로 AI 가 새로 쓴 것입니다. 정답이 하나뿐인지·선택지가 겹치지
                  않는지는 확인했지만, 실제 시험지를 옮겨 온 것이 아니라는 점은 감안하고
                  보세요. 모의고사만은 목표 점수대로 걸러 내지 않습니다 — 실제 시험은
                  목표에 따라 쉬워지지 않기 때문입니다.
                </p>
              </>
            )}
          </div>
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
