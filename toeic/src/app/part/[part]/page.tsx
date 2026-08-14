import { PartPractice } from "./part-practice";

export function generateStaticParams() {
  return [{ part: "5" }, { part: "6" }, { part: "7" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const n = Number(part);
  return <PartPractice part={n === 6 ? 6 : n === 7 ? 7 : 5} />;
}
