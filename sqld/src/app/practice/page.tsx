"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Table2, Terminal } from "lucide-react";
import { useApp } from "@/lib/store";
import type { SqlTopic } from "@/lib/types";
import { SQL_TASKS, TOPIC_LABEL } from "@/data/sql-tasks";
import { TABLES } from "@/data/schema";
import {
  Button,
  Card,
  Chip,
  ImportanceBadge,
  ProgressBar,
  ScrollRow,
  SectionTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";

/** 실습에 있는 갈래만, 자료에 적힌 순서대로 */
const TOPICS = Array.from(new Set(SQL_TASKS.map((t) => t.topic))) as SqlTopic[];

export default function PracticePage() {
  const clearedSqlIds = useApp((s) => s.clearedSqlIds);
  const [topic, setTopic] = useState<SqlTopic | null>(null);
  const [schemaOpen, setSchemaOpen] = useState(false);

  const list = useMemo(
    () => (topic ? SQL_TASKS.filter((t) => t.topic === topic) : SQL_TASKS),
    [topic],
  );
  const done = SQL_TASKS.filter((t) => clearedSqlIds.includes(t.id)).length;

  /** 아직 못 맞힌 것 중 첫 번째 — 눌러만 두면 되게 */
  const nextTask = SQL_TASKS.find((t) => !clearedSqlIds.includes(t.id));

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold tracking-tight">SQL 실습</h1>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        브라우저 안에서 진짜 SQLite 가 돕니다. 결과를 견주어 채점하므로, 모범
        답안과 문장이 달라도 나온 값이 같으면 정답입니다.
      </p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          {done} / {SQL_TASKS.length}개 맞힘
        </span>
        <span className="font-bold text-emerald-300">
          {Math.round((done / SQL_TASKS.length) * 100)}%
        </span>
      </div>
      <ProgressBar
        value={done}
        max={SQL_TASKS.length}
        color="#10b981"
        className="mt-2"
      />

      {nextTask && (
        <Link href={`/practice/${nextTask.id}`} className="mt-4 block">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 transition-transform active:scale-[0.99]">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-emerald-300">
                이어서 풀 문제
              </p>
              <p className="mt-1 line-clamp-2 text-[13.5px] font-semibold leading-snug">
                {nextTask.prompt}
              </p>
            </div>
            <ArrowRight size={18} className="ml-3 shrink-0 text-emerald-300" />
          </div>
        </Link>
      )}

      {/* 표 구조 — 쿼리를 쓰려면 무엇이 있는지부터 알아야 한다 */}
      <Button
        variant="outline"
        className="mt-3 w-full"
        onClick={() => setSchemaOpen((v) => !v)}
      >
        <Table2 size={15} />
        {schemaOpen ? "표 구조 접기" : "표 구조 보기"}
      </Button>
      {schemaOpen && (
        <Card className="mt-2">
          {TABLES.map((t) => (
            <div key={t.name} className="mb-4 last:mb-0">
              <p className="mono text-[13px] font-bold text-indigo-200">{t.name}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-zinc-500">
                {t.note}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {t.columns.map((c) => (
                  <div key={c.name} className="flex items-start gap-2">
                    <span className="mono shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-300">
                      {c.name}
                    </span>
                    <span className="min-w-0 text-[11.5px] leading-[1.7] text-zinc-500">
                      {c.type} · {c.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}

      <SectionTitle>갈래</SectionTitle>
      <ScrollRow>
        <Chip active={topic === null} onClick={() => setTopic(null)}>
          전체 {SQL_TASKS.length}
        </Chip>
        {TOPICS.map((t) => (
          <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
            {TOPIC_LABEL[t]} {SQL_TASKS.filter((x) => x.topic === t).length}
          </Chip>
        ))}
      </ScrollRow>

      <div className="mt-4 flex flex-col gap-2">
        {list.map((t) => {
          const cleared = clearedSqlIds.includes(t.id);
          return (
            <Link key={t.id} href={`/practice/${t.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {cleared ? (
                        <Check size={14} className="shrink-0 text-emerald-400" />
                      ) : (
                        <Terminal size={13} className="shrink-0 text-zinc-500" />
                      )}
                      <span className="text-[11px] text-zinc-500">
                        {TOPIC_LABEL[t.topic]}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-[13.5px] font-semibold leading-relaxed",
                        cleared && "text-zinc-400",
                      )}
                    >
                      {t.prompt}
                    </p>
                  </div>
                  <ImportanceBadge importance={t.importance} compact />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-[11px] leading-relaxed text-zinc-600">
        SQL 엔진(sql.js)은 앱과 함께 담겨 있어 인터넷 없이도 돌아갑니다. 실습
        화면에 처음 들어갈 때 한 번만 불러오며, 표는 문제마다 처음 상태로
        되돌아갑니다.
      </p>
    </div>
  );
}
