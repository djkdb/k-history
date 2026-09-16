import type { WrittenQuestion } from "@/lib/types";

/** 보충 문항 — 3과목 데이터베이스 · 4과목 프로그래밍 언어 */
export const EXTRA_B_QUESTIONS: WrittenQuestion[] = [
  // ── 3과목 · 데이터베이스 구축 ───────────────────────
      {
      id: "qb-norm-bcnf",
      subject: "database",
      sourceId: "b-normalization",
      question: "다치 종속(Multi-valued Dependency)을 제거하면 도달하는 정규형은?",
      options: ["제2정규형", "제3정규형", "BCNF", "제4정규형"],
      answerIndex: 3,
      explanation:
        "제4정규형이다. 원자값(1NF) → 부분 종속(2NF) → 이행 종속(3NF) → 결정자(BCNF) → 다치 종속(4NF) → 조인 종속(5NF) 순으로 걷어 낸다.",
      optionNotes: [
        "부분 함수 종속을 제거한 단계다.",
        "이행 함수 종속을 제거한 단계다.",
        "모든 결정자가 후보키여야 하는 단계다.",
        null,
      ],
      importance: "must",
    },
      {
      id: "qb-anomaly-kind",
      subject: "database",
      sourceId: "b-anomaly",
      question: "같은 값이 여러 줄에 흩어져 있어 일부만 고치는 바람에 데이터가 서로 어긋나는 현상은?",
      options: ["삽입 이상", "삭제 이상", "갱신 이상", "참조 이상"],
      answerIndex: 2,
      explanation:
        "갱신 이상이다. 중복된 값을 한곳만 고치면 나머지와 어긋난다. 정규화로 중복을 없애면 사라진다.",
      optionNotes: [
        "넣고 싶지 않은 값까지 함께 넣어야 하는 것이다.",
        "한 줄을 지웠더니 남겨야 할 정보까지 사라지는 것이다.",
        null,
        "참조 이상이라는 말은 쓰지 않는다.",
      ],
      importance: "must",
    },
  {
    id: "qb-key-kinds",
    subject: "database",
    sourceId: "b-key",
    question: "후보키(Candidate Key)가 반드시 만족해야 하는 성질은?",
    options: ["유일성과 최소성", "유일성만", "최소성만", "참조 무결성"],
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
      question: "다중 행(Multi-row) 서브쿼리에 사용할 수 없는 연산자는?",
      options: ["IN", "ANY", "ALL", "="],
      answerIndex: 3,
      explanation:
        "다중 행 서브쿼리는 결과가 여러 줄이므로 = 로 견줄 수 없다. IN·ANY·ALL·EXISTS 를 쓴다. = 는 결과가 한 줄인 단일 행 서브쿼리에만 쓴다.",
      optionNotes: [
        "여러 값 가운데 하나와 같으면 참이다.",
        "여러 값 가운데 어느 하나와만 견주어도 참이면 참이다.",
        "여러 값 모두와 견주어 참이어야 참이다.",
        null,
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
      question: "3단계 스키마 중 데이터가 실제로 저장되는 물리적 구조를 정의하는 것은?",
      options: ["외부 스키마", "개념 스키마", "내부 스키마", "서브 스키마"],
      answerIndex: 2,
      explanation:
        "내부 스키마다. 인덱스와 저장 레코드의 형식처럼 실제로 디스크에 어떻게 놓이는가를 다룬다. 개념 스키마는 조직 전체의 논리 구조다.",
      optionNotes: [
        "사용자나 응용 프로그램이 보는 관점이며 여러 개일 수 있다.",
        "조직 전체의 논리적 구조로 하나만 있다.",
        null,
        "외부 스키마를 달리 부르는 이름이다.",
      ],
      importance: "must",
    },
      {
      id: "qb-nosql-cap",
      subject: "database",
      sourceId: "b-nosql",
      question: "대량의 데이터 속에 숨어 있는 규칙이나 패턴을 찾아내는 일을 무엇이라 하는가?",
      options: ["데이터 웨어하우스", "데이터 마트", "데이터 마이닝", "데이터 정제"],
      answerIndex: 2,
      explanation:
        "데이터 마이닝이다. 웨어하우스는 분석하려고 주제별로 모아 둔 저장소, 마트는 그중 일부를 떼어 낸 것, 정제는 잘못된 값을 바로잡는 일이다.",
      optionNotes: [
        "분석을 위해 주제별로 모아 둔 저장소다.",
        "웨어하우스에서 부서나 주제별로 떼어 낸 작은 것이다.",
        null,
        "결측값·중복·형식 오류를 바로잡는 일이다.",
      ],
      importance: "high",
    },
  {
    id: "ql-c-array-pointer",
    subject: "language",
    sourceId: "l-c-pointer",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      '#include <stdio.h>\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int *p = a;\n    printf("%d", *(p + 2) + p[1]);\n    return 0;\n}',
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
      '#include <stdio.h>\nvoid f(int x, int *y) {\n    x = x + 10;\n    *y = *y + 10;\n}\nint main() {\n    int a = 1, b = 1;\n    f(a, &b);\n    printf("%d %d", a, b);\n    return 0;\n}',
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
      'public class Main {\n    public static void main(String[] args) {\n        int a = 7, b = 2;\n        System.out.print(a / b + " " + a % b + " " + (double) a / b);\n    }\n}',
    options: ["3 1 3.5", "3.5 1 3.5", "3 1 3", "4 1 3.5"],
    answerIndex: 0,
    explanation:
      "정수끼리 나누면 소수점이 버려져 7 / 2 는 3 이다. % 는 나머지라 1 이고, 한쪽을 double 로 바꾸면 실수 나눗셈이 되어 3.5 가 된다. 같은 기호라도 피연산자의 자료형이 결과를 바꾼다.",
    optionNotes: [
      null,
      "a / b 는 둘 다 정수라 3 이다.",
      "(double) 을 붙이면 실수 나눗셈이 되어 3.5 다.",
      "정수 나눗셈은 반올림하지 않고 버린다.",
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
      "첫 줄 [2, 3, 4] · 둘째 줄 [1, 3, 5]",
      "첫 줄 [1, 2, 3] · 둘째 줄 [2, 4]",
      "첫 줄 [2, 3, 4, 5] · 둘째 줄 [1, 3, 5]",
      "첫 줄 [1, 2, 3, 4] · 둘째 줄 [1, 2, 3]",
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
    question:
      "SJF(Shortest Job First) 스케줄링에 대한 설명으로 옳지 않은 것은?",
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
      question: "빈 공간이 앞에서부터 20KB, 16KB, 8KB 일 때 10KB 작업을 최초 적합(First Fit)으로 배치하면 어느 곳에 들어가는가?",
      options: ["20KB", "16KB", "8KB", "배치할 수 없다"],
      answerIndex: 0,
      explanation:
        "최초 적합은 앞에서부터 훑다가 처음 들어갈 수 있는 곳에 넣는다. 20KB 가 첫 번째로 맞으므로 거기에 들어간다. 남는 공간이 가장 적은 16KB 를 고르는 것이 최적 적합이다.",
      optionNotes: [
        null,
        "남는 공간이 가장 적은 곳을 고르는 최적 적합의 답이다.",
        "8KB 에는 10KB 가 들어가지 못한다.",
        "들어갈 자리가 있다.",
      ],
      importance: "high",
    },
      {
      id: "ql-osi-layer",
      subject: "language",
      sourceId: "l-network-osi",
      question: "OSI 7계층 중 데이터의 암호화·압축과 형식 변환을 맡는 계층은?",
      options: ["세션 계층", "표현 계층", "응용 계층", "전송 계층"],
      answerIndex: 1,
      explanation:
        "표현(Presentation) 계층이다. 보내는 쪽과 받는 쪽의 자료 표현 방식이 달라도 알아볼 수 있게 맞춰 준다. 세션 계층은 연결을 열고 닫으며 동기점을 관리한다.",
      optionNotes: [
        "연결을 열고 닫고 동기점을 관리하는 5계층이다.",
        null,
        "HTTP·FTP·SMTP 처럼 사용자에게 서비스를 주는 7계층이다.",
        "종단 사이의 신뢰성과 포트를 다루는 4계층이다.",
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
      '#include <stdio.h>\nstruct P { int x; int y; };\nint main() {\n    struct P p = {3, 4};\n    struct P *q = &p;\n    q->x = q->x + q->y;\n    printf("%d %d", p.x, p.y);\n    return 0;\n}',
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
