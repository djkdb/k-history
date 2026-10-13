import type { NoteSection } from "@/lib/types";

/** ML-6 앙상블 학습 */
export const ENS: NoteSection[] = [
  {
    title: "학습 내용",
    lines: [
      "앙상블 학습의 전략 / 배깅 기법으로 결정트리를 이용한 방법과 Random Forest / 부스팅 기법으로 AdaBoost, Gradient Boost, XGBoost, LightGBM, CatBoost",
    ],
  },
  {
    title: "1. 앙상블 학습",
    en: "Ensemble learning",
    lines: [
      "**대중의 지혜(wisdom of crowd)**: 무작위로 선택된 많은 사람의 답변을 모은 것이 **전문가의 답보다 낫다**",
      "**앙상블 학습**: **일련의 예측 모델(분류 또는 회귀 모델)**을 사용한 모델의 학습",
      "그림: 입력 → **서로 다른 예측 모델** 4개 → 각 모델의 예측 결과 1, 1, 2, 1 → **앙상블의 예측 결과 1**(다수결)",
      "**붓스트랩(bootstrap)**: 주어진 학습 데이터 집합에서 **복원추출(resampling with replacement)**하여 다수의 학습 데이터 집합을 만들어내는 기법",
      "앙상블 전략 3가지: **배깅(bagging, bootstrap aggregating)** / **부스팅(boosting)** / **스태킹(stacking)**",
    ],
  },
  {
    title: "2. 배깅 알고리즘",
    en: "Bagging = bootstrap aggregating",
    lines: [
      "**붓스트랩**을 통해 **여러 개의 학습 데이터 집합** 생성",
      "각 학습 데이터 집합별로 **분류기 또는 회귀모델** 생성 (서로 독립 → **병렬** 학습 가능)",
      "최종판정: 분류기들의 **투표나 가중치 투표** / 회귀 모델들의 **평균**",
      "그림: 학습 데이터 → 붓스트랩 → 학습 데이터 1·2·3 → 학습 알고리즘 → 분류기 1·2·3 → **결합 분류기** → 신규 데이터 예측",
      "[실습] iris 2개 특징(X[:, [0, 2]]) — DecisionTreeClassifier(max_depth=10) vs **BaggingClassifier(DecisionTreeClassifier(max_depth=4), n_estimators=50)** → 단일 트리는 경계가 들쭉날쭉(과적합 모양), **배깅은 경계가 더 매끄러움**",
    ],
    code: `model1 = DecisionTreeClassifier(max_depth=10, random_state=0).fit(X, y)
model2 = BaggingClassifier(DecisionTreeClassifier(max_depth=4),
                           n_estimators=50, random_state=0).fit(X, y)`,
  },
  {
    title: "랜덤 포리스트",
    en: "Random forest",
    lines: [
      "**분류기로 결정트리를 사용하는 배깅 기법**",
      "**Random(무작위)**: **무작위로 선택한 속성 중에서 분할 속성을 선택** (각 노드에서 일부 특징만 후보로 → 트리들이 서로 달라짐)",
      "**Forest(숲)**: **여러 결정트리**로 구성",
      "[실습] iris 150개 → train_test_split(test_size=0.3) → 학습 105개 / 테스트 45개 → **RandomForestClassifier(n_estimators=100)** → **Accuracy 1.0**",
    ],
    code: `forest = RandomForestClassifier(n_estimators=100)   # 모델 생성
forest.fit(x_train, y_train)
y_pred = forest.predict(x_test)                     # 추론(예측)
print('Accuracy :', metrics.accuracy_score(y_test, y_pred))`,
  },
  {
    title: "배깅에 의한 회귀",
    lines: [
      "붓스트랩을 통해 다수의 학습데이터 집합 생성 → 각 학습데이터별로 **회귀모델 생성** → 이들 회귀모델의 **평균값**으로 최종 회귀",
      "그림(Ozone vs Temperature): 회색 선 = 각 붓스트랩 모델, **빨간 선 = 평균**(더 안정적)",
      "[실습] Boston 집값 — train_test_split(test_size=0.2, random_state=123) → **BaggingRegressor(base_estimator=DecisionTreeRegressor(), n_estimators=10, max_features=1.0, bootstrap_features=False)** → **RMSE 4.555474**",
    ],
  },
  {
    title: "3. 스태킹",
    en: "Stacking, Stacked Generalization",
    lines: [
      "**여러 개의 다양한 기반 모델의 예측 결과를 입력**으로 하여, **메타 학습기(meta-learner)**라고 불리는 **새로운 모델을 학습**",
      "· 각 기반 모델은 **전체 데이터 중의 일부만 사용**하여 학습",
      "여러 개의 기본 모델의 예측을 결합하여 최종적인 예측 수행 — 그림: 학습 데이터 → **서로 다른 알고리즘을 사용한 기반 모델** 1…n → 예측값 → 메타 학습기",
      "[실습] iris(X = data[:, 1:3]) — 기반 모델 **KNN(n_neighbors=2), RandomForest(n_estimators=2), GaussianNB** → 세 예측 f1, f2, f3을 열로 묶어(np.transpose) **LogisticRegression**(메타 학습기)에 학습 → 각 정확도와 Stacking 정확도 출력",
    ],
    code: `clf1 = KNeighborsClassifier(n_neighbors=2)
clf2 = RandomForestClassifier(n_estimators=2, random_state=1)
clf3 = GaussianNB()
lr = LogisticRegression()          # 메타 학습기
clf1.fit(X, y); clf2.fit(X, y); clf3.fit(X, y)
f = np.transpose([clf1.predict(X), clf2.predict(X), clf3.predict(X)])
lr.fit(f, y)
final = lr.predict(f)`,
  },
  {
    title: "4. 부스팅 알고리즘",
    en: "Boosting",
    lines: [
      "**k개의 예측 모델을 순차적으로** 만들어 가는 앙상블 모델 생성",
      "**오차에 따라 학습 데이터에 가중치 또는 값을 변경**해가면서 예측 모델 생성",
      "그림: 학습데이터(동일 가중치) → 분류기 1 → 학습데이터 평가 → **오분류 데이터 가중치 확대** → 분류기 2 → … → 결합 분류기",
      "종류: **AdaBoost / Gradient Boosting / XGB**",
    ],
  },
  {
    title: "AdaBoost — 분류",
    lines: [
      "N개의 학습 데이터 di에 대한 초기 가중치 **wi = 1/N** → **가중치의 합 = 1**",
      "**학습 오류값 ε**: **잘못 분류한 학습데이터의 가중치의 합** — **학습 오류값이 0.5 미만인 분류기들만 사용**",
      "**분류기 신뢰도 α = 0.5·ln((1 − ε)/ε)** — ε가 작을수록 α가 큼",
      "**잘못 판정한** 학습 데이터의 가중치는 **증대: wi ← wi·e^α** / **제대로 판정한** 데이터는 **축소: wi ← wi·e^(−α)**",
      "→ 가중치의 합이 1이 되도록 **정규화**",
      "예: ε = 0.3 → α = 0.5·ln(0.7/0.3) = 0.5·ln 2.333 ≈ **0.424**",
      "[실습] iris, test_size=0.3 → **AdaBoostClassifier(n_estimators=50, learning_rate=1)** → **Accuracy 0.9333**",
    ],
    code: `abc = AdaBoostClassifier(n_estimators=50, learning_rate=1)   # 모델 생성
model = abc.fit(X_train, y_train)
y_pred = model.predict(X_test)                                 # 추론(예측)`,
  },
  {
    title: "AdaBoost — 회귀",
    lines: [
      "X = linspace(0, 6, 100), y = sin(X) + sin(6X) + 잡음 normal(0, 0.1)",
      "**DecisionTreeRegressor(max_depth=4)** (n_estimators=1, 초록) vs **AdaBoostRegressor(DecisionTreeRegressor(max_depth=4), n_estimators=100)** (빨강) → **부스팅 쪽이 구불구불한 곡선을 훨씬 잘 따라감**",
    ],
  },
  {
    title: "Gradient Boosting",
    lines: [
      "**여러 개의 약한 학습기(weak learners), 대개 결정트리**를 **연속적으로 학습하여 오류를 개선**해 나가는 방식",
      "· 앙상블에 **이전까지의 오차를 보정**하도록 약한 학습기 모델을 **순차적으로 추가**",
      "부스팅 방식: **이전 학습기가 만든 오류에 대해 새로운 학습기가 보완**",
      "**손실 함수의 그레디언트** 사용 학습: 오류의 **방향과 크기**를 계산하고 이를 통해 학습 방향 결정",
      "**학습률(learning rate)** 같은 파라미터와 **규제화(regularization)** 기법으로 **과적합 방지** / **분류와 회귀에 적용 가능**",
      "과정: 1. **초기 모델 설정**(단순한 초기 예측, 예: **데이터 평균**) → 2. **약한 학습기 추가**(손실 함수 그레디언트에 기반해 결정트리 학습, 이전 모든 학습기의 합성 오류를 보완) → 3. **학습기 가중치 업데이트**(학습률로 각 학습기의 기여도 조절) → 4. **최종 모델 구성**(모든 약한 학습기를 합함)",
      "보통 **100개 정도의 트리 앙상블**, **8~32개의 단말노드**를 갖는 트리 — 예측 = 평균 + 학습률×트리1 + 학습률×트리2 + …",
    ],
    table: {
      title: "몸무게 예측 예 (평균 71.2, 학습률 0.1)",
      headers: ["Height", "Color", "Gender", "Weight", "잔차1", "잔차2"],
      rows: [
        ["1.6", "Blue", "Male", "88", "16.8", "15.1"],
        ["1.6", "Green", "Female", "76", "4.8", "4.3"],
        ["1.5", "Blue", "Female", "56", "−15.2", "−13.7"],
        ["1.8", "Red", "Male", "73", "1.8", "1.4"],
        ["1.5", "Green", "Male", "77", "5.8", "5.4"],
        ["1.4", "Blue", "Female", "57", "−14.2", "−12.7"],
      ],
    },
  },
  {
    title: "Gradient Boosting 예제 풀이",
    lines: [
      "① 초기 예측 = Weight 평균 = (88 + 76 + 56 + 73 + 77 + 57)/6 ≈ **71.2**",
      "② 잔차1 = 실제 − 71.2 (88 → **16.8**, 56 → **−15.2** …)",
      "③ 잔차1을 맞추는 트리1 학습: Gender=F? → (예) Height<1.6? → **−14.7 / 4.8** · (아니오) Color not Blue? → **3.8 / 16.8**",
      "④ 새 예측 = 71.2 + **0.1** × 트리1 출력 → 첫 행: **잔차 = 88 − (71.2 + 0.1 × 16.8) = 15.1**",
      "⑤ 잔차2(15.1, 4.3, −13.7, 1.4, 5.4, −12.7)로 트리2 학습 → 단말 **−13.2 / 4.3 / 3.4 / 15.1** → 또 0.1배 해서 더함 … 반복할수록 잔차가 조금씩 줄어듦",
      "학습률을 곱해 **조금씩만** 고치는 이유: 한 번에 다 맞추면 과적합 → 작은 걸음 여러 번",
    ],
  },
  {
    title: "[실습] Gradient Boosting 기반 회귀",
    lines: [
      "Boston: (506, 13) (506,), 13개 속성 CRIM ZN INDUS CHAS NOX RM AGE DIS RAD TAX PTRATIO B LSTAT + MEDV",
      "train_test_split(test_size=0.10, random_state=42, shuffle=True)",
      "params = {'n_estimators': **500**, 'max_depth': **4**, 'min_samples_split': 2, 'learning_rate': **0.01**, 'loss': 'ls'} → **GradientBoostingRegressor(**params)**",
      "결과: **R2 sq 0.98003**(학습 데이터 score) / **Mean squared error 5.43** / **Test Variance score(r2) 0.91** — Ground Truth vs Predicted 산점도가 대각선 근처",
    ],
  },
  {
    title: "XGBoost",
    en: "eXtreme Gradient Boosting",
    lines: [
      "**Gradient Boost 기법의 개선** / **분류와 회귀 문제 지원**",
      "**정규화(regularization)를 강화**하여 과적합을 줄이고 일반화 성능 향상",
      "선형 모델과 트리 기반 모델 지원 / **사용자가 정의한 다양한 손실 함수** 사용 가능",
      "**결손값(missing value)**이 있는 데이터 지원",
      "대규모 데이터 처리를 위해 **병렬처리** 지원 및 **분산환경** 실행 가능",
      "모델 복잡도 및 과적합 조정을 위한 하이퍼파라미터 포함 / **Kaggle 대부분의 문제에서 상위 성능 모델**에서 사용 / 다양한 클라우드 서비스에서 제공",
      "XGBRegressor 기본값 예: base_score=0.5, booster='gbtree', learning_rate=0.1, max_depth=5, n_estimators=100, reg_alpha=0, reg_lambda=1, subsample=1 …",
      "[실습] **xgb.XGBRegressor(objective='reg:squarederror', colsample_bytree=0.3, learning_rate=0.1, max_depth=5, alpha=10, n_estimators=10)** → **RMSE 10.423243**",
    ],
  },
  {
    title: "LightGBM",
    lines: [
      "**Microsoft**에서 개발한 오픈소스 — **XGBoost 대비 메모리 사용량 및 처리속도를 개선**",
      "효율적인 대규모 데이터 처리: **히스토그램 기반** 접근, 히스토그램을 사용한 split 위치 결정",
      "**단말(leaf) 노드 중심 분할(leaf-wise split)**: 대부분의 부스팅 알고리즘은 깊이에 기반해 트리를 **균등하게 성장(너비 우선 분할, level-wise)** — LightGBM은 단말 중심 분할 → **정확도 개선 가능성(과적합 위험)**",
      "빠른 학습과 예측 시간, **GPU 학습 지원**",
      "**범주형 특징의 자동 변환과 최적 분할** — 추가 인코딩 없이 처리 / **결손값 자동 처리**",
      "분류, 회귀, **순위(Ranking)** 등 다양한 문제에 적용",
      "[실습] **LGBMClassifier(n_estimators=400)**, fit(early_stopping_rounds=100, eval_metric='logloss', eval_set=evals) → cross_validate(cv=5) → plot_metric(학습 중 logloss가 빠르게 감소), plot_importance, plot_tree",
    ],
  },
  {
    title: "CatBoost",
    en: "Categorical Boosting",
    lines: [
      "러시아 **Yandex**사에서 개발한 오픈소스 라이브러리 — **Gradient boosting** 기법을 따르는 **트리 기반 앙상블**",
      "**범주형 속성을 수치속성으로 표현**하여 사용 → **별도 전처리 불필요**",
      "**결손값 자동 처리** / **텍스트 속성 처리 지원** / **시계열(time series)** 데이터 지원(시간에 따라 변화하는 데이터 예측)",
      "**대칭형 트리(oblivious tree)**로 구성된 앙상블 — **균형 트리(balanced trees)** 사용 (같은 깊이의 노드는 같은 조건으로 분할)",
      "대규모 데이터 처리, **GPU와 멀티 CPU** 모두 지원 / **회귀, 분류, 다부류 분류, 순서결정(ranking)** 지원",
      "[실습] Rotten_tomatoes 영화평점 DB — auxiliary_columns(id, theater_date, dvd_date, rating, date) 제거, **cat_features**(rating_MPAA, studio, fresh, critic, top_critic, publisher), **text_features**(synopsis, genre, director, writer, review), 타깃 rating_10",
      "Pool(X, y, cat_features=…, text_features=…) → **CatBoostClassifier(iterations=1000, learning_rate=0.03, eval_metric='Accuracy', task_type='GPU')** → bestTest = 0.4717, bestIteration = 843 → 'Shrink model to first 844 iterations'",
    ],
  },
  {
    title: "Tree-based Ensemble Models 흐름",
    lines: [
      "**Decision Trees → Bagging → Random Forest → Boosting → AdaBoost → Gradient Boosting → XGBoost → LightGBM → CatBoost**",
    ],
    table: {
      title: "배깅 vs 부스팅 vs 스태킹",
      headers: ["", "배깅", "부스팅", "스태킹"],
      rows: [
        ["모델 학습", "병렬·독립", "순차·이전 오류 보완", "기반 모델 + 메타 학습기"],
        ["데이터", "붓스트랩(복원추출)", "가중치/잔차 변경", "기반 모델의 예측값이 입력"],
        ["결합", "투표 / 평균", "가중 합", "메타 학습기가 학습"],
        ["주 효과", "분산 감소", "편향 감소", "다양한 모델 장점 결합"],
        ["대표", "Random Forest", "AdaBoost, GB, XGB, LightGBM, CatBoost", "—"],
      ],
    },
  },
  {
    title: "Quiz 정답 정리",
    lines: [
      "앙상블 주 목적이 아닌 것 → **④ 실행 시간 단축** / 앙상블 기법이 아닌 것 → **④ 오버피팅** / 배깅 vs 부스팅 → **① 배깅 병렬, 부스팅 순차**",
      "랜덤 포리스트 → **② 배깅** / AdaBoost 오분류 데이터 → **③ 가중치 증가** / RF 특성 선택 옳지 않은 것 → **③ 모든 특성을 고려(✗)**",
      "배깅 특징 아닌 것 → **④ 순차적 학습** / 부스팅 잘못된 설명 → **③ 각 모델 독립 학습** / AdaBoost 초기 가중치 합 → **② 1**",
      "배깅 대표 예 → **② Random Forest** / 부스팅 기본 아이디어 → **③ 이전 모델 오류를 보정하며 순차 학습** / 개별 모델의 바람직한 특징 → **① 서로 독립적(다양함)**",
      "AdaBoost 원리 → **②** / RF 특징 선택 → **③ 각 노드에서 일부 특징을 무작위 선택 후 그중 최적 분할** / 스태킹 흔한 실수 → **③ 모든 기반 모델이 같은 유형**",
      "스태킹 핵심 → **①** / 메타 학습기 역할 → **② 여러 모델의 예측으로 최종 예측** / 메타 학습기 유형 → **④ 모든 유형 가능**",
      "GB 각 모델 학습 → **③ 순차적** / XGBoost → **③ 분류·회귀 모두** / LightGBM 특징 아닌 것 → **④ 모든 모델이 동일한 가중치**",
      "CatBoost가 다루기 어려운 것 → **④ 이미지 데이터** / 다양성 확보 이유 → **③ 일반화 성능 향상** / GB의 '그레디언트' → **② 손실 함수의 기울기**",
      "계산: 70%·65%·80% 독립 모델 다수결 = 2개 이상 맞힐 확률 = 0.7·0.65·0.8 + 0.7·0.65·0.2 + 0.7·0.35·0.8 + 0.3·0.65·0.8 = 0.364 + 0.091 + 0.196 + 0.156 = **0.807 (80.7%)**",
      "계산: 오류율 0.3인 독립 분류기 100개 다수결 → 51개 이상 틀려야 오류 = Σ_{k=51..100} C(100,k)0.3^k 0.7^(100−k) ≈ **9.0 × 10⁻⁶** (거의 0 — 독립이면 앙상블 효과가 큼)",
      "계산: AdaBoost ε = 0.3 → **α = 0.5·ln(0.7/0.3) ≈ 0.424**",
      "서술: 신경망 + 결정트리 3개 통합 → **투표(분류)/평균(회귀)**, 성능에 따른 **가중 투표**, 또는 예측들을 입력으로 **메타 학습기를 학습(스태킹)**",
    ],
  },
];
