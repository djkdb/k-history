import { COURSE } from "@/lib/course";
import { ChapterView } from "./chapter-view";

export function generateStaticParams() {
  return COURSE.chapters.map((c) => ({ ch: c.id }));
}

export default async function Page({ params }: { params: Promise<{ ch: string }> }) {
  const { ch } = await params;
  return <ChapterView id={ch} />;
}
