import type { Question } from "@/lib/types";

/* nn1 · nn2 · dl · cnn */
export const QUESTIONS_3: Question[] = [
  // neuron
  { kind: "mc", id: "ml-q-ne-1", concept: "neuron", q: "인공 신경세포에서 가중치의 역할은?", options: ["출력 값을 고정", "입력 신호의 중요도 조절", "활성화 함수 선택", "학습률 결정"], answer: 1, explain: "모든 입력이 같은 가중치를 갖지 않는다." },
  { kind: "mc", id: "ml-q-ne-2", concept: "neuron", q: "신경세포에서 신호를 받아들이는 부분은?", options: ["축색돌기", "수상돌기", "신경연접", "세포핵"], answer: 1, explain: "수상돌기로 받고 축색돌기로 내보낸다. 연결 부위가 신경연접(synapse)." },
  { kind: "ox", id: "ml-q-ne-3", concept: "neuron", q: "활성화 함수는 뉴런의 가중합을 그대로(선형으로) 출력하기 위해 쓴다.", answer: false, explain: "선형 출력을 비선형으로 바꿔 뉴런 출력을 정한다." },
  { kind: "ox", id: "ml-q-ne-4", concept: "neuron", q: "인공 신경세포는 생물 신경세포와 완전히 동일한 방식으로 동작한다.", answer: false, explain: "모사(계산 모델)한 것이다." },

  // perceptron
  { kind: "mc", id: "ml-q-pe-1", concept: "perceptron", q: "퍼셉트론을 제안한 사람은?", options: ["McCulloch", "Rosenblatt", "Minsky", "Hinton"], answer: 1, explain: "Frank Rosenblatt, 1957." },
  { kind: "mc", id: "ml-q-pe-2", concept: "perceptron", q: "단층 퍼셉트론으로 풀 수 없는 문제는?", options: ["AND", "OR", "XOR", "NOT"], answer: 2, explain: "선형 분리 불가 (Minsky & Papert, 1969)." },
  { kind: "ox", id: "ml-q-pe-3", concept: "perceptron", q: "퍼셉트론의 결정 경계는 선형이다.", answer: true, explain: "그래서 선형 분리 가능한 문제만 푼다." },
  { kind: "short", id: "ml-q-pe-4", concept: "perceptron", q: "XOR에서 입력 (1, 1)의 출력은?", answers: ["0"], explain: "(0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-pe-5", concept: "perceptron", q: "학습률은 가중치를 한 번 업데이트할 때의 크기를 조절한다.", answer: true, explain: "너무 크면 최적점을 지나치고, 너무 작으면 느리다." },

  // mlp
  { kind: "short", id: "ml-q-mp-1", concept: "mlp", q: "입력 10 – 은닉 20 – 출력 5 노드인 MLP의 파라미터(가중치+편향) 수는?", answers: ["325"], explain: "(10×20 + 20) + (20×5 + 5) = 220 + 105 = 325.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-mp-2", concept: "mlp", q: "MLP 학습에서 계단 함수 대신 시그모이드를 쓰는 이유는?", options: ["계산이 더 빨라서", "미분 가능해서 경사 하강법(오차 역전파)을 쓸 수 있어서", "출력이 정수라서", "파라미터가 줄어서"], answer: 1, explain: "계단 함수는 미분할 수 없다." },
  { kind: "ox", id: "ml-q-mp-3", concept: "mlp", q: "다층 퍼셉트론은 XOR 같은 비선형 문제도 풀 수 있다.", answer: true, explain: "은닉층이 비선형 결정 경계를 만든다." },
  { kind: "ox", id: "ml-q-mp-4", concept: "mlp", q: "MLP의 모든 은닉층은 뉴런 수가 같아야 한다.", answer: false, explain: "층마다 달라도 된다." },
  { kind: "ox", id: "ml-q-mp-5", concept: "mlp", q: "MLP는 분류에만 쓸 수 있고 회귀에는 쓸 수 없다.", answer: false, explain: "분류·회귀 모두에 쓴다." },

  // activation
  { kind: "mc", id: "ml-q-ac-1", concept: "activation", q: "ReLU에 음수 입력이 들어오면 출력은?", options: ["입력 그대로", "0", "1", "−1"], answer: 1, explain: "max(0, x)." },
  { kind: "mc", id: "ml-q-ac-2", concept: "activation", q: "tanh 함수의 출력 범위는?", options: ["(0, 1)", "(−1, 1)", "[0, ∞)", "(−∞, ∞)"], answer: 1, explain: "시그모이드는 (0, 1)." },
  { kind: "short", id: "ml-q-ac-3", concept: "activation", q: "시그모이드(a=1)의 x = 0에서 도함수 값은?", answers: ["0.25", "1/4"], explain: "σ(0)(1 − σ(0)) = 0.5 × 0.5 = 0.25.", hint: "소수" },
  { kind: "ox", id: "ml-q-ac-4", concept: "activation", q: "시그모이드의 도함수는 함수 값 σ(x)만으로 계산할 수 있다.", answer: true, explain: "σ′ = σ(1 − σ)." },
  { kind: "ox", id: "ml-q-ac-5", concept: "activation", q: "모든 신경망은 같은 활성화 함수를 사용한다.", answer: false, explain: "계단·시그모이드·tanh·ReLU 등 층과 목적에 따라 다르게 쓴다." },

  // derivative
  { kind: "short", id: "ml-q-dv-1", concept: "derivative", q: "f(x) = 2x² + 1의 도함수 f′(x)는?", answers: ["4x"], explain: "2·2x = 4x, 상수 1의 미분은 0.", hint: "식" },
  { kind: "mc", id: "ml-q-dv-2", concept: "derivative", q: "f(x, y) = x²y의 ∂f/∂x는?", options: ["2x", "2xy", "x²", "y"], answer: 1, explain: "y를 상수로 보고 미분." },
  { kind: "ox", id: "ml-q-dv-3", concept: "derivative", q: "그레디언트는 함수 값이 가장 커지는 방향과 크기를 가리킨다.", answer: true, explain: "경사 하강법은 그 반대로." },
  { kind: "short", id: "ml-q-dv-4", concept: "derivative", q: "f(x, y) = x² + xy + y²일 때 (1, 2)에서 ∂f/∂x는?", answers: ["4"], explain: "2x + y = 2 + 2 = 4.", hint: "숫자만" },

  // backprop
  { kind: "mc", id: "ml-q-bp-1", concept: "backprop", q: "오차 역전파 알고리즘의 주된 목적은?", options: ["입력 데이터 정규화", "가중치와 편향을 오차가 줄도록 조정", "활성화 함수 선택", "데이터 증강"], answer: 1, explain: "출력층 오차를 입력층 쪽으로 전파하며 그레디언트 계산." },
  { kind: "mc", id: "ml-q-bp-2", concept: "backprop", q: "학습률이 너무 크면?", options: ["학습이 매우 느려진다", "최적점을 뛰어넘어 발산할 수 있다", "항상 더 정확해진다", "영향 없다"], answer: 1, explain: "너무 작으면 느리다." },
  { kind: "ox", id: "ml-q-bp-3", concept: "backprop", q: "오차 역전파는 연쇄 법칙으로 각 가중치의 그레디언트를 구한다.", answer: true, explain: "오차 함수에 경사 하강법을 적용한 것." },
  { kind: "ox", id: "ml-q-bp-4", concept: "backprop", q: "오차 역전파는 입력층의 오차를 출력층 쪽으로 전파한다.", answer: false, explain: "출력층 → 입력층 방향으로 거꾸로." },

  // cls-kinds
  { kind: "mc", id: "ml-q-ck-1", concept: "cls-kinds", q: "사진 한 장에 개와 고양이 모두를 표시하는 문제는?", options: ["이진 분류", "다부류 분류", "다중레이블 분류", "회귀"], answer: 2, explain: "한 대상에 여러 부류를 동시에 지정 → 다중레이블." },
  { kind: "mc", id: "ml-q-ck-2", concept: "cls-kinds", q: "개·고양이·토끼 중 하나로 분류하는 문제는?", options: ["이진 분류", "다부류 분류", "다중레이블 분류", "군집화"], answer: 1, explain: "셋 이상 중 하나 → 다부류(multiclass)." },
  { kind: "ox", id: "ml-q-ck-3", concept: "cls-kinds", q: "한 곡에 여러 장르를 붙이는 음악 장르 분류는 이진 분류의 예다.", answer: false, explain: "여러 부류를 동시에 지정 → 다중레이블 분류." },
  { kind: "mc", id: "ml-q-ck-4", concept: "cls-kinds", q: "다중레이블 분류 평가 척도가 아닌 것은?", options: ["P@K", "mAP@K", "Sampled F1", "R²"], answer: 3, explain: "R²는 회귀." },

  // encoding
  { kind: "short", id: "ml-q-ec-1", concept: "encoding", q: "'사과' [1,0,0], '바나나' [0,1,0]일 때 '체리'의 one-hot 벡터는?", answers: ["[0,0,1]", "0,0,1", "(0,0,1)"], explain: "세 번째 자리가 1.", hint: "[a,b,c]" },
  { kind: "ox", id: "ml-q-ec-2", concept: "encoding", q: "one-hot 벡터에는 1이 여러 개 들어갈 수 있다.", answer: false, explain: "1은 하나뿐, 그 위치가 ID. 벡터 크기는 서로 다른 부류(단어)의 개수." },
  { kind: "mc", id: "ml-q-ec-3", concept: "encoding", q: "부류 'cold', 'warm', 'hot'을 0, 2, 1처럼 바꾸는 것은?", options: ["one-hot 인코딩", "정수 인코딩", "정규화", "임베딩 평균"], answer: 1, explain: "부류마다 정수 하나를 붙인다. one-hot은 [1,0,0] 꼴." },

  // loss
  { kind: "short", id: "ml-q-ls-1", concept: "loss", q: "예측 [3, 4, 2, 5, 6], 실제 [2, 4, 3, 5, 7]일 때 MSE는?", answers: ["0.6", "3/5"], explain: "(1+0+1+0+1)/5 = 0.6.", hint: "소수" },
  { kind: "short", id: "ml-q-ls-2", concept: "loss", q: "정답 부류의 소프트맥스 확률이 0.3일 때 교차 엔트로피(자연로그)는? (소수 셋째 자리)", answers: ["1.204", "1.20", "1.2"], explain: "−ln 0.3 ≈ 1.204.", hint: "소수" },
  { kind: "mc", id: "ml-q-ls-3", concept: "loss", q: "다부류 분류에 주로 쓰는 출력층과 오차 함수 조합은?", options: ["ReLU + MSE", "소프트맥스 + 교차 엔트로피", "시그모이드 + MAE", "tanh + 지니"], answer: 1, explain: "회귀는 MSE, 이진 분류는 시그모이드 + 교차 엔트로피." },
  { kind: "ox", id: "ml-q-ls-4", concept: "loss", q: "교차 엔트로피 값이 0에 가까울수록 예측이 정확하다.", answer: true, explain: "정답 확률이 1이면 −ln 1 = 0." },
  { kind: "ox", id: "ml-q-ls-5", concept: "loss", q: "음의 로그 가능도를 최소화하는 것은 최대 가능도 추정과 같은 효과를 낸다.", answer: true, explain: "가능도를 최대로 하는 것 = 음의 로그 가능도를 최소로 하는 것." },
  { kind: "ox", id: "ml-q-ls-6", concept: "loss", q: "교차 엔트로피는 경사 상승법으로 최대화한다.", answer: false, explain: "경사 하강법으로 최소화한다." },
  { kind: "short", id: "ml-q-ls-7", concept: "loss", q: "예측 [1, 2, 3, 4], 실제 [1, 3, 2, 5]일 때 MAE는?", answers: ["0.75", "3/4"], explain: "(0+1+1+1)/4 = 0.75.", hint: "소수" },

  // softmax
  { kind: "mc", id: "ml-q-sm-1", concept: "softmax", q: "소프트맥스 층의 출력에 대한 설명으로 옳은 것은?", options: ["합이 1인 확률들", "항상 음수", "정수", "합이 0"], answer: 0, explain: "yₖ = e^(zₖ)/Σe^(zᵢ)." },
  { kind: "ox", id: "ml-q-sm-2", concept: "softmax", q: "소프트맥스 출력 중 가장 큰 확률의 인덱스가 예측된 클래스다.", answer: true, explain: "argmax." },
  { kind: "ox", id: "ml-q-sm-3", concept: "softmax", q: "소프트맥스 출력은 음수가 될 수 있다.", answer: false, explain: "e^z > 0이므로 항상 0 이상." },

  // deep-learning
  { kind: "mc", id: "ml-q-dl-1", concept: "deep-learning", q: "일반 신경망과 딥러닝 신경망의 주요 차이는?", options: ["입력 데이터 형식", "네트워크의 깊이", "활성화 함수가 없음", "출력층이 없음"], answer: 1, explain: "은닉층이 많다." },
  { kind: "ox", id: "ml-q-dl-2", concept: "deep-learning", q: "딥러닝은 특징 추출과 문제 해결을 함께 학습한다.", answer: true, explain: "사람이 직접 특징을 만들 필요가 줄어든다." },
  { kind: "ox", id: "ml-q-dl-3", concept: "deep-learning", q: "일반 신경망은 원시 데이터를 그대로 넣어도 특징을 스스로 잘 뽑으므로 특징의 품질과 무관하다.", answer: false, explain: "사람이 추출한 특징(handcrafted)을 쓰므로 그 품질에 좌우된다." },

  // vanishing-gradient
  { kind: "mc", id: "ml-q-vg-1", concept: "vanishing-gradient", q: "기울기 소멸 문제의 설명으로 옳은 것은?", options: ["오차가 아래층으로 갈수록 크게 줄어 학습이 안 된다", "기울기가 무한히 커진다", "학습률이 0이 된다", "데이터가 사라진다"], answer: 0, explain: "은닉층이 많을수록, 시그모이드·tanh에서 심하다." },
  { kind: "mc", id: "ml-q-vg-2", concept: "vanishing-gradient", q: "기울기 소멸 완화 방법이 아닌 것은?", options: ["ReLU 계열 활성화 함수", "적절한 가중치 초기화", "배치 정규화", "계단 함수 사용"], answer: 3, explain: "계단 함수는 미분조차 할 수 없다." },
  { kind: "mc", id: "ml-q-vg-3", concept: "vanishing-gradient", q: "ReLU의 dead neuron 문제를 해결하려고 음수 영역에 작은 기울기를 둔 함수는?", options: ["tanh", "Leaky ReLU", "시그모이드", "softmax"], answer: 1, explain: "ELU, GELU, SELU, Swish, Mish 등도 변형." },
  { kind: "ox", id: "ml-q-vg-4", concept: "vanishing-gradient", q: "시그모이드의 도함수 최댓값은 0.25이므로 층이 깊어질수록 곱해진 기울기가 작아진다.", answer: true, explain: "0.25 이하 값을 여러 번 곱하면 0에 가까워진다." },

  // weight-init
  { kind: "mc", id: "ml-q-wi-1", concept: "weight-init", q: "He 초기화의 분포 크기는?", options: ["N(0,1)·√(1/nᵢ)", "N(0,1)·√(2/nᵢ)", "모두 0", "모두 1"], answer: 1, explain: "Xavier는 √(1/nᵢ). He는 ReLU와 함께 쓴다." },
  { kind: "ox", id: "ml-q-wi-2", concept: "weight-init", q: "가중치를 모두 0으로 초기화하면 뉴런들이 같은 것을 배워 학습이 제대로 되지 않는다.", answer: true, explain: "대칭이 깨지지 않는다." },
  { kind: "ox", id: "ml-q-wi-3", concept: "weight-init", q: "초기 가중치는 학습 성능에 거의 영향을 주지 않는다.", answer: false, explain: "큰 영향을 준다." },

  // regularization-dropout
  { kind: "mc", id: "ml-q-rd-1", concept: "regularization-dropout", q: "드롭아웃에 대한 설명으로 옳은 것은?", options: ["추론할 때도 노드를 무작위로 끈다", "학습할 때 일정 확률로 노드를 없는 것으로 간주한다", "학습률을 높인다", "가중치를 0으로 초기화한다"], answer: 1, explain: "추론할 때는 모든 노드를 쓴다." },
  { kind: "mc", id: "ml-q-rd-2", concept: "regularization-dropout", q: "과적합 방지 기법이 아닌 것은?", options: ["드롭아웃", "데이터 증강", "조기 종료", "학습률 증가"], answer: 3, explain: "학습률은 과적합 방지 기법이 아니다." },
  { kind: "ox", id: "ml-q-rd-3", concept: "regularization-dropout", q: "L1 규제화는 가중치의 절댓값 합을, L2 규제화는 제곱 합을 벌점으로 쓴다.", answer: true, explain: "오차 함수 = 오차 항 + λ·복잡도 항." },
  { kind: "ox", id: "ml-q-rd-4", concept: "regularization-dropout", q: "규제화를 아무리 강하게 해도 과소적합은 생기지 않는다.", answer: false, explain: "너무 강하면 과소적합." },

  // minibatch
  { kind: "short", id: "ml-q-mb-1", concept: "minibatch", q: "데이터 1,000개, 배치 크기 100이면 한 에포크는 몇 iteration인가?", answers: ["10"], explain: "1000/100 = 10.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-mb-2", concept: "minibatch", q: "데이터 하나마다 가중치를 갱신하는 방법은?", options: ["배치 갱신", "확률적 갱신(SGD)", "미니배치 갱신", "에포크 갱신"], answer: 1, explain: "변동이 심하다." },
  { kind: "ox", id: "ml-q-mb-3", concept: "minibatch", q: "에포크는 가중치를 한 번 갱신하는 단위다.", answer: false, explain: "에포크는 전체 데이터로 한 번 학습을 마치는 것. 한 번 갱신은 iteration(배치 하나)." },

  // batch-norm
  { kind: "mc", id: "ml-q-bn-1", concept: "batch-norm", q: "배치 정규화에서 정규화한 뒤 적용하는 학습 파라미터는?", options: ["α와 ε", "크기조정 γ와 이동 β", "학습률과 모멘텀", "커널과 스트라이드"], answer: 1, explain: "평균 0·표준편차 1로 정규화한 뒤 γ·x̂ + β." },
  { kind: "short", id: "ml-q-bn-2", concept: "batch-norm", q: "미니배치 [1, 3, 5, 7]의 평균은?", answers: ["4"], explain: "16/4 = 4. 분산 5, 표준편차 √5.", hint: "숫자만" },
  { kind: "short", id: "ml-q-bn-3", concept: "batch-norm", q: "미니배치 [1, 3, 5, 7]의 분산은? (모분산)", answers: ["5"], explain: "(9+1+1+9)/4 = 5.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-bn-4", concept: "batch-norm", q: "추론할 때 배치 정규화는 학습 중 미니배치들의 평균·분산을 이동평균으로 저장해 쓴다.", answer: true, explain: "지수감소 이동평균(모멘텀 0.9, 0.99)." },
  { kind: "ox", id: "ml-q-bn-5", concept: "batch-norm", q: "배치 정규화에는 데이터를 회전(rotation)하는 연산이 포함된다.", answer: false, explain: "정규화·스케일·이동뿐." },

  // optimizers
  { kind: "mc", id: "ml-q-op-1", concept: "optimizers", q: "Adam은 어떤 두 방법을 결합했나?", options: ["모멘텀 + RMSprop", "Adagrad + SGD", "NAG + Adadelta", "드롭아웃 + 배치 정규화"], answer: 0, explain: "그레디언트의 1차·2차 모멘트." },
  { kind: "mc", id: "ml-q-op-2", concept: "optimizers", q: "과거 그레디언트의 제곱을 누적해 가중치별 학습률을 다르게 하는 것은?", options: ["모멘텀", "Adagrad", "NAG", "AdamW"], answer: 1, explain: "Adadelta·RMSprop은 과거 영향을 줄여 Adagrad를 보완." },
  { kind: "mc", id: "ml-q-op-3", concept: "optimizers", q: "모멘텀으로 먼저 이동한 위치의 그레디언트를 쓰는 방법은?", options: ["RMSprop", "NAG", "Adagrad", "AdaMax"], answer: 1, explain: "Nesterov Accelerated Gradient." },
  { kind: "ox", id: "ml-q-op-4", concept: "optimizers", q: "RMSprop은 그레디언트 제곱의 이동 평균을 써서 학습률을 조정한다.", answer: true, explain: "Adam = 모멘텀 + RMSprop." },
  { kind: "ox", id: "ml-q-op-5", concept: "optimizers", q: "Adam은 모든 문제에서 언제나 가장 우수한 옵티마이저다.", answer: false, explain: "문제에 따라 다르다 — AdamW, cosine annealing 등도 쓴다." },

  // cnn-intro
  { kind: "mc", id: "ml-q-ci-1", concept: "cnn-intro", q: "CNN이 영감을 받은 것은?", options: ["청각 피질", "동물의 시각피질", "운동 신경", "후각 수용체"], answer: 1, explain: "수용 영역, 계층적 처리." },
  { kind: "ox", id: "ml-q-ci-2", concept: "cnn-intro", q: "CNN의 하위 계층은 엣지·질감을, 상위 계층은 복잡한 패턴·객체를 감지한다.", answer: true, explain: "계층적으로 점점 추상적인 특징을 뽑는다." },
  { kind: "ox", id: "ml-q-ci-3", concept: "cnn-intro", q: "시각피질의 신경세포는 시야 전체의 자극에 반응한다.", answer: false, explain: "특정 영역(수용 영역)의 자극만 받는다." },

  // convolution
  { kind: "short", id: "ml-q-cv2-1", concept: "convolution", q: "5×5 입력에 3×3 커널, 스트라이드 1, 패딩 0을 적용한 출력 크기는? (n×n)", answers: ["3x3", "3×3", "3"], explain: "(5 − 3)/1 + 1 = 3.", hint: "n×n" },
  { kind: "short", id: "ml-q-cv2-2", concept: "convolution", q: "7×7 입력에 3×3 커널, 스트라이드 2를 적용한 출력 크기는? (n×n)", answers: ["3x3", "3×3", "3"], explain: "(7 − 3)/2 + 1 = 3.", hint: "n×n" },
  { kind: "short", id: "ml-q-cv2-3", concept: "convolution", q: "8×8 입력에 3×3 커널, 패딩 1, 스트라이드 1을 적용한 출력 크기는? (n×n)", answers: ["8x8", "8×8", "8"], explain: "(8 + 2 − 3)/1 + 1 = 8.", hint: "n×n" },
  { kind: "mc", id: "ml-q-cv2-4", concept: "convolution", q: "컨볼루션 출력 크기를 입력과 같게 유지하려면?", options: ["스트라이드 증가", "패딩 적용", "풀링 적용", "필터 수 증가"], answer: 1, explain: "입력 둘레를 0으로 채운다." },
  { kind: "mc", id: "ml-q-cv2-5", concept: "convolution", q: "RGB(3채널) 입력에 쓰는 3×3 필터의 깊이는?", options: ["1", "3", "9", "필터 개수"], answer: 1, explain: "필터 채널 수 = 입력 채널 수." },
  { kind: "ox", id: "ml-q-cv2-6", concept: "convolution", q: "CNN의 연산 부하 대부분은 풀링 연산에서 생긴다.", answer: false, explain: "대부분은 컨볼루션 연산. 풀링은 파라미터도 없고 가볍다." },
  { kind: "short", id: "ml-q-cv2-7", concept: "convolution", q: "입력 [[1,2,3],[0,1,2],[3,0,1]]에 커널 [[1,0],[0,1]]을 스트라이드 1로 적용할 때 왼쪽 위 출력 값은?", answers: ["2"], explain: "1·1 + 2·0 + 0·0 + 1·1 = 2. 전체 [[2,4],[0,2]].", hint: "숫자만" },

  // feature-map
  { kind: "mc", id: "ml-q-fm-1", concept: "feature-map", q: "특징지도의 깊이(채널 수)를 결정하는 것은?", options: ["입력 크기", "필터(커널)의 개수", "스트라이드", "패딩"], answer: 1, explain: "k개 필터 → k개 특징지도." },
  { kind: "short", id: "ml-q-fm-2", concept: "feature-map", q: "입력 채널 4, 3×3 커널 5개인 컨볼루션 층의 파라미터 수(편향 포함)는?", answers: ["185"], explain: "3×3×4×5 + 5 = 185.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-fm-3", concept: "feature-map", q: "특징지도의 각 원소는 필터가 표현한 특징이 그 위치에 있는 정도를 나타낸다.", answer: true, explain: "필터와의 내적이 클수록 그 특징이 강하다." },
  { kind: "short", id: "ml-q-fm-4", concept: "feature-map", q: "입력 3채널, 출력 64채널, 3×3 컨볼루션의 가중치 수(편향 제외)는?", answers: ["1728", "1,728"], explain: "3×3×3×64 = 1,728.", hint: "숫자만" },

  // conv-variants
  { kind: "mc", id: "ml-q-cvv-1", concept: "conv-variants", q: "1×1 컨볼루션의 주된 목적은?", options: ["공간 해상도 확대", "연산량을 줄이며 채널 간 상호작용(채널 수 조절)", "풀링 대체", "패딩 제거"], answer: 1, explain: "공간 크기는 그대로 두고 채널 방향으로만 섞는다." },
  { kind: "mc", id: "ml-q-cvv-2", concept: "conv-variants", q: "입력보다 큰 출력을 만드는(업샘플링) 컨볼루션은?", options: ["팽창 컨볼루션", "디컨볼루션(transposed)", "집단 컨볼루션", "1×1 컨볼루션"], answer: 1, explain: "Transposed / fractionally-strided convolution." },
  { kind: "short", id: "ml-q-cvv-3", concept: "conv-variants", q: "입력 3·출력 64채널, 3×3 깊이별 분할(depthwise separable) 컨볼루션의 가중치 수는?", answers: ["219"], explain: "3×3×3 + 1×1×3×64 = 27 + 192 = 219.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-cvv-4", concept: "conv-variants", q: "팽창(dilated) 컨볼루션은 커널 사이에 간격을 두어 수용 영역을 넓힌다.", answer: true, explain: "atrous = 구멍." },

  // pooling
  { kind: "mc", id: "ml-q-pl-1", concept: "pooling", q: "풀링의 역할이 아닌 것은?", options: ["특징지도 크기 축소", "위치 변화에 강건", "계산량 감소", "학습 파라미터 증가"], answer: 3, explain: "풀링에는 학습할 파라미터가 없다." },
  { kind: "short", id: "ml-q-pl-2", concept: "pooling", q: "10×10 입력에 3×3 풀링, 스트라이드 2를 적용한 출력 크기는? (n×n)", answers: ["4x4", "4×4", "4"], explain: "(10 − 3)/2 + 1 = 4 (내림).", hint: "n×n" },
  { kind: "short", id: "ml-q-pl-3", concept: "pooling", q: "[[4,3,2,1],[2,2,3,4],[1,0,1,3],[5,2,1,0]]에 2×2 최대 풀링(스트라이드 2)을 하면 오른쪽 아래 값은?", answers: ["3"], explain: "블록 [[1,3],[1,0]]의 최대 = 3. 전체 [[4,4],[5,3]].", hint: "숫자만" },
  { kind: "ox", id: "ml-q-pl-4", concept: "pooling", q: "최대값 풀링 층은 학습해야 할 가중치가 많다.", answer: false, explain: "0개." },
  { kind: "ox", id: "ml-q-pl-5", concept: "pooling", q: "확률적 풀링은 값 크기에 비례하는 확률로 대푯값을 고른다.", answer: true, explain: "추론할 때는 확률적 가중합을 쓴다." },

  // cnn-architecture
  { kind: "mc", id: "ml-q-ca-1", concept: "cnn-architecture", q: "CNN에서 완전연결층(FC)의 역할은?", options: ["특징 추출", "최종 예측(분류·회귀)", "크기 축소", "패딩"], answer: 1, explain: "앞부분 Conv–ReLU–Pool이 특징 추출, 뒷부분 FC가 예측." },
  { kind: "mc", id: "ml-q-ca-2", concept: "cnn-architecture", q: "CNN 컨볼루션 층 뒤에 주로 쓰는 활성화 함수는?", options: ["계단 함수", "ReLU", "소프트맥스", "항등 함수"], answer: 1, explain: "기울기 소멸이 적고 계산이 간단하다." },
  { kind: "short", id: "ml-q-ca-3", concept: "cnn-architecture", q: "입력 10, 노드 20인 완전연결층의 파라미터 수(편향 포함)는?", answers: ["220"], explain: "10×20 + 20 = 220.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-ca-4", concept: "cnn-architecture", q: "분류용 CNN은 마지막에 소프트맥스 층을 두는 경우가 많다.", answer: true, explain: "…–FC–SM. 소프트맥스가 부류 확률을 낸다." },

  // autodiff
  { kind: "short", id: "ml-q-ad-1", concept: "autodiff", q: "f(x, y) = xy + x²y³일 때 (1, 2)에서 ∂f/∂x는?", answers: ["18"], explain: "y + 2xy³ = 2 + 16 = 18.", hint: "숫자만" },
  { kind: "short", id: "ml-q-ad-2", concept: "autodiff", q: "f(x, y) = xy + x²y³일 때 (1, 2)에서 ∂f/∂y는?", answers: ["13"], explain: "x + 3x²y² = 1 + 12 = 13.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-ad-3", concept: "autodiff", q: "함수를 기본 연산의 계산 그래프로 나타내고 연쇄 법칙으로 미분 값을 구하는 방법은?", options: ["수치적 미분", "기호적 미분", "자동 미분", "유한 차분"], answer: 2, explain: "수치적 미분은 근사, 기호적 미분은 수식 미분." },
  { kind: "ox", id: "ml-q-ad-4", concept: "autodiff", q: "연쇄 법칙에서는 중간 변수의 도함수들을 서로 곱한다.", answer: true, explain: "경로가 여럿이면 더한다." },
];
