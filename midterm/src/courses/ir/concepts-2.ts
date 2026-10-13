import type { Concept } from "@/lib/types";

/* IIR 3 · IIR 4 */
export const CONCEPTS_2: Concept[] = [
  // ── dict ─────────────────────────────────────────
  {
    id: "dictionary",
    chapter: "dict",
    title: "사전: 용어 어휘를 담는 자료구조",
    en: "Dictionary as a Data Structure",
    importance: "high",
    summary:
      "**용어 어휘(term vocabulary)**는 데이터이고, **사전(dictionary)**은 그 어휘를 저장하는 **자료구조**다. 용어마다 **문서 빈도**와 **포스팅 리스트 포인터** 등을 저장하며, 우선 **고정 폭 항목의 배열**로 둔다고 가정한다. 질의 시점에 질의어가 배열의 어느 행에 있는지 찾는 데 **해시**나 **트리**를 쓴다.",
    points: [
      "고정 폭 배열: term 20바이트 + document frequency 4바이트 + pointer to postings list 4바이트 (예: a 656,265 / aachen 65 / … / zulu 221)",
      "Reuters에선 (20 + 4 + 4) × 400,000 = **11.2MB** (IIR 5에서 압축)",
      "이 강의의 주제 = **허용 검색(tolerant retrieval)**: 질의어와 문서 용어가 정확히 일치하지 않을 때 — 와일드카드 질의, 철자 교정",
    ],
    easy: "어휘(단어 목록)가 '책 내용'이라면 사전은 '책꽂이'. 같은 단어 목록이라도 어떤 책꽂이에 꽂느냐에 따라 찾는 속도가 다르다.",
    exam: "term vocabulary(데이터) vs dictionary(자료구조) 구분, 고정 폭 항목의 바이트 구성.",
  },
  {
    id: "hash-tree",
    chapter: "dict",
    title: "해시 vs 트리 (B-tree)",
    en: "Hashes vs Trees",
    importance: "must",
    summary:
      "**해시**는 용어를 정수(배열 행 번호)로 바꿔 **상수 시간**에 찾는다 — 트리보다 빠르지만 **변형어 찾기 불가**(resume vs résumé), **접두사 검색 불가**(automat로 시작하는 모든 용어), 어휘가 계속 늘면 **주기적 재해싱**이 필요하다. **트리**는 접두사 문제를 풀지만 탐색이 **O(log M)**으로 약간 느리고, 이는 **균형 트리**에서만 성립한다.",
    points: [
      "선택 기준: 용어 수가 고정인가 계속 늘어나는가, 키별 접근 빈도는 어떤가, 용어가 몇 개쯤인가",
      "가장 단순한 트리 = 이진 트리(Root → a-m / n-z → a-hu / hy-m / n-sh / si-z …)",
      "이진 트리의 **재균형(rebalancing)은 비쌈** → **B-tree**가 완화",
      "B-tree 정의: 모든 내부 노드의 자식 수가 구간 **[a, b]** 안 (예: [2, 4])",
    ],
    table: {
      title: "해시 vs 트리",
      headers: ["", "해시", "트리 (B-tree)"],
      rows: [
        ["탐색 시간", "상수 (더 빠름)", "O(log M) — 균형일 때"],
        ["접두사 검색", "불가", "가능 (mon ≤ t < moo)"],
        ["변형어(résumé)", "불가", "—"],
        ["어휘 증가", "주기적 재해싱 필요", "B-tree가 재균형 비용 완화"],
      ],
    },
    easy: "해시 = 사물함 번호표(번호만 알면 바로 열지만 '김'씨 전부 찾기는 불가). 트리 = 가나다순 사전(조금 느리지만 '김'으로 시작하는 이름을 한 번에 훑음).",
    exam: "해시의 단점 3가지, 트리 탐색 O(log M)과 균형 조건, B-tree 자식 수 [a, b].",
  },
  {
    id: "wildcard-btree",
    chapter: "dict",
    title: "와일드카드 질의와 B-tree",
    en: "Wildcard Queries with B-trees",
    importance: "must",
    summary:
      "`mon*`(mon으로 시작)은 B-tree 사전에서 범위 **mon ≤ t < moo**의 용어를 모두 꺼내면 된다. `*mon`(mon으로 끝남)은 용어를 **거꾸로 저장한 트리**를 하나 더 두고 **nom ≤ t < non** 범위를 꺼낸다. 결과는 와일드카드에 맞는 **용어 집합**이고, 그다음 그 용어 중 **아무거나** 포함한 문서를 찾는다.",
    points: [
      "가운데 `*`: `m*nchen` → `m*`와 `*nchen`을 각각 찾아 **용어 집합의 교집합** — **비쌈**",
      "대안: **permuterm 색인** — 와일드카드 질의를 회전해 `*`가 끝에 오게",
    ],
    easy: "'김*'은 가나다 사전에서 '김'부터 '깁' 직전까지 넘기면 끝. '*수'(수로 끝나는 이름)는 이름을 거꾸로 쓴 사전을 하나 더 만들어 '수'로 시작하는 걸 찾는다.",
    exam: "`mon*`의 범위(mon ≤ t < moo), `*mon`에 역방향 트리, 가운데 `*` 처리 비용.",
  },
  {
    id: "permuterm",
    chapter: "dict",
    title: "Permuterm 색인",
    en: "Permuterm Index",
    importance: "must",
    summary:
      "용어 끝에 특수 기호 **$**를 붙이고 **모든 회전**을 B-tree에 넣는다(각 회전 → 원래 용어로 매핑). 질의는 `*`가 **끝에 오도록 회전**해 B-tree 접두사 검색을 한다. 단점: 사전 크기가 일반 B-tree의 **4배 넘게** 커진다(경험치).",
    points: [
      "hello → hello$, ello$h, llo$he, lo$hel, o$hell, $hello 모두 저장 → 전부 hello를 가리킴",
      "`X` → `X$` / `X*` → `$X*` / `*X` → `X$*` / `*X*` → `X*` / `X*Y` → `Y$X*`",
      "예: `hel*o` → `o$hel*`, `m*nchen` → `nchen$m*`",
      "이름은 permuterm index지만 사실상 permuterm **tree**가 더 정확",
      "k-gram 색인과 비교: permuterm은 **후처리 필터링이 필요 없음**, 대신 공간이 큼",
    ],
    table: {
      title: "질의 → 찾을 키",
      headers: ["질의", "찾는 키"],
      rows: [
        ["X", "X$"],
        ["X*", "$X*"],
        ["*X", "X$*"],
        ["*X*", "X*"],
        ["X*Y", "Y$X*"],
      ],
    },
    flow: ["질의 끝에 $ 붙이기 (hel*o → hel*o$)", "* 가 맨 끝에 오도록 회전 (o$hel*)", "B-tree 접두사 검색", "찾은 permuterm → 원래 용어로 매핑", "그 용어들의 포스팅으로 문서 검색"],
    easy: "목걸이(단어+$)를 돌려서 모르는 구슬(*)을 항상 맨 끝에 오게 하면, 아는 구슬들로 시작하는 목걸이만 찾으면 된다.",
    exam: "`X*Y` → `Y$X*` 변환 문제 단골(`hel*o` → `o$hel*`), hello의 회전 6개, 공간 4배 이상.",
  },
  {
    id: "kgram-index",
    chapter: "dict",
    title: "k-gram 색인과 와일드카드",
    en: "k-gram Indexes for Wildcards",
    importance: "must",
    summary:
      "용어에 나타나는 **모든 k글자 연속열(k-gram)**을 열거하고, **k-gram → 그 k-gram을 포함한 용어**의 역색인을 만든다(2-gram = bigram). permuterm보다 **공간 효율적**이지만 거짓 양성 때문에 **후처리 필터링**이 필요하다.",
    points: [
      "$는 단어 경계 기호: April is the cruelest month → $a ap pr ri il l$ $i is s$ $t th he e$ $c cr ru ue el le es st t$ $m mo on nt th h$",
      "3-gram 포스팅 예: etr → beetroot, metric, petrify, retrieval",
      "두 종류의 역색인: **용어-문서 역색인**(용어로 문서 찾기) vs **k-gram 색인**(k-gram으로 용어 찾기)",
      "`mon*` → **$m AND mo AND on** → mon으로 시작하는 용어 + **moon 같은 거짓 양성** → 질의와 다시 대조(postfilter) → 살아남은 용어로 용어-문서 색인 검색",
    ],
    table: {
      title: "k-gram 색인 vs permuterm 색인",
      headers: ["", "k-gram", "permuterm"],
      rows: [
        ["공간", "더 효율적", "사전의 4배 넘게"],
        ["후처리 필터링", "필요 (moon 같은 거짓 양성)", "불필요"],
      ],
    },
    easy: "단어를 두 글자씩 잘라 '두 글자 조각 → 그 조각이 들어간 단어' 목록을 만든다. '$m·mo·on'이 다 들어간 단어를 찾으면 mon…이 나오지만, moon도 끼어들어서 한 번 더 확인해야 한다.",
    exam: "bigram 나열($ 포함), `mon*`의 불리언 분해와 moon 거짓 양성, 두 색인 비교표.",
  },
  {
    id: "wildcard-cost",
    chapter: "dict",
    title: "와일드카드 질의의 비용",
    en: "Processing Wildcard Queries in the Term-Document Index",
    importance: "normal",
    summary:
      "Google은 와일드카드를 제한적으로만 지원한다('`*`는 부분 단어가 아니라 **단어 전체**에만'). 이유: ① `[gen* universit*]`처럼 **여러 불리언 질의**(geneva university OR geneva université OR genève university OR …, 즉 **선언의 연언**)를 실행해야 해 **매우 비쌈** ② 사용자는 타이핑을 싫어해 `[pyth* theo*]`처럼 줄임 질의를 마구 쓰게 되어 비용 급증 — **Google Suggest**로 다소 완화.",
    points: [
      "그래도 `[pythag*]`·`[m*nchen]`은 어느 정도 동작함",
      "가장 직관적인 의미 = 각 와일드카드 용어의 **OR**를 **AND**로 묶은 것(conjunction of disjunctions)",
    ],
    easy: "'김*  박*' 검색은 김씨 수천 명 × 박씨 수천 명의 모든 조합을 따져야 해서 검색 엔진 입장에선 악몽이다.",
    exam: "Google이 와일드카드를 제한하는 두 가지 이유.",
  },
  {
    id: "edit-distance",
    chapter: "dict",
    title: "편집 거리 (Levenshtein · Damerau)",
    en: "Edit Distance",
    importance: "must",
    summary:
      "두 문자열 s1, s2의 **편집 거리**는 s1을 s2로 바꾸는 **기본 연산의 최소 횟수**다. **Levenshtein** 거리의 연산은 **삽입·삭제·치환**(각 비용 1, 같으면 복사 비용 0). **Damerau-Levenshtein**은 **전치(transposition)**를 네 번째 연산으로 추가한다.",
    points: [
      "dog–do: 1 / cat–cart: 1 / cat–cut: 1",
      "cat–act: Levenshtein **2**, Damerau-Levenshtein **1**(c·a 자리 바꿈)",
      "연습 답: cats–fast 3, oslo–snow 3, cat → catcat 3(삽입 3번)",
    ],
    easy: "오타를 고치는 데 필요한 '키 누름 수'. 글자 넣기·빼기·바꾸기가 각 1점, 옆 글자끼리 자리 바꾸기도 1점으로 치면 Damerau 방식.",
    exam: "두 단어의 Levenshtein 거리 계산, cat–act처럼 두 방식이 다른 경우.",
  },
  {
    id: "levenshtein-dp",
    chapter: "dict",
    title: "Levenshtein 거리 계산: 동적 계획법",
    en: "Levenshtein Distance by Dynamic Programming",
    importance: "must",
    summary:
      "표 m[i, j] = s1의 앞 i글자와 s2의 앞 j글자 사이 편집 거리. 첫 행·열은 0, 1, 2, …로 채우고, 각 칸은 세 이웃 중 최소다 — **왼쪽 위(대각선)**: 복사(같으면 +0) 또는 치환(+1), **위**: 삭제(+1), **왼쪽**: 삽입(+1). 답은 오른쪽 아래 칸 m[|s1|, |s2|].",
    points: [
      "**동적 계획법**의 두 조건(Cormen): **최적 부분 구조**(최적해가 부분 문제의 최적해를 포함), **겹치는 부분 문제**(무차별 대입이면 같은 부분 해를 반복 계산)",
      "편집 거리의 부분 문제 = 두 **접두사**의 편집 거리 / 대부분의 접두사 거리를 **3번**(오른쪽·대각선·아래로 이동할 때) 씀",
      "편집 연산 읽어내기: 오른쪽 아래에서 최소 경로를 거슬러 올라감 — oslo → snow: o 삭제(1), s 복사(0), l → n 치환(1), o 복사(0), w 삽입(1) = **3**",
      "cat → catcat: 복사 3 + 삽입 3 = 3, 삽입 위치는 여러 가지(앞에 cat, 가운데, 뒤에) — 같은 비용의 경로가 여러 개",
    ],
    code: `LevenshteinDistance(s1, s2)
  for i ← 0 to |s1| do m[i, 0] = i
  for j ← 0 to |s2| do m[0, j] = j
  for i ← 1 to |s1|
    do for j ← 1 to |s2|
      do if s1[i] = s2[j]
           then m[i,j] = min{m[i-1,j]+1, m[i,j-1]+1, m[i-1,j-1]}
           else m[i,j] = min{m[i-1,j]+1, m[i,j-1]+1, m[i-1,j-1]+1}
  return m[|s1|, |s2|]`,
    example: "cats → fast 표 (행: c a t s, 열: f a s t)\n      f  a  s  t\n   0  1  2  3  4\nc  1  1  2  3  4\na  2  2  1  2  3\nt  3  3  2  2  2\ns  4  4  3  2  3   → 거리 3",
    flow: ["0행 = 0,1,2,… / 0열 = 0,1,2,…", "칸마다 세 후보 계산: 위 +1(삭제), 왼쪽 +1(삽입), 대각선 +0/+1(복사/치환)", "세 후보 중 최솟값을 기록", "오른쪽 아래 칸 = 편집 거리", "최소 경로를 거슬러 연산 순서 복원"],
    easy: "격자 지도에서 왼쪽 위 → 오른쪽 아래로 가는 최소 비용 길 찾기. 대각선은 글자가 같으면 공짜, 아래·오른쪽은 1원.",
    exam: "표 빈칸 채우기, 세 방향의 의미(위 = 삭제, 왼쪽 = 삽입, 대각선 = 복사/치환), DP 두 조건.",
  },
  {
    id: "weighted-edit",
    chapter: "dict",
    title: "가중 편집 거리",
    en: "Weighted Edit Distance",
    importance: "normal",
    summary:
      "연산의 가중치가 **관련된 문자에 따라 달라진다**. 키보드 오타를 반영하려는 것으로, m은 q보다 n으로 잘못 칠 가능성이 높으므로 **m → n 치환이 m → q보다 거리가 작다**. 입력으로 **가중치 행렬**이 필요하고, DP를 가중치를 다루도록 고친다.",
    points: [
      "철자 교정에 쓰는 법: 질의에서 (가중) 편집 거리 기준 이내의 모든 문자열을 열거 → '올바른' 단어 목록과 교집합 → 교집합의 용어를 제안",
    ],
    easy: "키보드에서 붙어 있는 키(m·n)를 잘못 누른 건 '살짝 실수', 멀리 떨어진 키(m·q)는 '큰 실수'로 점수를 다르게 매긴다.",
    exam: "가중 편집 거리의 동기(키보드 오타), 가중치 행렬이 입력.",
  },
  {
    id: "spelling",
    chapter: "dict",
    title: "철자 교정: 용도와 두 방법",
    en: "Spelling Correction",
    importance: "must",
    summary:
      "용도는 **색인할 문서 교정**과 **사용자 질의 교정** 두 가지. 방법은 **고립어 교정**(각 단어를 따로 검사 — 'fell **form** the sky'처럼 다른 올바른 단어가 된 오타는 못 잡음)과 **문맥 기반 교정**(주변 단어를 봐서 form/from도 고침). IR에서 문서 교정은 주로 **OCR 문서**에만 쓰며, 기본 철학은 **문서를 바꾸지 말 것**.",
    points: [
      "MS Word 같은 대화형 문서 교정은 이 수업의 관심 밖",
      "질의 고립어 교정의 전제: ① '올바른 단어' 목록이 있다 ② 오타와 올바른 단어 사이 **거리**를 계산할 수 있다",
      "가장 단순한 알고리즘: 오타와 **거리가 가장 작은** 올바른 단어 반환 (informaton → information)",
      "올바른 단어 목록 후보: 표준 사전(Webster's, OED) / 산업별 사전 / **컬렉션 용어 어휘(적절히 가중)** — 어휘를 그대로 쓰면 컬렉션 안의 오타도 '올바른 단어'가 되는 문제",
      "거리 후보: 편집 거리·Levenshtein, 가중 편집 거리, **k-gram 겹침**",
      "Peter Norvig의 교정기: 편집 거리 1(삭제·전치·치환·삽입)과 2의 후보 중 **알려진 단어**를 모아 **가장 빈도 높은** 단어 선택",
    ],
    easy: "고립어 교정 = 단어 하나만 보고 사전에 있나 확인. 문맥 교정 = 문장 전체를 읽고 '하늘에서 형태(form)가 떨어졌다'는 어색하니 'from'으로 고침.",
    exam: "두 방법 차이와 form/from 예, 'IR에서는 문서를 적극 교정한다' ✗(OCR 정도, 문서는 건드리지 않음), 올바른 단어 목록 3후보.",
  },
  {
    id: "kgram-spelling",
    chapter: "dict",
    title: "k-gram 색인으로 철자 교정",
    en: "k-gram Indexes for Spelling Correction",
    importance: "high",
    summary:
      "질의어의 모든 k-gram을 열거하고 k-gram 색인으로 그 k-gram에 맞는 '올바른' 단어를 찾은 뒤, **맞는 k-gram 수로 임계값**을 둔다(예: 최대 3개 k-gram까지만 다른 어휘).",
    points: [
      "오타 **bordroom**의 bigram: bo, or, rd, dr, ro, oo, om",
      "bo → aboard, about, boardroom, border / or → border, lord, morbid, sordid / rd → aboard, ardent, boardroom, border",
      "여러 k-gram 리스트에 공통으로 자주 나오는 boardroom·border가 후보",
    ],
    easy: "오타를 두 글자 조각으로 잘라, 조각이 많이 겹치는 진짜 단어를 찾는다. bordroom ↔ boardroom은 조각 대부분이 같다.",
    exam: "bigram 열거, 임계값 = 맞는 k-gram 수.",
  },
  {
    id: "context-spelling",
    chapter: "dict",
    title: "문맥 기반 철자 교정과 일반 이슈",
    en: "Context-Sensitive Spelling Correction",
    importance: "high",
    summary:
      "**히트 기반 교정**: 각 질의어에 가까운 '올바른' 용어를 찾고, 한 번에 **한 단어만 고친** 구들을 모두 질의로 실행해 **히트가 가장 많은** 구를 고른다. 효율이 낮아서, 문서 대신 **질의 로그(질의 모음)**를 보는 방법이 더 효율적이다.",
    points: [
      "flew form munich → 후보 flea(flew), from(form), munch(munich) → \"flea form munich\", \"flew from munich\", \"flew form munch\" 시도 → **flew from munich**가 히트 최다",
      "질문: flew 7개, form 20개, munich 3개 후보면 모든 조합은 (7+1)(20+1)(3+1)급으로 폭증 — 히트 기반은 비효율",
      "UI: **자동 교정 vs 제안** / 'Did you mean'은 제안이 하나일 때만 / 여러 후보는? / 단순한 UI vs 강력한 UI의 트레이드오프",
      "비용: 철자 교정은 잠재적으로 비쌈 → 모든 질의에 돌리지 말고 **결과가 적은 질의**에만? (추측: 대형 엔진은 모든 질의에 돌릴 만큼 효율적)",
    ],
    easy: "후보 문장을 여러 개 만들어 실제로 검색해 보고, 결과가 제일 많이 나오는 문장이 사람들이 원래 쓰려던 문장이라고 본다.",
    exam: "히트 기반 알고리즘 순서와 비효율, 질의 로그 대안, 'Did you mean'의 한계.",
  },
  {
    id: "soundex",
    chapter: "dict",
    title: "Soundex",
    en: "Soundex",
    importance: "must",
    summary:
      "**Soundex**는 철자(orthographic)가 아니라 **발음(phonetic)**이 비슷한 대안을 찾는다(chebyshev / tchebyscheff). 색인할 모든 토큰과 질의어를 **4글자 축약형**(글자 1개 + 숫자 3개)으로 바꾸고 그 축약형으로 색인·검색한다. IR에는 **별로 쓸모없고**, Interpol 같은 **높은 재현율** 작업엔 괜찮다.",
    points: [
      "① 첫 글자는 유지 ② A, E, I, O, U, H, W, Y → **0** ③ B F P V → 1 / C G J K Q S X Z → 2 / D T → 3 / L → 4 / M N → 5 / R → 6",
      "④ 연속된 같은 숫자 쌍은 하나만 남김(반복) ⑤ 0을 모두 지우고 뒤에 0을 채워 **앞 4자리**(글자 + 숫자 3개) 반환",
      "HERMAN: H 유지 → ERMAN → 0RM0N → 06505 → (연속 중복 없음) 06505 → 0 제거 655 → **H655** (HERMANN도 H655)",
      "다른 예: ROBERT = RUPERT = **R163**, SMITH = SMYTH = **S530**, MULLER = MUELLER = **M460**",
      "Zobel and Dart(1996)가 IR용으로 더 나은 발음 매칭을 제안",
    ],
    flow: ["첫 글자 유지", "모음·H·W·Y → 0", "자음 → 숫자 (BFPV 1, CGJKQSXZ 2, DT 3, L 4, MN 5, R 6)", "연속된 같은 숫자는 하나로", "0 모두 제거", "뒤에 0 채워 글자 + 숫자 3개"],
    easy: "'스미스'와 '스미쓰'처럼 철자는 달라도 소리가 같은 이름을 같은 번호표(S530)로 묶는다.",
    exam: "이름의 Soundex 코드 계산(HERMAN → H655), 자음 → 숫자 표, 'Soundex는 IR에서 매우 유용' ✗.",
  },

  // ── const ────────────────────────────────────────
  {
    id: "hardware",
    chapter: "const",
    title: "색인 구축의 하드웨어 기초",
    en: "Hardware Basics",
    importance: "must",
    summary:
      "IR의 많은 설계 결정은 하드웨어 제약에서 나온다. 메모리 접근이 디스크보다 **훨씬 빠르고(교안: 대략 10배)**, 디스크 탐색(seek) 중엔 데이터가 전혀 안 옮겨지므로 **작은 덩어리 여러 번보다 큰 덩어리 한 번**이 빠르다. 디스크 I/O는 **블록 단위**(8KB~256KB)이고, 장애 허용 기계 한 대보다 **일반 기계 여러 대**가 싸다.",
    points: [
      "디스크 탐색 시간은 '유휴(idle)' 시간 — 헤드가 자리 잡는 동안 전송 없음",
      "IR 서버: 수 GB 메인 메모리, TB 단위 디스크",
      "통계(2008년경): 평균 탐색 시간 s = **5ms**, 바이트당 전송 시간 b = **0.02µs**, 프로세서 클럭 10⁹/s, 저수준 연산 p(비교·교환 한 워드) = **0.01µs**, 메인 메모리 수 GB, 디스크 1TB 이상",
    ],
    easy: "택배로 물건을 옮길 때 트럭을 부르는 시간(탐색)이 아까우니, 조금씩 여러 번보다 한 번에 꽉 채워 보내는 게 낫다.",
    exam: "'작은 청크 여러 번이 큰 청크 한 번보다 빠르다' ✗, 블록 기반 I/O, 장애 허용 비용.",
  },
  {
    id: "rcv1",
    chapter: "const",
    title: "Reuters RCV1 컬렉션",
    en: "Reuters RCV1 Collection",
    importance: "must",
    summary:
      "셰익스피어 전집은 너무 작아서, 확장 가능한 색인 구축 예로 **Reuters RCV1**(1995~1996년 1년치 영어 뉴스 기사)을 쓴다. 이 숫자들이 IIR 4·5의 모든 계산의 기준이다.",
    points: [
      "N 문서 **800,000** / L 문서당 토큰 **200** / M 용어(= word type) **400,000**",
      "토큰당 바이트(공백·구두점 포함) **6** / (제외) **4.5** / 용어(type)당 바이트 **7.5**",
      "T 비위치 포스팅 **100,000,000**",
      "연습: 토큰 총수 = 800,000 × 200 = 1.6억 → 용어당 평균 약 **400 토큰** / 토큰 4.5바이트 vs 타입 7.5바이트 차이: 짧은 단어(the, a)가 토큰으로는 매우 자주 나오기 때문",
    ],
    table: {
      title: "Reuters RCV1 통계",
      headers: ["기호", "통계", "값"],
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
    easy: "시험에 나올 '기준 숫자표'. 80만 문서, 문서당 200단어, 40만 종류 단어, 포스팅 1억 개.",
    exam: "N·L·M·T 값과 의미, 토큰 vs 타입 바이트 차이의 이유.",
  },
  {
    id: "bsbi",
    chapter: "const",
    title: "BSBI: 블록 정렬 기반 색인",
    en: "Blocked Sort-Based Indexing",
    importance: "must",
    summary:
      "IIR 1처럼 모든 포스팅을 메모리에서 정렬하는 방법은 큰 컬렉션에서 불가능하고, 같은 방법을 디스크에서 하면 **탐색이 너무 많아** 느리다 → **외부 정렬**이 필요하다. **BSBI**는 블록마다 ① 포스팅 모으기 ② **메모리에서 정렬** ③ 디스크에 쓰기를 하고, 마지막에 블록들을 **병합**한다.",
    points: [
      "Reuters: T = 1억 개 비위치 포스팅, 포스팅 하나 **12바이트**(termID 4 + docID 4 + term frequency 4)",
      "블록 = 1,000만 포스팅(메모리에 쉽게 들어감) → Reuters는 **10개 블록**",
      "병합 예: Block 1(brutus d3, caesar d4, noble d3, with d4) + Block 2(brutus d2, caesar d1, julius d1, killed d2) → brutus d2 d3, caesar d1 d4, julius d1, killed d2, noble d3, with d4",
      "전제: 사전(term → termID 매핑)을 **메모리에 둘 수 있다** — 이게 문제(SPIMI의 동기)",
    ],
    code: `BSBIndexConstruction()
  n ← 0
  while (all documents have not been processed)
    do n ← n + 1
       block ← ParseNextBlock()
       BSBI-Invert(block)
       WriteBlockToDisk(block, f_n)
  MergeBlocks(f_1, …, f_n; f_merged)`,
    flow: ["다음 블록 파싱 (termID, docID) 쌍 모으기", "블록을 메모리에서 정렬 (BSBI-Invert)", "정렬된 블록을 디스크에 쓰기", "모든 문서 처리까지 반복", "블록 파일들을 하나로 병합"],
    easy: "시험지 1억 장을 한 번에 정렬할 책상이 없으니, 1천만 장씩 책상에서 정렬해 상자에 넣고(블록), 마지막에 상자 10개를 맨 위 장끼리 비교하며 합친다.",
    exam: "포스팅 12바이트 구성, 블록 수 계산(1억 ÷ 1천만 = 10), BSBI 단계 순서, '디스크에서 그대로 정렬하면 된다' ✗(탐색 과다).",
  },
  {
    id: "spimi",
    chapter: "const",
    title: "SPIMI: 단일 패스 메모리 내 색인",
    en: "Single-Pass In-Memory Indexing",
    importance: "must",
    summary:
      "BSBI는 계속 커지는 사전을 메모리에 둬야 term → termID 매핑이 가능한데, termID 대신 term을 쓰면 중간 파일이 너무 커진다. **SPIMI**의 핵심 아이디어: ① **블록마다 별도 사전**(블록 간 term-termID 매핑 불필요) ② **정렬하지 않고**, 포스팅이 나올 때마다 포스팅 리스트에 **바로 누적**. 그러면 블록마다 완전한 역색인이 만들어지고, 이를 병합한다.",
    points: [
      "메모리가 남아 있는 동안 토큰을 읽어: 사전에 없으면 추가, 있으면 포스팅 리스트 가져오기 → 리스트가 가득 차면 **두 배로 늘리기** → docID 추가",
      "메모리가 차면 **용어만 정렬**(SortTerms)해 블록을 디스크에 씀",
      "블록 병합은 BSBI와 같음",
      "**압축**(용어 압축·포스팅 압축)을 쓰면 더 효율적 — IIR 5",
    ],
    code: `SPIMI-Invert(token_stream)
  output_file ← NewFile()
  dictionary ← NewHash()
  while (free memory available)
    do token ← next(token_stream)
       if term(token) ∉ dictionary
         then postings_list ← AddToDictionary(dictionary, term(token))
         else postings_list ← GetPostingsList(dictionary, term(token))
       if full(postings_list)
         then postings_list ← DoublePostingsList(dictionary, term(token))
       AddToPostingsList(postings_list, docID(token))
  sorted_terms ← SortTerms(dictionary)
  WriteBlockToDisk(sorted_terms, dictionary, output_file)
  return output_file`,
    table: {
      title: "BSBI vs SPIMI",
      headers: ["", "BSBI", "SPIMI"],
      rows: [
        ["사전", "전체 공통 (term → termID)", "블록마다 따로"],
        ["정렬", "(termID, docID) 쌍 전체를 정렬", "포스팅은 정렬 안 함, 용어만 정렬"],
        ["포스팅", "쌍을 모았다가 정렬", "나오는 대로 리스트에 누적"],
        ["평가", "단순(simple)", "더 현실적(more realistic)"],
      ],
    },
    easy: "BSBI = 쪽지를 다 모은 뒤 정렬. SPIMI = 단어별 봉투를 그때그때 만들어 쪽지를 바로 넣고, 봉투가 차면 두 배 큰 봉투로 바꾼다. 마지막엔 봉투 이름만 가나다순으로 세운다.",
    exam: "SPIMI 두 핵심 아이디어, BSBI와의 차이표, 'SPIMI는 포스팅을 정렬한다' ✗.",
  },
  {
    id: "distributed",
    chapter: "const",
    title: "분산 색인: 마스터·파서·인버터",
    en: "Distributed Indexing",
    importance: "must",
    summary:
      "웹 규모 색인은 **분산 클러스터**가 필요하고, 개별 기계는 예측 불가능하게 느려지거나 고장 난다. **'안전한' 마스터** 기계가 색인 작업을 지휘하며, 작업을 병렬 작업으로 나눠 놀고 있는 기계에 배정한다. 입력은 **split**(BSBI/SPIMI의 블록에 해당하는 문서 부분집합)으로 나누고, 두 종류의 기계 **파서**와 **인버터**를 쓴다.",
    points: [
      "**파서**: 마스터가 split을 배정 → 문서를 하나씩 읽어 **(term, docID) 쌍** 출력 → **j개 용어 구간(term-partition)**에 나눠 씀(예: a-f, g-p, q-z, j = 3)",
      "**인버터**: 한 용어 구간(예: a-f)의 모든 (term, docID) 쌍을 모아 **정렬**하고 포스팅 리스트로 씀",
      "자료 흐름: splits → 파서(map phase) → 구간별 세그먼트 파일 → 인버터(reduce phase) → 포스팅",
      "Google 데이터센터(2007 추정): 주로 **상용 기계**, 전 세계 분산, 서버 100만 대·프로세서/코어 300만, 분기마다 10만 대 설치, 연 2~2.5억 달러, 세계 컴퓨팅 용량의 10%",
      "고장 계산: 노드 1000개가 각각 99.9% 가동이면 고장을 허용하지 않는 시스템 가동률 = 0.999¹⁰⁰⁰ ≈ **37%** / 3년마다 고장 나는 서버 100만 대 → 고장 간격 **2분 미만**",
    ],
    easy: "공장장(마스터)이 원료 상자(split)를 일꾼(파서)에게 나눠 주면 일꾼은 단어 쪽지를 'ㄱ~ㅂ / ㅅ~ㅈ / ㅊ~ㅎ' 바구니에 나눠 담고, 바구니 담당자(인버터)가 자기 바구니를 정렬해 묶는다.",
    exam: "파서·인버터의 역할 구분, term-partition, 가동률 37% 계산, 마스터가 'safe'로 간주된다는 점.",
  },
  {
    id: "mapreduce",
    chapter: "const",
    title: "MapReduce로 색인 구축",
    en: "MapReduce",
    importance: "must",
    summary:
      "앞의 분산 색인 알고리즘은 **MapReduce**의 한 사례다. MapReduce는 분산 부분의 코드를 직접 쓰지 않고도 쓸 수 있는 **견고하고 개념적으로 단순한** 분산 계산 프레임워크다. 스키마는 map: 입력 → list(k, v), reduce: (k, list(v)) → 출력.",
    points: [
      "색인 구축에 적용: map: 웹 컬렉션 → list(termID, docID) / reduce: (⟨termID1, list(docID)⟩, ⟨termID2, list(docID)⟩, …) → (postings list1, postings list2, …)",
      "예: map — d2: C died. d1: C came, C c'ed. → (⟨C, d2⟩, ⟨died, d2⟩, ⟨C, d1⟩, ⟨came, d1⟩, ⟨C, d1⟩, ⟨c'ed, d1⟩)",
      "reduce — (⟨C, (d2, d1, d1)⟩, ⟨died, (d2)⟩, ⟨came, (d1)⟩, ⟨c'ed, (d1)⟩) → (⟨C, (d1:2, d2:1)⟩, ⟨died, (d2:1)⟩, ⟨came, (d1:1)⟩, ⟨c'ed, (d1:1)⟩)",
      "Google 색인 시스템(2002년경)은 여러 단계로 되어 있었고 각각 MapReduce로 구현 — 색인 구축은 그중 하나, 또 다른 단계: **용어 분할 색인 → 문서 분할 색인** 변환",
    ],
    easy: "map = 모두가 각자 '단어, 문서번호' 쪽지를 쓰는 단계, reduce = 같은 단어 쪽지를 한 사람이 모아 정리하는 단계.",
    exam: "map/reduce 입출력 형식, 예제의 reduce 결과(C → d1:2, d2:1), 파서 = map, 인버터 = reduce.",
  },
  {
    id: "dynamic-index",
    chapter: "const",
    title: "동적 색인: 보조 색인",
    en: "Dynamic Indexing: Auxiliary Index",
    importance: "must",
    summary:
      "실제 컬렉션은 정적이지 않다 — 문서가 추가·삭제·수정되므로 사전과 포스팅도 동적으로 바뀌어야 한다. 가장 단순한 방법: 디스크에 **큰 주 색인**, 새 문서는 메모리의 **작은 보조 색인**에 넣고, **둘 다 검색해 결과를 합치며**, 주기적으로 보조 색인을 주 색인에 병합한다. 삭제는 **무효화 비트 벡터**로 걸러 낸다.",
    points: [
      "문제: **잦은 병합**, 병합 중 **검색 성능 저하**",
      "대형 검색 엔진: 보통 조합 — 잦은 점진적 변경 + 색인의 큰 부분을 **교체(rotation)**해 갈아 끼우기 + 가끔 **전체 재구축**(규모가 커질수록 어려움, Google이 전체 재구축을 할 수 있는지 불분명)",
    ],
    easy: "두꺼운 본책(주 색인)은 가끔만 다시 찍고, 새 소식은 포스트잇(보조 색인)에 붙여 둔다. 찾을 땐 둘 다 보고, 버린 내용은 '삭제' 표시로 가린다.",
    exam: "보조 색인 방식의 절차와 삭제 처리(invalidation bit-vector), 단점 두 가지.",
  },
  {
    id: "log-merge",
    chapter: "const",
    title: "로그 병합",
    en: "Logarithmic Merge",
    importance: "must",
    summary:
      "**로그 병합**은 병합 비용을 시간에 걸쳐 **분할 상환(amortize)**해 사용자가 응답 시간에서 느끼는 영향을 줄인다. 크기가 **두 배씩 커지는** 색인들을 유지하며, 가장 작은 Z₀는 메모리에, I₀, I₁, …은 디스크에 둔다. Z₀가 n을 넘으면 디스크에 I₀로 쓰거나, I₀가 이미 있으면 병합해 I₁로 쓰는 식 — **이진수 올림**과 같다.",
    points: [
      "색인 개수는 **O(log T)** (T = 지금까지 읽은 포스팅 수) → 질의 처리 때 O(log T)개 색인을 합쳐야 함",
      "구축 시간 **O(T log T)** — 각 포스팅이 O(log T)번 병합됨",
      "보조 색인 방식: **O(T²)** — 병합마다 모든 포스팅을 건드림, 보조 색인 크기 a면 a + 2a + 3a + … + na = a·n(n+1)/2 = O(n²)",
      "→ 로그 병합이 **한 차수(order of magnitude) 더 효율적**",
      "I₃I₂I₁I₀ = 2³2²2¹2⁰: 0001, 0010, 0011, 0100, … 처럼 이진수 카운터와 같이 변함",
    ],
    code: `LMergeAddToken(indexes, Z0, token)
  Z0 ← Merge(Z0, {token})
  if |Z0| = n
    then for i ← 0 to ∞
      do if Ii ∈ indexes
           then Z(i+1) ← Merge(Ii, Zi)     (임시 색인, 디스크)
                indexes ← indexes − {Ii}
           else Ii ← Zi                     (영구 색인이 됨)
                indexes ← indexes ∪ {Ii}
                Break
    Z0 ← ∅`,
    easy: "동전 저금통: 100원짜리 2개가 모이면 200원 묶음으로, 200원 묶음 2개면 400원 묶음으로 — 이진수 자리올림처럼 합친다. 큰 병합은 드물게만 일어난다.",
    exam: "복잡도 비교 O(T log T) vs O(T²), 색인 수 O(log T), 이진수 비유.",
  },
];
