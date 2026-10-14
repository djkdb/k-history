import type { Figure, Tone } from "@/lib/types";

/** 분산 색인의 세 구간 (a-f · g-p · q-z) 색 */
const PART: Tone[] = ["sky", "violet", "amber"];

/** 정보검색 그림 — 개념 id → 그림들 */
export const FIGURES: Record<string, Figure[]> = {
  "inverted-index": [
    {
      kind: "graph",
      title: "역색인 = 사전 + 포스팅",
      caption: "괄호 = 문서 빈도(df). 포스팅은 docID **오름차순** — 그래야 교집합을 한 번에 훑는다.",
      w: 340,
      h: 185,
      nodes: [
        { id: "hd", label: "사전 (dictionary)", x: 52, y: 14, w: 100, h: 20, shape: "text" },
        { id: "hp", label: "포스팅 (postings)", x: 222, y: 14, w: 200, h: 20, shape: "text" },
        { id: "t1", label: "Brutus (8)", x: 52, y: 55, w: 84, h: 32, tone: "indigo" },
        { id: "t2", label: "Caesar (9+)", x: 52, y: 105, w: 84, h: 32, tone: "indigo" },
        { id: "t3", label: "Calpurnia (4)", x: 52, y: 155, w: 84, h: 32, tone: "indigo" },
        { id: "p1", label: "1→2→4→11→31→45→173→174", x: 225, y: 55, w: 210, h: 32 },
        { id: "p2", label: "1→2→4→5→6→16→57→132→…", x: 225, y: 105, w: 210, h: 32 },
        { id: "p3", label: "2→31→54→101", x: 225, y: 155, w: 210, h: 32 },
      ],
      edges: [
        { from: "t1", to: "p1" },
        { from: "t2", to: "p2" },
        { from: "t3", to: "p3" },
      ],
    },
  ],
  "incidence-matrix": [
    {
      kind: "grid",
      title: "Brutus AND Caesar AND NOT Calpurnia — 비트 연산",
      caption: "Calpurnia를 먼저 **뒤집고(보수)** 세 줄을 AND → 1이 남은 칸 = Anthony and Cleopatra, Hamlet.",
      cols: ["A&C", "JC", "Tem", "Ham", "Oth", "Mac"],
      rows: ["Brutus", "Caesar", "Calpurnia", "NOT Calp.", "결과"],
      cells: [
        ["1", "1", "0", "1", "0", "0"],
        ["1", "1", "0", "1", "1", "1"],
        ["0", "1", "0", "0", "0", "0"],
        ["1", "0", "1", "1", "1", "1"],
        ["1", "0", "0", "1", "0", "0"],
      ],
      marks: [
        ...[0, 1, 2, 3, 4, 5].map((c) => ({ r: 3, c, tone: "amber" as const })),
        { r: 4, c: 0, tone: "emerald" },
        { r: 4, c: 3, tone: "emerald" },
      ],
      mono: true,
    },
  ],
  intersect: [
    {
      kind: "fields",
      title: "두 포스팅 리스트의 교집합",
      caption: "두 손가락을 앞에서부터 — 같으면 담고 둘 다 전진, 다르면 **작은 쪽만** 전진. 시간 O(x + y).",
      rows: [
        {
          label: "Brutus",
          fields: [1, 2, 4, 11, 31, 45, 173, 174].map((d) => ({ text: String(d), span: 1, tone: d === 2 || d === 31 ? ("emerald" as const) : undefined })),
        },
        {
          label: "Calpurnia",
          fields: [2, 31, 54, 101].map((d) => ({ text: String(d), span: 1, tone: d === 2 || d === 31 ? ("emerald" as const) : undefined })),
        },
        { label: "결과", fields: [{ text: "2", span: 1, tone: "emerald" }, { text: "31", span: 1, tone: "emerald" }] },
      ],
    },
  ],
  "query-opt": [
    {
      kind: "bars",
      title: "AND 질의는 짧은 포스팅부터",
      caption: "중간 결과가 처음부터 작고 계속 줄어든다. 결과가 비면 바로 끝.",
      items: [
        { label: "Caesar", value: 2, tone: "emerald", text: "2개 · ① 먼저" },
        { label: "Calpurnia", value: 4, tone: "amber", text: "4개 · ②" },
        { label: "Brutus", value: 8, tone: "rose", text: "8개 · ③" },
      ],
    },
  ],
  "skip-pointers": [
    {
      kind: "graph",
      title: "스킵 포인터 — 결과에 안 들어갈 칸 건너뛰기",
      caption: "스킵 대상(34)이 상대 docID **이하**일 때만 건너뛴다. 길이 P면 √P개를 고르게.",
      w: 340,
      h: 110,
      nodes: [2, 4, 8, 34, 35, 64, 128].map((d, i) => ({
        id: `n${d}`,
        label: String(d),
        x: 22 + i * 49,
        y: 82,
        w: 28,
        shape: "circle" as const,
        tone: d === 34 || d === 128 ? ("indigo" as const) : ("zinc" as const),
      })),
      edges: [
        ...[2, 4, 8, 34, 35, 64].map((d, i) => ({ from: `n${d}`, to: `n${[4, 8, 34, 35, 64, 128][i]}`, tone: "zinc" as const })),
        { from: "n2", to: "n34", bend: -48, tone: "indigo", label: "skip" },
        { from: "n34", to: "n128", bend: -48, tone: "indigo", label: "skip" },
      ],
    },
  ],
  "positional-index": [
    {
      kind: "grid",
      title: "\"to be\" 찾기 — 문서 4의 위치",
      caption: "to 위치 바로 **다음(+1)**에 be가 있으면 구 매치. 16→17, 190→191, 429→430, 433→434.",
      rows: ["to", "be"],
      cols: ["", "✓", "✓", "", "✓", "✓"],
      cells: [
        ["8", "16", "190", "", "429", "433"],
        ["", "17", "191", "291", "430", "434"],
      ],
      marks: [1, 2, 4, 5].flatMap((c) => [
        { r: 0, c, tone: "emerald" as const },
        { r: 1, c, tone: "emerald" as const },
      ]),
      mono: true,
    },
  ],
  "hash-tree": [
    {
      kind: "graph",
      title: "트리 사전 — 접두사 검색이 된다",
      caption: "알파벳 범위로 내려가므로 'automat로 시작하는 모든 용어'를 한 번에 찾는다. 균형일 때 O(log M).",
      w: 340,
      h: 160,
      nodes: [
        { id: "r", label: "Root", x: 170, y: 22, w: 60, h: 30, tone: "indigo" },
        { id: "am", label: "a-m", x: 90, y: 80, w: 60, h: 30 },
        { id: "nz", label: "n-z", x: 250, y: 80, w: 60, h: 30 },
        { id: "ahu", label: "a-hu", x: 45, y: 138, w: 58, h: 30, tone: "emerald" },
        { id: "hym", label: "hy-m", x: 130, y: 138, w: 58, h: 30, tone: "emerald" },
        { id: "nsh", label: "n-sh", x: 210, y: 138, w: 58, h: 30, tone: "emerald" },
        { id: "siz", label: "si-z", x: 295, y: 138, w: 58, h: 30, tone: "emerald" },
      ],
      edges: [
        { from: "r", to: "am" },
        { from: "r", to: "nz" },
        { from: "am", to: "ahu" },
        { from: "am", to: "hym" },
        { from: "nz", to: "nsh" },
        { from: "nz", to: "siz" },
      ],
    },
  ],
  permuterm: [
    {
      kind: "graph",
      title: "hello의 permuterm — 회전 6개가 모두 hello로",
      caption: "질의 `hel*o` → `$`를 붙이고 `*`가 끝에 오게 회전 → `o$hel*`로 B-tree 접두사 검색.",
      w: 340,
      h: 200,
      nodes: [
        ...["hello$", "ello$h", "llo$he", "lo$hel", "o$hell", "$hello"].map((t, i) => ({
          id: `r${i}`,
          label: t,
          x: 70,
          y: 20 + i * 32,
          w: 96,
          h: 26,
          tone: t === "o$hell" ? ("amber" as const) : ("zinc" as const),
        })),
        { id: "h", label: "hello", x: 262, y: 100, w: 90, h: 40, tone: "indigo" },
      ],
      edges: [0, 1, 2, 3, 4, 5].map((i) => ({ from: `r${i}`, to: "h", tone: "zinc" as const })),
    },
  ],
  "kgram-index": [
    {
      kind: "graph",
      title: "bigram 색인으로 mon* 찾기",
      caption: "세 bigram의 용어 목록을 교집합 → moon 같은 **거짓 양성**이 섞이므로 질의와 다시 대조(후처리 필터링).",
      w: 340,
      h: 150,
      nodes: [
        { id: "q", label: "mon*", x: 45, y: 75, w: 66, h: 34, shape: "pill", tone: "amber" },
        { id: "b1", label: "$m", x: 145, y: 28, w: 54, h: 30, tone: "indigo" },
        { id: "b2", label: "mo", x: 145, y: 75, w: 54, h: 30, tone: "indigo" },
        { id: "b3", label: "on", x: 145, y: 122, w: 54, h: 30, tone: "indigo" },
        { id: "r", label: "month ✓\nmonday ✓\nmoon ✗", x: 272, y: 75, w: 120, h: 70, tone: "emerald" },
      ],
      edges: [
        { from: "q", to: "b1" },
        { from: "q", to: "b2" },
        { from: "q", to: "b3" },
        { from: "b1", to: "r", plain: true },
        { from: "b2", to: "r", label: "AND" },
        { from: "b3", to: "r", plain: true },
      ],
    },
  ],
  "levenshtein-dp": [
    {
      kind: "grid",
      title: "cats → fast 편집 거리 표",
      caption: "칠한 칸이 최소 경로: c→f **치환**(1) · a **복사**(0) · t **삭제**(1) · s **복사**(0) · t **삽입**(1) = **3**. 위 = 삭제, 왼쪽 = 삽입, 대각선 = 복사/치환.",
      cols: ["", "f", "a", "s", "t"],
      rows: ["", "c", "a", "t", "s"],
      cells: [
        ["0", "1", "2", "3", "4"],
        ["1", "1", "2", "3", "4"],
        ["2", "2", "1", "2", "3"],
        ["3", "3", "2", "2", "2"],
        ["4", "4", "3", "2", "3"],
      ],
      marks: [
        { r: 0, c: 0, tone: "emerald" },
        { r: 1, c: 1, tone: "emerald" },
        { r: 2, c: 2, tone: "emerald" },
        { r: 3, c: 2, tone: "emerald" },
        { r: 4, c: 3, tone: "emerald" },
        { r: 4, c: 4, tone: "amber" },
      ],
      mono: true,
    },
  ],
  soundex: [
    {
      kind: "fields",
      title: "HERMAN → H655",
      caption: "첫 글자 유지 → 모음·H·W·Y는 0, 자음은 숫자 → 연속 중복 하나로 → **0 지우기** → 4자리(모자라면 0 채움).",
      rows: [
        { label: "원래", fields: ["H", "E", "R", "M", "A", "N"].map((t, i) => ({ text: t, span: 1, tone: i === 0 ? ("indigo" as const) : undefined })) },
        {
          label: "숫자로 (R 6 · M,N 5)",
          fields: ["H", "0", "6", "5", "0", "5"].map((t, i) => ({ text: t, span: 1, tone: i === 0 ? ("indigo" as const) : t === "0" ? ("zinc" as const) : ("amber" as const) })),
        },
        { label: "0 지우고 4자리", fields: ["H", "6", "5", "5"].map((t, i) => ({ text: t, span: 1, tone: i === 0 ? ("indigo" as const) : ("emerald" as const) })) },
      ],
    },
  ],
  distributed: [
    {
      kind: "graph",
      title: "분산 색인 — 파서(map) → 인버터(reduce)",
      caption: "마스터가 split을 놀고 있는 파서에 배정 → 파서는 (term, docID)를 a-f·g-p·q-z 구간 파일로 → 인버터가 한 구간씩 모아 정렬.",
      w: 340,
      h: 232,
      nodes: [
        ...[0, 1, 2].map((i) => ({ id: `s${i}`, label: "split", x: 36, y: 40 + i * 75, w: 52, h: 30 })),
        ...[0, 1, 2].map((i) => ({ id: `p${i}`, label: "파서", x: 125, y: 40 + i * 75, w: 62, h: 32, tone: "indigo" as const })),
        ...["a-f", "g-p", "q-z"].map((r, i) => ({ id: `v${i}`, label: "인버터", sub: r, x: 290, y: 40 + i * 75, w: 76, h: 40, tone: PART[i] })),
        { id: "m1", label: "map phase", x: 125, y: 222, w: 90, h: 16, shape: "text" as const },
        { id: "m2", label: "reduce phase", x: 290, y: 222, w: 90, h: 16, shape: "text" as const },
      ],
      edges: [
        ...[0, 1, 2].map((i) => ({ from: `s${i}`, to: `p${i}` })),
        // 구간마다 색을 달리해 엇갈리는 선을 따라가게 한다
        ...[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => ({ from: `p${i}`, to: `v${j}`, tone: PART[j] }))),
      ],
    },
  ],
  "log-merge": [
    {
      kind: "grid",
      title: "로그 병합 = 이진수 카운터",
      caption: "Z₀가 n개 차면 I₀로, I₀가 이미 있으면 합쳐서 I₁로 … 각 포스팅은 O(log T)번만 병합 → 전체 O(T log T).",
      cols: ["I₃", "I₂", "I₁", "I₀"],
      rows: ["1번째", "2번째", "3번째", "4번째", "5번째", "6번째"],
      cells: [
        ["0", "0", "0", "1"],
        ["0", "0", "1", "0"],
        ["0", "0", "1", "1"],
        ["0", "1", "0", "0"],
        ["0", "1", "0", "1"],
        ["0", "1", "1", "0"],
      ],
      marks: [
        [0, 3], [1, 2], [2, 2], [2, 3], [3, 1], [4, 1], [4, 3], [5, 1], [5, 2],
      ].map(([r, c]) => ({ r, c, tone: "indigo" as const })),
      mono: true,
    },
  ],
  "heaps-law": [
    {
      kind: "bars",
      title: "Reuters에서 Heaps 법칙 M = 44·T^0.49",
      caption: "토큰이 **10배** 늘 때 어휘는 약 **3배**(10^0.49)만 는다 — 그래도 끝없이 는다.",
      items: [
        { label: "T = 10⁴", value: 4013, text: "≈ 4,000" },
        { label: "T = 10⁵", value: 12400, text: "≈ 12,400" },
        { label: "T = 10⁶", value: 38320, text: "≈ 38,300" },
        { label: "T = 10⁷", value: 118400, text: "≈ 118,000" },
        { label: "T = 10⁸", value: 366000, text: "≈ 366,000" },
      ],
    },
  ],
  "zipf-law": [
    {
      kind: "bars",
      title: "Zipf 법칙 cfᵢ ∝ 1/i",
      caption: "흔한 용어는 몇 개뿐이고 꼬리가 길다 — 드문 용어가 매우 많다.",
      items: [
        { label: "1위 the", value: 60, text: "cf₁", tone: "rose" },
        { label: "2위 of", value: 30, text: "cf₁/2", tone: "amber" },
        { label: "3위 and", value: 20, text: "cf₁/3", tone: "amber" },
        { label: "4위", value: 15, text: "cf₁/4" },
        { label: "5위", value: 12, text: "cf₁/5" },
        { label: "10위", value: 6, text: "cf₁/10", tone: "zinc" },
      ],
    },
  ],
  "blocking-front": [
    {
      kind: "bars",
      title: "Reuters 사전 크기 (MB)",
      items: [
        { label: "고정 폭", value: 11.2, tone: "rose", text: "11.2" },
        { label: "문자열 + 용어 포인터", value: 7.6, tone: "amber", text: "7.6" },
        { label: "+ 블로킹 k = 4", value: 7.1, tone: "sky", text: "7.1" },
        { label: "+ 앞부분 부호화", value: 5.9, tone: "emerald", text: "5.9" },
      ],
    },
    {
      kind: "fields",
      title: "앞부분 부호화 — 공통 접두사는 한 번만",
      rows: [
        { label: "블록 (k = 4)", fields: [{ text: "8automata", span: 9 }, { text: "8automate", span: 9 }, { text: "9automatic", span: 10 }, { text: "10automation", span: 12 }] },
        {
          label: "앞부분 부호화 후",
          fields: [
            { text: "8automat∗", sub: "접두사", span: 9, tone: "indigo" },
            { text: "a", span: 2, tone: "emerald" },
            { text: "1⋄e", span: 3, tone: "emerald" },
            { text: "2⋄ic", span: 4, tone: "emerald" },
            { text: "3⋄ion", span: 5, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "gap-encoding": [
    {
      kind: "fields",
      title: "docID 대신 간격",
      caption: "흔한 용어일수록 간격이 작아 적은 비트로 적을 수 있다.",
      rows: [
        { label: "computer docIDs", fields: ["283047", "283154", "283159", "283202"].map((t) => ({ text: t, span: 1 })) },
        {
          label: "간격",
          fields: [
            { text: "283047", span: 1 },
            { text: "107", span: 1, tone: "emerald" },
            { text: "5", span: 1, tone: "emerald" },
            { text: "43", span: 1, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "vb-code": [
    {
      kind: "fields",
      title: "VB 코드 — 바이트마다 연속 비트 c + 7비트",
      caption: "**마지막 바이트만 c = 1**. 824 = 6 × 128 + 56 → 00000110 10111000.",
      rows: [
        {
          label: "824",
          fields: [
            { text: "0", sub: "c", span: 1.4, tone: "amber" },
            { text: "0000110", sub: "6", span: 7 },
            { text: "1", sub: "c", span: 1.4, tone: "emerald" },
            { text: "0111000", sub: "56", span: 7 },
          ],
        },
        {
          label: "5 (7비트에 들어감)",
          fields: [
            { text: "1", sub: "c", span: 1.4, tone: "emerald" },
            { text: "0000101", sub: "5", span: 7 },
          ],
        },
      ],
    },
  ],
  "gamma-code": [
    {
      kind: "fields",
      title: "γ 코드 = 길이(단항) + 오프셋",
      caption: "오프셋 = 이진수에서 **맨 앞 1을 뗀 것**, 길이 = 오프셋 비트 수를 단항으로. 전체 2⌊log₂G⌋ + 1비트(항상 홀수).",
      rows: [
        {
          label: "13 = 1101",
          fields: [
            { text: "1110", sub: "길이 3 (단항)", span: 4, tone: "amber" },
            { text: "101", sub: "오프셋", span: 3, tone: "emerald" },
          ],
        },
        {
          label: "9 = 1001",
          fields: [
            { text: "1110", sub: "길이 3", span: 4, tone: "amber" },
            { text: "001", sub: "오프셋", span: 3, tone: "emerald" },
          ],
        },
        {
          label: "2 = 10",
          fields: [
            { text: "10", sub: "길이 1", span: 2, tone: "amber" },
            { text: "0", sub: "오프셋", span: 1, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "compression-summary": [
    {
      kind: "bars",
      title: "Reuters 포스팅 크기 (MB)",
      caption: "γ가 가장 작지만 비트 단위라 느릴 수 있고, VB는 바이트 정렬이라 빠르고 단순하다.",
      items: [
        { label: "32비트 정수", value: 400, tone: "rose", text: "400" },
        { label: "20비트", value: 250, tone: "amber", text: "250" },
        { label: "VB 코드", value: 116, tone: "sky", text: "116" },
        { label: "γ 코드", value: 101, tone: "emerald", text: "101" },
      ],
    },
  ],
  idf: [
    {
      kind: "bars",
      title: "idf = log₁₀(1,000,000 / df)",
      caption: "드물수록(df ↓) 가중치 ↑. 모든 문서에 있는 the는 0.",
      items: [
        { label: "calpurnia df 1", value: 6, tone: "emerald", text: "6" },
        { label: "animal 100", value: 4, tone: "emerald", text: "4" },
        { label: "sunday 1,000", value: 3, tone: "sky", text: "3" },
        { label: "fly 10,000", value: 2, tone: "sky", text: "2" },
        { label: "under 100,000", value: 1, tone: "amber", text: "1" },
        { label: "the 1,000,000", value: 0, tone: "rose", text: "0" },
      ],
    },
  ],
  "log-tf": [
    {
      kind: "bars",
      title: "tf → 1 + log₁₀ tf",
      caption: "tf가 1000배 늘어도 가중치는 4배 — 관련성은 빈도에 비례하지 않는다.",
      items: [
        { label: "tf 0", value: 0, tone: "zinc", text: "0" },
        { label: "tf 1", value: 1, text: "1" },
        { label: "tf 2", value: 1.3, text: "1.3" },
        { label: "tf 10", value: 2, text: "2" },
        { label: "tf 1000", value: 4, text: "4" },
      ],
    },
  ],
  "vector-space": [
    {
      kind: "graph",
      title: "rich · poor 두 축의 벡터 공간",
      caption: "d₂는 q와 **방향이 같아** 각도 ≈ 0(코사인 최대)인데, 길어서 유클리드 거리는 크다 → 거리 대신 각도.",
      w: 340,
      h: 232,
      nodes: [
        { id: "o", label: "", x: 30, y: 215, w: 4, h: 4, shape: "text" },
        { id: "rich", label: "rich →", x: 312, y: 222, w: 48, h: 16, shape: "text" },
        { id: "poor", label: "poor ↑", x: 30, y: 10, w: 48, h: 16, shape: "text" },
        { id: "q", label: "q [rich poor]", x: 108, y: 128, w: 82, h: 18, shape: "text" },
        { id: "d2", label: "d₂ Rich poor gap grows", x: 238, y: 26, w: 140, h: 18, shape: "text" },
        { id: "d1", label: "d₁ poets", x: 64, y: 36, w: 52, h: 18, shape: "text" },
        { id: "d3", label: "d₃ baseball", x: 290, y: 192, w: 72, h: 18, shape: "text" },
      ],
      edges: [
        { from: "o", to: "rich", tone: "zinc", plain: true },
        { from: "o", to: "poor", tone: "zinc", plain: true },
        { from: "o", to: "q", tone: "indigo" },
        { from: "o", to: "d2", tone: "emerald" },
        { from: "o", to: "d1", tone: "zinc" },
        { from: "o", to: "d3", tone: "zinc" },
      ],
    },
  ],
  cosine: [
    {
      kind: "stack",
      title: "코사인 계산 순서",
      layers: [
        { label: "tf-idf 벡터 만들기", note: "질의 q, 문서 d", tone: "zinc" },
        { label: "L2 노름으로 나누기", note: "‖x‖₂ = √Σxᵢ² → 길이 1(단위 구)", tone: "sky" },
        { label: "내적 Σ qᵢ·dᵢ", note: "정규화된 벡터면 코사인 = 내적", tone: "indigo" },
        { label: "코사인 큰 순으로 정렬", note: "= 각도 작은 순", tone: "emerald" },
      ],
    },
  ],
  "top-k-heap": [
    {
      kind: "graph",
      title: "이진 최소 힙 — 루트가 현재 top k의 꼴찌",
      caption: "새 점수 s′ ≤ 루트면 버리고, 크면 루트를 빼고 s′를 넣는다(각 O(log k)). 전체 O(N log k).",
      w: 340,
      h: 165,
      nodes: [
        { id: "a", label: "0.6", x: 170, y: 24, w: 42, shape: "circle", tone: "amber" },
        { id: "b", label: "0.85", x: 95, y: 82, w: 42, shape: "circle" },
        { id: "c", label: "0.7", x: 245, y: 82, w: 42, shape: "circle" },
        { id: "d", label: "0.9", x: 50, y: 140, w: 42, shape: "circle" },
        { id: "e", label: "0.97", x: 135, y: 140, w: 42, shape: "circle" },
        { id: "f", label: "0.8", x: 205, y: 140, w: 42, shape: "circle" },
        { id: "g", label: "0.95", x: 290, y: 140, w: 42, shape: "circle" },
      ],
      edges: [
        { from: "a", to: "b", plain: true },
        { from: "a", to: "c", plain: true },
        { from: "b", to: "d", plain: true },
        { from: "b", to: "e", plain: true },
        { from: "c", to: "f", plain: true },
        { from: "c", to: "g", plain: true },
      ],
    },
  ],
  "tiered-index": [
    {
      kind: "stack",
      title: "계층 색인 — 위에서부터 찾고 모자라면 내려간다",
      top: "먼저 찾는다",
      bottom: "k개가 모자랄 때만",
      layers: [
        { label: "Tier 1 · 제목 색인", note: "k개(예: 100) 이상 → 여기서 멈춤", tone: "emerald" },
        { label: "Tier 2 · 나머지 본문", note: "모자라면 여기까지", tone: "sky" },
        { label: "Tier 3 · …", tone: "zinc" },
      ],
    },
  ],
  "complete-system": [
    {
      kind: "graph",
      title: "완전한 검색 시스템",
      caption: "문서 캐시는 결과 페이지의 **스니펫(동적 요약)**을 만들 때 쓴다. 점수 매개변수는 학습 집합으로 MLR이 정한다.",
      w: 340,
      h: 300,
      nodes: [
        { id: "doc", label: "문서", x: 42, y: 30, w: 62, h: 40, shape: "db" },
        { id: "parse", label: "파싱·\n언어 처리", x: 150, y: 30, w: 90, h: 40 },
        { id: "q", label: "사용자 질의", x: 280, y: 30, w: 96, h: 32, shape: "pill", tone: "sky" },
        { id: "cache", label: "문서\n캐시", x: 42, y: 100, w: 62, h: 44, shape: "db" },
        { id: "idxr", label: "색인기", x: 150, y: 100, w: 90, h: 32 },
        { id: "qp", label: "자유 텍스트\n질의 파서", x: 280, y: 100, w: 96, h: 40 },
        { id: "idx", label: "색인: 존·필드 · 계층 위치\n부정확 top K · k-gram", x: 120, y: 172, w: 200, h: 48, tone: "indigo" },
        { id: "spell", label: "철자 교정", x: 284, y: 172, w: 88, h: 32 },
        { id: "mlr", label: "MLR", sub: "(학습 집합)", x: 60, y: 245, w: 90, h: 40, tone: "violet" },
        { id: "rank", label: "점수 계산·순위", x: 210, y: 245, w: 120, h: 34, tone: "amber" },
        { id: "res", label: "결과 페이지", x: 278, y: 288, w: 104, h: 22, tone: "emerald" },
      ],
      edges: [
        { from: "doc", to: "parse" },
        { from: "doc", to: "cache" },
        { from: "parse", to: "idxr" },
        { from: "idxr", to: "idx" },
        { from: "q", to: "qp" },
        { from: "qp", to: "spell" },
        { from: "spell", to: "rank" },
        { from: "idx", to: "rank" },
        { from: "mlr", to: "rank", label: "매개변수" },
        { from: "rank", to: "res" },
      ],
    },
  ],
  "ranking-importance": [
    {
      kind: "bars",
      title: "Presentation bias — 1·2위를 바꿔도 위쪽을 누른다",
      caption: "Google 사용자 연구 그래프에서 읽은 **대략값**. 더 관련 있는 결과를 2위로 내려도 1위 자리 클릭이 더 많다.",
      unit: "%",
      items: [
        { label: "정상 · 1위", value: 52, tone: "indigo", text: "≈ 52%" },
        { label: "정상 · 2위", value: 2, tone: "zinc", text: "≈ 2%" },
        { label: "바꿈 · 1위 자리", value: 28, tone: "indigo", text: "≈ 28%" },
        { label: "바꿈 · 2위 자리", value: 20, tone: "zinc", text: "≈ 20%" },
      ],
    },
  ],
  accumulators: [
    {
      kind: "fields",
      title: "[Brutus Caesar]의 누산기",
      caption: "포스팅에 나오는 문서에만 누산기를 만든다(합집합 7개). 연언 검색을 강제하면 둘 다 있는 **1**번 하나.",
      rows: [
        { label: "Brutus", fields: ["1", "7", "83", "87"].map((t) => ({ text: t, span: 1, tone: t === "1" ? ("emerald" as const) : undefined })) },
        { label: "Caesar", fields: ["1", "5", "13", "17"].map((t) => ({ text: t, span: 1, tone: t === "1" ? ("emerald" as const) : undefined })) },
        {
          label: "누산기",
          fields: ["1", "5", "7", "13", "17", "83", "87"].map((t) => ({ text: t, span: 1, tone: t === "1" ? ("emerald" as const) : ("indigo" as const) })),
        },
      ],
    },
  ],
};
