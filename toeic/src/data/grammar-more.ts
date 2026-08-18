import type { GrammarPoint } from "@/lib/types";

/**
 * Part 5·6 문법 — 이어지는 항목들.
 *
 * 처음 열아홉 개로는 며칠이면 동난다. 특히 600점을 목표로 하는 사람에게
 * 보이는 것이 아홉 개뿐이었는데, Part 5·6 은 읽기 100문항 중 46문항이고
 * 그 절반 이상이 자리로 푸는 문제다. 가장 많이 나오는 자리를 가장 적게
 * 가르치고 있었던 셈이다.
 *
 * 여기서도 기준은 하나다 — **해석하지 않고 푸는 길이 있는가.**
 * 자리 문제를 자리로 풀면 한 문항에 오 초, 해석하려 들면 삼십 초다.
 * 그 차이가 Part 7 을 끝까지 풀 시간을 만든다.
 */
export const GRAMMAR_MORE: GrammarPoint[] = [
  /* ─────────────── 품사 자리 ─────────────── */
  {
    id: "g-pos-verb-slot",
    title: "동사 자리 — 한 문장에 본동사는 하나",
    band: 600,
    category: "pos",
    summary:
      "접속사 없이 동사가 둘일 수 없다. 이미 본동사가 있으면 빈칸은 동사가 아니다.",
    detail:
      "문장 하나에는 주어와 본동사가 하나씩이다. 둘을 더 넣으려면 접속사나 관계사가 있어야 한다. 그래서 빈칸 문제를 만나면 먼저 '이 문장에 본동사가 이미 있는가'를 본다. 있으면 빈칸에는 동사가 못 들어가고, to부정사·분사·동명사 중 하나가 온다. 없으면 빈칸이 본동사 자리다.",
    examShape:
      "선택지가 review / reviews / reviewing / to review 처럼 한 동사의 네 가지 꼴로 나온다.",
    shortcut:
      "문장에서 마침표까지 훑어 동사를 센다. 이미 하나 있으면 -ing / to부정사 / p.p. 중에서 고른다.",
    trap: {
      wrong: "접속사가 없는데 동사를 두 번 넣는 것",
      why: "The report submitted yesterday was accepted. 에서 submitted 는 본동사가 아니라 report 를 꾸미는 분사다. 본동사는 was 하나뿐이다.",
    },
    examples: [
      {
        correct: "The proposal submitted last week has been approved.",
        incorrect: "The proposal submits last week has been approved.",
        ko: "본동사는 has been approved 다. 앞의 submitted 는 proposal 을 꾸미는 분사다.",
      },
      {
        correct: "Employees who attend the session will receive a certificate.",
        ko: "who 라는 관계사가 있어 동사가 둘(attend, will receive)이어도 된다.",
      },
    ],
  },
  {
    id: "g-pos-compound-noun",
    title: "복합명사 — 명사 뒤에 명사가 또 온다",
    band: 800,
    category: "pos",
    summary:
      "명사 자리라고 늘 형용사가 앞에 오는 것은 아니다. 굳어진 짝은 명사+명사로 붙는다.",
    detail:
      "application form, safety regulations, customer satisfaction 처럼 명사 둘이 붙어 한 덩어리를 이루는 말이 있다. 이때 앞자리에 형용사를 넣으면 틀린다. 시험은 바로 이것을 노린다 — 빈칸 뒤에 명사가 있으니 형용사를 고르게 만들어 놓고, 정답은 명사인 문제를 낸다.",
    examShape:
      "빈칸 뒤에 명사가 있는데 선택지에 형용사와 명사가 함께 있다.",
    shortcut:
      "형용사를 넣어 뜻이 어색하면 복합명사를 의심한다. 자주 나오는 짝은 통째로 외운다 — application form, expiration date, safety precautions, customer service, sales representative.",
    trap: {
      wrong: "형용사를 넣는 것 (safe regulations)",
      why: "'안전한 규정'이 아니라 '안전 규정'이다. safety regulations 로 굳어져 있다.",
    },
    examples: [
      {
        correct: "Please complete the application form before the interview.",
        incorrect: "Please complete the applicable form before the interview.",
        ko: "application form 은 한 덩어리다. '적용 가능한 양식'이 아니다.",
      },
      {
        correct: "Customer satisfaction has risen for three quarters.",
        ko: "satisfied customers 가 아니라 customer satisfaction 이다.",
      },
    ],
  },
  {
    id: "g-pos-adv-position",
    title: "부사가 서는 세 자리",
    band: 700,
    category: "pos",
    summary:
      "be동사와 p.p. 사이, 조동사와 동사 사이, 그리고 문장 맨 앞이나 맨 뒤다.",
    detail:
      "부사 자리 문제는 '빼도 문장이 성립하는 곳'이라는 원칙 하나로 대부분 풀린다. 다만 시험에 자주 나오는 구체적인 자리가 셋 있다. ① be + ___ + p.p. ② 조동사 + ___ + 동사원형 ③ 완료형 have + ___ + p.p. 이 셋은 보이는 즉시 부사다.",
    examShape:
      "were ___ distributed / will ___ review / has ___ improved 꼴로 나온다.",
    shortcut:
      "빈칸을 손으로 가려 본다. 가려도 문장이 완전하면 부사다.",
    trap: {
      wrong: "be동사 뒤라고 형용사를 넣는 것",
      why: "be + 형용사는 맞지만, 뒤에 p.p. 가 이어지면 그것이 진짜 보어다. 빈칸은 그 사이를 메우는 부사 자리다.",
    },
    examples: [
      {
        correct: "The guidelines were promptly distributed to every branch.",
        incorrect: "The guidelines were prompt distributed to every branch.",
        ko: "were 와 distributed 사이는 부사 자리다.",
      },
      {
        correct: "Sales have steadily increased since the launch.",
        ko: "have 와 increased 사이도 같은 자리다.",
      },
    ],
  },
  {
    id: "g-pos-quantifier",
    title: "수량 형용사 — 뒤에 오는 명사가 정한다",
    band: 700,
    category: "pos",
    summary:
      "each·every 뒤는 단수, all·most 뒤는 복수나 불가산, every 뒤에 숫자가 오면 복수다.",
    detail:
      "수량을 나타내는 말은 뒤에 어떤 명사가 오느냐로 갈린다. each / every / another 뒤에는 단수 명사, both / several / few / many 뒤에는 복수 명사, much / little 뒤에는 불가산 명사가 온다. all / most / some 은 복수와 불가산 둘 다 받는다. 예외처럼 보이는 every three days(사흘마다)는 '주기'를 말하는 굳은 꼴이다.",
    examShape: "___ employee / ___ employees / ___ information 꼴로 갈라 낸다.",
    shortcut:
      "빈칸 뒤 명사에 -s 가 붙었는지, 셀 수 있는지부터 본다. 그것만으로 선택지 절반이 지워진다.",
    trap: {
      wrong: "each 뒤에 복수 명사를 두는 것",
      why: "each of the employees 는 되지만 each employees 는 안 된다. of 가 있으면 복수, 없으면 단수다.",
    },
    examples: [
      {
        correct: "Each participant receives a name badge.",
        incorrect: "Each participants receive a name badge.",
        ko: "each 뒤는 단수 명사이고 동사도 단수다.",
      },
      {
        correct: "The shuttle departs every twenty minutes.",
        ko: "every + 숫자 + 복수 명사는 '~마다'라는 주기다.",
      },
    ],
  },

  /* ─────────────── 동사 ─────────────── */
  {
    id: "g-verb-modal",
    title: "조동사 뒤에는 언제나 동사원형",
    band: 600,
    category: "verb",
    summary:
      "will / can / must / should 뒤에는 -s 도 -ed 도 붙지 않은 원형이 온다.",
    detail:
      "조동사는 뒤에 오는 동사의 꼴을 고정한다. 주어가 삼인칭 단수여도 -s 를 붙이지 않고, 과거를 말하고 싶어도 -ed 를 붙이지 않는다. 과거는 'must have p.p.' 처럼 완료형으로 나타낸다. 수동이면 'be p.p.' 를 통째로 뒤에 붙여 will be reviewed 가 된다.",
    examShape: "will ___ / should ___ / must ___ 뒤에 무엇이 오는지 묻는다.",
    shortcut: "빈칸 앞이 조동사면 고민하지 말고 원형이다.",
    trap: {
      wrong: "주어에 맞춰 -s 를 붙이는 것 (He will attends)",
      why: "수 일치는 본동사가 하는 일이다. 조동사가 앞에 서면 본동사는 원형으로 고정된다.",
    },
    examples: [
      {
        correct: "The committee will review the proposal on Monday.",
        incorrect: "The committee will reviews the proposal on Monday.",
        ko: "will 뒤는 원형 review 다.",
      },
      {
        correct: "All requests must be submitted in writing.",
        ko: "수동이면 be + p.p. 를 통째로 붙인다.",
      },
    ],
  },
  {
    id: "g-verb-vi-vt",
    title: "자동사와 타동사 — 목적어를 바로 받는가",
    band: 800,
    category: "verb",
    summary:
      "rise·arrive·remain 은 목적어를 못 받고, raise·reach·discuss 는 전치사 없이 바로 받는다.",
    detail:
      "뜻이 비슷한데 하나는 전치사를 데리고 다니고 하나는 아닌 짝들이 있다. 시험은 그 둘을 나란히 놓는다. 자동사는 목적어를 받으려면 전치사가 필요하고(arrive at the airport), 타동사는 전치사를 붙이면 틀린다(discuss about → discuss). 수동태가 되는지도 여기서 갈린다 — 자동사는 수동태로 쓸 수 없다.",
    examShape:
      "빈칸 뒤에 전치사가 있는지 없는지로 갈리게 만든다.",
    shortcut:
      "빈칸 바로 뒤를 본다. 명사가 바로 오면 타동사, 전치사가 오면 자동사다.",
    trap: {
      wrong: "discuss about, mention about, attend to a meeting",
      why: "discuss·mention·attend(참석하다) 는 타동사라 전치사를 붙이지 않는다. 반대로 arrive·respond·object 는 전치사가 필요하다.",
    },
    examples: [
      {
        correct: "We will discuss the budget at tomorrow's meeting.",
        incorrect: "We will discuss about the budget tomorrow.",
        ko: "discuss 는 타동사라 about 을 붙이지 않는다.",
      },
      {
        correct: "Costs rose sharply, so we raised our prices.",
        ko: "rise 는 스스로 오르는 것(자동사), raise 는 무엇을 올리는 것(타동사)이다.",
      },
    ],
  },
  {
    id: "g-verb-perfect",
    title: "완료 시제 — 함께 나오는 말이 정해져 있다",
    band: 700,
    category: "verb",
    summary:
      "for·since·over the past 는 현재완료를, by the time 은 완료를 부른다.",
    detail:
      "완료 시제는 '언제부터 지금까지'를 말한다. 그래서 기간을 나타내는 말과 짝을 이룬다. for + 기간, since + 시점, over/in the past + 기간, so far, recently 가 보이면 현재완료다. 반대로 yesterday·last week·in 2019 처럼 끝난 시점이 있으면 단순 과거를 쓴다. 미래완료(will have p.p.)는 'By the time + 현재시제' 와 짝이다.",
    examShape: "문장 안의 시간 표시를 찾아 시제를 고르게 한다.",
    shortcut:
      "시간 표시부터 찾는다. since·for → 현재완료 / yesterday·ago → 과거 / by the time ~ → 미래완료.",
    trap: {
      wrong: "since 가 있는데 과거를 쓰는 것",
      why: "since 는 그 시점부터 지금까지 이어진다는 뜻이라 현재완료를 부른다. 단, since 가 '~때문에' 라는 접속사로 쓰이면 이 규칙은 해당 없다.",
    },
    examples: [
      {
        correct: "Delmar has supplied fabric to retailers for twenty years.",
        incorrect: "Delmar supplied fabric to retailers for twenty years.",
        ko: "for + 기간은 지금까지 이어진다는 뜻이라 현재완료다.",
      },
      {
        correct: "By the time the auditors arrive, we will have compiled the files.",
        ko: "By the time + 현재시제(미래 의미) → 주절은 미래완료.",
      },
    ],
  },
  {
    id: "g-verb-passive-obj",
    title: "수동태인데 뒤에 명사가 남아 있는 경우",
    band: 900,
    category: "verb",
    summary:
      "목적어를 둘 받는 동사는 수동이 되어도 뒤에 하나가 남는다.",
    detail:
      "'목적어가 없으면 수동'이라는 요령은 대개 통하지만 예외가 있다. give·send·offer·award 처럼 목적어를 둘 받는 동사는 하나를 주어로 올려도 나머지 하나가 뒤에 남는다. Employees were given a bonus. 에서 a bonus 가 그것이다. 또 consider·call·make 처럼 목적격 보어를 받는 동사도 수동 뒤에 형용사나 명사가 남는다.",
    examShape:
      "수동태 뒤에 명사가 보여서 능동을 고르게 만든다.",
    shortcut:
      "남은 명사가 '주어가 한 일의 대상'인지 본다. 주어가 그것을 받은 쪽이면 수동이 맞다.",
    trap: {
      wrong: "뒤에 명사가 있으니 능동이라고 판단하는 것",
      why: "were given a bonus 는 '보너스를 받았다'이지 '보너스를 주었다'가 아니다. 주어가 받는 쪽이면 수동이다.",
    },
    examples: [
      {
        correct: "All full-time employees were given an extra day of leave.",
        ko: "give 는 목적어를 둘 받으므로 수동 뒤에 an extra day 가 남는다.",
      },
      {
        correct: "The proposal was considered feasible by the board.",
        ko: "consider + 목적어 + 보어 구조라 수동 뒤에 형용사가 남는다.",
      },
    ],
  },

  /* ─────────────── 접속사·접속부사 ─────────────── */
  {
    id: "g-conj-correlative",
    title: "짝을 이루는 접속사 — 한쪽이 보이면 나머지가 정해진다",
    band: 700,
    category: "conj",
    summary:
      "both A and B / either A or B / neither A nor B / not only A but also B.",
    detail:
      "상관접속사는 짝이 고정돼 있다. both 가 보이면 뒤는 and, either 면 or, neither 면 nor, not only 면 but (also) 다. 시험은 앞쪽을 보여 주고 뒤쪽을 묻거나, 그 반대로 낸다. 해석이 필요 없는 문제다. 수 일치도 함께 나오는데, either/neither A or/nor B 는 **B 에 맞추고**, both A and B 는 언제나 복수다.",
    examShape: "문장 앞부분에 both·either·neither·not only 가 보인다.",
    shortcut:
      "짝만 외워 두면 오 초다. both–and / either–or / neither–nor / not only–but also.",
    trap: {
      wrong: "both A or B, either A nor B 처럼 짝을 어긋내는 것",
      why: "짝은 바뀌지 않는다. 또 both 뒤에는 nor 가 절대 오지 않는다.",
    },
    examples: [
      {
        correct: "The workshop is open to both employees and contractors.",
        incorrect: "The workshop is open to both employees or contractors.",
        ko: "both 의 짝은 and 뿐이다.",
      },
      {
        correct: "Neither the manager nor the assistants were informed.",
        ko: "neither A nor B 의 동사는 가까운 B(assistants)에 맞춘다.",
      },
    ],
  },
  {
    id: "g-conj-meaning",
    title: "뜻으로 고르는 접속사 — 앞뒤가 뒤집히는가",
    band: 700,
    category: "conj",
    summary:
      "although·while 은 뒤집고, because·since 는 이유를 대고, so that 은 목적을 말한다.",
    detail:
      "자리 문제가 아니라 뜻 문제인 접속사도 있다. 앞뒤 문장이 어떤 사이인지만 보면 된다. ① 뒤집힘 — although, though, even though, while, whereas ② 이유 — because, since, as ③ 조건 — if, unless, provided that, as long as ④ 목적 — so that, in order that ⑤ 시간 — when, while, before, after, until, once.",
    examShape:
      "빈칸 뒤에 절이 오고, 선택지가 모두 접속사다. 이때는 자리가 아니라 뜻으로 가른다.",
    shortcut:
      "앞뒤를 한 줄로 요약해 본다. '좋다 + 나쁘다' 면 양보, '나쁘다 → 그래서' 면 이유다.",
    trap: {
      wrong: "although 와 despite 를 바꿔 쓰는 것",
      why: "뜻은 같지만 although 뒤에는 절, despite 뒤에는 명사가 온다. 뒤에 무엇이 오는지부터 본다.",
    },
    examples: [
      {
        correct: "Although the room was small, everyone fit comfortably.",
        ko: "작다(나쁨) + 다 들어갔다(좋음) — 앞뒤가 뒤집히므로 양보다.",
      },
      {
        correct: "We ordered extra chairs so that no one would stand.",
        ko: "so that 은 목적을 이끈다.",
      },
    ],
  },
  {
    id: "g-conj-noun-clause",
    title: "that 과 what — 뒤 문장이 완전한가",
    band: 800,
    category: "conj",
    summary:
      "뒤가 완전하면 that, 주어나 목적어가 빠져 있으면 what 이다.",
    detail:
      "명사절을 이끄는 that 과 what 은 뒤 문장의 모양으로 갈린다. that 은 접속사라 자기 자리를 차지하지 않으므로 뒤 문장이 완전해야 하고, what 은 관계대명사라 그 자리가 비어 있어야 한다. whether/if 는 '~인지 아닌지'라는 뜻을 더하며 뒤가 완전하다.",
    examShape: "빈칸 뒤 절에서 주어나 목적어가 비어 있는지 보게 만든다.",
    shortcut:
      "빈칸 뒤를 읽고 주어·목적어가 다 있으면 that, 하나 비면 what.",
    trap: {
      wrong: "뜻만 보고 what 을 고르는 것",
      why: "'무엇' 이라는 뜻이 없어도 자리가 비면 what 이다. 반대로 뜻이 통해도 뒤가 완전하면 that 이다.",
    },
    examples: [
      {
        correct: "The report shows that sales increased last quarter.",
        ko: "sales increased 로 완전하므로 that.",
      },
      {
        correct: "What the client requested was not in the contract.",
        ko: "requested 의 목적어가 비어 있으므로 what.",
      },
    ],
  },

  /* ─────────────── 관계사 ─────────────── */
  {
    id: "g-relative-whose",
    title: "소유격 관계사 whose — 뒤에 명사가 바로 온다",
    band: 800,
    category: "relative",
    summary: "___ + 명사 + 동사 꼴이면 whose 다.",
    detail:
      "관계대명사는 뒤에 빠진 성분으로 고른다. 주어가 비면 who/which, 목적어가 비면 whom/which, 그리고 뒤에 명사가 멀쩡히 붙어 있으면 소유격 whose 다. 'Applicants whose credentials have been verified' 에서 credentials 는 빠진 것이 아니라 지원자의 것이므로 소유격이다.",
    examShape: "빈칸 뒤에 관사 없는 명사가 바로 오고 그 뒤에 동사가 있다.",
    shortcut: "빈칸 뒤가 '명사 + 동사' 면 whose. 이 한 줄로 끝난다.",
    trap: {
      wrong: "사람이니까 who 를 고르는 것",
      why: "선행사가 사람이어도 뒤에 명사가 붙어 있으면 소유격이다. who 뒤에는 동사가 바로 와야 한다.",
    },
    examples: [
      {
        correct: "Applicants whose credentials have been verified may skip the test.",
        incorrect: "Applicants who credentials have been verified may skip the test.",
        ko: "credentials 라는 명사가 뒤에 있으므로 소유격 whose 다.",
      },
      {
        correct: "We selected a vendor whose delivery times were shortest.",
        ko: "사람이 아니어도 소유격은 whose 를 쓴다.",
      },
    ],
  },
  {
    id: "g-relative-adverb",
    title: "관계부사 — 뒤 문장이 완전하면 where·when·why",
    band: 800,
    category: "relative",
    summary:
      "선행사가 장소·시간·이유이고 뒤 문장이 완전하면 관계대명사가 아니라 관계부사다.",
    detail:
      "관계대명사 뒤에는 반드시 빠진 자리가 있다. 그런데 뒤 문장이 완전한데도 관계사가 필요할 때가 있다 — 그것이 관계부사다. 장소면 where, 시간이면 when, 이유면 why, 방법이면 how(선행사 the way 와 함께 쓰지 않는다). 관계부사는 '전치사 + which' 로 바꿔 쓸 수 있다.",
    examShape:
      "선행사가 the office / the day / the reason 인데 뒤 문장이 멀쩡하다.",
    shortcut:
      "뒤 문장에서 빠진 성분을 찾는다. 하나도 없으면 관계대명사가 아니다.",
    trap: {
      wrong: "장소가 선행사라고 무조건 where 를 고르는 것",
      why: "the office which we visited 처럼 목적어가 비어 있으면 관계대명사 which 다. 선행사가 아니라 뒤 문장이 정한다.",
    },
    examples: [
      {
        correct: "This is the room where the interviews will be held.",
        ko: "the interviews will be held 가 완전하므로 관계부사 where.",
      },
      {
        correct: "This is the room which we reserved for the interviews.",
        ko: "reserved 의 목적어가 비었으므로 관계대명사 which.",
      },
    ],
  },
  {
    id: "g-relative-prep",
    title: "전치사 + 관계대명사",
    band: 900,
    category: "relative",
    summary:
      "전치사 뒤에는 that 이 오지 못하고, who 도 오지 못한다 — whom·which 만 온다.",
    detail:
      "in which, for whom, with which 처럼 전치사가 관계대명사 앞에 붙는 꼴이 있다. 이때 규칙이 둘이다. ① 전치사 바로 뒤에 that 은 쓸 수 없다 ② 사람이어도 who 가 아니라 whom 이다. 그리고 전치사가 앞으로 나갔으므로 뒤 문장은 완전하다.",
    examShape: "빈칸 앞에 전치사가 놓여 있다.",
    shortcut: "빈칸 앞이 전치사면 that·who 는 지운다. 남는 것이 답이다.",
    trap: {
      wrong: "in that / for who 를 고르는 것",
      why: "전치사 뒤의 that 은 관계대명사가 아니다(in that 은 '~라는 점에서'라는 다른 표현이다). 사람은 whom 으로 받는다.",
    },
    examples: [
      {
        correct: "The client with whom we signed the contract called today.",
        incorrect: "The client with who we signed the contract called today.",
        ko: "전치사 뒤는 whom 이다.",
      },
      {
        correct: "The building in which the office is located was renovated.",
        ko: "in which = where 로 바꿔 쓸 수 있다.",
      },
    ],
  },

  /* ─────────────── 부정사·동명사·분사 ─────────────── */
  {
    id: "g-toinf-purpose",
    title: "목적을 말하는 to부정사",
    band: 600,
    category: "toinf",
    summary:
      "'~하기 위해'는 to + 동사원형, 또는 in order to / so as to 다.",
    detail:
      "문장 맨 앞이나 뒤에 붙어 '왜 그렇게 하는가'를 말하는 자리다. To reduce paper use, the office switched to digital forms. 처럼 쓴다. 같은 뜻을 접속사로 말하려면 so that + 주어 + 동사가 되어야 하므로, 뒤에 절이 없으면 so that 은 답이 아니다.",
    examShape: "문장 맨 앞이 비어 있고 뒤에 동사원형이 이어진다.",
    shortcut: "빈칸 뒤가 동사원형이면 To, 절이면 So that·Because 쪽이다.",
    trap: {
      wrong: "For + 동사원형",
      why: "for 는 전치사라 뒤에 동사원형이 오지 못한다. 목적을 말하려면 to 부정사이거나 for + 동명사다.",
    },
    examples: [
      {
        correct: "To reduce costs, the company switched suppliers.",
        incorrect: "For reduce costs, the company switched suppliers.",
        ko: "목적은 To + 동사원형이다.",
      },
      {
        correct: "The team stayed late in order to meet the deadline.",
        ko: "in order to 는 to 를 강조한 꼴이다.",
      },
    ],
  },
  {
    id: "g-toinf-adj",
    title: "to부정사와 짝을 이루는 형용사·명사",
    band: 800,
    category: "toinf",
    summary:
      "be able/eager/willing/ready to, the ability/decision/effort/opportunity to.",
    detail:
      "특정 형용사와 명사는 뒤에 반드시 to부정사를 데리고 온다. 동명사가 아니다. 시험은 그 자리에 -ing 를 놓아 고르게 만든다. 짝으로 외우는 편이 빠르다 — be able to, be eager to, be willing to, be reluctant to, be likely to / the ability to, the decision to, the effort to, the opportunity to, the right to.",
    examShape: "형용사나 명사 바로 뒤가 비어 있다.",
    shortcut: "앞의 형용사·명사를 보고 짝을 떠올린다. 해석은 필요 없다.",
    trap: {
      wrong: "전치사 to 와 헷갈려 동명사를 넣는 것",
      why: "be committed to -ing, look forward to -ing 처럼 to 가 전치사인 짝도 있다. 앞의 말이 무엇인지로 갈린다.",
    },
    examples: [
      {
        correct: "The committee is willing to reconsider the proposal.",
        incorrect: "The committee is willing reconsidering the proposal.",
        ko: "be willing 의 짝은 to부정사다.",
      },
      {
        correct: "We look forward to working with you.",
        ko: "이쪽의 to 는 전치사라 동명사가 온다. 짝을 구별해야 한다.",
      },
    ],
  },
  {
    id: "g-participle-clause",
    title: "분사구문 — 접속사와 주어를 지운 자리",
    band: 900,
    category: "toinf",
    summary:
      "쉼표 앞뒤로 -ing 나 p.p. 가 홀로 서 있으면 분사구문이다.",
    detail:
      "두 문장을 이을 때 접속사와 주어를 지우고 동사를 -ing 로 바꾼 것이 분사구문이다. 주어가 그 동작을 하면 -ing, 당하면 p.p. 다. 주절의 주어와 같아야 성립하므로, 시험은 주어가 다른 문장을 만들어 함정을 판다. 뜻을 분명히 하려고 접속사를 남기기도 한다(When completing the form, …).",
    examShape: "문장 앞이 쉼표로 끊기고 그 앞자리가 비어 있다.",
    shortcut:
      "주절의 주어를 찾아 그 주어가 하는 일이면 -ing, 당하는 일이면 p.p.",
    trap: {
      wrong: "주어가 다른데 분사구문을 쓰는 것",
      why: "Walking into the room, the lights were off. 는 불이 걸어 들어간 것이 된다. 주어가 다르면 접속사를 살려 절로 쓴다.",
    },
    examples: [
      {
        correct: "Reviewing the contract, the manager noticed an error.",
        ko: "검토한 것도 알아챈 것도 manager 다.",
      },
      {
        correct: "Written in plain language, the guide is easy to follow.",
        ko: "안내서는 쓰여진 쪽이므로 p.p. 다.",
      },
    ],
  },

  /* ─────────────── 대명사 ─────────────── */
  {
    id: "g-pronoun-reflexive",
    title: "재귀대명사 — 빼도 문장이 완전한 자리",
    band: 700,
    category: "pronoun",
    summary:
      "'직접'을 더하는 자리이거나, 목적어가 주어와 같은 자리다.",
    detail:
      "-self 가 붙는 말은 두 자리에 온다. ① 주어와 목적어가 같을 때(He introduced himself) — 이때는 빼면 문장이 무너진다 ② '직접'이라는 뜻을 더할 때(He assembled it himself) — 이때는 빼도 문장이 완전하다. 시험에 나오는 것은 대개 ②다. by oneself(혼자서)도 함께 외운다.",
    examShape: "문장이 이미 완전한데 맨 뒤나 주어 뒤가 비어 있다.",
    shortcut: "빈칸을 빼 본다. 완전하면 재귀대명사, 무너지면 목적격이다.",
    trap: {
      wrong: "목적어 자리가 이미 찼는데 목적격을 또 넣는 것",
      why: "assembled the case him 은 목적어가 둘이 된다. 강조라면 himself 여야 한다.",
    },
    examples: [
      {
        correct: "Mr. Okafor assembled the display case himself.",
        ko: "himself 를 빼도 문장이 완전하다 — 강조다.",
      },
      {
        correct: "Please help yourself to the refreshments.",
        ko: "help oneself to 는 굳은 표현이다.",
      },
    ],
  },
  {
    id: "g-pronoun-indefinite",
    title: "부정대명사 — other / another / the other",
    band: 800,
    category: "pronoun",
    summary:
      "another 는 '또 하나', the other 는 '남은 하나', others 는 '다른 몇몇'이다.",
    detail:
      "셋이 늘 함께 나온다. another(an + other)는 정해지지 않은 또 하나라 단수다. the other 는 둘 중 남은 하나, the others 는 나머지 전부다. others 는 정해지지 않은 다른 사람·것들이다. one ~ the other 는 둘일 때, one ~ another ~ the other 는 셋일 때 쓴다.",
    examShape: "앞 문장에 수가 정해져 있고 그 다음을 가리키는 자리가 비어 있다.",
    shortcut:
      "정해진 범위 안에서 '남은 것'이면 the 가 붙고, 열린 채로 '또 하나'면 the 가 없다.",
    trap: {
      wrong: "another 뒤에 복수 명사를 두는 것",
      why: "another 는 an 이 들어 있어 단수만 받는다. 복수를 받으려면 other 나 others 다. (예외: another two weeks 처럼 기간을 한 덩어리로 볼 때)",
    },
    examples: [
      {
        correct: "One candidate withdrew, so we interviewed another.",
        ko: "정해지지 않은 또 한 명이므로 another.",
      },
      {
        correct: "Two rooms were booked; the other was left open.",
        ko: "둘 중 남은 하나라 the other.",
      },
    ],
  },

  /* ─────────────── 비교 ─────────────── */
  {
    id: "g-comparison-as",
    title: "원급 비교 — as ~ as 사이에는 원래 꼴",
    band: 700,
    category: "comparison",
    summary: "as 와 as 사이에는 비교급이 아니라 원급이 들어간다.",
    detail:
      "as ___ as 사이에는 형용사·부사의 원래 꼴이 온다. 비교급을 넣으면 틀린다. 형용사냐 부사냐는 as 를 빼고 문장을 읽어 정한다 — be동사 뒤면 형용사, 일반동사를 꾸미면 부사다. 부정은 not as ~ as 이고, 배수는 twice as ~ as 로 쓴다.",
    examShape: "as ___ as 꼴에서 가운데를 묻는다.",
    shortcut: "as 두 개를 손으로 가리고 읽어 본다. 그 자리에 맞는 품사가 답이다.",
    trap: {
      wrong: "as more efficient as",
      why: "as 사이에는 비교급이 오지 않는다. more 를 쓰려면 than 과 짝지어야 한다.",
    },
    examples: [
      {
        correct: "The new system is as efficient as the old one.",
        incorrect: "The new system is as more efficient as the old one.",
        ko: "as 사이는 원급이다.",
      },
      {
        correct: "The team finished twice as quickly as expected.",
        ko: "일반동사 finished 를 꾸미므로 부사 quickly 다.",
      },
    ],
  },
  {
    id: "g-comparison-idiom",
    title: "비교 관용 표현",
    band: 900,
    category: "comparison",
    summary:
      "the 비교급 ~, the 비교급 … / 비교급 + than ever / no later than.",
    detail:
      "굳어진 꼴이라 통째로 외우는 편이 빠르다. ① The sooner, the better(빠를수록 좋다) ② higher than ever(그 어느 때보다 높은) ③ no later than(늦어도 ~까지) ④ as early as(이르면 ~에) ⑤ other than(~ 외에) ⑥ rather than(~보다는). 비교급을 강조하는 말도 정해져 있다 — much, far, even, still, a lot 은 되고 very 는 안 된다.",
    examShape: "관용 표현의 한 조각을 비워 놓는다.",
    shortcut: "비교급 앞의 강조어가 very 면 오답이다. much·far·even 이 맞다.",
    trap: {
      wrong: "very better, very higher",
      why: "very 는 원급을 강조한다. 비교급은 much·far·even·still 로 강조한다.",
    },
    examples: [
      {
        correct: "Applications must be submitted no later than 5 P.M.",
        ko: "no later than = 늦어도 ~까지.",
      },
      {
        correct: "This quarter's figures are much higher than last year's.",
        ko: "비교급 강조는 much 다. very 는 오지 못한다.",
      },
    ],
  },

  /* ─────────────── 전치사 ─────────────── */
  {
    id: "g-prep-duration",
    title: "기간 전치사 — for / during / within / by / until",
    band: 700,
    category: "prep",
    summary:
      "for + 숫자 기간, during + 행사 이름, within + 기간 이내, by 는 마감 시점.",
    detail:
      "가장 자주 갈리는 다섯이다. for two weeks(두 주 동안 — 숫자), during the conference(학회 동안 — 사건), within five days(닷새 안에), by Friday(금요일까지 — 그때 한 번), until Friday(금요일까지 — 그때까지 계속). by 와 until 의 차이가 특히 자주 나온다: 한 번에 끝나는 일은 by, 계속되는 일은 until 이다.",
    examShape: "뒤에 오는 말이 숫자 기간인지 사건 이름인지로 갈린다.",
    shortcut:
      "뒤에 숫자가 있으면 for·within, 행사 이름이면 during. 제출·완료는 by, 영업·대기는 until.",
    trap: {
      wrong: "during two weeks / for the meeting",
      why: "during 뒤에는 사건 이름이, for 뒤에는 숫자 기간이 온다. 자리를 서로 바꿔 낸다.",
    },
    examples: [
      {
        correct: "The office will be closed for three days during the holiday.",
        ko: "숫자에는 for, 행사에는 during 이다.",
      },
      {
        correct: "Refunds are processed within five business days.",
        ko: "'~ 이내'는 within 이다.",
      },
    ],
  },
  {
    id: "g-prep-phrase",
    title: "두 단어 이상인 전치사",
    band: 800,
    category: "prep",
    summary:
      "because of / due to / owing to / in spite of / regardless of — 뒤에 명사가 온다.",
    detail:
      "여러 단어가 모여 전치사 노릇을 하는 것들이다. 접속사와 뜻이 같아서 시험이 나란히 놓는다. 가르는 법은 하나 — 뒤에 명사가 오면 전치사구, 절이 오면 접속사다. because(접속사) ↔ because of(전치사), although ↔ despite/in spite of, while ↔ during 이 짝이다. in addition to, prior to, according to, thanks to 도 뒤에 명사가 온다.",
    examShape: "빈칸 뒤가 명사인지 절인지로 갈린다.",
    shortcut:
      "빈칸 뒤에 주어와 동사가 보이면 접속사, 명사 덩어리로 끝나면 전치사구다.",
    trap: {
      wrong: "despite of",
      why: "despite 자체가 전치사라 of 를 붙이지 않는다. in spite of 는 of 가 있다. 이 둘을 섞은 despite of 는 없는 말이다.",
    },
    examples: [
      {
        correct: "The event was postponed because of heavy rain.",
        incorrect: "The event was postponed because heavy rain.",
        ko: "뒤가 명사이므로 because of 다.",
      },
      {
        correct: "Despite the delay, the shipment arrived intact.",
        ko: "despite 뒤에는 of 를 붙이지 않는다.",
      },
    ],
  },

  /* ─────────────── 문장 구조 ─────────────── */
  {
    id: "g-structure-parallel",
    title: "병렬 — and·or 앞뒤는 같은 꼴",
    band: 700,
    category: "structure",
    summary:
      "and / or / but 으로 이어진 것들은 품사와 형태가 같아야 한다.",
    detail:
      "등위접속사는 같은 급을 잇는다. 명사와 명사, 동명사와 동명사, to부정사와 to부정사가 짝이 된다. 시험은 앞을 보여 주고 뒤를 비운다 — 앞의 꼴만 보면 답이 정해지므로 해석이 필요 없다. 상관접속사(both A and B, not only A but also B)에서도 A 와 B 는 같은 꼴이어야 한다.",
    examShape: "and 나 or 바로 뒤가 비어 있다.",
    shortcut: "접속사 바로 앞의 낱말이 무슨 꼴인지 보고 그대로 맞춘다.",
    trap: {
      wrong: "명사와 동명사를 섞는 것",
      why: "responsible for planning and to organize 는 짝이 어긋난다. planning and organizing 이어야 한다.",
    },
    examples: [
      {
        correct: "The role involves planning events and managing budgets.",
        incorrect: "The role involves planning events and to manage budgets.",
        ko: "planning 과 managing 으로 꼴을 맞춘다.",
      },
      {
        correct: "Applicants must be punctual, courteous, and organized.",
        ko: "형용사 셋이 나란히 놓인다.",
      },
    ],
  },
  {
    id: "g-structure-it",
    title: "가주어·가목적어 it",
    band: 800,
    category: "structure",
    summary:
      "It is + 형용사 + to부정사 / that절. 진짜 주어는 뒤에 있다.",
    detail:
      "주어가 길면 앞에 it 을 세우고 진짜 주어를 뒤로 보낸다. It is important to submit the form. 이 그것이다. 목적어에도 같은 일이 일어난다 — We found it difficult to reach him. 시험은 이 it 자리를 비우거나, 뒤에 오는 것이 to부정사인지 that절인지를 묻는다. 사람의 성격을 말할 때는 of, 그 밖에는 for 를 쓴다(It is kind of you / It is necessary for us).",
    examShape: "문장이 It is 로 시작하고 뒤에 to 나 that 이 보인다.",
    shortcut: "It is ___ to ~ 꼴이면 빈칸은 형용사다. 부사가 아니다.",
    trap: {
      wrong: "There is important to ~",
      why: "there 구문은 '있다'는 뜻이라 이 자리에 오지 못한다. 가주어는 it 뿐이다.",
    },
    examples: [
      {
        correct: "It is essential to confirm your reservation in advance.",
        ko: "진짜 주어는 to confirm 이하다.",
      },
      {
        correct: "The board considers it necessary to revise the policy.",
        ko: "가목적어 it 이 뒤의 to부정사를 대신한다.",
      },
    ],
  },
  {
    id: "g-structure-inversion",
    title: "도치 — 부정어가 앞으로 나가면 주어와 동사가 뒤집힌다",
    band: 900,
    category: "structure",
    summary:
      "Not only / Never / Rarely / Only 가 문장 앞에 오면 의문문 어순이 된다.",
    detail:
      "부정이나 제한을 뜻하는 말이 문장 맨 앞으로 나가면 그 뒤가 뒤집힌다. Not only did sales rise, but costs also fell. 처럼 조동사가 주어 앞으로 온다. 조동사가 없으면 do/does/did 를 빌려 온다. Only 가 이끄는 부사구가 앞에 올 때도 같다. 가정법에서 if 를 지우면 Should you have questions, … 처럼 뒤집힌다.",
    examShape:
      "문장이 Not only, Never, Rarely, Only after 등으로 시작한다.",
    shortcut: "문장 앞에 부정어가 보이면 뒤를 의문문 어순으로 읽는다.",
    trap: {
      wrong: "Not only the sales rose …",
      why: "부정어가 앞에 나가면 반드시 뒤집힌다. Not only did sales rise 가 맞다.",
    },
    examples: [
      {
        correct: "Never has the company seen such demand.",
        ko: "Never 가 앞에 나가 has 가 주어 앞으로 왔다.",
      },
      {
        correct: "Should you need assistance, please call the front desk.",
        ko: "If you should need … 에서 if 를 지우고 뒤집은 꼴이다.",
      },
    ],
  },
];
