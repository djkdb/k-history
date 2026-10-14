"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Gate } from "@/components/gate";
import { QuestionCard } from "@/components/question-card";
import { Button, Card, ProgressBar, RichText, SectionTitle } from "@/components/ui";
import { COURSE, Q_MAP, chapterOfQuestion, termLabel, CONCEPT_MAP } from "@/lib/course";
import { answerText, isCorrect, responseText } from "@/lib/grade";
import { clearMock, readMock, writeMock, type MockRun } from "@/lib/mock";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function MockSession() {
  return (
    <Gate>
      <SessionView />
    </Gate>
  );
}

function SessionView() {
  const router = useRouter();
  const recordMock = useApp((s) => s.recordMock);
  const [run, setRun] = useState<MockRun | null>(null);
  const [at, setAt] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; results: Record<string, boolean> } | null>(null);

  useEffect(() => {
    const r = readMock();
    if (!r || r.finished) router.replace("/mock");
    else setRun(r);
  }, [router]);

  const qs = useMemo(() => (run ? run.qids.map((id) => Q_MAP[id]).filter(Boolean) : []), [run]);

  if (!run) return null;

  const submit = () => {
    const results: Record<string, boolean> = {};
    const said: Record<string, string> = {};
    for (const q of qs) {
      results[q.id] = isCorrect(q, run.responses[q.id]);
      if (!results[q.id]) said[q.id] = responseText(q, run.responses[q.id] ?? "");
    }
    const correct = Object.values(results).filter(Boolean).length;
    recordMock({
      startedAt: run.startedAt,
      finishedAt: Date.now(),
      qids: run.qids,
      results,
      correct,
      total: qs.length,
    }, said);
    clearMock();
    setResult({ correct, total: qs.length, results });
    window.scrollTo({ top: 0 });
  };

  if (result) {
    const pct = Math.round((result.correct / Math.max(1, result.total)) * 100);
    const byCh = COURSE.chapters
      .map((ch) => {
        const mine = qs.filter((q) => chapterOfQuestion(q)?.id === ch.id);
        return { ch, n: mine.length, ok: mine.filter((q) => result.results[q.id]).length };
      })
      .filter((x) => x.n > 0);
    const wrongs = qs.filter((q) => !result.results[q.id]);
    return (
      <main className="page-read py-6">
        <h1 className="text-[22px] font-bold">채점 결과</h1>
        <Card className="mt-4 text-center">
          <p className="text-[44px] font-black leading-none">{pct}<span className="text-[20px] text-zinc-500">점</span></p>
          <p className="mt-2 text-[13px] text-zinc-400">
            {result.total}문제 중 {result.correct}개 · 틀린 것은 복습함에 넣었습니다
          </p>
        </Card>
        <SectionTitle>장별</SectionTitle>
        <div className="flex flex-col gap-2">
          {byCh.map(({ ch, n, ok }) => (
            <div key={ch.id} className="rounded-xl bg-white/[0.03] px-3.5 py-2.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="min-w-0 truncate font-semibold">{ch.title}</span>
                <span className={cn("shrink-0", ok / n < 0.6 ? "text-rose-300" : "text-zinc-300")}>
                  {ok}/{n}
                </span>
              </div>
              <ProgressBar value={ok} max={n} className="mt-1.5" />
            </div>
          ))}
        </div>
        {wrongs.length > 0 && (
          <>
            <SectionTitle>틀린 문제 해설</SectionTitle>
            <div className="flex flex-col gap-2">
              {wrongs.map((q) => {
                const r = run.responses[q.id];
                const mine =
                  r === undefined || r === ""
                    ? "안 적음"
                    : q.kind === "mc"
                      ? q.options[r as number]
                      : q.kind === "ox"
                        ? (r ? "O" : "X")
                        : responseText(q, r);
                return (
                  <Card key={q.id}>
                    <p className="whitespace-pre-line text-[13.5px] font-semibold leading-relaxed">
                      <RichText>{q.q}</RichText>
                    </p>
                    <p className="mt-2 flex gap-1.5 text-[12.5px] text-rose-200">
                      <X size={14} className="mt-0.5 shrink-0" /> 내 답: {mine}
                    </p>
                    <p className="mt-1 flex gap-1.5 text-[12.5px] text-emerald-200">
                      <Check size={14} className="mt-0.5 shrink-0" /> 정답: {answerText(q)}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-300">
                      <RichText>{q.explain}</RichText>
                    </p>
                    <Link href={`/concept/${q.concept}`} className="mt-2 inline-block text-[12px] font-semibold text-indigo-300">
                      {termLabel(CONCEPT_MAP[q.concept])} 다시 보기 →
                    </Link>
                  </Card>
                );
              })}
            </div>
          </>
        )}
        <Button size="lg" className="mt-6 w-full" onClick={() => router.replace("/mock")}>
          모의고사 목록으로
        </Button>
      </main>
    );
  }

  const q = qs[at];
  const answered = Object.keys(run.responses).filter((k) => run.responses[k] !== "").length;
  const setResponse = (r: MockRun["responses"][string]) => {
    const next = { ...run, responses: { ...run.responses, [q.id]: r } };
    setRun(next);
    writeMock(next);
  };

  return (
    <main className="page-read py-6">
      <div className="flex items-center gap-3">
        <ProgressBar value={answered} max={qs.length} className="flex-1" />
        <button
          type="button"
          className="text-[12.5px] font-semibold text-zinc-500"
          onClick={() => {
            if (confirm("모의고사를 멈출까요? 답한 것은 남아 있어서 나중에 이어서 풀 수 있습니다.")) router.push("/mock");
          }}
        >
          멈추기
        </button>
      </div>

      <div className="mt-5">
        <QuestionCard key={q.id} q={q} mode="exam" seed={run.startedAt} index={at} total={qs.length} response={run.responses[q.id]} onRespond={(r) => setResponse(r)} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="outline" disabled={at === 0} onClick={() => setAt((a) => a - 1)}>
          <ArrowLeft size={16} /> 이전
        </Button>
        {at + 1 < qs.length ? (
          <Button onClick={() => setAt((a) => a + 1)}>
            다음 <ArrowRight size={16} />
          </Button>
        ) : (
          <Button
            onClick={() => {
              const left = qs.length - answered;
              if (left === 0 || confirm(`아직 ${left}문제를 안 풀었어요. 그래도 제출할까요?`)) submit();
            }}
          >
            제출 <Check size={16} />
          </Button>
        )}
      </div>

      {/* 답안지 — 눌러서 그 문제로 */}
      <div className="mt-6 grid grid-cols-8 gap-1.5">
        {qs.map((x, i) => {
          const has = run.responses[x.id] !== undefined && run.responses[x.id] !== "";
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => setAt(i)}
              aria-label={`${i + 1}번${has ? " (답함)" : ""}`}
              className={cn(
                "h-9 rounded-lg text-[12px] font-bold",
                i === at ? "bg-indigo-500 text-white" : has ? "bg-indigo-500/20 text-indigo-100" : "bg-white/5 text-zinc-400",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      {answered === qs.length && at + 1 < qs.length && (
        <Button size="lg" className="mt-4 w-full" onClick={submit}>
          다 풀었어요 — 제출 <Check size={16} />
        </Button>
      )}
    </main>
  );
}
