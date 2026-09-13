import type { Concept } from "@/lib/types";

/**
 * 출제기준을 훑다가 비어 있던 범위.
 *
 * 개념을 다 쓰고 나서 출제기준 세부항목 66개와 하나씩 맞춰 보니 11개가
 * 아예 비어 있었다. 시험에는 나오는데 앱은 가르치지 않는 곳이다.
 * scripts/audit.ts 가 이제 이 빈칸을 세어 알려 준다.
 */
export const GAP_CONCEPTS: Concept[] = [
  {
    id: "d-current-system",
    subject: "design",
    title: "현행 시스템 분석",
    summary:
      "새로 만들기 전에 지금 돌고 있는 것부터 본다. 플랫폼·운영체제·네트워크·DBMS 를 층층이 조사한다.",
    body: [
      "현행 시스템 파악은 세 단계다. ① 구성·기능·인터페이스 파악 → ② 아키텍처와 소프트웨어 구성 파악 → ③ 하드웨어·네트워크 구성 파악.",
      "플랫폼 기능 분석은 지금 쓰는 시스템이 어떤 기능을 어떤 성능으로 내고 있는지를 본다. 새 시스템이 그보다 못하면 안 되기 때문이다.",
      "플랫폼 성능 특성 분석에는 경험적 분석, 성능 테스트, 사용자 인터뷰, 문서 점검이 쓰인다.",
      "운영체제·DBMS·미들웨어를 고를 때는 기능만이 아니라 가용성·성능·기술 지원·구축 비용을 함께 본다.",
    ],
    examPoint:
      "현행 시스템 파악 절차의 순서를 묻거나, DBMS·미들웨어 선정 시 고려 사항으로 옳지 않은 것을 고르게 한다.",
    importance: "high",
    keys: [
      { term: "1단계", mean: "구성·기능·인터페이스 파악" },
      { term: "2단계", mean: "아키텍처·소프트웨어 구성 파악" },
      { term: "3단계", mean: "하드웨어·네트워크 구성 파악" },
    ],
    tracks: ["written"],
  },
  {
    id: "v-interface-impl",
    subject: "develop",
    title: "인터페이스 구현과 검증",
    summary:
      "데이터는 JSON·XML 로 주고받고, AJAX 로 화면을 새로 고치지 않고 부른다. 검증은 xUnit 계열 도구로 한다.",
    body: [
      "인터페이스 데이터 형식은 JSON·XML·YAML 이 쓰인다. JSON 은 속성-값 쌍의 경량 형식이고, XML 은 태그로 감싸는 구조라 더 무겁다.",
      "AJAX 는 화면 전체를 새로 고치지 않고 서버와 데이터만 주고받는 방식이다. REST 는 자원을 URI 로 나타내고 HTTP 메서드로 다루는 인터페이스 양식이다.",
      "인터페이스 보안은 세 계층에서 건다. 네트워크 계층은 IPSec, 전송 계층은 SSL/TLS, 응용 계층은 S-HTTP 다.",
      "구현 검증 도구: xUnit(단위 시험 틀), STAF(분산 환경 자동화), FitNesse(웹 기반 테스트 틀), NTAF(STAF 와 FitNesse 를 합친 NHN 도구), Selenium(웹 브라우저 자동화), watir(루비 기반).",
      "데이터 무결성 검사 도구로는 Tripwire·AIDE·Samhain 처럼 파일이 몰래 바뀌었는지 보는 것들이 있다.",
    ],
    examPoint:
      "검증 도구 이름과 설명을 짝짓게 하거나, 인터페이스 보안을 계층별로 묻는다. IPSec-네트워크, SSL-전송, S-HTTP-응용 이 짝은 그대로 외워야 한다.",
    importance: "must",
    keys: [
      { term: "IPSec", mean: "네트워크 계층 보안" },
      { term: "SSL/TLS", mean: "전송 계층 보안" },
      { term: "S-HTTP", mean: "응용 계층 보안" },
      { term: "NTAF", mean: "STAF + FitNesse (NHN)" },
    ],
    traps: [
      {
        a: "AJAX",
        b: "REST",
        how: "AJAX 는 화면을 새로 고치지 않고 부르는 방식이고, REST 는 자원을 URI 로 나타내는 설계 양식이다. 층이 다르다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "v-manual",
    subject: "develop",
    title: "제품 소프트웨어 매뉴얼",
    summary:
      "설치 매뉴얼은 설치하는 사람에게, 사용자 매뉴얼은 쓰는 사람에게. 둘은 읽는 사람이 다르다.",
    body: [
      "설치 매뉴얼은 설치 과정을 순서대로 적는다. 설치 화면을 그대로 넣고, 오류 메시지와 대처법, 설치 이후 확인 방법까지 담는다.",
      "사용자 매뉴얼은 기능별로 어떻게 쓰는지를 적는다. 사용자 화면과 주의 사항, 고객 지원 방법을 담는다.",
      "매뉴얼 작성 순서: 작성 지침 정의 → 구성 요소 정의 → 항목별 내용 작성 → 검토.",
      "국제 표준(ISO/IEC 12119 등)은 제품 설명서·사용자 문서·프로그램이 갖춰야 할 요건을 정한다.",
    ],
    examPoint:
      "설치 매뉴얼과 사용자 매뉴얼에 들어갈 항목을 바꿔 내거나, 매뉴얼 작성 순서를 묻는다.",
    importance: "normal",
    traps: [
      {
        a: "설치 매뉴얼",
        b: "사용자 매뉴얼",
        how: "설치 매뉴얼은 '깔 때', 사용자 매뉴얼은 '쓸 때' 본다. 오류 메시지 대처는 설치 쪽, 기능별 사용법은 사용자 쪽이다.",
      },
    ],
    tracks: ["written"],
  },
  {
    id: "b-procedural",
    subject: "database",
    title: "절차형 SQL — 프로시저·함수·트리거",
    summary:
      "SQL 에 조건과 반복을 넣어 하나의 덩어리로 저장해 둔다. 트리거는 부르지 않아도 저절로 돈다.",
    body: [
      "프로시저(Stored Procedure)는 일련의 SQL 을 묶어 이름 붙여 저장해 둔 것이다. CALL 로 부르며 값을 돌려주지 않아도 된다.",
      "사용자 정의 함수(User Defined Function)는 프로시저와 비슷하지만 반드시 값을 하나 돌려주며, SELECT 문 안에서 쓸 수 있다.",
      "트리거(Trigger)는 INSERT·UPDATE·DELETE 가 일어날 때 저절로 도는 것이다. 직접 부르지 않는다는 점이 프로시저와 가장 다르다.",
      "절차형 SQL 의 구성: DECLARE(선언부) → BEGIN/END(실행부) → EXCEPTION(예외부).",
      "커서(Cursor)는 여러 행을 한 줄씩 훑기 위한 것이다. OPEN → FETCH → CLOSE 순으로 쓴다.",
    ],
    examPoint:
      '프로시저·함수·트리거를 바꿔 내는 문제가 가장 흔하다. "직접 호출하지 않는다"는 트리거, "반드시 값을 반환한다"는 함수다.',
    importance: "must",
    keys: [
      { term: "프로시저", mean: "CALL 로 부른다. 반환값이 없어도 된다" },
      { term: "함수", mean: "반드시 값을 하나 돌려준다" },
      { term: "트리거", mean: "이벤트가 나면 저절로 돈다" },
      { term: "커서", mean: "OPEN → FETCH → CLOSE" },
    ],
    traps: [
      {
        a: "프로시저",
        b: "트리거",
        how: "프로시저는 사람이 CALL 로 부르고, 트리거는 테이블에 변화가 생기면 저절로 돈다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-physical",
    subject: "database",
    title: "물리 설계 — 파티셔닝·클러스터링·이중화",
    summary:
      "큰 테이블은 잘라 두고, 자주 함께 읽는 것은 붙여 두고, 중요한 것은 복제해 둔다.",
    body: [
      "파티셔닝은 큰 테이블을 여러 조각으로 나눠 저장하는 것이다. 범위 분할(Range), 해시 분할(Hash), 목록 분할(List), 조합 분할(Composite)이 있다.",
      "범위 분할은 날짜처럼 이어지는 값을 구간으로 자르고, 해시 분할은 해시 함수로 고르게 흩어 놓는다.",
      "클러스터링은 자주 함께 읽는 행을 물리적으로 가까이 모아 두는 것이다. 조회는 빨라지지만 입력·수정은 느려진다.",
      "데이터베이스 이중화(Replication)는 같은 데이터베이스를 둘 이상 두는 것이다. Eager 기법은 변경을 곧바로 모든 사본에 반영하고, Lazy 기법은 나중에 반영한다.",
      "이중화 구성은 활성-활성(Active-Active)과 활성-대기(Active-Standby)로 나뉜다. 앞엣것은 둘 다 일하고, 뒤엣것은 하나가 쉬다가 넘겨받는다.",
    ],
    examPoint:
      "파티셔닝 종류를 고르게 하거나, Eager 와 Lazy 를 바꿔 낸다. 클러스터링이 조회에 유리하고 갱신에 불리하다는 방향도 자주 묻는다.",
    importance: "high",
    keys: [
      { term: "Range", mean: "이어지는 값을 구간으로" },
      { term: "Hash", mean: "해시 함수로 고르게" },
      { term: "Eager", mean: "변경을 즉시 모든 사본에" },
      { term: "Lazy", mean: "변경을 나중에 반영" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "b-migration",
    subject: "database",
    title: "데이터 전환과 정제",
    summary:
      "옛 시스템의 자료를 새 시스템으로 옮긴다. 뽑고(Extract) 바꾸고(Transform) 넣는다(Load).",
    body: [
      "데이터 전환(Data Migration)은 기존 시스템의 데이터를 추출해 새 시스템에 맞게 바꾸고 적재하는 일이다. 이 세 단계를 ETL 이라 한다.",
      "추출(Extraction)은 원천에서 자료를 뽑고, 변환(Transformation)은 새 구조와 규칙에 맞게 고치며, 적재(Loading)는 목표 시스템에 넣는다.",
      "데이터 정제(Cleansing)는 옮기기 전에 결측값·중복·형식 오류를 바로잡는 일이다. 정제하지 않고 옮기면 잘못된 자료가 그대로 새 시스템에 들어간다.",
      "전환 검증은 단계마다 한다. 추출 건수와 적재 건수가 맞는지(정합성), 값이 규칙을 지키는지(무결성)를 로그와 검증 보고서로 남긴다.",
      "오류 데이터는 심각도에 따라 상·중·하로 나누고, 정제 요청서를 만들어 원천 담당자와 협의해 고친다.",
    ],
    examPoint:
      "ETL 의 세 단계 이름과 순서를 묻는 것이 가장 흔하다. 정제와 변환을 바꿔 내기도 한다.",
    importance: "high",
    keys: [
      { term: "E", mean: "Extraction — 원천에서 뽑기" },
      { term: "T", mean: "Transformation — 규칙에 맞게 바꾸기" },
      { term: "L", mean: "Loading — 목표에 넣기" },
    ],
    traps: [
      {
        a: "데이터 정제",
        b: "데이터 변환",
        how: "정제는 잘못된 값을 바로잡는 일이고, 변환은 새 구조에 맞게 꼴을 바꾸는 일이다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "l-server-build",
    subject: "language",
    title: "개발 환경 구축과 배치 프로그램",
    summary:
      "서버·IDE·빌드·형상관리를 갖춰 두고, 사람 손 없이 정해진 시각에 도는 일은 배치로 돌린다.",
    body: [
      "개발 환경은 하드웨어(웹 서버·WAS·DB 서버·파일 서버)와 소프트웨어(IDE·빌드 도구·형상관리 도구·테스트 도구)로 나뉜다.",
      "빌드 도구에는 Ant, Maven, Gradle 이 있다. Maven 은 정해진 규약을 따르고, Gradle 은 스크립트로 유연하게 쓴다.",
      "배치 프로그램(Batch Program)은 사용자와 주고받지 않고 대량의 자료를 한꺼번에 처리하는 프로그램이다.",
      "배치가 갖춰야 할 것: 대용량 데이터 처리, 자동화(사람 개입 없이), 견고성(잘못된 자료에도 멈추지 않음), 안정성(문제 지점을 추적할 수 있음), 성능(다른 업무를 방해하지 않음).",
      "배치 스케줄러에는 스프링 배치(Spring Batch), Quartz, Cron 이 있다. Cron 표현식은 분·시·일·월·요일 순으로 적는다.",
    ],
    examPoint:
      "배치 프로그램의 필수 요소를 고르게 하거나, 빌드 도구·스케줄러 이름을 묻는다.",
    importance: "high",
    keys: [
      { term: "자동화", mean: "사람 개입 없이 돈다" },
      { term: "견고성", mean: "잘못된 자료에도 멈추지 않는다" },
      { term: "안정성", mean: "문제 지점을 추적할 수 있다" },
    ],
    tracks: ["written"],
  },
  {
    id: "s-security-solution",
    subject: "system",
    title: "보안 솔루션",
    summary:
      "방화벽은 막고, IDS 는 알리고, IPS 는 막으면서 알린다. VPN 은 공중망 위에 안전한 길을 낸다.",
    body: [
      "방화벽(Firewall)은 미리 정한 규칙에 따라 오가는 트래픽을 허용하거나 막는다. 주소와 포트를 보고 판단한다.",
      "침입 탐지 시스템(IDS)은 이상한 움직임을 찾아내 알린다. 오용 탐지(알려진 공격 패턴과 견줌)와 이상 탐지(평소와 다른 행동을 찾음)로 나뉜다.",
      "침입 방지 시스템(IPS)은 탐지에 그치지 않고 그 자리에서 막는다. IDS 가 경보라면 IPS 는 차단이다.",
      "VPN 은 공중망 위에 암호화된 통로를 만들어 사설망처럼 쓰게 한다.",
      "NAC(Network Access Control)는 네트워크에 붙는 단말이 규정을 지키는지 검사해 접속을 통제한다. DLP 는 내부 자료가 밖으로 새 나가는 것을 막는다.",
      "SIEM 은 여러 장비의 로그를 한곳에 모아 연관 분석해 위협을 찾아낸다.",
    ],
    examPoint:
      'IDS 와 IPS 의 차이를 묻는 것이 가장 흔하다. "탐지하고 알린다"는 IDS, "탐지하고 막는다"는 IPS 다.',
    importance: "must",
    keys: [
      { term: "IDS", mean: "탐지하고 알린다" },
      { term: "IPS", mean: "탐지하고 막는다" },
      { term: "NAC", mean: "단말이 규정을 지키는지 보고 접속 통제" },
      { term: "DLP", mean: "내부 자료 유출 방지" },
    ],
    traps: [
      {
        a: "IDS",
        b: "IPS",
        how: "둘 다 침입을 찾아내지만 IDS 는 알리기만 하고 IPS 는 그 자리에서 끊는다.",
      },
      {
        a: "오용 탐지",
        b: "이상 탐지",
        how: "오용 탐지는 알려진 공격 패턴과 견주고, 이상 탐지는 평소와 다른 행동을 찾는다. 알려지지 않은 공격은 이상 탐지만 잡을 수 있다.",
      },
    ],
    tracks: ["written", "practical"],
  },
];
