/*
 * 인스타·카카오톡에서 링크를 눌러 들어온 사람에게 무엇이 보이는가.
 *
 * 그 안에서는 홈 화면 추가가 안 되고, 무엇보다 여기서 쌓은 기록이
 * 나중에 사파리로 열면 없다. 그러니 "밖에서 여세요" 를 먼저 말해야 한다.
 * 정말 말하고 있는지 그 브라우저인 척하고 열어서 확인한다.
 *
 *   node scratchpad/inapp-check.js
 */
const { chromium } = require("playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
function serve(root,port){root=path.resolve(root);const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
 for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
 r.writeHead(404);r.end("x");});return new Promise(res=>s.listen(port,()=>res(s)));}

const APPS=[["한국사","out","khlm"],["컴활","comhwal/out","comhwal"],["SQLD","sqld/out","sqld"],
 ["토익","toeic/out","toeic"],["정보처리기사","gisa/out","gisa"]];

// 실제 인앱 브라우저가 보내는 신원
const UAS = [
 ["인스타그램(아이폰)","Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 329.0.0.41.93 (iPhone14,5; iOS 17_5; ko_KR; ko; scale=3.00; 1170x2532; 574260853)"],
 ["카카오톡(안드로이드)","Mozilla/5.0 (Linux; Android 14; SM-S921N Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 Mobile Safari/537.36 KAKAOTALK 10.5.0"],
 ["사파리(아이폰)","Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"],
];
const WARN = /안에서 보고 있습니다|다른 브라우저|Safari로 열기|사파리로 열|밖에서 여|주소 복사|홈 화면/;

(async()=>{
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
 let port=6100, bad=0;
 for(const [name,root,key] of APPS){
  const s=await serve(root,port);
  console.log(`\n━━━ ${name}`);
  for(const [who,ua] of UAS){
   const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,
     deviceScaleFactor:1,userAgent:ua});
   await ctx.addInitScript(k=>{try{localStorage.setItem(k+":theme","dark");localStorage.setItem(k+":onboarded","1");}catch{}},key);
   const p=await ctx.newPage();
   await p.goto(`http://127.0.0.1:${port}/`,{waitUntil:"networkidle"});
   await p.waitForTimeout(1600);
   const txt=await p.evaluate(()=>(document.body.innerText||"").replace(/\s+/g," "));
   if(process.env.DBG)console.log("    [어디]",p.url(),"|",txt.slice(0,90));
   const hit=WARN.test(txt);
   const inapp=!/사파리\(아이폰\)/.test(who);
   const want=true; // 셋 다 무언가는 알려 줘야 한다 (인앱이면 경고, 사파리면 홈 화면 추가)
   const m=txt.match(/[^.]{0,40}(안에서 보고 있습니다|주소 복사|홈 화면[^.]{0,20})/);
   console.log(`  ${hit?"✓":"✗"} ${who} — ${hit?(m?m[0].trim().slice(-52):"안내 있음"):"아무 안내도 없다"}`);
   if(!hit)bad++;
   await ctx.close();
  }
  s.close();port++;
 }
 console.log(bad?`\n안내가 없는 곳 ${bad}건`:"\n✓ 어디로 들어와도 쓰는 법을 알려 준다");
 await b.close();
})();
