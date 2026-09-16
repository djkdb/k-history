"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Check, PenLine } from "lucide-react";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
  SectionTitle,
} from "@/components/ui";
import { CONCEPTS, CONCEPT_MAP } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { SUBJECT_MAP, subjectInk, type SubjectId } from "@/data/exam";
import { SYLLABUS } from "@/data/syllabus";
import { useApp, useTrack } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * 한 과목 안을 들여다보는 화면.
 *
 * 학습 화면은 개념 63개를 한 줄로 늘어놓는다. 그것만으로는 "이 과목에서
 * 무엇이 남았는가" 를 알 수 없다. 여기서는 출제기준의 주요항목대로 묶어,
 * 어느 항목을 아직 손대지 않았는지가 눈에 들어오게 한다.
 *
 * 묶는 기준을 우리 마음대로 정하지 않고 출제기준을 쓰는 이유는, 시험이
 * 그 단위로 나오기 때문이다. "설계 15개 중 9개" 보다 "요구사항 확인은
 * 다 봤고 인터페이스 설계가 비었다" 가 다음에 무엇을 펼지 알려 준다.
 */
export function SubjectDetail({ subject }: { subject: string }) {
  const track = useTrack();
  const studied = useApp((s) => s.studiedIds);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);

  const info = SUBJECT_MAP[subject as SubjectId];
  const topics = useMemo(
    () => (info ? (SYLLABUS[subject as SubjectId] ?? []) : []),
    [info, subject],
  );

  const all = useMemo(
    () =>
      info
        ? CONCEPTS.filter(
            (c) => c.subject === subject && c.tracks.includes(track),
          )
        : [],
    [info, subject, track],
  );

  const counts = useMemo(() => {
    const q = QUESTIONS.filter((x) => x.subject === subject).length;
    const p = PRACTICAL_QUESTIONS.filter((x) => x.subject === subject).length;
    return { q, p };
  }, [subject]);

  const shown = useMemo(() => {
    let out = all;
    if (topic) {
      const ids = new Set(
        topics.find((t) => t.name === topic)?.items.flatMap((i) => i.covers) ??
          [],
      );
      out = out.filter((c) => ids.has(c.id));
    }
    if (unseenOnly) out = out.filter((c) => !studied.includes(c.id));
    return out;
  }, [all, topic, topics, unseenOnly, studied]);

  if (!info) {
    return (
      <main className="py-6">
        <Back />
        <EmptyState icon="❓" title="없는 과목입니다" heading />
      </main>
    );
  }

  const done = all.filter((c) => studied.includes(c.id)).length;

  return (
    <main className="py-6">
      <Back />

      <h1 className="mt-3 flex items-center gap-2 text-xl font-bold tracking-tight">
        <span>{info.symbol}</span>
        {info.name}
      </h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        {info.blurb}
      </p>

      <Card className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">본 개념</span>
          <span className="font-bold" style={{ color: subjectInk(info.id) }}>
            {done} / {all.length}
          </span>
        </div>
        <ProgressBar
          className="mt-3"
          value={done}
          max={all.length}
          color={subjectInk(info.id)}
        />
        <p className="mt-2 text-[11.5px] text-zinc-500">
          이 과목의 문항은 필기 {counts.q}개 · 실기 {counts.p}개입니다.
        </p>
        <div className="mt-3 flex gap-2">
          <Link href={`/quiz?subject=${subject}`} className="flex-1">
            <Button size="sm" variant="ghost" className="w-full">
              <Brain size={14} />
              이 과목만 풀기
            </Button>
          </Link>
          <Link href="/practical" className="flex-1">
            <Button size="sm" variant="ghost" className="w-full">
              <PenLine size={14} />
              실기로 적어 보기
            </Button>
          </Link>
        </div>
      </Card>

      {/* 출제기준의 주요항목 — 어디가 비었는지 한눈에 */}
      {topics.length > 0 && (
        <ScrollRow className="mt-5">
          <Chip active={topic === null} onClick={() => setTopic(null)}>
            전체 {done}/{all.length}
          </Chip>
          {topics.map((t) => {
            const ids = new Set(t.items.flatMap((i) => i.covers));
            const inTopic = all.filter((c) => ids.has(c.id));
            const d = inTopic.filter((c) => studied.includes(c.id)).length;
            if (!inTopic.length) return null;
            return (
              <Chip
                key={t.name}
                active={topic === t.name}
                onClick={() => setTopic(topic === t.name ? null : t.name)}
              >
                {t.name} {d}/{inTopic.length}
              </Chip>
            );
          })}
        </ScrollRow>
      )}

      <button
        type="button"
        onClick={() => setUnseenOnly(!unseenOnly)}
        className={cn(
          "-mx-1 mt-3 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-[12.5px] font-semibold transition-colors",
          unseenOnly ? "text-indigo-300" : "text-zinc-500 hover:text-zinc-300",
        )}
      >
        <Check size={13} />
        아직 안 본 것만 보기
      </button>

      <SectionTitle>
        개념 {shown.length}개
        {topic ? ` · ${topic}` : ""}
      </SectionTitle>
      {shown.length === 0 ? (
        <Card>
          <p className="text-[13px] text-zinc-400">
            {unseenOnly
              ? "이 갈래는 다 봤습니다."
              : "이 갈래에 담긴 개념이 아직 없습니다."}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((c) => {
            const on = studied.includes(c.id);
            return (
              <Link key={c.id} href={`/concept/${c.id}`}>
                {/*
                  본 개념을 흐리게 덮지 않는다.

                  ⚠️ 카드째 opacity-70 을 걸면 안에 든 글씨가 전부 같이 옅어져,
                     밝은 화면에서 "반드시" 배지가 6.88:1 에서 3.97:1 로 떨어졌다.
                     본 것과 안 본 것은 오른쪽 체크 표시가 이미 말해 준다 —
                     읽히지 않게 만들면서까지 두 번 말할 일이 아니다.
                */}
                <Card>
                  <div className="flex items-center gap-2">
                    <ImportanceBadge level={c.importance} />
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold">
                      {c.title}
                    </span>
                    {on && (
                      <Check size={14} className="shrink-0 text-emerald-400" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-400">
                    {c.summary}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* 출제기준에서 아직 개념이 없는 항목을 숨기지 않는다 */}
      {topics.length > 0 && <Uncovered subject={subject as SubjectId} />}
    </main>
  );
}

/**
 * 출제기준에는 있는데 아직 개념이 없는 항목.
 *
 * 없는 것을 없다고 말하지 않으면, 이 앱만 보고 준비한 사람은 그 범위가
 * 시험에 나온다는 것조차 모른 채 시험장에 간다.
 */
function Uncovered({ subject }: { subject: SubjectId }) {
  const missing = (SYLLABUS[subject] ?? []).flatMap((t) =>
    t.items
      .filter((i) => i.covers.every((id) => !CONCEPT_MAP[id]))
      .map((i) => `${t.name} · ${i.name}`),
  );
  if (!missing.length) return null;
  return (
    <>
      <SectionTitle>아직 다루지 않은 범위</SectionTitle>
      <Card className="border-amber-500/25 bg-amber-500/[0.06]">
        <p className="text-[12.5px] leading-relaxed text-amber-100">
          출제기준에는 있지만 이 앱에 아직 개념이 없는 항목입니다. 다른 자료로
          채워 두세요.
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {missing.map((m) => (
            <li key={m} className="text-[12.5px] text-zinc-300">
              · {m}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function Back() {
  return (
    <Link
      href="/learn"
      className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
    >
      <ArrowLeft size={15} />
      학습
    </Link>
  );
}
