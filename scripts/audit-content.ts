/**
 * 콘텐츠 신뢰성 감사.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/audit-content.ts
 *
 * 이 앱의 존재 이유는 내용의 정확성이므로, 기계로 잡을 수 있는 모순은
 * 전부 여기서 걸러 낸다. 데이터를 추가·수정한 뒤 반드시 통과시킬 것.
 *
 * 사실 자체(연도·인물·사건 내용)의 정확성은 자동 검증이 불가능하므로
 * 사람이 확인해야 한다. 이 스크립트는 "서로 어긋나는 곳"을 찾는다.
 */
import { ALL_EVENTS, getEvent } from "@/data/events";
import { ERA_MAP } from "@/data/eras";
import { EVENT_INFOGRAPHICS } from "@/data/infographics";
import { MOCK_EXAMS, isPageMode, totalPoints } from "@/data/mock-exams";
import { gradeFromFrequency } from "@/lib/utils";
import type { EraId } from "@/lib/types";

const errors: string[] = [];
const warns: string[] = [];

/** 시대별 허용 연도 범위 (통설 기준, 여유 있게) */
const ERA_RANGE: Record<EraId, [number, number]> = {
  prehistoric: [-700000, -100], // 구석기~철기 도입까지
  gojoseon: [-2333, -108],
  "proto-three": [-300, 400],
  "three-kingdoms": [-57, 676],
  gaya: [42, 562],
  "north-south": [676, 936],
  goryeo: [918, 1392],
  joseon: [1392, 1863],
  "open-port": [1863, 1897],
  "daehan-empire": [1897, 1910],
  colonial: [1910, 1945],
  modern: [1945, 2030],
};

/** yearDisplay에서 대표 연도를 뽑는다 (정렬용 year와 대조하기 위해) */
function parseYear(d: string): number | null {
  const bc = d.startsWith("기원전");
  const n = [...d.matchAll(/\d+/g)].map(Number);
  if (/약\s*\d+만/.test(d)) return -(n[0] ?? 70) * 10000;
  if (/기원\s*전후/.test(d)) return 0;
  if (/세기/.test(d)) {
    const c = n[0];
    if (!c) return null;
    return bc ? -(c * 100 - 50) : (c - 1) * 100 + 50;
  }
  if (/년대/.test(d)) return n[0] ?? null;
  if (n.length >= 1) return (bc ? -1 : 1) * n[0];
  return null;
}

// ─── 개념 데이터 ────────────────────────────────────────────────────
const ids = new Set<string>();
const titles = new Set<string>();

for (const e of ALL_EVENTS) {
  const tag = `[${e.id}] ${e.title}`;

  if (ids.has(e.id)) errors.push(`${tag}: id 중복`);
  ids.add(e.id);
  if (titles.has(e.title)) errors.push(`${tag}: 제목 중복`);
  titles.add(e.title);

  const py = parseYear(e.yearDisplay);
  if (py === null) warns.push(`${tag}: yearDisplay 파싱 불가 "${e.yearDisplay}"`);
  else if (Math.abs(py - e.year) > 120)
    errors.push(`${tag}: year ${e.year} ↔ "${e.yearDisplay}" 불일치`);

  const [lo, hi] = ERA_RANGE[e.era];
  if (e.year < lo || e.year > hi)
    errors.push(`${tag}: ${ERA_MAP[e.era].name} 범위(${lo}~${hi}) 밖 year=${e.year}`);

  if (e.importance !== gradeFromFrequency(e.examFrequency))
    errors.push(`${tag}: 등급 ${e.importance} ≠ 빈도 ${e.examFrequency} 기준`);
  if (e.mustMemorize !== (e.importance >= 5))
    errors.push(`${tag}: mustMemorize ↔ importance 불일치`);

  for (const t of e.traps) {
    if (!t.concept.trim() || !t.difference.trim()) errors.push(`${tag}: 빈 trap`);
    if (t.concept === e.title) errors.push(`${tag}: trap이 자기 자신을 가리킴`);
  }
  if (e.importance >= 4 && e.traps.length < 2)
    warns.push(`${tag}: ★${e.importance}인데 traps ${e.traps.length}개`);

  if (e.summary10s.length < 15) errors.push(`${tag}: summary10s 너무 짧음`);
  if (!e.memory.mnemonic.trim()) errors.push(`${tag}: 암기법 없음`);
  if (e.keywords.length < 3) warns.push(`${tag}: 키워드 ${e.keywords.length}개`);
}

// prev/next 체인이 시대 내 연대순과 정확히 일치하는가
const byEra = new Map<EraId, typeof ALL_EVENTS>();
for (const e of ALL_EVENTS) byEra.set(e.era, [...(byEra.get(e.era) ?? []), e]);
for (const es of byEra.values()) {
  const s = [...es].sort((a, b) => a.year - b.year);
  s.forEach((e, i) => {
    const wantPrev = i > 0 ? s[i - 1].id : undefined;
    const wantNext = i < s.length - 1 ? s[i + 1].id : undefined;
    if (e.prevEventId !== wantPrev)
      errors.push(`[${e.id}] prev "${e.prevEventId}" ≠ "${wantPrev}"`);
    if (e.nextEventId !== wantNext)
      errors.push(`[${e.id}] next "${e.nextEventId}" ≠ "${wantNext}"`);
  });
}

// ALL_EVENTS 전역 순서 (흐름 모드가 이 순서를 그대로 쓴다)
for (let i = 1; i < ALL_EVENTS.length; i++) {
  const a = ALL_EVENTS[i - 1];
  const b = ALL_EVENTS[i];
  if (a.era === b.era && b.year < a.year)
    errors.push(`전역 순서 역전: ${a.title}(${a.year}) → ${b.title}(${b.year})`);
}

// ─── 인포그래픽 ─────────────────────────────────────────────────────
for (const [id, specs] of Object.entries(EVENT_INFOGRAPHICS)) {
  if (!getEvent(id)) errors.push(`인포그래픽 "${id}": 없는 개념`);
  for (const s of specs) {
    if (!s.title.trim()) errors.push(`인포그래픽 "${id}": 제목 없음`);
    if (s.kind === "timeline" && s.items.length < 2)
      errors.push(`인포그래픽 "${id}": 연표 항목 부족`);
    if (s.kind === "flow" && s.steps.length < 2)
      errors.push(`인포그래픽 "${id}": 흐름 단계 부족`);
    if (s.kind === "pyramid" && s.levels.length < 2)
      errors.push(`인포그래픽 "${id}": 피라미드 단계 부족`);
  }
}

// ─── 기출 모의고사 ──────────────────────────────────────────────────
for (const ex of MOCK_EXAMS) {
  const tag = `${ex.round}회`;
  if (ex.questions.length !== 50) errors.push(`${tag}: 문항 ${ex.questions.length}개`);
  if (totalPoints(ex) !== 100) errors.push(`${tag}: 만점 ${totalPoints(ex)}`);
  const nums = ex.questions.map((q) => q.number).sort((a, b) => a - b);
  if (nums.join() !== Array.from({ length: 50 }, (_, i) => i + 1).join())
    errors.push(`${tag}: 번호가 1~50이 아님`);
  for (const q of ex.questions) {
    // 0은 "정답 없음 — 전원 정답 처리"(63회 42번 같은 이의심사 정정)라 정상이다
    if (q.answer < 0 || q.answer > 5)
      errors.push(`${tag} ${q.number}번: 정답 ${q.answer}`);
    for (const id of q.eventIds ?? [])
      if (!getEvent(id)) errors.push(`${tag} ${q.number}번: 없는 개념 "${id}"`);
    if (!isPageMode(ex) && !q.image) errors.push(`${tag} ${q.number}번: 이미지 없음`);
    if (isPageMode(ex) && q.page === undefined)
      errors.push(`${tag} ${q.number}번: page 없음`);
  }
  if (!ex.attribution?.includes("국사편찬위원회"))
    errors.push(`${tag}: 출처 표기 없음`);

  // 해설은 공식 정답표와 어긋나면 안 된다.
  // 해설이 ①~⑤를 직접 언급했다면 그것이 정답 번호와 같아야 한다.
  const CIRCLED = ["①", "②", "③", "④", "⑤"];
  const explained = ex.questions.filter((q) => q.explanation);
  for (const q of explained) {
    const t = q.explanation!;
    if (t.length < 25) errors.push(`${tag} ${q.number}번: 해설 너무 짧음`);
    const cited = CIRCLED.filter((c) => t.includes(c));
    if (cited.length === 1 && cited[0] !== CIRCLED[q.answer - 1])
      errors.push(
        `${tag} ${q.number}번: 해설이 ${cited[0]}을 가리키는데 정답은 ${CIRCLED[q.answer - 1]}`,
      );
  }
  // 자료가 그림뿐이거나 추출되지 않은 문항은 지어내지 않고 비워 둔다.
  // 다만 몇 문항이 비었는지는 늘 드러나 있어야 한다.
  if (explained.length && explained.length !== ex.questions.length)
    warns.push(
      `${tag}: 해설 ${explained.length}/${ex.questions.length}문항 (나머지는 자료가 그림뿐이라 비워 둠)`,
    );
}

// ─── 결과 ───────────────────────────────────────────────────────────
console.log(
  `개념 ${ALL_EVENTS.length} · 인포그래픽 ${Object.keys(EVENT_INFOGRAPHICS).length} · 기출 ${MOCK_EXAMS.length}회차 검사\n`,
);
console.log(`오류 ${errors.length}건`);
errors.forEach((s) => console.log("  ❌ " + s));
console.log(`\n확인 필요 ${warns.length}건`);
warns.forEach((s) => console.log("  ⚠️  " + s));
if (errors.length) process.exitCode = 1;
