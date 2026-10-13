import type { Concept } from "@/lib/types";

/* Lecture 2 — DB 시스템 소개 · 아키텍처 · ER 모델 */
export const CONCEPTS_1: Concept[] = [
  // ── intro ──────────────────────────────────────────
  {
    id: "db-dbms",
    chapter: "intro",
    title: "데이터베이스 · DBMS · 데이터베이스 시스템",
    en: "Database / DBMS / Database System",
    importance: "must",
    summary:
      "**Database**는 논리적으로 일관된, 서로 관련된 데이터의 모음이다. **DBMS**는 그 데이터를 구조적으로 효율 있게 \"관리\"하는 소프트웨어이고, **Database System**은 둘을 합친 것(DB + DBMS 소프트웨어)이다.",
    points: [
      "Database: a logically coherent collection of inter-related data",
      "DBMS가 하는 일: 정의(Defining) · 구축(Constructing) · 조작(Manipulating) · 공유(Sharing)",
      "DBMS 예: IBM DB2, Oracle, MS SQL Server, MySQL, SQLite",
      "Database System = Database + DBMS software",
    ],
    trap: "DB와 DBMS를 섞어 쓰면 안 된다. DB는 '데이터'이고 DBMS는 그것을 관리하는 '소프트웨어'다.",
  },
  {
    id: "why-db",
    chapter: "intro",
    title: "파일 대신 DB 시스템을 쓰는 이유",
    en: "Why use database systems?",
    importance: "normal",
    summary:
      "메시지 앱 데이터를 텍스트 파일(한 줄에 하나, 쉼표로 구분)에 저장하면 세 가지가 곤란해진다 — **데이터 무결성**, **데이터 관리**, **데이터 내구성**.",
    points: [
      "Data Integrity: 메시지 길이 제한, 실수로 넣은 중복 친구, 같은 이름의 친구 구분",
      "Data Management: 특정 메시지를 빨리 찾기, 여러 사용자가 동시에 읽고 쓰기",
      "Data Durability: 쓰는 도중 기계가 죽으면? 고장 뒤 어떻게 되살리나?",
    ],
  },
  {
    id: "db-characteristics",
    chapter: "intro",
    title: "DB 시스템의 네 가지 특성",
    en: "Characteristics of the DB System",
    importance: "must",
    summary:
      "DB 시스템은 ① 자기 기술성 ② 데이터 추상화 ③ 여러 뷰 지원 ④ 데이터 공유와 다중 사용자 트랜잭션 처리, 이 네 가지 특성을 가진다.",
    points: [
      "① **Self-Describing Nature**: DB 자체와 함께 메타데이터(구조·제약의 정의)를 담는다. 메타데이터는 **DBMS catalog**에 저장된다",
      "② **Data Abstraction**: 프로그램과 데이터를 떼어 놓는다(insulation). 개념적 표현만 보이고 물리 구조는 숨긴다 → **program-data independence**",
      "③ **Support of Multiple Views**: 사용자마다 다른 뷰. View = DB에서 유도되지만 명시적으로 저장되지는 않는 가상 데이터",
      "④ **Sharing of Data & Multiuser Transaction Processing**: 여러 사용자가 동시에 접근 → **concurrency control** 필요",
      "Transaction: 하나의 논리적 기능을 수행하는 연산들의 모음",
    ],
    example: "여러 예약 직원이 같은 항공편의 좌석을 동시에 배정하려 할 때 — 동시성 제어가 없으면 한 좌석이 두 번 팔린다.",
  },
  {
    id: "db-advantages",
    chapter: "intro",
    title: "DB 시스템의 장점",
    en: "Advantages of the Database Systems",
    importance: "must",
    summary:
      "중복 통제, 무결성 제약 강제, 저장 구조와 효율적 검색(인덱스), 백업과 회복, 그리고 권한 없는 접근 제한.",
    points: [
      "1) **Controlling Redundancy** — 같은 데이터를 여러 곳에 두지 않게",
      "2) **Enforcing Integrity Constraints** — 예: 데이터 항목마다 데이터 타입 지정",
      "3) **Storage Structures & Efficient Search** — DB는 디스크에 있어 느리다 → 메모리에 버퍼링, **인덱스**(보통 B-Tree, B+Tree)",
      "4) **Backup and Recovery** — Backup: 평소에 사본을 만들어 둠 / Recovery: 고장 직전의 최신 상태로 되돌림",
      "5) **Restricting Unauthorized Access**",
    ],
  },
  {
    id: "redundancy",
    chapter: "intro",
    title: "데이터 중복의 문제",
    en: "Data Redundancy",
    importance: "high",
    summary:
      "**Data redundancy**는 같은 데이터를 여러 곳에 여러 번 저장하는 것이다. 세 가지 문제가 생긴다.",
    points: [
      "P1: 논리적으로 한 번인 갱신을 여러 번 해야 한다 (duplication of effort)",
      "P2: 저장 공간 낭비 (HDD·SSD)",
      "P3: 같은 데이터가 서로 **불일치(inconsistent)**해질 수 있다",
      "토론거리: 중복이 늘 나쁜가? — 성능을 위해 일부러 통제된 중복을 두기도 한다",
    ],
  },
  {
    id: "when-not-dbms",
    chapter: "intro",
    title: "DBMS를 쓰지 않는 게 나을 때",
    en: "When not to use a DBMS",
    importance: "high",
    summary:
      "DBMS에는 비용(overhead)이 있다. 단순하고 바뀌지 않는 응용, 엄격한 실시간, 저장 공간이 작은 임베디드, 다중 사용자가 없는 경우엔 맞춤 DB가 낫다.",
    points: [
      "Overheads: 하드웨어·소프트웨어·교육의 높은 초기 투자 / 범용성(generality) 비용 / 보안·동시성 제어·회복·무결성 기능의 비용",
      "맞춤 DB가 나은 경우: 단순하고 잘 정의되어 바뀌지 않는 응용",
      "엄격한 실시간(real-time) 요구를 맞출 수 없을 때",
      "저장 용량이 제한된 임베디드 시스템",
      "다중 사용자 접근이 없을 때",
    ],
  },

  // ── arch ───────────────────────────────────────────
  {
    id: "data-model",
    chapter: "arch",
    title: "데이터 모델과 세 범주",
    en: "Data Model (conceptual · representational · physical)",
    importance: "must",
    summary:
      "**Data abstraction**은 핵심만 드러내고 저장의 세부를 숨기는 것이다. **Data model**은 DB 구조를 기술하는 개념들의 모음으로, 추상화를 이루는 '도구'(데이터 타입·관계·제약, 검색·갱신 연산)를 준다.",
    points: [
      "**Conceptual (high-level)**: 사용자가 데이터를 인식하는 방식에 가까움 — Entity · Attribute · Relationship (예: ER 모델)",
      "**Representational (implementation)**: 둘 사이. 사용자가 이해하기 쉽고 실제 저장과도 멀지 않음 — relation schema, tuple, domain… 상용 DBMS 대부분",
      "**Physical (low-level)**: 컴퓨터에 어떻게 저장되는지 — 레코드 형식, 순서, **access path**. 전문가용",
    ],
    table: {
      title: "세 범주 한눈에",
      headers: ["범주", "수준", "다루는 것"],
      rows: [
        ["Conceptual", "high-level", "entity, attribute, relationship"],
        ["Representational", "중간", "relation, tuple, attribute, domain"],
        ["Physical", "low-level", "record format, ordering, access path"],
      ],
    },
  },
  {
    id: "three-schema",
    chapter: "arch",
    title: "3단계 스키마 구조",
    en: "Three-Schema Architecture",
    importance: "must",
    summary:
      "목표는 **사용자 응용을 물리 DB에서 떼어 놓는 것**(프로그램과 데이터의 독립). 내부 · 개념 · 외부 세 수준으로 나누고, 수준 사이를 **mapping**으로 잇는다.",
    points: [
      "**Internal level** — internal schema: 물리 저장 구조. **physical data model**로 저장 세부와 access path 기술",
      "**Conceptual level** — conceptual schema: 전체 DB의 논리 구조. **representational data model**로 기술. 물리 세부를 숨김 (entity, data type, relationship, 연산, 제약)",
      "**External (view) level** — external schema: 특정 사용자 그룹이 관심 있는 부분만. 나머지는 숨김",
      "**Mapping**: 실제 데이터는 물리 수준에만 있다. DBMS가 상위 스키마의 요청·결과를 하위 스키마로 변환한다",
    ],
    trap: "Conceptual schema 를 기술하는 데 쓰는 것은 conceptual data model 이 아니라 **representational** data model 이다 (강의 자료 기준).",
  },
  {
    id: "data-independence",
    chapter: "arch",
    title: "데이터 독립성 (논리·물리)",
    en: "Data Independence",
    importance: "must",
    summary:
      "**Data independence**는 한 수준의 스키마를 바꿔도 바로 위 수준의 스키마를 바꾸지 않아도 되는 능력이다. DBMS의 가장 중요한 특징 중 하나로, 기존 응용 프로그램의 유지보수 부담을 크게 줄인다.",
    points: [
      "**Logical data independence**: **conceptual schema**를 바꿔도 external schema·응용 프로그램은 그대로",
      "**Physical data independence**: **internal schema**를 바꿔도 conceptual schema(그리고 external)는 그대로",
      "어느 쪽이든 external schema를 참조하는 기존 응용 프로그램을 다시 짤 필요가 없다",
    ],
    table: {
      title: "무엇을 바꿔도 되는가",
      headers: ["독립성", "바뀌는 쪽", "그대로인 쪽"],
      rows: [
        ["Logical", "Conceptual schema", "External schema · 응용"],
        ["Physical", "Internal schema", "Conceptual schema (·External)"],
      ],
    },
    example: "인덱스를 새로 만들거나 파일 구성을 바꾸는 것 → 물리적 독립성. 테이블에 속성을 추가하는 것 → 논리적 독립성.",
  },
  {
    id: "design-process",
    chapter: "arch",
    title: "데이터베이스 설계 과정",
    en: "Database Design Process",
    importance: "high",
    summary:
      "요구사항 수집·분석 → 개념 설계 → 구현(논리 설계 + 물리 설계)의 세 단계로 진행한다.",
    points: [
      "Phase 1 **Requirements Collection & Analysis**: 사용자의 데이터 요구를 모으고 분석 → 출력: 상세 요구사항",
      "Phase 2 **Conceptual Design**: 데이터 모델을 고르고 요구사항을 **conceptual schema**로 옮김 (ER 다이어그램)",
      "Phase 3 **Implementation**: **Logical design**(DB 스키마) + **Physical design**(DB의 물리 배치)",
    ],
  },

  // ── er ─────────────────────────────────────────────
  {
    id: "er-model",
    chapter: "er",
    title: "ER 모델과 좋은 설계",
    en: "Entity-Relationship (ER) Model",
    importance: "high",
    summary:
      "ER 모델은 데이터를 **엔티티들과 그 사이의 관계의 모음**으로 기술하고 **ER diagram**으로 그린다. 인스턴스보다 **스키마**에 초점을 둔다.",
    points: [
      "Entity: 다른 것과 구별되는 '것' 또는 '객체'",
      "Relationship: 여러 엔티티 사이의 연관(association)",
      "나쁜 설계의 두 증상: **Redundancy**(정보 반복) · **Incompleteness**(어떤 면을 모델링하기 어려움)",
    ],
  },
  {
    id: "entity-attribute",
    chapter: "er",
    title: "엔티티와 속성",
    en: "Entity & Attribute",
    importance: "high",
    summary:
      "**Entity**는 독립적으로 존재하는 현실의 것이다. 물리적으로 존재하는 것(사람·차·집·학생)도, 개념적으로 존재하는 것(회사·부서·프로젝트)도 엔티티다. **Attribute**는 엔티티를 기술하는 성질이다.",
    points: [
      "물리적 존재: person, car, house, student, employee",
      "개념적 존재: company, department, project",
      "예: STUDENT의 속성 — name, age, address, gender, phone number, birth date",
    ],
  },
  {
    id: "attribute-types",
    chapter: "er",
    title: "속성의 세 가지 분류",
    en: "Composite/Simple · Single/Multivalued · Stored/Derived",
    importance: "must",
    summary: "속성은 세 축으로 나뉜다 — 쪼갤 수 있는가, 값이 하나인가, 저장하는가.",
    points: [
      "**Composite**: 더 작은 부분으로 나뉨(계층) — Address = Street_address, City, State, Zip / **Simple(atomic)**: 나눌 수 없음",
      "**Single-valued**: 한 엔티티에 값 하나 — age, SSN / **Multivalued**: 값의 집합 — phone numbers, college degrees",
      "**Stored**: 실제로 저장 — birth date / **Derived**: 다른 속성에서 유도 — age (birth date에서)",
    ],
    table: {
      title: "ER 다이어그램 표기 (Chen)",
      headers: ["종류", "표기"],
      rows: [
        ["Key attribute", "밑줄 친 이름의 타원"],
        ["Multivalued", "이중 타원"],
        ["Derived", "점선 타원"],
        ["Composite", "타원에서 하위 타원이 가지를 침"],
      ],
    },
    trap: "age는 '단일값'이면서 '유도' 속성이다. 분류의 세 축은 서로 독립이다.",
  },
  {
    id: "entity-type-key",
    chapter: "er",
    title: "엔티티 타입·집합과 키 속성",
    en: "Entity Type, Entity Set, Key Attribute",
    importance: "must",
    summary:
      "**Entity type**은 이름과 속성으로 기술되고, **entity set**은 같은 속성 집합을 가진 엔티티들의 모음이다. **Key attribute**는 각 엔티티마다 값이 서로 달라 엔티티를 유일하게 식별하는 속성이다.",
    points: [
      "예: STUDENT의 student number, PERSON의 SSN",
      "여러 속성을 묶어 키를 만들 수 있다 — 그 조합의 값이 엔티티마다 달라야 한다",
      "한 엔티티 타입이 키를 둘 이상 가질 수 있다 (예: DEPARTMENT의 Name과 Number 모두 키)",
      "다이어그램에서 키 속성은 **밑줄**",
    ],
  },
  {
    id: "relationship-type",
    chapter: "er",
    title: "관계 타입 · 차수 · 역할 · 순환 관계",
    en: "Relationship Type, Degree, Role, Recursive",
    importance: "must",
    summary:
      "**Relationship type**은 이름과 참여하는 엔티티 타입으로 기술되고, 그 사이 연관들의 집합(**relationship set**)을 정의한다. relationship instance rᵢ는 각 엔티티 집합 Eⱼ에서 엔티티 하나씩(e₁…eₙ)을 묶는다.",
    points: [
      "**Degree**: 참여하는 엔티티 타입의 수 — binary(2), ternary(3)… 대부분은 binary",
      "**Role name**: 참여 엔티티가 각 관계에서 맡는 역할 (WORKS_FOR에서 EMPLOYEE = worker, DEPARTMENT = employer)",
      "**Recursive relationship**: 같은 엔티티 타입이 한 관계에 두 번 이상 참여 → 역할 이름이 꼭 필요 (SUPERVISION: supervisor / supervisee)",
    ],
  },
  {
    id: "cardinality",
    chapter: "er",
    title: "카디널리티 비율",
    en: "Cardinality Ratio (1:1, 1:N, M:N)",
    importance: "must",
    summary:
      "**Cardinality ratio**는 한 엔티티가 참여할 수 있는 관계 인스턴스의 **최대** 수를 정한다. 이항 관계에는 1:1, 1:N, M:N 세 가지가 있다.",
    points: [
      "1:1 — MANAGES (사원 한 명이 부서 하나를 관리, 부서마다 관리자 한 명)",
      "1:N — WORKS_FOR (부서 1 : 사원 N), CONTROLS (부서 1 : 프로젝트 N)",
      "M:N — WORKS_ON (사원은 여러 프로젝트, 프로젝트엔 여러 사원)",
    ],
    trap: "카디널리티는 '최대'를, 참여 제약은 '최소(0이냐 1 이상이냐)'를 말한다. 둘을 합친 것이 (min, max) 표기다.",
  },
  {
    id: "participation",
    chapter: "er",
    title: "참여 제약과 (min, max) 표기",
    en: "Participation Constraint (total / partial)",
    importance: "must",
    summary:
      "**Participation constraint**는 엔티티의 존재가 다른 엔티티와의 관계에 달려 있는지를 정한다. **Total**은 모든 엔티티가 반드시 참여(이중선), **Partial**은 참여하지 않아도 됨(단일선).",
    points: [
      "Total participation = 최소 카디널리티 1 이상 (existence dependency)",
      "Partial participation = 최소 카디널리티 0",
      "(min, max) 표기: 각 엔티티가 관계에 최소 min번, 최대 max번 참여 (0 ≤ min ≤ max, max ≥ 1)",
      "예(Practice 1): 논문은 심사위원 2~4명 → PAPER 쪽 (2,4) — total",
    ],
    example:
      "강의 연습문제 2 — 강좌는 교재를 안 쓸 수도(0), 다섯 권보다 많이는 못 씀(5) → (0,5). 강좌는 강사 1~4명 → (1,4). 강사는 2~4강좌 → (2,4).",
  },
  {
    id: "relationship-attribute",
    chapter: "er",
    title: "관계 타입의 속성",
    en: "Attributes of Relationship Types",
    importance: "high",
    summary:
      "관계 타입도 속성을 가질 수 있다. 1:1과 1:N이면 그 속성을 참여 엔티티 쪽으로 옮길 수 있지만, M:N에서는 두 엔티티의 **조합**으로만 정해지는 속성이라 옮길 수 없다.",
    points: [
      "1:1 — 어느 쪽 엔티티로든 옮길 수 있음 (MANAGES의 Manager_start_date → DEPARTMENT 또는 EMPLOYEE)",
      "1:N — **N쪽** 엔티티로만 옮길 수 있음",
      "M:N — 옮길 수 없음. 예: WORKS_ON의 **Hours**는 (사원, 프로젝트) 조합으로 정해진다",
    ],
  },
  {
    id: "weak-entity",
    chapter: "er",
    title: "약한 엔티티 타입",
    en: "Weak Entity Type",
    importance: "must",
    summary:
      "**Weak entity type**은 자기 안에 키 속성이 없는 엔티티 타입이다. **소유(identifying, owner) 엔티티 타입**에 의존하며, 둘을 잇는 관계가 **identifying relationship**이다. 약한 엔티티는 언제나 **total participation**.",
    points: [
      "**Partial key**: 같은 소유자에 딸린 약한 엔티티끼리 구별하는 속성 (점선 밑줄)",
      "예1: EMPLOYEE–DEPENDENT — Dependent_name이 partial key",
      "예2: COURSE–SECTION — Section_num이 partial key",
      "partial key 혼자서는 식별 못 함 → 소유자의 키와 함께 쓴다",
      "표기: 약한 엔티티는 이중 사각형, identifying relationship은 이중 마름모",
    ],
  },
  {
    id: "er-refine-company",
    chapter: "er",
    title: "COMPANY 개념 설계 다듬기",
    en: "Refining Conceptual Design (COMPANY)",
    importance: "high",
    summary:
      "처음엔 관계를 속성(Manager, Department, Supervisor, Works_on…)으로 적어 두었다가, 다듬는 단계에서 그 속성들을 **관계 타입으로 바꾼다**.",
    points: [
      "MANAGES: EMPLOYEE–DEPARTMENT, **1:1**, EMPLOYEE partial · DEPARTMENT total, 속성 Manager_start_date",
      "WORKS_FOR: DEPARTMENT(1)–EMPLOYEE(N), **1:N**, 둘 다 total",
      "CONTROLS: DEPARTMENT(1)–PROJECT(N), **1:N**, PROJECT total · DEPARTMENT partial",
      "SUPERVISION: EMPLOYEE–EMPLOYEE (순환), **1:N**, 둘 다 partial",
      "WORKS_ON: EMPLOYEE–PROJECT, **M:N**, 둘 다 total, 속성 Hours",
      "DEPENDENTS_OF: EMPLOYEE(소유)–DEPENDENT(약한), **1:N**, EMPLOYEE partial · DEPENDENT total",
    ],
  },
  {
    id: "er-design-steps",
    chapter: "er",
    title: "ER 스키마 설계 3단계 (실습)",
    en: "Process of Designing ER Schema",
    importance: "high",
    summary:
      "(1) 요구사항에서 엔티티 타입과 속성을 적는다 → (2) 관계 타입과 제약을 정한다 → (3) 관계를 나타내던 속성을 관계 타입으로 바꾼다.",
    points: [
      "MOVIE 실습: MOVIE 키 = (Title, Year), Genre는 다중값 속성",
      "PRODUCES: PRODUCTION(1)–MOVIE(N), MOVIE total",
      "ACTS: ACTOR–MOVIE, **M:N**, 관계 속성 Role과 Quotes(다중값), 둘 다 total",
      "DIRECTS: DIRECTOR–MOVIE, **M:N**, MOVIE total",
      "CONFERENCE 실습: SUBMITS(AUTHOR–PAPER) M:N 둘 다 total · IS_CONTACT는 PAPER total, AUTHOR partial · REVIEWS는 PAPER (2,4), REVIEWER (1,N)",
    ],
  },
];
