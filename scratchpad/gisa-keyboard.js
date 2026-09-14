// 마우스·손가락 없이 키보드만으로 쓸 수 있는가, 그리고 글씨를 키우면 깨지는가.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const { PNG } = require("/home/user/k-history/node_modules/pngjs");
const BASE = process.argv[2] || "http://127.0.0.1:4960";
let bad = 0;
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  console.log("[키보드만으로]");
  {
    const ctx = await b.newContext({ viewport: { width: 1024, height: 800 } });
    await ctx.addInitScript(() => { try { if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
        settings:{track:"written",examDate:null},stats:{xp:0,streak:0,lastStudyDate:null,studyMinutes:0},
        studiedIds:[],clearedQuestionIds:[],clearedPracticalIds:[],reviewCards:[],quizHistory:[],
        wrongIds:[],mockAttempts:[]}})); } catch {} });
    const p = await ctx.newPage();
    await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
    await p.waitForTimeout(600);

    /*
     * 탭으로 돌면서 포커스가 눈에 보이는가.
     *
     * ⚠️ 처음에는 outlineStyle 과 outlineWidth 를 읽어 판단했다. 그런데 크롬은
     *    자기 기본 포커스 링을 outline: auto 로 두면서 계산된 너비를 0px 로
     *    알려 준다 — 실제로는 멀쩡히 그리면서. 그래서 멀쩡한 14군데를
     *    "보이지 않는다" 고 적었다. 계산값 말고 픽셀을 본다.
     */
    let invisible = 0, steps = 0;
    const shot = async (box) => PNG.sync.read(await p.screenshot({ clip: box }));
    const differs = (a, c) => {
      let n = 0;
      for (let i = 0; i < a.data.length; i += 4)
        if (Math.abs(a.data[i] - c.data[i]) > 6 ||
            Math.abs(a.data[i + 1] - c.data[i + 1]) > 6 ||
            Math.abs(a.data[i + 2] - c.data[i + 2]) > 6) n++;
      return n;
    };
    for (let i = 0; i < 14; i++) {
      const box = await p.evaluate(() => {
        // 다음에 포커스가 갈 자리를 미리 알 수 없으니, 한 번 눌러 보고
        // 그 자리를 기억했다가 되돌아와 견준다
        return null;
      });
      await p.keyboard.press("Tab");
      steps++;
      const info = await p.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        if (r.bottom < 0 || r.top > innerHeight) return null;
        return {
          text: (el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\n/g, " ").slice(0, 18),
          clip: {
            x: Math.max(0, Math.round(r.left - 6)),
            y: Math.max(0, Math.round(r.top - 6)),
            width: Math.round(Math.min(r.width + 12, 1000)),
            height: Math.round(Math.min(r.height + 12, 700)),
          },
        };
      });
      if (!info) continue;
      const focused = await shot(info.clip);
      await p.evaluate(() => document.activeElement && document.activeElement.blur());
      await p.waitForTimeout(60);
      const blurred = await shot(info.clip);
      const n = differs(focused, blurred);
      const area = info.clip.width * info.clip.height;
      if (n < Math.max(20, area * 0.004)) {
        invisible++;
        if (invisible <= 3) console.log(`      보이지 않는 곳: "${info.text}" (달라진 픽셀 ${n}개 / ${area})`);
      }
      // 포커스를 다시 그 자리로 돌려 놓고 이어 간다
      await p.keyboard.press("Tab");
    }
    invisible === 0
      ? ok(`탭 ${steps}번 도는 동안 포커스가 늘 눈에 보였다 (픽셀로 확인)`)
      : no(`탭으로 옮겼는데 어디에 있는지 보이지 않는 곳 ${invisible}군데`);

    // 키보드로 문제를 풀 수 있는가
    await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
    await p.waitForTimeout(500);
    for (let i = 0; i < 30; i++) {
      await p.keyboard.press("Tab");
      const t = await p.evaluate(() => (document.activeElement?.innerText || "").trim());
      if (/문항 시작/.test(t)) { await p.keyboard.press("Enter"); break; }
    }
    await p.waitForTimeout(600);
    const started = await p.locator("main h2").count();
    started ? ok("키보드만으로 문제를 시작할 수 있다") : no("키보드로 문제를 시작하지 못했다");
    if (started) {
      for (let i = 0; i < 20; i++) {
        await p.keyboard.press("Tab");
        const t = await p.evaluate(() => (document.activeElement?.innerText || "").trim());
        if (/^\s*\d\s*\n?/.test(t) && t.length > 3) { await p.keyboard.press("Enter"); break; }
      }
      await p.waitForTimeout(500);
      const revealed = await p.locator("text=해설").count();
      revealed ? ok("키보드만으로 선지를 고를 수 있다") : no("키보드로 선지를 고르지 못했다");
    }
    await ctx.close();
  }

  console.log("\n[글씨를 키웠을 때 — 브라우저 기본 글씨 200%]");
  {
    // 글씨 크기를 키우면 rem 기준 여백이 함께 늘어 넘치는 곳이 생긴다
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      const st = document.createElement("style");
      st.textContent = "html{font-size:32px !important}";   // 기본 16px → 32px
      document.addEventListener("DOMContentLoaded", () => document.head.appendChild(st));
    });
    for (const r of ["/", "/learn", "/quiz", "/practical", "/review", "/mock", "/settings"]) {
      await p.goto(BASE + r, { waitUntil: "networkidle" }).catch(() => {});
      await p.waitForTimeout(400);
      const over = await p.evaluate(() => {
        const w = document.documentElement.clientWidth;
        const wide = [];
        for (const el of document.querySelectorAll("body *")) {
          const cs = getComputedStyle(el);
          if (cs.overflowX === "auto" || cs.overflowX === "scroll") continue;
          const r2 = el.getBoundingClientRect();
          if (r2.width > w + 1 && r2.height > 0)
            wide.push(el.tagName.toLowerCase() + " " + Math.round(r2.width) + "px");
        }
        return { docWide: document.documentElement.scrollWidth > w + 1, wide: [...new Set(wide)].slice(0, 3) };
      });
      over.docWide
        ? no(`${r} — 글씨를 키우니 가로로 넘친다 ${over.wide.join(", ")}`)
        : ok(`${r} 는 글씨를 키워도 넘치지 않는다`);
    }
    await ctx.close();
  }

  await b.close();
  console.log(bad ? `\n문제 ${bad}건` : "\n✓ 키보드로도 쓸 수 있고 글씨를 키워도 깨지지 않는다");
  process.exit(bad ? 1 : 0);
})();
