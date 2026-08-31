import type { ReadingSet } from "@/lib/types";

/**
 * Part 5 · 단문 빈칸.
 *
 * 실제 시험지를 옮긴 것이 아니라 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * 문항마다 어떤 문법·어휘를 겨냥하는지 links 로 이어 두어, 틀리면 그 항목이
 * 복습 큐로 들어간다.
 *
 * 선택지 해설(why)은 정답만이 아니라 **왜 나머지가 아닌지**까지 적었다.
 * Part 5 는 "답을 아는 것"보다 "오답을 쳐내는 속도"가 점수를 만든다.
 */
export const READING_PART5: ReadingSet[] = [
  {
    id: "r5-noun-place",
    part: 5,
    band: 600,
    links: ["g-pos-noun", "v-submit"],
    questions: [
      {
        id: "q-r5-noun-place",
        prompt:
          "All contractors must submit their ______ to the site manager before work begins.",
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "certify", why: "동사다. 소유격 their 뒤에는 올 수 없다." },
          { text: "certified", why: "과거분사·형용사다. 뒤에 꾸밀 명사가 없다." },
          {
            text: "certifications",
            why: "정답. 소유격 their 뒤이자 타동사 submit 의 목적어 자리 → 명사.",
          },
          { text: "certifiably", why: "부사다. 목적어 자리에 올 수 없다." },
        ],
      },
    ],
  },
  {
    id: "r5-adj-place",
    part: 5,
    band: 600,
    links: ["g-pos-adj"],
    questions: [
      {
        id: "q-r5-adj-place",
        prompt:
          "The committee made a ______ decision to postpone the product launch.",
        skill: "grammar",
        band: 600,
        answer: 1,
        choices: [
          { text: "unanimously", why: "부사는 명사 decision 을 꾸미지 못한다." },
          {
            text: "unanimous",
            why: "정답. 관사 a 와 명사 decision 사이 → 형용사 자리.",
          },
          { text: "unanimity", why: "명사다. 명사 두 개가 나란히 올 자리가 아니다." },
          { text: "unanimousness", why: "역시 명사이고, 실제로 쓰이지 않는 형태다." },
        ],
      },
    ],
  },
  {
    id: "r5-adv-place",
    part: 5,
    band: 600,
    links: ["g-pos-adv"],
    questions: [
      {
        id: "q-r5-adv-place",
        prompt:
          "The technician examined the equipment ______ before signing off on the inspection.",
        skill: "grammar",
        band: 600,
        answer: 3,
        choices: [
          { text: "thorough", why: "형용사다. 꾸밀 명사가 뒤에 없다." },
          { text: "thoroughness", why: "명사다. 목적어는 이미 the equipment 로 채워졌다." },
          { text: "more thorough", why: "비교급 형용사이고, than 도 없다." },
          {
            text: "thoroughly",
            why: "정답. 빈칸을 지워도 문장이 완전하다 → 부사 자리.",
          },
        ],
      },
    ],
  },
  {
    id: "r5-agreement",
    part: 5,
    band: 700,
    links: ["g-verb-agree"],
    questions: [
      {
        id: "q-r5-agreement",
        prompt:
          "The list of approved suppliers ______ updated at the beginning of each quarter.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "is",
            why: "정답. 주어는 list(단수)다. of approved suppliers 는 전치사구라 주어가 될 수 없다.",
          },
          { text: "are", why: "가장 가까운 suppliers 에 맞춘 오답. 출제자가 노린 자리다." },
          { text: "being", why: "동사가 없어 문장이 성립하지 않는다." },
          { text: "have been", why: "복수 동사이고, 주어 list 와 맞지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5-passive",
    part: 5,
    band: 700,
    links: ["g-verb-passive"],
    questions: [
      {
        id: "q-r5-passive",
        prompt:
          "The revised safety guidelines ______ to all department heads last Friday.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "distributed", why: "능동인데 뒤에 목적어가 없다." },
          { text: "have distributed", why: "역시 능동이고 목적어가 없다." },
          {
            text: "were distributed",
            why: "정답. 빈칸 뒤에 목적어 없이 to 가 왔고 last Friday 로 과거다 → 과거 수동.",
          },
          { text: "distributing", why: "동사 자리를 채우지 못한다." },
        ],
      },
    ],
  },
  {
    id: "r5-tense-since",
    part: 5,
    band: 700,
    links: ["g-verb-tense"],
    questions: [
      {
        id: "q-r5-tense-since",
        prompt:
          "Membership ______ steadily since the fitness center introduced its evening classes.",
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "grew", why: "since 절이 있으면 주절은 현재완료여야 한다." },
          {
            text: "has grown",
            why: "정답. since + 과거 시점 → '그때부터 지금까지'라서 현재완료.",
          },
          { text: "will grow", why: "since 는 이미 시작된 일을 말한다." },
          { text: "is growing", why: "현재진행은 since 와 어울리지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5-conj-prep",
    part: 5,
    band: 700,
    links: ["g-conj-vs-prep"],
    questions: [
      {
        id: "q-r5-conj-prep",
        prompt:
          "______ the heavy snowfall, the conference proceeded as originally planned.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Despite",
            why: "정답. 빈칸 뒤가 명사구(the heavy snowfall)다 → 전치사.",
          },
          { text: "Although", why: "접속사라 뒤에 주어+동사가 와야 한다." },
          { text: "Even though", why: "역시 접속사다." },
          { text: "However", why: "부사다. 두 절을 잇지도, 명사를 이끌지도 못한다." },
        ],
      },
    ],
  },
  {
    id: "r5-conj-adverb",
    part: 5,
    band: 800,
    links: ["g-conj-adverb"],
    questions: [
      {
        id: "q-r5-conj-adverb",
        prompt:
          "The prototype passed every stress test; ______, the team decided to run one more trial.",
        skill: "grammar",
        band: 800,
        answer: 3,
        choices: [
          { text: "although", why: "접속사다. 세미콜론 뒤 이 자리에는 오지 못한다." },
          { text: "despite", why: "전치사라 뒤에 명사가 와야 한다." },
          { text: "so that", why: "목적을 나타내는 접속사로, 앞뒤 관계가 맞지 않는다." },
          {
            text: "nevertheless",
            why: "정답. 세미콜론이 두 문장을 이미 이었고, 그 위에 얹히는 접속부사 자리다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5-relative",
    part: 5,
    band: 700,
    links: ["g-relative-basic"],
    questions: [
      {
        id: "q-r5-relative",
        prompt:
          "We have selected a supplier ______ delivery times consistently meet our standards.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "who", why: "주격이다. 뒤 문장에 주어(delivery times)가 이미 있다." },
          { text: "which", why: "역시 주어나 목적어 자리를 채우는 관계사다." },
          {
            text: "whose",
            why: "정답. delivery times consistently meet ~ 이 완전하다 → 소유격.",
          },
          { text: "whom", why: "목적격인데 빠진 목적어가 없다." },
        ],
      },
    ],
  },
  {
    id: "r5-gerund",
    part: 5,
    band: 700,
    links: ["g-toinf-vs-gerund"],
    questions: [
      {
        id: "q-r5-gerund",
        prompt:
          "The entire staff is looking forward to ______ with the new regional director.",
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "work", why: "여기서 to 는 전치사라 동사원형이 올 수 없다." },
          {
            text: "working",
            why: "정답. look forward to 의 to 는 전치사다 → 동명사.",
          },
          { text: "have worked", why: "전치사 뒤 자리에 맞지 않는다." },
          { text: "be worked", why: "수동일 이유가 없고 형태도 맞지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5-participle",
    part: 5,
    band: 800,
    links: ["g-participle"],
    questions: [
      {
        id: "q-r5-participle",
        prompt:
          "Please refer to the ______ instructions before assembling the unit.",
        skill: "grammar",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "enclosed",
            why: "정답. 설명서는 동봉되는 쪽이다 → 과거분사.",
          },
          { text: "enclosing", why: "설명서가 무언가를 동봉하는 것이 아니다." },
          { text: "enclose", why: "동사원형은 명사를 꾸미지 못한다." },
          { text: "enclosure", why: "명사가 명사를 이렇게 꾸미지는 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5-pronoun",
    part: 5,
    band: 600,
    links: ["g-pronoun-case"],
    questions: [
      {
        id: "q-r5-pronoun",
        prompt:
          "Ms. Okafor reviewed the budget proposal and forwarded ______ comments to the finance team.",
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "she", why: "주격이다. 이 자리는 명사 comments 앞이다." },
          { text: "her own", why: "형태는 가능하나 뒤에 소유격이 또 필요 없고, 문맥상 어색하다." },
          { text: "her", why: "정답. 명사 comments 앞 → 소유격." },
          { text: "herself", why: "재귀대명사는 명사를 꾸미지 못한다." },
        ],
      },
    ],
  },
  {
    id: "r5-subjunctive",
    part: 5,
    band: 800,
    links: ["g-subjunctive-should"],
    questions: [
      {
        id: "q-r5-subjunctive",
        prompt:
          "The consultant recommended that the company ______ its return policy before the holiday season.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "revises", why: "recommend that 뒤에는 수 일치를 하지 않는다." },
          {
            text: "revise",
            why: "정답. 제안·요구 동사 뒤 that절은 should 가 생략된 동사원형이다.",
          },
          { text: "revised", why: "과거형은 이 구문에 오지 않는다." },
          { text: "is revising", why: "진행형도 마찬가지다." },
        ],
      },
    ],
  },
  {
    id: "r5-comparison",
    part: 5,
    band: 700,
    links: ["g-comparison"],
    questions: [
      {
        id: "q-r5-comparison",
        prompt:
          "The upgraded filtration system is ______ more efficient than the model it replaced.",
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "very", why: "very 는 원급만 강조한다. 비교급 앞에는 오지 못한다." },
          { text: "too", why: "too 도 비교급을 강조하지 못한다." },
          { text: "so", why: "마찬가지다." },
          {
            text: "considerably",
            why: "정답. 비교급 강조는 much · far · even · considerably 로 한다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5-prep-by-until",
    part: 5,
    band: 600,
    links: ["g-prep-time"],
    questions: [
      {
        id: "q-r5-prep-by-until",
        prompt:
          "Registration forms must be returned to the front office ______ March 31.",
        skill: "grammar",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "by",
            why: "정답. 반납은 한 번에 끝나는 일이므로 마감을 뜻하는 by 다.",
          },
          { text: "until", why: "'그때까지 계속'이라는 뜻이라 반납 행위와 맞지 않는다." },
          { text: "since", why: "과거부터 지금까지를 나타낸다." },
          { text: "during", why: "뒤에 기간이 와야 하는데 날짜가 왔다." },
        ],
      },
    ],
  },
  {
    id: "r5-countable",
    part: 5,
    band: 600,
    links: ["g-structure-count"],
    questions: [
      {
        id: "q-r5-countable",
        prompt:
          "The orientation packet contains ______ information about parking and building access.",
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "many", why: "information 은 셀 수 없다." },
          { text: "a few", why: "역시 가산 명사에만 쓴다." },
          {
            text: "a great deal of",
            why: "정답. 불가산 명사 information 과 어울린다.",
          },
          { text: "several", why: "가산 복수에만 쓴다." },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-deadline",
    part: 5,
    band: 600,
    links: ["v-deadline"],
    questions: [
      {
        id: "q-r5-vocab-deadline",
        prompt:
          "Despite the shortage of materials, the crew managed to ______ the deadline.",
        skill: "vocab",
        band: 600,
        answer: 1,
        choices: [
          { text: "keep", why: "약속(promise)에는 쓰지만 deadline 에는 쓰지 않는다." },
          {
            text: "meet",
            why: "정답. deadline 과 짝이 되는 동사는 meet 이다. 연어를 통째로 외워야 하는 자리다.",
          },
          { text: "catch", why: "기차·감기에는 쓰지만 마감에는 쓰지 않는다." },
          { text: "arrive", why: "자동사라 목적어를 바로 취하지 못한다." },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-eligible",
    part: 5,
    band: 700,
    links: ["v-eligible"],
    questions: [
      {
        id: "q-r5-vocab-eligible",
        prompt:
          "Employees become ______ for the retirement plan after one year of service.",
        skill: "vocab",
        band: 700,
        answer: 3,
        choices: [
          { text: "capable", why: "be capable of + 동명사 꼴로 쓴다. for 와 어울리지 않는다." },
          { text: "available", why: "'시간이 되는'이라는 뜻이라 자격 이야기와 맞지 않는다." },
          { text: "responsible", why: "'책임이 있는'이라 뜻이 어긋난다." },
          {
            text: "eligible",
            why: "정답. eligible for = 자격이 되는. 조건을 채워 자격이 생기는 맥락이다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-comply",
    part: 5,
    band: 700,
    links: ["v-comply", "v-adhere"],
    questions: [
      {
        id: "q-r5-vocab-comply",
        prompt:
          "All subcontractors are expected to ______ with the updated safety regulations.",
        skill: "vocab",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "comply",
            why: "정답. 빈칸 뒤 with 가 결정한다. comply with 가 짝이다.",
          },
          { text: "adhere", why: "뜻은 같지만 adhere to 를 쓴다. 전치사가 다르다." },
          { text: "abide", why: "역시 뜻은 같지만 abide by 다." },
          { text: "observe", why: "전치사 없이 목적어를 바로 취한다(observe the rules)." },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-reimburse",
    part: 5,
    band: 700,
    links: ["v-reimburse", "v-refund"],
    questions: [
      {
        id: "q-r5-vocab-reimburse",
        prompt:
          "The company will ______ employees for any travel expenses incurred during the conference.",
        skill: "vocab",
        band: 700,
        answer: 2,
        choices: [
          { text: "refund", why: "산 물건 값을 되돌려 줄 때 쓴다. 목적어도 보통 돈이나 물건이다." },
          { text: "compensate", why: "compensate A for B 로 쓸 수는 있으나 보통 손해 배상 쪽이다." },
          {
            text: "reimburse",
            why: "정답. 직원이 대신 쓴 돈을 회사가 갚아 주는 것이 reimburse 다.",
          },
          { text: "deposit", why: "'예치하다'라 뜻이 맞지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-subject",
    part: 5,
    band: 800,
    links: ["v-subject"],
    questions: [
      {
        id: "q-r5-vocab-subject",
        prompt:
          "All rates quoted in this brochure are ______ to change without prior notice.",
        skill: "vocab",
        band: 800,
        answer: 1,
        choices: [
          { text: "limited", why: "be limited to 는 '~로 제한된다'라 뜻이 다르다." },
          {
            text: "subject",
            why: "정답. be subject to change = 변경될 수 있다. 안내문에 굳어진 표현이다.",
          },
          { text: "liable", why: "be liable for(책임이 있는)로 쓴다." },
          { text: "eligible", why: "자격 이야기라 문맥과 맞지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-notwithstanding",
    part: 5,
    band: 900,
    links: ["v-notwithstanding", "g-conj-vs-prep"],
    questions: [
      {
        id: "q-r5-vocab-notwithstanding",
        prompt:
          "______ the recent downturn, the firm reported its highest annual revenue to date.",
        skill: "grammar",
        band: 900,
        answer: 3,
        choices: [
          { text: "Whereas", why: "접속사라 뒤에 주어+동사가 와야 한다." },
          { text: "Even if", why: "역시 접속사다." },
          { text: "Nonetheless", why: "접속부사라 명사구를 이끌지 못한다." },
          {
            text: "Notwithstanding",
            why: "정답. 뒤가 명사구이고 '~에도 불구하고'라는 전치사다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-thorough",
    part: 5,
    band: 700,
    links: ["v-thorough"],
    questions: [
      {
        id: "q-r5-vocab-thorough",
        prompt:
          "Each shipment undergoes a ______ inspection before it leaves the warehouse.",
        skill: "vocab",
        band: 700,
        answer: 0,
        choices: [
          { text: "thorough", why: "정답. '철저한 검사'라는 뜻으로 명사 앞 형용사 자리에 맞는다." },
          { text: "through", why: "전치사다. 관사와 명사 사이에 올 수 없다. 철자 한 글자 함정이다." },
          { text: "thoroughly", why: "부사라 명사를 꾸미지 못한다." },
          { text: "throughout", why: "역시 전치사다." },
        ],
      },
    ],
  },
  {
    id: "r5-vocab-prior",
    part: 5,
    band: 700,
    links: ["v-prior"],
    questions: [
      {
        id: "q-r5-vocab-prior",
        prompt:
          "Please review the attached agenda ______ to the board meeting on Thursday.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "before", why: "before 는 뒤에 to 를 붙이지 않는다." },
          { text: "ahead", why: "ahead of 라고 해야 한다. to 와는 짝이 아니다." },
          {
            text: "prior",
            why: "정답. prior to = ~전에. 빈칸 뒤 to 가 답을 정한다.",
          },
          { text: "previously", why: "부사 단독이라 뒤의 to 와 이어지지 않는다." },
        ],
      },
    ],
  },
];
