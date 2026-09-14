// all-contrast 가 "퀴즈 시작" 을 3.76:1 로 적은 이유를 그 조건 그대로 되짚는다.
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".webp":"image/webp"};
function serve(root,port){root=path.resolve(root);const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
 for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
 r.writeHead(404);r.end("x");});return new Promise(res=>s.listen(port,()=>res(s)));}
const lum=([r,g,b])=>{const f=v=>{const c=v/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
const ratio=(a,c)=>{const[x,y]=[lum(a),lum(c)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
(async()=>{
 const s=await serve("out",5833);
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await ctx.addInitScript(()=>{try{localStorage.setItem("khlm:theme","light");}catch{}});
 const p=await ctx.newPage();
 await p.goto("http://127.0.0.1:5833/quiz",{waitUntil:"networkidle"});
 await p.waitForTimeout(400);
 const it=await p.evaluate(()=>{
  for(const el of document.querySelectorAll("p, span, li, h1, h2, h3, button, a, td, th")){
   const t=(el.innerText||"").trim();
   if(!t.includes("퀴즈 시작"))continue;
   if(el.querySelector("p, span, div, button, a"))continue;
   const r2=el.getBoundingClientRect();const cs=getComputedStyle(el);
   return {t:t.slice(0,30),tag:el.tagName,color:cs.color,size:cs.fontSize,
    x:Math.round(r2.left+Math.min(r2.width/2,40)),y:Math.round(r2.top+r2.height/2),
    box:{x:Math.round(r2.left),y:Math.round(r2.top),w:Math.round(r2.width),h:Math.round(r2.height)}};}
  return null;});
 console.log(JSON.stringify(it));
 const on=PNG.sync.read(await p.screenshot({clip:{x:0,y:0,width:390,height:844}}));
 await p.addStyleTag({content:"*{color:transparent !important;text-shadow:none !important}"});
 await p.waitForTimeout(120);
 const off=PNG.sync.read(await p.screenshot({clip:{x:0,y:0,width:390,height:844}}));
 const pick=(img,x,y)=>{const i=(img.width*y+x)<<2;return [img.data[i],img.data[i+1],img.data[i+2]];};
 const bg=pick(off,it.x,it.y);
 let best=null,far=-1,bx=0,by=0,n=0;
 for(let y=it.box.y;y<=it.box.y+it.box.h;y++)for(let x=it.box.x;x<=it.box.x+it.box.w;x++){
  if(x<0||y<0||x>=390||y>=844)continue;
  const i=(on.width*y+x)<<2,j=(off.width*y+x)<<2;
  const moved=Math.abs(on.data[i]-off.data[j])+Math.abs(on.data[i+1]-off.data[j+1])+Math.abs(on.data[i+2]-off.data[j+2]);
  if(moved<12)continue;n++;
  const q=[on.data[i],on.data[i+1],on.data[i+2]];
  const d=Math.abs(q[0]-bg[0])+Math.abs(q[1]-bg[1])+Math.abs(q[2]-bg[2]);
  if(d>far){far=d;best=q;bx=x;by=y;}}
 console.log("바탕점",it.x,it.y,"=",bg);
 console.log("글자픽셀",n,"가장 먼 점",bx,by,"=",best,"→",ratio(best,bg).toFixed(2)+":1");
 console.log("켠 그림 그 점:",pick(on,bx,by),"끈 그림 그 점:",pick(off,bx,by));
 // 단추 안쪽 여러 줄의 바탕을 훑어 본다
 for(const yy of [it.box.y+4, it.box.y+(it.box.h>>1), it.box.y+it.box.h-4])
  console.log("  바탕 훑기 y="+yy, [56,150,250,350].map(x=>pick(off,x,yy).join(",")).join(" | "));
 fs.writeFileSync("scratchpad/why376-on.png", PNG.sync.write(on));
 await b.close();s.close();
})();
