import { CONCEPTS } from "@/data/concepts";
import { dueCards } from "@/lib/srs";
import type { AppState } from "@/lib/store";
import type { Track } from "@/lib/types";

/**
 * 오늘 할 일.
 *
 * 앱을 열면 고를 것이 열 가지쯤 된다 — 학습, 문제, 복습, 모의고사, 실기,
 * 오답, 시험 직전 모드… 무엇부터 할지 정하는 데 드는 힘이 실제 공부보다
 * 클 때가 있다. 그날 해야 할 것 서너 가지를 앱이 먼저 정해 준다.
 *
 * 지어낸 목표가 아니다. 남은 날수로 나눈 진도, 오늘 복습할 차례가 된 카드,
 * 여러 번 틀린 문항 — 모두 이미 앱이 알고 있는 것에서 나온다. 그래서
 * 시험일을 정하지 않은 사람에게는 진도 몫이 붙지 않는다. 나눌 날수가 없다.
 */
export interface Todo {
  id: string;
  label: string;
  /** 왜 이만큼인가 — 근거를 밝히지 않으면 숫자를 안 믿는다 */
  why: string;
  href: string;
  /**
   * 오늘 얼마나 했는가. 잴 수 없는 것에는 두지 않는다 — 억지로 0 을 두면
   * 아무리 해도 안 채워지는 칸이 되어, 목록 전체를 못 믿게 만든다.
   */
  now?: number;
  goal?: number;
}

const DAY = 864e5;
const 날 = (t: number) => new Date(t).toISOString().slice(0, 10);

export function buildToday(
  s: Pick<
    AppState,
    | "settings"
    | "studiedIds"
    | "studiedAt"
    | "reviewCards"
    | "quizHistory"
    | "questionMisses"
  >,
  now: number = Date.now(),
): Todo[] {
  const track: Track = s.settings?.track ?? "written";
  const 오늘 = 날(now);
  const out: Todo[] = [];

  /* 하나 — 오늘 볼 차례가 된 복습. 미루면 그만큼 잊는다 */
  const due = dueCards(s.reviewCards, now).length;
  const 오늘복습 = s.reviewCards.filter(
    (c) => c.lastReviewedAt && 날(c.lastReviewedAt) === 오늘,
  ).length;
  if (due > 0 || 오늘복습 > 0)
    out.push({
      id: "review",
      label: `복습 ${due + 오늘복습}장`,
      why: "오늘 볼 차례가 된 카드입니다. 미루면 그만큼 잊습니다.",
      href: "/review",
      now: 오늘복습,
      goal: due + 오늘복습,
    });

  /* 둘 — 진도. 남은 개념을 남은 날로 나눈 몫 */
  const 여기 = CONCEPTS.filter((c) => c.tracks.includes(track));
  const 본 = new Set(s.studiedIds);
  const 남은 = 여기.filter((c) => !본.has(c.id)).length;
  const 오늘본 = Object.entries(s.studiedAt).filter(
    ([id, t]) => 날(t) === 오늘 && 여기.some((c) => c.id === id),
  ).length;
  const examDate = s.settings?.examDate ?? null;
  if (남은 > 0) {
    const 남은날 = examDate
      ? Math.max(1, Math.ceil((new Date(examDate + "T00:00:00").getTime() - now) / DAY))
      : null;
    /*
     * 시험일이 없으면 나눌 날이 없다. 그럴 때는 하루 세 개 — 한 자리에
     * 앉아 무리 없이 볼 만한 양이다. 지어낸 목표를 크게 부르면 못 지키고,
     * 못 지킨 목록은 곧 안 보게 된다.
     */
    const 몫 = 남은날 ? Math.ceil(남은 / 남은날) : 3;
    const goal = Math.max(1, Math.min(몫, 12));
    out.push({
      id: "learn",
      label: `새 개념 ${goal}개`,
      why: 남은날
        ? `아직 안 본 개념 ${남은}개를 남은 ${남은날}일로 나눈 몫입니다.`
        : "시험일을 정해 두면 남은 날에 맞춰 몫을 다시 나눕니다.",
      href: "/learn",
      now: Math.min(오늘본, goal),
      goal,
    });
  }

  /* 셋 — 오늘 푼 문항. 눈으로 읽은 것과 풀어 본 것은 다르다 */
  const 오늘푼 = s.quizHistory
    .filter((q) => 날(q.takenAt) === 오늘)
    .reduce((n, q) => n + q.total, 0);
  const 문항목표 = track === "written" ? 20 : 10;
  out.push({
    id: "quiz",
    label:
      track === "written" ? `문제 ${문항목표}문항` : `실기 ${문항목표}문항 적기`,
    why:
      track === "written"
        ? "눈으로 읽은 것과 골라 본 것은 다릅니다."
        : "실기는 고르는 시험이 아니라 적는 시험입니다.",
    href: track === "written" ? "/quiz" : "/practical",
    now: Math.min(오늘푼, 문항목표),
    goal: 문항목표,
  });

  /* 넷 — 두 번 이상 틀린 문항. 있을 때만 */
  const 어려운 = Object.values(s.questionMisses).filter((n) => n >= 2).length;
  if (어려운 > 0)
    out.push({
      id: "hard",
      label: `두 번 이상 틀린 문항 ${Math.min(어려운, 10)}개`,
      why: `여태 두 번 넘게 틀린 문항이 ${어려운}개 있습니다. 시험장에서 또 틀릴 자리입니다.`,
      href: "/quiz?hard=1",
    });

  return out;
}

/** 오늘 할 일을 다 했는가 */
export function allDone(todos: Todo[]): boolean {
  const 잴것 = todos.filter((t) => typeof t.goal === "number");
  return 잴것.length > 0 && 잴것.every((t) => (t.now ?? 0) >= t.goal!);
}
