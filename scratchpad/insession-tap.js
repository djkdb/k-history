// 풀고 있는 중의 화면은 그냥 열어서는 안 보인다 (복습 세션·퀴즈 세션).
// 저장본을 심고 실제로 들어가서 그 안의 누르는 자리를 잰다.
const { chromium } = require("playwright");
const fs = require("fs");
const APP = process.argv[2], BASE = process.argv[3], KEY = process.argv[4], SEED = process.argv[5];

const MEASURE = () => {
  const out = [];
  for (const el of document.querySelectorAll(
    'button,a[href],[role="button"],input,select,summary,[tabindex]:not([tabindex="-1"])')) {
    const b = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    if (!b.width || !b.height) continue;
    if (st.visibility === "hidden" || st.display === "none" || st.opacity === "0") continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (el.querySelector('button,a[href],[role="button"],input,select')) continue;
    if (b.height >= 30 && b.width >= 30) continue;
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const reaches = (dx, dy) => {
      const t = document.elementFromPoint(cx + dx, cy + dy);
      return !!t && (t === el || el.contains(t) || t.parentElement === el);
    };
    let px = 0, py = 0;
    for (const d of [4, 8, 12, 16]) { if (reaches(-(b.width/2+d),0) && reaches(b.width/2+d,0)) px = d; else break; }
    for (const d of [4, 8, 12, 16]) { if (reaches(0,-(b.height/2+d)) && reaches(0,b.height/2+d)) py = d; else break; }
    const w = b.width + px*2, h = b.height + py*2;
    if (h < 24 || w < 24) {
      const lbl = (el.getAttribute("aria-label") || el.innerText || el.tagName).trim().replace(/\s+/g," ").slice(0,30);
      out.push(`${lbl} ${Math.round(w)}×${Math.round(h)}`);
    }
  }
  return [...new Set(out)];
};

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const saved = JSON.parse(fs.readFileSync(SEED, "utf8"));
  const now = Date.now();
  saved.state.reviewCards = (saved.state.reviewCards ?? []).map((c) => ({ ...c, nextDueAt: now - 60000 }));
  await ctx.addInitScript(([k, v]) => { try {
    if (localStorage.getItem("__s__")) return;
    localStorage.setItem("__s__", "1"); localStorage.setItem(k, v);
  } catch {} }, [KEY, JSON.stringify(saved)]);
  const p = await ctx.newPage();
  const hit = (re) => p.evaluate((s) => {
    const rx = new RegExp(s);
    const el = [...document.querySelectorAll("button")].find((x) => !x.disabled && rx.test((x.innerText||"").replace(/\s+/g," ")));
    if (!el) return false; el.click(); return true;
  }, re);

  const found = [];
  // ── 복습 세션 안 ──
  await p.goto(BASE + "/review", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  if (await hit("복습 시작")) {
    await p.waitForTimeout(700);
    for (const s of await p.evaluate(MEASURE)) found.push("복습(앞면) " + s);
    await hit("답 보기|탭해서 확인");
    await p.waitForTimeout(500);
    for (const s of await p.evaluate(MEASURE)) found.push("복습(뒷면) " + s);
  } else found.push("! 복습을 시작하지 못했다");

  // ── 퀴즈 세션 안 ──
  await p.goto(BASE + "/quiz", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  if (await hit("퀴즈 시작|시작하기")) {
    await p.waitForTimeout(900);
    for (const s of await p.evaluate(MEASURE)) found.push("퀴즈(푸는 중) " + s);
    // 하나 골라서 해설 화면까지
    await p.evaluate(() => {
      const i = [...document.querySelectorAll("button")].findIndex((x) => {
        const n = x.querySelector("span"); return n && /^[1-4]$/.test(n.textContent.trim());
      });
      if (i >= 0) document.querySelectorAll("button")[i].click();
      else { const o = [...document.querySelectorAll("button")].find((x) => /^[OX]$/.test(x.innerText.trim())); if (o) o.click(); }
    });
    await p.waitForTimeout(700);
    for (const s of await p.evaluate(MEASURE)) found.push("퀴즈(해설) " + s);
  }

  console.log(`════ ${APP}`);
  const u = [...new Set(found)];
  if (!u.length) console.log("  풀고 있는 중 화면에도 작은 자리 없음");
  else u.forEach((s) => console.log("  · " + s));
  await b.close();
})();
