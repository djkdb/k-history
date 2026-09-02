const { chromium } = require("playwright");
const BASE = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => {
    const mk = (n,l)=>({name:n,lang:l,default:false,localService:true,voiceURI:n});
    const ss=window.speechSynthesis;
    Object.defineProperty(ss,"getVoices",{value:()=>[mk("Samantha","en-US"),mk("Daniel","en-GB")],configurable:true});
    Object.defineProperty(ss,"speak",{value:(u)=>setTimeout(()=>u.onend&&u.onend(new Event("end")),15),configurable:true});
    Object.defineProperty(ss,"cancel",{value:()=>{},configurable:true});
  });
  const p = await ctx.newPage();
  p.on("pageerror", e => console.log("예외:", String(e).slice(0,140)));
  const hit = (re) => p.evaluate((s)=>{
    const rx=new RegExp(s); const root=document.querySelector("main")??document.body;
    const b=[...root.querySelectorAll("button")].find(x=>!x.disabled&&rx.test((x.innerText||"").trim()));
    if(!b) return "없음"; b.click(); return (b.innerText||"").trim();
  }, re);
  const dump = async (label) => {
    const t = await p.evaluate(() => (document.querySelector("main")?.innerText || "").replace(/\n+/g," | ").slice(-430));
    console.log(`\n[${label}] ${t}`);
  };
  await p.goto(BASE + "/part/3", { waitUntil: "networkidle" }); await p.waitForTimeout(900);
  console.log("선구독 켜기:", await hit("선구독 훈련")); await p.waitForTimeout(600); await dump("켠 뒤");
  console.log("시작:", await hit("시작하기")); await p.waitForTimeout(900); await dump("미리 읽기");
  console.log("다 읽음:", await hit("다 읽었어요")); await p.waitForTimeout(700); await dump("듣기 단계");
  console.log("듣기 누름:", await hit("^듣기$")); await p.waitForTimeout(600); await dump("누른 직후");
  await p.waitForTimeout(2500); await dump("2.5초 뒤");
  await b.close();
})();
