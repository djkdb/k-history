"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ProgressBar,
  SectionTitle,
  SubjectBadge,
} from "@/components/ui";
import { WrittenQuestionCard } from "@/components/written-question";
import { SUBJECTS, SUBJECT_MAP, subjectInk, type SubjectId } from "@/data/exam";
import { QUESTIONS } from "@/data/questions";
import { makeQuiz } from "@/lib/quiz";
import { useApp } from "@/lib/store";

type Phase = "setup" | "run" | "done";
const COUNTS = [5, 10, 20];

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="py-20 text-center text-sm text-zinc-500">
          불러오는 중…
        </main>
      }
    >
      <QuizScreen />
    </Suspense>
  );
}

const SUBJECT_IDS = SUBJECTS.map((s) => s.id);

function QuizScreen() {
  const params = useSearchParams();
  // 홈의 "이 과목 문제 풀기" 에서 넘어온다. 모르는 값이면 그냥 전체로 둔다.
  const fromUrl = params.get("subject");
  const [phase, setPhase] = useState<Phase>("setup");
  const [subject, setSubject] = useState<SubjectId | null>(() =>
    fromUrl && SUBJECT_IDS.includes(fromUrl as SubjectId)
      ? (fromUrl as SubjectId)
      : null,
  );
  const [count, setCount] = useState(10);
  const [wrongOnly, setWrongOnly] = useState(false);
  const [seed, setSeed] = useState(1);

  const wrongIds = useApp((s) => s.wrongIds);
  const clearedIds = useApp((s) => s.clearedQuestionIds);
  const recordAnswer = useApp((s) => s.recordAnswer);
  const recordQuiz = useApp((s) => s.recordQuiz);

  const [items, setItems] = useState<typeof QUESTIONS>([]);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<boolean[]>([]);

  const pool = useMemo(() => {
    let p = QUESTIONS;
    if (subject) p = p.filter((q) => q.subject === subject);
    if (wrongOnly) {
      const set = new Set(wrongIds);
      p = p.filter((q) => set.has(q.sourceId));
    }
    return p;
  }, [subject, wrongOnly, wrongIds]);

  function start() {
    const s = Math.floor(Math.random() * 1_000_000) + 1;
    const picked = makeQuiz({
      subject: subject ?? undefined,
      count: Math.min(count, pool.length),
      seed: s,
      onlySourceIds: wrongOnly ? wrongIds : undefined,
    });
    if (picked.length === 0) return;
    setSeed(s);
    setItems(picked);
    setAt(0);
    setPicked(null);
    setMarks([]);
    setPhase("run");
  }

  function pick(i: number) {
    if (picked !== null) return;
    const q = items[at];
    const correct = i === q.answerIndex;
    setPicked(i);
    setMarks((m) => [...m, correct]);
    recordAnswer(q.id, q.sourceId, correct);
  }

  function next() {
    if (at + 1 >= items.length) {
      recordQuiz({
        quizId: `q-${seed}`,
        takenAt: Date.now(),
        total: items.length,
        correct: marks.filter(Boolean).length,
        track: "written",
      });
      setPhase("done");
      return;
    }
    setAt((a) => a + 1);
    setPicked(null);
  }

  if (phase === "setup") {
    const clearedInPool = pool.filter((q) => clearedIds.includes(q.id)).length;
    return (
      <main className="py-6">
        <h1 className="text-xl font-bold tracking-tight">문제 풀기</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
          필기 형식 그대로 네 개 중 하나를 고릅니다. 틀린 문항은 복습 목록으로
          자동으로 넘어갑니다.
        </p>

        <SectionTitle>과목</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Chip active={subject === null} onClick={() => setSubject(null)}>
            전체
          </Chip>
          {SUBJECTS.map((s) => (
            <Chip
              key={s.id}
              active={subject === s.id}
              onClick={() => setSubject(s.id)}
            >
              {s.symbol} {s.short}
            </Chip>
          ))}
        </div>

        <SectionTitle>문항 수</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {COUNTS.map((c) => (
            <Chip key={c} active={count === c} onClick={() => setCount(c)}>
              {c}문항
            </Chip>
          ))}
          <Chip active={wrongOnly} onClick={() => setWrongOnly((w) => !w)}>
            틀린 것만 {wrongIds.length > 0 && `(${wrongIds.length})`}
          </Chip>
        </div>

        <Card className="mt-5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-zinc-400">고를 수 있는 문항</span>
            <span className="font-bold tabular-nums">{pool.length}개</span>
          </div>
          <ProgressBar
            className="mt-2"
            value={clearedInPool}
            max={Math.max(1, pool.length)}
            color={subject ? SUBJECT_MAP[subject].color : "#6366f1"}
          />
          <p className="mt-2 text-[11px] text-zinc-500">
            그중 {clearedInPool}개는 한 번 이상 맞혔습니다.
          </p>
        </Card>

        <Button
          size="lg"
          className="mt-5 w-full"
          onClick={start}
          disabled={pool.length === 0}
        >
          {pool.length === 0
            ? "고를 문항이 없습니다"
            : `${Math.min(count, pool.length)}문항 시작`}
          <ArrowRight size={16} />
        </Button>

        {wrongOnly && wrongIds.length === 0 && (
          <p className="mt-3 text-center text-[12px] text-zinc-500">
            아직 틀린 문항이 없습니다.
          </p>
        )}
      </main>
    );
  }

  if (phase === "done") {
    const correct = marks.filter(Boolean).length;
    const pct = Math.round((correct / items.length) * 100);
    return (
      <main className="py-6">
        <EmptyState
          icon={pct >= 60 ? "🎯" : "🔁"}
          title={`${items.length}문항 중 ${correct}개 정답`}
          desc={
            pct >= 60
              ? "합격선(60점) 위입니다. 다른 과목도 같은 방식으로 채워 보세요."
              : "60점에 못 미칩니다. 틀린 문항은 복습 목록에 들어가 있습니다."
          }
        />
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setPhase("setup")}
          >
            <RotateCcw size={16} />
            다시 고르기
          </Button>
          <Link href="/review">
            <Button size="lg" variant="outline" className="w-full">
              복습 목록 보기
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const q = items[at];
  const revealed = picked !== null;
  return (
    <main className="py-6">
      <div className="flex items-center gap-3">
        <ProgressBar
          className="flex-1"
          value={at + (revealed ? 1 : 0)}
          max={items.length}
          color={subjectInk(q.subject)}
        />
        <button
          type="button"
          onClick={() => setPhase("setup")}
          className="-m-2 p-2 text-zinc-500 hover:text-zinc-300"
          aria-label="그만두기"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4">
        <WrittenQuestionCard
          q={q}
          index={at}
          total={items.length}
          picked={picked}
          onPick={pick}
          revealed={revealed}
        />
      </div>

      {revealed && (
        <Button size="lg" className="mt-5 w-full" onClick={next}>
          {at + 1 >= items.length ? (
            <>
              <Check size={16} />
              채점 보기
            </>
          ) : (
            <>
              다음
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      )}
    </main>
  );
}
