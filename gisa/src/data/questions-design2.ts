import type { WrittenQuestion } from "@/lib/types";

/** 1과목 · 소프트웨어 설계 — 보충 2 */
export const DESIGN2_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qd2-waterfall-order",
    subject: "design",
    sourceId: "d-sdlc",
    question: "폭포수 모형의 개발 단계를 순서대로 나열한 것은?",
    options: [
      "타당성 검토 → 계획 → 요구 분석 → 설계 → 구현 → 시험 → 유지보수",
      "계획 → 요구 분석 → 시험 → 설계 → 구현 → 유지보수",
      "요구 분석 → 구현 → 설계 → 시험 → 유지보수",
      "계획 → 설계 → 요구 분석 → 구현 → 시험 → 유지보수",
    ],
    answerIndex: 0,
    explanation:
      "폭포수는 앞 단계가 끝나야 다음으로 간다. 설계보다 요구 분석이 앞이고, 시험은 구현 뒤다.",
    optionNotes: [
      null,
      "시험이 설계보다 앞설 수 없다.",
      "설계가 구현보다 앞이다.",
      "요구 분석이 설계보다 앞이다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-agile-manifesto",
    subject: "design",
    sourceId: "d-agile",
    question: "애자일 선언문이 더 가치 있다고 본 쪽으로 옳지 않은 것은?",
    options: [
      "공정과 도구보다 개인과 상호작용",
      "포괄적인 문서보다 동작하는 소프트웨어",
      "계약 협상보다 고객과의 협력",
      "변화에 대응하기보다 계획을 따르기",
    ],
    answerIndex: 3,
    explanation:
      "네 번째는 뒤집혀 있다. 애자일은 계획을 따르기보다 변화에 대응하는 것을 더 가치 있게 본다.",
    optionNotes: [null, null, null, "정답. 앞뒤가 바뀌었다."],
    importance: "must",
  },
  {
    id: "qd2-scrum-event",
    subject: "design",
    sourceId: "d-agile",
    question:
      "스크럼에서 한 스프린트를 마친 뒤 일하는 방식 자체를 되돌아보는 회의는?",
    options: [
      "스프린트 계획 회의",
      "일일 스크럼",
      "스프린트 검토 회의",
      "스프린트 회고",
    ],
    answerIndex: 3,
    explanation:
      "회고(Retrospective)는 일하는 방식을 돌아본다. 검토 회의(Review)는 만들어 낸 결과물을 본다 — 이 둘을 바꿔 낸다.",
    optionNotes: [
      "계획 회의는 이번 스프린트에 무엇을 할지 정한다.",
      "일일 스크럼은 매일 15분씩 진행 상황을 나눈다.",
      "검토 회의는 결과물을 보여 주고 피드백을 받는다.",
      null,
    ],
    importance: "must",
  },
  {
    id: "qd2-req-spec",
    subject: "design",
    sourceId: "d-requirement",
    question:
      "요구사항 명세 기법 중 정형(Formal) 명세에 대한 설명으로 옳은 것은?",
    options: [
      "사용자의 요구를 자연어로 서술해 이해하기 쉽다.",
      "수학적 기호로 표현해 표현이 간결하고 명확하지만 이해하기 어렵다.",
      "그림과 표로만 나타내어 누구나 읽을 수 있다.",
      "요구사항을 코드로 바로 옮겨 적는다.",
    ],
    answerIndex: 1,
    explanation:
      "정형 명세는 Z, VDM 처럼 수학적 표기를 쓴다. 뜻이 하나로 정해지는 대신 읽기 어렵다. 자연어·다이어그램을 쓰는 것은 비정형 명세다.",
    optionNotes: [
      "자연어 서술은 비정형 명세다.",
      null,
      "그림과 표도 비정형 쪽이다.",
      "명세는 코드가 아니다.",
    ],
    importance: "high",
  },
  {
    id: "qd2-usecase-extend",
    subject: "design",
    sourceId: "d-usecase",
    question:
      "유스케이스 관계 중 조건이 맞을 때만 선택적으로 수행되는 확장 기능을 나타내는 것은?",
    options: [
      "포함(include)",
      "확장(extend)",
      "일반화(generalization)",
      "연관(association)",
    ],
    answerIndex: 1,
    explanation:
      "extend 는 조건부로 덧붙는 흐름이고, include 는 반드시 거치는 공통 흐름이다. 시험은 이 둘을 바꿔 낸다.",
    optionNotes: [
      "include 는 반드시 포함되는 흐름이다.",
      null,
      "일반화는 비슷한 유스케이스를 묶는다.",
      "연관은 액터와 유스케이스를 잇는다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-usecase-actor",
    subject: "design",
    sourceId: "d-usecase",
    question:
      "유스케이스 다이어그램의 액터(Actor)에 대한 설명으로 옳지 않은 것은?",
    options: [
      "시스템과 상호작용하는 사람이 액터가 될 수 있다.",
      "다른 시스템이나 하드웨어도 액터가 될 수 있다.",
      "시스템 내부의 클래스도 액터로 표시한다.",
      "한 액터가 여러 유스케이스와 연결될 수 있다.",
    ],
    answerIndex: 2,
    explanation:
      "액터는 시스템 밖에서 시스템을 쓰는 것이다. 내부 구성 요소는 액터가 아니다.",
    optionNotes: [null, null, "정답. 액터는 시스템 경계 바깥에 있다.", null],
    importance: "high",
  },
  {
    id: "qd2-uml-sequence",
    subject: "design",
    sourceId: "d-uml-basic",
    question: "순차 다이어그램의 구성 요소가 아닌 것은?",
    options: [
      "생명선(Lifeline)",
      "활성 구간(Activation)",
      "메시지(Message)",
      "액티비티(Activity)",
    ],
    answerIndex: 3,
    explanation:
      "순차 다이어그램은 생명선·활성 구간·메시지로 그린다. 액티비티는 활동 다이어그램의 요소다.",
    optionNotes: [null, null, null, "정답. 활동 다이어그램 쪽이다."],
    importance: "high",
  },
  {
    id: "qd2-oop-polymorphism",
    subject: "design",
    sourceId: "d-oop",
    question:
      "같은 이름의 메시지를 받았을 때 객체마다 다르게 반응하는 객체지향 성질은?",
    options: ["캡슐화", "상속", "다형성", "추상화"],
    answerIndex: 2,
    explanation:
      "다형성(Polymorphism)이다. 오버로딩과 오버라이딩이 이것을 이루는 방법이다.",
    optionNotes: [
      "캡슐화는 자료와 기능을 묶고 안을 감춘다.",
      "상속은 상위의 것을 물려받는다.",
      null,
      "추상화는 공통된 것만 뽑아낸다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-oop-class-object",
    subject: "design",
    sourceId: "d-oop",
    question: "클래스와 객체(인스턴스)의 관계로 옳은 것은?",
    options: [
      "클래스는 틀이고, 객체는 그 틀로 만들어 낸 실체다.",
      "객체는 틀이고, 클래스는 그 틀로 만들어 낸 실체다.",
      "클래스와 객체는 같은 말이다.",
      "한 클래스로는 객체를 하나만 만들 수 있다.",
    ],
    answerIndex: 0,
    explanation:
      "클래스는 설계도, 객체는 그것으로 찍어 낸 것이다. 한 클래스로 객체를 여럿 만들 수 있다.",
    optionNotes: [null, "뒤바뀌었다.", "다르다.", "여럿 만들 수 있다."],
    importance: "must",
  },
  {
    id: "qd2-solid-lsp",
    subject: "design",
    sourceId: "d-solid",
    question:
      '"하위 타입은 언제나 상위 타입으로 바꿔 쓸 수 있어야 한다" 는 설계 원칙은?',
    options: [
      "단일 책임 원칙(SRP)",
      "리스코프 치환 원칙(LSP)",
      "인터페이스 분리 원칙(ISP)",
      "의존 역전 원칙(DIP)",
    ],
    answerIndex: 1,
    explanation:
      "리스코프 치환 원칙이다. 상위 타입을 쓰던 자리에 하위 타입을 넣어도 프로그램이 그대로 돌아야 한다.",
    optionNotes: [
      "SRP 는 바뀌는 이유가 하나여야 한다는 원칙이다.",
      null,
      "ISP 는 쓰지 않는 메서드를 강요하지 말라는 원칙이다.",
      "DIP 는 추상화에 의존하라는 원칙이다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-pattern-abstract-factory",
    subject: "design",
    sourceId: "d-pattern-creational",
    question:
      "서로 관련 있는 객체들을 구체적인 클래스를 지정하지 않고 한 묶음으로 만들어 내는 생성 패턴은?",
    options: ["Abstract Factory", "Singleton", "Prototype", "Builder"],
    answerIndex: 0,
    explanation:
      "추상 팩토리다. 제품군을 통째로 갈아 끼울 수 있게 해 준다. 빌더는 하나의 복잡한 객체를 단계별로 조립한다.",
    optionNotes: [
      null,
      "싱글톤은 인스턴스를 하나로 제한한다.",
      "프로토타입은 원본을 복제한다.",
      "빌더는 한 객체를 단계별로 조립한다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-pattern-decorator",
    subject: "design",
    sourceId: "d-pattern-structural",
    question:
      "객체를 감싸 원래 기능을 유지하면서 새 기능을 덧붙이는 구조 패턴은?",
    options: ["Composite", "Decorator", "Bridge", "Flyweight"],
    answerIndex: 1,
    explanation:
      "데코레이터다. 상속으로 기능을 늘리면 조합마다 클래스가 생기는데, 감싸는 방식은 실행 중에도 덧붙일 수 있다.",
    optionNotes: [
      "컴포지트는 전체와 부분을 같은 방식으로 다룬다.",
      null,
      "브리지는 기능과 구현을 따로 뗀다.",
      "플라이웨이트는 같은 것을 공유해 메모리를 아낀다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-pattern-composite",
    subject: "design",
    sourceId: "d-pattern-structural",
    question:
      "객체를 트리 구조로 쌓아, 개별 객체와 그 묶음을 클라이언트가 똑같이 다루게 하는 패턴은?",
    options: ["Proxy", "Facade", "Composite", "Adapter"],
    answerIndex: 2,
    explanation:
      "컴포지트다. 파일과 폴더를 같은 방식으로 다루는 것이 대표 사례다.",
    optionNotes: [
      "프록시는 접근을 대신 제어한다.",
      "퍼사드는 복잡한 하위 체계를 하나의 창구로 만든다.",
      null,
      "어댑터는 맞지 않는 인터페이스를 맞춰 준다.",
    ],
    importance: "high",
  },
  {
    id: "qd2-pattern-strategy",
    subject: "design",
    sourceId: "d-pattern-behavioral",
    question:
      "같은 일을 하는 여러 알고리즘을 각각 클래스로 두고 실행 중에 갈아 끼우는 패턴은?",
    options: [
      "Template Method",
      "Strategy",
      "Chain of Responsibility",
      "Mediator",
    ],
    answerIndex: 1,
    explanation:
      "전략 패턴이다. 템플릿 메서드는 뼈대를 상위에 두고 일부만 하위가 채우는 것으로, 갈아 끼우는 시점이 다르다.",
    optionNotes: [
      "템플릿 메서드는 상속으로 일부만 바꾼다.",
      null,
      "책임 연쇄는 요청을 처리할 수 있는 객체를 찾아 넘긴다.",
      "중재자는 객체들이 서로 직접 얽히지 않게 가운데서 중개한다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-pattern-template",
    subject: "design",
    sourceId: "d-pattern-behavioral",
    question:
      "알고리즘의 뼈대를 상위 클래스에 두고, 일부 단계만 하위 클래스가 채우게 하는 패턴은?",
    options: ["Template Method", "State", "Command", "Iterator"],
    answerIndex: 0,
    explanation:
      "템플릿 메서드다. 전체 순서는 고정하고 달라지는 곳만 하위에 맡긴다.",
    optionNotes: [
      null,
      "상태 패턴은 상태에 따라 행동을 바꾼다.",
      "커맨드는 요청을 객체로 감싼다.",
      "반복자는 내부 구조를 드러내지 않고 차례로 훑게 한다.",
    ],
    importance: "high",
  },
  {
    id: "qd2-arch-layered",
    subject: "design",
    sourceId: "d-architecture",
    question: "계층화(Layered) 아키텍처 패턴에 대한 설명으로 옳은 것은?",
    options: [
      "각 계층은 바로 아래 계층의 서비스만 사용하는 것을 원칙으로 한다.",
      "모든 계층이 서로 자유롭게 호출한다.",
      "계층을 나누면 한 계층을 바꿀 때 전체를 다시 만들어야 한다.",
      "계층이 많을수록 성능이 항상 좋아진다.",
    ],
    answerIndex: 0,
    explanation:
      "계층화는 위가 아래를 쓰는 한 방향을 지킨다. 그래야 한 계층을 갈아 끼워도 나머지가 흔들리지 않는다.",
    optionNotes: [
      null,
      "자유롭게 호출하면 계층을 나눈 뜻이 없다.",
      "반대다. 바꾸기 쉬우라고 나눈다.",
      "계층이 늘면 오히려 거치는 단계가 늘어난다.",
    ],
    importance: "high",
  },
  {
    id: "qd2-ui-prototype-kind",
    subject: "design",
    sourceId: "d-ui",
    question:
      "UI 설계 산출물 중 화면 단위의 레이아웃을 선으로만 간단히 그린 것은?",
    options: ["와이어프레임", "스토리보드", "목업", "프로토타입"],
    answerIndex: 0,
    explanation:
      "와이어프레임은 뼈대만 그린 것, 목업은 실제에 가깝게 꾸민 정적 화면, 프로토타입은 동작까지 흉내 낸 것, 스토리보드는 화면과 설명을 묶은 문서다.",
    optionNotes: [
      null,
      "스토리보드는 화면 흐름과 설명을 함께 담은 문서다.",
      "목업은 실제 화면처럼 꾸민 정적 산출물이다.",
      "프로토타입은 눌러 볼 수 있게 만든 것이다.",
    ],
    importance: "must",
  },
  {
    id: "qd2-interface-format",
    subject: "design",
    sourceId: "d-interface",
    question:
      "속성-값 쌍으로 이루어진 경량 데이터 교환 형식으로, 웹 API 에서 가장 널리 쓰이는 것은?",
    options: ["XML", "JSON", "CSV", "YAML"],
    answerIndex: 1,
    explanation:
      "JSON 이다. XML 보다 가볍고 자바스크립트에서 그대로 다룰 수 있어 인터페이스 데이터 형식으로 널리 쓰인다.",
    optionNotes: [
      "XML 은 태그로 감싸는 형식으로 더 무겁다.",
      null,
      "CSV 는 쉼표로만 구분해 계층을 담지 못한다.",
      "YAML 은 들여쓰기로 구조를 나타내며 설정 파일에 주로 쓴다.",
    ],
    importance: "high",
  },
];
