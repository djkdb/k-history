/*
 * 망을 끊고도 쓸 수 있는가.
 *
 * "설치하면 오프라인에서도 됩니다" 는 말은 쉽지만, 서비스 워커는
 * network-first 이고 미리 받아 두는 것은 홈과 글꼴뿐이다. 나머지는 한 번
 * 열어 본 뒤에야 캐시에 남는다. 그렇다면 실제로는 어디까지 되는가 —
 * 끊어 놓고 걸어 봐야 안다.
 *
 * 세 가지를 본다.
 *   ① 홈만 열어 보고 끊었을 때, 다른 화면으로 갈 수 있는가
 *   ② 여러 화면을 둘러본 뒤 끊었을 때, 그 화면들은 되는가
 *   ③ 끊긴 채로 앱을 다시 켰을 때, 무엇이 뜨는가
 *
 *   node scratchpad/offline-check.js
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",
  ".txt":"text/plain",".mp3":"audio/mpeg",".webp":"image/webp" };
function serve(root, port) {
  root = path.resolve(root);
  const s = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    for (const f of [root+u+".html", root+u, root+path.join(u,"index.html"), root+"/404.html"]) {
      try { if (fs.statSync(f).isFile()) {
        r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream",
                           "service-worker-allowed": "/" });
        return r.end(fs.readFileSync(f)); } } catch {}
    }
    r.writeHead(404); r.end("x");
  });
  return new Promise((res) => s.listen(port, () => res(s)));
}

/*
 * 앱마다 [이름, out 자리, 저장소 접두사, 걸어 볼 화면, 미리 심을 기록]
 *
 * ⚠️ 설정을 심지 않으면 /settings 가 첫 화면(onboarding)으로 되돌려보낸다.
 *    그것을 오프라인 실패로 세면 없는 문제를 쫓게 된다 — 실제로 두 번
 *    그랬다. 이미 시작한 사람으로 두고 잰다.
 */
const APPS = [
  ["한국사", "out", "khlm", ["/learn", "/quiz", "/flow"], null],
  ["컴활", "comhwal/out", "comhwal", ["/learn", "/quiz", "/settings"],
    { key: "comhwal-state", state: { settings: { grade: 1, kind: "written", examDate: null } } }],
  ["SQLD", "sqld/out", "sqld", ["/learn", "/quiz", "/settings"],
    { key: "sqld-state", state: { settings: { examDate: null } } }],
  ["토익", "toeic/out", "toeic", ["/vocab", "/grammar", "/settings"], null],
  ["정처기", "gisa/out", "gisa", ["/learn", "/quiz", "/stats"],
    { key: "gisa-state", state: { settings: { track: "written", examDate: null } } }],
];

let 탈 = 0;
const ok = (s) => console.log("    ✓ " + s);
const no = (s) => { 탈++; console.log("    ✗ " + s); };

/** 화면이 제구실을 하는가 — 글이 있고, 오류 화면이 아니고 */
/** 글씨만 있는 것이 아니라 꾸밈까지 입혀졌는가 */
async function 꾸며졌나(p) {
  return p
    .evaluate(() => {
      const 판 = getComputedStyle(document.body).backgroundColor;
      const 시트 = document.styleSheets.length;
      /* 규칙이 실제로 들어왔는지까지 본다 — 빈 시트는 안 입힌 것과 같다 */
      let 규칙 = 0;
      for (const s of document.styleSheets) {
        try { 규칙 += s.cssRules.length; } catch {}
      }
      return { 판, 시트, 규칙 };
    })
    .catch(() => ({ 판: "?", 시트: 0, 규칙: 0 }));
}

async function 살아있나(p) {
  const r = await p
    .evaluate(() => ({
      글: (document.body.innerText || "").trim(),
      길: location.pathname,
    }))
    .catch(() => ({ 글: "", 길: "?" }));
  return {
    글자수: r.글.length,
    앞: r.글.slice(0, 40).replace(/\n/g, " "),
    길: r.길.replace(/\/$/, "") || "/",
  };
}

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let port = 5800;
  for (const [이름, root, pre, 길들, 씨앗] of APPS) {
    if (!fs.existsSync(root)) { console.log(`${이름}: out 없음`); continue; }
    const srv = await serve(root, port);
    const BASE = `http://127.0.0.1:${port}`;
    console.log(`\n━━━ ${이름} ━━━`);

    /* ── ① 홈만 보고 끊기 ── */
    {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "allow" });
      if (씨앗)
        await ctx.addInitScript(([p, s]) => {
          try { localStorage.setItem(p + ":mirror:" + s.key, JSON.stringify({ state: s.state })); } catch {}
        }, [pre, 씨앗]);
      const p = await ctx.newPage();
      await p.goto(BASE + "/", { waitUntil: "networkidle" });
      await p.waitForTimeout(2500); // 서비스 워커가 자리 잡을 틈
      const 등록 = await p.evaluate(async () => {
        const r = await navigator.serviceWorker.getRegistration();
        return !!(r && (r.active || r.installing || r.waiting));
      });
      if (등록) ok("서비스 워커가 자리를 잡는다");
      else { no("서비스 워커가 없다 — 오프라인은 통째로 안 된다"); await ctx.close(); srv.close(); port++; continue; }

      await ctx.setOffline(true);
      await p.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
      await p.waitForTimeout(1200);
      const 홈 = await 살아있나(p);
      if (홈.글자수 > 50) ok(`끊긴 채 홈이 뜬다 (${홈.글자수}자) — "${홈.앞}"`);
      else no(`끊으니 홈이 비었다 (${홈.글자수}자)`);
      /* 글씨만 있고 꾸밈이 없으면 "열린다" 고 말할 수 없다 */
      const 꾸 = await 꾸며졌나(p);
      if (꾸.규칙 > 100) ok(`꾸밈까지 입혀진다 (규칙 ${꾸.규칙}개 · 바탕 ${꾸.판})`);
      else no(`꾸밈이 안 입혀졌다 (시트 ${꾸.시트}개 · 규칙 ${꾸.규칙}개)`);

      /* 한 번도 안 가 본 화면으로 가 본다 */
      const 길 = 길들[0];
      await p.goto(BASE + 길, { waitUntil: "domcontentloaded" }).catch(() => {});
      await p.waitForTimeout(1200);
      const 새길 = await 살아있나(p);
      if (새길.길 === 길 && 새길.글자수 > 50)
        ok(`안 가 본 ${길} 도 열린다 (${새길.글자수}자)`);
      else if (새길.글자수 > 50)
        console.log(`    · 안 가 본 ${길} 는 홈으로 돌아간다 (${새길.길}) — 빈 화면은 아니다`);
      else no(`안 가 본 ${길} 에서 빈 화면 (${새길.글자수}자)`);
      await ctx.close();
    }

    /* ── ② 둘러본 뒤 끊기 ── */
    {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "allow" });
      if (씨앗)
        await ctx.addInitScript(([p, s]) => {
          try { localStorage.setItem(p + ":mirror:" + s.key, JSON.stringify({ state: s.state })); } catch {}
        }, [pre, 씨앗]);
      const p = await ctx.newPage();
      await p.goto(BASE + "/", { waitUntil: "networkidle" });
      await p.waitForTimeout(2200);
      for (const 길 of 길들) {
        await p.goto(BASE + 길, { waitUntil: "networkidle" }).catch(() => {});
        await p.waitForTimeout(500);
      }
      await ctx.setOffline(true);
      let 된길 = 0;
      for (const 길 of 길들) {
        await p.goto(BASE + 길, { waitUntil: "domcontentloaded" }).catch(() => {});
        await p.waitForTimeout(900);
        const s = await 살아있나(p);
        if (s.길 === 길 && s.글자수 > 50) 된길++;
        else console.log(`    · ${길} → ${s.길} (${s.글자수}자)`);
      }
      if (된길 === 길들.length) ok(`둘러본 ${길들.length}개 화면 모두 끊긴 채로 열린다`);
      else no(`둘러본 ${길들.length}개 중 ${된길}개만 열린다`);
      await ctx.close();
    }

    /* ── ③ 끊긴 채로 앱을 다시 켜기 (새 탭) ── */
    {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "allow" });
      if (씨앗)
        await ctx.addInitScript(([p, s]) => {
          try { localStorage.setItem(p + ":mirror:" + s.key, JSON.stringify({ state: s.state })); } catch {}
        }, [pre, 씨앗]);
      const p = await ctx.newPage();
      await p.goto(BASE + "/", { waitUntil: "networkidle" });
      await p.waitForTimeout(2200);
      for (const 길 of 길들) { await p.goto(BASE + 길, { waitUntil: "networkidle" }).catch(()=>{}); await p.waitForTimeout(400); }
      await ctx.setOffline(true);
      const p2 = await ctx.newPage();
      await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" }).catch(() => {});
      await p2.waitForTimeout(1500);
      const s = await 살아있나(p2);
      if (s.글자수 > 50) ok(`끊긴 채 새로 켜도 홈이 뜬다 (${s.글자수}자)`);
      else no(`끊긴 채 새로 켜면 빈 화면 (${s.글자수}자)`);
      await ctx.close();
    }

    srv.close(); port++;
  }
  await b.close();
  console.log(탈 ? `\n문제 ${탈}건` : "\n문제 0건");
  process.exit(탈 ? 1 : 0);
})();
