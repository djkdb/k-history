"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/store";
import type { ExamKind, Grade } from "@/lib/types";
import { subjectsFor } from "@/data/subjects";
import { conceptsFor } from "@/data/concepts";
import { ThemePicker } from "@/components/theme";
import { Button, Card, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const hydrated = useApp((s) => s.hydrated);
  const settings = useApp((s) => s.settings);
  const setSettings = useApp((s) => s.setSettings);
  const resetAll = useApp((s) => s.resetAll);
  const stats = useApp((s) => s.stats);
  const studiedIds = useApp((s) => s.studiedIds);
  const reviewCards = useApp((s) => s.reviewCards);

  const [confirmReset, setConfirmReset] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(settings?.examDate ?? "");
  }, [settings?.examDate]);

  if (!hydrated || !settings) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        불러오는 중…
      </div>
    );
  }

  const update = (patch: Partial<typeof settings>) =>
    setSettings({ ...settings, ...patch });

  return (
    <div className="pt-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        홈으로
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight">설정</h1>

      <SectionTitle>준비 급수</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {([2, 1] as Grade[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => update({ grade: g })}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
              settings.grade === g
                ? "border-indigo-400/60 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.03]",
            )}
          >
            <p className="text-lg font-bold">{g}급</p>
            <p className="mt-1 text-[11px] text-zinc-400">
              {subjectsFor(g).length}과목 · 개념 {conceptsFor(g).length}개
            </p>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        급수를 바꿔도 지금까지의 기록은 그대로입니다. 보이는 범위만 달라집니다.
      </p>

      <SectionTitle>준비 중인 시험</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            { key: "written" as ExamKind, label: "필기" },
            { key: "practical" as ExamKind, label: "실기" },
          ]
        ).map((it) => (
          <button
            key={it.key}
            type="button"
            onClick={() => update({ kind: it.key })}
            className={cn(
              "rounded-2xl border py-3.5 text-sm font-bold transition-all active:scale-[0.98]",
              settings.kind === it.key
                ? "border-indigo-400/60 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.03] text-zinc-400",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>

      <SectionTitle>시험일</SectionTitle>
      <Card>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            update({ examDate: e.target.value || null });
          }}
          className="w-full bg-transparent text-base outline-none"
        />
        {date && (
          <button
            type="button"
            onClick={() => {
              setDate("");
              update({ examDate: null });
            }}
            className="mt-2 text-[12px] text-zinc-500 hover:text-zinc-300"
          >
            시험일 지우기
          </button>
        )}
      </Card>

      <SectionTitle>화면</SectionTitle>
      <ThemePicker />

      <SectionTitle>내 기록</SectionTitle>
      <Card>
        <div className="flex flex-col gap-2 text-[13px]">
          <Row label="학습한 개념" value={`${studiedIds.length}개`} />
          <Row label="복습 카드" value={`${reviewCards.length}장`} />
          <Row label="연속 학습" value={`${stats.streak}일`} />
          <Row label="누적 XP" value={`${stats.xp}`} />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
          기록은 이 기기 안에만 있습니다. 서버로 보내지 않기 때문에 브라우저
          데이터를 지우면 함께 사라집니다.
        </p>
      </Card>

      <SectionTitle>기록 지우기</SectionTitle>
      {confirmReset ? (
        <Card className="border-red-500/30 bg-red-500/[0.07]">
          <div className="flex items-start gap-2">
            <TriangleAlert size={15} className="mt-0.5 shrink-0 text-red-300" />
            <p className="text-[13px] leading-relaxed text-zinc-300">
              학습한 개념, 복습 카드, 퀴즈·모의고사 기록이 모두 사라집니다.
              되돌릴 수 없습니다.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
            >
              모두 지우기
            </Button>
          </div>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setConfirmReset(true)}>
          모든 기록 지우기
        </Button>
      )}

      <p className="mt-10 text-center text-[11px] leading-relaxed text-zinc-600">
        컴활 마스터 · 대한상공회의소가 기출문제를 공개하지 않아, 이 앱의
        문제는 공개된 출제기준을 근거로 새로 만든 것입니다.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
