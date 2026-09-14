"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  Download,
  FileText,
  PenLine,
  Trash2,
} from "lucide-react";
import { Button, Card, SectionTitle } from "@/components/ui";
import { ThemePicker } from "@/components/theme";
import { PRACTICAL, WRITTEN } from "@/data/exam";
import { CONCEPTS } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import { useApp } from "@/lib/store";
import { clearPractical, clearWritten } from "@/lib/mock-progress";
import { daysUntil } from "@/lib/utils";

export default function Page() {
  const settings = useApp((s) => s.settings);
  const setTrack = useApp((s) => s.setTrack);
  const setExamDate = useApp((s) => s.setExamDate);
  const resetAll = useApp((s) => s.resetAll);
  const stats = useApp((s) => s.stats);
  const studied = useApp((s) => s.studiedIds.length);
  const cards = useApp((s) => s.reviewCards.length);

  const [confirming, setConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const track = settings?.track ?? "written";
  const examDate = settings?.examDate ?? "";
  const left = examDate ? daysUntil(examDate) : null;

  function wipe() {
    resetAll();
    clearWritten();
    clearPractical();
    setConfirming(false);
  }

  return (
    <main className="py-6">
      <h1 className="text-xl font-bold tracking-tight">설정</h1>

      <SectionTitle>지금 준비하는 시험</SectionTitle>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTrack("written")}
          className={
            track === "written"
              ? "glass flex-1 rounded-2xl border-indigo-400/40 bg-indigo-500/15 p-3.5 text-left"
              : "glass flex-1 rounded-2xl p-3.5 text-left"
          }
        >
          <FileText size={17} className="text-indigo-300" />
          <p className="mt-1.5 text-[14px] font-bold">필기</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
            5과목 {WRITTEN.totalQuestions}문항 {WRITTEN.minutes}분
          </p>
        </button>
        <button
          type="button"
          onClick={() => setTrack("practical")}
          className={
            track === "practical"
              ? "glass flex-1 rounded-2xl border-indigo-400/40 bg-indigo-500/15 p-3.5 text-left"
              : "glass flex-1 rounded-2xl p-3.5 text-left"
          }
        >
          <PenLine size={17} className="text-emerald-300" />
          <p className="mt-1.5 text-[14px] font-bold">실기</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
            필답형 {PRACTICAL.minutes}분 {PRACTICAL.passScore}점
          </p>
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        학습과 복습에서 어느 쪽 문항을 먼저 낼지가 달라집니다. 기록은 둘 다
        그대로 남습니다.
      </p>

      <SectionTitle>시험일</SectionTitle>
      <Card>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-indigo-300" />
          <input
            type="date"
            aria-label="시험일"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value || null)}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[14px] text-zinc-100 outline-none focus:border-indigo-400/60"
          />
        </div>
        {mounted && left !== null && (
          <p className="mt-2 text-[12px] text-zinc-400">
            {left > 0
              ? `${left}일 남았습니다.`
              : left === 0
                ? "오늘입니다."
                : `${-left}일 지났습니다.`}
          </p>
        )}
      </Card>

      <SectionTitle>화면</SectionTitle>
      <ThemePicker />

      <SectionTitle>이 앱이 가진 것</SectionTitle>
      <Card>
        <div className="flex flex-col gap-1.5 text-[13px]">
          <Row label="개념" value={`${CONCEPTS.length}개`} />
          <Row label="필기 문항" value={`${QUESTIONS.length}개`} />
          <Row label="실기 문항" value={`${PRACTICAL_QUESTIONS.length}개`} />
        </div>
      </Card>

      <Card className="mt-3 border-amber-400/25 bg-amber-500/[0.07]">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300" />
          <p className="text-[12px] leading-relaxed text-zinc-300">
            문항은 공개된 출제 범위에 맞춰 새로 쓴 것입니다. 한국산업인력공단은
            정보처리기사 기출문제를 공개하지 않으며, 시중에 도는 복원본은 쓰지
            않았습니다. 출제기준에는 적용기간이 있으니 시험 전에 큐넷에서 지금
            적용되는 것을 한 번 확인하세요.
          </p>
        </div>
      </Card>

      <SectionTitle>내 기록</SectionTitle>
      <Card>
        <div className="flex flex-col gap-1.5 text-[13px]">
          <Row label="본 개념" value={`${studied}개`} />
          <Row label="복습 카드" value={`${cards}장`} />
          <Row label="연속 학습" value={`${stats.streak}일`} />
          <Row label="쌓은 경험치" value={`${stats.xp}`} />
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-zinc-500">
          <Download size={13} className="mt-0.5 shrink-0" />
          기록은 이 기기 안에만 있습니다. 서버로 보내지 않으므로 다른 기기와
          이어지지 않고, 브라우저 저장소를 지우면 함께 사라집니다.
        </p>
      </Card>

      <SectionTitle>기록 지우기</SectionTitle>
      {!confirming ? (
        <Button
          variant="danger"
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          <Trash2 size={15} />
          모든 기록 지우기
        </Button>
      ) : (
        <Card className="border-rose-400/30 bg-rose-500/10">
          <p className="text-[13px] leading-relaxed text-zinc-200">
            본 개념, 복습 카드, 모의고사 기록이 모두 사라집니다. 되돌릴 수
            없습니다.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirming(false)}
            >
              그만두기
            </Button>
            <Button variant="danger" className="flex-1" onClick={wipe}>
              지웁니다
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/onboarding"
          className="-m-2 inline-block p-2 text-[12px] text-zinc-500 hover:text-zinc-300"
        >
          처음 안내 다시 보기
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}
