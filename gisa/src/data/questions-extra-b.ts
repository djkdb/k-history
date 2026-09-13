import type { WrittenQuestion } from "@/lib/types";

/** 보충 문항 — 3과목 데이터베이스 · 4과목 프로그래밍 언어 */
export const EXTRA_B_QUESTIONS: WrittenQuestion[] = [
  // ── 3과목 · 데이터베이스 구축 ───────────────────────
  {
    id: "qb-norm-bcnf",
    subject: "database",
    sourceId: "b-normalization",
    question: "BCNF(보이스-코드 정규형)의 조건으로 옳은 것은?",
    options: [
      "모든 속성이 원자값을 가져야 한다.",
      "부분 함수 종속이 없어야 한다.",
      "모든 결정자가 후보키여야 한다.",
      "조인 종속이 없어야 한다.",
    ],
    answerIndex: 2,
    explanation:
      "BCNF 는 결정자이면서 후보키가 아닌 것을 허용하지 않는다. 제3정규형보다 한 걸음 더 엄격하다.",
    optionNotes: [
      "원자값은 제1정규형의 조건이다.",
      "부분 종속 제거는 제2정규형이다.",
      null,
      "조인 종속 제거는 제5정규형이다.",
    ],
    importance: "must",
  },
  {
    id: "qb-anomaly-kind",
    subject: "database",
    sourceId: "b-anomaly",
    question:
      "릴레이션에서 한 튜플을 지웠을 때 의도하지 않은 다른 정보까지 함께 사라지는 현상은?",
    options: ["삽입 이상", "삭제 이상", "갱신 이상", "종속 이상"],
    answerIndex: 1,
    explanation:
      "삭제 이상이다. 이상 현상은 삽입·삭제·갱신 세 가지이며, 정규화로 없앤다.",
    optionNotes: [
      "삽입 이상은 넣고 싶지 않은 값까지 넣어야 하는 것이다.",
      null,
      "갱신 이상은 한쪽만 고쳐 값이 어긋나는 것이다.",
      "종속 이상이라는 말은 쓰지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "qb-key-kinds",
    subject: "database",
    sourceId: "b-key",
    question: "후보키(Candidate Key)가 반드시 만족해야 하는 성질은?",
    options: [
      "유일성과 최소성",
      "유일성만",
      "최소성만",
      "참조 무결성",
    ],
    answerIndex: 0,
    explanation:
      "후보키는 튜플을 하나로 가려내는 유일성과, 속성을 하나라도 빼면 유일성이 깨지는 최소성을 함께 갖춰야 한다. 슈퍼키는 유일성만 있으면 된다.",
    optionNotes: [
      null,
      "유일성만 있는 것은 슈퍼키다.",
      "최소성만으로는 키가 되지 못한다.",
      "참조 무결성은 외래키가 지켜야 하는 규칙이다.",
    ],
    importance: "must",
  },
  {
    id: "qb-integrity-ref",
    subject: "database",
    sourceId: "b-integrity",
    question: "참조 무결성 제약 조건에 대한 설명으로 옳은 것은?",
    options: [
      "기본키는 NULL 을 가질 수 없다.",
      "외래키 값은 참조하는 릴레이션의 기본키 값이거나 NULL 이어야 한다.",
      "속성값은 반드시 정의된 도메인에 속해야 한다.",
      "한 릴레이션에는 중복된 튜플이 있을 수 없다.",
    ],
    answerIndex: 1,
    explanation:
      "참조 무결성은 외래키가 가리키는 곳이 실제로 있어야 한다는 규칙이다. 첫 번째 보기는 개체 무결성이다.",
    optionNotes: [
      "이것은 개체 무결성이다.",
      null,
      "이것은 도메인 무결성이다.",
      "이것도 개체 무결성이 보장하는 결과다.",
    ],
    importance: "must",
  },
  {
    id: "qb-join-outer",
    subject: "database",
    sourceId: "b-sql-join",
    question:
      "왼쪽 테이블의 행은 모두 남기고, 오른쪽에 짝이 없으면 NULL 로 채우는 조인은?",
    options: ["INNER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "SELF JOIN"],
    answerIndex: 1,
    explanation:
      "LEFT OUTER JOIN 이다. INNER JOIN 은 양쪽에 짝이 있는 행만 남긴다.",
    optionNotes: [
      "INNER JOIN 은 짝이 없는 행을 버린다.",
      null,
      "CROSS JOIN 은 모든 조합을 만든다.",
      "SELF JOIN 은 같은 테이블을 자기 자신과 잇는다.",
    ],
    importance: "must",
  },
  {
    id: "qb-index-btree",
    subject: "database",
    sourceId: "b-index-view",
    question: "인덱스에 대한 설명으로 옳지 않은 것은?",
    options: [
      "검색 속도를 높이기 위해 따로 만들어 두는 자료 구조다.",
      "INSERT·UPDATE·DELETE 가 잦으면 오히려 부담이 될 수 있다.",
      "값의 종류가 적은 열일수록 인덱스 효과가 크다.",
      "관계형 DBMS 는 주로 B-트리 계열 인덱스를 쓴다.",
    ],
    answerIndex: 2,
    explanation:
      "값의 종류가 적으면(성별처럼) 인덱스를 타도 걸러지는 행이 많아 효과가 작다. 값이 고르게 흩어진 열일수록 효과가 크다.",
    optionNotes: [null, null, "정답. 반대로 말한 보기다.", null],
    importance: "high",
  },
  {
    id: "qb-schema-three",
    subject: "database",
    sourceId: "b-schema",
    question: "3단계 스키마 중 데이터베이스 전체의 논리적 구조를 정의하는 것은?",
    options: ["외부 스키마", "개념 스키마", "내부 스키마", "물리 스키마"],
    answerIndex: 1,
    explanation:
      "개념 스키마는 조직 전체의 논리적 구조다. 외부 스키마는 사용자·응용마다의 관점, 내부 스키마는 실제 저장 구조다.",
    optionNotes: [
      "외부 스키마는 사용자 관점이다.",
      null,
      "내부 스키마는 물리적 저장 구조다.",
      "3단계 스키마에서 부르는 이름은 내부 스키마다.",
    ],
    importance: "must",
  },
  {
    id: "qb-nosql-cap",
    subject: "database",
    sourceId: "b-nosql",
    question: "CAP 이론에서 말하는 세 가지에 해당하지 않는 것은?",
    options: ["일관성(Consistency)", "가용성(Availability)", "분할 내성(Partition tolerance)", "원자성(Atomicity)"],
    answerIndex: 3,
    explanation:
      "CAP 은 일관성·가용성·분할 내성이며 셋을 동시에 만족할 수 없다는 이론이다. 원자성은 트랜잭션 성질(ACID)의 하나다.",
    optionNotes: [null, null, null, "정답. 원자성은 ACID 쪽이다."],
    importance: "high",
  },
  {
    id: "ql-c-array-pointer",
    subject: "language",
    sourceId: "l-c-pointer",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      "#include <stdio.h>\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int *p = a;\n    printf(\"%d\", *(p + 2) + p[1]);\n    return 0;\n}",
    options: ["3", "5", "7", "9"],
    answerIndex: 1,
    explanation:
      "*(p+2) 는 a[2] 로 3, p[1] 은 a[1] 로 2 이므로 합은 5 다. 포인터에 더하는 수는 바이트가 아니라 원소 개수다.",
    optionNotes: [
      "*(p+2) 하나만 센 값이다.",
      null,
      "a[2] + a[3] 을 더한 값이다.",
      "a[3] + a[4] 를 더한 값이다.",
    ],
    importance: "must",
  },
  {
    id: "ql-c-callbyref",
    subject: "language",
    sourceId: "l-c-pointer",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      "#include <stdio.h>\nvoid f(int x, int *y) {\n    x = x + 10;\n    *y = *y + 10;\n}\nint main() {\n    int a = 1, b = 1;\n    f(a, &b);\n    printf(\"%d %d\", a, b);\n    return 0;\n}",
    options: ["1 1", "1 11", "11 1", "11 11"],
    answerIndex: 1,
    explanation:
      "x 는 값으로 넘겨 복사본이 바뀌므로 a 는 그대로 1 이다. y 는 주소를 넘겼으므로 b 가 실제로 11 이 된다.",
    optionNotes: [
      "포인터로 넘긴 b 는 바뀐다.",
      null,
      "값으로 넘긴 a 는 바뀌지 않는다.",
      "둘 다 바뀌지는 않는다.",
    ],
    importance: "must",
  },
  {
    id: "ql-java-dynamic",
    subject: "language",
    sourceId: "l-java-oop",
    question: "다음 Java 프로그램의 출력 결과는?",
    passage:
      "class A {\n    void print() { System.out.print(\"A\"); }\n}\nclass B extends A {\n    void print() { System.out.print(\"B\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        A obj = new B();\n        obj.print();\n    }\n}",
    options: ["A", "B", "AB", "컴파일 오류"],
    answerIndex: 1,
    explanation:
      "참조 변수의 자료형은 A 지만 실제 객체는 B 다. 오버라이딩된 메서드는 실제 객체를 따라가므로 B 가 찍힌다(동적 바인딩).",
    optionNotes: [
      "오버라이딩은 실제 객체를 따라간다.",
      null,
      "한 번만 부른다.",
      "상위 타입으로 하위 객체를 받는 것은 정상이다.",
    ],
    importance: "must",
  },
  {
    id: "ql-java-access",
    subject: "language",
    sourceId: "l-java-oop",
    question:
      "Java 접근 제어자 중 같은 패키지 안과 다른 패키지의 자식 클래스에서 접근할 수 있는 것은?",
    options: ["private", "default", "protected", "public"],
    answerIndex: 2,
    explanation:
      "protected 는 같은 패키지 + 상속받은 자식까지다. default 는 같은 패키지까지만이고, public 은 어디서나 된다.",
    optionNotes: [
      "private 은 자기 클래스 안에서만 된다.",
      "default 는 다른 패키지의 자식에서는 안 된다.",
      null,
      "public 은 맞지만 이 문항이 묻는 범위보다 넓다.",
    ],
    importance: "must",
  },
  {
    id: "ql-python-slice-step",
    subject: "language",
    sourceId: "l-python",
    question: "다음 Python 코드의 출력 결과는?",
    passage: "a = [1, 2, 3, 4, 5]\nprint(a[1:4])\nprint(a[::2])",
    options: [
      "[2, 3, 4]\n[1, 3, 5]",
      "[1, 2, 3]\n[2, 4]",
      "[2, 3, 4, 5]\n[1, 3, 5]",
      "[1, 2, 3, 4]\n[1, 2, 3]",
    ],
    answerIndex: 0,
    explanation:
      "a[1:4] 는 1번부터 3번까지로 [2, 3, 4] 다(끝 번호는 넣지 않는다). a[::2] 는 두 칸씩 건너뛰어 [1, 3, 5] 다.",
    optionNotes: [
      null,
      "슬라이스는 0번이 아니라 1번부터 시작한다.",
      "끝 번호 4 는 포함하지 않는다.",
      "두 번째 출력은 두 칸씩 건너뛴다.",
    ],
    importance: "must",
  },
  {
    id: "ql-os-lru",
    subject: "language",
    sourceId: "l-os-memory",
    question:
      "페이지 프레임이 3개이고 참조 순서가 1, 2, 3, 1, 4, 2 일 때 LRU 교체 기법에서 페이지 부재는 몇 번 일어나는가?",
    options: ["3회", "4회", "5회", "6회"],
    answerIndex: 2,
    explanation:
      "1·2·3 에서 세 번, 1 은 이미 있어 적중, 4 에서 가장 오래 쓰지 않은 2 를 밀어내며 네 번째, 마지막 2 에서 다섯 번째 부재가 난다.",
    optionNotes: [
      "처음 세 번 말고도 더 난다.",
      "마지막 2 도 부재다.",
      null,
      "1 을 두 번째로 참조할 때는 적중이다.",
    ],
    importance: "must",
  },
  {
    id: "ql-os-sjf",
    subject: "language",
    sourceId: "l-os-scheduling",
    question: "SJF(Shortest Job First) 스케줄링에 대한 설명으로 옳지 않은 것은?",
    options: [
      "실행 시간이 짧은 작업을 먼저 처리한다.",
      "평균 대기 시간을 가장 짧게 만들 수 있다.",
      "실행 시간을 미리 정확히 알기 어렵다는 문제가 있다.",
      "긴 작업이 굶는 일(기아)은 일어나지 않는다.",
    ],
    answerIndex: 3,
    explanation:
      "짧은 작업이 계속 들어오면 긴 작업은 계속 밀린다. 이것이 기아(Starvation)이며, 에이징으로 완화한다.",
    optionNotes: [null, null, null, "정답. 긴 작업이 굶을 수 있다."],
    importance: "must",
  },
  {
    id: "ql-os-alloc",
    subject: "language",
    sourceId: "l-os-memory",
    question:
      "빈 공간이 앞에서부터 20KB, 16KB, 8KB 일 때 10KB 작업을 최적 적합(Best Fit)으로 배치하면 어느 곳에 들어가는가?",
    options: ["20KB", "16KB", "8KB", "배치할 수 없다"],
    answerIndex: 1,
    explanation:
      "최적 적합은 들어갈 수 있는 곳 중 남는 공간이 가장 적은 곳을 고른다. 8KB 에는 들어가지 못하므로 16KB 자리다.",
    optionNotes: [
      "20KB 는 최초 적합이 고르는 자리다.",
      null,
      "10KB 가 들어가지 못한다.",
      "들어갈 자리가 있다.",
    ],
    importance: "high",
  },
  {
    id: "ql-osi-layer",
    subject: "language",
    sourceId: "l-network-osi",
    question: "OSI 7계층 중 경로 설정(라우팅)과 논리 주소를 다루는 계층은?",
    options: ["데이터 링크 계층", "네트워크 계층", "전송 계층", "세션 계층"],
    answerIndex: 1,
    explanation:
      "네트워크 계층이 IP 주소로 경로를 정한다. 데이터 링크 계층은 인접 장비 사이의 전달과 MAC 주소를 다룬다.",
    optionNotes: [
      "데이터 링크는 물리 주소(MAC)를 쓴다.",
      null,
      "전송 계층은 종단 사이의 신뢰성과 포트를 다룬다.",
      "세션 계층은 연결을 열고 닫는 것을 관리한다.",
    ],
    importance: "must",
  },
  {
    id: "ql-ip-class",
    subject: "language",
    sourceId: "l-network-tcpip",
    question: "IPv4 주소 192.168.10.5 가 속하는 클래스는?",
    options: ["A 클래스", "B 클래스", "C 클래스", "D 클래스"],
    answerIndex: 2,
    explanation:
      "첫 옥텟이 192~223 이면 C 클래스다. A 는 1~126, B 는 128~191, D 는 224~239(멀티캐스트)다.",
    optionNotes: [
      "A 클래스는 첫 옥텟이 1~126 이다.",
      "B 클래스는 128~191 이다.",
      null,
      "D 클래스는 224~239 로 멀티캐스트용이다.",
    ],
    importance: "high",
  },
  {
    id: "ql-lang-type",
    subject: "language",
    sourceId: "l-language-type",
    question: "다음 중 스크립트 언어에 해당하지 않는 것은?",
    options: ["Python", "JavaScript", "C", "PHP"],
    answerIndex: 2,
    explanation:
      "C 는 컴파일 언어다. 스크립트 언어는 원시 코드를 그때그때 해석해 실행한다.",
    optionNotes: [null, null, "정답. C 는 컴파일해서 실행한다.", null],
    importance: "normal",
  },
  {
    id: "ql-c-struct-size",
    subject: "language",
    sourceId: "l-c-struct",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      "#include <stdio.h>\nstruct P { int x; int y; };\nint main() {\n    struct P p = {3, 4};\n    struct P *q = &p;\n    q->x = q->x + q->y;\n    printf(\"%d %d\", p.x, p.y);\n    return 0;\n}",
    options: ["3 4", "7 4", "3 7", "7 7"],
    answerIndex: 1,
    explanation:
      "q 는 p 의 주소를 가리키므로 q->x 를 바꾸면 p.x 가 바뀐다. 3 + 4 = 7 이고 y 는 그대로 4 다.",
    optionNotes: [
      "포인터로 고쳤으므로 원본이 바뀐다.",
      null,
      "바뀐 것은 x 다.",
      "y 는 손대지 않았다.",
    ],
    importance: "high",
  },
];
