import type { Concept } from "@/lib/types";

/* Lecture 3 — 관계형 데이터 모델 · 제약 · ER→관계 매핑 */
export const CONCEPTS_2: Concept[] = [
  // ── rel ────────────────────────────────────────────
  {
    id: "relational-model",
    chapter: "rel",
    title: "관계형 데이터 모델",
    en: "Relational Data Model",
    importance: "high",
    summary:
      "1970년 IBM의 **Ted Codd**가 제안했다. 데이터를 **relation(테이블)**으로 나타내고, 각 릴레이션은 **tuple(행)**과 **attribute(열 머리)**로 이뤄진다. 한 행은 현실의 엔티티나 관계에 해당하는 하나의 사실이다.",
    points: [
      "장점 — **Simplicity**: 평평한 표 구조라 이해·관리가 쉽다",
      "**Data Integrity**: 데이터가 유효·일관·정확하도록 보장",
      "**Easy Data Manipulation**: SQL 같은 고수준 조작 언어",
      "**Security**: 인증·권한·암호화",
    ],
  },
  {
    id: "domain",
    chapter: "rel",
    title: "도메인",
    en: "Domain",
    importance: "high",
    summary:
      "**Domain D**는 한 속성이 가질 수 있는 **원자값(atomic value)**의 집합이다. 도메인의 각 값은 더 나눌 수 없다. **Domain = data type + constraints**.",
    points: ["예: 전화번호 = 10자리 문자열, 나이 = 15~80 사이 정수", "원자값: 쪼갤 수 없는 값"],
  },
  {
    id: "schema-instance",
    chapter: "rel",
    title: "릴레이션 스키마와 인스턴스(상태)",
    en: "Relation Schema & Relation State",
    importance: "must",
    summary:
      "**Relation schema** R(A₁, …, Aₙ)은 릴레이션 이름과 속성 목록이다. **Relation state(instance)** r(R)은 n-튜플들의 집합 {t₁, …, tₘ}이다.",
    points: [
      "**Degree(차수)**: 스키마의 속성 수 n",
      "튜플 t = <v₁, …, vₙ>: 각 vᵢ는 dom(Aᵢ)의 원소이거나 **NULL**",
      "스키마 = 이름 + 각 열의 이름과 타입 / 인스턴스 = 그 순간의 표(튜플 집합)",
      "튜플 수는 그 상태의 **cardinality**",
    ],
    trap: "Degree(차수)는 '열의 수', cardinality는 '행의 수'. 거꾸로 외우기 쉽다.",
  },
  {
    id: "relation-characteristics",
    chapter: "rel",
    title: "릴레이션의 특성",
    en: "Characteristics of Relations",
    importance: "must",
    summary:
      "릴레이션은 튜플의 **집합**이라 튜플 사이에 순서가 없다(그래서 '표'가 아니라 '릴레이션'이라 부른다). 각 값은 원자값이고, 복합·다중값 속성은 허용되지 않는다.",
    points: [
      "튜플의 순서: **없다** (집합이므로)",
      "튜플 안 값의 순서: n-튜플은 순서 있는 목록이지만, 속성과 값의 순서는 그리 중요하지 않다",
      "각 값은 **atomic** — composite·multivalued 속성 금지",
      "다중값 속성 → 별도 릴레이션으로 / 복합 속성 → 단순 구성 속성들로만",
      "**NULL**: 모르거나(unknown), 없거나(unavailable), 해당되지 않는(undefined) 값",
    ],
  },
  {
    id: "db-schema-state",
    chapter: "rel",
    title: "관계형 DB 스키마와 상태",
    en: "Relational Database Schema & State",
    importance: "normal",
    summary:
      "**Relational DB schema** S = {R₁, …, Rₘ} + 무결성 제약 집합 IC. **Relational DB state** DB = {r₁, …, rₘ}이고, 각 rᵢ가 IC를 모두 만족해야 한다. 제약을 어기는 상태는 **not valid**.",
    points: ["예: COMPANY = {EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT}"],
  },
  {
    id: "keys",
    chapter: "rel",
    title: "슈퍼키 · 키 · 후보키 · 기본키",
    en: "Superkey, Key, Candidate Key, Primary Key",
    importance: "must",
    summary:
      "**Key constraint**: 서로 다른 두 튜플은 SK의 값이 같을 수 없다 (t₁[SK] ≠ t₂[SK]). 이 성질을 가진 속성 부분집합이 **superkey**다. 슈퍼키 가운데 속성을 하나라도 빼면 슈퍼키가 아니게 되는 **최소(minimal)** 슈퍼키가 **key**다.",
    points: [
      "모든 릴레이션은 기본 슈퍼키를 적어도 하나 가진다 — 모든 속성의 집합",
      "**Minimality**: key에는 필수, superkey에는 선택",
      "키가 여러 개면 각각이 **candidate key**",
      "후보키 하나를 골라 **primary key**로 지정 — 튜플 식별에 사용",
      "나머지 후보키는 SQL에서 **UNIQUE**로 지정",
    ],
    example: "STUDENT(Ssn, Name, Phone): {Ssn}은 키, {Ssn, Name}은 슈퍼키지만 키가 아님(Name을 빼도 여전히 유일).",
  },
  {
    id: "entity-integrity",
    chapter: "rel",
    title: "개체 무결성 제약",
    en: "Entity Integrity Constraint",
    importance: "must",
    summary: "**기본키 값은 NULL일 수 없다.** r(R)의 모든 튜플 t에 대해 t[PK] ≠ NULL.",
    points: [
      "PK가 여러 속성이면 그 중 **어느 부분도** NULL이면 안 된다",
      "SQL: PK 속성에는 NOT NULL이 암묵적으로 붙는다",
    ],
  },
  {
    id: "referential-integrity",
    chapter: "rel",
    title: "참조 무결성 제약과 외래키",
    en: "Referential Integrity Constraint & Foreign Key",
    importance: "must",
    summary:
      "두 릴레이션의 튜플 사이 일관성을 지킨다 — 다른 릴레이션을 가리키는 튜플은 **존재하는** 튜플을 가리켜야 한다. R₁의 **FK**는 R₂를 참조하며, FK 값은 R₂의 어떤 튜플의 PK 값과 같거나 **NULL**이다.",
    points: [
      "FK 속성은 참조하는 PK와 **같은 도메인**",
      "t₁[FK] = t₂[PK] 이면 t₁이 t₂를 참조한다",
      "FK는 NULL이 될 수 있다 (PK와 다름)",
      "FK가 같은 릴레이션을 가리킬 수도 있다 — EMPLOYEE.Super_ssn → EMPLOYEE.Ssn",
    ],
  },
  {
    id: "update-violations",
    chapter: "rel",
    title: "연산별로 어기는 제약",
    en: "Constraint Violations by Insert / Delete / Update",
    importance: "must",
    summary:
      "갱신 연산(Insert·Delete·Update)을 할 때마다 제약을 어길 수 있다. **Insert는 모든 제약을, Delete는 참조 무결성만, Update는 키·참조 무결성을** 어길 수 있다.",
    points: [
      "**Insert**: 키 제약(이미 있는 키 값) · 개체 무결성(PK가 NULL) · 참조 무결성(참조할 튜플이 없음) — (도메인 제약도)",
      "**Delete**: 참조 무결성 — 지운 튜플을 다른 튜플이 참조하고 있을 때",
      "**Update**: 키 · 참조 무결성 — **PK나 FK 속성을 바꿀 때만** 문제가 된다",
    ],
    table: {
      title: "무엇이 깨질 수 있나",
      headers: ["연산", "키", "개체 무결성", "참조 무결성"],
      rows: [
        ["Insert", "O", "O", "O"],
        ["Delete", "-", "-", "O"],
        ["Update", "O", "(PK를 NULL로)", "O"],
      ],
    },
  },

  // ── map ────────────────────────────────────────────
  {
    id: "map-entity",
    chapter: "map",
    title: "1단계: 일반 엔티티 타입",
    en: "Mapping of Regular Entity Types",
    importance: "must",
    summary:
      "엔티티 타입 E마다 릴레이션 R을 만들고 E의 **단순 속성**을 모두 넣는다. 복합 속성은 **단순 구성 속성만** 넣는다. E의 키 속성 하나를 R의 **기본키**로 정한다.",
    points: ["예: EMPLOYEE의 Name(복합) → Fname, Minit, Lname 세 열", "다른 키 속성은 UNIQUE로 남길 수 있다"],
  },
  {
    id: "map-multivalued",
    chapter: "map",
    title: "다중값 속성",
    en: "Mapping of Multivalued Attributes",
    importance: "must",
    summary:
      "다중값 속성 A마다 **별도 릴레이션**을 만들고, A와 원래 릴레이션의 PK(K)를 넣는다. K는 **FK**가 되고, **(A, K)의 조합이 PK**가 된다.",
    points: [
      "예: DEPARTMENT의 Locations → DEPT_LOCATIONS(Dnumber, Dlocation), PK = (Dnumber, Dlocation)",
      "엔티티의 키 값(FK)이 값의 수만큼 반복된다",
    ],
  },
  {
    id: "map-weak",
    chapter: "map",
    title: "2단계: 약한 엔티티 타입",
    en: "Mapping of Weak Entity Types",
    importance: "must",
    summary:
      "약한 엔티티 W의 단순 속성을 모두 담은 릴레이션 R을 만들고, **소유 엔티티의 PK를 FK로** 넣는다(identifying relationship이 여기서 처리됨). **PK = 소유자의 PK + partial key**.",
    points: ["예: DEPENDENT(Essn, Dependent_name, Sex, Bdate, Relationship), PK = (Essn, Dependent_name)"],
  },
  {
    id: "map-1to1",
    chapter: "map",
    title: "이항 1:1 관계",
    en: "Mapping of Binary 1:1 Relationship Types",
    importance: "must",
    summary:
      "세 방법이 있다 — **외래키 방식**(가장 많이 씀), 병합 릴레이션 방식, 교차참조(관계 릴레이션) 방식. 외래키 방식에서는 한쪽 S를 골라 다른 쪽 T의 PK를 FK로 넣는다.",
    points: [
      "S로는 **total participation** 쪽을 고르는 게 좋다 — 모든 튜플에 FK 값이 생겨 NULL이 줄어든다",
      "관계의 단순 속성은 S의 속성으로",
      "예: MANAGES — DEPARTMENT가 total이므로 DEPARTMENT에 Mgr_ssn(FK), Mgr_start_date",
      "Merged relation: 두 엔티티를 한 릴레이션으로 (둘 다 total일 때 알맞음)",
    ],
    trap: "EMPLOYEE 쪽에 FK를 두면 관리자가 아닌 대부분의 사원 튜플에서 그 값이 NULL 이 된다. 그래서 total 쪽에 둔다.",
  },
  {
    id: "map-1toN",
    chapter: "map",
    title: "이항 1:N 관계",
    en: "Mapping of Binary 1:N Relationship Types",
    importance: "must",
    summary:
      "외래키 방식(릴레이션 수를 줄여 선호) 또는 교차참조 방식. 외래키 방식은 **N쪽 엔티티의 릴레이션 S**에 1쪽 T의 PK를 FK로 넣고, 관계 속성도 S에 넣는다.",
    points: [
      "WORKS_FOR: EMPLOYEE(N쪽)에 Dno",
      "CONTROLS: PROJECT(N쪽)에 Dnum",
      "SUPERVISION: EMPLOYEE에 Super_ssn (같은 릴레이션을 참조)",
    ],
    trap: "1쪽에 FK를 두면 한 튜플이 여러 값을 가져야 해서 원자값 규칙을 어긴다. 반드시 N쪽.",
  },
  {
    id: "map-MtoN",
    chapter: "map",
    title: "이항 M:N 관계",
    en: "Mapping of Binary M:N Relationship Types",
    importance: "must",
    summary:
      "방법은 **교차참조(관계 릴레이션) 방식 하나뿐**이다. 관계를 나타낼 별도 릴레이션 S를 만들고, 참여 엔티티들의 PK를 FK로 넣은 뒤 **그 FK들의 조합을 PK**로 한다. 관계 속성도 S에 넣는다.",
    points: ["WORKS_ON(Essn, Pno, Hours), PK = (Essn, Pno)", "FK: Essn → EMPLOYEE.Ssn, Pno → PROJECT.Pnumber"],
  },
  {
    id: "map-nary",
    chapter: "map",
    title: "N항 관계",
    en: "Mapping of N-ary Relationship Types",
    importance: "high",
    summary:
      "M:N과 같이 교차참조 방식. 관계 릴레이션 S를 만들고 참여하는 **모든** 엔티티의 PK를 FK로 넣어, 그 조합을 PK로 한다. 관계 속성도 넣는다.",
    points: ["삼항 관계 SUPPLY(Sname, Part_no, Proj_name, Quantity)처럼 FK 세 개의 조합이 PK"],
  },
  {
    id: "er-rel-correspondence",
    chapter: "map",
    title: "ER과 관계 모델의 대응",
    en: "Correspondence between ER and Relational Models",
    importance: "must",
    summary: "매핑 규칙 전체를 한 표로 외워 두면 어떤 ER 다이어그램이든 옮길 수 있다.",
    points: [],
    table: {
      title: "ER 모델 → 관계 모델",
      headers: ["ER", "관계 모델"],
      rows: [
        ["Entity type", "Entity relation"],
        ["1:1 / 1:N relationship type", "Foreign key (또는 관계 릴레이션)"],
        ["M:N relationship type", "관계 릴레이션 + FK 두 개"],
        ["n-ary relationship type", "관계 릴레이션 + FK n개"],
        ["Simple attribute", "Attribute"],
        ["Composite attribute", "단순 구성 속성들"],
        ["Multivalued attribute", "릴레이션 + FK"],
        ["Value set", "Domain"],
        ["Key attribute", "Primary (or secondary) key"],
      ],
    },
  },
];
