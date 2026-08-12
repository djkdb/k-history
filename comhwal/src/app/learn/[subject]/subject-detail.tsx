"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Brain, CheckCircle2 } from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import type { SubjectId } from "@/lib/types";
import { SUBJECT_MAP, subjectsFor } from "@/data/subjects";
import { conceptsFor, topicsOf } from "@/data/concepts";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  GradeBadge,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
} from "@/components/ui";

export function SubjectDetail() {
  const params = useParams<{ subject: string }>();
  const subject = params.subject as SubjectId;
  const grade = useGrade();
  const studiedIds = useApp((s) => s.studiedIds);
  const [topic, setTopic] = useState<string | null>(null);
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [byImportance, setByImportance] = useState(false);

  const info = SUBJECT_MAP[subject];
  const available = subjectsFor(grade).some((s) => s.id === subject);
  const all = useMemo(() => conceptsFor(grade, subject), [grade, subject]);
  const topics = useMemo(() => topicsOf(grade, subject), [grade, subject]);
  const done = all.filter((c) => studiedIds.includes(c.id)).length;

  const list = useMemo(() => {
    let out = topic ? all.filter((c) => c.topic === topic) : all;
    if (unseenOnly) out = out.filter((c) => !studiedIds.includes(c.id));
    // 중요도 순으로 보면 "거의 매회 나오는 것"부터 훑을 수 있다.
    // 기본은 데이터 순서 — 앞에서부터 차례로 쌓아 가는 사람을 위한 것이다.
    if (byImportance) {
      out = [...out].sort((a, b) => b.importance - a.importance);
    }
    return out;
  }, [all, topic, unseenOnly, byImportance, studiedIds]);

  if (!info) {
    return <EmptyState icon="❓" title="없는 과목입니다" />;
  }

  if (!available) {
    return (
      <div className="pt-6">
        <BackLink />
        <EmptyState
          icon={info.symbol}
          title={`${info.name}은 1급 과목입니다`}
          desc="설정에서 준비 급수를 1급으로 바꾸면 열립니다."
          action={
            <Link href="/settings">
              <Button size="sm">설정으로</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pt-6">
      <BackLink />

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span>{info.symbol}</span>
            {info.name}
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
            {info.description}
          </p>
        </div>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">학습한 개념</span>
          <span className="font-bold" style={{ color: info.color }}>
            {done} / {all.length}
          </span>
        </div>
        <ProgressBar
          value={done}
          max={all.length}
          color={info.color}
          className="mt-3"
        />
        <Link href={`/quiz?subject=${subject}`}>
          <Button size="sm" variant="ghost" className="mt-3 w-full">
            <Brain size={14} />이 과목만 퀴즈 풀기
          </Button>
        </Link>
      </Card>

      {/* 갈래마다 몇 개를 봤는지 함께 보여 준다 — 어디가 비었는지 한눈에 */}
      <ScrollRow className="mt-5">
        <Chip active={topic === null} onClick={() => setTopic(null)}>
          전체 {done}/{all.length}
        </Chip>
        {topics.map((t) => {
          const inTopic = all.filter((c) => c.topic === t);
          const d = inTopic.filter((c) => studiedIds.includes(c.id)).length;
          return (
            <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
              {t} {d}/{inTopic.length}
            </Chip>
          );
        })}
      </ScrollRow>

      <div className="mt-2.5 flex gap-2">
        <Chip active={unseenOnly} onClick={() => setUnseenOnly(!unseenOnly)}>
          안 본 것만
        </Chip>
        <Chip active={byImportance} onClick={() => setByImportance(!byImportance)}>
          중요한 것부터
        </Chip>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            {unseenOnly ? "이 갈래는 다 봤습니다" : "해당하는 개념이 없습니다"}
          </p>
        )}
        {list.map((c) => {
          const studied = studiedIds.includes(c.id);
          return (
            <Link key={c.id} href={`/concept/${c.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {studied && (
                        <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
                      )}
                      <p className="truncate text-sm font-bold">{c.title}</p>
                      <GradeBadge minGrade={c.minGrade} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
                      {c.summary}
                    </p>
                    <p className="mt-1.5 text-[11px] text-zinc-600">{c.topic}</p>
                  </div>
                  <ImportanceBadge importance={c.importance} compact />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/learn"
      className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
    >
      <ArrowLeft size={15} />
      과목 목록
    </Link>
  );
}
