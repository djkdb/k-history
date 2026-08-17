import type { SubjectId } from "@/lib/types";

/**
 * 쿼리를 주고 결과를 묻는 문제.
 *
 * 실제 SQLD 2과목은 서술형 4지선다만 나오지 않는다. [보기]에 SQL 을 주고
 * "실행 결과로 알맞은 것은?" 을 묻는 문제가 큰 몫을 차지한다. 개념에서
 * 만들어 내는 문제만으로는 그 감각이 생기지 않아 여기에 따로 적어 둔다.
 *
 * ⚠️ answer 는 사람이 적는 것이 아니다. scripts/audit.ts 가 실습판(emp·dept)에
 *    쿼리를 실제로 돌려, 적어 둔 정답이 진짜 그 결과인지 대조한다.
 *    틀리면 배포가 막힌다 — 문제집의 오답보다 나쁜 것은 없다.
 */
export interface SqlQuizItem {
  id: string;
  subject: SubjectId;
  chapter: string;
  /** 무엇을 묻는가 */
  question: string;
  /** [보기] 에 들어갈 쿼리 — 수험생이 읽는 것 */
  sql: string;
  /**
   * 정답을 확인할 때 돌리는 쿼리.
   *
   * [보기] 는 시험지에 어울리게 자연스러운 문장이어야 하고("사원 목록을
   * 뽑는 SELECT"), 정답은 그중 한 조각을 묻는다("NULL 인 행이 몇 개인가").
   * 그래서 확인용 쿼리를 따로 둔다. 없으면 sql 을 그대로 돌린다.
   */
  verify?: string;
  /**
   * 정답을 어떻게 확인하는가.
   *   rows  — 결과 행 수
   *   cell  — 첫 행 첫 열의 값
   *   list  — 첫 열의 값을 순서대로 이어 붙인 것
   */
  check: "rows" | "cell" | "list";
  /** 정답 (감사가 실제 실행 결과와 대조한다) */
  answer: string;
  /** 오답 셋 */
  wrong: string[];
  /** 왜 그런가 */
  explanation: string;
  /** 어느 개념으로 이어지는가 */
  links: string[];
  importance: 1 | 2 | 3 | 4 | 5;
}

export const SQL_QUIZ: SqlQuizItem[] = [
  {
    id: "sq-null-compare",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: "SELECT COUNT(*) FROM emp WHERE bonus = NULL;",
    check: "cell",
    answer: "0",
    wrong: ["4", "10", "오류가 발생한다"],
    explanation:
      "NULL 은 = 로 비교할 수 없다. 참도 거짓도 아닌 '알 수 없음'이 되어 어떤 행도 고르지 못한다. 오류가 나지 않고 조용히 0행이 되므로 더 위험하다. IS NULL 을 써야 한다.",
    links: ["s-null"],
    importance: 5,
  },
  {
    id: "sq-null-arith",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 로 조회했을 때, total 이 NULL 로 나오는 행은 몇 개인가?",
    sql: "SELECT ename, sal + bonus AS total FROM emp;",
    verify: "SELECT COUNT(*) FROM emp WHERE sal + bonus IS NULL;",
    check: "cell",
    answer: "4개",
    wrong: ["0개", "6개", "10개"],
    explanation:
      "NULL 에 무엇을 더해도 NULL 이다. 보너스가 없는 네 사람의 total 이 통째로 NULL 이 된다. NVL(bonus, 0) 으로 채운 뒤 더해야 한다.",
    links: ["s-null", "s-null-functions"],
    importance: 5,
  },
  {
    id: "sq-count-star",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: "SELECT COUNT(*), COUNT(bonus) FROM emp;",
    check: "list",
    answer: "10, 6",
    wrong: ["10, 10", "6, 6", "6, 10"],
    explanation:
      "COUNT(*) 는 행의 수를 세므로 NULL 과 무관하게 10 이다. COUNT(열) 은 그 열이 NULL 인 행을 빼고 세므로 보너스가 있는 6 이다. 이 차이가 평균의 분모를 가른다.",
    links: ["s-aggregate-kind", "s-null"],
    importance: 5,
  },
  {
    id: "sq-outer-count",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 을 실행했을 때 '감사' 부서의 값으로 알맞은 것은?",
    sql: `SELECT d.dname, COUNT(*) AS cnt
FROM dept d LEFT JOIN emp e ON d.deptno = e.deptno
GROUP BY d.dname;`,
    verify: `SELECT COUNT(*) FROM dept d LEFT JOIN emp e ON d.deptno = e.deptno
WHERE d.dname = '감사';`,
    check: "cell",
    answer: "1 — 사원이 없는데도 1로 세어진다",
    wrong: [
      "0 — 사원이 없으므로 0이다",
      "NULL — 셀 것이 없으므로 NULL 이다",
      "행 자체가 나오지 않는다",
    ],
    explanation:
      "OUTER 조인이라 사원이 없는 부서도 한 줄 남는데, 그 줄의 사원 쪽 열은 전부 NULL 이다. COUNT(*) 는 행을 세므로 그 NULL 줄까지 1로 센다. 0 을 얻으려면 COUNT(e.empno) 처럼 열을 세야 한다.",
    links: ["s-join-basic"],
    importance: 5,
  },
  {
    id: "sq-and-or",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: "SELECT COUNT(*) FROM emp WHERE deptno = 20 OR deptno = 30 AND sal >= 450;",
    check: "cell",
    answer: "6",
    wrong: ["3", "4", "8"],
    explanation:
      "괄호가 없으면 AND 가 먼저 묶인다. 'deptno = 20' 이거나 '(deptno = 30 이면서 sal >= 450)' 이므로, 20번 부서는 급여와 상관없이 전부 들어온다. 뜻대로 묶으려면 괄호를 직접 쳐야 한다.",
    links: ["s-operator-order"],
    importance: 5,
  },
  {
    id: "sq-rank-skip",
    subject: "sql",
    chapter: "s-advanced",
    question: "다음 SQL 을 실행했을 때, 급여가 세 번째로 높은 사람들의 순위 값은?",
    sql: "SELECT ename, sal, RANK() OVER (ORDER BY sal DESC) AS rnk FROM emp;",
    verify: `SELECT rnk FROM (
  SELECT sal, RANK() OVER (ORDER BY sal DESC) AS rnk FROM emp
) WHERE sal = 600 LIMIT 1;`,
    check: "cell",
    answer: "2 — 동점이 둘이라 같은 순위를 받는다",
    wrong: [
      "3 — 세 번째 줄이므로 3이다",
      "1 — 동점은 앞 순위로 당겨진다",
      "동점이면 순위가 매겨지지 않는다",
    ],
    explanation:
      "급여 600 인 두 사람이 나란히 2위다. RANK 는 동점에게 같은 순위를 주고 그다음을 건너뛰므로 그 뒤는 4위가 된다. 건너뛰지 않는 것이 DENSE_RANK, 동점에도 다른 번호를 주는 것이 ROW_NUMBER 다.",
    links: ["s-window"],
    importance: 5,
  },
  {
    id: "sq-having",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: `SELECT deptno, COUNT(*) AS cnt
FROM emp
GROUP BY deptno
HAVING COUNT(*) >= 4;`,
    check: "rows",
    answer: "2행",
    wrong: ["1행", "3행", "오류가 발생한다"],
    explanation:
      "묶은 뒤의 결과로 거르는 것이므로 HAVING 이다. 사원이 4명 이상인 부서는 20번(4명)과 30번(4명) 둘이다. 같은 조건을 WHERE 에 쓰면 묶기 전이라 셀 것이 없어 오류가 난다.",
    links: ["s-having-where", "s-groupby"],
    importance: 5,
  },
  {
    id: "sq-union-all",
    subject: "sql",
    chapter: "s-advanced",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: `SELECT deptno FROM emp WHERE sal >= 600
UNION
SELECT deptno FROM emp WHERE bonus >= 100;`,
    check: "rows",
    answer: "3행",
    wrong: ["5행", "6행", "2행"],
    explanation:
      "UNION 은 양쪽을 합친 뒤 중복을 없앤다. 남는 부서 번호는 10·20·30 세 개다. 중복을 그대로 두려면 UNION ALL 을 써야 하고, 그때는 행이 더 많아진다.",
    links: ["s-setop", "s-setop-intersect"],
    importance: 4,
  },
  {
    id: "sq-self-join-inner",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 의 실행 결과 행 수로 알맞은 것은?",
    sql: `SELECT e.ename, m.ename AS mgr_name
FROM emp e JOIN emp m ON e.mgr = m.empno;`,
    check: "rows",
    answer: "9행",
    wrong: ["10행", "8행", "100행"],
    explanation:
      "INNER 조인이라 관리자가 없는 사람(mgr 가 NULL)은 짝을 찾지 못해 사라진다. 사원 10명 중 최상위 한 명이 빠져 9행이다. 그 사람까지 남기려면 LEFT OUTER 조인이어야 한다.",
    links: ["s-join-self", "s-join-basic"],
    importance: 5,
  },
  {
    id: "sq-avg-null",
    subject: "sql",
    chapter: "s-basic",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: "SELECT SUM(bonus), COUNT(bonus), AVG(bonus) FROM emp;",
    check: "list",
    answer: "400, 6, 66.67 — 분모가 10이 아니라 6이다",
    wrong: [
      "400, 10, 40 — 전체 인원으로 나눈다",
      "NULL, 6, NULL — NULL 이 섞이면 합계도 NULL 이다",
      "400, 6, 40 — 합계는 값 있는 것만, 평균은 전체로 나눈다",
    ],
    explanation:
      "집계 함수는 NULL 인 행을 아예 빼고 계산한다. 그래서 AVG 의 분모는 전체 10명이 아니라 보너스가 있는 6명이다. 전체로 나누려면 SUM(bonus)/COUNT(*) 처럼 직접 나눠야 한다.",
    links: ["s-groupby", "s-null"],
    importance: 5,
  },
  {
    id: "sq-not-in-null",
    subject: "sql",
    chapter: "s-advanced",
    question: "다음 SQL 의 실행 결과로 알맞은 것은?",
    sql: `SELECT COUNT(*) FROM emp
WHERE empno NOT IN (SELECT mgr FROM emp);`,
    check: "cell",
    answer: "0",
    wrong: ["4", "5", "10"],
    explanation:
      "서브쿼리가 돌려주는 mgr 목록에 NULL 이 섞여 있다. NOT IN 은 그 NULL 과의 비교가 참이 될 수 없어 결과가 통째로 빈다. NOT EXISTS 로 쓰거나 서브쿼리에서 NULL 을 걸러야 한다.",
    links: ["s-subquery-exists", "s-null"],
    importance: 5,
  },
];
