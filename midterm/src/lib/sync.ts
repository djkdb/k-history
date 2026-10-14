"use client";

import { create } from "zustand";
import { COURSE_ID, KEY } from "./course-id";
import { useApp, type AppState } from "./store";
import type { QuestionLog, ReviewCard, SureMiss } from "./types";

/**
 * 기기 간 이어하기 — "기록 코드" 하나로 공부 기록을 서버(worker/index.ts)에 맡겨 두고
 * 다른 기기에서 꺼내 이어 한다.
 *
 * 코드는 이 사이트의 다섯 과목이 같이 쓴다 (같은 주소라 브라우저 저장소를 나눠 쓴다).
 * 과목마다 기록은 따로 맡긴다.
 *
 *   여는 순간·화면으로 돌아오는 순간 → 서버 기록을 받아 이 기기 기록과 합친다
 *   공부하는 동안 → 바뀐 기록을 모아 두었다가 올린다 (자주 올리지 않게 잠시 기다렸다가)
 *   화면을 떠날 때 → 바로 올린다
 *
 * 두 기기에서 따로 공부했어도 잃지 않게 합친다 (mergeState).
 */

const CODE_KEY = "mid-sync-code"; // 다섯 과목 공통
const SEEN_KEY = `${KEY}:sync-seen`; // 마지막으로 합친 서버 기록의 시각
const LOCAL_AT_KEY = `${KEY}:sync-local-at`; // 이 기기 기록이 마지막으로 바뀐 시각
const CODE_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/;

export type Persisted = Pick<
  AppState,
  "settings" | "stats" | "studied" | "cards" | "log" | "wrongIds" | "starred" | "mocks" | "sureWrong" | "lucky" | "calib"
>;

/* ── 저장소 ─────────────────────────────────────────── */

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* 저장소를 못 쓰는 창 */
  }
}
const num = (k: string) => Number(lsGet(k) ?? 0) || 0;

/** 사람이 적은 코드를 맞춘다 — 대소문자·띄어쓰기·하이픈은 무시한다 */
export function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/[\s-]/g, "");
}

/** 칸 순서와 상관없는 비교용 글 */
function canon(v: unknown): string {
  const walk = (x: unknown): unknown =>
    Array.isArray(x)
      ? x.map(walk)
      : x && typeof x === "object"
        ? Object.fromEntries(
            Object.keys(x as object)
              .sort()
              .map((k) => [k, walk((x as Record<string, unknown>)[k])]),
          )
        : x;
  return JSON.stringify(walk(v));
}
export const isCode = (c: string) => CODE_RE.test(c);
/** 보여 줄 때 다섯 자씩 끊기 */
export const prettyCode = (c: string) => `${c.slice(0, 5)}-${c.slice(5)}`;

/* ── 합치기 ─────────────────────────────────────────── */

const lastOf = (log: Record<string, QuestionLog>, id: string) => log[id]?.last ?? 0;

/**
 * 두 기록 합치기.
 *   푼 기록(log)      문제마다 더 나중에 푼 쪽
 *   본 개념·복습 카드  합집합 (카드는 더 나중에 복습한 쪽)
 *   모의고사          응시 시작 시각으로 합집합
 *   틀린 것·찍은 것·확신 오답  그 문제를 더 나중에 푼 쪽의 판단을 따른다
 *   별표·시험일       더 나중에 손댄 기기 쪽
 *   점수·공부 시간     큰 쪽 (더하면 같은 공부가 두 번 셈해진다)
 */
/** 예전 판 앱이 올린 기록에는 없는 칸이 있을 수 있다 — 빈 값으로 채운다 */
function fill(s: Partial<Persisted>): Persisted {
  const zero = { n: 0, right: 0 };
  return {
    settings: s.settings ?? null,
    stats: s.stats ?? { xp: 0, streak: 0, lastStudyDate: null, studyMinutes: 0 },
    studied: s.studied ?? {},
    cards: s.cards ?? [],
    log: s.log ?? {},
    wrongIds: s.wrongIds ?? [],
    starred: s.starred ?? [],
    mocks: s.mocks ?? [],
    sureWrong: s.sureWrong ?? {},
    lucky: s.lucky ?? [],
    calib: s.calib ?? { sure: zero, half: zero, guess: zero },
  };
}

export function mergeState(l: Persisted, lAt: number, r: Persisted, rAt: number): Persisted {
  const L = fill(l);
  const R = fill(r);
  const lNewer = lAt >= rAt;
  const N = lNewer ? L : R;
  const O = lNewer ? R : L;

  // 푼 기록
  const log: Record<string, QuestionLog> = { ...O.log };
  for (const [id, e] of Object.entries(N.log)) if (!log[id] || e.last >= log[id].last) log[id] = e;

  /** 이 문제는 어느 쪽이 더 나중에 풀었나 — 그쪽 판단을 따른다 */
  const judge = (id: string) => (lastOf(N.log, id) >= lastOf(O.log, id) ? N : O);
  const member = (pick: (s: Persisted) => string[]) => {
    const n = new Set(pick(N));
    const o = new Set(pick(O));
    const out: string[] = [];
    for (const id of [...pick(N), ...pick(O)]) {
      if (out.includes(id)) continue;
      if (n.has(id) === o.has(id) || pick(judge(id)).includes(id)) out.push(id);
    }
    return out;
  };
  const wrongIds = member((s) => s.wrongIds);
  const lucky = member((s) => s.lucky);

  // 확신 오답
  const sureWrong: Record<string, SureMiss> = {};
  for (const id of new Set([...Object.keys(N.sureWrong), ...Object.keys(O.sureWrong)])) {
    const a = N.sureWrong[id];
    const b = O.sureWrong[id];
    if (a && b) {
      const base = a.at >= b.at ? a : b;
      const okDays = base === a && a.at !== b.at ? a.okDays : [...new Set([...a.okDays, ...b.okDays])];
      if (okDays.length < 2) sureWrong[id] = { at: base.at, okDays };
    } else if (judge(id).sureWrong[id]) {
      sureWrong[id] = (a ?? b)!;
    }
  }

  // 본 개념 — 먼저 본 때
  const studied: Record<string, number> = { ...O.studied };
  for (const [id, t] of Object.entries(N.studied)) studied[id] = studied[id] ? Math.min(studied[id], t) : t;

  // 복습 카드 — 더 나중에 손댄 쪽
  const touched = (c: ReviewCard) => c.lastReviewedAt ?? c.addedAt;
  const cardMap = new Map<string, ReviewCard>();
  for (const c of [...O.cards, ...N.cards]) {
    const prev = cardMap.get(c.sourceId);
    if (!prev || touched(c) >= touched(prev)) cardMap.set(c.sourceId, c);
  }

  // 모의고사
  const mockMap = new Map(O.mocks.map((m) => [m.startedAt, m]));
  for (const m of N.mocks) mockMap.set(m.startedAt, m);
  const mocks = [...mockMap.values()].sort((a, b) => a.startedAt - b.startedAt).slice(-30);

  // 점수·연속 공부
  const later = (N.stats.lastStudyDate ?? "") >= (O.stats.lastStudyDate ?? "") ? N.stats : O.stats;
  const stats = {
    ...later,
    xp: Math.max(N.stats.xp, O.stats.xp),
    studyMinutes: Math.max(N.stats.studyMinutes, O.stats.studyMinutes),
  };

  const total = (s: Persisted) => s.calib.sure.n + s.calib.half.n + s.calib.guess.n;

  return {
    settings: N.settings ?? O.settings,
    stats,
    studied,
    cards: [...cardMap.values()],
    log,
    wrongIds,
    starred: N.starred,
    mocks,
    sureWrong,
    lucky,
    calib: total(N) >= total(O) ? N.calib : O.calib,
  };
}

/* ── 상태 (화면에 보이는 것) ─────────────────────────── */

type Status = "off" | "idle" | "syncing" | "offline" | "error";
export const useSync = create<{ code: string | null; status: Status; lastSync: number | null; error: string | null }>(() => ({
  code: null,
  status: "off",
  lastSync: null,
  error: null,
}));

const persisted = (): Persisted =>
  useApp.persist.getOptions().partialize!(useApp.getState()) as unknown as Persisted;

/** 이 기기에서 아직 공부한 것이 없나 — 그러면 별표·시험일도 서버 쪽을 따른다 */
const fresh = (s: Persisted) =>
  Object.keys(s.log).length === 0 && Object.keys(s.studied).length === 0 && s.mocks.length === 0;

let applying = false;
let busy = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let firstDirtyAt = 0;

function apply(next: Persisted) {
  applying = true;
  try {
    useApp.setState(next as Partial<AppState>);
  } finally {
    applying = false;
  }
}

/** 서버와 맞추기 — 받아서 합치고, 이 기기에만 있는 것이 있으면 올린다 */
export async function syncNow(): Promise<boolean> {
  const code = useSync.getState().code;
  if (!code || busy || !useApp.getState().hydrated) return false;
  busy = true;
  useSync.setState({ status: "syncing", error: null });
  try {
    const res = await fetch(`/api/sync/${code}/${COURSE_ID}`, { cache: "no-store" });
    if (res.status === 404) {
      useSync.setState({ status: "error", error: "서버에서 이 코드를 찾을 수 없어요" });
      return false;
    }
    if (!res.ok) throw new Error(String(res.status));
    const remote = (await res.json()) as { at: number; state: Persisted | null };
    const local = persisted();
    const localAt = fresh(local) ? 0 : num(LOCAL_AT_KEY);
    let next = local;
    if (remote.state && remote.at > num(SEEN_KEY)) {
      next = mergeState(local, localAt, remote.state, remote.at);
      apply(next);
      lsSet(SEEN_KEY, String(remote.at));
    }
    // 합친 결과가 서버 것과 다르면(이 기기에만 있는 공부가 있으면) 올린다
    const same = remote.state !== null && canon(next) === canon(remote.state);
    if (!same) {
      const at = Math.max(Date.now(), remote.at + 1);
      const put = await fetch(`/api/sync/${code}/${COURSE_ID}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ at, state: next }),
        keepalive: true,
      });
      if (!put.ok) throw new Error(String(put.status));
      lsSet(SEEN_KEY, String(at));
      lsSet(LOCAL_AT_KEY, String(at));
    }
    firstDirtyAt = 0;
    useSync.setState({ status: "idle", lastSync: Date.now() });
    return true;
  } catch {
    useSync.setState({ status: navigator.onLine === false ? "offline" : "error", error: "잠시 후 다시 맞출게요" });
    return false;
  } finally {
    busy = false;
  }
}

/** 공부하는 동안: 바뀐 뒤 15초 조용하면 올린다. 계속 바뀌어도 1분은 넘기지 않는다 */
function schedule() {
  const now = Date.now();
  if (!firstDirtyAt) firstDirtyAt = now;
  if (timer) clearTimeout(timer);
  const wait = Math.max(0, Math.min(15_000, firstDirtyAt + 60_000 - now));
  timer = setTimeout(() => {
    timer = null;
    void syncNow();
  }, wait);
}

/* ── 코드 연결 ─────────────────────────────────────── */

export async function createCode(): Promise<string> {
  const res = await fetch("/api/sync/new", { method: "POST" });
  if (!res.ok) throw new Error("코드를 만들지 못했어요. 인터넷 연결을 확인해 주세요.");
  const { code } = (await res.json()) as { code: string };
  linkCode(code);
  // 새 코드에는 이 기기 기록을 바로 올린다
  lsSet(LOCAL_AT_KEY, String(Math.max(num(LOCAL_AT_KEY), Date.now())));
  lsSet(SEEN_KEY, "0");
  await syncNow();
  return code;
}

/** 다른 기기의 코드로 연결 — 있는 코드인지 먼저 확인한다 */
export async function joinCode(raw: string): Promise<void> {
  const code = normalizeCode(raw);
  if (!isCode(code)) throw new Error("코드는 10자리예요 (예: ABCDE-FGHJK)");
  const res = await fetch(`/api/sync/${code}`, { cache: "no-store" });
  if (res.status === 404) throw new Error("없는 코드예요. 다시 확인해 주세요.");
  if (!res.ok) throw new Error("연결하지 못했어요. 인터넷 연결을 확인해 주세요.");
  linkCode(code);
  lsSet(SEEN_KEY, "0");
  await syncNow();
}

function linkCode(code: string) {
  lsSet(CODE_KEY, code);
  useSync.setState({ code, status: "idle", error: null });
}

export function unlinkCode() {
  lsSet(CODE_KEY, null);
  lsSet(SEEN_KEY, null);
  useSync.setState({ code: null, status: "off", lastSync: null, error: null });
}

/* ── 시작 ──────────────────────────────────────────── */

let started = false;

/** 앱이 뜰 때 한 번 (SyncAgent) */
export function startSync() {
  if (started || typeof window === "undefined") return;
  started = true;
  const code = lsGet(CODE_KEY);
  if (code && isCode(code)) useSync.setState({ code, status: "idle" });

  // 기록이 바뀌면 시각을 적고 올릴 차례를 잡는다
  let lastJson = "";
  useApp.subscribe((s) => {
    if (!s.hydrated) return;
    const json = JSON.stringify(persisted());
    if (json === lastJson) return;
    const first = lastJson === "";
    lastJson = json;
    if (first || applying) return;
    lsSet(LOCAL_AT_KEY, String(Date.now()));
    if (useSync.getState().code) schedule();
  });

  const pull = () => {
    if (useSync.getState().code) void syncNow();
  };
  // 기록을 다 불러온 뒤 첫 맞추기
  if (useApp.getState().hydrated) pull();
  else {
    const off = useApp.subscribe((s) => {
      if (s.hydrated) {
        off();
        pull();
      }
    });
  }
  // 이 화면으로 돌아오면 받기, 떠나면 올리기
  let lastPull = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (Date.now() - lastPull > 5_000) {
        lastPull = Date.now();
        pull();
      }
    } else if (firstDirtyAt || timer) {
      if (timer) clearTimeout(timer);
      timer = null;
      void syncNow();
    }
  });
  window.addEventListener("online", pull);
}
