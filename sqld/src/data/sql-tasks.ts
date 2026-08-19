import type { SqlTask, SqlTopic } from "@/lib/types";

export const TOPIC_LABEL: Record<SqlTopic, string> = {
  select: "SELECT · 조건 · 함수",
  group: "GROUP BY · 집계",
  join: "조인",
  subquery: "서브쿼리",
  setop: "집합 연산자",
  window: "윈도우 함수",
  hierarchy: "계층형 질의",
  dml: "DML · DDL · TCL",
};

/**
 * 직접 쳐서 푸는 문제.
 *
 * 채점은 결과를 견주어 한다. 열 이름이 달라도, 조인 방식이 달라도
 * 나온 값이 같으면 맞는 것으로 본다 — 실제로 그것이 SQL 이다.
 * 순서를 요구한 문제만 ordered: true 로 두어 행 순서까지 본다.
 *
 * ⚠️ 모든 answer 는 scripts/audit.ts 가 실제 SQLite 로 돌려 본다.
 *    돌아가지 않거나 결과가 비면 배포가 막힌다.
 */
export const SQL_TASKS: SqlTask[] = [
  /* ───────── SELECT · 조건 · 함수 ───────── */
  {
    id: "t-select-basic",
    topic: "select",
    prompt: "급여가 400 이상인 사원의 이름과 급여를 급여가 높은 순으로 보이시오.",
    schema: "emp",
    answer: `SELECT ename, sal
FROM emp
WHERE sal >= 400
ORDER BY sal DESC;`,
    explanation:
      "WHERE 로 행을 거르고 ORDER BY 로 정렬한다. 내림차순은 DESC 를 붙인다.",
    importance: 3,
    ordered: true,
    links: ["s-select-order"],
  },
  {
    id: "t-select-null",
    topic: "select",
    prompt: "보너스를 받지 못하는(bonus 가 NULL 인) 사원의 이름을 보이시오.",
    schema: "emp",
    answer: `SELECT ename
FROM emp
WHERE bonus IS NULL;`,
    explanation:
      "NULL 은 = 로 비교할 수 없다. bonus = NULL 은 어떤 행도 고르지 못하므로 IS NULL 을 써야 한다.",
    trap: "bonus = NULL 로 쓰면 결과가 0행이 된다. 오류도 나지 않아 더 위험하다.",
    importance: 5,
    links: ["s-null"],
  },
  {
    id: "t-select-nvl",
    topic: "select",
    prompt:
      "모든 사원의 이름과 '급여 + 보너스'를 보이시오. 보너스가 없으면 0으로 쳐서 더하시오.",
    schema: "emp",
    answer: `SELECT ename, sal + IFNULL(bonus, 0) AS total
FROM emp;`,
    explanation:
      "NULL 에 무엇을 더해도 NULL 이다. 먼저 IFNULL(오라클은 NVL)로 0을 채운 뒤 더해야 한다.",
    trap: "sal + bonus 로 쓰면 보너스가 없는 사원의 결과가 통째로 NULL 이 된다.",
    importance: 5,
    links: ["s-null"],
  },
  {
    id: "t-select-like",
    topic: "select",
    prompt: "직책이 '부장'이거나 '과장'인 사원의 이름과 직책을 보이시오.",
    schema: "emp",
    answer: `SELECT ename, job
FROM emp
WHERE job IN ('부장', '과장');`,
    explanation:
      "IN 은 OR 를 줄여 쓴 것과 같다. job = '부장' OR job = '과장' 과 결과가 같다.",
    importance: 3,
    links: ["s-where"],
  },

  /* ───────── GROUP BY · 집계 ───────── */
  {
    id: "t-group-count",
    topic: "group",
    prompt: "부서 번호별 사원 수를 부서 번호 순으로 보이시오.",
    schema: "emp",
    answer: `SELECT deptno, COUNT(*) AS cnt
FROM emp
GROUP BY deptno
ORDER BY deptno;`,
    explanation:
      "GROUP BY 로 묶고 COUNT(*) 로 센다. SELECT 에는 GROUP BY 에 적은 열이거나 집계 함수만 올 수 있다.",
    importance: 5,
    ordered: true,
    links: ["s-groupby"],
  },
  {
    id: "t-group-having",
    topic: "group",
    prompt: "사원이 4명 이상인 부서의 번호와 사원 수를 보이시오.",
    schema: "emp",
    answer:
      `SELECT deptno, COUNT(*) AS cnt
FROM emp
GROUP BY deptno
HAVING COUNT(*) >= 4;`,
    explanation:
      "묶은 뒤의 결과로 거르는 것이므로 HAVING 을 쓴다. WHERE 에는 집계 함수를 쓸 수 없다.",
    trap: "WHERE COUNT(*) >= 4 로 쓰면 오류가 난다. 묶기 전에는 아직 셀 것이 없기 때문이다.",
    importance: 5,
    links: ["s-groupby", "s-select-order"],
  },
  {
    id: "t-group-avg-null",
    topic: "group",
    prompt:
      "부서 번호별로 보너스의 평균을 보이시오. 보너스가 NULL 인 사원은 계산에서 빠져야 합니다.",
    schema: "emp",
    answer: `SELECT deptno, AVG(bonus) AS avg_bonus
FROM emp
GROUP BY deptno
ORDER BY deptno;`,
    explanation:
      "집계 함수는 NULL 을 자동으로 뺀다. 그래서 AVG 의 분모는 '보너스가 있는 사원 수'다.",
    trap: "전체 인원으로 나누려면 SUM(bonus)/COUNT(*) 처럼 직접 나눠야 한다.",
    importance: 5,
    ordered: true,
    links: ["s-groupby", "s-null"],
  },

  /* ───────── 조인 ───────── */
  {
    id: "t-join-inner",
    topic: "join",
    prompt: "사원의 이름과 그가 속한 부서 이름을 이름 순으로 보이시오.",
    schema: "emp,dept",
    answer:
      `SELECT e.ename, d.dname
FROM emp e
JOIN dept d ON e.deptno = d.deptno
ORDER BY e.ename;`,
    explanation:
      "두 표를 부서 번호로 잇는다. 양쪽에 다 있는 것만 나오는 INNER JOIN 이다.",
    importance: 5,
    ordered: true,
    links: ["s-join-basic"],
  },
  {
    id: "t-join-outer",
    topic: "join",
    prompt:
      "사원이 한 명도 없는 부서까지 포함해, 부서 이름과 그 부서의 사원 수를 부서 번호 순으로 보이시오.",
    schema: "emp,dept",
    answer:
      `SELECT d.dname, COUNT(e.empno) AS cnt
FROM dept d
LEFT JOIN emp e ON d.deptno = e.deptno
GROUP BY d.deptno, d.dname
ORDER BY d.deptno;`,
    explanation:
      "부서를 다 남겨야 하므로 dept 를 왼쪽에 두고 LEFT JOIN 한다. 세는 것은 COUNT(*) 가 아니라 COUNT(e.empno) 여야 사원이 없는 부서가 0 이 된다.",
    trap:
      "COUNT(*) 로 세면 사원이 없는 부서도 1 이 된다. 조인 결과에 NULL 인 행이 한 줄 남기 때문이다.",
    importance: 5,
    ordered: true,
    links: ["s-join-basic", "s-null"],
  },
  {
    id: "t-join-self",
    topic: "join",
    prompt: "사원의 이름과 그 사원의 상사 이름을 사원 이름 순으로 보이시오. 상사가 없는 사람도 포함하시오.",
    schema: "emp",
    answer:
      `SELECT e.ename, m.ename AS mgr_name
FROM emp e
LEFT JOIN emp m ON e.mgr = m.empno
ORDER BY e.ename;`,
    explanation:
      "같은 표를 두 번 불러 별칭을 달리 준다(셀프 조인). 상사가 없는 대표까지 남기려면 LEFT JOIN 이다.",
    trap: "INNER 로 조인하면 mgr 가 NULL 인 최상위 한 명이 결과에서 사라진다.",
    importance: 4,
    ordered: true,
    links: ["s-join-basic", "s-join-self"],
  },

  /* ───────── 서브쿼리 ───────── */
  {
    id: "t-sub-scalar",
    topic: "subquery",
    prompt: "전체 평균 급여보다 많이 받는 사원의 이름과 급여를 급여가 높은 순으로 보이시오.",
    schema: "emp",
    answer:
      `SELECT ename, sal
FROM emp
WHERE sal > (SELECT AVG(sal) FROM emp)
ORDER BY sal DESC;`,
    explanation:
      "평균은 한 값이므로 단일행 서브쿼리다. WHERE 에 집계 함수를 직접 쓸 수 없어 서브쿼리로 빼야 한다.",
    trap: "WHERE sal > AVG(sal) 로 쓰면 오류가 난다.",
    importance: 5,
    ordered: true,
    links: ["s-subquery", "s-select-order"],
  },
  {
    id: "t-sub-in",
    topic: "subquery",
    prompt: "부서 위치가 '서울'인 부서에 속한 사원의 이름을 이름 순으로 보이시오.",
    schema: "emp,dept",
    answer:
      `SELECT ename
FROM emp
WHERE deptno IN (SELECT deptno FROM dept WHERE loc = '서울')
ORDER BY ename;`,
    explanation:
      "서브쿼리 결과가 여러 건일 수 있으므로 = 이 아니라 IN 을 쓴다. 조인으로 풀어도 결과는 같다.",
    importance: 4,
    ordered: true,
    links: ["s-subquery"],
  },
  {
    id: "t-sub-correlated",
    topic: "subquery",
    prompt:
      "자기 부서의 평균 급여보다 많이 받는 사원의 이름과 급여를 이름 순으로 보이시오.",
    schema: "emp",
    answer:
      `SELECT e.ename, e.sal
FROM emp e
WHERE e.sal > (SELECT AVG(x.sal) FROM emp x WHERE x.deptno = e.deptno)
ORDER BY e.ename;`,
    explanation:
      "서브쿼리 안에서 바깥 행의 부서 번호를 참조한다(상관 서브쿼리). 바깥 행마다 그 부서의 평균을 새로 구한다.",
    trap:
      "부서 조건을 빼면 전체 평균과 비교하게 되어 다른 답이 나온다.",
    importance: 5,
    ordered: true,
    links: ["s-subquery", "s-scalar-inline"],
  },

  /* ───────── 집합 연산자 ───────── */
  {
    id: "t-setop-union",
    topic: "setop",
    prompt:
      "급여가 500 이상인 사원과 보너스가 100 이상인 사원의 이름을 중복 없이 이름 순으로 보이시오.",
    schema: "emp",
    answer:
      `SELECT ename
FROM emp
WHERE sal >= 500
UNION
SELECT ename
FROM emp
WHERE bonus >= 100
ORDER BY ename;`,
    explanation:
      "UNION 은 중복을 없앤다. 중복을 그대로 두려면 UNION ALL 이다. ORDER BY 는 맨 끝에 한 번만 쓴다.",
    importance: 4,
    ordered: true,
    links: ["s-setop"],
  },

  /* ───────── 윈도우 함수 ───────── */
  {
    id: "t-window-rank",
    topic: "window",
    prompt:
      "사원의 이름·급여와 함께 급여가 높은 순의 순위를 보이시오. 동점이면 같은 순위를 주고, 다음 순위는 건너뛰어야 합니다. 급여가 높은 순으로 정렬하시오.",
    schema: "emp",
    answer:
      `SELECT ename, sal, RANK() OVER (ORDER BY sal DESC) AS rnk
FROM emp
ORDER BY sal DESC, ename;`,
    explanation:
      "동점 뒤를 건너뛰는 것이 RANK 다. 건너뛰지 않는 것은 DENSE_RANK 이고, 동점이어도 다른 번호를 주는 것은 ROW_NUMBER 다.",
    trap: "DENSE_RANK 를 쓰면 1,1,2 가 되어 '건너뛴다'는 조건과 어긋난다.",
    importance: 5,
    ordered: true,
    links: ["s-window"],
  },
  {
    id: "t-window-partition",
    topic: "window",
    prompt:
      "사원의 이름·부서 번호·급여와 함께 '그 부서 안에서의 급여 순위'를 보이시오. 부서 번호, 급여 높은 순으로 정렬하시오.",
    schema: "emp",
    answer:
      `SELECT ename, deptno, sal, RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rnk
FROM emp
ORDER BY deptno, sal DESC, ename;`,
    explanation:
      "PARTITION BY 로 부서마다 따로 순위를 매긴다. GROUP BY 와 달리 행이 줄어들지 않는다.",
    importance: 5,
    ordered: true,
    links: ["s-window"],
  },
  {
    id: "t-window-topn",
    topic: "window",
    prompt: "급여가 가장 많은 사원 3명의 이름과 급여를 급여가 높은 순으로 보이시오.",
    schema: "emp",
    answer: `SELECT ename, sal
FROM emp
ORDER BY sal DESC, ename
LIMIT 3;`,
    explanation:
      "정렬을 먼저 하고 잘라야 한다. 오라클이라면 인라인 뷰에서 정렬한 뒤 바깥에서 ROWNUM 으로 자르거나 ROW_NUMBER 를 쓴다.",
    trap:
      "오라클에서 WHERE ROWNUM <= 3 과 ORDER BY 를 같은 층에 쓰면 정렬 전에 잘려 엉뚱한 3명이 나온다.",
    importance: 5,
    ordered: true,
    links: ["s-topn", "s-window"],
  },

  /* ───────── 계층형 질의 ───────── */
  {
    id: "t-hierarchy-level",
    topic: "hierarchy",
    prompt:
      "대표(상사가 없는 사원)부터 시작해 조직도를 타고 내려가며, 각 사원의 이름과 몇 번째 층인지를 층·이름 순으로 보이시오.",
    schema: "emp",
    answer: `WITH RECURSIVE t(empno, ename, mgr, lvl) AS (
  SELECT empno, ename, mgr, 1 FROM emp WHERE mgr IS NULL
  UNION ALL
  SELECT e.empno, e.ename, e.mgr, t.lvl + 1 FROM emp e JOIN t ON e.mgr = t.empno
)
SELECT ename, lvl
FROM t
ORDER BY lvl, ename;`,
    explanation:
      "뿌리(상사가 없는 사원)를 먼저 고르고, 그 아래를 이어 붙이며 층을 하나씩 올린다. 오라클이라면 START WITH mgr IS NULL CONNECT BY PRIOR empno = mgr 로 쓴다.",
    importance: 4,
    ordered: true,
    links: ["s-hierarchy"],
  },

  /* ───────── DML ───────── */
  {
    id: "t-dml-update",
    topic: "dml",
    prompt:
      "부서 30번 사원의 급여를 10%씩 올린 뒤, 부서 30번 사원의 이름과 급여를 이름 순으로 보이시오.",
    schema: "emp",
    answer:
      `UPDATE emp
SET sal = sal * 1.1
WHERE deptno = 30;

SELECT ename, sal
FROM emp
WHERE deptno = 30
ORDER BY ename;`,
    explanation:
      "UPDATE 에서 WHERE 를 빠뜨리면 모든 행이 바뀐다. 바꾼 뒤 결과를 확인하는 습관을 들인다.",
    trap: "WHERE 를 빼면 전 사원의 급여가 오른다. 실무에서 가장 무서운 실수다.",
    importance: 4,
    ordered: true,
    links: ["s-dml"],
  },
  {
    id: "t-dml-case",
    topic: "dml",
    prompt:
      "사원의 이름과, 급여가 500 이상이면 '상', 300 이상이면 '중', 그 미만이면 '하'로 표시한 등급을 이름 순으로 보이시오.",
    schema: "emp",
    answer:
      `SELECT ename, CASE WHEN sal >= 500 THEN '상' WHEN sal >= 300 THEN '중' ELSE '하' END AS grade
FROM emp
ORDER BY ename;`,
    explanation:
      "CASE 는 위에서부터 맞는 것을 찾아 멈춘다. 그래서 넓은 조건을 위에 두면 아래가 영영 걸리지 않는다.",
    trap:
      "WHEN sal >= 300 을 위에 쓰면 500 이상인 사원까지 '중'이 된다. 조건 순서가 곧 답이다.",
    importance: 5,
    ordered: true,
    links: ["s-function"],
  },

  /* ───────── 보강 — 새로 늘린 개념에 맞춰 ───────── */
  {
    id: "t-select-coalesce",
    topic: "select",
    prompt:
      "사원의 이름과 보너스를 보이되, 보너스가 없으면 '없음' 이라고 적으시오.",
    schema: "emp",
    answer:
      `SELECT ename, COALESCE(CAST(bonus AS TEXT), '없음') AS bonus
FROM emp;`,
    explanation:
      "COALESCE 는 왼쪽부터 훑어 처음 만나는 NULL 아닌 값을 돌려준다. 숫자와 문자를 한 열에 담아야 하므로 형을 맞춰 준다.",
    trap:
      "자료형이 다른 값을 그대로 넣으면 제품에 따라 오류가 나거나 엉뚱하게 변환된다.",
    importance: 4,
    links: ["s-null-functions"],
  },
  {
    id: "t-select-precedence",
    topic: "select",
    prompt:
      "20번 부서이거나 30번 부서인 사원 중, 급여가 450 이상인 사람의 이름을 보이시오.",
    schema: "emp",
    answer:
      `SELECT ename
FROM emp
WHERE (deptno = 20 OR deptno = 30)
  AND sal >= 450;`,
    explanation:
      "괄호가 없으면 AND 가 먼저 묶여 20번 부서 전체가 조건 없이 딸려 온다. 뜻대로 묶으려면 괄호를 직접 쳐야 한다.",
    trap:
      "deptno = 20 OR deptno = 30 AND sal >= 450 으로 쓰면 20번 부서는 급여와 상관없이 모두 나온다.",
    importance: 4,
    links: ["s-operator-order"],
  },
  {
    id: "t-sub-exists",
    topic: "subquery",
    prompt: "사원이 한 명이라도 있는 부서의 이름을 보이시오.",
    schema: "emp,dept",
    answer:
      `SELECT dname
FROM dept d
WHERE EXISTS (SELECT 1 FROM emp e WHERE e.deptno = d.deptno);`,
    explanation:
      "EXISTS 는 서브쿼리가 무엇을 뽑는지 보지 않고 행이 있는지만 확인한다. 한 건만 찾으면 멈추므로 IN 보다 유리한 경우가 많다.",
    trap:
      "사원이 없는 부서를 빼는 문제다. dept 만 조회하면 네 부서가 모두 나온다.",
    importance: 5,
    links: ["s-subquery-exists"],
  },
  {
    id: "t-setop-minus",
    topic: "setop",
    prompt:
      "사원이 있는 부서 번호 중, 급여가 700 이상인 사원이 한 명도 없는 부서 번호를 보이시오.",
    schema: "emp",
    answer:
      `SELECT deptno
FROM emp
EXCEPT
SELECT deptno
FROM emp
WHERE sal >= 700;`,
    explanation:
      "위쪽 집합에서 아래쪽 집합을 뺀다. 오라클은 MINUS, 표준과 여러 제품은 EXCEPT 라는 이름을 쓴다. 중복은 자동으로 제거된다.",
    trap:
      "WHERE sal < 700 으로 바꾸면 답이 달라진다. 그 부서에 700 이상인 사람이 함께 있어도 걸러지지 않기 때문이다.",
    importance: 4,
    links: ["s-setop-intersect"],
  },
  {
    id: "t-window-lag",
    topic: "window",
    prompt:
      "사원을 급여가 높은 순으로 세우고, 이름·급여와 함께 바로 앞사람의 급여를 보이시오.",
    schema: "emp",
    answer:
      `SELECT ename, sal, LAG(sal) OVER (ORDER BY sal DESC) AS prev_sal
FROM emp
ORDER BY sal DESC, empno;`,
    explanation:
      "LAG 는 정렬 순서에서 앞(이전) 행의 값을 가져온다. 첫 행은 가져올 앞 행이 없어 NULL 이 된다.",
    trap:
      "LEAD 로 바꾸면 뒷사람의 급여가 나온다. LAG 는 뒤처진다(앞 행), LEAD 는 앞서 간다(뒷 행)로 묶어 둔다.",
    importance: 4,
    ordered: true,
    links: ["s-window-offset"],
  },
  {
    id: "t-window-ntile",
    topic: "window",
    prompt:
      "사원을 급여가 높은 순으로 넷으로 나누어, 이름·급여와 몇 번째 통인지를 보이시오.",
    schema: "emp",
    answer:
      `SELECT ename, sal, NTILE(4) OVER (ORDER BY sal DESC) AS quartile
FROM emp
ORDER BY sal DESC, empno;`,
    explanation:
      "NTILE(4) 는 정렬한 행을 넷으로 나눠 1~4 를 매긴다. 10명을 넷으로 나누면 등분되지 않으므로 앞쪽 통이 한 행씩 더 갖는다.",
    trap: "나머지가 생기면 뒤쪽이 아니라 앞쪽 통이 더 가져간다.",
    importance: 3,
    ordered: true,
    links: ["s-window-ratio"],
  },
];

export function tasksOf(topic?: SqlTopic): SqlTask[] {
  return topic ? SQL_TASKS.filter((t) => t.topic === topic) : SQL_TASKS;
}

export const SQL_TASK_MAP: Record<string, SqlTask> = Object.fromEntries(
  SQL_TASKS.map((t) => [t.id, t]),
);
