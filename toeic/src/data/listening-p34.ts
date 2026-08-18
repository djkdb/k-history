import type { ListeningSet } from "@/lib/types";

/**
 * Part 3 · 짧은 대화 / Part 4 · 짧은 담화 — 추가 지문.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * 이 두 파트가 듣기 100문항 중 69문항이다. 여기서 무너지면 듣기 점수가
 * 통째로 내려앉는다.
 *
 * 지문 하나에 문항 셋을 붙이되, 셋의 성격을 반드시 갈라 둔다.
 *   첫 문항 — 주제·장소·직업 (첫 두세 문장에 답이 있다)
 *   둘째 문항 — 세부 사항 (가운데)
 *   셋째 문항 — 다음에 할 일·요청 (마지막 문장)
 * 실제 시험이 그렇게 배치돼 있고, 그래서 "대화가 흐르는 순서대로 답이
 * 나온다"는 요령이 통한다. 이 순서를 흐트러뜨리면 연습이 되지 않는다.
 */
export const LISTENING_P34: ListeningSet[] = [
  /* ═══════════════ Part 3 · 짧은 대화 ═══════════════ */
  {
    id: "l3-hotel-checkin",
    part: 3,
    band: 600,
    situation: "호텔 프런트에서 예약이 확인되지 않는 상황",
    script: [
      {
        speaker: "man",
        text: "Hi, I have a reservation under Park — checking in for two nights.",
      },
      {
        speaker: "woman",
        text: "Let me see... I'm not finding it. Did you book through our website or a travel agency?",
      },
      {
        speaker: "man",
        text: "Through an agency. I have the confirmation number on my phone if that helps.",
      },
      {
        speaker: "woman",
        text: "That would be perfect. While you look for it, I'll go ahead and hold a room for you so you don't lose it.",
      },
    ],
    questions: [
      {
        id: "q-l3-hotel-checkin-1",
        prompt: "Where most likely are the speakers?",
        skill: "gist",
        band: 600,
        answer: 2,
        choices: [
          { text: "At a travel agency", why: "여행사는 예약한 곳으로 언급될 뿐, 지금 있는 곳이 아니다." },
          { text: "At an airport counter", why: "공항 이야기는 나오지 않는다." },
          {
            text: "At a hotel front desk",
            why: "정답. '이틀 묵으러 체크인한다'는 첫 문장에서 정해진다. 장소 문제의 답은 거의 늘 첫 두 문장에 있다.",
          },
          { text: "At a conference registration table", why: "행사 등록 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-hotel-checkin-2",
        prompt: "What is the problem?",
        skill: "detail",
        band: 600,
        answer: 1,
        choices: [
          { text: "The man arrived too early.", why: "도착 시각은 언급되지 않았다." },
          {
            text: "The woman cannot locate the reservation.",
            why: "정답. \"I'm not finding it\" 이 그대로 문제다.",
          },
          { text: "The room rate has changed.", why: "요금 이야기는 나오지 않는다." },
          { text: "The man lost his phone.", why: "전화기는 확인번호를 찾는 데 쓰인다. 잃어버렸다는 말은 없다." },
        ],
      },
      {
        id: "q-l3-hotel-checkin-3",
        prompt: "What will the woman do next?",
        skill: "next",
        band: 700,
        answer: 3,
        choices: [
          { text: "Call the travel agency", why: "전화하겠다는 말은 없다." },
          { text: "Refund the deposit", why: "환불 이야기는 나오지 않는다." },
          { text: "Print a receipt", why: "영수증 이야기는 없다." },
          {
            text: "Set aside a room for the man",
            why: "정답. 마지막 문장의 \"I'll go ahead and hold a room\" 이다. '다음에 할 일'은 늘 마지막 한두 문장에 있다.",
          },
        ],
      },
    ],
    links: ["v-confirm", "v-available"],
  },
  {
    id: "l3-invoice-error",
    part: 3,
    band: 700,
    situation: "청구서 금액이 잘못 나온 것을 두고 거래처와 통화",
    script: [
      {
        speaker: "woman",
        text: "I'm calling about invoice 4417 — we were charged for fifty units, but we only received forty.",
      },
      {
        speaker: "man",
        text: "I apologize. Let me pull up the shipping record... Yes, ten units were backordered and shipped separately.",
      },
      {
        speaker: "woman",
        text: "We never got that second shipment. Our warehouse logged only one delivery this month.",
      },
      {
        speaker: "man",
        text: "Then I'll issue a credit for the ten units today, and I'll have our logistics team trace the missing box.",
      },
    ],
    questions: [
      {
        id: "q-l3-invoice-error-1",
        prompt: "Why is the woman calling?",
        skill: "gist",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "To dispute a charge on an invoice",
            why: "정답. 첫 문장에서 '50개 값이 청구됐는데 40개만 받았다'고 밝힌다.",
          },
          { text: "To place a new order", why: "새 주문 이야기는 나오지 않는다." },
          { text: "To change a delivery address", why: "주소 이야기는 없다." },
          { text: "To request a product catalog", why: "카탈로그는 언급되지 않는다." },
        ],
      },
      {
        id: "q-l3-invoice-error-2",
        prompt: "What does the man say about the ten units?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "They were damaged in transit.", why: "파손 이야기는 나오지 않는다." },
          { text: "They were canceled by the buyer.", why: "취소된 적 없다." },
          {
            text: "They were sent in a separate shipment.",
            why: "정답. backordered 되어 따로 보냈다고 말한다. 이 낱말을 몰라도 shipped separately 로 잡힌다.",
          },
          { text: "They are out of stock indefinitely.", why: "재고가 영영 없다는 말은 없다." },
        ],
      },
      {
        id: "q-l3-invoice-error-3",
        prompt: "What does the man agree to do?",
        skill: "next",
        band: 700,
        answer: 1,
        choices: [
          { text: "Visit the warehouse in person", why: "직접 가겠다는 말은 없다." },
          {
            text: "Issue a credit and investigate the missing items",
            why: "정답. 마지막 문장에 둘 다 나온다.",
          },
          { text: "Send a replacement order overnight", why: "다시 보내겠다고는 하지 않았다. 우선 금액을 돌려준다." },
          { text: "Cancel the account", why: "거래 중단 이야기는 없다." },
        ],
      },
    ],
    links: ["v-invoice", "v-shipment"],
  },
  {
    id: "l3-interview-schedule",
    part: 3,
    band: 600,
    situation: "면접 일정을 잡는 인사팀과 팀장의 대화",
    script: [
      {
        speaker: "man",
        text: "We have four candidates for the analyst position. When are you free next week?",
      },
      {
        speaker: "woman",
        text: "Tuesday and Wednesday mornings work. Afternoons I'm in the quarterly planning sessions.",
      },
      {
        speaker: "man",
        text: "Two mornings should be enough for four interviews. Should I book the small meeting room?",
      },
      {
        speaker: "woman",
        text: "Use the one on the fourth floor instead — it has the video setup, and one candidate is joining remotely.",
      },
    ],
    questions: [
      {
        id: "q-l3-interview-schedule-1",
        prompt: "What are the speakers mainly discussing?",
        skill: "gist",
        band: 600,
        answer: 3,
        choices: [
          { text: "A budget proposal", why: "예산 이야기는 나오지 않는다." },
          { text: "A software upgrade", why: "video setup 이 나오지만 장비 도입 이야기가 아니다." },
          { text: "A company relocation", why: "이사 이야기는 없다." },
          {
            text: "Arranging job interviews",
            why: "정답. 첫 문장에서 '지원자 네 명'과 '언제 시간이 되느냐'로 주제가 정해진다.",
          },
        ],
      },
      {
        id: "q-l3-interview-schedule-2",
        prompt: "Why is the woman unavailable in the afternoons?",
        skill: "detail",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "She has planning meetings.",
            why: "정답. quarterly planning sessions 라고 밝힌다.",
          },
          { text: "She works from home.", why: "재택 이야기는 없다." },
          { text: "She is traveling.", why: "출장 이야기는 나오지 않는다." },
          { text: "She is training new hires.", why: "교육 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-interview-schedule-3",
        prompt: "Why does the woman suggest the fourth-floor room?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "It is larger.", why: "크기 이야기는 나오지 않는다." },
          { text: "It is closer to her office.", why: "거리 이야기는 없다." },
          {
            text: "It has equipment for a remote participant.",
            why: "정답. '화상 장비가 있고 한 명은 원격으로 참여한다'가 이유다.",
          },
          { text: "It is available all week.", why: "일정이 아니라 장비가 이유다." },
        ],
      },
    ],
    links: ["v-schedule", "v-apply"],
  },
  {
    id: "l3-store-return",
    part: 3,
    band: 600,
    situation: "영수증 없이 반품하러 온 손님",
    script: [
      {
        speaker: "woman",
        text: "I'd like to return this jacket. It's the wrong size, but I don't have the receipt.",
      },
      {
        speaker: "man",
        text: "No problem — if you paid by card, I can look up the purchase. Do you remember roughly when you bought it?",
      },
      { speaker: "woman", text: "Maybe three weeks ago? Early last month." },
      {
        speaker: "man",
        text: "That's within our thirty-day window, so you're fine. Let me just scan your card and I'll process it.",
      },
    ],
    questions: [
      {
        id: "q-l3-store-return-1",
        prompt: "What does the woman want to do?",
        skill: "gist",
        band: 600,
        answer: 1,
        choices: [
          { text: "Exchange an item for a different color", why: "색이 아니라 치수가 문제다." },
          {
            text: "Return a purchase",
            why: "정답. \"I'd like to return this jacket\" 이 그대로다.",
          },
          { text: "Apply for a store card", why: "카드 발급 이야기가 아니다." },
          { text: "Ask about a sale", why: "할인 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-store-return-2",
        prompt: "What problem does the woman mention?",
        skill: "detail",
        band: 600,
        answer: 2,
        choices: [
          { text: "The item is damaged.", why: "파손 이야기는 없다." },
          { text: "The store is closing soon.", why: "영업 시간 이야기는 나오지 않는다." },
          {
            text: "She does not have a receipt.",
            why: "정답. 첫 문장 끝에 붙여 말한다. 문제는 이렇게 뒤에 슬쩍 붙는 일이 잦다.",
          },
          { text: "She paid in cash.", why: "카드로 냈기에 조회가 가능하다." },
        ],
      },
      {
        id: "q-l3-store-return-3",
        prompt: "What will the man do next?",
        skill: "next",
        band: 600,
        answer: 3,
        choices: [
          { text: "Call a manager", why: "관리자를 부르지 않는다." },
          { text: "Order a different size", why: "다른 치수 주문 이야기는 없다." },
          { text: "Print a new receipt", why: "영수증을 새로 뽑는다는 말은 없다." },
          {
            text: "Look up the purchase with her card",
            why: "정답. 마지막 문장의 \"Let me just scan your card\" 다.",
          },
        ],
      },
    ],
    links: ["v-receipt", "v-refund"],
  },
  {
    id: "l3-three-speaker-catering",
    part: 3,
    band: 800,
    situation: "세 사람이 행사 다과 준비를 두고 의논한다 (3인 대화)",
    script: [
      {
        speaker: "woman",
        text: "The catering quote came in at eighteen hundred. That's over what we set aside.",
      },
      {
        speaker: "man",
        text: "How much over? If it's a couple hundred, I can move money from the printing line.",
      },
      { speaker: "woman", text: "Three hundred, roughly." },
      {
        speaker: "man2",
        text: "Before we shift anything — did they quote for eighty people? Only sixty have registered.",
      },
      {
        speaker: "woman",
        text: "Good catch. I'll ask them to requote for sixty and we may not need to move a thing.",
      },
    ],
    questions: [
      {
        id: "q-l3-three-speaker-catering-1",
        prompt: "What is the main topic of the conversation?",
        skill: "gist",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "A catering cost that exceeds the budget",
            why: "정답. 첫 문장에서 견적이 배정액을 넘었다고 밝힌다.",
          },
          { text: "A change of venue", why: "장소 이야기는 나오지 않는다." },
          { text: "A printing deadline", why: "인쇄비는 돈을 옮겨 올 곳으로만 언급된다." },
          { text: "A registration system failure", why: "등록 시스템 고장 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-three-speaker-catering-2",
        prompt: "What does the second man point out?",
        skill: "detail",
        band: 800,
        answer: 2,
        choices: [
          { text: "The quote expired.", why: "견적 유효기간 이야기는 없다." },
          { text: "The event was postponed.", why: "연기 이야기는 나오지 않는다." },
          {
            text: "The quote may be for too many guests.",
            why: "정답. '80명 기준으로 견적을 냈느냐, 등록은 60명인데'가 그것이다. 3인 대화에서는 세 번째 사람이 이렇게 판을 뒤집는 말을 자주 한다.",
          },
          { text: "The caterer has poor reviews.", why: "평판 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-three-speaker-catering-3",
        prompt: "What will the woman most likely do next?",
        skill: "next",
        band: 800,
        answer: 1,
        choices: [
          { text: "Cancel the catering order", why: "취소하겠다는 말은 없다." },
          {
            text: "Request a revised quote",
            why: "정답. 마지막 문장의 \"I'll ask them to requote for sixty\" 다.",
          },
          { text: "Transfer money from the printing budget", why: "그럴 필요가 없을지도 모른다고 말하며 미뤘다." },
          { text: "Email the registered guests", why: "참석자에게 연락한다는 말은 없다." },
        ],
      },
    ],
    links: ["v-expense", "v-estimate"],
  },
  {
    id: "l3-lab-equipment",
    part: 3,
    band: 700,
    situation: "장비 점검 때문에 실험 일정을 미루는 대화",
    script: [
      {
        speaker: "man",
        text: "Maintenance is servicing the analyzer all day Thursday. Can your team run the samples Wednesday instead?",
      },
      {
        speaker: "woman",
        text: "Wednesday's tight — the samples don't finish preparing until noon.",
      },
      {
        speaker: "man",
        text: "Would an afternoon slot work? I can reserve two to five for you.",
      },
      {
        speaker: "woman",
        text: "That works. I'll let my technicians know and move our staff meeting to Friday.",
      },
    ],
    questions: [
      {
        id: "q-l3-lab-equipment-1",
        prompt: "Why does the man want to change the schedule?",
        skill: "gist",
        band: 700,
        answer: 3,
        choices: [
          { text: "A technician is on leave.", why: "휴가 이야기는 나오지 않는다." },
          { text: "The samples were contaminated.", why: "시료 오염 이야기는 없다." },
          { text: "A deadline was moved up.", why: "마감 이야기는 없다." },
          {
            text: "Equipment will be serviced on Thursday.",
            why: "정답. 첫 문장에서 목요일에 점검이 있다고 밝힌다.",
          },
        ],
      },
      {
        id: "q-l3-lab-equipment-2",
        prompt: "What concern does the woman raise?",
        skill: "detail",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "The samples will not be ready until midday.",
            why: "정답. \"don't finish preparing until noon\" 이다.",
          },
          { text: "Her team lacks training.", why: "교육 이야기는 없다." },
          { text: "The room is already booked.", why: "예약 충돌 이야기는 나오지 않는다." },
          { text: "The analyzer is inaccurate.", why: "정확도 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-lab-equipment-3",
        prompt: "What does the woman say she will do?",
        skill: "next",
        band: 700,
        answer: 2,
        choices: [
          { text: "Cancel the samples", why: "시료를 취소한다는 말은 없다." },
          { text: "Service the analyzer herself", why: "점검은 정비팀이 한다." },
          {
            text: "Reschedule a meeting",
            why: "정답. 마지막 문장에서 직원 회의를 금요일로 옮기겠다고 한다.",
          },
          { text: "Hire additional technicians", why: "채용 이야기는 없다." },
        ],
      },
    ],
  },
  {
    id: "l3-office-supplies-vendor",
    part: 3,
    band: 700,
    situation: "사무용품 거래처를 바꿀지 의논",
    script: [
      {
        speaker: "woman",
        text: "Our current supplier raised prices again — that's twice this year.",
      },
      {
        speaker: "man",
        text: "I've been getting quotes. One vendor is about twelve percent cheaper, but their minimum order is large.",
      },
      {
        speaker: "woman",
        text: "How large? We don't have room to store much beyond a month's worth.",
      },
      {
        speaker: "man",
        text: "Two months' supply per order. Maybe we split deliveries with the branch downtown — I'll ask their office manager.",
      },
    ],
    questions: [
      {
        id: "q-l3-office-supplies-vendor-1",
        prompt: "What problem do the speakers discuss?",
        skill: "gist",
        band: 700,
        answer: 1,
        choices: [
          { text: "A delivery arrived late.", why: "배송 지연 이야기는 나오지 않는다." },
          {
            text: "A supplier has increased its prices.",
            why: "정답. 첫 문장에서 올해만 두 번 올렸다고 밝힌다.",
          },
          { text: "An order was the wrong size.", why: "주문 오류 이야기는 없다." },
          { text: "A contract has expired.", why: "계약 만료 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-office-supplies-vendor-2",
        prompt: "What is the drawback of the cheaper vendor?",
        skill: "detail",
        band: 700,
        answer: 3,
        choices: [
          { text: "Slower shipping", why: "배송 속도 이야기는 없다." },
          { text: "Lower quality", why: "품질 이야기는 나오지 않는다." },
          { text: "No online ordering", why: "주문 방식 이야기는 없다." },
          {
            text: "A high minimum order quantity",
            why: "정답. 싸지만 최소 주문량이 크다고 말한다. Part 3 는 이렇게 '좋은데 이것이 걸린다'를 자주 묻는다.",
          },
        ],
      },
      {
        id: "q-l3-office-supplies-vendor-3",
        prompt: "What does the man suggest?",
        skill: "next",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Sharing orders with another office",
            why: "정답. 시내 지점과 배송을 나눠 보자고 한다.",
          },
          { text: "Renting additional storage", why: "창고를 빌리자는 말은 없다." },
          { text: "Negotiating with the current supplier", why: "지금 거래처와 협상하자는 말은 나오지 않는다." },
          { text: "Reducing monthly usage", why: "사용량을 줄이자는 말은 없다." },
        ],
      },
    ],
    links: ["v-order", "v-inventory"],
  },
  {
    id: "l3-parking-permit",
    part: 3,
    band: 600,
    situation: "신입 직원이 주차 허가증을 신청한다",
    script: [
      {
        speaker: "man",
        text: "I started on Monday and I was told to ask you about a parking permit.",
      },
      {
        speaker: "woman",
        text: "Sure. Fill out this form and bring me a copy of your vehicle registration.",
      },
      { speaker: "man", text: "I don't have that with me. Can I email it this afternoon?" },
      {
        speaker: "woman",
        text: "That's fine. In the meantime, take this temporary pass — it's good for a week.",
      },
    ],
    questions: [
      {
        id: "q-l3-parking-permit-1",
        prompt: "What does the man want?",
        skill: "gist",
        band: 600,
        answer: 2,
        choices: [
          { text: "A new office key", why: "열쇠 이야기는 없다." },
          { text: "A schedule change", why: "일정 이야기는 나오지 않는다." },
          {
            text: "A parking permit",
            why: "정답. 첫 문장에 그대로 있다.",
          },
          { text: "A company vehicle", why: "회사 차량이 아니라 본인 차의 주차다." },
        ],
      },
      {
        id: "q-l3-parking-permit-2",
        prompt: "What does the woman ask the man to provide?",
        skill: "detail",
        band: 600,
        answer: 1,
        choices: [
          { text: "A photo ID", why: "신분증이 아니라 차량 등록증이다." },
          {
            text: "A copy of his vehicle registration",
            why: "정답. 양식과 함께 요구한 것이다.",
          },
          { text: "A signed contract", why: "계약서 이야기는 없다." },
          { text: "A deposit", why: "보증금 이야기는 나오지 않는다." },
        ],
      },
      {
        id: "q-l3-parking-permit-3",
        prompt: "What does the woman give the man?",
        skill: "next",
        band: 600,
        answer: 3,
        choices: [
          { text: "A parking map", why: "지도 이야기는 없다." },
          { text: "A refund", why: "환불 이야기는 없다." },
          { text: "A permanent permit", why: "정식 허가증은 서류를 받은 뒤에 나온다." },
          {
            text: "A temporary pass",
            why: "정답. 일주일짜리 임시 출입증을 준다.",
          },
        ],
      },
    ],
  },
  {
    id: "l3-website-redesign",
    part: 3,
    band: 800,
    situation: "웹사이트 개편 일정과 우선순위를 두고 팀장과 개발자가 의논",
    script: [
      {
        speaker: "woman",
        text: "The redesign is supposed to launch the first of next month, but the mobile pages still aren't done.",
      },
      {
        speaker: "man",
        text: "We could launch the desktop version on time and add mobile two weeks later.",
      },
      {
        speaker: "woman",
        text: "Over sixty percent of our traffic is mobile. Launching without it would look worse than launching late.",
      },
      {
        speaker: "man",
        text: "Then let's push the whole thing to the fifteenth. I'll draft a note to the marketing team so they can move the announcement.",
      },
    ],
    questions: [
      {
        id: "q-l3-website-redesign-1",
        prompt: "What is the woman concerned about?",
        skill: "gist",
        band: 800,
        answer: 3,
        choices: [
          { text: "The cost of the redesign", why: "비용 이야기는 나오지 않는다." },
          { text: "A security problem", why: "보안 이야기는 없다." },
          { text: "A staff shortage", why: "인력 이야기는 나오지 않는다." },
          {
            text: "Part of the site is not ready for launch.",
            why: "정답. 모바일 페이지가 아직 안 됐다는 것이 문제다.",
          },
        ],
      },
      {
        id: "q-l3-website-redesign-2",
        prompt: "Why does the woman reject the man's first suggestion?",
        skill: "inference",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Most visitors use mobile devices.",
            why: "정답. '트래픽의 60% 이상이 모바일'이라는 숫자가 곧 거절의 이유다. 이유를 대놓고 말하지 않고 숫자로 말하는 형태다.",
          },
          { text: "The desktop version has bugs.", why: "데스크톱에 문제가 있다는 말은 없다." },
          { text: "Marketing already announced the date.", why: "공지는 뒤에 옮기면 되는 것으로 나온다." },
          { text: "Two weeks is not enough time.", why: "기간이 짧아서가 아니라 모바일 없이 여는 것이 문제다." },
        ],
      },
      {
        id: "q-l3-website-redesign-3",
        prompt: "What will the man do?",
        skill: "next",
        band: 700,
        answer: 2,
        choices: [
          { text: "Hire a contractor", why: "외주 이야기는 없다." },
          { text: "Test the mobile pages", why: "시험 이야기는 나오지 않는다." },
          {
            text: "Notify the marketing team",
            why: "정답. 마케팅팀에 알리는 메모를 쓰겠다고 한다.",
          },
          { text: "Launch the desktop site", why: "전체를 15일로 미루기로 했다." },
        ],
      },
    ],
  },
  {
    id: "l3-train-delay",
    part: 3,
    band: 700,
    situation: "출장길에 기차가 지연되어 일정을 조정",
    script: [
      {
        speaker: "man",
        text: "My train's delayed ninety minutes. I won't make the two o'clock site visit.",
      },
      {
        speaker: "woman",
        text: "The client can't move it — they have an inspection right after. Could you join by video?",
      },
      {
        speaker: "man",
        text: "From the station? The signal there is unreliable. What if you lead it and I take the follow-up call tomorrow?",
      },
      {
        speaker: "woman",
        text: "Works for me. Send me your notes before two and I'll walk them through it.",
      },
    ],
    questions: [
      {
        id: "q-l3-train-delay-1",
        prompt: "What is the man's problem?",
        skill: "gist",
        band: 700,
        answer: 1,
        choices: [
          { text: "He missed his train.", why: "놓친 것이 아니라 기차가 늦어진다." },
          {
            text: "His travel is delayed.",
            why: "정답. 90분 지연으로 2시 일정에 못 간다.",
          },
          { text: "He lost the client's address.", why: "주소 이야기는 없다." },
          { text: "His phone is broken.", why: "신호가 약하다는 말은 있어도 고장은 아니다." },
        ],
      },
      {
        id: "q-l3-train-delay-2",
        prompt: "Why does the man decline the woman's suggestion?",
        skill: "detail",
        band: 800,
        answer: 2,
        choices: [
          { text: "He does not have a laptop.", why: "장비 이야기는 없다." },
          { text: "The client prefers in-person meetings.", why: "고객 선호 이야기는 나오지 않는다." },
          {
            text: "The station has a poor connection.",
            why: "정답. \"The signal there is unreliable\" 이다.",
          },
          { text: "He will still be on the train.", why: "역에서 접속하는 것이 문제로 다뤄진다." },
        ],
      },
      {
        id: "q-l3-train-delay-3",
        prompt: "What is the man asked to do before two o'clock?",
        skill: "next",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Send his notes",
            why: "정답. 마지막 문장의 \"Send me your notes before two\" 다.",
          },
          { text: "Call the client directly", why: "고객에게 직접 전화하라는 말은 없다." },
          { text: "Book a later train", why: "기차를 다시 잡는 이야기는 없다." },
          { text: "Cancel the follow-up call", why: "후속 통화는 내일 그가 맡기로 했다." },
        ],
      },
    ],
    links: ["v-delay"],
  },
  {
    id: "l3-membership-renewal",
    part: 3,
    band: 600,
    situation: "협회 회원 갱신 문의",
    script: [
      {
        speaker: "woman",
        text: "My membership expires at the end of the month. Is the renewal fee still ninety dollars?",
      },
      {
        speaker: "man",
        text: "It went up to a hundred in January, but members who renew early keep the old rate.",
      },
      { speaker: "woman", text: "How early is early?" },
      {
        speaker: "man",
        text: "At least two weeks before expiration — so you'd need to do it by the fifteenth. I can take care of it now if you'd like.",
      },
    ],
    questions: [
      {
        id: "q-l3-membership-renewal-1",
        prompt: "What is the woman calling about?",
        skill: "gist",
        band: 600,
        answer: 2,
        choices: [
          { text: "A refund", why: "환불 이야기는 없다." },
          { text: "A lost membership card", why: "카드 분실 이야기는 나오지 않는다." },
          {
            text: "Renewing her membership",
            why: "정답. 만료가 다가와 갱신비를 묻는다.",
          },
          { text: "Joining for the first time", why: "이미 회원이다." },
        ],
      },
      {
        id: "q-l3-membership-renewal-2",
        prompt: "What does the man say about the fee?",
        skill: "detail",
        band: 700,
        answer: 1,
        choices: [
          { text: "It will decrease next year.", why: "내릴 것이라는 말은 없다." },
          {
            text: "It increased, but early renewers pay the old price.",
            why: "정답. 1월에 100달러로 올랐지만 일찍 갱신하면 이전 요금이라고 말한다.",
          },
          { text: "It is waived for long-time members.", why: "면제 이야기는 없다." },
          { text: "It depends on the membership type.", why: "종류에 따른 차이는 언급되지 않는다." },
        ],
      },
      {
        id: "q-l3-membership-renewal-3",
        prompt: "By when must the woman renew to keep the current rate?",
        skill: "detail",
        band: 700,
        answer: 3,
        choices: [
          { text: "By the end of the month", why: "그때는 만료일이다. 그보다 앞서야 한다." },
          { text: "In January", why: "1월은 요금이 오른 시점이다." },
          { text: "Within two days", why: "이틀이 아니라 만료 2주 전이다." },
          {
            text: "By the fifteenth",
            why: "정답. '만료 2주 전 = 15일까지'라고 남자가 계산해 준다. 이렇게 조건을 날짜로 바꿔 주는 문장이 답이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l3-cafeteria-feedback",
    part: 3,
    band: 800,
    situation: "구내식당 설문 결과를 두고 총무팀 세 사람이 이야기한다 (3인 대화)",
    script: [
      {
        speaker: "man",
        text: "The cafeteria survey came back. The complaint we saw most was the wait at lunch.",
      },
      {
        speaker: "woman",
        text: "Not the food itself? I expected menu variety to top the list.",
      },
      {
        speaker: "man",
        text: "Variety was second. But eleven-thirty to twelve-thirty, the line goes out the door.",
      },
      {
        speaker: "woman2",
        text: "Some departments could shift their lunch hour. Marketing already eats at one.",
      },
      {
        speaker: "man",
        text: "Let me put together staggered lunch times and run it past the department heads.",
      },
    ],
    questions: [
      {
        id: "q-l3-cafeteria-feedback-1",
        prompt: "What was the most common complaint?",
        skill: "detail",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Long waiting times",
            why: "정답. 'the wait at lunch' 가 가장 많았다고 말한다.",
          },
          {
            text: "Limited menu variety",
            why: "둘째였다. 첫째와 둘째를 바꿔 놓는 것은 Part 3 의 흔한 함정이다.",
          },
          { text: "High prices", why: "가격 이야기는 나오지 않는다." },
          { text: "Poor seating", why: "좌석 이야기는 없다." },
        ],
      },
      {
        id: "q-l3-cafeteria-feedback-2",
        prompt: "What does the second woman suggest?",
        skill: "detail",
        band: 800,
        answer: 2,
        choices: [
          { text: "Expanding the cafeteria", why: "공간을 넓히자는 말은 없다." },
          { text: "Hiring more kitchen staff", why: "인력 이야기는 나오지 않는다." },
          {
            text: "Having departments eat at different times",
            why: "정답. 마케팅은 이미 1시에 먹는다며 시간을 나누자고 한다.",
          },
          { text: "Adding more menu options", why: "메뉴를 늘리자는 말은 하지 않는다." },
        ],
      },
      {
        id: "q-l3-cafeteria-feedback-3",
        prompt: "What will the first man do next?",
        skill: "next",
        band: 700,
        answer: 1,
        choices: [
          { text: "Conduct another survey", why: "설문을 다시 하겠다는 말은 없다." },
          {
            text: "Prepare a proposal for the department heads",
            why: "정답. 시차 점심 안을 만들어 부서장들에게 보이겠다고 한다.",
          },
          { text: "Meet with the food supplier", why: "납품업체 이야기는 없다." },
          { text: "Post the survey results", why: "결과 게시 이야기는 나오지 않는다." },
        ],
      },
    ],
  },

  /* ═══════════════ Part 4 · 짧은 담화 ═══════════════ */
  {
    id: "l4-flight-boarding",
    part: 4,
    band: 600,
    situation: "탑승구가 바뀐 것을 알리는 공항 안내방송",
    script: [
      {
        speaker: "narrator",
        text: "Attention passengers on Flight 812 to Vancouver. This flight will now depart from Gate C14, not Gate B7 as originally posted. The change is due to an aircraft substitution — we are using a larger plane this evening, so there will be additional seats available for standby passengers. Boarding will begin in approximately twenty minutes. Passengers requiring assistance are invited to come to the podium at Gate C14 now, and we will board you first. We apologize for any inconvenience.",
      },
    ],
    questions: [
      {
        id: "q-l4-flight-boarding-1",
        prompt: "What is the purpose of the announcement?",
        skill: "gist",
        band: 600,
        answer: 1,
        choices: [
          { text: "To announce a flight cancellation", why: "결항이 아니라 탑승구 변경이다." },
          {
            text: "To announce a gate change",
            why: "정답. 첫 두 문장에서 C14 로 바뀌었다고 밝힌다.",
          },
          { text: "To describe a new route", why: "노선 이야기는 없다." },
          { text: "To collect boarding passes", why: "탑승권 수거 이야기가 아니다." },
        ],
      },
      {
        id: "q-l4-flight-boarding-2",
        prompt: "Why was the change made?",
        skill: "detail",
        band: 700,
        answer: 3,
        choices: [
          { text: "Because of bad weather", why: "날씨 이야기는 나오지 않는다." },
          { text: "Because of a mechanical failure", why: "고장이 아니라 기종 교체다." },
          { text: "Because of a crew shortage", why: "승무원 이야기는 없다." },
          {
            text: "Because a different aircraft is being used",
            why: "정답. aircraft substitution 이라고 밝히고, 더 큰 비행기라고 덧붙인다.",
          },
        ],
      },
      {
        id: "q-l4-flight-boarding-3",
        prompt: "What are some passengers invited to do now?",
        skill: "next",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "Go to the podium for early boarding",
            why: "정답. 도움이 필요한 승객은 지금 안내대로 오면 먼저 태워 준다.",
          },
          { text: "Rebook their tickets", why: "재예약 이야기는 없다." },
          { text: "Claim their baggage", why: "수하물 이야기는 나오지 않는다." },
          { text: "Return to the ticket counter", why: "발권 창구 이야기는 없다." },
        ],
      },
    ],
  },
  {
    id: "l4-radio-traffic",
    part: 4,
    band: 700,
    situation: "라디오 교통 정보",
    script: [
      {
        speaker: "woman",
        text: "And now your afternoon traffic. The northbound lanes of Route 9 are down to a single lane between the bridge and Exit 12 while crews repair a section of guardrail. Expect delays of twenty to thirty minutes through the evening rush. If you're heading north, Riverside Drive is running clear and adds only about five minutes. Crews expect to reopen all lanes by tomorrow morning. We'll have another update at the top of the hour, right after the weather.",
      },
    ],
    questions: [
      {
        id: "q-l4-radio-traffic-1",
        prompt: "What is causing the delay?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "A traffic accident", why: "사고 이야기는 나오지 않는다." },
          { text: "A public event", why: "행사 이야기는 없다." },
          {
            text: "Road repair work",
            why: "정답. 가드레일 보수 때문에 한 차로만 쓴다.",
          },
          { text: "Severe weather", why: "날씨는 뒤에 이어질 순서로만 언급된다." },
        ],
      },
      {
        id: "q-l4-radio-traffic-2",
        prompt: "What does the speaker recommend?",
        skill: "detail",
        band: 700,
        answer: 1,
        choices: [
          { text: "Delaying travel until tomorrow", why: "내일 아침 개통은 알려 주지만 미루라고 하지는 않는다." },
          {
            text: "Taking an alternate road",
            why: "정답. Riverside Drive 로 가면 5분만 더 걸린다고 권한다.",
          },
          { text: "Using public transportation", why: "대중교통 이야기는 없다." },
          { text: "Avoiding the evening rush", why: "퇴근길에 막힌다고 알릴 뿐 피하라고 하지 않는다." },
        ],
      },
      {
        id: "q-l4-radio-traffic-3",
        prompt: "What will listeners hear next?",
        skill: "next",
        band: 700,
        answer: 3,
        choices: [
          { text: "Another traffic update", why: "교통 정보는 정시에 다시 나온다 — 바로 다음이 아니다." },
          { text: "A news bulletin", why: "뉴스 이야기는 없다." },
          { text: "A commercial break", why: "광고 이야기는 나오지 않는다." },
          {
            text: "A weather report",
            why: "정답. \"right after the weather\" 는 날씨가 먼저라는 뜻이다. 순서를 뒤집어 듣기 쉬운 자리다.",
          },
        ],
      },
    ],
  },
  {
    id: "l4-orientation-welcome",
    part: 4,
    band: 600,
    situation: "신입사원 오리엔테이션 첫 인사",
    script: [
      {
        speaker: "man",
        text: "Good morning, and welcome to Halden Manufacturing. I'm Daniel from Human Resources, and I'll be with you for today's session. This morning we'll cover benefits, payroll, and safety procedures. After lunch, you'll split into groups and tour the facility with your department supervisors — please wear closed-toe shoes for that part. Before we begin, check the folder on your table. If your name is spelled incorrectly on the badge inside, let me know at the first break so we can reprint it today.",
      },
    ],
    questions: [
      {
        id: "q-l4-orientation-welcome-1",
        prompt: "Who most likely is the speaker?",
        skill: "gist",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "A human resources employee",
            why: "정답. 두 번째 문장에서 스스로 밝힌다.",
          },
          { text: "A department supervisor", why: "부서 관리자는 오후 견학을 맡는 다른 사람들이다." },
          { text: "A safety inspector", why: "안전 절차를 다룰 뿐 점검관은 아니다." },
          { text: "A factory technician", why: "기술직 이야기는 없다." },
        ],
      },
      {
        id: "q-l4-orientation-welcome-2",
        prompt: "What will the listeners do in the afternoon?",
        skill: "detail",
        band: 600,
        answer: 2,
        choices: [
          { text: "Complete payroll forms", why: "급여는 오전 순서다." },
          { text: "Take a written test", why: "시험 이야기는 없다." },
          {
            text: "Tour the facility",
            why: "정답. 점심 뒤에 조를 나눠 시설을 둘러본다.",
          },
          { text: "Meet the company president", why: "대표 이야기는 나오지 않는다." },
        ],
      },
      {
        id: "q-l4-orientation-welcome-3",
        prompt: "What does the speaker ask listeners to check?",
        skill: "next",
        band: 700,
        answer: 1,
        choices: [
          { text: "Their seat assignments", why: "자리 배정 이야기는 없다." },
          {
            text: "The spelling of their names on their badges",
            why: "정답. 잘못됐으면 첫 쉬는 시간에 알려 달라고 한다.",
          },
          { text: "Their shoe size", why: "발가락이 덮인 신발을 신으라고 할 뿐 치수는 말하지 않는다." },
          { text: "The lunch menu", why: "메뉴 이야기는 없다." },
        ],
      },
    ],
    links: ["v-employee", "v-department"],
  },
  {
    id: "l4-voicemail-appointment",
    part: 4,
    band: 600,
    situation: "예약 확인 자동응답 메시지",
    script: [
      {
        speaker: "woman",
        text: "Hello, this is a message for Mr. Alvarez from Brightview Dental. We're calling to confirm your cleaning appointment this Thursday at ten fifteen with Dr. Chen. Please arrive about ten minutes early — we've updated our patient forms and you'll need to review them. If you need to reschedule, call us back at 555-0148 at least twenty-four hours in advance to avoid a missed-appointment fee. Thank you, and we'll see you Thursday.",
      },
    ],
    questions: [
      {
        id: "q-l4-voicemail-appointment-1",
        prompt: "What is the purpose of the message?",
        skill: "gist",
        band: 600,
        answer: 3,
        choices: [
          { text: "To offer a discount", why: "할인 이야기는 없다." },
          { text: "To report test results", why: "검사 결과 이야기는 나오지 않는다." },
          { text: "To cancel an appointment", why: "취소가 아니라 확인이다." },
          {
            text: "To confirm an appointment",
            why: "정답. \"We're calling to confirm\" 이 그대로 목적이다.",
          },
        ],
      },
      {
        id: "q-l4-voicemail-appointment-2",
        prompt: "Why is the listener asked to arrive early?",
        skill: "detail",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "To look over updated forms",
            why: "정답. 서식이 바뀌어 확인해야 한다.",
          },
          { text: "To pay a fee in advance", why: "요금은 예약을 어겼을 때만 나온다." },
          { text: "Because the office closes early", why: "영업 시간 이야기는 없다." },
          { text: "To meet a new dentist", why: "Dr. Chen 이 새 의사라는 말은 없다." },
        ],
      },
      {
        id: "q-l4-voicemail-appointment-3",
        prompt: "What must the listener do to avoid a fee?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "Arrive ten minutes early", why: "일찍 오는 것은 서식 때문이지 요금과 무관하다." },
          { text: "Bring a referral", why: "소개장 이야기는 없다." },
          {
            text: "Call at least a day before to change the time",
            why: "정답. 24시간 전까지 연락해야 한다.",
          },
          { text: "Pay at the time of the visit", why: "선결제 이야기는 나오지 않는다." },
        ],
      },
    ],
  },
  {
    id: "l4-product-launch-brief",
    part: 4,
    band: 800,
    situation: "영업팀에 신제품 출시 일정을 알리는 회의 발언",
    script: [
      {
        speaker: "man",
        text: "Thanks for coming in early. Three things about the Meridian launch. First, the ship date moved from the tenth to the seventeenth — the factory needed another week for the final quality check, and I'd rather have that than a recall. Second, pricing is confirmed: we're coming in slightly above our nearest competitor, so lead with the extended warranty when you pitch it, not the price. Third, the demo units arrive here Friday. Sign one out at the front desk — I want every one of you to have used it before you sell it.",
      },
    ],
    questions: [
      {
        id: "q-l4-product-launch-brief-1",
        prompt: "Who are the listeners?",
        skill: "gist",
        band: 800,
        answer: 1,
        choices: [
          { text: "Factory workers", why: "공장은 제3자로 언급된다." },
          {
            text: "Sales staff",
            why: "정답. '어떻게 팔라'는 지침과 '팔기 전에 써 보라'는 말에서 정해진다. 직업을 대놓고 말하지 않고 지시 내용으로 알리는 형태다.",
          },
          { text: "Quality inspectors", why: "품질 검사는 공장이 한다." },
          { text: "Repair technicians", why: "수리 이야기는 없다." },
        ],
      },
      {
        id: "q-l4-product-launch-brief-2",
        prompt: "Why was the ship date changed?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "A supplier was late.", why: "납품업체 이야기는 나오지 않는다." },
          { text: "Demand was higher than expected.", why: "수요 이야기는 없다." },
          {
            text: "More time was needed for quality checks.",
            why: "정답. 최종 품질 검사에 일주일이 더 필요했다.",
          },
          { text: "A competitor released a similar product.", why: "경쟁사는 가격 비교로만 나온다." },
        ],
      },
      {
        id: "q-l4-product-launch-brief-3",
        prompt: "What does the speaker imply when he says the product is priced above a competitor's?",
        skill: "intent",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Listeners should emphasize something other than cost.",
            why: "정답. 바로 뒤에 '가격 말고 연장 보증을 앞세우라'고 이어진다. 의도 문제는 이렇게 앞뒤 문장이 답을 준다.",
          },
          { text: "The price will be lowered later.", why: "가격을 내린다는 말은 없다." },
          { text: "Sales targets have been reduced.", why: "목표 이야기는 나오지 않는다." },
          { text: "The competitor's product is better.", why: "품질 비교는 하지 않는다." },
        ],
      },
    ],
  },
  {
    id: "l4-museum-tour",
    part: 4,
    band: 700,
    situation: "박물관 관람 시작 전 안내",
    script: [
      {
        speaker: "woman",
        text: "Welcome to the Harborview Museum. Our tour lasts about seventy-five minutes and ends in the gift shop. A few reminders: photography is permitted throughout except in the textiles gallery, where the light would damage the fabrics. Please keep bags in front of you in the narrow corridors. And if we get separated, don't worry — just meet us at the fountain in the central hall at half past three. Now, if you'll follow me up these stairs, we'll begin with the maritime collection.",
      },
    ],
    questions: [
      {
        id: "q-l4-museum-tour-1",
        prompt: "How long will the tour take?",
        skill: "detail",
        band: 600,
        answer: 2,
        choices: [
          { text: "About thirty minutes", why: "언급되지 않은 시간이다." },
          { text: "About an hour", why: "한 시간이 아니라 한 시간 십오 분이다." },
          {
            text: "About an hour and fifteen minutes",
            why: "정답. seventy-five minutes 를 시간으로 바꿔 놓았다. 숫자를 다른 단위로 바꿔 내는 것은 흔한 방식이다.",
          },
          { text: "About two hours", why: "언급되지 않은 시간이다." },
        ],
      },
      {
        id: "q-l4-museum-tour-2",
        prompt: "Where is photography not allowed?",
        skill: "detail",
        band: 700,
        answer: 1,
        choices: [
          { text: "In the gift shop", why: "선물가게는 끝나는 곳으로만 언급된다." },
          {
            text: "In the textiles gallery",
            why: "정답. 빛이 직물을 상하게 하기 때문이다.",
          },
          { text: "In the central hall", why: "중앙홀은 흩어졌을 때 모이는 곳이다." },
          { text: "In the maritime collection", why: "해양 전시는 먼저 볼 곳일 뿐이다." },
        ],
      },
      {
        id: "q-l4-museum-tour-3",
        prompt: "What should listeners do if they lose the group?",
        skill: "next",
        band: 700,
        answer: 3,
        choices: [
          { text: "Call the speaker", why: "전화 이야기는 없다." },
          { text: "Wait at the entrance", why: "입구가 아니라 중앙홀 분수다." },
          { text: "Ask a staff member", why: "직원에게 물으라는 말은 나오지 않는다." },
          {
            text: "Meet at the fountain at 3:30",
            why: "정답. 장소와 시각이 함께 나온다.",
          },
        ],
      },
    ],
  },
  {
    id: "l4-power-outage-notice",
    part: 4,
    band: 700,
    situation: "건물 정전 예정을 알리는 사내 방송",
    script: [
      {
        speaker: "man",
        text: "This is a message for all building occupants. The electrical contractor will shut off power to the entire building this Saturday from six in the morning until about two in the afternoon while they replace the main panel. Please shut down and unplug computers before you leave on Friday — a surge when power returns can damage equipment. The freight elevator and the server room will stay on backup power, so scheduled data backups are unaffected. If your team needs building access Saturday, email facilities by Thursday so we can arrange it.",
      },
    ],
    questions: [
      {
        id: "q-l4-power-outage-notice-1",
        prompt: "What will happen on Saturday?",
        skill: "gist",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "The building's power will be turned off.",
            why: "정답. 주 배전반 교체 때문에 오전 6시부터 오후 2시까지 정전이다.",
          },
          { text: "The building will be cleaned.", why: "청소 이야기는 없다." },
          { text: "A fire drill will be held.", why: "훈련 이야기는 나오지 않는다." },
          { text: "New computers will be installed.", why: "컴퓨터는 꺼 두라고만 한다." },
        ],
      },
      {
        id: "q-l4-power-outage-notice-2",
        prompt: "Why are listeners asked to unplug their computers?",
        skill: "detail",
        band: 800,
        answer: 2,
        choices: [
          { text: "To save electricity", why: "절전 이야기는 없다." },
          { text: "To allow the contractor to move them", why: "장비를 옮긴다는 말은 나오지 않는다." },
          {
            text: "To protect them from a power surge",
            why: "정답. 전기가 돌아올 때의 서지가 장비를 상하게 할 수 있다.",
          },
          { text: "To complete a software update", why: "업데이트 이야기는 없다." },
        ],
      },
      {
        id: "q-l4-power-outage-notice-3",
        prompt: "What should listeners do by Thursday?",
        skill: "next",
        band: 700,
        answer: 1,
        choices: [
          { text: "Back up their files", why: "백업은 예비 전력으로 그대로 돌아간다." },
          {
            text: "Email facilities if they need Saturday access",
            why: "정답. 토요일 출입이 필요하면 목요일까지 연락한다.",
          },
          { text: "Move to another floor", why: "이동 이야기는 없다." },
          { text: "Report equipment damage", why: "이미 생긴 손상 이야기가 아니다." },
        ],
      },
    ],
  },
  {
    id: "l4-conference-closing",
    part: 4,
    band: 800,
    situation: "학회 폐회 안내",
    script: [
      {
        speaker: "woman",
        text: "Before we close, three announcements. Session recordings will be posted to the attendee portal within ten business days — you'll get an email when they're up, so there's no need to write in and ask. Certificates of attendance are printed at the registration desk, but only until five today; after that you'll have to request one by mail. Finally, the shuttle to the airport leaves from the east entrance, not the main lobby where it dropped you off. It runs every twenty minutes until eight. Thank you all for coming, and safe travels.",
      },
    ],
    questions: [
      {
        id: "q-l4-conference-closing-1",
        prompt: "When will the recordings be available?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "Later today", why: "오늘 5시까지는 수료증 이야기다." },
          { text: "Within twenty minutes", why: "20분은 셔틀 배차 간격이다." },
          {
            text: "Within about two weeks",
            why: "정답. ten business days 는 대략 2주다. 영업일을 주로 바꿔 묻는 형태다.",
          },
          { text: "Only by mail request", why: "우편 신청은 수료증 이야기다." },
        ],
      },
      {
        id: "q-l4-conference-closing-2",
        prompt: "Why does the speaker say there is no need to write in?",
        skill: "intent",
        band: 800,
        answer: 1,
        choices: [
          { text: "The portal is closing.", why: "포털이 닫힌다는 말은 없다." },
          {
            text: "Listeners will be notified automatically.",
            why: "정답. 올라가면 이메일이 가니 따로 문의하지 말라는 뜻이다.",
          },
          { text: "The recordings are not available.", why: "제공된다고 밝혔다." },
          { text: "Questions should go to the registration desk.", why: "등록대는 수료증을 뽑는 곳이다." },
        ],
      },
      {
        id: "q-l4-conference-closing-3",
        prompt: "What does the speaker emphasize about the shuttle?",
        skill: "detail",
        band: 800,
        answer: 3,
        choices: [
          { text: "It requires a reservation.", why: "예약 이야기는 없다." },
          { text: "It runs only once.", why: "20분마다 8시까지 다닌다." },
          { text: "It costs extra.", why: "요금 이야기는 나오지 않는다." },
          {
            text: "It departs from a different place than before.",
            why: "정답. 내려 준 정문이 아니라 동쪽 출입구다. 'A 가 아니라 B' 형태의 문장은 거의 언제나 문제가 된다.",
          },
        ],
      },
    ],
  },
  {
    id: "l4-store-promo",
    part: 4,
    band: 600,
    situation: "매장 내 할인 안내 방송",
    script: [
      {
        speaker: "woman",
        text: "Attention shoppers. For the next hour only, all garden furniture in aisle nine is thirty percent off. This includes patio sets, umbrellas, and outdoor cushions. Please note the discount is applied at the register, so the shelf tags will still show the regular price. Members of our rewards program get an additional five percent — just scan your card or enter your phone number at checkout. This offer ends at four o'clock and will not be extended. Thank you for shopping with us.",
      },
    ],
    questions: [
      {
        id: "q-l4-store-promo-1",
        prompt: "What is being discounted?",
        skill: "detail",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "Outdoor furniture",
            why: "정답. 9번 통로의 정원용 가구다.",
          },
          { text: "Kitchen appliances", why: "주방용품 이야기는 없다." },
          { text: "Clothing", why: "의류 이야기는 나오지 않는다." },
          { text: "Gardening tools", why: "도구가 아니라 가구다. garden 이라는 말만 겹친다." },
        ],
      },
      {
        id: "q-l4-store-promo-2",
        prompt: "Why does the speaker mention the shelf tags?",
        skill: "intent",
        band: 700,
        answer: 3,
        choices: [
          { text: "To point out a printing error", why: "오류가 아니라 원래 그렇게 돼 있다." },
          { text: "To ask shoppers to report wrong prices", why: "신고를 부탁하지 않는다." },
          { text: "To explain that prices went up", why: "오른 것이 아니다." },
          {
            text: "To warn that the lower price appears only at checkout",
            why: "정답. 선반에는 정가가 그대로 붙어 있으니 놀라지 말라는 뜻이다.",
          },
        ],
      },
      {
        id: "q-l4-store-promo-3",
        prompt: "How can shoppers receive an extra discount?",
        skill: "detail",
        band: 600,
        answer: 1,
        choices: [
          { text: "By spending over a certain amount", why: "구매 금액 조건은 없다." },
          {
            text: "By using a rewards membership",
            why: "정답. 카드를 찍거나 전화번호를 넣으면 5%가 더 붙는다.",
          },
          { text: "By buying two or more items", why: "수량 조건은 없다." },
          { text: "By paying in cash", why: "결제 수단 이야기는 나오지 않는다." },
        ],
      },
    ],
  },
  {
    id: "l4-training-webinar",
    part: 4,
    band: 800,
    situation: "온라인 교육 시작 전 진행자 안내",
    script: [
      {
        speaker: "man",
        text: "Welcome to today's session on the new expense system. A quick note on format: I'll present for about thirty minutes, then we'll open it up for questions. Please keep yourselves muted while I'm speaking, and put questions in the chat as they come to you — I'd rather you type it the moment you think of it than try to remember it for half an hour. One more thing: this session is being recorded and shared with the teams in Singapore, who couldn't join at this hour. So if you'd rather not appear, feel free to keep your camera off.",
      },
    ],
    questions: [
      {
        id: "q-l4-training-webinar-1",
        prompt: "What is the session about?",
        skill: "gist",
        band: 700,
        answer: 2,
        choices: [
          { text: "A new hiring policy", why: "채용 이야기는 없다." },
          { text: "A software security update", why: "보안 이야기는 나오지 않는다." },
          {
            text: "A new expense system",
            why: "정답. 첫 문장에 그대로 있다.",
          },
          { text: "An office relocation", why: "이전 이야기는 없다." },
        ],
      },
      {
        id: "q-l4-training-webinar-2",
        prompt: "Why does the speaker ask listeners to type questions immediately?",
        skill: "intent",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "He assumes they will forget them otherwise.",
            why: "정답. '30분 동안 기억하려 애쓰기보다 떠오르는 즉시 치라'는 말 그대로다.",
          },
          { text: "He will not take spoken questions.", why: "뒤에 질문 시간을 연다고 했다." },
          { text: "The chat closes early.", why: "채팅이 닫힌다는 말은 없다." },
          { text: "He wants to end the session early.", why: "일찍 끝내겠다는 말은 나오지 않는다." },
        ],
      },
      {
        id: "q-l4-training-webinar-3",
        prompt: "Why does the speaker mention the Singapore teams?",
        skill: "detail",
        band: 800,
        answer: 1,
        choices: [
          { text: "They will present later.", why: "발표 이야기는 없다." },
          {
            text: "To explain why the session is being recorded",
            why: "정답. 그 시간에 못 들어오는 팀에 공유하려고 녹화한다 — 그래서 카메라를 꺼도 된다고 이어진다.",
          },
          { text: "They designed the new system.", why: "개발 이야기는 나오지 않는다." },
          { text: "They use a different system.", why: "다른 체계를 쓴다는 말은 없다." },
        ],
      },
    ],
  },
  {
    id: "l4-library-closure",
    part: 4,
    band: 600,
    situation: "도서관 임시 휴관 안내",
    script: [
      {
        speaker: "woman",
        text: "Good afternoon. Please be aware that the Westside Library will close at three today, two hours earlier than usual, for staff training. The book drop by the parking lot will remain open, so you can still return materials, and nothing due today will be counted as late. Our online catalog and e-book service run as normal. We reopen tomorrow at nine with regular hours. If you have a hold waiting for you, it will stay on the shelf an extra day. Thank you for your understanding.",
      },
    ],
    questions: [
      {
        id: "q-l4-library-closure-1",
        prompt: "Why is the library closing early?",
        skill: "detail",
        band: 600,
        answer: 3,
        choices: [
          { text: "For a holiday", why: "휴일 이야기는 없다." },
          { text: "For repairs", why: "보수 이야기는 나오지 않는다." },
          { text: "For an inventory count", why: "장서 점검 이야기는 없다." },
          {
            text: "For staff training",
            why: "정답. 직원 교육 때문이라고 밝힌다.",
          },
        ],
      },
      {
        id: "q-l4-library-closure-2",
        prompt: "What can patrons still do today?",
        skill: "detail",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "Return materials",
            why: "정답. 주차장 옆 반납함은 계속 열려 있다.",
          },
          { text: "Pick up holds in person", why: "예약 도서는 하루 더 보관될 뿐 오늘 찾을 수는 없다." },
          { text: "Attend the training", why: "교육은 직원용이다." },
          { text: "Use the study rooms", why: "열람실 이야기는 없다." },
        ],
      },
      {
        id: "q-l4-library-closure-3",
        prompt: "What does the speaker say about items due today?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "They must be renewed online.", why: "연장 이야기는 없다." },
          { text: "They will incur a small fee.", why: "연체로 치지 않는다고 했다." },
          {
            text: "They will not be considered overdue.",
            why: "정답. \"nothing due today will be counted as late\" 다.",
          },
          { text: "They can be returned next week.", why: "다음 주 이야기는 나오지 않는다." },
        ],
      },
    ],
  },
  {
    id: "l4-hotel-renovation",
    part: 4,
    band: 700,
    situation: "호텔 투숙객에게 공사 안내",
    script: [
      {
        speaker: "man",
        text: "Good evening, and thank you for staying with us. As you may have noticed, we're renovating the fitness center on the second floor. Work runs from nine in the morning to four in the afternoon, and we've arranged for guests to use the gym at the Parkside Hotel two blocks north at no charge — just show your room key. The pool and sauna here are unaffected and open until eleven. Renovation should finish by the end of next month. If noise during the day is a problem, please call the front desk and we'll do our best to move you to a room on a higher floor.",
      },
    ],
    questions: [
      {
        id: "q-l4-hotel-renovation-1",
        prompt: "What is currently unavailable at the hotel?",
        skill: "detail",
        band: 700,
        answer: 1,
        choices: [
          { text: "The swimming pool", why: "수영장은 그대로 열려 있다." },
          {
            text: "The fitness center",
            why: "정답. 2층 헬스장을 고치는 중이다.",
          },
          { text: "The restaurant", why: "식당 이야기는 없다." },
          { text: "The parking garage", why: "주차장 이야기는 나오지 않는다." },
        ],
      },
      {
        id: "q-l4-hotel-renovation-2",
        prompt: "What do guests need to use the other hotel's gym?",
        skill: "detail",
        band: 700,
        answer: 3,
        choices: [
          { text: "A reservation", why: "예약 이야기는 없다." },
          { text: "A daily fee", why: "무료라고 밝혔다." },
          { text: "A guest pass from the front desk", why: "따로 발급받으라는 말은 없다." },
          {
            text: "Their room key",
            why: "정답. 방 열쇠만 보이면 된다.",
          },
        ],
      },
      {
        id: "q-l4-hotel-renovation-3",
        prompt: "What does the speaker offer to guests bothered by noise?",
        skill: "next",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "A different room",
            why: "정답. 프런트로 연락하면 위층으로 옮겨 주려 하겠다고 한다.",
          },
          { text: "A refund", why: "환불 이야기는 없다." },
          { text: "A late checkout", why: "늦은 퇴실 이야기는 나오지 않는다." },
          { text: "Free breakfast", why: "조식 이야기는 없다." },
        ],
      },
    ],
  },
];
