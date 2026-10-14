"use client";

import { useEffect, useState } from "react";
import { Check, Cloud, CloudOff, Copy, Link2, RefreshCw } from "lucide-react";
import { createCode, joinCode, prettyCode, syncNow, unlinkCode, useSync } from "@/lib/sync";
import { Button, Card } from "./ui";

function ago(t: number | null) {
  if (!t) return "";
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 10) return "방금";
  if (s < 60) return `${s}초 전`;
  if (s < 3600) return `${Math.round(s / 60)}분 전`;
  return `${Math.round(s / 3600)}시간 전`;
}

/**
 * 기기 간 이어하기 — 기록 코드 만들기 / 다른 기기 코드 넣기 / 연결 상태.
 * compact 이면 처음 안내 화면용 (코드 넣기만 크게).
 */
export function SyncPanel({ compact = false, onLinked }: { compact?: boolean; onLinked?: () => void }) {
  const { code, status, lastSync, error } = useSync();
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, []);

  const run = async (f: () => Promise<unknown>) => {
    setWorking(true);
    setMsg(null);
    try {
      await f();
      onLinked?.();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "다시 시도해 주세요");
    } finally {
      setWorking(false);
    }
  };

  if (code) {
    return (
      <Card>
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-400">
          <Cloud size={14} className="text-emerald-300" /> 기록 코드 — 다른 기기에서 이 코드를 넣으면 이어서 합니다
        </p>
        <div className="mt-2 flex items-center gap-2">
          <p className="min-w-0 flex-1 select-all font-mono text-[24px] font-black tracking-[0.12em] text-zinc-50">
            {prettyCode(code)}
          </p>
          <button
            type="button"
            aria-label="코드 복사"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(prettyCode(code));
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                /* 복사를 못 하면 길게 눌러 고르면 된다 */
              }
            }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10"
          >
            {copied ? <Check size={17} className="text-emerald-300" /> : <Copy size={17} />}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-zinc-400">
          {status === "syncing" ? (
            <>
              <RefreshCw size={13} className="animate-spin" /> 맞추는 중…
            </>
          ) : status === "offline" || status === "error" ? (
            <>
              <CloudOff size={13} className="text-amber-300" /> {error ?? "연결되지 않았어요"} — 이 기기 기록은 그대로 남아 있어요
            </>
          ) : (
            <>
              <Check size={13} className="text-emerald-300" /> 맞춤 {ago(lastSync)}
            </>
          )}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" disabled={working || status === "syncing"} onClick={() => run(syncNow)}>
            <RefreshCw size={15} /> 지금 맞추기
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("이 기기에서 기록 코드 연결을 끊을까요? 이 기기의 기록은 지워지지 않고, 서버의 기록도 그대로 남습니다.")) unlinkCode();
            }}
          >
            연결 끊기
          </Button>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-500">
          코드 하나로 다섯 과목 모두 이어집니다. 앱을 열 때와 돌아올 때 받아 오고, 공부하는 동안 자동으로 올립니다. 두 기기에서 따로
          공부했어도 합쳐서 잃지 않아요. 코드를 아는 사람은 기록을 볼 수 있으니 남에게 알려 주지 마세요.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      {!compact && (
        <p className="text-[13px] leading-relaxed text-zinc-300">
          이 기기에서 하다가 다른 기기(폰·노트북·태블릿)에서 이어 하려면 기록 코드를 만드세요. 코드 하나로 다섯 과목 모두
          이어집니다.
        </p>
      )}
      {!compact && (
        <Button className="mt-3 w-full" disabled={working} onClick={() => run(createCode)}>
          <Cloud size={16} /> 새 기록 코드 만들기
        </Button>
      )}
      <p className={`${compact ? "" : "mt-4 "}text-[12.5px] font-semibold text-zinc-400`}>
        다른 기기에서 만든 코드가 있다면
      </p>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) void run(() => joinCode(input));
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ABCDE-FGHJK"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-label="기록 코드"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-mono text-[15px] uppercase tracking-wider text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-indigo-400/60"
        />
        <Button type="submit" disabled={working || !input.trim()}>
          <Link2 size={15} /> 연결
        </Button>
      </form>
      {msg && <p className="mt-2 text-[12.5px] font-semibold text-rose-300">{msg}</p>}
    </Card>
  );
}

/** 앱 어디서나 — 화면 없이 맞추기만 돌린다 */
export function SyncAgent() {
  useEffect(() => {
    void import("@/lib/sync").then((m) => m.startSync());
  }, []);
  return null;
}
