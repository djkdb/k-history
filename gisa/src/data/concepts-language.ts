import type { Concept } from "@/lib/types";

/**
 * 4과목 · 프로그래밍 언어 활용.
 *
 * 코드를 읽고 결과를 맞히는 과목이다. 실기에서 비중이 가장 큰 자리이기도
 * 해서, 여기서 손으로 따라가는 습관이 그대로 실기 점수가 된다.
 */
export const LANGUAGE_CONCEPTS: Concept[] = [
  {
    id: "l-c-pointer",
    subject: "language",
    title: "C — 포인터와 배열",
    summary: "배열 이름은 첫 원소의 주소다. *(p+i) 와 p[i] 는 같다.",
    body: [
      "포인터는 주소를 담는 변수다. `int *p = &a;` 이면 `*p` 는 a 의 값이다.",
      "배열 이름은 첫 원소의 주소이므로 `arr[i]` 와 `*(arr + i)` 는 같은 값이다.",
      "이중 포인터 `int **pp` 는 포인터의 주소를 담는다.",
      "문자열은 char 배열이고 끝에 '\\0' 이 붙는다. 그래서 \"ABC\" 의 크기는 4다.",
    ],
    examPoint:
      "배열과 포인터를 섞은 코드를 주고 출력을 적게 한다. 실기에서 거의 매회 나온다.",
    importance: "must",
    keys: [{ term: "arr[i]", mean: "*(arr + i) 와 같다" }],
    tracks: ["written", "practical"],
  },
  {
    id: "l-c-struct",
    subject: "language",
    title: "C — 구조체와 함수",
    summary: "값 전달과 주소 전달. 주소를 넘겨야 원본이 바뀐다.",
    body: [
      "값에 의한 호출(Call by value)은 복사본을 넘긴다. 함수 안에서 바꿔도 원본은 그대로다.",
      "주소에 의한 호출(Call by reference)은 주소를 넘긴다. 함수 안에서 바꾸면 원본이 바뀐다.",
      "구조체 변수는 `.` 으로, 구조체 포인터는 `->` 로 멤버에 닿는다.",
      "재귀 함수는 자기 자신을 부른다. 끝나는 조건이 없으면 스택이 넘친다.",
    ],
    examPoint:
      "swap 함수를 주고 값 전달인지 주소 전달인지에 따라 결과가 달라지는 문제가 단골이다.",
    importance: "must",
    traps: [
      {
        a: "Call by value",
        b: "Call by reference",
        how: "값 전달은 복사본이라 원본이 안 바뀌고, 주소 전달은 원본이 바뀐다. 매개변수에 * 가 있는지 보면 된다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "l-java-oop",
    subject: "language",
    title: "Java — 상속과 오버라이딩",
    summary: "참조 변수의 타입이 아니라 실제 객체가 메서드를 정한다.",
    body: [
      "`Parent p = new Child();` 일 때, 오버라이딩된 메서드는 Child 의 것이 불린다(동적 바인딩).",
      "필드는 다르다. 필드는 참조 변수의 타입을 따른다.",
      "`super` 는 상위 클래스를, `this` 는 자기 자신을 가리킨다. 생성자에서 `super()` 는 첫 줄에 와야 한다.",
      "추상 클래스는 인스턴스를 만들 수 없고, 인터페이스는 다중 구현이 된다.",
    ],
    examPoint:
      "상속 관계에서 어떤 메서드가 불리는지 묻는 코드 문제가 매회 나온다. 필드는 타입을 따른다는 점이 함정이다.",
    importance: "must",
    traps: [
      {
        a: "메서드 호출",
        b: "필드 접근",
        how: "메서드는 실제 객체(Child)를 따르고, 필드는 참조 타입(Parent)을 따른다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "l-python",
    subject: "language",
    title: "Python — 자료형과 슬라이싱",
    summary:
      "리스트는 바뀌고 튜플은 안 바뀐다. 슬라이싱은 끝을 포함하지 않는다.",
    body: [
      "리스트 `[]` 는 변경 가능, 튜플 `()` 은 변경 불가, 딕셔너리 `{}` 는 키-값, 집합 `set()` 은 중복 없음.",
      "슬라이싱 `a[1:4]` 는 1,2,3 번 자리다. 끝 번호는 포함하지 않는다. `a[::-1]` 은 뒤집기다.",
      '문자열도 슬라이싱이 된다. `"ABCDE"[1:3]` 은 "BC".',
      "`range(1, 5)` 는 1,2,3,4 다. 5는 포함하지 않는다.",
    ],
    examPoint:
      "슬라이싱과 range 의 '끝을 포함하지 않는다'가 함정으로 쓰인다. 실기 코드 문항에서 자주 나온다.",
    importance: "must",
    keys: [{ term: "a[1:4]", mean: "1,2,3 — 끝은 포함하지 않는다" }],
    tracks: ["written", "practical"],
  },
  {
    id: "l-os-scheduling",
    subject: "language",
    title: "운영체제 — 프로세스 스케줄링",
    summary: "선점과 비선점. FCFS·SJF·RR·우선순위.",
    body: [
      "비선점: FCFS(먼저 온 순), SJF(짧은 것 먼저), HRN, 우선순위(비선점).",
      "선점: RR(라운드 로빈 — 시간 할당량마다 교체), SRT, 다단계 큐, 다단계 피드백 큐.",
      "HRN 우선순위 = (대기 시간 + 서비스 시간) ÷ 서비스 시간. 값이 클수록 먼저다.",
      "SJF 는 평균 대기 시간이 가장 짧지만, 긴 작업이 계속 밀리는 기아(Starvation)가 생긴다. 에이징으로 완화한다.",
    ],
    examPoint: "'다음 중 선점 스케줄링이 아닌 것은?'과 HRN 계산이 단골이다.",
    importance: "must",
    keys: [
      { term: "비선점", mean: "FCFS · SJF · HRN · 우선순위" },
      { term: "선점", mean: "RR · SRT · 다단계 큐 · 다단계 피드백 큐" },
      { term: "HRN", mean: "(대기 + 서비스) ÷ 서비스" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "l-os-memory",
    subject: "language",
    title: "운영체제 — 기억장치 관리",
    summary: "배치 전략 세 가지와 페이지 교체 알고리즘.",
    body: [
      "배치 전략: 최초 적합(First Fit — 먼저 맞는 곳), 최적 적합(Best Fit — 남는 공간이 가장 적은 곳), 최악 적합(Worst Fit — 가장 큰 곳).",
      "페이지 교체: FIFO, LRU(가장 오래 안 쓴 것), LFU(가장 적게 쓴 것), OPT(앞으로 가장 늦게 쓸 것).",
      "벨레이디의 모순: FIFO 에서 프레임을 늘렸는데 페이지 부재가 오히려 늘어나는 현상.",
      "스래싱은 페이지 교체에 시간을 다 써 실제 일을 못 하는 상태다. 워킹 셋으로 완화한다.",
    ],
    examPoint:
      "참조열을 주고 LRU·FIFO 로 페이지 부재 횟수를 세게 한다. 벨레이디의 모순은 FIFO 에서만 난다는 점도 묻는다.",
    importance: "must",
    tracks: ["written", "practical"],
  },
  {
    id: "l-network-osi",
    subject: "language",
    title: "네트워크 — OSI 7계층",
    summary: "물리·데이터링크·네트워크·전송·세션·표현·응용.",
    body: [
      "1 물리: 비트 전송. 리피터·허브.",
      "2 데이터링크: 인접 노드 사이 오류 제어·흐름 제어. 브리지·스위치. 프레임.",
      "3 네트워크: 경로 설정. 라우터. 패킷. IP.",
      "4 전송: 종단 간 신뢰성. TCP·UDP. 세그먼트.",
      "5 세션 / 6 표현(암호화·압축·형식 변환) / 7 응용(HTTP·FTP·SMTP).",
    ],
    examPoint:
      "특정 장비나 프로토콜이 어느 계층인지 묻는다. 라우터=3, 스위치=2 는 반드시 외운다.",
    importance: "must",
    keys: [
      { term: "2계층", mean: "브리지 · 스위치 · 프레임" },
      { term: "3계층", mean: "라우터 · 패킷 · IP" },
      { term: "4계층", mean: "TCP · UDP · 세그먼트" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "l-network-tcpip",
    subject: "language",
    title: "네트워크 — TCP/IP와 주소",
    summary: "TCP는 연결형, UDP는 비연결형. 서브넷 계산은 실기에도 나온다.",
    body: [
      "TCP 는 연결형이고 3-way handshake(SYN → SYN+ACK → ACK)로 연결을 연다. 순서 보장·흐름 제어·오류 제어를 한다.",
      "UDP 는 비연결형이라 빠르지만 신뢰성이 없다. 실시간 스트리밍·DNS 에 쓴다.",
      "IPv4 는 32비트, IPv6 는 128비트다. IPv6 는 헤더가 단순해지고 보안(IPSec)이 기본이다.",
      "서브넷 마스크로 네트워크와 호스트를 가른다. /26 이면 호스트 비트가 6개라 한 서브넷에 64개 주소, 쓸 수 있는 호스트는 62개다.",
    ],
    examPoint:
      "3-way handshake 순서와 서브넷 계산이 단골이다. 실기에서는 '사용 가능한 호스트 수'를 적게 한다.",
    importance: "must",
    keys: [
      { term: "3-way", mean: "SYN → SYN+ACK → ACK" },
      { term: "/26", mean: "호스트 62개 (64 − 네트워크 − 브로드캐스트)" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "l-language-type",
    subject: "language",
    title: "프로그래밍 언어의 분류",
    summary: "절차·객체지향·함수형·논리형. 컴파일과 인터프리터.",
    body: [
      "절차형: C, FORTRAN, COBOL. 객체지향: Java, C++, C#. 함수형: LISP, Haskell. 논리형: PROLOG.",
      "컴파일러는 전체를 한 번에 번역해 실행 파일을 만든다. 인터프리터는 한 줄씩 번역하며 실행한다.",
      "변수의 유효 범위(Scope): 지역 변수는 선언된 블록 안에서만, 전역 변수는 프로그램 전체에서 쓰인다.",
    ],
    examPoint: "언어와 패러다임을 짝짓게 한다. PROLOG=논리형이 자주 나온다.",
    importance: "normal",
    tracks: ["written"],
  },
];
