import type { Concept } from "@/lib/types";

/**
 * 2과목 — SQL 기본 (s-basic)
 *
 * 여기서 흔들리면 뒤가 전부 흔들린다. 특히 NULL 과 조인은 뒤에 나오는
 * 서브쿼리·윈도우 함수 문제에서도 계속 발목을 잡는다.
 *
 * 개념마다 sql 을 붙여 두었다. 머릿속으로 결과를 그리다 틀리는 자리가
 * 많아서, 바로 돌려 보는 편이 빠르기 때문이다.
 */
export const CONCEPTS_SQL_BASIC: Concept[] = [
  {
    id: "s-null",
    subject: "sql",
    chapter: "s-basic",
    title: "NULL — 값이 아니라 '모른다'",
    term: "NULL",
    summary:
      "NULL 은 0 도 빈 문자열도 아니다. 어떤 연산을 해도 NULL 이고, 비교하면 참도 거짓도 아니다.",
    detail:
      "NULL 에 무엇을 더하거나 이어 붙여도 결과는 NULL 이다. 그래서 NULL 을 다룰 때는 NVL(오라클)·COALESCE(표준) 같은 함수로 먼저 바꿔 놓아야 한다. 비교도 특별하다. `= NULL` 이나 `<> NULL` 은 절대 참이 되지 않으므로 `IS NULL`·`IS NOT NULL` 을 써야 한다. 집계 함수는 NULL 을 아예 빼고 계산하는데, COUNT(*) 만은 행 수를 세므로 NULL 이 있어도 함께 센다.",
    examPoint:
      "COUNT(*) 와 COUNT(열) 의 차이가 거의 매회 나온다. 열을 지정하면 그 열이 NULL 인 행은 세지 않는다. 그리고 NULL 이 섞인 SUM/AVG 의 분모가 무엇인지 묻는다.",
    importance: 5,
    keywords: ["NULL", "IS NULL", "NVL", "COALESCE", "COUNT(*)"],
    traps: [
      {
        concept: "COUNT(*) vs COUNT(열)",
        difference:
          "COUNT(*) 는 행 수를 세므로 NULL 이 있어도 센다. COUNT(열) 은 그 열이 NULL 인 행을 빼고 센다.",
        wrong:
          "COUNT(*) 는 NULL 인 행을 빼고 세고, COUNT(열) 은 NULL 이 있어도 행 수를 그대로 센다.",
      },
      {
        concept: "= NULL vs IS NULL",
        difference:
          "= NULL 은 어떤 경우에도 참이 되지 않는다. NULL 인지 확인하려면 IS NULL 을 써야 한다.",
        wrong:
          "= NULL 로 NULL 인 행을 찾을 수 있고, IS NULL 은 값이 있는 행을 찾을 때 쓴다.",
      },
    ],
    sql: {
      caption: "NULL 이 섞이면 어떻게 되는지 한눈에",
      query: `SELECT COUNT(*)        AS "행 수",
       COUNT(bonus)    AS "보너스 있는 행",
       SUM(bonus)      AS "보너스 합",
       AVG(bonus)      AS "보너스 평균",
       10 + NULL       AS "NULL 더하기"
FROM emp;`,
    },
  },
  {
    id: "s-select-order",
    subject: "sql",
    chapter: "s-basic",
    title: "SQL 이 실행되는 순서",
    term: "SQL 실행 순서",
    summary:
      "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. 쓰는 순서와 실행 순서가 다르다.",
    detail:
      "SELECT 절이 거의 마지막에 실행되기 때문에, SELECT 에서 붙인 별칭(alias)을 WHERE 에서는 쓸 수 없다. 반면 ORDER BY 는 SELECT 다음이라 별칭을 쓸 수 있다. 또 WHERE 는 그룹으로 묶기 전에 행을 걸러 내고, HAVING 은 묶은 뒤의 그룹을 걸러 낸다. 그래서 집계 함수 조건은 HAVING 에 써야 한다.",
    examPoint:
      "'WHERE 절에서 별칭을 쓸 수 있다'는 틀리다. 그리고 WHERE 에 집계 함수를 쓸 수 없다는 점, 반대로 HAVING 에는 쓸 수 있다는 점이 짝으로 나온다.",
    importance: 5,
    keywords: ["실행 순서", "FROM", "WHERE", "GROUP BY", "HAVING", "별칭"],
    traps: [
      {
        concept: "WHERE vs HAVING",
        difference:
          "WHERE 는 묶기 전에 행을 거르고 집계 함수를 쓸 수 없다. HAVING 은 묶은 뒤 그룹을 거르고 집계 함수를 쓸 수 있다.",
        wrong:
          "WHERE 는 그룹으로 묶은 뒤 집계 결과를 거르고, HAVING 은 묶기 전에 행을 거른다.",
      },
      {
        concept: "별칭을 쓸 수 있는 곳",
        difference:
          "ORDER BY 는 SELECT 다음에 실행되어 별칭을 쓸 수 있지만, WHERE·GROUP BY·HAVING 은 그 전이라 쓸 수 없다.",
        wrong:
          "WHERE 절에서는 SELECT 에서 붙인 별칭을 그대로 쓸 수 있고, ORDER BY 에서는 쓸 수 없다.",
      },
    ],
    table: {
      title: "쓰는 순서와 실행 순서",
      headers: ["쓰는 순서", "실행 순서"],
      rows: [
        ["SELECT", "5"],
        ["FROM", "1"],
        ["WHERE", "2"],
        ["GROUP BY", "3"],
        ["HAVING", "4"],
        ["ORDER BY", "6"],
      ],
    },
  },
  {
    id: "s-where",
    subject: "sql",
    chapter: "s-basic",
    title: "WHERE 조건 — BETWEEN·IN·LIKE",
    term: "WHERE 조건",
    summary:
      "BETWEEN 은 양 끝을 포함하고, IN 은 목록 중 하나, LIKE 는 %(여러 글자)와 _(한 글자)로 찾는다.",
    detail:
      "BETWEEN a AND b 는 a 와 b 를 모두 포함한다(a <= x <= b). 날짜에 쓸 때 시각이 붙어 있으면 마지막 날의 00시만 포함되어 하루가 빠지는 일이 잦다. IN 은 OR 를 줄여 쓴 것과 같고, NOT IN 은 목록에 NULL 이 있으면 결과가 통째로 비므로 조심해야 한다. LIKE 에서 %나 _ 자체를 찾으려면 ESCAPE 를 쓴다.",
    examPoint:
      "BETWEEN 이 양 끝을 포함하는지, NOT IN 에 NULL 이 섞이면 어떻게 되는지가 나온다. NOT IN + NULL 은 아무 행도 안 나오는 것이 정답이다.",
    importance: 4,
    keywords: ["BETWEEN", "IN", "NOT IN", "LIKE", "ESCAPE"],
    traps: [
      {
        concept: "IN vs NOT IN (NULL 이 섞였을 때)",
        difference:
          "IN 은 NULL 이 섞여도 나머지와 비교해 결과가 나오지만, NOT IN 은 NULL 과의 비교가 참이 될 수 없어 결과가 통째로 비어 버린다.",
        wrong:
          "NOT IN 은 목록에 NULL 이 있어도 나머지 값과 비교해 정상적으로 결과를 돌려주고, IN 은 결과가 비어 버린다.",
      },
    ],
    sql: {
      caption: "NOT IN 에 NULL 이 섞이면 결과가 사라진다",
      query: `SELECT '결과 있음' AS a FROM emp WHERE deptno IN (10, 20)
UNION ALL
SELECT '결과 없음' FROM emp WHERE deptno NOT IN (10, NULL);`,
    },
  },
  {
    id: "s-function",
    subject: "sql",
    chapter: "s-basic",
    title: "단일행 함수와 형 변환",
    term: "단일행 함수",
    summary:
      "단일행 함수는 행마다 하나씩 결과를 내고, 집계 함수는 여러 행을 묶어 하나를 낸다.",
    detail:
      "문자 함수(SUBSTR·INSTR·REPLACE·TRIM), 숫자 함수(ROUND·TRUNC·MOD), 날짜 함수, 변환 함수(TO_CHAR·TO_NUMBER·TO_DATE), NULL 함수(NVL·NVL2·COALESCE·NULLIF)가 있다. ROUND 는 반올림, TRUNC 는 자리를 잘라 버린다. 자료형이 다른 값을 비교하면 데이터베이스가 알아서 바꾸는데(암시적 형 변환), 이때 인덱스를 못 쓰게 되는 일이 있어 되도록 명시적으로 바꿔 준다.",
    examPoint:
      "ROUND 와 TRUNC 를 음수 자릿수로 주었을 때의 결과를 묻는다. -1 은 십의 자리에서 처리한다는 뜻이다. NVL2 는 인자가 셋(값이 있으면 두 번째, 없으면 세 번째)이라는 점도 나온다.",
    importance: 4,
    keywords: ["SUBSTR", "ROUND", "TRUNC", "NVL", "NVL2", "COALESCE", "NULLIF"],
    traps: [
      {
        concept: "ROUND vs TRUNC",
        difference:
          "ROUND 는 반올림하고 TRUNC 는 그냥 잘라 버린다. TRUNC(15.7) 은 15, ROUND(15.7) 은 16 이다.",
        wrong:
          "ROUND 는 자리를 잘라 버리고, TRUNC 는 반올림한다.",
      },
      {
        concept: "NVL vs NVL2 vs NULLIF",
        difference:
          "NVL(a,b) 는 a 가 NULL 이면 b. NVL2(a,b,c) 는 a 가 NULL 이 아니면 b, NULL 이면 c. NULLIF(a,b) 는 a 와 b 가 같으면 NULL, 다르면 a.",
        wrong:
          "NVL2(a,b,c) 는 a 가 NULL 이면 b 를 돌려주고, NULLIF(a,b) 는 두 값이 다르면 NULL 을 돌려준다.",
      },
    ],
    sql: {
      caption: "반올림과 잘라내기를 나란히",
      query: `SELECT ROUND(15.75, 1)  AS "ROUND 소수1",
       ROUND(15.75, -1) AS "ROUND 십의자리",
       CAST(15.75 AS INT) AS "정수로 자르기",
       NULLIF(10, 10)   AS "같으면 NULL",
       COALESCE(NULL, NULL, 7) AS "처음 나온 값";`,
    },
  },
  {
    id: "s-groupby",
    subject: "sql",
    chapter: "s-basic",
    title: "GROUP BY 와 집계 함수",
    term: "GROUP BY 와 집계 함수",
    summary:
      "GROUP BY 에 없는 열은 SELECT 에 그냥 쓸 수 없다. 집계 함수는 NULL 을 빼고 계산한다.",
    detail:
      "GROUP BY 로 묶으면 그 그룹을 대표하는 값만 SELECT 에 올 수 있다. 즉 GROUP BY 에 적은 열이거나 집계 함수여야 한다. 집계 함수(SUM·AVG·MAX·MIN·COUNT)는 NULL 을 계산에서 뺀다. 그래서 AVG 는 'NULL 을 뺀 개수'로 나눈다. 전체 행 수로 나누고 싶다면 NVL 로 0 을 채운 뒤 평균을 내야 한다.",
    examPoint:
      "AVG 의 분모가 무엇인지 묻는 문제가 단골이다. NULL 이 두 개 섞인 5행에서 AVG 는 3으로 나눈다.",
    importance: 5,
    keywords: ["GROUP BY", "HAVING", "SUM", "AVG", "COUNT", "집계 함수"],
    traps: [
      {
        concept: "AVG 와 NULL",
        difference:
          "AVG 는 NULL 인 행을 분모에서 뺀다. 전체 행 수로 나누려면 NVL(열,0) 처럼 값을 채운 뒤 평균을 내야 한다.",
        wrong:
          "AVG 는 NULL 을 0 으로 보고 전체 행 수로 나눈다.",
      },
    ],
    sql: {
      caption: "AVG 의 분모는 NULL 을 뺀 개수다",
      query: `SELECT COUNT(*)                AS "전체 행",
       COUNT(bonus)            AS "보너스 있는 행",
       SUM(bonus)              AS "합계",
       AVG(bonus)              AS "AVG (NULL 제외)",
       SUM(bonus) * 1.0 / COUNT(*) AS "전체로 나눈 평균"
FROM emp;`,
    },
  },
  {
    id: "s-join-basic",
    subject: "sql",
    chapter: "s-basic",
    title: "조인 — INNER 와 OUTER",
    term: "INNER 조인과 OUTER 조인",
    summary:
      "INNER JOIN 은 양쪽에 다 있는 것만, LEFT OUTER JOIN 은 왼쪽은 다 남기고 오른쪽은 없으면 NULL 이다.",
    detail:
      "조인 조건에 맞는 짝이 없으면 INNER JOIN 에서는 그 행이 사라진다. 그것이 문제가 될 때 OUTER JOIN 을 쓴다. 주의할 점은 OUTER JOIN 에서 조건을 WHERE 에 쓰면 다시 INNER 처럼 되어 버린다는 것이다. 오른쪽 표에 대한 조건은 ON 절에 적어야 한다. CROSS JOIN 은 조건 없이 모든 짝을 만들어 행 수가 곱해진다.",
    examPoint:
      "LEFT OUTER JOIN 뒤 WHERE 에 오른쪽 표의 조건을 걸면 결과가 어떻게 되는지 묻는다. NULL 인 행이 조건에서 걸러져 INNER 와 같아진다.",
    importance: 5,
    keywords: ["INNER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "ON", "NATURAL JOIN"],
    traps: [
      {
        concept: "OUTER JOIN 의 조건을 ON 에 vs WHERE 에",
        difference:
          "ON 에 적으면 짝을 찾는 조건이라 왼쪽 행이 남지만, WHERE 에 적으면 조인이 끝난 뒤 거르므로 NULL 인 행이 사라져 INNER 와 같아진다.",
        wrong:
          "OUTER JOIN 에서 오른쪽 표의 조건을 WHERE 에 적어도 왼쪽 행은 그대로 남고, ON 에 적으면 걸러진다.",
      },
      {
        concept: "NATURAL JOIN vs USING",
        difference:
          "NATURAL JOIN 은 이름이 같은 모든 열로 알아서 잇고, USING 은 지정한 열로만 잇는다. 둘 다 그 열에 별칭을 붙일 수 없다.",
        wrong:
          "NATURAL JOIN 은 지정한 열로만 잇고, USING 은 이름이 같은 모든 열로 알아서 잇는다.",
      },
    ],
    table: {
      title: "조인 종류",
      headers: ["종류", "남는 행"],
      rows: [
        ["INNER JOIN", "양쪽에 짝이 있는 행만"],
        ["LEFT OUTER", "왼쪽 전부 + 짝이 있으면 오른쪽"],
        ["RIGHT OUTER", "오른쪽 전부 + 짝이 있으면 왼쪽"],
        ["FULL OUTER", "양쪽 전부"],
        ["CROSS JOIN", "모든 짝 (행 수가 곱해진다)"],
      ],
    },
    sql: {
      caption: "INNER 와 LEFT OUTER 의 행 수 차이",
      query: `SELECT 'INNER' AS 종류, COUNT(*) AS 행수
FROM emp e JOIN dept d ON e.deptno = d.deptno
UNION ALL
SELECT 'LEFT OUTER', COUNT(*)
FROM emp e LEFT JOIN dept d ON e.deptno = d.deptno;`,
    },
  },
  {
    id: "s-orderby",
    subject: "sql",
    chapter: "s-basic",
    title: "ORDER BY 와 NULL 의 자리",
    term: "ORDER BY",
    summary:
      "기본은 오름차순이고, NULL 이 어디에 놓이는지는 데이터베이스마다 다르다.",
    detail:
      "ORDER BY 는 가장 마지막에 실행되므로 SELECT 의 별칭이나 열 번호를 쓸 수 있다. 오름차순이 기본(ASC)이며 내림차순은 DESC 다. 오라클은 오름차순에서 NULL 을 맨 뒤에 두고, 다른 데이터베이스는 맨 앞에 두기도 한다. 그래서 자리를 못 박으려면 NULLS FIRST·NULLS LAST 를 명시한다.",
    examPoint:
      "ORDER BY 에 열 번호(1, 2)를 쓸 수 있다는 점, 별칭을 쓸 수 있다는 점이 나온다. 정렬 기준을 여러 개 쓸 때는 앞의 것이 같을 때만 뒤의 것이 쓰인다.",
    importance: 3,
    keywords: ["ORDER BY", "ASC", "DESC", "NULLS FIRST", "NULLS LAST", "열 번호"],
    traps: [
      {
        concept: "ORDER BY 에서 쓸 수 있는 것",
        difference:
          "가장 마지막에 실행되므로 SELECT 의 별칭과 열 번호를 모두 쓸 수 있다. WHERE 에서는 둘 다 쓸 수 없다.",
        wrong:
          "ORDER BY 에서는 별칭을 쓸 수 없고 반드시 원래 열 이름을 적어야 한다.",
      },
    ],
  },
  {
    id: "s-ddl-datatype",
    subject: "sql",
    chapter: "s-basic",
    title: "관계형 데이터베이스와 키",
    term: "관계형 데이터베이스와 키",
    summary:
      "기본키는 유일하고 NULL 이 아니며, 외래키는 다른 표의 기본키를 가리키되 NULL 일 수 있다.",
    detail:
      "기본키(PK)는 한 줄을 가려내는 열로, 유일하고 NULL 을 허용하지 않는다. 표마다 하나만 둘 수 있다. 외래키(FK)는 다른 표의 기본키를 가리켜 관계를 만든다. 아직 정해지지 않았을 수 있으므로 NULL 을 허용하며, 한 표에 여러 개 둘 수 있다. UNIQUE 제약은 유일하지만 NULL 은 허용한다는 점에서 기본키와 다르다.",
    examPoint:
      "'외래키는 NULL 을 가질 수 없다'는 틀리다. 그리고 UNIQUE 와 기본키의 차이(NULL 허용 여부)가 자주 나온다.",
    importance: 4,
    keywords: ["기본키", "외래키", "UNIQUE", "NOT NULL", "참조 무결성"],
    traps: [
      {
        concept: "기본키 vs UNIQUE",
        difference:
          "둘 다 유일하지만 기본키는 NULL 을 허용하지 않고 표에 하나뿐이다. UNIQUE 는 NULL 을 허용하고 여러 개 둘 수 있다.",
        wrong:
          "기본키는 NULL 을 허용하고 여러 개 둘 수 있으며, UNIQUE 는 NULL 을 허용하지 않고 하나만 둘 수 있다.",
      },
      {
        concept: "기본키 vs 외래키",
        difference:
          "기본키는 자기 표의 한 줄을 가려내고 NULL 이 될 수 없다. 외래키는 다른 표를 가리키며 NULL 이 될 수 있다.",
        wrong:
          "외래키는 NULL 이 될 수 없고 표에 하나만 둘 수 있으며, 기본키는 NULL 을 허용한다.",
      },
    ],
  },
];
