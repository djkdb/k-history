import type { MockExam } from "@/lib/types";

// 국사편찬위원회가 공개한 기출문제를 문항별로 잘라 담았습니다.
// 문항 이미지는 public/exams/ 아래에 있으며, 출처를 함께 표시합니다.
// 이 파일은 scripts/import-exam.py 가 생성했습니다.

export const ROUND_77_ADVANCED: MockExam = {
  id: "77-advanced",
  round: 77,
  level: "advanced",
  timeLimitMin: 80,
  attribution: "국사편찬위원회 한국사능력검정시험 기출문제",
  questions: [
    {
      number: 1,
      points: 1,
      image: "/exams/77-advanced/q01.webp",
      answer: 3,
      eventIds: ["bronze-age"],
      explanation:
        "여주 흔암리, 민무늬 토기·반달 돌칼·탄화미는 모두 청동기 시대의 표지 유물이다. 계급이 발생한 이 시대에는 지배층의 무덤으로 고인돌을 세웠고, 거대한 덮개돌을 옮기려면 많은 인력이 필요했다.",
    },
    {
      number: 2,
      points: 2,
      image: "/exams/77-advanced/q02.webp",
      answer: 5,
      eventIds: ["gojoseon-fall"],
      explanation:
        "우거왕과 한 무제의 충돌은 고조선 멸망(기원전 108년) 직전의 일이므로 (가)는 고조선이다. 고조선에는 사회 질서를 유지하기 위한 범금 8조가 있었다.",
    },
    {
      number: 3,
      points: 2,
      image: "/exams/77-advanced/q03.webp",
      answer: 2,
      eventIds: ["jecheon"],
      explanation:
        "특산물 단궁·과하마·반어피와 10월의 제천 행사 무천은 동예의 특징이다. 동예에는 다른 부족의 영역을 침범하면 노비나 소·말로 갚게 한 책화가 있었다.",
    },
    {
      number: 4,
      points: 2,
      image: "/exams/77-advanced/q04.webp",
      answer: 4,
      explanation:
        "경주 천마총 장니 천마도와 금령총 말다래는 신라의 돌무지덧널무덤에서 나온 유물이므로 (가)는 신라다. 신라의 문화유산을 고르면 된다.",
    },
    {
      number: 5,
      points: 2,
      image: "/exams/77-advanced/q05.webp",
      answer: 3,
      explanation:
        "백가의 난 평정, 양에 보낸 ‘다시 강국이 되었다’는 국서, 1971년 발굴된 지석이 나온 무덤(무령왕릉)은 모두 무령왕을 가리킨다. 무령왕은 지방 22담로에 왕족을 보내 통제를 강화했다.",
    },
    {
      number: 6,
      points: 3,
      image: "/exams/77-advanced/q06.webp",
      answer: 2,
      eventIds: ["nadang-war"],
      explanation:
        "(가)는 660년 나당 연합군의 백제 공격, (나)는 676년 기벌포 전투다. 그 사이인 660년대 초 복신과 도침이 부여풍을 왕으로 추대해 백제 부흥 운동을 일으켰다.",
    },
    {
      number: 7,
      points: 1,
      image: "/exams/77-advanced/q07.webp",
      answer: 2,
      explanation:
        "5경 15부를 두고 약 300년간 존속하며 당·신라·거란·일본과 관계를 맺은 나라는 발해다. 발해는 유학 교육 기관으로 주자감을 두었다.",
    },
    {
      number: 8,
      points: 2,
      image: "/exams/77-advanced/q08.webp",
      answer: 3,
      explanation:
        "국내성, 대형 계단식 돌무지무덤, 광개토대왕의 연호 ‘영락’ 명문 기와는 모두 고구려를 가리킨다. 고구려에서는 집집마다 부경이라는 창고를 두었다.",
    },
    {
      number: 9,
      points: 2,
      image: "/exams/77-advanced/q09.webp",
      answer: 2,
      explanation:
        "왕건을 나주로 보내고 참위설을 믿어 송악을 버리고 철원으로 옮긴 인물은 궁예다. 궁예는 국정을 총괄하는 광평성 등 정치 기구를 마련했다.",
    },
    {
      number: 10,
      points: 2,
      image: "/exams/77-advanced/q10.webp",
      answer: 4,
      eventIds: ["jangbogo"],
      explanation:
        "청해진 폐지(851년)는 신라 하대의 일이다. 이 시기에는 선종이 유행하여, 도의가 개창한 진전사 같은 선종 사찰에서 참선하는 승려를 볼 수 있었다.",
    },
    {
      number: 11,
      points: 2,
      image: "/exams/77-advanced/q11.webp",
      answer: 4,
      eventIds: ["khitan-war"],
      explanation:
        "귀주 대첩으로 격퇴했으나 조공 책봉 관계를 맺었고 연호 ‘태평’을 쓴 (가)는 거란(요)이다. 고려는 거란의 침입을 부처의 힘으로 물리치고자 초조대장경을 조판했다.",
    },
    {
      number: 12,
      points: 3,
      image: "/exams/77-advanced/q12.webp",
      answer: 1,
      explanation:
        "1부는 통일 신라(혜공왕), 3부는 조선 후기(경신대기근), 4부는 일제 강점기다. 시대 순이므로 2부에는 그 사이인 고려의 사례가 들어가야 하고, 응방은 원 간섭기에 매를 징발하려고 설치한 기구다.",
    },
    {
      number: 13,
      points: 1,
      image: "/exams/77-advanced/q13.webp",
      answer: 4,
      explanation:
        "청주 명암동 단산오옥명 먹, 서긍의 언급, 다인철소, 나전 국화 넝쿨무늬 합은 모두 고려의 것이므로 (가)는 고려다. 고려의 문화유산이 아닌 것을 고르면 된다.",
    },
    {
      number: 14,
      points: 2,
      image: "/exams/77-advanced/q14.webp",
      answer: 5,
      eventIds: ["taejo-wanggeon"],
      explanation:
        "왕건 청동상이 쓴 통천관은 황제의 관이고 ‘준풍’은 광종이 쓴 독자 연호다. 밖으로는 왕을 칭하면서 안으로는 황제국 체제를 갖춘 이런 태도를 외왕내제라 한다.",
    },
    {
      number: 15,
      points: 3,
      image: "/exams/77-advanced/q15.webp",
      answer: 1,
      explanation:
        "충렬왕 때 원에 다녀오며 주희의 저서를 들여와 성리학을 소개하고 소수 서원에 모셔진 인물은 안향이다. 같은 충렬왕 대에 이승휴가 제왕운기를 지었다.",
    },
    {
      number: 16,
      points: 2,
      image: "/exams/77-advanced/q16.webp",
      answer: 4,
      explanation:
        "이의민을 제거하고 집권해 스스로 교정별감이 되었으며 희종을 폐한 인물은 최충헌이다. 최충헌은 집권 직후 봉사 10조를 올려 시정 개혁을 건의했다.",
    },
    {
      number: 17,
      points: 2,
      image: "/exams/77-advanced/q17.webp",
      answer: 1,
      explanation:
        "(가)는 삼국사기 편찬을 총괄한 김부식, (나)는 삼국유사를 지은 일연이다. 김부식은 관군을 이끌고 묘청의 난을 진압했다.",
    },
    {
      number: 18,
      points: 1,
      image: "/exams/77-advanced/q18.webp",
      answer: 5,
      eventIds: ["wihwado"],
      explanation:
        "위화도 회군은 1388년의 일이다. 연표에서 공민왕 즉위(1351)와 고려 멸망(1392) 사이인 (마) 시기에 해당한다.",
    },
    {
      number: 19,
      points: 1,
      image: "/exams/77-advanced/q19.webp",
      answer: 1,
      explanation:
        "문하부를 없애면서 그 낭사를 고쳐 만든 기구이고 대사간이 소속된 (가)는 사간원이다. 사간원은 사헌부·홍문관과 함께 3사로 불렸다.",
    },
    {
      number: 20,
      points: 3,
      image: "/exams/77-advanced/q20.webp",
      answer: 5,
      explanation:
        "간경도감을 세워 불경 언해서를 펴낸 왕은 세조다. 세조는 나눠 줄 과전이 부족해지자 현직 관리에게만 수조권을 주는 직전법을 시행했다.",
    },
    {
      number: 21,
      points: 2,
      image: "/exams/77-advanced/q21.webp",
      answer: 4,
      explanation:
        "병산 서원에 위패가 모셔져 있고 훈련도감 설치와 대공수미법을 건의한 인물은 류성룡이다. 그는 임진왜란의 경과와 교훈을 담은 징비록을 남겼다.",
    },
    {
      number: 22,
      points: 2,
      image: "/exams/77-advanced/q22.webp",
      answer: 5,
      eventIds: ["byeongja-horan"],
      explanation:
        "남한산성에서 김상헌과 최명길이 척화와 주화로 맞선 상황은 병자호란(1636~1637)이다. 그 뒤 효종이 이완을 어영대장으로 삼아 북벌을 준비했다.",
    },
    {
      number: 23,
      points: 2,
      image: "/exams/77-advanced/q23.webp",
      answer: 1,
      explanation:
        "초량 왜관에서 대일 무역이 이루어진 때는 조선 후기다. 계해약조는 1443년 세종 때 맺은 것이므로 이 시기에는 볼 수 없다.",
    },
    {
      number: 24,
      points: 3,
      image: "/exams/77-advanced/q24.webp",
      answer: 3,
      eventIds: ["yesong-hwanguk"],
      explanation:
        "경신환국의 보사 공신이 기사환국과 갑술환국을 거치며 지위를 잃었다 되찾은 시기의 왕은 숙종이다. 숙종은 국왕 호위와 수도 방어를 위해 금위영을 창설했다.",
    },
    {
      number: 25,
      points: 1,
      image: "/exams/77-advanced/q25.webp",
      answer: 3,
      explanation:
        "도고가 물품을 독차지해 문제가 된 것은 조선 후기다. 이 시기에는 대동법 시행에 따라 관청에 물품을 조달하는 공인이 활동했다.",
    },
    {
      number: 26,
      points: 2,
      image: "/exams/77-advanced/q26.webp",
      answer: 4,
      eventIds: ["silhak"],
      explanation:
        "북학의를 쓰고 박지원이 서문을 붙인 인물은 박제가다. 박제가는 서얼 출신으로 규장각 검서관이 되어 무예도보통지 편찬에 참여했다.",
    },
    {
      number: 27,
      points: 1,
      image: "/exams/77-advanced/q27.webp",
      answer: 5,
      explanation:
        "충주 고구려비, 탄금대, 중앙탑(충주 탑평리 칠층석탑)은 모두 충주에 있으므로 (가)는 충주다. 김윤후는 충주성에서 노비 등을 이끌고 몽골군을 물리쳤다.",
    },
    {
      number: 28,
      points: 2,
      image: "/exams/77-advanced/q28.webp",
      answer: 3,
      explanation:
        "박규수가 진주 안핵사로 파견되어 환곡의 폐단을 아뢴 것은 1862년 임술 농민 봉기 때다. 정부는 그 뒤 삼정의 문란을 바로잡고자 삼정이정청을 설치했다.",
    },
    {
      number: 29,
      points: 2,
      image: "/exams/77-advanced/q29.webp",
      answer: 4,
      explanation:
        "양헌수가 정족산성에서 프랑스군을 물리친 것은 1866년 병인양요다. 그 배경은 같은 해 프랑스 신부와 천주교도를 처형한 병인박해였다.",
    },
    {
      number: 30,
      points: 3,
      image: "/exams/77-advanced/q30.webp",
      answer: 3,
      eventIds: ["eulmi"],
      explanation:
        "국모 시해 사건 뒤에 추진되어 단발령을 내리고 태양력과 연호 ‘건양’을 정한 것은 을미개혁이다. 을미개혁으로 군제를 고쳐 중앙에 친위대, 지방에 진위대를 두었다.",
    },
    {
      number: 31,
      points: 2,
      image: "/exams/77-advanced/q31.webp",
      answer: 2,
      eventIds: ["imo"],
      explanation:
        "선혜청 당상 민겸호가 피살되고 청이 진압한 (가)는 1882년 임오군란이다. 임오군란의 결과 일본과 제물포 조약을 맺었다.",
    },
    {
      number: 32,
      points: 2,
      image: "/exams/77-advanced/q32.webp",
      answer: 3,
      explanation:
        "포와(布哇)는 하와이의 한자 표기이고 사탕수수 농장 이민은 하와이 한인 사회의 출발점이다. 하와이에서는 박용만이 무장 투쟁을 위해 대조선 국민 군단을 결성했다.",
    },
    {
      number: 33,
      points: 1,
      image: "/exams/77-advanced/q33.webp",
      answer: 2,
      explanation:
        "중명전, 민영환의 자결, 나철·오기호의 자신회는 모두 1905년 을사늑약과 얽힌 자료다. 을사늑약으로 외교권을 빼앗기고 통감부가 설치되었다.",
    },
    {
      number: 34,
      points: 2,
      image: "/exams/77-advanced/q34.webp",
      answer: 2,
      explanation:
        "안창호·양기탁을 중심으로 비밀리에 결성되어 태극 서관을 운영한 (가)는 신민회다. 신민회는 평양에 대성 학교를 세워 인재를 길렀다.",
    },
    {
      number: 35,
      points: 3,
      image: "/exams/77-advanced/q35.webp",
      answer: 5,
      explanation:
        "헐버트가 교사로 있었고 그가 지은 사민필지를 교과서로 쓴 학교는 육영 공원이다. 육영 공원은 현직 관리를 뽑는 좌원과 양반 자제를 뽑는 우원으로 나누어 학생을 선발했다.",
    },
    {
      number: 36,
      points: 2,
      image: "/exams/77-advanced/q36.webp",
      answer: 4,
      explanation:
        "나석주가 조선 식산 은행과 동양 척식 주식회사에 폭탄을 던진 이 단체는 의열단이다. 의열단은 신채호가 쓴 조선 혁명 선언을 활동 지침으로 삼았다.",
    },
    {
      number: 37,
      points: 1,
      image: "/exams/77-advanced/q37.webp",
      answer: 1,
      eventIds: ["toji"],
      explanation:
        "임시 토지 조사국을 두고 추진한 이 정책은 1910년대의 토지 조사 사업이다. 같은 시기는 무단 통치기로, 헌병 경찰이 조선 태형령에 따라 태형을 집행했다.",
    },
    {
      number: 38,
      points: 2,
      image: "/exams/77-advanced/q38.webp",
      answer: 5,
      explanation:
        "민족 단일당으로 결성되어 각지에 지회를 두고 민중 대회를 준비하다 해소한 (가)는 신간회다. 신간회는 광주 학생 항일 운동에 진상 조사단을 파견했다.",
    },
    {
      number: 39,
      points: 2,
      image: "/exams/77-advanced/q39.webp",
      answer: 5,
      explanation:
        "대공황 이후 남부에 면화 재배를 강요한 것은 1930년대의 남면북양 정책이다. 같은 시기 일제는 농민의 자력갱생을 내세운 농촌 진흥 운동을 추진했다.",
    },
    {
      number: 40,
      points: 3,
      image: "/exams/77-advanced/q40.webp",
      answer: 2,
      explanation:
        "황성옛터·타향살이·목포의 눈물은 모두 일제 강점기에 나온 대중가요다. 윤심덕의 사의 찬미(1926)도 같은 시기의 곡이며, 비극적인 삶이 빚어낸 염세와 허무라는 설명과도 맞는다.",
    },
    {
      number: 41,
      points: 2,
      image: "/exams/77-advanced/q41.webp",
      answer: 1,
      explanation:
        "국민부 산하에서 양세봉이 총사령관으로 이끈 이 부대는 조선 혁명군이다. 조선 혁명군은 중국 의용군과 연합하여 영릉가에 이어 흥경성 전투에서 일본군을 격퇴했다.",
    },
    {
      number: 42,
      points: 3,
      image: "/exams/77-advanced/q42.webp",
      answer: 5,
      eventIds: ["aeguk-dan"],
      explanation:
        "대동단결 선언에 참여하고 삼균주의에 바탕한 대한민국 건국 강령 초안을 작성한 (가)는 조소앙이다. 조소앙은 1935년 김원봉 등과 함께 민족 혁명당을 결성했다.",
    },
    {
      number: 43,
      points: 2,
      image: "/exams/77-advanced/q43.webp",
      answer: 2,
      explanation:
        "어린이날·메이데이·과학 데이는 모두 일제 강점기에 기리기 시작한 기념일이다. 가갸날도 1926년 조선어 연구회가 훈민정음 반포를 기념해 정한 날이다.",
    },
    {
      number: 44,
      points: 1,
      image: "/exams/77-advanced/q44.webp",
      answer: 4,
      explanation:
        "국가 총동원법이 시행된 1938년 이후는 민족 말살 통치기다. 이 시기 학생들은 황국 신민 서사를 외워야 했다.",
    },
    {
      number: 45,
      points: 2,
      image: "/exams/77-advanced/q45.webp",
      answer: 1,
      explanation:
        "상환금, 지가 증권, 분배 취소 요구는 모두 1950년부터 시행된 농지 개혁에서 나온 말이다.",
    },
    {
      number: 46,
      points: 2,
      image: "/exams/77-advanced/q46.webp",
      answer: 1,
      explanation:
        "엔도 정무총감과 회담하고 좌우 합작을 주도하다 1947년 암살된 인물은 여운형이다. 여운형은 광복에 대비해 1944년 조선 건국 동맹을 결성했다.",
    },
    {
      number: 47,
      points: 3,
      image: "/exams/77-advanced/q47.webp",
      answer: 2,
      explanation:
        "수출 100억 달러 달성(1977)과 임시 행정 수도 건설 계획으로 보아 (가)는 박정희 정부다. 포항 제철소 1기 설비는 1973년에 준공되었다.",
    },
    {
      number: 48,
      points: 2,
      image: "/exams/77-advanced/q48.webp",
      answer: 2,
      eventIds: ["yusin"],
      explanation:
        "YH 무역 노동자 강제 진압과 김영삼 총재의 의원직 제명은 1979년의 일이다. 이 제명을 계기로 부산과 마산에서 부마 민주 항쟁이 일어났다.",
    },
    {
      number: 49,
      points: 2,
      image: "/exams/77-advanced/q49.webp",
      answer: 2,
      explanation:
        "보도 지침을 내려 언론을 통제한 이 정부는 전두환 정부다.",
    },
    {
      number: 50,
      points: 2,
      image: "/exams/77-advanced/q50.webp",
      answer: 3,
      eventIds: ["sambyeolcho"],
      explanation:
        "(다)는 538년 사비로 도읍을 옮긴 백제 성왕이다. 성왕은 천도와 함께 국호를 남부여로 고쳤다.",
    },
  ],
};
