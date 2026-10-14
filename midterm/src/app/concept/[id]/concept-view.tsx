"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, ListChecks, Star } from "lucide-react";
import { ClozeBar } from "@/components/cloze-bar";
import { ConceptBody } from "@/components/concept-body";
import { Gate } from "@/components/gate";
import { Button, ClozeCtx, ImportanceBadge } from "@/components/ui";
import { countKeys, useCloze } from "@/lib/cloze";
import { COURSE, CHAPTER_MAP, CONCEPT_MAP, notesOf, questionsOf } from "@/lib/course";
import { setQuizPreset } from "@/lib/handoff";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ConceptView({ id }: { id: string }) {
  return (
    <Gate>
      <Inner id={id} />
    </Gate>
  );
}

function Inner({ id }: { id: string }) {
  const router = useRouter();
  const c = CONCEPT_MAP[id];
  const done = useApp((s) => !!s.studied[id]);
  const star = useApp((s) => s.starred.includes(id));
  const markStudied = useApp((s) => s.markStudied);
  const unmarkStudied = useApp((s) => s.unmarkStudied);
  const toggleStar = useApp((s) => s.toggleStar);
  const cloze = useCloze();
  if (!c) return <p className="py-10 text-center text-zinc-400">없는 개념입니다.</p>;

  const ch = CHAPTER_MAP[c.chapter];
  // 이전·다음은 강의 순서 그대로 (장을 넘어간다)
  const i = COURSE.concepts.findIndex((x) => x.id === id);
  const prev = COURSE.concepts[i - 1];
  const next = COURSE.concepts[i + 1];
  const qs = questionsOf(id);
  const en = COURSE.englishExam;

  return (
    <main className="py-6">
      <div className="flex items-center gap-2">
        <Link href={`/learn/${c.chapter}`} className="inline-flex min-w-0 flex-1 items-center gap-1 text-[13px] font-semibold text-zinc-400">
          <ArrowLeft size={15} className="shrink-0" /> <span className="truncate">{ch?.title}</span>
        </Link>
        <button
          type="button"
          onClick={() => toggleStar(id)}
          aria-pressed={star}
          aria-label={star ? "별표 빼기" : "별표 하기"}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/5"
        >
          <Star size={18} className={cn(star ? "fill-amber-300 text-amber-300" : "text-zinc-400")} />
        </button>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <h1 className="min-w-0 flex-1 text-[22px] font-bold leading-tight tracking-tight">
          {en && c.en ? c.en : c.title}
        </h1>
        <ImportanceBadge level={c.importance} />
      </div>
      {c.en && <p className="mt-1 text-[14px] font-semibold text-indigo-200">{en ? c.title : c.en}</p>}

      <div className="mt-5">
        <ClozeBar
          on={cloze.on}
          count={countKeys([JSON.stringify(c)])}
          onToggle={cloze.toggle}
          onRehide={cloze.rehide}
        />
        <ClozeCtx.Provider value={{ on: cloze.on, gen: cloze.gen }}>
          <ConceptBody c={c} />
        </ClozeCtx.Provider>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          size="lg"
          variant={done ? "outline" : "primary"}
          className="w-full"
          onClick={() => (done ? unmarkStudied(id) : markStudied(id))}
        >
          <Check size={17} /> {done ? "공부함 — 다시 표시 지우기" : "다 봤어요 (복습함에 넣기)"}
        </Button>
        {qs.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setQuizPreset({ concept: id, mode: "all" });
              router.push("/quiz");
            }}
          >
            <ListChecks size={16} /> 이 개념 문제 {qs.length}개 풀기
          </Button>
        )}
        {notesOf(c.chapter).length > 0 && (
          <Link
            href={`/learn/${c.chapter}#notes`}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 px-4 py-3 text-[13.5px] font-semibold text-zinc-300"
          >
            <BookOpen size={15} /> 이 장 강의 노트 (교안 전체) 보기
          </Link>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {prev ? (
          <Link href={`/concept/${prev.id}`} className="glass flex items-center gap-1 rounded-xl px-3 py-3 text-[12.5px] text-zinc-300">
            <ChevronLeft size={15} className="shrink-0" /> <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/concept/${next.id}`}
            onClick={() => markStudied(id)}
            className="glass flex items-center justify-end gap-1 rounded-xl px-3 py-3 text-right text-[12.5px] text-zinc-300"
          >
            <span className="truncate">{next.title}</span> <ChevronRight size={15} className="shrink-0" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
