import type { SubjectId } from "@/data/exam";

/**
 * 정보처리기사 출제기준 — 주요항목과 세부항목.
 *
 * ⚠️ 출처에 대해 정직하게 적어 둔다.
 *    큐넷(q-net.or.kr)과 한국산업인력공단은 이 작업 환경의 이그레스 프록시에서
 *    막혀 있어 공식 출제기준 문서를 직접 받아 오지 못했다. 아래 구조는 2020년
 *    대개편 이후 널리 공개되어 있는 출제기준의 주요항목·세부항목을 옮겨 적은
 *    것이다. 시험 전에 큐넷에서 지금 적용되는 출제기준을 직접 확인해야 한다.
 *
 * 이 표의 쓸모는 하나다 — 우리 문항이 시험 범위를 얼마나 덮고 있는지를
 * 눈대중이 아니라 수로 재기 위해서다. covers 에 적은 개념 id 가 하나도 없는
 * 세부항목은 "가르치지 않는 범위"이고, 감사가 그것을 세어 알려 준다.
 */
export interface SyllabusItem {
  /** 세부항목 이름 */
  name: string;
  /** 이 항목을 다루는 개념 id 들 (비어 있으면 아직 안 다룬다) */
  covers: string[];
}

export interface SyllabusTopic {
  /** 주요항목 */
  name: string;
  items: SyllabusItem[];
}

export const SYLLABUS: Record<SubjectId, SyllabusTopic[]> = {
  design: [
    {
      name: "요구사항 확인",
      items: [
        { name: "현행 시스템 분석", covers: ["d-current-system"] },
        { name: "요구사항 확인", covers: ["d-requirement"] },
        { name: "분석 모델 확인", covers: ["d-uml-basic", "d-usecase"] },
        { name: "소프트웨어 생명 주기 모형", covers: ["d-sdlc", "d-agile"] },
      ],
    },
    {
      name: "화면 설계",
      items: [
        { name: "UI 요구사항 확인", covers: ["d-ui"] },
        { name: "UI 설계", covers: ["d-ui"] },
      ],
    },
    {
      name: "애플리케이션 설계",
      items: [
        { name: "공통 모듈 설계", covers: ["d-coupling-cohesion"] },
        { name: "객체지향 설계", covers: ["d-oop", "d-solid"] },
        {
          name: "디자인 패턴",
          covers: [
            "d-pattern-creational",
            "d-pattern-structural",
            "d-pattern-behavioral",
          ],
        },
        { name: "소프트웨어 아키텍처", covers: ["d-architecture"] },
      ],
    },
    {
      name: "인터페이스 설계",
      items: [
        { name: "인터페이스 요구사항 확인", covers: ["d-interface"] },
        { name: "인터페이스 대상 식별", covers: ["d-interface"] },
        { name: "인터페이스 상세 설계", covers: ["d-interface"] },
      ],
    },
  ],

  develop: [
    {
      name: "데이터 입출력 구현",
      items: [
        { name: "자료 구조", covers: ["v-datastructure", "v-tree"] },
        { name: "정렬과 탐색", covers: ["v-sort", "v-search"] },
        { name: "데이터 조작 프로시저 최적화", covers: ["b-procedural"] },
      ],
    },
    {
      name: "통합 구현",
      items: [
        { name: "모듈 구현", covers: ["v-clean"] },
        { name: "통합 구현 관리", covers: ["v-scm"] },
      ],
    },
    {
      name: "제품 소프트웨어 패키징",
      items: [
        { name: "제품 소프트웨어 패키징", covers: ["v-package"] },
        { name: "제품 소프트웨어 매뉴얼 작성", covers: ["v-manual"] },
        { name: "제품 소프트웨어 버전 등록·관리", covers: ["v-scm"] },
      ],
    },
    {
      name: "애플리케이션 테스트 관리",
      items: [
        { name: "테스트 케이스 설계", covers: ["v-test-technique"] },
        { name: "테스트 레벨과 유형", covers: ["v-test-level"] },
        { name: "애플리케이션 통합 테스트", covers: ["v-integration"] },
        { name: "애플리케이션 성능 개선", covers: ["v-complexity", "v-clean"] },
        { name: "소프트웨어 품질 표준", covers: ["v-quality"] },
      ],
    },
    {
      name: "인터페이스 구현",
      items: [
        { name: "인터페이스 기능 구현", covers: ["v-interface-impl"] },
        { name: "인터페이스 구현 검증", covers: ["v-interface-impl"] },
      ],
    },
  ],

  database: [
    {
      name: "논리 데이터베이스 설계",
      items: [
        { name: "데이터베이스 설계와 스키마", covers: ["b-schema"] },
        { name: "키와 무결성", covers: ["b-key", "b-integrity"] },
        {
          name: "정규화와 이상 현상",
          covers: ["b-normalization", "b-anomaly"],
        },
      ],
    },
    {
      name: "물리 데이터베이스 설계",
      items: [
        { name: "인덱스와 뷰", covers: ["b-index-view"] },
        { name: "파티셔닝·클러스터링·이중화", covers: ["b-physical"] },
      ],
    },
    {
      name: "SQL 응용",
      items: [
        { name: "절차형 SQL (프로시저·함수·트리거)", covers: ["b-procedural"] },
        { name: "응용 SQL 작성", covers: ["b-sql-join"] },
      ],
    },
    {
      name: "SQL 활용",
      items: [
        { name: "기본 SQL 작성 (DDL·DML·DCL)", covers: ["b-sql-ddl"] },
        { name: "고급 SQL 작성 (조인·서브쿼리)", covers: ["b-sql-join"] },
      ],
    },
    {
      name: "데이터 전환",
      items: [
        { name: "데이터 전환 기술 (ETL)", covers: ["b-migration"] },
        { name: "데이터 정제", covers: ["b-migration"] },
      ],
    },
    {
      name: "트랜잭션 관리",
      items: [
        { name: "트랜잭션과 ACID", covers: ["b-transaction"] },
        { name: "동시성 제어와 회복", covers: ["b-concurrency"] },
        { name: "데이터베이스 신기술", covers: ["b-nosql"] },
      ],
    },
  ],

  language: [
    {
      name: "서버 프로그램 구현",
      items: [
        { name: "개발 환경 구축", covers: ["l-server-build"] },
        { name: "배치 프로그램 구현", covers: ["l-server-build"] },
      ],
    },
    {
      name: "프로그래밍 언어 활용",
      items: [
        { name: "C 언어 기본 문법", covers: ["l-c-pointer", "l-c-struct"] },
        { name: "Java 언어 기본 문법", covers: ["l-java-oop"] },
        { name: "Python 언어 기본 문법", covers: ["l-python"] },
        { name: "언어 특성과 분류", covers: ["l-language-type"] },
      ],
    },
    {
      name: "응용 SW 기초 기술 활용",
      items: [
        { name: "운영체제 — 프로세스와 스케줄링", covers: ["l-os-scheduling"] },
        { name: "운영체제 — 기억장치 관리", covers: ["l-os-memory"] },
        { name: "네트워크 — OSI 와 프로토콜", covers: ["l-network-osi"] },
        { name: "네트워크 — TCP/IP 와 주소 체계", covers: ["l-network-tcpip"] },
      ],
    },
  ],

  system: [
    {
      name: "소프트웨어 개발 방법론 활용",
      items: [
        { name: "개발 방법론 선정", covers: ["s-methodology"] },
        { name: "개발 방법론 테일러링", covers: ["s-methodology"] },
        { name: "비용 산정과 일정 관리", covers: ["s-estimation"] },
        { name: "소프트웨어 개발 표준 (CMMI·SPICE)", covers: ["v-quality"] },
      ],
    },
    {
      name: "IT 프로젝트 정보시스템 구축 관리",
      items: [
        { name: "네트워크 구축 관리와 신기술", covers: ["s-network-new"] },
        { name: "SW 구축 관리와 신기술", covers: ["s-software-new"] },
        { name: "HW 구축 관리 (고가용성·스토리지)", covers: ["s-raid-backup"] },
        { name: "DB 구축 관리", covers: ["b-nosql"] },
      ],
    },
    {
      name: "소프트웨어 개발 보안 구축",
      items: [
        { name: "SW 개발 보안 설계", covers: ["s-secure-coding"] },
        { name: "SW 개발 보안 구현", covers: ["s-secure-coding"] },
        { name: "암호화 알고리즘", covers: ["s-security-crypto"] },
      ],
    },
    {
      name: "시스템 보안 구축",
      items: [
        { name: "서비스 공격 유형", covers: ["s-security-attack"] },
        { name: "접근 통제", covers: ["s-access-control"] },
        {
          name: "보안 솔루션 (방화벽·IDS·IPS·VPN)",
          covers: ["s-security-solution"],
        },
      ],
    },
  ],
};

/** 세부항목을 훑기 좋게 펼친다 */
export function flatSyllabus(): {
  subject: SubjectId;
  topic: string;
  item: string;
  covers: string[];
}[] {
  const out: {
    subject: SubjectId;
    topic: string;
    item: string;
    covers: string[];
  }[] = [];
  for (const [subject, topics] of Object.entries(SYLLABUS)) {
    for (const t of topics) {
      for (const i of t.items) {
        out.push({
          subject: subject as SubjectId,
          topic: t.name,
          item: i.name,
          covers: i.covers,
        });
      }
    }
  }
  return out;
}
