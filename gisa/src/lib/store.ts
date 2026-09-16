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
  /**
   * 개념을 처음 본 때.
   *
   * studiedIds 만으로는 "오늘 몇 개를 봤는가" 를 알 수 없다. 오늘 할 일이
   * 끝났는지 말해 주려면 날짜가 있어야 한다. 예전 기록에는 이 칸이 없으니
   * 비어 있는 것이 정상이다 — 없으면 오늘 본 것이 아닐 뿐이다.
   */
  studiedAt: Record<string, number>;
  /** 맞힌 적 있는 필기 문항 */
  clearedQuestionIds: string[];
  /** 맞힌 적 있는 실기 문항 */
  clearedPracticalIds: string[];
  /**
   * 문항마다 여태 몇 번 틀렸는가.
   *
   * 난이도는 문항에 붙어 있는 표가 아니라 사람마다 다르다. 누구에게 쉬운
   * 문항이 누구에게는 세 번째도 틀리는 문항이다. 지어낸 등급을 붙이는 대신
   * 실제로 틀린 횟수를 세어 "나에게 어려운 문항" 을 가려낸다.
   */
  questionMisses: Record<string, number>;
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
  recordMockAttempt: (
    a: MockAttempt,
    wrongSourceIds: string[],
    wrongQuestionIds?: string[],
  ) => void;
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
 * zustand 기본 병합은 한 겹만 본다. 나중에 stats 에 필드를 하나 더하면
 * 저장본이 초기값을 통째로 덮어 새 필드가 undefined 가 된다(= 화면에 NaN).
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

function applyReview(
  cards: ReviewCard[],
  id: string,
  correct: boolean,
): ReviewCard[] {
  const i = cards.findIndex((c) => c.sourceId === id);
  if (i < 0) return correct ? cards : [...cards, createCard(id)];
  return cards.map((c, k) => (k === i ? reviewCard(c, correct) : c));
}

function bumpWrong(wrong: string[], id: string, correct: boolean): string[] {
  if (correct) return wrong.filter((w) => w !== id);
  return wrong.includes(id) ? wrong : [...wrong, id];
}

/**
 * 문항별로 틀린 횟수를 센다.
 *
 * 맞혔다고 0 으로 되돌리지 않는다. 세 번 틀리고 한 번 맞힌 문항은 여전히
 * 나에게 어려운 문항이고, 시험장에서 또 틀릴 자리다. 지운 셈으로 치면
 * 그 자리가 안 보이게 된다.
 */
function bumpMiss(
  misses: Record<string, number>,
  id: string,
  correct: boolean,
): Record<string, number> {
  if (correct) return misses;
  return { ...misses, [id]: (misses[id] ?? 0) + 1 };
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      settings: null,
      stats: initialStats,
      studiedIds: [],
      studiedAt: {},
      questionMisses: {},
      clearedQuestionIds: [],
      clearedPracticalIds: [],
      reviewCards: [],
      quizHistory: [],
      wrongIds: [],
      mockAttempts: [],

      setSettings: (settings) => set({ settings }),
      setTrack: (track) =>
        set((s) => ({
          settings: { ...(s.settings ?? { examDate: null }), track },
        })),
      setExamDate: (examDate) =>
        set((s) => ({
          settings: { ...(s.settings ?? { track: "written" }), examDate },
        })),

      markStudied: (id) =>
        set((s) => {
          if (s.studiedIds.includes(id)) return s;
          return {
            studiedIds: [...s.studiedIds, id],
            studiedAt: { ...s.studiedAt, [id]: Date.now() },
            reviewCards: s.reviewCards.some((c) => c.sourceId === id)
              ? s.reviewCards
              : [...s.reviewCards, createCard(id)],
            stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 10 }),
          };
        }),

      recordAnswer: (id, sourceId, correct) =>
        set((s) => ({
          questionMisses: bumpMiss(s.questionMisses, id, correct),
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
          questionMisses: bumpMiss(s.questionMisses, id, correct),
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

      recordMockAttempt: (attempt, wrongSourceIds, wrongQuestionIds = []) =>
        set((s) => {
          // 채점 뒤 되돌아가 다시 제출하면 같은 응시를 두 번 세면 안 된다
          const prev = s.mockAttempts.findIndex(
            (a) =>
              a.track === attempt.track && a.startedAt === attempt.startedAt,
          );
          const again = prev >= 0;
          const mockAttempts = again
            ? s.mockAttempts.map((a, i) => (i === prev ? attempt : a))
            : [...s.mockAttempts, attempt].slice(-50);

          let reviewCards = s.reviewCards;
          let wrongIds = s.wrongIds;
          /*
           * 같은 응시를 다시 제출해도 틀린 횟수는 한 번만 센다. 채점 화면에서
           * 뒤로 갔다 다시 내면 틀린 횟수가 두 배가 되어 버린다.
           */
          let questionMisses = s.questionMisses;
          if (!again)
            for (const qid of wrongQuestionIds)
              questionMisses = bumpMiss(questionMisses, qid, false);
          for (const id of wrongSourceIds) {
            reviewCards = applyReview(reviewCards, id, false);
            wrongIds = bumpWrong(wrongIds, id, false);
          }
          const minutes = Math.round(
            (attempt.finishedAt - attempt.startedAt) / 60000,
          );
          const stats = again
            ? s.stats
            : bumpStreak({
                ...s.stats,
                xp: s.stats.xp + attempt.score,
                studyMinutes: s.stats.studyMinutes + minutes,
              });
          return { mockAttempts, reviewCards, wrongIds, questionMisses, stats };
        }),

      addStudyMinutes: (min) =>
        set((s) => ({
          stats: { ...s.stats, studyMinutes: s.stats.studyMinutes + min },
        })),

      resetAll: () =>
        set({
          settings: null,
          stats: initialStats,
          studiedIds: [],
          studiedAt: {},
          questionMisses: {},
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
        studiedAt: s.studiedAt,
        questionMisses: s.questionMisses,
        clearedQuestionIds: s.clearedQuestionIds,
        clearedPracticalIds: s.clearedPracticalIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongIds: s.wrongIds,
        mockAttempts: s.mockAttempts,
      }),
      merge: (saved, current) => mergeSaved(current, saved),
      onRehydrateStorage: () => (_state, error) => {
        if (error)
          console.warn("[gisa] 저장된 기록을 불러오지 못했습니다", error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);

/** 지금 준비하는 것이 필기인가 실기인가 */
export function useTrack(): Track {
  return useApp((s) => s.settings?.track ?? "written");
}
