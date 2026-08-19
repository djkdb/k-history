"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/store";
import { CONCEPTS } from "@/data/concepts";
import { SQL_TASKS } from "@/data/sql-tasks";
import { ThemePicker } from "@/components/theme";
import { Button, Card, SectionTitle } from "@/components/ui";

export default function SettingsPage() {
  const router = useRouter();
  const hydrated = useApp((s) => s.hydrated);
  const settings = useApp((s) => s.settings);
  const setExamDate = useApp((s) => s.setExamDate);
  const resetAll = useApp((s) => s.resetAll);
  const stats = useApp((s) => s.stats);
  const studiedIds = useApp((s) => s.studiedIds);
  const clearedSqlIds = useApp((s) => s.clearedSqlIds);
  const reviewCards = useApp((s) => s.reviewCards);
  const mockAttempts = useApp((s) => s.mockAttempts);

  const [confirmReset, setConfirmReset] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(settings?.examDate ?? "");
  }, [settings?.examDate]);

  /*
   * 아직 시작하지 않은 사람이 이 화면으로 바로 들어올 수 있다 —
   * 즐겨찾기, 남이 보내 준 주소, 브라우저 기록 지운 뒤 재방문.
   * 홈은 온보딩으로 보내 주는데 여기에는 그 처리가 없어서, 저장된
   * 설정이 없으면 "불러오는 중…" 에서 영영 끝나지 않았다.
   */
  useEffect(() => {
    if (hydrated && !settings) router.replace("/onboarding");
  }, [hydrated, settings, router]);

  if (!hydrated || !settings) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="pt-6">
      <Link
        href="/"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        홈으로
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight">설정</h1>

      <SectionTitle>시험일</SectionTitle>
      <Card>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setExamDate(e.target.value || null);
          }}
          className="w-full bg-transparent text-base outline-none"
        />
        {date && (
          <button
            type="button"
            onClick={() => {
              setDate("");
              setExamDate(null);
            }}
            className="mt-2 text-[12px] text-zinc-500 hover:text-zinc-300"
          >
            시험일 지우기
          </button>
        )}
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
          사흘 안쪽으로 들어오면 첫 화면에 시험 직전 모드가 먼저 뜹니다.
        </p>
      </Card>

      <SectionTitle>화면</SectionTitle>
      <ThemePicker />

      <SectionTitle>내 기록</SectionTitle>
      <Card>
        <div className="flex flex-col gap-2 text-[13px]">
          <Row label="학습한 개념" value={`${studiedIds.length} / ${CONCEPTS.length}개`} />
          <Row
            label="맞힌 SQL 실습"
            value={`${clearedSqlIds.length} / ${SQL_TASKS.length}개`}
          />
          <Row label="복습 카드" value={`${reviewCards.length}장`} />
          <Row label="모의고사 응시" value={`${mockAttempts.length}회`} />
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
              학습한 개념, 맞힌 SQL 실습, 복습 카드, 퀴즈·모의고사 기록이 모두
              사라집니다. 되돌릴 수 없습니다.
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
        SQLD 마스터 · 한국데이터산업진흥원이 기출문제를 공개하지 않아, 이 앱의
        문제는 공개된 출제 범위와 표준 SQL 명세를 근거로 새로 만든 것입니다.
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
