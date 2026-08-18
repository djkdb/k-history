import type { ReadingSet } from "@/lib/types";

/**
 * Part 5 · 단문 빈칸 — 추가 문항.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * Part 5 는 읽기 100문항 중 30문항인데, 진짜 값어치는 문항 수가 아니라
 * **시간**에 있다. 여기서 한 문항에 삼십 초씩 쓰면 Part 7 을 끝까지
 * 못 푼다. 그래서 문항마다 '해석하지 않고 자리만 보고 푸는 길'이
 * 있는지를 기준으로 썼다.
 *
 * 선택지의 why 에는 답인 이유가 아니라 **그 자리에 왜 못 들어가는지**를
 * 적는다. 틀렸을 때 알고 싶은 것이 그것이기 때문이다.
 */
export const READING_PART5_MORE: ReadingSet[] = [
  /* ── 품사 자리 ── */
  {
    id: "r5m-noun-after-article",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5m-noun-after-article-1",
        prompt:
          "All visitors must present a valid ------- at the security desk before entering.",
        skill: "grammar",
        band: 600,
        answer: 1,
        choices: [
          { text: "identify", why: "동사다. 관사 a 와 형용사 valid 뒤는 명사 자리다." },
          {
            text: "identification",
            why: "정답. a + 형용사 + ___ 는 명사 자리다. 해석하지 않아도 자리만으로 답이 정해진다.",
          },
          { text: "identified", why: "과거분사다. 형용사 valid 가 이미 있어 들어갈 자리가 없다." },
          { text: "identifiable", why: "형용사다. 형용사가 둘 겹칠 수 없다." },
        ],
      },
    ],
    links: ["g-pos-noun"],
  },
  {
    id: "r5m-adv-between-be-pp",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-adv-between-be-pp-1",
        prompt:
          "The revised guidelines were ------- distributed to every branch before the deadline.",
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "prompt", why: "형용사다. be 와 p.p. 사이는 부사 자리다." },
          { text: "prompts", why: "명사(또는 3인칭 동사)다. 이 자리에 들어갈 수 없다." },
          { text: "prompted", why: "과거분사다. distributed 가 이미 본동사 자리를 차지했다." },
          {
            text: "promptly",
            why: "정답. were ___ distributed — be 동사와 과거분사 사이는 부사만 들어간다. Part 5 에서 가장 잘 알려진 자리다.",
          },
        ],
      },
    ],
    links: ["g-pos-adv"],
  },
  {
    id: "r5m-adj-before-noun",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5m-adj-before-noun-1",
        prompt:
          "Ms. Reyes gave a ------- explanation of the new filing procedure to her team.",
        skill: "grammar",
        band: 600,
        answer: 0,
        choices: [
          { text: "detailed", why: "정답. a ___ 명사 — 명사 앞은 형용사 자리다." },
          { text: "detail", why: "명사다. 명사가 둘 겹치는 것이 불가능하지는 않지만, 여기서는 '자세한 설명'이라는 형용사 자리다." },
          { text: "details", why: "복수 명사라 관사 a 와 어울리지 않는다." },
          { text: "detailing", why: "동명사·현재분사다. explanation 을 꾸미지 못한다." },
        ],
      },
    ],
    links: ["g-pos-adj"],
  },
  {
    id: "r5m-noun-vs-gerund",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-noun-vs-gerund-1",
        prompt:
          "Careful ------- of the shipping records revealed a discrepancy in the monthly totals.",
        skill: "grammar",
        band: 800,
        answer: 2,
        choices: [
          { text: "examine", why: "동사다. 형용사 Careful 뒤는 명사 자리다." },
          { text: "examined", why: "과거분사다. 주어 자리에 홀로 설 수 없다." },
          {
            text: "examination",
            why: "정답. 형용사(Careful)가 꾸미고 뒤에 of 가 오면 명사다. 동명사였다면 형용사가 아니라 부사(Carefully)가 앞에 왔을 것이다 — 800점대는 이 갈림을 묻는다.",
          },
          { text: "examining", why: "동명사는 형용사가 아니라 부사가 꾸미고, of 없이 목적어를 바로 받는다." },
        ],
      },
    ],
  },

  /* ── 동사 (수일치·태·시제) ── */
  {
    id: "r5m-agreement-each",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-agreement-each-1",
        prompt:
          "Each of the department managers ------- required to submit a staffing forecast.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "is",
            why: "정답. 주어는 Each 이지 managers 가 아니다. of 뒤의 복수 명사에 이끌려 are 를 고르게 만드는 것이 이 문제의 노림수다.",
          },
          { text: "are", why: "managers 에 맞춘 것이다. 전치사구 안의 명사는 주어가 될 수 없다." },
          { text: "being", why: "본동사가 될 수 없다." },
          { text: "to be", why: "본동사 자리에 부정사는 오지 않는다." },
        ],
      },
    ],
    links: ["g-verb-agree"],
  },
  {
    id: "r5m-passive-report",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-passive-report-1",
        prompt:
          "The maintenance request ------- to the facilities team as soon as it was received.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "forwarded", why: "능동이다. 요청서가 스스로 전달할 수는 없다." },
          { text: "has forwarded", why: "역시 능동이다." },
          {
            text: "was forwarded",
            why: "정답. 뒤에 목적어가 없고 to 가 바로 온다 — 목적어가 비면 수동이다. 해석보다 이 표시가 빠르다.",
          },
          { text: "forwarding", why: "본동사가 될 수 없다." },
        ],
      },
    ],
    links: ["g-verb-passive"],
  },
  {
    id: "r5m-tense-by-the-time",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-tense-by-the-time-1",
        prompt:
          "By the time the auditors arrive next Monday, the finance team ------- all supporting documents.",
        skill: "grammar",
        band: 800,
        answer: 3,
        choices: [
          { text: "compiled", why: "과거다. 기준 시점이 다음 주 월요일이라 맞지 않는다." },
          { text: "is compiling", why: "현재진행은 '그때까지 끝내 둔다'를 말하지 못한다." },
          { text: "had compiled", why: "과거완료는 과거의 어느 시점보다 먼저를 말한다. 여기 기준은 미래다." },
          {
            text: "will have compiled",
            why: "정답. 'By the time + 현재시제(미래 의미)' 가 보이면 주절은 미래완료다. 이 짝은 통째로 외워 두면 해석 없이 풀린다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5m-tense-for-years",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-tense-for-years-1",
        prompt:
          "Delmar Textiles ------- fabric to regional retailers for more than twenty years.",
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "supplies", why: "현재는 지금의 습관·사실이다. '20년 넘게'라는 기간과 어울리지 않는다." },
          {
            text: "has supplied",
            why: "정답. 'for + 기간' 은 현재완료를 부른다.",
          },
          { text: "supplied", why: "과거는 지금은 아니라는 뜻이 되어 for 20 years 와 어긋난다." },
          { text: "will supply", why: "미래는 지나온 기간을 말하지 못한다." },
        ],
      },
    ],
    links: ["g-verb-tense"],
  },
  {
    id: "r5m-agreement-number-of",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-agreement-number-of-1",
        prompt:
          "The number of applicants for the internship ------- significantly this year.",
        skill: "grammar",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "has risen",
            why: "정답. The number of ~ 는 '~의 수'라 단수다. A number of ~ 였다면 '많은 ~'이라 복수가 된다 — 관사 하나로 갈린다.",
          },
          { text: "have risen", why: "applicants 에 맞춘 것이다. 주어는 The number 다." },
          { text: "are rising", why: "역시 복수로 받았다." },
          { text: "rise", why: "복수 동사이고 시제도 어울리지 않는다." },
        ],
      },
    ],
  },

  /* ── 전치사·접속사 ── */
  {
    id: "r5m-prep-during-while",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5m-prep-during-while-1",
        prompt:
          "Please silence your mobile phones ------- the awards ceremony this evening.",
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "while", why: "접속사다. 뒤에 주어와 동사가 와야 한다." },
          { text: "although", why: "접속사이고 뜻도 맞지 않는다." },
          {
            text: "during",
            why: "정답. 뒤가 명사구(the awards ceremony)면 전치사다. during 과 while 의 갈림은 뒤에 무엇이 오는지로만 정해진다.",
          },
          { text: "whereas", why: "접속사다." },
        ],
      },
    ],
    links: ["g-conj-vs-prep"],
  },
  {
    id: "r5m-conj-because-of",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5m-conj-because-of-1",
        prompt:
          "The outdoor concert was postponed ------- the forecast called for heavy rain.",
        skill: "grammar",
        band: 600,
        answer: 1,
        choices: [
          { text: "because of", why: "뒤에 명사가 와야 하는데 주어+동사가 왔다." },
          {
            text: "because",
            why: "정답. 뒤가 절(the forecast called…)이므로 접속사다.",
          },
          { text: "due to", why: "전치사구다. 뒤에 명사가 온다." },
          { text: "in spite of", why: "전치사구이고 뜻도 반대다." },
        ],
      },
    ],
  },
  {
    id: "r5m-prep-within",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-prep-within-1",
        prompt:
          "Refunds are processed ------- five business days of receiving the returned item.",
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "until", why: "'그때까지 계속'이라는 뜻이라 처리 기간과 어울리지 않는다." },
          { text: "by", why: "기한 하나를 가리킨다. 뒤의 five business days 는 기한이 아니라 기간이다." },
          { text: "since", why: "과거 시점부터 지금까지를 뜻한다." },
          {
            text: "within",
            why: "정답. '기간 이내'는 within 이다. within + 기간 + of + -ing 는 통째로 자주 나온다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5m-conj-adverb-however",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-conj-adverb-however-1",
        prompt:
          "The prototype passed every stress test; -------, the design team recommended one further revision.",
        skill: "grammar",
        band: 800,
        answer: 2,
        choices: [
          { text: "despite", why: "전치사다. 뒤에 명사가 와야 한다." },
          { text: "even though", why: "접속사다. 세미콜론 뒤에서 두 절을 다시 잇지 않는다." },
          {
            text: "nevertheless",
            why: "정답. 세미콜론 뒤 + 쉼표 앞은 접속부사 자리다. 앞뒤가 뒤집히는 흐름이라 뜻도 맞는다.",
          },
          { text: "so that", why: "목적을 이끄는 접속사다." },
        ],
      },
    ],
    links: ["g-conj-adverb"],
  },
  {
    id: "r5m-conj-unless",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-conj-unless-1",
        prompt:
          "Employees may not access the archive room ------- they have written authorization.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "unless",
            why: "정답. '~하지 않는 한'. 앞이 부정문(may not)이고 뒤가 조건이면 unless 가 자연스럽다.",
          },
          { text: "whether", why: "'~인지 아닌지'라 조건을 만들지 못한다." },
          { text: "in case of", why: "전치사구다. 뒤에 명사가 온다." },
          { text: "so", why: "결과를 이끈다. 뜻이 뒤집힌다." },
        ],
      },
    ],
  },

  /* ── 관계사·부정사·분사 ── */
  {
    id: "r5m-relative-whose",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-relative-whose-1",
        prompt:
          "Applicants ------- credentials have already been verified may skip the second interview.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "who", why: "뒤에 명사(credentials)가 바로 오면 주격 who 가 아니다." },
          {
            text: "whose",
            why: "정답. ___ + 명사 + 동사 는 소유격 관계사 자리다. '지원자의 자격이'라는 뜻이 된다.",
          },
          { text: "which", why: "사람 선행사에 쓰지 않고, 뒤에 명사가 바로 오지도 못한다." },
          { text: "whom", why: "목적격이다. 뒤에 명사가 바로 올 수 없다." },
        ],
      },
    ],
    links: ["g-relative-basic"],
  },
  {
    id: "r5m-toinf-purpose",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5m-toinf-purpose-1",
        prompt:
          "------- reduce paper use, the office has switched to digital expense reports.",
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "So", why: "접속사다. 문장 앞에서 목적을 이끌려면 so that + 절이 와야 한다." },
          { text: "For", why: "전치사다. 뒤에 동사원형이 오지 못한다." },
          {
            text: "To",
            why: "정답. 문장 맨 앞의 '~하기 위해'는 To + 동사원형이다.",
          },
          { text: "Because", why: "접속사다. 뒤에 주어와 동사가 와야 한다." },
        ],
      },
    ],
    links: ["g-toinf-vs-gerund"],
  },
  {
    id: "r5m-participle-modifier",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-participle-modifier-1",
        prompt:
          "The equipment ------- last quarter has already reduced production downtime by half.",
        skill: "grammar",
        band: 800,
        answer: 3,
        choices: [
          { text: "installing", why: "장비가 스스로 설치할 수는 없다. 능동 분사는 맞지 않는다." },
          { text: "installs", why: "본동사가 되면 뒤의 has reduced 와 동사가 둘이 된다." },
          { text: "to install", why: "'설치할 장비'가 되어 이미 효과가 났다는 뒤 문장과 어긋난다." },
          {
            text: "installed",
            why: "정답. 명사 뒤에서 꾸미고 '설치된'이라는 수동 뜻이므로 과거분사다. 뒤에 본동사(has reduced)가 따로 있는 것이 표시다.",
          },
        ],
      },
    ],
    links: ["g-participle"],
  },
  {
    id: "r5m-gerund-after-prep",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-gerund-after-prep-1",
        prompt:
          "The committee is responsible for ------- the annual budget before submission.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "reviewing",
            why: "정답. 전치사 for 뒤는 동명사다. be responsible for -ing 로 통째로 익혀 두면 빠르다.",
          },
          { text: "review", why: "동사원형은 전치사 뒤에 오지 못한다." },
          { text: "to review", why: "전치사 뒤에 부정사는 오지 않는다." },
          { text: "reviewed", why: "과거분사가 목적어(the annual budget)를 받을 수 없다." },
        ],
      },
    ],
  },

  /* ── 대명사·비교·기타 ── */
  {
    id: "r5m-pronoun-reflexive",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-pronoun-reflexive-1",
        prompt:
          "Mr. Okafor assembled the display case ------- rather than waiting for a technician.",
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "him", why: "목적어 자리가 이미 the display case 로 차 있다." },
          {
            text: "himself",
            why: "정답. '직접'이라는 뜻을 더하는 재귀대명사다. 빼도 문장이 완전한 자리에 온다는 것이 표시다.",
          },
          { text: "his", why: "소유격이라 뒤에 명사가 필요하다." },
          { text: "he", why: "주격이다. 주어가 이미 있다." },
        ],
      },
    ],
    links: ["g-pronoun-case"],
  },
  {
    id: "r5m-comparison-the-most",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-comparison-the-most-1",
        prompt:
          "Of the three proposals, the one from Halvorsen was by far the ------- detailed.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "more", why: "셋 중 하나를 고르는 자리라 비교급이 아니라 최상급이다." },
          { text: "very", why: "the very detailed 는 최상급을 만들지 못한다." },
          {
            text: "most",
            why: "정답. 'Of the three ~ + the ___' 는 최상급 자리다. by far 도 최상급을 강조하는 말이다.",
          },
          { text: "much", why: "비교급을 강조하는 말이라 the 와 어울리지 않는다." },
        ],
      },
    ],
    links: ["g-comparison"],
  },
  {
    id: "r5m-quantifier-fewer",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-quantifier-fewer-1",
        prompt:
          "The redesigned checkout process requires ------- steps than the previous version.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "less", why: "셀 수 없는 명사에 쓴다. steps 는 셀 수 있다." },
          {
            text: "fewer",
            why: "정답. 셀 수 있는 복수 명사(steps)에는 fewer 다. 이 짝은 매 회 나온다고 봐도 된다.",
          },
          { text: "little", why: "셀 수 없는 명사에 쓰고 비교급도 아니다." },
          { text: "least", why: "최상급이라 than 과 어울리지 않는다." },
        ],
      },
    ],
    links: ["g-structure-count"],
  },
  {
    id: "r5m-pronoun-those",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5m-pronoun-those-1",
        prompt:
          "The sales figures for this quarter far exceed ------- of the same period last year.",
        skill: "grammar",
        band: 900,
        answer: 3,
        choices: [
          { text: "that", why: "앞의 figures 가 복수라 단수 that 으로 받을 수 없다." },
          { text: "them", why: "뒤에 of 가 이어져 수식을 받으므로 인칭대명사는 오지 못한다." },
          { text: "it", why: "역시 단수이고 of 수식도 받지 못한다." },
          {
            text: "those",
            why: "정답. 앞에 나온 복수 명사(figures)를 되받으면서 of 구의 수식을 받는 자리는 those 다.",
          },
        ],
      },
    ],
  },

  /* ── 어휘 ── */
  {
    id: "r5m-vocab-address",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-vocab-address-1",
        prompt:
          "The revised manual ------- several safety concerns raised during the inspection.",
        skill: "vocab",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "addresses",
            why: "정답. address 는 '주소'만이 아니라 '(문제를) 다루다·해결하다'로 훨씬 자주 나온다.",
          },
          { text: "arrives", why: "자동사라 목적어를 받지 못한다." },
          { text: "attends", why: "'참석하다'라 문제를 목적어로 받지 못한다." },
          { text: "advances", why: "'진전시키다'라 우려에 대한 조치를 뜻하지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-accommodate",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-vocab-accommodate-1",
        prompt:
          "The new conference hall can ------- up to four hundred guests.",
        skill: "vocab",
        band: 800,
        answer: 2,
        choices: [
          { text: "afford", why: "'~할 여유가 있다'라 인원 수용을 뜻하지 않는다." },
          { text: "attain", why: "'달성하다'다." },
          {
            text: "accommodate",
            why: "정답. '수용하다'. 사람 수와 함께 나오면 거의 이 낱말이다.",
          },
          { text: "acquire", why: "'획득하다'라 어울리지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-pending",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5m-vocab-pending-1",
        prompt:
          "Construction will begin next spring, ------- approval from the city planning board.",
        skill: "vocab",
        band: 900,
        answer: 1,
        choices: [
          { text: "regarding", why: "'~에 관하여'라 조건을 만들지 못한다." },
          {
            text: "pending",
            why: "정답. '~를 기다리는 동안·~를 조건으로'. 승인·결정과 붙어 나오는 900점대 낱말이다.",
          },
          { text: "including", why: "'~를 포함하여'라 뜻이 맞지 않는다." },
          { text: "following", why: "'~ 뒤에'라면 이미 승인이 난 것이 되어 will begin 과 어긋난다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-inclement",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-vocab-inclement-1",
        prompt:
          "The outdoor session will move indoors in the event of ------- weather.",
        skill: "vocab",
        band: 800,
        answer: 3,
        choices: [
          { text: "considerate", why: "'배려하는'이라 날씨를 꾸미지 못한다." },
          { text: "reluctant", why: "'꺼리는'이다." },
          { text: "abundant", why: "'풍부한'이라 뜻이 맞지 않는다." },
          {
            text: "inclement",
            why: "정답. inclement weather 는 '궂은 날씨'라는 한 덩어리로 나온다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-streamline",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-vocab-streamline-1",
        prompt:
          "The new software was purchased to ------- the approval process for purchase orders.",
        skill: "vocab",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "streamline",
            why: "정답. '절차를 간소화하다'. process·procedure 와 붙어 다닌다.",
          },
          { text: "surpass", why: "'능가하다'라 절차를 목적어로 받지 않는다." },
          { text: "sustain", why: "'유지하다'라 개선의 뜻이 없다." },
          { text: "stimulate", why: "'자극하다'다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-tentative",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-vocab-tentative-1",
        prompt:
          "The itinerary is ------- and may change once the flight times are confirmed.",
        skill: "vocab",
        band: 700,
        answer: 2,
        choices: [
          { text: "mandatory", why: "'의무적인'이라 바뀔 수 있다는 뒷말과 어긋난다." },
          { text: "permanent", why: "'영구적인'이라 정반대다." },
          {
            text: "tentative",
            why: "정답. '잠정적인'. 뒤의 may change 가 그대로 힌트다.",
          },
          { text: "adjacent", why: "'인접한'이라 뜻이 맞지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-waive",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-vocab-waive-1",
        prompt:
          "The bank agreed to ------- the transfer fee for customers with premium accounts.",
        skill: "vocab",
        band: 800,
        answer: 1,
        choices: [
          { text: "wave", why: "'흔들다'다. waive 와 소리가 같아 나란히 놓이는 짝이다." },
          {
            text: "waive",
            why: "정답. '(수수료·권리를) 면제하다'. fee·requirement 와 붙어 나온다.",
          },
          { text: "weigh", why: "'무게를 재다'다." },
          { text: "widen", why: "'넓히다'라 뜻이 맞지 않는다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-consecutive",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-vocab-consecutive-1",
        prompt:
          "Sales have increased for six ------- quarters, the longest streak in company history.",
        skill: "vocab",
        band: 700,
        answer: 3,
        choices: [
          { text: "considerable", why: "'상당한'이라 연속을 뜻하지 않는다." },
          { text: "occasional", why: "'가끔의'라 streak(연속)과 어긋난다." },
          { text: "approximate", why: "'대략의'다." },
          {
            text: "consecutive",
            why: "정답. '연속된'. 뒤의 the longest streak 가 힌트다.",
          },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-in-advance",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5m-vocab-in-advance-1",
        prompt:
          "Groups of ten or more should reserve seats at least three days ------- .",
        skill: "vocab",
        band: 600,
        answer: 2,
        choices: [
          { text: "ahead of", why: "전치사구라 뒤에 명사가 필요하다." },
          { text: "beforehand of", why: "이런 형태는 쓰지 않는다." },
          {
            text: "in advance",
            why: "정답. '미리'. 기간 뒤에 붙여 'three days in advance' 로 통째로 나온다.",
          },
          { text: "in advanced", why: "advance 를 형용사로 바꾼 잘못된 형태다." },
        ],
      },
    ],
    links: ["v-schedule"],
  },
  {
    id: "r5m-vocab-comply-adhere",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5m-vocab-comply-adhere-1",
        prompt:
          "All contractors must ------- to the site's safety regulations at all times.",
        skill: "vocab",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "adhere",
            why: "정답. adhere to = '(규정을) 지키다'. 뒤의 to 가 결정적이다.",
          },
          { text: "comply", why: "뜻은 같지만 comply 는 with 와 짝이다. 뒤가 to 라 맞지 않는다." },
          { text: "observe", why: "뜻은 통하지만 타동사라 to 없이 목적어를 바로 받는다." },
          { text: "obey", why: "역시 타동사라 to 를 쓰지 않는다." },
        ],
      },
    ],
    links: ["v-comply"],
  },
  {
    id: "r5m-vocab-outstanding",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5m-vocab-outstanding-1",
        prompt:
          "Please settle any ------- balance before the end of the billing cycle.",
        skill: "vocab",
        band: 900,
        answer: 1,
        choices: [
          { text: "exceptional", why: "'뛰어난'이라 잔액을 꾸미지 못한다." },
          {
            text: "outstanding",
            why: "정답. outstanding 은 '뛰어난'과 '미납된' 두 뜻을 갖는다. balance·payment 옆에서는 늘 뒤쪽이다 — 900점대는 이 두 번째 뜻을 묻는다.",
          },
          { text: "prominent", why: "'저명한'이다." },
          { text: "abundant", why: "'풍부한'이다." },
        ],
      },
    ],
  },
  {
    id: "r5m-vocab-on-behalf-of",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5m-vocab-on-behalf-of-1",
        prompt:
          "------- the entire staff, I would like to thank Ms. Duarte for her twenty years of service.",
        skill: "vocab",
        band: 700,
        answer: 2,
        choices: [
          { text: "In charge of", why: "'~를 맡고 있는'이라 감사 인사의 주체를 밝히지 못한다." },
          { text: "In place of", why: "'~ 대신에'라 뜻이 어긋난다." },
          {
            text: "On behalf of",
            why: "정답. '~를 대표하여'. 인사말 첫머리에 그대로 나오는 표현이다.",
          },
          { text: "By means of", why: "'~를 통하여'라는 수단의 뜻이다." },
        ],
      },
    ],
  },
];
