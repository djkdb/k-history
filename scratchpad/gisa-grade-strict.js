// 채점을 느슨하게 풀었으니 "너무 느슨해지지 않았는가" 를 재 본다.
// 다른 문항의 정답을 넣었을 때 맞다고 하면 안 된다.
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { gradeByKind } = jiti("/home/user/k-history/gisa/src/lib/grade.ts");
const { PRACTICAL_QUESTIONS: Q } = jiti("/home/user/k-history/gisa/src/data/practical.ts");

let cross = 0, checked = 0, self = 0;
for (const a of Q) {
  for (const ans of a.answers) {
    if (gradeByKind(a.kind, ans, a.answers).judgement !== "correct") {
      self++; console.log(`  ✗ 자기 답을 못 받는다: ${a.id} "${ans}"`);
    }
  }
  for (const b of Q) {
    if (a.id === b.id) continue;
    // 같은 뜻을 묻는 문항끼리는 넘어와도 이상하지 않다 — 답 목록이 겹치면 건너뛴다
    const shared = a.answers.some((x) => b.answers.includes(x));
    if (shared) continue;
    for (const ans of b.answers) {
      checked++;
      if (gradeByKind(a.kind, ans, a.answers).judgement === "correct") {
        cross++;
        console.log(`  ✗ ${a.id} 에 ${b.id} 의 답 "${ans}" 가 통과한다`);
      }
    }
  }
}
console.log(`\n서로 다른 문항 사이 ${checked}쌍 확인 · 새어 든 것 ${cross}건 · 자기 답을 놓친 것 ${self}건`);
process.exit(cross + self ? 1 : 0);
