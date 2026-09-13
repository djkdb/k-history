import type { WrittenQuestion } from "@/lib/types";

/** 2과목 · 소프트웨어 개발 — 보충 2 */
export const DEVELOP2_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qv2-linkedlist",
    subject: "develop",
    sourceId: "v-datastructure",
    question: "연결 리스트(Linked List)와 배열을 견준 설명으로 옳은 것은?",
    options: [
      "연결 리스트는 임의의 위치에 바로 접근할 수 있다.",
      "배열은 중간에 원소를 끼워 넣을 때 뒤쪽을 밀어야 한다.",
      "연결 리스트는 미리 크기를 정해 두어야 한다.",
      "배열은 포인터를 따라가야 해서 접근이 느리다.",
    ],
    answerIndex: 1,
    explanation:
      "배열은 자리가 붙어 있어 인덱스로 바로 닿지만 중간 삽입·삭제 때 밀어야 한다. 연결 리스트는 그 반대다.",
    optionNotes: [
      "바로 접근하는 쪽은 배열이다.",
      null,
      "크기를 미리 정하는 쪽은 배열이다.",
      "포인터를 따라가는 쪽은 연결 리스트다.",
    ],
    importance: "must",
  },
  {
    id: "qv2-postfix",
    subject: "develop",
    sourceId: "v-datastructure",
    question: "중위 표기식 A + B * C 를 후위 표기식으로 바꾼 것은?",
    options: ["A B C * +", "A B + C *", "A B * C +", "+ A * B C"],
    answerIndex: 0,
    explanation:
      "곱셈이 덧셈보다 먼저이므로 B C * 를 먼저 묶고, 그 결과를 A 와 더한다 → A B C * + 다.",
    optionNotes: [
      null,
      "이것은 (A + B) * C 를 옮긴 것이다.",
      "이것은 (A * B) + C 다.",
      "이것은 전위 표기식이다.",
    ],
    importance: "must",
  },
  {
    id: "qv2-tree-preorder",
    subject: "develop",
    sourceId: "v-tree",
    question: "전위 순회(Pre-order)의 방문 순서로 옳은 것은?",
    options: [
      "왼쪽 → 루트 → 오른쪽",
      "루트 → 왼쪽 → 오른쪽",
      "왼쪽 → 오른쪽 → 루트",
      "오른쪽 → 루트 → 왼쪽",
    ],
    answerIndex: 1,
    explanation:
      "전위는 루트를 먼저 본다. 중위는 루트가 가운데, 후위는 루트가 마지막이다 — 이름의 '위'가 루트의 자리다.",
    optionNotes: ["중위 순회다.", null, "후위 순회다.", "쓰지 않는 순서다."],
    importance: "must",
  },
  {
    id: "qv2-sort-select",
    subject: "develop",
    sourceId: "v-sort",
    question: "선택 정렬(Selection Sort)에 대한 설명으로 옳은 것은?",
    options: [
      "가장 작은 값을 찾아 맨 앞과 자리를 바꾸는 일을 되풀이한다.",
      "이웃한 두 값을 견주어 큰 것을 뒤로 민다.",
      "자료를 반으로 나누어 각각 정렬한 뒤 합친다.",
      "기준값보다 작은 것과 큰 것으로 갈라 놓는다.",
    ],
    answerIndex: 0,
    explanation:
      "선택 정렬은 남은 것 중 최솟값을 골라 앞으로 보낸다. 이웃끼리 견주는 것은 버블, 반씩 나누는 것은 병합, 기준값으로 가르는 것은 퀵이다.",
    optionNotes: [null, "버블 정렬이다.", "병합 정렬이다.", "퀵 정렬이다."],
    importance: "must",
  },
  {
    id: "qv2-sort-complexity",
    subject: "develop",
    sourceId: "v-sort",
    question: "평균 시간 복잡도가 O(n log n) 이 아닌 정렬은?",
    options: ["병합 정렬", "힙 정렬", "퀵 정렬", "삽입 정렬"],
    answerIndex: 3,
    explanation:
      "삽입 정렬의 평균은 O(n²)이다. 병합·힙은 늘 O(n log n), 퀵은 평균 O(n log n)이고 최악이 O(n²)다.",
    optionNotes: [null, null, null, "정답. 평균 O(n²)다."],
    importance: "must",
  },
  {
    id: "qv2-search-hash",
    subject: "develop",
    sourceId: "v-search",
    question: "해시 탐색에 대한 설명으로 옳은 것은?",
    options: [
      "자료가 정렬되어 있어야 쓸 수 있다.",
      "키를 함수에 넣어 저장 위치를 바로 구하므로 평균 O(1)이다.",
      "탐색 범위를 절반씩 줄여 나간다.",
      "앞에서부터 차례로 견주므로 최악 O(n)이다.",
    ],
    answerIndex: 1,
    explanation:
      "해시는 계산으로 자리를 바로 찾는다. 정렬이 필요 없고 평균 O(1)이지만, 충돌이 몰리면 나빠진다.",
    optionNotes: [
      "정렬은 이진 탐색이 요구한다.",
      null,
      "절반씩 줄이는 것은 이진 탐색이다.",
      "차례로 견주는 것은 순차 탐색이다.",
    ],
    importance: "high",
  },
  {
    id: "qv2-test-boundary",
    subject: "develop",
    sourceId: "v-test-technique",
    question:
      "입력값의 범위가 1~100 일 때 0, 1, 100, 101 을 골라 시험하는 블랙박스 기법은?",
    options: ["동등 분할", "경계값 분석", "원인-결과 그래프", "오류 예측"],
    answerIndex: 1,
    explanation:
      "경계값 분석이다. 결함은 구간 한가운데보다 경계에서 훨씬 자주 나온다는 경험에서 나온 기법이다.",
    optionNotes: [
      "동등 분할은 구간마다 대푯값 하나를 고른다.",
      null,
      "원인-결과 그래프는 입력 조합과 결과를 그래프로 잇는다.",
      "오류 예측은 경험과 직관으로 찔러 본다.",
    ],
    importance: "must",
  },
  {
    id: "qv2-test-coverage",
    subject: "develop",
    sourceId: "v-test-technique",
    question:
      "화이트박스 테스트의 커버리지를 약한 것부터 순서대로 나열한 것은?",
    options: [
      "구문 → 결정(분기) → 조건",
      "조건 → 구문 → 결정",
      "결정 → 구문 → 조건",
      "구문 → 조건 → 결정",
    ],
    answerIndex: 0,
    explanation:
      "구문 커버리지는 모든 문장을 한 번씩, 결정 커버리지는 각 분기의 참·거짓을 한 번씩, 조건 커버리지는 각 조건식마다 참·거짓을 본다. 구문이 가장 약하다.",
    optionNotes: [
      null,
      "구문이 가장 약하다.",
      "구문이 먼저다.",
      "결정이 조건보다 앞이다.",
    ],
    importance: "must",
  },
  {
    id: "qv2-integration-bigbang",
    subject: "develop",
    sourceId: "v-integration",
    question: "빅뱅(Big Bang) 통합 테스트의 단점으로 옳은 것은?",
    options: [
      "스텁과 드라이버를 많이 만들어야 한다.",
      "한꺼번에 붙이므로 결함이 났을 때 어디서 났는지 찾기 어렵다.",
      "통합 순서를 정하는 데 시간이 오래 걸린다.",
      "상위 모듈을 먼저 검증할 수 없다.",
    ],
    answerIndex: 1,
    explanation:
      "빅뱅은 다 만든 뒤 한 번에 붙인다. 가짜 모듈이 필요 없는 대신, 문제가 생기면 원인을 가려내기가 어렵다.",
    optionNotes: [
      "가짜 모듈이 필요 없는 것이 빅뱅의 장점이다.",
      null,
      "순서를 정하지 않는 것이 빅뱅이다.",
      "이것은 상향식의 단점이다.",
    ],
    importance: "high",
  },
  {
    id: "qv2-scm-tools",
    subject: "develop",
    sourceId: "v-scm",
    question:
      "형상 관리 도구 중 저장소 전체를 각자 컴퓨터에 복제해 두고 쓰는 분산형에 해당하는 것은?",
    options: ["CVS", "SVN(Subversion)", "Git", "RCS"],
    answerIndex: 2,
    explanation:
      "Git 은 분산형이라 저장소 전체를 복제해 두고 네트워크 없이도 이력을 볼 수 있다. CVS·SVN·RCS 는 중앙 집중형이다.",
    optionNotes: [null, null, null, null],
    importance: "high",
  },
  {
    id: "qv2-quality-iso25010",
    subject: "develop",
    sourceId: "v-quality",
    question:
      '소프트웨어 품질 특성 중 "다른 환경으로 옮겨 설치해 쓸 수 있는 정도"는?',
    options: ["유지보수성", "이식성", "신뢰성", "효율성"],
    answerIndex: 1,
    explanation:
      "이식성(Portability)이다. 유지보수성은 고치기 쉬운 정도, 신뢰성은 고장 없이 도는 정도다.",
    optionNotes: [
      "유지보수성은 고치기 쉬운 정도다.",
      null,
      "신뢰성은 고장 없이 도는 정도다.",
      "효율성은 자원을 얼마나 쓰는가다.",
    ],
    importance: "high",
  },
  {
    id: "qv2-clean-naming",
    subject: "develop",
    sourceId: "v-clean",
    question: "클린 코드를 위한 원칙으로 옳지 않은 것은?",
    options: [
      "이름만 보고도 무엇인지 알 수 있게 짓는다.",
      "한 함수는 한 가지 일만 하게 한다.",
      "중복된 코드는 하나로 모은다.",
      "나중을 위해 쓰지 않는 코드도 남겨 둔다.",
    ],
    answerIndex: 3,
    explanation:
      "쓰지 않는 코드는 지운다. 남겨 두면 읽는 사람이 그것도 살아 있는 코드라고 여겨 잘못 고치게 된다. 되살릴 일은 형상 관리가 맡는다.",
    optionNotes: [null, null, null, "정답. 죽은 코드는 지운다."],
    importance: "high",
  },
  {
    id: "qv2-package-release",
    subject: "develop",
    sourceId: "v-package",
    question: "소프트웨어 패키징에 대한 설명으로 옳지 않은 것은?",
    options: [
      "개발자가 아니라 사용자 중심으로 진행한다.",
      "다양한 이기종 환경에서 설치될 수 있게 고려한다.",
      "패키징 전에 모듈별로 빌드가 되는지 확인한다.",
      "사용자가 고칠 수 있도록 원시 코드를 함께 배포하는 것이 원칙이다.",
    ],
    answerIndex: 3,
    explanation:
      "패키징은 실행할 수 있는 형태로 묶어 내보내는 일이다. 원시 코드 공개는 배포 정책의 문제이지 패키징의 원칙이 아니다.",
    optionNotes: [null, null, null, "정답. 원칙이 아니다."],
    importance: "normal",
  },
  {
    id: "qv2-complexity-judge",
    subject: "develop",
    sourceId: "v-complexity",
    question: "순환 복잡도 V(G) 값이 뜻하는 것으로 옳은 것은?",
    options: [
      "프로그램의 총 줄 수",
      "독립적인 실행 경로의 수이며, 모두 훑는 데 필요한 테스트 케이스의 최소 개수",
      "함수가 호출되는 횟수",
      "변수의 개수",
    ],
    answerIndex: 1,
    explanation:
      "V(G)는 독립 경로의 수다. 그래서 그만큼의 테스트 케이스가 있어야 모든 경로를 한 번씩 지난다.",
    optionNotes: [
      "줄 수는 LOC 다.",
      null,
      "호출 횟수와는 무관하다.",
      "변수 수와는 무관하다.",
    ],
    importance: "must",
  },
  {
    id: "qv2-test-alpha-beta",
    subject: "develop",
    sourceId: "v-test-level",
    question: "알파 테스트와 베타 테스트의 차이로 옳은 것은?",
    options: [
      "알파는 개발자 통제 아래에서, 베타는 실제 사용자 환경에서 한다.",
      "알파는 실제 사용자 환경에서, 베타는 개발자 통제 아래에서 한다.",
      "둘 다 개발자가 직접 수행한다.",
      "알파는 단위 테스트, 베타는 통합 테스트를 이른다.",
    ],
    answerIndex: 0,
    explanation:
      "둘 다 인수 테스트다. 알파는 개발 조직 안에서 사용자가, 베타는 바깥 실제 환경에서 사용자가 한다.",
    optionNotes: [
      null,
      "뒤바뀌었다.",
      "사용자가 수행한다.",
      "단위·통합과는 다른 단계다.",
    ],
    importance: "must",
  },
  {
    id: "qv2-test-error-terms",
    subject: "develop",
    sourceId: "v-test-level",
    question:
      "사람이 잘못 저지른 행위를 가리키는 말과, 그로 인해 코드에 남은 잘못을 가리키는 말을 바르게 짝지은 것은?",
    options: [
      "에러(Error) — 결함(Defect)",
      "결함(Defect) — 에러(Error)",
      "장애(Failure) — 결함(Defect)",
      "결함(Defect) — 장애(Failure)",
    ],
    answerIndex: 0,
    explanation:
      "사람의 실수가 에러, 그것이 코드에 남은 것이 결함(= 버그), 결함 때문에 실제로 잘못 도는 것이 장애다.",
    optionNotes: [
      null,
      "뒤바뀌었다.",
      "장애는 겉으로 드러난 현상이다.",
      "순서가 맞지 않는다.",
    ],
    importance: "high",
  },
];
