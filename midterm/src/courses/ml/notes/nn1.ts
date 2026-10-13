import type { NoteSection } from "@/lib/types";

/** ML-8 신경망 – I */
export const NN1: NoteSection[] = [
  {
    title: "학습 내용",
    lines: [
      "신경망을 구성하는 **뉴런의 함수적 특성** / **퍼셉트론** 모델의 특성 / **다층 퍼셉트론** / **미분** 복습 / 다층 퍼셉트론의 학습 알고리즘인 **오차 역전파 알고리즘**",
    ],
  },
  {
    title: "1. 신경망",
    en: "Neural network, artificial neural network",
    lines: [
      "**인간 두뇌에 대한 계산적 모델**을 통해 인공지능을 구현하려는 분야",
      "신경세포(neuron)의 구성:",
      "· **수상돌기(dendrite)**: 다른 신경세포의 축색돌기와 연결되어 **전기화학적 신호를 받아들이는** 부위",
      "· **축색돌기(axon)**: 수신한 신호의 **합성결과 값이 특정 임계값 이상이면 신호를 내보내는** 부위",
      "· **신경연접(synapse)**: 수상돌기와 축색돌기 **연결 부위** — 전달되는 신호의 **증폭 또는 감쇄**",
      "그림: Dendrite → Soma(cell body, 세포체) → axon → Axon terminal / MIT 뇌 신경망 이미지",
      "대응 관계: 수상돌기 = **입력**, 시냅스 세기 = **가중치**, 세포체의 합산 = **가중합 s**, 임계값 넘으면 발화 = **활성화 함수**",
    ],
  },
  {
    title: "2. 퍼셉트론",
    en: "Perceptron",
    lines: [
      "신경세포의 계산 모델: **McCulloch & Pitts, 1943**",
      "**퍼셉트론: 로젠블랏(Rosenblatt, 1957)이 제안한 학습 가능한 신경망 모델**",
      "구조: 입력층 x0 = 1(가중치 w0 = b), x1, …, xd → 출력층 y",
      "**s = Σ_{i=1..d} wixi + b = Σ_{i=0..d} wixi**, y = f(s), **활성화 함수 f는 계단 함수**(s > 0이면 1, 아니면 0 또는 −1)",
      "코드: sum = np.dot(inputs, weights[1:]) + weights[0]; **if sum > 0: activation = 1 else: activation = 0**",
    ],
  },
  {
    title: "OR 연산 퍼셉트론과 선형 분리",
    lines: [
      "**OR 퍼셉트론**: 가중치 w1 = 1, w2 = 1, 바이어스 −0.5 → **y = f(x1 + x2 − 0.5)**",
      "· p1 (0,0): s = −0.5 → **0** / p2 (1,0): 0.5 → **1** / p3 (0,1): 0.5 → **1** / p4 (1,1): 1.5 → **1**",
      "**선형 분리가능 문제(linearly separable problem)**: 직선(초평면) 하나로 두 부류를 나눌 수 있음 (AND, OR)",
      "**선형 분리불가 문제(linearly inseparable problem)**: **XOR(eXclusive OR)** — (0,0): 0, (0,1): 1, (1,0): 1, (1,1): 0 → 직선 하나로 불가 (**Minsky & Papert, 1969**가 지적)",
      "→ **단일 퍼셉트론의 결정 경계는 선형**이라 XOR를 풀 수 없음",
    ],
  },
  {
    title: "3. 다층 퍼셉트론",
    en: "Multilayer Perceptron, MLP",
    lines: [
      "**여러 개의 퍼셉트론을 층 구조로 구성**한 신경망 모델",
      "XOR 풀이 예(계단 함수):",
      "· **f1(x) = f(x1 + x2 − 0.5)** → OR (직선 아래쪽 (0,0)만 0)",
      "· **f2(x) = f(−x1 − x2 + 1.5)** → NAND ((1,1)만 0)",
      "· **f3 = f(f1 + f2 − 1.5)** → 둘 다 1일 때만 1 (AND) → **y = OR AND NAND = XOR**",
      "· 그림: 두 직선 f1, f2 사이 띠 영역에 (0,1), (1,0)이 들어가 1로 판정",
      "**학습**: 입력-출력 (xi, yi)의 학습 데이터에 대해 **기대출력 yi와 MLP 출력 f(xi)의 차이(오차)가 최소**가 되도록 **가중치 w를 결정**하는 것",
      "**학습 가능한 다층 퍼셉트론 = 오차 역전파(error backpropagation) 알고리즘**",
      "· 활성화 함수를 **계단 함수에서 미분 가능한 시그모이드 함수로 대체** (계단 함수는 기울기가 0이거나 정의되지 않아 경사 하강법 불가)",
      "· **경사 하강법** 적용",
    ],
  },
  {
    title: "활성화 함수",
    en: "Activation function",
    lines: [
      "**계단(step) 함수**: x > 0이면 1, 아니면 0",
      "**시그모이드(sigmoid)**: **σ(x, a) = 1 / (1 + e^(−ax))**, **구간 (0, 1)** 출력",
      "· 미분: **σ′(x, a) = a·σ(x, a)(1 − σ(x, a))** — **시그모이드 값만으로 미분값 계산 가능**",
      "**쌍곡탄젠트(tanh)**: **tanh(x) = (e^(2x) − 1)/(e^(2x) + 1)**, **구간 (−1, 1)** 출력 (0 중심)",
      "· 미분: **tanh′(x) = 1 − tanh²(x)**",
      "(Quiz에 나오는 **ReLU**: max(0, x) — 음수 입력이면 **0** 출력)",
    ],
    code: `def sigmoid(x, a=1):
    return 1/(1+np.exp(-a*x))
def d_sigmoid(x, a=1):
    return a*sigmoid(x,a)*(1 - sigmoid(x,a))
def tanh(x):
    return (np.exp(2*x)-1)/(np.exp(2*x)+1)
def d_tanh(x):
    return 1.0-tanh(x)*tanh(x)`,
  },
  {
    title: "MLP의 동작과 학습 목표",
    lines: [
      "입력층 (x1, …, xd) → **은닉층(hidden layer)** z1…zp → 출력층 o1…om, 출력 (y1, …, ym)",
      "은닉층: **zsum_j = Σ_{i=1..d} u_ji·xi + u_j0** (1 ≤ j ≤ p), **zj = f(zsum_j)**",
      "출력층: **osum_k = Σ_{j=1..p} v_kj·zj + v_k0** (1 ≤ k ≤ m), **ok = f(osum_k)**",
      "학습 목표: **기대 출력과 MLP 출력이 최대한 비슷해지도록 가중치를 변경** — **E = ½ Σ_k (ok − yk)²**",
      "**경사 하강법**: v_jk(t+1) = v_jk(t) − η ∂E/∂v_jk, u_ij(t+1) = u_ij(t) − η ∂E/∂u_ij",
    ],
  },
  {
    title: "4. 미분",
    en: "Differentiation",
    lines: [
      "함수 f(x)의 변수 x에 대한 **순간변화율** — x의 아주 미세한 변화에 대한 f(x)의 변화량",
      "**f′(x) = df/dx = lim_{Δx→0} (f(x + Δx) − f(x)) / Δx**",
      "예: f(x) = 2x² + 1 → (2(x + Δx)² + 1 − 2x² − 1)/Δx = (4xΔx + Δx²)/Δx = 4x + Δx → **4x**",
      "**상수** d/dx c = 0 / **거듭제곱** d/dx xⁿ = n·xⁿ⁻¹ / **지수** d/dx e^(ax) = a·e^(ax) / **로그** d/dx log x = 1/x",
      "**상수배** [c·f]′ = c·f′ / **합** [f + g]′ = f′ + g′ / **곱** [f·g]′ = g·f′ + f·g′ / **분수식** (f/g)′ = (g·f′ − f·g′)/g²",
      "**연쇄 법칙(Chain Rule)**: y = f(g(x)), y = f(u), u = g(x) → **dy/dx = (dy/du)(du/dx)** (Δx → 0이면 Δu → 0이므로)",
      "**편미분(partial differentiation)**: 다변수 함수에서 **하나의 변수에 주목하고 나머지는 고정**시켜 놓고 하는 미분",
      "· 예: f(x, y) = x² + xy + y² → **∂f/∂x = 2x + y**, **∂f/∂y = x + 2y**",
      "**다변수 함수의 연쇄 법칙**: df(x(t), y(t))/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt)",
      "· 예: f = x + 2y, x = 2t + 4, y = t² → ∂f/∂x = 1, ∂f/∂y = 2, dx/dt = 2, dy/dt = 2t → **df/dt = 2 + 4t**",
      "· 일반형: ∂h/∂ti = Σ_n (∂h/∂xn)(∂xn/∂ti)",
      "**그레디언트(gradient)**: 함수 f(x, y, z)의 **각 변수에 대한 편미분을 성분으로 갖는 벡터** ∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z) — **함수값이 가장 커지는 방향과 크기**",
      "[실습] 그레디언트 그리기: f(x, y) = 2x² + 4xy + 5y² − 6x + 2y + 10 → ∂f/∂x = **4x + 4y − 6**, ∂f/∂y = **4x + 10y + 2** (슬라이드엔 두 번째도 ∂x로 오타) → plt.contour 등고선 + plt.quiver 빨간 화살표(바깥쪽, 증가 방향)",
    ],
  },
  {
    title: "5. 오차 역전파 알고리즘",
    en: "Error back propagation algorithm, Backprop",
    lines: [
      "오차함수 **E = ½ Σ_{k=1..m} (ok − yk)²**, 갱신 **v(t+1) = v(t) − η ∂E/∂v**, **u(t+1) = u(t) − η ∂E/∂u**",
      "**출력층 가중치**: ∂E/∂v_kj = (∂E/∂ok)(∂ok/∂v_kj) = **(ok − tk)·f′(osum_k)·zj = δk·zj**",
      "· **δk = (ok − tk)·f′(osum_k)**: 출력 노드 k의 오차 신호",
      "**은닉층 가중치**: ∂E/∂u_ji = (∂E/∂zj)(∂zj/∂u_ji) = Σ_k (∂E/∂ok)(∂ok/∂zj)·f′(zsum_j)·xi",
      "· = Σ_k (ok − tk) f′(osum_k) v_kj f′(zsum_j) xi = **Σ_k δk·v_kj·f′(zsum_j)·xi**",
      "→ 출력층의 오차 δ가 **가중치 v를 타고 뒤(입력 쪽)로 전파**되어 은닉층 가중치를 고침 — 그래서 '역전파'",
      "**경사 하강법(Gradient Descent Methods)** 그림: 오차 곡면 위의 공이 골짜기로 굴러 내려감, **지역 최솟값(local minimum)**에 빠질 수 있음",
      "그림(adatis): 입력 → 은닉층들 → 출력, Y_target과 비교해 **E**를 구하고 이를 거꾸로 전파",
    ],
  },
  {
    title: "[실습] MLP 학습 (numpy로 직접 구현)",
    lines: [
      "구조: 입력 1 → 은닉 노드(w1, b1 / z1, a1) → 출력 1(w2, b2 / z2), **은닉층은 시그모이드, 출력층은 선형**",
      "**E = ½(yi − ŷ)²**, **w1 ← w1 − αΔw1**, **w2 ← w2 − αΔw2** (α = 0.1)",
      "역전파 계산: dy = −(y − ŷ), dz2 = 1, dw2 = a1ᵀ → **delta_w2 = dy·dz2·dw2**, delta_b2 = dy·dz2",
      "· da1 = w2ᵀ, dz1 = d_sigmoid(z1), dw1 = xᵀ → **delta_w1 = dy·dz2·da1·dz1·dw1**, delta_b1 = dy·dz2·da1·dz1",
      "train: n_train = 20, sin(x) on 0~2π → **MLP(hidden_node=4).train(max_iter=600)** → test 60점 예측이 ground truth(사인 곡선)를 거의 따라감",
    ],
    code: `z1 = np.dot(self.w1, x.reshape(1,1)) + self.b1;  a1 = self.sigmoid(z1)
z2 = np.dot(self.w2, a1) + self.b2;  y_hat = z2
e  = 0.5*(y - y_hat)**2;  dy = -(y - y_hat)
dz2 = 1;  dw2 = a1.T
delta_w2 = dy*dz2*dw2;  delta_b2 = dy*dz2
da1 = self.w2.T;  dz1 = self.d_sigmoid(z1);  dw1 = x.T
delta_w1 = dy*dz2*da1*dz1*dw1;  delta_b1 = dy*dz2*da1*dz1
self.w2 -= alpha*delta_w2;  self.b2 -= alpha*delta_b2
self.w1 -= alpha*delta_w1;  self.b1 -= alpha*delta_b1`,
  },
  {
    title: "[실습] sklearn의 MLP (wine)",
    lines: [
      "wine 데이터: Classes 3, Samples per class [59, 71, 48], 총 178, Dimensionality 13, Features real·positive",
      "train_test_split → **StandardScaler**(fit은 X_train에만, transform은 둘 다) → **MLPClassifier(hidden_layer_sizes=(13,13,13), max_iter=500)**",
      "결과: 혼동행렬 **[[11 0 0] [1 15 1] [0 0 17]]**, **accuracy 0.96** (45개), precision 0.92/1.00/0.94, recall 1.00/0.88/1.00",
      "TensorFlow Playground: 원형 데이터를 은닉층 2개(4 neurons, 2 neurons)로 분류 — Test loss 0.505, Training loss 0.504 / XOR을 MLP로 학습한 결정 경계(3D) 그림",
    ],
  },
  {
    title: "Quiz 정답 정리",
    lines: [
      "가중치 역할 → **② 입력 신호의 중요도 조절** / 활성화 함수 목적 → **② 선형 출력을 비선형으로 변환** / 임계값 초과 시 활성화 → **④ Step**",
      "신경세포 옳지 않은 것 → **④ 인공 신경세포는 생물 신경세포와 동일한 동작(✗ — 단순화한 계산 모델)**",
      "활성화 함수 잘못된 설명 → **③ 모든 신경망에 동일한 활성화 함수** / 역전파 목적 → **② 출력층 오차를 입력층 쪽으로 전파해 가중치 조정**",
      "신경망 옳지 않은 것 → **② 퍼셉트론은 비선형 결정경계를 표현(✗)** / MLP 옳지 않은 것 → **④ 학습율은 −1~1(✗ — 작은 양수)** / 퍼셉트론 개발 → **③ Frank Rosenblatt**",
      "오차 함수 옳지 않은 것 → **④ 교차 엔트로피에는 경사 상승법(✗ — 경사 하강법으로 최소화)**",
      "옳지 않은 것 → **③ 분류 문제에서는 MSE를 쓸 수 없다(✗ — 쓸 수는 있음)** / 소프트맥스를 붙이면 출력을 확률로 해석, 다부류 출력은 one-hot",
      "퍼셉트론 용도 → **② 분류** / ReLU 음수 → **① 0** / Sigmoid 범위 → **① 0~1** / 0 중심 → **③ Tanh**",
      "단일 퍼셉트론 결정 경계 → **④ 선형** / 가중치 업데이트 → **② 오차 역전파** / MLP 학습 → **③ 지도 학습**",
      "퍼셉트론 한계 → **② XOR 같은 비선형 문제 불가** / 퍼셉트론을 쌓은 구조 → **④ 다층 퍼셉트론** / 학습률 → **① 가중치 업데이트 크기**",
      "f(g(x))′ → **① f′(g(x))·g′(x)** / ∂(x²y)/∂x → **② 2xy** / ∂(x³ + y²)/∂y → **② 2y**",
      "손실이 크면 → **③ 예측이 목표와 멀다** / 역전파가 수정 → **③ 가중치와 편향** / 그레디언트 방향 → **① 함수값이 증가하는 방향**",
      "MLP 목적 → **① 분류 및 회귀** / 은닉층 수 증가 → **④ 학습 시간 증가** / 학습률이 너무 크면 → **② 최적점을 뛰어넘음**",
      "가중치 잘못된 설명 → **④ 신경망의 구조를 결정** / 학습률 잘못된 설명 → **④ 모든 신경망에서 동일한 값** / 과적합 방지로 잘못 → **③ 학습률 증가**",
      "뉴런 연산 잘못 → **③ 모든 입력이 동일한 가중치** / MLP 특징 잘못 → **③ 모든 은닉층이 같은 뉴런 수**",
      "신경망 옳지 않은 것 → **③ 퍼셉트론은 경사하강법으로 학습(✗ — 계단 함수는 미분 불가, 퍼셉트론 학습 규칙 사용)**",
      "옳지 않은 것 → **① 퍼셉트론은 선형분리 불가 문제에 적용 가능(✗)**",
      "계산: 입력 10 – 은닉 20 – 출력 5 → (10×20 + 20) + (20×5 + 5) = 220 + 105 = **325개** (가중치 + 바이어스)",
    ],
  },
];
