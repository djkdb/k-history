import type { Figure } from "@/lib/types";

/** 데이터베이스시스템 그림 — 개념 id → 그림들 */
export const FIGURES: Record<string, Figure[]> = {
  "db-dbms": [
    {
      kind: "graph",
      title: "Database System = Database + DBMS software",
      caption: "사용자는 DB를 직접 만지지 않고 **DBMS**를 거친다 — 정의 · 구축 · 조작 · 공유.",
      w: 340,
      h: 200,
      nodes: [
        { id: "u", label: "사용자 · 프로그래머", x: 170, y: 18, w: 150, h: 28, shape: "pill", tone: "sky" },
        { id: "a", label: "응용 프로그램 · 질의", x: 170, y: 66, w: 150, h: 30 },
        { id: "dbms", label: "DBMS 소프트웨어", sub: "질의 처리 · 저장 데이터 접근", x: 170, y: 120, w: 210, h: 44, tone: "indigo" },
        { id: "meta", label: "DB 정의", sub: "(메타데이터)", x: 95, y: 178, w: 100, h: 40, shape: "db", tone: "amber" },
        { id: "db", label: "저장된\n데이터베이스", x: 245, y: 178, w: 100, h: 40, shape: "db", tone: "emerald" },
      ],
      edges: [
        { from: "u", to: "a" },
        { from: "a", to: "dbms" },
        { from: "dbms", to: "meta" },
        { from: "dbms", to: "db" },
      ],
    },
  ],
  "three-schema": [
    {
      kind: "graph",
      title: "3단계 스키마 구조",
      caption: "실제 데이터는 **맨 아래(물리)**에만 있다. DBMS가 위 수준의 요청을 **mapping**으로 아래 수준에 맞게 바꾼다.",
      w: 340,
      h: 236,
      nodes: [
        { id: "v1", label: "External\nview 1", x: 60, y: 26, w: 84, h: 38, tone: "sky" },
        { id: "v2", label: "External\nview 2", x: 170, y: 26, w: 84, h: 38, tone: "sky" },
        { id: "v3", label: "External\nview n", x: 280, y: 26, w: 84, h: 38, tone: "sky" },
        { id: "c", label: "Conceptual schema", sub: "(representational model)", x: 170, y: 104, w: 220, h: 40, tone: "indigo" },
        { id: "i", label: "Internal schema", sub: "(physical model)", x: 170, y: 166, w: 200, h: 40, tone: "violet" },
        { id: "db", label: "Stored DB", x: 170, y: 218, w: 120, h: 30, shape: "db", tone: "emerald" },
      ],
      edges: [
        { from: "v1", to: "c", both: true },
        { from: "v2", to: "c", both: true, label: "외부/개념 mapping" },
        { from: "v3", to: "c", both: true },
        { from: "c", to: "i", both: true, label: "개념/내부 mapping" },
        { from: "i", to: "db", both: true },
      ],
    },
  ],
  "data-independence": [
    {
      kind: "stack",
      title: "어디를 바꿔도 위는 그대로",
      layers: [
        { label: "External schema · 응용 프로그램", note: "그대로", tone: "sky" },
        { label: "Conceptual schema", note: "바뀌어도 위가 그대로 → **논리적** 독립성", tone: "indigo" },
        { label: "Internal schema", note: "바뀌어도 위가 그대로 → **물리적** 독립성", tone: "violet" },
      ],
    },
  ],
  "data-model": [
    {
      kind: "stack",
      title: "데이터 모델의 세 범주",
      top: "사용자에 가까움 (high-level)",
      bottom: "컴퓨터 저장에 가까움 (low-level)",
      layers: [
        { label: "Conceptual", note: "entity · attribute · relationship (ER)", tone: "sky" },
        { label: "Representational", note: "relation · tuple · domain — 상용 DBMS 대부분", tone: "indigo" },
        { label: "Physical", note: "record format · ordering · access path", tone: "violet" },
      ],
    },
  ],
  cardinality: [
    {
      kind: "graph",
      title: "카디널리티 비율 — 참여할 수 있는 최대 수",
      w: 340,
      h: 170,
      nodes: [
        { id: "e1", label: "EMPLOYEE", x: 52, y: 26, w: 88, h: 28 },
        { id: "r1", label: "MANAGES", x: 170, y: 26, w: 92, h: 36, shape: "diamond", tone: "amber" },
        { id: "d1", label: "DEPARTMENT", x: 290, y: 26, w: 96, h: 28 },
        { id: "d2", label: "DEPARTMENT", x: 52, y: 84, w: 96, h: 28 },
        { id: "r2", label: "WORKS_FOR", x: 170, y: 84, w: 100, h: 36, shape: "diamond", tone: "amber" },
        { id: "e2", label: "EMPLOYEE", x: 290, y: 84, w: 88, h: 28 },
        { id: "e3", label: "EMPLOYEE", x: 52, y: 142, w: 88, h: 28 },
        { id: "r3", label: "WORKS_ON", x: 170, y: 142, w: 96, h: 36, shape: "diamond", tone: "amber" },
        { id: "p3", label: "PROJECT", x: 290, y: 142, w: 88, h: 28 },
      ],
      edges: [
        { from: "e1", to: "r1", plain: true, label: "1" },
        { from: "r1", to: "d1", plain: true, label: "1" },
        { from: "d2", to: "r2", plain: true, label: "1" },
        { from: "r2", to: "e2", plain: true, label: "N" },
        { from: "e3", to: "r3", plain: true, label: "M" },
        { from: "r3", to: "p3", plain: true, label: "N" },
      ],
    },
  ],
  participation: [
    {
      kind: "graph",
      title: "참여 제약 — 단일선 partial, 이중선 total",
      caption: "모든 부서에는 관리자가 있어야 한다 → DEPARTMENT 쪽 **total**(최소 1, 이중선). 사원이 다 관리자는 아니다 → EMPLOYEE 쪽 **partial**(최소 0, 단일선).",
      w: 340,
      h: 100,
      nodes: [
        { id: "e", label: "EMPLOYEE", x: 46, y: 34, w: 84, h: 30 },
        { id: "r", label: "MANAGES", x: 170, y: 34, w: 96, h: 40, shape: "diamond", tone: "amber" },
        { id: "d", label: "DEPARTMENT", x: 290, y: 34, w: 96, h: 30 },
        { id: "l1", label: "partial (0, 1)", x: 106, y: 82, w: 90, h: 16, shape: "text" },
        { id: "l2", label: "total ═ (1, 1)", x: 232, y: 82, w: 90, h: 16, shape: "text" },
      ],
      edges: [
        { from: "e", to: "r", plain: true },
        { from: "r", to: "d", plain: true, tone: "indigo" },
      ],
    },
  ],
  "weak-entity": [
    {
      kind: "graph",
      title: "약한 엔티티 — 소유자 없이는 식별할 수 없다",
      caption: "약한 엔티티 = **이중 사각형**, identifying relationship = **이중 마름모**, partial key = **점선 밑줄**. 약한 엔티티 쪽은 항상 total.",
      w: 340,
      h: 150,
      nodes: [
        { id: "l1", label: "1", x: 106, y: 18, w: 16, h: 14, shape: "text" },
        { id: "l2", label: "N · total", x: 234, y: 18, w: 60, h: 14, shape: "text" },
        { id: "e", label: "EMPLOYEE", sub: "(소유자)", x: 48, y: 50, w: 84, h: 40, tone: "indigo" },
        { id: "r", label: "DEPENDENTS\n_OF", x: 170, y: 50, w: 104, h: 48, shape: "diamond", tone: "amber" },
        { id: "w", label: "DEPENDENT", sub: "(약한 엔티티)", x: 290, y: 50, w: 92, h: 40, tone: "rose" },
        { id: "k", label: "Dependent_name = partial key", sub: "→ PK = (Essn, Dependent_name)", x: 190, y: 122, w: 270, h: 36, shape: "dashed" },
      ],
      edges: [
        { from: "e", to: "r", plain: true },
        { from: "r", to: "w", plain: true, tone: "rose" },
        { from: "w", to: "k", plain: true, dashed: true },
      ],
    },
  ],
  keys: [
    {
      kind: "stack",
      title: "키의 포함 관계",
      shape: "pyramid",
      caption: "슈퍼키 ⊇ 키(= 후보키들) ⊇ 기본키. 키 = 유일성 + **최소성**.",
      layers: [
        { label: "Primary key", note: "후보키 중 하나를 지정", tone: "emerald" },
        { label: "Key = Candidate keys", note: "최소 슈퍼키 — 나머지는 UNIQUE", tone: "indigo" },
        { label: "Superkey", note: "유일성만 (모든 속성 집합도 슈퍼키)", tone: "zinc" },
      ],
    },
  ],
  "referential-integrity": [
    {
      kind: "graph",
      title: "외래키는 존재하는 PK를 가리키거나 NULL",
      caption: "FK와 PK는 같은 도메인. FK는 같은 릴레이션을 가리킬 수도 있다 — EMPLOYEE.Super_ssn → EMPLOYEE.Ssn.",
      w: 340,
      h: 150,
      nodes: [
        { id: "e", label: "EMPLOYEE", sub: "Ssn (PK) · … · Super_ssn · Dno", x: 170, y: 30, w: 250, h: 42, tone: "indigo" },
        { id: "d", label: "DEPARTMENT", sub: "Dnumber (PK) · Dname · Mgr_ssn", x: 170, y: 122, w: 250, h: 42, tone: "emerald" },
      ],
      edges: [
        { from: "e", to: "d", bend: 120, label: "Dno → Dnumber" },
        { from: "d", to: "e", bend: 120, label: "Mgr_ssn → Ssn" },
      ],
    },
  ],
  "map-weak": [
    {
      kind: "fields",
      title: "DEPENDENT 릴레이션",
      caption: "소유자의 PK(Essn)를 FK로 넣고, **PK = 소유자 PK + partial key**.",
      rows: [
        {
          fields: [
            { text: "Essn", sub: "PK · FK", span: 3, tone: "emerald" },
            { text: "Dependent_name", sub: "PK (partial key)", span: 6, tone: "emerald" },
            { text: "Sex", span: 2 },
            { text: "Bdate", span: 3 },
            { text: "Relation\u00ADship", span: 5 },
          ],
        },
      ],
    },
  ],
  "map-1toN": [
    {
      kind: "fields",
      title: "1:N은 N쪽에 FK",
      caption: "WORKS_FOR(DEPARTMENT 1 : EMPLOYEE N) → **EMPLOYEE**에 Dno. 관계 속성도 N쪽 릴레이션에.",
      rows: [
        {
          label: "EMPLOYEE (N쪽)",
          fields: [
            { text: "Ssn", sub: "PK", span: 2, tone: "emerald" },
            { text: "Fname", span: 2 },
            { text: "…", span: 1 },
            { text: "Super_ssn", sub: "FK → Ssn", span: 3, tone: "amber" },
            { text: "Dno", sub: "FK → Dnumber", span: 3, tone: "amber" },
          ],
        },
        {
          label: "DEPARTMENT (1쪽)",
          fields: [
            { text: "Dnumber", sub: "PK", span: 3, tone: "emerald" },
            { text: "Dname", span: 3 },
            { text: "Mgr_ssn", sub: "FK", span: 3, tone: "amber" },
          ],
        },
      ],
    },
  ],
  "map-MtoN": [
    {
      kind: "fields",
      title: "M:N은 관계 릴레이션을 따로",
      caption: "참여 엔티티의 PK들을 FK로 넣고 **그 조합이 PK**. 관계 속성(Hours)도 여기에.",
      rows: [
        {
          label: "WORKS_ON",
          fields: [
            { text: "Essn", sub: "PK · FK → EMPLOYEE", span: 4, tone: "emerald" },
            { text: "Pno", sub: "PK · FK → PROJECT", span: 4, tone: "emerald" },
            { text: "Hours", sub: "관계 속성", span: 3, tone: "sky" },
          ],
        },
      ],
    },
  ],
  "joined-tables": [
    {
      kind: "grid",
      title: "어떤 튜플이 남나",
      caption: "외부 조인은 짝이 없는 튜플도 남기고 빈 자리를 **NULL**로 채운다.",
      cols: ["INNER", "LEFT", "RIGHT", "FULL"],
      rows: ["짝 있는 튜플", "왼쪽에만 있는 튜플", "오른쪽에만 있는 튜플"],
      cells: [
        ["✓", "✓", "✓", "✓"],
        ["✗", "✓", "✗", "✓"],
        ["✗", "✗", "✓", "✓"],
      ],
      marks: [
        [0, 0], [0, 1], [0, 2], [0, 3], [1, 1], [1, 3], [2, 2], [2, 3],
      ].map(([r, c]) => ({ r, c, tone: "emerald" as const })),
    },
  ],
  "group-having": [
    {
      kind: "stack",
      title: "WHERE는 묶기 전, HAVING은 묶은 뒤",
      caption: "논리적 처리 순서로 보면 헷갈리지 않는다.",
      layers: [
        { label: "FROM", note: "테이블", tone: "zinc" },
        { label: "WHERE", note: "**튜플**을 거른다", tone: "sky" },
        { label: "GROUP BY", note: "같은 값끼리 그룹", tone: "indigo" },
        { label: "HAVING", note: "**그룹**을 거른다 (집계 조건)", tone: "amber" },
        { label: "SELECT", note: "집계 아닌 속성은 GROUP BY에 있어야", tone: "emerald" },
      ],
    },
  ],
  "view-implementation": [
    {
      kind: "graph",
      title: "뷰 질의를 처리하는 두 방법",
      w: 340,
      h: 130,
      nodes: [
        { id: "q", label: "뷰에 대한 질의", x: 60, y: 65, w: 100, h: 34, shape: "pill", tone: "sky" },
        { id: "m", label: "Query modification", sub: "→ base table 질의로 변환", x: 240, y: 28, w: 190, h: 40, tone: "indigo" },
        { id: "z", label: "View materialization", sub: "→ 실제 테이블로 두고 증분 갱신", x: 240, y: 102, w: 190, h: 40, tone: "amber" },
      ],
      edges: [
        { from: "q", to: "m" },
        { from: "q", to: "z" },
      ],
      caption: "실체화한 뷰의 갱신 시점: **immediate**(즉시) · **lazy**(질의가 올 때) · **periodic**(주기적).",
    },
  ],
  "ra-complete-set": [
    {
      kind: "graph",
      title: "질의 트리 — 리프는 릴레이션, 내부는 연산",
      caption: "아래(리프)부터 실행해 루트까지 올라간다. Stafford 프로젝트의 번호·부서 번호·관리자 정보 질의.",
      w: 340,
      h: 236,
      nodes: [
        { id: "pi", label: "π Pnumber, Dnum,\nLname, Address, Bdate", x: 170, y: 22, w: 190, h: 38, tone: "emerald" },
        { id: "j2", label: "⋈ D.Mgr_ssn = E.Ssn", x: 170, y: 84, w: 156, h: 30, tone: "indigo" },
        { id: "j1", label: "⋈ P.Dnum = D.Dnumber", x: 100, y: 140, w: 160, h: 30, tone: "indigo" },
        { id: "e", label: "EMPLOYEE", x: 282, y: 140, w: 86, h: 30, shape: "db" },
        { id: "s", label: "σ Plocation='Stafford'", x: 70, y: 192, w: 136, h: 28, tone: "amber" },
        { id: "d", label: "DEPARTMENT", x: 228, y: 192, w: 96, h: 30, shape: "db" },
        { id: "p", label: "PROJECT", x: 70, y: 226, w: 74, h: 18, shape: "text" },
      ],
      edges: [
        { from: "j2", to: "pi", plain: true },
        { from: "j1", to: "j2", plain: true },
        { from: "e", to: "j2", plain: true },
        { from: "s", to: "j1", plain: true },
        { from: "d", to: "j1", plain: true },
        { from: "p", to: "s", plain: true },
      ],
    },
  ],
  "ra-division": [
    {
      kind: "grid",
      title: "R(Essn, Pno) ÷ S(Pno = {1, 2}) — '모든' 프로젝트에서 일하는 사원",
      caption: "S의 **모든** 값과 짝이 R에 있어야 결과에 들어간다(예시 데이터). B는 2번이 없어 탈락.",
      cols: ["Pno 1", "Pno 2", "결과"],
      rows: ["Essn A", "Essn B", "Essn C"],
      cells: [
        ["✓", "✓", "A"],
        ["✓", "✗", "—"],
        ["✓", "✓", "C"],
      ],
      marks: [
        { r: 0, c: 2, tone: "emerald" },
        { r: 2, c: 2, tone: "emerald" },
        { r: 1, c: 1, tone: "rose" },
      ],
    },
  ],
  "ra-outer-join": [
    {
      kind: "grid",
      title: "LEFT OUTER JOIN 결과 (예시)",
      caption: "왼쪽(EMPLOYEE)의 모든 튜플이 남고, 짝이 없으면 오른쪽 속성은 **NULL**.",
      cols: ["Lname", "Dno", "Dname"],
      cells: [
        ["Smith", "5", "Research"],
        ["Wong", "4", "Administration"],
        ["Kim", "NULL", "NULL"],
      ],
      marks: [
        { r: 2, c: 1, tone: "amber" },
        { r: 2, c: 2, tone: "amber" },
      ],
    },
  ],
};
