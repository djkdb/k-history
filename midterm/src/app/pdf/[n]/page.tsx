import { COURSE } from "@/lib/course";
import { PdfView } from "./pdf-view";

export function generateStaticParams() {
  return (COURSE.pdfs ?? []).map((_, i) => ({ n: String(i + 1) }));
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  return <PdfView n={Number(n)} />;
}
