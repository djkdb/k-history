/*
 * 배포된 그대로를, 처음 온 사람이 되어 처음부터 끝까지 걸어 본다.
 *
 * 부품 하나하나가 도는지는 이미 여러 번 봤다. 여기서 보려는 것은 다른 것이다 —
 * 인스타에서 링크를 누른 사람이 정보처리기사를 준비하는 한 주 동안,
 * 막히는 곳·되돌아갈 수 없는 곳·숫자가 서로 어긋나는 곳이 있는가.
 *
 * 한 사람이 쓰듯 브라우저를 하나로 이어서 쓴다. 중간에 새로고침도 하고
 * 뒤로도 가 본다 — 진짜 사람은 그렇게 쓴다.
 *
 *   node scratchpad/final-sim.js
 */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
function serve(root, port) {
  root = path.resolve(root);
  const s = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    for (const f of [root+u+".html", root+u, root+path.join(u,"index.html"), root+"/404.html"]) {
      try { if (fs.statSync(f).isFile()) {
        r.writeHead(200, {"content-type": MIME[path.extname(f)]||"application/octet-stream"});
        return r.end(fs.readFileSync(f)); } } catch {}
    }
    r.writeHead(404); r.end("x");
  });
  return new Promise((res) => s.listen(port, () => res(s)));
}

const PORT = 6300;
const odd = [];                       // 이상한 점
const note = (m) => { odd.push(m); console.log(`   ⚠️  ${m}`); };
const say  = (m) => console.log(m);

(async () => {
  const srv = await serve("gisa/out", PORT);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  // 한 사람 = 한 컨텍스트. 기록이 이어져야 한다.
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2, locale: "ko-KR",
  });
  const p = await ctx.newPage();

  // 콘솔에 새어 나오는 것은 사람 눈에 안 보이지만 앱이 아프다는 뜻이다
  const errs = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${p.url()} — ${m.text().slice(0,120)}`); });
  p.on("pageerror", (e) => errs.push(`${p.url()} — 예외 ${String(e).slice(0,120)}`));
  p.on("requestfailed", (r) => {
    if (!/favicon/.test(r.url())) errs.push(`요청 실패 ${r.url().replace(`http://127.0.0.1:${PORT}`,"")}`);
  });

  const go = async (u) => { await p.goto(`http://127.0.0.1:${PORT}${u}`, { waitUntil: "networkidle" }); await p.waitForTimeout(600); };
  const txt = async () => (await p.evaluate(() => (document.body.innerText||"").replace(/\s+/g," "))).trim();
  const tap = async (sel, what) => {
    const l = typeof sel === "string" ? p.getByText(sel, { exact: false }).first() : sel;
    if (!(await l.count())) { note(`"${what ?? sel}" 를 찾지 못했다 (${p.url().split(PORT)[1]})`); return false; }
    await l.scrollIntoViewIfNeeded().catch(()=>{});
    await l.click({ timeout: 5000 }).catch((e) => note(`"${what ?? sel}" 를 누르지 못했다: ${String(e).slice(0,60)}`));
    await p.waitForTimeout(700);
    return true;
  };
  const here = () => p.url().replace(`http://127.0.0.1:${PORT}`, "") || "/";

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 하루째 · 인스타에서 링크를 눌렀다");
  await ctx.addInitScript(() => {}); // (신원은 아래에서 따로 본다)
  await go("/");
  say(`   ${here()} 로 왔다`);
  const first = await txt();
  if (!/정보처리기사/.test(first)) note("첫 화면에 시험 이름이 없다");
  say(`   보이는 것: ${first.slice(0, 70)}…`);

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 온보딩 — 세 단계를 넘긴다");
  if (!/두 번 봅니다/.test(first)) note("온보딩 첫 단계가 아니다");
  await tap("다음", "1단계 다음");
  say(`   2단계: ${(await txt()).slice(0, 60)}…`);
  await tap("다음", "2단계 다음");
  say(`   3단계: ${(await txt()).slice(0, 60)}…`);

  // 시험일을 넣어 본다 — 남은 날 계산이 여기서 시작된다
  const dateBox = p.locator('input[type="date"]');
  if (await dateBox.count()) {
    const d = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
    await dateBox.first().fill(d);
    await p.waitForTimeout(300);
    say(`   시험일을 60일 뒤(${d})로 넣었다`);
  } else note("3단계에 시험일 입력칸이 없다");

  await tap("시작하기", "시작하기");
  say(`   → ${here()}`);
  if (here() !== "/") note(`시작하기를 눌렀는데 홈이 아니라 ${here()} 로 갔다`);

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 홈 — 처음 본 화면");
  const home1 = await txt();
  say(`   ${home1.slice(0, 160)}…`);
  const dday = home1.match(/시험까지\s*(\d+)일/);
  if (!dday) note("시험일을 넣었는데 홈에 남은 날이 없다");
  else if (Math.abs(+dday[1] - 60) > 1) note(`남은 날이 ${dday[1]}일 — 60일이어야 한다`);
  else say(`   남은 날 ${dday[1]}일 ✓`);

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 학습 — 개념을 하나 읽는다");
  await go("/learn");
  const learn = await txt();
  say(`   ${learn.slice(0, 110)}…`);
  const firstConcept = p.locator('a[href^="/concept/"]').first();
  if (!(await firstConcept.count())) note("학습 화면에 개념 링크가 없다");
  else {
    const name = (await firstConcept.innerText()).replace(/\s+/g," ").trim().slice(0, 30);
    await firstConcept.click(); await p.waitForTimeout(800);
    say(`   "${name}" 을 열었다 → ${here()}`);
    const c = await txt();
    if (c.length < 200) note(`개념 화면 글이 너무 짧다 (${c.length}자)`);
    if (/\*\*|`{1,3}[^`]/.test(c)) note("개념 화면에 마크다운 기호가 그대로 보인다");
    const done = p.getByRole("button", { name: /봤습니다/ }).first();
    if (await done.count()) {
      await done.click(); await p.waitForTimeout(600);
      say("   «봤습니다 — 복습 목록에 넣기» 를 눌렀다");
      const again = await p.getByRole("button", { name: /본 개념입니다/ }).count();
      if (!again) note("«봤습니다» 를 눌렀는데 단추가 그대로다");
    } else note("개념을 다 봤다고 표시할 단추가 없다");
  }

  // 홈으로 돌아와 숫자가 움직였는지 본다
  await go("/");
  const home2 = await txt();
  if (home2 === home1) note("개념을 하나 읽었는데 홈이 그대로다");
  else say("   홈의 숫자가 움직였다 ✓");

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 문제 — 필기 몇 문항을 푼다");
  await go("/quiz");
  say(`   ${(await txt()).slice(0, 90)}…`);
  const start = p.getByRole("button", { name: /문항 시작/ }).first();
  if (!(await start.count())) note("문제 화면에 시작 단추가 없다");
  else { await start.click(); await p.waitForTimeout(900); }
  let solved = 0;
  for (let i = 0; i < 12; i++) {
    const opts = p.locator("button").filter({ hasText: /^[1-4]\s/ });
    const n = await opts.count();
    if (!n) break;
    await opts.nth(i % n).click().catch(() => {});
    await p.waitForTimeout(450);
    solved++;
    const next = p.getByRole("button", { name: /^(다음|계속|결과)/ }).first();
    if (await next.count()) { await next.click().catch(() => {}); await p.waitForTimeout(450); }
  }
  say(`   ${solved}문항을 풀었다 → ${here()}`);
  const res = await txt();
  if (solved >= 5 && !/점|맞|틀|결과/.test(res)) note("여러 문항을 풀었는데 결과가 보이지 않는다");
  else if (solved >= 5) say(`   결과: ${res.slice(0, 80)}…`);
  const qt = await txt();
  if (/undefined|NaN|\[object/.test(qt)) note("문제 화면에 undefined/NaN 이 새어 나왔다");

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 새로고침 — 기록이 남아 있는가");
  await go("/");
  const before = await txt();
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(900);
  const after = await txt();
  if (before !== after) note("새로고침했더니 홈 내용이 달라졌다");
  else say("   새로고침해도 그대로다 ✓");

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 실기 — 손으로 적어 본다");
  await go("/practical");
  say(`   ${(await txt()).slice(0, 110)}…`);
  const pstart = p.getByRole("button", { name: /문항 시작|시작하기/ }).first();
  if (!(await pstart.count())) note("실기 화면에 시작 단추가 없다");
  else { await pstart.click().catch(() => {}); await p.waitForTimeout(900); }
  const box = p.locator("textarea").first();
  if (await box.count()) {
    await box.fill("정규화");
    await p.waitForTimeout(300);
    const grade = p.getByRole("button", { name: /채점|맞춰|확인/ }).first();
    if (await grade.count()) { await grade.click().catch(() => {}); await p.waitForTimeout(800); say("   답을 적고 채점했다"); }
    else note("답을 적었는데 채점할 단추가 없다");
    const g = await txt();
    if (!/맞았|틀렸|정답|아쉽|답을 보고/.test(g)) note("채점했는데 맞았는지 틀렸는지 안 보인다");
    else say(`   ${(g.match(/(맞았습니다|틀렸습니다|답을 보고[^.]*)/) || [])[0] ?? ""}`);
  } else note(`실기를 시작했는데 적는 칸이 없다 (${here()})`);

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 복습 — 쌓였는가");
  await go("/review");
  const rv = await txt();
  say(`   ${rv.slice(0, 110)}…`);
  if (/아직|없습니다|비어/.test(rv) && solved > 0) note("문제를 풀었는데 복습이 비어 있다");

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 설정 — 실기로 바꿔 본다");
  await go("/settings");
  const beforeTrack = await txt();
  const toPractical = p.getByText("실기", { exact: true }).first();
  if (await toPractical.count()) {
    await toPractical.click().catch(()=>{}); await p.waitForTimeout(600);
    await go("/");
    const h = await txt();
    if (/필기 · 5과목/.test(h)) note("설정에서 실기로 바꿨는데 홈은 아직 필기다");
    else say(`   홈이 실기로 바뀌었다 ✓ (${h.slice(0, 50)}…)`);
    await go("/settings");
    const back = p.getByText("필기", { exact: true }).first();
    if (await back.count()) { await back.click().catch(()=>{}); await p.waitForTimeout(500); }
  } else note("설정에 필기/실기를 바꿀 곳이 없다");
  if (beforeTrack.length < 50) note("설정 화면이 비어 있다");

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 뒤로 가기 — 갇히는 곳이 있는가");
  await go("/learn");
  const c2 = p.locator('a[href^="/concept/"]').first();
  if (await c2.count()) {
    await c2.click(); await p.waitForTimeout(700);
    const deep = here();
    await p.goBack({ waitUntil: "networkidle" }); await p.waitForTimeout(600);
    if (here() !== "/learn") note(`${deep} 에서 뒤로 갔더니 /learn 이 아니라 ${here()} 로 갔다`);
    else say("   개념 → 뒤로 → 학습 ✓");
  }

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 주소를 직접 친 사람 (인스타에서 깊은 링크를 눌렀다)");
  for (const u of ["/quiz", "/practical", "/mock", "/practical/mock", "/review", "/settings", "/없는주소"]) {
    await go(u);
    const t = await txt();
    const ok = t.length > 40;
    if (!ok) note(`${u} 가 빈 화면이다`);
    if (u === "/없는주소" && !/404|아무것도/.test(t)) note("없는 주소인데 404 안내가 없다");
  }
  say("   깊은 링크 7개 확인");

  // ───────────────────────────────────────────────────────────
  say("\n━━━ 콘솔");
  const uniq = [...new Set(errs)];
  if (uniq.length) { for (const e of uniq.slice(0, 12)) note(`콘솔: ${e}`); }
  else say("   조용하다 ✓");

  await b.close(); srv.close();

  say("\n" + "─".repeat(52));
  if (odd.length) { say(`걸린 것 ${odd.length}가지`); odd.forEach((o, i) => say(`  ${i+1}. ${o}`)); }
  else say("✓ 한 주를 걸어 보는 동안 막히는 곳이 없었다");
})();
