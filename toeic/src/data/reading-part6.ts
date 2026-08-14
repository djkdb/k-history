import type { ReadingSet } from "@/lib/types";

/**
 * Part 6 · 장문 빈칸.
 *
 * 지문 하나에 빈칸 네 개가 붙고, 그중 하나는 **문장을 통째로 넣는 문제**다.
 * Part 5 와 결정적으로 다른 점은 "빈칸 문장만 봐서는 못 푸는 문항이 섞여 있다"는 것이다.
 * 시제와 연결어는 앞뒤 문장이 정한다.
 */
export const READING_PART6: ReadingSet[] = [
  {
    id: "r6-gym-notice",
    part: 6,
    band: 600,
    links: ["g-verb-tense", "g-conj-adverb", "v-facility"],
    passage: [
      {
        docType: "notice",
        header: [
          { label: "받는 사람", value: "All Building Tenants" },
          { label: "제목", value: "Fitness Center Renovation" },
        ],
        body: `Beginning on Monday, June 3, the fitness center on the ground floor [[1]] closed for renovation. The project is expected to take approximately six weeks.

During this period, tenants may use the partner gym at 40 Marlow Street at no additional cost. [[2]] Simply present your building key card at their front desk.

We recognize that this may be inconvenient. [[3]], we believe the improvements will be worth the wait. The renovated space will include additional cardio equipment, two group exercise rooms, and expanded [[4]] areas.

Thank you for your patience.`,
      },
    ],
    questions: [
      {
        id: "q-r6-gym-1",
        blank: 1,
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "has been", why: "6월 3일부터 시작되는 일이라 현재완료는 맞지 않는다." },
          { text: "was", why: "과거형이면 이미 지난 일이 된다. Beginning on June 3 와 어긋난다." },
          {
            text: "will be",
            why: "정답. Beginning on Monday, June 3 가 미래를 못 박는다.",
          },
          { text: "is being", why: "지금 진행 중이라는 뜻이라 시작일과 맞지 않는다." },
        ],
      },
      {
        id: "q-r6-gym-2",
        blank: 2,
        skill: "sentence",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "The renovation was originally scheduled for last year.",
            why: "과거 일정 이야기라 앞뒤 흐름과 이어지지 않는다.",
          },
          {
            text: "We have arranged temporary access for all residents.",
            why: "정답. 앞 문장(제휴 헬스장 무료 이용)과 뒤 문장(카드만 보여 주면 된다)을 이어 준다.",
          },
          {
            text: "Membership fees will increase starting in July.",
            why: "요금 인상은 이 문단 어디에도 근거가 없다.",
          },
          {
            text: "Please direct all maintenance requests to the front desk.",
            why: "front desk 라는 말이 뒤에 나와 그럴듯하지만, 유지보수 요청은 이 글의 내용이 아니다.",
          },
        ],
      },
      {
        id: "q-r6-gym-3",
        blank: 3,
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "However",
            why: "정답. 앞은 '불편할 것'이고 뒤는 '그만한 값어치가 있다'로 뒤집힌다.",
          },
          { text: "Therefore", why: "인과로 이어지지 않는다." },
          { text: "For example", why: "예시가 아니다." },
          { text: "In addition", why: "덧붙이는 관계가 아니라 뒤집는 관계다." },
        ],
      },
      {
        id: "q-r6-gym-4",
        blank: 4,
        skill: "vocab",
        band: 600,
        answer: 3,
        choices: [
          { text: "financial", why: "헬스장 시설과 어울리지 않는다." },
          { text: "residential", why: "주거 구역은 헬스장 안 시설이 아니다." },
          { text: "editorial", why: "문맥과 무관하다." },
          {
            text: "locker",
            why: "정답. 운동 기구·단체 운동실과 나란히 놓일 시설은 라커룸이다.",
          },
        ],
      },
    ],
  },
  {
    id: "r6-job-offer",
    part: 6,
    band: 700,
    links: ["g-pos-noun", "g-toinf-vs-gerund", "v-candidate"],
    passage: [
      {
        docType: "letter",
        header: [
          { label: "보내는 사람", value: "Hana Choi, Director of Human Resources" },
          { label: "받는 사람", value: "Mr. Elliot Vance" },
          { label: "날짜", value: "October 14" },
        ],
        body: `Dear Mr. Vance,

On behalf of Kestrel Analytics, I am pleased to offer you the position of data engineer. Your [[1]] during the interview process was impressive, particularly your work on the transit modeling project.

The position begins on November 4. You will report to Priya Raman, who [[2]] the platform team. Your starting salary and benefits are detailed in the enclosed summary.

[[3]] Please sign and return the enclosed agreement by October 21 so that we can begin the onboarding process.

We very much look forward to [[4]] with you.

Sincerely,
Hana Choi`,
      },
    ],
    questions: [
      {
        id: "q-r6-job-1",
        blank: 1,
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "perform", why: "동사다. 소유격 Your 뒤에는 명사가 와야 한다." },
          {
            text: "performance",
            why: "정답. 소유격 Your 뒤이자 문장의 주어 자리 → 명사.",
          },
          { text: "performed", why: "과거분사라 주어 자리를 채우지 못한다." },
          { text: "performing", why: "동명사로 볼 수도 있으나 소유격 뒤 명사 자리에는 performance 가 자연스럽다." },
        ],
      },
      {
        id: "q-r6-job-2",
        blank: 2,
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "leads",
            why: "정답. 관계대명사 who 의 선행사가 Priya Raman(단수)이므로 단수 동사.",
          },
          { text: "lead", why: "복수 동사라 단수 선행사와 맞지 않는다." },
          { text: "leading", why: "동사 자리를 채우지 못한다." },
          { text: "to lead", why: "관계절의 동사 자리에 부정사는 올 수 없다." },
        ],
      },
      {
        id: "q-r6-job-3",
        blank: 3,
        skill: "sentence",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "Unfortunately, we have decided to move forward with another candidate.",
            why: "채용 제안서 한가운데에 불합격 통보가 들어갈 수 없다. 앞뒤와 정면으로 충돌한다.",
          },
          {
            text: "We will post the position again next quarter.",
            why: "이미 이 사람에게 제안하고 있다. 재공고할 이유가 없다.",
          },
          {
            text: "This offer is contingent upon the completion of a background check.",
            why: "정답. 뒤 문장의 '동의서에 서명해 반송하라'와 자연스럽게 이어지는 조건 안내다.",
          },
          {
            text: "Your interview has been rescheduled for October 21.",
            why: "면접은 이미 끝났고, 10월 21일은 서류 반송 기한이다. 날짜만 같아 그럴듯하게 보인다.",
          },
        ],
      },
      {
        id: "q-r6-job-4",
        blank: 4,
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "work", why: "look forward to 의 to 는 전치사다." },
          { text: "have worked", why: "전치사 뒤에 올 수 없는 형태다." },
          { text: "be worked", why: "수동일 이유가 없다." },
          {
            text: "working",
            why: "정답. look forward to + 동명사.",
          },
        ],
      },
    ],
  },
  {
    id: "r6-product-recall",
    part: 6,
    band: 800,
    links: ["g-verb-passive", "v-defective", "v-expedite"],
    passage: [
      {
        docType: "email",
        header: [
          { label: "보내는 사람", value: "customercare@northvale.example" },
          { label: "제목", value: "Important: Voluntary Recall of Model TR-40 Kettles" },
        ],
        body: `Dear Customer,

Our records indicate that you purchased a Northvale TR-40 electric kettle within the past year. We are writing to inform you that a limited number of these units [[1]] with a faulty temperature sensor.

While no injuries have been reported, the sensor may allow the kettle to continue heating after the water has boiled. [[2]] We are therefore recalling all units manufactured between January and March.

To determine whether your kettle is affected, locate the serial number on the base. If it begins with TR40-A, please stop using the product [[3]] and visit our Web site to request a prepaid return label.

Replacement units will be [[4]] at no charge, and we will cover all shipping costs in both directions.

We apologize sincerely for the inconvenience.`,
      },
    ],
    questions: [
      {
        id: "q-r6-recall-1",
        blank: 1,
        skill: "grammar",
        band: 800,
        answer: 2,
        choices: [
          { text: "shipping", why: "동사 자리를 채우지 못한다." },
          { text: "have shipped", why: "능동이면 주전자가 무언가를 발송한 것이 된다." },
          {
            text: "were shipped",
            why: "정답. 주전자는 발송되는 쪽이고, 이미 팔려 나간 과거의 일이다 → 과거 수동.",
          },
          { text: "will ship", why: "이미 구매한 제품이라 미래가 아니다." },
        ],
      },
      {
        id: "q-r6-recall-2",
        blank: 2,
        skill: "sentence",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "In rare cases, this could cause the unit to overheat.",
            why: "정답. 앞 문장(끓은 뒤에도 계속 가열될 수 있다)의 결과를 말하고, 그래서 회수한다는 뒤 문장으로 이어진다.",
          },
          {
            text: "The kettle is available in four colors.",
            why: "안전 문제를 알리는 문단에 제품 색상은 끼어들 수 없다.",
          },
          {
            text: "Customers have praised the product's fast heating time.",
            why: "칭찬은 회수 안내의 흐름과 어긋난다. heating 이라는 단어만 겹친다.",
          },
          {
            text: "Please retain your receipt for warranty purposes.",
            why: "뒤에서 영수증이 아니라 일련번호를 보라고 한다.",
          },
        ],
      },
      {
        id: "q-r6-recall-3",
        blank: 3,
        skill: "vocab",
        band: 700,
        answer: 1,
        choices: [
          { text: "eventually", why: "'결국에는'이라 위험을 알리는 문맥과 맞지 않는다." },
          {
            text: "immediately",
            why: "정답. 안전 회수 안내에서는 즉시 사용을 멈추라고 한다.",
          },
          { text: "gradually", why: "서서히 멈추라는 것은 말이 되지 않는다." },
          { text: "occasionally", why: "가끔 멈추라는 뜻이 되어 어긋난다." },
        ],
      },
      {
        id: "q-r6-recall-4",
        blank: 4,
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "providing", why: "will be 뒤에 능동 진행이 오면 교체품이 무언가를 제공하는 것이 된다." },
          { text: "provide", why: "will be 뒤에 동사원형은 올 수 없다." },
          { text: "to provide", why: "형태가 맞지 않는다." },
          {
            text: "provided",
            why: "정답. 교체품은 제공되는 쪽이다 → will be provided(미래 수동).",
          },
        ],
      },
    ],
  },
];
