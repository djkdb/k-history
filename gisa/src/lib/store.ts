"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  MockAttempt,
  QuizResult,
  ReviewCard,
  Settings,
  Stats,
  Track,
} from "@/lib/types";
import { idbStorage } from "@/lib/idb-storage";
import { createCard, reviewCard } from "@/lib/srs";
import { todayISO } from "@/lib/utils";

export interface AppState {
  hydrated: boolean;
  settings: Settings | null;
  stats: Stats;
  /** 학습한 개념 */
  studiedIds: string[];
  /** 맞힌 적 있는 필기 문항 */
  clearedQuestionIds: string[];
  /** 맞힌 적 있는 실기 문항 */
  clearedPracticalIds: string[];
  reviewCards: ReviewCard[];
  quizHistory: QuizResult[];
  wrongIds: string[];
  mockAttempts: MockAttempt[];

  setSettings: (s: Settings) => void;
  setTrack: (t: Track) => void;
  setExamDate: (d: string | null) => void;
  markStudied: (id: string) => void;
  recordAnswer: (id: string, sourceId: string, correct: boolean) => void;
  recordPractical: (id: string, sourceId: string, correct: boolean) => void;
  reviewItem: (sourceId: string, correct: boolean) => void;
  recordQuiz: (r: QuizResult) => void;
  recordMockAttempt: (a: MockAttempt, wrongSourceIds: string[]) => void;
  addStudyMinutes: (min: number) => void;
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
  const yesterday = todayISO(d);
  const streak = stats.lastStudyDate === yesterday ? stats.streak + 1 : 1;
  return { ...stats, streak, lastStudyDate: today };
}

function applyReview(cards: ReviewCard[], id: string, correct: boolean): ReviewCard[] {
  const i = cards.findIndex((c) => c.sourceId === id);
  if (i < 0) return correct ? cards : [...cards, createCard(id)];
  return cards.map((c, k) => (k === i ? reviewCard(c, correct) : c));
}

function bumpWrong(wrong: string[], id: string, correct: boolean): string[] {
  if (correct) return wrong.filter((w) => w !== id);
  return wrong.includes(id) ? wrong : [...wrong, id];
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      settings: null,
      stats: initialStats,
      studiedIds: [],
      clearedQuestionIds: [],
      clearedPracticalIds: [],
      reviewCards: [],
      quizHistory: [],
      wrongIds: [],
      mockAttempts: [],

      setSettings: (settings) => set({ settings }),
      setTrack: (track) =>
        set((s) => ({ settings: { ...(s.settings ?? { examDate: null }), track } })),
      setExamDate: (examDate) =>
        set((s) => ({ settings: { ...(s.settings ?? { track: "written" }), examDate } })),

      markStudied: (id) =>
        set((s) => {
          if (s.studiedIds.includes(id)) return s;
          return {
            studiedIds: [...s.studiedIds, id],
            reviewCards: s.reviewCards.some((c) => c.sourceId === id)
              ? s.reviewCards
              : [...s.reviewCards, createCard(id)],
            stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 10 }),
          };
        }),

      recordAnswer: (id, sourceId, correct) =>
        set((s) => ({
          clearedQuestionIds:
            correct && !s.clearedQuestionIds.includes(id)
              ? [...s.clearedQuestionIds, id]
              : s.clearedQuestionIds,
          reviewCards: applyReview(s.reviewCards, sourceId, correct),
          wrongIds: bumpWrong(s.wrongIds, sourceId, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + (correct ? 5 : 2) }),
        })),

      recordPractical: (id, sourceId, correct) =>
        set((s) => ({
          clearedPracticalIds:
            correct && !s.clearedPracticalIds.includes(id)
              ? [...s.clearedPracticalIds, id]
              : s.clearedPracticalIds,
          reviewCards: applyReview(s.reviewCards, sourceId, correct),
          wrongIds: bumpWrong(s.wrongIds, sourceId, correct),
          // 실기는 적어야 하므로 한 문항의 무게가 더 크다
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + (correct ? 8 : 3) }),
        })),

      reviewItem: (sourceId, correct) =>
        set((s) => ({
          reviewCards: applyReview(s.reviewCards, sourceId, correct),
          wrongIds: bumpWrong(s.wrongIds, sourceId, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 5 }),
        })),

      recordQuiz: (r) =>
        set((s) => ({
          quizHistory: [...s.quizHistory, r].slice(-60),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + r.correct * 2 }),
        })),

      recordMockAttempt: (attempt, wrongSourceIds) =>
        set((s) => {
          // 채점 뒤 되돌아가 다시 제출하면 같은 응시를 두 번 세면 안 된다
          const prev = s.mockAttempts.findIndex(
            (a) => a.track === attempt.track && a.startedAt === attempt.startedAt,
          );
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
                xp: s.stats.xp + attempt.score,
                studyMinutes: s.stats.studyMinutes + minutes,
              });
          return { mockAttempts, reviewCards, wrongIds, stats };
        }),

      addStudyMinutes: (min) =>
        set((s) => ({ stats: { ...s.stats, studyMinutes: s.stats.studyMinutes + min } })),

      resetAll: () =>
        set({
          settings: null,
          stats: initialStats,
          studiedIds: [],
          clearedQuestionIds: [],
          clearedPracticalIds: [],
          reviewCards: [],
          quizHistory: [],
          wrongIds: [],
          mockAttempts: [],
        }),
    }),
    {
      // ⚠️ name 을 바꾸면 이미 쓰고 있는 사람들의 기록을 찾지 못한다. 절대 바꾸지 말 것.
      //    version 도 두지 않는다 — 올리는 순간 zustand 가 저장본을 버릴 수 있다.
      //    스키마가 바뀌어도 아래 merge 가 흡수한다.
      name: "gisa-state",
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({
        settings: s.settings,
        stats: s.stats,
        studiedIds: s.studiedIds,
        clearedQuestionIds: s.clearedQuestionIds,
        clearedPracticalIds: s.clearedPracticalIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongIds: s.wrongIds,
        mockAttempts: s.mockAttempts,
      }),
      merge: (saved, current) => mergeSaved(current, saved),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn("[gisa] 저장된 기록을 불러오지 못했습니다", error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);

/** 지금 준비하는 것이 필기인가 실기인가 */
export function useTrack(): Track {
  return useApp((s) => s.settings?.track ?? "written");
}
