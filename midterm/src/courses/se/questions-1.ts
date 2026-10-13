import type { Question } from "@/lib/types";

/* intro · proc · act */
export const QUESTIONS_1: Question[] = [
  // program-vs-software
  { kind: "mc", id: "se-q-ps-1", concept: "program-vs-software", q: "소프트웨어에 대한 설명으로 가장 알맞은 것은?", options: ["컴퓨터가 실행하는 명령어의 모음만을 뜻한다", "프로그램과 개발 중 만들어진 모든 산출물(문서·DB 구조·테스트 결과 등)을 포함한다", "소스 코드만을 뜻한다", "컴파일된 실행 파일만을 뜻한다"], answer: 1, explain: "Software is a comprehensive concept — 프로그램 이상을 포함한다." },
  { kind: "mc", id: "se-q-ps-2", concept: "program-vs-software", q: "교안에서 소프트웨어의 예로 든 것이 아닌 것은?", options: ["테스트 결과", "사용자 매뉴얼", "데이터베이스 구조", "개발자가 사용한 키보드"], answer: 3, explain: "자료 구조, DB, DB 구조, 테스트 결과, 단계별 문서, 사용자 매뉴얼이 예." },
  { kind: "ox", id: "se-q-ps-3", concept: "program-vs-software", q: "프로그램과 소프트웨어는 같은 뜻이다.", answer: false, explain: "소프트웨어는 프로그램 + 관련 문서·산출물로 더 넓은 개념이다." },
  { kind: "short", id: "se-q-ps-4", concept: "program-vs-software", q: "SE를 이해하는 질문에서 'What is software?'의 답: Computer programs and associated ______. (영어 한 단어)", answers: ["documentation", "문서"], explain: "Computer programs and associated documentation." },

  // sw-characteristics
  { kind: "mc", id: "se-q-ch-1", concept: "sw-characteristics", q: "소프트웨어가 하드웨어와 다른 점으로 옳은 것은?", options: ["먼지·진동·열 같은 환경 조건으로 고장이 급격히 는다", "부품이 마모되어 소모된다", "환경의 영향이 거의 없고, 품질 저하의 주원인은 변경이다", "공장에서 대량으로 제조(manufacture)한다"], answer: 2, explain: "SW는 소모되지 않지만, 사용 중 요구를 반영한 변경이 고장률을 높인다." },
  { kind: "ox", id: "se-q-ch-2", concept: "sw-characteristics", q: "소프트웨어는 개발(development)이 아니라 제조(manufacture)되는 것이다.", answer: false, explain: "새로운 것을 만드는 development다. 그래서 개인 능력이 생산성에 영향을 준다." },
  { kind: "ox", id: "se-q-ch-3", concept: "sw-characteristics", q: "개발자 개인의 능력이 소프트웨어 개발 생산성에 영향을 줄 수 있다.", answer: true, explain: "Individual abilities can affect productivity of SW development." },
  { kind: "mc", id: "se-q-ch-4", concept: "sw-characteristics", q: "실제 소프트웨어의 고장률 곡선에서 고장률이 다시 높아지는 원인은?", options: ["부품 마모", "사용 단계에서 요구사항을 반영하려는 변경", "열과 진동", "사용자 수 감소"], answer: 1, explain: "The changes may cause increasing of failure rate." },
  { kind: "ox", id: "se-q-ch-5", concept: "sw-characteristics", q: "하드웨어는 초기 고장률이 높지만 오류 수정 뒤 오래 쓸 수 있다.", answer: true, explain: "이후 환경 조건 때문에 고장이 다시 급증한다(욕조 곡선)." },

  // sw-problems
  { kind: "mc", id: "se-q-pr-1", concept: "sw-problems", q: "교안의 '해결할 SW 문제'가 아닌 것은?", options: ["HW보다 느린 SW 개발 속도", "새 SW에 대한 수요 증가", "관리 기법의 부분적 사용", "하드웨어 가격의 급등"], answer: 3, explain: "세 문제: 느린 개발 속도, 수요 증가(낮은 생산성), 관리 기법의 부분적 사용(PMBOK)." },
  { kind: "ox", id: "se-q-pr-2", concept: "sw-problems", q: "수명이 긴 시스템에서는 유지보수 비용이 개발 비용의 몇 배가 될 수 있다.", answer: true, explain: "Software costs more to maintain than it does to develop." },
  { kind: "short", id: "se-q-pr-3", concept: "sw-problems", q: "교안에 따르면 SW 비용의 대략 몇 %가 개발 비용인가? (숫자만)", answers: ["60", "60%"], explain: "Roughly 60% development, 40% testing.", hint: "숫자" },
  { kind: "mc", id: "se-q-pr-4", concept: "sw-problems", q: "'필요한 시간 안에 쓸모 있고 효율적인 프로그램을 작성하기 어려웠던' 초기 컴퓨팅의 상황을 가리키는 말은?", options: ["SW 위기 (Software crisis)", "SW 진화", "SW 재사용", "SW 프로세스"], answer: 0, explain: "Software crisis — 초창기에 필요한 시간 안에 쓸 만한 프로그램을 만들기 어려웠던 상황." },
  { kind: "short", id: "se-q-pr-5", concept: "sw-problems", q: "체계적인 프로젝트 관리를 위해 교안이 든 '프로젝트 관리 지식 체계'의 약어는? (영문 5자)", answers: ["pmbok"], explain: "Project Management Body of Knowledge.", hint: "영문" },
  { kind: "ox", id: "se-q-pr-6", concept: "sw-problems", q: "PC에서는 대개 하드웨어 비용이 소프트웨어 비용보다 훨씬 크다.", answer: false, explain: "PC에서도 SW 비용이 HW 비용보다 큰 경우가 많다." },

  // project-failure
  { kind: "mc", id: "se-q-pf-1", concept: "project-failure", q: "SW 프로젝트 실패의 두 가지 주요 원인으로 짝지어진 것은?", options: ["HW 성능 부족, 인력 부족", "시스템 복잡도 증가, SE 방법을 쓰지 않음", "예산 과다, 일정 과다", "고객 부재, 도구 부족"], answer: 1, explain: "① 요구가 커지는 속도 > 기술 발전(복잡도 증가) ② SE 방법 없이 대충 만듦." },
  { kind: "ox", id: "se-q-pf-2", concept: "project-failure", q: "SE 방법 없이 프로그램을 작성하기는 어렵기 때문에 대부분의 회사는 SE 방법을 쓴다.", answer: false, explain: "SE 없이도 쉽게 짤 수 있어 많은 회사가 쓰지 않는다 → 비싸고 덜 믿을 만한 SW." },
  { kind: "ox", id: "se-q-pf-3", concept: "project-failure", q: "새 SE 기법으로 더 큰 시스템을 만들 수 있게 되면, 더 크고 복잡한 시스템을 더 빨리 요구받게 된다.", answer: true, explain: "Increasing system complexity." },

  // se-definition
  { kind: "mc", id: "se-q-de-1", concept: "se-definition", q: "소프트웨어 공학의 정의로 가장 알맞은 것은?", options: ["프로그래밍 언어의 문법을 연구하는 학문", "명세 초기부터 유지보수까지 SW 생산의 모든 측면을 다루는 공학 분야", "하드웨어 설계를 다루는 분야", "코딩 속도를 높이는 기술"], answer: 1, explain: "Engineering discipline + all aspects of SW production + 명세부터 유지보수까지." },
  { kind: "ox", id: "se-q-de-2", concept: "se-definition", q: "SE의 '모든 측면'에는 기술적 개발 과정뿐 아니라 프로젝트 관리와 도구·방법 개발도 포함된다.", answer: true, explain: "All aspects = 기술 개발 과정 + 프로젝트 관리 + 도구·방법 개발." },
  { kind: "mc", id: "se-q-de-3", concept: "se-definition", q: "SE가 중요한 이유로 교안이 든 것은?", options: ["SW 의존이 커지고, 장기적으로 SE 방법을 쓰는 것이 더 싸다", "SE를 쓰면 문서를 쓰지 않아도 된다", "SE는 하드웨어 비용을 줄인다", "SE는 프로그래머 수를 늘린다"], answer: 0, explain: "Dependency of software, Cost saving." },
  { kind: "ox", id: "se-q-de-4", concept: "se-definition", q: "대부분 시스템에서 비용의 대부분은 처음 개발할 때 들고, 사용 뒤 변경 비용은 작다.", answer: false, explain: "대부분 비용은 사용에 들어간 뒤의 변경 비용." },
  { kind: "short", id: "se-q-de-5", concept: "se-definition", q: "SE 정의의 'Engineering discipline'은 적절한 이론과 방법으로 문제를 풀되, 조직적·_____ 제약을 고려한다. (한 단어, 한글 또는 영어)", answers: ["재정", "재정적", "financial"], explain: "Organizational and financial constraints." },

  // se-vs-cs
  { kind: "mc", id: "se-q-cs-1", concept: "se-vs-cs", q: "SE와 컴퓨터 과학(CS)의 차이로 옳은 것은?", options: ["CS는 실제 SW 인도에, SE는 이론에 집중", "CS는 이론과 기초에, SE는 쓸모 있는 SW를 개발·인도하는 실제에 집중", "둘은 같다", "SE는 HW만 다룬다"], answer: 1, explain: "CS = theory and fundamentals, SE = practicalities of developing and delivering useful software." },
  { kind: "mc", id: "se-q-cs-2", concept: "se-vs-cs", q: "시스템 공학과 SE의 관계로 옳은 것은?", options: ["SE가 시스템 공학을 포함한다", "시스템 공학은 HW·SW·프로세스를 포함한 전체를 다루며 SE는 그 일부다", "둘은 관계가 없다", "시스템 공학은 SW만 다룬다"], answer: 1, explain: "System engineering ⊃ Software engineering. 시스템 공학은 HW·SW·프로세스 공학 전체." },
  { kind: "mc", id: "se-q-cs-3", concept: "se-vs-cs", q: "SE가 마주한 핵심 과제(key challenges)가 아닌 것은?", options: ["다양성 증가에 대처", "납기 단축 요구", "신뢰할 수 있는 SW 개발", "하드웨어 표준화"], answer: 3, explain: "핵심 과제 3개: 다양성 증가, 납기 단축 요구, 신뢰할 수 있는 SW." },
  { kind: "ox", id: "se-q-cs-4", concept: "se-vs-cs", q: "모든 SW 프로젝트에 가장 좋은 단 하나의 SE 기법이 있다.", answer: false, explain: "시스템 유형마다 적절한 기법이 다르다." },
  { kind: "ox", id: "se-q-cs-5", concept: "se-vs-cs", q: "웹은 SW 서비스와 고도로 분산된 서비스 기반 시스템을 가능하게 했고, SW 재사용의 큰 발전을 가져왔다.", answer: true, explain: "'웹이 SE에 준 변화' 질문의 답 그대로." },

  // process-activities-4
  { kind: "mc", id: "se-q-pa-1", concept: "process-activities-4", q: "모든 SW 프로세스에 포함되는 4가지 기본 활동이 아닌 것은?", options: ["명세화", "개발", "검증", "마케팅"], answer: 3, explain: "Specification, Development, Validation, Evolution." },
  { kind: "mc", id: "se-q-pa-2", concept: "process-activities-4", q: "'변하는 고객과 시장 요구를 반영해 SW를 수정하는' 활동은?", options: ["명세화", "개발", "검증", "진화"], answer: 3, explain: "Software evolution." },
  { kind: "mc", id: "se-q-pa-3", concept: "process-activities-4", q: "'SW가 고객이 요구한 것인지 확인하는' 활동은?", options: ["명세화", "검증", "진화", "설계"], answer: 1, explain: "Software validation." },
  { kind: "short", id: "se-q-pa-4", concept: "process-activities-4", q: "4가지 기본 활동 중 '고객과 엔지니어가 만들 SW와 운영 제약을 정의'하는 활동의 영어 이름은?", answers: ["specification", "software specification", "명세화"], explain: "Specification(명세화) — Development, Validation, Evolution과 함께 4활동." },

  // general-issues
  { kind: "mc", id: "se-q-gi-1", concept: "general-issues", q: "'여러 종류의 컴퓨터와 모바일 기기를 포함한 네트워크에서 분산 시스템으로 동작해야 한다'는 이슈는?", options: ["Scale", "Heterogeneity", "Security and trust", "Business and social change"], answer: 1, explain: "이질성." },
  { kind: "mc", id: "se-q-gi-2", concept: "general-issues", q: "'작은 임베디드부터 전 세계를 서비스하는 인터넷 규모 클라우드까지'는 어떤 이슈인가?", options: ["Scale", "Heterogeneity", "Efficiency", "Acceptability"], answer: 0, explain: "규모." },
  { kind: "ox", id: "se-q-gi-3", concept: "general-issues", q: "SW가 삶의 모든 면에 얽혀 있으므로 그 SW를 믿을 수 있어야 한다는 것은 'Security and trust' 이슈다.", answer: true, explain: "Security and trust(보안과 신뢰)." },

  // good-sw-attributes
  { kind: "mc", id: "se-q-ga-1", concept: "good-sw-attributes", q: "좋은 SW의 필수 속성이 아닌 것은?", options: ["Maintainability", "Dependability and security", "Efficiency", "Portability"], answer: 3, explain: "4속성: 유지보수성, 확실성·보안성, 효율성, 수용성." },
  { kind: "mc", id: "se-q-ga-2", concept: "good-sw-attributes", q: "Dependability에 포함되는 특성이 아닌 것은?", options: ["신뢰성(reliability)", "보안성(security)", "안전성(safety)", "이식성(portability)"], answer: 3, explain: "Dependability = reliability + security + safety. 이식성은 들어가지 않는다." },
  { kind: "mc", id: "se-q-ga-3", concept: "good-sw-attributes", q: "'대상 사용자가 이해할 수 있고, 쓸 수 있고, 다른 시스템과 호환되어야 한다'는 속성은?", options: ["Efficiency", "Acceptability", "Maintainability", "Dependability"], answer: 1, explain: "수용성." },
  { kind: "mc", id: "se-q-ga-4", concept: "good-sw-attributes", q: "응답성, 처리 시간, 메모리 사용과 관련된 속성은?", options: ["Efficiency", "Acceptability", "Maintainability", "Security"], answer: 0, explain: "Efficiency = 자원을 낭비하지 않음 — 응답성·처리 시간·메모리 사용." },
  { kind: "ox", id: "se-q-ga-5", concept: "good-sw-attributes", q: "유지보수성은 변하는 비즈니스 환경에서 변경이 피할 수 없는 요구이기 때문에 핵심 속성이다.", answer: true, explain: "Maintainability는 'critical attribute' — 변경은 피할 수 없기 때문." },
  { kind: "ox", id: "se-q-ga-6", concept: "good-sw-attributes", q: "확실성을 갖춘 SW는 시스템이 고장 나면 경제적 피해를 낼 수 있어도 괜찮다.", answer: false, explain: "고장 나도 물리적·경제적 피해를 내서는 안 된다." },

  // product-types
  { kind: "mc", id: "se-q-pt-1", concept: "product-types", q: "맞춤형 제품(Customized products)의 명세에 대한 설명으로 옳은 것은?", options: ["개발자가 명세를 소유하고 변경을 결정한다", "고객이 명세를 소유하고 변경을 결정한다", "명세가 없다", "정부가 결정한다"], answer: 1, explain: "Generic은 개발자, Customized는 고객." },
  { kind: "mc", id: "se-q-pt-2", concept: "product-types", q: "다음 중 맞춤형 제품의 예는?", options: ["그래픽 프로그램", "CAD 소프트웨어", "항공 교통 관제 시스템", "프로젝트 관리 도구"], answer: 2, explain: "임베디드 제어, 항공 교통 관제, 교통 모니터링 = 맞춤형." },
  { kind: "ox", id: "se-q-pt-3", concept: "product-types", q: "치과 예약 시스템 같은 특정 시장용 SW는 일반 제품(generic product)의 예다.", answer: true, explain: "특정 시장에 파는 독립형 시스템." },
  { kind: "ox", id: "se-q-pt-4", concept: "product-types", q: "일반 제품(generic)은 고객이 명세를 소유하고 변경을 결정한다.", answer: false, explain: "일반 제품은 개발자가 소유·결정." },

  // app-types
  { kind: "mc", id: "se-q-at-1", concept: "app-types", q: "'HW 장치를 제어·관리하며 수적으로 가장 많은' 응용 유형은?", options: ["Batch processing", "Embedded control systems", "Entertainment", "Stand-alone"], answer: 1, explain: "Embedded control systems — 수적으로 가장 많다(Numerically, probably more than any other type)." },
  { kind: "mc", id: "se-q-at-2", concept: "app-types", q: "'원격 컴퓨터에서 실행되고 사용자가 자기 PC나 단말로 접속하는, 전자상거래 같은' 응용 유형은?", options: ["Stand-alone", "Interactive transaction-based", "Data collection", "Systems of systems"], answer: 1, explain: "Interactive transaction-based applications — 웹 앱, 전자상거래." },
  { kind: "mc", id: "se-q-at-3", concept: "app-types", q: "'센서로 환경에서 데이터를 모아 다른 시스템으로 보내는' 응용 유형은?", options: ["Data collection systems", "Modelling and simulation", "Batch processing", "Entertainment"], answer: 0, explain: "Data collection systems — 센서로 수집해 다른 시스템으로 보냄." },
  { kind: "short", id: "se-q-at-4", concept: "app-types", q: "'여러 다른 SW 시스템으로 구성된 시스템'을 영어 약어로? (3자)", answers: ["sos", "systems of systems", "system of systems"], explain: "Systems of systems.", hint: "영문" },
  { kind: "ox", id: "se-q-at-5", concept: "app-types", q: "모든 유형의 SW 시스템에 적용할 수 있는 보편적인 SE 기법 집합이 있다.", answer: false, explain: "보편적 기법은 없다. 다만 기본 원칙은 모든 유형에 적용된다." },
  { kind: "mc", id: "se-q-at-6", concept: "app-types", q: "모든 유형의 시스템에 적용되는 SE 기본 원칙이 아닌 것은?", options: ["관리되고 이해된 프로세스로 개발", "확실성과 성능은 중요", "명세와 요구사항을 이해·관리", "가능하면 모든 것을 새로 작성"], answer: 3, explain: "적절하면 재사용해야 한다." },
  { kind: "ox", id: "se-q-at-7", concept: "app-types", q: "Batch processing 시스템은 많은 개별 입력을 묶어 처리해 대응하는 출력을 만드는 업무 시스템이다.", answer: true, explain: "Batch processing systems의 정의 그대로." },

  // ethics
  { kind: "mc", id: "se-q-et-1", concept: "ethics", q: "전문가 책임의 이슈가 아닌 것은?", options: ["Confidentiality", "Competence", "Intellectual property rights", "Profitability"], answer: 3, explain: "4이슈: 비밀유지, 능력, 지적재산권, 컴퓨터 남용." },
  { kind: "ox", id: "se-q-et-2", concept: "ethics", q: "엔지니어는 공식 비밀유지 계약을 맺었을 때에만 고객의 비밀을 지키면 된다.", answer: false, explain: "계약 여부와 상관없이 존중해야 한다." },
  { kind: "ox", id: "se-q-et-3", concept: "ethics", q: "윤리적 행동은 단순히 법을 지키는 것 이상으로 도덕적으로 옳은 원칙을 따르는 것이다.", answer: true, explain: "Ethical behaviour is more than simply upholding the law." },
  { kind: "mc", id: "se-q-et-4", concept: "ethics", q: "'자기 능력 수준을 속이지 않고, 능력 밖의 일을 알면서 맡지 않는다'는 이슈는?", options: ["Confidentiality", "Competence", "Computer misuse", "Intellectual property rights"], answer: 1, explain: "Competence(능력) — 능력을 속이지 않고, 능력 밖의 일을 알면서 맡지 않는다." },
  { kind: "mc", id: "se-q-et-5", concept: "ethics", q: "교안에서 컴퓨터 남용(Computer misuse)의 '사소한' 예로 든 것은?", options: ["바이러스 유포", "고용주 컴퓨터로 게임하기", "특허 침해", "고객 정보 유출"], answer: 1, explain: "사소함(게임)부터 매우 심각함(바이러스 유포)까지." },

  // acm-ieee
  { kind: "short", id: "se-q-ac-1", concept: "acm-ieee", q: "ACM/IEEE 윤리 강령의 원칙은 몇 개인가?", answers: ["8", "8개", "여덟"], explain: "PUBLIC, CLIENT AND EMPLOYER, PRODUCT, JUDGMENT, MANAGEMENT, PROFESSION, COLLEAGUES, SELF — 8개.", hint: "숫자" },
  { kind: "mc", id: "se-q-ac-2", concept: "acm-ieee", q: "'전문적 판단의 무결성과 독립성을 유지한다'는 원칙은?", options: ["PRODUCT", "JUDGMENT", "PROFESSION", "SELF"], answer: 1, explain: "JUDGMENT — integrity and independence in professional judgment." },
  { kind: "mc", id: "se-q-ac-3", concept: "acm-ieee", q: "'직업의 실천에 관해 평생 학습에 참여한다'는 원칙은?", options: ["SELF", "COLLEAGUES", "MANAGEMENT", "PUBLIC"], answer: 0, explain: "SELF — lifelong learning, 윤리적 실천 장려." },
  { kind: "mc", id: "se-q-ac-4", concept: "acm-ieee", q: "ACM/IEEE 8원칙에 해당하지 않는 것은?", options: ["PUBLIC", "CLIENT AND EMPLOYER", "PROFIT", "COLLEAGUES"], answer: 2, explain: "PUBLIC, CLIENT AND EMPLOYER, PRODUCT, JUDGMENT, MANAGEMENT, PROFESSION, COLLEAGUES, SELF." },
  { kind: "ox", id: "se-q-ac-5", concept: "acm-ieee", q: "PRODUCT 원칙은 제품과 관련 수정이 가능한 최고의 전문 표준을 만족하도록 하라는 것이다.", answer: true, explain: "PRODUCT — highest professional standards possible." },
  { kind: "mc", id: "se-q-ac-6", concept: "acm-ieee", q: "\"Blade Runner를 만들 것인가, Star Trek을 만들 것인가\"라며 기술적 결정의 윤리를 말한 Java의 아버지는?", options: ["Bjarne Stroustrup", "James Gosling", "Ian Sommerville", "Kent Beck"], answer: 1, explain: "James Gosling(Java의 아버지). Stroustrup은 C++ 창시자로 커리어 조언 슬라이드에 나온다." },

  // web-se
  { kind: "mc", id: "se-q-we-1", concept: "web-se", q: "웹 기반 시스템을 구축하는 지배적인 방식은?", options: ["모든 것을 새로 작성", "SW 재사용", "폭포수 모델", "하드웨어 중심 개발"], answer: 1, explain: "Software reuse is the dominant approach for constructing web-based systems." },
  { kind: "ox", id: "se-q-we-2", concept: "web-se", q: "웹 기반 시스템은 복잡한 분산 시스템이므로 SE의 기본 원칙이 적용되지 않는다.", answer: false, explain: "똑같이 적용된다." },
  { kind: "ox", id: "se-q-we-3", concept: "web-se", q: "클라우드 컴퓨팅에서 사용자는 SW를 사지 않고 쓴 만큼 지불한다.", answer: true, explain: "Cloud computing — Users do not buy software but pay according to use." },
  { kind: "mc", id: "se-q-we-4", concept: "web-se", q: "웹 브라우저 안에서 풍부한 인터페이스를 만드는 기술로 교안에 든 것은?", options: ["COBOL, FORTRAN", "AJAX, HTML5", "JUnit, Git", "COTS, CMM"], answer: 1, explain: "Rich interfaces — AJAX, HTML5." },
  { kind: "ox", id: "se-q-we-5", concept: "web-se", q: "웹 기반 시스템은 모든 요구사항을 미리 명세한 뒤 한 번에 인도해야 한다.", answer: false, explain: "요구를 미리 다 명세하는 것은 비현실적 → 점증적·애자일 개발." },

  // lifecycle-process
  { kind: "mc", id: "se-q-lp-1", concept: "lifecycle-process", q: "SW 프로세스의 정의로 옳은 것은?", options: ["SW 시스템을 개발하는 데 필요한 구조화된 활동의 집합", "프로그래밍 언어", "소스 코드 저장소", "테스트 도구"], answer: 0, explain: "A structured set of activities required to develop a software system." },
  { kind: "mc", id: "se-q-lp-2", concept: "lifecycle-process", q: "프로세스 없이 '프로그래밍 → 만족할 때까지 수정'을 반복하는 방식은?", options: ["code-and-fix (주먹구구식)", "폭포수", "프로토타이핑", "애자일"], answer: 0, explain: "code-and-fix(주먹구구식) — 설계·계획·체계적 테스트가 없다." },
  { kind: "mc", id: "se-q-lp-3", concept: "lifecycle-process", q: "프로세스 기술(process description)에 포함될 수 있는 것이 아닌 것은?", options: ["Products (산출물)", "Roles (역할)", "Pre/Post-conditions", "Salaries (급여)"], answer: 3, explain: "프로세스 기술에는 활동·순서 + Products, Roles, Pre/Post-conditions." },
  { kind: "mc", id: "se-q-lp-4", concept: "lifecycle-process", q: "좋은 프로세스의 특징이 아닌 것은?", options: ["예측 가능성", "테스트·유지보수 용이성", "변경 지원", "문서 없음"], answer: 3, explain: "예측 가능성, 테스트·유지보수 용이성, 변경 지원, 결함 제거." },
  { kind: "ox", id: "se-q-lp-5", concept: "lifecycle-process", q: "SW 프로세스 모델은 프로세스를 특정 관점에서 기술한 추상적 표현이다.", answer: true, explain: "A software process model is an abstract representation of a process." },
  { kind: "short", id: "se-q-lp-6", concept: "lifecycle-process", q: "프로세스 기술에서 '활동 수행 전후에 참인 진술'을 무엇이라 하는가? (한글)", answers: ["사전사후조건", "사전 사후 조건", "사전·사후 조건", "pre and post conditions", "pre- and post-conditions"], explain: "Pre- and post-conditions." },

  // plan-vs-agile
  { kind: "mc", id: "se-q-pa2-1", concept: "plan-vs-agile", q: "계획 주도(plan-driven) 프로세스의 특징은?", options: ["계획이 점진적이다", "모든 활동을 미리 계획하고 그 계획에 비추어 진행을 측정한다", "고객이 늘 팀에 있다", "문서를 쓰지 않는다"], answer: 1, explain: "계획 주도 = 미리 계획, 그 계획 대비 진척 측정. 애자일 = 점진적 계획." },
  { kind: "ox", id: "se-q-pa2-2", concept: "plan-vs-agile", q: "옳은 SW 프로세스와 틀린 SW 프로세스가 분명히 구분된다.", answer: false, explain: "There are no right or wrong software processes." },
  { kind: "ox", id: "se-q-pa2-3", concept: "plan-vs-agile", q: "실제로 대부분의 프로세스는 계획 주도와 애자일 요소를 모두 포함한다.", answer: true, explain: "In practice, most practical processes include elements of both." },

  // waterfall
  { kind: "mc", id: "se-q-wf-1", concept: "waterfall", q: "폭포수 모델의 단계 순서로 옳은 것은?", options: ["설계 → 요구 분석 → 구현 → 테스트 → 운영", "요구 분석·정의 → 시스템·SW 설계 → 구현·단위 테스트 → 통합·시스템 테스트 → 운영·유지보수", "구현 → 설계 → 테스트 → 요구 분석", "테스트 → 구현 → 설계 → 운영"], answer: 1, explain: "요구 → 설계 → 구현·단위 테스트 → 통합·시스템 테스트 → 운영·유지보수." },
  { kind: "mc", id: "se-q-wf-2", concept: "waterfall", q: "폭포수 모델의 주된 단점은?", options: ["문서가 없다", "진행 중 변경을 수용하기 어렵다", "계획이 없다", "테스트 단계가 없다"], answer: 1, explain: "The main drawback is the difficulty of accommodating change after the process is underway." },
  { kind: "mc", id: "se-q-wf-3", concept: "waterfall", q: "폭포수 모델이 적합한 경우는?", options: ["요구사항이 자주 바뀔 때", "요구사항이 잘 이해되고 설계 중 변경이 제한적일 때", "작은 스타트업 앱", "고객 피드백이 매일 필요할 때"], answer: 1, explain: "요구가 잘 이해되고 변경이 제한적일 때만 적합. 안정된 요구는 드물다." },
  { kind: "ox", id: "se-q-wf-4", concept: "waterfall", q: "폭포수 모델은 여러 장소에서 개발하는 대형 시스템 공학 프로젝트에 주로 쓰인다.", answer: true, explain: "계획 주도 특성이 작업 조율에 도움." },
  { kind: "short", id: "se-q-wf-5", concept: "waterfall", q: "검증(테스트)을 강화한 폭포수 모델의 변형은 ___ 모델이다. (영문 한 글자)", answers: ["v", "v모델", "v 모델", "v-model"], explain: "V-model." },
  { kind: "ox", id: "se-q-wf-6", concept: "waterfall", q: "폭포수 모델에서는 원칙적으로 앞 단계를 마치지 않아도 다음 단계를 시작할 수 있다.", answer: false, explain: "한 단계를 완료해야 다음 단계로." },
  { kind: "ox", id: "se-q-wf-7", concept: "waterfall", q: "안정적인 요구사항을 가진 업무 시스템은 드물다.", answer: true, explain: "Few business systems have stable requirements." },

  // incremental
  { kind: "mc", id: "se-q-in-1", concept: "incremental", q: "점증적 개발의 장점이 아닌 것은?", options: ["변경 수용 비용 감소", "고객 피드백이 쉽다", "더 빠른 인도", "시스템 구조가 점점 좋아진다"], answer: 3, explain: "증분이 더해질수록 구조는 저하되는 경향이 있다." },
  { kind: "mc", id: "se-q-in-2", concept: "incremental", q: "점증적 개발의 문제로 '관리자가 진척을 잴 정기 산출물이 부족한 것'을 무엇이라 하나?", options: ["프로세스가 가시적이지 않다", "구조 저하", "비용 증가", "요구 동결"], answer: 0, explain: "The process is not visible." },
  { kind: "ox", id: "se-q-in-3", concept: "incremental", q: "점증적 개발에서는 명세를 모두 끝낸 뒤에야 개발과 검증을 시작한다.", answer: false, explain: "명세·개발·검증이 교차(interleaved)한다. 명세를 먼저 다 끝내는 것은 폭포수." },
  { kind: "mc", id: "se-q-in-4", concept: "incremental", q: "점증적 개발에서 구조 저하를 막으려면 무엇에 시간과 돈을 써야 하는가?", options: ["리팩토링", "문서 삭제", "테스트 생략", "요구 동결"], answer: 0, explain: "Unless time and money is spent on refactoring, regular change tends to corrupt its structure." },
  { kind: "ox", id: "se-q-in-5", concept: "incremental", q: "점증적 개발은 반드시 애자일 방식이어야 한다.", answer: false, explain: "계획 주도일 수도 애자일일 수도 있다." },

  // integration-config
  { kind: "short", id: "se-q-ic-1", concept: "integration-config", q: "통합과 구성 모델에서 재사용하는 '상용 기성 시스템'의 약어는? (영문 4자)", answers: ["cots"], explain: "Commercial-Off-The-Shelf.", hint: "영문" },
  { kind: "mc", id: "se-q-ic-2", concept: "integration-config", q: "재사용 지향 SE의 단점은?", options: ["비용이 크게 는다", "요구사항 타협이 불가피하고, 재사용 요소의 진화를 통제할 수 없다", "인도가 느리다", "위험이 늘어난다"], answer: 1, explain: "단점 2개: 요구사항 타협(실제 요구 불만족 가능), 재사용 요소의 진화 통제 불가." },
  { kind: "mc", id: "se-q-ic-3", concept: "integration-config", q: "재사용 지향 SE의 주요 과정 순서로 옳은 것은?", options: ["요구 명세 → SW 발견·평가 → 요구 정제 → 응용 시스템 구성 → 컴포넌트 적응·통합", "요구 정제 → 요구 명세 → 구성 → 발견", "발견 → 통합 → 명세 → 정제", "구성 → 정제 → 명세 → 발견"], answer: 0, explain: "명세 → 발견·평가 → 정제 → 구성 → 적응·통합." },
  { kind: "mc", id: "se-q-ic-4", concept: "integration-config", q: "재사용 SW 유형이 아닌 것은?", options: ["독립형 응용 시스템(COTS)", ".NET·J2EE용 객체 모음", "원격 호출 가능한 웹 서비스", "폭포수 모델 문서"], answer: 3, explain: "재사용 SW 3유형: 독립형 응용(COTS), 객체 모음(.NET/J2EE), 웹 서비스." },
  { kind: "ox", id: "se-q-ic-5", concept: "integration-config", q: "재사용은 이제 많은 업무 시스템을 구축하는 표준 방식이다.", answer: true, explain: "Reuse is now the standard approach for building many types of business system." },
  { kind: "ox", id: "se-q-ic-6", concept: "integration-config", q: "재사용 지향 SE는 처음부터 개발하는 SW가 적어 비용과 위험이 줄어든다.", answer: true, explain: "장점 2개: 비용·위험 감소, 더 빠른 인도·배치." },

  // specification-re
  { kind: "mc", id: "se-q-sr-1", concept: "specification-re", q: "요구공학 과정의 순서로 옳은 것은?", options: ["명세 → 도출·분석 → 검증", "도출·분석 → 명세 → 검증", "검증 → 명세 → 도출", "명세 → 검증 → 도출"], answer: 1, explain: "Elicitation and analysis → Specification → Validation." },
  { kind: "mc", id: "se-q-sr-2", concept: "specification-re", q: "'이해관계자가 시스템에 무엇을 요구·기대하는가'를 다루는 요구공학 단계는?", options: ["Requirements elicitation and analysis", "Requirements specification", "Requirements validation", "Requirements refinement"], answer: 0, explain: "도출·분석 단계 — 이해관계자가 무엇을 요구·기대하는가." },
  { kind: "ox", id: "se-q-sr-3", concept: "specification-re", q: "SW 명세화는 필요한 서비스와 시스템 운영·개발의 제약을 정하는 과정이다.", answer: true, explain: "Specification = 필요한 서비스 + 운영·개발 제약을 정하는 과정." },
  { kind: "ox", id: "se-q-sr-4", concept: "specification-re", q: "4가지 기본 활동은 폭포수에서는 교차로, 점증적 개발에서는 순차로 조직된다.", answer: false, explain: "거꾸로다. 폭포수 = 순차, 점증적 = 교차." },

  // design-impl
  { kind: "mc", id: "se-q-di-1", concept: "design-impl", q: "'시스템 전체 구조, 주요 컴포넌트, 그 관계와 분산'을 정하는 설계 활동은?", options: ["Architectural design", "Database design", "Interface design", "Component selection"], answer: 0, explain: "Architectural design — 전체 구조, 주요 컴포넌트, 관계, 분산." },
  { kind: "mc", id: "se-q-di-2", concept: "design-impl", q: "'재사용 컴포넌트를 찾고, 없으면 동작 방식을 설계'하는 활동은?", options: ["Interface design", "Component selection and design", "Database design", "Debugging"], answer: 1, explain: "Component selection and design — 재사용 컴포넌트 탐색, 없으면 설계." },
  { kind: "ox", id: "se-q-di-3", concept: "design-impl", q: "프로그래밍은 표준 프로세스가 정해진 팀 활동이다.", answer: false, explain: "표준 프로세스가 없는 개인 활동." },
  { kind: "ox", id: "se-q-di-4", concept: "design-impl", q: "디버깅은 프로그램 결함을 찾아 고치는 활동이다.", answer: true, explain: "Debugging is the activity of finding program faults and correcting these faults." },
  { kind: "ox", id: "se-q-di-5", concept: "design-impl", q: "대부분의 SW에서 설계와 구현은 교차하는 활동이다.", answer: true, explain: "Design and implementation are interleaved activities for most types of software system." },

  // validation-testing
  { kind: "short", id: "se-q-vt-1", concept: "validation-testing", q: "'Verification and validation'의 약어는?", answers: ["v&v", "vv", "v & v"], explain: "검증 및 확인.", hint: "영문" },
  { kind: "mc", id: "se-q-vt-2", concept: "validation-testing", q: "가장 많이 쓰이는 V&V 활동은?", options: ["테스트", "코딩", "문서화", "배포"], answer: 0, explain: "Testing is the most commonly used V&V activity." },
  { kind: "mc", id: "se-q-vt-3", concept: "validation-testing", q: "창발적 속성(emergent properties)의 테스트가 특히 중요한 테스트 단계는?", options: ["컴포넌트 테스트", "시스템 테스트", "고객 테스트", "단위 테스트"], answer: 1, explain: "System testing — Testing of emergent properties is particularly important." },
  { kind: "mc", id: "se-q-vt-4", concept: "validation-testing", q: "'고객 데이터로 고객 요구를 만족하는지' 확인하는 테스트는?", options: ["컴포넌트 테스트", "시스템 테스트", "고객 테스트", "회귀 테스트"], answer: 2, explain: "Customer testing." },
  { kind: "ox", id: "se-q-vt-5", concept: "validation-testing", q: "컴포넌트 테스트에서 컴포넌트는 함수, 객체, 또는 그것들의 묶음일 수 있다.", answer: true, explain: "Components may be functions or objects or coherent groupings of these entities." },

  // evolution
  { kind: "ox", id: "se-q-ev-1", concept: "evolution", q: "완전히 새로운 시스템이 줄어들면서 개발과 진화(유지보수)의 구분이 점점 무의미해지고 있다.", answer: true, explain: "Fewer and fewer systems are completely new → 구분이 increasingly irrelevant." },
  { kind: "ox", id: "se-q-ev-2", concept: "evolution", q: "SW는 본래 경직되어 있어 바꾸기 어렵다.", answer: false, explain: "본래 유연하고 바뀔 수 있다." },

  // coping-change
  { kind: "mc", id: "se-q-cc-1", concept: "coping-change", q: "프로토타입으로 고객에게 핵심 기능을 미리 보여 주는 것은 어떤 방법인가?", options: ["변경 예측 (Change anticipation)", "변경 허용 (Change tolerance)", "변경 동결", "변경 회피만"], answer: 0, explain: "프로토타이핑 → 변경 예측(anticipation). 점증적 인도 → 변경 회피·허용." },
  { kind: "mc", id: "se-q-cc-2", concept: "coping-change", q: "점증적 인도가 지원하는 것은?", options: ["변경 예측만", "변경 회피와 변경 허용", "변경 금지", "변경 동결"], answer: 1, explain: "Incremental delivery supports both change avoidance and change tolerance." },
  { kind: "ox", id: "se-q-cc-3", concept: "coping-change", q: "변경 비용에는 재작업 비용과 새 기능을 구현하는 비용이 모두 포함된다.", answer: true, explain: "Costs of change = rework + implementing new functionality." },
  { kind: "ox", id: "se-q-cc-4", concept: "coping-change", q: "대형 SW 프로젝트에서 변경은 충분한 계획으로 완전히 없앨 수 있다.", answer: false, explain: "Change is inevitable." },
  { kind: "mc", id: "se-q-cc-5", concept: "coping-change", q: "변경 허용(change tolerance)이 보통 의존하는 개발 방식은?", options: ["폭포수", "점증적 개발", "code-and-fix", "V 모델"], answer: 1, explain: "변경 허용은 보통 점증적 개발 — 아직 안 만든 증분에 반영." },

  // prototyping
  { kind: "mc", id: "se-q-pt2-1", concept: "prototyping", q: "프로토타입의 쓰임으로 교안에 든 것이 아닌 것은?", options: ["요구 도출과 검증", "UI 설계 옵션 탐색", "back-to-back 테스트", "최종 제품으로 그대로 출시"], answer: 3, explain: "쓰임: 요구공학, 설계(UI), 테스트(back-to-back). 버림형은 제품으로 쓰면 안 된다." },
  { kind: "mc", id: "se-q-pt2-2", concept: "prototyping", q: "버림형 프로토타입을 제품의 기반으로 쓰지 말아야 하는 이유가 아닌 것은?", options: ["비기능 요구에 맞게 조정하기 어렵다", "보통 문서가 없다", "빠른 변경으로 구조가 저하되었다", "기능이 너무 많다"], answer: 3, explain: "이유 4개: 비기능 요구 조정 불가, 문서 없음, 구조 저하, 품질 표준 미달." },
  { kind: "ox", id: "se-q-pt2-3", concept: "prototyping", q: "프로토타입은 기능 요구보다 신뢰성·보안 같은 비기능 요구에 집중한다.", answer: false, explain: "반대다. 비기능보다 기능 요구에 집중한다." },
  { kind: "mc", id: "se-q-pt2-4", concept: "prototyping", q: "프로토타이핑의 이점이 아닌 것은?", options: ["사용성 향상", "설계 품질 향상", "개발 노력 감소", "문서 작성 의무화"], answer: 3, explain: "이점: 사용성·실제 요구 근접·설계 품질·유지보수성 향상, 개발 노력 감소." },
  { kind: "ox", id: "se-q-pt2-5", concept: "prototyping", q: "프로토타입은 이미 잘 이해된 부분에 집중해야 한다.", answer: false, explain: "잘 이해되지 않은 부분에 집중." },
  { kind: "mc", id: "se-q-pt2-6", concept: "prototyping", q: "프로토타입 개발 과정의 순서로 옳은 것은?", options: ["목표 수립 → 기능 정의 → 개발 → 평가", "개발 → 목표 → 평가 → 정의", "평가 → 개발 → 정의 → 목표", "정의 → 평가 → 목표 → 개발"], answer: 0, explain: "Establish objectives → Define functionality → Develop → Evaluate." },

  // incremental-delivery
  { kind: "mc", id: "se-q-id-1", concept: "incremental-delivery", q: "점증적 인도에서 앞 증분에 넣는 요구는?", options: ["우선순위가 가장 낮은 것", "우선순위가 가장 높은 것", "가장 쉬운 것", "무작위"], answer: 1, explain: "User requirements are prioritised, highest priority in early increments." },
  { kind: "ox", id: "se-q-id-2", concept: "incremental-delivery", q: "한 증분의 개발이 시작되면 그 증분의 요구사항은 동결된다.", answer: true, explain: "뒤 증분의 요구는 계속 진화할 수 있다." },
  { kind: "mc", id: "se-q-id-3", concept: "incremental-delivery", q: "점증적 인도의 장점이 아닌 것은?", options: ["기능을 더 일찍 사용", "앞 증분이 프로토타입 역할", "전체 실패 위험 감소", "공통 기능을 미리 쉽게 파악"], answer: 3, explain: "공통 기능 파악이 어렵다는 것이 문제점." },
  { kind: "ox", id: "se-q-id-4", concept: "incremental-delivery", q: "점증적 인도에서는 우선순위가 가장 높은 서비스가 가장 많이 테스트된다.", answer: true, explain: "앞 증분부터 계속 쓰이므로 가장 많이 테스트된다." },
  { kind: "mc", id: "se-q-id-5", concept: "incremental-delivery", q: "점증적 인도가 조직의 조달 모델과 충돌하는 이유는?", options: ["조달 모델은 전체 명세를 계약의 일부로 요구하기 때문", "조달 모델에는 계약이 없기 때문", "증분이 너무 크기 때문", "고객이 없기 때문"], answer: 0, explain: "반복 프로세스는 명세를 SW와 함께 개발 → 전체 명세를 요구하는 조달 계약과 충돌." },
  { kind: "ox", id: "se-q-id-6", concept: "incremental-delivery", q: "점증적 인도는 기존 시스템을 대체하는 시스템에 특히 쉽게 적용된다.", answer: false, explain: "증분이 기존 시스템보다 기능이 적어 대체 시스템에는 어렵다." },

  // process-improvement
  { kind: "mc", id: "se-q-pi-1", concept: "process-improvement", q: "프로세스 개선 주기의 순서는?", options: ["Measure → Analyze → Change", "Change → Measure → Analyze", "Analyze → Change → Measure", "Plan → Do → Check"], answer: 0, explain: "측정 → 분석 → 변경 → (다시 측정)." },
  { kind: "mc", id: "se-q-pi-2", concept: "process-improvement", q: "프로세스 개선 접근 중 '반복 개발과 오버헤드 감소'에 초점을 둔 것은?", options: ["프로세스 성숙도 접근", "애자일 접근", "폭포수 접근", "CMM 접근"], answer: 1, explain: "애자일 접근 = 반복 개발 + 오버헤드 감소. 성숙도 접근 = 관리 개선·좋은 실천." },
  { kind: "ox", id: "se-q-pi-3", concept: "process-improvement", q: "프로세스 측정 결과가 프로세스 개선을 이끄는 동인이 되어야 한다.", answer: false, explain: "개선의 동인은 조직의 목표다." },
  { kind: "mc", id: "se-q-pi-4", concept: "process-improvement", q: "프로세스 지표(process metrics)의 예가 아닌 것은?", options: ["활동 완료 시간", "필요한 자원(person-days)", "발견된 결함 수", "개발자의 나이"], answer: 3, explain: "지표: 시간, 자원(person-days), 사건 수(결함 수)." },
  { kind: "mc", id: "se-q-pi-5", concept: "process-improvement", q: "현재 프로세스를 평가해 약점과 병목을 찾고 프로세스 맵을 만드는 활동은?", options: ["Process measurement", "Process analysis", "Process change", "Process enactment"], answer: 1, explain: "Process analysis — 약점·병목, process maps." },
  { kind: "ox", id: "se-q-pi-6", concept: "process-improvement", q: "프로세스 측정은 개선이 효과적이었는지 판단할 기준선(baseline)을 만든다.", answer: true, explain: "These measurements form a baseline." },

  // cmm
  { kind: "mc", id: "se-q-cm-1", concept: "cmm", q: "SEI CMM 성숙도 수준의 순서로 옳은 것은?", options: ["Initial → Repeatable → Defined → Managed → Optimising", "Initial → Defined → Repeatable → Managed → Optimising", "Repeatable → Initial → Defined → Optimising → Managed", "Defined → Initial → Managed → Repeatable → Optimising"], answer: 0, explain: "I-R-D-M-O: Initial, Repeatable, Defined, Managed, Optimising." },
  { kind: "mc", id: "se-q-cm-2", concept: "cmm", q: "'품질 관리 전략이 정의되어 사용되는' 수준은?", options: ["Repeatable", "Defined", "Managed", "Optimising"], answer: 2, explain: "Managed — Quality management strategies defined and used." },
  { kind: "mc", id: "se-q-cm-3", concept: "cmm", q: "'본질적으로 통제되지 않는' 수준은?", options: ["Initial", "Repeatable", "Defined", "Managed"], answer: 0, explain: "Initial — Essentially uncontrolled." },
  { kind: "short", id: "se-q-cm-4", concept: "cmm", q: "'프로세스 개선 전략이 정의되어 사용되는' 가장 높은 수준의 이름은? (영어)", answers: ["optimising", "optimizing", "최적화"], explain: "Optimising — Process improvement strategies defined and used." },
  { kind: "ox", id: "se-q-cm-5", concept: "cmm", q: "Repeatable 수준에서는 품질 관리 전략이 정의되어 사용된다.", answer: false, explain: "Repeatable은 제품 관리 절차. 품질 관리 전략은 Managed." },
];
