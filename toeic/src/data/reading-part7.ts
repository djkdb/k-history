import type { ReadingSet } from "@/lib/types";

/**
 * Part 7 · 독해.
 *
 * 지문 하나짜리와 두세 지문을 엮은 것으로 나뉜다. 엮인 지문은 답의 근거가
 * 두 곳에 걸쳐 있어서, 한 지문만 보고 고르면 반드시 오답을 집는다.
 * 그래서 연계 문항에는 skill: "crossref" 를 달아 두고 해설에 두 근거를 모두 적었다.
 */
export const READING_PART7: ReadingSet[] = [
  /* ───────── 단일 지문 · 문자 대화 (의도 파악) ───────── */
  {
    id: "r7-chat-catering",
    part: 7,
    band: 700,
    docType: "chat",
    links: ["v-confirm", "v-postpone"],
    passage: [
      {
        docType: "chat",
        header: [{ label: "", value: "Nadia Ross · Tomas Berg  |  9:12 A.M." }],
        body: `Nadia Ross (9:12 A.M.)
Tomas, the caterer just called. They can't do Thursday after all — one of their vans broke down and they're short-staffed.

Tomas Berg (9:14 A.M.)
Thursday is the client presentation. We can't move that.

Nadia Ross (9:15 A.M.)
I know. They offered Friday, but that doesn't help us.

Tomas Berg (9:16 A.M.)
What about Greenleaf? We used them for the summer event.

Nadia Ross (9:18 A.M.)
Already called. They can do Thursday but only a cold menu — sandwiches, salads, that sort of thing.

Tomas Berg (9:19 A.M.)
That's fine. It's a lunch meeting, not a banquet.

Nadia Ross (9:20 A.M.)
Then I'll lock it in. How many should I tell them?

Tomas Berg (9:21 A.M.)
Twelve, plus two from the London office. Make it fifteen to be safe.`,
      },
    ],
    questions: [
      {
        id: "q-r7-chat-1",
        prompt: "What problem does Ms. Ross report?",
        skill: "gist",
        band: 600,
        answer: 1,
        choices: [
          { text: "A client has canceled a meeting", why: "고객 발표는 그대로 목요일이다." },
          {
            text: "A vendor is unavailable on the needed day",
            why: "정답. 출장 뷔페 업체가 목요일에 못 온다는 것이 문제다.",
          },
          { text: "A delivery arrived damaged", why: "파손 이야기는 없다." },
          { text: "A room reservation was lost", why: "장소 예약 문제는 언급되지 않았다." },
        ],
      },
      {
        id: "q-r7-chat-2",
        prompt:
          'At 9:19 A.M., what does Mr. Berg most likely mean when he writes, "It\'s a lunch meeting, not a banquet"?',
        skill: "intent",
        band: 800,
        answer: 2,
        evidence:
          "Nadia: they can do Thursday but only a cold menu — sandwiches, salads / Tomas: That's fine. It's a lunch meeting, not a banquet.",
        choices: [
          {
            text: "He wants to invite fewer people.",
            why: "인원 이야기는 그 뒤에 따로 나오고, 오히려 늘려 잡는다.",
          },
          {
            text: "He thinks the event should be postponed.",
            why: "미룰 수 없다고 이미 못 박았다.",
          },
          {
            text: "A simple menu will be acceptable.",
            why: "정답. 바로 앞에서 '찬 음식만 된다'고 했고, 이 말은 그래도 괜찮다는 뜻이다. 의도 파악은 **바로 앞 줄**이 근거다.",
          },
          {
            text: "The budget has been reduced.",
            why: "예산 이야기는 대화에 없다.",
          },
        ],
      },
      {
        id: "q-r7-chat-3",
        prompt: "How many people will Ms. Ross tell the caterer to expect?",
        skill: "detail",
        band: 600,
        answer: 3,
        choices: [
          { text: "Two", why: "런던 지사에서 오는 인원만 센 숫자다." },
          { text: "Twelve", why: "런던 인원을 빼고 센 숫자다." },
          { text: "Fourteen", why: "12 + 2 지만, 여유를 두어 15로 하라고 했다." },
          {
            text: "Fifteen",
            why: "정답. 마지막 줄에서 '안전하게 15명으로 하라'고 한다. 계산만 하고 마지막 줄을 안 읽으면 14를 고른다.",
          },
        ],
      },
    ],
  },

  /* ───────── 단일 지문 · 기사 ───────── */
  {
    id: "r7-article-transit",
    part: 7,
    band: 800,
    docType: "article",
    links: ["v-revenue", "v-substantial", "v-projection"],
    passage: [
      {
        docType: "article",
        header: [
          { label: "출처", value: "Marlow Business Weekly, 4월 8일자" },
        ],
        body: `MARLOW — Ridership on the city's light rail system rose 18 percent last year, the transit authority reported on Tuesday, reversing three consecutive years of decline.

Officials attribute the turnaround primarily to the opening of the Eastside extension in March of last year, which added six stations and connected two previously separate lines. "Before the extension, a rider going from Eastside to the medical district had to transfer twice," said authority director Camila Duarte. "Now it's a single trip."

The increase has had a substantial effect on finances. Fare revenue reached 41 million dollars, exceeding projections by roughly 7 percent. The authority had budgeted conservatively, anticipating that construction disruptions would continue to discourage riders through the first half of the year.

Not all lines shared in the gains. The Northline, which serves the industrial district, saw ridership fall by 4 percent — a decline officials link to continued remote work among office employees at the corridor's largest employers.

The authority plans to use part of the surplus to increase weekend service on the Eastside extension beginning in September.`,
      },
    ],
    questions: [
      {
        id: "q-r7-article-1",
        prompt: "What is the main topic of the article?",
        skill: "gist",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "An increase in public transit use",
            why: "정답. 첫 문단에서 이용객 18퍼센트 증가를 알리고 그 이유와 결과가 이어진다.",
          },
          { text: "A proposed fare increase", why: "요금 인상 이야기는 없다." },
          { text: "The construction of a new station", why: "확장은 이미 작년에 끝났다." },
          { text: "A change in city employment patterns", why: "재택근무는 한 노선을 설명하는 근거로만 나온다." },
        ],
      },
      {
        id: "q-r7-article-2",
        prompt: "According to Ms. Duarte, what did the extension eliminate?",
        skill: "detail",
        band: 800,
        answer: 2,
        evidence:
          '"Before the extension, a rider going from Eastside to the medical district had to transfer twice ... Now it\'s a single trip."',
        choices: [
          { text: "A fare surcharge", why: "요금 할증 이야기는 없다." },
          { text: "A construction detour", why: "공사 우회는 언급되지 않았다." },
          {
            text: "The need to change trains",
            why: "정답. '두 번 갈아타야 했는데 이제 한 번에 간다'는 말을 바꿔 쓴 것이다.",
          },
          { text: "A weekend service reduction", why: "주말 운행은 오히려 늘릴 계획이다." },
        ],
      },
      {
        id: "q-r7-article-3",
        prompt: "Why did fare revenue exceed the authority's projections?",
        skill: "inference",
        band: 900,
        answer: 1,
        evidence:
          "The authority had budgeted conservatively, anticipating that construction disruptions would continue to discourage riders.",
        choices: [
          { text: "Fares were raised mid-year", why: "요금 인상은 나오지 않는다." },
          {
            text: "The authority had planned for lower ridership",
            why: "정답. 공사 여파가 이어질 것으로 보고 보수적으로 잡았기 때문에 실제 실적이 예상을 넘었다.",
          },
          { text: "A new line opened ahead of schedule", why: "일정을 앞당겼다는 언급은 없다." },
          { text: "The Northline attracted more commuters", why: "노스라인은 오히려 4퍼센트 줄었다." },
        ],
      },
      {
        id: "q-r7-article-4",
        prompt: "The word “link” in paragraph 4 is closest in meaning to",
        skill: "vocab-incontext",
        band: 800,
        answer: 3,
        choices: [
          { text: "connect physically", why: "노선을 물리적으로 잇는다는 뜻이 아니다. 앞 문단의 '연결'과 헷갈리게 놓았다." },
          { text: "measure", why: "측정한다는 뜻은 없다." },
          { text: "announce", why: "발표한다는 뜻이 아니다." },
          {
            text: "attribute",
            why: "정답. 감소의 원인을 재택근무로 '돌린다'는 뜻이다. 문맥상 의미 문제는 사전 뜻이 아니라 그 문장에서의 쓰임을 본다.",
          },
        ],
      },
    ],
  },

  /* ───────── 이중 지문 · 공지 + 이메일 ───────── */
  {
    id: "r7-double-workshop",
    part: 7,
    band: 800,
    docType: "notice",
    links: ["v-eligible", "v-waive", "v-reimburse"],
    passage: [
      {
        docType: "notice",
        header: [{ label: "지문 1", value: "안내문" }],
        body: `HARLAN INSTITUTE — Professional Development Workshops (Autumn Series)

All workshops are held at the Institute's Bell Street campus.

  Data Visualization ......... Sept 9  ..... $180
  Technical Writing .......... Sept 23 ..... $150
  Project Estimation ......... Oct 7  ...... $210
  Negotiation Skills ......... Oct 21 ...... $195

Registration closes one week before each session.

Members of partner organizations receive a 20 percent discount. Participants who complete three or more workshops in a single series will have the fee for the fourth waived entirely.

Meals are not included. A café on the ground floor is open from 8 A.M. to 4 P.M.`,
      },
      {
        docType: "email",
        header: [
          { label: "지문 2", value: "이메일" },
          { label: "보내는 사람", value: "r.okonkwo@brightpath.example" },
          { label: "받는 사람", value: "registration@harlan.example" },
          { label: "날짜", value: "September 28" },
        ],
        body: `Hello,

I am writing to register for the Project Estimation workshop next month. Brightpath Consulting is a partner organization, so I believe I qualify for the reduced rate.

This will be my fourth session in the autumn series — I attended Data Visualization and Technical Writing this month, and I completed Negotiation Skills when it was offered in the spring series.

Could you confirm the amount I owe before I submit payment? My employer reimburses course fees, but I need an itemized invoice for the finance department.

Thank you,
Rita Okonkwo`,
      },
    ],
    questions: [
      {
        id: "q-r7-double-1",
        prompt: "What is indicated about the workshops?",
        skill: "detail",
        band: 700,
        answer: 2,
        choices: [
          { text: "They are held at several locations.", why: "모두 벨 스트리트 캠퍼스 한 곳이다." },
          { text: "They include lunch.", why: "식사는 포함되지 않는다고 명시되어 있다." },
          {
            text: "Registration must be completed in advance.",
            why: "정답. 각 세션 일주일 전에 등록이 마감된다.",
          },
          { text: "They are offered only in the autumn.", why: "이메일에 봄 시리즈가 언급된다." },
        ],
      },
      {
        id: "q-r7-double-2",
        prompt: "How much will Ms. Okonkwo most likely pay for the workshop?",
        skill: "crossref",
        band: 900,
        evidence:
          "안내문: 4회차 면제는 '한 시리즈 안에서 3회 이상 이수' 조건 / 이메일: 이번 가을 시리즈에서는 2회만 들었고 협상 스킬은 봄 시리즈였다.",
        answer: 1,
        choices: [
          {
            text: "Nothing",
            why: "네 번째 수강이라 면제처럼 보이지만, 면제 조건은 **한 시리즈 안에서** 3회 이상이다. 가을 시리즈에서는 두 번만 들었다.",
          },
          {
            text: "$168",
            why: "정답. 210달러에 제휴사 20퍼센트 할인 → 168달러. 면제 조건은 충족하지 못한다.",
          },
          { text: "$180", why: "다른 워크숍(데이터 시각화) 가격이다." },
          { text: "$210", why: "할인을 적용하지 않은 정가다. 제휴사 조건을 놓치면 이것을 고른다." },
        ],
      },
      {
        id: "q-r7-double-3",
        prompt: "What does Ms. Okonkwo request?",
        skill: "detail",
        band: 700,
        answer: 3,
        choices: [
          { text: "A change of session date", why: "날짜 변경 요청은 없다." },
          { text: "A refund for a previous workshop", why: "환불 이야기는 없다." },
          { text: "Access to course materials", why: "자료 요청은 나오지 않는다." },
          {
            text: "A detailed bill",
            why: "정답. 회사 환급을 위해 항목별 청구서(itemized invoice)가 필요하다고 했다.",
          },
        ],
      },
      {
        id: "q-r7-double-4",
        prompt: "Why does Ms. Okonkwo need an invoice?",
        skill: "detail",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Her company will pay her back for the cost.",
            why: "정답. My employer reimburses course fees 를 바꿔 쓴 것이다.",
          },
          { text: "She wants to dispute a charge.", why: "이의 제기 이야기는 없다." },
          { text: "She must prove her membership.", why: "회원 증명이 아니라 비용 정산 때문이다." },
          { text: "She plans to claim a tax deduction.", why: "세금 공제는 언급되지 않았다." },
        ],
      },
    ],
  },

  /* ───────── 단일 지문 · 광고 (문장 삽입 위치) ───────── */
  {
    id: "r7-ad-coworking",
    part: 7,
    band: 700,
    docType: "advertisement",
    links: ["v-complimentary", "v-available"],
    passage: [
      {
        docType: "advertisement",
        header: [{ label: "", value: "THE LOFT — Workspace on Demand" }],
        body: `Tired of working from your kitchen table? The Loft offers flexible workspace in the heart of the Riverside district, five minutes from the Central station.

Choose the plan that fits how you actually work:

  DROP-IN — $25/day. Open seating, no commitment.
  RESIDENT — $220/month. A reserved desk, 24-hour access, and mail handling.
  SUITE — from $700/month. A lockable private office for teams of two to six.

Every plan includes complimentary coffee, high-speed wireless, and four hours of meeting-room credit each month. Additional meeting-room time is available at $15 per hour.

Tours are offered weekdays at 10 A.M. and 4 P.M. — no appointment necessary. Mention this advertisement when you sign up and your first month's fee will be reduced by half.`,
      },
    ],
    questions: [
      {
        id: "q-r7-ad-1",
        prompt: "For whom is the advertisement most likely intended?",
        skill: "inference",
        band: 700,
        answer: 1,
        choices: [
          { text: "Building contractors", why: "시공업체 대상이 아니다." },
          {
            text: "People who work independently",
            why: "정답. '부엌 식탁에서 일하는 데 지쳤나요'로 시작하고 1인용 요금제가 중심이다.",
          },
          { text: "Students seeking housing", why: "주거가 아니라 업무 공간이다." },
          { text: "Event planners", why: "행사 대관이 주된 내용이 아니다." },
        ],
      },
      {
        id: "q-r7-ad-2",
        prompt: "What is included in every plan?",
        skill: "detail",
        band: 600,
        answer: 2,
        choices: [
          { text: "A private office", why: "SUITE 요금제에만 해당한다." },
          { text: "24-hour access", why: "RESIDENT 이상에만 해당한다." },
          {
            text: "Some meeting-room time",
            why: "정답. 모든 요금제에 매월 회의실 4시간이 포함된다.",
          },
          { text: "Mail handling", why: "RESIDENT 요금제의 혜택이다." },
        ],
      },
      {
        id: "q-r7-ad-3",
        prompt: "How can a customer receive a discount?",
        skill: "detail",
        band: 600,
        answer: 3,
        choices: [
          { text: "By booking a tour online", why: "견학은 예약이 필요 없다고 되어 있다." },
          { text: "By paying for a full year", why: "연납 할인 이야기는 없다." },
          { text: "By referring a colleague", why: "추천 제도는 언급되지 않았다." },
          {
            text: "By referring to the advertisement",
            why: "정답. 가입 시 이 광고를 언급하면 첫 달 요금이 절반이 된다.",
          },
        ],
      },
    ],
  },
];
