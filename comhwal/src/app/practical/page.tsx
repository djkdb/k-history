"use client";

import Link from "next/link";
import { ArrowRight, Keyboard, Sigma, Timer } from "lucide-react";
import { useApp, useGrade } from "@/lib/store";
import { formulasFor, formulaTopics } from "@/data/formulas";
import { shortcutsFor } from "@/data/shortcuts";
import { Card, ProgressBar, SectionTitle } from "@/components/ui";

export default function PracticalPage() {
  const grade = useGrade();
  const clearedFormulaIds = useApp((s) => s.clearedFormulaIds);
  const clearedShortcutIds = useApp((s) => s.clearedShortcutIds);
  const attempts = useApp((s) => s.mockAttempts);
  const lastMock = [...attempts]
    .reverse()
    .find((a) => a.examId.endsWith("-practical"));

  const formulas = formulasFor(grade);
  const shortcuts = shortcutsFor(grade);
  const fDone = formulas.filter((f) => clearedFormulaIds.includes(f.id)).length;
  const sDone = shortcuts.filter((s) => clearedShortcutIds.includes(s.id)).length;

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold tracking-tight">실기 훈련</h1>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        실기는 엑셀을 직접 다루는 시험이라 앱이 그대로 재현할 수는 없습니다.
        대신 실기에서 실제로 손이 멈추는 두 지점만 떼어 내 반복합니다.
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        <Link href="/practical/formula">
          <Card className="transition-transform active:scale-[0.99]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-400">
                  <Sigma size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold">함수 수식 채점</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
                    조건을 읽고 수식을 직접 칩니다. 공백과 대소문자는 봐주지만
                    $와 인수 순서는 그대로 채점합니다.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 text-zinc-500" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
              <span>{formulaTopics(grade).join(" · ")}</span>
              <span className="font-bold text-emerald-400">
                {fDone} / {formulas.length}
              </span>
            </div>
            <ProgressBar
              value={fDone}
              max={formulas.length}
              color="#10b981"
              className="mt-2"
            />
          </Card>
        </Link>

        <Link href="/practical/shortcut">
          <Card className="transition-transform active:scale-[0.99]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-amber-400">
                  <Keyboard size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold">단축키 훈련</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
                    설명을 보고 실제로 키를 눌러 맞힙니다. 브라우저가 가로채는
                    조합만 보기에서 고릅니다.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 text-zinc-500" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
              <span>엑셀 · {grade === 1 ? "액세스 · " : ""}Windows</span>
              <span className="font-bold text-amber-400">
                {sDone} / {shortcuts.length}
              </span>
            </div>
            <ProgressBar
              value={sDone}
              max={shortcuts.length}
              color="#f59e0b"
              className="mt-2"
            />
          </Card>
        </Link>
      </div>

      <SectionTitle>시험처럼 몰아서</SectionTitle>
      <Link href="/practical/mock">
        <Card className="transition-transform active:scale-[0.99]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-indigo-300">
                <Timer size={20} />
              </span>
              <div>
                <p className="text-sm font-bold">실기 모의고사</p>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
                  수식 20문항과 단축키 10개를 {grade === 1 ? 45 : 30}분 안에
                  풉니다. 중간에 정답을 볼 수 없고, 제출해야 채점됩니다.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="mt-1 shrink-0 text-zinc-500" />
          </div>
          {lastMock && (
            <p className="mt-3 text-[11px] text-zinc-500">
              지난 응시 {Math.round((lastMock.score / lastMock.total) * 100)}점 ·{" "}
              {new Date(lastMock.startedAt).toLocaleDateString("ko-KR")}
            </p>
          )}
        </Card>
      </Link>

      <SectionTitle>알아 두면 좋은 것</SectionTitle>
      <Card>
        <p className="text-[13px] leading-relaxed text-zinc-400">
          대한상공회의소는 컴활 기출문제를 공개하지 않고, 시중 교재의 문제를
          옮겨 오는 것은 저작권 침해입니다. 그래서 이 앱의 문제는 공개된 출제기준과
          함수·기능 명세만을 근거로 AI 가 새로 쓴 것입니다. 실제 시험지를 옮겨 온
          것이 아니므로 문항 번호나 회차를 적지 않습니다.
        </p>
      </Card>
    </div>
  );
}
