import type { WrittenQuestion } from "@/lib/types";

/**
 * 과목마다 한 회에 20문항이 나간다. 한 벌을 만들려면 과목마다 최소 20개가
 * 있어야 하므로 모자란 만큼 더 썼다.
 */
export const MORE_QUESTIONS: WrittenQuestion[] = [
  // ── 2과목 · 소프트웨어 개발 ──────────────────────────────
  {
    id: "qv-queue-use",
    subject: "develop",
    sourceId: "v-datastructure",
    question: "다음 중 큐(Queue)를 사용하기에 알맞은 것은?",
    options: [
      "함수 호출 시 복귀 주소 저장",
      "수식의 괄호 짝 검사",
      "너비 우선 탐색(BFS)",
      "후위 표기식 계산",
    ],
    answerIndex: 2,
    explanation:
      "너비 우선 탐색은 먼저 만난 노드부터 차례로 처리하므로 큐를 쓴다. 나머지는 모두 스택을 쓴다.",
    optionNotes: ["스택이다.", "스택이다.", null, "스택이다."],
    importance: "high",
  },
  {
    id: "qv-sort-merge",
    subject: "develop",
    sourceId: "v-sort",
    question: "병합 정렬(Merge Sort)에 대한 설명으로 옳은 것은?",
    options: [
      "추가 메모리 없이 제자리에서 정렬한다.",
      "최선과 최악이 모두 O(n log n)이다.",
      "평균은 O(n log n)이지만 최악은 O(n²)이다.",
      "비교를 하지 않는 정렬이다.",
    ],
    answerIndex: 1,
    explanation:
      "병합 정렬은 어떤 입력에도 O(n log n)이다. 다만 합칠 공간이 따로 필요하다. 최악이 O(n²)인 것은 퀵 정렬이다.",
    optionNotes: [
      "추가 공간이 필요하다.",
      null,
      "퀵 정렬 설명이다.",
      "비교 기반 정렬이다.",
    ],
    importance: "high",
  },
  {
    id: "qv-test-regression",
    subject: "develop",
    sourceId: "v-test-level",
    question:
      "코드를 수정한 뒤 그 변경이 다른 부분을 망가뜨리지 않았는지 확인하는 테스트는?",
    options: ["회귀 테스트", "스모크 테스트", "부하 테스트", "인수 테스트"],
    answerIndex: 0,
    explanation:
      "회귀(Regression) 테스트다. 고친 뒤 기존 기능이 그대로인지 다시 돌려 본다.",
    optionNotes: [
      null,
      "빌드가 돌아가는지 최소한만 확인한다.",
      "많은 부하를 걸어 본다.",
      "사용자 관점의 최종 확인이다.",
    ],
    importance: "high",
  },
  {
    id: "qv-cohesion-order",
    subject: "develop",
    sourceId: "v-complexity",
    question:
      "제어 흐름 그래프에서 판단 노드(분기)가 5개일 때 순환 복잡도 V(G)는?",
    options: ["4", "5", "6", "10"],
    answerIndex: 2,
    explanation: "분기 개수 + 1 이므로 5 + 1 = 6 이다.",
    optionNotes: [
      "1을 빼면 안 된다.",
      "1을 더해야 한다.",
      null,
      "2배가 아니다.",
    ],
    importance: "must",
  },

  // ── 3과목 · 데이터베이스 구축 ─────────────────────────────
  {
    id: "qb-relation-term",
    subject: "database",
    sourceId: "b-schema",
    question: "릴레이션에서 튜플(Tuple)의 개수를 뜻하는 용어는?",
    options: [
      "차수(Degree)",
      "카디널리티(Cardinality)",
      "도메인(Domain)",
      "속성(Attribute)",
    ],
    answerIndex: 1,
    explanation: "카디널리티는 행(튜플)의 수, 차수는 열(속성)의 수다.",
    optionNotes: [
      "속성의 개수다.",
      null,
      "속성이 가질 수 있는 값의 범위다.",
      "릴레이션의 열이다.",
    ],
    importance: "must",
  },
  {
    id: "qb-fk-cascade",
    subject: "database",
    sourceId: "b-integrity",
    question:
      "참조되는 행이 삭제될 때 참조하는 행도 함께 삭제되도록 하는 옵션은?",
    options: ["CASCADE", "SET NULL", "RESTRICT", "SET DEFAULT"],
    answerIndex: 0,
    explanation:
      "CASCADE 는 함께 삭제한다. RESTRICT/NO ACTION 은 참조가 있으면 삭제를 막는다.",
    optionNotes: [
      null,
      "외래키를 NULL 로 바꾼다.",
      "삭제를 막는다.",
      "기본값으로 바꾼다.",
    ],
    importance: "high",
  },
  {
    id: "qb-bcnf",
    subject: "database",
    sourceId: "b-normalization",
    question: "BCNF 를 만족하기 위한 조건은?",
    options: [
      "모든 속성이 원자값이어야 한다.",
      "부분 함수 종속이 없어야 한다.",
      "모든 결정자가 후보키여야 한다.",
      "다치 종속이 없어야 한다.",
    ],
    answerIndex: 2,
    explanation: "BCNF 는 모든 결정자가 후보키여야 한다. 3NF 보다 엄격하다.",
    optionNotes: ["1NF 조건이다.", "2NF 조건이다.", null, "4NF 조건이다."],
    importance: "must",
  },
  {
    id: "qb-sql-order",
    subject: "database",
    sourceId: "b-sql-join",
    question: "SQL 질의문의 실행 순서로 옳은 것은?",
    options: [
      "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
      "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
      "FROM → SELECT → WHERE → GROUP BY → ORDER BY → HAVING",
      "WHERE → FROM → SELECT → GROUP BY → HAVING → ORDER BY",
    ],
    answerIndex: 1,
    explanation:
      "적는 순서와 실행 순서가 다르다. FROM 으로 가져와 WHERE 로 거르고 GROUP BY 로 묶은 뒤 HAVING 으로 거르고, SELECT 로 고른 다음 ORDER BY 로 정렬한다.",
    optionNotes: [
      "적는 순서다.",
      null,
      "SELECT 는 뒤쪽이다.",
      "FROM 이 먼저다.",
    ],
    importance: "must",
  },
  {
    id: "qb-trigger",
    subject: "database",
    sourceId: "b-sql-ddl",
    question:
      "특정 테이블에 INSERT·UPDATE·DELETE 가 일어날 때 자동으로 수행되는 것은?",
    options: ["뷰(View)", "인덱스(Index)", "트리거(Trigger)", "커서(Cursor)"],
    answerIndex: 2,
    explanation:
      "트리거다. 데이터 변경을 계기로 미리 정의한 동작이 자동 실행된다.",
    optionNotes: [
      "가상 테이블이다.",
      "검색을 빠르게 한다.",
      null,
      "결과 집합을 한 행씩 처리하는 수단이다.",
    ],
    importance: "high",
  },

  // ── 4과목 · 프로그래밍 언어 활용 ───────────────────────────
  {
    id: "ql-c-string",
    subject: "language",
    sourceId: "l-c-pointer",
    question: 'C 에서 char s[] = "ABC"; 일 때 sizeof(s)의 값은?',
    options: ["3", "4", "5", "8"],
    answerIndex: 1,
    explanation:
      "문자열 끝에 널 문자 '\\0' 이 붙으므로 A, B, C, \\0 으로 4바이트다. strlen(s)는 3이다.",
    optionNotes: [
      "strlen 의 값이다.",
      null,
      "널 문자를 두 개로 셌다.",
      "포인터 크기와 혼동했다.",
    ],
    importance: "must",
  },
  {
    id: "ql-python-range",
    subject: "language",
    sourceId: "l-python",
    question: "다음 Python 코드의 출력 결과는?",
    passage: "s = 0\nfor i in range(1, 5):\n    s += i\nprint(s)",
    options: ["10", "15", "6", "4"],
    answerIndex: 0,
    explanation:
      "range(1, 5)는 1, 2, 3, 4 다. 5는 포함하지 않으므로 합은 10 이다.",
    optionNotes: [
      null,
      "5까지 더한 값이다.",
      "3까지 더한 값이다.",
      "개수를 센 값이다.",
    ],
    importance: "must",
  },
  {
    id: "ql-java-interface",
    subject: "language",
    sourceId: "l-java-oop",
    question: "Java 의 추상 클래스와 인터페이스에 대한 설명으로 옳은 것은?",
    options: [
      "추상 클래스는 다중 상속이 가능하다.",
      "인터페이스는 여러 개를 동시에 구현할 수 있다.",
      "추상 클래스는 인스턴스를 만들 수 있다.",
      "인터페이스에는 필드를 자유롭게 선언할 수 있다.",
    ],
    answerIndex: 1,
    explanation:
      "Java 는 클래스 다중 상속을 허용하지 않지만 인터페이스는 여러 개 구현할 수 있다. 추상 클래스는 인스턴스를 만들 수 없다.",
    optionNotes: [
      "클래스는 단일 상속이다.",
      null,
      "만들 수 없다.",
      "상수만 선언된다.",
    ],
    importance: "high",
  },
  {
    id: "ql-os-deadlock",
    subject: "language",
    sourceId: "l-os-scheduling",
    question: "교착 상태(Deadlock)가 발생하기 위한 필요 조건이 아닌 것은?",
    options: ["상호 배제", "점유와 대기", "비선점", "선점 가능"],
    answerIndex: 3,
    explanation:
      "교착 상태의 네 가지 필요 조건은 상호 배제, 점유와 대기, 비선점, 환형 대기다. 선점이 가능하면 오히려 교착이 풀린다.",
    optionNotes: [null, null, null, "정답. 비선점이 조건이다."],
    importance: "must",
  },
  {
    id: "ql-net-protocol",
    subject: "language",
    sourceId: "l-network-osi",
    question: "다음 중 응용 계층(7계층) 프로토콜이 아닌 것은?",
    options: ["HTTP", "FTP", "TCP", "SMTP"],
    answerIndex: 2,
    explanation: "TCP 는 전송 계층(4계층)이다. 나머지는 응용 계층이다.",
    optionNotes: [null, null, "정답. 4계층이다.", null],
    importance: "must",
  },

  // ── 5과목 · 정보시스템 구축 관리 ───────────────────────────
  {
    id: "qs-nassi",
    subject: "system",
    sourceId: "s-methodology",
    question: "구조적 방법론에서 논리 흐름을 표현하는 도구는?",
    options: [
      "나씨-슈나이더만 차트",
      "유스케이스 다이어그램",
      "클래스 다이어그램",
      "ERD",
    ],
    answerIndex: 0,
    explanation:
      "나씨-슈나이더만(N-S) 차트는 화살표 없이 상자로 논리 흐름을 나타낸다. 구조적 방법론의 산출물이다.",
    optionNotes: [
      null,
      "객체지향의 요구 표현이다.",
      "객체지향 구조 표현이다.",
      "데이터 모델링 도구다.",
    ],
    importance: "normal",
  },
  {
    id: "qs-loc",
    subject: "system",
    sourceId: "s-estimation",
    question:
      "총 라인 수가 30,000 LOC 이고 개발자 1인당 월 생산성이 500 LOC 일 때 필요한 노력(인월)은?",
    options: ["30 인월", "60 인월", "150 인월", "600 인월"],
    answerIndex: 1,
    explanation: "30,000 ÷ 500 = 60 인월이다.",
    optionNotes: [
      "1000으로 나눈 값이다.",
      null,
      "곱셈을 잘못했다.",
      "단위를 잘못 잡았다.",
    ],
    importance: "high",
  },
  {
    id: "qs-tls",
    subject: "system",
    sourceId: "s-security-crypto",
    question:
      "전송 계층에서 동작하며 웹 통신을 암호화하는 데 널리 쓰이는 프로토콜은?",
    options: ["IPSec", "SSL/TLS", "S-HTTP", "SSH"],
    answerIndex: 1,
    explanation:
      "SSL/TLS 는 전송 계층에서 동작한다. IPSec 은 네트워크 계층, S-HTTP 는 응용 계층이다.",
    optionNotes: [
      "네트워크 계층이다.",
      null,
      "응용 계층이다.",
      "원격 접속용 응용 계층 프로토콜이다.",
    ],
    importance: "must",
  },
  {
    id: "qs-container",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "여러 대의 서버에 걸쳐 컨테이너를 배포하고 관리하는 오픈소스 플랫폼은?",
    options: ["Docker", "Kubernetes", "Jenkins", "Ansible"],
    answerIndex: 1,
    explanation:
      "쿠버네티스가 컨테이너 오케스트레이션을 맡는다. Docker 는 컨테이너를 만들고 실행하는 도구다.",
    optionNotes: [
      "컨테이너를 만들고 실행한다.",
      null,
      "CI 도구다.",
      "구성 관리 도구다.",
    ],
    importance: "high",
  },
  {
    id: "qs-tampering",
    subject: "system",
    sourceId: "s-secure-coding",
    question:
      "여러 프로세스가 공유 자원에 동시에 접근하는 순서에 따라 결과가 달라지는 취약점은?",
    options: [
      "경쟁 조건(Race Condition)",
      "버퍼 오버플로",
      "포맷 스트링",
      "널 포인터 역참조",
    ],
    answerIndex: 0,
    explanation: "경쟁 조건이다. 시큐어 코딩의 '시간 및 상태' 분류에 속한다.",
    optionNotes: [
      null,
      "할당된 범위를 넘겨 쓰는 것이다.",
      "형식 문자열을 조작하는 것이다.",
      "널을 참조하는 것이다.",
    ],
    importance: "high",
  },
];
