import type { Chapter } from "@/lib/types";

export const CHAPTERS: Chapter[] = [
  { id: "intro", title: "DB 시스템 소개", en: "Introduction to DB Systems", source: "Lecture 2 (앞)", blurb: "DB·DBMS·DB 시스템, 네 가지 특성과 장점, DBMS를 쓰지 않는 게 나을 때" },
  { id: "arch", title: "데이터 모델과 3단계 스키마", en: "DB System Architecture", source: "Lecture 2 (가운데)", blurb: "개념·표현·물리 데이터 모델, 3단계 스키마 구조, 논리·물리 데이터 독립성" },
  { id: "er", title: "ER 모델", en: "Entity-Relationship Model", source: "Lecture 2 (뒤) · Practice 1", blurb: "엔티티·속성 종류·키, 관계의 차수·카디널리티·참여 제약, 약한 엔티티" },
  { id: "rel", title: "관계형 데이터 모델과 제약", en: "Relational Data Model & Constraints", source: "Lecture 3 (앞)", blurb: "릴레이션·튜플·도메인, 키 제약·개체 무결성·참조 무결성, 연산별 위반" },
  { id: "map", title: "ER → 관계 매핑", en: "ER-to-Relational Mapping", source: "Lecture 3 (뒤) · Practice 2", blurb: "엔티티·다중값 속성·약한 엔티티·1:1·1:N·M:N·N항 관계를 테이블로" },
  { id: "sql", title: "기본 SQL", en: "Basic SQL", source: "Lecture 4 (앞)", blurb: "DDL·제약 지정·참조 트리거 동작, INSERT·DELETE·UPDATE, SELECT-FROM-WHERE, 다중집합" },
  { id: "sqladv", title: "고급 SQL", en: "Advanced SQL", source: "Lecture 4 (뒤) · Practice 3", blurb: "중첩 질의·IN·ANY/ALL·EXISTS, 내부/외부 조인, 집계·GROUP BY·HAVING, 어서션·트리거, SQL 실습(작성·결과·오류 찾기)" },
  { id: "view", title: "뷰", en: "Views", source: "Lecture 5", blurb: "가상 테이블, 질의 수정 vs 실체화, 갱신 가능한 뷰의 조건, 권한" },
  { id: "ra", title: "관계 대수", en: "Relational Algebra", source: "Lecture 6", blurb: "σ·π·ρ, 집합 연산, ×·⋈, 완전 집합, 질의 트리, 집계 ℑ·외부 조인·나눗셈 ÷" },
];
