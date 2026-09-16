import { Suspense } from "react";
import { NoteView } from "./note-view";

export const metadata = { title: "오답 노트 · 정보처리기사" };

export default function Page() {
  return (
    <Suspense fallback={<main className="py-20" />}>
      <NoteView />
    </Suspense>
  );
}
