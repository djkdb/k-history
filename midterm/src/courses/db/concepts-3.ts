import type { Concept } from "@/lib/types";

/* Lecture 4~6 — SQL · 뷰 · 관계 대수 */
export const CONCEPTS_3: Concept[] = [
  // ── sql ────────────────────────────────────────────
  {
    id: "sql-intro",
    chapter: "sql",
    title: "SQL과 DDL · DML",
    en: "Structured Query Language",
    importance: "high",
    summary:
      "SQL은 **선언적(declarative)** 특수 목적 언어다. IBM의 첫 DBMS를 위해 설계됐고 처음 이름은 **SEQUEL**(Structured English Query Language)이었다. 테이블을 다루는 **DDL**과 튜플을 다루는 **DML**로 나뉜다.",
    points: [
      "**DDL**: CREATE SCHEMA·TABLE, ALTER, DROP — 'DB와 테이블'",
      "**DML**: 검색 SELECT, 수정 INSERT·DELETE·UPDATE — '튜플'",
      "Text-to-SQL: 자연어를 SQL로 — 어려움: 자연어 모호성, 스키마 이해·연결, 복잡한 질의, 처음 보는 DB로 일반화",
      "LLM 기반 Text-to-SQL도 완벽하지 않다 → SQL을 제대로 아는 것이 중요",
    ],
    trap: "SQL은 '어떻게'가 아니라 '무엇을' 원하는지 적는다(선언적). 관계 대수는 절차적(procedural)이다.",
  },
  {
    id: "create-table",
    chapter: "sql",
    title: "CREATE TABLE과 제약 지정",
    en: "CREATE TABLE, NOT NULL, DEFAULT, PRIMARY KEY, UNIQUE, FOREIGN KEY",
    importance: "must",
    summary:
      "**CREATE TABLE**은 이름·속성(<이름, 타입> 쌍)·초기 제약으로 새 릴레이션을 만든다. 스키마 이름을 붙일 수 있다(COMPANY.EMPLOYEE). **CREATE SCHEMA**는 스키마 이름과 소유자(authorization identifier)를 정한다.",
    points: [
      "**NOT NULL** — PK 속성에는 늘 암묵적으로 붙는다(개체 무결성)",
      "**DEFAULT <값>** — 값을 주지 않으면 이 값이 들어간다",
      "**PRIMARY KEY** — 기본키를 이루는 속성(들)",
      "**UNIQUE** — 다른 후보키(alternate key)",
      "**FOREIGN KEY … REFERENCES …** — 참조 무결성",
    ],
    code: `CREATE TABLE EMPLOYEE (
  Fname     VARCHAR(15)   NOT NULL,
  Ssn       CHAR(9)       NOT NULL,
  Salary    DECIMAL(10,2),
  Super_ssn CHAR(9),
  Dno       INT           NOT NULL DEFAULT 1,
  PRIMARY KEY (Ssn),
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn),
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber)
);`,
  },
  {
    id: "ref-triggered-actions",
    chapter: "sql",
    title: "참조 트리거 동작",
    en: "Referential Triggered Actions",
    importance: "must",
    summary:
      "참조되는 PK가 지워지거나 바뀌면 참조 무결성이 깨진다. SQL의 **기본 동작은 그 연산을 거부(reject)**하는 것이다. 다르게 하려면 FK에 **트리거(ON DELETE / ON UPDATE)**와 **동작(SET NULL / CASCADE / SET DEFAULT)**을 붙인다.",
    points: [
      "**SET NULL**: 참조하던 FK를 NULL로",
      "**CASCADE**: 지우면 참조하던 튜플도 지움 / 바꾸면 FK도 새 값으로",
      "**SET DEFAULT**: FK를 기본값으로",
      "예: Super_ssn에 ON DELETE SET NULL → 상사가 지워지면 부하들의 Super_ssn이 NULL",
      "예: ON UPDATE CASCADE → 상사의 Ssn이 바뀌면 부하들의 Super_ssn도 바뀜",
    ],
    code: `CONSTRAINT EMPSUPERFK
  FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)
  ON DELETE SET NULL
  ON UPDATE CASCADE`,
    example:
      "LIBRARY 연습: BOOK_AUTHORS.Book_id → BOOK — ON DELETE CASCADE(책이 없어지면 저자 정보도 필요 없음). BOOK.Publisher_name → PUBLISHER — ON DELETE REJECT(그 출판사 책이 있으면 출판사를 못 지움). BOOK_LOANS.Card_no → BORROWER — ON DELETE REJECT(다 반납해야 탈퇴). 거의 모든 FK는 ON UPDATE CASCADE.",
  },
  {
    id: "insert-delete-update",
    chapter: "sql",
    title: "INSERT · DELETE · UPDATE",
    en: "Update Commands in SQL",
    importance: "must",
    summary:
      "INSERT는 튜플 하나를 넣고, DELETE는 WHERE로 고른 튜플들을, UPDATE는 WHERE로 고른 튜플들의 속성 값을 SET으로 바꾼다. DELETE·UPDATE는 **한 번에 한 테이블**만 대상으로 한다.",
    points: [
      "INSERT 방법1: 모든 속성 값을 **정의된 순서대로**",
      "INSERT 방법2: 속성 이름을 적고 그 값만 — NOT NULL이면서 DEFAULT가 없는 속성은 반드시 포함",
      "DELETE: **WHERE가 없으면 모든 튜플이 지워진다!**",
      "DELETE·UPDATE의 효과는 참조 트리거 동작(CASCADE 등)이 있으면 다른 릴레이션으로 번질 수 있다",
    ],
    code: `INSERT INTO EMPLOYEE (Fname, Lname, Dno, Ssn)
VALUES ('Richard', 'Marini', 4, '653298653');

DELETE FROM EMPLOYEE WHERE Dno = 5;

UPDATE PROJECT
SET    Plocation = 'Bellaire', Dnum = 5
WHERE  Pnumber = 10;`,
  },
  {
    id: "select-basic",
    chapter: "sql",
    title: "SELECT-FROM-WHERE",
    en: "Basic Retrieval Query",
    importance: "must",
    summary:
      "SELECT에는 가져올 속성(**projection attributes**), FROM에는 필요한 테이블, WHERE에는 고를 튜플의 조건(**selection condition**과 **join condition**)을 적는다.",
    points: [
      "같은 이름의 속성이 여러 테이블에 있으면 **테이블 이름으로 한정**(EMPLOYEE.Dno)",
      "**Alias(tuple variable)**: FROM EMPLOYEE AS E — 긴 이름 반복을 줄이고, 같은 테이블을 두 번 쓸 때 필수",
      "**WHERE가 없으면** 조건 없이 FROM의 모든 튜플 (테이블이 둘 이상이면 카티션 곱!)",
      "**SELECT ***: 모든 속성",
    ],
    code: `-- 'Research' 부서에서 일하는 모든 사원의 이름과 주소
SELECT Fname, Lname, Address
FROM   EMPLOYEE, DEPARTMENT
WHERE  Dname = 'Research' AND Dnumber = Dno;`,
  },
  {
    id: "multiset",
    chapter: "sql",
    title: "다중집합으로서의 테이블",
    en: "Tables as Multisets — DISTINCT, ALL, set operations",
    importance: "must",
    summary:
      "SQL은 테이블을 집합이 아니라 **multiset**으로 다룬다 — 중복 튜플이 있을 수 있고, 질의 결과에서 중복을 **자동으로 없애지 않는다**.",
    points: [
      "이유: 중복 제거는 비싸다(정렬 필요) · 사용자가 중복을 보고 싶을 수 있다 · 집계 함수에는 중복이 필요할 수 있다",
      "**DISTINCT**: 중복 제거 / **ALL**(기본): 중복 유지",
      "집합 연산 **UNION · EXCEPT · INTERSECT**: 결과는 집합 → 중복 제거. **type-compatible** 릴레이션에만",
      "다중집합 연산: UNION ALL · EXCEPT ALL · INTERSECT ALL — 중복 유지",
    ],
    trap: "SELECT는 기본이 ALL(중복 유지)이지만, UNION은 기본이 중복 제거다. 둘이 반대다.",
  },
  {
    id: "order-arith-between",
    chapter: "sql",
    title: "ORDER BY · 산술 연산 · BETWEEN",
    en: "ORDER BY, Arithmetic Operators, BETWEEN",
    importance: "high",
    summary:
      "**ORDER BY**는 하나 이상의 속성 값으로 결과를 정렬한다 — 기본은 **오름차순(ASC)**, 내림차순은 **DESC**. 숫자 속성에는 + - * / 를 쓸 수 있고, **BETWEEN**은 값의 범위를 준다(양 끝 포함).",
    points: [],
    code: `SELECT   Fname, Lname, 1.1 * Salary AS Increased_sal
FROM     EMPLOYEE
WHERE    Salary BETWEEN 30000 AND 40000
ORDER BY Dno DESC, Lname ASC;`,
  },

  // ── sqladv ─────────────────────────────────────────
  {
    id: "nested-query",
    chapter: "sqladv",
    title: "중첩 질의 · IN · ANY/ALL",
    en: "Nested Query, IN, ANY / SOME, ALL",
    importance: "must",
    summary:
      "**Nested query**는 다른 질의의 WHERE 절 안에 들어간 완전한 SELECT-FROM-WHERE 블록이다. DB에 있는 값을 가져와 바깥 조건의 비교에 쓴다. 결과는 튜플의 (다중)집합이다.",
    points: [
      "**IN**: 값 v가 집합 V의 원소면 TRUE",
      "**= ANY (= SOME)**: V의 어떤 값과 같으면 TRUE — IN과 같다",
      "**> ALL**: V의 모든 값보다 크면 TRUE (비교 연산자 >, >=, <, <=, <> 와 결합)",
      "바깥과 안쪽에 같은 속성 이름이 있으면 모호 → **모든 테이블에 alias**를 붙이는 게 좋다",
    ],
    code: `-- 5번 부서 모든 사원보다 월급이 많은 사원
SELECT Lname, Fname
FROM   EMPLOYEE
WHERE  Salary > ALL (SELECT Salary FROM EMPLOYEE WHERE Dno = 5);`,
  },
  {
    id: "exists",
    chapter: "sqladv",
    title: "EXISTS · NOT EXISTS",
    en: "Boolean Functions EXISTS / NOT EXISTS",
    importance: "must",
    summary:
      "**EXISTS**는 중첩 질의 결과에 튜플이 **하나라도 있으면** TRUE, **NOT EXISTS**는 **하나도 없으면** TRUE다. 보통 WHERE 절에서 상관 중첩 질의와 함께 쓴다.",
    points: [
      "'부양가족이 적어도 한 명 있는 관리자' → EXISTS 두 개",
      "'5번 부서가 관리하는 **모든** 프로젝트에서 일하는 사원' → NOT EXISTS (… EXCEPT …) — 관계 대수의 나눗셈",
    ],
    code: `-- 부양가족이 한 명 이상 있는 관리자의 이름
SELECT Fname, Lname
FROM   EMPLOYEE E
WHERE  EXISTS (SELECT * FROM DEPENDENT D   WHERE E.Ssn = D.Essn)
  AND  EXISTS (SELECT * FROM DEPARTMENT M  WHERE E.Ssn = M.Mgr_ssn);

-- 5번 부서가 관리하는 모든 프로젝트에서 일하는 사원
SELECT Fname, Lname
FROM   EMPLOYEE
WHERE  NOT EXISTS (
         (SELECT Pnumber FROM PROJECT WHERE Dnum = 5)
         EXCEPT
         (SELECT Pno FROM WORKS_ON WHERE Ssn = Essn) );`,
  },
  {
    id: "joined-tables",
    chapter: "sqladv",
    title: "조인 테이블 — 내부 조인과 외부 조인",
    en: "Joined Tables: Inner Join, Outer Join",
    importance: "must",
    summary:
      "**Joined table**은 FROM 절에서 조인 연산으로 만든 테이블이다. 선택 조건과 조인 조건을 WHERE에 섞어 쓰는 것보다 읽기 쉽다. 기본은 **inner join** — 다른 쪽에 짝이 있는 튜플만 남는다. **outer join**은 짝이 없는 튜플도 남기고 빈 속성을 **NULL로 채운다**.",
    points: [
      "LEFT OUTER JOIN: 왼쪽 테이블의 모든 튜플을 남긴다",
      "RIGHT OUTER JOIN: 오른쪽 테이블의 모든 튜플을 남긴다",
      "FULL OUTER JOIN: 양쪽 모두",
    ],
    code: `-- 사원과 그 상사 이름. 상사가 없는 사원도 나오게
SELECT E.Lname AS Employee_name, S.Lname AS Supervisor_name
FROM   (EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S
        ON E.Super_ssn = S.Ssn);`,
  },
  {
    id: "aggregate",
    chapter: "sqladv",
    title: "집계 함수",
    en: "Aggregate Functions: COUNT, SUM, MAX, MIN, AVG",
    importance: "must",
    summary:
      "**Aggregate function**은 여러 튜플의 정보를 한 튜플로 요약한다. 보통 SELECT나 HAVING 절에 쓴다. **COUNT**는 튜플이나 값의 수를, **SUM·MAX·MIN·AVG**는 숫자 값들의 합·최대·최소·평균을 돌려준다.",
    points: [
      "COUNT(*): 튜플 수 / COUNT(속성): 그 속성의 NULL 아닌 값의 수 / COUNT(DISTINCT 속성)",
      "집계 결과를 중첩 질의에 담아 바깥 WHERE에서 비교할 수 있다",
      "NULL은 집계에서 빠진다",
    ],
    code: `SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary)
FROM   EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber
WHERE  Dname = 'Research';

-- 부양가족이 두 명 이상인 사원
SELECT Lname, Fname
FROM   EMPLOYEE
WHERE  (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2;`,
  },
  {
    id: "group-having",
    chapter: "sqladv",
    title: "GROUP BY와 HAVING",
    en: "Grouping: GROUP BY, HAVING",
    importance: "must",
    summary:
      "**GROUP BY**는 grouping attribute 값이 같은 튜플끼리 겹치지 않는 그룹으로 나누고, 집계 함수를 그룹마다 따로 적용한다. **HAVING**은 그 **그룹(요약 정보)에 대한 조건**이다.",
    points: [
      "WHERE: 그룹을 만들기 **전에** 튜플을 거른다",
      "HAVING: 그룹을 만든 **뒤에** 그룹을 거른다 — GROUP BY와 함께",
      "SELECT에 나오는 집계 아닌 속성은 GROUP BY에 있어야 한다",
    ],
    code: `-- 평균 월급이 30,000을 넘는 부서의 이름과 사원 수 (연습 5)
SELECT   Dname, COUNT(*)
FROM     DEPARTMENT, EMPLOYEE
WHERE    Dnumber = Dno
GROUP BY Dname
HAVING   AVG(Salary) > 30000;`,
    trap: "\"월급 40,000 넘는 사원만 세라\" 같은 튜플 조건은 WHERE, \"사원이 5명 넘는 부서만\" 같은 그룹 조건은 HAVING.",
  },
  {
    id: "assertion",
    chapter: "sqladv",
    title: "어서션",
    en: "Assertions (CREATE ASSERTION)",
    importance: "high",
    summary:
      "**Assertion**은 키·개체 무결성·참조 무결성 같은 기본 제약에 들지 않는 **일반 제약**을 지정한다. CHECK 뒤 괄호 안의 조건이 **모든 DB 상태에서 참**이어야 한다. 보통 **NOT EXISTS** 꼴로 쓴다.",
    points: ["예: 사원의 월급은 그 부서 관리자의 월급보다 많을 수 없다"],
    code: `CREATE ASSERTION SALARY_CONSTRAINT
CHECK ( NOT EXISTS (
  SELECT *
  FROM   EMPLOYEE E, EMPLOYEE M, DEPARTMENT D
  WHERE  E.Salary > M.Salary AND E.Dno = D.Dnumber
    AND  D.Mgr_ssn = M.Ssn ) );`,
  },
  {
    id: "trigger",
    chapter: "sqladv",
    title: "트리거 (ECA 규칙)",
    en: "Triggers — Event, Condition, Action",
    importance: "must",
    summary:
      "**Trigger**는 어떤 사건과 조건이 생기면 자동으로 취할 동작을 지정한다. **ECA(Event-Condition-Action) 규칙**으로 본다.",
    points: [
      "**Event**: DB에 적용된 갱신 연산 (새 사원 삽입, 월급 변경, 상사 변경…). **BEFORE / AFTER**로 실행 시점 지정. 모든 경우를 덮으려면 트리거가 여럿 필요할 수 있다",
      "**Condition**: WHEN 절. 선택 사항 — 참일 때만 동작 실행, 없으면 사건이 나면 바로 실행",
      "**Action**: SQL 문장들, 데이터베이스 트랜잭션, 또는 외부 프로그램 (예: 외부 저장 프로시저 호출)",
    ],
    code: `CREATE TRIGGER SALARY_VIOLATION
BEFORE INSERT OR UPDATE OF Salary, Supervisor_ssn ON EMPLOYEE
FOR EACH ROW
WHEN ( NEW.Salary > ( SELECT Salary FROM EMPLOYEE
                      WHERE Ssn = NEW.Supervisor_ssn ) )
  INFORM_SUPERVISOR(NEW.Supervisor_ssn, NEW.Ssn);`,
    trap: "어서션은 '늘 지켜야 할 조건'(위반하면 거부), 트리거는 '이런 일이 생기면 할 일'(자동 동작)이다.",
  },

  // ── view ───────────────────────────────────────────
  {
    id: "view-concept",
    chapter: "view",
    title: "뷰의 개념과 CREATE VIEW",
    en: "Concept of a View",
    importance: "must",
    summary:
      "**View**는 base table에서 유도한 **가상 테이블**로, 물리적으로 꼭 존재하지는 않는다. 자주 쓰는 복잡한 질의(조인·집계)를 **단순하게** 만들려고 쓴다. 뷰에 대한 검색은 제한이 없지만 갱신은 대개 제한된다.",
    points: [
      "**CREATE VIEW <이름> AS <SELECT 질의>** — 속성 이름을 안 주면 정의 테이블의 이름을 따른다",
      "뷰에도 base table처럼 질의한다",
      "뷰는 늘 최신이어야 한다 — base table이 바뀌면 반영하는 책임은 **DBMS**에 있다",
      "**DROP VIEW**: 뷰만 없앤다. 정의 테이블에는 영향 없음",
    ],
    code: `CREATE VIEW WORKS_ON1 AS
SELECT Fname, Lname, Pname, Hours
FROM   EMPLOYEE, PROJECT, WORKS_ON
WHERE  Ssn = Essn AND Pno = Pnumber;`,
  },
  {
    id: "view-implementation",
    chapter: "view",
    title: "뷰의 구현 — 질의 수정 vs 실체화",
    en: "Query Modification vs View Materialization",
    importance: "must",
    summary:
      "**Query modification**은 뷰에 대한 질의를 base table에 대한 질의로 바꾼다 — 뷰를 물리적으로 두지 않는다. **View materialization**은 뷰가 처음 질의될 때 실제 테이블을 만들어 '한동안' 두고, 이후 질의가 자주 올 것이라 가정한다. base table이 바뀌면 **incremental update**로 반영한다.",
    points: [
      "**Immediate update**: base table이 바뀌는 즉시 뷰 갱신 — 늘 최신, 때로 불필요·비효율",
      "**Lazy update**: 뷰에 질의가 올 때 갱신 — 질의 전까지는 최신 아님",
      "**Periodic update**: 주기적으로 갱신 — 질의 결과가 최신이 아닐 수 있음",
    ],
    trap: "Query modification의 약점: 복잡한 뷰를 자주 질의하면 매번 다시 계산해야 해서 비효율적이다.",
  },
  {
    id: "view-update",
    chapter: "view",
    title: "갱신할 수 있는 뷰",
    en: "Update Operations on Views",
    importance: "must",
    summary:
      "뷰 갱신은 **base relation에 대한 갱신이 딱 하나로 정해질 때만** 가능하다. 단일 테이블 뷰는 조건을 갖추면 갱신 가능, 조인 뷰는 대개 불가, 그룹·집계 뷰는 불가.",
    points: [
      "Case 1 단일 테이블: 뷰 속성에 ① base relation의 **PK**와 ② **DEFAULT가 없는 NOT NULL 속성 전부**가 있으면 갱신 가능",
      "Case 2 여러 테이블 조인: 일반적으로 갱신 불가 — 같은 뷰 갱신이 여러 가지 base 갱신으로 해석될 수 있다 (WORKS_ON1)",
      "Case 3 그룹·집계: 갱신 불가 — 의미가 없다 (예: 부서 평균 월급을 고친다?)",
    ],
  },
  {
    id: "view-authorization",
    chapter: "view",
    title: "권한 부여 수단으로서의 뷰",
    en: "Views as Authorization",
    importance: "high",
    summary:
      "뷰로 권한 없는 사용자에게 **특정 행(튜플)이나 열(속성)을 숨길** 수 있다. 뷰에 대한 질의 권한만 주고 base table 권한은 주지 않는다.",
    points: [
      "행 제한: DEPT5EMP — 5번 부서 관리자는 5번 부서 사원만 본다",
      "열 제한: BASIC_EMP_DATA — 일반 사원은 이름·성·주소만 본다",
    ],
    code: `CREATE VIEW DEPT5EMP AS
SELECT * FROM EMPLOYEE WHERE Dno = 5;

CREATE VIEW BASIC_EMP_DATA AS
SELECT Fname, Lname, Address FROM EMPLOYEE;`,
  },

  // ── ra ─────────────────────────────────────────────
  {
    id: "ra-intro",
    chapter: "ra",
    title: "관계 대수란",
    en: "Relational Algebra",
    importance: "high",
    summary:
      "관계 대수는 '데이터를 **어떻게** 얻을지'에 대한 이론적·수학적 모델이다(**절차적, procedural**). 관계 모델 연산의 형식적 기반이며, 집합 개념에 엄격히 기댄다. DBMS 내부 모듈과 **질의 처리·최적화**(11주차)의 바탕이 된다.",
    points: ["연산의 결과도 릴레이션 → 연산을 이어 붙일 수 있다 (closed)"],
  },
  {
    id: "ra-select",
    chapter: "ra",
    title: "SELECT 연산 σ",
    en: "SELECT σ",
    importance: "must",
    summary:
      "**σ<조건>(R)**은 한 릴레이션에서 선택 조건을 만족하는 **튜플(행)의 부분집합**을 고른다 — 수평 분할. 결과의 속성은 R과 같다(**차수 그대로**).",
    points: [
      "조건: <속성> <비교연산 {=,<,≤,>,≥,≠}> <상수 또는 속성>, AND·OR·NOT으로 연결",
      "순서 있는 값(숫자·날짜)엔 모든 비교, 순서 없는 값(색 등)엔 =, ≠ 만",
      "**Unary**: 한 릴레이션에, 튜플마다 따로 적용",
      "**교환 법칙** 성립: σc1(σc2(R)) = σc2(σc1(R)) — 이어진 σ는 AND로 합칠 수 있다",
      "결과 튜플 수 ≤ |R|",
      "SQL의 **WHERE** 절에 해당",
    ],
    trap: "관계 대수의 SELECT(σ)는 행을 고른다. SQL의 SELECT 절(열 고르기)은 오히려 π에 해당한다.",
  },
  {
    id: "ra-project",
    chapter: "ra",
    title: "PROJECT 연산 π",
    en: "PROJECT π",
    importance: "must",
    summary:
      "**π<속성 목록>(R)**은 지정한 **열(속성)**만 남기고 나머지를 버린다 — 수직 분할. 결과의 차수는 속성 목록의 수다. 결과는 집합이라 **중복 튜플을 없앤다**.",
    points: [
      "속성 목록에 키가 없으면 중복이 생기기 쉽다 → π가 제거",
      "SQL의 **SELECT DISTINCT <속성>**에 해당 (그냥 SELECT는 중복 유지)",
      "π<list1>(π<list2>(R)) = π<list1>(R) (list1 ⊆ list2일 때)",
    ],
  },
  {
    id: "ra-rename-sequence",
    chapter: "ra",
    title: "연산 잇기와 RENAME ρ",
    en: "Sequences of Operations & RENAME ρ",
    importance: "high",
    summary:
      "여러 연산을 한 식에 중첩해 쓰거나, 중간 결과에 이름을 붙여 한 단계씩 쓸 수 있다. **ρ(rho)**는 릴레이션 이름이나 속성 이름, 또는 둘 다를 바꾸는 단항 연산이다.",
    points: [
      "ρS(B₁,…,Bₙ)(R): 릴레이션 이름과 속성 이름을 모두",
      "ρS(R): 릴레이션 이름만",
      "ρ(B₁,…,Bₙ)(R): 속성 이름만",
      "SQL 질의 하나는 보통 복잡한 관계 대수 식 하나에 해당한다",
    ],
    code: `DEP5_EMPS ← σ Dno=5 (EMPLOYEE)
RESULT    ← π Fname, Lname, Salary (DEP5_EMPS)`,
  },
  {
    id: "ra-set-ops",
    chapter: "ra",
    title: "집합 연산 ∪ · ∩ · −",
    en: "UNION, INTERSECTION, SET DIFFERENCE",
    importance: "must",
    summary:
      "두 릴레이션이 **type(union) compatible**해야 쓸 수 있다 — 속성 수가 같고, 대응하는 속성끼리 도메인이 같다. 결과에서 중복은 제거된다.",
    points: [
      "R ∪ S: R이나 S나 둘 다에 있는 튜플",
      "R ∩ S: 둘 다에 있는 튜플",
      "R − S: R에는 있고 S에는 없는 튜플",
      "∪와 ∩는 **교환·결합 법칙** 성립",
      "−는 **교환 법칙이 성립하지 않는다**: R − S ≠ S − R",
      "R ∩ S = R − (R − S)",
    ],
  },
  {
    id: "ra-cartesian",
    chapter: "ra",
    title: "카티션 곱 ×",
    en: "CARTESIAN PRODUCT (CROSS PRODUCT, CROSS JOIN)",
    importance: "must",
    summary:
      "**R × S**는 두 릴레이션 튜플의 **가능한 모든 조합**을 이어 붙인다. type compatible하지 않아도 된다. R(A₁…Aₙ) × S(B₁…Bₘ) = Q(A₁…Aₙ, B₁…Bₘ).",
    points: [
      "속성 수: **n + m**",
      "튜플 수: **|R| × |S|**",
      "혼자서는 대개 의미 없다 → 뒤에 σ로 짝이 맞는 것만 고르면 **JOIN**이 된다",
    ],
    example: "R이 튜플 3개·속성 4개, S가 튜플 5개·속성 2개면 R × S는 튜플 15개, 속성 6개.",
  },
  {
    id: "ra-join",
    chapter: "ra",
    title: "JOIN ⋈ · 동등 조인 · 자연 조인",
    en: "JOIN, EQUIJOIN, NATURAL JOIN",
    importance: "must",
    summary:
      "**R ⋈<조건> S**는 관련된 튜플을 하나의 긴 튜플로 합친다. 카티션 곱 뒤에 σ를 한 것과 같지만, 조건을 만족하는 조합만 남긴다. 조건은 Aᵢ θ Bⱼ 꼴을 AND로 잇는다(**theta join**, θ ∈ {=,<,≤,>,≥,≠}).",
    points: [
      "**EQUIJOIN**: 비교 연산이 '=' 뿐 → 결과에 같은 값을 가진 속성 쌍이 중복해 남는다",
      "**NATURAL JOIN** (* 표기): 동등 조인에서 **중복된 조인 속성을 하나 없앤다**. 조인 속성의 이름이 같아야 하며, 다르면 먼저 ρ로 바꾼다",
      "결과 크기: 최소 0(아무 조합도 조건을 만족 안 함) ~ 최대 |R|×|S|(카티션 곱으로 퇴화)",
      "**Join selectivity**: 결과 튜플 수 / (|R|×|S|)",
    ],
  },
  {
    id: "ra-complete-set",
    chapter: "ra",
    title: "완전 집합과 질의 트리",
    en: "Complete Set of Operations & Query Evaluation Tree",
    importance: "must",
    summary:
      "**{σ, π, ∪, −, ×}** 다섯 연산이 완전 집합이다 — 다른 관계 대수 연산은 모두 이 다섯의 조합으로 나타낼 수 있다. **Query (evaluation) tree**는 관계 대수 식을 RDBMS 안에서 나타내는 트리다.",
    points: [
      "R ∩ S = (R ∪ S) − ((R − S) ∪ (S − R)) 또는 R − (R − S)",
      "R ⋈c S = σc(R × S)",
      "질의 트리 — **리프 노드: 입력 릴레이션**, **내부 노드: 관계 대수 연산**",
      "실행: 자식 피연산자가 준비되면 내부 노드를 실행해 결과로 바꾸고, 루트까지 반복",
    ],
  },
  {
    id: "ra-aggregate",
    chapter: "ra",
    title: "집계 함수와 그룹화 ℑ",
    en: "Aggregate Functions and Grouping ℑ",
    importance: "high",
    summary:
      "기본 연산만으로는 집계·그룹화·외부 조인을 표현할 수 없다. **<그룹 속성> ℑ <함수 목록> (R)** — 그룹 속성으로 묶고, (함수, 속성) 쌍(SUM·AVERAGE·MAXIMUM·MINIMUM·COUNT)을 적용한다.",
    points: [
      "결과: 그룹 속성 + 함수 목록마다 속성 하나를 가진 **릴레이션**",
      "집계할 때 **중복은 제거하지 않는다** (월급 합계·평균 계산을 위해)",
      "**NULL은 집계에서 빠진다**",
      "값 하나뿐이어도 결과는 숫자가 아니라 **릴레이션** — 관계 대수는 닫힌 체계",
    ],
    code: `ρR(Dno, No_of_employees, Average_sal) ( Dno ℑ COUNT Ssn, AVERAGE Salary (EMPLOYEE) )`,
  },
  {
    id: "ra-outer-join",
    chapter: "ra",
    title: "외부 조인",
    en: "OUTER JOIN (left ⟕, right ⟖, full ⟗)",
    importance: "high",
    summary:
      "동등·자연 조인은 짝이 없는 튜플을 버린다(inner join). **Outer join**은 짝이 있든 없든 한쪽 또는 양쪽 릴레이션의 튜플을 모두 결과에 남기고, 빈 자리는 NULL로 채운다.",
    points: ["LEFT OUTER JOIN ⟕: 왼쪽 모두", "RIGHT OUTER JOIN ⟖: 오른쪽 모두", "FULL OUTER JOIN ⟗: 양쪽 모두"],
  },
  {
    id: "ra-division",
    chapter: "ra",
    title: "나눗셈 ÷",
    en: "DIVISION ÷",
    importance: "must",
    summary:
      "'**모든** ~에 대해' 꼴의 질의에 쓴다. R(Z) ÷ S(X)에서 X ⊆ Z이고, 결과는 T(Y), **Y = Z − X**. T의 튜플 t는 S의 **모든** 튜플 ts에 대해 R 안에 (t, ts) 조합이 있을 때만 들어간다. 기본 연산으로 표현할 수 있다.",
    points: [
      "예: 'John Smith가 일하는 **모든** 프로젝트에서 일하는 사원' — WORKS_ON(Essn, Pno) ÷ SMITH_PNOS(Pno)",
      "T1 ← πY(R) · T2 ← πY((S × T1) − R) · T ← T1 − T2",
      "SQL에서는 NOT EXISTS (… EXCEPT …) 로 쓴다",
    ],
    example:
      "R(Essn, Pno) = {(a,1),(a,2),(b,1),(c,1),(c,2),(c,3)}, S(Pno) = {1,2} → R ÷ S = {a, c}. b는 2번 프로젝트가 없어서 빠진다.",
  },
  {
    id: "sql-practice3-write",
    chapter: "sqladv",
    title: "SQL 실습: 자연어를 SQL로",
    en: "Practice 3 — Writing SQL from Natural Language",
    importance: "high",
    summary:
      "자연어 질의를 **중첩 질의·집계·NOT EXISTS**로 옮기는 연습. '가장 ~한' → **MAX/MIN 서브쿼리**, '상사의 상사' → **서브쿼리 두 단계**, '모두 A' → **A가 아닌 게 없다(NOT EXISTS … <> 'A')**.",
    points: [
      "Q1-1 최고 월급 직원의 부서 사람들 → MAX(Salary) → 그 Dno → 결과 **James Borg**",
      "Q1-2 상사의 상사가 888665555 → 결과 **Smith, Narayan, English, Zelaya, Jabbar** (서브쿼리가 여러 행이면 = 대신 **IN**)",
      "Q1-3 최저 월급보다 10000 이상 → Salary − 10000 >= MIN → **Wong, Wallace, Narayan, Borg**",
      "Q2-1 straight-A = NOT EXISTS (Grade **<>** 'A') / Q2-2 A가 하나도 없음 = NOT EXISTS (Grade **=** 'A') → Smith",
    ],
    code: `-- 모든 과목이 A인 학생
SELECT S.Name, S.Major FROM STUDENT AS S
WHERE NOT EXISTS ( SELECT * FROM GRADE_REPORT AS G
                   WHERE G.Student_number = S.Student_number
                     AND G.Grade <> 'A' );`,
  },
  {
    id: "sql-practice3-errors",
    chapter: "sqladv",
    title: "SQL 실습: 결과 쓰기와 오류 찾기",
    en: "Practice 3 — Inferring Output and Detecting Errors",
    importance: "high",
    summary:
      "SQL을 COMPANY DB에서 손으로 실행해 결과를 쓰고 의도를 추론한다. 대표 오류 둘: **내부 조인 + WHERE 로 0인 그룹이 사라짐**(→ LEFT JOIN, 조건은 ON, COUNT(열)), **불필요한 조인으로 중복 행과 잘못된 AVG**(→ IN 서브쿼리).",
    points: [
      "Ex 3 Administration 부서 프로젝트 → **Computerization, Newbenefits (Stafford)**",
      "Ex 4 NOT EXISTS (내 프로젝트 EXCEPT 내 부서 프로젝트) = 내 부서 프로젝트에만 참여 → Wong·Wallace만 빠짐",
      "Ex 5 부서 평균 < 월급 < 부서 관리자 월급 → **Ramesh Narayan 38000** (5번 부서 평균 33250)",
      "Ex 6-1 Reorganization(0명)이 빠지는 오류 → **LEFT JOIN … ON (… AND Hours >= 20)**, **COUNT(W.Essn)**",
      "Ex 6-2 JOIN WORKS_ON 때문에 Wong 4번·Wallace 2번 중복, 평균도 왜곡 → **E.Ssn IN (SELECT Essn FROM WORKS_ON)**",
    ],
    code: `SELECT P.Pnumber, P.Pname, COUNT(W.Essn)
FROM PROJECT AS P LEFT JOIN WORKS_ON AS W
  ON (P.Pnumber = W.Pno AND W.Hours >= 20)
GROUP BY P.Pnumber, P.Pname
ORDER BY Pnumber ASC;`,
  },
];
