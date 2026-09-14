/*
 * 10px 라벨을 어떻게 손봐야 "칠해진 픽셀"이 규격을 넘는지, 짐작 말고 시험한다.
 * 색만 밀 것인가 · 굵기를 올릴 것인가 · 한 픽셀 키울 것인가를 나란히 재 본다.
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

const TRIES = [
  { name:"지금 그대로",            css:"" },
  { name:"색만 더 밝게 #a8a8b2",   css:'[data-theme="dark"] .text-zinc-500{color:#a8a8b2 !important}' },
  { name:"색만 더 밝게 #b4b4bd",   css:'[data-theme="dark"] .text-zinc-500{color:#b4b4bd !important}' },
  { name:"굵기 600",              css:'nav span{font-weight:600 !important}' },
  { name:"11px",                  css:'nav span{font-size:11px !important}' },
  { name:"11px + 굵기 600",        css:'nav span{font-size:11px !important;font-weight:600 !important}' },
];
(async () => {
  const s = await serve("out", 5822);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const t of TRIES) {
    const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
    await ctx.addInitScript(() => { try { localStorage.setItem("khlm:theme","dark"); } catch {} });
    const p = await ctx.newPage();
    await p.goto("http://127.0.0.1:5822/quiz", { waitUntil:"networkidle" });
    await p.waitForTimeout(1200);
    if (t.css) await p.addStyleTag({ content: t.css });
    await p.waitForTimeout(300);
    const h = await p.evaluate(() => {
      const own=(el)=>[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
      for (const el of document.querySelectorAll("nav *")) {
        if (!own(el) || !(el.textContent||"").includes("기출")) continue;
        const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        const cv = document.createElement("canvas").getContext("2d"); cv.fillStyle = cs.color;
        return { spec:cv.fillStyle, size:cs.fontSize, weight:cs.fontWeight,
          box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)] };
      }
      return null;
    });
    const on = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
    await p.addStyleTag({ content:"*{color:transparent !important;-webkit-text-fill-color:transparent !important;text-shadow:none !important}" });
    await p.waitForTimeout(250);
    const off = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
    const [bx,by,bw,bh]=h.box;
    const bg = px(off, bx+(bw>>1), by+(bh>>1));
    let ink=null, far=-1, n=0;
    for (let y=by;y<Math.min(844,by+bh);y++) for (let x=bx;x<Math.min(390,bx+bw);x++){
      const i=(on.width*y+x)<<2, j=(off.width*y+x)<<2;
      const d0=Math.abs(on.data[i]-off.data[j])+Math.abs(on.data[i+1]-off.data[j+1])+Math.abs(on.data[i+2]-off.data[j+2]);
      if(d0<12)continue; n++;
      const q=[on.data[i],on.data[i+1],on.data[i+2]];
      const d=Math.abs(q[0]-bg[0])+Math.abs(q[1]-bg[1])+Math.abs(q[2]-bg[2]);
      if(d>far){far=d;ink=q;}
    }
    const S=[1,3,5].map(i=>parseInt(h.spec.slice(i,i+2),16));
    const cov=S.map((v,i)=>(bg[i]-ink[i])/(bg[i]-v));
    console.log(`${t.name.padEnd(18)} ${h.size} w${h.weight} ${h.spec}  지정 ${ratio(S,bg).toFixed(2)}  실제 ${ratio(ink,bg).toFixed(2)}  덮임 ${(cov.reduce((a,c)=>a+c,0)/3).toFixed(3)}  글자픽셀 ${n}`);
    await ctx.close();
  }
  await b.close(); s.close();
})();
