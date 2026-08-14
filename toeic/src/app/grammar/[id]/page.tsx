import { GRAMMAR } from "@/data/grammar";
import { GrammarDetail } from "./grammar-detail";

export function generateStaticParams() {
  return GRAMMAR.map((g) => ({ id: g.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GrammarDetail id={id} />;
}
