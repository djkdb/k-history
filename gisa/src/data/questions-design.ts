import type { WrittenQuestion } from "@/lib/types";

/** 1과목 · 소프트웨어 설계 */
export const DESIGN_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qd-sdlc-spiral",
    subject: "design",
    sourceId: "d-sdlc",
    question: "나선형(Spiral) 모형의 네 단계를 순서대로 나열한 것은?",
    options: [
      "계획 → 위험 분석 → 개발 → 고객 평가",
      "계획 → 개발 → 위험 분석 → 고객 평가",
      "위험 분석 → 계획 → 고객 평가 → 개발",
      "고객 평가 → 계획 → 개발 → 위험 분석",
    ],
    answerIndex: 0,
    explanation:
      "나선형 모형은 계획 → 위험 분석 → 개발 → 고객 평가를 한 바퀴로 보고 여러 바퀴 돈다. 네 단계 중 위험 분석이 이 모형의 이름값이다.",
    optionNotes: [
      null,
      "위험 분석은 개발보다 앞이다. 위험을 재고 나서 만든다.",
      "계획이 먼저다.",
      "평가는 한 바퀴의 끝이지 시작이 아니다.",
    ],
    importance: "must",
  },
  {
    id: "qd-sdlc-proto",
    subject: "design",
    sourceId: "d-sdlc",
    question: "프로토타입 모형에 대한 설명으로 옳지 않은 것은?",
    options: [
      "견본을 만들어 사용자에게 보여 주며 요구사항을 끌어낸다.",
      "말로 설명하기 어려운 요구사항을 화면으로 확인할 수 있다.",
      "만든 견본은 그대로 최종 제품이 되는 것이 원칙이다.",
      "사용자가 결과물을 미리 볼 수 있어 의사소통이 쉬워진다.",
    ],
    answerIndex: 2,
    explanation:
      "프로토타입은 요구사항을 끌어내기 위한 견본이므로 버리는 것이 원칙이다. 그대로 제품이 되면 구조가 허술한 채로 남는다.",
    optionNotes: [null, null, "정답. 견본은 버린다.", null],
    importance: "high",
  },
  {
    id: "qd-xp-values",
    subject: "design",
    sourceId: "d-agile",
    question: "XP(eXtreme Programming)의 5가지 가치에 해당하지 않는 것은?",
    options: ["용기", "단순성", "의사소통", "문서화"],
    answerIndex: 3,
    explanation:
      "XP 의 다섯 가치는 용기·단순성·의사소통·피드백·존중이다. 애자일은 포괄적인 문서보다 동작하는 소프트웨어를 앞에 둔다.",
    optionNotes: [null, null, null, "정답. 문서화는 XP 의 가치가 아니다."],
    importance: "must",
  },
  {
    id: "qd-req-nonfunc",
    subject: "design",
    sourceId: "d-requirement",
    question: "다음 중 비기능 요구사항에 해당하는 것은?",
    options: [
      "사용자는 아이디와 비밀번호로 로그인할 수 있어야 한다.",
      "관리자는 회원 목록을 조회할 수 있어야 한다.",
      "조회 응답 시간은 2초를 넘지 않아야 한다.",
      "주문 내역을 엑셀로 내려받을 수 있어야 한다.",
    ],
    answerIndex: 2,
    explanation:
      "기능 요구사항은 '무엇을 하는가', 비기능 요구사항은 '얼마나 잘 하는가'다. 성능·보안·가용성·사용성이 비기능이다.",
    optionNotes: [
      "로그인이라는 기능이다.",
      "조회라는 기능이다.",
      null,
      "내려받기라는 기능이다.",
    ],
    importance: "must",
  },
  {
    id: "qd-req-steps",
    subject: "design",
    sourceId: "d-requirement",
    question: "요구사항 개발 프로세스의 순서로 옳은 것은?",
    options: [
      "도출 → 분석 → 명세 → 확인",
      "분석 → 도출 → 확인 → 명세",
      "명세 → 도출 → 분석 → 확인",
      "도출 → 명세 → 분석 → 확인",
    ],
    answerIndex: 0,
    explanation:
      "도출(Elicitation) → 분석(Analysis) → 명세(Specification) → 확인(Validation) 순이다.",
    optionNotes: [
      null,
      "도출이 먼저다.",
      "명세는 분석 뒤다.",
      "분석하고 나서 명세를 쓴다.",
    ],
    importance: "must",
  },
  {
    id: "qd-uml-behavior",
    subject: "design",
    sourceId: "d-uml-basic",
    question: "다음 중 UML 의 행위(Behavioral) 다이어그램이 아닌 것은?",
    options: [
      "유스케이스 다이어그램",
      "시퀀스 다이어그램",
      "배치 다이어그램",
      "상태 다이어그램",
    ],
    answerIndex: 2,
    explanation:
      "배치(Deployment) 다이어그램은 구조 다이어그램이다. 행위 다이어그램은 유스케이스·시퀀스·커뮤니케이션·상태·활동·상호작용 개요·타이밍 일곱 가지다.",
    optionNotes: [null, null, "정답. 구조 다이어그램이다.", null],
    importance: "must",
  },
  {
    id: "qd-uml-relation",
    subject: "design",
    sourceId: "d-uml-basic",
    question:
      "전체가 없어지면 부분도 함께 없어지는 강한 소유 관계를 나타내는 UML 관계는?",
    options: [
      "집합(Aggregation)",
      "포함(Composition)",
      "일반화(Generalization)",
      "의존(Dependency)",
    ],
    answerIndex: 1,
    explanation:
      "포함(Composition)은 속이 찬 마름모로 그리며 전체가 없어지면 부분도 없어진다. 집합(Aggregation)은 속이 빈 마름모이고 부분이 따로 살 수 있다.",
    optionNotes: [
      "부분이 따로 살 수 있는 약한 관계다.",
      null,
      "상속 관계다.",
      "한쪽이 바뀌면 영향을 받는 관계다.",
    ],
    importance: "must",
  },
  {
    id: "qd-usecase-include",
    subject: "design",
    sourceId: "d-usecase",
    question:
      "유스케이스에서 기본 흐름이 반드시 다른 유스케이스를 사용하는 관계는?",
    options: ["확장(extend)", "포함(include)", "일반화", "연관"],
    answerIndex: 1,
    explanation:
      "include 는 반드시 쓰는 관계다. '주문하기'가 '결제하기'를 반드시 포함하는 식이다. extend 는 조건에 따라 붙는다.",
    optionNotes: [
      "조건부다.",
      null,
      "상속이다.",
      "액터와 유스케이스를 잇는다.",
    ],
    importance: "high",
  },
  {
    id: "qd-oop-encap",
    subject: "design",
    sourceId: "d-oop",
    question:
      "데이터와 그 데이터를 처리하는 함수를 하나로 묶고 외부에서 직접 접근하지 못하게 하는 객체지향 개념은?",
    options: ["상속", "캡슐화", "다형성", "추상화"],
    answerIndex: 1,
    explanation:
      "캡슐화다. 결합도가 낮아지고 재사용이 쉬워지며, 안쪽 구현을 감추는 정보 은닉으로 이어진다.",
    optionNotes: [
      "물려받는 것이다.",
      null,
      "같은 메시지에 다르게 응답하는 것이다.",
      "공통점만 뽑아내는 것이다.",
    ],
    importance: "must",
  },
  {
    id: "qd-oop-override",
    subject: "design",
    sourceId: "d-oop",
    question: "오버로딩(Overloading)에 대한 설명으로 옳은 것은?",
    options: [
      "상위 클래스의 메서드를 하위 클래스에서 다시 정의한다.",
      "메서드 이름은 같고 매개변수의 개수나 자료형이 다르다.",
      "실행 시점에 어느 메서드를 부를지 정해진다.",
      "반환형만 달라도 오버로딩이 성립한다.",
    ],
    answerIndex: 1,
    explanation:
      "오버로딩은 같은 이름에 매개변수를 달리한 것으로 컴파일 시점에 정해진다. 상위 메서드를 다시 정의하는 것은 오버라이딩이다.",
    optionNotes: [
      "오버라이딩 설명이다.",
      null,
      "오버라이딩이 실행 시점(동적 바인딩)이다.",
      "반환형만 다르면 구별되지 않아 성립하지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "qd-solid-ocp",
    subject: "design",
    sourceId: "d-solid",
    question: "'확장에는 열려 있고 변경에는 닫혀 있어야 한다'는 설계 원칙은?",
    options: [
      "단일 책임 원칙(SRP)",
      "개방 폐쇄 원칙(OCP)",
      "리스코프 치환 원칙(LSP)",
      "의존 역전 원칙(DIP)",
    ],
    answerIndex: 1,
    explanation:
      "개방 폐쇄 원칙(OCP)이다. 기능을 더할 때 기존 코드를 고치지 않아도 되게 설계한다.",
    optionNotes: [
      "바뀔 이유가 하나여야 한다는 원칙이다.",
      null,
      "하위 타입이 상위 타입을 대신할 수 있어야 한다는 원칙이다.",
      "추상에 의존하라는 원칙이다.",
    ],
    importance: "must",
  },
  {
    id: "qd-pattern-count",
    subject: "design",
    sourceId: "d-pattern-creational",
    question: "GoF 디자인 패턴의 분류별 개수로 옳은 것은?",
    options: [
      "생성 5 · 구조 7 · 행위 11",
      "생성 7 · 구조 5 · 행위 11",
      "생성 5 · 구조 11 · 행위 7",
      "생성 6 · 구조 7 · 행위 10",
    ],
    answerIndex: 0,
    explanation: "GoF 23개는 생성 5, 구조 7, 행위 11로 나뉜다.",
    optionNotes: [
      null,
      "생성과 구조가 바뀌었다.",
      "구조와 행위가 바뀌었다.",
      "합이 23이지만 분류 개수가 다르다.",
    ],
    importance: "must",
  },
  {
    id: "qd-pattern-singleton",
    subject: "design",
    sourceId: "d-pattern-creational",
    question: "인스턴스가 오직 하나만 만들어지도록 보장하는 디자인 패턴은?",
    options: ["팩토리 메서드", "싱글톤", "프로토타입", "빌더"],
    answerIndex: 1,
    explanation:
      "싱글톤은 인스턴스를 하나만 두고 어디서든 그 하나에 닿게 한다.",
    optionNotes: [
      "무엇을 만들지 하위 클래스가 정하게 미룬다.",
      null,
      "이미 만든 것을 복제한다.",
      "복잡한 객체를 단계별로 만든다.",
    ],
    importance: "must",
  },
  {
    id: "qd-pattern-adapter",
    subject: "design",
    sourceId: "d-pattern-structural",
    question:
      "서로 맞지 않는 인터페이스를 이어 주어 함께 동작하게 하는 패턴은?",
    options: [
      "어댑터(Adapter)",
      "프록시(Proxy)",
      "퍼사드(Facade)",
      "데코레이터(Decorator)",
    ],
    answerIndex: 0,
    explanation: "어댑터는 맞지 않는 인터페이스를 맞춰 준다.",
    optionNotes: [
      null,
      "대신 서서 접근을 통제한다.",
      "복잡한 것 앞에 간단한 창구를 둔다.",
      "객체를 감싸 기능을 덧붙인다.",
    ],
    importance: "high",
  },
  {
    id: "qd-pattern-observer",
    subject: "design",
    sourceId: "d-pattern-behavioral",
    question:
      "한 객체의 상태가 바뀌면 그 객체를 지켜보던 다른 객체들에게 자동으로 알리는 패턴은?",
    options: [
      "전략(Strategy)",
      "옵서버(Observer)",
      "상태(State)",
      "커맨드(Command)",
    ],
    answerIndex: 1,
    explanation: "옵서버 패턴이다. 발행-구독 구조로도 부른다.",
    optionNotes: [
      "알고리즘을 갈아 끼운다.",
      null,
      "상태에 따라 행동이 바뀐다.",
      "요청을 객체로 만든다.",
    ],
    importance: "high",
  },
  {
    id: "qd-arch-mvc",
    subject: "design",
    sourceId: "d-architecture",
    question:
      "MVC 아키텍처에서 사용자의 입력을 받아 처리 흐름을 정하는 요소는?",
    options: [
      "모델(Model)",
      "뷰(View)",
      "컨트롤러(Controller)",
      "서비스(Service)",
    ],
    answerIndex: 2,
    explanation:
      "컨트롤러가 입력을 받아 모델을 부르고 어떤 뷰를 보여 줄지 정한다. 모델은 데이터와 규칙, 뷰는 화면이다.",
    optionNotes: [
      "데이터와 업무 규칙을 맡는다.",
      "화면을 맡는다.",
      null,
      "MVC 의 구성 요소가 아니다.",
    ],
    importance: "high",
  },
  {
    id: "qd-coupling-low",
    subject: "design",
    sourceId: "d-coupling-cohesion",
    question: "결합도가 가장 낮은 것은?",
    options: ["내용 결합도", "공통 결합도", "자료 결합도", "제어 결합도"],
    answerIndex: 2,
    explanation:
      "결합도는 낮은 것부터 자료 → 스탬프 → 제어 → 외부 → 공통 → 내용이다. 자료 결합도가 가장 낮고 좋다.",
    optionNotes: [
      "가장 높다.",
      "전역 변수를 함께 쓰는 것으로 높은 편이다.",
      null,
      "가운데쯤이다.",
    ],
    importance: "must",
  },
  {
    id: "qd-cohesion-high",
    subject: "design",
    sourceId: "d-coupling-cohesion",
    question: "응집도가 가장 높은 것은?",
    options: [
      "우연적 응집도",
      "논리적 응집도",
      "절차적 응집도",
      "기능적 응집도",
    ],
    answerIndex: 3,
    explanation:
      "응집도는 낮은 것부터 우연 → 논리 → 시간 → 절차 → 통신 → 순차 → 기능이다. 기능적 응집도가 가장 높고 좋다.",
    optionNotes: ["가장 낮다.", "낮은 편이다.", "가운데쯤이다.", null],
    importance: "must",
  },
  {
    id: "qd-ui-principle",
    subject: "design",
    sourceId: "d-ui",
    question:
      "UI 설계 원칙 중 '누구나 쉽게 이해하고 사용할 수 있어야 한다'에 해당하는 것은?",
    options: ["직관성", "유효성", "학습성", "유연성"],
    answerIndex: 0,
    explanation:
      "직관성이다. 유효성은 정확하고 빠르게 목표를 이루는 것, 학습성은 쉽게 익히는 것, 유연성은 실수를 줄이고 잘 받아 주는 것이다.",
    optionNotes: [
      null,
      "목표 달성의 정확성·신속성이다.",
      "익히기 쉬움이다.",
      "실수에 대한 너그러움이다.",
    ],
    importance: "high",
  },
  {
    id: "qd-eai-hub",
    subject: "design",
    sourceId: "d-interface",
    question:
      "EAI 구축 유형 중 중앙에 허브를 두고 모든 시스템을 허브에 연결하는 방식은?",
    options: ["Point-to-Point", "Hub & Spoke", "Message Bus", "Hybrid"],
    answerIndex: 1,
    explanation:
      "Hub & Spoke 다. 관리가 쉽지만 허브가 죽으면 전체가 멈춘다. Point-to-Point 는 1:1 로 직접 잇는다.",
    optionNotes: [
      "1:1 로 직접 잇는다.",
      null,
      "공통 버스를 통해 주고받는다.",
      "그룹 안은 허브, 그룹끼리는 버스다.",
    ],
    importance: "high",
  },
  {
    id: "qd-review-inspection",
    subject: "design",
    sourceId: "d-requirement",
    question:
      "제3자인 중재자가 주도하여 명확한 절차에 따라 진행하는 공식적인 요구사항 검토 기법은?",
    options: [
      "동료 검토(Peer Review)",
      "워크스루(Walk-through)",
      "인스펙션(Inspection)",
      "프로토타이핑",
    ],
    answerIndex: 2,
    explanation:
      "인스펙션은 중재자(Moderator)가 이끄는 공식 검토다. 워크스루는 개발자가 주도하는 비공식 검토다.",
    optionNotes: [
      "작성자가 설명하고 동료가 듣는 방식이다.",
      "개발자가 주도하는 비공식 검토다.",
      null,
      "검토 기법이 아니라 견본을 만드는 것이다.",
    ],
    importance: "high",
  },
  {
    id: "qd-scrum-role",
    subject: "design",
    sourceId: "d-agile",
    question: "스크럼에서 제품 백로그의 우선순위를 정하는 역할은?",
    options: ["스크럼 마스터", "제품 책임자(PO)", "개발팀", "프로젝트 관리자"],
    answerIndex: 1,
    explanation:
      "제품 책임자가 제품 백로그를 관리하고 우선순위를 정한다. 스크럼 마스터는 팀이 스크럼을 잘 따르도록 돕고 방해 요소를 없앤다.",
    optionNotes: [
      "팀을 돕고 장애를 걷어 낸다.",
      null,
      "스프린트 백로그를 스스로 정한다.",
      "스크럼의 공식 역할이 아니다.",
    ],
    importance: "high",
  },
];
