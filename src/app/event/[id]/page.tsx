import { ALL_EVENTS } from "@/data/events";
import { EventDetail } from "./event-detail";

// 정적 익스포트: 모든 개념 페이지를 빌드 시점에 생성 (Cloudflare 정적 호스팅용)
export function generateStaticParams() {
  return ALL_EVENTS.map((e) => ({ id: e.id }));
}

export default function EventDetailPage() {
  return <EventDetail />;
}
