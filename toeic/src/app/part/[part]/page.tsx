import { ListenPractice } from "./listen-practice";
import { PartPractice } from "./part-practice";

export function generateStaticParams() {
  return [
    { part: "1" },
    { part: "2" },
    { part: "3" },
    { part: "4" },
    { part: "5" },
    { part: "6" },
    { part: "7" },
  ];
}

export default async function Page({ params }: { params: Promise<{ part: string }> }) {
  const { part } = await params;
  const n = Number(part);
  if (n >= 1 && n <= 4) {
    return <ListenPractice part={n as 1 | 2 | 3 | 4} />;
  }
  return <PartPractice part={n === 6 ? 6 : n === 7 ? 7 : 5} />;
}
