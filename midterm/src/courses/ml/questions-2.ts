import type { Question } from "@/lib/types";

/* regrec · clsm · ens · regt */
export const QUESTIONS_2: Question[] = [
  // regression
  { kind: "mc", id: "ml-q-rg-1", concept: "regression", q: "회귀 분석에서 출력 데이터의 유형은?", options: ["범주", "실수", "부류 번호", "순서 없는 문자열"], answer: 1, explain: "분류는 범주, 회귀는 실수." },
  { kind: "mc", id: "ml-q-rg-2", concept: "regression", q: "회귀에서 '오차'의 의미는?", options: ["예측값과 실제값의 차이", "모델의 학습 속도", "모델 파라미터의 수", "데이터의 개수"], answer: 0, explain: "오차(손실) = 예측 − 실제." },
  { kind: "short", id: "ml-q-rg-3", concept: "regression", q: "실제값 [2, 4, 6, 8], 예측값 [3, 4, 5, 10]일 때 MSE는?", answers: ["1.5", "3/2"], explain: "오차 1, 0, −1, 2 → 제곱 1, 0, 1, 4 → 합 6 / 4 = 1.5.", hint: "소수" },
  { kind: "short", id: "ml-q-rg-4", concept: "regression", q: "위 문제(실제 [2,4,6,8], 예측 [3,4,5,10])의 MAE는?", answers: ["1"], explain: "|1|+0+|−1|+|2| = 4, 4/4 = 1.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-rg-5", concept: "regression", q: "회귀에서 과적합을 줄이려고 목적함수에 모델 복잡도를 벌점 항으로 더할 수 있다.", answer: true, explain: "오차의 합 + (가중치)·(모델 복잡도)." },
  { kind: "ox", id: "ml-q-rg-6", concept: "regression", q: "회귀에서 부적합은 지나치게 복잡한 함수를 학습한 상태다.", answer: false, explain: "부적합 = 지나치게 단순, 과적합 = 지나치게 복잡." },

  // gradient-descent
  { kind: "mc", id: "ml-q-gd-1", concept: "gradient-descent", q: "경사 하강법의 목적은?", options: ["모델 출력을 최대화", "손실 함수의 최솟값(최적 파라미터)을 찾기", "학습률을 늘리기", "데이터 분산을 늘리기"], answer: 1, explain: "그레디언트 반대 방향으로 이동." },
  { kind: "short", id: "ml-q-gd-2", concept: "gradient-descent", q: "학습률 0.01, 현재 가중치 0.5, 그레디언트 0.3일 때 한 번 갱신한 가중치는?", answers: ["0.497"], explain: "0.5 − 0.01×0.3 = 0.497.", hint: "소수" },
  { kind: "ox", id: "ml-q-gd-3", concept: "gradient-descent", q: "경사 하강법은 그레디언트와 같은 방향으로 파라미터를 움직인다.", answer: false, explain: "그레디언트는 함수 값이 증가하는 방향 → 반대로 움직인다." },
  { kind: "mc", id: "ml-q-gd-4", concept: "gradient-descent", q: "f(x) = ax + b를 학습할 때 오차 함수 E의 그레디언트는?", options: ["(∂E/∂x)", "(∂E/∂a, ∂E/∂b)", "(a, b)", "(E, x)"], answer: 1, explain: "파라미터 각각으로 편미분한 벡터." },

  // bias-variance
  { kind: "mc", id: "ml-q-bv-1", concept: "bias-variance", q: "높은 편향(bias)이 주로 일으키는 문제는?", options: ["과적합", "부적합", "데이터 불균형", "기울기 소멸"], answer: 1, explain: "모델 형태를 잘못(너무 단순하게) 가정." },
  { kind: "mc", id: "ml-q-bv-2", concept: "bias-variance", q: "모델 복잡도가 커질 때 일반적인 변화는?", options: ["편향↑ 분산↑", "편향↓ 분산↑", "편향↑ 분산↓", "편향↓ 분산↓"], answer: 1, explain: "복잡할수록 편향은 줄고 분산은 는다." },
  { kind: "ox", id: "ml-q-bv-3", concept: "bias-variance", q: "단순한 모델은 일반적으로 편향이 낮고 분산이 크다.", answer: false, explain: "단순한 모델은 높은 편향·낮은 분산." },
  { kind: "mc", id: "ml-q-bv-4", concept: "bias-variance", q: "편향-분산 분해에서 MSE를 이루는 세 항은?", options: ["bias + variance + 학습률", "bias² + variance + 잡음", "bias × variance", "variance² + 잡음"], answer: 1, explain: "MSE = bias² + variance + σ²." },
  { kind: "ox", id: "ml-q-bv-5", concept: "bias-variance", q: "분산은 데이터의 작은 변동 때문에 생기는 오차로, 크면 잡음까지 학습하는 과적합이 된다.", answer: true, explain: "학습된 모델들의 예측값끼리의 차이." },

  // recommendation
  { kind: "mc", id: "ml-q-rc-1", concept: "recommendation", q: "추천 데이터 행렬의 특징은?", options: ["대부분 채워진 밀집 행렬", "많은 원소가 비어 있는 희소 행렬", "항상 대칭 행렬", "단위 행렬"], answer: 1, explain: "빈 곳을 채우는 것이 추천." },
  { kind: "mc", id: "ml-q-rc-2", concept: "recommendation", q: "내용 기반 추천에서 영화의 장르·배우 같은 특징 정보를 무엇이라 하는가?", options: ["사용자 프로파일", "항목 프로파일", "희소 행렬", "은닉 요소"], answer: 1, explain: "항목 프로파일 ↔ 사용자 프로파일." },
  { kind: "ox", id: "ml-q-rc-3", concept: "recommendation", q: "내용 기반 추천은 다른 사용자들의 평가를 이용해 추천한다.", answer: false, explain: "그건 협력 필터링. 내용 기반은 사용자가 좋아했던 것과 비슷한 내용의 대상을 추천." },

  // collaborative
  { kind: "mc", id: "ml-q-co-1", concept: "collaborative", q: "사용자간 협력 필터링에서 사용자 유사도로 흔히 쓰는 것은?", options: ["엔트로피", "코사인 유사도", "지니 지수", "R²"], answer: 1, explain: "비슷한 사용자 집합의 평가 (가중)평균으로 채운다." },
  { kind: "mc", id: "ml-q-co-2", concept: "collaborative", q: "추천 행렬을 두 행렬의 곱으로 분해해 빈 원소를 채우는 방법은?", options: ["내용 기반 추천", "은닉 요소 모델(행렬 분해)", "kNN 회귀", "결정트리"], answer: 1, explain: "Latent factor model." },
  { kind: "mc", id: "ml-q-co-3", concept: "collaborative", q: "ALS 목적함수 오차 + λ(‖p‖² + ‖q‖²)에서 λ의 역할은?", options: ["학습률", "규제의 강도", "은닉 요소 수", "반복 횟수"], answer: 1, explain: "λ가 클수록 P, Q 값이 작아지도록 규제." },
  { kind: "ox", id: "ml-q-co-4", concept: "collaborative", q: "ALS(Alternating Least Squares)는 P와 Q를 번갈아 고정하며 최적화한다.", answer: true, explain: "한쪽을 고정하면 최소제곱 문제가 된다." },
  { kind: "mc", id: "ml-q-co-5", concept: "collaborative", q: "사용자 인코더와 항목 인코더를 분리하고 근사 최근접 이웃(ANN) 검색과 함께 쓰는 딥러닝 추천 구조는?", options: ["NCF", "Two-Tower", "LightGCN", "SASRec"], answer: 1, explain: "Two-Tower 모델." },

  // knn
  { kind: "mc", id: "ml-q-kn-1", concept: "knn", q: "kNN 알고리즘의 특징으로 옳은 것은?", options: ["학습 단계에서 복잡한 모델을 만든다", "예측 시점에 가까운 이웃을 찾아 계산하는 게으른 학습이다", "모수적 방법이다", "데이터를 저장하지 않는다"], answer: 1, explain: "Lazy learning, 사례 기반, 비모수적." },
  { kind: "mc", id: "ml-q-kn-2", concept: "knn", q: "kNN 분류에서 새 데이터의 부류를 정하는 방법은?", options: ["가장 먼 k개의 평균", "가장 가까운 k개의 다수결 투표", "전체 데이터의 평균", "무작위 선택"], answer: 1, explain: "회귀는 평균(또는 거리 가중 평균)." },
  { kind: "ox", id: "ml-q-kn-3", concept: "knn", q: "kNN에서 k를 너무 작게 잡으면 잡음에 민감해 과적합되기 쉽다.", answer: true, explain: "k=1이면 가장 가까운 한 점에 휘둘린다." },
  { kind: "mc", id: "ml-q-kn-4", concept: "knn", q: "kNN의 이웃 탐색을 빠르게 하는 색인 구조가 아닌 것은?", options: ["k-d 트리", "ball tree", "HNSW", "AdaBoost"], answer: 3, explain: "AdaBoost는 앙상블 기법." },
  { kind: "ox", id: "ml-q-kn-5", concept: "knn", q: "kNN은 학습 데이터가 커져도 메모리와 예측 시간 부담이 늘지 않는다.", answer: false, explain: "모든 데이터를 저장하고 예측 때 거리를 계산하므로 부담이 커진다." },

  // distance
  { kind: "short", id: "ml-q-di-1", concept: "distance", q: "벡터 [3, 4]의 L2 노름은?", answers: ["5"], explain: "√(9+16) = 5.", hint: "숫자만" },
  { kind: "short", id: "ml-q-di-2", concept: "distance", q: "점 (1, 2)와 (4, 6) 사이의 맨해튼 거리는?", answers: ["7"], explain: "|4−1| + |6−2| = 3 + 4 = 7.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-di-3", concept: "distance", q: "민코프스키 거리에서 p = 2일 때와 같은 것은?", options: ["맨해튼 거리", "유클리드 거리", "무한대 노름", "해밍 거리"], answer: 1, explain: "p=1 맨해튼, p=2 유클리드." },
  { kind: "mc", id: "ml-q-di-4", concept: "distance", q: "범주형 속성 데이터의 '다른 자리 수'로 거리를 재는 것은?", options: ["마할라노비스 거리", "해밍 거리", "코사인 거리", "유클리드 거리"], answer: 1, explain: "혼합형은 Gower 거리." },
  { kind: "mc", id: "ml-q-di-5", concept: "distance", q: "공분산 행렬의 역행렬을 반영하는 거리는?", options: ["마할라노비스 거리", "맨해튼 거리", "해밍 거리", "무한대 노름"], answer: 0, explain: "변수 간 상관과 척도를 고려." },
  { kind: "short", id: "ml-q-di-6", concept: "distance", q: "점 (1, 2)와 (4, 6) 사이의 무한대 노름 거리는?", answers: ["4"], explain: "max(|3|, |4|) = 4.", hint: "숫자만" },

  // naive-bayes
  { kind: "mc", id: "ml-q-nb-1", concept: "naive-bayes", q: "단순 베이즈 분류기의 핵심 가정은?", options: ["특징들이 서로 상관관계가 강하다", "부류가 주어지면 특징들이 서로 조건부 독립이다", "모든 부류의 사전확률이 같다", "특징이 모두 연속값이다"], answer: 1, explain: "p(x|y) = Πⱼ p(xⱼ|y)." },
  { kind: "mc", id: "ml-q-nb-2", concept: "naive-bayes", q: "훈련 데이터에 없던 값 때문에 확률이 0이 되는 문제를 막는 방법은?", options: ["드롭아웃", "라플라스 평활화", "배치 정규화", "가지치기"], answer: 1, explain: "(count + α)/(N_c + αV)." },
  { kind: "ox", id: "ml-q-nb-3", concept: "naive-bayes", q: "단순 베이즈는 반복 최적화 없이 빈도·평균·분산만 계산하므로 학습이 매우 빠르다.", answer: true, explain: "특징이 많은 문제의 기준선으로 쓴다." },
  { kind: "ox", id: "ml-q-nb-4", concept: "naive-bayes", q: "단순 베이즈의 독립 가정은 현실 데이터(예: 문서 속 단어)에서 대부분 정확히 성립한다.", answer: false, explain: "잘 안 맞지만 의외로 성능이 좋다." },

  // gen-disc-lda
  { kind: "mc", id: "ml-q-gl-1", concept: "gen-disc-lda", q: "판별 모델(discriminative model)이 직접 학습하는 것은?", options: ["결합확률 p(x, y)", "조건부 확률 p(y|x)나 결정 경계", "p(x)만", "사전확률 p(y)만"], answer: 1, explain: "생성 모델은 p(x, y)를 학습." },
  { kind: "mc", id: "ml-q-gl-2", concept: "gen-disc-lda", q: "다음 중 판별 모델은?", options: ["단순 베이즈", "LDA", "로지스틱 회귀", "가우시안 혼합 모델"], answer: 2, explain: "단순 베이즈·LDA는 생성 모델." },
  { kind: "ox", id: "ml-q-gl-3", concept: "gen-disc-lda", q: "LDA는 모든 부류가 같은 공분산 행렬을 공유한다고 가정하며, 결정 함수가 선형이 된다.", answer: true, explain: "wᵀx + b 꼴." },

  // decision-tree
  { kind: "mc", id: "ml-q-dt-1", concept: "decision-tree", q: "결정트리에서 단말 노드가 나타내는 것은?", options: ["비교 속성", "속성 값", "부류(또는 대표값)", "정보이득"], answer: 2, explain: "내부 노드: 비교 속성, 간선: 속성 값, 단말: 부류." },
  { kind: "mc", id: "ml-q-dt-2", concept: "decision-tree", q: "ID3를 개선해 수치형 속성도 다룰 수 있게 한 알고리즘은?", options: ["CART", "C4.5", "k-means", "DBSCAN"], answer: 1, explain: "ID3 → C4.5 → C5.0." },
  { kind: "ox", id: "ml-q-dt-3", concept: "decision-tree", q: "결정트리는 해석이 쉽고 범주형·연속형 데이터를 모두 다룰 수 있다.", answer: true, explain: "IF-THEN 규칙으로 읽힌다." },
  { kind: "ox", id: "ml-q-dt-4", concept: "decision-tree", q: "결정트리의 분할 속성은 결과 집단이 최대한 섞이도록(이질적이도록) 고른다.", answer: false, explain: "동질적(pure)인 집단이 되게 고른다." },

  // entropy-ig
  { kind: "short", id: "ml-q-en-1", concept: "entropy-ig", q: "부류 비율이 70% / 30%인 집합의 엔트로피는? (소수 셋째 자리)", answers: ["0.881", "0.88"], explain: "−0.7·log₂0.7 − 0.3·log₂0.3 ≈ 0.360 + 0.521 = 0.881.", hint: "소수" },
  { kind: "short", id: "ml-q-en-2", concept: "entropy-ig", q: "부류 2개가 정확히 반반인 집합의 엔트로피는?", answers: ["1"], explain: "−0.5·log₂0.5 × 2 = 1 (최대).", hint: "숫자만" },
  { kind: "short", id: "ml-q-en-3", concept: "entropy-ig", q: "루트 엔트로피 1.0, 같은 크기의 두 자식 엔트로피가 0과 0.918일 때 정보이득은? (소수 셋째 자리)", answers: ["0.541"], explain: "1.0 − (0.5·0 + 0.5·0.918) = 0.541.", hint: "소수" },
  { kind: "mc", id: "ml-q-en-4", concept: "entropy-ig", q: "정보이득의 단점은?", options: ["계산할 수 없다", "속성값이 많은 속성(학번 등)을 선호한다", "수치형에만 쓴다", "항상 0이다"], answer: 1, explain: "→ 정보이득비로 보정." },
  { kind: "ox", id: "ml-q-en-5", concept: "entropy-ig", q: "엔트로피가 큰 집합일수록 한 부류에 속하는 경향이 크다.", answer: false, explain: "엔트로피가 작을수록 순수(한 부류)하다." },
  { kind: "mc", id: "ml-q-en-6", concept: "entropy-ig", q: "결정트리의 분할 속성으로 가장 좋은 것은?", options: ["정보이득이 가장 작은 속성", "정보이득이 가장 큰 속성", "속성값이 가장 많은 속성", "엔트로피가 가장 큰 속성"], answer: 1, explain: "IG = I − I_res가 클수록 좋은 분할." },

  // gini
  { kind: "short", id: "ml-q-gi-1", concept: "gini", q: "부류 A·B·C 비율이 0.3·0.4·0.3인 노드의 지니 값은?", answers: ["0.66"], explain: "1 − (0.09 + 0.16 + 0.09) = 0.66.", hint: "소수" },
  { kind: "mc", id: "ml-q-gi-2", concept: "gini", q: "지니 지수에 대한 설명으로 옳은 것은?", options: ["한 부류만 있으면 1", "노드의 불순도를 측정한다", "속성 값의 개수", "트리의 깊이"], answer: 1, explain: "G = 1 − Σp², 순수하면 0." },
  { kind: "ox", id: "ml-q-gi-3", concept: "gini", q: "CART 알고리즘은 분할 기준으로 지니 지수를 쓴다.", answer: true, explain: "CART는 지니 지수, ID3는 정보이득, C4.5는 정보이득비." },
  { kind: "short", id: "ml-q-gi-4", concept: "gini", q: "두 부류가 반반인 노드의 지니 값은?", answers: ["0.5", "1/2"], explain: "1 − (0.25 + 0.25) = 0.5.", hint: "소수" },

  // pruning
  { kind: "mc", id: "ml-q-pr-1", concept: "pruning", q: "결정트리 가지치기의 주된 목적은?", options: ["트리를 더 깊게", "과적합 방지", "학습 데이터 정확도 극대화", "속성 수 증가"], answer: 1, explain: "트리를 단순하게." },
  { kind: "mc", id: "ml-q-pr-2", concept: "pruning", q: "트리를 완전히 키운 뒤 검증 성능에 영향이 적은 노드를 제거하는 방법은?", options: ["사전 가지치기", "사후 가지치기", "조기 종료", "배깅"], answer: 1, explain: "Post-pruning(비용 복잡도 가지치기)." },
  { kind: "ox", id: "ml-q-pr-3", concept: "pruning", q: "최대 깊이·노드의 최소 데이터 수를 제한하는 것은 사후 가지치기다.", answer: false, explain: "다 자라기 전에 멈추는 사전 가지치기(조기 중단)." },
  { kind: "ox", id: "ml-q-pr-4", concept: "pruning", q: "사전 가지치기는 너무 일찍 멈추면 중요한 패턴을 놓칠 수 있다.", answer: true, explain: "그래서 깊이 제한 같은 값을 적절히 정해야 한다." },

  // tree-regression
  { kind: "mc", id: "ml-q-tr-1", concept: "tree-regression", q: "회귀용 결정트리의 단말 노드 값은?", options: ["부류 이름", "해당 데이터들의 대표값(평균)", "정보이득", "엔트로피"], answer: 1, explain: "출력이 수치값." },
  { kind: "mc", id: "ml-q-tr-2", concept: "tree-regression", q: "회귀용 결정트리의 분할 속성 선택 기준은?", options: ["정보이득 최대", "표준편차 축소(SDR) 최대", "지니 지수 최대", "엔트로피 최대"], answer: 1, explain: "SDR(A) = SD − SD(A)." },
  { kind: "ox", id: "ml-q-tr-3", concept: "tree-regression", q: "회귀용 결정트리의 단말 노드는 분류 트리처럼 부류 값을 갖는다.", answer: false, explain: "수치값(평균)을 갖는다." },

  // logistic
  { kind: "mc", id: "ml-q-lg-1", concept: "logistic", q: "로지스틱 회귀의 출력은?", options: ["임의의 실수", "특정 부류일 확률(0~1)", "부류 개수", "거리"], answer: 1, explain: "시그모이드 1/(1+e^(−θᵀx))." },
  { kind: "short", id: "ml-q-lg-2", concept: "logistic", q: "확률 0.8인 사건의 오즈(odds)는?", answers: ["4"], explain: "0.8/0.2 = 4.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-lg-3", concept: "logistic", q: "로지스틱 회귀의 학습 방법으로 옳은 것은?", options: ["최대가능도 추정 — 음의 로그 가능도(교차 엔트로피)를 경사 하강법으로 최소화", "정보이득 최대화", "k-means 반복", "지니 지수 최소화"], answer: 0, explain: "가능도 Π f(xᵢ)^yᵢ(1−f(xᵢ))^(1−yᵢ)를 최대로 = 음의 로그 가능도를 최소로." },
  { kind: "ox", id: "ml-q-lg-4", concept: "logistic", q: "로지스틱 회귀에서 계수 θᵢ > 0이면 xᵢ가 커질수록 출력이 1일 확률이 커진다.", answer: true, explain: "θᵢ < 0이면 0일 확률이 커진다." },
  { kind: "mc", id: "ml-q-lg-5", concept: "logistic", q: "ln(p/(1−p)) = θᵀx에서 좌변의 이름은?", options: ["엔트로피", "log odds(로짓)", "지니", "R²"], answer: 1, explain: "오즈 p/(1−p)에 로그를 씌운 log odds가 선형식 θᵀx와 같다." },
  { kind: "ox", id: "ml-q-lg-6", concept: "logistic", q: "로지스틱 회귀는 이름에 '회귀'가 있으므로 연속값을 예측하는 회귀 모델이다.", answer: false, explain: "이진 분류에 쓴다." },

  // ensemble
  { kind: "mc", id: "ml-q-es-1", concept: "ensemble", q: "앙상블 학습의 목적이 아닌 것은?", options: ["분산 감소", "편향 감소", "예측 정확도 향상", "실행 시간 단축"], answer: 3, explain: "여러 모델을 쓰니 시간은 오히려 는다." },
  { kind: "mc", id: "ml-q-es-2", concept: "ensemble", q: "붓스트랩(bootstrap)이란?", options: ["비복원추출로 데이터 나누기", "복원추출로 여러 학습 데이터 집합 만들기", "가중치 초기화", "특징 선택"], answer: 1, explain: "같은 데이터가 여러 번 뽑힐 수 있다 — 배깅의 바탕." },
  { kind: "short", id: "ml-q-es-3", concept: "ensemble", q: "독립인 세 모델의 정확도가 0.7, 0.65, 0.8일 때 다수결 앙상블의 정확도는? (소수 셋째 자리)", answers: ["0.807"], explain: "셋 다 0.364 + 두 개만 0.091 + 0.196 + 0.156 = 0.807.", hint: "소수" },
  { kind: "ox", id: "ml-q-es-4", concept: "ensemble", q: "앙상블의 개별 모델은 서로 비슷하고 의존적일수록 좋다.", answer: false, explain: "독립적·다양할수록 좋다." },

  // bagging-rf
  { kind: "mc", id: "ml-q-bg-1", concept: "bagging-rf", q: "배깅에서 회귀 문제의 최종 예측 방법은?", options: ["투표", "평균", "최댓값", "가중 투표만"], answer: 1, explain: "분류는 투표, 회귀는 평균." },
  { kind: "mc", id: "ml-q-bg-2", concept: "bagging-rf", q: "랜덤 포리스트에서 'Random'이 가리키는 것으로 옳은 것은?", options: ["트리 깊이를 무작위로", "각 노드에서 무작위로 고른 일부 속성 중 분할 속성 선택", "부류를 무작위로 배정", "학습률을 무작위로"], answer: 1, explain: "붓스트랩 + 속성 무작위 선택." },
  { kind: "ox", id: "ml-q-bg-3", concept: "bagging-rf", q: "랜덤 포리스트는 각 노드에서 모든 특성을 고려해 최적의 분할을 고른다.", answer: false, explain: "무작위로 고른 일부 특성 중에서만." },
  { kind: "ox", id: "ml-q-bg-4", concept: "bagging-rf", q: "배깅의 모델들은 병렬로, 부스팅의 모델들은 순차적으로 학습된다.", answer: true, explain: "배깅 모델은 서로 독립, 부스팅은 앞 모델의 오차에 의존." },

  // stacking
  { kind: "mc", id: "ml-q-st-1", concept: "stacking", q: "스태킹의 메타 학습기가 입력으로 받는 것은?", options: ["원본 데이터만", "기반 모델들의 예측 결과", "학습률", "트리 깊이"], answer: 1, explain: "Stacked generalization." },
  { kind: "ox", id: "ml-q-st-2", concept: "stacking", q: "스태킹의 메타 학습기는 반드시 선형 회귀여야 한다.", answer: false, explain: "어떤 유형의 모델이든 쓸 수 있다." },
  { kind: "mc", id: "ml-q-st-3", concept: "stacking", q: "스태킹 사용 시 흔한 실수는?", options: ["다양한 기반 모델 사용", "기반 모델이 모두 같은 유형", "메타 학습기 사용", "교차검증 사용"], answer: 1, explain: "다양성이 사라진다." },

  // boosting-adaboost
  { kind: "short", id: "ml-q-ab-1", concept: "boosting-adaboost", q: "AdaBoost에서 학습 오류 ε = 0.3인 분류기의 신뢰도 α는? (소수 셋째 자리)", answers: ["0.424", "0.42"], explain: "0.5·ln(0.7/0.3) ≈ 0.424.", hint: "소수" },
  { kind: "mc", id: "ml-q-ab-2", concept: "boosting-adaboost", q: "AdaBoost에서 잘못 분류된 데이터의 가중치는?", options: ["줄인다", "늘린다", "그대로", "0으로"], answer: 1, explain: "wᵢ·e^α — 다음 분류기가 잘 맞히도록." },
  { kind: "mc", id: "ml-q-ab-3", concept: "boosting-adaboost", q: "AdaBoost에서 사용하는 분류기의 학습 오류 조건은?", options: ["ε > 0.5", "ε < 0.5", "ε = 1", "ε = 0만"], answer: 1, explain: "무작위 추측보다 나아야 한다." },
  { kind: "ox", id: "ml-q-ab-4", concept: "boosting-adaboost", q: "부스팅에서 각 모델은 서로 독립적으로 학습된다.", answer: false, explain: "앞 모델의 오차에 따라 순차적으로." },
  { kind: "short", id: "ml-q-ab-5", concept: "boosting-adaboost", q: "AdaBoost에서 데이터가 N개일 때 초기 가중치들의 합은?", answers: ["1"], explain: "wᵢ = 1/N.", hint: "숫자만" },

  // gradient-boosting
  { kind: "mc", id: "ml-q-gb-1", concept: "gradient-boosting", q: "그레디언트 부스팅의 '그레디언트'가 뜻하는 것은?", options: ["데이터 분포", "손실 함수의 기울기(오류의 방향과 크기)", "트리 개수", "학습 데이터 크기"], answer: 1, explain: "잔차를 보정하는 방향." },
  { kind: "mc", id: "ml-q-gb-2", concept: "gradient-boosting", q: "히스토그램 기반 분할과 단말 중심(leaf-wise) 분할을 쓰는 것은?", options: ["XGBoost", "LightGBM", "CatBoost", "AdaBoost"], answer: 1, explain: "Microsoft LightGBM." },
  { kind: "mc", id: "ml-q-gb-3", concept: "gradient-boosting", q: "범주형 속성을 전처리 없이 수치로 바꿔 쓰고 대칭형(oblivious) 트리를 쓰는 것은?", options: ["XGBoost", "LightGBM", "CatBoost", "랜덤 포리스트"], answer: 2, explain: "Yandex CatBoost." },
  { kind: "mc", id: "ml-q-gb-4", concept: "gradient-boosting", q: "CatBoost가 다루기 어려운 데이터 형식은?", options: ["텍스트", "범주형", "결손값", "이미지"], answer: 3, explain: "CatBoost는 범주형·텍스트·결손값·시계열을 지원한다. 이미지는 CNN 영역." },
  { kind: "ox", id: "ml-q-gb-5", concept: "gradient-boosting", q: "XGBoost는 결손값을 지원하고 병렬·분산 처리가 가능하다.", answer: true, explain: "규제화도 강화." },
  { kind: "ox", id: "ml-q-gb-6", concept: "gradient-boosting", q: "그레디언트 부스팅은 분류에만 쓸 수 있고 회귀에는 쓸 수 없다.", answer: false, explain: "분류·회귀 모두 가능." },

  // linear-regression
  { kind: "mc", id: "ml-q-lr-1", concept: "linear-regression", q: "선형 회귀에서 '선형'의 의미는?", options: ["입력 변수에 대해 선형", "학습 파라미터에 대해 선형", "출력이 정수", "그래프가 항상 직선"], answer: 1, explain: "그래서 x² 같은 변수를 넣어도 선형 회귀다." },
  { kind: "mc", id: "ml-q-lr-2", concept: "linear-regression", q: "결정계수 R²의 식은?", options: ["SSE/SST", "1 − SSE/SST", "SST/SSR", "1 − SSR/SST"], answer: 1, explain: "R² = SSR/SST = 1 − SSE/SST." },
  { kind: "short", id: "ml-q-lr-3", concept: "linear-regression", q: "SST = 200, SSE = 50일 때 R²는?", answers: ["0.75", "3/4"], explain: "1 − 50/200 = 0.75.", hint: "소수" },
  { kind: "ox", id: "ml-q-lr-4", concept: "linear-regression", q: "R²는 0~1 사이 값이고 1에 가까울수록 모델의 설명력이 크다.", answer: true, explain: "R² = 1 − SSE/SST." },
  { kind: "ox", id: "ml-q-lr-5", concept: "linear-regression", q: "선형 회귀에는 가능한 모든 변수를 넣을수록 항상 좋은 모델이 된다.", answer: false, explain: "적절한 변수 선택이 필요하다(공선성·과적합)." },

  // ridge-lasso-elastic
  { kind: "mc", id: "ml-q-rl-1", concept: "ridge-lasso-elastic", q: "라쏘(Lasso) 회귀가 쓰는 벌점은?", options: ["L1-노름", "L2-노름", "L1과 L2 모두", "벌점 없음"], answer: 0, explain: "릿지 L2, 일래스틱 넷 둘 다." },
  { kind: "mc", id: "ml-q-rl-2", concept: "ridge-lasso-elastic", q: "중요하지 않은 계수를 정확히 0으로 만들어 변수 선택 효과가 있는 것은?", options: ["릿지", "라쏘", "OLS", "SVR"], answer: 1, explain: "L1 벌점은 계수를 정확히 0으로 만든다. 릿지는 0에 가깝게만." },
  { kind: "ox", id: "ml-q-rl-3", concept: "ridge-lasso-elastic", q: "릿지 회귀가 라쏘보다 더 단순한(계수가 0인 항이 많은) 모델을 학습할 가능성이 높다.", answer: false, explain: "라쏘가 더 단순하다." },
  { kind: "mc", id: "ml-q-rl-4", concept: "ridge-lasso-elastic", q: "릿지·라쏘에서 벌점 강도 α를 너무 크게 하면?", options: ["과적합", "과소적합", "변화 없음", "학습 불가"], answer: 1, explain: "모델이 지나치게 단순해진다." },
  { kind: "ox", id: "ml-q-rl-5", concept: "ridge-lasso-elastic", q: "일래스틱 넷은 L1과 L2 벌점을 함께 쓴다.", answer: true, explain: "일래스틱 넷 = L1 + L2, 좌표하강법으로 학습." },

  // ransac
  { kind: "mc", id: "ml-q-rs-1", concept: "ransac", q: "RANSAC이 특히 유용한 데이터는?", options: ["이상치가 많은 데이터", "결손값이 없는 데이터", "범주형 데이터", "이미지 데이터"], answer: 0, explain: "정상치/이상치를 나눠 반복 회귀." },
  { kind: "mc", id: "ml-q-rs-2", concept: "ransac", q: "RANSAC에서 허용오차 안에 들어 정상치로 추가되는 데이터 집합은?", options: ["붓스트랩 표본", "합의 집합(consensus set)", "검증 집합", "서포트 벡터"], answer: 1, explain: "Consensus set — 허용오차(임계값) 안의 데이터." },
  { kind: "ox", id: "ml-q-rs-3", concept: "ransac", q: "RANSAC은 처음에 무작위로 고른 일부 데이터를 정상치로 보고 모델을 학습한다.", answer: true, explain: "그 뒤 나머지를 테스트해 합의 집합을 늘리고 재학습한다." },

  // isotonic-poly-svr
  { kind: "mc", id: "ml-q-is-1", concept: "isotonic-poly-svr", q: "이소토닉 회귀가 학습하는 함수의 특징은?", options: ["주기 함수", "단조(비감소 또는 비증가) 계단 함수", "2차 함수", "시그모이드"], answer: 1, explain: "순서가 중요하고 단조 관계가 예상되는 데이터에 쓴다." },
  { kind: "mc", id: "ml-q-is-2", concept: "isotonic-poly-svr", q: "SVR에서 ε의 의미는?", options: ["학습률", "오차 허용 범위 — 이 안의 오차는 벌점 없음", "트리 깊이", "정규화 강도"], answer: 1, explain: "ε-insensitive loss." },
  { kind: "ox", id: "ml-q-is-3", concept: "isotonic-poly-svr", q: "다항 회귀는 차수가 높을수록 과적합 위험이 커진다.", answer: true, explain: "적당한 차수(degree) 선택이 중요하다." },
  { kind: "ox", id: "ml-q-is-4", concept: "isotonic-poly-svr", q: "선형 회귀 방법으로는 어떻게 해도 비선형 형태의 함수를 학습할 수 없다.", answer: false, explain: "x², x³ 같은 변수를 추가하면(다항 회귀) 가능." },

  // collinearity
  { kind: "short", id: "ml-q-vf-1", concept: "collinearity", q: "Xᵢ를 나머지 독립변수로 회귀한 Rᵢ² = 0.9일 때 VIF는?", answers: ["10"], explain: "1/(1 − 0.9) = 10 → 제거 검토.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-vf-2", concept: "collinearity", q: "다중 공선성이 회귀 모델에 주는 영향은?", options: ["계수 추정이 불안정해진다", "학습이 항상 빨라진다", "R²가 항상 0이 된다", "영향 없다"], answer: 0, explain: "두 변수가 반대 부호로 기여하는 등 해석도 어려워진다 → VIF로 확인해 제거." },
  { kind: "ox", id: "ml-q-vf-3", concept: "collinearity", q: "VIF가 1이면 공선성이 매우 높다는 뜻이다.", answer: false, explain: "1은 공선성 없음, 보통 10 이상이면 제거." },
];
