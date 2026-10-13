import type { Question } from "@/lib/types";

/* IIR 1 · IIR 2 */
export const QUESTIONS_1: Question[] = [
  // ir-definition
  { kind: "mc", id: "ir-q-def-1", concept: "ir-definition", q: "교안의 정보검색(IR) 정의에 들어가지 않는 것은?", options: ["unstructured nature (usually text)", "information need", "large collections", "structured records with fixed fields"], answer: 3, explain: "정형 레코드는 DB의 대상. IR은 비정형 자료." },
  { kind: "ox", id: "ir-q-def-2", concept: "ir-definition", q: "IR is finding material of a structured nature (usually database records) that satisfies an information need from within large collections.", answer: false, explain: "unstructured nature (usually text)." },
  { kind: "ox", id: "ir-q-def-3", concept: "ir-definition", q: "교안의 1996년 그래프에서 시가총액(Market Cap)은 비정형 데이터 쪽이 정형 데이터 쪽보다 컸다.", answer: false, explain: "1996년엔 정형(DB)이 압도적, 2006년에 비정형이 앞섬." },
  { kind: "short", id: "ir-q-def-4", concept: "ir-definition", q: "IR이 만족시키려는 사용자의 필요를 교안은 무엇이라 부르는가? (영어 2단어)", answers: ["information need", "정보 요구"], explain: "information need." },

  // incidence-matrix
  { kind: "short", id: "ir-q-inc-1", concept: "incidence-matrix", q: "110100 AND 110111 AND 101111의 결과는?", answers: ["100100"], explain: "Brutus AND Caesar AND NOT Calpurnia → Anthony and Cleopatra, Hamlet." },
  { kind: "mc", id: "ir-q-inc-2", concept: "incidence-matrix", q: "Brutus AND Caesar AND NOT Calpurnia를 출현 벡터로 계산할 때 Calpurnia 벡터에 먼저 하는 일은?", options: ["그대로 AND", "보수(complement)를 취함", "OR로 합침", "오른쪽으로 이동"], answer: 1, explain: "010000 → 101111." },
  { kind: "mc", id: "ir-q-inc-3", concept: "incidence-matrix", q: "grep이 셰익스피어 질의의 해답이 아닌 이유로 교안에 없는 것은?", options: ["큰 컬렉션에서 느림", "grep은 줄 단위, IR은 문서 단위", "'not Calpurnia'가 간단치 않음", "grep은 영어를 지원하지 않음"], answer: 3, explain: "near 같은 연산이 불가능하다는 점도 이유." },
  { kind: "mc", id: "ir-q-inc-4", concept: "incidence-matrix", q: "N = 10⁶ 문서, M = 500,000 용어일 때 용어-문서 행렬의 칸 수는?", options: ["5억", "50억", "5천억", "5조"], answer: 2, explain: "500,000 × 10⁶ = 5 × 10¹¹ = half a trillion." },
  { kind: "ox", id: "ir-q-inc-5", concept: "incidence-matrix", q: "큰 컬렉션의 용어-문서 행렬은 1이 대부분이라 조밀(dense)하다.", answer: false, explain: "1은 최대 10억 개 — 극도로 희소(sparse)." },
  { kind: "mc", id: "ir-q-inc-6", concept: "incidence-matrix", q: "문서 10⁶개, 문서당 1000토큰, 토큰당 6바이트인 컬렉션의 크기는 약?", options: ["6MB", "600MB", "6GB", "6TB"], answer: 2, explain: "10⁹ 토큰 × 6바이트 = 6 × 10⁹." },

  // inverted-index
  { kind: "mc", id: "ir-q-inv-1", concept: "inverted-index", q: "역색인에서 용어마다 매달린 docID 목록을 무엇이라 하는가?", options: ["dictionary", "postings list", "incidence vector", "skip list"], answer: 1, explain: "용어 목록이 dictionary." },
  { kind: "ox", id: "ir-q-inv-2", concept: "inverted-index", q: "역색인의 포스팅 리스트는 docID 순으로 정렬해 두지 않아도 교집합 알고리즘이 그대로 동작한다.", answer: false, explain: "선형 교집합은 정렬이 전제." },
  { kind: "mc", id: "ir-q-inv-3", concept: "inverted-index", q: "역색인이 큰 컬렉션에서 행렬보다 나은 이유는?", options: ["0만 기록해서", "1만(용어가 나오는 문서만) 기록해서", "단어 순서를 저장해서", "문서를 압축해서"], answer: 1, explain: "We only record the 1s." },
  { kind: "short", id: "ir-q-inv-4", concept: "inverted-index", q: "한 용어가 나오는 문서의 수를 무엇이라 하는가? (영어 2단어)", answers: ["document frequency", "df", "문서 빈도"], explain: "사전에 함께 저장." },

  // index-steps
  { kind: "mc", id: "ir-q-ist-1", concept: "index-steps", q: "역색인 구축 4단계의 순서로 옳은 것은?", options: ["토큰화 → 수집 → 색인 → 전처리", "수집 → 토큰화 → 언어 전처리 → 색인", "수집 → 전처리 → 토큰화 → 색인", "색인 → 수집 → 토큰화 → 전처리"], answer: 1, explain: "Collect → Tokenize → Normalize → Index." },
  { kind: "mc", id: "ir-q-ist-2", concept: "index-steps", q: "Doc 1·Doc 2 예제에서 caesar의 문서 빈도와 포스팅은? (Doc 2에 두 번 나옴)", options: ["df 3, 1 → 2 → 2", "df 2, 1 → 2", "df 1, 2", "df 3, 1 → 2"], answer: 1, explain: "같은 문서의 중복은 하나로 합친다." },
  { kind: "ox", id: "ir-q-ist-3", concept: "index-steps", q: "(term, docID) 쌍은 docID 기준으로 먼저 정렬하고, docID가 같으면 용어 기준으로 정렬한다.", answer: false, explain: "용어 기준이 먼저, 같으면 docID 기준." },
  { kind: "short", id: "ir-q-ist-4", concept: "index-steps", q: "Friends, Romans, countrymen을 정규화한 색인 용어 세 개를 공백으로 구분해 쓰라.", answers: ["friend roman countryman"], explain: "소문자화 + 기본형." },
  { kind: "mc", id: "ir-q-ist-5", concept: "index-steps", q: "예제(Doc 1, Doc 2)에서 df가 2가 아닌 용어는?", options: ["brutus", "the", "was", "capitol"], answer: 3, explain: "capitol은 Doc 1에만." },

  // intersect
  { kind: "short", id: "ir-q-int-1", concept: "intersect", q: "Brutus 1 2 4 11 31 45 173 174와 Calpurnia 2 31 54 101의 교집합은? (쉼표로)", answers: ["2, 31", "2,31", "2 31"], explain: "두 포인터 병합." },
  { kind: "mc", id: "ir-q-int-2", concept: "intersect", q: "Intersect 알고리즘에서 docID(p1) < docID(p2)일 때 하는 일은?", options: ["둘 다 전진", "p1만 전진", "p2만 전진", "answer에 추가"], answer: 1, explain: "작은 쪽만 전진." },
  { kind: "mc", id: "ir-q-int-3", concept: "intersect", q: "두 포스팅 리스트 길이가 x, y일 때 교집합 시간 복잡도는?", options: ["O(x · y)", "O(x + y)", "O(log x + log y)", "O(1)"], answer: 1, explain: "Linear in the length of the postings lists." },
  { kind: "short", id: "ir-q-int-4", concept: "intersect", q: "france 1 2 3 4 5 7 8 9 11 12 13 14 15, paris 2 6 10 12 14, lear 12 15일 때 (paris AND NOT france) OR lear의 결과는? (쉼표로)", answers: ["6, 10, 12, 15", "6,10,12,15", "6 10 12 15"], explain: "paris − france = {6, 10}, ∪ {12, 15}." },
  { kind: "ox", id: "ir-q-int-5", concept: "intersect", q: "Brutus AND Calpurnia 처리에서는 두 포스팅 리스트의 합집합을 구해 반환한다.", answer: false, explain: "AND는 교집합(intersection)." },

  // boolean-model
  { kind: "ox", id: "ir-q-bm-1", concept: "boolean-model", q: "Simple Boolean retrieval returns matching documents ranked by relevance.", answer: false, explain: "단순 불리언은 순서 없이(in no particular order) 반환." },
  { kind: "mc", id: "ir-q-bm-2", concept: "boolean-model", q: "Google 결과에 질의어 wᵢ가 없는데도 나오는 경우로 교안에 없는 것은?", options: ["앵커 텍스트", "변형어(형태·철자 교정·동의어)", "긴 질의", "문서가 최근에 수정됨"], answer: 3, explain: "+ 불리언 결과가 너무 적을 때." },
  { kind: "mc", id: "ir-q-bm-3", concept: "boolean-model", q: "불리언 모델은 각 문서를 무엇으로 보는가?", options: ["단어의 순서열", "용어의 집합", "tf-idf 벡터", "확률 분포"], answer: 1, explain: "Views each document as a set of terms." },
  { kind: "ox", id: "ir-q-bm-4", concept: "boolean-model", q: "Google의 기본 해석에서 [w1 w2 … wn]은 w1 AND w2 AND … AND wn이다.", answer: true, explain: "교안 그대로." },
  { kind: "ox", id: "ir-q-bm-5", concept: "boolean-model", q: "불리언 모델은 문서가 조건에 맞는지 안 맞는지만 따지므로 precise하다.", answer: true, explain: "Is precise." },

  // westlaw
  { kind: "mc", id: "ir-q-wl-1", concept: "westlaw", q: "Westlaw에서 /s의 의미는?", options: ["3단어 이내", "같은 문장 안", "같은 문단 안", "공백(OR)"], answer: 1, explain: "/3 = 3단어, /p = 문단." },
  { kind: "ox", id: "ir-q-wl-2", concept: "westlaw", q: "In Westlaw, space is conjunction (AND).", answer: false, explain: "Space is disjunction (OR)." },
  { kind: "mc", id: "ir-q-wl-3", concept: "westlaw", q: "전문 검색자가 불리언 검색을 좋아하는 세 가지 이유는?", options: ["speed, cost, recall", "precision, transparency, control", "ranking, snippets, spelling", "recall, ranking, speed"], answer: 1, explain: "교안 그대로." },
  { kind: "short", id: "ir-q-wl-4", concept: "westlaw", q: "Westlaw 서비스가 시작된 해는?", answers: ["1975"], hint: "숫자만", explain: "순위 검색은 1992년부터." },
  { kind: "mc", id: "ir-q-wl-5", concept: "westlaw", q: "Westlaw의 불리언 검색 이름은?", options: ["Terms and Connectors", "Natural Language", "Proximity Rank", "Smart Search"], answer: 0, explain: "2005년에도 기본값." },

  // query-opt
  { kind: "mc", id: "ir-q-qo-1", concept: "query-opt", q: "Brutus(8개), Calpurnia(4개), Caesar(2개)의 AND 질의 최적 처리 순서는?", options: ["Brutus → Calpurnia → Caesar", "Caesar → Calpurnia → Brutus", "Calpurnia → Caesar → Brutus", "순서 무관"], answer: 1, explain: "빈도 오름차순." },
  { kind: "ox", id: "ir-q-qo-2", concept: "query-opt", q: "AND 질의는 가장 긴 포스팅 리스트부터 처리하는 것이 효율적이다.", answer: false, explain: "가장 짧은 것부터 — 중간 결과가 작게 유지." },
  { kind: "mc", id: "ir-q-qo-3", concept: "query-opt", q: "(madding OR crowd) AND (ignoble OR strife)에서 각 OR의 크기를 추정하는 방법은?", options: ["빈도의 곱", "빈도의 합 (보수적)", "빈도의 최솟값", "빈도의 평균"], answer: 1, explain: "합 = 상한(보수적 추정)." },
  { kind: "ox", id: "ir-q-qo-4", concept: "query-opt", q: "최적화된 Intersect는 중간 결과(result)가 비면 남은 용어를 처리하지 않고 끝낸다.", answer: true, explain: "while terms ≠ nil and result ≠ nil." },

  // document-unit
  { kind: "mc", id: "ir-q-du-1", concept: "document-unit", q: "문서의 형식·언어·문자 집합 판별을 교안은 어떤 문제로 보나?", options: ["정렬 문제", "분류 문제", "압축 문제", "군집 문제"], answer: 1, explain: "IIR 13에서. 대안은 휴리스틱." },
  { kind: "ox", id: "ir-q-du-2", concept: "document-unit", q: "'문서란 무엇인가'는 사소하며 설계 결정이 필요 없다.", answer: false, explain: "Not trivial, requires design decisions." },
  { kind: "ox", id: "ir-q-du-3", concept: "document-unit", q: "하나의 색인에는 보통 한 언어의 용어만 들어 있다.", answer: false, explain: "A single index usually contains terms of several languages." },

  // word-term-token
  { kind: "short", id: "ir-q-wt-1", concept: "word-term-token", q: "'In June, the dog likes to chase the cat in the barn.'의 word token 수는?", answers: ["12"], hint: "숫자만", explain: "type은 9." },
  { kind: "short", id: "ir-q-wt-2", concept: "word-term-token", q: "같은 문장의 word type 수는? (대소문자는 하나로)", answers: ["9"], hint: "숫자만", explain: "in, the가 두 번씩 → 12 − 3." },
  { kind: "mc", id: "ir-q-wt-3", concept: "word-term-token", q: "'An instance of a word or term occurring in a document'의 정의에 해당하는 것은?", options: ["Word", "Term", "Token", "Type"], answer: 2, explain: "Type = token의 동치류." },
  { kind: "mc", id: "ir-q-wt-4", concept: "word-term-token", q: "'A normalized word; an equivalence class of words'는?", options: ["Token", "Term", "Posting", "Lemma"], answer: 1, explain: "Term." },
  { kind: "ox", id: "ir-q-wt-5", concept: "word-term-token", q: "Type은 문서에 나타난 word의 한 번의 출현(instance)이다.", answer: false, explain: "그건 token. Type은 token의 동치류." },

  // tokenization
  { kind: "mc", id: "ir-q-tk-1", concept: "tokenization", q: "和尚이 보여 주는 토큰화 문제는?", options: ["합성어", "모호한 분할", "양방향성", "숫자 형식"], answer: 1, explain: "'스님' 한 단어 또는 '그리고'+'아직'." },
  { kind: "ox", id: "ir-q-tk-2", concept: "tokenization", q: "아랍어의 양방향성은 텍스트가 유니코드로 부호화되어 있으면 문제가 아니다.", answer: true, explain: "교안 그대로." },
  { kind: "mc", id: "ir-q-tk-3", concept: "tokenization", q: "Lebensversicherungsgesellschaftsangestellter가 보여 주는 문제는?", options: ["불용어", "합성어(공백 없음)", "악센트", "대소문자"], answer: 1, explain: "독일어 합성어." },
  { kind: "mc", id: "ir-q-tk-4", concept: "tokenization", q: "일본어 토큰화가 어려운 이유로 교안에 나온 것은?", options: ["오른쪽 → 왼쪽", "4가지 문자 체계와 공백 없음", "모든 단어가 대문자", "숫자를 쓰지 않음"], answer: 1, explain: "한자·히라가나·가타카나·라틴." },
  { kind: "ox", id: "ir-q-tk-5", concept: "tokenization", q: "교안은 숫자를 색인하지 않는 것이 일반적으로 더 유용하다고 한다.", answer: false, explain: "옛 시스템은 안 했지만 일반적으로 유용한 기능." },
  { kind: "ox", id: "ir-q-tk-6", concept: "tokenization", q: "Each token is a candidate for a postings entry.", answer: true, explain: "토큰화 슬라이드." },

  // normalization
  { kind: "mc", id: "ir-q-nm-1", concept: "normalization", q: "비대칭 확장(asymmetric expansion)에 대한 설명으로 옳은 것은?", options: ["동치류보다 덜 강력하지만 효율적", "동치류보다 강력하지만 덜 효율적", "항상 모든 변형을 하나로 묶음", "질의를 확장하지 않음"], answer: 1, explain: "More powerful, but less efficient." },
  { kind: "mc", id: "ir-q-nm-2", concept: "normalization", q: "교안이 말하는 악센트·움라우트 정규화의 가장 중요한 기준은?", options: ["언어학적 정확성", "사용자가 질의를 어떻게 쓸 것인가", "색인 크기", "문서 작성자의 습관"], answer: 1, explain: "사용자는 악센트를 자주 생략." },
  { kind: "ox", id: "ir-q-nm-3", concept: "normalization", q: "'PETER WILL NICHT MIT.'와 'PhD from MIT'는 정규화와 언어 판별이 상호작용함을 보여 준다.", answer: true, explain: "독일어 mit vs 대학 MIT." },
  { kind: "mc", id: "ir-q-nm-4", concept: "normalization", q: "Soundex와 시소러스가 다루는 동치는 각각?", options: ["의미 / 발음", "발음 / 의미", "철자 / 발음", "형태 / 철자"], answer: 1, explain: "Muller = Mueller / car = automobile." },
  { kind: "ox", id: "ir-q-nm-5", concept: "normalization", q: "window, Window, windows, Windows는 모두 한 동치류에 넣는 것이 바람직하다.", answer: false, explain: "Windows(OS)는 의미가 다르다." },

  // case-stop
  { kind: "ox", id: "ir-q-cs-1", concept: "case-stop", q: "Most web search engines index stop words.", answer: true, explain: "구 질의에 필요." },
  { kind: "mc", id: "ir-q-cs-2", concept: "case-stop", q: "불용어를 색인해야 하는 이유로 교안이 든 예는?", options: ["\"King of Denmark\"", "U.S.A.", "MIT vs mit", "résumé"], answer: 0, explain: "of를 빼면 구 질의가 깨진다." },
  { kind: "ox", id: "ir-q-cs-3", concept: "case-stop", q: "대소문자가 의미를 가질 수 있으므로 교안은 대소문자를 그대로 두는 것이 대개 최선이라고 한다.", answer: false, explain: "사용자가 소문자로 쓰므로 전부 소문자가 대개 최선." },
  { kind: "mc", id: "ir-q-cs-4", concept: "case-stop", q: "불용어 목록 예에 들어가지 않는 것은?", options: ["the", "of", "with", "insurance"], answer: 3, explain: "a, an, and, are, … with." },

  // lemma-stem
  { kind: "mc", id: "ir-q-ls-1", concept: "lemma-stem", q: "automate, automatic, automation → automat은 무엇의 예인가?", options: ["굴절 표제어 추출", "파생까지 줄이는 어간 추출", "대소문자 접기", "Soundex"], answer: 1, explain: "Example for derivational stemming." },
  { kind: "mc", id: "ir-q-ls-2", concept: "lemma-stem", q: "am, are, is → be는?", options: ["어간 추출", "표제어 추출", "불용어 제거", "토큰화"], answer: 1, explain: "사전 표제어(lemma)로." },
  { kind: "ox", id: "ir-q-ls-3", concept: "lemma-stem", q: "Stemming is a crude heuristic process that chops off the ends of words.", answer: true, explain: "교안 정의." },
  { kind: "ox", id: "ir-q-ls-4", concept: "lemma-stem", q: "어간 추출은 모든 질의에서 검색 효과를 높인다.", answer: false, explain: "어떤 질의엔 도움, 어떤 질의엔 해(operational research 등)." },
  { kind: "mc", id: "ir-q-ls-5", concept: "lemma-stem", q: "어간 추출이 해가 되는 질의 예는?", options: ["[tartan sweaters]", "[sightseeing tour san francisco]", "[operating AND system]", "[car insurance]"], answer: 2, explain: "oper 동치류로 섞임." },
  { kind: "mc", id: "ir-q-ls-6", concept: "lemma-stem", q: "destruction → destroy는 어떤 형태론인가?", options: ["굴절", "파생", "합성", "음운"], answer: 1, explain: "cutting → cut은 굴절." },

  // porter
  { kind: "short", id: "ir-q-pt-1", concept: "porter", q: "Porter 규칙 IES → I를 적용하면 ponies는?", answers: ["poni"], explain: "단어가 아닐 수도 있다." },
  { kind: "short", id: "ir-q-pt-2", concept: "porter", q: "Porter 규칙 SSES → SS를 적용하면 caresses는?", answers: ["caress"], explain: "끝의 sses를 ss로 바꿈. (caress 자체엔 SS → SS가 적용돼 그대로.)" },
  { kind: "mc", id: "ir-q-pt-3", concept: "porter", q: "규칙 '남는 부분이 1글자보다 길면 마지막 ement 삭제'를 cement에 적용하면?", options: ["c", "cement", "cem", "ment"], answer: 1, explain: "남는 'c'가 1글자라 적용 안 됨. replacement → replac." },
  { kind: "mc", id: "ir-q-pt-4", concept: "porter", q: "복합 명령의 여러 규칙이 맞을 때 Porter가 고르는 규칙은?", options: ["첫 번째 규칙", "가장 짧은 접미사", "가장 긴 접미사", "무작위"], answer: 2, explain: "Longest suffix." },
  { kind: "ox", id: "ir-q-pt-5", concept: "porter", q: "Porter 알고리즘은 규칙과 5단계 축약으로 이루어지며 단계는 순서대로 적용된다.", answer: true, explain: "Conventions + 5 phases." },
  { kind: "ox", id: "ir-q-pt-6", concept: "porter", q: "교안의 비교에서 Paice 어간 추출기가 Porter보다 덜 공격적으로 잘랐다.", answer: false, explain: "Paice가 더 공격적(feat, rev, pict)." },

  // skip-pointers
  { kind: "mc", id: "ir-q-sk-1", concept: "skip-pointers", q: "길이 P인 포스팅 리스트에 두는 스킵 포인터 수의 간단한 휴리스틱은?", options: ["P/2", "log P", "√P", "P²"], answer: 2, explain: "고르게 √P개." },
  { kind: "ox", id: "ir-q-sk-2", concept: "skip-pointers", q: "스킵 포인터는 갱신이 잦은 동적 색인에서 더 쉽게 유지된다.", answer: false, explain: "정적일 때 쉽고 동적일 때 어렵다." },
  { kind: "mc", id: "ir-q-sk-3", concept: "skip-pointers", q: "스킵이 많을 때의 특징은?", options: ["한 번에 많이 건너뛰지만 드물게 사용", "한 번에 조금 건너뛰지만 자주 사용", "항상 결과가 틀림", "포스팅을 정렬할 필요가 없음"], answer: 1, explain: "적으면 그 반대." },
  { kind: "mc", id: "ir-q-sk-4", concept: "skip-pointers", q: "IntersectWithSkips에서 p1의 스킵을 따라가는 조건은?", options: ["docID(skip(p1)) ≥ docID(p2)", "docID(skip(p1)) ≤ docID(p2)", "docID(p1) = docID(p2)", "항상"], answer: 1, explain: "건너뛰어도 상대 docID를 넘지 않을 때." },
  { kind: "ox", id: "ir-q-sk-5", concept: "skip-pointers", q: "With today's fast CPUs, skip pointers don't help that much anymore.", answer: true, explain: "예전엔 많이 도움." },

  // phrase-biword
  { kind: "short", id: "ir-q-bw-1", concept: "phrase-biword", q: "'Friends, Romans, Countrymen'의 biword 두 개 중 두 번째는?", answers: ["romans countrymen"], explain: "첫째 friends romans." },
  { kind: "mc", id: "ir-q-bw-2", concept: "phrase-biword", q: "biword 색인이 드물게 쓰이는 이유는?", options: ["구 질의를 못 함", "거짓 양성과 색인 폭증", "불용어를 지움", "위치를 저장함"], answer: 1, explain: "False positives, index blowup." },
  { kind: "ox", id: "ir-q-bw-3", concept: "phrase-biword", q: "biword 색인으로 \"stanford university palo alto\"를 AND로 분해하면 후처리 필터링 없이도 결과가 항상 정확하다.", answer: false, explain: "post-filtering이 필요(거짓 양성)." },
  { kind: "mc", id: "ir-q-bw-4", concept: "phrase-biword", q: "구 질의 때문에 역색인에 생기는 결과는?", options: ["사전이 필요 없어짐", "포스팅에 docID만 저장해서는 부족", "포스팅을 정렬할 필요가 없음", "불용어를 반드시 제거"], answer: 1, explain: "biword 또는 위치 색인으로 확장." },

  // positional-index
  { kind: "mc", id: "ir-q-pos-1", concept: "positional-index", q: "to의 문서 4 위치 ⟨8, 16, 190, 429, 433⟩, be의 문서 4 위치 ⟨17, 191, 291, 430, 434⟩일 때 'to be' 구가 나오는 to 위치가 아닌 것은?", options: ["16", "190", "429", "8"], answer: 3, explain: "be 9가 없다. 16→17, 190→191, 429→430, 433→434." },
  { kind: "ox", id: "ir-q-pos-2", concept: "positional-index", q: "위치 색인의 각 포스팅은 docID와 위치 목록으로 이루어진다.", answer: true, explain: "비위치 색인은 docID만." },
  { kind: "mc", id: "ir-q-pos-3", concept: "positional-index", q: "biword와 위치 색인의 결합 방식에서 biword로 넣는 것은?", options: ["모든 구", "자주 나오는 biword(Michael Jackson 등)", "불용어 쌍만", "세 단어 구"], answer: 1, explain: "나머지는 위치 교집합." },
  { kind: "short", id: "ir-q-pos-4", concept: "positional-index", q: "Williams et al.(2004)의 혼합 색인은 위치 색인보다 공간을 몇 % 더 쓰나?", answers: ["26", "26%"], hint: "숫자만", explain: "대신 더 빠름." },
  { kind: "ox", id: "ir-q-pos-5", concept: "positional-index", q: "웹 검색 엔진에서 위치(구) 질의는 일반 불리언 질의보다 싸다.", answer: false, explain: "훨씬 비싸다." },

  // proximity
  { kind: "mc", id: "ir-q-px-1", concept: "proximity", q: "employment /4 place에 대해 옳은 것은? (A) Employment agencies that place healthcare workers are seeing growth (B) Employment agencies that have learned to adapt now place healthcare workers", options: ["A만 히트", "B만 히트", "둘 다 히트", "둘 다 히트 아님"], answer: 0, explain: "A는 위치 차 3(≤ 4), B는 위치 차 8." },
  { kind: "ox", id: "ir-q-px-2", concept: "proximity", q: "근접 검색에서 두 용어 위치의 곱집합을 보는 단순한 방법은 불용어처럼 자주 나오는 단어에 매우 비효율적이다.", answer: true, explain: "교안." },
  { kind: "mc", id: "ir-q-px-3", concept: "proximity", q: "근접 검색에서 문서 목록뿐 아니라 실제 매치 위치를 돌려주는 이유는?", options: ["색인 압축", "동적 요약(스니펫) 등에 필요", "정렬 속도", "철자 교정"], answer: 1, explain: "dynamic summaries." },
];
