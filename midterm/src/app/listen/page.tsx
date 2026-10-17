"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CloudDownload, Headphones, Pause, Play, Redo2, SkipBack, SkipForward, Trash2, Undo2 } from "lucide-react";
import { Gate } from "@/components/gate";
import { COURSE } from "@/lib/course";
import { HAS_FULL, MODE_KEY, buildQueue, listFor, savedMode, type ListenMode } from "@/lib/listen-queue";
import {
  RATES,
  playAt,
  removeOffline,
  saveOffline,
  savedOffline,
  seek,
  setQueue,
  setRate,
  setStopAtPdfEnd,
  skip,
  toggle,
  next,
  prev,
  usePlayer,
  type Track,
} from "@/lib/listen-player";
import type { ListenScript } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * 듣기 — 강의 PDF 하나를 한 편의 '레전드 강의'로 듣는다.
 * 알바하면서, 걸으면서. 녹음이 있으면 화면을 꺼도 이어지고 잠금화면에서 넘길 수 있다.
 */
export default function Listen() {
  return (
    <Gate>
      <Inner />
    </Gate>
  );
}

/** 녹음이 없을 때 길이 어림 — 한국어 낭독은 1초에 7글자 남짓 */
const estSec = (text: string) => text.replace(/\s/g, "").length / 7;

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Mode = ListenMode;

function Inner() {
  // 완전판이 있으면 기본은 완전판 (시험 대비). 요약판은 복습·자투리 시간용
  const hasFull = HAS_FULL;
  const [mode, setMode] = useState<Mode>(hasFull ? "full" : "short");
  useEffect(() => setMode(savedMode()), []);
  const pick = (m: Mode) => {
    setMode(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      /* 무시 */
    }
  };
  const list = listFor(mode);
  const queue = useMemo(() => buildQueue(list), [list]);
  const st = usePlayer();
  const cur = st.queue[st.idx];
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => setQueue(queue), [queue]);
  useEffect(() => {
    if (cur && open === null) setOpen(cur.pdfIdx);
  }, [cur, open]);

  const pdfs = useMemo(() => {
    const m: { title: string; pdf: string; tracks: { t: Track; i: number }[] }[] = [];
    queue.forEach((t, i) => {
      (m[t.pdfIdx] ??= { title: t.pdfTitle, pdf: list.find((s) => s.title === t.pdfTitle)?.pdf ?? "", tracks: [] }).tracks.push({ t, i });
    });
    return m;
  }, [queue, list]);

  const recorded = queue.filter((t) => t.src).length;
  const total = queue.reduce((a, t) => a + (t.dur ?? estSec(t.text)), 0);

  if (!queue.length)
    return <p className="py-16 text-center text-zinc-400">이 과목의 듣기 대본을 준비 중이에요.</p>;

  return (
    <main className="py-6 pb-56 lg:max-w-3xl">
      <h1 className="flex items-center gap-2 text-[23px] font-bold tracking-tight">
        <Headphones size={24} className="text-indigo-300" /> 레전드 듣기
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">
        강의 PDF 하나를 한 편의 강의처럼 귀로 들어요 · {pdfs.length}강 · 약 {Math.round(total / 60)}분
      </p>
      {hasFull && (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1 text-[13.5px] font-semibold" role="tablist">
          {(
            [
              ["full", "📚 완전판", "슬라이드 빠짐없이 · 시험 대비"],
              ["short", "⚡ 요약판", "핵심만 · 복습용"],
            ] as const
          ).map(([m, label, sub]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => pick(m)}
              className={cn("rounded-lg px-2 py-2 leading-tight", mode === m ? "bg-indigo-500 text-white" : "text-zinc-400")}
            >
              {label}
              <span className={cn("block text-[11px] font-normal", mode === m ? "text-indigo-100" : "text-zinc-500")}>{sub}</span>
            </button>
          ))}
        </div>
      )}
      {recorded < queue.length ? (
        <p className="mt-3 rounded-xl border border-amber-400/25 bg-amber-500/[0.07] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-100/90">
          {recorded === 0 ? "아직 녹음 전이라" : `녹음 ${recorded}/${queue.length}조각 — 나머지는`} 기기 음성으로 읽어요. 기기 음성은 <b>화면을 켜 둬야</b> 이어져요.
          녹음된 조각은 화면을 꺼도 계속 들리고 잠금화면에서 넘길 수 있어요.
        </p>
      ) : (
        <p className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.07] px-3.5 py-2.5 text-[12.5px] text-emerald-100/90">
          화면을 꺼도 계속 들려요. 잠금화면에서 ⏮ ⏯ ⏭ 로 넘길 수 있어요. 미리 저장하면 데이터 없이도 들어요.
        </p>
      )}

      <ul className="mt-5 space-y-2.5">
        {pdfs.map((p, pi) => {
          const sec = p.tracks.reduce((a, { t }) => a + (t.dur ?? estSec(t.text)), 0);
          const here = cur?.pdfIdx === pi;
          const isOpen = open === pi;
          return (
            <li key={pi} className={cn("overflow-hidden rounded-2xl border bg-white/[0.03]", here ? "border-indigo-400/40" : "border-white/10")}>
              <button type="button" onClick={() => setOpen(isOpen ? null : pi)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-bold", here ? "bg-indigo-500 text-white" : "bg-white/[0.07] text-zinc-300")}>
                  {here && st.playing ? <Headphones size={16} /> : pi + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold">{p.title}</span>
                  <span className="block text-[12px] text-zinc-500">
                    {p.tracks.length}조각 · 약 {Math.max(1, Math.round(sec / 60))}분{p.tracks.every(({ t }) => t.src) ? " · 🎙 녹음" : ""}
                  </span>
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    playAt(p.tracks[0].i);
                    setOpen(pi);
                  }}
                  className="grid size-9 place-items-center rounded-full bg-white/[0.08] text-zinc-100"
                  aria-label={`${p.title} 처음부터 듣기`}
                >
                  <Play size={16} />
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-white/[0.06] px-2 pb-2">
                  <ol>
                    {p.tracks.map(({ t, i }) => {
                      const on = st.idx === i;
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => (on ? toggle() : playAt(i))}
                            className={cn("flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-[14px]", on ? "bg-indigo-500/15 text-indigo-100" : "text-zinc-300")}
                          >
                            <span className="w-5 shrink-0 text-center text-[12px] text-zinc-500">{on && st.playing ? "▶" : t.partIdx + 1}</span>
                            <span className="min-w-0 flex-1 truncate">{t.title}</span>
                            <span className="text-[11.5px] text-zinc-500">{fmt(t.dur ?? estSec(t.text))}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  <Offline srcs={p.tracks.map(({ t }) => t.src).filter((s): s is string => !!s)} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {cur && (
        <section className="mt-6">
          <h2 className="text-[13px] font-bold text-zinc-400">📜 지금 읽는 대본 — {cur.title}</h2>
          <Transcript text={cur.text} active={st.mode === "tts" ? st.pos : -1} />
        </section>
      )}

      <PlayerBar />
    </main>
  );
}

function Transcript({ text, active }: { text: string; active: number }) {
  const parts = text.split(/(?<=[.?!])\s+|\n+/).filter(Boolean);
  return (
    <p className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[15px] leading-[1.85] text-zinc-200">
      {parts.map((s, i) => (
        <span key={i} className={cn(i === active && "rounded bg-indigo-500/25 text-white")}>
          {s}{" "}
        </span>
      ))}
    </p>
  );
}

function Offline({ srcs }: { srcs: string[] }) {
  const [have, setHave] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    savedOffline(srcs).then(setHave).catch(() => setHave(0));
  }, [srcs]);
  if (!srcs.length) return null;
  const all = have === srcs.length;
  return (
    <div className="mt-1 flex items-center gap-2 px-2.5 pb-1 text-[12.5px]">
      {all ? (
        <>
          <span className="flex items-center gap-1 text-emerald-300">
            <Check size={14} /> 저장됨 — 데이터 없이 들을 수 있어요
          </span>
          <button
            type="button"
            className="ml-auto flex items-center gap-1 text-zinc-500"
            onClick={() => removeOffline(srcs).then(() => setHave(0))}
          >
            <Trash2 size={13} /> 지우기
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={busy !== null}
          className="flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-1.5 text-zinc-200"
          onClick={() => {
            setErr("");
            setBusy(0);
            saveOffline(srcs, setBusy)
              .then(() => setHave(srcs.length))
              .catch(() => setErr("저장하지 못했어요. 와이파이에서 다시 해 보세요."))
              .finally(() => setBusy(null));
          }}
        >
          <CloudDownload size={14} />
          {busy !== null ? `저장 중 ${busy}/${srcs.length}` : "오프라인 저장 (와이파이 추천)"}
        </button>
      )}
      {err && <span className="text-rose-300">{err}</span>}
    </div>
  );
}

function PlayerBar() {
  const st = usePlayer();
  const cur = st.queue[st.idx];
  if (!cur) return null;
  const audio = st.mode === "audio";
  return (
    <div className="app-zoom fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-40 px-3 lg:bottom-4 lg:pl-64">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-zinc-900/95 p-3.5 shadow-2xl backdrop-blur md:max-w-[46rem]">
        <div className="flex items-baseline gap-2">
          <p className="min-w-0 flex-1 truncate text-[14px] font-semibold">{cur.title}</p>
          <span className="shrink-0 text-[11px] text-zinc-500">{audio ? "🎙 녹음" : "🗣 기기 음성"}</span>
        </div>
        <p className="truncate text-[12px] text-zinc-500">{cur.pdfTitle}</p>
        <input
          type="range"
          min={0}
          max={Math.max(1, audio ? st.len : st.len - 1)}
          step={audio ? 1 : 1}
          value={Math.min(st.pos, st.len)}
          onChange={(e) => seek(Number(e.target.value))}
          className="mt-2 w-full accent-indigo-400"
          aria-label="재생 위치"
        />
        <div className="flex justify-between text-[11px] text-zinc-500">
          <span>{audio ? fmt(st.pos) : `${st.pos + 1}번째 문장`}</span>
          <span>{audio ? fmt(st.len) : `${st.len}문장`}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRate(RATES[(RATES.indexOf(st.rate) + 1) % RATES.length] ?? 1)}
            className="w-14 rounded-lg bg-white/[0.07] py-1.5 text-[12.5px] font-bold text-zinc-200"
            aria-label="재생 속도"
          >
            {st.rate}×
          </button>
          <div className="flex items-center gap-1.5">
            <Ctl onClick={prev} label="이전"><SkipBack size={19} /></Ctl>
            <Ctl onClick={() => skip(-15)} label="15초 뒤로"><Undo2 size={18} /></Ctl>
            <button
              type="button"
              onClick={toggle}
              className="grid size-12 place-items-center rounded-full bg-indigo-500 text-white"
              aria-label={st.playing ? "일시정지" : "재생"}
            >
              {st.playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </button>
            <Ctl onClick={() => skip(15)} label="15초 앞으로"><Redo2 size={18} /></Ctl>
            <Ctl onClick={next} label="다음"><SkipForward size={19} /></Ctl>
          </div>
          <button
            type="button"
            onClick={() => setStopAtPdfEnd(!st.stopAtPdfEnd)}
            className={cn("w-14 whitespace-pre-line rounded-lg py-1.5 text-[11px] font-semibold leading-tight", st.stopAtPdfEnd ? "bg-amber-500/20 text-amber-200" : "bg-white/[0.07] text-zinc-400")}
            aria-pressed={st.stopAtPdfEnd}
          >
            {st.stopAtPdfEnd ? "이 강의\n끝 멈춤" : "다음 강의\n이어서"}
          </button>
        </div>
        {st.error && <p className="mt-1.5 text-[12px] text-rose-300">{st.error}</p>}
      </div>
    </div>
  );
}

function Ctl({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid size-10 place-items-center rounded-full text-zinc-200 active:bg-white/10">
      {children}
    </button>
  );
}

