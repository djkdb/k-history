import type { Concept } from "@/lib/types";

/**
 * 2과목 보강 — 40문항을 감당하려면 이만큼은 있어야 한다.
 *
 * 앞의 두 파일이 큰 줄기라면 여기는 그 사이를 메운다. 표준 조인, 문자·날짜
 * 함수, CASE·DECODE, 제약조건, 인덱스처럼 "따로 한 문항씩 나오는 것"들이다.
 */
export const CONCEPTS_SQL_MORE: Concept[] = [
  {
    id: "s-standard-join",
    subject: "sql",
    chapter: "s-basic",
    title: "표준 조인 — NATURAL·USING·CROSS",
    term: "표준 조인",
    summary:
      "NATURAL JOIN 은 같은 이름의 열로 알아서 잇고, USING 은 지정한 열로만 이으며, CROSS JOIN 은 조건 없이 모두 짝짓는다.",
    detail:
      "NATURAL JOIN 은 두 표에서 이름이 같은 모든 열을 조인 조건으로 삼는다. 편해 보이지만 나중에 같은 이름의 열이 하나 늘면 조건이 저절로 바뀌어 위험하다. USING 은 쓸 열을 직접 적으므로 안전하다. 두 방식 모두 조인에 쓴 열에는 표 별칭을 붙일 수 없다는 점이 같다. CROSS JOIN 은 조건이 없어 결과 행 수가 두 표의 곱이 된다.",
    examPoint:
      "'NATURAL JOIN 에서 조인 열에 별칭을 붙일 수 있다'는 틀리다. 그리고 CROSS JOIN 의 결과 행 수(m×n)를 계산시킨다.",
    importance: 4,
    keywords: ["NATURAL JOIN", "USING", "CROSS JOIN", "조인 조건", "별칭"],
    traps: [
      {
        concept: "NATURAL JOIN vs USING",
        difference:
          "NATURAL 은 이름이 같은 모든 열로 자동으로 잇고, USING 은 적어 준 열로만 잇는다. 둘 다 그 열에 별칭을 못 붙인다.",
        wrong:
          "NATURAL JOIN 은 적어 준 열로만 잇고, USING 은 이름이 같은 모든 열로 자동으로 잇는다.",
      },
    ],
    sql: {
      caption: "CROSS JOIN 은 행 수가 곱해진다",
      query: `SELECT (SELECT COUNT(*) FROM emp)  AS "사원 수",
       (SELECT COUNT(*) FROM dept) AS "부서 수",
       (SELECT COUNT(*) FROM emp, dept) AS "CROSS 결과";`,
    },
  },
  {
    id: "s-case",
    subject: "sql",
    chapter: "s-basic",
    title: "CASE 와 DECODE — 조건에 따라 값을 바꾸기",
    term: "CASE 와 DECODE",
    summary:
      "CASE 는 위에서부터 맞는 것을 찾아 멈춘다. 그래서 넓은 조건을 위에 두면 아래가 영영 걸리지 않는다.",
    detail:
      "CASE WHEN 조건 THEN 값 ... ELSE 값 END 꼴로 쓴다. 조건을 위에서부터 차례로 보다가 처음 맞는 것에서 멈추므로 순서가 곧 답이 된다. ELSE 를 빼면 아무 조건에도 안 걸린 행은 NULL 이 된다. DECODE 는 오라클 전용으로 '같으냐'만 따질 수 있고, 범위 비교는 못 한다.",
    examPoint:
      "조건 순서를 뒤바꾼 CASE 문을 주고 결과를 묻는다. 그리고 ELSE 가 없을 때 NULL 이 나온다는 점이 나온다.",
    importance: 5,
    keywords: ["CASE", "WHEN", "ELSE", "DECODE"],
    traps: [
      {
        concept: "CASE vs DECODE",
        difference:
          "CASE 는 범위 비교(>=, BETWEEN)까지 되는 표준 문법이고, DECODE 는 오라클 전용으로 '같으냐'만 따진다.",
        wrong:
          "DECODE 는 범위 비교까지 되는 표준 문법이고, CASE 는 오라클 전용으로 같은지만 따질 수 있다.",
      },
      {
        concept: "ELSE 가 없을 때",
        difference:
          "어느 조건에도 걸리지 않은 행은 NULL 이 된다. 0 이나 빈 문자열이 아니다.",
        wrong:
          "ELSE 를 생략하면 조건에 걸리지 않은 행은 0 으로 채워진다.",
      },
    ],
    sql: {
      caption: "조건 순서를 뒤집으면 결과가 달라진다",
      query: `SELECT ename, sal,
       CASE WHEN sal >= 500 THEN '상'
            WHEN sal >= 300 THEN '중' ELSE '하' END AS "바른 순서",
       CASE WHEN sal >= 300 THEN '중'
            WHEN sal >= 500 THEN '상' ELSE '하' END AS "뒤집은 순서"
FROM emp
ORDER BY sal DESC;`,
    },
  },
  {
    id: "s-string-func",
    subject: "sql",
    chapter: "s-basic",
    title: "문자 함수 — SUBSTR · INSTR · REPLACE · TRIM",
    term: "문자 함수",
    summary:
      "SUBSTR 은 잘라 내고, INSTR 은 위치를 찾고, REPLACE 는 바꾸고, TRIM 은 양끝을 다듬는다.",
    detail:
      "SQL 의 문자 위치는 1부터 센다(0 이 아니다). SUBSTR(문자열, 시작, 길이)에서 시작이 음수면 뒤에서부터 센다. INSTR 은 찾는 것이 없으면 0 을 돌려준다. LPAD·RPAD 는 정해진 길이가 될 때까지 채워 넣는다. 길이를 재는 함수는 LENGTH 이고, 오라클에서 바이트로 재려면 LENGTHB 를 쓴다.",
    examPoint:
      "시작 위치가 1부터라는 점, INSTR 이 못 찾으면 0 이라는 점이 나온다. SUBSTR 의 세 번째 인자는 '끝 위치'가 아니라 '길이'다.",
    importance: 4,
    keywords: ["SUBSTR", "INSTR", "REPLACE", "TRIM", "LPAD", "LENGTH"],
    traps: [
      {
        concept: "SUBSTR 의 세 번째 인자",
        difference:
          "세 번째 인자는 잘라 낼 '길이'다. 끝 위치가 아니다. SUBSTR('ABCDE',2,3) 은 'BCD' 다.",
        wrong:
          "SUBSTR 의 세 번째 인자는 잘라 낼 끝 위치이므로 SUBSTR('ABCDE',2,3) 은 'BC' 다.",
      },
      {
        concept: "INSTR 이 못 찾았을 때",
        difference: "찾는 것이 없으면 0 을 돌려준다. NULL 이 아니다.",
        wrong: "INSTR 은 찾는 문자열이 없으면 NULL 을 돌려준다.",
      },
    ],
    sql: {
      caption: "문자 위치는 1부터 센다",
      query: `SELECT SUBSTR('ABCDE', 2, 3) AS "2번째부터 3글자",
       INSTR('ABCDE', 'C')  AS "C 의 위치",
       INSTR('ABCDE', 'Z')  AS "없으면",
       REPLACE('2024-01-02', '-', '/') AS "바꾸기",
       LENGTH('가나다')     AS "길이";`,
    },
  },
  {
    id: "s-date-func",
    subject: "sql",
    chapter: "s-basic",
    title: "날짜 다루기",
    term: "날짜 함수",
    summary:
      "날짜끼리 빼면 일수가 나오고, 날짜에 숫자를 더하면 그만큼 뒤의 날짜가 된다.",
    detail:
      "오라클에서 SYSDATE 는 지금 시각을, 날짜1 - 날짜2 는 두 날짜 사이의 일수를 돌려준다. MONTHS_BETWEEN 은 개월 수, ADD_MONTHS 는 개월을 더한 날짜, LAST_DAY 는 그 달의 마지막 날이다. 날짜를 문자로 바꿀 때는 TO_CHAR(날짜, 'YYYY-MM-DD'), 문자를 날짜로 바꿀 때는 TO_DATE 를 쓴다. 날짜에 시각이 붙어 있으면 BETWEEN 으로 하루를 잡을 때 마지막 날이 빠지기 쉽다.",
    examPoint:
      "'날짜 - 날짜'의 결과가 무엇인지(일수) 묻는다. 그리고 형식 문자열에서 MM(월)과 MI(분)을 뒤바꾼 선지가 나온다.",
    importance: 3,
    keywords: ["SYSDATE", "MONTHS_BETWEEN", "ADD_MONTHS", "LAST_DAY", "TO_CHAR", "TO_DATE"],
    traps: [
      {
        concept: "MM vs MI",
        difference: "형식에서 MM 은 월(month), MI 는 분(minute)이다.",
        wrong: "형식에서 MM 은 분을 뜻하고, MI 는 월을 뜻한다.",
      },
    ],
    sql: {
      caption: "입사일에서 연도만 뽑아 세어 본다",
      query: `SELECT SUBSTR(hiredate, 1, 4) AS "입사 연도", COUNT(*) AS "인원"
FROM emp
GROUP BY SUBSTR(hiredate, 1, 4)
ORDER BY 1;`,
    },
  },
  {
    id: "s-constraint",
    subject: "sql",
    chapter: "s-manage",
    title: "제약조건 — 값이 들어오기 전에 막는다",
    term: "제약조건",
    summary:
      "PRIMARY KEY·UNIQUE·NOT NULL·CHECK·FOREIGN KEY 로 잘못된 값이 아예 들어오지 못하게 한다.",
    detail:
      "PRIMARY KEY 는 유일하면서 NULL 이 아니어야 하고 표에 하나만 둘 수 있다. UNIQUE 는 유일하되 NULL 은 허용한다. CHECK 는 값의 범위를 정하고, FOREIGN KEY 는 다른 표에 있는 값만 들어오게 한다. 외래키가 걸린 부모 행을 지울 때 어떻게 할지는 ON DELETE CASCADE(같이 지움)·SET NULL(NULL 로 바꿈)로 정한다.",
    examPoint:
      "UNIQUE 가 NULL 을 허용하는지 묻는 문제가 단골이다. 허용한다. 그리고 ON DELETE CASCADE 의 뜻을 묻는다.",
    importance: 4,
    keywords: ["PRIMARY KEY", "UNIQUE", "NOT NULL", "CHECK", "FOREIGN KEY", "CASCADE"],
    traps: [
      {
        concept: "ON DELETE CASCADE vs SET NULL",
        difference:
          "CASCADE 는 부모를 지우면 자식도 함께 지우고, SET NULL 은 자식의 외래키를 NULL 로 바꿔 남긴다.",
        wrong:
          "ON DELETE CASCADE 는 자식의 외래키를 NULL 로 바꿔 남기고, SET NULL 은 자식을 함께 지운다.",
      },
    ],
  },
  {
    id: "s-index",
    subject: "sql",
    chapter: "s-manage",
    title: "인덱스 — 찾는 것은 빨라지고 넣는 것은 느려진다",
    term: "인덱스",
    summary:
      "인덱스는 찾아보기다. 조회는 빨라지지만 INSERT·UPDATE·DELETE 때마다 함께 고쳐야 해 느려진다.",
    detail:
      "인덱스를 걸면 그 열로 찾을 때 전체를 훑지 않아도 된다. 대신 데이터가 바뀔 때마다 인덱스도 고쳐야 하므로 입력·수정·삭제가 느려지고 저장 공간도 더 쓴다. 인덱스 열에 함수를 씌우거나 자료형이 달라 형 변환이 일어나면 인덱스를 타지 못한다. 그래서 WHERE SUBSTR(col,1,2) = 'AB' 같은 조건은 인덱스를 쓰지 못한다.",
    examPoint:
      "'인덱스를 많이 걸수록 좋다'는 틀리다. 그리고 인덱스 열을 가공하면 인덱스를 못 쓴다는 점이 나온다.",
    importance: 4,
    keywords: ["인덱스", "전체 스캔", "형 변환", "가공", "B-Tree"],
    traps: [
      {
        concept: "인덱스의 득과 실",
        difference:
          "조회는 빨라지지만 입력·수정·삭제는 느려지고 저장 공간을 더 쓴다. 그래서 무조건 많이 거는 것이 아니다.",
        wrong:
          "인덱스는 조회뿐 아니라 입력·수정·삭제까지 모두 빨라지므로 열마다 걸수록 좋다.",
      },
    ],
  },
  {
    id: "s-regexp",
    subject: "sql",
    chapter: "s-advanced",
    title: "정규 표현식으로 찾기",
    term: "정규 표현식",
    summary:
      "LIKE 로는 어려운 형태(숫자 세 자리, 특정 글자 반복)를 REGEXP_LIKE 로 찾는다.",
    detail:
      "^ 는 시작, $ 는 끝, . 은 아무 글자 하나, * 는 0번 이상, + 는 1번 이상, ? 는 0 또는 1번을 뜻한다. [ ] 안에 넣으면 그중 하나, [^ ] 는 그것이 아닌 것이다. 오라클은 REGEXP_LIKE · REGEXP_REPLACE · REGEXP_SUBSTR · REGEXP_INSTR 을 제공한다. LIKE 의 % 와 _ 에 견주면 훨씬 정교하지만 인덱스를 타지 못하는 일이 많다.",
    examPoint:
      "메타 문자의 뜻을 묻는다. 특히 * 와 + 의 차이(0번 이상 vs 1번 이상)가 나온다.",
    importance: 2,
    keywords: ["REGEXP_LIKE", "메타 문자", "^", "$", "정규 표현식"],
    traps: [
      {
        concept: "* vs +",
        difference: "* 는 0번 이상(없어도 됨), + 는 1번 이상(적어도 한 번)이다.",
        wrong: "* 는 적어도 한 번 나와야 하고, + 는 없어도 된다.",
      },
    ],
  },
  {
    id: "s-aggregate-kind",
    subject: "sql",
    chapter: "s-basic",
    title: "집계 함수의 종류와 DISTINCT",
    term: "집계 함수와 DISTINCT",
    summary:
      "SUM·AVG·MAX·MIN·COUNT 가 있고, 앞에 DISTINCT 를 붙이면 중복을 뺀 값으로 계산한다.",
    detail:
      "COUNT(DISTINCT 열) 은 중복을 뺀 개수를 센다. MAX·MIN 은 숫자뿐 아니라 문자·날짜에도 쓸 수 있어 '가장 늦은 날짜'를 구할 때 쓴다. STDDEV·VARIANCE 같은 통계 함수도 집계 함수에 속한다. 모든 집계 함수는 NULL 을 빼고 계산하며, 대상 행이 하나도 없으면 COUNT 는 0 을, 나머지는 NULL 을 돌려준다.",
    examPoint:
      "대상이 없을 때 COUNT 는 0, SUM 은 NULL 이라는 점이 나온다. 이 차이를 모르면 계산 결과가 어긋난다.",
    importance: 4,
    keywords: ["COUNT", "DISTINCT", "MAX", "MIN", "STDDEV"],
    traps: [
      {
        concept: "대상 행이 없을 때 COUNT vs SUM",
        difference: "COUNT 는 0 을 돌려주지만 SUM·AVG·MAX·MIN 은 NULL 을 돌려준다.",
        wrong:
          "대상 행이 하나도 없으면 COUNT 는 NULL 을, SUM 은 0 을 돌려준다.",
      },
    ],
    sql: {
      caption: "대상이 없을 때 COUNT 와 SUM 이 갈린다",
      query: `SELECT COUNT(*) AS "COUNT", SUM(sal) AS "SUM", MAX(sal) AS "MAX"
FROM emp
WHERE deptno = 99;`,
    },
  },
  {
    id: "s-transaction-isolation",
    subject: "sql",
    chapter: "s-manage",
    title: "트랜잭션이 겹칠 때 생기는 문제",
    term: "트랜잭션 격리 수준",
    summary:
      "Dirty Read 는 확정 안 된 값을 읽는 것, Non-Repeatable Read 는 같은 것을 두 번 읽었더니 값이 달라진 것, Phantom Read 는 행 수가 달라진 것이다.",
    detail:
      "여러 트랜잭션이 동시에 돌면 서로의 중간 상태가 보일 수 있다. 이를 막는 정도를 고립 수준이라 하며, READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE 순으로 엄격해진다. 엄격할수록 문제는 줄지만 동시에 처리할 수 있는 양이 줄어 느려진다.",
    examPoint:
      "세 가지 문제의 이름과 뜻을 짝지어 묻는다. '값이 달라짐 = Non-Repeatable', '행 수가 달라짐 = Phantom' 으로 묶는다.",
    importance: 3,
    keywords: ["Dirty Read", "Non-Repeatable Read", "Phantom Read", "고립 수준"],
    traps: [
      {
        concept: "Non-Repeatable Read vs Phantom Read",
        difference:
          "Non-Repeatable 은 같은 행을 다시 읽었더니 값이 바뀐 것, Phantom 은 다시 읽었더니 없던 행이 생긴 것이다.",
        wrong:
          "Non-Repeatable Read 는 다시 읽었을 때 없던 행이 생기는 것이고, Phantom Read 는 같은 행의 값이 바뀌는 것이다.",
      },
    ],
  },
  {
    id: "s-with",
    subject: "sql",
    chapter: "s-advanced",
    title: "WITH 절 — 이름을 붙여 두고 쓰기",
    term: "WITH 절",
    summary:
      "복잡한 인라인 뷰에 이름을 붙여 쿼리 앞으로 빼 두면 읽기 쉬워지고 여러 번 쓸 수 있다.",
    detail:
      "WITH 이름 AS (SELECT ...) 로 적어 두면 본 쿼리에서 표처럼 쓸 수 있다. 같은 서브쿼리를 여러 번 쓸 때 특히 좋다. 재귀 WITH 를 쓰면 계층형 질의도 표준 문법으로 풀 수 있다. WITH 는 그 쿼리가 끝나면 사라지므로 뷰와 달리 데이터베이스에 남지 않는다.",
    examPoint:
      "WITH 절이 뷰처럼 데이터베이스에 저장되는지 묻는다. 저장되지 않는다.",
    importance: 3,
    keywords: ["WITH", "CTE", "인라인 뷰", "재귀"],
    traps: [
      {
        concept: "WITH 절 vs 뷰",
        difference:
          "WITH 는 그 쿼리에서만 살아 있고 끝나면 사라진다. 뷰는 데이터베이스에 이름으로 저장되어 다시 쓸 수 있다.",
        wrong:
          "WITH 절은 데이터베이스에 저장되어 다음 쿼리에서도 이름으로 부를 수 있고, 뷰는 쿼리가 끝나면 사라진다.",
      },
    ],
    sql: {
      caption: "WITH 로 부서 평균을 이름 붙여 두고 쓴다",
      query: `WITH avg_by_dept AS (
  SELECT deptno, AVG(sal) AS avg_sal FROM emp GROUP BY deptno
)
SELECT e.ename, e.sal, a.avg_sal
FROM emp e
JOIN avg_by_dept a ON a.deptno = e.deptno
WHERE e.sal > a.avg_sal
ORDER BY e.ename;`,
    },
  },
];
