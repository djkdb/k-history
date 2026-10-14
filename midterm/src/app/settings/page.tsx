"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Gate } from "@/components/gate";
import { ThemePicker } from "@/components/theme";
import { Button, Card, SectionTitle } from "@/components/ui";
import { COURSE } from "@/lib/course";
import { useApp } from "@/lib/store";

export default function Settings() {
  return (
    <Gate>
      <SettingsView />
    </Gate>
  );
}

function SettingsView() {
  const settings = useApp((s) => s.settings);
  const setExamDate = useApp((s) => s.setExamDate);
  const resetAll = useApp((s) => s.resetAll);
  const stats = useApp((s) => s.stats);
  const [date, setDate] = useState(settings?.examDate ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <main className="page-read py-6">
      <Link href="/" className="inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-400">
        <ArrowLeft size={15} /> 홈
      </Link>
      <h1 className="mt-3 text-[22px] font-bold tracking-tight">설정</h1>

      <SectionTitle>중간고사 날짜</SectionTitle>
      <Card>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSaved(false);
          }}
          aria-label="중간고사 날짜"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[15px] text-zinc-100 outline-none focus:border-indigo-400/60"
        />
        {COURSE.examNote && <p className="mt-2 text-[12.5px] text-zinc-400">{COURSE.examNote}</p>}
        <Button
          className="mt-3 w-full"
          onClick={() => {
            setExamDate(date || null);
            setSaved(true);
          }}
        >
          {saved ? "저장했어요" : "저장"}
        </Button>
      </Card>

      <SectionTitle>화면</SectionTitle>
      <ThemePicker />

      <SectionTitle>기록</SectionTitle>
      <Card>
        <p className="text-[13px] leading-relaxed text-zinc-300">
          공부 기록은 이 기기 안에만 남습니다. 지금까지 {stats.studyMinutes}분 · {stats.xp}점 · 연속 {stats.streak}일.
        </p>
        <Button
          variant="danger"
          className="mt-3 w-full"
          onClick={() => {
            if (confirm(`${COURSE.name} 기록을 모두 지울까요? 되돌릴 수 없습니다. (다른 과목 기록은 그대로입니다)`)) resetAll();
          }}
        >
          이 과목 기록 모두 지우기
        </Button>
      </Card>

      <p className="mt-8 text-center text-[11.5px] leading-relaxed text-zinc-500">
        {COURSE.name} ({COURSE.code}){COURSE.professor ? ` · ${COURSE.professor}` : ""}
        <br />
        강의 자료를 바탕으로 만든 개인 공부용 앱입니다.
      </p>
    </main>
  );
}
