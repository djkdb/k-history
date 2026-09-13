import { CONCEPTS } from "@/data/concepts";
import { ConceptDetail } from "./concept-detail";

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ id: c.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConceptDetail id={id} />;
}
