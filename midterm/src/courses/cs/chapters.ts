import type { Chapter } from "@/lib/types";

/** 컴퓨터시스템개론 — 교안 파일 하나가 장 하나 */
export const CHAPTERS: Chapter[] = [
  { id: "big", title: "컴퓨팅의 큰 그림", en: "The Big Picture of Computing", source: "CS 01. 컴퓨팅의 큰 그림", blurb: "문제·알고리즘·프로그램·프로세스, 알고리즘의 조건과 평가, 유클리드 호제법, 컴파일·링크와 실행, 추상화, 컴퓨팅의 발전(해석기관·ENIAC·저장 프로그램·멀티코어·GPU·AI 가속기)" },
  { id: "bits", title: "비트와 비트의 저장", en: "Bits and Their Storage", source: "CS 02-1. 비트와 비트의 저장", blurb: "비트·바이트·비트패턴, 부울 연산, 논리 게이트와 논리회로, 플립플롭과 레지스터, 16진 표기법" },
  { id: "mem", title: "기억장치", en: "Main Memory & Secondary Storage", source: "CS 02-2. 기억장치", blurb: "주기억장치·메모리 셀·주소·읽기/쓰기, RAM과 ROM, 용량 단위, HDD·플래시·SSD(SATA·NVMe·M.2), 광학 장치, 파티션·포맷·파일 시스템" },
  { id: "repr", title: "비트패턴을 이용한 정보 표현", en: "Representing Information as Bit Patterns", source: "CS 02-3. 비트패턴을 이용한 정보 표현", blurb: "ASCII·유니코드·UTF-8, 문자열과 숫자, 래스터·벡터 이미지, RGB와 해상도, 압축(RLE·허프만·차분), 동영상·코덱·컨테이너, 오디오 샘플링·양자화·MIDI" },
  { id: "num", title: "숫자의 표현", en: "Number Representation", source: "CS 02-4. 숫자의 표현", blurb: "진법 변환, 2진수 덧셈, 2의 보수와 표현 범위, 오버플로, 고정·부동소수점, 정규화, 초과 표기법, IEEE 754와 표현 오차" },
  { id: "arch", title: "컴퓨터 구조", en: "Computer Architecture", source: "CS 03-1. 컴퓨터 구조", blurb: "CPU(제어장치·ALU·레지스터), PC·IR, 기억장치 계층, 캐시와 지역성, 버스, 저장 프로그램 방식, 폰 노이만 구조와 병목" },
  { id: "isa", title: "기계어", en: "Machine Language", source: "CS 03-2. 기계어", blurb: "기계 명령(Opcode·Operand), 데이터 이동·산술논리·제어 명령, ISA, RISC와 CISC, ARM, 가상 기계어 해독" },
  { id: "exec", title: "프로그램의 실행", en: "Program Execution", source: "CS 03-3. 프로그램의 실행", blurb: "PC·IR·범용·상태 레지스터, 기계 주기(인출→해석→실행), 덧셈 프로그램 추적, 순차 실행과 분기" },
  { id: "ops", title: "연산 명령", en: "Arithmetic/Logic Instructions", source: "CS 03-4. 연산 명령", blurb: "AND·OR·XOR·NOT과 마스킹, 논리·산술 자리이동, 회전, 산술 연산(2의 보수 뺄셈·곱셈·나눗셈), 상태 플래그(Zero·Carry·Overflow)" },
  { id: "io", title: "I/O 제어와 데이터 전송", en: "I/O Control & Data Transfer", source: "CS 03-5. IO 제어와 데이터 전송", blurb: "I/O 제어기와 디바이스 드라이버, 제어기 레지스터, 병렬·직렬 통신과 Skew·Lane, Handshaking, Data Rate·Throughput, USB·FireWire, Polling·Interrupt, DMA와 Bus Arbitration" },
  { id: "osdev", title: "운영체제의 발전", en: "Evolution of Operating Systems", source: "CS 04-1. 운영체제의 발전", blurb: "운영체제의 역할, 일괄 처리·대화식 처리·실시간 처리, 멀티프로그래밍, 시분할과 문맥 교환, 멀티태스킹·동시성·병렬성, 다중 사용자·다중 코어, 임베디드와 RTOS" },
  { id: "osarch", title: "운영체제의 구조", en: "Structure of Operating Systems", source: "CS 04-2. 운영체제의 구조", blurb: "응용·시스템 소프트웨어, CLI·GUI와 셸, 커널·사용자 공간·시스템 호출, 파일 시스템·장치 드라이버, 가상 메모리·MMU·페이징·페이지 폴트·스래싱, 스케줄러·디스패처, 부팅(UEFI)" },
  { id: "proc", title: "컴퓨팅 활동의 조정", en: "Coordinating Computing Activities", source: "CS 04-3. 컴퓨팅활동의 조정", blurb: "프로그램 vs 프로세스, 프로세스 메모리 구조(코드·데이터·힙·스택), 실행 문맥과 PCB, 준비·실행·대기 상태 전이, 할당 시간, 인터럽트·예외·시스템 호출, 문맥 교환, 라운드 로빈, 다중 프로그래밍" },
  { id: "sync", title: "프로세스 간 자원 경쟁과 동기화", en: "Resource Competition & Synchronization", source: "CS 04-4. 프로세스 간 자원경쟁과 동기화", blurb: "공유 자원과 경쟁 상태, 플래그의 실패, 인터럽트 차단, test-and-set(원자적 연산), 임계 구역과 상호 배제, 세마포어, 교착상태 4조건과 예방·회피·탐지, 스풀링" },
];
