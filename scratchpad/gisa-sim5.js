// 실기를 실제로 적어 본다 — 사람이 실제로 쓸 법한 표기들로.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { gradeByKind } = jiti("/home/user/k-history/gisa/src/lib/grade.ts");
const { PRACTICAL_QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/practical.ts");
const M = Object.fromEntries(PRACTICAL_QUESTIONS.map((q) => [q.id, q]));

// 사람이 실제로 적을 법한 답들. want=true 면 받아 줘야 한다.
const CASES = [
  ["pq-encapsulation", "캡슐화 ", true, "뒤에 공백"],
  ["pq-encapsulation", "encapsulation", true, "소문자 영문"],
  ["pq-encapsulation", "캡슐화(정보은닉)", false, "괄호에 다른 말"],
  ["pq-encapsulation", "정보은닉", false, "비슷하지만 다른 용어"],
  ["pq-acid", "원자성, 일관성, 고립성, 지속성", true, "가운뎃점 대신 쉼표"],
  ["pq-acid", "원자성 일관성 격리성 지속성", true, "공백으로만 나열"],
  ["pq-acid", "지속성·고립성·일관성·원자성", true, "순서를 바꿔 적음"],
  ["pq-acid", "원자성·일관성·고립성", false, "하나 빠뜨림"],
  ["pq-driver", "드라이버 ", true, "뒤에 공백"],
  ["pq-driver", "driver", true, "소문자"],
  ["pq-driver", "스텁", false, "짝을 바꿔 적음"],
  ["pq-cardinality", "카디널리티, 차수", true, "번호 없이"],
  ["pq-cardinality", "① 카디널리티 ② 차수", true, "번호 붙여"],
  ["pq-sql-delete", "delete from 학생 where 학과 = '컴퓨터'", true, "소문자·세미콜론 없음"],
  ["pq-sql-delete", "DELETE FROM 학생\nWHERE 학과='컴퓨터';", true, "줄바꿈"],
  ["pq-sql-delete", 'DELETE FROM 학생 WHERE 학과 = "컴퓨터";', true, "큰따옴표"],
  ["pq-sql-orderby", "select 이름,급여 from 사원 where 부서='개발' order by 급여 desc;", true, "공백 없이"],
  ["pq-code-c-while", "10 ", true, "뒤에 공백"],
  ["pq-code-c-while", "10\n", true, "뒤에 줄바꿈"],
  ["pq-code-python-dict", "3 3", true, "그대로"],
  ["pq-code-python-dict", "33", false, "공백 빠뜨림"],
  ["pq-lru", "5회", true, "단위를 붙여"],
  ["pq-deadlock-cond", "상호배제, 점유와 대기, 비선점, 환형대기", true, "띄어쓰기 흔들림"],
  ["pq-deadlock-cond", "상호 배제·점유와 대기·비선점·원형 대기", true, "환형을 원형으로"],
  ["pq-bcnf", "보이스코드 정규형", true, "붙여 씀"],
  ["pq-bcnf", "BCNF ", true, "대문자 약어"],
  ["pq-sdn", "sdn", true, "소문자 약어"],
  ["pq-rbac", "역할기반 접근통제", true, "한글 풀이"],
  ["pq-2nf", "제2정규형", true, "그대로"],
  ["pq-2nf", "2NF", true, "약어"],
];

let miss = 0;
console.log("### 채점기가 사람 손을 얼마나 받아 주는가\n");
for (const [id, input, want, why] of CASES) {
  const q = M[id];
  if (!q) { console.log(`  ? ${id} 없음`); continue; }
  const r = gradeByKind(q.kind, input, q.answers);
  const got = r.judgement === "correct";
  if (got === want) console.log(`  ✓ [${why}] "${input.replace(/\n/g, "⏎")}" → ${r.judgement}`);
  else { miss++; console.log(`  ✗ [${why}] "${input.replace(/\n/g, "⏎")}" → ${r.judgement} (바라던 것: ${want ? "correct" : "wrong"})`);
    console.log(`      모범답안: ${q.answers.join(" / ")}`); }
}
console.log(miss ? `\n어긋난 것 ${miss}건` : "\n전부 뜻대로");
