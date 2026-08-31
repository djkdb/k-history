"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Keyboard, Sigma } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Grade, MockAttempt, QuizQuestion, SubjectId } from "@/lib/types";
import { SUBJECT_MAP, subjectInk } from "@/data/subjects";
import { CONCEPT_MAP } from "@/data/concepts";
import { FORMULA_MAP } from "@/data/formulas";
import { SHORTCUT_MAP } from "@/data/shortcuts";
import { makeMock, QUIZ_TYPE_LABELS } from "@/lib/quiz";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  KeyCaps,
  ProgressBar,
  SectionTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { MOCK_FORMAT } from "../progress";

/**
 * 오답 노트.
 *
 * 점수만 보고 나오면 다음 시험에서 같은 문제를 또 틀린다. 정작 알아야 할
 * 것은 "몇 점"이 아니라 "무엇을, 왜"이기 때문이다. 그래서 이 화면은 두
 * 가지만 한다 — 틀린 문항을 그대로 다시 펴 주고, 어느 갈래가 약한지
 * 세어 준다.
 *
 * 시험지는 저장하지 않는다. 응시 기록에 적어 둔 seed로 다시 만든다.
 * 다만 개념 데이터가 그 사이에 늘거나 고쳐졌으면 같은 seed에서 다른
 * 시험지가 나오므로, 문항 id가 한 글자도 다르지 않을 때만 문항별로
 * 보여 주고 그렇지 않으면 개념 목록으로 물러선다. 엉뚱한 문제를 "당신이
 * 틀린 문제"라고 내미는 것보다 덜 보여 주는 편이 낫다.
 */
export function MockNote() {
  const search = useSearchParams();
  const hydrated = useApp((s) => s.hydrated);
  const attempts = useApp((s) => s.mockAttempts);
  const [onlyWrong, setOnlyWrong] = useState(true);

  const at = Number(search.get("at") ?? 0);
  const attempt = attempts.find((a) => a.startedAt === at);

  /** 시험지를 되살릴 수 있으면 되살린다 — 못 하면 null */
  const paper = useMemo(() => rebuild(attempt), [attempt]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        불러오는 중…
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="pt-6">
        <BackLink />
        <EmptyState
          icon="📄"
          title="그 응시 기록을 찾지 못했습니다"
          desc="기록을 지웠거나, 다른 기기에서 본 시험일 수 있습니다."
          action={
            <Link href="/mock">
              <Button size="sm">모의고사 홈</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const practical = attempt.examId.endsWith("-practical");
  const wrongCount = attempt.total - attempt.score;

  return (
    <div className="pt-6">
      <BackLink practical={practical} />

      <h1 className="mt-3 text-xl font-bold tracking-tight">오답 노트</h1>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        {attempt.examId.startsWith("1") ? "1급" : "2급"}{" "}
        {practical ? "실기" : "필기"} ·{" "}
        {new Date(attempt.startedAt).toLocaleDateString("ko-KR")} ·{" "}
        {attempt.total}문항 중{" "}
        <b className="text-red-200">{wrongCount}문항</b>을 틀렸습니다.
      </p>

      {/* ── 어디가 약한가 ─────────────────────────────────────── */}
      {/* 이 화면의 막대는 위에서 아래까지 한 가지 뜻만 갖는다 — 빨간 만큼
          틀렸다. 점수 막대와 섞이면 같은 그림이 두 가지를 뜻하게 된다. */}
      <SectionTitle>{practical ? "갈래별" : "과목별"}</SectionTitle>
      <div className="flex flex-col gap-2">
        {attempt.bySubject.map((b) => {
          const pct = b.total ? Math.round((b.correct / b.total) * 100) : 0;
          const bad = !practical && pct < 40;
          const name =
            SUBJECT_MAP[b.subject]?.name ??
            (b.subject === "formula" ? "함수 수식" : "단축키");
          return (
            <Card key={b.subject} className={cn(bad && "border-red-500/30")}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold">{name}</span>
                <span className="text-sm font-bold text-zinc-200">
                  {b.total - b.correct}문항 오답{" "}
                  <span className="font-medium text-zinc-500">
                    · {pct}점
                  </span>
                </span>
              </div>
              <ProgressBar
                value={b.total - b.correct}
                max={b.total || 1}
                color="#ef4444"
                className="mt-2.5"
              />
              {bad && (
                <p className="mt-2 text-[11px] text-red-200">
                  40점 미만 — 이 과목만으로 불합격입니다. 여기부터 보세요.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <WeakTopics attempt={attempt} paper={paper} />

      {/* ── 틀린 문항 ─────────────────────────────────────────── */}
      {paper ? (
        <QuestionNote
          attempt={attempt}
          paper={paper}
          onlyWrong={onlyWrong}
          setOnlyWrong={setOnlyWrong}
        />
      ) : practical ? (
        <PracticalNote attempt={attempt} />
      ) : (
        <ConceptNote attempt={attempt} />
      )}

      <div className="mt-8 grid grid-cols-2 gap-2">
        <Link href="/review" className="contents">
          <Button variant="ghost" className="w-full">
            복습 큐로
          </Button>
        </Link>
        <Link href={practical ? "/practical/mock" : "/mock"} className="contents">
          <Button className="w-full">다시 응시</Button>
        </Link>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-600">
        틀린 문항의 개념은 이미 복습 큐에 들어가 있습니다.
        <br />
        노트는 이 기기 안에만 남습니다.
      </p>
    </div>
  );
}

function BackLink({ practical }: { practical?: boolean }) {
  return (
    <Link
      href={practical ? "/practical" : "/mock"}
      className="-my-2 inline-flex items-center gap-1 py-2 text-[13px] text-zinc-400 hover:text-zinc-200"
    >
      <ArrowLeft size={14} />
      {practical ? "실기" : "모의고사"}
    </Link>
  );
}

// ─── 시험지 되살리기 ─────────────────────────────────────────────
/**
 * seed로 시험지를 다시 만든다.
 * 다시 만든 문항 id가 그때 적어 둔 것과 완전히 같을 때만 돌려준다.
 */
function rebuild(attempt?: MockAttempt): QuizQuestion[] | null {
  if (!attempt) return null;
  if (attempt.examId.endsWith("-practical")) return null;
  if (typeof attempt.seed !== "number") return null;
  // 보기를 섞는 방식이 바뀐 뒤라면 저장된 "몇 번" 이 다른 보기를 가리킨다
  if (attempt.fmt !== MOCK_FORMAT) return null;
  const qids = attempt.qids;
  if (!qids || qids.length !== attempt.total) return null;

  const grade = (attempt.examId.startsWith("1") ? 1 : 2) as Grade;
  let paper: QuizQuestion[];
  try {
    paper = makeMock(grade, attempt.seed);
  } catch {
    return null;
  }
  if (paper.length !== qids.length) return null;
  if (paper.some((q, i) => q.id !== qids[i])) return null;
  return paper;
}

// ─── 취약 갈래 ───────────────────────────────────────────────────
/**
 * 어느 갈래가 약한가.
 *
 * 과목 단위는 너무 크다 — "스프레드시트 32점"을 봐도 무엇을 펴야 할지
 * 모른다. 개념마다 적혀 있는 갈래(topic)로 다시 세면 "함수 7문항 중
 * 5문항"처럼 펼 쪽이 나온다.
 */
function WeakTopics({
  attempt,
  paper,
}: {
  attempt: MockAttempt;
  paper: QuizQuestion[] | null;
}) {
  const rows = useMemo(() => {
    const map = new Map<
      string,
      { key: string; subject: string; topic: string; wrong: number; total: number }
    >();

    const add = (subject: string, topic: string, wrong: boolean) => {
      const key = `${subject}/${topic}`;
      const cur =
        map.get(key) ?? { key, subject, topic, wrong: 0, total: 0 };
      cur.total += 1;
      if (wrong) cur.wrong += 1;
      map.set(key, cur);
    };

    if (paper) {
      // 시험지를 되살렸으면 분모까지 정확히 셀 수 있다
      paper.forEach((q, i) => {
        const c = CONCEPT_MAP[q.sourceId];
        if (!c) return;
        add(q.subject as string, c.topic, attempt.answers[i] !== q.answerIndex);
      });
    } else {
      // 틀린 것만 남아 있을 때 — 분모 없이 "몇 개 틀렸나"만
      for (const id of attempt.wrongSourceIds ?? []) {
        const c = CONCEPT_MAP[id];
        if (c) {
          add(c.subject, c.topic, true);
          continue;
        }
        const f = FORMULA_MAP[id];
        if (f) {
          add("formula", f.topic, true);
          continue;
        }
        const s = SHORTCUT_MAP[id];
        if (s) add("shortcut", s.topic, true);
      }
    }

    return [...map.values()]
      .filter((r) => r.wrong > 0)
      .sort((a, b) => b.wrong - a.wrong || b.total - a.total)
      .slice(0, 8);
  }, [attempt, paper]);

  if (rows.length === 0) return null;

  return (
    <>
      <SectionTitle>약한 갈래</SectionTitle>
      <Card>
        <div className="flex flex-col gap-3">
          {rows.map((r) => {
            const s = SUBJECT_MAP[r.subject];
            const label =
              s?.short ??
              (r.subject === "formula"
                ? "수식"
                : r.subject === "shortcut"
                  ? "단축키"
                  : r.subject);
            return (
              <div key={r.key}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="min-w-0 truncate text-[13px]">
                    <span
                      className="mr-1.5 text-[11px] font-medium"
                      style={{ color: s ? subjectInk(s.id) : undefined }}
                    >
                      {label}
                    </span>
                    <b className="font-bold">{r.topic}</b>
                  </p>
                  <span className="shrink-0 text-[12px] font-bold text-red-200 tabular-nums">
                    {r.wrong}
                    {paper ? (
                      <span className="text-zinc-500"> / {r.total}</span>
                    ) : (
                      <span className="font-medium">문항</span>
                    )}
                  </span>
                </div>
                {paper && (
                  <ProgressBar
                    value={r.wrong}
                    max={r.total}
                    color="#ef4444"
                    className="mt-1.5"
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3.5 text-[11px] leading-relaxed text-zinc-500">
          {paper
            ? "이 시험지에서 갈래별로 몇 문항 중 몇 문항을 틀렸는지 셌습니다. 위쪽부터 펴 보세요."
            : "틀린 문항의 갈래만 세었습니다. 몇 문항 중이었는지는 이 기록에 남아 있지 않습니다."}
        </p>
      </Card>
    </>
  );
}

// ─── 문항별 노트 (시험지를 되살린 경우) ──────────────────────────
function QuestionNote({
  attempt,
  paper,
  onlyWrong,
  setOnlyWrong,
}: {
  attempt: MockAttempt;
  paper: QuizQuestion[];
  onlyWrong: boolean;
  setOnlyWrong: (v: boolean) => void;
}) {
  const rows = paper
    .map((q, i) => ({ q, i, mine: attempt.answers[i] }))
    .filter((r) => (onlyWrong ? r.mine !== r.q.answerIndex : true));

  return (
    <>
      <SectionTitle
        action={
          <div className="flex gap-1.5">
            <Chip active={onlyWrong} onClick={() => setOnlyWrong(true)}>
              틀린 것만
            </Chip>
            <Chip active={!onlyWrong} onClick={() => setOnlyWrong(false)}>
              전체
            </Chip>
          </div>
        }
      >
        문항별
      </SectionTitle>

      {rows.length === 0 ? (
        <EmptyState icon="🎉" title="틀린 문항이 없습니다" />
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.map(({ q, i, mine }) => {
            const subject = SUBJECT_MAP[q.subject as SubjectId];
            const ok = mine === q.answerIndex;
            const blank = mine === undefined;
            const concept = CONCEPT_MAP[q.sourceId];
            return (
              <Card
                key={q.id}
                className={cn(!ok && "border-red-500/25 bg-red-500/[0.04]")}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-zinc-500">
                    {i + 1}번
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      background: `${subject?.color}22`,
                      color: subject ? subjectInk(subject.id) : undefined,
                    }}
                  >
                    {subject?.short ?? subject?.name}
                  </span>
                  {concept && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                      {concept.topic}
                    </span>
                  )}
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-500">
                    {QUIZ_TYPE_LABELS[q.type]}
                  </span>
                </div>

                <p className="mt-2 text-[14px] font-bold leading-snug">
                  {q.question}
                </p>
                {q.passage && (
                  <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] leading-[1.85] text-zinc-200">
                    {q.passage}
                  </p>
                )}

                {/* 보기 — 내가 고른 것과 정답만 눈에 띄게 */}
                <div className="mt-2.5 flex flex-col gap-1">
                  {q.options.map((opt, oi) => {
                    const isAnswer = oi === q.answerIndex;
                    const picked = mine === oi;
                    if (!isAnswer && !picked) {
                      return (
                        <p
                          key={oi}
                          className="pl-6 text-[13px] leading-[1.7] text-zinc-500"
                        >
                          {oi + 1}. {opt}
                        </p>
                      );
                    }
                    return (
                      <div
                        key={oi}
                        className={cn(
                          "rounded-xl border px-3 py-2",
                          isAnswer
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-red-500/40 bg-red-500/10",
                        )}
                      >
                        <p className="text-[13px] leading-[1.7]">
                          <span
                            className={cn(
                              "mr-1.5 text-[11px] font-bold",
                              isAnswer ? "text-emerald-300" : "text-red-200",
                            )}
                          >
                            {isAnswer ? "정답" : "내 답"} {oi + 1}
                          </span>
                          {opt}
                        </p>
                        {/* 내가 고른 오답이 왜 아닌지 — 정작 알고 싶은 것 */}
                        {picked && !isAnswer && q.optionNotes?.[oi] && (
                          <p className="mt-1.5 text-[12px] leading-[1.75] text-red-200">
                            {q.optionNotes[oi]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {blank && (
                  <p className="mt-2 text-[12px] text-amber-200">
                    답하지 않아 오답으로 처리된 문항입니다.
                  </p>
                )}

                <p className="mt-2.5 text-[13px] leading-[1.85] text-zinc-300">
                  {q.explanation}
                </p>
                {concept && (
                  <Link
                    href={`/concept/${q.sourceId}`}
                    className="mt-2 inline-block text-[12px] text-indigo-300 hover:text-indigo-200"
                  >
                    {concept.title} 펴 보기 →
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── 개념 목록 (시험지를 되살리지 못한 필기) ─────────────────────
function ConceptNote({ attempt }: { attempt: MockAttempt }) {
  const ids = [...new Set(attempt.wrongSourceIds ?? [])].filter(
    (id) => CONCEPT_MAP[id],
  );

  return (
    <>
      <SectionTitle>틀린 개념</SectionTitle>
      {ids.length === 0 ? (
        <Card>
          <p className="text-[13px] leading-relaxed text-zinc-300">
            이 응시는 오답 노트가 생기기 전에 본 시험이라 문항을 되살릴 수
            없습니다. 위의 과목별 점수까지만 남아 있습니다.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
            지금부터 보는 시험은 문항별로 그대로 남습니다.
          </p>
        </Card>
      ) : (
        <>
          <Card className="mb-2.5 border-amber-500/25 bg-amber-500/[0.06]">
            <p className="text-[12px] leading-relaxed text-zinc-300">
              그때의 시험지는 다시 만들 수 없었습니다(그 사이 개념이 늘거나
              고쳐졌습니다). 대신 틀린 개념을 그대로 펴 드립니다.
            </p>
          </Card>
          <div className="flex flex-col gap-2">
            {ids.map((id) => {
              const c = CONCEPT_MAP[id];
              const s = SUBJECT_MAP[c.subject];
              return (
                <Link key={id} href={`/concept/${id}`}>
                  <Card>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{
                          background: `${s?.color}22`,
                          color: s ? subjectInk(s.id) : undefined,
                        }}
                      >
                        {s?.short}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                        {c.topic}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-bold">{c.title}</p>
                    <p className="mt-1 text-[13px] leading-[1.8] text-zinc-400">
                      {c.summary}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

// ─── 실기 노트 ───────────────────────────────────────────────────
/**
 * 실기는 답이 글(수식)이라 문항을 되살릴 수 없다.
 * 대신 틀린 수식·단축키를 정답과 함께 그대로 펴 준다 — 실기에서 알고
 * 싶은 것은 어차피 "그때 뭘 썼어야 했나" 하나뿐이다.
 */
function PracticalNote({ attempt }: { attempt: MockAttempt }) {
  const ids = [...new Set(attempt.wrongSourceIds ?? [])];
  const formulas = ids.map((id) => FORMULA_MAP[id]).filter(Boolean);
  const shortcuts = ids.map((id) => SHORTCUT_MAP[id]).filter(Boolean);

  if (formulas.length === 0 && shortcuts.length === 0) {
    return (
      <>
        <SectionTitle>틀린 문항</SectionTitle>
        <Card>
          <p className="text-[13px] leading-relaxed text-zinc-300">
            이 응시는 오답 노트가 생기기 전에 본 시험이라 무엇을 틀렸는지
            남아 있지 않습니다. 위의 갈래별 점수까지만 있습니다.
          </p>
        </Card>
      </>
    );
  }

  return (
    <>
      {formulas.length > 0 && (
        <>
          <SectionTitle>틀린 수식</SectionTitle>
          <div className="flex flex-col gap-2">
            {formulas.map((f) => (
              <Card key={f.id}>
                <div className="flex items-center gap-1.5">
                  <Sigma size={13} className="text-emerald-300" />
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                    {f.topic}
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-bold leading-snug">
                  {f.prompt}
                </p>
                <p className="mt-2 break-all rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-mono text-[13px] leading-[1.7] text-emerald-200">
                  {f.answer}
                </p>
                <p className="mt-2 text-[13px] leading-[1.85] text-zinc-300">
                  {f.explanation}
                </p>
                {f.trap && (
                  <p className="mt-1.5 text-[12px] leading-[1.8] text-amber-200">
                    자주 틀리는 곳 — {f.trap}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {shortcuts.length > 0 && (
        <>
          <SectionTitle>틀린 단축키</SectionTitle>
          <div className="flex flex-col gap-2">
            {shortcuts.map((s) => (
              <Card key={s.id}>
                <div className="flex items-center gap-1.5">
                  <Keyboard size={13} className="text-sky-300" />
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                    {s.topic}
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-bold leading-snug">
                  {s.action}
                </p>
                <div className="mt-2">
                  <KeyCaps combo={s.display} />
                </div>
                {s.note && (
                  <p className="mt-2 text-[13px] leading-[1.85] text-zinc-400">
                    {s.note}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
