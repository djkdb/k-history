// 기기 간 이어하기 확인 — 두 브라우저(기기 A·B)로. node scratchpad/mid-sync.js  (BASE=http://localhost:8790)
const { chromium, devices } = require("playwright");
const BASE = process.env.BASE || "http://localhost:8790";
const solved = async (p) => { await p.goto(`${BASE}/ml/`); await p.waitForTimeout(2500); const t = await p.locator("main").innerText(); const m = t.match(/(\d+)\s*\/\s*731/); return m ? +m[1] : -1; };
async function onboard(p) { await p.goto(`${BASE}/ml/onboarding`); await p.waitForTimeout(800); const d = p.locator("#exam-date"); if (await d.count()) { if (!(await d.inputValue())) await d.fill("2026-10-23"); await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(800); } }
async function answer(p, n) {
  await p.goto(`${BASE}/ml/quiz`); await p.waitForTimeout(900);
  await p.locator("button", { hasText: "안 푼 것" }).first().click();
  await p.locator("button", { hasText: /^시작/ }).click(); await p.waitForTimeout(500);
  for (let i = 0; i < n; i++) {
    if (await p.getByRole("button", { name: /모범 답안 보기/ }).count()) { await p.getByRole("button", { name: /모범 답안 보기/ }).click(); await p.getByRole("button", { name: /맞혔어요/ }).click(); }
    else { await p.keyboard.press("1"); await p.waitForTimeout(120); if (await p.getByText("얼마나 자신 있어요").count()) await p.keyboard.press("2"); }
    await p.waitForTimeout(200); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  }
}
async function syncBtn(p) { await p.goto(`${BASE}/ml/settings`); await p.waitForTimeout(1500); await p.locator("button", { hasText: "지금 맞추기" }).click(); await p.waitForTimeout(2000); return (await p.locator("main").innerText()).match(/맞춤[^\n]*|연결되지[^\n]*|찾을 수 없[^\n]*/)?.[0]; }
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const A = await (await b.newContext({ ...devices["iPhone 13"], hasTouch: false })).newPage();
  const B = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const errs = []; for (const p of [A, B]) p.on("pageerror", (e) => errs.push(e.message));
  // 1. A 에서 공부하고 코드 만들기
  await onboard(A); await answer(A, 3);
  console.log("A 푼 문제:", await solved(A));
  await A.goto(`${BASE}/ml/settings`); await A.waitForTimeout(1200);
  await A.locator("button", { hasText: "새 기록 코드 만들기" }).click(); await A.waitForTimeout(2500);
  const code = (await A.locator("p.font-mono").first().innerText()).trim();
  console.log("코드:", code, "/", (await A.locator("main").innerText()).match(/맞춤[^\n]*/)?.[0]);
  // 2. B 에서 코드로 이어하기
  await B.goto(`${BASE}/ml/onboarding`); await B.waitForTimeout(1000);
  await B.locator('input[aria-label="기록 코드"]').fill(code.toLowerCase().replace("-", " "));
  await B.locator("button", { hasText: "연결" }).click(); await B.waitForTimeout(3000);
  console.log("B 연결 뒤 주소:", B.url().replace(BASE, ""), "· B 푼 문제:", await solved(B));
  // 3. B 에서 더 풀고 맞추기 → A 가 받는다
  await answer(B, 2); console.log("B 맞추기:", await syncBtn(B), "· B 푼 문제:", await solved(B));
  console.log("A 다시 열기 · A 푼 문제:", await solved(A));
  // 4. 따로 공부 — A 1개(맞추지 않음), B 1개(맞춤) → A 가 맞추면 둘 다
  await answer(A, 1); await answer(B, 1); await syncBtn(B);
  await syncBtn(A);
  console.log("따로 공부 뒤 A:", await solved(A), "· B 다시 맞추고:", (await syncBtn(B), await solved(B)));
  // 5. 같은 기기의 다른 과목도 연결돼 있나
  await B.goto(`${BASE}/db/onboarding`); await B.waitForTimeout(1500);
  console.log("B 의 DB 과목:", (await B.locator("main").innerText()).includes(code) ? "같은 코드로 연결됨" : "연결 안 됨");
  console.log("errors:", errs.length ? errs.slice(0, 5) : "none");
  await b.close();
})();
