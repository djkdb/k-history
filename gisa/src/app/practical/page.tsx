"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, PenLine, RotateCcw, X } from "lucide-react";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ProgressBar,
  SectionTitle,
} from "@/components/ui";
import { PracticalQuestionCard } from "@/components/practical-question";
import { SUBJECTS, SUBJECT_MAP, type SubjectId } from "@/data/exam";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import type { GradeResult } from "@/lib/grade";
import type { PracticalKind } from "@/lib/types";
import { useApp } from "@/lib/store";
import { shuffleSeeded } from "@/lib/utils";

type Phase = "setup" | "run" | "done";

const KINDS: { id: PracticalKind; label: string }[] = [
  { id: "term", label: "용어" },
  { id: "blank", label: "빈칸" },
  { id: "code", label: "출력" },
  { id: "sql", label: "SQL" },
];

export default function Page() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [kind, setKind] = useState<PracticalKind | null>(null);
  const [count, setCount] = useState(5);
  const [wrongOnly, setWrongOnly] = useState(false);

  const cleared = useApp((s) => s.clearedPracticalIds);
  const wrongIds = useApp((s) => s.wrongIds);
  const recordPractical = useApp((s) => s.recordPractical);

  const [items, setItems] = useState<typeof PRACTICAL_QUESTIONS>([]);
  const [at, setAt] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [marks, setMarks] = useState<boolean[]>([]);

  const pool = useMemo(() => {
    let p = PRACTICAL_QUESTIONS;
    if (subject) p = p.filter((q) => q.subject === subject);
    if (kind) p = p.filter((q) => q.kind === kind);
    /*
     * 틀린 곳만 다시 적기.
     *
     * 실기는 손으로 적어야 느는데, 그중에서도 틀린 것을 다시 적는 것이
     * 가장 값이 크다. 필기에는 진작 있던 거르개가 실기에는 없었다.
     */
    if (wrongOnly) {
      const set = new Set(wrongIds);
      p = p.filter((q) => set.has(q.sourceId));
    }
    return p;
  }, [subject, kind, wrongOnly, wrongIds]);

  function start() {
    const picked = shuffleSeeded(
      pool,
      Math.floor(Math.random() * 1_000_000) + 1,
    ).slice(0, Math.min(count, pool.length));
    if (picked.length === 0) return;
    setItems(picked);
    setAt(0);
    setValue("");
    setResult(null);
    setMarks([]);
    setPhase("run");
  }

  function onGrade(r: GradeResult, peeked: boolean) {
    const q = items[at];
    setResult(r);
    // 답을 보고 적은 것은 맞은 것으로 세지 않는다 — 화면에 그렇게 적어 두었다
    const correct = r.judgement === "correct" && !peeked;
    setMarks((m) => [...m, correct]);
    recordPractical(q.id, q.sourceId, correct);
  }

  function next() {
    if (at + 1 >= items.length) {
      setPhase("done");
      return;
    }
    setAt((a) => a + 1);
    setValue("");
    setResult(null);
  }

  if (phase === "setup") {
    const clearedInPool = pool.filter((q) => cleared.includes(q.id)).length;
    return (
      <main className="py-6">
        <h1 className="text-xl font-bold tracking-tight">
          실기 — 적어서 푸는 연습
        </h1>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
          실기는 필답형입니다. 고를 선지가 없으니 눈으로 아는 것과 손으로 적는
          것의 차이가 그대로 드러납니다. 표기가 흔들려도 뜻이 같으면 맞게
          봅니다.
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

        <SectionTitle>유형</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Chip active={kind === null} onClick={() => setKind(null)}>
            전체
          </Chip>
          {KINDS.map((k) => (
            <Chip
              key={k.id}
              active={kind === k.id}
              onClick={() => setKind(k.id)}
            >
              {k.label}
            </Chip>
          ))}
        </div>

        {wrongIds.length > 0 && (
          <>
            <SectionTitle>어디서 고를까</SectionTitle>
            <div className="flex flex-wrap gap-2">
              <Chip active={!wrongOnly} onClick={() => setWrongOnly(false)}>
                전체 {PRACTICAL_QUESTIONS.length}
              </Chip>
              <Chip active={wrongOnly} onClick={() => setWrongOnly(true)}>
                틀린 것만{" "}
                {
                  PRACTICAL_QUESTIONS.filter((q) =>
                    wrongIds.includes(q.sourceId),
                  ).length
                }
              </Chip>
            </div>
          </>
        )}

        <SectionTitle>문항 수</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {[3, 5, 10].map((c) => (
            <Chip key={c} active={count === c} onClick={() => setCount(c)}>
              {c}문항
            </Chip>
          ))}
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
          <PenLine size={16} />
          {pool.length === 0
            ? "고를 문항이 없습니다"
            : `${Math.min(count, pool.length)}문항 시작`}
        </Button>

        <Link href="/practical/mock">
          <Button size="lg" variant="outline" className="mt-2 w-full">
            실기 모의고사 (100점 · 150분)
            <ArrowRight size={16} />
          </Button>
        </Link>
      </main>
    );
  }

  if (phase === "done") {
    const correct = marks.filter(Boolean).length;
    const earned = items.reduce((n, q, i) => n + (marks[i] ? q.points : 0), 0);
    const max = items.reduce((n, q) => n + q.points, 0);
    return (
      <main className="py-6">
        <EmptyState
          icon={correct === items.length ? "✍️" : "🔁"}
          title={`${max}점 중 ${earned}점`}
          desc={`${items.length}문항 중 ${correct}개를 맞혔습니다. 틀린 문항은 복습 목록에 들어갔습니다.`}
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
  return (
    <main className="py-6">
      {/*
        적는 동안에는 화면 이름을 눈에 보이게 두지 않는다 — 진행 막대와 문항이
        먼저다. 그러면 화면을 읽어 주는 기기에는 여기가 어디인지 말해 줄 것이
        남지 않는다.
        눈에는 안 보이되 소리로는 들리는 제목을 둔다.
      */}
      <h1 className="sr-only">실기 연습</h1>
      <div className="flex items-center gap-3">
        <ProgressBar
          className="flex-1"
          value={at + (result ? 1 : 0)}
          max={items.length}
          color="#6366f1"
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
        <PracticalQuestionCard
          q={q}
          index={at}
          total={items.length}
          value={value}
          onChange={setValue}
          result={result}
          onGrade={onGrade}
        />
      </div>

      {result && (
        <Button size="lg" className="mt-5 w-full" onClick={next}>
          {at + 1 >= items.length ? "결과 보기" : "다음"}
          <ArrowRight size={16} />
        </Button>
      )}
    </main>
  );
}
