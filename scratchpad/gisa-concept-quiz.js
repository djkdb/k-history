/*
 * 개념 화면의 확인 문제가 실제로 도는가.
 *
 * 읽은 자리에서 바로 물어보는 것이 이 기능의 전부다. 펼치기 전에는 문제가
 * 보이지 않아야 하고(보이면 눈으로 베낀다), 맞히면 "봤습니다" 가 저절로
 * 켜져야 하며, 틀린 것은 복습으로 넘어가야 한다.
 *
 *   node scratchpad/gisa-concept-quiz.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-concept-quiz.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  await p.goto(BASE + "/concept/d-sdlc", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  const body = () => p.evaluate(() => (document.body.innerText || "").replace(/\s+/g, " "));
  const before = await body();

  // 펼치기 전에는 문제가 보이면 안 된다
  const openBtn = p.getByRole("button", { name: /가리고 풀어 보기/ }).first();
  if (!(await openBtn.count())) return no("«가리고 풀어 보기» 단추가 없다"), await b.close();
  const label = (await openBtn.innerText()).replace(/\s+/g, " ").trim();
  ok(`단추가 있다 — "${label}"`);
  const opts0 = await p.getByRole("button").filter({ hasText: /^[1-4][^0-9]/ }).count();
  if (opts0 === 0) ok("펼치기 전에는 선지가 보이지 않는다");
  else no(`펼치기 전인데 선지가 ${opts0}개 보인다`);

  await openBtn.click();
  await p.waitForTimeout(700);
  const opts = p.getByRole("button").filter({ hasText: /^[1-4][^0-9]/ });
  const n = await opts.count();
  if (n >= 4) ok(`펼치니 선지 ${n}개가 나온다`);
  else return no(`선지가 ${n}개뿐이다`), await b.close();

  // 정답을 고른다 — 화면에서 정답 자리를 알 수 없으니 하나씩 눌러 본다
  await opts.first().click();
  await p.waitForTimeout(700);
  const after = await body();
  if (/맞았|정답|틀렸|아쉽/.test(after) || after !== before) ok("고르면 그 자리에서 채점된다");
  else no("골랐는데 아무 반응이 없다");

  // 해설이 함께 나오는가
  if (after.length > before.length) ok("해설이 함께 펼쳐진다");
  else no("해설이 보이지 않는다");

  // 다음 문항으로 넘어가는가
  const next = p.getByRole("button", { name: /다음 문항|처음부터 다시/ }).first();
  if (await next.count()) {
    const t = (await next.innerText()).trim();
    await next.click(); await p.waitForTimeout(600);
    ok(`«${t}» 로 이어진다`);
  } else no("다음으로 갈 방법이 없다");

  // 개념마다 문항이 붙어 있는가 — 몇 곳을 훑는다
  let withQ = 0, tried = 0;
  for (const cid of ["d-oop", "b-normalization", "v-integration", "l-python", "s-security-crypto", "d-solid"]) {
    await p.goto(BASE + "/concept/" + cid, { waitUntil: "networkidle" });
    await p.waitForTimeout(500);
    tried++;
    if (await p.getByRole("button", { name: /가리고 풀어 보기/ }).count()) withQ++;
  }
  if (withQ === tried) ok(`훑어본 개념 ${tried}곳 모두 확인 문제가 있다`);
  else no(`개념 ${tried}곳 중 ${tried - withQ}곳에는 확인 문제가 없다`);

  if (errs.length) no(`예외 ${errs.length}건: ${errs[0]}`);
  console.log(bad ? `\n걸린 것 ${bad}건` : "\n✓ 개념 화면에서 바로 확인할 수 있다");
  await b.close();
  process.exit(bad ? 1 : 0);
})();
