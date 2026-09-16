/*
 * 약술형 — 스스로 매기기가 제대로 도는가.
 *
 * 기계가 못 매기는 문항을 넣었으면, 사람이 매길 수 있게 갖춰져야 한다.
 * 적기 전에는 기준이 열리지 않아야 하고(보고 베낀 것을 실력으로 착각한다),
 * 연 뒤에는 모범 답안과 채점 기준이 다 보여야 하고, 세 갈래로 매길 수
 * 있어야 하고, "반쯤" 이 맞은 것으로 세어지지 않아야 한다.
 *
 *   node scratchpad/gisa-essay.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-essay.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

async function 시작(p) {
  await p.goto(BASE + "/practical", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.locator("button", { hasText: /^설명$/ }).first().click();
  await p.waitForTimeout(300);
  const five = p.locator("button", { hasText: /^5문항$/ }).first();
  if (await five.count()) await five.click();
  await p.locator("button", { hasText: /시작/ }).first().click();
  await p.waitForTimeout(700);
}

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

  console.log("\n━━━ 설명 갈래만 골라 풀기");
  await 시작(p);
  let t = await p.locator("main").innerText();
  if (/설명 쓰기/.test(t)) ok("설명 쓰기 문항이 나온다");
  else no("설명 문항이 아니다: " + t.slice(0, 160).replace(/\n/g, " "));
  if (/채점은 스스로 합니다/.test(t)) ok("스스로 매긴다고 미리 말해 준다");
  else no("채점 방식을 말해 주지 않는다");
  if (!/^\s*채점\s*$/m.test(t)) ok("기계 채점 단추가 없다");
  else no("채점 단추가 그대로 있다");

  console.log("\n━━━ 적기 전에는 기준이 열리지 않는가");
  const 펴기 = p.locator("button", { hasText: /기준을 폅니다|채점 기준 펴기/ }).first();
  if (!(await 펴기.count())) { no("기준 펴기 단추가 없다"); }
  else {
    if (await 펴기.isDisabled()) ok("빈칸이면 눌리지 않는다");
    else no("아무것도 안 적었는데 기준이 열린다");
    if (/적고 나서 기준을 폅니다/.test(await 펴기.innerText())) ok("왜 안 눌리는지 적혀 있다");
    else no("왜 안 눌리는지 말해 주지 않는다");
  }

  console.log("\n━━━ 적고 나서 기준 펴기");
  await p.locator("textarea").first().fill("IDS 는 알리고 IPS 는 막는다.");
  await p.waitForTimeout(250);
  await p.locator("button", { hasText: /채점 기준 펴기/ }).first().click();
  await p.waitForTimeout(400);
  t = await p.locator("main").innerText();
  if (/모범 답안/.test(t)) ok("모범 답안이 보인다");
  else no("모범 답안이 없다");
  if (/이 가운데 몇 가지를 담았습니까/.test(t)) ok("채점 기준이 펴진다");
  else no("채점 기준이 없다: " + t.slice(0, 200).replace(/\n/g, " "));
  if (/문장이 같을 필요는 없습니다/.test(t)) ok("문장을 맞출 필요 없다고 일러 준다");
  else no("매기는 요령을 말해 주지 않는다");
  for (const 갈래 of ["다 담았다", "반쯤", "못 담았다"]) {
    if (await p.locator("button", { hasText: new RegExp("^" + 갈래 + "$") }).count()) ok(`"${갈래}" 로 매길 수 있다`);
    else no(`"${갈래}" 단추가 없다`);
  }

  console.log("\n━━━ 반쯤은 맞은 것으로 세지 않는다");
  await p.locator("button", { hasText: /^반쯤$/ }).first().click();
  await p.waitForTimeout(700);
  t = await p.locator("main").innerText();
  if (/반쯤 담았습니다/.test(t)) ok("반쯤이라고 적힌다");
  else no("반쯤 표시가 없다: " + t.slice(0, 200).replace(/\n/g, " "));
  const st = await p.evaluate(() => {
    try { return JSON.parse(localStorage.getItem("gisa:mirror:gisa-state") || "{}").state; }
    catch { return null; }
  });
  const 맞힌 = st?.clearedPracticalIds ?? [];
  if (맞힌.length === 0) ok("맞힌 문항으로 세지 않는다");
  else no("반쯤인데 맞힌 것으로 셌다: " + JSON.stringify(맞힌));
  const 틀린 = Object.values(st?.questionMisses ?? {});
  if (틀린.length === 1 && 틀린[0] === 1) ok("틀린 횟수로 한 번 센다 (다시 볼 자리로 남는다)");
  else no("틀린 횟수가 이상하다: " + JSON.stringify(st?.questionMisses));

  console.log("\n━━━ 모의고사에는 섞이지 않는가");
  await p.goto(BASE + "/practical/mock/session?seed=12345", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  t = await p.locator("main").innerText();
  if (!/설명 쓰기/.test(t)) ok("첫 화면에 설명 쓰기가 없다");
  else no("모의고사 첫 문항이 설명 쓰기다");

  if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
