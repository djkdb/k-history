import type { EasyExtra } from "@/lib/easy";

/** 데이터베이스시스템 — 쉽게 말하면 · 흐름 · 시험엔 이렇게 (시험지는 영어) */
export const EASY: Record<string, EasyExtra> = {
  "db-dbms": {
    easy: "**DB** = 도서관의 책들(서로 관련된 데이터 모음). **DBMS** = 사서와 도서 관리 시스템(책을 정의·등록·대출·공유하게 해 주는 소프트웨어). **DB 시스템** = 도서관 전체 = DB + DBMS.",
    exam: "\"Database System = Database + DBMS software\". DBMS의 일 4가지 영어로: **Defining, Constructing, Manipulating, Sharing**. 예: IBM DB2, Oracle, MS SQL Server, MySQL, SQLite.",
  },
  "why-db": {
    easy: "메신저 앱 데이터를 메모장 txt에 쉼표로 저장한다고 해 보자. 같은 친구를 두 번 넣어도 막을 수 없고(무결성), 메시지 하나 찾으려면 처음부터 다 읽어야 하고(관리), 저장 중 폰이 꺼지면 파일이 깨진다(내구성). 이걸 다 해결해 주는 게 DBMS.",
    flow: ["Data Integrity — 길이 제한, 중복 친구, 동명이인", "Data Management — 빠른 검색, 동시 읽기·쓰기", "Data Durability — 쓰는 중 크래시, 복구"],
    exam: "텍스트 파일의 문제를 3범주로 분류: **Integrity / Management / Durability**. \"There are a number of technical issues — Let's use DBMS!\"",
  },
  "db-characteristics": {
    easy: "① **Self-describing** = 책마다 '이 책의 목차'(메타데이터)가 카탈로그에 함께 있다. ② **Data abstraction** = 운전자는 엔진 구조를 몰라도 운전한다(프로그램은 저장 구조를 몰라도 됨). ③ **Multiple views** = 학생은 성적만, 교수는 전체를 본다. ④ **Sharing & multiuser** = 여러 사람이 동시에 좌석 예약해도 꼬이지 않게(동시성 제어).",
    exam: "4특성 영어 이름 그대로 외우기. **meta-data는 DBMS catalog에 저장**. **program-data independence** = 자료 구조를 바꿔도 프로그램이 안 바뀜 (data abstraction의 결과). **Transaction** = 하나의 논리적 기능을 하는 연산들의 모음.",
  },
  "db-advantages": {
    easy: "DB를 쓰면 생기는 4가지 좋은 점: 같은 걸 여러 번 저장하지 않게(**중복 통제**), 규칙을 어기는 데이터는 못 들어오게(**무결성 제약**), 큰 데이터에서도 **빨리 찾게**(인덱스, B-Tree·B+Tree), 고장 나도 **되살리게**(백업·복구).",
    exam: "장점 4개 + Summary의 \"Restricting Unauthorized Access\". 인덱스는 **auxiliary file**, 보통 **tree 구조(B-Tree, B+Tree)**. Recovery = 실패 **직전의 최신 상태**로 되돌리는 것.",
  },
  redundancy: {
    easy: "학생 이름을 STUDENT 표와 GRADE_REPORT 표 둘 다에 적어 두면 — 이름이 바뀔 때 **두 번 고쳐야** 하고(노력 중복), **공간 낭비**고, 한 곳만 고치면 **서로 다른 이름**이 된다(불일치). 그래도 성적표를 자주 볼 땐 이름을 같이 두는 게 빠르니까 **일부러 통제된 중복**(Denormalization)을 쓰기도 한다.",
    exam: "문제 3개 영어로: **P1 duplication of effort, P2 storage wasted, P3 inconsistent**. \"Is redundancy always undesirable?\" → 아니다, **controlled redundancy (denormalization)**가 필요할 때가 있다.",
  },
  "when-not-dbms": {
    easy: "자전거 타고 마트 가는데 트럭을 살 필요는 없다. 단순하고 바뀔 일 없는 앱, 아주 빠른 실시간이 필요한 시스템, 저장 공간이 작은 임베디드 기기, 혼자만 쓰는 데이터라면 DBMS의 무게(비용·범용성·보안·동시성·복구 기능)가 오히려 짐이다.",
    exam: "Overheads 3개(초기 투자, generality, security·concurrency·recovery·integrity 기능) + 커스텀이 나은 경우 4개(simple & well-defined, strict real-time, embedded with limited storage, **no multiple-user access**).",
  },
  "data-model": {
    easy: "같은 건물을 **손님용 안내도**(개념: 엔티티·속성·관계) / **설계 도면**(표현: 테이블·튜플·속성) / **배관·전기 시공도**(물리: 레코드 형식·접근 경로)로 다르게 그린다.",
    flow: ["Conceptual (high-level) — Entity, Attribute, Relationship", "Representational — relation schema, tuple, attribute, domain (상용 DBMS 대부분)", "Physical (low-level) — record formats, orderings, access paths"],
    exam: "Data abstraction 두 축: **highlighting essential features** + **suppression of details of organization and storage**. 범주 → 설명 짝짓기. Physical은 **computer specialists용, end user용 아님**.",
  },
  "three-schema": {
    easy: "식당 비유: **External** = 손님마다 다른 메뉴판(관심 있는 부분만), **Conceptual** = 주방장이 보는 전체 레시피 목록(논리 구조), **Internal** = 창고에 재료가 실제로 어떻게 쌓였나(물리 저장). 실제 재료(데이터)는 창고(물리 수준)에만 있고, 주문은 위에서 아래로 **번역(mapping)**된다.",
    flow: ["External level — External schema (사용자 그룹별 view)", "External/Conceptual mapping", "Conceptual level — Conceptual schema (representational model로 기술)", "Conceptual/Internal mapping", "Internal level — Internal schema (physical model로 기술) → Stored Database"],
    exam: "목표: **To separate the user app from the physical DB**. Conceptual schema는 **representational data model**로, Internal schema는 **physical data model**로 기술. \"Actual data is stored at the **physical level only**\".",
  },
  "data-independence": {
    easy: "**물리적 독립성** = 창고 정리 방식을 바꿔도 레시피(개념 스키마)는 그대로. **논리적 독립성** = 레시피 목록에 새 요리를 더해도 손님 메뉴판(외부 스키마)·앱은 그대로. 바로 위 단계를 안 고쳐도 되는 것이 핵심.",
    exam: "정의: **change the schema at one level without having to change the schema at the next higher level**. Logical = conceptual 변경 → external·앱 그대로 / Physical = internal 변경 → conceptual 그대로. 장점: **유지보수 오버헤드를 크게 줄인다**.",
  },
  "design-process": {
    easy: "집 짓기: 건축주 요구 듣기(요구 수집·분석) → 설계 개념도(개념 설계, ER) → 실제 도면과 시공(구현 = 논리 설계 + 물리 설계).",
    flow: ["Phase 1: Requirements collection and analysis → 사용자 요구 명세", "Phase 2: Conceptual design → 데이터 모델 선택, conceptual schema (ER)", "Phase 3: Implementation → Logical design(DB schema) + Physical design(물리 배치)"],
    exam: "3단계 순서와 각 산출물. Logical design = **the database schema**, Physical design = **physical layout**.",
  },
  "er-model": {
    easy: "세상을 **명사(엔티티)**와 **동사(관계)**로 그리는 그림 언어. '학생이 수업을 듣는다' → 학생·수업 = 엔티티(네모), 듣는다 = 관계(마름모).",
    exam: "나쁜 설계 두 가지: **Redundancy**(정보 반복), **Incompleteness**(일부 데이터를 모델링하기 어려움). ER은 **instance가 아니라 schema**에 집중.",
  },
  "entity-attribute": {
    easy: "엔티티는 '따로 존재하는 것'. 사람·자동차처럼 **만질 수 있는 것**(physical)도, 회사·학과·프로젝트처럼 **개념인 것**(conceptual)도 엔티티다. 속성은 그것을 설명하는 성질(이름·나이·주소).",
    exam: "\"independent existence\". physical vs conceptual existence 예시 분류 문제.",
  },
  "attribute-types": {
    easy: "**복합 vs 단순**: 주소(=도로+도시+우편번호로 쪼갤 수 있음) vs 우편번호(더 못 쪼갬). **단일 vs 다중값**: 생일(하나) vs 전화번호들(여러 개). **저장 vs 유도**: 생일(저장) vs 나이(생일로 계산).",
    exam: "ER 기호: 다중값 = **이중 타원**, 유도 = **점선 타원**, 키 = **밑줄**, 복합 = 타원에서 가지치기. 예: Locations(다중값), Age(유도), Name(Fname, Minit, Lname)=복합.",
  },
  "entity-type-key": {
    easy: "**엔티티 타입** = 붕어빵 틀(이름+속성), **엔티티 집합** = 구워진 붕어빵들. **키 속성** = 붕어빵마다 다른 일련번호 — 학번, 주민번호. 여러 속성을 묶어 키로 쓸 수도 있고(Registration(Number, State)), 키가 둘 이상일 수도 있다(CAR: Registration, Vehicle_id).",
    exam: "COMPANY 초기 설계: DEPARTMENT 키 = **Name, Number**, Locations = 다중값 / PROJECT 키 = Name, Number / EMPLOYEE 키 = **SSN**, Name = 복합.",
  },
  "relationship-type": {
    easy: "관계 = 엔티티를 잇는 동사. **차수** = 몇 종류가 참여하나(2개면 binary, 3개면 ternary). **역할 이름** = 그 관계에서 맡은 배역(SUPERVISION에서 감독자 vs 피감독자). **순환 관계** = 같은 엔티티가 두 번 참여(직원이 직원을 감독) — 그래서 역할 이름이 필수.",
    exam: "Degree = **number of participating entity types**, 대부분 binary. Recursive relationship에는 **role name이 essential**.",
  },
  cardinality: {
    easy: "한 사람이 최대 몇 개와 연결될 수 있나. **1:1** = 나라–현직 대통령, **1:N** = 학과–직원(학과 하나에 직원 여럿, 직원은 한 학과), **M:N** = 학생–수업(서로 여럿).",
    exam: "Cardinality ratio = **maximum** number of relationship instances. Exercise 1(교안에 답은 없음, 상식 기준): STUDENT–SSN card 1:1, STUDENT–TEACHER M:N, COUNTRY–CURRENT_PRESIDENT 1:1, COURSE–TEXTBOOK M:N, ITEM–ORDER M:N, STUDENT–CLASS M:N, CLASS–INSTRUCTOR N:1.",
  },
  participation: {
    easy: "**전체(total)** 참여 = '모든 학과는 반드시 관리자가 있다' (이중선). **부분(partial)** 참여 = '모든 직원이 관리자일 필요는 없다' (단일선). (min, max)로 쓰면 min=1 이상이면 전체 참여, min=0이면 부분 참여.",
    exam: "Participation = **existence dependency**(다른 엔티티와 관련되어야 존재하는가) → **minimum** 쪽. Exercise 2(교안 답 없음, 문장 해석): COURSE–USES (0,5), TEXT–USES (1,N), COURSE–TEACHES (1,4), INSTRUCTOR–TEACHES (2,4). 주의: (min, max)는 **자기 쪽**에 적는다 — 1:N 기호와 위치가 반대.",
  },
  "relationship-attribute": {
    easy: "'근무 시작일'은 직원 것도 학과 것도 아니라 '관리한다'는 관계의 것. 1:1이면 어느 쪽으로 옮겨도 되고, 1:N이면 **N쪽**(직원)으로만 옮길 수 있다. M:N의 '주당 근무 시간(Hours)'은 직원–프로젝트 **짝**마다 달라서 어디로도 못 옮긴다.",
    exam: "StartDate for MANAGES → **one of any**, StartDate for WORKS_FOR(1:N) → **only to the N-side**, Hours for WORKS_ON(M:N) → **cannot be migrated**.",
  },
  "weak-entity": {
    easy: "부양가족(DEPENDENT)은 '누구의' 가족인지 알아야 구분된다 — 이름만으로는 동명이인이 생기니까. 그래서 주인 엔티티(EMPLOYEE)에 기대어 사는 **약한 엔티티**. 부분키(Dependent_name) + 주인의 키(Ssn)를 합쳐야 식별된다.",
    exam: "약한 엔티티는 **항상 total participation**. 기호: **이중 네모** + **이중 마름모(identifying relationship)**, 부분키는 **점선 밑줄**. 예: EMPLOYEE–DEPENDENT(Dependent_Name), COURSE–SECTION(Section_Num).",
  },
  "er-refine-company": {
    easy: "처음엔 '관리자', '소속 학과' 같은 걸 속성으로 적어 두었다가, 다듬을 때 그것들을 **관계 타입으로 바꾼다**. DEPARTMENT의 Manager → MANAGES, PROJECT의 Controlling_department → CONTROLS, EMPLOYEE의 Department·Supervisor·Works_on → WORKS_FOR·SUPERVISION·WORKS_ON, DEPENDENT의 Employee → DEPENDENTS_OF.",
    exam: "관계별 카디널리티·참여: MANAGES **1:1**(EMP partial, DEPT total, Manager_start_date) / WORKS_FOR **1:N**(both total) / CONTROLS **1:N**(PROJECT total, DEPT partial) / SUPERVISION **1:N**(both partial, 순환) / WORKS_ON **M:N**(both total, Hours) / DEPENDENTS_OF **1:N**(identifying, DEPENDENT total). (min,max): WORKS_FOR EMP (1,1)·DEPT (4,N), MANAGES EMP (0,1)·DEPT (1,1), WORKS_ON (1,N)·(1,N), CONTROLS DEPT (0,N)·PROJ (1,1), SUPERVISION supervisor (0,N)·supervisee (0,1), DEPENDENTS_OF EMP (0,N)·DEP (1,1).",
  },
  "er-design-steps": {
    easy: "요구사항 문장에서 **명사 → 엔티티·속성**, **동사 → 관계**, 그리고 처음에 속성으로 적은 '다른 엔티티를 가리키는 것'을 관계로 바꾼다.",
    flow: ["(1) 요구사항으로 엔티티 타입과 속성 기술", "(2) 관계 타입과 제약(카디널리티·참여) 명시", "(3) 관계를 나타내던 속성을 관계 타입으로 변경"],
    exam: "실습 정답 외우기 — MOVIE: PRODUCES 1:N(MOVIE total), ACTS M:N(Role, {Quotes}, 양쪽 total), DIRECTS M:N(MOVIE total). CONFERENCE: SUBMITS M:N(양쪽 total, (1,N)), IS_CONTACT AUTHOR (0,N)·PAPER (1,1), REVIEWS REVIEWER (1,N)·PAPER (2,4), 관계 속성 Recommendation, Comments(Feedback, For_committee), Rating(C1~C4).",
  },
  "relational-model": {
    easy: "데이터를 전부 **엑셀 표**로 나타내는 방식. 표 = relation, 행 = tuple, 열 이름 = attribute. 1970년 IBM의 **Ted Codd**가 제안.",
    exam: "장점 4개: **Simplicity, Data integrity, Easy data manipulation(SQL), Security**. 행 하나 = 실세계 엔티티나 관계에 해당하는 **사실(fact)**.",
  },
  domain: {
    easy: "도메인 = 그 칸에 **들어갈 수 있는 값의 범위**. 'Employee_ages: 15~80 사이 정수', 'Usa_phone_numbers: (ddd)ddd-dddd 형식'. 도메인 = **데이터 타입 + 제약**.",
    exam: "\"A set of allowed **atomic** values\" — 각 값은 **indivisible**. Domain = data type + constraints.",
  },
  "schema-instance": {
    easy: "**스키마** = 빈 표의 머리줄(표 이름 + 열 이름·타입) — 잘 안 바뀐다. **인스턴스(상태)** = 지금 표에 들어 있는 행들 — 계속 바뀐다. **차수(degree)** = 열의 개수.",
    exam: "R = (A1, …, An), degree = n. 튜플 t = <v1, …, vn>, 각 vi는 dom(Ai)의 원소 또는 **NULL**. 예: STUDENT(Name, Ssn, Home_phone, Address, Office_phone, Age, Gpa) → degree 7.",
  },
  "relation-characteristics": {
    easy: "릴레이션은 '집합'이라 **행 순서가 없다**(1번 행이라는 개념이 없음). 칸에는 **쪼갤 수 없는 값 하나만**(전화번호 여러 개를 한 칸에 넣으면 안 됨 → 별도 릴레이션). 모르는 값·해당 없는 값은 **NULL**.",
    exam: "Tuple ordering: 의미 없음(**set**) → 그래서 'tabular'가 아니라 relation. Composite·multivalued 속성 **불허**. NULL의 뜻: unknown, unavailable, undefined.",
  },
  "db-schema-state": {
    easy: "**DB 스키마** = 표 설계도 묶음 + 지켜야 할 규칙(IC). **DB 상태** = 지금 표들에 든 데이터 전체. 규칙을 하나라도 어긴 상태는 **not valid**.",
    exam: "S = {R1, …, Rm} + **integrity constraints IC**. COMPANY = {EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT}.",
  },
  keys: {
    easy: "**슈퍼키** = 행을 구분할 수 있는 열 묶음(군더더기가 있어도 됨, 예: {Ssn, Name}). **키** = 군더더기를 다 뺀 **최소** 슈퍼키({Ssn}). 키가 여럿이면 다 **후보키**, 그중 대표 하나가 **기본키**.",
    flow: ["Superkey — 유일성만 (모든 relation은 기본 슈퍼키를 하나 이상 가진다)", "Key — 유일성 + 최소성 (minimal superkey)", "Candidate keys — 키가 여러 개일 때 각각", "Primary key — 후보키 중 하나를 지정"],
    exam: "최소성은 **key에 필수, superkey에는 선택**. 키 제약: t1[SK] ≠ t2[SK].",
  },
  "entity-integrity": {
    easy: "기본키는 '이름표'인데 이름표가 비어 있으면 누군지 알 수 없다 → **기본키는 NULL 불가**.",
    exam: "t[PK] ≠ NULL. SQL에서 PK 속성은 **NOT NULL이 암묵적으로** 지정된다. INSERT 시 PK의 **any part**가 NULL이면 위반.",
  },
  "referential-integrity": {
    easy: "직원 표의 Dno = 5는 '5번 학과에 다닌다'는 뜻 — 그럼 학과 표에 **5번 학과가 실제로 있어야** 한다. 없는 학과를 가리키면 안 된다(아직 배정 전이면 NULL은 허용).",
    exam: "FK 값은 **참조 릴레이션의 어떤 PK 값이거나 NULL**. FK와 PK의 domain이 같다. Exercise 1 답: TRIP.Ssn → SALESPERSON, EXPENSE.Trip_id → TRIP. Exercise 2 답: ENROLL.Ssn → STUDENT, ENROLL.Course# → COURSE, BOOK_ADOPTION.Course# → COURSE, BOOK_ADOPTION.Book_isbn → TEXT.",
  },
  "update-violations": {
    easy: "**넣기(Insert)**는 세 규칙 다 어길 수 있다(키 중복, PK가 NULL, 없는 곳 가리키기). **지우기(Delete)**는 '누가 나를 가리키고 있는데 사라지는' 참조 무결성만. **고치기(Update)**는 PK나 FK를 고칠 때만 문제(키·참조).",
    exam: "Exercise 3 정답: a 위반 없음 / b 참조(Dnum=2 없음) / c **키**(Dnumber=4 중복) / d **참조+개체**(Pno NULL, Essn 없음) / e 없음 / f 없음 / g **참조**(987654321을 WORKS_ON·DEPENDENT·DEPARTMENT·EMPLOYEE가 참조) / h **참조**(ProductX를 WORKS_ON이 참조) / i 없음 / j **참조**(943775543 없음) / k 없음.",
  },
  "map-entity": {
    easy: "엔티티 하나 = 표 하나. 단순 속성은 열로, 복합 속성(Name)은 **쪼갠 조각**(Fname, Minit, Lname)만 열로, 키 하나를 기본키로.",
    exam: "다중값 속성(Locations)은 여기서 넣지 않는다 → 별도 처리.",
  },
  "map-multivalued": {
    easy: "학과의 여러 위치를 한 칸에 못 넣으니 **새 표 DEPT_LOCATIONS(Dnumber, Dlocation)**를 만든다. 학과 번호는 위치 개수만큼 반복되고, (Dnumber, Dlocation) 둘을 합쳐 기본키.",
    flow: ["다중값 속성 A마다 새 relation R", "A + 원래 relation의 PK(K)를 넣고, K는 FK", "(A, K) 조합을 PK로"],
    exam: "새 relation의 PK = **A와 K의 조합**.",
  },
  "map-weak": {
    easy: "부양가족 표에 **주인(직원)의 Ssn을 FK로** 넣으면 식별 관계까지 표현된다. 기본키 = 주인의 PK + 부분키 (Essn, Dependent_name).",
    exam: "(2)에서 FK를 넣는 것이 **identifying relationship type의 매핑**까지 처리한다. PK = owner PK + partial key.",
  },
  "map-1to1": {
    easy: "1:1이면 한쪽 표에 다른 쪽 PK를 FK로 넣으면 끝. 이왕이면 **전체 참여 쪽**에 넣는다 — 학과는 모두 관리자가 있으니 DEPARTMENT에 Mgr_ssn을 넣으면 NULL이 생기지 않는다(직원 쪽에 넣으면 대부분 NULL).",
    exam: "세 방법: **Foreign key approach**(가장 흔함), Merged relation, Cross-reference. \"Why total participation?\" → **NULL을 피하려고**. 관계 속성(Mgr_start_date)도 S쪽으로.",
  },
  "map-1toN": {
    easy: "1:N이면 **N쪽 표**(직원)에 1쪽(학과)의 PK를 FK로 넣는다. 직원 한 명은 학과가 하나뿐이라 칸 하나로 충분하다. 반대로 학과 표에 직원을 넣으려면 칸이 여러 개 필요해서 안 된다.",
    exam: "\"Each entity instance on the N-side is related to at most one entity instance on the 1-side\". FK 방식이 **relation 수를 줄여서** 선호.",
  },
  "map-MtoN": {
    easy: "직원–프로젝트처럼 서로 여럿이면 어느 한쪽 칸 하나로 못 담는다 → **연결 표(WORKS_ON)**를 따로 만들어 양쪽 PK를 넣고, 둘을 합쳐 기본키. Hours 같은 관계 속성도 여기.",
    flow: ["관계를 나타낼 새 relation S", "참여 엔티티들의 PK를 FK로", "FK들의 조합을 PK로", "관계의 단순 속성을 S에"],
    exam: "M:N은 **cross-reference(relationship relation, lookup table)만 가능** — \"cannot be represented by a single foreign key attribute\".",
  },
  "map-nary": {
    easy: "3항(공급자–프로젝트–부품) 이상은 M:N처럼 연결 표 SUPPLY(Sname, Proj_name, Part_no, Quantity)를 만든다.",
    exam: "N항 → relation 1개 + **FK n개**, PK = FK들의 조합.",
  },
  "er-rel-correspondence": {
    easy: "번역 사전: 엔티티 → 표, 1:1·1:N → FK, M:N → 연결 표 + FK 2개, n항 → 연결 표 + FK n개, 복합 속성 → 조각들, 다중값 → 표 + FK, 값 집합 → 도메인, 키 속성 → PK.",
    exam: "표 짝짓기: Value set ↔ **Domain**, Key attribute ↔ **Primary (or secondary) key**, Multivalued ↔ **Relation and foreign key**, Composite ↔ **Set of simple component attributes**.",
  },
  "sql-intro": {
    easy: "SQL = DB에게 '무엇을' 원하는지 말하는 **선언형** 언어(어떻게 찾을지는 DBMS가 정함). 표를 만드는 말(**DDL**: CREATE·ALTER·DROP)과 행을 다루는 말(**DML**: SELECT·INSERT·DELETE·UPDATE)로 나뉜다.",
    exam: "원래 이름 **SEQUEL**(Structured English Query Language), IBM. Text-to-SQL의 4가지 도전: 자연어 모호성, 스키마 이해·연결, 복잡한 질의 생성, 처음 보는 DB로 일반화 → \"LLM이 강력해도 완벽하지 않아 SQL 이해가 중요\".",
  },
  "create-table": {
    easy: "CREATE TABLE = 빈 표 만들기. 열마다 타입을 주고, 규칙을 붙인다: 비면 안 됨(**NOT NULL**), 안 주면 기본값(**DEFAULT**), 대표 열쇠(**PRIMARY KEY**), 겹치면 안 되는 다른 열쇠(**UNIQUE** = 후보키), 다른 표를 가리킴(**FOREIGN KEY … REFERENCES**).",
    code: "CREATE SCHEMA COMPANY AUTHORIZATION 'Jsmith';\n\nCREATE TABLE DEPARTMENT\n( Dname        VARCHAR(15) NOT NULL,\n  Dnumber      INT         NOT NULL,\n  Mgr_ssn      CHAR(9)     NOT NULL DEFAULT '888665555',\n  Mgr_start_date DATE,\n  PRIMARY KEY (Dnumber),\n  UNIQUE (Dname),\n  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) );",
    exam: "NOT NULL은 **PK에 암묵적으로** 지정(개체 무결성). UNIQUE = **alternate(candidate) keys**. 참조 무결성 위반 시 SQL 기본 동작 = **reject**.",
  },
  "ref-triggered-actions": {
    easy: "가리키던 대상이 지워지거나 바뀌면 어떻게 할까? **SET NULL**(가리키던 칸을 비움), **CASCADE**(같이 지우거나 같이 바꿈), **SET DEFAULT**(기본값으로). 아무것도 안 정하면 **거부(reject)**.",
    flow: ["Trigger: ON DELETE / ON UPDATE", "Action: SET NULL / CASCADE / SET DEFAULT", "지정 안 하면 기본 = REJECT"],
    exam: "LIBRARY 연습 답: BOOK_AUTHORS.Book_id → ON DELETE **CASCADE**/ON UPDATE CASCADE · BOOK.Publisher_name → ON DELETE **REJECT**/ON UPDATE CASCADE · BOOK_COPIES(Book_id, Branch_id) → CASCADE/CASCADE · BOOK_LOANS.Book_id → REJECT(또는 CASCADE)/CASCADE · BOOK_LOANS.Branch_id → CASCADE(또는 REJECT)/CASCADE · BOOK_LOANS.Card_no → **REJECT**/CASCADE. 토론: EMPSUPERFK를 ON DELETE CASCADE로 바꾸고 Borg를 지우면 감독 사슬을 따라 직원들이 **연쇄 삭제**된다.",
  },
  "insert-delete-update": {
    easy: "**INSERT** = 행 추가(모든 값을 순서대로, 또는 열 이름을 골라서 — 이때 NOT NULL이면서 기본값 없는 열은 꼭 넣어야). **DELETE** = 행 삭제(WHERE 없으면 **전부 삭제!**). **UPDATE** = 값 수정(SET으로 바꿀 값, WHERE로 대상).",
    exam: "DELETE·UPDATE는 **한 번에 한 테이블**(single relation), 다른 테이블로의 전파는 참조 트리거 동작 때문. INSERT 위반 예: Dno=2 학과 없음 → 참조 위반 / Ssn 없이 넣음 → NOT NULL 위반.",
    code: "DELETE FROM EMPLOYEE;   -- WHERE 없음: 모든 튜플 삭제!\n\nUPDATE EMPLOYEE\nSET    Salary = Salary * 1.1\nWHERE  Dno = 5;          -- 여러 튜플을 한 번에",
  },
  "select-basic": {
    easy: "SELECT(보여 줄 열) — FROM(재료 표) — WHERE(고를 조건). 표 두 개를 쓰면 WHERE에 **조인 조건**(Dnumber = Dno)을 꼭 써야 한다. 빼먹으면 모든 조합(곱)이 나와 폭발한다.",
    exam: "용어: SELECT 목록 = **projection attributes**, WHERE = **selection condition + join condition**. WHERE 없음 = **모든 튜플**(두 표면 곱: EMPLOYEE 8 × DEPARTMENT 3 = **24**). 같은 이름 속성은 **EMPLOYEE.Name**처럼 한정, 같은 표를 두 번 쓸 땐 **alias** 필수. `*` = 모든 속성.",
    code: "-- 별칭: 직원과 그 직속 상사의 이름 (같은 표를 두 번)\nSELECT E.Fname, E.Lname, S.Fname, S.Lname\nFROM   EMPLOYEE AS E, EMPLOYEE AS S\nWHERE  E.Super_ssn = S.Ssn;",
  },
  multiset: {
    easy: "SQL 결과에는 **같은 행이 여러 번** 나올 수 있다(다중집합). 지우려면 **DISTINCT**. 반대로 UNION·EXCEPT·INTERSECT는 기본이 집합이라 중복을 지우고, 중복을 살리려면 **ALL**을 붙인다.",
    code: "SELECT ALL Salary FROM EMPLOYEE;       -- 25000이 3번\nSELECT DISTINCT Salary FROM EMPLOYEE;  -- 한 번씩",
    exam: "다중집합인 이유 3개: 중복 제거가 **비싸다**(정렬 필요), 사용자가 중복을 **보고 싶을 수** 있다, **집계 함수**에 중복이 필요. R(A)={a1,a2,a2,a3}, S(A)={a1,a2,a4,a5}일 때 R EXCEPT ALL S = {a2, a3}, R INTERSECT ALL S = {a1, a2}, UNION ALL = 8행.",
  },
  "order-arith-between": {
    easy: "**ORDER BY** = 정렬(기본 오름차순, DESC로 내림차순). 숫자 열에는 **+ − × ÷** 계산 가능(월급 10% 인상 보기). **BETWEEN a AND b** = a 이상 b 이하.",
    exam: "BETWEEN은 **양 끝 포함**: (Salary >= 30000) AND (Salary <= 40000). ORDER BY 기본 = **ASC**. 30,000×1.1 = 33,000.",
    code: "-- Query 13: ProductX에서 일하는 직원의 10% 인상 월급\nSELECT E.Fname, E.Lname, 1.1 * E.Salary AS Increased_sal\nFROM   EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P\nWHERE  E.Ssn = W.Essn AND W.Pno = P.Pnumber AND P.Pname = 'ProductX';",
  },
  "nested-query": {
    easy: "질문 안에 질문. '스미스가 일하는 프로젝트 번호들'을 먼저 구하고(안쪽), 그 목록 **IN** 에 들어가는 프로젝트를 고른다(바깥). **> ALL** = 목록의 모든 값보다 크다, **= ANY** = 하나라도 같다(= IN).",
    exam: "**= ANY ≡ IN**. 중첩 질의에서 같은 속성 이름이 겹치면 **alias**로 구분 — \"모든 참조 테이블에 tuple variable을 만드는 게 좋다\".",
  },
  exists: {
    easy: "**EXISTS(…)** = 안쪽 결과가 한 줄이라도 있으면 참. **NOT EXISTS(…)** = 하나도 없으면 참. '부양가족이 없는 직원' = NOT EXISTS(그 직원의 부양가족).",
    code: "-- 부양가족이 없는 직원\nSELECT Fname, Lname FROM EMPLOYEE\nWHERE NOT EXISTS ( SELECT * FROM DEPENDENT WHERE Ssn = Essn );\n\n-- Exercise 4: 5번 학과의 모든 프로젝트에서 일하는 직원\nSELECT Fname, Lname FROM EMPLOYEE\nWHERE NOT EXISTS ( (SELECT Pnumber FROM PROJECT WHERE Dnum = 5)\n                   EXCEPT\n                   (SELECT Pno FROM WORKS_ON WHERE Ssn = Essn) );",
    exam: "'**모든 ~에 대해**'는 NOT EXISTS (A EXCEPT B) 패턴 = 관계 대수의 **나눗셈(÷)**. '부양가족이 있는 관리자' = EXISTS(부양가족) AND EXISTS(관리 학과) → Franklin Wong, Jennifer Wallace.",
  },
  "joined-tables": {
    easy: "**내부 조인** = 짝이 있는 행만(상사가 없는 Borg는 빠짐). **LEFT OUTER JOIN** = 왼쪽 표는 짝이 없어도 다 나오고 빈칸은 NULL. RIGHT는 오른쪽, FULL은 양쪽 다.",
    exam: "Joined table은 FROM 절에서 조인 — WHERE에 조인 조건을 섞는 것보다 **이해하기 쉽다**. 조인된 속성은 결과에 **한 번만** 포함(JOIN … ON 슬라이드). 내부 조인 결과에서 Super_ssn이 NULL인 행은 **제외**.",
  },
  aggregate: {
    easy: "여러 행을 **한 줄 요약**으로: COUNT(개수), SUM(합), MAX, MIN, AVG. COUNT(*)는 행 수, COUNT(DISTINCT Salary)는 서로 다른 월급 수.",
    exam: "COUNT(*)는 **행** 수(NULL 포함), COUNT(Salary)는 NULL이 아닌 값 수, 집계 함수는 **NULL을 무시**. 집계는 SELECT나 **HAVING** 절에, 중첩 질의 안에서도 쓸 수 있다.",
  },
  "group-having": {
    easy: "**GROUP BY** = 같은 값끼리 바구니에 나누기(학과별). 그 다음 바구니마다 집계. **HAVING** = 바구니 단위로 거르기('3명 이상인 프로젝트만'). WHERE는 행을, HAVING은 그룹을 거른다.",
    exam: "순서: FROM → WHERE(행) → GROUP BY → HAVING(그룹) → SELECT. Query 26: 직원이 **2명 넘게** 일하는 프로젝트 = HAVING COUNT(*) > 2. 결과 예: 학과 5 → 4명·33250, 학과 4 → 3명·31000, 학과 1 → 1명·55000.",
    code: "-- Query 24: 학과별 인원과 평균 월급\nSELECT Dno, COUNT(*), AVG(Salary)\nFROM   EMPLOYEE\nGROUP BY Dno;            -- (5,4,33250) (4,3,31000) (1,1,55000)\n\n-- Query 26: 직원이 2명 넘게 일하는 프로젝트\nSELECT Pnumber, Pname, COUNT(*)\nFROM   PROJECT, WORKS_ON\nWHERE  Pnumber = Pno\nGROUP BY Pnumber, Pname\nHAVING COUNT(*) > 2;",
  },
  assertion: {
    easy: "기본 제약(키·개체·참조)으로 표현 못 하는 **일반 규칙**을 거는 것. '직원 월급이 그 학과 관리자 월급보다 크면 안 된다' — 이를 어기는 행을 찾는 질의를 NOT EXISTS로 감싼다.",
    exam: "CHECK 조건은 **모든 DB 상태에서 참**이어야. 결과가 **비면 True**(만족), 비지 않으면 False(위반). 보통 **EXISTS / NOT EXISTS** 스타일.",
  },
  trigger: {
    easy: "'이런 일이 생기면(Event), 이 조건이면(Condition), 이렇게 해라(Action)' — 자동 반응 규칙. 직원 월급이 상사보다 높아지면 상사에게 알리는 프로시저 호출.",
    flow: ["Event — INSERT/UPDATE 등, BEFORE 또는 AFTER", "Condition — WHEN 절 (없으면 이벤트만으로 실행)", "Action — SQL 문들, 트랜잭션, 외부 프로그램"],
    exam: "트리거 = **ECA (Event, Condition, Action) rule**. 어서션은 '막는 규칙', 트리거는 '자동으로 하는 행동'. 이 예의 이벤트 3가지: 새 직원 삽입, 월급 변경, 상사 변경.",
  },
  "view-concept": {
    easy: "뷰 = **저장된 질의에 붙인 이름**. 매번 세 표를 조인하는 대신 WORKS_ON1이라는 '가상 표'를 만들어 두고 그냥 조회한다. 실제 데이터는 원래 표에만 있다.",
    exam: "뷰는 **virtual table**, 물리적으로 없을 수 있다. 조회는 제한 없음, 갱신은 보통 제한(**read-only**). 동기: **복잡한 질의를 단순화**. 원본이 바뀌면 뷰를 최신으로 유지하는 책임은 **DBMS**. DROP VIEW는 원본 표에 영향 없음.",
    code: "CREATE VIEW DEPT_INFO(Dept_name, No_of_emps, Total_sal) AS\nSELECT Dname, COUNT(*), SUM(Salary)\nFROM   DEPARTMENT, EMPLOYEE\nWHERE  Dnumber = Dno\nGROUP BY Dname;",
  },
  "view-implementation": {
    easy: "**질의 수정** = 뷰에 대한 질문을 그때그때 원본 표에 대한 질문으로 **번역**(뷰를 저장하지 않음). **실체화** = 뷰를 처음 물을 때 **진짜 표로 만들어 두고** 한동안 재사용(원본이 바뀌면 점진적으로 갱신).",
    flow: ["Immediate update — 원본이 바뀌는 즉시 (늘 최신, 비효율적일 수 있음)", "Lazy update — 뷰 질의가 올 때 (그 전까진 최신 아님)", "Periodic update — 주기적으로 (최신이 아닐 수 있음)"],
    exam: "질의 수정의 단점: 복잡한 뷰를 자주 물으면 **매번 계산** — 슬라이드: \"Not aligned with the philosophy of Views\". 실체화의 가정: 뷰 조회가 **자주 이어질 것**. 갱신 방식 3가지 짝짓기.",
  },
  "view-update": {
    easy: "단일 표에서 PK와 NOT NULL(기본값 없는) 열을 다 가진 뷰는 고치면 원본 한 곳에 그대로 반영되니 OK. 조인 뷰는 '존 스미스의 프로젝트명을 ProductY로' 같은 명령이 **두 가지 이상**으로 해석될 수 있고, 집계 뷰(Total_sal=100000)는 **말이 안 된다** — 그래서 둘 다 불가.",
    exam: "갱신 가능 조건: **원본 갱신 방법이 단 하나**일 때. Case 1(단일 표, PK + NOT NULL·무기본값 속성 포함) 가능 / Case 2(조인) 일반적으로 불가 / Case 3(그룹·집계) 불가. WORKS_ON1 예: ① 스미스의 WORKS_ON 행을 ProductY로 연결 ② PROJECT의 ProductX 이름 자체를 ProductY로(부작용: 다른 사람 행도 바뀜).",
  },
  "view-authorization": {
    easy: "회사 표 전체를 보여 주기 싫을 때, **필요한 부분만 보이는 뷰**를 만들어 그 뷰에만 권한을 준다. 5번 학과 관리자 → 5번 학과 직원 행만(DEPT5EMP), 일반 직원 → 이름·주소 열만(BASIC_EMP_DATA).",
    exam: "뷰로 **특정 속성(열)이나 튜플(행)**을 숨긴다. 연습 1: DEPT_INFO(DeptName, MgrFname, MgrLname, MgrSalary) — 학과와 관리자 설명용. 연습 2: ProjectInfo(Pname, Dname, NumEmployees, TotalHours) — GROUP BY P.Pnumber, P.Pname, 프로젝트 현황용.",
  },
  "ra-intro": {
    easy: "SQL이 '무엇을'(선언형)이라면 관계 대수는 '**어떤 순서로 어떤 연산을**'(절차형) 하는지 적는 수학. DBMS 내부에서 질의를 실행·최적화하는 바탕이다.",
    exam: "관계 대수 = **procedural**, 집합 개념에 기반, **query processing and optimization(11주)**의 바탕. 연산 결과도 **릴레이션**(닫혀 있음).",
  },
  "ra-select": {
    easy: "**σ (시그마) = 행 거르기** (가로로 자르기). σ Dno=4 AND Salary>25000 (EMPLOYEE). 열은 그대로라 **차수가 같다**.",
    exam: "SQL 대응: WHERE 절. **단항**(관계 하나), 튜플마다 독립 적용, **교환 가능** — σc1(σc2(R)) = σc2(σc1(R)) = σc1 AND c2(R). 순서 있는 값엔 {=,<,≤,>,≥,≠}, 순서 없는 값엔 {=,≠}.",
  },
  "ra-project": {
    easy: "**π (파이) = 열 고르기** (세로로 자르기). π Sex, Salary (EMPLOYEE). 결과는 집합이라 **중복이 자동 제거**된다(F, 25000이 두 번이면 한 번만).",
    exam: "SQL 대응: **SELECT DISTINCT** (중복 제거 때문). 차수 = 속성 목록의 개수. 키가 아닌 속성만 고르면 중복이 생기기 쉽다.",
  },
  "ra-rename-sequence": {
    easy: "여러 연산을 한 줄에 중첩하거나(π(σ(R))), 중간 결과에 이름을 붙여 단계별로 쓴다(TEMP ← σ…, RESULT ← π…). **ρ (로)**는 이름 바꾸기.",
    exam: "ρ의 세 형태: 관계+속성 / 관계만 / 속성만. SQL에서 rename = **AS (alias)**. \"복잡한 연산은 중간 결과 이름을 주는 편이 보통 더 쉽다\".",
    code: "ρ S(B1,…,Bn)(R)   -- 관계 이름과 속성 이름 둘 다\nρ S(R)            -- 관계 이름만\nρ (B1,…,Bn)(R)    -- 속성 이름만",
  },
  "ra-set-ops": {
    easy: "∪ 합집합(둘 중 하나라도), ∩ 교집합(둘 다), − 차집합(왼쪽에만). 단, 두 표의 **열 개수와 열별 도메인이 같아야**(type compatible) 한다.",
    exam: "∪·∩는 **교환·결합 법칙 성립**, −는 **교환 안 됨** (R − S ≠ S − R). 결과는 집합이라 중복 제거. STUDENT − INSTRUCTOR = 학생에만 있는 이름들.",
  },
  "ra-cartesian": {
    easy: "× = **모든 짝 맞추기**. 여직원 3명 × 부양가족 7명 = 21행 — 대부분 엉뚱한 짝이라 혼자서는 의미 없고, 뒤에 σ(Ssn=Essn)를 붙여야 진짜 짝만 남는다. 그 둘을 합친 게 조인.",
    exam: "type compatible 아니어도 된다. 속성 수 **n + m**, 튜플 수 **|R| × |S|**. 예: 3 × 7 = **21**.",
  },
  "ra-join": {
    easy: "⋈ = ×한 뒤 σ로 맞는 짝만 남긴 것을 한 번에. **동등 조인**은 '='만 쓴 조인(같은 값 열이 두 번 나옴). **자연 조인(*)**은 그 중복 열을 하나로 줄인 것 — 열 이름이 같아야 해서 필요하면 먼저 ρ로 이름을 맞춘다.",
    exam: "θ-join 조건: Ai θ Bj, θ ∈ {=,<,≤,>,≥,≠}, AND로 결합. 결과 크기 **0 ≤ |Q| ≤ |R|·|S|** (없으면 빈 릴레이션, 조건 없으면 카티션 곱). **Join selectivity** = 예상 결과 크기 / (|R|·|S|).",
  },
  "ra-complete-set": {
    easy: "**{σ, π, ∪, ρ, −, ×}** 여섯 개만 있으면 나머지는 다 만들 수 있다. ∩ = (R∪S) − ((R−S) ∪ (S−R)), ⋈ = σ(R×S). 그래도 ∩·⋈는 자주 써서 따로 둔다. **질의 트리**: 잎 = 입력 표, 안쪽 노드 = 연산, 아래부터 실행.",
    flow: ["(1) σ Plocation='Stafford' (PROJECT)", "(2) ⋈ P.Dnum = D.Dnumber (DEPARTMENT)", "(3) ⋈ D.Mgr_ssn = E.Ssn (EMPLOYEE)", "π Pnumber, Dnum, Lname, Address, Bdate"],
    exam: "교안의 '완전 집합'은 **{σ, π, ∪, ρ, −, ×}** (교안 문장은 'five operations'라고 하지만 기호는 6개). 자연 조인 = RENAME → × → σ → π. 트리 노드는 **자식이 준비되면** 실행.",
  },
  "ra-aggregate": {
    easy: "**ℑ (스크립트 F)**: 왼쪽 아래에 그룹 속성, 오른쪽에 (함수 속성) 목록. Dno ℑ COUNT Ssn, AVERAGE Salary (EMPLOYEE) → 학과별 인원·평균. 그룹 속성이 없으면 전체를 한 줄로 요약.",
    exam: "결과 속성 이름은 **<function>_<attribute>** (Count_ssn, Average_salary) — 바꾸려면 ρ. 집계에서 **중복은 제거하지 않음**, **NULL은 무시**. 결과는 숫자가 아니라 **릴레이션**(한 행이라도). 예: 전체 8명, 평균 35125.",
  },
  "ra-outer-join": {
    easy: "자연·동등 조인은 짝 없는 행을 버린다. 관리하는 학과가 없는 직원도 다 보고 싶으면 **왼쪽 외부 조인 ⟕** — 학과 이름 칸은 NULL로 채워진다.",
    code: "TEMP   ← (EMPLOYEE ⟕ Ssn=Mgr_ssn DEPARTMENT)\nRESULT ← π Fname, Minit, Lname, Dname (TEMP)",
    exam: "LEFT ⟕ / RIGHT ⟖ / FULL ⟗. 결과: Wong → Research, Wallace → Administration, Borg → Headquarters, 나머지 → NULL.",
  },
  "ra-division": {
    easy: "'**모든** ~를 하는' 사람 찾기. 스미스가 하는 프로젝트 {1, 2}를 **전부** 하는 직원 = (Essn, Pno) ÷ (Pno). 표 R에서, S의 모든 값과 짝지어 나타나는 나머지 열 값만 남긴다.",
    code: "SMITH      ← σ Fname='John' AND Lname='Smith' (EMPLOYEE)\nSMITH_PNOS ← π Pno (WORKS_ON ⋈ Essn=Ssn SMITH)      -- {1, 2}\nSSN_PNOS   ← π Essn, Pno (WORKS_ON)\nSSNS(Ssn)  ← SSN_PNOS ÷ SMITH_PNOS                   -- {123456789, 453453453}\nRESULT     ← π Fname, Lname (SSNS * EMPLOYEE)        -- John Smith, Joyce English",
    exam: "R(Z) ÷ S(X), X ⊆ Z, 결과 T(Y), **Y = Z − X**. 예: R(A,B)에서 S={a1,a2,a3}일 때 → B = {b1, b4}. 기본 연산으로 표현 가능. SQL에서는 **NOT EXISTS ( … EXCEPT … )**. 연습 7: 5번 학과 모든 프로젝트에서 일하는 직원 = EMP_PROJ ÷ DEPT5_PROJS.",
  },
};
