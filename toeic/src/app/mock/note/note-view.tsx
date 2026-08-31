"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import {
  answerOf,
  buildExam,
  choicesOf,
  EXAM_MAP,
  promptOf,
  type Exam,
  type ExamId,
  type ExamItem,
} from "@/lib/exam";
import { SKILL_LABEL } from "@/data/reading";
import { PART_MAP } from "@/data/parts";
import { useApp } from "@/lib/store";
import type { MockAttempt, PartId } from "@/lib/types";
import { letterOf } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { MOCK_FORMAT } from "../progress";

/**
 * 오답 노트.
 *
 * 결과 화면에도 틀린 문항이 뜨지만, 거기서 한 번 나오면 다시 볼 방법이
 * 없었다. 그런데 오답 노트는 시험 직후보다 **며칠 뒤에** 필요하다 —
 * 그때가 같은 함정에 또 걸리는 때다.
 *
 * 시험지는 저장하지 않는다. 응시 기록에 적어 둔 seed 로 다시 만든다.
 * 다만 문항이 그 사이에 늘거나 고쳐졌으면 같은 seed 에서 다른 시험지가
 * 나오므로, 문항 id 가 한 글자도 다르지 않을 때만 문항별로 보여 주고
 * 그렇지 않으면 파트별 점수까지만 보여 준다. 엉뚱한 문제를 "당신이 틀린
 * 문제"라고 내미는 것보다 덜 보여 주는 편이 낫다.
 */
export function MockNote() {
  const params = useSearchParams();
  const hydrated = useApp((s) => s.hydrated);
  const attempts = useApp((s) => s.mockAttempts);
  const [onlyWrong, setOnlyWrong] = useState(true);
  const [openScripts, setOpenScripts] = useState<Record<string, boolean>>({});

  const at = Number(params.get("at") ?? 0);
  const attempt = attempts.find((a) => a.startedAt === at);
  const exam = useMemo(() => rebuild(attempt), [attempt]);

  if (!hydrated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        불러오는 중…
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="py-6">
        <Back />
        <EmptyState
          icon="📄"
          title="그 응시 기록을 찾지 못했습니다"
          desc="기록을 지웠거나, 다른 기기에서 본 시험일 수 있습니다."
          action={
            <Link href="/mock">
              <Button size="sm">모의고사 목록</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const wrongCount = attempt.total - attempt.correct;
  const name = EXAM_MAP[attempt.examId as ExamId]?.name ?? attempt.examId;

  return (
    <main className="py-6">
      <Back />

      <header className="mt-3">
        <h1 className="text-2xl font-bold">오답 노트</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
          {name} · {new Date(attempt.startedAt).toLocaleDateString("ko-KR")} ·{" "}
          {attempt.total}문항 중{" "}
          <b className="text-rose-200">{wrongCount}문항</b>을 틀렸습니다 · 환산{" "}
          {attempt.scaled.total}점
        </p>
      </header>

      {/* ── 파트별 ─────────────────────────────────────────────── */}
      <h2 className="mb-3 mt-8 text-base font-bold">파트별</h2>
      <div className="flex flex-col gap-2">
        {attempt.byPart.map((b) => {
          const miss = b.total - b.correct;
          const part = PART_MAP[b.part];
          return (
            <Card key={b.part}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[14px] font-bold">
                  Part {b.part}
                  <span className="ml-1.5 text-[12px] font-medium text-zinc-500">
                    {part?.name}
                  </span>
                </span>
                <span className="text-[13px] font-bold text-zinc-200">
                  {miss}문항 오답{" "}
                  <span className="font-medium text-zinc-500">
                    ({b.correct}/{b.total})
                  </span>
                </span>
              </div>
              {/* 이 화면의 막대는 위에서 아래까지 한 뜻이다 — 빨간 만큼 틀렸다 */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${(miss / Math.max(1, b.total)) * 100}%` }}
                />
              </div>
              {part && miss > 0 && (
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                  {part.trap}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <WeakSkills attempt={attempt} exam={exam} />

      {/* ── 문항별 ─────────────────────────────────────────────── */}
      {exam ? (
        <>
          <div className="mb-3 mt-8 flex items-center justify-between">
            <h2 className="text-base font-bold">문항별</h2>
            <button
              onClick={() => setOnlyWrong((v) => !v)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              {onlyWrong ? "전체 보기" : "틀린 것만"}
            </button>
          </div>
          <QuestionList
            exam={exam}
            answers={attempt.answers}
            onlyWrong={onlyWrong}
            openScripts={openScripts}
            toggleScript={(id) =>
              setOpenScripts((s) => ({ ...s, [id]: !s[id] }))
            }
          />
        </>
      ) : (
        <Card className="mt-8 border-amber-500/25 bg-amber-500/[0.06]">
          <p className="text-[13px] leading-relaxed text-zinc-300">
            이 응시의 시험지는 다시 만들 수 없었습니다. 오답 노트가 생기기 전에
            본 시험이거나, 그 사이 문항이 늘거나 고쳐졌기 때문입니다.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
            엉뚱한 문제를 내미는 대신 파트별 결과까지만 보여 드립니다. 지금부터
            보는 시험은 문항별로 그대로 남습니다.
          </p>
        </Card>
      )}

      <div className="mt-8 flex flex-col gap-2">
        <Link href="/review?only=wrong">
          <Button className="w-full">틀린 것 복습하기</Button>
        </Link>
        <Link href="/mock">
          <Button variant="ghost" className="w-full">
            다시 응시하기
          </Button>
        </Link>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-600">
        틀린 문항은 이미 복습 큐에 들어가 있습니다.
        <br />
        노트는 이 기기 안에만 남습니다.
      </p>
    </main>
  );
}

function Back() {
  return (
    <Link
      href="/mock"
      className="-my-2 inline-flex items-center gap-1 py-2 text-[13px] text-zinc-400 hover:text-zinc-200"
    >
      <ChevronLeft size={15} />
      모의고사
    </Link>
  );
}

// ─── 시험지 되살리기 ─────────────────────────────────────────────
/**
 * seed 로 시험지를 다시 만든다.
 * 다시 만든 문항 id 가 그때 적어 둔 것과 완전히 같을 때만 돌려준다.
 */
function rebuild(attempt?: MockAttempt): Exam | null {
  if (!attempt) return null;
  if (typeof attempt.seed !== "number") return null;
  // 시험지를 뽑는 방식이 바뀐 뒤라면 저장된 답이 다른 문항을 가리킨다
  if (attempt.fmt !== MOCK_FORMAT) return null;
  const qids = attempt.qids;
  if (!qids || qids.length !== attempt.total) return null;

  const id = attempt.examId as ExamId;
  if (!EXAM_MAP[id]) return null;

  let exam: Exam;
  try {
    // band 는 모의고사 구성에 쓰이지 않는다 (lib/exam.ts 참고)
    exam = buildExam(id, 900, attempt.seed);
  } catch {
    return null;
  }
  if (exam.items.length !== qids.length) return null;
  if (exam.items.some((it, i) => it.questionId !== qids[i])) return null;
  return exam;
}

// ─── 취약 유형 ───────────────────────────────────────────────────
/**
 * 어떤 **유형**에서 틀리는가.
 *
 * 파트별로만 보면 "Part 7 을 많이 틀렸다"까지밖에 모른다. 그런데 Part 7
 * 안에서도 세부 사항을 놓치는 사람과 지문 연계에서 무너지는 사람은 해야
 * 할 공부가 전혀 다르다. 문항마다 달아 둔 skill 로 다시 세면 그것이 갈린다.
 */
function WeakSkills({
  attempt,
  exam,
}: {
  attempt: MockAttempt;
  exam: Exam | null;
}) {
  const rows = useMemo(() => {
    if (!exam) return [];
    const map = new Map<string, { skill: string; wrong: number; total: number }>();
    exam.items.forEach((it, i) => {
      const skill = skillOf(it);
      if (!skill) return;
      const cur = map.get(skill) ?? { skill, wrong: 0, total: 0 };
      cur.total++;
      if (attempt.answers[i] !== answerOf(it)) cur.wrong++;
      map.set(skill, cur);
    });
    return [...map.values()]
      .filter((r) => r.wrong > 0)
      .sort((a, b) => b.wrong / b.total - a.wrong / a.total || b.wrong - a.wrong);
  }, [attempt, exam]);

  if (rows.length === 0) return null;

  return (
    <>
      <h2 className="mb-3 mt-8 text-base font-bold">약한 유형</h2>
      <Card>
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.skill}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-bold">
                  {SKILL_LABEL[r.skill] ?? r.skill}
                </span>
                {/*
                  같은 화면의 파트 머리글은 (맞힌 수/전체)로 적는다. 여기만
                  (틀린 수/전체)라 "7 / 7"이 다 맞힌 것처럼 읽혔다. 무엇을
                  세는지 글자로 밝힌다.
                */}
                <span className="text-[12px] font-bold tabular-nums text-rose-200">
                  {r.total}개 중 {r.wrong}개 틀림
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${(r.wrong / r.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3.5 text-[11px] leading-relaxed text-zinc-500">
          틀린 비율이 높은 유형부터 놓았습니다. 파트가 아니라 유형으로 보면
          무엇을 연습해야 하는지가 갈립니다 — 같은 Part 7 이라도 세부 사항과
          지문 연계는 다른 공부입니다.
        </p>
      </Card>
    </>
  );
}

function skillOf(it: ExamItem): string | null {
  if (it.listening) return it.listening.questions[it.indexInSet].skill;
  if (it.reading) return it.reading.questions[it.indexInSet].skill;
  return null;
}

// ─── 문항별 ──────────────────────────────────────────────────────
function QuestionList({
  exam,
  answers,
  onlyWrong,
  openScripts,
  toggleScript,
}: {
  exam: Exam;
  answers: Record<number, number>;
  onlyWrong: boolean;
  openScripts: Record<string, boolean>;
  toggleScript: (id: string) => void;
}) {
  const rows = exam.items
    .map((it, i) => ({ it, i }))
    .filter(({ it, i }) => (onlyWrong ? answers[i] !== answerOf(it) : true));

  if (rows.length === 0) {
    return <EmptyState icon="🎉" title="틀린 문항이 없습니다" />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map(({ it, i }) => {
        const cs = choicesOf(it);
        const ans = answerOf(it);
        const mine = answers[i];
        const ok = mine === ans;
        const skill = skillOf(it);
        // 같은 지문의 첫 문항에서만 지문을 그린다
        const firstOfSet = it.indexInSet === 0 || rows[0].it === it;
        const key = `${it.setId}`;
        const open = openScripts[key];

        return (
          <Card
            key={it.questionId}
            className={cn(!ok && "border-rose-500/25 bg-rose-500/[0.04]")}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-zinc-500">
                {i + 1}번
              </span>
              <Badge>Part {it.part}</Badge>
              {skill && <Badge>{SKILL_LABEL[skill] ?? skill}</Badge>}
              {mine === undefined && <Badge>무응답</Badge>}
            </div>

            {/* 지문·대본 — 접어 둔다. 펴 보는 것 자체가 복습이다 */}
            {firstOfSet && hasSource(it) && (
              <div className="mt-2">
                <button
                  onClick={() => toggleScript(key)}
                  className="inline-flex items-center gap-1 text-[12px] text-indigo-300 hover:text-indigo-200"
                >
                  {open ? <EyeOff size={13} /> : <Eye size={13} />}
                  {open ? "지문 접기" : "지문·대본 펴 보기"}
                </button>
                {open && (
                  <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <Source it={it} />
                  </div>
                )}
              </div>
            )}

            {promptOf(it) && (
              <p className="mt-2 text-[14px] font-bold leading-snug">
                {promptOf(it)}
              </p>
            )}

            <div className="mt-2 flex flex-col gap-1">
              {cs.map((c, ci) => {
                const isAnswer = ci === ans;
                const picked = mine === ci;
                if (!isAnswer && !picked) {
                  return (
                    <p
                      key={ci}
                      className="pl-6 text-[13px] leading-[1.7] text-zinc-500"
                    >
                      {letterOf(ci)}. {c.text}
                    </p>
                  );
                }
                return (
                  <div
                    key={ci}
                    className={cn(
                      "rounded-xl border px-3 py-2",
                      isAnswer
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-rose-500/40 bg-rose-500/10",
                    )}
                  >
                    <p className="text-[13px] leading-[1.7]">
                      <span
                        className={cn(
                          "mr-1.5 text-[11px] font-bold",
                          isAnswer ? "text-emerald-200" : "text-rose-200",
                        )}
                      >
                        {isAnswer ? "정답" : "내 답"} {letterOf(ci)}
                      </span>
                      {c.text}
                    </p>
                    {/*
                      틀렸을 때 정작 알고 싶은 것은 내 답이 왜 아닌지다.
                      rose-100 은 밝은 화면에서 그대로 옅게 남아 분홍 판
                      위에서 거의 보이지 않는다 — 한 단계 진한 rose-200 을
                      쓴다(밝은 화면에서 #9f1239 로 내려간다).
                    */}
                    <p
                      className={cn(
                        "mt-1.5 text-[12px] leading-[1.75]",
                        isAnswer ? "text-zinc-300" : "text-rose-200",
                      )}
                    >
                      {c.why}
                    </p>
                  </div>
                );
              })}
            </div>

            {it.reading?.questions[it.indexInSet]?.evidence && (
              <p className="mt-2.5 rounded-xl bg-white/[0.04] px-3 py-2 text-[12px] leading-[1.8] text-zinc-300">
                <span className="font-bold text-zinc-400">근거 </span>
                {it.reading.questions[it.indexInSet].evidence}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function hasSource(it: ExamItem): boolean {
  if (it.listening) return Boolean(it.listening.scene || it.listening.script);
  if (it.reading) return Boolean(it.reading.passage?.length);
  return false;
}

function Source({ it }: { it: ExamItem }) {
  if (it.listening) {
    const s = it.listening;
    return (
      <>
        {s.scene && (
          <p className="text-[13px] leading-[1.9] text-zinc-200">
            <span className="mr-1 text-[11px] font-bold text-zinc-500">사진</span>
            {s.scene}
          </p>
        )}
        {s.script?.map((line, i) => (
          <p key={i} className="mt-1.5 text-[13px] leading-[1.9] text-zinc-200">
            <span className="mr-1.5 text-[11px] font-bold text-zinc-500">
              {line.speaker === "narrator" ? "안내" : line.speaker}
            </span>
            {line.text}
          </p>
        ))}
      </>
    );
  }
  if (it.reading?.passage) {
    // 이 문항이 지문의 몇 번 빈칸인가 (Part 6)
    const myBlank = it.reading.questions[it.indexInSet]?.blank;
    return (
      <>
        {it.reading.passage.map((p, i) => (
          <div key={i} className={i > 0 ? "mt-3 border-t border-white/10 pt-3" : ""}>
            {p.header?.map((h) => (
              <p key={h.label} className="text-[12px] text-zinc-400">
                <span className="font-bold">{h.label}</span> {h.value}
              </p>
            ))}
            <p className="mt-1.5 whitespace-pre-line text-[13px] leading-[1.9] text-zinc-200">
              <Body body={p.body} myBlank={myBlank} />
            </p>
          </div>
        ))}
      </>
    );
  }
  return null;
}

/**
 * Part 6 지문의 빈칸 표시.
 *
 * 본문에는 [[1]] 처럼 박혀 있다. 그대로 두면 노트에 "[[1]]" 이 그냥 찍혀
 * 나와, 지문을 펴 봐도 어디가 빈칸인지 알 수 없다. 밑줄로 바꾸고,
 * **지금 보고 있는 문항의 빈칸만** 도드라지게 한다 — 지문 하나에 빈칸이
 * 넷이라 표시가 없으면 어느 것을 틀렸는지 찾느라 다시 헤맨다.
 */
function Body({ body, myBlank }: { body: string; myBlank?: number }) {
  return (
    <>
      {body.split(/(\[\[\d+\]\])/).map((chunk, i) => {
        const m = /^\[\[(\d+)\]\]$/.exec(chunk);
        if (!m) return <span key={i}>{chunk}</span>;
        const n = Number(m[1]);
        const mine = n === myBlank;
        return (
          <span
            key={i}
            className={cn(
              "mx-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[12px] font-bold",
              mine
                ? "bg-rose-500/25 text-rose-200"
                : "bg-white/10 text-zinc-400",
            )}
          >
            {mine ? `이 문항 ${n}` : `___ ${n}`}
          </span>
        );
      })}
    </>
  );
}

/** 타입 좁히기용 — PartId 를 그대로 쓰는 곳이 있어 남겨 둔다 */
export type { PartId };
