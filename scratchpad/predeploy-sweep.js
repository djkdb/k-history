// 배포 직전 전수조사 — out/ 에 실제로 나가는 모든 화면을 하나씩 연다.
// 잡는 것: 콘솔 오류 · 페이지 예외 · 실패한 요청 · 가로 넘침 ·
//          너무 작은 탭 타깃(WCAG 2.5.8 의 24×24 기준, 넓혀 둔 누름 범위까지 포함해서 잰다)
//          · 화면에 새어 나온 undefined/NaN/[object Object]
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = require("path").resolve(process.argv[2]); // "." 이 든 경로도 길이가 맞게
const port = Number(process.argv[3] || 4400);
const W = Number(process.argv[4] || 390);

// Cloudflare Pages 처럼 .html 을 먼저 본다 (http-server 는 폴더를 먼저 봐서 다르다)
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png",
  ".woff2":"font/woff2", ".wasm":"application/wasm", ".webp":"image/webp",
  ".ico":"image/x-icon", ".mp3":"audio/mpeg", ".txt":"text/plain" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const tries = [root + url + ".html", root + url,
                 root + path.join(url, "index.html"), root + "/404.html"];
  for (const f of tries) {
    try {
      if (fs.statSync(f).isFile()) {
        res.writeHead(f.endsWith("404.html") ? 404 : 200,
          { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
        return res.end(fs.readFileSync(f));
      }
    } catch {}
  }
  res.writeHead(404); res.end("nope");
});

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

// 잡음: 브라우저가 늘 내는 것, 정책상 막히는 것
const NOISE = [
  /favicon\.ico/, /Download the React DevTools/, /\[Fast Refresh\]/,
  /Failed to load resource.*404.*favicon/, /webkit/i,
  /speechSynthesis|SpeechSynthesis|AudioContext was not allowed/,
  /ResizeObserver loop/, /Manifest:/,
];
const noisy = (t) => NOISE.some((r) => r.test(t));

(async () => {
  await new Promise((r) => server.listen(port, r));
  const pages = walk(root)
    .filter((f) => f.endsWith(".html") && !/\/404\.html$/.test(f))
    .map((f) => f.slice(root.length).replace(/\/index\.html$/, "/").replace(/\.html$/, ""))
    .map((u) => (u === "" ? "/" : u))
    .sort();

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const bad = [];
  const note = (route, kind, detail) => bad.push({ route, kind, detail });

  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({
      viewport: { width: W, height: 844 },
      deviceScaleFactor: 2, isMobile: true, hasTouch: true,
      colorScheme: theme,
    });
    for (const route of pages) {
      const page = await ctx.newPage();
      const seen = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !noisy(m.text())) seen.push("콘솔: " + m.text().slice(0, 160));
      });
      page.on("pageerror", (e) => { if (!noisy(String(e))) seen.push("예외: " + String(e).slice(0, 160)); });
      page.on("requestfailed", (r) => {
        const t = r.url() + " " + (r.failure()?.errorText || "");
        if (!noisy(t)) seen.push("요청실패: " + t.slice(0, 160));
      });
      page.on("response", (r) => {
        if (r.status() >= 400 && !noisy(r.url())) seen.push(`${r.status()}: ${r.url().slice(-70)}`);
      });
      try {
        await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle", timeout: 25000 });
      } catch (e) {
        note(route, theme, "열리지 않음 " + String(e).slice(0, 90));
        await page.close(); continue;
      }
      await page.waitForTimeout(450);

      const r = await page.evaluate(() => {
        const out = { over: 0, blank: false, leaks: [], small: [] };
        const de = document.scrollingElement || document.documentElement;
        out.over = de.scrollWidth - de.clientWidth;
        const body = (document.body.innerText || "").trim();
        out.blank = body.length < 12;
        // 화면에 새어 나온 값
        for (const m of body.matchAll(/\b(undefined|NaN|\[object Object\]|Infinity)\b/g))
          out.leaks.push(body.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, " "));
        // 탭 타깃 — 보이는 것만
        for (const el of document.querySelectorAll(
          'button,a[href],[role="button"],input,select,summary,[tabindex]:not([tabindex="-1"])')) {
          const b = el.getBoundingClientRect();
          const st = getComputedStyle(el);
          if (b.width === 0 || b.height === 0) continue;
          if (st.visibility === "hidden" || st.display === "none" || st.opacity === "0") continue;
          if (el.closest('[aria-hidden="true"]')) continue;
          // 버튼을 감싼 <a> 는 줄높이만큼만 잡힌다. 실제로 눌리는 것은 안쪽
          // 버튼이므로 감싸기만 하는 것은 세지 않는다.
          if (el.querySelector('button,a[href],[role="button"],input,select')) continue;
          if (b.height < 30 || b.width < 30) {
            // 보이는 상자가 작아도 before/after 로 누를 범위를 넓혀 둔 것이
            // 있다. getBoundingClientRect 로는 그게 안 보이므로, 상자
            // 밖에서 무엇이 눌리는지를 실제로 물어 실효 크기를 잰다.
            const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
            const reaches = (dx, dy) => {
              const t = document.elementFromPoint(cx + dx, cy + dy);
              return !!t && (t === el || el.contains(t) || t.parentElement === el);
            };
            let padX = 0, padY = 0;
            for (const d of [4, 8, 12, 16]) { if (reaches(-(b.width / 2 + d), 0) && reaches(b.width / 2 + d, 0)) padX = d; else break; }
            for (const d of [4, 8, 12, 16]) { if (reaches(0, -(b.height / 2 + d)) && reaches(0, b.height / 2 + d)) padY = d; else break; }
            const w = b.width + padX * 2, h = b.height + padY * 2;
            if (h < 24 || w < 24) {
              const lbl = (el.getAttribute("aria-label") || el.innerText || el.tagName)
                .trim().replace(/\s+/g, " ").slice(0, 26);
              const seen = padX || padY ? ` (보이는 크기 ${Math.round(b.width)}×${Math.round(b.height)})` : "";
              out.small.push(`${lbl} ${Math.round(w)}×${Math.round(h)}${seen}`);
            }
          }
        }
        return out;
      });

      if (r.blank) note(route, theme, "빈 화면");
      if (r.over > 2) note(route, theme, `가로 넘침 ${r.over}px`);
      for (const l of new Set(r.leaks)) note(route, theme, "값 노출: " + l);
      for (const s of new Set(r.small)) note(route, theme, "작은 버튼: " + s);
      for (const s of new Set(seen)) note(route, theme, s);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  server.close();

  console.log(`화면 ${pages.length}개 × 밝은/어두운 = ${pages.length * 2}회 확인`);
  if (!bad.length) { console.log("\n문제 0건"); return; }
  const by = new Map();
  for (const b of bad) {
    const k = b.route;
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(`[${b.kind}] ${b.detail}`);
  }
  console.log(`\n문제 ${bad.length}건 / 화면 ${by.size}개\n`);
  for (const [route, list] of by)
    console.log(route + "\n  " + [...new Set(list)].join("\n  ") + "\n");
})();
