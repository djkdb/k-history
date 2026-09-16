"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Search } from "lucide-react";
import {
  Card,
  Chip,
  ImportanceBadge,
  ProgressBar,
  SectionTitle,
} from "@/components/ui";
import { CONCEPTS } from "@/data/concepts";
import { SUBJECTS, subjectInk, type SubjectId } from "@/data/exam";
import { useApp, useTrack } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <main className="py-20 text-center text-sm text-zinc-500">
          불러오는 중…
        </main>
      }
    >
      <LearnScreen />
    </Suspense>
  );
}

const SUBJECT_IDS = SUBJECTS.map((s) => s.id);

function LearnScreen() {
  const track = useTrack();
  const studied = useApp((s) => s.studiedIds);
  const params = useSearchParams();
  // 홈의 "개념 보기" 에서 과목을 달고 넘어온다
  const fromUrl = params.get("subject");
  const [subject, setSubject] = useState<SubjectId | null>(() =>
    fromUrl && SUBJECT_IDS.includes(fromUrl as SubjectId)
      ? (fromUrl as SubjectId)
      : null,
  );
  const [q, setQ] = useState("");
  /** 아직 안 본 개념을 앞으로 — 이미 본 것을 다시 훑느라 시간을 쓰지 않게 */
  const [unseenFirst, setUnseenFirst] = useState(false);

  const list = useMemo(() => {
    let out = CONCEPTS.filter((c) => c.tracks.includes(track));
    if (subject) out = out.filter((c) => c.subject === subject);
    const needle = q.trim().toLowerCase();
    if (needle)
      out = out.filter(
        (c) =>
          c.title.toLowerCase().includes(needle) ||
          c.summary.toLowerCase().includes(needle),
      );
    /*
     * 안 본 것부터 — 목록은 늘 같은 순서라 이미 본 개념이 계속 맨 위에 온다.
     * 55개 중 40개를 본 사람에게는 남은 15개를 찾는 일이 곧 일거리다.
     * 과목 안의 순서(쉬운 것 → 어려운 것)는 그대로 지킨다.
     */
    if (unseenFirst) {
      const seen = new Set(studied);
      out = [
        ...out.filter((c) => !seen.has(c.id)),
        ...out.filter((c) => seen.has(c.id)),
      ];
    }
    return out;
  }, [track, subject, q, unseenFirst, studied]);

  const done = list.filter((c) => studied.includes(c.id)).length;

  return (
    <main className="py-6">
      <h1 className="text-2xl font-bold tracking-tight">학습</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        {track === "written"
          ? "필기 다섯 과목의 개념입니다. 과목을 골라 훑고, 헷갈리는 짝은 표로 견줘 보세요."
          : "실기에 나오는 개념만 걸러 두었습니다. 실기는 고르는 것이 아니라 적으므로 용어를 그대로 외워야 합니다."}
      </p>

      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <Search size={16} className="shrink-0 text-zinc-500" />
          <input
            type="search"
            aria-label="개념 찾기"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="개념 이름이나 내용으로 찾기"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-zinc-600"
          />
        </div>
      </Card>

      {/*
        과목 하나를 깊이 보는 길.

        칩은 목록을 거르기만 한다. "이 과목에서 무엇이 남았는가" 는 출제기준
        주요항목대로 묶어 봐야 보이므로, 과목마다 따로 들어가는 칸을 둔다.
      */}
      <SectionTitle>과목별로 보기</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {SUBJECTS.map((s) => {
          const inSub = CONCEPTS.filter(
            (c) => c.subject === s.id && c.tracks.includes(track),
          );
          if (!inSub.length) return null;
          const done = inSub.filter((c) => studied.includes(c.id)).length;
          return (
            <Link key={s.id} href={`/learn/${s.id}`}>
              <Card className="h-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px]">{s.symbol}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-bold">
                    {s.short}
                  </span>
                </div>
                <p className="mt-1.5 text-[11.5px] tabular-nums text-zinc-500">
                  {done} / {inSub.length}
                </p>
                <ProgressBar
                  className="mt-1.5"
                  value={done}
                  max={inSub.length}
                  color={subjectInk(s.id)}
                />
              </Card>
            </Link>
          );
        })}
      </div>

      <SectionTitle>개념 훑어보기</SectionTitle>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip active={subject === null} onClick={() => setSubject(null)}>
          전체 {CONCEPTS.filter((c) => c.tracks.includes(track)).length}
        </Chip>
        {SUBJECTS.map((s) => {
          const n = CONCEPTS.filter(
            (c) => c.subject === s.id && c.tracks.includes(track),
          ).length;
          if (!n) return null;
          return (
            <Chip
              key={s.id}
              active={subject === s.id}
              onClick={() => setSubject(s.id)}
            >
              {s.symbol} {s.short} {n}
            </Chip>
          );
        })}
      </div>

      <div className="mt-4">
        <ProgressBar value={done} max={Math.max(1, list.length)} />
        <div className="mt-1.5 flex items-center gap-2">
          <p className="min-w-0 flex-1 text-[12px] text-zinc-500">
            {`${list.length}개 가운데 ${done}개를 봤습니다`}
          </p>
          {done > 0 && done < list.length && (
            <button
              type="button"
              onClick={() => setUnseenFirst((v) => !v)}
              className={cn(
                "-my-1 shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                unseenFirst
                  ? "bg-indigo-500/20 text-indigo-200"
                  : "bg-white/5 text-zinc-400 hover:text-zinc-200",
              )}
            >
              안 본 것부터
            </button>
          )}
        </div>
      </div>

      <SectionTitle>개념</SectionTitle>
      <div className="flex flex-col gap-2">
        {list.map((c) => {
          const on = studied.includes(c.id);
          return (
            <Link key={c.id} href={`/concept/${c.id}`}>
              <Card className="transition-transform active:scale-[0.99]">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 text-[15px]">
                    {SUBJECTS.find((s) => s.id === c.subject)?.symbol}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={cn(
                          "text-[14px] font-bold",
                          on && "text-zinc-400",
                        )}
                      >
                        {c.title}
                      </p>
                      {on && (
                        <Check
                          size={13}
                          className="shrink-0 text-emerald-400"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                      {c.summary}
                    </p>
                  </div>
                  <ImportanceBadge level={c.importance} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
