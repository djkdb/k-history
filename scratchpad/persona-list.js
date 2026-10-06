/* 링크를 받게 될 사람들. 기기·브라우저·망·목적이 서로 다르게 골랐다. */
async function 첫걸음(t, 고를것 = [], 끝 = 12) {
  // 처음 쓰는 사람 안내를 끝까지 넘긴다. 고를 것이 보이면 고르고, 아니면 다음으로.
  for (let i = 0; i < 끝; i++) {
    const u = await t.p.evaluate(() => location.pathname);
    if (!u.includes("onboarding")) return;
    for (const g of 고를것) await t.누름(g, { 필수: false });
    // 넘어가는 단추가 잠겨 있으면 무엇인가 골라야 한다 — 사람은 맨 위 것을 고른다
    const 잠김 = await t.p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /^(다음|시작하기)$/.test(b.innerText.trim()) && b.disabled));
    if (잠김) {
      const 고름 = await t.p.evaluate(() => {
        const b = [...document.querySelectorAll("main button, button")].find((b) => b.offsetParent && !b.disabled && b.innerText.trim().length > 3 && !/^(다음|시작하기|건너뛰기)$/.test(b.innerText.trim()));
        if (b) { b.click(); return b.innerText.trim().replace(/\s+/g, " ").slice(0, 30); }
        return null;
      });
      t.말("잠긴 다음 단추 → 맨 위 것을 고름: " + 고름);
      await t.기다림(600);
    }
    const 넘김 = (await t.누름("시작하기", { 필수: false })) || (await t.누름("다음", { 필수: false, 정확: true })) || (await t.누름("건너뛰기", { 필수: false }));
    await t.기록("첫 안내 " + (i + 1));
    if (!넘김) throw new Error("첫 안내에서 넘어갈 버튼이 없다");
  }
}
module.exports = [
  {
    id: "P1", 이름: "지민 (19, 고3)", 한줄: "릴스 보고 인스타 앱 안에서 링크를 누름 · 한국사 심화 · 아이폰",
    기기: "iPhone 13", ua: "insta_ios", 망: "4g", 워커없음: true,
    async 따라가기(t) {
      const ms = await t.간다("/"); t.말(`현관 열림 ${ms}ms`);
      await t.기록("링크를 누름");
      await t.누름("한국사");
      await t.기록("한국사 카드를 누름");
      await 첫걸음(t, ["심화"]);
      await t.기록("안내를 마친 첫 화면");
      if (await t.누름("확인", { 정확: true, 필수: false })) t.말("홈 화면 추가 안내 창을 닫음");
      await t.누름("기출", { 정확: true });
      await t.기록("기출 탭");
      const t0 = Date.now();
      await t.누름("응시", { 필수: false }) || await t.누름("풀기", { 필수: false }) || await t.누름("시작", { 필수: false });
      await t.기록("기출 시험지를 엶");
      const 그림 = await t.p.evaluate(async () => { const im = [...document.images].find((i) => i.src.includes("/exams/")); if (!im) return "없음"; await im.decode().catch(() => {}); return im.naturalWidth + "px · " + new URL(im.src).pathname; });
      t.말(`시험지 그림: ${그림} · ${Date.now() - t0}ms`);
    },
  },
  {
    id: "P2", 이름: "도현 (24, 취준생)", 한줄: "컴활 1급 필기 · 갤럭시 크롬 · 지하철에서 데이터 끊김",
    기기: "Galaxy S9+", ua: "chrome_and", 망: "4g",
    async 따라가기(t) {
      const ms = await t.간다("/"); t.말(`현관 열림 ${ms}ms`);
      await t.기록("현관");
      await t.누름("컴퓨터활용능력");
      await 첫걸음(t, ["1급", "필기"]);
      await t.기록("안내를 마친 첫 화면");
      await t.누름("게임");
      await t.기록("게임 탭");
      await t.기다림(8000);
      await t.끊음(); t.말("— 지하철에서 망이 끊김 —");
      await t.누름("O/X 번개");
      await t.기록("망 없이 OX 게임");
      for (let i = 0; i < 3; i++) { if (!(await t.누름("O", { 정확: true, 필수: false }))) break; await t.기다림(1200); }
      await t.기록("망 없이 세 문제 풂");
      await t.잇기();
    },
  },
  {
    id: "P3", 이름: "수경 (41, 직장인)", 한줄: "카톡으로 받은 링크 · 토익 700 · 글씨 크게",
    기기: "Galaxy S9+", ua: "kakao_and", 망: "4g", 글씨: 1.3,
    async 따라가기(t) {
      const ms = await t.간다("/"); t.말(`현관 열림 ${ms}ms`);
      await t.기록("카톡에서 링크를 누름");
      await t.누름("토익");
      await 첫걸음(t, ["700점"]);
      await t.기록("안내를 마친 첫 화면");
      await t.누름("어휘", { 정확: true });
      await t.기록("어휘 탭");
      await t.누름("시작", { 필수: false });
      await t.기록("어휘 학습 시작");
    },
  },
  {
    id: "P4", 이름: "준호 (27, 비전공)", 한줄: "정처기 필기 붙고 실기 준비 · 아이폰 사파리",
    기기: "iPhone 13", ua: "safari_ios", 망: "4g",
    async 따라가기(t) {
      const ms = await t.간다("/"); t.말(`현관 열림 ${ms}ms`);
      await t.기록("사파리로 엶");
      await t.누름("정보처리기사");
      await 첫걸음(t, ["실기"]);
      await t.기록("안내를 마친 첫 화면");
      await t.누름("실기 적어 보기");
      await t.기록("실기 적어 보기");
      await t.p.locator("main a[href*='/practical/'], main button").filter({ hasText: /약술|적기|시작|풀기/ }).first().click().catch(() => {});
      await t.기다림(1200);
      await t.기록("문항을 엶");
      const 칸 = t.p.locator("textarea, input[type=text]").first();
      if (await 칸.count()) { await 칸.fill("모르겠음"); await t.누름("채점", { 필수: false }) || await t.누름("확인", { 필수: false }); await t.기록("모르는 채로 답을 적고 채점"); }
    },
  },
  {
    id: "P5", 이름: "서연 (22, 데이터 직무 준비)", 한줄: "SQLD · 노트북 크롬 · 어두운 화면",
    기기: "Desktop Chrome", ua: null, 망: "wifi", 어두움: true,
    async 따라가기(t) {
      const ms = await t.간다("/"); t.말(`현관 열림 ${ms}ms`);
      await t.기록("노트북에서 엶");
      await t.누름("SQLD");
      await 첫걸음(t);
      await t.기록("안내를 마친 첫 화면");
      await t.누름("SQL", { 정확: true });
      await t.기록("SQL 탭");
      await t.누름("실행하기", { 필수: false });
      await t.기다림(2500);
      await t.기록("실행하기");
    },
  },
  {
    id: "P6", 이름: "스쳐 가는 사람", 한줄: "릴스를 넘기다 3초만 봄 · 아이폰 SE 작은 화면 · 인스타 앱",
    기기: "iPhone SE", ua: "insta_ios", 망: "느린3g", 워커없음: true,
    async 따라가기(t) {
      const t0 = Date.now();
      t.p.goto(process.env.SITE_FOR_P6 || "https://zunte.pages.dev/").catch(() => {});
      for (const 초 of [1, 2, 3, 5, 8]) {
        await t.기다림(초 * 1000 - (Date.now() - t0));
        const 글 = await t.p.evaluate(() => { const m = document.body; if (!m) return ""; const r = [...m.querySelectorAll("h1,h2,p,li")].filter((e) => { const b = e.getBoundingClientRect(); return b.height && b.top < innerHeight && parseFloat(getComputedStyle(e).opacity) > 0.5; }); return r.map((e) => e.innerText.trim().slice(0, 18)).join(" / "); }).catch(() => "(아직 빈 화면)");
        await t.p.screenshot({ path: `/home/user/k-history/scratchpad/persona/P6-${초}s.png` }).catch(() => {});
        t.말(`${초}초: ${글.slice(0, 160) || "(빈 화면)"}`);
      }
      const fcp = await t.p.evaluate(() => (performance.getEntriesByName("first-contentful-paint")[0] || {}).startTime);
      t.말(`첫 글자가 그려진 때 ${Math.round(fcp)}ms · 받은 양 ${(t.받은양() / 1024).toFixed(0)}KB`);
    },
  },
];
