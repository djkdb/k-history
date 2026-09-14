// h1 이 없다고 나온 화면이 실제로 무엇을 보여 주고 있는지 본다.
const { chromium } = require("playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
function serve(root,port){root=path.resolve(root);const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
 for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
 r.writeHead(404);r.end("x");});return new Promise(res=>s.listen(port,()=>res(s)));}
const CASES=[["한국사","out","khlm","/mock/session"],["컴활","comhwal/out","comhwal","/learn/database"],
 ["SQLD","sqld/out","sqld","/mock/session"],["토익","toeic/out","toeic","/mock/note"],
 ["정보처리기사","gisa/out","gisa","/mock/session"]];
(async()=>{const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});let port=5980;
 for(const [name,root,key,route] of CASES){const s=await serve(root,port);
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await ctx.addInitScript(k=>{try{localStorage.setItem(k+":theme","dark");}catch{}},key);
  const p=await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}${route}`,{waitUntil:"networkidle"});await p.waitForTimeout(800);
  const r=await p.evaluate(()=>({url:location.pathname,
   heads:[...document.querySelectorAll("h1,h2,h3")].filter(h=>h.getBoundingClientRect().height>0)
     .map(h=>h.tagName+" "+(h.innerText||"").trim().replace(/\s+/g," ").slice(0,30)),
   top:(document.body.innerText||"").trim().replace(/\s+/g," ").slice(0,140)}));
  console.log(`━━━ ${name} ${route} → ${r.url}`);
  console.log("  제목들:", r.heads.length?r.heads.join(" | "):"(없음)");
  console.log("  화면글:", r.top);
  await ctx.close();s.close();port++;}
 await b.close();})();
