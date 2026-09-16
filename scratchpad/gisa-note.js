/*
 * 오답 노트가 실제로 도는가.
 *
 * 한 회를 끝까지 풀고(답을 일부러 찍어 틀리게 한 뒤) 결과에서 오답 노트로
 * 들어가, 틀린 문항이 그대로 다시 펴지는지 본다. 씨앗으로 시험지를 되살리는
 * 구조라 "되살리지 못했습니다" 로 물러서면 그것도 잡아야 한다.
 *
 *   node scratchpad/gisa-note.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-note.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const body = () => p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));

  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  await p.getByRole("button", { name: /시작하기/ }).first().click().catch(() => {});
  await p.waitForTimeout(1400);

  // 스무 문항만 찍고 나머지는 비운 채 제출한다 — 틀린 것이 넉넉히 생긴다
  let answered = 0;
  for (let i = 0; i < 20; i++) {
    const opts = p.getByRole("button").filter({ hasText: /^[1-4][^0-9]/ });
    if (!(await opts.count())) break;
    await opts.nth(i % 4).click().catch(() => {});
    answered++;
    await p.waitForTimeout(120);
    const next = p.getByRole("button", { name: /^다음$/ }).first();
    if (!(await next.count())) break;
    await next.click().catch(() => {});
    await p.waitForTimeout(120);
  }
  ok(`${answered}문항을 찍고 나머지는 비웠다`);

  // 답안지 → 제출하기 → 확인
  await p.getByRole("button", { name: /답안지/ }).first().click();
  await p.waitForTimeout(700);
  const sheet = p.locator('[class*="fixed"][class*="inset-0"]').last();
  await sheet.getByRole("button", { name: /제출하기/ }).first().click();
  await p.waitForTimeout(600);
  await p.locator('[class*="fixed"][class*="inset-0"]').last()
    .getByRole("button", { name: /^제출$/ }).first().click();
  await p.waitForTimeout(1800);

  const result = await body();
  if (/평균|점/.test(result)) ok("채점 결과가 나왔다");
  else return no("결과 화면이 나오지 않았다"), await b.close();

  const noteBtn = p.getByRole("button", { name: /오답 노트 보기/ }).first();
  if (!(await noteBtn.count())) return no("결과에서 오답 노트로 가는 길이 없다"), await b.close();
  await noteBtn.click();
  await p.waitForTimeout(1500);

  const url = p.url();
  if (/\/mock\/note\?at=\d+/.test(url)) ok("오답 노트로 넘어갔다 (" + url.split("/mock")[1] + ")");
  else no("주소가 이상하다: " + url);

  const note = await body();
  if (/되살리지 못했습니다/.test(note)) no("시험지를 되살리지 못하고 개념 목록으로 물러섰다");
  else ok("그때의 시험지를 그대로 되살렸다");

  const m = note.match(/틀린 문항 (\d+)개/);
  if (m) ok(`틀린 문항 ${m[1]}개를 다시 펴 준다`);
  else no("틀린 문항 목록이 없다");

  if (/과목별/.test(note)) ok("과목별 점수도 함께 보여 준다");
  else no("과목별 점수가 없다");

  // 내가 고른 것과 정답이 함께 보이는가
  const marked = await p.evaluate(() =>
    document.querySelectorAll('[class*="emerald"], [class*="rose"], [class*="red"]').length);
  if (marked > 4) ok(`정답·오답 표시가 살아 있다 (${marked}곳)`);
  else no("어느 것이 정답이고 무엇을 골랐는지 표시가 없다");

  // 지난 응시 목록에서도 들어가지는가
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const fromList = p.getByRole("link", { name: /오답 노트/ }).first();
  if (await fromList.count()) {
    await fromList.click(); await p.waitForTimeout(1200);
    if (/\/mock\/note/.test(p.url())) ok("지난 응시 목록에서도 들어간다");
    else no("지난 응시에서 누르니 엉뚱한 곳으로 갔다");
  } else no("지난 응시 목록에 오답 노트로 가는 길이 없다");

  if (errs.length) no(`예외 ${errs.length}건: ${errs[0]}`);
  console.log(bad ? `\n걸린 것 ${bad}건` : "\n✓ 오답 노트가 제구실을 한다");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
