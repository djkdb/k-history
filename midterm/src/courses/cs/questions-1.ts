import type { Question } from "@/lib/types";

/* 1강 · 2강 */
export const QUESTIONS_1: Question[] = [
  // cs-what
  { kind: "mc", id: "cs-q-what-1", concept: "cs-what", q: "컴퓨터를 이용한 문제 해결 과정의 순서로 옳은 것은?", options: ["알고리즘 설계 → 문제 정의 → 구현 → 실행 → 평가", "문제 정의 → 알고리즘 설계 → 프로그램 구현 → 실행 → 결과 검증·성능 평가", "프로그램 구현 → 문제 정의 → 실행 → 알고리즘 설계 → 평가", "문제 정의 → 프로그램 구현 → 알고리즘 설계 → 평가 → 실행"], answer: 1, explain: "문제 정의에서 시작해 결과 평가까지 이어진다." },
  { kind: "ox", id: "cs-q-what-2", concept: "cs-what", q: "C 프로그램이 실행되려면 프로그래밍 언어만 있으면 되고, 컴파일러·라이브러리·운영체제는 필요 없다.", answer: false, explain: "언어 + 컴파일러 + 라이브러리 + 운영체제 + 하드웨어가 모두 필요하다." },
  { kind: "mc", id: "cs-q-what-3", concept: "cs-what", q: "scanf()·printf() 호출이 실제 장치까지 가는 경로로 알맞은 것은?", options: ["C 프로그램 → 하드웨어 직접 제어", "C 프로그램 → C 표준 입출력 라이브러리 → 운영체제 입출력 서비스 → 표준 입출력", "C 프로그램 → 컴파일러 → 키보드", "C 프로그램 → 운영체제 → C 표준 라이브러리 → 화면"], answer: 1, explain: "라이브러리가 형식 변환·버퍼링을 하고, 실제 전달과 자원 관리는 OS가 한다." },
  { kind: "ox", id: "cs-q-what-4", concept: "cs-what", q: "컴퓨터를 이용한 문제 해결은 코드를 작성하면 끝난다.", answer: false, explain: "문제 정의부터 결과 검증·성능 평가까지 이어진다." },

  // problem-algorithm
  { kind: "mc", id: "cs-q-pa-1", concept: "problem-algorithm", q: "'현재 실행 중인 프로그램'을 가리키는 말은?", options: ["문제", "알고리즘", "프로그램", "프로세스"], answer: 3, explain: "프로세스 = CPU와 메모리를 사용하는 실행 상태." },
  { kind: "mc", id: "cs-q-pa-2", concept: "problem-algorithm", q: "알고리즘을 표현하는 방법으로 교안에 나온 것이 아닌 것은?", options: ["자연어", "의사코드", "순서도", "실행 파일"], answer: 3, explain: "실행 파일은 프로그램을 컴파일·링크한 결과다." },
  { kind: "mc", id: "cs-q-pa-3", concept: "problem-algorithm", q: "'길이 n인 정수 배열에서 최댓값 출력'의 제약조건은?", options: ["정수 n과 n개의 정수", "배열 원소 중 최댓값", "n ≥ 1", "max ← A[0]"], answer: 2, explain: "입력 = 정수 n과 n개의 정수, 출력 = 최댓값, 제약조건 = n ≥ 1." },
  { kind: "ox", id: "cs-q-pa-4", concept: "problem-algorithm", q: "같은 문제에 여러 알고리즘이 있을 수 있고, 하나의 알고리즘도 여러 언어로 구현할 수 있다.", answer: true, explain: "문제 : 알고리즘 : 프로그램은 1:1이 아니다." },
  { kind: "mc", id: "cs-q-pa-5", concept: "problem-algorithm", q: "자연어로 알고리즘을 표현할 때의 단점으로 교안이 든 것은?", options: ["문법이 너무 엄격하다", "세부 절차가 모호하다(초기값·비교 시점·빈 배열 처리 등)", "컴퓨터가 바로 실행할 수 있다", "이해하기 어렵다"], answer: 1, explain: "자연어는 이해하기 쉽지만 모호하다. 의사코드는 문법에 얽매이지 않으면서 명확하다." },
  { kind: "short", id: "cs-q-pa-6", concept: "problem-algorithm", q: "문제를 컴퓨터가 처리할 수 있는 명확한 절차로 바꾸어 생각하는 방법은? (○○○ 사고)", answers: ["알고리즘적 사고", "알고리즘적", "algorithmic thinking"], explain: "Algorithmic Thinking — 입출력 파악 → 작은 단계로 분해 → 순서 배열 → 평가·개선." },

  // algo-conditions
  { kind: "mc", id: "cs-q-ac-1", concept: "algo-conditions", q: "알고리즘이 '유한한 단계를 거친 후 반드시 종료해야 한다'는 조건은?", options: ["명확성", "유한성", "실행 가능성", "효율성"], answer: 1, explain: "Finiteness." },
  { kind: "mc", id: "cs-q-ac-2", concept: "algo-conditions", q: "각 단계가 실제로 수행 가능한 연산이어야 한다는 조건의 영어 이름은?", options: ["Definiteness", "Finiteness", "Effectiveness", "Correctness"], answer: 2, explain: "Effectiveness = 실행 가능성." },
  { kind: "ox", id: "cs-q-ac-3", concept: "algo-conditions", q: "몇 개의 입력에서 정답이 나오면 그 알고리즘은 정확하다고 할 수 있다.", answer: false, explain: "정확성은 모든 유효한 입력에 대해 올바른 결과를 보장하는 것." },
  { kind: "mc", id: "cs-q-ac-4", concept: "algo-conditions", q: "'잘못된 입력이나 예상하지 못한 상황을 처리하는가?'를 묻는 평가 항목은?", options: ["효율성", "견고성", "확장성", "유지보수성"], answer: 1, explain: "프로그램 관점의 견고성. 확장성은 시스템 관점(데이터·사용자 증가)." },
  { kind: "ox", id: "cs-q-ac-5", concept: "algo-conditions", q: "시간 효율성은 실제 실행 시간이 환경에 따라 달라지므로 보통 연산량의 증가 정도를 중심으로 평가한다.", answer: true, explain: "입력 크기가 커질 때 계산량이 어떻게 늘어나는지를 본다." },
  { kind: "mc", id: "cs-q-ac-6", concept: "algo-conditions", q: "공간 효율성을 평가할 때 고려하지 않아도 되는 것은?", options: ["입력 데이터", "실행 중 추가로 쓰는 변수", "추가 자료구조", "모니터 해상도"], answer: 3, explain: "입력 데이터뿐 아니라 추가 변수와 자료구조까지 본다." },

  // euclid
  { kind: "short", id: "cs-q-eu-1", concept: "euclid", q: "유클리드 호제법으로 gcd(48, 18)을 구하라.", answers: ["6"], hint: "숫자만", explain: "48%18 = 12 → 18%12 = 6 → 12%6 = 0 → 6." },
  { kind: "mc", id: "cs-q-eu-2", concept: "euclid", q: "유클리드 호제법의 핵심 성질은?", options: ["gcd(m, n) = gcd(m − n, n)만 성립", "gcd(m, n) = gcd(n, m mod n)", "gcd(m, n) = m × n", "gcd(m, 0) = 0"], answer: 1, explain: "n = 0이면 gcd(m, 0) = m." },
  { kind: "mc", id: "cs-q-eu-3", concept: "euclid", q: "m = 48, n = 18로 시작할 때 두 번째 반복이 끝난 직후 (m, n)은?", options: ["(48, 18)", "(18, 12)", "(12, 6)", "(6, 0)"], answer: 2, explain: "1회 후 (18, 12), 2회 후 (12, 6), 3회 후 (6, 0)." },
  { kind: "mc", id: "cs-q-eu-4", concept: "euclid", q: "1,000,000과 999,999의 최대공약수를 유클리드 호제법으로 구할 때 나머지 계산 횟수는?", options: ["1회", "2회", "999,999회", "1,000,000회"], answer: 1, explain: "1,000,000 mod 999,999 = 1, 999,999 mod 1 = 0." },
  { kind: "ox", id: "cs-q-eu-5", concept: "euclid", q: "유클리드 호제법에서 중요한 점은 '반복문을 썼다'는 것보다 각 반복에서 문제가 더 작은 문제로 축소된다는 점이다.", answer: true, explain: "기존 문제를 더 단순한 문제로 바꾸는 전략." },
  { kind: "mc", id: "cs-q-eu-6", concept: "euclid", q: "48과 18의 최대공약수를 '18부터 거꾸로 확인'하는 방법으로 구하면 몇 개의 후보를 확인하는가?", options: ["6개", "12개", "13개", "18개"], answer: 2, explain: "18, 17, …, 6 → 13개. 1부터는 18개, 유클리드는 3회." },
  { kind: "ox", id: "cs-q-eu-7", concept: "euclid", q: "유클리드 호제법 함수가 종료될 때 최대공약수는 변수 n에 들어 있다.", answer: false, explain: "n이 0이 되면 종료하고 m을 반환한다." },

  // compile-run
  { kind: "mc", id: "cs-q-cr-1", concept: "compile-run", q: "C 소스가 실행 파일이 되는 순서로 옳은 것은?", options: ["컴파일 → 전처리 → 링킹 → 어셈블", "전처리 → 컴파일 → 어셈블 → 링킹", "어셈블 → 컴파일 → 전처리 → 링킹", "링킹 → 전처리 → 컴파일 → 어셈블"], answer: 1, explain: "전처리(#include) → 컴파일(어셈블리) → 어셈블(목적 파일) → 링킹(실행 파일)." },
  { kind: "mc", id: "cs-q-cr-2", concept: "compile-run", q: "목적 파일들을 결합하고 라이브러리의 외부 참조를 해결해 실행 파일을 만드는 단계는?", options: ["전처리", "컴파일", "어셈블", "링킹"], answer: 3, explain: "Linking." },
  { kind: "mc", id: "cs-q-cr-3", concept: "compile-run", q: "실행할 코드와 데이터를 프로세스의 메모리 공간에 배치하는 것은?", options: ["링커", "로더", "어셈블러", "전처리기"], answer: 1, explain: "OS가 프로세스와 실행 자원을 구성하고, 로더가 메모리에 배치한다." },
  { kind: "ox", id: "cs-q-cr-4", concept: "compile-run", q: "CPU는 C 소스 코드를 직접 읽어 실행한다.", answer: false, explain: "CPU는 메모리에 준비된 기계어 명령어를 실행한다." },
  { kind: "mc", id: "cs-q-cr-5", concept: "compile-run", q: "실행 파일과 프로세스에 대한 설명으로 옳지 않은 것은?", options: ["실행 파일은 저장장치에 있는 정적 파일이다", "프로세스는 PID로 구분된다", "하나의 실행 파일을 여러 번 실행하면 독립된 프로세스가 여러 개 생길 수 있다", "실행 파일은 스스로 CPU 시간과 메모리를 할당받는다"], answer: 3, explain: "실행 파일은 자원을 쓰지 않는다. 자원은 프로세스가 할당받는다." },
  { kind: "short", id: "cs-q-cr-6", concept: "compile-run", q: "컴파일 단계에서 전처리된 C 소스는 무엇으로 변환되는가? (○○○ 코드)", answers: ["어셈블리", "어셈블리 코드", "assembly"], explain: "그다음 어셈블 단계에서 목적 파일이 된다." },
  { kind: "ox", id: "cs-q-cr-7", concept: "compile-run", q: "프로그램은 운영체제 기능이 필요할 때 시스템 호출로 커널에 서비스를 요청한다.", answer: true, explain: "사용자 공간 → 시스템 호출 → 커널 공간." },

  // abstraction
  { kind: "short", id: "cs-q-ab-1", concept: "abstraction", q: "int 4바이트 배열의 시작 주소가 1000일 때 arr[5]의 주소는?", answers: ["1020"], hint: "숫자만", explain: "시작 주소 + i × 원소 크기 = 1000 + 5 × 4." },
  { kind: "mc", id: "cs-q-ab-2", concept: "abstraction", q: "도메인 이름으로 서버에 접속할 때 IP 주소를 찾아 주는 것은?", options: ["MMU", "DNS", "DMA", "PCB"], answer: 1, explain: "도메인 이름 → DNS가 IP 확인 → OS 네트워크 기능으로 연결." },
  { kind: "mc", id: "cs-q-ab-3", concept: "abstraction", q: "printf()가 감추는 내부 처리가 아닌 것은?", options: ["형식 변환", "버퍼링", "운영체제의 입출력 처리", "배열 원소 주소 계산"], answer: 3, explain: "주소 계산은 arr[i] 접근이 감추는 일." },
  { kind: "ox", id: "cs-q-ab-4", concept: "abstraction", q: "arr[5]는 배열의 다섯 번째 원소를 의미한다.", answer: false, explain: "인덱스는 0부터라 arr[5]는 여섯 번째 원소." },
  { kind: "mc", id: "cs-q-ab-5", concept: "abstraction", q: "fopen()으로 파일을 열면 프로그램이 받아 쓰는 것은?", options: ["파일의 물리적 섹터 번호", "FILE *", "IP 주소", "PID"], answer: 1, explain: "OS가 존재·권한을 확인하고, 라이브러리가 FILE *를 돌려준다." },
  { kind: "ox", id: "cs-q-ab-6", concept: "abstraction", q: "printf()의 출력은 표준 출력 stdout에 기록되며, stdout은 보통 터미널이지만 파일로 바꿀 수도 있다.", answer: true, explain: "추상화 사례 1." },

  // computing-history
  { kind: "mc", id: "cs-q-hi-1", concept: "computing-history", q: "19세기에 천공카드로 명령어와 데이터를 입력하는 범용 기계식 계산 장치를 설계한 사람은?", options: ["블레즈 파스칼", "라이프니츠", "찰스 배비지", "폰 노이만"], answer: 2, explain: "해석기관(Analytical Engine) — 완성되지는 않았다." },
  { kind: "mc", id: "cs-q-hi-2", concept: "computing-history", q: "ENIAC에 대한 설명으로 옳지 않은 것은?", options: ["1940년대 초기 범용 전자식 디지털 컴퓨터다", "약 18,000개의 진공관을 사용했다", "프로그램을 바꾸려면 케이블과 스위치를 변경해야 했다", "프로그램을 메모리에 저장해 쉽게 바꿀 수 있었다"], answer: 3, explain: "그 한계를 해결한 것이 저장 프로그램 방식." },
  { kind: "mc", id: "cs-q-hi-3", concept: "computing-history", q: "17세기에 덧셈·뺄셈·곱셈·나눗셈을 수행한 기계식 계산기는?", options: ["주판", "파스칼의 계산기", "라이프니츠의 계산기", "해석기관"], answer: 2, explain: "파스칼 계산기는 덧셈·뺄셈만." },
  { kind: "mc", id: "cs-q-hi-4", concept: "computing-history", q: "전자소자의 발전 순서로 옳은 것은?", options: ["트랜지스터 → 진공관 → IC → 마이크로프로세서", "진공관 → 트랜지스터 → 집적회로 → 마이크로프로세서", "진공관 → IC → 트랜지스터 → 마이크로프로세서", "IC → 진공관 → 트랜지스터 → 마이크로프로세서"], answer: 1, explain: "마이크로프로세서 = CPU의 주요 기능을 칩 하나에." },
  { kind: "ox", id: "cs-q-hi-5", concept: "computing-history", q: "해석기관은 완성되지 않았지만 연산·저장·입출력 장치와 프로그램에 따른 제어라는 현대 컴퓨터의 기본 개념을 보여 주었다.", answer: true, explain: "같은 기계에서 명령어만 바꿔 다른 작업을 한다는 생각의 출발점." },
  { kind: "ox", id: "cs-q-hi-6", concept: "computing-history", q: "저장 프로그램 방식에서는 프로그램을 바꾸려면 기계의 배선을 변경해야 한다.", answer: false, explain: "배선 변경 없이 다른 프로그램을 메모리에 적재하면 된다." },

  // parallel-hetero
  { kind: "short", id: "cs-q-ph-1", concept: "parallel-hetero", q: "순차 작업 20초, 코어에 나눌 수 있는 작업 80초인 프로그램을 4코어로 실행하면 전체 실행시간은 몇 초인가?", answers: ["40", "40초"], hint: "숫자만", explain: "20 + 80/4 = 40초 → 2.5배." },
  { kind: "mc", id: "cs-q-ph-2", concept: "parallel-hetero", q: "같은 조건에서 8코어일 때 속도 향상은?", options: ["8배", "약 3.33배", "2.5배", "약 1.67배"], answer: 1, explain: "20 + 10 = 30초 → 100/30 ≈ 3.33배." },
  { kind: "mc", id: "cs-q-ph-3", concept: "parallel-hetero", q: "멀티코어 CPU가 코어 수만큼 빨라지지 않는 이유가 아닌 것은?", options: ["순차 작업은 나눌 수 없다", "작업을 나누고 합치는 데 시간이 든다", "메모리·I/O를 함께 쓰며 기다린다", "코어가 많을수록 각 코어의 클록이 자동으로 0이 된다"], answer: 3, explain: "앞의 세 가지가 교안의 이유." },
  { kind: "mc", id: "cs-q-ph-4", concept: "parallel-hetero", q: "'많은 단순한 연산 장치로 같은 계산을 많은 데이터에 동시에 수행'하는 장치는?", options: ["멀티코어 CPU", "GPU", "SSD 컨트롤러", "MMU"], answer: 1, explain: "CPU는 소수의 강력한 코어, 조건 판단·전체 실행 관리." },
  { kind: "mc", id: "cs-q-ph-5", concept: "parallel-hetero", q: "TPU에 대한 설명으로 옳은 것은?", options: ["신경망 처리장치를 가리키는 일반 명칭이다", "Google이 설계한 텐서 연산 중심의 AI 가속기다", "그래픽 전용 처리장치다", "저장장치 컨트롤러다"], answer: 1, explain: "일반 명칭은 NPU." },
  { kind: "ox", id: "cs-q-ph-6", concept: "parallel-hetero", q: "CPU 코어와 GPU는 항상 1:1로 연결되어 작업한다.", answer: false, explain: "여러 CPU 코어가 준비하고 하나의 GPU 내부 많은 연산 장치가 계산할 수 있다." },
  { kind: "short", id: "cs-q-ph-7", concept: "parallel-hetero", q: "서로 다른 처리장치(CPU·GPU 등)가 작업 특성에 따라 역할을 나누어 처리하는 방식은? (○○○ 컴퓨팅)", answers: ["이기종", "이기종 컴퓨팅", "heterogeneous"], explain: "Heterogeneous computing." },
  { kind: "ox", id: "cs-q-ph-8", concept: "parallel-hetero", q: "전용 AI 가속기는 GPU보다 범용성은 낮지만 AI 연산 효율과 전력 효율이 높도록 설계된다.", answer: true, explain: "GPU = 범용 병렬, AI 가속기 = 행렬·텐서 특화." },

  // bit-pattern
  { kind: "mc", id: "cs-q-bp-1", concept: "bit-pattern", q: "비트패턴 01000001을 ASCII 문자로 해석하면?", options: ["a", "A", "1", "@"], answer: 1, explain: "정수로는 65, ASCII로는 'A'." },
  { kind: "ox", id: "cs-q-bp-2", concept: "bit-pattern", q: "비트패턴 자체에는 의미가 정해져 있지 않고, 해석 규칙에 따라 의미가 달라진다.", answer: true, explain: "숫자·문자·이미지·오디오 무엇이든 될 수 있다." },
  { kind: "short", id: "cs-q-bp-3", concept: "bit-pattern", q: "8비트로 만들 수 있는 서로 다른 비트패턴의 개수는?", answers: ["256"], hint: "숫자만", explain: "2⁸ = 256." },
  { kind: "mc", id: "cs-q-bp-4", concept: "bit-pattern", q: "정보의 최소 단위는?", options: ["바이트", "비트", "워드", "셀"], answer: 1, explain: "bit = binary digit. 1바이트 = 8비트." },

  // boolean-gate
  { kind: "mc", id: "cs-q-bg-1", concept: "boolean-gate", q: "두 입력이 서로 다를 때만 1을 출력하는 연산은?", options: ["AND", "OR", "XOR", "NOT"], answer: 2, explain: "XOR(배타적 OR)." },
  { kind: "mc", id: "cs-q-bg-2", concept: "boolean-gate", q: "F = (A AND B) OR (NOT C)에서 A = 1, B = 0, C = 1일 때 F는?", options: ["0", "1", "정의되지 않음", "2"], answer: 0, explain: "A AND B = 0, NOT C = 0 → 0 OR 0 = 0." },
  { kind: "mc", id: "cs-q-bg-3", concept: "boolean-gate", q: "G = (A AND NOT B) OR (NOT A AND B)는 어떤 게이트 하나와 같은가?", options: ["AND", "OR", "XOR", "NAND"], answer: 2, explain: "진리표 0, 1, 1, 0." },
  { kind: "ox", id: "cs-q-bg-4", concept: "boolean-gate", q: "부울 연산은 덧셈·곱셈 같은 산술 연산의 일종이다.", answer: false, explain: "참·거짓을 다루는 논리 연산이다." },
  { kind: "mc", id: "cs-q-bg-5", concept: "boolean-gate", q: "'부울 연산을 하드웨어로 구현한 기본 전자회로'는?", options: ["플립플롭", "논리 게이트", "레지스터", "버스"], answer: 1, explain: "부울 연산 = 규칙, 논리 게이트 = 그 회로." },
  { kind: "short", id: "cs-q-bg-6", concept: "boolean-gate", q: "'부울(Boolean)'이라는 이름은 어느 수학자에서 유래했는가? (성)", answers: ["boole", "george boole", "불", "부울"], explain: "영국의 수학자 George Boole." },
  { kind: "ox", id: "cs-q-bg-7", concept: "boolean-gate", q: "논리 게이트가 연결되어 논리회로를 이루고, 논리회로가 모여 CPU의 연산과 제어 기능을 구현한다.", answer: true, explain: "게이트 → 회로 → CPU." },

  // flipflop-register
  { kind: "mc", id: "cs-q-ff-1", concept: "flipflop-register", q: "플립플롭 하나가 저장하는 정보의 양은?", options: ["1비트", "4비트", "8비트", "1바이트"], answer: 0, explain: "여러 개를 묶으면 레지스터." },
  { kind: "mc", id: "cs-q-ff-2", concept: "flipflop-register", q: "플립플롭에서 '값을 저장할 때를 알려 주는 신호'는?", options: ["D", "Q", "Clock", "Reset"], answer: 2, explain: "D = 저장할 값, Q = 현재 저장된 값." },
  { kind: "ox", id: "cs-q-ff-3", concept: "flipflop-register", q: "플립플롭 8개를 묶으면 8비트 레지스터가 된다.", answer: true, explain: "여러 비트를 저장하는 회로 = 레지스터." },
  { kind: "ox", id: "cs-q-ff-4", concept: "flipflop-register", q: "플립플롭은 값을 계산하는 회로이고, 논리회로는 값을 기억하는 회로이다.", answer: false, explain: "반대: 논리회로는 계산, 플립플롭은 1비트를 기억." },

  // hex
  { kind: "short", id: "cs-q-hx-1", concept: "hex", q: "1010 0011₂를 16진수로 쓰면? (0x 없이)", answers: ["a3", "0xa3"], explain: "1010 = A, 0011 = 3." },
  { kind: "short", id: "cs-q-hx-2", concept: "hex", q: "0xDA7E를 2진수로 쓰면? (16비트, 띄어쓰기 없이)", answers: ["1101101001111110", "1101 1010 0111 1110"], explain: "D = 1101, A = 1010, 7 = 0111, E = 1110." },
  { kind: "mc", id: "cs-q-hx-3", concept: "hex", q: "16진수 한 자리는 몇 비트에 대응하는가?", options: ["2비트", "3비트", "4비트", "8비트"], answer: 2, explain: "그래서 오른쪽부터 4비트씩 묶어 변환한다." },
  { kind: "ox", id: "cs-q-hx-4", concept: "hex", q: "16진수로 표기하면 컴퓨터 내부에서도 16진수로 저장된다.", answer: false, explain: "내부는 여전히 0과 1, 16진수는 사람을 위한 표기." },
  { kind: "mc", id: "cs-q-hx-5", concept: "hex", q: "16진 표기법의 활용으로 교안에 나오지 않은 것은?", options: ["메모리 주소", "레지스터 값 확인", "색상값", "오디오 샘플링 주파수 단위"], answer: 3, explain: "기계어·비트패턴 분석도 활용 예." },

  // main-memory
  { kind: "mc", id: "cs-q-mm-1", concept: "main-memory", q: "메모리 셀 하나에 보통 저장하는 크기는?", options: ["1비트", "1바이트", "1KB", "4KiB"], answer: 1, explain: "셀마다 0, 1, 2, … 주소가 붙는다." },
  { kind: "ox", id: "cs-q-mm-2", concept: "main-memory", q: "CPU가 메모리에서 값을 읽으면 그 주소의 원래 값은 지워진다.", answer: false, explain: "읽기 후에도 원래 값은 유지된다. 쓰기만 덮어쓴다." },
  { kind: "mc", id: "cs-q-mm-3", concept: "main-memory", q: "1 MB는 몇 바이트인가? (교안 관례)", options: ["10⁶", "2¹⁰", "2²⁰", "2³⁰"], answer: 2, explain: "1 KB = 2¹⁰, 1 MB = 2²⁰, 1 GB = 2³⁰, 1 TB = 2⁴⁰." },
  { kind: "ox", id: "cs-q-mm-4", concept: "main-memory", q: "주기억장치는 레지스터보다 훨씬 많이 저장하지만 접근 속도는 더 느리다.", answer: true, explain: "레지스터 = CPU 내부의 현재 처리용." },
  { kind: "mc", id: "cs-q-mm-5", concept: "main-memory", q: "'주소 768번지에 34를 저장하라'는 어떤 동작인가?", options: ["읽기", "쓰기", "인출", "해석"], answer: 1, explain: "CPU가 주소와 데이터를 함께 전달한다." },

  // ram-rom
  { kind: "mc", id: "cs-q-rr-1", concept: "ram-rom", q: "전원을 끄면 내용이 사라지는 메모리는?", options: ["ROM", "RAM", "SSD", "플래시 메모리"], answer: 1, explain: "RAM = 휘발성." },
  { kind: "ox", id: "cs-q-rr-2", concept: "ram-rom", q: "ROM은 주소를 이용해 원하는 위치에 접근할 수 없다.", answer: false, explain: "RAM과 ROM 모두 주소로 접근해 읽을 수 있다." },
  { kind: "mc", id: "cs-q-rr-3", concept: "ram-rom", q: "ROM에 주로 저장되는 것은?", options: ["실행 중인 프로그램과 데이터", "부팅·초기화에 필요한 기본 프로그램", "사용자 문서 파일", "캐시 블록"], answer: 1, explain: "전원이 꺼져도 유지되어야 하는 기본 프로그램." },

  // secondary-storage
  { kind: "mc", id: "cs-q-ss-1", concept: "secondary-storage", q: "저장 원리가 '자기'인 장치는?", options: ["SSD", "Blu-ray", "HDD", "SD 카드"], answer: 2, explain: "SSD·SD = 반도체(플래시), Blu-ray = 광학." },
  { kind: "mc", id: "cs-q-ss-2", concept: "secondary-storage", q: "보조기억장치에 대한 설명으로 옳지 않은 것은?", options: ["비휘발성이다", "주기억장치보다 용량이 크다", "비트당 가격이 낮다", "주기억장치보다 빠르다"], answer: 3, explain: "상대적으로 느리다." },
  { kind: "ox", id: "cs-q-ss-3", concept: "secondary-storage", q: "프로그램을 실행하면 보조기억장치의 프로그램이 주기억장치로 옮겨지고, CPU는 주기억장치에 적재된 명령어를 처리한다.", answer: true, explain: "주기억장치 = 작업 공간, 보조기억장치 = 보관 공간." },
  { kind: "mc", id: "cs-q-ss-4", concept: "secondary-storage", q: "영화·게임 배포와 오프라인 보관에 적합하지만 용량이 작고 전용 드라이브가 필요한 장치는?", options: ["HDD", "SSD", "USB 메모리", "광학 디스크"], answer: 3, explain: "CD·DVD·Blu-ray." },

  // hdd
  { kind: "mc", id: "cs-q-hd-1", concept: "hdd", q: "HDD에서 헤드가 원하는 트랙으로 이동하는 데 걸리는 시간은?", options: ["탐색 시간", "회전 지연", "전송 시간", "응답 시간"], answer: 0, explain: "Seek time. 회전 지연 = 섹터가 돌아오는 시간." },
  { kind: "mc", id: "cs-q-hd-2", concept: "hdd", q: "플래터 위의 동심원 형태 경로는?", options: ["섹터", "트랙", "실린더 헤드", "스핀들"], answer: 1, explain: "섹터는 트랙을 나눈 저장 영역." },
  { kind: "ox", id: "cs-q-hd-3", concept: "hdd", q: "HDD는 헤드 이동과 플래터 회전이 필요해 기계적 지연이 생긴다.", answer: true, explain: "SSD는 움직이는 부품이 없다." },
  { kind: "short", id: "cs-q-hd-4", concept: "hdd", q: "원하는 섹터가 회전해 헤드 아래로 오기까지 걸리는 시간은? (회전 ○○)", answers: ["회전 지연", "지연", "rotational latency"], explain: "Rotational latency." },

  // flash-ssd
  { kind: "mc", id: "cs-q-fs-1", concept: "flash-ssd", q: "M.2에 대한 설명으로 옳은 것은?", options: ["SSD의 통신 규격이다", "저장장치의 크기와 연결 형태를 나타내는 규격이다", "M.2 SSD는 모두 NVMe다", "SATA보다 항상 느리다"], answer: 1, explain: "M.2 형태로 SATA·NVMe 모두 가능." },
  { kind: "mc", id: "cs-q-fs-2", concept: "flash-ssd", q: "NVMe SSD가 주로 사용하는 인터페이스는?", options: ["SATA", "USB 2.0", "PCIe", "FireWire"], answer: 2, explain: "SATA보다 지연이 짧고 빠르다." },
  { kind: "ox", id: "cs-q-fs-3", concept: "flash-ssd", q: "SSD 컨트롤러는 쓰기가 특정 위치에 집중되지 않도록 조절해 수명을 관리한다.", answer: true, explain: "저장 위치 관리와 수명 관리." },
  { kind: "ox", id: "cs-q-fs-4", concept: "flash-ssd", q: "플래시 메모리는 쓰기 횟수에 제한이 없다.", answer: false, explain: "반복해서 쓸 수 있지만 쓰기 횟수에 한계가 있다." },
  { kind: "mc", id: "cs-q-fs-5", concept: "flash-ssd", q: "플래시 메모리가 전원이 꺼져도 상태를 유지하는 원리는?", options: ["자기 물질의 방향", "레이저로 만든 홈", "절연막으로 둘러싸인 저장층에 전자를 가둠", "콘덴서를 계속 충전"], answer: 2, explain: "읽기 회로는 전류 흐름 차이로 0과 1을 구분." },
  { kind: "short", id: "cs-q-fs-6", concept: "flash-ssd", q: "SSD를 구성하는 두 요소는 NAND 플래시 메모리와 무엇인가?", answers: ["컨트롤러", "ssd 컨트롤러", "controller"], explain: "SSD = NAND 플래시 + 컨트롤러." },

  // partition-fs
  { kind: "mc", id: "cs-q-pf-1", concept: "partition-fs", q: "사용할 영역에 파일 시스템을 만드는 작업은?", options: ["파티션", "포맷", "부팅", "스풀링"], answer: 1, explain: "파티션 = 공간 나누기, 포맷 = 파일 시스템 만들기." },
  { kind: "mc", id: "cs-q-pf-2", concept: "partition-fs", q: "Windows와 macOS 사이에서 공유하는 USB·외장 SSD에 주로 쓰는 파일 시스템은?", options: ["NTFS", "APFS", "ext4", "exFAT"], answer: 3, explain: "NTFS = Windows, APFS = Apple, ext4 = Linux." },
  { kind: "ox", id: "cs-q-pf-3", concept: "partition-fs", q: "ext4는 Linux 시스템에서 쓰는 대표 파일 시스템이다.", answer: true, explain: "교안 표." },

  // char-code
  { kind: "mc", id: "cs-q-cc-1", concept: "char-code", q: "ASCII에 대한 설명으로 옳지 않은 것은?", options: ["7비트 코드다", "0~127 번호를 쓴다", "제어 문자를 포함한다", "한글을 표현할 수 있다"], answer: 3, explain: "한글처럼 정의되지 않은 문자는 표현할 수 없다." },
  { kind: "mc", id: "cs-q-cc-2", concept: "char-code", q: "UTF-8에서 한글 한 글자는 일반적으로 몇 바이트인가?", options: ["1", "2", "3", "4"], answer: 2, explain: "ASCII 문자는 1바이트, 전체로는 1~4바이트." },
  { kind: "ox", id: "cs-q-cc-3", concept: "char-code", q: "유니코드는 각 문자를 저장할 바이트 수까지 직접 정한다.", answer: false, explain: "유니코드는 번호(코드 포인트)만, 바이트로 바꾸는 것은 UTF-8 같은 인코딩." },
  { kind: "short", id: "cs-q-cc-4", concept: "char-code", q: "'가'의 유니코드 코드 포인트는? (U+ 형식)", answers: ["u+ac00", "ac00"], explain: "A = U+0041, 😀 = U+1F600." },
  { kind: "ox", id: "cs-q-cc-5", concept: "char-code", q: "UTF-8에서 ASCII 문자는 기존 ASCII와 같은 1바이트로 표현된다.", answer: true, explain: "하위 호환." },

  // string-vs-number
  { kind: "mc", id: "cs-q-sn-1", concept: "string-vs-number", q: "문자열 \"25\"를 ASCII로 저장한 비트패턴은?", options: ["00011001", "00110010 00110101", "00100101", "00110101 00110010"], answer: 1, explain: "'2' = 50 = 00110010, '5' = 53 = 00110101. 정수 25는 00011001." },
  { kind: "short", id: "cs-q-sn-2", concept: "string-vs-number", q: "문자 '2'의 ASCII 코드값은? (10진수)", answers: ["50"], hint: "숫자만", explain: "'0' = 48부터 시작." },
  { kind: "ox", id: "cs-q-sn-3", concept: "string-vs-number", q: "전화번호처럼 계산하지 않는 숫자는 문자열로 다루는 것이 자연스럽다.", answer: true, explain: "문자열은 화면 표시·이름·전화번호용." },
  { kind: "mc", id: "cs-q-sn-4", concept: "string-vs-number", q: "8비트 부호 있는 정수의 표현 범위는?", options: ["0~255", "−128~127", "−127~128", "−255~255"], answer: 1, explain: "부호 없는 경우 0~255." },
  { kind: "ox", id: "cs-q-sn-5", concept: "string-vs-number", q: "0.1 + 0.2는 컴퓨터에서 항상 정확히 0.3으로 저장된다.", answer: false, explain: "0.1은 2진수에서 무한 반복 → 가장 가까운 값으로 근사." },

  // image
  { kind: "short", id: "cs-q-im-1", concept: "image", q: "RGB 24비트 색상을 쓰는 1,920×1,080 이미지의 압축 전 크기는 약 몇 MB인가? (소수 첫째 자리)", answers: ["6.2", "6.2mb", "약 6.2"], explain: "1,920 × 1,080 × 24 ≈ 49.8M비트 ÷ 8 ≈ 6.2MB." },
  { kind: "mc", id: "cs-q-im-2", concept: "image", q: "RGB (255, 255, 0)이 나타내는 색은?", options: ["흰색", "빨강", "노랑", "청록"], answer: 2, explain: "빨강 + 초록." },
  { kind: "mc", id: "cs-q-im-3", concept: "image", q: "벡터 이미지에 대한 설명으로 옳지 않은 것은?", options: ["도형을 그리는 방법을 저장한다", "확대해도 경계가 선명하다", "복잡한 질감의 사진 표현에 적합하다", "대표 형식은 SVG다"], answer: 2, explain: "사진에는 래스터가 적합." },
  { kind: "ox", id: "cs-q-im-3b", concept: "image", q: "래스터 이미지를 크게 확대하면 원본에 없던 세부 정보가 새로 생긴다.", answer: false, explain: "픽셀화가 일어날 뿐 세부 정보는 생기지 않는다." },
  { kind: "short", id: "cs-q-im-4", concept: "image", q: "디지털 이미지를 구성하는 가장 작은 단위는?", answers: ["픽셀", "pixel", "화소"], explain: "래스터 이미지는 픽셀의 격자." },
  { kind: "mc", id: "cs-q-im-5", concept: "image", q: "RGB 각 성분 8비트, 픽셀당 24비트로 표현할 수 있는 색의 수는 약?", options: ["256가지", "65,536가지", "약 1,677만 가지", "약 42억 가지"], answer: 2, explain: "2²⁴ ≈ 16,777,216." },

  // compression
  { kind: "short", id: "cs-q-co-1", concept: "compression", q: "차분 부호화로 23, 24, 25, 25를 표현하면? (쉼표로)", answers: ["23,1,1,0", "23, 1, 1, 0"], explain: "첫 값 다음부터 이전 값과의 차이." },
  { kind: "mc", id: "cs-q-co-2", concept: "compression", q: "반복 길이 부호화로 0,0,0,0,0,1,1,1을 표현하면?", options: ["(5,0)(3,1)", "(0,5)(1,3)", "0513", "(0,1)(5,3)"], answer: 1, explain: "(값, 반복 횟수)." },
  { kind: "short", id: "cs-q-co-3", concept: "compression", q: "허프만 코드 e = 0, g = 10, s = 11로 'geese'를 부호화하면?", answers: ["1000110"], explain: "g(10) e(0) e(0) s(11) e(0)." },
  { kind: "mc", id: "cs-q-co-4", concept: "compression", q: "투명도를 지원하는 무손실 래스터 형식은?", options: ["JPEG", "PNG", "SVG", "MP3"], answer: 1, explain: "JPEG는 손실·투명도 미지원, SVG는 벡터." },
  { kind: "mc", id: "cs-q-co-5", concept: "compression", q: "최대 256색에 애니메이션을 지원하는 형식은?", options: ["GIF", "JPEG", "PNG", "SVG"], answer: 0, explain: "간단한 애니메이션에 쓰인다." },
  { kind: "ox", id: "cs-q-co-6", concept: "compression", q: "손실 압축은 압축률이 높을수록 화질 저하가 커질 수 있다.", answer: true, explain: "사람이 알아차리기 어려운 정보를 줄인다." },
  { kind: "ox", id: "cs-q-co-7", concept: "compression", q: "허프만 부호화는 자주 나타나는 값에 긴 비트 코드를 준다.", answer: false, explain: "자주 나오는 값에 짧은 코드." },

  // video
  { kind: "mc", id: "cs-q-vi-1", concept: "video", q: "다음 중 컨테이너 형식이 아닌 것은?", options: ["MP4", "MKV", "H.264", "WebM"], answer: 2, explain: "H.264는 비디오 코덱." },
  { kind: "mc", id: "cs-q-vi-2", concept: "video", q: "연속된 프레임에서 배경처럼 변하지 않는 부분이 반복되는 현상은?", options: ["공간적 중복", "시간적 중복", "Skew", "양자화"], answer: 1, explain: "달라진 부분을 중심으로 저장해 줄인다." },
  { kind: "ox", id: "cs-q-vi-3", concept: "video", q: "같은 MP4 파일이라도 내부의 영상 코덱은 서로 다를 수 있다.", answer: true, explain: "video1.mp4 = H.264 + AAC, video2.mp4 = H.265 + AAC." },
  { kind: "short", id: "cs-q-vi-4", concept: "video", q: "1초 동안 보여 주는 프레임 수의 단위는? (영문 약자)", answers: ["fps"], explain: "frames per second." },
  { kind: "mc", id: "cs-q-vi-5", concept: "video", q: "영상·오디오를 압축하고 복원하는 '규칙'은?", options: ["컨테이너", "코덱", "확장자", "파일 시스템"], answer: 1, explain: "컨테이너 = 여러 데이터를 하나의 파일에 담는 형식." },
  { kind: "ox", id: "cs-q-vi-6", concept: "video", q: "AAC와 MP3는 비디오 코덱이다.", answer: false, explain: "오디오 코덱. 비디오 코덱은 H.264, H.265, AV1." },

  // audio
  { kind: "short", id: "cs-q-au-1", concept: "audio", q: "44.1 kHz, 16비트, 스테레오 1초 분량의 압축 전 데이터는 몇 바이트인가?", answers: ["176400", "176,400"], hint: "숫자만", explain: "44,100 × 16 × 2 = 1,411,200비트 ÷ 8." },
  { kind: "mc", id: "cs-q-au-2", concept: "audio", q: "디지털 오디오 변환 순서로 옳은 것은?", options: ["샘플링 → 변환 → 부호화 → 양자화", "변환 → 샘플링 → 양자화 → 부호화", "양자화 → 샘플링 → 부호화 → 변환", "변환 → 양자화 → 샘플링 → 부호화"], answer: 1, explain: "전기 신호로 → 일정 간격 측정 → 구간 번호로 → 비트패턴." },
  { kind: "mc", id: "cs-q-au-3", concept: "audio", q: "16비트 비트 깊이로 표현할 수 있는 크기 단계 수는?", options: ["16", "256", "65,536", "1,411,200"], answer: 2, explain: "2¹⁶." },
  { kind: "ox", id: "cs-q-au-4", concept: "audio", q: "PCM은 MP3와 같은 압축 파일 형식이다.", answer: false, explain: "PCM은 소리를 일정 간격으로 측정해 숫자로 표현하는 방식." },
  { kind: "mc", id: "cs-q-au-5", concept: "audio", q: "MIDI 파일에 대한 설명으로 옳은 것은?", options: ["실제 소리를 측정한 값을 저장한다", "데이터양이 오디오 파일보다 크다", "음표·악기·세기·시간 같은 연주 명령을 저장한다", "어떤 장치에서 재생해도 소리가 똑같다"], answer: 2, explain: "재생 장치와 음원에 따라 소리가 달라질 수 있다." },
  { kind: "mc", id: "cs-q-au-6", concept: "audio", q: "원본을 정확히 복원하면서 파일 크기를 줄이는 오디오 저장 방식은?", options: ["WAV", "FLAC", "MP3", "AAC"], answer: 1, explain: "WAV = 주로 비압축, MP3·AAC = 손실." },
  { kind: "ox", id: "cs-q-au-7", concept: "audio", q: "양자화는 샘플 점을 원래 곡선 위가 아니라 가장 가까운 단계선 위로 옮기는 과정이다.", answer: true, explain: "그래서 작은 오차가 생긴다." },

  // binary-conv
  { kind: "short", id: "cs-q-bc-1", concept: "binary-conv", q: "(1101)₂를 10진수로 바꾸면?", answers: ["13"], hint: "숫자만", explain: "8 + 4 + 0 + 1." },
  { kind: "short", id: "cs-q-bc-2", concept: "binary-conv", q: "14를 2진수로 바꾸면?", answers: ["1110"], explain: "나머지 0, 1, 1, 1을 아래에서 위로." },
  { kind: "short", id: "cs-q-bc-3", concept: "binary-conv", q: "00111010 + 00011011을 2진수로 계산하면? (8비트)", answers: ["01010101", "1010101"], explain: "58 + 27 = 85." },
  { kind: "short", id: "cs-q-bc-4", concept: "binary-conv", q: "(101.101)₂를 10진수로 바꾸면?", answers: ["5.625"], explain: "4 + 1 + 0.5 + 0.125." },
  { kind: "ox", id: "cs-q-bc-5", concept: "binary-conv", q: "10진수를 2진수로 바꿀 때 2로 나눈 나머지를 위에서 아래로 읽는다.", answer: false, explain: "아래에서 위로(마지막 나머지가 최상위 비트)." },
  { kind: "mc", id: "cs-q-bc-6", concept: "binary-conv", q: "2진 덧셈에서 1 + 1 + 1의 결과는?", options: ["0을 쓰고 1을 올림", "1을 쓰고 1을 올림", "1을 쓰고 올림 없음", "0을 쓰고 2를 올림"], answer: 1, explain: "11₂." },

  // twos-complement
  { kind: "short", id: "cs-q-tc-1", concept: "twos-complement", q: "4비트 2의 보수로 −3을 표현하면?", answers: ["1101"], explain: "0011 → 반전 1100 → +1 = 1101." },
  { kind: "mc", id: "cs-q-tc-2", concept: "twos-complement", q: "4비트 1111을 2의 보수로 해석한 값은?", options: ["15", "−1", "−7", "−15"], answer: 1, explain: "부호 없는 정수로는 15." },
  { kind: "mc", id: "cs-q-tc-3", concept: "twos-complement", q: "n비트 2의 보수의 표현 범위는?", options: ["0 ~ 2ⁿ − 1", "−2ⁿ ~ 2ⁿ", "−2ⁿ⁻¹ ~ 2ⁿ⁻¹ − 1", "−(2ⁿ⁻¹ − 1) ~ 2ⁿ⁻¹"], answer: 2, explain: "4비트 −8~7." },
  { kind: "ox", id: "cs-q-tc-4", concept: "twos-complement", q: "2의 보수에서 음수가 양수보다 하나 더 많은 이유는 양수 영역에 0이 포함되기 때문이다.", answer: true, explain: "0000은 0." },
  { kind: "mc", id: "cs-q-tc-5", concept: "twos-complement", q: "4비트 2의 보수 1111 + 1110의 결과와 그 의미는?", options: ["1101, −3", "11101, 29", "0011, 3", "1001, −7"], answer: 0, explain: "−1 + −2 = −3, 넘친 올림 1은 버린다." },
  { kind: "ox", id: "cs-q-tc-6", concept: "twos-complement", q: "2의 보수에서는 최상위 비트가 1이면 양수다.", answer: false, explain: "0이면 0 또는 양수, 1이면 음수." },
  { kind: "short", id: "cs-q-tc-7", concept: "twos-complement", q: "3비트 2의 보수로 표현할 수 있는 가장 작은 정수는?", answers: ["-4", "−4"], explain: "3비트: −4~3." },

  // overflow
  { kind: "mc", id: "cs-q-ov-1", concept: "overflow", q: "4비트 2의 보수에서 0111 + 0010의 결과 1001은 어떻게 해석되는가?", options: ["9", "−7", "−1", "1"], answer: 1, explain: "양수 + 양수가 음수 → 오버플로." },
  { kind: "ox", id: "cs-q-ov-2", concept: "overflow", q: "부호가 다른 두 수를 더하면 오버플로가 발생할 수 있다.", answer: false, explain: "부호가 다른 수의 덧셈에서는 오버플로가 발생하지 않는다." },
  { kind: "mc", id: "cs-q-ov-3", concept: "overflow", q: "2의 보수 덧셈에서 오버플로를 판정하는 규칙은?", options: ["결과가 0이면 오버플로", "양수 + 양수 = 음수 또는 음수 + 음수 = 양수", "올림수가 생기면 항상 오버플로", "결과의 최하위 비트가 1이면 오버플로"], answer: 1, explain: "결과의 부호가 이상해지면 오버플로." },
  { kind: "ox", id: "cs-q-ov-4", concept: "overflow", q: "오버플로가 일어나도 결과 비트패턴은 존재하지만 실제 값과 다르게 해석된다.", answer: true, explain: "1001이 9가 아니라 −7로 읽힌다." },

  // fixed-float
  { kind: "mc", id: "cs-q-ff2-1", concept: "fixed-float", q: "(101.11)₂를 정규화하면?", options: ["(10.111)₂ × 2¹", "(1.0111)₂ × 2²", "(0.10111)₂ × 2³", "(101.11)₂ × 2⁰"], answer: 1, explain: "맨 앞자리가 1이 되도록." },
  { kind: "short", id: "cs-q-ff2-2", concept: "fixed-float", q: "정수 4비트 + 소수 4비트 고정소수점의 표현 간격은?", answers: ["0.0625", "1/16"], explain: "2⁻⁴ = 0.0625. 범위는 0~15.9375." },
  { kind: "ox", id: "cs-q-ff2-3", concept: "fixed-float", q: "부동소수점은 지수를 바꿔 같은 유효숫자로 매우 크거나 작은 수를 표현할 수 있다.", answer: true, explain: "1.0111 × 2¹⁰ = 1472, × 2⁻⁶ = 0.0224609375." },
  { kind: "mc", id: "cs-q-ff2-4", concept: "fixed-float", q: "5.75를 정수 4비트 + 소수 4비트 고정소수점으로 쓰면?", options: ["0101.1100", "0101.0111", "1.0111", "0110.1100"], answer: 0, explain: "5 = 0101, 0.75 = .1100." },
  { kind: "ox", id: "cs-q-ff2-5", concept: "fixed-float", q: "고정소수점은 구조가 단순하고 표현 범위도 부동소수점보다 넓다.", answer: false, explain: "단순하지만 범위가 제한된다." },

  // ieee754
  { kind: "mc", id: "cs-q-ie-1", concept: "ieee754", q: "IEEE 754 float의 구성으로 옳은 것은?", options: ["부호 1 + 지수 11 + 가수 52", "부호 1 + 지수 8 + 가수 23", "부호 1 + 지수 7 + 가수 24", "부호 2 + 지수 8 + 가수 22"], answer: 1, explain: "double은 1 + 11 + 52, 64비트." },
  { kind: "short", id: "cs-q-ie-2", concept: "ieee754", q: "float에서 실제 지수 2는 지수부에 어떤 8비트로 저장되는가?", answers: ["10000001"], explain: "2 + 127 = 129." },
  { kind: "mc", id: "cs-q-ie-3", concept: "ieee754", q: "double의 지수 바이어스는?", options: ["127", "255", "1,023", "2,047"], answer: 2, explain: "float는 127." },
  { kind: "short", id: "cs-q-ie-4", concept: "ieee754", q: "(101.11)₂를 float 32비트로 쓰면? (공백 없이 32자리)", answers: ["01000000101110000000000000000000", "0 10000001 01110000000000000000000"], explain: "부호 0, 지수 10000001, 가수 0111 + 0 채움." },
  { kind: "ox", id: "cs-q-ie-5", concept: "ieee754", q: "정규화된 수에서는 유효숫자의 맨 앞 1을 가수부에 저장하지 않는다.", answer: true, explain: "항상 1이라 생략(숨은 비트)." },
  { kind: "mc", id: "cs-q-ie-6", concept: "ieee754", q: "지수부의 비트가 모두 1일 때 표현하는 것은?", options: ["0", "가장 큰 정규화 수", "무한대 또는 NaN", "음수 0만"], answer: 2, explain: "모두 0이면 0 또는 0에 매우 가까운 수." },
  { kind: "mc", id: "cs-q-ie-7", concept: "ieee754", q: "float에서 정규화된 수의 실제 지수 범위는?", options: ["−127 ~ 128", "−126 ~ 127", "0 ~ 255", "−1,022 ~ 1,023"], answer: 1, explain: "저장 지수 1~254 − 127." },
  { kind: "ox", id: "cs-q-ie-8", concept: "ieee754", q: "double로 바꾸면 모든 실수를 정확하게 표현할 수 있다.", answer: false, explain: "오차는 작아지지만 모든 실수를 정확히 표현할 수는 없다." },
  { kind: "short", id: "cs-q-ie-9", concept: "ieee754", q: "실제 지수에 바이어스를 더해 저장하는 지수 표기법은? (○○ 표기법)", answers: ["초과", "초과 표기법", "excess", "excess notation"], explain: "Excess Notation." },
];
