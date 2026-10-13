import type { NoteSection } from "@/lib/types";

/** 정보검색 강의 노트 2 — IIR 3 Dictionaries and tolerant retrieval, IIR 4 Index Construction */
export const NOTES_2: Record<string, NoteSection[]> = {
  dict: [
    {
      title: "목차와 Recap",
      en: "Overview · Recap",
      lines: [
        "목차: ① Recap ② Dictionaries ③ Wildcard queries ④ Edit distance ⑤ Spelling correction ⑥ Soundex",
        "Type/token 구분: Token = 문서에 나온 word·term의 한 번의 출현 / Type = token의 동치류 — In June, the dog likes to chase the cat in the barn. → **12 word tokens, 9 word types**",
        "토큰화 문제: 구분자는? 공백? 아포스트로피? 하이픈? — 각각 구분할 때도, 안 할 때도 있음 / 공백 없는 언어(중국어) / 네덜란드어·독일어·스웨덴어 합성어(Lebensversicherungsgesellschaftsangestellter)",
        "동치류 문제: term = token의 동치류 — 동치류를 어떻게 정의하나? 숫자(3/20/91 vs 20/3/91), 대소문자 접기, 어간 추출·Porter, 굴절 vs 파생 형태 분석 / 다른 언어: 영어보다 복잡한 형태론 — **핀란드어는 동사 하나가 12,000가지 형태**, 악센트·움라우트",
        "스킵 포인터(Brutus 2 4 8 16 19 23 28 43, Caesar 1 2 3 5 8 41 51 60 71), 위치 색인(to be or not to be → 문서 4 매치) — 위치 색인으로 **구 질의**와 **근접 질의** 모두 답할 수 있다",
      ],
    },
    {
      title: "Take-away",
      lines: [
        "**허용 검색(tolerant retrieval)**: 질의어와 문서 용어가 **정확히 일치하지 않을 때** 어떻게 할까",
        "와일드카드 질의",
        "철자 교정",
      ],
    },
    {
      title: "사전",
      en: "Dictionaries",
      lines: [
        "사전은 **용어 어휘를 저장하는 자료구조**",
        "용어 어휘(term vocabulary): **데이터**",
        "사전(dictionary): 용어 어휘를 저장하는 **자료구조**",
      ],
    },
    {
      title: "고정 폭 항목의 배열로서의 사전",
      en: "Dictionary as array of fixed-width entries",
      lines: [
        "용어마다 몇 가지를 저장해야 함: 문서 빈도, 포스팅 리스트 포인터, …",
        "당분간 이 정보를 **고정 길이 항목**에 저장할 수 있다고 가정",
        "이 항목들을 **배열**에 저장한다고 가정",
        "질의 시점에 질의어 qᵢ를 이 배열에서 어떻게 찾나? 즉 qᵢ가 저장된 행을 찾는 데 **어떤 자료구조**를 쓸까?",
      ],
      table: {
        title: "고정 폭 배열",
        headers: ["term", "document frequency", "pointer to postings list"],
        rows: [
          ["a", "656,265", "→"],
          ["aachen", "65", "→"],
          ["…", "…", "…"],
          ["zulu", "221", "→"],
          ["space needed: 20 bytes", "4 bytes", "4 bytes"],
        ],
      },
    },
    {
      title: "용어를 찾는 자료구조",
      en: "Data structures for looking up term",
      lines: [
        "두 큰 부류: **해시**와 **트리**",
        "어떤 IR 시스템은 해시를, 어떤 시스템은 트리를 쓴다",
        "언제 해시를, 언제 트리를 쓸지의 기준:",
        "· 용어 수가 고정인가, 계속 늘어나는가?",
        "· 각 키에 접근하는 상대 빈도는?",
        "· 용어가 몇 개쯤 될까?",
      ],
    },
    {
      title: "해시",
      en: "Hashes",
      lines: [
        "각 어휘 용어를 정수(배열의 행 번호)로 해시",
        "질의 시점: 질의어를 해시해 고정 폭 배열의 항목을 찾음",
        "장점: 해시 조회가 트리 조회보다 **빠르다** — 조회 시간 **상수**",
        "단점: 작은 **변형어를 찾을 방법이 없음**(resume vs. résumé)",
        "단점: **접두사 검색 불가**(automat로 시작하는 모든 용어)",
        "단점: 어휘가 계속 늘면 주기적으로 **전체 재해싱** 필요",
      ],
    },
    {
      title: "트리 · 이진 트리 · B-tree",
      en: "Trees · Binary tree · B-tree",
      lines: [
        "트리는 **접두사 문제**를 푼다(automat로 시작하는 모든 용어 찾기)",
        "가장 단순한 트리: **이진 트리** — 그림: Root → a-m / n-z, a-m → a-hu / hy-m, n-z → n-sh / si-z, … 잎에 aardvark, huygens, sickle, zygot",
        "탐색은 해시보다 약간 느림: **O(log M)**, M = 어휘 크기",
        "O(log M)은 **균형 트리**에서만 성립",
        "이진 트리의 **재균형은 비쌈**",
        "**B-tree**가 재균형 문제를 완화",
        "B-tree 정의: 모든 내부 노드의 자식 수가 구간 **[a, b]** 안에 있음 (a, b는 적절한 양의 정수, 예 [2, 4]) — 그림: 루트 아래 자식 3개, 각자 2·2·4개의 자식",
      ],
    },
    {
      title: "와일드카드 질의",
      en: "Wildcard queries",
      lines: [
        "`mon*`: mon으로 시작하는 용어를 포함한 모든 문서",
        "B-tree 사전으로 쉬움: 범위 **mon ≤ t < moo**의 모든 용어 t를 꺼냄",
        "`*mon`: mon으로 끝나는 용어를 포함한 모든 문서",
        "용어를 **거꾸로** 저장한 트리를 추가로 유지",
        "그다음 범위 **nom ≤ t < non**의 모든 용어를 꺼냄",
        "결과: 와일드카드 질의에 맞는 **용어 집합**",
        "그다음 이 용어 중 아무거나 포함한 문서를 찾음",
      ],
    },
    {
      title: "용어 가운데의 *",
      en: "How to handle * in the middle of a term",
      lines: [
        "예: `m*nchen`",
        "B-tree에서 `m*`와 `*nchen`을 찾아 두 용어 집합을 교집합할 수도 있다",
        "**비쌈**",
        "대안: **permuterm 색인**",
        "기본 아이디어: 모든 와일드카드 질의를 **회전**해 `*`가 **끝에** 오게",
        "이 회전들을 모두 사전(예: B-tree)에 저장",
      ],
    },
    {
      title: "Permuterm 색인",
      en: "Permuterm index",
      lines: [
        "용어 HELLO: **hello$, ello$h, llo$he, lo$hel, o$hell, $hello**를 B-tree에 추가 ($는 특수 기호)",
        "Permuterm → term 매핑: hello$, ello$h, llo$he, lo$hel, … 가 모두 **hello**를 가리킴",
        "질의: X → `X$` 찾기 / `X*` → `$X*` / `*X` → `X$*` / `*X*` → `X*` / `X*Y` → `Y$X*`",
        "예: `hel*o` → `o$hel*` 찾기",
        "permuterm tree라고 부르는 게 낫겠지만, permuterm index가 더 흔한 이름",
      ],
    },
    {
      title: "Permuterm 색인 조회 처리",
      en: "Processing a lookup in the permuterm index",
      lines: [
        "질의 와일드카드를 오른쪽으로 회전",
        "이전처럼 B-tree 조회",
        "문제: permuterm은 일반 B-tree 대비 사전 크기를 **4배 넘게** 늘린다 (경험적 수치)",
      ],
    },
    {
      title: "k-gram 색인",
      en: "k-gram indexes",
      lines: [
        "permuterm 색인보다 **공간 효율적**",
        "용어에 나타나는 모든 문자 k-gram(**k글자의 연속열**)을 열거",
        "2-gram은 **bigram**이라 부름",
        "예: April is the cruelest month → $a ap pr ri il l$ $i is s$ $t th he e$ $c cr ru ue el le es st t$ $m mo on nt th h$",
        "$는 이전처럼 특수 단어 경계 기호",
        "bigram → 그 bigram을 포함한 **용어**로 가는 역색인을 유지",
        "3-gram 색인의 포스팅 예: etr → beetroot → metric → petrify → retrieval",
        "이제 **두 종류의 역색인**: 용어로 된 질의로 **문서**를 찾는 용어-문서 역색인 / k-gram으로 된 질의로 **용어**를 찾는 k-gram 색인",
      ],
    },
    {
      title: "bigram 색인으로 와일드카드 처리",
      en: "Processing wildcarded terms in a bigram index",
      lines: [
        "`mon*`은 이제 **$m and mo and on**으로 실행",
        "mon으로 시작하는 모든 용어를 얻지만 …",
        "… **moon** 같은 '거짓 양성'도 많이 나온다",
        "이 용어들을 질의와 다시 대조하는 **후처리 필터링** 필요",
        "살아남은 용어로 용어-문서 역색인을 조회",
        "k-gram 색인 vs permuterm 색인: k-gram 색인이 **공간 효율적** / permuterm 색인은 **후처리 필터링이 필요 없다**",
      ],
    },
    {
      title: "연습: Google과 와일드카드",
      en: "Exercise",
      lines: [
        "Google은 와일드카드 질의를 매우 제한적으로 지원",
        "예: [gen* universit*]는 Google에서 잘 안 됨 — 의도: 제네바 대학을 찾는데 프랑스어 'university'와 'Geneva'의 악센트를 모름",
        "Google 검색 기초(2010-04-29): '`*` 연산자는 단어의 일부가 아니라 **단어 전체**에만 동작한다'",
        "하지만 완전히 맞지는 않다 — [pythag*]와 [m*nchen]을 해 보라",
        "연습: Google은 왜 와일드카드 질의를 완전히 지원하지 않을까?",
      ],
    },
    {
      title: "용어-문서 색인에서 와일드카드 질의 처리",
      en: "Processing wildcard queries in the term-document index",
      lines: [
        "문제 1: 잠재적으로 **많은 불리언 질의**를 실행해야 함",
        "가장 직관적인 의미: **선언(OR)들의 연언(AND)**",
        "[gen* universit*]: geneva university or geneva université or genève university or genève université or general universities or …",
        "**매우 비쌈**",
        "문제 2: **사용자는 타이핑을 싫어한다**",
        "[pythagoras' theorem] 대신 [pyth* theo*] 같은 줄임 질의를 허용하면 사용자는 많이 쓸 것",
        "질의 응답 비용이 크게 늘어남",
        "**Google Suggest**로 다소 완화",
      ],
    },
    {
      title: "편집 거리",
      en: "Edit distance",
      lines: [
        "문자열 s1과 s2의 **편집 거리** = s1을 s2로 바꾸는 기본 연산의 **최소 횟수**",
        "**Levenshtein 거리**: 허용되는 기본 연산은 **삽입, 삭제, 치환**",
        "Levenshtein dog-do: 1 / cat-cart: 1 / cat-cut: 1 / cat-act: 2",
        "**Damerau-Levenshtein** cat-act: 1",
        "Damerau-Levenshtein은 **전치(transposition)**를 네 번째 연산으로 포함",
      ],
    },
    {
      title: "Levenshtein 거리: 계산과 알고리즘",
      en: "Levenshtein distance: Computation · Algorithm",
      lines: [
        "연산: 삽입(비용 1), 삭제(비용 1), 치환(비용 1), **복사(비용 0)**",
        "cats → fast 표 (행 c a t s / 열 f a s t): 0행 0 1 2 3 4 / c 1 1 2 3 4 / a 2 2 1 2 3 / t 3 3 2 2 2 / s 4 4 3 2 3 → **거리 3**",
        "확장 표에선 칸마다 네 값: 왼쪽 위 = 왼쪽 위 이웃에서 오는 비용(복사 또는 치환), 오른쪽 위 = 위 이웃에서(삭제), 왼쪽 아래 = 왼쪽 이웃에서(삽입), 오른쪽 아래 = 세 가지 이동 중 **최솟값**(가장 싸게 오는 길)",
      ],
      code: `LevenshteinDistance(s1, s2)
 1 for i ← 0 to |s1|
 2 do m[i, 0] = i
 3 for j ← 0 to |s2|
 4 do m[0, j] = j
 5 for i ← 1 to |s1|
 6 do for j ← 1 to |s2|
 7    do if s1[i] = s2[j]
 8         then m[i,j] = min{m[i-1,j]+1, m[i,j-1]+1, m[i-1,j-1]}
 9         else m[i,j] = min{m[i-1,j]+1, m[i,j-1]+1, m[i-1,j-1]+1}
10 return m[|s1|, |s2|]`,
    },
    {
      title: "동적 계획법 (Cormen et al.)",
      en: "Dynamic programming",
      lines: [
        "**최적 부분 구조**: 문제의 최적해는 그 안에 부분 문제의 최적해를 포함한다",
        "**겹치는 부분 해**: 부분 해들이 겹친다 — 무차별 대입 알고리즘이면 전체 최적해를 구하며 같은 부분 해를 계속 다시 계산",
        "편집 거리의 부분 문제: **두 접두사의 편집 거리**",
        "겹치는 부분 해: 대부분의 접두사 거리를 **3번** 쓴다 — 오른쪽, 대각선, 아래로 이동할 때",
      ],
    },
    {
      title: "가중 편집 거리",
      en: "Weighted edit distance",
      lines: [
        "위와 같지만 연산의 가중치가 **관련된 문자에 따라** 달라짐",
        "키보드 오류를 잡으려는 것 — m은 q보다 n으로 잘못 칠 가능성이 높다",
        "그래서 m을 n으로 치환하는 편집 거리가 q로 치환하는 것보다 **작다**",
        "입력으로 **가중치 행렬**이 필요",
        "가중치를 다루도록 동적 계획법을 수정",
      ],
    },
    {
      title: "편집 거리로 철자 교정",
      en: "Using edit distance for spelling correction",
      lines: [
        "질의가 주어지면, 먼저 미리 정한 (가중) 편집 거리 이내의 모든 문자열을 열거",
        "이 집합과 '올바른' 단어 목록의 **교집합**",
        "교집합의 용어를 사용자에게 **제안**",
      ],
    },
    {
      title: "연습: oslo → snow, cat → catcat",
      en: "Exercise",
      lines: [
        "① oslo – snow의 Levenshtein 거리 행렬을 계산하라 ② cat을 catcat으로 바꾸는 Levenshtein 편집 연산은?",
        "oslo → snow 최종 행렬(각 칸의 최솟값): o 1 1 2 3 / s 1 2 2 3 / l 2 2 3 3 / o 3 3 2 3 → **거리 3** (마지막 칸)",
        "편집 연산 읽어내기(오른쪽 아래에서 거슬러): 비용 1 **삭제** o → * / 0 (복사) s → s / 1 **치환** l → n / 0 (복사) o → o / 1 **삽입** * → w → 합 3",
        "cat → catcat: 거리 **3** — 같은 비용의 정렬이 여러 개",
        "· 삽입 c, a, t 후 c, a, t 복사 (앞에 cat 추가)",
        "· c 복사 후 a, t, c 삽입, a, t 복사",
        "· c, a 복사 후 t, c, a 삽입, t 복사",
        "· c, a, t 복사 후 c, a, t 삽입 (뒤에 cat 추가)",
      ],
      table: {
        title: "oslo → snow 편집 연산",
        headers: ["cost", "operation", "input", "output"],
        rows: [
          ["1", "delete", "o", "*"],
          ["0", "(copy)", "s", "s"],
          ["1", "replace", "l", "n"],
          ["0", "(copy)", "o", "o"],
          ["1", "insert", "*", "w"],
        ],
      },
    },
    {
      title: "철자 교정",
      en: "Spelling correction",
      lines: [
        "두 가지 주된 용도: **색인할 문서 교정**, **사용자 질의 교정**",
        "두 가지 방법:",
        "· **고립어 철자 교정**: 각 단어를 따로 오타 검사 — 올바른 철자의 다른 단어가 되는 오타는 못 잡음(예: an asteroid that fell **form** the sky)",
        "· **문맥 기반 철자 교정**: 주변 단어를 봄 — 위의 form/from 오류를 고칠 수 있음",
      ],
    },
    {
      title: "문서 교정",
      en: "Correcting documents",
      lines: [
        "이 수업은 문서의 대화형 철자 교정(MS Word 등)에 관심 없음",
        "IR에서 문서 교정은 주로 **OCR된 문서**에 쓴다 (OCR = 광학 문자 인식)",
        "IR의 일반 철학: **문서를 바꾸지 말라**",
      ],
    },
    {
      title: "질의 교정",
      en: "Correcting queries",
      lines: [
        "먼저: 고립어 철자 교정",
        "전제 1: 올바른 철자가 나오는 **'올바른 단어' 목록**이 있다",
        "전제 2: 오타 단어와 올바른 단어 사이의 **거리를 계산**할 방법이 있다",
        "단순한 철자 교정 알고리즘: 오타 단어와 **거리가 가장 작은** '올바른' 단어를 반환",
        "예: informaton → information",
        "올바른 단어 목록으로 컬렉션에 나오는 모든 단어의 어휘를 쓸 수 있다 — 왜 문제일까? (컬렉션 속 오타도 '올바른 단어'로 들어감)",
        "용어 어휘 대신: **표준 사전**(Webster's, OED 등) / **산업별 사전**(전문 IR 시스템용) / 컬렉션의 용어 어휘를 **적절히 가중**",
        "오타와 '올바른' 단어 사이의 거리 후보: 편집 거리·Levenshtein 거리 / 가중 편집 거리 / **k-gram 겹침**",
        "다음 내용: k-gram 색인으로 고립어 교정, 문맥 기반 철자 교정, 일반 이슈",
      ],
    },
    {
      title: "k-gram 색인으로 철자 교정",
      en: "k-gram indexes for spelling correction",
      lines: [
        "질의어의 모든 k-gram을 열거",
        "예: bigram 색인, 오타 **bordroom** → bigram: bo, or, rd, dr, ro, oo, om",
        "k-gram 색인으로 질의어의 k-gram에 맞는 '올바른' 단어를 찾음",
        "**맞는 k-gram 수**로 임계값 — 예: 최대 3개 k-gram만 다른 어휘 용어",
        "bo → aboard → about → boardroom → border / or → border → lord → morbid → sordid / rd → aboard → ardent → boardroom → border",
      ],
    },
    {
      title: "문맥 기반 철자 교정",
      en: "Context-sensitive spelling correction",
      lines: [
        "예: an asteroid that fell form the sky — 여기서 form을 어떻게 고칠까?",
        "아이디어 하나: **히트 기반** 철자 교정",
        "각 질의어에 가까운 '올바른' 용어를 찾음 — flew form munich: flew → flea, form → from, munich → munch",
        "한 번에 **한 단어만 '고친'** 모든 구를 질의로 시도: \"flea form munich\" / \"flew from munich\" / \"flew form munch\"",
        "올바른 질의 \"flew from munich\"가 **히트가 가장 많다**",
        "flew 후보 7개, form 20개, munich 3개면 '교정된' 구를 몇 개나 열거할까?",
        "이 '히트 기반' 알고리즘은 **그리 효율적이지 않다**",
        "더 효율적인 대안: 문서가 아니라 **질의의 '컬렉션'(질의 로그)**을 본다",
      ],
    },
    {
      title: "철자 교정의 일반 이슈",
      en: "General issues in spelling correction",
      lines: [
        "UI: **자동 교정 vs 제안** / 'Did you mean'은 제안이 하나일 때만 / 가능한 교정이 여러 개면? / 단순한 UI vs 강력한 UI의 트레이드오프",
        "비용: 철자 교정은 잠재적으로 **비싸다** / 모든 질의에 돌리지 말까? / 매치되는 문서가 **적은 질의**에만?",
        "추측: 대형 검색 엔진의 철자 교정은 **모든 질의에 돌릴 만큼** 효율적",
      ],
    },
    {
      title: "연습: Peter Norvig의 철자 교정기",
      en: "Exercise: Understand Peter Norvig's spelling corrector",
      lines: [
        "words: 텍스트를 소문자 알파벳 단어로 / train: 단어 빈도 모델(기본값 1) / NWORDS = big.txt로 학습",
        "edits1(word): 편집 거리 1인 모든 후보 — **삭제, 전치, 치환, 삽입**",
        "known_edits2(word): 편집 거리 2 후보 중 알려진 단어만",
        "correct(word): 후보 = 알려진 원래 단어 → 없으면 거리 1 알려진 단어 → 없으면 거리 2 → 없으면 원래 단어, 그중 **빈도가 가장 높은** 것 반환",
      ],
      code: `def edits1(word):
   splits     = [(word[:i], word[i:]) for i in range(len(word) + 1)]
   deletes    = [a + b[1:] for a, b in splits if b]
   transposes = [a + b[1] + b[0] + b[2:] for a, b in splits if len(b) > 1]
   replaces   = [a + c + b[1:] for a, b in splits for c in alphabet if b]
   inserts    = [a + c + b     for a, b in splits for c in alphabet]
   return set(deletes + transposes + replaces + inserts)

def correct(word):
   candidates = known([word]) or known(edits1(word)) or known_edits2(word) or [word]
   return max(candidates, key=NWORDS.get)`,
    },
    {
      title: "Soundex",
      en: "Soundex",
      lines: [
        "Soundex는 철자(orthographic)가 아니라 **발음(phonetic)** 대안을 찾는 기반",
        "예: chebyshev / tchebyscheff",
        "알고리즘: 색인할 모든 토큰을 **4글자 축약형**으로 바꿈 → 질의어도 똑같이 → 축약형으로 색인을 만들고 검색",
      ],
    },
    {
      title: "Soundex 알고리즘",
      en: "Soundex algorithm",
      lines: [
        "① 용어의 **첫 글자는 유지**",
        "② A, E, I, O, U, H, W, Y는 모두 **'0'**으로",
        "③ 글자를 숫자로: B, F, P, V → 1 / C, G, J, K, Q, S, X, Z → 2 / D, T → 3 / L → 4 / M, N → 5 / R → 6",
        "④ 연속된 같은 숫자 쌍에서 하나를 제거하기를 반복",
        "⑤ 결과 문자열에서 0을 모두 지우고, 뒤에 0을 채워 **앞 네 자리**(글자 하나 + 숫자 셋) 반환",
        "예 HERMAN: H 유지 → ERMAN → 0RM0N → 06505 → 06505 → 655 → **H655** (HERMANN도 같은 코드)",
        "얼마나 유용한가? IR에는 **별로** / 다른 응용의 '높은 재현율' 작업엔 괜찮음(예: **Interpol**) / Zobel and Dart(1996)가 IR용으로 더 나은 발음 매칭 제안",
        "연습: 자기 성의 Soundex 코드를 구해 보라",
        "자료: IIR 3장, trie vs hash vs ternary tree, Soundex 데모, 편집 거리 데모, Norvig의 철자 교정기, Google: 와일드카드 검색, 잘못된 철자 교정, 올바른 철자보다 더 흔한 오타",
      ],
    },
  ],

  const: [
    {
      title: "목차와 Recap",
      en: "Overview · Recap",
      lines: [
        "목차: ① Recap ② Introduction ③ BSBI algorithm ④ SPIMI algorithm ⑤ Distributed indexing ⑥ Dynamic indexing",
        "Recap: 고정 폭 항목 배열로서의 사전(20 + 4 + 4바이트), 배열 항목을 찾는 B-tree",
        "Recap: permuterm 색인 질의(X → X$, `X*` → `X*$`로 적힌 슬라이드도 있지만 IIR 3의 정식 표는 `$X*`, `*X` → `X$*`, `*X*` → `X*`, `X*Y` → `Y$X*`)",
        "Recap: bordroom의 bigram 철자 교정, Levenshtein 알고리즘(삽입·삭제·치환·복사), Norvig의 교정기",
      ],
    },
    {
      title: "Take-away",
      lines: [
        "두 가지 색인 구축 알고리즘: **BSBI**(단순)와 **SPIMI**(더 현실적)",
        "분산 색인 구축: **MapReduce**",
        "동적 색인 구축: 컬렉션이 바뀔 때 색인을 최신으로 유지하는 법",
      ],
    },
    {
      title: "하드웨어 기초",
      en: "Hardware basics",
      lines: [
        "정보검색의 많은 설계 결정은 **하드웨어 제약**에 기반한다",
        "이 수업에 필요한 하드웨어 기초부터 복습",
        "메모리의 데이터 접근이 디스크보다 훨씬 빠르다 (교안: 대략 10배)",
        "디스크 탐색은 '유휴' 시간: 디스크 헤드가 자리 잡는 동안 데이터 전송 없음",
        "디스크 → 메모리 전송을 최적화하려면: **큰 덩어리 하나가 작은 덩어리 여러 개보다 빠르다**",
        "디스크 I/O는 **블록 기반**: 블록 전체를 읽고 씀(작은 단위가 아님), 블록 크기 **8KB ~ 256KB**",
        "IR 시스템 서버는 보통 수 GB 메인 메모리와 TB 단위 디스크",
        "장애 허용은 비싸다: 장애 허용 기계 한 대보다 **일반 기계 여러 대**가 싸다",
      ],
      table: {
        title: "통계 (2008년경)",
        headers: ["기호", "통계", "값"],
        rows: [
          ["s", "average seek time", "5 ms = 5 × 10⁻³ s"],
          ["b", "transfer time per byte", "0.02 µs = 2 × 10⁻⁸ s"],
          ["", "processor's clock rate", "10⁹ s⁻¹"],
          ["p", "lowlevel operation (e.g., compare & swap a word)", "0.01 µs = 10⁻⁸ s"],
          ["", "size of main memory", "several GB"],
          ["", "size of disk space", "1 TB or more"],
        ],
      },
    },
    {
      title: "RCV1 컬렉션",
      en: "RCV1 collection",
      lines: [
        "셰익스피어 전집은 이 수업의 많은 요점을 보이기에 **충분히 크지 않다**",
        "확장 가능한 색인 구축 알고리즘의 예로 **Reuters RCV1** 컬렉션을 쓴다",
        "1995년과 1996년(1년간)에 전송된 영어 뉴스 기사",
        "RCV1 문서 예: REUTERS 'Extreme conditions create rare Antarctic clouds' (Tue Aug 1, 2006) — SYDNEY (Reuters) - Rare, mother-of-pearl colored clouds …",
        "연습: 용어의 평균 빈도(토큰 몇 개)? 토큰당 4.5바이트 vs 타입당 7.5바이트 — 왜 다른가? 위치 포스팅은 몇 개?",
        "풀이: 토큰 = 800,000 × 200 = 1.6억 → 용어당 평균 **400개** / 짧은 단어(the, of, a)가 토큰으로 매우 자주 나와 토큰 평균 길이가 짧음 / 위치 포스팅 ≈ 토큰 수 **1.6억**",
      ],
      table: {
        title: "Reuters RCV1 statistics",
        headers: ["", "", "value"],
        rows: [
          ["N", "documents", "800,000"],
          ["L", "tokens per document", "200"],
          ["M", "terms (= word types)", "400,000"],
          ["", "bytes per token (incl. spaces/punct.)", "6"],
          ["", "bytes per token (without spaces/punct.)", "4.5"],
          ["", "bytes per term (= word type)", "7.5"],
          ["T", "non-positional postings", "100,000,000"],
        ],
      },
    },
    {
      title: "목표: 역색인 구축 · IIR 1의 메모리 내 정렬",
      en: "Goal · Index construction in IIR 1",
      lines: [
        "목표: dictionary → postings 형태의 역색인 (Brutus, Caesar, Calpurnia …)",
        "IIR 1의 색인 구축: 메모리에서 (term, docID) 쌍을 정렬",
        "연습: 이 알고리즘은 왜 아주 큰 컬렉션으로 확장되지 않을까? (전부 메모리에 못 담음)",
      ],
    },
    {
      title: "정렬 기반 색인 구축",
      en: "Sort-based index construction",
      lines: [
        "색인을 만들며 문서를 하나씩 파싱한다",
        "어떤 용어든 최종 포스팅은 **끝까지 미완성**",
        "모든 포스팅을 메모리에 두고 끝에 메모리에서 정렬할 수 있나? → **큰 컬렉션에선 불가**",
        "그러므로 **중간 결과를 디스크에** 저장해야 한다",
        "같은 알고리즘을 메모리 대신 디스크로 큰 컬렉션에 쓸 수 있나? → 아니다: 아주 큰 레코드 집합을 디스크에서 정렬하면 **너무 느리다 — 디스크 탐색이 너무 많음**",
        "**외부 정렬 알고리즘**이 필요",
      ],
    },
    {
      title: "'외부' 정렬 알고리즘 (디스크 탐색을 적게)",
      en: "External sorting algorithm",
      lines: [
        "T = 100,000,000개의 비위치 포스팅을 정렬해야 함",
        "포스팅 하나 크기 **12바이트** (4 + 4 + 4: termID, docID, term frequency)",
        "블록 = 이런 포스팅 **10,000,000**개",
        "그만큼은 메모리에 쉽게 들어감",
        "RCV1엔 이런 블록이 **10개**",
        "기본 아이디어: 블록마다 (i) 포스팅 모으기 (ii) **메모리에서 정렬** (iii) 디스크에 쓰기",
        "그다음 블록들을 **병합**해 하나의 긴 정렬 순서로",
        "두 블록 병합 예: Block 1 (brutus d3, caesar d4, noble d3, with d4) + Block 2 (brutus d2, caesar d1, julius d1, killed d2) → 병합된 포스팅 brutus d2, brutus d3, caesar d1, caesar d4, julius d1, killed d2, noble d3, with d4 (디스크에)",
      ],
      code: `BSBIndexConstruction()
1 n ← 0
2 while (all documents have not been processed)
3 do n ← n + 1
4    block ← ParseNextBlock()
5    BSBI-Invert(block)
6    WriteBlockToDisk(block, f_n)
7 MergeBlocks(f_1, …, f_n; f_merged)`,
    },
    {
      title: "정렬 기반 알고리즘의 문제",
      en: "Problem with sort-based algorithm",
      lines: [
        "가정: 사전을 **메모리에 둘 수 있다**",
        "term → termID 매핑을 구현하려면 (동적으로 커지는) 사전이 필요",
        "사실 termID 대신 (term, docID) 포스팅으로 작업할 수도 있다 …",
        "… 하지만 그러면 **중간 파일이 매우 커진다** (확장 가능하지만 매우 느린 색인 구축 방법이 됨)",
      ],
    },
    {
      title: "단일 패스 메모리 내 색인 (SPIMI)",
      en: "Single-pass in-memory indexing",
      lines: [
        "약어: **SPIMI**",
        "핵심 아이디어 1: **블록마다 별도의 사전** 생성 — 블록 간 term-termID 매핑을 유지할 필요 없음",
        "핵심 아이디어 2: **정렬하지 말라.** 포스팅이 나오는 대로 포스팅 리스트에 누적",
        "이 두 아이디어로 블록마다 **완전한 역색인**을 만들 수 있다",
        "이 개별 색인들을 하나의 큰 색인으로 병합",
        "블록 병합은 BSBI와 비슷",
        "SPIMI와 압축: 압축으로 SPIMI가 더 효율적 — 용어 압축, 포스팅 압축 (다음 강의)",
      ],
      code: `SPIMI-Invert(token_stream)
 1 output_file ← NewFile()
 2 dictionary ← NewHash()
 3 while (free memory available)
 4 do token ← next(token_stream)
 5    if term(token) ∉ dictionary
 6      then postings_list ← AddToDictionary(dictionary, term(token))
 7      else postings_list ← GetPostingsList(dictionary, term(token))
 8    if full(postings_list)
 9      then postings_list ← DoublePostingsList(dictionary, term(token))
10    AddToPostingsList(postings_list, docID(token))
11 sorted_terms ← SortTerms(dictionary)
12 WriteBlockToDisk(sorted_terms, dictionary, output_file)
13 return output_file`,
    },
    {
      title: "분산 색인",
      en: "Distributed indexing",
      lines: [
        "웹 규모 색인(집에서 따라 하지 말 것!): **분산 컴퓨터 클러스터**를 써야 함",
        "개별 기계는 고장 나기 쉽다 — 예측 불가능하게 느려지거나 멈춤",
        "이런 기계 풀을 어떻게 활용할까?",
      ],
    },
    {
      title: "Google 데이터센터 (2007 추정, Gartner)",
      en: "Google data centers",
      lines: [
        "Google 데이터센터는 주로 **상용(commodity) 기계**",
        "데이터센터는 전 세계에 분산",
        "서버 100만 대, 프로세서/코어 300만 개",
        "Google은 **분기마다 서버 10만 대** 설치",
        "연간 2~2.5억 달러 지출 기준",
        "세계 컴퓨팅 용량의 10%에 해당!",
        "노드 1000개인 비장애허용 시스템에서 각 노드 가동률이 99.9%면 시스템 가동률은? (고장을 허용 못 한다고 가정) → 답: **37%** (0.999¹⁰⁰⁰ ≈ 0.368)",
        "서버가 3년 뒤 고장 난다면, 서버 100만 대 설치에서 기계 고장 간격은? → 답: **2분 미만** (3년 ≈ 158만 분 ÷ 100만 ≈ 1.6분)",
      ],
    },
    {
      title: "분산 색인: 마스터와 병렬 작업",
      en: "Distributed indexing · Parallel tasks",
      lines: [
        "색인 작업을 지휘하는 **마스터** 기계 유지 — '안전하다'고 간주",
        "색인을 **병렬 작업** 집합으로 나눔",
        "마스터가 각 작업을 풀의 **놀고 있는 기계**에 배정",
        "두 종류의 병렬 작업과 두 종류의 기계: **파서(Parsers)**, **인버터(Inverters)**",
        "입력 문서 컬렉션을 **split**으로 나눔 (BSBI/SPIMI의 블록에 해당)",
        "각 split은 문서의 부분집합",
      ],
    },
    {
      title: "파서와 인버터",
      en: "Parsers · Inverters",
      lines: [
        "파서: 마스터가 split을 놀고 있는 파서 기계에 배정",
        "파서는 문서를 하나씩 읽어 **(term, docID) 쌍**을 내보냄",
        "파서는 쌍을 **j개의 용어 구간(term-partition)**에 씀 — 각 구간은 용어 첫 글자의 범위, 예: a-f, g-p, q-z (여기서 j = 3)",
        "인버터: 한 용어 구간(예: a-f)의 모든 (term, docID) 쌍(= 포스팅)을 수집",
        "정렬해서 포스팅 리스트로 씀",
        "자료 흐름: splits → (master assign) parser → a-f g-p q-z 세그먼트 파일 → (master assign) inverter a-f / g-p / q-z → postings — **map phase** / segment files / **reduce phase**",
      ],
    },
    {
      title: "MapReduce",
      en: "MapReduce",
      lines: [
        "방금 설명한 색인 구축 알고리즘은 **MapReduce의 한 사례**",
        "MapReduce는 분산 계산을 위한 **견고하고 개념적으로 단순한** 프레임워크 …",
        "… 분산 부분의 코드를 직접 쓸 필요 없이",
        "Google 색인 시스템(2002년경)은 여러 단계로 이루어졌고 **각 단계가 MapReduce로 구현**",
        "색인 구축은 그중 한 단계",
        "또 다른 단계: **용어 분할 색인 → 문서 분할 색인**으로 변환",
        "왜 문서 분할 색인이 더 나을 수 있을까?",
      ],
      table: {
        title: "MapReduce에서의 색인 구축",
        headers: ["", "스키마", "색인 구축에서"],
        rows: [
          ["map", "input → list(k, v)", "web collection → list(termID, docID)"],
          ["reduce", "(k, list(v)) → output", "(⟨termID1, list(docID)⟩, ⟨termID2, list(docID)⟩, …) → (postings list1, postings list2, …)"],
        ],
      },
    },
    {
      title: "MapReduce 색인 구축 예",
      en: "Example for index construction",
      lines: [
        "map: d2 : C died. d1 : C came, C c'ed. → (⟨C, d2⟩, ⟨died, d2⟩, ⟨C, d1⟩, ⟨came, d1⟩, ⟨C, d1⟩, ⟨c'ed, d1⟩)",
        "reduce: (⟨C, (d2, d1, d1)⟩, ⟨died, (d2)⟩, ⟨came, (d1)⟩, ⟨c'ed, (d1)⟩) → (⟨C, (d1:2, d2:1)⟩, ⟨died, (d2:1)⟩, ⟨came, (d1:1)⟩, ⟨c'ed, (d1:1)⟩)",
        "연습: 마스터가 파서에게 주는 작업 설명엔 어떤 정보가? 파서는 완료 후 마스터에게 무엇을 보고? 인버터에게 주는 작업 설명은? 인버터가 보고하는 것은?",
      ],
    },
    {
      title: "동적 색인",
      en: "Dynamic indexing",
      lines: [
        "지금까지 컬렉션이 **정적**이라고 가정",
        "실제로는 드물다: 문서가 **삽입, 삭제, 수정**된다",
        "그러면 사전과 포스팅 리스트도 동적으로 수정되어야 한다",
        "가장 단순한 방법: 디스크에 **큰 주 색인** 유지 / 새 문서는 메모리의 **작은 보조 색인**에 / **둘 다 검색**해 결과 병합 / 주기적으로 보조 색인을 큰 색인에 병합",
        "삭제: 삭제된 문서용 **무효화 비트 벡터** → 색인이 반환한 문서를 이 비트 벡터로 걸러 냄",
        "보조·주 색인의 문제: **잦은 병합**, 병합 중 **검색 성능 저하**",
      ],
    },
    {
      title: "로그 병합",
      en: "Logarithmic merge",
      lines: [
        "로그 병합은 색인 병합 비용을 시간에 걸쳐 **분할 상환** → 사용자는 응답 시간에서 더 작은 영향을 봄",
        "각각 **이전 것의 두 배 크기**인 색인 시리즈를 유지",
        "가장 작은 것(Z₀)은 **메모리**에",
        "더 큰 것(I₀, I₁, …)은 **디스크**에",
        "Z₀가 너무 커지면(> n) 디스크에 I₀로 쓰거나 …",
        "… (I₀가 이미 있으면) I₀와 병합해 I₁로 쓰는 식",
        "이진수 I₃I₂I₁I₀ = 2³2²2¹2⁰: 0001, 0010, 0011, 0100, 0101, 0110, 0111, 1000, 1001, 1010, 1011, 1100 — 이진수 카운터처럼 변함",
        "색인 수는 **O(log T)**로 제한 (T = 지금까지 읽은 포스팅 총수)",
        "그래서 질의 처리 땐 O(log T)개 색인을 병합해야 함",
        "색인 구축 시간 복잡도 **O(T log T)** … 각 T개 포스팅이 O(log T)번 병합되므로",
        "보조 색인: 병합마다 모든 포스팅을 건드리므로 구축 시간 **O(T²)** — 보조 색인 크기 a면 a + 2a + 3a + 4a + … + na = a·n(n+1)/2 = O(n²)",
        "그래서 로그 병합이 **한 차수 더 효율적**",
      ],
      code: `LMergeAddToken(indexes, Z0, token)
 1 Z0 ← Merge(Z0, {token})
 2 if |Z0| = n
 3   then for i ← 0 to ∞
 4        do if Ii ∈ indexes
 5             then Z(i+1) ← Merge(Ii, Zi)
 6                  (Z(i+1) is a temporary index on disk.)
 7                  indexes ← indexes − {Ii}
 8             else Ii ← Zi   (Zi becomes the permanent index Ii.)
 9                  indexes ← indexes ∪ {Ii}
10                  Break
11        Z0 ← ∅

LogarithmicMerge()
1 Z0 ← ∅   (Z0 is the in-memory index.)
2 indexes ← ∅
3 while true
4 do LMergeAddToken(indexes, Z0, getNextToken())`,
    },
    {
      title: "대형 검색 엔진의 동적 색인 · 위치 색인 구축",
      en: "Dynamic indexing at large search engines",
      lines: [
        "보통 **조합**: 잦은 점진적 변경 / 색인의 큰 부분을 **교체(rotation)**해 갈아 끼우기 / 가끔 **전체 재구축**(규모가 커질수록 어려워짐 — Google이 전체 재구축을 할 수 있는지 불분명)",
        "위치 색인 구축: 기본적으로 같은 문제, 다만 **중간 자료구조가 크다**",
        "자료: IIR 4장, MapReduce 원 논문 Dean and Ghemawat (2004), SPIMI 원 논문 Heinz and Zobel (2003), YouTube: Google 데이터센터",
      ],
    },
  ],
};
