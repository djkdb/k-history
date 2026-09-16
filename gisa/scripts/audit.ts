/**
 * 배포 전 전수조사.
 *
 * 네 앱에서 배운 것을 그대로 가져왔다 — 눈으로 보면 멀쩡한 것이 숫자로
 * 보면 어긋난다. 특히 실기는 "정답이 채점기를 통과하는지"를 반드시 봐야
 * 한다. 데이터와 채점기가 따로 놀면 맞는 답이 틀렸다고 나온다.
 */
import { CONCEPTS, CONCEPT_MAP } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS, practicalMax } from "@/data/practical";
import {
  SUBJECTS,
  SUBJECT_MAP,
  WRITTEN,
  judgeWritten,
  judgePractical,
} from "@/data/exam";
import { gradeByKind } from "@/lib/grade";
import { readFileSync } from "node:fs";
import { flatSyllabus } from "@/data/syllabus";
import { makeWrittenMock, makePracticalMock, shuffleOptions } from "@/lib/quiz";
import { TWIN_GROUPS, TWIN_OF, unknownTwinIds } from "@/data/twins";

const problems: string[] = [];
const warn: string[] = [];
const fail = (s: string) => problems.push(s);

// ── 개념 ────────────────────────────────────────────────
{
  const ids = new Set<string>();
  for (const c of CONCEPTS) {
    if (ids.has(c.id)) fail(`개념 id 중복: ${c.id}`);
    ids.add(c.id);
    if (!SUBJECT_MAP[c.subject]) fail(`개념 ${c.id}: 없는 과목 ${c.subject}`);
    if (!c.body.length) fail(`개념 ${c.id}: 본문이 비었다`);
    if (!c.tracks.length)
      fail(`개념 ${c.id}: 필기·실기 어느 쪽에도 안 들어간다`);
    if (!c.examPoint.trim()) fail(`개념 ${c.id}: 출제 포인트가 비었다`);
  }
}

// ── 필기 문항 ────────────────────────────────────────────
{
  const ids = new Set<string>();
  const seenQ = new Map<string, string>();
  for (const q of QUESTIONS) {
    if (ids.has(q.id)) fail(`문항 id 중복: ${q.id}`);
    ids.add(q.id);
    if (!CONCEPT_MAP[q.sourceId]) fail(`문항 ${q.id}: 없는 개념 ${q.sourceId}`);
    else if (CONCEPT_MAP[q.sourceId].subject !== q.subject)
      fail(
        `문항 ${q.id}: 과목이 개념(${CONCEPT_MAP[q.sourceId].subject})과 다르다`,
      );
    if (q.options.length !== 4)
      fail(`문항 ${q.id}: 보기가 ${q.options.length}개 (4개여야 한다)`);
    if (q.answerIndex < 0 || q.answerIndex >= q.options.length)
      fail(`문항 ${q.id}: 정답 인덱스 ${q.answerIndex} 가 범위 밖`);
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
    const set = new Set(q.options.map(norm));
    if (set.size !== q.options.length) fail(`문항 ${q.id}: 보기 중복`);
    if (q.options.some((o) => !o.trim())) fail(`문항 ${q.id}: 빈 보기`);
    if (!q.explanation.trim()) fail(`문항 ${q.id}: 해설이 비었다`);
    if (q.optionNotes) {
      if (q.optionNotes.length !== q.options.length)
        fail(`문항 ${q.id}: 선지 해설 개수가 보기와 다르다`);
      else if (
        q.optionNotes[q.answerIndex] !== null &&
        !/정답/.test(q.optionNotes[q.answerIndex] ?? "")
      )
        warn.push(
          `문항 ${q.id}: 정답 자리의 선지 해설은 null 이거나 "정답"으로 시작해야 읽기 좋다`,
        );
    }
    // 문제문이 정답을 그대로 흘리는가
    const ans = norm(q.options[q.answerIndex]);
    if (ans.length >= 5 && norm(q.question).includes(ans))
      fail(
        `문항 ${q.id}: 문제문이 정답을 그대로 흘린다 "${q.options[q.answerIndex]}"`,
      );
    // 코드 문항은 문제문이 "다음 C 프로그램의 출력 결과는?" 으로 같고
    // 지문(코드)이 다르다. 지문까지 함께 봐야 진짜 중복만 걸린다.
    const key = norm(q.question) + "\u0000" + norm(q.passage ?? "");
    if (seenQ.has(key))
      fail(`문항 ${q.id}: ${seenQ.get(key)} 와 문제문·지문이 모두 같다`);
    seenQ.set(key, q.id);
  }
  // 한 회를 만들 수 있는가
  for (const s of SUBJECTS) {
    const n = QUESTIONS.filter((q) => q.subject === s.id).length;
    if (n < s.count)
      fail(`${s.name}: ${n}문항뿐이라 한 회(${s.count}문항)를 만들 수 없다`);
  }
}

// ── 실기 문항 ────────────────────────────────────────────
{
  const ids = new Set<string>();
  for (const q of PRACTICAL_QUESTIONS) {
    if (ids.has(q.id)) fail(`실기 id 중복: ${q.id}`);
    ids.add(q.id);
    if (!CONCEPT_MAP[q.sourceId]) fail(`실기 ${q.id}: 없는 개념 ${q.sourceId}`);
    if (!q.answers.length) fail(`실기 ${q.id}: 정답이 없다`);
    if (q.points <= 0) fail(`실기 ${q.id}: 배점이 ${q.points}`);
    if (!q.explanation.trim()) fail(`실기 ${q.id}: 해설이 비었다`);
    // ★ 적어 둔 정답이 채점기를 통과하는가
    for (const a of q.answers) {
      const r = gradeByKind(q.kind, a, q.answers);
      if (r.judgement !== "correct")
        fail(
          `실기 ${q.id}: 정답으로 적어 둔 "${a}" 를 채점기가 ${r.judgement} 로 본다`,
        );
    }
    // 빈 답은 empty 여야 한다
    if (gradeByKind(q.kind, "   ", q.answers).judgement !== "empty")
      fail(`실기 ${q.id}: 빈 답을 empty 로 보지 않는다`);
    // 엉뚱한 답이 맞다고 나오면 안 된다
    if (gradeByKind(q.kind, "아무거나12345", q.answers).judgement === "correct")
      fail(`실기 ${q.id}: 엉뚱한 답을 맞다고 한다`);
  }
}

// ── 합격 판정 ────────────────────────────────────────────
{
  const per = (n: number) =>
    SUBJECTS.map((s) => ({ subject: s.id, correct: n, total: s.count }));
  const cases: [ReturnType<typeof per>, boolean, string][] = [
    [per(12), true, "과목마다 12/20 = 60점"],
    [per(11), false, "과목마다 11/20 = 55점, 평균 미달"],
    [per(8), false, "과목마다 8/20 = 40점, 과락은 면했으나 평균 미달"],
    [
      [
        { subject: "design" as const, correct: 7, total: 20 },
        { subject: "develop" as const, correct: 20, total: 20 },
        { subject: "database" as const, correct: 20, total: 20 },
        { subject: "language" as const, correct: 20, total: 20 },
        { subject: "system" as const, correct: 20, total: 20 },
      ],
      false,
      "평균 87점이지만 설계 7/20(35점) 과락",
    ],
    [
      [
        { subject: "design" as const, correct: 8, total: 20 },
        { subject: "develop" as const, correct: 14, total: 20 },
        { subject: "database" as const, correct: 14, total: 20 },
        { subject: "language" as const, correct: 12, total: 20 },
        { subject: "system" as const, correct: 12, total: 20 },
      ],
      true,
      "설계 8/20(40점) 딱 과락선, 평균 60점",
    ],
  ];
  for (const [rows, want, why] of cases) {
    const v = judgeWritten(rows);
    if (v.passed !== want)
      fail(
        `필기 판정 어긋남 — ${why}: ${v.score}점 ${v.passed ? "합격" : "불합격"} (${v.reason})`,
      );
  }
  if (judgePractical(60, 100).passed !== true)
    fail("실기 60점을 불합격으로 본다");
  if (judgePractical(59, 100).passed !== false)
    fail("실기 59점을 합격으로 본다");
  if (judgePractical(0, 0).score !== 0) fail("실기 만점이 0일 때 터진다");
}

// ── 실제로 나가는 시험지를 재 본다 ────────────────────
{
  /*
   * 찍어서 맞을 수 있는 시험지인가.
   *
   * 문항을 손으로 쓰다 보면 정답을 비슷한 자리에 놓게 된다. 실제로 2번이
   * 42%, 4번이 10% 까지 벌어진 적이 있었다 — 2번만 찍어도 42점이다.
   * 지금은 낼 때 선지를 섞어 없앴지만, 그 장치가 빠지면 조용히 돌아온다.
   * 그래서 자료가 아니라 "실제로 나가는 시험지" 를 세어 본다.
   */
  const count = [0, 0, 0, 0];
  let papers = 0;
  for (let t = 0; t < 200; t++) {
    for (const q of makeWrittenMock(30000 + t)) count[q.answerIndex]++;
    papers++;
  }
  const total = count.reduce((a, b) => a + b, 0);
  const worst = Math.max(...count) / total;
  if (worst > 0.32)
    fail(
      `시험지 ${papers}벌에서 정답이 한 자리에 몰린다 — ` +
        count
          .map((n, i) => `${i + 1}번 ${Math.round((n / total) * 100)}%`)
          .join(" · ") +
        " (찍어서 맞을 수 있다)",
    );

  // 섞어도 정답 글과 선지 해설이 함께 따라가야 한다
  for (const q of QUESTIONS) {
    const m = shuffleOptions(q, 12345);
    if (m.options[m.answerIndex] !== q.options[q.answerIndex])
      fail(`선지를 섞으니 ${q.id} 의 정답이 다른 글을 가리킨다`);
    if (
      q.optionNotes &&
      m.optionNotes &&
      m.optionNotes[m.answerIndex] !== q.optionNotes[q.answerIndex]
    )
      fail(`선지를 섞으니 ${q.id} 의 선지 해설이 어긋난다`);
  }

  /*
   * 실기 한 벌이 한 과목으로 쏠리지 않는가.
   *
   * 언어 문항을 늘렸더니 한 벌의 36%가 언어가 된 적이 있다. 문항이 많은
   * 과목이 그만큼 더 뽑히기 때문이다. 지금은 과목별로 나눠 채우지만,
   * 그 장치가 빠지면 조용히 돌아온다.
   */
  {
    const byS: Record<string, number> = {};
    const papers = 200;
    for (let t = 0; t < papers; t++) {
      for (const q of makePracticalMock(40000 + t))
        byS[q.subject] = (byS[q.subject] ?? 0) + q.points;
    }
    const all = Object.values(byS).reduce((a, b) => a + b, 0);
    const worst = Math.max(...Object.values(byS)) / all;
    if (worst > 0.3)
      fail(
        `실기 시험지가 한 과목으로 쏠린다 — ` +
          SUBJECTS.map(
            (x) =>
              `${x.short} ${Math.round(((byS[x.id] ?? 0) / papers) * 10) / 10}점`,
          ).join(" · "),
      );

    // 그래도 늘 딱 100점이어야 한다
    for (let t = 0; t < 100; t++) {
      const p = makePracticalMock(41000 + t);
      const sum = p.reduce((a, q) => a + q.points, 0);
      if (sum !== 100) {
        fail(`실기 한 벌이 ${sum}점이다 (100점이어야 한다)`);
        break;
      }
      if (new Set(p.map((q) => q.id)).size !== p.length) {
        fail("실기 한 벌 안에 같은 문항이 두 번 들어간다");
        break;
      }
    }
  }

  // 같은 씨앗이면 늘 같은 시험지여야 한다 — 시험 도중 새로고침의 목숨줄이다
  for (let t = 0; t < 20; t++) {
    const a = makeWrittenMock(600 + t);
    const b = makeWrittenMock(600 + t);
    for (let i = 0; i < a.length; i++) {
      if (
        a[i].id !== b[i].id ||
        a[i].answerIndex !== b[i].answerIndex ||
        a[i].options.join("|") !== b[i].options.join("|")
      ) {
        fail("같은 씨앗인데 시험지가 다르다 — 새로고침하면 고른 답이 어긋난다");
        break;
      }
    }
  }
}

// ── 개념 목록이 과목 순으로 줄 서 있는가 ───────────────
{
  /*
   * 개념을 새 파일에 써서 배열 끝에 덧붙이면 목록이
   * 설계→개발→DB→언어→구축관리→설계(다시) 로 흐른다. 훑는 사람에게는 과목이
   * 두 번 도는 것처럼 보이고, 홈의 "이어서 볼 개념" 도 이 순서를 따르므로
   * 새로 넣은 개념은 앞의 것을 다 봐야 나온다. 실제로 그렇게 된 적이 있다.
   */
  const order: Record<string, number> = {};
  SUBJECTS.forEach((s, i) => (order[s.id] = i));
  let seen = -1;
  for (const c of CONCEPTS) {
    const o = order[c.subject];
    if (o < seen) {
      fail(
        `개념 목록이 과목 순이 아니다 — ${SUBJECT_MAP[c.subject].short}(${c.id})가 뒤늦게 끼어든다`,
      );
      break;
    }
    seen = Math.max(seen, o);
  }

  // 요약이 비어 있거나 본문이 없는 개념은 화면에서 빈 카드가 된다
  for (const c of CONCEPTS) {
    if (!c.summary.trim()) fail(`개념 ${c.id} 에 요약이 없다`);
    if (!c.body.length) fail(`개념 ${c.id} 에 본문이 없다`);
    if (!c.examPoint.trim()) fail(`개념 ${c.id} 에 "시험에는 이렇게" 가 없다`);
  }
}

// ── 출제기준을 얼마나 덮고 있는가 ─────────────────────
{
  /*
   * 문항을 아무리 많이 써도 시험 범위 밖으로만 쓰면 소용이 없다.
   * 공개된 출제기준의 세부항목마다 우리 문항이 붙어 있는지 센다.
   *
   * ⚠️ 큐넷은 이 환경의 이그레스 프록시에서 막혀 공식 문서를 직접 받아 오지
   *    못했다. src/data/syllabus.ts 의 구조는 널리 공개된 출제기준을 옮겨
   *    적은 것이며, 시험 전에 큐넷에서 직접 확인해야 한다.
   */
  const flat = flatSyllabus();
  const bare: string[] = [];
  const thin: string[] = [];
  for (const f of flat) {
    for (const id of f.covers)
      if (!CONCEPT_MAP[id])
        fail(`출제기준 "${f.item}" 이 없는 개념 ${id} 를 가리킨다`);
    if (f.covers.length === 0) {
      bare.push(`${SUBJECT_MAP[f.subject].short}/${f.item}`);
      continue;
    }
    const n =
      QUESTIONS.filter((q) => f.covers.includes(q.sourceId)).length +
      PRACTICAL_QUESTIONS.filter((q) => f.covers.includes(q.sourceId)).length;
    if (n < 3) thin.push(`${SUBJECT_MAP[f.subject].short}/${f.item}(${n}문항)`);
  }
  if (bare.length)
    fail(
      `출제기준 세부항목 ${bare.length}개를 아예 다루지 않는다 — ${bare.slice(0, 4).join(", ")}${bare.length > 4 ? " 외" : ""}`,
    );
  if (thin.length > 4)
    warn.push(
      `문항이 세 개도 안 되는 세부항목이 ${thin.length}개 — ${thin.slice(0, 3).join(", ")} 외`,
    );

  /*
   * 부정형("옳지 않은 것은?")이 너무 적지 않은가.
   *
   * 부정형은 네 선지를 모두 판단해야 해서 긍정형보다 어렵다. 실제 필기에는
   * 부정형이 잦은데 우리 문항은 한때 11% 였다 — 그만큼 앱이 실제보다 쉬웠다.
   * 아래 값은 하한선이다. 넘기라는 목표가 아니라 밑으로 떨어지면 알리는 선이다.
   */
  const NEG =
    /옳지 않은|아닌 것|해당하지 않|없는 것|틀린 것|보기 어려운|않은 것은/;
  const negRatio =
    QUESTIONS.filter((q) => NEG.test(q.question)).length / QUESTIONS.length;
  if (negRatio < 0.12)
    fail(
      `부정형 문항이 ${Math.round(negRatio * 100)}% 뿐이다 — 실제 필기보다 쉬워진다`,
    );
}

// ── 화면이 사용자에게 말한 숫자가 아직 참인가 ──────────
{
  /*
   * 화면에 "재어 본 중앙값 42%" 라고 적어 두면 그것은 사용자와의 약속이다.
   * 그런데 문항을 더 넣으면 실제 값이 바뀌고, 문구는 그대로 남는다.
   * 실제로 실기 안내가 42% 라고 말하는 동안 진짜 값은 20% 였다.
   *
   * 사람이 기억해서 고치는 일에 맡기지 않는다. 화면에서 숫자를 읽어 와
   * 지금 값과 견준다.
   */
  const read = (file: string) => {
    try {
      return readFileSync(new URL(file, import.meta.url), "utf8");
    } catch {
      return "";
    }
  };

  const median = (xs: number[]) => {
    const a = [...xs].sort((p, q) => p - q);
    return a[Math.floor(a.length / 2)];
  };

  // 필기 — 연속 두 벌의 겹침 문항 수
  const wOverlap: number[] = [];
  for (let t = 0; t < 200; t++) {
    const a = new Set(makeWrittenMock(5000 + t).map((q) => q.id));
    wOverlap.push(
      makeWrittenMock(5000 + t + 1).filter((q) => a.has(q.id)).length,
    );
  }
  const wMid = median(wOverlap);

  // 실기 — 연속 두 벌의 겹침 비율
  const pOverlap: number[] = [];
  for (let t = 0; t < 200; t++) {
    const a = new Set(makePracticalMock(7000 + t).map((q) => q.id));
    const b = makePracticalMock(7000 + t + 1);
    pOverlap.push(
      Math.round((b.filter((q) => a.has(q.id)).length / b.length) * 100),
    );
  }
  const pMid = median(pOverlap);

  const WORD: Record<number, string> = {
    2: "스물",
    3: "서른",
    4: "마흔",
    5: "쉰",
    6: "예순",
    7: "일흔",
    8: "여든",
    9: "아흔",
  };
  const wWord = WORD[Math.round(wMid / 10)];
  const wPage = read("../src/app/mock/page.tsx");
  if (wPage && wWord && !wPage.includes(`${wWord} 문항쯤`))
    fail(
      `필기 모의고사 화면이 말하는 겹침이 지금 값과 다르다 — 지금은 ${wMid}문항(약 ${wWord} 문항)이다`,
    );

  const pPage = read("../src/app/practical/mock/page.tsx");
  if (pPage) {
    const m = pPage.match(/중앙값 (\d+)%/);
    if (!m) fail("실기 모의고사 화면에 겹침 중앙값이 적혀 있지 않다");
    else if (Math.abs(Number(m[1]) - pMid) > 5)
      fail(
        `실기 모의고사 화면은 겹침을 ${m[1]}% 라고 말하는데 지금은 ${pMid}% 다`,
      );
  }

  // 화면이 말하는 문항 수도 실제와 같아야 한다 (설정 화면은 코드에서 세어 쓴다)
  const settings = read("../src/app/settings/page.tsx");
  if (settings && !settings.includes("QUESTIONS.length"))
    fail(
      "설정 화면이 문항 수를 손으로 적고 있다 — 자료에서 세어 쓰게 해야 한다",
    );
}

// ── 같은 것을 두 번 묻고 있지 않은가 ─────────────────────
{
  /*
   * 감사는 오랫동안 "문제문이 똑같은가" 만 봤다. 그런데 물음을 조금 바꿔
   * 적으면 그대로 통과한다 — "결합도가 가장 낮은 것은?" 과 "결합도가 가장
   * 낮은(좋은) 것은?" 은 다른 글이지만 같은 문항이다. 실제로 그렇게 새어
   * 든 짝이 스물세 묶음이었고, 한 회 시험지의 75%에 그중 하나가 들어 있었다.
   *
   * 그래서 두 가지를 본다.
   *   ① 새로 들어온 짝이 있는가 (정답이 같고 묻는 바가 겹치는데 묶이지 않은 것)
   *   ② 실제로 나가는 시험지에 짝이 함께 실리는가
   */
  for (const id of unknownTwinIds())
    fail(`쌍둥이 묶음에 적힌 ${id} 가 문항 목록에 없다`);

  const norm = (t: string) =>
    t.replace(/\([^)]*\)/g, "").replace(/[^가-힣a-zA-Z0-9]/g, "").toLowerCase();
  const STOP = new Set(["다음", "중", "것은", "옳은", "옳지", "않은", "설명으로", "해당하는",
    "무엇이라", "하는가", "가장", "바르게", "나열한", "순서대로", "짝지은", "대한", "위한",
    "이란", "무엇인가", "고르시오", "때"]);
  const terms = (t: string) =>
    new Set(t.replace(/[^가-힣a-zA-Z0-9\s]/g, " ").split(/\s+/)
      .map((w) => w.replace(/(은|는|이|가|을|를|의|에|으로|로|와|과|에서|까지|부터)$/, ""))
      .filter((w) => w.length >= 2 && !STOP.has(w)));
  const overlap = (a: Set<string>, b: Set<string>) => {
    let hit = 0;
    for (const x of a) if (b.has(x)) hit++;
    return hit / (a.size + b.size - hit);
  };

  let found = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    for (let j = i + 1; j < QUESTIONS.length; j++) {
      const A = QUESTIONS[i], B = QUESTIONS[j];
      if (norm(A.options[A.answerIndex]) !== norm(B.options[B.answerIndex])) continue;
      /*
       * ⚠️ 코드 문항은 물음이 "다음 C 프로그램의 출력 결과는?" 으로 모두 같고
       *    지문(코드)이 다르다. 답 숫자까지 우연히 같으면 쌍둥이로 잘못 센다.
       *    지문이 있으면 지문까지 견준다.
       */
      const pa = norm(A.passage ?? ""), pb = norm(B.passage ?? "");
      if ((pa || pb) && pa !== pb) continue;
      /*
       * ⚠️ 계산 문항은 답이 우연히 같을 수 있다. "프레임 3개, 참조열 1,2,3,1,4,2
       *    를 LRU 로" 와 "2,3,2,1,5,2 를 FIFO 로" 는 둘 다 5회지만 서로 다른
       *    알고리즘을 묻는 별개 문항이다. 처음에는 이것을 쌍둥이로 적었다.
       *    묻는 말에 박힌 숫자가 다르면 계산이 다른 것이므로 같은 문항이 아니다.
       */
      const digits = (t: string) => (t.match(/\d+/g) ?? []).join(",");
      if (digits(A.question) !== digits(B.question)) continue;
      const sim = Math.max(
        overlap(terms(A.question), terms(B.question)),
        overlap(terms(A.explanation), terms(B.explanation)),
      );
      if (sim < 0.45) continue;                       // 어지간히 겹칠 때만
      if (TWIN_OF[A.id] !== undefined && TWIN_OF[A.id] === TWIN_OF[B.id]) continue;
      found++;
      fail(`같은 것을 묻는 짝이 묶이지 않았다: ${A.id} ↔ ${B.id} (정답 "${A.options[A.answerIndex]}")`);
    }
  }
  if (!found) console.log(`  쌍둥이 ${TWIN_GROUPS.length}묶음 — 새로 샌 것 없음`);

  // 실제로 나가는 시험지에 짝이 함께 실리는가
  let together = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const ids = new Set(makeWrittenMock(seed).map((q) => q.id));
    for (const g of TWIN_GROUPS)
      if (g.filter((id) => ids.has(id)).length > 1) together++;
  }
  if (together) fail(`시험지 200회에 같은 것을 두 번 묻는 짝이 ${together}번 실렸다`);
  else console.log("  시험지 200회 — 같은 것을 두 번 묻지 않는다");
}

// ── 요약 ────────────────────────────────────────────────
console.log(
  `개념 ${CONCEPTS.length}개 · 필기 ${QUESTIONS.length}문항 · 실기 ${PRACTICAL_QUESTIONS.length}문항(${practicalMax(PRACTICAL_QUESTIONS)}점)`,
);
for (const s of SUBJECTS) {
  const c = CONCEPTS.filter((x) => x.subject === s.id).length;
  const q = QUESTIONS.filter((x) => x.subject === s.id).length;
  const p = PRACTICAL_QUESTIONS.filter((x) => x.subject === s.id).length;
  console.log(
    `  ${s.symbol} ${s.name.padEnd(14)} 개념 ${String(c).padStart(2)} · 필기 ${String(q).padStart(2)} · 실기 ${String(p).padStart(2)}`,
  );
}
console.log(
  `필기 한 회 ${WRITTEN.totalQuestions}문항 ${WRITTEN.minutes}분 · 과목당 ${Math.round(WRITTEN.cutRatio * 100)}점 이상 + 평균 ${WRITTEN.passScore}점`,
);

if (warn.length) {
  console.log(`\n확인 필요 ${warn.length}건`);
  for (const w of warn.slice(0, 8)) console.log("  ⚠️  " + w);
  if (warn.length > 8) console.log(`  … 외 ${warn.length - 8}건`);
}
if (problems.length) {
  console.log(`\n오류 ${problems.length}건`);
  for (const p of problems) console.log("  ✗ " + p);
  process.exit(1);
}
console.log("\n✓ 이상 없음");
