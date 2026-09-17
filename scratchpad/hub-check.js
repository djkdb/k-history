/*
 * 현관이 제구실을 하는가.
 *
 * 카드 다섯이 보이는 것과, 그 카드가 실제로 그 앱으로 데려다주는 것은 다르다.
 * 주소가 하나만 어긋나도 사람을 없는 데로 보낸다. 그리고 다섯 중 하나만 쓰는
 * 사람이 대부분이라, 지난번에 연 곳을 기억하는지도 봐야 한다.
 *
 *   node scratchpad/hub-check.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/hub-check.js <주소>"); process.exit(1); }
const path = require("path");
const { APPS } = (() => {
  /* 화면에 적힌 것과 자료가 어긋나지 않았는지 보려면 자료를 직접 읽어야 한다 */
  const jiti = require("/home/user/k-history/node_modules/jiti")(
    "/home/user/k-history/hub",
    { alias: { "@": "/home/user/k-history/hub/src" } },
  );
  return jiti("/home/user/k-history/hub/src/data/apps.ts");
})();

let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  console.log("\n━━━ 다섯이 다 있는가");
  const 링크 = await p.evaluate(() =>
    [...document.querySelectorAll("a[href^='http']")].map((a) => a.getAttribute("href")),
  );
  if (링크.length === APPS.length) ok(`카드 ${링크.length}개`);
  else no(`카드가 ${링크.length}개다 (${APPS.length}개여야)`);
  for (const app of APPS) {
    if (링크.includes(app.url)) ok(`${app.name} → ${app.url}`);
    else no(`${app.name} 의 주소가 화면에 없다 (${app.url})`);
  }

  console.log("\n━━━ 적어 둔 것이 화면에 그대로 나오는가");
  const t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  for (const app of APPS) {
    const 빠진 = [app.name, app.exam, app.tagline, ...app.what].filter((x) => !t.includes(x));
    if (빠진.length === 0) ok(`${app.name} — 이름·시험·한 줄·분량 모두 보인다`);
    else no(`${app.name} 에서 빠진 것: ${빠진.join(" / ")}`);
  }

  console.log("\n━━━ 누를 만한 크기인가");
  let 작은 = 0;
  for (const el of await p.locator("a[href^='http']").all()) {
    const r = await el.boundingBox();
    if (!r || r.height < 24 || r.width < 24) 작은++;
  }
  if (작은 === 0) ok("다섯 장 모두 24px 이상");
  else no(`${작은}장이 너무 작다`);

  console.log("\n━━━ 다른 데로 나간다고 알려 주는가");
  const 새창 = await p.evaluate(() =>
    [...document.querySelectorAll("a[href^='http']")].every((a) => a.querySelector("svg")),
  );
  if (새창) ok("카드마다 바깥으로 나가는 표시가 있다");
  else no("바깥으로 나간다는 표시가 없다");

  console.log("\n━━━ 지난번에 본 곳을 기억하는가");
  const 둘째 = APPS[2];
  await p.evaluate((id) => localStorage.setItem("hub:last", id), 둘째.id);
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const 첫카드 = await p.locator("a[href^='http']").first().getAttribute("href");
  if (첫카드 === 둘째.url) ok(`${둘째.name} 이 맨 위로 올라온다`);
  else no(`맨 위가 ${첫카드} 다 (${둘째.url} 이어야)`);
  const t2 = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/지난번에 본 곳/.test(t2)) ok("왜 위에 있는지 적혀 있다");
  else no("맨 위로 올린 까닭을 말하지 않는다");

  console.log("\n━━━ 눌러도 되는가");
  await p.evaluate(() => localStorage.removeItem("hub:last"));
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  /*
   * 실제로 나가 버리면 저장소를 읽을 수 없다.
   *
   * ⚠️ 처음에는 요청을 막는 식으로 했는데, 그래도 화면은 오류 쪽으로 넘어가
   *    localStorage 를 읽는 순간 SecurityError 가 났다. 화면이 넘어가는 것
   *    자체를 막아야 한다. document 의 거품 단계에서 막으면 리액트의 onClick
   *    은 이미 돈 뒤라, 적히는 것은 적히고 이동만 멈춘다.
   */
  await p.evaluate(() =>
    document.addEventListener("click", (e) => e.preventDefault()),
  );
  await p.locator("a[href^='http']").first().click().catch(() => {});
  await p.waitForTimeout(600);
  const 남은 = await p.evaluate(() => localStorage.getItem("hub:last"));
  if (남은 === APPS[0].id) ok(`누른 곳을 적어 둔다 (${남은})`);
  else no(`누른 곳이 안 적혔다 (${남은})`);

  console.log("\n━━━ 왜 다섯 개인지 말해 주는가");
  if (/왜 앱이 다섯 개인가요/.test(t)) ok("까닭을 밝힌다");
  else no("까닭이 없다");
  if (/기록이 사라집니다|사라집니다/.test(t)) ok("합치면 기록이 사라진다는 것을 말한다");
  else no("합치지 않는 까닭을 말하지 않는다");
  if (/기출 문제는 싣지 않았습니다/.test(t)) ok("기출을 싣지 않았다고 밝힌다");
  else no("기출에 대한 안내가 없다");

  if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
