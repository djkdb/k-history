import type { Question } from "@/lib/types";

/* sql · sqladv · view · ra */
export const QUESTIONS_3: Question[] = [
  // sql-intro
  { kind: "mc", id: "q-si3-1", concept: "sql-intro", q: "SQL의 원래 이름은?", options: ["QUEL", "SEQUEL", "DATALOG", "QBE"], answer: 1, explain: "Structured English Query Language — IBM의 첫 DBMS를 위해." },
  { kind: "mc", id: "q-si3-2", concept: "sql-intro", q: "다음 중 DDL 명령이 아닌 것은?", options: ["CREATE TABLE", "ALTER TABLE", "DROP TABLE", "UPDATE"], answer: 3, explain: "UPDATE는 튜플을 바꾸는 DML." },
  { kind: "ox", id: "q-si3-3", concept: "sql-intro", q: "SQL은 결과를 얻는 절차를 적는 절차적(procedural) 언어다.", answer: false, explain: "SQL은 선언적(declarative). 절차적인 것은 관계 대수." },
  { kind: "mc", id: "q-si3-4", concept: "sql-intro", q: "Text-to-SQL의 어려움으로 강의에서 든 것이 아닌 것은?", options: ["자연어의 모호성", "스키마 이해와 연결", "처음 보는 DB로의 일반화", "SQL 문법이 없음"], answer: 3, explain: "NL ambiguity, schema linking, complex query generation, generalization." },

  // create-table
  { kind: "mc", id: "q-ct-1", concept: "create-table", q: "PK 속성에 암묵적으로 붙는 제약은?", options: ["UNIQUE만", "NOT NULL", "DEFAULT 0", "CHECK"], answer: 1, explain: "개체 무결성 때문에 NOT NULL이 늘 암묵적으로 붙는다." },
  { kind: "mc", id: "q-ct-2", concept: "create-table", q: "PK가 아닌 다른 후보키(alternate key)를 지정하는 절은?", options: ["PRIMARY KEY", "UNIQUE", "FOREIGN KEY", "DEFAULT"], answer: 1, explain: "UNIQUE clause." },
  { kind: "short", id: "q-ct-3", concept: "create-table", q: "값을 주지 않았을 때 들어갈 값을 정하는 절의 키워드는? (영어 한 단어)", answers: ["default"], explain: "DEFAULT <value>." },
  { kind: "ox", id: "q-ct-4", concept: "create-table", q: "CREATE SCHEMA는 스키마 이름과 그 스키마를 소유한 사용자를 나타내는 authorization identifier를 지정한다.", answer: true, explain: "CREATE SCHEMA COMPANY AUTHORIZATION 'Jsmith';" },

  // ref-triggered-actions
  { kind: "mc", id: "q-rt3-1", concept: "ref-triggered-actions", q: "참조되는 튜플을 지우려 할 때 아무 동작도 지정하지 않으면 SQL의 기본 동작은?", options: ["CASCADE", "SET NULL", "연산 거부(reject)", "SET DEFAULT"], answer: 2, explain: "The default action of SQL is to reject the operation." },
  { kind: "mc", id: "q-rt3-2", concept: "ref-triggered-actions", q: "EMPLOYEE.Super_ssn에 ON DELETE SET NULL을 붙였다. 상사 튜플을 지우면?", options: ["부하 튜플도 지워진다", "부하들의 Super_ssn이 NULL이 된다", "삭제가 거부된다", "부하들의 Super_ssn이 기본값이 된다"], answer: 1, explain: "참조하던 FK를 NULL로." },
  { kind: "mc", id: "q-rt3-3", concept: "ref-triggered-actions", q: "상사의 Ssn이 바뀔 때 부하들의 Super_ssn도 함께 바뀌게 하려면?", options: ["ON UPDATE CASCADE", "ON UPDATE SET NULL", "ON DELETE CASCADE", "UNIQUE"], answer: 0, explain: "변경이 참조하는 튜플로 번진다." },
  { kind: "mc", id: "q-rt3-4", concept: "ref-triggered-actions", q: "LIBRARY 연습에서 BOOK.Publisher_name → PUBLISHER.Name의 ON DELETE로 제시된 답은?", options: ["CASCADE", "SET NULL", "REJECT", "SET DEFAULT"], answer: 2, explain: "그 출판사의 책이 있으면 출판사를 지우지 못하게 한다." },
  { kind: "mc", id: "q-rt3-5", concept: "ref-triggered-actions", q: "LIBRARY 연습에서 BOOK_AUTHORS.Book_id → BOOK.Book_id의 ON DELETE는?", options: ["CASCADE", "SET NULL", "REJECT", "SET DEFAULT"], answer: 0, explain: "책이 지워지면 그 저자 정보도 더 필요 없다." },
  { kind: "mc", id: "q-rt3-6", concept: "ref-triggered-actions", q: "LIBRARY 연습에서 BOOK_LOANS.Card_no → BORROWER.Card_no의 ON DELETE는?", options: ["CASCADE", "SET NULL", "REJECT", "SET DEFAULT"], answer: 2, explain: "빌린 책을 다 반납하기 전에는 회원이 탈퇴할 수 없다." },
  { kind: "ox", id: "q-rt3-7", concept: "ref-triggered-actions", q: "참조 트리거 동작의 트리거에는 ON INSERT도 있다.", answer: false, explain: "트리거는 ON DELETE와 ON UPDATE 두 가지다. 참조되는 쪽에 INSERT 해서 깨질 일은 없다." },

  // insert-delete-update
  { kind: "mc", id: "q-idu-1", concept: "insert-delete-update", q: "DELETE FROM EMPLOYEE; (WHERE 없음)를 실행하면?", options: ["문법 오류", "튜플 하나만 지운다", "모든 튜플이 지워진다", "테이블 자체가 없어진다"], answer: 2, explain: "Missing WHERE deletes all tuples! (테이블 정의는 남는다 — DROP과 다름)" },
  { kind: "ox", id: "q-idu-2", concept: "insert-delete-update", q: "DELETE 문 하나로 여러 테이블에서 동시에 명시적으로 튜플을 지울 수 있다.", answer: false, explain: "명시적으로는 한 번에 한 테이블. 다른 테이블로 번지는 것은 CASCADE 같은 트리거 동작 때문." },
  { kind: "mc", id: "q-idu-3", concept: "insert-delete-update", q: "속성 이름을 적는 INSERT에서 반드시 값을 줘야 하는 속성은?", options: ["모든 속성", "NOT NULL이면서 DEFAULT가 없는 속성", "FK 속성만", "숫자 속성만"], answer: 1, explain: "나머지는 NULL이나 기본값이 들어간다." },
  { kind: "short", id: "q-idu-4", concept: "insert-delete-update", q: "UPDATE 문에서 바꿀 속성과 새 값을 적는 절의 키워드는? (영어 한 단어)", answers: ["set"], explain: "UPDATE … SET attr = value WHERE …" },

  // select-basic
  { kind: "mc", id: "q-sb-1", concept: "select-basic", q: "SELECT-FROM-WHERE에서 WHERE 절에 오는 것은?", options: ["projection attributes", "selection condition과 join condition", "테이블 목록", "정렬 기준"], answer: 1, explain: "SELECT = 가져올 속성, FROM = 테이블, WHERE = 선택·조인 조건." },
  { kind: "mc", id: "q-sb-2", concept: "select-basic", q: "FROM EMPLOYEE, DEPARTMENT 에서 WHERE를 빼면 결과는?", options: ["EMPLOYEE만", "자연 조인", "두 테이블의 카티션 곱", "오류"], answer: 2, explain: "조건이 없으면 모든 튜플 조합 — cross product." },
  { kind: "ox", id: "q-sb-3", concept: "select-basic", q: "두 테이블에 같은 이름의 속성(예: Dno)이 있으면 테이블 이름으로 한정해서 모호함을 없애야 한다.", answer: true, explain: "EMPLOYEE.Dno 처럼 qualify." },
  { kind: "mc", id: "q-sb-4", concept: "select-basic", q: "같은 테이블 EMPLOYEE를 사원과 상사로 두 번 쓰려면 꼭 필요한 것은?", options: ["DISTINCT", "Alias (tuple variable)", "GROUP BY", "UNION"], answer: 1, explain: "FROM EMPLOYEE AS E, EMPLOYEE AS S." },
  { kind: "short", id: "q-sb-5", concept: "select-basic", q: "SELECT 절에서 모든 속성을 가져오라는 기호는?", answers: ["*", "asterisk", "별표"], explain: "SELECT * — 이름을 다 적지 않아도 된다.", hint: "기호 하나" },

  // multiset
  { kind: "mc", id: "q-ms-1", concept: "multiset", q: "SQL이 테이블을 집합이 아닌 다중집합으로 다루는 이유가 아닌 것은?", options: ["중복 제거는 비싸다", "사용자가 중복을 보고 싶을 수 있다", "집계에 중복이 필요할 수 있다", "관계 모델이 중복을 요구한다"], answer: 3, explain: "관계 모델은 오히려 튜플이 서로 달라야 한다(집합)." },
  { kind: "mc", id: "q-ms-2", concept: "multiset", q: "SELECT 결과에서 중복을 없애는 키워드는?", options: ["ALL", "DISTINCT", "UNIQUE", "EXCEPT"], answer: 1, explain: "SELECT DISTINCT." },
  { kind: "ox", id: "q-ms-3", concept: "multiset", q: "UNION의 결과에서는 중복 튜플이 제거된다.", answer: true, explain: "집합 연산의 결과는 집합. 중복을 남기려면 UNION ALL." },
  { kind: "mc", id: "q-ms-4", concept: "multiset", q: "SQL의 집합 차집합 연산 키워드는?", options: ["MINUS ALL", "EXCEPT", "DIFFERENCE", "NOT IN"], answer: 1, explain: "UNION, EXCEPT, INTERSECT." },
  { kind: "ox", id: "q-ms-5", concept: "multiset", q: "UNION·EXCEPT·INTERSECT는 속성 수가 다른 릴레이션끼리도 쓸 수 있다.", answer: false, explain: "type-compatible(속성 수·대응 도메인이 같은) 릴레이션에만 쓸 수 있다." },

  // order-arith-between
  { kind: "mc", id: "q-ob-1", concept: "order-arith-between", q: "ORDER BY의 기본 정렬 순서는?", options: ["내림차순", "오름차순", "삽입 순서", "무작위"], answer: 1, explain: "기본은 ASC. 내림차순은 DESC." },
  { kind: "ox", id: "q-ob-2", concept: "order-arith-between", q: "Salary BETWEEN 30000 AND 40000 은 30000과 40000을 포함하지 않는다.", answer: false, explain: "BETWEEN은 양 끝을 포함한다 (>= AND <=)." },

  // nested-query
  { kind: "mc", id: "q-nq-1", concept: "nested-query", q: "v IN V 와 같은 뜻인 것은?", options: ["v = ALL V", "v = ANY V", "v > ALL V", "EXISTS V"], answer: 1, explain: "= ANY (= SOME)는 IN과 같다." },
  { kind: "mc", id: "q-nq-2", concept: "nested-query", q: "\"5번 부서 사원 모두보다 월급이 많은 사원\"에 쓸 비교는?", options: ["Salary > ANY (…)", "Salary > ALL (…)", "Salary IN (…)", "EXISTS (…)"], answer: 1, explain: "모든 값보다 커야 하므로 > ALL." },
  { kind: "ox", id: "q-nq-3", concept: "nested-query", q: "중첩 질의에서는 모호함을 피하려고 참조하는 모든 테이블에 alias를 붙이는 것이 좋다.", answer: true, explain: "강의의 권고." },
  { kind: "mc", id: "q-nq-4", concept: "nested-query", q: "Nested query는 바깥 질의의 어느 절 안에 들어간다고 강의에서 정의했는가?", options: ["SELECT", "FROM", "WHERE", "ORDER BY"], answer: 2, explain: "Complete SELECT-FROM-WHERE blocks within a WHERE clause of another query." },

  // exists
  { kind: "mc", id: "q-ex-1", concept: "exists", q: "NOT EXISTS (중첩 질의)가 TRUE인 때는?", options: ["결과에 튜플이 하나 이상 있을 때", "결과에 튜플이 하나도 없을 때", "결과가 NULL을 포함할 때", "결과가 정렬되어 있을 때"], answer: 1, explain: "No tuples in the result of the nested query." },
  { kind: "mc", id: "q-ex-2", concept: "exists", q: "\"5번 부서가 관리하는 모든 프로젝트에서 일하는 사원\"을 SQL로 쓸 때 핵심 구조는?", options: ["IN과 UNION", "NOT EXISTS와 EXCEPT", "GROUP BY와 HAVING만", "LEFT OUTER JOIN"], answer: 1, explain: "(5번 부서 프로젝트) EXCEPT (그 사원의 프로젝트)가 비어 있으면 = 다 포함." },
  { kind: "ox", id: "q-ex-3", concept: "exists", q: "\"부양가족이 한 명 이상 있는 관리자\"는 EXISTS 두 개로 쓸 수 있다.", answer: true, explain: "DEPENDENT에 있는지, DEPARTMENT의 Mgr_ssn인지 각각 EXISTS." },

  // joined-tables
  { kind: "mc", id: "q-jt-1", concept: "joined-tables", q: "SQL에서 조인 종류를 지정하지 않으면 기본 조인은?", options: ["Left outer join", "Inner join", "Full outer join", "Cross join"], answer: 1, explain: "기본은 inner join — 짝이 있는 튜플만." },
  { kind: "mc", id: "q-jt-2", concept: "joined-tables", q: "상사가 없는 사원까지 모두 나오게 사원–상사 이름을 뽑으려면 (사원 E가 왼쪽)?", options: ["E JOIN S", "E LEFT OUTER JOIN S", "E RIGHT OUTER JOIN S", "E NATURAL JOIN S"], answer: 1, explain: "왼쪽(E)의 모든 튜플을 남기고 상사 이름은 NULL." },
  { kind: "ox", id: "q-jt-3", concept: "joined-tables", q: "외부 조인에서 짝이 없는 튜플의 다른 쪽 속성은 NULL로 채워진다.", answer: true, explain: "padded with NULL values." },

  // aggregate
  { kind: "mc", id: "q-ag-1", concept: "aggregate", q: "Salary에 NULL이 2개 있는 10행 테이블에서 COUNT(Salary)는?", options: ["10", "8", "2", "NULL"], answer: 1, explain: "COUNT(속성)은 NULL을 빼고 센다. COUNT(*)는 10." },
  { kind: "mc", id: "q-ag-2", concept: "aggregate", q: "SQL의 기본 집계 함수가 아닌 것은?", options: ["COUNT", "AVG", "MEDIAN", "MAX"], answer: 2, explain: "COUNT, SUM, MAX, MIN, AVG." },
  { kind: "ox", id: "q-ag-3", concept: "aggregate", q: "집계 함수는 보통 SELECT나 HAVING 절에 쓰며, 중첩 질의 안에 넣어 WHERE에서 비교할 수도 있다.", answer: true, explain: "예: (SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn) >= 2." },
  { kind: "short", id: "q-ag-4", concept: "aggregate", q: "부서별 사원 수를 구하는 SQL의 빈칸: SELECT Dno, ____(*) FROM EMPLOYEE GROUP BY Dno;", answers: ["count"], explain: "COUNT(*)." },

  // group-having
  { kind: "mc", id: "q-gh-1", concept: "group-having", q: "\"사원이 5명보다 많은 부서\"처럼 그룹에 대한 조건을 거는 절은?", options: ["WHERE", "HAVING", "ORDER BY", "FROM"], answer: 1, explain: "그룹(요약 정보) 조건은 HAVING." },
  { kind: "ox", id: "q-gh-2", concept: "group-having", q: "WHERE는 그룹을 만든 뒤에, HAVING은 그룹을 만들기 전에 적용된다.", answer: false, explain: "반대다. WHERE가 먼저 튜플을 거르고, 그룹을 만든 뒤 HAVING이 그룹을 거른다." },
  { kind: "mc", id: "q-gh-3", concept: "group-having", q: "연습 5 \"평균 월급이 30,000을 넘는 부서의 이름과 사원 수\"에서 AVG(Salary) > 30000은 어디에?", options: ["WHERE", "HAVING", "SELECT", "GROUP BY"], answer: 1, explain: "부서(그룹)의 평균에 대한 조건." },
  { kind: "short", id: "q-gh-4", concept: "group-having", q: "같은 값을 가진 튜플끼리 묶는 기준 속성을 무엇이라 하는가? (영어 두 단어)", answers: ["grouping attribute", "grouping attributes", "그룹 속성"], explain: "Grouping attributes — GROUP BY 절에 적는다." },

  // assertion
  { kind: "mc", id: "q-as-1", concept: "assertion", q: "CREATE ASSERTION으로 표현하기 알맞은 것은?", options: ["Ssn은 기본키다", "Dno는 DEPARTMENT를 참조한다", "사원 월급은 그 부서 관리자 월급보다 많을 수 없다", "Salary는 DECIMAL이다"], answer: 2, explain: "기본 제약(키·개체·참조)에 들지 않는 일반 제약." },
  { kind: "ox", id: "q-as-2", concept: "assertion", q: "어서션의 CHECK 조건은 모든 DB 상태에서 참이어야 하며, 흔히 NOT EXISTS 꼴로 쓴다.", answer: true, explain: "위반하는 튜플이 '존재하지 않음'을 확인하는 식." },

  // trigger
  { kind: "mc", id: "q-tr-1", concept: "trigger", q: "트리거를 설명하는 규칙 이름은?", options: ["ACID", "ECA (Event-Condition-Action)", "CRUD", "BASE"], answer: 1, explain: "A trigger is regarded as an ECA rule." },
  { kind: "mc", id: "q-tr-2", concept: "trigger", q: "트리거의 Condition은 어느 절에 적는가?", options: ["IF", "WHEN", "WHERE", "CHECK"], answer: 1, explain: "WHEN 절. 없으면 사건이 나면 바로 동작." },
  { kind: "ox", id: "q-tr-3", concept: "trigger", q: "트리거의 Condition은 필수다.", answer: false, explain: "선택 사항이다 (optional condition)." },
  { kind: "short", id: "q-tr-4", concept: "trigger", q: "트리거가 실행될 시점을 사건 '전'으로 지정하는 키워드는? (영어 한 단어)", answers: ["before"], explain: "BEFORE / AFTER." },
  { kind: "mc", id: "q-tr-5", concept: "trigger", q: "트리거의 Action이 될 수 없는 것으로 강의에서 언급되지 않은 것은?", options: ["SQL 문장들", "DB 트랜잭션", "외부 프로그램", "ER 다이어그램"], answer: 3, explain: "Action은 SQL 문장들, 트랜잭션, 또는 외부 프로그램." },

  // view-concept
  { kind: "mc", id: "q-vc-1", concept: "view-concept", q: "View를 바르게 설명한 것은?", options: ["반드시 물리적으로 저장되는 테이블", "base table에서 유도한 가상 테이블", "인덱스의 한 종류", "스키마의 다른 이름"], answer: 1, explain: "A virtual table derived from base tables." },
  { kind: "ox", id: "q-vc-2", concept: "view-concept", q: "DROP VIEW를 하면 그 뷰를 정의한 base table도 지워진다.", answer: false, explain: "뷰만 없어진다." },
  { kind: "ox", id: "q-vc-3", concept: "view-concept", q: "base table이 바뀌면 뷰를 다시 만드는 것은 사용자의 책임이다.", answer: false, explain: "뷰를 최신으로 유지하는 책임은 DBMS에 있다." },
  { kind: "mc", id: "q-vc-4", concept: "view-concept", q: "뷰를 쓰는 주된 동기로 강의에서 든 것은?", options: ["저장 공간 절약", "복잡한 질의를 단순하게", "트랜잭션 속도", "정규화"], answer: 1, explain: "자주 쓰는 복잡한 질의(조인·집계)를 간단히." },

  // view-implementation
  { kind: "mc", id: "q-vi-1", concept: "view-implementation", q: "뷰에 대한 질의를 base table 질의로 바꿔 실행하고 뷰를 물리적으로 두지 않는 방법은?", options: ["View materialization", "Query modification", "Lazy update", "Indexing"], answer: 1, explain: "Query modification." },
  { kind: "mc", id: "q-vi-2", concept: "view-implementation", q: "뷰에 질의가 올 때에야 갱신하는 방식은?", options: ["Immediate update", "Lazy update", "Periodic update", "Cascade update"], answer: 1, explain: "질의 전까지는 최신이 아니다." },
  { kind: "mc", id: "q-vi-3", concept: "view-implementation", q: "Immediate update의 단점은?", options: ["늘 최신이 아니다", "때로 불필요하고 비효율적이다", "뷰를 만들 수 없다", "질의가 틀린다"], answer: 1, explain: "base table이 바뀔 때마다 즉시 갱신하므로." },
  { kind: "ox", id: "q-vi-4", concept: "view-implementation", q: "View materialization은 뷰를 처음 질의할 때 실제 테이블로 만들어 두고, 이후 질의가 자주 올 것이라 가정한다.", answer: true, explain: "base 변경은 incremental update로 반영." },

  // view-update
  { kind: "mc", id: "q-vu-1", concept: "view-update", q: "단일 테이블 뷰가 갱신 가능하려면 뷰 속성에 반드시 있어야 하는 것은?", options: ["모든 속성", "PK와 DEFAULT 없는 NOT NULL 속성 전부", "FK만", "집계 함수"], answer: 1, explain: "그래야 base relation 갱신이 하나로 정해진다." },
  { kind: "ox", id: "q-vu-2", concept: "view-update", q: "GROUP BY와 집계 함수로 정의한 뷰는 갱신할 수 없다.", answer: true, explain: "갱신이 의미가 없다 (예: 평균을 고친다?)." },
  { kind: "mc", id: "q-vu-3", concept: "view-update", q: "조인으로 정의한 뷰가 대개 갱신 불가능한 이유는?", options: ["조인이 느려서", "뷰 갱신이 여러 가지 base 갱신으로 해석될 수 있어서", "PK가 없어서", "뷰는 항상 읽기 전용이라서"], answer: 1, explain: "Multiple interpretations — 하나로 정해지지 않는다." },
  { kind: "ox", id: "q-vu-4", concept: "view-update", q: "조인으로 정의한 뷰에는 SELECT 질의도 할 수 없다.", answer: false, explain: "검색은 어떤 뷰에든 제한 없이 할 수 있다. 제한은 갱신에만 있다." },

  // view-authorization
  { kind: "mc", id: "q-va-1", concept: "view-authorization", q: "일반 사원에게 이름·성·주소만 보이게 하려면?", options: ["행을 제한하는 뷰", "열을 제한하는 뷰", "트리거", "어서션"], answer: 1, explain: "BASIC_EMP_DATA — 특정 속성만 보여 준다." },
  { kind: "ox", id: "q-va-2", concept: "view-authorization", q: "뷰로 권한을 줄 때는 사용자에게 뷰에 대한 질의 권한만 주고 base table 권한은 주지 않는다.", answer: true, explain: "DEPT5EMP 예." },

  // ra-intro
  { kind: "mc", id: "q-ri1-1", concept: "ra-intro", q: "관계 대수의 성격은?", options: ["선언적", "절차적(procedural)", "객체지향", "논리 프로그래밍"], answer: 1, explain: "'데이터를 어떻게 얻을지' — 연산의 순서를 적는다." },
  { kind: "ox", id: "q-ri1-2", concept: "ra-intro", q: "관계 대수는 질의 처리와 최적화의 바탕이 된다.", answer: true, explain: "A basis for implementing and optimizing queries." },

  // ra-select
  { kind: "mc", id: "q-rs-1", concept: "ra-select", q: "σ Dno=4 (EMPLOYEE)의 결과의 차수는?", options: ["1", "EMPLOYEE와 같다", "튜플 수와 같다", "4"], answer: 1, explain: "SELECT는 행만 고르므로 속성은 R과 같다." },
  { kind: "mc", id: "q-rs-2", concept: "ra-select", q: "σ와 대응하는 SQL 절은?", options: ["SELECT", "FROM", "WHERE", "GROUP BY"], answer: 2, explain: "σ의 선택 조건 = WHERE 절. SQL의 SELECT 절은 π에 가깝다." },
  { kind: "ox", id: "q-rs-3", concept: "ra-select", q: "σ c1 (σ c2 (R)) = σ c2 (σ c1 (R)) — SELECT는 교환 법칙이 성립한다.", answer: true, explain: "이어진 σ는 순서를 바꾸거나 AND 하나로 합칠 수 있다." },
  { kind: "mc", id: "q-rs-4", concept: "ra-select", q: "Color처럼 순서 없는 값에 쓸 수 있는 비교 연산은?", options: ["<, >", "=, ≠", "BETWEEN", "모두"], answer: 1, explain: "unordered values → {=, ≠}." },
  { kind: "short", id: "q-rs-5", concept: "ra-select", q: "관계 대수의 SELECT 연산을 나타내는 그리스 문자 이름은? (영어)", answers: ["sigma", "σ", "시그마"], explain: "σ (sigma)." },

  // ra-project
  { kind: "mc", id: "q-rp-1", concept: "ra-project", q: "π Sex, Salary (EMPLOYEE)의 결과에서 같은 (Sex, Salary) 조합이 여러 번 나오면?", options: ["모두 남는다", "하나만 남는다", "오류", "NULL로 바뀐다"], answer: 1, explain: "PROJECT의 결과는 집합 — 중복 제거." },
  { kind: "mc", id: "q-rp-2", concept: "ra-project", q: "π <속성들>(R)과 같은 결과를 내는 SQL은?", options: ["SELECT <속성들> FROM R", "SELECT DISTINCT <속성들> FROM R", "SELECT * FROM R", "SELECT <속성들> FROM R GROUP BY <속성들> HAVING COUNT(*) > 1"], answer: 1, explain: "SQL은 기본적으로 중복을 남기므로 DISTINCT가 필요하다." },
  { kind: "ox", id: "q-rp-3", concept: "ra-project", q: "PROJECT 연산은 테이블을 수평으로 나눈다(행을 고른다).", answer: false, explain: "행을 고르는 것은 SELECT(σ). PROJECT(π)는 열을 고르는 수직 분할." },
  { kind: "short", id: "q-rp-4", concept: "ra-project", q: "관계 대수의 PROJECT 연산을 나타내는 그리스 문자 이름은? (영어)", answers: ["pi", "π", "파이"], explain: "π (pi)." },

  // ra-rename-sequence
  { kind: "mc", id: "q-rr-1", concept: "ra-rename-sequence", q: "릴레이션이나 속성의 이름을 바꾸는 연산은?", options: ["σ", "π", "ρ", "ℑ"], answer: 2, explain: "ρ (rho) — RENAME." },
  { kind: "ox", id: "q-rr-2", concept: "ra-rename-sequence", q: "관계 대수 식은 중간 결과에 이름을 붙여(←) 한 단계씩 쓸 수 있다.", answer: true, explain: "DEP5_EMPS ← σ Dno=5 (EMPLOYEE)." },

  // ra-set-ops
  { kind: "mc", id: "q-so-1", concept: "ra-set-ops", q: "교환 법칙이 성립하지 않는 연산은?", options: ["∪", "∩", "−", "×(속성 순서 무시)"], answer: 2, explain: "R − S ≠ S − R." },
  { kind: "mc", id: "q-so-2", concept: "ra-set-ops", q: "Type(union) compatibility의 조건은?", options: ["튜플 수가 같다", "속성 수가 같고 대응 속성의 도메인이 같다", "키가 같다", "이름이 같다"], answer: 1, explain: "R(A1..An), S(B1..Bn), dom(Ai) = dom(Bi)." },
  { kind: "mc", id: "q-so-3", concept: "ra-set-ops", q: "R ∩ S를 −만으로 쓰면?", options: ["R − S", "S − R", "R − (R − S)", "(R − S) − S"], answer: 2, explain: "R에서 S에 없는 것을 빼면 둘 다에 있는 것만 남는다." },

  // ra-cartesian
  { kind: "mc", id: "q-cp-1", concept: "ra-cartesian", q: "R(속성 3개, 튜플 4개) × S(속성 2개, 튜플 5개)의 속성 수와 튜플 수는?", options: ["5개, 9개", "5개, 20개", "6개, 20개", "3개, 20개"], answer: 1, explain: "속성 n+m = 5, 튜플 |R|·|S| = 20." },
  { kind: "ox", id: "q-cp-2", concept: "ra-cartesian", q: "카티션 곱은 type compatible한 릴레이션에만 쓸 수 있다.", answer: false, explain: "type compatible하지 않아도 된다." },
  { kind: "short", id: "q-cp-3", concept: "ra-cartesian", q: "튜플 10개인 R과 튜플 7개인 S의 카티션 곱의 튜플 수는?", answers: ["70"], explain: "|R| × |S| = 70.", hint: "숫자만" },

  // ra-join
  { kind: "mc", id: "q-rj-1", concept: "ra-join", q: "비교 연산이 '='뿐인 조인은?", options: ["Theta join", "Equijoin", "Outer join", "Division"], answer: 1, explain: "EQUIJOIN — 결과에 같은 값을 가진 속성 쌍이 남는다." },
  { kind: "mc", id: "q-rj-2", concept: "ra-join", q: "Natural join이 equijoin과 다른 점은?", options: ["비교 연산을 아무거나 쓴다", "중복된 조인 속성 하나를 없앤다", "짝 없는 튜플도 남긴다", "카티션 곱과 같다"], answer: 1, explain: "같은 이름의 조인 속성을 하나만 남긴다." },
  { kind: "mc", id: "q-rj-3", concept: "ra-join", q: "R ⋈c S 는 다음과 같다.", options: ["π c (R × S)", "σ c (R × S)", "R − S", "R ∪ S"], answer: 1, explain: "카티션 곱 뒤의 선택." },
  { kind: "mc", id: "q-rj-4", concept: "ra-join", q: "조인 결과 크기의 최댓값은?", options: ["|R| + |S|", "max(|R|, |S|)", "|R| × |S|", "|R|"], answer: 2, explain: "모든 조합이 조건을 만족하면 카티션 곱과 같다." },
  { kind: "ox", id: "q-rj-5", concept: "ra-join", q: "Natural join을 하려면 조인 속성의 이름이 같아야 하고, 다르면 먼저 RENAME한다.", answer: true, explain: "otherwise, a renaming is needed." },

  // ra-complete-set
  { kind: "mc", id: "q-cs-1", concept: "ra-complete-set", q: "관계 대수의 완전 집합(complete set)은?", options: ["{σ, π, ⋈, ∩, ÷}", "{σ, π, ∪, −, ×}", "{σ, π, ρ, ∩}", "{∪, ∩, −}"], answer: 1, explain: "다른 연산은 모두 이 다섯으로 나타낼 수 있다." },
  { kind: "mc", id: "q-cs-2", concept: "ra-complete-set", q: "질의 트리에서 리프 노드는?", options: ["관계 대수 연산", "입력 릴레이션", "최종 결과", "조건식"], answer: 1, explain: "Leaf: input relations, Internal: operations." },
  { kind: "ox", id: "q-cs-3", concept: "ra-complete-set", q: "질의 트리는 자식 피연산자가 준비된 내부 노드부터 실행해 결과로 바꾸고, 루트까지 반복한다.", answer: true, explain: "Execution of the query tree." },

  // ra-aggregate
  { kind: "mc", id: "q-ra2-1", concept: "ra-aggregate", q: "관계 대수의 집계 함수 연산 기호는?", options: ["σ", "ℑ (script F)", "÷", "ρ"], answer: 1, explain: "<그룹 속성> ℑ <함수 목록> (R)." },
  { kind: "ox", id: "q-ra2-2", concept: "ra-aggregate", q: "관계 대수에서 집계 함수를 적용할 때 중복 튜플은 제거하지 않는다.", answer: true, explain: "합계·평균을 바르게 내려면 중복을 남겨야 한다." },
  { kind: "ox", id: "q-ra2-3", concept: "ra-aggregate", q: "결과가 값 하나여도 관계 대수 집계의 결과는 스칼라 숫자다.", answer: false, explain: "결과도 릴레이션 — 닫힌 수학 체계." },
  { kind: "ox", id: "q-ra2-4", concept: "ra-aggregate", q: "관계 대수의 집계에서 NULL 값은 0으로 바꿔 계산한다.", answer: false, explain: "NULL은 집계에서 고려되지 않는다(빠진다)." },

  // ra-outer-join
  { kind: "mc", id: "q-oj-1", concept: "ra-outer-join", q: "양쪽 릴레이션의 튜플을 모두 남기는 조인은?", options: ["Left outer join", "Right outer join", "Full outer join", "Natural join"], answer: 2, explain: "FULL OUTER JOIN ⟗." },
  { kind: "ox", id: "q-oj-2", concept: "ra-outer-join", q: "Equijoin과 natural join은 짝이 없는 튜플을 결과에서 버린다(inner join).", answer: true, explain: "그래서 outer join이 필요하다." },

  // ra-division
  { kind: "mc", id: "q-dv-1", concept: "ra-division", q: "R(Z) ÷ S(X)의 결과 T(Y)에서 Y는?", options: ["Z ∪ X", "Z − X", "X − Z", "Z ∩ X"], answer: 1, explain: "X ⊆ Z, Y = Z − X." },
  { kind: "mc", id: "q-dv-2", concept: "ra-division", q: "나눗셈이 어울리는 질의는?", options: ["\"한 프로젝트라도 일하는 사원\"", "\"John Smith가 일하는 모든 프로젝트에서 일하는 사원\"", "\"부서별 평균 월급\"", "\"상사가 없는 사원\""], answer: 1, explain: "'모든 ~' 꼴." },
  { kind: "mc", id: "q-dv-3", concept: "ra-division", q: "R(Essn, Pno) = {(a,1),(a,2),(b,1),(c,1),(c,2)}, S(Pno) = {1,2}일 때 R ÷ S는?", options: ["{a}", "{a, c}", "{a, b, c}", "{b}"], answer: 1, explain: "1과 2를 모두 가진 Essn은 a와 c." },
  { kind: "ox", id: "q-dv-4", concept: "ra-division", q: "나눗셈은 기본 연산들로는 표현할 수 없는 독립 연산이다.", answer: false, explain: "π, ×, − 로 표현할 수 있다: T1 ← πY(R), T2 ← πY((S × T1) − R), T ← T1 − T2." },
];
