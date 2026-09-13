const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const ROOT=path.resolve(process.argv[2]), PORT=Number(process.argv[3]), PAGE=process.argv[4]||"/settings";
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
 ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon"};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
 for(const f of [ROOT+u+".html",ROOT+u,ROOT+path.join(u,"index.html"),ROOT+"/404.html"]){
  try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
 r.writeHead(404);r.end("x");});
(async()=>{ await new Promise(r=>srv.listen(PORT,r));
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 const ctx=await b.newContext({viewport:{width:390,height:844}});
 await ctx.addInitScript(()=>{const boom=()=>{throw new DOMException("denied","SecurityError");};
  try{Object.defineProperty(window,"indexedDB",{get:boom});}catch{}
  try{Object.defineProperty(window,"localStorage",{get:boom});Object.defineProperty(window,"sessionStorage",{get:boom});}catch{}});
 const p=await ctx.newPage(); const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,70)));
 await p.goto(`http://127.0.0.1:${PORT}${PAGE}`,{waitUntil:"networkidle"}).catch(()=>{});
 await p.waitForTimeout(900);
 console.log(`${PAGE} → 예외 ${errs.length}건${errs.length?": "+[...new Set(errs)].join(" | "):""}`);
 await b.close(); srv.close(); process.exit(0);})();
