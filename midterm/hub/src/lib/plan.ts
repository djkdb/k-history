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
}
export interface Scope {
  id: string;
  missing: string[];
  examNote: string | null;
  chapters: { id: string; title: string }[];
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
}

export interface CourseState {
  id: string;
  exam: string | null;
  /** 날짜가 어디서 왔나 */
  examFrom: "course" | "material" | "hub" | null;
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
  inputs: { id: string; snap: Snap | null; defaultExam: string | null; hubExam: string | null }[],
  now: Date = new Date(),
): Plan {
  const today = iso(now);
  const start = fromIso(today).getTime();
  const days: Record<string, DayTask[]> = {};
  const push = (d: string, t: DayTask) => (days[d] ??= []).push(t);
  const courses: CourseState[] = [];

  for (const { id, snap, defaultExam, hubExam } of inputs) {
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
    const st: CourseState = {
      id,
      exam,
      examFrom,
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
    const before = diffDays(today, exam); // 오늘부터 시험 전날까지 날 수
    if (before <= 0) continue;

    const reserve = before >= 3;
    const learnDays = before - (reserve ? 1 : 0);
    const left = scope.concepts.filter((c) => leftAtStart(c.id));
    // 이미 공부한 개념의 안 푼 문제 — 고르게 나눠 얹는다
    const extraQ = scope.concepts.filter((c) => !leftAtStart(c.id)).flatMap((c) => c.qs).filter(unsolvedAtStart).length;

    let i = 0;
    let extraLeft = extraQ;
    for (let k = 0; k < learnDays; k++) {
      const d = addDays(today, k);
      const n = Math.ceil((left.length - i) / (learnDays - k));
      const cs = left.slice(i, i + n);
      i += n;
      const ex = Math.ceil(extraLeft / (learnDays - k));
      extraLeft -= ex;
      const q = cs.flatMap((c) => c.qs).filter(unsolvedAtStart).length + ex;
      const r = reviewsOn(d);
      if (cs.length || q || r) push(d, { course: id, kind: cs.length ? "learn" : "practice", concepts: cs, questions: q, reviews: r });
    }
    if (reserve) {
      const d = addDays(exam, -1);
      push(d, { course: id, kind: "final", concepts: [], questions: 0, reviews: reviewsOn(d), wrong: st.wrong });
    }
  }
  return { today, days, courses };
}

/** 하루 합계 */
export function sumDay(tasks: DayTask[] = []) {
  return tasks.reduce(
    (a, t) => ({ concepts: a.concepts + t.concepts.length, questions: a.questions + t.questions, reviews: a.reviews + t.reviews }),
    { concepts: 0, questions: 0, reviews: 0 },
  );
}
