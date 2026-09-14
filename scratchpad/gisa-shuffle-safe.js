// 선지를 섞고 나서, 시험 도중 새로고침해도 "내가 고른 그 선지" 가 그대로인가.
//
// 저장하는 것은 번호다("2번을 골랐다"). 새로고침 뒤 선지 순서가 조금이라도
// 달라지면 같은 2번이 다른 글을 가리키고, 화면은 아무 오류 없이 엉뚱한 답을
// 내가 고른 것으로 보여 준다. 소리 없이 채점이 틀어지는 종류다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2] || "http://127.0.0.1:4910";
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
    localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
      settings:{track:"written",examDate:null}, stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
      studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],wrongIds:[],mockAttempts:[]}})); } catch {} });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));

  await p.goto(`${BASE}/mock/session?seed=12345`, { waitUntil: "networkidle" });
  await p.waitForTimeout(700);

  // 여섯 문항에 답하면서, 내가 고른 선지의 "글" 을 적어 둔다
  const chose = [];
  for (let i = 0; i < 6; i++) {
    const q = (await p.locator("main h2").first().innerText()).trim();
    const n = (i % 4) + 1;
    const btn = p.locator(`main button:has(span:text-is("${n}"))`).first();
    const text = (await btn.innerText()).replace(/^\s*\d+\s*/, "").trim();
    await btn.click();
    chose.push({ at: i, q: q.slice(0, 30), n, text });
    await p.waitForTimeout(120);
    if (i < 5) { await p.getByRole("button", { name: "다음" }).click(); await p.waitForTimeout(150); }
  }
  ok(`여섯 문항에 답했다 (고른 번호 ${chose.map((c) => c.n).join(",")})`);

  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  // 답안지를 열어 각 문항으로 돌아가 "고른 것으로 표시된 선지의 글" 을 견준다
  for (const c of chose) {
    await p.getByRole("button", { name: "답안지" }).click();
    await p.waitForTimeout(250);
    await p.locator(`div.grid button:text-is("${c.at + 1}")`).first().click();
    await p.waitForTimeout(350);
    const q = (await p.locator("main h2").first().innerText()).trim();
    if (!q.startsWith(c.q.slice(0, 20))) { no(`${c.at + 1}번 문항이 바뀌었다`); continue; }
    // 고른 것으로 칠해진 단추를 찾는다
    const marked = p.locator("main button.border-indigo-400\\/50, main button.bg-indigo-500\\/15").first();
    const cnt = await marked.count();
    if (!cnt) { no(`${c.at + 1}번: 고른 표시가 사라졌다`); continue; }
    const text = (await marked.innerText()).replace(/^\s*\d+\s*/, "").trim();
    if (text === c.text) ok(`${c.at + 1}번 — 고른 선지가 그대로다 "${text.slice(0, 24)}"`);
    else no(`${c.at + 1}번 — 고른 것이 "${c.text.slice(0,24)}" 였는데 지금은 "${text.slice(0,24)}" 다`);
  }

  // 제출해서 채점이 내가 고른 것 기준으로 되는지도 본다
  await p.getByRole("button", { name: "답안지" }).click();
  await p.waitForTimeout(250);
  await p.getByRole("button", { name: "제출하기" }).click();
  await p.waitForTimeout(250);
  await p.getByRole("button", { name: "제출", exact: true }).click();
  await p.waitForTimeout(900);
  const body = await p.locator("main").innerText();
  /평균/.test(body) ? ok("채점 화면이 떴다") : no("채점 화면이 뜨지 않았다");

  errs.length ? errs.slice(0, 3).forEach((e) => no("예외: " + e)) : ok("예외 없음");
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 섞어도 고른 선지가 어긋나지 않는다");
  process.exit(bad ? 1 : 0);
})();
