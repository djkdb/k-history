// 다섯 앱 모두 — 글씨 대비를 실제 픽셀로 잰다.
// theme.tsx 를 다섯 곳 다 고쳤으니 나머지 네 앱도 한 번 봐야 한다.
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",
  ".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",
  ".txt":"text/plain",".mp3":"audio/mpeg",".wasm":"application/wasm",".webp":"image/webp" };
function serve(root, port) {
  root = path.resolve(root);
  const s = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    for (const f of [root+u+".html", root+u, root+path.join(u,"index.html"), root+"/404.html"]) {
      try { if (fs.statSync(f).isFile()) {
        r.writeHead(200, {"content-type": MIME[path.extname(f)]||"application/octet-stream"});
        return r.end(fs.readFileSync(f)); } } catch {}
    }
    r.writeHead(404); r.end("x");
  });
  return new Promise((res) => s.listen(port, () => res(s)));
}
function lum([r,g,b]) { const f=(v)=>{const c=v/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); }
const ratio=(a,c)=>{const[x,y]=[lum(a),lum(c)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};

/*
 * 화면 목록은 손으로 적지 않는다.
 *
 * ⚠️ 처음에는 앱마다 여섯 곳쯤 손으로 적어 두었는데, 토익에는 /learn 이 아예
 *    없어서 404 를 훑고 있었다. 있지도 않은 화면을 재면서 "다 봤다" 고 말한
 *    셈이다. out/ 에 실제로 나간 화면을 세어 전부 돈다.
 */
const APPS = [
  ["한국사", "out", "khlm"],
  ["컴활", "comhwal/out", "comhwal"],
  ["SQLD", "sqld/out", "sqld"],
  ["토익", "toeic/out", "toeic"],
  ["정보처리기사", "gisa/out", "gisa"],
];

/** out/ 안의 화면 주소를 모은다. 같은 틀을 쓰는 상세 화면은 셋만 본다. */
function routesOf(root) {
  const R = path.resolve(root);
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const all = walk(R).filter((f) => f.endsWith(".html") && !f.includes("/_next/"))
    .map((f) => "/" + path.relative(R, f).replace(/\.html$/, "").replace(/\/?index$/, ""))
    .map((r) => (r === "" ? "/" : r));
  const byDir = new Map();
  const flat = [];
  for (const r of all) {
    const seg = r.split("/").filter(Boolean);
    if (seg.length >= 2) {
      const k = seg[0];
      const n = (byDir.get(k) ?? 0) + 1;
      byDir.set(k, n);
      if (n <= 3) flat.push(r);   // 같은 틀이면 셋이면 충분하다
    } else flat.push(r);
  }
  return flat;
}

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  let port = 5100, total = 0, bad = 0, emojiSkipped = 0;
  for (const [name, root, prefix] of APPS) {
    if (!fs.existsSync(root)) { console.log(`${name}: out 없음`); continue; }
    const srv = await serve(root, port);
    const routes = routesOf(root);
    console.log(`\n━━━ ${name} — 화면 ${routes.length}개 ━━━`);
    for (const theme of ["dark", "light"]) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      await ctx.addInitScript(([t, pre]) => { try { localStorage.setItem(pre + ":theme", t); } catch {} }, [theme, prefix]);
      const p = await ctx.newPage();
      const seen = new Set();
      let hits = 0;
      for (const r of routes) {
        let okLoad = false;
        for (let k = 0; k < 3 && !okLoad; k++) {
          await p.goto(`http://127.0.0.1:${port}${r}`, { waitUntil: "networkidle" }).catch(() => {});
          await p.waitForTimeout(400);
          okLoad = await p.evaluate(() => !!document.title);
        }
        if (!okLoad) continue;
        const got = await p.evaluate(() => {
          const cv = document.createElement("canvas"); cv.width = cv.height = 1;
          const c2 = cv.getContext("2d", { willReadFrequently: true });
          const toRGB = (c) => { c2.clearRect(0,0,1,1); c2.fillStyle="#000"; c2.fillStyle=c; c2.fillRect(0,0,1,1);
            const d=c2.getImageData(0,0,1,1).data; return [d[0],d[1],d[2],d[3]/255]; };
          let skippedEmoji = 0;
        const out = [];
          for (const el of document.querySelectorAll("p, span, li, h1, h2, h3, button, a, td, th")) {
            const t = (el.innerText||"").trim();
            if (!t || t.length < 2) continue;
            if (el.querySelector("p, span, div, button, a")) continue;
            const r2 = el.getBoundingClientRect();
            if (r2.width < 4 || r2.height < 4) continue;
            if (r2.bottom < 0 || r2.top > innerHeight) continue;
          /*
           * 잴 자리가 다른 것에 가려져 있지 않은가.
           *
           * ⚠️ 아래에 늘 떠 있는 길잡이 막대가 화면 밑동을 덮는다. 그 아래 깔린
           *    단추의 한가운데를 재면 길잡이의 색을 재는 꼴이 된다. 실제로 흰
           *    알약 위의 검은 글씨(17:1)를 1.06:1 로 적었다. 그 자리에 정말 이
           *    요소가 있는지 물어보고 잰다.
           */

          /*
           * 비활성화된 조작 요소는 건너뛴다.
           *
           * WCAG 1.4.3 은 쓸 수 없는 상태의 요소를 대비 기준에서 명시적으로
           * 뺀다. 이 앱들도 흐리게(opacity 40%) 그려 "지금은 누를 수 없다" 를
           * 알리는데, 그것을 미달로 세면 흐리게 하는 뜻 자체가 없어진다.
           */
          if (el.closest("[disabled],[aria-disabled='true']")) continue;
          // 이모지가 섞이면 글씨 색을 픽셀에서 가려낼 수 없다 — 따로 센다
          if (/\p{Extended_Pictographic}/u.test(t)) { skippedEmoji++; continue; }
          const px = Math.round(r2.left + Math.min(r2.width / 2, 40));
          const py = Math.round(r2.top + r2.height / 2);
          const hit = document.elementFromPoint(px, py);
          if (!hit || (hit !== el && !el.contains(hit) && !hit.contains(el))) continue;

            const cs = getComputedStyle(el);
            out.push({ t: t.slice(0,24), x: px, y: py,
              box: { x: Math.round(r2.left), y: Math.round(r2.top), w: Math.round(r2.width), h: Math.round(r2.height) },
              rgb: toRGB(cs.color),
              size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight)||400 });
          }
          return { out, skippedEmoji };
        });
        const items = got.out;
      emojiSkipped += got.skippedEmoji;
      if (!items.length) continue;
        // 글씨가 보이는 그림을 먼저 찍어 둔다 — 실제로 칠해진 글씨 색을 여기서 찾는다
        const shotOn = PNG.sync.read(await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 844 } }));
      await p.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important}" });
        await p.waitForTimeout(120);
        const img = PNG.sync.read(await p.screenshot({ clip: { x:0, y:0, width:390, height:844 } }));
  
        /*
         * 실제로 칠해진 글씨 색을 찾는다.
         *
         * ⚠️ getComputedStyle(el).color 는 filter 를 적용하기 *전* 값이다.
         *    한국사의 .era-ink 는 filter: brightness(0.33) 으로 시대색을 어둡게
         *    깔아 주는데, 계산값만 읽으면 그 보정을 못 본다 — 멀쩡한 곳을
         *    미달로 적게 된다. 글씨가 보이는 그림과 감춘 그림을 견주어,
         *    바탕에서 가장 멀리 떨어진 픽셀(글자 속)을 글씨 색으로 잡는다.
         */
        const inkAt = (on, off, box, bg) => {
          /*
           * 글자 속 색 = 바탕에서 가장 멀리 떨어진 픽셀.
           *
           * 작은 글씨는 대부분의 픽셀이 바탕과 섞인 가장자리다. "가장 흔한 색"
           * 으로 고르면 그 혼색이 잡혀 실제보다 대비가 낮게 나온다 —
           * 한 번 그렇게 바꿨다가 10건이 599건으로 불어났다.
           * 가장 진한 한 점이 글자 속이다.
           *
           * 다만 이 방법은 이모지가 섞인 글에서는 이모지의 진한 색을 잡는다.
           * 이모지는 그림이지 글씨가 아니므로, 그런 요소는 재지 않고 따로 센다.
           */
          let best = null, far = -1;
          const x0 = Math.max(0, box.x), x1 = Math.min(on.width - 1, box.x + box.w);
          const y0 = Math.max(0, box.y), y1 = Math.min(on.height - 1, box.y + box.h);
          for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
              const i = (on.width * y + x) << 2;
              const j = (off.width * y + x) << 2;
              const moved = Math.abs(on.data[i] - off.data[j]) + Math.abs(on.data[i+1] - off.data[j+1]) + Math.abs(on.data[i+2] - off.data[j+2]);
              if (moved < 12) continue;
              const px = [on.data[i], on.data[i+1], on.data[i+2]];
              const d = Math.abs(px[0]-bg[0]) + Math.abs(px[1]-bg[1]) + Math.abs(px[2]-bg[2]);
              if (d > far) { far = d; best = px; }
            }
          }
          return best;
        };
      const pick = (x,y)=>{x=Math.max(0,Math.min(img.width-1,x));y=Math.max(0,Math.min(img.height-1,y));
          const i=(img.width*y+x)<<2;return [img.data[i],img.data[i+1],img.data[i+2]];};
        for (const it of items) {
          if (!it.rgb || it.rgb.length < 3) continue;
          const bg = pick(it.x, it.y);
          const inked = it.box ? inkAt(shotOn, img, it.box, bg) : null;
          const a = it.rgb[3] === undefined ? 1 : it.rgb[3];
          const fg = inked ?? [0,1,2].map((i) => it.rgb[i]*a + bg[i]*(1-a));
          const rr = ratio(fg, bg); total++; hits++;
          const big = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
          const need = big ? 3 : 4.5;
          if (rr >= need) continue;
          const key = it.t + it.rgb.join();
          if (seen.has(key)) continue;
          seen.add(key);
          bad++;
          console.log(`  ✗ [${theme === "dark" ? "어둡" : "밝음"}] 대비 ${rr.toFixed(2)}:1 (${need}) — "${it.t}" ${Math.round(it.size)}px ${r}`);
        }
      }
      console.log(`  ${theme === "dark" ? "어두운" : "밝은"} 화면 글씨 ${hits}곳`);
      await ctx.close();
    }
    srv.close(); port++;
  }
  await b.close();
  console.log(`\n다섯 앱 글씨 ${total}곳을 픽셀로 쟀다 (이모지가 섞여 재지 못한 곳 ${emojiSkipped})`);
  console.log(bad ? `대비 미달 ${bad}건` : "✓ 대비 이상 없음");
  process.exit(bad ? 1 : 0);
})();
