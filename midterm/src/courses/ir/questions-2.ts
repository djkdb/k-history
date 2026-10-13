import type { Question } from "@/lib/types";

/* IIR 3 · IIR 4 */
export const QUESTIONS_2: Question[] = [
  // dictionary
  { kind: "mc", id: "ir-q-dc-1", concept: "dictionary", q: "용어 어휘(term vocabulary)와 사전(dictionary)의 관계로 옳은 것은?", options: ["둘은 같은 말", "어휘는 데이터, 사전은 그것을 저장하는 자료구조", "사전은 데이터, 어휘는 자료구조", "어휘는 포스팅의 다른 이름"], answer: 1, explain: "교안 정의." },
  { kind: "mc", id: "ir-q-dc-2", concept: "dictionary", q: "고정 폭 사전 항목의 바이트 구성(term / df / pointer)은?", options: ["8 / 4 / 4", "20 / 4 / 4", "20 / 8 / 8", "12 / 4 / 4"], answer: 1, explain: "(20 + 4 + 4) × 400,000 = 11.2MB." },
  { kind: "ox", id: "ir-q-dc-3", concept: "dictionary", q: "Tolerant retrieval deals with the case where there is no exact match between query term and document term.", answer: true, explain: "와일드카드와 철자 교정." },

  // hash-tree
  { kind: "mc", id: "ir-q-ht-1", concept: "hash-tree", q: "해시 사전의 단점이 아닌 것은?", options: ["변형어(résumé) 찾기 불가", "접두사 검색 불가", "어휘 증가 시 재해싱", "조회 시간이 O(log M)"], answer: 3, explain: "해시 조회는 상수 시간. O(log M)은 트리." },
  { kind: "mc", id: "ir-q-ht-2", concept: "hash-tree", q: "트리 사전의 탐색 시간 O(log M)이 성립하는 조건은?", options: ["해시 함수가 좋을 때", "트리가 균형일 때", "어휘가 작을 때", "포스팅이 정렬될 때"], answer: 1, explain: "Only holds for balanced trees." },
  { kind: "ox", id: "ir-q-ht-3", concept: "hash-tree", q: "B-tree의 모든 내부 노드는 자식 수가 구간 [a, b] 안에 있다.", answer: true, explain: "예 [2, 4]." },
  { kind: "ox", id: "ir-q-ht-4", concept: "hash-tree", q: "Lookup in a hash is slower than lookup in a tree.", answer: false, explain: "해시가 더 빠르다(상수 시간)." },
  { kind: "mc", id: "ir-q-ht-5", concept: "hash-tree", q: "이진 트리의 어떤 문제를 B-tree가 완화하나?", options: ["접두사 검색", "비싼 재균형", "변형어 찾기", "해시 충돌"], answer: 1, explain: "Rebalancing binary trees is expensive." },
  { kind: "mc", id: "ir-q-ht-6", concept: "hash-tree", q: "해시와 트리 중 선택하는 기준으로 교안에 없는 것은?", options: ["용어 수가 고정인가 계속 늘어나는가", "키별 접근 빈도", "용어가 몇 개인가", "문서의 평균 길이"], answer: 3, explain: "세 가지 기준." },

  // wildcard-btree
  { kind: "mc", id: "ir-q-wb-1", concept: "wildcard-btree", q: "B-tree로 mon*을 처리할 때 꺼내는 범위는?", options: ["mon ≤ t < moo", "mo ≤ t < mon", "nom ≤ t < non", "m ≤ t < n"], answer: 0, explain: "*mon은 역방향 트리에서 nom ≤ t < non." },
  { kind: "mc", id: "ir-q-wb-2", concept: "wildcard-btree", q: "*mon을 처리하려면 무엇이 추가로 필요한가?", options: ["해시 테이블", "용어를 거꾸로 저장한 트리", "biword 색인", "Soundex 색인"], answer: 1, explain: "Maintain an additional tree for terms backwards." },
  { kind: "ox", id: "ir-q-wb-3", concept: "wildcard-btree", q: "m*nchen을 m*와 *nchen으로 각각 찾아 교집합하는 방법은 비싸다.", answer: true, explain: "그래서 permuterm 색인." },
  { kind: "ox", id: "ir-q-wb-4", concept: "wildcard-btree", q: "와일드카드 처리의 결과는 곧바로 문서 집합이다.", answer: false, explain: "먼저 용어 집합 → 그 용어들을 포함한 문서 검색." },

  // permuterm
  { kind: "short", id: "ir-q-pm-1", concept: "permuterm", q: "permuterm 색인에서 hel*o는 어떤 키로 찾나?", answers: ["o$hel*"], explain: "X*Y → Y$X*." },
  { kind: "short", id: "ir-q-pm-2", concept: "permuterm", q: "permuterm 색인에서 X*는 어떤 키로 찾나? (X 그대로 써서)", answers: ["$x*"], explain: "X*$를 회전 → $X*." },
  { kind: "short", id: "ir-q-pm-3", concept: "permuterm", q: "permuterm 색인에서 *X는 어떤 키로 찾나?", answers: ["x$*"], explain: "*X$ → X$*." },
  { kind: "mc", id: "ir-q-pm-4", concept: "permuterm", q: "hello의 permuterm 회전이 아닌 것은?", options: ["ello$h", "lo$hel", "$hello", "olleh$"], answer: 3, explain: "회전이지 뒤집기가 아니다." },
  { kind: "mc", id: "ir-q-pm-5", concept: "permuterm", q: "permuterm 색인의 단점은?", options: ["후처리 필터링이 필요", "사전 크기가 4배 넘게 커짐", "접두사 검색 불가", "가운데 * 처리 불가"], answer: 1, explain: "경험적으로 more than quadruples." },
  { kind: "ox", id: "ir-q-pm-6", concept: "permuterm", q: "Permuterm index doesn't require postfiltering.", answer: true, explain: "k-gram 색인과 비교." },
  { kind: "short", id: "ir-q-pm-7", concept: "permuterm", q: "permuterm 색인에서 m*nchen은 어떤 키로 찾나?", answers: ["nchen$m*"], explain: "Y$X*." },

  // kgram-index
  { kind: "mc", id: "ir-q-kg-1", concept: "kgram-index", q: "bigram 색인에서 mon*의 불리언 질의는?", options: ["$m AND mo AND on", "mo AND on AND n$", "$mo AND on$", "m AND o AND n"], answer: 0, explain: "그 결과엔 moon 같은 거짓 양성도." },
  { kind: "mc", id: "ir-q-kg-2", concept: "kgram-index", q: "bigram 색인에서 mon*의 거짓 양성으로 교안이 든 예는?", options: ["month", "moon", "monday", "lemon"], answer: 1, explain: "$m, mo, on을 모두 포함하지만 mon으로 시작하지 않음." },
  { kind: "ox", id: "ir-q-kg-3", concept: "kgram-index", q: "k-gram index is more space efficient than permuterm index.", answer: true, explain: "대신 후처리 필터링 필요." },
  { kind: "mc", id: "ir-q-kg-4", concept: "kgram-index", q: "k-gram 색인은 무엇에서 무엇으로 가는 역색인인가?", options: ["용어 → 문서", "k-gram → 용어", "문서 → k-gram", "k-gram → 문서"], answer: 1, explain: "용어-문서 색인과 다른 두 번째 역색인." },
  { kind: "short", id: "ir-q-kg-5", concept: "kgram-index", q: "단어 april의 bigram을 $ 포함해 순서대로 공백으로 쓰라.", answers: ["$a ap pr ri il l$"], explain: "$는 단어 경계." },
  { kind: "ox", id: "ir-q-kg-6", concept: "kgram-index", q: "k-gram 색인으로 찾은 용어는 질의와 다시 대조할 필요 없이 바로 쓴다.", answer: false, explain: "postfilter 필요." },

  // wildcard-cost
  { kind: "mc", id: "ir-q-wc-1", concept: "wildcard-cost", q: "[gen* universit*]의 가장 직관적인 의미는?", options: ["선언(OR)들의 연언(AND)", "연언들의 선언", "단일 용어", "구 질의"], answer: 0, explain: "geneva university OR geneva université OR …" },
  { kind: "mc", id: "ir-q-wc-2", concept: "wildcard-cost", q: "Google이 와일드카드를 제한하는 이유로 교안에 나온 것은?", options: ["유니코드 미지원", "많은 불리언 질의 실행 비용 + 사용자가 줄임 질의를 남발", "B-tree가 없어서", "법적 문제"], answer: 1, explain: "Google Suggest로 다소 완화." },
  { kind: "ox", id: "ir-q-wc-3", concept: "wildcard-cost", q: "교안은 Google Suggest가 와일드카드 줄임 질의 문제를 다소 완화한다고 한다.", answer: true, explain: "Somewhat alleviated by Google Suggest." },

  // edit-distance
  { kind: "short", id: "ir-q-ed-1", concept: "edit-distance", q: "cat과 act의 Levenshtein 거리는?", answers: ["2"], hint: "숫자만", explain: "Damerau-Levenshtein이면 1." },
  { kind: "short", id: "ir-q-ed-2", concept: "edit-distance", q: "cat과 act의 Damerau-Levenshtein 거리는?", answers: ["1"], hint: "숫자만", explain: "전치 1번." },
  { kind: "mc", id: "ir-q-ed-3", concept: "edit-distance", q: "Levenshtein 거리의 기본 연산이 아닌 것은?", options: ["삽입", "삭제", "치환", "전치"], answer: 3, explain: "전치는 Damerau-Levenshtein의 네 번째 연산." },
  { kind: "short", id: "ir-q-ed-4", concept: "edit-distance", q: "dog와 do의 Levenshtein 거리는?", answers: ["1"], hint: "숫자만", explain: "g 삭제." },
  { kind: "short", id: "ir-q-ed-5", concept: "edit-distance", q: "kitten과 sitting의 Levenshtein 거리는?", answers: ["3"], hint: "숫자만", explain: "k→s, e→i 치환, g 삽입." },
  { kind: "ox", id: "ir-q-ed-6", concept: "edit-distance", q: "The edit distance between s1 and s2 is the maximum number of basic operations that convert s1 to s2.", answer: false, explain: "minimum." },

  // levenshtein-dp
  { kind: "short", id: "ir-q-ld-1", concept: "levenshtein-dp", q: "cats와 fast의 Levenshtein 거리는?", answers: ["3"], hint: "숫자만", explain: "표 오른쪽 아래 칸." },
  { kind: "short", id: "ir-q-ld-2", concept: "levenshtein-dp", q: "oslo와 snow의 Levenshtein 거리는?", answers: ["3"], hint: "숫자만", explain: "o 삭제, l→n 치환, w 삽입." },
  { kind: "mc", id: "ir-q-ld-3", concept: "levenshtein-dp", q: "Levenshtein 표에서 '위 이웃'에서 오는 이동은 어떤 연산인가?", options: ["삽입", "삭제", "치환", "복사"], answer: 1, explain: "왼쪽 = 삽입, 대각선 = 복사/치환." },
  { kind: "mc", id: "ir-q-ld-4", concept: "levenshtein-dp", q: "s1[i] = s2[j]일 때 m[i, j]는?", options: ["min{m[i-1,j]+1, m[i,j-1]+1, m[i-1,j-1]}", "min{m[i-1,j]+1, m[i,j-1]+1, m[i-1,j-1]+1}", "m[i-1,j-1]+1", "max{m[i-1,j], m[i,j-1]}"], answer: 0, explain: "대각선은 복사(비용 0)." },
  { kind: "mc", id: "ir-q-ld-5", concept: "levenshtein-dp", q: "동적 계획법의 두 조건(Cormen)은?", options: ["탐욕 선택, 분할 정복", "최적 부분 구조, 겹치는 부분 문제", "재귀, 메모리 제한", "정렬, 이진 탐색"], answer: 1, explain: "부분 문제 = 두 접두사의 편집 거리." },
  { kind: "short", id: "ir-q-ld-6", concept: "levenshtein-dp", q: "cat을 catcat으로 바꾸는 최소 편집 거리는?", answers: ["3"], hint: "숫자만", explain: "삽입 3번 — 삽입 위치에 따라 여러 경로." },
  { kind: "ox", id: "ir-q-ld-7", concept: "levenshtein-dp", q: "oslo → snow의 편집 연산을 읽어 내면 o 삭제, s 복사, l→n 치환, o 복사, w 삽입이다.", answer: true, explain: "1 + 0 + 1 + 0 + 1 = 3." },
  { kind: "ox", id: "ir-q-ld-8", concept: "levenshtein-dp", q: "Levenshtein 표의 첫 행과 첫 열은 모두 0으로 채운다.", answer: false, explain: "0, 1, 2, …로 채운다(빈 문자열과의 거리)." },

  // weighted-edit
  { kind: "mc", id: "ir-q-we-1", concept: "weighted-edit", q: "가중 편집 거리에서 m → n 치환이 m → q 치환보다 거리가 작은 이유는?", options: ["알파벳 순서가 가까워서", "키보드에서 m을 n으로 잘못 칠 가능성이 높아서", "n이 모음이라서", "q가 드물어서"], answer: 1, explain: "키보드 오류를 반영." },
  { kind: "ox", id: "ir-q-we-2", concept: "weighted-edit", q: "가중 편집 거리에는 입력으로 가중치 행렬이 필요하다.", answer: true, explain: "DP를 가중치에 맞게 수정." },
  { kind: "mc", id: "ir-q-we-3", concept: "weighted-edit", q: "편집 거리로 철자 교정할 때의 순서는?", options: ["올바른 단어 목록 → 질의 열거 → 정렬", "거리 이내 문자열 열거 → 올바른 단어 목록과 교집합 → 제안", "질의를 Soundex로 → 제안", "포스팅 교집합 → 제안"], answer: 1, explain: "교안 3단계." },

  // spelling
  { kind: "mc", id: "ir-q-sp-1", concept: "spelling", q: "'an asteroid that fell form the sky'의 form 오타를 잡을 수 있는 방법은?", options: ["고립어 교정", "문맥 기반 교정", "Soundex", "스킵 포인터"], answer: 1, explain: "form은 올바른 단어라 고립어 교정은 못 잡음." },
  { kind: "ox", id: "ir-q-sp-2", concept: "spelling", q: "The general philosophy in IR is: don't change the documents.", answer: true, explain: "문서 교정은 주로 OCR 문서." },
  { kind: "mc", id: "ir-q-sp-3", concept: "spelling", q: "IR에서 문서 교정을 주로 쓰는 대상은?", options: ["웹 페이지", "OCR된 문서", "이메일", "질의 로그"], answer: 1, explain: "OCR = optical character recognition." },
  { kind: "mc", id: "ir-q-sp-4", concept: "spelling", q: "철자 교정의 '올바른 단어' 목록 후보로 교안에 없는 것은?", options: ["표준 사전(Webster's, OED)", "산업별 사전", "적절히 가중한 컬렉션 용어 어휘", "불용어 목록"], answer: 3, explain: "세 후보." },
  { kind: "mc", id: "ir-q-sp-5", concept: "spelling", q: "오타와 올바른 단어 사이 거리 후보가 아닌 것은?", options: ["편집 거리", "가중 편집 거리", "k-gram 겹침", "코사인 유사도"], answer: 3, explain: "교안의 세 가지." },
  { kind: "ox", id: "ir-q-sp-6", concept: "spelling", q: "컬렉션 어휘를 그대로 올바른 단어 목록으로 쓰면 아무 문제가 없다.", answer: false, explain: "컬렉션 속 오타도 '올바른 단어'가 되는 문제." },
  { kind: "mc", id: "ir-q-sp-7", concept: "spelling", q: "Norvig 교정기의 edits1이 만드는 편집 종류가 아닌 것은?", options: ["deletes", "transposes", "replaces", "soundex"], answer: 3, explain: "+ inserts." },

  // kgram-spelling
  { kind: "short", id: "ir-q-ks-1", concept: "kgram-spelling", q: "오타 bordroom의 bigram은 몇 개인가?", answers: ["7"], hint: "숫자만", explain: "bo, or, rd, dr, ro, oo, om ($ 없이)." },
  { kind: "mc", id: "ir-q-ks-2", concept: "kgram-spelling", q: "k-gram 철자 교정에서 후보를 거르는 임계값 기준은?", options: ["편집 거리", "맞는 k-gram 수", "문서 빈도", "단어 길이"], answer: 1, explain: "예: 최대 3개 k-gram까지 다른 용어." },
  { kind: "ox", id: "ir-q-ks-3", concept: "kgram-spelling", q: "bigram bo, or, rd의 포스팅에 공통으로 자주 나오는 boardroom이 bordroom의 교정 후보가 된다.", answer: true, explain: "border도 후보." },

  // context-spelling
  { kind: "mc", id: "ir-q-cx-1", concept: "context-spelling", q: "히트 기반 교정에서 flew form munich의 정답으로 골라지는 구는?", options: ["flea form munich", "flew from munich", "flew form munch", "flea from munch"], answer: 1, explain: "히트가 가장 많다." },
  { kind: "ox", id: "ir-q-cx-2", concept: "context-spelling", q: "히트 기반 알고리즘은 한 번에 여러 단어를 동시에 고친 구만 시도한다.", answer: false, explain: "한 번에 한 단어만 고친 구들을 시도." },
  { kind: "mc", id: "ir-q-cx-3", concept: "context-spelling", q: "히트 기반 교정보다 효율적인 대안은?", options: ["문서 대신 질의 로그(질의 모음)를 봄", "Soundex 사용", "스킵 포인터", "biword 색인"], answer: 0, explain: "look at collection of queries." },
  { kind: "mc", id: "ir-q-cx-4", concept: "context-spelling", q: "'Did you mean'의 한계는?", options: ["너무 느림", "제안이 하나일 때만 동작", "영어에서만", "불용어를 지움"], answer: 1, explain: "여러 교정 후보는?" },
  { kind: "ox", id: "ir-q-cx-5", concept: "context-spelling", q: "교안은 대형 검색 엔진의 철자 교정이 모든 질의에 돌릴 만큼 효율적일 것이라고 추측한다.", answer: true, explain: "Guess." },

  // soundex
  { kind: "short", id: "ir-q-sx-1", concept: "soundex", q: "HERMAN의 Soundex 코드는?", answers: ["h655"], explain: "HERMANN도 H655." },
  { kind: "short", id: "ir-q-sx-2", concept: "soundex", q: "ROBERT의 Soundex 코드는?", answers: ["r163"], explain: "O0 B1 E0 R6 T3 → 01063 → 163." },
  { kind: "short", id: "ir-q-sx-3", concept: "soundex", q: "SMITH의 Soundex 코드는?", answers: ["s530"], explain: "M5 I0 T3 H0 → 5030 → 53 → S530 (0 채움)." },
  { kind: "mc", id: "ir-q-sx-4", concept: "soundex", q: "Soundex에서 C, G, J, K, Q, S, X, Z가 바뀌는 숫자는?", options: ["1", "2", "3", "5"], answer: 1, explain: "BFPV 1, DT 3, L 4, MN 5, R 6." },
  { kind: "mc", id: "ir-q-sx-5", concept: "soundex", q: "Soundex에서 0으로 바뀌는 글자 묶음은?", options: ["A E I O U H W Y", "A E I O U", "H W Y", "L M N R"], answer: 0, explain: "모음 + H, W, Y." },
  { kind: "ox", id: "ir-q-sx-6", concept: "soundex", q: "Soundex는 정보검색에 매우 유용하다.", answer: false, explain: "Not very — Interpol 같은 high recall 작업엔 괜찮음." },
  { kind: "ox", id: "ir-q-sx-7", concept: "soundex", q: "Soundex finds phonetic (as opposed to orthographic) alternatives.", answer: true, explain: "chebyshev / tchebyscheff." },
  { kind: "mc", id: "ir-q-sx-8", concept: "soundex", q: "Soundex 코드의 형태는?", options: ["숫자 4개", "글자 1개 + 숫자 3개", "글자 2개 + 숫자 2개", "가변 길이"], answer: 1, explain: "뒤에 0을 채워 앞 4자리." },

  // hardware
  { kind: "ox", id: "ir-q-hw-1", concept: "hardware", q: "디스크에서 메모리로 옮길 때 작은 덩어리 여러 번이 큰 덩어리 한 번보다 빠르다.", answer: false, explain: "One large chunk is faster." },
  { kind: "mc", id: "ir-q-hw-2", concept: "hardware", q: "교안(2008년경)의 평균 디스크 탐색 시간은?", options: ["5 µs", "5 ms", "0.02 µs", "0.01 µs"], answer: 1, explain: "전송 0.02µs/바이트, 저수준 연산 0.01µs." },
  { kind: "mc", id: "ir-q-hw-3", concept: "hardware", q: "디스크 I/O의 블록 크기로 교안에 나온 범위는?", options: ["1B ~ 8B", "8KB ~ 256KB", "1MB ~ 8MB", "1GB 이상"], answer: 1, explain: "Disk I/O is block-based." },
  { kind: "ox", id: "ir-q-hw-4", concept: "hardware", q: "It's cheaper to use many regular machines than one fault tolerant machine.", answer: true, explain: "Fault tolerance is expensive." },
  { kind: "ox", id: "ir-q-hw-5", concept: "hardware", q: "디스크 탐색 중에도 데이터가 계속 전송된다.", answer: false, explain: "탐색은 '유휴' 시간 — 전송 없음." },

  // rcv1
  { kind: "mc", id: "ir-q-rc-1", concept: "rcv1", q: "Reuters RCV1의 문서 수 N은?", options: ["80,000", "800,000", "8,000,000", "400,000"], answer: 1, explain: "M = 400,000은 용어 수." },
  { kind: "mc", id: "ir-q-rc-2", concept: "rcv1", q: "RCV1의 비위치 포스팅 수 T는?", options: ["10⁶", "10⁷", "10⁸", "10⁹"], answer: 2, explain: "100,000,000." },
  { kind: "short", id: "ir-q-rc-3", concept: "rcv1", q: "RCV1의 문서당 평균 토큰 수 L은?", answers: ["200"], hint: "숫자만", explain: "N × L = 1.6억 토큰." },
  { kind: "mc", id: "ir-q-rc-4", concept: "rcv1", q: "토큰당 4.5바이트인데 타입(용어)당 7.5바이트인 이유는?", options: ["타입에 포인터가 붙어서", "짧은 단어(the, of 등)가 토큰으로 매우 자주 나와서", "타입은 대문자라서", "압축 때문에"], answer: 1, explain: "토큰 평균을 짧은 흔한 단어가 끌어내림." },
  { kind: "ox", id: "ir-q-rc-5", concept: "rcv1", q: "RCV1은 1995~1996년 1년간 전송된 영어 뉴스 기사 컬렉션이다.", answer: true, explain: "교안." },

  // bsbi
  { kind: "mc", id: "ir-q-bs-1", concept: "bsbi", q: "BSBI에서 포스팅 하나의 크기와 구성은?", options: ["8바이트: termID, docID", "12바이트: termID, docID, term frequency", "16바이트: term, docID", "4바이트: docID"], answer: 1, explain: "4 + 4 + 4." },
  { kind: "short", id: "ir-q-bs-2", concept: "bsbi", q: "RCV1에서 블록 하나에 1,000만 포스팅을 담으면 블록은 몇 개인가?", answers: ["10"], hint: "숫자만", explain: "1억 ÷ 1천만." },
  { kind: "mc", id: "ir-q-bs-3", concept: "bsbi", q: "BSBI 블록 처리 순서는?", options: ["디스크에 쓰기 → 정렬 → 모으기", "모으기 → 메모리에서 정렬 → 디스크에 쓰기", "정렬 → 모으기 → 병합", "병합 → 정렬 → 쓰기"], answer: 1, explain: "마지막에 블록 병합." },
  { kind: "ox", id: "ir-q-bs-4", concept: "bsbi", q: "아주 큰 레코드 집합을 디스크에서 그대로 정렬하는 것은 디스크 탐색이 너무 많아 느리다.", answer: true, explain: "그래서 외부 정렬." },
  { kind: "mc", id: "ir-q-bs-5", concept: "bsbi", q: "BSBI의 전제이자 문제점은?", options: ["포스팅을 정렬하지 않음", "사전(term → termID 매핑)을 메모리에 둘 수 있다고 가정", "블록마다 사전이 따로", "MapReduce가 필요"], answer: 1, explain: "SPIMI의 동기." },

  // spimi
  { kind: "mc", id: "ir-q-sp2-1", concept: "spimi", q: "SPIMI의 핵심 아이디어 두 가지는?", options: ["전체 공통 사전, 포스팅 정렬", "블록마다 별도 사전, 정렬하지 않고 포스팅 누적", "MapReduce, 압축", "스킵 포인터, 위치 색인"], answer: 1, explain: "블록마다 완전한 역색인." },
  { kind: "ox", id: "ir-q-sp2-2", concept: "spimi", q: "SPIMI는 메모리가 차면 포스팅 리스트 전체를 docID로 정렬해 디스크에 쓴다.", answer: false, explain: "용어만 정렬(SortTerms). 포스팅은 나오는 순서로 누적." },
  { kind: "mc", id: "ir-q-sp2-3", concept: "spimi", q: "SPIMI-Invert에서 포스팅 리스트가 가득 차면?", options: ["블록을 디스크에 씀", "리스트를 두 배로 늘림", "새 사전을 만듦", "해당 용어를 버림"], answer: 1, explain: "DoublePostingsList." },
  { kind: "mc", id: "ir-q-sp2-4", concept: "spimi", q: "교안의 BSBI·SPIMI 평가는?", options: ["BSBI 현실적, SPIMI 단순", "BSBI 단순, SPIMI 더 현실적", "둘 다 비현실적", "둘 다 분산 전용"], answer: 1, explain: "Take-away." },
  { kind: "ox", id: "ir-q-sp2-5", concept: "spimi", q: "SPIMI 블록들의 병합은 BSBI와 비슷하다.", answer: true, explain: "Merging of blocks is analogous to BSBI." },

  // distributed
  { kind: "mc", id: "ir-q-ds-1", concept: "distributed", q: "분산 색인에서 split을 받아 (term, docID) 쌍을 용어 구간에 나눠 쓰는 기계는?", options: ["마스터", "파서", "인버터", "리듀서만"], answer: 1, explain: "인버터는 한 구간을 모아 정렬." },
  { kind: "mc", id: "ir-q-ds-2", concept: "distributed", q: "인버터의 역할은?", options: ["문서를 split으로 나눔", "한 용어 구간의 모든 쌍을 모아 정렬해 포스팅 리스트로", "작업을 배정", "질의를 처리"], answer: 1, explain: "reduce phase." },
  { kind: "short", id: "ir-q-ds-3", concept: "distributed", q: "노드 1000개가 각각 99.9% 가동인 비장애허용 시스템의 가동률은 약 몇 %인가?", answers: ["37", "37%"], hint: "숫자만", explain: "0.999¹⁰⁰⁰ ≈ 0.37." },
  { kind: "ox", id: "ir-q-ds-4", concept: "distributed", q: "분산 색인에서 마스터 기계는 '안전하다(safe)'고 간주된다.", answer: true, explain: "considered safe." },
  { kind: "mc", id: "ir-q-ds-5", concept: "distributed", q: "파서가 쓰는 용어 구간이 a-f, g-p, q-z일 때 j는?", options: ["1", "2", "3", "26"], answer: 2, explain: "j term-partitions." },
  { kind: "mc", id: "ir-q-ds-6", concept: "distributed", q: "3년마다 고장 나는 서버 100만 대에서 기계 고장 간격은?", options: ["약 1일", "약 1시간", "2분 미만", "1초 미만"], answer: 2, explain: "약 158만 분 ÷ 100만." },

  // mapreduce
  { kind: "mc", id: "ir-q-mr-1", concept: "mapreduce", q: "MapReduce의 map 스키마는?", options: ["(k, list(v)) → output", "input → list(k, v)", "list(k) → v", "output → input"], answer: 1, explain: "reduce: (k, list(v)) → output." },
  { kind: "short", id: "ir-q-mr-2", concept: "mapreduce", q: "d2: C died. d1: C came, C c'ed.를 reduce하면 C의 포스팅은? (형식: d1:?, d2:?)", answers: ["d1:2, d2:1", "d1:2,d2:1", "(d1:2, d2:1)"], explain: "d1에 C 두 번, d2에 한 번." },
  { kind: "mc", id: "ir-q-mr-3", concept: "mapreduce", q: "분산 색인에서 파서와 인버터는 MapReduce의 각각 어느 단계인가?", options: ["reduce / map", "map / reduce", "둘 다 map", "둘 다 reduce"], answer: 1, explain: "map phase → segment files → reduce phase." },
  { kind: "ox", id: "ir-q-mr-4", concept: "mapreduce", q: "MapReduce를 쓰면 분산 부분의 코드를 직접 작성해야 한다.", answer: false, explain: "without having to write code for the distribution part." },
  { kind: "mc", id: "ir-q-mr-5", concept: "mapreduce", q: "Google 색인 시스템의 다른 MapReduce 단계로 교안이 언급한 것은?", options: ["철자 교정", "용어 분할 색인 → 문서 분할 색인 변환", "PageRank 계산", "Soundex 생성"], answer: 1, explain: "Why might a document-partitioned index be preferable?" },

  // dynamic-index
  { kind: "mc", id: "ir-q-dy-1", concept: "dynamic-index", q: "보조 색인 방식에서 삭제된 문서는 어떻게 처리하나?", options: ["즉시 주 색인에서 지움", "무효화 비트 벡터로 걸러 냄", "보조 색인에 음수로 기록", "무시"], answer: 1, explain: "Invalidation bit-vector." },
  { kind: "ox", id: "ir-q-dy-2", concept: "dynamic-index", q: "보조 색인 방식에서 새 문서는 메모리의 작은 보조 색인에 넣고, 검색할 땐 주 색인과 보조 색인을 둘 다 본다.", answer: true, explain: "결과를 합친다." },
  { kind: "mc", id: "ir-q-dy-3", concept: "dynamic-index", q: "보조·주 색인 방식의 문제로 교안에 나온 것은?", options: ["삭제 불가", "잦은 병합과 병합 중 검색 성능 저하", "메모리 사용 없음", "사전 불필요"], answer: 1, explain: "→ 로그 병합." },
  { kind: "ox", id: "ir-q-dy-4", concept: "dynamic-index", q: "교안은 Google이 전체 색인을 자주 완전히 재구축한다고 단언한다.", answer: false, explain: "not clear if Google can do a complete rebuild." },

  // log-merge
  { kind: "mc", id: "ir-q-lm-1", concept: "log-merge", q: "로그 병합의 색인 구축 시간 복잡도는?", options: ["O(T)", "O(T log T)", "O(T²)", "O(log T)"], answer: 1, explain: "보조 색인은 O(T²)." },
  { kind: "mc", id: "ir-q-lm-2", concept: "log-merge", q: "로그 병합에서 유지되는 색인 수는?", options: ["O(1)", "O(log T)", "O(T)", "O(√T)"], answer: 1, explain: "질의 땐 O(log T)개를 합침." },
  { kind: "ox", id: "ir-q-lm-3", concept: "log-merge", q: "로그 병합에서 각 색인은 이전 색인의 두 배 크기이고 가장 작은 Z₀는 메모리에 있다.", answer: true, explain: "I₀, I₁, …은 디스크." },
  { kind: "mc", id: "ir-q-lm-4", concept: "log-merge", q: "보조 색인 크기 a, 병합 n번일 때 총비용 a + 2a + … + na는?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], answer: 2, explain: "a·n(n+1)/2." },
  { kind: "ox", id: "ir-q-lm-5", concept: "log-merge", q: "로그 병합은 병합 비용을 시간에 걸쳐 분할 상환해 사용자가 느끼는 응답 시간 영향을 줄인다.", answer: true, explain: "amortizes the cost." },
  { kind: "mc", id: "ir-q-lm-6", concept: "log-merge", q: "로그 병합의 색인 상태 변화는 무엇과 같은가?", options: ["이진수 카운터", "스택", "해시 충돌", "피보나치 수열"], answer: 0, explain: "I₃I₂I₁I₀ = 0001, 0010, 0011, …" },
];
