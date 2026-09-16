/*
 * 사실상 같은 문항을 찾는다.
 *
 * 지금 감사는 "문제문이 똑같은가" 만 본다. 그런데 물음을 조금 바꿔 적으면
 * 그 검사를 그대로 통과한다 — "결합도가 가장 낮은 것은?" 과 "결합도가 가장
 * 낮은(좋은) 것은?" 은 다른 글이지만 같은 문항이다. 한 회에 둘 다 나오면
 * 푸는 사람은 같은 것을 두 번 푸는 셈이다.
 *
 * 같은 것을 묻는지는 "정답이 같은가 + 묻는 말이 겹치는가" 로 본다.
 */
import { QUESTIONS } from "@/data/questions";

const norm = (s: string) =>
  s.replace(/\([^)]*\)/g, "")      // 괄호 속 영문 표기는 떼고
   .replace(/[^가-힣a-zA-Z0-9]/g, "")
   .toLowerCase();

/** 묻는 말에서 뜻을 지는 낱말만 남긴다 */
const STOP = new Set(["다음", "중", "것은", "옳은", "옳지", "않은", "설명으로", "해당하는", "무엇이라", "하는가",
  "가장", "바르게", "나열한", "순서대로", "짝지은", "대한", "위한", "이란", "무엇인가", "고르시오", "때"]);
const terms = (s: string) =>
  new Set(s.replace(/[^가-힣a-zA-Z0-9\s]/g, " ").split(/\s+/)
    .map((w) => w.replace(/(은|는|이|가|을|를|의|에|으로|로|와|과|에서|까지|부터)$/, ""))
    .filter((w) => w.length >= 2 && !STOP.has(w)));

const jaccard = (a: Set<string>, b: Set<string>) => {
  let hit = 0;
  for (const x of a) if (b.has(x)) hit++;
  return hit / (a.size + b.size - hit);
};

type Pair = { a: string; b: string; ans: string; sim: number; qa: string; qb: string };
const pairs: Pair[] = [];
for (let i = 0; i < QUESTIONS.length; i++) {
  for (let j = i + 1; j < QUESTIONS.length; j++) {
    const A = QUESTIONS[i], B = QUESTIONS[j];
    const ansA = norm(A.options[A.answerIndex]);
    const ansB = norm(B.options[B.answerIndex]);
    if (!ansA || ansA !== ansB) continue;           // 정답이 같아야 한다
    /*
     * ⚠️ 코드 문항은 물음이 "다음 C 프로그램의 출력 결과는?" 으로 모두 같고
     *    지문(코드)이 다르다. 정답 숫자까지 우연히 같으면 쌍둥이로 잘못 센다.
     *    실제로 답이 9 인 세 문항을 서로 쌍둥이라고 적었다 — 코드는 전혀 달랐다.
     *    지문이 있으면 지문까지 견준다.
     */
    const pa = norm(A.passage ?? ""), pb = norm(B.passage ?? "");
    if (pa || pb) { if (pa !== pb) continue; }
    // 묻는 말이 겹치거나, 해설이 같은 이야기를 하면 같은 문항으로 본다
    const simQ = jaccard(terms(A.question), terms(B.question));
    const simE = jaccard(terms(A.explanation), terms(B.explanation));
    const sim = Math.max(simQ, simE);
    if (sim < 0.2) continue;
    pairs.push({ a: A.id, b: B.id, ans: A.options[A.answerIndex], sim, qa: A.question, qb: B.question });
  }
}
pairs.sort((x, y) => y.sim - x.sim);
for (const p of pairs) {
  console.log(`\n${(p.sim * 100).toFixed(0)}%  ${p.a}  ↔  ${p.b}   [정답: ${p.ans}]`);
  console.log(`   · ${p.qa}`);
  console.log(`   · ${p.qb}`);
}
console.log(`\n쌍둥이 후보 ${pairs.length}쌍`);
