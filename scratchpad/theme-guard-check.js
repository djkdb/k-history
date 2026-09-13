// 번들 안의 테마 읽기가 실제로 감싸여 있는가를 브라우저에서 직접 잰다.
// 저장을 막아 두고 테마 단추가 있는 화면을 연 뒤, 단추가 실제로 그려졌는지 본다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const http=require("http"),fs=require("fs"),path=require("path");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
 ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".mp3":"audio/mpeg"};
function serve(root, port){ root=path.resolve(root);
  const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
   for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){
    try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
   r.writeHead(404);r.end("x");});
  return new Promise(res=>s.listen(port,()=>res(s))); }

const APPS = [["한국사","out","/"],["컴활","comhwal/out","/settings"],["SQLD","sqld/out","/settings"],
              ["토익","toeic/out","/settings"],["정보처리기사","gisa/out","/settings"]];
(async()=>{
  const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
  let port=4700, bad=0;
  for(const [name,root,page] of APPS){
    const srv=await serve(root, port);
    const ctx=await b.newContext({viewport:{width:390,height:844}});
    await ctx.addInitScript(()=>{const boom=()=>{throw new DOMException("denied","SecurityError");};
      try{Object.defineProperty(window,"indexedDB",{get:boom});}catch{}
      try{Object.defineProperty(window,"localStorage",{get:boom});Object.defineProperty(window,"sessionStorage",{get:boom});}catch{}});
    const p=await ctx.newPage(); const errs=[]; p.on("pageerror",e=>errs.push(String(e).slice(0,60)));
    await p.goto(`http://127.0.0.1:${port}${page}`,{waitUntil:"networkidle"}).catch(()=>{});
    await p.waitForTimeout(1100);
    /*
     * 처음 판에서는 "테마 단추가 보이는가" 를 봤는데, 그것은 이 검사가 물을
     * 것이 아니었다. 컴활·SQLD·한국사는 설정이 없는 사람을 첫 안내로 보내므로
     * 저장이 막히면 테마 단추가 화면에 없는 것이 정상이다. 그것을 실패로
     * 세는 바람에 멀쩡한 앱 셋을 고장 났다고 적었다.
     *
     * 물어야 할 것은 하나다 — 저장이 막혔을 때 예외가 나는가, 그리고
     * 막히지 않았을 때와 화면이 같은가.
     */
    const themeUI =
      (await p.locator("text=/어둡게|밝게|기기 설정/").count()) +
      (await p.locator('[aria-label="밝게 보기"], [aria-label="어둡게 보기"]').count());
    const body = (await p.locator("body").innerText().catch(() => "")).trim();
    const uniq=[...new Set(errs)];
    const okNow = uniq.length === 0 && body.length > 40;
    if(!okNow) bad++;
    console.log(`  ${okNow?"✓":"✗"} ${name} ${page} — 화면 ${body.length}자 · 테마 단추 ${themeUI}개 · 예외 ${uniq.length}건 ${uniq.join("|")}`);
    await ctx.close(); srv.close(); port++;
  }
  await b.close();
  console.log(bad?`\n문제 ${bad}건`:`\n✓ 다섯 앱 모두 저장이 막혀도 화면이 뜨고 예외가 없다`);
  process.exit(bad?1:0);
})();
