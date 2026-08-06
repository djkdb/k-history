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

/**
 * 저장된 기록을 현재 초기값 위에 깊게 덮어쓴다.
 *
 * zustand 기본 병합은 한 겹만 본다. 그래서 나중에 stats 같은 중첩 객체에
 * 필드를 하나 더하면, 저장본의 stats가 초기값을 통째로 덮어 새 필드가
 * undefined가 된다(= 화면에 NaN이 뜬다).
 * 여기서 겹겹이 병합해 두면 필드를 더해도 기존 기록은 그대로 남고
 * 새 필드만 기본값으로 채워진다.
 *
 * 배열(학습한 개념·복습 카드 등)은 저장본을 그대로 쓴다 — 사용자의 기록이다.
 */
function mergeSaved<T>(base: T, saved: unknown): T {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return saved === undefined ? base : (saved as T);
  }
  if (!base || typeof base !== "object" || Array.isArray(base)) {
    return saved as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (v === undefined) continue;
    out[k] = mergeSaved((base as Record<string, unknown>)[k], v);
  }
  return out as T;
}

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
          // 기출에서 틀린 개념도 마찬가지로 복습 큐에 넣는다
          const graded = s.reviewCards.map((c) =>
            wrongIds.includes(c.eventId) ? gradeCard(c, false) : c,
          );
          const missing = wrongIds.filter(
            (id) => !s.reviewCards.some((c) => c.eventId === id),
          );
          const reviewCards = [
            ...graded,
            ...missing.map((id) => gradeCard(createCard(id), false)),
          ];
          // 채점 뒤 되돌아가 다시 풀고 제출하면 같은 응시를 두 번 세면 안 된다.
          // 시작 시각이 같으면 한 번의 응시이므로 마지막 채점 결과로 덮어쓴다.
          const prev = s.mockAttempts.findIndex(
            (a) => a.examId === attempt.examId && a.startedAt === attempt.startedAt,
          );
          const again = prev >= 0;
          const mockAttempts = again
            ? s.mockAttempts.map((a, i) => (i === prev ? attempt : a))
            : [...s.mockAttempts, attempt].slice(-50);

          const minutes = Math.round(
            (attempt.finishedAt - attempt.startedAt) / 60000,
          );
          // 재채점에는 완주 보상과 학습 시간을 다시 주지 않는다
          const stats = again
            ? s.stats
            : bumpStreak({
                ...s.stats,
                xp: s.stats.xp + 50, // 모의고사 1회 완주 보상
                totalStudyMinutes:
                  s.stats.totalStudyMinutes + Math.max(0, minutes),
              });
          const next = {
            ...s,
            mockAttempts,
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
          // 틀린 개념은 복습 큐에 반드시 들어가야 한다.
          // 결과 화면이 "복습 큐에 자동 반영했습니다"라고 약속하는데,
          // 개념 화면을 거치지 않고 퀴즈부터 푼 사람에게는 카드가 없어
          // 아무 일도 일어나지 않고 있었다.
          const hasCard = s.reviewCards.some((c) => c.eventId === r.eventId);
          const reviewCards = hasCard
            ? s.reviewCards.map((c) =>
                c.eventId === r.eventId ? gradeCard(c, r.correct) : c,
              )
            : r.correct
              ? s.reviewCards // 맞힌 것까지 큐에 넣으면 학습하지도 않은 개념이 쌓인다
              : [...s.reviewCards, gradeCard(createCard(r.eventId), false)];
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
      // ⚠️ name을 바꾸면 이미 쓰고 있는 사람들의 기록을 찾지 못한다. 절대 바꾸지 말 것.
      //    version도 두지 않는다 — 값을 올리는 순간 zustand가 저장본을 버릴 수 있다.
      //    스키마가 바뀌어도 아래 merge가 흡수한다. (scripts/audit-storage.ts 가 감시)
      name: "khlm-state",
      storage: createJSONStorage(() => idbStorage),
      merge: (persisted, current) => mergeSaved(current, persisted),
      partialize: (s) => ({
        exam: s.exam,
        stats: s.stats,
        studiedEventIds: s.studiedEventIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongEventIds: s.wrongEventIds,
        mockAttempts: s.mockAttempts,
      }),
      // 불러오기에 실패해도 화면은 떠야 한다. 다만 그때는 빈 상태를 저장하지 않는다
      // — 잘못 덮어써서 기록을 지우는 것이 최악이다.
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn("[khlm] 저장된 기록을 불러오지 못했습니다", error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);
