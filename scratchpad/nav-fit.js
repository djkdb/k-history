/*
 * 길잡이 막대 글씨를 굵게(600) 올렸다. 글자가 굵어지면 폭도 늘어난다.
 * 좁은 폰에서 탭 이름이 잘리거나 두 줄로 접히지 않는지 본다.
 *
 *   node scratchpad/nav-fit.js
 */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".webp":"image/webp"};
function serve(root, port){ root=path.resolve(root);
  const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
    for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){
      try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
    r.writeHead(404);r.end("x");});
  return new Promise(res=>s.listen(port,()=>res(s)));}

const APPS = [["한국사","out","khlm","/quiz"],["컴활","comhwal/out","comhwal","/learn"],
  ["SQLD","sqld/out","sqld","/quiz"],["토익","toeic/out","toeic","/vocab"],
  ["정보처리기사","gisa/out","gisa","/quiz"]];
const WIDTHS = [320, 360, 390, 430];

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let bad = 0;
  let port = 5900;
  for (const [name, root, key, route] of APPS) {
    const s = await serve(root, port);
    for (const w of WIDTHS) for (const theme of ["dark","light"]) {
      const ctx = await b.newContext({ viewport:{width:w,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
      await ctx.addInitScript(([k,t])=>{try{localStorage.setItem(k+":theme",t);}catch{}},[key,theme]);
      const p = await ctx.newPage();
      await p.goto(`http://127.0.0.1:${port}${route}`, { waitUntil:"networkidle" });
      await p.waitForTimeout(700);
      const r = await p.evaluate(() => {
        const nav = document.querySelector("nav");
        if (!nav) return { none: true };
        const tabs = [...nav.querySelectorAll("a")];
        const out = [];
        for (const a of tabs) {
          // 탭 이름은 링크가 직접 가진 글자 노드이거나 그 안의 span 이다
          const label = [...a.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join("")
            || (a.querySelector("span:not([class*=absolute])")?.textContent || "").trim();
          const rg = document.createRange();
          let lines = 0, clipped = false, txt = label;
          for (const n of a.childNodes) {
            const t = n.nodeType===3 ? n : (n.nodeType===1 && n.tagName==="SPAN" ? n.firstChild : null);
            if (!t || t.nodeType!==3 || !t.textContent.trim()) continue;
            rg.selectNodeContents(t);
            const rects = [...rg.getClientRects()];
            lines = Math.max(lines, rects.length);
            for (const rr of rects) if (rr.right > innerWidth + 0.5 || rr.left < -0.5) clipped = true;
          }
          out.push({ txt, lines, clipped, w: Math.round(a.getBoundingClientRect().width) });
        }
        const nr = nav.getBoundingClientRect();
        return { tabs: out, overflow: nr.right > innerWidth + 0.5 || nr.left < -0.5,
                 scroll: document.scrollingElement.scrollWidth > innerWidth + 0.5 };
      });
      if (r.none) { await ctx.close(); continue; }
      const trouble = r.tabs.filter(t => t.lines > 1 || t.clipped);
      if (trouble.length || r.overflow || r.scroll) {
        bad++;
        console.log(`  ✗ ${name} ${w}px ${theme} — ${r.overflow?"막대 넘침 ":""}${r.scroll?"가로 스크롤 ":""}${trouble.map(t=>`"${t.txt}"(${t.lines}줄${t.clipped?",잘림":""})`).join(" ")}`);
      }
      await ctx.close();
    }
    console.log(`${name} — 폭 ${WIDTHS.join("/")}px × 밝음·어둡 확인`);
    s.close(); port++;
  }
  console.log(bad ? `\n막대 문제 ${bad}건` : "\n✓ 다섯 앱 길잡이 막대 — 어느 폭에서도 접히거나 잘리지 않는다");
  await b.close();
})();
