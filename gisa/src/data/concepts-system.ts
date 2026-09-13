import type { Concept } from "@/lib/types";

/**
 * 5과목 · 정보시스템 구축 관리.
 *
 * 개발 방법론·보안·신기술 용어. 회차마다 난이도가 가장 많이 출렁이는
 * 과목이고, 신기술 용어는 외우는 수밖에 없다.
 */
export const SYSTEM_CONCEPTS: Concept[] = [
  {
    id: "s-methodology",
    subject: "system",
    title: "소프트웨어 개발 방법론",
    summary: "구조적·정보공학·객체지향·컴포넌트 기반·애자일.",
    body: [
      "구조적 방법론은 기능 중심으로 나눈다. 나씨-슈나이더만 차트가 그 산출물이다.",
      "정보공학 방법론은 자료 중심으로, 기업 전체를 계획부터 본다.",
      "객체지향 방법론은 객체를 단위로 본다. CBD(컴포넌트 기반)는 이미 만든 부품을 조립한다.",
      "소프트웨어 재사용 방법: 합성 중심(부품을 조립), 생성 중심(명세로부터 생성).",
    ],
    examPoint: "재사용의 두 방법(합성 중심·생성 중심)을 바꿔 낸다.",
    importance: "high",
    tracks: ["written", "practical"],
  },
  {
    id: "s-estimation",
    subject: "system",
    title: "비용 산정 모형",
    summary: "LOC·COCOMO·기능 점수. COCOMO 세 모드가 단골이다.",
    body: [
      "LOC 기법: 노력(인월) = LOC ÷ 1인당 월평균 생산 코드 줄 수. 비관·낙관·기대치로 추정한다.",
      "COCOMO 모드: 조직형(Organic, 5만 줄 이하) · 반분리형(Semi-detached, 30만 줄 이하) · 내장형(Embedded, 30만 줄 초과).",
      "COCOMO 단계: 기본형 → 중간형 → 발전형.",
      "기능 점수(FP)는 기능의 개수와 복잡도로 센다. Putnam 모형은 Rayleigh-Norden 곡선을 쓰고, SLIM 이 그 도구다.",
    ],
    examPoint:
      "COCOMO 세 모드의 이름과 규모 기준을 짝짓게 한다. 숫자(5만·30만)까지 묻는다.",
    importance: "must",
    keys: [
      { term: "조직형", mean: "5만 줄 이하" },
      { term: "반분리형", mean: "30만 줄 이하" },
      { term: "내장형", mean: "30만 줄 초과" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "s-network-new",
    subject: "system",
    title: "네트워크 신기술 용어",
    summary: "SDN·메시 네트워크·SDDC·NFC·비컨 등.",
    body: [
      "SDN(Software Defined Network): 제어부와 전송부를 나눠 소프트웨어로 망을 제어한다.",
      "메시 네트워크: 노드끼리 그물처럼 이어 한 노드가 죽어도 우회한다.",
      "SDDC(Software Defined Data Center): 데이터센터의 모든 자원을 소프트웨어로 정의한다.",
      "NFC 는 10cm 안팎의 근거리 무선, 비컨은 블루투스로 위치를 알린다. 피코넷·애드혹은 즉석에서 만드는 망이다.",
    ],
    examPoint:
      "설명을 주고 용어를 고르게 한다. 신기술 용어는 회차마다 새 것이 섞여 나온다.",
    importance: "high",
    tracks: ["written", "practical"],
  },
  {
    id: "s-security-attack",
    subject: "system",
    title: "보안 — 공격 기법",
    summary: "DDoS·스미싱·랜섬웨어·SQL 삽입·XSS.",
    body: [
      "서비스 거부: DoS, DDoS, Smurf(브로드캐스트 증폭), SYN Flooding(연결 반만 열어 두기), Land Attack(출발지와 목적지를 같게).",
      "스니핑은 엿듣기, 스푸핑은 속이기, 세션 하이재킹은 이미 열린 연결을 가로채기.",
      "SQL 삽입은 입력값에 SQL 을 섞어 넣는 것, XSS 는 스크립트를 심어 다른 사용자 브라우저에서 돌게 하는 것, CSRF 는 로그인된 사용자가 모르게 요청을 보내게 하는 것이다.",
      "랜섬웨어는 파일을 암호화하고 돈을 요구한다. APT 는 특정 대상을 오래 노리는 지능형 지속 위협이다.",
    ],
    examPoint:
      "공격 이름과 방식을 짝짓게 한다. Smurf 와 SYN Flooding 을 바꿔 내는 문제가 잦다.",
    importance: "must",
    traps: [
      {
        a: "XSS",
        b: "CSRF",
        how: "XSS 는 스크립트를 심어 '다른 사용자 브라우저에서' 돌게 하고, CSRF 는 로그인된 사용자가 '모르게 요청을 보내게' 한다.",
      },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "s-security-crypto",
    subject: "system",
    title: "보안 — 암호화",
    summary:
      "대칭키는 빠르고 키 관리가 어렵다. 비대칭키는 느리지만 키 배분이 쉽다.",
    body: [
      "대칭키(비밀키): DES, 3DES, AES, SEED, ARIA, IDEA. 암호화와 복호화에 같은 키를 쓴다. 빠르지만 사람이 늘면 키가 급격히 는다(n(n−1)/2).",
      "비대칭키(공개키): RSA, ECC, ElGamal, Diffie-Hellman. 공개키로 잠그고 개인키로 연다.",
      "해시: MD5, SHA-1, SHA-256, HAS-160. 한 방향이라 되돌릴 수 없다. 무결성 확인에 쓴다.",
      "전자 서명은 개인키로 서명하고 공개키로 확인한다 — 방향이 암호화와 반대다.",
    ],
    examPoint:
      "알고리즘 이름을 주고 대칭인지 비대칭인지 고르게 한다. AES 는 대칭, RSA 는 비대칭이 기본이다.",
    importance: "must",
    keys: [
      { term: "대칭키", mean: "DES · AES · SEED · ARIA · IDEA" },
      { term: "비대칭키", mean: "RSA · ECC · ElGamal · Diffie-Hellman" },
      { term: "해시", mean: "MD5 · SHA 계열 · HAS-160" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "s-secure-coding",
    subject: "system",
    title: "시큐어 코딩",
    summary:
      "입력 검증·보안 기능·시간과 상태·에러 처리·코드 오류·캡슐화·API 오용.",
    body: [
      "입력 데이터 검증 및 표현: SQL 삽입, XSS, 경로 조작을 막는다.",
      "보안 기능: 인증·권한 관리·암호화를 제대로 쓴다.",
      "시간 및 상태: 경쟁 조건(Race Condition), TOCTOU.",
      "에러 처리: 오류 메시지에 내부 정보를 흘리지 않는다.",
      "코드 오류 / 캡슐화 / API 오용.",
    ],
    examPoint: "일곱 가지 분류 중 특정 취약점이 어디에 속하는지 묻는다.",
    importance: "high",
    tracks: ["written", "practical"],
  },
  {
    id: "s-access-control",
    subject: "system",
    title: "접근 통제",
    summary: "DAC는 주인이, MAC는 규칙이, RBAC는 역할이 정한다.",
    body: [
      "DAC(임의 접근 통제): 자원의 소유자가 권한을 준다.",
      "MAC(강제 접근 통제): 보안 등급에 따라 시스템이 강제한다.",
      "RBAC(역할 기반 접근 통제): 사람이 아니라 역할에 권한을 붙인다.",
      "인증 유형: 지식 기반(비밀번호), 소유 기반(OTP·스마트카드), 생체 기반(지문·홍채), 위치 기반.",
    ],
    examPoint:
      "세 가지 접근 통제의 이름과 결정 주체를 짝짓게 한다. 실기 단답형으로도 나온다.",
    importance: "must",
    keys: [
      { term: "DAC", mean: "소유자가 결정" },
      { term: "MAC", mean: "보안 등급으로 강제" },
      { term: "RBAC", mean: "역할에 권한" },
    ],
    tracks: ["written", "practical"],
  },
  {
    id: "s-software-new",
    subject: "system",
    title: "소프트웨어 신기술 용어",
    summary: "마이크로서비스·컨테이너·데브옵스·블록체인·디지털 트윈.",
    body: [
      "마이크로서비스는 하나의 큰 덩어리 대신 작은 서비스로 나눠 따로 배포한다.",
      "컨테이너(Docker)는 실행 환경을 통째로 싸서 어디서든 같게 돌게 한다. 쿠버네티스가 이것을 여러 대에 걸쳐 관리한다.",
      "데브옵스는 개발과 운영을 붙여 배포 주기를 짧게 한다. CI/CD 가 그 실천이다.",
      "블록체인은 거래 기록을 사슬처럼 이어 위조를 어렵게 한다. 디지털 트윈은 현실의 것을 가상에 똑같이 만들어 시뮬레이션한다.",
      "매시업은 서로 다른 서비스를 엮어 새 서비스를 만드는 것이다.",
    ],
    examPoint:
      "용어 설명을 주고 이름을 고르게 한다. 매시업·디지털 트윈이 자주 나온다.",
    importance: "high",
    tracks: ["written", "practical"],
  },
  {
    id: "s-raid-backup",
    subject: "system",
    title: "시스템 신뢰성 — RAID와 백업",
    summary: "RAID 0은 속도, 1은 거울, 5는 패리티 분산.",
    body: [
      "RAID 0(스트라이핑): 나눠 저장해 빠르다. 고장 대비는 없다.",
      "RAID 1(미러링): 그대로 복사해 둔다. 용량은 절반.",
      "RAID 5: 패리티를 여러 디스크에 나눠 둔다. 한 대가 고장 나도 복구된다.",
      "백업: 전체 백업, 증분 백업(마지막 백업 이후 바뀐 것), 차등 백업(마지막 전체 백업 이후 바뀐 것).",
    ],
    examPoint: "RAID 단계별 특징과 증분·차등 백업의 차이를 묻는다.",
    importance: "normal",
    traps: [
      {
        a: "증분 백업",
        b: "차등 백업",
        how: "증분은 '마지막 백업' 이후, 차등은 '마지막 전체 백업' 이후를 뜬다. 복구는 차등이 빠르고 백업은 증분이 빠르다.",
      },
    ],
    tracks: ["written"],
  },
];
