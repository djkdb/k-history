import type { PracticalQuestion } from "@/lib/types";
import type { SubjectId } from "@/data/exam";
import { PRACTICAL_MORE } from "@/data/practical-more";
import { PRACTICAL2_QUESTIONS } from "@/data/practical2";
import { PRACTICAL_CODE } from "@/data/practical-code";

/**
 * 실기 — 필답형.
 *
 * 고르는 것이 아니라 적는다. 그래서 answers 에 받아 줄 표기를 여러 개 둔다.
 * 첫 번째가 모범 답안으로 화면에 보인다.
 *
 * 배점은 실제 시험처럼 문항마다 다르게 두었다. 실기는 100점 만점에 60점
 * 이상이면 합격이고 과락은 없다.
 */
const BASE_PRACTICAL: PracticalQuestion[] = [
  // ── 용어 ──────────────────────────────────────────────
  {
    id: "pq-encapsulation",
    subject: "design",
    sourceId: "d-oop",
    kind: "term",
    question:
      "데이터와 그 데이터를 처리하는 함수를 하나로 묶고, 외부에서 내부 구현에 직접 접근하지 못하도록 하는 객체지향 개념을 쓰시오.",
    answers: ["캡슐화", "Encapsulation", "캡슐화(Encapsulation)"],
    points: 5,
    explanation:
      "캡슐화다. 결합도가 낮아지고 재사용이 쉬워지며, 안쪽을 감추는 정보 은닉으로 이어진다.",
    importance: "must",
  },
  {
    id: "pq-acid",
    subject: "database",
    sourceId: "b-transaction",
    kind: "term",
    question: "트랜잭션이 가져야 할 네 가지 성질(ACID)을 모두 쓰시오.",
    answers: [
      "원자성·일관성·고립성·지속성",
      "원자성·일관성·격리성·지속성",
      "Atomicity·Consistency·Isolation·Durability",
    ],
    points: 5,
    explanation:
      "원자성(전부 되든가 전부 안 되든가), 일관성, 고립성(격리성), 지속성이다. 순서가 달라도 넷을 다 쓰면 맞다.",
    importance: "must",
  },
  {
    id: "pq-2nf",
    subject: "database",
    sourceId: "b-normalization",
    kind: "term",
    question:
      "제1정규형을 만족하는 릴레이션에서 부분 함수 종속을 제거하면 도달하는 정규형을 쓰시오.",
    answers: ["제2정규형", "2NF", "2정규형", "제2정규형(2NF)"],
    points: 5,
    explanation: "부분 함수 종속 제거 = 2NF, 이행 함수 종속 제거 = 3NF 다.",
    importance: "must",
  },
  {
    id: "pq-stub",
    subject: "develop",
    sourceId: "v-integration",
    kind: "term",
    question:
      "하향식 통합 테스트에서 아직 개발되지 않은 하위 모듈을 대신하는 임시 모듈의 이름을 쓰시오.",
    answers: ["스텁", "Stub", "스텁(Stub)"],
    points: 5,
    explanation:
      "하향식은 스텁, 상향식은 드라이버다. 스텁은 불리는 쪽, 드라이버는 부르는 쪽을 흉내 낸다.",
    importance: "must",
  },
  {
    id: "pq-solid-ocp",
    subject: "design",
    sourceId: "d-solid",
    kind: "term",
    question:
      "'소프트웨어 개체는 확장에는 열려 있고 변경에는 닫혀 있어야 한다'는 객체지향 설계 원칙의 이름을 쓰시오.",
    answers: [
      "개방 폐쇄 원칙",
      "OCP",
      "Open-Closed Principle",
      "개방-폐쇄 원칙",
      "개방폐쇄원칙",
    ],
    points: 5,
    explanation: "OCP(Open-Closed Principle)다.",
    importance: "must",
  },
  {
    id: "pq-rbac",
    subject: "system",
    sourceId: "s-access-control",
    kind: "term",
    question:
      "사용자 개인이 아니라 직무(역할)에 권한을 부여하고, 사용자를 역할에 배정하는 접근 통제 모델의 약어를 쓰시오.",
    answers: ["RBAC", "역할 기반 접근 통제", "Role Based Access Control"],
    points: 5,
    explanation: "RBAC 다. DAC 는 소유자가, MAC 는 보안 등급이 정한다.",
    importance: "must",
  },
  {
    id: "pq-cohesion",
    subject: "design",
    sourceId: "d-coupling-cohesion",
    kind: "term",
    question:
      "모듈 내부의 구성 요소들이 하나의 기능을 수행하기 위해 밀접하게 관련된, 가장 바람직한 응집도의 이름을 쓰시오.",
    answers: ["기능적 응집도", "기능적", "Functional Cohesion", "기능 응집도"],
    points: 5,
    explanation:
      "기능적 응집도가 가장 높고 좋다. 응집도는 우연 → 논리 → 시간 → 절차 → 통신 → 순차 → 기능 순으로 높아진다.",
    importance: "must",
  },
  {
    id: "pq-mccabe",
    subject: "develop",
    sourceId: "v-complexity",
    kind: "term",
    question:
      "제어 흐름 그래프의 간선이 12개, 노드가 9개일 때 McCabe 의 순환 복잡도를 구하시오.",
    answers: ["5"],
    points: 5,
    explanation: "V(G) = E − N + 2 = 12 − 9 + 2 = 5 다.",
    importance: "must",
  },
  {
    id: "pq-eai",
    subject: "design",
    sourceId: "d-interface",
    kind: "term",
    question:
      "EAI 구축 유형 중 중앙에 허브를 두고 모든 시스템을 허브에 연결하는 방식의 이름을 쓰시오.",
    answers: ["Hub & Spoke", "Hub and Spoke", "허브 앤 스포크", "허브앤스포크"],
    points: 5,
    explanation: "Hub & Spoke 다. 허브가 죽으면 전체가 멈추는 것이 약점이다.",
    importance: "high",
  },
  {
    id: "pq-osi3",
    subject: "language",
    sourceId: "l-network-osi",
    kind: "term",
    question:
      "OSI 7계층 중 라우터가 동작하며 패킷의 경로를 결정하는 계층의 이름을 쓰시오.",
    answers: ["네트워크 계층", "네트워크", "Network Layer", "3계층", "제3계층"],
    points: 5,
    explanation: "네트워크 계층(3계층)이다. 스위치·브리지는 2계층이다.",
    importance: "must",
  },

  // ── 빈칸 ──────────────────────────────────────────────
  {
    id: "pq-blank-cocomo",
    subject: "system",
    sourceId: "s-estimation",
    kind: "blank",
    question:
      "COCOMO 모형의 세 가지 개발 유형 중 5만 라인 이하의 소규모 프로젝트에 해당하는 것은 ( ) 이다. 괄호에 들어갈 말을 쓰시오.",
    answers: ["조직형", "Organic", "조직형(Organic)"],
    points: 5,
    explanation:
      "조직형 5만 줄 이하, 반분리형 30만 줄 이하, 내장형 30만 줄 초과다.",
    importance: "must",
  },
  {
    id: "pq-blank-handshake",
    subject: "language",
    sourceId: "l-network-tcpip",
    kind: "blank",
    question:
      "TCP 의 연결 설정 과정은 SYN → ( ) → ACK 의 3단계로 이루어진다. 괄호에 들어갈 것을 쓰시오.",
    answers: ["SYN+ACK", "SYN/ACK", "SYN ACK", "SYN-ACK"],
    points: 5,
    explanation: "3-way handshake 는 SYN → SYN+ACK → ACK 다.",
    importance: "must",
  },
  {
    id: "pq-blank-cut",
    subject: "database",
    sourceId: "b-sql-join",
    kind: "blank",
    question:
      "GROUP BY 로 묶은 결과에 조건을 주어 그룹을 걸러 낼 때 사용하는 절은 ( ) 이다. 괄호에 들어갈 SQL 키워드를 쓰시오.",
    answers: ["HAVING"],
    points: 5,
    explanation: "WHERE 는 묶기 전 행을, HAVING 은 묶은 뒤 그룹을 거른다.",
    importance: "must",
  },

  // ── 코드 해석 ──────────────────────────────────────────
  {
    id: "pq-code-c-pointer",
    subject: "language",
    sourceId: "l-c-pointer",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 실행 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int *p = a;\n    int sum = 0;\n    for (int i = 0; i < 5; i += 2)\n        sum += *(p + i);\n    printf("%d", sum);\n    return 0;\n}',
    answers: ["9"],
    points: 5,
    explanation:
      "i 가 0, 2, 4 일 때 a[0]=1, a[2]=3, a[4]=5 를 더한다. 1 + 3 + 5 = 9 다.",
    importance: "must",
  },
  {
    id: "pq-code-c-recursion",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 실행 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 1);\n}\nint main() {\n    printf("%d", f(5));\n    return 0;\n}',
    answers: ["120"],
    points: 5,
    explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120 이다.",
    importance: "must",
  },
  {
    id: "pq-code-java-override",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 실행 결과를 쓰시오.",
    passage:
      "class Parent {\n    int x = 10;\n    int get() { return x; }\n}\nclass Child extends Parent {\n    int x = 20;\n    int get() { return x; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.print(p.x);\n        System.out.print(p.get());\n    }\n}",
    answers: ["1020"],
    points: 5,
    explanation:
      "필드는 참조 변수의 타입을 따르므로 p.x 는 Parent 의 10 이다. 메서드는 실제 객체를 따르므로 p.get() 은 Child 의 20 이다. 붙여 쓰면 1020 이다.",
    importance: "must",
  },
  {
    id: "pq-code-python-slice",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 프로그램의 실행 결과를 쓰시오.",
    passage: 'a = "INFORMATION"\nprint(a[2:5])\nprint(a[-3:])',
    answers: ["FOR\nION"],
    points: 5,
    explanation:
      'a[2:5] 는 2,3,4 번 자리라 "FOR" 이고, a[-3:] 은 뒤에서 세 글자라 "ION" 이다. 줄바꿈까지 그대로 적어야 한다.',
    importance: "must",
  },
  {
    id: "pq-code-python-loop",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 프로그램의 실행 결과를 쓰시오.",
    passage: "a = [3, 1, 4, 1, 5]\nb = set(a)\nprint(len(a), len(b))",
    answers: ["5 4"],
    points: 5,
    explanation:
      "리스트는 중복을 그대로 두어 5개, 집합은 중복을 없애 {1, 3, 4, 5} 로 4개다.",
    importance: "high",
  },
  {
    id: "pq-code-c-swap",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 실행 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nvoid swap(int *x, int *y) {\n    int t = *x; *x = *y; *y = t;\n}\nint main() {\n    int a = 7, b = 3;\n    swap(&a, &b);\n    printf("%d %d", a, b);\n    return 0;\n}',
    answers: ["3 7"],
    points: 5,
    explanation:
      "주소를 넘겼으므로 원본이 바뀐다. 값을 넘겼다면 7 3 그대로였을 것이다.",
    importance: "must",
  },

  // ── SQL ───────────────────────────────────────────────
  {
    id: "pq-sql-select",
    subject: "database",
    sourceId: "b-sql-join",
    kind: "sql",
    lang: "sql",
    question:
      "직원(EMP) 테이블에서 부서(DEPT)가 '개발'인 직원의 이름(NAME)을 조회하는 SQL 문을 쓰시오.",
    passage: "EMP(NO, NAME, DEPT, SALARY)",
    answers: [
      "SELECT NAME FROM EMP WHERE DEPT = '개발'",
      "SELECT NAME FROM EMP WHERE DEPT='개발';",
    ],
    points: 5,
    explanation:
      "대소문자·줄바꿈·세미콜론·따옴표 종류는 달라도 된다. 다만 조건을 빠뜨리면 틀린다.",
    importance: "must",
  },
  {
    id: "pq-sql-group",
    subject: "database",
    sourceId: "b-sql-join",
    kind: "sql",
    lang: "sql",
    question:
      "직원(EMP) 테이블에서 부서(DEPT)별 인원수를 구하되, 인원이 3명 이상인 부서만 부서명과 인원수를 조회하는 SQL 문을 쓰시오.",
    passage: "EMP(NO, NAME, DEPT, SALARY)",
    answers: [
      "SELECT DEPT, COUNT(*) FROM EMP GROUP BY DEPT HAVING COUNT(*) >= 3",
      "SELECT DEPT, COUNT(*) FROM EMP GROUP BY DEPT HAVING COUNT(*)>=3;",
    ],
    points: 10,
    explanation:
      "묶은 뒤 거르는 것이므로 WHERE 가 아니라 HAVING 을 쓴다. 집계 함수는 HAVING 에만 올 수 있다.",
    importance: "must",
  },
  {
    id: "pq-sql-grant",
    subject: "database",
    sourceId: "b-sql-ddl",
    kind: "sql",
    lang: "sql",
    question:
      "사용자 KIM 에게 EMP 테이블에 대한 SELECT 권한을 부여하는 SQL 문을 쓰시오.",
    answers: ["GRANT SELECT ON EMP TO KIM", "GRANT SELECT ON EMP TO KIM;"],
    points: 5,
    explanation: "권한 부여는 GRANT, 회수는 REVOKE 다. 둘 다 DCL 이다.",
    importance: "must",
  },
  {
    id: "pq-sql-alter",
    subject: "database",
    sourceId: "b-sql-ddl",
    kind: "sql",
    lang: "sql",
    question:
      "EMP 테이블에 문자형(가변 길이 20) 속성 EMAIL 을 추가하는 SQL 문을 쓰시오.",
    answers: [
      "ALTER TABLE EMP ADD EMAIL VARCHAR(20)",
      "ALTER TABLE EMP ADD EMAIL VARCHAR2(20)",
      "ALTER TABLE EMP ADD (EMAIL VARCHAR(20))",
      "ALTER TABLE EMP ADD COLUMN EMAIL VARCHAR(20)",
    ],
    points: 5,
    explanation:
      "ALTER TABLE ~ ADD 다. VARCHAR 와 VARCHAR2, 괄호 유무, COLUMN 키워드 유무는 모두 받아 준다.",
    importance: "high",
  },
];

export const PRACTICAL_QUESTIONS: PracticalQuestion[] = [
  ...BASE_PRACTICAL,
  ...PRACTICAL_MORE,
  ...PRACTICAL2_QUESTIONS,
  ...PRACTICAL_CODE,
];

export const PRACTICAL_MAP: Record<string, PracticalQuestion> =
  Object.fromEntries(PRACTICAL_QUESTIONS.map((q) => [q.id, q]));

export function practicalOf(subject?: SubjectId): PracticalQuestion[] {
  return subject
    ? PRACTICAL_QUESTIONS.filter((q) => q.subject === subject)
    : PRACTICAL_QUESTIONS;
}

/** 실기 한 벌의 만점 */
export function practicalMax(qs: PracticalQuestion[]): number {
  return qs.reduce((a, q) => a + q.points, 0);
}
