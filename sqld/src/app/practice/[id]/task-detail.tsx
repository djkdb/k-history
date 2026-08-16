"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SQL_TASKS, TOPIC_LABEL } from "@/data/sql-tasks";
import { CONCEPT_MAP } from "@/data/concepts";
import { SqlRunner } from "@/components/sql-runner";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ImportanceBadge,
  SqlBlock,
} from "@/components/ui";

export function TaskDetail() {
  const params = useParams<{ id: string }>();
  const clearedSqlIds = useApp((s) => s.clearedSqlIds);
  const recordSqlResult = useApp((s) => s.recordSqlResult);

  const index = SQL_TASKS.findIndex((t) => t.id === params.id);
  const task = index >= 0 ? SQL_TASKS[index] : null;
  const prev = index > 0 ? SQL_TASKS[index - 1] : null;
  const next = index >= 0 && index < SQL_TASKS.length - 1 ? SQL_TASKS[index + 1] : null;

  /** 정답을 열어 본 뒤에는 채점이 의미가 없다 — 그때는 기록하지 않는다 */
  const [peeked, setPeeked] = useState(false);
  const [solved, setSolved] = useState(false);

  /**
   * 이미 기록에 넣은 결과.
   *
   * 실행 단추는 몇 번이든 누를 수 있다. 누를 때마다 기록하면 오타 한 번에
   * 오답이 여러 번 쌓이고 XP도 부풀려진다. 그래서 이 문제에 대해
   * 틀림은 한 번만, 맞힘도 한 번만 넣는다.
   */
  const logged = useRef({ wrong: false, correct: false });

  useEffect(() => {
    setPeeked(false);
    setSolved(false);
    logged.current = { wrong: false, correct: false };
  }, [task?.id]);

  const onGraded = useCallback(
    (correct: boolean) => {
      if (!task || peeked) return;
      if (correct) setSolved(true);
      const seen = logged.current;
      if (correct ? seen.correct : seen.wrong) return;
      if (correct) seen.correct = true;
      else seen.wrong = true;
      recordSqlResult(task.id, correct);
    },
    [task, peeked, recordSqlResult],
  );

  if (!task) {
    return (
      <div className="pt-6">
        <EmptyState
          icon="❓"
          title="없는 문제입니다"
          action={
            <Link href="/practice">
              <Button size="sm">실습으로</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const cleared = clearedSqlIds.includes(task.id);

  return (
    <div className="pt-6">
      <Link
        href="/practice"
        className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
      >
        <ArrowLeft size={15} />
        SQL 실습
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge>{TOPIC_LABEL[task.topic]}</Badge>
        <ImportanceBadge importance={task.importance} />
        {task.ordered && <Badge>행 순서까지 봄</Badge>}
        {cleared && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            <CheckCircle2 size={11} />맞힌 문제
          </span>
        )}
      </div>

      <h1 className="mt-3 text-[19px] font-bold leading-[1.6] tracking-tight">
        {task.prompt}
      </h1>

      {!task.ordered && (
        <p className="mt-2 text-[11.5px] leading-relaxed text-zinc-500">
          행이 나오는 순서는 따지지 않습니다. 열 이름이 달라도, 조인 방식이 달라도
          값만 같으면 정답입니다.
        </p>
      )}

      <div className="mt-4">
        <SqlRunner answer={task.answer} ordered={task.ordered} onGraded={onGraded} />
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <Card className="border-emerald-500/25 bg-emerald-500/[0.07]">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-300">
              <CheckCircle2 size={14} />
              직접 쳐서 맞혔습니다
            </p>
            <p className="mt-1.5 text-[13.5px] leading-[1.85] text-zinc-300">
              {task.explanation}
            </p>
          </Card>
        </motion.div>
      )}

      {/*
        정답과 해설은 접어 둔다.
        열어 두면 눈으로 읽고 넘어가게 되어, 이 화면의 뜻이 사라진다.
      */}
      {!solved && (
        <div className="mt-3">
          {!peeked ? (
            <Button variant="ghost" className="w-full" onClick={() => setPeeked(true)}>
              <Eye size={15} />
              막히면 — 정답과 해설 보기
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <p className="text-[12px] font-bold text-zinc-400">모범 답안</p>
                <SqlBlock className="mt-2">{task.answer}</SqlBlock>
                <p className="mt-3 text-[13.5px] leading-[1.85] text-zinc-300">
                  {task.explanation}
                </p>
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
                  답을 본 뒤의 채점은 기록에 넣지 않습니다. 위에 직접 쳐 보고 나서
                  다음 문제로 넘어가세요.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* 자주 틀리는 지점 — 답을 맞혔든 아니든 읽을 값이 있다 */}
      {task.trap && (
        <Card className="mt-3 border-rose-500/20 bg-rose-500/[0.06]">
          <div className="flex items-start gap-2">
            <TriangleAlert size={15} className="mt-0.5 shrink-0 text-rose-300" />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-rose-200">자주 틀리는 지점</p>
              <p className="mt-1.5 text-[13.5px] leading-[1.85] text-zinc-300">
                {task.trap}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 이어지는 개념 */}
      {task.links && task.links.some((id) => CONCEPT_MAP[id]) && (
        <Card className="mt-3">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-400">
            <Lightbulb size={13} />
            이어지는 개념
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {task.links
              .filter((id) => CONCEPT_MAP[id])
              .map((id) => (
                <Link
                  key={id}
                  href={`/concept/${id}`}
                  className="text-[13px] text-indigo-300 hover:text-indigo-200"
                >
                  {CONCEPT_MAP[id].title} →
                </Link>
              ))}
          </div>
        </Card>
      )}

      <div className="mt-6 flex items-stretch gap-2">
        {prev ? (
          <Link href={`/practice/${prev.id}`} className="flex-1">
            <div className="glass h-full rounded-2xl p-3 transition-transform active:scale-[0.98]">
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <ArrowLeft size={12} />
                이전
              </span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {prev.prompt}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link href={`/practice/${next.id}`} className="flex-1">
            <div className="glass h-full rounded-2xl p-3 text-right transition-transform active:scale-[0.98]">
              <span className="flex items-center justify-end gap-1 text-[11px] text-zinc-500">
                다음
                <ArrowRight size={12} />
              </span>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold">
                {next.prompt}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
