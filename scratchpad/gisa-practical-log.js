/*
 * 실기를 한 벌 풀면 기록에 남는가.
 *
 * 남지 않으면 공부 기록 화면에서 실기가 통째로 빠진다 — 실제로 그랬다.
 * 화면을 고쳤다고 끝이 아니라, 정말로 풀어 보고 숫자가 오르는지 본다.
 *
 *   node scratchpad/gisa-practical-log.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-practical-log.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
        state: { settings: { track: "practical", examDate: null } },
      }));
    } catch {}
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/stats", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const 전 = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  console.log("\n━━━ 풀기 전");
  if (/아직 기록이 없습니다/.test(전)) ok("기록이 비어 있다");
  else no("시작부터 기록이 있다: " + 전.slice(0, 120));

  await p.goto(BASE + "/practical", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  console.log("\n━━━ 실기 다섯 문항 풀기");
  const five = p.locator("button", { hasText: /^5문항$/ }).first();
  if (await five.count()) await five.click();
  await p.locator("button", { hasText: /시작/ }).first().click();
  await p.waitForTimeout(800);

  let 푼 = 0;
  for (let i = 0; i < 12; i++) {
    const box = p.locator("textarea, input[type=text]").first();
    if (await box.count()) {
      await box.fill("모름");
      const grade = p.locator("button", { hasText: /^(채점|채점하기|확인)$/ }).first();
      if (await grade.count()) await grade.click();
      else {
        const any = p.locator("main button").filter({ hasText: /채점/ }).first();
        if (await any.count()) await any.click();
      }
      await p.waitForTimeout(350);
    }
    const nxt = p.locator("button", { hasText: /^(다음|결과 보기)$/ }).first();
    if (!(await nxt.count())) break;
    const 마지막 = /결과 보기/.test(await nxt.innerText());
    await nxt.click();
    푼++;
    await p.waitForTimeout(400);
    if (마지막) break;
  }
  if (푼 >= 5) ok(`${푼}문항을 끝까지 풀었다`);
  else no(`${푼}문항에서 막혔다`);
  const done = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/다시|끝|결과|점/.test(done)) ok("결과 화면에 닿았다");
  else no("결과 화면이 아니다: " + done.slice(0, 140));

  await p.goto(BASE + "/stats", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const 후 = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  console.log("\n━━━ 풀고 나서");
  const m = 후.match(/실기로 적은 문항 (\d+)개/);
  if (m && Number(m[1]) === 5) ok("실기로 적은 문항 5개");
  else no("실기가 기록되지 않았다: " + (m ? m[0] : 후.slice(0, 160)));
  const s = 후.match(/푼 문항 (\d+)개/);
  if (s && Number(s[1]) === 5) ok("푼 문항 5개");
  else no("푼 문항이 틀렸다: " + (s ? s[0] : "없음"));
  if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");

  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
