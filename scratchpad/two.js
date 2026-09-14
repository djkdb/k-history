// 남은 두 곳만 콕 집어서 — 지정색과 실제 칠해진 픽셀을 나란히 본다.
// 글자만 있는 칸이 아니라 아이콘이 섞인 단추도 봐야 하므로, 자식이 있어도
// 제 텍스트 노드를 직접 가진 요소면 센다.
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

const CASES = [
  { app:"한국사", root:"out", port:5811, key:"khlm", route:"/quiz", theme:"light", needle:"퀴즈 시작" },
  { app:"컴활", root:"comhwal/out", port:5812, key:"comhwal", route:"/cram", theme:"light", needle:"컴일", first:1 },
];

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const c of CASES) {
    const s = await serve(c.root, c.port);
    const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
    await ctx.addInitScript(([k,t]) => { try { localStorage.setItem(k+":theme", t); } catch {} }, [c.key, c.theme]);
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${c.port}${c.route}`, { waitUntil:"networkidle" });
    await p.waitForTimeout(1500);
    let hits = await p.evaluate((needle) => {
      const own = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const out = [];
      for (const el of document.querySelectorAll("*")) {
        if (!own(el)) continue;
        if (!(el.textContent || "").includes(needle)) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const cs = getComputedStyle(el);
        out.push({ text:(el.textContent||"").trim().replace(/\s+/g," ").slice(0,40), color:cs.color,
          size:cs.fontSize, weight:cs.fontWeight,
          box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)] });
      }
      return out;
    }, c.needle);
    if (c.first) hits = hits.slice(0, c.first);
    hits = hits.filter((h) => h.box[1] >= 0 && h.box[1] + h.box[3] <= 844);
    const shotOn = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
    await p.addStyleTag({ content:"*{color:transparent !important;text-shadow:none !important;-webkit-text-fill-color:transparent !important}" });
    await p.waitForTimeout(250);
    const shotOff = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
    console.log(`\n━━━ ${c.app} ${c.route} [${c.theme}] — "${c.needle}" (화면 안 ${hits.length}곳)`);
    for (const h of hits) {
      const [bx,by,bw,bh] = h.box;
      const bg = px(shotOff, Math.min(389,bx+(bw>>1)), Math.min(843,by+(bh>>1)));
      let ink=null, far=-1;
      for (let y=Math.max(0,by); y<Math.min(844,by+bh); y++)
        for (let x=Math.max(0,bx); x<Math.min(390,bx+bw); x++) {
          const i=(shotOn.width*y+x)<<2, j=(shotOff.width*y+x)<<2;
          const moved=Math.abs(shotOn.data[i]-shotOff.data[j])+Math.abs(shotOn.data[i+1]-shotOff.data[j+1])+Math.abs(shotOn.data[i+2]-shotOff.data[j+2]);
          if (moved<12) continue;
          const q=[shotOn.data[i],shotOn.data[i+1],shotOn.data[i+2]];
          const d=Math.abs(q[0]-bg[0])+Math.abs(q[1]-bg[1])+Math.abs(q[2]-bg[2]);
          if (d>far){far=d;ink=q;}
        }
      const spec = await p.evaluate((col)=>{const cv=document.createElement("canvas").getContext("2d");cv.fillStyle=col;return cv.fillStyle;}, h.color);
      const specRGB = spec.startsWith("#") ? [1,3,5].map(i=>parseInt(spec.slice(i,i+2),16)) : null;
      console.log(`  "${h.text}" ${h.size} w${h.weight} box=${h.box.join(",")}`);
      console.log(`    지정 ${spec} ${specRGB? ratio(specRGB,bg).toFixed(2)+":1":"?"}`);
      console.log(`    바탕 [${bg}]  칠해진 글자 ${ink?`[${ink}] → ${ratio(ink,bg).toFixed(2)}:1`:"(못 찾음)"}`);
    }
    await ctx.close(); s.close();
  }
  await b.close();
})();
