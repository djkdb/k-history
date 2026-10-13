import type { Chapter } from "@/lib/types";

export const CHAPTERS: Chapter[] = [
  { id: "bool", title: "불리언 검색과 역색인", en: "Boolean Retrieval", source: "IIR 1. Boolean Retrieval (01intro)", blurb: "정보검색의 정의, 용어-문서 행렬, 역색인(사전 + 포스팅), 색인 만들기 4단계, 포스팅 교집합, 불리언 모델 평가·Westlaw, 질의 최적화" },
  { id: "voc", title: "용어 어휘와 포스팅 리스트", en: "The Term Vocabulary and Postings Lists", source: "IIR 2. The term vocabulary and postings lists (02voc)", blurb: "문서 단위, word·term·token·type, 토큰화의 어려움, 정규화·대소문자·불용어, 표제어 추출·어간 추출·Porter, 스킵 포인터, 구 질의(biword·positional), 근접 검색" },
  { id: "dict", title: "사전과 허용 검색", en: "Dictionaries and Tolerant Retrieval", source: "IIR 3. Dictionaries and tolerant retrieval (03dict)", blurb: "사전 자료구조(해시 vs 트리·B-tree), 와일드카드(permuterm·k-gram), 편집 거리(Levenshtein·DP), 철자 교정(고립어·문맥), Soundex" },
  { id: "const", title: "색인 구축", en: "Index Construction", source: "IIR 4. Index Construction (04const)", blurb: "하드웨어 기초, Reuters RCV1, BSBI, SPIMI, 분산 색인·MapReduce, 동적 색인·로그 병합" },
  { id: "comp", title: "색인 압축", en: "Index Compression", source: "IIR 5. Index Compression (05comp)", blurb: "압축의 이유·손실/무손실, Heaps 법칙, Zipf 법칙, 사전 압축(문자열·블로킹·앞부분 부호화), 포스팅 압축(간격·VB 코드·γ 코드)" },
  { id: "score", title: "점수·가중치·벡터 공간 모델", en: "Scoring, Term Weighting, The Vector Space Model", source: "IIR 6. Scoring, term weighting, the vector space model (06score)", blurb: "순위 검색, Jaccard, bag of words·tf·로그 tf, df·idf·cf, tf-idf, 벡터 공간·코사인 유사도, SMART 표기 lnc.ltn" },
  { id: "system", title: "완전한 검색 시스템의 점수 계산", en: "Scores in a Complete Search System", source: "IIR 7. Scores in a complete search system (07system)", blurb: "순위의 중요성(Google 사용자 연구), 피벗 정규화, 계층 색인, 검색 시스템 구성요소, 최소 힙 top-k, PageRank 정렬·조기 종료, 문서/용어 단위 처리, 누산기" },
];
