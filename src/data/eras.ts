import type { Era, EraId } from "@/lib/types";

export const ERAS: Era[] = [
  {
    id: "prehistoric",
    name: "선사 시대",
    period: "약 70만 년 전 ~ 기원전 2333년",
    color: "#A8A29E",
    symbol: "🪨",
    mood: "돌과 불, 인류의 새벽",
    description:
      "구석기·신석기·청동기로 이어지는 도구의 혁명. 뗀석기에서 간석기, 빗살무늬 토기에서 민무늬 토기로 — 도구가 바뀌면 삶 전체가 바뀐다.",
    order: 0,
  },
  {
    id: "gojoseon",
    name: "고조선",
    period: "기원전 2333년 ~ 기원전 108년",
    color: "#D97706",
    symbol: "🌅",
    mood: "청동기 위에 세운 첫 나라",
    description:
      "단군왕검의 건국 이야기로 시작하는 우리 역사 최초의 국가. 8조법과 비파형 동검, 그리고 한나라와의 마지막 전쟁까지.",
    order: 1,
  },
  {
    id: "proto-three",
    name: "여러 나라의 성장",
    period: "기원전 2세기 ~ 기원후 3세기",
    color: "#14B8A6",
    symbol: "🌾",
    mood: "제천 행사와 철기의 시대",
    description:
      "부여·고구려·옥저·동예·삼한. 영고, 동맹, 무천 — 제천 행사와 풍습을 비교하는 문제가 시험의 단골손님이다.",
    order: 2,
  },
  {
    id: "three-kingdoms",
    name: "삼국 시대",
    period: "기원전 1세기 ~ 668년",
    color: "#3B82F6",
    symbol: "⚔️",
    mood: "세 나라, 하나의 한반도를 향해",
    description:
      "고구려·백제·신라의 전성기가 4세기(백제)→5세기(고구려)→6세기(신라) 순서로 교차한다. 전성기 순서만 잡아도 절반은 먹고 들어간다.",
    order: 3,
  },
  {
    id: "gaya",
    name: "가야",
    period: "42년 ~ 562년",
    color: "#F43F5E",
    symbol: "🔥",
    mood: "철의 왕국, 연맹의 한계",
    description:
      "김수로왕의 금관가야에서 대가야까지. 철을 팔아 부유했지만 중앙집권 국가로 성장하지 못한 채 신라에 흡수된 비운의 연맹왕국.",
    order: 4,
  },
  {
    id: "north-south",
    name: "남북국 시대",
    period: "698년 ~ 926년",
    color: "#8B5CF6",
    symbol: "👑",
    mood: "통일신라와 발해, 두 개의 하늘",
    description:
      "남쪽의 통일신라, 북쪽의 발해. 신문왕의 개혁과 해동성국 발해 — 두 나라를 비교하는 문제가 반드시 나온다.",
    order: 5,
  },
  {
    id: "goryeo",
    name: "고려",
    period: "918년 ~ 1392년",
    color: "#10B981",
    symbol: "📜",
    mood: "비색 청자와 격동의 500년",
    description:
      "태조 왕건의 건국부터 공민왕의 개혁까지. 거란·여진·몽골의 침입을 버텨내고 팔만대장경과 금속활자를 남긴 왕조.",
    order: 6,
  },
  {
    id: "joseon",
    name: "조선",
    period: "1392년 ~ 1863년",
    color: "#EF4444",
    symbol: "🏯",
    mood: "성리학의 나라, 500년의 설계",
    description:
      "이성계의 건국과 세종의 훈민정음, 임진왜란과 병자호란, 영·정조의 탕평과 세도정치까지. 출제 비중이 가장 큰 시대.",
    order: 7,
  },
  {
    id: "open-port",
    name: "개항기",
    period: "1863년 ~ 1897년",
    color: "#06B6D4",
    symbol: "🚢",
    mood: "밀려오는 파도, 흔들리는 왕조",
    description:
      "흥선대원군의 쇄국에서 강화도 조약, 임오군란·갑신정변·동학농민운동·갑오개혁까지. 사건 순서 배열 문제의 최다 출제 구간.",
    order: 8,
  },
  {
    id: "daehan-empire",
    name: "대한제국",
    period: "1897년 ~ 1910년",
    color: "#EAB308",
    symbol: "🦅",
    mood: "황제의 나라, 마지막 개혁",
    description:
      "고종이 황제로 즉위하며 선포한 제국. 광무개혁의 시도와 을사늑약, 국권 피탈까지 — 13년의 짧고 절박한 역사.",
    order: 9,
  },
  {
    id: "colonial",
    name: "일제강점기",
    period: "1910년 ~ 1945년",
    color: "#64748B",
    symbol: "🕯️",
    mood: "어둠 속에서 타오른 불꽃",
    description:
      "무단통치→문화통치→민족말살통치로 바뀌는 식민 지배 방식과, 3·1운동·대한민국 임시정부·무장투쟁으로 이어지는 저항의 역사.",
    order: 10,
  },
  {
    id: "modern",
    name: "현대",
    period: "1945년 ~ 현재",
    color: "#6366F1",
    symbol: "🏙️",
    mood: "폐허에서 일어선 나라",
    description:
      "광복과 분단, 6·25 전쟁, 4·19 혁명, 민주화 운동과 경제 성장까지. 민주주의를 향한 긴 여정이 곧 현대사다.",
    order: 11,
  },
];

export const ERA_MAP: Record<EraId, Era> = Object.fromEntries(
  ERAS.map((e) => [e.id, e]),
) as Record<EraId, Era>;

export function getEra(id: EraId): Era {
  return ERA_MAP[id];
}
