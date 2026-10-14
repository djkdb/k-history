"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, NotebookPen, RotateCcw, X } from "lucide-react";
import { Gate } from "@/components/gate";
import { QuestionCard } from "@/components/question-card";
import { Button, Card, Chip, ProgressBar, SectionTitle } from "@/components/ui";
import { COURSE, CONCEPT_MAP, CHAPTER_MAP, questionsOf, questionsOfChapter, termLabel } from "@/lib/course";
import { responseText, type Response } from "@/lib/grade";
import { takeQuizPreset } from "@/lib/handoff";
import { usePref } from "@/lib/prefs";
import { filterQuiz, pickQuiz, type QuizMarks, type QuizMode } from "@/lib/quiz";
import { useApp } from "@/lib/store";
import type { Conf, Question } from "@/lib/types";

export default function Quiz() {
  return (
    <Gate>
      <QuizView />
    </Gate>
  );
}

const MODES: { id: QuizMode; label: string; desc: string }[] = [
  { id: "all", label: "섞어서", desc: "확신 오답 → 틀린 것 → 안 푼 것 순으로 먼저 냅니다" },
  { id: "new", label: "안 푼 것", desc: "한 번도 안 푼 문제만" },
  { id: "wrong", label: "틀린 것", desc: "지금 틀린 채로 남은 문제만" },
  { id: "sure", label: "확신 오답", desc: "확신했는데 틀린 문제 — 서로 다른 날 두 번 맞혀야 빠집니다" },
  { id: "shaky", label: "불안한 것", desc: "확신 오답 + 틀린 것 + 찍어서 맞힌 것" },
  { id: "starred", label: "별표 개념", desc: "별표한 개념의 문제만" },
];

const COUNTS = [5, 10, 20, 40];

function QuizView() {
  const router = useRouter();
  const log = useApp((s) => s.log);
  const wrongIds = useApp((s) => s.wrongIds);
  const sureWrong = useApp((s) => s.sureWrong);
  const lucky = useApp((s) => s.lucky);
  const starred = useApp((s) => s.starred);
  const answer = useApp((s) => s.answer);
  const [askConf, setAskConf] = usePref("mid-ask-conf", true);

  const [chapter, setChapter] = useState<string | "all">("all");
  const [concept, setConcept] = useState<string | null>(null);
  const [mode, setMode] = useState<QuizMode>("all");
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<Question[] | null>(null);
  const [seed, setSeed] = useState(0);
  const [at, setAt] = useState(0);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [confs, setConfs] = useState<Record<string, Conf | undefined>>({});

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
  // 시작할 때의 기록으로 고른다 — 푸는 동안 기록이 바뀌어도 판은 그대로
  const marksOf: QuizMarks = useMemo(
    () => ({ log, wrongIds, sure: Object.keys(sureWrong), lucky, starred }),
    [log, wrongIds, sureWrong, lucky, starred],
  );
  const sizes = useMemo(
    () => Object.fromEntries(MODES.map((m) => [m.id, filterQuiz(pool, marksOf, m.id).length])) as Record<QuizMode, number>,
    [pool, marksOf],
  );
  const available = sizes[mode];

  const reset = (qs: Question[]) => {
    setSession(qs);
    setAt(0);
    setMarks({});
    setResponses({});
    setConfs({});
  };

  const start = (n = count) => {
    reset(pickQuiz(pool, marksOf, mode, concept ? pool.length : n, Date.now()));
    setSeed(Date.now() % 2147483647);
  };

  // 답한 뒤 Enter·Space·→ 로 다음 문제
  const done = !!session && at < session.length && session[at].id in responses;
  useEffect(() => {
    if (!done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "BUTTON", "A"].includes(t.tagName)) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        setAt((a) => a + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  // 미리 정해진 조건이면 고르기 화면을 건너뛴다
  useEffect(() => {
    if (preset && !session && available > 0) start(preset.concept ? 999 : 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, available]);

  if (session && at >= session.length) {
    const right = session.filter((q) => marks[q.id]).length;
    const wrongs = session.filter((q) => !marks[q.id]);
    const sureMiss = wrongs.filter((q) => confs[q.id] === "sure");
    const guessHit = session.filter((q) => marks[q.id] && confs[q.id] === "guess");
    const asked = session.filter((q) => confs[q.id]);
    const sureN = asked.filter((q) => confs[q.id] === "sure");
    return (
      <main className="page-read py-6">
        <h1 className="text-[22px] font-bold">퀴즈 끝</h1>
        <Card className="mt-4 text-center">
          <p className="text-[40px] font-black leading-none">
            {right}
            <span className="text-[20px] text-zinc-500">/{session.length}</span>
          </p>
          <p className="mt-2 text-[13px] text-zinc-400">틀린 문제는 복습함과 오답 노트에 들어갔습니다.</p>
          {asked.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-[12px] text-zinc-400">
              <p>
                <b className="block text-[16px] text-zinc-100">
                  {sureN.filter((q) => marks[q.id]).length}/{sureN.length}
                </b>
                확신해서 맞힘
              </p>
              <p>
                <b className={`block text-[16px] ${sureMiss.length ? "text-rose-300" : "text-zinc-100"}`}>{sureMiss.length}</b>
                확신 오답
              </p>
              <p>
                <b className={`block text-[16px] ${guessHit.length ? "text-amber-300" : "text-zinc-100"}`}>{guessHit.length}</b>
                찍어서 맞힘
              </p>
            </div>
          )}
        </Card>
        {wrongs.length > 0 && (
          <>
            <SectionTitle>틀린 문제 — 개념 다시 보기</SectionTitle>
            <div className="flex flex-col gap-2">
              {[...sureMiss, ...wrongs.filter((q) => confs[q.id] !== "sure")].map((q) => (
                <Link key={q.id} href={`/concept/${q.concept}`}>
                  <Card className="py-3">
                    <p className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                      {confs[q.id] === "sure" ? (
                        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-rose-300" aria-label="확신 오답" />
                      ) : (
                        <X size={15} className="mt-0.5 shrink-0 text-rose-300" />
                      )}
                      <span className="line-clamp-2">{q.q}</span>
                    </p>
                    {confs[q.id] === "sure" && (
                      <p className="mt-1 pl-6 text-[11.5px] font-bold text-rose-300">확신했는데 틀림</p>
                    )}
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
              onClick={() => reset([...wrongs, ...guessHit])}
            >
              <RotateCcw size={16} /> 틀린 {wrongs.length}문제{guessHit.length ? ` + 찍은 ${guessHit.length}문제` : ""} 바로 다시
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => router.push("/wrongs")}>
            <NotebookPen size={16} /> 오답 노트
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setSession(null)}>
            다른 퀴즈 고르기
          </Button>
        </div>
      </main>
    );
  }

  if (session) {
    const q = session[at];
    return (
      <main className="page-read py-6">
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
            askConf={askConf}
            response={responses[q.id]}
            onRespond={(r, ok, c) => {
              setResponses((m) => ({ ...m, [q.id]: r }));
              setMarks((m) => ({ ...m, [q.id]: ok }));
              setConfs((m) => ({ ...m, [q.id]: c }));
              answer(q.id, ok, c, responseText(q, r));
            }}
          />
        </div>
        {done && (
          <Button size="lg" className="mt-5 w-full" onClick={() => setAt((a) => a + 1)}>
            {at + 1 < session.length ? (
              <>
                다음 <ArrowRight size={16} />
                <span className="ml-1 hidden text-[11px] font-semibold opacity-60 [@media(pointer:fine)]:inline">Enter</span>
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
    <main className="page-read py-6">
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
        {MODES.map((m) =>
          // 비어 있는 특별 목록은 감춘다 — 누를 수 없는 단추만 늘어난다
          m.id !== "all" && m.id !== "new" && sizes[m.id] === 0 && mode !== m.id ? null : (
            <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
              {m.label}
              {m.id !== "all" && <span className="ml-1 opacity-60">{sizes[m.id]}</span>}
            </Chip>
          ),
        )}
      </div>
      <p className="mt-2 text-[12px] text-zinc-500">{MODES.find((m) => m.id === mode)?.desc}</p>

      {!concept && (
        <>
          <SectionTitle>몇 문제</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {COUNTS.map((n) => (
              <Chip key={n} active={count === n} onClick={() => setCount(n)}>
                {n}문제
              </Chip>
            ))}
            <Chip active={count === 9999} onClick={() => setCount(9999)}>
              전부
            </Chip>
          </div>
        </>
      )}

      <SectionTitle>채점 전에</SectionTitle>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
        <input
          type="checkbox"
          checked={askConf}
          onChange={(e) => setAskConf(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-500"
        />
        <span className="text-[13px] leading-relaxed">
          <b className="text-zinc-100">자신감 묻기</b>
          <span className="block text-zinc-400">
            확신 · 반반 · 찍음을 고른 뒤 채점합니다. 확신했는데 틀린 문제와 찍어서 맞힌 문제를 따로 모아 다시 냅니다.
          </span>
        </span>
      </label>

      <Button size="lg" className="mt-8 w-full" disabled={available === 0} onClick={() => start()}>
        {available === 0
          ? mode === "wrong"
            ? "틀린 채로 남은 문제가 없어요"
            : mode === "sure"
              ? "확신 오답이 없어요"
              : mode === "starred"
                ? "별표한 개념에 문제가 없어요"
                : "남은 문제가 없어요"
          : `시작 (${Math.min(available, concept ? available : count)}문제)`}
      </Button>
      {chapter !== "all" && !concept && (
        <p className="mt-2 text-center text-[12px] text-zinc-500">{CHAPTER_MAP[chapter]?.source}</p>
      )}
    </main>
  );
}
