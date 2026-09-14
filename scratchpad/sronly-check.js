// 소리로만 들리는 제목이 정말 눈에는 안 보이는지 확인한다.
// (sr-only 를 잘못 쓰면 화면 구석에 글자가 튀어나온다)
const { chromium } = require("playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
function serve(root,port){root=path.resolve(root);const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
 for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
 r.writeHead(404);r.end("x");});return new Promise(res=>s.listen(port,()=>res(s)));}
const CASES=[["컴활","comhwal/out","comhwal","/mock/session"],["SQLD","sqld/out","sqld","/mock/session"],
 ["토익","toeic/out","toeic","/mock/session"],["정보처리기사 필기","gisa/out","gisa","/mock/session"],
 ["정보처리기사 실기","gisa/out","gisa","/practical/mock/session"]];
(async()=>{const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 let port=6010,bad=0;
 for(const [name,root,key,route] of CASES){const s=await serve(root,port);
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await ctx.addInitScript(k=>{try{localStorage.setItem(k+":theme","dark");}catch{}},key);
  const p=await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}${route}`,{waitUntil:"networkidle"});await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const h=document.querySelector("h1.sr-only");
   if(!h)return null;const b=h.getBoundingClientRect();const cs=getComputedStyle(h);
   return {text:h.textContent,w:b.width,h:b.height,clip:cs.clipPath||cs.clip,pos:cs.position,over:cs.overflow};});
  if(!r){console.log(`  ✗ ${name} — 소리용 제목이 없다`);bad++;}
  else{const hidden=r.w<=2&&r.h<=2;
   console.log(`  ${hidden?"✓":"✗"} ${name} "${r.text}" — ${r.w}×${r.h}px · ${r.clip} · ${r.pos}`);
   if(!hidden)bad++;}
  await ctx.close();s.close();port++;}
 console.log(bad?`\n어긋난 것 ${bad}건`:"\n✓ 소리용 제목은 눈에 띄지 않는다");
 await b.close();})();
