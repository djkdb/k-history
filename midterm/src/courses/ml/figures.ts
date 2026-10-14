import type { Figure } from "@/lib/types";

/** 곡선을 점으로 — 그림용 */
const curve = (f: (x: number) => number, a: number, b: number, n = 40): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const x = a + ((b - a) * i) / n;
    return [x, f(x)];
  });

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const H2 = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));

/** 머신러닝 그림 — 개념 id → 그림들 */
export const FIGURES: Record<string, Figure[]> = {
  "ml-vs-programming": [
    {
      kind: "graph",
      title: "규칙을 사람이 짜나, 데이터에서 배우나",
      caption: "전통: 사람이 만든 규칙으로 결과를 낸다. 기계학습: 데이터와 **정답**으로 규칙(모델)을 자동으로 만든다.",
      w: 340,
      h: 172,
      nodes: [
        { id: "t", label: "전통적 프로그래밍", x: 170, y: 12, w: 140, h: 16, shape: "text" },
        { id: "d1", label: "데이터", x: 45, y: 36, w: 72, h: 26 },
        { id: "r1", label: "규칙 (사람)", x: 45, y: 68, w: 72, h: 26, tone: "amber" },
        { id: "c1", label: "컴퓨터", x: 170, y: 52, w: 80, h: 34 },
        { id: "o1", label: "결과", x: 290, y: 52, w: 70, h: 34, tone: "emerald" },
        { id: "m", label: "기계학습", x: 170, y: 100, w: 140, h: 16, shape: "text" },
        { id: "d2", label: "데이터", x: 45, y: 124, w: 72, h: 26 },
        { id: "a2", label: "정답", x: 45, y: 156, w: 72, h: 26, tone: "emerald" },
        { id: "c2", label: "학습 알고리즘", x: 170, y: 140, w: 96, h: 34 },
        { id: "o2", label: "모델 (규칙)", x: 290, y: 140, w: 80, h: 34, tone: "indigo" },
      ],
      edges: [
        { from: "d1", to: "c1" },
        { from: "r1", to: "c1" },
        { from: "c1", to: "o1" },
        { from: "d2", to: "c2" },
        { from: "a2", to: "c2" },
        { from: "c2", to: "o2" },
      ],
    },
  ],
  "data-split": [
    {
      kind: "fields",
      title: "데이터를 셋으로 — 겹치지 않게",
      caption: "칸 너비(비율)는 그림을 위한 예시. 테스트 데이터는 **학습에 쓰지 않은** 데이터라야 일반화를 잴 수 있다.",
      rows: [
        {
          fields: [
            { text: "훈련", sub: "모델 학습", span: 6, tone: "indigo" },
            { text: "검증", sub: "멈출 시점", span: 2, tone: "amber" },
            { text: "테스트", sub: "최종 평가", span: 2, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "over-underfit": [
    {
      kind: "plot",
      title: "조기 종료 — 검증 오류가 다시 오르는 순간 멈춘다",
      x: "학습 진행 (epoch) →",
      y: "오류",
      xr: [0, 10],
      yr: [0, 1.2],
      series: [
        { label: "학습 오류", tone: "indigo", pts: curve((x) => 0.05 + 0.85 * Math.exp(-0.45 * x), 0, 10) },
        { label: "검증 오류", tone: "rose", pts: curve((x) => 0.18 + 0.75 * Math.exp(-0.5 * x) + 0.012 * x * x, 0, 9.2) },
      ],
      vlines: [{ x: 3, label: "여기서 멈춤", tone: "emerald" }],
      notes: [
        { x: 1.6, y: 0.3, text: "부적합", tone: "amber" },
        { x: 8.3, y: 0.55, text: "과적합", tone: "rose" },
      ],
    },
  ],
  "accuracy-cv": [
    {
      kind: "grid",
      title: "5-겹 교차검증",
      caption: "각 묶음이 **한 번씩** 테스트가 되고, 다섯 성능의 **평균**이 최종 평가. k = n이면 Leave-One-Out.",
      cols: ["묶음1", "묶음2", "묶음3", "묶음4", "묶음5"],
      rows: ["1회", "2회", "3회", "4회", "5회"],
      cells: [0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => (r === c ? "테스트" : "학습"))),
      marks: [0, 1, 2, 3, 4].map((i) => ({ r: i, c: i, tone: "emerald" as const })),
    },
  ],
  "confusion-metrics": [
    {
      kind: "grid",
      title: "혼동행렬 (강의 예: 100개)",
      caption: "재현율 = TP/(TP+FN) = 40/50 = **0.8** (실제 P 줄) · 정밀도 = TP/(TP+FP) = 40/55 ≈ **0.727** (예측 P 열) · 특이도 = TN/(TN+FP) = 35/50 = **0.7** · 정확도 = 75/100.",
      cols: ["예측 P", "예측 N"],
      rows: ["실제 P", "실제 N"],
      cells: [
        ["**TP** 40", "**FN** 10 (2종 오류)"],
        ["**FP** 15 (1종 오류)", "**TN** 35"],
      ],
      marks: [
        { r: 0, c: 0, tone: "emerald" },
        { r: 1, c: 1, tone: "emerald" },
        { r: 1, c: 0, tone: "rose" },
        { r: 0, c: 1, tone: "amber" },
      ],
    },
  ],
  "roc-auc": [
    {
      kind: "plot",
      title: "ROC 곡선 — 왼쪽 위로 붙을수록 좋다",
      caption: "임계값을 낮추면 양성 판정이 늘어 점이 **오른쪽 위**로 간다. 곡선 아래 면적 = AUC (1 완벽, 0.5 무작위).",
      x: "FPR (1 − 특이도)",
      y: "TPR (민감도)",
      xr: [0, 1],
      yr: [0, 1],
      xticks: [0, 0.5, 1],
      yticks: [0, 0.5, 1],
      series: [
        { label: "좋은 분류기", tone: "indigo", pts: [[0, 0], [0.05, 0.42], [0.15, 0.67], [0.3, 0.82], [0.5, 0.91], [0.75, 0.97], [1, 1]] },
        { label: "무작위 (AUC 0.5)", tone: "zinc", dashed: true, pts: [[0, 0], [1, 1]] },
      ],
      notes: [{ x: 0.3, y: 0.58, text: "AUC = 아래 면적", tone: "indigo" }],
    },
  ],
  kmeans: [
    {
      kind: "plot",
      title: "k-means (k = 3) — 가장 가까운 중심에 배정",
      caption: "배정 → 군집 평균으로 중심 이동을 **배정이 바뀌지 않을 때까지** 반복. k는 미리 정하고, 초기 중심에 민감(→ k-means++).",
      xr: [0, 10],
      yr: [0, 10],
      series: [
        { tone: "indigo", dots: true, pts: [[1.5, 7.5], [2.2, 8.4], [2.8, 7.1], [1.8, 6.6], [3.0, 8.2]] },
        { tone: "emerald", dots: true, pts: [[6.8, 7.9], [7.6, 8.6], [8.1, 7.4], [7.2, 6.9], [8.6, 8.2]] },
        { tone: "amber", dots: true, pts: [[4.4, 2.2], [5.2, 3.1], [5.9, 2.0], [4.8, 1.4], [6.1, 2.8]] },
      ],
      notes: [
        { x: 2.26, y: 7.56, text: "✕", tone: "indigo" },
        { x: 7.66, y: 7.8, text: "✕", tone: "emerald" },
        { x: 5.28, y: 2.3, text: "✕", tone: "amber" },
        { x: 5.2, y: 9.3, text: "✕ = 군집 중심 (평균)" },
      ],
    },
  ],
  dbscan: [
    {
      kind: "plot",
      title: "DBSCAN — 밀도로 이어 붙인다",
      caption: "반경 Eps 안에 MinPts 이상 이웃이 있으면 핵심점, 그 가장자리는 경계점, 어디에도 안 붙으면 **잡음**. 군집 수를 정하지 않고 휜 모양도 찾는다.",
      xr: [0, 10],
      yr: [0, 10],
      series: [
        { label: "핵심점", tone: "indigo", dots: true, pts: [[1.5, 6], [2.2, 7.2], [3.2, 8], [4.4, 8.2], [5.6, 7.8], [6.5, 6.9], [7.1, 5.8]] },
        { label: "경계점", tone: "amber", dots: true, pts: [[1.1, 4.9], [7.6, 4.8]] },
        { label: "핵심점(군집 2)", tone: "emerald", dots: true, pts: [[3.2, 2.2], [4.2, 1.6], [5.2, 2.0], [4.4, 2.8]] },
        { label: "잡음", tone: "rose", dots: true, pts: [[8.8, 9.2], [9.1, 1.4]] },
      ],
    },
  ],
  pca: [
    {
      kind: "plot",
      title: "주성분 = 분산이 가장 큰 방향",
      caption: "평균을 원점으로 옮긴 뒤 **공분산 행렬의 고유값이 큰 고유벡터** 방향(PC1)으로 투영하면 정보를 가장 많이 남긴 채 차원을 줄인다.",
      xr: [-5, 5],
      yr: [-4, 4],
      series: [
        { tone: "zinc", dots: true, pts: [[-3.6, -2.4], [-2.8, -1.4], [-2.2, -2.1], [-1.5, -0.6], [-0.8, -1.0], [-0.2, 0.3], [0.5, -0.1], [1.1, 1.0], [1.8, 0.7], [2.4, 1.9], [3.1, 1.5], [3.7, 2.6]] },
        { label: "PC1 (분산 최대)", tone: "indigo", pts: [[-4.2, -2.8], [4.2, 2.8]] },
        { label: "PC2 (직교)", tone: "amber", pts: [[0.8, -1.2], [-0.8, 1.2]] },
      ],
    },
  ],
  outlier: [
    {
      kind: "fields",
      title: "IQR(투키) — 울타리 밖은 이상치",
      caption: "IQR = Q3 − Q1. 하한 = Q1 − 1.5·IQR, 상한 = Q3 + 1.5·IQR. 이 범위를 벗어나면 이상치.",
      rows: [
        {
          fields: [
            { text: "이상치", span: 2, tone: "rose" },
            { text: "하한", sub: "Q1−1.5·IQR", span: 4, tone: "zinc" },
            { text: "Q1", sub: "25%", span: 2, tone: "indigo" },
            { text: "Q2", sub: "중앙값", span: 2, tone: "indigo" },
            { text: "Q3", sub: "75%", span: 2, tone: "indigo" },
            { text: "상한", sub: "Q3+1.5·IQR", span: 4, tone: "zinc" },
            { text: "이상치", span: 2, tone: "rose" },
          ],
        },
      ],
    },
  ],
  "gradient-descent": [
    {
      kind: "plot",
      title: "경사 하강법 — 기울기 반대쪽으로 한 걸음씩",
      caption: "E(w) = (w − 3)², w ← w − η·E′(w), η = 0.3, 시작 0.3 → 1.92 → 2.57 → 2.83 → 2.93 … 최솟값 3에 다가간다(예시).",
      x: "w",
      y: "E(w)",
      xr: [0, 6],
      yr: [0, 9.5],
      xticks: [0, 3, 6],
      series: [
        { tone: "zinc", pts: curve((w) => (w - 3) ** 2, 0, 6) },
        { label: "갱신 경로", tone: "rose", dots: true, line: true, pts: [[0.3, 7.29], [1.92, 1.166], [2.568, 0.187], [2.827, 0.03], [2.931, 0.005]] },
      ],
      notes: [{ x: 3, y: 0.9, text: "최솟값", tone: "emerald" }],
    },
  ],
  "bias-variance": [
    {
      kind: "plot",
      title: "모델 복잡도 ↑ → 편향 ↓ · 분산 ↑",
      caption: "총오차(MSE) = 편향² + 분산 + 잡음. 가운데의 최저점이 균형점 — 왼쪽은 **부적합**, 오른쪽은 **과적합**.",
      x: "모델 복잡도 →",
      y: "오차",
      xr: [0, 10],
      yr: [0, 3.4],
      series: [
        { label: "편향²", tone: "amber", pts: curve((x) => 3 * Math.exp(-0.4 * x), 0, 10) },
        { label: "분산", tone: "sky", pts: curve((x) => 0.08 * Math.exp(0.33 * x), 0, 10) },
        { label: "총오차", tone: "rose", pts: curve((x) => 3 * Math.exp(-0.4 * x) + 0.08 * Math.exp(0.33 * x) + 0.25, 0, 10) },
      ],
      vlines: [{ x: 5.1, label: "균형", tone: "emerald" }],
      notes: [
        { x: 1.4, y: 0.4, text: "부적합", tone: "amber" },
        { x: 8.8, y: 0.4, text: "과적합", tone: "sky" },
      ],
    },
  ],
  knn: [
    {
      kind: "plot",
      title: "kNN (k = 3) — 가까운 셋의 다수결",
      caption: "★ 주변 가장 가까운 3개 중 ●(남색) 2 · ●(주황) 1 → 남색으로 분류. k가 너무 작으면 잡음에 휘둘린다(과적합).",
      xr: [0, 10],
      yr: [0, 10],
      series: [
        { tone: "indigo", dots: true, pts: [[2, 7], [3, 8.2], [4.6, 5.6], [5.3, 6.4], [2.6, 5.4]] },
        { tone: "amber", dots: true, pts: [[6.3, 4.3], [7.5, 3], [8.2, 5.2], [7, 1.8], [8.8, 2.6]] },
      ],
      notes: [{ x: 5.6, y: 5.3, text: "★", tone: "rose" }],
    },
  ],
  "decision-tree": [
    {
      kind: "graph",
      title: "PlayTennis 결정트리",
      caption: "내부 노드 = 비교 속성, 간선 = 속성 값, 단말 = 부류. 규칙으로 읽힌다: IF Outlook = Sunny AND Humidity = High THEN **No**.",
      w: 340,
      h: 176,
      nodes: [
        { id: "o", label: "Outlook", x: 170, y: 22, w: 86, h: 30, tone: "indigo" },
        { id: "h", label: "Humidity", x: 62, y: 90, w: 86, h: 30, tone: "indigo" },
        { id: "y1", label: "Yes", x: 170, y: 90, w: 56, h: 30, shape: "pill", tone: "emerald" },
        { id: "w", label: "Wind", x: 278, y: 90, w: 76, h: 30, tone: "indigo" },
        { id: "n1", label: "No", x: 28, y: 156, w: 48, h: 28, shape: "pill", tone: "rose" },
        { id: "y2", label: "Yes", x: 104, y: 156, w: 48, h: 28, shape: "pill", tone: "emerald" },
        { id: "n2", label: "No", x: 236, y: 156, w: 48, h: 28, shape: "pill", tone: "rose" },
        { id: "y3", label: "Yes", x: 312, y: 156, w: 48, h: 28, shape: "pill", tone: "emerald" },
      ],
      edges: [
        { from: "o", to: "h", label: "Sunny" },
        { from: "o", to: "y1", label: "Overcast" },
        { from: "o", to: "w", label: "Rain" },
        { from: "h", to: "n1", label: "High" },
        { from: "h", to: "y2", label: "Normal" },
        { from: "w", to: "n2", label: "Strong" },
        { from: "w", to: "y3", label: "Weak" },
      ],
    },
  ],
  "entropy-ig": [
    {
      kind: "plot",
      title: "두 부류의 불순도 — 반반일 때 최대",
      caption: "엔트로피는 p = 0.5에서 **1**, 지니(1 − Σp²)는 **0.5**. 한 부류뿐(p = 0, 1)이면 둘 다 0. 분할 뒤 불순도가 많이 줄수록(정보이득 ↑) 좋은 속성.",
      x: "p (한 부류의 비율)",
      xr: [0, 1],
      yr: [0, 1.05],
      xticks: [0, 0.5, 1],
      yticks: [0.5, 1],
      series: [
        { label: "엔트로피 −Σp log₂p", tone: "indigo", pts: curve(H2, 0, 1, 60) },
        { label: "지니 1 − Σp²", tone: "amber", dashed: true, pts: curve((p) => 2 * p * (1 - p), 0, 1, 40) },
      ],
    },
  ],
  logistic: [
    {
      kind: "plot",
      title: "로지스틱(시그모이드) 함수",
      caption: "p = 1/(1 + e^(−θᵀx)) — 선형식 θᵀx를 0~1 확률로 바꾼다. θᵀx = 0이면 p = 0.5.",
      x: "θᵀx",
      y: "p",
      xr: [-6, 6],
      yr: [0, 1],
      xticks: [-6, 0, 6],
      yticks: [0.5, 1],
      series: [{ tone: "indigo", pts: curve(sigmoid, -6, 6) }],
      vlines: [{ x: 0, label: "p = 0.5", tone: "zinc" }],
    },
  ],
  "bagging-rf": [
    {
      kind: "graph",
      title: "배깅 — 붓스트랩마다 독립 학습 후 투표",
      caption: "**병렬** 학습. 분류는 투표, 회귀는 평균. 결정트리로 하면 랜덤 포리스트(노드마다 무작위로 고른 일부 속성 중에서 분할).",
      w: 340,
      h: 180,
      nodes: [
        { id: "d", label: "학습 데이터", x: 50, y: 90, w: 84, h: 34, shape: "db" },
        ...[0, 1, 2].map((i) => ({ id: `b${i}`, label: `붓스트랩 ${i + 1}`, x: 160, y: 30 + i * 60, w: 86, h: 30, tone: "sky" as const })),
        ...[0, 1, 2].map((i) => ({ id: `m${i}`, label: `트리 ${i + 1}`, x: 245, y: 30 + i * 60, w: 56, h: 30, tone: "indigo" as const })),
        { id: "v", label: "투표\n평균", x: 312, y: 90, w: 50, h: 44, tone: "emerald" },
      ],
      edges: [
        ...[0, 1, 2].map((i) => ({ from: "d", to: `b${i}`, label: i === 0 ? "복원추출" : undefined })),
        ...[0, 1, 2].map((i) => ({ from: `b${i}`, to: `m${i}` })),
        ...[0, 1, 2].map((i) => ({ from: `m${i}`, to: "v" })),
      ],
    },
  ],
  "boosting-adaboost": [
    {
      kind: "graph",
      title: "부스팅 — 앞 모델이 틀린 것에 무게를 실어 차례로",
      caption: "**순차** 학습. 앞 모델의 오류 ε로 α를 구하고, 틀린 데이터 가중치 × e^α, 맞힌 것 × e^(−α) 후 정규화. 마지막엔 α로 가중 투표.",
      w: 340,
      h: 120,
      nodes: [
        { id: "m1", label: "모델 1", x: 42, y: 40, w: 66, h: 32, tone: "indigo" },
        { id: "w1", label: "가중치\n갱신", x: 128, y: 40, w: 66, h: 40, tone: "amber" },
        { id: "m2", label: "모델 2", x: 214, y: 40, w: 66, h: 32, tone: "indigo" },
        { id: "w2", label: "…", x: 298, y: 40, w: 52, h: 32 },
        { id: "f", label: "α 가중 투표 → 최종", x: 170, y: 100, w: 150, h: 30, tone: "emerald" },
      ],
      edges: [
        { from: "m1", to: "w1" },
        { from: "w1", to: "m2" },
        { from: "m2", to: "w2" },
        { from: "m1", to: "f", dashed: true },
        { from: "m2", to: "f", dashed: true },
      ],
    },
  ],
  stacking: [
    {
      kind: "graph",
      title: "스태킹 — 예측값을 입력으로 받는 메타 학습기",
      w: 340,
      h: 150,
      nodes: [
        { id: "a", label: "kNN", x: 50, y: 28, w: 76, h: 30, tone: "sky" },
        { id: "b", label: "결정트리", x: 50, y: 75, w: 76, h: 30, tone: "sky" },
        { id: "c", label: "로지스틱", x: 50, y: 122, w: 76, h: 30, tone: "sky" },
        { id: "p", label: "예측값\n모음", x: 165, y: 75, w: 70, h: 44 },
        { id: "m", label: "메타\n학습기", x: 260, y: 75, w: 70, h: 44, tone: "indigo" },
        { id: "o", label: "최종", x: 318, y: 132, w: 40, h: 26, shape: "pill", tone: "emerald" },
      ],
      edges: [
        { from: "a", to: "p" },
        { from: "b", to: "p" },
        { from: "c", to: "p" },
        { from: "p", to: "m" },
        { from: "m", to: "o" },
      ],
      caption: "기반 모델은 **서로 다른 알고리즘**이어야 효과적(모두 같은 유형 = 흔한 실수). 알고리즘 이름은 예시.",
    },
  ],
  perceptron: [
    {
      kind: "plot",
      title: "AND는 직선 하나로 갈리지만 XOR은 안 된다",
      caption: "초록 = 1, 빨강 = 0. AND는 점선 한 줄로 나뉘지만, XOR의 1들(0,1)·(1,0)은 대각선으로 엇갈려 **어떤 직선으로도** 못 가른다 → 다층 퍼셉트론 필요.",
      xr: [-0.3, 2.9],
      yr: [-0.3, 1.3],
      series: [
        { tone: "rose", dots: true, pts: [[0, 0], [0, 1], [1, 0]] },
        { tone: "emerald", dots: true, pts: [[1, 1]] },
        { tone: "zinc", dashed: true, pts: [[0.3, 1.25], [1.25, 0.3]] },
        { tone: "rose", dots: true, pts: [[1.6, 0], [2.6, 1]] },
        { tone: "emerald", dots: true, pts: [[1.6, 1], [2.6, 0]] },
      ],
      notes: [
        { x: 0.5, y: -0.2, text: "AND" },
        { x: 2.1, y: -0.2, text: "XOR" },
        { x: 2.1, y: 0.5, text: "?", tone: "rose" },
      ],
    },
  ],
  mlp: [
    {
      kind: "graph",
      title: "은닉층 하나로 XOR 풀기",
      caption: "f1 = OR(x1 + x2 − 0.5), f2 = NAND(−x1 − x2 + 1.5), 출력 f3 = AND(f1 + f2 − 1.5) → XOR.",
      w: 340,
      h: 150,
      nodes: [
        { id: "x1", label: "x1", x: 40, y: 40, w: 40, shape: "circle", tone: "sky" },
        { id: "x2", label: "x2", x: 40, y: 110, w: 40, shape: "circle", tone: "sky" },
        { id: "f1", label: "f1\nOR", x: 165, y: 40, w: 48, shape: "circle", tone: "indigo" },
        { id: "f2", label: "f2\nNAND", x: 165, y: 110, w: 48, shape: "circle", tone: "indigo" },
        { id: "f3", label: "f3\nAND", x: 285, y: 75, w: 48, shape: "circle", tone: "emerald" },
        { id: "l1", label: "입력층", x: 40, y: 142, w: 50, h: 14, shape: "text" },
        { id: "l2", label: "은닉층", x: 165, y: 142, w: 50, h: 14, shape: "text" },
        { id: "l3", label: "출력층 = XOR", x: 285, y: 118, w: 80, h: 14, shape: "text" },
      ],
      edges: [
        { from: "x1", to: "f1" },
        { from: "x1", to: "f2" },
        { from: "x2", to: "f1" },
        { from: "x2", to: "f2" },
        { from: "f1", to: "f3" },
        { from: "f2", to: "f3" },
      ],
    },
  ],
  activation: [
    {
      kind: "plot",
      title: "활성화 함수 한눈에",
      caption: "시그모이드 (0, 1) · tanh (−1, 1), 중심 0 · ReLU max(0, x) — 음수면 0.",
      xr: [-4, 4],
      yr: [-1.2, 2.2],
      xticks: [-4, 0, 4],
      yticks: [-1, 0, 1, 2],
      series: [
        { label: "시그모이드", tone: "indigo", pts: curve(sigmoid, -4, 4) },
        { label: "tanh", tone: "amber", pts: curve(Math.tanh, -4, 4) },
        { label: "ReLU", tone: "emerald", pts: [[-4, 0], [0, 0], [2.2, 2.2]] },
      ],
    },
  ],
  "vanishing-gradient": [
    {
      kind: "plot",
      title: "도함수 — 시그모이드는 최대 0.25",
      caption: "역전파 때 층마다 σ′(≤ 0.25)가 곱해져 아래층으로 갈수록 기울기가 사라진다. ReLU의 도함수는 양수 쪽에서 **1**이라 줄지 않는다.",
      xr: [-4, 4],
      yr: [0, 1.15],
      xticks: [-4, 0, 4],
      yticks: [0.25, 1],
      series: [
        { label: "σ′(x) = σ(1 − σ)", tone: "indigo", pts: curve((x) => sigmoid(x) * (1 - sigmoid(x)), -4, 4) },
        { label: "ReLU′", tone: "emerald", pts: [[-4, 0], [0, 0], [0, 1], [4, 1]] },
      ],
    },
    {
      kind: "fields",
      title: "층을 지날 때마다 곱해지면",
      rows: [
        {
          fields: [
            { text: "0.25", sub: "1층", span: 1, tone: "indigo" },
            { text: "0.0625", sub: "2층", span: 1, tone: "sky" },
            { text: "0.0156", sub: "3층", span: 1, tone: "amber" },
            { text: "0.0039", sub: "4층", span: 1, tone: "rose" },
          ],
        },
      ],
    },
  ],
  backprop: [
    {
      kind: "graph",
      title: "순전파로 오차를 구하고, 역전파로 기울기를",
      caption: "출력층 δ에서 시작해 연쇄 법칙으로 **입력층 쪽으로** 전파, 모든 가중치를 w ← w − η·∂E/∂w.",
      w: 340,
      h: 132,
      nodes: [
        { id: "t1", label: "순전파 →", x: 150, y: 12, w: 80, h: 16, shape: "text" },
        { id: "i", label: "입력층", x: 42, y: 48, w: 66, h: 32, tone: "sky" },
        { id: "h", label: "은닉층", x: 135, y: 48, w: 66, h: 32, tone: "indigo" },
        { id: "o", label: "출력층", x: 228, y: 48, w: 66, h: 32, tone: "indigo" },
        { id: "e", label: "오차 E", x: 308, y: 48, w: 54, h: 32, tone: "rose" },
        { id: "t2", label: "← δ 역전파 (연쇄 법칙)", x: 150, y: 120, w: 160, h: 16, shape: "text" },
      ],
      edges: [
        { from: "i", to: "h", tone: "indigo" },
        { from: "h", to: "o", tone: "indigo" },
        { from: "o", to: "e", tone: "indigo" },
        { from: "e", to: "o", tone: "rose", dashed: true, bend: -46 },
        { from: "o", to: "h", tone: "rose", dashed: true, bend: -46 },
        { from: "h", to: "i", tone: "rose", dashed: true, bend: -46 },
      ],
    },
  ],
  softmax: [
    {
      kind: "bars",
      title: "소프트맥스 — 점수를 확률로 (예: z = 2.0, 1.0, 0.1)",
      caption: "yₖ = e^zₖ / Σe^zᵢ → 모두 0 이상, **합 1**. 가장 큰 확률(클래스 A)이 예측.",
      items: [
        { label: "클래스 A (z 2.0)", value: 0.659, tone: "emerald", text: "0.659" },
        { label: "클래스 B (z 1.0)", value: 0.242, tone: "indigo", text: "0.242" },
        { label: "클래스 C (z 0.1)", value: 0.099, tone: "zinc", text: "0.099" },
      ],
    },
  ],
  "regularization-dropout": [
    {
      kind: "graph",
      title: "드롭아웃 — 학습 때만 노드를 무작위로 끈다",
      caption: "미니배치·에포크마다 새로 고른다. **추론할 때는 모든 노드**를 쓴다.",
      w: 340,
      h: 150,
      nodes: [
        ...[0, 1, 2].map((i) => ({ id: `a${i}`, label: "", x: 50, y: 30 + i * 45, w: 30, shape: "circle" as const, tone: "sky" as const })),
        ...[0, 1, 2, 3].map((i) => ({
          id: `b${i}`,
          label: i === 1 || i === 3 ? "✕" : "",
          x: 170,
          y: 20 + i * 37,
          w: 30,
          shape: "circle" as const,
          tone: i === 1 || i === 3 ? ("rose" as const) : ("indigo" as const),
        })),
        ...[0, 1].map((i) => ({ id: `c${i}`, label: "", x: 290, y: 52 + i * 45, w: 30, shape: "circle" as const, tone: "emerald" as const })),
      ],
      edges: [
        ...[0, 1, 2].flatMap((i) => [0, 2].map((j) => ({ from: `a${i}`, to: `b${j}`, plain: true }))),
        ...[0, 2].flatMap((i) => [0, 1].map((j) => ({ from: `b${i}`, to: `c${j}`, plain: true }))),
      ],
    },
  ],
  minibatch: [
    {
      kind: "fields",
      title: "가중치를 언제 고치나",
      caption: "SGD는 하나마다(변동 큼), 배치는 전체 평균으로 한 번(느림), 미니배치는 일정 개수(예: 32)씩 — 과적합 완화에도 도움.",
      rows: [
        { label: "확률적 (SGD)", fields: Array.from({ length: 12 }, () => ({ text: "1", span: 1, tone: "rose" as const })) },
        { label: "미니배치", fields: Array.from({ length: 4 }, () => ({ text: "32", span: 3, tone: "emerald" as const })) },
        { label: "배치", fields: [{ text: "전체 데이터", span: 12, tone: "indigo" }] },
      ],
    },
  ],
  convolution: [
    {
      kind: "grid",
      title: "입력 4×4 — 왼쪽 위 3×3에 필터를 겹친다 (예시)",
      cells: [
        ["1", "2", "0", "1"],
        ["0", "1", "3", "1"],
        ["2", "1", "0", "2"],
        ["1", "0", "1", "1"],
      ],
      marks: [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ r, c, tone: "indigo" as const }))),
      mono: true,
    },
    {
      kind: "grid",
      title: "필터 3×3",
      cells: [
        ["1", "0", "1"],
        ["0", "1", "0"],
        ["1", "0", "1"],
      ],
      mono: true,
    },
    {
      kind: "grid",
      title: "출력 2×2 = (4 + 0 − 3)/1 + 1",
      caption: "겹친 칸끼리 곱해 모두 더한다 — 필터가 1인 다섯 자리의 입력값 1 + 0 + 1 + 2 + 0 = **4**. 한 칸씩(스트라이드 1) 옮겨 나머지 칸을 채운다.",
      cells: [
        ["4", "9"],
        ["6", "3"],
      ],
      marks: [{ r: 0, c: 0, tone: "emerald" }],
      mono: true,
    },
  ],
  pooling: [
    {
      kind: "grid",
      title: "2×2 블록마다 하나로 (예시)",
      cells: [
        ["1", "3", "2", "0"],
        ["4", "2", "1", "5"],
        ["0", "1", "3", "2"],
        ["2", "6", "1", "1"],
      ],
      marks: [
        ...[0, 1].flatMap((r) => [0, 1].map((c) => ({ r, c, tone: "indigo" as const }))),
        ...[0, 1].flatMap((r) => [2, 3].map((c) => ({ r, c, tone: "emerald" as const }))),
        ...[2, 3].flatMap((r) => [0, 1].map((c) => ({ r, c, tone: "amber" as const }))),
        ...[2, 3].flatMap((r) => [2, 3].map((c) => ({ r, c, tone: "rose" as const }))),
      ],
      mono: true,
    },
    {
      kind: "grid",
      title: "최대값 풀링 · 평균값 풀링",
      caption: "크기를 줄이고 위치 변화에 강해진다. 풀링에는 **학습할 파라미터가 없다**.",
      cols: ["최대", "", "평균", ""],
      cells: [
        ["4", "5", "2.5", "2"],
        ["6", "3", "2.25", "1.75"],
      ],
      marks: [
        { r: 0, c: 0, tone: "indigo" },
        { r: 0, c: 1, tone: "emerald" },
        { r: 1, c: 0, tone: "amber" },
        { r: 1, c: 1, tone: "rose" },
        { r: 0, c: 2, tone: "indigo" },
        { r: 0, c: 3, tone: "emerald" },
        { r: 1, c: 2, tone: "amber" },
        { r: 1, c: 3, tone: "rose" },
      ],
      mono: true,
    },
  ],
  "cnn-architecture": [
    {
      kind: "fields",
      title: "CNN의 전형적 구조",
      caption: "앞쪽은 Conv → ReLU → Pool 반복(특징 추출), 뒤쪽은 FC(분류·회귀), 분류면 마지막에 소프트맥스.",
      rows: [
        {
          fields: [
            { text: "Conv", span: 2, tone: "indigo" },
            { text: "ReLU", span: 2, tone: "sky" },
            { text: "Pool", span: 2, tone: "amber" },
            { text: "Conv", span: 2, tone: "indigo" },
            { text: "ReLU", span: 2, tone: "sky" },
            { text: "Pool", span: 2, tone: "amber" },
            { text: "FC", span: 2, tone: "emerald" },
            { text: "SM", span: 2, tone: "rose" },
          ],
        },
        {
          fields: [
            { text: "특징 추출", span: 12, tone: "zinc" },
            { text: "분류", span: 4, tone: "zinc" },
          ],
        },
      ],
    },
  ],
};
