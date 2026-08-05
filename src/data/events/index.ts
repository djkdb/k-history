import type { EraId, HistoryEvent } from "@/lib/types";
import { PREHISTORIC_EVENTS } from "./prehistoric";
import { GOJOSEON_EVENTS } from "./gojoseon";
import { PROTO_THREE_EVENTS } from "./proto-three";
import { THREE_KINGDOMS_EVENTS } from "./three-kingdoms";
import { GAYA_EVENTS } from "./gaya";
import { NORTH_SOUTH_EVENTS } from "./north-south";
import { GORYEO_EVENTS } from "./goryeo";
import { JOSEON_EVENTS } from "./joseon";
import { OPEN_PORT_EVENTS } from "./open-port";
import { DAEHAN_EMPIRE_EVENTS } from "./daehan-empire";
import { COLONIAL_EVENTS } from "./colonial";
import { MODERN_EVENTS } from "./modern";

/** 전체 이벤트: 연대순 정렬 보장 */
export const ALL_EVENTS: HistoryEvent[] = [
  ...PREHISTORIC_EVENTS,
  ...GOJOSEON_EVENTS,
  ...PROTO_THREE_EVENTS,
  ...THREE_KINGDOMS_EVENTS,
  ...GAYA_EVENTS,
  ...NORTH_SOUTH_EVENTS,
  ...GORYEO_EVENTS,
  ...JOSEON_EVENTS,
  ...OPEN_PORT_EVENTS,
  ...DAEHAN_EMPIRE_EVENTS,
  ...COLONIAL_EVENTS,
  ...MODERN_EVENTS,
];

export const EVENT_MAP: Map<string, HistoryEvent> = new Map(
  ALL_EVENTS.map((e) => [e.id, e]),
);

export function getEvent(id: string): HistoryEvent | undefined {
  return EVENT_MAP.get(id);
}

export function eventsByEra(era: EraId): HistoryEvent[] {
  return ALL_EVENTS.filter((e) => e.era === era).sort((a, b) => a.year - b.year);
}

/** 검색: 제목/키워드/왕/인물/문화재/요약 대상 */
export function searchEvents(query: string): HistoryEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_EVENTS.filter((e) => {
    const haystack = [
      e.title,
      e.king ?? "",
      e.yearDisplay,
      e.summary10s,
      ...e.keywords,
      ...e.relatedFigures,
      ...e.relatedHeritage,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
