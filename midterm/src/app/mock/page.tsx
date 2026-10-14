"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Play } from "lucide-react";
import { Gate } from "@/components/gate";
import { Button, Card, Chip, SectionTitle } from "@/components/ui";
import { COURSE } from "@/lib/course";
import { newMock, readMock } from "@/lib/mock";
import { HAS_PDF, QSET_LABEL, inSet, useQSet, type QSet } from "@/lib/qset";
import { useApp } from "@/lib/store";

export default function Mock() {
  return (
    <Gate>
      <MockView />
    </Gate>
  );
}

function MockView() {
  const router = useRouter();
  const mocks = useApp((s) => s.mocks);
  const [qset, setQset] = useQSet();
  const max = COURSE.questions.filter((q) => q.kind !== "open" && inSet(q, qset)).length;
  const sizes = [20, 30, 50].filter((n) => n < max).concat(max <= 60 ? [max] : []);
  const [size, setSize] = useState(Math.min(30, max));
  const running = typeof window !== "undefined" ? readMock() : null;

  return (
    <main className="page-read py-6">
      <h1 className="text-[22px] font-bold tracking-tight">모의고사</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
        모든 장에서 문제 수에 비례해 고루 뽑습니다. 다 풀고 제출해야 채점합니다. 실제 시험처럼 해설 없이
        끝까지 풀어 보세요.
      </p>

      {running && !running.finished && (
        <Card className="mt-4 border-indigo-400/30">
          <p className="text-[14px] font-bold">풀던 모의고사가 있어요</p>
          <p className="mt-0.5 text-[12.5px] text-zinc-400">
            {Object.keys(running.responses).length}/{running.qids.length} 답함
          </p>
          <Button className="mt-3 w-full" onClick={() => router.push("/mock/session")}>
            이어서 풀기
          </Button>
        </Card>
      )}

      {HAS_PDF && (
        <>
          <SectionTitle>문제 모음</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {(["pdf", "extra", "all"] as QSet[]).map((v) => (
              <Chip key={v} active={qset === v} onClick={() => setQset(v)}>
                {QSET_LABEL[v]}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-zinc-500">서술·계산 문제는 모의고사에서 빼고, 퀴즈에서 스스로 채점합니다.</p>
        </>
      )}

      <SectionTitle>문제 수</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {sizes.map((n) => (
          <Chip key={n} active={size === n} onClick={() => setSize(n)}>
            {n === max ? `전부 ${n}` : `${n}문제`}
          </Chip>
        ))}
      </div>
      <Button
        size="lg"
        className="mt-6 w-full"
        onClick={() => {
          newMock(Math.min(size, max), qset);
          router.push("/mock/session");
        }}
      >
        <Play size={16} /> 새로 시작
      </Button>

      {mocks.length > 0 && (
        <>
          <SectionTitle>지난 응시</SectionTitle>
          <div className="flex flex-col gap-2">
            {[...mocks].reverse().map((m) => {
              const d = new Date(m.finishedAt);
              const pct = Math.round((m.correct / Math.max(1, m.total)) * 100);
              return (
                <Card key={m.startedAt} className="flex items-center gap-3 py-3">
                  <ClipboardList size={17} className="shrink-0 text-indigo-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold">
                      {pct}점 <span className="text-[12px] font-semibold text-zinc-400">({m.correct}/{m.total})</span>
                    </p>
                    <p className="text-[12px] text-zinc-400">
                      {d.getMonth() + 1}/{d.getDate()} {String(d.getHours()).padStart(2, "0")}:{String(d.getMinutes()).padStart(2, "0")} ·{" "}
                      {Math.max(1, Math.round((m.finishedAt - m.startedAt) / 60000))}분
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
      <p className="mt-6 text-center text-[12px] text-zinc-500">
        틀린 문제는 <Link href="/review" className="font-semibold text-indigo-300">복습</Link>과 퀴즈의 &lsquo;틀린 것&rsquo;에 들어갑니다.
      </p>
    </main>
  );
}
