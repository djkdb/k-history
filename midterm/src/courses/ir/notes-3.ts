import type { NoteSection } from "@/lib/types";

/** 정보검색 강의 노트 3 — IIR 5 Index Compression, IIR 6 Scoring/VSM, IIR 7 Complete search system */
export const NOTES_3: Record<string, NoteSection[]> = {
  comp: [
    {
      title: "목차와 Recap",
      en: "Overview · Recap",
      lines: [
        "목차: ① Recap ② Compression ③ Term statistics ④ Dictionary compression ⑤ Postings compression",
        "Recap: BSBI(블록 병합 그림), SPIMI(두 핵심 아이디어와 SPIMI-Invert), MapReduce 색인 구축 자료 흐름, 동적 색인의 가장 단순한 방법(주 색인 + 보조 색인)",
      ],
    },
    {
      title: "Take-away",
      lines: [
        "정보검색 시스템에서 **압축의 동기**",
        "역색인의 **사전** 부분을 어떻게 압축하나?",
        "역색인의 **포스팅** 부분을 어떻게 압축하나?",
        "**용어 통계**: 문서 컬렉션에서 용어는 어떻게 분포하나?",
      ],
    },
    {
      title: "왜 압축하나? (일반)",
      en: "Why compression? (in general)",
      lines: [
        "디스크 공간을 덜 씀 (돈 절약)",
        "더 많이 **메모리에** 둠 (속도 향상)",
        "디스크 → 메모리 전송 속도 향상 (역시 속도 향상)",
        "[압축된 데이터를 읽고 메모리에서 해제]가 [압축 안 된 데이터 읽기]보다 **빠르다**",
        "전제: **해제 알고리즘이 빠르다** — 우리가 쓸 해제 알고리즘은 그렇다",
      ],
    },
    {
      title: "IR에서 왜 압축하나?",
      en: "Why compression in information retrieval?",
      lines: [
        "먼저 **사전**의 공간",
        "사전 압축의 주된 동기: **메인 메모리에 둘 수 있을 만큼 작게**",
        "그다음 **포스팅 파일**",
        "동기: 필요한 **디스크 공간을 줄이고**, 디스크에서 **읽는 시간을 줄이기**",
        "참고: 대형 검색 엔진은 포스팅의 상당 부분을 메모리에 둔다",
        "사전과 포스팅을 위한 여러 압축 방식을 고안한다",
      ],
    },
    {
      title: "손실 vs 무손실 압축",
      en: "Lossy vs. lossless compression",
      lines: [
        "**손실 압축**: 일부 정보를 버림",
        "자주 쓰는 전처리 단계 일부는 손실 압축으로 볼 수 있다: **소문자화, 불용어, Porter, 숫자 제거**",
        "**무손실 압축**: 모든 정보 보존",
        "색인 압축에서 우리가 주로 하는 것",
      ],
    },
    {
      title: "모델 컬렉션: Reuters",
      en: "Model collection: The Reuters collection",
      lines: [
        "N 문서 800,000 / L 문서당 평균 word token 200 / M word type 400,000",
        "word token당 평균 바이트(공백·구두점 포함) 6 / (제외) 4.5 / word type당 평균 바이트 7.5",
        "T 비위치 포스팅 100,000,000",
      ],
    },
    {
      title: "Reuters에서 전처리의 효과",
      en: "Effect of preprocessing for Reuters",
      lines: [
        "연습: 비위치 vs 위치 숫자 차이를 설명하라 — −3 vs −0, −14 vs −31, −30 vs −47, −4 vs −0",
        "풀이: 대소문자 접기·어간 추출은 같은 문서 안의 변형들을 **한 포스팅으로 합쳐** 비위치 포스팅을 줄이지만, 위치 포스팅은 **토큰 하나당 하나**라 그대로(−0)",
        "풀이: 불용어는 한 문서 안에서 **여러 번** 나오므로, 지우면 토큰(위치 포스팅)이 문서 수(비위치)보다 훨씬 많이 줄어듦(−31 vs −14, −47 vs −30)",
      ],
      table: {
        title: "size of dictionary / non-positional index / positional index (size · Δ% · cumulative%)",
        headers: ["", "word types (terms)", "non-positional postings", "positional postings (word tokens)"],
        rows: [
          ["unfiltered", "484,494", "109,971,179", "197,879,290"],
          ["no numbers", "473,723 · −2 · −2", "100,680,242 · −8 · −8", "179,158,204 · −9 · −9"],
          ["case folding", "391,523 · −17 · −19", "96,969,056 · −3 · −12", "179,158,204 · −0 · −9"],
          ["30 stopwords", "391,493 · −0 · −19", "83,390,443 · −14 · −24", "121,857,825 · −31 · −38"],
          ["150 stopwords", "391,373 · −0 · −19", "67,001,847 · −30 · −39", "94,516,599 · −47 · −52"],
          ["stemming", "322,383 · −17 · −33", "63,812,300 · −4 · −42", "94,516,599 · −0 · −52"],
        ],
      },
    },
    {
      title: "용어 어휘는 얼마나 클까? — Heaps 법칙",
      en: "How big is the term vocabulary? · Heaps' law",
      lines: [
        "즉, 서로 다른 단어가 몇 개인가?",
        "상한이 있다고 가정할 수 있나? → 그렇지 않다: 길이 20인 다른 단어만 해도 최소 70²⁰ ≈ 10³⁷개",
        "어휘는 컬렉션 크기와 함께 **계속 커진다**",
        "**Heaps 법칙: M = kT^b**",
        "M = 어휘 크기, T = 컬렉션의 토큰 수",
        "k, b의 전형적 값: **30 ≤ k ≤ 100, b ≈ 0.5**",
        "Heaps 법칙은 **로그-로그 공간에서 선형**",
        "로그-로그 공간에서 컬렉션 크기와 어휘 크기 사이의 **가장 단순한** 관계",
        "**경험 법칙**",
      ],
    },
    {
      title: "Reuters의 Heaps 법칙",
      en: "Heaps' law for Reuters · Empirical fit",
      lines: [
        "Reuters-RCV1에서 컬렉션 크기 T(토큰 수)에 따른 어휘 크기 M — 점선 **log₁₀M = 0.49 · log₁₀T + 1.64**가 최소제곱 적합",
        "그러므로 M = 10^1.64 · T^0.49, **k = 10^1.64 ≈ 44, b = 0.49**",
        "그래프에서 보듯 적합이 좋다",
        "예: 처음 1,000,020 토큰에 대해 Heaps 법칙은 **38,323**개 용어를 예측: 44 × 1,000,020^0.49 ≈ 38,323",
        "실제는 **38,365**개 — 예측에 매우 가까움",
        "경험적 관찰: 일반적으로 적합이 좋다",
      ],
    },
    {
      title: "연습: Heaps 법칙",
      en: "Exercise",
      lines: [
        "① 철자 오류를 포함하는 것 vs 자동 교정하는 것이 Heaps 법칙에 주는 효과는? → 오류를 포함하면 오타가 새 용어로 계속 생겨 **어휘가 더 빨리** 커짐",
        "② 어휘 크기 M 계산: 웹 페이지 컬렉션에서 처음 10,000 토큰에 서로 다른 용어 3000개, 처음 1,000,000 토큰에 30,000개",
        "검색 엔진이 총 20,000,000,000(2 × 10¹⁰) 페이지, 평균 200 토큰을 색인한다고 가정 — Heaps 법칙이 예측하는 어휘 크기는?",
        "풀이: 30000/3000 = (10⁶/10⁴)^b → 10 = 100^b → **b = 0.5** → k = 3000/√10000 = **30** → T = 4 × 10¹² → M = 30 × 2 × 10⁶ = **6 × 10⁷ (6천만)**",
      ],
    },
    {
      title: "Zipf 법칙",
      en: "Zipf's law",
      lines: [
        "지금까지 컬렉션 어휘의 증가를 특징지었다",
        "컬렉션에 흔한 용어와 드문 용어가 각각 얼마나 있을지도 알고 싶다",
        "자연어에는 **아주 흔한 용어는 몇 개, 아주 드문 용어는 매우 많다**",
        "Zipf 법칙: **i번째로 흔한 용어의 빈도 cfᵢ는 1/i에 비례** — cfᵢ ∝ 1/i",
        "cfᵢ는 **컬렉션 빈도**: 컬렉션에서 용어 tᵢ가 나온 횟수",
        "가장 흔한 용어(the)가 cf₁번 나오면 두 번째(of)는 절반 cf₂ = ½cf₁ …",
        "… 세 번째(and)는 3분의 1 cf₃ = ⅓cf₁ 등",
        "동치: cfᵢ = c·i^k, log cfᵢ = log c + k log i (k = −1)",
        "**거듭제곱 법칙(power law)**의 예",
        "Reuters의 Zipf 법칙(log10 cf vs log10 rank 그래프): 적합은 그리 좋지 않다 — 중요한 건 핵심 통찰: **흔한 용어는 적고, 드문 용어는 많다**",
      ],
    },
    {
      title: "사전 압축",
      en: "Dictionary compression",
      lines: [
        "사전은 포스팅 파일에 비해 **작다**",
        "하지만 **메모리에 두고 싶다**",
        "또한: 다른 응용과의 경쟁, 휴대폰, 탑재 컴퓨터, 빠른 시작 시간",
        "그래서 사전 압축이 중요하다",
        "다시 보기: 고정 폭 항목 배열 — 20바이트 + 4바이트 + 4바이트 → Reuters 공간 (20 + 4 + 4) × 400,000 = **11.2MB**",
      ],
    },
    {
      title: "고정 폭 항목은 나쁘다",
      en: "Fixed-width entries are bad",
      lines: [
        "용어 열의 바이트 대부분이 **낭비**",
        "길이 1인 용어에도 20바이트를 할당",
        "hydrochlorofluorocarbons, supercalifragilisticexpialidocious는 **담을 수 없다**",
        "영어 용어 평균 길이: **8글자**(또는 조금 덜)",
        "어떻게 하면 용어당 평균 8글자만 쓸 수 있을까?",
      ],
    },
    {
      title: "문자열로서의 사전",
      en: "Dictionary as a string",
      lines: [
        "모든 용어를 하나의 긴 문자열로: …systilesyzygeticsyzygialsyzygyszaibelyiteszecinszono…",
        "표: freq.(4바이트) · postings ptr.(4바이트) · **term ptr.(3바이트)** — 9, 92, 5, 71, 12 …",
        "용어당 빈도 **4**바이트",
        "용어당 포스팅 리스트 포인터 **4**바이트",
        "문자열 속 용어 (평균) **8**바이트",
        "문자열 포인터 **3**바이트 (8 · 400,000개 위치를 가리키려면 log₂(8 · 400000) < **24비트**)",
        "공간: 400,000 × (4 + 4 + 3 + 8) = **7.6MB** (고정 폭 배열 11.2MB와 비교)",
      ],
    },
    {
      title: "블로킹을 한 문자열 사전",
      en: "Dictionary as a string with blocking",
      lines: [
        "…7systile9syzygetic8syzygial6syzygy11szaibelyite6szecin… — 용어 앞에 **길이**를 적고, 용어 포인터는 블록마다 하나",
        "블록 크기 예 **k = 4**",
        "블로킹 없을 때 용어 포인터에 4 × 3바이트를 쓰던 것을 …",
        "… 이제 포인터 하나 3바이트 + 각 용어 길이 표시 4바이트",
        "블록당 12 − (3 + 4) = **5바이트 절약**",
        "총 절약: 400,000/4 × 5 = **0.5MB**",
        "사전 크기 7.6MB → **7.1MB**",
      ],
    },
    {
      title: "블로킹 없을 때 vs 있을 때 용어 조회",
      en: "Lookup of a term without / with blocking",
      lines: [
        "블로킹 없음: 이진 탐색 트리 aid, box, den, ex, job, ox, pit, win — 각 용어로 바로 이진 탐색",
        "블로킹 있음: (aid box den ex) (job ox pit win) — 블록까지 이진 탐색한 뒤 블록 안을 **선형 탐색** → (약간) **느리다**",
      ],
    },
    {
      title: "앞부분 부호화",
      en: "Front coding",
      lines: [
        "블록 압축(k = 4)의 한 블록: 8automata 8automate 9automatic 10automation",
        "⇓ 앞부분 부호화로 더 압축",
        "**8automat∗a1⋄e2⋄ic3⋄ion** — ∗ = 공통 접두사의 끝, ⋄ = 접두사 자리, 숫자 = 덧붙는 글자 수",
        "연습: 앞부분 부호화에 어떤 접두사를 써야 할까? 트레이드오프는? (입력: 용어 목록 = 용어 어휘, 출력: 앞부분 부호화에 쓸 접두사 목록)",
      ],
      table: {
        title: "Reuters 사전 압축 요약",
        headers: ["data structure", "size in MB"],
        rows: [
          ["dictionary, fixed-width", "11.2"],
          ["dictionary, term pointers into string", "7.6"],
          ["∼, with blocking, k = 4", "7.1"],
          ["∼, with blocking & front coding", "5.9"],
        ],
      },
    },
    {
      title: "포스팅 압축",
      en: "Postings compression",
      lines: [
        "포스팅 파일은 사전보다 훨씬 크다 — **최소 10배**",
        "핵심 요구: 각 포스팅을 **조밀하게** 저장",
        "여기서 포스팅 = **docID**",
        "Reuters(800,000 문서)에서 4바이트 정수면 docID당 **32비트**",
        "또는 docID당 log₂ 800,000 ≈ 19.6 < **20비트**",
        "목표: docID당 **20비트보다 훨씬 적게**",
      ],
    },
    {
      title: "핵심 아이디어: docID 대신 간격 저장",
      en: "Store gaps instead of docIDs · Gap encoding",
      lines: [
        "각 포스팅 리스트는 docID **오름차순**",
        "예: computer: 283154, 283159, 283202, …",
        "**간격**만 저장해도 충분: 283159 − 283154 = **5**, 283202 − 283159 = **43**",
        "간격을 쓴 포스팅 리스트: computer: 283154, 5, 43, …",
        "**흔한 용어의 간격은 작다**",
        "그러므로 작은 간격은 20비트보다 적게 부호화할 수 있다",
      ],
      table: {
        title: "간격 부호화",
        headers: ["term", "", "postings list"],
        rows: [
          ["the", "docIDs", "… 283042, 283043, 283044, 283045 …"],
          ["the", "gaps", "1, 1, 1, …"],
          ["computer", "docIDs", "… 283047, 283154, 283159, 283202 …"],
          ["computer", "gaps", "107, 5, 43, …"],
          ["arachnocentric", "docIDs", "252000, 500100"],
          ["arachnocentric", "gaps", "252000, 248100"],
        ],
      },
    },
    {
      title: "가변 길이 부호화",
      en: "Variable length encoding",
      lines: [
        "목표: arachnocentric 같은 드문 용어는 간격(= 포스팅)당 **약 20비트**",
        "the 같은 아주 흔한 용어는 간격당 **몇 비트만**",
        "이를 위해 어떤 형태의 **가변 길이 부호화**가 필요",
        "가변 길이 부호화는 작은 간격엔 적은 비트를, 큰 간격엔 많은 비트를 쓴다",
      ],
    },
    {
      title: "가변 바이트(VB) 코드",
      en: "Variable byte (VB) code",
      lines: [
        "많은 상용·연구 시스템이 사용",
        "가변 길이 부호화와 정렬(alignment) 민감성의 좋은 **저기술 혼합** (비트 수준 코드는 뒤에)",
        "1비트(최상위 비트)를 **연속 비트 c**로 씀",
        "간격 G가 7비트에 들어가면 7비트에 이진 부호화하고 **c = 1**",
        "아니면: 하위 7비트를 부호화하고 하나 이상의 추가 바이트로 상위 비트를 같은 방식으로 부호화",
        "끝에 **마지막 바이트의 연속 비트는 1**(c = 1), 다른 바이트는 0(c = 0)",
        "(IIR 6 Recap에는 'c = 0으로 두고 상위 7비트를 먼저…'로 적혀 있음 — 결과 바이트열은 같음: 앞 바이트들 c = 0, 마지막 c = 1)",
      ],
      table: {
        title: "VB code examples",
        headers: ["docIDs", "824", "829", "215406"],
        rows: [
          ["gaps", "", "5", "214577"],
          ["VB code", "00000110 10111000", "10000101", "00001101 00001100 10110001"],
        ],
      },
    },
    {
      title: "VB 부호화·해독 알고리즘",
      en: "VB code encoding / decoding algorithm",
      lines: [
        "연습: 130의 VB 코드? → 130 = 1 × 128 + 2 → **00000001 10000010**",
      ],
      code: `VBEncodeNumber(n)                 VBEncode(numbers)
1 bytes ← ⟨⟩                       1 bytestream ← ⟨⟩
2 while true                       2 for each n ∈ numbers
3 do Prepend(bytes, n mod 128)     3 do bytes ← VBEncodeNumber(n)
4    if n < 128                    4    bytestream ← Extend(bytestream, bytes)
5      then Break                  5 return bytestream
6    n ← n div 128
7 bytes[Length(bytes)] += 128
8 return bytes

VBDecode(bytestream)
1 numbers ← ⟨⟩
2 n ← 0
3 for i ← 1 to Length(bytestream)
4 do if bytestream[i] < 128
5      then n ← 128 × n + bytestream[i]
6      else n ← 128 × n + (bytestream[i] − 128)
7           Append(numbers, n)
8           n ← 0
9 return numbers`,
    },
    {
      title: "다른 가변 코드",
      en: "Other variable codes",
      lines: [
        "바이트 대신 다른 '정렬 단위'도 쓸 수 있다: 32비트(워드), 16비트, 4비트(**니블**) 등",
        "작은 간격이 많으면 가변 바이트 정렬은 공간을 낭비 — **니블이 더 낫다**",
        "가변 개수의 간격을 한 워드에 효율적으로 '채워 넣는' **워드 정렬 코드** 연구도 있음",
      ],
    },
    {
      title: "간격 부호화용 감마 코드 · 단항 코드",
      en: "Gamma codes for gap encoding · Unary code",
      lines: [
        "다른 종류의 가변 길이 부호화인 **비트 수준 코드**로 더 압축할 수 있다",
        "감마 코드가 가장 잘 알려진 것",
        "감마 코드를 소개하려면 먼저 **단항 코드**가 필요",
        "단항 코드: n을 **1 n개 + 마지막 0**으로",
        "3의 단항 코드는 **1110**",
        "40의 단항 코드는 1이 40개 + 0",
        "70의 단항 코드는 1이 70개 + 0",
      ],
    },
    {
      title: "감마 코드",
      en: "Gamma code",
      lines: [
        "간격 G를 **길이(length)와 오프셋(offset)** 쌍으로 표현",
        "**오프셋** = 이진수 간격에서 **맨 앞 비트를 떼어 낸 것**",
        "예: 13 → 1101 → 101 = 오프셋",
        "**길이** = 오프셋의 길이",
        "13(오프셋 101)이면 3",
        "길이를 **단항 코드**로: 1110",
        "13의 감마 코드 = 길이와 오프셋을 이어 붙인 것: **1110101**",
        "연습: 130의 감마 코드? → 10000010 → 오프셋 0000010(7비트) → 길이 7 = 11111110 → **11111110,0000010**",
      ],
      table: {
        title: "Gamma code examples",
        headers: ["number", "unary code", "length", "offset", "γ code"],
        rows: [
          ["0", "0", "", "", ""],
          ["1", "10", "0", "", "0"],
          ["2", "110", "10", "0", "10,0"],
          ["3", "1110", "10", "1", "10,1"],
          ["4", "11110", "110", "00", "110,00"],
          ["9", "1111111110", "1110", "001", "1110,001"],
          ["13", "", "1110", "101", "1110,101"],
          ["24", "", "11110", "1000", "11110,1000"],
          ["511", "", "111111110", "11111111", "111111110,11111111"],
          ["1025", "", "11111111110", "0000000001", "11111111110,0000000001"],
        ],
      },
    },
    {
      title: "감마 코드의 길이와 성질",
      en: "Length of gamma code · Properties",
      lines: [
        "오프셋 길이는 **⌊log₂G⌋** 비트",
        "길이 부분은 **⌊log₂G⌋ + 1** 비트",
        "그래서 전체 코드 길이는 **2 × ⌊log₂G⌋ + 1** 비트",
        "γ 코드는 **항상 홀수 길이**",
        "감마 코드는 최적 부호 길이 log₂G의 **2배 이내** (간격 G의 빈도가 log₂G에 비례한다고 가정 — 근사적으로만 참)",
        "감마 코드(VB 코드처럼)는 **접두사 없음(prefix-free)**: 유효한 코드어는 다른 유효한 코드의 접두사가 아니다",
        "부호화는 **3배 이내**로 최적 (추가 가정을 하면 2배 이내)",
        "이 결과는 **간격 분포와 무관**! → 어떤 분포에도 감마 코드를 쓸 수 있다 — 감마 코드는 **universal**",
        "감마 코드는 **매개변수가 없다(parameter-free)**",
      ],
    },
    {
      title: "감마 코드: 정렬",
      en: "Gamma codes: Alignment",
      lines: [
        "기계에는 워드 경계가 있다 — 8, 16, 32비트",
        "비트 단위로 압축하고 다루는 건 **느릴 수 있다**",
        "가변 바이트 부호화는 **정렬되어** 있어 잠재적으로 더 효율적",
        "효율과 무관하게, 가변 바이트는 **개념적으로 더 단순**하고 추가 공간 비용도 적다",
      ],
    },
    {
      title: "Reuters 압축 요약",
      en: "Compression of Reuters · Summary",
      lines: [
        "용어-문서 출현 행렬(T/D incidence matrix)을 다시 보면 — 40,000MB",
        "이제 매우 효율적인 불리언 검색용 색인을 **공간 효율적으로** 만들 수 있다",
        "컬렉션 텍스트 전체 크기의 **10~15%**뿐",
        "하지만 **위치·빈도 정보를 무시**했다",
        "그래서 실제 공간 절약은 이보다 적다",
        "자료: IIR 5장, 워드 정렬 이진 코드 원 논문 Anh and Moffat (2005, 2006a), 가변 바이트 코드 원 논문 Scholer, Williams, Yiannis and Zobel (2002), 위치·빈도 압축을 포함한 상세 Zobel and Moffat (2006)",
      ],
      table: {
        title: "Compression of Reuters",
        headers: ["data structure", "size in MB"],
        rows: [
          ["dictionary, fixed-width", "11.2"],
          ["dictionary, term pointers into string", "7.6"],
          ["∼, with blocking, k = 4", "7.1"],
          ["∼, with blocking & front coding", "5.9"],
          ["collection (text, xml markup etc)", "3600.0"],
          ["collection (text)", "960.0"],
          ["T/D incidence matrix", "40,000.0"],
          ["postings, uncompressed (32-bit words)", "400.0"],
          ["postings, uncompressed (20 bits)", "250.0"],
          ["postings, variable byte encoded", "116.0"],
          ["postings, γ encoded", "101.0"],
        ],
      },
    },
  ],

  score: [
    {
      title: "목차와 Recap",
      en: "Overview · Recap",
      lines: [
        "목차: ① Recap ② Why ranked retrieval? ③ Term frequency ④ tf-idf weighting ⑤ The vector space model",
        "Recap: Heaps 법칙(log₁₀M = 0.49 log₁₀T + 1.64, k ≈ 44, b = 0.49), Zipf 법칙(cfᵢ ∝ 1/i), 문자열로서의 사전, 간격 부호화, VB 코드, 감마 코드, Reuters 압축 표",
        "압축 참고 문헌: Zobel, Moffat — Inverted files for text search engines (ACM Computing Surveys 2006) / Witten, Moffat, Bell — Managing Gigabytes (1999, 고전) / Büttcher, Clarke, Cormack — Information retrieval: Implementing and evaluating search engines (2010)",
      ],
    },
    {
      title: "Take-away",
      lines: [
        "검색 결과 순위화: 왜 중요한가 (순서 없는 불리언 결과 집합과 비교해)",
        "**용어 빈도**: 순위의 핵심 재료",
        "**tf-idf 순위**: 가장 잘 알려진 전통적 순위 방식",
        "**벡터 공간 모델**: 정보검색의 중요한 형식 모델 (불리언·확률 모델과 함께)",
      ],
    },
    {
      title: "순위 검색",
      en: "Ranked retrieval",
      lines: [
        "지금까지 질의는 **불리언**이었다",
        "문서는 맞거나 안 맞거나",
        "요구와 컬렉션을 정확히 이해하는 **전문가 사용자**에겐 좋다",
        "**응용 프로그램**에도 좋다: 결과 수천 개를 쉽게 소비",
        "**대다수 사용자**에겐 좋지 않다",
        "대부분 사용자는 불리언 질의를 쓸 줄 모른다 … 또는 쓸 줄 알지만 너무 귀찮다고 생각한다",
        "대부분 사용자는 결과 수천 개를 헤치고 싶지 않다",
        "특히 웹 검색에서 그렇다",
      ],
    },
    {
      title: "불리언 검색의 문제: 잔치 아니면 굶주림",
      en: "Feast or famine",
      lines: [
        "불리언 질의는 자주 결과가 **너무 적거나(= 0) 너무 많다(수천)**",
        "질의 1(불리언 연언): [standard user dlink 650] → 200,000 히트 — **feast**",
        "질의 2(불리언 연언): [standard user dlink 650 no card found] → 0 히트 — **famine**",
        "불리언 검색에선 감당할 만한 수의 히트를 내는 질의를 만드는 데 **많은 기술**이 필요",
        "순위 검색에선 문제가 아니다: 큰 결과 집합도 괜찮다 — **상위 10개**만 보여 주면 됨, 사용자를 압도하지 않음",
        "전제: 순위 알고리즘이 **잘 동작**한다 — 더 관련 있는 결과가 덜 관련 있는 결과보다 위에",
      ],
    },
    {
      title: "순위 검색의 기반: 점수 매기기",
      en: "Scoring as the basis of ranked retrieval",
      lines: [
        "질의에 대한 문서의 관련성 순위를 어떻게 매기나?",
        "각 질의-문서 쌍에 점수를 매긴다 — 예: [0, 1]",
        "이 점수는 문서와 질의가 얼마나 잘 '맞는지'를 잰다",
        "점수로 문서를 정렬",
        "질의-문서 점수 계산: 질의어가 문서에 하나도 없으면 **0** / 문서에 질의어가 **자주** 나올수록 점수 ↑ / 문서에 질의어가 **많이** 나올수록 점수 ↑",
        "여러 대안을 살펴본다",
      ],
    },
    {
      title: "시도 1: Jaccard 계수",
      en: "Take 1: Jaccard coefficient",
      lines: [
        "두 집합의 겹침을 재는 흔한 척도",
        "A, B를 두 집합이라 하면 **jaccard(A, B) = |A ∩ B| / |A ∪ B|** (A ≠ ∅ 또는 B ≠ ∅)",
        "jaccard(A, A) = 1",
        "A ∩ B = ∅이면 jaccard(A, B) = 0",
        "A와 B의 크기가 같을 필요 없음",
        "항상 0과 1 사이의 수",
        "예: 질의 'ides of March', 문서 'Caesar died in March' → jaccard(q, d) = **1/6**",
      ],
    },
    {
      title: "Jaccard의 문제점",
      en: "What's wrong with Jaccard?",
      lines: [
        "**용어 빈도**(용어가 몇 번 나오는지)를 고려하지 않는다",
        "**드문 용어가 흔한 용어보다 정보가 많다** — Jaccard는 이 정보를 고려하지 않는다",
        "문서 길이를 정규화하는 더 정교한 방법이 필요",
        "이번 강의 뒤에서는 길이 정규화에 |A ∩ B|/|A ∪ B|(Jaccard) 대신 **|A ∩ B|/√|A ∪ B|**(코사인)를 쓴다",
      ],
    },
    {
      title: "이진 출현 행렬 → 횟수 행렬",
      en: "Binary incidence matrix · Count matrix",
      lines: [
        "이진: 각 문서는 이진 벡터 ∈ {0, 1}^|V|",
        "횟수: 각 문서는 이제 횟수 벡터 ∈ ℕ^|V|",
      ],
      table: {
        title: "Count matrix",
        headers: ["", "Anthony and Cleopatra", "Julius Caesar", "The Tempest", "Hamlet", "Othello", "Macbeth"],
        rows: [
          ["Anthony", "157", "73", "0", "0", "0", "1"],
          ["Brutus", "4", "157", "0", "2", "0", "0"],
          ["Caesar", "232", "227", "0", "2", "1", "0"],
          ["Calpurnia", "0", "10", "0", "0", "0", "0"],
          ["Cleopatra", "57", "0", "0", "0", "0", "0"],
          ["mercy", "2", "0", "3", "8", "5", "8"],
          ["worser", "2", "0", "1", "1", "1", "5"],
        ],
      },
    },
    {
      title: "Bag of words 모델",
      en: "Bag of words model",
      lines: [
        "문서 안 **단어 순서를 고려하지 않는다**",
        "John is quicker than Mary와 Mary is quicker than John은 **같게** 표현된다",
        "이를 **bag of words 모델**이라 한다",
        "어떤 의미로는 후퇴: 위치 색인은 이 두 문서를 구별할 수 있었다",
        "위치 정보를 '되찾는' 법은 수업 뒤에서",
        "지금은 bag of words 모델",
      ],
    },
    {
      title: "용어 빈도 tf",
      en: "Term frequency tf",
      lines: [
        "문서 d에서 용어 t의 **용어 빈도 tfₜ,d** = t가 d에 나오는 횟수",
        "질의-문서 매치 점수를 계산할 때 tf를 쓰고 싶다 — 하지만 어떻게?",
        "원시 용어 빈도는 원하는 게 아니다:",
        "· tf = 10인 문서가 tf = 1인 문서보다 관련성이 높다",
        "· 하지만 **10배 더는 아니다**",
        "관련성은 용어 빈도에 **비례해서 늘지 않는다**",
      ],
    },
    {
      title: "원시 빈도 대신: 로그 빈도 가중치",
      en: "Log frequency weighting",
      lines: [
        "d에서 t의 로그 빈도 가중치: **wₜ,d = 1 + log₁₀ tfₜ,d** (tfₜ,d > 0), 아니면 **0**",
        "tfₜ,d → wₜ,d: 0 → 0, 1 → 1, 2 → 1.3, 10 → 2, 1000 → 4, …",
        "문서-질의 쌍의 점수: q와 d 모두에 있는 용어 t에 대해 합 — tf-matching-score(q, d) = Σ_{t ∈ q ∩ d} (1 + log tfₜ,d)",
        "질의어가 문서에 하나도 없으면 점수는 0",
      ],
    },
    {
      title: "연습: Jaccard vs tf 점수",
      en: "Exercise",
      lines: [
        "다음 질의-문서 쌍의 Jaccard 매치 점수와 tf 매치 점수를 구하라",
        "q: [information on cars], d: 'all you've ever wanted to know about cars' → Jaccard 1/10, tf 점수 1",
        "q: [information on cars], d: 'information on trucks, information on planes, information on trains' → Jaccard 2/6 = 1/3, tf 점수 (1 + log 3) × 2 ≈ 2.95",
        "q: [red cars and red trucks], d: 'cops stop red cars more often' → Jaccard 2/8 = 1/4 ({red, cars} / 8개), tf 점수 1 + 1 = 2",
        "(풀이는 정리용 — 교안은 문제만 제시)",
      ],
    },
    {
      title: "문서 안 빈도 vs 컬렉션 안 빈도",
      en: "Frequency in document vs. frequency in collection",
      lines: [
        "용어 빈도(문서 안에서 용어의 빈도)에 더해 …",
        "… 컬렉션에서의 용어 빈도도 가중치와 순위에 쓰고 싶다",
      ],
    },
    {
      title: "드문 용어와 흔한 용어의 바람직한 가중치",
      en: "Desired weight for rare / frequent terms",
      lines: [
        "**드문 용어가 흔한 용어보다 정보가 많다**",
        "컬렉션에서 드문 질의어(예: arachnocentric)를 생각해 보자",
        "이 용어를 포함한 문서는 관련 있을 가능성이 매우 높다",
        "→ arachnocentric 같은 드문 용어엔 **높은 가중치**를 원한다",
        "흔한 용어는 드문 용어보다 정보가 적다",
        "컬렉션에서 흔한 질의어(예: good, increase, line)",
        "이 용어를 포함한 문서는 포함하지 않은 문서보다 관련 있을 가능성이 높다 …",
        "… 하지만 good, increase, line 같은 단어는 확실한 관련성 지표가 아니다",
        "→ good, increase, line 같은 흔한 용어엔 **양수 가중치**를 원하지만 …",
        "… 드문 용어보다 **낮은** 가중치를",
      ],
    },
    {
      title: "문서 빈도와 idf 가중치",
      en: "Document frequency · idf weight",
      lines: [
        "arachnocentric 같은 드문 용어엔 높은 가중치, good·increase·line 같은 흔한 단어엔 낮은(양수) 가중치",
        "이것을 매치 점수에 반영하려고 **문서 빈도**를 쓴다",
        "문서 빈도 = 컬렉션에서 그 용어가 나오는 **문서 수**",
        "dfₜ = t가 나오는 문서 수",
        "dfₜ는 용어 t의 정보량의 **역**척도",
        "용어 t의 idf 가중치: **idfₜ = log₁₀(N / dfₜ)** (N = 컬렉션의 문서 수)",
        "idfₜ는 용어의 **정보량** 척도",
        "[N/dfₜ] 대신 [log N/dfₜ]로 idf의 효과를 '**누그러뜨림(dampen)**'",
        "용어 빈도와 문서 빈도 **둘 다 로그 변환**을 쓴다는 점에 주목",
      ],
      table: {
        title: "idf 예 (idfₜ = log₁₀ 1,000,000/dfₜ)",
        headers: ["term", "dfₜ", "idfₜ"],
        rows: [
          ["calpurnia", "1", "6"],
          ["animal", "100", "4"],
          ["sunday", "1000", "3"],
          ["fly", "10,000", "2"],
          ["under", "100,000", "1"],
          ["the", "1,000,000", "0"],
        ],
      },
    },
    {
      title: "idf가 순위에 주는 효과",
      en: "Effect of idf on ranking",
      lines: [
        "idf는 **두 용어 이상**인 질의의 순위에 영향을 준다",
        "예: 질의 'arachnocentric line'에서 idf 가중치는 arachnocentric의 상대 가중치를 **높이고** line의 상대 가중치를 **낮춘다**",
        "idf는 **한 용어 질의**의 순위에는 **거의 영향이 없다**",
      ],
    },
    {
      title: "컬렉션 빈도 vs 문서 빈도",
      en: "Collection frequency vs. Document frequency",
      lines: [
        "insurance: 컬렉션 빈도 **10440**, 문서 빈도 **3997**",
        "try: 컬렉션 빈도 **10422**, 문서 빈도 **8760**",
        "t의 컬렉션 빈도: 컬렉션에서 t의 **토큰 수**",
        "t의 문서 빈도: t가 나오는 **문서 수**",
        "왜 이런 숫자가 나올까? 어느 단어가 더 좋은 검색어(더 높은 가중치)일까? → **insurance**(적은 문서에 집중)",
        "이 예는 가중치에 cf(와 'icf')보다 **df(와 idf)가 낫다**는 것을 보여 준다",
      ],
    },
    {
      title: "tf-idf 가중치",
      en: "tf-idf weighting",
      lines: [
        "용어의 tf-idf 가중치는 그 **tf 가중치와 idf 가중치의 곱**",
        "**wₜ,d = (1 + log tfₜ,d) · log(N / dfₜ)** — 앞부분 = tf-weight, 뒷부분 = idf-weight",
        "정보검색에서 **가장 잘 알려진** 가중치 방식",
        "다른 이름: tf.idf, tf x idf",
        "요약: 각 문서 d의 각 용어 t에 tf-idf 가중치를 매김",
        "tf-idf 가중치는 … 문서 안 출현 횟수와 함께 **증가**(용어 빈도)",
        "… 컬렉션에서 용어가 **드물수록 증가**(역문서 빈도)",
      ],
    },
    {
      title: "연습: 용어·컬렉션·문서 빈도",
      en: "Exercise: Term, collection and document frequency",
      lines: [
        "term frequency tfₜ,d = d에서 t의 출현 횟수 / document frequency dfₜ = t가 나오는 컬렉션 문서 수 / collection frequency cfₜ = 컬렉션에서 t의 총 출현 횟수",
        "df와 cf의 관계? → **df ≤ cf** (문서마다 최소 한 번)",
        "tf와 cf의 관계? → **cfₜ = Σ_d tfₜ,d**, 그래서 tfₜ,d ≤ cfₜ",
        "tf와 df의 관계? → 직접적 크기 관계는 없음(tf는 문서 하나 안, df는 문서 수) — dfₜ = tfₜ,d > 0인 문서 수",
      ],
    },
    {
      title: "이진 → 횟수 → 가중치 행렬",
      en: "Binary → count → weight matrix",
      lines: [
        "각 문서는 이제 tf-idf 가중치의 **실수 벡터** ∈ ℝ^|V|",
      ],
      table: {
        title: "tf-idf weight matrix",
        headers: ["", "Anthony and Cleopatra", "Julius Caesar", "The Tempest", "Hamlet", "Othello", "Macbeth"],
        rows: [
          ["Anthony", "5.25", "3.18", "0.0", "0.0", "0.0", "0.35"],
          ["Brutus", "1.21", "6.10", "0.0", "1.0", "0.0", "0.0"],
          ["Caesar", "8.59", "2.54", "0.0", "1.51", "0.25", "0.0"],
          ["Calpurnia", "0.0", "1.54", "0.0", "0.0", "0.0", "0.0"],
          ["Cleopatra", "2.85", "0.0", "0.0", "0.0", "0.0", "0.0"],
          ["mercy", "1.51", "0.0", "1.90", "0.12", "5.25", "0.88"],
          ["worser", "1.37", "0.0", "0.11", "4.15", "0.25", "1.95"],
        ],
      },
    },
    {
      title: "벡터로서의 문서와 질의",
      en: "Documents as vectors · Queries as vectors",
      lines: [
        "각 문서는 tf-idf 가중치의 실수 벡터 ∈ ℝ^|V|",
        "그래서 **|V|차원 실수 벡터 공간**",
        "**용어는 공간의 축**",
        "**문서는 이 공간의 점 또는 벡터**",
        "매우 고차원: 웹 검색 엔진에 적용하면 **수천만 차원**",
        "각 벡터는 **매우 희소** — 대부분 0",
        "핵심 아이디어 1: 질의도 똑같이 — 고차원 공간의 **벡터**로 표현",
        "핵심 아이디어 2: 문서를 질의와의 **근접도**로 순위",
        "근접도 = 유사도, 근접도 ≈ 음의 거리",
        "다시 떠올리기: 들어오거나 나가거나인 feast-or-famine 불리언 모델에서 벗어나려는 것",
        "대신: 관련 문서를 비관련 문서보다 **높게** 순위",
      ],
    },
    {
      title: "벡터 공간 유사도를 어떻게 형식화하나? · 거리가 나쁜 이유",
      en: "How do we formalize vector space similarity? · Why distance is a bad idea",
      lines: [
        "첫 시도: 두 점 사이의 (음의) 거리 (= 두 벡터 끝점 사이 거리)",
        "유클리드 거리?",
        "유클리드 거리는 **나쁜 생각** … 길이가 다른 벡터 사이에선 **크기** 때문",
        "그림(rich, poor 축): q [rich poor]는 대각선 / d₁ 'Ranks of starving poets swell'은 poor 쪽 / d₂ 'Rich poor gap grows'는 q와 같은 방향의 **긴** 벡터 / d₃ 'Record baseball salaries in 2010'은 rich 쪽",
        "q와 d₂의 **유클리드 거리는 크다** — q와 d₂의 용어 분포가 매우 비슷한데도",
      ],
    },
    {
      title: "거리 대신 각도",
      en: "Use angle instead of distance",
      lines: [
        "질의와의 **각도**로 문서 순위",
        "사고 실험: 문서 d를 자기 자신에 이어 붙여 d′라 하자 — d′는 d의 두 배 길이",
        "'의미상' d와 d′의 내용은 같다",
        "두 문서 사이 각도는 **0** — 최대 유사도에 해당 …",
        "… 두 문서의 유클리드 거리는 꽤 클 수 있는데도",
      ],
    },
    {
      title: "각도에서 코사인으로",
      en: "From angles to cosines",
      lines: [
        "다음 두 개념은 동치:",
        "· 질의와 문서 사이 **각도**로 순위 (각도가 작은 문서가 위)",
        "· **cosine(질의, 문서)**로 순위 (코사인이 큰 문서가 위)",
        "(슬라이드 원문은 'angle … in decreasing order / cosine … in increasing order'로 적혀 있음 — 둘이 서로 반대 방향이라는 게 요점)",
        "코사인은 [0°, 180°] 구간에서 각도의 **단조 감소** 함수 (Cosine 그래프 슬라이드)",
      ],
    },
    {
      title: "길이 정규화",
      en: "Length normalization",
      lines: [
        "코사인은 어떻게 계산하나?",
        "벡터의 각 성분을 그 **길이**로 나누면 (길이) 정규화 — 여기선 **L2 노름** ‖x‖₂ = √(Σᵢ xᵢ²)",
        "이것은 벡터를 **단위 구** 위로 보낸다 …",
        "… 정규화 후엔 ‖x‖₂ = √(Σᵢ xᵢ²) = 1.0이므로",
        "결과: 긴 문서와 짧은 문서의 가중치가 **같은 규모**가 된다",
        "앞 슬라이드의 d와 d′(d를 자기 자신에 이어 붙인 것)는 길이 정규화 후 **똑같은 벡터**",
      ],
    },
    {
      title: "질의와 문서의 코사인 유사도",
      en: "Cosine similarity between query and document",
      lines: [
        "**cos(q, d) = sim(q, d) = q·d / (|q||d|) = Σᵢ qᵢdᵢ / (√Σᵢ qᵢ² · √Σᵢ dᵢ²)**",
        "qᵢ = 질의에서 용어 i의 tf-idf 가중치",
        "dᵢ = 문서에서 용어 i의 tf-idf 가중치",
        "|q|와 |d|는 q와 d의 길이",
        "이것이 q와 d의 **코사인 유사도** … 또는 동치로 q와 d 사이 각도의 코사인",
        "**정규화된 벡터**에선 코사인 = **내적(dot product, scalar product)**: cos(q, d) = q·d = Σᵢ qᵢ·dᵢ",
        "그림: rich-poor 공간에서 q와 d₁, d₂, d₃ 사이 각도 θ",
      ],
    },
    {
      title: "코사인 예: 세 소설",
      en: "Cosine: Example",
      lines: [
        "이 소설들은 얼마나 비슷할까? SaS: Sense and Sensibility / PaP: Pride and Prejudice / WH: Wuthering Heights",
        "(예를 단순하게 하려고 **idf 가중치는 하지 않는다**)",
        "cos(SaS, PaP) ≈ 0.789 × 0.832 + 0.515 × 0.555 + 0.335 × 0.0 + 0.0 × 0.0 ≈ **0.94**",
        "cos(SaS, WH) ≈ **0.79**",
        "cos(PaP, WH) ≈ **0.69**",
        "왜 cos(SaS, PaP) > cos(SaS, WH)일까? (WH에만 있는 wuthering과 gossip 분포 차이)",
      ],
      table: {
        title: "term frequencies → log frequency weighting → & cosine normalization",
        headers: ["term", "SaS", "PaP", "WH"],
        rows: [
          ["affection", "115 → 3.06 → 0.789", "58 → 2.76 → 0.832", "20 → 2.30 → 0.524"],
          ["jealous", "10 → 2.0 → 0.515", "7 → 1.85 → 0.555", "11 → 2.04 → 0.465"],
          ["gossip", "2 → 1.30 → 0.335", "0 → 0 → 0.0", "6 → 1.78 → 0.405"],
          ["wuthering", "0 → 0 → 0.0", "0 → 0 → 0.0", "38 → 2.58 → 0.588"],
        ],
      },
    },
    {
      title: "코사인 점수 계산",
      en: "Computing the cosine score",
      lines: [
        "질의어마다 w(t,q)를 계산하고 포스팅 리스트를 가져와, 각 (d, tf) 쌍마다 Scores[d]에 w(t,d) × w(t,q)를 더한 뒤 Length[d]로 나누고 상위 K를 반환",
      ],
      code: `CosineScore(q)
 1 float Scores[N] = 0
 2 float Length[N]
 3 for each query term t
 4 do calculate w(t,q) and fetch postings list for t
 5    for each pair(d, tf(t,d)) in postings list
 6    do Scores[d] += w(t,d) × w(t,q)
 7 Read the array Length
 8 for each d
 9 do Scores[d] = Scores[d] / Length[d]
10 return Top K components of Scores[]`,
    },
    {
      title: "tf-idf 가중치의 구성요소",
      en: "Components of tf-idf weighting",
      lines: [
        "**가장 잘 알려진 조합**: l (logarithm) · t (idf) · c (cosine) — 슬라이드에서 빨간색",
        "**기본값: 가중치 없음** — n (natural) · n (no) · n (none)",
      ],
      table: {
        title: "SMART 표기",
        headers: ["Term frequency", "Document frequency", "Normalization"],
        rows: [
          ["n (natural): tfₜ,d", "n (no): 1", "n (none): 1"],
          ["l (logarithm): 1 + log(tfₜ,d)", "t (idf): log N/dfₜ", "c (cosine): 1/√(w₁² + w₂² + … + w_M²)"],
          ["a (augmented): 0.5 + 0.5 × tfₜ,d / maxₜ(tfₜ,d)", "p (prob idf): max{0, log (N − dfₜ)/dfₜ}", "u (pivoted unique): 1/u"],
          ["b (boolean): tfₜ,d > 0이면 1, 아니면 0", "", "b (byte size): 1/CharLength^α, α < 1"],
          ["L (log ave): (1 + log tfₜ,d) / (1 + log(aveₜ∈d tfₜ,d))", "", ""],
        ],
      },
    },
    {
      title: "tf-idf 예: lnc.ltn",
      en: "tf-idf example: lnc.ltn",
      lines: [
        "질의와 문서에 **다른 가중치**를 자주 쓴다",
        "표기: **ddd.qqq**",
        "예: **lnc.ltn**",
        "문서: 로그 tf, df 가중치 없음, 코사인 정규화",
        "질의: 로그 tf, idf, 정규화 없음",
        "문서에 idf 가중치를 안 주면 나쁘지 않나?",
        "질의 'best car insurance', 문서 'car insurance auto insurance'",
        "열 설명: tf-raw = 원시 용어 빈도, tf-wght = 로그 가중 용어 빈도, df = 문서 빈도, idf = 역문서 빈도, weight = 질의·문서에서 용어의 최종 가중치, n'lized = 코사인 정규화 후 문서 가중치, product = 최종 질의 가중치 × 최종 문서 가중치",
        "√(1² + 0² + 1² + 1.3²) ≈ 1.92 → 1/1.92 ≈ 0.52, 1.3/1.92 ≈ 0.68",
        "질의와 문서의 최종 유사도 점수: Σᵢ w_qi · w_di = 0 + 0 + 1.04 + 2.04 = **3.08**",
      ],
      table: {
        title: "lnc.ltn",
        headers: ["word", "q tf-raw", "q tf-wght", "df", "idf", "q weight", "d tf-raw", "d tf-wght", "d weight", "d n'lized", "product"],
        rows: [
          ["auto", "0", "0", "5000", "2.3", "0", "1", "1", "1", "0.52", "0"],
          ["best", "1", "1", "50000", "1.3", "1.3", "0", "0", "0", "0", "0"],
          ["car", "1", "1", "10000", "2.0", "2.0", "1", "1", "1", "0.52", "1.04"],
          ["insurance", "1", "1", "1000", "3.0", "3.0", "2", "1.3", "1.3", "0.68", "2.04"],
        ],
      },
    },
    {
      title: "요약: 벡터 공간 모델의 순위 검색",
      en: "Summary: Ranked retrieval in the vector space model",
      lines: [
        "질의를 가중 tf-idf 벡터로 표현",
        "각 문서를 가중 tf-idf 벡터로 표현",
        "질의 벡터와 각 문서 벡터의 코사인 유사도 계산",
        "질의에 대해 문서 순위",
        "상위 K(예: K = 10)를 사용자에게 반환",
        "자료: IIR 6·7장, Vector space for dummies, Exploring the similarity space (Moffat and Zobel, 2005), **Okapi BM25**(최신 가중치 방법, IIR 11.4.3)",
      ],
    },
  ],

  system: [
    {
      title: "목차와 Recap",
      en: "Overview · Recap",
      lines: [
        "목차: ① Recap ② Why rank? ③ More on cosine ④ The complete search system ⑤ Implementation of ranking",
        "Recap: 로그 tf 가중치 wₜ,d = 1 + log₁₀ tfₜ,d (tf > 0, 아니면 0) / idfₜ = log₁₀ N/dfₜ — 용어의 정보량 척도 / tf-idf = 두 가중치의 곱",
        "Recap: 코사인 유사도 = q/|q| · d/|d| — q/|q|와 d/|d|는 길이 1 벡터(정규화) / rich-poor 그림 / lnc.ltn 예(최종 3.08)",
      ],
    },
    {
      title: "Take-away",
      lines: [
        "**순위의 중요성**: Google의 사용자 연구",
        "길이 정규화: **피벗 정규화**",
        "**완전한 검색 시스템**",
        "**순위의 구현**",
      ],
    },
    {
      title: "순위는 왜 그렇게 중요한가?",
      en: "Why is ranking so important?",
      lines: [
        "지난 강의: 순위 없는 검색의 문제",
        "사용자는 결과를 **몇 개만** 보고 싶다 — 수천 개가 아니라",
        "결과가 몇 개만 나오는 질의를 쓰기는 **매우 어렵다** — 전문 검색자에게도",
        "→ 순위는 **큰 결과 집합을 아주 작은 집합으로 효과적으로 줄이므로** 중요",
        "다음: '사용자는 몇 개 결과만 본다'에 대한 더 많은 데이터",
      ],
    },
    {
      title: "순위 효과의 실증 연구",
      en: "Empirical investigation of the effect of ranking",
      lines: [
        "다음 슬라이드들은 Dan Russell의 JCDL 2007 발표에서 — Dan Russell은 Google의 '검색 품질과 사용자 행복의 Über Tech Lead'",
        "순위가 얼마나 중요한지 어떻게 잴까?",
        "통제된 환경에서 검색자를 **관찰**: **녹화**, '**소리 내어 생각**'하게 함, **인터뷰**, **시선 추적**, **시간 측정**, **클릭 기록·집계**",
        "인터뷰 영상: (꽃 배달 과제) 'FTD 공식 사이트를 봤나요?' — '솔직히 보지도 않았어요. 처음에 \"from $20\"을 봤고 $20이 제가 찾던 거였어요 … 1800-flowers가 익숙해서 거기로 갔어요 …' → 사용자는 결과를 대충 훑고 익숙한 것을 클릭",
        "결과를 빠르게 훑기 — 3페이지 훑기 패턴: Result 1 → 2 → 3 → 4 → 3 → 2 → 4 → 5 → 6 <click> / 왜? **나중에 알게 된 것이 앞 내용의 판단에 영향**을 주기 때문",
        "데이터에서 보이는 행동 유형: Short / Nav, Topic exploration, Topic switch, Methodical results exploration, Query reform, Multitasking, Stacking behavior",
      ],
    },
    {
      title: "사용자는 링크를 몇 개나 보나? · 보기 vs 클릭",
      en: "How many links do users view? · Looking vs. Clicking",
      lines: [
        "페이지당 본 요약(abstract) 총수: 1개·2개가 가장 많고 3개부터 급감 — **평균 3.07, 중앙값/최빈값 2.00**, **페이지 넘김 뒤 급감(Dip after page break)**",
        "보기 vs 클릭 그래프(순위별 선택 횟수와 요약에 쓴 평균 시간): 사용자는 **1·2위 결과를 더 자주·더 꼼꼼히** 본다 / 사용자는 **1위를 가장 자주 클릭**한다",
        "Presentation bias — 결과 뒤집기: **제시 순서가 사용자가 어디를 보고 AND 어디를 클릭하는지에 영향** — 정상 순서에선 1위 클릭 약 50%, 2위 약 2% / 1·2위를 바꿔도(더 관련 있는 것이 2위로) 1위 자리 클릭 약 28%, 2위 자리 약 19%",
      ],
    },
    {
      title: "순위의 중요성: 요약",
      en: "Importance of ranking: Summary",
      lines: [
        "요약 보기: 사용자는 **상위(1, 2, 3, 4) 페이지의 요약**을 하위(7, 8, 9, 10)보다 훨씬 더 읽는다",
        "클릭: 분포가 **훨씬 더 치우친다**",
        "**2번에 1번**은 사용자가 **1위 페이지**를 클릭",
        "1위 페이지가 관련 없어도 **30%**는 그것을 클릭",
        "→ **순위를 맞히는 것이 매우 중요**",
        "→ **1위 페이지를 맞히는 것이 가장 중요**",
        "연습: 순위는 검색 엔진 시장에서 기존 강자에 맞서는 경쟁자의 **높은 진입 장벽** 중 하나다 — 왜?",
      ],
    },
    {
      title: "거리가 나쁜 이유 (다시)",
      en: "Why distance is a bad idea",
      lines: [
        "q와 d₂의 유클리드 거리는 크다 — q와 d₂의 용어 분포가 매우 비슷한데도",
        "그래서 **길이 정규화**를 하거나, 동치로 **코사인**으로 질의-문서 매치 점수를 계산한다",
      ],
    },
    {
      title: "연습: 코사인 정규화의 문제",
      en: "Exercise: A problem for cosine normalization",
      lines: [
        "질의 q: 'anti-doping rules Beijing 2008 olympics'",
        "세 문서 비교:",
        "· d₁: 2008 올림픽 도핑 방지 규칙에 관한 **짧은** 문서",
        "· d₂: d₁의 복사본 + 올림픽·도핑과 무관한 다른 뉴스 5개로 된 **긴** 문서",
        "· d₃: 2004 아테네 올림픽 도핑 방지 규칙에 관한 **짧은** 문서",
        "벡터 공간 모델에서 어떤 순위가 예상되나? 어떻게 하면 좋을까? → 코사인 정규화는 긴 d₂를 지나치게 깎아 d₃보다 아래로 보낼 수 있음 → **피벗 정규화**",
      ],
    },
    {
      title: "피벗 정규화",
      en: "Pivot normalization",
      lines: [
        "코사인 정규화는 (평균적으로) **짧은 문서엔 너무 큰, 긴 문서엔 너무 작은** 가중치를 만든다",
        "코사인 정규화를 **선형 조정**: 평균 정규화를 **피벗**을 중심으로 '돌리기'",
        "효과: 짧은 문서와 질의의 유사도는 **감소**, 긴 문서와 질의의 유사도는 **증가**",
        "이것으로 짧은 문서가 가진 **불공정한 이점**을 없앤다",
        "그래프 '예측·실제 관련 확률'(Lillian Lee): x축 문서 길이, y축 관련·검색 '확률' — '참' 관련성(빨간 선)은 길이와 함께 크게 오르는데 코사인 정규화된 검색(파란 점선)은 덜 오름, **교차점(crossing point)**이 있음 → 짧은 문서는 과대, 긴 문서는 과소 검색",
        "그래프 '피벗 정규화': x축 코사인 정규화 인자, y축 피벗 정규화 인자 — 코사인 정규화 직선(기울기 1)을 **피벗**에서 교차하는 덜 가파른 직선(기울기 = tan α)으로 바꿈, 피벗 왼쪽(짧은 문서)은 인자 ↑(점수 ↓), 오른쪽(긴 문서)은 인자 ↓(점수 ↑)",
      ],
      table: {
        title: "Pivoted normalization: Amit Singhal의 실험 (검색된 관련 문서 수 / 평균 정밀도 / 개선)",
        headers: ["Cosine", "slope 0.60", "0.65", "0.70", "0.75", "0.80"],
        rows: [
          ["6,526", "6,342", "6,458", "6,574", "6,629", "6,671"],
          ["0.2840", "0.3024", "0.3097", "0.3144", "0.3171", "0.3162"],
          ["Improvement", "+6.5%", "+9.0%", "+10.7%", "+11.7%", "+11.3%"],
        ],
      },
    },
    {
      title: "완전한 검색 시스템",
      en: "Complete search system",
      lines: [
        "Documents → **Parsing, Linguistics** → **Indexers** → Indexes: **Metadata in zone and field indexes** · **Inexact top K retrieval** · **Tiered inverted positional index** · **k-gram**",
        "Documents → **Document cache**",
        "user query → **Free text query parser** → **Spell correction** → **Scoring and ranking** → **Results page**",
        "**Scoring parameters** ↔ **MLR**(machine-learned ranking) ↔ **training set**",
      ],
    },
    {
      title: "계층 색인",
      en: "Tiered indexes",
      lines: [
        "기본 아이디어:",
        "· 색인 용어의 **중요도에 따라** 여러 계층의 색인을 만든다",
        "· 질의 처리 땐 **최상위 계층 색인부터** 시작",
        "· 최상위 계층이 **최소 k개(예: k = 100)** 결과를 내면: 멈추고 사용자에게 반환",
        "· k개 미만이면: 계층 단계의 **다음 색인**에서 반복",
        "예: 두 계층 시스템 — 1층: 모든 **제목**의 색인 / 2층: 문서의 **나머지**의 색인",
        "제목에 검색어가 있는 페이지가 본문에만 있는 페이지보다 **더 좋은 히트**",
        "그림: Tier 1 — auto: Doc2 / car: Doc1, Doc3 / insurance: Doc2, Doc3 · Tier 2 — best: Doc1, Doc3 · Tier 3 — auto: Doc1 / car: Doc2",
        "계층 색인은 Google 검색 품질이 초기(2000/01)에 경쟁사보다 훨씬 높았던 이유 중 하나로 여겨진다 (PageRank, 앵커 텍스트 사용, 근접 제약과 함께)",
      ],
    },
    {
      title: "지금까지 소개한 구성요소 · 아직 다루지 않은 것",
      en: "Components we have introduced · haven't covered yet",
      lines: [
        "소개함: 문서 전처리(언어적 등), 위치 색인, 계층 색인, 철자 교정, 와일드카드·철자 교정용 k-gram 색인, 질의 처리, 문서 점수 계산",
        "아직: **문서 캐시** — 스니펫(= **동적 요약**) 생성에 필요",
        "아직: **존 색인** — 문서의 여러 존(본문, 문서의 강조 텍스트 전부, 앵커 텍스트, 메타데이터 필드 텍스트 등)마다 색인을 분리",
        "아직: **기계 학습 순위 함수**",
        "아직: **근접 순위** — 예: 질의어가 같은 지역 창 안에 나오는 문서를 질의어가 멀리 떨어진 문서보다 위로",
        "아직: **질의 파서**",
      ],
    },
    {
      title: "벡터 공간 검색: 상호작용",
      en: "Vector space retrieval: Interactions",
      lines: [
        "구 검색을 벡터 공간 검색과 어떻게 결합하나?",
        "가능한 모든 구에 대해 문서 빈도·idf를 계산하고 싶지는 않다 — 왜? (구의 수가 폭발적으로 많음)",
        "불리언 검색을 벡터 공간 검색과 어떻게 결합하나? 예: '+' 제약과 '−' 제약",
        "**후처리 필터링**은 단순하지만 매우 비효율적일 수 있다 — 쉬운 답 없음",
        "와일드카드를 벡터 공간 검색과 어떻게 결합하나? 역시 쉬운 답 없음",
      ],
    },
    {
      title: "연습: 계층 시스템의 설계 기준",
      en: "Exercise: Design criteria for tiered system",
      lines: [
        "각 계층은 다음 계층보다 **한 차수 작아야** 한다",
        "대부분 질의의 상위 100 히트는 1층에, 나머지 질의 대부분의 상위 100 히트는 2층에, …",
        "'이 계층에서 멈춰도 되나, 다음으로 가야 하나?'에 대한 **간단한 테스트**가 필요",
        "어차피 대부분 질의에서 대부분 계층을 거쳐야 한다면 계층화의 **이점이 없다**",
        "1층이 제목을, 2층이 전체를 색인하는 두 계층 시스템을 생각해 보자",
        "질문: 다계층 시스템을 더 잘 설계할 수 있나? 문서의 어떤 '존'(제목, 본문, 그 밖?)을 어느 계층에 색인할까? 문서를 1층에 넣는 기준은 무엇으로?",
      ],
    },
    {
      title: "색인에 용어 빈도도 필요",
      en: "Now we also need term frequencies in the index",
      lines: [
        "Brutus → 1,2 · 7,3 · 83,1 · 87,2 … / Caesar → 1,1 · 5,1 · 13,1 · 17,1 … / Calpurnia → 7,1 · 8,2 · 40,1 · 97,3 (docID, tf)",
        "위치도 필요하다 (여기선 생략)",
        "그래서: 각 포스팅에 docID d와 함께 **tfₜ,d**를 저장",
        "(로그) 가중 **실수가 아니라 정수** 빈도로 …",
        "… **실수는 압축하기 어렵기** 때문",
        "전체 추가 공간은 작다: 포스팅당 **1바이트 이하**",
      ],
    },
    {
      title: "순위에서 top k는 어떻게 구하나?",
      en: "How do we compute the top k in ranking?",
      lines: [
        "보통 **완전한 순위는 필요 없다**",
        "작은 k(예: k = 100)의 **상위 k**만 필요",
        "완전한 순위가 필요 없다면 상위 k만 효율적으로 구할 방법이 있을까?",
        "단순 방법: N개 문서 모두 점수 계산 → 정렬 → 상위 k 반환 — **그리 효율적이지 않음**",
        "대안: **최소 힙(min heap)**",
      ],
    },
    {
      title: "최소 힙으로 N개 중 top k 고르기",
      en: "Use min heap for selecting top k out of N",
      lines: [
        "**이진 최소 힙** = 각 노드의 값이 **자식들의 값보다 작은** 이진 트리",
        "구성에 **O(N log k)** 연산 (N = 문서 수) …",
        "… 그다음 승자 k개를 **O(k log k)** 단계로 읽어 냄",
        "예: 루트 0.6 → 자식 0.85, 0.7 → 손자 0.9, 0.97, 0.8, 0.95",
        "목표: **지금까지 본 상위 k 문서**를 유지 — 이진 최소 힙 사용",
        "점수 s′인 새 문서 d′ 처리: 힙의 현재 최솟값 hₘ 얻기 **O(1)** / s′ ≤ hₘ면 다음 문서로 건너뜀 / s′ > hₘ면 **heap-delete-root O(log k)** / **heap-add d′/s′ O(log k)**",
      ],
    },
    {
      title: "top k를 더 효율적으로?",
      en: "Even more efficient computation of top k?",
      lines: [
        "순위의 시간 복잡도는 **O(N)** (N = 문서 수)",
        "최적화는 상수 인자를 줄이지만 여전히 O(N), N > 10¹⁰",
        "**준선형(sublinear)** 알고리즘이 있을까?",
        "사실상 하는 일: 질의 벡터(= 질의 점)에 대한 **k-최근접 이웃(kNN)** 문제를 푸는 것",
        "이 문제에 대한 **일반적인 준선형 해법은 없다**",
      ],
    },
    {
      title: "top k를 더 효율적으로: 휴리스틱",
      en: "More efficient computation of top k: Heuristics",
      lines: [
        "아이디어 1: **포스팅 리스트 재정렬** — docID 순서 대신 … '**기대 관련성**'의 어떤 척도에 따라",
        "아이디어 2: 탐색 공간을 **가지치기**하는 휴리스틱 — 정확성이 보장되지는 않지만 … **드물게만 실패**",
        "실제로는 **거의 상수 시간**",
        "이를 위해 **문서 단위 처리**와 **용어 단위 처리** 개념이 필요",
      ],
    },
    {
      title: "docID가 아닌 순서의 포스팅 리스트",
      en: "Non-docID ordering of postings lists",
      lines: [
        "지금까지: 포스팅 리스트는 **docID** 순",
        "대안: 페이지의 '좋음'에 대한 **질의 독립적** 척도",
        "예: 페이지 d의 **PageRank g(d)** — 얼마나 많은 '좋은' 페이지가 d에 링크하는지의 척도 (21장)",
        "포스팅 리스트의 문서를 PageRank 순으로: g(d₁) > g(d₂) > g(d₃) > …",
        "문서의 복합 점수: **net-score(q, d) = g(d) + cos(q, d)**",
        "이 방식은 **조기 종료**를 지원: top k를 찾으려고 포스팅 리스트를 끝까지 처리할 필요 없음",
        "가정: (i) g → [0, 1] (ii) 지금 처리 중인 문서 d의 g(d) < 0.1 (iii) 지금까지 찾은 top k 점수 중 가장 작은 것이 1.2",
        "그러면 이후 모든 점수는 **< 1.1** (g < 0.1, cos ≤ 1)",
        "그래서 이미 top k를 찾았고 포스팅 리스트의 나머지 처리를 **멈출 수 있다**",
      ],
    },
    {
      title: "문서 단위 처리",
      en: "Document-at-a-time processing",
      lines: [
        "docID 정렬과 PageRank 정렬은 둘 다 포스팅 리스트의 문서에 **일관된 순서**를 부여",
        "이 방식에서의 코사인 계산은 **문서 단위(document-at-a-time)**",
        "문서 dᵢ의 질의-문서 유사도 점수 계산을 **끝낸 뒤** dᵢ₊₁의 점수 계산을 시작",
        "대안: **용어 단위(term-at-a-time)** 처리",
      ],
    },
    {
      title: "가중치 정렬 포스팅 리스트",
      en: "Weight-sorted postings lists",
      lines: [
        "아이디어: 최종 점수에 기여가 적은 포스팅은 처리하지 말자",
        "포스팅 리스트의 문서를 **가중치** 순으로",
        "가장 단순한 경우: 정규화된 tf-idf 가중치 (드물게 씀: **압축이 어려움**)",
        "top k에 드는 문서는 이렇게 정렬된 리스트의 **앞쪽**에 나올 가능성이 높다",
        "→ 포스팅 리스트 처리 중 **조기 종료**해도 top k가 바뀔 가능성은 낮다",
        "하지만: 포스팅 리스트의 문서에 더 이상 **일관된 순서가 없다**",
        "더 이상 **문서 단위 처리를 쓸 수 없다**",
      ],
    },
    {
      title: "용어 단위 처리",
      en: "Term-at-a-time processing",
      lines: [
        "가장 단순한 경우: 첫 질의어의 포스팅 리스트를 **완전히** 처리",
        "만나는 docID마다 **누산기(accumulator)**를 만든다",
        "그다음 두 번째 질의어의 포스팅 리스트를 완전히 처리",
        "… 그렇게 계속",
        "CosineScore의 배열 'Scores'의 원소를 **누산기**라 부른다",
      ],
      code: `CosineScore(q)
 1 float Scores[N] = 0
 2 float Length[N]
 3 for each query term t
 4 do calculate w(t,q) and fetch postings list for t
 5    for each pair(d, tf(t,d)) in postings list
 6    do Scores[d] += w(t,d) × w(t,q)
 7 Read the array Length
 8 for each d
 9 do Scores[d] = Scores[d] / Length[d]
10 return Top k components of Scores[]`,
    },
    {
      title: "누산기",
      en: "Accumulators",
      lines: [
        "웹(200억 문서)에서는 메모리에 누산기 배열 A를 두는 것이 **불가능**",
        "그래서: **포스팅 리스트에 나오는 문서에만** 누산기를 만든다",
        "동치: 점수가 0인 문서(= 질의어를 하나도 포함하지 않은 문서)엔 누산기를 만들지 않는다",
        "예: Brutus → 1,2 · 7,3 · 83,1 · 87,2 … / Caesar → 1,1 · 5,1 · 13,1 · 17,1 … / Calpurnia → 7,1 · 8,2 · 40,1 · 97,3",
        "질의 [Brutus Caesar]: 누산기는 **1, 5, 7, 13, 17, 83, 87**에만 필요 / 3, 8 등엔 불필요",
      ],
    },
    {
      title: "연언 검색 강제",
      en: "Enforcing conjunctive search",
      lines: [
        "(Google처럼) **연언 검색**을 강제할 수 있다: **모든 용어가 나오는** 문서만 고려(하고 누산기를 만듦)",
        "예: 위 예에서 [Brutus Caesar]의 누산기는 **하나** …",
        "… **d1만 두 단어를 모두** 포함하기 때문",
      ],
    },
    {
      title: "순위 구현: 요약",
      en: "Implementation of ranking: Summary",
      lines: [
        "컬렉션의 모든 문서에 대해 유사도 점수를 계산해야 하는 응용에선 순위가 **매우 비싸다**",
        "대부분 응용에서 주어진 질의에 대해 **거의 모든 문서의 유사도 점수가 0** → 속도를 높일 여지가 많다",
        "하지만 이 경우에도 **정확성이 보장되는 빠른 최근접 이웃 알고리즘은 없다**",
        "실제로는: 탐색 공간을 가지치는 **휴리스틱** — 보통 아주 잘 동작",
        "자료: IIR 6·7장, How Google tweaks its ranking function, Udi Manber 인터뷰, Amit Singhal on Google ranking, SEO 관점의 순위 요인, Yahoo Search BOSS(개발자에게 검색 엔진 개방 — 결과 재순위 가능), Google vs Yahoo 순위 비교, Google의 시선 추적 활용",
      ],
    },
  ],
};
