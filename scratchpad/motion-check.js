/*
 * "동작 줄이기" 를 켠 기기에서 정말로 움직임이 멎는지 본다.
 *
 * 규칙을 적어 넣는 것과, 그 규칙이 화면까지 닿는 것은 다른 일이다.
 * 계산된 값을 직접 읽어 확인한다. 뱅뱅이(SQL 실행 표시)만은 멈추면
 * "고장났나" 로 읽히므로, 멎지 않고 느려졌는지를 따로 본다.
 *
 *   node scratchpad/motion-check.js
 */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp"};
function serve(root, port){ root=path.resolve(root);
  const s=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split("?")[0]);
    for(const f of [root+u+".html",root+u,root+path.join(u,"index.html"),root+"/404.html"]){
      try{if(fs.statSync(f).isFile()){r.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}}catch{}}
    r.writeHead(404);r.end("x");});
  return new Promise(res=>s.listen(port,()=>res(s)));}

const APPS = [["한국사","out","khlm"],["컴활","comhwal/out","comhwal"],
  ["SQLD","sqld/out","sqld"],["토익","toeic/out","toeic"],["정보처리기사","gisa/out","gisa"]];

let bad = 0;
const say = (ok, msg) => { if (!ok) bad++; console.log(`  ${ok ? "✓" : "✗"} ${msg}`); };

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let port = 5940;
  for (const [name, root, key] of APPS) {
    const s = await serve(root, port);
    console.log(`\n━━━ ${name}`);
    let has = { pulse: false, spin: false };
    for (const motion of ["no-preference", "reduce"]) {
      const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true,
        deviceScaleFactor:1, reducedMotion: motion });
      await ctx.addInitScript((k)=>{try{localStorage.setItem(k+":theme","dark");}catch{}},key);
      const p = await ctx.newPage();
      await p.goto(`http://127.0.0.1:${port}/`, { waitUntil:"networkidle" });
      await p.waitForTimeout(700);
      const r = await p.evaluate(() => {
        // 없으면 만들어서 잰다 — 어느 화면에 있든 규칙 자체를 확인할 수 있게
        const mk = (cls) => { const d = document.createElement("div");
          d.className = cls; d.style.width = d.style.height = "10px";
          document.body.appendChild(d); const cs = getComputedStyle(d);
          const v = { anim: cs.animationDuration, iter: cs.animationIterationCount,
                      name: cs.animationName, trans: cs.transitionDuration };
          d.remove(); return v; };
        return { pulse: mk("animate-pulse"), spin: mk("animate-spin"),
          trans: mk("transition-colors duration-300"),
          scroll: getComputedStyle(document.documentElement).scrollBehavior,
          media: matchMedia("(prefers-reduced-motion: reduce)").matches };
      });
      const ms = (v) => v.split(",")[0].trim();
      /*
       * ⚠️ 쓰지도 않는 것을 나무라지 않는다.
       *
       * animate-pulse 는 한국사에만, animate-spin 은 SQLD 에만 있다. 테일윈드는
       * 안 쓰는 반은 아예 내보내지 않으므로 나머지 앱에서는 0s 로 읽힌다.
       * 처음엔 그것을 "평소에도 안 깜빡인다" 며 네 앱을 미달로 적었다 —
       * 앱이 아니라 검사가 틀린 것이었다. 평소 상태에서 그 반이 실제로
       * 나가 있는지를 먼저 보고, 있는 앱에서만 따진다.
       */
      if (motion === "reduce") {
        say(r.media, `동작 줄이기 켬으로 인식`);
        if (has.pulse) say(parseFloat(ms(r.pulse.anim)) < 0.01, `깜빡임 멎음 (${ms(r.pulse.anim)})`);
        if (has.spin) say(ms(r.spin.anim) === "1.8s" && r.spin.iter.startsWith("infinite") && r.spin.name !== "none",
            `뱅뱅이는 느리게 계속 돈다 (${r.spin.name} ${ms(r.spin.anim)} · ${r.spin.iter})`);
        say(parseFloat(ms(r.trans.trans)) < 0.01, `전환 멎음 (${ms(r.trans.trans)})`);
        say(r.scroll === "auto", `부드러운 스크롤 꺼짐 (${r.scroll})`);
        if (!has.pulse && !has.spin) console.log("    (깜빡임·뱅뱅이를 쓰지 않는 앱)");
      } else {
        has = { pulse: r.pulse.name !== "none", spin: r.spin.name !== "none" };
        say(!r.media, `평소에는 꺼짐으로 인식`);
        if (has.pulse) say(parseFloat(ms(r.pulse.anim)) > 0.5, `평소엔 깜빡인다 (${ms(r.pulse.anim)})`);
        if (has.spin) say(parseFloat(ms(r.spin.anim)) > 0.2, `평소엔 뱅뱅 돈다 (${ms(r.spin.anim)})`);
        say(r.scroll === "smooth", `평소엔 부드러운 스크롤 (${r.scroll})`);
      }
      await ctx.close();
    }
    s.close(); port++;
  }
  console.log(bad ? `\n어긋난 것 ${bad}건` : `\n✓ 다섯 앱 — 동작 줄이기를 지킨다`);
  await b.close();
  process.exit(bad ? 1 : 0);
})();
