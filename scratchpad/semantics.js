/*
 * 화면을 읽어 주는 기기로 쓸 때 말이 되는가 — 전수조사.
 *
 * 눈으로 보면 멀쩡한데 소리로 들으면 무너지는 것들을 찾는다.
 *   ① 화면의 제목(h1)이 없다 → "여기가 어디인지" 를 말해 줄 것이 없다
 *   ② 제목 단계를 건너뛴다(h1 다음에 h3) → 목차가 어긋난다
 *   ③ 글자 없는 단추·링크에 이름이 없다 → "단추" 라고만 들린다
 *   ④ 입력칸에 딸린 이름이 없다 → 무엇을 넣으라는지 알 수 없다
 *   ⑤ 그림에 alt 가 없다
 *   ⑥ 길잡이 막대가 둘 이상인데 서로 구별되지 않는다
 *
 *   node scratchpad/semantics.js
 */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
function serve(root, port){ root=path.resolve(root);
  const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
    for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){
      try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
    r.writeHead(404);r.end("x");});
  return new Promise(res=>s.listen(port,()=>res(s)));}

const APPS = [["한국사","out","khlm"],["컴활","comhwal/out","comhwal"],
  ["SQLD","sqld/out","sqld"],["토익","toeic/out","toeic"],["정보처리기사","gisa/out","gisa"]];

/** out/ 에 실제로 나간 화면. 같은 틀을 쓰는 상세 화면은 셋만 본다. */
function routesOf(root) {
  const R = path.resolve(root);
  const walk = (d) => fs.readdirSync(d, { withFileTypes:true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const all = walk(R).filter(f => f.endsWith(".html") && !f.includes("/_next/"))
    .map(f => "/" + path.relative(R, f).replace(/\.html$/,"").replace(/\/?index$/,""))
    .map(r => r === "" ? "/" : r);
  const seen = new Map(), out = [];
  for (const r of all) {
    const seg = r.split("/").filter(Boolean);
    if (seg.length >= 2) { const n = (seen.get(seg[0]) ?? 0) + 1; seen.set(seg[0], n); if (n <= 3) out.push(r); }
    else out.push(r);
  }
  return out;
}

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let port = 5960, bad = 0, screens = 0;
  for (const [name, root, key] of APPS) {
    const s = await serve(root, port);
    const routes = routesOf(root);
    console.log(`\n━━━ ${name} — 화면 ${routes.length}개`);
    const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
    await ctx.addInitScript((k)=>{try{localStorage.setItem(k+":theme","dark");}catch{}},key);
    const p = await ctx.newPage();
    const seen = new Set();
    for (const r of routes) {
      await p.goto(`http://127.0.0.1:${port}${r}`, { waitUntil:"networkidle" }).catch(()=>{});
      await p.waitForTimeout(350);
      const got = await p.evaluate(() => {
        const vis = (el) => { const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
        const nameOf = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") ||
          (el.getAttribute("aria-labelledby") ? (document.getElementById(el.getAttribute("aria-labelledby"))?.textContent||"") : "") ||
          (el.innerText||"").trim() ||
          [...el.querySelectorAll("img[alt],svg title")].map(n=>n.getAttribute("alt")||n.textContent||"").join("")).trim();
        const out = [];
        const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(vis);
        if (!hs.some(h => h.tagName === "H1")) out.push("화면 제목(h1)이 없다");
        let prev = 0;
        for (const h of hs) { const lv = +h.tagName[1];
          if (prev && lv > prev + 1) out.push(`제목 단계 건너뜀 h${prev}→h${lv} "${(h.innerText||"").trim().slice(0,16)}"`);
          prev = lv; }
        for (const el of document.querySelectorAll("button,a[href],[role=button]")) {
          if (!vis(el)) continue;
          if (!nameOf(el)) out.push(`이름 없는 ${el.tagName === "A" ? "링크" : "단추"} <${el.tagName.toLowerCase()} class="${(el.className||"").toString().slice(0,30)}">`);
        }
        for (const el of document.querySelectorAll("input,select,textarea")) {
          if (!vis(el) || el.type === "hidden") continue;
          const lab = el.labels && el.labels.length ? el.labels[0].textContent.trim() : "";
          if (!lab && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.getAttribute("title"))
            out.push(`이름 없는 입력칸 <${el.tagName.toLowerCase()} type="${el.type||""}">`);
        }
        for (const im of document.querySelectorAll("img")) {
          if (!im.hasAttribute("alt")) out.push(`alt 없는 그림 ${im.getAttribute("src")||""}`);
        }
        const navs = [...document.querySelectorAll("nav")].filter(vis);
        if (navs.length > 1 && navs.some(n => !n.getAttribute("aria-label")))
          out.push(`길잡이 막대가 ${navs.length}개인데 이름이 없다`);
        return out;
      });
      screens++;
      for (const m of got) {
        const k = name + m;
        if (seen.has(k)) continue;
        seen.add(k); bad++;
        console.log(`  ✗ ${m} — ${r}`);
      }
    }
    await ctx.close(); s.close(); port++;
  }
  console.log(`\n다섯 앱 화면 ${screens}개를 읽어 보았다`);
  console.log(bad ? `말이 어긋나는 곳 ${bad}가지` : "✓ 소리로 들어도 말이 된다");
  await b.close();
})();
