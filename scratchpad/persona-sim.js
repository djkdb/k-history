/*
 * 링크를 받은 사람들이 실제로 어떻게 쓰게 되는지 따라가 본다.
 *   node scratchpad/persona-sim.js [페르소나 id...]
 * 각자의 폰·브라우저·망으로 zunte.pages.dev 를 열고, 단계마다 화면을 찍고
 * 걸린 시간, 받은 양, 가로로 넘친 곳, 너무 작은 버튼, 오류를 적는다.
 */
const { chromium, devices } = require("/home/user/k-history/node_modules/playwright");
const fs = require("fs");
const SITE = process.env.SITE || "https://zunte.pages.dev";
const OUT = "/home/user/k-history/scratchpad/persona";
const UA = {
  insta_ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22F76 Instagram 390.0.0.27.81 (iPhone14,5; iOS 18_5; ko_KR; ko; scale=3.00; 1170x2532; 731020381)",
  safari_ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  kakao_and: "Mozilla/5.0 (Linux; Android 14; SM-S911N Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.100 Mobile Safari/537.36 KAKAOTALK/10.9.0 (INAPP)",
  chrome_and: "Mozilla/5.0 (Linux; Android 14; SM-A546N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
};
const NET = {
  "4g": { latency: 80, downloadThroughput: (9e6) / 8, uploadThroughput: (3e6) / 8 },
  "느린3g": { latency: 400, downloadThroughput: (400e3) / 8, uploadThroughput: (400e3) / 8 },
  wifi: null,
};
const 사람들 = require("./persona-list.js");

async function 살핌(p) {
  return p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const 넘침 = [...document.querySelectorAll("body *")].filter((e) => {
      const r = e.getBoundingClientRect(); return r.width > 0 && r.right > W + 1 && getComputedStyle(e).position !== "fixed";
    }).slice(0, 3).map((e) => e.tagName + ":" + (e.innerText || "").trim().slice(0, 20));
    const 작은 = [...document.querySelectorAll("button,a,[role=button],input[type=radio],input[type=checkbox]")].filter((e) => {
      const r = e.getBoundingClientRect(); return e.offsetParent && r.width > 0 && (r.width < 24 || r.height < 24);
    }).map((e) => (e.innerText || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 14));
    const 첫화면 = [...document.querySelectorAll("h1,h2,h3,p,button,a,li")].filter((e) => {
      const r = e.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight && r.height > 0 && e.children.length < 4;
    }).map((e) => e.innerText.trim().replace(/\s+/g, " ").slice(0, 50)).filter(Boolean);
    return { url: location.pathname, 넘침, 작은: [...new Set(작은)].slice(0, 6), 첫화면: [...new Set(첫화면)].slice(0, 14), 높이: document.documentElement.scrollHeight, 화면높이: innerHeight };
  });
}

async function 누름(p, 글, { 정확 = false, 필수 = true } = {}) {
  const 후보 = p.locator("button, a, [role=button], label").filter(정확 ? { hasText: new RegExp("^\\s*" + 글 + "\\s*$") } : { hasText: 글 });
  const n = await 후보.count();
  for (let i = 0; i < n; i++) {
    const e = 후보.nth(i);
    if ((await e.isVisible()) && (await e.isEnabled())) {
      const 전 = p.url();
      await e.scrollIntoViewIfNeeded(); await e.click(); await p.waitForTimeout(700);
      // 주소가 바뀌었으면 새 화면에 글이 찰 때까지 기다린다 (곧장 또 넘어가기도 한다)
      if (p.url() !== 전) {
        await p.waitForLoadState("load").catch(() => {});
        await p.waitForFunction(() => (document.querySelector("main") || document.body).innerText.replace(/\s+/g, "").length > 60, null, { timeout: 30000, polling: 100 }).catch(() => {});
        await p.waitForTimeout(1200);
      }
      return true;
    }
  }
  if (필수) throw new Error(`"${글}" 를 누를 곳이 없다`);
  return false;
}

(async () => {
  const 고른 = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", proxy: SITE.startsWith("https") ? { server: process.env.HTTPS_PROXY } : undefined });
  for (const 사람 of 사람들.filter((x) => !고른.length || 고른.includes(x.id))) {
    console.log(`\n━━━━━━━━ ${사람.id} · ${사람.이름} — ${사람.한줄}`);
    const base = devices[사람.기기];
    const ctx = await b.newContext({ ...base, userAgent: UA[사람.ua] || base.userAgent, locale: "ko-KR", colorScheme: 사람.어두움 ? "dark" : "light", serviceWorkers: 사람.워커없음 ? "block" : "allow" });
    const p = await ctx.newPage();
    const 오류 = []; p.on("pageerror", (e) => 오류.push(String(e).slice(0, 100)));
    p.on("response", (r) => { if (r.status() >= 400) 오류.push(r.status() + " " + new URL(r.url()).pathname); });
    let 받은 = 0; p.on("response", async (r) => { try { const h = await r.headerValue("content-length"); 받은 += Number(h || 0); } catch {} });
    const cdp = await ctx.newCDPSession(p);
    await cdp.send("Network.enable");
    if (NET[사람.망]) await cdp.send("Network.emulateNetworkConditions", { offline: false, ...NET[사람.망] });
    if (사람.글씨) await p.addInitScript((z) => { document.addEventListener("DOMContentLoaded", () => { document.documentElement.style.zoom = z; }); }, 사람.글씨);
    let 차례 = 0;
    const 기록 = async (말) => {
      차례++;
      // 뼈대(불러오는 중 상자)만 있는 동안은 아직 쓸 수 없는 화면이다. 글이 찰 때까지 잰다.
      const t0 = Date.now();
      await p.waitForFunction(() => {
        const m = document.querySelector("main") || document.body;
        return m.innerText.replace(/\s+/g, "").length > 60;
      }, null, { timeout: 30000, polling: 100 }).catch(() => {});
      await p.waitForTimeout(300);
      const 기다린 = Date.now() - t0;
      if (기다린 > 1500) console.log(`      ⏳ 내용이 차기까지 ${기다린}ms 더 기다렸다`);
      const s = await 살핌(p);
      const 파일 = `${OUT}/${사람.id}-${String(차례).padStart(2, "0")}.png`;
      await p.screenshot({ path: 파일 });
      console.log(`  [${차례}] ${말} → ${s.url}  (쪽 길이 ${s.높이}/${s.화면높이})`);
      console.log(`      보이는 것: ${s.첫화면.join(" · ")}`);
      if (s.넘침.length) console.log(`      ⚠ 가로로 넘침: ${s.넘침.join(", ")}`);
      if (s.작은.length) console.log(`      ⚠ 24px 보다 작은 버튼: ${s.작은.join(", ")}`);
      return s;
    };
    const 도구 = {
      p, ctx, cdp, 기록, 누름: (t, o) => 누름(p, t, o),
      간다: async (u) => { const t0 = Date.now(); await p.goto(SITE + u, { waitUntil: "load", timeout: 90000 }); await p.waitForTimeout(600); return Date.now() - t0; },
      기다림: async (ms) => p.waitForTimeout(ms),
      끊음: async () => { await ctx.setOffline(true); },
      잇기: async () => { await ctx.setOffline(false); },
      받은양: () => 받은,
      말: (x) => console.log("      " + x),
    };
    try { await 사람.따라가기(도구); }
    catch (e) { console.log("  ✗ 막힘: " + String(e).split("\n")[0].slice(0, 160)); await 기록("막힌 화면").catch(() => {}); }
    if (오류.length) console.log("  ⚠ 오류: " + [...new Set(오류)].slice(0, 6).join(" | "));
    await ctx.close();
  }
  await b.close();
})();
