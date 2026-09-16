"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  ProgressBar,
  SectionTitle,
  SubjectBadge,
} from "@/components/ui";
import { WrittenQuestionCard } from "@/components/written-question";
import { CONCEPT_MAP } from "@/data/concepts";
import { SUBJECT_MAP, subjectInk } from "@/data/exam";
import { makeWrittenMock } from "@/lib/quiz";
import { useApp } from "@/lib/store";
import type { MockAttempt, WrittenQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * 오답 노트.
 *
 * 점수만 보고 나오면 다음 시험에서 같은 문제를 또 틀린다. 정작 알아야 할
 * 것은 "몇 점" 이 아니라 "무엇을, 왜" 다. 그래서 이 화면은 두 가지만 한다 —
 * 틀린 문항을 그대로 다시 펴 주고, 어느 과목·개념이 약한지 세어 준다.
 *
 * 시험지는 저장하지 않는다. 응시 기록에 적어 둔 씨앗으로 다시 만든다.
 * 다만 문항이 그 사이에 늘거나 고쳐졌으면 같은 씨앗에서 다른 시험지가
 * 나오므로, 문항 id 가 한 글자도 다르지 않을 때만 문항별로 보여 주고
 * 그렇지 않으면 과목·개념 목록으로 물러선다.
 */
export function NoteView() {
  const hydrated = useApp((s) => s.hydrated);
  const attempts = useApp((s) => s.mockAttempts);
  const search = useSearchParams();
  const at = Number(search.get("at"));

  // at 을 주지 않으면 가장 최근에 본 필기 시험을 편다
  const attempt = useMemo(() => {
    const written = attempts.filter((a) => a.track === "written");
    if (!written.length) return undefined;
    return at
      ? written.find((a) => a.startedAt === at)
      : written[written.length - 1];
  }, [attempts, at]);

  const paper = useMemo(() => rebuild(attempt), [attempt]);

  if (!hydrated) return <main className="py-20" />;

  if (!attempt) {
    return (
      <main className="py-6">
        <Back />
        <EmptyState
          icon="📄"
          title="아직 본 필기 모의고사가 없습니다"
          heading
          desc="한 회를 끝내면 틀린 문항이 여기에 모입니다."
          action={
            <Link href="/mock">
              <Button size="sm">모의고사로</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const total = attempt.bySubject.reduce((n, b) => n + b.total, 0);
  const correct = attempt.bySubject.reduce((n, b) => n + b.correct, 0);
  const wrongIdx = paper
    ? paper.map((_, i) => i).filter((i) => attempt.picks?.[i] !== paper[i].answerIndex)
    : [];

  return (
    <main className="py-6">
      <Back />

      <h1 className="mt-3 text-xl font-bold tracking-tight">오답 노트</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        {new Date(attempt.startedAt).toLocaleDateString("ko-KR")} · 필기 {total}
        문항 중 <b className="text-zinc-200">{total - correct}문항</b>을
        틀렸습니다 (평균 {attempt.score}점 ·{" "}
        {attempt.passed ? "합격선 위" : "합격선 아래"})
      </p>

      {/* 어느 과목이 약한가 — 과락은 과목 하나로 결정된다 */}
      <SectionTitle>과목별</SectionTitle>
      <div className="flex flex-col gap-2">
        {attempt.bySubject.map((b) => {
          const s = SUBJECT_MAP[b.subject];
          const pct = b.total ? Math.round((b.correct / b.total) * 100) : 0;
          const danger = pct < 40;
          return (
            <Card key={b.subject} className={cn(danger && "border-rose-500/30 bg-rose-500/[0.06]")}>
              <div className="flex items-center gap-2">
                <SubjectBadge subject={b.subject} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold">
                  {s.name}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[13px] font-bold tabular-nums",
                    danger ? "text-rose-300" : "text-zinc-300",
                  )}
                >
                  {pct}점
                </span>
              </div>
              <ProgressBar
                className="mt-2"
                value={b.correct}
                max={b.total}
                color={subjectInk(b.subject)}
              />
              <p className="mt-1.5 text-[11.5px] text-zinc-500">
                {b.correct} / {b.total}문항
                {danger && " · 40점에 못 미쳐 과락입니다"}
              </p>
            </Card>
          );
        })}
      </div>

      {paper ? (
        <WrongList paper={paper} idx={wrongIdx} picks={attempt.picks ?? {}} />
      ) : (
        <FallBack attempt={attempt} />
      )}
    </main>
  );
}

/** 틀린 문항을 그대로 다시 편다 */
function WrongList({
  paper,
  idx,
  picks,
}: {
  paper: WrittenQuestion[];
  idx: number[];
  picks: Record<number, number>;
}) {
  /*
   * 한 번에 스무 개씩만 편다.
   * 100문항을 통째로 내리면 화면이 수천 픽셀이 되어 정작 첫 문항도 안 읽는다.
   */
  const [shown, setShown] = useState(20);
  if (!idx.length) {
    return (
      <>
        <SectionTitle>틀린 문항</SectionTitle>
        <Card>
          <p className="text-[13px] text-emerald-200">
            틀린 문항이 없습니다. 이 회차는 전부 맞혔습니다.
          </p>
        </Card>
      </>
    );
  }
  return (
    <>
      <SectionTitle>틀린 문항 {idx.length}개</SectionTitle>
      <div className="flex flex-col gap-3">
        {idx.slice(0, shown).map((i) => (
          <Card key={paper[i].id}>
            <WrittenQuestionCard
              q={paper[i]}
              index={i}
              total={paper.length}
              picked={picks[i] ?? null}
              revealed
              onPick={() => {}}
            />
          </Card>
        ))}
      </div>
      {shown < idx.length && (
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() => setShown(shown + 20)}
        >
          {idx.length - shown}개 더 보기
        </Button>
      )}
    </>
  );
}

/** 시험지를 다시 만들지 못할 때 — 개념 목록으로 물러선다 */
function FallBack({ attempt }: { attempt: MockAttempt }) {
  const ids = attempt.wrongSourceIds ?? [];
  return (
    <>
      <SectionTitle>틀린 곳의 개념</SectionTitle>
      <p className="-mt-1 mb-2 text-[12px] leading-relaxed text-zinc-500">
        그때의 시험지를 그대로 되살리지 못했습니다. 문항이 그 뒤로 늘거나
        고쳐졌기 때문입니다. 엉뚱한 문제를 내미는 대신 틀린 곳의 개념만
        보여 드립니다.
      </p>
      {ids.length === 0 ? (
        <Card>
          <p className="text-[13px] text-zinc-400">남겨 둔 것이 없습니다.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {ids.map((id) => {
            const c = CONCEPT_MAP[id];
            if (!c) return null;
            return (
              <Link key={id} href={`/concept/${id}`}>
                <Card>
                  <div className="flex items-center gap-2">
                    <SubjectBadge subject={c.subject} />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-bold">
                      {c.title}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
                    {c.summary}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function Back() {
  return (
    <div className="flex items-center">
      <Link
        href="/mock"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        모의고사
      </Link>
      <Link
        href="/"
        className="-my-2 ml-auto inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <Home size={15} />홈
      </Link>
    </div>
  );
}

/**
 * 그때의 시험지를 다시 만든다.
 * 하나라도 어긋나면 null 을 돌려 문항별 보기를 포기한다.
 */
function rebuild(attempt?: MockAttempt): WrittenQuestion[] | null {
  if (!attempt || attempt.track !== "written") return null;
  if (typeof attempt.seed !== "number") return null;
  if (!attempt.picks) return null;
  const qids = attempt.qids;
  if (!qids?.length) return null;
  let paper: WrittenQuestion[];
  try {
    paper = makeWrittenMock(attempt.seed);
  } catch {
    return null;
  }
  if (paper.length !== qids.length) return null;
  if (paper.some((q, i) => q.id !== qids[i])) return null;
  return paper;
}
