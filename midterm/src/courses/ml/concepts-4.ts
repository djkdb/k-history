import type { Concept } from "@/lib/types";

/* ML-9 CNN 모델 — 물체 인식 CNN 모델들 (LeNet ~ ConvNeXt) */
export const CONCEPTS_4: Concept[] = [
  {
    id: "lenet-alexnet",
    chapter: "cnnm",
    title: "LeNet과 AlexNet",
    en: "LeNet-5 (1998) · AlexNet",
    importance: "high",
    summary:
      "**LeNet**(Yann LeCun 등, 1998)은 필기체 숫자를 인식한 초기 CNN이고, **AlexNet**은 8계층 구조로 **ReLU를 처음 쓴** 모델이다. AlexNet은 FC 층에 **드롭아웃**, **최대값 풀링**도 썼다.",
    points: [
      "LeNet5 구조: **Conv-Pool-Conv-Pool-Conv-FC-FC(SM)** — 입력 **32×32** 필기체 숫자(MNIST)",
      "LeNet 풀링 = 가중치 × (2×2 블록의 합) + 편차항, **시그모이드** 활성화, 오차율 **0.95%**(정확도 99.05%)",
      "AlexNet **8계층**: Conv-Pool-Norm-Conv-Pool-Norm-Conv-Conv-Conv-Pool-FC-FC-FC(SM)",
      "AlexNet: **ReLU를 사용한 첫 모델** · FC 층에 **드롭아웃** · **최대값 풀링**",
    ],
    trap: "LeNet은 시그모이드, AlexNet은 ReLU. 'ReLU를 처음 쓴 모델'은 AlexNet이다.",
  },
  {
    id: "vggnet",
    chapter: "cnnm",
    title: "VGGNet — 3×3 필터만 쌓기",
    en: "VGGNet (VGG-16, VGG-19)",
    importance: "high",
    summary:
      "사이머니언과 지서만이 제안(2014). **모든 층에서 3×3 필터**만 쓰는 단순한 구조로, VGG-16(16층)·VGG-19(19층)가 있다. 2014년 ILSVRC **2등**(상위-5 오류율 **7.32%**).",
    points: [
      "**3×3 필터 2회 = 5×5 필터 효과**, **3×3 필터 3회 = 7×7 필터 효과** (같은 수용 영역)",
      "가중치 수: 3×3을 3번 = **27** vs 7×7 한 번 = **49** → 더 적다",
      "ReLU를 **3회** 적용 → 더 **복잡한 결정경계** 표현 가능",
    ],
    trap: "VGGNet은 2014년 우승이 아니라 2등이다. 2014년 우승은 GoogleNet(6.67%).",
  },
  {
    id: "googlenet",
    chapter: "cnnm",
    title: "GoogleNet — 인셉션 모듈과 1×1 컨볼루션",
    en: "GoogleNet · Inception Module",
    importance: "must",
    summary:
      "구글의 체게디 등이 개발, 2014년 ILSVRC **우승**(상위-5 오류율 **6.67%**). **22개 층**이며 **인셉션(Inception) 모듈**이 핵심이다. 인셉션 모듈은 직전 층 결과에 **1×1, 3×3, 5×5 컨볼루션을 동시에** 적용해 **여러 크기의 수용장**에 있는 특징을 함께 뽑는다.",
    points: [
      "구조: Conv-MPool-Conv-Incept-Incept-MPool-Incept×5-MPool-Incept-Incept-**APool**-FC-SM (MPool 최대값, APool 평균값 풀링)",
      "**1×1 컨볼루션**: 같은 위치의 특징지도 값들을 가중치로 선형결합 → **필터 개수로 출력 특징지도 수(채널) 조정**",
      "예: 224×224×500 → (1×1×500)@120 → **224×224×120**",
      "마지막 계층은 **소프트맥스** / 가중치 수는 AlexNet의 약 10% 수준(성능 표: 6.6M vs 61.1M)",
      "**기울기 소멸 완화**: 4번째·7번째 계층에 **보조 분류기** 추가 → 그레디언트 정보 제공",
    ],
    trap: "슬라이드 문장은 'AlexNet에 비해 가중치 개수는 10% 증가'로 적혀 있지만, 같은 PDF의 성능 비교 표(GoogLeNet 6.6M, AlexNet 61.1M)로 보면 'AlexNet의 약 10% 수준'이라는 뜻으로 읽힌다.",
  },
  {
    id: "resnet",
    chapter: "cnnm",
    title: "ResNet — 잔차 모듈과 지름길 연결",
    en: "ResNet · Residual Module · Skip Connection",
    importance: "must",
    summary:
      "카이밍 허 등이 개발, 2015년 ILSVRC **우승**(상위-5 오류율 **3.75%**), **152개 층**. 층을 많이 쌓으면 상위 계층에서 의미 있는 특징을 뽑을 수 있지만 **기울기 소멸**이 생긴다. 이를 **잔차 모듈** — 입력 x를 출력에 그대로 더하는 **지름길 연결(항등 사상)** — 로 해결한다: **y = F(x) + x = W₂ρ(W₁x) + x**.",
    points: [
      "구조: Conv-MPool-[Conv-ReLU×3]**×3**-[…]**×8**-[…]**×36**-[…]**×3**-APool-FC-SM",
      "**지름길 연결(skip connection)** = **항등 사상(identity mapping)** — 층들은 **잔차 F(x)** 만 학습",
      "기대 출력과 비슷한 입력이 오면 F(x)는 **영벡터에 가까운 값**을 학습 → 입력의 작은 변화에 민감",
      "**다양한 경로**로 복합적인 특징 추출 — 필요한 출력이 얻어지면 컨볼루션 층을 **건너뛸 수 있음**",
    ],
  },
  {
    id: "densenet-dpn",
    chapter: "cnnm",
    title: "DenseNet과 DPN",
    en: "DenseNet · Dual Path Network",
    importance: "high",
    summary:
      "**DenseNet**(Gao Huang 등, 2016)은 **각 층이 앞 단계 모든 층에서 오는 지름길 연결**을 받는다. **밀집 블록(dense block)** 과 **전이층(transition layer)** 으로 구성된다. **DPN**은 ResNet과 DenseNet을 **결합**한 모델이다.",
    points: [
      "노드 연산 Hᵢ = **BN-ReLU-(3×3 컨볼루션)** — 각 층은 입력 특징지도와 같은 차원의 특징지도 생성",
      "**병목층**: 1×1 컨볼루션으로 출력 채널 수 축소 → BN-ReLU-(1×1 conv)-BN-ReLU-(3×3 conv)",
      "**전이층** = 1×1 컨볼루션 + **평균값 풀링** (특징지도 크기를 줄이려면 풀링 필요)",
      "ResNet: 이전 특징을 **재사용**하는 경향, 새 특징 만들기엔 소극적 / DenseNet: **새 특징**이 잘 나오지만 이미 뽑은 특징을 다시 뽑을 가능성도 높음",
      "DPN: **마이크로 블록**에서 두 특징을 결합",
    ],
  },
  {
    id: "senet",
    chapter: "cnnm",
    title: "SENet — 채널별 중요도 재조정",
    en: "Squeeze-and-Excitation Networks",
    importance: "high",
    summary:
      "**SE 블록**으로 **채널 간의 상호 의존성**을 모델링해 **채널별 특징 반응을 적응적으로 재조정**한다. 2017년 ILSVRC **우승**. 기존 CNN 모델에 SE 블록을 **끼워 넣어** 쓸 수 있다.",
    points: [
      "**압축(squeeze)**: 채널별 통계량을 위해 **전역 평균 풀링(global average pooling)**",
      "**흥분(excitation)**: 임베딩을 입력받아 **채널별 가중치**를 만드는 **self-gating** (ReLU, sigmoid)",
      "만든 가중치를 각 채널에 곱해 중요한 채널은 키우고 덜 중요한 채널은 줄인다",
    ],
  },
  {
    id: "mobilenet",
    chapter: "cnnm",
    title: "MobileNet과 ShuffleNet — 가벼운 CNN",
    en: "MobileNet · Depthwise Separable Conv · ShuffleNet",
    importance: "must",
    summary:
      "**MobileNet**은 컴퓨팅 자원이 제한된 환경을 위한 모델로, **깊이별 분할 컨볼루션(depthwise separable convolution)** = **깊이별 컨볼루션 + 위치별(1×1) 컨볼루션**을 쓴다. **ShuffleNet**은 모바일 단말용으로 **위치별 집단 컨볼루션**과 **채널 섞기**를 쓴다.",
    points: [
      "입력 D_F×D_F×M, 출력 D_F×D_F×N (D_F 폭·높이, M 입력 채널, N 출력 채널), 커널 D_K×D_K",
      "표준 컨볼루션 계산 비용: **D_K·D_K·M·N·D_F·D_F**",
      "깊이별 분할 컨볼루션 비용: **D_K·D_K·M·D_F·D_F + M·N·D_F·D_F**",
      "→ 비율 = 1/N + 1/D_K² (3×3이면 대략 8~9분의 1로 감소)",
      "블록 비교: 일반 = 3×3 Conv-BN-ReLU / 분할 = **3×3 Depthwise Conv-BN-ReLU-1×1 Conv-BN-ReLU**",
      "ShuffleNet: 정확도 유지 + 계산 비용 축소 — **pointwise group convolution + channel shuffle**",
    ],
    trap: "비율 1/N + 1/D_K²는 슬라이드의 두 비용 식을 나눠서 얻는 값이다(슬라이드에 직접 적힌 식은 아님).",
  },
  {
    id: "efficientnet-convnext",
    chapter: "cnnm",
    title: "EfficientNet과 ConvNeXt",
    en: "EfficientNet (2019) · ConvNeXt (2022)",
    importance: "high",
    summary:
      "**EfficientNet**은 신경망 규모를 **깊이·너비·입력 해상도** 세 방향으로 **함께(복합 스케일링)** 체계적으로 키운다. **ConvNeXt**는 **비전 트랜스포머의 설계 원리**를 ResNet-50부터 단계적으로 적용해 CNN 성능을 개선했다.",
    points: [
      "깊이 = 층의 수, 너비 = 각 층의 채널 수, 해상도 = 입력 영상 크기",
      "복합 계수 φ: 깊이 **α^φ**배, 너비 **β^φ**배, 해상도 **γ^φ**배 — 조건 **α·β²·γ² ≈ 2**",
      "EfficientNet-B0: **신경망 구조 탐색(NAS)** 으로 설계한 기본 모델",
      "**MBConv**: 1×1 conv(채널 **6배** 확대) → 3×3 깊이별 conv → **SE 모듈** — **역병목(inverted bottleneck)**: 채널을 늘렸다가 줄임",
      "ConvNeXt-T: **패치 분할**(4×4 conv, 스트라이드 4) · 4개 스테이지 · 다운샘플링마다 가로·세로 1/2, 채널 2배(96→192→384→768)",
      "ConvNeXt 블록: **7×7 깊이별 conv** + 1×1 conv 2개(채널 4배 확대 후 복구, 역병목) + **지름길 연결** / ReLU·BN → **GELU·층 정규화(LN)**",
      "ConvNeXt는 영상 분류·물체 검출·의미 분할의 **백본** 모델로 활용",
    ],
  },
  {
    id: "cnn-model-compare",
    chapter: "cnnm",
    title: "CNN 모델 성능 비교 — Top-1·Top-5",
    en: "Top-1 / Top-5 Accuracy, Parameters, GFLOPs",
    importance: "high",
    summary:
      "**Top-1 정확도**는 모델이 가장 높은 확률을 준 클래스가 정답인 비율, **Top-5 정확도**는 상위 5개 클래스 안에 정답이 있는 비율이다. 모델은 정확도와 함께 **가중치 수, GFLOPs(연산량), 입력 해상도**로 비교한다.",
    points: [
      "T1-accuracy = (1순위 예측이 정답인 데이터 수 / 전체 데이터 수) × 100",
      "AlexNet → ResNet → EfficientNet·ConvNeXt로 갈수록 Top-1 정확도가 크게 향상",
      "정확도가 높아질수록 대체로 GFLOPs와 입력 해상도도 증가",
      "MobileNet 계열: 낮은 GFLOPs와 적은 가중치로 **경량화**에 유리",
      "EfficientNet 계열: 정확도 대비 효율이 높지만 상위 모델은 큰 해상도와 높은 연산량 요구",
    ],
    table: {
      title: "ImageNet-1K 기준 (TorchVision 사전학습 가중치)",
      headers: ["모델", "Top-1 (%)", "Top-5 (%)", "가중치 (M)", "GFLOPs", "해상도"],
      rows: [
        ["AlexNet", "56.52", "79.07", "61.1", "0.71", "224"],
        ["VGG-16", "71.59", "90.38", "138.4", "15.47", "224"],
        ["GoogLeNet", "69.78", "89.53", "6.6", "1.50", "224"],
        ["ResNet-50 (V2)", "80.86", "95.43", "25.6", "4.09", "224"],
        ["DenseNet-121", "74.43", "91.97", "8.0", "2.83", "224"],
        ["MobileNetV3-Large (V2)", "75.27", "92.57", "5.5", "0.22", "224"],
        ["EfficientNet-B0", "77.69", "93.53", "5.3", "0.39", "224"],
        ["EfficientNet-B4", "83.38", "96.59", "19.3", "4.39", "380"],
        ["ConvNeXt-Tiny", "82.52", "96.15", "28.6", "4.46", "224"],
        ["EfficientNetV2-L", "85.81", "97.79", "118.5", "56.08", "480"],
      ],
    },
  },
];
