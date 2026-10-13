"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { Gate } from "@/components/gate";
import { QuestionCard } from "@/components/question-card";
import { Button, Card, Chip, ProgressBar, SectionTitle } from "@/components/ui";
import { COURSE, CONCEPT_MAP, CHAPTER_MAP, questionsOf, questionsOfChapter, termLabel } from "@/lib/course";
import type { Response } from "@/lib/grade";
import { takeQuizPreset } from "@/lib/handoff";
import { pickQuiz, type QuizMode } from "@/lib/quiz";
import { useApp } from "@/lib/store";
import type { Question } from "@/lib/types";

export default function Quiz() {
  return (
    <Gate>
      <QuizView />
    </Gate>
  );
}

const MODES: { id: QuizMode; label: string }[] = [
  { id: "all", label: "섞어서" },
  { id: "new", label: "안 푼 것" },
  { id: "wrong", label: "틀린 것" },
];

function QuizView() {
  const log = useApp((s) => s.log);
  const wrongIds = useApp((s) => s.wrongIds);
  const answer = useApp((s) => s.answer);

  const [chapter, setChapter] = useState<string | "all">("all");
  const [concept, setConcept] = useState<string | null>(null);
  const [mode, setMode] = useState<QuizMode>("all");
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<Question[] | null>(null);
  const [seed, setSeed] = useState(0);
  const [at, setAt] = useState(0);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, Response>>({});

  // 다른 화면에서 조건을 정해 보냈으면 그대로 바로 시작한다
  const [preset, setPreset] = useState<ReturnType<typeof takeQuizPreset>>(null);
  useEffect(() => {
    const p = takeQuizPreset();
    if (!p) return;
    setPreset(p);
    if (p.chapter) setChapter(p.chapter);
    if (p.concept) setConcept(p.concept);
    if (p.mode) setMode(p.mode);
  }, []);

  const pool = useMemo(() => {
    if (concept) return questionsOf(concept);
    if (chapter !== "all") return questionsOfChapter(chapter);
    return COURSE.questions;
  }, [chapter, concept]);
  const available = useMemo(() => {
    if (mode === "new") return pool.filter((q) => !log[q.id]).length;
    if (mode === "wrong") return pool.filter((q) => wrongIds.includes(q.id)).length;
    return pool.length;
  }, [pool, mode, log, wrongIds]);

  const start = (n = count) => {
    const qs = pickQuiz(pool, log, wrongIds, mode, concept ? pool.length : n, Date.now());
    setSession(qs);
    setSeed(Date.now() % 2147483647);
    setAt(0);
    setMarks({});
    setResponses({});
  };

  // 미리 정해진 조건이면 고르기 화면을 건너뛴다
  useEffect(() => {
    if (preset && !session && available > 0) start(preset.concept ? 999 : 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, available]);

  if (session && at >= session.length) {
    const right = session.filter((q) => marks[q.id]).length;
    const wrongs = session.filter((q) => !marks[q.id]);
    return (
      <main className="py-6">
        <h1 className="text-[22px] font-bold">퀴즈 끝</h1>
        <Card className="mt-4 text-center">
          <p className="text-[40px] font-black leading-none">
            {right}
            <span className="text-[20px] text-zinc-500">/{session.length}</span>
          </p>
          <p className="mt-2 text-[13px] text-zinc-400">틀린 문제는 복습함과 &lsquo;틀린 것&rsquo; 목록에 들어갔습니다.</p>
        </Card>
        {wrongs.length > 0 && (
          <>
            <SectionTitle>틀린 문제 — 개념 다시 보기</SectionTitle>
            <div className="flex flex-col gap-2">
              {wrongs.map((q) => (
                <Link key={q.id} href={`/concept/${q.concept}`}>
                  <Card className="py-3">
                    <p className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                      <X size={15} className="mt-0.5 shrink-0 text-rose-300" />
                      <span className="line-clamp-2">{q.q}</span>
                    </p>
                    <p className="mt-1 pl-6 text-[12px] text-indigo-200">{termLabel(CONCEPT_MAP[q.concept])} →</p>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
        <div className="mt-6 flex flex-col gap-2">
          {wrongs.length > 0 && (
            <Button
              className="w-full"
              onClick={() => {
                setSession(wrongs);
                setAt(0);
                setMarks({});
                setResponses({});
              }}
            >
              <RotateCcw size={16} /> 틀린 {wrongs.length}문제 바로 다시
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => setSession(null)}>
            다른 퀴즈 고르기
          </Button>
        </div>
      </main>
    );
  }

  if (session) {
    const q = session[at];
    const done = q.id in responses;
    return (
      <main className="py-6">
        <div className="flex items-center gap-3">
          <ProgressBar value={at + (done ? 1 : 0)} max={session.length} className="flex-1" />
          <button type="button" onClick={() => setSession(null)} className="text-[12.5px] font-semibold text-zinc-500">
            그만
          </button>
        </div>
        <div className="mt-5">
          <QuestionCard
            key={q.id}
            q={q}
            mode="practice"
            seed={seed}
            index={at}
            total={session.length}
            response={responses[q.id]}
            onRespond={(r, ok) => {
              setResponses((m) => ({ ...m, [q.id]: r }));
              setMarks((m) => ({ ...m, [q.id]: ok }));
              answer(q.id, ok);
            }}
          />
        </div>
        {done && (
          <Button size="lg" className="mt-5 w-full" onClick={() => setAt((a) => a + 1)}>
            {at + 1 < session.length ? (
              <>
                다음 <ArrowRight size={16} />
              </>
            ) : (
              <>
                결과 보기 <Check size={16} />
              </>
            )}
          </Button>
        )}
      </main>
    );
  }

  return (
    <main className="py-6">
      <h1 className="text-[22px] font-bold tracking-tight">퀴즈</h1>
      <p className="mt-1 text-[13px] text-zinc-400">
        고르면 바로 채점하고 해설을 보여 줍니다. 틀린 것은 복습함에 들어갑니다.
      </p>

      {concept ? (
        <Card className="mt-4">
          <p className="text-[12.5px] text-zinc-400">이 개념만</p>
          <p className="text-[15px] font-bold">{termLabel(CONCEPT_MAP[concept])}</p>
          <button type="button" className="mt-1 text-[12.5px] font-semibold text-indigo-300" onClick={() => setConcept(null)}>
            범위 넓히기
          </button>
        </Card>
      ) : (
        <>
          <SectionTitle>범위</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <Chip active={chapter === "all"} onClick={() => setChapter("all")}>
              전체
            </Chip>
            {COURSE.chapters.map((c) => (
              <Chip key={c.id} active={chapter === c.id} onClick={() => setChapter(c.id)}>
                {c.title}
              </Chip>
            ))}
          </div>
        </>
      )}

      <SectionTitle>무엇을</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </Chip>
        ))}
      </div>

      {!concept && (
        <>
          <SectionTitle>몇 문제</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 40].map((n) => (
              <Chip key={n} active={count === n} onClick={() => setCount(n)}>
                {n}문제
              </Chip>
            ))}
          </div>
        </>
      )}

      <Button size="lg" className="mt-8 w-full" disabled={available === 0} onClick={() => start()}>
        {available === 0
          ? mode === "wrong"
            ? "틀린 채로 남은 문제가 없어요"
            : "남은 문제가 없어요"
          : `시작 (${Math.min(available, concept ? available : count)}문제)`}
      </Button>
      {chapter !== "all" && !concept && (
        <p className="mt-2 text-center text-[12px] text-zinc-500">{CHAPTER_MAP[chapter]?.source}</p>
      )}
    </main>
  );
}
