import type { Concept } from "@/lib/types";

/* IIR 1 · IIR 2 */
export const CONCEPTS_1: Concept[] = [
  // ── bool ─────────────────────────────────────────
  {
    id: "ir-definition",
    chapter: "bool",
    title: "정보검색의 정의와 비정형 데이터",
    en: "Definition of Information Retrieval",
    importance: "must",
    summary:
      "**정보검색(IR)**은 대규모 컬렉션(보통 컴퓨터에 저장)에서 **정보 요구(information need)**를 만족하는 **비정형(unstructured, 보통 텍스트)** 자료(보통 문서)를 찾는 일이다. 데이터베이스가 다루는 정형 데이터와 달리, 텍스트는 정해진 칸이 없다.",
    points: [
      "원문 정의: Information retrieval (IR) is finding material (usually **documents**) of an **unstructured** nature (usually **text**) that satisfies an **information need** from within **large collections** (usually stored on computers).",
      "1996년: 데이터 양은 비정형이 많았지만 시가총액(Market Cap)은 정형(DB) 쪽이 압도적",
      "2006년: 비정형 데이터 양도, 시가총액도 비정형 쪽이 커짐 — Google·Yahoo·Ask 등 검색 기업의 등장",
      "1650년의 비정형 데이터 예: 셰익스피어 전집",
    ],
    easy: "DB가 '엑셀 표에서 값 찾기'라면 IR은 '도서관 책 더미에서 내 궁금증을 풀어 줄 책 찾기'. 책에는 정해진 칸이 없으니 단어로 찾아야 한다.",
    exam: "정의의 키워드 네 개 — unstructured, information need, documents, large collections. 'IR은 정형 데이터를 찾는 일' ✗.",
  },
  {
    id: "incidence-matrix",
    chapter: "bool",
    title: "grep의 한계와 용어-문서 행렬",
    en: "Term-Document Incidence Matrix",
    importance: "must",
    summary:
      "'Brutus와 Caesar는 있고 Calpurnia는 없는 셰익스피어 희곡'을 찾을 때 grep은 느리고 줄 단위라 맞지 않는다. 대신 **용어 × 문서** 0/1 행렬을 만들고 각 용어의 **0/1 벡터**에 비트 연산을 하면 된다. 하지만 큰 컬렉션에서는 행렬이 **극도로 희소(sparse)**해서 만들 수 없다.",
    points: [
      "grep이 답이 아닌 이유: 큰 컬렉션에서 **느림**, grep은 **줄(line) 단위**인데 IR은 **문서 단위**, 'not Calpurnia'가 간단치 않음, 'Romans near countryman' 같은 연산 불가",
      "칸 값: 용어가 문서에 나오면 1, 안 나오면 0 (예: Calpurnia는 Julius Caesar에 1, The Tempest에 0)",
      "Brutus AND Caesar AND NOT Calpurnia: Calpurnia 벡터를 **보수(complement)** 취한 뒤 세 벡터를 비트 AND → `110100 AND 110111 AND 101111 = 100100` → Anthony and Cleopatra, Hamlet",
      "큰 컬렉션: N = 10⁶ 문서 × 문서당 약 1000 토큰 = 10⁹ 토큰, 토큰당 평균 6바이트 → 약 **6GB**, 서로 다른 용어 M = 500,000",
      "행렬 크기 500,000 × 10⁶ = **5천억(half a trillion)** 칸, 그런데 1은 **최대 10억 개** → 대부분 0 → **1만 기록하자** = 역색인",
    ],
    example: "용어 벡터(문서 순서: Anthony and Cleopatra, Julius Caesar, The Tempest, Hamlet, Othello, Macbeth)\nBrutus 110100 · Caesar 110111 · Calpurnia 010000 → NOT Calpurnia 101111\n결과 100100",
    easy: "출석부를 '학생 × 수업' 표로 만들면 거의 빈칸(0)뿐이다. 그래서 '이 학생이 들은 수업 목록'만 적어 두는 게 낫다 — 그게 역색인.",
    exam: "비트 연산 결과 계산(보수 먼저!), 행렬이 sparse한 이유와 칸 수·1의 개수 계산, grep이 안 되는 이유.",
  },
  {
    id: "inverted-index",
    chapter: "bool",
    title: "역색인: 사전과 포스팅",
    en: "Inverted Index: Dictionary & Postings",
    importance: "must",
    summary:
      "**역색인**은 각 용어 t마다 **t가 들어 있는 모든 문서의 목록**을 저장한다. 용어 목록이 **사전(dictionary)**, 각 용어에 매달린 docID 목록이 **포스팅 리스트(postings list)**이고, 포스팅 전체가 **포스팅 파일**이다. 사전에는 **문서 빈도(df)**도 함께 둔다.",
    points: [
      "Brutus → 1 2 4 11 31 45 173 174 / Caesar → 1 2 4 5 6 16 57 132 … / Calpurnia → 2 31 54 101",
      "포스팅(posting) 하나 = 문서 하나(docID) / 포스팅 리스트는 **docID 오름차순 정렬**",
      "사전 = 용어 + 문서 빈도(document frequency, 그 용어가 나오는 문서 수) + 포스팅 리스트 포인터",
      "'역(inverted)'인 이유: 문서 → 단어가 아니라 **단어 → 문서** 방향으로 뒤집어 저장",
      "이후 강의 예고: 큰 컬렉션의 색인 구축(IIR 4), 사전·색인 공간과 압축(IIR 5), 순위 검색(IIR 6)",
    ],
    easy: "책 뒤의 '찾아보기(색인)': '광합성 → 12, 45, 88쪽'. 단어(사전)마다 쪽 번호 목록(포스팅)이 매달려 있다.",
    exam: "dictionary와 postings 구분, df의 의미, 포스팅이 정렬되어 있어야 하는 이유(교집합 알고리즘).",
  },
  {
    id: "index-steps",
    chapter: "bool",
    title: "역색인 만들기 4단계",
    en: "Inverted Index Construction",
    importance: "must",
    summary:
      "① 색인할 **문서 수집** → ② **토큰화**(문서를 토큰 목록으로) → ③ **언어 전처리**로 정규화된 토큰 = **색인 용어** 만들기 → ④ 사전과 포스팅으로 된 **역색인** 만들기. 구현은 (용어, docID) 쌍을 만들고 → **용어순(같으면 docID순) 정렬** → 같은 용어를 합쳐 df와 포스팅 리스트를 만든 뒤 → 사전과 포스팅 파일로 나눈다.",
    points: [
      "예: Friends, Romans, countrymen. So let it be with Caesar … → 토큰 Friends Romans countrymen So … → 정규화 friend roman countryman so …",
      "Doc 1: I did enact Julius Caesar: I was killed i' the Capitol; Brutus killed me. / Doc 2: So let it be with Caesar. The noble Brutus hath told you Caesar was ambitious:",
      "(term, docID) 쌍 생성 → 정렬(ambitious 2, be 2, brutus 1, brutus 2, capitol 1, caesar 1, caesar 2, caesar 2, …)",
      "같은 문서 안의 중복은 하나로: caesar는 문서 1·2 → df 2, 포스팅 1 → 2 / the → df 2 / brutus → df 2 / 나머지 대부분 df 1",
      "마지막으로 **사전**과 **포스팅 파일**로 분리",
    ],
    flow: ["문서 수집 (Collect)", "토큰화 (Tokenize)", "언어 전처리 → 정규화된 색인 용어", "(term, docID) 쌍 생성", "용어 → docID 순으로 정렬", "같은 용어 합치기: df + 포스팅 리스트", "사전 / 포스팅 파일로 분리"],
    easy: "반 친구들이 낸 쪽지(문서)를 단어 카드로 잘라(토큰화) 소문자로 통일하고(정규화) 가나다순으로 정렬한 뒤, 같은 단어끼리 묶어 '어느 쪽지에서 나왔나'를 적는다.",
    exam: "4단계 **순서**, 예제 문서에서 특정 용어의 df·포스팅 맞히기(caesar df = 2, 문서 2에 두 번 나와도 포스팅은 한 번).",
  },
  {
    id: "intersect",
    chapter: "bool",
    title: "포스팅 리스트 교집합",
    en: "Intersecting Postings Lists",
    importance: "must",
    summary:
      "Brutus AND Calpurnia: 사전에서 두 용어를 찾아 포스팅을 가져와 **교집합**을 구한다. 두 포인터를 앞에서부터 움직이며 docID가 같으면 답에 넣고 둘 다 전진, 다르면 **작은 쪽만** 전진한다. 시간은 두 리스트 길이의 합에 **선형**(O(x + y))이며, **포스팅이 정렬되어 있어야만** 동작한다.",
    points: [
      "절차: ① Brutus를 사전에서 찾기 ② 포스팅 가져오기 ③ Calpurnia 찾기 ④ 포스팅 가져오기 ⑤ **교집합** ⑥ 결과 반환",
      "Brutus 1 2 4 11 31 45 173 174 ∩ Calpurnia 2 31 54 101 = **2, 31**",
      "연습: france 1 2 3 4 5 7 8 9 11 12 13 14 15, paris 2 6 10 12 14, lear 12 15 → (paris AND NOT france) OR lear = paris−france {6, 10} ∪ lear {12, 15} = **6, 10, 12, 15**",
    ],
    code: `Intersect(p1, p2)
  answer ← ⟨⟩
  while p1 ≠ nil and p2 ≠ nil
    do if docID(p1) = docID(p2)
         then Add(answer, docID(p1))
              p1 ← next(p1); p2 ← next(p2)
         else if docID(p1) < docID(p2)
                then p1 ← next(p1)
                else p2 ← next(p2)
  return answer`,
    easy: "두 반 출석번호 명단(정렬됨)에서 둘 다 있는 번호 찾기: 두 손가락을 각 명단 맨 위에 두고, 같으면 적고 둘 다 내려가고, 다르면 작은 번호 쪽 손가락만 내린다.",
    exam: "교집합 결과 손으로 구하기, 'AND NOT'·'OR' 섞인 연습문제, 시간 복잡도 = 선형, 정렬이 전제.",
  },
  {
    id: "boolean-model",
    chapter: "bool",
    title: "불리언 검색 모델의 평가",
    en: "Boolean Retrieval Model: Assessment",
    importance: "must",
    summary:
      "**불리언 모델**은 질의를 AND·OR·NOT으로 연결한 불리언 식으로 보고, 식을 만족하는 **모든 문서를 순서 없이** 돌려준다. 문서를 **용어의 집합**으로 보며, 맞거나 안 맞거나로 **정확(precise)**하다. 30년간 상용 검색의 주력이었고 변호사 같은 전문 검색자는 여전히 좋아한다.",
    points: [
      "가장 단순한 IR 모델, 어떤 불리언 식이든 답할 수 있음",
      "장점: 무엇을 얻는지 정확히 안다 — 전문가가 좋아하는 이유 **precision, transparency, control**",
      "Spotlight, 이메일, 인트라넷 검색 등도 불리언",
      "Google의 기본 해석: [w1 w2 … wn] = w1 AND w2 AND … AND wn",
      "그런데 wi가 없는 결과가 나오는 경우: **앵커 텍스트**, 변형어(형태·철자 교정·동의어), 긴 질의(n이 큼), 불리언 식 결과가 너무 적을 때",
      "단순 불리언은 결과를 **순서 없이** 반환 / Google 등 잘 설계된 엔진은 **결과 집합을 순위화**(좋은 히트를 위로)",
    ],
    easy: "불리언 검색 = 체에 거르기. 구멍(조건)을 통과하면 다 나오고 못 하면 안 나온다. '얼마나 잘 맞나'의 순서는 없다.",
    exam: "'불리언 검색은 결과에 순위를 매긴다' ✗(단순 불리언은 순서 없음). Google에서 질의어가 없는 결과가 나오는 경우 고르기.",
  },
  {
    id: "westlaw",
    chapter: "bool",
    title: "Westlaw: 상용 불리언 검색",
    en: "Westlaw & Proximity Operators",
    importance: "high",
    summary:
      "**Westlaw**는 유료 구독자 수 기준 최대의 상용 법률 검색 서비스로 1975년 시작했다. 2005년에도 불리언 검색(**Terms and Connectors**)이 기본값이었다(순위 검색은 1992년부터 제공). 근접 연산자 **/3**(3단어 이내), **/s**(같은 문장), **/p**(같은 문단)를 쓰고, **공백은 OR(disjunction)**이다.",
    points: [
      "50만 명 넘는 구독자, 하루 수백만 건 검색, 수십 테라바이트 텍스트",
      "질의 예: \"trade secret\" /s disclos! /s prevent /s employe! (직원의 영업 비밀 유출 방지)",
      "disab! /p access! /s work-site work-place (employment /3 place) (장애인의 작업장 접근)",
      "host! /p (responsib! liab!) /p (intoxicat! drunk!) /p guest (취한 손님에 대한 주인의 책임)",
      "**!** = 뒤를 자르는 와일드카드, **공백 = OR** — Google 이전 검색의 기본값",
      "길고 정밀한 질의를 **점진적으로** 다듬는다 — 웹 검색과 다름",
      "불리언이 최선인지는 정보 요구, 검색자, 문서 컬렉션 등에 달림",
    ],
    easy: "변호사의 검색은 '판례 조항 찾기' 같은 정밀 작업이라, 대충 비슷한 결과보다 '조건을 정확히 만족하는 전부'를 원한다.",
    exam: "/3·/s·/p 의미, 'Westlaw에서 공백 = AND' ✗(OR), 전문가가 불리언을 좋아하는 세 가지 이유.",
  },
  {
    id: "query-opt",
    chapter: "bool",
    title: "질의 최적화",
    en: "Query Optimization",
    importance: "must",
    summary:
      "n개 용어의 AND 질의는 **빈도(df)가 작은 용어부터** 처리한다 — 가장 짧은 포스팅 리스트로 시작하면 중간 결과가 처음부터 작고 계속 줄어든다. OR가 섞이면 각 OR의 크기를 **빈도의 합으로 (보수적으로) 추정**해 작은 OR부터 처리한다.",
    points: [
      "Brutus AND Calpurnia AND Caesar — Brutus 8개, Calpurnia 4개, Caesar 2개(5, 31) → **Caesar → Calpurnia → Brutus** 순",
      "알고리즘: terms ← SortByIncreasingFrequency(t1…tn), result ← 첫 용어 포스팅, 남은 용어와 차례로 Intersect, result가 비면 즉시 중단",
      "(madding OR crowd) AND (ignoble OR strife): 모든 용어 빈도를 구하고, 각 OR 크기 ≈ 빈도 합으로 추정, **OR 크기 오름차순**으로 처리",
    ],
    code: `Intersect(⟨t1, …, tn⟩)
  terms ← SortByIncreasingFrequency(⟨t1, …, tn⟩)
  result ← postings(first(terms))
  terms ← rest(terms)
  while terms ≠ nil and result ≠ nil
    do result ← Intersect(result, postings(first(terms)))
       terms ← rest(terms)
  return result`,
    easy: "세 조건으로 친구를 찾을 때 '안경 쓴 사람(2명)'부터 거르면 나머지 조건은 2명만 확인하면 된다. 흔한 조건부터 거르면 수백 명을 확인해야 한다.",
    exam: "처리 순서 맞히기(df 오름차순), OR 크기 추정 = 빈도의 **합**(보수적 상한).",
  },

  // ── voc ──────────────────────────────────────────
  {
    id: "document-unit",
    chapter: "voc",
    title: "문서 파싱과 문서 단위",
    en: "Parsing Documents & Document Unit",
    importance: "normal",
    summary:
      "지난 강의는 '문서가 무엇인지 알고, 기계가 읽을 수 있다'고 가정했지만 현실은 복잡하다. 각 문서의 **형식(pdf·word·excel·html)**, **언어**, **문자 집합**을 판별해야 하고(각각 분류 문제, IIR 13 — 대안은 휴리스틱), **무엇을 하나의 문서(색인 단위)로 볼지**도 설계 결정이다.",
    points: [
      "한 색인에 여러 언어의 용어가 섞이는 게 보통, 한 문서 안에도 여러 언어·형식(스페인어 pdf가 첨부된 프랑스어 이메일)",
      "문서 단위 후보: 파일 하나? 이메일 하나? 첨부 5개 달린 이메일? 파일 묶음(HTML로 된 ppt·latex)?",
      "결론: '문서란 무엇인가'는 **사소하지 않으며 설계 결정**이 필요 / XML도 같은 문제",
    ],
    easy: "택배 상자 하나를 '물건 하나'로 셀지, 안의 물건을 하나하나 셀지 정해야 재고표를 만들 수 있다.",
    exam: "형식·언어·문자 집합 판별이 '분류 문제'라는 점, 문서 단위가 설계 결정이라는 점.",
  },
  {
    id: "word-term-token",
    chapter: "voc",
    title: "word · term · token · type",
    en: "Word, Term, Token, Type",
    importance: "must",
    summary:
      "**Word**: 텍스트에 나타난 구분된 문자열. **Term**: (대소문자·형태·철자 등을) **정규화한 word**, 즉 word의 동치류. **Token**: 문서에 나타난 word나 term의 **한 번의 출현(instance)**. **Type**: 대부분 term과 같음 — **token의 동치류**.",
    points: [
      "In June, the dog likes to chase the cat in the barn. → **12 tokens, 9 types** (in·the가 두 번씩 → 12 − 3 = 9)",
      "토큰화 난이도 예: Mr. O'Neill thinks that the boys' stories about Chile's capital aren't amusing.",
      "token/type 구분은 색인 크기 계산에 그대로 쓰인다(예: N 문서 × 1000 토큰 vs M개 서로 다른 용어)",
    ],
    easy: "'사과 사과 배' — 토큰은 3개(나온 횟수), 타입은 2개(서로 다른 종류).",
    exam: "문장 주고 token·type 개수 세기(대소문자는 하나로 접는다고 가정 — In과 in은 같은 type).",
  },
  {
    id: "tokenization",
    chapter: "voc",
    title: "토큰화의 어려움",
    en: "Tokenization Problems",
    importance: "must",
    summary:
      "**토큰화**는 원문을 토큰으로 나누는 일이고 각 토큰은 포스팅 항목의 후보다. 영어에서도 하이픈·공백·아포스트로피·숫자 처리가 애매하고, 중국어·일본어처럼 **공백이 없는 언어**나 독일어 등의 **합성어**는 분할 자체가 어렵다.",
    points: [
      "한 단어? 두 단어? Hewlett-Packard, State-of-the-art, co-education, data base, San Francisco, Los Angeles-based company, York University vs. New York University",
      "숫자: 3/20/91, 20/3/91, Mar 20, 1991, B-52, 100.2.86.144, (800) 234-2333 — 옛 IR 시스템은 숫자를 색인 안 하기도 했지만 대체로 **유용**",
      "중국어: 공백 없음, **모호한 분할** — 和尚 = 한 단어 '스님' 또는 두 단어 '그리고'+'아직'",
      "합성어: Computerlinguistik → Computer + Linguistik, Lebensversicherungsgesellschaftsangestellter → leben + versicherung + gesellschaft + angestellter / 이누이트어 tusaatsiarunnanngittualuujunga(잘 안 들려요) / 핀란드어·우르두어도",
      "일본어: 한자·히라가나·가타카나·라틴 문자 **4가지 문자 체계**, 공백 없음, 질의를 히라가나로만 쓸 수도 있음",
      "아랍어: 오른쪽 → 왼쪽이지만 숫자는 왼쪽 → 오른쪽(**양방향**) — **유니코드로 저장하면 문제없음**",
    ],
    easy: "'아버지가방에들어가신다' — 띄어쓰기가 없으면 어디서 끊느냐에 따라 뜻이 달라진다. 컴퓨터도 똑같이 헷갈린다.",
    exam: "'중국어는 공백으로 토큰화하면 된다' ✗, 和尚 모호성, 양방향 텍스트는 유니코드면 문제없음.",
  },
  {
    id: "normalization",
    chapter: "voc",
    title: "정규화와 동치류",
    en: "Normalization & Equivalence Classes",
    importance: "must",
    summary:
      "색인할 텍스트의 word와 질의어를 **같은 형태로 정규화**해야 맞출 수 있다(U.S.A. ↔ USA). 보통 term의 **동치류**를 암묵적으로 정의한다. 대안은 **비대칭 확장(asymmetric expansion)** — 더 강력하지만 덜 효율적이다.",
    points: [
      "비대칭 확장 예: 질의 window → window, windows 검색 / windows → Windows, windows / Windows → 확장 없음",
      "window·Window·windows·Windows를 한 동치류로 넣지 않는 이유: Windows(운영체제)는 의미가 다름",
      "정규화와 **언어 판별**은 상호작용: PETER WILL NICHT MIT.(독일어, MIT = mit) vs He got his PhD from MIT.(MIT ≠ mit)",
      "악센트: résumé vs resume(악센트 생략) / 움라우트: Universität vs Universitaet(ae로 대체)",
      "가장 중요한 기준: **사용자가 질의를 어떻게 쓸 것인가** — 악센트가 표준인 언어에서도 사용자는 자주 생략",
      "그 밖의 동치: **Soundex**(발음 동치, Muller = Mueller, IIR 3), **시소러스**(의미 동치, car = automobile, IIR 9)",
    ],
    easy: "'핸드폰·휴대폰·휴대전화'를 같은 칸에 모으는 일. 그런데 '사과(과일)'와 '사과(사죄)'처럼 겉모양이 같아도 묶으면 안 되는 경우도 있다.",
    exam: "비대칭 확장의 장단점(강력 vs 덜 효율적), 정규화 기준 = 사용자의 질의 습관, Soundex·시소러스가 각각 어떤 동치인지.",
  },
  {
    id: "case-stop",
    chapter: "voc",
    title: "대소문자 접기와 불용어",
    en: "Case Folding & Stop Words",
    importance: "must",
    summary:
      "**대소문자 접기**는 모든 글자를 소문자로 바꾼다 — 대소문자가 의미를 가질 때도 있지만(MIT vs mit, Fed vs fed) 사용자가 어차피 소문자로 쓰므로 **보통 전부 소문자가 최선**. **불용어**는 너무 흔해 문서 선택에 도움이 거의 안 되는 단어로, 옛 시스템은 제거했지만 **구 질의에 필요**해서 대부분의 웹 검색 엔진은 **불용어도 색인**한다.",
    points: [
      "불용어 예: a, an, and, are, as, at, be, by, for, from, has, he, in, is, it, its, of, on, that, the, to, was, were, will, with",
      "불용어가 필요한 예: \"King of Denmark\" (of를 빼면 구 질의가 깨짐)",
      "Reuters에서 불용어 30개 제거 → 위치 포스팅 −31%, 150개 → −47% (IIR 5 표)",
    ],
    easy: "불용어 = 문장의 '은·는·이·가' 같은 단어. 거의 모든 문서에 있어서 거르는 데 쓸모가 적지만, '왕의 남자'에서 '의'를 빼면 다른 말이 된다.",
    exam: "'현대 웹 검색 엔진은 불용어를 색인하지 않는다' ✗, 불용어가 필요한 이유 = 구 질의.",
  },
  {
    id: "lemma-stem",
    chapter: "voc",
    title: "표제어 추출과 어간 추출",
    en: "Lemmatization vs Stemming",
    importance: "must",
    summary:
      "**표제어 추출(lemmatization)**은 굴절·변이형을 사전의 **표제어(lemma)**로 '제대로' 줄인다(am, are, is → be). **어간 추출(stemming)**은 단어 끝을 **잘라 내는 거친 휴리스틱**으로, 표제어 추출이 많은 언어 지식으로 하려는 일을 흉내 낸다. 어간 추출은 **언어 의존적**이고 굴절과 **파생**까지 줄이는 경우가 많다.",
    points: [
      "표제어 예: car, cars, car's, cars' → car / the boy's cars are different colors → the boy car be different color",
      "**굴절 형태론**(cutting → cut) vs **파생 형태론**(destruction → destroy)",
      "파생까지 줄이는 어간 추출 예: automate, automatic, automation → **automat**",
      "효과: 어떤 질의엔 좋고 어떤 질의엔 나쁨 — 도움: [tartan sweaters], [sightseeing tour san francisco] ({sweater, sweaters}, {tour, tours})",
      "해로움: Porter의 동치류 oper = operate, operating, operates, operation, operative, operatives, operational → [operational AND research], [operating AND system], [operative AND dentistry]가 엉뚱하게 섞임",
    ],
    table: {
      title: "표제어 추출 vs 어간 추출",
      headers: ["", "Lemmatization", "Stemming"],
      rows: [
        ["방법", "언어 지식으로 '제대로'", "단어 끝을 잘라 내는 거친 휴리스틱"],
        ["결과", "사전 표제어 (be, car)", "단어가 아닐 수도 (automat, poni)"],
        ["범위", "주로 굴절", "굴절 + 파생까지 자주"],
      ],
    },
    easy: "표제어 추출 = 국어사전에서 기본형 찾기('먹었다 → 먹다'). 어간 추출 = 가위로 끝을 싹둑('먹었다 → 먹'), 빠르지만 가끔 엉뚱하게 자른다.",
    exam: "두 방법 차이, 어간 추출이 검색 성능을 '항상' 높인다 ✗, operat- 예처럼 해로운 경우.",
  },
  {
    id: "porter",
    chapter: "voc",
    title: "Porter 어간 추출기",
    en: "Porter Stemmer",
    importance: "must",
    summary:
      "**Porter 알고리즘**은 영어 어간 추출에 가장 흔히 쓰이며 다른 방법만큼은 좋다는 결과가 있다. **규칙(convention) + 5단계 축약**으로 이루어지고 단계는 **순서대로** 적용된다. 복합 명령 안의 규칙 중에서는 **가장 긴 접미사**에 해당하는 규칙을 고른다.",
    points: [
      "명령 예: 남는 부분이 1글자보다 길면 마지막 ement 삭제 → replacement → replac, cement → cement(남는 'c'가 1글자라 그대로)",
      "SSES → SS: caresses → caress",
      "IES → I: ponies → poni",
      "SS → SS: caress → caress",
      "S → (삭제): cats → cat",
      "세 어간 추출기 비교: Porter(…analysi can reveal featur…) · Lovins(…analys can reve featur…) · Paice(…analys can rev feat…) — Paice가 가장 공격적",
    ],
    table: {
      title: "Porter 규칙 몇 개",
      headers: ["규칙", "예"],
      rows: [
        ["SSES → SS", "caresses → caress"],
        ["IES → I", "ponies → poni"],
        ["SS → SS", "caress → caress"],
        ["S → (없음)", "cats → cat"],
      ],
    },
    easy: "접미사 떼기 레시피 5장을 순서대로 적용하고, 한 장 안에서 여러 줄이 맞으면 가장 긴 접미사 줄을 쓴다.",
    exam: "규칙 적용 결과 쓰기(ponies → poni, caresses → caress), 'longest suffix' 규칙, 5단계 순차 적용.",
  },
  {
    id: "skip-pointers",
    chapter: "voc",
    title: "스킵 포인터",
    en: "Skip Pointers",
    importance: "must",
    summary:
      "**스킵 포인터**는 결과에 들어갈 리 없는 포스팅을 **건너뛰게** 해 교집합을 빠르게 한다. 몇백만 개짜리 포스팅 리스트도 있어서 선형이라도 효율이 문제가 된다. 길이 **P**인 리스트에 **√P개를 고르게** 두는 것이 간단한 휴리스틱이다.",
    points: [
      "기본 생각: Brutus 2 4 8 **34** 35 64 **128**, Caesar 1 2 3 **8** 17 21 **31** 75 81 84 89 92 — 스킵 대상 docID가 상대 docID 이하일 때만 건너뜀",
      "큰 예: Brutus 2 4 8 16 19 23 28 43 (스킵 16·28·72), Caesar 1 2 3 5 8 41 51 60 71 (스킵 5·51·98)",
      "**트레이드오프**: 스킵 많이 → 한 번에 조금만 건너뛰지만 자주 사용 / 스킵 적게 → 한 번에 많이 건너뛰지만 거의 못 씀",
      "√P 휴리스틱은 질의어 분포를 무시 / 색인이 **정적이면 쉬움**, 갱신이 잦은 **동적 환경에선 어려움**",
      "효과: 예전엔 크게 도움 → 오늘날 빠른 CPU에선 **그다지 도움 안 됨**",
    ],
    code: `IntersectWithSkips(p1, p2)
  answer ← ⟨⟩
  while p1 ≠ nil and p2 ≠ nil
    do if docID(p1) = docID(p2)
         then Add(answer, docID(p1)); p1 ← next(p1); p2 ← next(p2)
       else if docID(p1) < docID(p2)
         then if hasSkip(p1) and docID(skip(p1)) ≤ docID(p2)
                then while hasSkip(p1) and docID(skip(p1)) ≤ docID(p2)
                       do p1 ← skip(p1)
                else p1 ← next(p1)
       else (p2 쪽도 똑같이)
  return answer`,
    easy: "계단을 오를 때 몇 칸씩 건너뛰는 '점프 표시'. 표시가 너무 촘촘하면 별로 못 건너뛰고, 너무 드물면 쓸 기회가 없다.",
    exam: "√P, 트레이드오프 서술, 건너뛰는 조건(skip 대상 ≤ 상대 docID), '스킵 포인터는 동적 색인에서 더 쉽다' ✗.",
  },
  {
    id: "phrase-biword",
    chapter: "voc",
    title: "구 질의와 biword 색인",
    en: "Phrase Queries & Biword Indexes",
    importance: "must",
    summary:
      "[stanford university]를 **구(phrase)**로 찾으려면 'The inventor Stanford Ovshinsky never went to university'는 걸리면 안 된다. 구 질의는 사용자가 쉽게 이해하고 웹 질의의 상당 부분이라, **포스팅에 docID만 저장해서는 부족**하다. 방법은 **biword 색인**과 **위치 색인** 두 가지.",
    points: [
      "**Biword 색인**: 연속된 두 용어 쌍을 하나의 용어로 색인 — Friends, Romans, Countrymen → \"friends romans\", \"romans countrymen\"",
      "두 단어 구는 바로 답함 / 긴 구: \"stanford university palo alto\" → \"stanford university\" AND \"university palo\" AND \"palo alto\"",
      "긴 구는 **후처리 필터링(post-filtering)**으로 실제 4단어 구를 포함하는지 확인해야 함",
      "잘 안 쓰이는 이유: **거짓 양성(false positives)**, 용어 어휘가 매우 커져 **색인 폭증(index blowup)**",
    ],
    easy: "'수원 화성'을 찾는데 '수원에 사는 화성 탐사 연구자' 문서가 걸리면 안 된다. 그래서 '수원 화성'처럼 붙어 있는 두 단어를 한 덩어리로 색인해 둔다.",
    exam: "biword 만들기, 긴 구의 AND 분해와 거짓 양성, biword가 드물게 쓰이는 두 이유.",
  },
  {
    id: "positional-index",
    chapter: "voc",
    title: "위치 색인",
    en: "Positional Index",
    importance: "must",
    summary:
      "**위치 색인**은 biword보다 효율적인 대안으로, 각 포스팅이 **docID + 위치 목록**이다(비위치 색인은 docID만). 구 질의와 **근접 질의** 둘 다 답할 수 있다. 자주 나오는 biword(Michael Jackson, Britney Spears)만 용어로 넣고 나머지 구는 위치 교집합으로 처리하는 **결합 방식**이 실용적이다.",
    points: [
      "형식: 용어, df: ⟨doc: ⟨pos, pos, …⟩; …⟩",
      "\"to₁ be₂ or₃ not₄ to₅ be₆\": to, 993427: ⟨1: ⟨7, 18, 33, 72, 86, 231⟩; 2: ⟨1, 17, 74, 222, 255⟩; **4: ⟨8, 16, 190, 429, 433⟩**; 5: ⟨363, 367⟩; 7: ⟨13, 23, 191⟩ …⟩",
      "be, 178239: ⟨1: ⟨17, 25⟩; **4: ⟨17, 191, 291, 430, 434⟩**; 5: ⟨14, 19, 101⟩ …⟩ → 문서 4에서 to 16·be 17, to 190·be 191, to 429·be 430, to 433·be 434 → **문서 4가 매치**",
      "결합 방식: Williams et al.(2004)의 혼합 색인은 위치 색인보다 빠르고 공간은 **26% 더** 씀",
      "웹 검색에서 위치 질의는 일반 불리언 질의보다 **훨씬 비싸다**",
      "위치 색인 구축도 기본은 같지만 중간 자료구조가 커진다(IIR 4)",
    ],
    easy: "책 색인에 '광합성 → 12쪽 3번째 줄, 45쪽 7번째 줄'처럼 줄 번호까지 적어 두면, '광합성 바로 다음에 엽록체'가 나오는 곳도 찾을 수 있다.",
    exam: "포스팅에서 구 매치 문서 찾기(위치가 정확히 +1), 위치 색인 vs biword 비교, 결합 방식의 이유.",
  },
  {
    id: "proximity",
    chapter: "voc",
    title: "근접 검색",
    en: "Proximity Search",
    importance: "high",
    summary:
      "위치 색인으로 **근접 검색**도 한다: employment /4 place = employment와 place가 **4단어 이내**에 있는 문서. 가장 단순한 방법은 두 용어 위치의 **곱집합(cross-product)**을 보는 것이지만 자주 나오는 단어(특히 불용어)엔 매우 비효율적이다. 문서 목록뿐 아니라 **실제 매치 위치**도 돌려줘야 동적 요약 등에 쓸 수 있다.",
    points: [
      "히트: Employment agencies that place healthcare workers are seeing growth (employment와 place 사이 3단어)",
      "히트 아님: Employment agencies that have learned to adapt now place healthcare workers",
      "PositionalIntersect(p1, p2, k): 같은 문서이면 두 위치 목록을 훑으며 |pos1 − pos2| ≤ k인 쌍을 모으고, k보다 멀어진 앞쪽 위치는 목록에서 지움",
    ],
    easy: "'친구 /3 생일' = 친구와 생일이 세 단어 안에 붙어 있는 문장. 위치 번호끼리 빼서 3 이하인지만 보면 된다.",
    exam: "/k의 의미와 예문 판정, 곱집합 방식의 비효율, 위치를 반환하는 이유(동적 요약).",
  },
];
