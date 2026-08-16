import { SUBJECTS } from "@/data/exam";
import { SubjectDetail } from "./subject-detail";

// 정적 익스포트: 과목 페이지를 빌드 시점에 모두 만들어 둔다
export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.id }));
}

export default function SubjectPage() {
  return <SubjectDetail />;
}
