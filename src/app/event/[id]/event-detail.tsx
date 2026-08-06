"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookHeart,
  Brain,
  CheckCircle2,
  Drama,
  Landmark,
  Laugh,
  Lightbulb,
  Palette,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { getEvent } from "@/data/events";
import { ERA_MAP } from "@/data/eras";
import { InfographicView, infographicsFor } from "@/components/infographic";
import { nextDueLabel } from "@/lib/srs";
import { cn, frequencyLabel } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  EraBadge,
  ImportanceBadge,
} from "@/components/ui";

type SummaryTab = "10s" | "30s" | "1m" | "exam";

const TABS: { key: SummaryTab; label: string }[] = [
  { key: "10s", label: "10초" },
  { key: "30s", label: "30초" },
  { key: "1m", label: "1분" },
  { key: "exam", label: "시험 직전" },
];

function MemorySection({
  icon,
  title,
  children,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div>
      <div className="mb-2 mt-6 flex items-center gap-2">
        <span style={{ color: accent ?? "#a5b4fc" }}>{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <Card>
        <p className="text-sm leading-relaxed text-zinc-300">{children}</p>
      </Card>
    </div>
  );
}

export function EventDetail() {
  const params = useParams<{ id: string }>();
  const event = getEvent(params.id);

  const hydrated = useApp((s) => s.hydrated);
  const studiedEventIds = useApp((s) => s.studiedEventIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const markStudied = useApp((s) => s.markStudied);
  const addStudyMinutes = useApp((s) => s.addStudyMinutes);

  const [tab, setTab] = useState<SummaryTab>("10s");
  const [justDone, setJustDone] = useState(false);

  const isStudied = useMemo(
    () => !!event && studiedEventIds.includes(event.id),
    [studiedEventIds, event],
  );
  const card = useMemo(
    () => reviewCards.find((c) => c.eventId === event?.id),
    [reviewCards, event],
  );

  if (!event) {
    return (
      <EmptyState
        icon="🔍"
        title="개념을 찾을 수 없어요"
        action={
          <Link href="/learn">
            <Button variant="outline">학습 목록으로</Button>
          </Link>
        }
      />
    );
  }

  const era = ERA_MAP[event.era];
  const prev = event.prevEventId ? getEvent(event.prevEventId) : undefined;
  const next = event.nextEventId ? getEvent(event.nextEventId) : undefined;
  const graphics = infographicsFor(event);

  const complete = () => {
    markStudied(event.id);
    addStudyMinutes(3);
    setJustDone(true);
  };

  return (
    <div className="pt-6">
      {/* 히어로 */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-2">
          <EraBadge eraId={event.era} />
          {event.mustMemorize && (
            <Badge className="border-red-500/40 bg-red-500/15 text-red-300">
              반드시 암기
            </Badge>
          )}
        </div>
        <p
          className="mt-3 text-sm font-bold tracking-wide"
          style={{ color: era.color }}
        >
          {event.yearDisplay}
        </p>
        <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight">
          {event.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {event.king && <Badge>👑 {event.king}</Badge>}
          <ImportanceBadge importance={event.importance} />
          <Badge title="한국사능력검정시험 심화 최근 20회 기준">
            최근 20회 중 {event.examFrequency}회 · {frequencyLabel(event.examFrequency)}
          </Badge>
        </div>
      </motion.div>

      {/* 레전드 요약 */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mt-3"
        >
          {tab === "10s" && (
            <Card className="border-indigo-400/30 bg-indigo-500/10">
              <p className="text-lg font-bold leading-relaxed">
                {event.summary10s}
              </p>
            </Card>
          )}
          {tab === "30s" && (
            <Card>
              <p className="text-sm leading-relaxed text-zinc-200">
                {event.summary30s}
              </p>
            </Card>
          )}
          {tab === "1m" && (
            <Card>
              <p className="text-sm leading-relaxed text-zinc-200">
                {event.summary1m}
              </p>
            </Card>
          )}
          {tab === "exam" && (
            <Card className="border-red-500/30 bg-red-500/5">
              <p className="text-sm font-medium leading-relaxed text-zinc-200">
                {event.examPoint}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {event.keywords.map((k) => (
                  <Badge
                    key={k}
                    className="border-red-500/30 bg-red-500/10 text-red-200"
                  >
                    {k}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 시험장에서 떠올리는 순서 */}
      <div className="mt-3 flex items-center gap-1 overflow-x-auto no-scrollbar rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
        <span className="shrink-0 text-[10px] font-semibold text-zinc-500">
          시험장 인출 순서
        </span>
        {["연도", "왕", "사건", "키워드", "함정"].map((s, i) => (
          <span key={s} className="flex shrink-0 items-center gap-1">
            {i > 0 && <span className="text-zinc-700">→</span>}
            <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
              {s}
            </span>
          </span>
        ))}
      </div>

      {/* 한눈에 보는 그림 — 글만 읽고 외우지 않도록 */}
      {graphics.length > 0 && (
        <>
          <div className="mb-2 mt-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-cyan-300" />
            <h3 className="text-sm font-bold">한눈에 보기</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {graphics.map((spec, i) => (
              <InfographicView
                key={`${spec.kind}-${i}`}
                spec={spec}
                color={era.color}
              />
            ))}
          </div>
        </>
      )}

      {/* 기억 강화 */}
      <MemorySection icon={<Drama size={16} />} title="스토리텔링" accent="#a5b4fc">
        {event.memory.story}
      </MemorySection>
      <MemorySection icon={<Lightbulb size={16} />} title="현대 비유" accent="#fbbf24">
        {event.memory.analogy}
      </MemorySection>

      <div className="mb-2 mt-6 flex items-center gap-2">
        <Brain size={16} className="text-emerald-300" />
        <h3 className="text-sm font-bold">암기법</h3>
      </div>
      <Card className="border-emerald-400/30 bg-emerald-500/10">
        <p className="text-sm font-semibold leading-relaxed text-emerald-100">
          {event.memory.mnemonic}
        </p>
      </Card>

      {event.memory.wordplay && (
        <MemorySection icon={<Laugh size={16} />} title="말장난 암기" accent="#f472b6">
          {event.memory.wordplay}
        </MemorySection>
      )}
      {event.memory.emotion && (
        <MemorySection icon={<BookHeart size={16} />} title="감정 연결" accent="#fb7185">
          {event.memory.emotion}
        </MemorySection>
      )}
      {event.memory.visual && (
        <MemorySection icon={<Palette size={16} />} title="장면 상상" accent="#22d3ee">
          {event.memory.visual}
        </MemorySection>
      )}

      {/* 실수 방지 */}
      {event.traps.length > 0 && (
        <>
          <div className="mb-2 mt-6 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h3 className="text-sm font-bold">실수 방지 — 헷갈리면 여기서 틀린다</h3>
          </div>
          <div className="flex flex-col gap-2">
            {event.traps.map((t) => (
              <Card key={t.concept} className="border-red-500/20">
                <p className="text-sm font-bold text-red-300">{t.concept}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {t.difference}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 관련 정보 */}
      {(event.relatedFigures.length > 0 || event.relatedHeritage.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-2">
          {event.relatedFigures.length > 0 && (
            <Card>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Users size={13} /> 관련 인물
              </div>
              <div className="flex flex-wrap gap-1.5">
                {event.relatedFigures.map((f) => (
                  <Badge key={f}>{f}</Badge>
                ))}
              </div>
            </Card>
          )}
          {event.relatedHeritage.length > 0 && (
            <Card>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Landmark size={13} /> 관련 문화재·유물
              </div>
              <div className="flex flex-wrap gap-1.5">
                {event.relatedHeritage.map((h) => (
                  <Badge key={h}>{h}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 의미 */}
      <blockquote
        className="mt-6 border-l-2 pl-4 text-sm italic leading-relaxed text-zinc-400"
        style={{ borderColor: era.color }}
      >
        {event.significance}
      </blockquote>

      {/* CTA */}
      <div className="mt-8">
        {hydrated && (isStudied || justDone) ? (
          <motion.div
            initial={justDone ? { scale: 0.9, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="flex items-center justify-between border-emerald-400/30 bg-emerald-500/10">
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <CheckCircle2 size={18} />
                {justDone ? "학습 완료! +20 XP" : "복습 카드에 등록됨"}
              </span>
              {card && (
                <span className="text-xs text-zinc-400">
                  다음 복습 {nextDueLabel(card)}
                </span>
              )}
            </Card>
          </motion.div>
        ) : (
          <Button
            size="lg"
            className="w-full"
            disabled={!hydrated}
            onClick={complete}
          >
            <CheckCircle2 size={18} /> 학습 완료 — 복습 일정에 등록
          </Button>
        )}
        <Link href={`/quiz?event=${event.id}`}>
          <Button variant="outline" className="mt-2 w-full">
            <Brain size={16} /> 이 개념 퀴즈 풀기
          </Button>
        </Link>
      </div>

      {/* 이전/다음 */}
      <div className="mt-6 grid grid-cols-2 gap-2 pb-4">
        {prev ? (
          <Link href={`/event/${prev.id}`}>
            <Card className="h-full">
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <ArrowLeft size={11} /> 이전 사건
              </span>
              <p className="mt-1 line-clamp-1 text-sm font-semibold">
                {prev.title}
              </p>
              <p className="text-[10px] text-zinc-500">{prev.yearDisplay}</p>
            </Card>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/event/${next.id}`} className={cn(!prev && "col-start-2")}>
            <Card className="h-full text-right">
              <span className="flex items-center justify-end gap-1 text-[10px] text-zinc-500">
                다음 사건 <ArrowRight size={11} />
              </span>
              <p className="mt-1 line-clamp-1 text-sm font-semibold">
                {next.title}
              </p>
              <p className="text-[10px] text-zinc-500">{next.yearDisplay}</p>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
