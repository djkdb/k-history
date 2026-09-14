const { chromium } = require("/home/user/k-history/node_modules/playwright");
const BASE = process.argv[2] || "http://127.0.0.1:4910";
const NEW = ["d-current-system","v-interface-impl","v-manual","b-procedural",
             "b-physical","b-migration","l-server-build","s-security-solution"];
const dump = (t) => t.replace(/\n{2,}/g, "\n").trim();
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,120)));
  for (const id of NEW) {
    await p.goto(`${BASE}/concept/${id}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    const t = dump(await p.locator("main").innerText());
    const lines = t.split("\n");
    const title = lines.find(l=>l.length>4&&!/^학습$|^[📐🔧🗄️💻🛡️]/.test(l)) ?? "?";
    const hasKeys = /외울 것/.test(t), hasTrap = /바꿔 내는 짝/.test(t), hasExam = /시험에는 이렇게/.test(t);
    const raw = t.match(/\*\*|`/g);
    console.log(`${id.padEnd(20)} ${String(t.length).padStart(4)}자 · 외울것 ${hasKeys?"O":"—"} · 짝 ${hasTrap?"O":"—"} · 시험 ${hasExam?"O":"—"}${raw?" ⚠️ 날것 "+raw.join(""):""}`);
  }
  console.log("\n예외:", errs.length?errs:"없음");
  // 한 화면 통째로 읽어 본다
  await p.goto(`${BASE}/concept/s-security-solution`, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  console.log("\n=== 보안 솔루션 화면 ===");
  console.log(dump(await p.locator("main").innerText()));
  await b.close();
})();
