import type { Question } from "@/lib/types";

/* IIR 5 */
export const QUESTIONS_3: Question[] = [
  // why-compression
  { kind: "mc", id: "ir-q-wc2-1", concept: "why-compression", q: "사전 압축의 주된 동기는?", options: ["디스크 공간 절약", "메인 메모리에 넣을 만큼 작게", "검색 결과 순위 개선", "철자 교정"], answer: 1, explain: "포스팅 압축은 디스크 공간·읽기 시간." },
  { kind: "ox", id: "ir-q-wc2-2", concept: "why-compression", q: "[Read compressed data and decompress in memory] is faster than [read uncompressed data], given fast decompression.", answer: true, explain: "전제: 해제 알고리즘이 빠르다." },
  { kind: "mc", id: "ir-q-wc2-3", concept: "why-compression", q: "손실 압축으로 볼 수 있는 전처리가 아닌 것은?", options: ["소문자화", "불용어 제거", "Porter 어간 추출", "간격 부호화"], answer: 3, explain: "간격 부호화는 무손실." },
  { kind: "ox", id: "ir-q-wc2-4", concept: "why-compression", q: "색인 압축에서 우리가 주로 하는 것은 손실 압축이다.", answer: false, explain: "주로 무손실." },
  { kind: "ox", id: "ir-q-wc2-5", concept: "why-compression", q: "대형 검색 엔진은 포스팅의 상당 부분을 메모리에 둔다.", answer: true, explain: "교안 참고 사항." },

  // preprocess-effect
  { kind: "mc", id: "ir-q-pe-1", concept: "preprocess-effect", q: "Reuters에서 위치 포스팅을 가장 크게 줄이는 단계는?", options: ["숫자 제거", "대소문자 접기", "불용어 150개 제거", "어간 추출"], answer: 2, explain: "−47%." },
  { kind: "mc", id: "ir-q-pe-2", concept: "preprocess-effect", q: "대소문자 접기·어간 추출이 위치 포스팅을 −0% 줄이는 이유는?", options: ["계산 오류", "위치 포스팅은 토큰마다 하나라 변형을 합쳐도 토큰 수는 그대로", "위치 색인엔 대문자가 없어서", "불용어가 이미 제거돼서"], answer: 1, explain: "비위치는 같은 문서 안 변형이 한 포스팅으로 합쳐져 줄어든다." },
  { kind: "ox", id: "ir-q-pe-3", concept: "preprocess-effect", q: "불용어 제거는 사전(용어 수)을 크게 줄인다.", answer: false, explain: "사전은 −0%. 포스팅을 크게 줄임." },
  { kind: "mc", id: "ir-q-pe-4", concept: "preprocess-effect", q: "불용어 30개 제거가 비위치 포스팅보다 위치 포스팅을 더 많이 줄이는(−14 vs −31) 이유는?", options: ["불용어는 문서 안에서 여러 번 나오기 때문", "불용어가 드물어서", "위치 색인이 더 작아서", "어간 추출 때문"], answer: 0, explain: "토큰 수 감소가 문서 수 감소보다 큼." },
  { kind: "mc", id: "ir-q-pe-5", concept: "preprocess-effect", q: "사전 크기를 줄이는 데 효과적인 두 단계는?", options: ["불용어 30개, 불용어 150개", "대소문자 접기, 어간 추출", "숫자 제거, 불용어", "어간 추출, 불용어"], answer: 1, explain: "각 −17%." },

  // heaps-law
  { kind: "mc", id: "ir-q-hp-1", concept: "heaps-law", q: "Heaps 법칙은?", options: ["cfᵢ ∝ 1/i", "M = kT^b", "idf = log N/df", "M = T/k"], answer: 1, explain: "M = 어휘 크기, T = 토큰 수." },
  { kind: "mc", id: "ir-q-hp-2", concept: "heaps-law", q: "Heaps 법칙의 전형적 매개변수는?", options: ["k ≈ 0.5, 30 ≤ b ≤ 100", "30 ≤ k ≤ 100, b ≈ 0.5", "k = 1, b = 1", "k ≈ 44, b ≈ 2"], answer: 1, explain: "Reuters는 k ≈ 44, b = 0.49." },
  { kind: "ox", id: "ir-q-hp-3", concept: "heaps-law", q: "Heaps' law is linear in log-log space.", answer: true, explain: "log M = log k + b log T." },
  { kind: "ox", id: "ir-q-hp-4", concept: "heaps-law", q: "어휘 크기에는 상한이 있어서 컬렉션이 일정 크기를 넘으면 더 이상 늘지 않는다.", answer: false, explain: "길이 20인 단어만 70²⁰ ≈ 10³⁷개 — 계속 커진다." },
  { kind: "mc", id: "ir-q-hp-5", concept: "heaps-law", q: "처음 10⁴ 토큰에 용어 3000개, 10⁶ 토큰에 30000개일 때 b와 k는?", options: ["b = 0.5, k = 30", "b = 1, k = 0.3", "b = 0.49, k = 44", "b = 2, k = 3"], answer: 0, explain: "10 = 100^b → b = 0.5, k = 3000/100." },
  { kind: "short", id: "ir-q-hp-6", concept: "heaps-law", q: "위 매개변수(k = 30, b = 0.5)로 토큰 4 × 10¹²개 컬렉션의 어휘 크기는? (숫자로, 예: 1000000)", answers: ["60000000", "6e7", "6천만"], explain: "30 × √(4×10¹²) = 30 × 2×10⁶." },
  { kind: "mc", id: "ir-q-hp-7", concept: "heaps-law", q: "Reuters 처음 1,000,020 토큰에서 Heaps 예측과 실제 용어 수는?", options: ["38,323 / 38,365", "44,000 / 40,000", "400,000 / 484,494", "1,000 / 1,020"], answer: 0, explain: "매우 가깝다." },
  { kind: "ox", id: "ir-q-hp-8", concept: "heaps-law", q: "철자 오류를 자동 교정하지 않고 그대로 두면 어휘가 더 빨리 커진다.", answer: true, explain: "오타가 새 용어로." },

  // zipf-law
  { kind: "mc", id: "ir-q-zf-1", concept: "zipf-law", q: "Zipf 법칙에서 가장 흔한 용어가 cf₁번 나오면 세 번째로 흔한 용어는?", options: ["cf₁/2", "cf₁/3", "cf₁/9", "3·cf₁"], answer: 1, explain: "cfᵢ ∝ 1/i." },
  { kind: "ox", id: "ir-q-zf-2", concept: "zipf-law", q: "Zipf 법칙의 핵심 통찰은 흔한 용어가 몇 개, 드문 용어가 매우 많다는 것이다.", answer: true, explain: "Reuters 적합은 좋지 않지만 통찰은 같다." },
  { kind: "mc", id: "ir-q-zf-3", concept: "zipf-law", q: "Zipf 법칙에서 cf는?", options: ["용어가 나오는 문서 수", "컬렉션 전체에서 용어의 출현 횟수", "문서 안 출현 횟수", "용어 길이"], answer: 1, explain: "collection frequency." },
  { kind: "mc", id: "ir-q-zf-4", concept: "zipf-law", q: "log cfᵢ = log c + k log i에서 Zipf의 k는?", options: ["1", "−1", "0.5", "−0.5"], answer: 1, explain: "power law의 예." },
  { kind: "ox", id: "ir-q-zf-5", concept: "zipf-law", q: "Zipf 법칙은 컬렉션 크기에 따른 어휘 크기의 증가를 설명한다.", answer: false, explain: "그건 Heaps. Zipf는 순위-빈도 분포." },

  // dict-string
  { kind: "mc", id: "ir-q-ds2-1", concept: "dict-string", q: "Reuters에서 고정 폭 사전의 크기는?", options: ["7.6MB", "11.2MB", "5.9MB", "40MB"], answer: 1, explain: "(20 + 4 + 4) × 400,000." },
  { kind: "mc", id: "ir-q-ds2-2", concept: "dict-string", q: "사전을 문자열로 저장할 때 용어 포인터가 3바이트인 이유는?", options: ["용어가 3글자라서", "8 × 400,000 위치를 가리키는 데 24비트 미만이면 충분해서", "포스팅이 3개라서", "해시 크기"], answer: 1, explain: "log₂(3.2 × 10⁶) < 24." },
  { kind: "short", id: "ir-q-ds2-3", concept: "dict-string", q: "문자열 사전의 크기 400,000 × (4 + 4 + 3 + 8)는 몇 MB인가?", answers: ["7.6", "7.6mb"], explain: "11.2MB 대비 감소." },
  { kind: "ox", id: "ir-q-ds2-4", concept: "dict-string", q: "영어 용어의 평균 길이는 약 8글자(또는 조금 덜)다.", answer: true, explain: "고정 폭 20바이트는 대부분 낭비." },
  { kind: "mc", id: "ir-q-ds2-5", concept: "dict-string", q: "고정 폭 항목이 나쁜 이유가 아닌 것은?", options: ["대부분 바이트가 낭비", "긴 단어를 담을 수 없음", "1글자 용어에도 20바이트", "용어를 찾을 수 없음"], answer: 3, explain: "찾는 건 가능." },

  // blocking-front
  { kind: "mc", id: "ir-q-bf-1", concept: "blocking-front", q: "블로킹(k = 4)으로 블록당 절약되는 바이트는?", options: ["3", "4", "5", "12"], answer: 2, explain: "12 − (3 + 4) = 5." },
  { kind: "mc", id: "ir-q-bf-2", concept: "blocking-front", q: "Reuters 사전: 블로킹 후, 블로킹 + 앞부분 부호화 후 크기는?", options: ["7.6 / 7.1MB", "7.1 / 5.9MB", "11.2 / 7.6MB", "5.9 / 4.0MB"], answer: 1, explain: "11.2 → 7.6 → 7.1 → 5.9." },
  { kind: "ox", id: "ir-q-bf-3", concept: "blocking-front", q: "블로킹을 하면 용어 조회가 약간 빨라진다.", answer: false, explain: "블록 안은 선형 탐색이라 (약간) 느려진다." },
  { kind: "mc", id: "ir-q-bf-4", concept: "blocking-front", q: "8automata 8automate 9automatic 10automation을 앞부분 부호화하면?", options: ["8automat∗a1⋄e2⋄ic3⋄ion", "automat a e ic ion", "8automata1e2ic3ion", "4automat∗"], answer: 0, explain: "공통 접두사 automat을 한 번만." },
  { kind: "short", id: "ir-q-bf-5", concept: "blocking-front", q: "블로킹(k = 4)으로 Reuters 사전에서 절약되는 총량은 몇 MB인가?", answers: ["0.5", "0.5mb"], explain: "400,000/4 × 5바이트." },
  { kind: "ox", id: "ir-q-bf-6", concept: "blocking-front", q: "블로킹에서는 용어 k개마다 용어 포인터를 하나만 두고 각 용어 앞에 길이를 적는다.", answer: true, explain: "…7systile9syzygetic…" },

  // gap-encoding
  { kind: "short", id: "ir-q-gp-1", concept: "gap-encoding", q: "computer: 283154, 283159, 283202를 간격으로 바꾸면 두 번째·세 번째 값은? (쉼표로)", answers: ["5, 43", "5,43", "5 43"], explain: "283159 − 283154, 283202 − 283159." },
  { kind: "mc", id: "ir-q-gp-2", concept: "gap-encoding", q: "Reuters docID를 고정 길이로 쓸 때 필요한 비트 수는?", options: ["8", "16", "20", "32"], answer: 2, explain: "log₂ 800,000 ≈ 19.6 < 20." },
  { kind: "ox", id: "ir-q-gp-3", concept: "gap-encoding", q: "Gaps for frequent terms are small.", answer: true, explain: "the는 간격 1, 1, 1." },
  { kind: "mc", id: "ir-q-gp-4", concept: "gap-encoding", q: "arachnocentric(252000, 500100) 같은 드문 용어의 간격은?", options: ["작다", "크다", "항상 1", "0"], answer: 1, explain: "248100 — 간격당 약 20비트." },
  { kind: "ox", id: "ir-q-gp-5", concept: "gap-encoding", q: "포스팅 파일은 사전보다 작다.", answer: false, explain: "적어도 10배 크다." },
  { kind: "mc", id: "ir-q-gp-6", concept: "gap-encoding", q: "간격 저장이 가능한 전제는?", options: ["포스팅이 docID 오름차순", "docID가 짝수", "용어가 정렬", "사전이 메모리에"], answer: 0, explain: "Each postings list is ordered in increasing order of docID." },

  // vb-code
  { kind: "short", id: "ir-q-vb-1", concept: "vb-code", q: "간격 5의 VB 코드는? (8비트)", answers: ["10000101"], explain: "7비트에 들어가므로 c = 1." },
  { kind: "short", id: "ir-q-vb-2", concept: "vb-code", q: "130의 VB 코드는? (바이트 두 개, 공백으로)", answers: ["00000001 10000010", "0000000110000010"], explain: "130 = 1 × 128 + 2." },
  { kind: "mc", id: "ir-q-vb-3", concept: "vb-code", q: "VB 코드에서 연속 비트 c가 1인 바이트는?", options: ["첫 바이트", "마지막 바이트", "모든 바이트", "짝수 번째 바이트"], answer: 1, explain: "나머지는 c = 0." },
  { kind: "mc", id: "ir-q-vb-4", concept: "vb-code", q: "824의 VB 코드는?", options: ["00000110 10111000", "10000110 00111000", "00000110 00111000", "11001110 00000000"], answer: 0, explain: "824 = 6 × 128 + 56." },
  { kind: "mc", id: "ir-q-vb-5", concept: "vb-code", q: "VB 해독에서 바이트 값이 128 이상이면?", options: ["n = 128n + 바이트 후 계속", "n = 128n + (바이트 − 128) 후 숫자 완성, n = 0", "무시", "오류"], answer: 1, explain: "마지막 바이트 표시." },
  { kind: "ox", id: "ir-q-vb-6", concept: "vb-code", q: "작은 간격이 많을 때는 바이트 정렬보다 니블(4비트) 정렬이 공간을 덜 낭비한다.", answer: true, explain: "Nibbles do better." },
  { kind: "mc", id: "ir-q-vb-7", concept: "vb-code", q: "VB 코드에서 숫자를 담는 데 쓰는 바이트당 비트 수는?", options: ["8", "7", "4", "1"], answer: 1, explain: "1비트는 연속 비트." },

  // gamma-code
  { kind: "short", id: "ir-q-gm-1", concept: "gamma-code", q: "13의 γ 코드는? (쉼표 없이)", answers: ["1110101"], explain: "길이 1110 + 오프셋 101." },
  { kind: "short", id: "ir-q-gm-2", concept: "gamma-code", q: "1의 γ 코드는?", answers: ["0"], explain: "오프셋이 비어 있어 길이 0의 단항 코드만." },
  { kind: "short", id: "ir-q-gm-3", concept: "gamma-code", q: "5의 γ 코드는? (쉼표 없이)", answers: ["11001"], explain: "101 → 오프셋 01, 길이 2 = 110." },
  { kind: "short", id: "ir-q-gm-4", concept: "gamma-code", q: "γ 코드 1110001이 나타내는 수는?", answers: ["9"], hint: "숫자만", explain: "길이 3, 오프셋 001 → 1001 = 9." },
  { kind: "short", id: "ir-q-gm-5", concept: "gamma-code", q: "3의 단항 코드는?", answers: ["1110"], explain: "1 세 개 + 0." },
  { kind: "mc", id: "ir-q-gm-6", concept: "gamma-code", q: "γ 코드 전체 길이는?", options: ["⌊log₂G⌋", "⌊log₂G⌋ + 1", "2⌊log₂G⌋ + 1", "2⌊log₂G⌋"], answer: 2, explain: "그래서 항상 홀수." },
  { kind: "ox", id: "ir-q-gm-7", concept: "gamma-code", q: "γ codes are always of even length.", answer: false, explain: "always of odd length." },
  { kind: "mc", id: "ir-q-gm-8", concept: "gamma-code", q: "γ 코드의 성질이 아닌 것은?", options: ["prefix-free", "universal", "parameter-free", "byte-aligned"], answer: 3, explain: "비트 단위라 정렬이 안 됨 — VB가 정렬됨." },
  { kind: "ox", id: "ir-q-gm-9", concept: "gamma-code", q: "γ 코드가 최적의 일정 배수 이내라는 결과는 간격의 분포와 무관하다.", answer: true, explain: "그래서 universal." },
  { kind: "mc", id: "ir-q-gm-10", concept: "gamma-code", q: "VB 코드가 γ 코드보다 나은 점은?", options: ["더 많이 압축", "바이트 정렬로 처리가 빠르고 개념이 단순", "prefix-free", "매개변수 없음"], answer: 1, explain: "공간은 조금 더 씀(116 vs 101MB)." },
  { kind: "short", id: "ir-q-gm-11", concept: "gamma-code", q: "130의 γ 코드는? (쉼표 없이)", answers: ["111111100000010"], explain: "길이 7 = 11111110, 오프셋 0000010." },

  // compression-summary
  { kind: "mc", id: "ir-q-cm-1", concept: "compression-summary", q: "Reuters 포스팅 압축 결과의 순서로 옳은 것은?", options: ["32비트 400 → 20비트 250 → VB 116 → γ 101MB", "γ 116 → VB 101", "32비트 250 → 20비트 400", "VB 400 → γ 250"], answer: 0, explain: "γ가 가장 작다." },
  { kind: "mc", id: "ir-q-cm-2", concept: "compression-summary", q: "Reuters의 T/D incidence matrix 크기는?", options: ["400MB", "960MB", "3,600MB", "40,000MB"], answer: 3, explain: "그래서 역색인." },
  { kind: "ox", id: "ir-q-cm-3", concept: "compression-summary", q: "압축된 불리언 검색용 색인은 컬렉션 텍스트 전체 크기의 10~15% 정도다.", answer: true, explain: "단, 위치·빈도 정보를 무시한 수치." },
  { kind: "ox", id: "ir-q-cm-4", concept: "compression-summary", q: "위치와 빈도 정보까지 포함하면 실제 공간 절약은 교안 수치보다 더 커진다.", answer: false, explain: "space savings are less in reality." },
  { kind: "mc", id: "ir-q-cm-5", concept: "compression-summary", q: "Reuters 컬렉션 텍스트(마크업 제외)의 크기는?", options: ["960MB", "3,600MB", "400MB", "101MB"], answer: 0, explain: "XML 마크업 포함 3,600MB." },
];
