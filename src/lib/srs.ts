import type { ReviewCard } from "./types";

// 에빙하우스 망각곡선 복습 간격 (일): 당일 → 1일 → 3일 → 7일 → 14일 → 30일
export const REVIEW_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30];

const DAY_MS = 86_400_000;

export function createCard(eventId: string, now: number = Date.now()): ReviewCard {
  return {
    eventId,
    addedAt: now,
    lastReviewedAt: null,
    stage: 0,
    nextDueAt: now, // 학습 직후 즉시 복습 가능
    lapses: 0,
  };
}

export function reviewCard(
  card: ReviewCard,
  correct: boolean,
  now: number = Date.now(),
): ReviewCard {
  if (correct) {
    const stage = Math.min(card.stage + 1, REVIEW_INTERVALS_DAYS.length - 1);
    return {
      ...card,
      stage,
      lastReviewedAt: now,
      nextDueAt: now + REVIEW_INTERVALS_DAYS[stage] * DAY_MS,
    };
  }
  // 오답: 한 단계 후퇴, 12시간 뒤 재복습
  return {
    ...card,
    stage: Math.max(0, card.stage - 1),
    lastReviewedAt: now,
    lapses: card.lapses + 1,
    nextDueAt: now + DAY_MS / 2,
  };
}

export function dueCards(cards: ReviewCard[], now: number = Date.now()): ReviewCard[] {
  return cards
    .filter((c) => c.nextDueAt <= now)
    .sort((a, b) => a.nextDueAt - b.nextDueAt);
}

/**
 * 전체 암기율 추정 (0~1).
 * 각 카드의 기억 보존율 R = exp(-경과일 / S), S(안정도) = 현재 stage 간격일수 + 1
 */
export function retentionRate(cards: ReviewCard[], now: number = Date.now()): number {
  if (cards.length === 0) return 0;
  const sum = cards.reduce((acc, c) => {
    const since = c.lastReviewedAt ?? c.addedAt;
    const elapsedDays = Math.max(0, (now - since) / DAY_MS);
    const stability = REVIEW_INTERVALS_DAYS[c.stage] + 1;
    return acc + Math.exp(-elapsedDays / stability);
  }, 0);
  return sum / cards.length;
}

export function nextDueLabel(card: ReviewCard, now: number = Date.now()): string {
  const diff = card.nextDueAt - now;
  if (diff <= 0) return "지금";
  const hours = Math.round(diff / 3_600_000);
  if (hours < 24) return `${Math.max(1, hours)}시간 후`;
  const days = Math.round(diff / DAY_MS);
  if (days === 1) return "내일";
  return `${days}일 후`;
}
