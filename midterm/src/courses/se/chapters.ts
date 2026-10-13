import type { Chapter } from "@/lib/types";

export const CHAPTERS: Chapter[] = [
  { id: "intro", title: "소프트웨어와 소프트웨어 공학", en: "Software Quality and Principles", source: "#1 Ch1 Software Quality and Principles", blurb: "프로그램 vs 소프트웨어, 소프트웨어의 특성·위기·실패 원인, SE의 정의, 좋은 SW의 4속성, 제품 유형·응용 유형, 윤리와 ACM/IEEE 8원칙" },
  { id: "proc", title: "소프트웨어 프로세스와 모델", en: "Software Processes & Process Models", source: "#2 Ch2-1 SW Processes (1)", blurb: "생명주기, 프로세스의 4활동, 좋은 프로세스, 계획 주도 vs 애자일, 폭포수·V 모델, 점증적 개발, 통합과 구성(재사용·COTS)" },
  { id: "act", title: "프로세스 활동 · 변경 대응 · 프로세스 개선", en: "Process Activities, Coping with Change, Process Improvement", source: "#2 Ch2-1 SW Processes (1)", blurb: "요구공학 과정, 설계 활동, V&V와 테스트 단계, 진화, 변경 예측·허용, 프로토타이핑, 점증적 인도, 프로세스 개선 주기, SEI CMM" },
  { id: "agile", title: "애자일 방법과 XP", en: "Agile Methods & Extreme Programming", source: "#2 Ch2-2 Agile Software Development", blurb: "애자일 선언문, 애자일 5원칙, 적용 분야, XP 실천법, 사용자 스토리, 리팩토링, 테스트 우선 개발, 짝 프로그래밍" },
  { id: "scrum", title: "스크럼과 애자일 확장", en: "Scrum & Scaling Agile", source: "#2 Ch2-2 Agile Software Development", blurb: "스크럼 3단계·용어(스프린트·백로그·제품 소유자·스크럼 마스터·속도), 스크럼 보드, scaling up/out, 계약·유지보수 문제, 다중 팀 스크럼" },
  { id: "devops", title: "DevOps", en: "DevOps", source: "#3 Ch2-3 SW Processes (3) DevOps", blurb: "사일로 문제, DevOps 정의, 린 7원칙, DevOps 원칙·이점, Plan–Code–Build–Test–Release–Deploy–Operate–Monitor, 툴체인, 성과 측정, DevOps vs Agile" },
  { id: "risk", title: "프로젝트 관리와 위험 관리", en: "Project Management & Risk Management", source: "#3-1 Project Management (HR, Risk, Team)", blurb: "성공 기준, SW 관리의 특수성, 관리 활동, 위험의 분류(프로젝트·제품·비즈니스), 위험 관리 4단계, 회피·최소화·비상 계획, 위험 지표" },
  { id: "people", title: "사람 관리와 팀워크", en: "Managing People & Teamwork", source: "#3-1 Project Management (HR, Risk, Team)", blurb: "사람 관리 4요소, 동기 부여와 욕구 단계, 성격 유형(과업·상호작용·자기 지향), 그룹 응집력, 그룹 구성·조직·의사소통, 프로젝트 팀 조직 형태" },
];
