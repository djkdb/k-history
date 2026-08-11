"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import { CONCEPT_MAP, conceptsFor } from "@/data/concepts";
import { SUBJECT_MAP } from "@/data/subjects";
import { nextDueLabel } from "@/lib/srs";
import {
  Badge,
  Button,
  Card,
  Chip,
  CompareTable,
  EmptyState,
  GradeBadge,
  ImportanceBadge,
  Prose,
  ScrollRow,
  SubjectBadge,
} from "@/components/ui";
import { cn } from "@/lib/utils";

type Tab = "quick" | "detail" | "exam";

const TABS: { key: Tab; label: string; hint: string }[] = [
  { key: "quick", label: "한 줄", hint: "시험장에서 떠올릴 문장" },
  { key: "detail", label: "설명", hint: "왜 그런지까지" },
  { key: "exam", label: "시험 포인트", hint: "어떻게 나오는가" },
];

export function ConceptDetail() {
  const params = useParams<{ id: string }>();
  const grade = useGrade();
  const concept = CONCEPT_MAP[params.id];

  const studiedIds = useApp((s) => s.studiedIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const markStudied = useApp((s) => s.markStudied);

  const [tab, setTab] = useState<Tab>("quick");

  const siblings = useMemo(
    () => (concept ? conceptsFor(grade, concept.subject) : []),
    [concept, grade],
  );
  const index = siblings.findIndex((c) => c.id === concept?.id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  if (!concept) {
    return (
      <div className="pt-6">
        <EmptyState
          icon="❓"
          title="없는 개념입니다"
          action={
            <Link href="/learn">
              <Button size="sm">학습으로</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const studied = studiedIds.includes(concept.id);
  const card = reviewCards.find((c) => c.sourceId === concept.id);
  const subject = SUBJECT_MAP[concept.subject];

  return (
    <div className="pt-6">
      <Link
        href={`/learn/${concept.subject}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        {subject.name}
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <SubjectBadge subject={concept.subject} />
        <Badge>{concept.topic}</Badge>
        <GradeBadge minGrade={concept.minGrade} />
        <ImportanceBadge importance={concept.importance} />
      </div>

      <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight">
        {concept.title}
      </h1>

      <ScrollRow className="mt-5">
        {TABS.map((t) => (
          <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </ScrollRow>
      <p className="mt-2 text-[11px] text-zinc-600">
        {TABS.find((t) => t.key === tab)?.hint}
      </p>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mt-3"
      >
        {tab === "quick" && (
          <Card className="border-indigo-500/20 bg-indigo-500/[0.06]">
            <Prose size="lg">{concept.summary}</Prose>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {concept.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-zinc-300"
                >
                  {k}
                </span>
              ))}
            </div>
          </Card>
        )}

        {tab === "detail" && (
          <Card>
            <Prose>{concept.detail}</Prose>
            {concept.table && (
              <CompareTable
                title={concept.table.title}
                headers={concept.table.headers}
                rows={concept.table.rows}
              />
            )}
          </Card>
        )}

        {tab === "exam" && (
          <Card className="border-amber-500/20 bg-amber-500/[0.06]">
            <div className="flex items-center gap-2 text-amber-300">
              <Target size={15} />
              <span className="text-[13px] font-bold">시험에서는 이렇게</span>
            </div>
            <Prose className="mt-2.5">{concept.examPoint}</Prose>
          </Card>
        )}
      </motion.div>

      {/* 헷갈리는 짝 — 컴활에서 점수를 가장 많이 잃는 자리라 항상 펼쳐 둔다 */}
      {concept.traps.length > 0 && (
        <section className="mt-6">
          <div className="mb-2.5 flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-300" />
            <h2 className="text-sm font-bold">헷갈리는 것</h2>
          </div>
          <div className="flex flex-col gap-2">
            {concept.traps.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4"
              >
                <p className="text-[13px] font-bold text-rose-200">{t.concept}</p>
                <p className="mt-1.5 text-[14px] leading-[1.85] text-zinc-300">
                  {t.difference}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 학습 완료 */}
      <div className="mt-7">
        {studied ? (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-200">
                학습 완료
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {card ? `다음 복습 ${nextDueLabel(card)}` : "복습 대기"}
            </span>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={() => markStudied(concept.id)}
          >
            <CheckCircle2 size={17} />
            이해했습니다 — 복습에 넣기
          </Button>
        )}
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          넣어 두면 오늘 · 1일 · 3일 · 7일 · 14일 · 30일 간격으로 다시 물어봅니다
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link href="/quiz" className="contents">
          <Button variant="ghost" className="w-full">
            <Brain size={15} />
            퀴즈로 확인
          </Button>
        </Link>
        <Link href={`/learn/${concept.subject}`} className="contents">
          <Button variant="outline" className="w-full">
            <Lightbulb size={15} />
            목록으로
          </Button>
        </Link>
      </div>

      {/* 앞뒤 개념 */}
      <div className="mt-6 flex items-stretch gap-2">
        {prev ? (
          <Link href={`/concept/${prev.id}`} className="flex-1">
            <div className="glass h-full rounded-2xl p-3 transition-transform active:scale-[0.98]">
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <ArrowLeft size={12} />
                이전
              </span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link href={`/concept/${next.id}`} className="flex-1">
            <div className="glass h-full rounded-2xl p-3 text-right transition-transform active:scale-[0.98]">
              <span className="flex items-center justify-end gap-1 text-[11px] text-zinc-500">
                다음
                <ArrowRight size={12} />
              </span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {next.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className={cn("flex-1")} />
        )}
      </div>
    </div>
  );
}
