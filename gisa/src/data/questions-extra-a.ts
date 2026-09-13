import type { WrittenQuestion } from "@/lib/types";

/**
 * 보충 문항 — 1과목 설계 · 2과목 개발.
 *
 * 한 회가 100문항인데 가진 문항이 적으면 두 번째 응시부터는 거의 같은
 * 시험지가 나온다. 과목마다 문항을 더 채워 겹침을 줄인다.
 */
export const EXTRA_A_QUESTIONS: WrittenQuestion[] = [
  // ── 1과목 · 소프트웨어 설계 ─────────────────────────
  {
    id: "qd-rumbaugh",
    subject: "design",
    sourceId: "d-uml-basic",
    question:
      "럼바우(Rumbaugh) 객체지향 분석에서 자료 흐름도(DFD)를 이용해 처리 과정을 나타내는 모델링은?",
    options: ["객체 모델링", "동적 모델링", "기능 모델링", "구조 모델링"],
    answerIndex: 2,
    explanation:
      "럼바우 분석은 객체(Object)·동적(Dynamic)·기능(Functional) 세 가지다. 이 중 자료 흐름도로 처리 과정을 그리는 것이 기능 모델링이다.",
    optionNotes: [
      "객체 모델링은 객체 다이어그램으로 관계를 그린다.",
      "동적 모델링은 상태 다이어그램으로 시간 흐름을 그린다.",
      null,
      "럼바우 분석에 구조 모델링이라는 단계는 없다.",
    ],
    importance: "must",
  },
  {
    id: "qd-uml-relation-gen",
    subject: "design",
    sourceId: "d-uml-basic",
    question:
      "UML 관계 중 한 클래스가 다른 클래스를 상속받는 관계를 나타내는 것은?",
    options: [
      "연관(Association)",
      "일반화(Generalization)",
      "의존(Dependency)",
      "집합(Aggregation)",
    ],
    answerIndex: 1,
    explanation:
      "일반화는 상위·하위 클래스 사이의 상속 관계다. 속이 빈 삼각형 화살표가 상위 클래스를 가리킨다.",
    optionNotes: [
      "연관은 두 클래스가 서로를 알고 있는 관계다.",
      null,
      "의존은 한쪽이 잠깐 다른 쪽을 쓰는 약한 관계다.",
      "집합은 전체와 부분의 관계로, 속이 빈 마름모로 그린다.",
    ],
    importance: "must",
  },
  {
    id: "qd-uml-diagram-kind",
    subject: "design",
    sourceId: "d-uml-basic",
    question: "다음 중 UML 의 동적(행위) 다이어그램에 해당하는 것은?",
    options: [
      "클래스 다이어그램",
      "배치 다이어그램",
      "순차 다이어그램",
      "컴포넌트 다이어그램",
    ],
    answerIndex: 2,
    explanation:
      "순차 다이어그램은 객체 사이에 오가는 메시지를 시간 순으로 그리는 행위 다이어그램이다. 나머지 셋은 구조 다이어그램이다.",
    optionNotes: [
      "클래스 다이어그램은 구조 다이어그램이다.",
      "배치 다이어그램은 물리적 구성을 그리는 구조 다이어그램이다.",
      null,
      "컴포넌트 다이어그램도 구조 다이어그램이다.",
    ],
    importance: "high",
  },
  {
    id: "qd-pattern-factory",
    subject: "design",
    sourceId: "d-pattern-creational",
    question:
      "객체 생성을 서브클래스에 맡겨, 어떤 클래스의 인스턴스를 만들지 서브클래스가 결정하게 하는 생성 패턴은?",
    options: ["Singleton", "Builder", "Factory Method", "Prototype"],
    answerIndex: 2,
    explanation:
      "팩토리 메서드 패턴이다. 상위 클래스는 생성 메서드의 껍데기만 두고, 실제로 무엇을 만들지는 서브클래스가 정한다.",
    optionNotes: [
      "싱글톤은 인스턴스를 하나만 두는 패턴이다.",
      "빌더는 복잡한 객체를 단계별로 조립한다.",
      null,
      "프로토타입은 원본을 복제해 만든다.",
    ],
    importance: "must",
  },
  {
    id: "qd-cohesion-rank",
    subject: "design",
    sourceId: "d-coupling-cohesion",
    question: "다음 응집도 중 가장 강한(좋은) 것은?",
    options: [
      "기능적 응집도",
      "논리적 응집도",
      "시간적 응집도",
      "우연적 응집도",
    ],
    answerIndex: 0,
    explanation:
      "응집도는 기능적 > 순차적 > 교환적 > 절차적 > 시간적 > 논리적 > 우연적 순으로 강하다. 기능적 응집도가 가장 좋다.",
    optionNotes: [
      null,
      "논리적 응집도는 비슷해 보이는 일을 묶은 것으로 약한 축이다.",
      "시간적 응집도는 같은 시점에 실행된다는 이유로 묶은 것이다.",
      "우연적 응집도가 가장 나쁘다.",
    ],
    importance: "must",
  },
  {
    id: "qd-coupling-rank",
    subject: "design",
    sourceId: "d-coupling-cohesion",
    question: "결합도가 가장 낮은(좋은) 것은?",
    options: ["내용 결합도", "공통 결합도", "제어 결합도", "자료 결합도"],
    answerIndex: 3,
    explanation:
      "결합도는 자료 < 스탬프 < 제어 < 외부 < 공통 < 내용 순으로 강해진다. 낮을수록 좋으므로 자료 결합도가 가장 낫다.",
    optionNotes: [
      "내용 결합도가 가장 나쁘다. 남의 내부를 직접 건드린다.",
      "공통 결합도는 전역 변수를 함께 쓰는 것이다.",
      "제어 결합도는 무엇을 할지 알려 주는 제어 신호를 넘긴다.",
      null,
    ],
    importance: "must",
  },
  {
    id: "qd-solid-dip",
    subject: "design",
    sourceId: "d-solid",
    question:
      '"상위 모듈은 하위 모듈에 의존해서는 안 되며, 둘 다 추상화에 의존해야 한다" 는 원칙은?',
    options: [
      "단일 책임 원칙(SRP)",
      "개방-폐쇄 원칙(OCP)",
      "인터페이스 분리 원칙(ISP)",
      "의존 역전 원칙(DIP)",
    ],
    answerIndex: 3,
    explanation:
      "의존 역전 원칙이다. 구체적인 구현이 아니라 인터페이스에 기대게 만들어 방향을 뒤집는다.",
    optionNotes: [
      "SRP 는 클래스가 바뀌는 이유가 하나여야 한다는 원칙이다.",
      "OCP 는 확장에는 열려 있고 변경에는 닫혀 있어야 한다는 원칙이다.",
      "ISP 는 쓰지 않는 메서드까지 강요하지 말라는 원칙이다.",
      null,
    ],
    importance: "must",
  },
  {
    id: "qd-arch-pipe",
    subject: "design",
    sourceId: "d-architecture",
    question:
      "데이터를 단계마다 걸러 다음 단계로 넘기며 처리하는 아키텍처 패턴은?",
    options: [
      "계층화 패턴",
      "파이프-필터 패턴",
      "클라이언트-서버 패턴",
      "브로커 패턴",
    ],
    answerIndex: 1,
    explanation:
      "파이프-필터 패턴이다. 각 필터가 자기 일만 하고 결과를 파이프로 흘려보내므로 필터를 갈아 끼우기 쉽다.",
    optionNotes: [
      "계층화는 위아래로 층을 나눈다.",
      null,
      "클라이언트-서버는 요청과 응답으로 나눈다.",
      "브로커는 흩어진 서비스를 중개자가 이어 준다.",
    ],
    importance: "high",
  },
  {
    id: "qd-middleware-was",
    subject: "design",
    sourceId: "d-interface",
    question:
      "동적인 웹 페이지를 만들기 위해 서버 쪽에서 프로그램을 실행하고 데이터베이스와 잇는 미들웨어는?",
    options: ["WAS", "RPC", "MOM", "TP-Monitor"],
    answerIndex: 0,
    explanation:
      "WAS(Web Application Server)다. 웹 서버가 정적 파일을 내보내는 사이, WAS 는 프로그램을 실행해 동적인 결과를 만든다.",
    optionNotes: [
      null,
      "RPC 는 원격 프로시저를 부르는 미들웨어다.",
      "MOM 은 메시지를 주고받는 미들웨어다.",
      "TP-Monitor 는 트랜잭션 처리를 감시한다.",
    ],
    importance: "normal",
  },
  {
    id: "qd-req-verify",
    subject: "design",
    sourceId: "d-requirement",
    question:
      '요구사항 확인 기법 중 "동료 검토(Peer Review)"에 대한 설명으로 옳은 것은?',
    options: [
      "요구사항 명세서를 작성한 사람이 직접 설명하고 이해관계자가 듣는 방식",
      "여러 전문가가 검토 회의를 열어 결함을 찾는 공식적인 방식",
      "도구를 이용해 명세서의 문법 오류만 검사하는 방식",
      "완성된 프로그램을 실행해 요구대로 도는지 보는 방식",
    ],
    answerIndex: 0,
    explanation:
      "동료 검토는 작성자가 직접 설명하고 관계자들이 들으며 결함을 찾는 비교적 가벼운 방식이다. 더 공식적인 것이 인스펙션이다.",
    optionNotes: [
      null,
      "전문가들이 여는 공식 검토는 인스펙션이다.",
      "도구로만 보는 것은 정적 분석이다.",
      "실행해 보는 것은 테스트다.",
    ],
    importance: "high",
  },

  // ── 2과목 · 소프트웨어 개발 ─────────────────────────
  {
    id: "qv-stack-queue",
    subject: "develop",
    sourceId: "v-datastructure",
    question: "스택(Stack)과 큐(Queue)에 대한 설명으로 옳은 것은?",
    options: [
      "스택은 FIFO, 큐는 LIFO 로 동작한다.",
      "스택은 LIFO, 큐는 FIFO 로 동작한다.",
      "둘 다 먼저 넣은 것이 먼저 나온다.",
      "둘 다 나중에 넣은 것이 먼저 나온다.",
    ],
    answerIndex: 1,
    explanation:
      "스택은 나중에 넣은 것이 먼저 나오고(LIFO), 큐는 먼저 넣은 것이 먼저 나온다(FIFO). 함수 호출은 스택, 작업 대기열은 큐다.",
    optionNotes: [
      "둘이 뒤바뀌었다. 시험에 이대로 나온다.",
      null,
      "스택은 그렇지 않다.",
      "큐는 그렇지 않다.",
    ],
    importance: "must",
  },
  {
    id: "qv-tree-postorder",
    subject: "develop",
    sourceId: "v-tree",
    question: "다음 이진 트리를 후위 순회(Post-order)한 결과는?",
    passage: "        A\n      /   \\\n     B     C\n    / \\\n   D   E",
    options: ["D E B C A", "A B D E C", "D B E A C", "A B C D E"],
    answerIndex: 0,
    explanation:
      "후위 순회는 왼쪽 → 오른쪽 → 루트다. B 의 왼쪽 D, 오른쪽 E, 그다음 B, 이어서 C, 마지막이 A 이므로 D E B C A 다.",
    optionNotes: [
      null,
      "이것은 전위 순회(루트 → 왼쪽 → 오른쪽)다.",
      "이것은 중위 순회(왼쪽 → 루트 → 오른쪽)다.",
      "이 트리에서는 나올 수 없는 순서다.",
    ],
    importance: "must",
  },
  {
    id: "qv-sort-bubble1",
    subject: "develop",
    sourceId: "v-sort",
    question:
      "8, 3, 4, 9, 7 을 버블 정렬로 오름차순 정렬할 때 1회전 후의 결과는?",
    options: [
      "3, 4, 8, 7, 9",
      "3, 8, 4, 9, 7",
      "3, 4, 7, 8, 9",
      "8, 3, 4, 7, 9",
    ],
    answerIndex: 0,
    explanation:
      "버블 정렬 1회전은 이웃끼리 견주어 큰 것을 뒤로 민다. (8,3)→(3,8), (8,4)→(4,8), (8,9) 그대로, (9,7)→(7,9) 이므로 3, 4, 8, 7, 9 다.",
    optionNotes: [
      null,
      "한 번만 바꾼 결과다. 1회전은 끝까지 훑는다.",
      "정렬이 다 끝난 결과다.",
      "맨 앞의 8 이 그대로 남을 수 없다.",
    ],
    importance: "must",
  },
  {
    id: "qv-hash-resolve",
    subject: "develop",
    sourceId: "v-datastructure",
    question: "해싱에서 충돌(Collision)을 해결하는 방법이 아닌 것은?",
    options: [
      "체이닝(Chaining)",
      "개방 주소법(Open Addressing)",
      "선형 조사법",
      "이진 탐색법",
    ],
    answerIndex: 3,
    explanation:
      "충돌 해결은 체이닝과 개방 주소법(선형 조사·이차 조사·이중 해싱)으로 나뉜다. 이진 탐색은 정렬된 자료를 찾는 방법이지 충돌 해결법이 아니다.",
    optionNotes: [
      null,
      null,
      "선형 조사법은 개방 주소법의 한 가지다.",
      "정답.",
    ],
    importance: "high",
  },
  {
    id: "qv-test-integration",
    subject: "develop",
    sourceId: "v-integration",
    question:
      "하향식 통합 테스트에서 아직 만들지 않은 하위 모듈을 대신하는 가짜 모듈은?",
    options: [
      "드라이버(Driver)",
      "스텁(Stub)",
      "목(Mock) 서버",
      "테스트 하네스",
    ],
    answerIndex: 1,
    explanation:
      "하향식은 위에서 아래로 붙이므로 없는 하위 모듈 자리에 스텁을 둔다. 반대로 상향식에서는 상위 모듈 대신 드라이버를 둔다.",
    optionNotes: [
      "드라이버는 상향식에서 상위 모듈을 대신한다.",
      null,
      "목 서버는 외부 서비스를 흉내 내는 것으로, 이 문항이 묻는 것이 아니다.",
      "테스트 하네스는 테스트를 돌리는 환경 전체를 이른다.",
    ],
    importance: "must",
  },
  {
    id: "qv-complexity-calc",
    subject: "develop",
    sourceId: "v-complexity",
    question:
      "제어 흐름 그래프의 화살표(간선)가 11개, 노드가 8개일 때 순환 복잡도(Cyclomatic Complexity)는?",
    options: ["3", "4", "5", "6"],
    answerIndex: 2,
    explanation:
      "V(G) = 간선 - 노드 + 2 = 11 - 8 + 2 = 5 다. 이 값은 독립적인 경로의 수이자, 모두 훑으려면 몇 개의 테스트 케이스가 필요한지를 뜻한다.",
    optionNotes: [
      "간선에서 노드를 뺀 값이다. 2를 더해야 한다.",
      "계산이 맞지 않는다.",
      null,
      "계산이 맞지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "qv-scm-terms",
    subject: "develop",
    sourceId: "v-scm",
    question: '형상 관리에서 "체크아웃(Check-out)"에 해당하는 것은?',
    options: [
      "저장소의 파일을 자기 작업 공간으로 받아 오는 것",
      "고친 파일을 저장소에 되돌려 놓는 것",
      "특정 시점의 상태에 이름을 붙여 두는 것",
      "두 사람이 고친 내용을 하나로 합치는 것",
    ],
    answerIndex: 0,
    explanation:
      "체크아웃은 저장소에서 내 작업 공간으로 받아 오는 것, 체크인은 되돌려 놓는 것이다.",
    optionNotes: [
      null,
      "이것이 체크인(커밋)이다.",
      "이것이 태그(릴리스)다.",
      "이것이 병합(머지)이다.",
    ],
    importance: "high",
  },
  {
    id: "qv-quality-iso",
    subject: "develop",
    sourceId: "v-quality",
    question:
      '소프트웨어 품질 특성 중 "정해진 조건에서 일정 기간 동안 고장 없이 동작하는 정도"는?',
    options: ["기능성", "신뢰성", "사용성", "효율성"],
    answerIndex: 1,
    explanation:
      "신뢰성이다. 기능성은 요구 기능을 갖췄는가, 사용성은 쓰기 쉬운가, 효율성은 자원을 얼마나 쓰는가를 본다.",
    optionNotes: [
      "기능성은 요구한 기능이 있는가를 본다.",
      null,
      "사용성은 배우고 쓰기 쉬운가를 본다.",
      "효율성은 같은 일을 얼마나 적은 자원으로 하는가를 본다.",
    ],
    importance: "high",
  },
  {
    id: "qv-package-drm",
    subject: "develop",
    sourceId: "v-package",
    question:
      "디지털 저작권 관리(DRM)의 구성 요소에 대한 설명으로 옳지 않은 것은?",
    options: [
      "패키저(Packager)는 콘텐츠를 메타 데이터와 함께 배포 가능한 형태로 묶는다.",
      "클리어링 하우스(Clearing House)는 사용 권한과 결제를 관리한다.",
      "DRM 컨트롤러는 배포된 콘텐츠의 이용 권한을 통제한다.",
      "시큐리티 컨테이너는 사용자가 콘텐츠를 자유롭게 복제하도록 돕는다.",
    ],
    answerIndex: 3,
    explanation:
      "시큐리티 컨테이너는 콘텐츠를 암호화해 담아 두는 안전한 상자다. 복제를 돕는 것이 아니라 막는 쪽이다.",
    optionNotes: [
      null,
      null,
      null,
      "정답. DRM 은 무단 복제를 막는 것이 목적이다.",
    ],
    importance: "normal",
  },
  {
    id: "qv-inspection",
    subject: "develop",
    sourceId: "v-quality",
    question:
      "개발자가 아닌 다른 전문가들이 결함을 찾기 위해 미리 자료를 읽고 회의를 여는 가장 공식적인 검토 방법은?",
    options: ["워크스루", "인스펙션", "동료 검토", "회귀 테스트"],
    answerIndex: 1,
    explanation:
      "인스펙션은 미리 자료를 나눠 읽고 정해진 절차대로 회의를 여는 가장 공식적인 검토다. 워크스루는 회의에서 자료를 함께 보는 비교적 가벼운 방식이다.",
    optionNotes: [
      "워크스루는 사전 배포 없이 모여서 훑는다.",
      null,
      "동료 검토가 가장 가볍다.",
      "회귀 테스트는 검토가 아니라 테스트다.",
    ],
    importance: "high",
  },
  {
    id: "qv-clean-refactor",
    subject: "develop",
    sourceId: "v-clean",
    question: "리팩토링에 대한 설명으로 옳은 것은?",
    options: [
      "겉으로 드러나는 동작은 그대로 두고 내부 구조를 고쳐 읽기 쉽게 만드는 것",
      "새 기능을 넣으면서 동시에 구조도 바꾸는 것",
      "성능을 올리기 위해 알고리즘을 통째로 바꾸는 것",
      "버그를 고쳐 동작을 바로잡는 것",
    ],
    answerIndex: 0,
    explanation:
      "리팩토링은 동작을 바꾸지 않는다는 것이 핵심이다. 동작이 바뀌면 그것은 기능 변경이거나 버그 수정이다.",
    optionNotes: [
      null,
      "기능 추가와 구조 변경은 섞지 않는 것이 원칙이다.",
      "성능 개선은 최적화이지 리팩토링이 아니다.",
      "버그 수정은 동작을 바꾸므로 리팩토링이 아니다.",
    ],
    importance: "high",
  },
  {
    id: "qv-test-level-v",
    subject: "develop",
    sourceId: "v-test-level",
    question: 'V-모델에서 "요구사항 분석"과 짝을 이루는 테스트 단계는?',
    options: ["단위 테스트", "통합 테스트", "시스템 테스트", "인수 테스트"],
    answerIndex: 3,
    explanation:
      "V-모델은 왼쪽의 개발 단계마다 오른쪽 테스트 단계가 짝을 이룬다. 요구사항 분석 ↔ 인수 테스트, 설계 ↔ 시스템/통합 테스트, 구현 ↔ 단위 테스트다.",
    optionNotes: [
      "단위 테스트는 구현 단계와 짝이다.",
      "통합 테스트는 상세 설계와 짝이다.",
      "시스템 테스트는 아키텍처 설계와 짝이다.",
      null,
    ],
    importance: "must",
  },
];
