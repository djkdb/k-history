import type { Band, ListeningSet, PartId, ReadingSet } from "./types";
import { listeningFor } from "@/data/listening";
import { readingFor } from "@/data/reading";
import { shuffleSeeded } from "./utils";

/**
 * 모의고사 구성.
 *
 * 실제 시험은 듣기 100문항 45분 + 읽기 100문항 75분이다. 여기 있는 문항은
 * 그만큼 많지 않으므로, **문항 수에 비례해 시간을 줄여** 실제와 같은
 * "문항당 초"를 맞춘다. 그래야 시간에 쫓기는 감각이 실전과 같아진다.
 *
 *   듣기: 45분 / 100문항 = 27초
 *   읽기: 75분 / 100문항 = 45초
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
      "Part 1~4. 문항이 흘러가면 되돌아갈 수 없는 실제 시험과 달리, 여기서는 다시 들을 수 있습니다.",
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

export function buildExam(id: ExamId, band: Band, seed: number): Exam {
  const def = EXAM_MAP[id];
  const items: ExamItem[] = [];
  let seconds = 0;

  if (def.sections.includes("listening")) {
    // 파트 순서는 실제 시험과 같게 두고, 파트 안에서만 섞는다
    for (const part of [1, 2, 3, 4] as const) {
      for (const set of shuffleSeeded(listeningFor(band, part), seed + part)) {
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
      for (const set of shuffleSeeded(readingFor(band, part), seed + part)) {
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
