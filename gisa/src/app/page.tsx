import Link from "next/link";
import { FileText, PenLine } from "lucide-react";
import { Card } from "@/components/ui";
import { PRACTICAL, SUBJECTS, WRITTEN } from "@/data/exam";

export default function Home() {
  return (
    <main className="py-6">
      <h1 className="text-2xl font-bold tracking-tight">정보처리기사</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        필기와 실기는 공부하는 방법이 다릅니다. 필기는 다섯 과목을 과락 없이
        넘겨야 하고, 실기는 고르는 것이 아니라 손으로 적습니다.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Card>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-indigo-300" />
            <p className="text-[15px] font-bold">필기</p>
          </div>
          <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
            {`다섯 과목 ${WRITTEN.totalQuestions}문항 ${WRITTEN.minutes}분. 과목마다 40점을 넘겨야 하고 평균 ${WRITTEN.passScore}점이면 합격입니다. 한 과목이라도 40점에 못 미치면 평균과 무관하게 떨어집니다.`}
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {SUBJECTS.map((s) => (
              <div key={s.id} className="flex items-baseline gap-2 text-[12px]">
                <span className="shrink-0">{s.symbol}</span>
                <span className="shrink-0 font-bold text-zinc-200">{s.name}</span>
                <span className="min-w-0 flex-1 truncate text-zinc-500">{s.blurb}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <PenLine size={18} className="text-emerald-300" />
            <p className="text-[15px] font-bold">실기</p>
          </div>
          <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
            {`필답형 ${PRACTICAL.minutes}분, ${PRACTICAL.passScore}점 이상이면 합격입니다. 과락은 없습니다. 용어를 적고, 코드를 읽어 출력을 적고, SQL 을 씁니다.`}
          </p>
          <Link
            href="/practical"
            className="-my-2 mt-2 inline-block py-2 text-[12px] text-emerald-300"
          >
            실기 보러 가기 →
          </Link>
        </Card>
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-zinc-600">
        이 앱의 문항은 공개된 출제 범위에 맞춰 새로 쓴 것입니다. 한국산업인력공단은
        정보처리기사 기출문제를 공개하지 않으며, 시중 복원본을 옮기는 것은 저작권
        문제가 있어 쓰지 않았습니다.
      </p>
    </main>
  );
}
