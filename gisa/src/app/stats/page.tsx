"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, PenLine, Target, Timer } from "lucide-react";
import { Card, EmptyState, SectionTitle, StatCard } from "@/components/ui";
import { CONCEPTS } from "@/data/concepts";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * 공부 기록.
 *
 * 앱은 푼 문항과 공부한 시간을 꼬박꼬박 적어 두고 있었지만 어디에도 보여
 * 주지 않았다 — quizHistory 는 백업 파일에만, studyMinutes 와
 * lastStudyDate 는 아무 데도. 쌓이기만 하고 쓰이지 않는 기록은 없는 것과
 * 같다.
 *
 * 보여 주는 것은 셋이다.
 *   · 오늘까지 며칠 이어 왔는가 (매일 여는 이유가 된다)
 *   · 최근 한 달, 어느 날 얼마나 했는가 (빈 날이 눈에 보여야 메운다)
 *   · 정답률이 오르고 있는가 (푼 양보다 이것이 실력이다)
 */
const DAY = 864e5;
const key = (t: number) => new Date(t).toISOString().slice(0, 10);

export default function StatsPage() {
  const hydrated = useApp((s) => s.hydrated);
  const stats = useApp((s) => s.stats);
  const history = useApp((s) => s.quizHistory);
  const attempts = useApp((s) => s.mockAttempts);
  const studied = useApp((s) => s.studiedIds);

  /** 최근 30일 — 날마다 푼 문항 수 */
  const days = useMemo(() => {
    const per = new Map<string, number>();
    for (const q of history) per.set(key(q.takenAt), (per.get(key(q.takenAt)) ?? 0) + q.total);
    for (const a of attempts) {
      const n = a.bySubject.reduce((s, b) => s + b.total, 0) || 0;
      per.set(key(a.finishedAt), (per.get(key(a.finishedAt)) ?? 0) + n);
    }
    const today = Date.now();
    return Array.from({ length: 30 }, (_, i) => {
      const t = today - (29 - i) * DAY;
      return { date: key(t), n: per.get(key(t)) ?? 0 };
    });
  }, [history, attempts]);

  const solved = useMemo(
    () => history.reduce((s, q) => s + q.total, 0),
    [history],
  );
  const right = useMemo(
    () => history.reduce((s, q) => s + q.correct, 0),
    [history],
  );
  const rate = solved ? Math.round((right / solved) * 100) : 0;

  /** 앞 절반과 뒤 절반의 정답률 — 늘고 있는가 */
  const trend = useMemo(() => {
    if (history.length < 4) return null;
    const half = Math.floor(history.length / 2);
    const cut = (arr: typeof history) => {
      const t = arr.reduce((s, q) => s + q.total, 0);
      const c = arr.reduce((s, q) => s + q.correct, 0);
      return t ? Math.round((c / t) * 100) : 0;
    };
    return { before: cut(history.slice(0, half)), after: cut(history.slice(half)) };
  }, [history]);

  const byTrack = useMemo(() => {
    const w = history.filter((q) => q.track === "written");
    const p = history.filter((q) => q.track === "practical");
    return { w: w.reduce((s, q) => s + q.total, 0), p: p.reduce((s, q) => s + q.total, 0) };
  }, [history]);

  const most = Math.max(1, ...days.map((d) => d.n));

  if (!hydrated) return <main className="py-20" />;

  return (
    <main className="py-6">
      <Link
        href="/"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        홈으로
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight">공부 기록</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
        얼마나 했는지보다 <b className="text-zinc-200">정답률이 오르고 있는지</b>가
        실력입니다. 둘을 함께 둡니다.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <StatCard
          label="연속 학습"
          value={`${stats.streak}일`}
          icon={<Flame size={15} />}
        />
        <StatCard
          label="푼 문항"
          value={`${solved}개`}
          icon={<Target size={15} />}
        />
        <StatCard
          label="정답률"
          value={solved ? `${rate}%` : "—"}
          icon={<PenLine size={15} />}
        />
        <StatCard
          label="공부한 시간"
          value={
            stats.studyMinutes >= 60
              ? `${Math.floor(stats.studyMinutes / 60)}시간 ${stats.studyMinutes % 60}분`
              : `${stats.studyMinutes}분`
          }
          icon={<Timer size={15} />}
        />
      </div>

      {solved === 0 ? (
        <EmptyState
          icon="📈"
          title="아직 기록이 없습니다"
          desc="문제를 한 벌 풀면 이곳에 쌓입니다."
        />
      ) : (
        <>
          <SectionTitle>최근 30일</SectionTitle>
          <Card>
            <div className="flex items-end gap-[3px]">
              {days.map((d) => (
                <div
                  key={d.date}
                  className="group relative flex-1"
                  title={`${d.date.slice(5)} · ${d.n}문항`}
                >
                  <div
                    className={cn(
                      "w-full rounded-[2px]",
                      d.n === 0 ? "bg-white/[0.07]" : "bg-indigo-400/80",
                    )}
                    style={{ height: `${d.n === 0 ? 3 : 3 + (d.n / most) * 44}px` }}
                  />
                </div>
              ))}
            </div>
            {/* 잔글씨는 획을 굵혀야 지정한 색만큼 칠해진다 */}
            <div className="mt-2 flex justify-between text-[10.5px] font-semibold text-zinc-500">
              <span>{days[0].date.slice(5).replace("-", "/")}</span>
              <span>
                빈 날 {days.filter((d) => d.n === 0).length}일 · 가장 많이 푼 날{" "}
                {most}문항
              </span>
              <span>오늘</span>
            </div>
          </Card>

          <SectionTitle>정답률이 오르고 있는가</SectionTitle>
          <Card>
            {trend ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] text-zinc-400">처음 절반</span>
                  <span className="text-[15px] font-bold tabular-nums">
                    {trend.before}%
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-[13px] text-zinc-400">나중 절반</span>
                  <span
                    className={cn(
                      "text-[17px] font-bold tabular-nums",
                      trend.after >= trend.before
                        ? "text-emerald-300"
                        : "text-rose-300",
                    )}
                  >
                    {trend.after}%
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
                  {trend.after > trend.before
                    ? `${trend.after - trend.before}%p 올랐습니다. 지금 방식이 듣고 있습니다.`
                    : trend.after === trend.before
                      ? "그대로입니다. 틀린 곳만 골라 다시 풀어 보세요."
                      : `${trend.before - trend.after}%p 떨어졌습니다. 새 범위에 들어갔다면 자연스러운 일이지만, 아니라면 틀린 곳부터 붙드세요.`}
                </p>
              </>
            ) : (
              <p className="text-[12.5px] leading-relaxed text-zinc-400">
                견주려면 문제를 네 벌은 풀어야 합니다. 지금까지 {history.length}
                벌 풀었습니다.
              </p>
            )}
          </Card>

          <SectionTitle>어디에 얼마나</SectionTitle>
          <Card>
            <dl className="flex flex-col gap-1.5 text-[13px]">
              <Row label="필기로 푼 문항" value={`${byTrack.w}개`} />
              <Row label="실기로 적은 문항" value={`${byTrack.p}개`} />
              <Row
                label="본 개념"
                value={`${studied.length} / ${CONCEPTS.length}개`}
              />
              <Row label="모의고사 응시" value={`${attempts.length}회`} />
              <Row label="쌓은 경험치" value={`${stats.xp} XP`} />
            </dl>
          </Card>
        </>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-semibold tabular-nums text-zinc-200">{value}</dd>
    </div>
  );
}
