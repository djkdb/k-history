import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  MockAttempt,
  QuestionLog,
  ReviewCard,
  Settings,
  Stats,
} from "./types";
import { createCard, reviewCard } from "./srs";
import { idbStorage, mirrorKeyOf } from "./idb-storage";
import { todayISO } from "./utils";
import { KEY } from "./course-id";
import { Q_MAP } from "./course";

export interface AppState {
  hydrated: boolean;
  settings: Settings | null;
  stats: Stats;
  /** 개념 id → 처음 공부한 때 */
  studied: Record<string, number>;
  /** 개념 단위 복습 카드 */
  cards: ReviewCard[];
  /** 문제 id → 맞히고 틀린 횟수 */
  log: Record<string, QuestionLog>;
  /** 지금 틀린 채로 남은 문제 — 다시 맞히면 빠진다 */
  wrongIds: string[];
  /** 별표한 개념 */
  starred: string[];
  mocks: MockAttempt[];

  setExamDate: (d: string | null) => void;
  markStudied: (conceptId: string) => void;
  unmarkStudied: (conceptId: string) => void;
  toggleStar: (conceptId: string) => void;
  answer: (questionId: string, correct: boolean) => void;
  reviewConcept: (conceptId: string, correct: boolean) => void;
  recordMock: (attempt: MockAttempt) => void;
  addStudyMinutes: (min: number) => void;
  resetAll: () => void;
}

const initialStats: Stats = {
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  studyMinutes: 0,
};

/**
 * 저장된 기록을 현재 초기값 위에 깊게 덮어쓴다.
 *
 * zustand 기본 병합은 한 겹만 본다. 나중에 stats 에 칸을 하나 더하면
 * 저장본이 초기값을 통째로 덮어 새 칸이 undefined 가 된다(= 화면에 NaN).
 */
function mergeSaved<T>(base: T, saved: unknown): T {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return saved === undefined ? base : (saved as T);
  }
  if (!base || typeof base !== "object" || Array.isArray(base))
    return saved as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (v === undefined) continue;
    out[k] = mergeSaved((base as Record<string, unknown>)[k], v);
  }
  return out as T;
}

function bumpStreak(stats: Stats): Stats {
  const today = todayISO();
  if (stats.lastStudyDate === today) return stats;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = todayISO(d);
  const streak = stats.lastStudyDate === yesterday ? stats.streak + 1 : 1;
  return { ...stats, streak, lastStudyDate: today };
}

/**
 * 개념 카드 한 장을 채점한다.
 * 공부하지 않은 개념을 맞혔다고 카드를 만들지는 않는다 — 틀렸을 때만 새로
 * 넣는다. 맞힌 것까지 넣으면 복습함이 아는 것으로 가득 찬다.
 */
function grade(cards: ReviewCard[], id: string, correct: boolean): ReviewCard[] {
  const i = cards.findIndex((c) => c.sourceId === id);
  if (i < 0) return correct ? cards : [...cards, reviewCard(createCard(id), false)];
  return cards.map((c, k) => (k === i ? reviewCard(c, correct) : c));
}

/** 문제 하나의 결과를 기록에 반영한다 (퀴즈와 모의고사가 같이 쓴다) */
function applyAnswer(
  s: Pick<AppState, "log" | "wrongIds" | "cards" | "stats">,
  qid: string,
  correct: boolean,
  now: number,
) {
  const prev = s.log[qid] ?? { right: 0, wrong: 0, last: 0, lastRight: false };
  const log = {
    ...s.log,
    [qid]: {
      right: prev.right + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
      last: now,
      lastRight: correct,
    },
  };
  const wrongIds = correct
    ? s.wrongIds.filter((x) => x !== qid)
    : [qid, ...s.wrongIds.filter((x) => x !== qid)];
  const concept = Q_MAP[qid]?.concept;
  const cards = concept ? grade(s.cards, concept, correct) : s.cards;
  const stats = bumpStreak({ ...s.stats, xp: s.stats.xp + (correct ? 10 : 2) });
  return { log, wrongIds, cards, stats };
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      settings: null,
      stats: initialStats,
      studied: {},
      cards: [],
      log: {},
      wrongIds: [],
      starred: [],
      mocks: [],

      setExamDate: (examDate) => set({ settings: { examDate } }),

      markStudied: (id) =>
        set((s) => {
          if (s.studied[id]) return s;
          const now = Date.now();
          return {
            studied: { ...s.studied, [id]: now },
            // 공부한 개념은 복습함에 넣는다 — 내일 다시 묻는다
            cards: s.cards.some((c) => c.sourceId === id)
              ? s.cards
              : [...s.cards, createCard(id, now)],
            stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 15 }),
          };
        }),

      unmarkStudied: (id) =>
        set((s) => {
          if (!s.studied[id]) return s;
          const studied = { ...s.studied };
          delete studied[id];
          return { studied };
        }),

      toggleStar: (id) =>
        set((s) => ({
          starred: s.starred.includes(id)
            ? s.starred.filter((x) => x !== id)
            : [...s.starred, id],
        })),

      answer: (qid, correct) =>
        set((s) => applyAnswer(s, qid, correct, Date.now())),

      reviewConcept: (id, correct) =>
        set((s) => ({
          cards: grade(s.cards, id, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 5 }),
        })),

      recordMock: (attempt) =>
        set((s) => {
          // 채점 뒤 다시 제출해도 같은 응시를 두 번 세지 않는다
          const again = s.mocks.some((m) => m.startedAt === attempt.startedAt);
          let acc: Pick<AppState, "log" | "wrongIds" | "cards" | "stats"> = s;
          if (!again) {
            for (const [qid, ok] of Object.entries(attempt.results))
              acc = applyAnswer(acc, qid, ok, attempt.finishedAt);
          }
          const mocks = again
            ? s.mocks.map((m) => (m.startedAt === attempt.startedAt ? attempt : m))
            : [...s.mocks, attempt].slice(-30);
          const minutes = Math.max(0, Math.round((attempt.finishedAt - attempt.startedAt) / 60000));
          return {
            ...acc,
            mocks,
            stats: again
              ? acc.stats
              : { ...acc.stats, xp: acc.stats.xp + 30, studyMinutes: acc.stats.studyMinutes + minutes },
          };
        }),

      addStudyMinutes: (min) =>
        set((s) => ({ stats: { ...s.stats, studyMinutes: s.stats.studyMinutes + min } })),

      resetAll: () =>
        set({
          settings: null,
          stats: initialStats,
          studied: {},
          cards: [],
          log: {},
          wrongIds: [],
          starred: [],
          mocks: [],
        }),
    }),
    {
      // ⚠️ name 을 바꾸면 이미 쓰고 있는 사람의 기록을 찾지 못한다. 절대 바꾸지 말 것.
      //    version 도 두지 않는다 — 올리는 순간 zustand 가 저장본을 버릴 수 있다.
      //    모양이 바뀌어도 아래 merge 가 흡수한다.
      name: `${KEY}-state`,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({
        settings: s.settings,
        stats: s.stats,
        studied: s.studied,
        cards: s.cards,
        log: s.log,
        wrongIds: s.wrongIds,
        starred: s.starred,
        mocks: s.mocks,
      }),
      merge: (saved, current) => mergeSaved(current, saved),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn(`[${KEY}] 저장된 기록을 불러오지 못했습니다`, error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);

/*
 * 같은 과목을 두 창에 띄워 둔 경우 (탭 둘, 또는 홈 화면 앱과 탭).
 * 한 창에서 푼 것을 다른 창은 모른다. 그 상태로 다른 창에서 하나 더 풀면
 * 자기가 들고 있던 예전 기록으로 저장본을 덮어써 먼저 푼 것이 사라진다.
 * 거울(localStorage)에 새 기록이 적히면 다른 창에 storage 이벤트가 오므로,
 * 그 값으로 이 창의 기록을 맞춘다.
 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== mirrorKeyOf(`${KEY}-state`) || !e.newValue) return;
    if (!useApp.getState().hydrated) return;
    let saved: unknown;
    try {
      saved = (JSON.parse(e.newValue) as { state?: unknown }).state;
    } catch {
      return;
    }
    if (!saved || typeof saved !== "object") return;
    const mine = useApp.persist.getOptions().partialize?.(useApp.getState());
    if (sameRecord(mine, saved)) return;
    useApp.setState((cur) => mergeSaved(cur, saved));
  });
}

/** 칸 순서와 상관없이 같은 기록인가 */
function sameRecord(a: unknown, b: unknown): boolean {
  const canon = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(canon)
      : v && typeof v === "object"
        ? Object.fromEntries(
            Object.keys(v as object)
              .sort()
              .map((k) => [k, canon((v as Record<string, unknown>)[k])]),
          )
        : v;
  return JSON.stringify(canon(a)) === JSON.stringify(canon(b));
}

/*
 * 저장 전수조사가 스토어를 직접 부르기 위한 문.
 * NEXT_PUBLIC_STORAGE_AUDIT=1 로 따로 빌드한 판에만 생긴다.
 */
if (process.env.NEXT_PUBLIC_STORAGE_AUDIT === "1" && typeof window !== "undefined") {
  (window as unknown as { __appStore?: unknown }).__appStore = useApp;
}

/** 시험일까지 남은 날 (정하지 않았으면 null) */
export function useExamDate(): string | null {
  return useApp((s) => s.settings?.examDate ?? null);
}
