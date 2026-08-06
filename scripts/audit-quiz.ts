/**
 * 퀴즈 전수조사.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/audit-quiz.ts
 *
 * 개념 108개 × 난이도 3종 × 씨앗 8개로 만들 수 있는 문제를 전부 만들어 본다.
 * 사람이 일일이 볼 수 없는 양이므로 기계가 걸러야 한다.
 *
 *   ① 발문·지문이 정답을 그대로 말하는가 (오류)
 *   ② 정답 없는 문제 / 정답이 둘인 문제 (오류)
 *   ③ 보기가 중복되는가 (오류)
 *   ④ 정답만 유독 길거나 짧은가 (확인 필요)
 */
import { ALL_EVENTS } from "@/data/events";
import { generateQuizForEvent } from "@/lib/quiz";
import type { Difficulty } from "@/lib/types";

const DIFFS: Difficulty[] = ["basic", "real", "hard"];
const SEEDS = 8;
const errors: string[] = [];
const warns: string[] = [];
let total = 0;

const strip = (t: string) => t.replace(/[\s.·,'"“”‘’()]/g, "");
const known = ALL_EVENTS.map((e) => e.id);

for (const ev of ALL_EVENTS) {
  for (const difficulty of DIFFS) {
    for (let seed = 0; seed < SEEDS; seed++) {
      for (const q of generateQuizForEvent(ev, ALL_EVENTS, {
        seed,
        knownEventIds: known,
        difficulty,
      })) {
        total++;
        const tag = `[${q.type}/${difficulty}] ${ev.id}`;
        const idx = Array.isArray(q.answerIndex) ? q.answerIndex : [q.answerIndex];

        // ② 정답 위치가 보기 안에 있는가
        for (const i of idx)
          if (i < 0 || i >= q.options.length)
            errors.push(`${tag}: 정답 위치 ${i}가 보기(${q.options.length}개) 밖`);

        // ③ 보기 중복
        if (new Set(q.options).size !== q.options.length)
          errors.push(`${tag}: 보기 중복 — ${q.options.join(" | ")}`);

        // ① 정답 노출 (순서 배열은 정답이 '순서'라 제외)
        if (q.type !== "order") {
          const hay = strip(`${q.question} ${q.passage ?? ""}`);
          for (const i of idx) {
            const opt = q.options[i];
            if (opt && strip(opt).length >= 2 && hay.includes(strip(opt)))
              errors.push(`${tag}: 발문이 정답을 노출 — "${q.question}" / 정답 "${opt}"`);
          }
        }

        // ④ 정답만 길이가 튀는가
        if (q.type !== "ox" && q.type !== "order" && idx.length === 1) {
          const ans = q.options[idx[0]] ?? "";
          const others = q.options.filter((_, i) => i !== idx[0]);
          const avg = others.reduce((s, o) => s + o.length, 0) / (others.length || 1);
          if (ans.length && avg && (ans.length > avg * 2.2 || avg > ans.length * 2.2))
            warns.push(`${tag}: 정답 ${ans.length}자 vs 오답 평균 ${Math.round(avg)}자 — ${q.options.join(" | ")}`);
        }
      }
    }
  }
}

const uniq = (a: string[]) => [...new Set(a)];
const e = uniq(errors);
const w = uniq(warns);
console.log(`개념 ${ALL_EVENTS.length} × 난이도 ${DIFFS.length} × 씨앗 ${SEEDS} → 문항 ${total}개 검사\n`);
console.log(`오류 ${e.length}건`);
e.slice(0, 30).forEach((s) => console.log("  ❌ " + s));
console.log(`\n확인 필요 ${w.length}건`);
w.slice(0, 10).forEach((s) => console.log("  ⚠️  " + s));
if (w.length > 10) console.log(`  … 외 ${w.length - 10}건`);
if (e.length) process.exitCode = 1;
