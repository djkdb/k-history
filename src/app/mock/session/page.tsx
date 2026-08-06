import { Suspense } from "react";
import { MockSession } from "./mock-session";

// 등록된 기출 회차 수와 무관하게 항상 존재하는 정적 페이지.
// 어떤 회차를 풀지는 ?id= 로 받는다 — 회차가 0개여도 빌드가 깨지지 않는다.
export default function MockSessionPage() {
  return (
    <Suspense>
      <MockSession />
    </Suspense>
  );
}
