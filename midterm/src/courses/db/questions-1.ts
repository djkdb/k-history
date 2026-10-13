import type { Question } from "@/lib/types";

/* intro · arch · er */
export const QUESTIONS_1: Question[] = [
  // db-dbms
  { kind: "mc", id: "q-dbms-1", concept: "db-dbms", q: "Database System을 바르게 정의한 것은?", options: ["Database 그 자체", "DBMS 소프트웨어", "Database + DBMS software", "메타데이터 카탈로그"], answer: 2, explain: "Database System = Database + DBMS software." },
  { kind: "mc", id: "q-dbms-2", concept: "db-dbms", q: "DBMS가 데이터베이스에 대해 하는 일로 강의에서 든 네 가지가 아닌 것은?", options: ["Defining", "Constructing", "Compiling", "Sharing"], answer: 2, explain: "DBMS는 DB를 정의(Defining)·구축(Constructing)·조작(Manipulating)·공유(Sharing)한다." },
  { kind: "ox", id: "q-dbms-3", concept: "db-dbms", q: "SQLite와 MySQL은 DBMS의 예이다.", answer: true, explain: "IBM DB2, Oracle, MS SQL Server, MySQL, SQLite 모두 DBMS다." },
  { kind: "short", id: "q-dbms-4", concept: "db-dbms", q: "A logically coherent collection of inter-related data를 무엇이라 하는가? (영어 한 단어)", answers: ["database", "db", "데이터베이스"], explain: "Database의 정의다. 그것을 관리하는 소프트웨어가 DBMS." },

  // why-db
  { kind: "mc", id: "q-why-1", concept: "why-db", q: "\"앱이 새 항목을 쓰는 도중 기계가 죽으면?\"은 파일 방식의 어떤 문제인가?", options: ["Data Integrity", "Data Management", "Data Durability", "Data Abstraction"], answer: 2, explain: "고장 뒤 데이터를 지키고 되살리는 문제는 내구성(Durability)이다." },
  { kind: "mc", id: "q-why-2", concept: "why-db", q: "\"여러 사용자가 동시에 읽고 쓰면?\"은 어느 범주의 문제로 소개됐는가?", options: ["Data Integrity", "Data Management", "Data Durability", "Data Redundancy"], answer: 1, explain: "빠른 검색·동시 접근은 Data Management 문제로 묶였다." },
  { kind: "ox", id: "q-why-3", concept: "why-db", q: "같은 이름의 친구를 구별하는 문제는 Data Durability 문제로 소개되었다.", answer: false, explain: "그것은 Data Integrity 문제다. Durability는 고장·복구에 관한 것." },

  // db-characteristics
  { kind: "mc", id: "q-char-1", concept: "db-characteristics", q: "DB 구조와 제약의 정의(메타데이터)가 저장되는 곳은?", options: ["DBMS catalog", "External schema", "Transaction log", "Index file"], answer: 0, explain: "Self-describing nature — 메타데이터는 DBMS catalog에 저장된다." },
  { kind: "mc", id: "q-char-2", concept: "db-characteristics", q: "데이터 구조를 바꿔도 프로그램에 영향이 없는 성질(program-data independence)은 어떤 특성에서 나오는가?", options: ["Self-describing nature", "Data abstraction", "Support of multiple views", "Multiuser transaction processing"], answer: 1, explain: "Data abstraction — 프로그램과 데이터를 떼어 놓고 물리 구조를 숨긴다." },
  { kind: "ox", id: "q-char-3", concept: "db-characteristics", q: "View는 DB에서 유도되지만 명시적으로 저장되지는 않는 가상 데이터일 수 있다.", answer: true, explain: "Support of multiple views 에서 나온 정의다." },
  { kind: "short", id: "q-char-4", concept: "db-characteristics", q: "하나의 논리적 기능을 수행하는 연산들의 모음을 무엇이라 하는가? (영어 한 단어)", answers: ["transaction", "트랜잭션"], explain: "Transaction: a collection of operations that perform a single logical function." },
  { kind: "mc", id: "q-char-5", concept: "db-characteristics", q: "여러 예약 직원이 같은 좌석을 동시에 배정하려 할 때 필요한 것은?", options: ["Indexing", "Concurrency control", "Data abstraction", "Normalization"], answer: 1, explain: "Sharing of data & multiuser transaction processing — 동시성 제어가 필요하다." },
  { kind: "mc", id: "q-char-6", concept: "db-characteristics", q: "강의에서 든 DB 시스템의 네 가지 특성이 아닌 것은?", options: ["Self-describing nature", "Data abstraction", "Support of multiple views", "Controlling redundancy"], answer: 3, explain: "Controlling redundancy는 '특성'이 아니라 '장점(advantages)' 목록에 있다." },

  // db-advantages
  { kind: "mc", id: "q-adv-1", concept: "db-advantages", q: "DBMS가 원하는 레코드를 빨리 찾게 해 주는 대표적 수단은?", options: ["Backup", "Indexing (B-Tree, B+Tree)", "View", "Catalog"], answer: 1, explain: "디스크는 느리므로 특별한 자료 구조와 검색 기법, 즉 인덱스를 제공한다." },
  { kind: "mc", id: "q-adv-2", concept: "db-advantages", q: "\"DB를 고장 직전의 최신 상태로 되돌리는 것\"은?", options: ["Backup", "Recovery", "Buffering", "Caching"], answer: 1, explain: "Backup은 사본을 만드는 것, Recovery는 고장 전 최신 상태로 되돌리는 것." },
  { kind: "ox", id: "q-adv-3", concept: "db-advantages", q: "디스크의 레코드를 처리하려면 메인 메모리로 올려야 하며, 이를 buffering/caching 이라 한다.", answer: true, explain: "DB는 크기 때문에 디스크에 두고, 처리할 때 메모리로 불러온다." },
  { kind: "mc", id: "q-adv-4", concept: "db-advantages", q: "데이터 항목마다 데이터 타입을 지정하는 것은 어떤 장점의 예인가?", options: ["Controlling redundancy", "Enforcing integrity constraints", "Backup and recovery", "Multiple views"], answer: 1, explain: "무결성 제약의 가장 단순한 예가 데이터 타입 지정이다." },

  // redundancy
  { kind: "mc", id: "q-red-1", concept: "redundancy", q: "데이터 중복의 문제로 강의에서 든 세 가지가 아닌 것은?", options: ["같은 갱신을 여러 번 해야 함", "저장 공간 낭비", "데이터 불일치 가능", "질의 언어를 쓸 수 없음"], answer: 3, explain: "P1 중복 노력, P2 공간 낭비, P3 불일치." },
  { kind: "ox", id: "q-red-2", concept: "redundancy", q: "강의는 '모든 데이터를 꼭 한 곳에만 두는 것이 언제나 이상적인가?'를 토론거리로 남겼다 — 즉 중복이 늘 나쁜 것은 아니다.", answer: true, explain: "성능을 위해 통제된 중복(controlled redundancy)을 두기도 한다." },
  { kind: "short", id: "q-red-3", concept: "redundancy", q: "Storing the same data multiple times in different locations 를 무엇이라 하는가? (영어 두 단어)", answers: ["data redundancy", "redundancy", "데이터 중복", "중복"], explain: "Data redundancy." },

  // when-not
  { kind: "mc", id: "q-not-1", concept: "when-not-dbms", q: "DBMS 대신 맞춤 DB가 더 나은 경우가 아닌 것은?", options: ["엄격한 실시간 요구", "저장 공간이 작은 임베디드 시스템", "여러 사용자가 동시에 접근하는 은행 시스템", "단순하고 바뀌지 않는 응용"], answer: 2, explain: "다중 사용자 접근이 있으면 오히려 DBMS가 필요하다." },
  { kind: "ox", id: "q-not-2", concept: "when-not-dbms", q: "DBMS의 범용성(generality)과 보안·동시성·회복 기능은 비용(overhead)이 될 수 있다.", answer: true, explain: "그래서 단순한 응용에는 과할 수 있다." },

  // data-model
  { kind: "mc", id: "q-dm-1", concept: "data-model", q: "Entity, Attribute, Relationship 개념을 제공하는 데이터 모델 범주는?", options: ["Conceptual (high-level)", "Representational", "Physical (low-level)", "External"], answer: 0, explain: "사용자가 데이터를 인식하는 방식에 가까운 개념 데이터 모델." },
  { kind: "mc", id: "q-dm-2", concept: "data-model", q: "레코드 형식, 순서, access path를 다루는 모델은?", options: ["Conceptual", "Representational", "Physical", "Relational"], answer: 2, explain: "물리 데이터 모델은 컴퓨터 전문가를 위한 저장 세부를 다룬다." },
  { kind: "mc", id: "q-dm-3", concept: "data-model", q: "상용 DBMS 대부분이 쓰며, 사용자가 이해하기 쉽고 실제 저장과도 멀지 않은 모델은?", options: ["Conceptual", "Representational (implementation)", "Physical", "Hierarchical only"], answer: 1, explain: "relation schema, tuple, domain… 이 쓰이는 표현(구현) 데이터 모델." },
  { kind: "ox", id: "q-dm-4", concept: "data-model", q: "Data abstraction은 저장 구조의 세부를 사용자에게 모두 드러내는 것이다.", answer: false, explain: "반대다. 세부는 숨기고(suppression) 핵심만 드러낸다." },

  // three-schema
  { kind: "mc", id: "q-3s-1", concept: "three-schema", q: "특정 사용자 그룹이 관심 있는 부분만 기술하고 나머지는 숨기는 스키마는?", options: ["Internal schema", "Conceptual schema", "External schema", "Physical schema"], answer: 2, explain: "External(view) level." },
  { kind: "mc", id: "q-3s-2", concept: "three-schema", q: "강의 자료에서 conceptual schema를 기술하는 데 쓰는 데이터 모델은?", options: ["Physical data model", "Representational data model", "Conceptual data model only", "Network model"], answer: 1, explain: "Conceptual level은 representational data model로 기술한다." },
  { kind: "ox", id: "q-3s-3", concept: "three-schema", q: "3단계 스키마 구조에서 실제 데이터는 세 수준 모두에 따로 저장된다.", answer: false, explain: "실제 데이터는 물리 수준에만 있다. 나머지는 매핑으로 변환한다." },
  { kind: "short", id: "q-3s-4", concept: "three-schema", q: "상위 스키마에 대한 요청을 하위 스키마에 대한 요청으로 바꾸는 과정을 무엇이라 하는가? (영어 한 단어)", answers: ["mapping", "매핑", "사상"], explain: "Mapping — 수준 사이에서 요청과 결과를 변환한다." },
  { kind: "mc", id: "q-3s-5", concept: "three-schema", q: "3단계 스키마 구조의 목표는?", options: ["질의 속도를 높이는 것", "사용자 응용을 물리 DB에서 분리하는 것", "중복을 완전히 없애는 것", "트랜잭션을 직렬화하는 것"], answer: 1, explain: "To separate the user app from the physical DB." },

  // data-independence
  { kind: "mc", id: "q-di-1", concept: "data-independence", q: "인덱스를 새로 만들어도 conceptual schema를 바꿀 필요가 없다. 이것은?", options: ["Logical data independence", "Physical data independence", "Program independence", "View independence"], answer: 1, explain: "Internal schema 변경이 conceptual schema에 영향을 주지 않는 것 — 물리적 독립성." },
  { kind: "mc", id: "q-di-2", concept: "data-independence", q: "Logical data independence는 무엇을 바꿔도 external schema가 그대로인 능력인가?", options: ["Internal schema", "Conceptual schema", "Physical storage device", "Index structure"], answer: 1, explain: "Conceptual schema를 바꿔도 external schema·응용 프로그램은 그대로." },
  { kind: "ox", id: "q-di-3", concept: "data-independence", q: "데이터 독립성은 기존 응용 프로그램의 유지보수 비용을 크게 줄인다.", answer: true, explain: "Significantly reduces the maintenance overhead of existing application programs." },
  { kind: "short", id: "q-di-4", concept: "data-independence", q: "The capacity to change the schema at one level without having to change the schema at the next higher level — 이것은? (영어 두 단어)", answers: ["data independence", "데이터 독립성"], explain: "Data independence." },

  // design-process
  { kind: "mc", id: "q-dp-1", concept: "design-process", q: "요구사항을 conceptual schema(예: ER 다이어그램)로 옮기는 단계는?", options: ["Requirements analysis", "Conceptual design", "Logical design", "Physical design"], answer: 1, explain: "Phase 2 Conceptual Design." },
  { kind: "mc", id: "q-dp-2", concept: "design-process", q: "Implementation 단계에 포함되는 두 가지는?", options: ["Logical design과 Physical design", "Conceptual design과 Logical design", "Requirements와 Testing", "Backup과 Recovery"], answer: 0, explain: "구현 = 논리 설계(DB 스키마) + 물리 설계(물리 배치)." },

  // er-model
  { kind: "mc", id: "q-erm-1", concept: "er-model", q: "나쁜 ER 설계의 결과로 강의에서 든 두 가지는?", options: ["Redundancy와 Incompleteness", "Deadlock과 Starvation", "Overflow와 Underflow", "Aliasing과 Ambiguity"], answer: 0, explain: "정보 반복(redundancy), 어떤 면을 모델링하기 어려움(incompleteness)." },
  { kind: "ox", id: "q-erm-2", concept: "er-model", q: "ER 모델은 스키마보다 개별 인스턴스에 초점을 둔다.", answer: false, explain: "ER 모델은 인스턴스가 아니라 스키마에 초점을 둔다." },

  // entity-attribute
  { kind: "mc", id: "q-ea-1", concept: "entity-attribute", q: "개념적으로 존재하는(conceptual existence) 엔티티의 예는?", options: ["car", "house", "department", "student"], answer: 2, explain: "company, department, project는 개념적 존재." },
  { kind: "ox", id: "q-ea-2", concept: "entity-attribute", q: "Attribute는 엔티티를 기술하는 특정 성질이다.", answer: true, explain: "A particular property that describes the entity." },

  // attribute-types
  { kind: "mc", id: "q-at-1", concept: "attribute-types", q: "Address(Street, City, State, Zip)는 어떤 속성인가?", options: ["Multivalued", "Composite", "Derived", "Key"], answer: 1, explain: "더 작은 부분으로 나뉘는 복합 속성." },
  { kind: "mc", id: "q-at-2", concept: "attribute-types", q: "한 사람의 여러 전화번호, 여러 학위는 어떤 속성인가?", options: ["Composite", "Multivalued", "Derived", "Simple"], answer: 1, explain: "같은 엔티티에 값의 집합 — 다중값 속성(이중 타원)." },
  { kind: "mc", id: "q-at-3", concept: "attribute-types", q: "birth date에서 계산할 수 있는 age는?", options: ["Stored attribute", "Derived attribute", "Key attribute", "Composite attribute"], answer: 1, explain: "저장하지 않고 다른 속성에서 유도 — derived (점선 타원)." },
  { kind: "ox", id: "q-at-4", concept: "attribute-types", q: "age는 단일값(single-valued) 속성이면서 동시에 유도(derived) 속성일 수 있다.", answer: true, explain: "세 분류 축은 서로 독립이다." },
  { kind: "short", id: "q-at-5", concept: "attribute-types", q: "더 나눌 수 없는 속성(city, zip 등)을 무엇이라 하는가? (영어, simple 말고 다른 이름)", answers: ["atomic", "atomic attribute"], explain: "Simple (atomic) attribute." },

  // entity-type-key
  { kind: "mc", id: "q-ek-1", concept: "entity-type-key", q: "ER 다이어그램에서 키 속성은 어떻게 표시하는가?", options: ["이중 타원", "점선 타원", "이름에 밑줄", "이중 사각형"], answer: 2, explain: "키 속성 이름에 밑줄을 긋는다." },
  { kind: "ox", id: "q-ek-2", concept: "entity-type-key", q: "한 엔티티 타입은 키를 하나만 가질 수 있다.", answer: false, explain: "DEPARTMENT의 Name과 Number처럼 둘 이상일 수 있다." },
  { kind: "ox", id: "q-ek-3", concept: "entity-type-key", q: "여러 속성을 묶어 키로 쓸 수 있으며, 그 조합의 값이 엔티티마다 달라야 한다.", answer: true, explain: "예: MOVIE의 (Title, Year)." },
  { kind: "mc", id: "q-ek-4", concept: "entity-type-key", q: "같은 속성 집합을 가진 엔티티들의 모음은?", options: ["Entity type", "Entity set", "Relationship set", "Domain"], answer: 1, explain: "Entity type은 이름과 속성으로 기술, entity set은 그 엔티티들의 모음." },

  // relationship-type
  { kind: "mc", id: "q-rt-1", concept: "relationship-type", q: "Relationship type의 degree란?", options: ["관계 인스턴스의 수", "참여하는 엔티티 타입의 수", "관계 속성의 수", "최대 카디널리티"], answer: 1, explain: "binary(2), ternary(3)…" },
  { kind: "mc", id: "q-rt-2", concept: "relationship-type", q: "SUPERVISION처럼 같은 엔티티 타입이 한 관계에 두 번 참여하는 관계는?", options: ["Ternary relationship", "Identifying relationship", "Recursive relationship", "Weak relationship"], answer: 2, explain: "Recursive — 역할 이름(supervisor/supervisee)이 꼭 필요하다." },
  { kind: "ox", id: "q-rt-3", concept: "relationship-type", q: "DB 시스템의 관계는 대부분 ternary(삼항)다.", answer: false, explain: "대부분은 binary(이항)다." },
  { kind: "short", id: "q-rt-4", concept: "relationship-type", q: "참여 엔티티가 관계 인스턴스에서 맡는 역할을 나타내는 이름은? (영어 두 단어)", answers: ["role name", "role", "역할 이름"], explain: "Role name." },

  // cardinality
  { kind: "mc", id: "q-ca-1", concept: "cardinality", q: "Cardinality ratio가 정하는 것은?", options: ["엔티티가 참여할 수 있는 관계 인스턴스의 최소 수", "엔티티가 참여할 수 있는 관계 인스턴스의 최대 수", "관계의 속성 수", "참여 엔티티 타입의 수"], answer: 1, explain: "카디널리티 = 최대, 참여 제약 = 최소." },
  { kind: "mc", id: "q-ca-2", concept: "cardinality", q: "COMPANY에서 WORKS_ON(EMPLOYEE–PROJECT)의 카디널리티는?", options: ["1:1", "1:N", "N:1", "M:N"], answer: 3, explain: "사원은 여러 프로젝트, 프로젝트에는 여러 사원." },
  { kind: "mc", id: "q-ca-3", concept: "cardinality", q: "COMPANY에서 MANAGES(EMPLOYEE–DEPARTMENT)의 카디널리티는?", options: ["1:1", "1:N", "M:N", "N:1"], answer: 0, explain: "관리자 한 명이 부서 하나를, 부서마다 관리자 한 명." },
  { kind: "mc", id: "q-ca-4", concept: "cardinality", q: "WORKS_FOR(DEPARTMENT–EMPLOYEE)에서 N쪽은?", options: ["DEPARTMENT", "EMPLOYEE", "양쪽 다", "정할 수 없음"], answer: 1, explain: "부서 1 : 사원 N." },

  // participation
  { kind: "mc", id: "q-pa-1", concept: "participation", q: "모든 엔티티가 반드시 관계에 참여해야 하는 제약은?", options: ["Partial participation", "Total participation", "1:N cardinality", "Recursive relationship"], answer: 1, explain: "Total — 이중선, existence dependency." },
  { kind: "mc", id: "q-pa-2", concept: "participation", q: "\"논문 한 편은 심사위원 2~4명에게 배정된다\"에서 PAPER 쪽 (min, max)는?", options: ["(0,4)", "(1,N)", "(2,4)", "(2,N)"], answer: 2, explain: "최소 2, 최대 4 → (2,4), total participation." },
  { kind: "mc", id: "q-pa-3", concept: "participation", q: "\"강좌는 교재를 안 쓸 수도 있고, 다섯 권보다 많이 쓰지는 않는다\" — 강좌 쪽 (min, max)는?", options: ["(0,5)", "(1,5)", "(0,N)", "(5,5)"], answer: 0, explain: "안 쓸 수 있음 → min 0, 최대 5." },
  { kind: "ox", id: "q-pa-4", concept: "participation", q: "Partial participation은 최소 카디널리티가 1 이상이라는 뜻이다.", answer: false, explain: "그것은 total participation. Partial은 최소 0." },
  { kind: "mc", id: "q-pa-5", concept: "participation", q: "COMPANY의 CONTROLS(DEPARTMENT–PROJECT)에서 total participation인 쪽은?", options: ["DEPARTMENT", "PROJECT", "둘 다", "둘 다 아님"], answer: 1, explain: "프로젝트는 반드시 관리 부서가 있다. 부서는 프로젝트가 없어도 된다." },

  // relationship-attribute
  { kind: "mc", id: "q-ra-1", concept: "relationship-attribute", q: "WORKS_ON의 Hours를 EMPLOYEE나 PROJECT로 옮길 수 없는 이유는?", options: ["Hours가 다중값이라서", "Hours는 (사원, 프로젝트) 조합으로만 정해지기 때문", "Hours가 키라서", "Hours가 유도 속성이라서"], answer: 1, explain: "M:N 관계의 속성은 참여 엔티티 하나로 정해지지 않는다." },
  { kind: "mc", id: "q-ra-2", concept: "relationship-attribute", q: "1:N 관계의 속성은 어느 쪽 엔티티로 옮길 수 있는가?", options: ["1쪽", "N쪽", "양쪽 어디든", "옮길 수 없음"], answer: 1, explain: "N쪽 엔티티 하나당 관계 인스턴스가 하나뿐이므로." },
  { kind: "ox", id: "q-ra-3", concept: "relationship-attribute", q: "MANAGES(1:1)의 Manager_start_date는 EMPLOYEE 쪽으로만 옮길 수 있다.", answer: false, explain: "1:1이면 DEPARTMENT·EMPLOYEE 어느 쪽으로든 옮길 수 있다." },

  // weak-entity
  { kind: "mc", id: "q-we-1", concept: "weak-entity", q: "Weak entity type의 특징이 아닌 것은?", options: ["자기 키 속성이 없다", "소유 엔티티 타입에 의존한다", "identifying relationship에 partial participation이다", "partial key를 가질 수 있다"], answer: 2, explain: "약한 엔티티는 언제나 total participation이다." },
  { kind: "short", id: "q-we-2", concept: "weak-entity", q: "같은 소유자에 딸린 약한 엔티티끼리 구별하는 속성을 무엇이라 하는가? (영어 두 단어)", answers: ["partial key", "부분 키", "부분키", "discriminator"], explain: "Partial key — 예: DEPENDENT의 Dependent_name." },
  { kind: "ox", id: "q-we-3", concept: "weak-entity", q: "partial key 하나만으로 약한 엔티티를 유일하게 식별할 수 있다.", answer: false, explain: "소유자의 키와 함께 써야 식별된다." },
  { kind: "mc", id: "q-we-4", concept: "weak-entity", q: "COURSE–SECTION에서 SECTION의 partial key는?", options: ["Course_no", "Section_num", "Instructor", "Semester"], answer: 1, explain: "같은 강좌 안에서 분반 번호가 겹치지 않는다." },
  { kind: "mc", id: "q-we-5", concept: "weak-entity", q: "약한 엔티티를 소유 엔티티와 잇는 관계는?", options: ["Recursive relationship", "Identifying relationship", "Ternary relationship", "Supervision"], answer: 1, explain: "Identifying relationship (이중 마름모)." },

  // er-refine-company
  { kind: "mc", id: "q-rf-1", concept: "er-refine-company", q: "COMPANY의 SUPERVISION 관계 참여 제약은?", options: ["둘 다 total", "둘 다 partial", "supervisor만 total", "supervisee만 total"], answer: 1, explain: "모든 사원이 상사이거나 부하일 필요는 없다." },
  { kind: "mc", id: "q-rf-2", concept: "er-refine-company", q: "DEPENDENTS_OF에서 EMPLOYEE의 참여는?", options: ["Total", "Partial", "(1,1)", "정할 수 없음"], answer: 1, explain: "사원은 부양가족이 없을 수 있다. DEPENDENT 쪽이 total." },
  { kind: "ox", id: "q-rf-3", concept: "er-refine-company", q: "개념 설계를 다듬는 단계에서는 관계를 나타내던 속성을 관계 타입으로 바꾼다.", answer: true, explain: "Changing the attributes representing relationships into relationship types." },
  { kind: "mc", id: "q-rf-4", concept: "er-refine-company", q: "MANAGES에서 total participation인 쪽은?", options: ["EMPLOYEE", "DEPARTMENT", "둘 다", "둘 다 아님"], answer: 1, explain: "모든 부서에는 관리자가 있지만, 모든 사원이 관리자는 아니다." },

  // er-design-steps
  { kind: "mc", id: "q-ds-1", concept: "er-design-steps", q: "MOVIE 실습에서 ACTS 관계(ACTOR–MOVIE)의 카디널리티와 관계 속성은?", options: ["1:N, Role", "M:N, Role과 Quotes", "1:1, Quotes", "M:N, 속성 없음"], answer: 1, explain: "배우는 여러 영화, 영화엔 여러 배우. Quotes는 다중값 관계 속성." },
  { kind: "mc", id: "q-ds-2", concept: "er-design-steps", q: "MOVIE 실습에서 PRODUCES(PRODUCTION–MOVIE)는?", options: ["1:N, MOVIE total", "M:N, 둘 다 partial", "1:1, PRODUCTION total", "N:1, PRODUCTION total"], answer: 0, explain: "회사 하나가 여러 영화, 영화는 회사 하나가 제작 — 모든 영화가 참여." },
  { kind: "mc", id: "q-ds-3", concept: "er-design-steps", q: "CONFERENCE 실습의 IS_CONTACT에서 AUTHOR의 참여는?", options: ["Total (min 1)", "Partial (min 0)", "(2,4)", "(1,1)"], answer: 1, explain: "저자는 어느 논문의 연락 저자가 아닐 수도 있다." },
  { kind: "ox", id: "q-ds-4", concept: "er-design-steps", q: "ER 설계는 ① 엔티티와 속성 ② 관계와 제약 ③ 관계를 나타내던 속성을 관계 타입으로 바꾸기 순서다.", answer: true, explain: "강의의 Process of Designing ER Schema Diagram." },
];
