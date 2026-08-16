import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MockAttempt, QuizResult, ReviewCard, Settings, Stats } from "./types";
import { createCard, reviewCard as gradeCard } from "./srs";
import { idbStorage } from "./idb-storage";
import { todayISO } from "./utils";

export interface AppState {
  hydrated: boolean;
  settings: Settings | null;
  stats: Stats;
  /** 공부를 마친 개념 id */
  studiedIds: string[];
  /** 직접 쳐서 맞힌 적 있는 SQL 실습 id */
  clearedSqlIds: string[];
  reviewCards: ReviewCard[];
  quizHistory: QuizResult[];
  /** 틀린 것 (최근 순) */
  wrongIds: string[];
  mockAttempts: MockAttempt[];

  setSettings: (s: Settings) => void;
  setExamDate: (d: string | null) => void;
  setShowSchema: (v: boolean) => void;
  markStudied: (id: string) => void;
  recordQuizResult: (r: QuizResult) => void;
  recordSqlResult: (id: string, correct: boolean) => void;
  reviewItem: (id: string, correct: boolean) => void;
  recordMockAttempt: (attempt: MockAttempt, wrongSourceIds: string[]) => void;
  resetAll: () => void;
}

const initialStats: Stats = { xp: 0, streak: 0, lastStudyDate: null, studyMinutes: 0 };

/**
 * 저장된 기록을 현재 초기값 위에 깊게 덮어쓴다.
 *
 * zustand 기본 병합은 한 겹만 본다. 나중에 stats 에 필드를 하나 더하면
 * 저장본이 초기값을 통째로 덮어 새 필드가 undefined 가 된다(= 화면에 NaN).
 */
function mergeSaved<T>(base: T, saved: unknown): T {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return saved === undefined ? base : (saved as T);
  }
  if (!base || typeof base !== "object" || Array.isArray(base)) return saved as T;
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
  const streak = stats.lastStudyDate === todayISO(d) ? stats.streak + 1 : 1;
  return { ...stats, streak, lastStudyDate: today };
}

function bumpWrong(list: string[], id: string, correct: boolean): string[] {
  return correct ? list.filter((x) => x !== id) : [id, ...list.filter((x) => x !== id)];
}

/** 복습 카드에 채점 결과를 반영한다 (없으면 틀렸을 때만 새로 만든다) */
function applyReview(cards: ReviewCard[], id: string, correct: boolean): ReviewCard[] {
  if (cards.some((c) => c.sourceId === id)) {
    return cards.map((c) => (c.sourceId === id ? gradeCard(c, correct) : c));
  }
  // 맞힌 것까지 큐에 넣으면 공부하지도 않은 항목이 쌓인다
  return correct ? cards : [...cards, gradeCard(createCard(id), false)];
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      settings: null,
      stats: initialStats,
      studiedIds: [],
      clearedSqlIds: [],
      reviewCards: [],
      quizHistory: [],
      wrongIds: [],
      mockAttempts: [],

      setSettings: (settings) => set({ settings }),

      setExamDate: (examDate) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, examDate }
            : { examDate, showSchema: true },
        })),

      setShowSchema: (showSchema) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, showSchema }
            : { examDate: null, showSchema },
        })),

      markStudied: (id) =>
        set((s) => {
          if (s.studiedIds.includes(id)) return s;
          return {
            studiedIds: [...s.studiedIds, id],
            reviewCards: s.reviewCards.some((c) => c.sourceId === id)
              ? s.reviewCards
              : [...s.reviewCards, createCard(id)],
            stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 20 }),
          };
        }),

      recordQuizResult: (r) =>
        set((s) => ({
          quizHistory: [...s.quizHistory, r].slice(-500),
          wrongIds: bumpWrong(s.wrongIds, r.sourceId, r.correct),
          reviewCards: applyReview(s.reviewCards, r.sourceId, r.correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + (r.correct ? 10 : 2) }),
        })),

      recordSqlResult: (id, correct) =>
        set((s) => ({
          clearedSqlIds:
            correct && !s.clearedSqlIds.includes(id)
              ? [...s.clearedSqlIds, id]
              : s.clearedSqlIds,
          wrongIds: bumpWrong(s.wrongIds, id, correct),
          reviewCards: applyReview(s.reviewCards, id, correct),
          // 직접 쳐서 맞힌 것은 더 값이 크다
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + (correct ? 15 : 3) }),
        })),

      reviewItem: (id, correct) =>
        set((s) => ({
          reviewCards: applyReview(s.reviewCards, id, correct),
          wrongIds: bumpWrong(s.wrongIds, id, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 5 }),
        })),

      recordMockAttempt: (attempt, wrongSourceIds) =>
        set((s) => {
          // 채점 뒤 되돌아가 다시 제출하면 같은 응시를 두 번 세면 안 된다
          const prev = s.mockAttempts.findIndex((a) => a.startedAt === attempt.startedAt);
          const again = prev >= 0;
          const mockAttempts = again
            ? s.mockAttempts.map((a, i) => (i === prev ? attempt : a))
            : [...s.mockAttempts, attempt].slice(-50);

          let reviewCards = s.reviewCards;
          let wrongIds = s.wrongIds;
          for (const id of wrongSourceIds) {
            reviewCards = applyReview(reviewCards, id, false);
            wrongIds = bumpWrong(wrongIds, id, false);
          }
          const minutes = Math.round((attempt.finishedAt - attempt.startedAt) / 60000);
          const stats = again
            ? s.stats
            : bumpStreak({
                ...s.stats,
                xp: s.stats.xp + 50,
                studyMinutes: s.stats.studyMinutes + Math.max(0, minutes),
              });
          return { mockAttempts, reviewCards, wrongIds, stats };
        }),

      resetAll: () =>
        set({
          settings: null,
          stats: initialStats,
          studiedIds: [],
          clearedSqlIds: [],
          reviewCards: [],
          quizHistory: [],
          wrongIds: [],
          mockAttempts: [],
        }),
    }),
    {
      // ⚠️ name 을 바꾸면 이미 쓰고 있는 사람들의 기록을 찾지 못한다. 절대 바꾸지 말 것.
      //    version 도 두지 않는다 — 올리는 순간 zustand 가 저장본을 버릴 수 있다.
      //    스키마가 바뀌어도 아래 merge 가 흡수한다. (scripts/audit.ts 가 감시)
      name: "sqld-state",
      storage: createJSONStorage(() => idbStorage),
      merge: (persisted, current) => mergeSaved(current, persisted),
      partialize: (s) => ({
        settings: s.settings,
        stats: s.stats,
        studiedIds: s.studiedIds,
        clearedSqlIds: s.clearedSqlIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongIds: s.wrongIds,
        mockAttempts: s.mockAttempts,
      }),
      // 불러오기에 실패해도 화면은 떠야 한다. 다만 그때 빈 상태를 저장하지는 않는다.
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn("[sqld] 저장된 기록을 불러오지 못했습니다", error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);
