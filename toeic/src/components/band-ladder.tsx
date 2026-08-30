"use client";

import { Chip } from "@/components/ui";
import { BAND_LABEL } from "@/data/parts";
import { useApp, useBand } from "@/lib/store";
import { BANDS, type Band } from "@/lib/types";

/**
 * 점수대별로 몇 개가 있는지 보여 주는 줄.
 *
 * 어휘·문법은 목표 점수대로 걸러서 보여 준다. 600을 고른 사람에게 900점대
 * 낱말을 들이밀면 시간만 버리기 때문이다. 그런데 그 사람 화면에는
 * "245개" 만 찍히니, 이 앱이 가진 것이 그것뿐인 줄 알게 된다. 실제로는
 * 648개다.
 *
 * 그래서 사다리를 통째로 보여 준다. 지금 어디에 서 있는지, 위로 올리면
 * 무엇이 더 열리는지가 한눈에 보인다. 눌러서 바로 바꿀 수도 있다 —
 * 목표를 바꾸는 것은 무엇을 보여 줄지를 정할 뿐, 지금까지의 기록은
 * 그대로 남는다.
 */
export function BandLadder({
  countOf,
  unit = "개",
}: {
  /** 그 점수대까지 몇 개가 보이는가 */
  countOf: (band: Band) => number;
  unit?: string;
}) {
  const band = useBand();
  const setBand = useApp((s) => s.setBand);
  const total = countOf(900);
  const here = countOf(band);

  return (
    <div className="mt-3">
      {/*
        조사(를)가 숫자 바로 뒤에 붙어야 한다. JSX 는 줄바꿈을 공백으로
        바꾸므로 나눠 쓰면 "648개 를" 이 된다. 한 줄로 만든다.
      */}
      <p className="text-[12px] text-zinc-500">
        {`앱 전체 ${total}${unit} 가운데 지금 목표에서는 ${here}${unit}를 봅니다`}
      </p>
      <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {BANDS.map((b) => (
          <Chip key={b} active={b === band} onClick={() => setBand(b)}>
            {BAND_LABEL[b]} {countOf(b)}
          </Chip>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">
        눌러서 목표를 바꿀 수 있습니다. 지금까지 외운 것과 복습 기록은 그대로
        남습니다.
      </p>
    </div>
  );
}
