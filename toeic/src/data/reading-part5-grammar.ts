import type { ReadingSet } from "@/lib/types";

/**
 * Part 5 · 문법 포인트마다 한 문항씩.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * ── 왜 따로 모았는가 ──────────────────────────────────────────
 * 문법 화면에서 설명을 읽고 나면 "알겠다"로 끝난다. 그런데 시험지에서
 * 그 문법을 알아보는 것은 다른 일이다. 그래서 문법 포인트 하나에
 * 문항 하나를 붙여, 설명 바로 밑에서 곧장 풀어 보게 한다.
 *
 * links 에 문법 id 를 적어 두면 문법 화면이 그것을 찾아 온다. 이 파일의
 * 문항은 모두 links 가 정확히 하나이고, 그 문법을 겨냥해 쓴 것이다.
 *
 * 선택지의 why 에는 답인 이유가 아니라 **그 자리에 왜 못 들어가는지**를
 * 적는다. 틀렸을 때 알고 싶은 것이 그것이기 때문이다.
 */
export const READING_PART5_GRAMMAR: ReadingSet[] = [
  /* ── 품사 자리 ── */
  {
    id: "r5g-verb-slot",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5g-verb-slot-1",
        prompt:
          "Employees ------- to the new building will receive parking passes next week.",
        skill: "grammar",
        band: 600,
        answer: 1,
        choices: [
          { text: "assign", why: "본동사 꼴이다. 뒤에 will receive 라는 본동사가 이미 있어 접속사 없이 동사가 둘일 수 없다." },
          {
            text: "assigned",
            why: "정답. 앞의 명사를 꾸미는 과거분사다. 본동사는 will receive 하나뿐이다.",
          },
          { text: "are assigned", why: "본동사다. 한 문장에 본동사가 둘이 된다." },
          { text: "will assign", why: "역시 본동사다. 접속사도 관계사도 없이 붙을 수 없다." },
        ],
      },
    ],
    links: ["g-pos-verb-slot"],
  },
  {
    id: "r5g-compound-noun",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-compound-noun-1",
        prompt:
          "All applicants must complete the ------- form before the interview begins.",
        skill: "grammar",
        band: 800,
        answer: 2,
        choices: [
          { text: "registered", why: "과거분사다. '등록된 서류'가 아니라 '등록 서류'다." },
          { text: "registering", why: "현재분사다. 서류가 등록하는 것이 아니다." },
          {
            text: "registration",
            why: "정답. registration form 은 명사+명사로 굳어진 짝이다. 명사 앞이라고 늘 형용사가 오는 것은 아니다.",
          },
          { text: "registrant", why: "'등록자'라는 사람 명사다. registrant form 은 말이 되지 않는다." },
        ],
      },
    ],
    links: ["g-pos-compound-noun"],
  },
  {
    id: "r5g-adv-position",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-adv-position-1",
        prompt:
          "The new safety procedures have ------- reduced the number of workplace accidents.",
        skill: "grammar",
        band: 700,
        answer: 3,
        choices: [
          { text: "significant", why: "형용사다. 조동사 have 와 과거분사 reduced 사이는 부사 자리다." },
          { text: "significance", why: "명사다. have 뒤에 명사가 오면 문장이 끊긴다." },
          { text: "signify", why: "동사다. have 뒤에는 과거분사가 와야 하고 그 자리는 reduced 가 차지했다." },
          {
            text: "significantly",
            why: "정답. have ___ p.p. 는 부사 자리다. 해석하지 않아도 자리로 정해진다.",
          },
        ],
      },
    ],
    links: ["g-pos-adv-position"],
  },
  {
    id: "r5g-quantifier",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-quantifier-1",
        prompt: "------- employee must submit a timesheet by Friday afternoon.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Each",
            why: "정답. 뒤에 단수 명사 employee 가 왔고 동사도 단수 must submit 이다. each 뒤는 언제나 단수다.",
          },
          { text: "All", why: "뒤에 복수나 불가산이 온다. all employees 라야 한다." },
          { text: "Many", why: "뒤에 복수가 온다. many employees 라야 한다." },
          { text: "Several", why: "역시 뒤에 복수가 온다." },
        ],
      },
    ],
    links: ["g-pos-quantifier"],
  },

  /* ── 동사 ── */
  {
    id: "r5g-modal-base",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5g-modal-base-1",
        prompt: "Applicants should ------- two references along with their materials.",
        skill: "grammar",
        band: 600,
        answer: 2,
        choices: [
          { text: "submits", why: "-s 가 붙은 꼴이다. 조동사 뒤에는 붙지 않는다." },
          { text: "submitted", why: "과거형이다. should 뒤에는 시제가 붙지 않는다." },
          {
            text: "submit",
            why: "정답. should·will·must·can 뒤는 언제나 동사원형이다. 주어가 무엇이든 바뀌지 않는다.",
          },
          { text: "submitting", why: "-ing 꼴이다. 조동사 뒤에 바로 올 수 없다." },
        ],
      },
    ],
    links: ["g-verb-modal"],
  },
  {
    id: "r5g-vi-vt",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-vi-vt-1",
        prompt:
          "Production costs have ------- sharply since the new tariffs took effect.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "raised", why: "raise 는 타동사다. 뒤에 올린 대상이 있어야 하는데 여기는 부사 sharply 뿐이다." },
          {
            text: "risen",
            why: "정답. rise 는 자동사라 목적어 없이 혼자 선다. 빈칸 뒤에 명사가 없다는 것이 단서다.",
          },
          { text: "raise", why: "원형이다. have 뒤에는 과거분사가 온다." },
          { text: "rising", why: "현재분사다. have 뒤에 바로 올 수 없다(have been rising 이라야 한다)." },
        ],
      },
    ],
    links: ["g-verb-vi-vt"],
  },
  {
    id: "r5g-perfect",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-perfect-1",
        prompt:
          "Ms. Okoye ------- the Lisbon office since the two divisions merged.",
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "manages", why: "현재형이다. since 는 '그때부터 지금까지'라 현재완료를 부른다." },
          {
            text: "has managed",
            why: "정답. since + 시작 시점이 보이면 현재완료다. 해석보다 since 를 먼저 찾는 편이 빠르다.",
          },
          { text: "had managed", why: "과거완료다. 기준이 되는 더 앞선 과거 시점이 문장에 없다." },
          { text: "will manage", why: "미래다. since 절이 이미 지나간 일을 가리킨다." },
        ],
      },
    ],
    links: ["g-verb-perfect"],
  },
  {
    id: "r5g-passive-obj",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5g-passive-obj-1",
        prompt: "All new hires ------- a security badge on their first day.",
        skill: "grammar",
        band: 900,
        answer: 0,
        choices: [
          {
            text: "are given",
            why: "정답. give 는 목적어를 둘 받는 동사라 수동이 되어도 뒤에 하나(a security badge)가 남는다. 뒤에 명사가 보인다고 능동을 고르면 걸린다.",
          },
          { text: "are giving", why: "신입이 배지를 주는 쪽이 되어 뜻이 뒤집힌다." },
          { text: "give", why: "역시 신입이 주는 쪽이 된다." },
          { text: "have given", why: "능동 완료다. 배지를 받는 쪽은 신입이다." },
        ],
      },
    ],
    links: ["g-verb-passive-obj"],
  },

  /* ── 접속사 ── */
  {
    id: "r5g-correlative",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-correlative-1",
        prompt:
          "The grant covers not only tuition ------- the cost of required textbooks.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "and also", why: "not only 의 짝이 아니다. 짝은 정해져 있다." },
          { text: "or else", why: "either 와 어울리는 말도 아니고 not only 의 짝도 아니다." },
          {
            text: "but also",
            why: "정답. not only A but also B 는 통째로 외워 두는 짝이다. 앞에 not only 가 보이면 뒤는 정해진다.",
          },
          { text: "as well", why: "as well as 라면 모를까, as well 만으로는 짝이 되지 않는다." },
        ],
      },
    ],
    links: ["g-conj-correlative"],
  },
  {
    id: "r5g-conj-meaning",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-conj-meaning-1",
        prompt:
          "------- the shipment left the warehouse on schedule, it arrived two days late.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Although",
            why: "정답. 앞뒤가 뒤집힌다 — 제때 떠났는데 늦게 닿았다. 자리가 아니라 뜻으로 가르는 문제다.",
          },
          { text: "Because", why: "이유를 대는 말이다. 제때 떠난 것이 늦은 이유가 될 수 없다." },
          { text: "So that", why: "목적을 말하는 말이다. 앞뒤가 목적 관계가 아니다." },
          { text: "As soon as", why: "시간을 잇는 말이다. 넣으면 '떠나자마자 늦게 닿았다'가 된다." },
        ],
      },
    ],
    links: ["g-conj-meaning"],
  },
  {
    id: "r5g-noun-clause",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-noun-clause-1",
        prompt: "The manager confirmed ------- the shipment had cleared customs.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "what", why: "뒤 문장에 주어(the shipment)도 목적어도 다 있다. what 은 빠진 자리를 메우는 말이다." },
          {
            text: "that",
            why: "정답. 뒤 절이 완전하면 that 이다. 해석하지 말고 뒤 절에서 빠진 자리가 있는지만 보면 된다.",
          },
          { text: "which", why: "앞에 꾸밀 명사가 없다. confirmed 의 목적어 자리다." },
          { text: "whose", why: "뒤에 명사가 바로 와야 하는 소유격이다. the shipment 앞에 관사가 있다." },
        ],
      },
    ],
    links: ["g-conj-noun-clause"],
  },

  /* ── 관계사 ── */
  {
    id: "r5g-relative-whose",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-relative-whose-1",
        prompt:
          "We are looking for a supplier ------- delivery times are consistently under a week.",
        skill: "grammar",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "whose",
            why: "정답. ___ + 관사 없는 명사(delivery times) + 동사 꼴이면 소유격 관계사다.",
          },
          { text: "which", why: "뒤에 동사가 바로 와야 한다. 여기는 명사가 먼저 온다." },
          { text: "who", why: "역시 뒤에 동사가 와야 하고, 선행사도 사람이 아니다." },
          { text: "that", why: "뒤에 동사나 완전하지 않은 절이 와야 한다. 명사를 바로 받지 못한다." },
        ],
      },
    ],
    links: ["g-relative-whose"],
  },
  {
    id: "r5g-relative-adverb",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-relative-adverb-1",
        prompt:
          "The conference room ------- the interviews are held has been repainted.",
        skill: "grammar",
        band: 800,
        answer: 2,
        choices: [
          { text: "which", why: "뒤 절에 빠진 자리가 있어야 쓸 수 있다. the interviews are held 는 완전하다." },
          { text: "that", why: "같은 이유로 안 된다. 뒤 절에 빈자리가 없다." },
          {
            text: "where",
            why: "정답. 선행사가 장소이고 뒤 절이 완전하면 관계부사다. '빠진 자리가 있는가'가 갈림길이다.",
          },
          { text: "what", why: "앞에 선행사를 두지 않는 말이다. the conference room 이 이미 있다." },
        ],
      },
    ],
    links: ["g-relative-adverb"],
  },
  {
    id: "r5g-relative-prep",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5g-relative-prep-1",
        prompt:
          "The consultant with ------- we signed the agreement will visit the site next week.",
        skill: "grammar",
        band: 900,
        answer: 1,
        choices: [
          { text: "who", why: "전치사 바로 뒤에는 주격 who 가 오지 못한다." },
          {
            text: "whom",
            why: "정답. 전치사 뒤에는 목적격만 온다. 선행사가 사람이므로 whom 이다.",
          },
          { text: "that", why: "전치사 바로 뒤에 that 은 절대 오지 못한다. 이 한 줄만 알아도 두 개가 지워진다." },
          { text: "which", why: "목적격이긴 하지만 사람을 받지 못한다." },
        ],
      },
    ],
    links: ["g-relative-prep"],
  },

  /* ── to부정사·분사 ── */
  {
    id: "r5g-toinf-purpose",
    part: 5,
    band: 600,
    questions: [
      {
        id: "q-r5g-toinf-purpose-1",
        prompt: "------- reduce printing costs, the office switched to digital invoices.",
        skill: "grammar",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "To",
            why: "정답. '~하기 위해'는 to + 동사원형이다. 문장 맨 앞이 비고 뒤에 원형이 오면 거의 이 자리다.",
          },
          { text: "For", why: "전치사라 뒤에 명사가 와야 한다. reduce 는 동사다." },
          { text: "So", why: "so that 이라면 뒤에 절이 와야 한다. 여기는 동사원형뿐이다." },
          { text: "Because", why: "접속사라 뒤에 주어와 동사가 갖춰진 절이 와야 한다." },
        ],
      },
    ],
    links: ["g-toinf-purpose"],
  },
  {
    id: "r5g-toinf-adj",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-toinf-adj-1",
        prompt:
          "The department is willing ------- additional shifts during the holiday season.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "cover", why: "원형만으로는 형용사 뒤에 붙지 못한다." },
          {
            text: "to cover",
            why: "정답. be willing to 는 형용사와 to부정사가 붙어 다니는 짝이다. able·eager·ready 도 마찬가지다.",
          },
          { text: "covering", why: "willing 은 -ing 를 받지 않는다. 짝이 정해져 있다." },
          { text: "covered", why: "과거분사다. 부서가 덮이는 쪽이 되어 뜻도 어긋난다." },
        ],
      },
    ],
    links: ["g-toinf-adj"],
  },
  {
    id: "r5g-participle-clause",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5g-participle-clause-1",
        prompt:
          "------- the quarterly report, the analyst noticed a discrepancy in the totals.",
        skill: "grammar",
        band: 900,
        answer: 0,
        choices: [
          {
            text: "Reviewing",
            why: "정답. 쉼표 앞이 통째로 비어 있고 뒤에 완전한 문장이 온다 — 분사구문 자리다. 보고서를 검토한 쪽은 분석가이므로 현재분사다.",
          },
          { text: "Reviewed", why: "과거분사다. 검토당한 쪽이 분석가가 되어 뜻이 뒤집힌다." },
          { text: "Review", why: "동사원형이다. 명령문이 되어 뒤 문장과 이어지지 않는다." },
          { text: "To review", why: "'검토하기 위해 발견했다'가 되어 앞뒤가 어긋난다." },
        ],
      },
    ],
    links: ["g-participle-clause"],
  },

  /* ── 대명사 ── */
  {
    id: "r5g-reflexive",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-reflexive-1",
        prompt:
          "The technicians installed the equipment ------- to keep labor costs down.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "them", why: "목적어 자리는 the equipment 가 이미 채웠다. 목적어가 둘일 수 없다." },
          { text: "their", why: "소유격이라 뒤에 명사가 와야 한다." },
          {
            text: "themselves",
            why: "정답. 빼도 문장이 완전한 자리다. 그런 자리에 들어가 '직접'을 더하는 것이 재귀대명사다.",
          },
          { text: "theirs", why: "소유대명사다. 명사 자리인데 이 문장에는 그 자리가 없다." },
        ],
      },
    ],
    links: ["g-pronoun-reflexive"],
  },
  {
    id: "r5g-indefinite",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-indefinite-1",
        prompt:
          "One of the two elevators is under repair; ------- is operating normally.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "another", why: "'또 하나'다. 셋 이상 남아 있을 때 쓴다. 여기는 둘 중 하나가 남았다." },
          {
            text: "the other",
            why: "정답. 둘 중 하나를 말하고 남은 하나를 가리키므로 the other 다. 앞 문장의 수가 단서다.",
          },
          { text: "other", why: "홀로 서지 못한다. 뒤에 명사가 붙어야 한다." },
          { text: "others", why: "복수라 뒤 동사가 are 여야 한다. 남은 것은 하나뿐이다." },
        ],
      },
    ],
    links: ["g-pronoun-indefinite"],
  },

  /* ── 비교 ── */
  {
    id: "r5g-comparison-as",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-comparison-as-1",
        prompt: "The new printer is nearly as ------- as the model it replaced.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "fast",
            why: "정답. as 와 as 사이는 원급 자리다. 비교급을 넣고 싶어지는 자리라 시험이 즐겨 낸다.",
          },
          { text: "faster", why: "비교급이다. 비교급은 than 과 짝을 이룬다." },
          { text: "fastest", why: "최상급이다. the 와 함께 쓰고 as ~ as 사이에는 오지 못한다." },
          { text: "more fast", why: "fast 는 more 를 붙이지 않는다. 그리고 as 사이에는 비교급 자체가 오지 못한다." },
        ],
      },
    ],
    links: ["g-comparison-as"],
  },
  {
    id: "r5g-comparison-idiom",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5g-comparison-idiom-1",
        prompt: "The sooner the parts arrive, ------- the assembly line can restart.",
        skill: "grammar",
        band: 900,
        answer: 3,
        choices: [
          { text: "sooner", why: "the 가 빠졌다. 이 표현은 the 를 앞뒤로 둘 다 붙인다." },
          { text: "soonest", why: "최상급은 이 짝에 들어가지 않는다." },
          { text: "as soon", why: "as ~ as 의 조각이다. 앞이 The sooner 로 시작한 문장에는 붙지 않는다." },
          {
            text: "the sooner",
            why: "정답. the 비교급 ~, the 비교급 … 은 통째로 굳은 표현이다. 앞이 The sooner 면 뒤도 the + 비교급이다.",
          },
        ],
      },
    ],
    links: ["g-comparison-idiom"],
  },

  /* ── 전치사 ── */
  {
    id: "r5g-prep-duration",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-prep-duration-1",
        prompt:
          "The lobby will be closed ------- the renovation, which is expected to last three weeks.",
        skill: "grammar",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "during",
            why: "정답. 뒤에 사건 이름(the renovation)이 왔다. during 뒤에는 사건이, for 뒤에는 숫자 기간이 온다.",
          },
          { text: "for", why: "뒤에 three weeks 같은 숫자 기간이 와야 한다." },
          { text: "while", why: "접속사다. 뒤에 주어와 동사가 갖춰진 절이 와야 한다." },
          { text: "since", why: "'그때부터'라 현재완료와 어울린다. 여기 본동사는 will be closed 다." },
        ],
      },
    ],
    links: ["g-prep-duration"],
  },
  {
    id: "r5g-prep-phrase",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-prep-phrase-1",
        prompt: "The outdoor ceremony was moved indoors ------- the heavy rain.",
        skill: "grammar",
        band: 800,
        answer: 1,
        choices: [
          { text: "because", why: "접속사다. 뒤에 주어와 동사가 와야 하는데 여기는 명사구뿐이다." },
          {
            text: "because of",
            why: "정답. 뒤가 명사구면 두 단어 이상인 전치사다. 뒤가 절인지 명사인지만 보면 갈린다.",
          },
          { text: "although", why: "접속사이기도 하고, 뜻도 뒤집는 말이라 맞지 않는다." },
          { text: "even though", why: "역시 접속사이고 뜻도 어긋난다." },
        ],
      },
    ],
    links: ["g-prep-phrase"],
  },
  {
    id: "r5g-prep-etc",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-prep-etc-1",
        prompt:
          "The exhibit remains open ------- the summer, including all public holidays.",
        skill: "grammar",
        band: 700,
        answer: 2,
        choices: [
          { text: "within", why: "'~이내'다. 기한을 말할 때 쓰고, 여름 내내 연다는 뜻이 되지 않는다." },
          { text: "regarding", why: "'~에 관해'다. 문을 여는 기간과는 상관이 없다." },
          {
            text: "throughout",
            why: "정답. '~내내'다. 뒤에 기간을 두고 그 기간을 끝까지 채운다는 뜻이다.",
          },
          { text: "aside from", why: "'~외에'다. 넣으면 여름만 빼고 연다는 뜻이 되어 뒷말과 어긋난다." },
        ],
      },
    ],
    links: ["g-prep-etc"],
  },

  /* ── 문장 구조 ── */
  {
    id: "r5g-parallel",
    part: 5,
    band: 700,
    questions: [
      {
        id: "q-r5g-parallel-1",
        prompt:
          "The workshop covers drafting contracts, reviewing invoices, and ------- vendor disputes.",
        skill: "grammar",
        band: 700,
        answer: 1,
        choices: [
          { text: "resolve", why: "원형이다. 앞의 둘이 -ing 인데 혼자 꼴이 다르다." },
          {
            text: "resolving",
            why: "정답. and 앞이 drafting·reviewing 이므로 뒤도 -ing 여야 한다. 뜻을 따지기 전에 꼴부터 맞춘다.",
          },
          { text: "to resolve", why: "to부정사다. 앞의 둘과 꼴이 어긋난다." },
          { text: "resolved", why: "과거분사다. 역시 앞의 둘과 짝이 맞지 않는다." },
        ],
      },
    ],
    links: ["g-structure-parallel"],
  },
  {
    id: "r5g-structure-it",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-structure-it-1",
        prompt: "------- is essential that all forms be signed before submission.",
        skill: "grammar",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "It",
            why: "정답. 진짜 주어는 that 절이고 앞자리는 가주어 it 이 채운다. It is + 형용사 + that 은 통째로 알아 두는 꼴이다.",
          },
          { text: "That", why: "That 이 주어가 되려면 뒤에 절이 붙어야 하는데 바로 is 가 온다." },
          { text: "There", why: "There is 뒤에는 명사가 온다. 여기는 형용사 essential 이 온다." },
          { text: "What", why: "뒤 절에 빠진 자리가 있어야 쓴다. that 절은 완전하다." },
        ],
      },
    ],
    links: ["g-structure-it"],
  },
  {
    id: "r5g-structure-there",
    part: 5,
    band: 800,
    questions: [
      {
        id: "q-r5g-structure-there-1",
        prompt:
          "------- several reasons for the delay, most of them related to customs clearance.",
        skill: "grammar",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "There are",
            why: "정답. There 뒤 동사는 그 뒤에 오는 진짜 주어에 맞춘다. reasons 가 복수이므로 are 다.",
          },
          { text: "There is", why: "뒤의 진짜 주어가 복수 reasons 다. is 로 받을 수 없다." },
          { text: "It is", why: "It 은 뒤에 형용사나 that 절을 받는다. 명사구를 바로 받지 못한다." },
          { text: "They are", why: "They 가 가리킬 말이 앞에 없다. 문장 첫머리다." },
        ],
      },
    ],
    links: ["g-structure-there"],
  },
  {
    id: "r5g-inversion",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5g-inversion-1",
        prompt:
          "Not only ------- the deadline, but the team also came in under budget.",
        skill: "grammar",
        band: 900,
        answer: 1,
        choices: [
          { text: "they met", why: "부정어가 앞으로 나갔는데 어순이 그대로다." },
          {
            text: "did they meet",
            why: "정답. Not only 가 문장 앞에 오면 뒤는 의문문 어순이 된다 — 조동사 + 주어 + 동사원형.",
          },
          { text: "they did meet", why: "강조의 did 를 넣었을 뿐 어순은 뒤집히지 않았다." },
          { text: "met they", why: "본동사와 주어를 그냥 맞바꾼 꼴이다. 영어는 조동사를 앞세운다." },
        ],
      },
    ],
    links: ["g-structure-inversion"],
  },
  {
    id: "r5g-subjunctive-if",
    part: 5,
    band: 900,
    questions: [
      {
        id: "q-r5g-subjunctive-if-1",
        prompt:
          "If the supplier ------- the deadline last quarter, we would not have switched vendors.",
        skill: "grammar",
        band: 900,
        answer: 2,
        choices: [
          { text: "met", why: "과거형이다. 주절이 would have p.p. 이므로 한 칸 더 뒤로 가야 한다." },
          { text: "has met", why: "현재완료다. 가정법에는 쓰지 않는다." },
          {
            text: "had met",
            why: "정답. 주절이 would not have switched 이므로 if절은 과거완료다. 두 시제는 늘 한 칸씩 어긋난다.",
          },
          { text: "would meet", why: "would 는 주절 쪽 말이다. if절에는 넣지 않는다." },
        ],
      },
    ],
    links: ["g-subjunctive-if"],
  },
];
