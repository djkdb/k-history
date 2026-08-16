import { CONCEPTS } from "@/data/concepts";
import { ConceptDetail } from "./concept-detail";

// 정적 익스포트: 개념 페이지를 빌드 시점에 모두 만들어 둔다
export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ id: c.id }));
}

export default function ConceptPage() {
  return <ConceptDetail />;
}
