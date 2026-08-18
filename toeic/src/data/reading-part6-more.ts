import type { ReadingSet } from "@/lib/types";

/**
 * Part 6 · 장문 빈칸 — 추가 지문.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * 지문 하나에 빈칸 넷, 그중 하나는 문장을 통째로 넣는 문제다. 실제 시험이
 * 그 구성이라 여기서도 반드시 지킨다.
 *
 * Part 5 와 결정적으로 다른 점은, **빈칸이 있는 문장만 봐서는 풀리지 않는
 * 문항이 섞여 있다**는 것이다. 시제와 연결어가 그렇다. 그래서 지문마다
 * '앞뒤를 봐야 풀리는 빈칸'을 최소 하나씩 넣었고, 해설에 어느 문장이
 * 근거인지 적어 둔다.
 */
export const READING_PART6_MORE: ReadingSet[] = [
  {
    id: "r6m-office-move",
    part: 6,
    band: 600,
    passage: [
      {
        docType: "memo",
        header: [
          { label: "To", value: "All Staff, Fourth Floor" },
          { label: "From", value: "Facilities Management" },
          { label: "Subject", value: "Office relocation, 12–13 September" },
        ],
        body: `Our department will move to the seventh floor on the weekend of 12 September. To make this go smoothly, please pack your personal belongings by five o'clock on Friday. Labels and boxes [[1]] to each desk on Thursday morning.

Computers and monitors will be handled by the moving crew. [[2]] Anything left loose on a desk may be lost.

Your new desk number is listed on the floor plan posted by the elevator. [[3]] the layout looks similar, seat assignments have changed, so please check before you sit down on Monday.

If you have questions, contact us at extension 4120. We appreciate your [[4]] during the move.`,
      },
    ],
    questions: [
      {
        id: "q-r6m-office-move-1",
        blank: 1,
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "deliver", why: "라벨과 상자가 스스로 배달할 수는 없다. 능동은 맞지 않는다." },
          { text: "were delivered", why: "목요일 아침은 아직 오지 않았다. 과거로 쓸 수 없다." },
          {
            text: "will be delivered",
            why: "정답. 앞 문장의 '금요일 5시까지 싸 두라'와 이 문장의 '목요일 아침'이 모두 앞으로의 일이다. 빈칸 문장만 봐서는 시제를 못 정한다.",
          },
          { text: "have been delivering", why: "능동 진행이라 주어와 맞지 않는다." },
        ],
      },
      {
        id: "q-r6m-office-move-2",
        blank: 2,
        skill: "sentence",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "The seventh floor has been repainted this summer.",
            why: "사실이긴 해도 앞뒤와 이어지지 않는다. 뒤 문장의 '풀어 둔 것은 잃어버릴 수 있다'를 설명하지 못한다.",
          },
          {
            text: "However, cables and accessories must be boxed and labeled by each employee.",
            why: "정답. 앞은 '컴퓨터는 업체가 맡는다', 뒤는 '책상에 그냥 둔 것은 잃어버린다'. 그 사이를 잇는 것은 '그 밖의 것은 본인이 챙겨라'뿐이다.",
          },
          {
            text: "Parking will be unavailable during the weekend.",
            why: "주차 이야기는 이 문단의 흐름과 무관하다.",
          },
          {
            text: "The moving crew will arrive on Monday morning.",
            why: "이사는 주말에 한다고 했다. 앞의 사실과 어긋난다.",
          },
        ],
      },
      {
        id: "q-r6m-office-move-3",
        blank: 3,
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Although",
            why: "정답. '배치는 비슷해 보이지만 자리는 바뀌었다' — 앞뒤가 뒤집히므로 양보 접속사다.",
          },
          { text: "Because", why: "이유로 이으면 '비슷해서 자리가 바뀌었다'가 되어 말이 되지 않는다." },
          { text: "In addition to", why: "전치사구라 뒤에 절이 오지 못한다." },
          { text: "So that", why: "목적을 이끈다. 흐름이 맞지 않는다." },
        ],
      },
      {
        id: "q-r6m-office-move-4",
        blank: 4,
        skill: "vocab",
        band: 600,
        answer: 3,
        choices: [
          { text: "attendance", why: "'참석'이라 이사와 어울리지 않는다." },
          { text: "achievement", why: "'성취'다." },
          { text: "appointment", why: "'약속·임명'이다." },
          {
            text: "cooperation",
            why: "정답. '협조에 감사한다'는 안내문의 맺음말로 통째로 나온다.",
          },
        ],
      },
    ],
  },
  {
    id: "r6m-subscription-renewal",
    part: 6,
    band: 700,
    passage: [
      {
        docType: "email",
        header: [
          { label: "To", value: "j.moreau@littlefield.net" },
          { label: "From", value: "service@quarterlyreview.com" },
          { label: "Subject", value: "Your subscription expires soon" },
        ],
        body: `Dear Ms. Moreau,

Your subscription to Quarterly Review ends on 30 November. We hope you have [[1]] the past year of issues.

Renewing takes less than a minute. Simply visit our website and sign in with the e-mail address this message was sent to. [[2]]

As a returning subscriber, you are [[3]] for our loyalty rate of $48 per year — twelve dollars below the standard price. This rate is applied automatically at checkout.

If you would rather not continue, no action is needed; your access will simply end on the date above. [[4]], we would be grateful if you could tell us why, using the short form linked below.

Sincerely,
Customer Service`,
      },
    ],
    questions: [
      {
        id: "q-r6m-subscription-renewal-1",
        blank: 1,
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "enjoy", why: "have 뒤에는 과거분사가 온다." },
          {
            text: "enjoyed",
            why: "정답. have + p.p. 형태를 완성한다.",
          },
          { text: "enjoying", why: "have -ing 는 완료가 되지 않는다." },
          { text: "to enjoy", why: "have to enjoy 는 '즐겨야 한다'가 되어 뜻이 어긋난다." },
        ],
      },
      {
        id: "q-r6m-subscription-renewal-2",
        blank: 2,
        skill: "sentence",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "Print issues are mailed on the first of each month.",
            why: "배송 이야기는 갱신 절차를 설명하는 이 문단과 이어지지 않는다.",
          },
          {
            text: "We no longer accept payment by check.",
            why: "결제 수단을 제한하는 말은 '1분이면 된다'는 앞 문장의 흐름을 끊는다.",
          },
          {
            text: "You will not need to create a new account or re-enter your payment details.",
            why: "정답. 앞 문장이 '이 메일 주소로 로그인만 하면 된다'이므로, 그것이 왜 간단한지를 이어 말하는 문장이 들어가야 한다.",
          },
          {
            text: "Our editorial team has grown to fifteen writers.",
            why: "잡지 자랑은 이 문단의 용건과 무관하다.",
          },
        ],
      },
      {
        id: "q-r6m-subscription-renewal-3",
        blank: 3,
        skill: "vocab",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "eligible",
            why: "정답. be eligible for = '~의 자격이 있다'. 뒤의 for 가 결정적이다.",
          },
          { text: "capable", why: "be capable of 로 쓴다. 뒤가 for 라 맞지 않는다." },
          { text: "responsible", why: "'책임이 있다'라 뜻이 어긋난다." },
          { text: "available", why: "사람이 주어면 '시간이 된다'는 뜻이 되어 요금과 어울리지 않는다." },
        ],
      },
      {
        id: "q-r6m-subscription-renewal-4",
        blank: 4,
        skill: "grammar",
        band: 800,
        answer: 3,
        choices: [
          { text: "Therefore", why: "'그러므로'는 앞의 결과를 잇는다. 여기서는 흐름이 바뀐다." },
          { text: "For example", why: "예시가 아니다." },
          { text: "As a result", why: "결과를 잇는 말이다." },
          {
            text: "In that case",
            why: "정답. 앞 문장이 '계속하지 않으시겠다면'이라는 경우를 말했다. '그런 경우라면'으로 받아야 이어진다.",
          },
        ],
      },
    ],
  },
  {
    id: "r6m-cafe-opening",
    part: 6,
    band: 600,
    passage: [
      {
        docType: "advertisement",
        body: `NOW OPEN — Corner Leaf Café

After eight months of renovation, Corner Leaf Café has reopened at 22 Marchmont Street. The space is twice its former size and now [[1]] seating for sixty guests, including a quiet room for study and remote work.

Our menu has changed as well. In addition to the coffees you know, we now bake all of our pastries on site each morning. [[2]]

To celebrate, every drink is half price from Monday through Wednesday this week. No coupon is [[3]] — simply mention the opening special when you order.

We are open from seven in the morning until nine at night, seven days a week. We look forward to [[4]] you again.`,
      },
    ],
    questions: [
      {
        id: "q-r6m-cafe-opening-1",
        blank: 1,
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "offer", why: "주어가 The space 로 단수라 동사에 -s 가 필요하다." },
          { text: "offering", why: "본동사가 될 수 없다." },
          {
            text: "offers",
            why: "정답. 단수 주어에 맞춘 현재형이다. 앞의 is twice its former size 와 시제도 맞는다.",
          },
          { text: "offered", why: "지금 상태를 말하는 문장이라 과거는 어울리지 않는다." },
        ],
      },
      {
        id: "q-r6m-cafe-opening-2",
        blank: 2,
        skill: "sentence",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Loaves sold out by noon during our first week, so we now bake a second batch at two o'clock.",
            why: "정답. 앞 문장이 '이제 매일 아침 직접 굽는다'이므로, 굽는 이야기를 이어 가는 문장이 자연스럽다.",
          },
          {
            text: "Renovation work was delayed by a permit issue.",
            why: "공사 이야기는 앞 문단에서 이미 끝났다. 메뉴를 말하는 문단의 흐름을 끊는다.",
          },
          {
            text: "Parking is available in the lot behind the building.",
            why: "주차는 메뉴와 무관하다.",
          },
          {
            text: "We are currently hiring baristas for the evening shift.",
            why: "채용 공고는 이 광고의 용건이 아니다.",
          },
        ],
      },
      {
        id: "q-r6m-cafe-opening-3",
        blank: 3,
        skill: "grammar",
        band: 600,
        answer: 1,
        choices: [
          { text: "require", why: "be 동사 뒤에 동사원형이 오지 못한다." },
          {
            text: "required",
            why: "정답. '쿠폰은 요구되지 않는다'는 수동이다. No coupon is required 는 광고에 통째로 나오는 문장이다.",
          },
          { text: "requiring", why: "쿠폰이 무언가를 요구하는 것이 아니다." },
          { text: "requirement", why: "명사를 넣으면 관사가 필요하고 뜻도 어색해진다." },
        ],
      },
      {
        id: "q-r6m-cafe-opening-4",
        blank: 4,
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "see", why: "look forward to 의 to 는 전치사다. 동사원형이 오지 못한다." },
          { text: "be seen", why: "수동이라 뜻이 뒤집힌다." },
          { text: "have seen", why: "완료형은 이 자리에 오지 않는다." },
          {
            text: "seeing",
            why: "정답. look forward to + -ing. to 를 부정사로 착각하게 만드는, 손에 꼽히게 자주 나오는 함정이다.",
          },
        ],
      },
    ],
  },
  {
    id: "r6m-policy-update",
    part: 6,
    band: 800,
    passage: [
      {
        docType: "notice",
        header: [
          { label: "Subject", value: "Updated travel reimbursement policy" },
          { label: "Effective", value: "1 October" },
        ],
        body: `Beginning 1 October, all travel expenses must be submitted through the online portal rather than on paper forms. Receipts should be uploaded as images; originals no longer need to be [[1]] to the finance office.

The submission window has also changed. Previously, employees had sixty days to file. [[2]] Requests received after that point will require a manager's written approval.

One thing has not changed: meals remain reimbursable up to the daily limit posted on the intranet, and that limit [[3]] the same as last year.

Training sessions on the new portal will be held twice next week. Attendance is optional but [[4]] recommended, particularly for staff who travel monthly.`,
      },
    ],
    questions: [
      {
        id: "q-r6m-policy-update-1",
        blank: 1,
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "mail", why: "be 동사 뒤에 동사원형이 오지 못한다." },
          { text: "mailing", why: "원본이 스스로 부치는 것이 아니다." },
          {
            text: "mailed",
            why: "정답. '원본은 더 이상 부쳐질 필요가 없다'는 수동이다.",
          },
          { text: "to mail", why: "need to be 뒤에 다시 부정사가 올 수 없다." },
        ],
      },
      {
        id: "q-r6m-policy-update-2",
        blank: 2,
        skill: "sentence",
        band: 800,
        answer: 1,
        choices: [
          {
            text: "Paper forms are still accepted in special cases.",
            why: "첫 문단에서 종이 서식을 없앤다고 했다. 앞의 내용과 어긋난다.",
          },
          {
            text: "That period is now thirty days from the last day of travel.",
            why: "정답. 앞이 '전에는 60일이었다', 뒤가 '그 시점을 넘기면 승인이 필요하다'. 가운데에는 '이제는 며칠'이라는 새 기준이 와야 한다.",
          },
          {
            text: "The finance office has moved to the third floor.",
            why: "사무실 위치는 제출 기한과 무관하다.",
          },
          {
            text: "Managers may not approve their own expenses.",
            why: "그럴듯하지만 앞 문장의 '전에는 60일'을 받지 못한다.",
          },
        ],
      },
      {
        id: "q-r6m-policy-update-3",
        blank: 3,
        skill: "grammar",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "remains",
            why: "정답. 'One thing has not changed' 로 시작한 문단이다. 바뀌지 않았다는 흐름에 맞는 현재형 동사여야 한다.",
          },
          { text: "changed", why: "바로 앞에서 바뀌지 않았다고 못 박았다. 정면으로 어긋난다." },
          { text: "will increase", why: "작년과 같다고 했으므로 오른다는 말은 맞지 않는다." },
          { text: "had been", why: "과거완료는 지금의 사실을 말하지 못한다." },
        ],
      },
      {
        id: "q-r6m-policy-update-4",
        blank: 4,
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "strong", why: "형용사다. 과거분사 recommended 를 꾸미지 못한다." },
          { text: "strength", why: "명사다." },
          { text: "strengthen", why: "동사다." },
          {
            text: "strongly",
            why: "정답. 분사를 꾸미는 자리는 부사다. 'optional but strongly recommended' 는 통째로 자주 나온다.",
          },
        ],
      },
    ],
  },
  {
    id: "r6m-thankyou-letter",
    part: 6,
    band: 700,
    passage: [
      {
        docType: "letter",
        header: [
          { label: "From", value: "Ilhan Berg, Director, Northgate Community Center" },
          { label: "Date", value: "8 May" },
        ],
        body: `Dear Volunteers,

On behalf of everyone at Northgate, thank you for giving your Saturday to the spring cleanup. More than ninety of you turned out — nearly double last year's number.

Because so many people came, we finished the riverside path a full day [[1]] schedule. That meant the crew could also clear the picnic area, which had not been touched since autumn. [[2]]

Photographs from the day are now posted in the main hallway. If you would like a copy of any of them, please [[3]] the front desk and we will print one for you at no charge.

Our next cleanup is scheduled for 14 September. We hope [[4]] many of you there again.

With gratitude,
Ilhan Berg`,
      },
    ],
    questions: [
      {
        id: "q-r6m-thankyou-letter-1",
        blank: 1,
        skill: "vocab",
        band: 700,
        answer: 1,
        choices: [
          { text: "behind", why: "'예정보다 늦게'라 '하루 일찍 끝냈다'는 흐름과 반대다." },
          {
            text: "ahead of",
            why: "정답. ahead of schedule = '예정보다 앞서'. 사람이 많이 와서 빨리 끝났다는 앞 문장과 이어진다.",
          },
          { text: "instead of", why: "'~ 대신에'라 뜻이 맞지 않는다." },
          { text: "on top of", why: "'~에 더하여'다." },
        ],
      },
      {
        id: "q-r6m-thankyou-letter-2",
        blank: 2,
        skill: "sentence",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "Volunteers must be at least eighteen years old.",
            why: "자격 요건은 감사 편지의 이 자리에 오지 않는다.",
          },
          {
            text: "The riverside path will be closed for repairs next month.",
            why: "방금 다 정비했다고 한 길을 다시 닫는다는 것은 앞과 어긋난다.",
          },
          {
            text: "Both areas are now ready for the summer season.",
            why: "정답. 앞에서 길과 소풍터 두 곳을 끝냈다고 했다. 그 둘을 함께 받아 마무리하는 문장이다.",
          },
          {
            text: "Registration for the fall session opens in July.",
            why: "다른 프로그램 이야기로 새 버린다.",
          },
        ],
      },
      {
        id: "q-r6m-thankyou-letter-3",
        blank: 3,
        skill: "grammar",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "ask",
            why: "정답. please 뒤는 동사원형이다.",
          },
          { text: "asking", why: "please 뒤에 -ing 는 오지 않는다." },
          { text: "asked", why: "과거형은 명령문이 되지 못한다." },
          { text: "to ask", why: "please to ask 라고 쓰지 않는다." },
        ],
      },
      {
        id: "q-r6m-thankyou-letter-4",
        blank: 4,
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "seeing", why: "hope 는 -ing 를 목적어로 받지 않는다." },
          { text: "seen", why: "과거분사 홀로 목적어가 되지 못한다." },
          { text: "we see", why: "접속사 that 없이 절을 바로 붙이는 것도 가능하지만, 뒤가 many of you there 로 이어져 부정사가 자연스럽다." },
          {
            text: "to see",
            why: "정답. hope + to 부정사. hope 는 -ing 를 받지 못하는 대표 동사다.",
          },
        ],
      },
    ],
  },
];
