import type { Concept } from "@/lib/types";

/**
 * 3과목 · 데이터베이스 구축.
 *
 * 필기와 실기가 가장 많이 겹치는 과목이다. 정규화와 SQL 은 실기에서
 * 직접 써야 하므로, 읽고 넘기면 실기에서 손이 안 나간다.
 */
export const DATABASE_CONCEPTS: Concept[] = [
  {
    id: "b-schema",
    subject: "database",
    title: "스키마 3층 구조",
    summary: "외부는 사용자의 눈, 개념은 조직 전체, 내부는 저장 방식.",
    body: [
      "외부 스키마는 사용자나 응용 프로그램이 보는 관점이다. 여러 개일 수 있다.",
      "개념 스키마는 조직 전체가 보는 하나의 논리 구조다. 데이터베이스에 하나만 있다.",
      "내부 스키마는 실제로 어떻게 저장되는가다. 인덱스·물리 구조를 다룬다.",
      "논리적 독립성은 개념이 바뀌어도 외부가 안 바뀌는 것, 물리적 독립성은 내부가 바뀌어도 개념이 안 바뀌는 것이다.",
    ],
    examPoint: "세 스키마의 이름과 관점을 바꿔 낸다. 독립성 두 가지도 잦다.",
    importance: "must",
    keys: [
      { term: "외부", mean: "사용자 관점 · 여러 개" },
      { term: "개념", mean: "조직 전체 · 하나" },
      { term: "내부", mean: "저장 방식 · 물리" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-key",
    subject: "database",
    title: "키의 종류",
    summary: "후보키 → 기본키·대체키, 그리고 슈퍼키·외래키.",
    body: [
      "슈퍼키는 유일성은 있으나 최소성은 없을 수 있다. 후보키는 유일성과 최소성을 모두 갖춘다.",
      "기본키는 후보키 중에 고른 것이고, 나머지 후보키가 대체키다.",
      "외래키는 다른 릴레이션의 기본키를 참조하는 속성이다. 참조 무결성을 지켜야 한다.",
      "기본키는 NULL 이 될 수 없다(개체 무결성).",
    ],
    examPoint:
      "'유일성은 만족하지만 최소성은 만족하지 않는 키는?' → 슈퍼키. 이 형태가 단골이다.",
    importance: "must",
    keys: [
      { term: "슈퍼키", mean: "유일성 O · 최소성 X 일 수 있음" },
      { term: "후보키", mean: "유일성 O · 최소성 O" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-integrity",
    subject: "database",
    title: "무결성 제약",
    summary: "개체·참조·도메인. 기본키는 NULL 불가, 외래키는 있는 값만.",
    body: [
      "개체 무결성: 기본키는 NULL 이 될 수 없고 중복될 수 없다.",
      "참조 무결성: 외래키는 참조하는 릴레이션의 기본키에 있는 값이거나 NULL 이어야 한다.",
      "도메인 무결성: 속성의 값은 정해진 도메인에 속해야 한다.",
      "삭제·수정 시 동작: CASCADE(함께), SET NULL, SET DEFAULT, RESTRICT/NO ACTION(막음).",
    ],
    examPoint: "CASCADE 와 RESTRICT 의 동작을 바꿔 낸다.",
    importance: "must",
    tracks: ["written", "practical"],
  },
  {
    id: "b-normalization",
    subject: "database",
    title: "정규화",
    summary: "1NF 원자값 · 2NF 부분 함수 종속 제거 · 3NF 이행 종속 제거 · BCNF 결정자가 후보키.",
    body: [
      "1NF: 모든 속성의 값이 원자값이어야 한다(반복되는 그룹을 없앤다).",
      "2NF: 1NF 이면서 기본키가 아닌 속성이 기본키 전체에 완전 함수 종속이어야 한다(부분 함수 종속 제거).",
      "3NF: 2NF 이면서 이행적 함수 종속이 없어야 한다(A→B, B→C 이면 A→C 인 상태를 없앤다).",
      "BCNF: 모든 결정자가 후보키여야 한다.",
      "4NF 는 다치 종속, 5NF 는 조인 종속을 다룬다.",
      "정규화하면 이상(Anomaly) 현상이 줄지만 조인이 늘어 성능은 떨어질 수 있다. 그래서 일부러 되돌리는 것이 반정규화다.",
    ],
    examPoint:
      "'부분 함수 종속을 제거하면 몇 정규형인가?' → 2NF. 단계와 제거 대상을 짝짓는 문제가 매회 나오고, 실기 단답형으로도 나온다.",
    importance: "must",
    keys: [
      { term: "1NF", mean: "원자값" },
      { term: "2NF", mean: "부분 함수 종속 제거" },
      { term: "3NF", mean: "이행 함수 종속 제거" },
      { term: "BCNF", mean: "결정자가 모두 후보키" },
    ],
    traps: [
      {
        a: "2NF",
        b: "3NF",
        how: "2NF 는 '부분' 종속, 3NF 는 '이행' 종속을 없앤다. 부분은 복합키의 일부에만 붙는 것, 이행은 다리를 건너 붙는 것이다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-anomaly",
    subject: "database",
    title: "이상 현상",
    summary: "삽입·삭제·갱신 이상. 정규화로 없앤다.",
    body: [
      "삽입 이상: 넣고 싶지 않은 값까지 함께 넣어야 하는 것.",
      "삭제 이상: 한 줄을 지웠더니 남겨야 할 정보까지 사라지는 것.",
      "갱신 이상: 같은 값이 여러 줄에 흩어져 있어 일부만 고쳐 데이터가 어긋나는 것.",
    ],
    examPoint: "세 가지 이상의 정의를 바꿔 내는 문제가 잦다.",
    importance: "must",
    tracks: ["written", "practical"],
  },
  {
    id: "b-sql-ddl",
    subject: "database",
    title: "SQL — DDL·DML·DCL",
    summary: "CREATE/ALTER/DROP · SELECT/INSERT/UPDATE/DELETE · GRANT/REVOKE, 그리고 TCL.",
    body: [
      "DDL: CREATE · ALTER · DROP · TRUNCATE — 구조를 만들고 바꾼다.",
      "DML: SELECT · INSERT · UPDATE · DELETE — 데이터를 다룬다.",
      "DCL: GRANT · REVOKE — 권한을 주고 뺏는다.",
      "TCL: COMMIT · ROLLBACK · SAVEPOINT — 트랜잭션을 마무리하거나 되돌린다.",
      "DROP 은 테이블 자체를 없애고, TRUNCATE 는 구조는 두고 모든 행을 지우며, DELETE 는 조건에 맞는 행만 지운다.",
    ],
    examPoint:
      "DROP · TRUNCATE · DELETE 의 차이가 단골이다. TRUNCATE 는 DDL 이라 ROLLBACK 으로 되돌릴 수 없다는 점도 나온다.",
    importance: "must",
    keys: [
      { term: "DDL", mean: "CREATE · ALTER · DROP · TRUNCATE" },
      { term: "DCL", mean: "GRANT · REVOKE" },
      { term: "TCL", mean: "COMMIT · ROLLBACK · SAVEPOINT" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-sql-join",
    subject: "database",
    title: "조인과 서브쿼리",
    summary: "INNER 는 양쪽 다 있는 것, OUTER 는 한쪽이 없어도 남긴다.",
    body: [
      "INNER JOIN 은 조건이 맞는 행만 남긴다. LEFT OUTER JOIN 은 왼쪽을 다 남기고 오른쪽이 없으면 NULL 을 채운다.",
      "CROSS JOIN 은 모든 조합(카티션 곱)을 만든다. SELF JOIN 은 같은 테이블을 자기 자신과 잇는다.",
      "서브쿼리는 단일행(=, >)과 다중행(IN, ANY, ALL, EXISTS)으로 나뉜다. 다중행에 = 를 쓰면 오류가 난다.",
      "GROUP BY 로 묶은 결과를 거를 때는 WHERE 가 아니라 HAVING 을 쓴다.",
    ],
    examPoint:
      "WHERE 와 HAVING 을 바꿔 내는 문제가 매회 나온다. 실기에서는 조건을 주고 SQL 을 직접 쓰게 한다.",
    importance: "must",
    traps: [
      {
        a: "WHERE",
        b: "HAVING",
        how: "WHERE 는 묶기 전 행을 거르고, HAVING 은 묶은 뒤 그룹을 거른다. 집계 함수는 HAVING 에만 쓸 수 있다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-transaction",
    subject: "database",
    title: "트랜잭션과 ACID",
    summary: "원자성·일관성·고립성·지속성.",
    body: [
      "원자성(Atomicity): 전부 되든가 전부 안 되든가.",
      "일관성(Consistency): 트랜잭션 전후로 데이터베이스가 일관된 상태여야 한다.",
      "고립성(Isolation): 동시에 도는 트랜잭션끼리 서로의 중간 결과를 보지 못한다.",
      "지속성(Durability): 성공한 결과는 시스템이 고장 나도 남는다.",
      "상태: 활동 → 부분 완료 → 완료, 또는 활동 → 실패 → 철회.",
    ],
    examPoint:
      "ACID 네 글자와 뜻을 짝짓게 한다. 실기 단답형 단골이라 영문 철자까지 외워 둔다.",
    importance: "must",
    keys: [
      { term: "A", mean: "원자성 — 전부 아니면 전무" },
      { term: "C", mean: "일관성" },
      { term: "I", mean: "고립성 — 중간 결과를 못 본다" },
      { term: "D", mean: "지속성 — 고장 나도 남는다" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-concurrency",
    subject: "database",
    title: "동시성 제어",
    summary: "락, 2단계 락킹, 그리고 갱신 손실·모순성·연쇄 복귀.",
    body: [
      "동시성 제어를 안 하면 갱신 손실(Lost Update), 모순성, 연쇄 복귀(Cascading Rollback), 현황 파악 오류가 생긴다.",
      "로킹은 접근하기 전에 잠그는 것이다. 공유 락(S)은 읽기만, 배타 락(X)은 읽기·쓰기를 막는다.",
      "2단계 로킹 규약은 확장 단계(락을 얻기만)와 축소 단계(락을 풀기만)로 나눈다. 직렬 가능성을 보장하지만 교착 상태는 막지 못한다.",
      "타임스탬프 순서 기법은 시간표를 매겨 순서를 정한다.",
    ],
    examPoint:
      "2단계 로킹이 '직렬 가능성은 보장하지만 교착 상태는 보장하지 못한다'는 서술이 자주 나온다.",
    importance: "high",
    tracks: ["written", "practical"],
  },
  {
    id: "b-index-view",
    subject: "database",
    title: "인덱스와 뷰",
    summary: "인덱스는 빨리 찾으려고, 뷰는 보여 주려고 만든다.",
    body: [
      "인덱스는 검색을 빠르게 하지만 삽입·삭제·수정은 느려진다. B-트리 인덱스가 가장 널리 쓰인다.",
      "뷰는 하나 이상의 테이블에서 유도된 가상 테이블이다. 실제 데이터를 갖지 않는다.",
      "뷰의 장점: 논리적 독립성, 보안(필요한 열만 보여 준다), 질의 단순화. 단점: 정의를 바꿀 수 없고(바꾸려면 DROP 후 재생성), 인덱스를 만들 수 없다.",
    ],
    examPoint:
      "'뷰는 ALTER 로 정의를 변경할 수 없다'가 참인지 묻는다. 인덱스의 단점(갱신 비용)도 잦다.",
    importance: "high",
    tracks: ["written", "practical"],
  },
  {
    id: "b-nosql",
    subject: "database",
    title: "데이터베이스 신기술",
    summary: "NoSQL·데이터 웨어하우스·OLAP·마이닝.",
    body: [
      "NoSQL 유형: Key-Value, Document, Column-family, Graph.",
      "CAP 이론: 일관성(Consistency)·가용성(Availability)·분할 내성(Partition tolerance) 중 셋을 동시에 만족할 수 없다.",
      "데이터 웨어하우스는 분석을 위해 주제별로 모아 둔 것이고, 데이터 마트는 그중 일부다.",
      "OLAP 연산: Roll-up(요약), Drill-down(상세), Slicing, Dicing, Pivoting.",
    ],
    examPoint: "CAP 세 글자와 OLAP 연산 이름이 단골이다.",
    importance: "high",
    keys: [{ term: "CAP", mean: "일관성 · 가용성 · 분할 내성 중 둘까지" }],
    tracks: ["written", "practical"],
  },
];
