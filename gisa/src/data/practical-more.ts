import type { PracticalQuestion } from "@/lib/types";

/**
 * 실기 보충 문항.
 *
 * 한 벌이 100점인데 가진 것이 120점어치뿐이면 거의 전체가 한 회에 나온다.
 * 특히 개발·구축관리가 두 문항씩이라 과목이 한쪽으로 쏠렸다.
 */
export const PRACTICAL_MORE: PracticalQuestion[] = [
  // ── 소프트웨어 개발 ────────────────────────────────
  {
    id: "pq-driver",
    subject: "develop",
    sourceId: "v-integration",
    kind: "term",
    question:
      "상향식 통합 테스트에서 아직 만들지 않은 상위 모듈을 대신해 하위 모듈을 불러 주는 가짜 모듈을 무엇이라 하는가?",
    answers: ["드라이버", "Driver", "테스트 드라이버", "Test Driver"],
    points: 5,
    explanation:
      "상향식은 아래에서 위로 붙이므로 없는 상위 모듈 자리에 드라이버를 둔다. 반대로 하향식에서는 하위 모듈 대신 스텁을 둔다.",
    importance: "must",
  },
  {
    id: "pq-sort-bubble",
    subject: "develop",
    sourceId: "v-sort",
    kind: "blank",
    question:
      "8, 3, 4, 9, 7 을 버블 정렬로 오름차순 정렬할 때 1회전을 마친 결과를 쓰시오.",
    answers: ["3, 4, 8, 7, 9", "3 4 8 7 9", "3,4,8,7,9"],
    points: 5,
    explanation:
      "이웃끼리 견주어 큰 것을 뒤로 민다. (8,3)→(3,8), (8,4)→(4,8), (8,9) 그대로, (9,7)→(7,9) 이므로 3, 4, 8, 7, 9 다.",
    importance: "must",
  },
  {
    id: "pq-tree-inorder",
    subject: "develop",
    sourceId: "v-tree",
    kind: "blank",
    question: "다음 이진 트리를 중위 순회(In-order)한 결과를 쓰시오.",
    passage: "        A\n      /   \\\n     B     C\n    / \\\n   D   E",
    answers: ["D B E A C", "D, B, E, A, C", "DBEAC"],
    points: 5,
    explanation:
      "중위 순회는 왼쪽 → 루트 → 오른쪽이다. B 의 왼쪽 D, 그다음 B, 오른쪽 E, 이어서 루트 A, 마지막이 C 다.",
    importance: "must",
  },
  {
    id: "pq-blackbox",
    subject: "develop",
    sourceId: "v-test-technique",
    kind: "term",
    question:
      "입력 자료를 유효한 값과 무효한 값의 구간으로 나눈 뒤 각 구간에서 대푯값을 하나씩 골라 시험하는 블랙박스 테스트 기법을 쓰시오.",
    answers: [
      "동등 분할",
      "동치 분할",
      "Equivalence Partitioning",
      "동등 분할 검사",
    ],
    points: 5,
    explanation:
      "동등 분할이다. 구간의 경계값만 따로 골라 보는 것은 경계값 분석이며, 둘을 함께 쓴다.",
    importance: "must",
  },
  {
    id: "pq-scm-term",
    subject: "develop",
    sourceId: "v-scm",
    kind: "term",
    question:
      "형상 관리에서 저장소의 파일을 자기 작업 공간으로 받아 오는 일을 무엇이라 하는가?",
    answers: ["체크아웃", "Check-out", "Checkout", "체크아웃(Check-out)"],
    points: 5,
    explanation:
      "체크아웃이다. 반대로 고친 파일을 저장소에 되돌려 놓는 것은 체크인(커밋)이다.",
    importance: "high",
  },

  // ── 정보시스템 구축 관리 ───────────────────────────
  {
    id: "pq-cocomo-organic",
    subject: "system",
    sourceId: "s-estimation",
    kind: "term",
    question:
      "총 35,000 라인이고 개발자 1인당 월 생산성이 500 라인일 때 필요한 노력을 인월(M/M) 단위로 구하시오.",
    answers: ["70", "70 인월", "70인월", "70 M/M", "70M/M"],
    points: 5,
    explanation:
      "노력(인월) = 총 라인 수 ÷ 1인당 월 생산성 = 35,000 ÷ 500 = 70 인월이다. 여기에 인원을 나누면 개발 기간이 나온다.",
    importance: "must",
  },
  {
    id: "pq-syn-flooding",
    subject: "system",
    sourceId: "s-security-attack",
    kind: "term",
    question:
      "TCP 연결 요청(SYN)만 잔뜩 보내 놓고 응답하지 않아 서버의 연결 대기열을 채워 버리는 공격을 쓰시오.",
    answers: [
      "SYN 플러딩",
      "SYN Flooding",
      "TCP SYN Flooding",
      "SYN 플러딩 공격",
    ],
    points: 5,
    explanation:
      "SYN 플러딩이다. 3-way 핸드셰이크의 두 번째 단계에서 멈춰 세워 대기열을 고갈시킨다.",
    importance: "must",
  },
  {
    id: "pq-sql-injection",
    subject: "system",
    sourceId: "s-secure-coding",
    kind: "term",
    question:
      "웹 입력창에 데이터베이스 질의문을 끼워 넣어 인증을 우회하거나 자료를 빼내는 공격을 쓰시오.",
    answers: ["SQL 삽입", "SQL Injection", "SQL 인젝션", "SQL 삽입 공격"],
    points: 5,
    explanation:
      'SQL 삽입이다. 입력값 검증과 매개변수화된 질의(Prepared Statement)로 막는다. 시큐어 코딩의 "입력 데이터 검증 및 표현" 항목이다.',
    importance: "must",
  },
  {
    id: "pq-raid5",
    subject: "system",
    sourceId: "s-raid-backup",
    kind: "term",
    question:
      "여러 디스크에 데이터를 나눠 쓰면서 패리티도 함께 분산 저장해, 디스크 하나가 고장 나도 복구할 수 있는 RAID 레벨을 쓰시오.",
    answers: ["RAID 5", "RAID5", "레이드 5", "5"],
    points: 5,
    explanation:
      "RAID 5 다. RAID 0 은 스트라이핑만, RAID 1 은 미러링, RAID 3·4 는 패리티를 전용 디스크 하나에 모은다.",
    importance: "high",
  },
  {
    id: "pq-sdn",
    subject: "system",
    sourceId: "s-network-new",
    kind: "term",
    question:
      "네트워크 장비의 제어 기능과 전달 기능을 분리해, 중앙에서 소프트웨어로 네트워크 흐름을 제어하는 기술을 쓰시오.",
    answers: [
      "SDN",
      "Software Defined Network",
      "소프트웨어 정의 네트워크",
      "SDN(Software Defined Network)",
    ],
    points: 5,
    explanation:
      "SDN 이다. 제어부를 장비에서 떼어 내 중앙 컨트롤러가 소프트웨어로 경로를 정한다.",
    importance: "high",
  },

  // ── 소프트웨어 설계 ────────────────────────────────
  {
    id: "pq-rumbaugh-func",
    subject: "design",
    sourceId: "d-uml-basic",
    kind: "term",
    question:
      "럼바우 객체지향 분석의 세 가지 모델링 중, 자료 흐름도(DFD)를 이용해 처리 과정을 나타내는 것을 쓰시오.",
    answers: ["기능 모델링", "Functional Modeling", "기능 모델링(Functional)"],
    points: 5,
    explanation:
      "기능 모델링이다. 객체 모델링은 객체 다이어그램, 동적 모델링은 상태 다이어그램을 쓴다.",
    importance: "must",
  },
  {
    id: "pq-pattern-observer",
    subject: "design",
    sourceId: "d-pattern-behavioral",
    kind: "term",
    question:
      "한 객체의 상태가 바뀌면 그 객체에 의존하는 다른 객체들에게 자동으로 알려 주고 갱신하게 하는 디자인 패턴을 쓰시오.",
    answers: ["옵서버", "Observer", "옵저버", "Observer 패턴", "옵서버 패턴"],
    points: 5,
    explanation:
      "옵서버 패턴이다. 주체와 구독자를 일대다로 두고, 주체가 바뀌면 구독자 전부에게 통보한다.",
    importance: "must",
  },
  {
    id: "pq-uml-generalization",
    subject: "design",
    sourceId: "d-uml-basic",
    kind: "term",
    question:
      "UML 관계 중 한 클래스가 다른 클래스를 상속받는 관계를 무엇이라 하는가?",
    answers: [
      "일반화",
      "Generalization",
      "일반화 관계",
      "일반화(Generalization)",
    ],
    points: 5,
    explanation: "일반화다. 속이 빈 삼각형 화살표가 상위 클래스를 가리킨다.",
    importance: "high",
  },

  // ── 데이터베이스 구축 ──────────────────────────────
  {
    id: "pq-bcnf",
    subject: "database",
    sourceId: "b-normalization",
    kind: "term",
    question: "릴레이션의 모든 결정자가 후보키일 때 만족하는 정규형을 쓰시오.",
    answers: [
      "BCNF",
      "보이스-코드 정규형",
      "Boyce-Codd Normal Form",
      "보이스코드 정규형",
    ],
    points: 5,
    explanation:
      "BCNF 다. 제3정규형이면서 결정자이지만 후보키가 아닌 속성까지 없앤 것이다.",
    importance: "must",
  },
  {
    id: "pq-cardinality",
    subject: "database",
    sourceId: "b-schema",
    kind: "blank",
    question:
      "릴레이션에서 튜플(행)의 개수를 ( ① ), 속성(열)의 개수를 ( ② )라 한다. ①과 ②에 들어갈 용어를 쓰시오.",
    answers: [
      "① 카디널리티 ② 차수",
      "카디널리티, 차수",
      "카디널리티 차수",
      "Cardinality, Degree",
      "① Cardinality ② Degree",
    ],
    points: 5,
    explanation:
      "행의 수가 카디널리티(Cardinality), 열의 수가 차수(Degree)다. 시험은 이 둘을 바꿔 낸다.",
    importance: "must",
  },
  {
    id: "pq-sql-delete",
    subject: "database",
    sourceId: "b-sql-ddl",
    kind: "sql",
    question:
      "학생 테이블에서 학과가 '컴퓨터'인 행을 모두 지우는 SQL 문을 작성하시오.",
    passage: "학생(학번, 이름, 학과, 학년)",
    answers: [
      "DELETE FROM 학생 WHERE 학과 = '컴퓨터';",
      "delete from 학생 where 학과='컴퓨터'",
    ],
    points: 5,
    explanation:
      "DELETE FROM ~ WHERE 다. 테이블 자체를 없애는 DROP, 구조는 두고 전부 비우는 TRUNCATE 와 섞지 않도록 한다.",
    importance: "must",
  },
  {
    id: "pq-sql-orderby",
    subject: "database",
    sourceId: "b-sql-join",
    kind: "sql",
    question:
      "사원 테이블에서 부서가 '개발'인 사원의 이름과 급여를 급여가 높은 순으로 조회하는 SQL 문을 작성하시오.",
    passage: "사원(사번, 이름, 부서, 급여)",
    answers: [
      "SELECT 이름, 급여 FROM 사원 WHERE 부서 = '개발' ORDER BY 급여 DESC;",
      "select 이름, 급여 from 사원 where 부서='개발' order by 급여 desc",
    ],
    points: 5,
    explanation:
      "내림차순은 ORDER BY ~ DESC 다. 아무것도 적지 않으면 오름차순(ASC)이 기본이다.",
    importance: "must",
  },

  // ── 프로그래밍 언어 활용 ───────────────────────────
  {
    id: "pq-code-java-static",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      "public class Main {\n    static int n = 0;\n    static void up() { n++; }\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) up();\n        System.out.print(n);\n    }\n}",
    answers: ["5"],
    points: 5,
    explanation:
      "n 은 static 이라 클래스에 하나만 있다. up() 을 다섯 번 부르면 5 가 된다.",
    importance: "high",
  },
  {
    id: "pq-code-c-while",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int n = 1234, sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    printf("%d", sum);\n    return 0;\n}',
    answers: ["10"],
    points: 5,
    explanation:
      "n % 10 으로 끝자리를 떼고 n /= 10 으로 한 자리씩 줄인다. 1+2+3+4 = 10 이다.",
    importance: "must",
  },
  {
    id: "pq-code-python-dict",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "a = {'x': 1, 'y': 2}\na['z'] = a['x'] + a['y']\nprint(len(a), a['z'])",
    answers: ["3 3"],
    points: 5,
    explanation:
      "키 z 를 새로 넣었으니 길이는 3 이고, 1 + 2 = 3 이 담긴다. print 는 인자 사이에 공백을 하나 넣는다.",
    importance: "high",
  },
  {
    id: "pq-lru",
    subject: "language",
    sourceId: "l-os-memory",
    kind: "blank",
    question:
      "페이지 프레임이 3개이고 참조 순서가 1, 2, 3, 1, 4, 2 일 때 LRU 교체 기법에서 페이지 부재가 몇 번 일어나는지 쓰시오.",
    answers: ["5", "5회", "5번"],
    points: 5,
    explanation:
      "1·2·3 에서 세 번, 1 은 적중, 4 에서 가장 오래 쓰지 않은 2 를 밀어내며 네 번째, 마지막 2 에서 다섯 번째 부재가 난다.",
    importance: "must",
  },
  {
    id: "pq-deadlock-cond",
    subject: "language",
    sourceId: "l-os-scheduling",
    kind: "term",
    question: "교착 상태가 일어나기 위한 네 가지 조건을 모두 쓰시오.",
    answers: [
      "상호 배제·점유와 대기·비선점·환형 대기",
      // 환형 대기는 원형 대기로도 쓴다 — 같은 Circular Wait 다
      "상호 배제·점유와 대기·비선점·원형 대기",
      "Mutual Exclusion·Hold and Wait·No Preemption·Circular Wait",
    ],
    points: 5,
    explanation:
      "네 가지가 모두 성립해야 교착 상태가 된다. 하나만 깨도 예방된다.",
    importance: "must",
  },
];
