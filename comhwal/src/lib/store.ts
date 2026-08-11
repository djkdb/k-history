import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Grade,
  MockAttempt,
  QuizResult,
  ReviewCard,
  Settings,
  Stats,
} from "./types";
import { createCard, reviewCard as gradeCard } from "./srs";
import { idbStorage } from "./idb-storage";
import { todayISO } from "./utils";

export interface AppState {
  hydrated: boolean;
  settings: Settings | null;
  stats: Stats;
  /** 공부를 마친 개념 id */
  studiedIds: string[];
  reviewCards: ReviewCard[];
  quizHistory: QuizResult[];
  /** 틀린 개념·수식·단축키 id (최근 순) */
  wrongIds: string[];
  /** 실기에서 맞힌 적 있는 수식 id */
  clearedFormulaIds: string[];
  /** 눌러서 맞힌 적 있는 단축키 id */
  clearedShortcutIds: string[];
  mockAttempts: MockAttempt[];

  setSettings: (s: Settings) => void;
  setGrade: (g: Grade) => void;
  markStudied: (id: string) => void;
  recordQuizResult: (r: QuizResult) => void;
  recordPractice: (
    kind: "formula" | "shortcut",
    id: string,
    correct: boolean,
  ) => void;
  reviewItem: (id: string, correct: boolean) => void;
  recordMockAttempt: (attempt: MockAttempt, wrongSourceIds: string[]) => void;
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
 * zustand 기본 병합은 한 겹만 본다. 나중에 stats에 필드를 하나 더하면
 * 저장본이 초기값을 통째로 덮어 새 필드가 undefined가 된다(= 화면에 NaN).
 * 겹겹이 병합해 두면 필드를 더해도 기존 기록은 그대로 남는다.
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

function bumpStreak(stats: Stats): Stats {
  const today = todayISO();
  if (stats.lastStudyDate === today) return stats;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = todayISO(d);
  const streak = stats.lastStudyDate === yesterday ? stats.streak + 1 : 1;
  return { ...stats, streak, lastStudyDate: today };
}

/** 틀린 목록 맨 앞으로 올리고, 맞히면 빼낸다 */
function bumpWrong(list: string[], id: string, correct: boolean): string[] {
  if (correct) return list.filter((x) => x !== id);
  return [id, ...list.filter((x) => x !== id)];
}

/** 복습 카드에 채점 결과를 반영한다 (없으면 틀렸을 때만 새로 만든다) */
function applyReview(
  cards: ReviewCard[],
  id: string,
  correct: boolean,
): ReviewCard[] {
  const has = cards.some((c) => c.sourceId === id);
  if (has) {
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
      reviewCards: [],
      quizHistory: [],
      wrongIds: [],
      clearedFormulaIds: [],
      clearedShortcutIds: [],
      mockAttempts: [],

      setSettings: (settings) => set({ settings }),

      setGrade: (grade) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, grade }
            : { grade, kind: "written", examDate: null },
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
          stats: bumpStreak({
            ...s.stats,
            xp: s.stats.xp + (r.correct ? 10 : 2),
          }),
        })),

      recordPractice: (kind, id, correct) =>
        set((s) => {
          const key =
            kind === "formula" ? "clearedFormulaIds" : "clearedShortcutIds";
          const cleared = s[key];
          return {
            [key]:
              correct && !cleared.includes(id) ? [...cleared, id] : cleared,
            wrongIds: bumpWrong(s.wrongIds, id, correct),
            reviewCards: applyReview(s.reviewCards, id, correct),
            stats: bumpStreak({
              ...s.stats,
              // 실기는 손으로 치는 만큼 보상을 조금 더 준다
              xp: s.stats.xp + (correct ? 15 : 3),
            }),
          } as Partial<AppState>;
        }),

      reviewItem: (id, correct) =>
        set((s) => ({
          reviewCards: applyReview(s.reviewCards, id, correct),
          wrongIds: bumpWrong(s.wrongIds, id, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 5 }),
        })),

      recordMockAttempt: (attempt, wrongSourceIds) =>
        set((s) => {
          // 채점 뒤 되돌아가 다시 제출하면 같은 응시를 두 번 세면 안 된다.
          // 시작 시각이 같으면 한 번의 응시이므로 마지막 결과로 덮어쓴다.
          const prev = s.mockAttempts.findIndex(
            (a) => a.examId === attempt.examId && a.startedAt === attempt.startedAt,
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

          const minutes = Math.round(
            (attempt.finishedAt - attempt.startedAt) / 60000,
          );
          const stats = again
            ? s.stats
            : bumpStreak({
                ...s.stats,
                xp: s.stats.xp + 50,
                studyMinutes: s.stats.studyMinutes + Math.max(0, minutes),
              });

          return { mockAttempts, reviewCards, wrongIds, stats };
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
          reviewCards: [],
          quizHistory: [],
          wrongIds: [],
          clearedFormulaIds: [],
          clearedShortcutIds: [],
          mockAttempts: [],
        }),
    }),
    {
      // ⚠️ name을 바꾸면 이미 쓰고 있는 사람들의 기록을 찾지 못한다. 절대 바꾸지 말 것.
      //    version도 두지 않는다 — 올리는 순간 zustand가 저장본을 버릴 수 있다.
      //    스키마가 바뀌어도 아래 merge가 흡수한다. (scripts/audit.ts 가 감시)
      name: "comhwal-state",
      storage: createJSONStorage(() => idbStorage),
      merge: (persisted, current) => mergeSaved(current, persisted),
      partialize: (s) => ({
        settings: s.settings,
        stats: s.stats,
        studiedIds: s.studiedIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongIds: s.wrongIds,
        clearedFormulaIds: s.clearedFormulaIds,
        clearedShortcutIds: s.clearedShortcutIds,
        mockAttempts: s.mockAttempts,
      }),
      // 불러오기에 실패해도 화면은 떠야 한다. 다만 그때 빈 상태를 저장하지는 않는다.
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn("[comhwal] 저장된 기록을 불러오지 못했습니다", error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);

/** 지금 준비 중인 급수 — 설정 전에는 2급으로 본다 */
export function useGrade(): Grade {
  return useApp((s) => s.settings?.grade ?? 2);
}
