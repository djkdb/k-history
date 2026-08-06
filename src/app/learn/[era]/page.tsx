import { ERAS } from "@/data/eras";
import { EraDetail } from "./era-detail";

// 정적 익스포트: 12개 시대 페이지를 빌드 시점에 생성
export function generateStaticParams() {
  return ERAS.map((era) => ({ era: era.id }));
}

export default function EraDetailPage() {
  return <EraDetail />;
}
