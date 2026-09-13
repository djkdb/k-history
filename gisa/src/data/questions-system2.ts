import type { WrittenQuestion } from "@/lib/types";

/** 5과목 · 정보시스템 구축 관리 — 보충 2 */
export const SYSTEM2_QUESTIONS: WrittenQuestion[] = [
  {
    id: "qs2-method-agile-vs",
    subject: "system",
    sourceId: "s-methodology",
    question: "소프트웨어 개발 방법론 테일러링에 대한 설명으로 옳은 것은?",
    options: [
      "표준 방법론을 프로젝트 상황에 맞게 줄이거나 늘려 고치는 일",
      "완성된 소프트웨어를 사용자 환경에 설치하는 일",
      "요구사항을 기능 단위로 쪼개는 일",
      "코드를 표준 서식에 맞게 정리하는 일",
    ],
    answerIndex: 0,
    explanation:
      "테일러링은 옷을 몸에 맞추듯 방법론을 프로젝트에 맞춘다. 내부 기준(목표·구성원 수준)과 외부 기준(법·표준)을 함께 본다.",
    optionNotes: [
      null,
      "이것은 설치·배포다.",
      "이것은 요구사항 분석이다.",
      "이것은 코드 정리다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-estimation-delphi",
    subject: "system",
    sourceId: "s-estimation",
    question:
      "여러 전문가의 의견을 익명으로 모아 여러 차례 되풀이하며 합의에 이르는 비용 산정 기법은?",
    options: ["델파이 기법", "전문가 감정 기법", "COCOMO", "기능 점수"],
    answerIndex: 0,
    explanation:
      "델파이는 조정자가 익명 의견을 모아 다시 돌리기를 되풀이한다. 목소리 큰 사람에게 끌려가는 것을 막으려는 것이다.",
    optionNotes: [
      null,
      "전문가 감정은 두세 사람이 직접 논의해 정한다.",
      "COCOMO 는 수식으로 계산하는 모형이다.",
      "기능 점수는 기능 수로 세는 모형이다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-pert-cpm",
    subject: "system",
    sourceId: "s-estimation",
    question:
      "작업 사이의 선후 관계를 그림으로 그려 전체 일정 중 가장 오래 걸리는 경로를 찾는 기법은?",
    options: ["간트 차트", "CPM(임계 경로 기법)", "WBS", "파레토 분석"],
    answerIndex: 1,
    explanation:
      "CPM 은 임계 경로 — 여유가 없는 경로 — 를 찾는다. 그 경로가 하루 늦으면 프로젝트 전체가 하루 늦는다.",
    optionNotes: [
      "간트 차트는 일정을 막대로 그린다.",
      null,
      "WBS 는 일을 계층으로 쪼갠 구조도다.",
      "파레토 분석은 원인의 비중을 본다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-attack-xss",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "게시판에 악성 스크립트를 올려 두고, 그 글을 읽는 다른 사용자의 브라우저에서 실행되게 하는 공격은?",
    options: ["XSS", "SQL 삽입", "버퍼 오버플로", "스니핑"],
    answerIndex: 0,
    explanation:
      "크로스사이트 스크립팅(XSS)이다. 입력을 그대로 화면에 돌려주는 곳에서 생기며, 출력 시 특수문자를 바꿔(이스케이프) 막는다.",
    optionNotes: [
      null,
      "SQL 삽입은 데이터베이스를 노린다.",
      "버퍼 오버플로는 메모리 경계를 넘긴다.",
      "스니핑은 오가는 패킷을 몰래 훔쳐본다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-attack-ransom",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "사용자의 파일을 암호화해 놓고 푸는 대가로 금전을 요구하는 악성 코드는?",
    options: ["웜", "트로이 목마", "랜섬웨어", "스파이웨어"],
    answerIndex: 2,
    explanation: "랜섬웨어다. 가장 확실한 대비는 분리 보관한 백업이다.",
    optionNotes: [
      "웜은 스스로 퍼져 나간다.",
      "트로이 목마는 정상 프로그램인 척한다.",
      null,
      "스파이웨어는 정보를 몰래 빼낸다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-attack-social",
    subject: "system",
    sourceId: "s-security-attack",
    question:
      "기술적 취약점이 아니라 사람의 심리를 파고들어 정보를 얻어 내는 공격을 무엇이라 하는가?",
    options: ["사회공학", "무차별 대입", "제로데이 공격", "중간자 공격"],
    answerIndex: 0,
    explanation:
      "사회공학(Social Engineering)이다. 피싱·스미싱이 여기에 든다. 기술로 막기 어려워 교육이 가장 큰 대비책이다.",
    optionNotes: [
      null,
      "무차별 대입은 암호를 모두 시도해 본다.",
      "제로데이는 아직 알려지지 않은 취약점을 노린다.",
      "중간자 공격은 통신 사이에 끼어든다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-crypto-pki",
    subject: "system",
    sourceId: "s-security-crypto",
    question: "공개키 기반 구조(PKI)에서 전자 서명에 대한 설명으로 옳은 것은?",
    options: [
      "보내는 사람의 개인키로 서명하고, 받는 사람은 보낸 이의 공개키로 확인한다.",
      "보내는 사람의 공개키로 서명하고, 받는 사람은 자기 개인키로 확인한다.",
      "두 사람이 나눠 가진 같은 키로 서명하고 확인한다.",
      "서명에는 해시 함수를 쓰지 않는다.",
    ],
    answerIndex: 0,
    explanation:
      "서명은 개인키로 하고 확인은 공개키로 한다. 그래야 '그 사람만 만들 수 있는 값'이 된다. 암호화는 반대로 상대의 공개키로 건다.",
    optionNotes: [
      null,
      "그것은 암호화 쪽 이야기다.",
      "같은 키를 쓰면 누가 서명했는지 가릴 수 없다.",
      "보통 원문의 해시에 서명한다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-crypto-key-count",
    subject: "system",
    sourceId: "s-security-crypto",
    question:
      "n 명이 서로 비밀 통신을 할 때 대칭키 암호에서 필요한 키의 개수는?",
    options: ["n", "2n", "n(n-1)/2", "n²"],
    answerIndex: 2,
    explanation:
      "대칭키는 짝마다 키가 하나씩 필요하므로 n(n-1)/2 개다. 사람이 늘수록 급격히 늘어나는 이 문제가 공개키 암호가 나온 이유 중 하나다.",
    optionNotes: [
      "공개키 방식에서 각자 한 쌍씩 갖는 것과 혼동한 값이다.",
      "공개키 방식에서 전체 키 개수다.",
      null,
      "짝을 두 번씩 센 값이다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-access-mac",
    subject: "system",
    sourceId: "s-access-control",
    question:
      "주체와 객체에 보안 등급을 매기고 시스템이 그 등급에 따라 접근을 강제로 막는 방식은?",
    options: ["DAC", "MAC", "RBAC", "ABAC"],
    answerIndex: 1,
    explanation:
      "강제 접근 통제(MAC)다. 자원 소유자가 마음대로 권한을 줄 수 없어 군·정부처럼 등급이 엄격한 곳에서 쓴다.",
    optionNotes: [
      "DAC 는 소유자가 재량으로 권한을 준다.",
      null,
      "RBAC 는 역할에 권한을 묶는다.",
      "ABAC 는 속성 조합으로 판단한다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-access-least",
    subject: "system",
    sourceId: "s-access-control",
    question: "최소 권한 원칙(Least Privilege)에 대한 설명으로 옳은 것은?",
    options: [
      "업무에 꼭 필요한 만큼의 권한만 준다.",
      "관리자에게는 모든 권한을 준다.",
      "권한은 한 번 주면 회수하지 않는다.",
      "한 사람이 모든 단계를 처리하게 한다.",
    ],
    answerIndex: 0,
    explanation:
      "필요한 만큼만 준다. 계정이 털려도 피해 범위가 그만큼만 된다. 한 사람이 전 과정을 맡지 않게 하는 것은 직무 분리 원칙이다.",
    optionNotes: [
      null,
      "관리자에게도 필요한 만큼만이 원칙이다.",
      "필요가 사라지면 회수한다.",
      "직무 분리 원칙에 어긋난다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-secure-error",
    subject: "system",
    sourceId: "s-secure-coding",
    question:
      "오류 메시지에 데이터베이스 구조나 파일 경로를 그대로 드러내는 것은 시큐어 코딩의 어느 항목에 해당하는가?",
    options: [
      "입력 데이터 검증 및 표현",
      "보안 기능",
      "에러 처리",
      "코드 오류",
    ],
    answerIndex: 2,
    explanation:
      "에러 처리 항목이다. 오류 메시지는 공격자에게 지도를 그려 주는 것과 같으므로, 사용자에게는 짧게 알리고 자세한 내용은 로그에만 남긴다.",
    optionNotes: [
      "입력 검증은 SQL 삽입·XSS 쪽이다.",
      "보안 기능은 인증·권한·암호화 쪽이다.",
      null,
      "코드 오류는 널 참조·자원 해제 누락 쪽이다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-new-serverless",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "개발자가 서버를 직접 마련하지 않고 함수 단위로 코드를 올려, 호출된 만큼만 비용을 내는 방식은?",
    options: ["서버리스", "온프레미스", "베어메탈", "가상 사설망"],
    answerIndex: 0,
    explanation:
      "서버리스다. 서버가 없는 것이 아니라 서버를 신경 쓰지 않아도 된다는 뜻이다.",
    optionNotes: [
      null,
      "온프레미스는 자체 전산실에 직접 두는 방식이다.",
      "베어메탈은 가상화 없이 물리 서버를 그대로 쓰는 것이다.",
      "VPN 은 안전한 통신 통로다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-new-cloud-kind",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "클라우드 서비스 유형 중 운영체제와 실행 환경까지 제공받고 응용 프로그램만 올리는 것은?",
    options: ["IaaS", "PaaS", "SaaS", "DaaS"],
    answerIndex: 1,
    explanation:
      "PaaS 다. IaaS 는 서버·저장소 같은 자원만, SaaS 는 완성된 소프트웨어까지 제공한다.",
    optionNotes: [
      "IaaS 는 인프라만 준다.",
      null,
      "SaaS 는 완성된 응용 프로그램을 준다.",
      "DaaS 는 데스크톱 환경을 준다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-new-bigdata",
    subject: "system",
    sourceId: "s-software-new",
    question:
      "대용량 데이터를 여러 컴퓨터에 나누어 저장하고 처리하는 아파치 재단의 오픈소스 프레임워크는?",
    options: ["하둡(Hadoop)", "텐서플로", "카프카", "젠킨스"],
    answerIndex: 0,
    explanation:
      "하둡이다. 분산 저장을 맡는 HDFS 와 분산 처리를 맡는 맵리듀스로 이루어진다.",
    optionNotes: [
      null,
      "텐서플로는 기계학습 라이브러리다.",
      "카프카는 메시지 스트리밍 플랫폼이다.",
      "젠킨스는 빌드·배포 자동화 도구다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-network-5g",
    subject: "system",
    sourceId: "s-network-new",
    question:
      "여러 기기가 중앙 장비 없이 서로 중계하며 그물처럼 이어지는 무선 통신 구조는?",
    options: ["메시 네트워크", "스타 네트워크", "버스 네트워크", "링 네트워크"],
    answerIndex: 0,
    explanation:
      "메시 네트워크다. 한 노드가 죽어도 다른 길로 돌아갈 수 있어 재난 통신이나 센서망에 쓴다.",
    optionNotes: [
      null,
      "스타는 가운데 장비에 모두 붙는다.",
      "버스는 하나의 선을 함께 쓴다.",
      "링은 고리 모양으로 잇는다.",
    ],
    importance: "high",
  },
  {
    id: "qs2-raid-zero",
    subject: "system",
    sourceId: "s-raid-backup",
    question: "RAID 0 에 대한 설명으로 옳은 것은?",
    options: [
      "데이터를 여러 디스크에 나눠 써 속도는 빠르지만 하나만 고장 나도 전부 잃는다.",
      "같은 데이터를 두 디스크에 똑같이 써 안전하다.",
      "패리티로 하나의 디스크 고장을 복구할 수 있다.",
      "디스크 두 개가 동시에 고장 나도 복구된다.",
    ],
    answerIndex: 0,
    explanation:
      "RAID 0 은 스트라이핑만 한다. 중복이 없으므로 안전성은 오히려 낮아진다.",
    optionNotes: [
      null,
      "이것은 RAID 1 이다.",
      "이것은 RAID 5 다.",
      "이것은 RAID 6 다.",
    ],
    importance: "must",
  },
  {
    id: "qs2-backup-kind",
    subject: "system",
    sourceId: "s-raid-backup",
    question: "차등 백업과 증분 백업의 차이로 옳은 것은?",
    options: [
      "차등은 마지막 전체 백업 이후 바뀐 것을, 증분은 마지막 백업(종류 무관) 이후 바뀐 것을 담는다.",
      "차등은 마지막 백업 이후, 증분은 마지막 전체 백업 이후 바뀐 것을 담는다.",
      "둘 다 전체를 통째로 담는다.",
      "증분이 차등보다 복구가 언제나 빠르다.",
    ],
    answerIndex: 0,
    explanation:
      "증분은 담는 양이 적어 백업이 빠르지만 복구할 때 여러 개를 차례로 적용해야 한다. 차등은 그 반대다.",
    optionNotes: [
      null,
      "뒤바뀌었다.",
      "전체를 담는 것은 전체 백업이다.",
      "복구는 차등이 더 빠르다.",
    ],
    importance: "must",
  },
];
