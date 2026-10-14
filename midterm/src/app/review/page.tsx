"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye, ListChecks, NotebookPen, ThumbsDown, ThumbsUp } from "lucide-react";
import { ConceptBody } from "@/components/concept-body";
import { Gate } from "@/components/gate";
import { Button, Card, EmptyState, ProgressBar, SectionTitle } from "@/components/ui";
import { CHAPTER_MAP, CONCEPT_MAP, COURSE, termLabel } from "@/lib/course";
import { setQuizPreset } from "@/lib/handoff";
import { dueCards, nextDueLabel } from "@/lib/srs";
import { useApp } from "@/lib/store";

export default function Review() {
  return (
    <Gate>
      <ReviewView />
    </Gate>
  );
}

/**
 * 잊을 때쯤 다시 묻는다.
 *
 * 이름만 보고 먼저 떠올려 본 뒤 뒤집는다. 바로 펼쳐 보면 읽은 것을 아는
 * 것으로 착각한다 — 떠올리는 순간이 기억을 붙인다.
 */
function ReviewView() {
  const router = useRouter();
  const cards = useApp((s) => s.cards);
  const wrongIds = useApp((s) => s.wrongIds);
  const reviewConcept = useApp((s) => s.reviewConcept);
  const nSure = useApp((s) => Object.keys(s.sureWrong).length);
  // 시작할 때의 목록을 붙들어 둔다 — 채점할 때마다 목록이 바뀌면 자리가 밀린다
  const [queue] = useState(() => dueCards(cards).map((c) => c.sourceId).filter((id) => CONCEPT_MAP[id]));
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const [marks, setMarks] = useState<boolean[]>([]);

  const upcoming = useMemo(
    () => [...cards].filter((c) => c.nextDueAt > Date.now()).sort((a, b) => a.nextDueAt - b.nextDueAt).slice(0, 6),
    [cards],
  );

  const quiz = (mode: "wrong" | "sure") => {
    setQuizPreset({ mode });
    router.push("/quiz");
  };
  const wrongBlock = (
    <div className="mt-3 flex flex-col gap-2">
      {nSure > 0 && (
        <Button variant="outline" className="w-full" onClick={() => quiz("sure")}>
          <AlertTriangle size={16} className="text-rose-300" /> 확신했는데 틀린 문제 {nSure}개 다시 풀기
        </Button>
      )}
      {wrongIds.length > 0 && (
        <Button variant="outline" className="w-full" onClick={() => quiz("wrong")}>
          <ListChecks size={16} /> 틀린 문제 {wrongIds.length}개 다시 풀기
        </Button>
      )}
      <Button variant="ghost" className="w-full" onClick={() => router.push("/wrongs")}>
        <NotebookPen size={16} /> 오답 노트
      </Button>
    </div>
  );

  if (queue.length === 0 || at >= queue.length) {
    const right = marks.filter(Boolean).length;
    return (
      <main className="page-read py-6">
        <h1 className="text-[22px] font-bold tracking-tight">복습</h1>
        {marks.length > 0 ? (
          <Card className="mt-4 text-center">
            <p className="text-[15px] font-bold">오늘 복습 끝</p>
            <p className="mt-1 text-[13px] text-zinc-400">
              {marks.length}개 중 {right}개를 떠올렸습니다. 헷갈린 것은 곧 다시 나옵니다.
            </p>
          </Card>
        ) : (
          <EmptyState
            title="지금 복습할 개념이 없어요"
            desc={cards.length === 0 ? "개념을 다 보고 ‘다 봤어요’를 누르면 여기에 쌓입니다." : "다음 복습 때가 되면 여기에 나옵니다."}
            action={
              <Link href="/learn" className="text-[13px] font-semibold text-indigo-300">
                개념 보러 가기 →
              </Link>
            }
          />
        )}
        {wrongBlock}
        {upcoming.length > 0 && (
          <>
            <SectionTitle>다음 복습</SectionTitle>
            <div className="flex flex-col gap-1.5">
              {upcoming.map((c) => (
                <div key={c.sourceId} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-[13px]">
                  <span className="min-w-0 truncate">{CONCEPT_MAP[c.sourceId] ? termLabel(CONCEPT_MAP[c.sourceId]) : c.sourceId}</span>
                  <span className="shrink-0 text-zinc-400">{nextDueLabel(c)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    );
  }

  const c = CONCEPT_MAP[queue[at]];
  const grade = (ok: boolean) => {
    reviewConcept(c.id, ok);
    setMarks((m) => [...m, ok]);
    setOpen(false);
    setAt((a) => a + 1);
  };

  return (
    <main className="page-read py-6">
      <div className="flex items-center gap-3">
        <ProgressBar value={at} max={queue.length} className="flex-1" />
        <span className="text-[12px] text-zinc-400">
          {at + 1}/{queue.length}
        </span>
      </div>
      <Card className="mt-5">
        <p className="text-[12px] text-zinc-400">{CHAPTER_MAP[c.chapter]?.title}</p>
        <h2 className="mt-1 text-[21px] font-bold leading-tight">{COURSE.englishExam && c.en ? c.en : c.title}</h2>
        {c.en && <p className="mt-0.5 text-[13.5px] text-indigo-200">{COURSE.englishExam ? c.title : c.en}</p>}
        {!open ? (
          <>
            <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-400">
              무엇인지, 무엇과 다른지 먼저 떠올려 보세요.
            </p>
            <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
              <Eye size={16} /> 펼쳐 보기
            </Button>
          </>
        ) : (
          <div className="mt-4">
            <ConceptBody c={c} />
          </div>
        )}
      </Card>
      {open && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" size="lg" onClick={() => grade(false)}>
            <ThumbsDown size={16} /> 헷갈렸어요
          </Button>
          <Button size="lg" onClick={() => grade(true)}>
            <ThumbsUp size={16} /> 떠올렸어요
          </Button>
        </div>
      )}
    </main>
  );
}
