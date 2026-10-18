/**
 * 듣기 — 화면을 옮겨도, 화면을 꺼도 끊기지 않는 하나뿐인 재생기.
 *
 * 녹음(mp3)이 있는 조각은 <audio> 로 튼다. 화면이 꺼져도 이어지고, 잠금화면의
 * 재생·다음 단추가 듣는다(Media Session). 녹음이 아직 없는 조각은 기기의 한국어
 * 음성(speechSynthesis)으로 읽는다 — 이건 화면이 켜져 있어야 이어진다.
 *
 * 한 과목의 모든 조각을 한 줄로 늘어놓고(queue) 끝나면 다음 조각, 다음 강의로
 * 넘어간다. 어디까지 들었는지는 이 기기에 남겨 다음에 그 자리에서 잇는다.
 */
import { useSyncExternalStore } from "react";
import { withBase } from "./base";
import { KEY } from "./course-id";

export interface Track {
  pdfIdx: number;
  partIdx: number;
  pdfTitle: string;
  title: string;
  text: string;
  /** 녹음 주소 (/api/audio/… — 과목 경로 밖이라 base 를 붙이지 않는다). 없으면 기기 음성 */
  src: string | null;
  /** 녹음 길이(초) */
  dur: number | null;
}

export interface PlayerState {
  queue: Track[];
  idx: number;
  playing: boolean;
  /** 지금 조각에서의 위치 — 녹음이면 초, 기기 음성이면 문장 번호 */
  pos: number;
  /** 지금 조각의 길이 — 녹음이면 초, 기기 음성이면 문장 수 */
  len: number;
  rate: number;
  /** 강의 하나가 끝나면 멈춘다 */
  stopAtPdfEnd: boolean;
  mode: "audio" | "tts" | null;
  error: string | null;
  /** 이번에 한 번이라도 재생을 눌렀나 — 아래 작은 재생 막대를 띄우는 기준 */
  started: boolean;
}

const SAVE = `${KEY}:listen`;
export const OFFLINE_CACHE = "listen-audio-v1";
export const RATES = [0.8, 1, 1.15, 1.3, 1.5, 1.75, 2];

let state: PlayerState = {
  queue: [],
  idx: 0,
  playing: false,
  pos: 0,
  len: 0,
  rate: 1,
  stopAtPdfEnd: false,
  mode: null,
  error: null,
  started: false,
};
const subs = new Set<() => void>();
/** 이 탭에서 듣기를 켰다는 표시 — 새로고침돼도 작은 재생 막대를 되살린다 */
const ON = `${KEY}:listen-on`;
function set(p: Partial<PlayerState>) {
  if (p.started && !state.started) {
    try {
      sessionStorage.setItem(ON, "1");
    } catch {
      /* 막힌 창 */
    }
  }
  state = { ...state, ...p };
  subs.forEach((f) => f());
}
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
const SERVER: PlayerState = state;

/** 지금 상태 (훅 밖에서 읽기) */
export function playerState(): PlayerState {
  return state;
}

/** 이 탭에서 듣다가 새로고침됐나 */
export function wasListening(): boolean {
  try {
    return sessionStorage.getItem(ON) === "1";
  } catch {
    return false;
  }
}

/** 새로고침 뒤 — 저장된 자리에 멈춘 채로 작은 재생 막대만 다시 띄운다 */
export function restoreBar() {
  if (state.queue.length) set({ started: true });
}

export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

/* ── 저장 ─────────────────────────────────────────── */
interface Saved {
  pdf: string;
  part: number;
  pos: number;
  rate: number;
  stop: boolean;
}
function readSaved(): Partial<Saved> {
  try {
    return JSON.parse(localStorage.getItem(SAVE) || "{}");
  } catch {
    return {};
  }
}
let lastSave = 0;
function save(force = false) {
  const now = Date.now();
  if (!force && now - lastSave < 4000) return;
  lastSave = now;
  const t = state.queue[state.idx];
  if (!t) return;
  try {
    const s: Saved = { pdf: t.pdfTitle, part: t.partIdx, pos: state.mode === "audio" ? state.pos : 0, rate: state.rate, stop: state.stopAtPdfEnd };
    localStorage.setItem(SAVE, JSON.stringify(s));
  } catch {
    /* 저장이 막힌 창 — 이어 듣기만 못 한다 */
  }
}

/* ── 녹음 재생 ────────────────────────────────────── */
let audio: HTMLAudioElement | null = null;
/** 지금 <audio> 에 걸린 녹음의 원래 주소 (blob 주소로 틀 때도 원래 주소로 비교) */
let loadedSrc = "";

/*
 * 다음 조각 미리 받기 — 화면이 꺼지면 폰이 망 요청·서비스 워커를 늦추거나 멈춰서,
 * 조각이 끝난 뒤에 다음 파일을 받으려 하면 거기서 멈췄다. 지금 조각을 트는 동안
 * 다음 조각을 통째로 받아 메모리(blob)에 두고, 끝나면 바로 그걸 튼다.
 */
const blobs = new Map<string, string>(); // 원래 주소 → blob 주소
let fetching = "";
function prefetch(idx: number) {
  const t = state.queue[idx];
  if (!t?.src || blobs.has(t.src) || fetching === t.src) return;
  const src = t.src;
  fetching = src;
  fetch(src)
    .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
    .then((b) => {
      blobs.set(src, URL.createObjectURL(new Blob([b], { type: "audio/mpeg" })));
      // 지금 것과 다음 것만 남긴다
      const keep = new Set([state.queue[state.idx]?.src, state.queue[state.idx + 1]?.src]);
      for (const [k, u] of blobs) if (!keep.has(k)) {
        URL.revokeObjectURL(u);
        blobs.delete(k);
      }
    })
    .catch(() => {
      /* 못 받으면 끝날 때 평소처럼 망에서 받는다 */
    })
    .finally(() => {
      if (fetching === src) fetching = "";
    });
}
function el(): HTMLAudioElement {
  if (audio) return audio;
  const a = new Audio();
  a.preload = "auto";
  a.addEventListener("timeupdate", () => {
    if (state.mode !== "audio") return;
    set({ pos: a.currentTime, len: Number.isFinite(a.duration) ? a.duration : state.len });
    save();
    positionState();
    // 재생이 시작되면 다음 조각을 미리 받아 둔다
    if (state.playing && a.currentTime > 2) prefetch(state.idx + 1);
  });
  a.addEventListener("loadedmetadata", () => {
    if (state.mode === "audio") set({ len: a.duration });
  });
  a.addEventListener("ended", () => advance());
  a.addEventListener("play", () => state.mode === "audio" && set({ playing: true }));
  a.addEventListener("pause", () => {
    if (state.mode === "audio" && !a.ended) {
      set({ playing: false });
      save(true);
    }
  });
  a.addEventListener("error", () => {
    if (state.mode !== "audio") return;
    // 미리 받은 blob 이 망가졌으면 원래 주소로 한 번 더
    const cur = state.queue[state.idx]?.src;
    if (cur && a.src.startsWith("blob:")) {
      blobs.delete(cur);
      a.src = cur;
      a.play().catch(() => set({ playing: false }));
      return;
    }
    // 화면이 꺼져 있으면 기기 음성은 어차피 안 나온다 — 멈춘 채로 두고 알린다
    if (document.hidden) {
      set({ playing: false, error: "다음 녹음을 받지 못했어요. 다시 눌러 주세요." });
      return;
    }
    // 녹음을 못 받으면(망이 끊김 등) 그 조각은 기기 음성으로 읽는다
    startTts(0);
  });
  audio = a;
  return a;
}

/* ── 기기 음성 ────────────────────────────────────── */
let sentences: string[] = [];
let ttsToken = 0;
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
function koVoice(): SpeechSynthesisVoice | undefined {
  const vs = window.speechSynthesis?.getVoices() ?? [];
  return vs.find((v) => v.lang === "ko-KR" && /Google|Yuna|유나|Heami|SunHi/i.test(v.name)) ?? vs.find((v) => v.lang.startsWith("ko"));
}
function speakFrom(i: number) {
  const synth = window.speechSynthesis;
  if (!synth) {
    set({ error: "이 기기는 음성 읽기를 지원하지 않아요", playing: false });
    return;
  }
  const token = ++ttsToken;
  synth.cancel();
  if (i >= sentences.length) {
    advance();
    return;
  }
  set({ pos: i, len: sentences.length, playing: true });
  const u = new SpeechSynthesisUtterance(sentences[i]);
  u.lang = "ko-KR";
  const v = koVoice();
  if (v) u.voice = v;
  u.rate = state.rate;
  u.onend = () => {
    if (token !== ttsToken || !state.playing) return;
    speakFrom(i + 1);
  };
  u.onerror = (e) => {
    if (token !== ttsToken) return;
    if (e.error === "interrupted" || e.error === "canceled") return;
    set({ playing: false, error: "기기 음성이 멈췄어요. 다시 눌러 주세요." });
  };
  synth.speak(u);
}
function startTts(from: number) {
  audio?.pause();
  const t = state.queue[state.idx];
  sentences = t ? splitSentences(t.text) : [];
  set({ mode: "tts", error: null });
  speakFrom(from);
}
function stopTts() {
  ttsToken++;
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

/* ── 잠금화면 ─────────────────────────────────────── */
function mediaSession() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  const t = state.queue[state.idx];
  if (!t) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: t.title,
    artist: t.pdfTitle,
    album: "레전드 듣기",
    artwork: [{ src: withBase("/icon-512.png"), sizes: "512x512", type: "image/png" }],
  });
  const ms = navigator.mediaSession;
  ms.setActionHandler("play", () => play());
  ms.setActionHandler("pause", () => pause());
  ms.setActionHandler("nexttrack", () => next());
  ms.setActionHandler("previoustrack", () => prev());
  ms.setActionHandler("seekforward", () => skip(15));
  ms.setActionHandler("seekbackward", () => skip(-15));
  try {
    ms.setActionHandler("seekto", (d) => {
      if (state.mode === "audio" && audio && d.seekTime != null) audio.currentTime = d.seekTime;
    });
  } catch {
    /* 지원 안 하는 브라우저 */
  }
}
function positionState() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !audio) return;
  try {
    if (Number.isFinite(audio.duration))
      navigator.mediaSession.setPositionState({ duration: audio.duration, position: Math.min(audio.currentTime, audio.duration), playbackRate: state.rate });
  } catch {
    /* 무시 */
  }
}

/* ── 조작 ─────────────────────────────────────────── */
function load(idx: number, startAt = 0, autoplay = true) {
  const t = state.queue[idx];
  if (!t) return;
  stopTts();
  set({ idx, pos: 0, len: t.dur ?? 0, error: null, started: autoplay || state.started });
  mediaSession();
  if (t.src) {
    const a = el();
    set({ mode: "audio" });
    const url = t.src;
    if (loadedSrc !== url) {
      a.src = blobs.get(url) ?? url;
      loadedSrc = url;
    }
    a.playbackRate = state.rate;
    // 끝난 그 자리에서 바로 play() — 메타데이터를 기다렸다 부르면 화면이 꺼진 폰은 막는다
    if (autoplay) a.play().catch(() => set({ playing: false }));
    if (startAt > 0) {
      if (a.readyState >= 1) a.currentTime = startAt;
      else a.addEventListener("loadedmetadata", () => (a.currentTime = startAt), { once: true });
    }
    prefetch(idx + 1);
  } else {
    audio?.pause();
    sentences = splitSentences(t.text);
    set({ mode: "tts", len: sentences.length, playing: false });
    if (autoplay) speakFrom(0);
  }
  save(true);
}

function advance() {
  const cur = state.queue[state.idx];
  const nxt = state.queue[state.idx + 1];
  if (!nxt) {
    set({ playing: false });
    return;
  }
  if (state.stopAtPdfEnd && cur && nxt.pdfIdx !== cur.pdfIdx) {
    load(state.idx + 1, 0, false);
    set({ playing: false });
    return;
  }
  load(state.idx + 1);
}

/** 과목의 조각 목록을 넘긴다. 저장된 자리가 있으면 그리로 (재생은 하지 않는다) */
export function setQueue(queue: Track[]) {
  const same = state.queue.length === queue.length && state.queue.every((t, i) => t.text === queue[i].text && t.src === queue[i].src);
  if (same) return;
  const first = state.queue.length === 0;
  // 완전판 ↔ 요약판을 바꾸면 듣던 것을 멈추고 새 목록의 그 강의 처음으로
  const curPdf = state.queue[state.idx]?.pdfIdx;
  if (!first) {
    audio?.pause();
    stopTts();
    set({ playing: false });
  }
  const s = readSaved();
  set({ queue, rate: s.rate ?? state.rate, stopAtPdfEnd: s.stop ?? state.stopAtPdfEnd });
  let i = -1;
  if (first) i = queue.findIndex((t) => t.pdfTitle === s.pdf && t.partIdx === s.part);
  else if (curPdf != null) i = queue.findIndex((t) => t.pdfIdx === curPdf);
  const idx = i >= 0 ? i : 0;
  const t = queue[idx];
  set({ idx, pos: 0, len: t?.dur ?? 0, mode: t?.src ? "audio" : "tts" });
  if (t?.src) {
    const a = el();
    a.src = t.src;
    loadedSrc = t.src;
    if (first && s.pos && i >= 0) a.addEventListener("loadedmetadata", () => (a.currentTime = s.pos!), { once: true });
    a.playbackRate = state.rate;
  }
  mediaSession();
}

export function playAt(idx: number) {
  load(idx);
}
export function play() {
  if (!state.queue.length) return;
  set({ started: true });
  if (state.mode === "audio" && audio && audio.src) {
    audio.playbackRate = state.rate;
    audio.play().catch(() => set({ playing: false, error: "재생을 시작하지 못했어요. 다시 눌러 주세요." }));
  } else if (state.mode === "tts") {
    set({ playing: true });
    speakFrom(state.pos);
  } else load(state.idx);
}
export function pause() {
  if (state.mode === "audio") audio?.pause();
  else {
    stopTts();
    set({ playing: false });
  }
  save(true);
}
export function toggle() {
  if (state.playing) pause();
  else play();
}
export function next() {
  if (state.idx + 1 < state.queue.length) load(state.idx + 1);
}
export function prev() {
  // 3초 넘게 들었으면 이 조각의 처음으로, 아니면 앞 조각으로
  if (state.mode === "audio" && audio && audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (state.idx > 0) load(state.idx - 1);
}
export function skip(sec: number) {
  if (state.mode === "audio" && audio) {
    audio.currentTime = Math.max(0, Math.min((audio.duration || 0) - 0.5, audio.currentTime + sec));
  } else if (state.mode === "tts") {
    const i = Math.max(0, Math.min(sentences.length - 1, state.pos + (sec > 0 ? 1 : -1)));
    if (state.playing) speakFrom(i);
    else set({ pos: i });
  }
}
export function seek(pos: number) {
  if (state.mode === "audio" && audio) audio.currentTime = pos;
  else if (state.mode === "tts") {
    const i = Math.max(0, Math.min(sentences.length - 1, Math.round(pos)));
    if (state.playing) speakFrom(i);
    else set({ pos: i });
  }
}
export function setRate(rate: number) {
  set({ rate });
  if (audio) audio.playbackRate = rate;
  if (state.mode === "tts" && state.playing) speakFrom(state.pos);
  save(true);
  positionState();
}
export function setStopAtPdfEnd(v: boolean) {
  set({ stopAtPdfEnd: v });
  save(true);
}

/* ── 오프라인 저장 ────────────────────────────────── */
export async function savedOffline(srcs: string[]): Promise<number> {
  if (typeof caches === "undefined") return 0;
  const c = await caches.open(OFFLINE_CACHE);
  let n = 0;
  for (const s of srcs) if (await c.match(s)) n++;
  return n;
}
export async function saveOffline(srcs: string[], onProgress: (done: number) => void): Promise<void> {
  const c = await caches.open(OFFLINE_CACHE);
  let done = 0;
  for (const s of srcs) {
    const url = s;
    if (!(await c.match(url))) {
      const res = await fetch(url, { cache: "reload" });
      if (!res.ok) throw new Error(`${res.status}`);
      await c.put(url, res);
    }
    onProgress(++done);
  }
}
export async function removeOffline(srcs: string[]): Promise<void> {
  const c = await caches.open(OFFLINE_CACHE);
  for (const s of srcs) await c.delete(s);
}
