/**
 * 실습용 표.
 *
 * SQLD 문제에 늘 나오는 사원·부서 표를 그대로 본떴다. 사람들이 이미
 * 눈에 익은 자료여야 쿼리에만 집중할 수 있기 때문이다.
 *
 * 자료를 일부러 이렇게 만들었다.
 *   - bonus 에 NULL 을 섞었다 → COUNT·AVG 의 분모가 어긋나는 것을 직접 본다
 *   - 부서 40 에는 사원이 없다 → INNER 와 OUTER 조인의 차이가 드러난다
 *   - 급여에 동점을 두었다 → RANK 와 DENSE_RANK 가 갈린다
 *   - mgr 가 NULL 인 사람이 하나 → 계층형 질의의 뿌리가 된다
 */
export const SCHEMA_SQL = `
CREATE TABLE dept (
  deptno INTEGER PRIMARY KEY,
  dname  TEXT NOT NULL,
  loc    TEXT
);

CREATE TABLE emp (
  empno    INTEGER PRIMARY KEY,
  ename    TEXT NOT NULL,
  job      TEXT,
  mgr      INTEGER,
  hiredate TEXT,
  sal      INTEGER,
  bonus    INTEGER,
  deptno   INTEGER REFERENCES dept(deptno)
);

INSERT INTO dept (deptno, dname, loc) VALUES
  (10, '경영지원', '서울'),
  (20, '연구개발', '판교'),
  (30, '영업',     '부산'),
  (40, '감사',     '서울');

INSERT INTO emp (empno, ename, job, mgr, hiredate, sal, bonus, deptno) VALUES
  (1001, '김대표', '대표',   NULL, '2015-03-02', 900, NULL, 10),
  (1002, '이부장', '부장',   1001, '2016-07-11', 600,  100, 20),
  (1003, '박부장', '부장',   1001, '2016-09-01', 600,  120, 30),
  (1004, '최과장', '과장',   1002, '2018-01-15', 450, NULL, 20),
  (1005, '정과장', '과장',   1003, '2018-04-02', 450,   80, 30),
  (1006, '한대리', '대리',   1004, '2020-02-17', 350,   50, 20),
  (1007, '오대리', '대리',   1005, '2020-06-08', 320, NULL, 30),
  (1008, '윤사원', '사원',   1006, '2022-03-02', 280,   30, 20),
  (1009, '장사원', '사원',   1007, '2022-08-16', 280, NULL, 30),
  (1010, '서사원', '사원',   1002, '2023-01-09', 260,   20, 10);
`;

export interface TableInfo {
  name: string;
  note: string;
  columns: { name: string; type: string; note: string }[];
}

/** 화면에 보여 줄 표 설명 — 쿼리를 쓰려면 무엇이 있는지부터 알아야 한다 */
export const TABLES: TableInfo[] = [
  {
    name: "emp",
    note: "사원 10명. bonus 에 NULL 이 섞여 있고, 급여에 동점이 있다.",
    columns: [
      { name: "empno", type: "정수", note: "사번 (기본키)" },
      { name: "ename", type: "문자", note: "이름" },
      { name: "job", type: "문자", note: "직책" },
      { name: "mgr", type: "정수", note: "상사의 사번 (대표는 NULL)" },
      { name: "hiredate", type: "문자", note: "입사일 (YYYY-MM-DD)" },
      { name: "sal", type: "정수", note: "급여" },
      { name: "bonus", type: "정수", note: "보너스 (없으면 NULL)" },
      { name: "deptno", type: "정수", note: "부서 번호" },
    ],
  },
  {
    name: "dept",
    note: "부서 4개. 40번 감사팀에는 사원이 없다.",
    columns: [
      { name: "deptno", type: "정수", note: "부서 번호 (기본키)" },
      { name: "dname", type: "문자", note: "부서 이름" },
      { name: "loc", type: "문자", note: "위치" },
    ],
  },
];
