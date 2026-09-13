import type { WrittenQuestion } from "@/lib/types";

/** 4과목 · 프로그래밍 언어 활용 — 보충 2 */
export const LANGUAGE2_QUESTIONS: WrittenQuestion[] = [
  {
    id: "ql2-c-for-sum",
    subject: "language",
    sourceId: "l-c-struct",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      '#include <stdio.h>\nint main() {\n    int i, s = 0;\n    for (i = 1; i <= 10; i++) {\n        if (i % 3 == 0) continue;\n        s += i;\n    }\n    printf("%d", s);\n    return 0;\n}',
    options: ["37", "40", "55", "18"],
    answerIndex: 0,
    explanation:
      "1부터 10까지의 합 55 에서 3의 배수 3, 6, 9 (합 18)를 빼면 37 이다. continue 는 그 회차만 건너뛴다.",
    optionNotes: [
      null,
      "계산이 맞지 않는다.",
      "3의 배수를 빼지 않은 값이다.",
      "건너뛴 값들의 합이다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-c-2d-array",
    subject: "language",
    sourceId: "l-c-struct",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      '#include <stdio.h>\nint main() {\n    int a[2][3] = {{1,2,3},{4,5,6}};\n    int i, j, s = 0;\n    for (i = 0; i < 2; i++)\n        for (j = 0; j < 3; j++)\n            if (i == j) s += a[i][j];\n    printf("%d", s);\n    return 0;\n}',
    options: ["5", "6", "7", "9"],
    answerIndex: 1,
    explanation:
      "i 와 j 가 같은 자리는 a[0][0]=1 과 a[1][1]=5 다. 합은 6 이다.",
    optionNotes: [
      "a[1][1] 하나만 센 값이다.",
      null,
      "계산이 맞지 않는다.",
      "계산이 맞지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-c-switch",
    subject: "language",
    sourceId: "l-c-struct",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      '#include <stdio.h>\nint main() {\n    int n = 2, r = 0;\n    switch (n) {\n        case 1: r += 1;\n        case 2: r += 2;\n        case 3: r += 3;\n        default: r += 4;\n    }\n    printf("%d", r);\n    return 0;\n}',
    options: ["2", "5", "9", "10"],
    answerIndex: 2,
    explanation:
      "break 가 없으면 아래로 계속 흘러내린다(fall-through). case 2 부터 2 + 3 + 4 = 9 다.",
    optionNotes: [
      "break 가 있어야 2 에서 멈춘다.",
      "계산이 맞지 않는다.",
      null,
      "case 1 까지 더한 값이다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-c-string",
    subject: "language",
    sourceId: "l-c-pointer",
    question: "다음 C 프로그램의 출력 결과는?",
    passage:
      '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[] = "Hello";\n    printf("%d %d", (int)strlen(s), (int)sizeof(s));\n    return 0;\n}',
    options: ["5 5", "5 6", "6 6", "6 5"],
    answerIndex: 1,
    explanation:
      "strlen 은 널 문자 앞까지 세어 5, sizeof 는 배열 전체라 널 문자를 포함해 6 이다. 시험은 이 차이를 묻는다.",
    optionNotes: [
      "sizeof 는 널 문자를 포함한다.",
      null,
      "strlen 은 널 문자를 세지 않는다.",
      "뒤바뀌었다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-java-static-block",
    subject: "language",
    sourceId: "l-java-oop",
    question: "다음 Java 프로그램의 출력 결과는?",
    passage:
      "public class Main {\n    public static void main(String[] args) {\n        int[] a = {5, 2, 8, 1};\n        int m = a[0];\n        for (int i = 1; i < a.length; i++)\n            if (a[i] < m) m = a[i];\n        System.out.print(m);\n    }\n}",
    options: ["1", "2", "5", "8"],
    answerIndex: 0,
    explanation:
      "첫 값을 기준으로 두고 더 작은 것을 만날 때마다 바꾼다. 최솟값 1 이 남는다.",
    optionNotes: [null, "더 작은 1 이 있다.", "첫 값일 뿐이다.", "최댓값이다."],
    importance: "high",
  },
  {
    id: "ql2-java-string-eq",
    subject: "language",
    sourceId: "l-java-oop",
    question: "다음 Java 프로그램의 출력 결과는?",
    passage:
      'public class Main {\n    public static void main(String[] args) {\n        String a = "gisa";\n        String b = new String("gisa");\n        System.out.print((a == b) + " " + a.equals(b));\n    }\n}',
    options: ["true true", "false true", "true false", "false false"],
    answerIndex: 1,
    explanation:
      "== 는 같은 객체인지를 보고, equals 는 내용이 같은지를 본다. new 로 만들면 다른 객체이므로 false, 내용은 같으므로 true 다.",
    optionNotes: [
      "new 로 만든 것은 다른 객체다.",
      null,
      "내용은 같으므로 equals 는 true 다.",
      "equals 는 true 다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-java-interface",
    subject: "language",
    sourceId: "l-java-oop",
    question: "Java 의 생성자(Constructor)에 대한 설명으로 옳지 않은 것은?",
    options: [
      "클래스 이름과 같은 이름을 가진다.",
      "반환형을 적지 않는다.",
      "객체를 만들 때 자동으로 불린다.",
      "한 클래스에 하나만 둘 수 있다.",
    ],
    answerIndex: 3,
    explanation: "매개변수를 달리해 여럿 둘 수 있다(생성자 오버로딩).",
    optionNotes: [null, null, null, "정답. 여럿 둘 수 있다."],
    importance: "high",
  },
  {
    id: "ql2-python-for-range",
    subject: "language",
    sourceId: "l-python",
    question: "다음 Python 코드의 출력 결과는?",
    passage:
      "s = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        continue\n    s += i\nprint(s)",
    options: ["6", "9", "15", "5"],
    answerIndex: 1,
    explanation:
      "range(1, 6) 은 1~5 다. 짝수 2, 4 를 건너뛰고 1 + 3 + 5 = 9 다.",
    optionNotes: [
      "건너뛴 짝수의 합이다.",
      null,
      "1~5 전부의 합이다.",
      "계산이 맞지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-python-str",
    subject: "language",
    sourceId: "l-python",
    question: "다음 Python 코드의 출력 결과는?",
    passage: 's = "gisa"\nprint(s[-1], s[::-1])',
    options: ["a asig", "g asig", "a gisa", "a agis"],
    answerIndex: 0,
    explanation:
      "s[-1] 은 마지막 글자 a 다. s[::-1] 은 뒤집기이므로 'gisa' → 'asig' 다.",
    optionNotes: [
      null,
      "s[-1] 은 마지막 글자다.",
      "s[::-1] 은 뒤집는다.",
      "뒤집으면 asig 다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-python-func",
    subject: "language",
    sourceId: "l-python",
    question: "다음 Python 코드의 출력 결과는?",
    passage:
      "def f(a, b=2, *c):\n    return a + b + sum(c)\n\nprint(f(1), f(1, 3), f(1, 3, 5, 7))",
    options: ["3 4 16", "3 4 8", "1 4 16", "3 3 16"],
    answerIndex: 0,
    explanation:
      "f(1) → 1+2 = 3, f(1,3) → 1+3 = 4, f(1,3,5,7) → 1+3+(5+7) = 16 이다. *c 는 남은 인자를 튜플로 받는다.",
    optionNotes: [
      null,
      "5 와 7 이 모두 더해진다.",
      "f(1) 은 기본값 2 가 더해진다.",
      "f(1,3) 은 4 다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-os-banker",
    subject: "language",
    sourceId: "l-os-scheduling",
    question: "교착 상태 해결 방법 중 은행가 알고리즘이 속하는 것은?",
    options: [
      "예방(Prevention)",
      "회피(Avoidance)",
      "발견(Detection)",
      "회복(Recovery)",
    ],
    answerIndex: 1,
    explanation:
      "은행가 알고리즘은 자원을 주기 전에 안전 상태인지 따져 보고 결정한다 — 회피다. 예방은 네 조건 중 하나를 아예 없애는 것이다.",
    optionNotes: [
      "예방은 네 조건 중 하나를 없앤다.",
      null,
      "발견은 이미 생긴 교착을 찾아낸다.",
      "회복은 찾아낸 뒤 풀어 준다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-os-rr",
    subject: "language",
    sourceId: "l-os-scheduling",
    question: "라운드 로빈(Round Robin) 스케줄링에 대한 설명으로 옳은 것은?",
    options: [
      "시간 할당량이 너무 크면 FCFS 와 비슷해진다.",
      "시간 할당량이 너무 크면 문맥 교환이 잦아진다.",
      "비선점 방식이라 한 번 잡으면 끝까지 돈다.",
      "실행 시간이 짧은 작업을 먼저 처리한다.",
    ],
    answerIndex: 0,
    explanation:
      "할당량이 크면 대부분 한 번에 끝나 FCFS 처럼 된다. 반대로 너무 작으면 문맥 교환이 잦아 낭비가 커진다.",
    optionNotes: [
      null,
      "할당량이 작을 때 문맥 교환이 잦아진다.",
      "라운드 로빈은 선점 방식이다.",
      "이것은 SJF 다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-os-fifo",
    subject: "language",
    sourceId: "l-os-memory",
    question:
      "페이지 프레임이 3개이고 참조 순서가 2, 3, 2, 1, 5, 2 일 때 FIFO 교체 기법의 페이지 부재 횟수는?",
    options: ["3회", "4회", "5회", "6회"],
    answerIndex: 2,
    explanation:
      "2·3 에서 두 번, 2 는 적중, 1 에서 세 번째, 5 에서 가장 먼저 들어온 2 를 밀어내며 네 번째, 마지막 2 는 밀려났으므로 다섯 번째 부재가 난다.",
    optionNotes: [
      "더 난다.",
      "마지막 2 도 부재다.",
      null,
      "세 번째 참조인 2 는 적중이다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-os-virtual",
    subject: "language",
    sourceId: "l-os-memory",
    question: "가상 기억 장치에서 페이징 기법에 대한 설명으로 옳은 것은?",
    options: [
      "크기가 같은 블록으로 나누므로 외부 단편화가 생기지 않는다.",
      "논리적 단위로 나누므로 내부 단편화가 생기지 않는다.",
      "외부 단편화와 내부 단편화가 모두 생기지 않는다.",
      "블록 크기가 서로 다르다.",
    ],
    answerIndex: 0,
    explanation:
      "페이징은 같은 크기로 잘라 외부 단편화가 없는 대신 마지막 페이지에 내부 단편화가 남는다. 세그먼테이션은 그 반대다.",
    optionNotes: [
      null,
      "이것은 세그먼테이션이다.",
      "페이징에는 내부 단편화가 남는다.",
      "페이징은 크기가 같다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-net-subnet",
    subject: "language",
    sourceId: "l-network-tcpip",
    question: "서브넷 마스크 255.255.255.192 를 CIDR 표기로 나타낸 것은?",
    options: ["/24", "/25", "/26", "/27"],
    answerIndex: 2,
    explanation:
      "192 는 이진수로 11000000 이므로 앞의 1 이 2개다. 24 + 2 = 26 이다.",
    optionNotes: [
      "/24 는 255.255.255.0 이다.",
      "/25 는 255.255.255.128 이다.",
      null,
      "/27 은 255.255.255.224 다.",
    ],
    importance: "must",
  },
  {
    id: "ql2-net-protocol",
    subject: "language",
    sourceId: "l-network-osi",
    question: "IP 주소를 MAC 주소로 바꿔 주는 프로토콜은?",
    options: ["ARP", "RARP", "ICMP", "IGMP"],
    answerIndex: 0,
    explanation:
      "ARP 는 IP → MAC, RARP 는 그 반대다. ICMP 는 오류와 상태를 알리고(ping), IGMP 는 멀티캐스트 그룹을 관리한다.",
    optionNotes: [
      null,
      "RARP 는 MAC → IP 다.",
      "ICMP 는 오류 보고용이다.",
      "IGMP 는 멀티캐스트용이다.",
    ],
    importance: "must",
  },
];
