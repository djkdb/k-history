import type { Band, ListeningSet } from "@/lib/types";
import { LISTENING_P1 } from "./listening-p1";
import { LISTENING_P2 } from "./listening-p2";
import { LISTENING_P34 } from "./listening-p34";

/**
 * 듣기 문항.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * Part 1 은 사진을 보고 푸는 문제다. 사진을 실을 수 없어 장면을 글로 준다.
 * 실제 시험과 다른 점이므로 화면에서도 그대로 밝힌다. 대신 이 파트의 진짜
 * 훈련 목표 — "들리는 명사에 낚이지 말고 동사와 태를 들어라" — 는 그대로 남는다.
 */
const LISTENING_CORE: ListeningSet[] = [
  /* ─────────────────── Part 1 · 사진 묘사 ─────────────────── */
  {
    id: "l1-office-desk",
    part: 1,
    band: 600,
    scene:
      "사무실. 한 여자가 책상 앞에 앉아 노트북 화면을 보고 있다. 책상 위에는 서류 몇 장과 머그컵이 놓여 있다. 뒤쪽 선반에는 서류철이 가지런히 꽂혀 있다.",
    questions: [
      {
        id: "q-l1-office-desk-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 600,
        answer: 1,
        choices: [
          {
            text: "She's filing documents on the shelf.",
            why: "선반과 서류철은 사진에 있지만, 여자는 앉아서 화면을 보고 있다. 사진 속 물건 이름을 그대로 말해 주는 전형적인 오답이다.",
          },
          {
            text: "She's looking at a computer screen.",
            why: "정답. 사람의 동작을 그대로 옮겼다.",
          },
          {
            text: "She's pouring coffee into a cup.",
            why: "머그컵은 놓여 있을 뿐 따르는 동작은 없다. 있는 물건 + 없는 동작을 붙인 오답이다.",
          },
          {
            text: "The documents are being printed.",
            why: "서류가 인쇄되는 중이라는 진행 수동태다. 사진에는 그런 동작이 없다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-street-cafe",
    part: 1,
    band: 600,
    scene:
      "노천 카페. 테이블 여러 개에 의자가 놓여 있지만 사람은 아무도 앉아 있지 않다. 각 테이블 위에는 접힌 파라솔이 세워져 있다.",
    questions: [
      {
        id: "q-l1-street-cafe-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "Customers are being seated at the tables.",
            why: "사람이 없는 사진에 사람 동작을 넣은 오답. Part 1 에서 가장 자주 나오는 함정이다.",
          },
          {
            text: "A waiter is folding the umbrellas.",
            why: "파라솔은 이미 접혀 있다. 상태를 동작으로 바꿔 놓은 오답이다.",
          },
          {
            text: "Some chairs have been placed around the tables.",
            why: "정답. 사람이 없는 사진은 이렇게 '놓여 있다'는 완료 수동태로 묘사된다.",
          },
          {
            text: "The tables are being cleared.",
            why: "치우는 사람이 없다. 진행 수동태(be being p.p.)는 그 동작을 하는 사람이 사진에 보여야 맞는다.",
          },
        ],
      },
    ],
  },
  {
    id: "l1-warehouse",
    part: 1,
    band: 700,
    scene:
      "창고. 남자 두 명이 상자를 들어 손수레에 싣고 있다. 뒤쪽에는 상자들이 높이 쌓여 있고, 지게차 한 대가 서 있다.",
    questions: [
      {
        id: "q-l1-warehouse-1",
        audioOnlyChoices: true,
        skill: "photo",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "The men are loading boxes onto a cart.",
            why: "정답. 두 사람이 하는 동작을 그대로 옮겼다.",
          },
          {
            text: "A forklift is being operated.",
            why: "지게차는 서 있을 뿐 운전하는 사람이 없다. 있는 물건 + 없는 동작이다.",
          },
          {
            text: "The boxes are being unpacked.",
            why: "싣는 중(load)이지 푸는 중(unpack)이 아니다. 동사만 반대로 바꾼 오답이다.",
          },
          {
            text: "Some shelves are being assembled.",
            why: "조립하는 장면이 없다. 창고에 있을 법한 말을 얹은 것뿐이다.",
          },
        ],
      },
    ],
  },

  /* ─────────────────── Part 2 · 질의응답 ─────────────────── */
  {
    id: "l2-when-report",
    part: 2,
    band: 600,
    script: [{ speaker: "woman", text: "When is the quarterly report due?" }],
    questions: [
      {
        id: "q-l2-when-report-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 1,
        choices: [
          {
            text: "In the conference room.",
            why: "When 을 물었는데 장소로 답했다. 의문사를 놓치면 이런 오답에 걸린다.",
          },
          { text: "By the end of the month.", why: "정답. When 에 시점으로 답했다." },
          {
            text: "Yes, I reported it already.",
            why: "의문사 의문문에 Yes/No 로 답할 수 없다. report 라는 같은 단어를 반복해 그럴듯하게 들리게 했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-who-handles",
    part: 2,
    band: 600,
    script: [{ speaker: "man", text: "Who's handling the Peterson account now?" }],
    questions: [
      {
        id: "q-l2-who-handles-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 2,
        choices: [
          {
            text: "It's on the second shelf.",
            why: "Who 에 위치로 답했다.",
          },
          {
            text: "He handed it to me yesterday.",
            why: "handling 과 handed 는 소리가 비슷하다. Part 2 의 대표적인 유사 발음 함정이다.",
          },
          { text: "Rachel took it over last week.", why: "정답. 사람 이름으로 답했다." },
        ],
      },
    ],
  },
  {
    id: "l2-indirect",
    part: 2,
    band: 800,
    script: [
      { speaker: "woman", text: "Should we order more paper for the printer?" },
    ],
    questions: [
      {
        id: "q-l2-indirect-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "Yes, I printed it this morning.",
            why: "printer/printed 로 소리만 이었다. 주문 여부에 답하지 않았다.",
          },
          {
            text: "The order arrived on Tuesday.",
            why: "order 를 반복했지만 '더 주문할까'라는 질문에 답한 것이 아니다.",
          },
          {
            text: "I just checked the supply closet.",
            why: "정답. 직접 Yes/No 로 답하지 않고 '방금 창고를 확인했다'로 넘긴다. 고득점 구간은 이렇게 **간접적으로 답하는 선지**가 정답이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-suggestion",
    part: 2,
    band: 700,
    script: [
      { speaker: "man", text: "Why don't we move the meeting to Thursday?" },
    ],
    questions: [
      {
        id: "q-l2-suggestion-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "That works better for me, actually.",
            why: "정답. Why don't we ~ 는 이유를 묻는 것이 아니라 제안이다. 수락·거절로 답한다.",
          },
          {
            text: "Because the room was already booked.",
            why: "Why 로 시작해 이유를 답했지만, 이 문장은 제안이지 질문이 아니다.",
          },
          {
            text: "On the fourth floor.",
            why: "장소로 답했다. 제안과 무관하다.",
          },
        ],
      },
    ],
  },

  /* ─────────────────── Part 3 · 짧은 대화 ─────────────────── */
  {
    id: "l3-shipment-delay",
    part: 3,
    band: 700,
    situation: "납품 지연을 두고 구매 담당자와 물류 담당자가 이야기한다.",
    script: [
      {
        speaker: "woman",
        text: "Hi, Marcus. I'm calling about the shipment of office chairs we ordered last month. The tracking page still says it hasn't left the warehouse.",
      },
      {
        speaker: "man",
        text: "I'm sorry about that. There was a problem with the supplier — apparently the fabric we requested was out of stock, so production was held up for about two weeks.",
      },
      {
        speaker: "woman",
        text: "Two weeks? We have new staff starting on the fifteenth and they'll need somewhere to sit.",
      },
      {
        speaker: "man",
        text: "I understand. Let me see what I can do. I can send you twenty chairs from our display stock tomorrow, and the rest will follow once production catches up.",
      },
      { speaker: "woman", text: "That would help a lot. Could you e-mail me the revised delivery date?" },
      { speaker: "man", text: "Of course. I'll send it within the hour." },
    ],
    questions: [
      {
        id: "q-l3-shipment-delay-1",
        prompt: "Why is the woman calling?",
        skill: "gist",
        band: 600,
        answer: 1,
        choices: [
          { text: "To place a new order", why: "이미 지난달에 주문했다고 말한다. 새 주문이 아니다." },
          {
            text: "To ask about a delayed delivery",
            why: "정답. 첫 문장에서 '아직 창고를 안 떠났다'고 한다. 전화 목적은 거의 항상 첫 두 문장에 있다.",
          },
          { text: "To cancel a purchase", why: "취소 이야기는 나오지 않는다." },
          { text: "To report a damaged item", why: "파손이 아니라 지연이 문제다." },
        ],
      },
      {
        id: "q-l3-shipment-delay-2",
        prompt: "What caused the problem?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "A shipping error", why: "배송 실수가 아니라 생산 지연이다." },
          { text: "A staff shortage", why: "인력 부족은 언급되지 않았다." },
          {
            text: "A material was unavailable",
            why: "정답. '요청한 원단이 재고가 없어 생산이 밀렸다'고 한다.",
          },
          { text: "A change in the order", why: "주문 변경은 없었다." },
        ],
      },
      {
        id: "q-l3-shipment-delay-3",
        prompt: "What does the man agree to do?",
        skill: "next",
        band: 700,
        answer: 3,
        choices: [
          { text: "Offer a discount", why: "할인은 제안하지 않았다." },
          { text: "Visit the office", why: "방문 이야기는 없다." },
          { text: "Cancel the remaining order", why: "나머지도 생산되는 대로 보낸다고 했다." },
          {
            text: "Send an updated schedule",
            why: "정답. 마지막에 '수정된 배송일을 이메일로 보내 달라'는 요청에 그러겠다고 답한다. 마지막 문항의 답은 대화 끝에 있다.",
          },
        ],
      },
    ],
  },
  {
    id: "l3-office-move",
    part: 3,
    band: 800,
    situation: "사무실 이전을 앞두고 세 사람이 짐 정리를 의논한다.",
    script: [
      {
        speaker: "man",
        text: "So the movers are coming on Saturday morning. We need everything in boxes by Friday at six.",
      },
      {
        speaker: "woman",
        text: "That's tight. My team still has three filing cabinets to go through — a lot of it is old contracts we're supposed to keep for seven years.",
      },
      {
        speaker: "man2",
        text: "Can't we just move the cabinets as they are? Emptying them seems like extra work.",
      },
      {
        speaker: "man",
        text: "The movers charge by weight, and full cabinets would push us over the estimate. Anything we can archive off-site now will save us money.",
      },
      {
        speaker: "woman",
        text: "Then I'll book the storage service for Thursday. If they pick up the old contracts, we only have the current files left to pack.",
      },
    ],
    questions: [
      {
        id: "q-l3-office-move-1",
        prompt: "What are the speakers mainly discussing?",
        skill: "gist",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Preparing for an office relocation",
            why: "정답. 이삿짐 업체·포장 기한·보관 서비스가 이어진다.",
          },
          { text: "Hiring additional staff", why: "채용 이야기는 없다." },
          { text: "Revising a filing policy", why: "보관 연한이 언급될 뿐 정책을 바꾸지는 않는다." },
          { text: "Renewing a storage contract", why: "새로 예약하는 것이지 갱신이 아니다." },
        ],
      },
      {
        id: "q-l3-office-move-2",
        prompt:
          'Why does the man say, "The movers charge by weight"?',
        skill: "intent",
        band: 800,
        answer: 2,
        choices: [
          { text: "To complain about a price increase", why: "가격이 올랐다는 말은 없다." },
          { text: "To recommend a different company", why: "다른 업체 이야기는 나오지 않는다." },
          {
            text: "To explain why the cabinets should be emptied",
            why: "정답. 바로 앞에서 '그냥 통째로 옮기면 안 되냐'고 물었고, 이 말은 그 제안을 거절하는 근거다. 의도 파악 문제는 **바로 앞 문장**을 봐야 풀린다.",
          },
          { text: "To confirm the moving date", why: "날짜는 이미 앞에서 정해졌다." },
        ],
      },
      {
        id: "q-l3-office-move-3",
        prompt: "What will the woman do next?",
        skill: "next",
        band: 700,
        answer: 1,
        choices: [
          { text: "Contact the movers", why: "이삿짐 업체는 남자가 이미 잡았다." },
          {
            text: "Arrange an off-site pickup",
            why: "정답. 마지막에 '목요일로 보관 서비스를 예약하겠다'고 말한다.",
          },
          { text: "Review the moving estimate", why: "견적을 검토하겠다는 말은 없다." },
          { text: "Shred the old contracts", why: "7년 보관해야 해서 파기가 아니라 보관한다." },
        ],
      },
    ],
  },

  /* ─────────────────── Part 4 · 짧은 담화 ─────────────────── */
  {
    id: "l4-store-announcement",
    part: 4,
    band: 600,
    situation: "매장 안내방송.",
    script: [
      {
        speaker: "woman",
        text: "Attention, shoppers. Thank you for visiting Harborview Market. We'd like to remind you that our store will close thirty minutes earlier than usual this evening, at eight thirty, so that our staff can prepare for tomorrow's inventory count. If you're planning to use the deli counter, please note that it stops taking orders at eight o'clock. Members of our rewards program can pick up a free reusable bag at the customer service desk near the main entrance — just show your membership card. Thank you for shopping with us.",
      },
    ],
    questions: [
      {
        id: "q-l4-store-1",
        prompt: "Where is the announcement being made?",
        skill: "gist",
        band: 600,
        answer: 1,
        choices: [
          { text: "At a restaurant", why: "델리 코너가 있을 뿐 식당이 아니다." },
          { text: "At a grocery store", why: "정답. shoppers, market, deli counter 로 장소가 잡힌다." },
          { text: "At a library", why: "도서관 관련 표현이 없다." },
          { text: "At a hotel", why: "숙박 관련 표현이 없다." },
        ],
      },
      {
        id: "q-l4-store-2",
        prompt: "Why will the store close early?",
        skill: "detail",
        band: 700,
        answer: 3,
        choices: [
          { text: "For a private event", why: "행사 이야기는 없다." },
          { text: "Because of a power outage", why: "정전은 언급되지 않았다." },
          { text: "For staff training", why: "교육이 아니라 재고 조사다." },
          {
            text: "To prepare for an inventory count",
            why: "정답. '내일 재고 조사를 준비하려고'라고 밝힌다.",
          },
        ],
      },
      {
        id: "q-l4-store-3",
        prompt: "What can rewards members receive?",
        skill: "detail",
        band: 600,
        answer: 0,
        choices: [
          { text: "A free bag", why: "정답. 무료 재사용 가방을 준다고 했다." },
          { text: "A discount coupon", why: "할인권 이야기는 없다." },
          { text: "Extra points", why: "포인트는 언급되지 않았다." },
          { text: "A parking voucher", why: "주차권은 나오지 않는다." },
        ],
      },
    ],
  },
  {
    id: "l4-voicemail",
    part: 4,
    band: 700,
    situation: "치과에서 환자에게 남긴 음성메시지.",
    script: [
      {
        speaker: "man",
        text: "Good afternoon, this is Daniel calling from Bright Smile Dental. I'm phoning about your appointment scheduled for Wednesday the twelfth at three P.M. Unfortunately, Dr. Alvarez has been called away to a conference that week, so we'll need to move your visit. We have openings on Thursday the thirteenth at nine A.M., or the following Monday at four thirty. Please call us back at 555-0182 to let us know which one works, and if neither does, we can look at the week after. One more thing — since this is a cleaning appointment, please remember that your insurance covers two per year, and you've used one so far. Thanks very much.",
      },
    ],
    questions: [
      {
        id: "q-l4-voicemail-1",
        prompt: "What is the main purpose of the message?",
        skill: "gist",
        band: 600,
        answer: 2,
        choices: [
          { text: "To confirm a payment", why: "결제 이야기는 없다." },
          { text: "To advertise a new service", why: "홍보가 아니다." },
          {
            text: "To reschedule an appointment",
            why: "정답. '예약을 옮겨야 한다'가 전화의 목적이다.",
          },
          { text: "To request medical records", why: "기록 요청은 나오지 않는다." },
        ],
      },
      {
        id: "q-l4-voicemail-2",
        prompt: "Why must the appointment be changed?",
        skill: "detail",
        band: 700,
        answer: 1,
        choices: [
          { text: "The office will be closed for repairs", why: "수리 이야기는 없다." },
          {
            text: "The doctor will be attending a conference",
            why: "정답. 의사가 그 주에 학회에 간다고 했다.",
          },
          { text: "The patient requested a different time", why: "환자가 아니라 병원 사정이다." },
          { text: "The equipment is being replaced", why: "장비 교체는 언급되지 않았다." },
        ],
      },
      {
        id: "q-l4-voicemail-3",
        prompt: "What does the speaker remind the listener about?",
        skill: "detail",
        band: 800,
        answer: 3,
        choices: [
          { text: "A parking restriction", why: "주차 이야기는 없다." },
          { text: "A late-cancellation fee", why: "취소 수수료는 언급되지 않았다." },
          { text: "A change of address", why: "주소 변경은 없다." },
          {
            text: "The number of covered visits",
            why: "정답. 보험이 연 2회를 보장하고 이미 1회를 썼다고 알린다. 마지막의 One more thing 뒤가 셋째 문항의 답이 되는 일이 잦다.",
          },
        ],
      },
    ],
  },
  {
    id: "l4-tour-guide",
    part: 4,
    band: 800,
    situation: "공장 견학 안내.",
    script: [
      {
        speaker: "woman",
        text: "Welcome to the Ridgeline Ceramics factory, and thank you for joining today's tour. Before we begin, a few safety notes. Please keep the goggles you were given on at all times once we pass through the double doors — the kilns run at over a thousand degrees and small fragments can travel. We'll start in the glazing room, then move to the kiln floor, and finish in the design studio, where you'll have a chance to speak with our artisans. The whole tour takes about fifty minutes. Photography is welcome everywhere except the design studio, since the patterns you'll see there haven't been released yet. If you'd like to purchase anything, the factory shop by the entrance offers tour visitors fifteen percent off.",
      },
    ],
    questions: [
      {
        id: "q-l4-tour-1",
        prompt: "What are listeners asked to do?",
        skill: "detail",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Wear protective eyewear",
            why: "정답. 문을 지나면 보안경을 계속 쓰라고 했다.",
          },
          { text: "Leave their bags at the entrance", why: "가방 이야기는 없다." },
          { text: "Sign a visitor form", why: "서명 요청은 없다." },
          { text: "Stay with a guide at all times", why: "동행 지시는 나오지 않는다." },
        ],
      },
      {
        id: "q-l4-tour-2",
        prompt: "Where will the tour end?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "In the glazing room", why: "거기서 시작한다." },
          { text: "On the kiln floor", why: "중간 순서다." },
          { text: "In the design studio", why: "정답. 순서를 셋 다 말해 주고 마지막이 디자인 스튜디오다." },
          { text: "At the factory shop", why: "상점은 입구에 있고 견학 코스가 아니다." },
        ],
      },
      {
        id: "q-l4-tour-3",
        prompt: "Why is photography restricted in one area?",
        skill: "inference",
        band: 800,
        answer: 1,
        choices: [
          { text: "The lighting is too dim", why: "조명 이야기는 없다." },
          {
            text: "Some designs are not yet public",
            why: "정답. '아직 공개되지 않은 무늬'라고 이유를 밝힌다.",
          },
          { text: "The equipment is sensitive", why: "장비 민감성은 언급되지 않았다." },
          { text: "Visitors may block the walkway", why: "통로 이야기는 없다." },
        ],
      },
    ],
  },
];

/**
 * 파트별 문항은 파일을 갈라 둔다. 한 파일에 다 넣으면 Part 2 하나만
 * 손보려 해도 수천 줄을 스크롤해야 하고, 그러다 보면 손이 덜 가는 파트가
 * 생긴다 — 실제로 Part 2·3 이 그렇게 얇아졌었다.
 */
export const LISTENING: ListeningSet[] = [
  ...LISTENING_CORE,
  ...LISTENING_P1,
  ...LISTENING_P2,
  ...LISTENING_P34,
];

export const LISTENING_MAP: Record<string, ListeningSet> = Object.fromEntries(
  LISTENING.map((s) => [s.id, s]),
);

export function listeningFor(band: Band, part?: 1 | 2 | 3 | 4): ListeningSet[] {
  return LISTENING.filter(
    (s) => s.band <= band && (part === undefined || s.part === part),
  );
}

/** 화면에 세는 것은 지문이 아니라 문항 수다 */
export function countListeningQuestions(sets: ListeningSet[]): number {
  return sets.reduce((n, s) => n + s.questions.length, 0);
}
