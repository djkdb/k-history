import type { Part, Band } from "@/lib/types";

/**
 * 시험 구성.
 *
 * 2016년 개정 이후의 형식이다. 듣기 45분·읽기 75분, 합쳐 2시간에
 * 200문항을 푼다. 점수는 듣기 5~495점, 읽기 5~495점으로 합 990점이며
 * 맞힌 개수를 그대로 점수로 주지 않고 회차마다 환산표로 바꾼다.
 */
export const PARTS: Part[] = [
  {
    id: 1,
    section: "listening",
    name: "사진 묘사",
    count: 6,
    choices: 4,
    summary:
      "사진 한 장을 보고, 들려주는 네 문장 중 사진과 맞는 것을 고른다. 선택지는 시험지에 없고 귀로만 듣는다.",
    trap:
      "사진에 있는 물건 이름을 그대로 말해 주면 맞는 것처럼 들린다. 사람이 없는 사진에 사람 동작을 말하거나, 놓여 있는 것을 '옮기고 있다'고 하는 식으로 동사만 바꿔 낸다.",
  },
  {
    id: 2,
    section: "listening",
    name: "질의응답",
    count: 25,
    choices: 3,
    summary:
      "질문이나 말을 하나 듣고, 이어지는 응답 세 개 중 가장 알맞은 것을 고른다. 여기도 선택지가 시험지에 없다.",
    trap:
      "질문에 나온 단어와 비슷한 소리가 답처럼 들린다(work/walk, copy/coffee). 의문사 질문에 Yes/No 로 답하는 선택지도 그래서 걸린다.",
  },
  {
    id: 3,
    section: "listening",
    name: "짧은 대화",
    count: 39,
    choices: 4,
    summary:
      "두세 사람의 대화를 듣고 세 문항씩 푼다. 대화 13개가 나온다. 문제와 선택지는 시험지에 있다.",
    trap:
      "들리기 전에 문제를 못 읽으면 무너진다. 대화가 끝나고 고르는 것이 아니라, 대화가 흘러가는 순서대로 답이 나온다.",
  },
  {
    id: 4,
    section: "listening",
    name: "짧은 담화",
    count: 30,
    choices: 4,
    summary:
      "한 사람이 말하는 안내방송·음성메시지·광고 등을 듣고 세 문항씩 푼다. 담화 10개가 나온다.",
    trap:
      "첫 두 문장에 '누가·어디서·왜'가 다 나온다. 거기서 놓치면 뒤를 아무리 들어도 첫 문제를 못 푼다.",
  },
  {
    id: 5,
    section: "reading",
    name: "단문 빈칸",
    count: 30,
    choices: 4,
    summary:
      "한 문장에 빈칸이 하나 있고 알맞은 말을 고른다. 문법 자리 문제와 어휘 문제가 섞여 나온다.",
    trap:
      "문장을 다 해석하려 들면 시간이 없다. 선택지가 한 단어의 품사 변형이면 해석이 아니라 자리를 보는 문제다.",
  },
  {
    id: 6,
    section: "reading",
    name: "장문 빈칸",
    count: 16,
    choices: 4,
    summary:
      "지문 하나에 빈칸이 네 개 있다. 지문 4개가 나오며, 네 문항 중 하나는 문장을 통째로 넣는 문제다.",
    trap:
      "빈칸이 있는 문장만 보면 시제와 연결어를 틀린다. Part 5 와 달리 앞뒤 문장을 봐야 풀리는 문제가 섞여 있다.",
  },
  {
    id: 7,
    section: "reading",
    name: "독해",
    count: 54,
    choices: 4,
    summary:
      "이메일·공지·기사·문자 대화 등을 읽고 푼다. 지문 하나짜리 29문항, 두세 지문을 엮은 25문항으로 나뉜다.",
    trap:
      "이중·삼중 지문은 답의 근거가 두 지문에 걸쳐 있다. 한 지문만 보고 고르면 그럴듯한 오답에 걸린다.",
  },
];

export const PART_MAP: Record<number, Part> = Object.fromEntries(
  PARTS.map((p) => [p.id, p]),
);

export const LISTENING_PARTS = PARTS.filter((p) => p.section === "listening");
export const READING_PARTS = PARTS.filter((p) => p.section === "reading");

/** 듣기 45분 + 읽기 75분 */
export const SECTION_MINUTES = { listening: 45, reading: 75 } as const;

export const SECTION_LABEL = {
  listening: "듣기",
  reading: "읽기",
} as const;

export const BAND_LABEL: Record<Band, string> = {
  600: "600점 목표",
  700: "700점 목표",
  800: "800점 목표",
  900: "900점 목표",
};

/** 그 점수대를 노린다면 풀어야 할 것 — 목표보다 쉬운 것은 당연히 포함이다 */
export function inBand(itemBand: Band, target: Band): boolean {
  return itemBand <= target;
}

/**
 * 맞힌 개수 → 환산 점수.
 *
 * 실제 환산표는 회차마다 다르고 공개되지 않는다. 여기서는 공개된 점수
 * 범위(5~495점, 5점 단위)에 맞춘 어림값을 쓴다. 실제 성적과 다를 수 있다는
 * 것을 화면에도 적어 둔다.
 */
export function scaledScore(correct: number, total: number): number {
  if (total <= 0) return 5;
  const ratio = correct / total;
  // 다 맞혀야 495 이고, 하나도 못 맞혀도 5 점에서 시작한다
  const raw = 5 + ratio * 490;
  return Math.round(raw / 5) * 5;
}
