/*
 * 넓어진 정보처리기사를, 처음 온 사람이 되어 두 주 동안 살아 본다.
 *
 * 앞선 전수조사(final-sim.js)는 화면이 열한 개이던 때의 것이다. 그 뒤로
 * 개념별 확인 문제·시험 직전 모드·오답 노트·과목별 학습·백업이 붙어
 * 스물한 개가 되었다. 늘어난 길을 실제로 걸어 보고, 걷다가 "이게 없네"
 * 싶은 곳을 적어 둔다 — 고칠 것과 만들 것을 가려내기 위해서다.
 *
 *   node scratchpad/final-sim2.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/final-sim2.js <주소>"); process.exit(1); }

const odd = [];
const wish = [];
const note = (m) => { odd.push(m); console.log(`   ⚠️  ${m}`); };
const want = (m) => { wish.push(m); console.log(`   💡 ${m}`); };
const say = (m) => console.log(m);

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2, locale: "ko-KR",
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${p.url()} — ${m.text().slice(0,110)}`); });
  p.on("pageerror", (e) => errs.push(`${p.url()} — 예외 ${String(e).slice(0,110)}`));
  /*
   * ⚠️ 화면을 옮기면 브라우저가 앞서 걸어 둔 미리 가져오기를 스스로 끊는다.
   *    그것을 실패로 세었더니 멀쩡한 걸음마다 ".txt 요청 실패" 가 쌓였다 —
   *    실제로는 그 파일이 out/ 에 있고 서버는 200 을 준다. 끊긴 것은 세지 않는다.
   */
  p.on("requestfailed", (r) => {
    const why = r.failure()?.errorText ?? "";
    if (/ERR_ABORTED/.test(why)) return;
    if (/favicon/.test(r.url())) return;
    errs.push(`요청 실패 ${r.url().replace(BASE, "")} (${why})`);
  });

  const go = async (u) => { await p.goto(BASE + u, { waitUntil: "networkidle" }); await p.waitForTimeout(600); };
  const txt = async () => (await p.evaluate(() => (document.body.innerText||"").replace(/\s+/g," "))).trim();
  const here = () => p.url().replace(BASE, "") || "/";
  const tapName = async (re, what) => {
    const l = p.getByRole("button", { name: re }).first();
    if (!(await l.count())) { const k = p.getByRole("link", { name: re }).first();
      if (!(await k.count())) { note(`"${what}" 를 찾지 못했다 (${here()})`); return false; }
      await k.click().catch(()=>{}); await p.waitForTimeout(700); return true; }
    await l.scrollIntoViewIfNeeded().catch(()=>{});
    await l.click({ timeout: 6000 }).catch((e) => note(`"${what}" 를 누르지 못했다`));
    await p.waitForTimeout(700); return true;
  };

  // ── 하루째 ────────────────────────────────────────────
  say("\n━━━ 하루째 · 링크를 눌러 들어왔다");
  await go("/");
  say(`   ${here()} — ${(await txt()).slice(0, 60)}…`);
  await tapName(/다음/, "1단계");
  await tapName(/다음/, "2단계");
  const d = new Date(Date.now() + 40 * 864e5).toISOString().slice(0, 10);
  const box = p.locator('input[type="date"]');
  if (await box.count()) { await box.first().fill(d); await p.waitForTimeout(300); }
  await tapName(/시작하기/, "시작하기");
  say(`   → ${here()}`);
  const home = await txt();
  if (!/시험까지 40일/.test(home)) note(`홈에 남은 날이 40일로 보이지 않는다`);
  else say("   시험까지 40일 ✓");

  // ── 과목별로 들어가 본다 (새 화면) ─────────────────────
  say("\n━━━ 과목이 다섯인데, 어디부터 볼까");
  await go("/learn");
  const learn = await txt();
  if (!/과목별로 보기/.test(learn)) note("학습 화면에 과목별로 들어가는 길이 없다");
  const subj = p.getByRole("link", { name: /설계/ }).first();
  if (await subj.count()) { await subj.click(); await p.waitForTimeout(800); }
  say(`   ${here()} — ${(await txt()).slice(0, 80)}…`);
  const sd = await txt();
  if (!/본 개념 0 \/ /.test(sd)) note("과목 화면에 진도가 보이지 않는다");
  if (/아직 다루지 않은 범위/.test(sd)) say("   출제기준에서 빈 곳도 밝혀 준다 ✓");

  // ── 개념 하나를 읽고 바로 풀어 본다 (새 기능) ──────────
  say("\n━━━ 개념을 읽고 그 자리에서 확인");
  const c = p.locator('a[href^="/concept/"]').first();
  if (!(await c.count())) note("과목 화면에서 개념으로 들어갈 수 없다");
  else { await c.click(); await p.waitForTimeout(800); }
  say(`   ${here()}`);
  const opened = await tapName(/가리고 풀어 보기/, "가리고 풀어 보기");
  if (opened) {
    const opts = p.getByRole("button").filter({ hasText: /^[1-4][^0-9]/ });
    if (await opts.count()) {
      await opts.first().click(); await p.waitForTimeout(700);
      const after = await txt();
      if (/맞았|정답|틀렸|아쉽/.test(after) || after.includes("해설")) say("   바로 채점되고 해설이 붙는다 ✓");
      else note("골랐는데 채점 표시가 없다");
      if (/본 개념입니다/.test(after)) say("   맞히니 «봤습니다» 가 저절로 켜졌다 ✓");
    } else note("확인 문제를 펼쳤는데 선지가 없다");
  }

  // ── 문제를 푼다 ───────────────────────────────────────
  say("\n━━━ 문제 풀기");
  await go("/quiz");
  await tapName(/문항 시작/, "시작");
  let n = 0;
  for (let i = 0; i < 12; i++) {
    const o = p.getByRole("button").filter({ hasText: /^[1-4][^0-9]/ });
    if (!(await o.count())) break;
    await o.nth(i % 4).click().catch(()=>{}); n++; await p.waitForTimeout(350);
    const nav = p.getByRole("button", { name: /^(다음|채점 보기)$/ }).first();
    if (!(await nav.count())) break;
    const last = /채점/.test(await nav.innerText());
    await nav.click().catch(()=>{}); await p.waitForTimeout(400);
    if (last) break;
  }
  say(`   ${n}문항을 풀었다 → ${(await txt()).slice(0, 70)}…`);

  // ── 모의고사 한 회와 오답 노트 (새 기능) ───────────────
  say("\n━━━ 모의고사 한 회, 그리고 오답 노트");
  await go("/mock");
  await tapName(/시작하기/, "모의고사 시작");
  for (let i = 0; i < 10; i++) {
    const o = p.getByRole("button").filter({ hasText: /^[1-4][^0-9]/ });
    if (!(await o.count())) break;
    await o.nth(i % 4).click().catch(()=>{}); await p.waitForTimeout(120);
    const nx = p.getByRole("button", { name: /^다음$/ }).first();
    if (!(await nx.count())) break;
    await nx.click().catch(()=>{}); await p.waitForTimeout(120);
  }
  await tapName(/답안지/, "답안지");
  const sheet = p.locator('[class*="fixed"][class*="inset-0"]').last();
  await sheet.getByRole("button", { name: /제출하기/ }).first().click().catch(()=>{});
  await p.waitForTimeout(600);
  await p.locator('[class*="fixed"][class*="inset-0"]').last()
    .getByRole("button", { name: /^제출$/ }).first().click().catch(()=>{});
  await p.waitForTimeout(1800);
  const res = await txt();
  say(`   결과: ${res.slice(0, 80)}…`);
  await tapName(/오답 노트 보기/, "오답 노트");
  const nt = await txt();
  if (/틀린 문항/.test(nt)) say(`   ${(nt.match(/틀린 문항 \d+개/)||[""])[0]} 를 다시 펴 준다 ✓`);
  else note("오답 노트에 틀린 문항이 없다");

  // ── 시험이 코앞이라면 (새 화면) ────────────────────────
  say("\n━━━ 시험 직전 모드");
  await go("/cram");
  const cram = await txt();
  say(`   ${cram.slice(0, 90)}…`);
  if (!/바꿔 내는 짝/.test(cram)) note("벼락치기에 '바꿔 내는 짝' 이 없다");
  say(`   길이 ${cram.length}자 — 30분·1시간·3시간이 한 화면에 펼쳐져 있다`);

  // ── 기록을 옮길 수 있는가 (새 화면) ────────────────────
  say("\n━━━ 폰을 바꾼다면");
  await go("/settings");
  const set = await txt();
  if (!/파일로 저장하거나 옮기기/.test(set)) note("설정에서 백업으로 가는 길이 없다");
  await go("/backup");
  const bk = await txt();
  if (/본 개념/.test(bk)) say("   지금 기록을 세어 보여 준다 ✓");
  else note("백업 화면이 기록을 보여 주지 않는다");

  // ── 복습 ──────────────────────────────────────────────
  say("\n━━━ 복습");
  await go("/review");
  say(`   ${(await txt()).slice(0, 80)}…`);

  // ── 걷다가 없어서 아쉬웠던 것 ──────────────────────────
  say("\n━━━ 걸어 보며 아쉬웠던 것");
  await go("/learn");
  const l2 = await txt();
  if (!(await p.locator('input[type="text"], input[type="search"]').count()))
    want("학습 화면에 검색창이 없다 — 개념이 63개인데 이름으로 바로 못 찾는다");
  await go("/");
  const h2 = await txt();
  if (!/틀린|오답/.test(h2)) want("홈에서 '내가 자주 틀리는 곳' 으로 바로 가는 길이 없다");
  if (!/오늘/.test(h2)) want("오늘 무엇을 할지 정해 주는 칸이 없다 — 남은 날만 알려 준다");
  await go("/quiz");
  const q2 = await txt();
  if (!/틀린 것만/.test(q2)) want("문제 화면에 '틀린 것만 다시' 가 없다");
  await go("/practical");
  const pr = await txt();
  if (!/오답|틀린/.test(pr)) want("실기에는 '틀린 것만 다시 적기' 가 없다");
  await go("/mock");
  const mk = await txt();
  if (!/그래프|추이|점수 변화/.test(mk)) want("모의고사 점수가 오르고 있는지 한눈에 볼 그림이 없다");

  say("\n━━━ 콘솔");
  const u = [...new Set(errs)];
  if (u.length) u.slice(0, 10).forEach((e) => note(`콘솔: ${e}`));
  else say("   조용하다 ✓");

  await b.close();
  say("\n" + "─".repeat(52));
  say(odd.length ? `걸린 것 ${odd.length}가지` : "✓ 두 주를 걸어 보는 동안 막히는 곳이 없었다");
  odd.forEach((o, i) => say(`  ${i + 1}. ${o}`));
  if (wish.length) {
    say(`\n있으면 좋겠다 싶었던 것 ${wish.length}가지`);
    wish.forEach((w, i) => say(`  ${i + 1}. ${w}`));
  }
})();
