/*
 * "나에게 어려운 문항" 이 실제로 세어지고 쓰이는가.
 *
 * 문항에 난이도를 매겨 붙이는 대신 내가 틀린 횟수를 센다. 그렇다면 세는
 * 것이 맞는지, 그 숫자가 화면에 드러나는지, 그것만 골라 다시 풀 수 있는지
 * 세 가지가 다 돌아야 한다. 하나라도 끊기면 센 보람이 없다.
 *
 *   node scratchpad/gisa-hard.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-hard.js <주소>"); process.exit(1); }
const PICK = require("/tmp/pick.json");
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
const 상태 = async (p) =>
  JSON.parse(await p.evaluate(() => localStorage.getItem("gisa:mirror:gisa-state") || "{}"));

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript((pick) => {
    try {
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
        state: {
          settings: { track: "written", examDate: null },
          questionMisses: { [pick.a.id]: 2 },
        },
      }));
    } catch {}
  }, PICK);
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  console.log("\n━━━ 두 번 틀린 문항이 하나 있을 때");
  await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  let t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/두 번 이상 틀린 문항 \(1\)/.test(t)) ok("고르는 칸에 칩이 뜬다");
  else no("칩이 없다: " + t.slice(0, 200));

  console.log("\n━━━ 그것만 골라 풀기");
  await p.goto(BASE + "/quiz?hard=1", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/고를 수 있는 문항 1개/.test(t)) ok("고를 수 있는 문항이 1개로 좁혀진다");
  else no("좁혀지지 않았다: " + (t.match(/고를 수 있는 문항 \d+개/) || ["없음"])[0]);
  await p.locator("button", { hasText: /문항 시작/ }).first().click();
  await p.waitForTimeout(700);
  t = await p.locator("main").innerText();
  if (t.includes(PICK.a.question)) ok("바로 그 문항이 나온다");
  else no("다른 문항이 나온다: " + t.slice(0, 120).replace(/\n/g, " "));
  if (/여태 2번 틀림/.test(t)) ok("여태 몇 번 틀렸는지 문항에 적혀 있다");
  else no("틀린 횟수 표시가 없다");

  console.log("\n━━━ 또 틀리면 한 번 더 세는가");
  const 틀린것 = await p
    .locator("main button")
    .filter({ hasNotText: new RegExp(PICK.a.answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })
    .all();
  let 눌렀 = false;
  for (const btn of 틀린것) {
    const s = (await btn.innerText()).trim();
    if (!s || s === PICK.a.answer || /시작|다음|채점|보기|홈으로/.test(s)) continue;
    await btn.click(); 눌렀 = true; break;
  }
  if (!눌렀) no("틀린 선지를 못 찾았다");
  await p.waitForTimeout(800);
  const st = await 상태(p);
  const n = st?.state?.questionMisses?.[PICK.a.id];
  if (n === 3) ok("2번 → 3번으로 늘었다");
  else no(`틀린 횟수가 ${n} (3이어야)`);

  console.log("\n━━━ 자주 틀리는 곳 화면");
  await p.goto(BASE + "/wrong", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/두 번 이상 틀린 문항 1개/.test(t)) ok("문항 칸이 생긴다");
  else no("문항 칸이 없다: " + t.slice(0, 200));
  if (t.includes(PICK.a.question.replace(/\s+/g, " "))) ok("그 문항의 물음이 그대로 보인다");
  else no("물음이 안 보인다");
  if (/3번/.test(t)) ok("세 번 틀렸다고 적혀 있다");
  else no("횟수가 안 보인다");

  console.log("\n━━━ 맞혀도 지우지 않는가");
  await p.goto(BASE + "/quiz?hard=1", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.locator("button", { hasText: /문항 시작/ }).first().click();
  await p.waitForTimeout(600);
  const 정답 = p.locator("main button").filter({ hasText: PICK.a.answer }).first();
  if (await 정답.count()) {
    await 정답.click();
    await p.waitForTimeout(800);
    const st2 = await 상태(p);
    const n2 = st2?.state?.questionMisses?.[PICK.a.id];
    if (n2 === 3) ok("맞혀도 3번은 그대로 남는다 (지우면 약점이 안 보인다)");
    else no(`맞혔더니 ${n2} 이 되었다`);
  } else no("정답 선지를 못 찾았다");

  if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
