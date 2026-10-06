/*
 * 다섯 앱 어디서든 5종 홈으로 돌아갈 수 있는가.
 *   SITE=http://... node scratchpad/hub-link-check.js   (기본: out-all 을 7402 에 띄움)
 */
const { chromium, devices } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.env.ROOT || "/home/user/k-history/out-all";
function 찾기(u) { const p = path.join(ROOT, u); const c = u.endsWith("/") ? [path.join(p, "index.html")] : [p, p + ".html", path.join(p, "index.html")]; for (const f of c) { try { if (fs.statSync(f).isFile()) return f; } catch {} } return null; }
const M = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".wasm": "application/wasm", ".webp": "image/webp" };
const srv = http.createServer((q, r) => { const f = 찾기(decodeURIComponent(q.url.split("?")[0])); if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": M[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); });
const SITE = process.env.SITE || "http://127.0.0.1:7402";
let 문제 = 0; const ok = (m) => console.log("  ✓ " + m), no = (m) => { 문제++; console.log("  ✗ " + m); };
(async () => {
  if (!process.env.SITE) await new Promise((r) => srv.listen(7402, r));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", ...(process.env.SITE?.startsWith("https") ? { proxy: { server: process.env.HTTPS_PROXY } } : {}) });
  const ctx = await b.newContext({ ...devices["iPhone SE"] });
  const p = await ctx.newPage();
  const 오류 = []; p.on("pageerror", (e) => 오류.push(String(e).slice(0, 100)));
  for (const app of ["/history", "/comhwal", "/sqld", "/toeic", "/gisa"]) {
    console.log(`\n━━━ ${app}`);
    // 처음 온 사람 — 첫 안내 화면
    await p.goto(SITE + app + "/"); await p.waitForURL(/onboarding/, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(1200);
    for (const 때 of ["첫 안내", "홈"]) {
      if (때 === "홈") {
        // 첫 안내를 끝낸 사람으로 만든다 — 스토어 칸 이름은 앱마다 다르므로 화면으로 넘긴다
        for (let i = 0; i < 10 && p.url().includes("onboarding"); i++) {
          const 잠김 = await p.evaluate(() => [...document.querySelectorAll("button")].some((b) => /^(다음|시작하기)$/.test(b.innerText.trim()) && b.disabled));
          if (잠김) await p.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.offsetParent && !b.disabled && b.innerText.trim().length > 3 && !/^(다음|시작하기|건너뛰기)$/.test(b.innerText.trim()))?.click());
          await p.waitForTimeout(300);
          const 넘김 = p.locator("button").filter({ hasText: /^\s*(다음|시작하기|학습 시작하기.*)\s*$/ });
          const n = await 넘김.count(); let 눌렀다 = false;
          for (let j = 0; j < n; j++) { const e = 넘김.nth(j); if ((await e.isVisible()) && (await e.isEnabled())) { await e.click(); 눌렀다 = true; break; } }
          if (!눌렀다) await p.locator("button", { hasText: "건너뛰기" }).first().click().catch(() => {});
          await p.waitForTimeout(900);
        }
        await p.locator("button", { hasText: /^확인$/ }).first().click({ timeout: 1500 }).catch(() => {});
        await p.waitForTimeout(600);
      }
      const 길 = p.getByRole("link", { name: "자격증 5종 홈" });
      if ((await 길.count()) !== 1) { no(`${때} (${new URL(p.url()).pathname}): "자격증 5종 홈" 이 ${await 길.count()}개`); continue; }
      const 상자 = await 길.boundingBox();
      if (!상자 || 상자.height < 24 || 상자.width < 24) no(`${때}: 누르기 어려울 만큼 작다 ${JSON.stringify(상자)}`);
      if (상자 && 상자.y > 200) no(`${때}: 화면 위쪽이 아니다 (y=${Math.round(상자.y)})`);
      const href = await 길.getAttribute("href");
      if (href !== "/") no(`${때}: 주소가 "/" 가 아니라 ${href}`);
      await p.screenshot({ path: `/home/user/k-history/scratchpad/persona/link${app.replace("/", "-")}-${때}.png` });
      if (때 === "홈") {
        const 전 = new URL(p.url()).pathname;
        await 길.click(); await p.waitForLoadState("load"); await p.waitForTimeout(800);
        const 후 = new URL(p.url()).pathname;
        const 카드 = await p.locator("main a[href$='/']").count();
        if (후 === "/" && 카드 >= 5) ok(`${때} (${전}) → 5종 홈으로 돌아왔다 (카드 ${카드}장)`); else no(`${때}: 눌렀더니 ${후} (카드 ${카드})`);
        // 돌아와서 다시 들어가면 첫 안내가 아니라 하던 데로 간다 — 기록이 그대로라는 뜻
        await p.goto(SITE + app + "/"); await p.waitForTimeout(1500);
        if (p.url().includes("onboarding")) no(`${app}: 홈에 갔다 돌아오니 첫 안내부터 다시 하라고 한다`); else ok(`다시 들어가도 하던 데서 이어진다 (${new URL(p.url()).pathname})`);
      } else ok(`${때}: 위쪽에 있고 "/" 로 간다 (${Math.round(상자.width)}×${Math.round(상자.height)})`);
    }
  }
  // 혼자 배포된 판에서는 숨는가 — 앱 하나를 보통으로 빌드한 out/ 이 있으면 본다
  if (오류.length) no("페이지 오류: " + [...new Set(오류)].join(" | "));
  await b.close(); srv.close();
  console.log(`\n문제 ${문제}건`);
})();
