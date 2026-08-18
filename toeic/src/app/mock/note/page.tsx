import { Suspense } from "react";
import { MockNote } from "./note-view";

export default function MockNotePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
          불러오는 중…
        </main>
      }
    >
      <MockNote />
    </Suspense>
  );
}
