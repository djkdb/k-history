/**
 * 다섯 과목 통합 시험 계획 — 날마다 무엇을 얼마나 할지.
 *
 * 각 과목 앱이 이 기기에 남긴 거울 사본(localStorage)을 읽기만 한다.
 * 고치지 않는다 — 과목 앱이 들고 있는 기록과 어긋나면 안 되니까.
 *
 * 나누는 법 (과목마다 따로):
 *   - 시험 전날은 "총정리"(모의고사 · 틀린 문제)로 비워 둔다 (남은 날이 3일 이상일 때)
 *   - 남은 개념을 장 순서대로, 남은 날 수로 고르게 나눈다 — 날마다 ⌈남은 개념 ÷ 남은 날⌉
 *   - 그날 개념에 딸린 안 푼 문제 + 이미 공부한 개념의 안 푼 문제를 고르게 나눈 몫
 *   - 복습 카드는 그날 기한이 되는 것
 * 오늘 몫은 "오늘 아침" 기준으로 셈한다 — 오늘 공부한 것도 남은 것으로 쳐서,
 * 하루 동안 할당량이 줄어들며 흔들리지 않게.
 */
import scopeData from "@/data/scope.generated.json";

export type Imp = "must" | "high" | "normal";
export interface ScopeConcept {
  id: string;
  ch: string;
  imp: Imp;
  t: string;
  qs: string[];
  /** 처음 나온 PDF 번호(0부터)와 쪽 — 없으면 null */
  p?: [number, number] | null;
}
export interface Scope {
  id: string;
  missing: string[];
  examNote: string | null;
  chapters: { id: string; title: string }[];
  /** 강의 PDF 이름, 강의 순서대로 */
  pdfs?: string[];
  concepts: ScopeConcept[];
}
export const SCOPES = scopeData as Scope[];

export interface Snap {
  examDate: string | null;
  studied: Record<string, number>;
  log: Record<string, { last: number; lastRight: boolean }>;
  cards: { nextDueAt: number }[];
  wrongIds: string[];
}

export function readSnap(id: string): Snap | null {
  try {
    const raw = localStorage.getItem(`mid-${id}:mirror:mid-${id}-state`);
    if (!raw) return null;
    const s = ((JSON.parse(raw) as { state?: Record<string, unknown> }).state ?? {}) as Record<string, unknown>;
    return {
      examDate: (s.settings as { examDate?: string | null } | null)?.examDate ?? null,
      studied: (s.studied as Snap["studied"]) ?? {},
      log: (s.log as Snap["log"]) ?? {},
      cards: Array.isArray(s.cards) ? (s.cards as Snap["cards"]) : [],
      wrongIds: Array.isArray(s.wrongIds) ? (s.wrongIds as string[]) : [],
    };
  } catch {
    return null;
  }
}

/** 현관에서만 정한 시험일 — 과목 앱에 날짜가 없을 때만 쓴다 */
export function readHubExam(id: string): string | null {
  try {
    return localStorage.getItem(`midhub:exam:${id}`);
  } catch {
    return null;
  }
}
export function writeHubExam(id: string, iso: string | null) {
  try {
    if (iso) localStorage.setItem(`midhub:exam:${id}`, iso);
    else localStorage.removeItem(`midhub:exam:${id}`);
  } catch {
    /* 막아 둔 브라우저 */
  }
}

/**
 * 과목을 언제부터 시작할지 — 그 전에는 그 과목 몫을 잡지 않는다.
 * 기본값: 정보검색은 다음 주 시험들을 먼저 치르고 10/23(금)부터 몰아서 (직접 정한 계획).
 * 캘린더에서 바꾸면 이 기기에 남는다. 빈 문자열 = "지금부터".
 */
export const DEFAULT_START: Record<string, string> = { ir: "2026-10-23" };

export function readHubStart(id: string): string | null {
  try {
    const v = localStorage.getItem(`midhub:start:${id}`);
    if (v !== null) return v || null;
  } catch {
    /* 막아 둔 브라우저 */
  }
  return DEFAULT_START[id] ?? null;
}
export function writeHubStart(id: string, iso: string | null) {
  try {
    localStorage.setItem(`midhub:start:${id}`, iso ?? "");
  } catch {
    /* 막아 둔 브라우저 */
  }
}

/**
 * 나누는 방식 — "concept": 남은 개념을 날마다 고르게 / "pdf": 강의 PDF 하나(또는 그 일부)를 하루에.
 * 이 기기에 남는다.
 */
export type SplitMode = "concept" | "pdf";
export function readSplitMode(): SplitMode {
  try {
    return localStorage.getItem("midhub:split") === "pdf" ? "pdf" : "concept";
  } catch {
    return "concept";
  }
}
export function writeSplitMode(m: SplitMode) {
  try {
    localStorage.setItem("midhub:split", m);
  } catch {
    /* 막아 둔 브라우저 */
  }
}

/* ── 날짜 ─────────────────────────────────────────── */

export function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function fromIso(s: string): Date {
  return new Date(s + "T00:00:00");
}
export function addDays(s: string, n: number): string {
  const d = fromIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
export function diffDays(a: string, b: string): number {
  return Math.round((fromIso(b).getTime() - fromIso(a).getTime()) / 86_400_000);
}

/* ── 계획 ─────────────────────────────────────────── */

export type TaskKind = "learn" | "practice" | "final" | "exam";
export interface DayTask {
  course: string;
  kind: TaskKind;
  /** 그날 새로 볼 개념 (장 순서) */
  concepts: ScopeConcept[];
  /** 그날 풀 문제 수 */
  questions: number;
  /** 그날 기한이 되는 복습 카드 */
  reviews: number;
  /** 총정리 날: 틀린 문제 수 */
  wrong?: number;
  /** PDF 단위일 때 그날 볼 PDF — n은 1부터(과목 앱 /pdf/n), part는 "1/3" 처럼 나눈 몫 */
  pdfs?: { n: number; title: string; part: string | null }[];
}

export interface CourseState {
  id: string;
  exam: string | null;
  /** 날짜가 어디서 왔나 */
  examFrom: "course" | "material" | "hub" | null;
  /** 이날부터 시작 (오늘 이후일 때만) */
  start: string | null;
  total: number;
  studied: number;
  questions: number;
  solved: number;
  wrong: number;
  /** 오늘 한 것 */
  todayConcepts: number;
  todayQuestions: number;
  chapters: { id: string; title: string; done: number; total: number }[];
}

export interface Plan {
  today: string;
  days: Record<string, DayTask[]>;
  courses: CourseState[];
}

export function buildPlan(
  inputs: { id: string; snap: Snap | null; defaultExam: string | null; hubExam: string | null; start?: string | null }[],
  now: Date = new Date(),
  mode: SplitMode = "concept",
): Plan {
  const today = iso(now);
  const start = fromIso(today).getTime();
  const days: Record<string, DayTask[]> = {};
  const push = (d: string, t: DayTask) => (days[d] ??= []).push(t);
  const courses: CourseState[] = [];

  for (const { id, snap, defaultExam, hubExam, start: startFrom } of inputs) {
    const scope = SCOPES.find((s) => s.id === id);
    if (!scope) continue;
    const studied = snap?.studied ?? {};
    const log = snap?.log ?? {};
    const exam = snap?.examDate ?? defaultExam ?? hubExam;
    const examFrom = snap?.examDate ? "course" : defaultExam ? "material" : hubExam ? "hub" : null;

    // 오늘 아침 기준으로 "남았다"
    const leftAtStart = (cid: string) => !studied[cid] || studied[cid] >= start;
    const unsolvedAtStart = (qid: string) => !log[qid] || log[qid].last >= start;
    const allQ = scope.concepts.flatMap((c) => c.qs);
    // 시작일은 오늘 뒤 · 시험 전일 때만 뜻이 있다
    const begin = startFrom && startFrom > today && (!exam || startFrom < exam) ? startFrom : null;
    const st: CourseState = {
      id,
      exam,
      examFrom,
      start: begin,
      total: scope.concepts.length,
      studied: scope.concepts.filter((c) => studied[c.id]).length,
      questions: allQ.length,
      solved: allQ.filter((q) => log[q]).length,
      wrong: snap?.wrongIds.length ?? 0,
      todayConcepts: scope.concepts.filter((c) => studied[c.id] >= start).length,
      todayQuestions: allQ.filter((q) => log[q]?.last >= start).length,
      chapters: scope.chapters.map((ch) => {
        const cs = scope.concepts.filter((c) => c.ch === ch.id);
        return { id: ch.id, title: ch.title, total: cs.length, done: cs.filter((c) => studied[c.id]).length };
      }),
    };
    courses.push(st);
    if (!exam || exam < today) continue;

    const reviewsOn = (d: string) => {
      const a = fromIso(d).getTime();
      const b = a + 86_400_000;
      // 오늘은 밀린 것까지 다
      return (snap?.cards ?? []).filter((c) => (d === today ? c.nextDueAt < b : c.nextDueAt >= a && c.nextDueAt < b)).length;
    };

    push(exam, { course: id, kind: "exam", concepts: [], questions: 0, reviews: 0 });
    const first = begin ?? today;
    const before = diffDays(first, exam); // 시작하는 날부터 시험 전날까지 날 수
    if (before <= 0) continue;

    const reserve = before >= 3;
    const learnDays = before - (reserve ? 1 : 0);
    const left = scope.concepts.filter((c) => leftAtStart(c.id));
    // 이미 공부한 개념의 안 푼 문제 — 고르게 나눠 얹는다
    const extraQ = scope.concepts.filter((c) => !leftAtStart(c.id)).flatMap((c) => c.qs).filter(unsolvedAtStart).length;

    // 날마다 볼 개념 묶음
    const groups: { cs: ScopeConcept[]; pdfs?: DayTask["pdfs"] }[] =
      mode === "pdf" && scope.pdfs?.length ? byPdf(scope, left, learnDays) : evenly(left, learnDays);

    let extraLeft = extraQ;
    for (let k = 0; k < learnDays; k++) {
      const d = addDays(first, k);
      const g = groups[k] ?? { cs: [] };
      const cs = g.cs;
      const ex = Math.ceil(extraLeft / (learnDays - k));
      extraLeft -= ex;
      const q = cs.flatMap((c) => c.qs).filter(unsolvedAtStart).length + ex;
      const r = reviewsOn(d);
      if (cs.length || q || r)
        push(d, { course: id, kind: cs.length ? "learn" : "practice", concepts: cs, questions: q, reviews: r, pdfs: cs.length ? g.pdfs : undefined });
    }
    if (reserve) {
      const d = addDays(exam, -1);
      push(d, { course: id, kind: "final", concepts: [], questions: 0, reviews: reviewsOn(d), wrong: st.wrong });
    }
  }
  return { today, days, courses };
}

/** 개념 고르게 — 날마다 ⌈남은 개념 ÷ 남은 날⌉ */
function evenly(left: ScopeConcept[], days: number) {
  const out: { cs: ScopeConcept[] }[] = [];
  let i = 0;
  for (let k = 0; k < days; k++) {
    const n = Math.ceil((left.length - i) / (days - k));
    out.push({ cs: left.slice(i, i + n) });
    i += n;
  }
  return out;
}

/**
 * PDF 단위 — 남은 개념을 PDF(강의 순서) · 쪽 순서로 묶고, 하루에 PDF 하나씩.
 *   - 날이 PDF보다 많으면: 큰 PDF부터 여러 날로 쪼갠다 (개념이 많은 쪽에 날을 더 준다)
 *   - PDF가 날보다 많으면: 이웃한 PDF끼리 묶어 가장 무거운 날이 가장 가볍게
 * 출처가 없는 개념은 장 순서상 바로 앞 개념의 PDF에 붙인다.
 */
function byPdf(scope: Scope, left: ScopeConcept[], days: number) {
  const titles = scope.pdfs ?? [];
  // 개념마다 PDF 번호 — 출처가 없으면 앞(없으면 뒤) 개념의 것을 빌린다
  const key = new Map<string, [number, number]>();
  let prev: [number, number] | null = null;
  for (const c of scope.concepts) {
    if (c.p && c.p[0] >= 0) prev = c.p;
    if (prev) key.set(c.id, [prev[0], prev[1]]);
  }
  const firstKnown = scope.concepts.find((c) => c.p && c.p[0] >= 0)?.p ?? [0, 0];
  const kOf = (c: ScopeConcept) => key.get(c.id) ?? firstKnown;
  const order = new Map(scope.concepts.map((c, i) => [c.id, i]));
  const sorted = [...left].sort((a, b) => {
    const [pa, sa] = kOf(a);
    const [pb, sb] = kOf(b);
    return pa - pb || sa - sb || order.get(a.id)! - order.get(b.id)!;
  });
  const units: { n: number; cs: ScopeConcept[] }[] = [];
  for (const c of sorted) {
    const n = kOf(c)[0];
    if (units.at(-1)?.n === n) units.at(-1)!.cs.push(c);
    else units.push({ n, cs: [c] });
  }
  if (!units.length) return [];
  const label = (n: number) => ({ n: n + 1, title: titles[n] ?? `PDF ${n + 1}` });

  if (units.length <= days) {
    // 날을 PDF에 나눠 준다 — 개념 수 대비 날이 가장 적은 PDF에 하나씩
    const parts = units.map(() => 1);
    for (let extra = days - units.length; extra > 0; extra--) {
      let best = -1;
      for (let i = 0; i < units.length; i++)
        if (parts[i] < units[i].cs.length && (best < 0 || units[i].cs.length / parts[i] > units[best].cs.length / parts[best])) best = i;
      if (best < 0) break;
      parts[best]++;
    }
    return units.flatMap((u, i) =>
      evenly(u.cs, parts[i]).map((g, j) => ({ cs: g.cs, pdfs: [{ ...label(u.n), part: parts[i] > 1 ? `${j + 1}/${parts[i]}` : null }] })),
    );
  }

  // PDF가 더 많다 — 이웃한 것끼리 days 묶음으로, 가장 무거운 묶음이 가장 가볍게 (작은 동적 계획법)
  const w = units.map((u) => u.cs.length);
  const n = w.length;
  const pre = [0];
  for (const x of w) pre.push(pre.at(-1)! + x);
  const INF = Number.MAX_SAFE_INTEGER;
  // best[k][i] = 앞 i개를 k묶음으로 나눌 때 가장 무거운 묶음의 최소
  const best = Array.from({ length: days + 1 }, () => Array(n + 1).fill(INF));
  const cut = Array.from({ length: days + 1 }, () => Array(n + 1).fill(0));
  best[0][0] = 0;
  for (let k = 1; k <= days; k++)
    for (let i = k; i <= n; i++)
      for (let j = k - 1; j < i; j++) {
        const v = Math.max(best[k - 1][j], pre[i] - pre[j]);
        if (v < best[k][i]) {
          best[k][i] = v;
          cut[k][i] = j;
        }
      }
  const bounds: [number, number][] = [];
  for (let k = days, i = n; k > 0; k--) {
    const j = cut[k][i];
    bounds.unshift([j, i]);
    i = j;
  }
  return bounds.map(([a, b]) => ({
    cs: units.slice(a, b).flatMap((u) => u.cs),
    pdfs: units.slice(a, b).map((u) => ({ ...label(u.n), part: null })),
  }));
}

/** 하루 합계 */
export function sumDay(tasks: DayTask[] = []) {
  return tasks.reduce(
    (a, t) => ({ concepts: a.concepts + t.concepts.length, questions: a.questions + t.questions, reviews: a.reviews + t.reviews }),
    { concepts: 0, questions: 0, reviews: 0 },
  );
}
