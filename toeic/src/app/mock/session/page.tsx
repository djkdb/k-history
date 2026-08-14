import { Suspense } from "react";
import { MockSession } from "./mock-session";

export default function Page() {
  return (
    <Suspense
      fallback={<main className="py-20 text-center text-sm text-zinc-500">불러오는 중…</main>}
    >
      <MockSession />
    </Suspense>
  );
}
