import { COURSE } from "@/lib/course";
import { ConceptView } from "./concept-view";

export function generateStaticParams() {
  return COURSE.concepts.map((c) => ({ id: c.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConceptView id={id} />;
}
