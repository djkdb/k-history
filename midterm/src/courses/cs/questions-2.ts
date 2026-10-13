import type { Question } from "@/lib/types";

/* 3강 */
export const QUESTIONS_2: Question[] = [
  // cpu-parts
  { kind: "mc", id: "cs-q-cp-1", concept: "cpu-parts", q: "명령어를 해석하고 제어 신호를 생성하는 CPU 구성요소는?", options: ["ALU", "제어장치", "레지스터", "캐시"], answer: 1, explain: "ALU는 실제 연산, 레지스터는 임시 저장." },
  { kind: "mc", id: "cs-q-cp-2", concept: "cpu-parts", q: "c = a + b에서 실제로 덧셈을 수행하는 것은?", options: ["제어장치", "ALU", "주기억장치", "버스"], answer: 1, explain: "제어장치는 ALU에 덧셈 신호를 보낼 뿐." },
  { kind: "ox", id: "cs-q-cp-3", concept: "cpu-parts", q: "ALU는 주로 레지스터에 있는 값을 대상으로 연산하므로 연산 전에 값을 레지스터로 가져온다.", answer: true, explain: "레지스터가 메모리보다 훨씬 빠르다." },
  { kind: "mc", id: "cs-q-cp-4", concept: "cpu-parts", q: "CPU의 주요 기능을 하나의 집적회로에 구현한 것은?", options: ["마이크로프로세서", "SoC 컨트롤러", "플립플롭", "펌웨어"], answer: 0, explain: "Microprocessor." },
  { kind: "ox", id: "cs-q-cp-5", concept: "cpu-parts", q: "c = a + b의 결과는 항상 즉시 메모리의 c에 저장된다.", answer: false, explain: "컴파일러 최적화나 변수 생존 범위에 따라 레지스터에 유지할 수도 있다." },
  { kind: "mc", id: "cs-q-cp-6", concept: "cpu-parts", q: "컴퓨터 시스템의 기본 하드웨어 구성에 해당하지 않는 것은?", options: ["CPU", "주기억장치", "버스", "컴파일러"], answer: 3, explain: "CPU·주기억장치·입출력장치·버스. 컴파일러는 소프트웨어." },

  // pc-ir
  { kind: "mc", id: "cs-q-pi-1", concept: "pc-ir", q: "PC(Program Counter)에 저장되는 것은?", options: ["현재 실행 중인 명령어", "다음에 가져올 명령어의 주소", "연산 결과", "스택의 최상단"], answer: 1, explain: "현재 명령어는 IR." },
  { kind: "ox", id: "cs-q-pi-2", concept: "pc-ir", q: "CPU는 메모리에서 가져온 명령어를 먼저 IR에 저장한 뒤 해석한다.", answer: true, explain: "IR = Instruction Register." },
  { kind: "ox", id: "cs-q-pi-3", concept: "pc-ir", q: "조건문이나 반복문이 있어도 PC는 항상 일정한 값만큼 증가한다.", answer: false, explain: "분기 결과에 따라 PC가 다른 주소로 바뀔 수 있다." },
  { kind: "short", id: "cs-q-pi-4", concept: "pc-ir", q: "현재 해석·실행 중인 명령어를 저장하는 레지스터의 약자는?", answers: ["ir", "instruction register", "명령 레지스터"], explain: "IR." },

  // memory-hierarchy
  { kind: "mc", id: "cs-q-mh-1", concept: "memory-hierarchy", q: "기억장치 계층을 CPU에 가까운 순서로 나열한 것은?", options: ["캐시 → 레지스터 → 주기억장치 → 보조기억장치", "레지스터 → 캐시 → 주기억장치 → 보조기억장치", "주기억장치 → 캐시 → 레지스터 → 보조기억장치", "레지스터 → 주기억장치 → 캐시 → 보조기억장치"], answer: 1, explain: "가까울수록 빠르지만 작고 비싸다." },
  { kind: "mc", id: "cs-q-mh-2", concept: "memory-hierarchy", q: "보통 여러 코어가 공유하며 가장 큰 캐시는?", options: ["L1", "L2", "L3", "레지스터"], answer: 2, explain: "L1이 가장 빠르고 작다." },
  { kind: "ox", id: "cs-q-mh-3", concept: "memory-hierarchy", q: "캐시는 처음부터 주기억장치 전체를 복사해 둔다.", answer: false, explain: "요청한 주소 중심으로 필요한 블록을 그때그때 가져온다." },
  { kind: "mc", id: "cs-q-mh-4", concept: "memory-hierarchy", q: "Cache Miss가 났을 때 주기억장치에서 가져오는 단위는?", options: ["요청한 값 1바이트만", "그 값을 포함한 캐시 블록(cache line)", "프로그램 전체", "한 페이지 테이블"], answer: 1, explain: "주변 값도 같이 와서 다음 접근에서 히트 가능성이 높아진다." },
  { kind: "ox", id: "cs-q-mh-5", concept: "memory-hierarchy", q: "기억장치에서 CPU에 가까울수록 비트당 비용이 비싸다.", answer: true, explain: "레지스터가 가장 비싸고 보조기억장치가 저렴." },
  { kind: "short", id: "cs-q-mh-6", concept: "memory-hierarchy", q: "CPU가 요청한 데이터가 캐시에 있는 경우를 무엇이라 하는가? (영어 2단어)", answers: ["cache hit", "hit", "캐시 히트"], explain: "없으면 Cache Miss." },

  // locality
  { kind: "mc", id: "cs-q-lo-1", concept: "locality", q: "반복문의 변수 i와 sum이 계속 다시 쓰이는 것은 어떤 지역성인가?", options: ["시간 지역성", "공간 지역성", "순차 지역성", "논리 지역성"], answer: 0, explain: "한 번 쓴 것을 곧 다시 쓴다." },
  { kind: "mc", id: "cs-q-lo-2", concept: "locality", q: "arr[0]을 가져올 때 arr[1], arr[2]도 같은 캐시 블록에 들어와 히트가 나는 이유는?", options: ["시간 지역성", "공간 지역성", "폰 노이만 병목", "DMA"], answer: 1, explain: "배열은 연속 저장된다." },
  { kind: "ox", id: "cs-q-lo-3", concept: "locality", q: "캐시가 작은 용량으로도 효과적인 이유는 프로그램이 반복 사용과 인접 접근의 특성을 보이기 때문이다.", answer: true, explain: "지역성." },

  // bus
  { kind: "mc", id: "cs-q-bu-1", concept: "bus", q: "'메모리의 어느 위치인가?'를 전달하는 버스는?", options: ["주소 버스", "데이터 버스", "제어 버스", "시스템 버스"], answer: 0, explain: "데이터 버스 = 실제 데이터, 제어 버스 = 읽기·쓰기·인터럽트 신호." },
  { kind: "mc", id: "cs-q-bu-2", concept: "bus", q: "CPU가 메모리 1000번지를 읽을 때의 순서로 옳은 것은?", options: ["데이터 → 주소 → 제어", "주소 버스로 1000 → 제어 버스로 Read → 데이터 버스로 값 전송", "제어 → 데이터 → 주소", "주소 → 데이터 → 제어"], answer: 1, explain: "주소 → 제어 신호 → 데이터." },
  { kind: "ox", id: "cs-q-bu-3", concept: "bus", q: "인터럽트 신호는 제어 버스로 전달되는 정보의 예다.", answer: true, explain: "읽기, 쓰기, 인터럽트 등." },
  { kind: "ox", id: "cs-q-bu-4", concept: "bus", q: "버스는 데이터만 전달하고 주소와 제어 신호는 전달하지 않는다.", answer: false, explain: "주소·데이터·제어 모두 전달." },

  // von-neumann
  { kind: "mc", id: "cs-q-vn-1", concept: "von-neumann", q: "폰 노이만 병목에 대한 설명으로 옳은 것은?", options: ["I/O 장치가 느려 CPU가 데이터를 직접 옮겨야 하는 문제", "CPU 속도에 비해 메모리 접근이 느려 CPU가 기다리는 문제", "코어 수가 많아 발열이 커지는 문제", "프로그램을 바꾸려면 배선을 바꿔야 하는 문제"], answer: 1, explain: "CPU–메모리 사이 제한된 전달 능력." },
  { kind: "mc", id: "cs-q-vn-2", concept: "von-neumann", q: "폰 노이만 병목을 완화하는 방법이 아닌 것은?", options: ["캐시", "메모리 계층", "Prefetching", "DMA"], answer: 3, explain: "DMA는 CPU의 I/O 이동 부담을 줄일 뿐 병목 자체를 해결하지 않는다." },
  { kind: "ox", id: "cs-q-vn-3", concept: "von-neumann", q: "저장 프로그램 방식에서 CPU는 가져온 비트패턴이 명령어인지 데이터인지 실행 상황에 따라 해석한다.", answer: true, explain: "명령어도 데이터처럼 비트패턴으로 저장된다." },
  { kind: "mc", id: "cs-q-vn-4", concept: "von-neumann", q: "폰 노이만 구조의 특징이 아닌 것은?", options: ["명령어와 데이터를 같은 메모리에 저장", "CPU가 메모리에서 명령어를 가져와 실행", "프로그램을 바꿔 다양한 작업 수행", "명령어와 데이터를 서로 다른 메모리에만 저장"], answer: 3, explain: "같은 주기억장치에 함께 저장한다." },

  // machine-instruction
  { kind: "mc", id: "cs-q-mi-1", concept: "machine-instruction", q: "ADD R3, R1, R2에서 결과가 저장되는 곳은?", options: ["R1", "R2", "R3", "메모리"], answer: 2, explain: "R1, R2는 입력 피연산자." },
  { kind: "mc", id: "cs-q-mi-2", concept: "machine-instruction", q: "기계 명령에서 '수행할 동작의 종류'를 나타내는 부분은?", options: ["피연산자", "연산 코드(Opcode)", "주소", "플래그"], answer: 1, explain: "Operand = 대상." },
  { kind: "ox", id: "cs-q-mi-3", concept: "machine-instruction", q: "기계어는 CPU 종류와 관계없이 모든 컴퓨터에서 같다.", answer: false, explain: "CPU 종류마다 기계 명령이 다르다." },
  { kind: "ox", id: "cs-q-mi-4", concept: "machine-instruction", q: "C 코드 한 문장이 여러 개의 기계 명령으로 나뉘어 실행될 수 있다.", answer: true, explain: "c = a + b → LOAD, LOAD, ADD, STORE." },

  // instruction-kinds
  { kind: "mc", id: "cs-q-ik-1", concept: "instruction-kinds", q: "메모리의 값을 레지스터로 가져오는 명령은?", options: ["STORE", "LOAD", "JUMP", "XOR"], answer: 1, explain: "STORE는 레지스터 → 메모리." },
  { kind: "mc", id: "cs-q-ik-2", concept: "instruction-kinds", q: "제어 명령에 해당하는 것은?", options: ["MOV", "ADD", "BNE", "AND"], answer: 2, explain: "조건부 분기. MOV = 이동, ADD·AND = 산술·논리." },
  { kind: "ox", id: "cs-q-ik-3", concept: "instruction-kinds", q: "데이터 이동 명령은 원래 위치의 데이터를 지우고 옮긴다.", answer: false, explain: "값이 복사(copy)된다." },
  { kind: "mc", id: "cs-q-ik-4", concept: "instruction-kinds", q: "C = A / B를 기계 명령으로 쓸 때 DIV 전에 들어가는 단계는?", options: ["R1이 0이면 종료", "R2가 0이면 오류 처리로 이동", "R3를 0으로 초기화", "A와 B를 바꿈"], answer: 1, explain: "0으로 나누기 검사(JUMP R2, DIV_ZERO)." },
  { kind: "mc", id: "cs-q-ik-5", concept: "instruction-kinds", q: "C의 if, while, for를 구현하는 데 쓰이는 명령은?", options: ["데이터 이동", "산술", "조건부 분기", "I/O"], answer: 2, explain: "조건에 따라 다음 실행 명령을 바꾼다." },

  // isa-risc-cisc
  { kind: "mc", id: "cs-q-is-1", concept: "isa-risc-cisc", q: "RISC 계열 ISA가 아닌 것은?", options: ["Arm", "RISC-V", "PowerPC", "x86-64"], answer: 3, explain: "x86/x86-64는 CISC." },
  { kind: "mc", id: "cs-q-is-2", concept: "isa-risc-cisc", q: "'메모리 데이터를 먼저 레지스터로 가져와 연산하고 결과를 필요할 때 저장'하는 구조는?", options: ["Load–Store 구조", "Peer-to-Peer 구조", "폰 노이만 병목", "Host 중심 구조"], answer: 0, explain: "RISC의 특징." },
  { kind: "ox", id: "cs-q-is-3", concept: "isa-risc-cisc", q: "CISC에서는 ADD EAX, [B]처럼 산술 명령어가 메모리 값을 직접 피연산자로 쓸 수 있다.", answer: true, explain: "한 명령어가 메모리 접근 + 연산." },
  { kind: "ox", id: "cs-q-is-4", concept: "isa-risc-cisc", q: "RISC는 항상 단순하고 느린 CPU, CISC는 항상 복잡하고 빠른 CPU를 뜻한다.", answer: false, explain: "차이는 명령어 집합 설계 방식, 현대 CPU는 서로의 장점을 받아들였다." },
  { kind: "mc", id: "cs-q-is-5", concept: "isa-risc-cisc", q: "ISA가 정의하는 내용이 아닌 것은?", options: ["CPU가 이해하는 명령어 종류", "명령어의 비트 형식", "메모리 주소 지정 방식", "운영체제의 화면 테마"], answer: 3, explain: "레지스터, 데이터 표현, 분기·예외 처리도 ISA." },
  { kind: "short", id: "cs-q-is-6", concept: "isa-risc-cisc", q: "CPU, GPU, 메모리 제어기 등 여러 기능을 하나의 칩에 통합한 것을 무엇이라 하는가? (영문 약자)", answers: ["soc", "system on a chip"], explain: "System on a Chip — Apple M, Snapdragon, Exynos." },
  { kind: "mc", id: "cs-q-is-7", concept: "isa-risc-cisc", q: "Arm(기업)에 대한 설명으로 옳은 것은?", options: ["x86 CPU를 직접 생산·판매한다", "CPU 아키텍처와 코어 설계 IP를 개발·제공한다", "CISC ISA를 만든다", "운영체제 회사다"], answer: 1, explain: "ARM 아키텍처 = RISC 계열 ISA." },
  { kind: "ox", id: "cs-q-is-8", concept: "isa-risc-cisc", q: "RISC-V는 개방형(Open) 명령어 집합 아키텍처다.", answer: true, explain: "교안: RISC-V = 개방형 ISA." },

  // virtual-machine-lang
  { kind: "mc", id: "cs-q-vm-1", concept: "virtual-machine-lang", q: "가상 기계어 35A7의 의미는?", options: ["주소 A7의 값을 5번 레지스터에 LOAD", "5번 레지스터의 내용을 주소 A7에 STORE", "값 A7을 5번 레지스터에 넣음", "주소 A7로 분기"], answer: 1, explain: "3RXY = STORE." },
  { kind: "mc", id: "cs-q-vm-2", concept: "virtual-machine-lang", q: "가상 기계어 B04C의 의미는?", options: ["4번 레지스터가 0이면 4C로 분기", "무조건 주소 4C로 분기", "C번 레지스터를 4비트 회전", "0번 레지스터에 4C를 저장"], answer: 1, explain: "R0 = R0은 항상 참." },
  { kind: "mc", id: "cs-q-vm-3", concept: "virtual-machine-lang", q: "가상 기계어 5056이 하는 일은?", options: ["R5 ← R0 + R6", "R0 ← R5 + R6 (2의 보수 덧셈)", "R6 ← R0 + R5", "주소 56에 R0 저장"], answer: 1, explain: "5RST: R ← S + T." },
  { kind: "short", id: "cs-q-vm-4", concept: "virtual-machine-lang", q: "가상 기계어에서 '프로그램을 무조건 멈추는' 명령은? (16진 4자리)", answers: ["c000"], explain: "HALT." },
  { kind: "mc", id: "cs-q-vm-5", concept: "virtual-machine-lang", q: "1RXY와 2RXY의 차이는?", options: ["1RXY는 저장, 2RXY는 읽기", "1RXY는 주소 XY의 값을, 2RXY는 XY 값 자체를 레지스터에 넣는다", "둘은 같다", "1RXY는 덧셈, 2RXY는 뺄셈"], answer: 1, explain: "LOAD R, MEM vs LOAD R, VAL." },
  { kind: "short", id: "cs-q-vm-6", concept: "virtual-machine-lang", q: "3번 레지스터 값을 주소 6E에 저장하는 가상 명령어는? (16진 4자리)", answers: ["336e"], explain: "3RXY → 3 3 6E." },
  { kind: "mc", id: "cs-q-vm-7", concept: "virtual-machine-lang", q: "가상 컴퓨터 명령어에서 Opcode에 쓰이는 비트 수는?", options: ["2비트", "4비트", "8비트", "16비트"], answer: 1, explain: "16개 명령 가능. 나머지 12비트가 피연산자." },
  { kind: "ox", id: "cs-q-vm-8", concept: "virtual-machine-lang", q: "가상 컴퓨터의 범용 레지스터는 16개이고 메모리 셀은 256개다.", answer: true, explain: "레지스터 0~F, 주소 00~FF." },
  { kind: "short", id: "cs-q-vm-9", concept: "virtual-machine-lang", q: "주소 6C의 값을 5번 레지스터로 LOAD하는 가상 명령어는? (16진 4자리)", answers: ["156c"], explain: "1RXY → 1 5 6C." },

  // exec-registers
  { kind: "mc", id: "cs-q-er-1", concept: "exec-registers", q: "연산 결과가 0인지, 음수인지, 자리올림이 있었는지 등을 저장하는 레지스터는?", options: ["PC", "IR", "상태 레지스터", "범용 레지스터"], answer: 2, explain: "Zero·Negative·Carry·Overflow 플래그." },
  { kind: "ox", id: "cs-q-er-2", concept: "exec-registers", q: "상태 레지스터의 정보는 이후 조건 분기 명령어가 다음 명령어를 결정하는 데 쓰인다.", answer: true, explain: "비교 결과가 0이면 이동 → Zero Flag 확인." },
  { kind: "mc", id: "cs-q-er-3", concept: "exec-registers", q: "프로그램을 실행하면 OS가 코드와 데이터를 어디에 적재하는가?", options: ["캐시", "주기억장치(RAM)", "ROM", "레지스터"], answer: 1, explain: "CPU는 RAM의 기계어를 하나씩 읽어 실행." },

  // machine-cycle
  { kind: "mc", id: "cs-q-mc-1", concept: "machine-cycle", q: "기계 주기의 순서는?", options: ["해석 → 인출 → 실행", "인출 → 해석 → 실행", "실행 → 인출 → 해석", "인출 → 실행 → 해석"], answer: 1, explain: "Fetch → Decode → Execute." },
  { kind: "mc", id: "cs-q-mc-2", concept: "machine-cycle", q: "PC가 다음 명령어 주소로 갱신되는 단계는?", options: ["인출", "해석", "실행", "종료 후"], answer: 0, explain: "인출에서 IR에 저장하면서 PC를 갱신한다." },
  { kind: "mc", id: "cs-q-mc-3", concept: "machine-cycle", q: "PC = A4이고 [A4:A5] = 5056일 때, 인출 직후 IR과 PC는? (명령어 2바이트)", options: ["IR = 5056, PC = A4", "IR = 5056, PC = A6", "IR = A4, PC = 5056", "IR = 5056, PC = A5"], answer: 1, explain: "2바이트 명령어라 2 증가." },
  { kind: "ox", id: "cs-q-mc-4", concept: "machine-cycle", q: "해석 단계에서 제어장치가 IR의 비트패턴을 보고 수행할 연산과 피연산자를 결정한다.", answer: true, explain: "LOAD? ADD? JUMP?" },
  { kind: "ox", id: "cs-q-mc-5", concept: "machine-cycle", q: "if, while, for, 함수 호출은 결국 PC 값을 바꾸는 명령어와 관련된다.", answer: true, explain: "흐름 제어 = PC를 어느 주소로 갱신할지의 문제." },
  { kind: "mc", id: "cs-q-mc-6", concept: "machine-cycle", q: "156C, 166D, 5056, 306E, C000을 실행한 뒤 메모리 6E에 들어 있는 값은?", options: ["[6C]", "[6D]", "[6C] + [6D]", "0"], answer: 2, explain: "R5 ← [6C], R6 ← [6D], R0 ← R5 + R6, [6E] ← R0." },
  { kind: "ox", id: "cs-q-mc-7", concept: "machine-cycle", q: "PC는 실행 단계가 끝난 다음에야 증가한다.", answer: false, explain: "인출 단계에서 이미 다음 주소로 갱신된다." },

  // logic-masking
  { kind: "short", id: "cs-q-lm-1", concept: "logic-masking", q: "10110100 AND 11110000의 결과는?", answers: ["10110000"], explain: "상위 4비트만 남는다." },
  { kind: "short", id: "cs-q-lm-2", concept: "logic-masking", q: "0x59(01011001)에서 하위 4비트만 추출하려면 어떤 마스크와 AND하는가? (16진, 0x 포함 가능)", answers: ["0x0f", "0f", "00001111"], explain: "결과 00001001." },
  { kind: "mc", id: "cs-q-lm-3", concept: "logic-masking", q: "특정 비트를 1로 '설정'하는 데 쓰는 연산은?", options: ["AND", "OR", "XOR", "NOT"], answer: 1, explain: "AND = 추출, XOR = 반전." },
  { kind: "short", id: "cs-q-lm-4", concept: "logic-masking", q: "01011001 XOR 00000001의 결과는?", answers: ["01011000"], explain: "최하위 비트만 반전." },
  { kind: "mc", id: "cs-q-lm-5", concept: "logic-masking", q: "정수 n이 홀수인지 판별하는 식은?", options: ["n | 1", "n & 1", "n ^ 0", "~n"], answer: 1, explain: "가장 오른쪽 비트가 1이면 홀수." },
  { kind: "short", id: "cs-q-lm-6", concept: "logic-masking", q: "01011001 | 10000000의 결과는?", answers: ["11011001"], explain: "최상위 비트만 1로 설정, 나머지는 그대로." },
  { kind: "ox", id: "cs-q-lm-7", concept: "logic-masking", q: "논리 연산은 각 비트 위치에 독립적으로 수행된다.", answer: true, explain: "같은 위치의 비트끼리." },
  { kind: "short", id: "cs-q-lm-8", concept: "logic-masking", q: "~01011001의 결과는? (8비트)", answers: ["10100110"], explain: "모든 비트 반전." },

  // shift-rotate
  { kind: "short", id: "cs-q-sr-1", concept: "shift-rotate", q: "8비트 10110010을 왼쪽으로 1비트 회전(ROL)하면?", answers: ["01100101"], explain: "최상위 1이 최하위로." },
  { kind: "short", id: "cs-q-sr-2", concept: "shift-rotate", q: "8비트 10110010을 오른쪽으로 1비트 회전(ROR)하면?", answers: ["01011001"], explain: "최하위 0이 최상위로." },
  { kind: "mc", id: "cs-q-sr-3", concept: "shift-rotate", q: "11110100(−12)을 산술적으로 오른쪽 1비트 이동하면?", options: ["01111010 (122)", "11111010 (−6)", "11101000 (−24)", "01111010 (−6)"], answer: 1, explain: "부호 비트 1을 복제." },
  { kind: "mc", id: "cs-q-sr-4", concept: "shift-rotate", q: "논리적 오른쪽 이동에서 왼쪽 빈자리에 들어가는 값은?", options: ["부호 비트", "항상 0", "밀려난 비트", "항상 1"], answer: 1, explain: "산술 이동은 부호 비트 복제, 회전은 밀려난 비트." },
  { kind: "ox", id: "cs-q-sr-5", concept: "shift-rotate", q: "왼쪽으로 한 칸 이동하면 결과는 항상 정확히 2배가 된다.", answer: false, explain: "비트 폭을 넘으면 상위 비트가 사라진다." },
  { kind: "short", id: "cs-q-sr-6", concept: "shift-rotate", q: "unsigned int x = 12일 때 x >> 2의 값은?", answers: ["3"], hint: "숫자만", explain: "0000 1100 → 0000 0011." },
  { kind: "ox", id: "cs-q-sr-7", concept: "shift-rotate", q: "C에서 음수 signed 정수의 오른쪽 이동 결과는 구현에 따라 다를 수 있어 비트 조작에는 unsigned 형이 안전하다.", answer: true, explain: "uint32_t 등." },
  { kind: "mc", id: "cs-q-sr-8", concept: "shift-rotate", q: "회전 연산의 활용으로 교안에 나온 것은?", options: ["부동소수점 정규화", "암호화 알고리즘의 비트 혼합·해시 함수", "메모리 주소 계산", "파일 시스템 포맷"], answer: 1, explain: "위치 재배치용 연산." },

  // arith-ops
  { kind: "mc", id: "cs-q-ar-1", concept: "arith-ops", q: "4비트에서 7 − 3을 2의 보수로 계산하는 식은?", options: ["0111 − 0011", "0111 + 1101", "0111 + 0011", "1000 + 1101"], answer: 1, explain: "A − B = A + (B의 2의 보수), 결과 (1)0100 = 4." },
  { kind: "short", id: "cs-q-ar-2", concept: "arith-ops", q: "13 × 5를 '13 << 2' + '13'으로 계산한 결과를 2진수로 쓰면?", answers: ["100001", "1000001"], explain: "110100 + 001101 = 100001 = 65. (참고: 65는 7비트로 1000001)" },
  { kind: "mc", id: "cs-q-ar-3", concept: "arith-ops", q: "13 ÷ 3의 몫과 나머지는?", options: ["몫 3, 나머지 4", "몫 4, 나머지 1", "몫 4, 나머지 0", "몫 3, 나머지 1"], answer: 1, explain: "몫 0100, 나머지 0001." },
  { kind: "mc", id: "cs-q-ar-4", concept: "arith-ops", q: "부동소수점 덧셈의 순서로 옳은 것은?", options: ["가수 덧셈 → 지수 비교 → 반올림 → 정규화", "지수 비교 → 지수 맞춤 → 가수 덧셈 → 정규화 → 반올림", "정규화 → 지수 맞춤 → 반올림 → 가수 덧셈", "반올림 → 가수 덧셈 → 지수 비교 → 정규화"], answer: 1, explain: "작은 쪽 가수를 이동해 지수를 맞춘다." },
  { kind: "ox", id: "cs-q-ar-5", concept: "arith-ops", q: "정수 연산의 주된 문제는 반올림 오차이고, 부동소수점 연산의 주된 문제는 오버플로뿐이다.", answer: false, explain: "정수 = Overflow, 부동소수점 = 반올림 오차·정밀도 손실(과 오버·언더플로)." },
  { kind: "short", id: "cs-q-ar-6", concept: "arith-ops", q: "00110101 + 00010111의 결과는? (8비트)", answers: ["01001100", "1001100"], explain: "53 + 23 = 76." },

  // flags
  { kind: "mc", id: "cs-q-fl-1", concept: "flags", q: "8비트 255 + 1의 CF와 OF는?", options: ["CF 0, OF 0", "CF 1, OF 0", "CF 0, OF 1", "CF 1, OF 1"], answer: 1, explain: "unsigned 범위 초과, signed로는 −1 + 1 = 0 정상." },
  { kind: "mc", id: "cs-q-fl-2", concept: "flags", q: "8비트 127 + 1의 CF와 OF는?", options: ["CF 0, OF 0", "CF 1, OF 0", "CF 0, OF 1", "CF 1, OF 1"], answer: 2, explain: "10000000(−128), 9번째 비트 carry 없음." },
  { kind: "mc", id: "cs-q-fl-3", concept: "flags", q: "8비트 128 + 128의 CF와 OF는?", options: ["CF 0, OF 0", "CF 1, OF 0", "CF 0, OF 1", "CF 1, OF 1"], answer: 3, explain: "결과 00000000, carry-out 있음, signed로는 −128 + −128 → 0(음수 + 음수 = 양수 쪽)." },
  { kind: "ox", id: "cs-q-fl-4", concept: "flags", q: "비트 사이에서 생기는 모든 carry가 Carry Flag에 기록된다.", answer: false, explain: "MSB 밖으로 나온 최종 carry-out만." },
  { kind: "mc", id: "cs-q-fl-5", concept: "flags", q: "if (a == b)를 CPU에서 실행할 때 확인하는 플래그는?", options: ["Carry Flag", "Zero Flag", "Overflow Flag", "Sign Flag"], answer: 1, explain: "CMP a, b로 a − b를 보고 결과가 0이면 같다." },
  { kind: "ox", id: "cs-q-fl-6", concept: "flags", q: "Overflow Flag는 결과를 signed 정수로 해석했을 때 범위를 벗어났는지를 나타낸다.", answer: true, explain: "CF는 unsigned 관점." },
  { kind: "short", id: "cs-q-fl-7", concept: "flags", q: "5 − 5를 계산한 직후 Zero Flag의 값은?", answers: ["1"], hint: "숫자만", explain: "결과가 0이므로 ZF = 1." },

  // io-controller
  { kind: "mc", id: "cs-q-io-1", concept: "io-controller", q: "Controller와 Device Driver에 대한 설명으로 옳은 것은?", options: ["둘 다 하드웨어다", "Controller는 하드웨어, Driver는 소프트웨어다", "Controller는 OS 내부에 있다", "Driver가 장치와 실제 데이터를 전송한다"], answer: 1, explain: "Driver는 OS 요청을 제어기 명령으로 변환." },
  { kind: "mc", id: "cs-q-io-2", concept: "io-controller", q: "장치의 현재 상태(Ready, Busy, Error)를 제공하는 제어기 레지스터는?", options: ["Control Register", "Status Register", "Data Register", "Instruction Register"], answer: 1, explain: "Control = 명령, Data = 주고받는 데이터." },
  { kind: "ox", id: "cs-q-io-3", concept: "io-controller", q: "응용 프로그램은 I/O 장치를 직접 제어한다.", answer: false, explain: "OS와 드라이버를 거쳐 제어기에 요청한다." },
  { kind: "mc", id: "cs-q-io-4", concept: "io-controller", q: "현대 시스템에서 CPU와 I/O 제어기를 잇는 통신 경로의 예로 교안에 나온 것은?", options: ["USB", "SATA", "PCI Express", "HDMI"], answer: 2, explain: "제어기 ↔ 주변장치가 USB·SATA." },
  { kind: "ox", id: "cs-q-io-5", concept: "io-controller", q: "응용 프로그램, 운영체제, 디바이스 드라이버는 모두 CPU가 실행하는 소프트웨어다.", answer: true, explain: "I/O 제어기와 주변장치는 하드웨어." },
  { kind: "mc", id: "cs-q-io-6", concept: "io-controller", q: "SSD와 연결되는 제어기는?", options: ["USB Controller", "Storage Controller", "Network Interface Controller", "Graphics Controller"], answer: 1, explain: "교안 표." },

  // serial-parallel
  { kind: "short", id: "cs-q-sp-1", concept: "serial-parallel", q: "병렬 통신에서 동시에 출발한 신호가 서로 다른 시점에 도착하는 현상은?", answers: ["skew", "스큐"], explain: "고속일수록 문제가 커진다." },
  { kind: "mc", id: "cs-q-sp-2", concept: "serial-parallel", q: "PCIe x4에 대한 설명으로 옳은 것은?", options: ["4비트 병렬 버스다", "4개의 독립 직렬 Lane을 묶은 링크다", "USB 4개를 연결한 것이다", "4배 느린 규격이다"], answer: 1, explain: "각 Lane은 독립적인 직렬 경로." },
  { kind: "mc", id: "cs-q-sp-3", concept: "serial-parallel", q: "직렬 인터페이스가 아닌 것은?", options: ["USB", "SATA", "PCI Express", "과거의 병렬 프린터 포트"], answer: 3, explain: "Thunderbolt도 직렬." },
  { kind: "ox", id: "cs-q-sp-4", concept: "serial-parallel", q: "실제 고속 시스템에서는 신호 무결성과 확장성 때문에 고속 직렬 통신이 널리 쓰인다.", answer: true, explain: "이론상 같은 신호 속도면 병렬이 유리할 수 있지만 현실은 다르다." },
  { kind: "mc", id: "cs-q-sp-5", concept: "serial-parallel", q: "4비트 1010을 직렬 1 Lane으로 보낼 때 걸리는 시간은? (한 비트 T)", options: ["T", "2T", "4T", "8T"], answer: 2, explain: "병렬은 T." },
  { kind: "ox", id: "cs-q-sp-6", concept: "serial-parallel", q: "직렬 통신은 항상 병렬 통신보다 느리다.", answer: false, explain: "Lane 속도를 높이고 여러 Lane을 써 높은 대역폭을 낸다." },

  // handshaking
  { kind: "mc", id: "cs-q-hs-1", concept: "handshaking", q: "Handshaking의 목적이 아닌 것은?", options: ["수신 장치가 준비되었는지 확인", "서로 다른 속도의 장치 간 시점 조정", "데이터 손실 방지", "CPU가 I/O 완료를 확인하는 방법 제공"], answer: 3, explain: "그건 Polling·Interrupt." },
  { kind: "ox", id: "cs-q-hs-2", concept: "handshaking", q: "실제 Throughput은 인터페이스의 Maximum Data Rate보다 높을 수 있다.", answer: false, explain: "Maximum Data Rate ≥ 실제 Throughput." },
  { kind: "mc", id: "cs-q-hs-3", concept: "handshaking", q: "실제 Throughput이 낮아지는 이유가 아닌 것은?", options: ["프로토콜 헤더 오버헤드", "저장장치 성능", "공유 자원 경쟁", "케이블 색상"], answer: 3, explain: "오류 검출 정보, CPU·OS 부담, 작은 파일 처리 비용 등도 이유." },
  { kind: "short", id: "cs-q-hs-4", concept: "handshaking", q: "1 Gbps는 몇 bps인가? (10의 거듭제곱으로, 예: 10^3)", answers: ["10^9", "10⁹", "1000000000"], explain: "Kbps = 10³, Mbps = 10⁶, Gbps = 10⁹." },
  { kind: "mc", id: "cs-q-hs-5", concept: "handshaking", q: "프린터가 데이터를 처리하는 동안 Status Register에 나타나는 상태는?", options: ["Ready", "Busy", "Complete", "Idle"], answer: 1, explain: "완료 후 Ready 또는 Complete로 갱신." },

  // usb-firewire
  { kind: "mc", id: "cs-q-uf-1", concept: "usb-firewire", q: "USB 2.0의 최대 이론 전송 속도는?", options: ["12 Mbps", "480 Mbps", "5 Gbps", "10 Gbps"], answer: 1, explain: "USB 3.2 Gen 1 = 5 Gbps, Gen 2 = 10 Gbps." },
  { kind: "mc", id: "cs-q-uf-2", concept: "usb-firewire", q: "컴퓨터 전원을 끄지 않고 장치를 연결·분리할 수 있는 기능은?", options: ["Plug and Play", "Hot Plugging", "Handshaking", "Peer-to-Peer"], answer: 1, explain: "PnP는 연결 시 자동 인식·설정." },
  { kind: "ox", id: "cs-q-uf-3", concept: "usb-firewire", q: "USB에서는 연결된 장치가 임의로 통신을 시작할 수 있다.", answer: false, explain: "Host 중심 — PC의 Host가 통신을 관리한다." },
  { kind: "mc", id: "cs-q-uf-4", concept: "usb-firewire", q: "FireWire(IEEE 1394)의 특징은?", options: ["Host 중심 구조", "장치 간 직접 통신(Peer-to-Peer) 지원", "병렬 통신", "전력 공급 불가가 핵심"], answer: 1, explain: "디지털 캠코더 ↔ 외장 저장장치." },
  { kind: "ox", id: "cs-q-uf-5", concept: "usb-firewire", q: "영상·음성 전송에서는 순간 최고속도보다 지속적이고 예측 가능한 전송이 중요해 FireWire가 이에 맞게 설계되었다.", answer: true, explain: "실시간 멀티미디어용." },
  { kind: "short", id: "cs-q-uf-6", concept: "usb-firewire", q: "FireWire 800의 최대 전송 속도는 몇 Mbps인가?", answers: ["800"], hint: "숫자만", explain: "FireWire 400 = 400 Mbps." },

  // polling-interrupt
  { kind: "mc", id: "cs-q-pl-1", concept: "polling-interrupt", q: "CPU가 Status Register를 반복해서 읽어 장치 상태를 확인하는 방식은?", options: ["Interrupt", "Polling", "DMA", "Spooling"], answer: 1, explain: "구조는 단순하지만 장치가 느리면 CPU 낭비." },
  { kind: "ox", id: "cs-q-pl-2", concept: "polling-interrupt", q: "Interrupt 방식은 처리 비용이 전혀 들지 않는다.", answer: false, explain: "인터럽트 처리 자체의 비용이 있다." },
  { kind: "mc", id: "cs-q-pl-3", concept: "polling-interrupt", q: "완료 시간이 길거나 예측하기 어려운 I/O에 적합한 방식은?", options: ["Polling", "Interrupt", "Busy Waiting", "Handshaking"], answer: 1, explain: "CPU가 기다리지 않고 다른 작업을 한다." },
  { kind: "mc", id: "cs-q-pl-4", concept: "polling-interrupt", q: "인쇄 요청을 Spool Queue에 저장하는 OS 구성요소는?", options: ["Printer Driver", "Print Spooler", "I/O Controller", "Status Register"], answer: 1, explain: "이후 Driver가 Status 확인 → Data 기록 → Control에 시작 명령." },
  { kind: "ox", id: "cs-q-pl-5", concept: "polling-interrupt", q: "Interrupt를 받으면 CPU는 현재 작업을 잠시 멈추고 인터럽트 처리 루틴을 실행한 뒤 이전 작업으로 돌아간다.", answer: true, explain: "기본 흐름." },
  { kind: "mc", id: "cs-q-pl-6", concept: "polling-interrupt", q: "인쇄 출력이 완료된 뒤 I/O Controller가 하는 일은?", options: ["Spool Queue를 지운다", "Status Register 갱신 및 Interrupt 발생", "CPU 전원을 끈다", "드라이버를 다시 설치한다"], answer: 1, explain: "OS가 완료 처리 후 다음 작업을 시작." },

  // dma
  { kind: "mc", id: "cs-q-dm-1", concept: "dma", q: "DMA 전송 전에 CPU가 설정하는 정보가 아닌 것은?", options: ["시작 메모리 주소", "전송 크기", "전송 방향", "전송할 데이터 한 바이트씩"], answer: 3, explain: "실제 데이터 이동은 DMA가 한다." },
  { kind: "mc", id: "cs-q-dm-2", concept: "dma", q: "DMA 전송이 끝났음을 CPU에 알리는 일반적인 방법은?", options: ["Polling", "Interrupt", "Handshaking", "Spooling"], answer: 1, explain: "완료 통지 → CPU가 메모리의 데이터 사용." },
  { kind: "ox", id: "cs-q-dm-3", concept: "dma", q: "DMA를 쓰면 메모리와 인터커넥트의 대역폭이 늘어나 폰 노이만 병목이 해결된다.", answer: false, explain: "DMA는 CPU의 I/O 이동 부담만 줄인다." },
  { kind: "mc", id: "cs-q-dm-4", concept: "dma", q: "여러 장치가 같은 통신 자원을 요청할 때 사용 순서를 정하는 것은?", options: ["Bus Arbitration", "Handshaking", "Context Switch", "Paging"], answer: 0, explain: "우선순위·순환·공정성·성능 기준." },
  { kind: "ox", id: "cs-q-dm-5", concept: "dma", q: "아주 작은 데이터 전송에서는 DMA 설정 비용이 오히려 더 클 수 있다.", answer: true, explain: "설정과 완료 처리 오버헤드." },
  { kind: "ox", id: "cs-q-dm-6", concept: "dma", q: "Interrupt만 써도 대용량 데이터 이동에서 CPU의 개입이 완전히 사라진다.", answer: false, explain: "DMA 없이는 실제 데이터 이동에 CPU가 반복 관여한다." },
  { kind: "mc", id: "cs-q-dm-7", concept: "dma", q: "DMA의 대표적 활용이 아닌 것은?", options: ["SSD 대용량 읽기", "네트워크 패킷 송수신", "GPU–메모리 대량 전송", "키보드 한 글자 상태 확인"], answer: 3, explain: "대량 데이터 전송에 효과적." },
];
