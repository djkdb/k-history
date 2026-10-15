// 외웠어요 표시가 기록 코드로 기기 사이에 맞춰지는가 — node scratchpad/mid-memo-sync.js (BASE=http://localhost:8790)
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:8790";
async function onboard(p) { await p.goto(`${BASE}/db/onboarding`); await p.waitForTimeout(900); const d = p.locator("#exam-date"); if (await d.count()) { await p.locator("button", { hasText: "시작하기" }).first().click(); await p.waitForTimeout(800); } }
async function syncBtn(p) { await p.goto(`${BASE}/db/settings`); await p.waitForTimeout(1500); await p.locator("button", { hasText: "지금 맞추기" }).click(); await p.waitForTimeout(2000); }
const count = async (p) => { await p.goto(`${BASE}/db/memo`); await p.waitForTimeout(1500); const on = await p.locator('li button[aria-pressed]').evaluateAll((bs) => bs.map((b, i) => (b.getAttribute("aria-pressed") === "true" ? i + 1 : 0)).filter(Boolean)); return (await p.locator("main").innerText()).match(/외움 (\d+)\/(\d+)/)?.[0] + " [" + on.join(",") + "]"; };
const tick = async (p, i) => { await p.goto(`${BASE}/db/memo`); await p.waitForTimeout(1200); await p.locator('li button[aria-pressed]').nth(i).click(); await p.waitForTimeout(300); };
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const A = await (await b.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  const B = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const errs = []; for (const p of [A, B]) p.on("pageerror", (e) => errs.push(e.message.slice(0, 80)));
  await onboard(A);
  // 예전 판처럼 이 기기에만 둔 표시 하나 — 옮겨지는가
  await A.evaluate(() => localStorage.setItem("mid-db:memo-done", JSON.stringify({ "why-db": 1 })));
  await tick(A, 0); await tick(A, 2);
  console.log("A:", await count(A), "· 옛 표시 남음:", await A.evaluate(() => localStorage.getItem("mid-db:memo-done")));
  await A.goto(`${BASE}/db/settings`); await A.waitForTimeout(1200);
  await A.locator("button", { hasText: "새 기록 코드 만들기" }).click(); await A.waitForTimeout(2500);
  const code = (await A.locator("p.font-mono").first().innerText()).trim();
  await B.goto(`${BASE}/db/onboarding`); await B.waitForTimeout(1000);
  await B.locator('input[aria-label="기록 코드"]').fill(code);
  await B.locator("button", { hasText: "연결" }).click(); await B.waitForTimeout(3000);
  console.log("B 연결 뒤:", await count(B));
  // B 에서 하나 떼고 하나 더 → A 가 받는다
  await tick(B, 0); await tick(B, 5); await syncBtn(B); await syncBtn(A);
  console.log("B 고친 뒤 A:", await count(A), "· B:", await count(B));
  console.log("errors:", errs.length ? errs : "none");
  await b.close();
})();
