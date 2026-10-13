import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-16 text-center">
      <p className="text-[40px] font-black">404</p>
      <p className="mt-2 text-[14px] text-zinc-400">없는 화면입니다.</p>
      <Link href="/" className="mt-6 inline-block text-[14px] font-semibold text-indigo-300">
        홈으로
      </Link>
    </main>
  );
}
