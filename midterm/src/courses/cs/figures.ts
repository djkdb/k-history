import type { Figure, Tone } from "@/lib/types";

/** 비트 문자열 → 칸 (강조할 위치는 tone) */
const bits = (s: string, hl: (i: number) => Tone | undefined = () => undefined) =>
  s.split("").map((b, i) => ({ text: b, span: 1, tone: hl(i) }));

/** 컴퓨터시스템개론 그림 — 개념 id → 그림들 */
export const FIGURES: Record<string, Figure[]> = {
  euclid: [
    {
      kind: "fields",
      title: "gcd(48, 18) — 한 번 나눌 때마다 문제가 작아진다",
      caption: "gcd(m, n) = gcd(n, m mod n). 나머지 계산 **3회** 만에 n = 0 → 답 6.",
      rows: [
        {
          fields: [
            { text: "(48, 18)", sub: "48 mod 18 = 12", span: 1, tone: "indigo" },
            { text: "(18, 12)", sub: "18 mod 12 = 6", span: 1, tone: "indigo" },
            { text: "(12, 6)", sub: "12 mod 6 = 0", span: 1, tone: "indigo" },
            { text: "(6, 0)", sub: "답 = 6", span: 1, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "compile-run": [
    {
      kind: "fields",
      title: "gcd.c가 실행되기까지",
      caption: "실행 파일은 디스크의 **정적** 파일, 프로세스는 메모리에서 실행 중인 **동적** 실체(PID).",
      rows: [
        {
          label: "만들기",
          fields: [
            { text: "gcd.c", sub: "소스", span: 2, tone: "zinc" },
            { text: "전처리", sub: "#include", span: 2, tone: "sky" },
            { text: "컴파일", sub: "→ 어셈블리", span: 2, tone: "indigo" },
            { text: "어셈블", sub: "→ 목적 파일", span: 2, tone: "violet" },
            { text: "링킹", sub: "→ 실행 파일", span: 2, tone: "amber" },
          ],
        },
        {
          label: "실행",
          fields: [
            { text: "OS", sub: "프로세스 생성", span: 3, tone: "indigo" },
            { text: "로더", sub: "메모리에 배치", span: 3, tone: "sky" },
            { text: "CPU", sub: "기계어 실행", span: 3, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  abstraction: [
    {
      kind: "fields",
      title: "arr[i]의 주소 = 시작 주소 + i × 원소 크기",
      caption: "int(4바이트) 배열이 1000번지에서 시작하면 arr[5](**여섯 번째**)는 1000 + 5 × 4 = **1020**.",
      rows: [
        {
          fields: [0, 1, 2, 3, 4, 5].map((i) => ({
            text: `arr[${i}]`,
            sub: String(1000 + i * 4),
            span: 1,
            tone: i === 5 ? ("emerald" as const) : undefined,
          })),
        },
      ],
    },
  ],
  "flipflop-register": [
    {
      kind: "fields",
      title: "플립플롭 8개 = 8비트 레지스터",
      caption: "플립플롭 하나가 1비트를 기억한다(클록 시점에 D를 저장해 Q로 유지).",
      rows: [{ fields: bits("10110010", () => "indigo").map((f, i) => ({ ...f, sub: `FF${7 - i}` })) }],
    },
  ],
  hdd: [
    {
      kind: "fields",
      title: "HDD 접근 시간 = 탐색 + 회전 지연 + 전송",
      caption: "기계 부품이 움직여야 해서 앞의 두 지연이 크다(너비는 감을 위한 예시).",
      rows: [
        {
          fields: [
            { text: "탐색 시간", sub: "헤드 → 트랙", span: 5, tone: "rose" },
            { text: "회전 지연", sub: "섹터가 헤드 아래로", span: 4, tone: "amber" },
            { text: "전송", sub: "읽기·쓰기", span: 2, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "char-code": [
    {
      kind: "fields",
      title: "UTF-8 — ASCII는 1바이트, 한글은 보통 3바이트",
      rows: [
        { label: "'A' = 65 = U+0041", fields: [{ text: "01000001", sub: "1바이트 (ASCII와 같음)", span: 1, tone: "sky" }] },
        {
          label: "'가' = U+AC00",
          fields: [
            { text: "11101010", sub: "1바이트째", span: 1, tone: "indigo" },
            { text: "10110000", sub: "2바이트째", span: 1, tone: "indigo" },
            { text: "10000000", sub: "3바이트째", span: 1, tone: "indigo" },
          ],
        },
      ],
    },
  ],
  image: [
    {
      kind: "fields",
      title: "RGB 픽셀 하나 = 24비트",
      caption: "성분당 8비트(0~255) → 약 1,677만 색. 1,920 × 1,080 × 24비트 ≈ **6.2MB**(압축 전).",
      rows: [
        {
          fields: [
            { text: "R", sub: "8비트", span: 1, tone: "rose" },
            { text: "G", sub: "8비트", span: 1, tone: "emerald" },
            { text: "B", sub: "8비트", span: 1, tone: "sky" },
          ],
        },
      ],
    },
  ],
  "twos-complement": [
    {
      kind: "fields",
      title: "−3 만들기 (4비트)",
      caption: "모든 비트를 **반전**하고 **1을 더한다**. 최상위 비트 1 = 음수.",
      rows: [
        { label: "3", fields: bits("0011") },
        { label: "반전", fields: bits("1100", () => "amber") },
        { label: "+1 → −3", fields: bits("1101", (i) => (i === 0 ? "rose" : "emerald")) },
      ],
    },
    {
      kind: "grid",
      title: "4비트 2의 보수 전체 (−8 ~ 7)",
      cols: ["값", "패턴", "값", "패턴"],
      cells: [
        ["−8", "1000", "0", "0000"],
        ["−7", "1001", "1", "0001"],
        ["−6", "1010", "2", "0010"],
        ["−5", "1011", "3", "0011"],
        ["−4", "1100", "4", "0100"],
        ["−3", "1101", "5", "0101"],
        ["−2", "1110", "6", "0110"],
        ["−1", "1111", "7", "0111"],
      ],
      marks: [0, 1, 2, 3, 4, 5, 6, 7].flatMap((r) => [
        { r, c: 1, tone: "rose" as const },
        { r, c: 3, tone: "sky" as const },
      ]),
      mono: true,
      caption: "음수가 하나 더 많은 이유: 0이 양수 쪽(최상위 비트 0)에 있기 때문.",
    },
  ],
  "fixed-float": [
    {
      kind: "fields",
      title: "5.75를 두 방식으로",
      rows: [
        {
          label: "고정소수점 (정수 4 + 소수 4비트)",
          fields: [
            { text: "0101", sub: "정수 5", span: 4, tone: "indigo" },
            { text: ".", span: 1 },
            { text: "1100", sub: ".75", span: 4, tone: "sky" },
          ],
        },
        {
          label: "부동소수점 (정규화)",
          fields: [
            { text: "1.0111", sub: "유효숫자 — 맨 앞 1", span: 5, tone: "emerald" },
            { text: "× 2²", sub: "지수 2", span: 3, tone: "amber" },
          ],
        },
      ],
    },
  ],
  ieee754: [
    {
      kind: "fields",
      title: "(101.11)₂ = 1.0111 × 2² 를 float로",
      caption: "지수 = 2 + **127** = 129 = 10000001. 가수는 맨 앞 1을 **빼고**(숨은 비트) 0111 뒤에 0을 채운다.",
      rows: [
        {
          label: "float 32비트",
          fields: [
            { text: "0", sub: "부호 1", span: 2, tone: "rose" },
            { text: "10000001", sub: "지수 8 (바이어스 127)", span: 8, tone: "amber" },
            { text: "0111000…0", sub: "가수 23", span: 13, tone: "emerald" },
          ],
        },
        {
          label: "double 64비트",
          fields: [
            { text: "1", sub: "부호", span: 2, tone: "rose" },
            { text: "11", sub: "지수 (바이어스 1023)", span: 8, tone: "amber" },
            { text: "52", sub: "가수 (비트 수)", span: 13, tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "cpu-parts": [
    {
      kind: "graph",
      title: "CPU 안과 밖",
      caption: "제어장치가 지휘하고, ALU가 계산하고, 레지스터가 바로 쓸 값을 든다. 바깥과는 **버스**로 주고받는다.",
      w: 340,
      h: 170,
      nodes: [
        { id: "cpu", label: "", x: 112, y: 88, w: 212, h: 156, shape: "dashed", tone: "indigo" },
        { id: "t", label: "CPU", x: 30, y: 22, w: 30, h: 14, shape: "text" },
        { id: "cu", label: "제어장치\n명령 해석·신호", x: 58, y: 66, w: 88, h: 44, tone: "violet" },
        { id: "alu", label: "ALU\n산술·논리", x: 168, y: 66, w: 76, h: 44, tone: "amber" },
        { id: "reg", label: "레지스터 (PC · IR · 범용)", x: 112, y: 134, w: 180, h: 32, tone: "sky" },
        { id: "mem", label: "주기억장치", x: 284, y: 50, w: 92, h: 40, shape: "db", tone: "emerald" },
        { id: "io", label: "입출력장치", x: 284, y: 128, w: 92, h: 32 },
      ],
      edges: [
        { from: "cu", to: "alu" },
        { from: "alu", to: "reg", both: true },
        { from: "reg", to: "mem", both: true, label: "버스" },
        { from: "reg", to: "io", both: true },
      ],
    },
  ],
  "memory-hierarchy": [
    {
      kind: "stack",
      title: "기억장치 계층",
      shape: "pyramid",
      top: "CPU에 가까움 · 빠름 · 작음 · 비쌈",
      bottom: "멂 · 느림 · 큼 · 쌈",
      layers: [
        { label: "레지스터", tone: "rose" },
        { label: "캐시 L1 → L2 → L3", note: "L3는 보통 여러 코어가 공유", tone: "amber" },
        { label: "주기억장치 (RAM)", tone: "indigo" },
        { label: "보조기억장치 (SSD · HDD)", tone: "zinc" },
      ],
    },
  ],
  bus: [
    {
      kind: "graph",
      title: "세 종류의 버스",
      caption: "읽기(1000번지): ① 주소 버스로 1000 ② 제어 버스로 Read ③ 메모리가 데이터 버스로 값.",
      w: 340,
      h: 176,
      nodes: [
        { id: "cpu", label: "CPU", x: 60, y: 24, w: 80, h: 32, tone: "indigo" },
        { id: "mem", label: "메모리", x: 170, y: 24, w: 80, h: 32, tone: "emerald" },
        { id: "io", label: "I/O", x: 280, y: 24, w: 80, h: 32 },
        { id: "a", label: "주소 버스 — 어느 위치?", x: 170, y: 88, w: 320, h: 24, shape: "pill", tone: "sky" },
        { id: "d", label: "데이터 버스 — 실제 값", x: 170, y: 122, w: 320, h: 24, shape: "pill", tone: "amber" },
        { id: "c", label: "제어 버스 — 읽기·쓰기·인터럽트", x: 170, y: 156, w: 320, h: 24, shape: "pill", tone: "violet" },
      ],
      edges: [
        { from: "cpu", to: "a", plain: true },
        { from: "mem", to: "a", plain: true },
        { from: "io", to: "a", plain: true },
      ],
    },
  ],
  "von-neumann": [
    {
      kind: "graph",
      title: "폰 노이만 구조와 병목",
      caption: "명령어와 데이터가 **같은 메모리**에 있어 둘 다 이 좁은 길로 오간다. CPU가 빨라도 메모리를 기다린다 → 캐시·메모리 계층·Prefetching으로 **완화**.",
      w: 340,
      h: 110,
      nodes: [
        { id: "cpu", label: "CPU\n(빠름)", x: 60, y: 55, w: 90, h: 50, tone: "indigo" },
        { id: "mem", label: "메모리\n명령어 + 데이터", x: 272, y: 55, w: 120, h: 50, shape: "db", tone: "emerald" },
      ],
      edges: [{ from: "cpu", to: "mem", both: true, tone: "rose", label: "병목" }],
    },
  ],
  "virtual-machine-lang": [
    {
      kind: "fields",
      title: "16비트 명령어 = 16진 4자리",
      caption: "첫 4비트가 Opcode(16가지). 156C = 주소 6C의 값을 R5에 LOAD, 35A7 = R5를 주소 A7에 STORE.",
      rows: [
        {
          label: "156C",
          fields: [
            { text: "1", sub: "Opcode LOAD", span: 1, tone: "rose" },
            { text: "5", sub: "R5", span: 1, tone: "indigo" },
            { text: "6C", sub: "주소", span: 2, tone: "emerald" },
          ],
        },
        {
          label: "5056",
          fields: [
            { text: "5", sub: "ADD", span: 1, tone: "rose" },
            { text: "0", sub: "R0 ←", span: 1, tone: "indigo" },
            { text: "5", sub: "R5", span: 1, tone: "sky" },
            { text: "6", sub: "+ R6", span: 1, tone: "sky" },
          ],
        },
      ],
    },
  ],
  "machine-cycle": [
    {
      kind: "graph",
      title: "기계 주기 — 명령어마다 세 단계",
      caption: "인출에서 이미 **PC를 다음 주소로**(2바이트 명령어면 +2). 분기 명령은 실행 단계에서 PC를 다른 주소로 바꾼다.",
      w: 340,
      h: 150,
      nodes: [
        { id: "f", label: "인출 Fetch\nIR ← [PC], PC += 2", x: 90, y: 30, w: 150, h: 42, tone: "indigo" },
        { id: "d", label: "해석 Decode\nLOAD? ADD? JUMP?", x: 260, y: 75, w: 140, h: 42, tone: "amber" },
        { id: "e", label: "실행 Execute\n이동·연산·저장·분기", x: 90, y: 120, w: 150, h: 42, tone: "emerald" },
      ],
      edges: [
        { from: "f", to: "d" },
        { from: "d", to: "e" },
        { from: "e", to: "f", label: "반복" },
      ],
    },
  ],
  "logic-masking": [
    {
      kind: "grid",
      title: "AND 마스크로 상위 4비트만 남기기",
      caption: "마스크 1인 자리는 그대로, 0인 자리는 0. OR는 1로 **설정**, XOR는 **반전**에 쓴다.",
      rows: ["값", "AND 마스크", "결과"],
      cells: [
        "10110100".split(""),
        "11110000".split(""),
        "10110000".split(""),
      ],
      marks: [
        ...[0, 1, 2, 3].map((c) => ({ r: 1, c, tone: "indigo" as const })),
        ...[0, 1, 2, 3].map((c) => ({ r: 2, c, tone: "emerald" as const })),
      ],
      mono: true,
    },
  ],
  "shift-rotate": [
    {
      kind: "fields",
      title: "이동과 회전 (8비트)",
      caption: "논리 이동은 빈자리에 0, 산술 오른쪽 이동은 **부호 비트 복제**, 회전은 밀려난 비트가 반대쪽으로.",
      rows: [
        { label: "원래 10110010", fields: bits("10110010") },
        { label: "왼쪽 회전 (ROL)", fields: bits("01100101", (i) => (i === 7 ? "amber" : undefined)) },
        { label: "논리 오른쪽 이동", fields: bits("01011001", (i) => (i === 0 ? "sky" : undefined)) },
        { label: "11110100(−12) 산술 오른쪽 → −6", fields: bits("11111010", (i) => (i === 0 ? "rose" : undefined)) },
      ],
    },
  ],
  flags: [
    {
      kind: "grid",
      title: "8비트 덧셈과 CF · OF",
      caption: "CF = **unsigned** 범위 초과(MSB 밖 carry-out), OF = **signed** 범위 초과.",
      cols: ["결과", "CF", "OF"],
      rows: ["255 + 1", "127 + 1", "128 + 128"],
      cells: [
        ["00000000", "1", "0"],
        ["10000000", "0", "1"],
        ["00000000", "1", "1"],
      ],
      marks: [
        { r: 0, c: 1, tone: "amber" },
        { r: 1, c: 2, tone: "rose" },
        { r: 2, c: 1, tone: "amber" },
        { r: 2, c: 2, tone: "rose" },
      ],
      mono: true,
    },
  ],
  "io-controller": [
    {
      kind: "stack",
      title: "I/O 요청이 내려가는 길",
      layers: [
        { label: "응용 프로그램", note: "장치를 직접 제어하지 않음", tone: "sky" },
        { label: "OS · 파일 시스템", tone: "indigo" },
        { label: "디바이스 드라이버", note: "**소프트웨어** — OS 요청 → 제어기 명령", tone: "violet" },
        { label: "I/O 제어기", note: "**하드웨어** — Control · Status · Data 레지스터", tone: "amber" },
        { label: "주변장치", tone: "zinc" },
      ],
    },
  ],
  "serial-parallel": [
    {
      kind: "gantt",
      title: "4비트 1010 보내기",
      caption: "병렬은 선 4개로 T에 끝나지만 **Skew**·간섭이 고속에서 문제. 직렬은 1 Lane에 4T — 대신 신호 속도를 높이고 Lane을 묶는다(PCIe x4 = 직렬 Lane 4개).",
      end: 4,
      ticks: [0, 1, 2, 3, 4],
      rows: [
        { label: "병렬 선1", segs: [{ from: 0, to: 1, label: "1", tone: "indigo" }] },
        { label: "병렬 선2", segs: [{ from: 0, to: 1, label: "0", tone: "indigo" }] },
        { label: "병렬 선3", segs: [{ from: 0, to: 1, label: "1", tone: "indigo" }] },
        { label: "병렬 선4", segs: [{ from: 0, to: 1, label: "0", tone: "indigo" }] },
        {
          label: "직렬 Lane",
          segs: [
            { from: 0, to: 1, label: "1", tone: "emerald" },
            { from: 1, to: 2, label: "0", tone: "emerald" },
            { from: 2, to: 3, label: "1", tone: "emerald" },
            { from: 3, to: 4, label: "0", tone: "emerald" },
          ],
        },
      ],
    },
  ],
  "polling-interrupt": [
    {
      kind: "gantt",
      title: "CPU 시간을 어디에 쓰나",
      caption: "Polling은 Busy인지 **계속 묻느라** CPU를 쓰고, Interrupt는 그동안 **다른 작업**을 하다 알림이 오면 처리한다.",
      end: 10,
      rows: [
        {
          label: "Polling",
          segs: [
            { from: 0, to: 2, label: "확인", tone: "rose" },
            { from: 2, to: 4, label: "확인", tone: "rose" },
            { from: 4, to: 6, label: "확인", tone: "rose" },
            { from: 6, to: 8, label: "확인", tone: "rose" },
            { from: 8, to: 10, label: "처리", tone: "emerald" },
          ],
        },
        {
          label: "Interrupt",
          segs: [
            { from: 0, to: 8, label: "다른 작업", tone: "indigo" },
            { from: 8, to: 10, label: "처리", tone: "emerald" },
          ],
        },
      ],
    },
  ],
  dma: [
    {
      kind: "graph",
      title: "DMA — CPU는 조건만 정하고 다른 일을",
      caption: "① CPU가 **시작 주소·크기·방향** 설정 → ②③ DMA가 장치 ↔ 메모리를 직접 옮김(그동안 CPU는 다른 일) → ⑤ 끝나면 **Interrupt**. 병목 자체를 없애지는 않는다.",
      w: 340,
      h: 186,
      nodes: [
        { id: "cpu", label: "CPU", x: 170, y: 24, w: 84, h: 32, tone: "indigo" },
        { id: "dma", label: "DMA 제어기", x: 170, y: 100, w: 104, h: 34, tone: "amber" },
        { id: "dev", label: "I/O 장치\n(SSD 등)", x: 50, y: 160, w: 84, h: 40 },
        { id: "mem", label: "메모리", x: 290, y: 160, w: 80, h: 40, shape: "db", tone: "emerald" },
      ],
      edges: [
        { from: "cpu", to: "dma", bend: 70, label: "① 설정" },
        { from: "dma", to: "cpu", bend: 70, dashed: true, tone: "rose", label: "⑤ Interrupt" },
        { from: "dev", to: "dma", label: "②" },
        { from: "dma", to: "mem", label: "③" },
      ],
    },
  ],
  "kernel-syscall": [
    {
      kind: "stack",
      title: "사용자 공간과 커널",
      layers: [
        { label: "사용자 공간", note: "응용 프로그램 · 셸 · C 라이브러리(printf, fopen)", tone: "sky" },
        { label: "시스템 호출", note: "open · read · write · fork · exec · exit …", tone: "amber" },
        { label: "커널 (커널 모드)", note: "프로세스 · 메모리 · 파일 시스템 · 장치 관리", tone: "indigo" },
        { label: "하드웨어", tone: "zinc" },
      ],
      caption: "사용자 모드/커널 모드는 **CPU 실행 권한** 구분 — 관리자(root) 계정과는 다르다.",
    },
  ],
  "virtual-memory": [
    {
      kind: "graph",
      title: "같은 가상 주소, 다른 물리 주소",
      caption: "OS가 변환 정보를 정하고, 하드웨어 **MMU**가 접근마다 변환·권한 검사.",
      w: 340,
      h: 130,
      nodes: [
        { id: "a", label: "프로그램 A\n가상 0x1000", x: 60, y: 30, w: 100, h: 40, tone: "sky" },
        { id: "b", label: "프로그램 B\n가상 0x1000", x: 60, y: 100, w: 100, h: 40, tone: "violet" },
        { id: "mmu", label: "MMU", x: 170, y: 65, w: 60, h: 34, tone: "amber" },
        { id: "p1", label: "물리 0x8000", x: 282, y: 30, w: 96, h: 32, tone: "emerald" },
        { id: "p2", label: "물리 0xC000", x: 282, y: 100, w: 96, h: 32, tone: "emerald" },
      ],
      edges: [
        { from: "a", to: "mmu" },
        { from: "b", to: "mmu" },
        { from: "mmu", to: "p1", label: "A" },
        { from: "mmu", to: "p2", label: "B" },
      ],
    },
  ],
  paging: [
    {
      kind: "graph",
      title: "페이지 → 프레임 (떨어져 있어도 된다)",
      caption: "연결 정보와 권한은 **페이지 테이블**. 없는 페이지에 접근하면 **페이지 폴트** → OS가 저장장치에서 가져온다.",
      w: 340,
      h: 196,
      nodes: [
        { id: "vt", label: "가상 (페이지)", x: 70, y: 12, w: 100, h: 16, shape: "text" },
        { id: "pt", label: "RAM (프레임)", x: 270, y: 12, w: 100, h: 16, shape: "text" },
        ...[0, 1, 2].map((i) => ({ id: `p${i}`, label: `페이지 ${i}`, x: 70, y: 46 + i * 34, w: 96, h: 28, tone: "sky" as const })),
        ...[0, 1, 2, 3, 4, 5].map((i) => ({
          id: `f${i}`,
          label: `프레임 ${i}`,
          x: 270,
          y: 40 + i * 28,
          w: 96,
          h: 24,
          tone: [3, 0, 5].includes(i) ? ("emerald" as const) : ("zinc" as const),
        })),
      ],
      edges: [
        { from: "p0", to: "f3" },
        { from: "p1", to: "f0" },
        { from: "p2", to: "f5" },
      ],
    },
  ],
  booting: [
    {
      kind: "fields",
      title: "부팅 순서와 저장 위치",
      rows: [
        {
          fields: [
            { text: "펌웨어", sub: "UEFI · 메인보드 플래시", span: 3, tone: "amber" },
            { text: "부트 로더", sub: "SSD 등 저장장치", span: 3, tone: "sky" },
            { text: "커널", sub: "RAM에 적재", span: 2, tone: "indigo" },
            { text: "서비스·UI", sub: "로그인·네트워크", span: 2, tone: "emerald" },
          ],
        },
      ],
      caption: "펌웨어가 하드웨어 초기화 후 부트 로더를 RAM에 → 부트 로더가 커널을 RAM에 → 커널이 서비스·UI 실행. 옛 방식은 BIOS.",
    },
  ],
  "program-process": [
    {
      kind: "stack",
      title: "프로세스의 메모리 구조",
      layers: [
        { label: "Stack ↓", note: "지역 변수 · 매개변수 · 리턴 주소 (LIFO, 자동 반환)", tone: "rose" },
        { label: "↕ 빈 공간", tone: "zinc" },
        { label: "Heap ↑", note: "malloc · new — 해제 안 하면 메모리 누수", tone: "amber" },
        { label: "Data", note: "전역 · 정적 변수", tone: "sky" },
        { label: "Code (텍스트)", note: "기계어 명령어 · 읽기 전용", tone: "indigo" },
      ],
    },
  ],
  "process-states": [
    {
      kind: "graph",
      title: "프로세스 상태 전이",
      caption: "I/O가 끝나도 **곧장 실행이 아니라 준비**로 간다. 준비 = CPU를 기다림, 대기 = 사건을 기다림.",
      w: 340,
      h: 232,
      nodes: [
        { id: "new", label: "생성", x: 40, y: 26, w: 60, h: 28, shape: "pill" },
        { id: "rdy", label: "준비\nReady", x: 80, y: 118, w: 76, h: 42, tone: "sky" },
        { id: "run", label: "실행\nRunning", x: 262, y: 118, w: 80, h: 42, tone: "emerald" },
        { id: "wait", label: "대기\nWaiting", x: 171, y: 206, w: 80, h: 40, tone: "amber" },
        { id: "end", label: "종료", x: 300, y: 26, w: 60, h: 28, shape: "pill" },
      ],
      edges: [
        { from: "new", to: "rdy" },
        { from: "rdy", to: "run", bend: -40, label: "스케줄러 선택" },
        { from: "run", to: "rdy", bend: -40, label: "시간 만료" },
        { from: "run", to: "wait", label: "I/O 요청" },
        { from: "wait", to: "rdy", label: "I/O 완료" },
        { from: "run", to: "end" },
      ],
    },
  ],
  "context-switch": [
    {
      kind: "graph",
      title: "문맥 교환 — 책갈피 꽂고, 다른 책갈피 펴기",
      caption: "인터럽트·시간 만료로 커널에 들어오면, PCB에 **PC · 레지스터 · SP**만 저장·복원한다. 메모리 전체를 복사하지 않는다. 그 사이는 순수한 **오버헤드**.",
      w: 340,
      h: 140,
      nodes: [
        { id: "a", label: "A 실행 중", x: 52, y: 30, w: 84, h: 30, tone: "emerald" },
        { id: "pa", label: "PCB_A\n문맥 저장", x: 170, y: 30, w: 92, h: 40, tone: "amber" },
        { id: "pb", label: "PCB_B\n문맥 복원", x: 170, y: 108, w: 92, h: 40, tone: "amber" },
        { id: "b", label: "B 실행", x: 290, y: 108, w: 84, h: 30, tone: "emerald" },
        { id: "s", label: "스케줄러\nB 선택", x: 290, y: 30, w: 84, h: 40, tone: "indigo" },
      ],
      edges: [
        { from: "a", to: "pa" },
        { from: "pa", to: "s" },
        { from: "s", to: "pb" },
        { from: "pb", to: "b" },
      ],
    },
  ],
  "round-robin": [
    {
      kind: "gantt",
      title: "라운드 로빈 (할당 10ms, 단일 코어, I/O 없음)",
      caption: "시간이 끝나면 타이머 인터럽트로 **큐 맨 뒤**로(선점). A가 실행일 때 B는 **준비**. 회색 = 문맥 교환.",
      end: 32,
      ticks: [0, 10, 20, 30],
      rows: [
        {
          label: "CPU",
          segs: [
            { from: 0, to: 10, label: "A", tone: "indigo" },
            { from: 10, to: 11, tone: "zinc" },
            { from: 11, to: 21, label: "B", tone: "emerald" },
            { from: 21, to: 22, tone: "zinc" },
            { from: 22, to: 32, label: "A", tone: "indigo" },
          ],
        },
        {
          label: "A 상태",
          segs: [
            { from: 0, to: 10, label: "실행", tone: "indigo" },
            { from: 10, to: 22, label: "준비", tone: "zinc" },
            { from: 22, to: 32, label: "실행", tone: "indigo" },
          ],
        },
        {
          label: "B 상태",
          segs: [
            { from: 0, to: 11, label: "준비", tone: "zinc" },
            { from: 11, to: 21, label: "실행", tone: "emerald" },
            { from: 21, to: 32, label: "준비", tone: "zinc" },
          ],
        },
      ],
    },
  ],
  "multiprog-process": [
    {
      kind: "gantt",
      title: "I/O 대기 시간을 다른 프로세스의 실행으로",
      end: 30,
      rows: [
        {
          label: "CPU",
          segs: [
            { from: 0, to: 10, label: "A 계산", tone: "indigo" },
            { from: 10, to: 20, label: "B 계산", tone: "emerald" },
            { from: 20, to: 30, label: "A 계산", tone: "indigo" },
          ],
        },
        { label: "I/O", segs: [{ from: 10, to: 20, label: "A 입출력", tone: "amber" }] },
        {
          label: "A",
          segs: [
            { from: 0, to: 10, label: "실행", tone: "indigo" },
            { from: 10, to: 20, label: "대기", tone: "amber" },
            { from: 20, to: 30, label: "실행", tone: "indigo" },
          ],
        },
        {
          label: "B",
          segs: [
            { from: 0, to: 10, label: "준비", tone: "zinc" },
            { from: 10, to: 20, label: "실행", tone: "emerald" },
            { from: 20, to: 30, label: "준비", tone: "zinc" },
          ],
        },
      ],
      caption: "단일 코어에서는 어느 순간에도 **하나만** 실행 — 번갈아 실행해 동시에 보이는 것(동시성).",
    },
  ],
  "critical-section": [
    {
      kind: "gantt",
      title: "count = 10에서 둘이 동시에 +1 하면",
      caption: "읽기 → 더하기 → 저장이 끊겨 끼어들면 둘 다 10을 읽어 **11**이 된다(정상은 12). 그래서 임계 구역에는 한 번에 하나만(상호 배제).",
      end: 4,
      rows: [
        {
          label: "P1",
          segs: [
            { from: 0, to: 1, label: "읽기 10", tone: "indigo" },
            { from: 2, to: 3, label: "쓰기 11", tone: "indigo" },
          ],
        },
        {
          label: "P2",
          segs: [
            { from: 1, to: 2, label: "읽기 10", tone: "rose" },
            { from: 3, to: 4, label: "쓰기 11", tone: "rose" },
          ],
        },
      ],
    },
  ],
  semaphore: [
    {
      kind: "fields",
      title: "S = 1로 임계 구역 지키기",
      caption: "S가 0일 때 온 프로세스는 바쁜 대기 대신 **대기(Block)** 상태로 잠들고, signal이 깨운다.",
      rows: [
        {
          fields: [
            { text: "S = 1", sub: "비어 있음", span: 2, tone: "emerald" },
            { text: "wait(S)", sub: "1 → 0, 진입", span: 3, tone: "amber" },
            { text: "임계 구역", sub: "한 번에 하나", span: 3, tone: "rose" },
            { text: "signal(S)", sub: "0 → 1, 깨움", span: 3, tone: "sky" },
          ],
        },
      ],
    },
  ],
  deadlock: [
    {
      kind: "graph",
      title: "교착상태 — 서로의 자원을 기다리는 고리",
      caption: "자원 → 프로세스 = 점유, 프로세스 → 자원 = 요청. 고리가 닫히면(**순환 대기**) 아무도 못 움직인다.",
      w: 340,
      h: 170,
      nodes: [
        { id: "A", label: "프로세스 A", x: 70, y: 40, w: 96, h: 32, shape: "pill", tone: "indigo" },
        { id: "B", label: "프로세스 B", x: 270, y: 130, w: 96, h: 32, shape: "pill", tone: "indigo" },
        { id: "P", label: "프린터", x: 70, y: 130, w: 84, h: 32, tone: "amber" },
        { id: "T", label: "테이프", x: 270, y: 40, w: 84, h: 32, tone: "amber" },
      ],
      edges: [
        { from: "P", to: "A", label: "점유" },
        { from: "A", to: "T", label: "요청", tone: "rose" },
        { from: "T", to: "B", label: "점유" },
        { from: "B", to: "P", label: "요청", tone: "rose" },
      ],
    },
  ],
  "deadlock-handling": [
    {
      kind: "grid",
      title: "예방 = 네 조건 중 하나를 깨기",
      cols: ["깨는 조건", "방법"],
      cells: [
        ["상호 배제", "자원 공유화 (Printer Spooler)"],
        ["점유 및 대기", "일괄 요청 — 한계: 기아"],
        ["비선점", "(강제로 빼앗기)"],
        ["순환 대기", "요청 순서 통일 (번호순)"],
      ],
      marks: [
        { r: 0, c: 0, tone: "indigo" },
        { r: 1, c: 0, tone: "indigo" },
        { r: 3, c: 0, tone: "indigo" },
      ],
      caption: "회피 = 할당할 때마다 **안전 상태** 확인. 탐지·복구 = 자원 할당 그래프 점검 후 강제 종료·자원 선점.",
    },
  ],
  spooling: [
    {
      kind: "graph",
      title: "스풀링 — 요청은 줄에 두고 바로 돌아간다",
      w: 340,
      h: 130,
      nodes: [
        { id: "a", label: "프로세스 A", x: 50, y: 30, w: 84, h: 30, tone: "sky" },
        { id: "b", label: "프로세스 B", x: 50, y: 100, w: 84, h: 30, tone: "sky" },
        { id: "q", label: "Spool\n(저장장치의 대기열)", x: 170, y: 65, w: 110, h: 44, shape: "db", tone: "amber" },
        { id: "p", label: "스풀러 →\n프린터", x: 290, y: 65, w: 84, h: 44, tone: "emerald" },
      ],
      edges: [
        { from: "a", to: "q" },
        { from: "b", to: "q" },
        { from: "q", to: "p" },
      ],
      caption: "스풀러가 프린터 상태를 보며 순서대로 넘긴다. 프로세스는 요청만 넣고 **즉시 해방**. 프린터를 직접 점유하지 않으니 상호 배제 조건이 깨진다(교착상태 예방).",
    },
  ],
};
