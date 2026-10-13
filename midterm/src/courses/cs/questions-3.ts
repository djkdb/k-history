import type { Question } from "@/lib/types";

/* 4강 운영체제 */
export const QUESTIONS_3: Question[] = [
  // os-role
  { kind: "mc", id: "cs-q-or-1", concept: "os-role", q: "운영체제의 자원 관리 짝으로 옳지 않은 것은?", options: ["CPU — 스케줄링", "메모리 — 할당과 보호", "저장장치 — 파일 시스템", "입출력 장치 — 컴파일"], answer: 3, explain: "입출력 장치는 드라이버와 표준화된 접근 제어로 관리한다." },
  { kind: "ox", id: "cs-q-or-2", concept: "os-role", q: "응용 프로그램은 OS를 거치지 않고 하드웨어를 직접 제어하는 것이 일반적이다.", answer: false, explain: "OS가 제공하는 보호된 환경 위에서 동작한다." },
  { kind: "mc", id: "cs-q-or-3", concept: "os-role", q: "C 프로그램에서 printf()가 화면에 출력되는 경로로 옳은 것은?", options: ["printf가 직접 모니터를 제어", "C 표준 라이브러리 → 필요 시 OS 출력 서비스", "컴파일러가 실행 중 출력", "BIOS가 출력"], answer: 1, explain: "라이브러리 함수가 내부에서 OS 서비스를 요청한다." },
  { kind: "ox", id: "cs-q-or-4", concept: "os-role", q: "Android와 iOS는 모바일 운영체제의 예다.", answer: true, explain: "PC·서버는 Windows, macOS, Linux, UNIX 계열." },

  // batch
  { kind: "mc", id: "cs-q-ba-1", concept: "batch", q: "작업(Job)의 구성요소가 아닌 것은?", options: ["실행할 프로그램(Code)", "입력 데이터(Data)", "지시사항(Control Commands)", "사용자의 실시간 키보드 입력"], answer: 3, explain: "일괄 처리는 사용자 개입 없이 처리한다." },
  { kind: "ox", id: "cs-q-ba-2", concept: "batch", q: "일괄 처리의 Job Queue는 반드시 FIFO로만 처리된다.", answer: false, explain: "우선순위·자원 요구량·예상 시간으로 순서를 바꿀 수 있다." },
  { kind: "mc", id: "cs-q-ba-3", concept: "batch", q: "일괄 처리의 한계로 옳은 것은?", options: ["CPU 유휴 시간 증가", "상호작용 불가와 긴 반환 시간", "대용량 처리 불가", "관리가 복잡함"], answer: 1, explain: "끝나야 결과를 볼 수 있어 디버깅도 어렵다." },
  { kind: "mc", id: "cs-q-ba-4", concept: "batch", q: "일괄 처리의 활용 예로 알맞지 않은 것은?", options: ["기업 급여 계산", "학기 말 성적 처리", "은행 야간 정산", "온라인 게임 조작"], answer: 3, explain: "게임은 대화식 처리." },
  { kind: "short", id: "cs-q-ba-5", concept: "batch", q: "작업 적재·전환을 자동화한 초기 OS의 싹이 된 프로그램은? (한글 또는 영어)", answers: ["상주 모니터", "resident monitor", "상주모니터"], explain: "Resident Monitor." },
  { kind: "ox", id: "cs-q-ba-6", concept: "batch", q: "초기 컴퓨터에서는 사람이 직접 준비·정리를 하느라 실행보다 준비에 시간이 더 걸리는 문제가 있었다.", answer: true, explain: "그래서 비싼 CPU가 놀았다." },

  // interactive-realtime
  { kind: "mc", id: "cs-q-ir-1", concept: "interactive-realtime", q: "실시간 처리의 핵심은?", options: ["가장 빠른 처리", "정해진 마감 시간(Deadline) 준수", "사용자 편의", "대용량 처리"], answer: 1, explain: "늦으면 치명적 실패." },
  { kind: "ox", id: "cs-q-ir-2", concept: "interactive-realtime", q: "대화식 처리에서 응답이 조금 늦어지면 시스템이 치명적으로 실패한다.", answer: false, explain: "답답할 뿐이고 데이터는 안전하다. 치명적 실패는 실시간 처리." },
  { kind: "mc", id: "cs-q-ir-3", concept: "interactive-realtime", q: "실시간 처리의 상호작용 대상과 시간 기준으로 옳은 것은?", options: ["사람 / 수 초", "센서·기계 / ms~µs", "사람 / ms", "센서 / 수 분"], answer: 1, explain: "대화식은 사람 / 수 초 이내." },
  { kind: "mc", id: "cs-q-ir-4", concept: "interactive-realtime", q: "실시간 처리의 예는?", options: ["문서 편집기", "CLI의 ls 명령", "에어백 제어", "검색 엔진"], answer: 2, explain: "10ms 안에 터져야 한다." },
  { kind: "ox", id: "cs-q-ir-5", concept: "interactive-realtime", q: "대화식 처리는 사용자가 입력을 망설이는 동안 CPU가 낭비될 수 있다.", answer: true, explain: "교안의 대화식 단점." },

  // multiprogramming-timesharing
  { kind: "mc", id: "cs-q-mt-1", concept: "multiprogramming-timesharing", q: "멀티프로그래밍이 해결하려는 문제는?", options: ["CPU 독점으로 느린 응답", "I/O 대기 중 CPU 유휴", "메모리 부족", "교착상태"], answer: 1, explain: "시분할은 CPU 독점·느린 응답 문제." },
  { kind: "mc", id: "cs-q-mt-2", concept: "multiprogramming-timesharing", q: "Time Slice가 너무 짧을 때의 문제는?", options: ["다른 작업 응답 지연", "문맥 교환 오버헤드 증가", "CPU 유휴 증가", "선착순과 같아짐"], answer: 1, explain: "너무 길면 다른 작업 응답이 늦어진다." },
  { kind: "ox", id: "cs-q-mt-3", concept: "multiprogramming-timesharing", q: "I/O 대기 때만 프로그램을 바꾸는 방식으로도 빠른 대화형 응답을 항상 보장할 수 있다.", answer: false, explain: "CPU를 오래 쓰는 프로그램이 있으면 응답이 늦어진다 → 시분할 필요." },
  { kind: "mc", id: "cs-q-mt-4", concept: "multiprogramming-timesharing", q: "멀티프로그래밍에 필요한 OS 기능 두 가지는?", options: ["메모리 관리, 스케줄링", "컴파일, 링크", "압축, 백업", "GUI, 셸"], answer: 0, explain: "여러 프로그램을 메모리에 두고 실행할 것을 골라야 한다." },
  { kind: "ox", id: "cs-q-mt-5", concept: "multiprogramming-timesharing", q: "시분할에서는 Time Slice가 끝나면 OS가 강제로 다른 작업으로 바꾼다.", answer: true, explain: "선점." },

  // multitasking-parallel
  { kind: "mc", id: "cs-q-mp-1", concept: "multitasking-parallel", q: "단일 코어에서 시분할로 여러 작업을 번갈아 실행하는 것은?", options: ["병렬성", "동시성", "다중 프로세서", "일괄 처리"], answer: 1, explain: "물리적 동시 실행은 병렬성." },
  { kind: "mc", id: "cs-q-mp-2", concept: "multitasking-parallel", q: "한 CPU 칩 안에 여러 코어가 있는 구조는?", options: ["다중 프로세서", "다중 코어", "다중 사용자", "다중 프로그래밍"], answer: 1, explain: "다중 프로세서는 독립된 여러 CPU 칩." },
  { kind: "ox", id: "cs-q-mp-3", concept: "multitasking-parallel", q: "코어 수를 늘리면 프로그램 속도는 코어 수에 비례해 무한히 빨라진다.", answer: false, explain: "직렬 부분과 통신·동기화 오버헤드 때문에 한계가 있다." },
  { kind: "mc", id: "cs-q-mp-4", concept: "multitasking-parallel", q: "다중 코어 OS의 핵심 과제가 아닌 것은?", options: ["작업 배치(스케줄링)", "부하 균형", "동기화", "부트 로더 교체"], answer: 3, explain: "Load Balancing·동기화." },
  { kind: "ox", id: "cs-q-mp-5", concept: "multitasking-parallel", q: "운영체제는 자원을 관리하는 소프트웨어이고, 시스템 관리자는 시스템을 관리하는 사람이다.", answer: true, explain: "관리자: 계정·권한, 설치·업데이트, 백업·보안, 장애 복구." },
  { kind: "ox", id: "cs-q-mp-6", concept: "multitasking-parallel", q: "다중 코어 시스템에서는 각 코어 안에서 시분할 멀티태스킹을 할 수 없다.", answer: false, explain: "각 코어에서도 시분할을 함께 수행할 수 있다." },

  // embedded-rtos
  { kind: "mc", id: "cs-q-em-1", concept: "embedded-rtos", q: "RTOS의 핵심은?", options: ["최대 처리량", "예측 가능성(정해진 시간 내 완료 보장)", "화려한 GUI", "다중 사용자 지원"], answer: 1, explain: "Predictability." },
  { kind: "mc", id: "cs-q-em-2", concept: "embedded-rtos", q: "임베디드 시스템의 설계 제약이 아닌 것은?", options: ["자원 제약", "저전력", "고신뢰성", "무제한 메모리"], answer: 3, explain: "자원 제약·저전력·고신뢰성·시간 제약." },
  { kind: "ox", id: "cs-q-em-3", concept: "embedded-rtos", q: "RTOS만 쓰면 응용 프로그램과 하드웨어 설계와 관계없이 마감이 보장된다.", answer: false, explain: "응용·하드웨어도 함께 최적화해야 한다." },
  { kind: "ox", id: "cs-q-em-4", concept: "embedded-rtos", q: "현대 OS는 대화식·시분할·일괄 처리·다중 코어 기법을 융합해 사용한다.", answer: true, explain: "예: 백그라운드 백업 = 일괄 처리." },

  // sw-types-ui
  { kind: "mc", id: "cs-q-sw-1", concept: "sw-types-ui", q: "시스템 소프트웨어에 해당하는 것은?", options: ["웹 브라우저", "게임", "컴파일러", "문서 편집기"], answer: 2, explain: "OS·드라이버·컴파일러·링커·유틸리티." },
  { kind: "mc", id: "cs-q-sw-2", concept: "sw-types-ui", q: "셸의 내장 명령에 해당하는 것은?", options: ["hello.exe", "cd", "gcc", "notepad"], answer: 1, explain: "cd, echo, exit." },
  { kind: "mc", id: "cs-q-sw-3", concept: "sw-types-ui", q: "셸에서 '>' 기호의 기능은?", options: ["파이프", "리다이렉션", "백그라운드 실행", "주석"], answer: 1, explain: "'|'는 파이프." },
  { kind: "ox", id: "cs-q-sw-4", concept: "sw-types-ui", q: "모든 컴퓨터 시스템에는 반드시 운영체제가 필요하다.", answer: false, explain: "단순 임베디드는 OS 없이 전용 프로그램을 직접 실행한다." },
  { kind: "mc", id: "cs-q-sw-5", concept: "sw-types-ui", q: "CLI의 장점이 아닌 것은?", options: ["스크립트 자동화", "자원 소모가 적음", "빠른 작업", "직관적인 아이콘 조작"], answer: 3, explain: "직관성은 GUI 장점." },
  { kind: "short", id: "cs-q-sw-6", concept: "sw-types-ui", q: "사용자의 명령을 해석해 커널에 전달하는 명령 해석기는?", answers: ["셸", "shell", "쉘"], explain: "Shell." },
  { kind: "ox", id: "cs-q-sw-7", concept: "sw-types-ui", q: "응용 소프트웨어와 시스템 소프트웨어는 설치된 컴퓨터가 아니라 역할로 구분한다.", answer: true, explain: "교안 정의." },

  // kernel-syscall
  { kind: "mc", id: "cs-q-ks-1", concept: "kernel-syscall", q: "프로세스 제어 시스템 호출의 예는?", options: ["open, read, write", "fork, exec, exit", "brk, mmap", "socket, connect"], answer: 1, explain: "파일 / 프로세스 / 메모리 / 네트워크." },
  { kind: "ox", id: "cs-q-ks-2", concept: "kernel-syscall", q: "커널 모드는 OS의 관리자(root) 계정과 같은 개념이다.", answer: false, explain: "커널·사용자 모드는 CPU 실행 권한 구분." },
  { kind: "ox", id: "cs-q-ks-3", concept: "kernel-syscall", q: "printf()와 fopen()은 OS의 시스템 호출 자체가 아니라 C 표준 라이브러리 함수다.", answer: true, explain: "내부에서 필요한 시스템 호출을 대신 요청한다." },
  { kind: "mc", id: "cs-q-ks-4", concept: "kernel-syscall", q: "커널의 4대 기능이 아닌 것은?", options: ["프로세스 관리", "메모리 관리", "파일 시스템 관리", "문서 맞춤법 검사"], answer: 3, explain: "+ 입출력 장치 제어." },
  { kind: "mc", id: "cs-q-ks-5", concept: "kernel-syscall", q: "출력 데이터를 모았다가 한 번에 보내 장치 I/O 횟수를 줄이는 기법은?", options: ["스풀링", "버퍼링", "페이징", "스래싱"], answer: 1, explain: "Buffering." },
  { kind: "short", id: "cs-q-ks-6", concept: "kernel-syscall", q: "프로그램이 커널 기능을 안전하게 요청하는 통로는?", answers: ["시스템 호출", "system call", "시스템콜", "syscall"], explain: "System Call." },
  { kind: "mc", id: "cs-q-ks-7", concept: "kernel-syscall", q: "사용자 모드와 커널 모드를 구분하는 이유는?", options: ["속도를 높이려고", "일반 프로그램이 다른 프로그램의 메모리나 하드웨어 설정을 마음대로 바꾸지 못하게", "GUI를 그리려고", "파일 이름을 짧게 하려고"], answer: 1, explain: "커널이 요청·권한을 검증한 뒤 대행." },

  // fs-driver
  { kind: "mc", id: "cs-q-fd-1", concept: "fs-driver", q: "파일 열기 단계의 순서로 옳은 것은?", options: ["반환 → 요청 → 검증 → 접근 → 닫기", "요청 → 검증 → 반환 → 접근 → 닫기", "검증 → 요청 → 접근 → 반환 → 닫기", "요청 → 반환 → 접근 → 검증 → 닫기"], answer: 1, explain: "경로 요청 → 존재·권한 검증 → FILE */디스크립터 반환 → 읽기·쓰기 → 닫기." },
  { kind: "mc", id: "cs-q-fd-2", concept: "fs-driver", q: "OS의 표준 요청을 각 장치의 구체적 제어 동작으로 번역하는 것은?", options: ["셸", "장치 드라이버", "파일 탐색기", "부트 로더"], answer: 1, explain: "장치 차이를 숨긴다(추상화)." },
  { kind: "ox", id: "cs-q-fd-3", concept: "fs-driver", q: "파일 탐색기는 실제 파일 읽기·쓰기를 수행하는 커널의 일부다.", answer: false, explain: "GUI 응용 프로그램. 실제 작업자는 커널의 파일 관리." },
  { kind: "mc", id: "cs-q-fd-4", concept: "fs-driver", q: "파일 메타데이터가 아닌 것은?", options: ["이름", "크기", "권한", "파일 내용 전체"], answer: 3, explain: "이름·크기·권한·시간." },
  { kind: "ox", id: "cs-q-fd-5", concept: "fs-driver", q: "파일을 연 뒤 프로그램은 물리적 저장 위치 대신 커널이 준 FILE *나 파일 디스크립터로 접근한다.", answer: true, explain: "도서관 대출증 비유." },

  // virtual-memory
  { kind: "mc", id: "cs-q-vmm-1", concept: "virtual-memory", q: "메모리 접근마다 가상 주소를 물리 주소로 변환하는 하드웨어는?", options: ["ALU", "MMU", "DMA", "PCB"], answer: 1, explain: "변환 정보는 OS가 설정한다." },
  { kind: "ox", id: "cs-q-vmm-2", concept: "virtual-memory", q: "서로 다른 두 프로그램이 같은 가상 주소 0x1000을 쓰면 반드시 충돌한다.", answer: false, explain: "각각 다른 물리 주소로 변환될 수 있다." },
  { kind: "mc", id: "cs-q-vmm-3", concept: "virtual-memory", q: "허용되지 않은 메모리 영역에 접근할 때 나는 대표 오류는?", options: ["Stack Overflow", "세그멘테이션 폴트", "Cache Miss", "Overflow Flag"], answer: 1, explain: "Segmentation Fault." },
  { kind: "mc", id: "cs-q-vmm-4", concept: "virtual-memory", q: "가상 메모리의 이점이 아닌 것은?", options: ["주소 공간 분리·보호", "RAM보다 큰 프로그램 실행", "실제 배치를 몰라도 됨", "CPU 클럭 증가"], answer: 3, explain: "분리·보호, 효율, 추상화." },
  { kind: "ox", id: "cs-q-vmm-5", concept: "virtual-memory", q: "malloc()은 C 표준 라이브러리 함수로, 내부적으로 OS에 메모리를 요청한다.", answer: true, explain: "시스템 호출 자체가 아니다." },

  // paging
  { kind: "mc", id: "cs-q-pg-1", concept: "paging", q: "RAM 쪽의 고정 크기 블록을 부르는 이름은?", options: ["페이지", "프레임", "세그먼트", "섹터"], answer: 1, explain: "가상 쪽 = 페이지." },
  { kind: "mc", id: "cs-q-pg-2", concept: "paging", q: "페이지 폴트 처리의 마지막 단계는?", options: ["CPU가 예외 발생", "빈 프레임 확보", "페이지 테이블 갱신", "중단된 명령을 다시 실행"], answer: 3, explain: "적재 → 테이블 갱신 → 명령 재실행." },
  { kind: "short", id: "cs-q-pg-3", concept: "paging", q: "메모리가 부족해 스왑 인·아웃이 지나치게 반복되어 극도로 느려지는 현상은?", answers: ["스래싱", "thrashing", "쓰래싱"], explain: "Thrashing." },
  { kind: "ox", id: "cs-q-pg-4", concept: "paging", q: "페이징에서는 연속된 가상 페이지가 RAM의 떨어진 프레임에 배치될 수 있다.", answer: true, explain: "페이지 0 → 프레임 3, 1 → 0, 2 → 5." },
  { kind: "mc", id: "cs-q-pg-5", concept: "paging", q: "페이지와 프레임의 연결 정보와 권한을 담은 것은?", options: ["PCB", "페이지 테이블", "Job Queue", "FAT"], answer: 1, explain: "Page Table." },
  { kind: "ox", id: "cs-q-pg-6", concept: "paging", q: "요구 페이징은 프로그램 시작 시 모든 페이지를 RAM에 올린다.", answer: false, explain: "필요한 페이지만 그때그때 올린다." },
  { kind: "short", id: "cs-q-pg-7", concept: "paging", q: "흔히 쓰이는 페이지 크기는? (예: 4KiB)", answers: ["4kib", "4kb", "4 kib", "4 kb", "4096"], explain: "시스템마다 다르지만 4KiB가 흔하다." },

  // scheduler-dispatcher-gui
  { kind: "mc", id: "cs-q-sd-1", concept: "scheduler-dispatcher-gui", q: "선택된 프로그램이 CPU에서 실제로 실행되도록 제어권을 넘기는 것은?", options: ["스케줄러", "디스패처", "셸", "MMU"], answer: 1, explain: "스케줄러는 '누구를 실행할까' 선택." },
  { kind: "ox", id: "cs-q-sd-2", concept: "scheduler-dispatcher-gui", q: "GUI 윈도우 관리는 커널이 동작하기 위한 필수 조건이다.", answer: false, explain: "GUI 없는 리눅스 서버도 잘 동작한다." },
  { kind: "mc", id: "cs-q-sd-3", concept: "scheduler-dispatcher-gui", q: "키보드·마우스 입력을 받을 창을 정하는 것은?", options: ["Z-order", "포커스", "화면 합성", "디스패치"], answer: 1, explain: "Z-order는 앞뒤 순서." },
  { kind: "mc", id: "cs-q-sd-4", concept: "scheduler-dispatcher-gui", q: "GUI 기능 구현 위치에 대한 교안 설명으로 옳은 것은?", options: ["Windows는 커널 밖, Linux는 커널 안", "Windows는 성능을 위해 커널 내부, Linux는 안정성을 위해 커널 밖", "둘 다 커널 내부", "둘 다 GUI가 없다"], answer: 1, explain: "구현 방식의 차이." },

  // booting
  { kind: "mc", id: "cs-q-bt-1", concept: "booting", q: "부팅 순서로 옳은 것은?", options: ["부트 로더 → 펌웨어 → 커널 → 서비스", "펌웨어 → 부트 로더 → 커널 → 서비스·UI", "커널 → 펌웨어 → 부트 로더 → UI", "펌웨어 → 커널 → 부트 로더 → UI"], answer: 1, explain: "UEFI → Boot Loader → Kernel." },
  { kind: "mc", id: "cs-q-bt-2", concept: "booting", q: "일반 PC에서 펌웨어가 저장된 곳은?", options: ["SSD", "RAM", "메인보드의 플래시 메모리", "캐시"], answer: 2, explain: "비휘발성. 부트 로더는 SSD 등." },
  { kind: "ox", id: "cs-q-bt-3", concept: "booting", q: "현대 PC는 대부분 BIOS 대신 UEFI를 사용한다.", answer: true, explain: "BIOS는 과거 방식." },
  { kind: "mc", id: "cs-q-bt-4", concept: "booting", q: "커널을 RAM에 적재하고 실행을 넘기는 것은?", options: ["펌웨어", "부트 로더", "셸", "디스패처"], answer: 1, explain: "펌웨어는 부트 로더를 적재한다." },
  { kind: "ox", id: "cs-q-bt-5", concept: "booting", q: "부트 로더는 일반 PC에서 메인보드의 ROM에만 저장된다.", answer: false, explain: "SSD 등 저장장치에 저장된다." },

  // program-process
  { kind: "mc", id: "cs-q-pp-1", concept: "program-process", q: "전역 변수가 저장되는 영역은?", options: ["Code", "Data", "Heap", "Stack"], answer: 1, explain: "전역·정적 변수." },
  { kind: "mc", id: "cs-q-pp-2", concept: "program-process", q: "malloc으로 할당한 메모리가 위치하는 영역은?", options: ["Code", "Data", "Heap", "Stack"], answer: 2, explain: "해제하지 않으면 메모리 누수." },
  { kind: "mc", id: "cs-q-pp-3", concept: "program-process", q: "지역 변수·매개변수·리턴 주소가 저장되는 영역은?", options: ["Code", "Data", "Heap", "Stack"], answer: 3, explain: "LIFO, 함수 종료 시 자동 반환." },
  { kind: "ox", id: "cs-q-pp-4", concept: "program-process", q: "같은 프로그램을 두 번 실행하면 같은 PID를 공유하는 하나의 프로세스가 된다.", answer: false, explain: "서로 다른 PID와 독립 메모리를 가진 별개 프로세스." },
  { kind: "ox", id: "cs-q-pp-5", concept: "program-process", q: "Code(텍스트) 영역은 임의 수정을 막기 위해 읽기 전용이다.", answer: true, explain: "기계어 명령어." },
  { kind: "mc", id: "cs-q-pp-6", concept: "program-process", q: "스택과 힙 비교로 옳은 것은?", options: ["스택이 힙보다 크기가 매우 크다", "스택은 할당이 매우 빠르고, 힙은 상대적으로 느리다", "힙은 함수 종료 시 자동 반환된다", "스택의 대표 문제는 메모리 누수다"], answer: 1, explain: "스택 문제 = Stack Overflow, 힙 문제 = Memory Leak·단편화." },
  { kind: "short", id: "cs-q-pp-7", concept: "program-process", q: "디스크에 저장된 정적 실행 파일이 메모리에 로드되어 실행 중인 인스턴스를 무엇이라 하는가?", answers: ["프로세스", "process"], explain: "프로그램 = 정적, 프로세스 = 동적." },

  // context-pcb
  { kind: "mc", id: "cs-q-pc-1", concept: "context-pcb", q: "PCB에 들어가지 않는 것은?", options: ["PID", "실행 상태", "저장된 실행 문맥", "프로그램 소스 코드 전체"], answer: 3, explain: "스케줄링·메모리·자원 정보도 PCB에." },
  { kind: "ox", id: "cs-q-pc-2", concept: "context-pcb", q: "실행 문맥에는 PC, CPU 레지스터 값, 스택 포인터가 포함된다.", answer: true, explain: "이어서 실행하는 데 필요한 정보." },
  { kind: "short", id: "cs-q-pc-3", concept: "context-pcb", q: "여러 PCB를 조직해 관리하는 자료구조는?", answers: ["프로세스 테이블", "process table", "프로세스테이블"], explain: "Process Table." },
  { kind: "ox", id: "cs-q-pc-4", concept: "context-pcb", q: "실행 문맥과 실행 상태는 같은 의미다.", answer: false, explain: "문맥 = 이어 가기 위한 정보, 상태 = 준비·실행·대기 분류." },

  // process-states
  { kind: "mc", id: "cs-q-ps-1", concept: "process-states", q: "실행 → 준비 전이의 원인은?", options: ["I/O 요청", "할당 시간 만료", "I/O 완료", "실행 완료"], answer: 1, explain: "타이머 인터럽트." },
  { kind: "mc", id: "cs-q-ps-2", concept: "process-states", q: "실행 → 대기 전이의 원인은?", options: ["I/O 요청", "할당 시간 만료", "스케줄러 선택", "메모리 로드 완료"], answer: 0, explain: "사건을 기다려야 진행 가능." },
  { kind: "ox", id: "cs-q-ps-3", concept: "process-states", q: "I/O가 완료되면 대기 상태의 프로세스는 곧바로 실행 상태가 된다.", answer: false, explain: "대기 → 준비 → (선택되면) 실행." },
  { kind: "mc", id: "cs-q-ps-4", concept: "process-states", q: "준비 상태와 대기 상태의 차이로 옳은 것은?", options: ["준비는 사건을, 대기는 CPU를 기다린다", "준비는 CPU를, 대기는 사건을 기다린다", "둘 다 CPU를 기다린다", "둘 다 I/O를 기다린다"], answer: 1, explain: "준비는 CPU만 주면 즉시 실행 가능." },
  { kind: "ox", id: "cs-q-ps-5", concept: "process-states", q: "준비 큐에는 CPU 외 모든 자원을 확보한 프로세스의 PCB 포인터가 대기한다.", answer: true, explain: "FIFO, 우선순위 큐, 다단계 큐 등." },
  { kind: "mc", id: "cs-q-ps-6", concept: "process-states", q: "대기 → 준비 전이의 원인은?", options: ["타이머 인터럽트", "기다리던 사건 발생(I/O 완료)", "스케줄러 선택", "실행 완료"], answer: 1, explain: "I/O 인터럽트." },

  // interrupt-kinds
  { kind: "mc", id: "cs-q-ik2-1", concept: "interrupt-kinds", q: "페이지 폴트는 어떤 종류에 속하는가?", options: ["하드웨어 인터럽트", "시스템 호출", "예외", "스풀링"], answer: 2, explain: "현재 명령어 실행 중 발생한 사건." },
  { kind: "mc", id: "cs-q-ik2-2", concept: "interrupt-kinds", q: "I/O 완료를 CPU에 알리는 방식은?", options: ["시스템 호출", "장치(하드웨어) 인터럽트", "예외", "폴링 전용"], answer: 1, explain: "I/O 요청 = 시스템 호출, 완료 = 장치 인터럽트." },
  { kind: "ox", id: "cs-q-ik2-3", concept: "interrupt-kinds", q: "0으로 나누기는 예외의 예다.", answer: true, explain: "잘못된 명령도 예외." },
  { kind: "ox", id: "cs-q-ik2-4", concept: "interrupt-kinds", q: "프로세스는 할당 시간(Time Slice)을 반드시 끝까지 채워야 CPU를 반납한다.", answer: false, explain: "I/O 대기면 대기 상태로, 종료면 즉시 반납." },
  { kind: "mc", id: "cs-q-ik2-5", concept: "interrupt-kinds", q: "인터럽트가 발생했을 때 가장 먼저 하는 일은?", options: ["다른 프로세스 선택", "복귀 정보(Context) 저장", "프로세스 종료", "페이지 테이블 삭제"], answer: 1, explain: "저장 → 처리 코드 → 재개 또는 문맥 교환." },
  { kind: "mc", id: "cs-q-ik2-6", concept: "interrupt-kinds", q: "파일 읽기 요청은 어떤 종류인가?", options: ["하드웨어 인터럽트", "시스템 호출", "예외", "타이머 이벤트"], answer: 1, explain: "프로그램이 OS 서비스를 요청." },

  // context-switch
  { kind: "ox", id: "cs-q-cs-1", concept: "context-switch", q: "문맥 교환은 현재 프로세스의 메모리 전체를 복사해 옮기는 작업이다.", answer: false, explain: "PCB에 PC·레지스터·SP 등 문맥만 저장·복원. 주소 공간은 메모리에 그대로." },
  { kind: "mc", id: "cs-q-cs-2", concept: "context-switch", q: "문맥 교환 순서로 옳은 것은?", options: ["B 복원 → A 저장 → B 선택", "A 문맥 저장 → B 선택 → B 문맥 복원 → B 재개", "B 선택 → B 복원 → A 저장", "A 종료 → B 생성"], answer: 1, explain: "인터럽트·시간 만료 → 커널 → 저장 → 선택 → 복원." },
  { kind: "ox", id: "cs-q-cs-3", concept: "context-switch", q: "문맥 교환 동안에는 사용자 프로그램이 진행되지 않으므로 순수한 관리 비용(오버헤드)이다.", answer: true, explain: "레지스터 저장·복원, 주소 공간 전환." },
  { kind: "mc", id: "cs-q-cs-4", concept: "context-switch", q: "프로그램을 메모리에 적재할 때 프로그램의 시작 주소가 저장되는 곳은?", options: ["IR", "PCB의 PC 항목", "Spool", "페이지 폴트 핸들러"], answer: 1, explain: "CPU 배정 시 PCB의 PC·레지스터를 CPU로 복원." },
  { kind: "short", id: "cs-q-cs-5", concept: "context-switch", q: "현재 프로세스의 실행 문맥을 저장하는 OS 자료구조의 약자는?", answers: ["pcb", "process control block"], explain: "Process Control Block." },

  // round-robin
  { kind: "mc", id: "cs-q-rrb-1", concept: "round-robin", q: "라운드 로빈에서 할당 시간이 끝난 프로세스는?", options: ["종료된다", "준비 큐 맨 뒤로 간다", "준비 큐 맨 앞으로 간다", "대기 상태가 된다"], answer: 1, explain: "타이머 인터럽트 → 큐 맨 뒤." },
  { kind: "ox", id: "cs-q-rrb-2", concept: "round-robin", q: "라운드 로빈은 비선점형 스케줄링이다.", answer: false, explain: "선점형. FCFS가 비선점." },
  { kind: "mc", id: "cs-q-rrb-3", concept: "round-robin", q: "RR의 할당 시간을 매우 길게 하면?", options: ["오버헤드 급증", "선착순(FCFS)과 비슷해진다", "교착상태 발생", "응답이 빨라진다"], answer: 1, explain: "너무 짧으면 문맥 교환 오버헤드 급증." },
  { kind: "mc", id: "cs-q-rrb-4", concept: "round-robin", q: "FCFS의 비유와 특징으로 옳은 것은?", options: ["발언 제한시간 토론 / OS가 강제 회수", "은행 창구 줄서기 / 프로세스가 자발적 반납", "노래방 한 곡씩 / 선점", "주차장 전광판 / 세마포어"], answer: 1, explain: "단순·오버헤드 적음, 긴 대기." },
  { kind: "ox", id: "cs-q-rrb-5", concept: "round-robin", q: "단일 코어에서 A와 B가 RR로 실행될 때, A가 실행 중이면 B는 준비 상태다.", answer: true, explain: "I/O가 없으므로 대기가 아니라 준비." },
  { kind: "mc", id: "cs-q-rrb-6", concept: "round-robin", q: "선점형 스케줄링을 쓰는 OS의 예로 교안에 나온 것은?", options: ["일괄 처리 시스템", "Windows·Linux", "상주 모니터", "BIOS"], answer: 1, explain: "빠른 응답·멀티태스킹." },

  // multiprog-process
  { kind: "mc", id: "cs-q-mpp-1", concept: "multiprog-process", q: "A가 I/O를 요청한 직후 A의 상태는?", options: ["실행", "준비", "대기", "종료"], answer: 2, explain: "OS가 A를 대기로 바꾸고 B를 실행." },
  { kind: "mc", id: "cs-q-mpp-2", concept: "multiprog-process", q: "A의 I/O가 완료된 직후 A의 상태는?", options: ["실행", "준비", "대기", "생성"], answer: 1, explain: "스케줄러가 다시 선택하면 재개." },
  { kind: "ox", id: "cs-q-mpp-3", concept: "multiprog-process", q: "다중 프로그래밍은 I/O 대기 시간을 다른 프로세스의 실행 시간으로 바꿔 CPU 활용률을 높인다.", answer: true, explain: "핵심 목적." },
  { kind: "ox", id: "cs-q-mpp-4", concept: "multiprog-process", q: "단일 코어에서도 다중 프로그래밍을 쓰면 특정 시점에 두 프로세스가 물리적으로 동시에 실행된다.", answer: false, explain: "특정 시점에는 하나만 실행된다 — 동시성." },

  // race-condition
  { kind: "mc", id: "cs-q-rc-1", concept: "race-condition", q: "경쟁 상태의 정의로 옳은 것은?", options: ["두 프로세스가 서로의 자원을 영원히 기다리는 상태", "실행 순서·타이밍에 따라 결과가 달라지는 상황", "메모리가 부족해 스왑이 반복되는 상태", "CPU가 I/O를 기다리는 상태"], answer: 1, explain: "1번은 교착상태, 3번은 스래싱." },
  { kind: "mc", id: "cs-q-rc-2", concept: "race-condition", q: "단순 플래그(0/1) 방식이 실패하는 이유는?", options: ["플래그가 너무 커서", "확인(Read)과 변경(Write)이 분리되어 그 사이에 끼어들 수 있어서", "플래그를 OS가 지우기 때문에", "프린터가 느려서"], answer: 1, explain: "여러 기계 명령, 사이에 인터럽트 가능." },
  { kind: "ox", id: "cs-q-rc-3", concept: "race-condition", q: "두 인쇄 작업이 한 프린터에 섞여 출력되는 것은 공유 자원 문제의 예다.", answer: true, explain: "공유 자원 = 공유 변수·파일·프린터 등." },

  // interrupt-disable-tas
  { kind: "mc", id: "cs-q-tas-1", concept: "interrupt-disable-tas", q: "test-and-set의 반환값이 0일 때 의미는?", options: ["이미 사용 중", "권한 획득", "오류", "자원 없음"], answer: 1, explain: "1이면 이미 사용 중. 호출과 동시에 flag는 1로 써진다." },
  { kind: "mc", id: "cs-q-tas-2", concept: "interrupt-disable-tas", q: "인터럽트 차단 방식의 한계가 아닌 것은?", options: ["일반 프로그램은 사용 불가", "오래 막으면 응답성 저하", "다중 코어에서 다른 코어를 막지 못함", "원자성을 하드웨어가 보장"], answer: 3, explain: "마지막은 test-and-set의 장점." },
  { kind: "ox", id: "cs-q-tas-3", concept: "interrupt-disable-tas", q: "두 프로세스가 동시에 test-and-set을 실행하면 둘 다 0을 얻을 수 있다.", answer: false, explain: "원자적이므로 하나만 0을 얻는다." },
  { kind: "short", id: "cs-q-tas-4", concept: "interrupt-disable-tas", q: "자원을 얻을 때까지 CPU를 쓰며 계속 확인하는 것을 무엇이라 하는가?", answers: ["바쁜 대기", "busy waiting", "busy wait", "바쁜대기"], explain: "test-and-set의 한계." },
  { kind: "ox", id: "cs-q-tas-5", concept: "interrupt-disable-tas", q: "test-and-set은 하나의 기계어 명령 안에서 읽기와 1로 쓰기를 수행한다.", answer: true, explain: "원자적 연산." },

  // critical-section
  { kind: "mc", id: "cs-q-crs-1", concept: "critical-section", q: "count = 10에서 두 프로세스가 동시에 count = count + 1을 실행했을 때 나올 수 있는 잘못된 결과는?", options: ["10", "11", "12", "13"], answer: 1, explain: "둘 다 10을 읽고 11을 저장. 정상은 12." },
  { kind: "mc", id: "cs-q-crs-2", concept: "critical-section", q: "한 번에 하나의 프로세스만 임계 구역에 들어가게 하는 원칙은?", options: ["순환 대기", "상호 배제", "비선점", "스풀링"], answer: 1, explain: "Mutual Exclusion." },
  { kind: "ox", id: "cs-q-crs-3", concept: "critical-section", q: "임계 구역은 보호해야 하는 코드 구간이고, 상호 배제는 그 구간을 보호하는 규칙이다.", answer: true, explain: "구분." },
  { kind: "ox", id: "cs-q-crs-4", concept: "critical-section", q: "count = count + 1은 하나의 기계 명령이므로 중간에 끼어들 수 없다.", answer: false, explain: "읽기 → 더하기 → 저장 세 단계." },

  // semaphore
  { kind: "mc", id: "cs-q-se-1", concept: "semaphore", q: "임계 구역 보호를 위한 세마포어의 초기값은?", options: ["0", "1", "−1", "자원 수 + 1"], answer: 1, explain: "wait로 1 → 0, signal로 0 → 1." },
  { kind: "mc", id: "cs-q-se-2", concept: "semaphore", q: "wait(S)에서 자원이 없을 때 세마포어의 동작은?", options: ["계속 확인하며 CPU 사용", "프로세스를 대기(Block) 상태로 전환", "프로세스 강제 종료", "S를 1로 초기화"], answer: 1, explain: "바쁜 대기 문제를 해결." },
  { kind: "ox", id: "cs-q-se-3", concept: "semaphore", q: "세마포어는 test-and-set을 완전히 대체해 하드웨어 원자 연산이 필요 없다.", answer: false, explain: "test-and-set을 하부 기반으로 삼는다." },
  { kind: "mc", id: "cs-q-se-4", concept: "semaphore", q: "세마포어가 해결하는 문제로 묶인 것은?", options: ["바쁜 대기, 다중 자원 관리", "스래싱, 페이지 폴트", "오버플로, 반올림 오차", "부팅, 드라이버"], answer: 0, explain: "카운터로 1개 이상의 자원 제어." },
  { kind: "short", id: "cs-q-se-5", concept: "semaphore", q: "S = 2인 세마포어에 wait(S)를 두 번 한 뒤 signal(S)를 한 번 하면 S의 값은?", answers: ["1"], hint: "숫자만", explain: "2 → 1 → 0 → 1." },
  { kind: "ox", id: "cs-q-se-6", concept: "semaphore", q: "wait와 signal 연산 자체는 원자적으로 수행된다.", answer: true, explain: "중간에 끼어들 수 없다." },

  // deadlock
  { kind: "mc", id: "cs-q-dl-1", concept: "deadlock", q: "교착상태의 4가지 필요조건이 아닌 것은?", options: ["상호 배제", "점유 및 대기", "선점", "순환 대기"], answer: 2, explain: "비선점(강제로 빼앗을 수 없음)이 조건." },
  { kind: "mc", id: "cs-q-dl-2", concept: "deadlock", q: "'자원을 가진 채 다른 자원을 추가로 요청하며 기다림'은 어떤 조건인가?", options: ["상호 배제", "점유 및 대기", "비선점", "순환 대기"], answer: 1, explain: "Hold and Wait." },
  { kind: "ox", id: "cs-q-dl-3", concept: "deadlock", q: "자원을 잠시 기다리는 모든 상황은 교착상태다.", answer: false, explain: "단순 대기는 풀린다. 교착상태는 순환 대기로 영구 정지." },
  { kind: "ox", id: "cs-q-dl-4", concept: "deadlock", q: "4가지 조건 중 하나라도 성립하지 않게 하면 교착상태를 예방할 수 있다.", answer: true, explain: "모두 성립해야 발생." },
  { kind: "mc", id: "cs-q-dl-5", concept: "deadlock", q: "A는 프린터를 쥐고 테이프를, B는 테이프를 쥐고 프린터를 기다리는 대기 관계가 원형인 것은?", options: ["상호 배제", "순환 대기", "비선점", "기아"], answer: 1, explain: "A → B → A." },

  // deadlock-handling
  { kind: "mc", id: "cs-q-dh-1", concept: "deadlock-handling", q: "자원에 번호를 매기고 모두 같은 순서로만 요청하게 하면 깨지는 조건은?", options: ["상호 배제", "점유 및 대기", "비선점", "순환 대기"], answer: 3, explain: "요청 순서 통일." },
  { kind: "mc", id: "cs-q-dh-2", concept: "deadlock-handling", q: "실행 시 필요한 모든 자원을 한꺼번에 확보하면 깨지는 조건은?", options: ["상호 배제", "점유 및 대기", "비선점", "순환 대기"], answer: 1, explain: "일괄 요청. 한계: 기아." },
  { kind: "mc", id: "cs-q-dh-3", concept: "deadlock-handling", q: "자원을 할당할 때마다 안전 상태가 유지되는지 확인하는 방법은?", options: ["예방", "회피", "탐지", "복구"], answer: 1, explain: "Avoidance." },
  { kind: "ox", id: "cs-q-dh-4", concept: "deadlock-handling", q: "Printer Spooler로 프린터를 직접 점유하지 않게 하는 것은 상호 배제 조건을 깨는 예방 기법이다.", answer: true, explain: "자원의 공유화." },
  { kind: "mc", id: "cs-q-dh-5", concept: "deadlock-handling", q: "교착상태 복구 방법이 아닌 것은?", options: ["프로세스 강제 종료", "자원 선점", "자원 할당 그래프 점검 후 조치", "Time Slice 늘리기"], answer: 3, explain: "탐지 = 할당 그래프 점검, 복구 = Kill·Preemption." },
  { kind: "ox", id: "cs-q-dh-6", concept: "deadlock-handling", q: "일괄 요청 방식은 자원을 많이 필요로 하는 프로세스가 오래 기다리는 기아 문제가 없다.", answer: false, explain: "기아가 한계로 언급된다." },

  // spooling
  { kind: "mc", id: "cs-q-sp2-1", concept: "spooling", q: "스풀링에서 Spool은 어디에 있는 대기열인가?", options: ["CPU 레지스터", "저장장치", "캐시", "프린터 내부 ROM"], answer: 1, explain: "저장장치의 대기열." },
  { kind: "ox", id: "cs-q-sp2-2", concept: "spooling", q: "스풀링을 쓰면 인쇄를 요청한 프로세스는 출력이 끝날 때까지 기다려야 다음 작업을 할 수 있다.", answer: false, explain: "요청을 저장하면 즉시 해방된다." },
  { kind: "mc", id: "cs-q-sp2-3", concept: "spooling", q: "스풀링의 효과가 아닌 것은?", options: ["동시 요청 수용", "프로세스 대기 시간 최소화", "순서대로 안정 처리", "CPU 클럭 향상"], answer: 3, explain: "출력 뒤섞임과 충돌도 막는다." },
  { kind: "short", id: "cs-q-sp2-4", concept: "spooling", q: "대기열의 작업을 장치 상태를 보며 순서대로 전달하는 프로그램은?", answers: ["스풀러", "spooler", "print spooler", "프린트 스풀러"], explain: "Spooler." },
];
