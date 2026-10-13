"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Layers, ListChecks, Star } from "lucide-react";
import { Gate } from "@/components/gate";
import { NotesView } from "@/components/notes";
import { Button, Card, ImportanceBadge } from "@/components/ui";
import { CHAPTER_MAP, conceptsOf, notesOf, questionsOf, questionsOfChapter, termLabel } from "@/lib/course";
import { setQuizPreset } from "@/lib/handoff";
import { useApp } from "@/lib/store";

export function ChapterView({ id }: { id: string }) {
  return (
    <Gate>
      <Inner id={id} />
    </Gate>
  );
}

function Inner({ id }: { id: string }) {
  const router = useRouter();
  const ch = CHAPTER_MAP[id];
  const studied = useApp((s) => s.studied);
  const starred = useApp((s) => s.starred);
  const log = useApp((s) => s.log);
  // 탭은 주소의 #notes 로도 고를 수 있다 (강의 노트로 바로 오는 길)
  const [tab, setTab] = useState<"cards" | "notes">("cards");
  useEffect(() => {
    if (window.location.hash === "#notes") setTab("notes");
  }, []);
  if (!ch) return <p className="py-10 text-center text-zinc-400">없는 장입니다.</p>;
  const cs = conceptsOf(id);
  const qs = questionsOfChapter(id);
  const notes = notesOf(id);
  const pick = (t: "cards" | "notes") => {
    setTab(t);
    history.replaceState(null, "", t === "notes" ? "#notes" : location.pathname + location.search);
  };

  return (
    <main className="py-6">
      <Link href="/learn" className="inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-400">
        <ArrowLeft size={15} /> 개념
      </Link>
      <h1 className="mt-3 text-[21px] font-bold leading-tight tracking-tight">{ch.title}</h1>
      {ch.en && <p className="mt-0.5 text-[13px] text-zinc-400">{ch.en}</p>}
      <p className="mt-2 text-[12px] text-zinc-500">자료: {ch.source}</p>

      <Button
        className="mt-4 w-full"
        variant="outline"
        onClick={() => {
          setQuizPreset({ chapter: id, mode: "all" });
          router.push("/quiz");
        }}
      >
        <ListChecks size={16} /> 이 장 퀴즈 ({qs.length}문제)
      </Button>

      {notes.length > 0 && (
        <div role="tablist" className="mt-4 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {(
            [
              ["cards", "개념 카드", Layers, cs.length],
              ["notes", "강의 노트 (교안 전체)", BookOpen, notes.length],
            ] as const
          ).map(([k, label, Icon, n]) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => pick(k)}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[12.5px] font-bold ${
                tab === k ? "bg-white/10 text-zinc-100" : "text-zinc-400"
              }`}
            >
              <Icon size={14} /> {label} <span className="font-normal opacity-70">{n}</span>
            </button>
          ))}
        </div>
      )}

      {tab === "notes" && notes.length > 0 ? (
        <div className="mt-4">
          <p className="mb-3 text-[12px] leading-relaxed text-zinc-400">
            교안을 슬라이드 순서대로 빠짐없이 옮겼습니다. 개념 카드에 없는 작은 내용도 여기 있어요.
          </p>
          <NotesView sections={notes} />
        </div>
      ) : (
      <div className="mt-4 flex flex-col gap-2">
        {cs.map((c) => {
          const cq = questionsOf(c.id);
          const ok = cq.filter((q) => log[q.id]?.lastRight).length;
          return (
            <Link key={c.id} href={`/concept/${c.id}`}>
              <Card className="py-3.5">
                <div className="flex items-center gap-2">
                  {studied[c.id] ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded-full border border-white/20" />
                  )}
                  <p className="min-w-0 flex-1 text-[14px] font-bold leading-snug">{termLabel(c)}</p>
                  {starred.includes(c.id) && <Star size={14} className="shrink-0 fill-amber-300 text-amber-300" />}
                  <ImportanceBadge level={c.importance} compact />
                  <ChevronRight size={15} className="shrink-0 text-zinc-500" />
                </div>
                {cq.length > 0 && (
                  <p className="mt-1 pl-6 text-[11.5px] text-zinc-400">
                    문제 {ok}/{cq.length} 맞힘
                  </p>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
      )}
    </main>
  );
}
