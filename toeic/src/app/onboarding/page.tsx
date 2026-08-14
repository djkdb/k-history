"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Headphones, Info, Volume2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { BANDS, type Band } from "@/lib/types";
import { BAND_LABEL } from "@/data/parts";
import { useApp } from "@/lib/store";
import { loadVoices, supported } from "@/lib/tts";
import { cn } from "@/lib/utils";

const BAND_NOTE: Record<Band, string> = {
  600: "기초 문법과 필수 어휘부터. 영어를 오래 놓았다면 여기서 시작합니다.",
  700: "가장 많은 사람이 목표로 하는 구간입니다. Part 5 를 빠르게 넘기는 것이 관건입니다.",
  800: "Part 7 을 시간 안에 다 푸는 것이 목표가 됩니다. 연계 지문과 문장 삽입이 늘어납니다.",
  900: "고난도 어휘와 이중·삼중 지문 위주. 함정 선지를 쳐내는 훈련을 합니다.",
};

export default function Onboarding() {
  const router = useRouter();
  const setSettings = useApp((s) => s.setSettings);
  const [band, setBand] = useState<Band>(700);
  const [voiceCount, setVoiceCount] = useState<number | null>(null);

  // 이 기기에 영어 음성이 있는지 미리 알아본다 — 없으면 시작하기 전에 알려야 한다
  useEffect(() => {
    if (!supported()) {
      setVoiceCount(0);
      return;
    }
    loadVoices().then((v) => setVoiceCount(v.length));
  }, []);

  const start = () => {
    setSettings({ band, examDate: null, speechRate: 1, showScript: false });
    router.replace("/");
  };

  return (
    <main className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-bold text-indigo-300">TOEIC</p>
        <h1 className="mt-1 text-3xl font-bold">토익 마스터</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          듣기 100문항·읽기 100문항, 2시간에 990점. 이 앱은 그 구성을 그대로 따라
          어휘·문법·파트별 훈련·모의고사를 한자리에 뒀습니다.
        </p>
      </motion.div>

      <Card className="mt-6">
        <div className="flex items-start gap-2.5">
          <Info size={16} className="mt-0.5 shrink-0 text-zinc-400" />
          <div className="text-[13px] leading-relaxed text-zinc-400">
            <p className="font-bold text-zinc-200">문제는 직접 만든 것입니다</p>
            <p className="mt-1">
              ETS 는 기출문제를 공개하지 않습니다. 그래서 여기 있는 문항은 공개된
              시험 구성(파트별 문항 수·유형·배점)에 맞춰 새로 쓴 것입니다. 실제
              시험지를 옮긴 것이 아닙니다.
            </p>
          </div>
        </div>
      </Card>

      <h2 className="mt-8 text-sm font-bold text-zinc-300">목표 점수대를 고르세요</h2>
      <p className="mt-1 text-[12px] text-zinc-500">
        나중에 설정에서 바꿀 수 있고, 바꿔도 지금까지의 기록은 그대로입니다.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {BANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBand(b)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              band === b
                ? "border-indigo-400/60 bg-indigo-500/10"
                : "border-white/10 bg-white/[0.03] hover:bg-white/5",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold">{BAND_LABEL[b]}</span>
              {band === b && <Check size={17} className="text-indigo-300" />}
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
              {BAND_NOTE[b]}
            </p>
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex items-start gap-2.5">
          {voiceCount === 0 ? (
            <Volume2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
          ) : (
            <Headphones size={16} className="mt-0.5 shrink-0 text-emerald-300" />
          )}
          <div className="text-[13px] leading-relaxed text-zinc-400">
            <p className="font-bold text-zinc-200">듣기는 기기의 음성으로 들려줍니다</p>
            {voiceCount === null && <p className="mt-1">음성을 확인하는 중…</p>}
            {voiceCount === 0 && (
              <p className="mt-1 text-amber-200">
                이 기기에서는 영어 음성을 찾지 못했습니다. 듣기 문항은 스크립트를
                읽는 방식으로 풀 수 있고, 나머지 기능은 모두 그대로 됩니다.
              </p>
            )}
            {voiceCount !== null && voiceCount > 0 && (
              <p className="mt-1">
                영어 음성 {voiceCount}개를 찾았습니다. 남녀 화자를 갈라 대화를
                들려주고, 속도는 0.7~1.3배로 조절할 수 있습니다.
              </p>
            )}
          </div>
        </div>
      </Card>

      <Button size="lg" className="mt-6 w-full" onClick={start}>
        시작하기
        <ArrowRight size={17} />
      </Button>
      <p className="mt-3 text-center text-[11px] text-zinc-600">
        학습 기록은 이 기기 안에만 저장됩니다. 서버로 보내지 않습니다.
      </p>
    </main>
  );
}
