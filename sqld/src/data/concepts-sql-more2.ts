import type { Concept } from "@/lib/types";

/**
 * 2과목 보강.
 *
 * 2과목은 40문항 80점이다. 앞 파일들이 큰 줄기는 덮었지만, 한 개념 안에
 * 여러 절이 뭉쳐 있어 문제가 얇게 나오던 자리를 갈라 놓았다.
 *   · 윈도우 함수 하나에 순위·행이동·비율이 다 들어 있던 것을 나눴다
 *   · 서브쿼리에서 EXISTS·ANY·ALL 을 따로 뺐다
 *   · 집합 연산자의 INTERSECT·MINUS, 셀프 조인, 순수 관계 연산자를 채웠다
 *   · DELETE·TRUNCATE·DROP 처럼 시험이 늘 함께 묻는 셋을 한 자리에 모았다
 *
 * 곁들인 쿼리는 모두 실습판(emp·dept)에서 실제로 돌아가는 것만 넣었다.
 * (scripts/audit.ts 가 배포 전에 전부 실행해 본다)
 */
export const CONCEPTS_SQL_MORE2: Concept[] = [
  /* ───────────── SQL 기본 ───────────── */
  {
    id: "s-relational-ops",
    subject: "sql",
    chapter: "s-basic",
    title: "순수 관계 연산자와 SQL 문장의 대응",
    term: "순수 관계 연산자",
    summary:
      "셀렉션은 WHERE, 프로젝션은 SELECT 절, 조인은 JOIN, 디비전은 나누기에 해당한다.",
    detail:
      "관계형 데이터베이스의 뿌리인 관계 대수에는 일반 집합 연산자(합집합·교집합·차집합·곱집합)와 순수 관계 연산자(셀렉션·프로젝션·조인·디비전)가 있다. 셀렉션은 행을 고르는 것이라 WHERE 절이 되고, 프로젝션은 열을 고르는 것이라 SELECT 뒤의 열 목록이 된다. 조인은 두 릴레이션을 이어 붙이는 것이고, 디비전은 '모두 만족하는 것만 남기기'로 SQL 에는 전용 문법이 없어 NOT EXISTS 를 두 번 겹쳐 흉내 낸다.",
    examPoint:
      "셀렉션과 프로젝션을 맞바꾼 선지가 단골이다. '셀렉션 = 가로줄(행), 프로젝션 = 세로줄(열)'로 못 박아 둔다. 합집합·교집합은 순수 관계 연산자가 아니라 일반 집합 연산자라는 점도 자주 묻는다.",
    importance: 4,
    keywords: ["셀렉션", "프로젝션", "조인", "디비전", "관계 대수"],
    traps: [
      {
        concept: "셀렉션 vs 프로젝션",
        difference:
          "셀렉션은 조건에 맞는 행을 고르는 것(WHERE)이고, 프로젝션은 필요한 열만 고르는 것(SELECT 절)이다.",
        wrong:
          "셀렉션은 필요한 열만 고르는 것이고, 프로젝션은 조건에 맞는 행을 고르는 것이다.",
      },
      {
        concept: "순수 관계 연산자 vs 일반 집합 연산자",
        difference:
          "순수 관계 연산자는 셀렉션·프로젝션·조인·디비전 넷이고, 합집합·교집합·차집합·곱집합은 일반 집합 연산자다.",
        wrong:
          "순수 관계 연산자는 합집합·교집합·차집합·곱집합 넷이고, 셀렉션과 프로젝션은 일반 집합 연산자에 속한다.",
      },
    ],
    table: {
      title: "관계 대수와 SQL",
      headers: ["연산자", "하는 일", "SQL 에서"],
      rows: [
        ["셀렉션", "조건에 맞는 행 고르기", "WHERE"],
        ["프로젝션", "필요한 열 고르기", "SELECT 열목록"],
        ["조인", "두 표를 이어 붙이기", "JOIN … ON"],
        ["디비전", "모두 만족하는 것만", "NOT EXISTS 중첩"],
      ],
    },
  },
  {
    id: "s-null-functions",
    subject: "sql",
    chapter: "s-basic",
    title: "NULL 을 다루는 함수 — NVL·NVL2·NULLIF·COALESCE",
    term: "NULL 관련 함수",
    summary:
      "NVL 은 NULL 일 때 대신 쓸 값을, NVL2 는 NULL 여부에 따라 서로 다른 값을, NULLIF 는 두 값이 같으면 NULL 을, COALESCE 는 여럿 중 처음 만나는 NULL 아닌 값을 돌려준다.",
    detail:
      "NVL(a, b) 는 a 가 NULL 이면 b 를 준다. NVL2(a, b, c) 는 a 가 NULL 이 아니면 b, NULL 이면 c 를 주므로 인자 순서가 NVL 과 반대로 느껴져 헷갈린다. NULLIF(a, b) 는 두 값이 같을 때 NULL 을 주고 다르면 a 를 준다 — 특정 값을 집계에서 빼고 싶을 때 쓴다. COALESCE(a, b, c, …) 는 왼쪽부터 훑어 처음 만나는 NULL 아닌 값을 준다. 넷 다 인자의 자료형이 서로 맞아야 한다.",
    examPoint:
      "NVL2 의 두 번째·세 번째 인자를 맞바꾼 선지가 가장 많이 나온다. NVL2(a, b, c) 는 'a 가 있으면 b, 없으면 c' 다. NULLIF 를 '두 값이 다르면 NULL' 로 뒤집어 놓은 선지도 흔하다.",
    importance: 5,
    keywords: ["NVL", "NVL2", "NULLIF", "COALESCE"],
    traps: [
      {
        concept: "NVL vs NVL2",
        difference:
          "NVL(a, b) 는 a 가 NULL 일 때만 b 를 준다. NVL2(a, b, c) 는 a 가 NULL 이 아니면 b, NULL 이면 c 를 준다.",
        wrong:
          "NVL2(a, b, c) 는 a 가 NULL 이면 b 를, NULL 이 아니면 c 를 돌려준다.",
      },
      {
        concept: "NULLIF vs COALESCE",
        difference:
          "NULLIF 는 두 값이 같을 때 NULL 을 만들어 내고, COALESCE 는 여럿 중 처음 만나는 NULL 아닌 값을 골라 낸다.",
        wrong:
          "NULLIF 는 두 값이 다를 때 NULL 을 만들고, COALESCE 는 인자 중 마지막 값을 돌려준다.",
      },
    ],
    table: {
      title: "네 함수",
      headers: ["함수", "돌려주는 값"],
      rows: [
        ["NVL(a, b)", "a 가 NULL 이면 b, 아니면 a"],
        ["NVL2(a, b, c)", "a 가 NULL 이 아니면 b, NULL 이면 c"],
        ["NULLIF(a, b)", "a 와 b 가 같으면 NULL, 다르면 a"],
        ["COALESCE(a, b, …)", "왼쪽부터 처음 만나는 NULL 아닌 값"],
      ],
    },
    sql: {
      caption:
        "보너스가 NULL 인 사람에게 0을 채워 넣고, 급여가 정확히 600인 사람만 NULL 로 만들어 본다.",
      query: `SELECT ename,
       bonus,
       NVL(bonus, 0)      AS 널이면0,
       COALESCE(bonus, 0) AS 코얼레스,
       NULLIF(sal, 600)   AS 육백이면널
FROM emp
ORDER BY empno;`,
    },
  },
  {
    id: "s-operator-order",
    subject: "sql",
    chapter: "s-basic",
    title: "연산자 우선순위와 문자열 붙이기",
    term: "연산자 우선순위",
    summary:
      "괄호가 없으면 NOT → AND → OR 순으로 묶인다. 문자열은 || 로 잇는다.",
    detail:
      "WHERE 절에 AND 와 OR 가 섞여 있으면 AND 가 먼저 묶인다. 그래서 'A OR B AND C' 는 'A OR (B AND C)' 로 읽힌다. 의도가 '(A OR B) AND C' 였다면 결과가 통째로 달라지므로 괄호를 직접 쳐야 한다. 비교 연산자는 논리 연산자보다 먼저 계산되고, 산술 연산자는 그보다도 먼저다. 문자열을 잇는 것은 || 이며, 숫자와 이어 붙이면 숫자가 문자로 자동 변환된다.",
    examPoint:
      "괄호 없이 AND 와 OR 를 섞어 놓고 결과 행 수를 묻는 문제가 나온다. 눈으로 읽지 말고 AND 부터 괄호를 쳐 보는 것이 빠르다.",
    importance: 4,
    keywords: ["연산자 우선순위", "AND", "OR", "NOT", "문자열 결합"],
    traps: [
      {
        concept: "AND 와 OR 의 우선순위",
        difference:
          "괄호가 없으면 AND 가 OR 보다 먼저 묶인다. 'A OR B AND C' 는 'A OR (B AND C)' 다.",
        wrong:
          "괄호가 없으면 OR 가 AND 보다 먼저 묶여 'A OR B AND C' 는 '(A OR B) AND C' 로 계산된다.",
      },
    ],
    sql: {
      caption:
        "괄호 하나로 결과가 갈린다. 두 줄의 행 수가 왜 다른지 직접 세어 보자.",
      query: `SELECT '괄호 없음' AS 구분, COUNT(*) AS 행수
FROM emp
WHERE deptno = 20 OR deptno = 30 AND sal >= 450
UNION ALL
SELECT '괄호 있음', COUNT(*)
FROM emp
WHERE (deptno = 20 OR deptno = 30) AND sal >= 450;`,
    },
  },
  {
    id: "s-join-self",
    subject: "sql",
    chapter: "s-basic",
    title: "셀프 조인 — 같은 표를 두 번 부르기",
    term: "셀프 조인",
    summary:
      "한 표 안에서 행끼리 이어야 할 때, 같은 표에 서로 다른 별칭을 붙여 두 표처럼 조인한다.",
    detail:
      "사원과 그 사원의 관리자가 같은 emp 표에 들어 있는 것이 전형적인 경우다. e.mgr 와 m.empno 를 견주면 사원 옆에 관리자 이름을 붙일 수 있다. 별칭을 반드시 서로 다르게 주어야 하며, 별칭 없이 쓰면 어느 쪽 열인지 알 수 없어 오류가 난다. 관리자가 없는 사람(mgr 가 NULL)까지 보이려면 INNER 가 아니라 OUTER 조인이어야 한다는 점이 함정이다.",
    examPoint:
      "셀프 조인 결과에서 최상위 관리자 한 명이 빠져 있는 이유를 묻는다. INNER 조인이라 mgr 가 NULL 인 행이 사라진 것이다.",
    importance: 4,
    keywords: ["셀프 조인", "별칭", "자기 참조", "OUTER 조인"],
    traps: [
      {
        concept: "셀프 조인에서 INNER 와 OUTER",
        difference:
          "INNER 로 하면 상위가 없는 최상위 행이 사라지고, LEFT OUTER 로 해야 그 행까지 남는다.",
        wrong:
          "셀프 조인은 같은 표를 쓰므로 INNER 로 해도 모든 행이 그대로 남는다.",
      },
    ],
    sql: {
      caption:
        "사원 옆에 관리자 이름을 붙인다. INNER 로 바꾸면 대표 한 명이 사라지는 것도 확인해 보자.",
      query: `SELECT e.ename AS 사원, m.ename AS 관리자
FROM emp e
LEFT
JOIN emp m ON e.mgr = m.empno
ORDER BY e.empno;`,
    },
  },
  {
    id: "s-having-where",
    subject: "sql",
    chapter: "s-basic",
    title: "WHERE 와 HAVING 은 거르는 시점이 다르다",
    term: "WHERE 와 HAVING",
    summary:
      "WHERE 는 묶기 전에 행을 거르고, HAVING 은 묶은 뒤에 그룹을 거른다.",
    detail:
      "실행 순서는 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY 다. 그래서 WHERE 에는 집계 함수를 쓸 수 없고, HAVING 에는 쓸 수 있다. 결과가 같아 보이는 조건이라도 시점이 다르면 숫자가 달라진다 — WHERE 로 먼저 걸러 내면 그 행은 애초에 집계에 들어가지 않고, HAVING 으로 거르면 집계는 다 한 뒤에 그룹만 버린다. SELECT 의 별칭을 WHERE 나 HAVING 에서 쓸 수 없는 것도 같은 이유다.",
    examPoint:
      "'WHERE 절에 COUNT(*) > 2 를 쓴다'는 선지가 오답이다. 또 같은 조건을 WHERE 에 둘 때와 HAVING 에 둘 때 결과가 어떻게 갈리는지 계산하게 하는 문제가 나온다.",
    importance: 5,
    keywords: ["WHERE", "HAVING", "GROUP BY", "실행 순서"],
    traps: [
      {
        concept: "WHERE vs HAVING",
        difference:
          "WHERE 는 묶기 전 행을 거르므로 집계 함수를 쓸 수 없고, HAVING 은 묶은 뒤 그룹을 거르므로 집계 함수를 쓸 수 있다.",
        wrong:
          "WHERE 는 묶은 뒤에 그룹을 거르므로 집계 함수를 쓸 수 있고, HAVING 은 묶기 전 행을 거른다.",
      },
    ],
    sql: {
      caption:
        "같은 450 이라는 숫자를 WHERE 에 둘 때와 HAVING 에 둘 때 부서별 인원이 어떻게 달라지는지 본다.",
      query: `SELECT 'WHERE 로 먼저' AS 방식, deptno, COUNT(*) AS 인원
FROM emp
WHERE sal >= 450
GROUP BY deptno
UNION ALL
SELECT 'HAVING 으로 나중', deptno, COUNT(*)
FROM emp
GROUP BY deptno
HAVING AVG(sal) >= 450
ORDER BY 1, 2;`,
    },
  },

  /* ───────────── SQL 활용 ───────────── */
  {
    id: "s-subquery-exists",
    subject: "sql",
    chapter: "s-advanced",
    title: "EXISTS·ANY·ALL — 있는지만 보거나, 하나라도·전부",
    term: "EXISTS·ANY·ALL",
    summary:
      "EXISTS 는 행이 하나라도 있는지만 보고, ANY 는 여럿 중 하나라도 만족하면, ALL 은 전부 만족해야 참이다.",
    detail:
      "EXISTS 는 서브쿼리가 무엇을 뽑는지 보지 않고 행이 있는지만 확인하므로 SELECT 1 을 써도 된다. 한 건만 찾으면 멈추기 때문에 IN 보다 유리한 경우가 많다. ANY 는 '> ANY(집합)' 이면 최솟값보다 크면 참, ALL 은 '> ALL(집합)' 이면 최댓값보다 커야 참이다. 여기서 가장 잘 틀리는 자리는 NOT IN 이다 — 집합에 NULL 이 하나라도 섞이면 NOT IN 의 결과는 참이 되지 못해 행이 통째로 사라진다. NOT EXISTS 는 그런 문제가 없다.",
    examPoint:
      "'> ANY 는 최댓값보다 커야 한다'는 선지가 오답이다. ANY 는 최솟값, ALL 은 최댓값이 기준이다. NOT IN 에 NULL 이 섞였을 때 결과가 비는 것도 단골이다.",
    importance: 5,
    keywords: ["EXISTS", "NOT EXISTS", "ANY", "ALL", "NOT IN"],
    traps: [
      {
        concept: "ANY vs ALL",
        difference:
          "'> ANY' 는 집합의 최솟값보다 크면 참이고, '> ALL' 은 집합의 최댓값보다 커야 참이다.",
        wrong:
          "'> ANY' 는 집합의 최댓값보다 커야 참이고, '> ALL' 은 최솟값보다 크면 참이다.",
      },
      {
        concept: "NOT IN vs NOT EXISTS",
        difference:
          "NOT IN 은 비교할 집합에 NULL 이 섞이면 결과가 통째로 비어 버리지만, NOT EXISTS 는 그 영향을 받지 않는다.",
        wrong:
          "NOT IN 은 집합에 NULL 이 있어도 안전하고, NOT EXISTS 가 NULL 때문에 결과를 잃는다.",
      },
    ],
    sql: {
      caption:
        "사원이 한 명이라도 있는 부서만 고른다. EXISTS 를 NOT EXISTS 로 바꾸면 빈 부서가 나온다.",
      query: `SELECT dname
FROM dept d
WHERE EXISTS (SELECT 1 FROM emp e WHERE e.deptno = d.deptno)
ORDER BY d.deptno;`,
    },
  },
  {
    id: "s-setop-intersect",
    subject: "sql",
    chapter: "s-advanced",
    title: "INTERSECT 와 MINUS — 겹치는 것, 빼는 것",
    term: "INTERSECT 와 MINUS",
    summary:
      "INTERSECT 는 양쪽에 다 있는 행만, MINUS(EXCEPT)는 위쪽에만 있는 행만 남긴다. 둘 다 중복을 없애고 정렬한다.",
    detail:
      "집합 연산자는 양쪽 SELECT 의 열 개수와 자료형 순서가 맞아야 한다. 열 이름이 달라도 되고, 결과의 열 이름은 위쪽 것을 따른다. UNION ALL 을 뺀 나머지(UNION·INTERSECT·MINUS)는 중복을 제거하느라 정렬 작업이 붙는다. ORDER BY 는 문장 전체에 딱 하나, 맨 끝에만 올 수 있다. 오라클은 MINUS, 표준과 다른 여러 제품은 EXCEPT 라는 이름을 쓴다.",
    examPoint:
      "'집합 연산자는 열 이름이 같아야 한다'는 선지가 오답이다. 이름이 아니라 개수와 자료형이 맞아야 한다. 중간에 ORDER BY 를 끼워 넣은 문장을 고르라는 문제도 나온다.",
    importance: 4,
    keywords: ["INTERSECT", "MINUS", "EXCEPT", "집합 연산자"],
    traps: [
      {
        concept: "INTERSECT vs MINUS",
        difference:
          "INTERSECT 는 양쪽 모두에 있는 행을 남기고, MINUS 는 위쪽에 있으면서 아래쪽에는 없는 행을 남긴다.",
        wrong:
          "INTERSECT 는 위쪽에만 있는 행을 남기고, MINUS 는 양쪽 모두에 있는 행을 남긴다.",
      },
      {
        concept: "집합 연산자가 맞춰야 하는 것",
        difference:
          "열의 개수와 자료형 순서가 맞아야 한다. 열 이름은 달라도 되고 결과는 위쪽 이름을 따른다.",
        wrong:
          "집합 연산자를 쓰려면 양쪽 SELECT 의 열 이름까지 똑같아야 한다.",
      },
    ],
    sql: {
      caption:
        "부서를 가진 사원의 부서 번호에서, 급여 400 이상인 사원의 부서를 빼 본다.",
      query: `SELECT deptno
FROM emp
EXCEPT
SELECT deptno
FROM emp
WHERE sal >= 400
ORDER BY deptno;`,
    },
  },
  {
    id: "s-window-offset",
    subject: "sql",
    chapter: "s-advanced",
    title: "행 사이를 넘겨다보는 함수 — LAG·LEAD·FIRST_VALUE",
    term: "LAG·LEAD·FIRST_VALUE",
    summary:
      "LAG 는 앞 행, LEAD 는 뒷 행의 값을 끌어오고, FIRST_VALUE·LAST_VALUE 는 창 안의 첫 행·마지막 행 값을 준다.",
    detail:
      "정렬한 순서에서 바로 앞뒤 행의 값을 가져다 지금 행과 견주는 함수다. LAG(sal, 1, 0) 처럼 세 번째 인자를 주면 가져올 행이 없을 때 그 값을 대신 쓴다 — 주지 않으면 NULL 이 된다. FIRST_VALUE 와 LAST_VALUE 는 창(윈도우)의 범위에 따라 결과가 달라지는데, 기본 범위가 '첫 행부터 현재 행까지' 이므로 LAST_VALUE 가 늘 현재 행을 가리키는 함정이 있다. 전체 마지막 값을 원하면 범위를 UNBOUNDED FOLLOWING 까지 넓혀야 한다.",
    examPoint:
      "LAG 와 LEAD 의 방향을 맞바꾼 선지가 단골이다. LAG 는 뒤처진다(앞 행), LEAD 는 앞서 간다(뒷 행)로 묶어 둔다.",
    importance: 4,
    keywords: ["LAG", "LEAD", "FIRST_VALUE", "LAST_VALUE", "윈도우 함수"],
    traps: [
      {
        concept: "LAG vs LEAD",
        difference:
          "LAG 는 정렬 순서에서 앞(이전) 행의 값을, LEAD 는 뒤(다음) 행의 값을 가져온다.",
        wrong:
          "LAG 는 다음 행의 값을 가져오고, LEAD 는 이전 행의 값을 가져온다.",
      },
      {
        concept: "LAST_VALUE 의 기본 범위",
        difference:
          "창의 기본 범위가 첫 행부터 현재 행까지라, LAST_VALUE 는 그대로 쓰면 현재 행 값을 준다.",
        wrong:
          "LAST_VALUE 는 범위를 적지 않아도 늘 파티션 전체의 마지막 값을 돌려준다.",
      },
    ],
    sql: {
      caption:
        "급여를 높은 순으로 세워 놓고 앞뒤 사람의 급여를 함께 본다. 첫 줄과 끝 줄이 왜 비는지 확인하자.",
      query: `SELECT ename, sal,
       LAG(sal)  OVER (ORDER BY sal DESC) AS 앞사람,
       LEAD(sal) OVER (ORDER BY sal DESC) AS 뒷사람
FROM emp
ORDER BY sal DESC, empno;`,
    },
  },
  {
    id: "s-window-ratio",
    subject: "sql",
    chapter: "s-advanced",
    title: "몫과 자리를 재는 함수 — NTILE·RATIO_TO_REPORT·비율 순위",
    term: "NTILE 과 비율 함수",
    summary:
      "NTILE 은 몇 등분한 뒤 몇 번째 통인지, RATIO_TO_REPORT 는 전체 합에서 차지하는 비율, PERCENT_RANK·CUME_DIST 는 순위를 0~1 로 환산한 값이다.",
    detail:
      "NTILE(4) 는 정렬한 행을 넷으로 나눠 1~4 를 매긴다. 행 수가 등분되지 않으면 앞쪽 통이 한 행씩 더 갖는다. RATIO_TO_REPORT 는 값 ÷ 창 전체의 합이라 모두 더하면 1이 된다. CUME_DIST 는 '나보다 앞선 행의 누적 비율', PERCENT_RANK 는 '(순위-1) ÷ (전체-1)' 로 첫 행이 반드시 0이 된다. 이름이 비슷해 정의를 맞바꾼 선지가 많다.",
    examPoint:
      "NTILE 에서 나머지가 생길 때 어느 통이 더 갖는지 묻는다. 앞쪽 통부터 한 행씩 더 가져간다.",
    importance: 3,
    keywords: ["NTILE", "RATIO_TO_REPORT", "PERCENT_RANK", "CUME_DIST"],
    traps: [
      {
        concept: "NTILE 의 나머지 처리",
        difference:
          "행 수가 등분되지 않으면 앞쪽 통이 한 행씩 더 가져간다.",
        wrong:
          "행 수가 등분되지 않으면 뒤쪽 통이 한 행씩 더 가져간다.",
      },
      {
        concept: "PERCENT_RANK vs CUME_DIST",
        difference:
          "PERCENT_RANK 는 (순위-1)÷(전체-1) 이라 첫 행이 0이고, CUME_DIST 는 누적 비율이라 마지막 행이 1이다.",
        wrong:
          "PERCENT_RANK 는 마지막 행이 반드시 1이고, CUME_DIST 는 첫 행이 반드시 0이다.",
      },
    ],
    sql: {
      caption:
        "급여 순으로 넷으로 나눠 본다. 10명을 4등분하면 앞쪽 통이 3명씩인 것을 확인하자.",
      query: `SELECT ename, sal,
       NTILE(4) OVER (ORDER BY sal DESC) AS 통번호
FROM emp
ORDER BY sal DESC, empno;`,
    },
  },
  {
    id: "s-rownum-rownumber",
    subject: "sql",
    chapter: "s-advanced",
    title: "ROWNUM 과 ROW_NUMBER 는 매겨지는 때가 다르다",
    term: "ROWNUM 과 ROW_NUMBER",
    summary:
      "ROWNUM 은 조건을 통과한 순서대로 먼저 붙고, ROW_NUMBER 는 정렬을 마친 뒤에 붙는다.",
    detail:
      "ROWNUM 은 결과 행이 나올 때마다 1부터 붙는 값이라 ORDER BY 보다 먼저 정해진다. 그래서 'WHERE ROWNUM <= 3 ORDER BY sal DESC' 는 아무 3건을 뽑아 놓고 정렬한 것이지 상위 3건이 아니다. 상위 N 을 뽑으려면 정렬을 마친 결과를 인라인 뷰로 감싸고 바깥에서 ROWNUM 을 걸어야 한다. ROW_NUMBER() OVER(ORDER BY …) 는 정렬 기준을 함수 안에 품고 있어 그런 순서 문제가 없다. 또 ROWNUM 은 'ROWNUM = 2' 같은 조건이 결코 참이 되지 않는다 — 1이 채택되지 않으면 다음 행도 계속 1이기 때문이다.",
    examPoint:
      "'WHERE ROWNUM = 2' 로 두 번째 행을 뽑는다는 선지가 오답이다. 그 조건은 어떤 행도 만족하지 못해 결과가 비어 있다.",
    importance: 5,
    keywords: ["ROWNUM", "ROW_NUMBER", "인라인 뷰", "Top N"],
    traps: [
      {
        concept: "ROWNUM vs ROW_NUMBER",
        difference:
          "ROWNUM 은 정렬 전에 붙는 값이고, ROW_NUMBER 는 OVER 안의 정렬을 끝낸 뒤에 붙는다.",
        wrong:
          "ROWNUM 은 ORDER BY 를 끝낸 결과에 붙고, ROW_NUMBER 는 정렬과 무관하게 읽은 순서대로 붙는다.",
      },
      {
        concept: "ROWNUM = 2 가 안 되는 이유",
        difference:
          "첫 행이 조건에 걸려 버려지면 ROWNUM 은 그대로 1에 머무르므로 2가 될 기회가 오지 않는다.",
        wrong:
          "ROWNUM = 2 는 정렬된 결과의 두 번째 행 하나를 정확히 집어낸다.",
      },
    ],
    sql: {
      caption:
        "정렬을 인라인 뷰 안에 넣어야 진짜 상위 3명이 나온다. 바깥의 번호가 어떻게 붙는지 보자.",
      query: `SELECT ROW_NUMBER() OVER (ORDER BY sal DESC) AS 순번, ename, sal
FROM (SELECT ename, sal FROM emp ORDER BY sal DESC)
LIMIT 3;`,
    },
  },

  /* ───────────── 관리 구문 ───────────── */
  {
    id: "s-delete-truncate-drop",
    subject: "sql",
    chapter: "s-manage",
    title: "DELETE·TRUNCATE·DROP — 지우는 깊이가 다르다",
    term: "DELETE·TRUNCATE·DROP",
    summary:
      "DELETE 는 행만 지우고 되돌릴 수 있으며, TRUNCATE 는 전부 비우되 표는 남기고 되돌릴 수 없으며, DROP 은 표 자체를 없앤다.",
    detail:
      "DELETE 는 DML 이라 로그를 남기고 COMMIT 전에는 ROLLBACK 으로 되돌릴 수 있다. 조건을 걸어 일부만 지울 수도 있다. TRUNCATE 는 DDL 이라 자동 커밋되고, 조건을 걸 수 없으며 저장 공간까지 처음 상태로 되돌린다. DROP 은 표의 구조와 데이터, 인덱스까지 함께 없앤다. 셋 다 되돌릴 수 있는지, 표가 남는지, 조건을 걸 수 있는지로 갈린다.",
    examPoint:
      "'TRUNCATE 후 ROLLBACK 하면 데이터가 복구된다'는 선지가 대표적인 오답이다. TRUNCATE 는 DDL 이라 자동 커밋된다.",
    importance: 5,
    keywords: ["DELETE", "TRUNCATE", "DROP", "자동 커밋"],
    traps: [
      {
        concept: "DELETE vs TRUNCATE",
        difference:
          "DELETE 는 DML 이라 조건을 걸 수 있고 ROLLBACK 으로 되돌릴 수 있지만, TRUNCATE 는 DDL 이라 전부 비우고 자동 커밋되어 되돌릴 수 없다.",
        wrong:
          "DELETE 는 자동 커밋되어 되돌릴 수 없고, TRUNCATE 는 조건을 걸어 일부만 지운 뒤 ROLLBACK 할 수 있다.",
      },
      {
        concept: "TRUNCATE vs DROP",
        difference:
          "TRUNCATE 는 표의 구조를 남기고 내용만 비우지만, DROP 은 표 자체를 없앤다.",
        wrong:
          "TRUNCATE 는 표 자체를 없애고, DROP 은 내용만 비운 채 구조를 남긴다.",
      },
    ],
    table: {
      title: "세 가지 지우기",
      headers: ["명령", "갈래", "표가 남는가", "되돌릴 수 있는가", "조건을 걸 수 있는가"],
      rows: [
        ["DELETE", "DML", "남는다", "된다", "된다"],
        ["TRUNCATE", "DDL", "남는다", "안 된다", "안 된다"],
        ["DROP", "DDL", "없어진다", "안 된다", "안 된다"],
      ],
    },
  },
  {
    id: "s-transaction-acid",
    subject: "sql",
    chapter: "s-manage",
    title: "트랜잭션의 네 가지 성질",
    term: "트랜잭션의 특성",
    summary:
      "원자성은 전부 되거나 전부 안 되는 것, 일관성은 규칙이 깨지지 않는 것, 고립성은 남의 중간 상태가 보이지 않는 것, 지속성은 커밋한 것이 남는 것이다.",
    detail:
      "원자성(Atomicity)은 여러 문장이 하나처럼 움직여, 중간에서 실패하면 앞의 것까지 되돌아간다는 뜻이다. 일관성(Consistency)은 트랜잭션 전후로 제약조건 같은 규칙이 지켜진다는 뜻이다. 고립성(Isolation)은 동시에 도는 다른 트랜잭션의 중간 결과가 보이지 않는다는 뜻으로, 격리 수준을 낮추면 이 성질을 일부 포기하는 대신 빨라진다. 지속성(Durability)은 커밋을 마친 결과가 장애가 나도 남는다는 뜻이다.",
    examPoint:
      "원자성과 일관성을 맞바꾼 선지가 흔하다. '원자성 = 전부 아니면 전무', '일관성 = 규칙이 깨지지 않음'으로 갈라 둔다.",
    importance: 4,
    keywords: ["원자성", "일관성", "고립성", "지속성", "트랜잭션"],
    traps: [
      {
        concept: "원자성 vs 일관성",
        difference:
          "원자성은 전부 반영되거나 전부 취소되는 것이고, 일관성은 트랜잭션 전후로 데이터의 규칙이 깨지지 않는 것이다.",
        wrong:
          "원자성은 트랜잭션 전후로 규칙이 지켜지는 것이고, 일관성은 전부 반영되거나 전부 취소되는 것이다.",
      },
      {
        concept: "고립성 vs 지속성",
        difference:
          "고립성은 다른 트랜잭션의 중간 상태가 보이지 않는 것이고, 지속성은 커밋한 결과가 장애 뒤에도 남는 것이다.",
        wrong:
          "고립성은 커밋한 결과가 장애 뒤에도 남는 것이고, 지속성은 다른 트랜잭션의 중간 상태를 감추는 것이다.",
      },
    ],
    table: {
      title: "ACID",
      headers: ["성질", "무엇을 보장하는가"],
      rows: [
        ["원자성", "전부 되거나 전부 안 된다"],
        ["일관성", "전후로 규칙이 깨지지 않는다"],
        ["고립성", "남의 중간 상태가 보이지 않는다"],
        ["지속성", "커밋한 것은 장애가 나도 남는다"],
      ],
    },
  },
];
