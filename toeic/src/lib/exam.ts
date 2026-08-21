import type { Band, ListeningSet, PartId, ReadingSet } from "./types";
import { LISTENING } from "@/data/listening";
import { READING } from "@/data/reading";
import { shuffleSeeded } from "./utils";

/**
 * 모의고사 구성.
 *
 * ── 왜 절반 분량인가 ────────────────────────────────────────────
 * 실제 시험은 듣기 100문항 45분 + 읽기 100문항 75분, 모두 2시간이다.
 * 여기서는 **비율은 그대로 두고 분량만 절반**으로 줄인다.
 *
 *   · 문항당 시간을 실전과 똑같이 맞춘다 (듣기 27초, 읽기 45초).
 *     시간에 쫓기는 감각은 총 문항 수가 아니라 문항당 초에서 온다.
 *   · 200문항을 한 벌 채우려면 가진 문항을 거의 다 써야 하고, 그러면
 *     두 번째 응시에서 같은 시험지를 다시 받는다. 답을 외운 시험지는
 *     연습이 되지 않는다.
 *
 * 화면에도 "실제의 절반 분량"이라고 그대로 적는다.
 *
 * ── 왜 목표 점수대로 거르지 않는가 ──────────────────────────────
 * 어휘·문법·파트훈련은 목표 점수대에 맞춰 걸러 준다. 600을 노리는
 * 사람에게 900점대 낱말을 들이밀면 시간만 버리기 때문이다.
 *
 * 그런데 모의고사는 다르다. 실제 시험은 응시자의 목표에 따라 쉬워지지
 * 않는다. 600을 노리는 사람도 시험장에서는 900점대 문항을 만나고,
 * 그것을 몇 개나 버리고 갈지 정하는 것까지가 실력이다. 여기서 미리
 * 걸러 주면 시험장에서 처음 겪게 된다.
 * (band 를 인자로 남겨 둔 것은 지난 응시 기록과의 호환 때문이다)
 */
export type ExamId = "lc" | "rc" | "full";

export interface ExamDef {
  id: ExamId;
  name: string;
  description: string;
  sections: ("listening" | "reading")[];
}

export const EXAMS: ExamDef[] = [
  {
    id: "lc",
    name: "듣기 모의고사",
    description:
      "Part 1~4. 실제 시험은 음성이 한 번 나가면 되돌릴 수 없습니다 — 그대로 해 보려면 아래에서 '한 번만 재생'을 켜세요.",
    sections: ["listening"],
  },
  {
    id: "rc",
    name: "읽기 모의고사",
    description:
      "Part 5~7. 시간 배분이 곧 점수입니다. Part 5 에서 아낀 시간이 Part 7 을 끝까지 풀게 합니다.",
    sections: ["reading"],
  },
  {
    id: "full",
    name: "전체 모의고사",
    description: "듣기와 읽기를 이어서. 실제 시험처럼 한 번에 끝까지 갑니다.",
    sections: ["listening", "reading"],
  },
];

export const EXAM_MAP: Record<ExamId, ExamDef> = Object.fromEntries(
  EXAMS.map((e) => [e.id, e]),
) as Record<ExamId, ExamDef>;

/**
 * 한 벌에 파트별로 몇 문항을 낼 것인가.
 *
 * 실제 시험(6·25·39·30 / 30·16·54)의 절반이다. 이 비율이 흐트러지면
 * 연습한 감각이 시험장에서 어긋난다 — 특히 Part 2 와 Part 7 은 문항이
 * 짧다는 이유로 적게 내기 쉬운데, 실제로는 둘이 합쳐 79문항이다.
 */
export const BLUEPRINT: Record<PartId, number> = {
  1: 3,
  2: 13,
  3: 18,
  4: 15,
  5: 15,
  6: 8,
  7: 27,
};

/** 시험에 나오는 한 문항 — 듣기·읽기를 한 줄로 세운다 */
export interface ExamItem {
  questionId: string;
  part: PartId;
  section: "listening" | "reading";
  /** 이 문항이 속한 지문 (같은 지문이면 화면에 한 번만 그린다) */
  setId: string;
  listening?: ListeningSet;
  reading?: ReadingSet;
  /** 지문 안에서 몇 번째 문항인지 */
  indexInSet: number;
}

export interface Exam {
  id: ExamId;
  items: ExamItem[];
  /** 제한 시간 (분) */
  minutes: number;
  seed: number;
}

const SEC_PER_QUESTION = { listening: 27, reading: 45 } as const;

/**
 * 목표 문항 수가 찰 때까지 지문을 고른다.
 *
 * 지문 단위로 골라야 한다. Part 3 의 대화 하나에는 문항 셋이 붙어 있고,
 * 그중 둘만 떼어 내면 "대화가 흐르는 순서대로 답이 나온다"는 이 파트의
 * 뼈대가 무너진다.
 *
 * 그래서 문항 수는 목표에 정확히 맞지 않을 수 있다. 넘치더라도 지문을
 * 통째로 내고, 대신 목표를 이미 넘겼으면 더 담지 않는다.
 */
function takeSets<T extends { questions: { id: string }[] }>(
  pool: T[],
  target: number,
  seed: number,
): T[] {
  const out: T[] = [];
  let n = 0;
  for (const set of shuffleSeeded(pool, seed)) {
    if (n >= target) break;
    out.push(set);
    n += set.questions.length;
  }
  return out;
}

export function buildExam(id: ExamId, _band: Band, seed: number): Exam {
  const def = EXAM_MAP[id];
  const items: ExamItem[] = [];
  let seconds = 0;

  if (def.sections.includes("listening")) {
    // 파트 순서는 실제 시험과 같게 두고, 파트 안에서만 섞는다
    for (const part of [1, 2, 3, 4] as const) {
      const pool = LISTENING.filter((s) => s.part === part);
      for (const set of takeSets(pool, BLUEPRINT[part], seed + part * 101)) {
        set.questions.forEach((q, i) => {
          items.push({
            questionId: q.id,
            part,
            section: "listening",
            setId: set.id,
            listening: set,
            indexInSet: i,
          });
          seconds += SEC_PER_QUESTION.listening;
        });
      }
    }
  }
  if (def.sections.includes("reading")) {
    for (const part of [5, 6, 7] as const) {
      const pool = READING.filter((s) => s.part === part);
      for (const set of takeSets(pool, BLUEPRINT[part], seed + part * 101)) {
        set.questions.forEach((q, i) => {
          items.push({
            questionId: q.id,
            part,
            section: "reading",
            setId: set.id,
            reading: set,
            indexInSet: i,
          });
          seconds += SEC_PER_QUESTION.reading;
        });
      }
    }
  }

  return { id, items, minutes: Math.max(3, Math.round(seconds / 60)), seed };
}

/** 문항 번호(0-based) → 그 문항의 정답 index */
export function answerOf(item: ExamItem): number {
  if (item.listening) return item.listening.questions[item.indexInSet].answer;
  if (item.reading) return item.reading.questions[item.indexInSet].answer;
  return 0;
}

export function choicesOf(item: ExamItem) {
  if (item.listening) return item.listening.questions[item.indexInSet].choices;
  if (item.reading) return item.reading.questions[item.indexInSet].choices;
  return [];
}

export function promptOf(item: ExamItem): string | undefined {
  if (item.listening) return item.listening.questions[item.indexInSet].prompt;
  if (item.reading) return item.reading.questions[item.indexInSet].prompt;
  return undefined;
}
