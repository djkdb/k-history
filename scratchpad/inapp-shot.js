// 인스타에서 들어왔을 때와 사파리에서 들어왔을 때 실제로 보이는 화면을 찍는다.
const { chromium } = require("playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
function serve(root,port){root=path.resolve(root);const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
 for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
 r.writeHead(404);r.end("x");});return new Promise(res=>s.listen(port,()=>res(s)));}
const IG="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 329.0.0.41.93 (iPhone14,5; iOS 17_5; ko_KR; ko; scale=3.00; 1170x2532; 574260853)";
const SF="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
(async()=>{
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 const s=await serve("gisa/out",6200);
 for(const [tag,ua,tap] of [["인스타",IG,false],["사파리",SF,true]]){
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,userAgent:ua});
  await ctx.addInitScript(()=>{try{localStorage.setItem("gisa:theme","dark");}catch{}});
  const p=await ctx.newPage();
  await p.goto("http://127.0.0.1:6200/",{waitUntil:"networkidle"});
  await p.waitForTimeout(1500);
  if(tap){ // "추가하는 법 보기" 를 눌러 단계까지 펼친다
   const btn=p.getByText("추가하는 법 보기");
   if(await btn.count()){await btn.first().scrollIntoViewIfNeeded();await btn.first().click();await p.waitForTimeout(400);}
   const card=p.locator("text=앱처럼 쓸 수 있습니다").first();
   if(await card.count())await card.scrollIntoViewIfNeeded();
   await p.waitForTimeout(300);
  }
  await p.screenshot({path:`scratchpad/shot-${tag}.png`});
  console.log(`찍음 scratchpad/shot-${tag}.png`);
  await ctx.close();
 }
 await b.close();s.close();
})();
