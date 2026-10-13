import type { Question } from "@/lib/types";

/* rel · map */
export const QUESTIONS_2: Question[] = [
  // relational-model
  { kind: "mc", id: "q-rm-1", concept: "relational-model", q: "관계형 데이터 모델을 제안한 사람과 연도는?", options: ["Peter Chen, 1976", "Ted Codd, 1970", "Donald Chamberlin, 1974", "Edgar Dijkstra, 1968"], answer: 1, explain: "IBM의 Ted Codd, 1970년. (Chen은 ER 모델, Chamberlin은 SEQUEL)" },
  { kind: "mc", id: "q-rm-2", concept: "relational-model", q: "관계 모델에서 '행'과 '열 머리'를 부르는 이름은?", options: ["record, field", "tuple, attribute", "entity, relationship", "domain, key"], answer: 1, explain: "relation(table) = tuples(rows) + attributes(column headers)." },
  { kind: "ox", id: "q-rm-3", concept: "relational-model", q: "관계 모델의 장점으로 단순성, 데이터 무결성, 쉬운 데이터 조작, 보안이 소개되었다.", answer: true, explain: "Simplicity, Data Integrity, Easy Data Manipulation, Security." },

  // domain
  { kind: "mc", id: "q-do-1", concept: "domain", q: "Domain을 바르게 설명한 것은?", options: ["속성이 가질 수 있는 원자값의 집합", "릴레이션의 튜플 집합", "키 속성의 집합", "외래키가 참조하는 릴레이션"], answer: 0, explain: "A set of allowed atomic values for each attribute." },
  { kind: "short", id: "q-do-2", concept: "domain", q: "강의 자료에서 Domain = data type + ( ? ) — 빈칸은? (영어)", answers: ["constraints", "constraint", "제약", "제약조건"], explain: "Domain = data type + constraints." },

  // schema-instance
  { kind: "mc", id: "q-si-1", concept: "schema-instance", q: "STUDENT(Name, Ssn, Phone, Address, Gpa)의 degree는?", options: ["1", "5", "튜플 수에 따라 다름", "키의 수"], answer: 1, explain: "Degree = 속성의 수 = 5." },
  { kind: "mc", id: "q-si-2", concept: "schema-instance", q: "특정 순간에 릴레이션이 담고 있는 튜플들의 집합은?", options: ["Relation schema", "Relation state (instance)", "Domain", "Catalog"], answer: 1, explain: "r(R) = {t1, …, tm}." },
  { kind: "ox", id: "q-si-3", concept: "schema-instance", q: "튜플의 각 값은 해당 속성 도메인의 원소이거나 NULL이다.", answer: true, explain: "vi ∈ dom(Ai) 또는 NULL." },
  { kind: "short", id: "q-si-4", concept: "schema-instance", q: "릴레이션 스키마의 속성 수를 무엇이라 하는가? (영어 한 단어)", answers: ["degree", "arity", "차수"], explain: "The degree of a relation." },

  // relation-characteristics
  { kind: "ox", id: "q-rc-1", concept: "relation-characteristics", q: "릴레이션의 튜플에는 정해진 순서가 있다.", answer: false, explain: "릴레이션은 튜플의 '집합'이라 순서가 없다." },
  { kind: "mc", id: "q-rc-2", concept: "relation-characteristics", q: "관계 모델에서 다중값 속성은 어떻게 나타내는가?", options: ["한 칸에 쉼표로 이어 쓴다", "별도 릴레이션으로", "NULL로 둔다", "복합 속성으로 바꾼다"], answer: 1, explain: "각 값은 원자값이어야 하므로 다중값은 별도 릴레이션." },
  { kind: "mc", id: "q-rc-3", concept: "relation-characteristics", q: "NULL의 의미로 강의에서 든 것이 아닌 것은?", options: ["unknown", "unavailable", "undefined (not applicable)", "zero"], answer: 3, explain: "NULL은 0이 아니다. 모름·없음·해당 없음." },
  { kind: "ox", id: "q-rc-4", concept: "relation-characteristics", q: "복합 속성은 그 단순 구성 속성들로만 나타낸다.", answer: true, explain: "Composite attributes are represented only by their simple component attributes." },

  // db-schema-state
  { kind: "mc", id: "q-ss-1", concept: "db-schema-state", q: "무결성 제약을 모두 지키지 않는 DB 상태를 무엇이라 하는가?", options: ["empty state", "not valid state", "initial state", "materialized state"], answer: 1, explain: "A DB state that does not obey all the integrity constraints is called not valid." },
  { kind: "ox", id: "q-ss-2", concept: "db-schema-state", q: "관계형 DB 스키마 S는 릴레이션 스키마들의 집합일 뿐, 무결성 제약은 포함하지 않는다.", answer: false, explain: "S = {R1, …, Rm} + 무결성 제약 집합 IC." },

  // keys
  { kind: "mc", id: "q-ky-1", concept: "keys", q: "Key와 superkey의 차이는?", options: ["key는 NULL을 허용한다", "key는 최소성(minimality)을 가진다", "superkey는 하나뿐이다", "superkey는 외래키다"], answer: 1, explain: "key = minimal superkey. 속성을 하나라도 빼면 더 이상 슈퍼키가 아니다." },
  { kind: "mc", id: "q-ky-2", concept: "keys", q: "STUDENT(Ssn, Name, Phone)에서 Ssn이 유일하다. {Ssn, Name}은?", options: ["key이자 superkey", "superkey지만 key는 아님", "key지만 superkey는 아님", "둘 다 아님"], answer: 1, explain: "유일성은 갖지만 Name을 빼도 유일하므로 최소가 아니다." },
  { kind: "mc", id: "q-ky-3", concept: "keys", q: "릴레이션이 키를 여러 개 가질 때 각각을 무엇이라 하는가?", options: ["Primary key", "Candidate key", "Foreign key", "Partial key"], answer: 1, explain: "각각이 candidate key, 그중 하나를 primary key로 지정." },
  { kind: "ox", id: "q-ky-4", concept: "keys", q: "슈퍼키가 하나도 없는 릴레이션도 있을 수 있다.", answer: false, explain: "모든 속성의 집합이 늘 슈퍼키이므로 모든 릴레이션은 슈퍼키를 적어도 하나 가진다." },
  { kind: "short", id: "q-ky-5", concept: "keys", q: "Two distinct tuples cannot have identical values for SK — 이 SK를 무엇이라 하는가? (영어 한 단어)", answers: ["superkey", "super key", "슈퍼키"], explain: "Superkey." },

  // entity-integrity
  { kind: "mc", id: "q-ei-1", concept: "entity-integrity", q: "개체 무결성 제약(Entity integrity constraint)은?", options: ["FK 값은 반드시 존재하는 PK를 가리킨다", "PK 값은 NULL일 수 없다", "모든 속성은 원자값이다", "튜플은 서로 달라야 한다"], answer: 1, explain: "t[PK] ≠ NULL." },
  { kind: "ox", id: "q-ei-2", concept: "entity-integrity", q: "PK가 (Essn, Pno)일 때 Pno만 NULL인 튜플은 개체 무결성을 지킨다.", answer: false, explain: "PK의 어느 부분도 NULL이면 안 된다." },

  // referential-integrity
  { kind: "mc", id: "q-ri-1", concept: "referential-integrity", q: "R1의 FK가 R2를 참조할 때, t1[FK]가 가질 수 있는 값은?", options: ["R2의 어떤 튜플의 PK 값 또는 NULL", "R2에 없는 값만", "언제나 NULL이 아닌 값", "R1의 PK 값"], answer: 0, explain: "참조 무결성: FK 값은 존재하는 PK 값이거나 NULL." },
  { kind: "ox", id: "q-ri-2", concept: "referential-integrity", q: "FK 속성은 참조하는 PK 속성과 도메인이 달라도 된다.", answer: false, explain: "FK는 참조하는 PK와 같은 도메인을 가져야 한다." },
  { kind: "ox", id: "q-ri-3", concept: "referential-integrity", q: "외래키는 자기 자신의 릴레이션을 참조할 수 없다.", answer: false, explain: "EMPLOYEE.Super_ssn → EMPLOYEE.Ssn 처럼 같은 릴레이션을 참조할 수 있다." },
  { kind: "mc", id: "q-ri-4", concept: "referential-integrity", q: "COMPANY에서 WORKS_ON.Pno가 참조하는 것은?", options: ["PROJECT.Pnumber", "DEPARTMENT.Dnumber", "EMPLOYEE.Ssn", "DEPENDENT.Essn"], answer: 0, explain: "WORKS_ON(Essn → EMPLOYEE.Ssn, Pno → PROJECT.Pnumber)." },

  // update-violations
  { kind: "mc", id: "q-uv-1", concept: "update-violations", q: "Delete 연산이 어길 수 있는 제약은?", options: ["Key constraint", "Entity integrity", "Referential integrity", "Domain constraint"], answer: 2, explain: "지운 튜플을 다른 튜플이 참조하고 있을 때." },
  { kind: "mc", id: "q-uv-2", concept: "update-violations", q: "네 가지 제약(도메인·키·개체·참조)을 모두 어길 수 있는 연산은?", options: ["Insert", "Delete", "Select", "Project"], answer: 0, explain: "Insert는 어느 제약이든 어길 수 있다." },
  { kind: "mc", id: "q-uv-3", concept: "update-violations", q: "EMPLOYEE에 이미 있는 Ssn으로 새 튜플을 넣으면?", options: ["Key constraint 위반", "Entity integrity 위반", "Referential integrity 위반", "위반 없음"], answer: 0, explain: "키 값이 이미 다른 튜플에 있다." },
  { kind: "mc", id: "q-uv-4", concept: "update-violations", q: "존재하지 않는 부서 번호 7을 Dno로 가진 사원을 넣으면?", options: ["Key constraint 위반", "Entity integrity 위반", "Referential integrity 위반", "위반 없음"], answer: 2, explain: "참조할 DEPARTMENT 튜플이 없다." },
  { kind: "ox", id: "q-uv-5", concept: "update-violations", q: "Update는 PK나 FK가 아닌 속성(예: Salary)을 바꿀 때도 참조 무결성을 어길 수 있다.", answer: false, explain: "PK·FK 속성을 바꿀 때만 키·참조 무결성 문제가 생긴다 (도메인은 별개)." },
  { kind: "mc", id: "q-uv-6", concept: "update-violations", q: "Ssn이 NULL인 사원 튜플을 넣으면?", options: ["Key constraint 위반", "Entity integrity 위반", "Referential integrity 위반", "위반 없음"], answer: 1, explain: "PK가 NULL — 개체 무결성." },

  // map-entity
  { kind: "mc", id: "q-me-1", concept: "map-entity", q: "일반 엔티티를 매핑할 때 복합 속성 Name(Fname, Minit, Lname)은?", options: ["Name 한 열로", "Fname, Minit, Lname 세 열로", "별도 릴레이션으로", "버린다"], answer: 1, explain: "복합 속성은 단순 구성 속성만 넣는다." },
  { kind: "ox", id: "q-me-2", concept: "map-entity", q: "엔티티 타입의 키 속성 하나를 릴레이션의 기본키로 지정한다.", answer: true, explain: "Designate one of the key attributes of E as the primary key for R." },

  // map-multivalued
  { kind: "mc", id: "q-mm-1", concept: "map-multivalued", q: "DEPARTMENT의 다중값 속성 Locations를 매핑한 DEPT_LOCATIONS의 기본키는?", options: ["Dnumber", "Dlocation", "(Dnumber, Dlocation)", "새 일련번호"], answer: 2, explain: "다중값 속성 A와 원래 PK K의 조합이 PK." },
  { kind: "ox", id: "q-mm-2", concept: "map-multivalued", q: "다중값 속성을 매핑한 릴레이션의 PK는 다중값 속성 A 하나뿐이다.", answer: false, explain: "PK는 (A, 원래 릴레이션의 PK)의 조합이고, 원래 PK는 FK가 된다." },

  // map-weak
  { kind: "mc", id: "q-mw-1", concept: "map-weak", q: "약한 엔티티 DEPENDENT를 매핑한 릴레이션의 PK는?", options: ["Dependent_name", "Essn", "(Essn, Dependent_name)", "(Essn, Bdate)"], answer: 2, explain: "소유자의 PK + partial key." },
  { kind: "ox", id: "q-mw-2", concept: "map-weak", q: "약한 엔티티를 매핑할 때 identifying relationship은 별도 릴레이션으로 만든다.", answer: false, explain: "소유자의 PK를 FK로 넣는 것으로 identifying relationship이 처리된다." },

  // map-1to1
  { kind: "mc", id: "q-m11-1", concept: "map-1to1", q: "1:1 관계를 외래키 방식으로 매핑할 때 FK를 넣을 쪽으로 권장되는 것은?", options: ["partial participation 쪽", "total participation 쪽", "튜플이 많은 쪽", "어느 쪽이든 같다"], answer: 1, explain: "total 쪽에 두면 모든 튜플이 FK 값을 가져 NULL이 생기지 않는다." },
  { kind: "mc", id: "q-m11-2", concept: "map-1to1", q: "MANAGES(1:1)를 외래키 방식으로 매핑한 결과로 맞는 것은?", options: ["EMPLOYEE에 Dnumber 추가", "DEPARTMENT에 Mgr_ssn과 Mgr_start_date 추가", "MANAGES 릴레이션 생성 필수", "두 릴레이션을 합침"], answer: 1, explain: "DEPARTMENT가 total이므로 DEPARTMENT에." },
  { kind: "mc", id: "q-m11-3", concept: "map-1to1", q: "1:1 관계 매핑의 세 방법이 아닌 것은?", options: ["Foreign key approach", "Merged relation approach", "Cross-reference approach", "Division approach"], answer: 3, explain: "외래키, 병합 릴레이션, 교차참조(관계 릴레이션) 세 가지." },

  // map-1toN
  { kind: "mc", id: "q-m1n-1", concept: "map-1toN", q: "1:N 관계를 외래키 방식으로 매핑할 때 FK는 어디에?", options: ["1쪽 릴레이션", "N쪽 릴레이션", "새 릴레이션", "양쪽 모두"], answer: 1, explain: "N쪽 S에 1쪽 T의 PK를 FK로." },
  { kind: "mc", id: "q-m1n-2", concept: "map-1toN", q: "CONTROLS(DEPARTMENT 1 : PROJECT N)를 매핑하면?", options: ["DEPARTMENT에 Pnumber", "PROJECT에 Dnum", "CONTROLS(Dnumber, Pnumber) 필수", "PROJECT와 DEPARTMENT를 병합"], answer: 1, explain: "N쪽인 PROJECT에 Dnum." },
  { kind: "ox", id: "q-m1n-3", concept: "map-1toN", q: "1:N 관계는 교차참조 방식만 쓸 수 있다.", answer: false, explain: "외래키 방식(선호)과 교차참조 방식 둘 다 가능하다." },

  // map-MtoN
  { kind: "mc", id: "q-mmn-1", concept: "map-MtoN", q: "M:N 관계를 매핑하는 방법은?", options: ["N쪽에 FK", "어느 한쪽에 FK", "관계 릴레이션(교차참조)만 가능", "두 릴레이션 병합"], answer: 2, explain: "Only one possible approach — cross-reference." },
  { kind: "mc", id: "q-mmn-2", concept: "map-MtoN", q: "WORKS_ON(Essn, Pno, Hours)의 기본키는?", options: ["Essn", "Pno", "(Essn, Pno)", "(Essn, Pno, Hours)"], answer: 2, explain: "참여 엔티티 PK(FK)들의 조합." },
  { kind: "short", id: "q-mmn-3", concept: "map-MtoN", q: "M:N 관계 WORKS_ON의 관계 속성 Hours는 어느 릴레이션에 들어가는가? (릴레이션 이름)", answers: ["WORKS_ON", "works on"], explain: "관계 릴레이션 S에 관계 속성을 넣는다." },

  // map-nary
  { kind: "mc", id: "q-mn-1", concept: "map-nary", q: "삼항 관계를 매핑한 릴레이션의 PK는 보통?", options: ["FK 하나", "참여 엔티티 세 개의 FK 조합", "새 일련번호", "관계 속성"], answer: 1, explain: "모든 참여 엔티티의 PK를 FK로 넣고 그 조합을 PK로." },

  // er-rel-correspondence
  { kind: "mc", id: "q-cr-1", concept: "er-rel-correspondence", q: "ER의 'Value set'은 관계 모델의 무엇에 대응하는가?", options: ["Attribute", "Domain", "Tuple", "Key"], answer: 1, explain: "Value set ↔ Domain." },
  { kind: "mc", id: "q-cr-2", concept: "er-rel-correspondence", q: "ER의 다중값 속성은 관계 모델에서?", options: ["속성 하나", "릴레이션 + FK", "도메인", "복합 키"], answer: 1, explain: "Multivalued attribute ↔ Relation and foreign key." },
  { kind: "mc", id: "q-cr-3", concept: "er-rel-correspondence", q: "ER의 M:N 관계 타입은 관계 모델에서?", options: ["FK 하나", "관계 릴레이션과 FK 두 개", "병합 릴레이션", "도메인"], answer: 1, explain: "M:N ↔ Relationship relation and two foreign keys." },
  { kind: "ox", id: "q-cr-4", concept: "er-rel-correspondence", q: "1:1·1:N 관계 타입은 외래키(또는 관계 릴레이션)로 대응된다.", answer: true, explain: "1:1 or 1:N ↔ Foreign key (or relationship relation)." },
];
