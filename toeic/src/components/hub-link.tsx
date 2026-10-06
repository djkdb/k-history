import { LayoutGrid } from "lucide-react";
import { BASE } from "@/lib/base";

/**
 * 다섯 자격증이 모인 첫 화면으로 돌아가는 길.
 *
 * 한 주소에 다섯 앱을 묶은 판(하위 경로에 사는 판)에서만 보인다. 혼자
 * 배포된 판에는 돌아갈 첫 화면이 없다.
 *
 * ⚠️ next/link 를 쓰면 앞에 이 앱의 하위 경로가 붙어 "/history/" 로 간다.
 *    이 앱 밖으로 나가는 길이라 보통 <a> 로 둔다. 홈 화면에 얹어 쓰면
 *    뒤로 가기 단추가 없으니, 이 길이 유일한 출구다.
 */
export function HubLink({ className = "" }: { className?: string }) {
  if (!BASE) return null;
  return (
    <a
      href="/"
      className={`inline-flex min-h-8 items-center gap-1.5 self-start rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] font-semibold text-zinc-300 transition-colors hover:bg-white/10 ${className}`}
    >
      <LayoutGrid size={13} aria-hidden />
      자격증 5종 홈
    </a>
  );
}
