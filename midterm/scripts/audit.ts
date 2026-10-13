/**
 * 과목 자료 감사 — 빌드 전에 돌린다.
 *
 *   npm run audit            (모든 과목)
 *
 * 잡는 것:
 *   - id 겹침 (장·개념·문제) — 기록이 엉뚱한 곳에 붙는다
 *   - 없는 장·개념을 가리키는 것
 *   - 객관식 정답 번호가 보기 밖, 보기 중복, 보기가 둘 미만
 *   - 적기 문제에 받아 줄 답이 없음
 *   - 문제가 하나도 없는 개념 (퀴즈로 확인할 수 없다)
 *   - 같은 문제 글이 두 번
 *   - 시험일 형식
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Course } from "../src/lib/types";

const ROOT = join(__dirname, "..");
const LIST = JSON.parse(readFileSync(join(ROOT, "courses.json"), "utf8")) as { id: string; name: string }[];
let bad = 0;
const fail = (c: string, m: string) => {
  bad++;
  console.log(`  ✗ [${c}] ${m}`);
};

for (const meta of LIST) {
  const f = join(ROOT, "src", "courses", meta.id, "index.ts");
  if (!existsSync(f)) {
    console.log(`· ${meta.name} — 자료 없음 (건너뜀)`);
    continue;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const c = require(f).default as Course;
  const id = meta.id;
  if (c.id !== id) fail(id, `과목 id 가 courses.json 과 다르다 (${c.id})`);
  if (c.examDate && !/^\d{4}-\d{2}-\d{2}$/.test(c.examDate)) fail(id, `시험일 형식 ${c.examDate}`);

  const dup = (xs: string[], what: string) => {
    const seen = new Set<string>();
    for (const x of xs) {
      if (seen.has(x)) fail(id, `${what} id 겹침: ${x}`);
      seen.add(x);
    }
  };
  dup(c.chapters.map((x) => x.id), "장");
  dup(c.concepts.map((x) => x.id), "개념");
  dup(c.questions.map((x) => x.id), "문제");

  const chs = new Set(c.chapters.map((x) => x.id));
  const cs = new Set(c.concepts.map((x) => x.id));
  for (const k of c.concepts) {
    if (!chs.has(k.chapter)) fail(id, `개념 ${k.id} 의 장 ${k.chapter} 이 없다`);
    if (!k.summary.trim()) fail(id, `개념 ${k.id} 요약이 비었다`);
  }
  for (const ch of c.chapters) if (!c.concepts.some((k) => k.chapter === ch.id)) fail(id, `장 ${ch.id} 에 개념이 없다`);

  const texts = new Map<string, string>();
  for (const q of c.questions) {
    if (!cs.has(q.concept)) fail(id, `문제 ${q.id} 의 개념 ${q.concept} 이 없다`);
    if (!q.explain.trim()) fail(id, `문제 ${q.id} 해설이 비었다`);
    const key = q.q.replace(/\s+/g, " ").trim();
    if (texts.has(key)) fail(id, `같은 문제 글: ${q.id} = ${texts.get(key)}`);
    texts.set(key, q.id);
    if (q.kind === "mc") {
      if (q.options.length < 2) fail(id, `문제 ${q.id} 보기가 ${q.options.length}개`);
      if (q.answer < 0 || q.answer >= q.options.length || !Number.isInteger(q.answer)) fail(id, `문제 ${q.id} 정답 번호 ${q.answer} 가 보기 밖`);
      if (new Set(q.options).size !== q.options.length) fail(id, `문제 ${q.id} 보기 중복`);
    }
    if (q.kind === "short" && (!q.answers.length || q.answers.some((a) => !a.trim()))) fail(id, `문제 ${q.id} 받아 줄 답이 없다`);
  }
  const noQ = c.concepts.filter((k) => !c.questions.some((q) => q.concept === k.id));
  for (const k of noQ) fail(id, `개념 ${k.id} 에 문제가 없다`);

  // 강의 노트 — 장마다 있어야 한다 (교안 전체를 담는 곳)
  if (c.notes) {
    for (const k of Object.keys(c.notes)) if (!chs.has(k)) fail(id, `강의 노트의 장 ${k} 이 없다`);
    for (const ch of c.chapters) {
      const n = c.notes[ch.id];
      if (!n || !n.length) fail(id, `장 ${ch.id} 에 강의 노트가 없다`);
      else for (const sec of n) if (!sec.lines.length && !sec.table && !sec.code) fail(id, `장 ${ch.id} 노트 '${sec.title}' 이 비었다`);
    }
  }
  const noteSecs = c.notes ? Object.values(c.notes).reduce((a, n) => a + n.length, 0) : 0;
  const noteLines = c.notes ? Object.values(c.notes).reduce((a, n) => a + n.reduce((b, x) => b + x.lines.length + (x.table?.rows.length ?? 0), 0), 0) : 0;
  const easyN = c.concepts.filter((k) => k.easy).length;
  const flowN = c.concepts.filter((k) => k.flow?.length).length;
  const examN = c.concepts.filter((k) => k.exam).length;

  const kinds = { mc: 0, ox: 0, short: 0 };
  for (const q of c.questions) kinds[q.kind]++;
  const ox = c.questions.filter((q) => q.kind === "ox");
  const oxTrue = ox.filter((q) => q.kind === "ox" && q.answer).length;
  const mcPos = [0, 0, 0, 0, 0];
  for (const q of c.questions) if (q.kind === "mc") mcPos[q.answer]++;
  console.log(
    `· ${c.name} — 장 ${c.chapters.length} · 개념 ${c.concepts.length} · 문제 ${c.questions.length} (객관식 ${kinds.mc} · OX ${kinds.ox} [O ${oxTrue}/X ${ox.length - oxTrue}] · 적기 ${kinds.short}) · 객관식 정답 위치 ${mcPos.slice(0, 4).join("/")}`,
  );
  console.log(
    `    강의 노트 ${c.notes ? `${Object.keys(c.notes).length}/${c.chapters.length}장 · ${noteSecs}절 · ${noteLines}줄` : "없음"} · 쉽게 말하면 ${easyN}/${c.concepts.length} · 흐름 ${flowN} · 시험엔 이렇게 ${examN}`,
  );
}

console.log(bad ? `\n✗ ${bad}건` : "\n✓ 이상 없음");
if (bad) process.exit(1);
