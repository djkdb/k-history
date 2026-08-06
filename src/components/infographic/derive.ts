import type { CompareSpec, HistoryEvent, Infographic, TimelineSpec } from "@/lib/types";
import { eventsByEra } from "@/data/events";
import { EVENT_INFOGRAPHICS } from "@/data/infographics";

/**
 * 전용 인포그래픽이 없는 개념도 글만 남지 않도록,
 * 기존 데이터에서 시각 자료를 자동으로 만들어 낸다.
 *
 *  1) 시대 연표 속 현재 위치 — 이 사건이 시대의 어디쯤인지 공간으로 기억한다
 *  2) 함정 비교 — traps를 좌우 대비 카드로 (시험에서 틀리는 지점이 곧 그림)
 */

/** 이 사건을 중심으로 앞뒤 사건을 잘라낸 시대 연표 */
export function deriveTimeline(event: HistoryEvent): TimelineSpec | null {
  const siblings = eventsByEra(event.era);
  if (siblings.length < 3) return null;

  const at = siblings.findIndex((e) => e.id === event.id);
  // 현재 사건이 가운데 오도록 최대 5개 창을 잡는다
  const start = Math.max(0, Math.min(at - 2, siblings.length - 5));
  const window = siblings.slice(start, start + 5);

  return {
    kind: "timeline",
    title: "시대 흐름 속 이 사건의 자리",
    items: window.map((e) => ({
      year: e.yearDisplay,
      label: e.title,
      highlight: e.id === event.id,
      note: e.id === event.id ? e.summary10s : undefined,
    })),
  };
}

/** traps 첫 항목을 좌우 비교 카드로 */
export function deriveTrapCompare(event: HistoryEvent): CompareSpec | null {
  const trap = event.traps[0];
  if (!trap) return null;

  return {
    kind: "compare",
    title: "가장 많이 헷갈리는 지점",
    left: {
      title: event.title,
      items: [event.yearDisplay, event.summary10s],
    },
    right: {
      title: trap.concept,
      items: [trap.difference],
    },
  };
}

/**
 * 화면에 보여줄 인포그래픽 목록.
 * 전용 자료가 있으면 그것을 먼저, 없으면 자동 생성분으로 채운다.
 */
export function infographicsFor(event: HistoryEvent): Infographic[] {
  const curated = event.infographics ?? EVENT_INFOGRAPHICS[event.id] ?? [];
  const derived: Infographic[] = [];

  const timeline = deriveTimeline(event);
  if (timeline) derived.push(timeline);

  // 전용 비교 자료가 이미 있으면 자동 비교는 생략 (중복 방지)
  if (!curated.some((g) => g.kind === "compare")) {
    const compare = deriveTrapCompare(event);
    if (compare) derived.push(compare);
  }

  return [...curated, ...derived];
}
