"use client";

import { useMemo } from "react";
import { SUBJECTS, subjectInk, type SubjectId } from "@/data/exam";
import type { MockAttempt } from "@/lib/types";

/**
 * 점수가 오르고 있는가.
 *
 * 응시 기록은 쉰 회까지 쌓이는데 목록으로만 보여 주고 있었다. 숫자를 눈으로
 * 견주어서는 "오르는 중인지" 를 알 수 없다 — 시험 준비에서 가장 자주 하는
 * 질문인데도.
 *
 * 평균선 하나만 그리면 "무엇을 더 해야 하나" 가 안 나온다. 정보처리기사는
 * 한 과목이라도 40점에 못 미치면 평균이 아무리 높아도 떨어지므로, 과목별
 * 선을 함께 겹쳐 그리고 40점 자리에 금을 그어 둔다. 그래야 "평균은 오르는데
 * 데이터베이스만 제자리" 가 눈에 들어온다.
 *
 * 라이브러리를 쓰지 않고 SVG 를 직접 그린다. 선 몇 개를 위해 차트 묶음을
 * 들이면 첫 화면이 그만큼 무거워진다.
 */
export function ScoreTrend({ attempts }: { attempts: MockAttempt[] }) {
  const runs = useMemo(
    () => attempts.filter((a) => a.track === "written").slice(-12),
    [attempts],
  );

  if (runs.length < 2) return null;

  const W = 320;
  const H = 132;
  const PAD = { l: 26, r: 8, t: 10, b: 18 };
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (i: number) =>
    PAD.l + (runs.length === 1 ? iw / 2 : (iw * i) / (runs.length - 1));
  const y = (v: number) => PAD.t + ih - (ih * Math.max(0, Math.min(100, v))) / 100;

  const line = (pts: number[]) =>
    pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const avg = runs.map((a) => a.score);
  const perSubject = SUBJECTS.map((s) => ({
    id: s.id as SubjectId,
    short: s.short,
    pts: runs.map((a) => {
      const b = a.bySubject.find((x) => x.subject === s.id);
      return b && b.total ? Math.round((b.correct / b.total) * 100) : 0;
    }),
  }));

  const last = avg[avg.length - 1];
  const first = avg[0];
  const diff = last - first;
  // 마지막 회차에서 40점에 못 미친 과목
  const weak = perSubject.filter((s) => s.pts[s.pts.length - 1] < 40);

  return (
    <div className="glass rounded-2xl p-3.5">
      <div className="flex items-baseline gap-2">
        <p className="text-[13px] font-bold">점수 추이</p>
        <p className="text-[11.5px] text-zinc-500">
          최근 {runs.length}회 · 평균 {last}점
        </p>
        <span
          className={
            diff > 0
              ? "ml-auto shrink-0 text-[11.5px] font-bold text-emerald-300"
              : diff < 0
                ? "ml-auto shrink-0 text-[11.5px] font-bold text-rose-300"
                : "ml-auto shrink-0 text-[11.5px] font-bold text-zinc-500"
          }
        >
          {diff > 0 ? `▲ ${diff}점` : diff < 0 ? `▼ ${-diff}점` : "그대로"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full"
        role="img"
        aria-label={`최근 ${runs.length}회 모의고사 평균 점수 추이. 처음 ${first}점에서 지금 ${last}점.`}
      >
        {/* 60점(합격선)과 40점(과락선) */}
        {[
          { v: 60, label: "60", color: "rgba(16,185,129,0.45)" },
          { v: 40, label: "40", color: "rgba(244,63,94,0.45)" },
        ].map((g) => (
          <g key={g.v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(g.v)}
              y2={y(g.v)}
              stroke={g.color}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={PAD.l - 5}
              y={y(g.v) + 3.5}
              textAnchor="end"
              className="fill-zinc-500"
              style={{ fontSize: 9 }}
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* 과목별 — 흐리게 깔고 */}
        {perSubject.map((s) => (
          <path
            key={s.id}
            d={line(s.pts)}
            fill="none"
            stroke={subjectInk(s.id)}
            strokeWidth="1.2"
            strokeOpacity="0.45"
            strokeLinejoin="round"
          />
        ))}

        {/* 평균 — 굵게 얹는다 */}
        <path
          d={line(avg)}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {avg.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill="#818cf8" />
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="flex items-center gap-1 text-[10.5px] text-zinc-400">
          <i className="h-0.5 w-3 rounded-full bg-indigo-400" />
          평균
        </span>
        {perSubject.map((s) => (
          <span
            key={s.id}
            className="flex items-center gap-1 text-[10.5px] text-zinc-500"
          >
            <i
              className="h-0.5 w-3 rounded-full"
              style={{ background: subjectInk(s.id) }}
            />
            {s.short}
          </span>
        ))}
      </div>

      {weak.length > 0 && (
        <p className="mt-2 border-t border-white/5 pt-2 text-[12px] leading-relaxed text-rose-200">
          지난 회차에서 {weak.map((s) => s.short).join("·")}가 40점에 못
          미쳤습니다. 평균이 아무리 높아도 한 과목이 과락이면 떨어집니다.
        </p>
      )}
    </div>
  );
}
