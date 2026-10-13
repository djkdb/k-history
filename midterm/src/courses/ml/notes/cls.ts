import type { NoteSection } from "@/lib/types";

/** ML-2 분류 (Classification) */
export const CLS: NoteSection[] = [
  {
    title: "학습 내용 · 지도학습",
    lines: [
      "분류 문제의 특성 / 과적합과 부적합 / 성능 평가 방법 / 불균형 부류 데이터 문제와 해결 / 이진 분류기의 성능 평가",
      "**지도학습**: 주어진 (입력, 출력) 데이터 = **학습(training) 데이터** (x1, y1), (x2, y2), …, (xn, yn) → 새 입력의 결과를 정하는 방법 y = f(x)를 찾는 것",
      "· **분류**: 출력이 정해진 **부류(class, category) 중 하나** / **회귀**: 출력이 **연속인 영역(continuous domain)**의 값",
    ],
  },
  {
    title: "1. 분류",
    en: "Classification",
    lines: [
      "데이터들을 정해진 몇 개의 부류로 대응시키는 문제 — 부류 영역을 나누는 선 = **결정 경계(decision boundary)**",
      "분류 문제의 학습: 학습 데이터를 잘 분류하는 **함수**를 찾는 것 — 함수의 형태는 **수학적 함수**일 수도, **규칙**일 수도 있다",
      "**분류기(classifier)**: 학습된 함수를 이용해 데이터를 분류하는 프로그램",
      "예 — **범주형 속성**: PlayTennis 데이터 → 결정트리 / **수치형 속성**: **iris 데이터** — **피셔 경(Sir Ronald Fisher)** 수집, **3종 붓꽃, 4개 속성**(sepal length·width, petal length·width), 150개 → 결정트리(X[3] <= 0.8 에서 entropy 1.585, samples 150, value [50, 50, 50] …)",
      "[실습] 결정트리: DecisionTreeClassifier(criterion=\"entropy\", random_state=0, max_depth=3).fit(iris.data, iris.target), plot_tree",
    ],
  },
  {
    title: "분류 알고리즘",
    lines: [
      "결정트리 / 로지스틱 회귀 / K-근접이웃(KNN) / 서포트 벡터 머신(SVM) / 앙상블(AdaBoost, 랜덤 포리스트, Gradient Boosting, XGBoost, LightBoost, CatBoost) / 확률 그래프 모델 / 다층 퍼셉트론 신경망 / 딥러닝 신경망 …",
    ],
  },
  {
    title: "분류와 데이터",
    lines: [
      "**이상적인 분류기**: 학습에 사용되지 않은 데이터를 잘 분류 = **일반화(generalization) 능력**이 좋은 것",
      "**훈련 데이터**: 분류기 학습에 사용 — 많을수록 유리",
      "**테스트 데이터**: 학습된 모델의 성능 평가 — **학습에 사용되지 않은** 데이터",
      "**검증 데이터**: 학습 과정에서 **학습을 중단할 시점**을 결정",
    ],
  },
  {
    title: "과적합과 부적합",
    en: "Overfitting and Underfitting",
    lines: [
      "**과적합**: 학습 데이터에 대해 **지나치게 잘** 학습된 상태 — 데이터는 오류·잡음을 포함할 개연성이 커서, 학습 데이터 성능이 매우 높아도 학습되지 않은 데이터에서 성능이 나쁠 수 있다",
      "**부적합**: 학습 데이터를 **충분히 학습하지 않은** 상태 — 그림: 부적합 / 정적합(good fitting) / 과적합",
      "학습 데이터 성능은 학습을 진행할수록 오류가 개선되지만, 지나치면 과적합",
      "**조기 종료(early stopping)**: 학습 중 검증 데이터 성능을 평가해, **검증 데이터 오류가 감소하다가 증가하는 시점**에 학습 중단",
      "과적합 회피: 검증 데이터·조기 종료, **학습 데이터 규모 확대**, **모델 복잡도 축소**(단순한 모델), **규제화**(Ridge, Lasso), 알고리즘별 기법(신경망 **dropout**)",
      "부적합 회피: **모델 복잡도 증가**(더 복잡한 모델), **사용할 특징 개수 확대**, 특징 선택·특징 추출, **학습 데이터 품질 개선**(잡음 제거), **학습 횟수(epoch) 증가**",
      "· **특징 선택**: 데이터에 있는 특징들 중에서 선택 / **특징 추출**: 특징들을 결합해 **새로운 특징** 생성",
    ],
  },
  {
    title: "분류기의 성능 평가 — 정확도 · 교차검증",
    lines: [
      "**정확도(accuracy)** = 옳게 분류한 데이터 개수 / 전체 데이터 개수 — **테스트 데이터**에 대한 정확도를 분류기의 정확도로",
      "정확도 높은 분류기를 얻으려면 학습 데이터가 많을수록 유리, **학습 데이터와 테스트 데이터는 겹치지 않게**",
      "데이터가 부족할 때: 별도 테스트 데이터 확보는 비효율 → 많은 데이터를 학습에 쓰면서 평가하는 방법 = **K-겹 교차검증(k-fold cross-validation)**: 전체를 **k 등분**, 각 등분을 **한 번씩 테스트 데이터**로 써서 평가하고 **평균** 선택",
      "**Leave-One-Out(LOO)**: **k = n**(데이터 개수) — n−1개로 훈련, 1개로 테스트",
      "[실습] Cross Validation: make_classification(n_samples=100, n_features=20, n_informative=15, n_redundant=5), LogisticRegression, LeaveOneOut으로 이상적 정확도(ideal 0.840)를 구하고 KFold(k=2~19)의 평균·최소·최대를 비교 — k가 클수록 평균이 ideal에 가까워지지만 분산(최소~최대 범위)이 커진다",
    ],
  },
  {
    title: "불균형 부류 데이터 문제",
    en: "Imbalanced class data",
    lines: [
      "특정 부류의 학습 데이터가 다른 부류보다 **지나치게 많은** 경우 — **정확도에 의한 평가는 무의미**할 수 있다: A 부류가 99%면 항상 A로 출력해도 정확도 99%",
      "대응: **가중치를 고려한 정확도 척도**(오분류 비용을 가중치로) / 많은 부류에서 **재표본추출(re-sampling)** / 적은 부류에 **인공적인 데이터 생성**",
      "**SMOTE**(Synthetic Minority Over-sampling Technique): 빈도가 낮은 부류의 학습 데이터를 인공적으로 만듦 — ① 낮은 빈도 부류의 데이터 x를 임의로 선택 ② x의 **k-근접이웃(같은 부류)** 선택 ③ 그중 무작위로 y 선택 ④ **x와 y를 잇는 직선 위 무작위 위치**에 새 데이터 z 생성",
      "확장: **Borderline-SMOTE** — 다른 부류와의 **경계(borderline)**에 있는 샘플을 늘려 분류하기 어려운 부분에 집중 / **ADASYN**(adaptive synthetic sampling) — Borderline과 비슷하지만 **소수 범주 데이터 주변의 다수 범주 데이터 수에 따라 유동적으로** 생성 (He et al., 2008)",
      "[실습] SMOTE: make_classification(n_samples=10000, weights=[0.99]) → Counter({0: 9900, 1: 100}) → SMOTE(sampling_strategy=0.1) → {0: 9900, 1: 990} (sampling_strategy = |소수|/|다수| after resampling)",
      "[실습] Undersampling: RandomUnderSampler(sampling_strategy=0.5) → {0: 200, 1: 100}",
    ],
  },
  {
    title: "이진 분류기의 성능 평가 — 혼동행렬",
    en: "Binary classifier, Confusion matrix",
    lines: [
      "**이진 분류기**: 두 개의 부류만을 갖는 데이터에 대한 분류기",
      "혼동행렬(실제 × 예측): **TP**(진양성) · **FN**(위음성, **type 2 error**) · **FP**(위양성, **type 1 error**) · **TN**(진음성)",
      "예: 실제 P → 예측 P 40, N 10 / 실제 N → 예측 P 15, N 35",
      "**민감도(sensitivity) = 재현율(recall) = 진양성율(TPR)** = TP / (TP + FN) — **양성의 정확도** → 40/(40+10) = **40/50**",
      "**특이도(specificity) = 진음성율(TNR)** = TN / (FP + TN) — **음성의 정확도** → 35/50",
      "**정밀도(precision)** = TP / (TP + FP) → 40/(40+15) = **40/55**",
      "**음성 예측도** = TN / (TN + FN) → 35/45 / **위양성율** = FP / (FP + TN) → 15/50 / **위발견율** = FP / (TP + FP) → 15/55",
      "**정확도** = (TP + TN) / 전체 → (40+35)/100 = **75/100**",
      "**F1 측도** = 2 × 정밀도 × 재현율 / (정밀도 + 재현율) — 정밀도와 재현율의 조화평균",
      "뉴스 예: 하천 쓰레기 AI 해결 보도 화면의 'metrics/precision' 그래프 — 정밀도가 실제로 쓰이는 지표임을 보여 줌",
      "[실습] 혼동행렬: y_true·y_pred(positive/negative 7개) → confusion_matrix [[1 2] [1 3]], accuracy 0.571 / y_pred=[0,5,2,4], y_true=[0,1,2,3] → accuracy 0.5",
    ],
  },
  {
    title: "ROC 곡선과 AUC",
    en: "Receiver Operating Characteristic, Area Under the Curve",
    lines: [
      "**ROC 곡선**: **부류판정 임계값(threshold)**에 따른 **(위양성율, 민감도)** 그래프 — x축 False Positive Rate = FP/(FP+TN), y축 True Positive Rate = TP/(TP+FN)",
      "임계값의 역할: 모델 출력값 **≥ 임계값 → 양성**, **< 임계값 → 음성**",
      "그림: 대각선 = **무작위 예측**, 왼쪽 위 (0,1) = **완벽한 분류**, 왼쪽 위로 갈수록 좋은 쪽(D, A), 오른쪽 아래로 갈수록 나쁜 쪽(C)",
      "로지스틱 회귀 예(출력이 [0,1]인 시그모이드, Positive = 소수 부류 '심장병 있음', Negative = 다수 부류): **임계값 0.5** → Sensitivity = 3/(3+1) = **0.75**, Specificity = 3/(3+1) = **0.75**",
      "· **임계값 0.1** → Sensitivity = 4/(4+0) = **1**, Specificity = 2/(2+2) = **0.5** (임계값을 낮추면 민감도↑ 특이도↓)",
      "· **임계값 0.9** → 표에서 TP 3, FN 1, FP 0, TN 4 → Sensitivity = 3/4 = **0.75**, Specificity = 4/4 = **1** (교안에는 빈칸)",
      "**AUC**: ROC 곡선 **아래 면적** — **클수록 바람직** (0~1, 1이면 완벽, 0.5면 무작위)",
      "[실습] AUC/ROC: roc_curve의 반환값 = false positive rates, true positive rates, thresholds / [실습] Multiclass ROC: **대상 클래스 vs 나머지 클래스**(one-vs-rest)",
    ],
  },
  {
    title: "Quiz (교안) — 정답과 풀이",
    lines: [
      "과적합을 피하는 방법으로 부적절 → ④ 모델 복잡도 증가",
      "정밀도의 의미 → ② 올바르게 예측된 양성 결과의 비율(양성이라 예측한 것 중 실제 양성)",
      "불균형 부류 해결 방법으로 부적절 → ④ 모든 클래스를 동일한 수로 학습",
      "K-겹 교차검증의 목적 → ③ 일반화 능력 평가",
      "로지스틱 회귀의 주 용도 → ② 이진 부류 분류",
      "이상적인 분류기 → ② 학습되지 않은 데이터를 잘 분류",
      "SMOTE의 목적 → ③ 불균형 부류 문제 해결",
      "AUC가 클수록 → ② 성능이 좋다",
      "KNN의 특징이 아닌 것 → ② 학습 단계에서 계산이 진행된다 (게으른 학습: 예측할 때 계산)",
      "ROC의 y축 → ③ TPR(재현율) / AUC 범위 → ③ 0~1 / AUC가 1에 가까우면 → ② 완벽",
      "계산: 50개를 양성 예측, 그중 40개 실제 양성, 실제 양성 60개 → 정밀도 40/50 = **0.8**, 재현율 40/60 ≈ **0.667**",
      "ROC (0,0)–(0.1,0.3)–(0.4,0.8)–(1,1)의 AUC → 사다리꼴 0.1×0.15 + 0.3×0.55 + 0.6×0.9 = **0.72**",
      "가중 정밀도: A(0.9, 50), B(0.6, 150) → (45 + 90)/200 = **0.675**",
      "F1: 정밀도 0.75, 재현율 0.6 → 0.9/1.35 ≈ **0.667**",
    ],
  },
];
