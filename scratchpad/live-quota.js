const { chromium } = require("/home/user/k-history/node_modules/playwright");
(async()=>{
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium",proxy:{server:process.env.HTTPS_PROXY}});
 const ctx=await b.newContext({serviceWorkers:"allow"});
 const p=await ctx.newPage();
 const est=async(t)=>console.log(t,await p.evaluate(async()=>{const e=await navigator.storage.estimate();const out={};for(const k of await caches.keys())out[k]=(await(await caches.open(k)).keys()).length;return `사용 ${(e.usage/1e6).toFixed(1)}MB / 한도 ${(e.quota/1e6).toFixed(1)}MB `+JSON.stringify(out);}));
 for(const u of ["/","/history/","/comhwal/","/sqld/","/toeic/","/gisa/"]){
  await p.goto("https://zunte.pages.dev"+u,{waitUntil:"load"});
  for(let i=0;i<240;i++){ if(await p.evaluate(async s=>{const r=await navigator.serviceWorker.getRegistration(s);return !!(r&&r.active&&r.active.state==="activated"&&!r.installing&&!r.waiting)},u)) break; await p.waitForTimeout(500);}
  await est(u);
 }
 await b.close();
})();
