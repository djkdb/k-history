import type { NoteSection } from "@/lib/types";

/** DB 강의 노트 (2) — Lecture 3 · Practice 2 · Lecture 4 · Lecture 5 · Lecture 6 */
export const NOTES_2: Record<string, NoteSection[]> = {
  rel: [
    {
      title: "Lecture 3 — 관계형 데이터 모델",
      en: "Relational Data Model",
      lines: [
        "DB 설계는 데이터 표현을 단순화해 관리를 효율적으로 — **Ted Codd (IBM, 1970)**",
        "**relation(테이블)**로 데이터를 표현: 각 relation은 **tuple(행)**과 **attribute(열 머리)**로 구성",
        "장점: **Simplicity**(평평한 표 구조) · **Data Integrity**(유효·일관·정확) · **Easy Data Manipulation**(SQL 같은 강력한 고수준 언어, 복잡한 조건도 유연하게) · **Security**(사용자 인증, 권한, 암호화)",
        "DB = relation들의 모음 — 각 행은 관련 데이터 값의 모음, 실세계 엔티티나 관계에 해당하는 **사실(fact)** / 열 머리는 각 객체의 성질을 정의하는 속성",
        "예: COMPANY DB — EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT 표",
      ],
    },
    {
      title: "도메인",
      en: "Domain",
      lines: [
        "**Domain D**: 각 속성에 **허용되는 원자 값의 집합** — 값은 나눌 수 없다",
        "**Domain = data type + constraints**",
        "예: Usa_phone_numbers — 미국에서 유효한 10자리 전화번호, 타입 (ddd)ddd-dddd (d는 숫자, 앞 세 자리는 유효한 지역 번호)",
        "Local_phone_numbers(7자리), Social_security_numbers(9자리), Names(사람 이름 문자열), Grade_point_averages(0~4 실수)",
        "Employee_ages: 15~80 사이 정수",
      ],
    },
    {
      title: "릴레이션 스키마와 인스턴스",
      en: "Relation Schema and Instance",
      lines: [
        "**Relation Schema**: 릴레이션 이름 + 각 열의 이름과 타입 / **Relation Instance**: 표 (튜플의 집합)",
        "예: STUDENT(Name, Ssn, Home_phone, Address, Office_phone, Age, Gpa) — Benjamin Bayer, Chung-cha Kim, Dick Davidson, Rohan Panchal, Barbara Benson…",
        "R = (A1, …, An): 릴레이션 이름과 속성 목록 — **degree = 속성 수 n**",
        "Relation instance(state) r(R) = {t1, …, tm}: n-tuple들의 집합",
        "Tuple t = <v1, …, vn>: n개 값의 **순서 있는** 목록, 각 vi는 dom(Ai)의 원소 또는 **NULL**",
      ],
    },
    {
      title: "릴레이션의 특성",
      en: "Characteristics of Relations",
      lines: [
        "**튜플의 순서**: relation은 튜플의 **집합** → 집합에서 순서는? → 튜플에는 **특정한 순서가 없다** — 그래서 tabular가 아니라 relation이라 부른다",
        "**튜플 안 값의 순서**: n-tuple은 n개 값의 순서 있는 목록 — 속성과 값의 순서는 그다지 중요하지 않다",
        "**값과 NULL**: 튜플의 각 값은 **원자 값**(나눌 수 없음) — **복합·다중값 속성은 허용되지 않는다**: 다중값은 **별도 릴레이션**, 복합은 **단순 구성 속성**으로만",
        "**NULL**: 모르거나 해당하지 않는 값 — 뜻이 여럿: unknown, unavailable, undefined…",
      ],
    },
    {
      title: "관계형 DB 스키마와 상태",
      en: "Relational Database Schema and State",
      lines: [
        "**Relational DB schema**: 릴레이션 스키마의 집합 S = {R1, …, Rm} + **무결성 제약 집합 IC** — 예: COMPANY = {EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT}",
        "**Relational DB state**: 릴레이션 상태의 집합 DB = {r1, …, rm}, ri는 Ri의 상태 — ri는 IC를 만족",
        "모든 무결성 제약을 지키지 않는 DB 상태는 **not valid**",
      ],
    },
    {
      title: "관계 모델 제약",
      en: "Relational Model Constraints",
      lines: [
        "릴레이션이 많고 그 튜플들은 다양하게 관련됨 → 실제 값에 대한 제약을 명시해야 — 요구 분석의 규칙에서 유도, 모든 DB 상태는 모든 제약을 따라야(**valid state**)",
        "세 가지 핵심 제약: **Key constraints · Entity integrity constraints · Referential integrity constraints**",
      ],
    },
    {
      title: "키 제약",
      en: "Key Constraints",
      lines: [
        "정의상 relation의 튜플은 서로 달라야 한다 → 각 튜플을 어떻게 유일하게 식별?",
        "**Key constraint**: 서로 다른 두 튜플은 SK 속성들에 같은 값을 가질 수 없다 — t1[SK] ≠ t2[SK]",
        "**Superkey SK**: 키 제약을 지정하는 R의 속성 부분집합 — 모든 relation은 **최소 하나의 기본 슈퍼키**를 가진다",
        "**Key**: 추가 성질을 가진 슈퍼키 — 어떤 속성 A를 빼도 남은 K'는 더 이상 슈퍼키가 아니다 = **minimal superkey** / 이 최소성은 **키에는 필수, 슈퍼키에는 선택**",
        "**Candidate key**: 릴레이션 스키마는 키를 둘 이상 가질 수 있고, 각각을 후보키(minimal key)라 한다",
        "**Primary key**: 후보키 중 하나를 기본키로 지정 — 튜플을 유일하게 식별",
      ],
    },
    {
      title: "개체 무결성 · 참조 무결성",
      en: "Entity and Referential Integrity Constraints",
      lines: [
        "**Entity integrity**: 각 릴레이션 스키마의 **기본키(PK)**에 대한 제약 — **PK 값은 NULL일 수 없다** (모든 t에 대해 t[PK] ≠ NULL)",
        "**Referential integrity**가 필요한 이유: 두 릴레이션의 튜플 사이 **일관성** — 다른 릴레이션을 참조하는 튜플은 그 릴레이션의 **존재하는 튜플**을 참조해야",
        "**Foreign key**: R1의 속성 집합 FK가 R2를 참조하는 외래키 — R1과 R2 사이에 참조 무결성 제약을 명시",
        "조건: FK 속성은 R2의 PK 속성과 **같은 도메인** / t1의 FK 값은 어떤 튜플 t2의 PK 값과 같거나(t1[FK] = t2[PK], t1이 t2를 참조) **NULL**",
        "예: EMPLOYEE 'John Smith'의 Dno = 5 (FK) → DEPARTMENT 'Research'의 Dnumber = 5 (PK) — Smith가 Research에서 일함 / Q. FK가 NULL이면? → 아직 부서에 배정되지 않음",
      ],
    },
    {
      title: "Exercise 1·2 — 외래키 찾기",
      lines: [
        "Ex1: SALESPERSON(**Ssn**, Name, Start_year, Dept_no) / TRIP(Ssn, From_city, To_city, Departure_date, Return_date, **Trip_id**) / EXPENSE(**Trip_id, Account#**, Amount) — 출장은 하나 이상의 계정에 청구",
        "· 답: **TRIP.Ssn → SALESPERSON** (각 출장은 존재하는 영업사원에게 배정) / **EXPENSE.Trip_id → TRIP** (경비는 특정 출장에 대해 지급)",
        "Ex2: STUDENT(**Ssn**, Name, Major, Bdate) / COURSE(**Course#**, Cname, Dept) / ENROLL(**Ssn, Course#, Quarter**, Grade) / BOOK_ADOPTION(**Course#, Quarter**, Book_isbn) / TEXT(**Book_isbn**, Book_title, Publisher, Author)",
        "· 답: **ENROLL.Ssn → STUDENT** · **ENROLL.Course# → COURSE** · **BOOK_ADOPTION.Course# → COURSE** · **BOOK_ADOPTION.Book_isbn → TEXT**",
      ],
    },
    {
      title: "관계 모델의 연산",
      en: "Operations of Relational Model",
      lines: [
        "두 종류: **Retrieval**(정보 검색) / **Update**(상태 변경)",
        "기본 갱신 연산: **Insert**(새 튜플 추가) · **Delete**(튜플 제거) · **Update/Modify**(기존 튜플의 속성 값 변경) — 이 연산을 할 때마다 제약이 깨질 수 있다",
      ],
    },
    {
      title: "Insert와 제약 위반",
      lines: [
        "Insert: 릴레이션에 튜플 하나 추가 — 릴레이션 이름과 값 목록 지정, 모든 속성 값을 같은 순서로",
        "예: Insert <'Cecilia', 'F', 'Kolonsky', '677678989', '1960-04-05', '6357 Windy Lane, Katy, TX', F, 28000, NULL, 4> into EMPLOYEE",
        "**Key constraint**: 새 튜플의 키 값이 이미 다른 튜플에 있음 — Insert <'Alicia', 'J', 'Zelaya', **'999887777'**, …> → 키 제약 위반",
        "**Entity constraint**: 새 튜플 PK의 어느 부분이라도 NULL — Insert <'Cecilia', 'F', 'Kolonsky', **NULL**, …> → 개체 무결성 위반",
        "**Referential integrity**: 참조할 튜플이 없음 — Insert <… '987654321', **7**> → Dnumber=7인 부서가 없음 → 참조 무결성 위반 / Insert <… '677678989' … NULL, **4**> → **모든 제약 만족**",
      ],
    },
    {
      title: "Delete · Update와 제약 위반",
      lines: [
        "Delete: 릴레이션 이름과 **PK 값** 지정 — 위반 가능: **참조 무결성만** (지운 튜플을 다른 튜플이 참조)",
        "· Delete EMPLOYEE Ssn='999887777' → WORKS_ON 두 튜플이 참조 → 위반",
        "· Delete EMPLOYEE Ssn='333445555' → WORKS_ON 네 튜플, EMPLOYEE 두 튜플이 참조 → 위반",
        "· Delete WORKS_ON Essn='999887777' AND Pno=10 → 아무도 참조하지 않음 → 만족",
        "Update: 바꿀 속성과 값 지정",
        "· Update EMPLOYEE Ssn='999887777'의 Dno를 **7**로 → 참조 무결성 위반",
        "· Update Ssn '999887777'을 **'987654321'**로 → **키 + 참조 무결성** 위반",
        "**PK나 FK 속성을 바꿀 때만** 문제가 생긴다",
      ],
    },
    {
      title: "Exercise 3 — 연산별 제약 위반 (정답)",
      lines: [
        "a. Insert <'Robert', 'F', 'Scott', '943775543', …, '888665555', 1> into EMPLOYEE → **모든 제약 만족**",
        "b. Insert <'ProductA', 4, 'Bellaire', **2**> into PROJECT → **참조 무결성** 위반 (Dnum=2 부서 없음)",
        "c. Insert <'Production', **4**, '943775543', '2007-10-01'> into DEPARTMENT → **키 제약** 위반 (Dnumber 4 이미 있음)",
        "d. Insert <'677678989', **NULL**, '40.0'> into WORKS_ON → **참조 + 개체 무결성** 위반 (Pno가 PK의 일부인데 NULL, Essn 677678989 직원 없음)",
        "e. Insert <'453453453', 'John', 'M', '1990-12-12', 'spouse'> into DEPENDENT → **위반 없음**",
        "f. Delete WORKS_ON tuples with Essn='333445555' → **위반 없음**",
        "g. Delete EMPLOYEE Ssn='987654321' → **참조 무결성** 위반 (WORKS_ON, DEPENDENT, DEPARTMENT.Mgr_ssn, EMPLOYEE.Super_ssn이 참조)",
        "h. Delete PROJECT Pname='ProductX' → **참조 무결성** 위반 (WORKS_ON의 Pno=1 튜플들이 참조)",
        "i. Modify DEPARTMENT Dnumber=5의 Mgr_ssn·Mgr_start_date를 '123456789'·'2007-10-01'로 → **위반 없음**",
        "j. Modify EMPLOYEE Ssn='999887777'의 Super_ssn을 **'943775543'**로 → **참조 무결성** 위반 (그런 직원 없음)",
        "k. Modify WORKS_ON Essn='999887777' AND Pno=10의 Hours를 '5.0'으로 → **위반 없음**",
      ],
    },
    {
      title: "요약 — 관계형 데이터 모델",
      lines: [
        "개념: relation, tuple, attribute, domain / 릴레이션의 특성 / 관계형 DB 스키마와 상태",
        "제약: Key(두 튜플이 키 값이 같을 수 없음) · Entity integrity(PK는 NULL 불가) · Referential integrity(FK는 PK와 같은 도메인, 어떤 PK 값이거나 NULL)",
        "위반: **Insert → 키·개체·참조 모두 가능 / Delete → 참조만 / Update → 키·참조** (PK·FK를 바꿀 때만)",
      ],
    },
  ],

  map: [
    {
      title: "ER → 관계 매핑 과정",
      en: "ER-to-Relational Mapping",
      lines: [
        "개념 스키마 설계를 바탕으로 관계형 DB 스키마를 설계",
        "**엔티티 타입**: 일반·약한 엔티티 / **다중값 속성**: 허용되지 않으므로 처리 / **관계 타입**: 이항 1:1, 1:N, M:N / N항(3항 등)",
      ],
    },
    {
      title: "Process 1 — 일반 엔티티 타입",
      en: "Regular Entity Types",
      lines: [
        "(1) 엔티티 타입 E의 **모든 단순 속성**을 담은 릴레이션 R 생성 — **복합 속성은 단순 구성 속성만**",
        "(2) E의 키 속성 중 하나를 R의 **기본키**로",
        "예: EMPLOYEE(Fname, Minit, Lname, **Ssn**, Bdate, Address, Sex, Salary) / DEPARTMENT(Dname, **Dnumber**) — Locations는? 다중값을 어떻게 매핑하나 / PROJECT(Pname, **Pnumber**, Plocation)",
      ],
    },
    {
      title: "Process 1-2 — 다중값 속성",
      en: "Multivalued Attributes",
      lines: [
        "(1) 다중값 속성 A마다 **별도 릴레이션 R** 생성",
        "(2) 속성 A와 **원래 릴레이션의 기본키(K)**를 포함 — K를 R의 **외래키**로, 엔티티의 키 값(FK)이 반복된다",
        "(3) **A와 K의 조합**을 기본키로",
        "예: DEPT_LOCATIONS(**Dnumber, Dlocation**) — (5, Seoul), (5, Incheon), (5, Suwon), (3, Seoul), (3, Daejeon)",
      ],
    },
    {
      title: "Process 2 — 약한 엔티티 타입",
      en: "Weak Entity Types",
      lines: [
        "(1) 약한 엔티티 타입 W의 모든 단순 속성을 담은 릴레이션 R (복합은 구성 속성만)",
        "(2) **owner 엔티티 타입의 기본키를 외래키로** 포함 — 이것이 W의 **식별 관계 타입**의 매핑까지 처리",
        "(3) **owner의 PK + 부분키**의 조합을 기본키로",
        "예: DEPENDENT(**Essn, Dependent_name**, Sex, Bdate, Relationship), Essn → EMPLOYEE.Ssn",
      ],
    },
    {
      title: "Process 3-1 — 이항 1:1",
      en: "Binary Relationship Types (1:1)",
      lines: [
        "세 방법: **Foreign key approach**(가장 자주 쓰고 유용) / Merged relation approach / Cross-reference(relationship relation) approach",
        "Foreign key approach: (1) 참여 엔티티 타입 S와 T 확인 (2) 한쪽을 골라 **다른 쪽의 PK를 FK로** 포함 — **total participation인 엔티티를 S로** 고르는 게 좋다(Why? → NULL 회피) (3) 관계의 단순 속성을 S의 속성으로",
        "예: MANAGES — DEPARTMENT를 S로: DEPARTMENT(Dname, Dnumber, **Mgr_ssn**, **Mgr_start_date**), Mgr_ssn → EMPLOYEE.Ssn",
        "관계 속성은 참여 엔티티 중 어느 쪽으로도 옮길 수 있다",
      ],
    },
    {
      title: "Process 3-2 — 이항 1:N",
      en: "Binary Relationship Types (1:N)",
      lines: [
        "두 방법: **Foreign key approach**(릴레이션 수를 줄여서 선호) / Cross-reference approach",
        "(1) **N쪽** 엔티티 타입을 나타내는 릴레이션 S 확인 (2) 다른 릴레이션 T의 **PK를 S의 FK로** (3) 관계의 단순 속성을 S에",
        "예: WORKS_FOR — EMPLOYEE(…, **Dno**), Dno → DEPARTMENT.Dnumber",
        "\"N쪽의 각 엔티티 인스턴스는 1쪽의 **최대 하나**의 엔티티 인스턴스와 관련\"",
      ],
    },
    {
      title: "Process 3-3 — 이항 M:N",
      en: "Binary Relationship Types (M:N)",
      lines: [
        "방법은 **Cross-reference approach 하나뿐**",
        "(1) 관계 타입 R을 나타낼 **별도 릴레이션 S** 생성 (2) 참여 엔티티 타입 릴레이션들의 **PK를 S의 FK로** (3) **모든 FK의 조합을 PK로** (4) M:N 관계의 단순 속성을 S에",
        "예: WORKS_ON(**Essn, Pno**, Hours) — **Relationship relation (a.k.a lookup table)**",
        "\"M:N relationship type cannot be represented by a single foreign key attribute\"",
        "그림의 COMPANY 결과: EMPLOYEE(…, Dno, Super_ssn), DEPARTMENT(Dname, Dnumber, …), PROJECT(Pname, Pnumber, Plocation, Dnum), WORKS_ON(Essn, Pno, Hours)",
      ],
    },
    {
      title: "Process 4 — N항 관계",
      en: "N-ary Relationship Types",
      lines: [
        "Cross-reference approach: 별도 릴레이션 S, 참여 엔티티들의 PK를 FK로, 모든 FK 조합을 PK로, 관계 속성을 S에",
        "예: SUPPLY(**Sname, Proj_name, Part_no**, Quantity) — SUPPLIER, PROJECT, PART 참조",
      ],
    },
    {
      title: "Exercise 4 — UNIVERSITY 매핑",
      lines: [
        "ER: COLLEGE(CName, COffice, CPhone), INSTRUCTOR(Id, Rank, IName, IOffice, IPhone), DEPT(DName, DCode, DOffice, DPhone), COURSE(CCode, Credits, CoName, Level, CDesc), SECTION(SecId, SecNo, Sem, Year, Bldg, RoomNo, DaysTime), STUDENT(SId, DOB, FName, MName, LName, Addr, Phone, Major)",
        "관계: DEAN(COLLEGE 1,1 – INSTRUCTOR 0,1), CHAIR(DEPT–INSTRUCTOR, CStartDate), ADMINS(COLLEGE–DEPT), EMPLOYS(DEPT–INSTRUCTOR), HAS(DEPT–STUDENT), OFFERS(DEPT–COURSE), SECS(COURSE–SECTION), TEACHES(INSTRUCTOR–SECTION), TAKES(STUDENT–SECTION, Grade)",
        "Step 1 일반 엔티티: COLLEGE(**CName**, COffice, CPhone) · INSTRUCTOR(**Id**, Rank, IName, IOffice, IPhone) · DEPARTMENT(**DName**, DCode, DOffice, DPhone) · COURSE(**CCode**, Credits, CoName, Level, CDesc) · SECTION(**SecId**, SecNo, Sem, Year, Bldg, RoomNo, DaysTime) · STUDENT(**SId**, DOB, FName, MName, LName, Addr, Phone, Major)",
        "Step 2 1:1: COLLEGE + **DeanId** (DEAN) / DEPARTMENT + **ChairId, CStartDate** (CHAIR)",
        "Step 3 1:N: INSTRUCTOR + **Employed**(EMPLOYS) / DEPARTMENT + **Admined**(ADMINS) / COURSE + **Offered**(OFFERS) / SECTION + **Taught**(TEACHES), **Belongs**(SECS) / STUDENT + **Dept**(HAS)",
        "Step 4 M:N: **TAKES(SId, SecId, Grade)**",
      ],
    },
    {
      title: "요약 — ER과 관계 모델의 대응",
      en: "Correspondence between ER and Relational Models",
      lines: [],
      table: {
        title: "대응표",
        headers: ["ER MODEL", "RELATIONAL MODEL"],
        rows: [
          ["Entity type", "Entity relation"],
          ["1:1 or 1:N relationship type", "Foreign key (or relationship relation)"],
          ["M:N relationship type", "Relationship relation and two foreign keys"],
          ["n-ary relationship type", "Relationship relation and n foreign keys"],
          ["Simple attribute", "Attribute"],
          ["Composite attribute", "Set of simple component attributes"],
          ["Multivalued attribute", "Relation and foreign key"],
          ["Value set", "Domain"],
          ["Key attribute", "Primary (or secondary) key"],
        ],
      },
    },
    {
      title: "Practice 2 — RDB 매핑 실습",
      en: "RDB Mapping (Hands-on Practices)",
      lines: [
        "Recap: 관계형 모델 개념, 세 제약, ER–관계 대응표",
        "ER Diagram for Company → RDB for Company (위의 COMPANY 매핑)",
        "Exercise 1 **Library**: 이용자(ID, 성명, 주소, 생년월일), 도서(도서 ID, 제목, 위치, 출판일), 저자(ID, 성명, 이력), 출판사(ID, 이름, 홈페이지), 대출 기록(대출 ID, 대여일, 반납 예정일, 반납 여부, 연장 횟수, 연체료) — 관계: 대출함(이용자 1–N 대출 기록), 대출됨(도서 1–N 대출 기록), 저(저자 M–N 도서), 출판(출판사 1–N 도서)",
        "· 매핑 규칙대로: 1:N은 N쪽(대출 기록에 이용자 ID·도서 ID, 도서에 출판사 ID)에 FK, M:N 저(저자–도서)는 별도 릴레이션(저자 ID, 도서 ID)",
        "Exercise 2 **Student Laboratory**: Student(StudentID, Name(FirstName, LastName), Grade), Team(TeamName), LabSection(ClassID, Week, Assistant), DragExp(RunID, Distance, InitPosition, Time) — 관계: Member Of(Student M–N Team), Leader Of(Student 1–1 Team), In(Team–LabSection), Runs(LabSection–DragExp), Performs(Team–DragExpRun)",
        "Exercise 3 **MMORPG** — 정답 RDB 슬라이드는 그림만 있다",
      ],
    },
  ],

  sql: [
    {
      title: "Lecture 4 — SQL",
      en: "Structured Query Language",
      lines: [
        "특수 목적 **선언형(declarative)** 프로그래밍 언어 — IBM 최초 DBMS용으로 설계, 원래 이름 **SEQUEL**(Structured English Query Language) — Chamberlin & Boyce, 1974 / 'S-Q-L' 또는 'SEQUEL'로 발음",
        "**DDL**: DB와 테이블에 대한 명령 — CREATE Schema/Table, ALTER, DROP",
        "**DML**: 테이블의 튜플에 대한 명령 — 검색 SELECT / 수정 INSERT, DELETE, UPDATE",
      ],
    },
    {
      title: "Text-to-SQL",
      lines: [
        "자연어 질의를 원하는 정보를 가져오는 SQL로 바꾸는 기법",
        "도전: 자연어 **모호성** / **스키마 이해와 연결(linking)** / **복잡한 질의** 생성 / 처음 보는 DB로의 **일반화** (Li et al., NeurIPS 2023, BIRD 벤치마크)",
        "최근 LLM 기반 Text-to-SQL은 강력하지만 **오류 유형이 많고 완벽과 거리가 멀다** → **SQL을 제대로 이해하는 것이 중요!**",
      ],
    },
    {
      title: "스키마와 테이블 만들기",
      en: "CREATE SCHEMA, CREATE TABLE",
      lines: [
        "SQL의 **Schema**: 스키마를 기술하는 테이블·타입·제약·뷰·도메인 등 — **스키마 이름**으로 식별, 소유 사용자를 나타내는 **authorization identifier**",
        "CREATE TABLE: 새 릴레이션의 **이름, 속성, 초기 제약** — 테이블 이름에 스키마 이름을 붙일 수 있다(COMPANY.EMPLOYEE), 속성 = <이름, 데이터 타입> 쌍 목록, 초기 제약 = 속성 제약·무결성 제약",
      ],
      code: "CREATE SCHEMA COMPANY AUTHORIZATION 'Jsmith';\n\nCREATE TABLE EMPLOYEE\n( Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL,\n  Ssn CHAR(9) NOT NULL, Bdate DATE, Address VARCHAR(30), Sex CHAR,\n  Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL,\n  PRIMARY KEY (Ssn) );\n\nCREATE TABLE DEPARTMENT\n( Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL,\n  Mgr_ssn CHAR(9) NOT NULL, Mgr_start_date DATE,\n  PRIMARY KEY (Dnumber), UNIQUE (Dname),\n  FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) );\n\nCREATE TABLE DEPT_LOCATIONS\n( Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,\n  PRIMARY KEY (Dnumber, Dlocation),\n  FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) );",
    },
    {
      title: "속성 제약 · 키 제약",
      en: "Attribute Constraints, Key Constraints",
      lines: [
        "**NOT NULL**: 기본키 속성에는 **항상 암묵적으로** 지정 = 개체 무결성",
        "**DEFAULT <value>**: 명시적 값을 주지 않으면 새 튜플에 기본값 — 예: Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555' (새 직원의 기본 부서 지정)",
        "**PRIMARY KEY**: 기본키를 이루는 하나 이상의 속성",
        "**UNIQUE**: 대체(unique) 키 = **후보키**",
        "**CONSTRAINT 이름**으로 제약에 이름을 붙일 수 있다 (CONSTRAINT DEPTPK PRIMARY KEY(Dnumber), DEPTSK UNIQUE(Dname), DEPTMGRFK FOREIGN KEY …)",
      ],
    },
    {
      title: "참조 무결성 제약과 참조 트리거 동작",
      en: "Referential Integrity, Referential Triggered Actions",
      lines: [
        "**FOREIGN KEY**: 다른 릴레이션의 기본키를 참조",
        "PK 값이 **수정되거나 삭제**될 때 참조 무결성이 깨질 수 있다 — SQL의 기본 동작은 **reject**",
        "다른 방법? → **Referential Triggered Actions** — Trigger: **ON DELETE, ON UPDATE** / Action: **SET NULL, CASCADE, SET DEFAULT**",
        "예: EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) **ON DELETE SET NULL ON UPDATE CASCADE** — 감독자 튜플을 지우면 그를 참조하던 모든 직원의 Super_ssn이 자동으로 NULL / 감독자의 Ssn을 바꾸면 새 값이 참조하는 모든 직원의 Super_ssn으로 연쇄",
        "예: EMPLOYEE.Dno ON DELETE SET DEFAULT ON UPDATE CASCADE (Dno DEFAULT 1) / DEPARTMENT.Mgr_ssn ON DELETE SET DEFAULT ON UPDATE CASCADE (DEFAULT '888665555') / DEPT_LOCATIONS.Dnumber ON DELETE CASCADE ON UPDATE CASCADE",
        "토론: EMPSUPERFK를 **ON DELETE CASCADE**로 바꾼 뒤 DELETE EMPLOYEE WHERE Lname = 'Borg' → Borg(888665555)를 상사로 둔 Wong·Wallace가 연쇄 삭제되고, 그들을 상사로 둔 직원들도 차례로 지워진다 (감독 사슬 전체로 전파)",
      ],
    },
    {
      title: "Exercise 1 — LIBRARY 참조 동작 (정답)",
      lines: [
        "스키마: BOOK(Book_id, Title, Publisher_name) · BOOK_AUTHORS(Book_id, Author_name) · PUBLISHER(Name, Address, Phone) · BOOK_COPIES(Book_id, Branch_id, No_of_copies) · BOOK_LOANS(Book_id, Branch_id, Card_no, Date_out, Due_date) · LIBRARY_BRANCH(Branch_id, Branch_name, Address) · BORROWER(Card_no, Name, Address, Phone)",
        "BOOK_AUTHORS.Book_id → BOOK: **ON DELETE CASCADE**(책이 지워지면 저자 정보 불필요) / ON UPDATE CASCADE",
        "BOOK.Publisher_name → PUBLISHER.Name: **ON DELETE REJECT**(출판한 책이 있으면 출판사 삭제 불가) / ON UPDATE CASCADE",
        "BOOK_COPIES.Book_id → BOOK: ON DELETE CASCADE(목록에서 책을 빼면 사본도 관리 불필요) / ON UPDATE CASCADE",
        "BOOK_COPIES.Branch_id → LIBRARY_BRANCH: ON DELETE CASCADE(지점 폐쇄) / ON UPDATE CASCADE",
        "BOOK_LOANS.Book_id → BOOK: ON DELETE **REJECT (or CASCADE)**(남은 대출이 있을 수 있고 결국 돌려받아야) / ON UPDATE CASCADE",
        "BOOK_LOANS.Branch_id → LIBRARY_BRANCH: ON DELETE **CASCADE (or REJECT)**(지점 폐쇄 시 대출 면제) / ON UPDATE CASCADE",
        "BOOK_LOANS.Card_no → BORROWER: ON DELETE **REJECT**(모든 책을 반납·변상할 때까지 탈퇴 불가) / ON UPDATE CASCADE",
      ],
    },
    {
      title: "INSERT · DELETE · UPDATE",
      lines: [
        "**INSERT** Usage 1: 모든 속성 값을 **정의된 순서대로** / Usage 2: 속성 이름을 명시하고 대응 값 — **NOT NULL이면서 기본값 없는 속성은 반드시** 포함",
        "· INSERT INTO EMPLOYEE VALUES ('Richard', 'K', 'Marini', '653298653', '1962-12-30', '98 Oak Forest, Katy, TX', 'M', 37000, '653298653', 4);",
        "· INSERT INTO EMPLOYEE (Fname, Lname, Dno, Ssn) VALUES ('Richard', 'Marini', 4, '653298653');",
        "· 위반: (… '980760540', **2**) → Dnumber=2 부서 없음 → 참조 무결성 위반, 거부 / ('Robert', 'Hatcher', 5)로 **Ssn 없음** → NOT NULL 위반, 거부",
        "**DELETE**: WHERE로 **한 릴레이션**에서 지울 튜플 선택 — 한 번에 한 테이블에서만, 참조 트리거 동작(ON DELETE CASCADE)이 있으면 다른 릴레이션으로 전파 / 지워지는 수는 다양 / **WHERE가 없으면 모든 튜플 삭제!**",
        "· Lname='Brown' → 0개 / Ssn='123456789' → 1개 / Dno=5 → **4개** / WHERE 없음 → 전부",
        "**UPDATE**: WHERE로 한 릴레이션의 튜플 선택, SET으로 바꿀 속성과 새 값 — ON UPDATE CASCADE면 전파",
        "· UPDATE PROJECT SET Plocation='Bellaire', Dnum=5 WHERE Pnumber=10; / UPDATE EMPLOYEE SET Salary = Salary * 1.1 WHERE Dno = 5; — UPDATE 하나로 여러 튜플 수정 가능",
      ],
    },
    {
      title: "SELECT-FROM-WHERE",
      en: "Data Retrieval in SQL",
      lines: [
        "SQL의 기본 검색문은 하나 — **SELECT <attribute list> FROM <table list> WHERE <condition>**",
        "<attribute list> = 가져올 속성 = **projection attributes** / <table list> = 질의에 필요한 릴레이션 / <condition> = 가져올 튜플을 정하는 Boolean 식 = **selection condition + join condition**",
        "Query 1: 'John B. Smith'의 생일과 주소 → SELECT Bdate, Address FROM EMPLOYEE WHERE Fname='John' AND Minit='B' AND Lname='Smith'; → 1965-01-09, 731 Fondren, Houston, TX",
        "Query 2: 'Research' 부서 모든 직원의 이름과 주소 → SELECT Fname, Lname, Address FROM EMPLOYEE, DEPARTMENT WHERE **Dname='Research'**(selection) AND **Dnumber=Dno**(join: DEPARTMENT 튜플과 EMPLOYEE 튜플을 결합); → John Smith, Franklin Wong, Ramesh Narayan, Joyce English",
      ],
    },
    {
      title: "모호한 속성 이름 · 별칭",
      en: "Ambiguous Attribute Name, Renaming",
      lines: [
        "다른 릴레이션의 두 속성이 같은 이름일 수 있다 → 여러 테이블 질의에서 같은 이름이 둘 이상이면 **릴레이션 이름으로 한정**: EMPLOYEE.Name, DEPARTMENT.Name — 마침표(.)로 구분",
        "완전히 한정된 이름은 명확하지만 긴 테이블 이름을 반복 입력해야 → **Alias(tuple variable)**: FROM EMPLOYEE AS E, DEPARTMENT AS D",
        "같은 릴레이션을 **두 번** 참조할 때도 모호성이 생긴다: 직원과 직속 상사의 이름 → SELECT E.Fname, E.Lname, S.Fname, S.Lname FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn;",
      ],
    },
    {
      title: "WHERE 생략 · 별표(*)",
      en: "Two more features of SQL",
      lines: [
        "**WHERE 생략**: 튜플 선택 조건 없음 → FROM의 릴레이션의 **모든 튜플** — SELECT Ssn FROM EMPLOYEE; → 8개",
        "두 릴레이션에서 WHERE를 빼면 **모든 조합**: SELECT Ssn, Dname FROM EMPLOYEE, DEPARTMENT; → **3 × 8 = 24**행",
        "→ \"모든 selection과 join 조건을 WHERE에 명시하는 것이 **매우 중요**! 빠뜨리면 틀리고 아주 큰 결과가 나올 수 있다\"",
        "**별표(*)**: 선택된 튜플의 **모든 속성** 값 — 속성 이름을 다 적는 불편을 피함: SELECT * FROM EMPLOYEE WHERE Dno = 5;",
      ],
    },
    {
      title: "다중집합으로서의 테이블",
      en: "Tables as (Multi)Sets",
      lines: [
        "SQL은 테이블을 집합이 아니라 **multiset**으로 다룬다 — 테이블(또는 질의 결과)에 **중복 튜플**이 있을 수 있고, 자동으로 제거하지 않는다",
        "이유: 중복 제거는 **비싸다**(정렬 후 제거) / 사용자가 중복을 **보고 싶을** 수 있다 / **집계 함수**에는 중복이 필요할 수 있다",
        "**ALL**: 중복 제거 안 함 / **DISTINCT**: 중복 제거 — Q1 SELECT ALL Salary → 30000, 40000, 25000, 43000, 38000, 25000, 25000, 55000 / Q2 SELECT DISTINCT Salary → 30000, 40000, 25000, 43000, 38000, 55000",
        "**집합 연산**: UNION, EXCEPT(차), INTERSECT — 결과는 **튜플의 집합**(중복 제거), **type-compatible** 릴레이션에만",
        "· Query 4: 'Smith'가 일꾼이거나 그 프로젝트를 통제하는 부서의 관리자인 프로젝트 번호 → (SELECT DISTINCT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum=Dnumber AND Mgr_ssn=Ssn AND Lname='Smith') UNION (SELECT DISTINCT Pnumber FROM PROJECT, WORKS_ON, EMPLOYEE WHERE Pnumber=Pno AND Essn=Ssn AND Lname='Smith');",
        "**다중집합 연산**: UNION ALL, EXCEPT ALL, INTERSECT ALL — R(A)={a1,a2,a2,a3}, S(A)={a1,a2,a4,a5} → UNION ALL = a1,a1,a2,a2,a2,a3,a4,a5 / EXCEPT ALL = a2,a3 / INTERSECT ALL = a1,a2",
      ],
    },
    {
      title: "ORDER BY · 산술 연산 · BETWEEN",
      lines: [
        "**ORDER BY**: 하나 이상 속성 값으로 결과 정렬, 기본은 **오름차순** — DESC / ASC",
        "· Query 15: 부서별로, 부서 안에서는 성·이름 알파벳순으로 직원과 프로젝트 → SELECT D.Dname, E.Lname, E.Fname, P.Pname FROM DEPARTMENT AS D, EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P WHERE D.Dnumber = E.Dno AND E.Ssn = W.Essn AND W.Pno = P.Pnumber ORDER BY D.Dname, E.Lname, E.Fname; (또는 ORDER BY D.Dname DESC, E.Lname ASC, E.Fname ASC)",
        "**산술 연산자** +, −, *, / 를 숫자 속성에 — Query 13: ProductX 직원에게 10% 인상 시 월급 → SELECT E.Fname, E.Lname, 1.1 * E.Salary AS Increased_sal FROM EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P WHERE E.Ssn = W.Essn AND W.Pno = P.Pnumber AND P.Pname = 'ProductX'; → 30,000×1.1 = 33,000, 25,000×1.1 = 27,500",
        "**BETWEEN**: WHERE에서 값 범위 — Query 14: 5번 부서에서 월급 30,000~40,000 → (Salary BETWEEN 30000 AND 40000) AND Dno = 5 ≡ ((Salary >= 30000) AND (Salary <= 40000))",
      ],
    },
    {
      title: "Exercise 2·3 — 검색 (정답)",
      lines: [
        "Ex2: 5번 부서에서 'ProductX'에 주당 10시간 넘게 일하는 직원 이름",
        "Ex3: CS 전공 4학년(Class=4)의 이름과 성적표(과목명, 과목 번호, 학점, 학기, 연도, 성적)",
      ],
      code: "-- Ex2: 3 selection + 2 join conditions\nSELECT E.Fname, E.Minit, E.Lname\nFROM   EMPLOYEE AS E, PROJECT AS P, WORKS_ON AS W\nWHERE  E.Dno = 5 AND P.Pname = 'ProductX' AND W.Hours > 10\n  AND  E.Ssn = W.Essn AND W.Pno = P.Pnumber;\n-- 교안 슬라이드는 마지막 조건을 E.Dno = P.Dnum 으로 적었다. 그러면 WORKS_ON 과\n-- PROJECT 가 이어지지 않아 'ProductX 에서' 10시간이 보장되지 않는다 → W.Pno = P.Pnumber\n\n-- Ex3\nSELECT S1.Name, C.Course_name, C.Course_number, C.Credit_hours,\n       S2.Semester, S2.Year, G.Grade\nFROM   STUDENT AS S1, COURSE AS C, SECTION AS S2, GRADE_REPORT AS G\nWHERE  S1.Class = '4' AND S1.Major = 'CS'\n  AND  S1.Student_number = G.Student_number\n  AND  G.Section_identifier = S2.Section_identifier\n  AND  S2.Course_number = C.Course_number;",
    },
  ],

  sqladv: [
    {
      title: "중첩 질의",
      en: "Nested Query",
      lines: [
        "다른 질의의 **WHERE 절 안에 있는 완전한 SELECT-FROM-WHERE 블록** — DB의 기존 값을 가져와 WHERE 비교에 쓸 때 유용, (다중)집합의 튜플을 반환",
        "Query 4를 중첩으로: SELECT DISTINCT Pnumber FROM PROJECT WHERE Pnumber IN (SELECT Pnumber FROM PROJECT, DEPARTMENT, EMPLOYEE WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith') OR Pnumber IN (SELECT Pno FROM WORKS_ON, EMPLOYEE WHERE Essn = Ssn AND Lname = 'Smith');",
        "**IN**: 값 v를 값의 (다중)집합 V와 비교 — v가 V의 원소 중 하나면 TRUE",
        "**ALL / ANY**: v가 V의 일부(ANY) 또는 모든(ALL) 값과 같으면 TRUE — '=' 외에 >, >=, <, <=, <> 도 결합 가능",
        "· 5번 부서 모든 직원보다 월급이 많은 직원: WHERE Salary > ALL (SELECT Salary FROM EMPLOYEE WHERE Dno = 5);",
        "· **Pnumber = ANY (SELECT …) ≡ IN**, Salary > ALL, Salary < ALL, Pnumber > ANY, Pnumber < ANY …",
      ],
    },
    {
      title: "중첩 질의의 모호성",
      en: "Ambiguity in Nested Queries",
      lines: [
        "여러 단계의 중첩에서 같은 속성 이름이 있으면 모호 — 바깥 FROM의 것과 안쪽 FROM의 것",
        "별칭으로 해결 — Query 16: 부양가족 중 이름과 성별이 직원과 같은 사람이 있는 직원 → SELECT E.Fname, E.Lname FROM EMPLOYEE AS E WHERE E.Ssn IN (SELECT D.Essn FROM DEPENDENT AS D WHERE E.Fname = D.Dependent_name AND E.Sex = D.Sex);",
        "\"참조하는 **모든 테이블에 tuple variable(별칭)**을 만드는 것이 일반적으로 좋다\"",
      ],
    },
    {
      title: "EXISTS · NOT EXISTS",
      en: "Boolean Functions",
      lines: [
        "**EXISTS**: 중첩 질의 결과가 비었는지 확인 — 보통 WHERE 조건, 결과에 **튜플이 하나라도 있으면 TRUE**",
        "· Query 16을 EXISTS로: WHERE EXISTS (SELECT * FROM DEPENDENT AS D WHERE E.Ssn = D.Essn AND E.Sex = D.Sex AND E.Fname = D.Dependent_name);",
        "**NOT EXISTS**: 중첩 질의 결과에 **튜플이 없으면 TRUE**",
        "· Query 6: 부양가족이 없는 직원 → SELECT Fname, Lname FROM EMPLOYEE WHERE NOT EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn); — 특정 EMPLOYEE 튜플에 관련된 모든 DEPENDENT 튜플을 가져온다",
        "예: 부양가족이 한 명 이상 있는 **관리자** → WHERE EXISTS (SELECT * FROM DEPENDENT WHERE Ssn = Essn) AND EXISTS (SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn); — 첫 중첩: 직원의 DEPENDENT 튜플, 둘째: 그 직원이 관리하는 DEPARTMENT 튜플 → **'Franklin, Wong', 'Jennifer, Wallace'**",
        "Exercise 4: 5번 부서가 통제하는 **모든** 프로젝트에서 일하는 직원 → SELECT Fname, Lname FROM EMPLOYEE WHERE NOT EXISTS ((SELECT Pnumber FROM PROJECT WHERE Dnum = 5) **EXCEPT** (SELECT Pno FROM WORKS_ON WHERE Ssn = Essn)); — 집합 차: Pnumber와 Pno가 호환",
      ],
    },
    {
      title: "조인 테이블 · 내부 조인 · 외부 조인",
      en: "Joined Tables, Inner Join, Outer Join",
      lines: [
        "**Joined table**: FROM 절의 조인 연산으로 만든 테이블 — WHERE에 선택·조인 조건을 섞는 것보다 **이해하기 쉽다**",
        "· SELECT Fname, Lname, Address FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber) WHERE Dname = 'Research'; — 결과는 첫 테이블(EMPLOYEE)의 모든 속성 다음에 둘째(DEPARTMENT)의 모든 속성",
        "**Inner join**(기본): 다른 릴레이션에 **짝이 있을 때만** 결과에 포함 — SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name FROM EMPLOYEE AS E, EMPLOYEE AS S WHERE E.Super_ssn = S.Ssn; → 상사가 있는 직원만, Super_ssn이 NULL인 튜플(Borg)은 제외",
        "Q. 모든 직원을 가져오려면? → **OUTER JOIN**",
        "**Outer join**: 짝이 없어도 튜플을 가져옴 — 없는 속성은 **NULL로 채움** / FROM (EMPLOYEE AS E **LEFT OUTER JOIN** EMPLOYEE AS S ON E.Super_ssn = S.Ssn) → 888665555의 Super_ssn은 NULL / LEFT OUTER JOIN에서는 **왼쪽 테이블의 모든 튜플**이 결과에 나와야",
        "벤 다이어그램: Inner join(교집합) / LEFT JOIN / FULL OUTER JOIN / RIGHT JOIN / LEFT JOIN … WHERE B.KEY IS NULL(A에만) / FULL OUTER JOIN … WHERE A.KEY IS NULL OR B.KEY IS NULL(한쪽에만) / RIGHT JOIN … WHERE A.KEY IS NULL(B에만)",
      ],
    },
    {
      title: "집계 함수",
      en: "Aggregate Functions",
      lines: [
        "여러 튜플의 정보를 **한 튜플 요약**으로 — 보통 SELECT(또는 HAVING) 절에",
        "**COUNT**: 튜플이나 값의 수 / **SUM, MAX, MIN, AVG**: 숫자 값의 (다중)집합에 — 합·최대·최소·평균",
        "Query 19: SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary) FROM EMPLOYEE; — EMPLOYEE 모든 행의 **단일 행 요약**",
        "Query 20: Research 부서의 같은 값 → … FROM (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber) WHERE Dname = 'Research';",
        "Query 21·22: SELECT COUNT(*) FROM EMPLOYEE; / … FROM EMPLOYEE, DEPARTMENT WHERE DNO = DNUMBER AND DNAME = 'Research'; — **(*)는 행(튜플)**, COUNT(*)는 결과의 행 수",
        "Query 23: SELECT COUNT(DISTINCT Salary) FROM EMPLOYEE; — Q1. COUNT(Salary)면? (중복 포함 개수) Q2. NULL도 세나? (COUNT(속성)은 NULL을 세지 않는다)",
        "중첩 질의 조건에도: (1) 집계가 있는 중첩 질의 (2) 그 결과를 바깥 WHERE에서 — 부양가족 2명 이상: SELECT Lname, Fname FROM EMPLOYEE WHERE (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2;",
      ],
    },
    {
      title: "그룹화 · HAVING",
      en: "Grouping in SQL",
      lines: [
        "**Grouping**: 릴레이션의 튜플을 **겹치지 않는 부분집합(그룹)**으로 나눔 — 그룹마다 집계를 적용(부서별 평균 월급, 프로젝트별 인원), 그룹을 독립적으로 요약할 때 유용",
        "**Grouping attributes**: 그룹의 기준 속성, 같은 값을 가진 튜플끼리 한 그룹 — **GROUP BY** 절",
        "Query 24: 부서별 부서 번호, 인원, 평균 월급 → SELECT Dno, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Dno; → (5, 4, 33250), (4, 3, 31000), (1, 1, 55000)",
        "예: 프로젝트별 번호·이름·인원 → SELECT Pnumber, Pname, COUNT(*) FROM PROJECT, WORKS_ON WHERE Pnumber = Pno GROUP BY Pnumber, Pname; → 1 ProductX 2, 2 ProductY 3, 3 ProductZ 2, …",
        "**HAVING**: 그룹 튜플의 **요약 정보에 대한 조건** — GROUP BY와 함께",
        "Query 26: **두 명보다 많은** 직원이 일하는 프로젝트 → … GROUP BY Pnumber, Pname HAVING COUNT(*) > 2; → ProductY, Computerization, Reorganization, Newbenefits (각 3명)",
        "Exercise 5: 평균 월급 $30,000 초과 부서의 이름과 인원 → SELECT D.Dname, COUNT(*) FROM EMPLOYEE AS E, DEPARTMENT AS D WHERE E.Dno = D.Dnumber GROUP BY E.Dno HAVING AVG(E.Salary) > 30000; (교안 표기. 표준 SQL로는 GROUP BY D.Dname이 안전)",
      ],
    },
    {
      title: "어서션과 트리거",
      en: "Assertions and Triggers",
      lines: [
        "**Assertion**: 기본 제약(키, 개체·참조 무결성)에 들지 않는 **일반 제약** — 예: 직원 월급은 그 부서 관리자 월급보다 크면 안 된다",
        "**Trigger**: 특정 사건과 조건이 생기면 **자동으로 취할 행동** — 예: 직원 출장비가 한도를 넘으면 관리자에게 알림",
        "CREATE ASSERTION: CHECK 뒤 괄호 안 조건은 **모든 DB 상태에서 참**이어야 — 보통 **EXISTS / NOT EXISTS** 스타일, 위반하는 튜플을 찾는 질의를 NOT EXISTS로 감싼다 → 결과가 비면 True, 비지 않으면 False",
        "CREATE TRIGGER SALARY_VIOLATION: 직원 월급이 직속 상사보다 크면 — 촉발 사건 여럿: **새 직원 삽입, 월급 변경, 상사 변경** — 행동: 외부 저장 프로시저 호출",
        "트리거 = **ECA (Event, Condition, Action) rule**",
        "**Event**: DB에 명시적으로 적용된 갱신 연산 — 가능한 모든 사건을 고려(여러 트리거가 필요할 수도), **BEFORE / AFTER**로 촉발 연산 전후 지정",
        "**Condition**: 사건이 생겼을 때 행동을 할지 결정 — 선택적, **WHEN** 절, 참일 때만 실행, 조건이 없으면 사건만으로 실행",
        "**Action**: 자동 실행할 규칙 행동 — SQL 문의 나열, DB 트랜잭션, 또는 외부 프로그램",
      ],
      code: "CREATE ASSERTION SALARY_CONSTRAINT\nCHECK ( NOT EXISTS ( SELECT *\n                     FROM   EMPLOYEE E, EMPLOYEE M, DEPARTMENT D\n                     WHERE  E.Salary > M.Salary\n                       AND  E.Dno = D.Dnumber\n                       AND  D.Mgr_ssn = M.Ssn ) );\n\nCREATE TRIGGER SALARY_VIOLATION\nBEFORE INSERT OR UPDATE OF SALARY, SUPERVISOR_SSN ON EMPLOYEE\nFOR EACH ROW\nWHEN ( NEW.SALARY > ( SELECT SALARY FROM EMPLOYEE\n                      WHERE SSN = NEW.SUPERVISOR_SSN ) )\n  INFORM_SUPERVISOR(NEW.Supervisor_ssn, NEW.Ssn);",
    },
  ],

  view: [
    {
      title: "Lecture 5 — 뷰의 개념",
      en: "Concept of a View in SQL",
      lines: [
        "**기본 테이블에서 유도된 가상 테이블** — 물리적으로 존재하지 않을 수 있다",
        "뷰에 대한 **검색은 제한 없음**, **갱신은 보통 제한**(read-only)",
        "동기: **복잡한 질의를 단순화** — 자주 쓰는 질의가 여러 테이블을 복잡한 조건(조인, 집계)으로 참조 → 실행할 때마다 세 테이블 조인 → 조인 결과를 뷰로 두면 **단일 테이블 질의**로 같은 결과",
        "예: WORKS_ON1(Fname, Lname, Pname, Hours), DEPT_INFO(Dept_name, No_of_emps, Total_sal)",
      ],
    },
    {
      title: "CREATE VIEW · 뷰에 대한 질의",
      lines: [
        "**CREATE VIEW <View Name> AS <Select Query>** — 속성 이름을 안 주면 **정의 테이블의 이름 그대로**, 명시적으로 줄 수도 있다",
        "CREATE VIEW WORKS_ON1 AS SELECT Fname, Lname, Pname, Hours FROM EMPLOYEE, PROJECT, WORKS_ON WHERE Ssn = Essn AND Pno = Pnumber;",
        "CREATE VIEW DEPT_INFO(Dept_name, No_of_emps, Total_sal) AS SELECT Dname, COUNT(*), SUM(Salary) FROM DEPARTMENT, EMPLOYEE WHERE Dnumber = Dno GROUP BY Dname;",
        "뷰에 대한 질의는 **기본 테이블과 같은 방식** — 'ProductX'에서 일하는 직원: SELECT Fname, Lname FROM WORKS_ON1 WHERE Pname = 'ProductX'; → 매번 세 테이블을 조인할 필요 없음 (Q. 언제 뷰를 쓰나?)",
        "뷰는 **최신(up-to-date)**이어야 — 정의 테이블의 튜플이 바뀌면? → 변경을 뷰에 반영하는 것은 **DBMS의 책임**",
      ],
    },
    {
      title: "뷰의 구현",
      en: "View Implementation in the DBMS",
      lines: [
        "두 방법: **Query modification** / **View materialization**",
        "**Query modification**: 뷰 질의를 **기본 테이블에 대한 질의로 변환** — 뷰를 물리적으로 유지하지 않음 / 예: SELECT Fname, Lname FROM WORKS_ON1 WHERE Pname='ProductX' → SELECT Fname, Lname FROM EMPLOYEE, PROJECT, WORKS_ON WHERE Ssn = Essn AND Pno = Pnumber AND Pname = 'ProductX'; — 사용자에게는 편하지만 DB 시스템에는 아님, \"Not aligned with the philosophy of Views in SQL\"",
        "**View materialization**: 뷰를 처음 질의할 때 **물리적으로 뷰 테이블을 생성**하고 '한동안'(얼마나?) 유지 — 가정: 그 뷰에 대한 다른 검색이 (바라건대) 자주 이어진다 / **Incremental updates**: 정의 테이블이 갱신되면 뷰에 점진적으로 반영",
        "언제·어떻게 갱신? **Immediate update**(기본 테이블 갱신 즉시 — 늘 최신이지만 때로 불필요·비효율) / **Lazy update**(뷰 질의가 필요할 때 — 질의 전까지는 최신 아님) / **Periodic update**(주기적으로 — 결과가 최신이 아닐 수 있음)",
        "**DROP VIEW**: 더 필요 없으면 — 정의 테이블에는 **영향 없음**",
      ],
    },
    {
      title: "뷰 갱신",
      en: "Update Operations on Views",
      lines: [
        "검색 질의는 어떤 뷰에든 가능 / INSERT·DELETE·UPDATE는 **많은 경우 불가능**",
        "**Case 1 (허용)**: **집계 함수 없는 단일 테이블** 뷰의 갱신 — 기본 테이블의 갱신으로 매핑 가능",
        "**Case 2 (불허)**: **조인(여러 테이블)이나 집계**를 쓴 뷰의 갱신 — 기본 릴레이션 갱신으로 **여러 방식**으로 매핑될 수 있다",
        "예: UPDATE WORKS_ON1 SET Pname = 'ProductY' WHERE Lname='Smith' AND Fname='John' AND Pname='ProductX'; — 목적? 'John Smith가 일하는 프로젝트를 바꾸려는 것'? 아니면 '프로젝트 이름 ProductX를 ProductY로'?",
        "· 해석 1: UPDATE WORKS_ON SET Pno = (SELECT Pnumber FROM PROJECT WHERE Pname='ProductY') WHERE Essn IN (SELECT Ssn FROM EMPLOYEE WHERE Lname='Smith' AND Fname='John') AND Pno = (SELECT Pnumber FROM PROJECT WHERE Pname='ProductX'); — Smith를 ProductY 튜플과 연결",
        "· 해석 2: UPDATE PROJECT SET Pname='ProductY' WHERE Pname='ProductX'; — 원하는 효과는 나지만 다른 질의 결과에 **부작용**(Pname='ProductX'인 모든 뷰 튜플이 바뀜)",
        "**Impossible update**: UPDATE DEPT_INFO SET Total_sal = 100000 WHERE Dname = 'Research'; — Total_sal은 집계로 계산된 값(물리적으로 저장 안 됨), 95,000 → 100,000이 무슨 뜻? 말이 안 된다",
      ],
    },
    {
      title: "뷰 갱신 — 관찰",
      en: "View Update: Observations",
      lines: [
        "뷰 갱신이 가능한 때: 원하는 갱신을 이루는 기본 릴레이션 갱신이 **단 하나**일 때",
        "**Case 1 단일 테이블**: 뷰 속성에 (1) 기본 릴레이션의 **기본키** (2) **기본값 없는 NOT NULL 속성 전부**가 들어 있으면 갱신 가능",
        "**Case 2 조인을 쓴 여러 테이블**: 일반적으로 갱신 불가 — 질의가 둘 이상의 갱신으로 매핑될 수 있어서",
        "**Case 3 그룹·집계**: 갱신 불가 — 말이 안 되므로",
      ],
    },
    {
      title: "권한 부여로서의 뷰",
      en: "Views as Authorization",
      lines: [
        "권한 없는 사용자에게서 **특정 속성(열)이나 튜플(행)을 숨긴다**",
        "Example 1 **DEPT5EMP**: 5번 부서 관리자는 5번 부서 직원 정보만 — 뷰를 만들고 그 뷰에 대한 질의 권한만 주고 EMPLOYEE 권한은 주지 않는다 → CREATE VIEW DEPT5EMP AS SELECT * FROM EMPLOYEE WHERE Dno = 5;",
        "Example 2 **BASIC_EMP_DATA**: 특정 열만 — 일반 직원은 이름·성·주소만 → CREATE VIEW BASIC_EMP_DATA AS SELECT Fname, Lname, Address FROM EMPLOYEE;",
      ],
    },
    {
      title: "Exercise — 뷰 만들기 (정답)",
      lines: [
        "Ex1: **모든 부서**의 부서 이름, 관리자 이름, 관리자 월급 → 각 부서와 관리자를 설명하는 뷰",
        "· CREATE VIEW DEPT_INFO(DeptName, MgrFname, MgrLname, MgrSalary) AS SELECT D.Dname, E.Fname, E.Lname, E.Salary FROM DEPARTMENT AS D, EMPLOYEE AS E WHERE D.Mgr_ssn = E.Ssn; → (Research, Franklin T Wong, 40000), (Administration, Jennifer S Wallace, 43000), (Headquarters, James E Borg, 55000)",
        "Ex2: **각 프로젝트**의 이름, 통제 부서 이름, 인원, 주당 총 시간 → 각 프로젝트와 현재 상태를 설명하는 뷰",
        "· CREATE VIEW ProjectInfo(Pname, Dname, NumEmployees, TotalHours) AS SELECT P.Pname, D.Dname, COUNT(*), SUM(W.Hours) FROM PROJECT AS P, WORKS_ON AS W, DEPARTMENT AS D WHERE P.Pnumber = W.Pno AND D.Dnumber = P.Dnum GROUP BY P.Pnumber, P.Pname; — 그룹마다 인원과 총 시간 계산",
      ],
    },
  ],

  ra: [
    {
      title: "Lecture 6 — 관계 대수란",
      en: "Introduction to Relational Algebra",
      lines: [
        "대수: 방정식에서 수와 양을 문자·기호로 (+, −, *, /) / 선형대수: 벡터 공간의 선형 변환 (벡터 덧셈, 스칼라 곱, 행렬 연산)",
        "**관계 대수**: '어떻게 데이터를 얻나'에 대한 이론적·수학적 모델 (**절차적, procedural**) — 형식적 관계 모델의 기본 연산 집합",
        "왜 중요? 관계 모델 연산의 **형식적 기초**(selection, projection, renaming, join, cartesian product…), **집합 개념**에 엄격히 기반 / DBMS 내부 모듈의 핵심 연산이 관계 대수 기반 / **질의 처리·최적화(11주)**의 바탕 — 결과를 얻는 연산 순서를 명시",
        "Recap(Lecture 4): Nested query, Joined table(inner/outer), Aggregate, Grouping",
      ],
    },
    {
      title: "SELECT σ",
      en: "Unary Relational Operations: SELECT",
      lines: [
        "**한 릴레이션**에서 선택 조건을 만족하는 튜플의 부분집합을 고른다 — 조건을 만족하는 튜플만 남기는 필터, **가로 분할**로 시각화(선택됨 vs 걸러짐)",
        "표기 **σ<selection condition>(R)** — σ(sigma) = SELECT 연산자, 조건 = R 속성에 대한 Boolean 식, R = 결과가 릴레이션인 관계 대수식(가장 단순하게는 릴레이션 이름)",
        "결과는 R과 **같은 속성** → **차수(degree)가 R과 같다**",
        "조건 절의 형태: <attribute name> <comparison op> <constant value> 또는 <attribute> <op> <attribute> — 비교 연산자 {=,<,≤,>,≥,≠}: 순서 있는 값(숫자·날짜)은 전부, 순서 없는 값(Color = {'red','blue',…})은 {=,≠}만 / AND, OR, NOT으로 연결",
        "**단항(unary)**: 한 릴레이션에 적용, 각 튜플에 **개별** 적용 — σDno=4(EMPLOYEE)",
        "**교환 가능(commutative)**: σ<c1>(σ<c2>(R)) = σ<c2>(σ<c1>(R)) / 여러 SELECT를 하나로 합칠 수 있다: σ<c1>(σ<c2>(…σ<cn>(R))) = σ<c1> AND <c2> AND … AND <cn>(R)",
        "SQL 대응: σDno=4 AND Salary>25000(EMPLOYEE) ⟷ SELECT * FROM EMPLOYEE WHERE Dno=4 AND Salary>25000; — 선택 조건은 **WHERE 절**",
      ],
    },
    {
      title: "PROJECT π",
      en: "Unary Relational Operations: PROJECT",
      lines: [
        "테이블에서 **특정 열을 고르고** 나머지 열은 버린다 (SELECT는 행을 고름) — **세로 분할**",
        "표기 **π<attribute list>(R)** — π(pi) = PROJECT 연산자, 원하는 속성 목록",
        "결과는 <attribute list>의 속성만 — **차수 = 속성 목록의 개수**",
        "**중복 제거**: 키가 아닌 속성만 고르면 중복이 생기기 쉬운데, PROJECT는 중복 튜플을 제거 — 결과는 서로 다른 튜플의 **집합** / 예: πSex, Salary(EMPLOYEE) → (F, 25000)이 한 번만",
        "SQL 대응: πSex, Salary(EMPLOYEE) ⟷ SELECT **DISTINCT** Sex, Salary FROM EMPLOYEE; — 속성 목록은 **SELECT 절**",
      ],
    },
    {
      title: "연산 잇기 · RENAME ρ",
      en: "Sequences of Operations, RENAME",
      lines: [
        "Q. 5번 부서 직원의 이름, 성, 월급",
        "방법 1: **중간 결과에 이름** — 대입 연산(←): DEP5_EMPS ← σDno=5(EMPLOYEE), RESULT ← πFname, Lname, Salary(DEP5_EMPS)",
        "방법 2: **하나의 식**으로 중첩 — πFname, Lname, Salary(σDno=5(EMPLOYEE))",
        "\"복잡한 연산은 **중간 결과 릴레이션을 명시**하는 편이 하나의 식보다 보통 더 쉽다\"",
        "**RENAME ρ(rho)**: 릴레이션 이름이나 속성 이름, 또는 둘 다 바꾸는 단항 연산 — **ρS(B1,…,Bn)(R)** 둘 다 / **ρS(R)** 릴레이션만 / **ρ(B1,…,Bn)(R)** 속성만 (S = 새 릴레이션 이름, Bi = 새 속성 이름, n = R의 차수)",
        "중간 릴레이션에서도 속성 이름을 바꿀 수 있다: TEMP ← σDno=5(EMPLOYEE), R(First_name, Last_name, Salary) ← πFname, Lname, Salary(TEMP)",
        "SQL 대응: SELECT E.Fname AS First_name, E.Lname AS Last_name, E.Salary AS Salary FROM EMPLOYEE AS E WHERE E.Dno=5; — SQL의 rename은 **AS 별칭**, 단일 SQL 질의는 보통 복잡한 관계 대수식에 해당",
      ],
    },
    {
      title: "집합 연산",
      en: "Set Operations",
      lines: [
        "**UNION, INTERSECTION, SET DIFFERENCE(MINUS, EXCEPT)** — 두 집합에 적용하는 이항 연산",
        "**Type(Union) Compatibility**: R(A1,…,An)과 S(B1,…,Bn)이 dom(Ai) = dom(Bi) (1 ≤ i ≤ n) — 속성 수가 같고 대응 속성의 도메인이 같다",
        "**UNION R ∪ S**: R이나 S나 둘 다에 있는 모든 튜플, **중복 제거** — 예: STUDENT ∪ INSTRUCTOR = 모든 학생과 강사의 이름",
        "**INTERSECTION R ∩ S**: 둘 다에 있는 튜플",
        "∪·∩ 성질: **교환** R∪S = S∪R, R∩S = S∩R / **결합** R∪(S∪T) = (R∪S)∪T, R∩(S∩T) = (R∩S)∩T",
        "**MINUS R − S**: R에는 있고 S에는 없는 튜플 — **교환 안 됨**: R − S ≠ S − R / 예: STUDENT − INSTRUCTOR = {Johnny Kohler, Barbara Jones, Amy Ford, Jimmy Wang, Ernest Gilbert}, INSTRUCTOR − STUDENT = {John Smith, Ricardo Browne, Francis Johnson}",
      ],
    },
    {
      title: "카티션 곱 ×",
      en: "CARTESIAN PRODUCT",
      lines: [
        "**type-compatible이 아니어도** 적용 가능한 이항 집합 연산 — a.k.a CROSS PRODUCT, CROSS JOIN",
        "가능한 **모든 튜플 조합**을 이어 붙인다 — R(A1,…,An) × S(B1,…,Bm) → Q(A1,…,An, B1,…,Bm) / 속성 수 **n + m**, 튜플 수 **|R| × |S|**",
        "혼자서는 대개 무의미, 뒤에 특정 값을 맞추는 **선택**이 따를 때 유용",
        "예: 여직원의 부양가족 이름 — FEMALE_EMPS ← σSex='F'(EMPLOYEE) / EMPNAMES ← πFname, Lname, Ssn(FEMALE_EMPS) (Alicia Zelaya, Jennifer Wallace, Joyce English — 3 tuples) / EMP_DEPENDENTS ← EMPNAMES × DEPENDENT (7 tuples → **3×7 = 21** tuples, 의미 없음) / ACTUAL_DEPENDENTS ← σSsn=Essn(EMP_DEPENDENTS) / RESULT ← πFname, Lname, Dependent_name(ACTUAL_DEPENDENTS) → **Jennifer Wallace, Abner**",
        "**카티션 곱 다음 SELECT**가 관련 튜플을 결합하는 흔한 순서 → 이를 한 연산으로 = **JOIN**",
      ],
    },
    {
      title: "JOIN ⋈",
      en: "Binary Relational Operations: JOIN",
      lines: [
        "두 릴레이션의 **관련 튜플을 하나의 더 긴 튜플로** 결합 — DEPT_MGR ← DEPARTMENT ⋈Mgr_ssn=Ssn EMPLOYEE",
        "JOIN = **카티션 곱 후 SELECT**: EMP_DEPENDENTS ← EMPNAMES × DEPENDENT, ACTUAL_DEPENDENTS ← σSsn=Essn(…) ⟹ ACTUAL_DEPENDENTS ← EMPNAMES ⋈Ssn=Essn DEPENDENT",
        "표기 **R ⋈<join condition> S** → Q(A1,…,An, B1,…,Bm) — **조건을 만족하는 조합만** (조합마다 조건을 평가) / 카티션 곱은 모든 조합",
        "일반 조인 조건: 여러 Boolean 식을 AND로 — 각 조건은 **Ai θ Bj** (θ(theta) ∈ {=,<,≤,>,≥,≠}) → theta join",
        "**EQUIJOIN**: 비교 연산자로 **'='만** — 한 쌍 이상의 속성이 모든 튜플에서 값이 같다 → 결과에 같은 값 속성 쌍이 **중복**(Mgr_ssn과 Ssn) — \"한 쌍 중 하나는 불필요\" → NATURAL JOIN",
        "**NATURAL JOIN (*)**: EQUIJOIN의 **중복 속성을 없앤** 조인 — 조인 속성이 두 릴레이션에서 **같은 이름**이어야, 아니면 **먼저 renaming** / 예: DEPT_LOCS ← DEPARTMENT * DEPT_LOCATIONS (Dnumber 공유) / PROJ_DEPT ← PROJECT * ρ(Dname, Dnum, Mgr_ssn, Mgr_start_date)(DEPARTMENT) — 조인 속성 값은 **하나만** 남는다",
        "결과 크기: **0 ≤ |Q| ≤ |R|·|S|** — (최소) 만족하는 조합이 없으면 빈 릴레이션 / (최대) 모두 만족하거나 조건이 없으면 모든 조합 = 카티션 곱으로 **퇴화**",
        "**Join selectivity** = 예상 조인 결과 크기 / (|R| · |S|)",
      ],
    },
    {
      title: "완전 집합 · 질의 평가 트리",
      en: "Complete Set, Query Evaluation Tree",
      lines: [
        "완전 집합: **{σ, π, ∪, ρ, −, ×}** — 다른 모든 원래 관계 대수 연산을 이것들의 순서로 표현 가능 (교안 문장은 'five operations', 기호는 여섯)",
        "**INTERSECTION**: R ∩ S ≡ (R ∪ S) − ((R − S) ∪ (S − R))",
        "**JOIN**: R ⋈<condition> S ≡ σ<condition>(R × S) — JOIN = CARTESIAN PRODUCT followed by SELECT",
        "**NATURAL JOIN** = RENAME 다음 CARTESIAN PRODUCT, 그 다음 SELECT와 PROJECT",
        "엄밀히는 ∩와 JOIN이 필요 없지만, DB 응용에서 **매우 자주 써서** 별도 연산으로 둔다",
        "**질의 평가(실행) 트리**: RDBMS 안에서 질의를 내부 표현하는 트리 — 관계 대수식에 대응 / **잎 노드 = 입력 릴레이션**, **내부 노드 = 관계 대수 연산**",
        "실행: 피연산자(자식)가 준비되면 내부 노드 연산을 실행하고 그 결과로 노드를 대체 → 루트까지 반복",
        "예: Stafford 프로젝트의 번호, 통제 부서 번호, 관리자의 성·주소·생일 → (1) σP.Plocation='Stafford'(P) (2) ⋈P.Dnum=D.Dnumber (D) (3) ⋈D.Mgr_ssn=E.Ssn (E) → πP.Pnumber, P.Dnum, E.Lname, E.Address, E.Bdate — (1)의 결과가 있어야 (2), 그 다음 (3) / 질의의 좋은 시각적 표현 → 11주 질의 처리·최적화",
      ],
    },
    {
      title: "요약 표",
      en: "Summary: Relational Algebra",
      lines: [],
      table: {
        title: "연산",
        headers: ["연산", "목적", "표기"],
        rows: [
          ["SELECT", "선택 조건을 만족하는 모든 튜플", "σ<condition>(R)"],
          ["PROJECT", "R의 일부 속성만, 중복 제거", "π<attribute list>(R)"],
          ["THETA JOIN", "조인 조건을 만족하는 R1·R2 튜플의 모든 조합", "R1 ⋈<join condition> R2"],
          ["EQUIJOIN", "등호 비교만 쓰는 조인", "R1 ⋈<cond> R2 또는 R1 ⋈(<attrs 1>),(<attrs 2>) R2"],
          ["NATURAL JOIN", "EQUIJOIN에서 R2의 조인 속성을 결과에서 뺌, 같은 이름이면 명시 불필요", "R1 * R2"],
          ["UNION", "R1이나 R2나 둘 다의 튜플, union compatible", "R1 ∪ R2"],
          ["INTERSECTION", "둘 다에 있는 튜플, union compatible", "R1 ∩ R2"],
          ["DIFFERENCE", "R1에는 있고 R2에는 없는 튜플", "R1 − R2"],
          ["CARTESIAN PRODUCT", "R1·R2의 모든 속성, 모든 튜플 조합", "R1 × R2"],
        ],
      },
    },
    {
      title: "Exercise 1~5 — 관계 대수 (정답)",
      lines: [
        "Ex1 Research 부서 직원의 이름과 주소: RESEARCH_DEPT ← σDname='Research'(DEPARTMENT) / RESEARCH_EMPS ← (RESEARCH_DEPT ⋈Dnumber=Dno EMPLOYEE) / RESULT ← πFname, Lname, Address(RESEARCH_EMPS)",
        "Ex2 Stafford 프로젝트마다 번호, 통제 부서 번호, 관리자의 성·주소·생일: STAFFORD_PROJS ← σPlocation='Stafford'(PROJECT) / CONTR_DEPTS ← (STAFFORD_PROJS ⋈Dnum=Dnumber DEPARTMENT) / PROJ_DEPT_MGRS ← (CONTR_DEPTS ⋈Mgr_ssn=Ssn EMPLOYEE) / RESULT ← πPnumber, Dnum, Lname, Address, Bdate(PROJ_DEPT_MGRS)",
        "Ex3 Smith가 일꾼이나 통제 부서 관리자인 프로젝트 번호 — 일꾼으로: SMITHS(Essn) ← πSsn(σLname='Smith'(EMPLOYEE)), SMITH_WORKER_PROJS ← πPno(WORKS_ON * SMITHS) / 관리자로: MGRS ← πLname, Dnumber(EMPLOYEE ⋈Ssn=Mgr_ssn DEPARTMENT), SMITH_MANAGED_DEPTS(Dnum) ← πDnumber(σLname='Smith'(MGRS)), SMITH_MGR_PROJS(Pno) ← πPnumber(SMITH_MANAGED_DEPTS * PROJECT) / RESULT ← SMITH_WORKER_PROJS ∪ SMITH_MGR_PROJS",
        "Ex4 부양가족이 없는 직원: ALL_EMPS ← πSsn(EMPLOYEE) / EMPS_WITH_DEPS(Ssn) ← πEssn(DEPENDENT) / EMPS_WITHOUT_DEPS ← (ALL_EMPS − EMPS_WITH_DEPS) / RESULT ← πLname, Fname(EMPS_WITHOUT_DEPS * EMPLOYEE)",
        "Ex5 부양가족이 한 명 이상인 관리자: MGRS(Ssn) ← πMgr_ssn(DEPARTMENT) / EMPS_WITH_DEPS(Ssn) ← πEssn(DEPENDENT) / MGRS_WITH_DEPS ← (MGRS ∩ EMPS_WITH_DEPS) / RESULT ← πLname, Fname(MGRS_WITH_DEPS * EMPLOYEE)",
      ],
    },
    {
      title: "추가 연산이 필요한 이유",
      en: "Additional Relational Operations",
      lines: [
        "기본 연산만으로는 흔한 DB 요청 일부를 못 한다",
        "· 값의 모음에 대한 **집계 함수** (SUM, AVERAGE, MAXIMUM, COUNT로 요약)",
        "· 속성 값으로 튜플을 **그룹화**하고 그룹마다 집계",
        "· 두 릴레이션의 **외부 조인**",
      ],
    },
    {
      title: "집계 함수와 그룹화 ℑ",
      en: "Aggregate Functions and Grouping",
      lines: [
        "표기 **<grouping attributes> ℑ <function list> (R)** — ℑ(script F) = 집계 함수 연산자, 그룹 속성 = 그룹화에 쓸 R의 속성 목록, 함수 목록 = (<function> <attribute>) 쌍 목록 (SUM, AVERAGE, MAXIMUM, MINIMUM, COUNT)",
        "출력: **그룹 속성 + 함수 목록 원소마다 속성 하나**인 릴레이션",
        "예: ρR(Dno, No_of_employees, Average_sal)(Dno ℑ COUNT Ssn, AVERAGE Salary (EMPLOYEE)) → (5, 4, 33250), (4, 3, 31000), (1, 1, 55000) — Q. 이름을 안 바꾸면? Q. 그룹 속성이 없으면?",
        "· 이름을 안 바꾸면: 속성 이름이 **<function>_<attribute>** (Dno, Count_ssn, Average_salary)",
        "· 그룹 속성이 없으면: 함수를 **모든 튜플**에 적용 → 결과는 **한 튜플**뿐 — ℑ COUNT Ssn, AVERAGE Salary (EMPLOYEE) → (8, 35125)",
        "토론: 집계할 때 **중복은 제거하지 않는다**(부서별 월급 합·평균) / **NULL은 고려하지 않는다**",
        "관계 대수는 **닫힌 수학 체계** — 집계 결과도 스칼라가 아니라 **릴레이션**(값이나 튜플이 하나뿐이어도)",
      ],
    },
    {
      title: "OUTER JOIN",
      en: "OUTER JOIN Operations",
      lines: [
        "EQUIJOIN·NATURAL JOIN은 조건을 만족하는 튜플만 — 짝 없는 튜플은 제거(**inner join**)",
        "**OUTER JOIN**: 한쪽(또는 양쪽) 릴레이션의 모든 튜플을, 짝이 있든 없든 결과에 남기고 싶을 때",
        "예: 모든 직원 이름과, 부서를 관리하면 그 부서 이름 — TEMP ← (EMPLOYEE ⟕Ssn=Mgr_ssn DEPARTMENT), RESULT ← πFname, Minit, Lname, Dname(TEMP) → Wong–Research, Wallace–Administration, Borg–Headquarters, 나머지는 **NULL로 채움** — 첫(왼쪽) 릴레이션의 모든 튜플 포함",
        "종류: **LEFT OUTER JOIN ⟕ / RIGHT OUTER JOIN ⟖ / FULL OUTER JOIN ⟗**",
      ],
    },
    {
      title: "DIVISION ÷",
      en: "DIVISION Operation",
      lines: [
        "DB 응용에서 가끔 나오는 특별한 질의에 유용 — ÷로 표기, **기본 관계 대수 연산으로도 표현 가능**",
        "예: 'John Smith'가 일하는 **모든** 프로젝트에서 일하는 직원 이름",
        "· SMITH ← σFname='John' AND Lname='Smith'(EMPLOYEE) / SMITH_PNOS ← πPno(WORKS_ON ⋈Essn=Ssn SMITH) → {1, 2}",
        "· SSN_PNOS ← πEssn, Pno(WORKS_ON) — <Pno, Essn> 릴레이션",
        "· SSNS(Ssn) ← SSN_PNOS ÷ SMITH_PNOS → {123456789, 453453453} — (Essn * Pno) / Pno = Essn",
        "· RESULT ← πFname, Lname(SSNS * EMPLOYEE) → John Smith, Joyce English",
        "형식: R(Z) ÷ S(X), **X ⊆ Z** (S의 속성은 R의 속성의 부분집합) → 결과 T(Y), **Y = Z − X** (X ∪ Y = Z) — tR[Y]가 결과에 들어가려면 S의 **모든** 튜플 tS에 대해 tR[X] = tS인 튜플이 R에 있어야",
        "예: R(A,B) = {(a1,b1),(a2,b1),(a3,b1),(a4,b1),(a1,b2),(a3,b2),(a2,b3),(a3,b3),(a4,b3),(a1,b4),(a2,b4),(a3,b4)}, S(A) = {a1,a2,a3} → T(B) = **{b1, b4}** — \"분모 S의 튜플이 분자 R을 제한: 분모의 모든 값과 짝이 맞는 것만 결과에\"",
      ],
    },
    {
      title: "Exercise 6·7 — 추가 연산 (정답)",
      lines: [
        "Ex6 부양가족이 **2명 이상**인 직원: T1(Ssn, No_of_dependents) ← Essn ℑ COUNT Dependent_name (DEPENDENT) / T2 ← σNo_of_dependents>2(T1) / RESULT ← πLname, Fname(T2 * EMPLOYEE) — 교안은 '>2'로 적었지만 'two or more'면 **≥ 2**가 맞다",
        "Ex7 5번 부서가 통제하는 **모든** 프로젝트에서 일하는 직원: DEPT5_PROJS ← ρ(Pno)(πPnumber(σDnum=5(PROJECT))) / EMP_PROJ ← ρ(Ssn, Pno)(πEssn, Pno(WORKS_ON)) / RESULT_EMP_SSNS ← EMP_PROJ ÷ DEPT5_PROJS / RESULT ← πLname, Fname(RESULT_EMP_SSNS * EMPLOYEE)",
      ],
    },
  ],
};
