import type { PracticalQuestion } from "@/lib/types";

/**
 * 실기 — 코드를 읽고 출력을 적는 문항.
 *
 * 실기에서 코드 해석이 차지하는 무게를 생각하면 용어·빈칸보다 얇아서는
 * 안 된다. 여기 있는 답은 전부 gcc·javac·python3 로 실제로 돌려 견준 것이다
 * (scratchpad/gisa-runcode.js). 머릿속으로 돌린 값을 적어 두면 앱이 정답이라고
 * 우기는 오답이 된다.
 */
export const PRACTICAL_CODE: PracticalQuestion[] = [
  // ── C ────────────────────────────────────────────────
  {
    id: "pc-c-bit",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int a = 12, b = 10;\n    printf("%d %d %d %d", a & b, a | b, a ^ b, a << 1);\n    return 0;\n}',
    answers: ["8 14 6 24"],
    points: 5,
    explanation:
      "12는 1100, 10은 1010이다. AND는 1000(8), OR은 1110(14), XOR은 0110(6)이고, 12를 왼쪽으로 한 칸 밀면 24다.",
    importance: "must",
  },
  {
    id: "pc-c-reverse",
    subject: "language",
    sourceId: "l-c-pointer",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int i, t;\n    for (i = 0; i < 5 / 2; i++) {\n        t = a[i];\n        a[i] = a[4 - i];\n        a[4 - i] = t;\n    }\n    for (i = 0; i < 5; i++) printf("%d", a[i]);\n    return 0;\n}',
    answers: ["54321"],
    points: 5,
    explanation:
      "양 끝에서부터 마주 보며 맞바꾼다. 가운데(2번 자리)는 제자리이므로 5/2 = 2번만 돌면 된다.",
    importance: "must",
  },
  {
    id: "pc-c-dowhile",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int n = 0, s = 0;\n    do {\n        s += n;\n        n += 2;\n    } while (n <= 8);\n    printf("%d %d", s, n);\n    return 0;\n}',
    answers: ["20 10"],
    points: 5,
    explanation:
      "0+2+4+6+8 = 20 이다. 마지막에 n 이 10 이 되어 조건이 거짓이 되면서 끝나므로 n 은 10 이다.",
    importance: "must",
  },
  {
    id: "pc-c-string-count",
    subject: "language",
    sourceId: "l-c-pointer",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      "#include <stdio.h>\nint main() {\n    char s[] = \"engineer\";\n    int i, c = 0;\n    for (i = 0; s[i] != '\\0'; i++)\n        if (s[i] == 'e') c++;\n    printf(\"%d\", c);\n    return 0;\n}",
    answers: ["3"],
    points: 5,
    explanation:
      "engineer 에서 e 는 첫 글자, 네 번째, 일곱 번째로 세 번 나온다. 널 문자를 만날 때까지 훑는다.",
    importance: "must",
  },
  {
    id: "pc-c-struct-array",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nstruct S { int a; int b; };\nint main() {\n    struct S x[3] = {{1,2},{3,4},{5,6}};\n    int i, s = 0;\n    for (i = 0; i < 3; i++) s += x[i].a * x[i].b;\n    printf("%d", s);\n    return 0;\n}',
    answers: ["44"],
    points: 5,
    explanation: "1×2 + 3×4 + 5×6 = 2 + 12 + 30 = 44 다.",
    importance: "high",
  },
  {
    id: "pc-c-transpose",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint main() {\n    int a[2][3] = {{1,2,3},{4,5,6}};\n    int i, j;\n    for (j = 0; j < 3; j++) {\n        for (i = 0; i < 2; i++) printf("%d", a[i][j]);\n    }\n    return 0;\n}',
    answers: ["142536"],
    points: 5,
    explanation:
      "열을 바깥, 행을 안쪽으로 돌면 열 우선으로 읽는다 — (0,0)(1,0)(0,1)(1,1)(0,2)(1,2) 순이라 142536 이다.",
    importance: "must",
  },
  {
    id: "pc-c-hanoi",
    subject: "language",
    sourceId: "l-c-struct",
    kind: "code",
    lang: "c",
    question: "다음 C 프로그램의 출력 결과를 쓰시오.",
    passage:
      '#include <stdio.h>\nint h(int n) {\n    if (n == 1) return 1;\n    return 2 * h(n - 1) + 1;\n}\nint main() {\n    printf("%d", h(4));\n    return 0;\n}',
    answers: ["15"],
    points: 5,
    explanation:
      "하노이 탑의 최소 이동 횟수다. h(1)=1, h(2)=3, h(3)=7, h(4)=15 — 2ⁿ-1 이다.",
    importance: "high",
  },

  // ── Java ─────────────────────────────────────────────
  {
    id: "pc-java-interface",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      "interface Shape {\n    int area();\n}\nclass Rect implements Shape {\n    int w = 3, h = 4;\n    public int area() { return w * h; }\n}\nclass Square implements Shape {\n    int s = 5;\n    public int area() { return s * s; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Shape[] a = { new Rect(), new Square() };\n        int t = 0;\n        for (Shape x : a) t += x.area();\n        System.out.print(t);\n    }\n}",
    answers: ["37"],
    points: 5,
    explanation:
      "같은 area() 를 불러도 실제 객체에 따라 다르게 동작한다(다형성). 3×4 + 5×5 = 12 + 25 = 37 이다.",
    importance: "must",
  },
  {
    id: "pc-java-finally",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      'public class Main {\n    public static void main(String[] args) {\n        try {\n            int[] a = new int[3];\n            a[3] = 1;\n            System.out.print("A");\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.print("B");\n        } finally {\n            System.out.print("C");\n        }\n        System.out.print("D");\n    }\n}',
    answers: ["BCD"],
    points: 5,
    explanation:
      "a[3] 에서 예외가 나므로 A 는 찍히지 않는다. catch 의 B, finally 의 C 는 반드시 돌고, 그 뒤 D 가 찍힌다.",
    importance: "must",
  },
  {
    id: "pc-java-string-builder",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      'public class Main {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder("gisa");\n        sb.append("2026");\n        sb.insert(0, "[");\n        sb.reverse();\n        System.out.print(sb);\n    }\n}',
    answers: ["6202asig["],
    points: 5,
    explanation:
      'append 로 gisa2026, insert(0,"[") 로 [gisa2026 이 되고, 뒤집으면 6202asig[ 다.',
    importance: "high",
  },
  {
    id: "pc-java-static-vs",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      'class C {\n    static int s = 0;\n    int i = 0;\n    C() { s++; i++; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        C a = new C();\n        C b = new C();\n        C c = new C();\n        System.out.print(C.s + " " + c.i);\n    }\n}',
    answers: ["3 1"],
    points: 5,
    explanation:
      "static 변수 s 는 클래스에 하나뿐이라 객체를 셋 만들면 3 이 된다. i 는 객체마다 따로 있으므로 1 이다.",
    importance: "must",
  },
  {
    id: "pc-java-overload",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      'public class Main {\n    static int f(int a) { return a + 1; }\n    static int f(int a, int b) { return a + b; }\n    static double f(double a) { return a * 2; }\n    public static void main(String[] args) {\n        System.out.print(f(3) + " " + f(3, 4) + " " + f(3.0));\n    }\n}',
    answers: ["4 7 6.0"],
    points: 5,
    explanation:
      "매개변수의 개수와 자료형으로 어느 f 를 부를지 정한다(오버로딩). double 을 넘기면 세 번째가 불려 6.0 이 된다.",
    importance: "must",
  },
  {
    id: "pc-java-2d",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      "public class Main {\n    public static void main(String[] args) {\n        int[][] a = {{1,2,3},{4,5,6},{7,8,9}};\n        int s = 0;\n        for (int i = 0; i < 3; i++) s += a[i][2 - i];\n        System.out.print(s);\n    }\n}",
    answers: ["15"],
    points: 5,
    explanation:
      "반대 방향 대각선이다. a[0][2]=3, a[1][1]=5, a[2][0]=7 — 합은 15 다.",
    importance: "must",
  },
  {
    id: "pc-java-abstract",
    subject: "language",
    sourceId: "l-java-oop",
    kind: "code",
    lang: "java",
    question: "다음 Java 프로그램의 출력 결과를 쓰시오.",
    passage:
      "abstract class A {\n    abstract int v();\n    int twice() { return v() * 2; }\n}\nclass B extends A {\n    int v() { return 7; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        A x = new B();\n        System.out.print(x.twice());\n    }\n}",
    answers: ["14"],
    points: 5,
    explanation:
      "추상 클래스의 twice() 가 하위에서 채운 v() 를 부른다. 7 × 2 = 14 다 — 템플릿 메서드 패턴과 같은 구조다.",
    importance: "must",
  },

  // ── Python ───────────────────────────────────────────
  {
    id: "pc-py-class",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "class A:\n    def __init__(self, n):\n        self.n = n\n    def f(self):\n        return self.n * 2\n\nclass B(A):\n    def f(self):\n        return super().f() + 1\n\nprint(B(5).f())",
    answers: ["11"],
    points: 5,
    explanation:
      "super().f() 는 A 의 것이라 5 × 2 = 10 이고, 거기에 1 을 더해 11 이다.",
    importance: "must",
  },
  {
    id: "pc-py-split-join",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage: 's = "a,b,c,d"\nt = s.split(",")\nprint(len(t), "-".join(t[1:3]))',
    answers: ["4 b-c"],
    points: 5,
    explanation:
      "split 으로 네 조각이 되고, t[1:3] 은 b 와 c 다. join 은 사이에만 구분자를 넣으므로 b-c 다.",
    importance: "must",
  },
  {
    id: "pc-py-sort-dict",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "d = {'b': 2, 'a': 3, 'c': 1}\nprint(sorted(d))\nprint(sorted(d, key=lambda k: d[k]))",
    answers: ["['a', 'b', 'c']\n['c', 'b', 'a']"],
    points: 5,
    explanation:
      "딕셔너리를 그냥 정렬하면 키를 정렬한다. key 에 값을 주면 값 기준으로 키를 늘어놓는다.",
    importance: "high",
  },
  {
    id: "pc-py-while-prime",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "n = 12\nc = 0\ni = 1\nwhile i <= n:\n    if n % i == 0:\n        c += 1\n    i += 1\nprint(c)",
    answers: ["6"],
    points: 5,
    explanation: "12 의 약수는 1, 2, 3, 4, 6, 12 로 여섯 개다.",
    importance: "must",
  },
  {
    id: "pc-py-slice-assign",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage: "a = [1, 2, 3, 4, 5]\na[1:3] = [9]\nprint(a, len(a))",
    answers: ["[1, 9, 4, 5] 4"],
    points: 5,
    explanation:
      "슬라이스에 대입하면 그 구간이 통째로 바뀐다. 두 칸이 한 칸으로 줄어 길이가 4 가 된다.",
    importance: "high",
  },
  {
    id: "pc-py-swap",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage: "a, b = 1, 2\na, b = b, a + b\nprint(a, b)",
    answers: ["2 3"],
    points: 5,
    explanation:
      "오른쪽을 먼저 모두 계산한 뒤 한꺼번에 넣는다. (b, a+b) = (2, 3) 이므로 a=2, b=3 이다.",
    importance: "must",
  },
  {
    id: "pc-py-nested",
    subject: "language",
    sourceId: "l-python",
    kind: "code",
    lang: "python",
    question: "다음 Python 코드의 출력 결과를 쓰시오.",
    passage:
      "s = 0\nfor i in range(1, 4):\n    for j in range(i):\n        s += i\nprint(s)",
    answers: ["14"],
    points: 5,
    explanation:
      "i=1 이면 1을 한 번, i=2 면 2를 두 번, i=3 이면 3을 세 번 더한다 — 1 + 4 + 9 = 14 다.",
    importance: "must",
  },
];
