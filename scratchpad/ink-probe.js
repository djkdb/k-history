/*
 * 한 낱말만 집어서 — 지정 색과 실제로 칠해진 픽셀을 나란히 보고,
 * 채널별 "덮임 비율"(안티에일리어싱이 얼마나 먹었는지)을 거꾸로 뽑는다.
 *
 * 10px 글씨는 획이 한 픽셀보다 얇아서 가장 진한 점조차 온전한 색이 못 된다.
 * 색만 밀어붙이면 끝없이 밀게 되므로, 이 값을 보고 크기·굵기를 손댈지 정한다.
 *
 *   node scratchpad/ink-probe.js <out디렉터리> <포트> <저장키> <경로> <밝음|어둡> <낱말>
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".webp":"image/webp"};
function serve(root, port){ root=path.resolve(root);
  const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
    for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){
      try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
    r.writeHead(404);r.end("x");});
  return new Promise((res)=>s.listen(port,()=>res(s)));}
const lum=([r,g,b])=>{const f=v=>{const c=v/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
const ratio=(a,c)=>{const[x,y]=[lum(a),lum(c)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const px=(img,x,y)=>{const i=(img.width*y+x)<<2;return [img.data[i],img.data[i+1],img.data[i+2]];};

const [root, port, key, route, theme, needle] = process.argv.slice(2);
(async () => {
  const s = await serve(root, Number(port));
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
  await ctx.addInitScript(([k,t]) => { try { localStorage.setItem(k+":theme", t==="밝음"?"light":"dark"); } catch {} }, [key, theme]);
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}${route}`, { waitUntil:"networkidle" });
  await p.waitForTimeout(1500);
  const hits = await p.evaluate((needle) => {
    const own = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      if (!own(el) || !(el.textContent||"").includes(needle)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.top < 0 || r.bottom > 844) continue;
      const cs = getComputedStyle(el);
      out.push({ text:(el.textContent||"").trim().replace(/\s+/g," ").slice(0,40),
        color:cs.color, size:cs.fontSize, weight:cs.fontWeight,
        box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)] });
    }
    return out;
  }, needle);
  const on = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
  await p.addStyleTag({ content:"*{color:transparent !important;text-shadow:none !important;-webkit-text-fill-color:transparent !important}" });
  await p.waitForTimeout(250);
  const off = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
  for (const h of hits) {
    const [bx,by,bw,bh] = h.box;
    const bg = px(off, Math.min(389,bx+(bw>>1)), Math.min(843,by+(bh>>1)));
    let ink=null, far=-1, moved=0;
    for (let y=by; y<Math.min(844,by+bh); y++) for (let x=bx; x<Math.min(390,bx+bw); x++) {
      const i=(on.width*y+x)<<2, j=(off.width*y+x)<<2;
      const d0=Math.abs(on.data[i]-off.data[j])+Math.abs(on.data[i+1]-off.data[j+1])+Math.abs(on.data[i+2]-off.data[j+2]);
      if (d0<12) continue; moved++;
      const q=[on.data[i],on.data[i+1],on.data[i+2]];
      const d=Math.abs(q[0]-bg[0])+Math.abs(q[1]-bg[1])+Math.abs(q[2]-bg[2]);
      if (d>far){far=d;ink=q;}
    }
    const spec = await p.evaluate((c)=>{const v=document.createElement("canvas").getContext("2d");v.fillStyle=c;return v.fillStyle;}, h.color);
    const S = spec.startsWith("#") ? [1,3,5].map(i=>parseInt(spec.slice(i,i+2),16)) : null;
    const cov = (S&&ink) ? S.map((v,i)=>bg[i]===v?1:(bg[i]-ink[i])/(bg[i]-v)) : null;
    console.log(`"${h.text}" ${h.size} w${h.weight}  글자픽셀 ${moved}개`);
    console.log(`  지정 ${spec} ${S?ratio(S,bg).toFixed(2):"?"}:1   실제 ${ink?`[${ink}] ${ratio(ink,bg).toFixed(2)}:1`:"(못 찾음)"}`);
    console.log(`  바탕 [${bg}]  덮임 ${cov?cov.map(c=>c.toFixed(3)).join(" "):"?"}`);
  }
  await b.close(); s.close();
})();
