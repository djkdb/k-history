import type { Question } from "@/lib/types";

/* IIR 6 · IIR 7 */
export const QUESTIONS_4: Question[] = [
  // ranked-retrieval
  { kind: "mc", id: "ir-q-rr-1", concept: "ranked-retrieval", q: "불리언 검색의 'feast or famine' 문제란?", options: ["결과가 너무 적거나(0) 너무 많음(수천)", "결과가 항상 정렬됨", "질의가 너무 짧음", "색인이 너무 큼"], answer: 0, explain: "[standard user dlink 650] 200,000 vs + no card found 0." },
  { kind: "mc", id: "ir-q-rr-2", concept: "ranked-retrieval", q: "교안이 불리언 검색이 '좋다'고 한 대상은?", options: ["대다수 웹 사용자", "전문가 사용자와 응용 프로그램", "초보 사용자", "모바일 사용자"], answer: 1, explain: "응용 프로그램은 수천 개 결과를 쉽게 소비." },
  { kind: "ox", id: "ir-q-rr-3", concept: "ranked-retrieval", q: "With ranking, large result sets are not an issue — just show the top 10 results.", answer: true, explain: "전제: 순위 알고리즘이 잘 동작." },
  { kind: "mc", id: "ir-q-rr-4", concept: "ranked-retrieval", q: "질의-문서 점수에 바라는 성질이 아닌 것은?", options: ["질의어가 없으면 0", "질의어가 자주 나올수록 높음", "질의어가 많이 나올수록 높음", "문서가 길수록 항상 높음"], answer: 3, explain: "교안의 세 가지." },
  { kind: "ox", id: "ir-q-rr-5", concept: "ranked-retrieval", q: "대부분의 사용자는 불리언 질의를 잘 쓰며 결과 수천 개를 훑어보는 것을 선호한다.", answer: false, explain: "반대." },

  // jaccard
  { kind: "short", id: "ir-q-jc-1", concept: "jaccard", q: "질의 'ides of March'와 문서 'Caesar died in March'의 Jaccard 계수는? (분수로)", answers: ["1/6"], explain: "교집합 1 / 합집합 6." },
  { kind: "mc", id: "ir-q-jc-2", concept: "jaccard", q: "Jaccard 계수의 문제점이 아닌 것은?", options: ["용어 빈도를 무시", "드문 용어의 정보량을 무시", "더 정교한 길이 정규화 필요", "값이 1을 넘을 수 있음"], answer: 3, explain: "항상 0~1." },
  { kind: "ox", id: "ir-q-jc-3", concept: "jaccard", q: "jaccard(A, A) = 1이고 A ∩ B = ∅이면 jaccard(A, B) = 0이다.", answer: true, explain: "정의." },
  { kind: "short", id: "ir-q-jc-4", concept: "jaccard", q: "q: [red cars and red trucks], d: 'cops stop red cars more often'의 Jaccard 계수는? (기약분수)", answers: ["1/4", "2/8"], explain: "{red, cars} 2개 / 합집합 8개." },
  { kind: "ox", id: "ir-q-jc-5", concept: "jaccard", q: "Jaccard 계수를 쓰려면 두 집합 A와 B의 크기가 같아야 한다.", answer: false, explain: "크기가 같을 필요 없음." },

  // tf-bow
  { kind: "ox", id: "ir-q-tb-1", concept: "tf-bow", q: "In the bag of words model, 'John is quicker than Mary' and 'Mary is quicker than John' are represented the same way.", answer: true, explain: "단어 순서를 무시." },
  { kind: "mc", id: "ir-q-tb-2", concept: "tf-bow", q: "원시 tf를 그대로 점수로 쓰지 않는 이유는?", options: ["tf를 계산할 수 없어서", "관련성이 빈도에 비례해서 늘지 않아서", "tf가 음수일 수 있어서", "tf는 문서마다 같아서"], answer: 1, explain: "tf 10이 tf 1보다 낫지만 10배는 아님." },
  { kind: "mc", id: "ir-q-tb-3", concept: "tf-bow", q: "tfₜ,d의 정의는?", options: ["t가 나오는 문서 수", "문서 d에서 t가 나오는 횟수", "컬렉션 전체에서 t의 횟수", "t의 순위"], answer: 1, explain: "df, cf와 구분." },
  { kind: "ox", id: "ir-q-tb-4", concept: "tf-bow", q: "bag of words 모델은 위치 색인보다 문서를 더 세밀하게 구별할 수 있다.", answer: false, explain: "어떤 의미로 후퇴 — 위치 색인은 두 문장을 구별." },

  // log-tf
  { kind: "short", id: "ir-q-lt-1", concept: "log-tf", q: "tf = 1000일 때 로그 빈도 가중치 1 + log₁₀ tf는?", answers: ["4"], hint: "숫자만", explain: "1 + 3." },
  { kind: "mc", id: "ir-q-lt-2", concept: "log-tf", q: "tf = 0일 때 로그 빈도 가중치는?", options: ["1", "0", "−∞", "정의 안 됨"], answer: 1, explain: "tf > 0일 때만 1 + log tf, 아니면 0." },
  { kind: "short", id: "ir-q-lt-3", concept: "log-tf", q: "tf = 10일 때 로그 빈도 가중치는?", answers: ["2"], hint: "숫자만", explain: "1 + 1." },
  { kind: "mc", id: "ir-q-lt-4", concept: "log-tf", q: "tf = 2일 때 로그 빈도 가중치는 약?", options: ["1", "1.3", "2", "0.3"], answer: 1, explain: "1 + log₁₀2 ≈ 1.3." },
  { kind: "ox", id: "ir-q-lt-5", concept: "log-tf", q: "tf-matching-score는 질의와 문서에 모두 있는 용어들의 (1 + log tf)를 곱한 값이다.", answer: false, explain: "곱이 아니라 합(Σ)." },

  // idf
  { kind: "short", id: "ir-q-id-1", concept: "idf", q: "N = 1,000,000, df = 100일 때 idf = log₁₀(N/df)는?", answers: ["4"], hint: "숫자만", explain: "log 10⁴." },
  { kind: "mc", id: "ir-q-id-2", concept: "idf", q: "N = 1,000,000일 때 df = 1,000,000인 용어(the)의 idf는?", options: ["6", "1", "0", "−1"], answer: 2, explain: "log 1 = 0." },
  { kind: "ox", id: "ir-q-id-3", concept: "idf", q: "idf has little effect on ranking for one-term queries.", answer: true, explain: "모든 문서에 같은 상수가 곱해짐." },
  { kind: "mc", id: "ir-q-id-4", concept: "idf", q: "N/df 대신 log(N/df)를 쓰는 이유는?", options: ["음수를 피하려고", "idf의 효과를 누그러뜨리려고(dampen)", "계산이 빨라서", "압축하려고"], answer: 1, explain: "tf와 df 둘 다 로그 변환." },
  { kind: "mc", id: "ir-q-id-5", concept: "idf", q: "'arachnocentric line' 질의에서 idf의 효과는?", options: ["line의 상대 가중치 ↑", "arachnocentric의 상대 가중치 ↑, line ↓", "둘 다 0", "효과 없음"], answer: 1, explain: "드문 용어가 더 정보가 많다." },
  { kind: "ox", id: "ir-q-id-6", concept: "idf", q: "df가 클수록 idf도 커진다.", answer: false, explain: "df는 정보량의 역척도 — df↑ → idf↓." },
  { kind: "ox", id: "ir-q-id-7", concept: "idf", q: "good, increase, line 같은 흔한 용어에도 양수지만 낮은 가중치를 원한다.", answer: true, explain: "0이 아니라 낮은 양수." },

  // cf-df
  { kind: "mc", id: "ir-q-cd-1", concept: "cf-df", q: "insurance(cf 10440, df 3997)와 try(cf 10422, df 8760) 중 더 좋은 검색어와 그 이유는?", options: ["try — cf가 비슷하고 df가 커서", "insurance — 적은 문서에 몰려 나와서", "둘 다 같다", "try — 더 흔해서"], answer: 1, explain: "가중치엔 cf보다 df가 낫다." },
  { kind: "mc", id: "ir-q-cd-2", concept: "cf-df", q: "df와 cf의 관계로 옳은 것은?", options: ["df ≥ cf", "df ≤ cf", "df = cf", "관계없음"], answer: 1, explain: "한 문서에 여러 번 나오면 cf만 늘어남." },
  { kind: "ox", id: "ir-q-cd-3", concept: "cf-df", q: "교안의 예는 가중치에 df(idf)보다 cf('icf')가 낫다는 것을 보여 준다.", answer: false, explain: "df가 낫다." },
  { kind: "mc", id: "ir-q-cd-4", concept: "cf-df", q: "Collection frequency of t의 정의는?", options: ["number of documents t occurs in", "number of tokens of t in the collection", "number of times t occurs in d", "rank of t"], answer: 1, explain: "df = number of documents." },
  { kind: "ox", id: "ir-q-cd-5", concept: "cf-df", q: "용어 t의 cf는 모든 문서에 대한 tfₜ,d의 합이다.", answer: true, explain: "cfₜ = Σ_d tfₜ,d." },

  // tf-idf
  { kind: "short", id: "ir-q-ti-1", concept: "tf-idf", q: "tf = 10, df = 1000, N = 1,000,000일 때 tf-idf 가중치 (1 + log tf) · log(N/df)는?", answers: ["6"], hint: "숫자만", explain: "2 × 3." },
  { kind: "mc", id: "ir-q-ti-2", concept: "tf-idf", q: "tf-idf 가중치는 어떻게 변하는가?", options: ["문서 안 출현이 많을수록, 컬렉션에서 흔할수록 증가", "문서 안 출현이 많을수록, 컬렉션에서 드물수록 증가", "문서 안 출현이 적을수록 증가", "항상 일정"], answer: 1, explain: "tf × idf." },
  { kind: "ox", id: "ir-q-ti-3", concept: "tf-idf", q: "tf-idf is the best known weighting scheme in information retrieval.", answer: true, explain: "tf.idf, tf x idf." },
  { kind: "mc", id: "ir-q-ti-4", concept: "tf-idf", q: "tf-idf 가중치 행렬에서 각 문서는 무엇으로 표현되는가?", options: ["{0,1}^|V| 이진 벡터", "ℕ^|V| 횟수 벡터", "ℝ^|V| 실수 벡터", "문자열"], answer: 2, explain: "이진 → 횟수 → 가중치." },
  { kind: "short", id: "ir-q-ti-5", concept: "tf-idf", q: "tf = 1, df = 100, N = 1,000,000일 때 tf-idf는?", answers: ["4"], hint: "숫자만", explain: "1 × log 10⁴." },

  // vector-space
  { kind: "mc", id: "ir-q-vs-1", concept: "vector-space", q: "벡터 공간 모델에서 공간의 축은?", options: ["문서", "용어", "질의", "포스팅"], answer: 1, explain: "문서는 점(벡터)." },
  { kind: "mc", id: "ir-q-vs-2", concept: "vector-space", q: "유클리드 거리가 질의-문서 유사도로 나쁜 이유는?", options: ["계산이 불가능", "길이가 다른 벡터 사이에서 거리가 크게 나와서", "음수가 나와서", "희소 벡터에 쓸 수 없어서"], answer: 1, explain: "q와 d₂는 분포가 비슷한데 거리는 큼." },
  { kind: "ox", id: "ir-q-vs-3", concept: "vector-space", q: "문서 d를 자기 자신에 이어 붙인 d′와 d 사이 각도는 0이다.", answer: true, explain: "최대 유사, 유클리드 거리는 클 수 있음." },
  { kind: "ox", id: "ir-q-vs-4", concept: "vector-space", q: "웹 검색에 적용한 벡터 공간은 저차원이고 각 벡터는 조밀하다.", answer: false, explain: "수천만 차원, 매우 희소." },
  { kind: "mc", id: "ir-q-vs-5", concept: "vector-space", q: "벡터 공간 모델의 핵심 아이디어 두 가지는?", options: ["질의도 벡터로, 질의와의 근접도로 순위", "문서를 집합으로, AND로 검색", "용어를 정렬, 이진 탐색", "문서를 압축, 간격 저장"], answer: 0, explain: "근접도 = 유사도." },

  // cosine
  { kind: "mc", id: "ir-q-cs2-1", concept: "cosine", q: "길이 정규화된 두 벡터의 코사인 유사도는?", options: ["유클리드 거리", "내적(dot product)", "Jaccard", "각도 그 자체"], answer: 1, explain: "cos(q, d) = Σ qᵢdᵢ." },
  { kind: "mc", id: "ir-q-cs2-2", concept: "cosine", q: "벡터 (3, 4)의 L2 노름은?", options: ["7", "5", "12", "25"], answer: 1, explain: "√(9 + 16)." },
  { kind: "ox", id: "ir-q-cs2-3", concept: "cosine", q: "질의와의 각도가 작은 순으로 순위를 매기는 것은 코사인이 큰 순으로 매기는 것과 같다.", answer: true, explain: "코사인은 [0°, 180°]에서 단조 감소." },
  { kind: "ox", id: "ir-q-cs2-4", concept: "cosine", q: "After length normalization, d and d′ (d appended to itself) have different vectors.", answer: false, explain: "identical vectors." },
  { kind: "mc", id: "ir-q-cs2-5", concept: "cosine", q: "q = (1, 0), d = (1, 1)의 코사인 유사도는?", options: ["1", "0", "1/√2 ≈ 0.71", "2"], answer: 2, explain: "1 / (1 · √2)." },
  { kind: "mc", id: "ir-q-cs2-6", concept: "cosine", q: "길이 정규화의 효과는?", options: ["긴 문서의 가중치를 키움", "긴 문서와 짧은 문서의 가중치가 같은 규모가 됨", "모든 가중치를 0으로", "용어 순서를 저장"], answer: 1, explain: "단위 구 위로." },
  { kind: "short", id: "ir-q-cs2-7", concept: "cosine", q: "벡터 (1, 0, 1, 1.3)의 L2 노름은 약? (소수 둘째 자리)", answers: ["1.92"], explain: "√(1 + 0 + 1 + 1.69) ≈ 1.92." },

  // cosine-example
  { kind: "mc", id: "ir-q-ce-1", concept: "cosine-example", q: "세 소설 예에서 가장 유사한 쌍은?", options: ["SaS–WH", "PaP–WH", "SaS–PaP", "모두 같음"], answer: 2, explain: "0.94 > 0.79 > 0.69." },
  { kind: "short", id: "ir-q-ce-2", concept: "cosine-example", q: "affection의 tf = 115일 때 로그 빈도 가중치는 약? (소수 둘째 자리)", answers: ["3.06"], explain: "1 + log₁₀115 ≈ 3.06." },
  { kind: "ox", id: "ir-q-ce-3", concept: "cosine-example", q: "세 소설 예는 idf까지 포함한 tf-idf 가중치로 코사인을 계산했다.", answer: false, explain: "단순화를 위해 idf는 쓰지 않았다(로그 tf + 코사인 정규화)." },
  { kind: "mc", id: "ir-q-ce-4", concept: "cosine-example", q: "cos(SaS, PaP) ≈ 0.789·0.832 + 0.515·0.555 + 0.335·0 + 0·0의 값은?", options: ["0.69", "0.79", "0.94", "1.00"], answer: 2, explain: "≈ 0.656 + 0.286." },

  // smart
  { kind: "mc", id: "ir-q-sm-1", concept: "smart", q: "lnc.ltn에서 문서 쪽 가중치는?", options: ["로그 tf, idf, 코사인", "로그 tf, idf 없음, 코사인 정규화", "로그 tf, idf, 정규화 없음", "자연 tf, idf, 코사인"], answer: 1, explain: "ddd.qqq — 앞이 문서." },
  { kind: "mc", id: "ir-q-sm-2", concept: "smart", q: "lnc.ltn에서 질의 쪽 가중치는?", options: ["로그 tf, idf, 정규화 없음", "로그 tf, idf 없음, 코사인", "자연 tf, idf 없음, 정규화 없음", "불리언 tf, idf, 코사인"], answer: 0, explain: "l·t·n." },
  { kind: "short", id: "ir-q-sm-3", concept: "smart", q: "질의 'best car insurance', 문서 'car insurance auto insurance'의 lnc.ltn 최종 점수는?", answers: ["3.08"], explain: "0 + 0 + 1.04 + 2.04." },
  { kind: "mc", id: "ir-q-sm-4", concept: "smart", q: "위 예에서 insurance의 정규화된 문서 가중치는?", options: ["0.52", "0.68", "1.3", "3.0"], answer: 1, explain: "1.3 / 1.92." },
  { kind: "mc", id: "ir-q-sm-5", concept: "smart", q: "SMART 표기의 정규화 'c'는?", options: ["cosine: 1/√(w₁² + … + w_M²)", "count", "constant 1", "character length"], answer: 0, explain: "u = pivoted unique, b = byte size." },
  { kind: "ox", id: "ir-q-sm-6", concept: "smart", q: "SMART 표기 ddd.qqq에서 앞의 세 글자는 질의, 뒤의 세 글자는 문서 가중치다.", answer: false, explain: "앞이 문서(ddd), 뒤가 질의(qqq)." },
  { kind: "mc", id: "ir-q-sm-7", concept: "smart", q: "교안이 '가장 잘 알려진 조합'으로 표시한 것은?", options: ["nnn", "ltc", "lnc", "bnn"], answer: 1, explain: "logarithm · idf · cosine. 기본값은 nnn." },
  { kind: "mc", id: "ir-q-sm-8", concept: "smart", q: "augmented tf(a)의 식은?", options: ["0.5 + 0.5 × tf / maxₜ(tf)", "1 + log tf", "tf > 0이면 1", "tf / 문서 길이"], answer: 0, explain: "최대 tf로 나눠 0.5~1 사이." },
  { kind: "short", id: "ir-q-sm-9", concept: "smart", q: "N = 1,000,000이고 df(car) = 10,000일 때 car의 idf는?", answers: ["2", "2.0"], hint: "숫자만", explain: "log 100." },

  // cosine-score
  { kind: "mc", id: "ir-q-csc-1", concept: "cosine-score", q: "CosineScore 알고리즘에서 Scores[d]에 누적하는 값은?", options: ["w(t,d) + w(t,q)", "w(t,d) × w(t,q)", "tf(t,d)", "df(t)"], answer: 1, explain: "그다음 Length[d]로 나눔." },
  { kind: "ox", id: "ir-q-csc-2", concept: "cosine-score", q: "CosineScore는 마지막에 Scores[d]를 Length[d]로 나눈 뒤 상위 K개를 반환한다.", answer: true, explain: "정규화." },
  { kind: "mc", id: "ir-q-csc-3", concept: "cosine-score", q: "벡터 공간 순위 검색 요약의 마지막 단계는?", options: ["질의를 벡터로", "코사인 계산", "상위 K(예: 10)를 사용자에게 반환", "색인 압축"], answer: 2, explain: "표현 → 코사인 → 순위 → top K." },
  { kind: "mc", id: "ir-q-csc-4", concept: "cosine-score", q: "교안이 최신(state-of-the-art) 가중치 방법으로 소개한 것은?", options: ["Soundex", "Okapi BM25", "Porter", "PageRank"], answer: 1, explain: "IIR 11.4.3." },

  // ranking-importance
  { kind: "mc", id: "ir-q-ri-1", concept: "ranking-importance", q: "Google 사용자 연구에서 사용자가 1위 페이지를 클릭하는 비율은?", options: ["10번에 1번", "4번에 1번", "2번에 1번", "거의 항상"], answer: 2, explain: "In 1 out of 2 cases." },
  { kind: "short", id: "ir-q-ri-2", concept: "ranking-importance", q: "1위 페이지가 관련 없어도 그것을 클릭하는 사용자의 비율은 몇 %인가?", answers: ["30", "30%"], hint: "숫자만", explain: "Getting the top-ranked page right is most important." },
  { kind: "mc", id: "ir-q-ri-3", concept: "ranking-importance", q: "'Presentation bias' 실험이 보여 주는 것은?", options: ["사용자는 순서를 무시한다", "제시 순서가 어디를 보고 클릭하는지에 영향을 준다", "2위가 항상 더 많이 클릭된다", "스니펫이 없으면 클릭이 없다"], answer: 1, explain: "1·2위를 바꿔도 위쪽 클릭이 많음." },
  { kind: "mc", id: "ir-q-ri-4", concept: "ranking-importance", q: "페이지당 본 요약 수의 평균과 중앙값은?", options: ["3.07 / 2.00", "10 / 5", "1.00 / 1.00", "5.5 / 3"], answer: 0, explain: "페이지 넘김 뒤 급감." },
  { kind: "ox", id: "ir-q-ri-5", concept: "ranking-importance", q: "Ranking is important because it effectively reduces a large set of results to a very small one.", answer: true, explain: "Why rank?" },
  { kind: "mc", id: "ir-q-ri-6", concept: "ranking-importance", q: "검색자 관찰 방법으로 교안에 없는 것은?", options: ["시선 추적", "소리 내어 생각하기", "클릭 기록", "뇌파 측정"], answer: 3, explain: "녹화, 인터뷰, 시간 측정도." },
  { kind: "ox", id: "ir-q-ri-7", concept: "ranking-importance", q: "사용자는 하위(7~10위) 결과의 요약을 상위(1~4위)보다 더 많이 읽는다.", answer: false, explain: "상위 요약을 훨씬 많이 읽는다." },

  // pivot-norm
  { kind: "mc", id: "ir-q-pv-1", concept: "pivot-norm", q: "코사인 정규화의 편향은?", options: ["짧은 문서엔 너무 작은, 긴 문서엔 너무 큰 가중치", "짧은 문서엔 너무 큰, 긴 문서엔 너무 작은 가중치", "편향 없음", "모든 문서에 0"], answer: 1, explain: "평균적으로." },
  { kind: "mc", id: "ir-q-pv-2", concept: "pivot-norm", q: "피벗 정규화의 효과는?", options: ["짧은 문서 유사도 ↑, 긴 문서 ↓", "짧은 문서 유사도 ↓, 긴 문서 ↑", "모두 ↑", "모두 ↓"], answer: 1, explain: "짧은 문서의 불공정한 이점 제거." },
  { kind: "ox", id: "ir-q-pv-3", concept: "pivot-norm", q: "Amit Singhal의 실험에서 기울기 0.75의 피벗 정규화가 평균 정밀도를 약 11.7% 개선했다.", answer: true, explain: "0.2840 → 0.3171." },
  { kind: "mc", id: "ir-q-pv-4", concept: "pivot-norm", q: "anti-doping 연습에서 d₂(d₁ 복사본 + 무관한 뉴스 5개)의 문제는?", options: ["코사인 정규화가 긴 d₂를 지나치게 깎음", "d₂가 너무 짧음", "d₂엔 질의어가 없음", "d₂는 중복이라 색인 불가"], answer: 0, explain: "피벗 정규화의 동기." },
  { kind: "ox", id: "ir-q-pv-5", concept: "pivot-norm", q: "피벗 정규화는 코사인 정규화를 비선형으로 완전히 대체한다.", answer: false, explain: "피벗을 중심으로 한 선형 조정." },

  // tiered-index
  { kind: "mc", id: "ir-q-ti2-1", concept: "tiered-index", q: "계층 색인에서 최상위 계층이 k개 이상의 결과를 내면?", options: ["다음 계층으로 감", "멈추고 결과 반환", "모든 계층을 합침", "결과를 버림"], answer: 1, explain: "k개 미만이면 다음 계층." },
  { kind: "mc", id: "ir-q-ti2-2", concept: "tiered-index", q: "교안의 두 계층 예에서 1층은?", options: ["모든 제목의 색인", "본문의 색인", "앵커 텍스트", "메타데이터"], answer: 0, explain: "2층은 나머지 문서." },
  { kind: "ox", id: "ir-q-ti2-3", concept: "tiered-index", q: "계층 색인은 Google의 초기 검색 품질이 높았던 이유 중 하나로 여겨진다.", answer: true, explain: "PageRank, 앵커 텍스트, 근접 제약과 함께." },
  { kind: "ox", id: "ir-q-ti2-4", concept: "tiered-index", q: "대부분 질의가 대부분 계층을 거쳐야 하더라도 계층화의 이점은 크다.", answer: false, explain: "그렇다면 이점이 없다." },
  { kind: "mc", id: "ir-q-ti2-5", concept: "tiered-index", q: "계층 시스템 설계 기준으로 교안에 나온 것은?", options: ["각 계층이 다음 계층보다 한 차수 작게", "모든 계층 크기가 같게", "계층 수는 항상 2", "1층에 모든 문서"], answer: 0, explain: "+ 멈출지 판단하는 간단한 테스트." },

  // complete-system
  { kind: "mc", id: "ir-q-sy-1", concept: "complete-system", q: "스니펫(동적 요약) 생성에 필요한 구성요소는?", options: ["문서 캐시", "k-gram 색인", "계층 색인", "Soundex"], answer: 0, explain: "Document cache." },
  { kind: "mc", id: "ir-q-sy-2", concept: "complete-system", q: "본문·강조 텍스트·앵커 텍스트·메타데이터 필드별로 색인을 분리한 것은?", options: ["계층 색인", "존 색인", "위치 색인", "permuterm 색인"], answer: 1, explain: "Zone indexes." },
  { kind: "ox", id: "ir-q-sy-3", concept: "complete-system", q: "완전한 검색 시스템에서 점수 매개변수는 학습 집합으로 기계 학습 순위(MLR)를 통해 정할 수 있다.", answer: true, explain: "Scoring parameters ↔ MLR ↔ training set." },
  { kind: "mc", id: "ir-q-sy-4", concept: "complete-system", q: "근접 순위(proximity ranking)의 의미는?", options: ["질의어가 가까이 모여 있는 문서를 위로", "최근 문서를 위로", "짧은 문서를 위로", "PageRank가 높은 문서를 위로"], answer: 0, explain: "같은 지역 창 안." },
  { kind: "ox", id: "ir-q-sy-5", concept: "complete-system", q: "불리언 '+'·'−' 제약을 벡터 공간 검색과 결합할 때 후처리 필터링은 항상 효율적이다.", answer: false, explain: "단순하지만 매우 비효율적일 수 있다." },
  { kind: "mc", id: "ir-q-sy-6", concept: "complete-system", q: "사용자 질의가 지나가는 순서로 옳은 것은?", options: ["철자 교정 → 질의 파서 → 순위", "자유 텍스트 질의 파서 → 철자 교정 → 점수·순위 → 결과 페이지", "순위 → 파서 → 교정", "색인기 → 파서 → 결과"], answer: 1, explain: "그림의 흐름." },

  // tf-in-index
  { kind: "ox", id: "ir-q-tx-1", concept: "tf-in-index", q: "포스팅의 tf는 로그 가중된 실수로 저장하는 것이 일반적이다.", answer: false, explain: "정수로 — 실수는 압축이 어렵다." },
  { kind: "mc", id: "ir-q-tx-2", concept: "tf-in-index", q: "포스팅에 tf를 추가로 저장하는 공간 비용은?", options: ["포스팅당 1바이트 이하", "포스팅당 8바이트", "사전 크기의 두 배", "문서당 1KB"], answer: 0, explain: "small." },
  { kind: "mc", id: "ir-q-tx-3", concept: "tf-in-index", q: "Brutus → (1,2) (7,3) (83,1)에서 (7,3)의 의미는?", options: ["문서 7에서 위치 3", "문서 7에서 tf 3", "문서 3에서 tf 7", "df 7, cf 3"], answer: 1, explain: "(docID, tf)." },

  // top-k-heap
  { kind: "mc", id: "ir-q-hk-1", concept: "top-k-heap", q: "최소 힙으로 N개 중 top k를 고르는 구성 비용은?", options: ["O(N)", "O(N log k)", "O(N log N)", "O(k)"], answer: 1, explain: "승자 읽기는 O(k log k)." },
  { kind: "mc", id: "ir-q-hk-2", concept: "top-k-heap", q: "새 문서 점수 s′가 힙 최솟값 hₘ 이하이면?", options: ["루트 삭제 후 추가", "건너뜀", "힙을 비움", "k를 늘림"], answer: 1, explain: "s′ > hₘ일 때만 교체." },
  { kind: "ox", id: "ir-q-hk-3", concept: "top-k-heap", q: "A binary min heap is a binary tree in which each node's value is less than the values of its children.", answer: true, explain: "루트 = 최솟값." },
  { kind: "ox", id: "ir-q-hk-4", concept: "top-k-heap", q: "질의 벡터의 k-최근접 이웃 문제에는 일반적인 준선형(sublinear) 해법이 있다.", answer: false, explain: "no general sublinear solutions." },
  { kind: "mc", id: "ir-q-hk-5", concept: "top-k-heap", q: "top k 유지에 최대 힙이 아니라 최소 힙을 쓰는 이유는?", options: ["더 작아서", "현재 top k 중 꼴찌(최솟값)를 O(1)에 확인해 교체 여부를 판단하려고", "정렬이 필요 없어서", "최대값이 필요 없어서"], answer: 1, explain: "꼴찌보다 좋으면 교체." },

  // non-docid
  { kind: "short", id: "ir-q-nd-1", concept: "non-docid", q: "net-score = g(d) + cos(q, d), g < 0.1인 문서를 처리 중이고 현재 top k 최소 점수가 1.2일 때, 남은 문서 점수의 상한은?", answers: ["1.1"], explain: "0.1 + 1 → 조기 종료." },
  { kind: "mc", id: "ir-q-nd-2", concept: "non-docid", q: "PageRank 같은 척도로 포스팅을 정렬하는 이유는?", options: ["압축률 향상", "조기 종료로 top k를 빨리 찾으려고", "docID를 없애려고", "철자 교정"], answer: 1, explain: "질의 독립적인 '좋음' 척도." },
  { kind: "ox", id: "ir-q-nd-3", concept: "non-docid", q: "PageRank g(d)는 질의에 따라 달라지는 척도다.", answer: false, explain: "query-independent." },
  { kind: "ox", id: "ir-q-nd-4", concept: "non-docid", q: "탐색 공간 가지치기 휴리스틱은 정확성이 보장되지 않지만 드물게만 실패하고 실제로 거의 상수 시간이다.", answer: true, explain: "교안." },

  // daat-taat
  { kind: "mc", id: "ir-q-dt-1", concept: "daat-taat", q: "문서 dᵢ의 점수를 완전히 계산한 뒤 dᵢ₊₁로 넘어가는 방식은?", options: ["term-at-a-time", "document-at-a-time", "tier-at-a-time", "block-at-a-time"], answer: 1, explain: "일관된 문서 순서가 필요." },
  { kind: "mc", id: "ir-q-dt-2", concept: "daat-taat", q: "가중치 정렬 포스팅에서 문서 단위 처리를 쓸 수 없는 이유는?", options: ["가중치가 정수라서", "포스팅에 일관된 문서 순서가 없어서", "누산기가 없어서", "문서가 너무 많아서"], answer: 1, explain: "그래서 term-at-a-time." },
  { kind: "ox", id: "ir-q-dt-3", concept: "daat-taat", q: "CosineScore 알고리즘은 term-at-a-time 처리다.", answer: true, explain: "용어 하나의 포스팅을 끝까지." },
  { kind: "ox", id: "ir-q-dt-4", concept: "daat-taat", q: "가중치 정렬 포스팅은 압축이 쉬워 자주 쓰인다.", answer: false, explain: "rarely done: hard to compress." },

  // accumulators
  { kind: "short", id: "ir-q-ac-1", concept: "accumulators", q: "Brutus(1, 7, 83, 87), Caesar(1, 5, 13, 17)일 때 [Brutus Caesar]에 필요한 누산기 수는?", answers: ["7"], hint: "숫자만", explain: "합집합 1, 5, 7, 13, 17, 83, 87." },
  { kind: "short", id: "ir-q-ac-2", concept: "accumulators", q: "같은 예에서 연언 검색을 강제하면 누산기는 몇 개인가?", answers: ["1"], hint: "숫자만", explain: "d1만 두 단어를 모두 포함." },
  { kind: "mc", id: "ir-q-ac-3", concept: "accumulators", q: "웹에서 누산기를 만드는 문서는?", options: ["모든 문서", "포스팅 리스트에 나오는 문서만", "PageRank 상위 문서만", "제목에 질의어가 있는 문서만"], answer: 1, explain: "점수 0 문서엔 만들지 않음." },
  { kind: "ox", id: "ir-q-ac-4", concept: "accumulators", q: "200억 문서의 웹에서도 누산기 배열 전체를 메모리에 두는 것은 문제없다.", answer: false, explain: "infeasible." },
  { kind: "ox", id: "ir-q-ac-5", concept: "accumulators", q: "대부분의 응용에서 주어진 질의에 대해 거의 모든 문서의 유사도 점수는 0이다.", answer: true, explain: "그래서 속도를 높일 여지가 큼." },
];
