import { SUBJECTS } from "@/data/exam";
import { SubjectDetail } from "./subject-detail";

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  return <SubjectDetail subject={subject} />;
}
