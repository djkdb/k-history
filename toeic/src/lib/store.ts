import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Band,
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
  /** 외운 것으로 표시한 어휘 id */
  knownVocabIds: string[];
  /** 공부를 마친 문법 포인트 id */
  studiedGrammarIds: string[];
  /** 맞힌 적 있는 문항 id */
  clearedQuestionIds: string[];
  reviewCards: ReviewCard[];
  quizHistory: QuizResult[];
  /** 틀린 것 (최근 순) */
  wrongIds: string[];
  mockAttempts: MockAttempt[];

  setSettings: (s: Settings) => void;
  setBand: (b: Band) => void;
  setSpeechRate: (r: number) => void;
  setShowScript: (v: boolean) => void;
  setNoise: (kind: NonNullable<Settings["noise"]>, level: number) => void;
  markVocabKnown: (id: string) => void;
  unmarkVocabKnown: (id: string) => void;
  markGrammarStudied: (id: string) => void;
  recordAnswer: (id: string, correct: boolean) => void;
  reviewItem: (id: string, correct: boolean) => void;
  recordMockAttempt: (attempt: MockAttempt, wrongIds: string[]) => void;
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
      knownVocabIds: [],
      studiedGrammarIds: [],
      clearedQuestionIds: [],
      reviewCards: [],
      quizHistory: [],
      wrongIds: [],
      mockAttempts: [],

      setSettings: (settings) => set({ settings }),

      setBand: (band) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, band }
            : { band, examDate: null, speechRate: 1, showScript: false },
        })),

      setSpeechRate: (speechRate) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, speechRate }
            : { band: 700, examDate: null, speechRate, showScript: false },
        })),

      setNoise: (noise, noiseLevel) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, noise, noiseLevel }
            : { band: 700, examDate: null, speechRate: 1, showScript: false, noise, noiseLevel },
        })),

      setShowScript: (showScript) =>
        set((s) => ({
          settings: s.settings
            ? { ...s.settings, showScript }
            : { band: 700, examDate: null, speechRate: 1, showScript },
        })),

      markVocabKnown: (id) =>
        set((s) => {
          if (s.knownVocabIds.includes(id)) return s;
          return {
            knownVocabIds: [...s.knownVocabIds, id],
            reviewCards: s.reviewCards.some((c) => c.sourceId === id)
              ? s.reviewCards
              : [...s.reviewCards, createCard(id)],
            stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 8 }),
          };
        }),

      // 외운 표시를 되돌린다. 복습 카드는 남긴다 — 한 번 본 것은 계속 물어봐야 한다.
      unmarkVocabKnown: (id) =>
        set((s) => ({ knownVocabIds: s.knownVocabIds.filter((x) => x !== id) })),

      markGrammarStudied: (id) =>
        set((s) => {
          if (s.studiedGrammarIds.includes(id)) return s;
          return {
            studiedGrammarIds: [...s.studiedGrammarIds, id],
            reviewCards: s.reviewCards.some((c) => c.sourceId === id)
              ? s.reviewCards
              : [...s.reviewCards, createCard(id)],
            stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 20 }),
          };
        }),

      recordAnswer: (id, correct) =>
        set((s) => ({
          quizHistory: [...s.quizHistory, { sourceId: id, correct, at: Date.now() }].slice(-500),
          clearedQuestionIds:
            correct && !s.clearedQuestionIds.includes(id)
              ? [...s.clearedQuestionIds, id]
              : s.clearedQuestionIds,
          wrongIds: bumpWrong(s.wrongIds, id, correct),
          reviewCards: applyReview(s.reviewCards, id, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + (correct ? 10 : 2) }),
        })),

      reviewItem: (id, correct) =>
        set((s) => ({
          reviewCards: applyReview(s.reviewCards, id, correct),
          wrongIds: bumpWrong(s.wrongIds, id, correct),
          stats: bumpStreak({ ...s.stats, xp: s.stats.xp + 5 }),
        })),

      recordMockAttempt: (attempt, wrongSourceIds) =>
        set((s) => {
          // 채점 뒤 되돌아가 다시 제출하면 같은 응시를 두 번 세면 안 된다.
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

      addStudyMinutes: (min) =>
        set((s) => ({
          stats: { ...s.stats, studyMinutes: s.stats.studyMinutes + min },
        })),

      resetAll: () =>
        set({
          settings: null,
          stats: initialStats,
          knownVocabIds: [],
          studiedGrammarIds: [],
          clearedQuestionIds: [],
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
      name: "toeic-state",
      storage: createJSONStorage(() => idbStorage),
      merge: (persisted, current) => mergeSaved(current, persisted),
      partialize: (s) => ({
        settings: s.settings,
        stats: s.stats,
        knownVocabIds: s.knownVocabIds,
        studiedGrammarIds: s.studiedGrammarIds,
        clearedQuestionIds: s.clearedQuestionIds,
        reviewCards: s.reviewCards,
        quizHistory: s.quizHistory,
        wrongIds: s.wrongIds,
        mockAttempts: s.mockAttempts,
      }),
      // 불러오기에 실패해도 화면은 떠야 한다. 다만 그때 빈 상태를 저장하지는 않는다.
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn("[toeic] 저장된 기록을 불러오지 못했습니다", error);
        useApp.setState({ hydrated: true });
      },
    },
  ),
);

/** 지금 목표로 둔 점수대 — 설정 전에는 700 으로 본다 */
export function useBand(): Band {
  return useApp((s) => s.settings?.band ?? 700);
}
