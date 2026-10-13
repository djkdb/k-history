import type { Question } from "@/lib/types";

/* agile · scrum · devops · risk · people */
export const QUESTIONS_2: Question[] = [
  // agile-background
  { kind: "mc", id: "se-q-ab-1", concept: "agile-background", q: "애자일 방법이 등장한 시기는?", options: ["1960년대", "1970년대 초", "1990년대 후반", "2010년대"], answer: 2, explain: "Emerged in the late 1990s." },
  { kind: "mc", id: "se-q-ab-2", concept: "agile-background", q: "애자일 개발의 특징이 아닌 것은?", options: ["명세·설계·구현이 교차", "잦은 새 버전 인도", "자동 테스트 같은 도구 지원", "포괄적이고 상세한 문서 작성"], answer: 3, explain: "최소한의 문서 — 동작하는 코드에 집중." },
  { kind: "ox", id: "se-q-ab-3", concept: "agile-background", q: "애자일은 1980~90년대 설계 방법의 오버헤드에 대한 불만에서 생겨났다.", answer: true, explain: "Dissatisfaction with the overheads ... of the 1980s and 1990s led to agile methods." },
  { kind: "ox", id: "se-q-ab-4", concept: "agile-background", q: "애자일 방법은 코드보다 설계에 집중한다.", answer: false, explain: "설계보다 코드에 집중한다." },
  { kind: "ox", id: "se-q-ab-5", concept: "agile-background", q: "빠르게 변하는 비즈니스 환경에서는 안정된 요구사항 집합을 만드는 것이 사실상 불가능하다.", answer: true, explain: "그래서 신속한 개발·인도가 가장 중요한 요구가 되었다." },

  // agile-manifesto
  { kind: "mc", id: "se-q-am-1", concept: "agile-manifesto", q: "애자일 선언문의 내용으로 옳은 것은?", options: ["프로세스와 도구 > 개인과 상호작용", "포괄적인 문서 > 동작하는 SW", "고객과의 협력 > 계약 협상", "계획을 따르기 > 변화에 대응"], answer: 2, explain: "선언문 4줄: 개인과 상호작용 > 프로세스와 도구, 동작하는 SW > 문서, 고객 협력 > 계약 협상, 변화 대응 > 계획 따르기." },
  { kind: "ox", id: "se-q-am-2", concept: "agile-manifesto", q: "애자일 선언문은 오른쪽 항목(프로세스, 문서, 계약, 계획)에 가치가 없다고 선언한다.", answer: false, explain: "오른쪽에도 가치가 있지만 왼쪽을 더 가치 있게 여긴다." },
  { kind: "short", id: "se-q-am-3", concept: "agile-manifesto", q: "애자일 선언문: Working software over comprehensive ________. (영어 한 단어)", answers: ["documentation", "문서"], explain: "Working software over comprehensive documentation." },
  { kind: "ox", id: "se-q-am-4", concept: "agile-manifesto", q: "애자일 선언문은 계획을 따르는 것보다 변화에 대응하는 것을 더 가치 있게 여긴다.", answer: true, explain: "Responding to change over following a plan." },

  // agile-principles
  { kind: "mc", id: "se-q-ap-1", concept: "agile-principles", q: "애자일 방법의 원칙이 아닌 것은?", options: ["Customer involvement", "Embrace change", "Maintain simplicity", "Comprehensive documentation"], answer: 3, explain: "5원칙: 고객 참여, 점증적 인도, 변화 수용, 단순성 유지, 프로세스가 아닌 사람." },
  { kind: "mc", id: "se-q-ap-2", concept: "agile-principles", q: "'팀의 기술을 인정·활용하고 규정된 프로세스 없이 자기 방식을 개발하게 한다'는 원칙은?", options: ["People not process", "Incremental delivery", "Embrace change", "Customer involvement"], answer: 0, explain: "People not process(프로세스가 아닌 사람)." },
  { kind: "mc", id: "se-q-ap-3", concept: "agile-principles", q: "애자일이 잘 적용되는 경우는?", options: ["외부 규제가 많은 대형 시스템", "판매용 중소 규모 제품 개발", "고객이 참여를 거부하는 프로젝트", "수십 년 수명의 안전 필수 시스템"], answer: 1, explain: "판매용 중소 제품, 고객 참여 약속이 있고 외부 규제가 적은 사내 맞춤 시스템." },
  { kind: "ox", id: "se-q-ap-4", concept: "agile-principles", q: "조직 내 맞춤형 시스템에 애자일을 쓰려면 고객의 참여 약속이 있고 외부 규칙·규제가 적어야 한다.", answer: true, explain: "Agile method applicability — custom system development 조건 그대로." },
  { kind: "ox", id: "se-q-ap-5", concept: "agile-principles", q: "'Embrace change'는 요구사항이 바뀌지 않도록 막는다는 뜻이다.", answer: false, explain: "요구가 바뀔 것을 예상하고 수용하도록 설계한다는 뜻." },

  // xp
  { kind: "mc", id: "se-q-xp-1", concept: "xp", q: "XP에서 증분을 고객에게 인도하는 주기는?", options: ["매일", "2주마다", "6개월마다", "1년마다"], answer: 1, explain: "새 버전은 하루에도 여러 번 빌드, 증분은 2주마다 인도." },
  { kind: "mc", id: "se-q-xp-2", concept: "xp", q: "'개발자 누구나 시스템의 어떤 코드든 바꿀 수 있다'는 XP 실천은?", options: ["Collective ownership", "Simple design", "Small releases", "Sustainable pace"], answer: 0, explain: "Collective ownership — Anyone can change anything." },
  { kind: "mc", id: "se-q-xp-3", concept: "xp", q: "'과도한 초과 근무는 코드 품질과 중기 생산성을 떨어뜨리므로 허용하지 않는다'는 XP 실천은?", options: ["Sustainable pace", "On-site customer", "Pair programming", "Refactoring"], answer: 0, explain: "Sustainable pace(유지할 수 있는 속도)." },
  { kind: "mc", id: "se-q-xp-4", concept: "xp", q: "'태스크가 끝나는 즉시 전체 시스템에 통합하고, 이후 모든 단위 테스트를 통과해야 한다'는 실천은?", options: ["Continuous integration", "Incremental planning", "Simple design", "Collective ownership"], answer: 0, explain: "Continuous integration(연속적 통합)." },
  { kind: "ox", id: "se-q-xp-5", concept: "xp", q: "XP의 Simple design은 미래 요구까지 고려해 충분히 많은 설계를 미리 해 두는 것이다.", answer: false, explain: "현재 요구를 만족할 만큼만, 그 이상은 하지 않는다." },
  { kind: "ox", id: "se-q-xp-6", concept: "xp", q: "XP에서는 빌드마다 모든 테스트를 실행하고 테스트가 성공해야만 빌드를 수용한다.", answer: true, explain: "XP의 '극단적' 반복 개발 특징 중 하나." },
  { kind: "mc", id: "se-q-xp-7", concept: "xp", q: "XP의 On-site customer에 대한 설명으로 옳은 것은?", options: ["고객은 계약 때만 만난다", "최종 사용자 대표가 XP 팀에 풀타임으로 참여한다", "고객은 테스트에만 참여한다", "고객이 코드를 직접 짠다"], answer: 1, explain: "On-site customer — 고객이 개발팀의 일원으로 요구를 가져온다." },
  { kind: "ox", id: "se-q-xp-8", concept: "xp", q: "XP의 점진적 계획에서 요구사항은 상세한 요구사항 명세서(SRS)에 기록된다.", answer: false, explain: "스토리 카드에 기록한다." },

  // xp-agile-mapping
  { kind: "mc", id: "se-q-xm-1", concept: "xp-agile-mapping", q: "XP에서 '단순성 유지' 원칙을 지원하는 실천은?", options: ["지속적 리팩토링", "풀타임 고객", "정기 릴리스", "작은 릴리스"], answer: 0, explain: "Maintaining simplicity through constant refactoring of code." },
  { kind: "ox", id: "se-q-xm-2", concept: "xp-agile-mapping", q: "XP는 원래 정의된 형태 그대로 대부분의 조직에서 널리 쓰인다.", answer: false, explain: "기술 중심이라 관리 실천과 통합이 어려워, 원래 형태는 널리 쓰이지 않는다." },
  { kind: "mc", id: "se-q-xm-3", concept: "xp-agile-mapping", q: "널리 쓰이는 핵심 XP 실천이 아닌 것은?", options: ["사용자 스토리", "리팩토링", "테스트 우선 개발", "현장 고객 풀타임 상주"], answer: 3, explain: "핵심 4개: 사용자 스토리, 리팩토링, 테스트 우선 개발, 짝 프로그래밍." },
  { kind: "ox", id: "se-q-xm-4", concept: "xp-agile-mapping", q: "'프로세스가 아닌 사람' 원칙은 짝 프로그래밍, 공동 소유권, 장시간 근무를 피하는 프로세스로 지원된다.", answer: true, explain: "People not process ← pair programming, collective ownership, 장시간 근무 회피." },

  // user-stories
  { kind: "mc", id: "se-q-us-1", concept: "user-stories", q: "XP에서 다음 릴리스에 넣을 스토리를 고르는 사람은?", options: ["개발자", "고객", "스크럼 마스터", "테스터"], answer: 1, explain: "고객이 우선순위와 일정 추정을 보고 고른다." },
  { kind: "mc", id: "se-q-us-2", concept: "user-stories", q: "일정과 비용 추정의 기초가 되는 것은?", options: ["스토리 카드에서 분해한 구현 태스크", "애자일 선언문", "CMM 수준", "테스트 결과"], answer: 0, explain: "These tasks are the basis of schedule and cost estimates." },
  { kind: "ox", id: "se-q-us-3", concept: "user-stories", q: "XP에서 사용자 요구사항은 사용자 스토리 또는 시나리오로 표현된다.", answer: true, explain: "User requirements are expressed as user stories or scenarios." },

  // refactoring
  { kind: "mc", id: "se-q-rf-1", concept: "refactoring", q: "XP가 '변경을 위한 설계'보다 리팩토링을 택하는 이유는?", options: ["변경을 믿을 만하게 예측할 수 없으므로", "설계가 너무 싸서", "리팩토링은 테스트가 필요 없어서", "문서가 많아져서"], answer: 0, explain: "XP maintains that this is not worthwhile as changes cannot be reliably anticipated." },
  { kind: "mc", id: "se-q-rf-2", concept: "refactoring", q: "리팩토링의 예가 아닌 것은?", options: ["중복 코드를 없애려 클래스 계층 재조직", "속성·메서드 정리와 이름 바꾸기", "인라인 코드를 라이브러리 메서드 호출로 교체", "새 기능 추가"], answer: 3, explain: "리팩토링은 기능을 바꾸지 않고 구조를 개선한다." },
  { kind: "ox", id: "se-q-rf-3", concept: "refactoring", q: "리팩토링은 SW의 이해도를 높여 문서의 필요를 줄인다.", answer: true, explain: "This improves the understandability of the software and so reduces the need for documentation." },
  { kind: "ox", id: "se-q-rf-4", concept: "refactoring", q: "아키텍처 수준의 리팩토링은 코드 수준 리팩토링보다 훨씬 싸다.", answer: false, explain: "훨씬 비싸다." },
  { kind: "ox", id: "se-q-rf-5", concept: "refactoring", q: "XP에서는 당장 필요가 없어도 개선할 수 있는 곳을 찾으면 리팩토링한다.", answer: true, explain: "Make improvements even where there is no immediate need for them." },

  // test-first
  { kind: "mc", id: "se-q-tf-1", concept: "test-first", q: "테스트 주도 개발에서 테스트를 작성하는 형태는?", options: ["종이에 적은 데이터", "자동 실행 가능한 프로그램", "구두 설명", "엑셀 표"], answer: 1, explain: "Tests are written as programs rather than data." },
  { kind: "short", id: "se-q-tf-2", concept: "test-first", q: "교안에서 예로 든 자동 테스트 프레임워크는? (영어)", answers: ["junit", "j unit"], explain: "JUnit (https://junit.org).", hint: "영문" },
  { kind: "mc", id: "se-q-tf-3", concept: "test-first", q: "XP 테스트에서 고객의 역할은?", options: ["단위 테스트 코드 작성", "다음 릴리스 스토리의 인수 테스트 개발을 돕기", "테스트 자동화 도구 설치", "테스트 생략 결정"], answer: 1, explain: "Customer helps develop acceptance tests for the stories in the next release." },
  { kind: "mc", id: "se-q-tf-4", concept: "test-first", q: "테스트 우선 개발의 문제점이 아닌 것은?", options: ["프로그래머가 테스트를 대충 쓴다", "복잡한 UI의 표시 로직은 점진적으로 테스트하기 어렵다", "테스트 집합의 완전성 판단이 어렵다", "요구사항이 더 모호해진다"], answer: 3, explain: "테스트를 먼저 쓰면 요구사항이 오히려 명확해진다." },
  { kind: "ox", id: "se-q-tf-5", concept: "test-first", q: "새 기능을 넣을 때는 새 테스트만 실행하고 이전 테스트는 실행하지 않는다.", answer: false, explain: "이전·새 테스트를 모두 자동 실행해 새 오류를 잡는다." },
  { kind: "ox", id: "se-q-tf-6", concept: "test-first", q: "시스템 테스트가 많으면 완전한 테스트 커버리지가 보장된다.", answer: false, explain: "많아도 완전한 커버리지를 보장하지 않는다." },

  // pair-programming
  { kind: "mc", id: "se-q-pp-1", concept: "pair-programming", q: "짝 프로그래밍의 이점이 아닌 것은?", options: ["코드 공동 소유와 지식 확산", "비공식 검토 역할", "리팩토링 장려", "항상 개발 인원을 절반으로 줄임"], answer: 3, explain: "이점: 공동 소유·지식 확산, 비공식 검토, 리팩토링 장려, 이탈 위험 감소." },
  { kind: "ox", id: "se-q-pp-2", concept: "pair-programming", q: "짝 프로그래밍의 짝은 프로젝트 내내 고정된다.", answer: false, explain: "동적으로 만들어져 모든 팀원이 서로 함께 일한다." },
  { kind: "ox", id: "se-q-pp-3", concept: "pair-programming", q: "짝 프로그래밍의 지식 공유는 팀원이 떠날 때 프로젝트의 전체 위험을 줄인다.", answer: true, explain: "Sharing knowledge reduces the overall risks to a project when team members leave." },
  { kind: "ox", id: "se-q-pp-4", concept: "pair-programming", q: "짝 프로그래밍은 항상 두 명이 따로 일하는 것보다 비효율적이다.", answer: false, explain: "더 효율적이라는 근거도 있다 (고수끼리면 비효율일 수도)." },

  // agile-pm
  { kind: "mc", id: "se-q-pm2-1", concept: "agile-pm", q: "SW 프로젝트 관리자의 주된 책임은?", options: ["코드를 가장 많이 작성", "SW를 제때 계획된 예산 안에서 인도", "테스트를 생략", "고객과의 접촉 차단"], answer: 1, explain: "Delivered on time and within the planned budget." },
  { kind: "ox", id: "se-q-pm2-2", concept: "agile-pm", q: "프로젝트 관리의 표준 접근은 애자일이다.", answer: false, explain: "표준 접근은 계획 주도." },

  // scrum
  { kind: "mc", id: "se-q-sc-1", concept: "scrum", q: "스크럼의 세 단계 순서로 옳은 것은?", options: ["개요 계획 → 스프린트 주기 → 프로젝트 종료", "스프린트 → 개요 계획 → 종료", "종료 → 계획 → 스프린트", "계획 → 종료 → 스프린트"], answer: 0, explain: "Outline planning → Sprint cycles → Project closure." },
  { kind: "mc", id: "se-q-sc-2", concept: "scrum", q: "스크럼에 대한 설명으로 옳은 것은?", options: ["특정 코딩 실천을 규정한다", "반복 개발의 관리에 초점을 둔 프로젝트 관리 프레임워크다", "폭포수 모델의 일종이다", "문서 작성 방법론이다"], answer: 1, explain: "Scrum focuses on managing iterative development rather than specific agile practices." },
  { kind: "mc", id: "se-q-sc-3", concept: "scrum", q: "스크럼의 프로젝트 종료 단계에서 하는 일이 아닌 것은?", options: ["사용자 매뉴얼 등 문서 완성", "교훈 평가", "SW 아키텍처 처음 설계", "프로젝트 마무리"], answer: 2, explain: "아키텍처 설계는 첫 개요 계획 단계." },
  { kind: "ox", id: "se-q-sc-4", concept: "scrum", q: "스크럼에서는 불안정한 요구사항이 진행을 막지 않는다.", answer: true, explain: "Unstable requirements do not hold up progress — 스크럼의 이점." },
  { kind: "mc", id: "se-q-sc-5", concept: "scrum", q: "스크럼의 이점이 아닌 것은?", options: ["제품을 관리 가능한 덩어리로 나눈다", "팀 전체가 모든 것을 볼 수 있다", "고객과 개발자 사이 신뢰가 생긴다", "상세한 사전 명세가 보장된다"], answer: 3, explain: "스크럼은 상세 사전 명세를 보장하지 않는다 — 백로그로 점진적으로." },

  // scrum-terms
  { kind: "mc", id: "se-q-st-1", concept: "scrum-terms", q: "스크럼에서 스프린트의 일반적인 길이는?", options: ["1일", "2~4주", "6개월", "1년"], answer: 1, explain: "Sprints are usually 2–4 weeks long, fixed length." },
  { kind: "short", id: "se-q-st-2", concept: "scrum-terms", q: "스크럼 개발팀은 최대 몇 명 이하여야 하는가?", answers: ["7", "7명"], explain: "Development team: no more than 7 people.", hint: "숫자" },
  { kind: "mc", id: "se-q-st-3", concept: "scrum-terms", q: "'제품 기능·요구를 찾고 우선순위를 정하며 백로그를 계속 검토하는' 역할은?", options: ["Scrum Master", "Product owner", "Development team", "Stakeholder"], answer: 1, explain: "Product owner — 기능 식별, 우선순위, 백로그 검토." },
  { kind: "mc", id: "se-q-st-4", concept: "scrum-terms", q: "'한 스프린트에 처리할 수 있는 백로그 노력의 추정치'는?", options: ["Velocity", "Backlog", "Sprint", "Increment"], answer: 0, explain: "Velocity(속도)." },
  { kind: "ox", id: "se-q-st-5", concept: "scrum-terms", q: "스크럼 마스터는 프로젝트 관리자와 같은 역할이다.", answer: false, explain: "스크럼 개발자들은 스크럼 마스터를 프로젝트 관리자로 생각해선 안 된다고 단호하다." },
  { kind: "mc", id: "se-q-st-6", concept: "scrum-terms", q: "'스크럼 팀이 처리해야 할 to do 항목 목록'은?", options: ["Product backlog", "Sprint review", "Velocity", "Scrum board"], answer: 0, explain: "Product backlog — 'to do' 항목 목록." },
  { kind: "ox", id: "se-q-st-7", concept: "scrum-terms", q: "'Potentially shippable product increment'는 테스트 같은 추가 작업 없이 최종 제품에 넣을 수 있는 완성 상태를 뜻한다.", answer: true, explain: "실제로는 늘 가능하진 않다." },
  { kind: "ox", id: "se-q-st-8", concept: "scrum-terms", q: "스크럼(Scrum)은 한 달에 한 번 여는 긴 정기 회의다.", answer: false, explain: "매일 여는 짧은 대면 회의." },
  { kind: "ox", id: "se-q-st-9", concept: "scrum-terms", q: "Product owner는 반드시 개발팀 안의 개발자가 맡아야 한다.", answer: false, explain: "고객일 수도, SW 회사의 제품 관리자나 다른 이해관계자 대표일 수도 있다." },

  // sprint-cycle
  { kind: "mc", id: "se-q-sp-1", concept: "sprint-cycle", q: "스프린트 개발 중 팀과 외부(고객·조직)의 소통은 누구를 거치는가?", options: ["Product owner", "Scrum master", "CEO", "고객 대표"], answer: 1, explain: "팀은 격리되고 스크럼 마스터가 외부 방해로부터 보호한다." },
  { kind: "mc", id: "se-q-sp-2", concept: "sprint-cycle", q: "스크럼 보드의 열 순서로 옳은 것은?", options: ["Story → To do → In progress → Testing → Done", "To do → Story → Done → Testing", "Done → Testing → To do", "In progress → Story → To do → Done"], answer: 0, explain: "Story(backlog) → To do → In progress → Testing → Done." },
  { kind: "mc", id: "se-q-sp-3", concept: "sprint-cycle", q: "일일 스크럼 회의에서 공유하지 않는 것은?", options: ["지난 회의 이후의 진척", "생긴 문제", "다음 날 계획", "개인 연봉 협상"], answer: 3, explain: "공유: 진척, 문제, 다음 날 계획." },
  { kind: "ox", id: "se-q-sp-4", concept: "sprint-cycle", q: "스프린트 계획의 출발점은 제품 백로그다.", answer: true, explain: "The starting point for planning is the product backlog." },
  { kind: "ox", id: "se-q-sp-5", concept: "sprint-cycle", q: "스프린트에서 개발할 기능은 스크럼 마스터 혼자 선택한다.", answer: false, explain: "프로젝트 팀 전체가 고객과 함께 선택한다." },
  { kind: "mc", id: "se-q-sp-6", concept: "sprint-cycle", q: "스크럼 마스터가 촉진자로서 하는 일이 아닌 것은?", options: ["일일 회의 준비", "백로그 추적", "결정 기록", "개발자에게 코딩 방식을 지시"], answer: 3, explain: "촉진자: 일일 회의 준비, 백로그 추적, 결정 기록, 진척 측정, 외부 소통. 지시하는 관리자가 아니다." },

  // scaling-agile
  { kind: "mc", id: "se-q-sa-1", concept: "scaling-agile", q: "'작은 팀으로 개발할 수 없는 대형 SW 시스템에 애자일을 쓰는 것'은?", options: ["Scaling up", "Scaling out", "Scaling down", "Scaling in"], answer: 0, explain: "Scaling up = 대형 시스템." },
  { kind: "mc", id: "se-q-sa-2", concept: "scaling-agile", q: "'오랜 개발 경험이 있는 대형 조직 전체에 애자일을 도입하는 것'은?", options: ["Scaling up", "Scaling out", "Refactoring", "Pair programming"], answer: 1, explain: "Scaling out = 대형 조직." },
  { kind: "mc", id: "se-q-sa-3", concept: "scaling-agile", q: "애자일 계약 문제의 해법으로 교안이 제시한 것은?", options: ["기능이 아니라 개발자 시간에 대해 지불하는 계약", "모든 명세를 미리 고정한 계약", "계약 없이 진행", "고정 가격 계약"], answer: 0, explain: "다만 법무팀은 고위험으로 본다." },
  { kind: "ox", id: "se-q-sa-4", concept: "scaling-agile", q: "애자일은 신규 개발보다 유지보수에 더 적합하다.", answer: false, explain: "신규 개발에 더 적합하다 — 그런데 대기업 비용 대부분은 유지보수." },
  { kind: "mc", id: "se-q-sa-5", concept: "scaling-agile", q: "애자일을 확장할 때 지켜야 할 애자일 기본이 아닌 것은?", options: ["유연한 계획", "잦은 릴리스", "지속적 통합", "상세한 사전 설계 문서"], answer: 3, explain: "기본: 유연한 계획, 잦은 릴리스, 지속적 통합, TDD, 좋은 팀 소통." },
  { kind: "ox", id: "se-q-sa-6", concept: "scaling-agile", q: "애자일의 비공식성은 대기업이 흔히 쓰는 법적 계약 정의 방식과 잘 맞는다.", answer: false, explain: "맞지 않는다." },

  // agile-maintenance
  { kind: "mc", id: "se-q-ma-1", concept: "agile-maintenance", q: "애자일 유지보수의 핵심 문제가 아닌 것은?", options: ["제품 문서 부족", "고객 참여 유지", "개발팀 연속성 유지", "코드가 너무 길다"], answer: 3, explain: "핵심 문제: 제품 문서 부족, 고객 참여 유지, 팀 연속성." },
  { kind: "ox", id: "se-q-ma-2", concept: "agile-maintenance", q: "대부분의 조직은 신규 개발보다 기존 SW 유지보수에 더 많은 비용을 쓴다.", answer: true, explain: "그래서 애자일이 성공하려면 유지보수도 지원해야 한다." },

  // agile-vs-plan-choice
  { kind: "mc", id: "se-q-vp-1", concept: "agile-vs-plan-choice", q: "구현 전에 매우 상세한 명세와 설계가 중요하다면 어떤 방식이 적합한가?", options: ["계획 주도", "애자일", "code-and-fix", "XP"], answer: 0, explain: "상세한 명세·설계가 중요 → 계획 주도." },
  { kind: "mc", id: "se-q-vp-2", concept: "agile-vs-plan-choice", q: "다음 중 계획 주도 쪽으로 기울게 하는 '시스템 이슈'는?", options: ["작은 co-located 팀", "외부 규제를 받는 시스템", "짧은 수명", "빠른 피드백이 가능"], answer: 1, explain: "규제받으면 안전 사례용 상세 문서가 필요하다." },
  { kind: "ox", id: "se-q-vp-3", concept: "agile-vs-plan-choice", q: "팀이 분산되어 있으면 설계 문서가 필요할 수 있다.", answer: true, explain: "People and teams issues — 분산 팀은 설계 문서가 필요할 수 있다." },
  { kind: "ox", id: "se-q-vp-4", concept: "agile-vs-plan-choice", q: "수명이 긴 시스템일수록 문서가 덜 필요하다.", answer: false, explain: "지원팀에 의도를 전할 문서가 필요하다." },
  { kind: "mc", id: "se-q-vp-5", concept: "agile-vs-plan-choice", q: "'점증적 인도' 원칙이 조직 실천과 충돌하는 이유는?", options: ["마케팅·비즈니스의 장기 계획과 맞지 않을 수 있어서", "고객이 너무 많아서", "도구가 없어서", "테스트가 많아서"], answer: 0, explain: "마케팅은 몇 달 전에 기능을 알아야 캠페인을 준비할 수 있다." },
  { kind: "ox", id: "se-q-vp-6", concept: "agile-vs-plan-choice", q: "애자일이 계획 기반보다 더 높은 기술 수준을 요구한다는 주장이 있다.", answer: true, explain: "계획 기반은 상세 설계를 코드로 옮기기만 하면 되기 때문." },

  // large-systems
  { kind: "mc", id: "se-q-ls-1", concept: "large-systems", q: "다중 팀 스크럼에서 '팀 대표들이 매일 모여 진척을 논의'하는 것은?", options: ["Scrum of Scrums", "Release alignment", "Role replication", "Sprint review"], answer: 0, explain: "Scrum of Scrums — 팀 대표들의 일일 회의." },
  { kind: "mc", id: "se-q-ls-2", concept: "large-systems", q: "다중 팀 스크럼의 요소가 아닌 것은?", options: ["Role replication", "Product architects", "Release alignment", "Single global scrum master"], answer: 3, explain: "팀마다 PO와 SM을 둔다(역할 복제)." },
  { kind: "ox", id: "se-q-ls-3", concept: "large-systems", q: "대형 시스템은 이해관계자가 다양해 모두를 개발에 참여시키기가 사실상 불가능하다.", answer: true, explain: "대형 시스템의 어려움 중 하나 — diverse set of stakeholders." },
  { kind: "ox", id: "se-q-ls-4", concept: "large-systems", q: "대형 시스템은 개발 기간이 짧아 일관된 팀을 유지하기 쉽다.", answer: false, explain: "조달·개발 기간이 길어 팀을 유지하기 어렵다." },

  // why-devops
  { kind: "mc", id: "se-q-wd-1", concept: "why-devops", q: "DevOps가 연결하는 세 가지는?", options: ["개발, 운영, 사용자 피드백", "설계, 코딩, 문서", "고객, 법무, 마케팅", "HW, SW, 네트워크"], answer: 0, explain: "Interconnect Development(Dev), Operations(Ops), and user feedbacks." },
  { kind: "mc", id: "se-q-wd-2", concept: "why-devops", q: "DevOps가 기반으로 하는 방법은?", options: ["폭포수와 V 모델", "애자일과 린", "CMM과 PMBOK", "COTS와 재사용"], answer: 1, explain: "Based on Agile and Lean methods." },
  { kind: "mc", id: "se-q-wd-3", concept: "why-devops", q: "DevOps를 '문화 운동(cultural movement)'으로 정의한 출처는?", options: ["Wikipedia", "IBM", "O'Reilly", "IEEE"], answer: 2, explain: "O'Reilly: a cultural movement. Wikipedia·IBM은 통합·자동화, IEEE는 원칙과 실천." },
  { kind: "ox", id: "se-q-wd-4", concept: "why-devops", q: "사일로 기반 개발은 각 단계 사이의 상호작용이 활발하다.", answer: false, explain: "상호작용이 없다 — 그게 문제." },
  { kind: "ox", id: "se-q-wd-5", concept: "why-devops", q: "24시간 고객 서비스를 제공하는 Amazon, Google, Netflix 같은 조직이 DevOps를 적용했다.", answer: true, explain: "DevOps application trend — 24/7 서비스 조직." },

  // lean
  { kind: "short", id: "se-q-ln-1", concept: "lean", q: "린 SW 개발의 슬로건: Think Big, Act Small, Fail Fast, Learn ______. (영어 한 단어)", answers: ["rapidly", "빠르게"], explain: "Think Big, Act Small, Fail Fast, Learn Rapidly.", hint: "영문" },
  { kind: "mc", id: "se-q-ln-2", concept: "lean", q: "린 SW 개발의 7원칙이 아닌 것은?", options: ["낭비를 제거하라", "최대한 늦게 결정하라", "최대한 빨리 배포하라", "최대한 빨리 결정하라"], answer: 3, explain: "결정은 최대한 늦게." },
  { kind: "ox", id: "se-q-ln-3", concept: "lean", q: "린 개발은 소프트웨어 개발에서 처음 시작해 나중에 제조업으로 퍼졌다.", answer: false, explain: "거꾸로다. 제조업에 처음 적용되고 지금은 관리·UX·스타트업·SW 개발로." },
  { kind: "ox", id: "se-q-ln-4", concept: "lean", q: "린 SW 개발은 기능을 늘려 가치를 만드는 방식을 최적화한다.", answer: false, explain: "낭비를 줄여 가치를 만드는 방식을 최적화한다." },

  // devops-principles
  { kind: "mc", id: "se-q-dp-1", concept: "devops-principles", q: "CI/CD 파이프라인의 핵심 요소이며 사람의 실수를 줄이는 DevOps 원칙은?", options: ["Automation", "Collaboration", "Customer-centric action", "Create with end in mind"], answer: 0, explain: "Automation — CI/CD 파이프라인의 핵심, 사람의 실수 감소." },
  { kind: "mc", id: "se-q-dp-2", concept: "devops-principles", q: "'거품 속에서 만들지 말라(don't build in a bubble)'는 DevOps 원칙은?", options: ["Continuous improvement", "Create with end in mind", "Automation", "Collaboration"], answer: 1, explain: "Create with end in mind — 가정에 기반해 만들지 말 것." },
  { kind: "mc", id: "se-q-dp-3", concept: "devops-principles", q: "Improvement Kata와 관련된 DevOps 원칙은?", options: ["Continuous improvement", "Customer-centric action", "Collaboration", "Automation"], answer: 0, explain: "Continuous improvement — 애자일, 린 제조, Improvement Kata의 기본." },
  { kind: "short", id: "se-q-dp-4", concept: "devops-principles", q: "CI/CD에서 CI의 풀네임은? (영어)", answers: ["continuous integration", "지속적 통합"], explain: "CD는 Continuous Delivery." },
  { kind: "ox", id: "se-q-dp-5", concept: "devops-principles", q: "DevOps에서는 개발팀과 운영팀이 하나의 팀으로 합쳐지기도 한다.", answer: true, explain: "Often, development and operations teams merge into a single team." },
  { kind: "ox", id: "se-q-dp-6", concept: "devops-principles", q: "고객 중심 행동 원칙은 긴 피드백 루프를 통해 신중하게 대응하는 것이다.", answer: false, explain: "짧은 피드백 루프, 실시간 모니터링과 빠른 배포." },

  // devops-benefits
  { kind: "short", id: "se-q-db-1", concept: "devops-benefits", q: "DORA 2019 보고서에 따르면 엘리트 팀은 저성과 팀보다 몇 배 더 자주 배포하는가?", answers: ["208", "208배"], explain: "그리고 106배 빠르게.", hint: "숫자" },
  { kind: "short", id: "se-q-db-2", concept: "devops-benefits", q: "'Mean Time to Recovery'의 약어는? (영문 4자)", answers: ["mttr"], explain: "MTTR = Mean Time to Recovery (평균 복구 시간).", hint: "영문" },
  { kind: "mc", id: "se-q-db-3", concept: "devops-benefits", q: "DevOps의 이점이 아닌 것은?", options: ["협업과 신뢰", "더 빠른 릴리스", "문제 해결 시간 단축", "운영팀의 완전한 제거"], answer: 3, explain: "이점: 협업·신뢰, 빠른 릴리스, 문제 해결 시간 단축, 계획되지 않은 업무 관리." },
  { kind: "ox", id: "se-q-db-4", concept: "devops-benefits", q: "DORA 2019 보고서에서 엘리트 팀은 저성과 팀보다 106배 더 빠르게 배포한다.", answer: true, explain: "DORA 2019: 208배 자주, 106배 빠르게." },

  // devops-process
  { kind: "mc", id: "se-q-dv-1", concept: "devops-process", q: "DevOps 프로세스의 순서로 옳은 것은?", options: ["Plan → Code → Build → Test → Release → Deploy → Operate → Monitor", "Code → Plan → Test → Build → Deploy → Release → Monitor → Operate", "Plan → Build → Code → Release → Test → Monitor → Deploy → Operate", "Monitor → Operate → Deploy → Release → Test → Build → Code → Plan"], answer: 0, explain: "Dev(Plan·Code·Build·Test) → Ops(Release·Deploy·Operate·Monitor)." },
  { kind: "mc", id: "se-q-dv-2", concept: "devops-process", q: "Infrastructure as Code, 보안 문제, 로그 관리를 다루는 단계는?", options: ["Build", "Release", "Operate", "Plan"], answer: 2, explain: "Operate / configure infrastructure." },
  { kind: "mc", id: "se-q-dv-3", concept: "devops-process", q: "'코드가 지속적 통합 테스트를 통과해 배포 준비가 된' 단계는?", options: ["Release", "Deploy", "Monitor", "Code"], answer: 0, explain: "Release — CI를 통과해 배포 준비 완료." },
  { kind: "mc", id: "se-q-dv-4", concept: "devops-process", q: "DevOps 프로세스 중 Ops에 속하지 않는 것은?", options: ["Release", "Deploy", "Monitor", "Build"], answer: 3, explain: "Dev: Plan·Code·Build·Test / Ops: Release·Deploy·Operate·Monitor." },
  { kind: "ox", id: "se-q-dv-5", concept: "devops-process", q: "DevOps의 Plan 단계에서는 애자일의 사용자 스토리로 태스크를 계획한다.", answer: true, explain: "Plan — user story process from the agile methodology." },
  { kind: "ox", id: "se-q-dv-6", concept: "devops-process", q: "DevOps에서는 개발팀과 운영팀이 서로 다른 코드 도구를 쓰는 것이 중요하다.", answer: false, explain: "GitHub·GitLab 같은 도구를 공유하는 것이 중요하다." },
  { kind: "mc", id: "se-q-dv-7", concept: "devops-process", q: "교안에서 말하는 '완벽한 사용자 스토리'의 구성 요소가 아닌 것은?", options: ["what (who, where, trigger)", "why", "acceptance criteria", "how much salary"], answer: 3, explain: "완벽한 사용자 스토리 = what(who, where, trigger) + why + acceptance criteria." },

  // devops-toolchain-metrics
  { kind: "mc", id: "se-q-dt-1", concept: "devops-toolchain-metrics", q: "DevOps 툴체인의 설명으로 옳은 것은?", options: ["한 벤더의 단일 도구", "여러 벤더의 도구가 통합된 하나처럼 동작하는 도구 모음", "하드웨어 장비", "문서 템플릿"], answer: 1, explain: "A collection of tools, often from a variety of vendors, that operate as an integrated unit." },
  { kind: "mc", id: "se-q-dt-2", concept: "devops-toolchain-metrics", q: "DevOps 성과 측정 지표가 아닌 것은?", options: ["배포 주기", "MTTD", "가용성", "개발자 수면 시간"], answer: 3, explain: "지표: 배포 주기·규모·시간, 리드 타임, 고객 불만, 자동 테스트 성공률, 가용성, SLA, MTTD, MTTR 등." },
  { kind: "short", id: "se-q-dt-3", concept: "devops-toolchain-metrics", q: "'Mean Time to Detection'의 약어는? (영문 4자)", answers: ["mttd"], explain: "MTTD = Mean Time to Detection (결함 발견 간 평균 시간).", hint: "영문" },
  { kind: "ox", id: "se-q-dt-4", concept: "devops-toolchain-metrics", q: "서비스 수준 협약(SLA)은 DevOps 성과 측정 지표에 포함된다.", answer: true, explain: "Service level agreement(서비스 수준 협약)도 지표 목록에 있다." },

  // devops-vs-agile
  { kind: "mc", id: "se-q-da-1", concept: "devops-vs-agile", q: "DevOps와 Agile의 차이로 옳은 것은?", options: ["Agile은 운영팀을 포함한다", "DevOps는 운영팀을 포함하고 인도·유지보수까지 확장한다", "DevOps는 계획된 작업만 다룬다", "Agile은 테스트 자동화에만 집중한다"], answer: 1, explain: "DevOps includes the operations team, extends the focus to delivery and maintenance." },
  { kind: "ox", id: "se-q-da-2", concept: "devops-vs-agile", q: "애자일과 DevOps의 궁극적 목표는 서로 다르다.", answer: false, explain: "같다 — SW 개발의 속도와 품질 향상." },
  { kind: "ox", id: "se-q-da-3", concept: "devops-vs-agile", q: "DevOps는 운영팀에 흔한 계획되지 않은 작업까지 포함한다.", answer: true, explain: "DevOps incorporates unplanned work common to operations teams." },
  { kind: "mc", id: "se-q-da-4", concept: "devops-vs-agile", q: "Agile이 강조하고 DevOps가 '테스트와 인도 자동화'로 확장한 것은?", options: ["반복 개발과 작은 배치", "계약 협상", "포괄적 문서", "폭포수 단계"], answer: 0, explain: "Agile: iterative development and small batches ↔ DevOps: test and delivery automation." },

  // sw-pm
  { kind: "mc", id: "se-q-sm-1", concept: "sw-pm", q: "SW 프로젝트의 성공 기준이 아닌 것은?", options: ["합의한 시간에 인도", "예산 안의 비용", "고객 기대 만족", "가능한 많은 코드 줄 수"], answer: 3, explain: "넷째 기준은 일관되고 잘 돌아가는 팀 유지." },
  { kind: "ox", id: "se-q-sm-2", concept: "sw-pm", q: "SW 개발은 늘 예산과 일정 제약을 받기 때문에 프로젝트 관리가 필요하다.", answer: true, explain: "Software development is always subject to budget and schedule constraints." },
  { kind: "mc", id: "se-q-sm-3", concept: "sw-pm", q: "프로젝트 관리에 영향을 주는 요소가 아닌 것은?", options: ["회사 규모", "SW 유형", "조직 문화", "관리자의 키"], answer: 3, explain: "요소: 회사 규모, SW 고객, SW 규모, SW 유형, 조직 문화, SW 개발 프로세스." },

  // sw-mgmt-distinctions
  { kind: "mc", id: "se-q-md-1", concept: "sw-mgmt-distinctions", q: "SW 관리의 특수성이 아닌 것은?", options: ["제품이 무형이다", "많은 프로젝트가 일회성이다", "프로세스가 가변적이고 조직마다 다르다", "진척을 눈으로 쉽게 볼 수 있다"], answer: 3, explain: "무형이라 산출물을 보는 것만으로는 진척을 볼 수 없다." },
  { kind: "ox", id: "se-q-md-2", concept: "sw-mgmt-distinctions", q: "SW 프로세스는 전통 공학 프로세스만큼 성숙하다.", answer: false, explain: "그만큼 성숙하지 않다." },
  { kind: "ox", id: "se-q-md-3", concept: "sw-mgmt-distinctions", q: "경험이 많은 관리자라도 새 대형 프로젝트의 문제를 예상하기 어려울 수 있다.", answer: true, explain: "프로젝트가 일회성(one-off)이기 때문." },

  // mgmt-activities
  { kind: "mc", id: "se-q-ma2-1", concept: "mgmt-activities", q: "'일을 수주하려고 프로젝트 목표와 수행 방법을 기술하는' 관리 활동은?", options: ["Reporting", "Proposal writing", "Risk management", "People management"], answer: 1, explain: "Proposal writing(제안서 작성)." },
  { kind: "mc", id: "se-q-ma2-2", concept: "mgmt-activities", q: "보편적인 관리 활동이 아닌 것은?", options: ["Project planning", "Risk management", "Reporting", "Code compiling"], answer: 3, explain: "관리 활동: 계획, 위험 관리, 사람 관리, 보고, 제안서 작성." },
  { kind: "ox", id: "se-q-ma2-3", concept: "mgmt-activities", q: "프로젝트 관리자는 고객과 회사 관리자에게 프로젝트 진척을 보고할 책임이 있다.", answer: true, explain: "Reporting." },

  // risk-mgmt
  { kind: "mc", id: "se-q-rm-1", concept: "risk-mgmt", q: "'일정이나 자원'에 영향을 주는 위험은?", options: ["프로젝트 위험", "제품 위험", "비즈니스 위험", "기술 위험"], answer: 0, explain: "Project risks affect schedule or resources." },
  { kind: "mc", id: "se-q-rm-2", concept: "risk-mgmt", q: "'경쟁 제품이 먼저 출시되는 것'은 어떤 위험인가?", options: ["프로젝트", "제품", "비즈니스", "사람"], answer: 2, explain: "Product competition — Business." },
  { kind: "mc", id: "se-q-rm-3", concept: "risk-mgmt", q: "'CASE 도구가 기대만큼 동작하지 않는 것'은 어떤 위험인가?", options: ["프로젝트", "제품", "비즈니스", "조직"], answer: 1, explain: "CASE tool underperformance — Product." },
  { kind: "mc", id: "se-q-rm-4", concept: "risk-mgmt", q: "'경험 많은 인력이 프로젝트가 끝나기 전에 떠나는 것(Staff turnover)'은?", options: ["프로젝트 위험", "제품 위험", "비즈니스 위험", "기술 위험"], answer: 0, explain: "Staff turnover — Project." },
  { kind: "ox", id: "se-q-rm-5", concept: "risk-mgmt", q: "요구사항 변경은 프로젝트와 제품 모두에 영향을 주는 위험이다.", answer: true, explain: "Requirements change — Project and product." },
  { kind: "ox", id: "se-q-rm-6", concept: "risk-mgmt", q: "기반 기술이 새 기술로 대체되는 것(Technology change)은 프로젝트 위험이다.", answer: false, explain: "비즈니스 위험." },
  { kind: "mc", id: "se-q-rm-7", concept: "risk-mgmt", q: "SW 개발의 불확실성 원인으로 교안에 든 것이 아닌 것은?", options: ["느슨하게 정의된 요구사항", "고객 요구 변화로 인한 요구 변경", "시간과 자원 추정의 어려움", "컴퓨터 전원 전압"], answer: 3, explain: "넷째 원인은 개인 기술의 차이." },

  // risk-process
  { kind: "mc", id: "se-q-rp-1", concept: "risk-process", q: "위험 관리 프로세스의 순서로 옳은 것은?", options: ["식별 → 분석 → 계획 → 감시", "분석 → 식별 → 감시 → 계획", "계획 → 식별 → 분석 → 감시", "감시 → 계획 → 분석 → 식별"], answer: 0, explain: "Identification → Analysis → Planning → Monitoring." },
  { kind: "mc", id: "se-q-rp-2", concept: "risk-process", q: "위험 분석에서 결과(effects)의 등급이 아닌 것은?", options: ["Catastrophic", "Serious", "Tolerable", "Excellent"], answer: 3, explain: "Catastrophic, Serious, Tolerable, Insignificant." },
  { kind: "ox", id: "se-q-rp-3", concept: "risk-process", q: "위험 식별에는 흔한 위험의 체크리스트를 쓸 수 있다.", answer: true, explain: "A checklist of common risks may be used." },
  { kind: "ox", id: "se-q-rp-4", concept: "risk-process", q: "위험 감시는 프로젝트 시작 때 한 번만 하면 된다.", answer: false, explain: "정기적으로 재평가, 핵심 위험은 진척 회의에서 논의." },
  { kind: "mc", id: "se-q-rp-5", concept: "risk-process", q: "교안의 위험 분석 표에서 '필요한 기술의 인력을 채용할 수 없음'의 확률과 영향은?", options: ["Low / Catastrophic", "High / Catastrophic", "Moderate / Serious", "High / Tolerable"], answer: 1, explain: "(3) High / Catastrophic." },
  { kind: "mc", id: "se-q-rp-6", concept: "risk-process", q: "교안의 위험 분석 표에서 '조직 재정 문제로 예산 삭감'의 확률과 영향은?", options: ["Low / Catastrophic", "High / Serious", "Moderate / Tolerable", "High / Catastrophic"], answer: 0, explain: "(7) Low / Catastrophic — 확률은 낮지만 일어나면 재앙." },
  { kind: "mc", id: "se-q-rp-7", concept: "risk-process", q: "교안 표에서 '코드 생성 도구가 만든 코드가 비효율적'의 영향 등급은?", options: ["Catastrophic", "Serious", "Tolerable", "Insignificant"], answer: 3, explain: "Moderate / Insignificant." },

  // risk-types
  { kind: "mc", id: "se-q-rt-1", concept: "risk-types", q: "'핵심 인력이 결정적 시기에 아파서 없다'는 어떤 위험 유형인가?", options: ["People", "Technology", "Estimation", "Tools"], answer: 0, explain: "People — 채용 불가, 핵심 인력 질병, 교육 부족." },
  { kind: "mc", id: "se-q-rt-2", concept: "risk-types", q: "'DB가 기대한 초당 트랜잭션을 처리하지 못한다'는 어떤 위험 유형인가?", options: ["Requirements", "Technology", "Organizational", "People"], answer: 1, explain: "Technology — DB 성능, 재사용 컴포넌트 결함." },
  { kind: "mc", id: "se-q-rt-3", concept: "risk-types", q: "'SW 크기를 과소 추정했다'는 어떤 위험 유형인가?", options: ["Estimation", "Tools", "Technology", "People"], answer: 0, explain: "Estimation — 개발 시간·결함 수정 속도·SW 크기 과소 추정." },
  { kind: "mc", id: "se-q-rt-4", concept: "risk-types", q: "'조직이 개편되어 다른 경영진이 프로젝트를 맡는다'는 어떤 위험 유형인가?", options: ["Organizational", "People", "Requirements", "Tools"], answer: 0, explain: "Organizational — 조직 개편, 재정 문제." },
  { kind: "ox", id: "se-q-rt-5", concept: "risk-types", q: "'SW 도구들이 통합되어 동작하지 않는다'는 Technology 위험이다.", answer: false, explain: "Tools 위험. Technology는 DB 성능, 재사용 컴포넌트 결함." },
  { kind: "ox", id: "se-q-rt-6", concept: "risk-types", q: "'고객이 요구 변경의 영향을 이해하지 못한다'는 People 위험이다.", answer: false, explain: "Requirements 위험." },

  // risk-strategies
  { kind: "mc", id: "se-q-rs-1", concept: "risk-strategies", q: "위험이 일어날 '확률'을 줄이는 전략은?", options: ["Avoidance strategies", "Minimization strategies", "Contingency plans", "Monitoring"], answer: 0, explain: "Avoidance — 확률을 줄인다." },
  { kind: "mc", id: "se-q-rs-2", concept: "risk-strategies", q: "위험이 일어났을 때 대처하는 계획은?", options: ["회피 전략", "최소화 전략", "비상 계획(Contingency plans)", "위험 식별"], answer: 2, explain: "Contingency plans — 일어나면 대처." },
  { kind: "mc", id: "se-q-rs-3", concept: "risk-strategies", q: "'인력 질병' 위험에 대한 교안의 전략은?", options: ["고객에게 지연 가능성을 알림", "업무가 겹치도록 팀을 재조직해 서로의 일을 이해하게 함", "더 빠른 DB 구매", "경영진 보고서 준비"], answer: 1, explain: "Reorganize team so that there is more overlap of work." },
  { kind: "mc", id: "se-q-rs-4", concept: "risk-strategies", q: "'요구사항 변경' 위험에 대한 교안의 전략은?", options: ["추적성 정보로 변경 영향을 평가하고 설계에서 정보 은닉을 최대화", "요구사항을 무시", "팀원 교체", "예산 증액 요청"], answer: 0, explain: "Derive traceability information; maximize information hiding in the design." },
  { kind: "mc", id: "se-q-rs-5", concept: "risk-strategies", q: "위험 지표에서 '조직 내 소문, 경영진의 무대응'은 어떤 위험 유형의 지표인가?", options: ["Organizational", "People", "Tools", "Estimation"], answer: 0, explain: "Organizational — organizational gossip; lack of action by senior management." },
  { kind: "mc", id: "se-q-rs-6", concept: "risk-strategies", q: "위험 지표에서 '낮은 사기, 나쁜 팀 관계, 높은 이직'은 어떤 유형인가?", options: ["People", "Technology", "Requirements", "Estimation"], answer: 0, explain: "People — poor staff morale; poor relationships; high staff turnover." },
  { kind: "ox", id: "se-q-rs-7", concept: "risk-strategies", q: "최소화 전략은 위험이 일어날 확률을 줄이는 것이다.", answer: false, explain: "확률을 줄이는 것은 회피 전략. 최소화는 영향을 줄인다." },
  { kind: "ox", id: "se-q-rs-8", concept: "risk-strategies", q: "What-if 질문은 위험 감시 단계에서만 쓰는 도구다.", answer: false, explain: "위험 계획 단계에서 쓴다." },
  { kind: "short", id: "se-q-rs-9", concept: "risk-strategies", q: "교안의 What-if 질문: 경기 침체로 프로젝트 예산이 몇 % 삭감되면? (숫자만)", answers: ["20", "20%"], explain: "What if an economic downturn leads to budget cuts of 20%?", hint: "숫자" },

  // people-mgmt
  { kind: "mc", id: "se-q-pe-1", concept: "people-mgmt", q: "사람 관리의 요소가 아닌 것은?", options: ["Consistency", "Respect", "Inclusion", "Competition"], answer: 3, explain: "Consistency, Respect, Inclusion, Honesty." },
  { kind: "mc", id: "se-q-pe-2", concept: "people-mgmt", q: "'편애나 차별 없이 팀원 모두를 비슷하게 대우한다'는 요소는?", options: ["Consistency", "Respect", "Inclusion", "Honesty"], answer: 0, explain: "Consistency(일관성)." },
  { kind: "ox", id: "se-q-pe-3", concept: "people-mgmt", q: "잘못된 사람 관리는 프로젝트 실패의 중요한 원인이다.", answer: true, explain: "Poor people management is an important contributor to project failure." },
  { kind: "ox", id: "se-q-pe-4", concept: "people-mgmt", q: "관리자는 프로젝트가 잘 안 될 때 팀의 사기를 위해 사실을 숨기는 것이 좋다.", answer: false, explain: "Honesty — 잘 되는 것과 안 되는 것을 늘 솔직하게." },

  // motivation
  { kind: "mc", id: "se-q-mo-1", concept: "motivation", q: "SW 개발 그룹에서 '자아실현(Self-realization)' 욕구를 채우는 방법은?", options: ["공동 시설 제공", "성취 인정", "교육과 책임", "식사 제공"], answer: 2, explain: "Self-realization — Training, Responsibility." },
  { kind: "mc", id: "se-q-mo-2", concept: "motivation", q: "'존중(Esteem)' 욕구를 채우는 방법은?", options: ["성취 인정과 적절한 보상", "교육", "비공식 소통 허용", "안전한 건물"], answer: 0, explain: "Esteem — Recognition of achievements, Appropriate rewards." },
  { kind: "ox", id: "se-q-mo-3", concept: "motivation", q: "SW 개발 그룹에서 관리자가 가장 먼저 챙겨야 할 것은 생리적·안전 욕구다.", answer: false, explain: "SW 개발 그룹에서 생리·안전 욕구는 문제가 아니다. 사회·존중·자아실현을 챙긴다." },
  { kind: "mc", id: "se-q-mo-4", concept: "motivation", q: "교안 사례에서 의욕을 잃은 Dorothy에게 Alice가 한 조치는?", options: ["해고", "설계 자율권을 더 주고 SW 공학 교육 과정을 마련", "급여 삭감", "다른 팀으로 즉시 이동"], answer: 1, explain: "Alice gives Dorothy more design autonomy and organizes training courses." },
  { kind: "ox", id: "se-q-mo-5", concept: "motivation", q: "사례에서 Dorothy가 의욕을 잃은 이유는 C 프로그래밍이 너무 쉬워서였다.", answer: false, explain: "하드웨어 인터페이스 기술을 쓰고 키우지 못해서." },
  { kind: "mc", id: "se-q-mo-6", concept: "motivation", q: "동기의 종류로 교안에 든 것이 아닌 것은?", options: ["기본 욕구", "개인 욕구", "사회적 욕구", "기계적 욕구"], answer: 3, explain: "기본(음식·수면), 개인(존중·자존감), 사회적(집단의 일원) 욕구." },

  // personality-types
  { kind: "mc", id: "se-q-pt3-1", concept: "personality-types", q: "'일이 개인 목표(부자, 테니스, 여행)를 이루는 수단'인 성격 유형은?", options: ["Task-oriented", "Interaction-oriented", "Self-oriented", "Team-oriented"], answer: 2, explain: "Self-oriented — work is a means to an end." },
  { kind: "mc", id: "se-q-pt3-2", concept: "personality-types", q: "'동료의 존재와 행동이 주된 동기'인 유형은?", options: ["Task-oriented", "Interaction-oriented", "Self-oriented", "Goal-oriented"], answer: 1, explain: "Interaction-oriented — people go to work because they like to go to work." },
  { kind: "ox", id: "se-q-pt3-3", concept: "personality-types", q: "개인의 동기는 세 유형의 요소가 섞여 있고, 그 균형은 상황에 따라 바뀔 수 있다.", answer: true, explain: "Motivation balance." },
  { kind: "ox", id: "se-q-pt3-4", concept: "personality-types", q: "욕구 단계 이론만으로 실제 동기를 정확히 설명할 수 있다.", answer: false, explain: "지나친 단순화 — 성격 유형도 고려해야 한다." },

  // group-cohesiveness
  { kind: "mc", id: "se-q-gc-1", concept: "group-cohesiveness", q: "응집력 있는 그룹의 장점이 아닌 것은?", options: ["그룹 품질 표준을 스스로 만든다", "지식이 공유된다", "리팩토링과 지속적 개선이 장려된다", "구성원이 떠나면 일이 완전히 멈춘다"], answer: 3, explain: "지식 공유로 연속성이 유지된다." },
  { kind: "mc", id: "se-q-gc-2", concept: "group-cohesiveness", q: "팀의 효과성에 영향을 주는 3요인이 아닌 것은?", options: ["그룹의 사람들", "그룹 조직", "기술·관리 의사소통", "사무실 층수"], answer: 3, explain: "3요인: 그룹의 사람들, 그룹 조직, 기술·관리 의사소통." },
  { kind: "ox", id: "se-q-gc-3", concept: "group-cohesiveness", q: "응집력 있는 그룹에서는 구성원이 그룹을 어느 개인보다 중요하게 여긴다.", answer: true, explain: "In a cohesive group, members consider the group to be more important than any individual." },
  { kind: "mc", id: "se-q-gc-4", concept: "group-cohesiveness", q: "교안 사례에서 Alice가 응집력을 키우려고 한 일이 아닌 것은?", options: ["월례 점심", "이틀짜리 away day 기술 업데이트", "가족 중 노인과 기술 이야기", "개인별 성과 순위 공개"], answer: 3, explain: "Alice: 노인 가족과 기술 대화, 월례 점심, away day 기술 업데이트." },

  // group-composition
  { kind: "mc", id: "se-q-gp-1", concept: "group-composition", q: "모두 자기 지향(self-oriented)인 그룹에서 생기는 문제는?", options: ["모두 자기 일만 한다", "모두 보스가 되려 한다", "잡담만 많다", "문제가 없다"], answer: 1, explain: "Self-oriented만 → everyone wants to be the boss." },
  { kind: "mc", id: "se-q-gp-2", concept: "group-composition", q: "긴장을 감지하고 풀어 주어 매우 중요한 유형은?", options: ["Task-oriented", "Interaction-oriented", "Self-oriented", "없음"], answer: 1, explain: "Interaction-oriented people can detect and defuse tensions." },
  { kind: "ox", id: "se-q-gp-3", concept: "group-composition", q: "SW 엔지니어는 주로 상호작용 지향이라 그룹의 균형을 맞추기 쉽다.", answer: false, explain: "주로 과업 지향이라 균형을 맞추기 어렵다." },
  { kind: "ox", id: "se-q-gp-4", concept: "group-composition", q: "효과적인 그룹은 세 성격 유형의 균형을 이룬다.", answer: true, explain: "An effective group has a balance of all types." },
  { kind: "mc", id: "se-q-gp-5", concept: "group-composition", q: "이상적인 사람을 팀에 배정하지 못하는 이유로 교안에 든 것이 아닌 것은?", options: ["예산이 고액 인력을 허용하지 않음", "적절한 경험자가 없음", "조직이 직원 기술을 키우려 함", "모든 지원자가 과잉 자격"], answer: 3, explain: "이유 3개: 예산, 경험자 부족, 직원 기술 개발 목적." },
  { kind: "mc", id: "se-q-gp-6", concept: "group-composition", q: "교안 사례에서 Alice는 자신을 어떤 유형으로 판단했나?", options: ["과업 지향", "상호작용 지향", "자기 지향", "판단하지 않음"], answer: 2, explain: "프로젝트를 경영진에게 주목받고 승진할 기회로 봤기 때문." },

  // group-org-comm
  { kind: "mc", id: "se-q-go-1", concept: "group-org-comm", q: "그룹 의사소통에 대한 설명으로 옳은 것은?", options: ["그룹이 클수록 소통이 쉽다", "비공식 구조가 계층 구조보다 소통이 낫다", "같은 성격 유형만 있을 때 소통이 낫다", "물리적 환경은 영향이 없다"], answer: 1, explain: "Communication is better in informally structured groups than in hierarchically structured groups." },
  { kind: "mc", id: "se-q-go-2", concept: "group-org-comm", q: "비공식 그룹에서 그룹 리더의 역할은?", options: ["작업을 하나씩 배정한다", "외부 인터페이스 역할을 하지만 특정 작업을 배정하지 않는다", "모든 결정을 혼자 내린다", "코드만 작성한다"], answer: 1, explain: "The group leader serves as the external interface but does not allocate specific work items." },
  { kind: "ox", id: "se-q-go-3", concept: "group-org-comm", q: "애자일 개발은 공식 구조가 정보 교환을 막는다는 원칙에 따라 늘 비공식 그룹을 기반으로 한다.", answer: true, explain: "Formal structure inhibits information exchange." },
  { kind: "ox", id: "se-q-go-4", concept: "group-org-comm", q: "비공식 그룹은 경험이 적은 신입 위주의 그룹에서 특히 성공적이다.", answer: false, explain: "모든 구성원이 경험 많고 유능할 때 성공적." },
  { kind: "ox", id: "se-q-go-5", concept: "group-org-comm", q: "그룹에 다른 성격 유형이 섞여 있고 혼성일 때 의사소통이 더 낫다.", answer: true, explain: "Group composition — 다양한 성격, 혼성일 때 낫다." },

  // team-org-types
  { kind: "mc", id: "se-q-to-1", concept: "team-org-types", q: "'의사소통 경로가 짧아 인력과 진척 관리가 효율적인' 조직은?", options: ["직능별 조직", "프로젝트별 조직", "매트릭스 조직", "계층 조직"], answer: 1, explain: "Organization by projects — 의사소통 경로가 짧다." },
  { kind: "mc", id: "se-q-to-2", concept: "team-org-types", q: "'구성원이 여러 프로젝트 팀에 중복으로 소속될 수 있는' 조직은?", options: ["매트릭스 조직", "프로젝트별 조직", "애자일 조직", "직능별 조직"], answer: 0, explain: "Matrix organization — 기능 팀 소속 + 여러 프로젝트 중복." },
  { kind: "short", id: "se-q-to-3", concept: "team-org-types", q: "교안의 애자일 조직은 몇 명 정도의 팀인가? (예: 3-5)", answers: ["5-9", "5~9", "5~9명", "5-9명"], explain: "5~9명이 긴밀히 일하며 결과와 문제를 공동 소유.", hint: "a-b" },
  { kind: "ox", id: "se-q-to-4", concept: "team-org-types", q: "직능별 조직에서는 부서마다 같은 프로젝트에서 다른 역할을 하고 부서 간에 협업한다.", answer: true, explain: "Organization by functional team(직능별 조직)." },
];
