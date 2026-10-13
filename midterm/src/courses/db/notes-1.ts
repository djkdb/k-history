import type { NoteSection } from "@/lib/types";

/** DB 강의 노트 (1) — Week 1 Course Overview · Lecture 2 · Practice 1 */
export const NOTES_1: Record<string, NoteSection[]> = {
  intro: [
    {
      title: "Week 1 — 과목 안내",
      en: "Course Overview",
      lines: [
        "강의: **Yoon Suk Kang** (Assistant Professor @ CBNU) — 연구: Data mining, graph algorithms, network science / Data Mining Lab",
        "이론 화 1:00–2:50 pm (Room 106), 실습 금 9:00–10:50 am (Room 106), TA: Hojin Kim (실습, Q&A, 채점 보조)",
        "교재: **Fundamentals of Database Systems 7th ed. (Elmasri & Navathe)** — 권장, 필수 아님",
        "선수: 자료구조 / 기초 프로그래밍. 프로그래밍 수업이 아니지만 프로그래밍 과제가 있다. 사용자 쪽(DB 설계)뿐 아니라 **DB 내부 시스템**도 다룬다",
        "일정 (tentative): 1 Introduction · 2 Intro to DB Systems & Conceptual Modeling · 3 Relational DB & ER-to-Relational Mapping · 4 Basic & Advanced SQL · 5 Hands-on Practice: SQL with AI · **6 Functional Dependencies and Normalization** · 7 Relational Algebra · 8 **Midterm**",
        "후반: 9 Disk Storage · 10 Indexing · 11 Query Processing & Optimization · 12 Transaction · 13 Concurrency Control & Recovery · 14 Knowledge Discovery · 15 Final · 16 Make-up",
        "휴강(변경 가능): 11주차 11/10(화), 11/12(금)",
        "평가: **Mid-term 35% · Final 35% · Assignments 20% · Attitude & Attendance 10%**",
        "시험: **Mid-term 10/23(금) 9:00 am, Room 106 & 104** / Final 12/11(금) — 휴일에 따라 바뀔 수 있음",
        "· 시험지는 **영어**, 답은 **한국어**로 써도 된다 / 부정행위 시 성적 없음 / 책상에는 **필기구만**",
        "과제: Lab reports 5% + Programming 15%, 마감 11:59 PM, 지각 +1일 75%·+2일 50%·+3일 불가, 하나라도 미제출 시 '+' 학점 불가, 전부 미제출 시 학점 없음, 표절 0점, **Python만**",
        "출석: 전체 수업의 25% 넘게 결석 시 학점 없음, 1회 결석은 감점 없음, **지각 2번 = 결석 1번**",
        "eCampus 자주 확인, 학업 윤리 무관용, 토론은 자유지만 답은 혼자 작성",
      ],
    },
    {
      title: "Week 1 — DB와 DBMS, 왜 배우나",
      en: "What is a Database / DBMS, Why we learn",
      lines: [
        "**Database**: 컴퓨터 시스템에 저장된, 조직화된 구조적 데이터의 모음 — 보통 DBMS가 '관리'",
        "**DBMS**: 데이터를 구조적으로 효율적으로 '관리'하도록 설계된 SW — 데이터 조작(생성·저장·검색·수정·삭제), **동시성 제어, 백업·복구, 보안, 무결성, 일관성**",
        "실세계 응용: 전자상거래(고객·상품·거래·배송), 은행·금융(사용자·계좌·금융 거래), SNS(사용자·콘텐츠·관계·메시지), 대학·도서관(학생·과목·책·저자), 항공·철도 예약(고객·예약·노선)",
        "DBMS가 없다면? → 파일을 쓰면 될까? (Lecture 2에서 답)",
        "AI 시대의 DB: 경쟁이 아니라 **협력** — AI를 위한 DB 시스템: **VectorDB** (이미지·텍스트·오디오 같은 비정형 데이터를 **임베딩 벡터**로 저장)",
        "배울 것 Part 1 (1–8주) **How to 'Use'**: DB와 DBMS 소개, ER 모델, 관계형 DB, Basic/Advanced SQL with AI, 함수 종속과 정규화, 관계 대수",
        "Part 2 (9–15주) **How to 'Implement'**: 파일 구조·저장 관리, 인덱싱·물리 설계, 질의 처리·최적화, 트랜잭션·동시성 제어, 복구 — 문제가 생기면 DBA가 필요, AI가 가까운 미래에 DBA를 완전히 대체하진 못한다",
        "목표: DB·DBMS 원리 이해 / 기본·고급 SQL을 AI와 함께 능숙하게 / 실세계 응용을 위한 DB 시스템 구현",
      ],
    },
    {
      title: "Lecture 2 — DB 시스템이란",
      en: "What is a Database System?",
      lines: [
        "**Database (DB)**: 서로 관련된 데이터의 **논리적으로 일관된(logically coherent)** 모음 — DBMS가 관리",
        "**DBMS**: 데이터를 구조적으로 효율적으로 관리하는 SW — **Defining, constructing, manipulating, and sharing** databases",
        "· 예: IBM DB2, Oracle, MS SQL Server, MySQL, SQLite",
        "**Database System = Database + DBMS software**",
      ],
    },
    {
      title: "왜 DB 시스템을 쓰나 — 메신저 앱 예",
      en: "Why use database systems?",
      lines: [
        "간단한 메신저 앱 데이터: 친구 정보(이름, 전화번호, isAdvertisement…), 메시지 정보(텍스트, 보낸 사람, 날짜…)",
        "텍스트 파일로 저장: 한 줄에 하나, 속성은 쉼표로 구분",
        "**Data Integrity**: 메시지 총 길이를 어떻게 관리? 실수로 같은 친구를 두 번 넣으면? 이름이 같은 친구가 있으면?",
        "**Data Management**: 특정 메시지를 어떻게 빨리 찾나? 여러 사용자가 동시에 읽고 쓰면?",
        "**Data Durability**: 앱이 새 항목을 쓰는 중 기계가 꺼지면? 크래시 뒤 파일을 어떻게 복구?",
        "→ \"There are a number of technical issues to be addressed — **Let's use DBMS!**\"",
      ],
    },
    {
      title: "DB 시스템의 특성",
      en: "Characteristics of the DB System",
      lines: [
        "**1) Self-Describing Nature**: DB 시스템은 DB 자체와 **메타데이터**(DB 구조와 제약의 정의)를 함께 담는다 — 메타데이터는 **DBMS catalog**에 저장, DB 유지에 필요",
        "· 카탈로그 예: COLUMNS(Column_name, Data_type, Belongs_to_relation) — Name: Character(30), STUDENT …",
        "**2) Data Abstraction**: 프로그램과 데이터 사이의 **격리(insulation)** — 개념적 표현(논리 수준: 객체, 속성, 상호관계)을 제공하고 복잡한 물리 구조는 포함하지 않는다 → 자료 구조를 바꿔도 프로그램에 영향 없음 (**program-data independence**)",
        "**3) Support of Multiple Views**: 사용자마다 다른 view가 필요 — **View**: DB에서 유도된 가상 데이터, 명시적으로 저장되지 않음",
        "**4) Sharing of Data & Multiuser Transaction Processing**: 여러 사용자가 동시에 접근, 여러 앱의 데이터를 한 DB에 통합·유지 — 예: 여러 예약 담당자가 같은 항공편 좌석을 배정 → **동시성 제어** 필요",
        "· **Transaction**: 하나의 논리적 기능을 수행하는 연산들의 모음",
      ],
    },
    {
      title: "DB 시스템의 장점",
      en: "Advantages of the Database Systems",
      lines: [
        "**1) Controlling Redundancy** — 데이터 중복: 같은 데이터를 다른 곳에 여러 번 저장",
        "· P1 하나의 논리적 갱신을 여러 번 해야 함 (**duplication of effort**)",
        "· P2 저장 공간 **낭비** (HDD, SSD)",
        "· P3 같은 데이터가 **불일치(inconsistent)**할 수 있다 — 예: STUDENT에는 17번이 Smith인데 GRADE_REPORT에는 17번 이름이 Brown으로 잘못 들어감 → \"각 논리적 데이터는 한 곳에만 저장하자!\" (→ 6주차 정규화)",
        "· 토론: 중복은 항상 나쁜가? 이 학생의 이름은? 이 과목의 이름은? — 매번 다른 표를 찾아가야 한다 → **Controlled redundancy is sometimes necessary! (Denormalization)**",
        "**2) Enforcing Integrity Constraints** — 데이터가 반드시 지켜야 할 제약, DBMS가 정의·강제 기능 제공 (예: 데이터 항목마다 타입 지정)",
        "· 강사가 기존 과목명과 같은 새 과목을 만들면? → **Key constraint** (Course_name은 유일)",
        "· 어떤 과목과도 관련 없는 section이 생기면? → **Referential integrity constraint** (section은 과목 레코드와 관련되어야) → 4주차",
        "**3) Storage Structures and Efficient Searching** — DB는 크기 때문에 **디스크**에 저장(매우 느림), 처리하려면 메인 메모리로 올려야(buffering/caching) → 원하는 레코드를 빨리 찾게 특수 자료 구조와 검색 기법 = **Indexing**: 보조 파일, 보통 트리 구조(**B-Tree, B+Tree**)",
        "**4) Providing Backup and Recovery** — 복잡한 갱신 트랜잭션 중 시스템이 실패하면? HW·SW 실패로부터 복구하는 기능 / Backup: 정상 처리 중 미래 복구를 위해 DB 사본 생성 / Recovery: 실패 **직전의 최신 상태**로 복구",
      ],
    },
    {
      title: "DBMS를 쓰지 않을 때",
      en: "When not to use a DBMS?",
      lines: [
        "**DBMS의 오버헤드**: HW·SW·교육의 **높은 초기 투자** / 데이터 정의·처리의 **범용성(generality)** / 보안·동시성 제어·복구·무결성 기능",
        "**맞춤 DB가 더 나은 경우**:",
        "· 단순하고 잘 정의되어 **전혀 바뀌지 않을** 앱",
        "· 만족하기 어려운 **엄격한 실시간** 요구",
        "· 저장 공간이 제한된 **임베디드 시스템** (범용 DBMS 불필요)",
        "· **여러 사용자의 접근이 없음**",
      ],
    },
    {
      title: "요약 — DB 시스템 개념",
      lines: [
        "Database, DBMS, Database System",
        "특성: Self-describing nature · Data abstraction · Support of multiple views · Sharing of data and multiuser transaction processing",
        "장점: Controlling redundancy · Enforcing integrity constraints · Storage structures and efficient search techniques · Backup and recovery · **Restricting unauthorized access** · …",
      ],
    },
  ],

  arch: [
    {
      title: "데이터 모델",
      en: "What is a Data Model?",
      lines: [
        "**Data Abstraction**: 데이터 이해에 필요한 핵심 특징을 강조(highlighting) → 사용자마다 원하는 상세 수준으로 인식 / 데이터 조직·저장의 세부를 감춤(suppression)",
        "**Data Model**: DB 구조를 기술하는 **개념들의 모음** — 데이터 추상화를 이루는 '도구' (데이터 타입, 관계, 제약 / 검색·갱신의 기본 연산)",
        "세 범주 (DB 구조를 어떻게 기술하나): **Conceptual (high-level)** · **Representational (그 사이)** · **Physical (low-level)**",
      ],
    },
    {
      title: "개념 · 표현 · 물리 데이터 모델",
      lines: [
        "**Conceptual**: 사용자가 데이터를 인식하는 방식에 가까운 개념 — **Entity**(실세계 객체·개념), **Attribute**(엔티티를 설명하는 관심 성질), **Relationship**(둘 이상 엔티티의 연관) / 예: Company DB / DB를 만들기 전 **신중한 요구 분석** 필요 → Conceptual Design",
        "**Representational**: 개념과 물리 사이 — 최종 사용자가 이해하기 쉬우면서 데이터 조직 방식과 너무 멀지 않음 (relation schema, relation state, attribute, tuple, domain…) / **대부분의 상용 DBMS**에서 사용",
        "**Physical**: 데이터가 컴퓨터에 어떻게 저장되는지 — **레코드 형식, 순서, 접근 경로** / 최종 사용자가 아닌 **컴퓨터 전문가**용",
      ],
    },
    {
      title: "3단계 스키마 구조",
      en: "Three-Schema Architecture",
      lines: [
        "목표: **사용자 앱을 물리 DB와 분리** — 사용자 프로그램과 데이터 사이의 독립성",
        "그림: End Users → External View들 → (External/Conceptual Mapping) → Conceptual Schema → (Conceptual/Internal Mapping) → Internal Schema → Stored Database",
        "**Internal Level**: Internal schema — DB의 **물리 저장 구조** 기술, **physical data model**로 저장 세부와 접근 경로를 기술",
        "**Conceptual Level**: Conceptual schema — DB의 **논리 구조** 기술, **representational data model**로 기술, 물리 저장 세부를 감추고 고수준 개념(엔티티, 데이터 타입, 관계, 사용자 연산, 제약)에 집중",
        "**External (View) Level**: External schema — 특정 사용자 그룹이 관심 있는 **DB 구조의 일부**를 기술, 나머지는 그 그룹에게 숨김",
        "**Mapping**: 수준 사이의 요청과 결과를 변환 — **실제 데이터는 물리 수준에만** 저장, DBMS는 고수준 스키마의 요청을 저수준 스키마의 요청으로 변환해야",
      ],
    },
    {
      title: "3단계 스키마 예 — University DB",
      lines: [
        "External Schema 1 (Dept-A): ST(SN INT, NAME CHAR(10), GRADE INT, DEPT CHAR(5))",
        "External Schema 2 (Dept-B): STUDENT(SNO PIC 9(4), SNAME PIC X(10), YEAR PIC 9(2), ADDR PIC X(44)) — 사용자 그룹이 관심 있는 부분",
        "Conceptual Schema: STUDENT(SNUMBER INTEGER, NAME CHAR(10), YEAR SMALLINT, GRADE SMALLINT, DEPT CHAR(5), ADDRESS CHAR(44)) — 고수준 개념: 엔티티, 데이터 타입, 관계, 연산, 제약",
        "Internal Schema: STORED-STUDENT LENGTH=71, prefix BYTE(4) OFFSET=0, SNO BYTE(4) OFFSET=4, SNAME BYTE(10) OFFSET=8, SYEAR BYTE(2) OFFSET=18, SGRADE BYTE(2) OFFSET=20, SDEPT BYTE(5) OFFSET=22, SADDR BYTE(44) OFFSET=27, INDEX=STINDX — 저장과 접근 경로의 완전한 세부",
      ],
    },
    {
      title: "데이터 독립성",
      en: "Data Independence",
      lines: [
        "정의: 한 수준의 스키마를 바꿀 때 **바로 위 수준의 스키마를 바꾸지 않아도 되는** 능력",
        "**Logical Data Independence**: **Conceptual schema**를 바꿔도 external schema나 응용 프로그램을 바꿀 필요 없음 — external schema를 참조하는 기존 앱을 다시 쓸 필요 없음",
        "**Physical Data Independence**: **Internal schema**를 바꿔도 conceptual schema(그리고 external schema)를 바꿀 필요 없음",
        "중요성: DBMS의 **가장 중요한 특징** 중 하나 — 기존 응용 프로그램의 **유지보수 오버헤드를 크게 줄인다**",
      ],
    },
    {
      title: "요약 — DB 시스템 구조",
      lines: [
        "Data Model: DB 구조를 기술하는 개념의 모음 — Conceptual(사용자 인식에 가까움) · Representational(그 사이) · Physical(저장 방식)",
        "Three-Schema: Internal(물리 저장 구조) · Conceptual(논리 구조) · External(일부, 나머지 숨김) · Mapping(수준 간 변환)",
        "Data Independence: Logical · Physical",
      ],
    },
    {
      title: "DB 설계 과정",
      en: "Database Design Process",
      lines: [
        "**Phase 1: Requirements Collection and Analysis** — 예상 사용자의 데이터 요구를 파악, DB 데이터 요구사항 수집·분석 → 출력: 사용자 상세 요구사항",
        "**Phase 2: Conceptual Design** — 데이터 모델 선택, 요구사항을 **conceptual schema**로 번역",
        "**Phase 3: Implementation** — 개념 스키마로 DB 구현: **Logical design**(DB 스키마) / **Physical design**(물리 배치)",
      ],
    },
  ],

  er: [
    {
      title: "요구 분석 — COMPANY DB",
      en: "Requirement Analysis",
      lines: [
        "회사의 직원, 부서, 프로젝트를 관리하고 싶다",
        "**Department**: 회사는 부서로 조직 — 각각 고유 이름, 고유 번호, 위치들, 관리자, 관리자 시작일…",
        "**Project**: 부서는 여러 프로젝트를 통제 — 각각 고유 이름, 고유 번호, 위치 하나, 통제 부서",
        "**Employee**: 회사에서 일함 — 이름, SSN, 주소, 월급, 성별, 생년월일, 참여 프로젝트…",
        "**Dependent**: 보험 목적으로 직원의 부양가족 필요 — 이름, 성별, 생년월일, 직원과의 관계…",
      ],
    },
    {
      title: "개념적 데이터 모델링 — ER 모델",
      en: "Entity-Relationship Model",
      lines: [
        "데이터를 **엔티티와 관계의 모음**으로 기술 — Entity: 다른 것과 구별되는 '사물·객체' / Relationship: 여러 엔티티 사이의 연관",
        "**ER diagram**으로 그림 표현",
        "좋은 설계 고르기: **Redundancy**(나쁜 설계는 정보를 반복) / **Incompleteness**(나쁜 설계는 일부 데이터를 모델링하기 어렵게 함)",
      ],
    },
    {
      title: "엔티티와 속성",
      en: "Entities and Attributes",
      lines: [
        "**Entity**: 실세계에서 **독립적으로 존재**하는 사물·객체 — 물리적 존재(사람, 차, 집, 학생, 직원) / 개념적 존재(회사, 부서, 프로젝트)",
        "**Attribute**: 엔티티를 설명하는 특정 성질 — 학생: 이름, 나이, 주소, 성별, 전화번호, 생일",
        "예: Employee(Name, address, age, home_phone), Company(Name, headquarters, president)",
      ],
    },
    {
      title: "속성의 분류",
      en: "Categorization of Attributes",
      lines: [
        "**Composite vs Simple(atomic)**: 복합 = 더 작은 부분으로 나뉨(계층) — address = Street_address, city, state, zip / 단순 = 나눌 수 없음 — city, state, zip, number, street, apartment_number",
        "**Single-valued vs Multivalued**: 단일 = 엔티티마다 값 하나(대부분: age, gender, birth date, SSN) / 다중 = 같은 엔티티에 값의 집합(phone numbers, college degrees)",
        "**Stored vs Derived**: 저장 = DB에 실제로 저장(birth date) / 유도 = 저장하지 않고 다른 것으로 유도(age ← birth date)",
      ],
    },
    {
      title: "엔티티 타입 · 집합 · 키 속성",
      en: "Entity Type and Set, Key Attributes",
      lines: [
        "**Entity Type**: 이름과 속성으로 기술 / **Entity Set**: 같은 속성 집합을 가진 엔티티들의 집합",
        "**Key Attribute**: 각 엔티티마다 값이 서로 다른 속성 — 엔티티를 유일하게 식별 (STUDENT의 학번, PERSON의 SSN)",
        "여러 속성이 함께 키가 될 수 있다 — 값의 **조합**이 엔티티마다 달라야",
        "엔티티 타입은 키를 둘 이상 가질 수 있다",
        "표현 예: CAR — Registration(Number, State) 복합 키, Vehicle_id 키, Make, Model, Year, {Color} 다중값",
      ],
    },
    {
      title: "ER 표기법",
      en: "Notation of the ER Diagram",
      lines: [
        "**네모** = Entity / **이중 네모** = Weak Entity",
        "**마름모** = Relationship / **이중 마름모** = Identifying Relationship",
        "**타원** = Attribute / **밑줄 타원** = Key Attribute / **이중 타원** = Multivalued / 가지 친 타원 = Composite / **점선 타원** = Derived",
        "E1 —R== E2 (**이중선**) = E2의 **Total Participation**",
        "E1 —1— R —N— E2 = Cardinality Ratio 1:N",
        "R —(min, max)— E = E가 R에 참여하는 **Structural Constraint**",
        "예: Employee —1— Manage —1═ Department, 또는 Employee (0,1) — Manage — (1,1) Department",
      ],
    },
    {
      title: "COMPANY 초기 개념 설계",
      en: "Initial Conceptual Design",
      lines: [
        "**DEPARTMENT**: Name, Number, Locations, Manager, Manager_start_date — Name·Number가 **키**(밑줄), Locations는 **다중값**",
        "**PROJECT**: Name, Number, Location, Controlling_department — Name·Number가 키",
        "**EMPLOYEE**: Name, SSN, Address, Salary, Birth_date, Sex, Department, Supervisor, Works_on — **SSN 키**, Name은 **복합**(Fname, Minit, Lname), 여러 프로젝트에서 일하며 프로젝트별 주당 시간 관리",
        "**DEPENDENT**: Employee, Dependent_name, Sex, Birth_date, Relationship",
        "엔티티만으로 관계를 모델링하기에 충분한가? → 관계 타입 필요",
      ],
    },
    {
      title: "관계 타입 · 집합 · 인스턴스",
      en: "Relationship Types, Sets, and Instances",
      lines: [
        "**Relationship Type**: 이름과 참여 엔티티 타입으로 기술, 참여 엔티티 타입 사이의 연관 집합을 정의",
        "**Relationship Set**: 관계 인스턴스 ri의 집합 — ri는 n개의 개별 엔티티 (e1, …, en)를 연관, 각 ej는 엔티티 집합 Ej의 원소 → E1…En이 관계 타입 R에 **참여**한다",
        "예: **WORKS_FOR** — EMPLOYEE와 DEPARTMENT, 각 직원을 그가 일하는 부서와 연관",
        "**Degree**: 참여 엔티티 타입의 수 — binary, ternary… 어떤 차수든 가능, DB 시스템 대부분은 **binary**",
        "**Role Name**: 참여 엔티티가 각 관계 인스턴스에서 맡는 역할 (WORKS_FOR의 employee, department)",
        "**Recursive Relationship**: 같은 엔티티 타입이 한 관계 타입에 **두 번 이상** 참여 — 참여 엔티티를 구분하려면 **역할 이름이 필수**",
      ],
    },
    {
      title: "관계 타입의 제약",
      en: "Constraints on Relationship Types",
      lines: [
        "관계 타입에는 보통 참여 엔티티에 대한 제약이 있다 — 각 직원은 정확히 한 부서에서 일한다, 여러 프로젝트에서 일할 수 있고 정확히 한 명에게 감독받는다",
        "**Constraint 1: Cardinality Ratio** — 엔티티가 참여할 수 있는 관계 인스턴스의 **최대** 수, 이항 관계에 **1:1, 1:N, M:N**",
        "· 1:N: 한 엔티티를 임의 개수의 엔티티와 연관 / 1:1: 한 엔티티를 다른 한 엔티티와 / M:N: 임의 개수끼리",
        "**Constraint 2: Participation Constraint** — 엔티티의 존재가 다른 엔티티와 관련되는 것에 **의존하는가**",
        "· **Total**: 모든 엔티티가 관계에 참여해야 / **Partial**: 모든 엔티티가 참여할 필요는 없다",
      ],
    },
    {
      title: "Exercise 1 — 카디널리티 비율",
      lines: [
        "상식 의미로 이항 관계의 카디널리티를 제안하라 (교안에 정답 슬라이드는 없다 — 아래는 상식 기준 답)",
        "STUDENT — SOCIAL_SECURITY_CARD: **1:1**",
        "STUDENT — TEACHER: **M:N**",
        "COUNTRY — CURRENT_PRESIDENT: **1:1**",
        "COURSE — TEXTBOOK: **M:N**",
        "ITEM(주문에 들어갈 수 있는) — ORDER: **M:N**",
        "STUDENT — CLASS: **M:N**",
        "CLASS — INSTRUCTOR: **N:1** (한 반은 강사 한 명, 강사는 여러 반)",
      ],
    },
    {
      title: "관계 타입의 속성",
      en: "Attributes of Relationship Types",
      lines: [
        "관계 타입도 속성을 가질 수 있다",
        "1:1과 1:N의 속성은 참여 엔티티 타입 하나로 **옮길 수 있다** — StartDate for MANAGES(1:1)는 **어느 쪽이든**, StartDate for WORKS_FOR(1:N)는 **N쪽으로만**",
        "M:N의 속성은 참여 엔티티들의 **조합**으로만 정해지고 단일 엔티티로 정해지지 않는다 → 어디로도 옮길 수 없다 — **Hours for WORKS_ON**: 직원이 프로젝트에서 주당 일하는 시간은 직원–프로젝트 조합으로 정해짐",
      ],
    },
    {
      title: "약한 엔티티 타입",
      en: "Weak Entity Types",
      lines: [
        "자기 안에 **키 속성이 없는** 엔티티 타입 — **식별(owner) 엔티티 타입**에 의존, 각 약한 엔티티는 식별 엔티티와 연관되어야",
        "**Identifying Relationship**: 약한 엔티티 타입을 owner와 연결 — 약한 엔티티 타입은 **항상 total participation**",
        "**Partial Key**: 같은 owner에 관련된 약한 엔티티들을 구분 — EMPLOYEE–DEPENDENT: Dependent_Name (같은 이름의 부양가족이 없다고 가정) / COURSE–SECTION: Section_Num",
        "부분키 혼자서는 약한 엔티티를 식별할 수 없다 → **식별 관계와 함께** 키로 쓴다",
      ],
    },
    {
      title: "Exercise 2 — (min, max) 제약",
      lines: [
        "INSTRUCTOR —TEACHES— COURSE, COURSE —USES— TEXT 에 (min, max)를 붙여라 (교안에 정답 슬라이드는 없다 — 문장 해석 답)",
        "\"A course may or may not use a textbook\" + \"may not use more than five books\" → COURSE in USES: **(0, 5)**",
        "\"A textbook is used in some courses\" → TEXT in USES: **(1, N)**",
        "\"A course can be taught by at least one and by a maximum of 4 instructors\" → COURSE in TEACHES: **(1, 4)**",
        "\"An instructor teaches from two to four courses\" → INSTRUCTOR in TEACHES: **(2, 4)**",
      ],
    },
    {
      title: "개념 설계 다듬기 — COMPANY",
      en: "Refining Conceptual Design",
      lines: [
        "관계를 나타내던 **속성을 관계 타입으로** 바꾼다",
        "**MANAGES**: EMPLOYEE–DEPARTMENT, **1:1**, EMPLOYEE **partial** / DEPARTMENT **total**, 속성 Manager_start_date (DEPARTMENT나 EMPLOYEE로 옮길 수도)",
        "**WORKS_FOR**: EMPLOYEE–DEPARTMENT, **1:N** (1쪽 DEPARTMENT, N쪽 EMPLOYEE), **둘 다 total**, 관계 속성 없음",
        "**CONTROLS**: DEPARTMENT–PROJECT, **1:N** (1쪽 DEPARTMENT, N쪽 PROJECT), PROJECT total / DEPARTMENT partial",
        "**SUPERVISION**: EMPLOYEE(순환), **1:N**, **둘 다 partial** — 교안 표기는 '1쪽 supervisee, N쪽 supervisor'이지만 결과 다이어그램은 supervisor (0,N), supervisee (0,1), 즉 한 감독자가 여러 직원을 감독",
        "**WORKS_ON**: EMPLOYEE–PROJECT, **M:N**, **둘 다 total** (직원은 최소 한 프로젝트, 프로젝트는 최소 한 명), 속성 **Hours** (직원–프로젝트 조합으로 정해짐)",
        "**DEPENDENTS_OF**: EMPLOYEE(식별)–DEPENDENT(약한), **식별 관계**, **1:N**, EMPLOYEE partial / DEPENDENT total",
        "결과 (min,max): WORKS_FOR employee (1,1)·department (4,N) / MANAGES employee (0,1)·department (1,1) / CONTROLS department (0,N)·project (1,1) / WORKS_ON worker (1,N)·project (1,N) / SUPERVISION supervisor (0,N)·supervisee (0,1) / DEPENDENTS_OF employee (0,N)·dependent (1,1)",
        "옮긴 것: Manager·Manager_start_date(DEPARTMENT) → MANAGES / Controlling_department(PROJECT) → CONTROLS / Department·Supervisor·Works_on(EMPLOYEE) → WORKS_FOR·SUPERVISION·WORKS_ON / Employee(DEPENDENT) → DEPENDENTS_OF",
      ],
    },
    {
      title: "요약 — ER 모델과 ER 스키마 설계",
      lines: [
        "데이터를 엔티티와 관계의 모음으로 기술 — **인스턴스보다 스키마**에 집중",
        "설계 과정: (1) 데이터 요구사항으로 엔티티 타입과 속성 기술 → (2) 관계 타입과 제약 명시 → (3) 관계를 나타내던 속성을 관계 타입으로 변경",
      ],
    },
    {
      title: "Practice 1 — MOVIE DB",
      en: "Exercise 1: ER Schema Diagram",
      lines: [
        "요구사항 — MOVIE: (title, year of release)로 식별, 상영 시간(분)과 줄거리, 하나 이상의 장르, 제작사 하나·감독 하나 이상·배우 하나 이상",
        "ACTOR: (name, date of birth)로 식별, 하나 이상의 영화에 출연, 영화마다 역할과 0개 이상의 명대사(quotes)",
        "DIRECTOR: (name, date of birth)로 식별, 하나 이상의 영화를 감독, 영화에 출연할 수도 있다(자기가 감독한 영화 포함)",
        "PRODUCTION: (name)으로 식별, 주소, 하나 이상의 영화를 제작",
        "Step 1 속성: MOVIE — Mkey(Title, Year), Length, Plot_outline, {Genre}, Production, {Directors}, {Actors} / ACTOR — Akey(Name, Date_of_birth), {Acts_on(Movie, Role, {Quotes})} / DIRECTOR — Dkey(Name, Date_of_birth), {Directs}, {Acts_on(Movie, Role, {Quotes})} / PRODUCTION — Name, Address, {Movies}",
        "Step 2 관계: **PRODUCES** PRODUCTION–MOVIE **1:N**, MOVIE **total** (영화는 한 제작사가 만든다)",
        "**ACTS** ACTOR–MOVIE **M:N**, 관계 속성 **Role**과 **Quotes(다중값)**, **양쪽 total**",
        "**DIRECTS** DIRECTOR–MOVIE **M:N**, MOVIE total (영화는 최소 한 감독)",
        "Step 3 다이어그램: 감독의 출연은 DIR_ACTS(DIRECTOR–MOVIE, M:N, Role, Quotes)로 그린다",
      ],
    },
    {
      title: "Practice 1 — CONFERENCE_REVIEW DB",
      en: "Exercise 2: Conference Review Database",
      lines: [
        "배경: 연구자가 논문을 제출하고, 리뷰어의 심사를 기록해 채택 여부 결정에 쓴다 — 주로 리뷰어가 평가 질문에 답하고 채택/거절을 추천",
        "AUTHOR: **e-mail id**로 식별, 이름(first, last), 하나 이상의 논문 제출 → 속성: A_email, First_name, Last_name, {Submits_paper(Paper, Is_Contact)}",
        "PAPER: 시스템이 주는 **고유 id**, 제목·초록·파일명, 저자 여러 명 중 **한 명이 연락 저자**, 리뷰어 **2~4명** 배정 → 속성: P_id, Title, Abstract, File_name, {Author}, {Reviewer}",
        "REVIEWER: **e-mail id**로 식별, 이름, 전화, 소속, 관심 주제들, 배정 논문을 4개 범주(technical merit, readability, originality, relevance) **1~10점**으로 평가, 종합 추천, 코멘트 2종(위원회 전용 / 저자 피드백) → 속성: R_email, First_name, Last_name, Phone_no, Affiliation, {Interest_topic}, {Reviews_paper(Paper, Recommendation, Comments(Feedback, For_committee), Rating(C1, C2, C3, C4))}",
        "**SUBMITS** AUTHOR–PAPER: 저자는 논문을 제출해야, 논문은 저자가 제출해야 기록 → **양쪽 total (min = 1)**, 여러 논문·여러 저자 → **N:M** / (1,N)–(1,N)",
        "**IS_CONTACT** AUTHOR–PAPER: 논문마다 연락 저자 한 명 → PAPER **total (1,1)** / 저자는 여러 논문의 연락 저자일 수도, 아닐 수도 → AUTHOR **partial (0,N)**",
        "**REVIEWS** REVIEWER–PAPER: 관계 속성 3개(복합 속성 Comments·Rating 포함 + Recommendation), 논문은 리뷰어 2~4명 → PAPER **(2,4)**(total) / 리뷰어는 최소 1편 → REVIEWER **(1,N)**(total)",
      ],
    },
  ],
};
