// 이미 쓰던 사람의 기록이 새 판에서도 그대로 남는가.
//
// 저장 키를 바꾸거나 persist 에 version 을 두면 조용히 통째로 사라진다.
// 실제 저장본을 넣고 앱을 띄워 항목 하나하나를 세어 본다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

const SAVED = {
  state: {
    settings: { track: "practical", examDate: "2026-05-09" },
    stats: { xp: 1234, streak: 9, lastStudyDate: "2026-09-12", studyMinutes: 640 },
    studiedIds: ["d-oop", "d-solid", "b-normalization", "v-sort", "l-python"],
    clearedQuestionIds: ["qd-sdlc-spiral", "qd-xp-values"],
    clearedPracticalIds: ["pq-encapsulation"],
    reviewCards: [
      { sourceId: "d-oop", addedAt: 1, lastReviewedAt: 2, stage: 3, nextDueAt: 9e14, lapses: 1 },
      { sourceId: "b-normalization", addedAt: 1, lastReviewedAt: 2, stage: 1, nextDueAt: 1, lapses: 4 },
    ],
    quizHistory: [{ quizId: "q-1", takenAt: 1, total: 10, correct: 7, track: "written" }],
    wrongIds: ["b-normalization", "v-sort"],
    mockAttempts: [{
      track: "written", startedAt: 100, finishedAt: 200, score: 71, passed: true,
      bySubject: [{ subject: "design", correct: 15, total: 20 }],
    }],
  },
};

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript((s) => {
    try {
      if (localStorage.getItem("__seeded__")) return;
      localStorage.setItem("__seeded__", "1");
      localStorage.setItem("gisa:mirror:gisa-state", s);
    } catch {}
  }, JSON.stringify(SAVED));
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  const url = p.url();
  if (url.includes("/onboarding")) no("이미 쓰던 사람인데 첫 안내로 튕겼다 — 설정을 잃었다");
  else ok("첫 안내로 튕기지 않았다");

  const got = await p.evaluate(() => {
    const raw = localStorage.getItem("gisa:mirror:gisa-state");
    const s = JSON.parse(raw).state;
    return {
      track: s.settings?.track, date: s.settings?.examDate,
      xp: s.stats?.xp, streak: s.stats?.streak, minutes: s.stats?.studyMinutes,
      studied: s.studiedIds?.length, clearedQ: s.clearedQuestionIds?.length,
      clearedP: s.clearedPracticalIds?.length, cards: s.reviewCards?.length,
      quiz: s.quizHistory?.length, wrong: s.wrongIds?.length, mocks: s.mockAttempts?.length,
      stage: s.reviewCards?.find((c) => c.sourceId === "d-oop")?.stage,
      lapses: s.reviewCards?.find((c) => c.sourceId === "b-normalization")?.lapses,
    };
  });
  const want = { track: "practical", date: "2026-05-09", xp: 1234, streak: 9, minutes: 640,
    studied: 5, clearedQ: 2, clearedP: 1, cards: 2, quiz: 1, wrong: 2, mocks: 1, stage: 3, lapses: 4 };
  for (const [k, v] of Object.entries(want)) {
    got[k] === v ? ok(`${k} = ${v} 그대로`) : no(`${k} 가 ${JSON.stringify(got[k])} 로 바뀌었다 (${v} 여야 한다)`);
  }

  // 화면에도 그대로 보이는가 — 저장만 남고 화면이 못 읽으면 잃은 것과 같다
  const body = await p.locator("body").innerText();
  /9일/.test(body) ? ok("홈에 연속 9일이 보인다") : no("홈에 연속 학습 일수가 안 보인다");
  /실기/.test(body) ? ok("실기 준비 중으로 보인다") : no("고른 시험 갈래가 화면에 반영되지 않았다");

  /*
   * 저장본의 version 이 0 인가.
   *
   * zustand persist 는 설정에 version 을 두지 않아도 블롭에 version: 0 을
   * 늘 적는다. 그러니 "version 이 있다" 는 것 자체는 아무 문제가 아니다
   * (처음 쓴 검사가 여기서 거짓 경고를 냈다). 위험한 것은 이 값이 0 이
   * 아닐 때다 — 누군가 설정에 version 을 올린 것이고, 그 순간 zustand 는
   * migrate 가 없으면 예전 저장본을 버린다.
   */
  const ver = await p.evaluate(() =>
    JSON.parse(localStorage.getItem("gisa:mirror:gisa-state")).version);
  ver === 0 ? ok("저장본 version 이 0 이다 (아무도 올리지 않았다)")
            : no(`저장본 version 이 ${ver} 다 — 올린 순간 예전 기록을 버릴 수 있다`);

  errs.length ? errs.slice(0, 3).forEach((e) => no("예외: " + e)) : ok("예외 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 이상 없음");
  process.exit(bad ? 1 : 0);
})();
