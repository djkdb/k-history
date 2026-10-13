import type { NoteSection } from "@/lib/types";

/** 정보검색 강의 노트 1 — IIR 1 Boolean Retrieval, IIR 2 The term vocabulary and postings lists */
export const NOTES_1: Record<string, NoteSection[]> = {
  bool: [
    {
      title: "Take-away와 목차",
      en: "Take-away · Outline",
      lines: [
        "Take-away: **불리언 검색** — 단순한 정보검색 시스템의 설계와 자료구조 / 이 수업에서 다룰 주제 미리 보기",
        "목차: ① Introduction ② Inverted index ③ Processing Boolean queries ④ Query optimization ⑤ Course overview",
      ],
    },
    {
      title: "정보검색의 정의",
      en: "Definition of information retrieval",
      lines: [
        "Information retrieval (IR) is finding material (usually **documents**) of an **unstructured** nature (usually **text**) that satisfies an **information need** from within **large collections** (usually stored on computers).",
        "정보검색 = 대규모 컬렉션에서 정보 요구를 만족하는 비정형(보통 텍스트) 자료(보통 문서)를 찾는 일",
      ],
    },
    {
      title: "비정형 vs 정형 데이터 (1996 · 2006 그래프)",
      en: "Unstructured (text) vs. structured (database) data",
      lines: [
        "1996년: **데이터 양(Data volume)**은 비정형이 정형보다 많았지만(약 75 vs 20), **시가총액(Market Cap)**은 정형(DB 산업)이 압도적(약 95 vs 거의 0)",
        "2006년: 데이터 양은 비정형이 훨씬 많고(약 145 vs 25), 시가총액도 비정형이 정형을 앞섬(약 155 vs 140) — 옆에 Google, Yahoo!, Windows, Ask 로고",
        "의미: 텍스트(비정형) 데이터 검색이 거대한 산업이 됨",
      ],
    },
    {
      title: "불리언 검색",
      en: "Boolean retrieval",
      lines: [
        "불리언 모델은 정보검색 시스템의 기반이 될 수 있는 **가장 단순한** 모델이라 할 수 있다",
        "질의는 불리언 식이다 — 예: Caesar and Brutus",
        "검색 엔진은 그 불리언 식을 만족하는 **모든 문서**를 돌려준다",
        "Google은 불리언 모델을 쓸까?",
      ],
    },
    {
      title: "Google은 불리언 모델을 쓰나?",
      en: "Does Google use the Boolean model?",
      lines: [
        "Google에서 질의 [w1 w2 … wn]의 기본 해석은 **w1 AND w2 AND … AND wn**",
        "wi 중 하나가 없는데도 히트가 나오는 경우:",
        "· **앵커 텍스트**(다른 페이지가 이 페이지를 링크하며 쓴 글)",
        "· 페이지에 wi의 **변형**이 있음(형태 변화, 철자 교정, 동의어)",
        "· **긴 질의**(n이 큼)",
        "· 불리언 식의 결과가 **너무 적을 때**",
        "단순 불리언 vs 결과 집합 순위화: 단순 불리언 검색은 맞는 문서를 **특별한 순서 없이** 반환 / Google(과 잘 설계된 불리언 엔진 대부분)은 결과 집합을 **순위화** — 관련성 추정치에 따라 좋은 히트를 나쁜 히트보다 위에",
      ],
    },
    {
      title: "1650년의 비정형 데이터: 셰익스피어",
      en: "Unstructured data in 1650",
      lines: [
        "(셰익스피어 초상화 슬라이드)",
        "질문: 셰익스피어 희곡 중 **Brutus와 Caesar를 포함하지만 Calpurnia는 포함하지 않는** 것은?",
        "방법 하나: 셰익스피어 희곡 전체를 grep으로 Brutus·Caesar 검색 후 Calpurnia가 든 줄을 걸러 냄",
        "grep이 해답이 아닌 이유:",
        "· (큰 컬렉션에서) **느림**",
        "· grep은 **줄 단위(line-oriented)**, IR은 **문서 단위(document-oriented)**",
        "· 'not Calpurnia'는 간단하지 않음",
        "· 다른 연산(예: Romans **near** countryman 찾기)은 불가능",
      ],
    },
    {
      title: "용어-문서 출현 행렬",
      en: "Term-document incidence matrix",
      lines: [
        "칸 값은 용어가 나오면 1 — 예: Calpurnia는 Julius Caesar에 나옴",
        "칸 값은 용어가 안 나오면 0 — 예: Calpurnia는 The Tempest에 안 나옴",
      ],
      table: {
        title: "행렬 (1 = 출현)",
        headers: ["", "Anthony and Cleopatra", "Julius Caesar", "The Tempest", "Hamlet", "Othello", "Macbeth"],
        rows: [
          ["Anthony", "1", "1", "0", "0", "0", "1"],
          ["Brutus", "1", "1", "0", "1", "0", "0"],
          ["Caesar", "1", "1", "0", "1", "1", "1"],
          ["Calpurnia", "0", "1", "0", "0", "0", "0"],
          ["Cleopatra", "1", "0", "0", "0", "0", "0"],
          ["mercy", "1", "0", "1", "1", "1", "1"],
          ["worser", "1", "0", "1", "1", "1", "0"],
        ],
      },
    },
    {
      title: "출현 벡터와 비트 연산",
      en: "Incidence vectors",
      lines: [
        "각 용어마다 0/1 벡터가 있다",
        "Brutus and Caesar and not Calpurnia에 답하려면:",
        "· Brutus, Caesar, Calpurnia의 벡터를 가져온다",
        "· Calpurnia 벡터의 **보수(complement)**를 취한다",
        "· 세 벡터에 **비트 AND**",
        "`110100 and 110111 and 101111 = 100100` → 결과 1 0 0 1 0 0 = **Anthony and Cleopatra, Hamlet**",
        "답 확인: Anthony and Cleopatra 3막 2장 (Agrippa: Why, Enobarbus, When Antony found Julius Caesar dead, … When at Philippi he found Brutus slain.) / Hamlet 3막 2장 (Lord Polonius: I did enact Julius Caesar: I was killed i' the Capitol; Brutus killed me.)",
      ],
    },
    {
      title: "더 큰 컬렉션: 행렬을 만들 수 없다",
      en: "Bigger collections · Can't build the incidence matrix",
      lines: [
        "N = 10⁶ 문서, 각 약 1000 토큰 → 총 **10⁹ 토큰**",
        "토큰당 평균 6바이트(공백·구두점 포함) → 컬렉션 크기 약 6 · 10⁹ = **6GB**",
        "서로 다른 용어 M = **500,000**개라고 가정 (**term/token 구분**에 주의)",
        "행렬 = 500,000 × 10⁶ = **5천억(half a trillion)** 개의 0과 1",
        "그런데 1은 **10억 개를 넘지 않는다** → 행렬이 **극도로 희소(sparse)**",
        "더 나은 표현? → **1만 기록하자**",
      ],
    },
    {
      title: "역색인",
      en: "Inverted Index",
      lines: [
        "각 용어 t에 대해, t를 포함하는 모든 문서의 목록을 저장한다",
        "Brutus → 1 2 4 11 31 45 173 174",
        "Caesar → 1 2 4 5 6 16 57 132 …",
        "Calpurnia → 2 31 54 101",
        "왼쪽 용어 목록 = **dictionary(사전)**, 오른쪽 목록들 = **postings(포스팅)**",
      ],
    },
    {
      title: "역색인 만들기",
      en: "Inverted index construction",
      lines: [
        "① 색인할 문서 수집: Friends, Romans, countrymen. So let it be with Caesar …",
        "② 텍스트를 **토큰화**해 문서를 토큰 목록으로: Friends Romans countrymen So …",
        "③ **언어 전처리**로 정규화된 토큰 목록 = **색인 용어**: friend roman countryman so …",
        "④ 각 용어가 나오는 문서를 색인 — 사전과 포스팅으로 이루어진 **역색인** 생성",
      ],
    },
    {
      title: "토큰화·전처리 → 포스팅 생성 → 정렬",
      en: "Tokenization and preprocessing · Generate postings · Sort postings",
      lines: [
        "Doc 1. I did enact Julius Caesar: I was killed i' the Capitol; Brutus killed me. → i did enact julius caesar i was killed i' the capitol brutus killed me",
        "Doc 2. So let it be with Caesar. The noble Brutus hath told you Caesar was ambitious: → so let it be with caesar the noble brutus hath told you caesar was ambitious",
        "포스팅 생성: 토큰마다 (term, docID) 쌍 — i 1, did 1, enact 1, julius 1, caesar 1, i 1, was 1, killed 1, i' 1, the 1, capitol 1, brutus 1, killed 1, me 1, so 2, let 2, it 2, be 2, with 2, caesar 2, the 2, noble 2, brutus 2, hath 2, told 2, you 2, caesar 2, was 2, ambitious 2",
        "정렬: 용어 알파벳순, 같은 용어는 docID순 → ambitious 2, be 2, brutus 1, brutus 2, capitol 1, caesar 1, caesar 2, caesar 2, did 1, enact 1, hath 1, i 1, i 1, i' 1, it 2, julius 1, killed 1, killed 1, let 2, me 1, noble 2, so 2, the 1, the 2, told 2, you 2, was 1, was 2, with 2",
      ],
    },
    {
      title: "포스팅 리스트 만들기, 문서 빈도 결정",
      en: "Create postings lists, determine document frequency",
      lines: [
        "같은 용어의 같은 문서 중복을 합치고, 용어마다 **문서 빈도(doc. freq.)**와 **포스팅 리스트**를 만든다",
        "ambitious 1 → 2 / be 1 → 2 / **brutus 2 → 1 → 2** / capitol 1 → 1 / **caesar 2 → 1 → 2** / did 1 → 1 / enact 1 → 1 / hath 1 → 2 / i 1 → 1 / i' 1 → 1 / it 1 → 2 / julius 1 → 1 / killed 1 → 1 / let 1 → 2 / me 1 → 1 / noble 1 → 2 / so 1 → 2 / **the 2 → 1 → 2** / told 1 → 2 / you 1 → 2 / **was 2 → 1 → 2** / with 1 → 2",
        "그 결과를 **사전**과 **포스팅 파일**로 나눈다",
      ],
    },
    {
      title: "앞으로 이 수업에서",
      en: "Later in this course",
      lines: [
        "색인 구축: 큰 컬렉션의 역색인을 어떻게 만드나?",
        "사전과 색인에 공간이 얼마나 필요한가?",
        "색인 압축: 큰 컬렉션의 색인을 어떻게 효율적으로 저장·처리하나?",
        "순위 검색: '최선의' 답을 원할 때 역색인은 어떤 모습인가?",
      ],
    },
    {
      title: "단순 연언 질의 (두 용어)",
      en: "Simple conjunctive query",
      lines: [
        "질의 Brutus AND Calpurnia — 역색인으로 맞는 문서를 모두 찾으려면:",
        "① 사전에서 Brutus 찾기 ② 포스팅 파일에서 그 포스팅 리스트 가져오기 ③ 사전에서 Calpurnia 찾기 ④ 포스팅 리스트 가져오기 ⑤ 두 포스팅 리스트의 **교집합** ⑥ 교집합을 사용자에게 반환",
      ],
    },
    {
      title: "두 포스팅 리스트의 교집합",
      en: "Intersecting two postings lists",
      lines: [
        "Brutus 1 → 2 → 4 → 11 → 31 → 45 → 173 → 174 / Calpurnia 2 → 31 → 54 → 101 → 교집합 **2 → 31**",
        "포스팅 리스트 길이에 **선형**",
        "주의: 포스팅 리스트가 **정렬되어 있어야만** 동작",
      ],
      code: `Intersect(p1, p2)
 1 answer ← ⟨⟩
 2 while p1 ≠ nil and p2 ≠ nil
 3 do if docID(p1) = docID(p2)
 4      then Add(answer, docID(p1))
 5           p1 ← next(p1)
 6           p2 ← next(p2)
 7      else if docID(p1) < docID(p2)
 8             then p1 ← next(p1)
 9             else p2 ← next(p2)
10 return answer`,
    },
    {
      title: "질의 처리 연습",
      en: "Query processing: Exercise",
      lines: [
        "france → 1 2 3 4 5 7 8 9 11 12 13 14 15 / paris → 2 6 10 12 14 / lear → 12 15",
        "((paris AND NOT france) OR lear)의 히트 목록을 구하라",
        "풀이: paris AND NOT france = paris에서 france에 있는 2·12·14 제거 → {6, 10} / OR lear {12, 15} → **6, 10, 12, 15**",
      ],
    },
    {
      title: "불리언 검색 모델 평가",
      en: "Boolean retrieval model: Assessment",
      lines: [
        "불리언 식인 질의라면 무엇이든 답할 수 있다",
        "불리언 질의 = and, or, not으로 질의어를 연결한 질의",
        "각 문서를 **용어의 집합**으로 본다",
        "**정확(precise)**: 문서가 조건에 맞거나 안 맞거나",
        "30년간 주요 상용 검색 도구",
        "많은 전문 검색자(예: 변호사)는 여전히 불리언 질의를 좋아함 — 무엇을 얻는지 정확히 앎",
        "여러분이 쓰는 많은 검색 시스템도 불리언: spotlight, 이메일, 인트라넷 등",
      ],
    },
    {
      title: "상업적으로 성공한 불리언 검색: Westlaw",
      en: "Commercially successful Boolean retrieval: Westlaw",
      lines: [
        "유료 구독자 수 기준 최대의 상용 **법률** 검색 서비스",
        "50만 명 넘는 구독자가 수십 테라바이트 텍스트에서 하루 수백만 건 검색",
        "**1975년** 서비스 시작",
        "2005년에도 불리언 검색(Westlaw의 이름으로 **'Terms and Connectors'**)이 기본값이었고 많은 사용자가 사용 …",
        "… 순위 검색은 **1992년**부터 제공되었는데도",
      ],
    },
    {
      title: "Westlaw: 질의 예",
      en: "Westlaw: Example queries",
      lines: [
        "정보 요구: 경쟁사에 다녔던 직원의 영업 비밀 공개를 막는 법 이론 → 질의: \"trade secret\" /s disclos! /s prevent /s employe!",
        "정보 요구: 장애인이 작업장에 접근할 수 있게 하는 요건 → 질의: disab! /p access! /s work-site work-place (employment /3 place)",
        "정보 요구: 취한 손님에 대한 주인의 책임 사례 → 질의: host! /p (responsib! liab!) /p (intoxicat! drunk!) /p guest",
      ],
    },
    {
      title: "Westlaw: 평",
      en: "Westlaw: Comments",
      lines: [
        "근접 연산자: **/3** = 3단어 이내, **/s** = 한 문장 안, **/p** = 한 문단 안",
        "**공백은 연언(AND)이 아니라 선언(OR)!** (Google 이전 검색의 기본값)",
        "길고 정밀한 질의: 점진적으로 개발 — 웹 검색과 다름",
        "전문 검색자가 불리언을 좋아하는 이유: **precision, transparency, control**",
        "불리언 질의가 최선인 때는? 정보 요구, 검색자, 문서 컬렉션 … 에 달림",
      ],
    },
    {
      title: "질의 최적화",
      en: "Query optimization",
      lines: [
        "n > 2인 n개 용어의 and 질의: 각 용어의 포스팅을 가져와 and로 합침",
        "예: Brutus AND Calpurnia AND Caesar — 최선의 처리 순서는?",
        "단순하고 효과적인 최적화: **빈도가 증가하는 순서**로 처리",
        "**가장 짧은 포스팅 리스트부터** 시작해 계속 잘라 나감",
        "이 예에선 Caesar(5 → 31) → Calpurnia(2 → 31 → 54 → 101) → Brutus(1 → 2 → 4 → 11 → 31 → 45 → 173 → 174) 순",
      ],
      code: `Intersect(⟨t1, …, tn⟩)
1 terms ← SortByIncreasingFrequency(⟨t1, …, tn⟩)
2 result ← postings(first(terms))
3 terms ← rest(terms)
4 while terms ≠ nil and result ≠ nil
5 do result ← Intersect(result, postings(first(terms)))
6    terms ← rest(terms)
7 return result`,
    },
    {
      title: "더 일반적인 최적화",
      en: "More general optimization",
      lines: [
        "예: (madding or crowd) and (ignoble or strife)",
        "모든 용어의 빈도를 구한다",
        "각 or의 크기를 빈도의 **합**으로 추정(보수적)",
        "or 크기가 **증가하는 순서**로 처리",
      ],
    },
    {
      title: "수업 개요 (각 장 예고)",
      en: "Course overview",
      lines: [
        "IIR 1장 완료 — 남은 학기에 IIR 21장 중 18~20장",
        "IIR 02 용어 어휘와 포스팅: 구 질의 \"Stanford University\", 근접 질의 Gates near Microsoft → **위치 정보**를 담은 색인 필요",
        "IIR 03 사전과 허용 검색: bigram 색인 예 — bo → aboard, about, boardroom, border / or → border, lord, morbid, sordid / rd → aboard, ardent, boardroom, border",
        "IIR 04 색인 구축: splits → master가 parser 배정 → a-f, g-p, q-z 구간 → inverter (map phase / segment files / reduce phase)",
        "IIR 05 색인 압축: **Zipf 법칙** (log10 cf vs log10 rank 그래프)",
        "IIR 06 점수·가중치·벡터 공간: 불리언은 포함/제외만 → 순위 검색은 질의와 각 문서의 근접도 측정, 형식 하나가 **벡터 공간 모델** / 핵심 과제는 문서 안 용어의 증거 누적 — 0 vs 1회, 2 vs 3회, 보통 많을수록 좋지만 얼마나? → 빈도를 점수·가중치로 바꾸는 함수 필요",
        "IIR 07 완전한 검색 시스템의 점수 계산: 문서 → 파싱·언어 처리 → 색인기 → 색인(메타데이터 존·필드, 부정확 top K, 계층 위치 색인, k-gram) / 질의 → 자유 텍스트 질의 파서 → 철자 교정 → 점수·순위 → 결과 페이지 (MLR, 학습 집합)",
        "IIR 08 평가와 동적 요약 / IIR 09 적합성 피드백과 질의 확장",
        "IIR 12 언어 모델: 상태 하나짜리 확률 유한 오토마톤(유니그램 언어 모델), STOP은 멈춤 기호 — frog said that toad likes frog STOP → P = 0.01 · 0.03 · 0.04 · 0.01 · 0.02 · 0.01 · 0.2 = 0.0000000000048",
        "IIR 13 텍스트 분류와 Naive Bayes: 문서를 미리 정한 클래스에 자동 배정 — 언어(영어 vs 프랑스어), 성인 콘텐츠, 지역",
        "IIR 14 벡터 분류 / IIR 15 SVM / IIR 16 평면 군집화 / IIR 17 계층 군집화(news.google.com) / IIR 18 잠재 의미 색인(LSI)",
        "IIR 19 웹과 그 도전: 특이하고 다양한 문서·사용자·정보 요구, 용어와 텍스트를 넘어 링크 분석·사용자 데이터 활용 / IIR 21 링크 분석·PageRank",
      ],
    },
  ],

  voc: [
    {
      title: "목차와 Recap",
      en: "Overview · Recap",
      lines: [
        "목차: ① Recap ② Documents ③ Terms(일반 + 비영어, 영어) ④ Skip pointers ⑤ Phrase queries",
        "Recap — 역색인: 용어마다 그 용어를 포함한 문서 목록 (Brutus 1 2 4 11 31 45 173 174 / Caesar 1 2 4 5 6 16 57 132 … / Calpurnia 2 31 54 101), dictionary + postings",
        "Recap — 교집합: Brutus ∩ Calpurnia = 2 → 31",
        "Recap — 역색인 구축의 포스팅 정렬, Westlaw 질의 예, Google의 불리언 해석(앵커 텍스트·변형어·긴 질의·결과가 적을 때)",
      ],
    },
    {
      title: "Take-away",
      lines: [
        "고전 정보검색 시스템의 기본 단위 이해: **단어와 문서** — 문서란 무엇이고, 용어란 무엇인가?",
        "토큰화: 원문에서 단어(토큰)로 어떻게 가나",
        "더 복잡한 색인: **스킵 포인터**와 **구(phrase)**",
      ],
    },
    {
      title: "문서",
      en: "Documents",
      lines: [
        "지난 강의: 단순한 불리언 검색 시스템",
        "가정: 문서가 무엇인지 안다 / 각 문서를 '기계가 읽을' 수 있다",
        "현실에선 이것이 복잡할 수 있다",
      ],
    },
    {
      title: "문서 파싱",
      en: "Parsing a document",
      lines: [
        "각 문서의 **형식**과 **언어**를 다뤄야 한다",
        "형식은? pdf, word, excel, html 등",
        "언어는?",
        "어떤 문자 집합(character set)을 쓰나?",
        "이 각각이 **분류 문제** — 수업 후반(IIR 13)에 다룸",
        "대안: **휴리스틱** 사용",
      ],
    },
    {
      title: "형식·언어의 복잡한 경우",
      en: "Format/Language: Complications",
      lines: [
        "하나의 색인에는 보통 여러 언어의 용어가 들어 있다",
        "문서나 그 구성 요소가 여러 언어·형식을 담기도 한다 — 스페인어 pdf가 첨부된 프랑스어 이메일",
        "색인의 **문서 단위**는? 파일 하나? 이메일 하나? 첨부 5개 달린 이메일? 파일 묶음(HTML 속 ppt나 latex)?",
        "결론: '문서란 무엇인가?'에 답하는 것은 **사소하지 않으며 설계 결정**이 필요",
        "XML도 마찬가지",
      ],
    },
    {
      title: "정의: word · term · token · type",
      en: "Definitions",
      lines: [
        "**Word** – 텍스트에 나타나는 그대로의 구분된 문자열",
        "**Term** – '정규화된' word(대소문자, 형태, 철자 등) — word의 **동치류**",
        "**Token** – 문서에 나타난 word나 term의 **한 번의 출현(instance)**",
        "**Type** – 대부분 term과 같음 — **token의 동치류**",
      ],
    },
    {
      title: "정규화",
      en: "Normalization",
      lines: [
        "색인할 텍스트의 word와 **질의어를 같은 형태로** '정규화'해야 한다",
        "예: U.S.A.와 USA를 맞추고 싶다",
        "가장 흔히는 용어의 **동치류를 암묵적으로** 정의한다",
        "대안: **비대칭 확장** — window → window, windows / windows → Windows, windows / Windows → (확장 없음)",
        "더 강력하지만 덜 효율적",
        "왜 window, Window, windows, Windows를 한 동치류에 넣고 싶지 않을까? (Windows = 운영체제)",
      ],
    },
    {
      title: "정규화: 다른 언어",
      en: "Normalization: Other languages",
      lines: [
        "정규화와 **언어 판별**은 상호작용한다",
        "PETER WILL NICHT MIT. → MIT = mit (독일어 '함께')",
        "He got his PhD from MIT. → MIT ≠ mit",
      ],
    },
    {
      title: "토큰화: 역색인 구축 다시 보기",
      en: "Tokenization",
      lines: [
        "입력: Friends, Romans, countrymen. So let it be with Caesar …",
        "출력: friend roman countryman so …",
        "각 토큰은 포스팅 항목의 후보",
        "어떤 토큰이 내보낼 만한 유효한 토큰인가?",
      ],
    },
    {
      title: "연습",
      en: "Exercises",
      lines: [
        "In June, the dog likes to chase the cat in the barn. — word token은 몇 개? word type은 몇 개? → **12 tokens, 9 types** (IIR 3 Recap의 답)",
        "영어에서도 토큰화가 어려운 이유 — 토큰화해 보라: Mr. O'Neill thinks that the boys' stories about Chile's capital aren't amusing.",
      ],
    },
    {
      title: "토큰화 문제: 한 단어? 두 단어? (여러 단어?)",
      en: "One word or two?",
      lines: [
        "Hewlett-Packard / State-of-the-art / co-education / the hold-him-back-and-drag-him-away maneuver",
        "data base / San Francisco / Los Angeles-based company / cheap San Francisco-Los Angeles fares",
        "York University vs. New York University",
      ],
    },
    {
      title: "숫자",
      en: "Numbers",
      lines: [
        "3/20/91 · 20/3/91 · Mar 20, 1991 · B-52 · 100.2.86.144 · (800) 234-2333 · 800.234.2333",
        "옛 IR 시스템은 숫자를 색인하지 않기도 했다 …",
        "… 하지만 일반적으로 **유용한 기능**이다 (Google 예)",
      ],
    },
    {
      title: "중국어: 공백 없음 · 모호한 분할",
      en: "Chinese: No whitespace · Ambiguous segmentation",
      lines: [
        "중국어 문장 예(샤라포바 기사): 단어 사이 공백이 없다",
        "和尚: 두 글자를 한 단어 **'스님(monk)'**으로 볼 수도, 두 단어 **'그리고(and)' + '아직(still)'**으로 볼 수도 있다",
      ],
    },
    {
      title: "그 밖의 '공백 없음'",
      en: "Other cases of no whitespace",
      lines: [
        "네덜란드어·독일어·스웨덴어의 **합성어**",
        "Computerlinguistik → Computer + Linguistik",
        "Lebensversicherungsgesellschaftsangestellter → leben + versicherung + gesellschaft + angestellter",
        "이누이트어: tusaatsiarunnanngittualuujunga (잘 안 들려요)",
        "분할이 어려운 언어는 많다: 핀란드어, 우르두어, …",
      ],
    },
    {
      title: "일본어 · 아랍어",
      en: "Japanese · Arabic script",
      lines: [
        "일본어: 4가지 '알파벳' — 한자, 굴절 어미·기능어용 **히라가나**, 외래어 표기 등에 쓰는 **가타카나**, 라틴 문자 / 중국어처럼 공백 없음 / 최종 사용자는 질의를 **전부 히라가나로** 쓸 수도 있다",
        "아랍 문자: /kitābun/ '책' — 글자가 오른쪽 → 왼쪽",
        "양방향성: 'Algeria achieved its independence in 1962 after 132 years of French occupation.' — 글은 오른쪽 → 왼쪽, 숫자는 왼쪽 → 오른쪽",
        "텍스트가 **유니코드**로 부호화되어 있으면 양방향성은 문제가 아니다",
      ],
    },
    {
      title: "악센트와 발음 구별 기호",
      en: "Accents and diacritics",
      lines: [
        "악센트: résumé vs. resume (악센트를 단순 생략)",
        "움라우트: Universität vs. Universitaet (특수 글자를 'ae'로 대체)",
        "가장 중요한 기준: **사용자가 이 단어들을 질의에 어떻게 쓸 것인가?**",
        "악센트가 표준인 언어에서도 사용자는 자주 입력하지 않는다 (폴란드어?)",
      ],
    },
    {
      title: "대소문자 접기",
      en: "Case folding",
      lines: [
        "모든 글자를 소문자로 줄인다",
        "대소문자가 의미를 가질 수 있는데도: 문장 중간의 대문자 단어 / MIT vs. mit / Fed vs. fed / …",
        "사용자는 올바른 대소문자와 관계없이 소문자를 쓰므로 **전부 소문자로 하는 게 대개 최선**",
      ],
    },
    {
      title: "불용어",
      en: "Stop words",
      lines: [
        "불용어 = 사용자 요구에 맞는 문서를 고르는 데 거의 도움이 안 될 것 같은 **극히 흔한 단어**",
        "예: a, an, and, are, as, at, be, by, for, from, has, he, in, is, it, its, of, on, that, the, to, was, were, will, with",
        "불용어 제거는 옛 IR 시스템에선 표준이었다",
        "하지만 **구 질의에는 불용어가 필요** — \"King of Denmark\"",
        "대부분의 웹 검색 엔진은 **불용어를 색인한다**",
      ],
    },
    {
      title: "더 많은 동치류",
      en: "More equivalence classing",
      lines: [
        "**Soundex**: IIR 3 (발음 동치, Muller = Mueller)",
        "**시소러스**: IIR 9 (의미 동치, car = automobile)",
      ],
    },
    {
      title: "표제어 추출",
      en: "Lemmatization",
      lines: [
        "굴절·변이 형태를 기본형으로 줄인다",
        "예: am, are, is → be",
        "예: car, cars, car's, cars' → car",
        "예: the boy's cars are different colors → the boy car be different color",
        "표제어 추출 = 사전 표제어 형태(**lemma**)로 '제대로' 줄이는 것",
        "**굴절** 형태론(cutting → cut) vs. **파생** 형태론(destruction → destroy)",
      ],
    },
    {
      title: "어간 추출",
      en: "Stemming",
      lines: [
        "정의: '원칙적인' 표제어 추출이 많은 언어 지식으로 하려는 일을 이루기를 바라며 **단어 끝을 잘라 내는 거친 휴리스틱 과정**",
        "**언어 의존적**",
        "흔히 굴절과 **파생** 모두",
        "파생의 예: automate, automatic, automation → 모두 **automat**",
      ],
    },
    {
      title: "Porter 알고리즘",
      en: "Porter algorithm",
      lines: [
        "영어 어간 추출에 가장 흔한 알고리즘",
        "다른 어간 추출 방법만큼은 좋다는 결과",
        "**규칙(conventions) + 5단계 축약**",
        "단계는 **순서대로** 적용",
        "각 단계는 명령들의 집합",
        "명령 예: 남는 부분이 1글자보다 길면 마지막 **ement** 삭제 — replacement → replac, cement → cement",
        "규칙 예: 복합 명령의 규칙 중 **가장 긴 접미사**에 적용되는 것을 고른다",
      ],
      table: {
        title: "Porter 어간 추출기: 몇 가지 규칙",
        headers: ["Rule", "Example"],
        rows: [
          ["SSES → SS", "caresses → caress"],
          ["IES → I", "ponies → poni"],
          ["SS → SS", "caress → caress"],
          ["S → ", "cats → cat"],
        ],
      },
    },
    {
      title: "세 어간 추출기 비교",
      en: "Three stemmers: A comparison",
      lines: [
        "원문: Such an analysis can reveal features that are not easily visible from the variations in the individual genes and can lead to a picture of expression that is more biologically transparent and accessible to interpretation",
        "Porter: such an analysi can reveal featur that ar not easili visibl from the variat in the individu gene and can lead to a pictur of express that is more biolog transpar and access to interpret",
        "Lovins: such an analys can reve featur that ar not eas vis from th vari in th individu gen and can lead to a pictur of expres that is mor biolog transpar and acces to interpres",
        "Paice: such an analys can rev feat that are not easy vis from the vary in the individ gen and can lead to a pict of express that is mor biolog transp and access to interpret",
      ],
    },
    {
      title: "어간 추출은 효과를 높이나?",
      en: "Does stemming improve effectiveness?",
      lines: [
        "일반적으로 어떤 질의에선 효과를 **높이고** 어떤 질의에선 **낮춘다**",
        "도움이 될 질의: [tartan sweaters], [sightseeing tour san francisco] (동치류: {sweater, sweaters}, {tour, tours})",
        "Porter의 동치류 **oper**에는 operate, operating, operates, operation, operative, operatives, operational이 모두 들어감",
        "해가 되는 질의: [operational AND research], [operating AND system], [operative AND dentistry]",
        "연습: Google은 불용어, 정규화, 토큰화, 소문자화, 어간 추출, 비라틴 문자, 움라우트, 합성어, 숫자를 어떻게 처리하나?",
      ],
    },
    {
      title: "스킵 포인터",
      en: "Skip pointers",
      lines: [
        "기본 교집합 알고리즘은 포스팅 리스트 길이에 선형 — 더 잘할 수 있을까?",
        "스킵 포인터는 검색 결과에 들어가지 않을 포스팅을 **건너뛰게** 해 준다 → 교집합이 더 효율적",
        "어떤 포스팅 리스트는 수백만 항목 — 기본 교집합이 선형이어도 효율이 문제될 수 있음",
        "스킵 포인터를 어디에 둘까? 교집합 결과가 맞다는 걸 어떻게 보장할까?",
        "기본 아이디어: Brutus 2 4 8 34 35 64 128 (스킵 → 34, → 128) / Caesar 1 2 3 5 8 17 21 31 75 81 84 89 92 (스킵 → 8, → 31)",
        "큰 예: Brutus 2 4 8 16 19 23 28 43 (스킵 16, 28, 72) / Caesar 1 2 3 5 8 41 51 60 71 (스킵 5, 51, 98)",
      ],
      code: `IntersectWithSkips(p1, p2)
 1 answer ← ⟨⟩
 2 while p1 ≠ nil and p2 ≠ nil
 3 do if docID(p1) = docID(p2)
 4      then Add(answer, docID(p1))
 5           p1 ← next(p1)
 6           p2 ← next(p2)
 7      else if docID(p1) < docID(p2)
 8             then if hasSkip(p1) and (docID(skip(p1)) ≤ docID(p2))
 9                    then while hasSkip(p1) and (docID(skip(p1)) ≤ docID(p2))
10                         do p1 ← skip(p1)
11                    else p1 ← next(p1)
12             else if hasSkip(p2) and (docID(skip(p2)) ≤ docID(p1))
13                    then while hasSkip(p2) and (docID(skip(p2)) ≤ docID(p1))
14                         do p2 ← skip(p2)
15                    else p2 ← next(p2)
16 return answer`,
    },
    {
      title: "스킵은 어디에 둘까?",
      en: "Where do we place skips?",
      lines: [
        "트레이드오프: 건너뛰는 항목 수 vs 스킵을 쓸 수 있는 빈도",
        "스킵이 **많으면**: 각 스킵이 조금만 건너뛰지만 **자주** 쓸 수 있음",
        "스킵이 **적으면**: 각 스킵이 많이 건너뛰지만 **자주 못** 씀",
        "간단한 휴리스틱: 길이 P인 포스팅 리스트에 **√P개**를 고르게 배치",
        "질의어의 분포는 무시함",
        "색인이 **정적이면 쉬움**, 갱신이 있는 **동적 환경에선 더 어려움**",
        "스킵 포인터가 얼마나 도움이 되나? 예전엔 많이 → 오늘날 빠른 CPU에선 **그다지**",
      ],
    },
    {
      title: "구 질의",
      en: "Phrase queries",
      lines: [
        "[stanford university] 같은 질의에 **구로** 답하고 싶다",
        "그러므로 The inventor Stanford Ovshinsky never went to university는 매치되면 안 된다",
        "구 질의 개념은 사용자가 쉽게 이해한다",
        "웹 질의의 상당 부분이 구 질의(명시적으로 입력했거나 구로 해석됨)",
        "역색인에 대한 결과: 포스팅 리스트에 **docID만 저장하는 것으로는 부족**",
        "역색인을 확장하는 두 방법: **biword 색인**, **위치 색인**",
      ],
    },
    {
      title: "Biword 색인",
      en: "Biword indexes",
      lines: [
        "텍스트의 **연속된 용어 쌍**을 모두 구로 색인",
        "Friends, Romans, Countrymen → 두 biword \"friends romans\", \"romans countrymen\"",
        "각 biword가 이제 어휘의 용어가 된다",
        "두 단어 구는 이제 쉽게 답할 수 있다",
        "긴 구: \"stanford university palo alto\" → 불리언 질의 \"stanford university\" AND \"university palo\" AND \"palo alto\"",
        "히트를 **후처리 필터링**해 실제로 4단어 구를 포함한 부분집합을 골라야 함",
        "biword 색인이 드물게 쓰이는 이유: 위와 같은 **거짓 양성**, 매우 큰 용어 어휘로 인한 **색인 폭증**",
      ],
    },
    {
      title: "위치 색인",
      en: "Positional indexes",
      lines: [
        "위치 색인은 biword 색인보다 **더 효율적인 대안**",
        "비위치 색인의 포스팅 = docID 하나 / 위치 색인의 포스팅 = **docID + 위치 목록**",
        "질의 \"to₁ be₂ or₃ not₄ to₅ be₆\"",
        "to, 993427: ⟨1: ⟨7, 18, 33, 72, 86, 231⟩; 2: ⟨1, 17, 74, 222, 255⟩; 4: ⟨8, 16, 190, 429, 433⟩; 5: ⟨363, 367⟩; 7: ⟨13, 23, 191⟩; …⟩",
        "be, 178239: ⟨1: ⟨17, 25⟩; 4: ⟨17, 191, 291, 430, 434⟩; 5: ⟨14, 19, 101⟩; …⟩",
        "**문서 4가 매치!** (to 16 → be 17, to 190 → be 191, to 429 → be 430, to 433 → be 434)",
      ],
    },
    {
      title: "근접 검색",
      en: "Proximity search",
      lines: [
        "위치 색인으로 구 검색을 하는 법을 봤다 — **근접 검색**에도 쓸 수 있다",
        "예: employment /4 place — employment와 place가 서로 **4단어 이내**에 있는 모든 문서",
        "Employment agencies that place healthcare workers are seeing growth → **히트**",
        "Employment agencies that have learned to adapt now place healthcare workers → **히트 아님**",
        "가장 단순한 알고리즘: 문서 안 employment 위치와 place 위치의 **곱집합(cross-product)**",
        "자주 나오는 단어, 특히 **불용어**에 매우 비효율적",
        "문서 목록만이 아니라 **실제 매치 위치**를 돌려주고 싶다 — 동적 요약 등에 중요",
      ],
      code: `PositionalIntersect(p1, p2, k)
 1 answer ← ⟨⟩
 2 while p1 ≠ nil and p2 ≠ nil
 3 do if docID(p1) = docID(p2)
 4      then l ← ⟨⟩
 5           pp1 ← positions(p1)
 6           pp2 ← positions(p2)
 7           while pp1 ≠ nil
 8           do while pp2 ≠ nil
 9              do if |pos(pp1) − pos(pp2)| ≤ k
10                   then Add(l, pos(pp2))
11                   else if pos(pp2) > pos(pp1)
12                          then break
13                 pp2 ← next(pp2)
14              while l ≠ ⟨⟩ and |l[0] − pos(pp1)| > k
15              do Delete(l[0])
16              for each ps ∈ l
17              do Add(answer, ⟨docID(p1), pos(pp1), ps⟩)
18              pp1 ← next(pp1)
19           p1 ← next(p1)
20           p2 ← next(p2)
21      else if docID(p1) < docID(p2)
22             then p1 ← next(p1)
23             else p2 ← next(p2)
24 return answer`,
    },
    {
      title: "결합 방식",
      en: "Combination scheme",
      lines: [
        "biword 색인과 위치 색인은 유익하게 **결합**할 수 있다",
        "많은 biword는 극히 자주 나온다: Michael Jackson, Britney Spears 등",
        "이런 biword는 위치 포스팅 교집합에 비해 속도 향상이 상당하다",
        "결합 방식: **자주 나오는 biword만 어휘 용어로** 색인에 넣고, 나머지 구는 **위치 교집합**으로",
        "Williams et al. (2004)은 더 정교한 혼합 색인 방식을 평가 — 위치 색인보다 빠르고, 색인 공간은 **26% 더** 듦",
      ],
    },
    {
      title: "Google의 '위치' 질의",
      en: "Positional queries on Google",
      lines: [
        "웹 검색 엔진에서 위치 질의는 일반 불리언 질의보다 **훨씬 비싸다**",
        "구 질의를 예로 — 왜 일반 불리언 질의보다 비쌀까? (포스팅마다 위치 목록을 읽고 비교해야 함)",
        "구 질의가 불리언 질의보다 비싸다는 것을 Google에서 보여 줄 수 있나?",
        "자료: IIR 2장, Porter stemmer, Google의 재미있는 숫자 검색",
      ],
    },
  ],
};
