/**
 * src/data/locked-ids.ts 를 다시 만든다.
 *
 * 이 파일이 하는 일은 하나다 — "지금 자료에 있는 id 를 통째로 적어 둔다".
 * 그러면 다음에 누가 id 를 고치거나 없앨 때 audit 가 막아 준다. 사용자의
 * 복습 카드가 id 를 가리키고 있어서, 이름을 한 글자만 바꿔도 그 기록은
 * 영영 짝을 못 찾는다.
 *
 * 새 항목을 더한 **뒤에** 돌리고 함께 커밋한다. 항목을 없앨 때는 이
 * 스크립트를 돌리면 안 된다 — 없앤 id 가 목록에서도 조용히 사라져
 * 막아 줄 것이 없어진다. 그때는 손으로 지우고 왜 지웠는지 남긴다.
 *
 *   node -e "require('jiti')(process.cwd(),{alias:{'@':process.cwd()+'/src'}})('./scripts/lock-ids.ts')"
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { VOCAB } from "../src/data/vocab";
import { GRAMMAR } from "../src/data/grammar";
import { READING } from "../src/data/reading";
import { LISTENING } from "../src/data/listening";
import {
  LOCKED_VOCAB_IDS,
  LOCKED_GRAMMAR_IDS,
  LOCKED_QUESTION_IDS,
} from "../src/data/locked-ids";

const vocabIds = VOCAB.map((v) => v.id);
const grammarIds = GRAMMAR.map((g) => g.id);
const questionIds = [
  ...READING.flatMap((s) => s.questions.map((q) => q.id)),
  ...LISTENING.flatMap((s) => s.questions.map((q) => q.id)),
];

// 없어진 id 가 있으면 손으로 판단할 일이다. 조용히 지우지 않는다.
function gone(kind: string, current: string[], locked: string[]) {
  const now = new Set(current);
  const missing = locked.filter((id) => !now.has(id));
  if (missing.length) {
    console.error(
      `${kind} id 가 사라졌습니다: ${missing.join(", ")}\n` +
        `  이 스크립트는 없앤 id 를 목록에서 지우지 않습니다. 정말 없앨 것이라면\n` +
        `  src/data/locked-ids.ts 에서 손으로 지우고 왜 지웠는지 남기세요.`,
    );
    process.exit(1);
  }
}

gone("어휘", vocabIds, LOCKED_VOCAB_IDS);
gone("문법", grammarIds, LOCKED_GRAMMAR_IDS);
gone("문항", questionIds, LOCKED_QUESTION_IDS);

const list = (name: string, ids: string[]) =>
  `export const ${name}: string[] = [\n${ids.map((id) => `  ${JSON.stringify(id)},`).join("\n")}\n];\n`;

const body = `/**
 * 이미 내보낸 id 목록 — 자동 생성 파일.
 *
 * 사용자의 복습 카드와 정답 기록이 이 id 를 가리킨다. 여기 있는 id 가
 * 자료에서 사라지면 그 사람의 기록이 허공을 가리키게 되므로,
 * scripts/audit.ts 가 배포 전에 막는다.
 *
 * 새 항목을 더한 뒤에 scripts/lock-ids.ts 로 다시 만들어 커밋한다.
 * 항목을 **없앨** 때만 여기서 손으로 지운다 (그 기록은 버려진다).
 */

${list("LOCKED_VOCAB_IDS", vocabIds)}
${list("LOCKED_GRAMMAR_IDS", grammarIds)}
${list("LOCKED_QUESTION_IDS", questionIds)}`;

writeFileSync(join(process.cwd(), "src/data/locked-ids.ts"), body);
console.log(
  `잠갔습니다 — 어휘 ${vocabIds.length} · 문법 ${grammarIds.length} · 문항 ${questionIds.length}`,
);
