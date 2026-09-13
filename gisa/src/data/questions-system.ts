import type { WrittenQuestion } from "@/lib/types";

/** 5과목 · 정보시스템 구축 관리 */
export const SYSTEM_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qs-reuse",
    subject: "system",
    sourceId: "s-methodology",
    question:
      "소프트웨어 재사용 방법 중 이미 만들어진 부품을 조립해 새 시스템을 만드는 것은?",
    options: ["합성 중심(Composition-based)", "생성 중심(Generation-based)", "역공학", "재공학"],
    answerIndex: 0,
    explanation:
      "합성 중심은 블록을 쌓듯 부품을 조립한다. 생성 중심은 명세로부터 코드를 만들어 낸다.",
    optionNotes: [null, "명세에서 코드를 생성한다.", "완성된 것에서 설계를 뽑아낸다.", "기존 시스템을 개선해 재활용한다."],
    importance: "high",
  },
  {
    id: "qs-cocomo",
    subject: "system",
    sourceId: "s-estimation",
    question: "COCOMO 모형에서 5만 라인 이하의 소규모 프로젝트에 해당하는 유형은?",
    options: ["조직형(Organic)", "반분리형(Semi-detached)", "내장형(Embedded)", "기능형(Functional)"],
    answerIndex: 0,
    explanation:
      "조직형은 5만 줄 이하, 반분리형은 30만 줄 이하, 내장형은 30만 줄 초과다.",
    optionNotes: [null, "30만 줄 이하다.", "30만 줄 초과다.", "COCOMO 의 유형이 아니다."],
    importance: "must",
  },
  {
    id: "qs-fp",
    subject: "system",
    sourceId: "s-estimation",
    question: "기능 점수(FP) 모형에 대한 설명으로 옳은 것은?",
    options: [
      "소스 코드의 줄 수를 세어 규모를 산정한다.",
      "사용자 관점의 기능 개수와 복잡도로 규모를 산정한다.",
      "개발 인원의 수만으로 비용을 산정한다.",
      "Rayleigh-Norden 곡선을 이용한다.",
    ],
    answerIndex: 1,
    explanation:
      "FP 는 입력·출력·조회·파일·인터페이스 같은 기능 단위를 세고 복잡도를 매겨 산정한다. 줄 수는 LOC, 곡선은 Putnam 모형이다.",
    optionNotes: ["LOC 기법이다.", null, "인원만으로는 산정하지 않는다.", "Putnam 모형이다."],
    importance: "high",
  },
  {
    id: "qs-sdn",
    subject: "system",
    sourceId: "s-network-new",
    question:
      "네트워크 장비의 제어부와 전송부를 분리해 소프트웨어로 망을 제어하는 기술은?",
    options: ["SDN", "NFC", "메시 네트워크", "피코넷"],
    answerIndex: 0,
    explanation:
      "SDN(Software Defined Network)이다. 제어를 소프트웨어로 옮겨 망을 유연하게 다룬다.",
    optionNotes: [null, "10cm 안팎의 근거리 무선이다.", "노드끼리 그물처럼 잇는 망이다.", "블루투스로 즉석에서 만드는 소규모 망이다."],
    importance: "high",
  },
  {
    id: "qs-ddos-smurf",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "출발지 주소를 공격 대상으로 위조해 브로드캐스트로 보내 응답이 대상에 몰리게 하는 공격은?",
    options: ["SYN Flooding", "Smurf Attack", "Land Attack", "Teardrop"],
    answerIndex: 1,
    explanation:
      "Smurf 는 브로드캐스트 증폭을 쓴다. SYN Flooding 은 연결을 반만 열어 두고, Land Attack 은 출발지와 목적지를 같게 만든다.",
    optionNotes: ["연결을 반만 열어 자원을 소모시킨다.", null, "출발지와 목적지를 같게 만든다.", "단편화 오프셋을 조작한다."],
    importance: "must",
  },
  {
    id: "qs-xss-csrf",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "로그인된 사용자가 자신도 모르게 공격자가 의도한 요청을 서버에 보내게 만드는 공격은?",
    options: ["XSS", "CSRF", "SQL 삽입", "세션 하이재킹"],
    answerIndex: 1,
    explanation:
      "CSRF 다. XSS 는 스크립트를 심어 다른 사용자 브라우저에서 실행되게 하는 것이다.",
    optionNotes: [
      "스크립트를 심어 브라우저에서 실행시킨다.",
      null,
      "입력값에 SQL 을 섞어 넣는다.",
      "이미 열린 연결을 가로챈다.",
    ],
    importance: "must",
  },
  {
    id: "qs-crypto-sym",
    subject: "system",
    sourceId: "s-security-crypto",
    question: "다음 중 대칭키 암호화 알고리즘이 아닌 것은?",
    options: ["AES", "SEED", "ARIA", "RSA"],
    answerIndex: 3,
    explanation:
      "RSA 는 공개키(비대칭키) 알고리즘이다. AES·SEED·ARIA·DES·IDEA 는 대칭키다.",
    optionNotes: [null, null, null, "정답. 비대칭키다."],
    importance: "must",
  },
  {
    id: "qs-crypto-hash",
    subject: "system",
    sourceId: "s-security-crypto",
    question: "해시 함수의 특징으로 옳은 것은?",
    options: [
      "암호문에서 원문을 되돌릴 수 있다.",
      "한 방향이며 주로 무결성 확인에 쓴다.",
      "대칭키를 나눠 갖기 위해 쓴다.",
      "입력 길이에 따라 출력 길이가 달라진다.",
    ],
    answerIndex: 1,
    explanation:
      "해시는 되돌릴 수 없는 한 방향 함수이며 출력 길이가 고정이다. 무결성 확인과 비밀번호 저장에 쓴다.",
    optionNotes: ["되돌릴 수 없다.", null, "키 교환은 Diffie-Hellman 등이 한다.", "출력 길이는 고정이다."],
    importance: "must",
  },
  {
    id: "qs-access-rbac",
    subject: "system",
    sourceId: "s-access-control",
    question: "사용자가 아니라 직무에 권한을 부여하는 접근 통제 방식은?",
    options: ["DAC", "MAC", "RBAC", "ACL"],
    answerIndex: 2,
    explanation:
      "RBAC(역할 기반)이다. DAC 는 소유자가 정하고, MAC 는 보안 등급으로 시스템이 강제한다.",
    optionNotes: ["소유자가 권한을 준다.", "보안 등급으로 강제한다.", null, "객체별 권한 목록으로 DAC 구현 수단이다."],
    importance: "must",
  },
  {
    id: "qs-secure-coding",
    subject: "system",
    sourceId: "s-secure-coding",
    question:
      "시큐어 코딩 가이드에서 SQL 삽입과 크로스사이트 스크립팅이 속하는 분류는?",
    options: [
      "입력 데이터 검증 및 표현",
      "보안 기능",
      "시간 및 상태",
      "에러 처리",
    ],
    answerIndex: 0,
    explanation:
      "입력값을 제대로 걸러 내지 못해 생기는 취약점이므로 '입력 데이터 검증 및 표현'에 속한다.",
    optionNotes: [null, "인증·권한·암호화에 관한 것이다.", "경쟁 조건 같은 것이다.", "오류 메시지로 정보가 새는 것이다."],
    importance: "high",
  },
  {
    id: "qs-msa",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "하나의 큰 애플리케이션을 작은 서비스로 나누어 독립적으로 배포·확장하는 구조는?",
    options: ["모놀리식 아키텍처", "마이크로서비스 아키텍처", "클라이언트 서버", "파이프 필터"],
    answerIndex: 1,
    explanation:
      "마이크로서비스는 작은 서비스로 나눠 각각 배포한다. 모놀리식은 하나의 덩어리다.",
    optionNotes: ["하나의 덩어리로 배포한다.", null, "서비스를 주는 쪽과 받는 쪽을 나눈 것이다.", "데이터를 흘려보내며 처리한다."],
    importance: "high",
  },
  {
    id: "qs-mashup",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "서로 다른 웹 서비스를 조합해 새로운 서비스를 만들어 내는 기술은?",
    options: ["매시업(Mashup)", "디지털 트윈", "블록체인", "데브옵스"],
    answerIndex: 0,
    explanation: "매시업이다. 지도 서비스와 부동산 정보를 엮는 식이다.",
    optionNotes: [
      null,
      "현실의 것을 가상에 똑같이 만들어 시뮬레이션한다.",
      "거래 기록을 사슬로 이어 위조를 막는다.",
      "개발과 운영을 붙여 배포 주기를 줄인다.",
    ],
    importance: "high",
  },
  {
    id: "qs-raid5",
    subject: "system",
    sourceId: "s-raid-backup",
    question: "패리티 정보를 여러 디스크에 분산 저장하는 RAID 단계는?",
    options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
    answerIndex: 2,
    explanation:
      "RAID 5 는 패리티를 분산 저장해 한 대가 고장 나도 복구된다. RAID 0 은 속도만, RAID 1 은 거울처럼 복사한다.",
    optionNotes: ["스트라이핑만 하며 고장 대비가 없다.", "미러링이다.", null, "0과 1을 결합한 것이다."],
    importance: "normal",
  },
  {
    id: "qs-backup",
    subject: "system",
    sourceId: "s-raid-backup",
    question: "마지막 전체 백업 이후 변경된 모든 데이터를 백업하는 방식은?",
    options: ["전체 백업", "증분 백업", "차등 백업", "합성 백업"],
    answerIndex: 2,
    explanation:
      "차등 백업은 마지막 전체 백업 이후 바뀐 것을 모두 뜬다. 증분 백업은 마지막 백업(전체든 증분이든) 이후 바뀐 것만 뜬다.",
    optionNotes: ["전부 뜬다.", "마지막 백업 이후 바뀐 것만 뜬다.", null, "전체와 증분을 합쳐 만드는 방식이다."],
    importance: "normal",
  },
  {
    id: "qs-apt",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "특정 대상을 오랜 기간 다양한 수단으로 집요하게 공격하는 지능형 지속 위협은?",
    options: ["APT", "DDoS", "랜섬웨어", "스미싱"],
    answerIndex: 0,
    explanation: "APT(Advanced Persistent Threat)다. 특정 목표를 정해 오래 노린다.",
    optionNotes: [
      null,
      "분산된 곳에서 한꺼번에 요청을 보내 마비시킨다.",
      "파일을 암호화하고 금전을 요구한다.",
      "문자로 악성 앱 설치를 유도한다.",
    ],
    importance: "high",
  },
  {
    id: "qs-esb",
    subject: "system",
    sourceId: "s-methodology",
    question: "CBD(컴포넌트 기반 개발) 방법론의 특징으로 옳은 것은?",
    options: [
      "기능을 하향식으로 나누어 모듈을 만든다.",
      "이미 개발된 컴포넌트를 조립해 개발 기간을 줄인다.",
      "자료의 흐름을 중심으로 전사 계획부터 수립한다.",
      "문서화를 최소화하고 짧은 주기로 반복한다.",
    ],
    answerIndex: 1,
    explanation:
      "CBD 는 재사용 가능한 컴포넌트를 조립한다. 하향식 기능 분할은 구조적 방법론, 자료 중심 전사 계획은 정보공학 방법론, 짧은 반복은 애자일이다.",
    optionNotes: ["구조적 방법론이다.", null, "정보공학 방법론이다.", "애자일이다."],
    importance: "high",
  },
];
