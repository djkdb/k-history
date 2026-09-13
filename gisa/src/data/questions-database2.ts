import type { WrittenQuestion } from "@/lib/types";

/** 3과목 · 데이터베이스 구축 — 보충 2 */
export const DATABASE2_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qb2-dba-role",
    subject: "database",
    sourceId: "b-schema",
    question: "데이터베이스 관리 시스템(DBMS)의 필수 기능 세 가지로 옳은 것은?",
    options: [
      "정의 기능 · 조작 기능 · 제어 기능",
      "입력 기능 · 출력 기능 · 저장 기능",
      "설계 기능 · 구현 기능 · 시험 기능",
      "정규화 기능 · 인덱싱 기능 · 백업 기능",
    ],
    answerIndex: 0,
    explanation:
      "DBMS 의 필수 기능은 정의(Definition)·조작(Manipulation)·제어(Control)다. DDL·DML·DCL 이 각각 이것을 맡는다.",
    optionNotes: [
      null,
      "일반적인 프로그램 기능이다.",
      "개발 단계다.",
      "부가 기능들이다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-independence",
    subject: "database",
    sourceId: "b-schema",
    question:
      "저장 구조를 바꾸어도 응용 프로그램을 고칠 필요가 없는 성질을 무엇이라 하는가?",
    options: [
      "논리적 데이터 독립성",
      "물리적 데이터 독립성",
      "데이터 무결성",
      "데이터 일관성",
    ],
    answerIndex: 1,
    explanation:
      "물리적 독립성은 내부 스키마가 바뀌어도 개념 스키마가 흔들리지 않는 것이다. 개념 스키마가 바뀌어도 외부 스키마가 견디는 것은 논리적 독립성이다.",
    optionNotes: [
      "논리적 독립성은 개념 스키마가 바뀔 때의 이야기다.",
      null,
      "무결성은 값이 규칙을 지키는 것이다.",
      "일관성은 값이 서로 어긋나지 않는 것이다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-key-foreign",
    subject: "database",
    sourceId: "b-key",
    question: "외래키(Foreign Key)에 대한 설명으로 옳은 것은?",
    options: [
      "반드시 NULL 을 가질 수 없다.",
      "다른 릴레이션의 기본키를 참조하는 속성이다.",
      "한 릴레이션에 하나만 둘 수 있다.",
      "유일성과 최소성을 모두 만족해야 한다.",
    ],
    answerIndex: 1,
    explanation:
      "외래키는 다른 릴레이션의 기본키를 가리킨다. NULL 을 가질 수 있고, 한 릴레이션에 여럿 둘 수 있다.",
    optionNotes: [
      "NULL 을 못 가지는 것은 기본키다.",
      null,
      "여럿 둘 수 있다.",
      "유일성·최소성은 후보키의 성질이다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-key-super",
    subject: "database",
    sourceId: "b-key",
    question:
      "다음 릴레이션에서 슈퍼키이지만 후보키는 될 수 없는 것은? (학번과 주민번호는 각각 사람을 하나로 가려낸다)",
    passage: "학생(학번, 주민번호, 이름, 학과)",
    options: ["학번", "주민번호", "(학번, 이름)", "학과"],
    answerIndex: 2,
    explanation:
      "(학번, 이름)은 사람을 하나로 가려내므로 슈퍼키지만, 이름을 빼도 여전히 가려내므로 최소성을 어긴다. 후보키는 유일성과 최소성을 함께 갖춰야 한다.",
    optionNotes: [
      "학번 하나로 이미 가려내므로 후보키다.",
      "주민번호도 마찬가지로 후보키다.",
      null,
      "학과는 여럿이 함께 가지므로 슈퍼키도 되지 못한다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-anomaly-insert",
    subject: "database",
    sourceId: "b-anomaly",
    question:
      "어떤 자료를 넣고 싶은데 아직 정해지지 않은 다른 값까지 함께 넣어야만 하는 현상은?",
    options: ["삽입 이상", "삭제 이상", "갱신 이상", "참조 이상"],
    answerIndex: 0,
    explanation:
      "삽입 이상이다. 학생을 등록하려는데 아직 정해지지 않은 과목 코드까지 채워야 하는 식이다.",
    optionNotes: [
      null,
      "삭제 이상은 지울 때 딸려 사라지는 것이다.",
      "갱신 이상은 일부만 고쳐 값이 어긋나는 것이다.",
      "참조 이상이라는 말은 쓰지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-norm-1nf",
    subject: "database",
    sourceId: "b-normalization",
    question: "제1정규형(1NF)을 만족하기 위한 조건은?",
    options: [
      "모든 속성이 원자값만 가져야 한다.",
      "부분 함수 종속이 없어야 한다.",
      "이행 함수 종속이 없어야 한다.",
      "모든 결정자가 후보키여야 한다.",
    ],
    answerIndex: 0,
    explanation:
      "1NF 는 한 칸에 값이 하나만 들어가야 한다는 조건이다. 다음 단계들이 종속을 하나씩 걷어 낸다.",
    optionNotes: [null, "이것은 2NF 다.", "이것은 3NF 다.", "이것은 BCNF 다."],
    importance: "must",
  },
  {
    id: "qb2-norm-order",
    subject: "database",
    sourceId: "b-normalization",
    question: "정규화 단계에서 제거하는 것을 순서대로 바르게 짝지은 것은?",
    options: [
      "1NF 원자값 → 2NF 부분 종속 → 3NF 이행 종속 → BCNF 결정자",
      "1NF 부분 종속 → 2NF 원자값 → 3NF 결정자 → BCNF 이행 종속",
      "1NF 이행 종속 → 2NF 결정자 → 3NF 원자값 → BCNF 부분 종속",
      "1NF 결정자 → 2NF 이행 종속 → 3NF 부분 종속 → BCNF 원자값",
    ],
    answerIndex: 0,
    explanation:
      '"원자값 → 부분 → 이행 → 결정자" 순이다. 뒤에 다치 종속(4NF), 조인 종속(5NF)이 이어진다.',
    optionNotes: [
      null,
      "순서가 어긋난다.",
      "순서가 어긋난다.",
      "순서가 어긋난다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-sql-select-where",
    subject: "database",
    sourceId: "b-sql-join",
    question: "다음 SQL 문의 실행 결과로 옳은 것은?",
    passage:
      "사원(사번, 이름, 부서, 급여)\n\nSELECT 이름\n  FROM 사원\n WHERE 급여 BETWEEN 300 AND 500;",
    options: [
      "급여가 300 초과 500 미만인 사원의 이름",
      "급여가 300 이상 500 이하인 사원의 이름",
      "급여가 300 이거나 500 인 사원의 이름",
      "급여가 300 미만이거나 500 초과인 사원의 이름",
    ],
    answerIndex: 1,
    explanation:
      "BETWEEN A AND B 는 양 끝을 포함한다. 300 과 500 인 사원도 결과에 들어간다.",
    optionNotes: [
      "양 끝을 포함한다.",
      null,
      "IN (300, 500) 이 그렇다.",
      "NOT BETWEEN 이 그렇다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-sql-null",
    subject: "database",
    sourceId: "b-sql-join",
    question: "SQL 에서 NULL 을 다루는 방법으로 옳은 것은?",
    options: [
      "급여 = NULL 로 비교한다.",
      "급여 IS NULL 로 비교한다.",
      "급여 == NULL 로 비교한다.",
      "급여 LIKE NULL 로 비교한다.",
    ],
    answerIndex: 1,
    explanation:
      "NULL 은 '값이 없음'이라 같다·다르다를 따질 수 없다. = 로 견주면 참도 거짓도 아닌 결과가 나오므로 IS NULL 을 쓴다.",
    optionNotes: [null, null, "SQL 에 == 는 없다.", "LIKE 는 문자열 비교다."],
    importance: "must",
  },
  {
    id: "qb2-sql-aggregate",
    subject: "database",
    sourceId: "b-sql-join",
    question: "집계 함수 COUNT(*) 와 COUNT(급여) 의 차이로 옳은 것은?",
    options: [
      "둘은 언제나 같은 값을 낸다.",
      "COUNT(*) 는 행 전체를 세고, COUNT(급여) 는 급여가 NULL 이 아닌 행만 센다.",
      "COUNT(*) 는 NULL 을 빼고 세고, COUNT(급여) 는 전부 센다.",
      "COUNT(급여) 는 급여의 합을 구한다.",
    ],
    answerIndex: 1,
    explanation:
      "COUNT(*) 는 행 수, COUNT(열) 은 그 열이 NULL 이 아닌 행 수다. 시험은 이 차이를 묻는다.",
    optionNotes: [
      "NULL 이 있으면 달라진다.",
      null,
      "뒤바뀌었다.",
      "합은 SUM 이다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-tx-durability",
    subject: "database",
    sourceId: "b-transaction",
    question:
      "성공적으로 끝난 트랜잭션의 결과는 시스템이 고장 나도 남아 있어야 한다는 성질은?",
    options: ["원자성", "일관성", "고립성", "지속성"],
    answerIndex: 3,
    explanation:
      "지속성(Durability)이다. 커밋된 것은 장애가 나도 남는다. 로그와 회복 기법이 이것을 보장한다.",
    optionNotes: [
      "원자성은 전부 반영되거나 전혀 반영되지 않는 것이다.",
      "일관성은 끝난 뒤에도 규칙이 지켜지는 것이다.",
      "고립성은 서로의 중간 결과를 보지 못하는 것이다.",
      null,
    ],
    importance: "must",
  },
  {
    id: "qb2-tx-commands",
    subject: "database",
    sourceId: "b-transaction",
    question:
      "트랜잭션 안에서 특정 지점을 정해 두고 그곳까지만 되돌릴 수 있게 하는 명령은?",
    options: ["COMMIT", "ROLLBACK", "SAVEPOINT", "GRANT"],
    answerIndex: 2,
    explanation:
      "SAVEPOINT 로 표시해 두면 ROLLBACK TO 로 그 지점까지만 되돌릴 수 있다.",
    optionNotes: [
      "COMMIT 은 확정한다.",
      "ROLLBACK 은 되돌린다.",
      null,
      "GRANT 는 권한을 준다.",
    ],
    importance: "high",
  },
  {
    id: "qb2-concurrency-problem",
    subject: "database",
    sourceId: "b-concurrency",
    question:
      "아직 커밋되지 않은 다른 트랜잭션의 변경을 읽어 버리는 문제를 무엇이라 하는가?",
    options: [
      "Dirty Read",
      "Non-repeatable Read",
      "Phantom Read",
      "Lost Update",
    ],
    answerIndex: 0,
    explanation:
      "더티 리드다. 읽고 난 뒤 상대가 롤백하면 있지도 않았던 값을 읽은 셈이 된다.",
    optionNotes: [
      null,
      "같은 행을 두 번 읽었는데 값이 달라지는 것이다.",
      "같은 조건으로 두 번 읽었는데 행 수가 달라지는 것이다.",
      "두 트랜잭션이 같은 값을 고쳐 한쪽이 묻히는 것이다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-concurrency-lock",
    subject: "database",
    sourceId: "b-concurrency",
    question: "공유 락(Shared Lock)에 대한 설명으로 옳은 것은?",
    options: [
      "여러 트랜잭션이 동시에 걸 수 있고, 읽기만 허용한다.",
      "한 트랜잭션만 걸 수 있고, 읽기와 쓰기를 모두 허용한다.",
      "락을 걸면 다른 트랜잭션은 읽지도 못한다.",
      "쓰기 전용이라 읽기에는 쓰지 않는다.",
    ],
    answerIndex: 0,
    explanation:
      "공유 락은 읽기끼리는 함께 걸 수 있다. 배타 락(Exclusive Lock)은 하나만 걸 수 있고 쓰기를 위한 것이다.",
    optionNotes: [
      null,
      "이것은 배타 락이다.",
      "공유 락에서는 읽을 수 있다.",
      "쓰기 전용은 배타 락이다.",
    ],
    importance: "must",
  },
  {
    id: "qb2-index-clustered",
    subject: "database",
    sourceId: "b-index-view",
    question: "클러스터형 인덱스에 대한 설명으로 옳은 것은?",
    options: [
      "한 테이블에 여러 개 만들 수 있다.",
      "인덱스 순서대로 실제 데이터가 정렬되어 저장된다.",
      "인덱스와 데이터가 따로 저장되어 순서가 무관하다.",
      "기본키에는 만들 수 없다.",
    ],
    answerIndex: 1,
    explanation:
      "클러스터형은 데이터 자체를 인덱스 순서로 늘어놓으므로 테이블마다 하나만 둘 수 있다. 비클러스터형은 따로 두므로 여럿 둘 수 있다.",
    optionNotes: [
      "하나만 둘 수 있다.",
      null,
      "이것은 비클러스터형이다.",
      "기본키에 흔히 만든다.",
    ],
    importance: "high",
  },
  {
    id: "qb2-view-purpose",
    subject: "database",
    sourceId: "b-index-view",
    question: "뷰(View)를 쓰는 이유로 옳지 않은 것은?",
    options: [
      "복잡한 질의를 간단하게 쓸 수 있다.",
      "사용자마다 보여 줄 열을 제한해 보안을 높인다.",
      "논리적 독립성을 높인다.",
      "물리적 저장 공간을 줄여 검색 속도를 높인다.",
    ],
    answerIndex: 3,
    explanation:
      "뷰는 실제 데이터를 따로 저장하지 않으므로 저장 공간이나 속도와는 관계가 없다.",
    optionNotes: [null, null, null, "정답. 뷰는 가상 테이블이다."],
    importance: "must",
  },
  {
    id: "qb2-nosql-kind",
    subject: "database",
    sourceId: "b-nosql",
    question: "NoSQL 데이터베이스의 유형에 해당하지 않는 것은?",
    options: [
      "키-값(Key-Value)",
      "문서(Document)",
      "칼럼 패밀리(Column Family)",
      "계층형(Hierarchical)",
    ],
    answerIndex: 3,
    explanation:
      "NoSQL 은 키-값·문서·칼럼 패밀리·그래프 네 가지로 나눈다. 계층형은 관계형 이전의 옛 모델이다.",
    optionNotes: [null, null, null, "정답. 네 번째 유형은 그래프다."],
    importance: "high",
  },
  {
    id: "qb2-datawarehouse",
    subject: "database",
    sourceId: "b-nosql",
    question:
      "여러 시스템에 흩어진 자료를 주제별로 모아 시간에 따라 쌓아 두고 분석에 쓰는 저장소는?",
    options: ["데이터 웨어하우스", "데이터 마이닝", "데이터 마트", "OLTP"],
    answerIndex: 0,
    explanation:
      "데이터 웨어하우스다. 그중 특정 부서나 주제만 떼어 낸 작은 것이 데이터 마트, 그 안에서 규칙을 찾아내는 일이 데이터 마이닝이다.",
    optionNotes: [
      null,
      "마이닝은 자료에서 규칙을 찾아내는 일이다.",
      "마트는 웨어하우스의 일부를 떼어 낸 것이다.",
      "OLTP 는 실시간 거래 처리 시스템이다.",
    ],
    importance: "high",
  },
  {
    id: "qb2-ddl-alter",
    subject: "database",
    sourceId: "b-sql-ddl",
    question: "DDL 명령에 대한 설명으로 옳지 않은 것은?",
    options: [
      "CREATE 는 테이블·뷰·인덱스 등을 만든다.",
      "ALTER 는 테이블의 구조를 바꾼다.",
      "DROP 은 대상을 통째로 없앤다.",
      "TRUNCATE 는 구조와 데이터를 모두 없앤다.",
    ],
    answerIndex: 3,
    explanation:
      "TRUNCATE 는 구조는 두고 데이터만 전부 비운다. 구조까지 없애는 것은 DROP 이다.",
    optionNotes: [null, null, null, "정답. 구조는 남는다."],
    importance: "must",
  },
  {
    id: "qb2-integrity-domain",
    subject: "database",
    sourceId: "b-integrity",
    question:
      "성별 속성에 '남' 또는 '여' 만 들어가도록 제한하는 것은 어떤 무결성에 해당하는가?",
    options: ["개체 무결성", "참조 무결성", "도메인 무결성", "키 무결성"],
    answerIndex: 2,
    explanation:
      "도메인 무결성이다. 속성이 가질 수 있는 값의 범위를 정해 두는 것으로, CHECK 제약으로 건다.",
    optionNotes: [
      "개체 무결성은 기본키가 NULL 이 아니어야 한다는 것이다.",
      "참조 무결성은 외래키가 실제 있는 값을 가리켜야 한다는 것이다.",
      null,
      "키 무결성이라는 말은 따로 쓰지 않는다.",
    ],
    importance: "must",
  },
];
