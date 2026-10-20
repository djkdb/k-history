/** 쉬운 설명 칸 — 관계 모델 · 매핑 */
export const STORY_2: Record<string, string> = {
  "relational-model": `
? 예시: 반 친구 정보를 엑셀 표로 정리한다면?
icon 📊
상황: 학번, 이름, 학과를 열로 두고 친구마다 한 줄씩 적어.
list 엑셀 표를 관계 모델 말로 바꾸면
- 표 전체 | **릴레이션**(relation)
- 한 줄(친구 한 명) | **튜플**(tuple)
- 열 머리(학번, 이름…) | **속성**(attribute)
box 1970년 IBM의 Ted Codd가 제안
> 모든 데이터를 평평한 표로 나타낸다
result 장점 | 단순함 · 무결성 · 쉬운 조작(SQL) · 보안
= 이처럼 데이터를 **표 하나하나(릴레이션)** 로 나타내는 게 관계형 데이터 모델이야.
`,
  "domain": `
? 예시: 나이 칸에 "-5살"이 들어가면?
icon 🔢
상황: 직원 나이 칸에 누가 "-5"나 "스무살"을 적었어. 말이 안 되지?
list 칸마다 허락된 값의 범위
- 나이 | 15~80 사이 정수
- 전화번호 | (ddd)ddd-dddd 형식
- 성별 | M 또는 F
box 도메인 = 데이터 타입 + 제약
> 각 값은 더 쪼갤 수 없는 **원자값**
result 효과 | 이상한 값은 처음부터 못 들어옴
= 이처럼 **그 칸에 들어갈 수 있는 값의 집합**이 도메인이야.
`,
  "schema-instance": `
? 예시: 빈 출석부 양식과 오늘의 출석부
icon 📋
상황: 출석부 양식(이름, 학번 칸)은 한 학기 내내 같지만, 적힌 내용은 날마다 바뀌어.
list 둘을 나누면
- 표 이름 + 열 이름·타입 | **스키마** (잘 안 바뀜)
- 지금 들어 있는 행들 | **인스턴스(상태)** (계속 바뀜)
- 열의 개수 | **차수**(degree)
- 행의 개수 | **카디널리티**
box 헷갈리기 쉬운 짝
> 차수 = 열 수, 카디널리티 = 행 수
result 예 | STUDENT(Name, Ssn, Phone) → 차수 3
= 이처럼 **틀(스키마)** 과 **그 순간의 내용(인스턴스)** 을 구분해.
`,
  "relation-characteristics": `
? 예시: 학생 명단을 섞으면 다른 명단일까?
icon 🔀
상황: 학생 명단의 줄 순서를 마구 섞었어. 같은 명단일까?
list 릴레이션의 규칙
- 행 순서를 섞어도 같은 릴레이션 | 튜플에 **순서 없음** (집합)
- 한 칸에 전화번호 두 개 ❌ | **원자값**만
- 모르는 값·해당 없는 값 | **NULL**
box 복합·다중값 속성은 안 된다
> 다중값 → 따로 릴레이션, 복합 → 조각 열로
result 그래서 | '표'가 아니라 '릴레이션'이라 불러
= 이처럼 릴레이션은 **순서 없는 튜플 집합**이고, 칸마다 **값 하나**만 들어가.
`,
  "db-schema-state": `
? 예시: 회사 DB 전체를 한 번에 보면?
icon 🗄️
상황: COMPANY DB에는 직원, 부서, 프로젝트 등 표가 여섯 개 있어.
list 스키마와 상태
- 표 설계도 6개 + 지킬 규칙(IC) | **DB 스키마**
- 지금 표들에 든 데이터 전체 | **DB 상태**
- 규칙을 하나라도 어긴 상태 | **not valid**
box S = {R₁ … Rₘ} + IC
result 예 | COMPANY = {EMPLOYEE, DEPARTMENT, DEPT_LOCATIONS, PROJECT, WORKS_ON, DEPENDENT}
= 이처럼 DB 전체도 **설계도 묶음 + 규칙**과 **그 순간의 데이터**로 나눠 봐.
`,
  "keys": `
? 예시: 학생을 구별하는 최소한의 정보는?
icon 🔑
상황: STUDENT(Ssn, Name, Phone) 표가 있어. 어떤 칸으로 학생을 구별할까?
list 구별할 수 있는 열 묶음
- {Ssn, Name} | 구별은 됨 → **슈퍼키** (군더더기 Name)
- {Ssn} | 더 뺄 게 없음 → **키**(최소 슈퍼키)
- {Ssn}, {Phone} 둘 다 키라면 | 둘 다 **후보키**
- 그중 대표로 고른 {Ssn} | **기본키**
box 최소성(minimality)
> 키에는 필수, 슈퍼키에는 선택
result 남은 후보키는 | SQL에서 UNIQUE로 지정
= 이처럼 **슈퍼키 → 키(최소) → 후보키 → 기본키** 순서로 좁혀 가.
`,
  "entity-integrity": `
? 예시: 이름표가 빈 사물함
icon 🏷️
상황: 사물함마다 번호가 붙어 있는데, 하나만 번호가 비어 있어. 누구 거지?
list 기본키가 비면
- 학번이 NULL인 학생 | 누군지 구별 불가 ❌
- 복합 PK 중 일부만 NULL | 그것도 안 됨 ❌
box 개체 무결성 제약
> 기본키 값은 **NULL일 수 없다**
result SQL에서는 | PK 속성에 NOT NULL이 자동으로 붙어
= 이처럼 기본키는 **튜플의 이름표**라서 비어 있으면 안 돼.
`,
  "referential-integrity": `
? 예시: 없는 학과에 다니는 학생
icon 🔗
상황: 직원 표에 민수의 부서 번호(Dno)가 7이라고 적혀 있는데, 부서 표엔 7번 부서가 없어.
list 외래키가 가리키는 곳
- 민수 Dno = 5, 부서 표에 5번 있음 | 정상 ✅
- 지영 Dno = 7, 7번 부서 없음 | 위반 ❌
- 신입 Dno = NULL (아직 배정 전) | 허용 ✅
box 참조 무결성 제약
> FK 값은 참조하는 표의 **실제 PK 값이거나 NULL**
result 같은 표도 가리킬 수 있어 | EMPLOYEE.Super_ssn → EMPLOYEE.Ssn
= 이처럼 다른 표를 가리키는 값은 **실제로 있는 튜플**을 가리켜야 해.
`,
  "update-violations": `
? 예시: 넣기 · 지우기 · 고치기 중 무엇이 위험할까?
icon ⚠️
상황: 직원 표와 부서 표에 데이터를 넣고, 지우고, 고쳐 보자.
list 연산마다 어길 수 있는 규칙
- 넣기(Insert): 학번 중복 · PK가 NULL · 없는 부서 | 키 · 개체 · 참조 **모두**
- 지우기(Delete): 누가 나를 가리키는데 사라짐 | **참조**만
- 고치기(Update): PK나 FK를 바꿀 때 | **키 · 참조**
box Insert가 가장 위험하다
result 외울 것 | Insert 전부 / Delete 참조 / Update 키·참조
= 이처럼 **넣기는 세 규칙 다, 지우기는 참조만** 어길 수 있다는 게 시험 단골이야.
`,
  "map-entity": `
? 예시: 직원 엔티티를 표로 옮기기
icon 🧾
상황: ER에 EMPLOYEE(Ssn, Name(Fname, Minit, Lname), Salary)가 있어.
list 옮기는 법
- 엔티티 EMPLOYEE | 표 하나
- 단순 속성 Ssn, Salary | 열 그대로
- 복합 속성 Name | Fname, Minit, Lname **세 열로**
- 키 Ssn | **기본키**
result 결과 | EMPLOYEE(**Ssn**, Fname, Minit, Lname, Salary)
= 이처럼 **엔티티 하나 = 표 하나**, 복합 속성은 조각만 열로 넣어.
`,
  "map-multivalued": `
? 예시: 부서 위치가 여러 곳이면?
icon 📍
상황: 5번 부서는 서울, 대전, 부산에 있어. 한 칸에 세 곳을 넣을 수 있을까? (원자값 규칙상 ❌)
list 새 표 DEPT_LOCATIONS
- 5 | 서울
- 5 | 대전
- 5 | 부산
box 다중값 속성 → 별도 릴레이션
> 원래 표의 PK(Dnumber)를 FK로 같이 넣는다
result 기본키 | (Dnumber, Dlocation) 조합
= 이처럼 다중값 속성은 **새 표를 만들고 부서 번호를 반복**해서 담아.
`,
  "map-weak": `
? 예시: 부양가족 표 만들기
icon 👨‍👩‍👧
상황: 부양가족은 이름만으로 구별이 안 되지? 주인(직원)의 Ssn이 필요해.
list DEPENDENT 표
- 주인 직원의 Ssn | **Essn** (FK)
- 부양가족 이름 | Dependent_name (부분 키)
- 성별, 생일, 관계 | 나머지 속성
box 기본키 = 주인의 PK + 부분 키
> FK를 넣는 순간 식별 관계도 함께 표현됨
result 결과 | DEPENDENT(**Essn, Dependent_name**, Sex, Bdate, Relationship)
= 이처럼 약한 엔티티는 **주인의 PK를 빌려** 기본키를 만들어.
`,
  "map-1to1": `
? 예시: 부서장(MANAGES)을 어느 표에 적을까?
icon 👔
상황: 부서 하나에 부서장 한 명(1:1). 모든 부서엔 부서장이 있지만, 대부분 직원은 부서장이 아니야.
list FK를 어디에 넣을까
- 직원 표에 "맡은 부서" | 대부분 **NULL** ❌
- 부서 표에 Mgr_ssn | 모든 행에 값 있음 ✅
box total 참여 쪽에 FK를 넣는다
> 관계 속성(Mgr_start_date)도 같은 표에
result 결과 | DEPARTMENT(…, Mgr_ssn, Mgr_start_date)
= 이처럼 1:1은 **외래키 방식**이 기본이고, NULL이 적게 생기는 **total 쪽**에 넣어.
`,
  "map-1toN": `
? 예시: 직원이 어느 부서 소속인지 적기
icon 🏢
상황: 부서 하나에 직원 여러 명(1:N). 어느 표에 칸을 만들까?
list 두 가지 시도
- 부서 표에 직원 칸 | 칸이 여러 개 필요 ❌ (원자값 위반)
- 직원 표에 Dno 칸 | 직원마다 부서 하나 ✅
box N쪽 표에 1쪽의 PK를 FK로
result 예 | EMPLOYEE.Dno · PROJECT.Dnum · EMPLOYEE.Super_ssn
= 이처럼 1:N은 **N쪽에 FK 하나**만 넣으면 끝이야.
`,
  "map-MtoN": `
? 예시: 직원과 프로젝트 (서로 여럿)
icon 🧑‍💻
상황: 민수는 프로젝트 A·B에, 프로젝트 A에는 민수·지영이 참여해(M:N).
list 연결 표 WORKS_ON
- 민수 | A, 10시간
- 민수 | B, 5시간
- 지영 | A, 20시간
box M:N은 연결 표 말고 방법이 없다
> 양쪽 PK를 FK로 넣고, 둘을 합쳐 PK
result 결과 | WORKS_ON(**Essn, Pno**, Hours)
= 이처럼 M:N은 **관계 릴레이션**을 따로 만들어야 해. 관계 속성(Hours)도 여기에!
`,
  "map-nary": `
? 예시: 누가 · 어느 프로젝트에 · 어떤 부품을 공급했나
icon 🚚
상황: 공급자, 프로젝트, 부품 세 엔티티가 함께 참여하는 SUPPLY 관계(3항)가 있어.
list 연결 표 SUPPLY
- 공급자 이름 | Sname (FK)
- 프로젝트 이름 | Proj_name (FK)
- 부품 번호 | Part_no (FK)
- 수량 | Quantity (관계 속성)
box N항 관계 = M:N과 같은 방식
> 참여하는 모든 엔티티의 PK를 FK로, 그 조합이 PK
result 결과 | SUPPLY(**Sname, Proj_name, Part_no**, Quantity)
= 이처럼 3항 이상은 **FK n개를 담은 연결 표**로 옮겨.
`,
  "er-rel-correspondence": `
? 예시: ER 그림을 표로 번역하는 사전
icon 📖
상황: 시험에 ER 다이어그램이 나오면 이 사전대로 옮기면 돼.
list 번역 사전
- 엔티티 타입 | 표
- 1:1 · 1:N 관계 | FK
- M:N 관계 | 연결 표 + FK 2개
- n항 관계 | 연결 표 + FK n개
- 복합 속성 | 조각 열들
- 다중값 속성 | 새 표 + FK
- 키 속성 | 기본키(또는 UNIQUE)
result 한 줄 | 엔티티는 표, 관계는 FK 또는 연결 표
= 이처럼 **대응표 하나만 외우면** 어떤 ER도 관계 스키마로 옮길 수 있어.
`,
};
