/*
 * 게임 세 가지가 정말 게임이자 공부인가.
 *
 * 화면이 뜨는 것으로는 모자란다. 끝까지 한 판을 하고, 틀린 것이 복습
 * 목록으로 들어가고, 기록이 남는지까지 봐야 "놀고 끝나지 않는다" 는 말이
 * 참이 된다. 그 말을 화면에 적어 두었으니 더욱 그렇다.
 *
 *   node scratchpad/comhwal-game.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/comhwal-game.js <주소>"); process.exit(1); }
/* 카드에 적힌 글만 보고는 어느 둘이 짝인지 알 수 없다 — 자료를 직접 읽는다 */
const { CONCEPTS } = require("/home/user/k-history/node_modules/jiti")(
  "/home/user/k-history/comhwal",
  { alias: { "@": "/home/user/k-history/comhwal/src" } },
)("/home/user/k-history/comhwal/src/data/concepts.ts");

let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
const 상태 = (p) =>
  p.evaluate(() => {
    try { return JSON.parse(localStorage.getItem("comhwal:mirror:comhwal-state") || "{}").state ?? null; }
    catch { return null; }
  });

async function 새창(b) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("comhwal:mirror:comhwal-state", JSON.stringify({
        state: { settings: { grade: 1, kind: "written", examDate: null } },
      }));
    } catch {}
  });
  return ctx;
}

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* ── 게임 탭이 있는가 ── */
  {
    const ctx = await 새창(b);
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
    await p.goto(BASE + "/learn", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    console.log("\n━━━ 길잡이에서 닿는가");
    const 탭 = p.locator('nav a[href="/game"]').first();
    if (await 탭.count()) {
      ok("게임 탭이 있다");
      await 탭.click();
      await p.waitForTimeout(900);
      const t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
      if (/O\/X 번개/.test(t) && /단축키 치기/.test(t) && /짝 맞추기/.test(t))
        ok("세 가지가 다 보인다");
      else no("게임 목록이 모자라다: " + t.slice(0, 140));
      if (/복습 목록으로 들어갑니다/.test(t)) ok("놀고 끝나지 않는다고 적어 둔다");
      else no("복습으로 간다는 안내가 없다");
    } else no("게임 탭이 없다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  /* ── ① O/X 번개 ── */
  {
    const ctx = await 새창(b);
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
    await p.goto(BASE + "/game/ox", { waitUntil: "networkidle" });
    await p.waitForTimeout(1000);
    console.log("\n━━━ O/X 번개");
    let t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    if (/맞다/.test(t) && /틀리다/.test(t)) ok("문장과 두 단추가 나온다");
    else no("첫 화면이 이상하다: " + t.slice(0, 140));

    /* 일부러 늘 "맞다" 만 누른다 — 반반이면 절반쯤 틀려야 한다 */
    let 판 = 0;
    for (let i = 0; i < 25; i++) {
      const 맞다 = p.locator("button", { hasText: /^맞다$/ }).first();
      if (await 맞다.count()) { await 맞다.click(); await p.waitForTimeout(250); }
      const 다음 = p.locator("button", { hasText: /^(다음|결과 보기)$/ }).first();
      if (!(await 다음.count())) break;
      const 마지막 = /결과 보기/.test(await 다음.innerText());
      await 다음.click(); 판++;
      await p.waitForTimeout(300);
      if (마지막) break;
    }
    if (판 === 20) ok("스무 문항을 끝까지 풀었다");
    else no(`${판}문항에서 멈췄다`);
    t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    const m = t.match(/(\d+) \/ 20/);
    if (m) {
      const 맞힘 = Number(m[1]);
      ok(`결과 ${맞힘}/20`);
      if (맞힘 > 2 && 맞힘 < 18) ok("늘 '맞다' 만 눌러서는 다 맞을 수 없다 (반반으로 나온다)");
      else no(`늘 '맞다' 만 눌렀는데 ${맞힘}개 — 한쪽으로 쏠려 있다`);
    } else no("결과 화면이 아니다: " + t.slice(0, 160));

    const st = await 상태(p);
    const 복습 = (st?.reviewCards ?? []).length;
    const 기록 = (st?.quizHistory ?? []).length;
    if (기록 === 20) ok("스무 문항이 기록에 남았다");
    else no(`기록이 ${기록}개다`);
    if (복습 > 0) ok(`틀린 것이 복습 목록으로 갔다 (${복습}장)`);
    else no("복습 목록이 비어 있다");
    if ((st?.gameBest?.ox ?? 0) > 0) ok(`최고 연속 기록이 남았다 (${st.gameBest.ox})`);
    else no("최고 기록이 안 남았다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  /* ── ② 단축키 치기 ── */
  {
    const ctx = await 새창(b);
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
    await p.goto(BASE + "/game/keys", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    console.log("\n━━━ 단축키 치기");
    await p.locator("button", { hasText: /^시작$/ }).first().click();
    await p.waitForTimeout(700);
    let t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    if (/키를 누르거나, 아래에서 골라 맞추세요/.test(t)) ok("두 가지 길을 다 안내한다");
    else no("안내가 없다: " + t.slice(0, 140));

    /* 진짜 키보드로 눌러 본다 — 첫 문항을 일부러 틀리게 */
    await p.keyboard.press("F9");
    await p.waitForTimeout(500);
    t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    if (/맞습니다|정답은/.test(t)) ok("자판을 누르면 바로 채점된다");
    else no("키를 눌러도 반응이 없다: " + t.slice(0, 140));
    await p.locator("button", { hasText: /^(다음|결과 보기)$/ }).first().click();
    await p.waitForTimeout(400);

    /* 폰처럼 — 조각을 눌러 맞춰 본다 */
    const 조각 = await p.locator("main button").filter({ hasNotText: /지우기|이거다|모르겠어요|다음|결과/ }).all();
    if (조각.length >= 4) ok(`조각이 ${조각.length}개 나온다`);
    else no(`조각이 ${조각.length}개뿐`);
    if (조각.length) {
      await 조각[0].click();
      await p.waitForTimeout(200);
      const 이거다 = p.locator("button", { hasText: /^이거다$/ }).first();
      if (await 이거다.isEnabled()) ok("조각을 누르면 '이거다' 가 열린다");
      else no("조각을 눌러도 채점할 수 없다");
      await 이거다.click();
      await p.waitForTimeout(400);
      t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
      if (/맞습니다|정답은/.test(t)) ok("조각으로도 채점된다");
      else no("조각 채점이 안 된다: " + t.slice(0, 140));
    }

    /* 끝까지 */
    /* ⚠️ 한 판이 12문항이면 채점·다음으로 스물네 번은 눌러야 한다.
           스무 번만 돌렸더니 결과 화면 앞에서 멈췄다. */
    for (let i = 0; i < 40; i++) {
      const 다음 = p.locator("button", { hasText: /^(다음|결과 보기)$/ }).first();
      if (await 다음.count()) { await 다음.click(); await p.waitForTimeout(250); continue; }
      const 모름 = p.locator("button", { hasText: /^모르겠어요$/ }).first();
      if (await 모름.count()) { await 모름.click(); await p.waitForTimeout(250); continue; }
      break;
    }
    t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    if (/한 판 끝/.test(t)) ok("끝까지 가면 결과가 나온다");
    else no("결과 화면에 못 닿았다: " + t.slice(0, 140));
    const st = await 상태(p);
    if ((st?.reviewCards ?? []).length > 0) ok("틀린 단축키가 복습으로 갔다");
    else no("복습 목록이 비어 있다");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  /* ── ③ 짝 맞추기 ── */
  {
    const ctx = await 새창(b);
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
    await p.goto(BASE + "/game/match", { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    console.log("\n━━━ 짝 맞추기");
    const 카드 = p.locator('main button[aria-label]');
    const n = await 카드.count();
    if (n === 12) ok("카드 열두 장");
    else no(`카드가 ${n}장`);
    const 감춤 = await p.locator('main button[aria-label="뒤집힌 카드"]').count();
    if (감춤 === 12) ok("처음에는 다 뒤집혀 있다");
    else no(`${감춤}장만 뒤집혀 있다`);

    /*
     * 사람처럼 기억하며 푼다.
     *
     * ⚠️ 처음에는 남은 카드 중 앞의 두 장을 계속 눌렀다. 그 둘은 짝이 아니라
     *    다시 덮이고, 다음 번에도 같은 두 장을 누르게 된다 — 160번을 뒤집고도
     *    한 짝도 못 맞췄다. 검사기가 못 푸는 것이지 게임이 안 끝나는 것이
     *    아니었다. 뒤집어 본 글자를 적어 두고 짝이 보이면 그때 맞춘다.
     */
    const 짝찾기 = new Map(); // 카드에 적힌 글 → 개념 id
    for (const c of CONCEPTS) {
      if (!(c.minGrade <= 1 || c.minGrade === 1 || true)) continue;
      짝찾기.set(c.title, c.id);
      짝찾기.set(c.summary.length > 46 ? c.summary.slice(0, 45) + "…" : c.summary, c.id);
    }
    const 본것 = new Map(); // 개념 id → 그 개념 카드들의 자리 번호
    const 아는자리 = new Set(); // 이미 글을 본 자리
    const 자리글 = async (i) =>
      (await p.locator("main button[aria-label]").nth(i).getAttribute("aria-label")) || "";

    let 안전 = 0;
    while (안전 < 200) {
      안전++;
      const 끝 = (await p.locator("main").innerText()).includes("번 만에 맞췄습니다");
      if (끝) break;

      /* 이미 짝을 아는 것이 있으면 그것부터 */
      let 할것 = null;
      for (const [id, 자리들] of 본것) {
        if (자리들.length >= 2) {
          const [a, b] = 자리들;
          const la = await 자리글(a), lb = await 자리글(b);
          if (la !== "뒤집힌 카드" && lb !== "뒤집힌 카드") { 본것.delete(id); continue; }
          할것 = [a, b];
          break;
        }
      }

      if (할것) {
        await p.locator("main button[aria-label]").nth(할것[0]).click();
        await p.waitForTimeout(150);
        await p.locator("main button[aria-label]").nth(할것[1]).click();
        await p.waitForTimeout(400);
        continue;
      }

      /*
       * 모르는 카드 두 장을 뒤집어 글을 알아 둔다.
       *
       * ⚠️ 처음에는 "덮인 카드 앞의 두 장" 을 골랐다. 짝이 아니면 다시 덮이니
       *    다음 번에도 같은 두 장을 고르게 된다 — 400번을 뒤집고도 아는 카드가
       *    두 장뿐이었다. 이미 글을 본 자리는 건너뛴다.
       */
      const 덮인 = [];
      const 전체 = await p.locator("main button[aria-label]").count();
      for (let i = 0; i < 전체; i++)
        if ((await 자리글(i)) === "뒤집힌 카드" && !아는자리.has(i)) 덮인.push(i);
      if (덮인.length < 2) break;

      for (const i of 덮인.slice(0, 2)) {
        await p.locator("main button[aria-label]").nth(i).click();
        await p.waitForTimeout(160);
        const 글 = await 자리글(i);
        아는자리.add(i);
        const id = 짝찾기.get(글);
        if (id) {
          const 목록 = 본것.get(id) ?? [];
          if (!목록.includes(i)) 목록.push(i);
          본것.set(id, 목록);
        }
      }
      await p.waitForTimeout(800);
    }
    const t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    if (/짝을 \d+번 만에 맞췄습니다/.test(t)) ok("끝까지 맞출 수 있다 — " + (t.match(/6짝을 \d+번 만에 맞췄습니다/) || [""])[0]);
    else no("끝나지 않는다: " + t.slice(0, 160));
    if (/복습 목록으로 보냈습니다|아는 것으로 셉니다/.test(t)) ok("무엇을 아는 것으로 셌는지 말해 준다");
    else no("채점 설명이 없다");
    const st = await 상태(p);
    if ((st?.gameBest?.match ?? 0) > 0) ok(`뒤집기 최소 기록이 남았다 (${st.gameBest.match})`);
    else no("기록이 안 남았다");
    if ((st?.reviewCards ?? []).length > 0) ok("잘못 짚은 짝이 복습으로 갔다");
    else console.log("    · 한 번도 안 틀렸는지 복습 목록이 비었다 (이상한 일은 아니다)");
    if (errs.length) no("오류: " + errs.join(" | "));
    await ctx.close();
  }

  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
