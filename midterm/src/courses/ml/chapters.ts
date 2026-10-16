import type { Chapter } from "@/lib/types";

export const CHAPTERS: Chapter[] = [
  { id: "intro", title: "기계학습의 의미와 종류", en: "Introduction to Machine Learning", source: "ML-1 기계학습의 소개", blurb: "전통적 프로그래밍과의 차이, 귀납적 학습, 오컴의 면도날, 지도·비지도·강화·준지도·자기지도 학습" },
  { id: "cls", title: "분류와 성능 평가", en: "Classification & Evaluation", source: "ML-2 분류", blurb: "훈련·검증·테스트 데이터, 과적합·부적합, k-겹 교차검증, 불균형 데이터·SMOTE, 혼동행렬·정밀도·재현율·F1·ROC·AUC" },
  { id: "unsup", title: "비지도학습과 준지도학습", en: "Unsupervised & Semi-supervised Learning", source: "ML-3 비지도학습, 반지도학습", blurb: "계층적 군집화·k-means·DBSCAN, 밀도 추정·GMM, 차원 축소·PCA·t-SNE, 이상치 탐지·IQR, 준지도 학습의 가정" },
  { id: "regrec", title: "회귀와 추천", en: "Regression & Recommendation", source: "ML-04 회귀, 추천", blurb: "MSE·경사 하강법, 편향-분산 트레이드오프, 내용 기반 추천·협력 필터링·은닉 요소 모델" },
  { id: "clsm", title: "분류 기법", en: "Classification Methods", source: "ML-05 분류 기법 (kNN · 베이즈 · LDA · 결정트리 · 로지스틱 회귀)", blurb: "kNN·거리 척도, 단순 베이즈, 판별·생성 모델, LDA, 엔트로피·정보이득·지니, 가지치기, 결정트리 회귀, 로지스틱 회귀" },
  { id: "ens", title: "앙상블 학습", en: "Ensemble Learning", source: "ML-6 앙상블 학습", blurb: "붓스트랩, 배깅·랜덤 포리스트, 스태킹, 부스팅 — AdaBoost·Gradient Boosting·XGBoost·LightGBM·CatBoost" },
  { id: "regt", title: "회귀 기법", en: "Regression Techniques", source: "ML-7 회귀 기법", blurb: "결정계수 R², 릿지·라쏘·일래스틱 넷, RANSAC, 이소토닉 회귀, 다항 회귀, SVR, 공선성·VIF" },
  { id: "nn1", title: "신경망 I", en: "Neural Networks I", source: "ML-8 신경망 - I", blurb: "신경세포, 퍼셉트론과 XOR, 다층 퍼셉트론, 활성화 함수, 미분·연쇄 법칙·그레디언트, 오차 역전파" },
  { id: "nn2", title: "신경망 II", en: "Neural Networks II", source: "ML-8 신경망 - II", blurb: "이진·다부류·다중레이블 분류, 정수·one-hot 인코딩, MSE·교차 엔트로피, 소프트맥스" },
  { id: "dl", title: "딥러닝", en: "Deep Learning I", source: "ML-9 딥러닝 - I", blurb: "기울기 소멸과 ReLU, 가중치 초기화(Xavier·He), 규제화·드롭아웃·배치 정규화, 미니배치, 옵티마이저(모멘텀·Adagrad·RMSprop·Adam)" },
  { id: "cnn", title: "CNN", en: "Convolutional Neural Networks", source: "ML-9 딥러닝 - CNN", blurb: "컨볼루션·스트라이드·패딩·특징지도, 여러 컨볼루션, 풀링, CNN 구조와 파라미터 수, 자동 미분" },
  { id: "cnnm", title: "CNN 모델", en: "CNN Models", source: "ML-9 CNN 모델", blurb: "LeNet·AlexNet·VGGNet(3×3)·GoogleNet(인셉션·1×1)·ResNet(잔차·지름길)·DenseNet·DPN·SENet·MobileNet(깊이별 분할)·ShuffleNet·EfficientNet·ConvNeXt, Top-1·Top-5" },
];
