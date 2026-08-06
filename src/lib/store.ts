import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ExamSettings,
  MockExamAttempt,
  QuizResult,
  ReviewCard,
  StudyStats,
} from "./types";
import { createCard, reviewCard as gradeCard } from "./srs";
import { idbStorage } from "./idb-storage";
import { todayISO } from "./utils";

export interface AppState {
  hydrated: boolean;
  exam: ExamSettings | null;
  stats: StudyStats;
  studiedEventIds: string[];
  reviewCards: ReviewCard[];
  quizHistory: QuizResult[];
  wrongEventIds: string[];
  mockAttempts: MockExamAttempt[];
  setExam: (exam: ExamSettings) => void;
  recordMockAttempt: (attempt: MockExamAttempt, wrongEventIds: string[]) => void;
  markStudied: (eventId: string) => void;
  recordQuizResult: (r: QuizResult) => void;
  reviewEvent: (eventId: string, correct: boolean) => void;
  addStudyMinutes: (min: number) => void;
  resetAll: () => void;
}

const initialStats: StudyStats = {
  streak: 0,
  lastStudyDate: null,
  xp: 0,
  totalStudyMinutes: 0,
  badges: [],
};

/** 오늘 첫 활동 기준으로 스트릭 갱신 */
function bumpStreak(stats: StudyStats): StudyStats {
  const today = todayISO();
  if (stats.lastStudyDate === today) return stats;
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  })();
  const streak = stats.lastStudyDate === yesterday ? stats.streak + 1 : 1;
  return { ...stats, streak, lastStudyDate: today };
}

/** 조건 충족 배지 부여 */
function grantBadges(state: {
  stats: StudyStats;
  studiedEventIds: string[];
  quizHistory: QuizResult[];
}): string[] {
  const earned = new Set(state.stats.badges);
  if (state.stats.streak >= 3) earned.add("streak-3");
  if (state.stats.streak >= 7) earned.add("streak-7");
  if (state.studiedEventIds.length >= 50) earned.add("scholar-50");
  if (state.quizHistory.filter((q) => q.correct).length >= 100)
    earned.add("quiz-100");
  return [...earned];
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      exam: null,
      stats: initialStats,
      studiedEventIds: [],
      reviewCards: [],
      quizHistory: [],
      wrongEventIds: [],
      mockAttempts: [],

      setExam: (exam) => set({ exam }),

      recordMockAttempt: (attempt, wrongIds) =>
        set((s) => {
          // 틀린 문항이 다루던 개념을 오답노트와 복습 큐에 반영한다
          const wrongEventIds = [
            ...wrongIds,
            ...s.wrongEventIds.filter((id) => !wrongIds.includes(id)),
          ];
          const reviewCards = s.reviewCards.map((c) =>
            wrongIds.includes(c.eventId) ? gradeCard(c, false) : c,
          );
          const minutes = Math.round(
            (attempt.finishedAt - attempt.startedAt) / 60000,
          );
          const stats = bumpStreak({
            ...s.stats,
            xp: s.stats.xp + 50, // 모의고사 1회 완주 보상
            totalStudyMinutes: s.stats.totalStudyMinutes + Math.max(0, minutes),
          });
          const next = {
            ...s,
            mockAttempts: [...s.mockAttempts, attempt].slice(-50),
            wrongEventIds,
            reviewCards,
            stats,
          };
          return { ...next, stats: { ...stats, badges: grantBadges(next) } };
        }),

      markStudied: (eventId) =>
        set((s) => {
          if (s.studiedEventIds.includes(eventId)) return s;
          const studiedEventIds = [...s.studiedEventIds, eventId];
          const reviewCards = s.reviewCards.some((c) => c.eventId === eventId)
            ? s.reviewCards
            : [...s.reviewCards, createCard(eventId)];
          const stats = bumpStreak({ ...s.stats, xp: s.stats.xp + 20 });
          const next = { ...s, studiedEventIds, reviewCards, stats };
          return { ...next, stats: { ...stats, badges: grantBadges(next) } };
        }),

      recordQuizResult: (r) =>
        set((s) => {
          const quizHistory = [...s.quizHistory, r].slice(-500);
          let wrongEventIds = s.wrongEventIds;
          if (!r.correct) {
            wrongEventIds = [
              r.eventId,
              ...wrongEventIds.filter((id) => id !== r.eventId),
            ];
          } else if (wrongEventIds.includes(r.eventId)) {
            wrongEventIds = wrongEventIds.filter((id) => id !== r.eventId);
          }
          const reviewCards = s.reviewCards.map((c) =>
            c.eventId === r.eventId ? gradeCard(c, r.correct) : c,
          );
          const stats = bumpStreak({
            ...s.stats,
            xp: s.stats.xp + (r.correct ? 10 : 2),
          });
          const next = { ...s, quizHistory, wrongEventIds, reviewCards, stats };
          return { ...next, stats: { ...stats, badges: grantBadges(next) } };
        }),

      reviewEvent: (eventId, correct) =>
        set((s) => {
          const existing = s.reviewCards.find((c) => c.eventId === eventId);
          const reviewCards = existing
            ? s.reviewCards.map((c) =>
                c.eventId === eventId ? gradeCard(c, correct) : c,
              )
            : [...s.reviewCards, gradeCard(createCard(eventId), correct)];
          const stats = bumpStreak({ ...s.stats, xp: s.stats.xp + 5 });
          const next = { ...s, reviewCards, stats };
          return { ...next, stats: { ...stats, badges: grantBadges(next) } };
        }),

      addStudyMinutes: (min) =>
        set((s) => ({
          stats: {
            ...s.stats,
            totalStudyMinutes: s.stats.totalStudyMinutes + min,
          },
        })),

      resetAll: () =>
        set({
          exam: null,
          stats: initialStats,
          studiedEventIds: [],
          reviewCards: [],
          quizHistory: [],
          wrongEventIds: [],
          mockAttempts: [],
        }),
    }),
    {
      name: "khlm-state",
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({
        exam: s.exam,
        stats: s.stats,
        studiedEventIds: s.studiedEventIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongEventIds: s.wrongEventIds,
        mockAttempts: s.mockAttempts,
      }),
      onRehydrateStorage: () => () => {
        useApp.setState({ hydrated: true });
      },
    },
  ),
);
