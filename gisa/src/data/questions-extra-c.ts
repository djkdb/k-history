import type { WrittenQuestion } from "@/lib/types";

/** 보충 문항 — 5과목 정보시스템 구축 관리 */
export const EXTRA_C_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qs-cocomo-mode",
    subject: "system",
    sourceId: "s-estimation",
    question:
      "COCOMO 모형에서 5만 라인 이하의 비교적 단순한 소프트웨어에 적용하는 유형은?",
    options: ["조직형(Organic)", "반분리형(Semi-detached)", "내장형(Embedded)", "확장형(Extended)"],
    answerIndex: 0,
    explanation:
      "조직형은 5만 라인 이하의 간단한 업무용 소프트웨어, 반분리형은 30만 라인 이하, 내장형은 30만 라인을 넘는 복잡한 시스템에 쓴다.",
    optionNotes: [
      null,
      "반분리형은 30만 라인 이하다.",
      "내장형은 30만 라인을 넘는 것이다.",
      "COCOMO 에 확장형이라는 유형은 없다.",
    ],
    importance: "must",
  },
  {
    id: "qs-fp-estimate",
    subject: "system",
    sourceId: "s-estimation",
    question: "기능 점수(FP) 모형에서 비용 산정에 쓰는 요소가 아닌 것은?",
    options: ["외부 입력", "외부 출력", "내부 논리 파일", "코드 라인 수"],
    answerIndex: 3,
    explanation:
      "기능 점수는 사용자가 보는 기능의 수로 센다 — 외부 입력·출력·조회, 내부 논리 파일, 외부 인터페이스 파일 다섯 가지다. 코드 라인 수로 세는 것은 LOC 기법이다.",
    optionNotes: [null, null, null, "정답. 라인 수로 세는 것은 LOC 기법이다."],
    importance: "must",
  },
  {
    id: "qs-loc-calc",
    subject: "system",
    sourceId: "s-estimation",
    question:
      "총 라인 수가 30,000 라인, 개발자가 5명, 1인당 월 300라인을 작성한다면 개발 기간은?",
    options: ["10개월", "15개월", "20개월", "25개월"],
    answerIndex: 2,
    explanation:
      "한 달에 만드는 양은 5명 × 300라인 = 1,500라인이다. 30,000 ÷ 1,500 = 20개월이다.",
    optionNotes: [
      "인원을 한 번 더 나눈 값이다.",
      "계산이 맞지 않는다.",
      null,
      "계산이 맞지 않는다.",
    ],
    importance: "high",
  },
  {
    id: "qs-attack-sqli",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "웹 입력창에 데이터베이스 질의문을 끼워 넣어 인증을 우회하거나 자료를 빼내는 공격은?",
    options: ["XSS", "SQL 삽입", "CSRF", "버퍼 오버플로"],
    answerIndex: 1,
    explanation:
      "SQL 삽입(SQL Injection)이다. 입력값 검증과 매개변수화된 질의(Prepared Statement)로 막는다.",
    optionNotes: [
      "XSS 는 스크립트를 끼워 넣어 다른 사용자 브라우저에서 돌게 한다.",
      null,
      "CSRF 는 로그인한 사용자의 권한으로 몰래 요청을 보내게 한다.",
      "버퍼 오버플로는 메모리 경계를 넘겨 덮어쓴다.",
    ],
    importance: "must",
  },
  {
    id: "qs-attack-ddos",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "TCP 연결 요청(SYN)만 잔뜩 보내 놓고 응답하지 않아 서버의 연결 대기열을 채워 버리는 공격은?",
    options: ["Smurf 공격", "SYN 플러딩", "Ping of Death", "세션 하이재킹"],
    answerIndex: 1,
    explanation:
      "SYN 플러딩이다. 3-way 핸드셰이크의 두 번째 단계에서 멈춰 세워 대기열을 고갈시킨다.",
    optionNotes: [
      "Smurf 는 위조한 브로드캐스트 ICMP 로 응답을 몰아준다.",
      null,
      "Ping of Death 는 규격을 넘는 큰 패킷을 보낸다.",
      "세션 하이재킹은 남의 세션을 가로챈다.",
    ],
    importance: "must",
  },
  {
    id: "qs-raid-level",
    subject: "system",
    sourceId: "s-raid-backup",
    question: "RAID 1 에 대한 설명으로 옳은 것은?",
    options: [
      "데이터를 여러 디스크에 나눠 써 속도를 높이지만 중복은 없다.",
      "같은 데이터를 두 디스크에 똑같이 써 둔다.",
      "패리티를 여러 디스크에 나눠 저장한다.",
      "패리티를 전용 디스크 하나에 모아 저장한다.",
    ],
    answerIndex: 1,
    explanation:
      "RAID 1 은 미러링이다. RAID 0 은 스트라이핑, RAID 5 는 분산 패리티, RAID 3·4 는 전용 패리티 디스크를 쓴다.",
    optionNotes: [
      "이것은 RAID 0 이다.",
      null,
      "이것은 RAID 5 다.",
      "이것은 RAID 3·4 다.",
    ],
    importance: "high",
  },
  {
    id: "qs-secure-coding-input",
    subject: "system",
    sourceId: "s-secure-coding",
    question: "시큐어 코딩에서 \"입력 데이터 검증 및 표현\" 항목에 해당하는 취약점은?",
    options: [
      "SQL 삽입",
      "하드코딩된 비밀번호",
      "적절하지 않은 예외 처리",
      "메모리 누수",
    ],
    answerIndex: 0,
    explanation:
      "SQL 삽입·XSS·경로 조작은 모두 입력값을 그대로 믿어서 생기는 문제로 \"입력 데이터 검증 및 표현\" 항목이다.",
    optionNotes: [
      null,
      "하드코딩된 비밀번호는 \"보안 기능\" 항목이다.",
      "예외 처리는 \"에러 처리\" 항목이다.",
      "메모리 누수는 \"코드 오류\" 항목이다.",
    ],
    importance: "must",
  },
  {
    id: "qs-method-cbd",
    subject: "system",
    sourceId: "s-methodology",
    question:
      "이미 만들어 둔 부품(컴포넌트)을 조립해 시스템을 만드는 개발 방법론은?",
    options: ["구조적 방법론", "정보공학 방법론", "객체지향 방법론", "컴포넌트 기반 방법론"],
    answerIndex: 3,
    explanation:
      "CBD(Component Based Development)다. 재사용으로 개발 기간을 줄이고 품질을 안정시키는 것이 목적이다.",
    optionNotes: [
      "구조적 방법론은 기능을 나눠 내려간다.",
      "정보공학은 자료를 중심에 둔다.",
      "객체지향은 객체 단위로 나눈다.",
      null,
    ],
    importance: "high",
  },
  {
    id: "qs-new-sdn",
    subject: "system",
    sourceId: "s-network-new",
    question:
      "네트워크 장비의 제어 기능과 전달 기능을 분리해, 소프트웨어로 네트워크를 제어하는 기술은?",
    options: ["SDN", "NFC", "VPN", "SSO"],
    answerIndex: 0,
    explanation:
      "SDN(Software Defined Network)이다. 제어부를 따로 떼어 중앙에서 소프트웨어로 흐름을 정한다.",
    optionNotes: [
      null,
      "NFC 는 10cm 안에서 쓰는 근거리 무선 통신이다.",
      "VPN 은 공중망 위에 사설망처럼 안전한 통로를 만든다.",
      "SSO 는 한 번 로그인으로 여러 시스템을 쓰는 것이다.",
    ],
    importance: "high",
  },
  {
    id: "qs-new-blockchain",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "거래 기록을 블록으로 묶어 사슬처럼 잇고, 참여자들이 나눠 갖게 해 위조를 어렵게 만든 기술은?",
    options: ["블록체인", "디지털 트윈", "메타버스", "마이데이터"],
    answerIndex: 0,
    explanation:
      "블록체인이다. 중앙의 관리자 없이 참여자 모두가 같은 장부를 나눠 갖는다.",
    optionNotes: [
      null,
      "디지털 트윈은 현실의 대상을 가상에 똑같이 만들어 실험한다.",
      "메타버스는 가상 세계에서의 사회·경제 활동을 이른다.",
      "마이데이터는 개인이 자기 정보를 옮겨 쓰게 하는 제도다.",
    ],
    importance: "high",
  },
  {
    id: "qs-new-docker",
    subject: "system",
    sourceId: "s-software-new",
    question: "컨테이너 기술에 대한 설명으로 옳은 것은?",
    options: [
      "가상 머신마다 운영체제를 따로 올린다.",
      "호스트의 커널을 함께 쓰므로 가상 머신보다 가볍고 빠르게 뜬다.",
      "하드웨어를 통째로 흉내 내는 기술이다.",
      "컨테이너끼리는 전혀 격리되지 않는다.",
    ],
    answerIndex: 1,
    explanation:
      "컨테이너는 호스트 커널을 공유하고 프로세스 수준에서 격리한다. 그래서 가상 머신보다 가볍고 뜨는 속도가 빠르다.",
    optionNotes: [
      "운영체제를 따로 올리는 것은 가상 머신이다.",
      null,
      "하드웨어를 흉내 내는 것은 하이퍼바이저다.",
      "네임스페이스와 cgroup 으로 격리된다.",
    ],
    importance: "high",
  },
  {
    id: "qs-backup-rto",
    subject: "system",
    sourceId: "s-raid-backup",
    question: "재해 복구에서 RTO(Recovery Time Objective)가 뜻하는 것은?",
    options: [
      "얼마나 이전 시점의 데이터까지 되살릴 것인가",
      "장애가 난 뒤 얼마 만에 복구할 것인가",
      "백업을 며칠에 한 번 받을 것인가",
      "복구 훈련을 얼마나 자주 할 것인가",
    ],
    answerIndex: 1,
    explanation:
      "RTO 는 복구까지 걸리는 목표 시간, RPO(Recovery Point Objective)는 어느 시점의 데이터까지 되살릴 것인가다. 둘을 바꿔 낸다.",
    optionNotes: ["이것이 RPO 다.", null, "백업 주기는 RPO 를 맞추기 위한 수단이다.", "훈련 주기는 별개다."],
    importance: "high",
  },
];
