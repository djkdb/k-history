import type { Band, GrammarCategory, GrammarPoint } from "@/lib/types";
import { GRAMMAR_MORE } from "./grammar-more";

export const CATEGORY_LABEL: Record<GrammarCategory, string> = {
  pos: "품사 자리",
  verb: "동사",
  pronoun: "대명사",
  prep: "전치사",
  conj: "접속사·접속부사",
  relative: "관계사",
  toinf: "부정사·동명사·분사",
  comparison: "비교",
  subjunctive: "가정법",
  structure: "문장 구조",
};

/**
 * Part 5·6 문법.
 *
 * 이 파트는 "해석해서 푸는 문제"와 "자리만 보고 푸는 문제"가 섞여 있다.
 * 자리 문제를 자리로 풀면 한 문항에 5초가 걸리고, 해석하려 들면 30초가 걸린다.
 * 그 차이가 Part 7 을 끝까지 풀 시간을 만든다. 그래서 항목마다
 * "시험지에서 어떤 모습으로 나오는지"와 "빈칸 앞뒤만 보는 요령"을 붙였다.
 */
const GRAMMAR_CORE: GrammarPoint[] = [
  /* ─────────────── 품사 자리 ─────────────── */
  {
    id: "g-pos-noun",
    title: "명사 자리 — 관사·소유격 뒤, 타동사·전치사 뒤",
    band: 600,
    category: "pos",
    summary:
      "the / a / 소유격 뒤, 그리고 타동사와 전치사 바로 뒤는 명사가 서는 자리다.",
    detail:
      "영어 문장에서 자리는 정해져 있다. 관사(the, a)나 소유격(our, its)이 보이면 그 뒤는 반드시 명사로 끝나야 한다. 전치사(of, for, in) 뒤도 마찬가지다. 이때 선택지가 한 단어의 변형(inform / information / informative / informatively)이면 뜻을 볼 필요가 없다. 자리가 답을 정한다.",
    examShape:
      "선택지 네 개가 모두 같은 뿌리의 단어인데 어미만 다르다. -tion, -ment, -ance, -ity, -ness 로 끝나면 명사다.",
    shortcut:
      "빈칸 앞을 본다. the·a·소유격·전치사·타동사 중 하나면 명사. 빈칸 뒤에 명사가 또 있으면 그때는 형용사 자리다.",
    trap: {
      wrong: "형용사가 명사처럼 생겨서 고르는 것 (responsible ↔ responsibility)",
      why: "-ible, -able, -ive, -ous, -al 로 끝나면 형용사다. 관사 바로 뒤에는 올 수 없다(단, 뒤에 명사가 또 있으면 가능).",
    },
    examples: [
      {
        correct: "Please submit your application by Friday.",
        incorrect: "Please submit your apply by Friday.",
        ko: "소유격 your 뒤이므로 명사 application 이 와야 한다.",
      },
      {
        correct: "The manager is responsible for the final decision.",
        ko: "be 동사 뒤는 형용사 자리라 responsible. 반면 has responsibility for 라면 명사다.",
      },
    ],
  },
  {
    id: "g-pos-adj",
    title: "형용사 자리 — 명사 앞, be동사 뒤",
    band: 600,
    category: "pos",
    summary: "명사를 꾸미는 자리(명사 앞)와 상태를 말하는 자리(be동사·become 뒤)다.",
    detail:
      "형용사가 서는 곳은 둘뿐이다. 명사 앞에서 꾸미거나, be·become·remain·seem 같은 동사 뒤에서 주어의 상태를 말한다. 관사와 명사 사이에 빈칸이 있으면 거의 형용사다 — a ___ decision.",
    examShape:
      "a/an/the ___ 명사 꼴이거나, is/are/was/became ___ 꼴로 나온다.",
    shortcut:
      "빈칸 뒤에 명사가 있으면 형용사, 없으면 명사일 확률이 높다. 이 한 줄로 품사 문제 절반이 풀린다.",
    trap: {
      wrong: "부사를 넣는 것 (a successfully project)",
      why: "부사는 명사를 꾸미지 못한다. 명사 앞자리에 -ly 가 오면 거의 오답이다.",
    },
    examples: [
      {
        correct: "The company reported a significant increase in sales.",
        incorrect: "The company reported a significantly increase in sales.",
        ko: "관사 a 와 명사 increase 사이이므로 형용사 significant.",
      },
    ],
  },
  {
    id: "g-pos-adv",
    title: "부사 자리 — 문장에서 빼도 되는 곳",
    band: 600,
    category: "pos",
    summary:
      "부사는 동사·형용사·다른 부사·문장 전체를 꾸민다. 빼도 문장이 성립하면 부사 자리다.",
    detail:
      "부사는 문장의 뼈대가 아니다. 그래서 판별법이 명확하다 — 빈칸을 지웠을 때 완전한 문장이 남으면 그 자리는 부사다. 반대로 지웠더니 주어나 목적어가 사라지면 명사 자리였다.",
    examShape:
      "완전한 문장에 빈칸이 끼어 있다. 조동사와 본동사 사이, be동사와 -ing/p.p. 사이, 문장 맨 앞도 흔하다.",
    shortcut:
      "빈칸을 손으로 가린다. 남은 문장이 멀쩡하면 부사.",
    examples: [
      {
        correct: "The results were carefully reviewed by the committee.",
        ko: "were reviewed 만으로 문장이 완성되므로 빈칸은 부사 자리.",
      },
      {
        correct: "Sales have increased steadily over the past year.",
        ko: "완전한 문장 뒤에 붙었으니 부사.",
      },
    ],
  },

  /* ─────────────── 동사 ─────────────── */
  {
    id: "g-verb-agree",
    title: "수 일치 — 주어를 끝까지 찾아라",
    band: 600,
    category: "verb",
    summary:
      "동사의 단수·복수는 진짜 주어에 맞춘다. 주어와 동사 사이에 낀 말에 속지 않는다.",
    detail:
      "출제자는 주어와 동사 사이에 전치사구나 관계절을 길게 끼워 넣는다. The list of items ___ ... 에서 동사가 맞춰야 할 것은 items 가 아니라 list 다. 전치사 뒤의 명사는 절대 주어가 아니다.",
    examShape:
      "주어 뒤에 of/with/along with/including 이 이끄는 구가 길게 붙고, 그다음에 빈칸이 온다.",
    shortcut:
      "빈칸 앞에서 거슬러 올라가며 전치사구를 통째로 지운다. 남는 첫 명사가 주어다.",
    trap: {
      wrong: "가장 가까운 명사에 맞추는 것",
      why: "of items 처럼 전치사 뒤에 있는 명사는 주어가 될 수 없다. 그래서 일부러 복수를 놓아둔다.",
    },
    examples: [
      {
        correct: "The list of approved vendors is posted on the intranet.",
        incorrect: "The list of approved vendors are posted on the intranet.",
        ko: "주어는 list(단수). vendors 는 전치사 of 의 목적어일 뿐이다.",
      },
    ],
  },
  {
    id: "g-verb-passive",
    title: "능동 vs 수동 — 목적어가 있는지 본다",
    band: 600,
    category: "verb",
    summary:
      "빈칸 뒤에 목적어(명사)가 있으면 능동, 없으면 수동일 때가 많다.",
    detail:
      "타동사는 목적어가 있어야 한다. 그런데 빈칸 뒤에 명사가 없고 전치사나 부사만 있다면, 그 목적어는 이미 주어 자리로 올라간 것이다 — 즉 수동태다. 반대로 목적어가 멀쩡히 있으면 능동이어야 한다.",
    examShape:
      "선택지가 completed / was completed / has completed / completing 처럼 태와 시제로 갈린다.",
    shortcut:
      "빈칸 뒤를 본다. 명사가 바로 오면 능동, by 나 전치사·마침표면 수동.",
    trap: {
      wrong: "주어가 사물이면 무조건 수동이라고 외우는 것",
      why: "The report shows ... 처럼 사물 주어도 능동을 쓴다. 판단 기준은 주어가 아니라 목적어의 유무다.",
    },
    examples: [
      {
        correct: "The proposal was approved by the board.",
        ko: "approved 뒤에 목적어가 없고 by 가 왔다 → 수동.",
      },
      {
        correct: "The board approved the proposal.",
        ko: "approved 뒤에 목적어 the proposal 이 있다 → 능동.",
      },
    ],
  },
  {
    id: "g-verb-tense",
    title: "시제 — 문장 안의 시간 표시를 찾는다",
    band: 600,
    category: "verb",
    summary:
      "시제 문제는 해석이 아니라 시간 부사를 찾는 문제다. next week 이 있으면 미래, since 가 있으면 현재완료다.",
    detail:
      "Part 5 의 시제 문제에는 거의 항상 근거가 문장 안에 박혀 있다. yesterday·last month·in 2019 → 과거. next week·tomorrow·shortly → 미래. since·for the past ~·over the last ~ → 현재완료. by the time·before 절 → 과거완료나 미래완료.",
    examShape: "선택지가 같은 동사의 시제 변화형으로만 채워져 있다.",
    shortcut:
      "문장을 훑어 시간 표시부터 찾는다. 없으면 그때 앞뒤 문장을 본다(Part 6 는 특히 그렇다).",
    trap: {
      wrong: "since 를 보고 과거시제를 고르는 것",
      why: "since + 과거 시점은 '그때부터 지금까지'라서 주절은 현재완료다. since 2019, sales have risen.",
    },
    examples: [
      {
        correct: "The company has expanded rapidly since it opened in 2018.",
        incorrect: "The company expanded rapidly since it opened in 2018.",
        ko: "since 절이 있으면 주절은 현재완료.",
      },
      {
        correct: "The new branch will open next month.",
        ko: "next month → 미래.",
      },
    ],
  },

  /* ─────────────── 전치사 vs 접속사 ─────────────── */
  {
    id: "g-conj-vs-prep",
    title: "전치사 vs 접속사 — 뒤에 명사냐 문장이냐",
    band: 700,
    category: "conj",
    summary:
      "뒤에 명사만 오면 전치사, 주어+동사가 오면 접속사다. 뜻이 같아도 자리는 다르다.",
    detail:
      "TOEIC 이 가장 즐겨 내는 짝이다. because(접속사) ↔ because of(전치사), although(접속사) ↔ despite/in spite of(전치사), while(접속사) ↔ during(전치사). 뜻은 같은데 뒤에 오는 것이 다르다. 해석으로는 절대 못 가른다.",
    examShape:
      "빈칸 뒤가 'the heavy rain' 인지 'it rained heavily' 인지로 갈린다.",
    shortcut:
      "빈칸 뒤에서 동사를 찾는다. 동사가 있으면 접속사, 없으면 전치사.",
    trap: {
      wrong: "despite 뒤에 문장을 넣는 것",
      why: "despite 는 전치사라 뒤에 명사만 온다. 문장을 쓰려면 although 나 even though 를 써야 한다.",
    },
    examples: [
      {
        correct: "Despite the delay, the project was completed on time.",
        incorrect: "Despite the project was delayed, it was completed on time.",
        ko: "despite 뒤에는 명사구만. 문장이면 Although 로.",
      },
      {
        correct: "The office was closed during the renovation.",
        ko: "during 뒤에 명사. while 이라면 while the office was being renovated.",
      },
    ],
  },
  {
    id: "g-conj-adverb",
    title: "접속부사는 문장을 잇지 못한다",
    band: 700,
    category: "conj",
    summary:
      "however, therefore, moreover 는 부사다. 두 문장을 콤마 하나로 잇는 데 쓸 수 없다.",
    detail:
      "however 는 뜻이 '그러나'라서 접속사처럼 느껴지지만 품사는 부사다. 그래서 두 절을 이으려면 마침표나 세미콜론이 필요하다. Part 6 에서 문장 사이 빈칸에 무엇을 넣을지 묻는 문제로 자주 나오고, Part 5 에서는 '접속사 자리에 접속부사'를 오답으로 깔아 둔다.",
    examShape:
      "빈칸 앞뒤에 완전한 문장이 둘 있는데, 사이에 콤마만 있는지 마침표가 있는지 본다.",
    shortcut:
      "빈칸 앞이 마침표·세미콜론이면 접속부사 가능. 콤마 하나로 두 문장을 잇는 자리라면 접속사여야 한다.",
    trap: {
      wrong: "It rained, however we continued. 처럼 쓰는 것",
      why: "however 는 부사라 이 자리에 못 온다. but 을 쓰거나, 앞에 세미콜론을 넣어야 한다.",
    },
    examples: [
      {
        correct: "The launch was delayed; however, sales targets were still met.",
        ko: "세미콜론이 두 문장을 잇고, however 는 부사로 얹혀 있다.",
      },
      {
        correct: "The launch was delayed, but sales targets were still met.",
        ko: "접속사 but 은 콤마 하나로 이을 수 있다.",
      },
    ],
  },

  /* ─────────────── 관계사 ─────────────── */
  {
    id: "g-relative-basic",
    title: "관계대명사 — 뒤에 빠진 성분을 본다",
    band: 700,
    category: "relative",
    summary:
      "뒤 문장에서 주어가 빠졌으면 who/which, 목적어가 빠졌으면 whom/which, 다 있으면 whose 나 관계부사다.",
    detail:
      "관계대명사는 앞의 명사를 대신하면서 뒤 문장의 한 자리를 채운다. 그래서 뒤 문장이 어디가 비었는지 보면 답이 정해진다. 주어가 비면 주격, 목적어가 비면 목적격. 뒤 문장이 완전하다면 관계대명사가 아니라 whose(소유격)나 where/when(관계부사)다.",
    examShape:
      "명사 뒤에 빈칸이 오고 선택지에 who / whom / whose / which 가 늘어선다.",
    shortcut:
      "빈칸 뒤 문장에서 주어와 목적어를 찾는다. 없는 자리가 곧 답이다.",
    trap: {
      wrong: "사람이면 무조건 who 라고 고르는 것",
      why: "사람이라도 뒤 문장이 완전하면 whose 다. The author whose book won the prize — book won 이 이미 완전하다.",
    },
    examples: [
      {
        correct: "We hired a consultant who has extensive experience.",
        ko: "who 뒤에 주어가 없다 → 주격.",
      },
      {
        correct: "The vendor whose bid was lowest received the contract.",
        ko: "bid was lowest 가 완전하다 → 소유격 whose.",
      },
    ],
  },

  /* ─────────────── 부정사·동명사·분사 ─────────────── */
  {
    id: "g-toinf-vs-gerund",
    title: "to부정사냐 동명사냐 — 앞 동사가 정한다",
    band: 700,
    category: "toinf",
    summary:
      "plan·decide·agree 뒤에는 to부정사, enjoy·consider·avoid 뒤에는 동명사가 온다.",
    detail:
      "규칙이 아니라 목록이다. 다만 방향은 있다 — 앞으로 할 일을 말하는 동사(plan, hope, intend, decide, agree, offer, refuse)는 to부정사를, 이미 있는 일을 다루는 동사(enjoy, finish, avoid, consider, suggest, recommend)는 동명사를 취한다.",
    examShape:
      "동사 바로 뒤 빈칸에 to hire / hiring / hire / hired 가 늘어선다.",
    shortcut:
      "전치사 뒤에는 항상 동명사다. to 가 전치사인 표현(look forward to, be committed to, object to)에 주의한다.",
    trap: {
      wrong: "look forward to 뒤에 동사원형을 넣는 것",
      why: "여기서 to 는 부정사의 to 가 아니라 전치사다. 그래서 look forward to meeting you 다.",
    },
    examples: [
      {
        correct: "We look forward to working with you.",
        incorrect: "We look forward to work with you.",
        ko: "to 가 전치사이므로 동명사.",
      },
      {
        correct: "The board decided to postpone the vote.",
        ko: "decide 는 to부정사를 취한다.",
      },
    ],
  },
  {
    id: "g-participle",
    title: "분사 — 꾸미는 명사가 하느냐 당하느냐",
    band: 800,
    category: "toinf",
    summary:
      "명사가 그 동작을 하면 -ing, 당하면 p.p. 다.",
    detail:
      "the increasing cost(늘어나는 비용)와 the increased cost(늘어난 비용)는 둘 다 되지만, the attached document(첨부된 문서)를 attaching 이라 쓸 수는 없다. 문서가 스스로 붙는 것이 아니기 때문이다. 감정 동사도 같다 — 사람은 -ed(interested), 사물은 -ing(interesting).",
    examShape:
      "명사 앞이나 뒤에 빈칸이 있고 -ing 형과 p.p. 형이 나란히 선택지에 있다.",
    shortcut:
      "꾸밈받는 명사를 주어로 놓고 능동인지 수동인지 본다.",
    trap: {
      wrong: "The result was very satisfied. 처럼 쓰는 것",
      why: "결과가 만족을 '주는' 쪽이므로 satisfying 이다. 만족을 '느끼는' 사람에게 satisfied 를 쓴다.",
    },
    examples: [
      {
        correct: "Please review the attached documents.",
        ko: "문서는 붙임을 당하는 쪽 → p.p.",
      },
      {
        correct: "The results were disappointing to the investors.",
        ko: "결과가 실망을 주는 쪽 → -ing. 투자자는 disappointed.",
      },
    ],
  },

  /* ─────────────── 대명사 ─────────────── */
  {
    id: "g-pronoun-case",
    title: "대명사 격 — 자리로 정한다",
    band: 600,
    category: "pronoun",
    summary:
      "주어 자리면 주격, 목적어·전치사 뒤면 목적격, 명사 앞이면 소유격이다.",
    detail:
      "he / him / his / himself 가 나란히 선택지에 오면 해석할 것이 없다. 빈칸이 문장의 어느 자리인지만 보면 된다. 명사 앞이면 소유격, 이미 주어와 목적어가 다 있는데 강조로 들어가면 재귀대명사다.",
    examShape: "선택지가 한 대명사의 격 변화로만 채워져 있다.",
    shortcut:
      "빈칸 뒤에 명사가 있으면 소유격(his report). 없으면 자리를 본다.",
    trap: {
      wrong: "재귀대명사를 목적어 자리에 아무 때나 넣는 것",
      why: "재귀대명사는 주어와 목적어가 같은 사람일 때만 쓴다. Ms. Lee prepared the report herself 는 강조 용법이다.",
    },
    examples: [
      {
        correct: "Ms. Park will present her findings at the conference.",
        ko: "findings 라는 명사 앞이므로 소유격.",
      },
      {
        correct: "The team completed the project by itself.",
        ko: "by oneself = 스스로. 관용 표현으로 굳어 있다.",
      },
    ],
  },

  /* ─────────────── 비교 ─────────────── */
  {
    id: "g-comparison",
    title: "비교급·최상급 — 짝이 되는 말을 찾는다",
    band: 700,
    category: "comparison",
    summary:
      "than 이 보이면 비교급, the ...est / of all 이 보이면 최상급이다.",
    detail:
      "비교 문제는 문장 안에 짝이 되는 표시가 있다. than → 비교급. the + 최상급 + in/of ~ → 최상급. as ... as 사이에는 원급이 들어간다. 비교급을 강조할 때는 very 가 아니라 much · far · even · considerably 를 쓴다.",
    examShape: "선택지에 원급·비교급·최상급이 나란히 선다.",
    shortcut: "than / as ... as / the ...est 중 무엇이 보이는지부터 찾는다.",
    trap: {
      wrong: "비교급 앞에 very 를 쓰는 것",
      why: "very 는 원급만 강조한다. 비교급은 much/far/even 으로 강조한다 — much more efficient.",
    },
    examples: [
      {
        correct: "The new system is far more efficient than the old one.",
        incorrect: "The new system is very more efficient than the old one.",
        ko: "비교급 강조는 far·much·even.",
      },
      {
        correct: "This model is as durable as the previous version.",
        ko: "as ... as 사이는 원급.",
      },
    ],
  },

  /* ─────────────── 가정법 ─────────────── */
  {
    id: "g-subjunctive-should",
    title: "제안·요구 동사 뒤의 that절은 동사원형",
    band: 800,
    category: "subjunctive",
    summary:
      "suggest, recommend, request, require, insist, demand 뒤 that절에는 동사원형이 온다.",
    detail:
      "'~해야 한다'는 뜻이 이미 동사에 들어 있어서, that절의 should 가 생략된다. 그 결과 주어가 3인칭 단수여도 -s 가 붙지 않는다. We recommend that he submit(→ submits 아님) the form.",
    examShape:
      "recommend/request/suggest that 다음 빈칸에 submit / submits / submitted / submitting 이 늘어선다.",
    shortcut:
      "that 앞의 동사가 제안·요구·주장 계열인지 본다. 맞으면 그냥 동사원형.",
    trap: {
      wrong: "주어에 맞춰 -s 를 붙이는 것",
      why: "should 가 숨어 있어서 수 일치를 하지 않는다. 이것을 모르면 자연스러워 보이는 오답을 고른다.",
    },
    examples: [
      {
        correct: "The auditor recommended that the company revise its policy.",
        incorrect: "The auditor recommended that the company revises its policy.",
        ko: "recommend that + 주어 + 동사원형.",
      },
      {
        correct: "It is essential that all forms be signed in advance.",
        ko: "essential/necessary/important 같은 형용사 뒤 that절도 마찬가지다.",
      },
    ],
  },
  {
    id: "g-subjunctive-if",
    title: "가정법 — if절과 주절의 시제가 한 칸씩 어긋난다",
    band: 900,
    category: "subjunctive",
    summary:
      "현재 사실의 반대는 과거형, 과거 사실의 반대는 과거완료형을 쓴다.",
    detail:
      "가정법 과거: If + 과거, 주어 + would/could + 동사원형 (지금 사실과 반대). 가정법 과거완료: If + had p.p., 주어 + would have p.p. (그때 사실과 반대). if 가 생략되면 도치되어 Had we known ... 꼴이 된다 — 이 도치형이 900점대 문제로 나온다.",
    examShape:
      "if절이나 주절 한쪽이 주어지고 다른 쪽 빈칸을 채운다. 또는 문장이 Had/Were 로 시작한다.",
    shortcut:
      "if절이 과거면 주절은 would+동사원형, if절이 had p.p.면 주절은 would have p.p. 한 칸씩 밀린다고 기억한다.",
    trap: {
      wrong: "if절에 would 를 넣는 것",
      why: "would 는 주절에 온다. if절에는 시제만 밀어 쓴다.",
    },
    examples: [
      {
        correct: "If we had ordered earlier, the parts would have arrived on time.",
        ko: "과거 사실의 반대 → had p.p. / would have p.p.",
      },
      {
        correct: "Had we ordered earlier, the parts would have arrived on time.",
        ko: "if 를 지우고 had 를 앞으로 보낸 도치형. 뜻은 같다.",
      },
    ],
  },

  /* ─────────────── 전치사 ─────────────── */
  {
    id: "g-prep-time",
    title: "시간 전치사 — in / on / at, by / until",
    band: 600,
    category: "prep",
    summary:
      "넓은 때는 in, 날짜·요일은 on, 시각은 at. 기한은 by, 지속은 until.",
    detail:
      "by 와 until 은 시험이 특히 좋아한다. by 는 '그때까지 (한 번) 끝내라'는 마감이고, until 은 '그때까지 (계속)'이다. Submit it by Friday(금요일까지 내라) ↔ The office is closed until Friday(금요일까지 계속 닫는다).",
    examShape:
      "빈칸 뒤에 날짜나 시각이 오고 선택지에 in/on/at/by/until 이 섞여 나온다.",
    shortcut:
      "동사가 한 번에 끝나는 일(submit, complete)이면 by, 계속되는 상태(remain, be closed)면 until.",
    trap: {
      wrong: "'~까지'를 전부 until 로 옮기는 것",
      why: "한국어 '~까지'가 둘을 다 덮어서 헷갈린다. 영어는 마감과 지속을 다른 단어로 구분한다.",
    },
    examples: [
      {
        correct: "Please return the form by March 10.",
        ko: "반납은 한 번에 끝나는 일 → by.",
      },
      {
        correct: "The exhibit will remain open until March 10.",
        ko: "열려 있는 상태가 이어진다 → until.",
      },
    ],
  },
  {
    id: "g-prep-etc",
    title: "자주 나오는 전치사 짝",
    band: 700,
    category: "prep",
    summary:
      "within(~이내), throughout(~내내), regarding(~에 관해), aside from(~외에)",
    detail:
      "Part 5 는 뜻이 비슷한 전치사를 나란히 놓는다. within three days(3일 안에) ↔ in three days(3일 후에)는 특히 자주 갈린다. throughout 은 기간 전체, during 은 그 기간 중 어느 때다.",
    examShape: "빈칸 뒤에 기간·명사가 오고 전치사 넷이 늘어선다.",
    shortcut:
      "within 은 '그 안에', in 은 '그만큼 지나서'. 마감 문맥이면 within 이 답일 때가 많다.",
    examples: [
      {
        correct: "Orders are processed within two business days.",
        ko: "영업일 2일 '안에' → within.",
      },
      {
        correct: "The store stayed busy throughout the holiday season.",
        ko: "연휴 기간 '내내' → throughout.",
      },
    ],
  },

  /* ─────────────── 문장 구조 ─────────────── */
  {
    id: "g-structure-count",
    title: "가산 vs 불가산 — many/much, few/little",
    band: 600,
    category: "structure",
    summary:
      "셀 수 있으면 many·few·a number of, 없으면 much·little·a great deal of.",
    detail:
      "information, equipment, furniture, advice, luggage, machinery 는 영어에서 셀 수 없다. 한국어로는 '정보 세 개'가 되지만 영어로는 three informations 라 하지 않는다. 이 단어들이 나오면 much·little·a great deal of 를 쓰고 복수형 s 도 붙이지 않는다.",
    examShape:
      "빈칸 뒤에 information / equipment 같은 불가산 명사가 오고 many/much 가 선택지에 함께 나온다.",
    shortcut:
      "불가산 단골 목록(information, equipment, furniture, advice, machinery, luggage)을 통째로 외워 둔다.",
    trap: {
      wrong: "informations, equipments 처럼 s 를 붙이는 것",
      why: "불가산 명사는 복수형이 없다. 선택지에 s 가 붙은 형태가 있으면 그것이 오답이다.",
    },
    examples: [
      {
        correct: "We received a great deal of useful information.",
        incorrect: "We received many useful informations.",
        ko: "information 은 불가산.",
      },
    ],
  },
  {
    id: "g-structure-there",
    title: "there 구문과 도치",
    band: 800,
    category: "structure",
    summary:
      "There 뒤 동사는 그 뒤에 오는 진짜 주어에 맞춘다. 부정어가 문두에 오면 도치된다.",
    detail:
      "There is a problem / There are problems — 동사는 there 가 아니라 뒤의 명사에 맞춘다. 그리고 Not only, Rarely, Seldom, Never 가 문장 맨 앞에 오면 뒤가 의문문 어순으로 뒤집힌다: Not only did sales rise, but ...",
    examShape:
      "There ___ several reasons 꼴이거나, 문장이 Not only/Rarely 로 시작한다.",
    shortcut: "there 구문은 뒤를 보고, 부정어 문두면 조동사를 앞으로 뺀다.",
    examples: [
      {
        correct: "There are several reasons for the delay.",
        ko: "진짜 주어는 reasons(복수).",
      },
      {
        correct: "Rarely does the committee meet on weekends.",
        ko: "부정어 Rarely 가 앞에 와서 does 가 주어 앞으로 나갔다.",
      },
    ],
  },
];

/**
 * 갈래별로 파일을 갈라 둔다. 한 파일에 다 넣으면 한 갈래만 손보려 해도
 * 수천 줄을 스크롤해야 하고, 그러다 보면 손이 덜 가는 갈래가 생긴다.
 */
export const GRAMMAR: GrammarPoint[] = [...GRAMMAR_CORE, ...GRAMMAR_MORE];

export const GRAMMAR_MAP: Record<string, GrammarPoint> = Object.fromEntries(
  GRAMMAR.map((g) => [g.id, g]),
);

/**
 * 목표 점수대에 드는 문법.
 *
 * 어휘와 달리 문법은 **잘라 내지 않는다.** 900점대 낱말은 600점 목표에
 * 시간 낭비지만, 문법은 점수대와 상관없이 같은 규칙을 쓴다. 600을
 * 노린다고 관계대명사를 아예 안 보는 것이 아니고, 실제로 Part 5 에서
 * 그 문항을 만난다. 그래서 band 는 '차단'이 아니라 '먼저 볼 것'을
 * 정하는 데만 쓴다.
 *
 * (이 함수는 목표 안쪽만 돌려준다 — 화면에서 그 뒤에 나머지를 이어 붙인다)
 */
export function grammarFor(band: Band): GrammarPoint[] {
  return GRAMMAR.filter((g) => g.band <= band);
}

/** 목표 점수대를 넘어서는 것들 — 먼저 볼 것 뒤에 이어 붙인다 */
export function grammarBeyond(band: Band): GrammarPoint[] {
  return GRAMMAR.filter((g) => g.band > band);
}

export function grammarByCategory(
  band: Band,
  scope: "target" | "beyond" = "target",
): { category: GrammarCategory; items: GrammarPoint[] }[] {
  const list = scope === "target" ? grammarFor(band) : grammarBeyond(band);
  const order = Object.keys(CATEGORY_LABEL) as GrammarCategory[];
  return order
    .map((category) => ({ category, items: list.filter((g) => g.category === category) }))
    .filter((g) => g.items.length > 0);
}
