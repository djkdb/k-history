"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Gauge, Info, Trash2 } from "lucide-react";
import { Button, Card, Chip, SectionTitle } from "@/components/ui";
import { ThemePicker } from "@/components/theme";
import { BANDS, type Band } from "@/lib/types";
import { BAND_LABEL } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import { loadVoices, supported } from "@/lib/tts";
import { formatMinutes } from "@/lib/utils";

export default function SettingsPage() {
  const settings = useApp((s) => s.settings);
  const stats = useApp((s) => s.stats);
  const setBand = useApp((s) => s.setBand);
  const setSpeechRate = useApp((s) => s.setSpeechRate);
  const setShowScript = useApp((s) => s.setShowScript);
  const setSettings = useApp((s) => s.setSettings);
  const resetAll = useApp((s) => s.resetAll);
  const band = useBand();

  const [voices, setVoices] = useState<string[] | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!supported()) {
      setVoices([]);
      return;
    }
    loadVoices().then((v) => setVoices(v.map((x) => `${x.name} (${x.lang})`)));
  }, []);

  const rate = settings?.speechRate ?? 1;

  return (
    <main className="py-6">
      <h1 className="text-2xl font-bold">설정</h1>

      <SectionTitle>목표 점수대</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {BANDS.map((b) => (
          <Chip key={b} active={band === b} onClick={() => setBand(b as Band)}>
            {BAND_LABEL[b]}
          </Chip>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        목표를 바꿔도 지금까지의 기록은 그대로입니다. 보이는 어휘와 문항의 범위만
        달라집니다.
      </p>

      <SectionTitle>시험일</SectionTitle>
      <Card>
        <input
          type="date"
          value={settings?.examDate ?? ""}
          onChange={(e) =>
            setSettings({
              band,
              examDate: e.target.value || null,
              speechRate: rate,
              showScript: settings?.showScript ?? false,
            })
          }
          className="w-full bg-transparent py-2.5 text-[15px] outline-none"
        />
        <p className="mt-2 text-[11px] text-zinc-500">
          시험이 일주일 안으로 들어오면 홈에 직전 모드가 뜹니다.
        </p>
      </Card>

      <SectionTitle>듣기</SectionTitle>
      <Card>
        <div className="flex items-center gap-3">
          <Gauge size={16} className="shrink-0 text-zinc-400" />
          <span className="shrink-0 text-[13px] font-bold">읽는 속도</span>
          <input
            type="range"
            min={0.7}
            max={1.3}
            step={0.05}
            value={rate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className="h-1.5 w-full accent-indigo-500"
            aria-label="읽는 속도"
          />
          <span className="w-10 shrink-0 text-right text-[13px] font-bold text-zinc-300">
            {rate.toFixed(2)}×
          </span>
        </div>
        <label className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
          <span>
            <span className="text-[13px] font-bold">스크립트 먼저 보기</span>
            <span className="mt-0.5 block text-[11px] leading-relaxed text-zinc-500">
              켜면 듣기 전에 스크립트가 펼쳐집니다. 받아쓰기보다 표현을 익히는 데
              집중할 때 씁니다.
            </span>
          </span>
          <input
            type="checkbox"
            checked={settings?.showScript ?? false}
            onChange={(e) => setShowScript(e.target.checked)}
            className="h-5 w-5 shrink-0 accent-indigo-500"
          />
        </label>
      </Card>

      <Card className="mt-3">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="mt-0.5 shrink-0 text-zinc-400" />
          <div className="min-w-0">
            <p className="text-[13px] font-bold">이 기기의 영어 음성</p>
            {voices === null && (
              <p className="mt-1 text-[12px] text-zinc-500">확인하는 중…</p>
            )}
            {voices?.length === 0 && (
              <p className="mt-1 text-[12px] leading-relaxed text-amber-200">
                영어 음성을 찾지 못했습니다. 듣기 문항은 스크립트를 읽으며 풀 수
                있습니다.
              </p>
            )}
            {voices && voices.length > 0 && (
              <>
                <p className="mt-1 text-[12px] text-zinc-500">{voices.length}개</p>
                <div className="mt-2 flex flex-col gap-1">
                  {voices.slice(0, 6).map((v) => (
                    <span key={v} className="truncate text-[11px] text-zinc-400">
                      {v}
                    </span>
                  ))}
                  {voices.length > 6 && (
                    <span className="text-[11px] text-zinc-600">
                      외 {voices.length - 6}개
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <SectionTitle>화면</SectionTitle>
      <ThemePicker />

      <SectionTitle>기록</SectionTitle>
      <Card>
        <div className="flex flex-col gap-2 text-[13px]">
          <Row label="연속 학습" value={`${stats.streak}일`} />
          <Row label="쌓은 경험치" value={`${stats.xp}`} />
          <Row label="공부한 시간" value={formatMinutes(stats.studyMinutes)} />
        </div>
      </Card>

      <Card className="mt-3 border-rose-500/20">
        {!confirming ? (
          <Button variant="ghost" className="w-full" onClick={() => setConfirming(true)}>
            <Trash2 size={16} />
            모든 기록 지우기
          </Button>
        ) : (
          <>
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-300" />
              <p className="text-[13px] leading-relaxed text-zinc-300">
                외운 어휘·복습 카드·모의고사 기록이 모두 사라집니다. 이 기기에만
                저장돼 있어 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setConfirming(false)}
              >
                그만두기
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  resetAll();
                  setConfirming(false);
                }}
              >
                지우기
              </Button>
            </div>
          </>
        )}
      </Card>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-zinc-600">
        토익 마스터 · ETS 가 기출문제를 공개하지 않고 시중 교재는 저작권이 있어,
        모든 문항은 공개된 시험 구성만을 근거로 AI 가 새로 쓴 것입니다. 학습 기록은
        이 기기 안에만 저장됩니다.
      </p>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold text-zinc-200">{value}</span>
    </div>
  );
}
