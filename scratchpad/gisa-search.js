/*
 * 찾기 칸이 적힌 대로 일하는가.
 *
 * "개념 이름이나 내용으로 찾기" 라고 써 놓고 제목과 한 줄 요약만 뒤지고
 * 있었다. 본문에만 있는 말은 아무리 쳐도 안 나왔고, 사용자는 그 개념이
 * 앱에 없는 줄 알고 돌아섰다. 이제 본문·시험 포인트·헷갈리는 짝·외울
 * 거리·문항까지 뒤진다 — 정말 그런지 쳐 보고 확인한다.
 *
 *   node scratchpad/gisa-search.js <주소>
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2];
if (!BASE) { console.error("쓰기: node scratchpad/gisa-search.js <주소>"); process.exit(1); }
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

/* 모두 제목에도 요약에도 없는 말이다 — 예전 찾기로는 전부 0개였다 */
const 본문에만 = [
  ["벨레이디", "기억장치 관리", "시험 포인트"],
  ["워킹 셋", "기억장치 관리", "본문"],
  ["에이징", "프로세스 스케줄링", "본문"],
  ["TOCTOU", "시큐어 코딩", "본문"],
  ["쿠버네티스", "신기술 용어", "본문"],
];

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
        state: { settings: { track: "written", examDate: null } },
      }));
    } catch {}
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  await p.goto(BASE + "/learn", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  const box = p.locator('input[type=search]').first();
  if (!(await box.count())) { console.log("찾기 칸이 없다"); process.exit(1); }

  console.log("\n━━━ 본문에만 있는 말");
  for (const [말, 개념, 자리] of 본문에만) {
    await box.fill(말);
    await p.waitForTimeout(450);
    const t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
    if (!new RegExp(개념).test(t)) { no(`"${말}" — ${개념} 이 안 나온다`); continue; }
    if (!new RegExp(자리).test(t)) { no(`"${말}" — 어디에서 걸렸는지(${자리})를 안 알려 준다`); continue; }
    ok(`"${말}" → ${개념} [${자리}]`);
  }

  console.log("\n━━━ 훑어보기 칸을 걷어내는가");
  await box.fill("벨레이디");
  await p.waitForTimeout(450);
  let t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (!/과목별로 보기|개념 훑어보기/.test(t)) ok("찾는 중에는 결과만 남는다");
  else no("찾는 중에도 원래 목록이 같이 보인다");
  if (/개념 1개/.test(t)) ok("몇 개인지 먼저 말한다");
  else no("결과 개수를 말하지 않는다: " + t.slice(0, 120));

  console.log("\n━━━ 걸린 말에 표시가 되는가");
  const marked = await p.locator("main b").filter({ hasText: "벨레이디" }).count();
  if (marked > 0) ok(`걸린 말 ${marked}곳에 표시`);
  else no("어디가 걸렸는지 표시가 없다");

  console.log("\n━━━ 문항까지 뒤지는가");
  await box.fill("페이지 부재");
  await p.waitForTimeout(500);
  t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  const m = t.match(/문항 (\d+)개/);
  if (m && Number(m[1]) > 0) ok(`문항 ${m[1]}개도 같이 찾는다`);
  else no("문항은 안 찾는다: " + t.slice(0, 140));
  if (/에서 나온 문항/.test(t)) ok("그 문항이 어느 개념 것인지 말한다");
  else no("문항이 어디 것인지 모른다");

  console.log("\n━━━ 없는 말을 쳤을 때");
  await box.fill("존재하지않는말zzz");
  await p.waitForTimeout(450);
  t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/든 곳이 없습니다/.test(t)) ok("없다고 분명히 말한다");
  else no("빈 결과가 그냥 빈 화면이다: " + t.slice(0, 140));
  if (/줄여서 다시/.test(t)) ok("다음에 무엇을 할지 알려 준다");
  else no("다음 수를 알려 주지 않는다");

  console.log("\n━━━ 지우면 되돌아오는가");
  await box.fill("");
  await p.waitForTimeout(450);
  t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/과목별로 보기/.test(t)) ok("비우면 원래 화면으로 돌아온다");
  else no("비웠는데 목록이 안 돌아온다");

  console.log("\n━━━ 실기로 보는 사람");
  await p.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("gisa:mirror:gisa-state") || "{}");
    raw.state = { ...(raw.state || {}), settings: { track: "practical", examDate: null } };
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify(raw));
  });
  await p.goto(BASE + "/learn", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.locator('input[type=search]').first().fill("캡슐화");
  await p.waitForTimeout(500);
  t = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  if (/개념 \d+개/.test(t)) ok("실기에서도 찾힌다: " + (t.match(/개념 \d+개[^·]*/) || [""])[0].trim());
  else no("실기에서 아무것도 안 나온다: " + t.slice(0, 140));

  if (errs.length) no("자바스크립트 오류: " + errs.join(" | ")); else ok("오류 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n문제 0건");
  process.exit(bad ? 1 : 0);
})();
