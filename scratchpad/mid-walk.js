/*
 * 중간고사 앱을 처음 쓰는 사람처럼 끝까지 써 본다.
 *   node scratchpad/mid-walk.js [과목=db]
 * 현관 → 과목 → 첫 안내 → 홈 → 개념 → 퀴즈 → 복습 → 모의고사 → 설정 → 망 끊고 다시
 */
const { chromium, devices } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.env.ROOT || "/home/user/k-history/midterm/out-all";
const C = process.argv[2] || "db";
const SHOT = "/home/user/k-history/scratchpad/mid";
const M = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
function 찾기(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return [200, f]; } catch {} } let d = path.dirname(p); while (d.startsWith(ROOT)) { const f = path.join(d, "404.html"); if (fs.existsSync(f)) return [404, f]; if (d === ROOT) break; d = path.dirname(d); } return [404, null]; }
const srv = http.createServer((q, r) => { const [code, f] = 찾기(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(code, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
const B = "http://127.0.0.1:7500";
let 문제 = 0; const ok = (m) => console.log("  ✓ " + m), no = (m) => { 문제++; console.log("  ✗ " + m); };
(async () => {
  await new Promise((r) => srv.listen(7500, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  const 오류 = []; p.on("pageerror", (e) => 오류.push(String(e).slice(0, 140)));
  p.on("response", (r) => { if (r.status() >= 400) 오류.push(r.status() + " " + new URL(r.url()).pathname); });
  let n = 0; const 찍기 = async (이름) => { await p.waitForTimeout(500); await p.screenshot({ path: `${SHOT}/${C}-${String(++n).padStart(2, "0")}-${이름}.png`, fullPage: false }); };
  const 글 = () => p.evaluate(() => document.body.innerText);
  const 누름 = async (t, opt = {}) => { const l = p.locator("button, a").filter({ hasText: t }); const k = await l.count(); for (let i = 0; i < k; i++) { const e = l.nth(i); if (await e.isVisible() && await e.isEnabled()) { await e.click(); await p.waitForTimeout(opt.wait ?? 700); return true; } } if (!opt.soft) no(`"${t}" 을(를) 누를 수 없다`); return false; };

  console.log("━━━ 현관");
  await p.goto(B + "/"); await p.waitForTimeout(800); await 찍기("현관");
  const 카드 = await p.locator(`a[href="/${C}/"]`).count();
  카드 ? ok("현관에 과목 카드가 있다") : no("현관에 과목 카드가 없다");
  await p.locator(`a[href="/${C}/"]`).first().click(); await p.waitForURL(/onboarding/, { timeout: 15000 }).catch(() => no("첫 안내로 가지 않았다")); await p.waitForTimeout(800);
  await 찍기("첫안내");
  const 날짜 = await p.locator("#exam-date").inputValue();
  console.log("    미리 채운 시험일:", 날짜 || "(없음)");
  if (!날짜) await p.locator("#exam-date").fill("2026-10-23");
  await 누름("시작하기", { wait: 1500 });
  (await 글()).includes("오늘 할 일") ? ok("홈이 열렸다") : no("홈이 아니다: " + p.url());
  const 과목명 = require("../midterm/courses.json").find((x) => x.id === C).name;
  const 남과목 = require("../midterm/courses.json").filter((x) => x.id !== C).map((x) => x.name);
  const 첫홈글 = await 글();
  첫홈글.includes(과목명) && !남과목.some((n) => 첫홈글.includes(n)) ? ok(`홈이 ${과목명} 자료다`) : no(`홈에 ${과목명} 자료가 아니다`);
  await 찍기("홈");

  console.log("━━━ 개념");
  await 누름("이어서 볼 개념", { wait: 1200 }); await 찍기("개념");
  const 제목 = await p.locator("h1").first().innerText(); console.log("    개념:", 제목);
  await 누름("다 봤어요", { wait: 600 });
  (await 글()).includes("공부함") ? ok("공부함으로 표시") : no("공부함 표시가 안 된다");
  await 누름(/문제 \d+개 풀기/, { wait: 1500 });
  console.log("━━━ 퀴즈 (이 개념)");
  for (let i = 0; i < 6; i++) {
    const t = await 글(); if (t.includes("퀴즈 끝")) break;
    // 첫 보기를 고르거나 O 를 누르거나, 적기면 아무 말이나
    const 칸 = p.locator("main input:not([type=date])");
    if (await 칸.count() && await 칸.first().isVisible() && await 칸.first().isEnabled()) { await 칸.first().fill("모름"); await 누름("채점하기", { wait: 500 }); }
    else if (await p.locator("button[aria-label='맞다']").count()) { await p.locator("button[aria-label='맞다']").click(); await p.waitForTimeout(500); }
    else { await p.locator("main button").filter({ hasText: /^1/ }).first().click().catch(() => {}); await p.waitForTimeout(500); }
    if (i === 0) await 찍기("퀴즈채점");
    if (!(await 누름(/다음|결과 보기/, { soft: true, wait: 600 }))) { no("다음으로 넘어갈 수 없다"); break; }
  }
  (await 글()).includes("퀴즈 끝") ? ok("퀴즈 끝 화면") : no("퀴즈가 끝나지 않았다");
  await 찍기("퀴즈끝");

  console.log("━━━ 복습");
  await p.goto(B + `/${C}/review`); await p.waitForTimeout(1500); await 찍기("복습");
  if (await 누름("펼쳐 보기", { soft: true })) { await 찍기("복습펼침"); await 누름("떠올렸어요"); ok("복습 카드 한 장 채점"); } else console.log("    (복습할 카드 없음)");

  console.log("━━━ 모의고사");
  await p.goto(B + `/${C}/mock`); await p.waitForTimeout(1200); await 찍기("모의목록");
  await p.locator("button").filter({ hasText: "20문제" }).first().click().catch(() => {});
  await 누름("새로 시작", { wait: 1500 });
  p.on("dialog", (d) => d.accept());
  let 푼 = 0;
  for (let i = 0; i < 60; i++) {
    const t = await 글(); if (t.includes("채점 결과")) break;
    const 칸 = p.locator("main input:not([type=date])");
    if (await 칸.count() && await 칸.first().isVisible()) await 칸.first().fill("x");
    else if (await p.locator("button[aria-label='틀리다']").count()) await p.locator("button[aria-label='틀리다']").click();
    else await p.locator("main button").filter({ hasText: /^2/ }).first().click().catch(() => {});
    푼++;
    if (i === 1) await 찍기("모의중");
    if (!(await 누름(/^다음|^제출/, { soft: true, wait: 400 }))) break;
  }
  await p.waitForTimeout(800);
  (await 글()).includes("채점 결과") ? ok(`모의고사 ${푼}문제 풀고 채점`) : no("모의고사 채점 화면이 안 나왔다");
  await 찍기("모의결과");

  console.log("━━━ 기록이 남는가 (새로고침)");
  await p.goto(B + `/${C}/`); await p.waitForTimeout(1500);
  const 홈글 = await 글();
  /개념\s*1\s*\/|1\s*\/\s*\d+/.test(홈글) ? ok("홈 진도에 공부한 개념이 남았다") : no("진도가 보이지 않는다");
  홈글.includes("모의고사") ? ok("모의고사 점수가 홈에 보인다") : no("모의고사 기록이 홈에 없다");
  await 찍기("홈뒤");

  console.log("━━━ 설정 · 다크/라이트");
  await p.goto(B + `/${C}/settings`); await p.waitForTimeout(1200); await 찍기("설정");

  console.log("━━━ 망을 끊어도");
  await p.waitForTimeout(4000);
  await ctx.setOffline(true);
  for (const u of [`/${C}/`, `/${C}/learn`, `/${C}/quiz`, "/"]) {
    try { await p.goto(B + u, { timeout: 10000 }); await p.waitForTimeout(1200); const t = await 글(); t.length > 80 ? ok(`망 없이 ${u} 열림`) : no(`망 없이 ${u} 가 비었다`); } catch (e) { no(`망 없이 ${u} 실패`); }
  }
  await ctx.setOffline(false);
  const 진짜오류 = 오류.filter((e) => !e.includes("net::"));
  if (진짜오류.length) no("오류: " + [...new Set(진짜오류)].slice(0, 6).join(" | ")); else ok("페이지 오류·404 없음");
  await b.close(); srv.close();
  console.log(`\n문제 ${문제}건`);
})();
