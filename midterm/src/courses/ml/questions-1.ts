import type { Question } from "@/lib/types";

/* intro · cls · unsup */
export const QUESTIONS_1: Question[] = [
  // ml-def
  { kind: "mc", id: "ml-q-def-1", concept: "ml-def", q: "기계학습의 주된 목적은?", options: ["컴퓨터의 처리 속도를 높이는 것", "경험을 통해 같거나 비슷한 일을 더 효율적으로 처리하도록 시스템을 바꾸는 것", "저장 용량을 늘리는 것", "사람이 모든 규칙을 직접 적는 것"], answer: 1, explain: "경험 → 일 → 효율(성능). 데이터에서 지식을 자동으로 추출해 쓰게 하는 기술." },
  { kind: "short", id: "ml-q-def-2", concept: "ml-def", q: "1959년 '기계학습'이라는 용어를 쓴 사람은? (영어 이름의 성)", answers: ["samuel", "arthur samuel", "사무엘", "아서 사무엘"], explain: "Arthur Samuel — 명시적으로 프로그래밍하지 않아도 학습으로 과업을 수행하게 하는 기술." },
  { kind: "ox", id: "ml-q-def-3", concept: "ml-def", q: "기계학습은 신경망의 한 분야이다.", answer: false, explain: "포함 관계는 인공지능 ⊃ 기계학습 ⊃ 신경망 ⊃ 딥러닝. 신경망이 기계학습의 한 분야다." },
  { kind: "mc", id: "ml-q-def-4", concept: "ml-def", q: "'스팸 이메일 판단'을 경험·일·성능으로 볼 때 성능 척도로 알맞은 것은?", options: ["이메일 수", "스팸 여부", "판단 정확도", "메일 서버 속도"], answer: 2, explain: "경험: 이메일과 스팸 여부, 일: 스팸 판단, 성능: 정확도." },

  // ml-vs-programming
  { kind: "mc", id: "ml-q-vs-1", concept: "ml-vs-programming", q: "전통적 프로그래밍과 기계학습의 차이로 옳지 않은 것은?", options: ["전통적 프로그래밍은 사람이 알고리즘을 직접 만든다", "기계학습은 데이터로부터 모델을 자동으로 만든다", "기계학습은 항상 전통적 프로그래밍보다 우수하다", "전통적 프로그래밍에는 명시적인 규칙이 필요하다"], answer: 2, explain: "기계학습이 '항상' 우수한 것은 아니다." },
  { kind: "ox", id: "ml-q-vs-2", concept: "ml-vs-programming", q: "필기문자 인식에서 사람이 직접 만든 규칙·휴리스틱은 복잡하고 성능이 불충분해, 기계학습이 괄목할 성능을 냈다.", answer: true, explain: "MNIST 예." },

  // inductive-occam
  { kind: "mc", id: "ml-q-oc-1", concept: "inductive-occam", q: "사례들을 일반화해 패턴이나 모델을 뽑는 학습은?", options: ["연역적 학습", "귀납적 학습", "강화 학습", "전이 학습"], answer: 1, explain: "Inductive learning — 일반적인 기계학습의 대상." },
  { kind: "mc", id: "ml-q-oc-2", concept: "inductive-occam", q: "오컴의 면도날 원리에 대한 설명으로 옳지 않은 것은?", options: ["불필요한 가정은 피해야 한다", "가능한 가장 간단한 설명을 고른다", "항상 가장 복잡한 모델이 좋다", "학습 결과를 간단한 형태로 표현하는 것이 좋다"], answer: 2, explain: "경제성·검약의 원리 — 단순한 쪽을 고른다." },
  { kind: "ox", id: "ml-q-oc-3", concept: "inductive-occam", q: "오컴의 면도날은 '경제성의 원리' 또는 '검약의 원리'라고도 한다.", answer: true, explain: "불필요한 가정을 삼가라는 원리." },

  // ml-types
  { kind: "mc", id: "ml-q-ty-1", concept: "ml-types", q: "지도학습의 특징으로 옳지 않은 것은?", options: ["입력과 출력 데이터가 주어진다", "새 입력의 출력을 예측한다", "출력 정보가 없는 데이터에서 패턴을 추출한다", "분류와 회귀에 쓰인다"], answer: 2, explain: "출력 정보가 없는 데이터 → 비지도학습." },
  { kind: "mc", id: "ml-q-ty-2", concept: "ml-types", q: "강화학습에서 에이전트의 목표는?", options: ["데이터를 많이 모으는 것", "주어진 데이터를 분류하는 것", "기대 보상을 최대화하는 정책을 학습하는 것", "모든 상황에서 같은 행동을 하는 것"], answer: 2, explain: "정답 대신 보상(reward)만 주어진다." },
  { kind: "mc", id: "ml-q-ty-3", concept: "ml-types", q: "지도학습에 쓰이지 않는 알고리즘은?", options: ["결정트리", "k-means", "로지스틱 회귀", "SVM"], answer: 1, explain: "k-means는 비지도 군집화." },
  { kind: "mc", id: "ml-q-ty-4", concept: "ml-types", q: "군집화 알고리즘으로 부적절한 것은?", options: ["k-means", "계층적 군집화", "로지스틱 회귀", "DBSCAN"], answer: 2, explain: "로지스틱 회귀는 분류." },
  { kind: "short", id: "ml-q-ty-5", concept: "ml-types", q: "강화학습에서 '각 상태별로 취할 행동을 정해 놓은 것'을 무엇이라 하는가? (영어 한 단어)", answers: ["policy", "정책"], explain: "Policy(정책)." },
  { kind: "mc", id: "ml-q-ty-6", concept: "ml-types", q: "데이터 자체에서 감독 신호를 만들어 사람이 라벨을 달지 않고도 지도학습처럼 표현을 배우는 것은?", options: ["준지도 학습", "자기지도 학습", "강화 학습", "앙상블 학습"], answer: 1, explain: "Self-supervised learning." },
  { kind: "ox", id: "ml-q-ty-7", concept: "ml-types", q: "회귀는 출력이 부류(범주)인 지도학습이다.", answer: false, explain: "출력이 부류면 분류, 연속값이면 회귀." },
  { kind: "mc", id: "ml-q-ty-8", concept: "ml-types", q: "학습 데이터의 역할로 가장 부적절한 것은?", options: ["패턴 인식", "모델 평가", "모델 훈련", "직접적인 제어 수행"], answer: 3, explain: "학습 데이터는 패턴을 찾고 모델을 훈련·평가하는 데 쓴다." },

  // supervised-cls
  { kind: "short", id: "ml-q-sc-1", concept: "supervised-cls", q: "분류에서 부류 영역을 나누는 경계를 무엇이라 하는가? (영어 두 단어)", answers: ["decision boundary", "결정 경계", "결정경계"], explain: "Decision boundary." },
  { kind: "ox", id: "ml-q-sc-2", concept: "supervised-cls", q: "분류 문제에서 학습된 함수는 반드시 수학적 함수 꼴이어야 하며 규칙 꼴일 수는 없다.", answer: false, explain: "수학적 함수일 수도, 규칙일 수도 있다(결정트리)." },
  { kind: "mc", id: "ml-q-sc-3", concept: "supervised-cls", q: "iris 데이터에 대한 설명으로 옳은 것은?", options: ["범주형 속성 데이터", "3종 붓꽃, 수치 속성 4개", "회귀 문제 데이터", "비지도 데이터"], answer: 1, explain: "피셔 경이 모은 붓꽃 3종, 속성 4개(꽃받침·꽃잎의 길이·너비)." },

  // data-split
  { kind: "mc", id: "ml-q-ds-1", concept: "data-split", q: "학습 과정에서 학습을 중단할 시점을 정하는 데 쓰는 데이터는?", options: ["훈련 데이터", "검증 데이터", "테스트 데이터", "증강 데이터"], answer: 1, explain: "Validation data." },
  { kind: "mc", id: "ml-q-ds-2", concept: "data-split", q: "이상적인 분류기의 특성은?", options: ["학습 데이터에만 잘 작동한다", "학습되지 않은 데이터도 잘 분류한다", "가능한 많은 특성을 쓴다", "학습 데이터에 100% 정확도를 보장한다"], answer: 1, explain: "일반화 능력." },
  { kind: "ox", id: "ml-q-ds-3", concept: "data-split", q: "테스트 데이터는 학습에 쓰지 않은 데이터여야 한다.", answer: true, explain: "학습 데이터와 겹치면 성능을 부풀려 평가한다." },

  // over-underfit
  { kind: "mc", id: "ml-q-of-1", concept: "over-underfit", q: "과적합을 피하는 방법으로 적절하지 않은 것은?", options: ["검증 데이터로 조기 종료", "학습 데이터 규모 확대", "모델 복잡도 축소", "모델 복잡도 증가"], answer: 3, explain: "복잡도 증가는 부적합의 해결책." },
  { kind: "mc", id: "ml-q-of-2", concept: "over-underfit", q: "조기 종료(early stopping)에서 학습을 멈추는 시점은?", options: ["학습 오류가 0이 될 때", "검증 오류가 감소하다가 증가하기 시작할 때", "학습 오류가 증가할 때", "에포크가 100이 될 때"], answer: 1, explain: "검증 데이터 오류가 다시 늘기 시작하면 과적합이 시작된 것." },
  { kind: "mc", id: "ml-q-of-3", concept: "over-underfit", q: "부적합(underfitting)을 피하는 방법이 아닌 것은?", options: ["더 복잡한 모델 사용", "특징 수 확대", "학습 횟수(epoch) 증가", "드롭아웃 비율 크게 높이기"], answer: 3, explain: "드롭아웃은 과적합 대책 — 높이면 오히려 더 단순해진다." },
  { kind: "ox", id: "ml-q-of-4", concept: "over-underfit", q: "과적합 상태는 학습 데이터 오류가 매우 적으므로 바람직한 상태다.", answer: false, explain: "학습하지 않은 데이터에서 성능이 떨어진다." },
  { kind: "mc", id: "ml-q-of-5", concept: "over-underfit", q: "데이터에 있는 특징들을 결합해 새로운 특징을 만드는 것은?", options: ["특징 선택", "특징 추출", "재표본추출", "정규화"], answer: 1, explain: "특징 선택은 있는 것 중 고르기, 추출은 새로 만들기." },

  // accuracy-cv
  { kind: "mc", id: "ml-q-cv-1", concept: "accuracy-cv", q: "k-겹 교차검증의 목적은?", options: ["모델 복잡도 결정", "최적 하이퍼파라미터 탐색만", "모델의 일반화 능력 평가", "과적합 증진"], answer: 2, explain: "데이터가 부족할 때 많이 학습에 쓰면서 성능을 평가." },
  { kind: "mc", id: "ml-q-cv-2", concept: "accuracy-cv", q: "데이터가 n개일 때 Leave-One-Out 교차검증의 k는?", options: ["1", "2", "10", "n"], answer: 3, explain: "k = n. n−1개로 학습, 1개로 테스트." },
  { kind: "ox", id: "ml-q-cv-3", concept: "accuracy-cv", q: "k-겹 교차검증에서는 각 등분을 한 번씩 테스트 데이터로 쓰고 성능의 평균을 낸다.", answer: true, explain: "k번 학습·평가." },
  { kind: "short", id: "ml-q-cv-4", concept: "accuracy-cv", q: "200개 중 170개를 옳게 분류했다. 정확도는? (소수)", answers: ["0.85", "85%"], explain: "170/200 = 0.85.", hint: "숫자만" },

  // imbalanced
  { kind: "mc", id: "ml-q-im-1", concept: "imbalanced", q: "부류 A가 99%인 데이터에서 늘 A로만 답하는 분류기의 정확도는?", options: ["1%", "50%", "99%", "알 수 없다"], answer: 2, explain: "그래서 불균형 데이터에서는 정확도가 무의미할 수 있다." },
  { kind: "mc", id: "ml-q-im-2", concept: "imbalanced", q: "SMOTE가 새 데이터를 만드는 위치는?", options: ["다수 부류의 중심", "소수 부류 데이터 x와 그 근접이웃 y를 잇는 직선 위 무작위 위치", "결정 경계 바깥", "무작위 좌표"], answer: 1, explain: "x와 y 사이 선분의 무작위 점." },
  { kind: "mc", id: "ml-q-im-3", concept: "imbalanced", q: "불균형 데이터 해결 방법으로 부적절한 것은?", options: ["가중치를 고려한 정확도 척도", "재표본추출", "인공 데이터 생성", "그대로 정확도로만 평가"], answer: 3, explain: "정확도만 보면 다수 부류만 맞혀도 높게 나온다." },
  { kind: "mc", id: "ml-q-im-4", concept: "imbalanced", q: "다른 부류와의 경계에 있는 샘플을 늘려 어려운 부분에 집중하는 SMOTE 확장은?", options: ["ADASYN", "Borderline-SMOTE", "Undersampling", "Bagging"], answer: 1, explain: "ADASYN은 주변 다수 범주 데이터 수에 따라 유동적으로 생성." },

  // confusion-metrics
  { kind: "mc", id: "ml-q-cm-1", concept: "confusion-metrics", q: "정밀도(precision)의 의미는?", options: ["실제 양성 중 맞힌 비율", "양성이라 예측한 것 중 실제 양성의 비율", "실제 음성 중 맞힌 비율", "전체 중 맞힌 비율"], answer: 1, explain: "TP/(TP+FP)." },
  { kind: "short", id: "ml-q-cm-2", concept: "confusion-metrics", q: "분류기가 50개를 양성으로 예측했고 그중 40개가 실제 양성이다. 정밀도는?", answers: ["0.8", "80%", "4/5"], explain: "40/50 = 0.8.", hint: "소수" },
  { kind: "short", id: "ml-q-cm-3", concept: "confusion-metrics", q: "위 문제에서 전체 데이터의 실제 양성이 60개라면 재현율은? (소수 둘째 자리까지)", answers: ["0.67", "0.667", "2/3", "0.6667"], explain: "40/60 ≈ 0.667.", hint: "소수" },
  { kind: "short", id: "ml-q-cm-4", concept: "confusion-metrics", q: "정밀도 0.75, 재현율 0.6일 때 F1은? (소수 둘째 자리까지)", answers: ["0.67", "0.667", "2/3", "0.6667"], explain: "2×0.75×0.6/(0.75+0.6) = 0.9/1.35 ≈ 0.667.", hint: "소수" },
  { kind: "mc", id: "ml-q-cm-5", concept: "confusion-metrics", q: "민감도와 같은 말이 아닌 것은?", options: ["재현율(recall)", "진양성율(TPR)", "특이도(specificity)", "양성의 정확도"], answer: 2, explain: "특이도 = 진음성율(음성의 정확도)." },
  { kind: "ox", id: "ml-q-cm-6", concept: "confusion-metrics", q: "실제 음성을 양성으로 잘못 예측한 것(FP)을 type 1 error라 한다.", answer: true, explain: "FN은 type 2 error." },
  { kind: "short", id: "ml-q-cm-7", concept: "confusion-metrics", q: "부류 A(정밀도 0.9, 50개), 부류 B(정밀도 0.6, 150개)의 데이터 수 가중 정밀도는?", answers: ["0.675"], explain: "(0.9×50 + 0.6×150)/200 = (45+90)/200 = 0.675.", hint: "소수" },
  { kind: "ox", id: "ml-q-cm-8", concept: "confusion-metrics", q: "이진 분류 혼동행렬의 대각선 값은 잘못 분류한 개수다.", answer: false, explain: "대각선(TP, TN)은 올바르게 분류한 개수." },

  // roc-auc
  { kind: "mc", id: "ml-q-roc-1", concept: "roc-auc", q: "ROC 곡선의 y축은?", options: ["FPR", "정밀도", "TPR(재현율)", "특이도"], answer: 2, explain: "x축 FPR(위양성율), y축 TPR(민감도)." },
  { kind: "mc", id: "ml-q-roc-2", concept: "roc-auc", q: "AUC 값의 범위는?", options: ["0~0.5", "0.5~1", "0~1", "−1~1"], answer: 2, explain: "곡선 아래 면적 — 0~1, 클수록 좋다." },
  { kind: "short", id: "ml-q-roc-3", concept: "roc-auc", q: "ROC 곡선이 (0,0), (0.1,0.3), (0.4,0.8), (1,1)을 지날 때 AUC는?", answers: ["0.72"], explain: "사다리꼴: 0.1×0.15 + 0.3×0.55 + 0.6×0.9 = 0.015 + 0.165 + 0.54 = 0.72.", hint: "소수" },
  { kind: "mc", id: "ml-q-roc-4", concept: "roc-auc", q: "부류 판정 임계값을 낮추면 일반적으로?", options: ["민감도↓ 특이도↑", "민감도↑ 특이도↓", "둘 다 ↑", "둘 다 그대로"], answer: 1, explain: "양성 판정이 늘어 민감도는 오르고 특이도는 내려간다." },
  { kind: "ox", id: "ml-q-roc-5", concept: "roc-auc", q: "AUC가 1에 가까울수록 분류기 성능이 랜덤 추측과 같아진다.", answer: false, explain: "1에 가까우면 완벽, 0.5면 무작위 추측 수준." },

  // unsupervised
  { kind: "mc", id: "ml-q-un-1", concept: "unsupervised", q: "비지도학습의 대상이 아닌 것은?", options: ["결과 정보 없는 데이터에서 패턴 찾기", "지도학습에 필요한 라벨을 사람이 붙이기", "데이터의 잠재 구조 찾기", "거리를 유지하며 저차원으로 표현하기"], answer: 1, explain: "라벨을 붙이는 것 자체는 비지도학습이 아니다." },
  { kind: "ox", id: "ml-q-un-2", concept: "unsupervised", q: "로그 정보로 사용 패턴을 찾는 것은 비지도학습의 예다.", answer: true, explain: "결과 정보 없이 패턴을 찾는다." },

  // clustering
  { kind: "mc", id: "ml-q-cl-1", concept: "clustering", q: "군집화의 일반적인 목적이 아닌 것은?", options: ["유사한 데이터를 모으기", "모든 데이터를 단일 군집으로 만들기", "군집 내 유사도는 크게, 군집 간 유사도는 작게", "데이터를 군집으로 나누기"], answer: 1, explain: "하나로 모으면 군집화의 의미가 없다." },
  { kind: "mc", id: "ml-q-cl-2", concept: "clustering", q: "계층적 군집화의 결과를 시각적으로 나타내는 도구는?", options: ["산점도", "덴드로그램", "히스토그램", "박스 플롯"], answer: 1, explain: "Dendrogram." },
  { kind: "mc", id: "ml-q-cl-3", concept: "clustering", q: "모든 데이터를 담은 군집 하나에서 시작해 점차 나누는 방식은?", options: ["병합형", "분리형", "분할 군집화", "퍼지 군집화"], answer: 1, explain: "Divisive(top-down). 병합형은 각 데이터에서 시작해 합친다." },
  { kind: "mc", id: "ml-q-cl-4", concept: "clustering", q: "퍼지 군집화의 특징은?", options: ["데이터가 한 군집에만 속한다", "데이터가 여러 군집에 부분적으로 속하고 소속 정도의 합은 1이다", "모든 데이터를 한 군집으로 본다", "경계가 늘 명확하다"], answer: 1, explain: "예: 퍼지 k-means." },
  { kind: "ox", id: "ml-q-cl-5", concept: "clustering", q: "분할 군집화의 결과는 군집들이 계층적인 구조를 갖는다.", answer: false, explain: "계층 구조를 만드는 것은 계층적 군집화. 분할 군집화(k-means, DBSCAN)는 계층 없이 나눈다." },

  // linkage
  { kind: "mc", id: "ml-q-lk-1", concept: "linkage", q: "계층적 군집화의 군집 간 거리 계산 방법이 아닌 것은?", options: ["단순 연결", "완전 연결", "평균 연결", "최대 밀도 연결"], answer: 3, explain: "단순·완전·평균·중심·Ward 연결." },
  { kind: "mc", id: "ml-q-lk-2", concept: "linkage", q: "완전(최장) 연결의 거리는?", options: ["가장 가까운 데이터 사이 거리", "가장 먼 데이터 사이 거리", "중심 사이 거리", "평균 거리"], answer: 1, explain: "Complete linkage = 최장 거리." },
  { kind: "mc", id: "ml-q-lk-3", concept: "linkage", q: "Ward 연결 방식의 목적은?", options: ["군집 내 분산(편차 제곱합) 증가를 최소화하는 군집을 합치기", "최대 거리로 합치기", "평균 거리로 합치기", "모든 군집 간 거리를 같게"], answer: 0, explain: "합친 뒤와 전의 군집 내 SSE 차이." },

  // kmeans
  { kind: "mc", id: "ml-q-km-1", concept: "kmeans", q: "k-means에서 반복되는 단계는?", options: ["중심을 다시 계산하고 데이터의 군집 배정을 갱신", "모든 데이터를 한 군집에 배정", "군집 수를 늘림", "데이터를 정렬"], answer: 0, explain: "배정 → 평균으로 중심 이동, 군집이 바뀌지 않을 때까지." },
  { kind: "ox", id: "ml-q-km-2", concept: "kmeans", q: "k-means는 군집의 개수 k를 미리 정해야 하며, 초기 중심 위치에 민감하다.", answer: true, explain: "그래서 k-means++, 엘보우 방법을 쓴다." },
  { kind: "mc", id: "ml-q-km-3", concept: "kmeans", q: "k에 따른 군집 내 SSE 그래프에서 가장 크게 꺾이는 곳의 k를 고르는 방법은?", options: ["실루엣 방법", "엘보우 방법", "k-means++", "DBSCAN"], answer: 1, explain: "Elbow method." },
  { kind: "short", id: "ml-q-km-4", concept: "kmeans", q: "k=2, 초기 중심 (2,2)·(8,8), 점 (1,1)·(2,1)·(7,8)일 때 한 번 반복 후 (2,2) 쪽 군집의 새 중심은? (x,y)", answers: ["(1.5,1)", "1.5,1", "(1.5, 1)", "1.5, 1"], explain: "(1,1)과 (2,1)이 (2,2)에 가깝다 → 평균 (1.5, 1).", hint: "(x,y)" },

  // dbscan
  { kind: "mc", id: "ml-q-db-1", concept: "dbscan", q: "DBSCAN의 특징이 아닌 것은?", options: ["군집 수를 미리 정하지 않는다", "다양한 모양의 군집을 찾는다", "모든 점을 하나의 군집에 배정한다", "밀도에 기반해 군집을 만든다"], answer: 2, explain: "밀도가 낮은 점은 군집에 들지 않을 수 있다." },
  { kind: "mc", id: "ml-q-db-2", concept: "dbscan", q: "DBSCAN의 두 파라미터는?", options: ["k와 학습률", "Eps(반경)와 MinPts(최소 이웃 수)", "깊이와 너비", "평균과 분산"], answer: 1, explain: "반경 Eps 안에 MinPts 이상이면 연결된 것으로 본다." },

  // density-estimation
  { kind: "mc", id: "ml-q-de-1", concept: "density-estimation", q: "GMM(혼합 가우시안 모델)을 쓰는 주된 목적은?", options: ["데이터를 하나의 가우시안으로 표현", "데이터를 여러 가우시안 분포의 합으로 표현", "분산을 최대화", "데이터를 분류 규칙으로 바꿈"], answer: 1, explain: "각 가우시안은 데이터 부분 집합의 분포." },
  { kind: "mc", id: "ml-q-de-2", concept: "density-estimation", q: "히스토그램은 어떤 밀도 추정인가?", options: ["모수적", "비모수적", "준지도", "강화"], answer: 1, explain: "특정 함수를 가정하지 않는다." },
  { kind: "short", id: "ml-q-de-3", concept: "density-estimation", q: "데이터 [1,2,2,3,4,5,5,5,6]에 폭 1인 히스토그램을 그릴 때 값 5인 칸의 밀도는? (분수 또는 소수 셋째 자리)", answers: ["3/9", "1/3", "0.333", "0.33"], explain: "개수 3 / (전체 9 × 폭 1) = 1/3.", hint: "분수 또는 소수" },
  { kind: "ox", id: "ml-q-de-4", concept: "density-estimation", q: "모수적 밀도 추정은 분포가 특정 수학적 함수 꼴이라고 가정한다.", answer: true, explain: "예: 가우시안." },

  // dim-reduction
  { kind: "mc", id: "ml-q-dr-1", concept: "dim-reduction", q: "차원 축소의 목적이 아닌 것은?", options: ["고차원을 저차원으로", "모든 차원을 유지하며 복잡성 증가", "시각화 용이", "차원의 저주 완화"], answer: 1, explain: "정보 손실을 최소화하며 줄이는 것." },
  { kind: "ox", id: "ml-q-dr-2", concept: "dim-reduction", q: "차원이 커질수록 데이터 사이 거리가 더 다양해져서 구분이 쉬워진다.", answer: false, explain: "차원의 저주 — 거리 분포가 오히려 일정해진다." },

  // pca
  { kind: "mc", id: "ml-q-pc-1", concept: "pca", q: "PCA에서 '주성분'의 의미는?", options: ["가장 큰 데이터", "변동성이 가장 낮은 방향", "변동성이 가장 높은 방향의 벡터", "모든 특성의 평균"], answer: 2, explain: "분산이 가장 커지는 투영 방향." },
  { kind: "mc", id: "ml-q-pc-2", concept: "pca", q: "PCA에 대한 설명으로 옳지 않은 것은?", options: ["공분산 행렬의 고유값이 큰 고유벡터를 쓴다", "분산을 최대화하는 축을 찾는다", "데이터를 더 높은 차원으로 바꾼다", "차원을 축소한다"], answer: 2, explain: "저차원으로 바꾼다." },
  { kind: "ox", id: "ml-q-pc-3", concept: "pca", q: "PCA는 먼저 데이터의 평균 벡터가 0벡터가 되도록 옮긴다.", answer: true, explain: "평균 중심화." },

  // tsne-umap
  { kind: "mc", id: "ml-q-ts-1", concept: "tsne-umap", q: "t-SNE에 대한 설명으로 옳지 않은 것은?", options: ["비선형 차원 축소", "고차원 데이터를 더 높은 차원으로 매핑", "유사성을 바탕으로 저차원 표현을 찾음", "두 공간 조건부 확률의 차이를 최소화"], answer: 1, explain: "2·3차원 같은 저차원으로." },
  { kind: "mc", id: "ml-q-ts-2", concept: "tsne-umap", q: "t-SNE가 최소화하는 두 분포의 차이는?", options: ["MSE", "KL-divergence", "엔트로피", "지니 지수"], answer: 1, explain: "KL-divergence를 경사 하강법으로." },
  { kind: "ox", id: "ml-q-ts-3", concept: "tsne-umap", q: "UMAP은 t-SNE보다 훨씬 빠르게 시각화할 수 있는 비선형 차원 축소 방법이다.", answer: true, explain: "2018년 개발." },

  // outlier
  { kind: "mc", id: "ml-q-ol-1", concept: "outlier", q: "겨울철 기온 30도처럼 상황에 맞지 않는 데이터는?", options: ["점 이상치", "상황적 이상치", "집단적 이상치", "잡음"], answer: 1, explain: "Contextual outlier." },
  { kind: "short", id: "ml-q-ol-2", concept: "outlier", q: "Q1 = 14, Q3 = 36일 때 IQR 방법의 상한은?", answers: ["69"], explain: "IQR = 22, 상한 = 36 + 1.5×22 = 69.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-ol-3", concept: "outlier", q: "Tukey(IQR) 방법과 관련이 적은 것은?", options: ["상한 = Q3 + 1.5·IQR", "IQR = Q3 − Q1", "iTree를 여러 개 만들어 이상치 탐지", "Q1, Q3로 이상치 결정"], answer: 2, explain: "iTree는 Isolation Forest." },
  { kind: "ox", id: "ml-q-ol-4", concept: "outlier", q: "잡음은 이상치와 마찬가지로 관심 대상이다.", answer: false, explain: "잡음은 관측 오류·무작위 오차로 제거 대상이다." },
  { kind: "mc", id: "ml-q-ol-5", concept: "outlier", q: "Isolation Forest가 이상치를 찾는 방식과 관련이 가장 적은 것은?", options: ["데이터를 분리하기 쉬운 정도를 이용", "모든 데이터를 정상으로 분류", "특정 데이터의 경로 길이 계산", "루트에서 단말까지 평균 경로 길이 사용"], answer: 1, explain: "쉽게(짧은 경로로) 분리되는 데이터가 이상치." },

  // semi-supervised
  { kind: "mc", id: "ml-q-ss-1", concept: "semi-supervised", q: "준지도 학습의 가정이 아닌 것은?", options: ["평활성 가정", "군집 가정", "매니폴드 가정", "균등 분포 가정"], answer: 3, explain: "세 가정: 평활성·군집·매니폴드." },
  { kind: "mc", id: "ml-q-ss-2", concept: "semi-supervised", q: "준지도 학습이 특히 유용한 상황은?", options: ["라벨 데이터가 충분할 때", "라벨링 비용이 크거나 라벨 데이터가 적을 때", "모든 데이터에 라벨이 있을 때", "데이터가 없을 때"], answer: 1, explain: "라벨은 비싸고 미분류 데이터는 싸다." },
  { kind: "mc", id: "ml-q-ss-3", concept: "semi-supervised", q: "준지도 학습의 미세변동 기반 방법에서 데이터 증강의 목적은?", options: ["부류가 바뀌지 않을 정도로 변형해도 예측이 같아지게", "모두 새 클래스로", "라벨 없는 데이터만 사용", "라벨 데이터 양만 늘림"], answer: 0, explain: "작은 변화에도 출력이 같도록 학습." },
  { kind: "ox", id: "ml-q-ss-4", concept: "semi-supervised", q: "그래프 기반 준지도 학습은 노드 사이 유사도를 따라 라벨을 전파한다.", answer: true, explain: "Label propagation." },
];
