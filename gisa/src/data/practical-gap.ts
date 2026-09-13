import type { PracticalQuestion } from "@/lib/types";

/** 출제기준의 빈 범위 — 실기 */
export const PRACTICAL_GAP: PracticalQuestion[] = [
  {
    id: "pg-trigger",
    subject: "database",
    sourceId: "b-procedural",
    kind: "term",
    question:
      "테이블에 INSERT·UPDATE·DELETE 가 일어날 때 사용자가 직접 호출하지 않아도 자동으로 실행되는 절차형 SQL 을 쓰시오.",
    answers: ["트리거", "Trigger", "트리거(Trigger)"],
    points: 5,
    explanation:
      "트리거다. 프로시저는 CALL 로 불러야 하고, 사용자 정의 함수는 반드시 값을 하나 돌려준다.",
    importance: "must",
  },
  {
    id: "pg-proc-parts",
    subject: "database",
    sourceId: "b-procedural",
    kind: "blank",
    question:
      "절차형 SQL 은 변수를 선언하는 ( ① )부, 실제 로직이 들어가는 ( ② )부, 오류를 처리하는 ( ③ )부로 이루어진다. ①~③에 들어갈 예약어를 쓰시오.",
    answers: [
      "① DECLARE ② BEGIN/END ③ EXCEPTION",
      "DECLARE, BEGIN, EXCEPTION",
      "DECLARE, BEGIN/END, EXCEPTION",
    ],
    points: 5,
    explanation:
      "선언부(DECLARE) → 실행부(BEGIN/END) → 예외부(EXCEPTION) 순이다.",
    importance: "must",
  },
  {
    id: "pg-cursor",
    subject: "database",
    sourceId: "b-procedural",
    kind: "term",
    question:
      "질의 결과의 여러 행을 한 줄씩 차례로 가져와 처리하기 위해 사용하는 것을 무엇이라 하는가?",
    answers: ["커서", "Cursor", "커서(Cursor)"],
    points: 5,
    explanation: "커서다. DECLARE → OPEN → FETCH → CLOSE 순으로 쓴다.",
    importance: "high",
  },
  {
    id: "pg-etl",
    subject: "database",
    sourceId: "b-migration",
    kind: "term",
    question:
      "데이터 전환의 세 단계를 뜻하는 ETL 의 각 단계를 순서대로 쓰시오.",
    answers: [
      "추출·변환·적재",
      "Extraction·Transformation·Loading",
      "추출, 변환, 적재",
      "Extract·Transform·Load",
    ],
    points: 5,
    explanation:
      "원천에서 뽑고(Extraction), 새 구조에 맞게 바꾸고(Transformation), 목표에 넣는다(Loading).",
    importance: "must",
  },
  {
    id: "pg-partition",
    subject: "database",
    sourceId: "b-physical",
    kind: "term",
    question:
      "큰 테이블을 날짜처럼 이어지는 값의 구간으로 잘라 나누어 저장하는 파티셔닝 기법을 쓰시오.",
    answers: [
      "범위 분할",
      "Range Partitioning",
      "레인지 파티셔닝",
      "범위 분할(Range)",
    ],
    points: 5,
    explanation:
      "범위 분할이다. 해시 함수로 고르게 흩는 것은 해시 분할, 값 목록으로 나누는 것은 목록 분할이다.",
    importance: "high",
  },
  {
    id: "pg-iface-security",
    subject: "develop",
    sourceId: "v-interface-impl",
    kind: "blank",
    question:
      "인터페이스 보안은 네트워크 계층에서 ( ① ), 전송 계층에서 ( ② ), 응용 계층에서 ( ③ )로 적용한다. ①~③을 쓰시오.",
    answers: [
      "① IPSec ② SSL ③ S-HTTP",
      "IPSec, SSL, S-HTTP",
      "IPSec, TLS, S-HTTP",
      "① IPSec ② SSL/TLS ③ S-HTTP",
    ],
    points: 5,
    explanation:
      "계층이 낮을수록 감싸는 범위가 넓다. IPSec(네트워크) → SSL/TLS(전송) → S-HTTP(응용) 순이다.",
    importance: "must",
  },
  {
    id: "pg-iface-tool",
    subject: "develop",
    sourceId: "v-interface-impl",
    kind: "term",
    question:
      "STAF 의 분산 환경 자동화와 FitNesse 의 웹 기반 테스트 프레임워크를 결합해 만든 인터페이스 구현 검증 도구를 쓰시오.",
    answers: ["NTAF", "NTAF(NHN Test Automation Framework)"],
    points: 5,
    explanation: "NTAF 다. 두 도구의 장점을 합쳐 만들었다.",
    importance: "high",
  },
  {
    id: "pg-ids-ips",
    subject: "system",
    sourceId: "s-security-solution",
    kind: "blank",
    question:
      "침입을 탐지해 관리자에게 알리는 보안 장비는 ( ① ), 탐지에 그치지 않고 그 자리에서 차단까지 하는 장비는 ( ② )이다. ①과 ②를 쓰시오.",
    answers: ["① IDS ② IPS", "IDS, IPS"],
    points: 5,
    explanation:
      "IDS(침입 탐지 시스템)는 경보, IPS(침입 방지 시스템)는 차단이다.",
    importance: "must",
  },
  {
    id: "pg-nac",
    subject: "system",
    sourceId: "s-security-solution",
    kind: "term",
    question:
      "네트워크에 접속하려는 단말이 보안 정책을 지키고 있는지 검사해 접속을 허용하거나 막는 보안 솔루션을 쓰시오.",
    answers: ["NAC", "Network Access Control", "NAC(Network Access Control)"],
    points: 5,
    explanation:
      "NAC 다. 내부 자료 유출을 막는 것은 DLP, 여러 장비의 로그를 모아 분석하는 것은 SIEM 이다.",
    importance: "must",
  },
  {
    id: "pg-batch",
    subject: "language",
    sourceId: "l-server-build",
    kind: "term",
    question:
      "사용자와 상호작용 없이 대량의 데이터를 정해진 시각에 한꺼번에 처리하는 프로그램을 무엇이라 하는가?",
    answers: ["배치 프로그램", "Batch Program", "배치", "배치 프로그램(Batch)"],
    points: 5,
    explanation:
      "배치 프로그램이다. 자동화·견고성·안정성·대용량 처리·성능을 갖춰야 한다.",
    importance: "must",
  },
];
