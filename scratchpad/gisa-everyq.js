// 문항 전수 — 274개 필기와 127개 실기를 실제 화면에 하나씩 띄워 본다.
//
// 감사는 자료를 보고, 전수조사는 화면을 열어 본다. 그런데 "이 문항이 화면에
// 올라갔을 때" 는 아무도 보지 않았다. 긴 선지가 넘치거나, 지문이 깨지거나,
// 정답 표시가 엉뚱한 자리에 붙는 것은 띄워 봐야 안다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/questions.ts");
const { PRACTICAL_QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/practical.ts");
const { shuffleOptions } = jiti("/home/user/k-history/gisa/src/lib/quiz.ts");
const BASE = process.argv[2] || "http://127.0.0.1:4960";
const W = Number(process.argv[3] || 320);   // 가장 좁은 화면에서 본다
let bad = 0;
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

  // 문항 카드를 그대로 그려 주는 작은 껍데기를 앱 안에서 만든다.
  // 앱의 실제 CSS 위에서 재야 의미가 있으므로 개념 화면을 바탕으로 쓴다.
  await p.goto(BASE + "/concept/d-oop", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);

  console.log(`### 필기 ${QUESTIONS.length}문항 — ${W}px 에서 그려 본다`);
  const res = await p.evaluate(({ qs, width }) => {
    const host = document.createElement("div");
    host.style.cssText = `width:${width}px;position:fixed;left:0;top:0;z-index:-1;`;
    document.body.appendChild(host);
    const out = [];
    for (const q of qs) {
      host.innerHTML = `
        <main class="py-6" style="padding-left:16px;padding-right:16px">
          <h2 class="mt-3 text-[16px] font-bold leading-relaxed">${q.question.replace(/</g, "&lt;")}</h2>
          ${q.passage ? `<pre class="sql-block sql-surface mt-3 overflow-x-auto rounded-xl border px-3.5 py-3 text-[12.5px]">${q.passage.replace(/</g, "&lt;")}</pre>` : ""}
          <div class="mt-4 flex flex-col gap-2">
            ${q.options.map((o, i) => `
              <button class="w-full rounded-2xl border px-3.5 py-3 text-left">
                <div class="flex items-start gap-2.5">
                  <span class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">${i + 1}</span>
                  <span class="min-w-0 flex-1 text-[14px] leading-relaxed">${o.replace(/</g, "&lt;")}</span>
                </div>
              </button>`).join("")}
          </div>
        </main>`;
      const el = host.firstElementChild;
      const over = el.scrollWidth > width + 1;
      // 지문은 제 안에서만 가로로 넘겨도 된다
      const preOver = [...host.querySelectorAll("pre")].some((x) => {
        const cs = getComputedStyle(x);
        return x.scrollWidth > x.clientWidth + 1 && cs.overflowX !== "auto" && cs.overflowX !== "scroll";
      });
      if (over || preOver) out.push({ id: q.id, w: el.scrollWidth, preOver });
    }
    host.remove();
    return out;
  }, { qs: QUESTIONS.map((q) => shuffleOptions(q, 777)).map((q) => ({ id: q.id, question: q.question, passage: q.passage ?? null, options: q.options })), width: W });

  for (const r of res) no(`${r.id} — ${r.preOver ? "지문이 넘치는데 가로 스크롤이 없다" : `카드가 ${r.w}px 로 화면(${W}px)을 넘는다`}`);
  console.log(`  넘치는 문항 ${res.length}개`);

  console.log(`\n### 실기 ${PRACTICAL_QUESTIONS.length}문항`);
  const res2 = await p.evaluate(({ qs, width }) => {
    const host = document.createElement("div");
    host.style.cssText = `width:${width}px;position:fixed;left:0;top:0;z-index:-1;`;
    document.body.appendChild(host);
    const out = [];
    for (const q of qs) {
      host.innerHTML = `
        <main style="padding-left:16px;padding-right:16px">
          <h2 class="mt-3 text-[15px] font-bold leading-relaxed">${q.question.replace(/</g, "&lt;")}</h2>
          ${q.passage ? `<pre class="sql-block sql-surface mt-3 overflow-x-auto rounded-xl border px-3.5 py-3 text-[12.5px]">${q.passage.replace(/</g, "&lt;")}</pre>` : ""}
          <p class="mt-1 whitespace-pre-wrap font-mono text-[13px] leading-relaxed">${q.answer.replace(/</g, "&lt;")}</p>
          <p class="mt-2.5 text-[13px] leading-relaxed">${q.explanation.replace(/</g, "&lt;")}</p>
        </main>`;
      const el = host.firstElementChild;
      if (el.scrollWidth > width + 1) out.push({ id: q.id, w: el.scrollWidth });
    }
    host.remove();
    return out;
  }, { qs: PRACTICAL_QUESTIONS.map((q) => ({ id: q.id, question: q.question, passage: q.passage ?? null, answer: q.answers[0], explanation: q.explanation })), width: W });

  for (const r of res2) no(`${r.id} — 카드가 ${r.w}px 로 화면(${W}px)을 넘는다`);
  console.log(`  넘치는 문항 ${res2.length}개`);

  if (errs.length) errs.slice(0, 3).forEach((e) => no("예외: " + e));
  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : `\n✓ ${QUESTIONS.length + PRACTICAL_QUESTIONS.length}문항 전부 ${W}px 안에 들어간다`);
  process.exit(bad ? 1 : 0);
})();
