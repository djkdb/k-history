"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, ListChecks, Star } from "lucide-react";
import { Gate } from "@/components/gate";
import { Button, Card, ImportanceBadge } from "@/components/ui";
import { CHAPTER_MAP, conceptsOf, questionsOf, questionsOfChapter, termLabel } from "@/lib/course";
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
  if (!ch) return <p className="py-10 text-center text-zinc-400">없는 장입니다.</p>;
  const cs = conceptsOf(id);
  const qs = questionsOfChapter(id);

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
    </main>
  );
}
