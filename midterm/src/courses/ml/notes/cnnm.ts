import type { NoteSection } from "@/lib/types";

/** CNN 모델 (ML-9 CNN models) — 물체 인식 CNN 모델들 */
export const CNNM: NoteSection[] = [
  {
    title: "학습 내용",
    lines: [
      "컨볼루션 신경망의 **구조** / 컨볼루션 신경망에서 사용되는 **컨볼루션, 풀링 등의 연산**",
      "물체 인식 CNN 모델: LeNet · AlexNet · VGGNet · GoogleNet · ResNet · ResNeXt · DenseNet · DPN · SENet · MobileNet · ShuffleNet · EfficientNet · ConvNeXt",
      "· ResNeXt는 목록에만 있고 따로 설명한 슬라이드는 없다",
    ],
  },
  {
    title: "1. LeNet 모델",
    en: "LeNet-5",
    lines: [
      "**Yann LeCun** 등의 제안(**1998**)",
      "LeNet5 모델 — **Conv-Pool-Conv-Pool-Conv-FC-FC(SM)**",
      "입력: **32×32** 필기체 숫자 영상 (**MNIST** 데이터)",
      "풀링: **가중치 × (2×2 블록의 합) + 편차항**",
      "**시그모이드** 활성화 함수 사용",
      "성능: 오차율 **0.95%** (정확도 99.05%)",
    ],
  },
  {
    title: "2. AlexNet 모델",
    en: "AlexNet",
    lines: [
      "**8 계층**의 구조 — Conv-Pool-Norm-Conv-Pool-Norm-Conv-Conv-Conv-Pool-FC-FC-FC(SM)",
      "**ReLU 함수를 사용한 첫 모델**",
      "FC 층에 **드롭아웃(dropout)** 기법 사용",
      "**최대값 풀링(max pooling)** 사용",
    ],
  },
  {
    title: "3. VGGNet 모델",
    en: "VGGNet",
    lines: [
      "**사이머니언과 지서만**이 제안(**2014년**) — **VGG-16**(16개 층), **VGG-19**(19개 층)",
      "2014년 ILSVRC에서 **2등** (상위-5 오류율 **7.32%**)",
      "단순한 구조 — **모든 층에서 3×3 필터** 사용",
      "· 그림: VGG-16 구조의 계층별 특징지도",
      "**3×3 필터 2회 적용 ≈ 5×5 필터 적용 효과**, **3×3 필터 3회 적용 ≈ 7×7 필터 적용 효과**",
      "3×3을 3번: **27 가중치** · ReLU 3회 적용 → 복잡한 결정경계 표현 가능 / 7×7 한 번: **49 가중치**",
    ],
  },
  {
    title: "4. GoogleNet 모델",
    en: "GoogleNet",
    lines: [
      "구글의 **체게디** 등이 개발 — 2014년 ILSVRC **우승** (상위-5 오류율 **6.67%**)",
      "**22개 층**: Conv-MPool-Conv-Incept-Incept-MPool-Incept-Incept-Incept-Incept-Incept-MPool-Incept-Incept-APool-FC-SM",
      "· MPool: 최대값 풀링 / APool: 평균값 풀링 / Incept: 인셉션(Inception) 모듈",
      "**인셉션 모듈**: 직전 층의 처리결과에 **1×1, 3×3, 5×5 컨볼루션** 적용 → **여러 크기의 수용장**에 있는 특징들을 **동시 추출**",
      "**1×1 컨볼루션**: 동일한 위치의 특징지도 값을 필터의 가중치와 **선형결합** / 1×1 필터의 **개수로 출력 특징지도 개수 조정**",
      "· 예: **224×224×500 → (1×1×500)@120 → 224×224×120**",
      "마지막 계층: **소프트맥스** — 22개 층 모델이지만, AlexNet 모델에 비해 가중치 개수는 10% 증가(원문 그대로. 성능 표로는 6.6M vs 61.1M, 'AlexNet의 약 10% 수준'으로 읽힌다)",
      "**기울기 소멸 문제 완화 장치**: **4번째, 7번째 계층에 보조 분류기** 추가 → 보조 분류기를 통해 **그레디언트 정보 제공**",
    ],
  },
  {
    title: "5. ResNet 모델",
    en: "ResNet (Residual Net)",
    lines: [
      "**카이밍 허** 등이 개발 — 2015년 ILSVRC **우승** (상위-5 오류율 **3.75%**)",
      "**152개 층**: Conv-Mpool-[Conv-ReLU-Conv-ReLU-Conv-ReLU]**×3**-[…]**×8**-[…]**×36**-[…]**×3**-APool-FC-SM",
      "다수의 층 사용 → 상위 계층에서 **의미있는 특징** 추출 가능 / 그러나 **기울기 소멸 문제** 발생",
      "**잔차 모듈(residual module)**: 기존 신경망 vs ResNet의 잔차 모듈 — **지름길 연결**, **항등 사상**",
      "잔차 모델 F(x)의 학습: **y = F(x) + x = W₂ρ(W₁x) + x**",
      "잔차 모듈의 특징: 기대하는 출력과 유사한 입력이 들어오면 **영벡터에 가까운 값**을 학습 → 입력의 작은 변화에 민감 → **잔차 학습**",
      "**다양한 경로**를 통해 복합적인 특징 추출 — 필요한 출력이 얻어지면 **컨볼루션 층을 건너뛸 수 있음** / 다양한 조합의 특징 추출 가능",
    ],
  },
  {
    title: "6. DenseNet 모델",
    en: "DenseNet",
    lines: [
      "**가오 후앙(Gao Huang)** 등이 개발 (**2016**)",
      "**각 층은 모든 앞 단계에서 올 수 있는 지름길연결** 구성 — 배치 정규화, ReLU, 컨볼루션 연산",
      "노드의 연산 **Hᵢ: 배치 정규화(BN)-ReLU-(3×3 컨볼루션)** — 각 층은 입력 특징지도와 같은 차원의 특징지도 생성",
      "**병목층**: 1×1 컨볼루션 — 출력되는 특징지도의 **채널 수 축소** / 병목층이 있는 층: BN-ReLU-(1×1 conv)-BN-ReLU-(3×3 conv)",
      "특징지도의 크기를 줄이기 위해 **풀링 연산** 적용 필요",
      "**밀집 블록(dense block)** 과 **전이층(transition layer)** 으로 구성 — 전이층: **1×1 컨볼루션 + 평균값 풀링(APool)**",
    ],
  },
  {
    title: "7. DPN 모델",
    en: "DPN (Dual Path Network)",
    lines: [
      "**ResNet과 DenseNet을 결합**한 모델",
      "ResNet: 이전 단계의 동일한 특징 정보가 각 단계에 전달되어 **특징을 재사용**하는 경향 / 이전 특징들로부터 **새로운 특징을 만드는 것에는 소극적**",
      "DenseNet: **새로운 특징이 추출될 가능성이 높음** / 이전에 추출된 특징이 **다시 추출될 가능성도 높음**",
      "**마이크로 블록**에서 DenseNet과 ResNet의 특징 결합",
    ],
  },
  {
    title: "8. SENet 모델",
    en: "SENet (Squeeze and excitation networks)",
    lines: [
      "**SE 블록** 사용 — **채널 간의 상호 의존성**을 모델링하여 **채널별 특징 반응**을 적응적으로 재조정",
      "**2017년 ILSVRC 우승** 모델",
      "**압축(squeeze)** 연산: 채널별 통계량 계산을 위해 **전역 평균 풀링(global average pooling)** 수행",
      "**흥분(excitation)** 연산: 임베딩을 입력으로 가져와서 **채널별로 변경된 가중치**들을 생성하는 **self-gating mechanism** (ReLU, sigmoid)",
      "CNN 모델에 SE 블록 삽입 형태 — **기존 모델에 추가하여 사용**",
    ],
  },
  {
    title: "9. MobileNet 모델",
    en: "MobileNet",
    lines: [
      "**컴퓨팅 자원 제약**이 있는 환경을 위한 CNN 모델",
      "**깊이별 분할 컨볼루션(Depthwise separable convolution)** = **깊이별 컨볼루션(depthwise)** + **위치별 컨볼루션(pointwise)**",
      "· 그림: 일반 컨볼루션 vs 깊이별 컨볼루션 — 깊이별은 채널마다 따로 필터 하나",
      "계산 비용 — 입력 D_F×D_F×M 특징지도 F, 출력 D_F×D_F×N 특징지도 G (D_F 폭·높이, M 입력 깊이, N 출력 깊이)",
      "**표준 컨볼루션 층**: 커널 차원 D_K×D_K×M×N, 계산 비용 **D_K·D_K·M·N·D_F·D_F**",
      "**깊이별 분할 컨볼루션**: 계산 비용 **D_K·D_K·M·D_F·D_F + M·N·D_F·D_F**",
      "BN과 ReLU를 포함한 블록: 일반 = 3×3 Conv-BN-ReLU / 깊이별 분할 = 3×3 Depthwise Conv-BN-ReLU-1×1 Conv-BN-ReLU",
    ],
  },
  {
    title: "10. ShuffleNet 모델",
    en: "ShuffleNet",
    lines: [
      "컴퓨팅 자원 제약이 있는 **모바일 단말기**를 위한 모델",
      "**정확도 유지 및 계산 비용 축소**",
      "**위치별 집단 컨볼루션(pointwise group convolution)** 과 **채널 섞기(channel shuffle)** 연산 사용",
    ],
  },
  {
    title: "11. EfficientNet",
    en: "EfficientNet (2019)",
    lines: [
      "신경망의 규모를 **체계적으로 확장** — **깊이**(층의 수), **너비**(각 층의 채널 수), **입력 해상도**(입력 영상의 크기)",
      "**복합 스케일링(compound scaling)**: 복합 계수 φ → 깊이는 **α^φ**배, 너비는 **β^φ**배, 해상도 **γ^φ**배로 확장, **α·β²·γ² ≈ 2**",
      "**EfficientNet-B0**: **신경망 구조 탐색(NAS)** 을 통해서 설계된 기본 모델",
      "**MBConv(Mobile Inverted Bottleneck Convolution)** 블록: 1×1 컨볼루션(입력 채널의 **6배** 확대) → 3×3 깊이별 컨볼루션 → **SE 모듈**",
      "**역병목(inverted bottleneck)** 구조: 채널 개수를 **확대했다가 축소** / SE 모듈: 채널별 중요도를 학습하여 특징 재조정",
    ],
  },
  {
    title: "12. ConvNeXt",
    en: "ConvNeXt (2022)",
    lines: [
      "**비전 트랜스포머(vision transformer)의 설계 원리**를 기존 컨볼루션 신경망에 적용하여 성능 개선",
      "**ResNet-50에서 출발**하여 비전 트랜스포머의 설계 방식을 단계적으로 적용",
      "ConvNeXt-T(Tiny): **패치 분할(patchify)** = 4×4 컨볼루션/4 스트라이드 · **4개 스테이지**별 동일 구조 블록 반복",
      "다운샘플링 층: 스테이지 사이 — 특징 맵 가로/세로 각각 **1/2**, 채널 수 **2배** (96→192→384→768)",
      "블록 핵심 연산: **7×7 깊이별 컨볼루션** / 1×1 컨볼루션 2개로 채널 **4배 확대 → 복구**(역병목, 완전 연결층으로 대체 가능) / **지름길 연결**",
      "**ReLU와 배치 정규화 → GELU와 층 정규화(Layer Normalization)**",
      "계산 효율성과 계층적 특징 추출 구조 — CNN의 성능 개선, 비전 트랜스포머와의 경쟁력 입증 / 영상 분류·물체 검출·의미 분할의 **백본(backbone)** 모델",
    ],
  },
  {
    title: "모델별 성능 비교",
    lines: [
      "**Top-1 Accuracy**: 모델이 가장 높은 확률을 부여한 클래스가 정답인 비율 — **T1-accuracy = (1순위 예측이 정답인 데이터 개수 / 전체 데이터 개수) × 100**",
      "**Top-5 Accuracy**: 가장 높은 확률을 부여한 **상위 5개 클래스 안에 정답이 포함**된 비율",
      "비교 기준: 정확도, **가중치 개수**, **GFlops**, **입력 해상도**",
      "표(ImageNet-1K, TorchVision 사전학습 가중치): AlexNet 56.52/79.07, 61.1M, 0.71 · VGG-16 71.59/90.38, 138.4M, 15.47 · GoogLeNet 69.78/89.53, 6.6M, 1.50 · ResNet-50(V2) 80.86/95.43, 25.6M, 4.09 · DenseNet-121 74.43/91.97, 8.0M, 2.83",
      "· MobileNetV3-Large 75.27/92.57, 5.5M, 0.22 · EfficientNet-B0 77.69/93.53, 5.3M, 0.39 · EfficientNet-B4 83.38/96.59, 19.3M, 4.39(380×380) · ConvNeXt-Tiny 82.52/96.15, 28.6M, 4.46 · EfficientNetV2-L 85.81/97.79, 118.5M, 56.08(480×480)",
      "핵심 해석: ① AlexNet → ResNet → EfficientNet/ConvNeXt로 갈수록 Top-1 정확도 크게 향상 ② 정확도가 높아질수록 GFLOPs와 입력 해상도도 증가하는 경향 ③ MobileNet 계열은 낮은 GFLOPs·적은 가중치로 경량화에 유리 ④ EfficientNet 계열은 정확도 대비 효율이 높지만 상위 모델은 큰 해상도와 높은 연산량 요구",
    ],
  },
];
