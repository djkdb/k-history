import type { PracticalQuestion } from "@/lib/types";

/**
 * 실기 보충 2 — 과목마다 고르게.
 *
 * 실기는 고르는 것이 아니라 적는다. answers 의 첫 번째가 모범 답안이고
 * 나머지는 같은 뜻으로 받아 줄 표기다. 채점기가 띄어쓰기와 대소문자,
 * 괄호 병기, 나열 순서를 흡수하므로 표기를 무리하게 늘리지 않는다.
 */
export const PRACTICAL2_QUESTIONS: PracticalQuestion[] = [
  // ── 소프트웨어 설계 ────────────────────────────────
  {
    id: "p2-uml-diagram",
    subject: "design",
    sourceId: "d-uml-basic",
    kind: "term",
    question:
      "객체 사이에 오가는 메시지를 시간 순서에 따라 표현하는 UML 다이어그램의 이름을 쓰시오.",
    answers: ["순차 다이어그램", "시퀀스 다이어그램", "Sequence Diagram"],
    points: 5,
    explanation:
      "순차(시퀀스) 다이어그램이다. 생명선·활성 구간·메시지로 그리는 행위 다이어그램이다.",
    importance: "must",
  },
  {
    id: "p2-usecase-include",
    subject: "design",
    sourceId: "d-usecase",
    kind: "blank",
    question:
      "유스케이스 관계에서 반드시 거쳐야 하는 공통 흐름은 ( ① ) 관계, 조건이 맞을 때만 덧붙는 흐름은 ( ② ) 관계로 나타낸다. ①과 ②를 쓰시오.",
    answers: [
      "① 포함 ② 확장",
      "포함, 확장",
      "include, extend",
      "① include ② extend",
    ],
    points: 5,
    explanation:
      "include 는 반드시 포함되는 흐름, extend 는 조건부로 덧붙는 흐름이다. 시험은 이 둘을 바꿔 낸다.",
    importance: "must",
  },
  {
    id: "p2-pattern-singleton",
    subject: "design",
    sourceId: "d-pattern-creational",
    kind: "term",
    question:
      "클래스의 인스턴스가 오직 하나만 만들어지도록 보장하고, 어디서든 그 하나에 접근하게 하는 디자인 패턴을 쓰시오.",
    answers: ["싱글톤", "Singleton", "싱글턴", "싱글톤 패턴"],
    points: 5,
    explanation:
      "싱글톤 패턴이다. 설정·연결 풀처럼 하나만 있어야 하는 것에 쓴다.",
    importance: "must",
  },
  {
    id: "p2-pattern-facade",
    subject: "design",
    sourceId: "d-pattern-structural",
    kind: "term",
    question:
      "복잡한 하위 시스템들을 감싸 하나의 단순한 창구만 밖으로 내보이는 구조 패턴을 쓰시오.",
    answers: ["퍼사드", "Facade", "파사드", "퍼사드 패턴"],
    points: 5,
    explanation:
      "퍼사드 패턴이다. 클라이언트가 안쪽의 여러 클래스를 일일이 알 필요가 없어진다.",
    importance: "high",
  },
  {
    id: "p2-solid-all",
    subject: "design",
    sourceId: "d-solid",
    kind: "term",
    question: "객체지향 설계 원칙 SOLID 의 다섯 가지를 모두 쓰시오.",
    answers: [
      "단일 책임 원칙·개방 폐쇄 원칙·리스코프 치환 원칙·인터페이스 분리 원칙·의존 역전 원칙",
      "SRP·OCP·LSP·ISP·DIP",
      "단일 책임·개방 폐쇄·리스코프 치환·인터페이스 분리·의존 역전",
    ],
    points: 5,
    explanation: "SRP, OCP, LSP, ISP, DIP 다. 앞글자를 모아 SOLID 라 부른다.",
    importance: "must",
  },
  {
    id: "p2-coupling-worst",
    subject: "design",
    sourceId: "d-coupling-cohesion",
    kind: "term",
    question:
      "한 모듈이 다른 모듈의 내부 자료나 기능을 직접 참조하거나 고치는, 가장 나쁜 결합도를 쓰시오.",
    answers: ["내용 결합도", "Content Coupling", "내용결합도"],
    points: 5,
    explanation:
      "내용 결합도다. 결합도는 자료 < 스탬프 < 제어 < 외부 < 공통 < 내용 순으로 나빠진다.",
    importance: "must",
  },
  {
    id: "p2-arch-mvc-blank",
    subject: "design",
    sourceId: "d-architecture",
    kind: "blank",
    question:
      "MVC 에서 자료와 업무 규칙을 담는 것은 ( ① ), 화면에 보여 주는 것은 ( ② ), 입력을 받아 둘을 잇는 것은 ( ③ )이다. ①~③을 쓰시오.",
    answers: [
      "① 모델 ② 뷰 ③ 컨트롤러",
      "모델, 뷰, 컨트롤러",
      "Model, View, Controller",
      "① Model ② View ③ Controller",
    ],
    points: 5,
    explanation: "모델·뷰·컨트롤러다. 앞글자를 따 MVC 라 한다.",
    importance: "must",
  },
  {
    id: "p2-ui-wireframe",
    subject: "design",
    sourceId: "d-ui",
    kind: "term",
    question:
      "화면 단위의 배치를 선으로만 간단히 그려, 어디에 무엇이 놓일지를 정하는 UI 설계 산출물을 쓰시오.",
    answers: ["와이어프레임", "Wireframe", "와이어 프레임"],
    points: 5,
    explanation:
      "와이어프레임이다. 실제 화면처럼 꾸민 정적 산출물은 목업, 눌러 볼 수 있게 만든 것은 프로토타입이다.",
    importance: "high",
  },
  {
    id: "p2-middleware-was",
    subject: "design",
    sourceId: "d-interface",
    kind: "term",
    question:
      "웹 서버와 데이터베이스 사이에서 프로그램을 실행해 동적인 결과를 만들어 주는 미들웨어를 쓰시오.",
    answers: [
      "WAS",
      "Web Application Server",
      "웹 애플리케이션 서버",
      "WAS(Web Application Server)",
    ],
    points: 5,
    explanation:
      "WAS 다. 웹 서버가 정적 파일을 내보내는 사이, WAS 는 프로그램을 실행한다.",
    importance: "high",
  },
  {
    id: "p2-req-kind",
    subject: "design",
    sourceId: "d-requirement",
    kind: "blank",
    question:
      "시스템이 무엇을 해야 하는가를 적은 것은 ( ① ) 요구사항, 성능·보안·사용성처럼 어떻게 동작해야 하는가를 적은 것은 ( ② ) 요구사항이다. ①과 ②를 쓰시오.",
    answers: [
      "① 기능 ② 비기능",
      "기능, 비기능",
      "기능적, 비기능적",
      "Functional, Non-functional",
    ],
    points: 5,
    explanation:
      "기능 요구사항과 비기능 요구사항이다. 응답 시간·동시 접속자 수는 비기능 쪽이다.",
    importance: "must",
  },
  {
    id: "p2-agile-values",
    subject: "design",
    sourceId: "d-agile",
    kind: "term",
    question: "XP(eXtreme Programming)의 다섯 가지 가치를 모두 쓰시오.",
    answers: [
      "용기·단순성·의사소통·피드백·존중",
      "의사소통·단순성·피드백·용기·존중",
      "Communication·Simplicity·Feedback·Courage·Respect",
    ],
    points: 5,
    explanation:
      "용기·단순성·의사소통·피드백·존중이다. 문서화는 XP 의 가치가 아니다 — 자주 함정으로 나온다.",
    importance: "must",
  },

  // ── 소프트웨어 개발 ────────────────────────────────
  {
    id: "p2-stack-lifo",
    subject: "develop",
    sourceId: "v-datastructure",
    kind: "blank",
    question:
      "나중에 넣은 것이 먼저 나오는 자료 구조는 ( ① ), 먼저 넣은 것이 먼저 나오는 자료 구조는 ( ② )이다. ①과 ②를 쓰시오.",
    answers: ["① 스택 ② 큐", "스택, 큐", "Stack, Queue", "① Stack ② Queue"],
    points: 5,
    explanation:
      "스택은 LIFO, 큐는 FIFO 다. 함수 호출은 스택, 작업 대기열은 큐를 쓴다.",
    importance: "must",
  },
  {
    id: "p2-postfix",
    subject: "develop",
    sourceId: "v-datastructure",
    kind: "blank",
    question: "중위 표기식 A + B * C 를 후위 표기식으로 바꿔 쓰시오.",
    answers: ["A B C * +", "ABC*+", "A B C * + "],
    points: 5,
    explanation: "곱셈이 먼저이므로 B C * 를 묶고 A 와 더한다 → A B C * + 다.",
    importance: "must",
  },
  {
    id: "p2-tree-pre",
    subject: "develop",
    sourceId: "v-tree",
    kind: "blank",
    question: "다음 이진 트리를 전위 순회(Pre-order)한 결과를 쓰시오.",
    passage:
      "        A\n      /   \\\n     B     C\n    / \\     \\\n   D   E     F",
    answers: ["A B D E C F", "A, B, D, E, C, F", "ABDECF"],
    points: 5,
    explanation:
      "전위는 루트 → 왼쪽 → 오른쪽이다. A, 왼쪽 가지 B D E, 오른쪽 가지 C F 순이다.",
    importance: "must",
  },
  {
    id: "p2-sort-insert",
    subject: "develop",
    sourceId: "v-sort",
    kind: "term",
    question:
      "정렬된 앞부분에 새 자료를 알맞은 자리에 끼워 넣는 일을 되풀이하는 정렬 방법의 이름을 쓰시오.",
    answers: ["삽입 정렬", "Insertion Sort", "삽입정렬"],
    points: 5,
    explanation:
      "삽입 정렬이다. 이미 거의 정렬된 자료에는 매우 빠르지만 평균은 O(n²)이다.",
    importance: "high",
  },
  {
    id: "p2-coverage",
    subject: "develop",
    sourceId: "v-test-technique",
    kind: "blank",
    question:
      "화이트박스 테스트에서 모든 문장을 한 번씩 실행하는 것은 ( ① ) 커버리지, 모든 분기의 참·거짓을 한 번씩 보는 것은 ( ② ) 커버리지다. ①과 ②를 쓰시오.",
    answers: ["① 구문 ② 결정", "구문, 결정", "문장, 분기", "① 문장 ② 분기"],
    points: 5,
    explanation:
      "구문(문장) 커버리지와 결정(분기) 커버리지다. 구문이 더 약한 기준이다.",
    importance: "must",
  },
  {
    id: "p2-test-boundary",
    subject: "develop",
    sourceId: "v-test-technique",
    kind: "term",
    question:
      "입력 구간의 경계와 그 바로 앞뒤 값을 골라 시험하는 블랙박스 테스트 기법을 쓰시오.",
    answers: [
      "경계값 분석",
      "Boundary Value Analysis",
      "경계값분석",
      "한계값 분석",
    ],
    points: 5,
    explanation:
      "경계값 분석이다. 결함은 구간 한가운데보다 경계에서 훨씬 자주 나온다.",
    importance: "must",
  },
  {
    id: "p2-baseline",
    subject: "develop",
    sourceId: "v-scm",
    kind: "term",
    question:
      "형상 관리에서 특정 시점의 산출물을 공식적으로 확정해 두고, 이후 변경은 절차를 거쳐야만 허용하는 기준선을 무엇이라 하는가?",
    answers: ["베이스라인", "Baseline", "기준선", "베이스라인(Baseline)"],
    points: 5,
    explanation:
      "베이스라인이다. 확정한 뒤에는 형상 통제 절차를 거쳐야 바꿀 수 있다.",
    importance: "must",
  },
  {
    id: "p2-cyclomatic",
    subject: "develop",
    sourceId: "v-complexity",
    kind: "blank",
    question:
      "제어 흐름 그래프의 간선이 14개, 노드가 10개일 때 순환 복잡도 V(G)를 구하시오.",
    answers: ["6", "6개", "V(G)=6"],
    points: 5,
    explanation: "V(G) = 간선 - 노드 + 2 = 14 - 10 + 2 = 6 이다.",
    importance: "must",
  },
  {
    id: "p2-error-terms",
    subject: "develop",
    sourceId: "v-test-level",
    kind: "blank",
    question:
      "사람이 저지른 실수는 ( ① ), 그로 인해 코드에 남은 잘못은 ( ② ), 그 때문에 실제로 잘못 동작하는 것은 ( ③ )이라 한다. ①~③을 쓰시오.",
    answers: [
      "① 에러 ② 결함 ③ 장애",
      "에러, 결함, 장애",
      "Error, Defect, Failure",
      "① Error ② Defect ③ Failure",
    ],
    points: 5,
    explanation: "에러 → 결함(버그) → 장애 순이다. 결함은 Fault 라고도 한다.",
    importance: "high",
  },
  {
    id: "p2-code-java-array",
    subject: "develop",
    sourceId: "v-sort",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      "public class Main {\n    public static void main(String[] args) {\n        int[] a = {3, 1, 4, 1, 5};\n        for (int i = 0; i < a.length - 1; i++)\n            for (int j = 0; j < a.length - 1 - i; j++)\n                if (a[j] > a[j+1]) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }\n        for (int x : a) System.out.print(x);\n    }\n}",
    answers: ["11345"],
    points: 5,
    explanation:
      "버블 정렬로 오름차순 정렬한 뒤 붙여 찍는다. 3 1 4 1 5 → 1 1 3 4 5 다.",
    importance: "must",
  },

  // ── 데이터베이스 구축 ──────────────────────────────
  {
    id: "p2-1nf",
    subject: "database",
    sourceId: "b-normalization",
    kind: "term",
    question:
      "릴레이션의 모든 속성이 더 이상 나눌 수 없는 원자값만 갖도록 한 정규형을 쓰시오.",
    answers: ["제1정규형", "1NF", "1정규형", "제1정규형(1NF)"],
    points: 5,
    explanation: "제1정규형이다. 한 칸에 값이 하나만 들어가야 한다.",
    importance: "must",
  },
  {
    id: "p2-3nf",
    subject: "database",
    sourceId: "b-normalization",
    kind: "term",
    question:
      "A→B 이고 B→C 일 때 A→C 가 성립하는 이행 함수 종속을 제거하면 도달하는 정규형을 쓰시오.",
    answers: ["제3정규형", "3NF", "3정규형", "제3정규형(3NF)"],
    points: 5,
    explanation:
      "제3정규형이다. 부분 종속을 없앤 것이 제2정규형, 그다음이 이행 종속이다.",
    importance: "must",
  },
  {
    id: "p2-integrity-three",
    subject: "database",
    sourceId: "b-integrity",
    kind: "blank",
    question:
      "기본키가 NULL 일 수 없다는 것은 ( ① ) 무결성, 외래키가 참조하는 값이 실제로 있어야 한다는 것은 ( ② ) 무결성이다. ①과 ②를 쓰시오.",
    answers: [
      "① 개체 ② 참조",
      "개체, 참조",
      "Entity, Referential",
      "① Entity ② Referential",
    ],
    points: 5,
    explanation:
      "개체 무결성과 참조 무결성이다. 값의 범위를 제한하는 것은 도메인 무결성이다.",
    importance: "must",
  },
  {
    id: "p2-dirty-read",
    subject: "database",
    sourceId: "b-concurrency",
    kind: "term",
    question:
      "아직 커밋되지 않은 다른 트랜잭션의 변경 내용을 읽어 버리는 문제를 무엇이라 하는가?",
    answers: ["Dirty Read", "더티 리드", "오손 읽기", "Dirty Read(더티 리드)"],
    points: 5,
    explanation:
      "더티 리드다. 읽고 난 뒤 상대가 롤백하면 있지도 않았던 값을 읽은 셈이 된다.",
    importance: "must",
  },
  {
    id: "p2-sql-insert",
    subject: "database",
    sourceId: "b-sql-ddl",
    kind: "sql",
    question:
      "학생 테이블에 학번 2026001, 이름 '김민준', 학과 '컴퓨터' 인 행을 넣는 SQL 문을 작성하시오.",
    passage: "학생(학번, 이름, 학과, 학년)",
    answers: [
      "INSERT INTO 학생(학번, 이름, 학과) VALUES(2026001, '김민준', '컴퓨터');",
      "insert into 학생 (학번,이름,학과) values (2026001,'김민준','컴퓨터')",
    ],
    points: 5,
    explanation:
      "INSERT INTO 테이블(열목록) VALUES(값목록) 이다. 적지 않은 학년에는 NULL 이 들어간다.",
    importance: "must",
  },
  {
    id: "p2-sql-update",
    subject: "database",
    sourceId: "b-sql-ddl",
    kind: "sql",
    question:
      "사원 테이블에서 부서가 '개발'인 사원의 급여를 10% 올리는 SQL 문을 작성하시오.",
    passage: "사원(사번, 이름, 부서, 급여)",
    answers: [
      "UPDATE 사원 SET 급여 = 급여 * 1.1 WHERE 부서 = '개발';",
      "update 사원 set 급여=급여*1.1 where 부서='개발'",
    ],
    points: 5,
    explanation:
      "UPDATE ~ SET ~ WHERE 다. WHERE 를 빠뜨리면 모든 행이 바뀌므로 반드시 붙인다.",
    importance: "must",
  },
  {
    id: "p2-sql-count",
    subject: "database",
    sourceId: "b-sql-join",
    kind: "sql",
    question:
      "사원 테이블에서 부서별 사원 수를 부서 이름과 함께 조회하는 SQL 문을 작성하시오.",
    passage: "사원(사번, 이름, 부서, 급여)",
    answers: [
      "SELECT 부서, COUNT(*) FROM 사원 GROUP BY 부서;",
      "select 부서, count(*) from 사원 group by 부서",
    ],
    points: 5,
    explanation:
      "묶는 기준을 GROUP BY 에 적고, SELECT 에는 그 기준과 집계 함수만 쓸 수 있다.",
    importance: "must",
  },
  {
    id: "p2-sql-view",
    subject: "database",
    sourceId: "b-index-view",
    kind: "sql",
    question:
      "사원 테이블에서 부서가 '개발'인 사원의 사번과 이름만 보여 주는 뷰 개발자를 만드는 SQL 문을 작성하시오.",
    passage: "사원(사번, 이름, 부서, 급여)",
    answers: [
      "CREATE VIEW 개발자 AS SELECT 사번, 이름 FROM 사원 WHERE 부서 = '개발';",
      "create view 개발자 as select 사번,이름 from 사원 where 부서='개발'",
    ],
    points: 5,
    explanation:
      "CREATE VIEW ~ AS SELECT 다. 뷰는 ALTER 로 고칠 수 없어 바꾸려면 DROP 하고 다시 만든다.",
    importance: "must",
  },
  {
    id: "p2-cap",
    subject: "database",
    sourceId: "b-nosql",
    kind: "term",
    question: "분산 시스템의 CAP 이론에서 말하는 세 가지를 모두 쓰시오.",
    answers: [
      "일관성·가용성·분할 내성",
      "Consistency·Availability·Partition tolerance",
      "일관성, 가용성, 분단 내성",
    ],
    points: 5,
    explanation:
      "일관성·가용성·분할 내성이며, 셋을 동시에 만족할 수는 없다는 것이 CAP 이론이다.",
    importance: "high",
  },

  // ── 프로그래밍 언어 활용 ───────────────────────────
  {
    id: "p2-code-c-fib",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int a = 0, b = 1, c, i;\n    for (i = 0; i < 5; i++) {\n        printf("%d ", a);\n        c = a + b;\n        a = b;\n        b = c;\n    }\n    return 0;\n}',
    answers: ["0 1 1 2 3"],
    points: 5,
    explanation:
      "피보나치 수열을 다섯 개 찍는다. 0, 1, 1, 2, 3 이며 각 수 뒤에 공백이 하나씩 붙는다.",
    importance: "must",
  },
  {
    id: "p2-code-c-ptr-array",
    subject: "language",
    sourceId: "l-c-pointer",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int a[5] = {10, 20, 30, 40, 50};\n    int *p = a + 1;\n    printf("%d %d", *p, *(p + 2));\n    return 0;\n}',
    answers: ["20 40"],
    points: 5,
    explanation:
      "p 는 a[1]을 가리키므로 *p 는 20, *(p+2) 는 a[3]인 40 이다. 포인터에 더하는 수는 원소 개수다.",
    importance: "must",
  },
  {
    id: "p2-code-java-inherit",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      "class A {\n    int f() { return 10; }\n}\nclass B extends A {\n    int f() { return 20; }\n    int g() { return super.f() + f(); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(new B().g());\n    }\n}",
    answers: ["30"],
    points: 5,
    explanation:
      "super.f() 는 상위 A 의 것이라 10, f() 는 오버라이딩된 B 의 것이라 20 이다. 합은 30 이다.",
    importance: "must",
  },
  {
    id: "p2-code-python-comp",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "a = [1, 2, 3, 4, 5]\nb = [x * x for x in a if x % 2 == 1]\nprint(b)",
    answers: ["[1, 9, 25]"],
    points: 5,
    explanation:
      "홀수 1, 3, 5 만 골라 제곱한다. 리스트 컴프리헨션의 조건은 뒤에 붙는다.",
    importance: "must",
  },
  {
    id: "p2-code-python-dict2",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "d = {}\nfor c in 'banana':\n    d[c] = d.get(c, 0) + 1\nprint(d['a'], d['n'], d['b'])",
    answers: ["3 2 1"],
    points: 5,
    explanation:
      "banana 에서 a 는 3번, n 은 2번, b 는 1번 나온다. get(키, 기본값) 은 없는 키에 기본값을 준다.",
    importance: "high",
  },
  {
    id: "p2-os-deadlock-avoid",
    subject: "language",
    sourceId: "l-os-scheduling",
    kind: "term",
    question:
      "자원을 주기 전에 그 뒤로도 안전한 상태가 유지되는지 따져 보고 결정하는 교착 상태 회피 알고리즘의 이름을 쓰시오.",
    answers: [
      "은행가 알고리즘",
      "Banker's Algorithm",
      "뱅커스 알고리즘",
      "은행원 알고리즘",
    ],
    points: 5,
    explanation:
      "은행가 알고리즘이다. 예방이 아니라 회피에 속한다 — 시험은 이 구분을 묻는다.",
    importance: "must",
  },
  {
    id: "p2-os-paging",
    subject: "language",
    sourceId: "l-os-memory",
    kind: "blank",
    question:
      "가상 기억 장치에서 크기가 같은 블록으로 나누는 기법은 ( ① ), 논리적 단위로 크기가 다르게 나누는 기법은 ( ② )이다. ①과 ②를 쓰시오.",
    answers: [
      "① 페이징 ② 세그먼테이션",
      "페이징, 세그먼테이션",
      "Paging, Segmentation",
      "① Paging ② Segmentation",
    ],
    points: 5,
    explanation: "페이징은 내부 단편화가, 세그먼테이션은 외부 단편화가 생긴다.",
    importance: "must",
  },
  {
    id: "p2-os-thrashing",
    subject: "language",
    sourceId: "l-os-memory",
    kind: "term",
    question:
      "프로세스가 실행보다 페이지 교체에 더 많은 시간을 쓰게 되어 전체 성능이 급격히 떨어지는 현상을 쓰시오.",
    answers: ["스래싱", "Thrashing", "쓰래싱", "스레싱"],
    points: 5,
    explanation:
      "스래싱이다. 작업 집합(Working Set)을 관리하거나 다중 프로그래밍 정도를 낮춰 막는다.",
    importance: "must",
  },
  {
    id: "p2-osi-layers",
    subject: "language",
    sourceId: "l-network-osi",
    kind: "term",
    question: "OSI 7계층을 1계층부터 순서대로 모두 쓰시오.",
    answers: [
      "물리·데이터 링크·네트워크·전송·세션·표현·응용",
      "Physical·Data Link·Network·Transport·Session·Presentation·Application",
      "물리, 데이터링크, 네트워크, 전송, 세션, 표현, 응용",
    ],
    points: 5,
    explanation:
      "물리 → 데이터 링크 → 네트워크 → 전송 → 세션 → 표현 → 응용 순이다.",
    importance: "must",
  },
  {
    id: "p2-arp",
    subject: "language",
    sourceId: "l-network-tcpip",
    kind: "term",
    question: "IP 주소를 물리 주소(MAC)로 바꿔 주는 프로토콜을 쓰시오.",
    answers: ["ARP", "Address Resolution Protocol", "ARP(주소 결정 프로토콜)"],
    points: 5,
    explanation: "ARP 는 IP → MAC, RARP 는 그 반대다.",
    importance: "must",
  },

  // ── 정보시스템 구축 관리 ───────────────────────────
  {
    id: "p2-fp",
    subject: "system",
    sourceId: "s-estimation",
    kind: "term",
    question:
      "사용자 관점의 기능 개수를 세어 소프트웨어 규모를 산정하는 기법의 이름을 쓰시오.",
    answers: ["기능 점수", "Function Point", "FP", "기능점수(FP)"],
    points: 5,
    explanation:
      "기능 점수(FP)다. 외부 입력·출력·조회, 내부 논리 파일, 외부 인터페이스 파일 다섯 가지를 센다.",
    importance: "must",
  },
  {
    id: "p2-delphi",
    subject: "system",
    sourceId: "s-estimation",
    kind: "term",
    question:
      "여러 전문가의 의견을 익명으로 모으고 되풀이해 합의에 이르게 하는 비용 산정 기법을 쓰시오.",
    answers: ["델파이 기법", "Delphi", "델파이", "델파이(Delphi) 기법"],
    points: 5,
    explanation:
      "델파이 기법이다. 목소리 큰 사람에게 끌려가는 것을 막으려고 익명으로 모은다.",
    importance: "high",
  },
  {
    id: "p2-xss",
    subject: "system",
    sourceId: "s-security-attack",
    kind: "term",
    question:
      "게시판 등에 악성 스크립트를 올려 두고, 그 글을 읽는 다른 사용자의 브라우저에서 실행되게 하는 공격을 쓰시오.",
    answers: [
      "XSS",
      "크로스사이트 스크립팅",
      "Cross Site Scripting",
      "XSS(크로스사이트 스크립팅)",
    ],
    points: 5,
    explanation:
      "크로스사이트 스크립팅(XSS)이다. 출력할 때 특수문자를 바꿔(이스케이프) 막는다.",
    importance: "must",
  },
  {
    id: "p2-csrf",
    subject: "system",
    sourceId: "s-security-attack",
    kind: "term",
    question:
      "로그인한 사용자가 자신도 모르게 공격자가 의도한 요청을 서버에 보내게 만드는 공격을 쓰시오.",
    answers: [
      "CSRF",
      "크로스사이트 요청 위조",
      "Cross Site Request Forgery",
      "사이트 간 요청 위조",
    ],
    points: 5,
    explanation:
      "CSRF 다. XSS 가 스크립트를 심는 것이라면 CSRF 는 이미 가진 권한을 몰래 쓰게 만든다.",
    importance: "must",
  },
  {
    id: "p2-pki-sign",
    subject: "system",
    sourceId: "s-security-crypto",
    kind: "blank",
    question:
      "전자 서명은 보내는 사람의 ( ① )키로 서명하고, 받는 사람은 보낸 이의 ( ② )키로 확인한다. ①과 ②를 쓰시오.",
    answers: [
      "① 개인 ② 공개",
      "개인, 공개",
      "Private, Public",
      "① Private ② Public",
    ],
    points: 5,
    explanation:
      "서명은 개인키, 확인은 공개키다. 암호화는 반대로 상대의 공개키로 걸고 자기 개인키로 푼다.",
    importance: "must",
  },
  {
    id: "p2-mac-dac",
    subject: "system",
    sourceId: "s-access-control",
    kind: "blank",
    question:
      "자원의 소유자가 재량으로 권한을 주는 접근 통제는 ( ① ), 보안 등급에 따라 시스템이 강제로 막는 접근 통제는 ( ② )이다. ①과 ②를 쓰시오.",
    answers: ["① DAC ② MAC", "DAC, MAC", "임의 접근 통제, 강제 접근 통제"],
    points: 5,
    explanation:
      "DAC(임의 접근 통제)와 MAC(강제 접근 통제)다. 역할에 묶는 것은 RBAC 다.",
    importance: "must",
  },
  {
    id: "p2-cloud-paas",
    subject: "system",
    sourceId: "s-software-new",
    kind: "term",
    question:
      "클라우드 서비스 유형 중 운영체제와 실행 환경까지 제공받고 응용 프로그램만 올려 쓰는 것을 쓰시오.",
    answers: ["PaaS", "Platform as a Service", "PaaS(Platform as a Service)"],
    points: 5,
    explanation:
      "PaaS 다. 인프라만 주는 것은 IaaS, 완성된 소프트웨어까지 주는 것은 SaaS 다.",
    importance: "must",
  },
  {
    id: "p2-msa",
    subject: "system",
    sourceId: "s-software-new",
    kind: "term",
    question:
      "하나의 큰 응용 프로그램을 작고 독립적인 서비스로 나누어 따로 배포하고 확장하는 구조를 쓰시오.",
    answers: [
      "마이크로서비스 아키텍처",
      "MSA",
      "Microservice Architecture",
      "마이크로서비스",
    ],
    points: 5,
    explanation:
      "MSA 다. 서비스마다 따로 배포·확장할 수 있는 대신 서비스 사이의 통신과 운영이 복잡해진다.",
    importance: "must",
  },
  {
    id: "p2-raid5",
    subject: "system",
    sourceId: "s-raid-backup",
    kind: "blank",
    question:
      "데이터를 나눠 쓰기만 하고 중복이 없는 것은 RAID ( ① ), 같은 데이터를 두 디스크에 똑같이 쓰는 것은 RAID ( ② )이다. ①과 ②를 쓰시오.",
    answers: ["① 0 ② 1", "0, 1", "RAID 0, RAID 1"],
    points: 5,
    explanation:
      "RAID 0 은 스트라이핑, RAID 1 은 미러링이다. 패리티를 분산 저장하는 것은 RAID 5 다.",
    importance: "must",
  },
  {
    id: "p2-rto-rpo",
    subject: "system",
    sourceId: "s-raid-backup",
    kind: "blank",
    question:
      "장애가 난 뒤 복구까지 걸리는 목표 시간은 ( ① ), 어느 시점의 데이터까지 되살릴 것인가는 ( ② )이다. ①과 ②를 쓰시오.",
    answers: ["① RTO ② RPO", "RTO, RPO"],
    points: 5,
    explanation:
      "RTO(Recovery Time Objective)와 RPO(Recovery Point Objective)다. 시험은 이 둘을 바꿔 낸다.",
    importance: "must",
  },
  {
    id: "p2-secure-error",
    subject: "system",
    sourceId: "s-secure-coding",
    kind: "term",
    question:
      "오류 메시지에 데이터베이스 구조나 파일 경로를 그대로 드러내는 취약점이 속하는 시큐어 코딩 항목을 쓰시오.",
    answers: ["에러 처리", "Error Handling", "에러처리", "오류 처리"],
    points: 5,
    explanation:
      "에러 처리 항목이다. 오류 메시지는 공격자에게 지도를 그려 주는 것과 같으므로 자세한 내용은 로그에만 남긴다.",
    importance: "high",
  },
];
