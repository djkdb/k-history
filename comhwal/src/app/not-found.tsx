import Link from "next/link";
import { Button, Card } from "@/components/ui";

/**
 * 없는 주소로 들어왔을 때.
 *
 * 만들어 두지 않으면 Next 가 자기 기본 화면을 내보내는데, 그것은 이 앱의
 * 테마를 타지 않는다. 어두운 화면에서는 검은 바탕에 검은 글씨가 되어
 * 대비 1.06:1 — 사실상 아무것도 보이지 않는다. 픽셀로 재 보고 알았다.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center py-10 text-center">
      <p className="text-5xl font-bold tracking-tight text-zinc-500">404</p>
      <h1 className="mt-4 text-xl font-bold">그 주소에는 아무것도 없습니다</h1>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-zinc-400">
        주소가 바뀌었거나 없는 곳을 가리키고 있습니다. 아래에서 다시 시작하세요.
      </p>

      <Card className="mt-6 w-full max-w-xs">
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button size="lg" className="w-full">
              홈으로
            </Button>
          </Link>
          <Link href="/learn">
            <Button size="lg" variant="outline" className="w-full">
              학습 목록 보기
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
