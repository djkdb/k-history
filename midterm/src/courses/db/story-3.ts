/** 쉬운 설명 칸 — SQL · 뷰 · 관계 대수 */
export const STORY_3: Record<string, string> = {
  "sql-intro": `
? 예시: 식당에서 주문할 때
icon 🧑‍🍳
상황: 손님은 "김치찌개 하나요"라고 **무엇을** 원하는지만 말해. 어떻게 끓일지는 주방이 정하지.
list SQL도 똑같아
- 표를 만들고 고치고 없애는 말 | **DDL** (CREATE · ALTER · DROP)
- 행을 찾고 넣고 지우고 고치는 말 | **DML** (SELECT · INSERT · DELETE · UPDATE)
box SQL = 선언적(declarative) 언어
> 무엇을 원하는지만 적고, 어떻게 찾을지는 DBMS가 정함
result 처음 이름 | SEQUEL (IBM의 첫 DBMS용)
= 이처럼 SQL은 **'무엇을'만 말하는 언어**야. 반대로 관계 대수는 '어떤 순서로'를 적는 절차적 언어고.
`,
  "create-table": `
? 예시: 회원 명부 양식을 처음 만든다면?
icon 🧱
상황: 빈 직원 표를 만들면서 칸마다 규칙을 붙여 보자.
list 칸마다 붙이는 규칙
- 이름은 꼭 써야 함 | **NOT NULL**
- 부서를 안 적으면 1번 부서 | **DEFAULT 1**
- 직원을 대표하는 번호 | **PRIMARY KEY (Ssn)**
- 겹치면 안 되는 다른 번호 | **UNIQUE**
- 부서 번호는 부서 표에 있어야 함 | **FOREIGN KEY … REFERENCES**
box CREATE TABLE = 이름 + 열(이름, 타입) + 제약
result 덤 | PK 열에는 NOT NULL이 자동으로 붙어
= 이처럼 표를 만들 때 **규칙까지 같이 적어 두면** DBMS가 알아서 지켜 줘.
`,
  "ref-triggered-actions": `
? 예시: 상사가 퇴사하면 부하 직원은?
icon 🚪
상황: 상사 민수가 회사를 나가 직원 표에서 지워졌어. 부하들의 Super_ssn에는 아직 민수 번호가 있어.
list 미리 정해 둘 수 있는 동작
- 아무것도 안 정함 | 삭제 **거부** (기본)
- ON DELETE SET NULL | 부하들의 상사 칸 → NULL
- ON DELETE CASCADE | 가리키던 행도 같이 삭제
- ON DELETE SET DEFAULT | 기본값으로
box 참조되는 PK가 지워지거나 바뀔 때 할 일
result 기본값 | REJECT (연산을 막음)
= 이처럼 FK에 **ON DELETE / ON UPDATE + 동작**을 붙여 참조 무결성을 지키는 방법을 정해.
`,
  "insert-delete-update": `
? 예시: 출석부에 쓰고, 지우고, 고치기
icon ✍️
상황: 직원 표에 새 직원을 넣고, 퇴사자를 지우고, 월급을 올려 보자.
list 세 가지 명령
- 새 직원 한 명 추가 | **INSERT INTO … VALUES**
- 퇴사자 삭제 | **DELETE FROM … WHERE**
- 5번 부서 월급 10% 인상 | **UPDATE … SET … WHERE**
box ⚠️ WHERE를 빼먹으면
> DELETE는 표 전체 삭제, UPDATE는 전체 수정!
result 기억 | DELETE·UPDATE는 한 번에 한 표만
= 이처럼 **INSERT는 한 행, DELETE·UPDATE는 WHERE로 고른 행들**을 다뤄.
`,
  "select-basic": `
? 예시: "연구부 직원 이름과 주소를 보여 줘"
icon 🔍
상황: 이름·주소는 직원 표에, 부서 이름은 부서 표에 있어.
list SELECT 문의 세 칸
- 보여 줄 열: 이름, 주소 | **SELECT** Fname, Address
- 재료 표: 직원, 부서 | **FROM** EMPLOYEE, DEPARTMENT
- 고를 조건 | **WHERE** Dname = 'Research'
- 두 표 잇는 조건 | AND **Dnumber = Dno**
box ⚠️ 조인 조건을 빼먹으면
> 모든 조합(곱)이 나와 결과가 폭발해
result 순서 | 무엇을(SELECT) · 어디서(FROM) · 어떤 것만(WHERE)
= 이처럼 표가 둘 이상이면 WHERE에 **선택 조건 + 조인 조건**을 함께 써.
`,
  "multiset": `
? 예시: 직원들의 월급 목록을 뽑으면?
icon 🧮
상황: 월급이 25000인 직원이 세 명이야. SELECT Salary를 하면?
list 결과
- SELECT Salary | 25000이 **세 번** 나옴
- SELECT DISTINCT Salary | 25000이 **한 번**
- A UNION B | 중복 **제거** (기본이 집합)
- A UNION ALL B | 중복 **유지**
box SQL 표 = 다중집합(multiset)
> 같은 행이 여러 번 있을 수 있다
result 반대로 외우기 | SELECT 기본 = ALL, UNION 기본 = 중복 제거
= 이처럼 SQL은 중복을 **자동으로 지우지 않아**. 지우려면 DISTINCT!
`,
  "order-arith-between": `
? 예시: 월급을 올려서 정렬해 보기
icon 📈
상황: ProductX 프로젝트 직원들이 월급을 10% 올리면 얼마일지 궁금해.
list 쓰는 도구
- 1.1 * Salary AS Increased_sal | **산술 연산**
- Salary BETWEEN 30000 AND 40000 | **범위** (양 끝 포함)
- ORDER BY Dname, Lname | **정렬** (기본 오름차순)
- ORDER BY Salary DESC | 내림차순
result 기억 | BETWEEN a AND b = a 이상 b 이하
= 이처럼 결과를 **계산하고, 범위로 고르고, 정렬**할 수 있어.
`,
  "nested-query": `
? 예시: "스미스가 일하는 프로젝트를 다 보여 줘"
icon 🪆
상황: 먼저 스미스의 프로젝트 번호를 알아야 그 프로젝트들을 고를 수 있어.
list 질문 안의 질문
- 안쪽: 스미스의 프로젝트 번호 | {1, 2}
- 바깥: 번호가 {1, 2} 안(IN)에 있는 프로젝트 | ProductX, ProductY
box 비교 연산자
> IN = 목록 안에 있다 · = ANY = 하나라도 같다 · > ALL = 전부보다 크다
result 예 | "5번 부서 모든 직원보다 월급이 많은" → > ALL
= 이처럼 **안쪽 질의 결과를 바깥 조건에 쓰는 것**이 중첩 질의야.
`,
  "exists": `
? 예시: "부양가족이 없는 직원은?"
icon 🙋
상황: 직원마다 "이 사람의 부양가족이 한 명이라도 있나?"를 확인해 보자.
list 직원별로 안쪽 질의 실행
- 민수: 부양가족 2명 | EXISTS 참 → NOT EXISTS 거짓
- 지영: 부양가족 0명 | NOT EXISTS **참** ✅
box EXISTS = 결과가 한 줄이라도 있으면 참
> NOT EXISTS = 하나도 없으면 참
result 짝꿍 | 바깥 행을 참조하는 **상관 중첩 질의**와 함께 씀
= 이처럼 "~가 있는/없는" 질문은 **EXISTS / NOT EXISTS**로 풀어.
`,
  "joined-tables": `
? 예시: 직원과 상사 이름을 나란히
icon 👥
상황: 직원 표를 자기 자신과 이어서 직원 이름 옆에 상사 이름을 붙여 보자. 사장 Borg는 상사가 없어.
list 조인 종류별 결과
- INNER JOIN | 짝 있는 행만 → **Borg 빠짐**
- LEFT OUTER JOIN | Borg도 나옴, 상사 칸 **NULL**
- RIGHT / FULL OUTER JOIN | 오른쪽 / 양쪽 다 남김
box 조인 테이블 = FROM 절에서 조인하기
> 조건을 WHERE에 섞지 않아 읽기 쉬움
result 기본 | INNER JOIN
= 이처럼 **짝이 없는 행도 남기고 싶으면 외부 조인**을 써.
`,
  "aggregate": `
? 예시: 직원 월급 통계 내기
icon 📊
상황: 직원 표 전체를 한 줄로 요약해 보자.
list 집계 함수
- 직원 수 | **COUNT(*)**
- 월급 합 | **SUM(Salary)**
- 최고 · 최저 월급 | **MAX · MIN**
- 평균 월급 | **AVG**
- 서로 다른 월급 개수 | COUNT(DISTINCT Salary)
box 여러 행 → 한 줄 요약
> SELECT 절이나 HAVING 절에 쓴다
result 기억 | COUNT(*)는 행 수, COUNT(열)은 NULL을 안 셈
= 이처럼 집계 함수는 **여러 튜플을 하나의 숫자로** 요약해.
`,
  "group-having": `
? 예시: 부서별 평균 월급, 직원 5명 넘는 부서만
icon 🧺
상황: 직원들을 부서별 바구니에 나눠 담고, 바구니마다 평균을 내 보자.
list 단계
- 월급 40000 넘는 직원만 | **WHERE** (행 거르기)
- 부서 번호로 바구니 나누기 | **GROUP BY Dno**
- 바구니마다 COUNT, AVG | 집계
- 직원 5명 넘는 바구니만 | **HAVING COUNT(*) > 5**
box WHERE vs HAVING
> WHERE는 행을, HAVING은 그룹을 거른다
result 순서 | WHERE → GROUP BY → HAVING
= 이처럼 **그룹 조건은 HAVING**에 써야 해. 단골 함정!
`,
  "assertion": `
? 예시: "직원 월급이 부서장보다 많으면 안 된다"
icon 🛡️
상황: 이 규칙은 키·개체·참조 무결성 어디에도 안 들어가.
list 어서션 만들기
- 규칙을 어기는 직원을 찾는 질의 | SELECT … WHERE E.Salary > M.Salary
- 그런 직원이 없어야 함 | **CHECK (NOT EXISTS (…))**
- CREATE ASSERTION SALARY_CONSTRAINT | 이름 붙이기
box 어서션 = 늘 참이어야 하는 일반 규칙
> 어기는 갱신은 거부
result 꼴 | NOT EXISTS (위반하는 행)
= 이처럼 기본 제약으로 못 거는 규칙은 **어서션**으로 걸어.
`,
  "trigger": `
? 예시: 월급이 상사보다 높아지면 알림
icon 🔔
상황: 누군가의 월급을 고쳤는데 상사보다 높아졌다면, 상사에게 자동으로 알리고 싶어.
list ECA 규칙
- 월급을 INSERT 하거나 UPDATE 할 때 | **Event**
- 새 월급 > 상사 월급이면 | **Condition**
- 상사에게 알리는 프로시저 실행 | **Action**
box 트리거 = 자동 반응 규칙
result 어서션과 차이 | 어서션은 거부, 트리거는 자동 동작
= 이처럼 **"이런 일이 생기면 이렇게 해"** 를 미리 걸어 두는 게 트리거야.
`,
  "view-concept": `
? 예시: 자주 쓰는 질의에 이름 붙이기
icon 🪟
상황: "직원 이름, 프로젝트 이름, 근무 시간"을 보려고 매번 표 세 개를 조인하기 귀찮아.
list 뷰를 만들면
- CREATE VIEW WORKS_ON1 AS (조인 질의) | 이름 붙이기
- SELECT * FROM WORKS_ON1 | 표처럼 조회
- 실제 데이터 | 원래 표에만 있음
box 뷰 = 가상 테이블
> 물리적으로 꼭 저장되지 않는다
result 검색은 자유 | 갱신은 제한적
= 이처럼 뷰는 **복잡한 질의를 짧게 쓰려고** 만드는 가상 표야.
`,
  "view-implementation": `
? 예시: 뷰를 물어볼 때마다 계산할까, 만들어 둘까?
icon ⚙️
상황: WORKS_ON1 뷰를 자주 조회한다고 해 보자.
list 두 가지 방법
- 물을 때마다 원본 표 질의로 번역 | **질의 수정**
- 처음 물을 때 진짜 표로 만들어 재사용 | **뷰 실체화**
box 장단점
> 질의 수정: 저장 X, 대신 복잡한 뷰는 매번 다시 계산
> 실체화: 빠름, 대신 원본이 바뀌면 갱신 필요(점진적 갱신)
result 실체화된 뷰는 | 안 쓰이면 일정 시간 뒤 지움
= 이처럼 뷰는 **그때그때 번역하거나, 만들어 두고 고쳐 쓰는** 두 방식으로 구현해.
`,
  "view-update": `
? 예시: 뷰를 고치면 원본은 어떻게 바뀔까?
icon ✏️
상황: 뷰에 UPDATE를 하면 결국 원본 표를 고쳐야 해. 그런데 어떻게 고칠지 하나로 정해질까?
list 뷰 종류별
- 표 하나 + PK 포함 뷰 | 고치는 법이 하나 → **갱신 가능** ✅
- 조인 뷰: "스미스의 프로젝트를 ProductY로" | 해석이 여러 개 → 대개 **불가**
- 집계 뷰: Total_sal = 100000으로 | 누구 월급을? → **불가** ❌
box 원본 갱신이 딱 하나로 정해질 때만 가능
result 옵션 | WITH CHECK OPTION
= 이처럼 **원본에 어떻게 반영할지 하나로 정해져야** 뷰를 고칠 수 있어.
`,
  "view-authorization": `
? 예시: 5번 부서장에게 자기 부서만 보여 주기
icon 🔒
상황: 부서장에게 직원 표 전체를 보여 주면 다른 부서 월급까지 보이겠지?
list 필요한 만큼만 보이는 뷰
- 5번 부서 직원 행만 | DEPT5EMP (행 숨기기)
- 이름·주소 열만 | BASIC_EMP_DATA (열 숨기기)
box 뷰에만 권한을 준다
> 원본 표 권한은 주지 않는다
result 효과 | 보여 줄 행·열만 정확히 공개
= 이처럼 뷰는 **보안(권한 부여) 수단**으로도 써.
`,
  "ra-intro": `
? 예시: 레시피를 순서대로 적기
icon 🧪
상황: SQL이 "김치찌개 주세요"라면, 관계 대수는 "김치를 썰고 → 끓이고 → 간을 맞춘다"야.
list 관계 대수
- 어떤 순서로 어떤 연산을 | **절차적**(procedural)
- 연산 결과도 릴레이션 | 다시 연산 가능
- DBMS 내부에서 질의 실행·최적화 | 바탕 이론
result 비교 | SQL = 선언적, 관계 대수 = 절차적
= 이처럼 관계 대수는 **데이터를 얻는 과정을 수학 연산으로** 적는 모델이야.
`,
  "ra-select": `
? 예시: 4번 부서이면서 월급 25000 넘는 직원
icon ✂️
상황: 직원 표에서 조건에 맞는 **행**만 골라내 보자.
list σ Dno=4 AND Salary>25000 (EMPLOYEE)
- Wallace, 4번, 43000 | 남음 ✅
- Zelaya, 4번, 25000 | 빠짐 (25000 초과 아님)
- Smith, 5번, 30000 | 빠짐 (5번 부서)
box σ = 행 고르기 (가로로 자르기)
> 열은 그대로 → 차수 그대로
result 함정 | SQL의 SELECT 절은 오히려 π
= 이처럼 σ(시그마)는 **조건에 맞는 튜플만** 남겨.
`,
  "ra-project": `
? 예시: 직원들의 성별과 월급만 보기
icon 📏
상황: 직원 표에서 Sex, Salary 열만 남겨 보자. (F, 25000)인 직원이 두 명이야.
list π Sex, Salary (EMPLOYEE)
- M, 30000 | 남음
- F, 25000 | **한 번만** 남음
- F, 43000 | 남음
box π = 열 고르기 (세로로 자르기)
> 결과는 집합 → 중복 행 자동 제거
result 차수 | 고른 속성 수
= 이처럼 π(파이)는 **필요한 열만** 남기고 중복은 지워.
`,
  "ra-rename-sequence": `
? 예시: 한 줄에 다 쓸까, 단계별로 쓸까?
icon 🪜
상황: "5번 부서 직원의 이름과 월급"을 구해 보자.
list 두 가지 쓰기
- 한 줄: π Fname, Salary (σ Dno=5 (EMPLOYEE)) | **중첩**
- 단계: DEP5 ← σ Dno=5 (EMPLOYEE) | 중간 결과에 이름
- 그다음: RESULT ← π Fname, Salary (DEP5) | 한 단계씩
box ρ (로) = 이름 바꾸기
> 릴레이션 이름, 속성 이름, 또는 둘 다
result 쓸모 | 자연 조인 전에 열 이름 맞출 때
= 이처럼 연산은 **중첩하거나 단계별로** 이어 쓰고, ρ로 이름을 바꿔.
`,
  "ra-set-ops": `
? 예시: 5번 부서 직원 + 그 직원들의 상사
icon ⭕
상황: 두 결과를 합치려면 열 모양이 같아야 해.
list 집합 연산
- 둘 중 하나라도 | **∪** 합집합
- 둘 다 | **∩** 교집합
- 왼쪽에만 | **−** 차집합
box type compatible이어야 한다
> 열 개수가 같고, 대응 열의 도메인이 같아야
result 결과 | 중복은 제거
= 이처럼 집합 연산은 **모양이 같은 두 릴레이션**에만 쓸 수 있어.
`,
  "ra-cartesian": `
? 예시: 여직원 3명 × 부양가족 7명
icon ✖️
상황: 여직원 표와 부양가족 표를 × 하면 몇 행이 나올까?
list 결과
- 행 수 | 3 × 7 = **21행**
- 대부분 | 엉뚱한 짝 (남의 가족)
- 뒤에 σ Ssn=Essn | 진짜 짝만 남음
box × = 가능한 모든 짝 맞추기
> type compatible 아니어도 됨
result 계산 | 튜플 3개·속성 4개 × 튜플 5개·속성 2개 → 15행 · 6열
= 이처럼 카티션 곱은 혼자선 의미가 적고, **σ를 붙이면 조인**이 돼.
`,
  "ra-join": `
? 예시: 부서와 그 부서장 이름 붙이기
icon 🧷
상황: DEPARTMENT의 Mgr_ssn과 EMPLOYEE의 Ssn이 같은 짝만 이어 붙이자.
list 조인 종류
- × 하고 σ 한 걸 한 번에 | **⋈ (theta join)**
- 조건이 = 뿐 | **동등 조인** (같은 값 열이 두 번)
- 같은 이름 열을 하나로 | **자연 조인 (*)**
box 자연 조인 전에
> 열 이름이 같아야 하니 필요하면 ρ로 맞춘다
result 식 | DEPARTMENT ⋈ Mgr_ssn=Ssn EMPLOYEE
= 이처럼 조인은 **관련된 튜플을 한 줄로** 합치는 연산이야.
`,
  "ra-complete-set": `
? 예시: 레고 기본 블록 다섯 개
icon 🧱
상황: 기본 블록만 있으면 어떤 모양이든 만들 수 있어.
list 완전 집합 {σ, π, ∪, −, ×}
- ∩ | (R ∪ S) − ((R − S) ∪ (S − R))
- ⋈ | σ(R × S)
- 그래도 ∩, ⋈는 | 자주 써서 따로 둠
box 질의 트리
> 잎 = 입력 표, 안쪽 노드 = 연산, 아래에서 위로 실행
result 핵심 | 다섯 연산이면 나머지를 다 만든다
= 이처럼 **기본 다섯 연산**으로 다른 연산을 모두 표현할 수 있어.
`,
  "ra-aggregate": `
? 예시: 부서별 인원과 평균 월급
icon 📊
상황: 기본 연산(σ, π…)만으로는 "평균"을 못 구해. 새 기호가 필요해.
list Dno ℑ COUNT Ssn, AVERAGE Salary (EMPLOYEE)
- 5번 부서 | 4명, 33250
- 4번 부서 | 3명, 31000
- 1번 부서 | 1명, 55000
box ℑ = 그룹 + 집계
> 왼쪽 아래 그룹 속성, 오른쪽에 (함수 속성) 목록
result 그룹 속성이 없으면 | 전체를 한 줄로 요약
= 이처럼 ℑ(스크립트 F)는 관계 대수판 **GROUP BY + 집계 함수**야.
`,
  "ra-outer-join": `
? 예시: 부서를 안 맡은 직원도 다 보고 싶다
icon 🧩
상황: 직원 ⋈ 부서(부서장 기준)를 하면 부서장이 아닌 직원은 사라져.
list 외부 조인
- 왼쪽(직원)은 다 남김 | **⟕ left**
- 오른쪽은 다 남김 | **⟖ right**
- 양쪽 다 남김 | **⟗ full**
box 짝 없는 칸은 NULL로 채운다
result 일반 조인과 차이 | 짝 없는 튜플을 버리지 않음
= 이처럼 **짝이 없어도 남기고 싶을 때** 외부 조인을 써.
`,
  "ra-division": `
? 예시: 스미스가 하는 프로젝트를 "전부" 하는 직원
icon ➗
상황: 스미스의 프로젝트는 {1, 2}야. 이 둘을 모두 하는 직원을 찾자.
list R(Essn, Pno)
- a | 1, 2 → **둘 다** ✅
- b | 1만 → 2가 없음 ❌
- c | 1, 2, 3 → **둘 다 포함** ✅
box R ÷ S
> S의 모든 값과 짝지어 나오는 나머지 열 값만 남김
result 결과 | {a, c}
= 이처럼 **"모든 ~를 하는"** 질의는 나눗셈 ÷으로 풀어.
`,
  "sql-practice3-write": `
? 예시: 말로 된 질문을 SQL로 옮기기
icon 🗣️
상황: 실습 3처럼 자연어 질문을 SQL로 바꾸는 요령이야.
list 말 → SQL 패턴
- "가장 월급이 높은" | = (SELECT **MAX**(…))
- "상사의 상사" | 서브쿼리 **두 단계**
- "모두 A인" | A가 아닌 게 **없다** → NOT EXISTS (… <> 'A')
- "~가 없는" | **NOT EXISTS**
result 요령 | 말을 먼저 조건으로 바꾸고, 그다음 SQL로
= 이처럼 자연어의 **'가장 · 모두 · 없다'** 를 각각 MAX · NOT EXISTS 꼴로 옮겨.
`,
  "sql-practice3-errors": `
? 예시: 직원이 0명인 프로젝트가 사라졌다?
icon 🐞
상황: "프로젝트별 직원 수"를 INNER JOIN + WHERE로 구했더니 직원 0명인 P20이 결과에 없어.
list 원인과 고치기
- 내부 조인은 짝 없는 행을 버림 | → **LEFT JOIN**
- 오른쪽 조건을 WHERE에 두면 다시 사라짐 | → 조건은 **ON**에
- COUNT(*)는 NULL 행도 1로 셈 | → **COUNT(W.Essn)**
box 또 하나의 오류
> 필요 없는 조인 때문에 행이 중복돼 숫자가 부풀어
result 결과 | P20 = 0 이 제대로 나옴
= 이처럼 SQL은 **손으로 실행해 보며** 0인 그룹과 중복을 꼭 확인해.
`,
};
