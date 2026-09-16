"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Download,
  Merge,
  RotateCcw,
  Upload,
} from "lucide-react";
import { Button, Card, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  downloadBackup,
  mergeBackup,
  parseBackup,
  restoreBackup,
  summarize,
  undoAvailable,
  undoRestore,
  type BackupFile,
  type BackupSummary,
} from "@/lib/backup";

/**
 * 학습 기록 백업.
 *
 * 앱은 첫 화면에서 "기록은 이 기기에만 남습니다" 라고 말한다. 그렇게
 * 말해 놓고 옮길 방법을 주지 않으면, 폰을 바꾸는 사람은 몇 주치를 그냥
 * 잃는다. 파일로 빼 두고 되돌릴 길을 연다.
 */
function fmt(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(
    d.getHours(),
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function Rows({ s }: { s: BackupSummary }) {
  const rows: [string, string][] = [
    ["본 개념", `${s.studied}개`],
    ["복습 카드", `${s.reviewCards}장`],
    ["맞힌 문항", `${s.cleared}개`],
    ["모의고사 응시", `${s.mockAttempts}회`],
    ["경험치", `${s.xp} XP`],
  ];
  return (
    <dl className="flex flex-col gap-1">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between text-[12.5px]">
          <dt className="text-zinc-500">{k}</dt>
          <dd className="font-semibold tabular-nums text-zinc-200">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function BackupPage() {
  const hydrated = useApp((s) => s.hydrated);
  const state = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [picked, setPicked] = useState<BackupFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [undo, setUndo] = useState<BackupSummary | null>(null);

  useEffect(() => setUndo(undoAvailable()), [done]);

  const now = summarize({
    settings: state.settings,
    stats: state.stats,
    studiedIds: state.studiedIds,
    questionMisses: state.questionMisses,
    clearedQuestionIds: state.clearedQuestionIds,
    clearedPracticalIds: state.clearedPracticalIds,
    reviewCards: state.reviewCards,
    quizHistory: state.quizHistory,
    wrongIds: state.wrongIds,
    mockAttempts: state.mockAttempts,
  });

  const onPick = async (f: File) => {
    setError(null);
    setDone(null);
    try {
      setPicked(parseBackup(await f.text()));
    } catch (e) {
      setPicked(null);
      setError(e instanceof Error ? e.message : "파일을 읽지 못했습니다.");
    }
  };

  const apply = (mode: "replace" | "merge") => {
    if (!picked) return;
    if (mode === "replace") restoreBackup(picked);
    else mergeBackup(picked);
    setDone(
      mode === "replace" ? "백업으로 되돌렸습니다." : "두 기록을 합쳤습니다.",
    );
    setPicked(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <main className="py-6">
      <Link
        href="/settings"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        설정
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight">학습 기록 백업</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
        기록은 이 기기의 브라우저에만 저장됩니다. 앱이 새로 나와도 그대로
        남지만, 브라우저 데이터를 지우거나 기기를 바꾸면 사라집니다. 가끔
        파일로 저장해 두세요.
      </p>

      <SectionTitle>지금 기록</SectionTitle>
      <Card>
        {hydrated ? (
          <Rows s={now} />
        ) : (
          <p className="text-[12.5px] text-zinc-500">불러오는 중…</p>
        )}
      </Card>

      <Button
        size="lg"
        className="mt-3 w-full"
        disabled={!hydrated}
        onClick={downloadBackup}
      >
        <Download size={16} />
        파일로 저장하기
      </Button>

      <SectionTitle>백업 불러오기</SectionTitle>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        aria-label="백업 파일 고르기"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={16} />
        백업 파일 선택
      </Button>

      {error && (
        <Card className="mt-3 border-rose-400/30 bg-rose-500/10">
          <p className="flex items-start gap-1.5 text-[12.5px] text-rose-200">
            <AlertTriangle size={14} className="mt-px shrink-0" />
            {error}
          </p>
        </Card>
      )}

      {done && (
        <Card className="mt-3 border-emerald-400/30 bg-emerald-500/10">
          <p className="flex items-center gap-1.5 text-[12.5px] text-emerald-200">
            <Check size={14} />
            {done}
          </p>
        </Card>
      )}

      {picked && (
        <Card className="mt-3">
          <p className="mb-2 text-[12.5px] font-semibold text-zinc-200">
            {fmt(picked.exportedAt)}에 저장된 백업
          </p>
          <Rows s={summarize(picked.data, picked.exportedAt)} />
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" onClick={() => apply("merge")}>
              <Merge size={14} />
              지금 기록과 합치기 (권장)
            </Button>
            <Button variant="outline" size="sm" onClick={() => apply("replace")}>
              <RotateCcw size={14} />
              백업으로 되돌리기 (지금 기록 대체)
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
            어느 쪽을 고르든 직전 기록을 따로 남겨 두므로 바로 되돌릴 수
            있습니다.
          </p>
        </Card>
      )}

      {undo && (
        <>
          <SectionTitle>되돌리기</SectionTitle>
          <Card>
            <p className="text-[12.5px] leading-relaxed text-zinc-400">
              불러오기 직전 기록이 남아 있습니다. 본 개념 {undo.studied}개 ·
              모의고사 {undo.mockAttempts}회.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                if (undoRestore()) setDone("불러오기 전으로 되돌렸습니다.");
              }}
            >
              <RotateCcw size={14} />
              불러오기 전으로 되돌리기
            </Button>
          </Card>
        </>
      )}

      <SectionTitle>알아두기</SectionTitle>
      <Card>
        <ul className="flex flex-col gap-1.5 text-[11.5px] leading-relaxed text-zinc-500">
          <li>· 앱이 새로 나와도 기록은 지워지지 않습니다.</li>
          <li>
            · 기록은 주소(도메인)마다 따로 저장됩니다. 다른 주소로 접속하면 이
            기록이 보이지 않으니, 그때는 백업 파일로 옮기세요.
          </li>
          <li>
            · 홈 화면에 추가해 두면 iOS 가 오래 안 쓴 사이트의 데이터를 정리할
            때 함께 지워지지 않습니다.
          </li>
          <li>· 시크릿 창에서는 창을 닫는 순간 기록이 사라집니다.</li>
        </ul>
      </Card>
      <div className="pb-6" />
    </main>
  );
}
