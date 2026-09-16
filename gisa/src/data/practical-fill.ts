import type { PracticalQuestion } from "@/lib/types";

/**
 * 실기 문항이 하나도 없던 개념을 채운다.
 *
 * 실기를 고른 사람에게 "이 개념은 실기에도 나옵니다" 라고 띄워 놓고 정작
 * 적어 볼 문항을 한 개도 주지 않으면, 그 개념은 읽고 끝난다. 실기는 고르는
 * 시험이 아니라 적는 시험이라 읽은 것과 쓸 수 있는 것의 차이가 크다.
 *
 * 다섯 개념이 그랬다 — 생명 주기 모형, 탐색과 해싱, 키의 종류, 이상 현상,
 * 개발 방법론. 모두 출제기준에 든 범위이고, 여기 문항은 그 범위에서 직접
 * 지어 쓴 것이다. 어느 회차 몇 번이라는 표시는 붙이지 않는다 — 한국산업
 * 인력공단은 기출 문제를 공개하지 않으므로, 그렇게 적으면 거짓이 된다.
 */
export const PRACTICAL_FILL: PracticalQuestion[] = [
  /* ── 소프트웨어 생명 주기 모형 ── */
  {
    id: "pf-spiral-steps",
    subject: "design",
    sourceId: "d-sdlc",
    kind: "blank",
    question:
      "나선형(Spiral) 모형은 ( ① ) → ( ② ) → 개발 및 검증 → ( ③ ) 을 한 바퀴로 보고 이를 여러 번 되풀이한다. ①~③에 들어갈 단계를 쓰시오.",
    answers: [
      "① 계획 및 정의 ② 위험 분석 ③ 고객 평가",
      "계획, 위험 분석, 고객 평가",
      "계획 및 정의, 위험 분석, 고객 평가",
      "① 계획 ② 위험 분석 ③ 고객 평가",
    ],
    points: 5,
    explanation:
      "계획 및 정의 → 위험 분석 → 개발 및 검증 → 고객 평가다. 네 단계 가운데 위험 분석이 이 모형을 다른 모형과 가르는 자리이므로, 순서를 물을 때 거의 언제나 이 칸이 빈칸으로 나온다.",
    importance: "must",
  },
  {
    id: "pf-prototype-why",
    subject: "design",
    sourceId: "d-sdlc",
    kind: "term",
    question:
      "사용자의 요구사항을 정확히 끌어내기 위해 실제로 동작하는 견본을 미리 만들어 보여 주고, 확인이 끝나면 그 견본을 버리는 것을 원칙으로 하는 생명 주기 모형을 쓰시오.",
    answers: ["프로토타입 모형", "프로토타이핑 모형", "Prototype", "Prototyping", "프로토타입"],
    points: 5,
    explanation:
      "프로토타입 모형이다. 견본을 만드는 목적은 물건을 앞당겨 내놓는 데 있지 않고 요구사항을 확인하는 데 있다. 그래서 견본은 버리는 것이 원칙이다.",
    importance: "high",
  },
  {
    id: "pf-waterfall-trait",
    subject: "design",
    sourceId: "d-sdlc",
    kind: "term",
    question:
      "분석 → 설계 → 구현 → 시험 → 유지보수를 순서대로 밟으며 앞 단계가 끝나야 다음 단계로 넘어가는, 단계가 겹치지 않는 고전적 생명 주기 모형을 쓰시오.",
    answers: ["폭포수 모형", "폭포수", "Waterfall", "Waterfall Model", "선형 순차적 모형"],
    points: 5,
    explanation:
      "폭포수 모형이다. 단계가 뚜렷해 관리는 쉽지만, 뒤에서 요구사항이 바뀌면 되돌아가는 비용이 크다는 점이 늘 단점으로 붙는다.",
    importance: "high",
  },

  /* ── 탐색과 해싱 ── */
  {
    id: "pf-hash-collision",
    subject: "develop",
    sourceId: "v-search",
    kind: "term",
    question:
      "해싱에서 서로 다른 키가 같은 버킷(주소)으로 배정되는 현상을 무엇이라 하는가?",
    answers: ["충돌", "Collision", "충돌(Collision)"],
    points: 5,
    explanation:
      "충돌이다. 같은 자리를 놓고 다투게 된 키들을 동의어(Synonym)라 부르고, 이 동의어들이 모여 만든 덩어리를 오버플로라 한다.",
    importance: "high",
  },
  {
    id: "pf-hash-chaining",
    subject: "develop",
    sourceId: "v-search",
    kind: "term",
    question:
      "해싱의 충돌 해결 방법 가운데, 같은 주소로 배정된 키들을 그 자리에 연결 리스트로 매달아 두는 방법을 쓰시오.",
    answers: ["체이닝", "Chaining", "체이닝(Chaining)", "연결법"],
    points: 5,
    explanation:
      "체이닝이다. 이와 달리 개방 주소법(Open Addressing)은 빈 다른 자리를 찾아 들어가며, 선형 조사·이차 조사·이중 해싱이 여기에 든다.",
    importance: "high",
  },
  {
    id: "pf-binary-search",
    subject: "develop",
    sourceId: "v-search",
    kind: "term",
    question:
      "자료가 정렬되어 있을 때에만 쓸 수 있고, 가운데 값과 견주어 찾을 범위를 절반씩 줄여 나가는 탐색 방법을 쓰시오. (시간 복잡도는 O(log n) 이다.)",
    answers: ["이진 탐색", "이분 탐색", "Binary Search", "이진 탐색(Binary Search)"],
    points: 5,
    explanation:
      "이진 탐색이다. 정렬을 전제로 한다는 조건이 핵심이라, 정렬되지 않은 자료에는 쓸 수 없다. 정렬 없이 처음부터 훑는 것은 순차 탐색으로 O(n)이다.",
    importance: "high",
  },

  /* ── 키의 종류 ── */
  {
    id: "pf-superkey",
    subject: "database",
    sourceId: "b-key",
    kind: "term",
    question:
      "릴레이션에서 각 튜플을 유일하게 구별할 수 있으나(유일성), 그 구별에 꼭 필요하지 않은 속성까지 포함할 수 있는(최소성을 만족하지 않을 수 있는) 키를 쓰시오.",
    answers: ["슈퍼키", "Super Key", "슈퍼키(Super Key)", "수퍼키"],
    points: 5,
    explanation:
      "슈퍼키다. 여기에서 군더더기 속성을 덜어 최소성까지 갖추면 후보키가 된다. '유일성은 만족하나 최소성은 만족하지 않는다'는 표현이 붙으면 답은 슈퍼키다.",
    importance: "must",
  },
  {
    id: "pf-key-kinds",
    subject: "database",
    sourceId: "b-key",
    kind: "blank",
    question:
      "후보키 가운데 설계자가 골라 쓰기로 정한 키를 ( ① ), 뽑히지 못하고 남은 나머지 후보키를 ( ② ), 다른 릴레이션의 기본키를 참조하는 속성을 ( ③ )라 한다. ①~③에 들어갈 말을 쓰시오.",
    answers: [
      "① 기본키 ② 대체키 ③ 외래키",
      "기본키, 대체키, 외래키",
      "① Primary Key ② Alternate Key ③ Foreign Key",
      "Primary Key, Alternate Key, Foreign Key",
    ],
    points: 5,
    explanation:
      "기본키(Primary Key) · 대체키(Alternate Key) · 외래키(Foreign Key)다. 기본키는 개체 무결성에 따라 NULL 을 가질 수 없고, 외래키는 참조 무결성에 따라 참조하는 값이 실제로 있어야 한다.",
    importance: "must",
  },

  /* ── 이상 현상 ── */
  {
    id: "pf-anomaly-delete",
    subject: "database",
    sourceId: "b-anomaly",
    kind: "term",
    question:
      "릴레이션에서 한 튜플을 지웠을 뿐인데 그와 함께 보관되어 있던, 남겨야 할 다른 정보까지 딸려 사라지는 현상을 무엇이라 하는가?",
    answers: ["삭제 이상", "Deletion Anomaly", "삭제 이상(Deletion Anomaly)"],
    points: 5,
    explanation:
      "삭제 이상이다. 한 릴레이션에 서로 다른 성격의 정보가 섞여 있어서 생긴다. 정규화로 릴레이션을 갈라 두면 사라진다.",
    importance: "must",
  },
  {
    id: "pf-anomaly-three",
    subject: "database",
    sourceId: "b-anomaly",
    kind: "blank",
    question:
      "정규화가 덜 된 릴레이션에서는 세 가지 이상 현상이 생긴다. 넣고 싶지 않은 값까지 함께 넣어야 하는 ( ① ), 지우지 말아야 할 것까지 사라지는 ( ② ), 흩어진 같은 값 가운데 일부만 고쳐 데이터가 어긋나는 ( ③ ) 이다. ①~③을 쓰시오.",
    answers: [
      "① 삽입 이상 ② 삭제 이상 ③ 갱신 이상",
      "삽입 이상, 삭제 이상, 갱신 이상",
      "① Insertion Anomaly ② Deletion Anomaly ③ Update Anomaly",
      "삽입이상, 삭제이상, 갱신이상",
    ],
    points: 5,
    explanation:
      "삽입 이상 · 삭제 이상 · 갱신 이상이다. 셋 다 한 릴레이션에 여러 사실이 섞여 있는 데서 비롯되므로, 해결책은 모두 정규화다.",
    importance: "must",
  },

  /* ── 소프트웨어 개발 방법론 ── */
  {
    id: "pf-reuse-two",
    subject: "system",
    sourceId: "s-methodology",
    kind: "blank",
    question:
      "소프트웨어 재사용 방법은 둘로 나뉜다. 이미 만들어 둔 부품을 가져다 이어 붙이는 ( ① ) 방식과, 명세를 주면 그로부터 코드를 만들어 내는 ( ② ) 방식이다. ①과 ②를 쓰시오.",
    answers: [
      "① 합성 중심 ② 생성 중심",
      "합성 중심, 생성 중심",
      "① Composition-Based ② Generation-Based",
      "합성중심, 생성중심",
    ],
    points: 5,
    explanation:
      "합성 중심(Composition-Based)과 생성 중심(Generation-Based)이다. 합성 중심은 부품을 블록처럼 끼워 맞춘다 하여 블록 구성 방식, 생성 중심은 명세로부터 찍어 낸다 하여 패턴 구성 방식이라고도 부른다.",
    importance: "high",
  },
  {
    id: "pf-cbd",
    subject: "system",
    sourceId: "s-methodology",
    kind: "term",
    question:
      "새로 만들지 않고 이미 개발되어 검증된 컴포넌트를 조합하여 시스템을 만드는 것을 목표로 하는 개발 방법론을 쓰시오.",
    answers: [
      "컴포넌트 기반 방법론",
      "CBD",
      "Component Based Development",
      "컴포넌트 기반 개발 방법론",
      "CBD(Component Based Development)",
    ],
    points: 5,
    explanation:
      "컴포넌트 기반 방법론(CBD)이다. 구조적 방법론은 기능을, 정보공학 방법론은 자료를, 객체지향 방법론은 객체를 단위로 삼는 데 견주어, CBD 의 단위는 이미 만들어진 부품이다.",
    importance: "high",
  },
];
