/** 쉬운 설명 칸 — 기계어 · 실행 · 연산 · 입출력 */
export const STORY_3: Record<string, string> = {
  "machine-instruction": `
? 예시: ADD R3, R1, R2
icon 🗣️
상황: CPU에게 내리는 짧은 명령문 하나야.
list 쪼개 보기
- ADD | **Opcode** — 무엇을 할지 (덧셈)
- R1, R2 | **피연산자** — 더할 값
- R3 | 결과를 저장할 목적지
box 기계어는 CPU 종류마다 다르다
result 기억 | C 한 문장도 여러 기계 명령으로 나뉠 수 있다
= 이처럼 기계 명령은 **연산 코드 + 피연산자**로 된 기본 동작 하나야.
`,
  "instruction-kinds": `
? 예시: C = A + B를 기계 명령으로
icon 🧾
상황: 한 줄짜리 C 코드가 다섯 개의 기계 명령이 돼.
list 실행 순서
- LOAD R1, [A] | 데이터 이동 (메모리 → 레지스터)
- LOAD R2, [B] | 데이터 이동
- ADD R3, R1, R2 | 산술·논리
- STORE R3, [C] | 데이터 이동 (레지스터 → 메모리)
- HALT | 제어
box 세 종류
> 데이터 이동 · 산술·논리 · 제어(분기·점프·종료)
result 주의 | LOAD·STORE·MOV는 옮기는 게 아니라 **복사**
= 이처럼 기계 명령은 **이동 · 계산 · 흐름 제어**로 나뉘어.
`,
  "isa-risc-cisc": `
? 예시: A + B → C를 두 방식으로
icon 🧱
상황: 같은 일을 RISC와 CISC는 다르게 시켜.
list 비교
- RISC (Arm, RISC-V) | LOAD · LOAD · ADD · STORE — 4개
- CISC (x86) | MOV · ADD EAX,[B] · MOV — 메모리를 직접 더함
box ISA
> CPU와 소프트웨어 사이의 약속 (명령어 · 형식 · 레지스터 · 주소 지정)
result 함정 | RISC = 항상 단순, CISC = 항상 느림 ❌ (서로 장점을 받아들임)
= 이처럼 **RISC는 단순 명령 여러 개, CISC는 복합 명령 하나**로 일해.
`,
  "virtual-machine-lang": `
? 예시: 156C 166D 5056 306E C000 해독
icon 🕵️
상황: 강의의 가상 컴퓨터는 명령어가 16진 4자리야. 첫 글자가 무엇을 할지 정해.
list 한 줄씩
- 156C | 주소 6C의 값 → R5 (LOAD)
- 166D | 주소 6D의 값 → R6
- 5056 | R5 + R6 → R0 (ADD)
- 306E | R0 → 주소 6E (STORE)
- C000 | HALT
box 분기 명령
> B34C: R3 = R0이면 4C로 · B04C: 무조건 4C로
result 하는 일 | 6C와 6D의 값을 더해 6E에 저장
= 이처럼 **Opcode → 필드 분리 → 데이터 흐름 추적** 순서로 해독해.
`,
  "exec-registers": `
? 예시: 156C를 실행하는 순간
icon 🏷️
상황: CPU 안의 레지스터들이 각자 맡은 정보를 들고 있어.
list 레지스터
- PC | 다음 명령어 주소 (A0)
- IR | 지금 명령어 (156C)
- 범용 | R5, R6, R0 — 연산 값
- 상태 | Zero · Negative · Carry · Overflow
box 상태 레지스터는 분기에서 쓴다
> 비교 결과가 0이면 이동 → Zero Flag 확인
result 주의 | PC가 항상 일정하게 늘지는 않는다 (분기)
= 이처럼 프로그램은 **PC를 따라 레지스터를 써 가며** 실행돼.
`,
  "machine-cycle": `
? 예시: A0번지부터 실행 시작
icon 🔁
상황: 명령어는 2바이트라 PC가 2씩 늘어.
list 첫 명령어
- 인출 | IR ← 156C, PC ← A2
- 해석 | LOAD R5, [6C]
- 실행 | R5 ← [6C]
- 다음 | PC = A2에서 다시 인출
box 순차 실행 A0 → A2 → A4 → A6 → A8
> if · while · 함수 호출 = PC를 바꾸는 명령
result 반복 | 인출 → 해석 → 실행 → 인출 …
= 이처럼 CPU는 **인출·해석·실행을 계속 반복**해.
`,
  "logic-masking": `
? 예시: x = 0x59 (0101 1001)
icon ✂️
상황: 원하는 비트만 골라 꺼내거나 바꾸고 싶어.
list 마스크
- x AND 0x0F | 0000 1001 (하위 4비트 **추출**)
- x OR 0x80 | 1101 1001 (최상위 비트 **켜기**)
- x XOR 0x01 | 0101 1000 (최하위 비트 **뒤집기**)
- NOT x | 1010 0110
box 홀짝 판별
> n AND 1 → 1이면 홀수 (7 = 0111 → 1)
result 쓰임 | 권한 · 옵션 · 장치 상태를 한 정수의 비트로
= 이처럼 마스크로 **비트 하나하나를 스위치처럼** 다뤄.
`,
  "shift-rotate": `
? 예시: 00110110 (54) 밀어 보기
icon ↔️
상황: 비트를 왼쪽·오른쪽으로 밀면 무슨 일이 생길까?
list 자리이동
- 왼쪽 1칸 | 01101100 = 108 (넘치지 않으면 2배)
- 논리 오른쪽 1칸 | 00011011 = 27
- 음수 11110100 (−12) 산술 오른쪽 | 11111010 = −6 (부호 유지)
box 회전
> ROL 10110010 → 01100101 (밀려난 비트가 반대쪽으로)
result 팁 | 비트 조작은 unsigned로
= 이처럼 **시프트는 버리고 0(또는 부호)을 채우고, 회전은 돌려 넣어**.
`,
  "arith-ops": `
? 예시: 13 × 5와 7 − 3
icon ➕
상황: ALU는 사실상 덧셈과 시프트만으로 계산해.
list 계산법
- 7 − 3 | 0111 + 1101 = (1)0100 → **4** (넘친 올림 버림)
- 13 × 5 | 13×4 + 13 = (13 시프트 2) + 13 = **65**
- 13 ÷ 3 | 비교 + 뺄셈 반복 → 몫 4, 나머지 1
box 정수 연산은 정확, 문제는 Overflow
result 부동소수점 | 지수 맞추기 → 가수 덧셈 → 정규화 → 반올림 (오차 생김)
= 이처럼 **뺄셈은 2의 보수 덧셈, 곱셈은 시프트 + 덧셈**이야.
`,
  "flags": `
? 예시: 8비트 255 + 1과 127 + 1
icon 🚩
상황: 결과값만큼 중요한 게 "결과가 어땠나" 표시야.
list 플래그 비교
- 255 + 1 | 00000000 → **CF = 1**, OF = 0
- 127 + 1 | 10000000 → CF = 0, **OF = 1**
- 5 − 5 | 0 → ZF = 1
box CF와 OF
> CF: 부호 없이 볼 때 넘침 · OF: 부호 있게 볼 때 넘침
result if (a == b) | a − b 후 Zero Flag = 1이면 분기
= 이처럼 상태 플래그는 **조건 분기의 근거**가 돼.
`,
  "io-controller": `
? 예시: USB 메모리에 파일 저장
icon 🧑‍🔧
상황: 앱이 USB를 직접 만지지 않아. 여러 단계를 거쳐.
list 경로
- 응용 프로그램 | 저장 요청
- OS · 파일 시스템 | 처리
- 디바이스 드라이버 (SW) | 제어기 명령으로 번역
- I/O 제어기 (HW) | 장치를 실제로 움직임
box 제어기 레지스터
> Control(무엇을) · Status(Ready, Busy, Error) · Data(주고받을 값)
result 핵심 | CPU는 제어기 레지스터를 읽고 써서 장치를 제어
= 이처럼 **드라이버는 통역사, 제어기는 현장 반장**이야.
`,
  "serial-parallel": `
? 예시: 1010 네 비트 보내기
icon 🛤️
상황: 선 4개로 한꺼번에? 선 하나로 차례로?
list 두 방식
- 병렬 | 동시에 T 시간 · 선 많음 · Skew 문제
- 직렬 1 Lane | 4T · 선 적음 · 고속·장거리 유리
box Skew
> 동시에 출발한 신호가 다른 때 도착 → 고속에서 오류
result PCIe x4 | 4비트 병렬이 아니라 **직렬 Lane 4개**
= 이처럼 고속 시스템은 **직렬을 여러 Lane으로 묶어** 대역폭을 늘려.
`,
  "handshaking": `
? 예시: 프린터에 출력하기
icon 🤝
상황: 프린터가 준비도 안 됐는데 데이터를 보내면 안 되겠지?
list Handshaking
- 상태 확인 | Ready?
- 데이터 전달 | 출력 시작 명령
- 프린터 | Busy
- 완료 | Ready / Complete
box Data Rate vs Throughput
> 규격의 최대 속도 ≥ 실제로 나오는 속도
result 느려지는 이유 | 프로토콜 · 헤더 · 장치 성능 · 자원 경쟁 등
= 이처럼 Handshaking은 **보내는 쪽과 받는 쪽의 타이밍 맞추기**야.
`,
  "usb-firewire": `
? 예시: 키보드를 꽂자마자 쓸 수 있는 이유
icon 🔌
상황: 예전엔 장치마다 포트가 달랐어. 그래서 표준을 만들었지.
list USB
- Host 중심 | PC가 통신을 관리
- Plug and Play | 꽂으면 자동 인식
- Hot Plugging | 켠 채로 꽂고 뺌
- 속도 | 2.0 480Mbps · 3.2 Gen 1 5Gbps · Gen 2 10Gbps
box FireWire (IEEE 1394)
> 장치끼리 직접 통신 · 영상·음성의 지속적 전송
result 지금 | USB·Thunderbolt가 퍼지며 FireWire 비중 감소
= 이처럼 **USB는 Host가 지명하는 교실, FireWire는 학생끼리 대화하는 교실**이야.
`,
  "polling-interrupt": `
? 예시: 프린터 출력이 끝났는지 알기
icon 🔔
상황: CPU는 빠르고 프린터는 느려. 언제 끝났는지 어떻게 알까?
list 두 방법
- Polling | CPU가 Status를 계속 읽음 (Busy, Busy, Ready)
- Interrupt | 끝나면 장치가 CPU를 부름
box 장단점
> Polling: 단순, 느린 장치면 CPU 낭비 · Interrupt: 효율적, 처리 비용 있음
result 고르기 | 짧고 단순한 I/O → Polling, 길고 예측 어려운 I/O → Interrupt
= 이처럼 **CPU가 묻느냐, 장치가 알리느냐**의 차이야.
`,
  "dma": `
? 예시: SSD에서 큰 파일 읽기
icon 📦
상황: CPU가 한 덩어리씩 직접 옮기면 다른 일을 못 해.
list DMA 과정
- CPU가 설정 | 시작 주소 · 크기 · 방향
- DMA 제어기 | 장치 → 메모리로 직접 전송
- 그동안 CPU | 다른 명령 실행
- 완료 | 인터럽트로 알림
box 버스를 함께 쓰니 Bus Arbitration
> 동시에 요청하면 누가 먼저 쓸지 정한다
result 함정 | DMA는 폰 노이만 병목 해결책이 **아니다**
= 이처럼 DMA는 **대량 I/O 이동에서 CPU를 해방**시켜.
`,
};
