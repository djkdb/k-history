const { chromium, devices } = require("/home/user/k-history/node_modules/playwright");
(async()=>{
 const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium",proxy:{server:process.env.HTTPS_PROXY}});
 const ctx=await b.newContext({...devices["Pixel 7"]});
 const p=await ctx.newPage();
 for(const a of ["history","comhwal","sqld","toeic","gisa"]){
  await p.goto("https://zunte.pages.dev/"+a+"/",{waitUntil:"networkidle"});
  await p.waitForTimeout(800);
  for(let step=0;step<8;step++){
   const info=await p.evaluate(()=>({url:location.pathname,h:[...document.querySelectorAll("h1,h2")].slice(0,3).map(x=>x.innerText.trim().slice(0,40)),btn:[...document.querySelectorAll("button,a")].filter(x=>x.offsetParent).map(x=>x.innerText.trim().replace(/\s+/g," ").slice(0,24)).filter(Boolean).slice(0,14)}));
   console.log(a,step,info.url,JSON.stringify(info.h),"\n    ",info.btn.join(" | "));
   break;
  }
 }
 await b.close();
})();
