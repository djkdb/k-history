/*
 * 눌러야만 나오는 화면들을 검사한다.
 *
 * ⚠️ 지금까지의 전수조사는 모두 "주소를 열었을 때의 화면" 만 봤다. out/ 에
 *    나간 화면을 하나도 빠짐없이 돌았으니 다 봤다고 여겼는데, 정작 사람이
 *    가장 오래 머무는 곳 — 퀴즈 문항, 해설, 결과, 실기 채점, 답안지 시트 —
 *    은 주소가 따로 없어 한 번도 열린 적이 없었다. 모의고사만 우연히
 *    들어가자마자 시작되는 구조라 검사에 걸렸을 뿐이다.
 *
 * 여기서는 손으로 눌러 그 화면까지 들어간 다음, 같은 잣대로 잰다.
 *   · 콘솔 오류·예외      · 가로 넘침
 *   · 글씨 대비(픽셀)      · 소리로 읽었을 때 (제목·이름·alt)
 *   · 누름 범위 24×24
 *
 *   node scratchpad/deep-states.js
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2",".ico":"image/x-icon",".txt":"text/plain",".wasm":"application/wasm",".webp":"image/webp",".mp3":"audio/mpeg"};
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
const lum = ([r,g,b]) => { const f=(v)=>{const c=v/255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
const ratio = (a,c) => { const [x,y]=[lum(a),lum(c)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

const PORT = 6400;
/** 화면을 덮는 겹창 안에서 단추를 찾는다 — 밖의 같은 이름에 속지 않게 */
const inModal = (p, name) =>
  p.locator('[class*="fixed"][class*="inset-0"]').last().getByRole("button", { name }).first();
const found = [];
let states = 0, measured = 0, skippedEmoji = 0;
/* 길을 놓쳤으면 조용히 지나가지 않는다 — 못 들어간 화면은 검사한 것이 아니다 */
const note2 = (m) => { found.push(`길 막힘 — ${m}`); console.log(`  ✗ 길 막힘 — ${m}`); };

/** 지금 보이는 화면을 같은 잣대로 잰다 */
async function check(p, label, theme) {
  states++;
  const seen = (await p.evaluate(() => (document.body.innerText||"").replace(/\s+/g," ").trim())).slice(0, 46);
  console.log(`  · [${theme}] ${label} — 「${seen}…」`);
  const got = await p.evaluate(() => {
    const vis = (el) => { const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
    const nameOf = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") ||
      (el.getAttribute("aria-labelledby") ? (document.getElementById(el.getAttribute("aria-labelledby"))?.textContent||"") : "") ||
      (el.innerText||"").trim()).trim();
    const lineBoxes = (el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const rs = [];
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.textContent.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const r of rg.getClientRects()) {
          if (r.width < 1 || r.height < 1) continue;
          rs.push({ x:Math.round(r.left), y:Math.round(r.top), w:Math.round(r.width), h:Math.round(r.height) });
        }
      }
      return rs;
    };
    const bad = [];

    // 가로 넘침
    const de = document.scrollingElement;
    if (de.scrollWidth > de.clientWidth + 1) bad.push(`가로로 ${de.scrollWidth - de.clientWidth}px 넘친다`);

    // 화면에 새어 나온 값
    const body = document.body.innerText || "";
    for (const m of ["undefined", "NaN", "[object Object]", "Infinity"])
      if (body.includes(m)) bad.push(`화면에 "${m}" 이 새어 나왔다`);

    // 소리로 읽었을 때
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(vis);
    if (!hs.some((h) => h.tagName === "H1")) bad.push("화면 제목(h1)이 없다");
    let prev = 0;
    for (const h of hs) { const lv = +h.tagName[1];
      if (prev && lv > prev + 1) bad.push(`제목 단계 건너뜀 h${prev}→h${lv} "${(h.innerText||"").trim().slice(0,14)}"`);
      prev = lv; }
    for (const el of document.querySelectorAll("button,a[href],[role=button]")) {
      if (!vis(el)) continue;
      if (!nameOf(el)) bad.push(`이름 없는 ${el.tagName === "A" ? "링크" : "단추"}`);
      // 누름 범위 (넓혀 둔 -m 여백까지 포함해 실제로 닿는 크기를 본다)
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const mx = Math.abs(parseFloat(cs.marginLeft)||0) + Math.abs(parseFloat(cs.marginRight)||0);
      const my = Math.abs(parseFloat(cs.marginTop)||0) + Math.abs(parseFloat(cs.marginBottom)||0);
      const w = r.width + (parseFloat(cs.marginLeft) < 0 ? mx : 0);
      const h = r.height + (parseFloat(cs.marginTop) < 0 ? my : 0);
      if (w < 24 || h < 24) bad.push(`누름 범위가 좁다 ${Math.round(w)}×${Math.round(h)} "${nameOf(el).slice(0,12)}"`);
    }
    for (const el of document.querySelectorAll("input,select,textarea")) {
      if (!vis(el) || el.type === "hidden") continue;
      const lab = el.labels && el.labels.length ? el.labels[0].textContent.trim() : "";
      if (!lab && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.getAttribute("title"))
        bad.push(`이름 없는 입력칸 <${el.tagName.toLowerCase()}>`);
    }
    for (const im of document.querySelectorAll("img")) if (!im.hasAttribute("alt")) bad.push("alt 없는 그림");

    // 대비 잴 글씨 모으기
    const cv = document.createElement("canvas"); cv.width = cv.height = 1;
    const c2 = cv.getContext("2d", { willReadFrequently: true });
    const toRGB = (c) => { c2.clearRect(0,0,1,1); c2.fillStyle="#000"; c2.fillStyle=c; c2.fillRect(0,0,1,1);
      const d = c2.getImageData(0,0,1,1).data; return [d[0],d[1],d[2],d[3]/255]; };
    const texts = []; let emoji = 0;
    for (const el of document.querySelectorAll("p, span, li, h1, h2, h3, button, a, td, th, pre, label")) {
      const t = (el.innerText||"").trim();
      if (!t || t.length < 2) continue;
      if (el.querySelector("p, span, div, button, a")) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight) continue;
      if (el.closest("[disabled],[aria-disabled='true']")) continue;
      if (/\p{Extended_Pictographic}/u.test(t)) { emoji++; continue; }
      const px = Math.round(r.left + Math.min(r.width/2, 40));
      const py = Math.round(r.top + r.height/2);
      const hit = document.elementFromPoint(px, py);
      if (!hit || (hit !== el && !el.contains(hit) && !hit.contains(el))) continue;
      const rects = lineBoxes(el);
      if (!rects.length) continue;
      const cs = getComputedStyle(el);
      texts.push({ t: t.slice(0,22), x:px, y:py, rects, rgb: toRGB(cs.color),
        size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight)||400 });
    }
    return { bad, texts, emoji };
  });
  skippedEmoji += got.emoji;

  // 글씨는 픽셀로 — 지정한 색이 아니라 칠해진 색을 본다
  if (got.texts.length) {
    const on = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
    /*
     * ⚠️ 글씨를 감췄다가 되돌릴 때 새로고침을 썼더니, 그 뒤의 화면들이 전부
     *    처음 화면으로 되돌아갔다. "문제 · 결과" 라고 적어 놓고 실제로는
     *    문제 고르는 화면을 재고 있었다 — 이름만 맞고 잰 것은 딴것이었다.
     *    넣은 규칙만 떼어 내 화면을 그대로 둔다.
     */
    const hide = await p.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important}" });
    await p.waitForTimeout(110);
    const off = PNG.sync.read(await p.screenshot({ clip:{x:0,y:0,width:390,height:844} }));
    const pick = (img,x,y) => { x=Math.max(0,Math.min(389,x)); y=Math.max(0,Math.min(843,y));
      const i=(img.width*y+x)<<2; return [img.data[i],img.data[i+1],img.data[i+2]]; };
    for (const it of got.texts) {
      const bg = pick(off, it.x, it.y);
      let ink = null, far = -1;
      for (const box of it.rects)
        for (let y = Math.max(0,box.y); y < Math.min(844, box.y+box.h); y++)
          for (let x = Math.max(0,box.x); x < Math.min(390, box.x+box.w); x++) {
            const i=(on.width*y+x)<<2, j=(off.width*y+x)<<2;
            const moved = Math.abs(on.data[i]-off.data[j])+Math.abs(on.data[i+1]-off.data[j+1])+Math.abs(on.data[i+2]-off.data[j+2]);
            if (moved < 12) continue;
            const q=[on.data[i],on.data[i+1],on.data[i+2]];
            const d=Math.abs(q[0]-bg[0])+Math.abs(q[1]-bg[1])+Math.abs(q[2]-bg[2]);
            if (d > far) { far = d; ink = q; }
          }
      const a = it.rgb[3] ?? 1;
      const fg = ink ?? [0,1,2].map((i) => it.rgb[i]*a + bg[i]*(1-a));
      const rr = ratio(fg, bg); measured++;
      const big = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
      const need = big ? 3 : 4.5;
      if (rr < need) got.bad.push(`대비 ${rr.toFixed(2)}:1 (${need}) — "${it.t}" ${Math.round(it.size)}px`);
    }
    await hide.evaluate((el) => el.remove()).catch(() => {});
    await p.waitForTimeout(80);
  }

  const uniq = [...new Set(got.bad)];
  if (uniq.length) for (const m of uniq) { found.push(`[${theme}] ${label} — ${m}`); console.log(`  ✗ [${theme}] ${label} — ${m}`); }
}

/*
 * 모의고사를 제출한다.
 *
 * ⚠️ 첫 문항에서는 "제출" 단추가 아직 없다 — 마지막 문항에 가야 나온다.
 *    처음에는 그것을 모르고 첫 화면에서 찾다가 "제출 단추를 찾지 못했다" 로
 *    끝냈다. 실제 사람이 그러듯 답안지 시트를 열어 거기서 제출한다.
 */
async function mockSubmit(p, T, 이름) {
  const sheet = p.getByRole("button", { name: /답안지/ }).first();
  if (!(await sheet.count())) return note2(`${이름} — 답안지 단추를 찾지 못했다`);
  await sheet.click(); await p.waitForTimeout(800);
  await check(p, `${이름} · 답안지 시트`, T);
  const go = inModal(p, /제출하기/);
  if (!(await go.count())) return note2(`${이름} — 답안지 시트에 제출하기가 없다`);
  await go.click(); await p.waitForTimeout(700);
  await check(p, `${이름} · 제출 확인`, T);
  const yes = inModal(p, /^제출$/);
  if (!(await yes.count())) return note2(`${이름} — 확인 창에 제출 단추가 없다`);
  await yes.click(); await p.waitForTimeout(2200);
  await check(p, `${이름} · 결과`, T);
}

module.exports = { serve, check, PORT };

if (require.main === module) (async () => {
  const srv = await serve("gisa/out", PORT);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const errs = [];

  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
    await ctx.addInitScript((t) => { try { localStorage.setItem("gisa:theme", t); } catch {} }, theme);
    const p = await ctx.newPage();
    p.on("pageerror", (e) => errs.push(`${theme} ${p.url().split(PORT)[1]} — 예외 ${String(e).slice(0,90)}`));
    p.on("console", (m) => { if (m.type()==="error") errs.push(`${theme} ${p.url().split(PORT)[1]} — ${m.text().slice(0,90)}`); });
    const go = async (u) => { await p.goto(`http://127.0.0.1:${PORT}${u}`, { waitUntil:"networkidle" }); await p.waitForTimeout(600); };
    const T = theme === "dark" ? "어둡" : "밝음";
    console.log(`\n━━━ ${T}`);

    // ── 문제 풀기: 문항 → 해설 → 결과
    await go("/quiz");
    await p.getByRole("button", { name: /문항 시작/ }).first().click(); await p.waitForTimeout(900);
    await check(p, "문제 · 문항", T);
    await p.getByRole("button").filter({ hasText: /^[1-4]/ }).first().click(); await p.waitForTimeout(700);
    await check(p, "문제 · 고른 뒤 해설", T);
    /*
     * ⚠️ 선지도 <button> 이다. /다음|결과/ 로 찾으면 "최악 적합의 결과다" 같은
     *    선지가 먼저 걸린다. 이동 단추는 이름이 통째로 "다음"·"채점 보기" 다.
     */
    let reached = false;
    for (let i = 0; i < 14; i++) {
      const nav = p.getByRole("button", { name: /^(다음|채점 보기)$/ }).first();
      if (!(await nav.count())) break;
      const last = /채점 보기/.test(await nav.innerText());
      await nav.click().catch(() => {}); await p.waitForTimeout(500);
      if (last) { reached = true; break; }
      const opt = p.getByRole("button").filter({ hasText: /^[1-4]/ }).first();
      if (await opt.count()) { await opt.click().catch(() => {}); await p.waitForTimeout(400); }
    }
    if (!reached) note2("문제 — 채점 화면까지 가지 못했다");
    else await check(p, "문제 · 채점", T);

    // ── 실기 연습: 적는 화면 → 채점 → 결과
    await go("/practical");
    const ps = p.getByRole("button", { name: /문항 시작|시작하기/ }).first();
    if (await ps.count()) { await ps.click(); await p.waitForTimeout(900); }
    await check(p, "실기 · 적는 화면", T);
    const box = p.locator("textarea").first();
    if (await box.count()) {
      await box.fill("정규화"); await p.waitForTimeout(250);
      const g = p.getByRole("button", { name: /채점|맞춰|확인/ }).first();
      if (await g.count()) { await g.click(); await p.waitForTimeout(700); await check(p, "실기 · 채점 결과", T); }
    }

    // ── 복습: 답 펼친 뒤
    await go("/concept/d-sdlc");
    const mk = p.getByRole("button", { name: /봤습니다/ }).first();
    if (await mk.count()) { await mk.click(); await p.waitForTimeout(500); }
    await check(p, "개념 · 봤다고 표시한 뒤", T);
    await go("/review");
    const open = p.getByRole("button", { name: /답 보기|펼치/ }).first();
    if (await open.count()) { await open.click(); await p.waitForTimeout(600); await check(p, "복습 · 답을 펼친 뒤", T); }

    // ── 필기 모의고사: 답안지 시트 → 제출 확인 → 결과
    await go("/mock");
    await p.getByRole("button", { name: /시작하기/ }).first().click().catch(()=>{});
    await p.waitForTimeout(1200);
    await mockSubmit(p, T, "필기 모의");

    // ── 실기 모의고사: 제출 → 결과
    await go("/practical/mock");
    await p.getByRole("button", { name: /시작하기/ }).first().click().catch(()=>{});
    await p.waitForTimeout(1200);
    await check(p, "실기 모의 · 시험 중", T);
    await mockSubmit(p, T, "실기 모의");

    await ctx.close();
  }

  const ue = [...new Set(errs)];
  if (ue.length) { console.log("\n━━━ 콘솔"); ue.slice(0,12).forEach((e) => { found.push(`콘솔 ${e}`); console.log(`  ✗ ${e}`); }); }

  console.log(`\n눌러야 나오는 화면 ${states}가지 · 글씨 ${measured}곳을 픽셀로 쟀다 (이모지 ${skippedEmoji}곳 건너뜀)`);
  console.log(found.length ? `걸린 것 ${found.length}건` : "✓ 이상 없음");
  await b.close(); srv.close();
})();
