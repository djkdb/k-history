import type { Question } from "@/lib/types";

/** ML-9 CNN 모델 — 강의 내용으로 만든 추가 문제. ⚠️ id 는 기록 열쇠다. 바꾸지 말 것. */
export const QUESTIONS_5: Question[] = [
  // lenet-alexnet
  { kind: "mc", id: "ml-q-cnm-1", concept: "lenet-alexnet", q: "ReLU 활성화 함수를 사용한 첫 CNN 모델은?", options: ["LeNet", "AlexNet", "VGGNet", "GoogleNet"], answer: 1, explain: "AlexNet이 ReLU를 처음 썼다. LeNet은 시그모이드." },
  { kind: "ox", id: "ml-q-cnm-2", concept: "lenet-alexnet", q: "LeNet5는 32×32 필기체 숫자 영상(MNIST)을 입력으로 하고 시그모이드 활성화 함수를 쓴다.", answer: true, explain: "Yann LeCun 등(1998), 오차율 0.95%." },
  { kind: "mc", id: "ml-q-cnm-3", concept: "lenet-alexnet", q: "AlexNet의 특징이 아닌 것은?", options: ["8계층 구조", "FC 층에 드롭아웃", "최대값 풀링", "인셉션 모듈"], answer: 3, explain: "인셉션 모듈은 GoogleNet." },
  // vggnet
  { kind: "short", id: "ml-q-cnm-4", concept: "vggnet", q: "3×3 필터를 3번 쌓으면 몇×몇 필터 하나를 적용한 효과와 같은가? (n×n)", answers: ["7x7", "7×7", "7"], explain: "2번 = 5×5, 3번 = 7×7.", hint: "n×n" },
  { kind: "mc", id: "ml-q-cnm-5", concept: "vggnet", q: "3×3 필터 3번과 7×7 필터 1번의 가중치 수(채널 하나 기준)는?", options: ["27 vs 49", "9 vs 49", "27 vs 21", "21 vs 49"], answer: 0, explain: "3 × 9 = 27, 7 × 7 = 49. 가중치는 적고 ReLU는 3번 들어가 더 복잡한 결정경계를 표현한다." },
  { kind: "ox", id: "ml-q-cnm-6", concept: "vggnet", q: "VGGNet은 2014년 ILSVRC에서 우승했다.", answer: false, explain: "2등(상위-5 오류율 7.32%). 우승은 GoogleNet(6.67%)." },
  // googlenet
  { kind: "mc", id: "ml-q-cnm-7", concept: "googlenet", q: "인셉션 모듈이 직전 층 결과에 동시에 적용하는 것은?", options: ["1×1·3×3·5×5 컨볼루션", "3×3 컨볼루션만", "잔차 연결", "채널 섞기"], answer: 0, explain: "여러 크기의 수용장에서 특징을 동시에 뽑는다." },
  { kind: "short", id: "ml-q-cnm-8", concept: "googlenet", q: "224×224×500 특징지도에 1×1×500 필터 120개를 적용하면 출력의 채널 수는?", answers: ["120"], explain: "1×1 컨볼루션은 공간 크기를 유지하고 필터 수만큼 채널을 만든다 → 224×224×120.", hint: "숫자만" },
  { kind: "mc", id: "ml-q-cnm-9", concept: "googlenet", q: "GoogleNet이 기울기 소멸을 완화하려고 넣은 장치는?", options: ["드롭아웃", "4번째·7번째 계층의 보조 분류기", "배치 정규화", "잔차 모듈"], answer: 1, explain: "보조 분류기가 중간 계층에 그레디언트 정보를 준다." },
  // resnet
  { kind: "mc", id: "ml-q-cnm-10", concept: "resnet", q: "ResNet 잔차 모듈의 출력 식은?", options: ["y = F(x)", "y = F(x) + x", "y = F(x) · x", "y = x − F(x)"], answer: 1, explain: "지름길 연결(항등 사상)로 입력 x를 더한다: y = W₂ρ(W₁x) + x." },
  { kind: "short", id: "ml-q-cnm-11", concept: "resnet", q: "2015년 ILSVRC에서 우승한 ResNet의 층 수는?", answers: ["152"], explain: "상위-5 오류율 3.75%.", hint: "숫자만" },
  { kind: "ox", id: "ml-q-cnm-12", concept: "resnet", q: "잔차 모듈에서 기대 출력과 비슷한 입력이 들어오면 F(x)는 영벡터에 가까운 값을 학습한다.", answer: true, explain: "그래서 입력의 작은 변화에 민감해진다(잔차 학습)." },
  // densenet-dpn
  { kind: "mc", id: "ml-q-cnm-13", concept: "densenet-dpn", q: "DenseNet의 전이층(transition layer) 구성은?", options: ["1×1 컨볼루션 + 평균값 풀링", "3×3 컨볼루션 + 최대값 풀링", "SE 블록", "보조 분류기"], answer: 0, explain: "밀집 블록 사이에서 특징지도 크기를 줄인다." },
  { kind: "mc", id: "ml-q-cnm-14", concept: "densenet-dpn", q: "ResNet과 DenseNet을 결합한 모델은?", options: ["SENet", "DPN", "ShuffleNet", "ConvNeXt"], answer: 1, explain: "Dual Path Network — 마이크로 블록에서 두 특징을 결합." },
  // senet
  { kind: "mc", id: "ml-q-cnm-15", concept: "senet", q: "SE 블록의 압축(squeeze) 연산은?", options: ["전역 평균 풀링으로 채널별 통계량 계산", "1×1 컨볼루션으로 채널 축소", "최대값 풀링", "채널 섞기"], answer: 0, explain: "흥분(excitation)이 그 값으로 채널별 가중치를 만든다(self-gating)." },
  { kind: "ox", id: "ml-q-cnm-16", concept: "senet", q: "SE 블록은 기존 CNN 모델에 끼워 넣어 쓸 수 있다.", answer: true, explain: "2017년 ILSVRC 우승 모델 SENet." },
  // mobilenet
  { kind: "mc", id: "ml-q-cnm-17", concept: "mobilenet", q: "깊이별 분할 컨볼루션의 계산 비용은? (D_K 커널, M 입력·N 출력 채널, D_F 특징지도 크기)", options: ["D_K·D_K·M·N·D_F·D_F", "D_K·D_K·M·D_F·D_F + M·N·D_F·D_F", "M·N·D_F·D_F", "D_K·D_K·N·D_F·D_F"], answer: 1, explain: "깊이별(채널마다 D_K×D_K) + 위치별(1×1로 M→N)." },
  { kind: "mc", id: "ml-q-cnm-18", concept: "mobilenet", q: "ShuffleNet이 쓰는 연산 두 가지는?", options: ["위치별 집단 컨볼루션 + 채널 섞기", "인셉션 + 보조 분류기", "잔차 + 밀집 연결", "패치 분할 + GELU"], answer: 0, explain: "모바일 단말용 — 정확도를 유지하며 계산 비용 축소." },
  // efficientnet-convnext
  { kind: "mc", id: "ml-q-cnm-19", concept: "efficientnet-convnext", q: "EfficientNet의 복합 스케일링이 함께 키우는 세 가지가 아닌 것은?", options: ["깊이", "너비", "입력 해상도", "학습률"], answer: 3, explain: "깊이 α^φ, 너비 β^φ, 해상도 γ^φ (α·β²·γ² ≈ 2)." },
  { kind: "ox", id: "ml-q-cnm-20", concept: "efficientnet-convnext", q: "역병목(inverted bottleneck) 구조는 채널 수를 줄였다가 다시 늘린다.", answer: false, explain: "반대 — 늘렸다가(MBConv 6배, ConvNeXt 4배) 줄인다." },
  { kind: "mc", id: "ml-q-cnm-21", concept: "efficientnet-convnext", q: "ConvNeXt가 ResNet의 ReLU·배치 정규화 대신 쓴 것은?", options: ["GELU·층 정규화", "시그모이드·드롭아웃", "tanh·L2 정규화", "소프트맥스·배치 정규화"], answer: 0, explain: "비전 트랜스포머의 설계를 CNN에 적용." },
  // cnn-model-compare
  { kind: "mc", id: "ml-q-cnm-22", concept: "cnn-model-compare", q: "Top-5 정확도의 뜻은?", options: ["상위 5개 클래스 안에 정답이 있는 비율", "5번 시도 중 맞힌 비율", "상위 5% 데이터의 정확도", "5개 모델의 평균 정확도"], answer: 0, explain: "Top-1은 가장 높은 확률을 준 클래스가 정답인 비율." },
  { kind: "mc", id: "ml-q-cnm-23", concept: "cnn-model-compare", q: "강의 성능 표에서 GFLOPs가 가장 낮은(가장 가벼운) 모델은?", options: ["AlexNet", "MobileNetV3-Large", "EfficientNet-B0", "GoogLeNet"], answer: 1, explain: "MobileNetV3-Large 0.22, EfficientNet-B0 0.39, AlexNet 0.71, GoogLeNet 1.50." },
];
