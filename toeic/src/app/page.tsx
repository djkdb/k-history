"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookA,
  Brain,
  Flame,
  Headphones,
  RotateCcw,
  ScrollText,
  Settings as Cog,
  Timer,
} from "lucide-react";
import { Button, Card, ProgressBar, SectionTitle, StatCard } from "@/components/ui";
import { useApp, useBand } from "@/lib/store";
import { dueCards, retentionRate } from "@/lib/srs";
import { vocabFor } from "@/data/vocab";
import { grammarFor } from "@/data/grammar";
import { readingFor, countReadingQuestions } from "@/data/reading";
import { listeningFor, countListeningQuestions } from "@/data/listening";
import { BAND_LABEL } from "@/data/parts";
import { daysUntil } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";
import { InstallHint } from "@/components/install-hint";

export default function Home() {
  const router = useRouter();
  const hydrated = useApp((s) => s.hydrated);
  const settings = useApp((s) => s.settings);
  const stats = useApp((s) => s.stats);
  const knownVocabIds = useApp((s) => s.knownVocabIds);
  const studiedGrammarIds = useApp((s) => s.studiedGrammarIds);
  const clearedQuestionIds = useApp((s) => s.clearedQuestionIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const wrongIds = useApp((s) => s.wrongIds);
  const band = useBand();

  // 설정이 없으면 첫 방문이다 — 안내부터 보여 준다
  useEffect(() => {
    if (hydrated && !settings) router.replace("/onboarding");
  }, [hydrated, settings, router]);

  const vocab = useMemo(() => vocabFor(band), [band]);
  const grammar = useMemo(() => grammarFor(band), [band]);
  const rcCount = useMemo(() => countReadingQuestions(readingFor(band)), [band]);
  const lcCount = useMemo(() => countListeningQuestions(listeningFor(band)), [band]);

  const due = useMemo(() => dueCards(reviewCards).length, [reviewCards]);
  const retention = useMemo(() => retentionRate(reviewCards), [reviewCards]);

  const knownHere = knownVocabIds.filter((id) => vocab.some((v) => v.id === id)).length;
  const grammarHere = studiedGrammarIds.filter((id) =>
    grammar.some((g) => g.id === id),
  ).length;
  const totalQuestions = rcCount + lcCount;
  const clearedHere = clearedQuestionIds.length;

  const left = settings?.examDate ? daysUntil(settings.examDate) : null;

  if (!hydrated) {
    return (
      <main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>
    );
  }
  if (!settings) return null;

  return (
    <main className="py-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-bold text-indigo-300">
            {BAND_LABEL[band]}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold">
            {left === null
              ? "오늘도 한 걸음"
              : left > 0
                ? `시험까지 ${left}일`
                : left === 0
                  ? "시험 당일입니다"
                  : "오늘도 한 걸음"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/settings"
            aria-label="설정"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-zinc-300 hover:bg-white/10"
          >
            <Cog size={18} />
          </Link>
        </div>
      </header>

      {/*
        인스타·카카오톡 같은 앱 안에서 열렸다는 경고는 맨 위여야 한다.
        여기서 외운 것은 밖으로 넘어가지 않으므로, 시작하기 전에 봐야 한다.
      */}
      <InstallHint slot="top" />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatCard
          label="연속 학습"
          value={`${stats.streak}일`}
          sub={stats.lastStudyDate ? `마지막 ${stats.lastStudyDate}` : "오늘 시작해 보세요"}
          icon={<Flame size={18} className="text-orange-400" />}
        />
        <StatCard
          label="기억 보존율"
          value={`${Math.round(retention * 100)}%`}
          sub={`복습 카드 ${reviewCards.length}장`}
          icon={<Brain size={18} className="text-indigo-400" />}
        />
      </div>

      {due > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <Link href="/review">
            <Card className="border-emerald-500/25 bg-emerald-500/[0.07]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-emerald-200">
                    오늘 복습할 것 {due}개
                  </p>
                  <p className="mt-0.5 text-[12px] text-zinc-400">
                    지금 보면 오래 남습니다
                  </p>
                </div>
                <ArrowRight size={18} className="text-emerald-300" />
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      {wrongIds.length > 0 && (
        <div className="mt-3">
          <Link href="/review?only=wrong">
            <Card className="border-rose-500/25 bg-rose-500/[0.07]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-rose-200">
                    틀렸던 것 {wrongIds.length}개
                  </p>
                  <p className="mt-0.5 text-[12px] text-zinc-400">
                    맞히면 목록에서 빠집니다
                  </p>
                </div>
                <ArrowRight size={18} className="text-rose-300" />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/*
        오늘 할 일(복습·오답) 아래에 둔다. 공부하러 들어온 사람의 첫 화면을
        설치 안내가 밀어내면 안 되지만, 한참 내려야 보이면 아무도 못 본다.
      */}
      <InstallHint />

      <SectionTitle>바로 시작</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <QuickCard
          href="/vocab"
          icon={<BookA size={20} className="text-indigo-400" />}
          title="어휘"
          sub={`${knownHere} / ${vocab.length}개`}
          value={knownHere}
          max={vocab.length}
          color="#6366f1"
        />
        <QuickCard
          href="/grammar"
          icon={<ScrollText size={20} className="text-emerald-400" />}
          title="문법"
          sub={`${grammarHere} / ${grammar.length}개`}
          value={grammarHere}
          max={grammar.length}
          color="#10b981"
        />
        <QuickCard
          href="/listen"
          icon={<Headphones size={20} className="text-sky-400" />}
          title="듣기 훈련"
          sub={`Part 1~4 · ${lcCount}문항`}
          value={0}
          max={0}
          color="#0ea5e9"
        />
        <QuickCard
          href="/part/5"
          icon={<ScrollText size={20} className="text-amber-400" />}
          title="읽기 훈련"
          sub={`Part 5~7 · ${rcCount}문항`}
          value={0}
          max={0}
          color="#f59e0b"
        />
      </div>

      <SectionTitle>실전</SectionTitle>
      <Card>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
            <Timer size={19} className="text-zinc-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold">모의고사</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-400">
              듣기·읽기를 나눠서, 또는 한 번에. 제한 시간이 지나면 자동으로 제출되고
              990점 기준으로 환산해 보여 줍니다.
            </p>
          </div>
        </div>
        <Link href="/mock">
          <Button size="lg" className="mt-4 w-full">
            응시하기
            <ArrowRight size={17} />
          </Button>
        </Link>
      </Card>

      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold">푼 문항</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              맞힌 적 있는 문항으로 셉니다
            </p>
          </div>
          <span className="text-sm font-bold text-zinc-300">
            {clearedHere} / {totalQuestions}
          </span>
        </div>
        <ProgressBar
          value={clearedHere}
          max={totalQuestions}
          color="#a78bfa"
          className="mt-3"
        />
      </Card>

      {left !== null && left >= 0 && left <= 7 && (
        <Link href="/cram">
          <Card className="mt-3 border-amber-500/25 bg-amber-500/[0.07]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-amber-200">시험 직전 모드</p>
                <p className="mt-0.5 text-[12px] text-zinc-400">
                  이제 새 걸 넣기보다 아는 걸 확실히 할 때입니다
                </p>
              </div>
              <ArrowRight size={18} className="text-amber-300" />
            </div>
          </Card>
        </Link>
      )}

      <Link href="/review">
        <Card className="mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RotateCcw size={17} className="text-zinc-400" />
              <span className="text-[14px] font-bold">전체 복습</span>
            </div>
            <ArrowRight size={16} className="text-zinc-500" />
          </div>
        </Card>
      </Link>
    </main>
  );
}

function QuickCard({
  href,
  icon,
  title,
  sub,
  value,
  max,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full">
        {icon}
        <p className="mt-2.5 text-[15px] font-bold">{title}</p>
        <p className="mt-0.5 text-[12px] text-zinc-500">{sub}</p>
        {max > 0 && (
          <ProgressBar value={value} max={max} color={color} className="mt-3" />
        )}
      </Card>
    </Link>
  );
}
