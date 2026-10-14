"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Dices, Eye, EyeOff, ListChecks, Printer, X } from "lucide-react";
import { Gate } from "@/components/gate";
import { Button, Card, Chip, EmptyState, RichText, SqlBlock } from "@/components/ui";
import { CONCEPT_MAP, COURSE, Q_MAP, chapterOfQuestion, termLabel } from "@/lib/course";
import { answerText } from "@/lib/grade";
import { setQuizPreset } from "@/lib/handoff";
import { usePrintLight } from "@/lib/print";
import { useApp } from "@/lib/store";
import type { Calib, Conf, Question } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Wrongs() {
  return (
    <Gate>
      <WrongsView />
    </Gate>
  );
}

type Tab = "sure" | "wrong" | "lucky";

const TABS: { id: Tab; label: string; desc: string; mode: "sure" | "wrong" | "shaky" }[] = [
  {
    id: "sure",
    label: "확신 오답",
    desc: "확신했는데 틀린 문제. 해설을 보면 바로 고쳐지지만 며칠 뒤 옛 답이 되살아나기 쉬워, 서로 다른 날 두 번 맞혀야 빠집니다.",
    mode: "sure",
  },
  { id: "wrong", label: "틀린 문제", desc: "지금 틀린 채로 남은 문제. 한 번 맞히면 빠집니다.", mode: "wrong" },
  {
    id: "lucky",
    label: "찍어서 맞힘",
    desc: "맞혔지만 찍은 문제. 아는 것이 아니라서 자신 있게 맞힐 때까지 남겨 둡니다.",
    mode: "shaky",
  },
];

/**
 * 오답 노트 — 확신 오답 · 틀린 문제 · 찍어서 맞힌 문제를 한곳에.
 *
 * 답은 접어 둔다. 문제만 보고 먼저 떠올린 뒤 펼친다 — 펼쳐 놓고 읽으면
 * 아는 것 같은 착각만 남는다.
 */
function WrongsView() {
  const router = useRouter();
  const log = useApp((s) => s.log);
  const wrongIds = useApp((s) => s.wrongIds);
  const sureWrong = useApp((s) => s.sureWrong);
  const lucky = useApp((s) => s.lucky);
  const calib = useApp((s) => s.calib);
  const dismissSure = useApp((s) => s.dismissSure);

  const lists = useMemo(() => {
    const known = (ids: string[]) => ids.map((id) => Q_MAP[id]).filter(Boolean) as Question[];
    return {
      sure: known(Object.keys(sureWrong).sort((a, b) => sureWrong[b].at - sureWrong[a].at)),
      wrong: known(wrongIds),
      lucky: known(lucky),
    } satisfies Record<Tab, Question[]>;
  }, [sureWrong, wrongIds, lucky]);

  const [tab, setTab] = useState<Tab>(() => "sure");
  const cur = lists[tab].length === 0 ? (TABS.find((t) => lists[t.id].length > 0)?.id ?? tab) : tab;
  const [chapter, setChapter] = useState<string | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  usePrintLight(() => setShowAll(true));

  const chapters = useMemo(() => {
    const n: Record<string, number> = {};
    for (const q of lists[cur]) {
      const ch = chapterOfQuestion(q)?.id;
      if (ch) n[ch] = (n[ch] ?? 0) + 1;
    }
    return COURSE.chapters.filter((c) => n[c.id]).map((c) => ({ ...c, n: n[c.id] }));
  }, [lists, cur]);
  const items = lists[cur].filter((q) => chapter === "all" || chapterOfQuestion(q)?.id === chapter);
  const total = lists.sure.length + lists.wrong.length + lists.lucky.length;
  const meta = TABS.find((t) => t.id === cur)!;

  const retry = () => {
    setQuizPreset(chapter === "all" ? { mode: meta.mode } : { mode: meta.mode, chapter });
    router.push("/quiz");
  };

  return (
    <main className="py-6">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold tracking-tight">오답 노트</h1>
          <p className="mt-1 text-[13px] text-zinc-400">퀴즈와 모의고사에서 틀리거나 찍은 문제가 저절로 모입니다.</p>
        </div>
        {total > 0 && (
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="인쇄"
            className="no-print grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10"
          >
            <Printer size={18} />
          </button>
        )}
      </div>

      <CalibCard calib={calib} />

      {total === 0 ? (
        <EmptyState
          title="오답 노트가 비어 있어요"
          desc="퀴즈를 풀면 틀린 문제, 확신했는데 틀린 문제, 찍어서 맞힌 문제가 여기에 쌓입니다."
          action={
            <Link href="/quiz" className="text-[13px] font-semibold text-indigo-300">
              퀴즈 풀러 가기 →
            </Link>
          }
        />
      ) : (
        <>
          <div className="no-print mt-5 grid grid-cols-3 gap-1 rounded-xl bg-white/[0.04] p-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={cur === t.id}
                onClick={() => {
                  setTab(t.id);
                  setChapter("all");
                }}
                className={cn(
                  "rounded-lg py-2 text-[12.5px] font-bold transition-colors",
                  cur === t.id ? "bg-indigo-500/20 text-indigo-100" : "text-zinc-400",
                )}
              >
                {t.label} <span className="opacity-70">{lists[t.id].length}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">{meta.desc}</p>

          {chapters.length > 1 && (
            <div className="no-print mt-3 flex flex-wrap gap-2">
              <Chip active={chapter === "all"} onClick={() => setChapter("all")}>
                전체
              </Chip>
              {chapters.map((c) => (
                <Chip key={c.id} active={chapter === c.id} onClick={() => setChapter(c.id)}>
                  {c.title} <span className="opacity-60">{c.n}</span>
                </Chip>
              ))}
            </div>
          )}

          {items.length > 0 ? (
            <>
              <div className="no-print mt-4 grid grid-cols-2 gap-2">
                <Button onClick={retry}>
                  <ListChecks size={16} /> {cur === "lucky" ? "불안한 것" : `${items.length}문제`} 다시 풀기
                </Button>
                <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? <EyeOff size={16} /> : <Eye size={16} />} {showAll ? "답 접기" : "답 모두 보기"}
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                {items.map((q, i) => (
                  <NoteItem
                    key={q.id}
                    n={i + 1}
                    q={q}
                    kind={cur}
                    said={log[q.id]?.said}
                    lastConf={log[q.id]?.conf}
                    sureDays={sureWrong[q.id]?.okDays.length}
                    isSure={!!sureWrong[q.id]}
                    open={showAll || !!open[q.id]}
                    onToggle={() => setOpen((m) => ({ ...m, [q.id]: !m[q.id] }))}
                    onDismiss={cur === "sure" ? () => dismissSure(q.id) : undefined}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-[13.5px] text-zinc-400">이 목록은 비어 있어요.</p>
          )}
        </>
      )}
    </main>
  );
}

function NoteItem({
  n,
  q,
  kind,
  said,
  lastConf,
  sureDays,
  isSure,
  open,
  onToggle,
  onDismiss,
}: {
  n: number;
  q: Question;
  kind: Tab;
  said?: string;
  lastConf?: Conf;
  sureDays?: number;
  isSure: boolean;
  open: boolean;
  onToggle: () => void;
  onDismiss?: () => void;
}) {
  const c = CONCEPT_MAP[q.concept];
  return (
    <section className="print-sheet rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-[11.5px] font-semibold">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[10.5px] text-zinc-300">{n}</span>
        <span className="min-w-0 flex-1 truncate text-zinc-500">{c ? termLabel(c) : ""}</span>
        {kind === "sure" && (
          <span className="shrink-0 text-rose-300">다른 날 {sureDays ?? 0}/2번 맞힘</span>
        )}
        {kind === "wrong" && isSure && (
          <span className="flex shrink-0 items-center gap-1 text-rose-300">
            <AlertTriangle size={12} /> 확신 오답
          </span>
        )}
        {kind === "lucky" && (
          <span className="flex shrink-0 items-center gap-1 text-amber-300">
            <Dices size={12} /> 찍어서 맞힘
          </span>
        )}
      </div>
      <p className="mt-2 whitespace-pre-line text-[14.5px] font-bold leading-relaxed text-zinc-100">
        <RichText>{q.q}</RichText>
      </p>
      {q.code && <SqlBlock className="mt-2">{q.code}</SqlBlock>}

      {!open ? (
        <button
          type="button"
          onClick={onToggle}
          className="no-print mt-3 w-full rounded-xl border border-dashed border-white/15 py-2.5 text-[12.5px] font-semibold text-zinc-400 hover:bg-white/[0.04]"
        >
          먼저 떠올려 보고 — 답 보기
        </button>
      ) : (
        <div className="mt-3 text-[13px] leading-relaxed">
          {said !== undefined && kind !== "lucky" && (
            <p className="flex gap-1.5 text-rose-200">
              <X size={14} className="mt-[3px] shrink-0" />
              <span>
                <span className="text-zinc-500">내 답 </span>
                <RichText>{said}</RichText>
                {lastConf === "sure" && <span className="ml-1 text-[11px] font-bold text-rose-300">(확신)</span>}
              </span>
            </p>
          )}
          <p className="mt-1 text-emerald-200">
            <span className="text-zinc-500">정답 </span>
            <b>
              <RichText>{answerText(q)}</RichText>
            </b>
          </p>
          <p className="mt-2 text-zinc-300">
            <RichText>{q.explain}</RichText>
          </p>
          <div className="no-print mt-3 flex items-center gap-3 text-[12px] font-semibold">
            {c && (
              <Link href={`/concept/${c.id}`} className="text-indigo-300">
                개념 다시 보기 →
              </Link>
            )}
            {onDismiss && (
              <button type="button" onClick={onDismiss} className="ml-auto text-zinc-500 hover:text-zinc-300">
                이제 확실히 알아요 — 빼기
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const CONF_LABEL: Record<Conf, string> = { sure: "확신", half: "반반", guess: "찍음" };

/**
 * 내 확신이 얼마나 믿을 만한가.
 * "확신" 의 정답률이 낮으면 아는 줄 아는 것이 많다는 뜻 — 시험장에서 가장 위험하다.
 */
function CalibCard({ calib }: { calib: Calib }) {
  const rows = (Object.keys(CONF_LABEL) as Conf[]).map((k) => ({ k, ...calib[k] })).filter((r) => r.n > 0);
  if (rows.length === 0) return null;
  const sure = calib.sure;
  const surePct = sure.n ? Math.round((sure.right / sure.n) * 100) : null;
  return (
    <Card className="mt-4">
      <p className="text-[13px] font-bold">내 확신은 믿을 만한가</p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((r) => {
          const pct = Math.round((r.right / r.n) * 100);
          return (
            <div key={r.k} className="flex items-center gap-2 text-[12px]">
              <span className="w-9 shrink-0 font-semibold text-zinc-300">{CONF_LABEL[r.k]}</span>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full rounded-full",
                    r.k === "sure" ? "bg-emerald-400/80" : r.k === "half" ? "bg-amber-400/80" : "bg-zinc-400/70",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-[84px] shrink-0 text-right text-zinc-400">
                <b className="text-zinc-100">{pct}%</b> 맞힘 · {r.n}번
              </span>
            </div>
          );
        })}
      </div>
      {surePct !== null && sure.n >= 5 && (
        <p className="mt-3 text-[12px] leading-relaxed text-zinc-400">
          {surePct >= 90
            ? "확신할 때는 거의 맞힙니다. 반반·찍음 문제에 시간을 쓰세요."
            : surePct >= 75
              ? `확신해도 열에 ${Math.round((100 - surePct) / 10)}번은 틀립니다. 확신 오답부터 보세요.`
              : "확신해도 자주 틀립니다 — 아는 줄 아는 것이 많다는 신호입니다. 확신 오답을 먼저 정리하세요."}
        </p>
      )}
    </Card>
  );
}
