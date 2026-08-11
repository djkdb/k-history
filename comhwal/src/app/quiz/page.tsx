import { Suspense } from "react";
import { QuizScreen } from "./quiz-screen";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
          불러오는 중…
        </div>
      }
    >
      <QuizScreen />
    </Suspense>
  );
}
