import Link from "next/link";

/**
 * 없는 주소로 들어왔을 때.
 *
 * 만들어 두지 않으면 Next 가 자기 기본 화면을 내보내는데, 그것은 이 화면의
 * 테마를 타지 않는다. 어두운 바탕에 검은 글씨가 되어 대비 1.06:1 —
 * 사실상 아무것도 보이지 않는다. 다섯 앱은 이미 제 것을 두고 있었고,
 * 현관만 빠져 있었다(검사기가 잡아 주었다).
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center py-10 text-center">
      <p className="text-5xl font-bold tracking-tight text-zinc-500">404</p>
      <h1 className="mt-4 text-xl font-bold">그 주소에는 아무것도 없습니다</h1>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-zinc-400">
        여기는 다섯 앱으로 들어가는 문만 모아 둔 곳입니다. 아래로 돌아가
        무엇을 준비할지 고르세요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25"
      >
        고르러 가기
      </Link>
    </main>
  );
}
