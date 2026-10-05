const { chromium } = require("/home/user/k-history/node_modules/playwright");
(async()=>{
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium",proxy:{server:process.env.HTTPS_PROXY}});
 const ctx=await b.newContext({serviceWorkers:"allow"});
 const p=await ctx.newPage();
 const t0=Date.now();
 await p.goto("https://zunte.pages.dev/gisa/",{waitUntil:"load",timeout:60000});
 for(let i=0;i<40;i++){
  const s=await p.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration("/gisa/");const st=r?[r.installing&&"설치중",r.waiting&&"대기",r.active&&("활성:"+r.active.state)].filter(Boolean).join(","):"없음";const out={};for(const k of await caches.keys())out[k]=(await(await caches.open(k)).keys()).length;return st+" "+JSON.stringify(out)+" 제어:"+!!navigator.serviceWorker.controller;});
  console.log(Math.round((Date.now()-t0)/1000)+"초",s);
  if(/:2[0-9]{2}\}/.test(s) && !s.includes("설치중")) break;
  await p.waitForTimeout(3000);
 }
 await b.close();
})();
