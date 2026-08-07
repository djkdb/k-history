/**
 * 사용자 데이터 안전 감사.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/audit-storage.ts
 *
 * 이 앱은 서버에 사본을 두지 않는다. 학습 기록은 사용자 기기의
 * IndexedDB에만 있고, 한 번 잃으면 되찾을 방법이 없다.
 *
 * 기록이 사라지는 경우는 코드 실수 몇 가지로 좁혀진다. 여기서 그것들을
 * 기계로 막는다. 배포 전에 반드시 통과시킬 것.
 *
 *   ① 저장소 이름이 바뀌면 → 기존 기록을 못 찾는다
 *   ② persist에 version을 두면 → zustand가 저장본을 버릴 수 있다
 *   ③ 개념 id가 사라지면 → 그 개념의 진도·복습 카드가 갈 곳을 잃는다
 *   ④ 깊은 병합이 빠지면 → 중첩 필드를 더할 때 기존 값이 undefined가 된다
 */
import { readFileSync } from "node:fs";
import { ALL_EVENTS } from "@/data/events";
import { LOCKED_EVENT_IDS, LOCKED_EXAM_IDS } from "@/data/locked-ids";
import { MOCK_EXAMS } from "@/data/mock-exams";

const errors: string[] = [];

const read = (p: string) => readFileSync(p, "utf8");
const storeSrc = read("src/lib/store.ts");
const idbSrc = read("src/lib/idb-storage.ts");

// ─── ① 저장소 이름 잠금 ─────────────────────────────────────────────
// 이 값들은 이미 배포되어 사람들 기기에 쓰여 있다. 바꾸면 기록을 잃는다.
const LOCKS: [string, string, string][] = [
  ["persist name", storeSrc, 'name: "khlm-state"'],
  ["IndexedDB DB 이름", idbSrc, 'const DB_NAME = "khlm"'],
  ["IndexedDB store 이름", idbSrc, 'const STORE_NAME = "state"'],
  ["localStorage 거울 접두사", idbSrc, 'const MIRROR_PREFIX = "khlm:mirror:"'],
];
for (const [label, src, needle] of LOCKS) {
  if (!src.includes(needle))
    errors.push(
      `${label}이 바뀌었습니다. 기존 사용자의 기록을 찾지 못합니다 → \`${needle}\` 로 되돌리세요`,
    );
}

// ─── ② persist version 금지 ────────────────────────────────────────
// version을 올리는 순간 migrate가 없으면 zustand가 저장본을 버린다.
if (/^\s*version:\s*\d/m.test(storeSrc) && !/migrate:/.test(storeSrc))
  errors.push(
    "persist에 version이 생겼는데 migrate가 없습니다. 저장본이 버려집니다",
  );

// ─── ③ 깊은 병합 유지 ──────────────────────────────────────────────
if (!/merge:\s*\(persisted,\s*current\)/.test(storeSrc))
  errors.push(
    "persist의 merge가 사라졌습니다. 중첩 필드를 추가하면 기존 값이 undefined가 됩니다",
  );

// ─── ④ 저장 필드 잠금 ──────────────────────────────────────────────
// partialize에서 필드를 빼면 그 기록은 다음 저장 때 사라진다.
for (const field of [
  "exam",
  "stats",
  "studiedEventIds",
  "reviewCards",
  "quizHistory",
  "wrongEventIds",
  "mockAttempts",
]) {
  if (!new RegExp(`${field}:\\s*s\\.${field}`).test(storeSrc))
    errors.push(`partialize에서 "${field}"가 빠졌습니다. 그 기록이 사라집니다`);
}

// ─── ⑤ 개념 id 잠금 ────────────────────────────────────────────────
const now = new Set(ALL_EVENTS.map((e) => e.id));
const gone = LOCKED_EVENT_IDS.filter((id) => !now.has(id));
for (const id of gone)
  errors.push(
    `개념 "${id}"가 사라졌습니다. 이 개념을 학습한 사람의 진도·복습 카드가 갈 곳을 잃습니다`,
  );

const added = [...now].filter((id) => !LOCKED_EVENT_IDS.includes(id));

// ─── ⑥ 기출 회차 id 잠금 ───────────────────────────────────────────
// 회차 추가는 안전하다. 사라지거나 이름이 바뀌는 것만 막는다.
const examsNow = new Set(MOCK_EXAMS.map((e) => e.id));
for (const id of LOCKED_EXAM_IDS.filter((id) => !examsNow.has(id)))
  errors.push(
    `기출 회차 "${id}"가 사라졌습니다. 이 회차를 푼 사람의 점수 기록이 갈 곳을 잃습니다`,
  );
const examsAdded = [...examsNow].filter((id) => !LOCKED_EXAM_IDS.includes(id));

// ─── 결과 ───────────────────────────────────────────────────────────
console.log(
  `잠긴 개념 ${LOCKED_EVENT_IDS.length}개 · 현재 개념 ${now.size}개 검사\n` +
    `잠긴 회차 ${LOCKED_EXAM_IDS.length}개 · 현재 회차 ${examsNow.size}개 검사\n`,
);
if (examsAdded.length)
  console.log(
    `ℹ️  새 기출 회차 ${examsAdded.length}개 (추가는 안전합니다. src/data/locked-ids.ts 에 넣어 두세요)\n   ${examsAdded.join(", ")}\n`,
  );
if (added.length)
  console.log(
    `ℹ️  새 개념 ${added.length}개 (추가는 안전합니다. src/data/locked-ids.ts 에 넣어 두세요)\n   ${added.join(", ")}\n`,
  );
console.log(`오류 ${errors.length}건`);
errors.forEach((s) => console.log("  ❌ " + s));
if (errors.length) process.exitCode = 1;
else console.log("\n✅ 이미 배포된 사용자의 기록이 유지됩니다.");
