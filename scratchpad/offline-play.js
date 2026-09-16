/*
 * 망을 끊고 실제로 공부가 되는가.
 *
 * 화면이 뜨는 것과 쓸 수 있는 것은 다르다. 끊어 놓고 문제를 풀어 채점까지
 * 받고, 껐다 켰을 때 그 기록이 남아 있는지 본다. 지하철에서 쓰는 사람에게
 * 이것이 안 되면 "오프라인에서 됩니다" 는 빈말이다.
 *
 *   node scratchpad/offline-play.js
 */
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",
  ".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp" };
function serve(root, port) {
  root = path.resolve(root);
  const s = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    for (const f of [root+u+".html", root+u, root+path.join(u,"index.html"), root+"/404.html"]) {
      try { if (fs.statSync(f).isFile()) {
        r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
        return r.end(fs.readFileSync(f)); } } catch {}
    }
    r.writeHead(404); r.end("x");
  });
  return new Promise((res) => s.listen(port, () => res(s)));
}
let 탈 = 0;
const ok = (s) => console.log("    ✓ " + s);
const no = (s) => { 탈++; console.log("    ✗ " + s); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const srv = await serve("gisa/out", 5950);
  const BASE = "http://127.0.0.1:5950";
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "allow" });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({
        state: { settings: { track: "written", examDate: null } },
      }));
    } catch {}
  });
  const p = await ctx.newPage();

  console.log("\n━━━ 망이 있을 때 한 번 열어 둔다");
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  const 담긴 = await p.evaluate(async () => {
    const ks = await caches.keys();
    let n = 0;
    for (const k of ks) n += (await (await caches.open(k)).keys()).length;
    return n;
  });
  if (담긴 > 200) ok(`미리 받아 둔 것 ${담긴}개`);
  else no(`미리 받아 둔 것이 ${담긴}개뿐이다`);

  console.log("\n━━━ 이제 망을 끊는다");
  await ctx.setOffline(true);
  const 실패 = [];
  p.on("requestfailed", (r) => 실패.push(new URL(r.url()).pathname));

  await p.goto(BASE + "/quiz", { waitUntil: "domcontentloaded" }).catch(() => {});
  await p.waitForTimeout(1500);
  let t = (await p.locator("main").innerText().catch(() => "")).replace(/\s+/g, " ");
  if (/문항 수|고를 수 있는 문항/.test(t)) ok("문제 고르는 화면이 열린다");
  else { no("문제 화면이 안 열린다: " + t.slice(0, 120)); }

  const 시작 = p.locator("button", { hasText: /문항 시작/ }).first();
  if (await 시작.count()) {
    await 시작.click();
    await p.waitForTimeout(1200);
    t = await p.locator("main").innerText().catch(() => "");
    if (t.length > 80) ok("문제가 나온다");
    else no("문제가 안 나온다");

    /* 선지 하나를 누른다 */
    const 선지 = await p.locator("main button").all();
    let 눌렀 = false;
    for (const btn of 선지) {
      const s = (await btn.innerText()).trim();
      if (!s || s.length < 4 || /시작|다음|채점|그만|홈/.test(s)) continue;
      await btn.click(); 눌렀 = true; break;
    }
    await p.waitForTimeout(900);
    t = (await p.locator("main").innerText().catch(() => "")).replace(/\s+/g, " ");
    if (눌렀 && /정답|해설|맞|틀/.test(t)) ok("끊긴 채로 채점까지 된다");
    else no("채점이 안 된다: " + t.slice(0, 140));
  } else no("시작 단추가 없다");

  console.log("\n━━━ 끊긴 채로 껐다 켠다");
  const 전 = await p.evaluate(() => {
    try { return JSON.parse(localStorage.getItem("gisa:mirror:gisa-state") || "{}").state; }
    catch { return null; }
  });
  const p2 = await ctx.newPage();
  await p2.goto(BASE + "/stats", { waitUntil: "domcontentloaded" }).catch(() => {});
  await p2.waitForTimeout(1500);
  const 후 = (await p2.locator("main").innerText().catch(() => "")).replace(/\s+/g, " ");
  if (/공부 기록/.test(후)) ok("새로 켜도 기록 화면이 열린다");
  else no("새로 켜니 안 열린다: " + 후.slice(0, 120));
  const xp = 전?.stats?.xp ?? 0;
  if (xp > 0) ok(`푼 것이 기록에 남았다 (경험치 ${xp})`);
  else no("푼 것이 기록에 남지 않았다");

  if (실패.length) console.log(`    · 못 받아 온 것 ${실패.length}개: ${[...new Set(실패)].slice(0, 5).join(" ")}`);
  else ok("끊긴 동안 못 받아 온 것 없음");

  await b.close(); srv.close();
  console.log(탈 ? `\n문제 ${탈}건` : "\n문제 0건");
  process.exit(탈 ? 1 : 0);
})();
