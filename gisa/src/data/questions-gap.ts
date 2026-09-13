import type { WrittenQuestion } from "@/lib/types";

/**
 * 출제기준의 빈 범위를 메우는 문항.
 *
 * 부정형("옳지 않은 것은?")을 일부러 넉넉히 넣었다. 재 보니 우리 문항의
 * 부정형 비율이 11% 였는데, 실제 필기는 그보다 훨씬 잦다. 부정형은 네 선지를
 * 모두 판단해야 하므로 난도가 높은 쪽이고, 그것이 적으면 앱이 실제 시험보다
 * 쉬워진다.
 */
export const GAP_QUESTIONS: WrittenQuestion[] = [
  // ── 현행 시스템 분석 ────────────────────────────────
  {
    id: "qg-current-order",
    subject: "design",
    sourceId: "d-current-system",
    question: "현행 시스템 파악 절차를 순서대로 나열한 것은?",
    options: [
      "구성·기능·인터페이스 파악 → 아키텍처·소프트웨어 구성 파악 → 하드웨어·네트워크 구성 파악",
      "하드웨어·네트워크 구성 파악 → 구성·기능·인터페이스 파악 → 아키텍처 파악",
      "아키텍처 파악 → 하드웨어 구성 파악 → 기능 파악",
      "인터페이스 파악 → 하드웨어 구성 파악 → 소프트웨어 구성 파악",
    ],
    answerIndex: 0,
    explanation:
      "위에서 아래로 내려간다. 무엇이 있는지(구성·기능·인터페이스) → 어떻게 짜여 있는지(아키텍처·소프트웨어) → 무엇 위에 올라가 있는지(하드웨어·네트워크) 순이다.",
    optionNotes: [
      null,
      "하드웨어는 마지막 단계다.",
      "순서가 어긋난다.",
      "순서가 어긋난다.",
    ],
    importance: "high",
  },
  {
    id: "qg-current-dbms",
    subject: "design",
    sourceId: "d-current-system",
    question: "DBMS 를 고를 때 고려할 사항으로 옳지 않은 것은?",
    options: [
      "대용량 처리 성능과 응답 시간",
      "장애 발생 시 복구 방법과 가용성",
      "기술 지원과 라이선스 비용",
      "개발자가 평소 즐겨 쓰는 편집기와의 궁합",
    ],
    answerIndex: 3,
    explanation:
      "DBMS 선정은 성능·가용성·기술 지원·비용·상호 호환성을 본다. 개인의 도구 취향은 판단 기준이 아니다.",
    optionNotes: [null, null, null, "정답. 선정 기준이 아니다."],
    importance: "high",
  },

  // ── 인터페이스 구현과 검증 ──────────────────────────
  {
    id: "qg-iface-security-layer",
    subject: "develop",
    sourceId: "v-interface-impl",
    question:
      "인터페이스 보안을 위한 프로토콜과 동작 계층을 바르게 짝지은 것은?",
    options: [
      "IPSec — 네트워크 계층, SSL — 전송 계층, S-HTTP — 응용 계층",
      "IPSec — 응용 계층, SSL — 네트워크 계층, S-HTTP — 전송 계층",
      "IPSec — 전송 계층, SSL — 응용 계층, S-HTTP — 네트워크 계층",
      "셋 모두 응용 계층에서 동작한다.",
    ],
    answerIndex: 0,
    explanation:
      "IPSec 은 IP 계층(네트워크), SSL/TLS 는 전송 계층, S-HTTP 는 응용 계층에서 건다. 계층이 낮을수록 감싸는 범위가 넓다.",
    optionNotes: [null, "뒤바뀌었다.", "뒤바뀌었다.", "계층이 각각 다르다."],
    importance: "must",
  },
  {
    id: "qg-iface-verify-tool",
    subject: "develop",
    sourceId: "v-interface-impl",
    question: "인터페이스 구현 검증 도구가 아닌 것은?",
    options: ["xUnit", "FitNesse", "Selenium", "Tripwire"],
    answerIndex: 3,
    explanation:
      "Tripwire 는 파일이 몰래 바뀌었는지 보는 데이터 무결성 검사 도구다. 검증 도구는 xUnit·STAF·FitNesse·NTAF·Selenium·watir 다.",
    optionNotes: [null, null, null, "정답. 무결성 검사 도구다."],
    importance: "must",
  },
  {
    id: "qg-iface-ntaf",
    subject: "develop",
    sourceId: "v-interface-impl",
    question:
      "STAF 의 분산 환경 자동화와 FitNesse 의 웹 기반 테스트 틀을 합쳐 만든 인터페이스 구현 검증 도구는?",
    options: ["watir", "NTAF", "xUnit", "Selenium"],
    answerIndex: 1,
    explanation:
      "NTAF 다. 두 도구의 장점을 합쳐 만든 것으로, 이름과 유래를 함께 묻는다.",
    optionNotes: [
      "watir 는 루비 기반 웹 테스트 도구다.",
      null,
      "xUnit 은 언어별 단위 시험 틀의 총칭이다.",
      "Selenium 은 웹 브라우저 자동화 도구다.",
    ],
    importance: "high",
  },
  {
    id: "qg-iface-json",
    subject: "develop",
    sourceId: "v-interface-impl",
    question: "AJAX 에 대한 설명으로 옳지 않은 것은?",
    options: [
      "화면 전체를 새로 고치지 않고 필요한 데이터만 주고받는다.",
      "비동기 방식이라 응답을 기다리는 동안에도 다른 일을 할 수 있다.",
      "주고받는 데이터 형식으로 JSON 이나 XML 을 쓴다.",
      "자원을 URI 로 나타내고 HTTP 메서드로 다루는 인터페이스 설계 양식이다.",
    ],
    answerIndex: 3,
    explanation:
      "네 번째는 REST 의 설명이다. AJAX 는 '어떻게 부르는가'이고 REST 는 '어떻게 설계하는가'로 층이 다르다.",
    optionNotes: [null, null, null, "정답. REST 의 설명이다."],
    importance: "must",
  },

  // ── 제품 소프트웨어 매뉴얼 ──────────────────────────
  {
    id: "qg-manual-kind",
    subject: "develop",
    sourceId: "v-manual",
    question: "설치 매뉴얼에 들어갈 항목으로 보기 어려운 것은?",
    options: [
      "설치 화면과 단계별 절차",
      "설치 중 나타날 수 있는 오류 메시지와 대처법",
      "설치 이후 정상 동작을 확인하는 방법",
      "기능별 사용 방법과 화면 구성 안내",
    ],
    answerIndex: 3,
    explanation:
      "기능별 사용 방법은 사용자 매뉴얼의 몫이다. 설치 매뉴얼은 '깔 때', 사용자 매뉴얼은 '쓸 때' 본다.",
    optionNotes: [null, null, null, "정답. 사용자 매뉴얼 항목이다."],
    importance: "normal",
  },

  // ── 절차형 SQL ──────────────────────────────────────
  {
    id: "qg-proc-trigger",
    subject: "database",
    sourceId: "b-procedural",
    question:
      "테이블에 INSERT·UPDATE·DELETE 가 일어날 때 사용자가 부르지 않아도 저절로 실행되는 절차형 SQL 은?",
    options: ["프로시저", "사용자 정의 함수", "트리거", "커서"],
    answerIndex: 2,
    explanation:
      "트리거다. 프로시저는 CALL 로 불러야 하고, 함수는 반드시 값을 하나 돌려준다.",
    optionNotes: [
      "프로시저는 CALL 로 부른다.",
      "함수는 SELECT 안에서 부른다.",
      null,
      "커서는 여러 행을 한 줄씩 훑기 위한 것이다.",
    ],
    importance: "must",
  },
  {
    id: "qg-proc-function",
    subject: "database",
    sourceId: "b-procedural",
    question: "절차형 SQL 에 대한 설명으로 옳지 않은 것은?",
    options: [
      "프로시저는 반환값이 없어도 된다.",
      "사용자 정의 함수는 반드시 값을 하나 반환한다.",
      "트리거는 CALL 문으로 직접 호출해 실행한다.",
      "DECLARE·BEGIN/END·EXCEPTION 으로 구성된다.",
    ],
    answerIndex: 2,
    explanation:
      "트리거는 직접 부르는 것이 아니라 이벤트가 나면 저절로 돈다. 이것이 프로시저와 가장 다른 점이다.",
    optionNotes: [null, null, "정답. 저절로 실행된다.", null],
    importance: "must",
  },
  {
    id: "qg-proc-cursor",
    subject: "database",
    sourceId: "b-procedural",
    question: "커서(Cursor)를 사용하는 순서로 옳은 것은?",
    options: [
      "DECLARE → OPEN → FETCH → CLOSE",
      "OPEN → DECLARE → CLOSE → FETCH",
      "FETCH → OPEN → DECLARE → CLOSE",
      "OPEN → FETCH → DECLARE → CLOSE",
    ],
    answerIndex: 0,
    explanation:
      "선언하고, 열고, 한 줄씩 가져오고, 닫는다. 닫지 않으면 자원이 물려 있는 채로 남는다.",
    optionNotes: [null, "선언이 먼저다.", "순서가 어긋난다.", "선언이 먼저다."],
    importance: "high",
  },

  // ── 물리 설계 ───────────────────────────────────────
  {
    id: "qg-partition-kind",
    subject: "database",
    sourceId: "b-physical",
    question: "데이터베이스 파티셔닝 기법이 아닌 것은?",
    options: [
      "범위 분할(Range)",
      "해시 분할(Hash)",
      "목록 분할(List)",
      "정규 분할(Normal)",
    ],
    answerIndex: 3,
    explanation:
      "파티셔닝은 범위·해시·목록·조합(Composite) 네 가지다. 정규 분할이라는 기법은 없다.",
    optionNotes: [null, null, null, "정답. 그런 기법은 없다."],
    importance: "high",
  },
  {
    id: "qg-replication",
    subject: "database",
    sourceId: "b-physical",
    question:
      "데이터베이스 이중화에서 변경 내용을 곧바로 모든 사본에 반영하는 기법은?",
    options: ["Eager 기법", "Lazy 기법", "Shadow 기법", "Deferred 기법"],
    answerIndex: 0,
    explanation:
      "Eager 는 즉시, Lazy 는 나중에 반영한다. 즉시 반영은 일관성이 높지만 그만큼 느리다.",
    optionNotes: [
      null,
      "Lazy 는 나중에 반영한다.",
      "이중화 기법이 아니다.",
      "이중화 기법이 아니다.",
    ],
    importance: "high",
  },
  {
    id: "qg-clustering",
    subject: "database",
    sourceId: "b-physical",
    question: "클러스터링에 대한 설명으로 옳지 않은 것은?",
    options: [
      "자주 함께 조회되는 행을 물리적으로 가까이 모아 둔다.",
      "조회 성능이 좋아진다.",
      "입력·수정·삭제가 잦은 테이블일수록 유리하다.",
      "디스크 접근 횟수를 줄이는 것이 목적이다.",
    ],
    answerIndex: 2,
    explanation:
      "모아 두는 구조라 갱신이 잦으면 자리를 다시 잡아야 해 오히려 불리하다. 조회 위주 테이블에 쓴다.",
    optionNotes: [null, null, "정답. 갱신이 잦으면 불리하다.", null],
    importance: "high",
  },

  // ── 데이터 전환 ─────────────────────────────────────
  {
    id: "qg-etl-order",
    subject: "database",
    sourceId: "b-migration",
    question: "데이터 전환의 ETL 세 단계를 순서대로 나열한 것은?",
    options: [
      "추출(Extraction) → 변환(Transformation) → 적재(Loading)",
      "변환(Transformation) → 추출(Extraction) → 적재(Loading)",
      "적재(Loading) → 변환(Transformation) → 추출(Extraction)",
      "추출(Extraction) → 적재(Loading) → 변환(Transformation)",
    ],
    answerIndex: 0,
    explanation:
      "원천에서 뽑고(E), 새 구조에 맞게 바꾸고(T), 목표에 넣는다(L). 이름 순서 그대로다.",
    optionNotes: [
      null,
      "뽑기 전에 바꿀 수 없다.",
      "순서가 거꾸로다.",
      "넣기 전에 바꾼다.",
    ],
    importance: "must",
  },
  {
    id: "qg-cleansing",
    subject: "database",
    sourceId: "b-migration",
    question: "데이터 정제(Cleansing)에 대한 설명으로 옳은 것은?",
    options: [
      "결측값·중복·형식 오류를 옮기기 전에 바로잡는 일이다.",
      "원천 데이터를 목표 시스템 구조에 맞게 꼴을 바꾸는 일이다.",
      "추출한 데이터를 목표 데이터베이스에 넣는 일이다.",
      "전환이 끝난 뒤 건수가 맞는지 세어 보는 일이다.",
    ],
    answerIndex: 0,
    explanation:
      "정제는 잘못된 값을 바로잡는 일이다. 꼴을 바꾸는 것은 변환, 넣는 것은 적재, 건수를 세는 것은 검증이다.",
    optionNotes: [
      null,
      "이것은 변환이다.",
      "이것은 적재다.",
      "이것은 전환 검증이다.",
    ],
    importance: "high",
  },

  // ── 개발 환경과 배치 ────────────────────────────────
  {
    id: "qg-build-tool",
    subject: "language",
    sourceId: "l-server-build",
    question: "다음 중 빌드 자동화 도구가 아닌 것은?",
    options: ["Ant", "Maven", "Gradle", "Jira"],
    answerIndex: 3,
    explanation:
      "Jira 는 이슈·프로젝트 관리 도구다. 빌드 도구는 Ant·Maven·Gradle 이다.",
    optionNotes: [null, null, null, "정답. 이슈 관리 도구다."],
    importance: "high",
  },
  {
    id: "qg-batch-feature",
    subject: "language",
    sourceId: "l-server-build",
    question: "배치 프로그램이 갖춰야 할 요건으로 보기 어려운 것은?",
    options: [
      "사람이 개입하지 않아도 정해진 시각에 스스로 수행된다.",
      "잘못된 데이터를 만나도 중단되지 않고 처리한다.",
      "대량의 데이터를 한꺼번에 처리한다.",
      "처리 중간마다 사용자에게 확인을 받아 진행한다.",
    ],
    answerIndex: 3,
    explanation:
      "배치는 사용자와 주고받지 않는 것이 핵심이다. 확인을 받아야 한다면 그것은 배치가 아니다.",
    optionNotes: [
      null,
      null,
      null,
      "정답. 배치는 사용자와 상호작용하지 않는다.",
    ],
    importance: "must",
  },
  {
    id: "qg-batch-scheduler",
    subject: "language",
    sourceId: "l-server-build",
    question: "다음 중 배치 스케줄러에 해당하지 않는 것은?",
    options: ["스프링 배치(Spring Batch)", "Quartz", "Cron", "Redis"],
    answerIndex: 3,
    explanation:
      "Redis 는 인메모리 키-값 저장소다. 스케줄러는 스프링 배치·Quartz·Cron 이다.",
    optionNotes: [null, null, null, "정답. 인메모리 저장소다."],
    importance: "high",
  },

  // ── 보안 솔루션 ─────────────────────────────────────
  {
    id: "qg-ids-ips",
    subject: "system",
    sourceId: "s-security-solution",
    question: "IDS 와 IPS 의 차이로 옳은 것은?",
    options: [
      "IDS 는 탐지해 알리고, IPS 는 탐지해 그 자리에서 차단한다.",
      "IDS 는 차단하고, IPS 는 알리기만 한다.",
      "둘 다 차단만 하고 알리지는 않는다.",
      "IDS 는 방화벽의 다른 이름이다.",
    ],
    answerIndex: 0,
    explanation:
      "IDS 는 경보, IPS 는 차단이다. 시험은 이 둘을 바꿔 내는 것을 가장 좋아한다.",
    optionNotes: [
      null,
      "뒤바뀌었다.",
      "IDS 는 알린다.",
      "방화벽과는 다른 장비다.",
    ],
    importance: "must",
  },
  {
    id: "qg-ids-detect",
    subject: "system",
    sourceId: "s-security-solution",
    question:
      "침입 탐지 기법 중 알려지지 않은 새로운 공격까지 잡아낼 가능성이 있는 것은?",
    options: ["오용 탐지", "이상 탐지", "패턴 탐지", "시그니처 탐지"],
    answerIndex: 1,
    explanation:
      "이상 탐지는 평소와 다른 행동을 찾으므로 알려지지 않은 공격도 걸릴 수 있다. 오용 탐지(= 패턴·시그니처)는 알려진 것만 잡는다.",
    optionNotes: [
      "오용 탐지는 알려진 패턴과 견준다.",
      null,
      "오용 탐지의 다른 이름이다.",
      "오용 탐지의 다른 이름이다.",
    ],
    importance: "must",
  },
  {
    id: "qg-security-nac",
    subject: "system",
    sourceId: "s-security-solution",
    question:
      "네트워크에 접속하는 단말이 보안 정책을 지키는지 검사해 접속을 통제하는 솔루션은?",
    options: ["NAC", "DLP", "SIEM", "VPN"],
    answerIndex: 0,
    explanation:
      "NAC(Network Access Control)다. DLP 는 자료 유출 방지, SIEM 은 로그 통합 분석, VPN 은 안전한 통신 통로다.",
    optionNotes: [
      null,
      "DLP 는 내부 자료가 밖으로 나가는 것을 막는다.",
      "SIEM 은 여러 장비의 로그를 모아 분석한다.",
      "VPN 은 공중망 위에 사설망처럼 통로를 만든다.",
    ],
    importance: "must",
  },
  {
    id: "qg-security-not",
    subject: "system",
    sourceId: "s-security-solution",
    question: "방화벽에 대한 설명으로 옳지 않은 것은?",
    options: [
      "미리 정한 규칙에 따라 트래픽을 허용하거나 차단한다.",
      "주소와 포트를 보고 판단한다.",
      "내부에서 이미 벌어진 악성 행위까지 모두 찾아낸다.",
      "내부망과 외부망의 경계에 둔다.",
    ],
    answerIndex: 2,
    explanation:
      "방화벽은 경계에서 오가는 것을 거를 뿐, 내부에서 벌어지는 일은 보지 못한다. 그래서 IDS·IPS 를 함께 둔다.",
    optionNotes: [null, null, "정답. 내부 행위는 보지 못한다.", null],
    importance: "high",
  },

  // ── 언어 특성과 분류 (얇았던 곳) ────────────────────
  {
    id: "qg-lang-compile",
    subject: "language",
    sourceId: "l-language-type",
    question: "컴파일 언어와 인터프리터 언어의 차이로 옳지 않은 것은?",
    options: [
      "컴파일 언어는 실행 전에 기계어로 한꺼번에 번역한다.",
      "인터프리터 언어는 한 줄씩 해석하며 실행한다.",
      "일반적으로 컴파일 언어가 실행 속도가 빠르다.",
      "인터프리터 언어는 번역된 실행 파일을 따로 만들어 배포한다.",
    ],
    answerIndex: 3,
    explanation:
      "인터프리터 언어는 그때그때 해석하므로 따로 실행 파일을 만들지 않는 것이 일반적이다. 그래서 원시 코드가 있어야 돈다.",
    optionNotes: [null, null, null, "정답. 실행 파일을 만들지 않는다."],
    importance: "high",
  },
  {
    id: "qg-lang-paradigm",
    subject: "language",
    sourceId: "l-language-type",
    question: "프로그래밍 언어의 분류와 예가 바르게 짝지어지지 않은 것은?",
    options: [
      "절차적 언어 — C, FORTRAN",
      "객체지향 언어 — Java, C++",
      "함수형 언어 — LISP, Haskell",
      "논리형 언어 — COBOL, Pascal",
    ],
    answerIndex: 3,
    explanation: "논리형 언어는 PROLOG 다. COBOL 과 Pascal 은 절차적 언어다.",
    optionNotes: [null, null, null, "정답. 논리형은 PROLOG 다."],
    importance: "high",
  },
];
