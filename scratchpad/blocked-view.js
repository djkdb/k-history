const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
 ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".mp3":"audio/mpeg"};
function serve(root,port){root=path.resolve(root);
 const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
  for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){
   try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
  r.writeHead(404);r.end("x");});
 return new Promise(res=>s.listen(port,()=>res(s)));}
const APPS=[["한국사","out","/"],["컴활","comhwal/out","/settings"],["SQLD","sqld/out","/settings"],["토익","toeic/out","/settings"]];
(async()=>{
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 let port=4760;
 for(const [name,root,page] of APPS){
  const srv=await serve(root,port);
  for (const blocked of [false, true]) {
    const ctx=await b.newContext({viewport:{width:390,height:844}});
    if (blocked) await ctx.addInitScript(()=>{const boom=()=>{throw new DOMException("denied","SecurityError");};
      try{Object.defineProperty(window,"indexedDB",{get:boom});}catch{}
      try{Object.defineProperty(window,"localStorage",{get:boom});Object.defineProperty(window,"sessionStorage",{get:boom});}catch{}});
    const p=await ctx.newPage();
    await p.goto(`http://127.0.0.1:${port}${page}`,{waitUntil:"networkidle"}).catch(()=>{});
    await p.waitForTimeout(1600);
    const t=(await p.locator("body").innerText().catch(()=>"")).replace(/\n+/g," ").trim();
    console.log(`${name} ${page} ${blocked?"[저장 막힘]":"[보통    ]"} ${t.length}자: ${t.slice(0,110)}`);
    await ctx.close();
  }
  console.log("");
  srv.close(); port++;
 }
 await b.close();
})();
