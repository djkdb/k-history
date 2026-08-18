import type { ListeningSet } from "@/lib/types";

/**
 * Part 1 · 사진 묘사 — 추가 문항.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * 사진을 실을 수 없어 장면을 글로 준다. 실제 시험과 다른 점이라 화면에도
 * 그대로 밝힌다. 다만 이 파트에서 진짜 훈련해야 할 것 — 들리는 명사에
 * 낚이지 말고 **동사와 태**를 들으라는 것 — 은 글로도 그대로 남는다.
 *
 * 오답은 네 틀로만 만든다. 실제 시험의 오답이 그 넷이기 때문이다.
 *   ① 사진에 있는 물건 이름 + 사진에 없는 동작
 *   ② 사람이 없는 사진에 사람 동작
 *   ③ 놓여 있는 것(상태)을 옮기는 중(동작)으로 바꿈
 *   ④ 진행 수동태(be being p.p.) — 그 동작을 하는 사람이 보여야만 맞는다
 */
export const LISTENING_P1: ListeningSet[] = [
  {
    id: "l1-kitchen-prep",
    part: 1,
    band: 600,
    scene:
      "식당 주방. 남자 한 명이 도마 앞에서 채소를 썰고 있다. 옆 화구에는 냄비가 올려져 있고, 벽에 걸린 국자와 프라이팬이 보인다.",
    questions: [
      {
        id: "q-l1-kitchen-prep-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 600,
        answer: 2,
        choices: [
          {
            text: "He's washing the pans.",
            why: "프라이팬은 벽에 걸려 있을 뿐이다. 사진 속 물건 + 사진에 없는 동작 — 첫째 틀이다.",
          },
          {
            text: "The pots are being put away.",
            why: "치우는 사람이 없다. 진행 수동태는 그 동작을 하는 사람이 보여야 맞는다.",
          },
          {
            text: "He's cutting some vegetables.",
            why: "정답. 사람이 지금 하고 있는 동작을 그대로 옮겼다.",
          },
          {
            text: "Food is being served to customers.",
            why: "손님도, 내주는 동작도 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-library-shelves",
    part: 1,
    band: 600,
    scene:
      "도서관. 사람은 아무도 없다. 책장이 줄지어 서 있고 책이 빽빽하게 꽂혀 있다. 가운데 통로에 바퀴 달린 책 수레가 놓여 있고, 그 위에 책 몇 권이 쌓여 있다.",
    questions: [
      {
        id: "q-l1-library-shelves-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "A librarian is shelving books.",
            why: "사람이 없는 사진에 사람 동작을 넣었다. 둘째 틀이다.",
          },
          {
            text: "Some books have been stacked on a cart.",
            why: "정답. 사람이 없는 사진은 이렇게 완료 수동태(have been p.p.)로 '놓여 있다'를 말한다.",
          },
          {
            text: "The cart is being pushed down the aisle.",
            why: "미는 사람이 없다. 넷째 틀이다.",
          },
          {
            text: "Chairs are arranged around a table.",
            why: "의자도 탁자도 사진에 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-construction-site",
    part: 1,
    band: 700,
    scene:
      "공사 현장. 안전모를 쓴 남자 두 명이 도면을 함께 들여다보고 있다. 뒤쪽에 비계가 세워져 있고, 크레인 한 대가 서 있다.",
    questions: [
      {
        id: "q-l1-construction-site-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "They're examining a document.",
            why: "정답. 도면을 함께 보는 동작이다. Part 1 은 이렇게 구체적인 낱말(blueprint)을 뭉뚱그린 낱말(document)로 바꿔 내는 일이 잦다.",
          },
          {
            text: "A crane is lifting some materials.",
            why: "크레인은 서 있을 뿐 들어 올리는 중이 아니다. 첫째 틀이다.",
          },
          {
            text: "They're putting on their helmets.",
            why: "이미 쓰고 있다. 'put on(쓰는 중)'과 'wear(쓰고 있다)'를 갈라 놓는 것은 Part 1 의 단골 함정이다.",
          },
          {
            text: "Scaffolding is being taken down.",
            why: "해체하는 사람이 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-train-platform",
    part: 1,
    band: 600,
    scene:
      "기차역 승강장. 사람 몇 명이 노란 선 뒤에 서서 기다리고 있다. 열차는 아직 들어오지 않았고, 승강장 위쪽에 전광판이 켜져 있다.",
    questions: [
      {
        id: "q-l1-train-platform-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 600,
        answer: 3,
        choices: [
          {
            text: "Passengers are boarding a train.",
            why: "열차가 아직 없다. 있을 법한 장면을 넣은 오답이다.",
          },
          {
            text: "A train is pulling into the station.",
            why: "들어오는 중이 아니다.",
          },
          {
            text: "Tickets are being collected.",
            why: "표를 걷는 사람이 없다.",
          },
          {
            text: "Some people are waiting on the platform.",
            why: "정답. 사람들이 지금 하고 있는 것은 기다리는 것뿐이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-meeting-room-empty",
    part: 1,
    band: 700,
    scene:
      "회의실. 사람은 없다. 긴 탁자를 둘러 의자가 놓여 있고, 탁자 위에 물잔 여러 개와 메모지가 가지런히 준비돼 있다. 앞쪽 벽에 화면이 내려와 있다.",
    questions: [
      {
        id: "q-l1-meeting-room-empty-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "A presentation is being given.",
            why: "화면은 내려와 있지만 발표하는 사람이 없다.",
          },
          {
            text: "People are taking their seats.",
            why: "사람이 없는 사진에 사람 동작을 넣었다.",
          },
          {
            text: "Glasses have been placed on the table.",
            why: "정답. 준비돼 놓여 있는 상태를 완료 수동태로 말했다.",
          },
          {
            text: "Someone is adjusting the screen.",
            why: "만지는 사람이 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-outdoor-market",
    part: 1,
    band: 700,
    scene:
      "노천 시장. 한 여자가 좌판 앞에서 과일을 고르고 있다. 상인은 저울 옆에 서 있고, 좌판 위에는 상자에 담긴 과일이 종류별로 놓여 있다.",
    questions: [
      {
        id: "q-l1-outdoor-market-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "The vendor is weighing some fruit.",
            why: "저울 옆에 서 있을 뿐 무게를 재는 중이 아니다. 물건 + 없는 동작이다.",
          },
          {
            text: "A woman is selecting some produce.",
            why: "정답. 고르는 동작을 그대로 옮겼다. fruit 을 produce(농산물)로 바꿔 낸 것도 이 파트의 버릇이다.",
          },
          {
            text: "The boxes are being unloaded from a truck.",
            why: "트럭도 내리는 사람도 없다.",
          },
          {
            text: "Customers are lining up to pay.",
            why: "줄 서는 장면이 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-hotel-lobby",
    part: 1,
    band: 800,
    scene:
      "호텔 로비. 여자 한 명이 프런트에 서서 직원과 이야기하고 있다. 그 옆 바닥에는 여행 가방이 세워져 있다. 뒤쪽 소파에는 아무도 앉아 있지 않다.",
    questions: [
      {
        id: "q-l1-hotel-lobby-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 800,
        answer: 3,
        choices: [
          {
            text: "She's wheeling her suitcase across the lobby.",
            why: "가방은 세워져 있다. 상태를 동작으로 바꾼 셋째 틀이다.",
          },
          {
            text: "Guests are seated in the lounge area.",
            why: "소파에 앉은 사람이 없다.",
          },
          {
            text: "The luggage is being carried to a room.",
            why: "옮기는 사람이 없다.",
          },
          {
            text: "A woman is speaking with a receptionist.",
            why: "정답. 지금 하고 있는 동작이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-park-bench",
    part: 1,
    band: 600,
    scene:
      "공원. 나무 그늘 아래 벤치 두 개가 마주 놓여 있고, 그중 하나에 남자 한 명이 앉아 책을 읽고 있다. 옆에는 자전거 한 대가 세워져 있다.",
    questions: [
      {
        id: "q-l1-park-bench-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "A man is reading on a bench.",
            why: "정답. 앉아서 읽는 동작이다.",
          },
          {
            text: "He's riding a bicycle.",
            why: "자전거는 세워져 있다. 있는 물건 + 없는 동작이다.",
          },
          {
            text: "The benches are being repainted.",
            why: "칠하는 사람이 없다.",
          },
          {
            text: "Trees are being planted along the path.",
            why: "나무는 이미 서 있고 심는 사람이 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-factory-line",
    part: 1,
    band: 800,
    scene:
      "공장. 작업복을 입은 여자 한 명이 컨베이어 벨트 옆에 서서 지나가는 제품을 살펴보고 있다. 벨트 위에는 포장된 상자가 줄지어 흘러가고, 벽에는 안전 수칙이 붙어 있다.",
    questions: [
      {
        id: "q-l1-factory-line-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "She's assembling a machine.",
            why: "조립하는 것이 아니라 살펴본다. 공장이라는 배경에서 떠올릴 법한 동작을 넣은 오답이다.",
          },
          {
            text: "The safety notice is being posted.",
            why: "수칙은 이미 붙어 있고, 붙이는 사람이 없다.",
          },
          {
            text: "She's inspecting items on a conveyor belt.",
            why: "정답. 지금 하고 있는 동작을 그대로 옮겼다.",
          },
          {
            text: "Boxes are being stacked on a pallet.",
            why: "상자는 벨트 위를 흘러갈 뿐, 쌓는 사람이 없다.",
          },
        ],
      },
    ],
  },
];
