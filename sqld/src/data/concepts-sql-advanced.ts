import type { Concept } from "@/lib/types";

/**
 * 2과목 — SQL 활용 (s-advanced) · 관리 구문 (s-manage)
 *
 * 2과목 점수를 가르는 자리다. 서브쿼리와 윈도우 함수는 눈으로 읽으면
 * 다 아는 것 같다가 결과를 물으면 어긋난다. 그래서 개념마다 돌려 볼
 * 쿼리를 붙였다.
 */
export const CONCEPTS_SQL_ADVANCED: Concept[] = [
  /* ───────────── SQL 활용 ───────────── */
  {
    id: "s-subquery",
    subject: "sql",
    chapter: "s-advanced",
    title: "서브쿼리 — 단일행·다중행·다중열",
    term: "서브쿼리",
    summary:
      "한 건이 돌아오면 =·> 로 비교하고, 여러 건이면 IN·ANY·ALL·EXISTS 를 써야 한다.",
    detail:
      "단일행 서브쿼리에 여러 건이 돌아오면 오류가 난다. 그래서 결과가 여럿일 수 있으면 IN 이나 ANY/ALL 을 쓴다. ANY 는 하나라도 만족하면 참(> ANY 는 최솟값보다 크면 참), ALL 은 모두 만족해야 참(> ALL 은 최댓값보다 커야 참)이다. EXISTS 는 값을 비교하지 않고 '행이 있는가'만 보므로, 한 건만 찾으면 바로 멈춘다.",
    examPoint:
      "> ANY 와 > ALL 을 최솟값·최댓값으로 바꿔 묻는 문제가 단골이다. 그리고 단일행 서브쿼리에 여러 건이 오면 오류라는 점이 나온다.",
    importance: 5,
    keywords: ["단일행 서브쿼리", "다중행 서브쿼리", "IN", "ANY", "ALL", "EXISTS"],
    traps: [
      {
        concept: "> ANY vs > ALL",
        difference:
          "> ANY 는 목록의 최솟값보다 크면 참이고, > ALL 은 목록의 최댓값보다 커야 참이다.",
        wrong:
          "> ANY 는 목록의 최댓값보다 커야 참이고, > ALL 은 최솟값보다 크면 참이다.",
      },
      {
        concept: "IN vs EXISTS",
        difference:
          "IN 은 서브쿼리 결과를 값 목록으로 만들어 비교하고, EXISTS 는 행이 있는지만 확인해 하나 찾으면 멈춘다.",
        wrong:
          "EXISTS 는 서브쿼리 결과를 값 목록으로 모두 만들어 비교하고, IN 은 행이 있는지만 확인한다.",
      },
    ],
    sql: {
      caption: "ANY 와 ALL 을 나란히 — 어느 쪽이 더 많이 걸리는가",
      query: `SELECT '> ANY (10,20,30)' AS 조건, COUNT(*) AS 건수
FROM emp
WHERE sal > (SELECT MIN(x) FROM (SELECT 1000 AS x UNION SELECT 2000 UNION SELECT 3000))
UNION ALL
SELECT '> ALL (10,20,30)', COUNT(*)
FROM emp
WHERE sal > (SELECT MAX(x) FROM (SELECT 1000 AS x UNION SELECT 2000 UNION SELECT 3000));`,
    },
  },
  {
    id: "s-scalar-inline",
    subject: "sql",
    chapter: "s-advanced",
    title: "서브쿼리가 놓이는 자리 — 스칼라·인라인뷰·중첩",
    term: "스칼라·인라인뷰·중첩 서브쿼리",
    summary:
      "SELECT 절에 오면 스칼라 서브쿼리, FROM 절에 오면 인라인 뷰, WHERE 절에 오면 중첩 서브쿼리다.",
    detail:
      "스칼라 서브쿼리는 반드시 한 행 한 열만 돌려줘야 하며, 결과가 없으면 NULL 이 된다. 인라인 뷰는 FROM 에 놓인 임시 표라서 그 안의 별칭을 바깥에서 쓸 수 있고, Top N 을 만들 때 자주 쓴다. 상관 서브쿼리는 바깥 쿼리의 열을 안에서 참조하는 것으로, 바깥 행마다 한 번씩 돌아간다.",
    examPoint:
      "자리 이름과 성질을 짝지어 묻는다. 특히 스칼라 서브쿼리가 한 행 한 열이어야 한다는 점, 결과가 없으면 NULL 이라는 점이 나온다.",
    importance: 4,
    keywords: ["스칼라 서브쿼리", "인라인 뷰", "중첩 서브쿼리", "상관 서브쿼리"],
    traps: [
      {
        concept: "스칼라 서브쿼리 vs 인라인 뷰",
        difference:
          "스칼라는 SELECT 절에 놓여 한 행 한 열을 돌려주고, 인라인 뷰는 FROM 절에 놓여 표처럼 여러 행을 돌려준다.",
        wrong:
          "스칼라 서브쿼리는 FROM 절에 놓여 표처럼 쓰이고, 인라인 뷰는 SELECT 절에 놓여 값 하나를 돌려준다.",
      },
    ],
    sql: {
      caption: "스칼라 서브쿼리와 인라인 뷰를 한 쿼리에서",
      query: `SELECT e.ename,
       (SELECT d.dname FROM dept d WHERE d.deptno = e.deptno) AS 부서명,
       t.평균
FROM emp e
JOIN (SELECT deptno, AVG(sal) AS 평균 FROM emp GROUP BY deptno) t
  ON t.deptno = e.deptno
ORDER BY e.ename;`,
    },
  },
  {
    id: "s-setop",
    subject: "sql",
    chapter: "s-advanced",
    title: "집합 연산자 — UNION 과 UNION ALL",
    term: "UNION 과 UNION ALL",
    summary:
      "UNION 은 중복을 없애고 정렬까지 하며, UNION ALL 은 그대로 이어 붙인다. 그래서 UNION ALL 이 빠르다.",
    detail:
      "집합 연산자를 쓰려면 양쪽의 열 개수가 같고 자료형이 서로 맞아야 한다. 열 이름은 달라도 되며 결과의 이름은 첫 번째 쿼리를 따른다. UNION 은 중복 제거를 위해 정렬을 하므로 비용이 든다. INTERSECT 는 양쪽에 다 있는 것, EXCEPT(오라클은 MINUS)는 앞에는 있고 뒤에는 없는 것이다. ORDER BY 는 맨 마지막에 한 번만 쓸 수 있다.",
    examPoint:
      "UNION 과 UNION ALL 의 차이(중복 제거·정렬 여부)가 거의 매회 나온다. 그리고 ORDER BY 를 중간에 못 쓴다는 점이 나온다.",
    importance: 5,
    keywords: ["UNION", "UNION ALL", "INTERSECT", "MINUS", "EXCEPT"],
    traps: [
      {
        concept: "UNION vs UNION ALL",
        difference:
          "UNION 은 중복을 없애느라 정렬을 하고, UNION ALL 은 중복을 그대로 두고 이어 붙이기만 해서 더 빠르다.",
        wrong:
          "UNION 은 중복을 그대로 두어 빠르고, UNION ALL 은 중복을 없애느라 정렬을 해서 느리다.",
      },
    ],
    sql: {
      caption: "중복이 있을 때 둘의 행 수가 갈린다",
      query: `SELECT 'UNION' AS 연산, COUNT(*) AS 행수
FROM (
  SELECT deptno FROM emp UNION SELECT deptno FROM emp
)
UNION ALL
SELECT 'UNION ALL', COUNT(*)
FROM (
  SELECT deptno FROM emp UNION ALL SELECT deptno FROM emp
);`,
    },
  },
  {
    id: "s-window",
    subject: "sql",
    chapter: "s-advanced",
    title: "윈도우 함수 — 묶지 않고 집계한다",
    term: "윈도우 함수",
    summary:
      "GROUP BY 는 행을 줄이지만, 윈도우 함수는 행을 그대로 두고 옆에 집계 값을 붙인다.",
    detail:
      "OVER 절이 붙으면 윈도우 함수다. PARTITION BY 로 묶을 범위를 정하고, ORDER BY 로 그 안의 순서를 정한다. 순위 함수는 셋이 갈린다 — RANK 는 같은 순위 뒤를 건너뛰고(1,1,3), DENSE_RANK 는 건너뛰지 않으며(1,1,2), ROW_NUMBER 는 같아도 무조건 다른 번호를 준다(1,2,3). LAG·LEAD 는 앞뒤 행의 값을 끌어온다.",
    examPoint:
      "RANK·DENSE_RANK·ROW_NUMBER 의 결과를 나란히 놓고 고르게 하는 문제가 거의 매회 나온다. 동점이 있는 자료로 직접 돌려 보면 한 번에 외워진다.",
    importance: 5,
    keywords: ["OVER", "PARTITION BY", "RANK", "DENSE_RANK", "ROW_NUMBER", "LAG", "LEAD"],
    traps: [
      {
        concept: "RANK vs DENSE_RANK",
        difference:
          "동점이 있으면 RANK 는 다음 순위를 건너뛰고(1,1,3), DENSE_RANK 는 건너뛰지 않는다(1,1,2).",
        wrong:
          "RANK 는 동점이 있어도 순위를 건너뛰지 않고, DENSE_RANK 는 건너뛴다.",
      },
      {
        concept: "GROUP BY vs 윈도우 함수",
        difference:
          "GROUP BY 는 여러 행을 하나로 줄이고, 윈도우 함수는 행을 그대로 둔 채 옆에 값을 붙인다.",
        wrong:
          "윈도우 함수는 여러 행을 한 행으로 줄이고, GROUP BY 는 행을 그대로 둔 채 집계 값을 옆에 붙인다.",
      },
    ],
    sql: {
      caption: "세 순위 함수를 한 줄에 놓고 비교",
      query: `SELECT ename, sal,
       RANK()       OVER (ORDER BY sal DESC) AS "RANK",
       DENSE_RANK() OVER (ORDER BY sal DESC) AS "DENSE_RANK",
       ROW_NUMBER() OVER (ORDER BY sal DESC) AS "ROW_NUMBER"
FROM emp
ORDER BY sal DESC;`,
    },
  },
  {
    id: "s-group-function",
    subject: "sql",
    chapter: "s-advanced",
    title: "그룹 함수 — ROLLUP·CUBE·GROUPING SETS",
    term: "ROLLUP·CUBE·GROUPING SETS",
    summary:
      "ROLLUP 은 오른쪽부터 하나씩 지워 가며 소계를, CUBE 는 모든 조합의 소계를 만든다.",
    detail:
      "ROLLUP(a, b) 는 (a,b) → (a) → () 순으로 소계를 만든다. 즉 계층이 있는 소계다. CUBE(a, b) 는 (a,b) → (a) → (b) → () 로 가능한 모든 조합을 만들어 ROLLUP 보다 행이 많다. GROUPING SETS 는 원하는 조합만 골라 적는다. 소계 행에서 그 열은 NULL 로 나오므로, 진짜 NULL 과 구분하려면 GROUPING 함수를 쓴다.",
    examPoint:
      "ROLLUP 과 CUBE 의 결과 행 수를 묻는다. 열이 두 개면 ROLLUP 은 조합 3가지, CUBE 는 4가지다.",
    importance: 4,
    keywords: ["ROLLUP", "CUBE", "GROUPING SETS", "GROUPING", "소계"],
    traps: [
      {
        concept: "ROLLUP vs CUBE",
        difference:
          "ROLLUP 은 오른쪽부터 하나씩 지운 계층적 소계만 만들고, CUBE 는 가능한 모든 조합의 소계를 만들어 행이 더 많다.",
        wrong:
          "ROLLUP 은 가능한 모든 조합의 소계를 만들고, CUBE 는 계층적 소계만 만든다.",
      },
    ],
  },
  {
    id: "s-topn",
    subject: "sql",
    chapter: "s-advanced",
    title: "Top N — 정렬한 뒤에 잘라야 한다",
    term: "Top N 쿼리",
    summary:
      "행을 자르는 조건이 정렬보다 먼저 적용되면 엉뚱한 행이 남는다. 인라인 뷰에서 정렬한 뒤 바깥에서 자른다.",
    detail:
      "오라클의 ROWNUM 은 행이 나오는 순서대로 붙기 때문에, WHERE ROWNUM <= 5 와 ORDER BY 를 한 쿼리에 같이 쓰면 '아무 5건을 뽑아 정렬한' 결과가 된다. 그래서 정렬을 인라인 뷰 안에서 끝내고 바깥에서 ROWNUM 으로 자른다. 표준 SQL 에서는 ROW_NUMBER() OVER (ORDER BY ...) 나 FETCH FIRST n ROWS ONLY 를 쓴다.",
    examPoint:
      "ROWNUM 과 ORDER BY 를 같은 층에 쓴 쿼리를 주고 결과를 묻는다. '정렬 전에 잘린다'가 핵심이다.",
    importance: 4,
    keywords: ["ROWNUM", "인라인 뷰", "ROW_NUMBER", "FETCH FIRST", "Top N"],
    traps: [
      {
        concept: "ROWNUM 을 안에서 vs 밖에서",
        difference:
          "같은 층에서 ORDER BY 와 함께 쓰면 정렬 전에 잘려 엉뚱한 행이 남는다. 인라인 뷰에서 정렬한 뒤 바깥에서 잘라야 한다.",
        wrong:
          "ROWNUM 은 ORDER BY 가 끝난 뒤에 붙으므로, 한 쿼리에서 함께 써도 상위 N 건이 정확히 나온다.",
      },
    ],
    sql: {
      caption: "정렬한 뒤에 자른 상위 3명",
      query: `SELECT ename, sal
FROM (
  SELECT ename, sal FROM emp ORDER BY sal DESC
)
LIMIT 3;`,
    },
  },
  {
    id: "s-hierarchy",
    subject: "sql",
    chapter: "s-advanced",
    title: "계층형 질의 — 위아래로 타고 내려가기",
    term: "계층형 질의",
    summary:
      "START WITH 로 시작 행을 정하고 CONNECT BY 로 이어 간다. PRIOR 가 붙은 쪽이 부모다.",
    detail:
      "조직도나 게시판 답글처럼 자기 표 안에서 부모·자식이 이어질 때 쓴다. START WITH 는 뿌리가 될 행, CONNECT BY PRIOR 자식키 = 부모키 는 위에서 아래로 내려가는 방향이다. PRIOR 를 반대쪽에 붙이면 아래에서 위로 올라간다. LEVEL 은 몇 번째 층인지, CONNECT_BY_ROOT 는 뿌리 값을, SYS_CONNECT_BY_PATH 는 지나온 길을 돌려준다. 표준 SQL 에서는 재귀 WITH 로 같은 일을 한다.",
    examPoint:
      "PRIOR 의 위치로 방향(순방향·역방향)이 갈린다는 점이 핵심이다. LEVEL 값이 몇인지 묻는 문제도 나온다.",
    importance: 4,
    keywords: ["START WITH", "CONNECT BY", "PRIOR", "LEVEL", "재귀 WITH"],
    traps: [
      {
        concept: "순방향 vs 역방향",
        difference:
          "CONNECT BY PRIOR 부모키 = 자식키 는 위에서 아래로(순방향), CONNECT BY 부모키 = PRIOR 자식키 는 아래에서 위로(역방향)다.",
        wrong:
          "PRIOR 를 어느 쪽에 붙이든 방향은 같고, START WITH 로만 방향이 정해진다.",
      },
    ],
    sql: {
      caption: "재귀 WITH 로 조직도를 타고 내려간다",
      query: `WITH RECURSIVE t(empno, ename, mgr, lvl) AS (
  SELECT empno, ename, mgr, 1 FROM emp WHERE mgr IS NULL
  UNION ALL
  SELECT e.empno, e.ename, e.mgr, t.lvl + 1
  FROM emp e JOIN t ON e.mgr = t.empno
)
SELECT lvl AS "층", ename AS "이름"
FROM t
ORDER BY lvl, ename;`,
    },
  },
  {
    id: "s-pivot",
    subject: "sql",
    chapter: "s-advanced",
    title: "PIVOT 과 UNPIVOT",
    term: "PIVOT 과 UNPIVOT",
    summary:
      "PIVOT 은 행을 열로 돌려세우고, UNPIVOT 은 열을 다시 행으로 눕힌다.",
    detail:
      "PIVOT 은 값의 종류마다 열을 만들어 가로로 편다. 집계 함수가 반드시 필요하다. UNPIVOT 은 반대로 여러 열을 이름·값 두 열로 눕히는데, 이때 NULL 인 칸은 기본적으로 결과에서 빠진다. PIVOT 없이도 CASE WHEN 과 집계 함수를 조합하면 같은 일을 할 수 있고, 시험에는 이 형태가 더 자주 나온다.",
    examPoint:
      "CASE WHEN + SUM 으로 가로로 편 쿼리를 주고 결과를 묻는다. 조건에 맞지 않는 칸이 0 이 되는지 NULL 이 되는지가 갈린다.",
    importance: 3,
    keywords: ["PIVOT", "UNPIVOT", "CASE WHEN", "행을 열로"],
    traps: [
      {
        concept: "PIVOT vs UNPIVOT",
        difference:
          "PIVOT 은 행을 열로 세우고, UNPIVOT 은 열을 행으로 눕힌다. UNPIVOT 은 NULL 인 칸을 기본적으로 버린다.",
        wrong:
          "PIVOT 은 열을 행으로 눕히고, UNPIVOT 은 행을 열로 세운다.",
      },
    ],
    sql: {
      caption: "CASE WHEN 으로 부서별 인원을 가로로 편다",
      query: `SELECT SUM(CASE WHEN deptno = 10 THEN 1 ELSE 0 END) AS "10번",
       SUM(CASE WHEN deptno = 20 THEN 1 ELSE 0 END) AS "20번",
       SUM(CASE WHEN deptno = 30 THEN 1 ELSE 0 END) AS "30번"
FROM emp;`,
    },
  },

  /* ───────────── 관리 구문 ───────────── */
  {
    id: "s-dml",
    subject: "sql",
    chapter: "s-manage",
    title: "DML — INSERT·UPDATE·DELETE·MERGE",
    term: "DML",
    summary:
      "DML 은 데이터를 바꾸는 명령이고, 아직 확정되지 않아 COMMIT 전까지는 되돌릴 수 있다.",
    detail:
      "INSERT 는 열 목록을 생략하면 표에 정의된 순서대로 모두 넣어야 한다. UPDATE 와 DELETE 에서 WHERE 를 빠뜨리면 모든 행이 대상이 되므로 주의한다. MERGE 는 조건에 맞으면 UPDATE, 없으면 INSERT 를 한 번에 하는 명령이다. DML 은 트랜잭션에 묶이므로 COMMIT 하거나 ROLLBACK 해야 마무리된다.",
    examPoint:
      "DELETE 와 TRUNCATE, DROP 의 차이가 거의 매회 나온다. 세 가지를 '무엇이 남는가'로 묶어 둔다.",
    importance: 5,
    keywords: ["INSERT", "UPDATE", "DELETE", "MERGE", "WHERE"],
    traps: [
      {
        concept: "DELETE vs TRUNCATE vs DROP",
        difference:
          "DELETE 는 행만 지우고 되돌릴 수 있다. TRUNCATE 는 행을 전부 지우고 되돌릴 수 없으며 구조는 남는다. DROP 은 표 자체를 없앤다.",
        wrong:
          "TRUNCATE 는 지운 행을 ROLLBACK 으로 되돌릴 수 있고, DELETE 는 되돌릴 수 없다.",
      },
    ],
    table: {
      title: "지우는 세 가지",
      headers: ["명령", "종류", "되돌리기", "남는 것"],
      rows: [
        ["DELETE", "DML", "된다 (ROLLBACK)", "표 구조와 안 지운 행"],
        ["TRUNCATE", "DDL", "안 된다", "표 구조만"],
        ["DROP", "DDL", "안 된다", "아무것도"],
      ],
    },
  },
  {
    id: "s-tcl",
    subject: "sql",
    chapter: "s-manage",
    title: "TCL — COMMIT·ROLLBACK·SAVEPOINT",
    term: "TCL",
    summary:
      "COMMIT 은 확정, ROLLBACK 은 되돌리기, SAVEPOINT 는 중간에 표시를 찍어 거기까지만 되돌리는 것이다.",
    detail:
      "트랜잭션은 원자성·일관성·고립성·지속성(ACID)을 갖는다. 원자성은 전부 되거나 전부 안 되는 것, 일관성은 앞뒤로 규칙이 지켜지는 것, 고립성은 동시에 돌아도 서로 간섭하지 않는 것, 지속성은 확정된 것이 남는 것이다. DDL 은 실행하는 순간 자동으로 COMMIT 되므로, 그 앞의 DML 까지 함께 확정된다는 점을 놓치기 쉽다.",
    examPoint:
      "DDL 이 자동 COMMIT 을 일으킨다는 점, SAVEPOINT 로 되돌리면 그 지점 이후만 취소된다는 점이 나온다.",
    importance: 4,
    keywords: ["COMMIT", "ROLLBACK", "SAVEPOINT", "ACID", "자동 커밋"],
    traps: [
      {
        concept: "ROLLBACK vs ROLLBACK TO SAVEPOINT",
        difference:
          "그냥 ROLLBACK 은 트랜잭션 전체를 되돌리고, ROLLBACK TO SAVEPOINT 는 그 표시 이후만 되돌리며 트랜잭션은 이어진다.",
        wrong:
          "ROLLBACK TO SAVEPOINT 는 트랜잭션 전체를 되돌리고 트랜잭션을 끝낸다.",
      },
    ],
  },
  {
    id: "s-ddl-dcl",
    subject: "sql",
    chapter: "s-manage",
    title: "DDL 과 DCL",
    term: "DDL 과 DCL",
    summary:
      "DDL 은 구조를 만들고 바꾸는 것(CREATE·ALTER·DROP·TRUNCATE), DCL 은 권한을 주고 뺏는 것(GRANT·REVOKE)이다.",
    detail:
      "ALTER TABLE 로 열을 더하거나(ADD) 이름을 바꾸거나(RENAME) 없앨(DROP) 수 있다. 열의 자료형을 줄이는 것은 이미 든 값보다 작게는 못 줄인다. DDL 은 실행 즉시 확정되어 ROLLBACK 으로 되돌릴 수 없다. DCL 의 GRANT 는 권한을 주고 REVOKE 는 거둬들이며, WITH GRANT OPTION 으로 받은 사람이 다시 남에게 줄 수 있게 할 수 있다.",
    examPoint:
      "DDL·DML·DCL·TCL 중 어디에 속하는지 분류를 묻는다. TRUNCATE 가 DDL 이라는 점이 자주 걸린다.",
    importance: 4,
    keywords: ["CREATE", "ALTER", "DROP", "TRUNCATE", "GRANT", "REVOKE"],
    traps: [
      {
        concept: "TRUNCATE 는 DDL",
        difference:
          "이름은 데이터를 지우는 것 같지만 TRUNCATE 는 DDL 이라 자동 확정되어 ROLLBACK 으로 되돌릴 수 없다.",
        wrong:
          "TRUNCATE 는 DML 이므로 COMMIT 전까지 ROLLBACK 으로 되돌릴 수 있다.",
      },
    ],
    table: {
      title: "명령 분류",
      headers: ["분류", "명령", "자동 확정"],
      rows: [
        ["DDL", "CREATE · ALTER · DROP · TRUNCATE", "그렇다"],
        ["DML", "INSERT · UPDATE · DELETE · MERGE", "아니다"],
        ["DCL", "GRANT · REVOKE", "그렇다"],
        ["TCL", "COMMIT · ROLLBACK · SAVEPOINT", "—"],
      ],
    },
  },
  {
    id: "s-view",
    subject: "sql",
    chapter: "s-manage",
    title: "뷰 — 저장된 질의",
    term: "뷰",
    summary:
      "뷰는 데이터를 갖지 않고 질의만 저장한다. 쓸 때마다 원본을 다시 읽는다.",
    detail:
      "뷰를 쓰면 복잡한 질의를 이름 하나로 부를 수 있고, 원본의 일부 열만 보여 줘 보안에도 쓴다. 원본 표의 구조가 바뀌어도 뷰만 고치면 되므로 독립성이 생긴다. 다만 뷰는 자료를 갖고 있지 않아 조회할 때마다 원본을 읽으므로 그 자체로 빨라지지는 않는다. 집계나 DISTINCT 가 들어간 뷰는 갱신할 수 없다.",
    examPoint:
      "'뷰는 데이터를 저장하므로 조회가 빨라진다'는 틀리다. 데이터를 실제로 갖는 것은 구체화 뷰(materialized view)다.",
    importance: 3,
    keywords: ["뷰", "독립성", "보안", "구체화 뷰"],
    traps: [
      {
        concept: "뷰 vs 구체화 뷰",
        difference:
          "뷰는 질의만 저장해 조회할 때마다 원본을 읽는다. 구체화 뷰는 결과를 실제로 저장해 두어 빠르지만 원본과 어긋날 수 있다.",
        wrong:
          "뷰는 결과를 실제로 저장해 두어 조회가 빠르고, 구체화 뷰는 질의만 저장해 매번 원본을 읽는다.",
      },
    ],
  },
];
