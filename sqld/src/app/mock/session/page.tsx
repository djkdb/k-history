import { Suspense } from "react";
import { MockSession } from "./mock-session";

export default function MockSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
          시험지를 준비하는 중…
        </div>
      }
    >
      <MockSession />
    </Suspense>
  );
}
