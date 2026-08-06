import type { Infographic } from "@/lib/types";

/**
 * 개념별 전용 인포그래픽.
 *
 * 데이터 파일을 직접 건드리지 않고 여기서 id로 연결한다.
 * (이벤트 데이터는 텍스트 계약, 인포그래픽은 시각 계약으로 분리)
 *
 * 대상 선정 기준 — 글로 읽으면 안 외워지고 그림이어야 잡히는 것:
 *  · 위계 구조(신분·관등)  · 기구 조직도  · 제도 변천  · 인과 연쇄  · 규모 수치
 */
export const EVENT_INFOGRAPHICS: Record<string, Infographic[]> = {
  // ─── 선사 ───
  "bronze-age": [
    {
      kind: "pyramid",
      title: "청동기 시대에 생긴 계급",
      levels: [
        { label: "군장(족장)", desc: "청동검·청동거울 소유, 제사와 정치 주관" },
        { label: "지배층", desc: "잉여 생산물 관리" },
        { label: "평민", desc: "농경 담당, 민무늬 토기 사용" },
        { label: "노비", desc: "전쟁 포로 등" },
      ],
    },
    {
      kind: "flow",
      title: "왜 계급이 생겼나 — 인과 사슬",
      steps: [
        { label: "벼농사 본격화", note: "농업 생산력이 크게 늘어남" },
        { label: "잉여 생산물 발생", note: "먹고 남는 식량이 쌓인다" },
        { label: "사유 재산 개념 등장", note: "가진 자와 못 가진 자가 갈림" },
        { label: "계급 분화 · 군장 출현", note: "고인돌이 그 권력의 증거" },
      ],
    },
  ],

  // ─── 고조선 ───
  "eight-laws": [
    {
      kind: "compare",
      title: "8조법 조항이 말해 주는 사회상",
      left: {
        title: "남은 3개 조항",
        items: [
          "사람을 죽이면 즉시 사형",
          "남을 다치게 하면 곡식으로 배상",
          "도둑질하면 노비로 삼음(50만 전으로 면제)",
        ],
      },
      right: {
        title: "여기서 알 수 있는 것",
        items: [
          "생명 존중 · 형벌 엄격",
          "농경 사회 · 사유 재산 인정",
          "계급(노비) 존재 · 화폐 사용",
        ],
      },
    },
  ],

  // ─── 여러 나라 ───
  jecheon: [
    {
      kind: "compare",
      title: "제천 행사 — 12월파 vs 10월파",
      left: {
        title: "12월",
        items: ["부여 — 영고(迎鼓)", "수렵 사회의 전통이 남은 시기"],
      },
      right: {
        title: "10월",
        items: [
          "고구려 — 동맹",
          "동예 — 무천",
          "삼한 — 계절제(5월 수릿날·10월)",
          "추수 감사 성격",
        ],
      },
    },
  ],

  // ─── 삼국 ───
  jinheung: [
    {
      kind: "timeline",
      title: "한강을 차지한 순서 = 전성기 순서",
      items: [
        { year: "4세기", label: "백제 근초고왕", note: "가장 먼저 전성기" },
        { year: "5세기", label: "고구려 장수왕", note: "한성 함락, 한강 장악" },
        { year: "6세기", label: "신라 진흥왕", highlight: true, note: "한강 유역 독점 → 삼국 통일의 발판" },
      ],
    },
  ],
  salsu: [
    {
      kind: "stat",
      title: "숫자로 보는 살수 대첩",
      items: [
        { value: 612, label: "일어난 해", suffix: "년" },
        { value: 1130000, label: "수 양제 동원 병력", suffix: "명" },
        { value: 2700, label: "살아 돌아간 별동대", suffix: "명", note: "30만 중" },
      ],
    },
  ],

  // ─── 남북국 ───
  sinmun: [
    {
      kind: "orgchart",
      title: "신문왕이 짠 통치 구조",
      root: "국왕(전제 왕권)",
      branches: [
        { label: "9주", children: ["지방 행정"] },
        { label: "5소경", children: ["수도 편중 보완"] },
        { label: "9서당", children: ["중앙군", "고구려·백제·말갈인 포함"] },
        { label: "10정", children: ["지방군"] },
      ],
    },
    {
      kind: "flow",
      title: "왕권 강화의 수순",
      steps: [
        { label: "김흠돌의 난 진압", note: "장인까지 처형하며 진골 귀족 숙청" },
        { label: "국학 설립", note: "왕에게 충성하는 유학 관료 양성" },
        { label: "관료전 지급 → 녹읍 폐지", note: "귀족의 경제 기반을 끊음" },
        { label: "9주 5소경 정비", note: "지방까지 왕의 통제 아래로" },
      ],
    },
  ],
  "balhae-seon": [
    {
      kind: "compare",
      title: "남북국 지방 제도 — 숫자를 바꿔 내는 함정",
      left: {
        title: "통일신라 (신문왕)",
        items: ["9주 5소경", "군사: 9서당 10정"],
      },
      right: {
        title: "발해 (선왕)",
        items: ["5경 15부 62주", "해동성국이라 불림"],
      },
    },
  ],

  // ─── 고려 ───
  "taejo-wanggeon": [
    {
      kind: "flow",
      title: "태조 왕건의 3대 정책 축",
      steps: [
        { label: "호족 통합", note: "혼인 정책 · 사심관 제도 · 기인 제도" },
        { label: "북진 정책", note: "서경(평양) 중시 · 고구려 계승 표방" },
        { label: "민생 안정", note: "흑창 설치 · 세율 1/10로 경감" },
      ],
    },
  ],
  jeonsigwa: [
    {
      kind: "timeline",
      title: "전시과의 변천 — 지급 대상이 좁아진다",
      items: [
        { year: "976 경종", label: "시정 전시과", note: "관품 + 인품으로 지급" },
        { year: "998 목종", label: "개정 전시과", note: "관직만 기준, 18과로 정비" },
        { year: "1076 문종", label: "경정 전시과", note: "현직 관리에게만 지급", highlight: true },
      ],
    },
  ],
  "khitan-war": [
    {
      kind: "timeline",
      title: "거란의 3차 침입 — 누가 막았나",
      items: [
        { year: "993 (1차)", label: "서희의 외교 담판", note: "싸우지 않고 강동 6주 획득" },
        { year: "1010 (2차)", label: "양규의 분전", note: "현종 나주 피난, 개경 함락" },
        { year: "1019 (3차)", label: "강감찬 귀주 대첩", note: "거란군 궤멸 → 이후 천리장성 축조", highlight: true },
      ],
    },
  ],

  // ─── 조선 ───
  "taejo-joseon": [
    {
      kind: "flow",
      title: "고려에서 조선으로 — 4단계",
      steps: [
        { label: "위화도 회군 (1388)", note: "이성계가 4불가론을 내세워 회군, 실권 장악" },
        { label: "과전법 시행 (1391)", note: "권문세족의 토지 기반을 무너뜨림" },
        { label: "조선 건국 (1392)", note: "이성계 즉위, 국호 조선" },
        { label: "한양 천도 (1394)", note: "경복궁·종묘·사직 건설, 정도전이 설계" },
      ],
    },
    {
      kind: "pyramid",
      title: "조선의 신분 구조",
      levels: [
        { label: "양반", desc: "문반 + 무반, 과거 응시와 관직 독점" },
        { label: "중인", desc: "역관·의관·서리 등 기술직" },
        { label: "상민", desc: "농민·수공업자·상인, 조세 부담의 주체" },
        { label: "천민", desc: "노비가 대부분" },
      ],
    },
  ],
  taejong: [
    {
      kind: "compare",
      title: "6조 직계제 vs 의정부 서사제",
      left: {
        title: "6조 직계제 (태종·세조)",
        items: ["6조 → 국왕 직보", "의정부를 거치지 않음", "왕권 강화"],
      },
      right: {
        title: "의정부 서사제 (세종)",
        items: ["6조 → 의정부 → 국왕", "재상이 심의", "왕권·신권 조화"],
      },
    },
  ],
  sejong: [
    {
      kind: "stat",
      title: "숫자로 보는 세종",
      items: [
        { value: 1443, label: "훈민정음 창제", suffix: "년" },
        { value: 1446, label: "훈민정음 반포", suffix: "년" },
        { value: 28, label: "창제 당시 글자 수", suffix: "자" },
      ],
    },
    {
      kind: "compare",
      title: "4군 6진 — 인물을 바꿔 내는 단골 함정",
      left: {
        title: "4군 (압록강)",
        items: ["최윤덕이 개척", "여진족 축출"],
      },
      right: {
        title: "6진 (두만강)",
        items: ["김종서가 개척", "오늘날의 국경선 완성"],
      },
    },
  ],
  sahwa: [
    {
      kind: "timeline",
      title: "4대 사화 — 순서 암기가 곧 점수",
      items: [
        { year: "1498 무오사화", label: "김종직의 조의제문", note: "연산군, 김일손이 사초에 실은 것이 발단" },
        { year: "1504 갑자사화", label: "폐비 윤씨 사건", note: "연산군의 어머니 문제" },
        { year: "1519 기묘사화", label: "조광조의 개혁", note: "위훈 삭제에 훈구파가 반발, 주초위왕" },
        { year: "1545 을사사화", label: "외척의 권력 다툼", note: "명종 즉위, 대윤 vs 소윤" },
      ],
    },
  ],
  "imjin-war": [
    {
      kind: "flow",
      title: "임진왜란 7년의 전개",
      steps: [
        { label: "1592 개전 · 부산진 함락", note: "20일 만에 한양 함락, 선조 의주 피난" },
        { label: "수군과 의병의 반격", note: "한산도 대첩(학익진) · 진주 대첩(김시민) · 곽재우 등 의병" },
        { label: "행주 대첩 (1593)", note: "권율, 관군과 백성이 함께 방어" },
        { label: "정유재란 · 명량 (1597)", note: "13척으로 133척 격파" },
        { label: "노량 해전 (1598)", note: "이순신 전사, 전쟁 종결" },
      ],
    },
  ],
  yeongjo: [
    {
      kind: "compare",
      title: "영조 vs 정조 — 업적 뒤바꾸기 주의",
      left: {
        title: "영조",
        items: ["탕평비 건립", "균역법(군포 2필→1필)", "속대전 편찬", "신문고 부활"],
      },
      right: {
        title: "정조",
        items: ["규장각 설치", "장용영 창설", "수원 화성 건설", "신해통공 · 대전통편"],
      },
    },
  ],

  // ─── 개항기 ───
  daewongun: [
    {
      kind: "compare",
      title: "흥선대원군의 두 얼굴",
      left: {
        title: "왕권 강화 · 민생",
        items: ["비변사 축소, 의정부 부활", "서원 47개만 남기고 철폐", "호포제 — 양반에게도 군포", "사창제 실시"],
      },
      right: {
        title: "무리수 · 쇄국",
        items: ["경복궁 중건 — 당백전 남발", "원납전 강제 징수", "척화비 건립", "통상 수교 거부"],
      },
    },
  ],
  donghak: [
    {
      kind: "flow",
      title: "동학 농민 운동의 전개",
      steps: [
        { label: "고부 봉기", note: "군수 조병갑의 만석보 수탈에 전봉준 봉기" },
        { label: "1차 봉기 · 황토현 승리", note: "백산 집결, 관군 격파" },
        { label: "전주 화약 · 집강소 설치", note: "폐정개혁 12개조, 농민이 자치 개혁 실행" },
        { label: "청·일군 개입 → 2차 봉기", note: "반외세 기치로 남북접 연합" },
        { label: "우금치 전투 패배", note: "일본군 화력에 궤멸, 전봉준 처형" },
      ],
    },
  ],

  // ─── 일제강점기 ───
  mudan: [
    {
      kind: "timeline",
      title: "식민 통치 방식의 변화 — 3단계",
      items: [
        { year: "1910년대", label: "무단 통치", note: "헌병 경찰 · 태형 · 교사도 칼을 참", highlight: true },
        { year: "1920년대", label: "문화 통치", note: "3·1 운동 이후 기만적 유화책, 치안유지법" },
        { year: "1930년대~", label: "민족 말살 통치", note: "황국신민서사 · 창씨개명 · 병참기지화" },
      ],
    },
  ],
  samil: [
    {
      kind: "flow",
      title: "3·1 운동이 바꾼 것",
      steps: [
        { label: "2·8 독립 선언 (도쿄 유학생)", note: "민족 자결주의의 영향" },
        { label: "1919.3.1 민족 대표 33인 선언", note: "전국·전 계층으로 확산" },
        { label: "일제의 무력 탄압", note: "제암리 학살 등" },
        { label: "통치 방식 전환 (무단 → 문화)", note: "일제가 방식을 바꿀 수밖에 없었다" },
        { label: "대한민국 임시정부 수립", note: "통일된 지도부의 필요성 자각" },
      ],
    },
  ],

  // ─── 현대 ───
  "korean-war": [
    {
      kind: "timeline",
      title: "6·25 전쟁의 전선 이동",
      items: [
        { year: "1950.6", label: "북한 남침", note: "3일 만에 서울 함락" },
        { year: "1950.8", label: "낙동강 방어선", note: "최후의 방어선까지 밀림" },
        { year: "1950.9", label: "인천 상륙 작전", note: "전세 역전, 압록강까지 진격", highlight: true },
        { year: "1951.1", label: "1·4 후퇴", note: "중공군 개입으로 서울 재함락" },
        { year: "1953.7", label: "정전 협정", note: "휴전선 확정, 한미상호방위조약" },
      ],
    },
  ],
  yukwol: [
    {
      kind: "flow",
      title: "6월 민주 항쟁 — 직선제까지",
      steps: [
        { label: "박종철 고문치사 (1987.1)", note: "'탁 치니 억 하고 죽었다'" },
        { label: "4·13 호헌 조치", note: "전두환, 개헌 논의 중단 선언" },
        { label: "이한열 최루탄 피격 (6.9)", note: "시위가 전국으로 폭발" },
        { label: "6·10 국민 대회", note: "호헌 철폐 · 독재 타도" },
        { label: "6·29 선언", note: "대통령 직선제 개헌 수용" },
      ],
    },
  ],
};
