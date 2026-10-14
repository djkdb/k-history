"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, FileText, GraduationCap, Layers, ListChecks, Printer, Star } from "lucide-react";
import { ClozeBar } from "@/components/cloze-bar";
import { Figures } from "@/components/figure";
import { Gate } from "@/components/gate";
import { NotesView } from "@/components/notes";
import { Button, Card, ClozeCtx, ImportanceBadge, RichText, Sentences } from "@/components/ui";
import { countKeys, useCloze } from "@/lib/cloze";
import { COURSE, CHAPTER_MAP, conceptsOf, notesOf, questionsOf, questionsOfChapter, termLabel } from "@/lib/course";
import { setQuizPreset } from "@/lib/handoff";
import { usePrintLight } from "@/lib/print";
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
  type Tab = "cards" | "sheet" | "notes";
  const [tab, setTab] = useState<Tab>("cards");
  const cloze = useCloze();
  useEffect(() => {
    if (window.location.hash === "#notes") setTab("notes");
    if (window.location.hash === "#sheet") setTab("sheet");
  }, []);
  if (!ch) return <p className="py-10 text-center text-zinc-400">없는 장입니다.</p>;
  const cs = conceptsOf(id);
  const qs = questionsOfChapter(id);
  const notes = notesOf(id);
  const pick = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "cards" ? location.pathname + location.search : `#${t}`);
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
        className="no-print mt-4 w-full lg:w-auto"
        variant="outline"
        onClick={() => {
          setQuizPreset({ chapter: id, mode: "all" });
          router.push("/quiz");
        }}
      >
        <ListChecks size={16} /> 이 장 퀴즈 ({qs.length}문제)
      </Button>

      <div role="tablist" className="no-print mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 lg:max-w-xl">
        {(
          [
            ["cards", "개념 카드", Layers, cs.length],
            ["sheet", "한눈에", FileText, null],
            ["notes", "강의 노트", BookOpen, notes.length],
          ] as const
        )
          .filter(([k]) => k !== "notes" || notes.length > 0)
          .map(([k, label, Icon, n]) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => pick(k)}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 text-[12.5px] font-bold ${
                tab === k ? "bg-white/10 text-zinc-100" : "text-zinc-400"
              }`}
            >
              <Icon size={14} /> {label} {n !== null && <span className="font-normal opacity-70">{n}</span>}
            </button>
          ))}
      </div>

      {tab === "sheet" ? (
        <div className="mt-4">
          <div className="no-print mb-3 flex items-start gap-2">
            <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-zinc-400">
              이 장을 한 장으로 — 핵심 요약 · 그림 · 시험 포인트만 모았어요. 시험 직전에 훑거나 인쇄해서 보세요.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 px-2.5 py-1.5 text-[12px] font-semibold text-zinc-300"
            >
              <Printer size={14} /> 인쇄
            </button>
          </div>
          <ClozeBar on={cloze.on} count={countKeys(cs.map((c) => c.summary))} onToggle={cloze.toggle} onRehide={cloze.rehide} />
          <ClozeCtx.Provider value={{ on: cloze.on, gen: cloze.gen }}>
            <Sheet id={id} />
          </ClozeCtx.Provider>
        </div>
      ) : tab === "notes" && notes.length > 0 ? (
        <div className="mt-4 lg:max-w-3xl">
          <p className="mb-3 text-[12px] leading-relaxed text-zinc-400">
            교안을 슬라이드 순서대로 빠짐없이 옮겼습니다. 개념 카드에 없는 작은 내용도 여기 있어요.
          </p>
          <ClozeBar
            on={cloze.on}
            count={countKeys(notes.flatMap((n) => n.lines))}
            onToggle={cloze.toggle}
            onRehide={cloze.rehide}
          />
          <ClozeCtx.Provider value={{ on: cloze.on, gen: cloze.gen }}>
            <NotesView sections={notes} />
          </ClozeCtx.Provider>
        </div>
      ) : (
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {cs.map((c) => {
          const cq = questionsOf(c.id);
          const ok = cq.filter((q) => log[q.id]?.lastRight).length;
          return (
            <Link key={c.id} href={`/concept/${c.id}`} className="flex">
              <Card className="flex-1 py-3.5">
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

/**
 * 장 한눈에 — 개념마다 요약 · 그림 · 시험 포인트만.
 * 긴 설명을 덜어 내고(일관성 원칙) 장 전체를 한 번에 훑게 한다.
 */
function Sheet({ id }: { id: string }) {
  const cs = conceptsOf(id);
  const en = COURSE.englishExam;
  usePrintLight();
  return (
    <div className="sheet-cols">
      {cs.map((c, i) => (
        <section key={c.id} className="print-sheet rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-start gap-2">
            <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-bold text-indigo-200">
              {i + 1}
            </span>
            <Link href={`/concept/${c.id}`} className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-bold leading-snug">{en && c.en ? c.en : c.title}</span>
              {c.en && <span className="mt-0.5 block text-[11.5px] text-zinc-400">{en ? c.title : c.en}</span>}
            </Link>
            <ImportanceBadge level={c.importance} compact />
          </div>
          <p className="mt-2 text-[13.5px] leading-[1.75] text-zinc-200">
            <Sentences gap="mt-1">{c.summary}</Sentences>
          </p>
          <Figures list={c.figures} />
          {c.exam && (
            <p className="mt-3 flex gap-1.5 rounded-xl bg-indigo-500/[0.08] px-3 py-2 text-[12.5px] leading-relaxed text-zinc-200">
              <GraduationCap size={14} className="mt-[3px] shrink-0 text-indigo-300" />
              <span className="min-w-0">
                <Sentences gap="mt-1">{c.exam}</Sentences>
              </span>
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
